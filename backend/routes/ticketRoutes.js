import Router from 'express'
import {
  getAllTicket,
  getTickets,
  getTicket,
  createTicket,
  updateTicket,
  deleteTicket,
} from "../controllers/ticketController.js";
import { authorize } from '../middlewares/authMiddleware.js';
import { adminsOnly } from '../middlewares/roleMiddleware.js';


const ticketRouter = Router();

// admin to see all the tickets
ticketRouter.get("/getAll", authorize, adminsOnly, getAllTicket);

// user to get his tickets
ticketRouter.get("/get", authorize, getTickets);

// Get a single ticket for both admin and users
ticketRouter.get("/getById/:id", authorize, getTicket);

// to create a ticket for users only
ticketRouter.post("/create", authorize, createTicket);

// Admin-only routes
ticketRouter.put("/update/:id", authorize, adminsOnly, updateTicket);
ticketRouter.delete("/delete/:id", authorize, adminsOnly, deleteTicket);

export default ticketRouter;
