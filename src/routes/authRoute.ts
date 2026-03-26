import { Router } from "express";
import { changePasswordValidation, forgetPassVaidation, loginValidation, refreshValidation, registerValidation, resetPassValidation } from "../utils/validation";
import { register,login, refresh, logout, changePass, forgotPass, resetPassword } from "../controllers/authController";
import {validationError} from '../middlewares/validationMiddleware';
import Auth from "../middlewares/authMiddleware";

const router = Router();

router.post('/register',registerValidation,validationError,register);
router.post('/forget-password',forgetPassVaidation,validationError,forgotPass);
router.post('/reset-password',resetPassValidation,validationError,resetPassword);
router.post('/login',loginValidation,validationError,login);
router.post('/refresh-token',refreshValidation,validationError,refresh);
router.post('/change-password',Auth,changePasswordValidation,validationError,changePass);
router.post('/logout',Auth,logout);

export default router;