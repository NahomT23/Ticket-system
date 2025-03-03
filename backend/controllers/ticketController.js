import Ticket from "../models/ticketsModel.js";

export const getAllTicket = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    const tickets = await Ticket.find().populate("createdBy", "name email");
    res.status(200).json({ success: true, data: tickets });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving tickets", error: error.message });
  }
};

export const getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ createdBy: req.user._id });
    res.status(200).json({ success: true, data: tickets });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving your tickets", error: error.message });
  }
};

export const getTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    if (req.user.role !== "admin" && ticket.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied. You can only view your own tickets." });
    }
    res.status(200).json({ success: true, data: ticket });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving the ticket", error: error.message });
  }
};

export const createTicket = async (req, res) => {
  try {

    if (req.user.role === "admin") {
      return res.status(403).json({ message: "Admins are not allowed to create tickets." });
    }

    const { title, description, priority } = req.body;

    // Validate required fields.
    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required." });
    }

    // Validate priority if provided.
    const allowedPriorities = ["high", "medium", "low"];
    const ticketData = {
      title,
      description,
      createdBy: req.user._id,
    };

    if (priority && allowedPriorities.includes(priority)) {
      ticketData.priority = priority;
    }

    // Create ticket (status defaults to "open" per the model).
    const newTicket = new Ticket(ticketData);
    await newTicket.save();

    res.status(201).json({ success: true, message: "Ticket created successfully", data: newTicket });
  } catch (error) {
    res.status(500).json({ message: "Error creating ticket", error: error.message });
  }
};

export const updateTicket = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only can update tickets." });
    }
    const { id } = req.params;
    const { title, description, status, priority } = req.body;

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (status && ["open", "in progress", "completed"].includes(status)) {
      updateData.status = status;
    }
    if (priority && ["high", "medium", "low"].includes(priority)) {
      updateData.priority = priority;
    }

    const updatedTicket = await Ticket.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedTicket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    res.status(200).json({ success: true, message: "Ticket updated successfully", data: updatedTicket });
  } catch (error) {
    res.status(500).json({ message: "Error updating ticket", error: error.message });
  }
};

export const deleteTicket = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only can delete tickets." });
    }
    const { id } = req.params;
    const deletedTicket = await Ticket.findByIdAndDelete(id);
    if (!deletedTicket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    res.status(200).json({ success: true, message: "Ticket deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting ticket", error: error.message });
  }
};



