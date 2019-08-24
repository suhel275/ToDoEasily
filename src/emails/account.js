const sgMail = require('@sendgrid/mail');// [sgMail] will be object that will contain methods to send emails
//const sendgridAPIKey = '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';// this is API key that
// was generated for us.

//sgMail.setApiKey(sendgridAPIKey);// here we are setting our generated API key .// here we are ginving the [API KEY]
// manually that is not secure

sgMail.setApiKey(process.env.SENDGRID_API_KEY);// here [API key] will be taken from environment variable 
// that we created in [config/dev.env] file . but it will run for local machine not server
// it is advicable that [environment vaariable ] name should be in upper case and it should be seperated by
// underscore [_] .

//console.log('key is fetched');// it was for checking purpose
//console.log(process.env.SENDGRID_API_KEY);// it was for checking purpose
//console.log(process.env);// it was for checking purpose

/*
sgMail.send({// here we are sending email and passing one object that will contain all information about this mail
    
    to:'suhelkhan275@gmail.com',
    from:'suhelkhan275@gmail.com',
    subject:'This is my first creation !',
    text:'I hope this one actually get to you.' // In place of [text] ,we can add some [HTML mail properties] 
    also but now we are not interested in it.
})
*/

const sendWelcomeEmail = (email,name)=>{// here we created the function this function will call in [user creation]
    // router so when user is created then this function will send email, when we run the application then all above 
    // codes will run and API will also send
    // here we can pass whole object [user] but we are taking individual property [email,name]
    sgMail.send({
        to:email,
        from:'suhelkhan275@gmail.com',
        subject:'Thanks for joinig in !',
       text:`Welcome to the app , ${name}, Let me know how you get along with the app .`// here we are using 
       // [ES6 templete string festure]
       //html: 'hi suhel' // here we can use [HTML codes] also if your client email supports html codes .

    })

}

const sendCancelationEmail = (email,name)=>{// this function will be called when [delete user router] is run 
    sgMail.send({
        to:email,
        from:'suhelkhan275@gmail.com',
        subject : 'How was your experience with us !',
        text:`All the best ,${name} , give us the reason of your cancelation .`

    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail,
}








