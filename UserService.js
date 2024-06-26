import UserRepository from "./UserRepository.js";
import CompanyService from "./CompanyService.js";
class UserService {
  constructor() {
    this.userRepository = new UserRepository();
    this.companyService = new CompanyService();
  }
  async SetNewPassword(userId, newPassword) {
    try {
      var resultArr = await this.userRepository.SetNewPassword(
        userId,
        newPassword
      );

      console.log("Sonuç:"+JSON.stringify(resultArr));
      if(!resultArr && resultArr.length === 0){
        return ({success:false, message:"İşlem Başarısız"});
      }
      return ({success:true, message:"İşlem Başarılı"});
    } catch (err) {
      console.error("Error validating user", err);
    }
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

  async JoinCompanyByInviteCode(inviteCode, userId) {
    try {
      let companyDetailsResult =
        await this.companyService.GetCompanyDetailsByInvateCode(inviteCode);
      if (!companyDetailsResult || companyDetailsResult.length === 0) {
        return { success: false, message: "Wrong InvateCode" };
      }
      let joinResult =
        await this.userRepository.JoinCompanyByUserIdAndCompanyId(
          userId,
          companyDetailsResult[0].CompanyId
        );
      if (!joinResult || joinResult.length === 0) {
        return { success: false, message: "Error Join Company" };
      }
      return {
        success: true,
        userCompanyId: companyDetailsResult[0].CompanyId,
        companyOwnerUserId: companyDetailsResult[0].CompanyOwnerUserId,
      };
    } catch (err) {}
  }
  async GetUserDetailsByUserIs(userId) {
    try {
      return this.userRepository.GetUserDetailsByUserIs(userId);
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
