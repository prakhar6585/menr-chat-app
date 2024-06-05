import { useInputValidation } from "6pp";
import {
  Avatar,
  Button,
  Container,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Navigate } from "react-router-dom";

const isAdmin = true;

const AdminLogin = () => {
  const secretKey = useInputValidation("");

  const submitHandler = (e) => {
    e.preventDefault();
  };
  if (isAdmin) return <Navigate to="/admin/dashboard" />;
  return (
    <div
      style={{
        backgroundImage: "linear-gradient(rgb(255 255 209),rgb(249 159 159))",
      }}
    >
      <Container
        component={"main"}
        maxWidth="xs"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {
            <>
              <Typography variant="h5">Admin Login</Typography>
              <form
                style={{ width: "100%", marginTop: "1rem" }}
                onSubmit={submitHandler}
              >
                <TextField
                  required
                  fullWidth
                  label="Secret Key"
                  margin="normal"
                  variant="outlined"
                  value={secretKey.value}
                  onChange={secretKey.changeHandler}
                />
                <Button
                  sx={{ marginTop: "1rem" }}
                  variant="contained"
                  fullWidth
                  color="primary"
                  type="submit"
                >
                  Login
                </Button>
              </form>
            </>
          }
        </Paper>
      </Container>
    </div>
  );
};

export default AdminLogin;
