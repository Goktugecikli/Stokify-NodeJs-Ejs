import path from "path";
import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import FileStoreFactory from "session-file-store";

import UserService from "./UserService.js";
import ProductService from "./ProductService.js";
import CompanyService from "./CompanyService.js";

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


//#region File path set

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Statik dosyalar için klasörü ayarlayın
app.use(express.static(path.join(__dirname, "public")));

//#endregion

function checkAuth(req, res, next) {
  if (req.session.userName) {
    return res.redirect("/home");
  }
  next();
}

function requireAuth(req, res, next) {
  if (!req.session.userName) {
    return res.redirect("/login");
  }
  next();
}

//#region  Pages Rotates

app.get("/login", checkAuth, (req, res) => {
  res.render("login"); // Ensure you have a login.ejs view
});

app.get("/", checkAuth, (req, res) => {
  res.render("login"); // Ensure you have a login.ejs view
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Could not log out.");
    } else {
      res.clearCookie("connect.sid"); // Clear the session cookie
      return res.redirect("/");
    }
  });
});

app.get("/home", requireAuth, async (req, res) => {
  try {
    const username = req.session.userName;
    let user = await userService.IsExistUser(username);
    if (!user) {
      res.render("pages/error",{message:"Kullanıcı bulunamadı"});
      return;
    }
    res.render("pages/home", { user: user[0] });
  } catch (err) {
    console.error("Error fetching user data:", err);
    res.status(500).send("Error fetching user data");
  }
  // res.render('pages/home')
});

app.get("/register-company", requireAuth, async (req, res) => {
  res.render("pages/register-company");
});

app.get("/user-profile", requireAuth, async (req, res) => {
  try {
    const userName = req.session.userName;
    let user = await userService.IsExistUser(userName);
    if (!user) {
      res.render("pages/error",{message:"Kullanıcı bulunamadı"});
      return;
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

app.get("/my-reports", requireAuth, async (req, res) =>{
  let pageNumber = req.query.pageNumber || 1; 
  let userId = req.session.userId;
  let totalPageCountArr = await productService.GetProductTransactionTotalPageByUserIdAndPageSize(userId,10);
  if(!totalPageCountArr || totalPageCountArr.length ===0)    {
    res.render("pages/error",{message:"Sayfalandırma yapılırken hata meydana geldi"});
    return;
  }
  let resultArr = await productService.GetProductTransactionByUserId(userId,pageNumber,totalPageCountArr[0].TotalPages || 1);
  console.log(JSON.stringify(totalPageCountArr));
  res.render("pages/reports",{reports: resultArr, totalPages:totalPageCountArr[0].TotalPages})
});

app.get("/company-stocks", requireAuth, async (req, res) => {
  let pageNumber = req.query.pageNumber || 1; 
  let userCompanyId = req.session.userCompanyId;
  let totalPageCountArr = await productService.GetCompanyStockPageCountByCompanIdAndPageSize(userCompanyId, 5);
  if(!totalPageCountArr || totalPageCountArr.length ===0)    {
    res.render("pages/error",{message:"Herhangi bir şirkete bağlı değilsiniz. Lüfen kullanıcı profil sayfasından şirket işlemlerinizi tamamlayınız."});  
      return;
    }
  let resultArr = await productService.GetCompanyStocksByCompanyId(userCompanyId,pageNumber,totalPageCountArr[0].TotalPages);
  res.render("pages/stock", {reports: resultArr, totalPages:totalPageCountArr[0].TotalPages})
});

app.get("/approvals", requireAuth, (req, res) => res.render("pages/approvals"));
//#endregion ------------------------------------------------------------------------------------------------- //


//#region  ---------------------------------------- APIs ----------------------------------------------------- //
app.post("/api/user/auth", async (req, res) => {
  const { username, password } = req.body;

  var userService = new UserService();
  const isValidUser = await userService.validateUser(username, password);
  if (isValidUser && isValidUser.length > 0) {

    let  userCompanyId=-1, companyOwnerUserId=-1;
    let companyInfoResult = await userService.GetCompanyByUserId(isValidUser[0].UserId);
    if(companyInfoResult && companyInfoResult.length > 0){
      userCompanyId = companyInfoResult[0].CompanyId;
      companyInfoResult = companyInfoResult[0].CompanyOwnerUserId;
    }
    req.session.userName = username;
    req.session.userId = isValidUser[0].UserId;
    req.session.authorized = true;
    req.session.userCompanyId = userCompanyId;
    req.session.companyOwnerUserId = companyOwnerUserId;

    res.json({ success: true, redirectUrl: "/home" });
  } else {
    res.json({ success: false, message: "Kullanıcı adı veya şifre yanlış." });
  }
});

app.post("/api/user/register", async (req, res) => {

  const { firstName, lastName, email, username, password } = req.body;
  const isExistUser = await userService.IsExistUser(username);

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
  let userId = req.session.userId;
  let userCompanyId = req.session.userCompanyId;
  console.log(userCompanyId);
  if(userCompanyId == null || userCompanyId === -1){
    resp.json({success: false,message:"Herhangi bir şirkete kayıtlı değilsiniz. Kullanıcı profil sayfasından bir şirkete katılabilir ya da şirketinizi kayıt edebilirsiniz"});
    return;
  }
  let result = await productService.AddProduct(
    req.body,
    userId,
    userCompanyId
  );
  console.log(`AppJS: ${JSON.stringify(result)}`);
  resp.json(JSON.stringify(result));
});
app.post("/api/user/join-company-by-company-id", async (req, resp) => {
  console.log(`Gelen Body: ${JSON.stringify(req.body)}`);
  let invateCode = req.body.inviteCode;
  const userId = req.session.userId;
  var result = await userService.JoinCompanyByInviteCode(invateCode, userId);
  if(result.success === true){
    req.session.userCompanyId = result.userCompanyId;
    req.session.companyOwnerUserId = result.companyOwnerUserId;
  }
  resp.json(JSON.stringify(result));
});
app.post("/api/company/register", async (req, resp) => {
  let companyName = req.body.companyName;
  let userId = req.session.userId;
  var result = await companyService.Register(companyName, userId);
  console.log(JSON.stringify(result));
  if (result.success === true) {
    req.session.userCompanyId = result.companyId;
    req.session.companyOwnerUserId = result.companyOwnerUserId;

    console.log(JSON.stringify(req.session));
  }
  resp.json(result);
});

app.get("/api/company/get-invite-code", async (req, resp) => {
  let userId = req.session.userId;
  let companyOwnerUserId = req.session.companyOwnerUserId;
  if(userId !== companyOwnerUserId){
    resp.json({success:false, message:"Katılım kodlarını sadece Şirket sahipleri alabilir.\nLütfen Şirket Sahibi ile iletişime geçiniz."});
  }
  let result = await companyService.GetCompanyInviteCodeByUserId(userId);
  resp.status(200).json(result);
});

//#endregion  --------------------------------------- APILER -------------------------------------------------- //

// Sunucuyu başlatın
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Veritabanı bağlantısı oluştur
