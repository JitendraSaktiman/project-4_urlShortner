const URLMODEL = require("../Models/URLModel")
const validUrl = require('valid-url')
const shortid = require('shortid');


//.............................................PHASE (1) ShortenUrl........................................................


const shotrenUrl = async (req, res) => {
  try {

    const data = req.body;
    const longUrl=req.body.longUrl
    let obj={};

    const baseUrl= "http://localhost:3000"
    if (Object.keys(data).length == 0) {
      return res.status(400).send({ status: false, message: "Feild Can't Empty.Please Enter Some Details" });
    }

    if (!validUrl.isUri(baseUrl)) {
      return res.status(400).send({ status: false, message: "Invalid baseUrl" });
    }
    if (!longUrl) {
      return res.status(400).send({ status: false, message: "Please Enter longUrl" });
    }
    obj.longUrl=longUrl

    if (!validUrl.isUri(longUrl)) {
      return res.status(400).send({ status: false, message: "Invalid longUrl" });
    }

    const urlCode = shortid.generate()
    if(urlCode){
      obj.urlCode=urlCode.toLowerCase()
    }

    const shortUrl = baseUrl + '/' + urlCode
      if(shortUrl){
        obj.shortUrl=shortUrl
      }
      const findURLandCODE= await URLMODEL.findOne({ longUrl:longUrl});

      if(findURLandCODE){
        return res.status(400).send({ status: false, message: findURLandCODE});
      }

      const Urldata = await URLMODEL.create(obj);
    return res.status(201).send({ status: true, message: "Success", data:Urldata });
    }

  catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
};

//............................................Get API................................................................

const redirectOriginalUrl = async (req, res) => {
  try {
     const url=req.params.urlCode
     if(url)
     {
      const findUrl = await URLMODEL.findOne({ urlCode:url});
      if(!findUrl)
      {
        return res.status(404).send({ status: false, message: "Page Not Found" });
      }
        return res.status(302).redirect(findUrl.longUrl);
     }
    }

    catch (err) {
      res.status(500).send({ status: false, error: err.message });
    }
  };



module.exports.shotrenUrl = shotrenUrl
module.exports.redirectOriginalUrl = redirectOriginalUrl
