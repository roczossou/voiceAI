import { Link, NavLink } from 'react-router-dom';

export function Header({ currentPath, onOpenMenu, menuTriggerRef }) {
  const getNavClass = (isActive) => {
    const baseClass = "font-label-lg text-label-lg scale-95 active:scale-90 transition-all";
    if (isActive) {
      return `${baseClass} text-secondary font-bold border-b-2 border-secondary pb-1`;
    }
    return `${baseClass} text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-secondary-fixed`;
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md dark:bg-on-surface/80 border-b border-outline-variant dark:border-outline">
      <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto h-20">
        <Link to="/" className="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed">
          CHABEL ANANOUNON
        </Link>
        <div className="hidden md:flex gap-6 items-center">
          <NavLink to="/" className={({ isActive }) => getNavClass(isActive || currentPath === '/')}>Home</NavLink>
          <NavLink to="/projets" className={({ isActive }) => getNavClass(isActive)}>Projects</NavLink>
          <NavLink to="/blog" className={({ isActive }) => getNavClass(isActive)}>Blog</NavLink>
          <NavLink to="/a-propos" className={({ isActive }) => getNavClass(isActive)}>About</NavLink>
          <NavLink to="/contact" className={({ isActive }) => getNavClass(isActive)}>Contact</NavLink>
        </div>
        <Link to="/contact" className="bg-secondary-container text-on-background font-label-lg text-label-lg px-6 py-3  hard-shadow hover:-translate-y-1 hover:hard-shadow-orange transition-all hidden md:block">
          Hire Me
        </Link>
        <button 
          ref={menuTriggerRef}
          onClick={onOpenMenu}
          className="md:hidden text-primary"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
      </div>
    </nav>
  );
}
