DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(45) NULL,
    department_name VARCHAR(45) NULL,
    price DECIMAL (10,2) NULL,
    stock_quantity INT NOT NULL,
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Toaster, Silver", "Kitchen", 10.59, 25);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Toaster, Black", "Kitchen", 9.95, 13);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Doritos", "Food", 2.25, 15);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Band-Aid", "Pharmacy", 3.39, 50);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Bed Sheets", "Home", 59.95, 29);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Food Mixer", "Kitchen", 129.95, 20);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Television 64in", "Electronics", 988.99, 15);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Dog Food", "Pet Supplies", 39.95, 14);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Candle Sets", "Home", 24.95, 30);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Decorative Mirror", "Home", 59.99, 10);