const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[imageUrl]"),
    validateListing,
    wrapAsync(listingController.createListing)
  );

router.get("/new", isLoggedIn, listingController.newListingForm);
// router.get("/", wrapAsync(listingController.index));

// create a new listing form
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(isLoggedIn,
    isOwner,
    upload.single("listing[imageUrl]"), 
    validateListing,
    wrapAsync(listingController.updateListing))
  .delete(isLoggedIn, isOwner, listingController.deleteListing);
// show a single listing
// router.get("/:id", wrapAsync(listingController.showListing));

// router.post(
//   "/",
//   isLoggedIn,
//   validateListing,
//   wrapAsync(listingController.createListing)
// );

// edit listing form
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editListingForm)
);
// update listing
// router.put("/:id", isLoggedIn, isOwner, listingController.updateListing);

// delete listing
// router.delete("/:id", isLoggedIn, isOwner, listingController.deleteListing);

module.exports = router;

// create a new listing
// app.get("/testListing", async(req,res) => {
//     const newlisting =  new Listing({
//         title: "Test Listing",
//         description: "This is a test listing",
//         price: 100,
//         location: "Test Location",
//         country: "Test Country"
//     })
//     await newlisting.save()
//         .then(() => res.send("Listing created successfully!"))
//         .catch(err => res.status(400).send("Error creating listing: " + err));
// })
