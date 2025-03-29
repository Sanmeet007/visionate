import { Box } from "@mui/material";

const DecorationImage = () => {
  return (
    <>
      <Box
        sx={{
          position: "absolute",
          top: "20vh",
          right: "0",
          backgroundImage: "url(/images/iris.png)",
          backgroundSize: "300px 300px",
          backgroundPositionX: "80px",
          backgroundRepeat: "no-repeat",
          width: "300px",
          height: "300px",
        }}
      ></Box>
    </>
  );
};

export default DecorationImage;
