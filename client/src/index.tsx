import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import MainPage from "./pages/MainPage";
import {store} from './store'
import {Provider} from "react-redux";
import AuthPage from "./pages/AuthPage";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
    <Provider store={store()}>
        <Router>
            <Routes>
                <Route element={<App />} path={'/test'}/>
                <Route element={<MainPage />} path={'/'}/>
                <Route element={<AuthPage />} path={'/auth'}/>
            </Routes>
        </Router>
    </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
