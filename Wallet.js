"use strict";
const {Blockchain} = require('spartan-gold')


module.exports = class Wallet{

    // assets map (type: value) ex: type balance, property
    constructor(address, keyPair){
        this.keyPair = keyPair
        this.address = address
        this.balance = 0
        this.assets = []
        // this.activity = new Map()
        // this.history = new Map()

        // this.on(Blockchain.PROOF_FOUND, this.blockFound);
    }

    blockFound(block){
        for(let [id, type] of block.transactions){
            if(this.activity.get(id)){
                this.history.set(id, type.txType)
            } 
        }
        this.activity = new Map()
    }

    showAccInfo(block){
        this.balance = block.balanceOf(this.address);
        for (let [property, id] of block.properties) {
            if (id === this.address){
                this.assets.push(property)
            }      
        }
        console.log(`Account address: ${this.address}`);
        console.log(`\tbalance: ${this.balance} gold`);
        console.log(`\tassets: ${this.assets.length>0 ? this.assets: "none"}`);
        // console.log(`\tactivity:`) 
        // for(let [id, type] of this.history){
        //     console.log(`\t\t ${id} : ${type}`);
        // }
        
    }

    setGenesisBlock(block){
       this.client.setGenesisBlock(block);
    }
}

