import React, { createContext, useState, useContext } from 'react';

const ProductContext = createContext();

export function ProductProvider({ children }) {
    const [product, setProduct] = useState(null);

    return (
        <ProductContext.Provider value={{ product, setProduct }}>
            {children}
        </ProductContext.Provider>
    );
}

export function useProduct() {
    return useContext(ProductContext);
}
