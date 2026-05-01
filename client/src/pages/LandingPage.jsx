import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import FeatureBanner from '../components/FeatureBanner';
import Footer from '../components/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#fcfcfa] flex flex-col font-sans text-slate-800">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Hero />
        <FeatureBanner />
      </main>
      <Footer />
    </div>
  );
}
