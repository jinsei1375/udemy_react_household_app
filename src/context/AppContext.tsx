import { ReactNode, createContext, useContext, useState } from 'react';
import { Transaction } from '../types';
import App from '../App';
import { Schema } from '../validations/schema';
import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { isFireStoreError } from '../utils/errorHandling';

interface AppContextType {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  currentMonth: Date;
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
  isLoading: Boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  onSaveTransaction: (transaction: Schema) => Promise<void>;
  onDeleteTransaction: (transactionIds: string | readonly string[]) => Promise<void>;
  onUpdateTransaction: (transaction: Schema, transactionId: string) => Promise<void>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  // 取引を保存する処理
  const onSaveTransaction = async (transaction: Schema) => {
    console.log(transaction);
    try {
      // fire storeにデータ保存
      const docRef = await addDoc(collection(db, 'Transactions'), transaction);

      const newTransaction = {
        id: docRef.id,
        ...transaction,
      } as Transaction;
      setTransactions((prevTransactions) => [...prevTransactions, newTransaction]);
    } catch (err) {
      if (isFireStoreError(err)) {
        console.error('firebaseのエラーは', err);
        console.error('firebaseのエラーメッセージは', err.message);
        console.error('firebaseのエラーコードは', err.code);
      } else {
        console.error('一般的なエラーは', err);
      }
    }
  };

  // 削除処理
  const onDeleteTransaction = async (transactionIds: string | readonly string[]) => {
    try {
      const idsToDelete = Array.isArray(transactionIds) ? transactionIds : [transactionIds];
      console.log(idsToDelete);

      for (const transactionId of idsToDelete) {
        // データ削除
        await deleteDoc(doc(db, 'Transactions', transactionId));
      }
      // const filteredTransactions = transactions.filter(
      //   (transaction) => transaction.id !== transactionId
      // );
      const filteredTransactions = transactions.filter(
        (transaction) => !idsToDelete.includes(transaction.id)
      );
      setTransactions(filteredTransactions);
    } catch (err) {
      if (isFireStoreError(err)) {
        console.error('firebaseのエラーは', err);
        console.error('firebaseのエラーメッセージは', err.message);
        console.error('firebaseのエラーコードは', err.code);
      } else {
        console.error('一般的なエラーは', err);
      }
    }
  };

  // 更新処理
  const onUpdateTransaction = async (transaction: Schema, transactionId: string) => {
    try {
      // firestore更新処理
      const docRef = doc(db, 'Transactions', transactionId);
      await updateDoc(docRef, transaction);
      const updatedTransactions = transactions.map((t) =>
        t.id === transactionId ? { ...t, ...transaction } : t
      ) as Transaction[];
      setTransactions(updatedTransactions);
    } catch (err) {
      if (isFireStoreError(err)) {
        console.error('firebaseのエラーは', err);
        console.error('firebaseのエラーメッセージは', err.message);
        console.error('firebaseのエラーコードは', err.code);
      } else {
        console.error('一般的なエラーは', err);
      }
    }
  };

  return (
    <AppContext.Provider
      value={{
        transactions,
        setTransactions,
        currentMonth,
        setCurrentMonth,
        isLoading,
        setIsLoading,
        onSaveTransaction,
        onDeleteTransaction,
        onUpdateTransaction,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    // undefinedの場合
    throw new Error('グローバルなデータはプロバイダーの中で取得してね');
  }
  return context;
};
