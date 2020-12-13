"use strict";
const { Client} = require("spartan-gold");
const SpartanMixin = require("./SpartanMixin");


module.exports = class SpartanClient extends Client {

    constructor(...args){
        super(...args);
        Object.assign(this, SpartanMixin);
        this.createWallet();
    }
     
}