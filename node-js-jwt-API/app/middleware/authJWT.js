const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const db = require("../model");
const User = db.user;
// first check that there is a token present in request
verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];
    if(!token){
        return res.status(403).send({
            message:"No token found!"
        });
    }//end of if(!token)

    //second check if token is correct one (if it is associated with
    //the correct role)

    jwt.verify(token, config.secret, (err,decoded) =>{
        if(err){
            return res.status(401).send({
                message: "You do not have the required authorization to view this content!"
            });
        }
        req.userId = decoded.id
        next();
    });


};

isAdmin = (req, res, next) => {
    User.findByPk(req.userId).then(user =>{
        user.getRoles().then(roles => {
            for(let i=0; i< roles.length; i++){
                if(roles[i].name === "admin"){
                    next();
                    return;
                }
            }//else
            res.status(403).send({
                message: "Sorry, must be an Admin to access!"
            });
            return;
        });
    });
};


isEditor = (req, res, next) => {
    User.findByPk(req.userId).then(user =>{
        user.getRoles().then(roles => {
            for(let i=0; i< roles.length; i++){
                if(roles[i].name === "editor"){
                    next();
                    return;
                }
            }//else
            res.status(403).send({
                message: "Sorry, must be an Editor to access!"
            });
            // return;
        });
    });
};

//nb User can have more than one Role
isEditorOrAdmin = (req, res, next) => {
    User.findByPk(req.userId).then(user => {
        user.getRoles().then( roles =>{
            for(let i = 0; i< roles.length; i++){
                if(roles[i].name === "editor"){
                    next();
                    return;
                }
                if(roles[i].name === "admin"){
                    next();
                    return;

                }
            }
            //role[i].name condition not fulfilled
            res.status(403).send({
                message: "You must be an Editor or Admin to access!"
            });
        });
    });
};


const authJwt = {
    verifyToken: verifyToken,
    isAdmin: isAdmin,
    isEditor: isEditor,
    isEditorOrAdmin: isEditorOrAdmin

};

module.exports = authJwt;


