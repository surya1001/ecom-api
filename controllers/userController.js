const db = require("../models")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { generateRefreshToken } = require("../middlewares/auth")
const client = require("../middlewares/redis")

const signin = async (req, res) => {
  const {email, password} = req.body
  try{
    //check if user exists
    const user = await db.user.findOne({where: {email: email} })
    if(user){
      //check password
      const authenticate = await bcrypt.compare(password, user.password)
      if(authenticate){
        user.password = undefined
        const userDetails = {id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role}
        
        //generate tokens
        const access_token = await jwt.sign({userDetails}, process.env.JWT_ACCESS_SECRET, {expiresIn: 7200})
        const refresh_token = await generateRefreshToken(userDetails)

        return res.status(200).json({ acesstoken: access_token, refreshtoken: refresh_token, user })
      }else return res.status(400).json({error: "Invalid Login Credentials"})
    }else return res.status(400).json({error: "Invalid Login Credentials"})
  }catch(err){
    console.log(err)
    return res.status(500).json({error: err.message})
  }   
}

const signup = async (req, res) => {
  const {name, email, password, phone} = req.body
  
  try{
    //create hashed password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    //check if user exists
    const userExists = await db.user.findOne({where: {[db.Sequelize.Op.or]: {email, phone}}})
    if(userExists){
      return res.status(400).json({message: "Already a member of shopify! Try to Login"})
    } else {
      //create new user if not exists
      const user = await db.user.create({name, email, phone, password: hashedPassword})
      return res.status(200).json({ name: user.name, email: user.email, password: undefined, phone: user.phone, role: user.role })
    }
  }catch(err){
    console.log(err)
    return res.status(500).json({error: "Something went wrong, signup"})
  }
}

const signout = async (req, res) => {
  const userDetails = req.userDetails
  const userId = userDetails.id
  const token = req.token

  try{
    //delete refresh token from redis client
    await client.del(userId.toString())

    //blacklist token
    await client.set('BL_'+userId.toString(), token)

    return res.status(200).json({status: true, message: "User Signedout"})
  }catch(err){
    console.log(err)
    return res.status(500).json({message: "Something went wrong logout"})
  }
}

const getallusers = async (req, res) => {
  try{
    const user = await db.user.findAll({
      attributes: ['name','email','phone','role']
    })
    res.status(200).json({user})
  }catch(err){
    console.log(err)
    return res.status(500).json({error: err.message})
  }
}

const getUserById = async (req, res) => {
  const userId = req.params.userId

  try{
    const user = await db.user.findOne({
      where: {id: userId},
      attributes: ['name','email','phone','role']
    })
    if(!user) return res.status(401).json({error: "No such user exists"})
    else res.status(200).json({user})
  }catch(err){
    console.log(err)
    return res.status(200).json({error: err.message})
  }
}

module.exports = { signin, signup, signout, getallusers, getUserById }