export function configMail(toEmail, template){

    return  {
        from: "info.intratec@gmail.com",
        to: toEmail,
        subject: "Intratec - Recuperación de contraseña",
        html: template
    }
}

export default configMail