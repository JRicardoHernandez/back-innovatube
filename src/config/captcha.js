const {RecaptchaEnterpriseServiceClient} = require('@google-cloud/recaptcha-enterprise');
request = require('request'),

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
            /* Browse generates the google-recapcha-response key on form submit.
            if its blank or null means user has not selected,
            the captcha then blow error loop occurs.*/
            if(req.body['recaptcha'] === undefined || req.body['recaptcha'] === '' || req.body['recaptcha'] === null) {
                return res.json({"responseCode" : 1,"responseDesc" : "Validate captcha first"});
            }
            
            let secretKey = "6Leb4gsqAAAAALccRM86Qy0frmwTydWdF_qYnTX3";
            let verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['recaptcha'] + "&remoteip=" + req.connection.remoteAddress;
            // Google will respond with success or error scenario on url request sent.
            request(verificationUrl,function(error,response,body) {
            body = JSON.parse(body);
            // Success will be true or false depending upon captcha validation.
            if(body.success !== undefined && !body.success) {
                return res.json({"responseCode" : 1,"responseDesc" : "Captcha verification has Failed. Try again."});
            }
            return res.json({"responseCode" : 0,"responseDesc" : "Captcha validated succesfully!"});
        });
    }

}
 
module.exports = new Captcha();
