import moment from 'moment';
import React, { useState, useEffect } from 'react';
import Field from '../components/forms/Field';
import Select from '../components/forms/Select';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import VehiculesAPI from '../services/vehiculesAPI';
import MaintenancesAPI from '../services/maintenancesAPI';
import FormContentLoader from '../components/loaders/FormContentLoader';


const MaintenancePage = ({ match, history }) => {

    const { id = "new" } = match.params;

    const [maintenance, setMaintenance] = useState({
        date: "",
        type: "Entretien",
        amount: "",
        vehicule: ""
    });

    const [errors, setErrors] = useState({
        date: "",
        type: "",
        amount: "",
        vehicule: ""
    });

    const [vehicules, setVehicules] = useState([]);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    //Gestion du format de la date avec moment
    //const formatDate = str => moment(str).format('YYYY/MM/DD');

    // Récupération des véhicules
    const fetchVehicules = async () => {
        try {
            const data = await VehiculesAPI.findAll();
            setVehicules(data);
            if (!maintenance.vehicule) setMaintenance({ ...maintenance, vehicule: data[0].id });
        } catch (error) {
            toast.error("Une erreur est survenue !");
            history.replace("/maintenances");
        }
    };

    // Récupération d'une maintenance
    const fetchMaintenance = async id => {
        try {
            const { date, type, amount, vehicule } = await MaintenancesAPI.find(id);
            setMaintenance({ date, type, amount, vehicule: vehicule.id });
            setLoading(false);
        } catch (error) {
            toast.error("Une erreur est survenue !");
            history.replace("/maintenances");
        }
    };

    // Chargement des véhicules
    useEffect(() => {
        fetchVehicules();
    }, []);

    // Chargement d'une maintenance en fonction de l'identifiant
    useEffect(() => {
        if (id !== "new") {
            setLoading(true);
            setEditing(true);
            fetchMaintenance(id);
        }
    }, [id]);

    // Gestion des changements des inputs dans le formulaire
    const handleChange = ({ currentTarget }) => {
        const { name, value } = currentTarget;
        setMaintenance({ ...maintenance, [name]: value });
    };

    // Gestion de la soumission du formulaire
    const handleSubmit = async event => {
        event.preventDefault();

        try {
            setErrors({});
            if (editing) {
                await MaintenancesAPI.update(id, maintenance);
                toast.success("La maintenance a bien été modifié !");
                history.replace("/maintenances");
            } else {
                await MaintenancesAPI.create(maintenance);
                toast.success("La maintenance a bien été créé !");
                history.replace("/maintenances");
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
                <h1>Création d'une maintenance!</h1>
                ) || (
                <h1>Modification de la maintenance!</h1>
            )}

            {loading && <FormContentLoader />}
            {!loading && <form onSubmit={handleSubmit}>
                <Field
                    name="date"
                    type="date"
                    placeholder="Date de la maintenance"
                    label="Date"
                    onChange={handleChange}
                    value={maintenance.date}
                    error={errors.date}
                />
                <Select
                    name="type"
                    label="Type"
                    value={maintenance.type}
                    error={errors.type}
                    onChange={handleChange}
                >
                    <option value="Entretien">Entretien</option>
                    <option value="Réparation">Réparation</option>
                    <option value="Restauration">Restauration</option>
                </Select>
                <Field
                    name="amount"
                    type="number"
                    placeholder="Montant de la maintenance"
                    label="Montant"
                    onChange={handleChange}
                    value={maintenance.amount}
                    error={errors.amount}
                />
                <Select
                    name="vehicule"
                    label="Véhicule"
                    value={maintenance.vehicule}
                    error={errors.vehicule}
                    onChange={handleChange}
                >
                    {vehicules.map(vehicule => (
                        <option key={vehicule.id} value={vehicule.id}>
                            {vehicule.brand} {vehicule.reference}
                        </option>
                    ))}
                </Select>

                <div className="form-group">
                    <button type="submit" className="btn btn-success">
                        Enregistrer
                    </button>
                    <Link to="/maintenances" className="btn btn-link">
                        Retour à la liste
                    </Link>
                </div>
            </form> }
        </>
    );
};
 
export default MaintenancePage;