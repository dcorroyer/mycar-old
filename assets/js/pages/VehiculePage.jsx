import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Field from '../components/forms/Field';
import VehiculesAPI from "../services/vehiculesAPI";


const VehiculePage = ({ match, history }) => {

    const { id = "new" } = match.params;

    const [vehicule, setVehicule] = useState({
        type: "",
        brand: "",
        reference: "",
        modelyear: "",
        identification: ""
    });

    const [errors, setErrors] = useState({
        type: "",
        brand: "",
        reference: "",
        modelyear: "",
        identification: ""
    });

    const [editing, setEditing] = useState(false);

    // Récupération du véhicule en fonction de l'identifiant
    const fetchVehicule = async id => {
        try {
            const { type, brand, reference, modelyear, identification } = await VehiculesAPI.find(id);
            setVehicule({ type, brand, reference, modelyear, identification });
        } catch (error) {
            history.replace('/vehicules');
        }
    };

    // Chargement du véhicule en fonction de l'identifiant
    useEffect(() => {
        if (id !== "new") {
            setEditing(true);
            fetchVehicule(id);
        }
    }, [id]);

    // Gestion des changements des inputs dans le formulaire
    const handleChange = ({ currentTarget }) => {
        const { name, value } = currentTarget;
        setVehicule({ ...vehicule, [name]: value });
    };

    // Gestion de la soumission du formulaire
    const handleSubmit = async event => {
        event.preventDefault();

        try {
            if (editing) {
                await VehiculesAPI.update(id, vehicule);
            } else {
                await VehiculesAPI.create(vehicule);
                history.replace("/vehicules");
            }
            setErrors({});
        } catch ({ response }) {
            const { violations } = response.data;

            if (violations) {
                const apiErrors = {};
                violations.forEach(({ propertyPath, message }) => {
                    apiErrors[propertyPath] = message;
                });
                setErrors(apiErrors);
            }
        }
    };

    return (
        <>
            {(!editing && <h1>Création d'un véhicule!</h1>) || (<h1>Modification du véhicule!</h1>)}

            <form onSubmit={handleSubmit}>
                <Field 
                    name="type" 
                    label="Type" 
                    placeholder="Type du véhicule"
                    value={vehicule.type}
                    onChange={handleChange}
                    error={errors.type}
                />
                <Field 
                    name="brand" 
                    label="Marque" 
                    placeholder="Marque du véhicule" 
                    value={vehicule.brand}
                    onChange={handleChange}
                    error={errors.brand}
                />
                <Field 
                    name="reference" 
                    label="Modèle" 
                    placeholder="Modèle du véhicule" 
                    value={vehicule.reference}
                    onChange={handleChange}
                    error={errors.reference}
                />
                <Field 
                    name="modelyear" 
                    label="Année" 
                    placeholder="Année du véhicule" 
                    value={vehicule.modelyear}
                    onChange={handleChange}
                    error={errors.modelyear}
                />
                <Field 
                    name="identification" 
                    label="Immatriculation" 
                    placeholder="Immatriculation du véhicule" 
                    value={vehicule.identification}
                    onChange={handleChange}
                    error={errors.identification}
                />

                <div className="form-group">
                    <button type="submit" className="btn btn-success">
                        Enregistrer
                    </button>
                    <Link to="/vehicules" className="btn btn-link">
                        Retour à la liste
                    </Link>
                </div>
            </form>
        </>
    );
};

export default VehiculePage;