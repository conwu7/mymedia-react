import React, { useEffect, useState } from "react";
import {GrClose} from 'react-icons/gr';
import {FcCollapse, FcExpand} from 'react-icons/fc';

import collapsibleCardStyle from '../stylesheets/components/collapsible-card.module.scss';
import centeredSearchBarStyle from '../stylesheets/components/centered-search-bar.module.scss';

export function CloseActivityButton (props) {
    return <button onClick={props.handleFormChange}><GrClose /></button>
}
export function CollapsibleCard (props) {
    const {cardHeader, skipStyleHeader, buttonSize} = props;
    const [isCollapsed, setCollapsedStatus] = useState(props.isCollapsed);
    const handleChange = () => {
        setCollapsedStatus(!isCollapsed);
    }
    return (
        <div className={collapsibleCardStyle.collapsibleCard}>
            <div className={collapsibleCardStyle.cardHeader +
                " "+ (!skipStyleHeader?collapsibleCardStyle.useStyleHeader:"")}
            >
                {cardHeader}
                <button onClick={handleChange} className={collapsibleCardStyle[buttonSize]}>
                    {isCollapsed? 
                        <FcExpand className={collapsibleCardStyle.icon}/> :
                        <FcCollapse className={collapsibleCardStyle.icon}/>
                    }
                </button>
            </div>
            <div 
                className={`${collapsibleCardStyle.collapsibleSection} ${isCollapsed ? collapsibleCardStyle.isCollapsed: collapsibleCardStyle.isExpanded}`}
                >
                    {props.children}
            </div>
        </div>
    )
}
export function CenteredSearchBar (props) {
    const {onChange, handleClick, value,
         inputName, showSearchButton, fullWidth,
         placeholder, disabled, onSubmit} = props; //***modify - introduce real input functionality to this
    const inputRef = React.createRef();
    useEffect(() => {
        inputRef.current.focus();
    }, [inputRef])
    return (
        <div className={centeredSearchBarStyle.container}>
            <form onSubmit={onSubmit}>
                <input 
                    onClick={handleClick}
                    onChange={onChange}
                    value={value}
                    type="text"
                    name={inputName}
                    id={inputName}
                    placeholder={placeholder}
                    disabled={disabled}
                    ref={inputRef}
                    className={fullWidth?centeredSearchBarStyle.fullWidth:""}
                />
                {showSearchButton?(<button onClick={onSubmit}>Search</button>):null}
            </form>
        </div>
    )
}