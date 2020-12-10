const express = require("express")

const { Blockchain, FakeNet } = require("spartan-gold");
let Block = require('./SpartanBlock.js');
let Client = require('./SpartanClient.js');
let Transaction = require('./SpartanTransaction.js');
let House = require('./House.js');
let Miner = require('./SpartanMiner')
const app = express();

let fakeNet = new FakeNet();

// Clients
let alice = new Client({name: "Alice", net: fakeNet});

let bob = new Client({name: "Bob", net: fakeNet});
let charlie = new Client({name: "Charlie", net: fakeNet});
let badBuyer = new Client({name: "Bad Guy", net: fakeNet});

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
    [badBuyer, 100],
    [minnie, 400],
    [mickey, 300],
  ]),
});

app.get('/', (req, res) => {
    fakeNet.register(alice, bob, charlie, minnie, mickey);

    // Miners start mining.
    minnie.initialize();
    mickey.initialize();
    res.send("Start Mining")
})

app.get('/alice', (req, res) => {
    alice.postTransaction(Transaction.NORMAL_TX, [{ amount: 40, address: bob.wallet.address }]);
    // res.send(alice.showWalletAccount())
})

app.get('/aliceWallet', (req, res) => {
    alice.showWalletAccount()
    res.json(alice.wallet)
})

app.listen(process.env.PORT || 3000, () =>
   console.log("server is running on port 3000")
)

