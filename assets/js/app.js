import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import MaintenancesPage from './pages/MaintenancesPage';
import VehiculesPage from './pages/VehiculesPage';


require("../css/app.css");

const App = () => {
    return (
        <HashRouter>
            <Navbar />
            <main className="container pt-5">
                <Switch>
                    <Route path='/maintenances' component={MaintenancesPage} />
                    <Route path='/vehicules' component={VehiculesPage} />
                    <Route path='/' component={HomePage} />
                </Switch>
            </main>
        </HashRouter>
    );
};

const rootElement = document.querySelector('#app');
ReactDOM.render(<App />, rootElement);