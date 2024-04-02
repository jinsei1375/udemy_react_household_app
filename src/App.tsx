import './App.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Report from './pages/Report';
import Nomatch from './pages/Nomatch';
import AppLayout from './components/layout/AppLayout';
import {theme} from './theme/theme'
import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { useEffect, useState } from 'react';
import { Transaction } from './types';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

function App() {

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchTransactions = async() => {
      try {
        const querySnapShot = await getDocs(collection(db, "Transactions"));
        // console.log(querySnapShot);
        const transactionsData = querySnapShot.docs.map((doc) => {
          // console.log(doc.id, doc.data());
          return {
            ...doc.data(),
            id: doc.id,
          } as Transaction
        });
        console.log(transactionsData);
        setTransactions(transactionsData);
      } catch(err) {
        
      }
    }
    fetchTransactions();
  }, [])

  return (
    <ThemeProvider theme={theme}>  
      <CssBaseline />
    <Router>
      <Routes>
        <Route path='/' element={<AppLayout />} >
          <Route index element={<Home />} />
          <Route path='/report' element={<Report />} />
          <Route path='*' element={<Nomatch />} />
        </Route>
      </Routes>
    </Router>
    </ThemeProvider>
  );
}

export default App;
