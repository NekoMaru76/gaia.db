const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

module.exports = (db) => {
  const exp = express();
  
  exp.use(bodyParser.json());
  exp.use(express.static(path.join(__dirname, "public")));
  exp.use("/assets", express.static(path.join(__dirname, "assets")));
  exp.post("/deleteUser", (req, res) => {
    if (typeof req.body.secretKey !== "string" || typeof req.body.username !== "string") return res.send({ code: 401 });
    
    db.dbManager.deleteUser(req.body.username).then(code => res.send({ code })).catch(console.log);
  });
  exp.post("/userInfo", (req, res) => {
    if (typeof req.body.secretKey !== "string" || typeof req.body.username !== "string") return res.send({ code: 401 });
    
    db.dbManager.getMainDataUser(req.body.username).then(data => {
      if (typeof data === "number") return res.send({ code: data });
      
      return res.send({ code: 200, data });
    });
  });
  exp.post("/getUsers", (req, res) => {
    if (typeof req.body.secretKey !== "string") return res.send({ code: 401 });
    
    db.dbManager.getMainData().then(r => {
      if (typeof r === "number") return res.send({ code: r });
      
      return res.send({ users: Object.keys(r.users), code: 200 });
    });
  });
  exp.post("/isValidSecretKey", (req, res) => {
    if (typeof req.body.secretKey !== "string") return res.send({ code: 401 });
    if (req.body.secretKey !== db.settings.secret) return res.send({ code: 412 })
    
    return res.send({ code: 200 });
  });
  exp.post("/register", (req, res) => {
    if (typeof req.body.username !== "string" || typeof req.body.password !== "string" || typeof req.body.secretKey !== "string") return res.send({ code: 401 });
    if (req.body.secretKey !== db.settings.secret) return res.send({ code: 412 });
    
    db.dbManager.createUser(req.body.username, req.body.password).then(r => {return res.send({ code: r });
    });
  });
  
  return exp;
};