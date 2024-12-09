import React from 'react'
import './UserItem.css'
import { Link } from 'react-router-dom'

import Avatar from './../../shared/components/UIElements/Avatar'
import Card from '../../shared/components/UIElements/Card'

// This component renders a single user item, displaying their image, name, and place count.
// It links to the user's places page, where more information about their places can be found.
const UserItem = props => {

    return (
        <React.Fragment>
            <li className="user-item">
                <Card className="user-item__content">
                    <Link to={`/${props.id}/places`}>
                        <div className="user-item__image">
                            <Avatar image={`${process.env.REACT_APP_ASSET_URL}/${props.image}`} alt={props.name} />
                        </div>
                        <div className="user-item__info">
                            <h2>{props.name}</h2>
                            <h3>
                                {props.placeCount} {props.placeCount === 1 ? 'Place' : 'Places'}
                            </h3>
                        </div>
                    </Link>
                </Card>
            </li>
        </React.Fragment>

    );
}

export default UserItem