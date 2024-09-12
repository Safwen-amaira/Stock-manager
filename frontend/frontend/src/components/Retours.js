import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Button, Grid, Modal, Box, Pagination } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Retours = () => {
  const [retours, setRetours] = useState([]);
  const [selectedRetour, setSelectedRetour] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [page, setPage] = useState(1); // Current page
  const [totalPages, setTotalPages] = useState(1); // Total pages
  const [totalLosses, setTotalLosses] = useState(0); // Total losses
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchRetours = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/retours/?page=${page}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        // Sort retours by date in descending order
        const sortedRetours = data.results.sort((a, b) => new Date(b.date) - new Date(a.date));
        setRetours(sortedRetours);

        // Set total pages from the response
        setTotalPages(data.total_pages);

        // Calculate total losses
        const total = sortedRetours.reduce((acc, retour) => acc + retour.loses, 0);
        setTotalLosses(total);
      } catch (error) {
        console.error('Failed to fetch retours:', error);
      }
    };

    fetchRetours();
  }, [page]); // Depend on page to refetch data when page changes

  const handleCardClick = (retour) => {
    setSelectedRetour(retour);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedRetour(null);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <>
      <Grid container spacing={2} direction="column">
        <Grid item xs={12}>
         <h2>   Retours ! :( </h2>
                <br/>
          <Card 
            sx={{ 
              maxWidth: 250, 
              margin: 'auto', 
              height:110,
              boxShadow: 4 ,
            }}
          >
            <CardContent>
              <Typography variant="h5" component="div">
                Total Losses
              </Typography>
              <Typography variant="h5" color="text.primary">
             <p style={{color:"red"}}>   {totalLosses} </p>
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Cards for individual retours */}
        {retours.map((retour) => (
          <Grid item xs={12} sm={6} md={4} key={retour.id}>
            <Card 
              sx={{ 
                maxWidth: 345, 
                margin: 'auto', 
                cursor: 'pointer', 
                boxShadow: 3 
              }}
              onClick={() => handleCardClick(retour)}
            >
              <CardContent>
                <Typography variant="h5" component="div">
                  {retour.product} {/* Adjust according to your data */}
                </Typography>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  <p style={{color:'red'}}> {retour.loses} </p> {/* Adjust according to your data */}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(retour.date).toLocaleDateString()} {/* Display formatted date */}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <br/>
      <br/>
      <br/>

      {/* Pagination Component */}
      <Pagination 
        count={totalPages}
        page={page}
        onChange={handlePageChange}
        color="primary"
        sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
      />

      {/* Modal for displaying retour details */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          width: 400, 
          bgcolor: 'background.paper', 
          border: '2px solid #000', 
          boxShadow: 24, 
          p: 4 
        }}>
          {selectedRetour && (
            <>
              <Typography id="modal-title" variant="h6" component="h2">
                Retour Details
              </Typography>
              <Typography id="modal-description" sx={{ mt: 2 }}>
                <p><strong>Product:</strong> {selectedRetour.product}</p>
                <p><strong>Loses:</strong> {selectedRetour.loses}</p>
                <p><strong>Date:</strong> {new Date(selectedRetour.date).toLocaleDateString()}</p>
                {/* Add more fields as necessary */}
              </Typography>
              <Button onClick={handleCloseModal} variant="outlined" color="primary" sx={{ mt: 2 }}>
                Close
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default Retours;
