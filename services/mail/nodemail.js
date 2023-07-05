import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 587,
    auth: {
        user: "2e755bb72e4e76",
        pass: "125fa03877b024"
    }
});

export function send (mailOption){
   return transporter.sendMail(mailOption, (err, info) =>{
        if(err){
            throw { error: 500, msg: err }
        }
    })
}

export default {
    send
}
