const {client} = require("../../db");
const {ObjectId} = require("mongodb");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {sendMailServiceLink} = require("../../utils/sendMailServise/sendMailServise");
const {validationResult} = require("express-validator");
const {secret} = require("../../userConfig");
const generationToken = require("./../../utils/generationToken/generationToken")

const userDB = client.db("todoBase").collection('users');



const loginUser = async (req, res) => {
    const {password, email} = req.body
    try{
        await client.connect()
        const isUserBase = await userDB.findOne({email: email});
        if(!isUserBase) {
            return res.send({
                status:400,
                error:"Incorrect password or email"
            })
        }
        const validPassword = bcrypt.compareSync(password, isUserBase.password)
        if(isUserBase && !validPassword ){
            return res.send({
                status:400,
                error:"Incorrect password"
            })
        }
        const token = generationToken(isUserBase._id );
        return res.send({token})
    }catch (error) {
        return res.send({
            status:500,
            error:"Server Error"
        });
    };
};

const isValidToken = async (req, res) =>{
    const token = req.headers.authorization;
    try{
        const decodeData = jwt.verify(token, secret);
        const userId = decodeData.id;
        await client.connect()
        const isUserBase = await userDB.findOne({_id: new ObjectId(userId)})
        if(!isUserBase){
            return res.send({
                status:400,
                "userauth": false
            })
        }
        return res.send({"userauth": true})
    }catch (errors){
        return res.status(500).send("Server Error");
    }
}

const registrationUser = async (req, res) =>{
    const {userName, password, email} = req.body;
    await client.connect()
    const isUserBase = await userDB.findOne({email: req.body.email});

    try{
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        if(isUserBase && isUserBase.password){
            return res.send({
                status:400,
                info:"The user is already logged in"
            })
        } else {
            const hashPassword = bcrypt.hashSync(password, 7)
            const candidate = {
                userName: userName,
                password: hashPassword,
                email:email,
            }
            const {insertedId} = await userDB.insertOne(candidate);
            const idString = insertedId.toString();
            const token = generationToken(idString);
            // await sendMailServiceLink(email,
            //     `https://shopcoserver-git-main-chesterfalmen.vercel.app/api/activate/${idString}`)
            return res.send({
                status: 200,
                token:token
            })
        }

    }catch (error) {
        res.status(500).send("Server Error");
    }

}

const addpass = async (req, res) =>{
    await client.connect()
    const hashPassword = bcrypt.hashSync("BAE270230!", 7)
    try{
        await client.connect()
        await userDB.updateOne(
            { email: "sergiy.ol.bondarenko@gmail.com" },
            {
                $set: {
                    password: hashPassword
                }
            })

        return res.send({"addpass": true})
    }catch (errors){
        return res.status(500).send("Server Error");
    }
}




module.exports = {
    loginUser,
    isValidToken,
    registrationUser,
    addpass

}