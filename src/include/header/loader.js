import React from 'react';

const Loader = () => {
  return (
    <div className="loaderpage" style={{ position: 'fixed', width: '100vw', height: '100vh', background: 'rgba(0, 0, 0, 1)', zIndex: '9999',textAlign:'center'}}>
      <img src="../assets/img/Infinity.gif" style={{top:'40vh',position:'relative',width:'80px'}} />
    </div>
  );
};

export default Loader;
