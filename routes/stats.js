const express = require("express");
const eventsData = require("../data/events");
const usersData = require("../data/users");

const router = new express.Router();

router.get("/", (req, res) => {
  const animals = eventsData.total();
  const users = usersData.total();

  res.status(200).json({
    animals,
    users,
  });
});

module.exports = router;
