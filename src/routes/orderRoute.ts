import { Router } from "express";
import Auth from "../middlewares/authMiddleware";
import { allowRoles } from "../middlewares/roleMiddleware";
import { addCard, cancelOrder,createOrder, createPayment, deliverOrder, getOrder } from "../controllers/orderController";
import { createPaymentValidation, paramsValidation } from "../utils/validation";
import { validationError } from "../middlewares/validationMiddleware";

const router = Router();

router.post('/',Auth,allowRoles([3]),createOrder);
router.post('/add-card',Auth,allowRoles([3]),addCard);
router.post('/create-payment',Auth,allowRoles([3]),createPaymentValidation,validationError,createPayment);
router.get('/listorder',Auth,allowRoles([3]),getOrder);
router.put('/cancel/:id',Auth,allowRoles([3]),paramsValidation,validationError,cancelOrder);
router.patch('/deliver/:id',Auth,allowRoles([1]),paramsValidation,validationError,deliverOrder);

export default router;