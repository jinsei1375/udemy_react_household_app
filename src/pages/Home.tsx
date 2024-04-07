import { Box } from '@mui/material'
import MonthlySummary from '../components/MonthlySummary'
import Calendar from '../components/Calendar'
import TransactionMenu from '../components/TransactionMenu'
import TransactionForm from '../components/TransactionForm'
import { Transaction } from '../types'
import { useState } from 'react'
import { format } from 'date-fns'

interface HomeProps {
  monthlyTransactions: Transaction[],
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>
}

const Home = ({monthlyTransactions, setCurrentMonth}: HomeProps) => {
  const today = format(new Date(), "yyyy-MM-dd");
  console.log(today);
  const [currentDay, setCurrentDay] = useState(today);
  const [isEntryDrawerOpen, setIsEntryDrawerOpen] = useState(false);

  const dailyTransactions = monthlyTransactions.filter((transaction) => {
    return transaction.date === currentDay;
  })

  // フォームの開閉処理
  const handleAddTransactionForm = () => {
    setIsEntryDrawerOpen(!isEntryDrawerOpen);
  }

  const onCloseForm = () => {
    setIsEntryDrawerOpen(!isEntryDrawerOpen);
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
        <TransactionMenu dailyTransactions={dailyTransactions} currentDay={currentDay} onHandleAddTransactionForm={handleAddTransactionForm} />
        <TransactionForm onCloseForm={onCloseForm} isEntryDrawerOpen={isEntryDrawerOpen} currentDay={currentDay} />
      </Box>
    </Box>
  )
}

export default Home