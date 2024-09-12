import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Typography, Container } from '@mui/material';
import notFound from '../contexts/404.png'
const None = () => {
  return (
    <Container 
      maxWidth="sm" 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh', 
        textAlign: 'center' ,
        marginTop:'-8vh'
      }}
    >
      <Typography variant="h1" component="div" sx={{ fontSize: '6rem', fontWeight: 'bold', color: '#f44336' }}>
        404
      </Typography>
      <Typography variant="h5" component="div" sx={{ mb: 3, color: '#333' }}>
        Oops! Page Not Found
      </Typography>
      <Typography variant="body1" component="div" sx={{ mb: 3, color: '#666' }}>
        The page you're looking for is under construction or does not exist .
      </Typography>
      <Typography variant="body1" component="div" sx={{ mb: 1, color: '#666' }}>
          if something went wrong , feel free to contact <a href='mailto:support-technique@serliny.com?subject=problem feedback'> Serliny technical support</a>   
      </Typography>
      <Box sx={{ mb: 3 }}>
        <img 
          src={notFound} 
          alt="Not Found" 
          style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }} 
        />
      </Box>

    </Container>
  );
};

export default None;
