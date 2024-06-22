import dbManager from "./DbManager.js";

class ProductRepository {
  constructor(dbConfig) {
    this.DbManager = new dbManager(dbConfig);
  }
  async IsCompanyHasProduct(product, companyId) {
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
  async GetProductTransactionByUserId(userId) {
    try {
      await this.DbManager.connectDB();
      let params = {
        userId: userId,
      };
      let query = `SELECT 
                      PT.ID as 'Transaction ID', 
                      P.ProductName AS 'Ürün İsmi',
                      U.Firstname + ' ' + U.LastName as 'Kullanıcı Ad Soyad',
                      C.Name as 'Şirket İsmi',
                      PTY.TypeName as 'İşlem Tipi',
                      PT.TransactionDate as 'İşlem Tarihi',
                      PT.PreviousQuantity as 'Önceki Miktar',
                      PT.CurrentQuantity as 'Güncel Miktar'

                      FROM ProductsTransactions AS PT WITH (NOLOCK)
                      INNER JOIN Companies AS C ON PT.CompanyId=C.CompanyId
                      INNER JOIN Products AS P on P.ProductId=PT.ProductId
                      INNER JOIN ProductTransactionTypes as PTY on PTY.ID= PT.TrancationTypeId
                      INNER JOIN Users as U ON u.UserId = pt.UserId

                    where PT.UserId=@userId`;
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
  async GetCompanyStocksByCompanyId(userCompanyId) {
    try {
      await this.DbManager.connectDB();
      let params = {companyId: userCompanyId};
      let query =`SELECT 
                    C.Name as 'Şirket İsmi',
                    P.ProductName AS 'Ürün İsmi',
                    P.Brand AS 'Marka',
                    P.Barcode AS 'Barkod No',
                    P.Quantity AS 'Miktar',
                    P.CreatedAt as 'İlk Giriş Tarihi'

                    FROM CompanyProducts AS CP WITH (NOLOCK)
                    INNER JOIN Companies AS C ON CP.CompanyId=C.CompanyId
                    INNER JOIN Products AS P on P.ProductId=CP.ProductId
                    where CP.CompanyId=@companyId`;

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
  async AddProduct(productToAdd, userName) {
    try {
      await this.DbManager.connectDB();
      let params = {
        productName: productToAdd.productName,
        brand: productToAdd.brand,
        barcode: productToAdd.barcode,
        userName: userName,
      };
      let query =
        "INSERT INTO Products (ProductName, Brand, Barcode, Quantity,CreatedBy, CreatedAt) VALUES (@productName, @brand,@barcode, 0, @userName, getDate());SELECT SCOPE_IDENTITY() AS Id;";
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
  async AddProductTransaction(
    productTableId,
    quantity,
    userId,
    companyId,
    transactionTypeId,
    previousQuantity
  ) {
    try {
      await this.DbManager.connectDB();
      let params = {
        productTableId: productTableId,
        quantity: quantity,
        userId: userId,
        companyId: companyId,
        transactionTypeId: transactionTypeId,
        previousQuantity: previousQuantity,
      };
      console.log(`TransactionRepo: ${JSON.stringify(params)}`);
      let query =
        "INSERT INTO ProductsTransactions (ProductId,UserId, CompanyId, TrancationTypeId, TransactionDate,CurrentQuantity, PreviousQuantity) VALUES ((Select ProductId from Products where Id=@productTableId), @userId, @companyId, @transactionTypeId, getDate(), @quantity, @previousQuantity);Select SCOPE_IDENTITY() as ID";
      return await this.DbManager.queryWithResult(query, params);
    } catch (error) {
      console.log(
        "There is an error while adding product transaction at ProductRepository. Error: ",
        error
      );
    } finally {
      await this.DbManager.closeDB(); // Veritabanı bağlantısını kapat
    }
  }
  async CreateProduct(productToAdd, userId) {
    try {
      await this.DbManager.connectDB();
      let params = {
        productName: productToAdd.productName,
        brand: productToAdd.brand,
        barcode: productToAdd.barcode,
        quantity: productToAdd.quantity,
        userId: userId,
      };
      let query =
        "INSERT INTO Products (ProductName, Brand, Barcode, Quantity,CreatedBy, CreatedAt) VALUES (@productName, @brand,@barcode, @quantity, @userId, getDate());SELECT SCOPE_IDENTITY() AS Id;";
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
      let query = "UPDATE Products Set Quantity=@quantity Where Id=@id";
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
