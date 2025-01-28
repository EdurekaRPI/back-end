# MongoDB Database Setup Instructions

## Prerequisites
- MongoDB installed
- Node.js installed
- Must be on RPI internet or connected to VPN

## VM Log In
```
ssh RCSID@edureka.cs.rpi.edu
```

## Check MongoDB Status
```
sudo systemctl status mongod
```

## Start, Stop, & Restart MongoDB
```
sudo systemctl start mongod
sudo systemctl stop mongod
sudo systemctl restart mongod
```

## Configure MongoDB Settings
```
sudo nano /etc/mongod.conf
```

## Accessing MongoDB Database
### Login as normal user
```
mongosh
```
### Login as admin
```
mongosh --username <> --password <>
```

## Managing MongoDB Users
### Add user
````
db.createUser([
user: "<>", pwd: "<>", 
roles: [{ role: "<>", db: "<>" }] 
])
````
### Get user list
```
db.getUsers()
```
### Delete a user
```
db.dropUser("<>")
```