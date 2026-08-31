import { useLocation, useNavigate, Link } from "react-router-dom";

export function Navigation() {
    const location = useLocation();
    const navigate = useNavigate();

    if (location.pathname === "/") {
        return null; // Don't show on home page
    }

    const handleBack = () => {
        // If inside the university portal subpages, go back to the university dashboard
        if (location.pathname.startsWith("/university/")) {
            navigate("/university");
        } else {
            // Otherwise go to home
            navigate("/");
        }
    };

    return (
        <div style={{
            position: "fixed",
            top: "1.5rem",
            left: "1.5rem",
            zIndex: 9999,
            display: "flex",
            gap: "1rem"
        }}>
            <button 
                onClick={handleBack}
                className="home-button"
                style={{
                    background: "rgba(255, 255, 255, 0.9)",
                    color: "#0f213d",
                    border: "1px solid rgba(15, 33, 61, 0.1)",
                    padding: "0.6rem 1.2rem",
                    borderRadius: "8px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontWeight: "600",
                    fontSize: "0.85rem",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                    backdropFilter: "blur(10px)",
                    transition: "all 0.2s ease",
                    maxWidth: "none"
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 6px 16px rgba(0, 0, 0, 0.12)";
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.08)";
                }}
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                Back
            </button>
            
            {location.pathname.startsWith("/university/") && (
                <button 
                    onClick={() => navigate("/")}
                    className="home-button"
                    style={{
                        background: "rgba(255, 255, 255, 0.9)",
                        color: "#0f213d",
                        border: "1px solid rgba(15, 33, 61, 0.1)",
                        padding: "0.6rem 1.2rem",
                        borderRadius: "8px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontWeight: "600",
                        fontSize: "0.85rem",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                        backdropFilter: "blur(10px)",
                        transition: "all 0.2s ease",
                        maxWidth: "none"
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 6px 16px rgba(0, 0, 0, 0.12)";
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.08)";
                    }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                    Home
                </button>
            )}
        </div>
    );
}
