const mongoose = require("mongoose");

const dbConnection = () => {
  console.log(process.env.DB_URL);

  mongoose.connect(process.env.DB_URL).then((conn) => {
    console.log(`Mongo server started on ${conn.connection.host}`);
  });
};

module.exports = dbConnection;
