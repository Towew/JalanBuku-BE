const express = require("express");
const { auth } = require("../middlewares/auth.js");
const { regUser, logUser, checkAuth } = require("../controllers/auth");
const {
  getBooks,
  addBooks,
  getBook,
  updateBooks,
  promoBooks,
} = require("../controllers/book.js");
const { uploadImg } = require("../middlewares/uploadFile.js"); // One Image for Profile
const { uploadFiles } = require("../middlewares/uploadFiles.js"); // Multiple Files
const { getProfile, updateProfile } = require("../controllers/profile.js");
const { addCart, getCart, deleteCart } = require("../controllers/cart.js");
const {
  addTransaction,
  getTrxs,
  notification,
} = require("../controllers/transaction.js");
const {
  getPurchased,
  getOnePurchased,
} = require("../controllers/purchased.js");

const router = express.Router();

//Route Auth
router.post("/register", regUser);
router.post("/login", logUser);
router.get("/check-auth", auth, checkAuth);

//Route Books
router.get("/books", getBooks);
router.get("/promo-books", promoBooks);
router.get("/book/:id", auth, getBook);
router.post("/book", auth, uploadFiles("bookPdf", "bookImg"), addBooks);
router.patch("/book/:id", auth, uploadFiles("bookPdf", "bookImg"), updateBooks);

//Route Profile
router.get("/profile", auth, getProfile);
router.patch("/profile", auth, uploadImg("avatar"), updateProfile);

//Route Cart
router.post("/cart", auth, addCart);
router.get("/carts", auth, getCart);
router.delete("/cart/:id", auth, deleteCart);

//Route Transaction
router.post("/transaction", auth, addTransaction);
router.get("/transactions", auth, getTrxs);
router.post("/notification", notification);

//Route Purchased Book
router.get("/purchased-books", auth, getPurchased);
router.get("/purchased/:id", auth, getOnePurchased);

module.exports = router;
