import style from '../stylesheets/components/wait-for-server.module.scss';
import { VscLoading } from 'react-icons/vsc';

export default function WaitForServer (props) {
    const {wait, waitText} = props;
    const waitingText = waitText || "Loading"
    if (!wait) return null
    return (
        <div className={style.waitContainer}>
            <div className={style.mainContent}>
                <div className={style.loadingContainer}>
                    <VscLoading/>
                </div>
                <p>{waitingText}</p>
            </div>
        </div>
    )
}