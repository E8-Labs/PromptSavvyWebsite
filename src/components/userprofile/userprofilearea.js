import React, {useRef } from 'react';
import { Link } from 'react-router-dom';
const UserProfileArea = (props) => {
    const fileInputRef = useRef(null);

    function followers_request(event){
        props.followers_request();
        event.preventDefault();
    }
    function unfollowers_request(event){
        props.unfollowers_request();
        props.FollowStatus(false)
        event.preventDefault();
    }
    function ShowCommunity(event){
        props.ShowCommunity();
        event.preventDefault();
    }
    function handleFileChangeOpen(event){
        fileInputRef.current.click();
    }
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        console.log(file);
    };
    
    return (
        <>
            <section className="user-profile-area">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="user-profile-banner">
                                {props.UserID == localStorage.getItem('mongodb_userid')?
                                    <>
                                        <button onClick={handleFileChangeOpen} className="edit_banner" htmlFor="edit_banner">
                                            <img src="../assets/img/Edit.svg" alt="" />
                                        </button>
                                        <input ref={fileInputRef} onChange={handleFileChange} id="edit_banner" className="file-upload" type="file" accept="image/*" />
                                    </>
                                : '' }
                                <div className="row align-items-center">
                                    <div className="col-lg-6 col-md-6">
                                        <div className="user_pro">
                                            <Link to="#">
                                                {props.UserImage?
                                                    <img src={props.UserImage} alt="" />
                                                :
                                                    <img src="../assets/img/profile-pic.png" alt="" />
                                                }
                                                @{props.UserName}</Link>
                                            <div className="subscribe_btn">
                                                <div className="unfollow_btn">
                                                {props.UserID != localStorage.getItem('mongodb_userid')?
                                                    (props.FollowStatus?
                                                        <Link to="#" onClick={unfollowers_request.bind(this)} >Unfollow</Link>
                                                        :
                                                        <Link to="#" onClick={followers_request.bind(this)} >Follow</Link>
                                                    )
                                                    :
                                                    ''
                                                }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6">
                                        <div className="user_info_wrap">
                                            <div className="unfollow_btn">
                                            </div>
                                            <p style={{cursor:'pointer'}} onClick={ShowCommunity.bind(this)} >{props.FollowersLength} Followers</p>
                                            
                                                <ul>
                                                    {props.SocialLinks.Instagram?
                                                        <li><Link target="_blank" to={props.SocialLinks.Instagram}><img src="../assets/img/instagram.png" alt="" /></Link></li>
                                                        :
                                                        ''
                                                    }
                                                    {props.SocialLinks.Youtube?
                                                        <li><Link target="_blank" to={props.SocialLinks.Youtube}><img src="../assets/img/youtube.png" alt="" /></Link></li>
                                                        :
                                                        ''
                                                    }
                                                    {props.SocialLinks.Website?
                                                        <li><Link target="_blank" to={props.SocialLinks.Website}><img src="../assets/img/globe.png" alt="" /></Link></li>
                                                        :
                                                        ''
                                                    }
                                                </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default UserProfileArea;
