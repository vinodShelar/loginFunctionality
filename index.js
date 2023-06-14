const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
const bodyparser = require("body-parser");
app.use(bodyparser.json());

const jwt = require("jsonwebtoken");
const jwt_pass="webfuiwebfuiwebfiuwebfuuqbqiwl";
const mongoose = require("mongoose");
const user = require("./user");

const connectDb = () => {
  try {
    const conn = mongoose.connect(
      `mongodb://127.0.0.1:27017/loginFunctionality`
    );
    console.log("Database connected successfully");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.post("/userRegistration", (req, res) => {
  try {
    const { Name, Email, Contact_No, Password } = req.body;
    const newuser = user.create({ Name, Email, Contact_No, Password });
    res.status(200).send({
      success: true,
      message: "User Registration Successfull",
      data: newuser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Server Error",
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { Email, Password } = req.body;
    const login = await user.find({ Email: Email });
    const token = jwt.sign(
      {
        username: login[0].Email,
      },
      jwt_pass,
      { expiresIn: "4h" }
    );
    res.status(200).send({
      success: true,
      message: "Login Successfully",
      data: token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Server Error",
    });
  }
});

connectDb();

app.listen(5000, () => {
  console.log("Server is listening on port 5000");
});
