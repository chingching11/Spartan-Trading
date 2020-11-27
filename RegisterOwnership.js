// 	To verify the registry: (bitcoin script, OP_RETURN)
// 	verify signature
// 	check if the property has been claimed by anyone 
// 	check if the property really exists 
// 	if all valid, add it to the block

function verifyRegistration(block, propertyId, clientId){
    
    //check if the property has been claimed by anyone
    if(block.properties.get(propertyId)){
        return false;
    } 

    

}