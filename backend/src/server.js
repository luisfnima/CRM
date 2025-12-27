import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import vaultRoutes from './routes/vault.routes.js';
import usersRoutes from './routes/users.routes.js';
import campaignsRoutes from './routes/campaigns.routes.js';
import leadsRoutes from './routes/leads.routes.js';
import callsRoutes from './routes/calls.routes.js';
import salesRoutes from './routes/sales.routes.js';
import productsRoutes from './routes/products.routes.js';
import leadCampaignRoutes from './routes/leadCampaign.routes.js';


dotenv.config();

const app = express();

const PORT = process.env.PORT || 3001;

//Middleware
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || 'https://localhost:5173',
    credentials: true
}));

app.use(express.json());

// --------Routes---------
//base
app.use('/api/auth', authRoutes);
app.use('/api/vault', vaultRoutes);
app.use('/api/users', usersRoutes);
//campanas
app.use('/api/campaigns', campaignsRoutes); 
//leads
app.use('/api/leads', leadsRoutes);
//ventas y llamadas
app.use('/api/calls', callsRoutes);
app.use('/api/sales', salesRoutes);  
// productos 
app.use('/api/products', productsRoutes);
// leads en campana
app.use('/api/lead-campaign', leadCampaignRoutes);



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