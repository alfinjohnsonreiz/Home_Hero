import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  Fade,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface CustomDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  content: string;
  confirmText?: string;
  cancelText?: string;
  animationJob?: boolean;
  animationPayment?: boolean;
}
const ConfirmDialog: React.FC<CustomDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  content,
  confirmText = "Confrim",
  cancelText = "Cancel",
  animationJob,
  animationPayment,
}) => {
  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{content}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>{cancelText}</Button>
          {onConfirm && <Button onClick={onConfirm}>{confirmText}</Button>}
        </DialogActions>
      </Dialog>
      {/* Animation Overlay */}
      {animationJob && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            zIndex: 1300,
            flexDirection: "column",
          }}
        >
          <Fade in={animationJob} timeout={1000}>
            <CheckCircleIcon color="success" sx={{ fontSize: 100, mb: 2 }} />
          </Fade>
          <Typography variant="h5" sx={{ mt: 2 }}>
            Job Completed!
          </Typography>
        </div>
      )}
      {animationPayment && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            zIndex: 1300,
            flexDirection: "column",
          }}
        >
          <Fade in={animationPayment} timeout={1000}>
            <CheckCircleIcon color="success" sx={{ fontSize: 100, mb: 2 }} />
          </Fade>
          <Typography variant="h5" sx={{ mt: 2 }}>
            Payment Recieved!
          </Typography>
        </div>
      )}
    </>
  );
};

export default ConfirmDialog;
