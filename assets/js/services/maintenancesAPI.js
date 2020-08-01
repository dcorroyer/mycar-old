import axios from 'axios';
import Cache from './cache';
import { MAINTENANCES_API } from '../config';


async function findAll() {
    const cachedMaintenances = await Cache.get("maintenances");

    if (cachedMaintenances) return cachedMaintenances;

    return axios
        .get(MAINTENANCES_API)
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
        .get(MAINTENANCES_API + "/" + id)
        .then(response => {
            const maintenance = response.data;
            Cache.set("maintenances." + id, maintenance);
            return maintenance;
        });
}

function create(maintenance) {
    return axios
        .post(MAINTENANCES_API,
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
        .put(MAINTENANCES_API + "/" + id,
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
        .delete(MAINTENANCES_API + "/" + id)
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
