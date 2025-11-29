import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3001;

//Middleware
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || 'https://localhost:5173',
    credentials: true
}));

app.use(express.json());

//Routes
app.use('/api/auth', authRoutes);

//health check
app.get('/api/health', (req, res) => {
    res.json({status: 'ok', message: 'CRM API is running'});
});

//error handling
app.use((err,req,res,next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong',
        message: process.env.NODE_ENV === 'development' ? err.message: undefined
    });
});

app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
console.log(`Environment: ${process.env.NODE_ENV}`);
});