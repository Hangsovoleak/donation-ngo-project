//Middleware for CORS, JSON parsing
import express from 'express';
import cors from 'cors';

//Routes : all API endpoints
import ngoRoutes from './routes/ngo.routes.js';
import categoryRoutes from './routes/category.routes.js';
import beneficiariesRoutes from './routes/beneficiary.routes.js';
import locationRoutes from './routes/location.routes.js';

//Error handling (404 + error handler)
import notFound from './middleware/notFound.js';
import errorHandler from './middleware/errorHandler.js';

//app where can configue the Express app like: middleware, routes, err handling
const app = express();

//Enales cross-origin requests. without this, React often gets blocked | for connecting backend to React frontend
app.use(cors());
//Express read JSON body from request
app.use(express.json());

//test endpoint to confirm server is running
app.get('/api/health', (req, res) => {
    res.json({ok: true});
});

//routes
app.use('/api/ngos', ngoRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/beneficiaries', beneficiariesRoutes);
app.use('/api/locations', locationRoutes);

//errors
app.use(notFound);
app.use(errorHandler);

export default app;