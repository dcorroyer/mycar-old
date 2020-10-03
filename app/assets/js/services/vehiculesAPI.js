import axios from 'axios';
import Cache from './cache';
import { VEHICULES_API } from '../config';


async function findAll() {
    const cachedVehicules = await Cache.get("vehicules");

    if (cachedVehicules) return cachedVehicules;

    return axios
        .get(VEHICULES_API)
        .then(response => {
            const vehicules = response.data['hydra:member'];
            Cache.set("vehicules", vehicules);
            return vehicules;
    });
}

async function find(id) {
    const cachedVehicule = await Cache.get("vehicules." + id);

    if (cachedVehicule) return cachedVehicule;

    return axios
        .get(VEHICULES_API + "/" + id)
        .then(response => {
            const vehicule = response.data;
            Cache.set("vehicules." + id, vehicule);
            return vehicule;
        });
}

function create(vehicule) {
    return axios
        .post(VEHICULES_API, vehicule)
        .then(async response => {
            const cachedVehicules = await Cache.get("vehicules");
            if (cachedVehicules) {
                Cache.set("vehicules", [...cachedVehicules, response.data]);
            }
            return response;
        });
}

function update(id, vehicule) {
    return axios
        .put(VEHICULES_API + "/" + id, vehicule)
        .then(async response => {
            const cachedVehicules = await Cache.get("vehicules");
            const cachedVehicule = await Cache.get("vehicules." + id);

            if (cachedVehicule) {
                Cache.set("vehicules." + id, response.data);
            }

            if (cachedVehicules) {
                const index = cachedVehicules.findIndex(v => v.id === +id);
                cachedVehicules[index] = response.data;
            }
            return response;
        });
}

function deleteVehicule(id) {
    return axios
        .delete(VEHICULES_API + "/" + id)
        .then(async response => {
            const cachedVehicules = await Cache.get("vehicules");
            if (cachedVehicules) {
                Cache.set("vehicules", cachedVehicules.filter(v => v.id !== id));
            }
            return response;
        });
}

export default {
    findAll,
    find,
    create,
    update,
    delete: deleteVehicule
};
