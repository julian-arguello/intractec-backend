/*import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
    host: "smtp.sendgrid.net",
    port: 25,
    auth: {
      user: "FKA8IK22Sky_FtkvGqApmw",
      pass: "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"
    }
  });

const send = async(mailOption)=>{
   await transport.sendMail(mailOption, (err, info) =>{
        if(err){
            throw { error: 500, msg: err }
        }
    })
}

export default {
    send
}
*/


import sgMail from '@sendgrid/mail';

// Establece tu API Key de SendGrid
sgMail.setApiKey('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');

// Definir función para enviar correo
const send = async (mailOption) => {
  console.log(mailOption);
  try {
    // Envía el correo electrónico
    await sgMail.send(mailOption);
    console.log('El correo electrónico ha sido enviado con éxito.');
  } catch (error) {
    console.error('Error al enviar el correo electrónico:', error);
    throw new Error(error);
  }
};

  export default {
    send
}
