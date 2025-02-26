const express = require("express");
const app = express(); // create express app
const connectDB = require("./config/database"); // import database connection
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const cors = require("cors");
const http = require("http");
const initializeSocket = require("./utils/socket");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"], // Include PATCH here
    allowedHeaders: ["Content-Type", "Authorization"], // Include additional headers if required
  })
);




app.use(express.json()); // parse JSON bodies
app.use(cookieParser()); // parse cookies in the request headers to make it accessible

app.use("/", authRouter); // add authRouter to the app
app.use("/", profileRouter); // add profileRouter to the app
app.use("/", requestRouter); // add requestRouter to the app
app.use("/", userRouter); // add userRouter to the app

const server = http.createServer(app);
initializeSocket(server);

connectDB()
  .then(() => {
    console.log("Connected to MongoDB"); // if connection is successful
    server.listen(3000, () => {
      console.log("Listening on PORT 3000");
    }); // listen for incoming requests
  })
  .catch((err) => {
    console.log(err);
  });
