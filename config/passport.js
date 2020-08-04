/**
 * passwort-jwt 用来验证token
 * 
*/

const JwtStrategy = require('passport-jwt').Strategy,
ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose')
const User = mongoose.model('users')
const keys = require('../config/key')

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrkey;

module.exports = passport => {
  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    // console.log(jwt_payload);
    User.findById(jwt_payload.id)
        .then((user) => {
          if(user) {
            return done(null, user)
          }
          return done(null , '9999')
        }).catch((err) => console.log(err))
  }))
}