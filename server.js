import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import passport from './config/passport.js';
import authRoutes from './routes/authRoutes.js';
import photoRoutes from './routes/photoRoutes.js';
import albumRoutes from './routes/albumRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

const app = express();

connectDB();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(passport.initialize());

app.use('/api/auth', authRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/albums', albumRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'GitCloud API is running' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`GitCloud server running on port ${PORT}`);
});