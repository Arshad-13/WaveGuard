import { HeroSection } from '@/components/home/HeroSection';
import { FeatureCards } from '@/components/home/FeatureCards';
import { AlertFeed } from '@/components/home/AlertFeed';
import { Footer } from '@/components/layout/Footer';

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeatureCards />
      <AlertFeed />
      <Footer />
    </div>
  );
}
