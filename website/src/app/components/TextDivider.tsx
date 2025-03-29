"use client";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const TextDivider = ({
  text,
  gap = "1rem",
  my = "1rem",
}: {
  text: string;
  gap?: string;
  my?: string;
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        my,
        gap,
        alignItems: "center",
        "& > .__div": {
          flexBasis: "100%",
        },
        // "&  .__divider  ": {
        //   bgcolor: (theme) =>
        //     theme.customProps.colorMode === "dark" ? "#333333" : "#a8a8a8",
        // },
      }}
    >
      <Box className="__div">
        <Divider className="__divider" />
      </Box>
      <Typography
        variant="subtitle2"
        className="__text"
        sx={{
          color: "InactiveCaptionText",
          flexShrink: "0",
        }}
      >
        {text}
      </Typography>
      <Box className="__div">
        <Divider className="__divider" />
      </Box>
    </Box>
  );
};

export default TextDivider;
