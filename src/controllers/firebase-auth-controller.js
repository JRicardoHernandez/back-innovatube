const {
  admin
 } = require('../config/firebase');
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
      const db = admin.firestore();
      const users_byEmail = await db.collection("users").where('email', '==', email).get();
      if (users_byEmail.docs.length == 0) {
        found = true;
      }
      const users_byUser = await db.collection("users").where('user', '==', email).get();
      if (users_byUser.docs.length == 0) {
        found = true;
      } else {
        let data = users_byUser.docs[0].data();
        email = data.email;
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
      
      const db = admin.firestore();
      const users_byEmail = await db.collection("users").where('email', '==', email).get();
      if (users_byEmail.docs.length > 0) {
        return res.status(400).json({error: "El correo electrónico YA EXISTE"});
      }
      const users_byUser = await db.collection("users").where('user', '==', req.body.user).get();
      if (users_byUser.docs.length > 0) {
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
