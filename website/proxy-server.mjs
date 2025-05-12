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
  const TARGET_PORT = Number(process.env.TARGET_PORT) || 3000;

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
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type, Cookie, x-api-key",
    },
  });

  // INTERCEPTING RESPONSE
  proxy.on("proxyRes", (proxyRes, req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, PUT, PATCH, POST, DELETE, OPTIONS"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Cookie, x-api-key"
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");

    proxyRes.headers["set-cookie"]?.forEach((headerValue) => {
      res.setHeader("Set-Cookie", headerValue);
    });
  });

  // IMPLEMENTING RATE LIMITER
  const apiRateLimitingMiddleware = rateLimiter({
    windowMs: 15 * 60_000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message:
      "Too many requests from this IP, please try again in a few minutes",
  });

  // BLACKLISTING SUSPECT IPs
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

  // Handling OPTIONS (CORS Preflight)
  app.use((req, res, next) => {
    if (req.method === "OPTIONS") {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, PUT, PATCH, POST, DELETE, OPTIONS"
      );
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Cookie, x-api-key"
      );
      res.setHeader("Access-Control-Allow-Credentials", "true");
      return res.sendStatus(204);
    }
    next();
  });

  // MAIN REQUEST HANDLING
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
      console.log("Unable to get client IP details");
    }

    proxy.web(req, res, {
      target: `http://localhost:${TARGET_PORT}/`,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Cookie, x-api-key",
      },
    });
  });

  app.listen(80, () => {
    console.log(
      `Reverse proxy server is running on port 80 of your local machine, forwarding requests to a server running on port 3000.\n\nVisit URL: http://localhost\n`
    );
  });
}

main();
