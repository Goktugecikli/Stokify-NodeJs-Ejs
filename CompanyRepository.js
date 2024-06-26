import DbManager from "./DbManager.js";

class CompanyRepository {
  constructor(dbConfig) {
    this.dbManager = new DbManager(dbConfig);
  }

  async CompanyDetailsById(id){
    try {
      await this.dbManager.connectDB(); // Veritabanına bağlan
      let params = { id: id };
      let query = "Select * from Companies where Id=@id";
      return await this.dbManager.queryWithResult(query, params);
    } catch (err) {
      // console.error("Error repossitory connection. Error ", err);
    } finally {
      await this.dbManager.closeDB(); // Veritabanı bağlantısını kapat
    }
  }

  async Register(companyName, userId, inviteCode) {
    try {
      await this.dbManager.connectDB(); // Veritabanına bağlan
      let params = {
        companyName: companyName,
        userId: userId,
        inviteCode: inviteCode,
      };
      let query =
        "INSERT INTO Companies (Name, CompanyOwnerUserId, InviteCode, CreatedAt) VALUES (@companyName, @userId, @inviteCode, getDate());SELECT SCOPE_IDENTITY() AS Id;";
      return await this.dbManager.queryWithResult(query, params);
    } catch (err) {
      // console.error("Error repossitory connection. Error ", err);
    } finally {
      await this.dbManager.closeDB(); // Veritabanı bağlantısını kapat
    }
  }
  async GetCompanyBuUserId(companyId) {
    try {
      await this.dbManager.connectDB(); // Veritabanına bağlan
      let params = { companyId: companyId };
      let query =
        "SELECT * from Companies where CompanyId =  CONVERT(uniqueidentifier,@companyId)";
      return await this.dbManager.queryWithResult(query, params);
    } catch (err) {
      // console.error("Error repossitory connection. Error ", err);
    } finally {
      await this.dbManager.closeDB(); // Veritabanı bağlantısını kapat
    }
  }
  async IsCompanyHasProduct(productId, userCompanyId) {
    try {
      await this.dbManager.connectDB(); // Veritabanına bağlan
      let params = { productId: productId, companyId: userCompanyId };
      let query =
        "select * from CompanyProducts where ProductId= CONVERT(uniqueidentifier,@productId) and CompanyId = CONVERT(uniqueidentifier,@companyId)";
      return await this.dbManager.queryWithResult(query, params);
    } catch (err) {
      // console.error("Error repossitory connection. Error ", err);
    } finally {
      await this.dbManager.closeDB(); // Veritabanı bağlantısını kapat
    }
  }
  async  GetUserCreatedCompanyByUserId(userId){
    try {
      await this.dbManager.connectDB(); // Veritabanına bağlan
      let params = { userId: userId};
      let query ="select * from Companies where CompanyOwnerUserId= CONVERT(uniqueidentifier,@userId)";
      return await this.dbManager.queryWithResult(query, params);
    } catch (err) {
      // console.error("Error repossitory connection. Error ", err);
    } finally {
      await this.dbManager.closeDB(); // Veritabanı bağlantısını kapat
    }
  }
  async AddProductToCompanyIdAndProductTableId(productId, companyId) {
    try {
      await this.dbManager.connectDB(); // Veritabanına bağlan
      let params = { id: productId, companyId: companyId };
      let query =
        "INSERT INTO CompanyProducts (ProductId, CompanyId) VALUES ((select ProductId from Products where Id=@id), @companyId);SELECT SCOPE_IDENTITY() AS Id;";
      return await this.dbManager.queryWithResult(query, params);
    } catch (err) {
      // console.error("Error repossitory connection. Error ", err);
    } finally {
      await this.dbManager.closeDB(); // Veritabanı bağlantısını kapat
    }
  }
  async GetCompanyDetailsByInvateCode(invateCode) {
    try {
      await this.dbManager.connectDB(); // Veritaban1ına bağlan
      let params = { inviteCode: invateCode };
      let query = "SELECT * from Companies where InviteCode = @inviteCode";
      return await this.dbManager.queryWithResult(query, params);
    } catch (err) {
      // console.error("Error repossitory connection. Error ", err);
    } finally {
      await this.dbManager.closeDB(); // Veritabanı bağlantısını kapat
    }
  }
}

export default CompanyRepository;
