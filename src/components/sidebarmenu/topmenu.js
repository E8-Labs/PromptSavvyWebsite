import React from 'react';
import { Link } from 'react-router-dom';
const TopMenu = () => {
    return (
        <>
            <div className="sidebar_menu">
                <ul>
                    <li><Link to="/"><img src="../assets/img/Category.svg" alt="" />Dashboard</Link></li>
                    <li><Link target="_blank" to="https://chat.openai.com/"><img src="../assets/img/chatgpt.svg" alt="" />ChatGPT</Link></li>
                </ul>
            </div>
        </>
    );
};

export default TopMenu;
