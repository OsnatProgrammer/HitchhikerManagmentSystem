const express= require("express");
const path = require("path");
const router = express.Router();

router.get("/" , (req,res)=> {
  res.json({msg:"Upload work!"})
})

router.get('/uploads/:filename', (req, res) => {
  res.sendFile(req.params.filename, {root: path.join(__dirname, '/uploads')});
  })

router.post("/", async(req,res) => {
  let myFile = req.files["myFile22"];

  if(!myFile){
    return res.status(400).json({msg:"You need to send file"});
  }
  if(myFile.size > 1024 * 1024 * 2){
    return res.status(400).json({msg:"File too big (max 2mb)"});
  }
  // סיומות שמותר למשתמש לעלות
  let exts_ar = [".png",".jpg",".jpeg",".gif"];
  // יכיל את הסיומת של הקובץ ששלחתי לשרת
  let extFileName = path.extname(myFile.name);
 
  if(!exts_ar.includes(extFileName)){
    return res.json({msg:"File ext not allowed , just img file for web !"})
  }

  myFile.mv("public/images/"+myFile.name,(err) => {
    if(err){
      console.log(err)
      return res.status(400).json({msg:"There problem"});
    }
    let user = 
    console.log(myFile.name);
    res.status(201).json(myFile)
  })
})

module.exports = router;