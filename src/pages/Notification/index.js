import React, { useEffect,useState } from 'react';
import { Link } from 'react-router-dom';
import {
    fetch_user_profile_information,
    followers_list,
    following_list,
    fetch_all_loggedin_user_notifications,
    fetch_user_banner,
    upload_user_banner,
    seen_notification,
    search_followers,
    search_following
} from '../../service/Apis/api';
import Header from '../../include/header/header';
import UserProfileArea from '../../components/userprofile/userprofilearea';
import Footer from '../../include/footer';
import InfiniteScroll from "react-infinite-scroll-component";

import ErrorSnackbar from '../../components/ErrorSnackbar';
import SuccessSnackbar from '../../components/SuccessSnackbar';
import CommunityList from '../../components/community/community_list';

import moment from 'moment-timezone';
moment.tz.setDefault('Etc/UTC');

var notification_list_page = 1;
// var prompt_list_page = 1;
var community_list_page = 1;
// var IntervalCount = 0;
const Notification = () => {
    // const location = useLocation();
    const [UserName, setUserName] = useState('');
    const [UserImage, setUserImage] = useState('');
    const [FollowersLength, setFollowersLength] = useState(0);
    const [SocialLinks, setSocialLinks] = useState([]);
    const [UserPrompts, setUserPrompts] = useState([]);
    const [FollowStatus, setFollowStatus] = useState(false);
    const [CurrentMongodbUserID, setCurrentMongodbUserID] = useState('');

    const [Notifications, setNotifications] = useState([]);

    const [ExceptionError, setExceptionError] = useState([]);
    const [successMessages, setSuccessMessages] = useState([]);
    const [BannerImage, setBannerImage] = useState('/assets/img/banner-bg.png');
    const [ShowCommunityListStatus, setShowCommunityListStatus] = useState(false);
    const [FollowingFollowerSearchAlgo, setFollowingFollowerSearchAlgo] = useState('');
    const [FollowingFollowersUserList, setFollowingFollowersUserList] = useState([]);
    const [ActivityFollowingFollowers, setActivityFollowingFollowers] = useState('');


    function handleExceptionError(error) {
        setExceptionError(ExceptionError => [
            ...ExceptionError,
            { id: Date.now(), message: error.message },
        ]);
    }

    async function CloseCommunity(){
        setShowCommunityListStatus(false);
    }

    async function ChangeBannerImage(file){
        setBannerImage(file);
        const res = await upload_user_banner(localStorage.getItem('mongodb_userid'),file);
        if(res.status == 200){
            if(res.data.statusCode == 200){
                
            }else{
                handleExceptionError(JSON.parse(res.data.body));
            }
        }else{
            handleExceptionError({message : res.errorMessage});
        }
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

    
    async function unfollowers_request(){ }
    async function followers_request(){}
    async function ShowCommunity(){
        setShowCommunityListStatus(true);
        ActivityFollowingFollowersChange('followers');
        
    }

    async function ActivityFollowingFollowersChange(active){
        try {
            community_list_page = 1
            setFollowingFollowerSearchAlgo('');
            setActivityFollowingFollowers(active);
            if(active == 'followers'){
                const res = await followers_list(localStorage.getItem('mongodb_userid'),community_list_page);
                if(res.status == 200){
                    if(res.data.statusCode == 200){
                        var data = JSON.parse(res.data.body);
                        setFollowingFollowersUserList(data.subscribers);
                    }else{
                        handleExceptionError(JSON.parse(res.data.body));
                    }
                }else{
                    handleExceptionError({message : res.errorMessage});
                }
            }else{
                const res = await following_list(localStorage.getItem('mongodb_userid'),0);
                if(res.status == 200){
                    if(res.data.statusCode == 200){
                        var data = JSON.parse(res.data.body);
                        setFollowingFollowersUserList(data.following);
                    }else{
                        handleExceptionError(JSON.parse(res.data.body));
                    }
                }else{
                    handleExceptionError({message : res.errorMessage});
                }
            }
        } catch (error) {
            handleExceptionError(error);
            return null;
        }
    }
    

    async function fetchMoreNotification(){
        try {
            notification_list_page++;
            const res = await fetch_all_loggedin_user_notifications(localStorage.getItem('mongodb_userid'),notification_list_page);
            if(res.status == 200){
                if(res.data.statusCode == 200){
                    var data = JSON.parse(res.data.body);
                    setNotifications([...Notifications, ...data.notifications]);
                }else{
                    handleExceptionError(JSON.parse(res.data.body));
                }
            }else{
                handleExceptionError({message : res.errorMessage});
            }
        } catch (error) {
            handleExceptionError(error);
            return null;
        }
    }

    useEffect(() => {
        var IntervalCount = 0;
        const interval = setInterval(() => {
            const userObjElement = document.getElementById('user-obj');
            if (userObjElement) {
                if(IntervalCount == 0){
                    const userObjString = userObjElement.textContent;
                    const userObj = JSON.parse(userObjString);
                    const userId = userObj.user.id;
                    if(userId != ''){
                        IntervalCount = 1;
                        localStorage.setItem('mongodb_userid',userId);
                        fetchData();
                    }else{
                        localStorage.removeItem('mongodb_userid');
                    }
                }
            }else{
                localStorage.removeItem('mongodb_userid');
                IntervalCount = 0;
            }
        }, 500);
        async function fetchData() {
            try {
                if(localStorage.getItem('mongodb_userid') != undefined && localStorage.getItem('mongodb_userid') != null ){
                    setCurrentMongodbUserID(localStorage.getItem('mongodb_userid'));

                    const res = await fetch_user_profile_information(localStorage.getItem('mongodb_userid'));
                    if(res.status == 200){
                        if(res.data.statusCode == 200){
                            var data = JSON.parse(res.data.body);
                            if(data.profile_info.username){
                                setUserName(data.profile_info.username);
                            }
                            if(data.profile_info.subscribers){
                                setFollowersLength(data.profile_info.subscribers.length);
                            }
                            if(data.profile_info.social_links){
                                setSocialLinks(data.profile_info.social_links);
                            }
                            if(data.profile_info.image){
                                setUserImage(data.profile_info.image);
                            }
                        }else{
                            handleExceptionError(JSON.parse(res.data.body));
                        }
                    }else{
                        handleExceptionError({message : res.errorMessage});
                    }
                    const res1 = await fetch_all_loggedin_user_notifications(localStorage.getItem('mongodb_userid'),notification_list_page);
                    if(res1.status == 200){
                        if(res1.data.statusCode == 200){
                            var data1 = JSON.parse(res1.data.body);
                            setNotifications([...Notifications, ...data1.notifications]);
                        }else{
                            handleExceptionError(JSON.parse(res1.data.body));
                        }
                    }else{
                        handleExceptionError({message : res1.errorMessage});
                    }

                    const res2 = await fetch_user_banner(localStorage.getItem('mongodb_userid'));
                    if(res2.status == 200){
                        if(res2.data.statusCode == 200){
                            var data2 = JSON.parse(res2.data.body);
                            if(data2.banner){
                                setBannerImage(data2.banner);
                            }else{
                                setBannerImage('/assets/img/banner-bg.png');
                            }
                        }else{
                            handleExceptionError(JSON.parse(res2.data.body));
                        }
                    }else{
                        handleExceptionError({message : res2.errorMessage});
                    }
                }
            } catch (error) {
                handleExceptionError(error);
            }
        }       
        document.body.classList.add('body_class');
        return () => {
            clearInterval(interval);
            document.body.classList.remove('gtp_page');
        };
    }, []);

    async function seennotification(_id) {
        setNotifications(prevData => prevData.map(item =>
            item._id === _id ? { ...item, read: true } : item
        ));
        await seen_notification(_id)
    }

    async function FollowingFollowersSearch(value){
        try {
            community_list_page = 1
            setFollowingFollowerSearchAlgo(value);        
            if(ActivityFollowingFollowers == 'followers'){
                const res = await search_followers(localStorage.getItem('mongodb_userid'),value,0);
                if(res.status == 200){
                    if(res.data.statusCode == 200){
                        var data = JSON.parse(res.data.body);
                        setFollowingFollowersUserList(data.followers_search);
                    }else{
                        handleExceptionError(JSON.parse(res.data.body));
                    }
                }else{
                    handleExceptionError({message : res.errorMessage});
                }
            }else{
                const res = await search_following(localStorage.getItem('mongodb_userid'),value,0);
                if(res.status == 200){
                    if(res.data.statusCode == 200){
                        var data = JSON.parse(res.data.body);
                        setFollowingFollowersUserList(data.following_search);
                    }else{
                        handleExceptionError(JSON.parse(res.data.body));
                    }
                }else{
                    handleExceptionError({message : res.errorMessage});
                }
            }
        } catch (error) {
            handleExceptionError(error);
            return null;
        }
    }

    async function fetchMoreCommunity(){
        try {
            community_list_page++;
            if(FollowingFollowerSearchAlgo != ''){
                if(ActivityFollowingFollowers == 'followers'){
                    const res = await search_followers(localStorage.getItem('mongodb_userid'),FollowingFollowerSearchAlgo,community_list_page);
                    if(res.status == 200){
                        if(res.data.statusCode == 200){
                            var data = JSON.parse(res.data.body);
                            setFollowingFollowersUserList([...FollowingFollowersUserList, ...data.followers_search]);
                        }else{
                            handleExceptionError(JSON.parse(res.data.body));
                        }
                    }else{
                        handleExceptionError({message : res.errorMessage});
                    }
                }else{
                    const res = await search_following(localStorage.getItem('mongodb_userid'),FollowingFollowerSearchAlgo,community_list_page);
                    if(res.status == 200){
                        if(res.data.statusCode == 200){
                            var data = JSON.parse(res.data.body);
                            setFollowingFollowersUserList([...FollowingFollowersUserList, ...data.following_search]);
                        }else{
                            handleExceptionError(JSON.parse(res.data.body));
                        }
                    }else{
                        handleExceptionError({message : res.errorMessage});
                    }
                }                
            }else{
                if(ActivityFollowingFollowers == 'followers'){
                    const res = await followers_list(localStorage.getItem('mongodb_userid'),community_list_page);
                    if(res.status == 200){
                        if(res.data.statusCode == 200){
                            var data = JSON.parse(res.data.body);
                            setFollowingFollowersUserList([...FollowingFollowersUserList, ...data.subscribers]);
                        }else{
                            handleExceptionError(JSON.parse(res.data.body));
                        }
                    }else{
                        handleExceptionError({message : res.errorMessage});
                    }
                }else{
                    const res = await following_list(localStorage.getItem('mongodb_userid'),community_list_page);
                    if(res.status == 200){
                        if(res.data.statusCode == 200){
                            var data = JSON.parse(res.data.body);
                            setFollowingFollowersUserList([...FollowingFollowersUserList, ...data.following]);
                        }else{
                            handleExceptionError(JSON.parse(res.data.body));
                        }
                    }else{
                        handleExceptionError({message : res.errorMessage});
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
            <Header userprofileimage="" notificationshow={false} />
                <main className="main_content-start" id="scrollableDiv" style={{ height: '100vh', overflow: "auto" }}>
                    <InfiniteScroll
                        dataLength={Notifications.length}
                        next={fetchMoreNotification.bind(this)}
                        hasMore={true}
                        loader={''}
                        scrollableTarget="scrollableDiv"
                    >
                        <UserProfileArea
                            UserName={UserName}
                            FollowersLength={FollowersLength}
                            UserID={CurrentMongodbUserID} SocialLinks={SocialLinks}
                            FollowStatus={FollowStatus}
                            unfollowers_request={unfollowers_request}
                            followers_request={followers_request}
                            ShowCommunity={ShowCommunity}
                            UserImage={UserImage}
                            BannerImage={BannerImage}
                            ChangeBannerImage={ChangeBannerImage}
                        />

                        <section className="prompt-area">
                            <div className="container-fluid">   
                                <div className="row">   
                                    <div className="col-lg-12">
                                        <div className="notification-all">
                                            <h4>Notifications</h4>
                                            <div className="recent-notification">
                                                <ul>
                                                    {Notifications.map((item, index) => (
                                                        <li key={index} style={{width:'95%'}}>
                                                            {item.read?
                                                                    <Link to="#" style={{ background: '#071b15' }}>
                                                                        {item.about}
                                                                        <p>{moment(item.updatedAt, "YYYYMMDD, HH:mm:ss").fromNow(true)} ago.</p>
                                                                    </Link>
                                                                    :
                                                                    <Link to="#" onClick={() => {seennotification(item._id)}} style={{ background: 'transparent'}}>
                                                                        {item.about}
                                                                        <p>{moment(item.updatedAt, "YYYYMMDD, HH:mm:ss").fromNow(true)} ago.</p>
                                                                    </Link>
                                                                }
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </InfiniteScroll>
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
            </main>
        </>
    );
};

export default Notification;