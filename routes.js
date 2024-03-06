const Router = require("express");
const router = new Router;
const todoRoutes = require("./routes/todo/todoRoute");
const userRoutes = require("./routes/user/userRoutes")
const authMiddleware = require("./utils/authMiddleware/authMiddleware");




router.post('/api/getTodo',authMiddleware, todoRoutes.getAllTodo);
router.post('/api/addTodo',authMiddleware, todoRoutes.addTodo);
router.post('/api/doneTodo',authMiddleware, todoRoutes.doneTodo);
router.put('/api/updateTodo',authMiddleware, todoRoutes.updateTodo);
router.delete('/api/deleteTodo/:id',authMiddleware, todoRoutes.deleteTodo);



router.post("/api/continueWidthGoogle", userRoutes.continueWidthGoogle);
router.post("/api/login", userRoutes.loginUser);
router.post("/api/registration", userRoutes.registrationUser);
router.post("/api/changeUserPass", userRoutes.changeUserPass);
router.post("/api/isWalidToken", userRoutes.isValidToken);
router.post("/api/resetPassword", userRoutes.resetPassword);
router.get("/api/activityPassword/:link", userRoutes.activityPassword);





module.exports = router




