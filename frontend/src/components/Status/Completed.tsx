import {
  Avatar,
  Box,
  Chip,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import {
  CheckCircle as ActiveIcon,
  Pending as PendingIcon,
} from "@mui/icons-material";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AssignmentIcon from '@mui/icons-material/Assignment';

import React from "react";
type Props = {
  data: any[];
};

const Completed = ({ data }: Props) => {
  const theme = useTheme();

  return (
    <>
      <Paper
  elevation={1}
  sx={{
    borderRadius: 2,
    bgcolor: "#1e293b", 
    borderLeft: "3px solid #c75cf4", 
    "&:hover": { boxShadow: "0px 4px 12px rgba(199, 92, 244, 0.1)" },
  }}
>
  <Box
    sx={{
      p: 2,
      borderBottom: "1px solid #334155", 
      background: "linear-gradient(90deg, rgba(19, 31, 168, 0.1) 0%, transparent 100%)",
    }}
  >
    <Typography variant="h6" sx={{ color: "#ffffff", fontWeight: 600 }}>
      Recent Jobs
    </Typography>
  </Box>

  <List disablePadding>
    {data.slice(0, 3).map((job, index) => (
      <React.Fragment key={index}>
        <ListItem
          sx={{
            py: 2,
            px: 2.5,
            "&:hover": {
              bgcolor: "rgba(199, 92, 244, 0.05)", 
              cursor: "pointer",
            },
          }}
        >
          <ListItemAvatar sx={{ minWidth: "40px",p:1 }}>
            <Avatar
              sx={{
                bgcolor: "#c75cf4",
                color: "#ffffff",
                fontSize: "0.875rem",
              }}
            >
              {job.servicerequest?.title.charAt(0).toUpperCase()}
            </Avatar>
          </ListItemAvatar>

          <ListItemText
          
            primary={
              <Typography  variant="subtitle1" sx={{  color: "#ffffff" }}>
                {job.servicerequest?.title || "Untitled Job"}
              </Typography>
            }
            secondary={
              <Box sx={{ mt: 0.5 }}>
                <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                  {job.servicerequest?.description?.slice(0, 60) + "..." || "No description"}
                </Typography>
                <Box sx={{ display: "flex", gap: 1, mt: 1, flexWrap: "wrap" }}>
                  
                  <Chip
                    label={job.status}
                    size="small"
                    icon={
                      job.status === "completed" ? (
                        <CheckCircleOutlineIcon fontSize="small" />
                      ) : (
                        <AccessTimeIcon fontSize="small" />
                      )
                    }
                    sx={{
                      fontWeight: 500,
                      textTransform: "capitalize",
                      borderColor:
                        job.status === "completed" ? "#10b981" : "#c75cf4",
                      color:
                        job.status === "completed" ? "#10b981" : "#c75cf4",
                      bgcolor:
                        job.status === "completed"
                          ? "rgba(16, 185, 129, 0.1)"
                          : "rgba(199, 92, 244, 0.1)",
                    }}
                  />

                  <Chip
                    label={new Date(job.startDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                    size="small"
                    sx={{
                      bgcolor: "#334155",
                      color: "#e2e8f0",
                      fontSize: "0.75rem",
                    }}
                  />
                </Box>
              </Box>
            }
            sx={{ my: 0 }}
            slotProps={{ secondary: { component: "div" } }}
          />
        </ListItem>

        {index < data.length - 1 && (
          <Divider variant="inset" sx={{ borderColor: "#334155", ml: 7 }} />
        )}
      </React.Fragment>
    ))}

    {data.length === 0 && (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <AssignmentIcon sx={{ fontSize: 48, color: "#334155", mb: 1 }} />
        <Typography variant="body1" sx={{ color: "#64748b" }}>
          No recent jobs found
        </Typography>
      </Box>
    )}
  </List>
</Paper>
    </>
  );
};
export default Completed;
