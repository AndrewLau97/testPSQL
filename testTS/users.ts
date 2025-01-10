type UserType={
    username:string,
    first_name:string,
    last_name:string,
    avatar_url?:string
}

const userData:Array<UserType>=
    [{
        username:"test_user",
        first_name:"tester1",
        last_name:"tester",
        avatar_url:"https://developertesting.rocks/wp-content/uploads/2018/11/developer_testing_1600x400.png"
    },
    {
        username:"also_testing",
        first_name:"tester2",
        last_name:"tester",
        avatar_url:"https://developertesting.rocks/wp-content/uploads/2018/11/developer_testing_1600x400.png"
    },
    {
        username:"final_tester",
        first_name:"tester3",
        last_name:"tester"
    }
]


module.exports=userData