const express = require("express");
const authCheck = require("../middleware/auth-check");
const eventsData = require("../data/events");
const events = require("../data/events");

const router = new express.Router();

function validateEventsForm(payload) {
  const errors = {};
  let isFormValid = true;
  let message = "";

  payload.age = parseInt(payload.age);

  if (!payload || typeof payload.name !== "string" || payload.name.length < 3) {
    isFormValid = false;
    errors.name = "Name must be more than 3 symbols.";
  }

  if (
    !payload ||
    typeof payload.description !== "string" ||
    payload.description.length < 3
  ) {
    isFormValid = false;
    errors.description = "Description must be more than 3 symbols.";
  }

  if (!payload || !payload.price || payload.price < 0 || payload.price > 100) {
    isFormValid = false;
    errors.price = "Price must be between 0 and 100.";
  }

  if (!isFormValid) {
    message = "Check the form for errors.";
  }

  return {
    success: isFormValid,
    message,
    errors,
  };
}

router.post("/create", authCheck, (req, res) => {
  const event = req.body;
  event.createdBy = req.user.email;

  const validationResult = validateEventsForm(event);
  if (!validationResult.success) {
    return res.status(200).json({
      success: false,
      message: validationResult.message,
      errors: validationResult.errors,
    });
  }

  eventsData.save(event);

  res.status(200).json({
    success: true,
    message: "Event added successfuly.",
    event,
  });
});

router.get("/all", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const search = req.query.search;

  const events = eventsData.all(page, search).map((a) => ({
    id: a.id,
    name: a.name,
    description: a.description,
    price: a.price,
    createdOn: a.createdOn,
  }));

  res.status(200).json(events);
});

router.get("/mine", authCheck, (req, res) => {
  const user = req.user.email;

  const events = eventsData.byUser(user).map((a) => ({
    id: a.id,
    name: a.name,
    description: a.description,
    price: a.price,
    createdOn: a.createdOn,
  }));

  res.status(200).json(events);
});

router.get("/details/:id", authCheck, (req, res) => {
  const id = req.params.id;

  const event = eventsData.findById(id);

  if (!event) {
    return res.status(200).json({
      success: false,
      message: "event does not exists!",
    });
  }

  let response = {
    id,
    name: event.name,
    description: event.description,
    price: event.price,
    createdOn: event.createdOn,
  };

  res.status(200).json(response);
});

router.post("/delete/:id", authCheck, (req, res) => {
  const id = req.params.id;
  const user = req.user.email;

  const event = eventsData.findById(id);

  if (!event || event.createdBy !== user) {
    return res.status(200).json({
      success: false,
      message: "Event does not exists!",
    });
  }

  eventsData.delete(id);

  return res.status(200).json({
    success: true,
    message: "Event deleted successfully!",
  });
});

router.put("/edit/:id", authCheck, (req, res) => {
  const event = req.body;

  const validationResult = validateEventsForm(event);
  if (!validationResult.success) {
    return res.status(200).json({
      success: false,
      message: validationResult.message,
      errors: validationResult.errors,
    });
  }

  eventsData.edit(event);

  res.status(200).json({
    success: true,
    message: "Event edited successfuly.",
    event,
  });
});

module.exports = router;
