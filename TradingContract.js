const House = require("./House")
const Block = require("./SpartanBlock")
const Transaction = require('./SpartanTransaction')

// ownerOf(propertyId) --> return the owner address 

// transferOwnerhip(from, to, propertyId ) 
//  transfert ownerhip , to will give money, remove the values from the map of block, then update them as a transaction 


module.exports = class TradingContract{

    constructor(block, owner, price, propertyId, sufficientFund){
        this.block = block;
        this.properties = block.properties;
        this.prices = block.prices;
        this.owners = block.owners;

        this.owner = owner
        this.price = price
        this.propertyId = propertyId
        this.sufficientFund = sufficientFund
    }

    ownerOf(propertyId){
        return this.properties.get(propertyId)
    }

    // get 'to' from tx.outputs
    transferOwnership(client){
        // check if the property is registered
        if(!this.properties.get(this.propertyId)){
            client.log("hey not registered");
            // throw "hey not registered"
            return false 
        }
        // check if the owner is the same 
        if(this.properties.get(this.propertyId) !== this.owner){
            client.log("owner not same")
            // throw "owner not same"
            return false
        }

        // check if the price is the same
        if(this.prices.get(this.propertyId) !== this.price){
            client.log("price not the same")
            // throw "price not same"
            return false
        }

        // check if the buyer has enough gold to buy 
        if(this.sufficientFund === false){
            // throw "not enough money"
            client.log("The buyer doen't have enough to buy")
            return false
        }

        // delete the ownership of buyer
        this.properties.delete(this.propertyId)
        return true;
    }

}