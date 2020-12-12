"use strict";

module.exports = class Wallet{

    constructor(address, keyPair){
        this.keyPair = keyPair
        this.address = address
        this.balance = 0
        this.assets = new Map()
    }

    getWalletInfo(block){
        this.balance = block.balanceOf(this.address);
        this.assets = new Map()
        for (let [property, id] of block.properties) {
            if (id === this.address){
                this.assets.set(property, block.prices.get(property))
            }      
        }
        return this
    }

    showAccInfo(block){
        this.balance = block.balanceOf(this.address);
        this.assets = new Map()
        for (let [property, id] of block.properties) {
            if (id === this.address){
                this.assets.set(property, block.prices.get(property))
            }      
        }
        console.log(`Account address: ${this.address}`);
        console.log(`\tbalance: ${this.balance} gold`);
        console.log(`\tassets: `);
        for(let [property, price] of this.assets){
            console.log(`\t\t${property} : ${price} gold`);
        }
    }
}

