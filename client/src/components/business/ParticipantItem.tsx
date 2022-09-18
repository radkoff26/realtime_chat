import React from 'react';
import {Participant} from "../../store/slices/chatSlice";
import styles from '../../scss/components/participant.module.scss'
import {useAppSelector} from "../../hooks/UseAppSelector";

interface ParticipantItemProps {
    participant: Participant
    acceptIfPendingAndAdmin?: () => void
}

const ParticipantItem = ({participant, acceptIfPendingAndAdmin}: ParticipantItemProps) => {
    return (
        <div className={[styles.participant, participant.isPending && acceptIfPendingAndAdmin ? styles.pending : styles.notPending].join(' ')}>
            <p>{participant.name}</p>
            {participant.isPending && acceptIfPendingAndAdmin ?
                <div onClick={() => acceptIfPendingAndAdmin()}>Accept</div> : <div/>}
        </div>
    );
};

export default ParticipantItem;