import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { setAuthorization } from "../helpers/api_helper";
import { useDispatch } from "react-redux";

import { useProfile } from "../Components/Hooks/UserHooks";

import { logoutUser } from "../slices/auth/login/thunk";

const AuthProtected = (props: any) => {
  const dispatch: any = useDispatch();
  const { userProfile, loading, token } = useProfile();

  useEffect(() => {
    if (userProfile && !loading && token) {
      setAuthorization(token);
    } else if (!userProfile && loading && !token) {
      dispatch(logoutUser());
    }
  }, [token, userProfile, loading, dispatch]);

  /*
    Navigate is un-auth access protected routes via url
    */

  if (!userProfile && loading && !token) {
    return (
      <Navigate to={{ pathname: "/login" }} />
    );
  }


  const hasPermission = userProfile.permissions.includes(props.requiredPermission);

  if (userProfile.data.roles[0].slug !== 'admin') {
    if (!hasPermission && (props.requiredPermission !== '')) {
      return <Navigate to="/unauthorized" />;
    }
  }

  const lock = sessionStorage.getItem('lockscreen')

  if (lock === "1") {
    return <Navigate to="/lockscreen" />;
  }


  const twofa = sessionStorage.getItem('twofa')

  if (twofa !== '0') {
    if (userProfile.data.enable2fa == '1') {
      return <Navigate to="/2fa" />;
    }
  }


  return <>{props.children}</>;
};


export default AuthProtected;