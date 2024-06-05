import { Avatar, Stack, Typography } from "@mui/material";
import React from "react";
import {
  Face as FaceIcon,
  AlternateEmail as UserIcon,
  CalendarMonth as CalenderIcon,
} from "@mui/icons-material";
import moment from "moment";

const Profile = () => {
  return (
    <Stack spacing={"10px"} direction={"column"} alignItems={"center"}>
      <Avatar
        sx={{
          width: 100,
          height: 100,
          objectFit: "contain",
          border: "2px solid black",
        }}
      />
      <ProfileCard heading={"bio"} text={"lorem fafsaf afasffas asfsahjlk"} />
      <ProfileCard
        heading={"username"}
        text={"kfjas;jasjf"}
        Icon={<UserIcon />}
      />
      <ProfileCard
        heading={"bio"}
        text={"Aman shrivastav"}
        Icon={<FaceIcon />}
      />
      <ProfileCard
        heading={"Joined"}
        text={moment("2023-11-04T18:30:00.000Z").fromNow()}
        Icon={<CalenderIcon />}
      />
    </Stack>
  );
};

const ProfileCard = ({ text, Icon, heading }) => (
  <Stack
    direction={"row"}
    alignItems={"center"}
    spacing={"1rem"}
    color={"white"}
    textAlign={"center"}
  >
    {Icon && Icon}
    <Stack>
      <Typography variant="body1">{text}</Typography>
      <Typography variant="caption" color={"gray"}>
        {heading}
      </Typography>
    </Stack>
  </Stack>
);

export default Profile;
