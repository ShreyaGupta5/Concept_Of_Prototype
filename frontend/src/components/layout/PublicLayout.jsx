import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { ArrowRight, Menu, Waves, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const links = [['Services', '/services'], ['How it works', '/how-it-works'], ['About', '/about'], ['Contact', '/contact']];
export default function PublicLayout() {
  const [open, setOpen] = useState(false); const { user } = useAuth();
  return <><header className="navbar"><div className="container navbar-inner"><Link className="brand" to="/"><span className="brand-mark"><Waves size={20}/></span>CampusFlow</Link><nav className="nav-links" aria-label="Main navigation">{links.map(([label, to]) => <NavLink key={to} to={to}>{label}</NavLink>)}</nav><div className="nav-actions">{user ? <Link className="button button-primary" to={user.role === 'admin' ? '/admin' : '/app'}>Open dashboard <ArrowRight size={16}/></Link> : <><Link className="button button-secondary" to="/login">Sign in</Link><Link className="button button-primary" to="/register">Get started</Link></>}<button className="icon-button mobile-menu" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Toggle navigation">{open ? <X/> : <Menu/>}</button></div></div>{open && <nav className="container pb-4 grid gap-2 md:hidden">{links.map(([label, to]) => <Link className="p-3 rounded-xl bg-slate-50" onClick={() => setOpen(false)} key={to} to={to}>{label}</Link>)}</nav>}</header><main className="public-main"><Outlet/></main><Footer/></>;
}
function Footer(){return <footer className="footer"><div className="container"><div className="footer-grid"><div><Link className="brand text-white" to="/"><span className="brand-mark"><Waves size={20}/></span>CampusFlow</Link><p className="max-w-sm text-sm text-slate-400 mt-4">A calmer, more transparent way to access the campus services that keep student life moving.</p></div><div><h4>Product</h4><Link to="/services">Services</Link><Link to="/how-it-works">How it works</Link><Link to="/login">Sign in</Link></div><div><h4>Company</h4><Link to="/about">About</Link><Link to="/contact">Contact</Link></div><div><h4>For campus teams</h4><Link to="/login">Admin portal</Link><Link to="/about">Accessibility</Link></div></div><div className="footer-bottom">© 2026 CampusFlow · NMG Forge Concept to Prototype</div></div></footer>}

