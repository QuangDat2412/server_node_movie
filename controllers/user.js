const User = require('../models/User');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

const updateUser = async (req, res) => {
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString();
    }
    try {
        let accessToken = '';
        if (req.body.oldPassword) {
            const user = await User.findById(req.params.id);
            accessToken = jwt.sign(
                {
                    id: user._id,
                    isAdmin: user.isAdmin,
                },
                process.env.JWT_SEC,
                { expiresIn: '5d' }
            );
            const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
            const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
            if (req.body.oldPassword === OriginalPassword) {
                const a = { password: req.body.password };
                const user = await User.findByIdAndUpdate(
                    req.params.id,
                    {
                        $set: a,
                    },
                    { new: true }
                )
                    .populate('favorites', '_id title imgTitle imgBanner slug')
                    .populate('history', '_id episode movieId')
                    .sort('-created')
                    .exec();
                const { password, refreshToken, ...others } = user._doc;
                res.status(200).json({ ...others, accessToken });
            } else {
                res.status(200).json(false);
            }
        } else {
            const user = await User.findByIdAndUpdate(
                req.params.id,
                {
                    $set: req.body,
                },
                { new: true }
            )
                .populate('favorites', '_id title imgTitle imgBanner slug')
                .populate('history', '_id episode movieId')
                .sort('-created')
                .exec();
            accessToken = jwt.sign(
                {
                    id: user._id,
                    isAdmin: user.isAdmin,
                },
                process.env.JWT_SEC,
                { expiresIn: '5d' }
            );
            const { password, refreshToken, ...others } = user._doc;
            res.status(200).json({ ...others, accessToken });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const add = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.params.id, { $pull: req.body }, { new: true });
        const user = await User.findByIdAndUpdate(req.params.id, { $push: req.body }, { new: true })
            .populate('favorites', '_id title imgTitle imgBanner slug')
            .populate('history', '_id episode movieId')
            .sort('-created')
            .exec();
        const accessToken = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin,
            },
            process.env.JWT_SEC,
            { expiresIn: '5d' }
        );
        const { password, refreshToken, ...others } = user._doc;
        res.status(200).json({ ...others, accessToken });
    } catch (err) {
        res.status(500).json(err);
    }
};

const remove = async (req, res) => {
    try {
        let accessToken = '';
        const user = await User.findByIdAndUpdate(req.params.id, { $pull: req.body }, { new: true })
            .populate('favorites', '_id title imgTitle imgBanner slug')
            .populate('history', '_id episode movieId')
            .sort('-created')
            .exec();
        accessToken = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin,
            },
            process.env.JWT_SEC,
            { expiresIn: '5d' }
        );
        const { password, refreshToken, ...others } = user._doc;
        res.status(200).json({ ...others, accessToken });
    } catch (err) {
        res.status(500).json(err);
    }
};
const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json('User has been deleted...');
    } catch (err) {
        res.status(500).json(err);
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, refreshToken, ...others } = user._doc;
        res.status(200).json(others);
    } catch (err) {
        res.status(500).json(err);
    }
};

const getAllUser = async (req, res) => {
    const query = req.query.new;
    try {
        const users = query ? await User.find().sort({ _id: -1 }).limit(5) : await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json(err);
    }
};

const newUser = async (req, res) => {
    const newUser = new User({
        ...req.body,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),
    });
    try {
        const savedUser = await newUser.save();
        res.status(201).json(true);
    } catch (err) {
        res.status(500).json(err);
    }
};

const stats = async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
    try {
        const data = await User.aggregate([
            { $match: { createdAt: { $gte: lastYear } } },
            {
                $project: {
                    month: { $month: '$createdAt' },
                },
            },
            {
                $group: {
                    _id: '$month',
                    total: { $sum: 1 },
                },
            },
        ]);
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports = {
    updateUser,
    deleteUser,
    getUserById,
    getAllUser,
    newUser,
    stats,
    add,
    remove,
};
