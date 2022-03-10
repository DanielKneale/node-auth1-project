/*
  If the user does not have a session saved in the server

  status 401
  {
    "message": "You shall not pass!"
  }
*/
const restricted = (req,res,next) =>{
  if(req.session && req.session.user){
    next()
  }else{
    res.status(401).json({"message": "You shall not pass!"})
  }
}

/*
  If the username in req.body already exists in the database

  status 422
  {
    "message": "Username taken"
  }
*/
const checkUsernameFree = (req,res,next) =>{
  try{
    const rows = await findBy({username:req.body.username})
    if(rows.length){
        req.userData = rows[0] 
        next()
    }else{
        res.status(401).json("Username does not exist")
    }
}catch(e){
    res.status(500).json(`Server error: ${e.message}`)
}
}

/*
  If the username in req.body does NOT exist in the database

  status 401
  {
    "message": "Invalid credentials"
  }
*/
const checkUsernameExists = (req,res,next) =>{
  if(!req.body.username){
    res.status(401).json("Username and password required!")
}else{
    next()
}
}

/*
  If password is missing from req.body, or if it's 3 chars or shorter

  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
*/
const checkPasswordLength = (req,res,next) =>{
  if(!req.body.password){
    res.status(401).json("password required!")
}else if(req.body.password.length < 8){
    res.status(401).json("password must be 8 or more characters")
}else{
    next()
}
}

// Don't forget to add these to the `exports` object so they can be required in other modules

module.exports = {
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength
}