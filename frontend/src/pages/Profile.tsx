import { Box, Container, Grid, Typography, Paper, Avatar, Chip, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { fetchUser } from "../services/allApi";

type Props = {};

const Profile = (props: Props) => {
  // Get user from localStorage
  const userString = localStorage.getItem("authUser");
  if (!userString) return null;
  const { role, name, email, u_id } = JSON.parse(userString);

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const response = await fetchUser();
      const { data, success } = response.data;
      if (success) {
        setProfile(data);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [role, u_id]);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress color="secondary" />
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container maxWidth="md" sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">No profile data found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ 
        p: 4, 
        borderRadius: 4,
        background: 'linear-gradient(145deg, #f5f7fa 0%, #e4e8f0 100%)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
      }}>
        {/* Profile Header with Photo */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          mb: 4,
          gap: 3
        }}>
          <Avatar
            alt={profile.user?.name || name}
            src={profile.user?.photo || "/default-avatar.png"}
            sx={{ 
              width: 120, 
              height: 120,
              border: '4px solid white',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
          />
          <Box>
            <Typography variant="h3" sx={{ 
              fontWeight: 700,
              color: 'primary.main',
              mb: 1,
              fontFamily: '"Montserrat", sans-serif'
            }}>
              {profile.user?.name || name || "User"}
            </Typography>
            <Chip 
              label={role} 
              color={role === "provider" ? "primary" : "secondary"} 
              size="medium"
              sx={{ 
                textTransform: 'capitalize',
                fontSize: '0.9rem',
                fontWeight: 600,
                px: 2
              }}
            />
          </Box>
        </Box>

        <Grid container spacing={4}>
          {/* Basic Info Section */}
          <Grid 
          size={{xs:12,md:6,sm:12}}
          >
            <Paper variant="outlined" sx={{ 
              p: 3, 
              height: '100%',
              borderRadius: 3,
              borderColor: 'divider',
              background: 'rgba(255,255,255,0.7)'
            }}>
              <Typography variant="h5" sx={{ 
                fontWeight: 600, 
                mb: 3,
                color: 'text.primary',
                fontFamily: '"Poppins", sans-serif',
                borderBottom: '2px solid',
                borderColor: 'primary.light',
                pb: 1
              }}>
                Basic Information
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ 
                  color: 'text.secondary',
                  fontWeight: 500,
                  mb: 0.5
                }}>
                  Name
                </Typography>
                <Typography variant="body1" sx={{ 
                  fontWeight: 500,
                  fontSize: '1.1rem',
                  color: 'text.primary'
                }}>
                  {profile.user?.name || name || "User"}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ 
                  color: 'text.secondary',
                  fontWeight: 500,
                  mb: 0.5
                }}>
                  Email
                </Typography>
                <Typography variant="body1" sx={{
                  fontSize: '1.1rem',
                  color: 'text.primary'
                }}>
                  {profile.user?.email || email}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" sx={{ 
                  color: 'text.secondary',
                  fontWeight: 500,
                  mb: 0.5
                }}>
                  Member Since
                </Typography>
                <Typography variant="body1" sx={{
                  fontSize: '1.1rem',
                  color: 'text.primary'
                }}>
                  {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "N/A"}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Role-Specific Info Section */}
          <Grid size={{xs:12 ,sm:12,md:6}}>
            <Paper variant="outlined" sx={{ 
              p: 3, 
              height: '100%',
              borderRadius: 3,
              borderColor: 'divider',
              background: 'rgba(255,255,255,0.7)'
            }}>
              <Typography variant="h5" sx={{ 
                fontWeight: 600, 
                mb: 3,
                color: 'text.primary',
                fontFamily: '"Poppins", sans-serif',
                borderBottom: '2px solid',
                borderColor: 'secondary.light',
                pb: 1
              }}>
                {role === "provider" ? "Professional Details" : "Contact Information"}
              </Typography>
              
              {role === "provider" ? (
                <>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ 
                      color: 'text.secondary',
                      fontWeight: 500,
                      mb: 0.5
                    }}>
                      Service Category
                    </Typography>
                    <Chip 
                      label={profile.serviceCategory || "N/A"} 
                      color="primary"
                      variant="outlined"
                      sx={{ fontWeight: 500 }}
                    />
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ 
                      color: 'text.secondary',
                      fontWeight: 500,
                      mb: 0.5
                    }}>
                      Skills
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {profile.skills ? (
                        profile.skills.split(',').map((skill: string, index: number) => (
                          <Chip 
                            key={index}
                            label={skill.trim()} 
                            size="small"
                            sx={{ 
                              backgroundColor: 'primary.light',
                              color: 'primary.contrastText'
                            }}
                          />
                        ))
                      ) : (
                        <Typography variant="body1">N/A</Typography>
                      )}
                    </Box>
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ 
                      color: 'text.secondary',
                      fontWeight: 500,
                      mb: 0.5
                    }}>
                      Certification
                    </Typography>
                    <Typography variant="body1" sx={{
                      fontSize: '1.1rem',
                      color: 'text.primary'
                    }}>
                      {profile.certification || "N/A"}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ 
                      color: 'text.secondary',
                      fontWeight: 500,
                      mb: 0.5
                    }}>
                      Average Rating
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body1" sx={{
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        color: 'secondary.main'
                      }}>
                        {profile.averageRating ? `${profile.averageRating}/5` : "N/A"}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box>
                    <Typography variant="subtitle1" sx={{ 
                      color: 'text.secondary',
                      fontWeight: 500,
                      mb: 0.5
                    }}>
                      Status
                    </Typography>
                    <Chip 
                      label={profile.status || "N/A"} 
                      color={profile.status === "active" ? "success" : "error"} 
                      size="medium"
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>
                </>
              ) : (
                <>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ 
                      color: 'text.secondary',
                      fontWeight: 500,
                      mb: 0.5
                    }}>
                      Contact Number
                    </Typography>
                    <Typography variant="body1" sx={{
                      fontSize: '1.1rem',
                      fontWeight: 500,
                      color: 'text.primary'
                    }}>
                      {profile.contactNumber || "N/A"}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="subtitle1" sx={{ 
                      color: 'text.secondary',
                      fontWeight: 500,
                      mb: 0.5
                    }}>
                      Address
                    </Typography>
                    <Typography variant="body1" sx={{
                      fontSize: '1.1rem',
                      color: 'text.primary'
                    }}>
                      {profile.address || "N/A"}
                    </Typography>
                  </Box>
                </>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Profile;