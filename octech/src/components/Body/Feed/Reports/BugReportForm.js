import React, { useState, useEffect } from "react";
import "../Reports/BugReportForm.css";
import { db } from "../../../../firebase";

const BugReportForm = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [url, setURL] = useState("");
    const [bugReport, setBugReport] = useState("");

    const [loader, setLoader] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoader(true);
        //Setting the fields and values to be added to Firebase database
        db.collection("BugReports")
            .add({
                name: name,
                email: email,
                url: url,
                bugReport: bugReport,
            })
            .then(() => {
                setLoader(false);
                alert("Your message has been submitted successfully");
            })
            .catch((error) => {
                alert(error.bugReport);
                setLoader(false);
            });

        setName("");
        setEmail("");
        setURL("");
        setBugReport("");
    };

    return (
        //Creating a form where the user can input the data
        <form className="form" onSubmit={handleSubmit}>

            <h1>Submit a Bug Report</h1>

            <label>Name:</label>
            <input
                placeholder="Insert Your Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <label>Email:</label>
            <input
                placeholder="Insert Your Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <label>URL:</label>
            <input
                placeholder="Where can we find the Bug?"
                value={url}
                onChange={(e) => setURL(e.target.value)}
            />

            <label>Bug Report:</label>
            <textarea
                placeholder="Describe the Bug in Detail"
                value={bugReport}
                onChange={(e) => setBugReport(e.target.value)}
            ></textarea>

            <button
                type="submit"
                style={{ background: loader ? "#ccc" : " rgb(205, 127, 50)" }}
            >
                Submit
      </button>
        </form>
    );
};

export default BugReportForm;