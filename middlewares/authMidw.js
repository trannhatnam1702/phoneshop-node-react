import JWT from 'jsonwebtoken';
import user from '../models/user.js';

export const requireSignIn = async (req, res, next) => {
    try {
        const decode = JWT.verify(req.headers.authorization, process.env.JWT_SECRET);
        req.user = decode;
        console.log(req.headers)
        next();
    } catch (error) {
        console.log(error)
    }
};

//admin
export const isAdmin = async (req, res, next) => {
    try {
        const User = await user.findById(req.user._id)
        if (User.role !== 1) {
            return res.status(401).send({
                success: false,
                message: 'Unauthorized access!'
            })
        }
        else { next(); }

    } catch (error) {
        res.status(401).send({
            success: false,
            message: 'Error in Admin middleware!',
            error
        })
        console.log(error);
    }
}
