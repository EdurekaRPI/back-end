const { MongoClient } = require('mongodb');

const uri = "mongodb://Admin:HtShXcVSu29MWqgcu@128.113.126.110:27017/admin";
const client = new MongoClient(uri, {
    // Remove these options
    useNewUrlParser: true,
    useUnifiedTopology: true
});

client.connect(err => {
    if (err) {
        console.error("Connection failed", err);
        return;
    }
    console.log("Connected to MongoDB!");
    // Perform operations
    client.close();
});
