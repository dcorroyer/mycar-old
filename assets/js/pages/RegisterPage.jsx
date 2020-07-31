import React, { useState } from 'react';
import Field from '../components/forms/Field';
import { Link } from 'react-router-dom';
import UsersAPI from '../services/usersAPI';


const RegisterPage = ({ history }) => {

    const [user, setUser] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        passwordConfirm: ""
    });

    const [errors, setErrors] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        passwordConfirm: ""
    });

    // Gestion des changements des inputs dans le formulaire
    const handleChange = ({ currentTarget }) => {
        const { name, value } = currentTarget;
        setUser({ ...user, [name]: value });
    };

    // Gestion de la soumission du formulaire
    const handleSubmit = async event => {
        event.preventDefault();

        const apiErrors = {};
        if (user.password !== user.passwordConfirm) {
            apiErrors.password = "Les mots de passe ne correspondent pas";
            apiErrors.passwordConfirm = "Les mots de passe ne correspondent pas";
            setErrors(apiErrors);
            return;
        }

        try {
            await UsersAPI.register(user);
            setErrors({});
            history.replace("/login");
        } catch (error) {
            const { violations } = error.response.data;

            if (violations) {
                violations.forEach(violation => {
                    apiErrors[violation.propertyPath] = violation.message
                });
                setErrors(apiErrors);
            }
        }
        console.log(user);
    };

    return ( 
        <>
            <h1>Inscription !</h1>
            <form onSubmit={handleSubmit}>
                <Field 
                    name="firstname"
                    label="Prénom"
                    placeholder="Prénom"
                    error={errors.firstname}
                    value={user.firstname}
                    onChange={handleChange}
                />
                <Field 
                    name="lastname"
                    label="Nom"
                    placeholder="Nom"
                    error={errors.lastname}
                    value={user.lastname}
                    onChange={handleChange}
                />
                <Field 
                    name="email"
                    label="Email"
                    placeholder="Email"
                    type="email"
                    error={errors.email}
                    value={user.email}
                    onChange={handleChange}
                />
                <Field 
                    name="password"
                    label="Mot de passe"
                    placeholder="Mot de passe"
                    type="password"
                    error={errors.password}
                    value={user.password}
                    onChange={handleChange}
                />
                <Field 
                    name="passwordConfirm"
                    label="Confirmer mot de passe"
                    placeholder="Confirmer mot de passe"
                    type="password"
                    error={errors.passwordConfirm}
                    value={user.passwordConfirm}
                    onChange={handleChange}
                />

                <div className="form-group">
                    <button type="submit" className="btn btn-success">
                        Inscription
                    </button>
                    <Link to="/login" className="btn btn-link">
                        J'ai déjà un compte
                    </Link>
                </div>
            </form>
        </>
     );
};
 
export default RegisterPage;