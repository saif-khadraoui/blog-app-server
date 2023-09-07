const { sign, verify } = require("jsonwebtoken")

const createToken = (user) => {
    const accessToken = sign({ username: user.username, id: user._id }, "jwtsecret")

    return accessToken
}

const validateToken = (req, res, next) => {
    const accessToken = req.cookies["access-token"]

    if(!accessToken) return res.json("User not authenticated")

    try{
        const validToken = verify(accessToken, "jwtsecret")
        if(validToken){
            req.authenticated = true
            return next()
        }
    } catch(err){
        return res.json(err)
    }
}

module.exports = { createToken, validateToken }