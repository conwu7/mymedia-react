import React, { useEffect, useState } from "react";
import { useSpring, animated, useTransition } from "react-spring";
import { useMeasure } from "react-use";

import {GrClose} from 'react-icons/gr';
import {FcCollapse, FcExpand} from 'react-icons/fc';

import collapsibleCardStyle from '../stylesheets/components/collapsible-card.module.scss';
import centeredSearchBarStyle from '../stylesheets/components/centered-search-bar.module.scss';
import popUpActivityStyle from '../stylesheets/components/pop-up-activity.module.scss';

export function CloseActivityButton (props) {
    return <button 
                onClick={props.handleActivityClose}
                className={props.className}
                >
                    <GrClose />
                    </button>
}
export function PopUpActivity (props) {
    const {closeButton, children, useActivity} = props;
    const transitions = useTransition(
        useActivity, null, {
            from: {opacity: 0},
            enter: {opacity: 1},
            leave: {opacity: 0}
        }
    )
    return ( transitions.map(({item, props: tProps, key}) => (
        item &&
            <animated.div 
                key={key}
                style={tProps}
                className={popUpActivityStyle.popUpContainer}
            >
                <div className={popUpActivityStyle.closeButtonContainer}>
                    {closeButton}
                </div>
                <div className={popUpActivityStyle.mainContentContainer}>
                    <div className={popUpActivityStyle.mainContent}>
                        {children}
                    </div>
                </div>
            </animated.div>
    )))
}
export function CollapsibleCard (props) {
    let {cardHeader, skipStyleHeader, buttonSize} = props;
    const [ref, {height}] = useMeasure();
    const [isCollapsed, setCollapsedStatus] = useState(props.isCollapsed);
    const spring = useSpring({
        to: {
            height: isCollapsed? 0: height
        }
    })
    const handleChange = () => {
        setCollapsedStatus(!isCollapsed);
    }
    return (
        <div className={collapsibleCardStyle.collapsibleCard}>
            <div className={collapsibleCardStyle.cardHeader +
                " "+ (!skipStyleHeader?collapsibleCardStyle.useStyleHeader:"")}
            >
                {cardHeader}
                <button onClick={handleChange} 
                className={`${collapsibleCardStyle[buttonSize]} ${isCollapsed?collapsibleCardStyle.btnExpand:""}`}>
                    {
                        <FcCollapse 
                            id="expandCollapseButton"
                        />
                    }
                </button>
            </div>
            <animated.div style={spring}
                className={`${collapsibleCardStyle.collapsibleSection}`}
            >
                <div ref={ref}>{props.children}</div>
            </animated.div>
            {/* <div 
                className={`${collapsibleCardStyle.collapsibleSection} ${isCollapsed ? collapsibleCardStyle.isCollapsed: collapsibleCardStyle.isExpanded}`}
                >
                    
            </div> */}
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
            <form onSubmit={onSubmit} className={showSearchButton?centeredSearchBarStyle.useSearchButton:""}>
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
                {showSearchButton?(<button type="submit">Search</button>):null}
            </form>
        </div>
    )
}