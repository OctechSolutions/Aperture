import React from "react"
import { Firebase } from './config'
import { SignUp } from "./pages"

export default class App extends React.Component{
    render() {
        return (
            <div className="sign-up">
                <SignUp />
            </div>
        )
    }
}
