import { BrowserRouter, Routes, Route } from "react-router-dom";
import Channel from '../pages/Channel';
import MyProfile from '../pages/MyProfile';
import Notification from '../pages/Notification';
// import PageNotFound from '../pages/PageNotFound';
function Routers() {
  return (
    <>
            <BrowserRouter>
                <Routes>
                    <Route exact={true} path='/' element={<MyProfile />} ></Route>
                    <Route exact={true} path='/:id' element={<Channel />} ></Route>
                    <Route exact={true} path='/notification' element={<Notification />} ></Route>
                    {/* <Route path="*" component={PageNotFound} /> */}
                    
                </Routes>
            </BrowserRouter>
        </>
  );
}

export default Routers;
