function generateHr(doc, y) {
  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(50, y)
    .lineTo(550, y)
    .stroke();
}

function formatDate(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return day + "/" + month + "/" + year;
}

function generateHeader(doc){
  doc
    .fontSize(20)
    .text("Shopify", 50, 45)
    .fontSize(10)
    .text("ecomm World", 50, 68)

    .fontSize(10)
    .text("Address: Kurla west", 200, 45, {align: "right"})
    .text("City: Mumbai", 200, 60, {align: "right"})
    .text("Pincode: 400070", 200, 75, {align: "right"})
    .moveDown();
}

function generateCustomerInformation(doc, order, userdet){
  doc
    .fillColor("#444444")
    .fontSize(20)
    .text("Invoice", 50, 120)
  
  generateHr(doc, 145);

  doc
    .fontSize(10)
    
    .font("Helvetica")
    .text("Invoice Number:" , 50, 160)
    .font("Helvetica-Bold")
    .text(order.invoiceno, 140, 160)

    .font("Helvetica")
    .text("Invoice Date:", 420, 160)
    .font("Helvetica-Bold")
    .text(formatDate(new Date()), 500, 160)

    .font("Helvetica")
    .text("Receiver Name: ", 50, 175)
    .font("Helvetica-Bold")
    .text(userdet.name, 140, 175)

    .font("Helvetica")
    .text("Payment Status:", 420, 175)
    .font("Helvetica-Bold")
    .text(order.status, 500, 175)
    
    .font("Helvetica")
    .text("Shipping Address: ", 50, 190)
    .font("Helvetica-Bold")
    .text(order.shippingAddress, 140, 190)

    .font("Helvetica")
    .text("Pincode: ", 420, 190)
    .font("Helvetica-Bold")
    .text(order.pincode, 500, 190)

    .moveDown();
  
  generateHr(doc, 215);
}

function generateTableRow(doc, y, c1, c2, c3) {
  doc
    .fontSize(10)
    .text("1", 50, y)
    .text(c1, 80, y)
    .text(`${c2} Rs.`, 280, y)
    .text(c3, 450, y)
}

function generateInvoiceTable(doc, order, prodet, userdet) {
  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    220,
    "Item",
    "Total Cost",
    "Status"
  );

  doc.font("Helvetica");
  generateTableRow(
    doc, 
    250,
    prodet.name, 
    order.total, 
    order.status
  )
}

function generateFooter(doc){
  doc
    .fontSize(10)
    .text("Shopify © 2021, SPM", 50, 600, {align: "center", width: 500});
}

module.exports = { generateHeader, generateCustomerInformation, generateInvoiceTable, generateFooter}