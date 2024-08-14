const express = require("express");
const { check } = require("express-validator");

const placeController = require("../controllers/places-controllers");
const fileUpload = require('../middleware/file-upload')
const checkAuth = require('../middleware/check-auth')

const router = express.Router();
// middlewares in certain request parameter are executed from left to right
router.get("/:pid", placeController.getPlaceById);

router.get("/user/:uid", placeController.getPlacesByUserId);

// request above are accessible to everyone and below require authorization
router.use(checkAuth)   // checks for authentication then forwards the request

router.post(
  "/",
  fileUpload.single('image'),
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  placeController.createPlace
);

router.patch("/:pid",
    [
        check("title").not().isEmpty(),
        check("description").isLength({ min: 5 })
    ],
    placeController.updatePlace);

router.delete("/:pid", placeController.deletePlace);

module.exports = router;
