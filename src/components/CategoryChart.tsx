import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartData } from 'chart.js';
import { useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { ExpenseCategory, IncomeCategory, Transaction, TransactionType } from '../types';
import { theme } from '../theme/theme';
import { useAppContext } from '../context/AppContext';
import useMonthlyTransactions from '../hooks/useMonthlyTransactions';

ChartJS.register(ArcElement, Tooltip, Legend);

// interface CategoryChartProps {
//   monthlyTransactions: Transaction[];
//   isLoading: boolean;
// }

const CategoryChart = () =>
  // { monthlyTransactions, isLoading }: CategoryChartProps
  {
    const { isLoading } = useAppContext();
    const monthlyTransactions = useMonthlyTransactions();
    const theme = useTheme();
    const [selecedType, setSelectedType] = useState<TransactionType>('expense');

    const categorySums = monthlyTransactions
      .filter((transaction) => transaction.type === selecedType)
      .reduce<Record<IncomeCategory | ExpenseCategory, number>>((acc, transaction) => {
        if (!acc[transaction.category]) {
          acc[transaction.category] = 0;
        }
        acc[transaction.category] += transaction.amount;
        return acc;
      }, {} as Record<IncomeCategory | ExpenseCategory, number>);

    const categoryLabels = Object.keys(categorySums) as (IncomeCategory | ExpenseCategory)[];
    const categoryValues = Object.values(categorySums);

    // const options = {
    //   maintainAspectRatio: false,
    //   responsive: true,
    //   },
    // };

    const incomeCategoryColor: Record<IncomeCategory, string> = {
      給与: theme.palette.incomeCategoryColor.給与,
      副収入: theme.palette.incomeCategoryColor.副収入,
      お小遣い: theme.palette.incomeCategoryColor.お小遣い,
    };

    const expenseCategoryColor: Record<ExpenseCategory, string> = {
      食費: theme.palette.expenseCategoryColor.食費,
      日用品: theme.palette.expenseCategoryColor.日用品,
      交際費: theme.palette.expenseCategoryColor.交際費,
      娯楽: theme.palette.expenseCategoryColor.娯楽,
      固定費: theme.palette.expenseCategoryColor.固定費,
    };

    const getCategoryColor = (category: IncomeCategory | ExpenseCategory): string => {
      if (selecedType == 'income') {
        return incomeCategoryColor[category as IncomeCategory];
      } else {
        return expenseCategoryColor[category as ExpenseCategory];
      }
    };

    const data: ChartData<'pie'> = {
      labels: categoryLabels,
      datasets: [
        {
          data: categoryValues,
          backgroundColor: categoryLabels.map((category) => getCategoryColor(category)),
          borderColor: categoryLabels.map((category) => getCategoryColor(category)),
          borderWidth: 1,
        },
      ],
    };
    return (
      <>
        <FormControl fullWidth>
          <InputLabel id="type-select-label">収支の種類</InputLabel>
          <Select
            labelId="type-select-label"
            id="type-select"
            value={selecedType}
            label="収支の種類"
            onChange={(e) => setSelectedType(e.target.value as TransactionType)}
          >
            <MenuItem value={'income'}>収入</MenuItem>
            <MenuItem value={'expense'}>支出だよ</MenuItem>
          </Select>
        </FormControl>
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {isLoading ? (
            <CircularProgress />
          ) : monthlyTransactions.length > 0 ? (
            <Pie data={data} options={{ maintainAspectRatio: false, responsive: true }} />
          ) : (
            <Typography>データがありません</Typography>
          )}
        </Box>
      </>
    );
  };

export default CategoryChart;
