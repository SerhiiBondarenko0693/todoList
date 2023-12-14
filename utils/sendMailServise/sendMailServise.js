const nodemailer = require("nodemailer");
const config = require("../../config");
const enb = config.GMAIL_CONNECTION_STRING;
const passGmail = enb.match(/.{1,4}/g).join(' ');
const mass = passGmail;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'serhiibondarenko33@gmail.com',
        pass: mass
    },
    secure: false,
    pool: true,
    maxConnections: 5,
    maxMessages: 100
});

const sendMail = async (mailOptions) => {
    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return info.response;
    } catch (error) {
        console.log("sendMail error", error);
        throw error;
    }
};



const sendMailServiceMassage = async (recipient) => {
    const mailOptions = {
        from: 'serhiibondarenko33@gmail.com',
        to: recipient,
        subject: "Welcome your organizer",
        text: `Author Serhii Bondarenko`
    };
    return await sendMail(mailOptions);
};




const sendMailResetPassword = async (recipient, link, password) => {
    const mailOptions = {
        from: 'serhiibondarenko33@gmail.com',
        to: recipient,
        subject: "Support ",
        html: `<div>
                <h1>Your new one-time password :${password}</h1>
                <h3>To activate, follow the link. Be sure to change the password in your personal account.</h3>
                <a href="${link}">${link}</a>
            </div>`
    };
    return await sendMail(mailOptions);
};


const sendErr = async (email) =>{
    const mailOptions = {
        from: 'serhiibondarenko33@gmail.com',
        to: email,
        subject: "Thank you for subscribing to the store ShopCo",
        text:"Now you will receive notifications about new products and special offers."
    };
    return await sendMail(mailOptions);
}


module.exports = {
    sendMailServiceMassage,
    sendMailResetPassword,
    sendErr
};