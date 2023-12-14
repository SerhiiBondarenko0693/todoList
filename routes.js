const Router = require("express");
const router = new Router;
const todoRoutes = require("./routes/todo/todoRoute");
const userRoutes = require("./routes/user/userRoutes")




router.get('/api/gettodo', todoRoutes.getAllTodo);
router.post('/api/addtodo', todoRoutes.addTodo);




module.exports = router




