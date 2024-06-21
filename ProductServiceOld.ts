// import { json } from "body-parser";
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
  async AddProduct(productToAdd, userName, userCompanyId) {
    try {
      // Check if product exists
      let product = await this.ProductIsExists(productToAdd);
      let id,
        currentQuantityOfProduct = 0;

      if (product.length === 0) {
        // Ürün Yoksa
        // Product does not exist, add it
        let resultToAdd = await this.productRepository.CreateProduct(
          productToAdd,
          userName
        );
        if (!resultToAdd || resultToAdd.length === 0) {
          console.log(JSON.stringify(success));
          return {
            success: false,
            message: "Error occurred while adding the product.",
          };
        }
        id = resultToAdd[0].Id;
        let companyService = new CompanyService();
        var resultToCompany =
          companyService.AddProductToCompanyByUserNameAndProduct_id(
            resultToAdd[0].AddedProductId,
            userName
          );
        if (!resultToCompany || resultToCompany.length === 0) {
          return {
            success: false,
            message: "Şirket kaydında başarısız olundu.",
          };
        }
      } else {
        // Product exists, retrieve its ID and current quantity
        id = product[0].Id;
        currentQuantityOfProduct =
          await this.productRepository.GetQuantityByProductId(product[0].Id);
      }

      currentQuantityOfProduct = currentQuantityOfProduct[0].quantity;

      // Determine operation type (increase or decrease)
      let operationType = await this.productRepository.GetOperationTypeById(
        productToAdd.operationType
      );
      if (!operationType || operationType.length === 0) {
        return {
          success: false,
          message: `Operation type ${productToAdd.operationType} not found.`,
        };
      }

      // Parse quantity to add
      let quantityToAdd = parseInt(productToAdd.quantity);
      if (isNaN(quantityToAdd)) {
        return {
          success: false,
          message: `Invalid quantity: ${productToAdd.quantity}`,
        };
      }

      // Adjust quantity based on operation type
      let resultQuantity = operationType[0].IsIncrease
        ? currentQuantityOfProduct + quantityToAdd
        : currentQuantityOfProduct - quantityToAdd;

      if (resultQuantity < 0 && !operationType[0].IsIncrease) {
        return {
          success: false,
          message: `Insufficient stock. Current quantity: ${currentQuantityOfProduct}`,
        };
      }

      // Update quantity in the database
      let result = await this.productRepository.SetQuantity(resultQuantity, id);
      if (result[0] === 0) {
        return {
          success: false,
          message: "Error occurred while updating quantity.",
        };
      }

      return { success: true };
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
