import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';
import { useEffect, useContext, useState } from 'react';
import AppContext from '../Context/AppContext';
import { ToastContainer, toast } from 'react-toastify';
import { Modal, TextField } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';

const settings = ['Profile', 'Change Password', 'Logout'];

function AppBarComponent() {
  const { auth, fields } = useContext(AppContext);
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const { setAuth } = useContext(AppContext);
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [toggle, setToggle] = useState({ toggle: false });

  useEffect(() => {
    const fetchData = async () => {
      setFirstName(fields.FIRSTNAME);
      setLastName(fields.LASTNAME);
      setEmail(fields.EMAIL);
      setPhone(fields.PHONE);
      // const response = await fetchUserProfile();
      // if (response.ok) {
      //   const data = await response.json();
        
      // } else {
      //   toast.error('Failed to load user profile.');
      // }
    };
    fetchData();
  }, []);

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
    window.sessionStorage.removeItem('token');
    setAuth(false);
    navigate('/login');
  };

  const navigateToDashboard = () => {
    window.location.href = '/categories';
  };

  const handleMenuItemClick = (setting) => {
    if (setting === 'Profile') {
      setOpenProfileModal(true);
    } else if (setting === 'Logout') {
      handleLogout();
    } else if (setting === 'Change Password') {
      handleChangePassword();
    }
    handleCloseUserMenu();
  };

  const handleChangePassword = () => {
    setOpenModal(true);
    handleCloseUserMenu();
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleCloseProfileModal = () => {
    setOpenProfileModal(false);
    setEditMode(false);
  };

  const updatePasswordApi = async (oldPassword, newPassword) => {
    const token = sessionStorage.getItem('token');
    const response = await fetch('http://localhost:5000/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        username: fields.USERNAME,
        oldPassword,
        newPassword,
      }),
    });
    return response;
  };

  const fetchUserProfile = async () => {
    const token = sessionStorage.getItem('token');
    const response = await fetch('http://localhost:5000/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  };

  const updateProfileApi = async (firstName, lastName, email, phone) => {
    const token = sessionStorage.getItem('token');
    const response = await fetch('http://localhost:5000/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        username: fields.USERNAME,
        firstName,
        lastName,
        email,
        phone,
      }),
    });
    return response;
  };

  const handleCloseToast = () => { if (toggle && typeof setToggle === 'function') { setToggle({ ...toggle, toggle: false }); } else { console.error('Toggle or setToggle is undefined'); } };

  const handleUpdatePassword = async () => {
    try {
      const response = await updatePasswordApi(oldPassword, newPassword);
      if (response.ok) {
        toast.success('Password updated successfully', { onClose: handleCloseToast,});
      } else {
        toast.error('Password update failed', { onClose: handleCloseToast,});
      }
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('Error occurred while updating password', { onClose: handleCloseToast,});
    }
    handleCloseModal();
  };

  const handleUpdateProfile = async () => {
    try {
      const response = await updateProfileApi(firstName, lastName, email, phone);
      if (response.ok) {
        toast.success('Profile updated successfully', { onClose: handleCloseToast,});
      } else {
        toast.error('Profile update failed', { onClose: handleCloseToast,});
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error occurred while updating profile', { onClose: handleCloseToast,});
    }
    handleCloseProfileModal();
  };

  return (
    <>
      <ToastContainer/>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              component="a"
              href={`/categories/${fields.USERID}`}
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              CSARMS
            </Typography>

            <Box sx={{ flexGrow: 1 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ float: 'right' }}>
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
          <Typography variant="h6" component="h2" color="textPrimary">
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

      <Modal open={openProfileModal} onClose={handleCloseProfileModal}>
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
          <Typography variant="h6" component="h2" color="textPrimary">
            Profile
          </Typography>
          <TextField
            label="First Name"
            type="text"
            fullWidth
            margin="normal"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={!editMode}
          />
          <TextField
            label="Last Name"
            type="text"
            fullWidth
            margin="normal"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            disabled={!editMode}
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={!editMode}
          />
          <TextField
            label="Phone"
            type="text"
            fullWidth
            margin="normal"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={!editMode}
          />
          {editMode ? 
          ( <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}> 
          <Button onClick={handleUpdateProfile} variant="contained" color="primary"> Save Details </Button> 
          <Button onClick={() => setEditMode(false)} variant="contained" color="secondary"> Cancel </Button> </Box> ) : ( 
            <Button onClick={() => setEditMode(true)} variant="contained" color="primary" fullWidth> Edit Profile </Button> )} 
            </Box> 
          </Modal>
    </> 
  ); 
} 
export default AppBarComponent;