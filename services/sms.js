const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

sendMessage = (body, to)=>{
    console.log(to);
    client.messages.create({
        body,
        from: process.env.TWILIO_NUMBER_FROM,
        to
    })
    .then("Message send")
    .catch(err=>console.log(err));
}

module.exports = {
    sendOTP: (phoneNumber, otp)=>{
        if(!phoneNumber || !otp) return;
        sendMessage('Your otp is: '+otp, '+91'+phoneNumber);
    },
};