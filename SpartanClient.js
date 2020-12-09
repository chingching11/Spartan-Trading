"use strict";
const { Client, Blockchain } = require("spartan-gold");

const OWNERSHIP_REGISTRY = "reigster_ownership"
const TRADING_PROPERTY = "trading_property"
const NORMAL_TX = "sending_money"

module.exports = class SpartanClient extends Client {

    constructor(...args){
        super(...args);
        this.wallet = {}
        this.wallet.account = this.address
        this.wallet.activity = []
        this.wallet.balance = 0
        this.wallet.property = []
        
    }
    
    getProperty(){
        let p= []
        for (let [property, id] of this.lastConfirmedBlock.properties) {
            if (id === this.address){
                p.push(property)
            }      
        }
        return p
    }
    // -	address
    // -	balance
    // -	property if owned any
    // -	transaction history

    showWallet(){    
        this.log("Showing the client's wallet: ")
        this.wallet.balance = this.confirmedBalance
        this.wallet.property = this.getProperty()     
        console.log(`Your account address is ${this.wallet.account}`);
        console.log(`Your balance ${this.wallet.balance} gold`);
        if(this.wallet.property.length>0){
            console.log(`You owned ${this.wallet.property}`);
        }
        console.log(`Your transaction history: ${this.wallet.activity}`);
        // console.log(this.wallet);
    }


    /** 
     * Utility method that displays all confimed properties for all clients,
    * according to the client's own perspective of the network.
    */
    showAllProperties(){
        this.log("Showing properties: ");
        for (let [property, id] of this.lastConfirmedBlock.properties) {
            console.log(`    ${id}: ${property}`);
        }
    }


    postTransaction(txType, outputs, data={}, fee=Blockchain.DEFAULT_TX_FEE) {
        // We calculate the total value of gold needed.
        if(txType === NORMAL_TX){
            let totalPayments = outputs.reduce((acc, {amount}) => acc + amount, 0) + fee;
    
            // Make sure the client has enough gold.
            if (totalPayments > this.availableGold) {
              throw new Error(`Requested ${totalPayments}, but account only has ${this.availableGold}.`);
            }
        }
       
    
        // Broadcasting the new transaction.
        let tx = Blockchain.makeTransaction({
            txType: txType,
            from: this.address,
            nonce: this.nonce,
            pubKey: this.keyPair.public,
            outputs: outputs,
            fee: fee,
            data: data
        });
        
        tx.sign(this.keyPair.private);
    
        // Adding transaction to pending.
        this.pendingOutgoingTransactions.set(tx.id, tx);
    
        this.nonce++;
    
        this.net.broadcast(Blockchain.POST_TRANSACTION, tx);
        this.wallet.activity.push(tx.txType)
    
        return tx;
      }
    
      


}