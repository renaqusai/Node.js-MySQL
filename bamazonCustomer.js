var mysql = require("mysql");;
var inquirer = require("inquirer");
var table = require("console.table");


var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "password",
    database: "bamazonDB"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("\nWelcome to BAmazon! Take a look at our products for sale below!\n");
   
    allProducts();
});

function allProducts() {
    // query the database for all items for sale
    connection.query("SELECT * from products;", function(err, results, fields) {
        if (err) throw err;
        else {
        // console log all products
        console.table(results);
        
      }
      pickProduct();
     
    }
    
)}

function pickProduct() {
    inquirer
        .prompt([
        {
          name: "product",
          type: "input",
          message: "What is the item_id of the product you would like to buy?"
        },
        {
          name: "quantity",
          type: "input",
          message: "How many would you like to buy?"
        }
        ])
        .then(function(answer) {
            
            
            var product = answer.product;
            var quantity = answer.quantity;
            
            var queryProducts = "SELECT * FROM products WHERE ?";
            var cost 
            connection.query(queryProducts, {item_id: product}, function(err, res) {
                var productInfo = res[0];
                if (err) throw err;
                if (quantity > productInfo.stock_quantity) {
                    console.log("\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
                    console.log("I'm sorry we don't have enough in stock, choose a smaller quantity!");
                    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n"); 
                    allProducts()
                    
                }
                
                 else {
                   
                    if (quantity <= productInfo.stock_quantity) {
                        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
                        console.log("We have " + quantity + " " + productInfo.product_name + "s in stock for your order!")
                        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n"); 
                        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
                        console.log("Thank you for your order! Please wait while we process your order!");
                        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n"); 
                    } 
                    if (cost = quantity * productInfo.price) {
                        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
                        console.log("The total cost of your order is $" + cost + ".00");
                        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n"); 
                    }
                    
            var queryUpdate = "UPDATE products SET ? WHERE ?"
            connection.query(queryUpdate, [{stock_quantity: answer.quantity},{item_id: product}], function(err, res) {
                 if (err) throw err;
                 else  {   
                    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");  
                    console.log("Inventory has been updated!");
                    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n"); 
                                   
                  
                   inquirer
                   .prompt({
                    name: 'next',
                    type: "input",
                    message: 'Would you like to place another order (Yes/No)?',
                    })
                  .then(function(answer) {
                      if (answer.next === "Yes") {
                          allProducts();
                      } else {
                        connection.end()
                        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
                        console.log("Thank you for shopping with us! Come back soon!")
                        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n");
                      }
                    
                  });
                   
                    
                      }
                })
                    }

                
            })
         
        })

        
        }