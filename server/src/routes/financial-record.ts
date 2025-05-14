// server/src/routes/recordRoutes.ts
import express, { Request, Response } from "express";
import FinancialRecord from "../models/FinancialRecord";

const router = express.Router();

interface UserIdParams {
  userId: string;
}
interface IdParams {
  id: string;
}

// ✅ GET by userId
router.get(
  "/getAllByUserID/:userId",
  async (req: Request<UserIdParams>, res: Response): Promise<void> => {
    try {
      const userId = req.params.userId;
      const records = await FinancialRecord.find({ userId });

      if (records.length === 0) {
        res.status(404).send("No records found for the user");
        return;
      }

      res.status(200).json(records);
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  }
);

// ✅ POST
router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const newRecord = new FinancialRecord(req.body);
    const savedRecord = await newRecord.save();
    res.status(200).json(savedRecord);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// ✅ PUT
router.put("/:id", async (req: Request<IdParams>, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    const record = await FinancialRecord.findByIdAndUpdate(id, updatedData, { new: true });

    if (!record) {
      res.status(404).send("Record not found");
      return;
    }

    res.status(200).json(record);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// ✅ DELETE
router.delete("/:id", async (req: Request<IdParams>, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    const deletedRecord = await FinancialRecord.findByIdAndDelete(id);

    if (!deletedRecord) {
      res.status(404).send("Record not found");
      return;
    }

    res.status(200).json({ message: "Record deleted successfully", deletedRecord });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

export default router;
