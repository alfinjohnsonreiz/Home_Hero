import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  Typography,
  Divider,
  Grid,
} from "@mui/material";
import { toast } from "react-toastify";
// addHandleSubmit={addingQuote}
//                   role={role}
//                   open={addQuoteOpen}
//                   serviceReqId={serviceReqId}
//                   handleClose={handleCloseAddQuote}
//                   handleOpen={handleOpenAddQuote}
interface formDataType{
  price:string,
  startDate:string,
  endDate:string,
  message:string
}
interface CreateProps{
  role:string,
  open:boolean,
  handleClose:()=>void,
  handleOpen:(serviceReqId:number)=>void,
  addHandleSubmit:(formData:formDataType)=>void,

}

const CreateQuote = ({
  // role,
  open,
  // handleOpen,
  handleClose,
  addHandleSubmit,
}: CreateProps) => {
  const [formData, setFormData] = useState<formDataType>({
    price: "",
    startDate: "",
    endDate: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.price ||
      !formData.message ||
      !formData.startDate ||
      !formData.endDate
    ) {
      toast.error("All fields are required.");
      return;
    }
    addHandleSubmit(formData);
  };
  const resetForm = () => {
    setFormData({
      price: "",
      startDate: "",
      endDate: "",
      message: "",
    });
    
  };
  const handleCloseAndReset = () => {
    resetForm();
    handleClose();
  };

  return (
    <>
      <Dialog open={open} maxWidth="sm" onClose={handleCloseAndReset} fullWidth>
        <DialogTitle>Add Quote</DialogTitle>
        <DialogContent dividers>
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
                  label="Price"
                  name="price"
                  fullWidth
                  required
                  value={formData.price}
                  onChange={handleChange}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Start Date"
                  name="startDate"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={formData.startDate}
                  onChange={handleChange}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="End Date"
                  name="endDate"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={formData.endDate}
                  onChange={handleChange}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Message"
                  name="message"
                  fullWidth
                  multiline
                  rows={3}
                  required
                  value={formData.message}
                  onChange={handleChange}
                />
              </Grid>


              <Grid size={{ xs: 12 }}>
                <Button type="submit" variant="contained" fullWidth>
                  Add Quote
                </Button>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseAndReset}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreateQuote;
