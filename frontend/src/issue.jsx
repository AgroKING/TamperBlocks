
function Issue({ data, setdata }) {

    function handleChange(event) {
        setdata({
            ...data,
            [event.target.name]: event.target.value
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();

        const response = await fetch("http://localhost:3000/credentials", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });

        console.log(response);
    }

    return (
        <form className="issue-form" onSubmit={handleSubmit}>

            <div className="form-header">
                <h3>Credential Information</h3>
                <p>
                    Enter the student's academic information below.
                </p>
            </div>

            <div className="form-grid">

                <div className="form-group full-width">
                    <label htmlFor="name">
                        Student Name
                    </label>

                    <input
                        id="name"
                        name="name"
                        value={data.name}
                        onChange={handleChange}
                        placeholder="Oasis Poudel"
                    />
                </div>


                <div className="form-group">
                    <label htmlFor="Rollno">
                        Roll Number
                    </label>

                    <input
                        id="Rollno"
                        name="Rollno"
                        value={data.Rollno}
                        onChange={handleChange}
                        placeholder="124CS0138"
                    />
                </div>


                <div className="form-group">
                    <label htmlFor="degree">
                        Degree
                    </label>

                    <input
                        id="degree"
                        name="degree"
                        value={data.degree}
                        onChange={handleChange}
                        placeholder="B.Tech"
                    />
                </div>


                <div className="form-group">
                    <label htmlFor="branch">
                        Branch
                    </label>

                    <input
                        id="branch"
                        name="branch"
                        value={data.branch}
                        onChange={handleChange}
                        placeholder="Computer Science"
                    />
                </div>


                <div className="form-group">
                    <label htmlFor="gyear">
                        Graduation Year
                    </label>

                    <input
                        id="gyear"
                        name="gyear"
                        value={data.gyear}
                        onChange={handleChange}
                        placeholder="2028"
                    />
                </div>

            </div>

            <div className="form-footer">

                <button
                    type="submit"
                    className="submit-button"
                >
                    Issue Credential
                </button>

            </div>

        </form>
    );
}

export default Issue;