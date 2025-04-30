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

interface PricingTierProps {
  planName: string;
  monthlyRequests: string | number;
  maxImageSize: string;
  speed: string;
  apiKeyCount: string | number;
  idealFor: string;
  price?: string | number;
  isFeatured?: boolean;
  onSelect?: () => void;
  ctaText?: string;
  selected: boolean;
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
  selected = false,
  onSelect,
  ctaText,
}) => {
  return (
    <Card
      sx={{
        scale: selected ? "1" : "0.95",
        transition: "scale 100ms ease-in",
        borderRadius: "40px",
        overflow: "hidden",
        isolation: "isolate",
        boxShadow: "0 0 200px 1px rgba(232,215 , 255 ,0.2)",
        position: "relative",
      }}
    >
      <CardActionArea
        onClick={onSelect}
        sx={{
          bgcolor: selected ? "transparent" : "rgba(255 , 255 ,255 , 0.01)",
          minWidth: 280, // Slightly wider for better readability
          minHeight: 350, // Adjust height as needed
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          ...(isFeatured && {
            border: "2px solid primary.main",
            boxShadow: (theme) => theme.shadows[5],
          }),
          border: `5px solid ${selected ? "#ded3ff" : "transparent"}`,
          transition: "border-color 100ms ease-in-out",
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
          }}
        >
          <Box>
            <Typography
              gutterBottom
              variant="h6"
              component="div"
              fontWeight="bold"
              textAlign={"center"}
              color={"inherit"}
            >
              {planName}
            </Typography>
            <Typography
              variant="h4"
              component="div"
              color="primary"
              gutterBottom
              textAlign={"center"}
              sx={{
                my: "1rem",
                color: "inherit",
                fontWeight: "bold",
              }}
            >
              {price !== undefined ? `₹ ${price}` : "Free"}
              <Typography ml={0.5} display="inline" color={"inherit"}>
                {price !== undefined && "/month"}
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
                    <CustomCheckIcon selected={selected} />
                  </ListItemIcon>
                  <ListItemText
                    primary={`Up to ${monthlyRequests} Monthly Requests`}
                  />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon>
                    <CustomCheckIcon selected={selected} />
                  </ListItemIcon>
                  <ListItemText primary={`Max Image Size: ${maxImageSize}`} />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon>
                    <CustomCheckIcon selected={selected} />
                  </ListItemIcon>
                  <ListItemText primary={`Speed: ${speed}`} />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon>
                    <CustomCheckIcon selected={selected} />
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
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

const PricingTiers: React.FC<{
  onSelectChange: (
    value: typeof usersTable.$inferSelect.subscriptionType
  ) => void;
  selectedTier: string;
}> = ({ onSelectChange, selectedTier }) => {
  return (
    <>
      <PricingTier
        selected={selectedTier === "free"}
        planName="Free"
        monthlyRequests={50}
        maxImageSize="< 5MB"
        speed="Slow"
        apiKeyCount={1}
        idealFor="Casual users, basic extension features"
        price={0}
        ctaText="Get Started"
        onSelect={() => onSelectChange("free")}
      />
      <PricingTier
        selected={selectedTier === "starter"}
        planName="Starter"
        monthlyRequests={200}
        maxImageSize="< 10MB"
        speed="Standard"
        apiKeyCount={1}
        idealFor="Regular users, lightweight automation"
        price={199}
        ctaText="Upgrade to Starter"
        onSelect={() => onSelectChange("starter")}
      />
      <PricingTier
        selected={selectedTier === "pro"}
        planName="Pro"
        monthlyRequests="3 x 500"
        maxImageSize="< 15MB"
        speed="Fast"
        apiKeyCount={3}
        idealFor="Power users, advanced features"
        price={399}
        ctaText="Go Pro"
        onSelect={() => onSelectChange("pro")}
        isFeatured={true}
      />
    </>
  );
};

export default PricingTiers;
