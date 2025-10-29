import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Typography,
  Grid,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #004e92, #000428)',
      }}
    >
      <Grid item xs={11} sm={8} md={5} lg={4}>
        <Card
          elevation={10}
          sx={{
            borderRadius: 4,
            backdropFilter: 'blur(12px)',
            backgroundColor: 'rgba(255,255,255,0.08)',
            color: 'white',
          }}
        >
          <CardHeader
            title={
              <Typography variant="h5" textAlign="center" fontWeight={600}>
                Iniciar Sesión
              </Typography>
            }
          />
          <CardContent>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
            >
              <TextField
                variant="outlined"
                label="Correo Electrónico"
                fullWidth
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: 'white' }} />
                    </InputAdornment>
                  ),
                  style: { color: 'white' },
                }}
                InputLabelProps={{ style: { color: '#ccc' } }}
              />

              <TextField
                variant="outlined"
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: 'white' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: 'white' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  style: { color: 'white' },
                }}
                InputLabelProps={{ style: { color: '#ccc' } }}
                helperText="Contraseña demo: 123"
                FormHelperTextProps={{ style: { color: '#aaa' } }}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{
                  background: 'linear-gradient(90deg, #00c6ff, #0072ff)',
                  color: 'white',
                  fontWeight: 'bold',
                  borderRadius: 3,
                  '&:hover': {
                    background: 'linear-gradient(90deg, #0072ff, #00c6ff)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                  },
                }}
              >
                Ingresar
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Login;
