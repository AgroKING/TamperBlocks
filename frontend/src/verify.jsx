
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
    const [loading, setLoading] = useState(false);

    function handleChange(event) {
        setVerifyData({
            ...verifyData,
            [event.target.name]: event.target.value
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setLoading(true);
        setVerificationResult(null);

        try {
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

        } catch (error) {
            console.error(error);
            setVerificationResult("error");
        }

        setLoading(false);
    }

    return (
        <div className="verify-container">

            <div className="verify-form-card">

                <div className="verify-header">
                    <h3>Verify a Credential</h3>

                    <p>
                        Enter the student's details to check
                        whether the credential exists in the system.
                    </p>
                </div>

                <form
                    className="verify-form"
                    onSubmit={handleSubmit}
                >

                    <div className="form-group">
                        <label htmlFor="verify-name">
                            Student Name
                        </label>

                        <input
                            id="verify-name"
                            name="name"
                            value={verifyData.name}
                            onChange={handleChange}
                            placeholder="Oasis Poudel"
                            required
                        />
                    </div>


                    <div className="form-group">
                        <label htmlFor="verify-roll">
                            Roll Number
                        </label>

                        <input
                            id="verify-roll"
                            name="Rollno"
                            value={verifyData.Rollno}
                            onChange={handleChange}
                            placeholder="124CS0138"
                            required
                        />
                    </div>


                    <div className="form-group">
                        <label htmlFor="verify-degree">
                            Degree
                        </label>

                        <input
                            id="verify-degree"
                            name="degree"
                            value={verifyData.degree}
                            onChange={handleChange}
                            placeholder="B.Tech"
                        />
                    </div>


                    <div className="form-group">
                        <label htmlFor="verify-branch">
                            Branch
                        </label>

                        <input
                            id="verify-branch"
                            name="branch"
                            value={verifyData.branch}
                            onChange={handleChange}
                            placeholder="Computer Science"
                        />
                    </div>


                    <div className="form-group">
                        <label htmlFor="verify-year">
                            Graduation Year
                        </label>

                        <input
                            id="verify-year"
                            name="gyear"
                            value={verifyData.gyear}
                            onChange={handleChange}
                            placeholder="2028"
                        />
                    </div>


                    <button
                        type="submit"
                        className="verify-button"
                        disabled={loading}
                    >
                        {loading ? "Checking..." : "Verify Credential"}
                    </button>

                </form>

            </div>


            {verificationResult === "notfound" && (
                <div className="verification-result invalid">
                    <div className="result-icon">×</div>

                    <div>
                        <h3>Credential Not Found</h3>

                        <p>
                            No credential matching the supplied
                            student details was found.
                        </p>
                    </div>
                </div>
            )}


            {verificationResult === "error" && (
                <div className="verification-result invalid">
                    <div className="result-icon">!</div>

                    <div>
                        <h3>Verification Failed</h3>

                        <p>
                            Could not connect to the credential server.
                            Make sure the backend is running.
                        </p>
                    </div>
                </div>
            )}


            {verificationResult &&
                verificationResult !== "notfound" &&
                verificationResult !== "error" && (

                    <div className="verification-success">

                        <div className="verification-result valid">

                            <div className="result-icon">
                                ✓
                            </div>

                            <div>
                                <h3>Credential Verified</h3>

                                <p>
                                    A matching academic credential
                                    was found in the system.
                                </p>
                            </div>

                        </div>

                        <CredentialCard
                            data={verificationResult}
                        />

                    </div>
                )}

        </div>
    );
}

export default Verify;