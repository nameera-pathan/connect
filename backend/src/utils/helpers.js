const validator = require('validator')

const validateRegistrationData = (data) =>{
    const {name, email, picture, status, password, hashname} = data
    if(name==='' || email==='' || password==='') throw new Error('All fields are mandatory!')
    if(!name && !email && !password && !hashname) throw new Error('All fields are mandatory!')
    if(!validator.isEmail(email)) throw new Error('Invalid email')
    if(!validator.isStrongPassword(password)) throw new Error('password should be of uppercase, lowercase and atleast one special character')   
}

const validateLogin = (data) => {
    const { email } = data
    if(!email) throw new Error('Invalid credentials!')
    else if(email && !validator.isEmail(email)) throw new Error('Invalid email!')
}

module.exports ={validateRegistrationData, validateLogin}  


