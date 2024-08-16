import { Router } from "express";
import {
  Register,
  Login,
  Auth,
  addContacts,
  getContacts,
  deleteContact,
  updateContact,
  getContact,
} from "../controllers/user.controller.js";
import { body } from "express-validator";

import verifyMiddleware from "../middlewares/verify.middleware.js";

const router = Router();

router
  .route("/register")
  .post(
    [
      body("name")
        .trim()
        .isLength({ min: 3, max: 15 })
        .notEmpty()
        .withMessage("Name should have minimum 3 characters"),
      body("email").trim().isEmail().notEmpty().withMessage("invalid email"),
      body("password")
        .trim()
        .isLength({ min: 8, max: 15 })
        .notEmpty()
        .withMessage("Password should have minimum 8 characters"),
    ],
    Register
  );
router
  .route("/login")
  .post(
    [body("email").trim().isEmail().notEmpty().withMessage("invalid email")],
    Login
  );

router.route("/verify").get(verifyMiddleware, Auth);
router.route("/add-contact").post(verifyMiddleware, addContacts);
router.route("/get-contacts").get(verifyMiddleware, getContacts);
router.route("/delete-contact/:id").delete(verifyMiddleware, deleteContact);
router.route("/update-contact/:id").put(verifyMiddleware, updateContact);
router.route("/get-contact/:id").get(verifyMiddleware, getContact);

export { router as Router };
