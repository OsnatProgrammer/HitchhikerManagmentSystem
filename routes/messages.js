const express = require("express");
const { MessageModel } = require("../models/messageModel");
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


module.exports = router;