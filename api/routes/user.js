const User = require("../../models/User");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
const bcrypt=require("bcrypt");

const salt=10;
const router = require("express").Router();

router.put("/:id", verifyTokenAndAuthorization,async (req,res) =>{
    if(req.body.password)
    {
        req.body.password= bcrypt.hashSync(req.body.password,salt);
    }
    try{
        const updatedUser = await User.findByIdAndUpdate(req.params.id,{
          $set: req.body  
        },{new:true});
        res.status(200).json(updatedUser);
    }
    catch(err){
       res.status(500).json(err);
    }
})

router.delete("/:id",verifyTokenAndAuthorization, async(req,res)=>{
    try{
      await User.findByIdAndDelete(req.params.id)
      alert("User has been deleted")
      res.status(200).json("User has been deleted..")
    }catch(err){
        res.status(500).json(err);
    }
})

router.get("/find/:id", verifyTokenAndAdmin, async(req,res) => {
    try{
       const user = await User.findById(req.params.id);
       const { password, ...others} = user._doc;
       res.status(200).json(others);
    }
    catch(err){
      res.status(500).json(err);
    }
})

router.get("/", verifyTokenAndAdmin, async(req,res) => {
    const query = req.query.new;
    try{
       const users = query? await User.find().sort({id:-1}).limit(5): await User.find(req.params.id);
       res.status(200).json(users);
    }
    catch(err){
      res.status(500).json(err);
    }
})

router.get("/stats", verifyTokenAndAdmin, async(req,res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear()-1));
    try{
      const data= await User.aggregate([
        {$match : {createdAt: {$gte : lastYear} }},
        {
           $project: {$month: "$createdAt"}, 
        },
        {
           $group:{
             _id: "$month",
             total: {$sum:1},
           }
        }
      ])
     res.status(200).json(data);
    }catch(err){
        res.status(500).json(err);
    }
})


module.exports = router;