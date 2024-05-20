import React from "react";

import UsersList from "../components/UsersList"

const Users = () => {
    
    //array of object that rapresents the users
    const USERS = [
        {id: 'u1',
        name: 'Liza Fitoussi',
        image: 'https://i.postimg.cc/c13nk1k1/temp.jpg',
        places: 3
        }
    ];

    //send the user list
    return(
        <UsersList items={USERS}/>
    );
}

export default Users