const User = require("../../models/User");
const salt=10;
const bcrypt = require("bcrypt");
const jwt= require("jsonwebtoken");

const router = require("express").Router();
//REGISTER

router.post("/register",async (req,res)=> {
    const newUser = new User({
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password,salt),
        email: req.body.email,
    });
    try {
    const savedUser = await newUser.save();
    console.log(savedUser);
    return res.status(200).json(savedUser);
    } catch (err){
        console.log(err);
        return res.status(400).json(err);
    }
})

//LOGIN
router.post("/login", async(req,res) => {
    try{
      const user = await User.findOne({ username: req.body.username})

      if(!user)
      {
        alert("Wrong credentials")
        return res.json(401).json("Wrong Credentials");
      }

      const passok = bcrypt.compareSync(req.body.password, user.password);

      if(!passok)
      {
        alert("Incorrect Password");
        return res.status(401).json("Wrong Password")
      }

      const accessToken = jwt.sign({
        id:user._id,
        isAdmin: user.isAdmin, 
      },
      process.env.JWT_SEC,
      {expiresIn: "3d"}
      )

      const {password, ...others} = user._doc;

      return res.status(200).json({...others, accessToken})
    }catch(err){
        console.log(err);
        return res.status(400).json(err);
    }
})


module.exports = router;