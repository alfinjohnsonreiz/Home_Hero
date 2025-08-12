import { Grid } from "@mui/material";
import {
  AccessTime as ClockIcon,
  CheckCircle as CheckCircleIcon,
  AttachMoney as DollarSignIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import HandshakeIcon from "@mui/icons-material/Handshake";
import { Box, Typography, Paper, Avatar } from "@mui/material";
import {
  listJobs,
  listServiceReqhm,
  listServiceReqpr,
} from "../../services/allApi";
import LoopIcon from "@mui/icons-material/Loop";
import { useEffect, useState } from "react";
import { Skeleton } from "@mui/material";

type props = {
  role: string;
};
const Stats = ({ role }: props) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeCount, setActiveCount] = useState(0);
  const [completedJobsCount, setCompletedJobsCount] = useState(0);
  const [scheduledJobsCount, setScheduledobsCount] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [acceptQuote, setAcceptQuote] = useState(0);
  const [recurring, setRecurring] = useState(0);
  const fetchingServiceReq = async (role: any) => {
    try {
      let serviceRequests = [];
      let jobs = [];

      if (role === "homeowner") {
        const serviceReqResponse = await listServiceReqhm();
        const jobResponse = await listJobs();

        serviceRequests = serviceReqResponse.data?.data || [];
        jobs = jobResponse.data?.data || [];
        // Homeowner logic
        const active = serviceRequests.filter(
          (req: any) => req.isActive
        ).length;

        let spent = 0;
        jobs.forEach(
          (job: any) =>
            job.status === "completed" &&
            job.paymentStatus === "paid" &&
            (spent += parseFloat(job.price))
        );

        const scheduledJobsCount = jobs.filter(
          (job: any) => job.status !== "completed"
        ).length;
        const completedJobsCount = jobs.filter(
          (job: any) => job.status === "completed"
        ).length;

        const recurringJobCount = jobs.filter(
          (job: any) => job.isRecurring
        ).length;

        setActiveCount(active); //active req
        setCompletedJobsCount(completedJobsCount); //completed job
        setScheduledobsCount(scheduledJobsCount); //schedule jobs
        setTotalSpent(spent); // spent
        setRecurring(recurringJobCount);
      } else if (role === "provider") {
        const serviceReqResponse = await listServiceReqpr();
        const jobResponse = await listJobs(); //! fetches jobs related to provider

        const serviceRequests = serviceReqResponse.data?.data || [];
        const jobs = jobResponse.data?.data || [];
        console.log(jobs);

        // Active requests from serviceRequests
        const active = serviceRequests.filter(
          (req: any) => req.isActive
        ).length;

        const acceptedQuotes = serviceRequests.reduce((count, req) => {
          // only count if there are quotes in this service request
          if (Array.isArray(req.quotes) && req.quotes.length > 0) {
            count += req.quotes.filter(
              (quote: any) => quote.status === "accepted"
            ).length;
          }
          return count;
        }, 0);

        // Completed jobs from job list
        const completed = jobs.filter(
          (job: any) => job.status === "completed"
        ).length;

        // Scheduled (upcoming) jobs
        const upcoming = jobs.filter(
          (job: any) =>
            job.status === "scheduled" && new Date(job.startDate) > new Date()
        ).length;

        // Total earnings from completed jobs
        let earnings = 0;
        jobs.forEach((job: any) => {
          if (job.status === "completed") {
            earnings += parseFloat(job.price || 0);
          }
        });

        const recurringJobCount = jobs.filter(
          (job: any) => job.isRecurring
        ).length;

        setActiveCount(active); // active requests
        setCompletedJobsCount(completed); // completed jobs
        setScheduledobsCount(upcoming); // upcoming/scheduled jobs
        setTotalSpent(earnings); // provider's earnings
        setAcceptQuote(acceptedQuotes);
        setRecurring(recurringJobCount);
      }
    } catch (error: any) {
      setError(
        error.response?.data ||
          error.message ||
          "Failed to load service requests."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchingServiceReq(role);
  }, []);

  const items = [
    {
      icon: <ClockIcon color="primary" />,
      bgColor: "primary.light",
      title: "Active Requests",
      value: activeCount,
      roles: ["homeowner", "provider"],
    },
    {
      icon: <CheckCircleIcon color="success" />,
      bgColor: "success.light",
      title: "Completed Jobs",
      value: completedJobsCount,
      roles: ["homeowner", "provider"],
    },
    {
      icon: <DollarSignIcon color="warning" />,
      bgColor: "warning.light",
      title: "Total Spent",
      value: `₹${totalSpent.toLocaleString()}`,
      roles: ["homeowner"],
    },
    {
      icon: <DollarSignIcon color="warning" />,
      bgColor: "warning.light",
      title: "Total Earnings",
      value: `₹${totalSpent.toLocaleString()}`,
      roles: ["provider"],
    },
    {
      icon: <CalendarIcon color="secondary" />,
      bgColor: "secondary.light",
      title: "Upcoming / Scheduled",
      value: scheduledJobsCount,
      roles: ["homeowner", "provider"],
    },

    {
      icon: <HandshakeIcon color="success" />,
      bgColor: "black",
      title: "Quote Accepted",
      value: acceptQuote,
      roles: ["provider"],
    },
    {
      icon: <LoopIcon />,
      bgColor: "grey",
      title: " Active Recurring Jobs",
      value: recurring,
      roles: ["homeowner", "provider"],
    },
  ];

  return (
    <>
      <Grid
        container
        spacing={3}
        sx={{
          mb: 4,
          // border: "1px solid"
        }}
      >
        {items
          .filter((item) => item.roles.includes(role))
          .map((item, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Paper
                elevation={1}
                sx={{
                  p: 3,
                  height: "100%",
                  minHeight: 150,
                  display: "flex",
                  backgroundColor: "#1e293b",
                  borderColor:"#c75cf4",
                  flexDirection: "column",
                  justifyContent: "center",
                  "&:hover": {
                    boxShadow: 3,
                  },
                }}
              >
                {loading ? (
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Skeleton
                      variant="circular"
                      width={56}
                      height={56}
                      sx={{ mr: 2 }}
                    />
                    <Box sx={{ flexGrow: 1 }}>
                      <Skeleton variant="text" width="60%" height={24} />
                      <Skeleton variant="text" width="40%" height={32} />
                    </Box>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      flexGrow: 1,
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: item.bgColor,
                        mr: 2,
                        width: 56,
                        height: 56,
                      }}
                    >
                      {item.icon}
                    </Avatar>
                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          wordBreak: "break-word",
                          overflow: "hidden",
                          color:"#ffffff"
                        }}
                      >
                        {item.title}
                      </Typography>
                      <Typography
                        variant="h5"
                        component="div"
                        sx={{
                          wordBreak: "break-word",
                          overflow: "hidden",
                          color: "#94a3b8", fontSize: "0.875rem" 
                        }}
                      >
                        {item.value}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Paper>
            </Grid>
          ))}
      </Grid>
    </>
  );
};

export default Stats;
