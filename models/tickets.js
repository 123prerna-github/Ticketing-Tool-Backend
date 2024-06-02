const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  comment: {
      type: String,
      required: true
  },
  userId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
    //  required: true
  },
  ticketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'tickets',
      required: true
  },
  createdAt1: {
      type: Date,
      default: new Date()
  }
});


const ticketSchema = new mongoose.Schema({
  ticketNo: {
    type: Number,
    required: true,
    unique : true,
},
    title: {
        type: String,
        required: [true, 'Title is required'],
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        required: true
    },
    status: {
      type: String,
      default: 'open',
      enum: ['Open', 'In-Progress', 'Resolved', 'Closed'],
  },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', // Assuming you have a User model for user details
       // required: [true, 'User ID is required'],
    },
    assignTo: {
      //  type: mongoose.Schema.Types.ObjectId,
      type:String,
        ref: 'users', // Assuming you have a User model for user details
        required: [true, 'Assign to is required'],
    },
    assignBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users', // Assuming you have a User model for user details
      required: [true, 'Assign by is required'],
  },
  comments: [commentSchema],
  label: [
    {
         type: String, 
         ref: 'labels'     // Reference the labelSchema
    }
 ], 
    createdAt: {
        type: Date,
        default: new Date(),
    },
    updatedAt: {
        type: Date,
        default: new Date(),
    },
});

module.exports = ticketSchema;





























// const mongoose = require('mongoose');

// const commentSchema = new mongoose.Schema({
//   comment: {
//       type: String,
//       required: [true, 'Comment is required'],
//   },
//   ticketId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Ticket',
//     required: true
// },
//   userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User', // Assuming you have a User model for user details
//       required: [true, 'User ID is required'],
//   },
//   createdAt: {
//       type: Date,
//       default: new Date(),
//   },
// });

// const ticketSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: [true, 'Title is required'],
//   },
//   description: {
//     type: String,
//     required: [true, 'Description is required'],
//   },
//   priority: { 
//     type: String,
//     enum: ['Low', 'Medium', 'High'],
//     required: true 
//   },
//   createdBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User', // Assuming you have a User model for user details
//     required: [true, 'User ID is required'],
//   },
//   status: {
//     type: String,
//     default: 'open',
//     enum: ['open', 'in progress', 'resolved', 'closed'],
//   },
//   comments: [
//      commentSchema
//   ],
//   createdAt: {
//     type: Date,
//     default: new Date(),
//   },
//   updatedAt: {
//     type: Date,
//     default: new Date(),
//   },
// });

// module.exports = ticketSchema;
