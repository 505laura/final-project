import React from 'react';
import Auth from '../utils/auth';
import {Link} from 'react-router-dom';
import {config} from '../utils/config';

function Nav() {
  function showNavigation() {
    if (Auth.loggedIn()) {
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
    } else {
      return (
        <div className="my-auto">
          <div className="text-xl mx-1 z-10">
            <Link to="/login">Login</Link>
          </div>
        </div>
      );
    }
  }

  return (
    <header className="w-screen flex h-20 bg-transparent items-center justify-center text-gray-500">
       <nav className="2xl:w-1/2 xl:w-1/3 lg:w-1/2 sm:w-2/3 px-11 mx-auto flex space-between text-gray-400">
       <Link to="/"><h1 className="text-4xl">{config.siteName}</h1></Link>
         {showNavigation()}
       </nav>
     </header>
  );
}

export default Nav;

// function Nav() {
//   function showNavigation() {
//     if (Auth.loggedIn()) {
//       return (
//         <ul className="flex-row">
//           <li className="mx-1 text-xl">
//             {/* this is not using the Link component to logout or user and then refresh the application to the start */}
//             <a href="/" onClick={() => Auth.logout()}>
//               Logout
//             </a>
//           </li>
//         </ul>
//       );
//     } else {
//       return (
//         <div className="my-auto">
//           <div className="text-xl mx-1 z-10">
//             <Link to="/login">Login</Link>
//           </div>
//         </div>
//       );
//     }
//   }

//   return (
//     <header className="w-screen flex h-20 bg-transparent items-center justify-center text-gray-500">
//       <nav className="2xl:w-1/2 xl:w-1/3 lg:w-1/2 sm:w-2/3 px-11 mx-auto flex space-between text-gray-400">
//       <Link to="/"><h1 className="text-4xl">{config.siteName}</h1></Link>
//         {showNavigation()}
//       </nav>
//     </header>
//   );
// }

// export default Nav;
