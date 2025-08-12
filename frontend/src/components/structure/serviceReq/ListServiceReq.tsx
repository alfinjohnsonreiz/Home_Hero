import { useEffect, useState } from "react";
import ServiceReq from "./ServiceReq";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Paper,
  Chip,
  Tooltip,
  Stack,
  CardMedia,
  useTheme,
} from "@mui/material";
import LoopIcon from "@mui/icons-material/Loop";
import CategoryIcon from "@mui/icons-material/Category";
import DescriptionIcon from "@mui/icons-material/Description";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import {
  deleteServiceReq,
  listServiceReqhm,
  listServiceReqpr,
} from "../../../services/allApi";
import { toTitleCase } from "../../../utils/stringUtils";
import { toast } from "react-toastify";

const categoryColors: Record<
  string,
  "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"
> = {
  plumbing: "primary",
  electrical: "warning",
  carpentry: "success",
  cleaning: "info",
  other: "default",
};

const ListServiceReq = () => {
  //! Role
  const userString: any = localStorage.getItem("authUser");
  const user: any = JSON.parse(userString);
  const { u_id, name, role } = user || {};

  const theme = useTheme();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedServiceReq, setSelectedServiceReq] = useState<any>(null);

  const updateStatus = (s_id: number, quoteId: number) => {
    const updatedData: any = data.map((item: any) => {
      if (item.s_id === s_id) {
        // Update the matching quote's status inside the quotes array
        const updatedQuotes = item.quotes.map((quote: any) =>
          quote.q_id === quoteId ? { ...quote, status: "accepted" } : quote
        );

        return {
          ...item,
          quotes: updatedQuotes,
        };
      }

      return item;
    });

    setData(updatedData);
  };

  const updateAddingQuote = (serviceReqId: number, formData: any) => {
    const updateData: any = data.map((item: any) => {
      if (item.s_id == serviceReqId) {
        return {
          ...item,
          quotes: [...(item.quotes || []), formData],
        };
      }
      return item;
    });
    setData(updateData);
  };
  const deleting = async (serviceReqId: any) => {
    try {
      const response = await deleteServiceReq(serviceReqId);
      if (response.data.success) {
        toast.success(response.data.msg);
        const updatedDate = data.filter(
          (item: any) => item.s_id !== serviceReqId
        );
        setData(updatedDate);
        setSelectedServiceReq(null);
      }
    } catch (error: any) {
      const errMsg =
        error.response?.data?.msg ||
        error?.data?.msg ||
        error.msg ||
        "Something went wrong.";
      setError(errMsg);
      toast.error(errMsg);
    }
  };
  //! Fetching the service requests
  const fetching = async () => {
    try {
      if (role == "homeowner") {
        const response = await listServiceReqhm();
        const { success, data } = response.data;
        if (success) {
          setData(data);
          setError(null);
        } else {
          setError("Error Fetching Data");
        }
      } else if (role == "provider") {
        const response = await listServiceReqpr();
        const { success, data } = response.data;
        if (success) {
          const activeServices = data.filter(
            (serviceReq: any) => serviceReq.isActive == true
          );
          setData(activeServices);
          setError(null);
        } else {
          setError("Error Fetching Data");
        }
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
    fetching();
  }, []);

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

  if (selectedServiceReq) {
    return (
      <ServiceReq
        updateStatus={updateStatus}
        role={role}
        item={selectedServiceReq}
        goback={() => setSelectedServiceReq(null)}
        onDelete={deleting}
        updateAdding={updateAddingQuote}
      />
    );
  }

  return (
    <Box
      sx={{
        mx: "auto",
        p: 3,
        minHeight:"95dvh",
        display: "flex",
        justifyContent: "center",
        // border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        background: " #0f172a" /* Dark base */,
        backgroundImage:
          "radial-gradient(circle at 10% 20%, rgba(199, 92, 244, 0.1) 0%, transparent 20%)",

        // backgroundColor: "background.paper",
        // border:"1px solid"
      }}
    >
      {data.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <Typography color="white">No service requests found</Typography>
        </Paper>
      ) : (
        <Box
          sx={{
            // border: "1px solid",
            width: "100%",
            borderColor: "divider",
            borderRadius: 2,
          }}
        >
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <Typography
                variant="h5"
                fontWeight="bold"
                gutterBottom

                sx={{ color: "#f5f7fa" }}
              >
                Services so far..
              </Typography>
            </Grid>
            {data.map((item: any) => (
              <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6 }} key={item.s_id}>
                <Card
                  variant="outlined"
                  sx={{
                    cursor: "pointer",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "#1e293b",
                    color: "#f5f7fa",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 6,
                      backgroundColor: "#273450",
                    },
                  }}
                  onClick={() => setSelectedServiceReq(item)}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      mb={1}
                    >
                      <Box
                        sx={{
                          width: "100%",
                          display: "flex",
                          alignItems: "space-between",
                        }}
                      >
                        <Typography variant="h6" noWrap sx={{ flexGrow: 1,color: "#e0e7ff" }}>
                          {toTitleCase(item.title) || "Untitled Request"}
                        </Typography>
                        {role == "homeowner" && (
                          <Chip
                            label={item.isActive ? "active" : "completed"}
                            sx={{
                              color: item.isActive
                                ? "success.dark"
                                : "primary.main",
                            }}
                            size="small"
                          />
                        )}
                      </Box>
                    </Stack>

                    <Stack spacing={3} direction={"row"}>
                      <Stack spacing={1}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <DescriptionIcon fontSize="small" color="action" />
                          <Typography
                            variant="body2"
                            fontWeight="medium"
                            sx={{ color: "#94a3b8" }}
                          >
                            Description:
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#94a3b8" }} noWrap>
                            {item.description.length > 40
                              ? item.description.slice(0, 40) + "..."
                              : item.description}
                          </Typography>
                        </Stack>

                        <Stack direction="row" alignItems="center" spacing={1}>
                          <CategoryIcon fontSize="small" color="action" />
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            fontWeight="medium"
                            sx={{ color: "#94a3b8" }}
                          >
                            Category:
                          </Typography>
                          <Chip
                            label={item.category}
                            size="small"
                            color={categoryColors[item.category] || "default"}
                            sx={{ textTransform: "capitalize" }}
                          />
                        </Stack>

                        <Stack direction="row" alignItems="center" spacing={1}>
                          <LocationOnIcon fontSize="small" color="action" />
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            fontWeight="medium"
                            sx={{ color: "#94a3b8" }}
                          >
                            Location:
                          </Typography>
                          <Tooltip title={item.location}>
                            <Typography
                              variant="body2"
                              sx={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                maxWidth: 150,
                                cursor: "default",
                                 color: "#94a3b8"
                              }}
                            >
                              {item.location}
                            </Typography>
                          </Tooltip>
                        </Stack>
                      </Stack>
                      <Stack direction={"row"} spacing={1}>
                        {item.urgent && (
                          <Tooltip
                            title="Urgent request"
                            sx={{ height: "2rem" }}
                          >
                            <PriorityHighIcon color="error" />
                          </Tooltip>
                        )}
                        {item.isRecurring && (
                          <Chip
                            icon={<LoopIcon />}
                            label="Recurring"
                            color="secondary"
                            variant="outlined"
                            size="medium"
                          />
                        )}
                      </Stack>
                    </Stack>
                    <Stack spacing={1}>
                      {item.photos.length > 0 && (
                        <Box p={2}>
                          <Grid container spacing={2}>
                            {item.photos.map((photo: string, index: number) => (
                              <Grid size={{ xs: 6, md: 4 }} key={index}>
                                <CardMedia
                                  component="img"
                                  height="140"
                                  src={photo}
                                  image={`http://localhost:4040/uploads/${photo}`} // Change base URL as needed
                                  alt={`Photo ${index + 1}`}
                                  sx={{ borderRadius: 2 }}
                                />
                              </Grid>
                            ))}
                          </Grid>
                        </Box>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default ListServiceReq;
