import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

function Issue({ data, setdata }) {
    const navigate = useNavigate();
    const [issuedCredential, setIssuedCredential] = useState(null);
    const [issueError, setIssueError] = useState(null);
    const [loading, setLoading] = useState(false);

    function handleChange(event) {
        setdata({
            ...data,
            [event.target.name]: event.target.value
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setIssuedCredential(null);
        setIssueError(null);
        setLoading(true);

        try {
            const result = await api.issueCertificate(data);

            const credentialResult = {
                ...data,
                credential_hash: result.target_hash,
                ipfs_cid: result.ipfs_cid,
                transaction_hash: result.transaction_hash,
                block_index: result.block_index,
                blockchain_status: "ANCHORED",
                issued_at: new Date().toLocaleString()
            };

            setIssuedCredential(credentialResult);

        } catch (error) {
            console.error(error);
            setIssueError(error.message || "Credential could not be issued. Please try again.");
        }

        setLoading(false);
    }

    return (
        <div className="issue-page">
            <div className="issue-container">
                {/* LEFT FORM CARD */}
                <div className="issue-card">
                    <div className="issue-header">
                        <h1>Issue Academic Credential</h1>
                        <p>
                            Enter the student's academic information below to create a verifiable record.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Student ID</label>
                            <input
                                name="student_id"
                                value={data.student_id}
                                onChange={handleChange}
                                placeholder="e.g. CS101"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Student Name</label>
                            <input
                                name="name"
                                value={data.name}
                                onChange={handleChange}
                                placeholder="e.g. Rahul Sharma"
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Degree</label>
                                <input
                                    name="degree"
                                    value={data.degree}
                                    onChange={handleChange}
                                    placeholder="e.g. B.Tech"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Major / Branch</label>
                                <input
                                    name="major"
                                    value={data.major}
                                    onChange={handleChange}
                                    placeholder="e.g. CSE"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>GPA</label>
                                <input
                                    type="number"
                                    name="gpa"
                                    value={data.gpa}
                                    onChange={handleChange}
                                    placeholder="e.g. 8.7"
                                    min="0"
                                    max="10"
                                    step="0.1"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Issuing Institution</label>
                                <input
                                    name="issuing_institution"
                                    value={data.issuing_institution}
                                    onChange={handleChange}
                                    placeholder="e.g. ABC University"
                                    required
                                />
                            </div>
                        </div>

                        <button className="issue-button" type="submit" disabled={loading}>
                            {loading ? "Issuing..." : "Issue Credential"}
                        </button>
                    </form>

                    {issueError && <div className="error-message">❌ {issueError}</div>}
                </div>

                {/* RIGHT SIDEBAR / PANEL */}
                <div className="trust-panel">
                    <div className="diamond-icon">◇</div>
                    <span className="eyebrow">BLOCKCHAIN VERIFIED</span>
                    <h2>Built for trust.</h2>
                    <p className="description">
                        Every credential is issued with a unique fingerprint and anchored to the blockchain for effortless verification.
                    </p>

                    <div className="divider"></div>

                    <ul className="trust-list">
                        <li>
                            <span className="check-icon">✓</span> Tamper-evident records
                        </li>
                        <li>
                            <span className="check-icon">✓</span> Permanent on-chain proof
                        </li>
                        <li>
                            <span className="check-icon">✓</span> Instant global verification
                        </li>
                    </ul>

                    <p className="trust-footer">
                        Your records remain private, permanent, and ready when needed.
                    </p>
                </div>
            </div>

            {/* SUCCESS MODAL / CARD */}
            {issuedCredential && (
                <div className="success-card">
                    <div className="success-icon">✓</div>
                    <h2>Credential Issued Successfully</h2>
                    <p className="success-message">
                        The academic credential has been successfully recorded.
                    </p>

                    <div className="credential-info">
                        <div className="info-item">
                            <span>Student</span>
                            <strong>{data.name}</strong>
                        </div>
                        <div className="info-item">
                            <span>Degree</span>
                            <strong>{data.degree}</strong>
                        </div>
                        <div className="info-item">
                            <span>Certificate Hash</span>
                            <strong className="hash">{issuedCredential.credential_hash}</strong>
                        </div>
                        <div className="info-item">
                            <span>IPFS CID</span>
                            <strong className="hash">{issuedCredential.ipfs_cid}</strong>
                        </div>
                        <div className="info-item">
                            <span>Transaction Hash</span>
                            <strong className="hash">{issuedCredential.transaction_hash}</strong>
                        </div>
                        <div className="info-item">
                            <span>Block Index</span>
                            <strong>{issuedCredential.block_index}</strong>
                        </div>
                        <div className="info-item">
                            <span>Blockchain Status</span>
                            <strong className="status">✓ {issuedCredential.blockchain_status}</strong>
                        </div>
                        <div className="info-item">
                            <span>Issued At</span>
                            <strong>{issuedCredential.issued_at}</strong>
                        </div>
                    </div>

                    <div className="qr-container" style={{textAlign: 'center', margin: '2rem 0'}}>
                        <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${issuedCredential.credential_hash}`} 
                            alt="Verification QR Code" 
                            style={{borderRadius: '8px', padding: '10px', background: 'white', display: 'inline-block'}}
                        />
                        <p style={{color: '#94a3b8', fontSize: '0.85rem', marginTop: '10px', margin: '10px 0 0 0'}}>
                            Scan to retrieve Certificate Hash
                        </p>
                    </div>

                    <button className="verify-button" onClick={() => navigate("/institution")}>
                        Verify Credential
                    </button>
                </div>
            )}
        </div>
    );
}
export default Issue;