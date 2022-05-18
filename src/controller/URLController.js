const URLMODEL = require("../Models/URLModel")
const validUrl = require('valid-url')
const shortid = require('shortid');


//.............................................PHASE (1) ShortenUrl........................................................


const shotrenUrl = async (req, res) => {
  try {

    //get data from body
    let data = req.body;

    let obj = {};

    //server
    const baseUrl = "http://localhost:3000"

    //check request body
    if (Object.keys(data).length == 0) {
      return res.status(400).send({ status: false, message: " sorry body can not be empty" });
    }

    //using validation
    if (!validUrl.isUri(baseUrl)) {
      return res.status(400).send({ status: false, message: "Invalid baseUrl" });
    }
    if (!data.longUrl) {
      return res.status(400).send({ status: false, message: "Please Enter longUrl" });
    }
    //set data inside obj.longurl
    obj.longUrl = data.longUrl

    if (!validUrl.isUri(data.longUrl)) {
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
      const findURLandCODE= await URLMODEL.findOne({ longUrl:data.longUrl});

      if(findURLandCODE){
        return res.status(400).send({ status: true, message: findURLandCODE});
      }

    //create shortUrl
    const Urldata = await URLMODEL.create(obj);
    return res.status(201).send({ status: true, message: "Success", data: Urldata });
  }

  catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
};

//--------------------------------------------------get API---------------------------------------------------

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
