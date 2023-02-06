import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';
import { LOGIN } from '../utils/mutations';
import Auth from '../utils/auth';

function Login() {
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [login] = useMutation(LOGIN);

  const handleFormSubmit = async (event) => {
    console.log(event);
    event.preventDefault();
    try {
      const mutationResponse = await login({
        variables: { email: formState.email, password: formState.password },
      });
      const token = mutationResponse.data.login.token;
      Auth.login(token);
    } catch (e) {
      console.log(e);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  return (
    <section className="py-24">
       <div className="container px-4 mx-auto">
         <div className="max-w-sm mx-auto text-center">
           <h2 className="text-4xl font-heading mb-2">Log in to your account</h2>
           <p className="leading-8 mb-6">Please enter your details to proceed.</p>
           <form className="text-left" onSubmit={handleFormSubmit}>
             <label className="block mb-6">
               <span className="text-sm">Email</span>
               <input className="mt-2 w-full py-3 px-4 border border-gray-200 outline-none" name="email" id="email" type="email" onChange={handleChange} placeholder="Your email address" />
             </label>
             <label className="block mb-6">
               <span className="text-sm">Password</span>
               <input className="mt-2 w-full py-3 px-4 border border-gray-200 outline-none" name="password" id="password" type="password" onChange={handleChange} placeholder="Your password" />
             </label>
             <button type='submit' className="inline-block mb-4 w-full px-8 py-3 text-center text-white font-bold bg-black hover:bg-gray-900" href="#">
               Sign In
             </button>
             <p className="text-xs text-center">
               <span>Don’t have an account? </span>
               <Link to="/signup" className="text-blue-500 hover:underline">
                 Sign Up
               </Link>
             </p>
           </form>
         </div>
       </div>
     </section>
  );
}

export default Login;
