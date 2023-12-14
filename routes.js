const Router = require("express");
const router = new Router;
const todoRoutes = require("./routes/todo/todoRoute");
const userRoutes = require("./routes/user/userRoutes")




router.get('/api/gettodo', todoRoutes.getAllTodo);
router.post('/api/addtodo', todoRoutes.addTodo);

router.post("/api/continuewidthgoogle", userRoutes.continueWidthGoogle);
router.post("/api/login", userRoutes.loginUser);
router.post("/api/iswalidetoken", userRoutes.isValidToken);
router.get("/api/activityPassword", userRoutes.activityPassword);





module.exports = router




