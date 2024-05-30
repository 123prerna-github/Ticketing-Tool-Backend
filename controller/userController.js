const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { genSaltSync, hashSync, compareSync } = require("bcrypt");

const config = require("../config.json");
const conUser = mongoose.createConnection(config.mongo.ticketingUrl);

const userSchema = require("../models/users");
const userModel = conUser.model("User", userSchema);

 let user = {};

 // User Register API:
  const encryptOption = (option, salt = 10) => {
    try {
      const genSalt = genSaltSync(salt);
      return hashSync(option, genSalt);
    } catch (error) {}
  };

  const userRegister = async (req, res) => {
    try {
      const { firstName, lastName, email, password,role } = req.body;
  
      if (!firstName) {
        res.status(400).json({ success: 0, message: "First name is required" });
        return;
      }
      if (!lastName) {
        res.status(400).json({ success: 0, message: "Last name is required" });
        return;
      }
      if (!email) {
        res.status(400).json({ success: 0, message: "Email is required" });
        return;
      }
      if (!password) {
        res.status(400).json({ success: 0, message: "Password is required" });
        return;
      }
      
      const result = await userModel.findOne({ email: email }).lean();
      if (result !== null && result !== undefined && result !== "") {
        //if (result)
        res.status(400).json({ success: 0, message: "Email already exists" });
        return;
      }
      
      const pass = encryptOption(password);
  
      const user = userModel.create({
        firstName: firstName,
        lastName: lastName,
        email: email,
        role:role?role:"user",
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
        password: pass
      });
  
      if (user) {
        res
          .status(200)
          .json({ success: 1, message: "User successfully created" });
        return;
      } else {
        res.status(400).json({ success: 0, message: "error occurred1" });
      }
    } catch (error) {
      res.status(400).json({ success: 0, message: "error occurred" });
    }
  };
  
  


 
  // Get All Users:
  const getAllUsers = async (req, res) => {
    try {
        // Retrieve all users from the database, selecting only the firstname and lastname fields
        const users = await userModel.find({}, { _id: 0, firstName: 1, lastName: 1 });

          // Concatenate firstName and lastName for each user
          const formattedUsers = users.map(user => `${user.firstName} ${user.lastName}`);
        
        res.status(200).json({ success: 1, message: 'Users retrieved successfully', Users:formattedUsers });
    } catch (error) {
        res.status(400).json({ success: 0, message: 'Internal Server Error' });
    }
};


// Detail of particular user:
const viewDetail = async (req, res) => {
  try {

      const userId = req.authUser._id; // Assuming the userId is sent in the request body

      // Retrieve the user details by userId
      const user = await userModel.findById(userId);

      // Check if the user exists
      if (!user) {
          return res.status(404).json({ success: 0, message: "User not found" });
      }

      // Return only firstName and lastName from the user object
      const userData = {
          firstName: user.firstName,
          lastName: user.lastName
      };

      // Return user details
      res.status(200).json({
          success: 1,
          message: "User detail retrieved successfully",
          data: userData
      });
  } catch (error) {
      res.status(400).json({
          success: 0,
          message: "An error occurred while retrieving user detail"
      });
  }
};



// User Login API:
const decryptOption = (data, encryptedData) => {
  try {
    if (data && encryptedData) {
      const result = compareSync(data?.toString(), encryptedData?.toString());
      return result;
    }
    return false;
  } catch (error) {
    return false;
  }
};

const generateToken = (userData, JWT_SECRET, option = {}) => {
    var token = jwt.sign({ id: userData }, JWT_SECRET, option);
    return token;
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username) {
      res.status(400).json({ success: 0, message: "Username is required" });
      return;
    }
    if (!password) {
      res.status(400).json({ success: 0, message: "Password is required" });
      return;
    }

    const result = await userModel.findOne({ email: username });
    if (!result) {
      res
        .status(400)
        .json({ succsess: 0, message: "This email doesn't exist" });
      return;
    }

    const isPasswordMatch = decryptOption(password, result.password);
    if (isPasswordMatch === false) {
      res.status(400).json({ succsess: 0, message: "Password is incorrect" });
      return;
    } else {
      const token = await generateToken(
        { _id: result._id ,role:result.role},
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE_IN }
      );
      res
        .status(200)
        .json({ succsess: 1, message: "Login Success", accessToken: token });
      return;
    }
  } catch (error) {
    res.status(400).json({ success: 0, message: "error occurred" });
  }
};



user={getAllUsers,login,userRegister, viewDetail };
module.exports=user;

