"use strict"
//create property id from the PropertiesLists.json and push the ids to the PropertiesIDLists.json

const fs = require('fs')
const House = require('./House')
const data = require('./PropertiesLists.json')

let propertyIdLists = []

data.forEach((d) => {
    let e = new House(d);
    console.log(e.hashID);
    propertyIdLists.push({propertyId: e.hashID})
})

let json = JSON.stringify(propertyIdLists)
fs.writeFile('PropertiesIDLists.json', json, (err) =>{
    if (err) throw err
})