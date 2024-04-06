import { AddBusiness, AddHome, Alarm, Diversity3, Fastfood, Savings, SportsTennis, Work } from '@mui/icons-material'
import { ExpenseCategory, IncomeCategory } from '../../types'

const IconComponents: Record<IncomeCategory | ExpenseCategory, JSX.Element> = {
  食費: <Fastfood fontSize='small' />,
  日用品: <Alarm fontSize='small' />,
  交際費: <Diversity3 fontSize='small' />,
  娯楽: <SportsTennis fontSize='small' />,
  固定費: <AddHome fontSize='small' />,
  給与: <Work fontSize='small' />,
  副収入: <AddBusiness fontSize='small' />,
  お小遣い: <Savings fontSize='small' />,
}

export default IconComponents