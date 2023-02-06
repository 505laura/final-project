import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {ApolloProvider} from '@apollo/client';
import {ChakraProvider} from '@chakra-ui/react';

import Home from './pages/Home';
import NoMatch from './pages/NoMatch';
import Nav from './components/Nav';
import DashNav from './components/DashNav';
import Footer from './components/Footer';

function App() {
  return (
    <ChakraProvider>
      <ApolloProvider client={client}>
        <Router>
          <div className="min-h-screen flex flex-col w-screen bg-customWhite text-center z-0">
            <UserContext.Provider value={{xp, level, coins, setXP, setLevel, setCoins}}>
              <Nav />
              <DashNav />
              <Routes>
                <Route path="/" element={<Home />} />
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
