import React from "react"
import { SignUp, Home } from "./pages"
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { AuthProvider } from './services/Auth'
import PrivateRoute from './services/PrivateRoute'

export default class App extends React.Component{
    render() {
        return (
            <AuthProvider>
                <Router>
                    <div>
                        {/* Will only display 1 of the below screens at a time.
                            The 1st match will be displayed. */}
                        <Switch>
                            <Route exact path="/signup" component={SignUp} />
                            <PrivateRoute exact path="/" component={Home} />
                        </Switch>
                    </div>
                </Router>
            </AuthProvider>
        )
    }
}
