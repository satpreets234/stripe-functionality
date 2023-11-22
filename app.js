const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const {connection} =require('./connection/mongoose-connection')
const cookieParser = require("cookie-parser");
const indexRouter = require("./routers/index");
const planRouter = require("./routers/plans");
dotenv.config();
const ejs = require("ejs");
const app = express();
const path=require('path')
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
    credentials: true,
  }),
);
connection()

app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(cookieParser());
const customResponse = (res, isSuccess = true, status, data, message = "") => {
  return res
    .status(status)
    .json({ success: isSuccess, statusCode: status, data, message });
};
app.use("/", indexRouter);
app.use("/check",(req,res)=>{
  // customResponse(res,true,200,'ok','ok')
  return res
    .status(200)
    .json({message:'working fine'})
} );
app.use('/plan',planRouter);
app.use('/subscription',require('./routers/subscription'));
app.set("views", __dirname + "/views");
app.use('/uploads',express.static(path.join(__dirname,'./public')))
const setPort = process.env.PORT || 8008;
// sequelize
//   .authenticate()
//   .then(() => {
   
//   })
//   .catch((err) => {
//     console.log(err);
//   });
  app.listen(setPort, () => {
    console.log(`App is working on port number ${setPort}...`);
  });
module.exports = app;
