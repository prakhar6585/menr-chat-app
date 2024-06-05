import {
  Dialog,
  DialogTitle,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
} from "@mui/material";
import React from "react";
import { useInputValidation } from "6pp";
import { Search as SearchIcon } from "@mui/icons-material";
import UserItem from "../shared/UserItem";
import { useState } from "react";
import { sampleUsers } from "../../constants/sampleData";

const Search = () => {
  const search = useInputValidation("");
  const isLoadingSendFriendHandler = false;
  const [users, setUsers] = useState(sampleUsers);
  const addFriendHandler = (id) => {
    console.log(id);
  };
  return (
    <Dialog open>
      <Stack
        p={"2rem"}
        direction={"column"}
        width={"20rem"}
        borderRadius={"10px"}
      >
        <DialogTitle textAlign={"center"}>Find People</DialogTitle>
        <TextField
          label=""
          value={search.value}
          size="small"
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <List>
          {users.map((i) => (
            <UserItem
              user={i}
              key={i._id}
              handler={addFriendHandler}
              handlerIsLoading={isLoadingSendFriendHandler}
            />
          ))}
        </List>
      </Stack>
    </Dialog>
  );
};

export default Search;
