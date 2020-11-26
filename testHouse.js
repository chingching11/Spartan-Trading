const House = require('./House')

const h1 = new House(1.1, "helllo street", 500000, "5455441561545413515454131")

console.log(h1.hashID);
h1.sign("dfgjdfhgdafhgdasjfnsadkfnksdanfksa00")
console.log(h1.signature);