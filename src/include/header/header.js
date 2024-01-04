import React, { useEffect, useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import InstalledExtension from '../../components/Extension/installed';
import SideBar from '../sidebar/sidebar';
import Loader from "./loader.js";

import { fetch_user_profile_information, fetch_loggedin_user_notifications, seen_notification } from '../../service/Apis/api';

import moment from 'moment-timezone';
moment.tz.setDefault('Etc/UTC');

const Header = (props) => {
    const navigate = useNavigate();
    const [Loginstatus, setLoginstatus] = useState(true);
    const [UserImage, setUserImage] = useState('');
    const [Notifications, setNotifications] = useState([]);
    const [NotificationsCount, setNotificationsCount] = useState(0);

    async function seennotification(_id) {
        setNotifications(prevData => prevData.map(item =>
            item._id === _id ? { ...item, read: true } : item
        ));
        setNotificationsCount(prevCount => prevCount - 1);
        await seen_notification(_id)        
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
                        setLoginstatus(true)
                        fetchData();
                    }else{
                        window.location.replace('https://chat.openai.com/?redirectto='+process.env.REACT_APP_BASE_URL);
                        setLoginstatus(false)
                    }
                }
            }else{
                setLoginstatus(false)
                localStorage.removeItem('mongodb_userid');
                IntervalCount = 0;
            }
        }, 500);   

        async function fetchData() {
            try {
                if (localStorage.getItem('mongodb_userid') != undefined && localStorage.getItem('mongodb_userid') != null) {
                    setLoginstatus(true)

                    

                    const res = await fetch_user_profile_information(localStorage.getItem('mongodb_userid'));
                    if(res.status == 200){
                        if(res.data.statusCode == 200){
                            var data = JSON.parse(res.data.body);
                            if (data.profile_info.username) {
                                setUserImage(data.profile_info.image);
                            } 
                        }else{
                            
                        }
                    }else{
                        
                    }
                    const res1 = await fetch_loggedin_user_notifications(localStorage.getItem('mongodb_userid'), 1);
                    if(res1.status == 200){
                        if(res1.data.statusCode == 200){
                            var data1 = JSON.parse(res1.data.body);
                            setNotifications(data1.unread_notifications);
                            setNotificationsCount(data1.unread_notifications_count)
                        }else{
                        }
                    }else{
                    }
                } else {
                    setLoginstatus(false)
                }
            } catch (error) {
            }
        }
        return () => {
            clearInterval(interval);
        };
    }, []);

    const [isLoading, setIsLoading] = useState(true);

    // Simulate page loading for 2 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
        setIsLoading(false);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);
    return (
        <>
            {isLoading && (
                <Loader />
            )}
            {Loginstatus == false ? <InstalledExtension /> : ''}
            <header>
                <div className="container-fluid">
                    <div className="row align-items-center">
                        <div className="col-lg-12">
                            <div className="header-wrapper">
                                <div className="logo">
                                    <Link to="/"><h2>Prompt.<span>ai</span></h2></Link>
                                </div>
                                <div className="header-right justify-content-end">
                                    <div className="header-right-wrap">
                                        {props.notificationshow &&
                                            <div className="notification_box">
                                                <Link to="#notification_trigger" data-bs-toggle="collapse" aria-expanded="false" aria-controls="notification_trigger"><span>{NotificationsCount}</span><img src="../assets/img/notification.svg" alt="" /></Link>
                                                <div className="notifications-dropdown collapse" id="notification_trigger">
                                                    <div className="dropdown-title">
                                                        <h4>Notifications</h4>
                                                        <Link to="/notification">View All</Link>
                                                    </div>
                                                    <div className="recent-notification">
                                                        <ul>
                                                            {Notifications.map((item, index) => ( 
                                                                <li key={index}>
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
                                        }
                                        <div className="profile_box">
                                            {UserImage ?
                                                (props.userprofileimage?
                                                    <Link to="/"><img src={props.userprofileimage} alt="" /></Link>
                                                    :
                                                    <Link to="/"><img src={UserImage} alt="" /></Link>
                                                )                                                
                                                :
                                                <Link to="/"><img src="../assets/img/profile-pic.png" alt="" /></Link>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <SideBar />
        </>
    );
};

export default Header;