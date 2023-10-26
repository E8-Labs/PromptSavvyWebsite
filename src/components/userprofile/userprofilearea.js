import React, {useRef,useState } from 'react';
import { Link } from 'react-router-dom';
const UserProfileArea = (props) => {
    const fileInputRef = useRef(null);
    const [UserImageError, setUserImageError] = useState('');

    function followers_request(event){
        props.followers_request();
        event.preventDefault();
    }
    function unfollowers_request(event){

        props.unfollowers_request();
        // props.FollowStatus(false)
        event.preventDefault();
    }
    function ShowCommunity(event){
        props.ShowCommunity();
        event.preventDefault();
    }
    function handleFileChangeOpen(event){
        fileInputRef.current.click();
    }
    const handleFileChange = (event) => {
        setUserImageError('');
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            if (file && file.size <= 2 * 1024 * 1024) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const base64String = event.target.result;
                    props.ChangeBannerImage(base64String);
                };
                reader.readAsDataURL(file);
            }else{
                setUserImageError('Please select a file smaller than 2MB.');  
            }
        } else {
            setUserImageError('Please select an image file.');
        }
    };
    
    return (
        <>
            <section className="user-profile-area">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-12">
                            {/* <div className="user-profile-banner"  style={{ backgroundImage: `url(${props.BannerImage})` }}> */}
                            <div className="user-profile-banner"  style={{ background: `linear-gradient(180deg,rgba(0,0,0,0) 10.73%,rgba(0,0,0,.575644) 100%,rgba(0,0,0,.78) 78.78%) center/cover,url(${props.BannerImage}) center/cover` }}>
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
                                        {UserImageError?
                                            <p style={{color:'red',marginTop:'10px',fontSize:'11px',fontWeight:'400'}}>{UserImageError}</p>
                                            :
                                            <></>
                                        }
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
