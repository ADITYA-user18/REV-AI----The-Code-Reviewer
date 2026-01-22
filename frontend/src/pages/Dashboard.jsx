import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaGithub, FaRobot, FaCheck, FaArrowLeft, FaArrowRight, FaSearch, FaExclamationTriangle, FaBell, FaCheckCircle, FaRocket, FaShieldAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  
  // Data States
  const [repos, setRepos] = useState([]);
  const [alerts, setAlerts] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  // UI States
  const [activeRepo, setActiveRepo] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('active'); 

  const reposPerPage = 15;
  const API_URL = import.meta.env.VITE_API_URL;
  const alertsRef = useRef([]);

  useEffect(() => {
    if (user) {
      fetchRepos();
      fetchAlerts(); 
      const intervalId = setInterval(fetchAlerts, 5000); 
      return () => clearInterval(intervalId);
    }
  }, [user]);

  const fetchRepos = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/repos/list?userId=${user._id}`);
      setRepos(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Repo Fetch Error:', error);
      setLoading(false);
    }
  };

  const fetchAlerts = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/alerts?userId=${user._id}`);
      const allAlerts = res.data;
      
      // Toast Logic for NEW alerts
      if (allAlerts.length > alertsRef.current.length && alertsRef.current.length > 0) {
        const latest = allAlerts[0];
        // Safely check status using Optional Chaining (?.)
        const isSafe = latest.aiJson?.status === 'safe';
        
        toast.custom((t) => (
          <div className={`p-4 rounded-lg shadow-lg border-l-4 ${isSafe ? 'bg-gray-900 border-neon-green' : 'bg-gray-900 border-danger'} text-white`}>
            <div className="flex items-center gap-3">
               <div className={`text-2xl ${isSafe ? 'text-neon-green' : 'text-danger'}`}>
                  {isSafe ? <FaCheckCircle /> : <FaExclamationTriangle />}
               </div>
               <div>
                  <h4 className="font-bold">{isSafe ? 'Analysis Passed' : 'Issues Detected'}</h4>
                  <p className="text-sm text-gray-400">{latest.repoName}</p>
               </div>
            </div>
          </div>
        ), { duration: 5000 });
      }

      setAlerts(allAlerts);
      alertsRef.current = allAlerts;
    } catch (error) {
      console.error('Alert Fetch Error:', error);
    }
  };

  const handleResolveAlert = async (alertId) => {
    try {
      const updatedAlerts = alerts.map(a => a._id === alertId ? { ...a, status: 'read' } : a);
      setAlerts(updatedAlerts);
      await axios.patch(`${API_URL}/api/alerts/${alertId}/read`);
      toast.success('Archived to history');
    } catch (error) {
      fetchAlerts();
      toast.error('Failed to update status');
    }
  };

  const handleTrackRepo = async (repo) => {
    try {
      setActiveRepo(repo.id);
      const loadingToast = toast.loading(`Connecting AI to ${repo.name}...`);
      await axios.post(`${API_URL}/api/repos/webhook`, {
        userId: user._id,
        owner: repo.owner.login,
        repo: repo.name
      });
      toast.dismiss(loadingToast);
      toast.success(`Success! Agent is watching ${repo.name}`);
      setActiveRepo(null);
    } catch (error) {
      toast.error('Failed to track repository.');
      setActiveRepo(null);
    }
  };

  // --- SAFE RENDER HELPERS (Prevents Crashing on Old Data) ---

  const renderSafeCard = (alert) => (
    <div key={alert._id} className="p-5 border-b border-gray-800 bg-neon-green/5 hover:bg-neon-green/10 transition flex gap-4 animate-fade-in">
      <div className="mt-1 text-2xl text-neon-green"> <FaShieldAlt /> </div>
      <div className="flex-1">
        <div className="flex justify-between items-start mb-2">
           <h3 className="font-bold text-white text-md flex items-center gap-2">
              {alert.repoName}
              <span className="text-[10px] bg-neon-green text-black font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">PASSED</span>
           </h3>
           <button onClick={() => handleResolveAlert(alert._id)} className="text-gray-500 hover:text-white text-xs underline">Dismiss</button>
        </div>
        <p className="text-gray-300 text-sm mb-3">
           {alert.aiJson?.summary || "Code looks clean."}
        </p>
        <div className="bg-gray-900/50 p-3 rounded-lg border border-neon-green/30 flex items-center gap-3">
           <FaRocket className="text-neon-green text-xl" />
           <div>
              <p className="text-white text-sm font-bold">Safe to Deploy</p>
              <p className="text-xs text-gray-500">No security risks or logic errors found.</p>
           </div>
        </div>
      </div>
    </div>
  );

  const renderRiskCard = (alert) => (
    <div key={alert._id} className="p-5 border-b border-gray-800 hover:bg-gray-800/30 transition flex gap-4">
      <div className="mt-1 text-xl text-danger animate-pulse"> <FaExclamationTriangle /> </div>
      <div className="flex-1">
        <div className="flex justify-between items-start mb-2">
           <div>
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                 {alert.repoName}
                 <span className="text-[10px] bg-danger/20 text-danger border border-danger/30 px-1.5 rounded">ACTION REQUIRED</span>
              </h3>
              <span className="text-xs text-gray-500">{new Date(alert.createdAt).toLocaleString()}</span>
           </div>
           {activeTab === 'active' && (
             <button onClick={() => handleResolveAlert(alert._id)} className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 text-gray-300 rounded-lg text-xs hover:bg-neon-purple hover:text-white transition">
               <FaCheck /> Mark Resolved
             </button>
           )}
        </div>

        <p className="text-sm text-white mb-3 font-medium bg-red-900/20 p-2 rounded border border-red-900/50">
           {alert.aiJson?.summary || "Issue detected (Legacy Report)"}
        </p>

        <div className="space-y-2">
           {alert.aiJson?.issues?.map((issue, idx) => (
              <div key={idx} className="text-xs bg-gray-900 p-3 rounded border border-gray-700">
                 <div className="flex justify-between mb-1">
                    <span className="text-neon-blue font-mono">{issue.file} : Line {issue.line}</span>
                    <span className="text-danger font-bold uppercase">{issue.severity}</span>
                 </div>
                 <p className="text-gray-400 mb-1">{issue.description}</p>
                 <p className="text-neon-green">💡 Fix: {issue.fix}</p>
              </div>
           ))}
        </div>
      </div>
    </div>
  );

  // --- UI LOGIC ---
  const activeAlerts = alerts.filter(a => a.status === 'unread');
  const resolvedAlerts = alerts.filter(a => a.status === 'read');

  const filteredRepos = repos.filter(repo => repo.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const indexOfLastRepo = currentPage * reposPerPage;
  const indexOfFirstRepo = indexOfLastRepo - reposPerPage;
  const currentRepos = filteredRepos.slice(indexOfFirstRepo, indexOfLastRepo);
  const totalPages = Math.ceil(filteredRepos.length / reposPerPage);

  const nextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
  const prevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };
  const handleSearch = (e) => { setSearchQuery(e.target.value); setCurrentPage(1); };

  return (
    <div className="min-h-screen bg-github-dark text-gray-300 font-mono">
      <nav className="border-b border-gray-800 bg-github-card px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <FaRobot className="text-neon-purple text-2xl" />
          <h1 className="text-xl font-bold text-white tracking-tight">Rev-AI Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <img src={user?.avatarUrl} alt="User" className="w-8 h-8 rounded-full border border-gray-600" />
            <span className="text-sm font-medium text-white hidden sm:block">{user?.username}</span>
          </div>
          <Link to='/' className="text-xs border border-gray-700 px-3 py-1 rounded hover:bg-gray-800 transition">Logout</Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6">
        
        {/* --- ALERT SECTION --- */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FaBell className="text-neon-purple" /> Agent Reports
              {activeAlerts.length > 0 && <span className="bg-neon-purple text-white text-xs px-2 py-0.5 rounded-full">{activeAlerts.length} New</span>}
            </h2>
            <div className="flex bg-gray-900 p-1 rounded-lg border border-gray-800">
              <button onClick={() => setActiveTab('active')} className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === 'active' ? 'bg-gray-800 text-white' : 'text-gray-500'}`}>Active</button>
              <button onClick={() => setActiveTab('resolved')} className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === 'resolved' ? 'bg-gray-800 text-white' : 'text-gray-500'}`}>Resolved</button>
            </div>
          </div>

          <div className="bg-github-card border border-gray-800 rounded-xl overflow-hidden min-h-[100px]">
            {(activeTab === 'active' ? activeAlerts : resolvedAlerts).length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <FaCheckCircle className="text-4xl text-gray-800 mx-auto mb-2" />
                <p>No reports found.</p>
              </div>
            ) : (
              (activeTab === 'active' ? activeAlerts : resolvedAlerts).map((alert) => {
                 // --- CRASH PREVENTION ---
                 // If aiJson is missing (old data), treat it as 'legacy risk'
                 if (!alert.aiJson) return renderRiskCard({...alert, aiJson: { status: 'risk', summary: 'Legacy Report (No details)' }});
                 
                 const isSafe = alert.aiJson.status === 'safe';
                 return isSafe ? renderSafeCard(alert) : renderRiskCard(alert);
              })
            )}
          </div>
        </div>

        {/* --- REPO SECTION --- */}
        <header className="mb-8 mt-4 flex flex-col md:flex-row justify-between items-end gap-4 border-t border-gray-800 pt-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Your Repositories</h2>
            <p className="text-gray-500 text-sm">Select a project to activate AI code analysis.</p>
          </div>
          <div className="relative w-full md:w-72">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search repositories..." 
              value={searchQuery}
              onChange={handleSearch}
              className="w-full bg-gray-900 border border-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-neon-purple transition-colors placeholder-gray-500"
            />
          </div>
        </header>

        {loading ? (
          <div className="text-center py-20 text-neon-blue animate-pulse">Scanning GitHub Network...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentRepos.map((repo) => (
                <div key={repo.id} className="bg-github-card border border-gray-800 rounded-xl p-5 hover:border-gray-600 transition-all hover:shadow-lg group flex flex-col justify-between h-full">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <FaGithub className="text-xl text-gray-400 flex-shrink-0" />
                        <h3 className="font-bold text-white truncate" title={repo.name}>{repo.name}</h3>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${repo.private ? 'border-yellow-900 text-yellow-500 bg-yellow-900/20' : 'border-gray-700 text-gray-400 bg-gray-800'}`}>
                        {repo.private ? 'Private' : 'Public'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-6 line-clamp-2 h-8">
                      {repo.description || 'No description provided.'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleTrackRepo(repo)}
                    disabled={activeRepo === repo.id}
                    className={`w-full py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 mt-auto
                      ${activeRepo === repo.id ? 'bg-gray-800 text-gray-400' : 'bg-neon-purple hover:bg-purple-600 text-white shadow-lg'}
                    `}
                  >
                    {activeRepo === repo.id ? <>Connecting...</> : <><FaCheck /> Track Repo</>}
                  </button>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-10">
                <button onClick={prevPage} disabled={currentPage === 1} className={`p-2 rounded-lg border border-gray-700 ${currentPage === 1 ? 'text-gray-600' : 'text-white hover:bg-gray-800'}`}><FaArrowLeft /></button>
                <span className="text-gray-400 text-sm">Page <span className="text-white font-bold">{currentPage}</span> of {totalPages}</span>
                <button onClick={nextPage} disabled={currentPage === totalPages} className={`p-2 rounded-lg border border-gray-700 ${currentPage === totalPages ? 'text-gray-600' : 'text-white hover:bg-gray-800'}`}><FaArrowRight /></button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;