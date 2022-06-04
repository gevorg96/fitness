import express, { Express, Request, Response } from 'express';
import {startBot} from './Telegram/telegramProcessor';
import dotenv from 'dotenv';
import { sequelize } from './DAL/sequelize';
import Question from './DAL/Models/question';
import {json} from 'body-parser';

dotenv.config();

const app: Express = express();
app.use(json());

//(async () => await sequelize.sync({alter: true}))();


app.get('/questions', async (req: Request, res: Response) => {
  let repo = sequelize.getRepository(Question);
  const result = await repo.findAll();
  
  res.send(result)
})

app.post('/questions', async (req: Request, res: Response) => {
  console.log(req.body.questions);
  let repo = sequelize.getRepository(Question);
  let result = repo.bulkCreate(req.body.questions)

  res.send(result);
});


startBot();

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running at https://localhost:${port}`);
});