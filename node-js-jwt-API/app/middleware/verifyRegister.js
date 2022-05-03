const db = require("../model");
const ROLES = db.ROLES;
const User = db.user;


checkDuplicateEmail = (req, res, next) => {

  
      
      User.findOne({
        where: {
          email: req.body.email
        }
      }).then(user => {
        if (user) {
          res.status(400).send({
            message: "Failed! Email is already in use!"
          });
          return;
        }
  
        next();
      });
    
  };

  checkRoleExists = (req, res, next) => {
    if (req.body.roles) {
      for (let i = 0; i < req.body.roles.length; i++) {
        if (!ROLES.includes(req.body.roles[i])) {
          res.status(400).send({
            message: "Failed! Role does not exist = " + req.body.roles[i]  ////NB - the API is always expecting an array, even when it is only one Role!!
          });
          return;
        }
      }
    }
    
    next();
  };

const verifyRegister = {
    checkDuplicateEmail: checkDuplicateEmail, checkRoleExists: checkRoleExists
};

module.exports = verifyRegister;