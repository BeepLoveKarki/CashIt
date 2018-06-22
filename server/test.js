const { SMSMessage, SMSMessageConfig } = require("hubtel-mx");
const {MobileMoney,MobileMoneyConfig,getErrorMessageFromResponseCode } = require("hubtel-mx");

 
require('dotenv').load();

const config = new SMSMessageConfig({
    clientId: process.env.clientId,
    clientSecret: process.env.clientSecret,
});

const config1 = new MobileMoneyConfig({
    clientId: process.env.clientId,
    clientSecret: process.env.clientSecret,
    merchantAccountNumber: process.env.merchantAccountNumber
});

const message = new SMSMessage(config);
const mobileMoney = new MobileMoney(config1);

/*mobileMoney.receive({
	    CustomerName: "Biplab Karki",
        CustomerMsisdn: "0547788165",
        Channel: "mtn-gh",
		PrimaryCallbackUrl: "https://api.hubtel.com/v1/merchantaccount",
		Description: "Pledge payment",
        Amount: 5,
        ClientReference: "CashCow"
    }).then(responseJSON => {
        console.log(responseJSON);
        console.log("Response message: ",getErrorMessageFromResponseCode(responseJSON.ResponseCode));
    }).catch(err => {
		console.log(err);
	});*/
	
	message.sendOne({
        From: "CashCow",
        //To: "+233547789165",
		To:"0547788165",
        Content: "Your CashCow Club wallet confirmation number ",
    }).then(responseJSON => {
		console.log(responseJSON);
    }).catch((err) =>{
		res.send(JSON.stringify({status:"nOK"}));
	});