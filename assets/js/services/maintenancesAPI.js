import axios from 'axios';


function findAll() {
    return axios
        .get("http://localhost:8000/api/maintenances")
        .then(response => response.data['hydra:member'])
}

function deleteMaintenance(id) {
    return axios
        .delete("http://localhost:8000/api/maintenances/" + id)
}

export default {
    findAll,
    delete: deleteMaintenance
};
