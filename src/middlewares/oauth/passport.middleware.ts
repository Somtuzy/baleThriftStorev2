import { Strategy as GoogleStrategy, Profile as GoogleProfile, VerifyCallback} from "passport-google-oauth20";
import passport from "passport";
import { userService } from "../../services/create.service";
import { generateRandomAvatar } from "../../utils/avatar.utils";
import { IUser } from "../../interfaces/user.interface";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
      passReqToCallback: true,
    },
    async (request, accessToken: string, refreshToken: string, profile: GoogleProfile, done: VerifyCallback) => {
      try {
        const profileEmail = <string>profile?.emails?.[0].value
        const existingUser = await userService.findOne({
          $or: [
            { googleId: profile.id },
            { email: profileEmail }
          ],
        });

        if (existingUser && existingUser.email === profileEmail && !existingUser.googleId) {
          // If user already exists with the same email and a password
          existingUser.exists = "alreadyExistsWithSameEmailAndAPassword"
          return done(null, existingUser);
        }

        if (existingUser) {
          // If user exists, return the existing user
          existingUser.exists = "true";
          return done(null, existingUser);
        }

        // Generates a random avatar for the user
        const avatar = await generateRandomAvatar(profileEmail);

        // If user doesn't exist, create a new user in the database
        const newUser = await userService.create({
          googleId: profile.id,
          fullname: profile.displayName,
          email: profileEmail,
          avatar: avatar,
          deleted: false,
        });

        await newUser.save();

        return done(null, newUser);
      } catch (err: any) {
        return done(err);
      }
    }
  )
);

// Serialization
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialization
passport.deserializeUser((user: IUser, done) => {
  userService
    .findOne({ _id: user._id })
    .then((data) => {
      return done(null, data);
    })
    .catch((err) => {
      return done(err);
    });
});
