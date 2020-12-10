"use strict";
const { Miner, Blockchain, utils } = require("spartan-gold");
const SpartanMixin = require("./SpartanMixin");
const Wallet = require("./Wallet");

const OWNERSHIP_REGISTRY = "reigster_ownership"
const TRADING_PROPERTY = "trading_property"
const NORMAL_TX = "sending_money"

module.exports = class SpartanMiner extends Miner {

    constructor(...args){
        super(...args);
        this.txActivities = new Map();
        Object.assign(this, SpartanMixin);
        this.createWallet();
    }



}