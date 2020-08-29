import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '../components/Pagination';
import VehiculesAPI from '../services/vehiculesAPI';
import { toast } from 'react-toastify';
import TableLoader from '../components/loaders/TableLoader';
import moment from "moment";


const VehiculesPage = props => {

    const [vehicules, setVehicules] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    //Récupération des véhicules
    const fetchVehicules = async () => {
        try {
            const data = await VehiculesAPI.findAll();
            setVehicules(data);
            setLoading(false);
        } catch (error) {
            toast.error("Une erreur est survenue lors du chargement des véhicules !");
        }
    };

    //Récupération des véhicules au chargement du composant
    useEffect(() => {
        fetchVehicules()
    }, []);

    //Gestion de la suppression d'un véhicule
    const handleDelete = async id => {
        const originalVehicules = [...vehicules];
        setVehicules(vehicules.filter(vehicule => vehicule.id !== id));

        try {
            await VehiculesAPI.delete(id);
            toast.success("Le véhicule a été supprimé !");
        } catch (error) {
            toast.error("Une erreur est survenue !");
            setVehicules(originalVehicules);
        }
    };

    //Gestion du changement de page
    const handlePageChange = page => {
        setCurrentPage(page);
    };

    //Gestion de la recherche
    const handleSearch = ({ currentTarget }) => {
        setSearch(currentTarget.value);
        setCurrentPage(1);
    };

    const itemsPerPage = 6;

    //Filtrage des véhicules en fonction de la recherche
    const filteredVehicules = vehicules.filter(
        v =>
            v.brand.toLowerCase().includes(search.toLowerCase()) ||
            v.reference.toLowerCase().includes(search.toLowerCase())
    );

    //Pagination des véhicules
    const paginatedVehicules = Pagination.getData(
        filteredVehicules, 
        currentPage, 
        itemsPerPage
    );

    //Gestion du format de la date avec moment
    const formatDate = str => moment(str).format('YYYY');

    return ( 
        <>
            <div className="mb-3 d-flex justify-content-between align-items-center">
                <h1>Liste des véhicules</h1>
                <Link to="/vehicules/new" className="btn btn-primary">Créer un véhicule</Link>
            </div>

            <div className="form-group">
                <input 
                    type="text" 
                    onChange={handleSearch}
                    value={search}
                    className="form-control" 
                    placeholder="Rechercher..."
                />
            </div>

            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Marque</th>
                        <th>Modèle</th>
                        <th>Année</th>
                        <th>Immatriculation</th>
                        <th className="text-center">Maintenances</th>
                        <th className="text-center">Montant total</th>
                        <th />
                    </tr>
                </thead>
                {!loading && <tbody>
                    {paginatedVehicules.map(vehicule =>
                        <tr key={vehicule.id}>
                            <td>{vehicule.type}</td>
                            <td>{vehicule.brand}</td>
                            <td>{vehicule.reference}</td>
                            <td>{formatDate(vehicule.modelyear)}</td>
                            <td>{vehicule.identification}</td>
                            <td className="text-center">
                                <span className="badge badge-dark">
                                    {vehicule.nbAmount}
                                </span>
                            </td>
                            <td className="text-center">{vehicule.totalAmount.toLocaleString()} €</td>
                            <td>
                                <Link
                                    to={"/vehicules/show/" + vehicule.id}
                                    className="btn btn-sm btn-primary mr-1">
                                    Voir
                                </Link>
                                <Link
                                    to={"/vehicules/" + vehicule.id}
                                    className="btn btn-sm btn-primary mr-1">
                                        Modifier
                                </Link>
                                <button
                                    onClick={() => handleDelete(vehicule.id)}
                                    disabled={vehicule.maintenances.length > 0}
                                    className="btn btn-sm btn-danger">
                                        Supprimer
                                </button>
                            </td>
                        </tr>
                    )}
                </tbody> }
            </table>
            
            {loading && <TableLoader />}

            {itemsPerPage < filteredVehicules.length && 
                <Pagination 
                    currentPage={currentPage} 
                    itemsPerPage={itemsPerPage} 
                    length={filteredVehicules.length} 
                    onPageChanged={handlePageChange} 
                />
            }

        </>
     );
};
 
export default VehiculesPage;