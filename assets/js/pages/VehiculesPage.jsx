import React from 'react';

const VehiculePage = (props) => {
    return ( 
        <>
            <h1>Liste des véhicules</h1>

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
                    <tr>
                        <td>2</td>
                        <td>Opel</td>
                        <td>Corsa</td>
                        <td>1999</td>
                        <td>DK-888-AX</td>
                        <td className="text-center">
                            <span className="badge badge-dark">
                                5
                            </span>
                        </td>
                        <td className="text-center">1325€</td>
                        <td>
                            <button className="btn btn-sm btn-danger">Supprimer</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </>
     );
}
 
export default VehiculePage;