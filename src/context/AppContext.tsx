import { ReactNode, createContext, useContext, useState } from 'react';
import { Transaction } from '../types';
import App from '../App';

interface AppContextType {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  return (
    <AppContext.Provider value={{ transactions, setTransactions }}>{children}</AppContext.Provider>
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
