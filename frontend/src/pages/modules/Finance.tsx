import { useLocation } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import FinanceOverview from "../../components/finance/FinanceOverview";
import TransactionsList from "../../components/finance/TransactionsList";
import BudgetsList from "../../components/finance/BudgetsList";
import FinanceCategories from "../../components/finance/FinanceCategories";
import FinanceGuide from "../../components/finance/FinanceGuide";

export default function Finance() {
  const location = useLocation();
  const path = location.pathname;

  if (path === "/finance" || path === "/finance/") {
    return (
      <>
        <PageMeta title="Personal Finance - 26-step" description="Manage transactions, budgets, and categories" />
        <FinanceOverview />
      </>
    );
  }

  if (path === "/finance/transactions") {
    return (
      <>
        <PageMeta title="Transactions - 26-step" description="Record income and expenses" />
        <TransactionsList />
      </>
    );
  }

  if (path === "/finance/budget") {
    return (
      <>
        <PageMeta title="Budget - 26-step" description="Set expense budget" />
        <BudgetsList />
      </>
    );
  }

  if (path === "/finance/categories") {
    return (
      <>
        <PageMeta title="Categories - 26-step" description="Manage transaction categories" />
        <FinanceCategories />
      </>
    );
  }

  if (path === "/finance/guide") {
    return (
      <>
        <PageMeta title="Finance Guide - 26-step" description="Learn how to manage your finances" />
        <FinanceGuide />
      </>
    );
  }


  return (
    <>
      <PageMeta title="Personal Finance - 26-step" description="Kelola transaksi, budget, dan kategori" />
      <FinanceOverview />
    </>
  );
}

