import { Route, Routes, Outlet } from 'react-router-dom'
import NavBar from './components/NavBar'
import Dashboard from './pages/Dashboard'
import YearAnalysis from './pages/YearAnalysis'
import Export from './pages/Export'
import ItemSearch from './pages/ItemSearch'
import { useExpenseStore } from './hooks/useExpenseStore'
import './App.css'

/**
 * Shared shell for every page: renders the nav bar and hands the expense
 * store down to whichever route is active via router outlet context.
 */
function Layout() {
  const { expenses, budget, addExpense, deleteExpense, updateExpense, importExpenses, changeBudget } =
    useExpenseStore()

  return (
    <>
      <NavBar />
      <div className="app">
        <Outlet
          context={{
            expenses,
            budget,
            onAdd: addExpense,
            onDelete: deleteExpense,
            onUpdate: updateExpense,
            onImport: importExpenses,
            onBudgetChange: changeBudget,
          }}
        />
      </div>
    </>
  )
}

/** Top-level route table: one layout shell wrapping the four pages. */
function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/analysis" element={<YearAnalysis />} />
        <Route path="/search" element={<ItemSearch />} />
        <Route path="/export" element={<Export />} />
      </Route>
    </Routes>
  )
}

export default App
