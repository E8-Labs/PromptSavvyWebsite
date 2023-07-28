import React, { useEffect,useState} from 'react';
import { Link } from 'react-router-dom';
import InstalledExtension from '../../components/Extension/installed';
import SideBar from '../sidebar/sidebar';
import { fetch_user_profile_information, fetch_loggedin_user_notifications } from '../../service/Apis/api';
import moment from 'moment-timezone';
moment.tz.setDefault('Etc/UTC');

const Header = () => {
    const [Loginstatus, setLoginstatus] = useState(true);
    const [UserImage, setUserImage] = useState('');
    const [Notifications, setNotifications] = useState([]);
    
    useEffect(()  =>  {
        async function fetchData() {
            try {
                if(localStorage.getItem('mongodb_userid') != undefined && localStorage.getItem('mongodb_userid') != null ){
                    setLoginstatus(true)

                    const res = await fetch_user_profile_information(localStorage.getItem('mongodb_userid'));
                    if(res.data){
                        if(res.data.statusCode == 200){
                            var data = JSON.parse(res.data.body);
                            if(data.profile_info.username){
                                setUserImage(data.profile_info.image);
                            }
                        }else{
                        }
                    }
                    const res1 = await fetch_loggedin_user_notifications(localStorage.getItem('mongodb_userid'),1);
                    if(res1.data){
                        if(res1.data.statusCode == 200){
                            var data1 = JSON.parse(res1.data.body);
                            setNotifications(data1.notifications);
                        }
                    }

                }else{
                    setLoginstatus(false)
                }
                
            } catch (error) {
            }
        }
        fetchData();

    }, []);
    return (
        <>
            {Loginstatus == false ? <InstalledExtension /> : '' }
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
                                        <div className="notification_box">
                                            <Link to="#notification_trigger"  data-bs-toggle="collapse" aria-expanded="false" aria-controls="notification_trigger"><span>02</span><img src="../assets/img/notification.svg" alt="" /></Link>
                                            <div className="notifications-dropdown collapse" id="notification_trigger">
                                                <div className="dropdown-title">
                                                    <h4>Notifications</h4>
                                                    <Link to="/notification">View All</Link>
                                                </div>
                                                <div className="recent-notification">
                                                    <ul>
                                                        {Notifications.map((item, index) => (
                                                            <li key={index}>
                                                                <Link to="#" > 
                                                                    {item.about}
                                                                    <p>{moment(item.createdAt, "YYYYMMDD, HH:mm:ss").fromNow(true)} ago.</p>
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="profile_box">
                                            {UserImage?
                                                <Link to="/"><img src={UserImage} alt="" /></Link>
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