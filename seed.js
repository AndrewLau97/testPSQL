const db = require("./connection");
const format = require("pg-format");

const seed = ({usersData, petsData, tasksData}) => {
  return db.query("DROP TABLE IF EXISTS users_Pets;")
  .then(() => {
    return db.query("DROP TABLE IF EXISTS users;");
  })
  .then(()=>{
    return db.query("DROP TABLE IF EXISTS tasks;")
  })
  .then(()=>{
    return db.query("DROP TABLE IF EXISTS pets;")
  })
  .then(()=>{
    return db.query(`
        CREATE TABLE users (
        user_id SERIAL PRIMARY KEY,
        username VARCHAR(40) UNIQUE NOT NULL,
        first_name VARCHAR(40) NOT NULL,
        last_name VARCHAR(40) NOT NULL,
        avatar_url VARCHAR,
        created_at TIMESTAMP DEFAULT NOW()
        );
        `)
  })
  .then(()=>{
    return db.query(`
        CREATE TABLE pets (
        pet_id SERIAL PRIMARY KEY,
        pet_name VARCHAR(40) NOT NULL,
        avatar_url VARCHAR
        );
        `)
  })
  .then(()=>{
    return db.query(`
        CREATE TABLE tasks (
        task_id SERIAL PRIMARY KEY,
        pet_id INT REFERENCES pets(pet_id) ON DELETE CASCADE NOT NULL
        );
        `)
  })
  .then(()=>{
    return db.query(`
        CREATE TABLE users_Pets (
        user_pet_id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(user_id) ON DELETE CASCADE NOT NULL,
        pet_id INT REFERENCES pets(pet_id) ON DELETE CASCADE NOT NULL
        );
        `)
  })
  .then(()=>{
    const insertUsersQueryStr=format(`INSERT INTO users(username, first_name, last_name, avatar_url) VALUES %L`,
        usersData.map(({username, first_name, last_name, avatar_url})=>[username, first_name, last_name,avatar_url])
    );
    return db.query(insertUsersQueryStr)
  })
};

module.exports = seed;
