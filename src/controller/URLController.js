const URLMODEL = require("../Models/URLModel")
const validUrl = require('valid-url')
const shortid = require('shortid');
const redis = require("redis");

//............................................Connection for Redis..............................................................................


const { promisify } = require("util");

//Connect to redis
const redisClient = redis.createClient(
  19232,
  "redis-19232.c301.ap-south-1-1.ec2.cloud.redislabs.com",
  { no_ready_check: true }
);
redisClient.auth("oHjWrRNVpK78lqi3t7lzvLO4vi9xc6O2", function (err) {
  if (err) throw err;
});

redisClient.on("connect", async function () {
  console.log("Connected to Redis..");
});



//1. connect to the server
//2. use the commands :

//Connection setup for redis

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);


//.............................................PHASE (1) ShortenUrl.....................................................


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

       let cachedurldata= await GET_ASYNC(`${urlCode}`)

      if(cachedurldata){
        return res.status(200).send(JSON.parse(cachedurldata));
       }

       const findURLandCODE= await URLMODEL.findOne({ longUrl:data.longUrl});
       if(findURLandCODE){
        const savecachedata=await SET_ASYNC(`${findURLandCODE.urlCode}`,JSON.stringify(findURLandCODE))
        console.log(savecachedata)
         return res.status(400).send({ status: true, message: findURLandCODE});
         }

    //create shortUrl
    const Urldata = await URLMODEL.create(obj);
    return res.status(201).send({ status: true, message: "Success", data: Urldata });

  }
  /* return res.status(201).send({ status: true, message: "Success", data: savecachedata }); */

  catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
};

//---------------------------------------------------------get API--------------------------------------------------------

const redirectOriginalUrl = async (req, res) => {
  try {
     const url=req.params.urlCode
     if(url){
       const validshortid=shortid.isValid(req.params.urlCode)
       console.log(validshortid)
     if(!validshortid){
      return res.status(400).send({ status: false, message: "Invalid! UrlCode" });

     }}


     // CACHING
      let cachedurldata= await GET_ASYNC(`${req.params.urlCode}`)
        /* console.log(cachedurldata) */

      // IF KEY -"VALUE OF URLCODE" IS PRESENT IN CACHE MEMORY
         if(cachedurldata){
          return res.status(302).redirect(JSON.parse(cachedurldata).longUrl);
         }


         //IF NOT FIND IN CACHE MEMORY THEN IT START FINDING IN MONGODB
          const findUrl = await URLMODEL.findOne({urlCode:req.params.urlCode})


         // IF FIND ONE FUNCTION RETURNS NULL
           if(!findUrl){
            return res.status(404).send({ status: false, message: "Page No Found" });
          }

          // USING SET TO ASSIGN NEW KEY VALUE PAIR IN CACHE
           await SET_ASYNC(`${req.params.urlCode}`,JSON.stringify(findUrl.longUrl))
           return res.status(302).redirect(findUrl.longUrl);
      }

    catch (err) {
      res.status(500).send({ status: false, error: err.message });
    }
  };



module.exports.shotrenUrl = shotrenUrl
module.exports.redirectOriginalUrl = redirectOriginalUrl
