import React from 'react';
import { Outlet, BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import Indicador1Page from './components/Indicador1Page';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Ruta para la página de inicio */}
          <Route path="/" element={<HomePage />} />

          {/* Ruta para la página del indicador 1 */}
          <Route path="/indicador1" element={<Indicador1Page />} />
          {/* Ruta para la página del indicador 1 */}
          <Route path="/indicador2" element={<Indicador1Page />} />
          {/* Ruta para la página del indicador 1 */}
          <Route path="/indicador3" element={<Indicador1Page />} />
          {/* Ruta para la página del indicador 1 */}
          <Route path="/indicador4" element={<Indicador1Page />} />
          {/* Ruta para la página del indicador 1 */}
          <Route path="/indicador5" element={<Indicador1Page />} />
          {/* Ruta para la página del indicador 1 */}
          <Route path="/indicador6" element={<Indicador1Page />} />
          {/* Ruta para la página del indicador 1 */}
          <Route path="/indicador7" element={<Indicador1Page />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
