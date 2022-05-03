///routes reserved onyl for Admins

const { authJwt } = require("../middleware");

const controller =  require("../controller/admin.controller");

var router = require("express").Router();


module.exports = app => {


    router.delete("/delete/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.delete);


    app.use('/api/admin', router,function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );

        next();

    });

    






};