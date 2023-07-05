import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "2e755bb72e4e76",
      pass: "125fa03877b024"
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

