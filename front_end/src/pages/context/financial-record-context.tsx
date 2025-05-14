// ✅ Corrected financial-record-context.tsx
import { useUser } from "@clerk/clerk-react";
import { createContext, useContext, useEffect, useState } from "react";

export interface FinancialRecord {
  _id?: string; // ✅ Add this for MongoDB _id
  id?: string;  // Optional: If your app uses a custom ID
  userId: string;
  date: Date;
  descr: string;
  amount: number;
  category: string;
  paymentMethod: string;
}

interface FinancialRecordContextType {
  records: FinancialRecord[];
  addRecord: (record: FinancialRecord) => void;
  updateRecord: (id: string, updatedRecord: FinancialRecord) => void;
  deleteRecord: (id: string) => void;
}

export const FinancialRecordsContext =
  createContext<FinancialRecordContextType | undefined>(undefined);

export const FinancialRecordsProvider = ({ children }: { children: React.ReactNode }) => {
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const { user } = useUser();

  const fetchRecords = async () => {
    if (!user) return;
    const response = await fetch(`http://localhost:5000/api/records/getAllByUserID/${user.id}`);
    if (response.ok) {
      const data = await response.json();
      setRecords(data);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [user]);

  const addRecord = async (record: FinancialRecord) => {
    const response = await fetch("http://localhost:5000/api/records", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
    });
    if (response.ok) {
      const saved = await response.json();
      setRecords((prev) => [...prev, saved]);
    }
  };

  const updateRecord = async (id: string, updatedRecord: FinancialRecord) => {
    const response = await fetch(`http://localhost:5000/api/records/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedRecord),
    });
    if (response.ok) {
      const updated = await response.json();
      setRecords((prev) =>
        prev.map((rec) => (rec.id === id || rec._id === id ? updated : rec))
      );
    }
  };

  const deleteRecord = async (id: string) => {
    const response = await fetch(`http://localhost:5000/api/records/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      setRecords((prev) => prev.filter((rec) => rec.id !== id && rec._id !== id));
    }
  };

  return (
    <FinancialRecordsContext.Provider value={{ records, addRecord, updateRecord, deleteRecord }}>
      {children}
    </FinancialRecordsContext.Provider>
  );
};

export const useFinancialRecords = () => {
  const context = useContext(FinancialRecordsContext);
  if (!context) {
    throw new Error("useFinancialRecords must be used within a FinancialRecordsProvider");
  }
  return context;
};
