const db = require("../models")
const Op = db.Sequelize.Op

const getAllProducts = async (req, res) => {
  const page = parseInt(req.query.page || "0")
  const size = parseInt(req.query.size || "3")

  try{
    const product = await db.product.findAndCountAll({
      limit: size,
      offset: page * size,
      attributes: ['id','name','price','image'],
      include: [
        {model: db.user, attributes: ['name','email']},
        {model: db.category, attributes: ['name']}
      ]    
    })
    return res.status(200).json({product})
  }catch(err){
    console.log(err)
    return res.status(500).json({error: err.message})
  }
}

const searchProducts = async (req, res) => {
  const query = req.query.filter
  const page = parseInt(req.query.page || "0")
  const size = parseInt(req.query.size || "2")

  try{
    const product = await db.product.findAll({
      where: { 
        [Op.or]: [{
          name: {[Op.like]: `%${query}%`} }        ]
      },
      limit: size,
      offset: page * size,
      attributes: ['id','name','price','image'],
      include: [
        {model: db.user, attributes: ['name','email']},
        {model: db.category, attributes: ['name']}
      ]  
    })
    return res.status(200).json({product})
  }catch(err){
    console.log(err)
    return res.status(500).json({error: err.message})
  }
}

const getProductById = async (req, res) => {
  const proId = req.params.proId
  try{
    const product = await db.product.findOne({
      where: {id: proId}
    })
    if(!product) return res.status(400).json({error: "No such product exists"})
    return res.status(200).json({product})
  }catch(err){
    console.log(err)
    return res.status(500).json({error: err.message})
  }
}

const postProduct = async (req, res) => {
  const {name, categoryId, price} = req.body
  const fileInfo = req.file
  const user = req.userDetails

  try{
    const productExists = await db.product.findOne({ where: {name: name}})
    if(productExists) return res.status(400).json({error: "Product already exists"})
    else{
      const category = await db.category.findOne({ where: {id: categoryId}})
      if(!category) return res.status(400).json({error: "No such category exists"})

      const product = await db.product.create({name, categoryId, userId: user.id, price, image: fileInfo.filename})
      return res.status(200).json({product})
    }
  }catch(err){
    console.log(err)
    return res.status(500).json({error: err.message})
  }
}

const editProduct = async (req, res) => {
  const proId = req.params.proId
  const {name, categoryId, price} = req.body
  const fileInfo = req.file
  const userid = req.userDetails.id

  try{
    const product = await db.product.findOne({ where: {name: name}})
    if(!product) return res.status(400).json({error: "No such product found"})
    else{
      const userId = product.userId

      if(userId === userid){
        const product = await db.product.update({name: name, categoryId: categoryId, price: price, image: fileInfo.filename}, {where: {id: proId}})
        return res.status(200).json({product: product})
      }else{
        return res.status(404).json({error: "You can only edit product that you have added"})
      }
    }
  }catch(err){
    console.log(err)
    return res.status(500).json({error: err.message})
  }
}

const deleteProduct = async (req, res) => {
  const proId = req.params.proId
  const userid = req.userDetails.id

  try{
    const product = await db.product.findOne({where: {id: proId}})
    if(!product) return res.status(400).json({error: "No such product found"})
    else{
      const userId = product.userId

      if(userId === userid){
        await db.product.destroy({where: {id: proId}})
        return res.status(200).json({message: "Product Deleted"})
      }else{
        return res.status(400).json({error: "You can only delete product that you have addedd"})
      }
    }
  }catch(err){
    console.log(err)
    return res.status(400).json({error: err.message})
  }
}

module.exports = {getAllProducts, getProductById, searchProducts, postProduct, editProduct, deleteProduct}