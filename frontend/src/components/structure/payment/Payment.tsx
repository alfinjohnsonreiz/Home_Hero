import { useEffect, useState } from "react";
import { listJobs } from "../../../services/allApi";
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Chip,
  useTheme,
} from "@mui/material";
// type Props = {};

const Payment = () => {
  // const [jobs, setJobs] = useState([]);
  //! Role
  const userString = localStorage.getItem("authUser");
  if (!userString) return null;
  const { role } = JSON.parse(userString);

  const [completedJobs, setCompletedJobs] = useState([]);
  const [scheduledJobs, setSchduledJobs] = useState([]);
  const [spent, setSpent] = useState(0);
  const theme = useTheme();

  const fetchingJobs = async () => {
    try {
      const response = await listJobs();
      const { data, success } = response.data;
      if (success) {
        const completed: any = data.filter(
          (job: any) => job.status == "completed"
        );
        const scheduled: any = data.filter(
          (job: any) => job.status == "scheduled"
        );

        let spented = completed.reduce((acc, job) => {
          return job.paymentStatus == "paid"
            ? acc + Number(job.price)
            : acc;
        }, 0);
        setCompletedJobs(completed);
        setSchduledJobs(scheduled);
        setSpent(spented);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchingJobs();
  }, []);
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getPaymentStatusChip = (status: string) => {
    let color: "success" | "error" | "warning" | "info" = "info";
    if (status === "paid") color = "success";
    else if (status === "pending") color = "warning";

    return (
      <Chip label={status} color={color} size="small" variant="outlined" />
    );
  };

  return (
    <>
      <Box sx={{ p: 3,minHeight:"95dvh" }}>
        <Paper elevation={3} sx={{ mb: 4, p: 3, borderRadius: 2 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ fontWeight: 600, color: theme.palette.primary.main }}
          >
            {role == "homeowner" ? "Total Spent " : "Total Earned "}{" "}
            {`$${spent}`}
          </Typography>
        </Paper>
        {/* completed jobs */}
        <Paper elevation={3} sx={{ mb: 4, p: 3, borderRadius: 2 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ fontWeight: 600, color: theme.palette.primary.main }}
          >
            Completed Jobs
          </Typography>

          {completedJobs.length > 0 ? (
            <TableContainer>
              <Table sx={{ minWidth: 500 }} aria-label="completed jobs table">
                <TableHead>
                  <TableRow sx={{ backgroundColor: theme.palette.grey[100] }}>
                    <TableCell sx={{ fontWeight: 600 }}>Job ID</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Start Date</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>End Date</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>
                      Payment Status
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">
                      Price
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {completedJobs.map((job: any) => (
                    <TableRow key={job.j_id} hover>
                      <TableCell>{job.j_id}</TableCell>
                      <TableCell>
                        {job.servicerequest?.title || "N/A"}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={job.servicerequest?.category || "N/A"}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{formatDate(job.startDate)}</TableCell>
                      <TableCell>{formatDate(job.endDate)}</TableCell>
                      <TableCell>
                        {getPaymentStatusChip(job.paymentStatus)}
                      </TableCell>
                      
                      <TableCell align="right">
                        <Typography fontWeight={500}>
                          ${job.price ? job.price : "N/A"}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box py={2}>
              <Typography color="text.secondary">
                No completed jobs found
              </Typography>
            </Box>
          )}
        </Paper>

        {/* Scheduled Jobs Section */}
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ fontWeight: 600, color: theme.palette.primary.main }}
          >
            Scheduled Jobs
          </Typography>

          {scheduledJobs.length > 0 ? (
            <TableContainer>
              <Table sx={{ minWidth: 500 }} aria-label="scheduled jobs table">
                <TableHead>
                  <TableRow sx={{ backgroundColor: theme.palette.grey[100] }}>
                    <TableCell sx={{ fontWeight: 600 }}>Job ID</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Start Date</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>End Date</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>
                      Payment Status
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">
                      Price
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {scheduledJobs.map((job: any) => (
                    <TableRow key={job.j_id} hover>
                      <TableCell>{job.j_id}</TableCell>
                      <TableCell>
                        {job.servicerequest?.title || "N/A"}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={job.servicerequest?.category || "N/A"}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{formatDate(job.startDate)}</TableCell>
                      <TableCell>{formatDate(job.endDate)}</TableCell>
                      <TableCell>
                        {getPaymentStatusChip(job.paymentStatus)}
                      </TableCell>
                      <TableCell align="right">
                        <Typography fontWeight={500}>
                          ${job.price ? job.price : "N/A"}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box py={2}>
              <Typography color="text.secondary">
                No scheduled jobs found
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </>
  );
};

export default Payment;
