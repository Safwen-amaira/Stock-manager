// src/components/ProductDetail.js
import React from 'react';
import { useProduct } from '../contexts/ProductContext';
import { useNavigate } from 'react-router-dom';

function ProductDetail() {
    const { product, setProduct } = useProduct();
    const navigate = useNavigate();

    if (!product) {
        navigate('/');
        return null;
    }

    const handleDelete = () => {
        // Assuming delete logic is implemented
        setProduct(null); // Clear product context
        navigate('/');
    };

    return (
        <div>
            <h1>{product.name}</h1>
            <p>Description: {product.description}</p>
            <p>Price: ${product.price}</p>
            <p>Stock: {product.stock_quantity}</p>
            <button onClick={handleDelete}>Delete</button>
        </div>
    );
}

export default ProductDetail;
