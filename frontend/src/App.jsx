import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';
export default function App(){return <BrowserRouter><AuthProvider><AppRoutes/><Toaster position="top-right" toastOptions={{duration:3500,style:{color:'#fff',background:'#071723',border:'1px solid rgba(255,255,255,.12)',borderRadius:'12px',boxShadow:'0 18px 45px rgba(7,23,35,.22)'}}}/></AuthProvider></BrowserRouter>}

