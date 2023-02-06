import React from "react";
import {Link} from "react-router-dom";

function Footer() {
  return (
    <div className="text-black mt-auto text-center pb-10 relative">
      <button className="pb-2">Donate <Link to='/donate'>here</Link> to support the community :)</button>
      <p>Designed and built by <Link to='https://github.com/505laura'>505laura</Link> &copy;</p>
    </div>
  );
}

export default Footer;
