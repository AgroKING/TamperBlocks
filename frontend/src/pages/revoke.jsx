import { useState } from "react";
import { api } from "../services/api";

function Revoke() {
    const [credentialId, setCredentialId] = useState("");
    const [reason, setReason] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();

        setLoading(true);
        setResult(null);

        try {
            const response = await api.revokeCertificate(credentialId, reason);
            setResult({
                credential_id: credentialId,
                status: "REVOKED",
                reason: reason,
                transaction_hash: response.transaction_hash,
                message: response.message
            });
        } catch (error) {
            setResult({
                credential_id: credentialId,
                status: "FAILED",
                reason: reason,
                error: error.message
            });
        }

        setLoading(false);
    }

    return (
        <div className="revoke-page">

            <div className="revoke-container">

                <div className="revoke-card">

                    <div className="revoke-header">

                        <div className="revoke-icon">
                            <svg viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M6 6L18 18M18 6L6 18"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </div>

                        <span className="revoke-eyebrow">
                            CREDENTIAL ADMINISTRATION
                        </span>

                        <h1>Revoke Credential</h1>

                        <p>
                            Mark an existing academic credential as
                            invalid and prevent it from being accepted
                            as a valid record.
                        </p>

                    </div>


                    <form
                        className="revoke-form"
                        onSubmit={handleSubmit}
                    >

                        <div className="revoke-form-group">

                            <label>
                                Certificate Hash
                            </label>

                            <input
                                type="text"
                                value={credentialId}
                                onChange={(event) =>
                                    setCredentialId(event.target.value)
                                }
                                placeholder="e.g. 0x3a7b..."
                                required
                            />

                            <span className="revoke-input-help">
                                Enter the certificate hash to revoke.
                            </span>

                        </div>


                        <div className="revoke-form-group">

                            <label>
                                Reason for Revocation
                            </label>

                            <select
                                value={reason}
                                onChange={(event) =>
                                    setReason(event.target.value)
                                }
                                required
                            >
                                <option value="">
                                    Select a reason
                                </option>

                                <option value="incorrect_information">
                                    Incorrect Information
                                </option>

                                <option value="credential_withdrawn">
                                    Credential Withdrawn
                                </option>

                                <option value="administrative_error">
                                    Administrative Error
                                </option>

                                <option value="other">
                                    Other
                                </option>
                            </select>

                        </div>


                        <div className="revoke-warning">

                            <div className="revoke-warning-icon">
                                !
                            </div>

                            <div>
                                <strong>
                                    Revocation is permanent
                                </strong>

                                <p>
                                    Once processed by the blockchain,
                                    this credential will no longer be
                                    considered valid.
                                </p>
                            </div>

                        </div>


                        <button
                            className="revoke-submit-button"
                            type="submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Processing..."
                                : "Revoke Credential"}
                        </button>

                    </form>


                    {result && (
                        <div className="revoke-result">

                            <div className="revoke-result-icon">
                                {result.status === "REVOKED" ? "✓" : "✗"}
                            </div>

                            <div>
                                <strong>
                                    {result.status === "REVOKED"
                                        ? "Certificate Revoked Successfully"
                                        : "Revocation Failed"}
                                </strong>

                                <p>
                                    Certificate Hash:{" "}
                                    <span>
                                        {result.credential_id}
                                    </span>
                                </p>

                                <p>
                                    Status:{" "}
                                    <strong>
                                        {result.status}
                                    </strong>
                                </p>

                                {result.transaction_hash && (
                                    <p>
                                        Transaction:{" "}
                                        <span style={{fontFamily: 'monospace', fontSize: '12px'}}>
                                            {result.transaction_hash}
                                        </span>
                                    </p>
                                )}

                                {result.error && (
                                    <p style={{color: '#ef4444'}}>
                                        Error: {result.error}
                                    </p>
                                )}
                            </div>

                        </div>
                    )}

                </div>


                <div className="revoke-info-panel">

                    <span className="revoke-panel-eyebrow">
                        CONTROLLED ACCESS
                    </span>

                    <h2>
                        Protect the integrity of your records.
                    </h2>

                    <p>
                        Revocation provides universities with a
                        controlled mechanism for invalidating
                        credentials that should no longer be trusted.
                    </p>

                    <div className="revoke-divider"></div>

                    <ul>
                        <li>
                            <span>×</span>
                            Invalid credentials become identifiable
                        </li>

                        <li>
                            <span>✓</span>
                            Revocation is recorded transparently
                        </li>

                        <li>
                            <span>◆</span>
                            Blockchain state remains auditable
                        </li>
                    </ul>

                </div>

            </div>

        </div>
    );
}

export default Revoke;