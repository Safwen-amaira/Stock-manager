import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Box, TextField, TableContainer, Table, TableHead, TableRow, TableCell, 
  TableBody, Paper, IconButton, Button, Dialog, DialogActions, DialogContent, 
  DialogTitle, Switch, FormControlLabel 
} from '@mui/material';
import { Card, Row, Col } from 'react-bootstrap';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';

const Credits = () => {
  const [credits, setCredits] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [newCredit, setNewCredit] = useState({
    profitaire: '',
    credit_payer: '',
    credit_value: '',
    is_Money: true,
    toPayBefore: '',
    comments: '',
    otherSidePhone: '',
    otherSideEmail: '',
    otherSideAdress: '',
    hePaysForUs: true
  });

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/api/credits/getall');
        setCredits(response.data);
      } catch (error) {
        console.error('Failed to fetch credits:', error);
        Swal.fire('Error', 'Failed to fetch credits', 'error');
      }
    };
    fetchCredits();
  }, []);

  // Calculate sums for hePaysForUs == true and false
  const totalHePaysForUsTrue = credits
    .filter(credit => credit.hePaysForUs)
    .reduce((sum, credit) => sum + parseFloat(credit.credit_value || 0), 0);

  const totalHePaysForUsFalse = credits
    .filter(credit => !credit.hePaysForUs)
    .reduce((sum, credit) => sum + parseFloat(credit.credit_value || 0), 0);

  // Filter credits based on search query
  const filteredCredits = credits.filter(credit =>
    credit.profitaire.toLowerCase().includes(searchQuery.toLowerCase()) ||
    credit.otherSidePhone.includes(searchQuery)
  );

  const handleDeleteCredit = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this credit!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:8000/api/api/credits/${id}/`);
          Swal.fire('Deleted!', 'The credit has been deleted.', 'success');
          setCredits(credits.filter(credit => credit.id !== id));
        } catch (error) {
          console.error('Failed to delete credit:', error);
          Swal.fire('Error', 'There was a problem deleting the credit.', 'error');
        }
      }
    });
  };

  const handleCreateCredit = async () => {
    try {
      await axios.post('http://localhost:8000/api/api/credits/', newCredit);
      Swal.fire('Success', 'Credit created successfully!', 'success');
      setOpenModal(false);
      setNewCredit({
        profitaire: '',
        credit_payer: '',
        credit_value: '',
        is_Money: true,
        toPayBefore: '',
        comments: '',
        otherSidePhone: '',
        otherSideEmail: '',
        otherSideAdress: '',
        hePaysForUs: true
      });
      const response = await axios.get('http://localhost:8000/api/api/credits/getall');
      setCredits(response.data);
    } catch (error) {
      console.error('Failed to create credit:', error);
      Swal.fire('Error', 'Failed to create credit', 'error');
    }
  };

  return (
    <Box p={3}>
      
      {/* Cards for showing total sums */}
      <Row className="my-4">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title style={{color:'green' , fontSize:'18'}}>Total Credits (ils nous payent: Yes)</Card.Title>
              <Card.Text style={{color:'black' , fontWeight:'bold', fontStyle:'italic'}}>
                {totalHePaysForUsTrue.toFixed(2)} TND
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title style={{color:'red' , fontSize:'18'}}>Total Credits (ils nous payent: No)</Card.Title>
              <Card.Text style={{color:'black' , fontWeight:'bold', fontStyle:'italic'}}>
                {totalHePaysForUsFalse.toFixed(2)} TND
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <TextField
        label="Search by Profitaire or Phone"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={() => setOpenModal(true)}>
        Create New Credit
      </Button>

      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Profitaire</TableCell>
              <TableCell>Payer</TableCell>
              <TableCell>Credit Value</TableCell>
              <TableCell>Is Money</TableCell>
              <TableCell>To Pay Before</TableCell>
              <TableCell>Comments</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>He Pays For Us</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCredits.map((credit) => (
              <TableRow key={credit.id}>
                <TableCell>{credit.profitaire}</TableCell>
                <TableCell>{credit.credit_payer}</TableCell>
                <TableCell>{credit.credit_value}</TableCell>
                <TableCell>{credit.is_Money ? 'Yes' : 'No'}</TableCell>
                <TableCell>{new Date(credit.toPayBefore).toLocaleDateString()}</TableCell>
                <TableCell>{credit.comments}</TableCell>
                <TableCell>{credit.otherSidePhone}</TableCell>
                <TableCell>{credit.otherSideEmail}</TableCell>
                <TableCell>{credit.otherSideAdress}</TableCell>
                <TableCell>{credit.hePaysForUs ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <IconButton onClick={() => console.log(`Edit credit ID: ${credit.id}`)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteCredit(credit.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create Credit Modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Create New Credit</DialogTitle>
        <DialogContent>
          <TextField
            label="Profitaire"
            fullWidth
            margin="normal"
            value={newCredit.profitaire}
            onChange={(e) => setNewCredit({ ...newCredit, profitaire: e.target.value })}
          />
          <TextField
            label="Credit Payer"
            fullWidth
            margin="normal"
            value={newCredit.credit_payer}
            onChange={(e) => setNewCredit({ ...newCredit, credit_payer: e.target.value })}
          />
          <TextField
            label="Credit Value"
            fullWidth
            margin="normal"
            value={newCredit.credit_value}
            onChange={(e) => setNewCredit({ ...newCredit, credit_value: e.target.value })}
          />
          <FormControlLabel
            control={
              <Switch
                checked={newCredit.is_Money}
                onChange={(e) => setNewCredit({ ...newCredit, is_Money: e.target.checked })}
              />
            }
            label="Is Money"
          />
          <TextField
            label="To Pay Before"
            type="date"
            fullWidth
            margin="normal"
            value={newCredit.toPayBefore}
            onChange={(e) => setNewCredit({ ...newCredit, toPayBefore: e.target.value })}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Comments"
            fullWidth
            margin="normal"
            value={newCredit.comments}
            onChange={(e) => setNewCredit({ ...newCredit, comments: e.target.value })}
          />
          <TextField
            label="Phone"
            fullWidth
            margin="normal"
            value={newCredit.otherSidePhone}
            onChange={(e) => setNewCredit({ ...newCredit, otherSidePhone: e.target.value })}
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={newCredit.otherSideEmail}
            onChange={(e) => setNewCredit({ ...newCredit, otherSideEmail: e.target.value })}
          />
          <TextField
            label="Address"
            fullWidth
            margin="normal"
            value={newCredit.otherSideAdress}
            onChange={(e) => setNewCredit({ ...newCredit, otherSideAdress: e.target.value })}
          />
          <FormControlLabel
            control={
              <Switch
                checked={newCredit.hePaysForUs}
                onChange={(e) => setNewCredit({ ...newCredit, hePaysForUs: e.target.checked })}
              />
            }
            label="He Pays For Us"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleCreateCredit} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Credits;
