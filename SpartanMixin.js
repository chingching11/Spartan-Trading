"use strict"
const { Blockchain} = require("spartan-gold")
const Wallet = require("./Wallet")
const Transaction = require('./SpartanTransaction')

module.exports = {

    /**
     * create a wallet using the client's address
     */
    createWallet: function(){
        this.wallet = new Wallet(this.address, this.keyPair)
    },

    /**
     * console log the client's wallet info
     */
    showWalletAccount: function(){
        this.log("Showing the Client's wallet")
        this.wallet.showAccInfo(this.lastConfirmedBlock)       
    }, 

    /**
     * get the client's wallet info
     */
    getWallet: function(){
      return this.wallet.getWalletInfo(this.lastConfirmedBlock)
    },

    /** 
     * displays all confimed properties for all clients,
     * according to the client's own perspective of the network.
    */
   showAllProperties: function(){
    this.log("Showing properties: ");
        for (let [property, id] of this.lastConfirmedBlock.properties) {
            console.log(`    ${id}: ${property}`);
        }
    } , 

    /**
     * 
     * @param {String} txType - transaction type 
     * @param {Array} outputs - list of address and amounts to pay
     * @param {Object} data - contains information about propertyId and property price
     * @param {number} fee - transaction fees
     * 
     * @returns {SpartanTransaction} - broadcasted transaction
     */
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
