import React, { useEffect, useState } from 'react';
import Pagination from '../components/Pagination';
import VehiculesAPI from '../services/vehiculesAPI';


const VehiculesPage = props => {

    const [vehicules, setVehicules] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");

    //Récupération des véhicules
    const fetchVehicules = async () => {
        try {
            const data = await VehiculesAPI.findAll();
            setVehicules(data);
        } catch (error) {
            console.log(error.response);
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
        } catch (error) {
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

    return ( 
        <>
            <h1>Liste des véhicules</h1>

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
                        <th>Id.</th>
                        <th>Marque</th>
                        <th>Modèle</th>
                        <th>Année</th>
                        <th>Immatriculation</th>
                        <th className="text-center">Maintenances</th>
                        <th className="text-center">Montant total</th>
                        <th />
                    </tr>
                </thead>
                <tbody>
                    {paginatedVehicules.map(vehicule => 
                        <tr key={vehicule.id}>
                            <td>{vehicule.id}</td>
                            <td>{vehicule.brand}</td>
                            <td>{vehicule.reference}</td>
                            <td>{vehicule.modelyear}</td>
                            <td>{vehicule.identification}</td>
                            <td className="text-center">
                                <span className="badge badge-dark">
                                    {vehicule.nbAmount}
                                </span>
                            </td>
                            <td className="text-center">{vehicule.totalAmount.toLocaleString()} €</td>
                            <td>
                                <button
                                    onClick={() => handleDelete(vehicule.id)}
                                    disabled={vehicule.maintenances.length > 0} 
                                    className="btn btn-sm btn-danger">
                                        Supprimer
                                </button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

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