import React from 'react';
import { useNavigate } from 'react-router-dom';

const InstalledExtension = () => {
    const navigate = useNavigate();
    // const [Loginstatus, setLoginstatus] = useState(false);
    async function InstalledExtensionRequest(event){ 
        // setLoginstatus(true);
        localStorage.setItem('mongodb_userid','64931fc8905027b4b0d4fa2e');
        window.location.reload();
        event.preventDefault();
    }
    return (
        <>
            <div style={{display:'block',background:'rgba(0,0,0,0.7)'}}  className="modal SelectPlanModal" id="InstallExtensionModal" tabIndex="-1" aria-labelledby="InstallExtensionModal" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content rounded-none">
                            <div className="row extension_popup">
                                <div className="col-12 col-md-8 col-xl-6 left_side_panel">
                                    <div className="subs_plan-wrap">
                                        <div className="left-content">
                                            <div className="extension-title">
                                                <h5>Install Extension</h5>
                                            </div>
                                            <div className="extension-info">
                                                <p>Share and use the most popular ChatGPT prompts to boost your productivity and get your time back.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-4 col-xl-6">
                                    <div className="subs_plan-wrap">
                                        <div className="right-content">
                                            <div className="extension-logo">
                                                <img src="assets/img/AI-LG.png" alt="" />
                                                <span>Install PromptSavvy.ai</span>
                                            </div>
                                            <div className="extension-info">
                                                <p>As the community grows, we’ll be hosting seminars in major cities to bring the AI community of prompt engineers together.</p>
                                            </div>
                                            <div className="extension-title">
                                                <span style={{cursor:'pointer'}} onClick={InstalledExtensionRequest.bind(this)}>Install Extension</span>
                                            </div>
                                            <div className="extension-info">
                                                <h4 style={{cursor:'pointer'}}>Not now</h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button className="close-btn" data-bs-dismiss="modal" id="model_popup_open"><img src="assets/img/Close.svg" alt="" /></button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default InstalledExtension;
