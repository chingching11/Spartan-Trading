const { utils } = require('spartan-gold');
const HOUSE_CONST = "HS"

module.exports = class House {

    /**
     * 
     * @param {Float} geoCoordinates - the geo corrdinates of the house
     * @param {String} physicalAddr - physical address of the house
     * @param {Float} price - price at which seller wants to sells the house 
     * @param {String} ownerAddr - address of the owner 
     */
    constructor({latitude, longitude,  physicalAddr, price}){
        this.latitude = latitude
        this.longitude = longitude
        this.physicalAddr = physicalAddr
        this.price = price
    }

     /** 
      * Hash the house's informations 
      */
    get hashID(){
        return utils.hash(HOUSE_CONST + JSON.stringify({
            latitude: this.latitude,
            longitude: this.longitude,
            physicalAddr: this.physicalAddr,
            price: this.price,
            // ownerAddr: this.ownerAddr
        }));
    }


    /**
     * 
     * @param privKey - client's private key to sign the house id 
     */
    sign(privKey){
        this.signature = utils.sign(privKey, this.hashID)
    }

    /**
     * verifySignature, check if the property exists, check it's been claimed by anyone 
     */
    validOwnership(){

    }
    
}