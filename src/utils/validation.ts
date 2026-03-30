import {body, cookie, param} from 'express-validator';

// *************************************** Common Validation **********************************

export const paramsValidation = [
    param('id')
    .notEmpty().withMessage("param is required")
    .bail().toInt()
    .isInt().withMessage("Param must be integer"),
]

// *************************************** Auth Validation *************************************

export const registerValidation = [
    body('name')
    .notEmpty().withMessage("Name is required")
    .bail().trim()
    .isString().withMessage("Name must be string"),

    body('email')
    .notEmpty().withMessage("Email is required")
    .bail().trim().normalizeEmail()
    .isEmail().withMessage("Check Email format"),

    body('password')
    .notEmpty().withMessage('Password is required')
    .bail().trim()
    .isLength({min:6}).withMessage("Minimum 6 char required"),

    body('role')
    .notEmpty().withMessage("Role is required 2:Vendor 3:User")
    .bail()
    .isInt().withMessage("Role must be integer 2:Vendor 3:User")
]

export const forgetPassVaidation = [
    body('email')
    .notEmpty().withMessage("email is required")
    .trim().normalizeEmail()
    .bail()
    .isEmail().withMessage("Check Email Format"),
]

export const resetPassValidation = [
    body('email')
    .notEmpty().withMessage("Email is required")
    .trim().normalizeEmail()
    .bail()
    .isEmail().withMessage("Check email format"),

    body('otp')
    .notEmpty().withMessage("Otp is required")
    .trim().bail()
    .isNumeric().withMessage('Otp must contain only numbers')
    .bail()
    .isLength({min:6,max:6}).withMessage("Otp must be exactly 6 digits"),

    body('newpass')
    .notEmpty().withMessage("Password required")
    .bail()
    .trim()
    .isLength({min:6}).withMessage("Password has minimum 6 chars"),

    body('confirmpass')
    .notEmpty().withMessage("Confirm password required")
    .bail()
    .trim()
    .isLength({min:6}).withMessage("Password has minimum 6 chars"),

]

export const loginValidation = [
    body('email')
    .notEmpty().withMessage("Email is required")
    .bail()
    .trim()
    .normalizeEmail()
    .isEmail().withMessage("Check email format"),

    body('password')
    .notEmpty().withMessage("Password required")
    .bail()
    .trim()
    .isLength({min:6}).withMessage("Password has minimum 6 chars")

]

export const refreshValidation = [
    cookie('refreshToken')
    .exists()
    .withMessage("refresh Token is required"),
]

export const changePasswordValidation = [
    body('password')
    .notEmpty().withMessage("Change Password required")
    .bail()
    .trim()
    .isLength({min:6}).withMessage("Password has minimum 6 chars"),

    body('existpass')
    .notEmpty().withMessage("Existing Password required")
    .bail()
    .trim()
    .isLength({min:6}).withMessage("Password has minimum 6 chars")
]

// ************************************** Vendor Validation ****************************************

export const createProfileValidation = [
    body('shopname')
    .notEmpty().withMessage("Shop name required")
    .bail()
    .isString().withMessage("Shop name invalid format"),

    body('city')
    .notEmpty().withMessage("City name required")
    .bail()
    .isString().withMessage("City name must be string"),

    body('state')
    .notEmpty().withMessage("State name required")
    .bail()
    .isString().withMessage("State name must be string"),
]

export const updateProfileValidation = [
     body('shopname')
    .optional()
    .isString().withMessage("Shop name invalid format"),

    body('city')
    .optional()
    .isString().withMessage("City name must be string"),

    body('state')
    .optional()
    .isString().withMessage("State name must be string"),
]

//**************************************** Category Validation **************************************

export const createCategoryValidation = [
    body('name')
    .notEmpty().withMessage('category name is required')
    .trim().bail()
    .isString().withMessage('category must be string'),
]


//*************************************** Product Validation ****************************************

// export const createProductValidation = [
//     body('name')
//     .notEmpty().withMessage('Name is required')
//     .bail()
//     .isString().withMessage('Name must be string'),

//     body('category')
//     .notEmpty().withMessage('Category is required')
//     .bail().toInt()
//     .isInt().withMessage("Category must be integer"),

//     body('price')
//     .notEmpty().withMessage("Price is required")
//     .bail().toInt()
//     .isInt().withMessage('Price must be integer')
//     .custom((value)=>{
//         if(value<1)throw new ApiError("Price value can't be negative",422);
//         return true;
//     }),

//     body('quantity')
//     .notEmpty().withMessage("Qauntity is required")
//     .bail().toInt()
//     .isInt().withMessage('Qauntity must be integer')
//     .custom((value)=>{
//         if(value<1)throw new ApiError("Stock value can't be negative",422);
//         return true;
//     }),

// ]

export const updateProductValidation = [
    body('productId')
    .notEmpty().withMessage("Product Id is required")
    .bail().toInt()
    .isInt({min:0}).withMessage("Product Id must be integer"),

    body('name')
    .optional()
    .notEmpty().withMessage('Name is required')
    .bail()
    .isString().withMessage('Name must be string'),

    body('category')
    .optional()
    .notEmpty().withMessage('Category is required')
    .bail().toInt()
    .isInt().withMessage("Category must be integer"),

    body('price')
    .optional()
    .toInt()
    .isInt({min:1}).withMessage("Price must be integer"),

    body('quantity')
    .optional()
    .toInt()
    .isInt({min:1}).withMessage("Quantity must be integer"),
]
export const getUserProductValidation = [
    body('search')
    .optional()
    .isString().withMessage("Search must be string")
    .trim().bail()
    .isLength({min:2}).withMessage("search must be contain atleast 2 characters"),

    body('category')
    .optional()
    .isInt({min:1}).withMessage('category must be valid number'),

    body('min_price')
    .optional()
    .isInt({min:0}).withMessage("Minimum price must be a positive number"),

    body('max_price')
    .optional()
    .isInt({min:0}).withMessage("Maximum price must be a positive number"),

    body('sort')
    .optional()
    .isIn(['product_id','name','price','quantity','createdAt',])
    .withMessage("Sort must be product_id,name,price,quantity or createdAt"),

    body('page')
    .optional()
    .isInt({min:1}).withMessage("Page must be greater than 0"),

    body('limit')
    .optional()
    .isInt({min:1}).withMessage("Limit must be greater than 0"),
]

//**************************************** Cart Validation ******************************************

export const addCartValidation = [
    body('productId')
    .notEmpty().withMessage("Product Id is required")
    .toInt().bail()
    .isInt().withMessage("Product Id must be integer"),

    body('quantity')
    .notEmpty().withMessage("Quantity is required")
    .toInt().bail()
    .isInt({min:1}).withMessage("Quantity must be integer")
]


//***************************************** User Validation *******************************************

export const getUsersValidation = [
    body('search')
    .optional()
    .isString().withMessage("Search must be string")
    .trim().bail()
    .isLength({min:2}).withMessage("search must be contain atleast 2 characters"),

    body('role')
    .optional()
    .isIn(['admin','vendor','user'])
    .withMessage('role must be admin,vendor or user'),
    
    body('sort')
    .optional()
    .isIn(['user_id','name','email','role','createdAt',])
    .withMessage("Sort must be user_id,name,email,role or createdAt"),

    body('page')
    .optional()
    .isInt({min:1}).withMessage("Page must be greater than 0"),

    body('limit')
    .optional()
    .isInt({min:1}).withMessage("Limit must be greater than 0"),
]

//**************************************** Coupon Validation *******************************************
export const createCouponValidation = [
    body('coupon_type')
    .notEmpty().withMessage('Coupon type is required')
    .trim().bail()
    .isIn(['Percentage','Fixed']).withMessage('Type either Percentage or Fixed '),

    body('amount')
    .notEmpty().withMessage('Amount is required')
    .trim().bail()
    .isInt({min:1}).withMessage("Amount must be Integer"),

    body('max_user')
    .notEmpty().withMessage('Max user limit is required')
    .trim().bail()
    .isInt({min:1}).withMessage("User limit must be Integer"),

    body('products')
    .notEmpty().withMessage("product is requires")
    .bail()
    .isArray({min:1}).withMessage("Give atleast one value"),

    body('expiry')
    .notEmpty().withMessage("Expiry is required")
    .bail()
    .isISO8601().withMessage("yyyy-mm-dd Format required")
    .toDate(),
]

//**************************************** Order Validation ************************************************
// export const addcardValidation = [
//     body('cardNumber')
//     .notEmpty().withMessage('Card number is required')
//     .bail()
//     .isLength({min:16,max:16}).withMessage("Card Number is invalid"),

//     body('expMonth')
//     .notEmpty().withMessage("month expiry is required")
//     .bail()
//     .isInt({min:1,max:12})
//     .withMessage('Invalid Month'),

//     body('expYear')
//     .notEmpty().withMessage("year expiry is required")
//     .bail()
//     .custom((value)=>{
//         const currentyear = new Date().getFullYear();

//         if(value<currentyear){
//             throw new Error("Expiry year cannot be in the past");
//         }
//         return true;
//     }),

//     body('cvc')
//     .notEmpty().withMessage("cvc is required")
//     .isLength({min:3,max:3}).withMessage('Invalid cvc')
// ]

export const createPaymentValidation = [
    body('orderId')
    .notEmpty().withMessage("orderId is required")
    .bail()
    .isInt({min:1}).withMessage("OrderId Invalid"),

    body('cardId')
    .optional().isInt({min:1})
    .withMessage("Card Id is Invalid"),

]