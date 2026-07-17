import { Navigate, Route, Routes } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import DashboardLayout from '../components/layout/DashboardLayout';
import Home from '../pages/public/Home';
import Services from '../pages/public/Services';
import { About, Contact, HowItWorks } from '../pages/public/InfoPages';
import { ForgotPassword, Login, Register } from '../pages/auth/AuthPages';
import StudentDashboard from '../pages/student/StudentDashboard';
import { BrowseServices, MyTokens, Profile, ServiceDetails } from '../pages/student/StudentPages';
import Notifications from '../pages/student/Notifications';
import Feedback from '../pages/student/Feedback';
import MyAppointments from '../pages/student/MyAppointments';
import { AdminDashboard, Analytics, FeedbackManagement, ManageAppointments, ManageQueue, ManageServices, ManageStudents } from '../pages/admin/AdminPages';
import { useAuth } from '../context/AuthContext';
import { Spinner } from '../components/common/UI';

function Guard({admin=false,children}){const {user,loading}=useAuth();if(loading)return <Spinner/>;if(!user)return <Navigate to="/login" replace/>;if(admin&&user.role!=='admin')return <Navigate to="/app" replace/>;if(!admin&&user.role==='admin')return <Navigate to="/admin" replace/>;return children}
export default function AppRoutes(){return <Routes><Route element={<PublicLayout/>}><Route index element={<Home/>}/><Route path="services" element={<Services/>}/><Route path="how-it-works" element={<HowItWorks/>}/><Route path="about" element={<About/>}/><Route path="contact" element={<Contact/>}/></Route><Route path="login" element={<Login/>}/><Route path="register" element={<Register/>}/><Route path="forgot-password" element={<ForgotPassword/>}/><Route path="app" element={<Guard><DashboardLayout/></Guard>}><Route index element={<StudentDashboard/>}/><Route path="services" element={<BrowseServices/>}/><Route path="services/:id" element={<ServiceDetails/>}/><Route path="tokens" element={<MyTokens/>}/><Route path="appointments" element={<MyAppointments/>}/><Route path="notifications" element={<Notifications/>}/><Route path="feedback" element={<Feedback/>}/><Route path="profile" element={<Profile/>}/></Route><Route path="admin" element={<Guard admin><DashboardLayout admin/></Guard>}><Route index element={<AdminDashboard/>}/><Route path="services" element={<ManageServices/>}/><Route path="queues" element={<ManageQueue/>}/><Route path="appointments" element={<ManageAppointments/>}/><Route path="students" element={<ManageStudents/>}/><Route path="analytics" element={<Analytics/>}/><Route path="feedback" element={<FeedbackManagement/>}/></Route><Route path="*" element={<NotFound/>}/></Routes>}
function NotFound(){return <main className="min-h-screen grid place-items-center p-6 bg-slate-50 text-center"><div><span className="font-number text-8xl font-bold text-indigo-200">404</span><h1 className="text-3xl mt-3">This path doesn’t lead to a campus desk</h1><p className="text-slate-500">The page may have moved, or the link may be incomplete.</p><a className="button button-primary mt-5" href="/">Return home</a></div></main>}
