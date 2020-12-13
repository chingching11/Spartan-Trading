"use strict";

/**
 * A wallet has client's keys, address, gold balance and assets if he or she owned any property
 */
module.exports = class Wallet{

    /**
     * @param {String} address - client's address calculated from public key
     * @param {Oject} keyPair - client's generated keyPair from utils
     */
    constructor(address, keyPair){
        this.keyPair = keyPair
        this.address = address
        this.balance = 0
        this.assets = new Map()
    }

    /**
     * Get the client's balance and assets info from the last confirmed block.
     * @param {SpartanBlock} block - last confirmed block from the blockchain
     */
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

    /**
     * Conosle log the client's wallet info.
     * @param {SpartanBlock} block - last confirmed block from the blockchain
     */
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

