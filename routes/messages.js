const express = require("express");
const { MessageModel } = require("../models/messageModel");
const { auth,authadmin} = require("../middlewares/auth");
const router = express.Router();

router.get("/getMessageByIdSend/:idSend", async (req, res) => {
    let idSend = req.params.idSend;

    try {
        let data = await MessageModel.find({ user_idSend: idSend });
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "There is an error, please try again later", err });
    }

})

router.get("/getMessageByIdRecive/:idReceive", async (req, res) => {
    let idReceive = req.params.idReceive;

    try {
        let data = await MessageModel.find({ user_idReceive: idReceive });
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "There is an error, please try again later", err });
    }
})


router.get("/getMessageByMessageId/:messageId", async (req, res) => {
    const messageId = req.params.messageId;
  
    try {
      const message = await MessageModel.findById(messageId);
      res.json(message);
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "There is an error, please try again later", error });
    }
  });
  
router.post("/addMessage", auth, async (req, res) => {

    try {
        let newMessage = new MessageModel(req.body);
        newMessage.user_idSend = req.tokenData._id;
        await newMessage.save();
        res.status(201).json(newMessage)
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
})




// Endpoint to update the status of a message
router.patch("/changeMessageStatus/:id", async (req, res) => {
    const messageId = req.params.id;
    
    try {
      // Find the message by ID
      const message = await MessageModel.findById(messageId);
      console.log("found the message")
      // Update the status to true/false
      //______________________________
      message.status = !message.status;
    //   message.status = true;
      
      // Save the updated message
      //_____________________________
      await message.save();
    // let data = await MessageModel.updateOne({ _id: messageId }, { status: !message.status });

      res.status(200).json({ message: 'Status updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update status' });
    }
  });
  

  router.post("/addMessageSystem", async (req, res) => {

    try {
        let newMessage = new MessageModel(req.body);
        newMessage.user_idSend = "0";
        await newMessage.save();
        res.status(201).json(newMessage)
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
})


module.exports = router;