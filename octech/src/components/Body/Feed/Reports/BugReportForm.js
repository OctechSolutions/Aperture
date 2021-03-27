import React, { useState } from "react";
import "./BugReportForm.css";
import { db } from "../../../../firebase";
import { useSelector } from 'react-redux';
import { selectUser } from '../../../../features/userSlice';

const BugReportForm = () => {
    // const [name, setName] = useState("");
    // const [email, setEmail] = useState("");
    const [url, setURL] = useState("");
    const [bugReport, setBugReport] = useState("");
    const [imageData, setImageData] = useState("");
    const user = useSelector(selectUser);
    const onChange = (e) => {
        const file = e.target.files[0];
        if (file.type.includes("image") && file.size <= 1000000) {
            const fileContent = new FileReader();
            fileContent.addEventListener('load', () => {
                setImageData(fileContent.result);
            })
            fileContent.readAsDataURL(file);
        }
        else {
            document.getElementById("fileUpload").value = '';
            alert("Uploaded file must be an image and less than 1 MB!");
        }
    }
    const [loader, setLoader] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoader(true);
        //Setting the fields and values to be added to Firebase database
        db.collection("bugReports")
            .add({
                // name: name,
                // email: email,
                url: url,
                bugReport: bugReport,
                image: imageData
            })
            .then(() => {
                setLoader(false);
                alert("Your message has been submitted successfully");
            })
            .catch((error) => {
                console.log(error);
                alert(error.bugReport);
                setLoader(false);
            });

        // setName("");
        // setEmail("");
        setURL("");
        setBugReport("");

    };

    return (
        //Creating a form where the user can input the data
        <div>
            <form className="form" id="bugForm" onSubmit={handleSubmit}>
                <h1 className="pb-5">Hello {user.displayName}, would you like to submit a bug report?</h1>


                {/* <label>Name:</label>
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
            /> */}

                <label>URL:</label>
                <input
                    placeholder="Where can we find the Bug?"
                    value={url}
                    onChange={(e) => setURL(e.target.value)}
                />
                {/* File input where the user can upload an image */}
                <label>Attach a Screenshot of the Bug:</label>
                <input type="file" id="fileUpload" onChange={onChange} />


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
        </div>
    );
};

export default BugReportForm;