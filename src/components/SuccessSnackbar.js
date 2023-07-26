// SuccessSnackbar.js

import React, { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SuccessSnackbar({ successMessages, onclearSuccess  }) {
    console.log('successMessages',successMessages)
  useEffect(() => {
    if (successMessages.length > 0) {
        successMessages.forEach(successMessage => {
            const toastId = toast.success(successMessage.message, {
                autoClose: false,
                className: 'custom-toast', // Custom class for styling
                closeButton: false, // Hide the close button
                progressClassName: 'green-progress', // Custom progress bar color
                toastId: successMessage.id, // Set toastId to handle onToastClose event
                icon: <img src={'/assets/img/check.png'} alt="success icon" />, // Custom green icon for success messages
            });

            setTimeout(() => {
                onclearSuccess(successMessage.id);
                toast.dismiss(toastId);
            }, 2000);
        });
    }
  }, [successMessages, onclearSuccess ]);

  return <ToastContainer position="bottom-right" />;
}
export default SuccessSnackbar;
