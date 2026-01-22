import React from "react";
import { Link } from "react-router-dom";
import {
  FaGithub,
  FaRobot,
  FaShieldAlt,
  FaCode,
  FaBug,
  FaBolt,
  FaLinkedin,
} from "react-icons/fa";
import { motion } from "framer-motion";
import Particles from "../components/Particles";
import Shuffle from "../components/Shuffle"; // Import the Shuffle Component

const Home = () => {
  return (
    <div className="relative min-h-screen bg-github-dark font-mono text-gray-300 overflow-x-hidden selection:bg-neon-purple selection:text-white">
      {/* --- 0. BACKGROUND PARTICLES LAYER --- */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
        <Particles
          particleColors={["#8957e5", "#58a6ff", "#ffffff"]}
          particleCount={300}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
          className="w-full h-full"
        />
      </div>

      {/* --- CONTENT LAYER --- */}
      <div className="relative z-10">
        {/* 1. NAVBAR */}
        <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto backdrop-blur-sm">
          <div className="flex items-center gap-2 text-white font-bold text-xl tracking-tighter">
            <FaRobot className="text-neon-purple text-2xl" />
            <span>REV-AI</span>
          </div>
          <div className="flex gap-4">
            <Link
              to="/login"
              className="text-sm font-medium hover:text-white transition flex items-center"
            >
              Sign In
            </Link>
            <Link
              to="/login"
              className="bg-white text-black px-4 py-2 rounded-full text-sm font-bold hover:bg-gray-200 transition shadow-[0_0_15px_rgba(255,255,255,0.3)]"
            >
              Get Started
            </Link>
          </div>
        </nav>

        {/* 2. HERO SECTION */}
        <header className="pt-20 pb-32 px-4 md:px-6 text-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block border border-gray-700 bg-gray-900/80 rounded-full px-4 py-1.5 text-xs text-neon-blue mb-6 backdrop-blur-md shadow-lg">
              🚀 v1.0 is now live for Developers
            </div>

            {/* --- FULL SHUFFLE TEXT INTEGRATION (RESPONSIVE FIX) --- */}
            <h1
              className="
                text-3xl sm:text-5xl md:text-7xl lg:text-8xl 
                font-extrabold
                text-gray-200
                leading-tight md:leading-[1.05]
                tracking-tight
                font-mono
                drop-shadow-xl
                text-center
                space-y-3 md:space-y-2
                w-full
                max-w-[100vw]
                overflow-hidden
              "
            >
              {/* LINE 1 */}
              <div className="flex justify-center flex-wrap md:whitespace-nowrap px-2">
                <Shuffle
                  text="STOP PUSHING BUGS"
                  tag="span"
                  shuffleTimes={3}
                  className="
                    inline-block
                    text-white
                    leading-none
                    text-transparent
                    bg-clip-text
                    bg-gradient-to-r
                    from-neon-purple
                    to-neon-blue
                  "
                />
              </div>

              {/* LINE 2 */}
              <div className="flex justify-center flex-wrap md:whitespace-nowrap px-2">
                <Shuffle
                  text="START SHIPPING"
                  tag="span"
                  shuffleTimes={3}
                  className="inline-block leading-none text-white"
                />
              </div>

              {/* LINE 3 */}
              <div className="flex justify-center flex-wrap md:whitespace-nowrap px-2">
                <Shuffle
                  text="INTELLIGENCE."
                  tag="span"
                  shuffleTimes={6}
                  className="inline-block leading-none text-white break-words"
                />
              </div>
            </h1>

            <p className="text-sm md:text-lg text-gray-400 mb-10 mt-8 max-w-2xl mx-auto bg-github-dark/40 backdrop-blur-sm p-4 rounded-xl border border-white/5">
              Your personal AI Code Reviewer. It watches your GitHub
              repositories, analyzes every push, and catches security risks
              <span className="text-white font-bold"> before</span> deployment.
            </p>

            <Link
              to="/login"
              className="inline-flex items-center gap-3 bg-neon-green hover:bg-green-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-xl font-bold text-md md:text-lg transition-all hover:scale-105 shadow-[0_0_30px_rgba(35,134,54,0.4)]"
            >
              <FaGithub className="text-xl" />
              Connect GitHub Account
            </Link>

            <p className="mt-4 text-xs text-gray-500">
              No credit card required • Open Source
            </p>
          </motion.div>
        </header>

        {/* 3. PROBLEM VS SOLUTION */}
        <section className="py-20 bg-github-card/80 border-y border-gray-800 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            {/* The Nightmare */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold text-white">
                The Deployment <span className="text-danger">Nightmare</span>
              </h2>
              <p className="text-gray-400">
                Developers are human. We get tired. We forget things. One small
                mistake can lead to data leaks or crashed servers.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-gray-300">
                  <FaBug className="text-danger" /> Hardcoded API Keys &
                  Passwords
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <FaBug className="text-danger" /> Infinite Loops & Logic
                  Errors
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <FaBug className="text-danger" /> Poorly structured,
                  unreadable code
                </li>
              </ul>
            </motion.div>

            {/* The Solution */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gray-900/90 border border-gray-700 p-8 rounded-2xl relative shadow-2xl backdrop-blur-xl"
            >
              <div className="absolute -top-6 -right-6 bg-neon-purple p-4 rounded-xl shadow-lg">
                <FaBolt className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                The AI Guardian
              </h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-1 bg-neon-green rounded-full"></div>
                  <div>
                    <h4 className="text-white font-bold">Real-time Analysis</h4>
                    <p className="text-sm text-gray-500">
                      Instant feedback via Gemini AI on every git push.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-1 bg-neon-blue rounded-full"></div>
                  <div>
                    <h4 className="text-white font-bold">Security First</h4>
                    <p className="text-sm text-gray-500">
                      Detects exposed secrets before hackers do.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-1 bg-neon-purple rounded-full"></div>
                  <div>
                    <h4 className="text-white font-bold">Context Aware</h4>
                    <p className="text-sm text-gray-500">
                      Understands your specific codebase context.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 4. HOW IT WORKS */}
        <section className="py-24 px-6 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-16 drop-shadow-md">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-gray-900/60 p-6 rounded-2xl border border-gray-800 hover:border-neon-purple transition group backdrop-blur-sm">
              <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mb-4 text-xl font-bold text-white group-hover:bg-neon-purple transition shadow-lg">
                1
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Connect GitHub
              </h3>
              <p className="text-gray-400 text-sm">
                Sign in and select the repositories you want the agent to
                monitor.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-gray-900/60 p-6 rounded-2xl border border-gray-800 hover:border-neon-blue transition group backdrop-blur-sm">
              <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mb-4 text-xl font-bold text-white group-hover:bg-neon-blue transition shadow-lg">
                2
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Just Push Code
              </h3>
              <p className="text-gray-400 text-sm">
                Work as usual. `git push` triggers the agent automatically in
                the background.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-gray-900/60 p-6 rounded-2xl border border-gray-800 hover:border-neon-green transition group backdrop-blur-sm">
              <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mb-4 text-xl font-bold text-white group-hover:bg-neon-green transition shadow-lg">
                3
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Get Instant Reports
              </h3>
              <p className="text-gray-400 text-sm">
                Receive detailed AI analysis, bug reports, and fix suggestions
                on your dashboard.
              </p>
            </div>
          </div>
        </section>

        {/* 5. FOOTER */}
        <footer className="border-t border-gray-800 py-12 text-center text-sm text-gray-600 bg-black/80 backdrop-blur-md">
          <div className="flex justify-center gap-6 mb-4">
            <a
              href="https://github.com/ADITYA-user18"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-transform hover:scale-110"
            >
              <FaGithub className="text-2xl" />
            </a>
            <a
              href="https://www.linkedin.com/in/aditya-wandakar-875007343/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-neon-blue transition-transform hover:scale-110"
            >
              <FaLinkedin className="text-2xl" />
            </a>
          </div>
          <p>Built with ❤️ using MERN Stack + Gemini AI</p>
          <p className="mt-2">© 2025 AI Code Reviewer Agent</p>
        </footer>
      </div>
    </div>
  );
};

export default Home;