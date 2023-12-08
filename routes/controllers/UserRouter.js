const { default: mongoose } = require("mongoose");
const UserService = require("../../services/UserService");
const { isAuth } = require("./AuthMiddleware");
const { validateLoginInput } = require("./../../validation/login");
const { issueJWT } = require("../../lib/utils");
const passport = require("passport");
const { validateRegisterInput } = require("../../validation/register");
const router = require("express").Router();
const nodemailer = require("nodemailer");
const { getUserById } = require("../../repositories/UserRepository");
const jwt = require("jsonwebtoken");
const { data } = require("autoprefixer");
const User = require("../../models/user/User");
const SERVER_URL = process.env.FRONT_END_URL;

const randomstring = require("randomstring");
const bcrypt = require("bcrypt");

const ForgotPasswordEmailHTML = require("../../EmailTemplates/ForgotPasswordEmailHTML");

const { google } = require("googleapis");
const { readFile } = require("fs");

// Create an instance of the OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CLIENT_CALLBACK_URL
);

// Function to generate the authorization URL
function getAuthUrl() {
  const scopes = ["email", "profile"];
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: scopes,
  });
  // console.log(url);
  return url;
}

const keysecret = process.env.JWT_SECRET;

const sender_email = process.env.SENDER_EMAIL;
const sender_email_pass = process.env.SENDER_EMAIL_PASS;
//email config

const generatePassword = (length) => {
  var password = "";
  var charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  for (var i = 0; i < length; i++) {
    var randomIndex = Math.floor(Math.random() * charset.length);
    password += charset.charAt(randomIndex);
  }
  return password;
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: sender_email,
    pass: sender_email_pass,
  },
});

// User Controllers /api/user/

// -  /  GET
router.get(
  "/",
  passport.authenticate("jwt", {
    session: false,
  }),
  isAuth,
  async (req, res, next) => {
    try {
      const user_id = req.user._id;
      const user = await UserService.getUser(user_id);
      return res.json({
        ...user,
        success: true,
      });
    } catch (error) {
      console.log(error);
      res.json({
        message: `Error ${error}`,
        success: false,
      });
    }
  }
);

// - /login POST

router.post("/login", async (req, res) => {
  try {
    const { errors, isValid } = validateLoginInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }
    const email = req.body.email;
    const password = req.body.password;

    const token = await UserService.loginUser(email, password);
    if (!token) {
      return res.status(404).json({
        success: false,
        message: "Email or password not valid",
      });
    } else {
      res.json({
        success: true,
        message: "Login Successfull",
        token: token.token,
        expiresIn: token.expires,
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      message: "Error: " + error,
      success: false,
    });
  }
});

// router.get('/login/google', async (req, res,next) => {
//   try {
//     const user = await User.findOne({ email: req.body.email });
//     const token =issueJWT(user);
//     // const { password, isAdmin, ...otherDetails } = user._doc;
//     res
//       .cookie("access_token", token)
//       .status(200)
//       .json({token });
//   } catch (err) {
//     next(err);
//   }
// })

router.post("/register/google", async (req, res, next) => {
  console.log("google backend");
  console.log(req.body);
  try {
    const newUser = await User.findOne({
      email: req.body.email,
    });
    let user;
    if (!newUser) {
      console.log("new user not found");
      let name = {
        first_name: "",
        last_name: req.body.name,
      };

      if (req.body.name.split(" ").length >= 2) {
        const displayNameSplit = req.body.name.split(" ");
        name = {
          first_name: displayNameSplit.slice(0, -1).join(" "),
          last_name: displayNameSplit.slice(-1)[0],
        };
      }

      user = await UserService.registerUser({
        name,
        email: req.body.email,
        password: generatePassword(16),
        pfp_url: req.body.profile,
      });
    } else {
      user = newUser;
    }
    const token = issueJWT(user);
    // const { password, isAdmin, ...otherDetails } = newUser._doc;
    res.cookie("access_token", token).status(200).json({ token });
  } catch (err) {
    console.error("Error in /register/google:", err); // Log any errors
    next(err);
  }
});
// router.get('/login/google', async (req, res) => {
//   const authUrl = getAuthUrl();
//   // console.log(authUrl)
//   return res.json({
//     authUrl
//   });
// })

// router.get('/login/google/callback', passport.authenticate("google", {
//   session: false
// }), async (req, res) => {

//   console.log('here');
//   console.log(req.user);
//   const generatedToken = issueJWT(req.user);

//   const wss = req.app.get("wss"); // Get the WebSocket Server instance from the app

//   // Emit a WebSocket message with the generatedToken as the payload
//   wss.clients.forEach((client) => {
//     client.send(JSON.stringify(generatedToken));
//   });

//   res.send(`
//   <!DOCTYPE html>
//   <html>
//     <head>
//       <script>
//         window.onload = function() {
//           window.close();
//         }
//       </script>
//     </head>
//     <body>
//       <h1>Thank you!</h1>
//       <p>The window will close automatically.</p>
//     </body>
//   </html>
// `);

//   res.end();

// })

router.post("/register", async (req, res) => {
  try {
    // Form validation

    const { errors, isValid } = validateRegisterInput(req.body);
    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const registeredUser = await UserService.registerUser(req.body);

    if (registeredUser) {
      res.json({
        success: true,
        message: "Registration Successfull",
      });
    } else {
      res.json({
        success: false,
        message: "Failed To Create",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      message: `Error: ${error}`,
      success: false,
    });
  }
});

// - /logout GET
router.get(
  "/logout",
  passport.authenticate("jwt", {
    session: false,
  }),
  async (req, res, next) => {
    try {
      // logout logic here
      req.logout(function (err) {
        if (err) {
          return next(err);
        }
        return res.json({
          success: true,
        });
      });
    } catch (error) {
      console.log(error);
      res.json({
        message: `Error ${error}`,
        success: false,
      });
    }
  }
);

// - /editprofile PUT
router.put(
  "/editprofile",
  passport.authenticate("jwt", {
    session: false,
  }),
  isAuth,
  async (req, res, next) => {
    try {
      const user_id = req.user._id;
      const updatedUser = await UserService.editUserProfile(user_id, req.body);
      res.json({
        ...updatedUser,
        success: true,
      });
    } catch (error) {
      console.log(error);
      res.json({
        message: `Error ${error}`,
        success: false,
      });
    }
  }
);

// /editpassword
router.post(
  "/editpassword",
  passport.authenticate("jwt", {
    session: false,
  }),
  isAuth,
  async (req, res, next) => {
    try {
      const user_id = req.user._id;
      const response = await UserService.editUserPass(
        user_id,
        req.body.old_pass,
        req.body.new_pass
      );

      if (response.success) {
        res.json({
          success: true,
          message: "Successfully updated password",
          old_pass: true,
        });
      } else {
        res.json({
          success: false,
          message: "Old password dont match",
          old_pass: false,
        });
      }
    } catch (error) {
      console.log(error);
      res.json({
        message: `Error ${error}`,
        success: false,
      });
    }
  }
);

// -/editprofilepicture PUT
router.put(
  "/editprofilepic",
  passport.authenticate("jwt", {
    session: false,
  }),
  isAuth,
  async (req, res, next) => {
    try {
      // logic

      const fileStr = req.body.data;
      const user_id = req.user._id;
      const updatedUser = await UserService.editUserProfilePicture(
        user_id,
        fileStr
      );

      res.json({
        pfp_url: updatedUser.pfp_url,
        success: true,
      });
    } catch (error) {
      console.log(error);
      res.json({
        message: `Error ${error}`,
        success: false,
      });
    }
  }
);

router.post(
  "/delete",
  passport.authenticate("jwt", {
    session: false,
  }),
  async (req, res, next) => {
    try {
      const user_id = req.user._id;
      await UserService.deleteUser(user_id);
      res.json({
        message: `Account deleted Successfully`,
        success: false,
      });
    } catch (error) {
      console.log(error);
      res.json({
        message: `Error ${error}`,
        success: false,
      });
    }
  }
);

//send email Link For reset Pasword

router.post("/sendpasswordlink", async (req, res) => {
  // console.log(req.body);

  const email = req.body;
  if (!email) {
    res.status(401).json({
      status: 401,
      success: false,
      message: "Enter your email",
    });
  }

  try {
    const userfind = await UserService.getUserByEmail(email.email);
    //token generate for reset password
    const token = jwt.sign(
      {
        _id: userfind._id,
      },
      keysecret,
      {
        expiresIn: "900s",
      }
    );
    console.log("token", token);

    const setusertoken = await User.findByIdAndUpdate(
      {
        _id: userfind._id,
      },
      {
        verifytoken: token,
      },
      {
        new: true,
      }
    );
    const link = `${SERVER_URL}/forgotpassword/${userfind._id}/${setusertoken.verifytoken}`;
    const html = await ForgotPasswordEmailHTML.createHTML(link);
    console.log("id", userfind._id);
    console.log("usertoken", setusertoken);
    if (setusertoken) {
      const mailOptions = {
        from: sender_email,
        to: setusertoken.email,
        subject: "Reset Password",
        html: html,
      };

      console.log("option", mailOptions);
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("error", error);
          res.status(401).json({
            status: 401,
            message: "Email not sent",
          });
        } else {
          console.log("Email sent", info.response);
          res.status(201).json({
            status: 201,
            message: "Email sent successfully",
          });
        }
      });
    }
  } catch (error) {
    res.status(401).json({
      status: 401,
      message: "Invalid User",
    });
  }
});

//verify user for forgot password time

router.get("/forgotpassword/:id/:token", async (req, res) => {
  const { id, token } = req.params;

  try {
    const validuser = await User.findOne({
      _id: id,
      verifytoken: token,
    });

    const verifytoken = jwt.verify(token, keysecret);

    if (validuser && verifytoken._id) {
      res.status(201).json({
        status: 201,
        validuser,
      });
    } else {
      res.status(401).json({
        status: 401,
        message: "User does not exist",
      });
    }
  } catch (error) {
    res.status(401).json({
      status: 401,
      error,
    });
  }
});

//change password
router.post("/changepassword/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const password = req.body.password;

  try {
    const validuser = await User.findOne({
      _id: id,
      verifytoken: token,
    });
    const verifytoken = jwt.verify(token, keysecret);

    if (validuser && verifytoken._id) {
      const response = await UserService.resetUserPass(id, password);

      if (response) {
        res.status(201).json({
          status: 201,
          message: "Password Updated Successfully",
        });
      }
    } else {
      res.status(404).json({
        status: 401,
        message: "User does not exist",
      });
    }
  } catch (error) {
    res.status(401).json({
      status: 401,
      message: error,
    });
  }
});

router.post(
  "/:blogId/deleteblogfromlist",
  passport.authenticate("jwt", {
    session: false,
  }),
  isAuth,
  async (req, res, next) => {
    try {
      console.log(req.params.blogId)
      const blogId = new mongoose.mongo.ObjectId(req.params.blogId);
      console.log("blogId",blogId)
      const user_id = req.user._id;
      console.log("user_id",user_id)
      const user = await UserService.removeBlogFromReadingLIst(blogId,user_id);
      return res.json({
        ...user,
        success: true,
      });
    } catch (error) {
      console.log("there is an error")
      console.log(error);
      res.json({
        message: `Error ${error}`,
        success: false,
      });
    }
  }
);

router.post(
  "/:blogId/addblogtolist",
  passport.authenticate("jwt", {
    session: false,
  }),
  isAuth,
  async (req, res, next) => {
    try {
      console.log(req.params.blogId)
      const blogId = new mongoose.mongo.ObjectId(req.params.blogId);
      console.log("blogId",blogId)
      const user_id = req.user._id;
      console.log("user_id",user_id)
      const user = await UserService.addBlogToReadingList(blogId,user_id);
      console.log("user",user)
      return res.json({
        ...user,
        success: true,
      });
    } catch (error) {
      console.log(error);
      res.json({
        message: `Error ${error}`,
        success: false,
      });
    }
  }
);

router.post(
  "/:userId/:blogId/addlist",
  async (req, res, next) => {
    try {
      const blogId = new mongoose.mongo.ObjectId(req.params.blogId);
      const user_id = new mongoose.mongo.ObjectId(req.params.userId);
      const user = await UserService.addBlogToReadingList(blogId,user_id);
      return res.json({
        ...user,
        success: true,
      });
    } catch (error) {
      console.log(error);
      res.json({
        message: `Error ${error}`,
        success: false,
      });
    }
  }
);

router.get(
"/getreadinglist", 
passport.authenticate("jwt", {
  session: false,
}),
isAuth,
async (req, res, next) => {
  
  try {
    const user_id = req.user._id;
    const readingLists = await UserService.getReadingList(user_id);
    console.log(readingLists)
    return res.json({readingLists: readingLists, success: true});
  } catch (error) {
    console.log(error);
    return res.json({message: `Error: ${error}`, success: false});
  }
});


router.get(
  "/:userId/getreadinglist", 
  async (req, res, next) => {
    
    try {
      const user_id = new mongoose.mongo.ObjectId(req.params.userId);
      const readingLists = await UserService.getReadingList(user_id);
      res.json({readingLists: readingLists, success: true});
    } catch (error) {
      console.log(error);
      res.json({message: `Error: ${error}`, success: false});
    }
  });

module.exports = router;
