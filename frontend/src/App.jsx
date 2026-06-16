import React from"react";
import{BrowserRouter,Routes,Route,Navigate}from"react-router-dom";
import{AuthProvider}from"./context/AuthContext";
import{ToastProvider}from"./context/ToastContext";
import ProtectedRoute from"./components/ProtectedRoute";
import Navbar from"./components/Navbar";
import LandingPage from"./pages/LandingPage";
import Login from"./pages/Login";
import Register from"./pages/Register";
import SeekerDashboard from"./pages/seeker/SeekerDashboard";
import BrowseJobs from"./pages/seeker/BrowseJobs";
import JobDetail from"./pages/seeker/JobDetail";
import MyApplications from"./pages/seeker/MyApplications";
import SavedJobs from"./pages/seeker/SavedJobs";
import RecruiterDashboard from"./pages/recruiter/RecruiterDashboard";
import PostJob from"./pages/recruiter/PostJob";
import ManageJobs from"./pages/recruiter/ManageJobs";
import ViewApplicants from"./pages/recruiter/ViewApplicants";

export default function App(){
  return(
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Navbar/>
          <Routes>
            <Route path="/" element={<LandingPage/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/seeker/dashboard" element={<ProtectedRoute role="seeker"><SeekerDashboard/></ProtectedRoute>}/>
            <Route path="/seeker/jobs" element={<ProtectedRoute><BrowseJobs/></ProtectedRoute>}/>
            <Route path="/seeker/jobs/:id" element={<ProtectedRoute><JobDetail/></ProtectedRoute>}/>
            <Route path="/seeker/applications" element={<ProtectedRoute role="seeker"><MyApplications/></ProtectedRoute>}/>
            <Route path="/seeker/saved" element={<ProtectedRoute role="seeker"><SavedJobs/></ProtectedRoute>}/>
            <Route path="/recruiter/dashboard" element={<ProtectedRoute role="recruiter"><RecruiterDashboard/></ProtectedRoute>}/>
            <Route path="/recruiter/post-job" element={<ProtectedRoute role="recruiter"><PostJob/></ProtectedRoute>}/>
            <Route path="/recruiter/manage-jobs" element={<ProtectedRoute role="recruiter"><ManageJobs/></ProtectedRoute>}/>
            <Route path="/recruiter/applicants/:jobId" element={<ProtectedRoute role="recruiter"><ViewApplicants/></ProtectedRoute>}/>
            <Route path="*" element={<Navigate to="/" replace/>}/>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
