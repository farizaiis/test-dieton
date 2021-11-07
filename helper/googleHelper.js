const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


async function verify(token) {

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: "830738754144-edou8dum22s2gdblflkdqhs6ooh11bns.apps.googleusercontent.com",
        });
        const payload = ticket.getPayload();

        if (payload.email_verified) {
            return payload
        } else {
            return ("user not verified");
        }
    } catch (err) {
        return cb(new Error('GOOGLE_ERROR'))
    }
}

module.exports = verify;
