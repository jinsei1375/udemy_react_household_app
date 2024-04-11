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
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { error } from 'console';
import { format } from 'date-fns';
import { formatMonth } from './utils/formatting';
import { Scheduler } from 'timers/promises';
import { Schema } from './validations/schema';

function App() {

  function isFireStoreError(err: unknown):err is {code: string, message: string} {
    return typeof err === "object" && err !== null && "code" in err;
  }

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);


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
        setTransactions(transactionsData);
      } catch(err) {
        if (isFireStoreError(err)) {
          console.error("firebaseのエラーは",err)
          console.error("firebaseのエラーメッセージは",err.message)
          console.error("firebaseのエラーコードは",err.code)
        } else {
          console.error("一般的なエラーは", err)
        }
      }
    }
    fetchTransactions();
  }, [])

  // ひと月分のデータのみ取得
  const monthlyTransactions = transactions.filter((transaction) => {
    return transaction.date.startsWith(formatMonth(currentMonth));
  });

  // 取引を保存する処理
  const hanleSaveTransaction = async(transaction: Schema) => {
    console.log(transaction);
    try {
      // fire storeにデータ保存
      const docRef = await addDoc(collection(db, "Transactions"), transaction);

      const newTransaction = {
        id: docRef.id,
        ...transaction,
      } as Transaction;
      setTransactions((prevTransactions) => [
        ...prevTransactions, 
        newTransaction
      ]);

    } catch(err) {
      if (isFireStoreError(err)) {
        console.error("firebaseのエラーは",err)
        console.error("firebaseのエラーメッセージは",err.message)
        console.error("firebaseのエラーコードは",err.code)
      } else {
        console.error("一般的なエラーは", err)
      }
    }
  }



  return (
    <ThemeProvider theme={theme}>  
      <CssBaseline />
    <Router>
      <Routes>
        <Route path='/' element={<AppLayout />} >
          <Route 
            index 
            element={
              <Home 
                monthlyTransactions={monthlyTransactions} 
                setCurrentMonth={setCurrentMonth}
                onSaveTransaction={hanleSaveTransaction}
                selectedTransaction={selectedTransaction}
                setSelectedTransaction={setSelectedTransaction}
              />
            } 
          />
          <Route path='/report' element={<Report />} />
          <Route path='*' element={<Nomatch />} />
        </Route>
      </Routes>
    </Router>
    </ThemeProvider>
  );
}

export default App;
