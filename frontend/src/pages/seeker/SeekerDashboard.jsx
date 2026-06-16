import React,{useEffect,useState}from"react";
import{Link}from"react-router-dom";
import axios from"axios";
import{useAuth}from"../../context/AuthContext";
import I from"../../components/Icons";

const ago=d=>{const s=Math.floor((Date.now()-new Date(d))/1000);if(s<60)return"just now";if(s<3600)return Math.floor(s/60)+"m ago";if(s<86400)return Math.floor(s/3600)+"h ago";return Math.floor(s/86400)+"d ago";};
const SM={pending:{l:"Pending",c:"tag-amber"},shortlisted:{l:"Shortlisted",c:"tag-green"},rejected:{l:"Rejected",c:"tag-red"}};

const Sidebar=({active})=>(
  <aside className="side">
    <div className="side-group">
      <div className="side-label">Navigation</div>
      {[{to:"/seeker/dashboard",l:"Dashboard",icon:<I.dash/>},{to:"/seeker/jobs",l:"Browse Jobs",icon:<I.search/>},{to:"/seeker/applications",l:"Applications",icon:<I.apps/>},{to:"/seeker/saved",l:"Saved Jobs",icon:<I.bookmark/>}].map(x=>(
        <Link key={x.to} to={x.to} className={"side-link"+(active===x.to?" on":"")}>{x.icon}{x.l}</Link>
      ))}
    </div>
  </aside>
);

export default function SeekerDashboard(){
  const{user}=useAuth();
  const[apps,setApps]=useState([]);const[loading,setL]=useState(true);
  useEffect(()=>{axios.get("/api/applications/mine").then(r=>setApps(r.data)).catch(()=>{}).finally(()=>setL(false));}, []);
  const total=apps.length,sl=apps.filter(a=>a.status==="shortlisted").length,pend=apps.filter(a=>a.status==="pending").length,rej=apps.filter(a=>a.status==="rejected").length;
  return(
    <div className="page">
      <div className="shell">
        <Sidebar active="/seeker/dashboard"/>
        <main className="main">
          <div className="pg-head">
            <h1>Good morning, {user?.name?.split(" ")[0]}</h1>
            <p>Here is a summary of your job search activity</p>
          </div>
          <div className="stats">
            {[{n:loading?"—":total,l:"Total applied",icon:<I.apps/>},{n:loading?"—":pend,l:"Awaiting response",icon:<I.clock/>},{n:loading?"—":sl,l:"Shortlisted",icon:<I.check/>},{n:loading?"—":rej,l:"Not selected",icon:<I.x/>}].map(s=>(
              <div key={s.l} className="stat">
                <div style={{color:"var(--text-3)",marginBottom:10}}>{s.icon}</div>
                <div className="stat-num">{s.n}</div>
                <div className="stat-lbl">{s.l}</div>
              </div>
            ))}
          </div>
          <div className="sep"/>
          <div className="sec-head">
            <div><div className="sec-title">Recent applications</div><div className="sec-sub">Your last 5 submissions</div></div>
            <Link to="/seeker/applications" className="btn btn-ghost btn-sm">View all</Link>
          </div>
          {loading?<div style={{display:"flex",flexDirection:"column",gap:8}}>{[1,2,3].map(i=><div key={i} className="skel" style={{height:56}}/>)}</div>
          :apps.length===0?<div className="empty card"><I.brief style={{width:32,height:32,margin:"0 auto 12px",display:"block",color:"var(--text-3)"}}/><h3>No applications yet</h3><p>Start browsing jobs to get started</p><Link to="/seeker/jobs" className="btn btn-primary btn-sm" style={{marginTop:14,display:"inline-flex"}}>Browse jobs</Link></div>
          :<div className="tbl-wrap"><table className="tbl"><thead><tr><th>Position</th><th>Company</th><th>Applied</th><th>Status</th></tr></thead><tbody>
            {apps.slice(0,5).map(a=><tr key={a.id}><td style={{fontWeight:600,color:"var(--text)"}}>{a.job_title}</td><td>{a.company}</td><td style={{color:"var(--text-3)",fontSize:12}}>{ago(a.applied_at)}</td><td><span className={"tag "+(SM[a.status]?.c||"tag-amber")}>{SM[a.status]?.l||a.status}</span></td></tr>)}
          </tbody></table></div>}
          <div className="sep"/>
          <div className="sec-head"><div className="sec-title">Quick actions</div></div>
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
            <Link to="/seeker/jobs" className="btn btn-primary"><I.search/>Browse jobs</Link>
            <Link to="/seeker/applications" className="btn btn-ghost"><I.apps/>My applications</Link>
            <Link to="/seeker/saved" className="btn btn-ghost"><I.bookmark/>Saved jobs</Link>
          </div>
        </main>
      </div>
    </div>
  );
}
export{Sidebar};
