import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
  Box, Button, TextField, FormControl, InputLabel, Select, MenuItem, Modal, Typography,
  Autocomplete, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Commandes = () => {
  const [commandes, setCommandes] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [newCommande, setNewCommande] = useState({
    product: null,
    quantity: '',
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

  const fetchCommandes = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/commandes/');
      setCommandes(response.data || []);
    } catch (error) {
      console.error('Failed to fetch commandes:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/products/');
      console.log('Fetched products:', response.data); // Log the data
      setProducts(Array.isArray(response.data.results) ? response.data.results : []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/list_users/');
      setUsers(response.data || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

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
      // Include loss only if the state is 'Retour'
      const payload = { ...newCommande };
      if (payload.commande_state !== 'Retour') {
        delete payload.loss;
      }
      await axios.post('http://localhost:8000/api/api/commandes/', payload);
      Swal.fire('Added!', 'The commande has been added.', 'success');
      fetchCommandes();
      handleAddModalClose();
    } catch (error) {
      console.error('Failed to add commande:', error);
      Swal.fire('Error', 'There was a problem adding the commande.', 'error');
    }
  };

  const handleUpdateCommande = async () => {
    try {
      // Include loss only if the state is 'Retour'
      const payload = { ...editCommande };
      if (payload.commande_state !== 'Retour') {
        delete payload.loss;
      }
      await axios.put(`http://localhost:8000/api/commandes/update/${editCommande.id}/`, payload);
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
          await axios.delete(`http://localhost:8000/api/commandes/${id}/`);
          Swal.fire('Deleted!', 'The commande has been deleted.', 'success');
          fetchCommandes();
        } catch (error) {
          console.error('Failed to delete commande:', error);
          Swal.fire('Error', 'There was a problem deleting the commande.', 'error');
        }
      }
    });
  };

  return (
    <Box p={3}>
      <Button variant="contained" color="primary" onClick={handleAddModalOpen}>
        Add Commande
      </Button>
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
            {commandes.map((commande) => (
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
              <MenuItem value="En Attente">En Attente</MenuItem>
              <MenuItem value="Validée">Validée</MenuItem>
              <MenuItem value="Expédiée">Expédiée</MenuItem>
              <MenuItem value="Retour">Retour</MenuItem>
            </Select>
          </FormControl>
          {newCommande.commande_state === 'Retour' && (
            <TextField
              label="Loss"
              name="loss"
              type="number"
              value={newCommande.loss}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
          )}
          <Button variant="contained" color="primary" onClick={handleAddCommande}>
            Add
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleAddModalClose}>
            Cancel
          </Button>
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
              <MenuItem value="En Attente">En Attente</MenuItem>
              <MenuItem value="Validée">Validée</MenuItem>
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
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default Commandes;
