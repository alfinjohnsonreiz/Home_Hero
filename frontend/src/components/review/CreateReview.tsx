import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Typography,
  Divider,
  Grid,
  Alert,
  Rating,
} from "@mui/material";
import { ReviewContext } from "./ReviewProvider";
import { toast } from "react-toastify";
import { createReview } from "../../services/allApi";

type Props = {
  // role: string;
  jobId: number | null;
  handleUpdate: (jobId: any, fornData: any) => void;
};
type formDatatype = {
  stars: number | null;
  comment: string | null;
};
const CreateReview = ({ jobId, handleUpdate }: Props) => {
  const context = useContext(ReviewContext);
  if (!context) return null;
  const { isReviewOpen, closeReview } = context;

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (isReviewOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isReviewOpen]);

  //   ! Form
  const [formData, setFormData] = useState<formDatatype>({
    stars: 0,
    comment: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!formData.stars|| !formData?.comment?.trim()) {
        toast.error("All fields are required");
        return;
      }

      if (!jobId) {
        toast.error("Invalid Job ID");
        return;
      }

      const response = await createReview(jobId, {
        stars: formData.stars,
        comment: formData.comment,
      });

      if (response.data.success) {
        toast.success("Review submitted successfully!");
        handleUpdate(jobId, formData);
        // Reset form data here:
        setFormData({
          stars: 0,
          comment: "",
        });
        closeReview(); // Close modal
      } else {
        toast.error(response.data.msg || "Something went wrong");
      }
      // }
    } catch (error: any) {
      console.error("Review submit error", error);
      toast.error(error?.response?.data?.msg || "Failed to submit review");
    }
  };

  return (
    <>
      <Dialog open={isReviewOpen} maxWidth="sm" onClose={closeReview} fullWidth>
        <DialogTitle>Leave a Review</DialogTitle>
        <DialogContent dividers>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Rating
                </Typography>
                <Rating
                  name="rating"
                  value={formData.stars}
                  onChange={(event, newValue) => {
                    setFormData({ ...formData, stars: newValue });
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Comment
                </Typography>
                <TextField
                  name="comment"
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Write your feedback..."
                  value={formData.comment}
                  onChange={handleChange}
                />
              </Grid>


              <Grid size={{ xs: 12 }}>
                <Button type="submit" variant="contained" fullWidth>
                  Submit Review
                </Button>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={closeReview}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreateReview;
