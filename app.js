import path from 'path';
import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import DatabaseManager from './DbManager.js';
import UserService from './UserService.js';
import FileStoreFactory from 'session-file-store';
import UserRepository from './UserRepository.js';

const db = new DatabaseManager();

const FileStore = FileStoreFactory(session);
const userRepository = new UserRepository();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

    app.use(session({
        store: new FileStore({ path: './sessions' }),
        cookie :{
            maxAge:1000*60*60*24,
            httpOnly:true,
        },
        secret: 'mysecretkey',
        resave: false,
        saveUninitialized: false,
        
    }));

    // -----------------------------------

    function checkAuth(req, res, next) {
        if (req.session.user) {
          //  console.log(req.session.user)
            return res.redirect('/home');
        }
        next();
    }

    function requireAuth(req, res, next) {
        if (!req.session.user) {
            return res.redirect('/login');
        }
        next();
    }
    

    app.get('/login', checkAuth, (req, res) => {
        res.render('login');  // Ensure you have a login.ejs view
    });

    app.get('/', checkAuth, (req, res) => {
        res.render('login');  // Ensure you have a login.ejs view
    });



    app.get('/logout', (req, res) => {
        //console.log(req.session.user);
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).send('Could not log out.');
            } else {
                res.clearCookie('connect.sid');  // Clear the session cookie
                return res.redirect('/');
            }
        });
    });


//------------------------------------------

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Statik dosyalar için klasörü ayarlayın
app.use(express.static(path.join(__dirname, 'public')));


// Diğer sayfalar için rotalar
app.get('/home', requireAuth, async(req, res) =>{ 
    try {
        
        const username = req.session.user;
        console.log(req.session.user);
        const user = await userRepository.getUserById(username);
       
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.render('pages/home', { user:user[0]});
    } catch (err) {
        console.error('Error fetching user data:', err);
        res.status(500).send('Error fetching user data');
    }
    // res.render('pages/home')
});

app.get('/company',requireAuth,async (req, res) => {
    try {
        
        const username = req.session.user;
        console.log(req.session.user);
        const user = await userRepository.getUserById(username);
    
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.render('pages/company', { user:user[0]});
    } catch (err) {
        console.error('Error fetching user data:', err);
        res.status(500).send('Error fetching user data');
    }});
app.get('/notification', requireAuth,(req, res) => res.render('pages/notification'));
app.get('/reports',requireAuth, (req, res) => res.render('pages/reports'));
app.get('/stock',requireAuth, (req, res) => res.render('pages/stock'));
app.get('/approvals',requireAuth, (req, res) => res.render('pages/approvals'));
// app.get('/logout', (req, res) => { 
//     req.session.destroy();
//     res.redirect('/login');
// });
app.post('/auth', async (req, res) => {
    const { username, password } = req.body;
    // console.log(req.session.user)
    // console.log(username + " "  + password);
    var userService = new UserService();
    const isValidUser = await userService.validateUser(username, password);
    if (isValidUser > 0) {
        req.session.user = username;
        req.session.authorized = true;
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



// app.use((req, res, next) => {
//     // Oturum kontrolü yapmadan önce /login sayfasından gelen istekleri kontrol et
//     if (req.path === '/login') {
//       return next();
//     }
  
//     // Oturum kontrolü yap
//     if (req.session.isLoggedIn) {
//       return next(); // Kullanıcı giriş yapmış, bir sonraki middleware'e geç
//     }
//     res.redirect('/login'); // Kullanıcı giriş yapmamış, login sayfasına yönlendir
//   });
  
  
// app.use((req, res, next) => {
//     if (!req.session.redirected) {
//         console.log(req.session.user)
//         // Kullanıcı oturumu açmış
//         console.log(`Geldi. "${req.session.user}"`)
//         next();
//     } else {
//         // Kullanıcı oturumu açmamış, login sayfasına yönlendir
//         console.log(`2. "${req.session.user}"`)
//         req.session.redirected = true; // Yönlendirildiğini işaretle
//         res.redirect('/');

//     }
// });
// EJS'yi şablon motoru olarak ayarlayın
