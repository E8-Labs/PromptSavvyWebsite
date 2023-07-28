import React, { useEffect,useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import InfiniteScroll from "react-infinite-scroll-component";
import {
    fetch_user_profile_information,
    fetching_prompts_of_any_userid,
    editing_user_profile_information,
    followers_list,following_list,
    search_followers,
    search_following,
    adding_user_to_wishlist
} from '../../service/Apis/api';
import Header from '../../include/header/header';
import UserProfileArea from '../../components/userprofile/userprofilearea';
import PromptGrid from '../../components/prompt/promptgrid';
import Footer from '../../include/footer';
import CommunityList from '../../components/community/community_list';
import ErrorSnackbar from '../../components/ErrorSnackbar';
import SuccessSnackbar from '../../components/SuccessSnackbar';

var prompt_list_page = 1;
var community_list_page = 1;
 
const MyProfile = () => {
    const fileInputRef = useRef(null);

    const [UserName, setUserName] = useState('');
    const [UserImage, setUserImage] = useState('');
    const [FollowersLength, setFollowersLength] = useState(0);
    const [SocialLinks, setSocialLinks] = useState([]);
    const [UserPrompts, setUserPrompts] = useState([]);
    const [FollowStatus, setFollowStatus] = useState(false);
    const [ShowCommunityListStatus, setShowCommunityListStatus] = useState(false);
    const [FollowingFollowerSearchAlgo, setFollowingFollowerSearchAlgo] = useState('');
    const [FollowingFollowersUserList, setFollowingFollowersUserList] = useState([]);
    const [ActivityFollowingFollowers, setActivityFollowingFollowers] = useState('');

    const [FormName, setFormName] = useState('');
    const [EditFormName, setEditFormName] = useState(false);
    const [FormEmail, setFormEmail] = useState('');
    const [EditFormEmail, setEditFormEmail] = useState(false);
    const [FormYoutubeLink, setFormYoutubeLink] = useState('');
    const [EditFormYoutubeLink, setEditFormYoutubeLink] = useState(false);
    const [FormInstagramLink, setFormInstagramLink] = useState('');
    const [EditFormInstagramLink, setEditFormInstagramLink] = useState(false);
    const [FormWebsiteLink, setFormWebsiteLink] = useState('');
    const [EditFormWebsiteLink, setEditFormWebsiteLink] = useState(false);
    const [ShowSaveButton, setShowSaveButton] = useState(false);
    const [ExceptionError, setExceptionError] = useState([]);
    const [successMessages, setSuccessMessages] = useState([]);
    const [WaitListEmail, setWaitListEmail] = useState('');
    
    

    async function unfollowers_request(){ }
    async function followers_request(){}
    async function ShowCommunity(){}

    function handleExceptionError(error) {
        setExceptionError(ExceptionError => [
            ...ExceptionError,
            { id: Date.now(), message: error.message },
        ]);
    }

    function handleExceptionSuccessMessages(msg) {
        setSuccessMessages(successMessages => [
            ...successMessages,
            { id: Date.now(), message: msg },
        ]);
    }

    function clearErrors(id) {
        setExceptionError(prevMessages =>
            prevMessages.filter(msg => msg.id !== id)
        );
    }
    function clearSuccess(id) {
        setSuccessMessages(prevMessages =>
          prevMessages.filter(msg => msg.id !== id)
        );
    }

    async function Save_Information(){
        try {
            if(FormName == ''){
                handleExceptionError({message:'Username is required'});
                return false;  
            }
            if(FormEmail == ''){
                handleExceptionError({message:'Email is required'});
                return false;  
            }
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if(!emailRegex.test(FormEmail)){
                handleExceptionError({message:'Please enter valid email address'});
                return false;
            }
            const res = await editing_user_profile_information(
                localStorage.getItem('mongodb_userid'),
                FormEmail,
                FormName,
                UserImage,
                FormInstagramLink,
                FormYoutubeLink,
                FormWebsiteLink
            );
            if(res.data.statusCode == 200){
                setEditFormName(false);
                setEditFormEmail(false);
                setEditFormYoutubeLink(false);
                setEditFormInstagramLink(false);
                setEditFormWebsiteLink(false);
                setShowSaveButton(false);
                handleExceptionSuccessMessages('Profile upaded successfully!')
            }
        } catch (error) {
            handleExceptionError(error);
            return null;
        }
    }
    async function SendRequestWaitList(){
        try {
            if(WaitListEmail == ''){
                handleExceptionError({message:'Email is required'});
                return false;  
            }
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if(!emailRegex.test(WaitListEmail)){
                handleExceptionError({message:'Please enter valid email address'});
                return false;
            }
            /*
            const res = await adding_user_to_wishlist(
                WaitListEmail
            );
            if(res.data.statusCode == 200){
                var data = JSON.parse(res.data.body);
                handleExceptionSuccessMessages(data.message)
                setWaitListEmail('');
            }*/
        } catch (error) {
            handleExceptionError(error);
            return null;
        }
    }

    

    function handleFileChangeOpen(event){
        fileInputRef.current.click();
    }

    async function handleFileChange(event){
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64String = event.target.result;
                setUserImage(base64String);
            };
            reader.readAsDataURL(file);
            setShowSaveButton(true);
        } else {
            console.log('Please select an image file.');
        }
    }

    async function fetchMoreUserPrompts(){
        try {
            prompt_list_page++;
            const res1 = await fetching_prompts_of_any_userid(localStorage.getItem('mongodb_userid'),localStorage.getItem('mongodb_userid'),'recent', prompt_list_page );
            if(res1.data.statusCode){
                var data1 = JSON.parse(res1.data.body);
                setUserPrompts([...UserPrompts, ...data1.user_prompts]);
            }
        } catch (error) {
            handleExceptionError(error);
            return null;
        }
    }

    async function ShowCommunity(){
        setShowCommunityListStatus(true);
        ActivityFollowingFollowersChange('followers');
    }

    async function CloseCommunity(){
        setShowCommunityListStatus(false);
    }

    async function ActivityFollowingFollowersChange(active){
        try {
            community_list_page = 1
            setFollowingFollowerSearchAlgo('');
            setActivityFollowingFollowers(active);
            if(active == 'followers'){
                const res = await followers_list(localStorage.getItem('mongodb_userid'),community_list_page);
                if(res.data.statusCode == 200){
                    var data = JSON.parse(res.data.body);
                    setFollowingFollowersUserList(data.subscribers);
                }
            }else{
                const res = await following_list(localStorage.getItem('mongodb_userid'),0);
                if(res.data.statusCode == 200){
                    var data = JSON.parse(res.data.body);
                    setFollowingFollowersUserList(data.following);
                }
            }
        } catch (error) {
            handleExceptionError(error);
            return null;
        }
    }

    async function FollowingFollowersSearch(value){
        try {
            community_list_page = 1
            setFollowingFollowerSearchAlgo(value);        
            if(ActivityFollowingFollowers == 'followers'){
                const res = await search_followers(localStorage.getItem('mongodb_userid'),value,0);
                if(res.data.statusCode == 200){
                    var data = JSON.parse(res.data.body);
                    setFollowingFollowersUserList(data.followers_search);
                }
            }else{
                const res = await search_following(localStorage.getItem('mongodb_userid'),value,0);
                if(res.data.statusCode == 200){
                    var data = JSON.parse(res.data.body);
                    setFollowingFollowersUserList(data.following_search);
                }
            }
        } catch (error) {
            handleExceptionError(error);
            return null;
        }
    }

    function logout(){
        localStorage.removeItem('mongodb_userid');
    }
    

    useEffect(() => {
        async function fetchData() {
            try {
                if(localStorage.getItem('mongodb_userid') != undefined && localStorage.getItem('mongodb_userid') != null ){

                    const res = await fetch_user_profile_information(localStorage.getItem('mongodb_userid'));
                    if(res.data){
                        if(res.data.statusCode == 200){
                            var data = JSON.parse(res.data.body);
                            if(data.profile_info.username){
                                setUserName(data.profile_info.username);
                                setFormName(data.profile_info.username);
                            }
                            if(data.profile_info.email){
                                setFormEmail(data.profile_info.email);
                            }   
                            if(data.subscribers){
                                setFollowersLength(data.profile_info.subscribers.length);
                            }
                            if(data.profile_info.social_links){
                                setSocialLinks(data.profile_info.social_links);
                                if(data.profile_info.social_links.Instagram){
                                    setFormInstagramLink(data.profile_info.social_links.Instagram);
                                }
                                if(data.profile_info.social_links.Youtube){
                                    setFormYoutubeLink(data.profile_info.social_links.Youtube);
                                    
                                }
                                if(data.profile_info.social_links.Website){
                                    setFormWebsiteLink(data.profile_info.social_links.Website);
                                }
                                if(data.profile_info.image){
                                    setUserImage(data.profile_info.image);
                                }
                            }
                        }else{
                        }
                    }

                    const res1 = await fetching_prompts_of_any_userid(localStorage.getItem('mongodb_userid'),localStorage.getItem('mongodb_userid'),'recent', prompt_list_page );
                    if(res1.data.statusCode){
                        var data1 = JSON.parse(res1.data.body);
                        setUserPrompts(data1.user_prompts)
                    }
                }
            } catch (error) {
                handleExceptionError(error);
                return null;
            }
        }
        fetchData();

        document.body.classList.add('body_class');
        return () => {
          document.body.classList.remove('gtp_page');
        };
    }, []);

    async function fetchMoreCommunity(){
        try {
            community_list_page++;
            if(FollowingFollowerSearchAlgo != ''){
                if(ActivityFollowingFollowers == 'followers'){
                    const res = await search_followers(localStorage.getItem('mongodb_userid'),FollowingFollowerSearchAlgo,community_list_page);
                    if(res.data.statusCode == 200){
                        var data = JSON.parse(res.data.body);
                        setFollowingFollowersUserList([...FollowingFollowersUserList, ...data.followers_search]);
                    }
                }else{
                    const res = await search_following(localStorage.getItem('mongodb_userid'),FollowingFollowerSearchAlgo,community_list_page);
                    if(res.data.statusCode == 200){
                        var data = JSON.parse(res.data.body);
                        setFollowingFollowersUserList([...FollowingFollowersUserList, ...data.following_search]);
                    }
                }                
            }else{
                if(ActivityFollowingFollowers == 'followers'){
                    const res = await followers_list(localStorage.getItem('mongodb_userid'),community_list_page);
                    if(res.data.statusCode == 200){
                        var data = JSON.parse(res.data.body);
                        setFollowingFollowersUserList([...FollowingFollowersUserList, ...data.subscribers]);
                    }
                }else{
                    const res = await following_list(localStorage.getItem('mongodb_userid'),community_list_page);
                    if(res.data.statusCode == 200){
                        var data = JSON.parse(res.data.body);
                        setFollowingFollowersUserList([...FollowingFollowersUserList, ...data.following]);
                    }
                }
            }
        }catch (error) {
            handleExceptionError(error);
            return null;
        }
    }


    return (
        <>
            <ErrorSnackbar errorMessages={ExceptionError} onClearErrors={clearErrors} />
            <SuccessSnackbar successMessages={successMessages} onclearSuccess={clearSuccess} />
            <Header />
                <main className="main_content-start" id="scrollableDiv" style={{ height: '100vh', overflow: "auto" }}>
                <InfiniteScroll
                    dataLength={UserPrompts.length}
                    next={fetchMoreUserPrompts.bind(this)}
                    hasMore={true}
                    loader={''}
                    scrollableTarget="scrollableDiv"
                >
                    <UserProfileArea
                        UserName={UserName}
                        FollowersLength={FollowersLength}
                        UserID={localStorage.getItem('mongodb_userid')} SocialLinks={SocialLinks}
                        FollowStatus={FollowStatus}
                        unfollowers_request={unfollowers_request}
                        followers_request={followers_request}
                        ShowCommunity={ShowCommunity}
                        UserImage={UserImage}
                    />
                        <section className="prompt-area">
                            <div className="container-fluid">
                                <div className="row py-4 align-items-center">
                                    <div className="col-lg-8 col-md-8">
                                        <div className="prompt-filter-left">
                                            <div className="prompt-card-tablist">
                                                <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                                                    <li className="nav-item" role="presentation">
                                                    <button className="nav-link active" id="pills-MyPrompts-tab" data-bs-toggle="pill" data-bs-target="#pills-MyPrompts" type="button" role="tab" aria-controls="pills-MyPrompts" aria-selected="true"><img src="../assets/img/Star-red.svg" alt="" /> My Prompts</button>
                                                    </li>
                                                    <li className="nav-item NavProfileManagement" role="presentation">
                                                    <button className="nav-link" id="pills-ProfileManagement-tab" data-bs-toggle="pill" data-bs-target="#pills-ProfileManagement" type="button" role="tab" aria-controls="pills-ProfileManagement" aria-selected="false"><img src="../assets/img/settting-green.svg" alt="" /> Profile Management</button>
                                                    <button className="nav-link" id="pills-AiPersonality-tab" data-bs-toggle="pill" data-bs-target="#pills-AiPersonality" type="button" role="tab" aria-controls="pills-AiPersonality" aria-selected="false"><img src="../assets/img/chatgpt.svg" alt="" />AI Personality</button>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="tab-content" id="pills-tabContent">
                                            <div className="tab-pane fade show active" id="pills-MyPrompts" role="tabpanel" aria-labelledby="pills-MyPrompts-tab">
                                                {/* <div className="row">
                                                    <div className="col-lg-12">
                                                        <div className="infp-title">
                                                            <h4>Profile Management</h4>
                                                        </div>
                                                    </div>
                                                </div> */}
                                                <div className="row">                                                
                                                    {UserPrompts.map((item, index) => (
                                                        <PromptGrid PublicPrompt={item} key={index} UserImage={UserImage} handleExceptionError={handleExceptionError} handleExceptionSuccessMessages={handleExceptionSuccessMessages} />
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="tab-pane fade" id="pills-ProfileManagement" role="tabpanel" aria-labelledby="pills-ProfileManagement-tab">
                                                <div className="ProfileManagement-wrapper">
                                                    <div className="row">
                                                        <div className="col-lg-12">
                                                            <div className="personal-info-tabcontent">
                                                                <div className="v-tablist">
                                                                    <div className="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                                                                        <button className="nav-link active" id="v-pills-Personal-tab" data-bs-toggle="pill" data-bs-target="#v-pills-Personal" type="button" role="tab" aria-controls="v-pills-Personal" aria-selected="true">Personal Information</button>
                                                                    </div>
                                                                    <div className="logout-option">
                                                                        <Link href="#" onClick={logout}>Logout</Link>
                                                                    </div>
                                                                </div>
                                                                <div className="v-tab-contents">
                                                                    <div className="tab-content" id="v-pills-tabContent">
                                                                        <div className="tab-pane fade show active" id="v-pills-Personal" role="tabpanel" aria-labelledby="v-pills-Personal-tab">
                                                                            <div className="personal-info-wrap">
                                                                                <div className="dp-info">
                                                                                    <div className="profile-picture">
                                                                                        <div className="circle">
                                                                                            {UserImage?
                                                                                                <img className="profile-pic" src={UserImage} />
                                                                                            :
                                                                                                <img className="profile-pic" src="../assets/img/profile-pic.png" />
                                                                                            }
                                                                                        </div>
                                                                                        <div className="p-image">
                                                                                            <img onClick={handleFileChangeOpen} className="upload-button" src="../assets/img/camara.svg" alt="" />
                                                                                            <input ref={fileInputRef} onChange={handleFileChange} className="file-upload" type="file" accept="image/*" />
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="dp-text">
                                                                                        <h4>{FormName}</h4>
                                                                                        <p>{FormEmail}</p>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="myrofile-info-list">
                                                                                    <div className="single-inf">
                                                                                        <label htmlFor="">Username </label>                                                                                    
                                                                                        {EditFormName? 
                                                                                            <p style={{marginTop: '10px'}}>
                                                                                                <input style={{width:'100%'}} onChange={e => setFormName(e.target.value)} placeholder="Name" type="text" name="name" value={FormName} />
                                                                                            </p>
                                                                                        :
                                                                                            <h5>{FormName} <span className="edit_inf" onClick={() => {setEditFormName(true);setShowSaveButton(true);}} ><img src="../assets/img/Edit.svg" alt="" /></span></h5>
                                                                                        }
                                                                                    </div>
                                                                                    <div className="single-inf">
                                                                                        <label htmlFor="">Email Address </label>
                                                                                        {EditFormEmail? 
                                                                                            <p style={{marginTop: '10px'}}>
                                                                                                <input style={{width:'100%'}} onChange={e => setFormEmail(e.target.value)} placeholder="Email" type="email" name="email" value={FormEmail} />
                                                                                            </p>
                                                                                        :
                                                                                            <h5>{FormEmail}<span className="edit_inf" onClick={() => {setEditFormEmail(true);setShowSaveButton(true);}} ><img src="../assets/img/Edit.svg" alt="" /></span></h5>
                                                                                        }
                                                                                    </div>
                                                                                    <div className="single-inf">
                                                                                        <label htmlFor="">Youtube Link </label>
                                                                                        {EditFormYoutubeLink? 
                                                                                            <p style={{marginTop: '10px'}}>
                                                                                                <input style={{width:'100%'}} onChange={e => setFormYoutubeLink(e.target.value)} placeholder="Youtube Link" type="url" name="Youtube Link" value={FormYoutubeLink} />
                                                                                            </p>
                                                                                        :
                                                                                            <h5><Link style={{color:'#fff',opacity:'1'}} to={FormYoutubeLink}>{FormYoutubeLink}</Link> <span className="edit_inf" onClick={() => {setEditFormYoutubeLink(true);setShowSaveButton(true);}} ><img src="../assets/img/Edit.svg" alt="" /></span></h5>
                                                                                        }
                                                                                    </div>
                                                                                    <div className="single-inf">
                                                                                        <label htmlFor="">Instagram Link </label>
                                                                                        {EditFormInstagramLink? 
                                                                                            <p style={{marginTop: '10px'}}>
                                                                                                <input style={{width:'100%'}} onChange={e => setFormInstagramLink(e.target.value)} placeholder="Instagram Link" type="url" name="Instagram Link" value={FormInstagramLink} />
                                                                                            </p>
                                                                                        :
                                                                                            <h5><Link style={{color:'#fff',opacity:'1'}} to={FormInstagramLink}>{FormInstagramLink}</Link> <span className="edit_inf"  onClick={() => {setEditFormInstagramLink(true);setShowSaveButton(true);}} ><img src="../assets/img/Edit.svg" alt="" /></span></h5>
                                                                                        }
                                                                                    </div>
                                                                                    <div className="single-inf">
                                                                                        <label htmlFor="">Website Link </label>
                                                                                        {EditFormWebsiteLink? 
                                                                                            <p style={{marginTop: '10px'}}>
                                                                                                <input style={{width:'100%'}} onChange={e => setFormWebsiteLink(e.target.value)} placeholder="Website Link" type="url" name="Website Link" value={FormWebsiteLink} />
                                                                                            </p>
                                                                                        :
                                                                                            <h5><Link style={{color:'#fff',opacity:'1'}} to={FormWebsiteLink}>{FormWebsiteLink}</Link> <span className="edit_inf"  onClick={() => {setEditFormWebsiteLink(true); setShowSaveButton(true);}} ><img src="../assets/img/Edit.svg" alt="" /></span></h5>
                                                                                        }
                                                                                    </div>
                                                                                    <div className="single-inf">
                                                                                        <br />
                                                                                        {ShowSaveButton?
                                                                                            <button onClick={Save_Information.bind(this)} className="custom-btn-2 continue__btn step_btn_one">Save</button>
                                                                                        :
                                                                                            ''
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="tab-pane fade" id="pills-AiPersonality" role="tabpanel" aria-labelledby="pills-AiPersonality-tab">
                                                <div className="step_progress">
                                                    <span></span>
                                                </div>
                                                <div className="AiPersonality-wrapper">
                                                    <div className="step-wrapper step-container">
                                                        <div className="step">
                                                            <img src="../assets/img/shadow-shp.png" className="shadow_shp" alt="" />
                                                            <div className="AiPersonality-wrap">
                                                                <div className="AiPersonality-content">
                                                                    <h3>Build your AI <br /> Personality</h3>
                                                                    <p>Allow your subscribers to directly communicate with an AI version 
                                                                        of yourself to ask questions about your niche and topics. </p>
                                                                </div>
                                                                <img src="../assets/img/ai-1.png" className="ai-1" alt="" />
                                                                <img src="../assets/img/ai-2.png" className="ai-2" alt="" />
                                                                <img src="../assets/img/ai-3.png" className="ai-3" alt="" />
                                                                <img src="../assets/img/ai-4.png" className="ai-4" alt="" />
                                                                <img src="../assets/img/ai-5.png" className="ai-5" alt="" />
                                                                <img src="../assets/img/ai-8.png" className="ai-6" alt="" />
                                                                <img src="../assets/img/ai-7.png" className="ai-7" alt="" />
                                                                <img src="../assets/img/ai-8.png" className="ai-8" alt="" />
                                                                <img src="../assets/img/ai-6.png" className="ai-9" alt="" />
                                                                <img src="../assets/img/ai-4.png" className="ai-10" alt="" />
                                                            </div>
                                                            <div className="ai-create-bottom mt-5 text-center join_wait_list">
                                                                <div>
                                                                    <div>
                                                                        <label>Join the waitlist</label>
                                                                        <input type="email" onChange={e => setWaitListEmail(e.target.value)} name="" value={WaitListEmail} placeholder="Email Address" />
                                                                    </div>
                                                                    <button onClick={SendRequestWaitList.bind(this)} className="custom-btn-2">Join the waitlist</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                            </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                        {ShowCommunityListStatus?
                            <CommunityList
                                CloseCommunity={CloseCommunity}
                                FollowingFollowersUserList={FollowingFollowersUserList}
                                ActivityFollowingFollowers={ActivityFollowingFollowers}
                                ActivityFollowingFollowersChange={ActivityFollowingFollowersChange}
                                FollowingFollowersSearch={FollowingFollowersSearch}
                                fetchMoreCommunity={fetchMoreCommunity}
                        /> : ''}
                    <Footer />
                </InfiniteScroll>
            </main>
        </>
    );
};

export default MyProfile;