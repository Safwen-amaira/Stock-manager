import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';

const Stock = () => {
  const [stocks, setStocks] = useState([]);
  const [products, setProducts] = useState({});
  const [search, setSearch] = useState('');
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [displayedStocks, setDisplayedStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [updateQuantity, setUpdateQuantity] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const STOCKS_PER_PAGE = 30;

  useEffect(() => {
    fetchStocks();
    fetchProducts();
  }, []);

  useEffect(() => {
    filterStocks();
  }, [stocks, products, search]); 

  useEffect(() => {
    paginateStocks();
  }, [filteredStocks, currentPage]);

  const fetchStocks = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/stock/');
      const stockData = response.data.stock || [];
      setStocks(stockData.map(item => ({
        id: item.pk,
        ...item.fields
      })));
    } catch (error) {
      console.error('Error fetching stocks:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/products/');
      const productData = response.data.results || [];
      const productMap = productData.reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
      }, {});
      setProducts(productMap);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const filterStocks = () => {
    const result = stocks.filter(stock =>
      (products[stock.product]?.name || "").toLowerCase().includes(search.toLowerCase()) || 
      stock.quantity.toString().includes(search) 
    );
    setFilteredStocks(result);
  };

  const paginateStocks = () => {
    const startIndex = (currentPage - 1) * STOCKS_PER_PAGE;
    const endIndex = startIndex + STOCKS_PER_PAGE;
    setDisplayedStocks(filteredStocks.slice(startIndex, endIndex));
    setTotalPages(Math.ceil(filteredStocks.length / STOCKS_PER_PAGE));
  };

  const handleShowModal = (stock) => {
    setSelectedStock(stock);
    setUpdateQuantity(stock.quantity);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedStock(null);
    setUpdateQuantity('');
  };

  const handleUpdateStock = async () => {
    if (selectedStock) {
      Swal.fire({
        title: 'Are you sure?',
        text: `You are about to update the quantity for product "${products[selectedStock.product]?.name}".`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, update it!'
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await axios.put(`http://localhost:8000/api/stock/${selectedStock.id}/`, {
              quantity: updateQuantity,
              updated_at: new Date().toISOString()
            });
            Swal.fire(
              'Updated!',
              'Stock quantity has been updated.',
              'success'
            );
            fetchStocks(); 
            handleCloseModal(); 
          } catch (error) {
            console.error('Error updating stock:', error);
            Swal.fire(
              'Error!',
              'There was an issue updating the stock.',
              'error'
            );
          }
        }
      });
    }
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="stock-container">
      <h1>Stock Inventory</h1>
      
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by product name or quantity"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="stock-list">
        {displayedStocks.length === 0 ? (
          <p>No stocks found.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Product ID</th>
                <th>Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedStocks.map(stock => {
                const product = products[stock.product];
                return (
                  <tr key={stock.id}>
                    <td>{product ? product.name : 'Loading...'}</td>
                    <td>{stock.product}</td>
                    <td>{stock.quantity}</td>
                    <td>
                      <Button onClick={() => handleShowModal(stock)} className="edit-btn">Edit</Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <div className="pagination-controls">
        <Button
          variant="secondary"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </Button>
        <span>Page {currentPage} of {totalPages}</span>
        <Button
          variant="secondary"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </Button>
      </div>

      {selectedStock && (
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Stock</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Product Name</Form.Label>
                <Form.Control
                  type="text"
                  value={products[selectedStock.product]?.name || ''}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Barcode</Form.Label>
                <Form.Control
                  type="text"
                  value={products[selectedStock.product]?.barcode || ''} 
                  readOnly
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>New Quantity</Form.Label>
                <Form.Control
                  type="number"
                  value={updateQuantity}
                  onChange={(e) => setUpdateQuantity(e.target.value)}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
            <Button variant="primary" onClick={handleUpdateStock}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      <style jsx>{`
        .stock-container {
          padding: 20px;
        }
        .search-bar {
          margin-bottom: 20px;
        }
        .search-bar input {
          width: 100%;
          padding: 8px;
          font-size: 16px;
        }
        .stock-list {
          margin-top: 20px;
        }
        .table {
          width: 100%;
          border-collapse: collapse;
        }
        .table th,
        .table td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        .table th {
          background-color: #f4f4f4;
        }
        .edit-btn {
          background-color: #007bff;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
        }
        .edit-btn:hover {
          background-color: #0056b3;
        }
        .pagination-controls {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
        }
      `}</style>
    </div>
  );
};

export default Stock;
