const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const config = require("../config.json");
const conUser = mongoose.createConnection(config.mongo.ticketingUrl);

const labelSchema = require("../models/labels");
const labelModel = conUser.model("Label", labelSchema);


let categories = {};


// Create a Label:
const createLabel = async (req, res) => {
    try {
        const { name } = req.body;

        // Create a new label instance
        const label = await labelModel.create({
            name:name
        });
        res.status(200).json({ success: 1, label: label });
    } catch (error) {
        res.status(400).json({ success: 0, error: error.message });
    }
};


// Read All Labels:
const getAllLabels = async (req, res) => {
    try {
        const labels = await labelModel.find();
        res.status(200).json({ success: 1 , labels });
    } catch (error) {
        res.status(400).json({ success: 0 , error: error.message });
    }
};


// Update a Label:
const updateLabel = async (req, res) => {
    try {
        const { name, label_id} = req.body;

        // Check if the label exists
        const label = await labelModel.findByIdAndUpdate(label_id);
        if (!label) {
         res.status(400).json({ success: 0, message: "Label not found" });
         return;
        }

    if(name) {label.name = name;}
    //if(description) {label.description = description;}
    updatedBy = req.authUser._id;
    label.updatedAt = new Date();

    // Save the updated label
      const updatedLabel = await label.save();

        res.status(200).json({ success: 1, message: 'Label updated successfully', label : updatedLabel });
    } catch (error) {
        res.status(400).json({ success: 0, message: 'Internal Server Error' });
    }
};



// Delete a Label:
const deleteLabel = async (req, res) => {
    try {
        const {label_id} = req.body;
        // check if the label exists
        const label = await labelModel.findByIdAndDelete(label_id);
        if (!label) {
            return res.status(400).json({ success: 0, message: "label not found" });
        }
        
         // Delete the label
        await labelModel.findByIdAndDelete(label_id);

        res.status(200).json({ success: 1, message: "Label deleted successfully" });
    } catch (error) {
        res.status(400).json({ success: 0, error: error.message });
    }
};



categories={createLabel,getAllLabels,updateLabel,deleteLabel};
module.exports=categories;