import React, { useState } from 'react';
import InfiniteScroll from "react-infinite-scroll-component";
import { Link } from 'react-router-dom';

const CommunityList = (props) => {

    console.log('props.FollowingFollowersUserList', props.FollowingFollowersUserList);

    const [SearchValue, setSearchValue] = useState('');
    function CloseCommunity(event) {
        props.CloseCommunity();
        event.preventDefault();
    }
    function FollowersActivity(event) {
        setSearchValue('');
        props.ActivityFollowingFollowersChange('followers');
        event.preventDefault();
    }
    function FollowingActivity(event) {
        setSearchValue('');
        props.ActivityFollowingFollowersChange('following');
        event.preventDefault();
    }
    function FollowingFollowersSearch(event) {
        props.FollowingFollowersSearch(SearchValue);
        event.preventDefault();
    }
    function fetchMoreCommunity() {
        props.fetchMoreCommunity();
    }

    return (
        <>
            <div style={{ minHeight: '100vh', height: '100vh', overflow: "auto" }} >
                <div style={{ transform: 'none', visibility: 'visible' }} className="offcanvas offcanvas-end" tabIndex={-1} id="offcanvasRight" aria-labelledby="offcanvasRightLabel" >
                    <div className="offcanvas-header">
                        <div className="offcanvas-label">
                            <h5 id="offcanvasRightLabel" className="mb-0">My Community</h5>
                        </div>
                        <div className="offcanvas-close" onClick={CloseCommunity.bind(this)} >
                            <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close" />
                        </div>
                    </div>

                    <div className="offcanvas-body p-0" id="scrollableDiv2">
                        <InfiniteScroll
                            dataLength={props.FollowingFollowersUserList.length}
                            next={fetchMoreCommunity.bind(this)}
                            hasMore={true}
                            loader={''}
                            scrollableTarget="scrollableDiv2"
                        >
                            <div className="wrapper d-flex h-100" >
                                <aside className="sidebar h-100">
                                    <div className="sidebar-section sidebar-profile pt-0 pb-4">
                                        <div className="profile-picture">
                                            <span className="profile-alert" />
                                            <div className="profile-details text-center mt-2 d-flex">
                                                <Link href="" onClick={FollowersActivity.bind(this)} className={props.ActivityFollowingFollowers == 'followers' ? "action_btn green btn_bg_lightgreen" : "action_btn btn_bg_following"}>
                                                    <img src="../assets/img/Profile.svg" alt="" />
                                                    Followers
                                                </Link>
                                                <Link href="" onClick={FollowingActivity.bind(this)} className={props.ActivityFollowingFollowers == 'following' ? "action_btn blue btn_bg_lightgreen" : "action_btn btn_bg_following"}>
                                                    <img src="../assets/img/Profile-Accepted.svg" alt="" />
                                                    Following
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="sidebar-section sidebar-menu p-0">
                                        <ul className="nav nav-tabs nav-fill" id="nav-tab" role="tablist" >
                                            <li className="nav-item">
                                                <div className="d-flex justify-content-center">
                                                    <div className="search">
                                                        <input type="text" className="search-input" placeholder="Quick Search" name="Quick Search" onChange={e => setSearchValue(e.target.value)} value={SearchValue} />
                                                        <Link to="" onClick={FollowingFollowersSearch.bind(this)} className="search-icon">
                                                            <i className="fal fa-search"></i>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                        <div className="tab-content" id="myTabContent">
                                            <div className="tab-pane fade show active pt-3 pb-2" id="menu" role="tabpanel" aria-labelledby="menu-tab" >
                                                <ul>
                                                    {props.FollowingFollowersUserList.length > 0 ? (
                                                        props.FollowingFollowersUserList.map((item, index) => (
                                                            <li key={index}>
                                                                {localStorage.getItem('mongodb_userid') == item._id ?
                                                                    <Link to={`/`} className="d-flex align-items-center">
                                                                        {item.image ?
                                                                            <img src={item.image} alt="" style={{ borderRadius: '50%' }} />
                                                                            :
                                                                            <img src="../assets/img/profile-pic.png" alt="" style={{ borderRadius: '50%' }} />
                                                                        }
                                                                        <div className="menu-text flex-fill">
                                                                            <div>@{item.username}</div>
                                                                        </div>
                                                                        <button className="visit_profile" data-bs-toggle="modal" data-bs-target="#SelectPlanModal" data-bs-dismiss="modal">
                                                                            Visit Profile
                                                                        </button>
                                                                    </Link>
                                                                    :
                                                                    <Link target="_blank" to={`/${item._id}`} className="d-flex align-items-center">
                                                                        {item.image ?
                                                                            <img src={item.image} alt="" style={{ borderRadius: '50%' }} />
                                                                            :
                                                                            <img src="../assets/img/profile-pic.png" alt="" style={{ borderRadius: '50%' }} />
                                                                        }
                                                                        <div className="menu-text flex-fill">
                                                                            <div>@{item.username}</div>
                                                                        </div>
                                                                        <button className="visit_profile" data-bs-toggle="modal" data-bs-target="#SelectPlanModal" data-bs-dismiss="modal">
                                                                            Visit Profile
                                                                        </button>
                                                                    </Link>
                                                                }
                                                            </li>
                                                        ))
                                                    ) : (
                                                        <li>Search result not found</li>
                                                    )}

                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </aside>
                            </div>
                        </InfiniteScroll>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CommunityList;
