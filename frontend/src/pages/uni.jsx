import { useNavigate } from "react-router-dom";
import BlurText from "../components/BlurText";
import bgImage from "../components/image.png";

export function Uni() {
    const navigate = useNavigate();

    return (
        <div className="university-page">
            <img src={bgImage} alt="" className="university-bg-image" />

            <div className="university-header">
                <BlurText
                    as="h1"
                    text="University Portal"
                    delay={50}
                    animateBy="words"
                    direction="bottom"
                />
                <p>
                    Manage and verify academic credentials
                </p>
            </div>

            <div className="university-content">

                <div className="university-welcome">
                    <h2>Credential Management</h2>
                    <p>
                        Issue, lookup, or revoke academic credentials.
                    </p>
                </div>

                <div className="university-actions">

                    {/* ISSUE CREDENTIAL */}
                    <div className="portal-action-card">

                        <div className="action-icon">
                            <svg viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M12 5V19M5 12H19"
                                    stroke="currentColor"
                                    strokeWidth="1.75"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </div>

                        <h3>Issue Credential</h3>

                        <p>
                            Create and issue a new academic
                            credential to a student.
                        </p>

                        <button
                            className="issue-credential-button"
                            onClick={() => navigate("/university/issue")}
                        >
                            Issue Credentials
                        </button>

                    </div>


                    {/* LOOKUP CREDENTIAL */}
                    <div className="portal-action-card">

                        <div className="action-icon">
                            <svg viewBox="0 0 24 24" fill="none">
                                <circle
                                    cx="10.5"
                                    cy="10.5"
                                    r="6.5"
                                    stroke="currentColor"
                                    strokeWidth="1.75"
                                />
                                <path
                                    d="M20 20L15.2 15.2"
                                    stroke="currentColor"
                                    strokeWidth="1.75"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </div>

                        <h3>Lookup Credential</h3>

                        <p>
                            Search for an existing credential
                            using its ID or hash.
                        </p>

                        <button
                            className="lookup-credential-button"
                            onClick={() => navigate("/university/lookup")}
                        >
                            Lookup Credentials
                        </button>

                    </div>


                    {/* REVOKE CREDENTIAL */}
                    <div className="portal-action-card revoke-action-card">

                        <div className="action-icon revoke-action-icon">
                            <svg viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M6 6L18 18M18 6L6 18"
                                    stroke="currentColor"
                                    strokeWidth="1.75"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </div>

                        <h3>Revoke Credential</h3>

                        <p>
                            Permanently mark an issued credential
                            as revoked and prevent it from being
                            considered valid.
                        </p>

                        <button
                            className="revoke-credential-button"
                            onClick={() => navigate("/university/revoke")}
                        >
                            Revoke Credential
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Uni;