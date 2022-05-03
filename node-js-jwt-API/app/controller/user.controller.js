const { user } = require("../model");
const User = require("../model/user.model");

exports.allVisitor = (req, res) => {
    res.status(200).send("Content for all site Visitors");
}

exports.allUser = (req, res) => {
    res.status(200).send("Content for all signed-in Users");
}

exports.userBoard = (req, res) => {
    res.status(200).send("Content for Users");
}

exports.editorBoard = (req, res) => {
    res.status(200).send("Content for Editors");


}

exports.adminBoard = (req, res) => {
    res.status(200).send("Content for Admins");
}





    // user.remove(req.params.id, (err,data) =>{
    //     if(err){
    //         if(err.kind === "not_found"){
    //             res.status(404).send({
    //                 message: `No User found with id: ${req.params.id}`
    //             });
    //         }else{
    //             res.status(500).send({
    //                 message: "Could not delete User wth id " + req.params.id

    //             });
    //         }

    //     }//end of 'if(err)' loop
    //     else{
    //         res.status(200).send(`User #${req.params.id} deleted successfully!`);

    //     }

    // });

