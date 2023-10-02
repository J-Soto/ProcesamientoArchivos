import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

const HomePage = () => {
  return (
    <Container>
      <h1>Seleccione un Indicador de Gestión a Actualizar</h1>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Link to="/indicador1" style={{ textDecoration: "none" }}>
            <Button variant="contained" color="primary" fullWidth>
              Indicador 1
            </Button>
          </Link>
        </Grid>
        <Grid item xs={6}>
          <Link to="/indicador2" style={{ textDecoration: "none" }}>
            <Button variant="contained" color="primary" fullWidth>
              Indicador 2
            </Button>
          </Link>
        </Grid>
        <Grid item xs={6}>
          <Link to="/indicador3" style={{ textDecoration: "none" }}>
            <Button variant="contained" color="primary" fullWidth>
              Indicador 3
            </Button>
          </Link>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HomePage;
