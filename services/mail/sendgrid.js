import sgMail from '@sendgrid/mail';

// Establece tu API Key de SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Definir función para enviar correo
const send = async (mailOption) => {
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
