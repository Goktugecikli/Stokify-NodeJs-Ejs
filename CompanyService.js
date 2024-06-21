import CompanyRepository from "./CompanyRepository.js";
import UserRepository from "./UserRepository.js";
import UserService from "./UserService.js";
class CompanyService {
  constructor() {
    this.companyRepository = new CompanyRepository();
  }
  #private = "Private";
  #generateRandomString(length = 10) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charactersLength);
      result += characters.charAt(randomIndex);
    }

    return result;
  }
  async IsCompanyHasProduct(productId, userName) {
    try {
      return await UserRepository.IsCompanyHasProduct(productId, userName);
    } catch (err) {
      console.log("Company Product is exists err");
    }
  }
  async Register(companyName, userName) {
    try {
      let invateCode = this.#generateRandomString();
      let registerResult = await this.companyRepository.Register(
        companyName,
        userName,
        invateCode
      );
      if (!registerResult || registerResult.length === 0) {
        return { success: false, message: "Şirket kaydı başarısız." };
      }
      let userService = new UserService();
      let joinResult = userService.JoinCompanyByInvateCode(
        invateCode,
        userName
      );
      if (!joinResult || joinResult.length === 0) {
        return { success: false, message: "Şirket kaydı başarısız. 2" };
      }

      var companyIdResult = await this.companyRepository.CompanyIdentifierById(
        registerResult[0].Id
      );
      if (!companyIdResult || companyIdResult.length === 0) {
        return { success: false, message: "Şirket kaydı başarısız. 3" };
      }

      return {
        success: true,
        redirectUrl: "/home",
        companyId: companyIdResult[0].CompanyId,
      };
    } catch (err) {
      console.error("Error copmany register", err);
    }
  }
  async GetCompanyDetailsById(companyId) {
    try {
      return await this.companyRepository.GetCompanyBuUserId(companyId);
    } catch (err) {
      console.error("Error copmany find", err);
    }
  }
  async AddProductToCompanyByUserNameAndProduct_id(product_id, userName) {
    try {
      console.log(product_id, userName);
      return await this.companyRepository.AddProductToCompanyByUserNameAndProduct_id(
        product_id,
        userName
      );
    } catch (err) {
      console.error("Error copmany find", err);
    }
  }
  async GetCompanyInviteCodeByUserId(userId) {
    try {
      let isUserOwnerResultArr = await this.companyRepository.GetUserCreatedCompanyByUserId(userId);
      if (!isUserOwnerResultArr || isUserOwnerResultArr.length === 0) {
        return {
          success: false,
          message: "Kod alınırken hata meydana geldi.",
        };
      }
      return ({success:true, inviteCode:isUserOwnerResultArr[0].InviteCode})
    } catch (err) {
      console.log("Hata meydana geldi. Hata: ", err);
    }
  }

  async GetCompanyDetailsByInvateCode(invateCode) {
    try {
      return await this.companyRepository.GetCompanyDetailsByInvateCode(
        invateCode
      );
    } catch (err) {
      console.error("Error copmany find", err);
    }
  }
}

export default CompanyService;
