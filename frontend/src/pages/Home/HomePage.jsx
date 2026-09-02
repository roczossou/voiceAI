import { SiteLayout } from '../../components/layout/SiteLayout';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import portrait from '../../assets/portrait-cutout.png'
export function HomePage() {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          const items = entry.target.querySelectorAll('.stagger-item');
          items.forEach((item, index) => {
            setTimeout(() => {
              item.classList.add('active');
            }, index * 100);
          });
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <SiteLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-30 md:pb-[100px] reveal" style={{ backgroundColor: '#1565f5' }}>
        {/* ===== CODED BACKGROUND ===== */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">



          {/* Small ring — haut centre-droit — gradient rouge-orange */}
          <svg
            className="absolute"
            style={{ top: '-10%', left: '70%', width: 300, height: 300 }}
            viewBox="0 0 220 220"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <radialGradient id="ring1" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ff2d00" />
                <stop offset="100%" stopColor="#ff7000" />
              </radialGradient>
            </defs>
            <circle cx="110" cy="110" r="80" stroke="url(#ring1)" strokeWidth="44" />
          </svg>

          {/* Large ring — bas droite — gradient jaune-orange */}
          <svg
            className="absolute"
            style={{ bottom: '-55%', right: '-30%', width: 820, height: 820 }}
            viewBox="0 0 820 820"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <radialGradient id="ring2" cx="40%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#ffd000" />
                <stop offset="100%" stopColor="#ff6200" />
              </radialGradient>
            </defs>
            <circle cx="410" cy="410" r="300" stroke="url(#ring2)" strokeWidth="170" />
          </svg>
        </div>
        {/* ===== END BACKGROUND ===== */}

        <div className="max-w-[1280px] mx-auto px-margin relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-xl items-center">
            {/* White Text Card */}
            <div className="relative z-10 py-xl md:py-[80px] pr-lg md:pr-xl">
              {/* Background that bleeds to the left */}
              <div className="absolute inset-y-0 right-0 w-[200vw] bg-surface rounded-r-[3rem] md:rounded-r-[4rem] shadow-2xl -z-10"></div>

              <div className="relative z-10">
                <span className="hero-anim-badge inline-flex items-center gap-2 bg-secondary-container text-on-primary font-label-bold text-label-bold px-md py-sm rounded-full mb-md tracking-wider shadow-sm">
                  {/* <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 dot-pulse-emerald inline-block" /> */}
                  <span>Disponible pour de nouveaux projets</span>
                </span>
                <h1 className="hero-anim-title font-headline-xl text-headline-lg-mobile md:text-headline-xl font-extrabold mb-md text-on-surface leading-tight">
                  Bienvenue, je suis <br />
                  <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-600 to-purple-600">Chabel ANANOUNON.</span>
                </h1>
                <p className="hero-anim-text font-body-lg text-body-lg text-on-surface-variant mb-lg max-w-[32rem]">
                  Je combine des principes de marketing agressifs avec une exécution esthétique immaculée pour construire des solutions numériques qui captent l'attention et stimulent la conversion.
                </p>
                <div className="hero-anim-btn flex flex-wrap gap-md">
                  <Link to="/projets" className="text-on-primary font-label-bold text-label-bold px-lg py-md rounded-full hover:bg-secondary transition-all tracking-wider shadow-lg shadow-secondary-container/30 hover:scale-105" style={{ background: 'linear-gradient(135deg, rgb(255, 69, 0) 0%, rgb(255, 183, 0) 100%)', textShadow: 'rgba(0, 0, 0, 0.2) 0px 1px 2px' }}>Découvrir mes projets</Link>
                  <Link to="/a-propos" className="border-2 border-primary text-primary font-label-bold text-label-bold px-lg py-md rounded-full hover:bg-primary/10 transition-all hover:scale-105">Mon parcours</Link>
                </div>
              </div>
            </div>

            {/* Portrait Card (avec entrée extravagante et flottaison) */}
            <div className="hero-anim-portrait relative flex justify-center md:justify-end mt-xl md:mt-0">
              <div className="relative w-full max-w-[28rem] border-[10px] border-none shadow-2xl z-10 rounded-[2.5rem] overflow-hidden group animate-hero-float">
                <img alt="Portrait of Chabel ANANOUNON" className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105" src={portrait} />
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-surface/90 backdrop-blur-md text-on-surface border border-outline-variant rounded-full px-md py-sm flex items-center gap-sm shadow-xl whitespace-nowrap z-20">
                  {/* <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 dot-pulse-emerald inline-block" /> */}
                  {/* <span className="font-label-bold text-label-bold text-emerald-700">Méthodes Éprouvées</span> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* About Section */}
      <section className="py-xl bg-gradient-to-b from-surface-container-lowest to-surface reveal">
        <div className="max-w-7xl mx-auto px-margin">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-md">
            <div className="mb-lg border-l-4 border-primary pl-md stagger-item">
              <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">À propos de moi</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant mt-md">
                Je suis Chabel ANANOUNON, entrepreneur, leader jeunesse, gestionnaire de projet, planificateur d'événements et créatif digital béninois...
              </p>
              <Link to="/a-propos" className="mt-md inline-block text-on-primary font-label-bold text-label-bold px-lg py-md rounded-full hover:opacity-90 transition-opacity tracking-wider shadow-lg shadow-primary/30" style={{ background: 'linear-gradient(135deg, rgb(255, 69, 0) 0%, rgb(255, 183, 0) 100%)' }}>Lire mon histoire complète</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section className="py-xl bg-gradient-to-b from-surface to-surface-container-low border-t border-outline-variant/50 reveal">
        <div className="max-w-7xl mx-auto px-margin">
          <div className="mb-lg border-l-4 border-primary pl-md stagger-item">
            <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">Domaines d'expertise</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-sm">Approches stratégiques du design de produit digital et de la gestion de projets.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
            {/* Bento Box 1 : Créativité (Thème Violet) */}
            <div className="bg-surface border border-purple-200 rounded-xl p-lg card-sheen-beam glow-purple hover:border-purple-500 transition-all group stagger-item shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-md">
                  <div className="w-12 h-12 bg-purple-500/10 text-purple-600 rounded-xl flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                    <span className="material-symbols-outlined text-[24px]">architecture</span>
                  </div>
                  {/* <span className="w-2.5 h-2.5 rounded-full bg-purple-500 dot-pulse-purple" title="Créativité" /> */}
                </div>
                <h3 className="font-headline-md text-body-lg font-bold mb-sm text-on-surface group-hover:text-purple-600 transition-colors">Créativité Digitale</h3>
                <ul className="space-y-sm mt-md">
                  <li className="flex items-start gap-sm border-b border-purple-100 pb-sm">
                    <span className="material-symbols-outlined text-purple-600 text-[18px]">check_circle</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Design graphique &amp; Direction artistique</span>
                  </li>
                  <li className="flex items-start gap-sm border-b border-purple-100 pb-sm">
                    <span className="material-symbols-outlined text-purple-600 text-[18px]">check_circle</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Branding &amp; Identités fortes</span>
                  </li>
                  <li className="flex items-start gap-sm">
                    <span className="material-symbols-outlined text-purple-600 text-[18px]">check_circle</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Communication digitale globale</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bento Box 2 : Gestion de Projet (Thème Émeraude) */}
            <div className="bg-surface border border-emerald-200 rounded-xl p-lg card-sheen-beam glow-emerald hover:border-emerald-500 transition-all group stagger-item shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-md">
                  <div className="w-12 h-12 bg-emerald-500/10 text-emerald-600 rounded-xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                    <span className="material-symbols-outlined text-[24px]">psychology</span>
                  </div>
                  {/* <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 dot-pulse-emerald" title="Gestion" /> */}
                </div>
                <h3 className="font-headline-md text-body-lg font-bold mb-sm text-on-surface group-hover:text-emerald-600 transition-colors">Gestion de Projet</h3>
                <ul className="space-y-sm mt-md">
                  <li className="flex items-start gap-sm border-b border-emerald-100 pb-sm">
                    <span className="material-symbols-outlined text-emerald-600 text-[18px]">check_circle</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Planification stratégique</span>
                  </li>
                  <li className="flex items-start gap-sm border-b border-emerald-100 pb-sm">
                    <span className="material-symbols-outlined text-emerald-600 text-[18px]">check_circle</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Organisation Événementielle</span>
                  </li>
                  <li className="flex items-start gap-sm">
                    <span className="material-symbols-outlined text-emerald-600 text-[18px]">check_circle</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Suivi &amp; Évaluation rigoureux</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bento Box 3 : Leadership (Thème Ambre) */}
            <div className="bg-surface border border-amber-200 rounded-xl p-lg card-sheen-beam glow-amber hover:border-amber-500 transition-all group stagger-item shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-md">
                  <div className="w-12 h-12 bg-amber-500/10 text-amber-600 rounded-xl flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors duration-300">
                    <span className="material-symbols-outlined text-[24px]">bolt</span>
                  </div>
                  {/* <span className="w-2.5 h-2.5 rounded-full bg-amber-500 dot-pulse-amber" title="Leadership" /> */}
                </div>
                <h3 className="font-headline-md text-body-lg font-bold mb-sm text-on-surface group-hover:text-amber-600 transition-colors">Leadership</h3>
                <ul className="space-y-sm mt-md">
                  <li className="flex items-start gap-sm border-b border-amber-100 pb-sm">
                    <span className="material-symbols-outlined text-amber-600 text-[18px]">check_circle</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Formation &amp; Facilitation d'ateliers</span>
                  </li>
                  <li className="flex items-start gap-sm border-b border-amber-100 pb-sm">
                    <span className="material-symbols-outlined text-amber-600 text-[18px]">check_circle</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Gouvernance &amp; Engagement Jeunesse</span>
                  </li>
                  <li className="flex items-start gap-sm">
                    <span className="material-symbols-outlined text-amber-600 text-[18px]">check_circle</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Développement personnel et coaching</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compétences & Stack technique */}
      <section className="relative overflow-hidden py-xl border-t border-outline-variant/50 reveal" style={{ backgroundColor: '#1565f5' }}>
        {/* ===== CODED BACKGROUND ===== */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <svg className="absolute" style={{ top: '-10%', left: '70%', width: 400, height: 400 }} viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="ring-homecomp-1" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ff2d00" />
                <stop offset="100%" stopColor="#ff7000" />
              </radialGradient>
            </defs>
            <circle cx="110" cy="110" r="80" stroke="url(#ring-homecomp-1)" strokeWidth="44" />
          </svg>
          <svg className="absolute" style={{ bottom: '-30%', left: '-20%', width: 800, height: 800 }} viewBox="0 0 820 820" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="ring-homecomp-2" cx="40%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#ffd000" />
                <stop offset="100%" stopColor="#ff6200" />
              </radialGradient>
            </defs>
            <circle cx="410" cy="410" r="300" stroke="url(#ring-homecomp-2)" strokeWidth="150" />
          </svg>
        </div>
        {/* ===== END BACKGROUND ===== */}

        <div className="max-w-7xl mx-auto px-margin relative z-10">
          <div className="mb-lg border-l-4 border-amber-400 pl-md stagger-item">
            <h2 className="font-headline-lg text-headline-lg font-bold text-white">Compétences &amp; Stack technique</h2>
            <p className="font-body-md text-body-md text-white/90 mt-sm ">
              Un arsenal complet alliant maîtrise créative, outils de pointe et méthodologies stratégiques de gestion de projet.
            </p>
          </div>

          {/* Grille de compétences structurée */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md mb-lg">

            {/* Carte 1 : Design & Créativité (Thème Violet Électrique) */}
            <div className="bg-surface border border-purple-200 rounded-xl p-lg card-pop-elastic glow-purple hover:border-purple-500 flex flex-col justify-between stagger-item group">
              <div>
                <div className="flex items-center justify-between mb-md">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                    <span className="material-symbols-outlined text-[24px]">palette</span>
                  </div>
                  {/* <span className="w-2.5 h-2.5 rounded-full bg-purple-500 dot-pulse-purple" title="UI/UX & Design" /> */}
                </div>
                <h3 className="font-headline-md text-body-lg font-bold text-on-surface mb-xs group-hover:text-purple-600 transition-colors">Création &amp; Design</h3>
                <p className="font-body-sm text-on-surface-variant mb-md">Identités visuelles et contenus graphiques haute conversion.</p>
              </div>
              <div className="flex flex-wrap gap-xs pt-sm border-t border-purple-100">
                {/*PixelLab, Pixelcut, Pinterest, Vector Ink, Photoroom, Effaceur magique, Zarc */}
                <span className="bg-purple-500/10 text-purple-700 font-label-bold text-[11px] px-sm py-xs rounded-lg border border-purple-200/50">PixelLab</span>
                <span className="bg-purple-500/10 text-purple-700 font-label-bold text-[11px] px-sm py-xs rounded-lg border border-purple-200/50">Pixelcut</span>
                <span className="bg-purple-500/10 text-purple-700 font-label-bold text-[11px] px-sm py-xs rounded-lg border border-purple-200/50">Pinterest</span>
                <span className="bg-purple-500/10 text-purple-700 font-label-bold text-[11px] px-sm py-xs rounded-lg border border-purple-200/50">Vector Ink</span>
                <span className="bg-purple-500/10 text-purple-700 font-label-bold text-[11px] px-sm py-xs rounded-lg border border-purple-200/50">Photoroom</span>
                <span className="bg-purple-500/10 text-purple-700 font-label-bold text-[11px] px-sm py-xs rounded-lg border border-purple-200/50">Effaceur magique</span>
                <span className="bg-purple-500/10 text-purple-700 font-label-bold text-[11px] px-sm py-xs rounded-lg border border-purple-200/50">Zarc</span>
              </div>
            </div>

            {/* Carte 2 : Gestion de Projet (Thème Émeraude) */}
            <div className="bg-surface border border-emerald-200 rounded-xl p-lg card-pop-elastic glow-emerald hover:border-emerald-500 flex flex-col justify-between stagger-item group">
              <div>
                <div className="flex items-center justify-between mb-md">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                    <span className="material-symbols-outlined text-[24px]">task_alt</span>
                  </div>
                  {/* <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 dot-pulse-emerald" title="Gestion & Suivi" /> */}
                </div>
                <h3 className="font-headline-md text-body-lg font-bold text-on-surface mb-xs group-hover:text-emerald-600 transition-colors">Gestion de Projet</h3>
                <p className="font-body-sm text-on-surface-variant mb-md">Planification stratégique, suivi d'exécution et méthodes agiles.</p>
              </div>
              <div className="flex flex-wrap gap-xs pt-sm border-t border-emerald-100">
                <span className="bg-emerald-500/10 text-emerald-700 font-label-bold text-[11px] px-sm py-xs rounded-lg border border-emerald-200/50">Agile / Scrum</span>
                <span className="bg-emerald-500/10 text-emerald-700 font-label-bold text-[11px] px-sm py-xs rounded-lg border border-emerald-200/50">Notion</span>
                <span className="bg-emerald-500/10 text-emerald-700 font-label-bold text-[11px] px-sm py-xs rounded-lg border border-emerald-200/50">Trello / Asana</span>
                <span className="bg-emerald-500/10 text-emerald-700 font-label-bold text-[11px] px-sm py-xs rounded-lg border border-emerald-200/50">Suivi &amp; Évaluation</span>
                <span className="bg-emerald-500/10 text-emerald-700 font-label-bold text-[11px] px-sm py-xs rounded-lg border border-emerald-200/50">MS Project</span>
              </div>
            </div>

            {/* Carte 3 : Marketing & Stratégie (Thème Cyan / Turquoise) */}
            <div className="bg-surface border border-cyan-200 rounded-xl p-lg card-pop-elastic glow-cyan hover:border-cyan-500 flex flex-col justify-between stagger-item group">
              <div>
                <div className="flex items-center justify-between mb-md">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center group-hover:bg-cyan-600 group-hover:text-white transition-colors duration-300">
                    <span className="material-symbols-outlined text-[24px]">trending_up</span>
                  </div>
                  {/* <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 dot-pulse-cyan" title="Croissance & Digital" /> */}
                </div>
                <h3 className="font-headline-md text-body-lg font-bold text-on-surface mb-xs group-hover:text-cyan-600 transition-colors">Marketing &amp; Digital</h3>
                <p className="font-body-sm text-on-surface-variant mb-md">Campagnes ciblées, rédaction persuasive et visibilité en ligne.</p>
              </div>
              <div className="flex flex-wrap gap-xs pt-sm border-t border-cyan-100">
                <span className="bg-cyan-500/10 text-cyan-700 font-label-bold text-[11px] px-sm py-xs rounded-lg border border-cyan-200/50">Meta Business</span>
                <span className="bg-cyan-500/10 text-cyan-700 font-label-bold text-[11px] px-sm py-xs rounded-lg border border-cyan-200/50">Copywriting</span>
                <span className="bg-cyan-500/10 text-cyan-700 font-label-bold text-[11px] px-sm py-xs rounded-lg border border-cyan-200/50">Social Media Strategy</span>
                <span className="bg-cyan-500/10 text-cyan-700 font-label-bold text-[11px] px-sm py-xs rounded-lg border border-cyan-200/50">Content Marketing</span>
                <span className="bg-cyan-500/10 text-cyan-700 font-label-bold text-[11px] px-sm py-xs rounded-lg border border-cyan-200/50">Google Analytics</span>
              </div>
            </div>

            {/* Carte 4 : Leadership & Événementiel (Thème Ambre / Doré) */}
            <div className="bg-surface border border-amber-200 rounded-xl p-lg card-pop-elastic glow-amber hover:border-amber-500 flex flex-col justify-between stagger-item group">
              <div>
                <div className="flex items-center justify-between mb-md">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors duration-300">
                    <span className="material-symbols-outlined text-[24px]">campaign</span>
                  </div>
                  {/* <span className="w-2.5 h-2.5 rounded-full bg-amber-500 dot-pulse-amber" title="Impact & Facilitation" /> */}
                </div>
                <h3 className="font-headline-md text-body-lg font-bold text-on-surface mb-xs group-hover:text-amber-600 transition-colors">Leadership &amp; Event</h3>
                <p className="font-body-sm text-on-surface-variant mb-md">Organisation d'événements majeurs et animation d'ateliers.</p>
              </div>
              <div className="flex flex-wrap gap-xs pt-sm border-t border-amber-100">
                <span className="bg-amber-500/10 text-amber-700 font-label-bold text-[11px] px-sm py-xs rounded-lg border border-amber-200/50">Événementiel Grand Public</span>
                <span className="bg-amber-500/10 text-amber-700 font-label-bold text-[11px] px-sm py-xs rounded-lg border border-amber-200/50">Formation &amp; Facilitation</span>
                <span className="bg-amber-500/10 text-amber-700 font-label-bold text-[11px] px-sm py-xs rounded-lg border border-amber-200/50">Direction Artistique</span>
                <span className="bg-amber-500/10 text-amber-700 font-label-bold text-[11px] px-sm py-xs rounded-lg border border-amber-200/50">Engagement Citoyen</span>
              </div>
            </div>

          </div>

          {/* Bandeau de synthèse d'excellence avec points d'accents multicolores */}
          <div className="bg-surface p-md rounded-xl border border-outline-variant/60 flex flex-wrap items-center justify-around gap-md text-center stagger-item shadow-sm">
            <div className="flex items-center gap-xs">
              {/* <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 dot-pulse-emerald inline-block" /> */}
              <span className="material-symbols-outlined text-emerald-600">verified</span>
              <span className="font-label-bold text-body-sm text-on-surface">15+ Outils spécialisés maîtrisés</span>
            </div>
            <div className="flex items-center gap-xs">
              {/* <span className="w-2.5 h-2.5 rounded-full bg-purple-500 dot-pulse-purple inline-block" /> */}
              <span className="material-symbols-outlined text-purple-600">psychology</span>
              <span className="font-label-bold text-body-sm text-on-surface">Approche Orientée Résultats &amp; Conversion</span>
            </div>
            <div className="flex items-center gap-xs">
              {/* <span className="w-2.5 h-2.5 rounded-full bg-amber-500 dot-pulse-amber inline-block" /> */}
              <span className="material-symbols-outlined text-amber-600">auto_awesome</span>
              <span className="font-label-bold text-body-sm text-on-surface">Flexibilité Créative &amp; Rigueur Exécutive</span>
            </div>
          </div>

        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-xl bg-gradient-to-b from-surface to-surface-container-low border-t border-outline-variant/50 reveal">
        <div className="max-w-7xl mx-auto px-margin">
          <div className="flex justify-between items-end mb-lg border-b border-outline-variant pb-sm stagger-item">
            <div>
              <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">Projets en avant</h2>
            </div>
            <Link to="/projets" className="font-label-bold text-label-bold text-primary hover:underline flex items-center gap-xs">
              Explorer les archives (tous les projets) <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-md grid-rows-[minmax(250px,_auto)]">
            {/* Large Feature Project */}
            <div className="md:col-span-8 bg-surface rounded-2xl overflow-hidden border border-purple-200 card-extravagant card-shine glow-purple hover:border-purple-500 group relative stagger-item shadow-md">
              <div className="h-64 md:h-full bg-surface-variant w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCYc3ZQw6MRkvcR1UFDKh8A23tVEnCLnxldxJpnzOgql7SO_IZDr_DTZvMXPMAMPe-B4Z4I4YBAV2h6EktUL9Ak6yG8Ovkz1T7vpiaQY74O920O2RAMw6v9u0hP7qfJid_KmUlB2S75ZCkreHodhxUXWp2OPjM-KR7bb4hEAnvkInPmJtB4fudzeIu34ruihCjJPH8rgNNQS8wimHhBPrwUQr8O4gv3eeQEpTo2h7evPD8SIl5d4Uw')" }}></div>
              <div className="absolute bottom-0 left-0 w-full p-md bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                <div className="flex gap-sm mb-xs items-center">
                  <span className="w-2 h-2 rounded-full bg-purple-400 dot-pulse-purple inline-block" />
                  <span className="bg-purple-600 text-white font-label-bold text-[10px] px-2.5 py-1 rounded-full">Formation</span>
                  <span className="bg-white/20 text-white backdrop-blur-sm font-label-bold text-[10px] px-2.5 py-1 rounded-full border border-white/20">Digital Créativité Mobile</span>
                </div>
                <h3 className="font-headline-md text-[22px] font-bold text-white group-hover:text-purple-300 transition-colors">AndroCréa</h3>
                <p className="font-body-sm text-body-sm text-white/90 mt-1">Former une nouvelle génération de créatifs et d'entrepreneurs digitaux qualifiés.</p>
              </div>
            </div>

            {/* Smaller Project 1 */}
            <div className="md:col-span-4 bg-surface rounded-2xl overflow-hidden border border-emerald-200 card-extravagant card-shine glow-emerald hover:border-emerald-500 flex flex-col group stagger-item shadow-md">
              <div className="h-48 bg-surface-variant w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuByxGL-68Ca5NEmR9pVbvOX3DmdKjgcZLDKg_wmIZ37I35pEeATBQFH9GB49-yK4b2SpAiebVeNikqnVzw3DEOWtJR4z12Mu1S3Ity06ivWUkvWNQ0ivodY3izHRtQuqnpjq8xrZTscOrXfknVohazGME08G87zqtpSJeFB1b-KJSmpMtCKyBugLsSbpz37xJwb91jEklPo7NhxwpQsn4UOCRmUXu1rEb6qHtPMC-KbPKX0zxI7co8')" }}></div>
              <div className="p-md flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-emerald-700 bg-emerald-50 font-label-bold text-[10px] px-2 py-0.5 rounded border border-emerald-200">Événementiel</span>
                    {/* <span className="w-2 h-2 rounded-full bg-emerald-500 dot-pulse-emerald" /> */}
                  </div>
                  <h3 className="font-headline-md text-[18px] font-bold text-on-surface mb-xs group-hover:text-emerald-600 transition-colors">Digit's Créa Awards</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Valorisation et récompense des meilleurs talents créatifs.</p>
                </div>
                <div className="mt-sm pt-2 border-t border-emerald-100">
                  <Link to="/projets" className="text-emerald-600 font-label-bold text-[12px] flex items-center gap-xs hover:underline">Voir l'étude de cas <span className="material-symbols-outlined text-[14px]">north_east</span></Link>
                </div>
              </div>
            </div>

            {/* Smaller Project 2 */}
            <div className="md:col-span-4 bg-surface rounded-2xl overflow-hidden border border-cyan-200 card-extravagant card-shine glow-cyan hover:border-cyan-500 flex flex-col group stagger-item shadow-md">
              <div className="h-48 bg-surface-variant w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDWNMaqNkUPzFwX4tYklKfNjr_S7UzOpB-OiRQx9Y-mUEnO8CwjEwTK8TVjN6Y8W-hXAsoLpfcFQHPPMARvfKNh8RpCb-VSx5p8xSDlZ3w6mTFA9fkxkQ_jPJMXSA75NkDbzTEve0_3aOztL9obNb6mfbBYlNDy29LBe57IABl4wpODfzjCCg9wMxSAuuir3Z-VgrSY0XrSdPx5bES1TWG7GAYiHKXTWy6FJRIjjbxU8wdy3OA5DJs')" }}></div>
              <div className="p-md flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-cyan-700 bg-cyan-50 font-label-bold text-[10px] px-2 py-0.5 rounded border border-cyan-200">Leadership</span>
                    {/* <span className="w-2 h-2 rounded-full bg-cyan-500 dot-pulse-cyan" /> */}
                  </div>
                  <h3 className="font-headline-md text-[18px] font-bold text-on-surface mb-xs group-hover:text-cyan-600 transition-colors">Mairie des Jeunes de Covè</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Engagement citoyen et gouvernance locale de la jeunesse.</p>
                </div>
                <div className="mt-sm pt-2 border-t border-cyan-100">
                  <Link to="/projets" className="text-cyan-600 font-label-bold text-[12px] flex items-center gap-xs hover:underline">Voir l'étude de cas <span className="material-symbols-outlined text-[14px]">north_east</span></Link>
                </div>
              </div>
            </div>

            {/* Promo Box */}
            <div className="md:col-span-8 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-2xl overflow-hidden border border-purple-300 card-extravagant card-shine glow-purple flex items-center justify-between p-lg relative stagger-item shadow-xl">
              <div className="absolute inset-0 bg-white/5" style={{ clipPath: 'polygon(50% 0%, 100% 0, 100% 100%, 75% 100%)' }}></div>
              <div className="relative z-10 w-full flex flex-col md:flex-row justify-between items-center gap-md">
                <div>
                  <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white font-label-bold text-[10px] px-3 py-1 rounded-full mb-sm border border-white/30">
                    <span className="w-2 h-2 rounded-full bg-amber-400 dot-pulse-amber" />
                    <span> Exclusivité</span>
                  </span>
                  <h3 className="font-headline-md text-headline-md font-bold text-white"> ProduitDigits </h3>
                  <p className="font-body-sm text-body-sm text-white/90 mt-xs">Découvrez mes produits et nouveautés.</p>
                </div>
                <div className="flex-shrink-0 bg-surface rounded-xl p-sm border border-outline-variant shadow-xl flex items-center gap-sm">
                  <button className="bg-amber-500 hover:bg-amber-600 text-white font-label-bold text-[12px] px-md py-sm rounded-full ml-sm transition-all shadow-md">Voir plus </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-xl bg-gradient-to-b from-surface-container-low to-surface border-t border-outline-variant/50 reveal">
        <div className="max-w-7xl mx-auto px-margin">
          <div className="flex justify-between items-end mb-lg border-b border-outline-variant pb-sm stagger-item">
            <div>
              <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">Dernières publications</h2>
            </div>
            <Link to="/blog" className="font-label-bold text-label-bold text-primary hover:underline flex items-center gap-xs">
              Voir le blog <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
            {/* Article 1 */}
            <div className="bg-surface border border-outline-variant rounded-xl overflow-hidden flex flex-col group hover:shadow-xl transition-all stagger-item shadow-sm">
              <div className="h-48 bg-surface-variant w-full relative">
                <div className="absolute inset-0 bg-primary/10"></div>
              </div>
              <div className="p-md flex-grow flex flex-col justify-between">
                <div>
                  <span className="text-secondary-container font-label-bold text-[10px] mb-xs block">Leadership</span>
                  <h3 className="font-headline-md text-[18px] font-bold text-on-surface mb-sm group-hover:text-primary transition-colors">L'importance de l'engagement citoyen chez les jeunes</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-3">Découvrez comment la jeunesse peut activement participer au développement de sa communauté à travers des actions concrètes.</p>
                </div>
                <div className="mt-md pt-sm border-t border-outline-variant flex items-center justify-between text-on-surface-variant font-label-bold text-[12px]">
                  <span>12 Août 2026</span>
                  <span>5 min read</span>
                </div>
              </div>
            </div>
            {/* Article 2 */}
            <div className="bg-surface border border-outline-variant rounded-xl overflow-hidden flex flex-col group hover:shadow-xl transition-all stagger-item shadow-sm">
              <div className="h-48 bg-surface-variant w-full relative">
                <div className="absolute inset-0 bg-secondary/10"></div>
              </div>
              <div className="p-md flex-grow flex flex-col justify-between">
                <div>
                  <span className="text-primary font-label-bold text-[10px] mb-xs block">Design &amp; Créativité</span>
                  <h3 className="font-headline-md text-[18px] font-bold text-on-surface mb-sm group-hover:text-primary transition-colors">Créer une identité visuelle qui marque les esprits</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-3">Les principes fondamentaux pour construire une marque forte et mémorable dans l'écosystème digital africain.</p>
                </div>
                <div className="mt-md pt-sm border-t border-outline-variant flex items-center justify-between text-on-surface-variant font-label-bold text-[12px]">
                  <span>25 Juil 2026</span>
                  <span>4 min read</span>
                </div>
              </div>
            </div>
            {/* Article 3 */}
            <div className="bg-surface border border-outline-variant rounded-xl overflow-hidden flex flex-col group hover:shadow-xl transition-all stagger-item shadow-sm">
              <div className="h-48 bg-surface-variant w-full relative">
                <div className="absolute inset-0 bg-tertiary/10"></div>
              </div>
              <div className="p-md flex-grow flex flex-col justify-between">
                <div>
                  <span className="text-secondary-container font-label-bold text-[10px] mb-xs block">Événementiel</span>
                  <h3 className="font-headline-md text-[18px] font-bold text-on-surface mb-sm group-hover:text-primary transition-colors">Réussir son événement : de l'idée à la réalisation</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-3">Guide pratique des étapes incontournables pour organiser un événement à succès, basé sur mes expériences de terrain.</p>
                </div>
                <div className="mt-md pt-sm border-t border-outline-variant flex items-center justify-between text-on-surface-variant font-label-bold text-[12px]">
                  <span>10 Juin 2026</span>
                  <span>6 min read</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Metrics */}

      <section className="py-xl bg-gradient-to-b from-surface to-surface-container-low border-t border-outline-variant/50 reveal">
        <div className="max-w-7xl mx-auto px-margin text-center">
          <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface mb-lg stagger-item">Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-md">
            <div className="p-md stagger-item bg-surface rounded-xl border border-outline-variant/50 shadow-sm">
              <h3 className="font-headline-xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary-container font-extrabold">3000+</h3>
              <p className="font-body-sm text-on-surface-variant mt-2">Projets Réalisés</p>
            </div>
            <div className="p-md stagger-item bg-surface rounded-xl border border-outline-variant/50 shadow-sm">
              <h3 className="font-headline-xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary-container font-extrabold">7+</h3>
              <p className="font-body-sm text-on-surface-variant mt-2">Événements Organisés</p>
            </div>
            <div className="p-md stagger-item bg-surface rounded-xl border border-outline-variant/50 shadow-sm">
              <h3 className="font-headline-xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary-container font-extrabold">30+</h3>
              <p className="font-body-sm text-on-surface-variant mt-2">Personnes Formées</p>
            </div>
            <div className="p-md stagger-item bg-surface rounded-xl border border-outline-variant/50 shadow-sm">
              <h3 className="font-headline-xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary-container font-extrabold">4+</h3>
              <p className="font-body-sm text-on-surface-variant mt-2">Années d'Expérience</p>
            </div>
            <div className="p-md stagger-item bg-surface rounded-xl border border-outline-variant/50 shadow-sm">
              <h3 className="font-headline-xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary-container font-extrabold">10+</h3>
              <p className="font-body-sm text-on-surface-variant mt-2">Partenaires</p>
            </div>
            <div className="p-md stagger-item bg-surface rounded-xl border border-outline-variant/50 shadow-sm">
              <h3 className="font-headline-xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary-container font-extrabold">50+</h3>
              <p className="font-body-sm text-on-surface-variant mt-2">Jeunes accompagnés</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-xl bg-gradient-to-b from-surface-container-low to-surface border-t border-outline-variant/50 reveal">
        <div className="max-w-4xl mx-auto px-margin">
          <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface mb-lg text-center stagger-item">Questions fréquentes</h2>
          <div className="space-y-md">
            <details className="bg-surface rounded-xl p-md border border-outline-variant shadow-sm stagger-item">
              <summary className="font-headline-md text-body-lg font-bold cursor-pointer outline-none text-primary">Quels services proposez-vous exactement ?</summary>
              <p className="font-body-md text-on-surface-variant mt-sm">Je propose des services de design graphique, branding, communication digitale, ainsi que de la gestion de projet et planification d'événements.</p>
            </details>
            <details className="bg-surface rounded-xl p-md border border-outline-variant shadow-sm stagger-item">
              <summary className="font-headline-md text-body-lg font-bold cursor-pointer outline-none text-primary">Comment travaillez-vous avec vos clients ?</summary>
              <p className="font-body-md text-on-surface-variant mt-sm">Je collabore étroitement pour comprendre les besoins spécifiques, établir une stratégie claire et livrer des résultats avec un suivi régulier.</p>
            </details>
            <details className="bg-surface rounded-xl p-md border border-outline-variant shadow-sm stagger-item">
              <summary className="font-headline-md text-body-lg font-bold cursor-pointer outline-none text-primary">Puis-je vous engager pour une conférence ou un atelier ?</summary>
              <p className="font-body-md text-on-surface-variant mt-sm">Oui, je suis disponible pour animer des ateliers et des conférences sur le leadership, la créativité et le développement personnel.</p>
            </details>
            <details className="bg-surface rounded-xl p-md border border-outline-variant shadow-sm stagger-item">
              <summary className="font-headline-md text-body-lg font-bold cursor-pointer outline-none text-primary">Quels sont vos tarifs ?</summary>
              <p className="font-body-md text-on-surface-variant mt-sm">Mes tarifs varient en fonction de la complexité et de la durée du projet. Contactez-moi pour un devis personnalisé.</p>
            </details>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-xl bg-gradient-to-b from-surface to-surface-container-low border-t border-outline-variant/50 reveal">
        <div className="max-w-7xl mx-auto px-margin">
          <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface mb-lg text-center stagger-item">Témoignages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            <div className="bg-surface p-lg rounded-xl border border-outline-variant shadow-md stagger-item relative">
              <span className="material-symbols-outlined text-primary/10 absolute top-4 right-4 text-6xl">format_quote</span>
              <p className="font-body-lg text-on-surface italic mb-md relative z-10">"Le travail de Chabel a transformé notre approche marketing. Ses designs sont non seulement beaux, mais ils convertissent."</p>
              <p className="font-label-bold text-primary">— Marie G.</p>
            </div>
            <div className="bg-surface p-lg rounded-xl border border-outline-variant shadow-md stagger-item relative">
              <span className="material-symbols-outlined text-primary/10 absolute top-4 right-4 text-6xl">format_quote</span>
              <p className="font-body-lg text-on-surface italic mb-md relative z-10">"Un leader inspirant et un professionnel dévoué. L'organisation de notre événement a été un succès retentissant grâce à son expertise."</p>
              <p className="font-label-bold text-primary">— Paul T.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-xl bg-gradient-to-b from-surface-container-low to-surface border-t border-outline-variant/50 reveal">
        <div className="max-w-4xl mx-auto px-margin text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-md stagger-item">
            <span className="material-symbols-outlined text-[32px] text-primary">rocket_launch</span>
          </div>
          <h2 className="font-headline-xl text-headline-lg-mobile md:text-headline-xl font-extrabold text-on-surface mb-md stagger-item">Travaillons <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary-container">ensemble.</span></h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-lg  mx-auto stagger-item">
            Prêt à dynamiser votre présence numérique avec des interfaces haute performance axées sur la conversion ? Discutons de votre prochain projet.
          </p>
          <div className="flex flex-wrap justify-center gap-md stagger-item">
            <Link to="/contact" className="bg-gradient-primary text-on-primary font-label-bold text-label-bold px-lg py-md rounded-full hover:opacity-90 transition-opacity shadow-lg shadow-primary/30 tracking-wider" style={{ background: 'linear-gradient(135deg, rgb(255, 69, 0) 0%, rgb(255, 183, 0) 100%)' }}>Collaborer</Link>
            <Link to="/contact" className="text-on-primary font-label-bold text-label-bold px-lg py-md rounded-full hover:opacity-90 transition-opacity shadow-lg shadow-secondary-container/30 tracking-wider" style={{ background: 'linear-gradient(135deg, rgb(255, 69, 0) 0%, rgb(255, 183, 0) 100%)' }}>Demander un devis</Link>
            <Link to="/contact" className="border-2 border-primary text-primary font-label-bold text-label-bold px-lg py-md rounded-full hover:bg-primary/10 transition-colors tracking-wider">Réserver une formation</Link>
            <Link to="/contact" className="border-2 border-primary text-primary font-label-bold text-label-bold px-lg py-md rounded-full hover:bg-primary/10 transition-colors tracking-wider">Proposer un partenariat</Link>
          </div>
          <div className="mt-lg flex justify-center gap-md items-center text-on-surface-variant stagger-item">
            <div className="flex items-center gap-xs font-body-sm text-[12px]">
              <span className="material-symbols-outlined text-[16px] text-primary">lock</span> Plateforme sécurisée
            </div>
            <span className="w-1 h-1 bg-outline-variant rounded-full"></span>
            <div className="flex items-center gap-xs font-body-sm text-[12px]">
              <span className="material-symbols-outlined text-[16px] text-primary">download</span> Livraison rapide
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
