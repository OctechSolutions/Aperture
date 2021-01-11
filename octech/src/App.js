import React from "react"
import { SignUp, Home } from "./pages"
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { AuthProvider } from './services/Auth'

export default class App extends React.Component{
    render() {
        return (
            <AuthProvider>
                <Router>
                    <div>
                        <Route exact path="/" component={Home} />
                        <Route exact path="/signup" component={SignUp} />
                    </div>
                </Router>
            </AuthProvider>
        )
    }
}
