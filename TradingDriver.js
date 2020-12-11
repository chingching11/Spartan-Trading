"use strict";

const { Blockchain, FakeNet } = require("spartan-gold");
let Block = require('./SpartanBlock.js');
let Client = require('./SpartanClient.js');
let Transaction = require('./SpartanTransaction.js');
let Miner = require('./SpartanMiner')
let House = require('./House.js');


console.log("Starting simulation.  This may take a moment...");


let fakeNet = new FakeNet();

// Clients
let alice = new Client({name: "Alice", net: fakeNet});
let bob = new Client({name: "Bob", net: fakeNet});
let charlie = new Client({name: "Charlie", net: fakeNet});
let badGuy = new Client({name: "Bad Guy", net: fakeNet});

// Miners
let minnie = new Miner({name: "Minnie", net: fakeNet});
let mickey = new Miner({name: "Mickey", net: fakeNet});

// Creating genesis block
let genesis = Blockchain.makeGenesis({
  blockClass: Block,
  transactionClass: Transaction,
  clientBalanceMap: new Map([
    [alice, 233],
    [bob, 99],
    [charlie, 600],
    [badGuy, 100],
    [minnie, 400],
    [mickey, 300],
  ]),
});

// Late miner - Donald has more mining power, represented by the miningRounds.
// (Mickey and Minnie have the default of 2000 rounds).
let donald = new Miner({name: "Donald", net: fakeNet, startingBlock: genesis, miningRounds: 3000});

function showBalances(client) {
  console.log(`Alice has ${client.lastBlock.balanceOf(alice.wallet.address)} gold.`);
  console.log(`Bob has ${client.lastBlock.balanceOf(bob.wallet.address)} gold.`);
  console.log(`Charlie has ${client.lastBlock.balanceOf(charlie.wallet.address)} gold.`);
  console.log(`Bad Buyer has ${client.lastBlock.balanceOf(badGuy.wallet.address)} gold.`);
  console.log(`Minnie has ${client.lastBlock.balanceOf(minnie.wallet.address)} gold.`);
  console.log(`Mickey has ${client.lastBlock.balanceOf(mickey.wallet.address)} gold.`);
  console.log(`Donald has ${client.lastBlock.balanceOf(donald.wallet.address)} gold.`);
}
function showProperties(client) {
    console.log(`Alice has ${client.lastBlock.ownerOf(alice.wallet.address)}`);
    console.log(`Bob has ${client.lastBlock.ownerOf(bob.wallet.address)}`);
    console.log(`Charlie has ${client.lastBlock.ownerOf(charlie.wallet.address)}`);
    console.log(`Bad Buyer has ${client.lastBlock.ownerOf(badGuy.wallet.address)}`);
    console.log(`Minnie has ${client.lastBlock.ownerOf(minnie.wallet.address)}`);
    console.log(`Mickey has ${client.lastBlock.ownerOf(mickey.wallet.address)}`);
    console.log(`Donald has ${client.lastBlock.ownerOf(donald.wallet.address)}`);
}

// Showing the initial balances from Alice's perspective, for no particular reason.
console.log("Initial balances:");
showBalances(alice);

fakeNet.register(alice, bob, charlie, minnie, mickey);

// Miners start mining.
minnie.initialize();
mickey.initialize();

let h1 = new House ({latitude: 38.89, longitude: -77.03, physicalAddr: "123 abc street", price: 500})
let h2 = new House ({latitude: 50.01, longitude: 85.60, physicalAddr: "oh my street", price: 700})
let h3 = new House({latitude: 16.87, longitude: 96.199, physicalAddr: "66 Sint Oo Dan Street", price: 1000})
let h4 = new House({latitude: 35.9078, longitude: 127.7669, physicalAddr: "Sleepy Street", price: 350})

// Alice transfers some money to Bob.
console.log(`Alice is transferring 40 gold to ${bob.address}`);
alice.postTransaction(Transaction.NORMAL_TX, [{ amount: 40, address: bob.wallet.address }]);

// Bob registering h1
console.log(`Bob registering ownership, ${h1.hashID}`);
bob.postTransaction(Transaction.OWNERSHIP_REGISTRY, [], {propertyId: h1.hashID, price: h1.price})

// Bob registering h2
console.log(`Bob registering ownership, ${h2.hashID}`);
bob.postTransaction(Transaction.OWNERSHIP_REGISTRY, [], {propertyId: h2.hashID, price: h2.price})

// Alice registering h3
console.log(`Alice registering ownership, ${h3.hashID}`);
alice.postTransaction(Transaction.OWNERSHIP_REGISTRY, [], {propertyId: h3.hashID , price: h3.price})

// Alice registering h4
console.log(`Alice registering ownership, ${h4.hashID}`);
alice.postTransaction(Transaction.OWNERSHIP_REGISTRY, [], {propertyId: h4.hashID , price: h4.price})

// Charlie buying Bob's h1
console.log(`Charlie buying Bob's property, ${h1.hashID}`);
charlie.postTransaction(Transaction.TRADING_PROPERTY, [{ amount: h1.price, address: bob.wallet.address }], {propertyId: h1.hashID, price: h1.price})

// Bad Guy registering Alice's property
console.log(`Bad Guy registering ownership, ${h3.hashID} `);
badGuy.postTransaction(Transaction.OWNERSHIP_REGISTRY, [], {propertyId: h3.hashID , price: h3.hashID})

// Bad Guy registering non-existent property
console.log(`Bad Guy registering non-existent property`);
badGuy.postTransaction(Transaction.OWNERSHIP_REGISTRY, [], {propertyId: "ace45b03e82849e2dfe368ba4c2c6c3fb89d4eca0602f7bd0a010229563e9539",price:10000})

// Bad Guy buying Alice property, with not sufficient fund
console.log(`Bad Guy buying Alice's property with not sufficient fund, ${h2.hashID}`);
badGuy.postTransaction(Transaction.TRADING_PROPERTY, [{ amount: h2.price, address: alice.wallet.address }], {propertyId: h2.hashID, price: h2.price})


// Bad Guy buying Alice property, with differnt price
console.log(`Bad Guy buying Alice's property with differnt price, ${h2.hashID}`);
badGuy.postTransaction(Transaction.TRADING_PROPERTY, [{ amount: 10, address: alice.wallet.address }], {propertyId: h2.hashID, price: h2.price})

// Bad Guy buying unregistered property
console.log(`Bad Guy buying unregistered property`);
badGuy.postTransaction(Transaction.TRADING_PROPERTY, [{ amount: h3.price, address: alice.wallet.address }], {propertyId: "ace45b03e82849e2dfe368ba4c2c6c3fb89d4eca0602f7bd0a010229563e9539", price:80})

setTimeout(() => {
  console.log();
  console.log("***Starting a late-to-the-party miner***");
  console.log();
  fakeNet.register(donald);
  donald.initialize();
}, 2000);

// Print out the final balances after it has been running for some time.
setTimeout(() => {
  console.log();
  console.log(`Minnie has a chain of length ${minnie.currentBlock.chainLength}:`);

  console.log();
  console.log(`Mickey has a chain of length ${mickey.currentBlock.chainLength}:`);

  console.log();
  console.log(`Donald has a chain of length ${donald.currentBlock.chainLength}:`);

  console.log();
  console.log("Final balances (Minnie's perspective):");
  showBalances(minnie);

  console.log();
  console.log("Final balances (Alice's perspective):");
  showBalances(alice);

  console.log();
  console.log("Final balances (Donald's perspective):");
  showBalances(donald);

  console.log();
  console.log("Final properties (Minnie's perspective):");
  showProperties(minnie);

  console.log();
  console.log("Final properties (Alice's perspective):");
  showProperties(alice);

  console.log();
  console.log("Final properties (Donald's perspective):");
  showProperties(donald);

  
  console.log();
  // console.log(alice);

  alice.showWalletAccount();
  console.log();
  bob.showWalletAccount();
  console.log();
  charlie.showWalletAccount();
  console.log();
  badGuy.showWalletAccount();
  console.log();
  minnie.showWalletAccount();
    
  process.exit(0);
}, 5000);

