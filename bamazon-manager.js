var inquirer = require("inquirer");
var mysql = require("mysql");
var table = require("console.table");
process.setMaxListeners(0);

var connection = mysql.createConnection({
    host: "localhost",
    port: 3307,
    user: "root",
    password: "root",
    database: "bamazon"
});

// Upon running app, display manager choices, view products for sale, view low inventory, add to inventory, add new product.

connection.connect(function(err) {
    if (err) throw err;
    // console.log("connected as id " + connection.threadId);
    console.log("\n ======================== \n Welcome to BAMazon Manager Portal \n ======================== \n");
    userChoice();
});

function userChoice() {
    inquirer.prompt({
        name: "userChoice",
        type: "rawlist",
        message: "What would you like to do today?",
        choices: ["See Available Items", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
    }).then(function(answer) {
        switch (answer.userChoice) {
            case "See Available Items":
                queryAllItems();
                break;

            case "View Low Inventory":
                viewLowInventory();
                break;

            case "Add to Inventory":
                addToInventory();
                break;

            case "Add New Product":
                addNewProduct();
                break;

            case "Exit":
                connection.end();
                break;
        }
    });
}

function queryAllItems() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.log("\n ======================== \n All Items For Sale \n ======================== \n");
        console.table(res);
        userChoice();
    })
};

function viewLowInventory() {
    var query = "SELECT * FROM products WHERE stock_quantity < 5"
    connection.query(query, function(err,res) {
        if (err) throw err;
        if (res.length <= 0) {
            console.log("No Items with Low Quantity!")
        } else {
            console.log();
            for (var i = 0; i < res.length; i++) {
                console.log(
                    "Product ID: " + res[i].item_id +
                    " || Product_Name: " + res[i].product_name +
                    " || Price: " + res[i].price + 
                    " || Quantity: " + res[i].stock_quantity
                );
            }
            console.log();
        }
        userChoice();
    });
}

function addToInventory () {
    inquirer.prompt([{
        name: "itemID",
        type: "input",
        message: "Enter the ID for the item you would like to add inventory for: ",
    },{
        name: "itemQTY",
        type: "input",
        message: "How much quantity would you like to add? "

    }]).then(function(answer) {
        var query = "SELECT * FROM products WHERE item_id = " + answer.itemID;
        connection.query(query, function (err, res) {
            if (err) throw err;

            // if no item ID matches the selection...

            if (res.length <= 0)
            {
                console.log("No item ID match found. Please make another selection.");
            } else {
                var item_quantity = 0;
                item_quantity = parseInt(res[0].stock_quantity) + parseInt(answer.itemQTY);
                var queryOne = "UPDATE products SET stock_quantity = " + item_quantity + " WHERE item_id = " + answer.itemID;
                connection.query(queryOne, function(err, res) {
                    if (err) throw err;
                    console.log("Quantity Added! Choose 'See Available Items' to see updated item list!");
                });
                userChoice();
            }
        })
    })
}

function addNewProduct() {
    inquirer.prompt([{
        name: "itemName",
        type: "input",
        message: "Enter Name of Item: "
    },{
        name: "itemDept",
        type: "input",
        message: "Enter Item Department: "
    },{
        name: "stock_quantity",
        type: "input",
        message: "Enter Available Quantity: "
    },{
        name: "price",
        type: "input",
        message: "Enter Item Price: "

    }]).then(function(answer) {
        var query = "INSERT INTO products (product_name, department_name, stock_quantity, price)" + "VALUES ('" + answer.itemName + "','" + answer.itemDept + "'," + answer.stock_quantity + "," + answer.price + ")";

        connection.query(query, function(err,res) {
            if (err) throw err;
            console.log("Item Added! Choose 'See Available Items' to see updated item list!")
        });

        userChoice();
    });
};