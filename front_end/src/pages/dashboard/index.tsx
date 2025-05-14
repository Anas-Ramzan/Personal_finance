import { useUser } from "@clerk/clerk-react";
import { FinancialRecordForm } from "./financial-record-forum";
import { FinancialRecordList } from "./financial-record-list";
import { useFinancialRecords } from "../context/financial-record-context";
import { useMemo } from "react";
import "./financial-record.css"; // ✅ Make sure path is correct relative to this file

export const Dashboard = () => {
  const { user } = useUser();
  const { records } = useFinancialRecords();

  const totalMonthly = useMemo(() => {
    return records.reduce((sum, record) => sum + record.amount, 0);
  }, [records]);

  return (
    <div className="dashboard-container">
      <h1>Welcome {user?.firstName}! Here Are Your Finances:</h1>

      <div className="form-container">
        <FinancialRecordForm />
      </div>

      <h2>Total Monthly: ${totalMonthly}</h2>

      <div className="list-container">
        <FinancialRecordList />
      </div>
    </div>
  );
};
