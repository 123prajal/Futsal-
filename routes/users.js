const express = require('express');
const router = express.Router();
const prajwal = require('../controllers/userController');
const { isLoggedIn } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Multer upload instance
const upload = multer({ storage: storage });

// Example route that renders index.ejs
router.get('/index', isLoggedIn, (req, res) => {
    res.render('index', { user: req.user }); // Pass req.user to the template
});


router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', prajwal.signupUser);


router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/book', (req, res) => {
    res.render('book');
});

router.post('/book');


router.post('/login', prajwal.loginUser);

router.get('/profile', isLoggedIn, prajwal.getProfile);
router.post('/profile', isLoggedIn, prajwal.updateProfile);


router.post('/profile/image', isLoggedIn, upload.single('image'), prajwal.updateProfileImage);



module.exports = router;
