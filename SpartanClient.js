"use strict";
const { Client, Blockchain, utils } = require("spartan-gold");
const SpartanMixin = require("./SpartanMixin");


module.exports = class SpartanClient extends Client {

    constructor(...args){
        super(...args);
        this.txActivities= new Map()
        Object.assign(this, SpartanMixin);
        this.createWallet();
    }
     
}