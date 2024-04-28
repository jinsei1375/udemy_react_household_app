import './App.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Report from './pages/Report';
import Nomatch from './pages/Nomatch';
import AppLayout from './components/layout/AppLayout';
import { theme } from './theme/theme';
import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { useEffect, useState } from 'react';
import { Transaction } from './types';
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { formatMonth } from './utils/formatting';
import { Schema } from './validations/schema';
import { AppContextProvider, useAppContext } from './context/AppContext';
import { isFireStoreError } from './utils/errorHandling';

function App() {
  // const [transactions, setTransactions] = useState<Transaction[]>([]);
  // const [currentMonth, setCurrentMonth] = useState(new Date());
  // const [isLoading, setIsLoading] = useState(true);

  // // 取引を保存する処理
  // const hanleSaveTransaction = async (transaction: Schema) => {
  //   console.log(transaction);
  //   try {
  //     // fire storeにデータ保存
  //     const docRef = await addDoc(collection(db, 'Transactions'), transaction);

  //     const newTransaction = {
  //       id: docRef.id,
  //       ...transaction,
  //     } as Transaction;
  //     setTransactions((prevTransactions) => [...prevTransactions, newTransaction]);
  //   } catch (err) {
  //     if (isFireStoreError(err)) {
  //       console.error('firebaseのエラーは', err);
  //       console.error('firebaseのエラーメッセージは', err.message);
  //       console.error('firebaseのエラーコードは', err.code);
  //     } else {
  //       console.error('一般的なエラーは', err);
  //     }
  //   }
  // };

  // // 削除処理
  // const handleDeleteTransaction = async (transactionIds: string | readonly string[]) => {
  //   try {
  //     const idsToDelete = Array.isArray(transactionIds) ? transactionIds : [transactionIds];
  //     console.log(idsToDelete);

  //     for (const transactionId of idsToDelete) {
  //       // データ削除
  //       await deleteDoc(doc(db, 'Transactions', transactionId));
  //     }
  //     // const filteredTransactions = transactions.filter(
  //     //   (transaction) => transaction.id !== transactionId
  //     // );
  //     const filteredTransactions = transactions.filter(
  //       (transaction) => !idsToDelete.includes(transaction.id)
  //     );
  //     setTransactions(filteredTransactions);
  //   } catch (err) {
  //     if (isFireStoreError(err)) {
  //       console.error('firebaseのエラーは', err);
  //       console.error('firebaseのエラーメッセージは', err.message);
  //       console.error('firebaseのエラーコードは', err.code);
  //     } else {
  //       console.error('一般的なエラーは', err);
  //     }
  //   }
  // };

  // // 更新処理
  // const handleUpdateTransaction = async (transaction: Schema, transactionId: string) => {
  //   try {
  //     // firestore更新処理
  //     const docRef = doc(db, 'Transactions', transactionId);
  //     await updateDoc(docRef, transaction);
  //     const updatedTransactions = transactions.map((t) =>
  //       t.id === transactionId ? { ...t, ...transaction } : t
  //     ) as Transaction[];
  //     setTransactions(updatedTransactions);
  //   } catch (err) {
  //     if (isFireStoreError(err)) {
  //       console.error('firebaseのエラーは', err);
  //       console.error('firebaseのエラーメッセージは', err.message);
  //       console.error('firebaseのエラーコードは', err.code);
  //     } else {
  //       console.error('一般的なエラーは', err);
  //     }
  //   }
  // };

  return (
    <AppContextProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route
                index
                element={
                  <Home
                  // monthlyTransactions={monthlyTransactions}
                  // setCurrentMonth={setCurrentMonth}
                  // onSaveTransaction={hanleSaveTransaction}
                  // onDeleteTransaction={handleDeleteTransaction}
                  // onUpdateTransaction={handleUpdateTransaction}
                  />
                }
              />
              <Route
                path="/report"
                element={
                  <Report
                  // currentMonth={currentMonth}
                  // setCurrentMonth={setCurrentMonth}
                  // monthlyTransactions={monthlyTransactions}
                  // isLoading={isLoading}
                  // onDeleteTransaction={handleDeleteTransaction}
                  />
                }
              />
              <Route path="*" element={<Nomatch />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </AppContextProvider>
  );
}

export default App;
