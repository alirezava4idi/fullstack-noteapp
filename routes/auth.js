const router = require('express').Router()
const queries = require('../db/queries')
const yup = require('yup')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const authenticateToken = require("../lib/authenticate")

router.post("/register", (req, res) => {
    let schema = yup.object().shape({
        email: yup.string().email().trim().lowercase().required(),
        password: yup.string().trim().matches(new RegExp('[0-9]+')).min(8).max(20).required()
    })
    const email = req.body.email
    const password = req.body.password 
    // schema.isValid({ email: email, password: password }).then((valid) => res.send(email))
    schema.validate({ email: email, password: password })
            .then(async (user) => {
                try{
                    user.password = await bcrypt.hash(user.password, 12);
                    queries.users
                        .create(user)
                        .then((result) => {
                            res.status(201).send(result);
                        })
                        .catch((err) => {
                            if (err.errno == 1062) {
                                res
                                    .status(406)
                                    .json({
                                        error: true,
                                        message: "Email already exists!",
                                    });
                            } else {
                                res
                                    .status(500)
                                    .json({
                                        error: true,
                                        message:
                                            "Something is wronge please try again later!",
                                    });
                            }
                        });
                    }catch {
                        res.status(500).json({"error": true, "message": "Something is wronge please try again later!"})
                    }
                
            })
            .catch(err => {
                res.status(406).json({"error": true, "message": err.errors})
            });

   
   
})
router.post("/token", async (req, res) => {
    // const refreshToken = req.body.token
    const refreshToken = req.cookies;
    const refresh_token_exists = await queries.users.getSession(refreshToken.SSID)
    if(!refresh_token_exists) return res.sendStatus(403)
    jwt.verify(refreshToken.SSID, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
        if (err) return res.sendStatus(403)
        const accessToken = generateAccessToken({ id: user.id })
        const rt = jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, {
					expiresIn: "7d",
				}); 
        // generateAccessToken({id: user.id});
        res.cookie(
					"SSID",
					rt,
					{ httpOnly: true }
                );
        await queries.users.deleteSession(user.id);
        await queries.users.addSession({'user_id': user.id, 'session': rt})
        
        res.status(200).json({accessToken: accessToken})
    })
})


router.post("/login", async (req, res) => {
    const user = {
        "email": req.body.email,
        "password": req.body.password
    }
    const User = await queries.users.login(user.email)
    if(User){
        try{
            const logged_in = await bcrypt.compare(user.password, User.password)
            if(logged_in){
                const logged_in_user = {"id": User.id}
                const access_token = generateAccessToken(logged_in_user)
                const refresh_token = jwt.sign(logged_in_user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'})
                await queries.users.addSession({'user_id': User.id, 'session': refresh_token})
                res.cookie('SSID', refresh_token, { httpOnly: true})
                res.status(200).json({"error": false, "accessToken": access_token})
            }else{
                res.status(400).json({"error": true, "message": "Invalid Username and Password!"})
            }
        }catch{
            res.status(500).json({"error": true, "message": "Something is wronge please try again later!"})
        }
    }else{
        res.status(404).json({"error": true, "message": "Invalid Username and Password!"})
    }
})

router.delete('/logout', authenticateToken ,async (req, res) => {
    await queries.users.deleteSession(req.user.id)
    res.sendStatus(204)
})

function generateAccessToken(user){
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '7d'});
}





module.exports = router