import CredentialCard from "./credcard";
import { useState } from "react";

function Verify() {

    const [verifyData, setVerifyData] = useState({
        name: "",
        Rollno: "",
        degree: "",
        branch: "",
        gyear: ""
    });
    const [verificationResult, setVerificationResult] = useState(null);

    function handlevChange(event) {
        setVerifyData({
            ...verifyData,
            [event.target.name]: event.target.value
        });
    }

    async function handlevsubmit(event) {
        event.preventDefault();

        const response = await fetch(
            "http://localhost:3000/credentials"
        );

        const result = await response.json();

        const found = result.find(
            (e) =>
                e.Rollno === verifyData.Rollno &&
                e.name === verifyData.name
        );

        if (!found) {
            setVerificationResult("notfound");
        } else {
            setVerificationResult(found);
        }
    }

    return (
        <div>

            <h1>Verification of credentials by institutions</h1>

            <form onSubmit={handlevsubmit}>

                <p>Student Name:</p>
                <input
                    name="name"
                    value={verifyData.name}
                    onChange={handlevChange}
                    placeholder="input name"
                />

                <p>Roll No:</p>
                <input
                    name="Rollno"
                    value={verifyData.Rollno}
                    onChange={handlevChange}
                    placeholder="input Roll no"
                />

                <p>Degree:</p>
                <input
                    name="degree"
                    value={verifyData.degree}
                    onChange={handlevChange}
                    placeholder="input Degree"
                />

                <p>Branch:</p>
                <input
                    name="branch"
                    value={verifyData.branch}
                    onChange={handlevChange}
                    placeholder="input Branch"
                />

                <p>Graduation Year:</p>
                <input
                    name="gyear"
                    value={verifyData.gyear}
                    onChange={handlevChange}
                    placeholder="input year"
                />

                <button type="submit">Verify</button>

            </form>

            {verificationResult === "notfound" && (
                <p>Credentials not found</p>
            )}

            {verificationResult &&
                verificationResult !== "notfound" && (
                    <div>
                        <p>Credentials found</p>
                        <CredentialCard data={verificationResult} />
                    </div>
                )}

        </div>
    );
}

export default Verify;