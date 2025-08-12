import React, { useState } from "react";
import {
  Grid,
  Typography,
  Paper,
  Avatar,
  Button,
  TextField,
  Link,
  Tabs,
  Tab,
  Box,
  Divider,
  MenuItem,
} from "@mui/material";
import { Home, Construction } from "@mui/icons-material";
import { registerUser } from "../services/allApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

type User = "homeowner" | "provider" | null;

interface FormType {
  name: string;
  email: string;
  password: string;
  serviceCategory: ServiceCategory | "";
  skills: string;
  certification: string;
  contactNumber: number | string;
  address: string;
  role: User;
}
export const ServiceCategories = [
  "plumbing",
  "electrical",
  "carpentry",
  "cleaning",
] as const;

export type ServiceCategory = (typeof ServiceCategories)[number];

export default function Register() {
  const navigate = useNavigate();

  const [userType, setUserType] = useState<User>("homeowner");

  console.log("Typed user", userType);
  const [confirmPassword, setConfirmPassword] = useState("");
  // Form field states
  const [formData, setFormData] = useState<FormType>({
    name: "",
    email: "",
    password: "",
    serviceCategory: "",
    skills: "",
    certification: "",
    contactNumber: "",
    address: "",
    role: "homeowner",
  });
  const handleChangeTab = (_event: any, newValue: User) => {
    setUserType(newValue);
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value ,role:userType}));
   
  };
  const handlePasswordConfirm = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setConfirmPassword(e.target.value);
  };

  //! Submitting fomr
  //  const newFormData = { ...formData, role: userType };
  //   setFormData(newFormData); //-> do this before submitting form

  console.log("Role before form ", userType);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (formData.password !== confirmPassword) {
      toast.error("Password Mismatch");
      return;
    }

    console.log("Role in form data", formData.role);

    try {
      const response = await registerUser(formData);
      toast.success(response.data.msg);
      navigate("/login");
    } catch (error: any) {
      toast.error(error.data?.msg || error.data.msg || "Registration failed");
    }
  };

  return (
    <>
      <Box>
        <Grid container component="main" sx={{ height: "100%" }}>
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
              },
            }}
          >
            <Box
              sx={{
                position: "relative",
                zIndex: 1,
                p: 8,
                color: "white",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="h3"
                component="h1"
                gutterBottom
                sx={{ fontWeight: "bold" }}
              >
                HomeHero
              </Typography>
              <Typography variant="h5" gutterBottom>
                {userType === "homeowner"
                  ? "Find trusted professionals for all your home needs"
                  : "Connect with homeowners looking for your services"}
              </Typography>
              <Divider sx={{ my: 3, bgcolor: "rgba(255,255,255,0.5)" }} />
              <Typography>
                {userType === "homeowner"
                  ? "Join thousands of homeowners who have found reliable service providers for maintenance, repairs, and improvements."
                  : "Expand your business by connecting with homeowners actively seeking your expertise."}
              </Typography>
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6">Why choose HomeHero?</Typography>
                <ul>
                  <li>Verified professionals</li>
                  <li>Secure payments</li>
                  <li>Real reviews</li>
                  <li>24/7 support</li>
                </ul>
              </Box>
            </Box>
          </Grid>

          {/* Right side form */}
          <Grid
            size={{ xs: 12, sm: "grow", md: 12, lg: 4 }}
            component={Paper}
            elevation={6}
            square
          >
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                {userType === "homeowner" ? <Home /> : <Construction />}
              </Avatar>
              <Typography component="h1" variant="h5">
                Register as {userType}
              </Typography>

              {/* Role Tabs */}
              <Box sx={{ width: "100%", mt: 3 }}>
                <Tabs
                  value={userType}
                  onChange={handleChangeTab}
                  aria-label="user type tabs"
                  centered
                >
                  <Tab label="Homeowner" value="homeowner" icon={<Home />} />
                  <Tab
                    label="Service Provider"
                    value="provider"
                    icon={<Construction />}
                  />
                </Tabs>
              </Box>

              {/* Form Start */}
              <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ mt: 1, width: "100%" }}
              >
                {/* Shared Fields (Register Only) */}
                <>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="name"
                    label="Full Name"
                    name="name"
                    autoComplete="name"
                    autoFocus
                    value={formData.name}
                    onChange={handleChange}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
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
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={handlePasswordConfirm}
                  />
                </>
                {/* Role-specific Fields (Register Only) */}
                {userType === "provider" && (
                  <>
                    <TextField
                      select
                      margin="normal"
                      required
                      fullWidth
                      name="serviceCategory"
                      label="Service Category"
                      id="serviceCategory"
                      defaultValue=""
                      value={formData.serviceCategory}
                      onChange={handleChange}
                    >
                      {ServiceCategories.map((value) => (
                        <MenuItem key={value} value={value}>
                          {value.charAt(0).toUpperCase() + value.slice(1)}
                        </MenuItem>
                      ))}
                    </TextField>

                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="skills"
                      label="Skills"
                      id="skills"
                      value={formData.skills}
                      onChange={handleChange}
                    />

                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="certification"
                      label="Certification or License"
                      id="certification"
                      value={formData.certification}
                      onChange={handleChange}
                    />
                  </>
                )}
                {userType === "homeowner" && (
                  <>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="contactNumber"
                      label="Contact Number"
                      id="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleChange}
                    />
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="address"
                      label="Address"
                      id="address"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </>
                )}
                {/* Submit Button */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Register
                </Button>
                <Grid container>
                  {/* <Grid >
                 
                    <Link href="#" variant="body2">
                      Forgot password?
                    </Link>
                </Grid> */}
                  <Grid>
                    <Typography
                      variant="body2"
                      sx={{ mt: 2, textAlign: "center" }}
                    >
                      Already have an account?{" "}
                      <Link href="/login" variant="body2">
                        Log in
                      </Link>
                    </Typography>
                  </Grid>
                </Grid>
                {/* Footer */}
                <Box sx={{ mt: 5 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                  >
                    {"© "}
                    <Link color="inherit" href="/">
                      HomeHero
                    </Link>{" "}
                    {new Date().getFullYear()}
                  </Typography>
                  <Box
                    sx={{
                      mt: 3,
                      mb: 2,
                      textAlign: "center",
                      display: "flex",
                      justifyContent: "center",
                      gap: 1,
                    }}
                  ></Box>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
