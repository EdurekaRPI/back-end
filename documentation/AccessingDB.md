# Accessing MongoDB in Express.js

## Prerequisites
``npm install dotenv``

## Create environment variable file to store log in information
Create .env file
```
echo .env
```
Fill in <> with provided username, password, & IP Address
```
MONGODB_ADMIN_USER="<>"
MONGODB_ADMIN_PASSWORD="<>"
MONGODB_HOST="<>"
```

## Add ```.env``` file to ``.gitignore``
```
echo ".env" >> .gitignore
```

## Access the database
Example code, actual implementation may vary

In the main or index.js file, add:
```
require('dotenv').config();

const adminUser = process.env.MONGODB_ADMIN_USER;
const adminPassword = process.env.MONGODB_ADMIN_PASSWORD;
const mongoHost = process.env.MONGODB_HOST;
```

Connect to the DB
```
const mongoURI = `mongodb://${adminUser}:${adminPassword}@${mongoHost}:27017`;
```
