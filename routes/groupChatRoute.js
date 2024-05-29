const express = require("express");
const Group = require("../models/Groupchat");
const { authenticateUser } = require("../middlewares/authMiddleware");

const router = express.Router();


router.post("/create", authenticateUser, async (req, res) => {
  const { name } = req.body;
  const group = new Group({ name, members: [req.userId] });
  await group.save();
  res.status(201).send(group);
});

router.get("/", authenticateUser, async (req, res) => {
  const groups = await Group.find({ members: req.userId });
  res.send(groups);
});

router.post("/join", authenticateUser, async (req, res) => {
  const { groupId } = req.body;
  console.log("groupId:", groupId); 
  console.log("req.user._id:", req.user._id); 

  const group = await Group.findById(groupId);
  if (!group) return res.status(404).send({ error: "Group not found" });

  if (!group.members.includes(req.user._id)) {
    group.members.push(req.user._id);
    await group.save();
  }

  res.send(group);
});


module.exports = router;
