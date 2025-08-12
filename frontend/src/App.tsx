import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import DashBoard from "./pages/DashBoard";
import ListServiceReq from "./components/structure/serviceReq/ListServiceReq";
import { ToastContainer } from "react-toastify";
import JobList from "./components/structure/jobs/JobList";
import PrivateRoute from "./components/privat_route/PrivateRoute";
import Layout from "./Layout/Layout";
import "react-toastify/dist/ReactToastify.css";
import Review from "./components/review/Review";
import Quote from "./components/structure/quotes/Quote";
import Payment from "./components/structure/payment/Payment";
import Profile from "./pages/Profile";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
  typography: {
    fontFamily: `'Montserrat', 'Roboto', 'Noto Sans', 'Arial', sans-serif`,
  },
});
function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ToastContainer />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Private route */}
          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route path="/hmdashboard" element={<DashBoard />} />
              <Route path="/hmServiceReqlist" element={<ListServiceReq />} />
              <Route path="/hmJoblist" element={<JobList />} />
              <Route path="/review" element={<Review />} />
              <Route path="/quotes" element={<Quote />} />
              <Route path="/payments" element={<Payment />} />
              <Route path="/account" element={<Profile />} />
            </Route>
          </Route>
        </Routes>
      </ThemeProvider>
    </>
  );
}

export default App;
