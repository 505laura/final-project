import React from 'react';
// import Auth from "../../utils/auth";
import {Link, useLocation} from 'react-router-dom';
import {config} from '../utils/config';

function DashNav() {
  const location = useLocation();

  if (location.pathname !== '/dashboard') {
    return <div></div>;
  }

  // if(!Auth.loggedIn()) {
  //   // window.location.assign("/");
  //   return;
  // }

  return (
    <header className="flex-row px-1" style={{justifyContent: 'space-between'}}>
      <h1>
        <Link to="/">{config.siteName}</Link>
      </h1>

      <span style={{color: 'white'}} >UserIcon</span>
    </header>
  );
}

export default DashNav;
