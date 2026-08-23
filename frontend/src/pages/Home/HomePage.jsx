import { SiteLayout } from '../../components/layout/SiteLayout';
import { RevealSection } from '../../motion';
import { Hero } from './Hero';
import { QuickIntro } from './QuickIntro';
import { FeaturedProjects } from './FeaturedProjects';
import { CoreExpertise } from './CoreExpertise';
import { ServicesApercu } from './ServicesApercu';
import { RecentBlog } from './RecentBlog';
import { FAQ } from './FAQ';
import { Indicators } from './Indicators';
import { Testimonials } from './Testimonials';
import { CTA } from './CTA';

export function HomePage() {
  return (
    <SiteLayout>
      <Hero />
      <RevealSection variant="slideLeft">
        <QuickIntro />
      </RevealSection>
      <RevealSection variant="tilt3d">
        <FeaturedProjects />
      </RevealSection>
      <RevealSection variant="rise">
        <CoreExpertise />
      </RevealSection>
      <RevealSection variant="zoom">
        <ServicesApercu />
      </RevealSection>
      <RevealSection variant="slideRight">
        <RecentBlog />
      </RevealSection>
      <RevealSection variant="rise">
        <FAQ />
      </RevealSection>
      <RevealSection variant="zoom">
        <Indicators />
      </RevealSection>
      <RevealSection variant="tilt3d">
        <Testimonials />
      </RevealSection>
      <RevealSection variant="zoom">
        <CTA />
      </RevealSection>
    </SiteLayout>
  );
}
