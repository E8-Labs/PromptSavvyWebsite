
import axios from 'axios';

export const fetch_user_profile_information = async (id) => {
    try {
        let data = JSON.stringify({
            "body": {
                "type": "fetch_user_profile_information",
                "id": id // mongodb_user_id
            }
        });
        const response = await axios.post(process.env.REACT_APP_API_BASEURL, data);
        return response;
    } catch (error) {
        return error;
    }
};
export const fetch_prompts_data = async (id, page) => {
    try {
        let data = JSON.stringify({
            "body": {
                "type": "fetch_public_prompts_of_all_users & logged_in_user_private_prompts",
                "id": id, // mongodb_user_id
                "page": page
            }
        });
        const response = await axios.post(process.env.REACT_APP_API_BASEURL, data);
        return response;
    } catch (error) {
        return error;
    }
};
export const fetching_prompts_of_any_userid = async (id, loggedIn_uId,search_algo, page) => {
    try {
        let data = JSON.stringify({
            "body": {
                "type": "fetching_prompts_of_any_userid",
                "id": id, // mongodb_user_id,
                "loggedIn_uId": loggedIn_uId, // loggedIn_uId
                "search_algo": search_algo, // "popular/recent"
                "limit" : process.env.REACT_APP_PER_PAGE_RECORD,
                "page" : page
            }
        });
        const response = await axios.post(process.env.REACT_APP_API_BASEURL, data);
        return response;
    } catch (error) {
        return error;
    }
};
export const subscribing_a_user = async (uId, sId) => {
    try {
        let data = JSON.stringify({
            "body": {
                "type": "subscribing_a_user",
                "uId": uId, // loggedin_mongodb_user_id
                "sId": sId // user_to_subscribe_mongodb_user_id
            }
        });
        const response = await axios.post(process.env.REACT_APP_API_BASEURL, data);
        return response;
    } catch (error) {
        return error;
    }
};
export const unsubscribing_a_user = async (uId, sId) => {
    try {
        let data = JSON.stringify({
            "body": {
                "type": "unsubscribing_a_user",
                "uId": uId, // loggedin_mongodb_user_id
                "sId": sId // user_to_unsubscribe_mongodb_user_id
            }
        });
        const response = await axios.post(process.env.REACT_APP_API_BASEURL, data);
        return response;
    } catch (error) {
        return error;
    }
};
export const following_list = async (id, page) => {
    try {
        let data = JSON.stringify({
            "body": {
                "type": "following_list",
                "id": id, // mongodb_user_id
                "limit" : process.env.REACT_APP_PER_PAGE_RECORD,
                "page":page
            }
        });
        const response = await axios.post(process.env.REACT_APP_API_BASEURL, data);
        return response;
    } catch (error) {
        return error;
    }
};

export const followers_list = async (id, page) => {
    try {
        let data = JSON.stringify({
            "body": {
                "type": "followers_list",
                "id": id, // mongodb_user_id
                "limit" : process.env.REACT_APP_PER_PAGE_RECORD,
                "page":page
            }
        });
        const response = await axios.post(process.env.REACT_APP_API_BASEURL, data);
        return response;
    } catch (error) {
        return error;
    }
};

export const search_following = async (id, search_by_username ,page) => {
    try {
        let data = JSON.stringify({
            "body": {
                "type": "search_following",
                "id": id, // mongodb_user_id
                "search_by_username" : search_by_username,
                "limit" : process.env.REACT_APP_PER_PAGE_RECORD,
                "page":page
            }
        });
        const response = await axios.post(process.env.REACT_APP_API_BASEURL, data);
        return response;
    } catch (error) {
        return error;
    }
};

export const search_followers = async (id, search_by_username ,page) => {
    try {
        let data = JSON.stringify({
            "body": {
                "type": "search_followers",
                "id": id, // mongodb_user_id
                "search_by_username" : search_by_username,
                "limit" : process.env.REACT_APP_PER_PAGE_RECORD,
                "page":page
            }
        });
        const response = await axios.post(process.env.REACT_APP_API_BASEURL, data);
        return response;
    } catch (error) {
        return error;
    }
};

export const adding_favourite_prompt = async (uId, pId) => {
    try {
        let data = JSON.stringify({
            "body": {
                "type": "adding_favourite_prompt",
                "uId":uId, // "mongodbuserId of logged in user",
                "pId":pId // "mongodbPromptId of the prompt to save"
            }
        });
        const response = await axios.post(process.env.REACT_APP_API_BASEURL, data);
        return response;
    } catch (error) {
        return error;
    }
};

export const deleting_favourite_prompt = async (uId, pId) => {
    try {
        let data = JSON.stringify({
            "body": {
                "type": "deleting_favourite_prompt",
                "uId":uId, // "mongodbuserId of logged in user",
                "pId":pId // "mongodbPromptId of the prompt to save"
            }
        });
        const response = await axios.post(process.env.REACT_APP_API_BASEURL, data);
        return response;
    } catch (error) {
        return error;
    }
};

export const editing_user_profile_information = async (id, email,username,image,insta_link,yt_link,web_url) => {
    try {
        let data = JSON.stringify({
            "body": {
                "type": "editing_user_profile_information",
                "id":id,// "mongodb_userid",
                "email":email, 
                "username":username,
                "image":image,
                "insta_link":insta_link,
                "yt_link":yt_link,
                "web_url":web_url
            }
        });
        const response = await axios.post(process.env.REACT_APP_API_BASEURL, data);
        return response;
    } catch (error) {
        return error;
    }
};


export const check_if_subscribed = async (id, loggedIn_uId) => {
    try {
        let data = JSON.stringify({
            "body": {
                "type": "check_if_subscribed",
                "id":id,
                "loggedIn_uId":loggedIn_uId
            }
        });
        const response = await axios.post(process.env.REACT_APP_API_BASEURL, data);
        return response;
    } catch (error) {
        return error;
    }
};

export const fetch_loggedin_user_notifications = async (id, page) => {
    try {
        let data = JSON.stringify({
            "body": {
                "type": "fetch_loggedin_user_notifications",
                "id":id,
                "limit" : process.env.REACT_APP_PER_PAGE_RECORD,
                "page":page
            }
        });
        const response = await axios.post(process.env.REACT_APP_API_BASEURL, data);
        return response;
    } catch (error) {
        return error;
    }
};
export const adding_user_to_wishlist = async (email) => {
    try {
        let data = JSON.stringify({
            "body": {
                "type": "adding_user_to_wishlist",
                "email":email
            }
        });
        const response = await axios.post(process.env.REACT_APP_API_BASEURL, data);
        return response;
    } catch (error) {
        return error;
    }
};

export const fetch_user_banner = async (uId) => {
    try {
        let data = JSON.stringify({
            "body": {
                "type": "fetch_user_banner",
                "uId":uId
            }
        });
        const response = await axios.post(process.env.REACT_APP_API_BASEURL, data);
        return response;
    } catch (error) {
        return error;
    }
};

export const upload_user_banner = async (uId,banner_img) => {
    try {
        let data = JSON.stringify({
            "body": {
                "type": "upload_user_banner",
                "uId" : uId,
                "banner_img":banner_img
            }
        });
        const response = await axios.post(process.env.REACT_APP_API_BASEURL, data);
        return response;
    } catch (error) {
        return error;
    }
};

export const logging_out = async (id) => {
    try {
        let data = JSON.stringify({
            "body": {
                "type": "logging_out",
                "id" : id
            }
        });
        const response = await axios.post(process.env.REACT_APP_API_BASEURL, data);
        return response;
    } catch (error) {
        return error;
    }
};

export const seen_notification = async (id) => {
    try {
        let data = JSON.stringify({
            "body": {
                "type": "reading_a_notification",
                "id" : id
            }
        });
        const response = await axios.post(process.env.REACT_APP_API_BASEURL, data);
        return response;
    } catch (error) {
        return error;
    }
};

export const fetch_all_loggedin_user_notifications = async (id, page) => {
    try {
        let data = JSON.stringify({
            "body": {
                "type": "fetch_all_loggedin_user_notifications",
                "id":id,
                "limit" : process.env.REACT_APP_PER_PAGE_RECORD,
                "page":page
            }
        });
        const response = await axios.post(process.env.REACT_APP_API_BASEURL, data);
        return response;
    } catch (error) {
        return error;
    }
};