import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {toast} from 'react-toastify';
import TableLoader from '../components/loaders/TableLoader';
import Pagination from '../components/Pagination';
import MaintenancesAPI from '../services/maintenancesAPI';


const MaintenancesPage = props => {

    const [maintenances, setMaintenances] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    //Récupération des maintenances
    const fetchMaintenances = async () => {
        try {
            const data = await MaintenancesAPI.findAll();
            setMaintenances(data);
            setLoading(false);
        } catch (error) {
            toast.error("Une erreur est survenue lors du chargement des maintenances !");
        }
    };

    //Récupération des maintenances au chargement du composant
    useEffect(() => {
        fetchMaintenances()
    }, []);

    //Gestion de la suppression d'une maintenance
    const handleDelete = async id => {
        if (confirm("Supprimer ?")) {
            const originalMaintenances = [...maintenances];
            setMaintenances(maintenances.filter(maintenance => maintenance.id !== id));

            try {
                await MaintenancesAPI.delete(id);
                toast.success("La maintenance a été supprimée !");
            } catch (error) {
                toast.error("Une erreur est survenue !");
                setMaintenances(originalMaintenances);
            }
        }
    };

    //Gestion du changement de page
    const handlePageChange = page => {
        setCurrentPage(page);
    };

    //Gestion de la recherche
    const handleSearch = ({currentTarget}) => {
        setSearch(currentTarget.value);
        setCurrentPage(1);
    };

    const itemsPerPage = 10;

    //Gestion du format de la date avec moment
    const formatDate = str => moment(str).format('DD/MM/YYYY');

    //Filtrage des maintenances en fonction de la recherche
    const filteredMaintenances = maintenances.filter(
        m =>
            m.type.toLowerCase().includes(search.toLowerCase()) ||
            m.date.toLowerCase().includes(search.toLowerCase()) ||
            m.vehicule.brand.toLowerCase().includes(search.toLowerCase()) ||
            m.vehicule.reference.toLowerCase().includes(search.toLowerCase())
    );

    //Pagination des maintenances
    const paginatedMaintenances = Pagination.getData(
        filteredMaintenances,
        currentPage,
        itemsPerPage
    );

    return (
        <>
            <div className="mb-3 d-flex justify-content-between align-items-center">
                <h1>Liste des maintenances</h1>
                <Link to="/maintenances/new" className="btn btn-primary">Créer une maintenance</Link>
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
                    <th>Chrono</th>
                    <th className="text-center">Date</th>
                    <th>Type</th>
                    <th className="text-center">Montant</th>
                    <th>Véhicule</th>
                    <th/>
                </tr>
                </thead>
                {!loading && <tbody>
                {paginatedMaintenances.map(maintenance =>
                    <tr key={maintenance.id}>
                        <td>{maintenance.chrono}</td>
                        <td className="text-center">{formatDate(maintenance.date)}</td>
                        <td>{maintenance.type}</td>
                        <td className="text-center">
                            {maintenance.amount.toLocaleString()} €
                        </td>
                        <td>
                            {maintenance.vehicule.brand}
                            {maintenance.vehicule.reference}
                        </td>
                        <td>
                            <Link
                                to={"/maintenances/" + maintenance.id}
                                className="btn btn-sm btn-primary mr-1">
                                Modifier
                            </Link>
                            <button
                                onClick={() => handleDelete(maintenance.id)}
                                className="btn btn-sm btn-danger">
                                Supprimer
                            </button>
                        </td>
                    </tr>
                )}
                </tbody>}
            </table>

            {loading && <TableLoader/>}

            {itemsPerPage < filteredMaintenances.length &&
            <Pagination
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                length={filteredMaintenances.length}
                onPageChanged={handlePageChange}
            />
            }

        </>
    );
};

export default MaintenancesPage;