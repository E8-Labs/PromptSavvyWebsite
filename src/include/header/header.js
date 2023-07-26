import React, { useEffect,useState} from 'react';
import { Link } from 'react-router-dom';
import InstalledExtension from '../../components/Extension/installed';
import SideBar from '../sidebar/sidebar';
import { fetch_user_profile_information } from '../../service/Apis/api';

const Header = () => {
    const [Loginstatus, setLoginstatus] = useState(true);
    const [UserImage, setUserImage] = useState('');
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
                                var mongodb_user_image = localStorage.getItem('mongodb_user_image');
                                setUserImage(data.profile_info.image);
                            }
                        }else{
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
                                                        <li>
                                                            <Link to="#">
                                                                You have a new subscriber! 🎉
                                                                <p>2days ago</p>
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <Link to="#">
                                                                Congrats! You made #$# from #promptname#
                                                                <p>2days ago</p>
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <Link to="#">
                                                                Check it out! New prompt released by #username#
                                                                <p>2days ago</p>
                                                            </Link>
                                                        </li>
                                                        <li className="seen_message">
                                                            <Link to="#">
                                                                Your prompt is paused by admin
                                                                <p>2days ago</p>
                                                            </Link>
                                                        </li>
                                                        <li className="seen_message">
                                                            <Link to="#">
                                                                New message
                                                                <p>2days ago</p>
                                                            </Link>
                                                        </li>
                                                        <li className="seen_message">
                                                            <Link to="#">
                                                                Your prompt is paused by admin
                                                                <p>2days ago</p>
                                                            </Link>
                                                        </li>
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