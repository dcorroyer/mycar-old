import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch, withRouter } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import AuthContext from './contexts/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import MaintenancePage from './pages/MaintenancePage';
import MaintenancesPage from './pages/MaintenancesPage';
import RegisterPage from './pages/RegisterPage';
import VehiculePage from './pages/VehiculePage';
import VehiculesPage from './pages/VehiculesPage';
import AuthAPI from './services/authAPI';


require("../css/app.css");

AuthAPI.setup();

const App = () => {

    const [isAuthenticated, setIsAuthenticated] = useState(
        AuthAPI.isAuthenticated()
    );

    const NavbarWithRouter = withRouter(Navbar);

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            setIsAuthenticated
        }}>
            <HashRouter>
                <NavbarWithRouter />
                <main className="container pt-5">
                    <Switch>
                        <Route path='/login' component={LoginPage} />
                        <Route path='/register' component={RegisterPage} />
                        <PrivateRoute path='/maintenances/:id' component={MaintenancePage} />
                        <PrivateRoute path='/maintenances' component={MaintenancesPage} />
                        <PrivateRoute path='/vehicules/:id' component={VehiculePage} />
                        <PrivateRoute path='/vehicules' component={VehiculesPage} />
                        <Route path='/' component={HomePage} />
                    </Switch>
                </main>
            </HashRouter>
            <ToastContainer position={toast.POSITION.TOP_CENTER}/>
        </AuthContext.Provider>
    );
};

const rootElement = document.querySelector('#app');
ReactDOM.render(<App />, rootElement);