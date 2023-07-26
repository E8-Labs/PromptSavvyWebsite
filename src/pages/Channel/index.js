import React, { useEffect,useState  } from 'react';
import {
    fetch_user_profile_information,
    fetching_prompts_of_any_userid,
    subscribing_a_user,
    unsubscribing_a_user,
    following_list,
    followers_list,
    check_if_subscribed,
    search_following,
    search_followers
} from '../../service/Apis/api';
import { useLocation,Link } from 'react-router-dom';
import InfiniteScroll from "react-infinite-scroll-component";
import Header from '../../include/header/header';
import UserProfileArea from '../../components/userprofile/userprofilearea';
import PromptGrid from '../../components/prompt/promptgrid';
import Footer from '../../include/footer';
import CommunityList from '../../components/community/community_list';
import ErrorSnackbar from '../../components/ErrorSnackbar';
import SuccessSnackbar from '../../components/SuccessSnackbar';



const Channel = () => {    
    const location = useLocation();
    const [UserName, setUserName] = useState('');
    const [UserImage, setUserImage] = useState('');
    const [FollowersLength, setFollowersLength] = useState(0);
    const [SocialLinks, setSocialLinks] = useState([]);
    const [UserPrompts, setUserPrompts] = useState([]);
    const [FollowStatus, setFollowStatus] = useState(false);
    const [CurrentMongodbUserID, setCurrentMongodbUserID] = useState('');
    const [ShowCommunityListStatus, setShowCommunityListStatus] = useState(false);
    const [FollowingFollowersUserList, setFollowingFollowersUserList] = useState([]);
    const [ActivityFollowingFollowers, setActivityFollowingFollowers] = useState('');
    const [search_algo, setsearch_algo] = useState('recent');
    const [FollowingFollowerSearchAlgo, setFollowingFollowerSearchAlgo] = useState('');
    
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
    
    
    useEffect(() => {        
        fetchData();
    }, []);

    async function fetchMoreUserPrompts(){
        try {
            const res = await fetching_prompts_of_any_userid(CurrentMongodbUserID,localStorage.getItem('mongodb_userid'),'recent','0');
            if(res.data){
                if(res.data.statusCode == 200){
                    var data = JSON.parse(res.data.body);
                    if(data.user_prompts){
                        setUserPrompts([...UserPrompts, ...data.user_prompts]);
                    }                
                }
            }
        } catch (error) {
            handleExceptionError(error);
            return null;
        }
    }

    async function followers_request(){
        try {
            const res = await subscribing_a_user(localStorage.getItem('mongodb_userid') , CurrentMongodbUserID);
            if(res.data.statusCode == 200){
                setFollowStatus(true);
            }
        } catch (error) {
            handleExceptionError(error);
            return null;
        }
    }
    async function unfollowers_request(){
        try {
            const res = await unsubscribing_a_user(localStorage.getItem('mongodb_userid') , CurrentMongodbUserID);
            if(res.data.statusCode == 200){
                setFollowStatus(false);
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
            setFollowingFollowerSearchAlgo('');
            setActivityFollowingFollowers(active);
            if(active == 'followers'){
                const res = await followers_list(CurrentMongodbUserID,0);
                if(res.data.statusCode == 200){
                    var data = JSON.parse(res.data.body);
                    setFollowingFollowersUserList(data.subscribers);
                }
            }else{
                const res = await following_list(CurrentMongodbUserID,0);
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
            setFollowingFollowerSearchAlgo(value);        
            if(ActivityFollowingFollowers == 'followers'){
                const res = await search_followers(CurrentMongodbUserID,value,0);
                if(res.data.statusCode == 200){
                    var data = JSON.parse(res.data.body);
                    setFollowingFollowersUserList(data.followers_search);
                }
            }else{
                const res = await search_following(CurrentMongodbUserID,value,0);
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

    async function get_user_prompts(mongodb_userid,search_algo_type){
        try {
            const res = await fetching_prompts_of_any_userid(mongodb_userid,localStorage.getItem('mongodb_userid'),search_algo_type,'0');
            if(res.data){
                if(res.data.statusCode == 200){
                    var data = JSON.parse(res.data.body);
                    if(data.user_prompts){
                        setUserPrompts(data.user_prompts);
                    }                
                }
            }
        } catch (error) {
            handleExceptionError(error);
            return null;
        }
    }
    async function UserRecentPromptActive(event){
        setsearch_algo('recent');
        await get_user_prompts(CurrentMongodbUserID,'recent');
        event.preventDefault();

    }
    async function UserPopularPromptActive(event){
        setsearch_algo('popular');
        await get_user_prompts(CurrentMongodbUserID,'popular');
        event.preventDefault();
    }

    async function GetDefaultFollowStatus(mongodb_userid){
        try {
            const res = await check_if_subscribed(mongodb_userid,localStorage.getItem('mongodb_userid'));
            if(res.data){
                if(res.data.statusCode == 200){
                    var data = JSON.parse(res.data.body);
                    if(data.status_info){
                        if(data.status_info.isSubscribed){
                            setFollowStatus(data.status_info.isSubscribed)
                        }
                    } 
                }else{
                }
            }
        } catch (error) {
            handleExceptionError(error);
            return null;
        }
    }

    async function fetchData() {
        try {
            if(localStorage.getItem('mongodb_userid') != undefined && localStorage.getItem('mongodb_userid') != null ){
                var pathname = location.pathname;
                var mongodb_userid = localStorage.getItem('mongodb_userid');
                if(pathname != ''){
                    pathname = pathname.split('/');
                    if(pathname.length == 2){
                        mongodb_userid = pathname[1];
                    }
                }

                setCurrentMongodbUserID(mongodb_userid);

                const res = await fetch_user_profile_information(mongodb_userid);
                if(res.data){
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
                    }
                }
                setsearch_algo('recent');
                await get_user_prompts(mongodb_userid,'recent');
                await GetDefaultFollowStatus(mongodb_userid);
            }
        } catch (error) {
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
                    next={fetchMoreUserPrompts}
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
                            <div className="row py-4 align-items-center">
                                <div className="col-lg-8 col-md-8">
                                    <div className="prompt-filter-left">
                                        <Link to={`/${CurrentMongodbUserID}`} onClick={UserRecentPromptActive.bind(this)} className={search_algo == 'recent' ? "action_btn active btn_bg_darkblue" : "action_btn btn_bg_darkblue"} ><img src="../assets/img/Activity.svg" alt="" /> Recent</Link>
                                        <Link to={`/${CurrentMongodbUserID}`} onClick={UserPopularPromptActive.bind(this)} className={search_algo == 'popular' ? "action_btn active btn_bg_pink" : "action_btn btn_bg_pink"} ><img src="../assets/img/badge.svg" alt="" /> Popular</Link>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                {UserPrompts.map((item, index) => (
                                    <PromptGrid PublicPrompt={item} key={index} UserImage={UserImage} />
                                ))}
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
                        /> : ''}
                    <Footer />
                </InfiniteScroll>
            </main>
        </>
    );
};

export default Channel;