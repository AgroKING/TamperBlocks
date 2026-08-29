import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { Home } from "./pages/home";
import { Uni } from "./pages/uni";
import Issue from "./pages/issue";
import Lookup from "./pages/lookup";
import Verify from "./pages/verify";
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
                <Route path="/" element={<Home />} />
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
                    path="/institution"
                    element={<Verify />}
                />
            </Routes>

        </BrowserRouter>
    );
}

export default App;