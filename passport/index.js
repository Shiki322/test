const bcrypt = require('bcrypt');
const passportJWT = require("passport-jwt");
const users =require('../models').users;
const ExtractJWT = passportJWT.ExtractJwt;

const localStrategy = require('passport-local').Strategy;
const JWTStrategy = passportJWT.Strategy;

module.exports = (passport) => {
    passport.use('login', new localStrategy({
        usernameField: "username",
        _passwordField: "password",
    }, function (username, password, done) {
        users.findOne({
            where:
                {
                    username: username
                }
        }).then(result => {
            if (!result) {
                return done(null, false)
            }
            let hashed = bcrypt.hashSync(password, result.salt);
            if (result.password === hashed) {
                return done(null, result)
            }
            return done(null, false)
        }).catch(err => {
            done(err)
        })

    }));
    passport.use(new JWTStrategy({
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'secret'
        },
        function (jwtPayload, done) {
            return users.findOne({
                where: {
                    username: jwtPayload.username
                }
            }).then(user => {
                return done(null, user);
            }).catch(err => {
                return done(err);
            });
        }
    ));
}
