import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ Component, loggedIn, ...props }) => {
    // console.log("LOGGED IN: ", loggedIn);
    return loggedIn
        ? (<Component { ...props } />)
        : (<Navigate to="/sign-in" />);
};

export default ProtectedRoute;