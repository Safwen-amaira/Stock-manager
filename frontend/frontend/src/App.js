// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ProductList from './components/ProductList';
import ProductDetails from './components/ProductDetails';
import Dashboard from './components/Dashboard';
import Stock from './components/Stock';
import Totals from './components/Totals';
import 'bootstrap/dist/css/bootstrap.min.css';
import Factorisation from './components/Factorisation';
import './App.css'
import Commandes from './components/Commandes';
import Retours from './components/Retours';
import Login from './components/Login';
import UserManager from './components/UserManager';
import None from './components/None';
import ClientsList from './components/ClientsList';
import Credits from './components/Credits';
import HelloWorld from './components/HelloWorld';

const theme = createTheme(); 

function App() {
    return (
        <ThemeProvider theme={theme}>
            <Router>
                <div className="App">
                    <Routes>
                        <Route path='/' element={<Login/>}/>
                        <Route path="/product-detail" element={<ProductDetails />} />
                        <Route path="/dashboard-admin" element={<Dashboard />}>
                            <Route path="profits" element={<Factorisation />} />
                            <Route path="stock" element={<Stock />} />
                            <Route path="totals" element={<Totals />} />
                            <Route path="commandes" element={<Commandes/>}/>
                            <Route path="retours" element={<Retours/>}/>
                            <Route path="products" element={<ProductList/>}/>
                            <Route path="user-manager" element={<UserManager/>}/>
                            <Route path='*' element={<None/>}/>
                            <Route path="list" element={<ClientsList/>}/>
                            <Route path='Credits' element={<Credits/>}/>

                        </Route>
                    <Route path='*' element={<None/>}/>
                    <Route path='/helloworld' element={<HelloWorld/>}/>
                    </Routes>
                </div>
            </Router>
        </ThemeProvider>
    );
}

export default App;
