const { Blockchain, Miner, FakeNet } = require("spartan-gold");
let Block = require('./SpartanBlock.js');
let Client = require('./SpartanClient.js');
let Transaction = require('./SpartanTransaction.js');
let House = require("./House")


console.log("Starting simulation.  This may take a moment...");


let fakeNet = new FakeNet();

// Clients
let alice = new Client({name: "Alice", net: fakeNet});
let bob = new Client({name: "Bob", net: fakeNet});
let charlie = new Client({name: "Charlie", net: fakeNet});

let h1 = new House ({latitude: 38.89, longitude: -77.03, physicalAddr: "123 abc street", price: 500})
let h2 = new House ({latitude: 50.01, longitude: 85.60, physicalAddr: "oh my street", price: 700})
let h3 = new House({latitude: 16.87, longitude: 96.199, physicalAddr: "66 Sint Oo Dan Street", price: 1000})
let h4 = new House({latitude: 35.9078, longitude: 127.7669, physicalAddr: "Sleepy Street", price: 350})

// Miners
let minnie = new Miner({name: "Minnie", net: fakeNet});
let mickey = new Miner({name: "Mickey", net: fakeNet});

// Creating genesis block
let genesis = Blockchain.makeGenesis({
  blockClass: Block,
  transactionClass: Transaction,
//   startingBalances: new Map([
//       [aliceWallet1.address, 233],
//       [bobWallet.address, 99],
//       [charlie.address, 67],
//       [minnie.address, 400],
//       [mickey.address, 300],
//   ])
  clientBalanceMap: new Map([
    [alice, 233],
    [bob, 99],
    [charlie, 67],
    [minnie, 400],
    [mickey, 300],
  ]),
});

// // alice.setGenesisBlock(genesis)
// console.log(alice.lastBlock);
// console.log(genesis);
// throw 'stop'
// bob.setGenesisBlock(genesis)
// charlie.setGenesisBlock(genesis)
// minnie.setGenesisBlock(genesis)
// mickey.setGenesisBlock(genesis)

// Late miner - Donald has more mining power, represented by the miningRounds.
// (Mickey and Minnie have the default of 2000 rounds).
let donald = new Miner({name: "Donald", net: fakeNet, startingBlock: genesis, miningRounds: 3000});

function showBalances(client) {
  console.log(`Alice has ${client.lastBlock.balanceOf(alice.wallet.address)} gold.`);
  console.log(`Bob has ${client.lastBlock.balanceOf(bob.address)} gold.`);
  console.log(`Charlie has ${client.lastBlock.balanceOf(charlie.address)} gold.`);
  console.log(`Minnie has ${client.lastBlock.balanceOf(minnie.address)} gold.`);
  console.log(`Mickey has ${client.lastBlock.balanceOf(mickey.address)} gold.`);
  console.log(`Donald has ${client.lastBlock.balanceOf(donald.address)} gold.`);
}

function showProperties(client) {
    console.log(`Alice has ${client.lastBlock.ownerOf(alice.wallet.address)}`);
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
console.log(`Alice is transferring 40 gold to ${bob.wallet.address}`);
console.log();
// alice.postTransaction(Transaction.NORMAL_TX,[{ amount: 40, address: bob.address }]);
alice.postTransaction(Transaction.NORMAL_TX, [{ amount: 40, address: bob.wallet.address }]);

// Alice registering h3
console.log(`Alice registering ownership, ${h3.hashID}`);
alice.postTransaction(Transaction.OWNERSHIP_REGISTRY, [], {propertyId: h3.hashID , price: h3.price})
// alice.postTransaction(Transaction.NORMAL_TX, aliceWallet1, [{ amount: 40, address: bobWallet.address }]);
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

//   console.log();
//   console.log("Final balances (Minnie's perspective):");
//   showBalances(minnie);

  console.log();
  console.log("Final balances (Alice's perspective):");
  showBalances(alice);
  showProperties(alice);
  console.log();
  alice.showWalletAccount();
  console.log();
  bob.showWalletAccount();
  console.log();

  process.exit(0);
}, 5000);