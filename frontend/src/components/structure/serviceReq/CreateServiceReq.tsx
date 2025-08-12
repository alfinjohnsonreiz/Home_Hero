import React, { useContext, useEffect, useRef, useState } from "react";
import { ServiceReqContext } from "./ServiceReqProvider";
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
} from "@mui/material";
import axiosInstance from "../../../services/axiosInstance";
import { toast } from "react-toastify";

const CreateServiceReq = ({ role }) => {
  // !Taking functions from context
  const context = useContext(ServiceReqContext);
  if (!context) return null;
  const { isServiceReqOpen, closeServiceReqModal } = context;

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (isServiceReqOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isServiceReqOpen]);

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    urgent: false,
    location: "",
    isRecurring: false,
    recurrenceFrequency: null,
    recurrenceInterval: null,
    recurrenceEndDate: "",
  });

  const [photos, setPhotos] = useState<File[]>([]);

  const categories = ["Plumbing", "Electrical", "Carpentry", "Cleaning"];
  const frequencies = ["weekly", "monthly"];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(Array.from(e.target.files));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.title ||
      !formData.description ||
      !formData.category ||
      !formData.location
    ) {
      toast.error("All field are required");
      setError("All fields are required.");
      return;
    }
    if (formData.isRecurring) {
      if (
        !formData.recurrenceEndDate ||
        !formData.recurrenceFrequency ||
        !formData.recurrenceInterval
      ) {
        toast.error("Recurrence fields are required");
      }
    }

    //  null becomes "null"
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value === null || value === undefined) {
        //! skip appending this field (optional)
      } else {
        data.append(key, String(value));
      }
    });
    photos.forEach((photo) => data.append("photos", photo));

    try {
      const response = await axiosInstance.post("/serviceReq/create", data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (response.data.success) {
        setMessage(response.data.msg);
        setError(null);
        closeServiceReqModal();
        toast.success(response.data.msg);
      } else {
        setError(response.data.msg);
        setMessage(null);
        toast.error(response.data.msg);
      }
    } catch (error: any) {
      setMessage(null);
      setError(error.response?.data?.msg || "Something went wrong.");
      toast.error(error.data.msg);
    }
  };

  return (
    <Dialog
      open={isServiceReqOpen}
      maxWidth="sm"
      onClose={closeServiceReqModal}
      
      fullWidth
      sx={{            background:"linear-gradient(90deg,rgba(0, 67, 95, 0.4),rgba(0, 149, 199, 0.47))",
}}
    >
      <DialogTitle>Create Service Request</DialogTitle>
      <DialogContent
        dividers
      >
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                Service Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                inputRef={inputRef}
                label="Title"
                name="title"
                fullWidth
                required
                value={formData.title}
                onChange={handleChange}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                label="Description"
                name="description"
                fullWidth
                multiline
                rows={4}
                required
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                label="Category"
                name="category"
                select
                fullWidth
                required
                value={formData.category}
                onChange={handleChange}
              >
                {categories.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* The check box takes STRING TRUE / FALSE */}
            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.urgent}
                    onChange={handleChange}
                    name="urgent"
                  />
                }
                label="Mark as urgent"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.isRecurring}
                    onChange={handleChange}
                    name="isRecurring"
                  />
                }
                label="Need Recurring"
              />
            </Grid>
            {formData.isRecurring && (
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <TextField
                    label="Recurrence Frequency "
                    name="recurrenceFrequency"
                    select
                    fullWidth
                    required
                    value={formData.recurrenceFrequency}
                    onChange={handleChange}
                  >
                    {frequencies.map((freq: any) => (
                      <MenuItem key={freq} value={freq}>
                        {" "}
                        {freq}{" "}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid>
                  <TextField
                    label="Recurrence Interval"
                    name="recurrenceInterval"
                    value={formData.recurrenceInterval}
                    onChange={handleChange}
                    fullWidth
                    required
                    type="number"
                  />
                </Grid>
                <Grid>
                  <Typography>
                    Expeted End Date
                    <TextField
                      value={formData.recurrenceEndDate}
                      name="recurrenceEndDate"
                      onChange={handleChange}
                      type="date"
                      fullWidth
                    />
                  </Typography>
                </Grid>
              </Grid>
            )}
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Location"
                name="location"
                fullWidth
                required
                value={formData.location}
                onChange={handleChange}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Button variant="outlined" component="label" fullWidth>
                Upload Photos
                <input
                  type="file"
                  hidden
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Button>
              {photos.length > 0 && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {photos.length} photo(s) selected
                </Typography>
              )}
            </Grid>

            {message && (
              <Grid size={{ xs: 12 }}>
                <Alert severity="success">{message}</Alert>
              </Grid>
            )}
            {error && (
              <Grid size={{ xs: 12 }}>
                <Alert severity="error">{error}</Alert>
              </Grid>
            )}

            <Grid size={{ xs: 12 }}>
              <Button type="submit" variant="contained" fullWidth>
                Submit Request
              </Button>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={closeServiceReqModal}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateServiceReq;
