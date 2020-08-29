import axios from 'axios';
import Cache from './cache';
import {INVOICES_API, MAINTENANCES_API} from '../config';


async function findAll(idMaintenance) {
    return axios
        .get(MAINTENANCES_API + "/" + idMaintenance + "/invoices")
        .then(response => {
            return response.data['hydra:member'];
        });
}

function create(invoice) {
    console.log(invoice);
    return axios
        .post(INVOICES_API,
            {...invoice})
        .then(async response => {
            return response;
        });
}

function deleteInvoice(id) {
    return axios
        .delete(id)
        .then(async response => {
            return response;
        });
}

export default {
    findAll,
    create,
    delete: deleteInvoice
};
