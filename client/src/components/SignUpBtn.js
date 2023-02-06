import React from "react";

function SignupBtn() {
  return (
<button onClick={() => window.location.assign('/signup')} class="minecraft-btn mx-auto w-64 text-center text-white truncate p-1 border-2 border-b-4 hover:text-yellow-200">
    Sign Up
</button>
  );
}

export default SignupBtn;
