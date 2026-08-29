import { useNavigate } from "react-router-dom";
export function Uni() {
    const navigate = useNavigate();
    return (
        <div className="university-page">

            <div className="university-header">
                <h1>University Portal</h1>
                <p>
                    Manage and verify academic credentials
                </p>
            </div>

            <div className="university-content">

                <div className="university-welcome">
                    <h2>Credential Management</h2>
                    <p>
                        Issue new academic credentials or look up
                        existing credentials.
                    </p>
                </div>

                <div className="university-actions">

                    <div className="portal-action-card">
                        <div className="action-icon">
                            +
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


                    <div className="portal-action-card">
                        <div className="action-icon">
                            🔍
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

                </div>

            </div>

        </div>
    );
}



