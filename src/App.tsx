import React from 'react';
import './App.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Report from './pages/Report';
import Nomatch from './pages/Nomatch';
import AppLayout from './components/layout/AppLayout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<AppLayout />} >
          <Route index element={<Home />} />
          <Route path='/report' element={<Report />} />
          <Route path='*' element={<Nomatch />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
