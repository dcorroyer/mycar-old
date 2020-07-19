import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch, withRouter } from 'react-router-dom';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import AuthContext from './contexts/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import MaintenancesPage from './pages/MaintenancesPage';
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
                        <PrivateRoute path='/maintenances' component={MaintenancesPage} />
                        <PrivateRoute path='/vehicules' component={VehiculesPage} />
                        <Route path='/' component={HomePage} />
                    </Switch>
                </main>
            </HashRouter>
        </AuthContext.Provider>
    );
};

const rootElement = document.querySelector('#app');
ReactDOM.render(<App />, rootElement);