import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import { PieChart as RechartsPieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts';

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

  useEffect(() => {
    const fetchTotals = async () => {
      try {
        // Fetch commandes data
        const commandesResponse = await axios.get('http://localhost:8000/api/commandes/');
        const commandesData = commandesResponse.data;

        if (!Array.isArray(commandesData)) {
          console.error('Expected commandesData to be an array', commandesData);
          return;
        }

        // Fetch products data
        const productsResponse = await axios.get('http://localhost:8000/api/products/');
        const productsData = productsResponse.data;

        // Extract the array of products
        const productsArray = productsData.results || [];

        if (!Array.isArray(productsArray)) {
          console.error('Expected productsArray to be an array', productsData);
          return;
        }

        let profits = 0;
        let loses = 0;
        let incomes = 0;

        // Create a map for product prices by their IDs
        const productPriceMap = productsArray.reduce((map, product) => {
          if (product.id && product.price_buy) {
            map[product.id] = parseFloat(product.price_buy) || 0;
          }
          return map;
        }, {});

        // Count commande states
        const stateCounts = commandesData.reduce((counts, commande) => {
          counts[commande.commande_state] = (counts[commande.commande_state] || 0) + 1;
          return counts;
        }, {});

        // Count total commandes and products
        setTotalCommandes(commandesData.length);
        setTotalProducts(productsArray.length);
        setCommandeStates(stateCounts);

        commandesData.forEach(commande => {
          const priceSell = parseFloat(commande.price_sell) || 0;
          const quantity = parseFloat(commande.quantity) || 0;
          const priceBuy = productPriceMap[commande.product] || 0; // Assuming product_id is present in commande

          if (commande.commande_state === 'payee') {
            const profit = priceSell - (priceBuy * quantity);
            profits += profit;
            incomes += priceSell;
          }
          if (commande.commande_state === 'retour') {
            const loss = parseFloat(commande.loss) || 0;
            loses += loss;
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
  }, []);

  const filteredCommandes = commandes.filter(commande =>
    filter === 'all' || commande.commande_state === filter
  );

  const chartData = [
    { name: 'Total Incomes', value: totalIncomes, color: '#007bff' },
    { name: 'Total Profits', value: totalProfits, color: '#28a745' },
    { name: 'Total Loses', value: totalLoses, color: '#dc3545' }
  ];

  const commandesChartData = [
    { name: 'Commandes', value: totalCommandes, color: '#007bff' },
  ];

  const productsChartData = [
    { name: 'Produits', value: totalProducts, color: '#007bff' },
  ];

  const stateChartData = Object.entries(commandeStates).map(([state, count]) => ({
    name: `Commandes ${state}`,
    value: count,
    color: '#007bff' // You can customize the colors here
  }));

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleProfitsClick = () => {
    // TO DO: depends on client's desire
  };

  const handleLosesClick = () => {
    // TO DO: depends on client's desire
  };

  const handleIncomesClick = () => {
    // TO DO: depends on client's desire
  };

  return (
    <Box sx={{ padding: '0px' }}>
      {/* Charts Row */}
      <center>
        <h1>Résumé en chartes</h1>
        <br />
      </center>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ borderRadius: '16px', boxShadow: 3, cursor: 'pointer' }} onClick={handleIncomesClick}>
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
                 {totalIncomes.toFixed(2)}  TND
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ borderRadius: '16px', boxShadow: 3, cursor: 'pointer', background: '#f8f9fa' }} onClick={handleProfitsClick}>
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
          <Card sx={{ borderRadius: '16px', boxShadow: 3, cursor: 'pointer' }} onClick={handleLosesClick}>
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
                TND {totalLoses.toFixed(2)} 
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* New Cards Row */}
      <center>
        <br />
      </center>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ borderRadius: '16px', boxShadow: 3, cursor: 'pointer' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6">Total Commandes</Typography>
              <Box sx={{ height: 90, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={commandesChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={20}
                      outerRadius={30}
                      fill="#8884d8"
                      dataKey="value"
                      labelLine={false}
                      label={CustomLabel}
                    >
                      {commandesChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={'#D57A66'} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </Box>
              <Typography variant="h5" sx={{ color: '#D57A66', marginTop: '10px' }}>
                {totalCommandes}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ borderRadius: '16px', boxShadow: 3, cursor: 'pointer' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6">Total Produits</Typography>
              <Box sx={{ height: 90, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={productsChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={20}
                      outerRadius={30}
                      fill="#8884d8"
                      dataKey="value"
                      labelLine={false}
                      label={CustomLabel}
                    >
                      {productsChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={'purple'} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </Box>
              <Typography variant="h5" sx={{ color: 'purple', marginTop: '10px' }}>
                {totalProducts}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ borderRadius: '16px', boxShadow: 3, cursor: 'pointer' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6">Commandes par État</Typography>
              <Box sx={{ height: 93, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={stateChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={20}
                      outerRadius={30}
                      fill="#8884d8"
                      dataKey="value"
                      labelLine={false}
                      label={CustomLabel}
                    >
                      {stateChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={'orange'} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </Box>
              <Typography variant="h5" sx={{ color: 'orange', marginTop: '10px' }}>
                {Object.values(commandeStates).reduce((a, b) => a + b, 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Totals;
