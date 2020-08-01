import axios from 'axios';


function findAll() {
    return axios
        .get("http://localhost:8000/api/maintenances")
        .then(response => response.data['hydra:member'])
}

function find(id) {
    return axios
        .get("http://localhost:8000/api/maintenances/" + id)
        .then(response => response.data);
}

function create(maintenance) {
    return axios
        .post("http://localhost:8000/api/maintenances",
        { ...maintenance, vehicule: `/api/vehicules/${maintenance.vehicule}` }
    );
}

function update(id, maintenance) {
    return axios
        .put("http://localhost:8000/api/maintenances/" + id,
        { ...maintenance, vehicule: `/api/vehicules/${maintenance.vehicule}` }
    );
}

function deleteMaintenance(id) {
    return axios
        .delete("http://localhost:8000/api/maintenances/" + id)
}

export default {
    findAll,
    find,
    create,
    update,
    delete: deleteMaintenance
};
