import express from "express";
import { configDotenv } from "dotenv";
import authRouter from "./routes/authRoutes.js";
import { connectToDb } from "./config/db.js";
import adminRouter from "./routes/adminRoutes.js";
import ticketRouter from "./routes/ticketRoutes.js";
import { adminLimiter, authLimiter, ticketLimiter } from "./middlewares/rateLimiterMiddleware.js";
import helmet from 'helmet';
import cors from 'cors'
import cookieParser from "cookie-parser";

configDotenv();

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
    origin: 'http://localhost:5173',  // Your frontend's address
    methods: 'GET,POST,PUT,DELETE,OPTIONS',  // Allowed HTTP methods, ensure OPTIONS is here
    allowedHeaders: 'Content-Type,Authorization',  // Allowed headers
    credentials: true,  // Allow cookies to be sent
  };
  
  app.use(cors(corsOptions));  // Enable CORS with the specified options
  
  // Middleware for preflight requests (OPTIONS)
  app.options('*', cors(corsOptions));  // Handle preflight requests for all routes
  
app.use(express.json());
app.use(cookieParser());
app.use(helmet());

// app.use('/api/auth', authLimiter, authRouter);
// app.use('/api/admin', adminLimiter, adminRouter);
// app.use('/api/ticket', ticketLimiter, ticketRouter);

app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/ticket', ticketRouter);


connectToDb();

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});

