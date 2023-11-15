import express from 'express';
import UserController from './controllers/UserController';


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());


app.post('/checkemail', UserController.checkEmail);



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
