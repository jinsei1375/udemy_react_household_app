import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  ListItemIcon,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close'; // 閉じるボタン用のアイコン
import FastfoodIcon from '@mui/icons-material/Fastfood'; //食事アイコン
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { ExpenseCategory, IncomeCategory, Transaction } from '../types';
import {
  AddBusiness,
  AddHome,
  Alarm,
  Diversity3,
  Fastfood,
  Savings,
  SportsTennis,
  Work,
} from '@mui/icons-material';
import { useContext, useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Schema, transactionScheme } from '../validations/schema';
import { AppContext, useAppContext } from '../context/AppContext';

interface TransactionFormProps {
  onCloseForm: () => void;
  isEntryDrawerOpen: boolean;
  currentDay: string;
  onSaveTransaction: (transaction: Schema) => Promise<void>;
  selectedTransaction: Transaction | null;
  onDeleteTransaction: (transactionId: string | readonly string[]) => Promise<void>;
  setSelectedTransaction: React.Dispatch<React.SetStateAction<Transaction | null>>;
  onUpdateTransaction: (transaction: Schema, transactionId: string) => Promise<void>;
}

type IncomeExpense = 'income' | 'expense';

interface CategoryItem {
  label: IncomeCategory | ExpenseCategory;
  icon: JSX.Element;
}

const TransactionForm = ({
  onCloseForm,
  isEntryDrawerOpen,
  currentDay,
  onSaveTransaction,
  selectedTransaction,
  onDeleteTransaction,
  setSelectedTransaction,
  onUpdateTransaction,
}: TransactionFormProps) => {
  const formWidth = 320;

  const context = useAppContext();
  console.log(context.transactions);
  const expenseCategories: CategoryItem[] = [
    { label: '食費', icon: <FastfoodIcon fontSize="small" /> },
    { label: '日用品', icon: <Alarm fontSize="small" /> },
    { label: '交際費', icon: <Diversity3 fontSize="small" /> },
    { label: '娯楽', icon: <SportsTennis fontSize="small" /> },
    { label: '固定費', icon: <AddHome fontSize="small" /> },
  ];

  const incomeCategories: CategoryItem[] = [
    { label: '給与', icon: <Work fontSize="small" /> },
    { label: '副収入', icon: <AddBusiness fontSize="small" /> },
    { label: 'お小遣い', icon: <Savings fontSize="small" /> },
  ];

  const [categories, setCategories] = useState(expenseCategories);

  const {
    control,
    setValue,
    watch,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<Schema>({
    defaultValues: {
      type: 'expense',
      date: currentDay,
      amount: 0,
      category: '',
      content: '',
    },
    resolver: zodResolver(transactionScheme),
  });

  const incomeExpenseToggle = (type: IncomeExpense) => {
    setValue('type', type);
    setValue('category', '');
    // console.log(type);
    // type === 'income' ? setCategories(incomeCategories) : setCategories(expenseCategories);
  };

  // 収支タイプを監視
  const currentType = watch('type');

  useEffect(() => {
    setValue('date', currentDay);
  }, [currentDay]);

  // 送信処理
  const onSubmit: SubmitHandler<Schema> = (data) => {
    console.log(data);
    if (selectedTransaction) {
      onUpdateTransaction(data, selectedTransaction.id)
        .then(() => {
          // console.log('更新しました。');
          setSelectedTransaction(null);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      onSaveTransaction(data)
        .then(() => {
          console.log('保存しました。');
        })
        .catch((error) => {
          console.log(error);
        });
    }
    reset({
      type: 'expense',
      date: currentDay,
      amount: 0,
      category: '',
      content: '',
    });
  };

  useEffect(() => {
    // 選択肢が更新されたか確認
    if (selectedTransaction) {
      const isCategoryExists = categories.some(
        (category) => category.label === selectedTransaction.category
      );
      setValue('category', isCategoryExists ? selectedTransaction.category : '');
    }
    console.log(categories);
  }, [selectedTransaction, categories]);

  // フォーム内容更新
  useEffect(() => {
    if (selectedTransaction) {
      setValue('type', selectedTransaction.type);
      setValue('date', selectedTransaction.date);
      setValue('amount', selectedTransaction.amount);
      setValue('content', selectedTransaction.content);
    } else {
      reset({
        type: 'expense',
        date: currentDay,
        amount: 0,
        category: '',
        content: '',
      });
    }
  }, [selectedTransaction]);

  // React推奨のuseEffectの使用方法ではない？ Reactの外側との連携に留めるべき？
  useEffect(() => {
    const newCategories = currentType === 'income' ? incomeCategories : expenseCategories;
    console.log(newCategories);
    setCategories(newCategories);
  }, [currentType]);

  const handleDelete = () => {
    if (selectedTransaction) {
      onDeleteTransaction(selectedTransaction.id);
      setSelectedTransaction(null);
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 64,
        right: isEntryDrawerOpen ? formWidth : '-2%', // フォームの位置を調整
        width: formWidth,
        height: '100%',
        bgcolor: 'background.paper',
        zIndex: (theme) => theme.zIndex.drawer - 1,
        transition: (theme) =>
          theme.transitions.create('right', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        p: 2, // 内部の余白
        boxSizing: 'border-box', // ボーダーとパディングをwidthに含める
        boxShadow: '0px 0px 15px -5px #777777',
      }}
    >
      {/* 入力エリアヘッダー */}
      <Box display={'flex'} justifyContent={'space-between'} mb={2}>
        <Typography variant="h6">入力</Typography>
        {/* 閉じるボタン */}
        <IconButton
          onClick={onCloseForm}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      {/* テスト */}
      {/* フォーム要素 */}
      <Box component={'form'} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          {/* 収支切り替えボタン */}
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <ButtonGroup fullWidth>
                <Button
                  variant={field.value === 'expense' ? 'contained' : 'outlined'}
                  color="error"
                  onClick={() => incomeExpenseToggle('expense')}
                >
                  支出
                </Button>
                <Button
                  variant={field.value === 'income' ? 'contained' : 'outlined'}
                  onClick={() => incomeExpenseToggle('income')}
                >
                  収入
                </Button>
              </ButtonGroup>
            )}
          />
          {/* 日付 */}
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="日付"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                error={!!errors.date}
                helperText={errors.date?.message}
              />
            )}
          />
          {/* カテゴリ */}
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.category}>
                <InputLabel id="cateogry-select-label">カテゴリ</InputLabel>
                <Select
                  {...field}
                  labelId="cateogry-select-label"
                  id="cateogry-select"
                  label="カテゴリ"
                >
                  {categories.map((category) => (
                    <MenuItem value={category.label} key={category.label}>
                      <ListItemIcon>{category.icon}</ListItemIcon>
                      {category.label}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.category?.message}</FormHelperText>
              </FormControl>
              // <TextField
              //   {...field}
              //   id="カテゴリ"
              //   label="カテゴリ"
              //   select
              //   error={!!errors.category}
              //   helperText={errors.category?.message}
              //   InputLabelProps={{
              //     htmlFor: 'category',
              //   }}
              //   inputProps={{ id: 'category' }}
              // >
              //   {categories.map((category) => (
              //     <MenuItem value={category.label} key={category.label}>
              //       <ListItemIcon>{category.icon}</ListItemIcon>
              //       {category.label}
              //     </MenuItem>
              //   ))}
              // </TextField>
            )}
          />
          {/* 金額 */}
          <Controller
            name="amount"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                value={field.value === 0 ? '' : field.value}
                onChange={(e) => {
                  const newValue = parseInt(e.target.value, 10) || 0;
                  field.onChange(newValue);
                }}
                label="金額"
                type="number"
                error={!!errors.amount}
                helperText={errors.amount?.message}
              />
            )}
          />
          {/* 内容 */}
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="内容"
                type="text"
                error={!!errors.content}
                helperText={errors.content?.message}
              />
            )}
          />
          {/* 保存ボタン */}
          <Button
            type="submit"
            variant="contained"
            color={currentType === 'income' ? 'primary' : 'error'}
            fullWidth
          >
            {selectedTransaction ? '更新' : '保存'}
          </Button>
          {selectedTransaction && (
            <Button onClick={handleDelete} variant="outlined" color={'secondary'} fullWidth>
              削除
            </Button>
          )}
        </Stack>
      </Box>
    </Box>
  );
};
export default TransactionForm;
