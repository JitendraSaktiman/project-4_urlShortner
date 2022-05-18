const express = require('express');//3
const router = express.Router();//4
const urlController = require("../controller/URLController");


//user Register
router.post("/url/shorten",urlController.shotrenUrl)//5
router.get('/:urlCode',urlController.redirectOriginalUrl)


//If url is Incorrect
router.post("*", (req,res) =>{

    return res.status(404).send({ message:"Page Not Found"})
})
router.get("*", (req,res) =>{
    return res.status(404).send({ message:"Page Not Found"})
})


module.exports = router;