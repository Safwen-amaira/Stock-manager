import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
  Box, Button, TextField, FormControl, InputLabel, Select, MenuItem, Modal, Typography,
  Autocomplete, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const API_BASE_URL = 'http://localhost:8000/api';

const Commandes = () => {
  const [commandes, setCommandes] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // Search state
  const currentUserId = localStorage.getItem('userId');

  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [newCommande, setNewCommande] = useState({
    product: null,
    quantity: 1,
    client_name: '',
    client_phone: '',
    client_address: '',
    price_sell: '',
    commande_state: '',
    loss: ''
  });
  const [editCommande, setEditCommande] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchCommandes();
    fetchProducts();
    fetchUsers();
  }, []);

  const fetchCommandes = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/commandes/`);
      setCommandes(response.data || []);
    } catch (error) {
      console.error('Failed to fetch commandes:', error);
      Swal.fire('Error', 'Failed to fetch commandes', 'error');
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/products/`);
      setProducts(response.data.results || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      Swal.fire('Error', 'Failed to fetch products', 'error');
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/list_users/`);
      setUsers(response.data || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      Swal.fire('Error', 'Failed to fetch users', 'error');
    }
  }, []);

  const userIdToUsername = users.reduce((acc, user) => {
    acc[user.id] = user.username;
    return acc;
  }, {});

  const handleAddModalOpen = () => setShowAddModal(true);
  const handleAddModalClose = () => setShowAddModal(false);
  const handleEditModalOpen = (commande) => {
    setEditCommande(commande);
    setShowEditModal(true);
  };
  const handleEditModalClose = () => setShowEditModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCommande(prevState => ({ ...prevState, [name]: value }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditCommande(prevState => ({ ...prevState, [name]: value }));
  };

  const handleAddCommande = async () => {
    try {
      const accessToken = localStorage.getItem('access');
      if (!accessToken) {
        throw new Error('User must be logged in to add a commande.');
      }

      const payload = { ...newCommande, user: currentUserId };

      if (payload.commande_state !== 'Returned') {
        delete payload.loss;
      }

      if (isNaN(payload.quantity) || payload.quantity <= 0) {
        throw new Error('Invalid quantity');
      }

      if (isNaN(payload.price_sell) || payload.price_sell <= 0) {
        throw new Error('Invalid price');
      }

      await axios.post(`${API_BASE_URL}/api/commandes/`, payload, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      Swal.fire('Added!', 'The commande has been added.', 'success');
      fetchCommandes();
      handleAddModalClose();
      setNewCommande({
        product: null,
        quantity: 1,
        client_name: '',
        client_phone: '',
        client_address: '',
        price_sell: '',
        commande_state: '',
        loss: ''
      });
    } catch (error) {
      console.error('Failed to add commande:', error);
      Swal.fire('Error', error.message || 'There was a problem adding the commande.', 'error');
    }
  };

  const handleUpdateCommande = async () => {
    try {
      const payload = { ...editCommande };
      if (payload.commande_state !== 'Retour') {
        delete payload.loss;
      }
      await axios.put(`${API_BASE_URL}/commandes/update/${editCommande.id}/`, payload);
      Swal.fire('Updated!', 'The commande has been updated.', 'success');
      fetchCommandes();
      handleEditModalClose();
    } catch (error) {
      console.error('Failed to update commande:', error);
      Swal.fire('Error', 'There was a problem updating the commande.', 'error');
    }
  };

  const handleDeleteCommande = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this commande!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_BASE_URL}/commandes/${id}/`);
          Swal.fire('Deleted!', 'The commande has been deleted.', 'success');
          fetchCommandes();
        } catch (error) {
          console.error('Failed to delete commande:', error);
          Swal.fire('Error', 'There was a problem deleting the commande.', 'error');
        }
      }
    });
  };

  // Filter commandes based on search query
  const filteredCommandes = commandes.filter((commande) =>
    commande.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    commande.client_phone.includes(searchQuery)
  );

  return (
    <Box p={3}>
      
      <Button variant="contained" color="primary" onClick={handleAddModalOpen}>
        Add Commande
      </Button>
      <br/>
      <br/>
      <br/>
      <TextField
        label="Search by Name or Phone"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <br/>
      <br/>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Client Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>State</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCommandes.map((commande) => (
              <TableRow key={commande.id}>
                <TableCell>{products.find(p => p.id === commande.product)?.name || 'Unknown Product'}</TableCell>
                <TableCell>{commande.quantity}</TableCell>
                <TableCell>{commande.client_name}</TableCell>
                <TableCell>{commande.client_phone}</TableCell>
                <TableCell>{commande.client_address}</TableCell>
                <TableCell>{commande.price_sell}</TableCell>
                <TableCell>{commande.commande_state}</TableCell>
                <TableCell>{userIdToUsername[commande.user] || 'Unknown User'}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditModalOpen(commande)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteCommande(commande.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Add Commande Modal */}
      <Modal open={showAddModal} onClose={handleAddModalClose}>
        <Box sx={modalStyle}>
          <Typography variant="h6">Add Commande</Typography>
          <FormControl fullWidth margin="normal">
            <Autocomplete
              options={products}
              getOptionLabel={(option) => option.name || ''}
              onChange={(e, value) => setNewCommande(prev => ({ ...prev, product: value?.id || null }))}
              renderInput={(params) => <TextField {...params} label="Product" />}
            />
          </FormControl>
          <TextField
            label="Quantity"
            name="quantity"
            type="number"
            value={newCommande.quantity}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Client Name"
            name="client_name"
            value={newCommande.client_name}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Client Phone"
            name="client_phone"
            value={newCommande.client_phone}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Client Address"
            name="client_address"
            value={newCommande.client_address}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Price"
            name="price_sell"
            type="number"
            value={newCommande.price_sell}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>State</InputLabel>
            <Select
              name="commande_state"
              value={newCommande.commande_state}
              onChange={handleInputChange}
            >
              <MenuItem value="En_attente">En_attente</MenuItem>
              <MenuItem value="Payed">Payée</MenuItem>
              <MenuItem value="Retour">Retour</MenuItem>
            </Select>
          </FormControl>
          {newCommande.commande_state === 'Retour' && (
            <TextField
              label="Loss"
              name="loss"
              value={newCommande.loss}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
          )}
          <Box mt={2}>
            <Button onClick={handleAddCommande} variant="contained" color="primary">
              Add
            </Button>
            <Button onClick={handleAddModalClose} variant="outlined" color="secondary">
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
      {/* Edit Commande Modal */}
      <Modal open={showEditModal} onClose={handleEditModalClose}>
        <Box sx={modalStyle}>
          <Typography variant="h6">Edit Commande</Typography>
          <FormControl fullWidth margin="normal">
            <Autocomplete
              options={products}
              getOptionLabel={(option) => option.name || ''}
              value={products.find(p => p.id === editCommande?.product) || null}
              onChange={(e, value) => setEditCommande(prev => ({ ...prev, product: value?.id || null }))}
              renderInput={(params) => <TextField {...params} label="Product" />}
            />
          </FormControl>
          <TextField
            label="Quantity"
            name="quantity"
            type="number"
            value={editCommande?.quantity || ''}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Client Name"
            name="client_name"
            value={editCommande?.client_name || ''}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Client Phone"
            name="client_phone"
            value={editCommande?.client_phone || ''}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Client Address"
            name="client_address"
            value={editCommande?.client_address || ''}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Price"
            name="price_sell"
            type="number"
            value={editCommande?.price_sell || ''}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>State</InputLabel>
            <Select
              name="commande_state"
              value={editCommande?.commande_state || ''}
              onChange={handleEditChange}
            >
              <MenuItem value="En_Attente">En Attente</MenuItem>
              <MenuItem value="Payed">Validée</MenuItem>
              <MenuItem value="Expédiée">Expédiée</MenuItem>
              <MenuItem value="Retour">Retour</MenuItem>
            </Select>
          </FormControl>
          {editCommande?.commande_state === 'Retour' && (
            <TextField
              label="Loss"
              name="loss"
              type="number"
              value={editCommande?.loss || ''}
              onChange={handleEditChange}
              fullWidth
              margin="normal"
            />
          )}
          <Button variant="contained" color="primary" onClick={handleUpdateCommande}>
            Save
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleEditModalClose}>
            Cancel
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 1,
  boxShadow: 24,
  p: 4,
};

export default Commandes;
