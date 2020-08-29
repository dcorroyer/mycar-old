import axios from 'axios';
import Cache from './cache';
import {INVOICES_API} from '../config';


async function find(id) {

    return axios
        .get(INVOICES_API + "/" + id)
        .then(response => {
            return response.data;
        });
}

function create(invoice) {
    console.log(invoice);
    return axios
        .post(INVOICES_API,
        { ...invoice})
        .then(async response => {
            return response;
        });
}

function deleteInvoice(id) {
    return axios
        .delete(INVOICES_API + "/" + id)
        .then(async response => {
            return response;
        });
}

export default {
    find,
    create,
    delete: deleteInvoice
};
