"use strict";
// -	address
// -	balance
// -	property if owned any
// -	transaction history

module.exports = class Wallet{

    // assets map (type: value) ex: type balance, property
    constructor(address, block){
        this.address = address
        this.block = block
        this.assets = []
        this.activity = []
    }

    getAssets(){
        this.assets.push({"balance": this.confirmedBalance})
        for (let [property, id] of this.lastConfirmedBlock.properties) {
            if (id === this.address){
                this.wallet.assets.push({"property": property})
            }      
        }
    }
}

