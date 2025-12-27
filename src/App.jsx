import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './Layout.jsx';
import AddSenior from './pages/AddSenior.jsx';
import Home from './pages/Home.jsx';
import Interview from './pages/Interview.jsx';
import PromptCards from './pages/PromptCards.jsx';
import SeniorProfile from './pages/SeniorProfile.jsx';
import Seniors from './pages/Seniors.jsx';
import Stories from './pages/Stories.jsx';
import StoryDetail from './pages/StoryDetail.jsx';
import Training from './pages/Training.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/addsenior" element={<Layout><AddSenior /></Layout>} />
      <Route path="/home" element={<Layout><Home /></Layout>} />
      <Route path="/interview" element={<Layout><Interview /></Layout>} />
      <Route path="/promptcards" element={<Layout><PromptCards /></Layout>} />
      <Route path="/seniorprofile" element={<Layout><SeniorProfile /></Layout>} />
      <Route path="/seniors" element={<Layout><Seniors /></Layout>} />
      <Route path="/stories" element={<Layout><Stories /></Layout>} />
      <Route path="/storydetail" element={<Layout><StoryDetail /></Layout>} />
      <Route path="/training" element={<Layout><Training /></Layout>} />
    </Routes>
  );
}

export default App;