const fs = require("fs");
const path = require("path");
const User = require("mongoose").model("User");
const UserService = require('./../services/UserService')

const GoogleStrategy = require('passport-google-oauth20').Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const pathToKey = path.join(__dirname, "..", "id_rsa_pub.pem");
const PUB_KEY = fs.readFileSync(pathToKey, "utf8");

// TODO
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithm: ["RS256"],
};

function generatePassword(length) {
  var password = "";
  var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  for (var i = 0; i < length; i++) {
    var randomIndex = Math.floor(Math.random() * charset.length);
    password += charset.charAt(randomIndex);
  }
  return password;
}

const strategy = new JwtStrategy(options, async (payload, done) => {
  try {
    const user = await User.findOne({
      _id: payload.sub
    });

    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (error) {
    return done(error, false);
  }
});


const googleStrategy = new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
  accessType: 'offline',
  prompt: 'consent'
}, async (acesstoken, refreshtoken, profile, done) => {
  const newUser = await User.findOne({
    email: profile.emails[0].value
  });
  let user;
  if (!newUser) {
    user = await UserService.registerUser({
      name: {
        last_name: profile.displayName
      },
      email: profile.emails[0].value,
      password: generatePassword(16),

    })

  } else {
    user = newUser;
  }

  done(null,
    user
  );

})


// TODO
module.exports = (passport) => {
  passport.use(strategy);
  passport.use(googleStrategy);
};