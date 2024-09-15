import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, IconButton, useMediaQuery, useTheme, styled, Button } from '@mui/material';
import { Menu as MenuIcon, Home as HomeIcon, AttachMoney as AttachMoneyIcon, Inventory as InventoryIcon, Paid as PaidIcon } from '@mui/icons-material';
import LocalShippingSharpIcon from '@mui/icons-material/LocalShippingSharp';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import PeopleIcon from '@mui/icons-material/People'; // Import PeopleIcon for User Manager
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
const drawerWidth = 240;



// Styled ListItem for active state
const StyledListItem = styled(ListItem)(({ theme, active }) => ({
  backgroundColor: active ? theme.palette.action.selected : 'transparent',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const Sidebar = ({ open, handleDrawerToggle }) => {
  const { pathname } = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem('access');
    if (!accessToken) {
      navigate('/');
      return;
    }

    const userRole = {
      is_staff: localStorage.getItem('is_staff') === 'true',
      is_superuser: localStorage.getItem('is_superuser') === 'true',
    };

    setIsAdmin(userRole.is_superuser); // You can use userRole.is_staff if you want to include both conditions
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('is_staff');
    localStorage.removeItem('is_superuser');
    navigate('/');
  };

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
      variant={isMobile ? 'temporary' : 'persistent'}
      anchor="left"
      open={open}
      onClose={handleDrawerToggle}
      ModalProps={{
        keepMounted: true,
      }}
    >
      <List>
        <StyledListItem
          button
          component={Link}
          to="/dashboard-admin"
          active={pathname === '/dashboard-admin'}
        >
          <ListItemIcon><HomeIcon /></ListItemIcon>
          <ListItemText primary="Home" />
        </StyledListItem>
        <Divider />

        <StyledListItem
          button
          component={Link}
          to="/dashboard-admin/totals"
          active={pathname === '/dashboard-admin/totals'}
        >
          <ListItemIcon><PaidIcon /></ListItemIcon>
          <ListItemText primary="Totals" />
        </StyledListItem>

     


        <Divider />


        <StyledListItem
          button
          component={Link}
          to="/dashboard-admin/commandes"
          active={pathname === '/dashboard-admin/commandes'}
        >
          <ListItemIcon><LocalShippingSharpIcon /></ListItemIcon>
          <ListItemText primary="Commandes" />
        </StyledListItem>
        <Divider />

        <StyledListItem
          button
          component={Link}
          to="/dashboard-admin/stock"
          active={pathname === '/dashboard-admin/stock'}
        >
          <ListItemIcon><InventoryIcon /></ListItemIcon>
          <ListItemText primary="Stock" />
        </StyledListItem>
  
        <Divider />



        <Divider />


        <StyledListItem
          button
          component={Link}
          to="/dashboard-admin/products"
          active={pathname === '/dashboard-admin/products'}
        >
          <ListItemIcon><ConnectWithoutContactIcon /></ListItemIcon>
          <ListItemText primary="produits" />
        </StyledListItem>

        <Divider />

        <StyledListItem
          button
          component={Link}
          to="/dashboard-admin/list"
          active={pathname === '/dashboard-admin/list'}
        >
          <ListItemIcon><FormatListBulletedIcon /></ListItemIcon>
          <ListItemText primary="Liste des clients" />
        </StyledListItem>

        <Divider />


        <StyledListItem
          button
          component={Link}
          to="/dashboard-admin/partners"
          active={pathname === '/dashboard-admin/partners'}
        >
          <ListItemIcon><ConnectWithoutContactIcon /></ListItemIcon>
          <ListItemText primary="Réseau" />
        </StyledListItem>

        <Divider />


        {isAdmin && (
          <StyledListItem
            button
            component={Link}
            to="/dashboard-admin/user-manager"
            active={pathname === '/dashboard-admin/user-manager'}
          >
            <ListItemIcon><PeopleIcon /></ListItemIcon>
            <ListItemText primary="User Manager" />
          </StyledListItem>
        )}

        <Divider />
        
        <StyledListItem
          button
          component={Link}
          to="/dashboard-admin/credits"
          active={pathname === '/dashboard-admin/credits'}
        >
          <ListItemIcon><SentimentDissatisfiedIcon /></ListItemIcon>
          <ListItemText primary="Crédits" />
        </StyledListItem>
        <Divider />


        <ListItem button onClick={handleLogout}>
          <ListItemIcon><KeyboardReturnIcon /></ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
        

        <Divider />

      </List>
    </Drawer>
  );
};

export default Sidebar;
