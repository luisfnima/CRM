import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import vaultRoutes from './routes/vault.routes.js';
import usersRoutes from './routes/users.routes.js';
import campaignsRoutes from './routes/campaigns.routes.js';
import leadsRoutes from './routes/leads.routes.js';
import branchRoutes from './routes/branches.routes.js';
import callsRoutes from './routes/calls.routes.js';
import salesRoutes from './routes/sales.routes.js';
import productsRoutes from './routes/products.routes.js';
import leadCampaignRoutes from './routes/leadCampaign.routes.js';
import roleRoutes from './routes/roles.routes.js';           // ⬅️ NUEVO
import scheduleRoutes from './routes/schedules.routes.js';   // ⬅️ NUEVO

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3001;

// ✅ CORS Configuration
app.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Length', 'X-Request-Id']
}));

app.use(express.json());

// --------Routes---------
app.use('/api/auth', authRoutes);
app.use('/api/vault', vaultRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/roles', roleRoutes);                    // ⬅️ NUEVO
app.use('/api/schedules', scheduleRoutes);            // ⬅️ NUEVO
app.use('/api/campaigns', campaignsRoutes); 
app.use('/api/leads', leadsRoutes);
app.use('/api/calls', callsRoutes);
app.use('/api/sales', salesRoutes);  
app.use('/api/products', productsRoutes);
app.use('/api/lead-campaign', leadCampaignRoutes);

app.get('/api/health', (req, res) => {
    res.json({status: 'ok', message: 'CRM API is running'});
});

app.use((err,req,res,next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong',
        message: process.env.NODE_ENV === 'development' ? err.message: undefined
    });
});

app.use('/api/branches', branchRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log(`CORS enabled for all origins`);
});