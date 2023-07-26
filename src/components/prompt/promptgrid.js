import React, { useState  } from 'react';
import { adding_favourite_prompt,deleting_favourite_prompt } from '../../service/Apis/api';
import moment from 'moment-timezone';
import { Link } from 'react-router-dom';

moment.tz.setDefault('Etc/UTC');
const PromptGrid = (props) => {
    const [SavePrompts, setSavePrompts] = useState(props.PublicPrompt.isFavourite);
    
    async function SavePromptsRequest(event) {
        try {
            setSavePrompts(true);
            const res = await adding_favourite_prompt(localStorage.getItem('mongodb_userid'),props.PublicPrompt._id);
            event.preventDefault();
        } catch (error) {
            props.handleExceptionError(error);
            return null;
        }
    }
    async function UnsavePromptsRequest(event) {
        try{
            setSavePrompts(false);
            const res = await deleting_favourite_prompt(localStorage.getItem('mongodb_userid'),props.PublicPrompt._id);
            event.preventDefault();
        } catch (error) {
            props.handleExceptionError(error);
            return null;
        }
    }

    const convertToShortForm = (num) => {
        if (num >= 1000) {
            const quotient = Math.floor(num / 1000);
            return quotient + 'k';
        }else{
            return parseInt(num);
        }
    };
    return (
        <>
            <div className="col-xxl-3 col-xl-4 col-lg-4 col-md-6">
                <div className="prompt-card">
                    <div className="prompt-top">
                        <div className="prompt-user">
                            {props.PublicPrompt.user._id != localStorage.getItem('mongodb_userid')?
                                <Link to={`/${props.PublicPrompt.user._id}`}>
                                    {props.UserImage?
                                        <img src={props.UserImage} alt="" />
                                    :
                                        <img src="../assets/img/profile-pic.png" alt="" />
                                    }

                                        <div className="prompt-user-text">
                                            <h4>@{props.PublicPrompt.user.username}</h4>
                                            <p>{moment(props.PublicPrompt.createdAt, "YYYYMMDD, HH:mm:ss").fromNow(true)} ago.</p>
                                        </div>
                                </Link>
                                :
                                    <Link to="#">
                                        {props.UserImage?
                                            <img src={props.UserImage} alt="" />
                                        :
                                            <img src="../assets/img/profile-pic.png" alt="" />
                                        }

                                            <div className="prompt-user-text">
                                                <h4>@{props.PublicPrompt.user.username}</h4>
                                                <p>{moment(props.PublicPrompt.createdAt, "YYYYMMDD, HH:mm:ss").fromNow(true)} ago.</p>
                                            </div>
                                    </Link>
                            }
                        </div>
                        <div className="card-top-right">
                            <div className="save_toggle">
                                {props.PublicPrompt.user._id != localStorage.getItem('mongodb_userid')?
                                    (SavePrompts? 
                                        <button className="saved_prompt save_btn" onClick={UnsavePromptsRequest.bind(this)}>
                                            <img src="../assets/img/Bookmark.svg" alt="" />
                                        </button>
                                    :
                                        <button className="save_btn" onClick={SavePromptsRequest.bind(this)}>
                                            <img src="../assets/img/Bookmark.svg" alt="" />
                                        </button>
                                    )
                                :
                                    ''
                                }
                            </div>
                        </div>
                    </div>
                    <div className="prompt-content">
                        <h3>{props.PublicPrompt.title}</h3>
                        <div className="prompt--description">
                            <p>{props.PublicPrompt.template.substr(0, 220)}</p>
                        </div>
                    </div>
                    <div className="prompt-card-bottom">
                        <Link to="#"><img src="../assets/img/up-arrow.svg" alt="" />{convertToShortForm(props.PublicPrompt.likes)}</Link>
                        <Link to="#"><img src="../assets/img/eye.svg" alt="" />{convertToShortForm(props.PublicPrompt.views)}</Link>
                        <Link to="#"><img src="../assets/img/Message-green.svg" alt="" />{convertToShortForm(props.PublicPrompt.comments)}</Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PromptGrid;
