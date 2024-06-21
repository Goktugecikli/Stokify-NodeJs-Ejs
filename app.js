import path from "path";
import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import DatabaseManager from "./DbManager.js";
import UserService from "./UserService.js";
import FileStoreFactory from "session-file-store";
import ProductService from "./ProductService.js";
import CompanyService from "./CompanyService.js";

const db = new DatabaseManager();

const FileStore = FileStoreFactory(session);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

const productService = new ProductService();
const userService = new UserService();
const companyService = new CompanyService();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  session({
    store: new FileStore({ path: "./sessions" }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    },
    secret: "mysecretkey",
    resave: false,
    saveUninitialized: false,
  })
);

// -----------------------------------

function checkAuth(req, res, next) {
  if (req.session.user) {
    //  console.log(req.session.user)
    return res.redirect("/home");
  }
  next();
}

function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
}

app.get("/login", checkAuth, (req, res) => {
  res.render("login"); // Ensure you have a login.ejs view
});

app.get("/", checkAuth, (req, res) => {
  res.render("login"); // Ensure you have a login.ejs view
});

app.get("/logout", (req, res) => {
  //console.log(req.session.user);
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Could not log out.");
    } else {
      res.clearCookie("connect.sid"); // Clear the session cookie
      return res.redirect("/");
    }
  });
});

//------------------------------------------

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Statik dosyalar için klasörü ayarlayın
app.use(express.static(path.join(__dirname, "public")));

// Diğer sayfalar için rotalar
app.get("/home", requireAuth, async (req, res) => {
  try {
    const username = req.session.user;
    console.log(req.session.user);
    let user = await userService.IsExistUser(username);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.render("pages/home", { user: user[0] });
  } catch (err) {
    console.error("Error fetching user data:", err);
    res.status(500).send("Error fetching user data");
  }
  // res.render('pages/home')
});
app.get("/register-company", requireAuth, async(req, res)=> {

  res.render("pages/register-company")
})
app.get("/user-profile", requireAuth, async (req, res) => {
  try {
    const userName = req.session.user;
    // console.log(req.session.user);
    let user = await userService.IsExistUser(userName);
    if (!user) {
      return res.status(404).send("User not found");
    }
    let companyResultArr = await userService.GetCompanyByUserId(user[0].UserId);
    let company = null;
    if (companyResultArr) company = companyResultArr[0];
    res.render("pages/user-profile", { user: user[0], companyData: company });
  } catch (err) {
    console.error("Error fetching user data:", err);
    res.status(500).send("Error fetching user data");
  }
});
app.get("/stock-operations", requireAuth, (req, res) =>
  res.render("pages/stock-operations")
);
app.get("/reports", requireAuth, (req, res) => res.render("pages/reports"));
app.get("/stock", requireAuth, (req, res) => res.render("pages/stock"));
app.get("/approvals", requireAuth, (req, res) => res.render("pages/approvals"));
// app.get('/logout', (req, res) => {
//     req.session.destroy();
//     res.redirect('/login');
// });
app.post("/auth", async (req, res) => {
  const { username, password } = req.body;

  var userService = new UserService();
  const isValidUser = await userService.validateUser(username, password);
  if (isValidUser > 0) {
    req.session.user = username;
    req.session.authorized = true;
    res.json({ success: true, redirectUrl: "/home" });
  } else {
    res.json({ success: false, message: "Bilgiler yanlış" });
  }
});

app.post("/register", async (req, res) => {
  // console.log(JSON.stringify(req.body));
  const { firstName, lastName, email, username, password } = req.body;
  var userService = new UserService();

  const isExistUser = await userService.IsExistUser(username);
  // console.log(isExistUser);
  if (isExistUser != null && isExistUser.length > 0) {
    res.json({ success: false, message: "kullanıcı zaten kayıtlı" });
    return;
  }
  var result = userService.Register(
    firstName,
    lastName,
    email,
    username,
    password
  );
  if (result === false) {
    res.json({
      success: false,
      message: "kayıt yapılırken hata meydana geldi sonra tekrar deneyiniz",
    });
    return;
  }
  res.json({ success: true, redirectUrl: "/login" });
});

app.get("/api/product/get-all-operation-types", async (req, res) => {
  var result = await productService.GetProductOperationsTypes();
  res.json(JSON.stringify(result));
});
app.post("/api/product/add-product", async (req, resp) => {
  let result = await productService.AddProduct(req.body);
  resp.json(JSON.stringify(result));
});
app.post("/api/user/join-company-by-company-id", async (req, resp) => {
  console.log(`Gelen Body: ${JSON.stringify(req.body)}`);
  let invateCode = req.body.inviteCode;
  const userName = req.session.user;
  var result = await userService.JoinCompanyByInvateCode(invateCode, userName);
  resp.json(JSON.stringify(result));
});
app.post("/api/company/register", async (req, resp) => {
  let companyName = req.body.companyName;
  let userName = req.session.user;
  var result = await companyService.Register(companyName, userName);
  resp.json(result);
});
// Sunucuyu başlatın
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Veritabanı bağlantısı oluştur
