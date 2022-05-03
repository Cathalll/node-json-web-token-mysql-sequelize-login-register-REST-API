const db = require("../model");
const User = db.user;
const Op = db.Sequelize.Op;




exports.delete = (req,res) => {
    const id = req.params.id;
    User.destroy({
        where: { id: id}
    })
    .then(num =>{
        if(num ==1){
            res.send({
                message: `User #${id} was successfully deleted.`
            });
        }else{
            res.send({
                message: `Could not delete User #${id}. Please check the data you entered`
            });
        }

    }).catch(err => {
        res.status(500).send({
            message: `Problem with updating User # ${id}`
        });
    });

}