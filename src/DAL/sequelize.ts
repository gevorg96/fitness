import { DataType, Sequelize} from 'sequelize-typescript';
import Question from './Models/question';
import Answer from './Models/answer';
import Achievement from './Models/achievement';
import Article from './Models/article';
import Exercise from './Models/exercise';
import ExerciseGroup from './Models/exerciseGroup';
import Inventory from './Models/inventory';
import Menu from './Models/menu';
import MuscleGroup from './Models/muscleGroup';
import User from './Models/user';
import UserGroup from './Models/userGroup';
import UserStat from './Models/userStat';
import dotenv from 'dotenv';
import Muscle from './Models/muscle';

dotenv.config();

const sequelize = new Sequelize(process.env.PGDATABASE, process.env.PGUSER, process.env.PGPASSWORD, {
  dialect: 'postgres',
  host: process.env.PGHOST,
  port: +process.env.PGPORT,
  models: [
    Achievement,
    Answer,
    Article,
    Exercise,
    ExerciseGroup,
    Inventory,
    Menu,
    Muscle,
    MuscleGroup,
    Question,
    User,
    UserGroup,
    UserStat
  ],
  repositoryMode: true,
});

// this definition only for telegraf-postgres-session
sequelize.define('postgress_sessions', {
  id: {
      type: DataType.STRING(5000),
      primaryKey: true
  },
  session: {
    type: DataType.STRING(5000)
  }
}, {
  timestamps: false
});

export default sequelize;