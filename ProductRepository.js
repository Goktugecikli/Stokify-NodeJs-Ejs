  import dbManager from "./DbManager.js";

class ProductRepository {
  constructor(dbConfig) {
    this.DbManager = new dbManager(dbConfig);
  }

  async GetProductOperationTypes() {
    try {
      await this.DbManager.connectDB(); // Veritabanına bağlan
      let query = "select * from ProductTransactionTypes";
      return await this.DbManager.queryWithResult(query, null);
    } catch (err) {
      console.error(
        "There is an error while getting product operation types at ProductRepository. Error: ",
        err
      );
    } finally {
      await this.DbManager.closeDB(); // Veritabanı bağlantısını kapat
    }
  }

  async AddProduct(productToAdd) {
    try {
      await this.DbManager.connectDB();
      let query =
        "INSERT INTO Products (ProductName, Brand, Barcode, Quantity) VALUES (@productName, @brand,@barcode, 0);SELECT SCOPE_IDENTITY() AS Id;";
      return await this.DbManager.queryWithResult(query, productToAdd);
    } catch (error) {
      console.log(
        "There is an error while adding product at ProductRepository. Error: ",
        error
      );
    } finally {
      await this.DbManager.closeDB(); // Veritabanı bağlantısını kapat
    }
  }

  async GetProductByName(name) {
    try {
      let params = {
        name: name,
      };
      await this.DbManager.connectDB();
      let query = "select Id, ProductId from products where ProductName=@name";
      return await this.DbManager.queryWithResult(query, params);
    } catch (error) {
      console.log(
        "There is an error while adding product at ProductRepository. Error: ",
        error
      );
    } finally {
      await this.DbManager.closeDB(); // Veritabanı bağlantısını kapat
    }
  }

  async ProductIsExists(product) {
    try {
      await this.DbManager.connectDB();
      let query =
        "select Id, ProductId from products where ProductName=@productName AND Brand=@brand AND Barcode=@barcode";
      return await this.DbManager.queryWithResult(query, product);
    } catch (error) {
      console.log(
        "There is an error while adding product at ProductRepository. Error: ",
        error
      );
    } finally {
      await this.DbManager.closeDB(); // Veritabanı bağlantısını kapat
    }
  }

  async GetQuantityByProductId(id) {
    try {
      let params = {
        id: id,
      };
      await this.DbManager.connectDB();
      let query = "select quantity from Products where Id=@id";
      return await this.DbManager.queryWithResult(query, params);
    } catch (error) {
      console.log(
        "There is an error while adding product at ProductRepository. Error: ",
        error
      );
    } finally {
      await this.DbManager.closeDB(); // Veritabanı bağlantısını kapat
    }
  }

  async SetQuantity(quantity, id) {
    try {
      let params = {
        quantity: quantity,
        id: id,
      };
      await this.DbManager.connectDB();
      let query =
        "UPDATE Products Set Quantity=@quantity Where Id=@id";
      return await this.DbManager.queryWithoutResult(query, params);
    } catch (error) {
      console.log("register error : " + error);
    } finally {
      await this.DbManager.closeDB(); // Veritabanı bağlantısını kapat
    }
  }

  async GetOperationTypeById(operationTypeId) {
    try {
      let params = {
        id: operationTypeId,
      };
      await this.DbManager.connectDB();
      let query = "select IsIncrease from ProductTransactionTypes where ID=@id";
      return await this.DbManager.queryWithResult(query, params);
    } catch (error) {
      console.log(
        "There is an error while adding product at ProductRepository. Error: ",
        error
      );
    } finally {
      await this.DbManager.closeDB(); // Veritabanı bağlantısını kapat
    }
  }
}

export default ProductRepository;
