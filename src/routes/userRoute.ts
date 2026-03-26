import { Router } from "express";
import { deleteUser, getUsers } from "../controllers/userController";
import Auth from "../middlewares/authMiddleware";
import { allowRoles } from "../middlewares/roleMiddleware";
import { getUserProductValidation, paramsValidation } from "../utils/validation";
import { validationError } from "../middlewares/validationMiddleware";

const router = Router();

// router.get('/',Auth,allowRoles([1]),getUsers);
router.post('/search',Auth,allowRoles([1]),getUserProductValidation,validationError,getUsers);
router.delete('/:id',Auth,allowRoles([1]),paramsValidation,validationError,deleteUser);

export default router;