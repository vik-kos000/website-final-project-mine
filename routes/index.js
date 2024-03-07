var express = require('express');
var router = express.Router();
var fs = require("fs");

let serverArray = [];

let ExpenseObject = function (pName, pPrice, pDate, pLocationName, pCategory) {
  this.name = pName;
  this.price = pPrice;
  this.date = pDate;
  this.locationName = pLocationName;
  this.category = pCategory;
  this.id = Math.random().toString(16).slice(5);
  this.show = function(){
      return this.id + ", " + this.name + ", " + this.price + ", " + 
      this.date + ", " + this.locationName + ", " + this.category;
  };
};

let fileManager = {
  read: function() {
    var rawdata = fs.readFileSync('objectData.json');
    let goodData = JSON.parse(rawdata);
    serverArray = goodData;
},

  write: function() {
    let data = JSON.stringify(serverArray);
    fs.writeFileSync('objectData.json', data);
  },
  validData: function() {
    var rawdata = fs.readFileSync('objectData.json');
    console.log(rawdata.length);
    if(rawdata.length < 1) {
      return false;
    }
    else {
      return true;
    }
  }
};

if(!fileManager.validData()) {
  serverArray.push ( new ExpenseObject("Laptop", 1100, "2004-22-12", "Mall", "School")  );
  serverArray.push ( new ExpenseObject("Strawberries", 5, "2006-12-10", "Mall", "Food")  );
  serverArray.push ( new ExpenseObject("Blanket", 30, "2005-25-11", "Mall", "Home")  );
  fileManager.write();
}
else {
  fileManager.read(); // do have prior movies so load up the array
}

console.log(serverArray);


/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('index.html');
});

/* GET all Expense data */
router.get('/getAllExpenses', function(req, res) {
  fileManager.read()
  res.status(200).json(serverArray);
});

/* Add one new expense */
router.post('/AddExpense', function(req, res) {
  const newExpense = req.body;
  serverArray.push(newExpense);
  fileManager.write();
  res.status(200).json(newExpense);
});

// add route for delete
router.delete('/DeleteExpense/:ID', (req, res) => {
  const delID = req.params.ID;
  let pointer = GetObjectPointer(delID);
  if(pointer == -1){ // if did not find movie in array
    console.log("not found");
    return res.status(500).json({
      status: "Error - no such ID"
    });
  }
  else { // if did find the movie
    serverArray.splice(pointer, 1); // remove 1 element at index
    fileManager.write();
    res.send('Expense with ID: ' + delID + ' deleted!');
  }
});

// cycles thru the array to find the array element with a matching ID
function GetObjectPointer(whichID) {
  for ( i = 0; i < serverArray.length; i++) {
    if (serverArray[i].id == whichID) {
      return i;
    }
  }
  return -1; // flag to say did not find a movie
}

module.exports = router;
