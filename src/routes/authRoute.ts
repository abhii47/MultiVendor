import { Router } from "express";
import { changePasswordValidation, forgetPassValidation, loginValidation, refreshValidation, registerValidation, resetPassValidation } from "../utils/validation";
import { register,login, refresh, logout, changePass, forgotPass, resetPassword } from "../controllers/authController";
import {validationError} from '../middlewares/validationMiddleware';
import Auth from "../middlewares/authMiddleware";
import { authLimiter } from "../middlewares/rateLimiter";

const router = Router();

router.post('/register',authLimiter,registerValidation,validationError,register);
router.post('/forget-password',authLimiter,forgetPassValidation,validationError,forgotPass);
router.post('/reset-password',authLimiter,resetPassValidation,validationError,resetPassword);
router.post('/login',authLimiter,loginValidation,validationError,login);
router.post('/refresh-token',authLimiter,refreshValidation,validationError,refresh);
router.post('/change-password',Auth,changePasswordValidation,validationError,changePass);
router.post('/logout',Auth,logout);

export default router;