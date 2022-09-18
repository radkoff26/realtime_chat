import React, {useEffect} from 'react';
import './App.css';
import './scss/default.scss';
import {store} from "./store";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import MainPage from "./pages/MainPage";
import AuthPage from "./pages/AuthPage";
import {Provider} from "react-redux";
import CreateChatPage from "./pages/CreateChatPage";
import {TYPES} from "./store/actions/userActions";
import MyChatsPage from "./pages/MyChatsPage";
import ChatPage from "./pages/ChatPage";

const appStore = store()

const App = () => {
    const state = appStore.getState().userReducer

    useEffect(() => {
        if (!state.isLoggedIn && !window.location.href.includes('/auth')) {
            window.location.href = '/auth'
        }
    }, [state.isLoggedIn])

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
                    <Route element={<MyChatsPage />} path={'/myChats'}/>
                    <Route element={<ChatPage />} path={'/chat/:slug'}/>
                </Routes>
            </Router>
        </Provider>
    );
}

export default App;
