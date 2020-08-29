import axios from 'axios';
import Cache from './cache';
import {FILE_API} from '../config';


async function find(id) {
    return axios
        .get(FILE_API + "/" + id)
        .then(response => {
            return response.data;
        });
}

function create(file) {
    let formData = new FormData();
    formData.append("file", file);
    return axios
        .post(FILE_API, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(async response => {
            return response;
        });
}

function update(id, maintenance) {
    return axios
        .put(FILE_API + "/" + id,
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

function deleteFile(id) {
    return axios
        .delete(FILE_API + "/" + id)
        .then(async response => {
            return response;
        });
}

export default {
    find,
    create,
    update,
    delete: deleteFile
};
