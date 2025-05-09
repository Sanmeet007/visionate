import Box from "@mui/material/Box";

const Flexbox = ({
  sx,
  children,
  ...props
}: {
  sx?: object;
  children: React.ReactNode;
}) => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          ...sx,
        }}
        {...props}
      >
        {children}
      </Box>
    </>
  );
};

export default Flexbox;
