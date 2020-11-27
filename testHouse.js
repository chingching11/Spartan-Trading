const House = require('./House')

// same house will give same hashID
const h1 = new House(1.1, "helllo street", 500000)
let h2 = new House(1.1, "world street", 500000)
console.log(h1.hashID);
console.log(h2.hashID);
console.log(h1);

// const propertiesMap = new Map();
// propertiesMap.set(h1.hashID, '34ijfioasjfiowfsafasdfjoasdf')
// console.log(propertiesMap.get('dfhlasjflsadf'));
// if(propertiesMap.get(h2.hashID)){
//     console.log("it's defined");
// }