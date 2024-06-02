// import express from "express";
// import passport from "passport";

// const router = express.Router();

// import UserAccount from "@/models/account.model";

// var GoogleStrategy = require("passport-google-oauth20").Strategy;
// const GitHubStrategy = require("passport-github2").Strategy;

// passport.serializeUser(function (user, cb) {
//   process.nextTick(function () {
//     return cb(null, {
//       id: user.id,
//       username: user.name,
//       picture: user.avatar,
//     });
//   });
// });

// passport.deserializeUser(function (user, cb) {
//   process.nextTick(function () {
//     return cb(null, user);
//   });
// });
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID:
//         "1095475093843-3sivem73bte0fi874r56u2if2ddt68ts.apps.googleusercontent.com",
//       clientSecret: "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",
//       callbackURL: `${
//         process.env.BACKEND_URL || "http://localhost:8001/api/v1"
//       }/auth/google/callback`,
//     },
//     async function (accessToken, refreshToken, profile, cb) {
//       console.log("profile", profile);
//       const userData = {
//         email: profile?.emails?.[0]?.value,
//         name: profile?.displayName,
//         avatar: profile?.photos?.[0]?.value,
//       };
//       console.log("userData", userData);
//       UserAccount.findOrCreate(
//         { provider: profile?.provider, googleId: profile.id, ...userData },
//         function (err, user) {

//           return cb(err, user);
//         }
//       );
//     }
//   )
// );

// passport.use(
//   new GitHubStrategy(
//     {
//       clientID:
//         process.env.GITHUB_CLIENT_ID ||
//         "33a16f006917bc4fbd09a17d5f1628508c881711",
//       clientSecret: process.env.GITHUB_CLIENT_SECRET,
//       callbackURL: `http://127.0.0.1:8001/auth/google/callback`,
//     },
//     function (accessToken, refreshToken, profile, done) {
//       console.log("ID: " + profile.id);
//       console.log("Name: " + profile.displayName);
//       // console.log("Email : " + profile.emails[0].value);
//       const userData = {
//         email: profile?.emails?.[0]?.value,
//         name: profile?.displayName,
//       };
//       console.log("userData", userData);
//       // UserAccount.findOrCreate(userData, function (err, user) {
//       //   return done(err, user);
//       // });
//       return done(userData);
//     }
//   )
// );

// router.get(
//   "/auth/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );
// router.get(
//   "/auth/github",
//   passport.authenticate("github", { scope: ["profile"] })
// );

// router.get(
//   "/auth/google/callback",
//   passport.authenticate("google", { failureRedirect: "/login", session:false }),
//   function (req, res) {
//     console.log("google callback", req);
//     // Successful authentication, redirect home.
//     res.redirect(`${process.env.FRONTEND_URL}/auth/redirect`);
//   }
// );
// router.get(
//   "/auth/github/callback",
//   passport.authenticate("github", { failureRedirect: "/login" }),
//   function (req, res) {
//     // Successful authentication, redirect home.
//     res.redirect("/");
//   }
// );

// const authRouter = router;
// export default authRouter;

import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken"; // Import jsonwebtoken

const router = express.Router();
import UserAccount from "@/models/account.model";

var GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, {
      id: user.id,
      username: user.name,
      picture: user.avatar,
    });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "1095475093843-3sivem73bte0fi874r56u2if2ddt68ts.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: `${
        process.env.BACKEND_URL || "http://localhost:8001/api/v1"
      }/auth/google/callback`,
    },
    async function (accessToken, refreshToken, profile, cb) {
      try {
        console.log("profile", profile);
        const email = profile?.emails?.[0]?.value;
        const userData = {
          email,
          name: profile?.displayName,
          avatar: profile?.photos?.[0]?.value,
        };
        console.log("userData", userData);

        // Check if a user with the given email already exists
        let existingAccount = await UserAccount.findOne({ email });
        console.log("existingAccount", existingAccount);

        if (existingAccount) {
          // User exists, update their profile if necessary
          existingAccount.name = userData.name;
          existingAccount.avatar = userData.avatar;
          await existingAccount.save();
          return cb(null, existingAccount);
        } else {
          // Create a new user account
          UserAccount.findOrCreate(
            { provider: profile.provider, googleId: profile.id, ...userData },
            function (err, user) {
              return cb(err, user);
            }
          );
        }
      } catch (err) {
        console.error("Error during Google authentication", err);
        return cb(err, null);
      }
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: "33a16f006917bc4fbd09a17d5f1628508c881711",
      clientSecret: "Ov23lieHScWYE0c1EBJS",
      callbackURL: `${
        process.env.BACKEND_URL || "http://localhost:8001/api/v1"
      }/auth/github/callback`,
    },
    async function (accessToken, refreshToken, profile, cb) {
      try {
        console.log("profile", profile);
        const email = profile?.emails?.[0]?.value;
        const userData = {
          email,
          name: profile?.displayName,
          avatar: profile?.photos?.[0]?.value,
        };
        console.log("userData", userData);

        // Check if a user with the given email already exists
        let existingAccount = await UserAccount.findOne({ email });
        console.log("existingAccount", existingAccount);

        if (existingAccount) {
          // User exists, update their profile if necessary
          existingAccount.name = userData.name;
          existingAccount.avatar = userData.avatar;
          await existingAccount.save();
          return cb(null, existingAccount);
        } else {
          // Create a new user account
          UserAccount.findOrCreate(
            { provider: profile.provider, googleId: profile.id, ...userData },
            function (err, user) {
              return cb(err, user);
            }
          );
        }
      } catch (err) {
        console.error("Error during Google authentication", err);
        return cb(err, null);
      }
    }
  )
);

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["profile"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  async function (req, res) {
    console.log("google callback", req.user);
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    res.redirect(`${process.env.FRONTEND_URL}/auth/redirect?token=${token}`);
  }
);

router.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/login",
    session: false,
  }),
  async function (req, res) {
    console.log("github callback", req.user);
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    res.redirect(`${process.env.FRONTEND_URL}/auth/redirect?token=${token}`);
  }
);

const authRouter = router;
export default authRouter;
