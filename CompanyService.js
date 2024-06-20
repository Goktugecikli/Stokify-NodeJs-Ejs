import CompanyRepository from "./CompanyRepository.js";

class CompanyService {
  constructor() {
    this.companyRepository = new CompanyRepository();
  }

  async GetCompanyDetailsById(companyId) {
    try {
      return await this.companyRepository.GetCompanyBuUserId(companyId);
    } catch (err) {
      console.error("Error copmany find", err);
    }
  }
  async JoinCompanyById(companyId, userName) {

    
  }
  async GetCompanyDetailsByInvateCode(invateCode) {
    try {
      return await this.companyRepository.GetCompanyDetailsByInvateCode(invateCode);
    } catch (err) {
      console.error("Error copmany find", err);
    }
  }
}

export default CompanyService;
