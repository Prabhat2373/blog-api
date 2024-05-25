import express from "express";
import passport from "passport";

const router = express.Router();

import UserAccount from "@/models/account.model";

var GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID:
        process.env.GOOGLE_CLIENT_ID ||
        "293641449436-4f2ksoomdcspg6fj9876v5r244a6cnu0.apps.googleusercontent.com",
      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET ||
        "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",
      callbackURL: "http://localhost:3000/auth/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
      UserAccount.findOrCreate({ googleId: profile.id }, function (err, user) {
        return cb(err, user);
      });
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID:
        process.env.GITHUB_CLIENT_ID ||
        "33a16f006917bc4fbd09a17d5f1628508c881711",
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://127.0.0.1:3000/auth/github/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      UserAccount.findOrCreate({ githubId: profile.id }, function (err, user) {
        return done(err, user);
      });
    }
  )
);

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);
router.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["profile"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);
router.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

const authRouter = router;
export default authRouter;
