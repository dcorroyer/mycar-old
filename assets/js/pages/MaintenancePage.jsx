import moment from 'moment';
import React, {useState, useEffect} from 'react';
import Field from '../components/forms/Field';
import Select from '../components/forms/Select';
import {Link} from 'react-router-dom';
import {toast} from 'react-toastify';
import VehiculesAPI from '../services/vehiculesAPI';
import MaintenancesAPI from '../services/maintenancesAPI';
import InvoicesAPI from '../services/invoicesAPI';
import FileAPI from '../services/fileAPI';
import FormContentLoader from '../components/loaders/FormContentLoader';


const MaintenancePage = ({match, history}) => {
    const {id = "new"} = match.params;

    const [maintenance, setMaintenance] = useState({
        id: "",
        date: "",
        type: "Entretien",
        amount: "",
        vehicule: "",
        invoices: []
    });

    const [errors, setErrors] = useState({
        id: "",
        date: "",
        type: "",
        amount: "",
        vehicule: "",
        invoices: []
    });

    const [vehicules, setVehicules] = useState([]);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fileInput, setFileInput] = useState(React.createRef());
    const [files, setFiles] = useState([]);
    const [invoices, setInvoices] = useState([]);

    //Gestion du format de la date avec moment
    //const formatDate = str => moment(str).format('YYYY/MM/DD');

    // Récupération des véhicules
    const fetchVehicules = async () => {
        try {
            const data = await VehiculesAPI.findAll();
            setVehicules(data);
            if (!maintenance.vehicule) setMaintenance({...maintenance, vehicule: data[0].id});
        } catch (error) {
            toast.error("Une erreur est survenue !");
            history.replace("/maintenances");
        }
    };


    //Gestion du format de la date avec moment
    const formatDate = str => moment(str).format('YYYY-MM-DD');

    // Récupération d'une maintenance
    const fetchMaintenance = async id => {
        try {
            const data = await MaintenancesAPI.find(id);
            setMaintenance({
                id: data['@id'],
                date: formatDate(data.date),
                type: data.type,
                amount: data.amount,
                vehicule: data.vehicule.id
            });
            setLoading(false);
        } catch (error) {
            toast.error("Une erreur est survenue !");
            history.replace("/maintenances");
        }
    };

    const fetchInvoices = async (idMaintenance) => {
        try {
            const data = await InvoicesAPI.findAll(idMaintenance);
            setInvoices(data);
        } catch (error) {
            toast.error("Une erreur est survenue !");
            history.replace("/maintenances");
        }
    }

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
            fetchInvoices(id);
        }
    }, [id]);

    // Gestion des changements des inputs dans le formulaire
    const handleChange = ({currentTarget}) => {
        const {name, value} = currentTarget;
        setMaintenance({...maintenance, [name]: value});
    };

    // Gestion de la soumission du formulaire
    const handleSubmit = async event => {
        event.preventDefault();

        try {
            setErrors({});
            if (editing) {
                await MaintenancesAPI.update(id, maintenance);
                files.map(async file => {
                    await InvoicesAPI.create({maintenance: maintenance.id, file: file["@id"]})
                })
                toast.success("La maintenance a bien été modifié !");
                history.replace("/maintenances");
            } else {
                let result = await MaintenancesAPI.create(maintenance);
                files.map(async file => {
                    await InvoicesAPI.create({maintenance: result.data["@id"], file: file["@id"]})
                })
                toast.success("La maintenance a bien été créé !");
                history.replace("/maintenances");
            }
        } catch ({response}) {
            const {violations} = response.data;

            if (violations) {
                const apiErrors = {};
                violations.forEach(({propertyPath, message}) => {
                    apiErrors[propertyPath] = message;
                });
                setErrors(apiErrors);
                toast.error("Une erreur est survenue !");
            }
        }
    };

    const handleClickAddFile = async () => {
        if (fileInput.current.files[0]) {
            try {
                await FileAPI.create(fileInput.current.files[0]).then(response => {
                    setFiles([...files, response.data])
                });
                toast.success("Fichier ajouter !");
            } catch ({response}) {
                toast.error("Une erreur est survenue !");
            }
        } else {
            toast.error("Aucun fichier");
        }
    };

    const handleInvoiceDelete = async id => {
        //delete invoice in api
        const originalInvoices = [...invoices];
        setInvoices(invoices.filter(invoice => invoice['@id'] !== id));

        try {
            await InvoicesAPI.delete(id);
            toast.success("Le ficher a été supprimé !");
        } catch (error) {
            toast.error("Une erreur est survenue !");
            setVehicules(originalInvoices);
        }
    }

    const handleFileDelete = async id => {
        //delete file in js
        const originalFiles = [...files];
        setFiles(files.filter(file => file['@id'] !== id));

        try {
            await FileAPI.delete(id);
            toast.success("Le ficher a été supprimé !");
        } catch (error) {
            toast.error("Une erreur est survenue !");
            setFiles(originalFiles);
        }
    }

    return (
        <>
            {(!editing &&
                <h1>Création d'une maintenance!</h1>
            ) || (
                <h1>Modification de la maintenance!</h1>
            )}

            {loading && <FormContentLoader/>}
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
                <div>
                    <input name="file_invoice" type="file" ref={fileInput}/>
                    <button type="button" className="btn btn-warning" onClick={handleClickAddFile}>
                        Ajouter
                    </button>
                    <p>Nombre de fichier {files.length + invoices.length}</p>
                    {files.map(file =>
                        <div key={file['@id']}>
                            <img src={file.contentUrl} alt={file['@id']}/>
                            <button type="button" className="btn btn-link"
                                    onClick={() => handleFileDelete(file['@id'])}>Supprimer
                            </button>
                        </div>
                    )}
                    {invoices.map(invoice =>
                        <div key={invoice['@id']}>
                            <img src={"/media/" + invoice.filePath} alt={invoice['@id']}/>
                            <button type="button" className="btn btn-link"
                                    onClick={() => handleInvoiceDelete(invoice['@id'])}>Supprimer
                            </button>
                        </div>
                    )}
                </div>
                <div className="form-group">
                    <button type="submit" className="btn btn-success">
                        Enregistrer
                    </button>
                    <Link to="/maintenances" className="btn btn-link">
                        Retour à la liste
                    </Link>
                </div>
            </form>}
        </>
    );
};

export default MaintenancePage;