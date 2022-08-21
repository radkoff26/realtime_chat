import React from 'react';
import WarningButton from "../components/design/WarningButton";
import Title from "../components/design/Title";
import ButtonLink from "../components/design/ButtonLink";
import '../scss/pages/main.scss'

const MainPage = () => {
    return (
        <div className='main_page'>
            <div className="main_page__logout">
                <WarningButton text={'Logout'} clickCallback={() => ({})}/>
            </div>
            <Title text={'Hi, User! Isn’t it time to chat?'}/>
            <div className="main_page__links">
                <ButtonLink text={'Join Chat'} to={'#'}/>
                <ButtonLink text={'Create Chat'} to={'#'}/>
                <ButtonLink text={'Recent Chats'} to={'#'}/>
            </div>
        </div>
    );
};

export default MainPage;
