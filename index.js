const express = require('express')
const database = require('./database_config') 
const setupRelations = require('./models/relations')

const app = express()
const port = 3000

async function startServer() {

    try {
      await database.authenticate();
      console.log('Connection has been established successfully.');

      setupRelations();
  
      await database.sync();
      console.log('Database synced');
  
      app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
      });
    } catch (error) {
      console.error('Unable to connect to the database:', error);
      process.exit(1);
    }
  }
  

startServer()