const {
    admin,
    firebase
   } = require('../config/firebase');
   const { getFirestore, collection, addDoc, doc, deleteDoc, getDocs, query, where } = require('firebase/firestore');

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
            const db = getFirestore(firebase);
            const _userCol = collection(db, 'users');
            const _q = query(_userCol, where("email", "==", email));
            const _userSnapshot = await getDocs(_q);
            const _userList = _userSnapshot.docs.map(doc => {
                return { ...doc.data(), _id: doc.id };
            });
            if (_userList.length > 0) {
                let data = _userList[0];
                res.status(201).send(data);
            } else {
                res.status(400).send({message: "No se encontró"});
            }
        } catch (error) {
          res.status(400).send(error.message);
        }
    };

    // Crear Favorito
    createFavorite = async (req, res, next) => {
        try {
            const db = getFirestore(firebase);
            const docRef = await addDoc(collection(db, "favorites"), req.body);
            res.status(201).send({_id: docRef.id});
        } catch (error) {
          res.status(400).send(error.message);
        }
    };

    // Get Favorito
    getFavorite = async (req, res, next) => {
        try {
            const db = getFirestore(firebase);
            const _favoriteCol = collection(db, 'favorites');
            const _q = query(_favoriteCol, where("_id_video", "==", req.body._id));
            const _favoriteSnapshot = await getDocs(_q);
            const _favoriteList = _favoriteSnapshot.docs.map(doc => {
                return { ...doc.data(), _id: doc.id };
            });
            if (_favoriteList.length > 0) {
                let data = _favoriteList[0];
                res.status(201).send(data);
            } else {
                res.status(400).send({message: "No se encontró"});
            }
        } catch (error) {
            res.status(400).send(error.message);
        }
    }
    
    // Eliminar favorito
    deleteFavorite = async (req, res, next) => {
        try {
            const db = getFirestore(firebase);
            const response = await deleteDoc(doc(db, "favorites", req.body._id));
            res.status(200).send(response);
        } catch (error) {
          res.status(400).send(error.message);
        }
    };

}

module.exports = new UserController();
