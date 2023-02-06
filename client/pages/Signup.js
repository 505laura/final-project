import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {useMutation} from '@apollo/client';
import Auth from '../utils/auth';
import {ADD_USER} from '../utils/mutations';

function Signup() {
  const [formState, setFormState] = useState({
    email: '',
    password: '',
    username: '',
  });
  const [addUser] = useMutation(ADD_USER);

  const handleFormSubmit = async (event) => {
    // TODO: Check all values exist
    event.preventDefault();
    if (!formState.email || !formState.password || !formState.username) {
      console.log('Missing values');
      return;
    }
    const mutationResponse = await addUser({
      variables: {
        email: formState.email,
        password: formState.password,
        username: formState.username || 'Daniel',
      },
    }).catch((e) => {
      return {error: e};
    });
    if (mutationResponse.error) {
      if (mutationResponse.error.name === 'ApolloError') {
        const firstMessage = mutationResponse.error.graphQLErrors[0].message;
        if (firstMessage.includes('password:')) {
          const pwError = firstMessage.replace(/.*password:/, '');
          const errors = pwError.split('|').map((e) => e.trim());
          console.log(errors);
          // TODO: Show errors to user
          return;
        }
        console.log(mutationResponse.error.graphQLErrors[0].message);
        return;
      }
      console.log(JSON.stringify(mutationResponse.error));
      return;
    }
    const token = mutationResponse.data.addUser.token;
    Auth.login(token);
  };

  const handleChange = (event) => {
    const {name, value} = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  return (
    <section className="py-24">
      <div className="container px-4 mx-auto">
        <div className="max-w-sm mx-auto text-center">
          <h2 className="text-4xl font-heading mb-2">Sign Up</h2>
          <p className="leading-8 mb-6">Join our community and start your journey!</p>
          <form className="text-left" onSubmit={handleFormSubmit}>
            <label className="block mb-6">
              <span className="text-sm">Username</span>
              <input className="mt-2 w-full py-3 px-4 border border-gray-200 outline-none" name="username" id="username" type="username" onChange={handleChange} placeholder="Your username" />
            </label>
            <label className="block mb-6">
              <span className="text-sm">E-mail</span>
              <input className="mt-2 w-full py-3 px-4 border border-gray-200 outline-none" name="email" id="email" type="email" onChange={handleChange} placeholder="Your email address" />
            </label>
            <label className="block mb-2">
              <span className="text-sm">Password</span>
              <input className="mt-2 w-full py-3 px-4 border border-gray-200 outline-none" name="password" id="pwd" type="password" onChange={handleChange} placeholder="Your password" />
            </label>
            <span className="text-xs">Must be at least 8 characters.</span>
            <button type="submit" className="inline-block mt-6 mb-4 w-full px-8 py-3 text-center text-white font-bold bg-black hover:bg-gray-900" href="#">
              Sign Up
            </button>
            <p className="text-xs text-center">
              <span>Already have an account? </span>
              <Link to="/login" className="text-blue-500 hover:underline">Sign In</Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Signup;
