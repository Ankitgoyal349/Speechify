    import express from 'express';
    import path from 'path';
    import bodyParser from 'body-parser';
    import morgan from 'morgan';
    import dotenv from 'dotenv';
    import connectDB from './BackEnd/config/db.js';
    import User from './BackEnd/models/User.js';
    import { fileURLToPath } from 'url';
    import { dirname } from 'path';

    dotenv.config();
    connectDB();

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    const app = express();
    const PORT = 8080;

    app.set("view engine", "ejs");
    app.set("views", path.join(__dirname, "FrontEnd", "views"));
    app.use(express.static(path.join(__dirname, "FrontEnd", "public")));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(morgan('dev'));

    // Routes
    app.get('/', (req, res) => res.redirect('/home'));
    app.get('/home', (req, res) => res.render('home'));
    app.get('/login', (req, res) => res.render('login'));
    app.get('/register', (req, res) => res.render('register'));
    app.get('/textToSpeech', (req, res) => res.render('Text-to-speech'));
    app.get('/about', (req, res) => res.render('about'));

    // Register
    app.post('/register', async (req, res) => {
        const { username, email, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.send(`<script>alert("Passwords do not match."); window.location.href = "/register";</script>`);
        }

        try {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.send(`<script>alert("Email already registered."); window.location.href = "/register";</script>`);
            }

            const newUser = new User({ username, email, password });
            await newUser.save();

            res.send(`<script>alert("User registered successfully."); window.location.href = "/login";</script>`);
        } catch (err) {
            console.error(err);
            return res.send(`<script>alert("Username must be a string"); window.location.href = "/register";</script>`);
        }
    });

    // Login
    app.post('/login', async (req, res) => {
        const { username, password } = req.body;

        try {
            const user = await User.findOne({ username, password });

            if (!user) {
                return res.send(`<script>alert("Invalid credentials."); window.location.href = "/login";</script>`);
            }

            res.send(`<script>alert("Login successful."); window.location.href = "/textToSpeech";</script>`);
        } catch (err) {
            console.error(err);
            res.status(500).send("Server error during login.");
        }
    });

    app.listen(PORT, () => {
        console.log(`🚀 Server is running at http://localhost:${PORT}/home`);
    });
