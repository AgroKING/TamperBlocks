
function Issue({ data, setdata }) {
    function handleChange(event) {
        setdata({
            ...data,
            [event.target.name]: event.target.value
        })
    }
    async function handleSubmit(event) {
        event.preventDefault();
        const response = await fetch('http://localhost:3000/credentials', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

    }
    return (<form name="data issue" method="post">
        <p>Student Name:</p><input name="name" value={data.name} onChange={handleChange} placeholder="Adam" />
        <p>Roll No:</p><input name="Rollno" value={data.Rollno} onChange={handleChange} />
        <p>Degree:</p><input name="degree" value={data.degree} onChange={handleChange} />
        <p>Branch:</p><input name="branch" value={data.branch} onChange={handleChange} />
        <p>Graduation Year</p><input name="gyear" value={data.gyear} onChange={handleChange} />
        <button onClick={handleSubmit}>issue</button>
    </form>

    )

}

export default Issue