import axios from 'axios';
import JwtDecode from 'jwt-decode';


/**
 * Déconnexion (suppression du token du localStorage et sur Axios)
 */
function logout() {
    window.localStorage.removeItem("authToken");
    delete axios.defaults.headers["Authorization"];
}

/**
 * Positionne le token JWT sur Axios
 * @param {string} token Le token JWT
 */
function setAxiosToken(token) {
    axios.defaults.headers["Authorization"] = "Bearer " + token;
}

/**
 * Requête HTTP d'authentification et stockage du token dans le storage et sur Axios
 * @param {object} credentials 
 */
function authenticate(credentials) {
    return axios
        .post("http://localhost:8000/api/login_check", credentials)
        .then(response => response.data.token)
        .then(token => {
            //Stockage du token dans le localStorage
            window.localStorage.setItem("authToken", token);
            //Prévenir Axios qu'on a maintenant un header par défaut sur toutes nos futures requêtes HTTP
            setAxiosToken(token);
        });
}

/**
 * Mise en place lors du chargement de l'application
 */
function setup() {
    //Un token est-il présent ?
    const token = window.localStorage.getItem("authToken");
    //Si oui et qu'il est valide
    if (token) {
        const {exp: expiration} = JwtDecode(token);
        if (expiration * 1000 > new Date().getTime()) {
            setAxiosToken(token);
        }
    }
}

/**
 * Permet de savoir si on est authentifié ou pas
 * @returns boolean
 */
function isAuthenticated() {
    //Un token est-il présent ?
    const token = window.localStorage.getItem("authToken");
    //Si oui et qu'il est valide
    if (token) {
        const {exp: expiration} = JwtDecode(token);
        if (expiration * 1000 > new Date().getTime()) {
            return true;
        }
        return false;
    }
    return false;
}

export default {
    authenticate,
    logout,
    setup,
    isAuthenticated
};