import { Router } from "express";
import Auth from "../middlewares/authMiddleware";
import { allowRoles } from "../middlewares/roleMiddleware";
import { adminDash, getTopRatedProducts, getTopSellProducts } from "../controllers/adminController";
// import { oldUserInStripe } from "../services/adminService";

const router = Router();

router.get('/dashboard',Auth,allowRoles([1]),adminDash);
router.get('/topsell',Auth,allowRoles([1]),getTopSellProducts);
router.get('/toprated',Auth,allowRoles([1]),getTopRatedProducts);
// router.post('/stripe-custmor',Auth,allowRoles([1]),oldUserInStripe);

export default router;