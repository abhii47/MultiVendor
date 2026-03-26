import { Router } from "express";
import { createCategory, deleteCategory, getCategory } from "../controllers/categoryController";
import { createCategoryValidation, paramsValidation } from "../utils/validation";
import { validationError } from "../middlewares/validationMiddleware";
import Auth from "../middlewares/authMiddleware";
import { allowRoles } from "../middlewares/roleMiddleware";

const router = Router();

router.post('/',Auth,allowRoles([1]),createCategoryValidation,validationError,createCategory);
router.get('/',Auth,getCategory);
router.delete('/:id',Auth,allowRoles([1]),paramsValidation,validationError,deleteCategory);

export default router;