import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import HeartRateChart from '../components/HeartRateChart';
import ActivitySummary from '../components/ActivitySummary';
import RealTimeHeartRate from '../components/RealTimeHeartRate';
import { Box, Typography, Grid, CircularProgress, Alert } from '@mui/material';

export default function Dashboard() {
  const { user, accessToken } = useAuth();
  const [heartRateData, setHeartRateData] = useState([]);
  const [activityData, setActivityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch initial health data
  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        setLoading(true);
        
        const [hrResponse, activityResponse] = await Promise.all([
          axios.get('/api/fitbit/heart-rate', {
            headers: { 'Authorization': `Bearer ${accessToken}` }
          }),
          axios.get('/api/fitbit/activity', {
            headers: { 'Authorization': `Bearer ${accessToken}` }
          })
        ]);

        setHeartRateData(hrResponse.data);
        setActivityData(activityResponse.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load health data');
      } finally {
        setLoading(false);
      }
    };

    if (user && accessToken) {
      fetchHealthData();
    }
  }, [user, accessToken]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box width="100%" mt={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Health Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Real-Time Heart Rate Section */}
        <Grid item xs={12} md={6}>
          <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Real-Time Heart Rate
            </Typography>
            <RealTimeHeartRate />
          </Box>
        </Grid>

        {/* Historical Heart Rate Chart */}
        <Grid item xs={12} md={6}>
          <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Heart Rate Trends (24h)
            </Typography>
            <HeartRateChart data={heartRateData} />
          </Box>
        </Grid>

        {/* Activity Summary */}
        <Grid item xs={12}>
          <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Daily Activity Summary
            </Typography>
            {activityData && <ActivitySummary data={activityData} />}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}