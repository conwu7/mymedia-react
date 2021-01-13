import React, { useEffect, useState } from "react";
import { useSpring, animated, useTransition } from "react-spring";
import { useMeasure } from "react-use";

import { GrClose } from 'react-icons/gr';
import { MdExpandLess } from 'react-icons/md';

import collapsibleCardStyle from '../stylesheets/components/collapsible-card.module.scss';
import centeredSearchBarStyle from '../stylesheets/components/centered-search-bar.module.scss';
import popUpActivityStyle from '../stylesheets/components/pop-up-activity.module.scss';
import submitButtonStyle from '../stylesheets/components/submit-button.module.scss';
import streamingStyle from '../stylesheets/components/streaming.module.scss';

// returns a button that closes an activity. styled by the parent.
export function CloseActivityButton (props) {
    const {handleActivityClose, className} = props;
    return <button 
                onClick={handleActivityClose}
                className={className}
                >
                    <GrClose />
                    </button>
}
    /** Component that shows the children passed in a pop up window
    *   useActivity:  bool value to have the window open or closed
    *   optional : close button
    */
export function PopUpActivity (props) {
    const {closeButton: cButton, children, useActivity, handleActivityClose} = props;
    const transitions = useTransition(
        useActivity, null, {
            from: {transform: 'translate(0, 100%)'},
            enter: {transform: 'translate(0, 0)', opacity: 1},
            leave: {transform: 'translate(0, -100%)', opacity: 0}
        }
        // useActivity, null, {
        //     from: {opacity: 0, marginTop: 600},
        //     enter: {opacity: 1, marginTop: 0},
        //     leave: {opacity: 0, marginTop: 600, zIndex: 1}
        // }
    )
    let closeButton;
    if (!cButton) {
        closeButton=<CloseActivityButton
                        className={popUpActivityStyle.closeButton}
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
                className={`${popUpActivityStyle.popUpContainer} 
                            ${!useActivity?popUpActivityStyle.fadeAway:''}`}
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
/*
    Component that shows the children passed in a collapsible card
    cardHeader : the non collapsible section
    optional :
         collapse button
         skipStyleHeader - don't style the header / divs
         skipAllStyling,
         buttonSize - largeBtn or undefined (default)
         disableHeaderButton - cardHeader won't be a button. Must use collapse button to collapse.
         hideOnFocusLost - collapse if clicked outside this card
*/
export function CollapsibleCard (props) {
    let {cardHeader, skipStyleHeader, buttonSize,
        hideButton, collapseButton, skipAllStyling,
        hideOnFocusLost, disableHeaderButton} = props;
    // calculate collapsible section height. use for spring animation
    const [ref, {height}] = useMeasure();
    // ref for collapsible section
    const cardRef = React.createRef();
    // ref for card header - used to ignore click when using hideOnFocusLost
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
    // Add event listeners to App if using hide on focus lost
    useEffect(() => {
        if (!hideOnFocusLost) return
        function handleEventListeners (e) {
            const el = cardRef.current;
            const btn = cardHeaderRef.current;
            if ((!el.contains(e.target) && !el.isSameNode(e.target))
                 && (btn && !btn.contains(e.target) && !btn.isSameNode(e.target))) {
                    setCollapsedStatus(true);
                }
        }
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
                        className={collapsibleCardStyle.collapseButton}
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
                        className={
                            `${collapsibleCardStyle.collapseButton} 
                            ${collapsibleCardStyle[buttonSize]} 
                            ${isCollapsed?collapsibleCardStyle.btnExpand:""}`
                        }
                    >
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
                <div
                    className="collapsibleSectionChildren"
                    ref={ref}>{props.children}
                </div>
            </animated.div>
        </div>
    )
}
// return a style input bar component
// parent provides event handlers, input properties.
export function CenteredSearchBar (props) {
    const {onChange, handleClick, value,
         inputName, showSearchButton, fullWidth,
         placeholder, disabled, onSubmit} = props;
    const inputRef = React.createRef();
    // move focus to input on render
    useEffect(() => {
        inputRef.current.focus();
    }, [inputRef])
    return (
        <div>
            <form
                onSubmit={onSubmit}
                className={`${showSearchButton?centeredSearchBarStyle.useSearchButton:""} ${centeredSearchBarStyle.form}`}>
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
                    className={`${fullWidth?centeredSearchBarStyle.fullWidth:""} ${centeredSearchBarStyle.input}`}
                />
                {showSearchButton?(
                    <button
                        className={centeredSearchBarStyle.searchButton}
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
// styled submit button
export function CommonStyledButton (props) {
    const {type, onClick, text, disabled} = props;
    return (
        <button
            onClick={onClick}
            className={submitButtonStyle.submitButton}
            type={type || "submit"}
            disabled={disabled}
        >
            {text || "Submit"}
        </button>
    )
}
// fieldset for streamingSource
export function StreamingSourceFieldset (props) {
    const {formik} = props;
    return (
        <fieldset className={streamingStyle.streamingSource}>
            <label
                htmlFor="streamingSource"
                // className={}
            >
                Streaming Source
            </label>
            <select
                name="streamingSource"
                id="streamingSource"
                onChange={formik.handleChange}
                value={formik.values.streamingSource}
            >
                <option value="selectOne" disabled={true}>Choose One</option>
                <option value="NETFLIX">Netflix</option>
                <option value="HBO MAX">HBO</option>
                <option value="AMAZON">Amazon</option>
                <option value="DISNEY+">Disney+</option>
                <option value="APPLE TV+">Apple Tv+</option>
                <option value="HULU">Hulu</option>
                <option value="PEACOCK">Peacock</option>
                <option value="CBS">CBS</option>
                <option value="SHOWTIME">Showtime</option>
                <option value="STARZ">STARZ</option>
                <option value="BUY/RENT">Buy/Rent</option>
                <option value="Plex">Plex</option>
                <option value="OTHER">Other</option>
                <option value="NO IDEA">No Idea</option>
                <option value="NONE">None</option>
            </select>
        </fieldset>
    )
}