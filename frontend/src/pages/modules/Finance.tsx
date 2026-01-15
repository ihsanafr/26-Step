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
        <PageMeta title="Personal Finance - Lifesync" description="Kelola transaksi, budget, dan kategori" />
        <FinanceOverview />
      </>
    );
  }

  if (path === "/finance/transactions") {
    return (
      <>
        <PageMeta title="Transaksi - Lifesync" description="Catat pemasukan dan pengeluaran" />
        <TransactionsList />
      </>
    );
  }

  if (path === "/finance/budget") {
    return (
      <>
        <PageMeta title="Budget - Lifesync" description="Atur budget pengeluaran" />
        <BudgetsList />
      </>
    );
  }

  if (path === "/finance/categories") {
    return (
      <>
        <PageMeta title="Kategori - Lifesync" description="Kelola kategori transaksi" />
        <FinanceCategories />
      </>
    );
  }

  if (path === "/finance/guide") {
    return (
      <>
        <FinanceGuide />
      </>
    );
  }


  return (
    <>
      <PageMeta title="Personal Finance - Lifesync" description="Kelola transaksi, budget, dan kategori" />
      <FinanceOverview />
    </>
  );
}

