import { Box } from '@mui/material';
import MonthlySummary from '../components/MonthlySummary';
import Calendar from '../components/Calendar';
import TransactionMenu from '../components/TransactionMenu';
import TransactionForm from '../components/TransactionForm';
import { Transaction } from '../types';
import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { Schema } from '../validations/schema';
import useMonthlyTransactions from '../hooks/useMonthlyTransactions';
import { DateClickArg } from '@fullcalendar/interaction';
import { useAppContext } from '../context/AppContext';

// interface HomeProps {
//   monthlyTransactions: Transaction[];
//   setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
//   onSaveTransaction: (transaction: Schema) => Promise<void>;
//   onDeleteTransaction: (transactionId: string | readonly string[]) => Promise<void>;
//   onUpdateTransaction: (transaction: Schema, transactionId: string) => Promise<void>;
// }

const Home = () =>
  //   {
  //   monthlyTransactions,
  //   setCurrentMonth,
  //   onSaveTransaction,
  //   onDeleteTransaction,
  //   onUpdateTransaction,
  // }: HomeProps
  {
    const monthlyTransactions = useMonthlyTransactions();
    const today = format(new Date(), 'yyyy-MM-dd');
    console.log(today);
    const [currentDay, setCurrentDay] = useState(today);
    const [isEntryDrawerOpen, setIsEntryDrawerOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { isMobile } = useAppContext();

    const dailyTransactions = useMemo(() => {
      return monthlyTransactions.filter((transaction) => {
        return transaction.date === currentDay;
      });
    }, [monthlyTransactions, currentDay]);

    const [isMobileDraoerOpen, setIsMobileDraoerOpen] = useState(false);

    // フォームの開閉処理
    const handleAddTransactionForm = () => {
      if (isMobile) {
        setIsDialogOpen(true);
      } else {
        if (selectedTransaction) {
          setSelectedTransaction(null);
        } else {
          setIsEntryDrawerOpen(!isEntryDrawerOpen);
        }
      }
    };

    const onCloseForm = () => {
      setSelectedTransaction(null);
      if (isMobile) {
        setIsDialogOpen(!isDialogOpen);
      } else {
        setIsEntryDrawerOpen(!isEntryDrawerOpen);
      }
    };

    // 取引が選択された時の処理
    const handleSelectTransaction = (transaction: Transaction) => {
      setSelectedTransaction(transaction);
      if (isMobile) {
        setIsDialogOpen(true);
      } else {
        setIsEntryDrawerOpen(true);
      }
    };

    const handleDateClick = (dateInfo: DateClickArg) => {
      setCurrentDay(dateInfo.dateStr);
      setIsMobileDraoerOpen(true);
    };

    const handleCloseMobileDrawer = () => {
      setIsMobileDraoerOpen(false);
    };

    return (
      <Box sx={{ display: 'flex' }}>
        {/* 左側コンテンツ */}
        <Box sx={{ flexGrow: 1 }}>
          <MonthlySummary
          // monthlyTransactions={monthlyTransactions}
          />
          <Calendar
            // monthlyTransactions={monthlyTransactions}
            // setCurrentMonth={setCurrentMonth}
            setCurrentDay={setCurrentDay}
            currentDay={currentDay}
            today={today}
            onDateClick={handleDateClick}
          />
        </Box>

        {/* 右側コンテンツ */}
        <Box>
          <TransactionMenu
            dailyTransactions={dailyTransactions}
            currentDay={currentDay}
            onHandleAddTransactionForm={handleAddTransactionForm}
            onSelectTransaction={handleSelectTransaction}
            open={isMobileDraoerOpen}
            onClose={handleCloseMobileDrawer}
          />
          <TransactionForm
            onCloseForm={onCloseForm}
            isEntryDrawerOpen={isEntryDrawerOpen}
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
            currentDay={currentDay}
            // onSaveTransaction={onSaveTransaction}
            selectedTransaction={selectedTransaction}
            // onDeleteTransaction={onDeleteTransaction}
            setSelectedTransaction={setSelectedTransaction}
            // onUpdateTransaction={onUpdateTransaction}
          />
        </Box>
      </Box>
    );
  };

export default Home;
