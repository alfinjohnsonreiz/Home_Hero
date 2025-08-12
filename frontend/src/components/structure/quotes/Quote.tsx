import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { listQuote } from "../../../services/allApi";
import {
  Box,
  Container,
  Grid,
  Stack,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Chip,
  Skeleton,
  IconButton,
  Collapse,
  // useTheme,
  // useMediaQuery
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ConstructionIcon from '@mui/icons-material/Construction';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PendingIcon from '@mui/icons-material/Pending';
import CancelIcon from '@mui/icons-material/Cancel';

const Quote = () => {
  // const userString = localStorage.getItem("authUser");
  // const user = userString ? JSON.parse(userString) : {};
  // const { u_id, name, role } = user || {};

  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedQuote, setExpandedQuote] = useState<number | null>(null);
  // const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchingQuotes = async () => {
    try {
      const response = await listQuote();
      const { data, success } = response.data;
      if (success) {
        setQuotes(data);
      }
    } catch (error: any) {
      const errMsg =
        error?.msg || error?.response?.msg || "Something went wrong";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchingQuotes();
  }, []);

  const handleExpandClick = (quoteId: number) => {
    setExpandedQuote(expandedQuote === quoteId ? null : quoteId);
  };

  const getStatusChip = (status: string) => {
    switch (status.toLowerCase()) {
      case 'accepted':
        return <Chip icon={<CheckCircleOutlineIcon />} label="Approved" color="success" size="small" />;
      case 'pending':
        return <Chip icon={<PendingIcon />} label="Pending" color="warning" size="small" />;
      case 'rejected':
        return <Chip icon={<CancelIcon />} label="Rejected" color="error" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3} sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} textAlign="center" color="primary">
          Your Quotes
        </Typography>
        <Divider sx={{ borderColor: 'primary.main', borderWidth: 1 }} />
      </Stack>

      {loading ? (
        <Grid container spacing={3}>
          {[1, 2, 3].map((item) => (
            <Grid size={{xs:12,sm:6,md:4}}
            key={item}>
              <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      ) : quotes.length === 0 ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '300px',
            p: 4,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 1,
            textAlign: 'center'
          }}
        >
          <ConstructionIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Quotes Yet
          </Typography>
          <Typography variant="body1" color="text.secondary">
            You haven't submitted any quotes. Get started by responding to service requests.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {quotes.map((quote: any) => (
            <Grid size={{xs:12,sm:10,md:8,lg:6}}
             key={quote.q_id}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: 3,
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6,
                  },
                }}
              >
                <CardHeader
                  title={`Quote #${quote.q_id}`}
                  action={
                    <IconButton
                      onClick={() => handleExpandClick(quote.q_id)}
                      aria-expanded={expandedQuote === quote.q_id}
                      aria-label="show more"
                    >
                      {expandedQuote === quote.q_id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  }
                  subheader={getStatusChip(quote.status)}
                  sx={{
                    bgcolor: 'rgb(211, 211, 211)',
                    color: 'rgba(37, 32, 32, 0.73)',
                    '& .MuiCardHeader-subheader': {
                      mt: 0.5,
                    },
                  }}
                />
                <CardContent>
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AttachMoneyIcon color="primary" />
                      <Typography variant="h6" component="span">
                        ₹{quote.price.toLocaleString()}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarTodayIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(quote.startDate)}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        to
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarTodayIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(quote.endDate)}
                        </Typography>
                      </Box>
                    </Box>
                  </Stack>
                </CardContent>
                
                <Collapse in={expandedQuote === quote.q_id} timeout="auto" unmountOnExit>
                  <Divider />
                  <CardContent sx={{ bgcolor: 'background.default' }}>
                    <Stack spacing={2}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        Service Request Details
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ConstructionIcon fontSize="small" color="action" />
                        <Typography variant="body1">
                          {quote?.servicerequest?.title || 'N/A'}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationOnIcon fontSize="small" color="action" />
                        <Typography variant="body1">
                          {quote?.servicerequest?.location || 'N/A'}
                        </Typography>
                      </Box>
                      
                      <Chip
                        label={`Service ${quote?.servicerequest?.isActive ? 'Active' : 'Inactive'}`}
                        color={quote?.servicerequest?.isActive ? 'success' : 'error'}
                        size="small"
                        variant="outlined"
                      />
                    </Stack>
                  </CardContent>
                </Collapse>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Quote;