import React, { useContext } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { AuthContext } from '../../services/services'

// PrivateRoute = Will render the sign up page if user is not signed in.
const PrivateRoute = ({ component: RouteComponent, ...rest }) => {
    const {currentUser} = useContext(AuthContext)
    
    return (
        <Route
            {...rest}
            render={ routeProps => 
                currentUser ? 
                (<RouteComponent {...routeProps} />) :
                (<Redirect to={'/signup'} />)
            }
        />
    )
}

export default PrivateRoute
