import express from "express";
import httpProxy from "http-proxy";
import dotenv from "dotenv";
import { isIP } from "is-ip";
import requestIp from "request-ip";
import rateLimiter from "express-rate-limit";
import { IpFilter } from "express-ipfilter";
import ipStore from "./ip_store.mjs";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import _ from "lodash";

async function main() {
  dotenv.config({
    path: ".env",
  });
  const { createProxyServer } = httpProxy;

  const ORIGIN = process.env.PROXY_ORIGIN;
  const TARGET_PORT = 3000;

  const getIpDetails = _.memoize(async (ip) => {
    if (isIP(ip)) {
      const fetch_res = await fetch(
        `https://apiip.net/api/check?ip=${ip}&accessKey=${process.env.APIIP_API_KEY}`
      );
      const fetch_data = await fetch_res.json();
      return fetch_data;
    } else {
      throw Error("Invalid IP");
    }
  });

  const app = express();
  app.set("trust proxy", 1);
  app.use(
    morgan(":method :url :status :res[content-length] - :response-time ms")
  );

  const proxy = createProxyServer({
    changeOrigin: true,
    headers: {
      "Access-Control-Allow-Origin": ORIGIN,
    },
  });

  // INTERCEPTING RESPONSE
  proxy.on("proxyRes", (proxyRes, req, res) => {
    res.setHeader("Access-Control-Allow-Origin", ORIGIN);
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, PUT, PATCH, POST, DELETE"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Cookie");
    res.setHeader("Access-Control-Allow-Credentials", true);

    proxyRes.headers["set-cookie"]?.forEach((headerValue) => {
      res.setHeader("Set-Cookie", headerValue);
    });
  });

  // IMPLEMENTING RATE LIMITER BASIC REQUESTS
  const apiRateLimitingMiddleware = rateLimiter({
    windowMs: 15 * 60_000, // 30 minutes
    max: 100, // limit each IP to 1000 request per windowMs,
    message:
      "Too many requests from this IP, please try again in a few minutes",
  });

  // BLACKLISTING SUS IPS
  const blacklistedIps = await ipStore.getBlackListedIps();

  const ipFilterMiddleware = IpFilter(blacklistedIps, {
    mode: "deny",
    logLevel: "deny",
  });

  // REGISTERING COOKIE PARSER
  app.use(cookieParser());

  // REGISTERING MIDDLEWARES
  app.use(ipFilterMiddleware);
  app.use("/api", apiRateLimitingMiddleware);

  app.use(async (req, res) => {
    try {
      const ip = requestIp.getClientIp(req);
      const hasIp = await ipStore.hasIp(ip);
      if (!hasIp) {
        const clientIpDetails = await getIpDetails(ip);
        await ipStore.registerClient(ip, {
          ...clientIpDetails,
          ip: ip,
        });
      }
    } catch (e) {
      console.log("Unable to get client ip details");
    }

    if (req.method === "OPTIONS") {
      res.setHeader("Access-Control-Allow-Origin", ORIGIN);
      res.writeHead(204);
      return res.end();
    } else {
      proxy.web(req, res, {
        target: `http://localhost:${TARGET_PORT}/`,
        headers: {
          "Access-Control-Allow-Origin": ORIGIN,
        },
      });
    }
  });

  app.listen(80, () => {
    console.log(
      `Reverse proxy server is running on port 80 of your local machine, forwarding requests to a server running on port 3000.\n\nVisit URL : http://localhost\n`
    );
  });
}

main();
