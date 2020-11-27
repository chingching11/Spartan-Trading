"use strict";
const { Block, Blockchain} = require("spartan-gold");
const OWNERSHIP_REGISTRY = "reigster_ownership"
const TRADING_PROPERTY = "trading_property"
const NORMAL_TX = "sending_spartanGold_money"
module.exports = class SpartanBlock extends Block {

    // modify addTx: in check conditions
    // also check: if validOwnership 

    
    /**
   * Creates a new Block.  Note that the previous block will not be stored;
   * instead, its hash value will be maintained in this block.
   * 
   * @constructor
   * @param {String} rewardAddr - The address to receive all mining rewards for this block.
   * @param {Block} [prevBlock] - The previous block in the blockchain.
   * @param {Number} [target] - The POW target.  The miner must find a proof that
   *      produces a smaller value when hashed.
   * @param {Number} [coinbaseReward] - The gold that a miner earns for finding a block proof.
   */
    constructor(rewardAddr, prevBlock, target=Blockchain.POW_TARGET, coinbaseReward=Blockchain.COINBASE_AMT_ALLOWED){
        super(rewardAddr, prevBlock, target=Blockchain.POW_TARGET, coinbaseReward=Blockchain.COINBASE_AMT_ALLOWED)
         // get the properties from the previous block (houseId --> ownerId)
         this.properties = prevBlock ? new Map(prevBlock.properties) : new Map();
         // Get the client's owned properties (ownerId --> [properties])
         this.owners = prevBlock ? new Map(prevBlock.owners) : new Map();

    }

    ownerOf(addr){
        return this.owners.get(addr) || 0;
    }
    /**
     * Accepts 3 types of tx: normal tx, register ownership, trading 
     * @param {*} tx 
     * @param {*} client 
     * 
     * @returns {Boolean}
     */
    // Needs to be updated!!!!!!!!! to accept other txs
    addTransaction(tx, client){
        if (this.transactions.get(tx.id)) {
            if (client) client.log(`Duplicate transaction ${tx.id}.`);
            return false;
          } else if (tx.sig === undefined) {
            if (client) client.log(`Unsigned transaction ${tx.id}.`);
            return false;
          } else if (!tx.validSignature()) {
            if (client) client.log(`Invalid signature for transaction ${tx.id}.`);
            return false;
          } else if (tx.txType === NORMAL_TX && !tx.sufficientFunds(this)) {
            if (client) client.log(`Insufficient gold for transaction ${tx.id}.`);
            return false;
          }
      
          // Checking and updating nonce value.
          // This portion prevents replay attacks.
          let nonce = this.nextNonce.get(tx.from) || 0;
          if (tx.nonce < nonce) {
            if (client) client.log(`Replayed transaction ${tx.id}.`);
            return false;
          } else if (tx.nonce > nonce) {
            // FIXME: Need to do something to handle this case more gracefully.
            if (client) client.log(`Out of order transaction ${tx.id}.`);
            return false;
          } else {
            this.nextNonce.set(tx.from, nonce + 1);
          }

          // Adding the transaction to the block
          this.transactions.set(tx.id, tx);
          console.log(tx.txType);
          if(tx.txType === NORMAL_TX){
            // Taking gold from the sender
            let senderBalance = this.balanceOf(tx.from);
            this.balances.set(tx.from, senderBalance - tx.totalOutput());
        
            // Giving gold to the specified output addresses
            tx.outputs.forEach(({amount, address}) => {
                let oldBalance = this.balanceOf(address);
                this.balances.set(address, amount + oldBalance);
            });
          } else if(tx.txType === OWNERSHIP_REGISTRY) {
              this.properties.set(tx.data.propertyId, tx.data.address);
              this.owners.set(tx.data.address, tx.data.propertyId);
              console.log("hey hey hey");
          }
          
          console.log(this.owners);
          console.log(`Hey owner ${tx.data.address} property is `  + this.ownerOf(tx.data.address));
          return true;
    }

    rerun(prevBlock) {
        // Setting balances to the previous block's balances.
        this.balances = new Map(prevBlock.balances);
        this.nextNonce = new Map(prevBlock.nextNonce);
        this.owners = new Map(prevBlock.owners)
        this.properties = new Map(prevBlock.properties)
    
        // Adding coinbase reward for prevBlock.
        let winnerBalance = this.balanceOf(prevBlock.rewardAddr);
        if (prevBlock.rewardAddr) this.balances.set(prevBlock.rewardAddr, winnerBalance + prevBlock.totalRewards());


        // Re-adding all transactions.
        let txs = this.transactions;
        this.transactions = new Map();
        for (let tx of txs.values()) {
          let success = this.addTransaction(tx);
          if (!success) return false;
        }
    
        return true;
      }

}