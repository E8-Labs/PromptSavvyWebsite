import React from 'react';
import { Link } from 'react-router-dom';
const BottomMenu = () => {
    return (
        <>
            <div className="support_list">
                <ul>
                    <li><Link to="#"><img src="../assets/img/Headphone.svg" alt="" />Customer Support</Link></li>
                    <li><Link to="#"><img src="../assets/img/Community.svg" alt="" />Community Forum</Link></li>
                    <li><Link to="#"><img src="../assets/img/Shield-Tick.svg" alt="" />Privacy Policy</Link></li>
                    <li><Link to="#"><img src="../assets/img/list.svg" alt="" />Terms and condition</Link></li>
                </ul>
            </div>
        </>
    );
};

export default BottomMenu;
