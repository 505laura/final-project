import React, {useEffect} from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {ApolloProvider} from '@apollo/client';
import {ChakraProvider} from '@chakra-ui/react';

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import NoMatch from './pages/NoMatch';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Nav from './components/Nav';
import DashNav from './components/DashNav';
import Footer from './components/Footer';

import {UserContext} from './utils/userContext';

import {client} from './utils/gqlClient';
import {config} from './utils/config';

function App() {
  const [xp, setXP] = React.useState(0);
  const [level, setLevel] = React.useState(1);
  const [coins, setCoins] = React.useState(0);

  // Set document title to full name on page load
  useEffect(() => {
    document.title = config.siteName;
  }, []);

  return (
    <ChakraProvider>
      <ApolloProvider client={client}>
        <Router>
          <div className="min-h-screen flex flex-col w-screen bg-customWhite text-center z-0">
            <UserContext.Provider value={{xp, level, coins, setXP, setLevel, setCoins}}>
              <Nav />
              {/* <DashNav /> */}
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="*" element={<NoMatch />} />
              </Routes>
              <Footer />
            </UserContext.Provider>
          </div>
        </Router>
      </ApolloProvider>
    </ChakraProvider>
  );
}

export default App;
