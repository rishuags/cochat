function Student(props) {
    return (
        <div>
            <p className="text-red-500">Name: {props.name} </p>
            <p className="text-red-500">Age: {props.age} </p>
            <p className="text-red-500">Student: {props.isStudent ? "Yes" : "No"} </p>
        </div>
    )

}
export default Student;