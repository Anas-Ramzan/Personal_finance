// server/src/server.ts
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import recordRoutes from './routes/financial-record';

const app = express();
const PORT = 5000;

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ MongoDB connection
const mongoURI = 'mongodb+srv://admin2:admin786@personalfinance1.fkbnikl.mongodb.net/';

mongoose
  .connect(mongoURI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ Base route
app.get('/', (req: Request, res: Response) => {
  res.send('✅ Backend is running with TypeScript + MongoDB!');
});

// ✅ Use record routes
app.use('/api/records', recordRoutes); // ✅ All routes will now be /api/records/...

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is listening on port ${PORT}`);
});
