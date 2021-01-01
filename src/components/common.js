import React, { useEffect, useState } from "react";
import { useSpring, animated, useTransition } from "react-spring";
import { useMeasure } from "react-use";

import { GrClose } from 'react-icons/gr';
import { MdExpandLess } from 'react-icons/md';

import collapsibleCardStyle from '../stylesheets/components/collapsible-card.module.scss';
import centeredSearchBarStyle from '../stylesheets/components/centered-search-bar.module.scss';
import popUpActivityStyle from '../stylesheets/components/pop-up-activity.module.scss';

export function CloseActivityButton (props) {
    const {handleActivityClose, className} = props;
    return <button 
                onClick={handleActivityClose}
                className={className}
                >
                    <GrClose />
                    </button>
}
export function PopUpActivity (props) {
    const {closeButton: cButton, children, useActivity, handleActivityClose} = props;
    const transitions = useTransition(
        useActivity, null, {
            from: {opacity: 0, marginTop: 600},
            enter: {opacity: 1, marginTop: 0},
            leave: {opacity: 0, marginTop: 600, zIndex: 1}
        }
    )
    let closeButton;
    if (!cButton) {
        closeButton=<CloseActivityButton
                        handleActivityClose={handleActivityClose}
                    />
    } else {
        closeButton = cButton;
    }
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
    let {cardHeader, skipStyleHeader, buttonSize,
        hideButton, collapseButton, skipAllStyling,
        hideOnFocusLost, disableHeaderButton} = props;
    const [ref, {height}] = useMeasure();
    const cardRef = React.createRef();
    const cardHeaderRef = React.createRef();
    const [isCollapsed, setCollapsedStatus] = useState(props.isCollapsed);
    const spring = useSpring({
        to: {
            height: isCollapsed? 0: height+10
            // Adding 10 here cause it seems to undercut the height a little
        }
    })
    const handleCollapse = () => {
        setCollapsedStatus(!isCollapsed);
    }
    useEffect(() => {
        const handleEventListeners = (e) => {
            const el = cardRef.current;
            const btn = cardHeaderRef.current;
            if ((!el.contains(e.target) && !el.isSameNode(e.target))
                 && (btn && !btn.contains(e.target) && !btn.isSameNode(e.target))) {
                    setCollapsedStatus(true);
                }
        }
        if (!hideOnFocusLost) return
        const App = document.getElementById('App');
        App.addEventListener('click', handleEventListeners)
        return () => {
            App.removeEventListener('click', handleEventListeners)
        }
    }, [hideOnFocusLost, cardHeaderRef, cardRef])
    return (
        <div className={collapsibleCardStyle.collapsibleCard}>
            <div 
                ref={cardHeaderRef}
                className={
                    collapsibleCardStyle.cardHeader +
                    " "+ (!skipStyleHeader?collapsibleCardStyle.useStyleHeader:"")
                }
                onClick={!disableHeaderButton?handleCollapse:undefined}
            >
                {cardHeader}
                {!hideButton &&
                    (skipAllStyling?
                    <button
                        type="button"
                        onClick={handleCollapse} 
                    >
                        {collapseButton?
                            collapseButton
                            :<MdExpandLess />
                        }
                    </button>
                    :
                    <button
                        type="button"
                        onClick={handleCollapse} 
                        className={`${collapsibleCardStyle[buttonSize]} ${isCollapsed?collapsibleCardStyle.btnExpand:""}`}>
                        {collapseButton?
                            collapseButton
                            :<MdExpandLess />
                        }
                    </button>)
                }
            </div>
            <animated.div 
                style={spring}
                ref={cardRef}
                className={collapsibleCardStyle.collapsibleSection}
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
         placeholder, disabled, onSubmit} = props;
    const inputRef = React.createRef();
    useEffect(() => {
        inputRef.current.focus();
    }, [inputRef])
    return (
        <div className={centeredSearchBarStyle.container}>
            <form
                onSubmit={onSubmit}
                className={showSearchButton?centeredSearchBarStyle.useSearchButton:""}>
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
                {showSearchButton?(
                    <button
                        type="submit"
                        tabIndex={0}
                        disabled={disabled}
                    >
                    Search
                    </button>)
                    :null}
            </form>
        </div>
    )
}