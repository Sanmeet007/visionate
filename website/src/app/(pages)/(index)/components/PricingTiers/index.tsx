"use client";

import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { CardActionArea, Divider } from "@mui/material";
import { usersTable } from "@/drizzle/schema";
import subscriptionPricing from "@/utils/sub-pricing";

interface PricingTierProps {
  planName: string;
  monthlyRequests: string | number;
  maxImageSize: string;
  speed: string;
  apiKeyCount: string | number;
  idealFor: string;
  price?: string | number;
  isFeatured?: boolean;
  ctaText?: string;
}

const CustomCheckIcon = ({ selected }: { selected: boolean }) => {
  return (
    <CheckCircleOutlineIcon
      sx={{
        color: selected ? "#AA7FE7" : "#DCC4FF",
      }}
    />
  );
};

const PricingTier: React.FC<PricingTierProps> = ({
  planName,
  monthlyRequests,
  maxImageSize,
  speed,
  apiKeyCount,
  idealFor,
  price,
  isFeatured = false,
  ctaText,
}) => {
  return (
    <Card
      sx={{
        transition: "scale 100ms ease-in",
        borderRadius: "40px",
        overflow: "hidden",
        isolation: "isolate",
        background:
          "linear-gradient(135deg,rgb(16, 0, 41) 30% ,rgb(35, 15, 75))",
        position: "relative",
      }}
    >
      <Box
        sx={{
          bgcolor: "rgba(255 , 255 ,255 , 0.01)",
          minWidth: 280, // Slightly wider for better readability
          minHeight: 350, // Adjust height as needed
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          ...(isFeatured && {
            border: "2px solid primary.main",
            boxShadow: (theme) => theme.shadows[5],
          }),
          transition: "border-color 100ms ease-in-out",
          p: "1rem",
        }}
      >
        <Box>
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            fontWeight="bold"
            textAlign={"center"}
            sx={{
              color: "#ffd2ca",
            }}
          >
            {planName}
          </Typography>
          <Typography
            variant="h4"
            component="div"
            gutterBottom
            textAlign={"center"}
            sx={{
              my: "1rem",
              fontWeight: "bold",
            }}
          >
            {price !== undefined ? `₹ ${price}` : "Free"}
            <Typography ml={0.5} display="inline" color={"secondary"}>
              {price !== undefined && "/ month"}
            </Typography>
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <List
              sx={{
                bgcolor: "rgba(255,255,255,0.05)",
                borderRadius: "20px",
                p: "1rem",
              }}
            >
              <ListItem disablePadding>
                <ListItemIcon>
                  <CustomCheckIcon selected={false} />
                </ListItemIcon>
                <ListItemText
                  primary={`Up to ${monthlyRequests} Monthly Requests`}
                />
              </ListItem>
              <ListItem disablePadding>
                <ListItemIcon>
                  <CustomCheckIcon selected={false} />
                </ListItemIcon>
                <ListItemText primary={`Max Image Size: ${maxImageSize}`} />
              </ListItem>
              <ListItem disablePadding>
                <ListItemIcon>
                  <CustomCheckIcon selected={false} />
                </ListItemIcon>
                <ListItemText primary={`Speed: ${speed}`} />
              </ListItem>
              <ListItem disablePadding>
                <ListItemIcon>
                  <CustomCheckIcon selected={false} />
                </ListItemIcon>
                <ListItemText
                  primary={`${apiKeyCount} API Key${
                    Number(apiKeyCount) > 1 ? "s" : ""
                  } Allowed`}
                />
              </ListItem>
            </List>
            <Divider />
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign={"center"}
            >
              {idealFor}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

const HeroPricingTiers = () => {
  return (
    <>
      <Box sx={{ mb: "4rem" }}>
        <Typography
          variant="h5"
          component="h2"
          textAlign={"center"}
          id="pricing"
          sx={{
            mb: "3rem",
          }}
        >
          Plans & Pricing
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3 , 1fr)",
            gap: "2rem",
            px: "2rem",
            maxWidth: "1100px",
            mx: "auto",
            my: "2rem",
          }}
        >
          <PricingTier
            planName="Free"
            monthlyRequests={50}
            maxImageSize="< 5MB"
            speed="Slow"
            apiKeyCount={1}
            idealFor="Casual users, basic extension features"
            price={subscriptionPricing.free.price}
            ctaText="Get Started"
          />
          <PricingTier
            planName="Starter"
            monthlyRequests={200}
            maxImageSize="< 10MB"
            speed="Standard"
            apiKeyCount={1}
            idealFor="Regular users, lightweight automation"
            price={subscriptionPricing.starter.price}
            ctaText="Upgrade to Starter"
          />
          <PricingTier
            planName="Pro"
            monthlyRequests="3 x 500"
            maxImageSize="< 15MB"
            speed="Fast"
            apiKeyCount={3}
            idealFor="Power users, advanced features"
            price={subscriptionPricing.pro.price}
            ctaText="Go Pro"
            isFeatured={true}
          />
        </Box>
      </Box>
    </>
  );
};

export default HeroPricingTiers;
