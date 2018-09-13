let bcrypt = require('bcrypt');
let passport = require('passport');
const jwt = require('jsonwebtoken');
require('../passport')(passport);
users = require('../models').users;

function getHashPass(password) {
    const salt =  bcrypt.genSaltSync(7);
    const hashPass =  bcrypt.hashSync(password, salt);
    return{
        salt: salt,
        hash: hashPass,
    }
}
module.exports = {
    async signup(req, res, username, password) {
        const pass = getHashPass(password);
        try {
            let user = await users.create({
                username: username,
                password: pass.hash,
                salt: pass.salt,
            });
            req.login(user, {session: false}, err => {
                if (err) {
                    return res.send({success: false, error: "error auth: " + err})
                }
                const token = jwt.sign(user.username, "secret");
                return res.redirect(`/game?token=${token}`)
            })
        } catch (err) {
            return res.send({
                success: false,
                error: "Auth error: " + err
            })
        }
    },

    login(req, res) {
        passport.authenticate('login', {session: false}, (err, user) => {
            if (err) {
                return res.send({
                    success: false,
                    error: "something goes wrong:" + err
                })
            }
            if (!user){
                return res.send({
                    success:false,
                    error:"Auth error"
                })
            }
            req.login(user, {session: false}, err => {
                if (err) {
                    return res.send({success: false, error: "error auth: " + err})
                }
                const token = jwt.sign(user.username, "secret");
                return res.redirect(`/game?token=${token}`)

            })
        })(req, res)
    },

};
