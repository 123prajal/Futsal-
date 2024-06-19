const User = require("../models/user");
const bcrypt = require("bcrypt");


async function signupUser(req, res) {
    const { email, password, confirm_password } = req.body;

    if (password !== confirm_password) {
        return res.json({ error: "Passwords didn't match" });
    }

    try {
        const user = await User.create({ email, password });
        console.log(user);
        res.redirect('/login');
    } catch (err) {
        console.log(err);
        res.json({ error: "Internal error" });
    }
}

async function loginUser(req, res) {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid email" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ error: "Password didn't match" });
        }

        req.session.userId = user._id;
        console.log(user);
        res.redirect('/index');
    } catch (err) {
        console.log(err);
        return res.json({ error: "Internal error" });
    }
}


async function getProfile(req, res) {
    try {
        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.redirect('/login');
        }
        res.render('profile', { user }); // Pass user object to the template
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal error" });
    }
}

async function updateProfile(req, res) {
    const { name } = req.body;

    try {
        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.redirect('/login');
        }

        user.name = name;
        await user.save();

        res.redirect('/profile');
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal error" });
    }
}

async function updateProfileImage(req, res) {
    try {
        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.redirect('/login');
        }

        if (req.file) {
            user.image = `/uploads/${req.file.filename}`;
            await user.save();
        }

        res.redirect('/profile');
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal error" });
    }
}

module.exports = {
    signupUser,
    loginUser,
    getProfile,
    updateProfile,
    updateProfileImage
};
