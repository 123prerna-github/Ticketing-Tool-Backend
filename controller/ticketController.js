const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const config = require("../config.json");
const conUser = mongoose.createConnection(config.mongo.ticketingUrl);

const ticketSchema = require("../models/tickets");
const ticketModel = conUser.model("Ticket", ticketSchema);

const labelSchema = require("../models/labels");
const labelModel = conUser.model("Label", labelSchema);


let tickets = {};




// Create Ticket API:
const createTicket = async (req, res) => {
    try {
        const { title, description, priority, assignTo, status, label} = req.body;
        const userId = req.authUser._id; // Assuming authenticated user is attached to req.user
        if (!title) {
            res.status(400).json({ success: 0, message: "Title is required" });
            return;
        }
        if (!description) {
            res.status(400).json({ success: 0, message: "Description is required" });
            return;
        }
        if (!priority) {
            res.status(400).json({ success: 0, message: "Priority is required" });
            return;
        }
        if (!assignTo) {
            res.status(400).json({ success: 0, message: "Assignee is required" });
            return;
        }
       
            // Check if priority value is valid
            const validPriorities = ["Low", "Medium","High"]; // Assuming these are the valid priority values
            if (!validPriorities.includes(priority)) {
                res.status(400).json({ success: 0, message: "Invalid priority value" });
                return;
            }
    
        const highestTicket = await ticketModel.findOne({}, { ticketNo: 1 }).sort({ ticketNo: -1 }).limit(1);
        const initialTicketNo = 1; // Initial value for ticketNo
        const ticketNo = highestTicket ? highestTicket.ticketNo + 1 : initialTicketNo;

        const ticket = await ticketModel.create({
            ticketNo,
            title,
            description,
            priority:priority?priority:"Low",
            status:status?status:"Open",
            label:label?label:[],
            assignTo:assignTo?assignTo:"",
            assignBy:userId,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        res.status(200).json({ success: 1, message: 'Ticket created successfully', ticket });
    } catch (error) {
      console.log(error)
        res.status(400).json({ success: 0, message: 'Internal Server Error' });
    }
};




// View all Tickets:
const viewAllTickets = async (req, res) => {
  try {
      // Query the database to retrieve all tickets
      const allTickets = await ticketModel.find();

      res.status(200).json({
          success: 1,
          message: 'All tickets retrieved successfully',
          data: allTickets
      });
  } catch (error) {
      res.status(400).json({ success: 0, message: 'An error occurred while retrieving tickets' });
  }
};





// Update Ticket API:
const updateTicket = async (req, res) => {
  try {
      const { ticketId, title, description, priority, assignTo, status, label} = req.body;
     
      // Check if ticketId is provided
      if (!ticketId) {
          return res.status(400).json({ success: 0, message: "Ticket ID is required" });
      }

      // Find the ticket by ID
      const ticket = await ticketModel.findById(ticketId);
      if (!ticket) {
          return res.status(400).json({ success: 0, message: "Ticket not found" });
      }

      // Update ticket fields if provided in the request body
      if (title)   { ticket.title = title; }
      if (description) { ticket.description = description; }
      if (priority) { ticket.priority = priority; }
      if (assignTo) { ticket.assignTo = assignTo; }
      if (status) { ticket.status = status; }
      if (label) { ticket.label = label; }

      ticket.updatedAt = new Date();

      // Save the updated ticket
      const updatedTicket = await ticket.save();

      res.status(200).json({
          success: 1,
          message: "Ticket updated successfully",
          ticket: updatedTicket
      });
  } catch (error) {
      res.status(400).json({ success: 0, message: error });
  }
};








// Filter tickets based on assignedTo, date and priority:
const filterTickets = async (req, res) => {
  try {
      const { assignedTo, priority, startDate, endDate } = req.body;

      // Construct the filter object based on provided parameters
      const filter = {};
      
      if (assignedTo) {
          filter.assignTo = assignedTo;
      }
      
      if (priority) {
          filter.priority = priority;
      }
    
      // Parse and adjust the start and end date strings to Date objects
      if (startDate && endDate) {
          // Parse start date
          const [startYear, startMonth, startDay] = startDate.split('-').map(Number);
          const parsedStartDate = new Date(startYear, startMonth - 1, startDay);
          parsedStartDate.setHours(0, 0, 0, 0); // Set time to start of the day
          
          // Parse end date
          const [endYear, endMonth, endDay] = endDate.split('-').map(Number);
          const parsedEndDate = new Date(endYear, endMonth - 1, endDay);
          parsedEndDate.setHours(23, 59, 59, 999); // Set time to end of the day
          
          // Construct the date range filter using the $gte and $lte operators
          filter.createdAt = {
              $gte: parsedStartDate,
              $lte: parsedEndDate
          };
      }

      // Query the database to filter tickets based on the constructed filter object
      const filteredTickets = await ticketModel.find(filter);

      res.status(200).json({
          success: 1,
          message: 'Tickets filtered successfully',
          data: filteredTickets
      });
  } catch (error) {
      res.status(400).json({ success: 0, message: 'An error occurred while filtering tickets' });
  }
};






// Create Comment on Tickets:
const createComment = async (req, res) => {
    try {
        const { ticketId, comment } = req.body;
    
        // Check if the ticket exists
        const ticket = await ticketModel.findById(ticketId);
        if (!ticket) {
          return res.status(400).json({ success: 0, message: "Ticket not found" });
        }

       // Add comment to the ticket
          ticket.comments.push({ ticketId, comment, createdAt1: new Date() });
        
       // Save the updated ticket with the new comment
         const updatedTicket = await ticket.save();

        // Return success response with the saved comment
        res.status(200).json({
            success: 1,
            message: "Comment added successfully",
            data: updatedTicket
        });
    } catch (error) {
        res.status(400).json({
            success: 0,
            message:error
        });
    }
};




// View Ticket Comment: 
const viewComment = async (req, res) => {
    try {
        const { ticketId } = req.body;

        // Find the ticket in the database by its ID
            const ticket = await ticketModel.findById(ticketId);
            if (!ticket) {
                res.status(404).json({ success: 0, message: "Ticket not found" });
                return;
            }
    
        // Return the ticket details
        res.status(200).json({
            success: 1,
            message: "Ticket Comment retrieved successfully",
            data: ticket.comments
        });
    } catch (error) {
        // If an error occurs, return a 500 Internal Server Error
        res.status(500).json({ success: 0, message: "Internal Server Error" });
    }
};
 
  





tickets={createTicket,viewAllTickets,updateTicket ,filterTickets,createComment,viewComment};
module.exports=tickets;

