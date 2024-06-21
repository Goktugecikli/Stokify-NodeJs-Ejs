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
  async Register(companyName, userId) {
    try {
      //#region Kullanıcı daha önce şirket kaydetmiş mi kontrol et
      let isUserOwnerResultArr = await this.companyRepository.GetUserCreatedCompanyByUserId(userId);
      if (isUserOwnerResultArr.length > 0) {
        console.log("Test: "+JSON.stringify(isUserOwnerResultArr));
        return {
          success: false,
          message: "Daha önce bir şirket kaydı yaptırmışsınız. Lütfen yeni bir kayıt için yetkili ile iletişime geçiniz.",
        };
      }
      //#endregion

      //#region Katılım Numarası Oluştur
      let inviteCode = this.#generateRandomString();
      let registerResult = await this.companyRepository.Register(
        companyName,
        userId,
        inviteCode
      );
      if (!registerResult || registerResult.length === 0) {
        return { success: false, message: "Şirket kaydı başarısız." };
      }
      //#endregion
      let userService = new UserService();
      
      //#region Şirkete çalışan olarak kayıt et
      let joinResult = userService.JoinCompanyByInviteCode(
        inviteCode,
        userId
      );
      if (!joinResult || joinResult.length === 0) {
        return { success: false, message: "Şirket kaydı başarısız. 2" };
      }
      //#endregion 
      
      //#region Kurulan şirket bilgilerini al
      var companyIdResult = await this.companyRepository.CompanyDetailsById(
        registerResult[0].Id
      );
      if (!companyIdResult || companyIdResult.length === 0) {
        return { success: false, message: "Şirket kaydı başarısız. 3" };
      }
      //#endregion
      
      return {
        success: true,
        redirectUrl: "/home",
        companyId: companyIdResult[0].CompanyId,
        companyOwnerUserId: companyIdResult[0].CompanyOwnerUserId
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
  async AddProductToCompanyIdAndProductTableId(productTableId, copmanyId) {
    try {
        return await this.companyRepository.AddProductToCompanyIdAndProductTableId(
        productTableId,
        copmanyId
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
