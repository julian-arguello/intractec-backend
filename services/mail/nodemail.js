import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'cayla.farrell@ethereal.email',
        pass: 'nBYTDqzhn32qvTyfhZ'
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