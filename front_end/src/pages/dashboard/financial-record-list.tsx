import { useMemo, useState } from "react";
import { FinancialRecord, useFinancialRecords } from "../context/financial-record-context";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';

interface EditableCellProps {
  value: any;
  rowIndex: number;
  columnId: string;
  updateRecord: (rowIndex: number, columnId: string, value: any) => void;
  editable: boolean;
}

const EditableCell: React.FC<EditableCellProps> = ({ value: initialValue, rowIndex, columnId, updateRecord, editable }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);

  const onBlur = () => {
    setIsEditing(false);
    updateRecord(rowIndex, columnId, value);
  };

  return (
    <div
      onClick={() => editable && setIsEditing(true)}
      style={{ cursor: editable ? "pointer" : "default" }}
    >
      {isEditing ? (
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoFocus
          onBlur={onBlur}
          style={{ width: "100%" }}
        />
      ) : typeof value === "string" ? (
        value
      ) : (
        value?.toString()
      )}
    </div>
  );
};

export const FinancialRecordList = () => {
  const { records, updateRecord, deleteRecord } = useFinancialRecords();

  const updateCellRecord = (rowIndex: number, columnId: string, value: any) => {
    const id = records[rowIndex]?._id;
    if (!id) return;
    updateRecord(id, { ...records[rowIndex], [columnId]: value });
  };

  const columns = useMemo<ColumnDef<FinancialRecord>[]>(
    () => [
      {
        header: "Description",
        accessorKey: "descr",
        cell: ({ row, getValue }) => (
          <EditableCell
            value={getValue()}
            rowIndex={row.index}
            columnId="descr"
            updateRecord={updateCellRecord}
            editable={true}
          />
        ),
      },
      {
        header: "Amount",
        accessorKey: "amount",
        cell: ({ row, getValue }) => (
          <EditableCell
            value={getValue()}
            rowIndex={row.index}
            columnId="amount"
            updateRecord={updateCellRecord}
            editable={true}
          />
        ),
      },
      {
        header: "Category",
        accessorKey: "category",
        cell: ({ row, getValue }) => (
          <EditableCell
            value={getValue()}
            rowIndex={row.index}
            columnId="category"
            updateRecord={updateCellRecord}
            editable={true}
          />
        ),
      },
      {
        header: "Payment Method",
        accessorKey: "paymentMethod",
        cell: ({ row, getValue }) => (
          <EditableCell
            value={getValue()}
            rowIndex={row.index}
            columnId="paymentMethod"
            updateRecord={updateCellRecord}
            editable={true}
          />
        ),
      },
      {
        header: "Date",
        accessorKey: "date",
        cell: ({ row, getValue }) => (
          <EditableCell
            value={getValue()}
            rowIndex={row.index}
            columnId="date"
            updateRecord={updateCellRecord}
            editable={false}
          />
        ),
      },
      {
        header: "Delete",
        id: "delete",
        cell: ({ row }) => (
          <button
            onClick={() => deleteRecord(row.original._id ?? "")}
            className="button"
          >
            Delete
          </button>
        ),
      },
    ],
    [records]
  );

  const table = useReactTable({
    data: records,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
