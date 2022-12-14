const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./routes/auth');
const app = express();
const PORT = 3000;
const DB = "mongodb+srv://kennylisal:testing123@cluster0.jmoba7w.mongodb.net/?retryWrites=true&w=majority";

//middleware
app.use(express.json());
app.use(authRouter);

//connection
//kennylisal - testing123
mongoose.connect(DB).then(() => {
    console.log("connection succesfull");
}).catch((e) => {
    console.log(e);
})





app.listen(PORT, "0.0.0.0", () => {
    console.log('connected at port' + PORT);
});