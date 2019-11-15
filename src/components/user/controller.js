const User = require('./models')

module.exports = {
    login: async (req, res) => {
        try{
            const asset = await User.findOne({ where: { username: req.body.username } })
            if (asset == null) 
                res.status(400).json({ message: 'Invalid username' })
            else
                if (await asset.validatePassword(req.body.password))
                    res.json({message: "success", token: asset.generateJWT()})    
                else
                    res.status(400).json({ message: "Invalid password"})
        }
        catch{
            res.status(401)
        }
    }
}