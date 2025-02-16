const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect('mongodb+srv://himanshusinghgkp18:mongodb@cluster0.o6r7uxo.mongodb.net/devTinder');
}

module.exports = connectDB;