import { useState } from "react";
import CredentialCard from "../components/credcard";
import { api } from "../services/api";
import BlurText from "../components/BlurText";

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
            let result;
            if (studentId.startsWith("0x")) {
                const verifyRes = await api.verifyCertificate(studentId);
                if (!verifyRes.metadata) {
                    throw new Error("Credential metadata not found on-chain.");
                }
                result = {
                    metadata: verifyRes.metadata,
                    target_hash: studentId,
                    ipfs_cid: verifyRes.verification_details?.ipfs_cid,
                    revoked: !verifyRes.verification_details?.not_revoked,
                    timestamp: verifyRes.verification_details?.timestamp
                };
            } else {
                result = await api.lookupByStudentId(studentId);
            }
            setCredential(result);
        } catch (err) {
            setError(err.message || "No credential found.");
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
                        <span className="eyebrow">VERIFICATION PORTAL</span>
                        <BlurText as="h1" text="Lookup Credential" delay={50} />
                        <p>
                            Query the database to inspect and verify authentic academic credentials.
                        </p>
                    </div>

                    <form className="lookup-form" onSubmit={handleSubmit}>

                        <div className="form-group">
                            <label htmlFor="student_id">Student ID or Certificate Hash</label>
                            <div className="input-wrapper">
                                <span className="input-icon">🔍</span>
                                <input
                                    id="student_id"
                                    type="text"
                                    name="student_id"
                                    value={studentId}
                                    onChange={handleChange}
                                    placeholder="e.g. CS101 or 0x..."
                                    required
                                />
                            </div>
                        </div>

                        <button
                            className="lookup-button"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="button-loading">
                                    <span className="spinner"></span> Searching...
                                </span>
                            ) : (
                                <>
                                    Lookup Credential
                                    <span className="btn-arrow">→</span>
                                </>
                            )}
                        </button>

                    </form>

                    {error && (
                        <div className="lookup-error">
                            <span className="error-icon">⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}

                    {credential && (
                        <div className="lookup-result">
                            <div className="lookup-success" style={credential.revoked ? {backgroundColor: '#fee2e2', color: '#b91c1c', border: '1px solid #fca5a5'} : {}}>
                                {credential.revoked ? (
                                    <><span className="success-icon" style={{backgroundColor: '#ef4444'}}>❌</span> Credential Found but is REVOKED</>
                                ) : (
                                    <><span className="success-icon">✓</span> Credential Found & Verified</>
                                )}
                            </div>
                            <CredentialCard data={{
                                ...credential.metadata,
                                target_hash: credential.target_hash,
                                ipfs_cid: credential.ipfs_cid,
                                revoked: credential.revoked,
                                timestamp: credential.timestamp
                            }} />
                        </div>
                    )}

                </div>

                {/* RIGHT SIDEBAR / PANEL */}
                <div className="trust-panel">
                    <div className="trust-panel-inner">
                        <div className="diamond-icon">🔍</div>
                        <span className="eyebrow eyebrow-light">INSTANT VERIFICATION</span>
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
        </div>
    );
}

export default Lookup;