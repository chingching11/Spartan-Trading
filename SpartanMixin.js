"use strict"
const { Blockchain} = require("spartan-gold")
const Wallet = require("./Wallet")
const Transaction = require('./SpartanTransaction')

module.exports = {

    createWallet: function(){
        this.wallet = new Wallet(this.address, this.keyPair)
    },

    showWalletAccount: function(){
        this.log("Showing the Client's wallet")
        this.wallet.showAccInfo(this.lastConfirmedBlock)       
    }, 

    getWallet: function(){
      return this.wallet.getWalletInfo(this.lastConfirmedBlock)
    },

    /** 
        * Utility method that displays all confimed properties for all clients,
        * according to the client's own perspective of the network.
    */
   showAllProperties: function(){
    this.log("Showing properties: ");
        for (let [property, id] of this.lastConfirmedBlock.properties) {
            console.log(`    ${id}: ${property}`);
        }
    } , 

    postTransaction: function(txType, outputs, data={}, fee=Blockchain.DEFAULT_TX_FEE) {
        // We calculate the total value of gold needed.
        if(txType === Transaction.NORMAL_TX){
            let totalPayments = outputs.reduce((acc, {amount}) => acc + amount, 0) + fee;
    
            // Make sure the client has enough gold.
            if (totalPayments > this.availableGold) {
              throw new Error(`Requested ${totalPayments}, but account only has ${this.availableGold}.`);
            }
        }
       
        // Broadcasting the new transaction.
        let tx = Blockchain.makeTransaction({
            txType: txType,
            from: this.wallet.address,
            nonce: this.nonce,
            pubKey: this.wallet.keyPair.public,
            outputs: outputs,
            fee: fee,
            data: data,
        });
        
        tx.sign(this.wallet.keyPair.private);
    
        // Adding transaction to pending.
        this.pendingOutgoingTransactions.set(tx.id, tx);
    
        this.nonce++;

        this.net.broadcast(Blockchain.POST_TRANSACTION, tx);    
        
        return tx;
      },
}
