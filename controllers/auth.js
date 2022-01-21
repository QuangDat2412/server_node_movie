const User = require('../models/User');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
var speakeasy = require('speakeasy');
const nodemailer = require('nodemailer');

const register = async (req, res) => {
    const isValid = speakeasy.totp.verify({ secret: req.body.email + process.env.PASS_SEC, token: req.body.otp, window: 19 });
    const newUser = new User({
        ...req.body,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),
    });
    try {
        if (isValid) {
            await newUser.save();
            res.status(201).json(true);
        } else {
            res.status(201).json(false);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};
const checkOtp = async (req, res) => {
    const isValid = speakeasy.totp.verify({ secret: req.body.email + process.env.PASS_SEC, token: req.body.otp, window: 19 });
    try {
        if (isValid) {
            res.status(201).json(true);
        } else {
            res.status(201).json(false);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};
const forgotPassword = async (req, res) => {
    const isValid = speakeasy.totp.verify({ secret: req.body.email + process.env.PASS_SEC, token: req.body.otp, window: 19 });
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString();
    }
    try {
        if (isValid) {
            const user = await User.findOne({ email: req.body.email });
            await User.findByIdAndUpdate(
                user._id,
                {
                    $set: req.body,
                },
                { new: true }
            );
            res.status(200).json(true);
        } else {
            res.status(201).json(false);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};
const se = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'hotmail',
            auth: {
                user: 'dat.lq172465@sis.hust.edu.vn',
                pass: 'Datumltk123',
            },
        });
        await transporter.sendMail({
            from: 'dat.lq172465@sis.hust.edu.vn',
            to: email,
            subject: subject,
            text: text,
        });
        console.log('email sent sucessfully');
    } catch (error) {
        console.log('email not sent');
        console.log(error);
    }
};
const sendMail = async (req, res) => {
    const otp = speakeasy.totp({ secret: req.body.email + process.env.PASS_SEC, window: 19 });
    const message = `Dear ${req.body.email},
    
    Bạn đang thực hiện xác nhận bảo mật tài khoản App, dưới đây là mã xác thực của bạn:
                
    ${otp}
                
    Nếu đây không phải là email của bạn, xin hãy bỏ qua email này, hãy đừng trả lời.`;
    try {
        const user = await User.findOne({ email: req.body.email });
        if (req.params.slug === 'register') {
            if (user !== null) {
                res.send(false);
            } else {
                await sendEmail(req.body.email, 'Mã OTP:', message);
                res.send(true);
            }
        } else if (req.params.slug === 'update' || req.params.slug === 'forgotpassword') {
            await se(req.body.email, 'Mã OTP:', message);
            res.send(true);
        }
    } catch (error) {
        res.status(400).send('An error occured');
    }
};
const login = async (req, res) => {
    try {
        const user = await User.findOne({
            email: req.body.email,
        })
            .populate('favorites', '_id title imgTitle imgBanner slug')
            .populate('history', '_id episode movieId')
            .sort('-created')
            .exec();
        !user && res.status(401).json('Wrong credentials!');

        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
        const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

        OriginalPassword !== req.body.password && res.status(401).json('Wrong credentials!');

        const accessToken = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin,
            },
            process.env.JWT_SEC,
            { expiresIn: '5d' }
        );
        const token = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin,
            },
            process.env.JWT_SEC,
            { expiresIn: '30d' }
        );
        const a = { refreshToken: token };
        await User.findByIdAndUpdate(
            user._id,
            {
                $set: a,
            },
            { new: true }
        );
        const { password, refreshToken, ...others } = user._doc;

        res.status(200).json({ ...others, accessToken });
    } catch (err) {
        res.status(500).json(err);
    }
};
module.exports = {
    register,
    checkOtp,
    forgotPassword,
    sendMail,
    login,
};
