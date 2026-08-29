
import { useNavigate } from "react-router-dom";

export function Home() {

    const navigate = useNavigate();

    return (
        <div className="home-page">

            <div className="home-header">

                <span className="home-eyebrow">
                    TEAM-OMNICODE
                </span>

                <h1>
                    Academic Credential
                    <br />
                    Verification System
                </h1>

                <p>
                    Secure, tamper-proof academic credentials
                    powered by blockchain technology.
                </p>

            </div>


            <div className="home-actions">

                <div className="home-action-card">

                    <div className="home-action-icon">
                        U
                    </div>

                    <h2>
                        University Portal
                    </h2>

                    <p>
                        Issue new academic credentials and
                        manage existing student credentials.
                    </p>

                    <button
                        className="home-button"
                        onClick={() => navigate("/university")}
                    >
                        University Portal
                        <span>→</span>
                    </button>

                </div>


                <div className="home-action-card">

                    <div className="home-action-icon">
                        ✓
                    </div>

                    <h2>
                        Institution Portal
                    </h2>

                    <p>
                        Verify the authenticity of academic
                        credentials recorded on the blockchain.
                    </p>

                    <button
                        className="home-button"
                        onClick={() => navigate("/institution")}
                    >
                        Institution Portal
                        <span>→</span>
                    </button>

                </div>

            </div>

        </div>
    );
}



