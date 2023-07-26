import React from 'react';
import BottomMenu from '../../components/sidebarmenu/bottomemu';
import TopMenu from '../../components/sidebarmenu/topmenu';

const SideBar1 = () => {
    return (
        <>
            <div className="sidebar_area">

                <TopMenu />
                <BottomMenu />
            </div>
        </>
    );
};

export default SideBar1;
