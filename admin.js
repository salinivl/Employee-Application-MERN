const bcrypt=require('bcrypt')

const adminPassword="Admin12*"

const hashedpassword=bcrypt.hashSync(adminPassword, 10)
console.log(hashedpassword);