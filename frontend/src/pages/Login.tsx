import React, { useState } from "react";
import {
  Grid,
  Typography,
  Paper,
  Avatar,
  Button,
  TextField,
  Link,
  Box,
  Divider,
} from "@mui/material";
import { Home } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/allApi";
import { toast } from "react-toastify";

export default function Login() {
  const navigate = useNavigate();
  // const [message, setMessage] = useState<string | null>(null);
  // const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await loginUser(formData);
      console.log("Submitting", formData);

      toast.success(response.data.msg || "Login successful");

      // Save token and user info to localStorage
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("authUser", JSON.stringify(response.data.user));

      //! Redirect to dashboard after login
      navigate("/hmdashboard");
    } catch (error: any) {
      console.log("ERROR is",error)
      toast.error(error?.data?.msg || "Login failed");

    }
  };

  return (
    <Box>
      <Grid container component="main" sx={{ height: "100vh" }}>
        {/* Left side banner */}
        <Grid
          size={{ lg: 8, xs: false, sm: "grow", md: 7 }}
          sx={{
            display: { xs: "none", lg: "block" },
            backgroundImage: "url(https://source.unsplash.com/random?home)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 1,
            },
          }}
        >
          <Box
            sx={{
              position: "relative",
              zIndex: 2,
              p: 8,
              color: "white",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              HomeHero
            </Typography>
            <Typography variant="h5" gutterBottom>
              "Welcome back! Please login to your homeowner account." "Service
              providers, sign in to manage your requests."
            </Typography>
            <Divider sx={{ my: 3, bgcolor: "rgba(255,255,255,0.5)" }} />
            <Typography>
              "Access your dashboard and manage your home service requests."
              "Keep track of your jobs and quotes easily.
            </Typography>
          </Box>
        </Grid>

        {/* Right side form */}
        <Grid
          size={{ xs: 12, sm: "grow", md: 12, lg: 4 }}
          component={Paper}
          elevation={6}
          square
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              my: 8,
              mx: 4,
              width: "100%",
              maxWidth: 400,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <Home />
            </Avatar>
            <Typography component="h1" variant="h5">
              Login
            </Typography>

            {/* Login Form */}
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 3 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>

              {/* <Link href="#" variant="body2" display="block" textAlign="center">
                Forgot password?
              </Link> */}

              <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
                Don't have an account?{" "}
                <Link href="/" variant="body2">
                  Register
                </Link>
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
