import { Strategy, ExtractJwt } from 'passport-jwt';
import { jwtSecret } from '../config';
import createAuthService from '../services/authService';
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret,
};
const authService = createAuthService();
async function checkUserExists(id: string) {
  let user;
  user = await authService.getUserById(id, {
    id: true,
    email: true,
  });
  return user;
}
export default (passport) => {
  passport.use(
    new Strategy(options, async (payload, done) => {
      await checkUserExists(payload.id)
        .then(async (user) => {
          if (user) {
            return done(undefined, user);
          }
          return done(undefined, false);
        })
        .catch((err) => {
          console.log(err);
          done(undefined, false);
        });
    })
  );
};
