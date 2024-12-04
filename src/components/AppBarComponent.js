import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';
import { useEffect, useContext } from 'react';
import AppContext from '../Context/AppContext'; // Assuming you are using AppContext
import { ToastContainer, toast } from 'react-toastify';
import { useState } from 'react';
import {Modal, TextField } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';

const settings = ['Dashboard', 'Change Password','Logout'];

function AppBarComponent() {
  const { auth, fields } = useContext(AppContext);
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const { setAuth } = useContext(AppContext);
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    window.sessionStorage.removeItem('token'); // Clear session on logout
    setAuth(false);
    navigate('/login'); // Redirect to login
  };

  const navigateToDashboard = () => {
    console.log('Navigating to Dashboard...');
    window.location.href = '/categories';
  };
  
  const handleMenuItemClick = (setting) => {
    if (setting === 'Dashboard') {
      navigateToDashboard();
    } else if (setting === 'Logout') {
      handleLogout();
    }
    else if(setting === 'Change Password') handleChangePassword();
    handleCloseUserMenu();  // Close the menu after the action is performed
  };

  const handleChangePassword = () => {
    setOpenModal(true);
    handleCloseUserMenu();
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const updatePasswordApi = async (oldPassword, newPassword) => {
    const token = sessionStorage.getItem('token');
    const response = await fetch('http://localhost:5000/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Include token for authentication
      },
      body: JSON.stringify({
        username: fields.USERNAME,  // Replace with the actual userId
        oldPassword,
        newPassword,
      }),
    });
    
    return response;
  };
  

  const handleUpdatePassword = async () => {
    try {
      // Call the API to update password (function written below)
      const response = await updatePasswordApi(oldPassword, newPassword);
      if (response.ok) {
        toast.success('Password updated successfully');
      } else {
        toast.error('Password update failed');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('Error occurred while updating password');
    }
    handleCloseModal();
  };
//   useEffect(() => {
//     const handlePopState = (event) => {
//       // Show the confirmation dialog
//       const userConfirmed = window.confirm("Do you want to Logout?");
      
//       if (userConfirmed) {
//         // Run your function if the user clicks "OK"
//         handleLogout();
//       } else {
//         // Prevent the navigation if the user clicks "Cancel"
//         event.preventDefault();
//         navigate(1); // Navigate forward to cancel the back action
//       }
//     };

//     // Listen for 'popstate' event
//     window.addEventListener('popstate', handlePopState);

//     return () => {
//       // Cleanup event listener when the component unmounts
//       window.removeEventListener('popstate', handlePopState);
//     };
//   }, [navigate]);

  return (
    <>
    <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/categories"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          > CSARMS
          </Typography>


          {/* User Menu */}
          <Box sx={{ flexGrow: 1 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{float:'right'}}>
              <AccountCircle />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem
                  key={setting}
                  onClick={() => {
                    handleMenuItemClick(setting);
                  }}
                >
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
                
              ))}
            </Menu>
          </Box>
          
        </Toolbar>
      </Container>
      
    </AppBar>
    <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2" color={"#fff"}>
            Change Password
          </Typography>
          <TextField
            label="Old Password"
            type="password"
            fullWidth
            margin="normal"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <TextField
            label="New Password"
            type="password"
            fullWidth
            margin="normal"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Button onClick={handleUpdatePassword} variant="contained" color="primary" fullWidth>
            Update Password
          </Button>
        </Box>
      </Modal>
    </>
  );
}

export default AppBarComponent;
