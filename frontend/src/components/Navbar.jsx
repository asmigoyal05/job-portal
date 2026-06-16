import React from"react";
import{Link,NavLink,useNavigate}from"react-router-dom";
import{useAuth}from"../context/AuthContext";
import I from"./Icons";

const Navbar=()=>{
  const{user,logout}=useAuth();
  const nav=useNavigate();
  const out=()=>{logout();nav("/");};
  const init=user?.name?.split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2)||"?";
  const seekLinks=[{to:"/seeker/dashboard",l:"Dashboard"},{to:"/seeker/jobs",l:"Browse Jobs"},{to:"/seeker/applications",l:"Applications"}];
  const recLinks=[{to:"/recruiter/dashboard",l:"Dashboard"},{to:"/recruiter/post-job",l:"Post Job"},{to:"/recruiter/manage-jobs",l:"My Listings"}];
  const links=user?.role==="seeker"?seekLinks:user?.role==="recruiter"?recLinks:[];
  return(
    <nav className="nav">
      <Link to="/" className="nav-logo">
        <div className="nav-logo-mark"><I.logo/></div>
        HireFlow
      </Link>
      {user&&<div className="nav-links">{links.map(l=><NavLink key={l.to} to={l.to} className={({isActive})=>"nav-link"+(isActive?" active":"")}>{l.l}</NavLink>)}</div>}
      <div className="nav-right">
        {user?(
          <>
            <div className="nav-user" style={{textAlign:"right"}}>
              <div className="nav-user-name">{user.name}</div>
              <div className="nav-user-role">{user.role}</div>
            </div>
            <div className="nav-avatar">{init}</div>
            <button className="btn btn-ghost btn-sm" onClick={out}>Sign out</button>
          </>
        ):(
          <>
            <Link to="/login" className="btn btn-ghost btn-sm">Sign in</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Get started</Link>
          </>
        )}
      </div>
    </nav>
  );
};
export default Navbar;
