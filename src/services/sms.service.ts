import twilio from 'twilio';
import AppConfig from '../config/app.config';


// Initializing SMS plugin
const client = twilio(AppConfig.SMS.accountSID, AppConfig.SMS.authToken);

/**
 * @param recipient  - Must be a E.164 format (ex: +2348123456789)
 * @param SMS_TYPE - must either be of value _VERIFICATION | _LEVEL
 * @param VERIFICATION_CODE - [optional] Verification code
 * @param gasParams - [optional] Hardware device status options
 * @returns - JSON object
 * 
 * Sends SMS to the recipient
 */
const sendSMS = async (recipient: string,
    SMS_TYPE: string,
    VERIFICATION_CODE?: string | number,
    gasParams?: any|number) => {

    // SMS and Device parameters
    const SMS = {
        message: '',
        type: SMS_TYPE,
        recipient,
        GAS: gasParams
    };

    // Customizing message based on SMS type
    switch (SMS.type) {
        case '_VERIFICATION':
            SMS.message = `Your GASSED verification code is ${VERIFICATION_CODE}`;
            break;
        case '_LEVEL':
            SMS.message = `Your GASSED level is remaining ${SMS.GAS.quantity}kg. Don't get caught up in-between, refill as soon as possible`
            break;
        default:
            // code here ...
            break;
    }

    // Sending SMS
    return await client.messages.create({
        body: SMS.message,
        from: AppConfig.SMS.sender,
        to: SMS.recipient
    })
        .then(message => console.log(`Message sent to recepient: ${message.to}`))
        .catch(error => console.log(error));
}

export default sendSMS