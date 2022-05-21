const { user, profile, book } = require("../../models");
const cloudinary = require("../utils/cloudinary");

exports.getProfile = async (req, res) => {
  try {
    let { id } = req.user;

    let data = await profile.findOne({
      raw: true,
      where: {
        idUser: id,
      },
      include: {
        model: user,
        as: "user",
        attributes: {
          exclude: ["createdAt", "password", "updatedAt", "id"],
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (data.avatar) {
      data = {
        ...data,
        avatar: process.env.PATH_FILE + data.avatar,
      };
    }

    res.send({
      status: "success",
      data: {
        profile: data,
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "Failed",
      message: "Get Profile Failed",
    });
  }
};
//tes
exports.updateProfile = async (req, res) => {
  try {
    const { id } = req.user;

    let data = {
      gender: req?.body?.gender,
      phone: req?.body?.phone,
      address: req?.body?.address,
    };

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "WaysBook_profile",
        use_filename: true,
        unique_filename: false,
      });

      data = {
        ...data,
        avatar: result.public_id,
      };

      await profile.update(data, {
        where: {
          idUser: id,
        },
      });
    } else {
      await profile.update(data, {
        where: {
          idUser: id,
        },
      });
    }

    res.send({
      status: "success",
      data,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "Failed",
      message: "Edit Profile Failed",
    });
  }
};
