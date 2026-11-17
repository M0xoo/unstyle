import { Inter } from "next/font/google";
import { Sparkles, Zap, Shield } from "lucide-react";
import { motion } from "framer-motion";

const inter = Inter({ subsets: ["latin"] });

export default function Landing() {
  return (
    <main className={`${inter.className} min-h-screen bg-white`}>
      <section className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-24 text-center">
        <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm backdrop-blur">✨ Now with AI</span>
        <h1 className="text-6xl font-bold">
          Elevate your workflow with <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">AI</span>
        </h1>
        <p>Seamlessly connect your tools — and unlock the power of your data.</p>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6 py-3 shadow-lg shadow-indigo-500/50">Get Started →</button>
        <p>Trusted by 10,000+ teams worldwide</p>
      </section>
      <section className="grid md:grid-cols-3 gap-6 p-12">
        {[Zap, Shield, Sparkles].map((Icon, i) => (
          <motion.div key={i} whileInView={{ opacity: 1, y: 0 }} className="rounded-2xl shadow-xl p-6 hover:-translate-y-1 transition-all backdrop-blur-md bg-white/60">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center"><Icon /></div>
            <h3>Lightning-fast</h3>
          </motion.div>
        ))}
        <div className="rounded-2xl shadow-lg p-6 backdrop-blur-xl">
          <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">🚀</div>
        </div>
        <div className="rounded-3xl shadow-2xl p-6 text-indigo-600 border-indigo-500">
          <img src="https://i.pravatar.cc/100" />
          <p>John Doe, CEO at Acme</p>
        </div>
      </section>
    </main>
  );
}
