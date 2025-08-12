import React, { useContext, useEffect, useState } from "react";
import { listJobs } from "../../services/allApi";
import { toast } from "react-toastify";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  Rating,
  Stack,
  Typography,
} from "@mui/material";
import { ReviewContext } from "./ReviewProvider";
import CreateReview from "./CreateReview";

const Review = () => {
  //! Role
  const userString: any = localStorage.getItem("authUser");
  const user: any = JSON.parse(userString);
  const { u_id, name, role } = user || {};

  const context = useContext(ReviewContext);
  if (!context) return null;
  const { openReview } = context;
  const [jobs, SetJobs] = useState([]);
  // ! jobs fetching inside we have reviews
  const fetchingJobs = async () => {
    try {
      const response = await listJobs();
      const { data, success } = response.data;
      if (success) {
        const filteredData = data.filter(
          (job: any) => job.status === "completed"
        );
        SetJobs(filteredData);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const updatingReview = (jobId: any, formData: any) => {
    const updated: any = jobs.map((job: any) =>
      job.j_id == jobId
        ? {
            ...job,
            review: { comment: formData.comment, stars: formData.stars },
          }
        : job
    );
    console.log("Stars:", formData.stars, typeof formData.stars);

    SetJobs(updated);
  };

  useEffect(() => {
    fetchingJobs();
  }, []);

  const [jobId, setJobId] = useState<number | null>(null);
  const [hoverProvider, setHoverProvider] = useState(false);
  const [hoverJobDetails, setHoverJobDetails] = useState(false);

  // Color palette
  const colors = {
    primary: {
      light: "#e3f2fd",
      main: "#1976d2",
      dark: "#0d47a1",
    },
    secondary: {
      light: "#e8f5e9",
      main: "#4caf50",
      dark: "#2e7d32",
    },
    text: {
      primary: "#212121",
      secondary: "#757575",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
    border: "#e0e0e0",
    rating: "#ffb400",
  };

  return (
    <>
      <Container
        sx={{
          backgroundColor: colors.background.default,
          p: 3,
          borderRadius: 2,
          boxShadow: 3,
          minHeight:"95dvh",
           background: " #0f172a" /* Dark base */,
        backgroundImage:
          "radial-gradient(circle at 10% 20%, rgba(199, 92, 244, 0.1) 0%, transparent 20%)",

        }}
      >
        <Stack
          sx={{
            backgroundColor: colors.background.paper,
            padding: 3,
            borderRadius: 2,
            border: `1px solid ${colors.border}`,
            mb: 3,
            boxShadow: "0px 2px 4px rgba(0,0,0,0.05)",
          }}
        >
          {role == "homeowner" ? (
            <>
              {" "}
              <Typography
                variant="h6"
                gutterBottom
                sx={{ color: colors.primary.dark }}
              >
                📝 Share Your Experience
              </Typography>
              <Typography
                variant="body1"
                gutterBottom
                sx={{ color: colors.text.primary }}
              >
                Thank you for using our service! We'd love to hear your thoughts
                on the job completed by your service provider.
              </Typography>
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{
                  fontWeight: "bold",
                  mt: 2,
                  color: colors.primary.main,
                }}
              >
                ✨ How to write a helpful review:
              </Typography>
              <Typography
                variant="body2"
                component="ul"
                sx={{
                  pl: 2,
                  color: colors.text.secondary,
                }}
              >
                <li>Describe the quality of the service or work done.</li>
                <li>Mention if the task was completed on time.</li>
                <li>
                  Share your experience with communication and professionalism.
                </li>
                <li>Highlight what impressed you or what could be improved.</li>
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mt: 2,
                  color: colors.text.primary,
                }}
              >
                Honest reviews help fellow homeowners choose the right
                professionals.
              </Typography>
            </>
          ) : (
            <>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ color: colors.primary.dark }}
              >
                🌟 Your Reviews So Far
              </Typography>
              <Typography
                variant="body1"
                gutterBottom
                sx={{ color: colors.text.primary }}
              >
                See what homeowners have shared about your services. Their
                feedback reflects your professionalism and quality of work.
              </Typography>
            </>
          )}
        </Stack>

        {jobs.length == 0 ? (
          <Typography sx={{ color: colors.text.secondary }}>
            No completed jobs found
          </Typography>
        ) : (
          jobs.map((job: any) => (
            <Card
              key={job.j_id}
              sx={{
                mb: 3,
                 backgroundColor: "#1e293b",
                    color: "#f5f7fa",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 6,
                      backgroundColor: "#273450",
                    },
                border: `1px solid ${colors.border}`,
                // "&:hover": {
                //   boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
                // },
              }}
            >
              <CardContent>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      gutterBottom
                      sx={{ color: "white" }}
                    >
                      {job.servicerequest?.title || "Untitled Service Request"}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{ color: "#f5f7fa" }}
                      gutterBottom
                    >
                      Location: {job.servicerequest?.location}
                    </Typography>

                    <Typography
                      variant="body2"
                      gutterBottom
                      sx={{ color: "#f5f7fa"}}
                    >
                      Description: {job.servicerequest?.description}
                    </Typography>

                    <Typography
                      variant="body2"
                      gutterBottom
                      sx={{ color: "#f5f7fa" }}
                    >
                      Category: {job.servicerequest?.category}
                    </Typography>
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <Divider
                      sx={{
                        my: 1,
                        backgroundColor: colors.border,
                      }}
                    />
                  </Grid>

                  {role == "homeowner" ? (
                    <>
                      {" "}
                      <Grid
                        size={{ xs: 12, md: 4 }}
                        onClick={() => setHoverProvider(true)}
                        onDoubleClick={() => setHoverProvider(false)}
                        sx={{
                          cursor: "pointer",
                          backgroundColor: hoverProvider
                            ? colors.primary.light
                            : "transparent",
                          borderRadius: 1,
                          p: 1,
                          transition: "background-color 0.3s ease",
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          fontWeight={600}
                          sx={{ color: "#f5f7fa" }}
                        >
                          🧑‍🔧 Provider Info {hoverProvider ? "▼" : "▶"}
                        </Typography>

                        {hoverProvider && (
                          <Box sx={{ mt: 1, pl: 2 }}>
                            <Typography
                              variant="body2"
                              sx={{ color: "#f5f7fa" }}
                            >
                              Name: {job.providerprofile?.user?.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: "#f5f7fa" }}
                            >
                              Skills: {job.providerprofile?.skills}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: "#f5f7fa" }}
                            >
                              Certification:{" "}
                              {job.providerprofile?.certification}
                            </Typography>
                          </Box>
                        )}
                      </Grid>
                      <Divider
                        orientation="vertical"
                        flexItem
                        sx={{ backgroundColor: "gray", mx: 2 }}
                      />
                    </>
                  ) : (
                    <>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <Typography
                          variant="subtitle2"
                          fontWeight={600}
                          sx={{ color: "#f5f7fa" }}
                        >
                          Homeowner
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "#f5f7fa" }}
                        >
                          👤🏡 {job.homeownerprofile?.user?.name}
                        </Typography>
                      </Grid>
                    </>
                  )}

                  <Grid
                    size={{ xs: 12, md: 4 }}
                    onClick={() => setHoverJobDetails(true)}
                    onDoubleClick={() => setHoverJobDetails(false)}
                    sx={{
                      cursor: "pointer",
                      backgroundColor: hoverJobDetails
                        ? colors.primary.light
                        : "transparent",
                      borderRadius: 1,
                      p: 1,
                      transition: "background-color 0.3s ease",
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      sx={{ color: "#f5f7fa" }}
                    >
                      📅 Job Details {hoverJobDetails ? "▼" : "▶"}
                    </Typography>
                    {hoverJobDetails && (
                      <Box sx={{ mt: 1, pl: 2 }}>
                        <Typography
                          variant="body2"
                          sx={{ color: "#f5f7fa" }}
                        >
                          Start: {job.startDate} &nbsp; | &nbsp; End:{" "}
                          {job.endDate}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "#f5f7fa" }}
                        >
                          Price: ${job.price}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "#f5f7fa" }}
                        >
                          Quote Message: {job.quote?.message}
                        </Typography>
                      </Box>
                    )}
                  </Grid>

                  <Grid size={{ xs: 12, md: 3 }}>
                    { job.review && (
                      <>
                        <Typography
                          variant="subtitle1"
                          fontWeight={600}
                          sx={{ color: "#f5f7fa" }}
                        >
                          {role === "homeowner"
                            ? "Your Rating"
                            : "Ratings you got"}
                        </Typography>
                        <Rating
                          name="rating"
                          value={Number(job.review.stars)}
                          readOnly
                          sx={{ color: colors.rating }}
                        />
                        <Typography
                          sx={{
                            mt: 1,
                            color:"#f5f7fa",
                          }}
                        >
                          {job.review.comment}
                        </Typography>
                      </>
                    )}
                    {role=="provider" && !job.review &&(<>
                    <Typography variant="body2" sx={{
                            mt: 1,
                            color: colors.text.primary,
                          }}>No Reviews so far</Typography>
                    </>)}

                    {/* Only show the "Write a Review" button if role is homeowner and no review yet */}
                    {role === "homeowner" && !job.review && (
                      <Button
                        variant="contained"
                        size="medium"
                        sx={{
                          mt: 1,
                          backgroundColor: colors.primary.main,
                          "&:hover": {
                            backgroundColor: colors.primary.dark,
                          },
                        }}
                        onClick={() => {
                          openReview();
                          setJobId(job.j_id);
                        }}
                      >
                        Write a Review
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))
        )}
      </Container>
      <CreateReview handleUpdate={updatingReview} jobId={jobId} />
    </>
  );
};

export default Review;
