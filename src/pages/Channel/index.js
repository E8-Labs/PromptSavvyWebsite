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
    search_followers,
    fetch_user_banner
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

var prompt_list_page = 1;
var search_algo_type = 'recent';
var community_list_page = 1;
// var IntervalCount = 0;


const Channel = () => {    
    const location = useLocation();
    const [UserName, setUserName] = useState('');
    const [UserImage, setUserImage] = useState('');
    const [BannerImage, setBannerImage] = useState('/assets/img/banner-bg.png');
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

        return () => {
            clearInterval(interval);
        };
    }, []);

    async function fetchMoreUserPrompts(){
        try {
            prompt_list_page++;
            const res = await fetching_prompts_of_any_userid(CurrentMongodbUserID,localStorage.getItem('mongodb_userid'),search_algo_type, prompt_list_page);
            if(res.status == 200){
                if(res.data.statusCode == 200){
                    var data = JSON.parse(res.data.body);
                    if(data.user_prompts){
                        setUserPrompts([...UserPrompts, ...data.user_prompts]);
                    }
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

    async function followers_request(){
        try {
            const res = await subscribing_a_user(localStorage.getItem('mongodb_userid') , CurrentMongodbUserID);
            if(res.status == 200){
                if(res.data.statusCode == 200){
                    setFollowersLength(prevLength => prevLength + 1);
                    setFollowStatus(true);
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
    async function unfollowers_request(){
        try {
            const res = await unsubscribing_a_user(localStorage.getItem('mongodb_userid') , CurrentMongodbUserID);
            if(res.status == 200){
                if(res.data.statusCode == 200){
                    setFollowersLength(prevLength => prevLength - 1);
                    setFollowStatus(false);
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
    async function ShowCommunity(){
        setShowCommunityListStatus(true);
        ActivityFollowingFollowersChange('followers');
    }
    async function adding_favourite_prompt2(_id,status){
        const setPublicPrompt = UserPrompts.map(item => {
            if (item._id === _id) {
              return { ...item, isFavourite: status };
            }
            return item;
          });
        setUserPrompts(setPublicPrompt)
    }

    

    async function CloseCommunity(){
        setShowCommunityListStatus(false);
    }

    async function ActivityFollowingFollowersChange(active){
        try {
            setFollowingFollowerSearchAlgo('');
            setActivityFollowingFollowers(active);
            community_list_page = 1;
            if(active == 'followers'){
                const res = await followers_list(CurrentMongodbUserID,community_list_page);
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
                const res = await following_list(CurrentMongodbUserID,community_list_page);
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

    async function FollowingFollowersSearch(value){
        try {
            setFollowingFollowerSearchAlgo(value);      
            community_list_page = 1;  
            if(ActivityFollowingFollowers == 'followers'){
                const res = await search_followers(CurrentMongodbUserID,value,community_list_page);
                if(res.data.statusCode == 200){
                    var data = JSON.parse(res.data.body);
                    setFollowingFollowersUserList(data.followers_search);
                }
            }else{
                const res = await search_following(CurrentMongodbUserID,value,community_list_page);
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

    async function get_user_prompts(mongodb_userid){
        try {
            const res = await fetching_prompts_of_any_userid(mongodb_userid,localStorage.getItem('mongodb_userid'),search_algo_type,'0');
            if(res.status == 200){
                if(res.data.statusCode == 200){
                    var data = JSON.parse(res.data.body);
                    if(data.user_prompts){
                        setUserPrompts(data.user_prompts);
                    }
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
    async function UserRecentPromptActive(event){
        prompt_list_page = 1;
        search_algo_type ='recent';
        await get_user_prompts(CurrentMongodbUserID);
        event.preventDefault();

    }
    async function UserPopularPromptActive(event){
        prompt_list_page = 1;
        search_algo_type = 'popular';
        await get_user_prompts(CurrentMongodbUserID);
        event.preventDefault();
    }

    async function GetDefaultFollowStatus(mongodb_userid){
        try {
            const res = await check_if_subscribed(mongodb_userid,localStorage.getItem('mongodb_userid'));
            if(res.status == 200){
                if(res.data.statusCode){
                    if(res.data.statusCode == 200){
                        var data = JSON.parse(res.data.body);
                        if(data.status_info){
                            if(data.status_info.isSubscribed){
                                setFollowStatus(data.status_info.isSubscribed)
                            }
                        }
                    }else{
                        handleExceptionError(JSON.parse(res.data.body));
                    }
                }
            }else{
                handleExceptionError({message : res.errorMessage});
            }
        } catch (error) {
            handleExceptionError(error);
            return null;
        }
    }

    async function ChangeBannerImage(file){}

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
                search_algo_type = 'recent';
                await get_user_prompts(mongodb_userid);
                await GetDefaultFollowStatus(mongodb_userid);
                const res2 = await fetch_user_banner(mongodb_userid);
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
            return null;
        }
    }

    async function fetchMoreCommunity(){
        try {
            community_list_page++;
            if(FollowingFollowerSearchAlgo != ''){
                if(ActivityFollowingFollowers == 'followers'){
                    const res = await search_followers(CurrentMongodbUserID,FollowingFollowerSearchAlgo,community_list_page);
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
                    const res = await search_following(CurrentMongodbUserID,FollowingFollowerSearchAlgo,community_list_page);
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
                    const res = await followers_list(CurrentMongodbUserID,community_list_page);
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
                    const res = await following_list(CurrentMongodbUserID,community_list_page);
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
            <Header userprofileimage="" notificationshow={true} />
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
                            <div className="row py-4 align-items-center">
                                <div className="col-lg-8 col-md-8">
                                    <div className="prompt-filter-left">
                                        <Link to={`/${CurrentMongodbUserID}`} onClick={UserRecentPromptActive.bind(this)} className={search_algo_type == 'recent' ? "action_btn active btn_bg_darkblue" : "action_btn btn_bg_darkblue"} ><img src="../assets/img/Activity.svg" alt="" /> Recent</Link>
                                        <Link to={`/${CurrentMongodbUserID}`} onClick={UserPopularPromptActive.bind(this)} className={search_algo_type == 'popular' ? "action_btn active btn_bg_pink" : "action_btn btn_bg_pink"} ><img src="../assets/img/badge.svg" alt="" /> Popular</Link>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                {UserPrompts.map((item, index) => (
                                    <PromptGrid PublicPrompt={item} key={index} UserImage={UserImage} adding_favourite_prompt2={adding_favourite_prompt2} />
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
                            fetchMoreCommunity={fetchMoreCommunity}
                        /> : ''}
                    <Footer />
                </InfiniteScroll>
            </main>
        </>
    );
};

export default Channel;