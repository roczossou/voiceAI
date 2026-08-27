import { Link, NavLink } from 'react-router-dom';

export function Header({ currentPath, onOpenMenu, menuTriggerRef }) {
  const getNavClass = (isActive) => {
    const baseClass = "font-body-md text-body-md transition-colors duration-200";
    if (isActive) {
      return `${baseClass} text-primary font-bold border-b-2 border-primary pb-1`;
    }
    return `${baseClass} text-on-surface-variant hover:text-primary`;
  };

  return (
    <header className="bg-surface/80 backdrop-blur-md border-b border-outline-variant fixed top-0 w-full z-50">
      <div className="flex justify-between items-center px-margin py-sm max-w-[1280px] mx-auto">
        <Link to="/" className="font-headline-md text-[13px] md:text-headline-md font-bold text-primary whitespace-nowrap">
          CHABEL ANANOUNON
        </Link>
        <nav className="hidden md:flex gap-lg items-center">
          <NavLink to="/" className={({ isActive }) => getNavClass(isActive || currentPath === '/')}>Home</NavLink>
          <NavLink to="/projets" className={({ isActive }) => getNavClass(isActive)}>Projects</NavLink>
          <NavLink to="/blog" className={({ isActive }) => getNavClass(isActive)}>Blog</NavLink>
          <NavLink to="/a-propos" className={({ isActive }) => getNavClass(isActive)}>About</NavLink>
          <NavLink to="/contact" className={({ isActive }) => getNavClass(isActive)}>Contact</NavLink>
        </nav>
        <Link to="/contact" className="bg-gradient-primary text-on-primary font-label-bold text-label-bold px-md py-sm rounded-full hidden md:block hover:opacity-90 transition-opacity" style={{ background: 'linear-gradient(135deg, rgb(255, 69, 0) 0%, rgb(255, 183, 0) 100%)' }}>
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
    </header>
  );
}
