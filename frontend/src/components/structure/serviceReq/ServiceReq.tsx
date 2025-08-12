import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import {
  Box,
  Button,
  Container,
  Typography,
  Chip,
  Stack,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Divider,
  Tooltip,
  Alert,
  Rating,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import ImageIcon from "@mui/icons-material/Image";
import {
  acceptQuote,
  addQuote,
  deleteServiceReq,
} from "../../../services/allApi";
import ConfirmDialog from "../../confirmModal/ConfirmDialog";
import CreateQuote from "../quotes/CreateQuote";
import CancelIcon from "@mui/icons-material/Cancel";
import { toTitleCase } from "../../../utils/stringUtils";
import LoopIcon from "@mui/icons-material/Loop";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import ListServiceReq from "./ListServiceReq";

const ServiceReq = ({ item, goback, role, updateAdding,updateStatus ,onDelete}: any) => {
  const { photos = [] } = item;
  console.log("photos are ", photos);

  const [quotes, setQuotes] = useState(item.quotes || []); //! put it here
  const [hasAcceptedQuote, setHasAcceptedQuote] = useState(false);

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [quoteId, setQuoteId] = useState<number | null>(null);
  const [confirmdialogopen, setConfirmDialogOpen] = useState(false);

  const [serviceReqId, setServiceReqId] = useState<number | null>(null);
  const [addQuoteOpen, setAddQuoteOpen] = useState(false);

  //!checking if there in any accwepted quote
  useEffect(() => {
    const accepted = quotes.some((quote: any) => quote.status === "accepted");
    setHasAcceptedQuote(accepted);
  }, []);
  // TODO Dialog
  // !Acepting Quote
  // Handle confirm dialog open/close
  const handleOpenConfirmDialog = (quoteId: any) => {
    setQuoteId(quoteId);
    setConfirmDialogOpen(true);
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDialogOpen(false);
  };

  const handleOnConfirm = () => {
    acceptingQuote(quoteId);
    handleCloseConfirmDialog();
  };
  // TODO Dialog
  // ! Adding Quote
  // Handle Add Quote dialog open/close
  const handleOpenAddQuote = (serviceReqId: any) => {
    setServiceReqId(serviceReqId);
    setAddQuoteOpen(true);
  };

  const handleCloseAddQuote = () => {
    setAddQuoteOpen(false);
    setServiceReqId(null);
  };

  // Accepting a quote API
  const acceptingQuote = async (quoteId: any) => {
    try {
      if (role == "homeowner") {
        const response = await acceptQuote(quoteId);
        const { data, success }: any = response.data;

        if (success) {
          toast.success(response.data.msg);
          updateStatus(item.s_id, quoteId); //! For updating in list component
          setMessage(data.msg);
          setError(null);
          setHasAcceptedQuote(true);
        }
      }
    } catch (response: any) {
      const errMsg = response?.data?.msg || "Something went wrong";
      toast.error(errMsg);
      setError(errMsg);
    }
  };

  //! Adding a new quote sending this to CreateQuote
  const addingQuote = async (formData: any) => {
    try {
      const response = await addQuote(serviceReqId, formData);
      const { success, data, msg } = response.data;

      if (success) {
        setQuotes((prevQuotes: any) => [...prevQuotes, data]);
        setMessage(msg);
        toast.success(msg);
        updateAdding(serviceReqId,data)
        setError(null);
        handleCloseAddQuote();
      } else {
        setError(response.data.msg);
        setMessage(null);
        toast.error(msg);
      }
    } catch (error: any) {
      const errMsg =
        error.response?.data?.msg ||
        error?.data?.msg ||
        "Something went wrong.";
      setMessage(null);
      setError(errMsg);
      toast.error(errMsg);
    }
  };
  // !Watch for changes to item.quotes and update quotes state accordingly
  // if i add quote here whenever update happened in acdeptquote in list component \\
  // it overirdes
  // useEffect(() => {
  //   setQuotes(item.quotes || []);
  // }, [item.quotes]);

  
  const [s_id, setS_Id] = useState<null | number>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const handleOpenDeleteOpenDialog = (serviceReq: number) => {
    setS_Id(serviceReq);
    setOpenDeleteDialog(true);
  };
  const handleOnCofirmDelete = () => {
    if (typeof s_id !== "number") {
      toast.error("Invalid service request ID.");
      return;
    }
    onDelete(s_id);
    setOpenDeleteDialog(false);
  };
  const handleCloseDelete = () => {
    setOpenDeleteDialog(false);
  };
  return (
    <>
      <Box sx={{ p: 2 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={goback}
        >
          Back to List
        </Button>
      </Box>

      <Container maxWidth="md">
        <Card sx={{ p: 2, boxShadow: 4 }}>
          <CardContent>
            <Stack spacing={2}>
              <Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="h4" fontWeight="bold" gutterBottom>
                    {toTitleCase(item.title) || "Untitled Request"}
                  </Typography>

                  <IconButton
                    aria-label="delete"
                    onClick={() => {
                      handleOpenDeleteOpenDialog(item.s_id);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
                <Stack direction={"row"} spacing={2}>
                  {item.urgent && (
                    <Chip
                      icon={<PriorityHighIcon />}
                      label="Urgent"
                      color="error"
                      size="medium"
                      sx={{ ml: 1 }}
                    />
                  )}
                  {item.isRecurring && (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip
                        icon={<LoopIcon />}
                        label="Recurring"
                        color="secondary"
                        variant="outlined"
                        size="medium"
                      />
                      <Typography variant="body2">
                        {item.recurrenceFrequency}
                      </Typography>
                      <Typography variant="body2">
                        last date : {item.recurrenceEndDate}
                      </Typography>
                    </Stack>
                  )}
                </Stack>
              </Box>

              <Typography variant="body1">{item.description}</Typography>

              <Stack direction="row" spacing={2}>
                <Chip
                  label={`Category: ${item.category}`}
                  color="primary"
                  size="small"
                  sx={{ textTransform: "capitalize" }}
                />
                <Chip
                  label={`Location: ${item.location}`}
                  color="info"
                  size="small"
                />
              </Stack>

              <Divider />

              {/* Photos */}
              {photos.length > 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Photos
                  </Typography>
                  <Grid container spacing={2}>
                    {photos.map((photo: string, index: number) => (
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

              {/* Quotes */}
              <Box>
                {role === "provider" && quotes.length == 0 && (
                  <Button onClick={() => handleOpenAddQuote(item.s_id)}>
                    Add Quote
                  </Button>
                )}
                {role == "provider" && quotes.length !== 0 && (
                  <>
                    <Typography>Your Quotes</Typography>
                    {quotes.map((quote: any, idx: number) => (
                      <Card
                        key={quote.q_id || idx}
                        variant="outlined"
                        sx={{ my: 2, p: 2, backgroundColor: "#f9f9f9" }}
                      >
                        <Stack spacing={1}>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography fontWeight="bold">
                              Quote #{quote.q_id}
                            </Typography>
                            <Chip
                              label={quote.status}
                              color={
                                quote.status === "accepted"
                                  ? "success"
                                  : quote.status === "rejected"
                                  ? "error"
                                  : "warning"
                              }
                              icon={
                                quote.status === "accepted" ? (
                                  <CheckCircleIcon />
                                ) : quote.status === "rejected" ? (
                                  <CancelIcon />
                                ) : (
                                  <HourglassEmptyIcon />
                                )
                              }
                              size="small"
                            />
                            <Stack direction={"row"}>
                              <Typography>Provider rating</Typography>
                              <Rating
                                name="read-only-rating"
                                value={quote.providerprofile.averageRating}
                                precision={0.5}
                                readOnly
                              ></Rating>
                            </Stack>
                          </Stack>
                          <Typography variant="body2">
                            <strong>Price:</strong> ${quote.price}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Start:</strong> {quote.startDate}{" "}
                            &nbsp;|&nbsp;
                            <strong>End:</strong> {quote.endDate}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Message:</strong> {quote.message}
                          </Typography>
                        </Stack>
                      </Card>
                    ))}
                  </>
                )}

                {role == "homeowner" && quotes.length === 0 && (
                  <>
                    <Typography variant="h6" gutterBottom>
                      Quotes Received ({quotes.length})
                    </Typography>
                    <Typography color="text.secondary">
                      <HourglassEmptyIcon
                        sx={{ verticalAlign: "middle", mr: 0.5 }}
                      />
                      No quotes submitted yet.
                    </Typography>
                  </>
                )}
                {role == "homeowner" &&
                  quotes.length !== 0 &&
                  quotes.map((quote: any, idx: number) => (
                    <Card
                      key={quote.q_id || idx}
                      variant="outlined"
                      sx={{ my: 2, p: 2, backgroundColor: "#f9f9f9" }}
                    >
                      <Stack spacing={1}>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography fontWeight="bold">
                            Quote #{quote.q_id}
                          </Typography>
                          <Stack direction={"row"}>
                            <Typography>Provider rating</Typography>
                            <Rating
                              name="read-only-rating"
                              value={quote.providerprofile.averageRating}
                              precision={0.5}
                              readOnly
                            ></Rating>
                          </Stack>

                          {role == "homeowner" && hasAcceptedQuote ? (
                            <Chip
                              label={
                                // "accepted"
                                quote.status
                              }
                              color={
                                quote.status === "accepted"
                                  ? "success"
                                  : "warning"
                              }
                              icon={
                                quote.status === "accepted" ? (
                                  <CheckCircleIcon />
                                ) : (
                                  <HourglassEmptyIcon />
                                )
                              }
                              size="small"
                            />
                          ) : (
                            <Button
                              onClick={() =>
                                handleOpenConfirmDialog(quote.q_id)
                              }
                            >
                              Accept Quote
                            </Button>
                          )}
                        </Stack>
                        <Typography variant="body2">
                          <strong>Price:</strong> ${quote.price}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Start:</strong> {quote.startDate}{" "}
                          &nbsp;|&nbsp;
                          <strong>End:</strong> {quote.endDate}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Message:</strong> {quote.message}
                        </Typography>
                      </Stack>
                    </Card>
                  ))}
                {/* accepting the Quote Dialog */}
                <ConfirmDialog
                  open={confirmdialogopen}
                  onClose={handleCloseConfirmDialog}
                  onConfirm={handleOnConfirm}
                  title="Accepting Quote"
                  content="Do you want to accept the quote"
                  confirmText="Yes, go ahead"
                  cancelText="No, cancel"
                />
                <ConfirmDialog
                  open={openDeleteDialog}
                  onClose={handleCloseDelete}
                  onConfirm={handleOnCofirmDelete}
                  title="Deleting Service Request"
                  content="Do you want to Delete"
                  confirmText="Yes, go ahead"
                  cancelText="No, cancel"
                />

                {/* adding quote dialog */}
                <CreateQuote
                  addHandleSubmit={addingQuote}
                  role={role}
                  open={addQuoteOpen}
                  // serviceReqId={serviceReqId}
                  handleClose={handleCloseAddQuote}
                  handleOpen={handleOpenAddQuote}
                  // handleUpdate={updateAddedQuote}
                />
              </Box>

              {hasAcceptedQuote && (
                <Alert severity="success">
                  This service has an accepted quote.
                </Alert>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Container>
      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
};

export default ServiceReq;
