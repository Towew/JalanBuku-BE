const { book } = require("../../models");
const { Op } = require("sequelize");
const cloudinary = require("../utils/cloudinary");

//Promo Book
exports.promoBooks = async (req, res) => {
  try {
    let data = await book.findAll({
      where: {
        price: {
          [Op.lte]: 55000,
        },
      },
    });

    data = data.map((item) => {
      item.bookPdf = process.env.PATH_FILE + item.bookPdf;
      item.bookImg = process.env.PATH_FILE + item.bookImg;
      return item;
    });

    res.send({
      status: "success",
      data: {
        promoBooks: data,
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "Failed",
      message: "Error Fetching Promo Books",
    });
  }
};

//GET All Books
exports.getBooks = async (req, res) => {
  try {
    let data = await book.findAll({
      raw: true,
      where: {
        price: {
          [Op.gte]: 10,
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    data = data.map((item) => {
      item.bookPdf = process.env.PATH_FILE + item.bookPdf;
      item.bookImg = process.env.PATH_FILE + item.bookImg;
      return item;
    });

    res.send({
      status: "success",
      data: {
        books: data,
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "Failed",
      message: "Error Fetching All Books",
    });
  }
};

//GET One Book
exports.getBook = async (req, res) => {
  try {
    const { id } = req.params;

    let data = await book.findOne({
      raw: true,
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    data = {
      ...data,
      bookPdf: process.env.PATH_FILE + data.bookPdf,
      bookImg: process.env.PATH_FILE + data.bookImg,
    };

    res.send({
      status: "success",
      data: {
        book: data,
      },
    });
  } catch (error) {
    res.send({
      status: "Failed",
      message: "Error Fetching Book",
    });
  }
};

//POST Book
exports.addBooks = async (req, res) => {
  try {
    //Cloudinary Settings
    const resultImg = await cloudinary.uploader.upload(
      req.files.bookImg[0].path,
      {
        folder: process.env.IMG_NAME,
        use_filename: true,
        unique_filename: false,
      }
    );

    const resultPdf = await cloudinary.uploader.upload(
      req.files.bookPdf[0].path,
      {
        folder: process.env.PDF_NAME,
        use_filename: true,
        unique_filename: false,
      }
    );

    let data = {
      title: req.body.title,
      year: req.body.year,
      author: req.body.author,
      pages: req.body.pages,
      ISBN: req.body.ISBN,
      price: req.body.price,
      desc: req.body.desc,
      bookPdf: resultPdf.public_id,
      bookImg: resultImg.public_id,
    };

    let newBook = await book.create(data);

    let newBookData = await book.findOne({
      where: {
        id: newBook.id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    res.send({
      status: "success",
      data: {
        books: {
          ...newBookData.dataValues,
          bookPdf: process.env.PATH_FILE + newBookData.bookPdf,
          bookImg: process.env.PATH_FILE + newBookData.bookImg,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "Failed",
      message: "Error Add Books",
    });
  }
};

//PATCH Book
exports.updateBooks = async (req, res) => {
  try {
    const { id } = req.params;

    let data = {
      price: req.body.price,
    };

    let newBook = await book.update(data, {
      where: {
        id,
      },
    });

    let newBookData = await book.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    res.send({
      status: "success",
      data,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "Failed",
      message: "Error Update Book",
    });
  }
};

//DELETE Book
exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    await book.destroy({
      where: {
        id,
      },
    });

    res.send({
      status: "Delete success",
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "Failed",
      message: "Error Delete Book",
    });
  }
};
