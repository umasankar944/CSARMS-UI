import React, { useState, useContext } from 'react';
import { Container, TextField, Button, Typography, Box, IconButton, GlobalStyles, Grid, Link } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { userLogin } from '../services/auth-service';
import AppContext from '../Context/AppContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const Login = () => {
  const navigate = useNavigate();
  const viewCategories=(id)=>{
    navigate(`/categories/${id}`)
  }
  const [formData, setFormData] = useState({ username: '', password: '' });
  const { setAuth, handleAccessToken } = useContext(AppContext);
  const {setUserId, setemailId, setphone } = useContext(AppContext);
  const [error,setError]= useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await userLogin(formData);
      console.log(response)
      console.log(response.status)
      if(response.status === 200 || response.status === 201){
        toast.success('Login successful!');
        window.sessionStorage.setItem('token', response.user.token);
        await handleAccessToken(); // Fetch user details after setting the token
        setAuth(true);
        console.log("I am in")
        console.log(response.user.id)
        viewCategories(response.user.id)
        //navigate("/categories");
      }
      else{
        toast.error('Login failed. Please check your credentials and try again.');
        setError(true);
        
      }
    } catch (error) {
      toast.error(`Login failed. Please check your credentials and try again.`);
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
          alignItems: 'center'
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
            Welcome Back to CSARMS ⏰
          </Typography>

          <form onSubmit={handleLogin} style={{ width: '100%' }}>
            <Grid container justifyContent="center">
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
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Login
                </Button>
              </Grid>
              <Grid item xs={12} sm={8}> <Typography variant="body2" sx={{ textAlign: 'center', mt: 2, color: '#8692A6' }}> Don't have an account? <Link href="/Register" sx={{ color: '#e29a0a' }}>Create Account</Link> </Typography> </Grid>
            </Grid>
          </form>
        </Box>
      </Container>
    </>
  );
};

export default Login;