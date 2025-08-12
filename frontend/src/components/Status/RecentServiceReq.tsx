import {
  Box,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Paper,
  Typography,
  IconButton,
  useTheme,
  Skeleton,
} from "@mui/material";
import {
  Assignment as RequestIcon,
  CheckCircle as ActiveIcon,
  Pending as PendingIcon,
  Cancel as InactiveIcon,
  ArrowForward as ArrowIcon,
} from "@mui/icons-material";
import React from "react";
import { toTitleCase } from "../../utils/stringUtils";
import { formatDistanceToNow, isValid } from "date-fns";

type Props = {
  data: any[];
  loading?: boolean;
  maxItems?: number;
};

const statusConfig = {
  active: {
    color: "success",
    icon: <ActiveIcon fontSize="small" />,
  },
  pending: {
    color: "warning",
    icon: <PendingIcon fontSize="small" />,
  },
  inactive: {
    color: "error",
    icon: <InactiveIcon fontSize="small" />,
  },
};

const RecentServiceReq = ({
  data = [],
  loading = false,
  maxItems = 3,
}: Props) => {
  const theme = useTheme();

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return isValid(date)
        ? formatDistanceToNow(date, { addSuffix: true })
        : "N/A";
    } catch (error) {
      console.error("Error formatting date:", error);
      return "N/A";
    }
  };

  if (loading) {
    return (
      <Paper
        elevation={2}
        sx={{
          borderRadius: 2,
          overflow: "hidden",

          bgcolor: "#1e293b",
          borderLeft: "3px solid #c75cf4", // Purple accent
          "&:hover": { transform: "translateX(4px)" },
        }}
      >
        <Box
          sx={{ p: 2.5, borderBottom: `1px solid ${theme.palette.divider}` }}
        >
          <Typography
            variant="h6"
            fontWeight={600}
            sx={{ color: "#ffffff", mb: 2 }}
          >
            Recent Requests
          </Typography>
        </Box>
        <List>
          {[...Array(maxItems)].map((_, index) => (
            <React.Fragment key={index}>
              <ListItem sx={{ py: 2, px: 2.5 }}>
                <ListItemAvatar>
                  <Skeleton variant="circular" width={40} height={40} />
                </ListItemAvatar>
                <ListItemText
                  primary={<Skeleton variant="text" width="60%" />}
                  secondary={<Skeleton variant="text" width="40%" />}
                />
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Skeleton variant="rectangular" width={80} height={24} />
                </Box>
              </ListItem>
              {index < maxItems - 1 && <Divider variant="middle" />}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={2}
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        bgcolor: "#1e293b",
        borderLeft: "3px solid #c75cf4", // Purple accent
      }}
    >
      <Box
        sx={{
          p: 2.5,
          borderBottom: `1px solid ${theme.palette.divider}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" fontWeight={600} color="white">
          Recent Service Requests
        </Typography>
        <Typography variant="caption" color="white">
          Last {maxItems} of {data.length}
        </Typography>
      </Box>

      <List disablePadding>
        {data.slice(0, maxItems).map((service, index) => {
          const status = service.isActive
            ? "active"
            : !service.isActive
            ? "pending"
            : "inactive";
          const statusProps = statusConfig[status] || statusConfig.pending;

          return (
            <React.Fragment key={service.s_id || index}>
              <ListItem
                secondaryAction={
                  <IconButton edge="end" aria-label="view" color="primary">
                    <ArrowIcon />
                  </IconButton>
                }
                sx={{
                  py: 2,
                  px: 2.5,
                  "&:hover": {
              bgcolor: "rgba(199, 92, 244, 0.05)", 
              cursor: "pointer",
            },
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: theme.palette.warning.light,
                      color: theme.palette.info.main,
                    }}
                  >
                    <RequestIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography
                      variant="subtitle1"
                      fontWeight={500}
                      sx={{ color: "#ffffff" }}
                    >
                      {toTitleCase(service.title || "Untitled Request")}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                        {toTitleCase(service.category || "Uncategorized")}
                      </Typography>
                      <Typography
                        component="span"
                        variant="caption"
                        color="error"
                      >
                        {service.location || "Location not specified"} •{" "}
                        {formatDate(service.createdAt)}
                      </Typography>
                    </>
                  }
                  sx={{ my: 0 }}
                />
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mr: 2,
                  }}
                >
                  <Chip
                    label={status}
                    size="small"
                    color={statusProps.color}
                    icon={statusProps.icon}
                    variant="outlined"
                    sx={{
                      fontWeight: 500,
                      textTransform: "capitalize",
                    }}
                  />
                </Box>
              </ListItem>
              {index < Math.min(data.length, maxItems) - 1 && (
                <Divider variant="middle" sx={{ mx: 3 }} />
              )}
            </React.Fragment>
          );
        })}

        {data.length === 0 && (
          <Box
            sx={{
              p: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <RequestIcon
              sx={{
                fontSize: 48,
                color: "text.disabled",
                mb: 1,
              }}
            />
            <Typography variant="body1" color="text.secondary">
              No recent service requests
            </Typography>
          </Box>
        )}
      </List>
    </Paper>
  );
};

export default RecentServiceReq;
