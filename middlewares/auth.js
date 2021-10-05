const jwt = require("jsonwebtoken")
const client = require("../middlewares/redis")

const generateAccessToken = async (req, res) => {
  //get user details
  const userDetails = req.userDetails

  try{
    //generate tokens
    const access_token = await jwt.sign({userDetails: userDetails}, process.env.JWT_ACCESS_SECRET, {expiresIn: 7200})
    const refresh_token = await generateRefreshToken(userDetails)
    return res.json({statsus: true, access_token: access_token, refresh_token: refresh_token})
  }catch(err){
    console.log(err)
    return res.json({error: "Something went wrong generate access token"})
  }
}

const generateRefreshToken = async (userDetails) => {
  try{
    //get user id
    const userId = userDetails.id
    const refresh_token = await jwt.sign({userDetails: userDetails}, process.env.JWT_REFRESH_SECRET, {expiresIn: "30d"})

    //setting data to redis client
    //check if already exists in redis db
    client.get(userId.toString(), (err, data) => {
      if(err) throw err
      //if not exists create entry
      client.set(userId.toString(), JSON.stringify({token: refresh_token}), 'EX', 30*24*60*60)
    })

    return refresh_token
  } catch(err) {
    console.log(err)
  }
}

const verifyToken = async (req, res, next ) => {
  //get token from header
  const token = req.headers['authorization'].split(" ")[1]
  
  try{
    //verify token
    const payload = await jwt.verify(token, process.env.JWT_ACCESS_SECRET)
    //set userdetails in req
    req.userDetails = payload.userDetails
    req.token = token
    const userId = payload.userDetails.id

    //verify blacklisted token
    await client.get('BL_'+userId.toString(), (err, data) => {
      if(err) throw err
      if(data === token) return res.json({error: "Blacklisted token"})
      next()
    })
  }catch(err){
    console.log(err)
    return res.status(400).json({status: true, message: "Your session is not valid", data: err})
  }
}

const verifyRefreshToken = async (req, res, next) => {  
  //get refresh token from body
  const token = req.body.token

  //check whether token exists
  if(token === null) return res.status(401).json({message: "Invalid request"})
  try{
    //verify token
    const payload = await jwt.verify(token, process.env.JWT_REFRESH_SECRET)

    //set userdetails in req 
    req.userDetails = payload.userDetails
    
    //verify if token is store or not
    client.get(payload.userDetails.id.toString(), (err, data) => {
      if(err) throw err

      //check if data exists 
      if(data === null) return res.json({error: "Invalid req"})
      if(JSON.parse(data).token != token ) return res.json({error: "No token found"})
      
      next()
    })
  }catch(err){
    console.log(err)
    return res.json({ error: "Session not valid! JWT expired"})
  }
}

const isAdmin = async (req, res, next) => {
  //get role from req
  const role = req.userDetails.role

  try{
    if(role === "admin"){
      console.log("Admin access")
      next()
    }else{
      console.log("Admin Access denied")
      return res.json({error: "Admin access denied"})
    }
  }catch(err){
    console.log(err)
    return res.json({error: "Something went wrong"})
  }
}

const isSupervisor = async (req, res, next) => {
  //get role from req object
  const role = req.userDetails.role
  try{
    if(role === "supervisor"){
      console.log("Supervisor access")
      next()
    }else{
      console.log("Admin Access denied")
      return res.json({error: "Suprvisor access denied"})
    }
  }catch(err){
    console.log(err)
    return res.json({error: "Something went wrong"})
  }
}

module.exports = {generateAccessToken, generateRefreshToken, verifyToken, verifyRefreshToken, isAdmin, isSupervisor}
