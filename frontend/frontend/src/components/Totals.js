import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Grid, Box, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
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
  const [commandes, setCommandes] = useState([]);
  const [filter, setFilter] = useState('all');


  useEffect(() => {
    const fetchTotals = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/commandes/');
        const commandesData = response.data;

        let profits = 0;
        let loses = 0;
        let incomes = 0;
        let stateCounts = { Payed: 0, en_attente: 0, retours: 0 };

        commandesData.forEach(commande => {
          const profit = parseFloat(commande.profit) || 0;
          const loss = parseFloat(commande.loss) || 0;
          const price = parseFloat(commande.price_sell) || 0;

          profits += profit;
          loses += loss;
          incomes += price;

          if (commande.commande_state in stateCounts) {
            stateCounts[commande.commande_state] += 1;
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



  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleProfitsClick = () => {
      //TO DO : depends clients desire
    };

  const handleLosesClick = () => {
        //TO DO : depends clients desire
};

  const handleIncomesClick = () => {
       //TO DO : depends clients desire
      };

  return (
    <Box sx={{ padding: '0px'}}>
      {/* Charts Row */}
      <center>
        <h1> Resumer en chartes</h1>
        <br/>
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
                TND {totalIncomes.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ borderRadius: '16px', boxShadow: 3, cursor: 'pointer' , background:'#f8f9fa' }} onClick={handleProfitsClick}>
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
                TND {totalProfits.toFixed(2)}
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
      <br/><br/>
      {/* Commandes List and Filter Holders */}
      <Box sx={{ marginTop: '50px' }}>
        <Typography variant="h5" sx={{ marginBottom: '20px' , color:'#71797E	' }}>Liste des Commandes : </Typography>
        <Select
          value={filter}
          onChange={handleFilterChange}
          sx={{ marginBottom: '20px', minWidth: 'fit-content' ,height:"45px"  , marginLeft:'-94%'}}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="payed">Payed</MenuItem>
          <MenuItem value="En_attente">En Attente</MenuItem>
          <MenuItem value="Retour">Retours</MenuItem>
        </Select>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nom du client</TableCell>
                <TableCell>État</TableCell>
                <TableCell>Profit</TableCell>
                <TableCell>Pertes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCommandes.map((commande) => (
                <TableRow key={commande.id}>
                  <TableCell>{commande.id}</TableCell>
                  <TableCell>{commande.client_name}</TableCell>
                  <TableCell>{commande.commande_state}</TableCell>
                  <TableCell>TND {parseFloat(commande.profit || 0).toFixed(2)}</TableCell>
                  <TableCell>TND {parseFloat(commande.loss || 0).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default Totals;
