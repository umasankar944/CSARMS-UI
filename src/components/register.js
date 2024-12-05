import React, { useState, useContext } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  IconButton,
  GlobalStyles,
  Grid,
  Link
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { userRegister } from '../services/auth-service';
import AppContext from '../Context/AppContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    firstname: '',
    lastname: '',
    phone: '',
  });
  const { setAuth, handleAccessToken } = useContext(AppContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await userRegister(formData);
      if(response.status == 203){
        toast.error('User name already exists !!!');
      }
      else if (response.status === 200 || response.status === 201) {
        toast.success('Registration successful!');
        window.sessionStorage.setItem('token', response.token);
        await handleAccessToken();
        setAuth(true);
        navigate('/login');
      } else {
        toast.error('Registration failed. Please check your details and try again.');
      }
    } catch (error) {
      toast.error(`Registration failed. Please check your details and try again.`);
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      <GlobalStyles
        styles={{
          html: { backgroundColor: '#202227' },
          body: { backgroundColor: '#202227', margin: 0, padding: 0, minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' },
        }}
      />
      <Container
        maxWidth="false"
        disableGutters
        sx={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <IconButton
          onClick={handleBackClick}
          sx={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            color: 'white',
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '2rem',
            borderRadius: '8px',
            color: '#e29a0a',
            width: '100%',
            maxWidth: '500px',
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome to CSARMS ⏰
          </Typography>

          <form onSubmit={handleRegister} style={{ width: '100%' }}>
            <Grid container justifyContent="center" spacing={0.5}>
              <Grid item xs={12} sm={8}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  label="First Name"
                  name="firstname"
                  type="text"
                  value={formData.firstname}
                  onChange={handleChange}
                  InputLabelProps={{ style: { color: '#8692A6' } }}
                  InputProps={{ style: { color: '#8692A6' } }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#8692A6',
                      },
                      '&:hover fieldset': {
                        borderColor: '#8692A6',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#8692A6',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={8}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  label="Last Name"
                  name="lastname"
                  type="text"
                  value={formData.lastname}
                  onChange={handleChange}
                  InputLabelProps={{ style: { color: '#8692A6' } }}
                  InputProps={{ style: { color: '#8692A6' } }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#8692A6',
                      },
                      '&:hover fieldset': {
                        borderColor: '#8692A6',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#8692A6',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={8}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  InputLabelProps={{ style: { color: '#8692A6' } }}
                  InputProps={{ style: { color: '#8692A6' } }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#8692A6',
                      },
                      '&:hover fieldset': {
                        borderColor: '#8692A6',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#8692A6',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={8}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  label="Phone"
                  name="phone"
                  type="text"
                  value={formData.phone}
                  onChange={handleChange}
                  InputLabelProps={{ style: { color: '#8692A6' } }}
                  InputProps={{ style: { color: '#8692A6' } }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#8692A6',
                      },
                      '&:hover fieldset': {
                        borderColor: '#8692A6',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#8692A6',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={8}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  label="User Name"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  InputLabelProps={{ style: { color: '#8692A6' } }}
                  InputProps={{ style: { color: '#8692A6' } }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#8692A6',
                      },
                      '&:hover fieldset': {
                        borderColor: '#8692A6',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#8692A6',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={8}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  InputLabelProps={{ style: { color: '#8692A6' } }}
                  InputProps={{ style: { color: '#8692A6' } }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#8692A6',
                      },
                      '&:hover fieldset': {
                        borderColor: '#8692A6',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#8692A6',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={8}>
                <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2 }}>
                  Register
                </Button>
              </Grid>
              <Grid item xs={12} sm={8}> <Typography variant="body2" sx={{ textAlign: 'center', mt: 2, color: '#8692A6' }}> Have an Account Already! <Link href="/login" sx={{ color: '#e29a0a' }}>Login</Link> </Typography> </Grid>
            </Grid>
          </form>
        </Box>
      </Container>
    </>
  );
};

export default Register;
