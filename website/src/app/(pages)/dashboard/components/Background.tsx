import Box from "@mui/material/Box";

const Background = () => {
  return (
    <>
      <Box
        sx={{
          gridArea: "1/2",
        //   bgcolor: (theme) => theme.customProps.maskBgColor,
          backgroundImage: (theme) =>
            `url(/images/dashboard-bg.png)`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      ></Box>
    </>
  );
};

export default Background;
