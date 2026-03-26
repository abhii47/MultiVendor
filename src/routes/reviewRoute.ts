import { Router } from "express";
import Auth from "../middlewares/authMiddleware";
import { allowRoles } from "../middlewares/roleMiddleware";
import { deleteReview, postReview } from "../controllers/reviewController";
import { paramsValidation } from "../utils/validation";
import { validationError } from "../middlewares/validationMiddleware";
import { upload } from "../middlewares/uploadMiddleware";

const router = Router();

router.post('/',Auth,allowRoles([3]),upload({folder:'reviews',type:'array'}),postReview);
router.delete('/:id',Auth,allowRoles([3]),paramsValidation,validationError,deleteReview);

export default router;