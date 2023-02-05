const express = require("express");
const {
  createContact,
  getContacts,
  current,
  updateAvatar,
  verifyMail,
  repeatVerifyMail,
} = require("../../controllers/user.controller");

const {
  auth,
  upload,
  resizeAvatar,
  validateBody,
} = require("../../middlewares/index");
const { tryCatchWrapper } = require("../../helpers");
const { repeatVerifyMailSchema } = require("../../schemas/users");
const userRouter = express.Router();

userRouter.post(
  "/contacts",
  tryCatchWrapper(auth),
  tryCatchWrapper(createContact)
);
userRouter.get(
  "/contacts",
  tryCatchWrapper(auth),
  tryCatchWrapper(getContacts)
);
userRouter.get("/current", tryCatchWrapper(auth), tryCatchWrapper(current));
userRouter.patch(
  "/avatars",
  tryCatchWrapper(auth),
  upload.single("avatar"),
  tryCatchWrapper(resizeAvatar),
  tryCatchWrapper(updateAvatar)
);
userRouter.get("/verify/:verificationToken", tryCatchWrapper(verifyMail));
userRouter.post(
  "/verify/",
  validateBody(repeatVerifyMailSchema),
  tryCatchWrapper(repeatVerifyMail)
);
module.exports = { userRouter };
