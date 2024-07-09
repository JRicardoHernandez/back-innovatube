const {
    admin
   } = require('../config/firebase');

class UserController {
    
    createUser = async (req, res, next) => {
        const db = admin.firestore();
        try {
            const userJson = req.body;
            const usersDb = db.collection('users');
            const response = await usersDb.add(userJson);
            res.status(200).send(response);
        } catch (error) {
          res.status(400).send(error.message);
        }
    };
    
    getUserByEmail = async (req, res, next) => {
        const db = admin.firestore();
        try {
            const email = req.body.email;
            const users = await db.collection("users").where('email', '==', email).get();
            let usr=[];
            if (users.docs.length > 0) {
                for (const user of users.docs) {
                 usr.push(user.data())
            }}
            res.status(200).send(usr);
        } catch (error) {
          res.status(400).send(error.message);
        }
    };

}

module.exports = new UserController();
