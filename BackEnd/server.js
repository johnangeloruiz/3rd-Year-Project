const express = require("express")
const mysql = require('mysql')
const cors = require('cors')
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express()
app.use(cors(
  {
    origin: ["http://localhost:3000"],
    methods: ["POST, GET"],
    credentials: true
  }
))
app.use(express.json())


const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "aiesdb"
})
const queryDatabase = (sql, values) => {
  return new Promise((resolve, reject) => {
    db.query(sql, values, (err, results) => {
      if (err) {
        console.error('Database query error:', err);
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

app.post('/addtocart', async (req, res) => {
  const { productName, productStock, productPrice, userEmail } = req.body;

  const checkExistingProduct = 'SELECT * FROM cart WHERE productName = ? AND email = ?';
  const existingProduct = await queryDatabase(checkExistingProduct, [productName, userEmail]);

  if (existingProduct.length > 0) {
    // Product already exists, update quantity and price
    const updateQuery = 'UPDATE cart SET productQuantity = productQuantity + 1 WHERE productName = ?';
    await queryDatabase(updateQuery, [productName]);

    const updatePriceQuery = 'UPDATE cart SET totalPrice = ? WHERE productName = ?';
    const existingProductPrice = existingProduct[0].productPrice;
    const newProductPrice = existingProductPrice * (existingProduct[0].productQuantity + 1);

    await queryDatabase(updatePriceQuery, [newProductPrice, productName]);
    res.json({ status: 'Success', action: 'Update' });
  } else {
    // Product doesn't exist, insert new record
    const insertQuery = 'INSERT INTO cart (productName, productStock, productPrice,totalPrice, productQuantity, isCheckOut, email) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const values = [productName, productStock, productPrice, productPrice, 1, 'false', userEmail];

    try {
      await queryDatabase(insertQuery, values);
      res.json({ status: 'Success', action: 'Insert' });
    } catch (error) {
      console.error('Error during insertion:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});


app.post('/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    // Validate input fields (add your own validation logic)
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: 'Incomplete data provided.' });
    }

    // Hash the password before storing in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the user with hashed password into MySQL
    const insertQuery = 'INSERT INTO accounts (firstName, lastName, email, password) VALUES (?, ?, ?, ?)';
    const values = [firstName, lastName, email, hashedPassword];

    // Execute the query
    db.query(insertQuery, values, (error, results) => {
      if (error) {
        console.error('Error during registration:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      res.status(201).json({ status: 'Success' });
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const sql = "SELECT * FROM accounts WHERE email = ?";
    db.query(sql, [req.body.email], (err, data) => {
      if (err) {
        console.error('Database query error:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (data.length > 0) {
        const storedPassword = data[0].password;
        const enteredPassword = req.body.password;

        bcrypt.compare(enteredPassword, storedPassword, (compareErr, passwordMatch) => {
          if (compareErr) {
            console.error('Password comparison error:', compareErr);
            return res.status(500).json({ error: 'Internal Server Error' });
          }

          if (passwordMatch) {
            console.log('Password Match');
            return res.json({ status: 'Success' });
          } else {
            console.log('Password Mismatch');
            return res.json({ error: 'Password not Match' });
          }
        });
      } else {
        return res.json({ error: 'No email existed' });
      }
    });
  } catch (error) {
    console.error('Login route error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});





const insertQuery = 'INSERT INTO products (id, productName, productStock, productPrice) VALUES (?, ?, ?, ?)'
const values = [1, "Long Churros", 4, 5]

const CondensedMilkCheeseBalls = 'INSERT INTO products (id, productName, productStock, productPrice) VALUES (?, ?, ?, ?)'
const CMCBvalue = [2, "Condensed Milk Cheese Balls", 4, 5]

const ChocolateChipCookies = 'INSERT INTO products (id, productName, productStock, productPrice) VALUES (?, ?, ?, ?)'
const CCCvalue = [3, "Chocolate Chip Cookies", 4, 5]

const BrownieBites = 'INSERT INTO products (id, productName, productStock, productPrice) VALUES (?, ?, ?, ?)'
const BBvalue = [4, "Brownie Bites", 3, 5]

const checkAndInsert = async (query, values) => {
  // Check if the product already exists
  const duplicateCheckQuery = 'SELECT * FROM products WHERE id = ?';
  const duplicateCheckValues = [values[0]]; // Assuming id is the primary key

  const duplicateProducts = await queryDatabase(duplicateCheckQuery, duplicateCheckValues);

  if (duplicateProducts.length > 0) {
    console.log(`Product with ID ${values[0]} already exists. Skipping insertion.`);
  } else {
    // Insert the product
    await queryDatabase(query, values);
    console.log(`Product with ID ${values[0]} inserted successfully.`);
  }
};


checkAndInsert(insertQuery, values);
checkAndInsert(CondensedMilkCheeseBalls, CMCBvalue);
checkAndInsert(ChocolateChipCookies, CCCvalue);
checkAndInsert(BrownieBites, BBvalue);

app.get('/products', async (req, res) => {
  try {
    const sql = "SELECT * FROM products";
    const products = await queryDatabase(sql);
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.get('/cart', async (req, res) => {
  try {
    // Retrieve the user's email from the request or from the user's session (e.g., localStorage)
    const userEmail = req.query.email 

    // Use the user's email to fetch only the items in the cart associated with that email
    const sql = "SELECT * FROM cart WHERE email = ?";
    const products = await queryDatabase(sql, [userEmail]);
    res.json(products);
  } catch (error) {
    console.error('Error fetching products from cart:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/updateQuantity', async (req, res) => {
  try {
    const { productName, quantity } = req.body;
    const getProductQuery = 'SELECT * FROM cart WHERE productName = ?';
    const product = await queryDatabase(getProductQuery, [productName]);

    // Calculate the new total price based on the updated quantity
    const newTotalPrice = product[0].productPrice * quantity;

    // Update both quantity and total price in the database
    const updateQuery = 'UPDATE cart SET productQuantity = ?, totalPrice = ? WHERE productName = ?';
    await queryDatabase(updateQuery, [quantity, newTotalPrice, productName]);

    res.json({ status: 'Success', message: 'Quantity and total price updated successfully' });
  } catch (error) {
    console.error('Error updating quantity:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.post('/updateAllCheckOut', async (req, res) => {
  try {
    const { checkedItems } = req.body;

    // Check if checkedItems is iterable (an array)
    if (!Array.isArray(checkedItems)) {
      throw new TypeError('checkedItems is not an array');
    }

    // Update isCheckOut to true for checked items
    for (const item of checkedItems) {
      const { id } = item; // Assuming there is an 'id' field in the checked item
      const updateQuery = 'UPDATE cart SET isCheckOut = true WHERE id = ?';
      await queryDatabase(updateQuery, [id]);
    }

    res.json({ success: true, message: 'All isCheckOut and checked items updated successfully' });
  } catch (error) {
    console.error('Error updating all isCheckOut and checked items:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.post('/turnfalse', async (req, res) => {
  try {
    const sql = 'UPDATE cart SET isCheckOut = false'
    await queryDatabase(sql);
  } catch (error) {
    console.error('Error updating all isCheckOut and checked items:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})
app.get('/checkoutcod', async (req, res) => {
  try {
    const getItem = "SELECT * FROM cart WHERE isCheckOut = true";
    const products = await queryDatabase(getItem);
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/purchase', async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the user has provided a meetUpPlace and cellphoneNumber
    const userCheckQuery = 'SELECT * FROM accounts WHERE email = ? AND (meetUpPlace IS NULL OR cellphoneNumber IS NULL OR cellphoneNumber = 0)';
    const user = await queryDatabase(userCheckQuery, [email]);

    if (user.length > 0) {
      // Include the redirect path in the response
      return res.json({
        requireRedirect: true,
        redirectTo: '/SetupAccount',
        error: 'meetUpPlace and cellphoneNumber are required for purchase'
      });
    }

    console.log('Purchase logic executed successfully.');

    // Send email notification to admin
    const adminTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const adminMailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: 'angelo.ruiz44444@gmail.com',
      subject: 'New Purchase Notification',
      text: 'A new purchase has been made. Check your admin dashboard for details.',
    };

    adminTransporter.sendMail(adminMailOptions, (adminError, adminInfo) => {
      if (adminError) {
        console.error('Error sending admin email:', adminError);
        // Handle error response to client
        res.status(500).json({ success: false, error: 'Internal Server Error' });
      } else {
        console.log('Admin email sent:', adminInfo.response);

        // Send email notification to user
        const userTransporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
          },
        });

        const userMailOptions = {
          from: process.env.EMAIL_USERNAME,
          to: email, // Use the user's email from the request
          subject: 'Order Confirmation',
          text: 'Thank you for your purchase! Your order has been placed successfully.',
        };

        userTransporter.sendMail(userMailOptions, (userError, userInfo) => {
          if (userError) {
            console.error('Error sending user email:', userError);
            // Handle error response to client
            res.status(500).json({ success: false, error: 'Internal Server Error' });
          } else {
            console.log('User email sent:', userInfo.response);
            // Handle success response to client
            res.json({ success: true, message: 'Purchase completed successfully.' });
          }
        });
      }
    });

  } catch (error) {
    console.error('Error during purchase:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});



app.post('/orderPurchaseDetails', async (req, res) => {
  try {
    const { email } = req.body;
    const { paymentMethod } = req.body
    // Fetch the cart details
    const getCart = 'SELECT * FROM cart WHERE isCheckOut = 1';
    const cartItems = await queryDatabase(getCart);

    // Fetch the account details
    const getAccountDetails = 'SELECT * FROM accounts WHERE email = ?';
    const user = await queryDatabase(getAccountDetails, [email]);

    // Check if the selectedLocation is Alfonso to determine the shippingFee
    const selectedLocation = user[0].selectedLocation;
    let shippingFee = 0;
    if (selectedLocation === 'Alfonso') {
      shippingFee = 0;
    } else {
      shippingFee = 38;
    }

    // Calculate the new totalPrice by adding shippingFee to each product's totalPrice
    const updatedCartItems = cartItems.map(item => ({
      ...item,
      totalPrice: item.totalPrice + shippingFee
    }));

    // Insert the details into the sales database
    const insertSalesDetails = 'INSERT INTO sales (firstname, lastname, buyer, productName, productStock,cellphoneNumber,  productPrice, productQuantity, totalPrice, meetUpPlace, typeOfPayment, selectedLocation, dateOfPurchase,shippingFee, timeOfPurchase, adminApproval, newItem, dateOfDelivery) VALUES (?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?)';

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 10); // yyyy-mm-dd
    const formattedTime = currentDate.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' });

    for (const item of updatedCartItems) {
      const values = [
        user[0].firstname,
        user[0].lastname,
        email,
        item.productName,
        item.productStock,
        user[0].cellphoneNumber,
        item.productPrice,
        item.productQuantity,
        item.totalPrice,
        user[0].meetUpPlace || 'N/A', // Default to 'N/A' if meetUpPlace is not available
        paymentMethod || 'N/A', // Default to 'N/A' if typeOfPayment is not available
        selectedLocation || req.body.selectedLocation || 'N/A', // Default to 'N/A' if selectedLocation is not available
        formattedDate,
        shippingFee,
        formattedTime,
        "waiting",
        "new",
        ""
      ];
      await queryDatabase(insertSalesDetails, values);
    }
    const delCart = 'DELETE FROM cart WHERE isCheckOut = 1';
    const delItems = await queryDatabase(delCart);

    res.json({ success: true, message: 'Purchase details added to sales successfully.' });
  } catch (error) {
    console.error('Error adding purchase details to sales:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});
app.post('/removeItem', async (req, res) => {
  try {
    const { productName } = req.body;

    // Check if the product exists in the cart
    const checkExistingProduct = 'SELECT * FROM cart WHERE productName = ?';
    const existingProduct = await queryDatabase(checkExistingProduct, [productName]);

    if (existingProduct.length > 0) {
      // Product exists, proceed to remove it
      const removeQuery = 'DELETE FROM cart WHERE productName = ?';
      await queryDatabase(removeQuery, [productName]);

      res.json({ success: true, message: 'Item removed successfully.' });
    } else {
      // Product not found in the cart
      res.json({ success: false, message: 'Item not found in the cart.' });
    }
  } catch (error) {
    console.error('Error removing item:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.post('/updateUserDetails', async (req, res) => {
  const { email, location, cellphoneNumber, selectedLocation } = req.body;

  // Check if the user exists
  const userCheckQuery = 'SELECT * FROM accounts WHERE email = ?';
  const existingUser = await queryDatabase(userCheckQuery, [email]);

  if (existingUser.length === 0) {
    return res.status(404).json({ error: 'User not found', prompt: 'User with the provided email does not exist.' });
  }

  // Update location and cellphone number
  const updateQuery = 'UPDATE accounts SET meetUpPlace = ?, cellphoneNumber = ?, selectedLocation = ? WHERE email = ?';
  const values = [location, cellphoneNumber, selectedLocation, email];

  try {
    await queryDatabase(updateQuery, values);
    res.json({ status: 'Success', message: 'User details updated successfully.' });
  } catch (error) {
    console.error('Error updating user details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.post('/sendMessage', (req, res) => {
  try {
    // Extract form data from the request body
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 10); // yyyy-mm-dd
    const formattedTime = currentDate.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const { firstName, lastName, email, cellphoneNumber, subject, message } = req.body;

    const insertContactUsQuery = 'INSERT INTO contactus (firstName, lastName, email, cellphoneNumber, subject, message, dateOfMessage, timeOfmessage) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

    db.query(insertContactUsQuery, [firstName, lastName, email, cellphoneNumber, subject, message, formattedDate, formattedTime], (err, result) => {
      if (err) {
        console.error('Error inserting data into contactus table:', err);

        // Send an error response back to the client
        return res.status(500).json({ success: false, error: 'Internal Server Error' });
      }

      // Send a success response back to the client
      res.json({ success: true, message: 'Message sent and saved successfully!' });
    });
  } catch (error) {
    console.error('Error handling form submission:', error);

    // Send an error response back to the client
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.get('/getContactUs', async (req, res) => {
  try {
    const sql = "SELECT * FROM contactus"
    const messages = await queryDatabase(sql)
    res.json(messages);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

//Get Sales
app.get('/getSalesWaiting', async (req, res) => {
  try {
    const getItem = "SELECT * FROM sales WHERE adminApproval = 'waiting'";
    const sales = await queryDatabase(getItem)
    res.json(sales);

  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})
app.get('/getSalesApproved', async (req, res) => {
  try {
    const getItem = "SELECT * FROM sales WHERE adminApproval = 'approved'";
    const sales = await queryDatabase(getItem)
    res.json(sales);

  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})
app.get('/getSalesCancelled', async (req, res) => {
  try {
    const getItem = "SELECT * FROM sales WHERE adminApproval = 'cancelled'";
    const sales = await queryDatabase(getItem)
    res.json(sales);

  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})
app.get('/getSalesCompleted', async (req, res) => {
  try {
    const getItem = "SELECT * FROM sales WHERE adminApproval = 'completed'";
    const sales = await queryDatabase(getItem)
    res.json(sales);

  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

//Set Sales
app.post('/setSalesApprove', async (req, res) => {
  try {
    const { productName } = req.body;
    console.log(productName)
    // Update the database to mark the sale as approved
    const updateSql = `UPDATE sales SET adminApproval = 'approved', newItem = 'new' WHERE productName = ?`;
    await queryDatabase(updateSql, [productName]);

    // Fetch user email from the database based on productName
    const getEmailSql = 'SELECT buyer FROM sales WHERE productName = ?';
    const [userData] = await queryDatabase(getEmailSql, [productName]);
    const userEmail = userData.buyer;

    // Create a Nodemailer transporter for admin
    const adminTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME, // Replace with your Gmail email
        pass: process.env.EMAIL_PASSWORD, // Replace with your Gmail password or an application-specific password
      },
    });

    // Compose the email for admin
    const adminMailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: "aiestreats@gmail.com",
      subject: 'Order Approved',
      text: `Order with Product Name ${productName} has been approved.`,
    };

    // Send the email to admin
    await adminTransporter.sendMail(adminMailOptions);

    // Create a Nodemailer transporter for user
    const userTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Compose the email for user
    const userMailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: userEmail, // Use the user's email from the request
      subject: 'Order Approved',
      text: 'Your order has been approved. Thank you for shopping with us!',
    };

    // Send the email to user
    await userTransporter.sendMail(userMailOptions);

    // Send a success response
    res.json({ success: true, message: 'Sale approved successfully. Emails sent.' });
  } catch (error) {
    console.error('Error approving sale:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/itemOnDelivery', async (req, res) => {
  try {
    // Extract relevant information from the request body
    const { productName, buyer } = req.body;

    // Your existing logic for updating the database can go here

    // Send an email to the user
    const userTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const userMailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: buyer, // Use the user's email from the request
      subject: 'Item On Delivery',
      text: `Your item (${productName}) is now on delivery. Thank you for shopping with us! Please provide the right amount.`,
    };

    userTransporter.sendMail(userMailOptions, (userError, userInfo) => {
      if (userError) {
        console.error('Error sending user email:', userError);
        // Handle error response to client
        res.status(500).json({ success: false, error: 'Internal Server Error' });
      } else {
        console.log('User email sent:', userInfo.response);
        // Handle success response to client
        res.json({ success: true, message: 'Item on delivery. Email sent.' });
      }
    });
  } catch (error) {
    console.error('Error processing item on delivery:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.post('/setSalesCancelled', async (req, res) => {
  try {
    const { productName } = req.body;

    const updateSql = `UPDATE sales SET adminApproval = 'cancelled', newItem = 'new' WHERE productName = ?`;
    await queryDatabase(updateSql, [productName]);

    // Fetch user email from the database based on productName
    const getEmailSql = 'SELECT buyer FROM sales WHERE productName = ?';
    const [userData] = await queryDatabase(getEmailSql, [productName]);
    const userEmail = userData.buyer;

    // Create a Nodemailer transporter for admin
    const adminTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Compose the email for admin
    const adminMailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: "aiestreats@gmail.com",
      subject: 'Order Cancelled',
      text: `Order with Product Name ${productName} has been cancelled.`,
    };

    // Send the email to admin
    await adminTransporter.sendMail(adminMailOptions);

    // Create a Nodemailer transporter for user
    const userTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Compose the email for user
    const userMailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: userEmail,
      subject: 'Order Cancelled',
      text: 'Your order has been cancelled. We apologize for any inconvenience.',
    };

    // Send the email to user
    await userTransporter.sendMail(userMailOptions);

    res.json({ success: true, message: 'Sale cancelled successfully. Emails sent.' });
  } catch (error) {
    console.error('Error cancelling sale:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/setSalesCompleted', async (req, res) => {
  try {
    const { productName } = req.body;

    const updateSql = `UPDATE sales SET adminApproval = 'completed', newItem = 'new' WHERE productName = ?`;
    await queryDatabase(updateSql, [productName]);

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 10);

    const updateDateOfDelivery = `UPDATE sales SET dateOfDelivery = ? WHERE productName = ?`;
    await queryDatabase(updateDateOfDelivery, [formattedDate, productName]);

    const selectSaleDetails = `SELECT productQuantity FROM sales WHERE productName = ?`;
    const [saleDetails] = await queryDatabase(selectSaleDetails, [productName]);

    if (saleDetails) {
      const { productQuantity } = saleDetails;

      console.log(`Updating productStock for productName ${productName} with quantity ${productQuantity}`);

      const updateProductStock = `UPDATE products SET productStock = productStock - ? WHERE productName = ?`;
      const updateResult = await queryDatabase(updateProductStock, [productQuantity, productName]);

      console.log('Update Result:', updateResult);
    }

    // Fetch user email from the database based on productName
    const getEmailSql = 'SELECT buyer FROM sales WHERE productName = ?';
    const [userData] = await queryDatabase(getEmailSql, [productName]);
    const userEmail = userData.buyer;

    const adminTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const adminMailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: "aiestreats@gmail.com",
      subject: 'Order Completed',
      text: `Order with Product Name ${productName} has been completed.`,
    };

    await adminTransporter.sendMail(adminMailOptions);

    const userTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const userMailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: userEmail,
      subject: 'Order Completed',
      text: 'Your order has been completed. Thank you for shopping with us!',
    };

    await userTransporter.sendMail(userMailOptions);

    res.json({ success: true, message: 'Sale completed successfully. Emails sent.' });
  } catch (error) {
    console.error('Error completing sale:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/buyNow', async (req, res) => {
  const { productName, productStock, productPrice } = req.body
  const insertQuery = 'INSERT INTO cart (productName, productStock, productPrice,totalPrice, productQuantity, isCheckOut) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [productName, productStock, productPrice, productPrice, 1, true];

  try {
    await queryDatabase(insertQuery, values);
    res.json({ status: 'Success', action: 'Insert' });
  } catch (error) {
    console.error('Error during insertion:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

});
app.get('/getProductsAdmin', async (req, res) => {
  try {
    const sql = "SELECT * FROM products"
    const product = await queryDatabase(sql)
    res.json(product)
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})
// Function to update product price
app.post('/updateProductPrice', async (req, res) => {
  try {
    const { productId, newPrice } = req.body;

    // Update product price logic
    const updateQuery = 'UPDATE products SET productPrice = ? WHERE id = ?';
    await queryDatabase(updateQuery, [newPrice, productId]);

    res.json({ success: true, message: 'Product price updated successfully' });
  } catch (error) {
    console.error('Error updating product price:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Function to update product stock
app.post('/updateProductStock', async (req, res) => {
  try {
    const { productId, newStock } = req.body;

    // Update product stock logic
    const updateQuery = 'UPDATE products SET productStock = ? WHERE id = ?';
    await queryDatabase(updateQuery, [newStock, productId]);

    res.json({ success: true, message: 'Product stock updated successfully' });
  } catch (error) {
    console.error('Error updating product stock:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.get('/getItemsAdminWaiting', async (req, res) => {
  try {
    const sql = "SELECT * FROM sales WHERE adminApproval = 'waiting' AND newItem = 'new' ";
    const results = await queryDatabase(sql);
    res.json(results);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.get('/getItemsAdminApproved', async (req, res) => {
  try {
    const sql = "SELECT * FROM sales WHERE adminApproval = 'approved' AND newItem = 'new'";
    const results = await queryDatabase(sql);
    res.json(results);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.get('/getItemsAdminCompleted', async (req, res) => {
  try {
    const sql = "SELECT * FROM sales WHERE adminApproval = 'completed' AND newItem = 'new'";
    const results = await queryDatabase(sql);
    res.json(results);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.get('/getItemsAdminCancelled', async (req, res) => {
  try {
    const sql = "SELECT * FROM sales WHERE adminApproval = 'cancelled' AND newItem = 'new'";
    const results = await queryDatabase(sql);
    res.json(results);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.post('/updateProductWaitingAdmin', async (req, res) => {
  try {
    // Perform the logic to update the product records in the database
    const updateSql = 'UPDATE sales SET newItem = "old" WHERE adminApproval = "waiting"';
    await queryDatabase(updateSql);

    // Send a success response
    res.json({ success: true, message: 'Products updated successfully' });
  } catch (error) {
    console.error('Error updating products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.post('/updateProductApprovedAdmin', async (req, res) => {
  try {
    // Perform the logic to update the product records in the database
    const updateSql = 'UPDATE sales SET newItem = "old" WHERE adminApproval = "approved"';
    await queryDatabase(updateSql);

    // Send a success response
    res.json({ success: true, message: 'Products updated successfully' });
  } catch (error) {
    console.error('Error updating products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.post('/updateProductCompletedAdmin', async (req, res) => {
  try {
    // Perform the logic to update the product records in the database
    const updateSql = 'UPDATE sales SET newItem = "old" WHERE adminApproval = "completed"';
    await queryDatabase(updateSql);

    // Send a success response
    res.json({ success: true, message: 'Products updated successfully' });
  } catch (error) {
    console.error('Error updating products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.post('/updateProductCancelledAdmin', async (req, res) => {
  try {
    // Perform the logic to update the product records in the database
    const updateSql = 'UPDATE sales SET newItem = "old" WHERE adminApproval = "cancelled"';
    await queryDatabase(updateSql);

    // Send a success response
    res.json({ success: true, message: 'Products updated successfully' });
  } catch (error) {
    console.error('Error updating products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.get('/getNewItemsCount', async (req, res) => {
  try {
    // Assuming 'newItem' is a column in the 'sales' table
    const countQuery = 'SELECT COUNT(*) AS count FROM sales WHERE newItem = "new"';
    const countResult = await queryDatabase(countQuery);

    const count = countResult[0].count; // Assuming the count is returned as 'count' in the result

    res.json({ count });
  } catch (error) {
    console.error('Error fetching new items count:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/getDataAccount', async (req, res) => {
  try {
    const { email } = req.query; // Assuming email is provided as a query parameter

    if (!email) {
      return res.status(400).json({ error: 'Email parameter is required.' });
    }

    const sql = 'SELECT * FROM accounts WHERE email = ?';
    const accountData = await queryDatabase(sql, [email]);

    if (accountData.length === 0) {
      return res.status(404).json({ error: 'Account not found.' });
    }

    res.json({ account: accountData[0] });
  } catch (error) {
    console.error('Error fetching account data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/getOrders', async (req, res) => {
  try {
    const { email } = req.query; // Assuming email is provided as a query parameter

    if (!email) {
      return res.status(400).json({ error: 'Email parameter is required.' });
    }

    const sql = 'SELECT * FROM sales WHERE buyer = ?';
    const ordersData = await queryDatabase(sql, [email]);

    if (ordersData.length === 0) {
      return res.status(404).json({ error: 'Orders not found for the specified email.' });
    }

    res.json({ orders: ordersData });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/updatePassword', async (req, res) => {
  try {
    const { email, oldPassword, newPassword, confirmPassword } = req.body;

    // Retrieve the user from the database
    const selectQuery = 'SELECT * FROM accounts WHERE email = ?';
    const user = await queryDatabase(selectQuery, [email]);

    if (user.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const hashedOldPassword = user[0].password;

    // Compare the old password with the stored hash
    const oldPasswordMatch = await bcrypt.compare(oldPassword, hashedOldPassword);

    if (!oldPasswordMatch) {
      return res.status(401).json({ error: 'Old password is incorrect' });
    }

    // Add your password validation logic here (similar to the previous code)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        error: 'Invalid new password. It must have at least one uppercase letter, one lowercase letter, one number, and be at least 8 characters long.'
      });
    }

    // Check if the new password matches the confirmation password
    if (newPassword !== confirmPassword) {
      console.log(newPassword)
      console.log(confirmPassword)
      return res.status(400).json({ error: 'New password and confirmation password do not match' });
    }

    // Hash the new password before updating it in the database
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
    const updatePasswordQuery = 'UPDATE accounts SET password = ? WHERE email = ?';
    await queryDatabase(updatePasswordQuery, [hashedNewPassword, email]);

    console.log('Password updated successfully.')
    res.json({ success: true, message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/newMeetUpPlace', async (req, res) => {
  try {
    const { email, newMeetUpPlace } = req.body;

    const updateMeetUpPlaceQuery = 'UPDATE accounts SET meetUpPlace = ? WHERE email = ?';
    await queryDatabase(updateMeetUpPlaceQuery, [newMeetUpPlace, email]);
    console.log('Meet Up Place updated successfully.');
    res.json({ success: true, message: 'Meet Up Place updated successfully.' });
  } catch (error) {
    console.error('Error updating meet-up place:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.post('/newSelectedLocation', async (req, res) => {
  try {
    const { email, newSelectedLocation } = req.body;

    const updateSelectedLocationQuery = 'UPDATE accounts SET selectedLocation = ? WHERE email = ?';
    await queryDatabase(updateSelectedLocationQuery, [newSelectedLocation, email]);

    console.log('Selected Location updated successfully.');
    res.json({ success: true, message: 'Selected Location updated successfully.' });
  } catch (error) {
    console.error('Error updating selected location:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/newCellphoneNumber', async (req, res) => {
  try {
    const { email, newCellphoneNumber } = req.body;
    // Add your validation logic for the new cellphone number here

    const updateCellphoneNumberQuery = 'UPDATE accounts SET cellphoneNumber = ? WHERE email = ?';
    await queryDatabase(updateCellphoneNumberQuery, [newCellphoneNumber, email]);

    console.log('Cellphone Number updated successfully.');
    res.json({ success: true, message: 'Cellphone Number updated successfully.' });
  } catch (error) {
    console.error('Error updating cellphone number:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/getCartData', async (req, res) => {
  try {
    const email = req.query.email; // Extract email from query parameters
    const sql = "SELECT * FROM cart WHERE email = ?";
    const items = await queryDatabase(sql, [email]); // Assuming queryDatabase takes parameters
    res.json(items);
  } catch (error) {
    console.error('Error fetching cart data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.get('/getOrdersWaiting', async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: 'Email parameter is required.' });
    }

    const getItem = 'SELECT * FROM sales WHERE adminApproval = "waiting" AND buyer = ?';
    const sales = await queryDatabase(getItem, [email]);
    res.json(sales);
  } catch (error) {
    console.error('Error fetching waiting orders:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/getOrdersApproved', async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: 'Email parameter is required.' });
    }

    const getItem = 'SELECT * FROM sales WHERE adminApproval = "approved" AND buyer = ?';
    const sales = await queryDatabase(getItem, [email]);
    res.json(sales);
  } catch (error) {
    console.error('Error fetching approved sales:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/getOrdersCancelled', async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: 'Email parameter is required.' });
    }

    const getItem = 'SELECT * FROM sales WHERE adminApproval = "cancelled" AND buyer = ?';
    const sales = await queryDatabase(getItem, [email]);
    res.json(sales);
  } catch (error) {
    console.error('Error fetching cancelled sales:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/getOrdersCompleted', async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: 'Email parameter is required.' });
    }

    const getItem = 'SELECT * FROM sales WHERE adminApproval = "completed" AND buyer = ?';
    const sales = await queryDatabase(getItem, [email]);
    res.json(sales);
  } catch (error) {
    console.error('Error fetching completed sales:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.post('/cancelOrderCustomer', async (req, res) => {
  try {
    const { saleId } = req.body;

    if (!saleId) {
      return res.status(400).json({ error: 'Sale ID is required.' });
    }

    // Assuming your SQL query to update the adminApproval field
    const updateQuery = 'UPDATE sales SET adminApproval = "cancelled" WHERE id = ?';
    const updateResult = await queryDatabase(updateQuery, [saleId]);

    if (updateResult.affectedRows > 0) {
      // The update was successful
      return res.status(200).json({ message: 'Order cancelled successfully.' });
    } else {
      return res.status(404).json({ error: 'Order not found or could not be cancelled.' });
    }
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})
app.listen(8081, () => {
  console.log("listening")
})