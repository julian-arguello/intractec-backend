export function configMail(toEmail, template){

    return  {
        from: "Intratec",
        to: toEmail,
        subject: "Intratec - Recuperación de contraseña",
        html: template
    }
}

export default configMail