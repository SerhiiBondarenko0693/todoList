const Router = require("express");
const router = new Router;
const todoRoutes = require("./routes/todo/todoRoute");
const userRoutes = require("./routes/user/userRoutes")




router.get('/api/gettodo', todoRoutes.getAllTodo);
router.post('/api/addtodo', todoRoutes.addTodo);

router.post("/api/continueWidthGoogle", userRoutes.continueWidthGoogle);
router.post("/api/login", userRoutes.loginUser);
router.post("/api/isWalidToken", userRoutes.isValidToken);
router.post("/api/resetPassword", userRoutes.resetPassword);
router.get("/api/activityPassword/:link", userRoutes.activityPassword);





module.exports = router




