"use strict";
const { Client, Blockchain } = require("spartan-gold");

const OWNERSHIP_REGISTRY = "reigster_ownership"
const TRADING_PROPERTY = "trading_property"
const NORMAL_TX = "sending_money"

module.exports = class SpartanClient extends Client {

    /** ALl the houses that the client owns. This getter looks at the last confirmed block. */
    get Properties(){
        //return this.lastConfirmedBlock.properties(this.address);
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
    
        return tx;
      }
    
}