const express = require("express");
const {verifyToken} = require("../middleware/auth");
const router = express.Router();

const User = require("../controller/userController");
const Ticket = require("../controller/ticketController");
const Label = require("../controller/labelController");




                             // User API's

/****************************** Login-api *******************************/
router
  .route("/login")
  .post([User.login]);


/****************************** Register-api ****************************/
router
  .route("/register")
  .post([User.userRegister]);


/******************************* getAllJUsers-api **********************/                           

router
     .route("/getallusers")
     .get([User.getAllUsers]); 


/******************************* viewdetail-api **************************************/
router 
     .route("/view1")
     .get([verifyToken,User.viewDetail]);  


                           // Ticket API's


/****************************** create-api ******************************/

router
  .route("/createticket")
  .post([verifyToken,Ticket.createTicket]);


/****************************** viewall-api *******************************/

router
  .route("/viewalltickets")
  .get([Ticket.viewAllTickets]);
  
 
 
/****************************** update-api *******************************/

router
.route("/updateticket")
// .put([verifyToken,Ticket.updateTicket]);
.put([Ticket.updateTicket]); 
    


/************************ filteringtickets-api **************************/
  router   
      .route("/filterticket")
      .post([Ticket.filterTickets]);



/****************************** createComment-api ************************/
router
.route("/createcomment")
.post([Ticket.createComment]);    



/****************************** viewComment-api ************************/
router
.route("/viewcomment")
.post([Ticket.viewComment]);    

                             // Label API'S
     
   /************************* creatingLabel-api ***************************/

      router
      .route("/createlabel")
      .post([Label.createLabel]);
  

   /************************ retreivingLabel-api **************************/

   router
   .route("/viewlabel")
   .get([Label.getAllLabels]);  
   



  /****************************** updatingLabel-api ************************/

  router
  .route("/updatelabel")
  .put([verifyToken,Label.updateLabel]);  



  /****************************** deletinglabel-api *************************/

  router
  .route("/deletelabel")
  .delete([Label.deleteLabel]);  
    
 

module.exports = router;