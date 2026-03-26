import { Router } from "express";
import Auth from "../middlewares/authMiddleware";
import { upload } from "../middlewares/uploadMiddleware";
import { createProduct, deleteProduct, getProducts, getUserProducts } from "../controllers/productController";
import { getUserProductValidation, paramsValidation, updateProductValidation } from "../utils/validation";
import { validationError } from "../middlewares/validationMiddleware";
import { allowRoles } from "../middlewares/roleMiddleware";

const router = Router();

//for vendor
router.post('/',Auth,allowRoles([2]),upload({folder:'products',type:'single'}),updateProductValidation,validationError,createProduct);
router.get('/',Auth,allowRoles([2]),getProducts);
router.delete('/:id',Auth,allowRoles([2]),paramsValidation,validationError,deleteProduct);

//for users
// router.get('/user-product',Auth,allowRoles([3]),getUserProducts); //basic
router.post('/search-product',Auth,allowRoles([3]),getUserProductValidation,validationError,getUserProducts); // advanced with filter,search & pagination

export default router;