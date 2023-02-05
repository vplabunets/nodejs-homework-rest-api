const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const { CustomError, sendMail } = require("../helpers/index");
const gravatar = require("gravatar");
const { v4 } = require("uuid");

async function register(req, res, next) {
  const { email, password, subscription } = req.body;

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  const uuid = v4();
  try {
    const savedUser = await User.create({
      email,
      password: hashedPassword,
      subscription,
      verificationToken: uuid,
      verified: false,
      avatarURL: gravatar.url(email, { protocol: "https" }),
    });

    await sendMail({
      to: email,
      subject: "Please, confirm your email",
      text: `<a href="localhost:3000/api/user/verify/${uuid}">Confirm email</a>`,
      html: `<a href="localhost:3000/api/user/verify/${uuid}">Confirm email</a>`,
    });

    return res.status(201).json({
      user: {
        email: savedUser.email,
        subscription: savedUser.subscription,
        avatarURL: savedUser.avatarURL,
        verificationToken: savedUser.verificationToken,
      },
    });
  } catch (error) {
    if (error.message.includes("E11000 duplicate key error collection")) {
      return next(new CustomError(409, "User with this email already exists"));
    }
    throw error;
  }
}

// 1. find user by email
// 2. If user not exits ==> throw error 404
// 3. If user exists ==> check password
// 4. if password the same ==> return status 200

async function login(req, res, next) {
  const { email, password } = req.body;
  const storedUser = await User.findOne({
    email,
  });
  if (!storedUser) {
    return next(new CustomError(401, "Email or password is wrong"));
  }

  if (!storedUser.verified) {
    return next(
      new CustomError(
        404,
        "Your email is not verified. Please, check your mail box"
      )
    );
  }

  const isPasswordValid = await bcrypt.compare(password, storedUser.password);
  if (!isPasswordValid) {
    return next(new CustomError(401, "Email or password is wrong"));
  }
  const token = jwt.sign({ id: storedUser._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  return res.json({
    token,
    user: {
      email,
      subscription: storedUser.subscription,
      avatarURL: storedUser.avatarURL,
    },
  });
}

async function logout(req, res, next) {
  try {
    const { _id } = req.body.user;

    const user = await User.findByIdAndUpdate(_id, { token: null });

    if (!user) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }
    return res.status(204).json();
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
}

module.exports = {
  register,
  login,
  logout,
};
