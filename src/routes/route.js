const express = require('express');
const router = express.Router();
const urlController = require("../controller/URLController");

//user Register
router.post("/url/shorten",urlController.shotrenUrl)
/* router.get('/books',middleware.authentication,bookController.getbooks) */

//If url is Incorrect
router.post("*", (req,res) =>{

    return res.status(404).send({ message:"Page Not Found"})
})
router.get("*", (req,res) =>{
    return res.status(404).send({ message:"Page Not Found"})
})


module.exports = router;