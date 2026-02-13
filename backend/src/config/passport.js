const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

function configurePassport() {
  const clientID = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const callbackURL = process.env.GOOGLE_CALLBACK_URL || '/auth/google/callback';

  if (!clientID || !clientSecret) {
    return;
  }

  passport.use(
    new GoogleStrategy(
      { clientID, clientSecret, callbackURL },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value || null;
          const user = await User.findOrCreateGoogleUser({
            googleId: profile.id,
            email,
            displayName: profile.displayName
          });
          done(null, user);
        } catch (error) {
          done(error);
        }
      }
    )
  );
}

module.exports = { passport, configurePassport };
