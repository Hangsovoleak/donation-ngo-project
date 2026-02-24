/**
 * Software Framework: Express.js (Node.js)
 * Description:
 *      Core application configuration. Sets up global middleware, 
 *      registers API routes, and defines centralized error handling.
 * 
 */

/*------------------------------------------------------------------------------
                                   IMPORTS
------------------------------------------------------------------------------*/
import express from 'express';
import cors from 'cors';

// Route Modules
import ngoRoutes from './routes/ngo.routes.js';
import categoryRoutes from './routes/category.routes.js';
import beneficiariesRoutes from './routes/beneficiary.routes.js';
import locationRoutes from './routes/location.routes.js';
import adminRoutes from './routes/admin.routes.js';

// Middleware Modules
import notFound from './middleware/notFound.js';
import errorHandler from './middleware/errorHandler.js';

/*------------------------------------------------------------------------------
                            APPLICATION SETUP
------------------------------------------------------------------------------*/
const app = express();

// Global Middleware
app.use(cors());
app.use(express.json());

// Health Check Endpoint
app.get('/api/health', (req, res) => {
    res.json({ ok: true });
});

/*------------------------------------------------------------------------------
                                   ROUTES
------------------------------------------------------------------------------*/
app.use('/api/ngos', ngoRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/beneficiaries', beneficiariesRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/admin', adminRoutes);

/*------------------------------------------------------------------------------
                                ERROR HANDLING
------------------------------------------------------------------------------*/
app.use(notFound);
app.use(errorHandler);

export default app;
