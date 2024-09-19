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

const Partners = () => {
  const [reseaux, setReseaux] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newReseau, setNewReseau] = useState({
    nom: '',
    relation: '',
    is_contract: false,
    num_tel: '',
    num_fax: '',
    email: '',
    adresse: '',
    webSite: '',
    contract_begin: '',
    contract_end: ''
  });
  const [editReseau, setEditReseau] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  axios.defaults.headers.common['X-CSRFToken'] = Cookies.get('csrftoken');

  useEffect(() => {
    fetchReseaux();
  }, []);

  const fetchReseaux = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/reseau/getall`);
      setReseaux(response.data || []);
    } catch (error) {
      console.error('Failed to fetch reseaux:', error);
      Swal.fire('Error', 'Failed to fetch reseaux', 'error');
    }
  }, []);

  const handleAddModalOpen = () => setShowAddModal(true);
  const handleAddModalClose = () => setShowAddModal(false);
  const handleEditModalOpen = (reseau) => {
    setEditReseau(reseau);
    setShowEditModal(true);
  };
  const handleEditModalClose = () => setShowEditModal(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewReseau((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleEditInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditReseau((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmitAdd = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/reseau/`, newReseau);
      fetchReseaux();
      Swal.fire('Success', 'Reseau added successfully', 'success');
      handleAddModalClose();
    } catch (error) {
      console.error('Failed to add reseau:', error);
      Swal.fire('Error', 'Failed to add reseau', 'error');
    }
  };

  const handleSubmitEdit = async () => {
    try {
      await axios.put(`${API_BASE_URL}/reseau/update/${editReseau.id}/`, editReseau);
      fetchReseaux();
      handleEditModalClose();
      Swal.fire('Success', 'Reseau updated successfully', 'success');
    } catch (error) {
      console.error('Failed to update reseau:', error);
      Swal.fire('Error', 'Failed to update reseau', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/reseau/delete/${id}/`);
      fetchReseaux();
    } catch (error) {
      console.error('Failed to delete reseau:', error);
      Swal.fire('Error', 'Failed to delete reseau', 'error');
    }
  };

  const handleSearch = (e) => setSearchQuery(e.target.value);

  const filteredReseaux = reseaux.filter(reseau =>
    reseau.nom.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ p: 2 }}>
      <Button variant="contained" color="primary" onClick={handleAddModalOpen}>
        Add Reseau
      </Button>
      <TextField
        label="Search by Name"
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
              <TableCell>Name</TableCell>
              <TableCell>Relation</TableCell>
              <TableCell>Contract</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Fax</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Website</TableCell>
              <TableCell>Contract Begin</TableCell>
              <TableCell>Contract End</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredReseaux.map((reseau) => (
              <TableRow key={reseau.id}>
                <TableCell>{reseau.nom || ''}</TableCell>
                <TableCell>{reseau.relation || ''}</TableCell>
                <TableCell>{reseau.is_contract ? 'Yes' : 'No'}</TableCell>
                <TableCell>{reseau.num_tel || ''}</TableCell>
                <TableCell>{reseau.num_fax || ''}</TableCell>
                <TableCell>{reseau.email || ''}</TableCell>
                <TableCell>{reseau.adresse || ''}</TableCell>
                <TableCell>{reseau.webSite || ''}</TableCell>
                <TableCell>{reseau.contract_begin || ''}</TableCell>
                <TableCell>{reseau.contract_end || ''}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditModalOpen(reseau)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(reseau.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={showAddModal} onClose={handleAddModalClose}>
        <Box sx={{ p: 3, maxWidth: 500, mx: 'auto', mt: 5, bgcolor: 'background.paper', boxShadow: 24, overflowY: 'auto', maxHeight: '80vh' }}>
          <Typography variant="h6">Add Reseau</Typography>
          <TextField
            label="Name"
            name="nom"
            fullWidth
            value={newReseau.nom || ''}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Relation"
            name="relation"
            fullWidth
            value={newReseau.relation || ''}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Is Contract"
            name="is_contract"
            type="checkbox"
            checked={newReseau.is_contract}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Phone"
            name="num_tel"
            fullWidth
            value={newReseau.num_tel || ''}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Fax"
            name="num_fax"
            fullWidth
            value={newReseau.num_fax || ''}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Email"
            name="email"
            fullWidth
            value={newReseau.email || ''}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Address"
            name="adresse"
            fullWidth
            value={newReseau.adresse || ''}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Website"
            name="webSite"
            fullWidth
            value={newReseau.webSite || ''}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Contract Begin"
            name="contract_begin"
            type="date"
            fullWidth
            value={newReseau.contract_begin || ''}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Contract End"
            name="contract_end"
            type="date"
            fullWidth
            value={newReseau.contract_end || ''}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" color="primary" onClick={handleSubmitAdd}>
            Add
          </Button>
        </Box>
      </Modal>

      <Modal open={showEditModal} onClose={handleEditModalClose}>
        <Box sx={{ p: 3, maxWidth: 500, mx: 'auto', mt: 5, bgcolor: 'background.paper', boxShadow: 24, overflowY: 'auto', maxHeight: '80vh' }}>
          <Typography variant="h6">Edit Reseau</Typography>
          <TextField
            label="Name"
            name="nom"
            fullWidth
            value={editReseau.nom || ''}
            onChange={handleEditInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Relation"
            name="relation"
            fullWidth
            value={editReseau.relation || ''}
            onChange={handleEditInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Is Contract"
            name="is_contract"
            type="checkbox"
            checked={editReseau.is_contract}
            onChange={handleEditInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Phone"
            name="num_tel"
            fullWidth
            value={editReseau.num_tel || ''}
            onChange={handleEditInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Fax"
            name="num_fax"
            fullWidth
            value={editReseau.num_fax || ''}
            onChange={handleEditInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Email"
            name="email"
            fullWidth
            value={editReseau.email || ''}
            onChange={handleEditInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Address"
            name="adresse"
            fullWidth
            value={editReseau.adresse || ''}
            onChange={handleEditInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Website"
            name="webSite"
            fullWidth
            value={editReseau.webSite || ''}
            onChange={handleEditInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Contract Begin"
            name="contract_begin"
            type="date"
            fullWidth
            value={editReseau.contract_begin || ''}
            onChange={handleEditInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Contract End"
            name="contract_end"
            type="date"
            fullWidth
            value={editReseau.contract_end || ''}
            onChange={handleEditInputChange}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" color="primary" onClick={handleSubmitEdit}>
            Save
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default Partners;
