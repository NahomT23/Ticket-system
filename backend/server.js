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
    origin: 'http://localhost:5173',  
    methods: 'GET,POST,PUT,DELETE,OPTIONS', 
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,  
  };
  
  app.use(cors(corsOptions));  
  app.options('*', cors(corsOptions));

app.use(express.json());
app.use(cookieParser());
app.use(helmet());

app.use('/api/auth', authRouter);
app.use('/api/admin', adminLimiter, adminRouter);
app.use('/api/ticket', ticketLimiter, ticketRouter);

connectToDb();

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
