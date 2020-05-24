 // This code is generated using kalpa scafolding tool
 const Sequelize = require('sequelize');

   const BusinessSchema = {
       
        ID: Sequelize.INTEGER ,  
        AdminID: Sequelize.INTEGER ,  
        GSTIN: Sequelize.STRING ,  
        CIN: Sequelize.STRING ,  
        ContactNumber: Sequelize.STRING ,  
        FAX: Sequelize.STRING ,  
        Address: Sequelize.STRING ,  
        City: Sequelize.STRING ,  
        Pincode: Sequelize.STRING ,  
        State: Sequelize.STRING ,  
        Country: Sequelize.STRING ,  
        MultiOutlet: Sequelize.BOOLEAN ,  
        CustomerID: Sequelize.BOOLEAN  
}
  module.exports = BusinessModel