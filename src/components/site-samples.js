import mediaListsPage from '../images/sample-photos/media-lists_iphone12black_portrait.png';
import mediaActions from '../images/sample-photos/media-actions_iphone12black_portrait.png';
import mediaInfo from '../images/sample-photos/media-more-info_iphone12black_portrait.png';
import mediaStatusNotes from '../images/sample-photos/media-status-notes_iphone12black_portrait.png';
import search from '../images/sample-photos/search_iphone12black_portrait.png';

import { useState } from 'react';
import { GrPrevious, GrNext } from "react-icons/gr";

import style from '../stylesheets/components/site-sample.module.scss';
// import { Link } from "react-router-dom";
import { ComponentPageTransition } from "./common";


export default function SiteSample (props) {
    const [currentCount, setCurrentCount] = useState(1);
    const handleNext = () => {
        if (currentCount > 4) {
            setCurrentCount(1);
        } else {
            setCurrentCount(currentCount + 1);
        }
    };
    const handlePrevious = () => {
        if (currentCount < 2) {
            setCurrentCount(5);
        } else {
            setCurrentCount(currentCount - 1);
        }
    }
    const samples = [
        {
            image: mediaListsPage,
            count: 1,
            description: [
                "Create custom lists with unique names and descriptions",
                "Add movies/shows to your lists from after searching",
                "Adjust the list and item sort preferences to your liking",
                "Add as many lists as you want"
            ]
        },
        {
            image: mediaActions,
            count: 2,
            description: ["Perform actions on each item with smooth animations"]
        },
        {
            image: mediaStatusNotes,
            count: 3,
            description: [
                "Add watch notes to see later",
                "If you've watched it, add review notes and rate the item",
                "See all this later in the 'More Info' section of each item"
                ]
        },
        {
            image: mediaInfo,
            count: 4,
            description: [
            "View more information on each item that isn't available in the quick glance view",
            "See your saved watch notes. (Your review section shows up if you've marked the item as watched)"
            ]
        },
        {
            image: search,
            count: 5,
            description: ["Search for movies and shows and add them to your unique lists"]
        }
    ]
    return (
        <div className={style.siteSample}>
            <div className={style.sampleContainer}>
                <div className={style.buttonContainer}>
                    <button
                        onClick={handlePrevious}
                        className={style.switchButton}
                    >
                        <GrPrevious/>
                    </button>
                </div>
                    {
                        samples.map(sample => (

                            <ComponentPageTransition
                                key={sample.count}
                                isCurrentPage={currentCount === sample.count}
                                className={style.imageAndDescContainer}
                            >
                                <div className={style.descContainer}>
                                    <p className={style.count}>{sample.count}/5</p>
                                    <div className={style.description}>
                                        <ul>
                                        {sample.description.map(
                                            (line, index)=><li key={index}><span>{line}</span></li>
                                        )}
                                        </ul>
                                    </div>
                                </div>
                                <div className={style.imageContainer}>
                                    <img
                                        src={sample.image}
                                        alt="Phone screenshot"
                                        className={style.image}
                                    />
                                </div>
                            </ComponentPageTransition>
                        ))
                    }
                <div className={style.buttonContainer}>
                    <button
                        onClick={handleNext}
                        className={style.switchButton}
                    >
                        <GrNext/>
                    </button>
                </div>
            </div>
            {/*<p className={style.signupOrLogin}>*/}
            {/*    <Link to="/signup">Sign up</Link>*/}
            {/*    <span className={style.noUserMessage}>*/}
            {/*    to start managing your media lists*/}
            {/*</span>*/}
            {/*</p>*/}
            {/*<p className={style.signupOrLogin}>OR</p>*/}
            {/*<p className={style.signupOrLogin}>*/}
            {/*    <Link to="/login">Login</Link>*/}
            {/*    <span className={style.noUserMessage}>*/}
            {/*    if you already have an existing account*/}
            {/*</span>*/}
            {/*</p>*/}
        </div>
    )
}