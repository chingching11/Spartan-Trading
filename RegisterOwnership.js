const data = require('./PropertiesIDLists.json')

module.exports = class RegisterOwnership{
    constructor(block, propertyId){
        this.block = block
        this.properties = block.properties
        this.propertyId = propertyId
    }
    validToRegister(){
        // check if the property has been claimed
        if(this.properties.get(this.propertyId)){
            console.log(`${this.propertyId} is already been claimed by someone.`);
            return false;
        } 
        // check if the property really exists
        let inList = false;
        data.forEach((d) => {       
            if (d.propertyId === this.propertyId) {
                console.log("found the property "  + d.propertyId);
                inList = true;
            }
        })
        if(!inList){
            console.log(`${this.propertyId} doesn't exist.`)
            return false;
        }
        return true;
    }
}
