import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Grid, Modal, Box, Pagination, TextField, IconButton } from '@mui/material';
import { AddPhotoAlternate as AddPhotoAlternateIcon } from '@mui/icons-material'; // Icon for adding image
import Swal from 'sweetalert2';
import axios from 'axios';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    product_category: '',
    price_buy: '',
    price_sell: '',
    product_description: '',
    barcode: '',
    product_image1: null,
    product_image2: null,
    product_image3: null,
    product_image4: null,
    product_image5: null,
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/products/?page=${page}`);
        setProducts(response.data.results);
        setTotalPages(response.data.total_pages);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchProducts();
  }, [page]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setNewProduct((prevState) => ({
      ...prevState,
      [name]: files[0],
    }));
  };

  const handleAddProduct = async () => {
    const formData = new FormData();
    for (const key in newProduct) {
      if (newProduct[key]) {
        formData.append(key, newProduct[key]);
      }
    }
        setOpenModal(false)
    try {
      const response = await axios.post('http://localhost:8000/api/products/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      Swal.fire({
        title: 'Success!',
        text: 'Product added successfully!',
        icon: 'success',
        customClass: {
          popup: 'swal-popup',
        },
      });
      setOpenModal(false);
      setNewProduct({
        name: '',
        product_category: '',
        price_buy: '',
        price_sell: '',
        product_description: '',
        barcode: '',
        product_image1: null,
        product_image2: null,
        product_image3: null,
        product_image4: null,
        product_image5: null,
      });

      const fetchProducts = async () => {
        try {
          const response = await axios.get(`http://localhost:8000/api/products/?page=${page}`);
          setProducts(response.data.results);
        } catch (error) {
          console.error('Failed to fetch products:', error);
        }
      };
      fetchProducts();
    } catch (error) {
      console.error('Failed to add product:', error.response ? error.response.data : error.message);
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to add product!',
        icon: 'error',
        customClass: {
          popup: 'swal-popup',
        },
      });
    }
  };

  const handleAddImage = (imageField) => {
    document.getElementById(imageField).click();
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleOpenModal} sx={{ mb: 2 }}>
        Add New Product
      </Button>

      <Grid container spacing={2}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card sx={{ maxWidth: 345, margin: 'auto', boxShadow: 3 }}>
              {product.product_image1 && (
                <CardMedia
                  component="img"
                  height="140"
                  image={`http://localhost:8000${product.product_image1}`}
                  alt={product.name}
                />
              )}
              <CardContent>
                <Typography variant="h5" component="div">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Category: {product.product_category}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Buy Price: ${product.price_buy}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Sell Price: ${product.price_sell}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.product_description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Barcode: {product.barcode}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Pagination
        count={totalPages}
        page={page}
        onChange={handlePageChange}
        color="primary"
        sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
      />

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
          p: 4,
        }}>
          <Typography id="modal-title" variant="h6" component="h2">
            Add New Product
          </Typography>
          <TextField
            label="Name"
            name="name"
            value={newProduct.name}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Category"
            name="product_category"
            value={newProduct.product_category}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Buy Price"
            name="price_buy"
            value={newProduct.price_buy}
            onChange={handleInputChange}
            type="number"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Sell Price"
            name="price_sell"
            value={newProduct.price_sell}
            onChange={handleInputChange}
            type="number"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            name="product_description"
            value={newProduct.product_description}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            multiline
            rows={3}
          />
          <TextField
            label="Barcode"
            name="barcode"
            value={newProduct.barcode}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {['product_image1', 'product_image2', 'product_image3', 'product_image4', 'product_image5'].map((imageField, index) => (
              <Grid item xs={2} key={index}>
                <IconButton
                  color="primary"
                  aria-label={`upload picture ${index + 1}`}
                  component="span"
                  onClick={() => handleAddImage(imageField)}
                >
                  <AddPhotoAlternateIcon />
                </IconButton>
                <input
                  type="file"
                  id={imageField}
                  name={imageField}
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
              </Grid>
            ))}
          </Grid>

          <Button
            variant="contained"
            color="primary"
            onClick={handleAddProduct}
            sx={{ mt: 3 }}
          >
            Add Product
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default ProductList;
