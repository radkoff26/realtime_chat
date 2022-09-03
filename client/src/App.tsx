import React, {useEffect} from 'react';
import './App.css';
import './scss/default.scss';
import {store} from "./store";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import MainPage from "./pages/MainPage";
import AuthPage from "./pages/AuthPage";
import {Provider} from "react-redux";
import isUserAuthorized from "./modules/IsUserAuthorized";
import CreateChatPage from "./pages/CreateChatPage";
import {TYPES} from "./store/actions/userActions";

const appStore = store()

const App = () => {
    const onPopState = () => {
        appStore.dispatch({type: TYPES.REFRESH_COOKIES})
    }

    useEffect(() => {
        window.addEventListener('popstate', onPopState)

        return () => window.removeEventListener('popstate', onPopState)
    }, [document.cookie])

    return (
        <Provider store={appStore}>
            <Router>
                <Routes>
                    <Route element={<MainPage />} path={'/'}/>
                    <Route element={<AuthPage />} path={'/auth'}/>
                    <Route element={<CreateChatPage />} path={'/createChat'}/>
                </Routes>
            </Router>
        </Provider>
    );
}

export default App;
