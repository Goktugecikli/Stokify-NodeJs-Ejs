import constants from 'constants';
import express from 'express';
import path from 'path';
import session from 'express-session';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import DatabaseManager from './DbManager.js';
import { cwd } from 'process';
import { log } from 'console';
import { connect } from 'http2';

import UserService from './UserService.js';

const dbConfig = {
    server: 'DESKTOP-NDQN894',
    database: 'StockTracking',
    user: 'sa',
    password: '12345678',
    port: 1433,
    options: {
        // encrypt: true,
        // trustServerCertificate: true,
        trustedConnection: true,
        // enableArithAbort: true,
        // integratedSecurity: true,
        // Güvenilir bağlantı için yorum satırından çıkarılabilir
        // authentication: {
        //     type: 'default',
        //     options: {
        //         userName: 'DESKTOP-NDQN894\\ggeci', // Windows kullanıcı adı ve alanı
        //         // password: 'password' // Gerekirse şifre de buraya eklenebilir
        //     }
        // }
    }
};

const db = new DatabaseManager(dbConfig);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: true
}));

// EJS'yi şablon motoru olarak ayarlayın
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Statik dosyalar için klasörü ayarlayın
app.use(express.static(path.join(__dirname, 'public')));

// Ana sayfa rotası
app.get('/', (req, res) => {
    res.render('index');
});

// Diğer sayfalar için rotalar
app.get('/home', (req, res) => res.render('pages/home'));
app.get('/company', (req, res) => res.render('pages/company'));
app.get('/notification', (req, res) => res.render('pages/notification'));
app.get('/reports', (req, res) => res.render('pages/reports'));
app.get('/stock', (req, res) => res.render('pages/stock'));
app.get('/approvals', (req, res) => res.render('pages/approvals'));
app.get('/logout', (req, res) => { res.redirect('/'); });
app.post('/auth', async (req, res) => {
    const { username, password } = req.body;
    // console.log(username + " "  + password);
    var userService = new UserService();
    const isValidUser = await userService.validateUser(username, password);
    if (isValidUser > 0) {
        req.session.user = username;
        res.json({ success: true, redirectUrl: '/home' });
    } else {
        res.json({ success: false, message: 'Bilgiler yanlış' });
    }
});

// Sunucuyu başlatın
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
// Veritabanı bağlantısı oluştur



