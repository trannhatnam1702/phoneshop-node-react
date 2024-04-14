import slugify from 'slugify';
import product from '../models/product.js';
import categoryModel from '../models/category.js';
import orderModel from '../models/order.js';
import userModel from '../models/user.js';
import fs from 'fs';
import braintree from "braintree";
import dotenv from "dotenv";
import { modelNames } from 'mongoose';
import path from 'path';

dotenv.config();

var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

//Thêm
export const createProductController = async (req, res) => {
    try {
        const { name, slug, description, price, category, quantity, shipping } = req.fields;
        const { image, image3D } = req.files;
        switch (true) {
            case !name:
                return res.status(500).send({ error: "Name is Required!" });
            case !description:
                return res.status(500).send({ error: "Description is Required!" });
            case !price:
                return res.status(500).send({ error: "Price is Required!" });
            case !quantity:
                return res.status(500).send({ error: "Quantity is Required!" });
            case !category:
                return res.status(500).send({ error: "Category is Required!" });
            case image && image.size > 1000000:
                return res.status(500).send({ error: "Image is Required and should be less than 1MB!" });
        }

        const products = new product({ ...req.fields, slug: slugify(name), });
        if (image) {
            products.image.data = fs.readFileSync(image.path);
            products.image.contentType = image.type;
        }
        //update file 3D model
        if (image3D) {
            const uploadDir = 'uploads/3dmodels'; // Thay đổi đường dẫn này thành thư mục bạn muốn lưu trữ trên máy chủ
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            const modelName = `${Date.now()}_${image3D.name}`;
            const modelPath = path.join(uploadDir, modelName);
            fs.copyFileSync(image3D.path, modelPath);
            products.image3D = {
                path: modelPath,
                contentType: image3D.type
            };
            // Xóa tệp tạm sau khi đã sao chép
            fs.unlinkSync(image3D.path);
        }

        //
        await products.save();
        res.status(201).send({
            success: true,
            message: 'New Product created!',
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Creating Product!',
            error,
        });
    }
};

export const getProductController = async (req, res) => {
    try {
        const products = await product.find({}).populate('category').select("-image -image3D").limit(12).sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            message: 'Get all Products Successfully!',
            countTotal: products.length,
            products,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Getting Product!',
            error: error.message,
        });
    }
};

export const singleProductController = async (req, res) => {
    try {
        const products = await product.findOne({ slug: req.params.slug }).select("-image -image3D").populate('category');
        res.status(200).send({
            success: true,
            message: 'Get single Product Successfully!',
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Getting single Product!',
            error: error.message,
        });
    }
};

export const productImageController = async (req, res) => {
    try {
        //productId=pid
        const products = await product.findById(req.params.pid).select("image");
        if (products.image.data) {
            res.set('Content-type', products.image.contentType);
            return res.status(200).send(products.image.data);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Getting Image of Product!',
            error: error.message,
        });
    }
};

export const productImage3DController = async (req, res) => {
    try {
        const products = await product.findById(req.params.pid).select("image3D");

        if (!products) {
            return res.status(404).json({ error: "Product not found" });
        }

        if (!products.image3D) {
            return res.status(404).json({ error: "3D model not found for this product" });
        }
        if (!products.image3D.path) {
            return res.status(500).json({ error: "Path to 3D model is undefined" });
        }
        const absolutePath = path.resolve(products.image3D.path);

        // Đặt loại nội dung của phản hồi
        res.set('Content-Type', 'model/gltf-binary');

        // Trả về nội dung của tệp model 3D
        return res.status(200).sendFile(absolutePath);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Getting Image 3D of Product!',
            error: error.message,
        });
    }
};

export const upload3DModelController = async (req, res) => {
    try {
        // Tạo thư mục lưu trữ nếu chưa tồn tại
        const uploadDir = 'uploads/';
        const contentType = 'model/gltf-binary'; // Ví dụ: đây là loại nội dung của file GLB

        // Cập nhật loại nội dung trong cơ sở dữ liệu
        await product.findByIdAndUpdate(req.params.pid, { 'image3D.contentType': contentType });
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Lưu trữ file 3D model
        const { model } = req.files;
        const modelName = `${Date.now()}_${model.name}`;
        const modelPath = path.join(uploadDir, modelName);
        fs.writeFileSync(modelPath, fs.readFileSync(model.path));

        // Thực hiện các thao tác lưu trữ khác nếu cần

        // Trả về kết quả thành công
        res.status(201).json({ success: true, message: '3D model uploaded successfully', modelPath });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to upload 3D model', error: error.message });
    }
};

export const deleteProductController = async (req, res) => {
    try {
        await product.findByIdAndDelete(req.params.pid).select("-image -image3D");
        res.status(200).send({
            success: true,
            message: 'Delete Product Successfully!',
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Deleting Product!',
            error: error.message,
        });
    }
};

export const updateProductController = async (req, res) => {
    try {
        const { name, slug, description, price, category, quantity, shipping } = req.fields;
        const { image, image3D } = req.files;

        switch (true) {
            case !name:
                return res.status(500).send({ error: "Name is Required!" });
            case !description:
                return res.status(500).send({ error: "Description is Required!" });
            case !price:
                return res.status(500).send({ error: "Price is Required!" });
            case !quantity:
                return res.status(500).send({ error: "Quantity is Required!" });
            case !category:
                return res.status(500).send({ error: "Category is Required!" });

            case !shipping:
                return res.status(500).send({ error: "Shipping is Required!" });
            case image && image.size > 1000000:
                return res.status(500).send({ error: "Image is Required and should be less than 1MB!" });
        }

        const products = await product.findByIdAndUpdate(req.params.pid,
            { ...req.fields, slug: slugify(name) }, { new: true });
        if (image) {
            products.image.data = fs.readFileSync(image.path);
            products.image.contentType = image.type;
        }
        if (image3D) {
            // Lưu đường dẫn của tệp 3D model vào cơ sở dữ liệu
            products.image3D.path = modelPath; // Sử dụng biến modelPath từ hàm upload3DModelController
            // Cập nhật thông tin về tệp 3D model trong cơ sở dữ liệu
            products.image3D.contentType = image3D.type; // Thay image3D.type bằng loại tệp 3D model phù hợp
        }
        await products.save();
        res.status(201).send({
            success: true,
            message: 'Update Product Successfully!',
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Updating Product!',
            error: error.message,
        });
    }
};

export const productFiltersController = async (req, res) => {
    try {
        const { checked, radio } = req.body;
        let args = {};
        if (checked.length > 0) args.category = checked;
        if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
        const products = await product.find(args);
        res.status(200).send({
            success: true,
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: 'Error While Filtering Products!',
            error,
        });
    }
};

export const countProductController = async (req, res) => {
    try {
        const total = await product.find({}).estimatedDocumentCount();
        res.status(200).send({
            success: true,
            total,
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: 'Error While Counting Products!',
            error,
        });
    }
};

export const productListController = async (req, res) => {
    try {
        const perPage = 6;
        const page = req.params.page ? req.params.page : 1;
        const products = await product.find({}).select("-image -image3D").skip((page - 1) * perPage).limit(perPage).sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            products,
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: 'Error in get product per page!',
            error,
        });
    }
};

export const searchProductController = async (req, res) => {
    try {
        const { keyword } = req.params;
        const results = await product.find({
            $or: [
                { name: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ]
        }).select("-image -image3D");
        res.json(results);
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: 'Error in search product API!',
            error,
        });
    }
};

export const relatedProductController = async (req, res) => {
    try {
        const { pid, cid } = req.params;
        const products = await product.find({
            category: cid,
            _id: { $ne: pid }
        }).select('-image -image3D').limit(3).populate('category');
        res.status(200).send({
            success: true,
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: 'Error in getting related product!',
            error,
        });
    }
};

export const productCategoryController = async (req, res) => {
    try {
        const category = await categoryModel.findOne({ slug: req.params.slug });
        const products = await product.find({ category }).populate('category').select("-image -image3D");
        res.status(200).send({
            success: true,
            category,
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: 'Error in getting Product!',
            error,
        });
    }
};

export const braintreeTokenController = async (req, res) => {
    try {
        gateway.clientToken.generate({}, function (err, response) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.send(response);
            }
        });
    } catch (error) {
        console.log(error);
    }
};


export const brainTreePaymentController = async (req, res) => {
    try {
        const { nonce, cart } = req.body;
        console.log(req.body);
        let total = 0;
        cart.map((i) => {
            total += i.price;
        });

        let newTransaction = gateway.transaction.sale(
            {
                amount: total,
                paymentMethodNonce: nonce,
                options: {
                    submitForSettlement: true,
                },
            },
            function (error, result) {
                if (result) {
                    console.log(req.body);
                    const order = new orderModel({
                        products: cart,
                        payment: result,
                        buyer: req.user._id,
                    }).save();
                    //console.log(req.user._id)
                    res.json({ ok: true });
                } else {
                    res.status(500).send(error);
                }
            }
        );
    } catch (error) {
        console.log(error);
    }
};
