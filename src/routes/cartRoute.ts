import { Router } from "express";
import Auth from "../middlewares/authMiddleware";
import { allowRoles } from "../middlewares/roleMiddleware";
import { addCartValidation, paramsValidation } from "../utils/validation";
import { validationError } from "../middlewares/validationMiddleware";
import { addCart, getCart, removeCart } from "../controllers/cartController";

const router = Router();

router.post('/create',Auth,allowRoles([3]),addCartValidation,validationError,addCart);
router.get('/',Auth,allowRoles([3]),getCart);
router.delete('/:id',Auth,allowRoles([3]),paramsValidation,validationError,removeCart);

export default router;