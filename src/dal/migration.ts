import sequelize from "./sequelize";

const migrateMuscleGroup = async () => {
    await sequelize.query(`
        INSERT INTO muscle_groups (id, value, day_num, month, created_at, updated_at)
        VALUES
        (1, 'Спина.Трицепс.Пресс.',1,1, now(), now()),
        (2, 'Грудь.Бицепс.Пресс.',2,1, now(), now()),
        (3, 'Ноги.Плечи.',3,1, now(), now()),
        (4, 'Спина.Плечи.Пресс',1,2, now(), now()),
        (5, 'Грудь.Трицепс.Пресс',2,2, now(), now()),
        (6, 'Ноги.Бицепс.',3, 2, now(), now())
        on conflict (id)
        do nothing
        returning 1
    `)
}

const migrateInventory = async () => {
    await sequelize.query(`
        INSERT INTO inventories (id, value, created_at, updated_at)
        VALUES
            (1, 'без инвентаря', now(), now()),
            (2, 'штанга', now(), now()),
            (3, 'гантели', now(), now()),
            (4, 'турник', now(), now())
        on conflict (id)
        do nothing
        returning 1
    `)
}

const migrateMuscle = async () => {
    await sequelize.query(`
        INSERT INTO muscles
            (id, value, created_at, updated_at)
        VALUES
            (1, 'Бицепс', now(), now()),
            (2, 'Грудь', now(), now()),
            (3, 'Ноги', now(), now()),
            (4, 'Плечи', now(), now()),
            (5, 'Пресс', now(), now()),
            (6, 'Спина', now(), now()),
            (7, 'Трицепс', now(), now())
        on conflict (id)
        do nothing
        returning 1
    `)
}

const migrateUserGroup = async () => {
    await sequelize.query(`
        INSERT INTO user_groups
            (id, aim, age, inventory_id, created_at, updated_at)
        VALUES (1, 'набор мышечной массы', '18-35 лет', 1, now(), now()),
               (2, 'набор мышечной массы', '18-35 лет', 2, now(), now()),
               (3, 'набор мышечной массы', '18-35 лет', 3, now(), now()),
               (4, 'набор мышечной массы', '18-35 лет', 4, now(), now()),
               (5, 'набор мышечной массы', '35-50 лет', 1, now(), now()),
               (6, 'набор мышечной массы', '35-50 лет', 2, now(), now()),
               (7, 'набор мышечной массы', '35-50 лет', 3, now(), now()),
               (8, 'набор мышечной массы', '35-50 лет', 4, now(), now()),
               (9, 'сушка', '18-35 лет', 1, now(), now()),
               (10, 'сушка', '18-35 лет', 2, now(), now()),
               (11, 'сушка', '18-35 лет', 3, now(), now()),
               (12, 'сушка', '18-35 лет', 4, now(), now()),
               (13, 'сушка', '35-50 лет', 1, now(), now()),
               (14, 'сушка', '35-50 лет', 2, now(), now()),
               (15, 'сушка', '35-50 лет', 3, now(), now()),
               (16, 'сушка', '35-50 лет', 4, now(), now())
        on conflict (id)
            do nothing
        returning 1
    `)
}

const migrateExercises = async () => {
    await sequelize.query(`
        INSERT INTO exercises
            (id, value, inventory_id, muscle_id, created_at, updated_at)
        VALUES
            (1, 'Бицепс без инвентаря',1,1, now(), now()),
            (2, 'Грудь без инвентаря',1,2, now(), now()),
            (3, 'Ноги без инвентаря',1,3, now(), now()),
            (4, 'Плечи без инвентаря',1,4, now(), now()),
            (5, 'Пресс без инвентаря',1,5, now(), now()),
            (6, 'Спина без инвентаря',1,6, now(), now()),
            (7, 'Трицепс без инвентаря',1,7, now(), now()),
            (8, 'Бицепс гантели',2,1, now(), now()),
            (9, 'Грудь гантели',2,2, now(), now()),
            (10, 'Ноги гантели',2,3, now(), now()),
            (11, 'Плечи гантели',2,4, now(), now()),
            (12, 'Пресс гантели',2,5, now(), now()),
            (13, 'Спина гантели',2,6, now(), now()),
            (14, 'Трицепс гантели',2,7, now(), now())
        on conflict (id)
            do nothing
        returning 1`)
}

const migrateExerciseGroups = async () => {
    await sequelize.query(`
        INSERT INTO exercise_groups
            (id, muscle_group_id, exercise_id, created_at, updated_at)
        VALUES
            (1, 1, 6, now(), now()),
            (2, 1, 7, now(), now()),
            (3, 1, 5, now(), now()),
            (4, 2, 2, now(), now()),
            (5, 2, 1, now(), now()),
            (6, 2, 5, now(), now()),
            (7, 3, 3, now(), now()),
            (8, 3, 4, now(), now()),
            (9, 4, 6, now(), now()),
            (10, 4, 4, now(), now()),
            (11, 4, 5, now(), now()),
            (12, 5, 2, now(), now()),
            (13, 5, 7, now(), now()),
            (14, 5, 5, now(), now()),
            (15, 6, 3, now(), now()),
            (16, 6, 1, now(), now()),
            (17, 1, 13, now(), now()),
            (18, 1, 14, now(), now()),
            (19, 1, 12, now(), now()),
            (20, 2, 9, now(), now()),
            (21, 2, 8, now(), now()),
            (22, 2, 12, now(), now()),
            (23, 3, 10, now(), now()),
            (24, 3, 11, now(), now()),
            (25, 4, 13, now(), now()),
            (26, 4, 11, now(), now()),
            (27, 4, 12, now(), now()),
            (28, 5, 9, now(), now()),
            (29, 5, 14, now(), now()),
            (30, 5, 12, now(), now()),
            (31, 6, 10, now(), now()),
            (32, 6, 8, now(), now())
        on conflict (id)
            do nothing
        returning 1`)
}

export const migrate = async () => {
    await migrateMuscleGroup();
    await migrateInventory();
    await migrateMuscle();
    await migrateUserGroup();
    await migrateExercises();
    await migrateExerciseGroups();
}