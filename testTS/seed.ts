const db = require("./connection");
const format = require("pg-format");

type UsersDataType=
  {
    username:string,
    first_name:string,
    last_name:string,
    avatar_url?:string
  }


type UsersPetsDataType=[
  {
  user_id:number,
  pet_id:number
}
]

type TasksDataType=[
  {
  task_name:string,
  pet_id:number
}
]

type PetsDataType=[
  {
  pet_name:string,
  avatar_url?:string
}
]

type SeedData={
  usersData:Array<{
    username:string,
    first_name:string,
    last_name:string,
    avatar_url?:string
  }>,
  petsData:PetsDataType,
  tasksData:TasksDataType,
  petOwnersData:UsersPetsDataType
}

let usersData:Array<UsersDataType>=[{
  username:"test_user",
  first_name:"tester1",
  last_name:"tester",
  avatar_url:"https://developertesting.rocks/wp-content/uploads/2018/11/developer_testing_1600x400.png"
}]

const seedTest:SeedData = {usersData, petsData, tasksData, petOwnersData}


const seed = ({usersData, petsData, tasksData, petOwnersData}:SeedData) => {
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
        task_name VARCHAR(40) NOT NULL,
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
  .then(()=>{
    const insertPetsQueryStr=format(`INSERT INTO pets(pet_name, avatar_url) VALUES %L`,
        petsData.map(({pet_name, avatar_url})=>[pet_name,avatar_url])
    );
    return db.query(insertPetsQueryStr)
  })
  .then(()=>{
    const insertPetOwnersQueryStr=format(`INSERT INTO users_pets(user_id,pet_id) VALUES %L`, 
        petOwnersData.map(({user_id,pet_id})=>[user_id,pet_id])
    );
    return db.query(insertPetOwnersQueryStr)
  })
  .then(()=>{
    const insertTasksQueryStr=format(`INSERT INTO tasks(task_name, pet_id) VALUES %L`,
        tasksData.map(({task_name,pet_id})=>[task_name,pet_id])
    );
    return db.query(insertTasksQueryStr)
  })
};

module.exports = seed;
