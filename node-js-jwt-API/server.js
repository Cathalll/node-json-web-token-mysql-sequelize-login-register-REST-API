const express = require("express");
const cors = require("cors");
const app = express();
var corsOptions = {
    // origin:"http://localhost:8081/jwtlogin" nb this is wrong
    origin:"http://localhost:8081/"
};
app.use(cors(corsOptions));

//parse requests content-type: application/json
app.use(express.json());

//parse requests of content-type: application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// base route 
app.get("/", (req, res) => {
    res.json({ message: "welcome to the jwt auth login application" });

});

//routes

require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/admin.routes')(app);


// set port to listen for requests

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log("Server is running on port ${PORT}.");
});

const db = require('./app/model');
const Role = db.role;


////// if you already have Users saved to your database, or are using a different pre-existing database, or wish to enter the Roles into your database manually, use this sync() method



    //db.sequelize.sync();


////// if you launching the program for the first time and have no data saved in the database, uncomment the two functions below and use this as the sync() method instead


    db.sequelize.sync({force: true}).then(() => {
        console.log('Drop and Resync database');
        initial();
    });


    function initial() {
        Role.create({
        id: 1,
        name: "user"
        });
    
        Role.create({
        id: 2,
        name: "editor"
        });
    
        Role.create({
        id: 3,
        name: "admin"
        });
    }



