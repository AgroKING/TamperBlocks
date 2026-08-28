import CredentialCard from "./credcard";
import Issue from "./issue";
import Verify from "./verify";
import { useState, useEffect } from "react";
function App() {
    const [data, setdata] = useState({
        name: "",
        Rollno: "",
        degree: "",
        branch: "",
        gyear: ""
    })
    const [page, setpage] = useState("home")
    const [credential, setCredential] = useState(null);

    return (
        <div>
            <h1><b>ACADEMIC CREDENTIAL SYSTEM</b></h1>
            <button onClick={() => setpage("issue")}>Issue Credential</button><br /> <br />
            <button onClick={() => setpage("verify")}>Verify credential</button>
            {page === "issue" && <Issue data={data} setdata={setdata} />}
            <br />  <br />
            {page === "issue" && <CredentialCard data={data} />}
            {page === "verify" && <Verify />}
            <br />  <br />



        </div>
    );
}

export default App
