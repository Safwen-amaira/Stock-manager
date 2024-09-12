import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Pagination, Modal, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, FormControlLabel, Checkbox } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import Swal from 'sweetalert2';
import axios from 'axios';

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    is_superuser: false,
    is_staff: false
  });
  const [editUser, setEditUser] = useState(null);

  const usersPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const startIndex = (currentPage - 1) * usersPerPage;
    const endIndex = startIndex + usersPerPage;
    setDisplayedUsers(users.slice(startIndex, endIndex));
  }, [users, currentPage]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/list_users/');
      setUsers(response.data);
      setTotalPages(Math.ceil(response.data.length / usersPerPage));
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleAddModalOpen = () => setShowAddModal(true);
  const handleAddModalClose = () => {
    setShowAddModal(false);
    setNewUser({
      username: '',
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      is_superuser: false,
      is_staff: false
    });
  };

  const handleEditModalOpen = (user) => {
    setEditUser(user);
    setShowEditModal(true);
  };

  const handleEditModalClose = () => {
    setShowEditModal(false);
    setEditUser(null);
  };

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setNewUser({
      ...newUser,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleEditChange = (event) => {
    const { name, value, type, checked } = event.target;
    setEditUser({
      ...editUser,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleAddUser = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/add_user/', newUser);
      if (response.status === 201) {
        Swal.fire('Added!', 'The user has been added.', 'success');
        fetchUsers();
        handleAddModalClose();
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (error) {
      console.error('Failed to add user:', error);
      Swal.fire('Error!', 'There was a problem adding the user.', 'error');
    }
  };

  const handleEditUser = async () => {
    if (editUser) {
      try {
        const response = await axios.put(`http://localhost:8000/api/update_user/${editUser.id}/`, editUser);
        if (response.status === 200) {
          Swal.fire('Updated!', 'The user has been updated.', 'success');
          fetchUsers();
          handleEditModalClose();
        } else {
          throw new Error('Unexpected response format');
        }
      } catch (error) {
        console.error('Failed to update user:', error);
        Swal.fire('Error!', 'There was a problem updating the user.', 'error');
      }
    } else {
      Swal.fire('Error!', 'No user selected for editing.', 'error');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>
      <Button variant="contained" color="primary" onClick={handleAddModalOpen}>
        Add User
      </Button>

      <Box sx={{ mt: 3 }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Superuser</TableCell>
                <TableCell>Staff</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.first_name}</TableCell>
                  <TableCell>{user.last_name}</TableCell>
                  <TableCell>{user.is_superuser ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{user.is_staff ? 'Yes' : 'No'}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditModalOpen(user)}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>

      {/* Add User Modal */}
      <Modal open={showAddModal} onClose={handleAddModalClose}>
        <Box sx={{ p: 3, maxWidth: 600, margin: 'auto', mt: 5, bgcolor: 'background.paper', boxShadow: 24, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Add User
          </Typography>
          <TextField
            label="Username"
            name="username"
            value={newUser.username}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            value={newUser.email}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Password"
            type="password"
            name="password"
            value={newUser.password}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="First Name"
            name="first_name"
            value={newUser.first_name}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Last Name"
            name="last_name"
            value={newUser.last_name}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <FormControlLabel
            control={
              <Checkbox
                name="is_superuser"
                checked={newUser.is_superuser}
                onChange={handleInputChange}
              />
            }
            label="Superuser"
          />
          <FormControlLabel
            control={
              <Checkbox
                name="is_staff"
                checked={newUser.is_staff}
                onChange={handleInputChange}
              />
            }
            label="Staff"
          />
          <Button variant="contained" color="primary" onClick={handleAddUser} sx={{ mt: 2 }}>
            Add
          </Button>
        </Box>
      </Modal>

      {/* Edit User Modal */}
      <Modal open={showEditModal} onClose={handleEditModalClose}>
        <Box sx={{ p: 3, maxWidth: 600, margin: 'auto', mt: 5, bgcolor: 'background.paper', boxShadow: 24, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Edit User
          </Typography>
          <TextField
            label="Username"
            name="username"
            value={editUser?.username || ''}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            value={editUser?.email || ''}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Password"
            type="password"
            name="password"
            value={editUser?.password || ''}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="First Name"
            name="first_name"
            value={editUser?.first_name || ''}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Last Name"
            name="last_name"
            value={editUser?.last_name || ''}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <FormControlLabel
            control={
              <Checkbox
                name="is_superuser"
                checked={editUser?.is_superuser || false}
                onChange={handleEditChange}
              />
            }
            label="Superuser"
          />
          <FormControlLabel
            control={
              <Checkbox
                name="is_staff"
                checked={editUser?.is_staff || false}
                onChange={handleEditChange}
              />
            }
            label="Staff"
          />
          <Button variant="contained" color="primary" onClick={handleEditUser} sx={{ mt: 2 }}>
            Update
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default UserManager;
