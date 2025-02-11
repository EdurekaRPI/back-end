var express = require('express');
//const app = express();
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('this is a test');
});

module.exports = router;