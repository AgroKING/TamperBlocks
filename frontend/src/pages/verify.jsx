import { useState } from "react";
import { api } from "../services/api";

function Verify() {
    const [targetHash, setTargetHash] = useState("");

    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function handleStudentIdChange(event) {
        setTargetHash(event.target.value);
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setResult(null);
        setError("");
        setLoading(true);

        try {
            const result = await api.verifyCertificate(targetHash);
            setResult(result);
        } catch (err) {
            setError(err.message || "No credential found for this Certificate Hash.");
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
                            <label>Certificate Hash</label>
                            <input
                                type="text"
                                value={targetHash}
                                onChange={handleStudentIdChange}
                                placeholder="e.g. 0x3a7b..."
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

                            <div className={result.verified ? "verification-success" : "verification-error"}>
                                {result.verified ? "✓ CREDENTIAL VERIFIED" : "✗ VERIFICATION FAILED"}
                            </div>

                            {result.reasons && result.reasons.length > 0 && (
                                <div className="verification-reasons">
                                    {result.reasons.map((r, i) => <p key={i}>{r}</p>)}
                                </div>
                            )}

                            {result.verification_details && (
                                <div className="verification-details">
                                    <div className="verification-item">
                                        <span>Ledger Anchored</span>
                                        <strong>{result.verification_details.ledger_anchored ? "✓ Yes" : "✗ No"}</strong>
                                    </div>
                                    <div className="verification-item">
                                        <span>Block Index</span>
                                        <strong>{result.verification_details.block_index}</strong>
                                    </div>
                                    <div className="verification-item">
                                        <span>IPFS CID</span>
                                        <strong>{result.verification_details.ipfs_cid}</strong>
                                    </div>
                                    <div className="verification-item">
                                        <span>Integrity Check</span>
                                        <strong>{result.verification_details.integrity_check_passed ? "✓ Passed" : "✗ Failed"}</strong>
                                    </div>
                                    <div className="verification-item">
                                        <span>Signature Check</span>
                                        <strong>{result.verification_details.signature_check_passed ? "✓ Passed" : "✗ Failed"}</strong>
                                    </div>
                                    <div className="verification-item">
                                        <span>Revocation Status</span>
                                        <strong>{result.verification_details.not_revoked ? "✓ Active" : "✗ Revoked"}</strong>
                                    </div>
                                </div>
                            )}

                            {result.metadata && (
                                <div className="verification-details">
                                    <div className="verification-item">
                                        <span>Student</span>
                                        <strong>{result.metadata.name}</strong>
                                    </div>
                                    <div className="verification-item">
                                        <span>Student ID</span>
                                        <strong>{result.metadata.student_id}</strong>
                                    </div>
                                    <div className="verification-item">
                                        <span>Degree</span>
                                        <strong>{result.metadata.degree}</strong>
                                    </div>
                                    <div className="verification-item">
                                        <span>Major</span>
                                        <strong>{result.metadata.major}</strong>
                                    </div>
                                    <div className="verification-item">
                                        <span>GPA</span>
                                        <strong>{result.metadata.gpa}</strong>
                                    </div>
                                    <div className="verification-item">
                                        <span>Institution</span>
                                        <strong>{result.metadata.issuing_institution}</strong>
                                    </div>
                                </div>
                            )}

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