"use strict";

const { Blockchain, Miner, FakeNet } = require("spartan-gold");
let Block = require('./SpartanBlock.js');
let Client = require('./SpartanClient.js');
let Transaction = require('./SpartanTransaction.js');
let House = require('./House.js')

console.log("Starting simulation.  This may take a moment...");


let fakeNet = new FakeNet();

// Clients
let alice = new Client({name: "Alice", net: fakeNet});
let bob = new Client({name: "Bob", net: fakeNet});
let charlie = new Client({name: "Charlie", net: fakeNet});

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
    [minnie, 400],
    [mickey, 300],
  ]),
});

// Late miner - Donald has more mining power, represented by the miningRounds.
// (Mickey and Minnie have the default of 2000 rounds).
let donald = new Miner({name: "Donald", net: fakeNet, startingBlock: genesis, miningRounds: 3000});

function showBalances(client) {
  console.log(`Alice has ${client.lastBlock.balanceOf(alice.address)} gold.`);
  console.log(`Bob has ${client.lastBlock.balanceOf(bob.address)} gold.`);
  console.log(`Charlie has ${client.lastBlock.balanceOf(charlie.address)} gold.`);
  console.log(`Minnie has ${client.lastBlock.balanceOf(minnie.address)} gold.`);
  console.log(`Mickey has ${client.lastBlock.balanceOf(mickey.address)} gold.`);
  console.log(`Donald has ${client.lastBlock.balanceOf(donald.address)} gold.`);
}
function showProperties(client) {
    console.log(`Alice has ${client.lastBlock.ownerOf(alice.address)}`);
    console.log(`Bob has ${client.lastBlock.ownerOf(bob.address)}`);
    console.log(`Charlie has ${client.lastBlock.ownerOf(charlie.address)}`);
    console.log(`Minnie has ${client.lastBlock.ownerOf(minnie.address)}`);
    console.log(`Mickey has ${client.lastBlock.ownerOf(mickey.address)}`);
    console.log(`Donald has ${client.lastBlock.ownerOf(donald.address)}`);
}

// Showing the initial balances from Alice's perspective, for no particular reason.
console.log("Initial balances:");
showBalances(alice);

fakeNet.register(alice, bob, charlie, minnie, mickey);

// Miners start mining.
minnie.initialize();
mickey.initialize();

// Alice transfers some money to Bob.
console.log(`Alice is transferring 40 gold to ${bob.address}`);
alice.postTransaction(Transaction.NORMAL_TX, [{ amount: 40, address: bob.address }]);

let h1 = new House ({latitude: 38.89, longitude: -77.03, physicalAddr: "123 abc street", price: 500})

let h2 = new House ({latitude: 16.87, longitude: 96.199, physicalAddr: "66 Sint Oo Dan Street", price: 1000})

// Bob registering 
console.log(`Bob registering ownership, ${h1.hashID}`);
bob.postTransaction(Transaction.OWNERSHIP_REGISTRY, [], {propertyId: h1.hashID , address: bob.address, price: h1.price})

// Alice registering 
console.log(`Alice registering ownership, ${h2.hashID}`);
alice.postTransaction(Transaction.OWNERSHIP_REGISTRY, [], {propertyId: h2.hashID , address: alice.address, price: h2.price})

// Charlie buying Bob's property
console.log(`Bob transferring ownership to Charlie, ${h1.hashID}`);
charlie.postTransaction(Transaction.TRADING_PROPERTY, [{ amount: h1.price, address: bob.address }], {propertyId: h1.hashID, address: charlie.address, price: h1.price})


// // Charlie registering Bob's property
// console.log(`Charlie registering ownership, ${h1.hashID} `);
// bob.postTransaction(Transaction.OWNERSHIP_REGISTRY, [], {propertyId: h1.hashID , address: charlie.address})

// // Charlie registering non-existent property
// console.log(`Charlie registering ownership, ace45b03e82849e2dfe368ba4c2c6c3fb89d4eca0602f7bd0a010229563e9539`);
// charlie.postTransaction(Transaction.OWNERSHIP_REGISTRY, [], {propertyId: "ace45b03e82849e2dfe368ba4c2c6c3fb89d4eca0602f7bd0a010229563e9539", address: charlie.address})

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
  alice.showWallet();
  console.log();
  charlie.showWallet();
  bob.showWallet();
 

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
  
  process.exit(0);
}, 5000);

