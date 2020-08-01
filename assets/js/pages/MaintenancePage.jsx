import React, { useState, useEffect } from 'react';
import Field from '../components/forms/Field';
import Select from '../components/forms/Select';
import { Link } from 'react-router-dom';
import VehiculesAPI from '../services/vehiculesAPI';
import MaintenancesAPI from '../services/maintenancesAPI';
import axios from 'axios';


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

    // Récupération des véhicules
    const fetchVehicules = async () => {
        try {
            const data = await VehiculesAPI.findAll();
            setVehicules(data);

            if (!maintenance.vehicule) setMaintenance({ ...maintenance, vehicule: data[0].id });
        } catch (error) {
            history.replace("/maintenances");
        }
    };

    // Récupération d'une maintenance
    const fetchMaintenance = async id => {
        try {
            const { date, type, amount, vehicule } = await MaintenancesAPI.find(id);
            setMaintenance({ date, type, amount, vehicule: vehicule.id });
        } catch (error) {
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
            if (editing) {
                await MaintenancesAPI.update(id, maintenance);
                history.replace("/maintenances");
            } else {
                await MaintenancesAPI.create(maintenance);
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
            
            <form onSubmit={handleSubmit}>
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
            </form>
        </>
    );
}
 
export default MaintenancePage;