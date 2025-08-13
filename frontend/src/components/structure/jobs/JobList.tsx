import { useEffect, useState } from "react";
import {
  listJobs,
  makePay,
  markComplete,
  markPaid,
} from "../../../services/allApi";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Paper,
  Stack,
  Chip,
  Button,
  IconButton,
  Collapse,
} from "@mui/material";
import LoopIcon from "@mui/icons-material/Loop";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BuildIcon from "@mui/icons-material/Build";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import "react-toastify/dist/ReactToastify.css";
import ConfirmDialog from "../../confirmModal/ConfirmDialog";
import { blurActiveElement } from "../../../utils/blurActiveElement";
import { toast } from "react-toastify";
import EventIcon from "@mui/icons-material/Event";
import { toTitleCase } from "../../../utils/stringUtils";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ChatIcon from "@mui/icons-material/Chat";
import { Tooltip } from "@mui/material";
import ChatWidget from "../../Chat/ChatWidget";

// const statusIconMap: Record<string, React.ReactNode> = {
//   completed: <CheckCircleIcon color="success" />,
//   pending: <HourglassEmptyIcon color="warning" />,
// };

const JobList = () => {
  //! Role
  const userString: any = localStorage.getItem("authUser");
  const user: any = JSON.parse(userString);
  const { role ,name} = user || {};

  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ! animation inside confirm dialog
  const [showJobAnimation, setShowJobAnimation] = useState(false);
  const [showPaymentAnimation, setShowPaymentAnimation] = useState(false);

  const fetchingJobs = async () => {
    try {
      const response = await listJobs();
      const { success, data } = response.data;
      if (success) {
        setJobs(data);
        setError(null);
      } else {
        setError("Failed to fetch jobs");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchingJobs();
  }, [jobs.length]);

  //! API for making job status
  const updating = async (jobId: any) => {
    try {
      if (role === "provider") {
        const response = await markComplete(jobId);
        const { data, success } = response.data;

        if (success) {
          toast.success(data.msg || "Job marked as complete successfully");
          setJobs((prevJobs: any) =>
            prevJobs.map((job: any) =>
              job.j_id == jobId ? { ...job, status: "completed" } : job
            )
          );
        } else {
          toast.error(data.msg || "Failed to mark job as complete");
        }
      }
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.msg ||
        error.msg ||
        error.message ||
        "An error occurred";
      console.log(errorMsg);
      toast.error(errorMsg);
    }
  };
  // Dialog for confirmation

  const [jobId, setJobId] = useState<number | null>(null);
  const [confirmdialogopen, setConfirmDialogOpen] = useState(false);
  const handleOpenConfirmDialog = (jobId: any) => {
    blurActiveElement();
    setJobId(jobId);
    setConfirmDialogOpen(true);
  };
  const handleCloseConfirmDialog = () => {
    setConfirmDialogOpen(false);
    blurActiveElement();
  };

  const handleOnConfirm = () => {
    updating(jobId);
    setShowJobAnimation(true); //!animation
    setTimeout(() => {
      setShowJobAnimation(false);
    }, 2000);

    handleCloseConfirmDialog();
  };

  // !API for payment status provider
  const updatePayment = async (jobId: any) => {
    try {
      if (role === "homeowner") {
        const response = await makePay(jobId);
        const { data, success } = response.data;

        if (success) {
          const options = {
            key: "rzp_test_gOuZoQ2fE5znQd",
            amount: data.amount,
            currency: "INR",
            name: "Test Payment",
            description: "Razorpay Test Transaction",
            order_id: data.id,
            handler: function (response: any) {
              toast.success("Payment Successful!");
              console.log(response);
            },
            theme: { color: "#3399cc" },
          };

          const rzp = new (window as any).Razorpay(options);
          rzp.open();

          const markResponse = await markPaid(jobId);
          if (markResponse.data.success) {
            setJobs((prevJobs: any) =>
              prevJobs.map((job: any) =>
                job.j_id == jobId ? { ...job, paymentStatus: "paid" } : job
              )
            );
            toast.success(markResponse.data.msg);
          }
        }
      }
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.msg ||
        error.msg ||
        error.message ||
        "An error occurred";
      console.log(errorMsg);
      toast.error(errorMsg);
    }
  };
  const [confirmPaymentOpen, setConfirmPaymentOpen] = useState(false);
  const handleOpenConfirmPayment = (jobId: any) => {
    setConfirmPaymentOpen(true);
    setJobId(jobId);
  };
  const handleCloseConfirmPayment = () => {
    setConfirmPaymentOpen(false);
  };
  const onConfirmPayment = () => {
    updatePayment(jobId);
    setShowPaymentAnimation(true); //!animation
    setTimeout(() => {
      setShowPaymentAnimation(false);
    }, 3000);
    setConfirmPaymentOpen(false);
  };

  //!expansion
  const [expandedJob, setExpandedJob] = useState(null);

  const handleExpandClick = (jobId: any) => {
    setExpandedJob(expandedJob === jobId ? null : jobId);
  };

  const [chatJobId, setChatJobId] = useState<number | null>(null);
  const handleOpenChat = (jobId: number) => {
    setChatJobId(jobId);
  };
  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box sx={{ maxWidth: 600, margin: "20px auto" }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );

  return (
    <Box
      sx={{
        mx: "auto",
        p: 3,
        minHeight: "95dvh",
        display: "flex",
        justifyContent: "center",
        background: " #0f172a" /* Dark base */,
        backgroundImage:
          "radial-gradient(circle at 10% 20%, rgba(199, 92, 244, 0.1) 0%, transparent 20%)",

        borderColor: "divider",
        // border: "1px solid",
      }}
    >
      {jobs.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <Typography>No Jobs Found</Typography>
        </Paper>
      ) : (
        <Box
          sx={{
            width: "100%",
            borderRadius: 2,
            // border: "1px solid"
          }}
        >
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <Typography
                variant="h5"
                fontWeight="bold"
                color="white"
                gutterBottom
              >
                Jobs so far..
              </Typography>
            </Grid>

            {jobs.map((job) => (
              <Grid size={{ xs: 12, lg: 6 }} key={job.j_id}>
                <Card
                  variant="outlined"
                  sx={{
                    // p: 1,
                    boxShadow: 1,
                    backgroundColor: "#1e293b",
                    color: "#f5f7fa",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 6,
                      backgroundColor: "#273450",
                    },
                  }}
                >
                  <CardContent>
                    <Stack spacing={2}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography
                          variant="h6"
                          // fontWeight="bold"
                          sx={{ flexGrow: 1 }}
                        >
                          {toTitleCase(job.servicerequest?.title) ||
                            "Untitled Request"}
                        </Typography>
                        {job.servicerequest?.urgent && (
                          <Chip
                            icon={<PriorityHighIcon />}
                            label="Urgent"
                            color="error"
                            size="small"
                          />
                        )}
                        {job.isRecurring && (
                          <Chip
                            icon={<LoopIcon />}
                            label="Recurring"
                            color="secondary"
                            variant="outlined"
                            size="small"
                          />
                        )}
                        <Stack p={1}>
                          <IconButton
                            color="primary"
                            sx={{
                              bgcolor: "#e8f5fe", // Light blue background
                              "&:hover": {
                                bgcolor: "#d0e3fc", // Darker on hover
                                transform: "scale(1.1)",
                              },
                              transition: "all 0.2s ease",
                            }}
                            onClick={() => handleOpenChat(job.j_id)}
                          >
                            <ChatIcon fontSize="medium" />
                          </IconButton>
                        </Stack>

                        <IconButton
                          onClick={() => handleExpandClick(job.j_id)}
                          size="small"
                        >
                          {expandedJob === job.id ? (
                            <ExpandLessIcon />
                          ) : (
                            <ExpandMoreIcon />
                          )}
                        </IconButton>
                      </Stack>

                      <Stack direction="row" spacing={2}>
                        <Chip
                          label={`Category: ${
                            job.servicerequest?.category || "N/A"
                          }`}
                          color="primary"
                          size="small"
                          variant="outlined"
                          sx={{ textTransform: "capitalize" }}
                        />
                        <Chip
                          label={`Payment: ${job.paymentStatus}`}
                          color={
                            job.paymentStatus === "paid"
                              ? "success"
                              : job.paymentStatus === "pending"
                              ? "warning"
                              : "default"
                          }
                          size="small"
                        />
                      </Stack>

                      {/* "scheduled" "completed" */}
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Typography
                          sx={{
                            fontWeight: "bold",
                            minWidth: 60,
                          }}
                          variant="body2"
                          color="white"
                        >
                          Status:
                        </Typography>

                        {role === "homeowner" &&
                          (job.status.toLowerCase() === "completed" ? (
                            <>
                              <TaskAltIcon color="success" fontSize="medium" />
                              <Typography
                                variant="body1"
                                sx={{
                                  textTransform: "capitalize",
                                  fontWeight: "600",
                                  color: "success.main",
                                }}
                              >
                                {job.status}
                              </Typography>
                            </>
                          ) : (
                            <Chip
                              sx={{ p: 1 }}
                              icon={<BuildIcon color="inherit" />}
                              label={job.status}
                              color="secondary"
                              variant="filled"
                              size="small"
                            />
                          ))}

                        {role === "provider" &&
                          (job.status.toLowerCase() === "completed" ? (
                            <>
                              <TaskAltIcon
                                color="success"
                                fontSize="medium"
                                sx={{ verticalAlign: "middle", mr: 1 }}
                              />
                              <Typography
                                variant="body1"
                                sx={{
                                  textTransform: "capitalize",
                                  fontWeight: 600,
                                  color: "success.main",
                                  display: "inline",
                                }}
                              >
                                {job.status}
                              </Typography>
                            </>
                          ) : job.status.toLowerCase() === "scheduled" ? (
                            <>
                              <EventIcon
                                color="info"
                                fontSize="medium"
                                sx={{ verticalAlign: "middle", mr: 1 }}
                              />
                              <Typography
                                variant="body1"
                                sx={{
                                  textTransform: "capitalize",
                                  fontWeight: 600,
                                  color: "info.main",
                                  display: "inline",
                                }}
                              >
                                {job.status}
                              </Typography>
                            </>
                          ) : (
                            <Typography
                              variant="body1"
                              sx={{
                                textTransform: "capitalize",
                                fontWeight: 600,
                              }}
                            >
                              {job.status}
                            </Typography>
                          ))}
                      </Stack>
                      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                        {/* provider making job as completed */}
                        {role === "provider" &&
                          job.status.toLowerCase() !== "completed" && (
                            <>
                              <Button
                                variant="contained"
                                color="success"
                                startIcon={<CheckCircleIcon />}
                                onClick={() =>
                                  handleOpenConfirmDialog(job.j_id)
                                }
                                sx={{
                                  textTransform: "none",
                                  borderRadius: "8px",
                                  px: 3,
                                  boxShadow: "0 2px 4px rgb(0,0,0,.1)",
                                }}
                              >
                                Mark as Completed
                              </Button>
                            </>
                          )}
                        {/* homeowner making payment as paid */}
                        {role === "homeowner" &&
                          job.paymentStatus === "pending" &&
                          job.status.toLowerCase() === "completed" && (
                            <>
                              <Button
                                variant="contained"
                                color="primary"
                                sx={{
                                  textTransform: "none",
                                  borderRadius: "8px",
                                  px: 3,
                                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                }}
                                onClick={() =>
                                  handleOpenConfirmPayment(job.j_id)
                                }
                              >
                                Pay ${job.price}
                              </Button>
                            </>
                          )}
                      </Stack>
                      {/* Collapsible details */}
                      <Collapse in={expandedJob === job.j_id}>
                        <Box
                          mt={1}
                          pl={2}
                          sx={{
                            mt: 2,
                            p: 3,
                            backgroundColor: "background.paper",
                            borderRadius: 2,
                            boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
                            borderLeft: "4px solid",
                            borderColor: "primary.main",
                            transition: "all 0.3s ease",
                          }}
                        >
                          <Grid container spacing={2}>
                            {role === "homeowner" && (
                              <Grid size={{ xs: 12, md: 6 }}>
                                <Box display="flex" alignItems="center">
                                  <PersonIcon color="action" sx={{ mr: 1 }} />
                                  <Typography variant="body1" color="black">
                                    <Box component="span" fontWeight="500">
                                      Provider:
                                    </Box>{" "}
                                    {job.providerprofile?.user?.name || "N/A"}
                                  </Typography>
                                </Box>
                              </Grid>
                            )}

                            <Grid size={{ xs: 12, md: 6 }}>
                              {job.isRecurring && (
                                <Stack spacing={1}>
                                  <Typography color="black">
                                    Recurrence frequency:{" "}
                                    {job?.recurrenceFrequency}
                                  </Typography>
                                  <Typography color="black">
                                    Recurrence interval:{" "}
                                    {job?.recurrenceInterval}
                                  </Typography>
                                  <Typography component="span" color="black">
                                    Provider Avaialble dates:
                                  </Typography>
                                  {job.providerAvailableDates?.map(
                                    (dateStr: string, idx: number) => (
                                      <Typography
                                        key={idx}
                                        variant="body2"
                                        color="black"
                                        component="span"
                                      >
                                        {dateStr}
                                      </Typography>
                                    )
                                  )}
                                </Stack>
                              )}
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                              <Box
                                display="flex"
                                alignItems="center"
                                color="black"
                              >
                                <CalendarTodayIcon
                                  color="action"
                                  sx={{ mr: 1 }}
                                />
                                <Box>
                                  <Typography variant="body1" color="black">
                                    <Box component="span" fontWeight="500">
                                      From:
                                    </Box>{" "}
                                    {job.startDate}
                                  </Typography>
                                  <Typography variant="body1" color="black">
                                    <Box component="span" fontWeight="500">
                                      To:
                                    </Box>{" "}
                                    {job.endDate}
                                  </Typography>
                                </Box>
                              </Box>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                              <Box display="flex" alignItems="center">
                                <AttachMoneyIcon
                                  color="action"
                                  sx={{ mr: 1 }}
                                />
                                <Typography variant="body1" color="black">
                                  <Box component="span" fontWeight="500">
                                    Price:
                                  </Box>{" "}
                                  ${job.quote?.price?.toLocaleString() || "N/A"}
                                </Typography>
                              </Box>
                            </Grid>
                          </Grid>
                        </Box>
                      </Collapse>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      <ConfirmDialog
        animationJob={showJobAnimation}
        open={confirmdialogopen}
        onClose={handleCloseConfirmDialog}
        onConfirm={handleOnConfirm}
        title="Completed Job!"
        content="Do you want to mark as complete"
        confirmText="Yes, go ahead"
        cancelText="No, cancel"
      />
      <ConfirmDialog
        animationPayment={showPaymentAnimation}
        open={confirmPaymentOpen}
        onClose={handleCloseConfirmPayment}
        onConfirm={onConfirmPayment}
        title="Payment Status!"
        content="Do you want to mark as Paid"
        confirmText="Yes, go ahead"
        cancelText="No, cancel"
      />
      {chatJobId && (
        <ChatWidget jobId={chatJobId} onClose={() => setChatJobId(null)}  username={name} role={role} visible={!!chatJobId}
/>
      )}
    </Box>
  );
};

export default JobList;
