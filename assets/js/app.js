import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Switch, Route } from 'react-router-dom'

import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import VehiculePage from './pages/VehiculesPage';

require("../css/app.css");

const App = () => {
    return (
        <HashRouter>
            <Navbar />
            <main className="container pt-5">
                <Switch>
                    <Route path='/vehicules' component={VehiculePage} />
                    <Route path='/' component={HomePage} />
                </Switch>
            </main>
        </HashRouter>
    );
};

const rootElement = document.querySelector('#app');
ReactDOM.render(<App />, rootElement);