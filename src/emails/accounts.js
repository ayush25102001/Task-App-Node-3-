
const sgMail=require('@sendgrid/mail')

sgMail.setApiKey('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')


const sendWelcomeEmail = (email, name)=>{
    sgMail.send({                         //send returns promise
        to: email,
        from: 'ayushthth@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
    })
}
const sendCancellationEmail = (email, name)=>{
    sgMail.send({                         
        to: email,
        from: 'ayushthth@gmail.com',
        subject: 'Sorry to see you go!',
        text: `Goodbye ${name}?.`
    })
}

module.exports = {
    sendWelcomeEmail,        //sendWelcomeEmail:sendWelcomeEmail (shorthand) 
    sendCancellationEmail
}






// sgMail.send({
//     to:'ayushthth@gmail.com',
//     from:'ayushthth@gmail.com',
//     subject:'My first creation',
//     text:'Hope this reaches u (:('
// })