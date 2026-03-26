import { Router } from "express";
import Auth from "../middlewares/authMiddleware";
import { allowRoles } from "../middlewares/roleMiddleware";
import { createProfile, getProfile, updateProfile, vendorDashboard, verifyVendor } from "../controllers/vendorController";
import { createProfileValidation, paramsValidation, updateProfileValidation } from "../utils/validation";
import { validationError } from "../middlewares/validationMiddleware";

const router = Router();

router.post('/profile',Auth,allowRoles([2]),createProfileValidation,validationError,createProfile);
router.get('/profile',Auth,allowRoles([2]),getProfile);
router.put('/profile',Auth,allowRoles([2]),updateProfileValidation,validationError,updateProfile);
router.get('/verify/:id',Auth,allowRoles([1]),paramsValidation,validationError,verifyVendor);
router.get('/dashboard',Auth,allowRoles([2]),vendorDashboard);

export default router;