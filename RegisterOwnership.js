// 	To verify the registry: (bitcoin script, OP_RETURN)
// 	verify signature
// 	check if the property has been claimed by anyone 
// 	check if the property really exists 
// 	if all valid, add it to the block
const data = require('./PropertiesIDLists.json')

function verifyRegistration(propertyId){

    // check if the property really exists
    let inList = false;
    data.forEach((d) => {       
        if (d.propertyId === propertyId) {
            console.log("found the property "  + d.propertyId);
            inList = true;
        }
    })

    if(!inList){
        //  throw "Not exist"
        return false;
    }
    return true;
}

module.exports = verifyRegistration;