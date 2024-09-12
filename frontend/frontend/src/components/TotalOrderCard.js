import React from 'react';
import { Box, Typography } from '@mui/material';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

const TotalOrderCard = () => {
  // Sample data for the line chart
  const data = [
    { name: 'Jan', value: 30 },
    { name: 'Feb', value: 20 },
    { name: 'Mar', value: 27 },
    { name: 'Apr', value: 18 },
    { name: 'May', value: 23 },
    { name: 'Jun', value: 34 },
    { name: 'Jul', value: 45 },
  ];

  return (
    <Box
      sx={{
        backgroundColor: '#fff',
        borderRadius: '10px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        padding: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '350px',
      }}
    >
      <Box>
        <Typography variant="body2" sx={{ color: '#6c757d' }}>
          Total Sales
        </Typography>
        <Typography variant="h4" sx={{ color: '#000' }}>
          58.4K
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
          <Box
            sx={{
              backgroundColor: '#e0f3ff',
              padding: '3px 8px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Typography variant="body2" sx={{ color: '#007bff', fontWeight: 'bold' }}>
              ↑ 13.6%
            </Typography>
          </Box>
        </Box>
      </Box>
      <ResponsiveContainer width="50%" height={50}>
        <LineChart data={data}>
          <Line type="monotone" dataKey="value" stroke="#007bff" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default TotalOrderCard;
