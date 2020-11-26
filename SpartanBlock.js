"use strict";
const { Block} = require("spartan-gold");
const OWNERSHIP_REGISTRY = "reigster_ownership"
const TRADING_PROPERTY = "trading_property"
const NORMAL_TX = "sending_money"

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
    constructor(rewardAddr, prevBlock, target=Blockchain.POW_TARGET, coinbaseReward=Blockchain.COINBASE_AMT_ALLOWED) {
        this.prevBlockHash = prevBlock ? prevBlock.hashVal() : null;
        this.target = target;
    
        // Get the balances and nonces from the previous block, if available.
        // Note that balances and nonces are NOT part of the serialized format.
        this.balances = prevBlock ? new Map(prevBlock.balances) : new Map();
        this.nextNonce = prevBlock ? new Map(prevBlock.nextNonce) : new Map();

        // get the properties from the previous block (houseId --> ownerId)
        this.properties = prevBlock ? new Map(prevBlock.properties) : new Map();
        // Get the client's owned properties (ownerId --> [properties])
        this.owners = prevBlock ? new Map(prevBlock.owners) : new Map();
    
        if (prevBlock && prevBlock.rewardAddr) {
          // Add the previous block's rewards to the miner who found the proof.
          let winnerBalance = this.balanceOf(prevBlock.rewardAddr) || 0;
          this.balances.set(prevBlock.rewardAddr, winnerBalance + prevBlock.totalRewards());
        }
    
        // Storing transactions in a Map to preserve key order.
        this.transactions = new Map();
        
        // Used to determine the winner between competing chains.
        // Note that this is a little simplistic -- an attacker
        // could make a long, but low-work chain.  However, this works
        // well enough for us.
        this.chainLength = prevBlock ? prevBlock.chainLength+1 : 0;
    
        this.timestamp = Date.now();
    
        // The address that will gain both the coinbase reward and transaction fees,
        // assuming that the block is accepted by the network.
        this.rewardAddr = rewardAddr;
    
        this.coinbaseReward = coinbaseReward;
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
          } else if (!tx.sufficientFunds(this)) {
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
      
          // Taking gold from the sender
          let senderBalance = this.balanceOf(tx.from);
          this.balances.set(tx.from, senderBalance - tx.totalOutput());
      
          // Giving gold to the specified output addresses
          tx.outputs.forEach(({amount, address}) => {
            let oldBalance = this.balanceOf(address);
            this.balances.set(address, amount + oldBalance);
          });
      
          return true;
    }

}