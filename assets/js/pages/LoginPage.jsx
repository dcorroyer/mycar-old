import React, { useState, useContext } from 'react';
import AuthAPI from '../services/authAPI';
import AuthContext from '../contexts/AuthContext';


const LoginPage = ({ history }) => {

    const { setIsAuthenticated } = useContext(AuthContext);

    const [credentials, setCredentials] = useState({
        username: "zjohns@ondricka.com",
        password: ""
    });
    const [error, setError] = useState("");

    //Gestion des champs
    const handleChange = ({currentTarget}) => {
        const { value, name } = currentTarget;
        setCredentials({...credentials, [name]: value});
    };

    //Gestion de l'envoi
    const handleSubmit = async event => {
        event.preventDefault();

        try {
            await AuthAPI.authenticate(credentials);
            setError("");
            setIsAuthenticated(true);
            history.replace("/vehicules")
        } catch (error) {
            setError(
                "Aucun compte ne possède cette adresse email ou alors les informations ne correspondent pas."
            );
        }
    };

    return ( 
        <>
            <h1>Connexion !</h1>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username"></label>
                    <input 
                        value={credentials.username}
                        onChange={handleChange}
                        type="email" 
                        placeholder="Adresse email"
                        name="username"
                        id="username"
                        className={"form-control" + (error && " is-invalid")}
                    />
                    {error && <p className="invalid-feedback">{error}</p>}
                    
                </div>
                <div className="form-group">
                    <label htmlFor="password"></label>
                    <input 
                        value={credentials.password}
                        onChange={handleChange}
                        type="password" 
                        placeholder="Mot de passe"
                        name="password"
                        id="password"
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <button type="submit" className="btn btn-success">
                        Je me connecte
                    </button>
                </div>
            </form>
        </>
     );
}
 
export default LoginPage;