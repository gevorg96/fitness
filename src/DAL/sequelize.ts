
import {Sequelize} from 'sequelize-typescript';
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

export const sequelize = new Sequelize('postgres', 'postgres', 'password', {
  dialect: 'postgres',
  host: 'localhost',
  models: [
    Achievement,
    Answer,
    Article,
    Exercise,
    ExerciseGroup,
    Inventory,
    Menu,
    MuscleGroup,
    Question,
    User,
    UserGroup,
    UserStat
  ],
  repositoryMode: true,
});