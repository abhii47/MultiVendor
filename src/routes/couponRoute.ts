import { Router } from "express";
import Auth from "../middlewares/authMiddleware";
import { allowRoles } from "../middlewares/roleMiddleware";
import { createCoupon, deleteCoupon } from "../controllers/couponController";
import { createCouponValidation, paramsValidation } from "../utils/validation";
import { validationError } from "../middlewares/validationMiddleware";

const router = Router();

router.post('/create',Auth,allowRoles([1,2]),createCouponValidation,validationError,createCoupon);
router.delete('/:id',Auth,allowRoles([1,2]),paramsValidation,validationError,deleteCoupon);

export default router;