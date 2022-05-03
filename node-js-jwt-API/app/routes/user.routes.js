const { authJwt } = require("../middleware");

const controller =  require("../controller/user.controller");

module.exports = function(app){
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );

        next();

    });


    //  var router = require("express").Router();

        //accessible to all Visitors to the website, whether they are signed-in or not

    app.get("/api/test/all", controller.allVisitor);
 
    //accesible to all signed-in Users, of any access level

    app.get(
        "/api/test/user", [authJwt.verifyToken], controller.allUser

    );

    //accesible to all Editors

    app.get(
        "/api/test/ed", [authJwt.verifyToken, authJwt.isEditor], controller.editorBoard
    );

    //accessible only to Admins


    app.get(
        "/api/test/admin", [authJwt.verifyToken, authJwt.isAdmin], controller.adminBoard
    );

    //route for function to delete a User (available only to an admin)

    // app.delete(
    //     "api/delete/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.delete
    // );


    // router.delete("api/delete/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.delete);


    



    


};