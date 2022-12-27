import { useContext, useEffect, useState } from "react"
import ExpensesOutput from "../components/Expenses/ExpensesOutput"
import ErrorOverlay from "../components/UI/ErrorOverlay"
import LoadingOverlay from "../components/UI/LoadingOverlay"
import { ExpensesContext } from "../store/expenses-context"
import { getDateMinusDays } from "../util/date"
import { fetchExpenses } from "../util/http"

const RecentExpenses = () => {
  const [isFetching, setIsFetching] = useState(true)
  const [error, setError] = useState()
  const expensesCtx = useContext(ExpensesContext)

  useEffect(() => {
    const getExpenses = async () => {
      try {
        const expenses = await fetchExpenses()
        expensesCtx.setExpenses(expenses)
      } catch (error) {
        setError("Could not fetch Expenses")
      }
      setIsFetching(false)
    }

    getExpenses()
  }, [])

  const recentExpenses = expensesCtx.expenses.filter((expense) => {
    const today = new Date()
    const date7DaysAgo = getDateMinusDays(today, 7)

    return expense.date >= date7DaysAgo && expense.date <= today
  })

  const errorHandler = () => {
    setError(null)
  }

  if (error && !isFetching) {
    return <ErrorOverlay message={error} onConfirm={errorHandler} />
  }

  if (isFetching) {
    return <LoadingOverlay />
  }

  return (
    <ExpensesOutput
      expenses={recentExpenses}
      expensesPeriod="Last 7 days"
      fallbackText="No expenses registered for the last 7 days"
    />
  )
}

export default RecentExpenses
