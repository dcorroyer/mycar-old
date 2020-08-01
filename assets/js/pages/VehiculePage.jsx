import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Field from '../components/forms/Field';
import FormContentLoader from '../components/loaders/FormContentLoader';
import VehiculesAPI from '../services/vehiculesAPI';


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
    const [loading, setLoading] = useState(false);

    // Récupération du véhicule en fonction de l'identifiant
    const fetchVehicule = async id => {
        try {
            const { type, brand, reference, modelyear, identification } = await VehiculesAPI.find(id);
            setVehicule({ type, brand, reference, modelyear, identification });
            setLoading(false);
        } catch (error) {
            toast.error("Une erreur est survenue !");
            history.replace('/vehicules');
        }
    };

    // Chargement du véhicule en fonction de l'identifiant
    useEffect(() => {
        if (id !== "new") {
            setLoading(true);
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
            setErrors({});
            if (editing) {
                await VehiculesAPI.update(id, vehicule);
                toast.success("Le véhicule a bien été modifié !");
            } else {
                await VehiculesAPI.create(vehicule);
                toast.success("Le véhicule a bien été créé !");
                history.replace("/vehicules");
            }
        } catch ({ response }) {
            const { violations } = response.data;

            if (violations) {
                const apiErrors = {};
                violations.forEach(({ propertyPath, message }) => {
                    apiErrors[propertyPath] = message;
                });
                setErrors(apiErrors);
                toast.error("Une erreur est survenue !");
            }
        }
    };

    return (
        <>
            {(!editing && 
                <h1>Création d'un véhicule!</h1>
                ) || (
                <h1>Modification du véhicule!</h1>
            )}

            {loading && <FormContentLoader />}
            {!loading && <form onSubmit={handleSubmit}>
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
            </form> }
        </>
    );
};

export default VehiculePage;