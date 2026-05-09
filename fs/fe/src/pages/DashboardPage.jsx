import { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import { getTransactionChart, getTransactionDashboard } from '../api/transaction';

export default function DashboardPage() {
  const { user } = useAuth();

  const [transactionChart, setTransactionChart] =
    useState([]);
  const [transactionDashboard, setTransactionDashboard
  ] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const chart = await getTransactionChart();
        const dashboard =
          await getTransactionDashboard();

        setTransactionChart(chart.data);
        setTransactionDashboard(dashboard.data);

      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <section>
      <div>{user.id}</div>
      <div>{user.fullname}</div>
      <div>{user.email}</div>
      <div>{user.verified_email}</div>
      <div>
        Income:
        {transactionDashboard?.summary?.income}
      </div>

      <div>
        Expense:
        {transactionDashboard?.summary?.expense}
      </div>

      <div>
        Balance:
        {transactionDashboard?.summary?.balance}
      </div>

      <div>
        Label:
        {transactionDashboard?.summary?.label}
      </div>

      <div>
        income:
        {transactionDashboard?.summary?.income}
      </div>

      <div>
        expanse:
        {transactionDashboard?.summary?.expense}
      </div>

    </section>
  );
}