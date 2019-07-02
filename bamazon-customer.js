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

// Upon running app, display all items for sale.

connection.connect(function(err) {
    if (err) throw err;
    // console.log("connected as id " + connection.threadId);
    console.log("\n ======================== \n Welcome to BAMazon!! \n ======================== \n");
    userChoice();
});

function queryAllItems() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.log("\n ======================== \n All Items For Sale \n ======================== \n");
        console.table(res);
        userChoice();
    })
};

function userChoice() {
    inquirer.prompt({
        name: "userChoice",
        type: "rawlist",
        message: "What would you like to do today?",
        choices: ["See Available Items", "Choose an item to purchase", "Exit"]
    }).then(function(answer) {
        switch (answer.userChoice) {
            case "See Available Items":
                queryAllItems();
                break;

            case "Choose an item to purchase":
                makePurchase();
                break;

            case "Exit":
                connection.end();
                break;
        }
    });
}

function makePurchase() {
    inquirer.prompt({
        name: "chosenItem",
        type: "input",
        message: "Enter the ID of the item you would like to purchase: ",
        validate: function(value) {
            
            // check whether chosenItem is a number on the list
            if (isNaN(value) === false) {
                return true;
            }else{
                console.log("Invalid selection. Please enter a different item ID.");
                return false;
            }

        }
    }).then(function(answer) {
        connection.query ("SELECT * FROM products WHERE ?", {
            item_id: answer.chosenItem
        },
        function (err, res) {
            for (var i = 0; i < res.length; i++) {
                console.log("Item ID: " + res[i].item_id + " || Product Name: " + res[i].product_name + " || Price: " + res[i].price);
            }

            // prompting user on how many units they would like to purchase

            inquirer.prompt ({
                name: "qty",
                type: "input",
                message: "How many would you like to buy?",
                validate: function(value) {
                    if (isNaN(value) === false) {
                        return true;
                    } else {
                        console.log("Insufficient Quantity. Please enter a valid quantity.");
                        return false;
                    }
                }
            }).then(function(answer) {
                for (var i = 0; i < res.length; i++) {
                    var price = res[i].price;

                    var qty = parseInt(res[i].stock_quantity);
                    var qtyNum = parseInt(answer.qty);
                    var total;

                    if (qty >= qtyNum) {
                        var quantityLeft = qty - qtyNum;

                        console.log("Item Purchased....");

                        connection.query("UPDATE products SET ? WHERE ?",
                        [{
                            stock_quantity: quantityLeft
                        },{
                            item_id: res[i].item_id
                        }
                    ],
                    function() {
                        userChoice();
                    }
                    );
                    for (var i; i < res.length; i++) {
                        total = parseInt(price * qtyNum);
                        console.log("You purchased " + res[i].item_id + " " + res[i].product_name + " for " + "$" + total.toFixed() + ". Thank you!");
                    }
                    } else if (qtyNum === 0) {
                        console.log("Please enter an ID");
                        userChoice();
                    } else {
                        console.log("Insufficient Quantity!");
                        userChoice();
                    }
                };
            });
        });
    });
    
};

