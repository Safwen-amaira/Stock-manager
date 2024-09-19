import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
  Box, Button, TextField, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, IconButton,
  Modal, Typography, MenuItem
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Cookies from 'js-cookie';

const API_BASE_URL = 'http://localhost:8000/api';

const Commandes = () => {
  const [commandes, setCommandes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [newCommande, setNewCommande] = useState({
    product: '',
    quantity: 1,
    client_name: '',
    client_phone: '',
    client_address: '',
    price_sell: '',
    commande_state: '',
    loss: ''
  });
  const [editCommande, setEditCommande] = useState({
    id: '',
    product: '',
    quantity: 1,
    client_name: '',
    client_phone: '',
    client_address: '',
    price_sell: '',
    commande_state: '',
    loss: ''
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const currentUserId = localStorage.getItem('userId');
  axios.defaults.headers.common['X-CSRFToken'] = Cookies.get('csrftoken');

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
      console.log('Products response:', response.data.results); // Log response to verify
      setProducts(Array.isArray(response.data.results) ? response.data.results : []);
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
    setNewCommande((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditCommande((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitAdd = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/commandes/`, {
        ...newCommande,
        user: currentUserId,
      });
      fetchCommandes();
      Swal.fire('Success', 'Commande added successfully', 'success');
      handleAddModalClose();
    } catch (error) {
      console.error('Failed to add commande:', error);
      Swal.fire('Error', 'Failed to add commande', 'error');
    }
  };

  const handleSubmitEdit = async () => {
    try {
      await axios.put(`${API_BASE_URL}/commandes/update/${editCommande.id}/`, editCommande);
      fetchCommandes();
      handleEditModalClose();
      Swal.fire('Success', 'Commande updated successfully', 'success');
    } catch (error) {
      console.error('Failed to update commande:', error);
      Swal.fire('Error', 'Failed to update commande', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/commandes/${id}/`);
      fetchCommandes();
    } catch (error) {
      console.error('Failed to delete commande:', error);
      Swal.fire('Error', 'Failed to delete commande', 'error');
    }
  };

  const handleSearch = (e) => setSearchQuery(e.target.value);

  const filteredCommandes = commandes.filter(commande =>
    commande.client_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isLossVisible = (state) => state === 'retour';

  return (
    <Box sx={{ p: 2 }}>
      <Button variant="contained" color="primary" onClick={handleAddModalOpen}>
        Add Commande
      </Button>
      <TextField
        label="Search by Client Name"
        variant="outlined"
        size="small"
        fullWidth
        sx={{ mb: 2, mt: 2 }}
        onChange={handleSearch}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Client Name</TableCell>
              <TableCell>Client Phone</TableCell>
              <TableCell>Client Address</TableCell>
              <TableCell>Price Sell</TableCell>
              <TableCell>Commande State</TableCell>
              <TableCell>Loss</TableCell>
              <TableCell>Ajouté par</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCommandes.map((commande) => (
              <TableRow key={commande.id}>
                <TableCell>{commande.product || ''}</TableCell>
                <TableCell>{commande.quantity || ''}</TableCell>
                <TableCell>{commande.client_name || ''}</TableCell>
                <TableCell>{commande.client_phone || ''}</TableCell>
                <TableCell>{commande.client_address || ''}</TableCell>
                <TableCell>{commande.price_sell || ''}</TableCell>
                <TableCell>{commande.commande_state || ''}</TableCell>
                <TableCell>{isLossVisible(commande.commande_state) ? commande.loss || '' : '-'}</TableCell>
                <TableCell>{userIdToUsername[commande.user] || 'Unknown'}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditModalOpen(commande)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(commande.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={showAddModal} onClose={handleAddModalClose}>
        <Box sx={{ p: 3, maxWidth: 500, mx: 'auto', mt: 5, bgcolor: 'background.paper', boxShadow: 24 }}>
          <Typography variant="h6">Add Commande</Typography>
          <TextField
            label="Product"
            name="product"
            select
            fullWidth
            value={newCommande.product || ''}
            onChange={(e) => setNewCommande({ ...newCommande, product: e.target.value })}
            sx={{ mb: 2 }}
          >
            {products.map((product) => (
              <MenuItem key={product.id} value={product.id}>{product.name}</MenuItem>
            ))}
          </TextField>
          <TextField
            label="Quantity"
            name="quantity"
            type="number"
            fullWidth
            value={newCommande.quantity || 1}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Client Name"
            name="client_name"
            fullWidth
            value={newCommande.client_name || ''}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Client Phone"
            name="client_phone"
            fullWidth
            value={newCommande.client_phone || ''}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Client Address"
            name="client_address"
            fullWidth
            value={newCommande.client_address || ''}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Price Sell"
            name="price_sell"
            fullWidth
            value={newCommande.price_sell || ''}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Commande State"
            name="commande_state"
            select
            fullWidth
            value={newCommande.commande_state || ''}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          >
            <MenuItem value="verifier avec le client">Vérifier avec le client</MenuItem>
            <MenuItem value="payee">Payée</MenuItem>
            <MenuItem value="en cours de livraison">En cours de livraison</MenuItem>
            <MenuItem value="retour">Retour</MenuItem>
            <MenuItem value="En transit">En transit</MenuItem>
            <MenuItem value="En dépot">En dépot</MenuItem>


          </TextField>
          {isLossVisible(newCommande.commande_state) && (
            <TextField
              label="Loss"
              name="loss"
              fullWidth
              value={newCommande.loss || ''}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
          )}
          <Button variant="contained" color="primary" onClick={handleSubmitAdd}>
            Submit
          </Button>
        </Box>
      </Modal>

      <Modal open={showEditModal} onClose={handleEditModalClose}>
        <Box sx={{ p: 3, maxWidth: 500, mx: 'auto', mt: 5, bgcolor: 'background.paper', boxShadow: 24 }}>
          <Typography variant="h6">Edit Commande</Typography>
          <TextField
            label="Product"
            name="product"
            select
            fullWidth
            value={editCommande.product || ''}
            onChange={handleEditInputChange}
            sx={{ mb: 2 }}
          >
            {products.map((product) => (
              <MenuItem key={product.id} value={product.id}>{product.name}</MenuItem>
            ))}
          </TextField>
          <TextField
            label="Quantity"
            name="quantity"
            type="number"
            fullWidth
            value={editCommande.quantity || 1}
            onChange={handleEditInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Client Name"
            name="client_name"
            fullWidth
            value={editCommande.client_name || ''}
            onChange={handleEditInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Client Phone"
            name="client_phone"
            fullWidth
            value={editCommande.client_phone || ''}
            onChange={handleEditInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Client Address"
            name="client_address"
            fullWidth
            value={editCommande.client_address || ''}
            onChange={handleEditInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Price Sell"
            name="price_sell"
            fullWidth
            value={editCommande.price_sell || ''}
            onChange={handleEditInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Commande State"
            name="commande_state"
            select
            fullWidth
            value={editCommande.commande_state || ''}
            onChange={handleEditInputChange}
            sx={{ mb: 2 }}
          >
            
            <MenuItem value="verifier avec le client">Vérifier avec le client</MenuItem>
            <MenuItem value="payee">Payée</MenuItem>
            <MenuItem value="en cours de livraison">En cours de livraison</MenuItem>
            <MenuItem value="retour">Retour</MenuItem>
            <MenuItem value="En transit">En transit</MenuItem>
            <MenuItem value="En dépot">En dépot</MenuItem>
          </TextField>
          {isLossVisible(editCommande.commande_state) && (
            <TextField
              label="Loss"
              name="loss"
              fullWidth
              value={editCommande.loss || ''}
              onChange={handleEditInputChange}
              sx={{ mb: 2 }}
            />
          )}
          <Button variant="contained" color="primary" onClick={handleSubmitEdit}>
            Save Changes
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default Commandes;
