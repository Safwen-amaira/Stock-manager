import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Button,
  Modal,
  TextField,
} from '@mui/material';
import {
  PieChart as RechartsPieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from 'recharts';

const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const RADIAN = Math.PI / 180;
  const radius = 25 + innerRadius + (outerRadius - innerRadius) / 2;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const Totals = () => {
  const [totalProfits, setTotalProfits] = useState(0);
  const [totalLoses, setTotalLoses] = useState(0);
  const [totalIncomes, setTotalIncomes] = useState(0);
  const [totalCommandes, setTotalCommandes] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [commandes, setCommandes] = useState([]);
  const [filter, setFilter] = useState('all');
  const [commandeStates, setCommandeStates] = useState({});
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const fetchTotals = async () => {
      try {
        const commandesResponse = await axios.get('http://localhost:8000/api/commandes/');
        const commandesData = commandesResponse.data;

        const productsResponse = await axios.get('http://localhost:8000/api/products/');
        const productsData = productsResponse.data;

        const productsArray = productsData.results || [];

        let profits = 0;
        let loses = 0;
        let incomes = 0;

        const productPriceMap = productsArray.reduce((map, product) => {
          if (product.id && product.price_buy) {
            map[product.id] = parseFloat(product.price_buy) || 0;
          }
          return map;
        }, {});

        const stateCounts = commandesData.reduce((counts, commande) => {
          counts[commande.commande_state] = (counts[commande.commande_state] || 0) + 1;
          return counts;
        }, {});

        setTotalCommandes(commandesData.length);
        setTotalProducts(productsArray.length);
        setCommandeStates(stateCounts);

        commandesData.forEach(commande => {
          const createdAt = new Date(commande.created_at);
          const isWithinDateRange = startDate && endDate
            ? createdAt >= new Date(startDate) && createdAt <= new Date(endDate)
            : true;

          const priceSell = parseFloat(commande.price_sell) || 0;
          const quantity = parseFloat(commande.quantity) || 0;
          const priceBuy = productPriceMap[commande.product] || 0;

          if (isWithinDateRange) {
            if (commande.commande_state === 'payee') {
              const profit = priceSell - (priceBuy * quantity);
              profits += profit;
              incomes += priceSell;
            }
            if (commande.commande_state === 'retour') {
              const loss = parseFloat(commande.loss) || 0;
              loses += loss;
            }
          }
        });

        setTotalProfits(profits);
        setTotalLoses(loses);
        setTotalIncomes(incomes);
        setCommandes(commandesData);
      } catch (error) {
        console.error('Failed to fetch totals:', error);
      }
    };

    fetchTotals();
  }, [startDate, endDate]);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleDateFilter = () => {
    handleCloseModal();
  };

  const chartData = [
    { name: 'Total Incomes', value: totalIncomes, color: '#007bff' },
    { name: 'Total Profits', value: totalProfits, color: '#28a745' },
    { name: 'Total Loses', value: totalLoses, color: '#dc3545' },
  ];

  return (
    <Box sx={{ padding: '0px' }}>
      <center>
        <h1>Résumé en chartes</h1>
        <br/><br/><br/>
        <Button variant="outlined" onClick={handleOpenModal}>
          Filter by Date
        </Button>
        <Modal open={openModal} onClose={handleCloseModal}>
          <Box sx={{ padding: 3, backgroundColor: 'white', borderRadius: 2, maxWidth: 400, margin: 'auto', marginTop: '10%' }}>
            <Typography variant="h6">Select Date Range</Typography>
            <TextField
              label="Start Date"
              type="date"
              fullWidth
              margin="normal"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="End Date"
              type="date"
              fullWidth
              margin="normal"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <Button variant="contained" onClick={handleDateFilter}>
              Apply Filter
            </Button>
          </Box>
        </Modal>
      </center>
      <br/><br/><br/>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ borderRadius: '16px', boxShadow: 3 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6">Chiffre d'affaires</Typography>
              <Box sx={{ height: 90, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={chartData.filter(item => item.name === 'Total Incomes')}
                      cx="50%"
                      cy="50%"
                      innerRadius={20}
                      outerRadius={30}
                      fill="#8884d8"
                      dataKey="value"
                      labelLine={false}
                      label={CustomLabel}
                    >
                      {chartData.filter(item => item.name === 'Total Incomes').map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </Box>
              <Typography variant="h5" sx={{ color: 'blue', marginTop: '10px' }}>
                {totalIncomes.toFixed(2)} TND
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ borderRadius: '16px', boxShadow: 3, background: '#f8f9fa' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6">Profits Totales</Typography>
              <Box sx={{ height: 90, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={chartData.filter(item => item.name === 'Total Profits')}
                      cx="50%"
                      cy="50%"
                      innerRadius={20}
                      outerRadius={30}
                      fill="#8884d8"
                      dataKey="value"
                      labelLine={false}
                      label={CustomLabel}
                    >
                      {chartData.filter(item => item.name === 'Total Profits').map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </Box>
              <Typography variant="h5" sx={{ color: 'green', marginTop: '10px' }}>
                {totalProfits.toFixed(2)} TND
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ borderRadius: '16px', boxShadow: 3 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6">Pertes totales</Typography>
              <Box sx={{ height: 90, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={chartData.filter(item => item.name === 'Total Loses')}
                      cx="50%"
                      cy="50%"
                      innerRadius={20}
                      outerRadius={30}
                      fill="#8884d8"
                      dataKey="value"
                      labelLine={false}
                      label={CustomLabel}
                    >
                      {chartData.filter(item => item.name === 'Total Loses').map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </Box>
              <Typography variant="h5" sx={{ color: 'red', marginTop: '10px' }}>
                {totalLoses.toFixed(2)} TND
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Totals;
