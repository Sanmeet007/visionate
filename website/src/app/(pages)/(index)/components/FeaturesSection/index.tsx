import { Box, Card, CardContent, Typography } from "@mui/material";
import { desc } from "drizzle-orm";
import { title } from "process";

const FeaturesSection = () => {
  return (
    <>
      <Box component={"section"}>
        <Typography
          variant="h5"
          component="h2"
          textAlign={"center"}
          id="features"
          sx={{
            mb: "3rem",
          }}
        >
          Core Capabilities
        </Typography>
        <Box id="features">
          <Box
            sx={{
              bgcolor: "rgba(255 ,255, 255, 0.05)",
              borderRadius: "80px",
              maxWidth: "calc(1100px - 4rem)",
              mx: "auto",
              mb: "3rem",
              display: "grid",
              gridTemplateColumns: "repeat(3 , 1fr)",
              gap: "1rem",
              p: "1rem",
              "@media screen and (max-width: 900px)": {
                gridTemplateColumns: "repeat(2 , 1fr)",
              },
              "@media screen and (max-width: 600px)": {
                gridTemplateColumns: "repeat(1 , 1fr)",
              },
            }}
          >
            {[
              {
                color: "white",
                bgcolor: "rgb(255, 144, 160)",
                title: "AI-Powered Image Captioning",
                description:
                  "Generate accurate and detailed captions for your images using advanced AI algorithms.",
                bgimage: "1.svg",
              },
              {
                color: "black",
                bgcolor: "rgb(255, 232, 167)",
                title: "Seamless Chrome Integration",
                description:
                  "Effortlessly integrate with your Chrome browser for a smooth experience.",
                bgimage: "2.svg",
              },
              {
                color: "#c6e7ff",
                bgcolor: "rgb(66, 72, 124)",
                title: "Usage Control via Pricing Tiers",
                description:
                  "Control your usage and costs with flexible pricing tiers.",
                bgimage: "3.svg",
              },
            ].map((item, index) => (
              <Box
                key={index}
                sx={{
                  p: "1rem",
                  textAlign: "center",
                }}
              >
                <Card
                  sx={{
                    background: `url(/images/features/${item.bgimage})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    bgcolor: item.bgcolor,
                    borderRadius: "80px",
                    alignItems: "center",
                    justifyContent: "center",
                    aspectRatio: "1/1",
                    display: "grid",
                    placeContent: "center",
                    color: item.color,
                    "@media screen and (max-width: 600px)": {
                      aspectRatio: "auto",
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      display: "flex",
                      gap: "1rem",
                      flexDirection: "column",
                    }}
                  >
                    <Typography variant="h5" component={"h3"}>
                      0{index + 1}
                    </Typography>
                    <Typography variant="h5">{item.title}</Typography>
                    <Typography variant="body2">{item.description}</Typography>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default FeaturesSection;
