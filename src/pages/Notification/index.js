import React, { useEffect,useState } from 'react';
import { Link } from 'react-router-dom';
import { fetch_user_profile_information,fetch_loggedin_user_notifications } from '../../service/Apis/api';
import Header from '../../include/header/header';
import UserProfileArea from '../../components/userprofile/userprofilearea';
import Footer from '../../include/footer';
import InfiniteScroll from "react-infinite-scroll-component";

import ErrorSnackbar from '../../components/ErrorSnackbar';
import SuccessSnackbar from '../../components/SuccessSnackbar';

import moment from 'moment-timezone';
moment.tz.setDefault('Etc/UTC');

var notification_list_page = 1;
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

    
    async function unfollowers_request(){ }
    async function followers_request(){}
    async function ShowCommunity(){}
    

    async function fetchMoreNotification(){
        try {
            notification_list_page++;
            const res = await fetch_loggedin_user_notifications(localStorage.getItem('mongodb_userid'),notification_list_page);
            if(res.data){
                if(res.data.statusCode == 200){
                    var data = JSON.parse(res.data.body);
                    setNotifications([...Notifications, ...data.notifications]);
                }
            }
        } catch (error) {
            handleExceptionError(error);
            return null;
        }
    }

    useEffect(() => {
        async function fetchData() {
            try {
                if(localStorage.getItem('mongodb_userid') != undefined && localStorage.getItem('mongodb_userid') != null ){
                    setCurrentMongodbUserID(localStorage.getItem('mongodb_userid'));

                    const res = await fetch_user_profile_information(localStorage.getItem('mongodb_userid'));
                    if(res.data){
                        if(res.data.statusCode == 200){
                            var data = JSON.parse(res.data.body);
                            if(data.profile_info.username){
                                setUserName(data.profile_info.username);
                            }
                            if(data.subscribers){
                                setFollowersLength(data.profile_info.subscribers.length);
                            }
                            if(data.profile_info.social_links){
                                setSocialLinks(data.profile_info.social_links);
                            }
                            if(data.profile_info.image){
                                setUserImage(data.profile_info.image);
                            }
                        }else{
                        }
                    }
                    const res1 = await fetch_loggedin_user_notifications(localStorage.getItem('mongodb_userid'),notification_list_page);
                    if(res1.data){
                        if(res1.data.statusCode == 200){
                            var data1 = JSON.parse(res1.data.body);
                            setNotifications([...Notifications, ...data1.notifications]);
                        }
                    }
                }
            } catch (error) {
                handleExceptionError(error);
            }
        }
        fetchData();        

        document.body.classList.add('body_class');
        return () => {
          document.body.classList.remove('gtp_page');
        };
    }, []);

    return (
        <>
            <ErrorSnackbar errorMessages={ExceptionError} onClearErrors={clearErrors} />
            <SuccessSnackbar successMessages={successMessages} onclearSuccess={clearSuccess} />
            <Header />
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
                                                        <li key={index}>
                                                            <Link to="#"> 
                                                                {item.about}
                                                                <p>{moment(item.createdAt, "YYYYMMDD, HH:mm:ss").fromNow(true)} ago.</p>
                                                            </Link>
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
                <Footer />
            </main>
        </>
    );
};

export default Notification;