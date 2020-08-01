import axios from 'axios';
import Cache from './cache';


async function findAll() {
    const cachedMaintenances = await Cache.get("maintenances");

    if (cachedMaintenances) return cachedMaintenances;

    return axios
        .get("http://localhost:8000/api/maintenances")
        .then(response => {
            const maintenances = response.data['hydra:member'];
            Cache.set("maintenances", maintenances);
            return maintenances;
        });
}

async function find(id) {
    const cachedMaintenance = await Cache.get("maintenances." + id);

    if (cachedMaintenance) return cachedMaintenance;

    return axios
        .get("http://localhost:8000/api/maintenances/" + id)
        .then(response => {
            const maintenance = response.data;
            Cache.set("maintenances." + id, maintenance);
            return maintenance;
        });
}

function create(maintenance) {
    return axios
        .post("http://localhost:8000/api/maintenances",
        { ...maintenance, vehicule: `/api/vehicules/${maintenance.vehicule}` })
        .then(async response => {
            const cachedMaintenances = await Cache.get("maintenances");
            if (cachedMaintenances) {
                Cache.set("maintenances", [...cachedMaintenances, response.data]);
            }
            return response;
        });
}

function update(id, maintenance) {
    return axios
        .put("http://localhost:8000/api/maintenances/" + id,
        { ...maintenance, vehicule: `/api/vehicules/${maintenance.vehicule}` })
        .then(async response => {
            const cachedMaintenances = await Cache.get("maintenances");
            const cachedMaintenance = await Cache.get("maintenances." + id);

            if (cachedMaintenance) {
                Cache.set("maintenances." + id, response.data);
            }

            if (cachedMaintenances) {
                const index = cachedMaintenances.findIndex(m => m.id === +id);
                cachedMaintenances[index] = response.data;
            }
            return response;
        });
}

function deleteMaintenance(id) {
    return axios
        .delete("http://localhost:8000/api/maintenances/" + id)
        .then(async response => {
            const cachedMaintenances = await Cache.get("maintenances");
            if (cachedMaintenances) {
                Cache.set("maintenances", cachedMaintenances.filter(m => m.id !== id));
            }
            return response;
        });
}

export default {
    findAll,
    find,
    create,
    update,
    delete: deleteMaintenance
};
