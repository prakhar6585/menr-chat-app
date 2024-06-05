import { Menu } from "@mui/material";
import React from "react";

const FileMenu = ({ anchorE1 }) => {
  return (
    <Menu anchorEl={anchorE1} open={false}>
      <div style={{ width: "10rem" }}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores
        eaque dolore, voluptas odio molestias voluptatibus laudantium soluta
        saepe impedit aperiam.
      </div>{" "}
    </Menu>
  );
};

export default FileMenu;
