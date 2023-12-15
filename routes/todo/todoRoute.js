const {client} = require("../../db");
const {ObjectId} = require("mongodb");
const jwt = require("jsonwebtoken");
const {secret} = require("../../userConfig");

const todoDB = client.db("todoBase").collection('todoList');

const getAllTodo = async (req, res) =>{
    const queryParams = req.query;
    const search = queryParams.search || "all";
    const page = parseInt(queryParams.page) || 1;
    const limit = parseInt(queryParams.limit) || 100;
    const skip = (page - 1) * limit;
    const query = {};

    if (search !== "all") {
        const regex = new RegExp(search, 'i');
        query.name = regex;
    }

    try{
        const token = req.headers.authorization;
        const decodeData = jwt.verify(token, secret);
        const userId = decodeData.id;
        await client.connect()
        const totalCount = await todoDB.countDocuments(query);
        const hasNextPage = skip + limit < totalCount;
        const cursor = await todoDB.find({...query, user:userId}).skip(skip).limit(limit);
        const data = await cursor.toArray();
        res.send({data, hasNextPage});
    }catch (error) {
        res.status(500).send("Server Error");
    }
};

const addTodo = async (req, res) =>{
    const token = req.headers.authorization;
    const decodeData = jwt.verify(token, secret);
    const userId = decodeData.id;
    const {title, text} = req.body;
    const newTodo = {
        title:title,
        text:text,
        isOpen:true,
        isDelete:false,
        user:userId
    }

    try{
        await client.connect();
        await todoDB.insertOne(newTodo)
        res.send({
            massage:"Done"
        })


    }catch (error) {
        res.status(500).send("Server Error");
    }
};



const updateTodo = async (req, res) =>{
    const {id,title, text, isOpen, isDelete} = req.body;
    const updateObj = {
        title:title,
        text:text,
        isOpen:isOpen,
        isDelete:isDelete,
        date:new Date
    }

    try{
        const todo = {_id: new ObjectId(id)};
        const isTodoBase = await todoDB.findOne({todo})
        if(isTodoBase){
            await client.connect()
            await todoDB.updateOne(
                { _id: todo },
                {$set: updateObj})

            return res.send({
                massage:"Done"
            })
        }
    }catch (error) {
        res.status(500).send("Server Error");
    }
}

const deleteTodo = async (req, res) =>{
    const {_id} = req.body;

    try{
        await client.connect()
        const todo = {_id: new ObjectId(_id)}
        await todoDB.deleteOne({ _id: todo })
        return res.send({
            massage:"Done"
        })
    }catch (error) {
        res.status(500).send("Server Error");
    }
}






module.exports = {
    getAllTodo,
    addTodo,
    updateTodo,
    deleteTodo

}