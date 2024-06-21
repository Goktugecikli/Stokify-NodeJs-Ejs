import UserRepository from "./UserRepository.js";
import CompanyService from "./CompanyService.js";
class UserService {
  constructor() {
    this.userRepository = new UserRepository();
    this.companyService = new CompanyService();
  }

  async validateUser(username, password) {
    try {
      var result = await this.userRepository.GetUserByNameAndPassword(
        username,
        password
      );
      return result;
    } catch (err) {
      console.error("Error validating user", err);
    }
  }

  async IsExistUser(username) {
    try {
      var result = await this.userRepository.getUserById(username);
      return result;
    } catch (err) {
      console.error("Error validating user", err);
    }
  }

  async JoinCompanyByInvateCode(invateCode, userName) {
    try {
      let companyDetailsResult =
        await this.companyService.GetCompanyDetailsByInvateCode(invateCode);
      if (!companyDetailsResult || companyDetailsResult.length === 0) {
        return { success: false, message: "Wrong InvateCode" };
      }
      let userDetailsResult = await this.GetUserDetailsByUserName(userName);
      if (!userDetailsResult || userDetailsResult.length === 0) {
        return { success: false, message: "Error Get UserDetails" };
      }
      let joinResult =
        await this.userRepository.JoinCompanyByUserIdAndCompanyId(
          userDetailsResult[0].UserId,
          companyDetailsResult[0].CompanyId
        );
      if (!joinResult || joinResult.length === 0) {
        return { success: false, message: "Error Join Company" };
      }
      return ({success:true})
    } catch (err) {}
  }

  async GetUserDetailsByUserName(userName) {
    try {
      return this.userRepository.GetUserDetailsByUserName(userName);
    } catch (err) {}
  }
  async GetCompanyByUserName(userName) {
    try {
      var result = await this.userRepository.GetCompanyByUserName(userName);
      if (!result || result.length === 0) {
        return null;
      }
      var companyDetails = await this.companyService.GetCompanyDetailsById(
        result[0].CompanyId
      );
      return companyDetails;
    } catch (err) {
      console.error("Error copmany find", err);
    }
  }

  async GetCompanyByUserId(userId) {
    try {
      var result = await this.userRepository.GetCompanyByUserId(userId);
      if (!result || result.length === 0) {
        return null;
      }
      var companyDetails = await this.companyService.GetCompanyDetailsById(
        result[0].CompanyId
      );
      return companyDetails;
    } catch (err) {
      console.error("Error copmany find", err);
    }
  }
  async Register(firstName, lastName, email, userName, password) {
    try {
      var result = await this.userRepository.Register(
        firstName,
        lastName,
        email,
        userName,
        password
      );
      if (result === 0) {
        return false;
      }
      return true;
    } catch (err) {
      console.error("Error registering user :  " + err);
      return false;
    }
  }

  // Diğer metodları buraya ekleyin...
}

export default UserService;
