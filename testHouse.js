const House = require('./House')
const data = require('./PropertiesLists.json')

let fs = require('fs')
let propertyIdLists = []

// console.log(data);
data.forEach((d) => {
    let e = new House(d);
    // console.log(e);
    console.log(e.hashID);
    // propertyIdLists.push({propertyId: e.hashID})
})

let h1 = new House ({latitude: 38.89, longitude: -77.03, physicalAddr: "123 abc street", price: 500})
console.log(h1);
console.log("house id is " + h1.hashID);



// same house will give same hashID
// const h1 = new House(1.1, "helllo street", 500000)
// let h2 = new House(1.1, "world street", 500000)
// console.log(h1.hashID);
// console.log(h2.hashID);
// console.log(h1);

// const propertiesMap = new Map();
// propertiesMap.set(h1.hashID, '34ijfioasjfiowfsafasdfjoasdf')
// console.log(propertiesMap.get('dfhlasjflsadf'));
// if(propertiesMap.get(h2.hashID)){
//     console.log("it's defined");
// }