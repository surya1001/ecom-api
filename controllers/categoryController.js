const db = require('../models')

const getCategory = async (req, res) => {
  try{
    //get all categories
    const category = await db.category.findAll({
      include: [{
        model: db.user,
        attributes: ['name', 'email']
      }],
      attributes: ['id','name']
    })
    return res.status(420).json({category})
  } catch(err) {
    console.log(err)
    res.json({error: err.message})
  }
}

const getCategoryById = async (req, res) => {
  //get id by req.params
  const catId = req.params.catId
  
  try{
    //check whether category exists
    const category = await db.category.findOne({ 
      where: {id: catId},
      attributes: ['id', 'name'],
      include: [{
        model: db.user,
        attributes: ['name','email']
      }]
    })
    if(!category) return res.status(400).json({error: "No such category exists"})
    else return res.status(200).json({category})
  }catch(err){
    console.log(err)
    return res.status(500).json({error: err.message})
  }
}

const postCategory = async (req, res) => {
  //get catgeory and user details by body and params
  const { name } = req.body
  const userDetails = req.userDetails

  try{
    //check whether category exists
    const categoryExists = await db.category.findOne({ where: {name: name}})
    if(categoryExists) return res.status(400).json({error: "Category already exists"})
    else{
      //create category
      const category = await db.category.create({ name, userId: userDetails.id})
      return res.status(200).json({category})
    }
  } catch(err) {
    console.log(err)
    return res.status(500).json({error: err.message})
  }
}

const editCategory = async (req, res) => {
  //get details from body and params
  const catId = req.params.catId
  const { name } = req.body

  try{
    //check whether category exists
    const categoryExists = await db.category.findOne({ where: {name: name} })
    if(categoryExists) return res.status(400).json({error: "Category already exists"})

    //update category details
    const category = await db.category.update({ name }, {where: {id: catId}})
    return res.status(200).json({category})
  }catch(err){
    console.log(err)
    return res.status(500).json({error: err.message})
  }
}

const deleteCategory = async (req, res) => {
  //get category details
  const catId = req.params.catId

  try {
    //check whether category exists
    const categoryExists = await db.category.findOne({where: {id: catId}})
    if(!categoryExists) return res.status(400).json({error: "No such category exists"})
    else{
      //delete category
      await db.category.destroy({where: {id: catId}})
      return res.status(200).json({message: "Category deleted successfully"})
    }
  } catch (err) {
    console.log(err)
    return res.status(500).json({error: err.message})    
  }
}

module.exports = { getCategory, getCategoryById, postCategory, editCategory, deleteCategory }
