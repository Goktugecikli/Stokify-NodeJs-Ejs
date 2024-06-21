import CompanyService from "./CompanyService.js";
import ProductRepository from "./ProductRepository.js";

class ProductService {
  constructor() {
    this.productRepository = new ProductRepository();
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
  async AddProduct(productToAdd, userId, userCompanyId) {
    try {
      let companyService = new CompanyService();
      let product = await this.ProductIsExists(productToAdd);
      console.log(
        `Ürün Var mı Kontrol.Adet:${product.length} ürün: ${JSON.stringify(
          product
        )}`
      );
      let productTableId, resultToAdd, resultToCompany;

      if (product.length === 0) {
        // Ürün yoksa veya şirketin bu ürüne sahip olmadığı durum
        // var isCompanyHasProduct = await companyService.IsCompanyHasProduct(product[0].ProductId, userCompanyId);
        // console.log(`Şirkette bu ürün varmı. Sonu: ${JSON.stringify(isCompanyHasProduct)}`);
        resultToAdd = await this.productRepository.CreateProduct(
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
        productTableId = resultToAdd[0].Id;
        resultToCompany = companyService.AddProductToCompanyIdAndProductTableId(
          productTableId,
          userCompanyId
        );
        if (!resultToCompany || resultToCompany.length === 0) {
          return { success: false, message: "Failed to register in company." };
        }
      } else {
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
      }

      return { success: true, message: "Product added successfully." };
    } catch (err) {
      console.log("Error adding product at ProductService:", err);
      return {
        success: false,
        message: "Error occurred while adding the product.",
      };
    }
  }
}

export default ProductService;
