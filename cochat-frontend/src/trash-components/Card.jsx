import logo from './assets/logo.png'

function Card() {
    return (
        <div className="card">
            <img src={logo} alt="profile picture"></img>
            <h2>cochat</h2>
            <p>Real-Time Syncing for ChatGPT</p>

        </div>
    );
}
export default Card