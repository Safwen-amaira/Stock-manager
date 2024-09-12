import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Accordion, Spinner, Form } from 'react-bootstrap';
import TypographyMUI from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Rating from '@mui/material/Rating';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

const stateOptions = ['Retour', 'En_attente', 'payed', 'Verified'];

const ClientsList = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [clientFilters, setClientFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedCommande, setSelectedCommande] = useState(null);
  const [products, setProducts] = useState([]); 

  useEffect(() => {
    // Fetch clients data
    const fetchClients = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/commandes/');
        const commandesData = response.data;

        const clientsMap = commandesData.reduce((acc, commande) => {
          const clientName = capitalizeClientName(commande.client_name);
          if (!acc[clientName]) {
            acc[clientName] = {
              client_name: clientName,
              client_phones: [],
              commandes: [],
            };
          }

          if (!acc[clientName].client_phones.includes(commande.client_phone)) {
            acc[clientName].client_phones.push(commande.client_phone);
          }
          acc[clientName].commandes.push(commande);
          return acc;
        }, {});

        const clientsArray = Object.values(clientsMap);
        setClients(clientsArray);
        setFilteredClients(clientsArray);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch clients:', error);
        setLoading(false);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/products/');
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          console.error('Unexpected response format:', response.data);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchClients();
    fetchProducts(); 
  }, []);

  useEffect(() => {
    let filtered = clients;

    if (searchTerm !== '') {
      const lowercasedTerm = searchTerm.toLowerCase();
      filtered = filtered.filter((client) => {
        const nameMatch = client.client_name.toLowerCase().includes(lowercasedTerm);
        const phoneMatch = client.client_phones.some((phone) => phone.toLowerCase().includes(lowercasedTerm));
        return nameMatch || phoneMatch;
      });
    }

    filtered = filtered.map((client) => ({
      ...client,
      commandes: client.commandes.filter(
        (commande) => !clientFilters[client.client_name] || commande.commande_state === clientFilters[client.client_name]
      ),
    }));

    setFilteredClients(filtered);
  }, [searchTerm, clientFilters, clients]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleStateChange = (clientName, event) => {
    setClientFilters((prevFilters) => ({
      ...prevFilters,
      [clientName]: event.target.value,
    }));
  };

  const capitalizeClientName = (name) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const calculatePayedPercentage = (commandes) => {
    if (commandes.length === 0) return 0;
    const payedCount = commandes.filter((commande) => commande.commande_state === 'payed').length;
    return (payedCount / commandes.length) * 100;
  };

  const getStarRating = (percentage) => {
    return (percentage / 100) * 5;
  };

  const handleRowClick = (commande) => {
    setSelectedCommande(commande);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedCommande(null);
  };

  const getProductNameById = (productId) => {

    if (!Array.isArray(products)) {
      console.error('Products data is not an array:', products);
      return 'Unknown Product';
    }

    const product = products.find((p) => p.id === productId);
    return product ? product.name : 'Unknown Product';
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <TypographyMUI variant="h4" sx={{ marginBottom: '20px' }}>Clients List</TypographyMUI>

      <TextField
        label="Search by name or phone"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={handleSearchChange}
        sx={{ marginBottom: '20px' }}
      />

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Spinner animation="border" />
        </div>
      ) : (
        <div>
          {filteredClients.length > 0 ? (
            filteredClients.map((client, index) => {
              const payedPercentage = calculatePayedPercentage(client.commandes);
              const starRating = getStarRating(payedPercentage);

              return (
                <Accordion key={index} className="mb-3">
                  <Accordion.Item eventKey={index.toString()}>
                    <Accordion.Header>
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <TypographyMUI variant="h6" sx={{ flexGrow: 1 }}>{client.client_name}</TypographyMUI>
                        <Rating
                          name={`client-rating-${index}`}
                          value={starRating}
                          precision={0.5}
                          readOnly
                          sx={{ marginLeft: '20px' }}
                        />
                      </Box>
                    </Accordion.Header>
                    <Accordion.Body>
                      <Form.Select
                        aria-label={`Filter ${client.client_name} commandes`}
                        value={clientFilters[client.client_name] || ''}
                        onChange={(e) => handleStateChange(client.client_name, e)}
                        sx={{ marginBottom: '20px' }}
                        style={{ width: 'fit-content' }}
                      >
                        <option value="">All States</option>
                        {stateOptions.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </Form.Select>
                      <br />
                      {client.commandes.length > 0 ? (
                        <TableContainer component={Paper} sx={{ marginTop: '10px' }}>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>State</TableCell>
                                <TableCell>Profit</TableCell>
                                <TableCell>Loss</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {client.commandes.map((commande) => (
                                <TableRow
                                  key={commande.id}
                                  onClick={() => handleRowClick(commande)}
                                  sx={{ cursor: 'pointer' }}
                                  hover
                                >
                                  <TableCell>{commande.id}</TableCell>
                                  <TableCell>{commande.commande_state}</TableCell>
                                  <TableCell>${parseFloat(commande.profit || 0).toFixed(2)}</TableCell>
                                  <TableCell>${parseFloat(commande.loss || 0).toFixed(2)}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      ) : (
                        <TypographyMUI>No commandes found for this client.</TypographyMUI>
                      )}
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              );
            })
          ) : (
            <TypographyMUI>No clients found.</TypographyMUI>
          )}
        </div>
      )}

      {/* Modal */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth>
        <DialogTitle>Commande Details</DialogTitle>
        <DialogContent>
          {selectedCommande && (
            <div>
              <TypographyMUI variant="body1">
                <strong>Commande ID:</strong> {selectedCommande.id}
              </TypographyMUI>
              <TypographyMUI variant="body1">
                <strong>Product:</strong> {getProductNameById(selectedCommande.product_id)}
              </TypographyMUI>
              <TypographyMUI variant="body1">
                <strong>State:</strong> {selectedCommande.commande_state}
              </TypographyMUI>
              <TypographyMUI variant="body1">
                <strong>Profit:</strong> ${parseFloat(selectedCommande.profit || 0).toFixed(2)}
              </TypographyMUI>
              <TypographyMUI variant="body1">
                <strong>Loss:</strong> ${parseFloat(selectedCommande.loss || 0).toFixed(2)}
              </TypographyMUI>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClientsList;
