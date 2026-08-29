import { useState } from "react";

function Verify() {
    const [studentId, setStudentId] = useState("");
    const [credentialHash, setCredentialHash] = useState("");

    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function handleStudentIdChange(event) {
        setStudentId(event.target.value);
    }

    function handleHashChange(event) {
        setCredentialHash(event.target.value);
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setResult(null);
        setError("");
        setLoading(true);

        try {
            const response = await fetch(
                "http://localhost:8000/verify/" + credentialHash
            );

            if (!response.ok) {
                throw new Error("Credential not found");
            }

            const data = await response.json();

            setResult(data);
        } catch (error) {
            setError("Credential could not be verified. Please check the hash.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="verification-page">
            <div className="verification-container">

                {/* LEFT VERIFICATION CARD */}
                <div className="verification-card">

                    <div className="verification-header">
                        <h1>Institution Verification Portal</h1>
                        <p>
                            Verify the authenticity of an academic
                            credential recorded on the blockchain.
                        </p>
                    </div>

                    <form
                        className="verification-form"
                        onSubmit={handleSubmit}
                    >

                        <div className="form-group">
                            <label>Student ID</label>
                            <input
                                type="text"
                                value={studentId}
                                onChange={handleStudentIdChange}
                                placeholder="e.g. CS101"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Credential Hash</label>
                            <input
                                type="text"
                                value={credentialHash}
                                onChange={handleHashChange}
                                placeholder="e.g. 0x8f3a..."
                                required
                            />
                        </div>

                        <button
                            className="verification-button"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Verifying..." : "Verify Credential"}
                        </button>

                    </form>

                    {error && (
                        <div className="verification-error">
                            ❌ {error}
                        </div>
                    )}

                    {result && (
                        <div className="verification-result">

                            <div className="verification-success">
                                ✓ CREDENTIAL VERIFIED
                            </div>

                            <div className="verification-details">

                                <div className="verification-item">
                                    <span>Student ID</span>
                                    <strong>{studentId}</strong>
                                </div>

                                <div className="verification-item">
                                    <span>Student</span>
                                    <strong>{result.name}</strong>
                                </div>

                                <div className="verification-item">
                                    <span>Degree</span>
                                    <strong>{result.degree}</strong>
                                </div>

                                <div className="verification-item">
                                    <span>Major</span>
                                    <strong>{result.major}</strong>
                                </div>

                                <div className="verification-item">
                                    <span>GPA</span>
                                    <strong>{result.gpa}</strong>
                                </div>

                                <div className="verification-item">
                                    <span>Blockchain Status</span>
                                    <strong className="verified-status">
                                        VERIFIED
                                    </strong>
                                </div>

                                <div className="verification-item">
                                    <span>Issued At</span>
                                    <strong>{result.issued_at}</strong>
                                </div>

                            </div>

                        </div>
                    )}

                </div>

                {/* RIGHT SIDEBAR / PANEL */}
                <div className="trust-panel">
                    <div className="diamond-icon">🛡️</div>
                    <span className="eyebrow">THIRD-PARTY AUDIT</span>
                    <h2>Cryptographic proof.</h2>
                    <p className="description">
                        Instant, tamper-evident verification for employers, universities, and background agencies.
                    </p>

                    <div className="divider"></div>

                    <ul className="trust-list">
                        <li>
                            <span className="check-icon">✓</span> Direct ledger hash comparison
                        </li>
                        <li>
                            <span className="check-icon">✓</span> Zero-trust security model
                        </li>
                        <li>
                            <span className="check-icon">✓</span> Immutable background record
                        </li>
                    </ul>

                    <p className="trust-footer">
                        All verification queries are cryptographically validated against the official ledger.
                    </p>
                </div>

            </div>
        </div>
    );
}

export default Verify;