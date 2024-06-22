import CompanyService from "./CompanyService.js";
import ProductRepository from "./ProductRepository.js";

class ProductService {
  constructor() {
    this.productRepository = new ProductRepository();
  }
  async GetProductTransactionTotalPageByUserIdAndPageSize(userId, pageSize) {
    try {
      return await this.productRepository.GetProductTransactionTotalPageByUserIdAndPageSize(userId, pageSize);
    } catch (err) {
      console.log(
        "There is an error while getting ProductOperationTypes at ProductService. Error",
        err
      );
    }
  }
  async GetProductTransactionByUserId(userId,pageNumber, pageSize) {
    try {
      return await this.productRepository.GetProductTransactionByUserId(userId,pageNumber,pageSize);
    } catch (err) {
      console.log(
        "There is an error while getting ProductOperationTypes at ProductService. Error",
        err
      );
    }
  }
  async GetCompanyStockPageCountByCompanIdAndPageSize(userCompanyId, pageSize) {
    try {
      return await this.productRepository.GetCompanyStockPageCountByCompanIdAndPageSize(
        userCompanyId,
        pageSize
      );
    } catch (err) {
      console.log(
        "There is an error while getting ProductOperationTypes at ProductService. Error",
        err
      );
    }
  }
  async GetCompanyStocksByCompanyId(userCompanyId, pageNumber, pageSize) {
    try {
      return await this.productRepository.GetCompanyStocksByCompanyId(
        userCompanyId,
        pageNumber,
        pageSize
      );
    } catch (err) {
      console.log(
        "There is an error while getting ProductOperationTypes at ProductService. Error",
        err
      );
    }
  }
  async GetProductOperationsTypes() {
    try {
      return await this.productRepository.GetProductOperationTypes();
    } catch (err) {
      console.log(
        "There is an error while getting ProductOperationTypes at ProductService. Error",
        err
      );
    }
  }

  async GetProductByName(name) {
    try {
      return await this.productRepository.GetProductByName(name);
    } catch (err) {
      console.log(
        "There is an error while getting ProductOperationTypes at ProductService. Error",
        err
      );
    }
  }
  async ProductIsExists(product) {
    try {
      return await this.productRepository.ProductIsExists(product);
    } catch (err) {
      console.log(
        "There is an error while getting ProductOperationTypes at ProductService. Error",
        err
      );
    }
  }

  async IsCompanyHasProduct(product, companyId) {
    try {
      return await this.productRepository.IsCompanyHasProduct(
        product,
        companyId
      );
    } catch (err) {
      console.log(
        "There is an error while getting ProductOperationTypes at ProductService. Error",
        err
      );
    }
  }

  async AddProductTransaction(
    productTableId,
    qunatity,
    userId,
    companyId,
    transactionTypeId,
    previousQuantity
  ) {
    try {
      console.log("Transaction Fonksiyonu çağırıldı");
      return await this.productRepository.AddProductTransaction(
        productTableId,
        qunatity,
        userId,
        companyId,
        transactionTypeId,
        previousQuantity
      );
    } catch (err) {
      console.log(
        "There is an error while getting ProductOperationTypes at ProductService. Error",
        err
      );
      return { success: false, message: err };
    }
  }

  async #CreateProductOperation(
    productToAdd,
    userId,
    userCompanyId,
    companyService
  ) {
    let resultToAdd = await this.productRepository.CreateProduct(
      productToAdd,
      userId,
      userCompanyId
    );
    if (!resultToAdd || resultToAdd.length === 0) {
      return {
        success: false,
        message: "Error occurred while adding the product.",
      };
    }
    let productTableId = resultToAdd[0].Id;
    let resultToCompany = companyService.AddProductToCompanyIdAndProductTableId(
      productTableId,
      userCompanyId
    );
    if (!resultToCompany || resultToCompany.length === 0) {
      return { success: false, message: "Failed to register in company." };
    }

    var transactionResulArr = await this.AddProductTransaction(
      productTableId,
      productToAdd.quantity,
      userId,
      userCompanyId,
      productToAdd.operationType,
      0
    );
    if (!transactionResulArr || transactionResulArr.lengt === 0) {
      return { success: false, message: "Transaction kaydı yapılamadı." };
    }
    return { success: true, message: "Ürün başarıyla eklendi." };
  }
  async AddProduct(productToAdd, userId, userCompanyId) {
    try {
      let companyService = new CompanyService();
      let product = await this.ProductIsExists(productToAdd);

      if (product.length === 0) {
        return await this.#CreateProductOperation(
          productToAdd,
          userId,
          userCompanyId,
          companyService
        );
      } else {
        var isCompanyHasProduct = await companyService.IsCompanyHasProduct(
          product[0].ProductId,
          userCompanyId
        );

        if (!isCompanyHasProduct || isCompanyHasProduct.length === 0) {
          return await this.#CreateProductOperation(
            productToAdd,
            userId,
            userCompanyId,
            companyService
          );
        }

        //#region Ürün Miktar hesaplama
        let currentQuantityOfProduct =
          await this.productRepository.GetQuantityByProductId(product[0].Id);
        currentQuantityOfProduct = currentQuantityOfProduct[0].quantity;

        let operationType = await this.productRepository.GetOperationTypeById(
          productToAdd.operationType
        );
        if (!operationType || operationType.length === 0) {
          return {
            success: false,
            message: `Operation type ${productToAdd.operationType} not found.`,
          };
        }

        let quantityToAdd = parseInt(productToAdd.quantity);
        if (isNaN(quantityToAdd)) {
          return {
            success: false,
            message: `Invalid quantity: ${productToAdd.quantity}`,
          };
        }

        let resultQuantity = operationType[0].IsIncrease
          ? currentQuantityOfProduct + quantityToAdd
          : currentQuantityOfProduct - quantityToAdd;

        if (resultQuantity < 0 && !operationType[0].IsIncrease) {
          return {
            success: false,
            message: `Insufficient stock. Current quantity: ${currentQuantityOfProduct}`,
          };
        }

        let result = await this.productRepository.SetQuantity(
          resultQuantity,
          product[0].Id
        );
        if (result[0] === 0) {
          return {
            success: false,
            message: "Error occurred while updating quantity.",
          };
        }

        console.log(
          `${JSON.stringify(
            product[0].Id
          )}, ${resultQuantity}, ${userId}, ${userCompanyId}`
        );

        try {
          var transactionResultArr = await this.AddProductTransaction(
            product[0].Id,
            resultQuantity,
            userId,
            userCompanyId,
            productToAdd.operationType,
            currentQuantityOfProduct
          );
          console.log(`Transaction Sonucu: ${transactionResultArr}`);
          if (!transactionResultArr || transactionResultArr.length === 0) {
            return { success: false, message: "Transaction kaydı yapılamadı." };
          }
        } catch (transactionError) {
          console.error("Transaction Error: ", transactionError);
          return {
            success: false,
            message: "Transaction sırasında bir hata meydana geldi.",
          };
        }
        //#endregion
      }
      return { success: true, message: "Stok işlemi başarıyla yapıldı." };
    } catch (err) {
      console.error("AddProduct Error: ", err);
      return {
        success: false,
        message: "Stok işleminde bir hata meydana geldi.",
      };
    }
  }
}

export default ProductService;
