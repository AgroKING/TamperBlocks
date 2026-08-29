import { useState } from "react";
import CredentialCard from "../components/credcard";

function Lookup() {
    const [studentId, setStudentId] = useState("");
    const [credential, setCredential] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function handleChange(event) {
        setStudentId(event.target.value);
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setCredential(null);
        setLoading(true);

        try {
            const response = await fetch(
                "http://localhost:8000/lookup/" + studentId
            );

            if (!response.ok) {
                throw new Error("Credential not found");
            }

            const result = await response.json();
            setCredential(result);
        } catch (error) {
            setError("No credential found for this Student ID.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="lookup-page">
            <div className="lookup-container">

                {/* LEFT SEARCH CARD */}
                <div className="lookup-card">

                    <div className="lookup-header">
                        <h1>Lookup Credential</h1>
                        <p>
                            Search for an existing academic credential
                            using the Student ID.
                        </p>
                    </div>

                    <form
                        className="lookup-form"
                        onSubmit={handleSubmit}
                    >

                        <div className="form-group">
                            <label>Student ID</label>

                            <input
                                type="text"
                                name="student_id"
                                value={studentId}
                                onChange={handleChange}
                                placeholder="e.g. CS101"
                                required
                            />
                        </div>

                        <button
                            className="lookup-button"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Searching..." : "Lookup Credential"}
                        </button>

                    </form>

                    {error && (
                        <div className="lookup-error">
                            ❌ {error}
                        </div>
                    )}

                    {credential && (
                        <div className="lookup-result">

                            <div className="lookup-success">
                                ✓ Credential Found
                            </div>

                            <CredentialCard data={credential} />

                        </div>
                    )}

                </div>

                {/* RIGHT SIDEBAR / PANEL */}
                <div className="trust-panel">
                    <div className="diamond-icon">🔍</div>
                    <span className="eyebrow">INSTANT VERIFICATION</span>
                    <h2>Authentic & Secure.</h2>
                    <p className="description">
                        Verify academic records directly against official university records and cryptographic proofs.
                    </p>

                    <div className="divider"></div>

                    <ul className="trust-list">
                        <li>
                            <span className="check-icon">✓</span> Real-time status query
                        </li>
                        <li>
                            <span className="check-icon">✓</span> On-chain hash comparison
                        </li>
                        <li>
                            <span className="check-icon">✓</span> Tamper-evident validation
                        </li>
                    </ul>

                    <p className="trust-footer">
                        Official lookup requests are securely processed for verification compliance.
                    </p>
                </div>

            </div>
        </div>
    );
}

export default Lookup;