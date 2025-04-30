import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";

const ProfileImage = ({
  src,
  altText,
  accentColor = "#ffffff",
}: {
  src: string | null | undefined;
  altText: string;
  accentColor?: string;
}) => {
  return (
    <>
      <Box
        sx={{
          display: "grid",
          gridTemplateAreas: `
            "Profile"
          `,
          alignItems: "center",
          justifyContent: "center",
        }}
        className="ink-profile-image"
      >
        <Avatar
          src={src ?? undefined}
          alt={altText}
          sx={{
            fontSize: "2rem",
            width: "7rem",
            height: "7rem",
            aspectRatio: 1,
            flexShrink: 0,
            zIndex: 1,
            gridArea: "Profile",
          }}
          className="ink-profile-avatar"
        >
          {altText?.slice(0, 1).toUpperCase()}
        </Avatar>
      </Box>
    </>
  );
};

export default ProfileImage;
