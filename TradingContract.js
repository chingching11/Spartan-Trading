const House = require("./House")
const Block = require("./SpartanBlock")
const Transaction = require('./SpartanTransaction')

// ownerOf(propertyId) --> return the owner address 

// transferOwnerhip(from, to, propertyId ) 
//  transfert ownerhip , to will give money, remove the values from the map of block, then update them as a transaction 


module.exports = class TradingContract{

    constructor(block){
        this.block = block;
        this.properties = block.properties;
        this.owners = block.owners;
    }

    ownerOf(propertyId){
        return this.properties.get(propertyId)
    }

    // get 'to' from tx.outputs
    transferOwnership(owner, propertyId){
        // check if the property is registered
        if(!this.properties.get(propertyId)){
            console.log("hey not registered");
            return false 
        }
        // check if the owner is the same as 'from' address
        if(this.owners.get(owner) !== propertyId){
            console.log("owner not same")
            return false
        }
        // delete the ownership of buyer
        this.properties.delete(propertyId)
        this.owners.delete(owner)
        return true;
    }

}