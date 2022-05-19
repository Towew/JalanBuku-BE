const { user, book, cart } = require("../../models");

//Menambah Cart
exports.addCart = async (req, res) => {
  try {
    let idUser = req.user.id;

    let data = {
      idUser: idUser,
      idProduct: req.body.idProduct,
      total: 0,
      qty: 0,
    };

    let getProduct = await book.findOne({
      where: {
        id: data.idProduct,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    data = {
      ...data,
      total: getProduct.price,
      qty: 1,
    };

    let addCart = await cart.create(data);

    res.send({
      status: "success",
      addCart,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "Failed",
      message: "Error Adding Cart",
    });
  }
};

//Get All Cart
exports.getCart = async (req, res) => {
  try {
    let idUser = req.user.id;

    let getCart = await cart.findAll({
      where: {
        idUser: idUser,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: [
        {
          model: user,
          as: "user",
          attributes: {
            exclude: ["createdAt", "password", "updatedAt", "id"],
          },
        },
        {
          model: book,
          as: "book",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
    });

    getCart = getCart.map((item) => {
      item.book.bookPdf = process.env.PATH_FILE_PDF + item.book.bookPdf;
      item.book.bookImg = process.env.PATH_FILE_IMG + item.book.bookImg;
      return item;
    });

    res.send({
      status: "Success",
      getCart,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "Failed",
      message: "Error Get Cart",
    });
  }
};

//Delete Cart
exports.deleteCart = async (req, res) => {
  try {
    let { id } = req.params;

    await cart.destroy({
      where: {
        id,
      },
    });

    res.send({
      status: "success",
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "Failed",
      message: "Error Deleting Cart",
    });
  }
};
