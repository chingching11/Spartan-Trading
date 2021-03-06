"use strict";

const { Transaction } = require("spartan-gold");
const OWNERSHIP_REGISTRY = "reigster_ownership"
const TRADING_PROPERTY = "trading_property"
const NORMAL_TX = "sending_spartanGold_money"


module.exports = class SpartanTransaction extends Transaction {
    
  static get OWNERSHIP_REGISTRY() { return OWNERSHIP_REGISTRY}

  static get TRADING_PROPERTY() { return TRADING_PROPERTY}
  
  static get NORMAL_TX() { return NORMAL_TX }

/**
   * 3 types of transactions:
   * for normal tx: 
   *    outputs = can be array, meaning that one transaction can pay multiple parties. 
   *      An output is a pair of an amount of gold and the hash of a public key (also called the address),
   *      in the form: {amount, address}
   *    data = empty obj
   * for ownership registry:
   *    outputs = empty array
   *    data = {propertyId, address}
   * for property trading: 
   *    outputs = same as normal tx
   *    data = {propertyId, address}
   * @constructor
   * @param {Object} obj - The inputs and outputs of the transaction.
   * @param obj.txType - The type of transaction
   * @param obj.from - The address of the payer.
   * @param obj.nonce - Number that orders the payer's transactions.  For coinbase
   *          transactions, this should be the block height.
   * @param obj.pubKey - Public key associated with the specified from address.
   * @param obj.sig - Signature of the transaction.  This field may be ommitted.
   * @param {Array} [obj.outputs] - An array of the outputs.
   * @param [obj.fee] - The amount of gold offered as a transaction fee.
   * @param [obj.data] - Object with any additional properties desired for the transaction.
   */
    constructor({txType, from, nonce, pubKey, sig, outputs, fee=0, data={}}) {
        super({txType, from, nonce, pubKey, sig, outputs, fee, data})
        this.txType = txType;
      }

    /**
     * @returns {String} - type of transaction
     */
    typeOfTx(){
        return this.txType;
    }
  
}