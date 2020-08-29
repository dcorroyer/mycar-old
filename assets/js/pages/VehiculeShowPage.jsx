import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {toast} from 'react-toastify';
import Field from '../components/forms/Field';
import FormContentLoader from '../components/loaders/FormContentLoader';
import VehiculesAPI from '../services/vehiculesAPI';
import TableLoader from "../components/loaders/TableLoader";
import Pagination from "../components/Pagination";
import moment from "moment";


const VehiculeShowPage = ({match, history}) => {

    const {id = "new"} = match.params;

    const [vehicule, setVehicule] = useState({
        type: "",
        brand: "",
        reference: "",
        modelyear: "",
        identification: ""
    });

    const [loading, setLoading] = useState(false);

    // Récupération du véhicule en fonction de l'identifiant
    const fetchVehicule = async id => {
        try {
            const {type, brand, reference, modelyear, identification, maintenances} = await VehiculesAPI.find(id);
            setVehicule({type, brand, reference, modelyear, identification, maintenances});
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
            fetchVehicule(id);
        }
    }, [id]);

    //Gestion du format de la date
    const formatDate = str => moment(str).format('DD/MM/YYYY');

    return (
        <>
            {vehicule.maintenances &&
            <div>
                <div className="mb-3 d-flex justify-content-between align-items-center">
                    <h1>Liste des maintenances</h1>
                    <Link to="/maintenances/new" className="btn btn-primary">Créer une maintenance</Link>
                </div>

                <table className="table table-hover">
                    <thead>
                    <tr>
                        <th>Chrono</th>
                        <th className="text-center">Date</th>
                        <th>Type</th>
                        <th className="text-center">Montant</th>
                        <th/>
                    </tr>
                    </thead>
                    <tbody>
                    {vehicule.maintenances.map(maintenance =>
                        <tr key={maintenance.id}>
                            <td>{maintenance.chrono}</td>
                            <td className="text-center">{formatDate(maintenance.date)}</td>
                            <td>{maintenance.type}</td>
                            <td className="text-center">
                                {maintenance.amount.toLocaleString()} €
                            </td>
                            <td>
                                <Link
                                    to={"/maintenances/" + maintenance.id}
                                    className="btn btn-sm btn-primary mr-1">
                                    Modifier
                                </Link>
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>

            </div>
            }
        </>
    );
};

export default VehiculeShowPage;