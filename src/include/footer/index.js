import React from 'react';
const Footer = () => {
    return (        
        <>            
            <div className="overlay_wrap"></div>
            <div className="create-pompt-wrapper">
                <div className="prompt-creator">
                    <img src="../assets/img/profile-pic.png" alt="" />
                    <h5>@Richard | <span>2,200 Subscribers</span></h5>
                </div>
                <div className="prompit-lists">
                    <ul>
                        <li className="active"><span></span><a href="">Create a powerful...</a></li>
                        <li><a href=""><span></span>Create a powerful...</a></li>
                        <li><a href="">Create a powerful...</a></li>
                    </ul>
                </div>
                <div className="selector-group">
                    <div className="row">
                        <div className="col-lg-4">
                            <div className="single-select nice_select">
                                <label htmlFor="" className="label_txt">Category</label>
                                <div className="selectBox">
                                    <div className="selectBox__value">English</div>
                                    <div className="dropdown-menu">
                                        <a href="#" className="dropdown-item active">English</a>
                                        <a href="#" className="dropdown-item">Bangla</a>
                                        <a href="#" className="dropdown-item">Hindi</a>
                                        <a href="#" className="dropdown-item">Spanish</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="single-select">
                                <div className="single-select nice_select">
                                    <label htmlFor="" className="label_txt">Tone</label>
                                    <div className="selectBox">
                                        <div className="selectBox__value">Tone</div>
                                        <div className="dropdown-menu">
                                            <a href="#" className="dropdown-item active">Tone One</a>
                                            <a href="#" className="dropdown-item">Tone Two</a>
                                            <a href="#" className="dropdown-item">Tone Three</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="single-select">
                                <div className="single-select nice_select">
                                    <label htmlFor="" className="label_txt">Ai Model</label>
                                    <div className="selectBox">
                                        <div className="selectBox__value">AI Model</div>
                                        <div className="dropdown-menu">
                                            <a href="#" className="dropdown-item active">AI Model</a>
                                            <a href="#" className="dropdown-item">AI Model 2</a>
                                            <a href="#" className="dropdown-item">AI Model 3</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="pronpt-textarea">
                    <textarea name="" id="" cols="30" rows="10" placeholder="Type here..."></textarea>
                    <button type="submit">Enter</button>
                </div>
            </div>
        </>
    );
};

export default Footer;
