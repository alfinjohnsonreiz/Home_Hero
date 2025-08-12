import NavbarHomeowner from "../components/Navbarhomeowner";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import ServiceReqProvider from "../components/structure/serviceReq/ServiceReqProvider";
import CreateServiceReq from "../components/structure/serviceReq/CreateServiceReq";
import ReviewProvider from "../components/review/ReviewProvider";

const Layout = () => {
  const userString = localStorage.getItem("authUser");
  if (!userString) {
    return null;
  }
  const user = JSON.parse(userString);
  const { name, role } = user || {};
  return (
    <>
      <ServiceReqProvider>
        <ReviewProvider>
          <Box sx={{ display: "flex" }}>
            <NavbarHomeowner role={role} name={name} />
            <Box component="main" sx={{ 
              flexGrow: 1, p: 3 ,
              background:" #0f172a",
  backgroundImage: "radial-gradient(circle at 10% 20%, rgba(199, 92, 244, 0.1) 0%, transparent 20%)", 


              }}>
              <Outlet />
            </Box>
            {role === "homeowner" && <CreateServiceReq role={role} />}
          </Box>
        </ReviewProvider>
      </ServiceReqProvider>
    </>
  );
};

export default Layout;
