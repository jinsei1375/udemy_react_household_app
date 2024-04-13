import { Box } from '@mui/material'
import MonthlySummary from '../components/MonthlySummary'
import Calendar from '../components/Calendar'
import TransactionMenu from '../components/TransactionMenu'
import TransactionForm from '../components/TransactionForm'
import { Transaction } from '../types'
import { useState } from 'react'
import { format } from 'date-fns'
import { Schema } from '../validations/schema'

interface HomeProps {
  monthlyTransactions: Transaction[],
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>,
  onSaveTransaction: (transaction: Schema) => Promise<void>,
  selectedTransaction: Transaction | null,
  setSelectedTransaction: React.Dispatch<React.SetStateAction<Transaction | null>>
}

const Home = ({
  monthlyTransactions, 
  setCurrentMonth, 
  onSaveTransaction, 
  selectedTransaction, 
  setSelectedTransaction
}: HomeProps) => {
  const today = format(new Date(), "yyyy-MM-dd");
  console.log(today);
  const [currentDay, setCurrentDay] = useState(today);
  const [isEntryDrawerOpen, setIsEntryDrawerOpen] = useState(false);

  const dailyTransactions = monthlyTransactions.filter((transaction) => {
    return transaction.date === currentDay;
  })

  // フォームの開閉処理
  const handleAddTransactionForm = () => {
    if (selectedTransaction) {
      setSelectedTransaction(null);
    } else {
      setIsEntryDrawerOpen(!isEntryDrawerOpen);
    }
  }

  const onCloseForm = () => {
    setSelectedTransaction(null);
    setIsEntryDrawerOpen(!isEntryDrawerOpen);
  }

  // 取引が選択された時の処理
  const handleSelectTransaction = (transaction: Transaction) => {
    console.log(transaction);
    setIsEntryDrawerOpen(true);
    setSelectedTransaction(transaction);
  }

  return (
    <Box sx={{ display: "flex" }}>
      {/* 左側コンテンツ */}
      <Box sx={{ flexGrow: 1 }}>
        <MonthlySummary monthlyTransactions={monthlyTransactions}/>
        <Calendar 
          monthlyTransactions={monthlyTransactions} 
          setCurrentMonth={setCurrentMonth}
          setCurrentDay={setCurrentDay}
          currentDay={currentDay}
          today={today}
        />
      </Box>

      {/* 右側コンテンツ */}
      <Box>
        <TransactionMenu 
          dailyTransactions={dailyTransactions} 
          currentDay={currentDay} 
          onHandleAddTransactionForm={handleAddTransactionForm} 
          onSelectTransaction={handleSelectTransaction}
        />
        <TransactionForm 
          onCloseForm={onCloseForm} 
          isEntryDrawerOpen={isEntryDrawerOpen} 
          currentDay={currentDay} 
          onSaveTransaction={onSaveTransaction}
          selectedTransaction={selectedTransaction}
        />
      </Box>
    </Box>
  )
}

export default Home