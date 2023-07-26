import React, { useEffect,useState } from 'react';
import { fetch_user_profile_information,fetch_prompts_data } from '../../service/Apis/api';
import Header from '../../include/header/header';
import UserProfileArea from '../../components/userprofile/userprofilearea';
import Footer from '../../include/footer';
 
const Notification = () => {
    // const location = useLocation();
    const [UserName, setUserName] = useState('');
    const [FollowersLength, setFollowersLength] = useState(0);
    const [SocialLinks, setSocialLinks] = useState([]);
    const [UserPrompts, setUserPrompts] = useState([]);
    const [FollowStatus, setFollowStatus] = useState(false);
    const [CurrentMongodbUserID, setCurrentMongodbUserID] = useState('');
    async function unfollowers_request(){ }
    async function followers_request(){}
    async function ShowCommunity(){}
    useEffect(() => {
        async function fetchData() {
            try {
                if(localStorage.getItem('mongodb_userid') != undefined && localStorage.getItem('mongodb_userid') != null ){
                    setCurrentMongodbUserID(localStorage.getItem('mongodb_userid'));

                    const res = await fetch_user_profile_information(localStorage.getItem('mongodb_userid'));
                    if(res.data){
                        if(res.data.statusCode == 200){
                            var data = JSON.parse(res.data.body);
                            if(data.user_info.username){
                                setUserName(data.user_info.username);
                            }
                            if(data.subscribers){
                                setFollowersLength(data.user_info.subscribers.length);
                            }
                            if(data.user_info.social_links){
                                setSocialLinks(data.user_info.social_links);
                            }
                        }else{
                        }
                    }

                    const res1 = await fetch_prompts_data(localStorage.getItem('mongodb_userid'),'0');
                    if(res1.data.statusCode){
                        var data1 = JSON.parse(res1.data.body);
                        setUserPrompts(data1.user_prompts)
                    }
                }
            } catch (error) {
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
            <Header />
                <main className="main_content-start">
                    <UserProfileArea
                        UserName={UserName}
                        FollowersLength={FollowersLength}
                        UserID={CurrentMongodbUserID} SocialLinks={SocialLinks}
                        FollowStatus={FollowStatus}
                        unfollowers_request={unfollowers_request}
                        followers_request={followers_request}
                        ShowCommunity={ShowCommunity}
                    />
                    <section className="prompt-area">
                        <div className="container-fluid">   
                            <div className="row">   
                                <div className="col-lg-12">
                                    <div className="notification-all">
                                        <h4>Notifications</h4>
                                        <div className="recent-notification">
                                            <ul>
                                                <li className="active">
                                                    <a href="">
                                                        You have a new subscriber! 🎉
                                                        <p>2days ago</p>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="">
                                                        Congrats! You made #$# from #promptname#
                                                        <p>2days ago</p>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="">
                                                        Check it out! New prompt released by #username#
                                                        <p>2days ago</p>
                                                    </a>
                                                </li>
                                                <li className="seen_message">
                                                    <a href="">
                                                        Your prompt is paused by admin
                                                        <p>2days ago</p>
                                                    </a>
                                                </li>
                                                <li className="seen_message">
                                                    <a href="">
                                                        New message
                                                        <p>2days ago</p>
                                                    </a>
                                                </li>
                                                <li className="seen_message">
                                                    <a href="">
                                                        Your prompt is paused by admin
                                                        <p>2days ago</p>
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                <Footer />
            </main>
        </>
    );
};

export default Notification;