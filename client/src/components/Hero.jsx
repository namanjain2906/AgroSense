import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Leaf, TriangleAlert, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/useLanguage';

export default function Hero() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const floatingVariants1 = {
    animate: {
      y: [0, -10, 0],
      transition: {
        repeat: Infinity,
        duration: 4,
        ease: "easeInOut",
      },
    },
  };

  const floatingVariants2 = {
    animate: {
      y: [0, -10, 0],
      transition: {
        repeat: Infinity,
        duration: 4,
        ease: "easeInOut",
        delay: 1.5,
      },
    },
  };

  return (
    <section className="relative w-full max-w-7xl mx-auto px-6 lg:px-12 pt-12 pb-24 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-green-100/50 rounded-full blur-[100px] -z-10 translate-x-1/3 -translate-y-1/4 pointer-events-none" />

      <div className="grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Column: Copy & CTA */}
        <motion.div 
          className="flex flex-col items-start z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            variants={itemVariants}
            className="flex items-center gap-1.5 px-3 py-1 bg-green-100 rounded-full mb-6"
          >
            <Sparkles className="w-3.5 h-3.5 text-green-600" />
            <span className="text-xs font-bold text-green-700 tracking-wide uppercase">{t('landing.badge')}</span>
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-5xl lg:text-6xl font-bold text-slate-800 leading-[1.1] tracking-tight mb-6"
          >
            {t('landing.titleLine1')}<br />{t('landing.titleLine2')}
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-lg text-slate-500 mb-8 max-w-lg leading-relaxed"
          >
            {t('landing.subtitle')}
          </motion.p>

          <motion.div variants={itemVariants}>
            {/* Backend Context: 
                Navigates to /register. User registers, receives JWT token, and gets redirected to /dashboard.
            */}
            <button 
              onClick={() => navigate('/register')}
              className="group flex items-center gap-2 bg-[#143d25] text-white px-6 py-3.5 rounded-md font-medium hover:bg-[#0f2d1b] transition-all shadow-md cursor-pointer"
            >
              {t('landing.cta')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          {/* Social Proof */}
          <motion.div 
            variants={itemVariants}
            className="flex items-center gap-4 mt-12"
          >
            <div className="flex -space-x-3">
              <img className="w-10 h-10 rounded-full border-2 border-[#fcfcfa] object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces" alt="Farmer" />
              <img className="w-10 h-10 rounded-full border-2 border-[#fcfcfa] object-cover" src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces" alt="Farmer" />
              <img className="w-10 h-10 rounded-full border-2 border-[#fcfcfa] object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces" alt="Farmer" />
            </div>
            <p className="text-sm text-slate-500">{t('landing.trustedBy')} <span className="font-semibold text-slate-700">2,500+</span> {t('landing.modernFarms')}</p>
          </motion.div>

        </motion.div>

        {/* Right Column: Floating Visuals */}
        <div className="relative h-[500px] w-full flex justify-center items-center">
          
          {/* Wireframe Dashboard Outline */}
          <div className="absolute w-[90%] h-[400px] bg-white/40 border border-slate-200 rounded-2xl shadow-sm backdrop-blur-sm p-4 overflow-hidden -z-10">
            <div className="w-full h-8 border-b border-slate-100 mb-4 flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
              <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
              <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
            </div>
            <div className="grid grid-cols-3 gap-4 h-[120px] mb-4">
              <div className="col-span-2 bg-slate-100/50 rounded-xl" />
              <div className="col-span-1 bg-slate-100/50 rounded-xl" />
            </div>
            <div className="w-full h-[180px] bg-slate-100/50 rounded-xl" />
          </div>

          {/* Floating Card 1: Active Crops */}
          <motion.div 
            variants={floatingVariants1}
            animate="animate"
            className="absolute top-[10%] left-[5%] bg-white p-5 rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-slate-50 w-72"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm font-semibold text-slate-700">{t('landing.activeCrops')}</h3>
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                <Leaf className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 leading-tight">Organic Soybeans</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Field A-12</p>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-500 mb-2">
                <span>{t('landing.soilMoisture')}</span>
                <span className="text-green-700 font-bold">68%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="w-[68%] h-full bg-green-600 rounded-full" />
              </div>
            </div>
          </motion.div>

          {/* Floating Card 2: Heat Stress Warning */}
          <motion.div 
            variants={floatingVariants2}
            animate="animate"
            className="absolute bottom-[15%] right-0 bg-red-50 p-5 rounded-2xl shadow-[0_20px_50px_-12px_rgba(239,68,68,0.15)] border border-red-100 w-72"
          >
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <TriangleAlert className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-red-700 mb-1">{t('landing.heatStressWarning')}</h3>
                <p className="text-xs text-red-600/80 leading-relaxed">
                  {t('landing.heatStressDesc')}
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
