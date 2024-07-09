const {
  firebase
 } = require('../config/firebase');
const { getFirestore, collection, getDocs, query, where } = require('firebase/firestore');
 const { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    sendEmailVerification,
    sendPasswordResetEmail
   } = require('../config/firebase');

const auth = getAuth();

const _token_name = "access_token";
const _error_email_required = "El Correo Electrónico es requerido";
const _error_password_required = "La Contraseña es requerida";
const _error_500 = "Servidor Interno del Servidor";

class FirebaseAuthController {

    // Iniciar sesión
    async loginUser(req, res) {
      if (!req.body) {
        return res.status(400).json(req);
      }
      var { email, password } = req.body;
      if (!email || !password) {
          return res.status(400).json({
              email: _error_email_required,
              password: _error_password_required,
          });
      }
      
      let found = false;
      const db = getFirestore(firebase);
      // Validar el correo electrónico
      const _mail_usersCol = collection(db, 'users');
      const _mail_q = query(_mail_usersCol, where("email", "==", email));
      const _mail_userSnapshot = await getDocs(_mail_q);
      const _mail_userList = _mail_userSnapshot.docs.map(doc => doc.data());
      if (_mail_userList.length == 0) {
        found = true;
      } else {
        let data = _mail_userList[0];
        email = data.email;
      }
      // Validar el usuario
      if (found) {
        const _user_usersCol = collection(db, 'users');
        const _user_q = query(_user_usersCol, where("user", "==", email));
        const _user_userSnapshot = await getDocs(_user_q);
        const _user_userList = _user_userSnapshot.docs.map(doc => doc.data());
        if (_user_userList.length == 0) {
          found = true;
        } else {
          let data = _user_userList[0];
          email = data.email;
        }
      }
      
      if (!found) {
        return res.status(400).json({error: "El usuario no existe"});
      }

      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const idToken = userCredential._tokenResponse.idToken
            if (idToken) {
                res.cookie(_token_name, idToken, {
                    httpOnly: true
                });
                res.status(200).json({ message: "Se inicio la sesión correctamente", userCredential });
            } else {
                res.status(500).json({ error: _error_500 });
            }
        })
        .catch((error) => {
            const errorMessage = error.error || error.message || "Ocurrió un error al iniciar sesión";
            res.status(400).json({ error: errorMessage });
        });
      }

    //  Registrar sesión
    async registerUser(req, res) {
      if (!req.body) {
        return res.status(400).json(req);
      }
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          email: _error_email_required,
          password: _error_password_required,
        });
      }
      // Validar el correo electrónico
      const db = getFirestore(firebase);
      const _mail_usersCol = collection(db, 'users');
      const _mail_q = query(_mail_usersCol, where("email", "==", email));
      const _mail_userSnapshot = await getDocs(_mail_q);
      const _mail_userList = _mail_userSnapshot.docs.map(doc => doc.data());
      if (_mail_userList.length > 0) {
        return res.status(400).json({error: "El correo electrónico YA EXISTE"});
      }
      // Validar el usuario
      const _user_usersCol = collection(db, 'users');
      const _user_q = query(_user_usersCol, where("user", "==", email));
      const _user_userSnapshot = await getDocs(_user_q);
      const _user_userList = _user_userSnapshot.docs.map(doc => doc.data());
      if (_user_userList.length > 0) {
        return res.status(400).json({error: "El usuario YA EXISTE"});
      }

      let data = req.body;
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          sendEmailVerification(auth.currentUser)
            .then(async () => {
              const userJson = data;
              const usersDb = db.collection('users');
              const response = await usersDb.add(userJson);
              res.status(201).json({ message: "Se envió la verificación al correo electrónico "+ email +"! El usuario se creo correctamente!", response });
            })
            .catch((error) => {
              res.status(500).json({ error: "Error al enviar el correo electrónico de verificación" });
            });
        })
        .catch((error) => {
          const errorMessage = error.error || error.message || "Ocurrió un error al registrarse el usuario";
          res.status(400).json({ error: errorMessage });
        });
    }
    
    // Cerrar Sesión
    logoutUser(req, res) {
      signOut(auth)
        .then(() => {
          res.clearCookie(_token_name);
          res.status(200).json({ message: "Se cerro correctamente la sesión" });
        })
        .catch((error) => {
          res.status(500).json({ error: _error_500 });
        });
    }
    
    // Reiniciar contraseña
    resetPassword(req, res){
      const { email } = req.body;
      if (!email ) {
        return res.status(400).json({
          email: _error_email_required
        });
      }
      sendPasswordResetEmail(auth, email)
        .then(() => {
          res.status(200).json({ message: "Se envió un correo electrónico a "+email+" para recuperar la contraseña!" });
        })
        .catch((error) => {
          res.status(500).json({ error: _error_500 });
        });
      }

  }
  
  module.exports = new FirebaseAuthController();
