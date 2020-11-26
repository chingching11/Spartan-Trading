"use strict";

const { Transaction } = require("spartan-gold");
const OWNERSHIP_REGISTRY = "reigster_ownership"
const TRADING_PROPERTY = "trading_property"
const NORMAL_TX = "sending_money"

// to accept property registry as a type of transaction

module.exports = class SpartanTransaction extends Transaction {
    constructor(...args){
        super(args)       
    }

    typeOfTx(){
        return this.data.typeOfTx;
    }
    
    
}