import React from 'react';
import Auth from "../utils/auth";
import {Link, useLocation} from 'react-router-dom';
import {config} from '../utils/config';
import XPBar from './XPBar';

function DashNav() {
  function showNavigation() {
      return (
        <div className="my-auto flex">
        <div className="text-xl mx-1 z-10">
          <Link to="/dashboard">Dashboard</Link>
        </div>
        <div className="text-xl mx-1 z-10">
          <Link onClick={() => Auth.logout()} to="/">Logout</Link>
        </div>
      </div>
      );
  }


  return (
    <header className="flex-row px-1" style={{justifyContent: 'space-between'}}>
      <h1 className='text-4xl text-customGrey py-5 pl-20'>
        <Link to="/">{config.siteName}</Link>
      </h1>
      {showNavigation()}
      {/* <span style={{color: 'white'}} >UserIcon</span> */}
    </header>
  );
}

export default DashNav;
