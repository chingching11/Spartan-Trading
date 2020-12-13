/**
 * Verify if the client can buy a property
 */

module.exports = class TradingContract{

    /**
     * 
     * @param {SpartanBlock} block 
     * @param {String} owner - owner's wallet address
     * @param {Float} price - property's price
     * @param {String} propertyId - property's hash id 
     * @param {Boolean} sufficientFund - buyer has enough gold to buy
     */
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

    /**
     * 
     * @param {String} propertyId 
     * @returns {String} - owner address 
     */
    ownerOf(propertyId){
        return this.properties.get(propertyId)
    }

   /**
    * Check if the trading transaction is valid.
    * 
    * @param {SpartanClient} client - Spartan Miner who's currently validating the tx
    * @returns {Boolean} - whether or not trading is valid
    */
    transferOwnership(client){
        // check if the property is registered
        if(!this.properties.get(this.propertyId)){
            client.log(`${this.propertyId} is not registered.`);
            // throw "hey not registered"
            return false 
        }
        // check if the owner is the same 
        if(this.properties.get(this.propertyId) !== this.owner){
            client.log(`${this.propertyId}: owner not same`)
            // throw "owner not same"
            return false
        }

        // check if buyer is paying the same price as the property's price
        if(this.prices.get(this.propertyId) !== this.price){
            client.log(`${this.propertyId} price not the same`)
            // throw "price not same"
            return false
        }

        // check if the buyer has enough gold to buy 
        if(this.sufficientFund === false){
            // throw "not enough money"
            client.log(`The buyer doen't have enough to buy ${this.propertyId}`)
            return false
        }

        // delete the ownership of buyer
        this.properties.delete(this.propertyId)
        return true;
    }

}