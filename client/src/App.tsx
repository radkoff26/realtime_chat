import React, {useEffect, useRef, useState} from 'react';
import './App.css';
import './scss/default.scss';
import DefaultButton from "./components/design/DefaultButton";
import WarningButton from "./components/design/WarningButton";
import CheckBox from "./components/design/CheckBox";
import Hint from "./components/design/Hint";

function App() {
    const [state, setState] = useState(false)

    useEffect(() => {
        console.log(state)
    }, [state])

    return (
        <>
            <DefaultButton text={'Button'} clickCallback={() => ({})} />
            <WarningButton text={'Button'} clickCallback={() => ({})} />
            <CheckBox label={'Checkbox: '} callback={() => setState(state => !state)} />
            <Hint text={'This is just a hint to help you!'} />
        </>
    );
}

export default App;
