// ErrorSnackbar.js
import React, { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ErrorSnackbar({ errorMessages, onClearErrors }) {
    useEffect(() => {
        if (errorMessages.length > 0) {
            errorMessages.forEach(errorMessage => {
                const toastId = toast.error(errorMessage.message, {
                    autoClose: false,
                });

                setTimeout(() => {
                    onClearErrors(errorMessage.id);
                    toast.dismiss(toastId);
                }, 2000);
            });
        }
    }, [errorMessages, onClearErrors]);

    return <ToastContainer position="bottom-right" />;
}
export default ErrorSnackbar;
