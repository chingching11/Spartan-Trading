const { utils } = require('spartan-gold');
const HOUSE_CONST = "HS"

module.exports = class House {

    /**
     * 
     * @param {Float} latitude - latitude of the house
     * @param {Float} longitude - longitude of the house
     * @param {String} physicalAddr - physical address of the house
     * @param {Float} price - price at which seller wants to sells the house 
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
        }));
    }

}