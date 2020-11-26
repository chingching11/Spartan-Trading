const Tx = require('./SpartanTransaction')

let t1 = new Tx({
    from: "ljflasfdsf",
    nonce: 1,
    pubKey: "djfkladsfsda",
    sig: "dfjasdlfsda",
    fee: 2,
    outputs: ["hello"],
})

console.log(t1);