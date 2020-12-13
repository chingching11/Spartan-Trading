const data = require('./PropertiesIDLists.json')

/**
 * Verification Rules for register ownership
 */
module.exports = class RegisterOwnership{
    /**
     * 
     * @param {SpartanBlock} block 
     * @param {String} propertyId - property hash id 
     */
    constructor(block, propertyId){
        this.block = block
        this.properties = block.properties
        this.propertyId = propertyId
    }
    /**
     * Check if the property is valid to register.
     * @param {SpartanClient} client - miner who's checking current tx
     */
    validToRegister(client){
        // check if the property has been claimed
        if(this.properties.get(this.propertyId)){
            client.log(`${this.propertyId} is already been claimed by someone.`);
            return false;
        } 
        // check if the property really exists
        let inList = false;
        data.forEach((d) => {       
            if (d.propertyId === this.propertyId) {
                // console.log("found the property "  + d.propertyId);
                inList = true;
            }
        })
        if(!inList){
            client.log(`${this.propertyId} doesn't exist.`)
            return false;
        }
        return true;
    }
}
