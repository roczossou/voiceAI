import React from 'react';
import { Link } from 'react-router-dom';

export function SelectedWorks() {
  return (
    <section className="py-32 bg-surface-container-low px-margin-mobile md:px-margin-desktop border-y border-outline-variant">
      <div className="max-w-max-width mx-auto">
        <h2 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-on-background mb-16 text-center md:text-left">Selected Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-gutter h-auto md:h-[800px]">
          {/* Project 1: Large Feature */}
          <div className="md:col-span-2 md:row-span-2 relative group overflow-hidden  bg-on-background">
            <div className="absolute inset-0 bg-cover bg-center opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuArsS60RYt1-zM_FhFpmRpfPW865EPctc_cC24Ux_nHGdmmnhQz5T28CAYyNp0NwnGLCR5Jvsj0q29RsTrIz9B70kGe5RMNrbwUBgAB6QMdBapZgS1hNaeIiD4F-Tp2SRc234AoqyREs61QZIxj6At2pZMa1Xs8TXgWzhglFLFVvSG6UwzkIsWNFMBvwDxnLfX6OEmo2pDtLmvffdDQm7Ue7D1AguiHYzHg670uXV09GgW2A55h7wI')" }}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-on-background via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col justify-end">
              <div className="flex gap-2 mb-4">
                <span className="bg-primary text-on-primary font-label-sm text-label-sm px-3 py-1 border border-on-primary">Fintech</span>
                <span className="bg-surface text-on-surface font-label-sm text-label-sm px-3 py-1 ">UI/UX</span>
              </div>
              <h3 className="font-headline-lg text-headline-lg text-on-primary mb-2 group-hover:text-secondary-container transition-colors">Nexus Banking App</h3>
              <Link to="/projets/nexus" className="inline-flex items-center gap-2 font-label-lg text-label-lg text-primary-fixed hover:text-white transition-colors">
                View Case Study <span className="material-symbols-outlined">arrow_outward</span>
              </Link>
            </div>
          </div>

          {/* Project 2: Top Right */}
          <div className="md:col-span-2 md:row-span-1 relative group overflow-hidden  bg-primary">
            <div className="absolute inset-0 bg-cover bg-center opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 mix-blend-multiply" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBfZ8ul1iHsM1D3k7rWGIMU3hqTZP8Ro3F3Y8HfjXQmc0OPIGwzxZem0Zvw6xdw18AmhjSFISuyrN95UoJwUrHbGh46FLp1ETCJ0wgybJ37ME6UZmJ6wvezLnjnbYEuXxlnTNN0AZVyJQOBIgqI6ihvONXuBjBtKIKdo63h2RPpZ8FjO6TnUPwnOU5G6cN1bM5rYPihjBIAE_v5qn2I4fBZQcn2r_c6i1hRkAdIos7wjlLLzKsySmU')" }}></div>
            <div className="absolute inset-0 p-8 flex flex-col justify-between">
              <div className="flex gap-2">
                <span className="bg-secondary-container text-on-background font-label-sm text-label-sm px-3 py-1 ">E-Commerce</span>
              </div>
              <div>
                <h3 className="font-headline-md text-headline-md text-on-primary mb-2">Aura Streetwear</h3>
                <Link to="/projets/aura" className="inline-flex items-center gap-2 font-label-lg text-label-lg text-on-primary hover:text-secondary-container transition-colors">
                  View Case Study <span className="material-symbols-outlined">arrow_outward</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Project 3: Bottom Middle */}
          <div className="md:col-span-1 md:row-span-1 relative group overflow-hidden  bg-surface">
            <div className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAaSlmd3yakerXk8dPNKk7brodzyECvAdKsGCx0hCx8H8rWla9Q_MmstpusOrk0RH9sAx8y5GiU3AMDPhFmTradiR1-X-WrDrPyVMDqkP8F0nE7twEaRPGYMKW6iQst2z9fQC9VYhPBMZ7Q9Rdrh2Jeqy1ufnriCrcoe2EWQygsuQXhBAkoNXNJpUVlAO8Wqz4-vhtjzFCdDf1u2cILDSgV9QtU_pzIMXv4jA_oRCcwFvpwtxCSoK4')" }}></div>
            <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
              <span className="inline-block bg-on-background text-on-primary font-label-sm text-label-sm px-3 py-1 self-start">Branding</span>
              <div>
                <h3 className="font-headline-md text-headline-md text-on-background mb-2">Verve Logistics</h3>
              </div>
            </div>
          </div>

          {/* Project 4: Bottom Right Callout */}
          <Link to="/projets" className="md:col-span-1 md:row-span-1 bg-secondary-container  p-8 flex flex-col justify-center items-center text-center hover:bg-on-background hover:text-secondary-container transition-colors group cursor-pointer">
            <span className="material-symbols-outlined text-[48px] mb-4 text-on-background group-hover:text-secondary-container transition-colors">grid_view</span>
            <h3 className="font-headline-md text-headline-md text-on-background group-hover:text-on-primary transition-colors mb-2">View Full Archive</h3>
            <p className="font-body-md text-body-md text-on-background/80 group-hover:text-on-primary/80">Explore 40+ projects</p>
          </Link>
        </div>
      </div>
    </section>
  );
}
