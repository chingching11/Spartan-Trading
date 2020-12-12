const express = require("express")
const ejs = require("ejs")
const bodyParser = require("body-parser")

const { Blockchain, FakeNet } = require("spartan-gold");
let Block = require('./SpartanBlock.js');
let Client = require('./SpartanClient.js');
let Transaction = require('./SpartanTransaction.js');
let Miner = require('./SpartanMiner')
const data = require('./PropertiesIDLists.json')

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))


let fakeNet = new FakeNet();

// Clients
let alice = new Client({name: "Alice", net: fakeNet});
let bob = new Client({name: "Bob", net: fakeNet});

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
    [minnie, 400],
    [mickey, 300],
  ]),
});

fakeNet.register(alice, bob, minnie, mickey);
// Miners start mining.
minnie.initialize();
mickey.initialize();

app.get('/', (req, res) => {
  //show a list of property id
    res.json(data)
})

app.get('/alice', (req, res) => {
    res.render('client', {clientName: "alice", wallet: alice.getWallet()})
})

app.post('/alice/send', (req, res, next) => {
  let amount = parseInt(req.body.amount, 10)
  let address = req.body.address
  alice.postTransaction(Transaction.NORMAL_TX, [{ amount: amount, address: address}]);
  res.redirect('/alice')
})

app.post('/alice/register', (req, res, next) => {
  let price = parseInt(req.body.price, 10)
  let propertyId = req.body.propertyId
  alice.postTransaction(Transaction.OWNERSHIP_REGISTRY, [], {propertyId: propertyId , price: price})
  res.redirect('/alice')
})

app.post('/alice/buy', (req, res, next) => {
  let propertyId = req.body.propertyId
  let block = alice.lastConfirmedBlock
  let ownerAddress = block.properties.get(propertyId)
  let price = block.prices.get(propertyId)
  alice.postTransaction(Transaction.TRADING_PROPERTY, [{ amount: price, address: ownerAddress }], {propertyId: propertyId, price: price})
  res.redirect('/alice')
})

app.get('/bob', (req, res) => {
  res.render('client', {clientName: "bob", wallet: bob.getWallet()})
})

app.post('/bob/send', (req, res, next) => {
  let amount = parseInt(req.body.amount, 10)
  let address = req.body.address
  bob.postTransaction(Transaction.NORMAL_TX, [{ amount: amount, address: address}]);
  res.redirect('/bob')
})

app.post('/bob/register', (req, res, next) => {
  let price = parseInt(req.body.price, 10)
  let propertyId = req.body.propertyId
  bob.postTransaction(Transaction.OWNERSHIP_REGISTRY, [], {propertyId: propertyId , price: price})
  res.redirect('/bob')
})

app.post('/bob/buy', (req, res, next) => {
  let propertyId = req.body.propertyId
  let block = alice.lastConfirmedBlock
  let ownerAddress = block.properties.get(propertyId)
  let price = block.prices.get(propertyId)
  bob.postTransaction(Transaction.TRADING_PROPERTY, [{ amount: price, address: ownerAddress }], {propertyId: propertyId, price: price})
  res.redirect('/bob')
})

app.listen(process.env.PORT || 3000, () =>
   console.log("server is running on port 3000")
)

