
import { hashPassword, comparePassword } from "../helpers/authHelper.js";
import user from "../models/user.js";
import orderModel from '../models/order.js'
import JWT from "jsonwebtoken";

export const registerController = async (req, res) => {
    try {
        const { name, email, password, phone, address, answer } = req.body;

        if (!name) {
            return res.send({ message: 'Name is Required!' })
        }
        if (!email) {
            return res.send({ message: 'Email is Required!' })
        }
        if (!password) {
            return res.send({ message: 'Password is Required!' })
        }
        if (!phone) {
            return res.send({ message: 'Phone is Required!' })
        }
        if (!address) {
            return res.send({ message: 'Address is Required!' })
        }
        if (!answer) {
            return res.send({ message: 'Answer is Required!' })
        }

        const existingUser = await user.findOne({ email });
        if (existingUser) {
            return res.status(200).send({
                success: false,
                message: 'Email already Register!'
            })
        }
        //user register
        const hashedPassword = await hashPassword(password);

        //save
        const User = await new user({
            name,
            email,
            phone,
            address,
            answer,
            password: hashedPassword,
        }).save();
        const token = await JWT.sign({ _id: User._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.status(201).send({
            success: true,
            message: 'User Register Successfully!',
            User,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Registration!',
            error,
        })
    }
};

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        //validation
        if (!email || !password) {
            return res.status(404).send({
                success: false,
                message: 'Invalid Email or Password!'
            })
        }
        //check user
        const User = await user.findOne({ email });
        if (!User) {
            return res.status(404).send({
                success: false,
                message: 'Email is not Registered!'
            })
        }
        const match = await comparePassword(password, User.password);
        if (!match) {
            return res.status(200).send({
                success: false,
                message: 'Invalid Password!'
            })
        }
        const token = await JWT.sign({ _id: User._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        res.status(200).send({
            success: true,
            message: 'Login Successfully!',
            User: {
                id: User.id,
                name: User.name,
                email: User.email,
                phone: User.phone,
                address: User.address,
                answer: User.answer,
                role: User.role,
            },
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Login!',
            error
        })
    }
};

export const testController = (req, res) => {
    res.send("protected route");
}

export const forgotPasswordController = async (req, res) => {
    try {
        const { email, answer, newPassword } = req.body;
        if (!email) {
            res.status(400).send({ message: 'Email is required' });
        }
        if (!answer) {
            res.status(400).send({ message: 'Answer is required' });
        }
        if (!newPassword) {
            res.status(400).send({ message: 'New Password is required' });
        }

        const User = await user.findOne({ email, answer });

        if (!User) {
            return res.status(404).send({
                success: false,
                message: 'Wrong Email or Answer!'
            })
        };

        const hashed = await hashPassword(newPassword);
        await user.findByIdAndUpdate(User.id, { password: hashed });
        res.status(200).send({
            success: true,
            message: 'Password reset Successfully!',
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error!',
            error
        })
    }
};

export const updateProfileController = async (req, res) => {
    try {
        const { name, email, password, address, phone } = req.body;
        const User = await user.findById(req.user._id);
        //password
        if (password && password.length < 6) {
            return res.json({ error: "Passsword is required and 6 character long" });
        }
        const hashedPassword = password ? await hashPassword(password) : undefined;
        const updatedUser = await user.findByIdAndUpdate(
            req.user._id,
            {
                name: name || User.name,
                password: hashedPassword || User.password,
                phone: phone || User.phone,
                address: address || User.address,
            },
            { new: true }
        );
        res.status(200).send({
            success: true,
            message: "Profile Updated Successfully",
            updatedUser,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error While Update profile",
            error,
        });
    }
};

export const getOrdersController = async (req, res) => {
    try {
        const orders = await orderModel
            .find({ buyer: req.user._id })
            .populate("products", "-image")
            .populate("buyer", "name");
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error WHile Geting Orders",
            error,
        });
    }
};
//orders
export const getAllOrdersController = async (req, res) => {
    try {
        const orders = await orderModel
            .find({})
            .populate("products", "-photo")
            .populate("buyer", "name")
            .sort({ createdAt: "-1" });
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error While Geting Orders",
            error,
        });
    }
};

//order status
export const orderStatusController = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const orders = await orderModel.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error While Updateing Order",
            error,
        });
    }
};
