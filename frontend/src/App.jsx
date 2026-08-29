import CredentialCard from "./credcard";
import Issue from "./issue";
import Verify from "./verify";
import { useState } from "react";
import "./App.css";//I imported this file(Oasis)

function App() {
    const [data, setdata] = useState({
        name: "",
        Rollno: "",
        degree: "",
        branch: "",
        gyear: ""
    });

    const [page, setpage] = useState("home");
    const [credential, setCredential] = useState(null);

    return (
        <div className="app">

            {/* Navigation */}
            <nav className="navbar">
                <div className="logo">
                    ◈ TamperBlocks
                </div>

                <div className="nav-buttons">
                    <button
                        className="nav-button"
                        onClick={() => setpage("issue")}
                    >
                        Issue
                    </button>

                    <button
                        className="nav-button"
                        onClick={() => setpage("verify")}
                    >
                        Verify
                    </button>
                </div>
            </nav>

            {/* Main content */}
            <main className="main-content">

                {page === "home" && (
                    <section className="hero">

                        <div className="hero-badge">
                            BLOCKCHAIN-BASED CREDENTIALS
                        </div>

                        <h1 className="hero-title">
                            Academic credentials you can <span>trust.</span>
                        </h1>

                        <p className="hero-description">
                            Issue and verify academic credentials securely
                            using tamper-resistant blockchain technology.
                        </p>

                        <div className="hero-buttons">
                            <button
                                className="primary-button"
                                onClick={() => setpage("issue")}
                            >
                                Issue Credential
                            </button>

                            <button
                                className="secondary-button"
                                onClick={() => setpage("verify")}
                            >
                                Verify Credential
                            </button>
                        </div>

                        <div className="features">

                            <div className="feature-card">
                                <div className="feature-icon">✓</div>
                                <h3>Tamper Resistant</h3>
                                <p>
                                    Credentials are protected against
                                    unauthorized modification.
                                </p>
                            </div>

                            <div className="feature-card">
                                <div className="feature-icon">⛓</div>
                                <h3>Blockchain Verified</h3>
                                <p>
                                    Credential records can be verified
                                    against blockchain data.
                                </p>
                            </div>

                            <div className="feature-card">
                                <div className="feature-icon">⌁</div>
                                <h3>Instant Verification</h3>
                                <p>
                                    Quickly verify the authenticity of
                                    an academic credential.
                                </p>
                            </div>

                        </div>

                    </section>
                )}

                {page === "issue" && (
                    <section className="page-section">

                        <button
                            className="back-button"
                            onClick={() => setpage("home")}
                        >
                            ← Back
                        </button>

                        <h2>Issue Credential</h2>
                        <p className="page-description">
                            Create a secure academic credential.
                        </p>

                        <Issue
                            data={data}
                            setdata={setdata}
                        />

                        <CredentialCard data={data} />

                    </section>
                )}

                {page === "verify" && (
                    <section className="page-section">

                        <button
                            className="back-button"
                            onClick={() => setpage("home")}
                        >
                            ← Back
                        </button>

                        <h2>Verify Credential</h2>
                        <p className="page-description">
                            Check whether an academic credential is authentic.
                        </p>

                        <Verify />

                    </section>
                )}

            </main>

        </div>
    );
}

export default App;
