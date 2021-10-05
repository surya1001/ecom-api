const db = require("../models");
const fs = require("fs");
const PDFDocument = require("pdfkit");
const { generateHeader, generateCustomerInformation, generateInvoiceTable, generateFooter} = require("../middlewares/pdfgen")

const placeOrder = async (req, res) => {
  const {productId, shippingAddress, pincode} = req.body;
  const userId = req.userDetails.id

  try{
    //check whether product exists
    const product = await db.product.findOne({where: {id: productId}})
    if(!product) return res.status(400).json({error: "No such product exists"})
    
    //create order
    const order = await db.order.create({ userId, productId, total: product.price, shippingAddress, pincode});
    
    //get foreign key details
    const prodet = await order.getProduct(db.product)
    const userdet = await order.getUser(db.user)

    //create order invoice document
    let doc = new PDFDocument({ size: "A4", margin: 50 });
  
    generateHeader(doc);
    generateCustomerInformation(doc, order, userdet);
    generateInvoiceTable(doc, order, prodet, userdet);
    generateFooter(doc);
  
    doc.end();
    doc.pipe(fs.createWriteStream("output.pdf"));

    //return res details
    return res.status(200).json({message: "Order placed successfully", order: {
      invoice: order.invoiceno,
      product_name: prodet.name,

      user_name: userdet.name, 
      email: userdet.email, 
      phone: userdet.phone,

      total: order.total, 
      shippingAddress: order.shippingAddress, 
      pincode: order.pincode,
      payment: order.payment,
      status: order.status,
      createdAt: order.createdAt
    }})
  } catch(err){
    console.log(err)
    return res.status(500).json({message: err.message})
  }
}

const getAllOrders = async (req, res) => {
  try{
    const order = await db.order.findAll({
      include: [{
        model: db.product,
        attributes: ['name']
      }]
    })
    res.send(order)
  }catch(err){
    console.log(err)
    return res.status(500).json({message: err.message})
  }
}

const getAllOrderByUser = async (req, res) => {
  const userId = req.userDetails.id
  try{
    const order = await db.order.findAll({
      where: {userId: userId},
      include: [
        { model: db.product, attributes: ['name']},
        { model: db.user, attributes: ['name','email','phone']}
      ],
      attributes: ['invoiceno','total','payment','status','shippingAddress','pincode','createdAt']
    })
    res.send(order)
  }catch(err){
    console.log(err)
    return res.status(500).json({message: err.message})
  }
}

const updatestatus = async (req, res) => {
  const orderId = req.params.id
  const status_to_update = req.body.status
  try{
    const order = await db.order.update(
      {status: status_to_update}, 
      {
        where: {id: orderId},
        returning: true,
        plain: true
      }, 
    )
    return res.json({order})
  }catch(err){
    console.log(err)
    return res.status(500).json({message: err.message})
  }
}

module.exports = { placeOrder, getAllOrders, getAllOrderByUser, updatestatus}