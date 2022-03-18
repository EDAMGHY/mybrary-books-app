const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('DB Connected...');
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = connectDB;
