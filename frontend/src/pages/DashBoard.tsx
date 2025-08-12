import React, { useContext, useEffect, useState } from "react";
import { Add as PlusIcon } from "@mui/icons-material";
import { Box, Typography, Button, Grid } from "@mui/material";
import Stats from "../components/Status/Stats";
import { ServiceReqContext } from "../components/structure/serviceReq/ServiceReqProvider";
import RecentServiceReq from "../components/Status/RecentServiceReq";
import {
  listJobs,
  listServiceReqhm,
  listServiceReqpr,
} from "../services/allApi";
import Completed from "../components/Status/Completed";

const Dashboard: React.FC = () => {
  //! Role
  const userString: any = localStorage.getItem("authUser");
  const user: any = JSON.parse(userString);
  const { u_id, name, role } = user || {};
  console.log(u_id, name, role);

  const context = useContext(ServiceReqContext);
  if (!context) return null;
  const { openServiceReqModal } = context;

  const [loading, setLoading] = useState(true);

  const [serviceRequests, setServiceRequests] = useState([]);
  const [jobs, setJobs] = useState([]);

  const fetchServiceReq = async () => {
    try {
      if (role == "homeowner") {
        const response = await listServiceReqhm();
        const { data, success } = response.data;
        setServiceRequests(data);
      } else if (role == "provider") {
        const response = await listServiceReqpr();
        const { data, success } = response.data;
        setServiceRequests(data);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  const fetchJobs = async () => {
    try {
      const response = await listJobs();
      const { data, success } = response.data;
      setJobs(data);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchServiceReq();
    fetchJobs();
  }, []);
  return (
    <Box
      sx={{
        p: 3,
        background:" #0f172a", /* Dark base */
  backgroundImage: "radial-gradient(circle at 10% 20%, rgba(199, 92, 244, 0.1) 0%, transparent 20%)", 
        // background: "linear-gradient(135deg, #845ec2 0%, #d65db1 100%)",
        borderRadius: 2,
        // boxShadow: "0 4px 10px rgba(132, 94, 194, 0.5)",
        // color: "white",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          // border: "1px solid",
        }}
      >
        <Box>
          <Typography
           color="#ffffff"
           variant="h4" component="h1" gutterBottom>
            Welcome back, {user?.name} !
          </Typography>
          <Typography variant="body1" 
          color="#ffffff"
          >
            {role == "homeowner"
              ? "Manage your home services and track your requests"
              : "Manage your Jobs and track your Quotes"}
          </Typography>
        </Box>
        {role == "homeowner" && (
          <Button
            // component={Link}
            // to="/create-request"
            onClick={() => {
              openServiceReqModal();
              document.activeElement?.blur();
            }}
            variant="contained"
            startIcon={<PlusIcon />}
            sx={{
              backgroundColor:"white",
              color:"black",
              borderRadius: 1,
              boxShadow: 1,
              "&:hover": {
                boxShadow: 4,
                backgroundColor:"rgba(226, 228, 217, 0.9)"
              },
            }}
          >
            Create Request
          </Button>
        )}
      </Box>

      <Stats role={role} />

      <Grid
        container
        spacing={3}
        sx={{ display: "flex", justifyContent: "center" }}
      >
        <Grid size={{ xs: 12, sm: 12, md: 9, lg: 5 }}>
          <RecentServiceReq data={serviceRequests} />
        </Grid>

        <Grid size={{ xs: 12, sm: 12, md: 9, lg: 6 }}>
          <Completed data={jobs} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
