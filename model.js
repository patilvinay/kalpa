  // This code is generated using kalpa scafolding tool
const Sequelize = require('sequelize');

const businessSchema = {
    
         ID: integer, 
         AdminID: integer, 
         GSTIN: string, 
         CIN: string, 
         ContactNumber: string, 
         FAX: string, 
         Address: string, 
         City: string, 
         Pincode: string, 
         State: string, 
         Country: string, 
         MultiOutlet: boolean
        
}
const businessModel = db.define(business, BusinessSchema)

module.exports = businessModel