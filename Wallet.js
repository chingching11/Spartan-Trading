"use strict";
// -	address
// -	balance
// -	property if owned any
// -	transaction history
const Client = require("./SpartanClient")

module.exports = class Wallet{

    // assets map (type: value) ex: type balance, property
    constructor(address, keyPair, client){
        this.client = client
        this.keyPair = keyPair
        this.address = address
        this.balance = 0
        this.assets = []
        this.activity = []
    }

    showAccInfo(block){
        this.balance = block.balanceOf(this.address);
        for (let [property, id] of block.properties) {
            if (id === this.address){
                this.assets.push(property)
            }      
        }
        console.log(`Account address: ${this.address}`);
        console.log(`   balance: ${this.balance} gold`);
        console.log(`   assets: ${this.assets.length>0 ? this.assets: "none"}`);
         
    }

    setGenesisBlock(block){
       this.client.setGenesisBlock(block);
    }
}

