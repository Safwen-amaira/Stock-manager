import React from 'react';
import { Box, Container, Typography, useTheme } from '@mui/material';
import Sidebar from './Sidebar';
import PieChartComponent from './PieChart';
import BarChartComponent from './BarChart';
import WeeklySalesChart from './WeeklyChart';
import TotalOrderCard from './TotalOrderCard'; // Import the TotalOrderCard component
import SalesComparisonChart from './SalesComparisonChart'; // Import the SalesComparisonChart component
import { Outlet, useLocation } from 'react-router-dom';

const Dashboard = () => {
  const theme = useTheme();
  const location = useLocation(); 

  // Check if the current route is the home component
  const isHome = location.pathname === '/dashboard-admin';

  // Example data for the SalesComparisonChart
  const thisYearData = [12000, 15000, 17000, 14000, 16000];
  const lastYearData = [10000, 13000, 16000, 12000, 14000];
  const labels = ['January', 'February', 'March', 'April', 'May'];

  return (
    <Box sx={{ display: 'flex' , background:'#ccc'}}>
      <Sidebar open={true} handleDrawerToggle={() => {}} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: theme.palette.background.default,
          p: 3,
          width: { sm: `calc(100% - ${240}px)` },
          transition: 'width 0.3s',
        }}
      >
        <Container>
          <Typography variant="h4" gutterBottom>
            <br />
            {isHome && (
              <>
                    Detailed Resume 
                    <br /><br />
              </>
            )}
        
          </Typography>
          {isHome && (
            <>
              <Box sx={{ mb: 4, display: 'flex', gap: 4 }}>
                <Box sx={{ width: '100%' }}>
                  <Typography variant="h6" gutterBottom>
                    Total Orders
                  </Typography>
                  <TotalOrderCard />
                </Box>
                <Box sx={{ width: '100%' }}>
                  <Typography variant="h6" gutterBottom>
                    Best Cathegories
                    </Typography>
                  <Box sx={{ height: 300, width: '100%' }}>
                    <PieChartComponent />
                  </Box>
                </Box>
                <Box sx={{ width: '100%' }}>
                  <Typography variant="h6" gutterBottom>
                    Weekly Sales
                  </Typography>
                  <Box sx={{ height: 300, width: '100%' }}>
                    <WeeklySalesChart />
                  </Box>
                </Box>
              </Box>
              <Box>
                <Typography variant="h6" gutterBottom>
                </Typography>
                <Box sx={{ height: 300, width: '100%' , marginTop:'-8%'}}>
                  <SalesComparisonChart
                    thisYearData={thisYearData}
                    lastYearData={lastYearData}
                    labels={labels}
                  />
                </Box>
              </Box>
              <br/><br/><br/><br/><br/><br/><br/><br/><br/>
         
            </>
          )}
          <Outlet /> 
        </Container>
        <br /><br /><br />
        <br /><br /><br />
      </Box>
    </Box>
  );
};

export default Dashboard;
