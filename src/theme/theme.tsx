import { Lightbulb } from "@mui/icons-material";
import { PaletteColor, PaletteColorOptions, createTheme } from "@mui/material";
import {
  amber,
  blue,
  cyan,
  deepOrange,
  green,
  lightBlue,
  lightGreen,
  pink,
  red,
} from "@mui/material/colors";
import { ExpenseCategory, IncomeCategory } from "../types";

declare module "@mui/material/styles" {
  interface Palette {
    incomeColor: PaletteColor;
    expenseColor: PaletteColor;
    balanceColor: PaletteColor;
    // incomeCategoryColor: {
    //   給与: string;
    //   副収入: string;
    //   お小遣い: string;
    // };
    incomeCategoryColor: Record<IncomeCategory, string>;
    expenseCategoryColor: Record<ExpenseCategory, string>;
  }
  interface PaletteOptions {
    incomeColor?: PaletteColorOptions;
    expenseColor?: PaletteColorOptions;
    balanceColor?: PaletteColorOptions;
    incomeCategoryColor?: Record<IncomeCategory, string>;
    expenseCategoryColor?: Record<ExpenseCategory, string>;
  }
}

export const theme = createTheme({
  typography: {
    fontFamily: "Noto Sans JP, Roboto, sans-serif",
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
  },

  palette: {
    incomeColor: {
      main: blue[500],
      light: blue[300],
      dark: blue[700],
    },
    expenseColor: {
      main: red[500],
      light: red[300],
      dark: red[700],
    },
    balanceColor: {
      main: green[500],
      light: green[300],
      dark: green[700],
    },

    incomeCategoryColor: {
      給与: lightBlue[500],
      副収入: cyan[500],
      お小遣い: lightGreen[600],
    },
    expenseCategoryColor: {
      食費: deepOrange[500],
      日用品: lightGreen[500],
      交際費: amber[600],
      娯楽: pink[600],
      固定費: cyan[600],
    },
  },
});
