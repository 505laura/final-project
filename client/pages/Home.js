import React from "react";
import FlowerImg from "../assets/landingpageimg.png";
import FlowerImgFlip from "../assets/landingpageimgflip.png";
import SignupBtn from "../components/SignUpBtn";
import SiteInfo from "../components/SiteInfo";

const Home = () => {
  return (
    <div>
      {/* Make flowers have negative margin when page is small */}
      {/* Make images non draggable */}
      <img src={FlowerImg} alt="flowers" className="fixed top-0 h-full invisible xl:visible" />
      <img src={FlowerImgFlip} alt="flowers" className="right-0 top-0 fixed h-full invisible xl:visible" />
      <div className="flex h-100 w-2/3 mx-auto relative">
        {/* Make flowers touch bottom */}
        <div>
          <h1 className="text-6xl text-customGrey xl:pt-48 pt-20 font-semibold">Create the life you desire.</h1>
          <p className="text-2xl text-gray-700 pt-6 px-10">A cozy, incentive-based dashboard that will help you hold yourself accountable and motivate you to level up different aspects of your life.</p>
          <div className="flex flex-row justify-center flex-wrap">
            <SiteInfo />
            <SiteInfo />
            <SiteInfo />
          </div>
          <div className="xl:pt-32 pt-20">
            <SignupBtn />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
