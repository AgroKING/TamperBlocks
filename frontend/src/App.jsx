import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import { Home } from "./pages/home";
import { Uni } from "./pages/uni";

import Issue from "./pages/issue";
import Lookup from "./pages/lookup";
import Revoke from "./pages/revoke";
import Verify from "./pages/verify";
import BlockchainStatus from "./pages/BlockchainStatus";

import "./App.css";

function App() {

    const [data, setdata] = useState({
        student_id: "",
        name: "",
        degree: "",
        major: "",
        gpa: "",
        issuing_institution: ""
    });

    return (
        <BrowserRouter>

            <Routes>

                {/* HOME */}
                <Route
                    path="/"
                    element={<Home />}
                />

                {/* UNIVERSITY PORTAL */}
                <Route
                    path="/university"
                    element={<Uni />}
                />

                <Route
                    path="/university/issue"
                    element={
                        <Issue
                            data={data}
                            setdata={setdata}
                        />
                    }
                />

                <Route
                    path="/university/lookup"
                    element={<Lookup />}
                />

                <Route
                    path="/university/revoke"
                    element={<Revoke />}
                />


                {/* INSTITUTION VERIFICATION */}
                <Route
                    path="/institution"
                    element={<Verify />}
                />


                {/* BLOCKCHAIN */}
                <Route
                    path="/blockchain"
                    element={<BlockchainStatus />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;