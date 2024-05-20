import React from 'react';

import './UsersList.css'
import UserItem from './UserItem.js';
import Card from '../../shared/components/UIElements/Card.js'
const UsersList = props => {
    
    //in case we don't have any users yet
    if(props.items.length === 0){
        return (
            <div className='center '>
                <Card>
                    <h2>No users found.</h2>
                </Card>
            </div>
        );
    }

    //if we got here than we have atlist one user and than we mapped the users into unordered list to the UserItem component
    return(
        <ul className="users-list">
            {props.items.map( user => (      //every item here will be a user and we return UserItem as a self closing jsx element
                <UserItem 
                    key={user.id}
                    id={user.id}
                    image={user.image}
                    name={user.name}
                    placeCount={user.places}
                />
            ) )}
        </ul>
    );
}

export default UsersList