if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const Listing = require("./models/listing.js");
const User = require("./models/user.js");

// Routes
const listings = require("./routes/listings.js");
const reviews = require("./routes/reviews.js");
const user = require("./routes/user.js");

// Database connection
// const connection = "mongodb://127.0.0.1:27017/Wonderlust";
const connection = process.env.MONGODB_URL;
main()
  .then(() => {
    console.log("Connected to MongoDB successfully!");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(connection);
}

// View engine & Middleware setup
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const store = MongoStore.create({
  mongoUrl: connection,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", () => {
  console.log("Error in session store");
});

// Session setup
const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

// Passport setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash messages and currentUser middleware
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

// Routes
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/", user);

// Search route
app.get("/search", async (req, res) => {
  const { location } = req.query;
  const listings = await Listing.find({ location: new RegExp(location, "i") });
  res.render("listings/searchResults", { listings, location });
});

app.get("/", require("./controllers/listings.js").index);
// 404 handler
app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});
// Error handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

// Start server
const port = 8080;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
