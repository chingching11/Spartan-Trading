"use strict";
const { Client } = require("spartan-gold");

module.exports = class SpartanClient extends Client {

    /** ALl the houses that the client owns. This getter looks at the last confirmed block. */
    get Properties(){
        //return this.lastConfirmedBlock.properties(this.address);
    }

    /** 
     * Utility method that displays all confimed properties for all clients,
    * according to the client's own perspective of the network.
    */
    showAllProperties(){

    }
}