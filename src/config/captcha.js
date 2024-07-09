
request = require('request');

/**
  * Crea una evaluación para analizar el riesgo de una acción de la IU.
  *
  * projectID: El ID del proyecto de Google Cloud.
  * recaptchaSiteKey: La clave reCAPTCHA asociada con el sitio o la aplicación
  * token: El token generado obtenido del cliente.
  * recaptchaAction: El nombre de la acción que corresponde al token.
  */
 class Captcha {

    createAssessment = async (req, res, next) => {
        let token = req.body.recaptcha;
        const secretkey = "6LeJNAwqAAAAAAMBTK3Tcyqidc5777YTMXthA3Cg";
        
        //token validation url is URL: https://www.google.com/recaptcha/api/siteverify 
        // METHOD used is: POST
        
        const url =  `https://www.google.com/recaptcha/api/siteverify?secret=${secretkey}&response=${token}&remoteip=${req.connection.remoteAddress}`
        
        //note that remoteip is the users ip address and it is optional
        // in node req.connection.remoteAddress gives the users ip address
        
        if(token === null || token === undefined){
            return res.status(201).send({success: false, message: "Token is empty or invalid"})
        }
        
        request(url, function(err, response, body){
            //the body is the data that contains success message
            body = JSON.parse(body);
            //check if the validation failed
            if(body.success !== undefined && !body.success){
                return res.status(400).send({success: false, 'message': "recaptcha failed"});
            }
            
            //if passed response success message to client
            res.status(200).send({"success": true, 'message': "recaptcha passed"});
            
        })
    }

}
 
module.exports = new Captcha();
