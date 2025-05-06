import { Box } from "@mui/material";

const CenteredBox = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {children}
      </Box>
    </>
  );
};

export default CenteredBox;
