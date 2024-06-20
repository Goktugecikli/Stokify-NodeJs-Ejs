import DbManager from "./DbManager.js";

class CompanyRepository {
  constructor(dbConfig) {
    this.dbManager = new DbManager(dbConfig);
  }

  async GetCompanyBuUserId(companyId) {
    try {
      await this.dbManager.connectDB(); // Veritabanına bağlan
      let params = { companyId: companyId};
      let query =
        "SELECT * from Companies where CompanyId =  CONVERT(uniqueidentifier,@companyId)";
      return await this.dbManager.queryWithResult(query, params);
      return result;
    } catch (err) {
      // console.error("Error repossitory connection. Error ", err);
    } finally {
      await this.dbManager.closeDB(); // Veritabanı bağlantısını kapat
    }
  }

  async GetCompanyDetailsByInvateCode(invateCode){
    try {
      await this.dbManager.connectDB(); // Veritaban1ına bağlan
      let params = { invateCode: invateCode};
      let query =
        "SELECT * from Companies where InvateCode = @invateCode";
      return await this.dbManager.queryWithResult(query, params);
    } catch (err) {
      // console.error("Error repossitory connection. Error ", err);
    } finally {
      await this.dbManager.closeDB(); // Veritabanı bağlantısını kapat
    }
  }
}

export default CompanyRepository;
