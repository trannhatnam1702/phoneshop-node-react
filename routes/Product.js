import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMidw.js";
import { brainTreePaymentController, braintreeTokenController, countProductController, createProductController, deleteProductController, getProductController, productCategoryController, productFiltersController, productImage3DController, productImageController, productListController, relatedProductController, searchProductController, singleProductController, updateProductController } from "../controllers/productController.js";
import formidable from 'express-formidable';


const router = express.Router();

router.post('/create-product', requireSignIn, isAdmin, formidable(), createProductController);
router.put('/update-product/:pid', requireSignIn, isAdmin, formidable(), updateProductController);
router.get('/get-product', getProductController);
router.get('/get-product/:slug', singleProductController); //get single product
router.get('/image-product/:pid', productImageController);
router.get('/image3d-product/:pid', productImage3DController); //3d
router.delete('/delete-product/:pid', deleteProductController);
router.post('/product-filters', productFiltersController);
router.get('/count-product', countProductController);
router.get('/product-list/:page', productListController); //product per page
router.get('/search/:keyword', searchProductController);
router.get('/related-product/:pid/:cid', relatedProductController);
router.get('/product-category/:slug', productCategoryController);
router.get('/braintree/token', braintreeTokenController);
router.post('/braintree/payment', requireSignIn, brainTreePaymentController);


export default router;