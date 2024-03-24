import slugify from 'slugify';
import category from '../models/category.js'
import fs from 'fs';

export const createCategoryController = async (req, res) => {
    try {
        const { name, slug } = req.fields;
        const { image } = req.files;

        switch (true) {
            case !name:
                return res.status(500).send({ error: "Name is Required!" });
            case image && image.size > 1000000:
                return res.status(500).send({ error: "Image is Required and should be less than 1MB!" });
        }
        const existingCategory = await category.findOne({ name });
        if (existingCategory) {
            return res.status(200).send({
                success: false,
                message: 'Category already Register!'
            })
        }
        const Category = new category({ ...req.fields, slug: slugify(name), });
        if (image) {
            Category.image.data = fs.readFileSync(image.path);
            Category.image.contentType = image.type;
        }
        await Category.save();
        res.status(201).send({
            success: true,
            message: 'New category created!',
            Category,
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Creating Category!',
            error,
        })
    }
};

export const updateCategoryController = async (req, res) => {
    try {
        const { name, slug } = req.fields;
        const { image } = req.files;
        switch (true) {
            case !name:
                return res.status(500).send({ error: "Name is Required!" });
            case image && image.size > 1000000:
                return res.status(500).send({ error: "Image is Required and should be less than 1MB!" });
        }
        console.log(req.params.id);
        const Category = await category.findByIdAndUpdate(req.params.id,
            { ...req.fields, slug: slugify(name) }, { new: true });
        if (image) {
            Category.image.data = fs.readFileSync(image.path);
            Category.image.contentType = image.type;
        }
        await Category.save();
        res.status(200).send({
            success: true,
            message: 'Update Category Successfully!',
            Category,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Updating Category!',
            error,
        })
    }
};

//getall cate
export const categoryController = async (req, res) => {
    try {
        const Category = await category.find({}).select("-image");
        res.status(200).send({
            success: true,
            message: 'Get all Category Successfully!',
            Category,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Getting all Category!',
            error,
        })
    }
};

export const categoryImageController = async (req, res) => {
    try {
        const Category = await category.findById(req.params.id).select("image");
        if (Category.image.data) {
            res.set('Content-type', Category.image.contentType);
            return res.status(200).send(Category.image.data);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Getting Image of Category!',
            error: error.message,
        });
    }
};

//get single cate
export const singleCategoryController = async (req, res) => {
    try {
        const Category = await category.findOne({ slug: req.params.slug }).select("-image");
        res.status(200).send({
            success: true,
            message: 'Get single Category Successfully!',
            Category,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Getting single Category!',
            error,
        })
    }
};

export const deleteCategoryController = async (req, res) => {
    try {
        const { id } = req.params;
        const Category = await category.findByIdAndDelete(id).select("-image");
        res.status(200).send({
            success: true,
            message: 'Delete Category Successfully!',
            Category,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Deleting Category!',
            error,
        })
    }
};
