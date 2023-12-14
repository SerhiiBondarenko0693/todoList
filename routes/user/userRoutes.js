const {client} = require("../../db");
const {ObjectId} = require("mongodb");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {sendMailResetPassword, sendMailServiceMassage} = require("../../utils/sendMailServise/sendMailServise");
const {validationResult} = require("express-validator");
const {secret} = require("../../userConfig");
const generateRandomPassword = require("../../utils/generationPassword/generationPassword");
const {URI} = require("../../config");


const generationToken = (id) =>{
    const payload = {
        id
    }
    return jwt.sign(payload, secret, {expiresIn: "78h"})
}


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
                "userAuth": false
            })
        }
        return res.send({"userAuth": true})
    }catch (errors){
        return res.status(400).send({"userAuth": false});
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
            await sendMailServiceMassage(candidate.email)
            return res.send({
                status: 200,
                token:token
            })
        }

    }catch (error) {
        res.status(500).send("Server Error");
    }

}



const continueWidthGoogle = async (req, res) =>{
    const {userName, password, email} = req.body;
    await client.connect()
    const isUserBase = await userDB.findOne({email: req.body.email});

    try{
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        if(isUserBase && isUserBase.password){
            const token = generationToken(isUserBase._id.toString());
            return res.send({
                status: 200,
                token:token
            })
        }
        if(isUserBase && !isUserBase.password){
            const updateUser = await userDB.findOne({email:email});
            const userId = updateUser._id.toString()
            const token = generationToken(userId);
            return res.send({
                status: 200,
                token:token
            })

        }else {
            const hashPassword = bcrypt.hashSync(password, 7)
            const candidate = {
                userName: userName,
                password: hashPassword,
                email:email,
                roll:"user"
            }
            const {insertedId} = await userDB.insertOne(candidate);
            const idString = insertedId.toString();
            const token = generationToken(idString);

            return res.send({
                status: 200,
                token:token
            })
        }

    }catch (error) {
        res.status(500).send("Server Error");
    }

}

const resetPassword = async (req,res) => {
    const emailReq = req.body.email
    console.log("emailReq", emailReq);
    try{
        await client.connect()
        const user = await userDB.findOne({email: emailReq});
        console.log(user);
        const userId = user._id.toString()
        console.log(userId);
        const randomPassword = generateRandomPassword(8)
        await userDB.updateOne({_id: new ObjectId(userId)},{
            $set: {env: randomPassword}});
        await sendMailResetPassword(emailReq,
            `https://todo-list-back-eta.vercel.app/api/activityPassword/${randomPassword}`,
            randomPassword);
        return res.send({
            status:200,
            message:"Password reset"
        })

    }catch (error) {
        return res.send({
            status:500,
            message:"User not found"
        })
    }
};




const activityPassword = async (req, res) => {
    // const passwordReq = req.params.link;
    // console.log(passwordReq);
    // const hashPassword = bcrypt.hashSync(passwordReq, 7)
    // await client.connect()
    // const user = await userDB.findOne({env: passwordReq });
    // console.log(user);
    // if (!user) {
    //     throw new Error("User not found");
    // }
    // await userDB.updateOne(
    //     { env: passwordReq },
    //     { $set: { password: hashPassword, env:"" } }
    // );
    // console.log('Password is activated.');
    // // return res.redirect(URI);
    // console.log(URI);
    return res.redirect(URI);
};




module.exports = {
    loginUser,
    isValidToken,
    registrationUser,
    continueWidthGoogle,
    activityPassword,
    resetPassword

}