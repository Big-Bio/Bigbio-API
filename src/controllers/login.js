const auth = require('../auth/auth');
const jwt = require('../auth/token');

module.exports = {
    process: async (req, res) => {
        try{
            await auth.validate(req);
            const data = await auth.checkUser(req.body.username, req.body.password);
            const token = await jwt.sign(data);
            res.json({
                token: token
            });
        } catch(err){
            console.log('Error');
            res.send(err);
        }
    }
}