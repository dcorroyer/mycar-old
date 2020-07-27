import axios from 'axios';


function findAll() {
    return axios
        .get("http://localhost:8000/api/vehicules")
        .then(response => response.data['hydra:member']);
}

function find(id) {
    return axios
        .get("http://localhost:8000/api/vehicules/" + id)
        .then(response => response.data);
}

function create(vehicule) {
    return axios
        .post("http://localhost:8000/api/vehicules", vehicule);
}

function update(id, vehicule) {
    return axios
        .put("http://localhost:8000/api/vehicules/" + id, vehicule);
}

function deleteVehicule(id) {
    return axios
        .delete("http://localhost:8000/api/vehicules/" + id);
}

export default {
    findAll,
    find,
    create,
    update,
    delete: deleteVehicule
};
