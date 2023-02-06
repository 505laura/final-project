const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SIGNING_SECRET;
const expiration = '2h';

module.exports = {
    signToken({username, email, _id}) {
        const payload = {username, email, _id};

        return jwt.sign({data: payload}, secret, {expiresIn: expiration});
    },
    authMiddleware({req}) {
        const tokenInput = req.body.token || req.query.token || req.headers.authorization;
        let token;

        if(req.headers.authorization) {
            token = tokenInput.split(' ').pop().trim();
        }

        if(!token) { return req; }

        try {
            const {data} = jwt.verify(token, secret, {maxAge: expiration});
            req.user = data;
        } catch(e) {
            console.log('Invalid token');
        }

        return req;
    },
};
