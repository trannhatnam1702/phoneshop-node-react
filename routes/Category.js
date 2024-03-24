import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMidw.js";
import { createCategoryController, updateCategoryController, categoryController, singleCategoryController, deleteCategoryController, categoryImageController } from "../controllers/categoryController.js";
import formidable from 'express-formidable';

const router = express.Router();

router.post('/create-category', requireSignIn, isAdmin, formidable(), createCategoryController);
router.put('/update-category/:id', requireSignIn, isAdmin, formidable(), updateCategoryController);

//getall cate
router.get('/list-category', categoryController);
router.get('/image-category/:id', categoryImageController);

//getsingle cate
router.get('/single-category/:slug', singleCategoryController);

router.delete('/delete-category/:id', requireSignIn, isAdmin, deleteCategoryController);

export default router;
