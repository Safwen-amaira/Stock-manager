import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button
} from '@mui/material';

const Factorisation = () => {
  const [sells, setSells] = useState([]);
  const [products, setProducts] = useState({});
  const [selectedSell, setSelectedSell] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchSells = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/sells/');
        console.log(response.data); // Check what data is being returned
        const data = response.data;
        if (data.sells) {
          const sortedSells = data.sells.sort((a, b) => new Date(b.sell_date) - new Date(a.sell_date));
          setSells(sortedSells);
        } else {
          throw new Error('Unexpected data format');
        }
      } catch (error) {
        console.error('Failed to fetch sells:', error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/products/');
        console.log(response.data); // Check what data is being returned
        const data = response.data;
        if (data.results) {
          const productsMap = data.results.reduce((map, product) => {
            map[product.id] = product.name;
            return map;
          }, {});
          setProducts(productsMap);
        } else {
          throw new Error('Unexpected data format');
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchSells();
    fetchProducts();
  }, []);

  const handleRowClick = (sell) => {
    setSelectedSell(sell);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedSell(null);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Sales Overview
      </Typography>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sell ID</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Quantity Sold</TableCell>
              <TableCell>Sell Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sells.map((sell) => (
              <TableRow
                key={sell.id}
                hover
                onClick={() => handleRowClick(sell)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>{sell.id}</TableCell>
                <TableCell>{products[sell.product] || 'Unknown Product'}</TableCell>
                <TableCell>{sell.quantity_selled}</TableCell>
                <TableCell>{new Date(sell.sell_date).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedSell && (
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Sell Details</DialogTitle>
          <DialogContent>
            <Typography variant="h6">Sell ID: {selectedSell.id}</Typography>
            <Typography variant="body1">Product Name: {products[selectedSell.product] || 'Unknown Product'}</Typography>
            <Typography variant="body1">Quantity Sold: {selectedSell.quantity_selled}</Typography>
            <Typography variant="body1">Sell Date: {new Date(selectedSell.sell_date).toLocaleString()}</Typography>
            {/* Add more details if needed */}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default Factorisation;
