import React,{useEffect,useState}from"react";
import{Link}from"react-router-dom";
import axios from"axios";
import{useAuth}from"../../context/AuthContext";
import I from"../../components/Icons";

const TYPE={["full-time"]:"tag-purple",["part-time"]:"tag-blue",remote:"tag-green",internship:"tag-amber"};
const ago=d=>{const s=Math.floor((Date.now()-new Date(d))/1000);if(s<3600)return Math.floor(s/60)+"m ago";if(s<86400)return Math.floor(s/3600)+"h ago";return Math.floor(s/86400)+"d ago";};

const RSide=({active})=>(
  <aside className="side">
    <div className="side-label">Navigation</div>
    {[{to:"/recruiter/dashboard",l:"Dashboard",icon:<I.dash/>},{to:"/recruiter/post-job",l:"Post a job",icon:<I.plus/>},{to:"/recruiter/manage-jobs",l:"My listings",icon:<I.folder/>}].map(x=><Link key={x.to} to={x.to} className={"side-link"+(active===x.to?" on":"")}>{x.icon}{x.l}</Link>)}
  </aside>
);

export default function RecruiterDashboard(){
  const{user}=useAuth();
  const[jobs,setJobs]=useState([]);const[loading,setL]=useState(true);
  useEffect(()=>{axios.get("/api/jobs/mine").then(r=>setJobs(r.data)).catch(()=>{}).finally(()=>setL(false));}, []);
  const total=jobs.length,applicants=jobs.reduce((s,j)=>s+(j.applicant_count||0),0),active=jobs.filter(j=>(j.applicant_count||0)>0).length;
  const week=jobs.filter(j=>(Date.now()-new Date(j.created_at))/(864e5)<7).length;
  return(
    <div className="page">
      <div className="shell">
        <RSide active="/recruiter/dashboard"/>
        <main className="main">
          <div className="pg-head"><h1>Welcome back, {user?.name?.split(" ")[0]}</h1><p>Your hiring pipeline overview</p></div>
          <div className="stats">
            {[{n:loading?"—":total,l:"Jobs posted",icon:<I.brief/>},{n:loading?"—":applicants,l:"Total applicants",icon:<I.users/>},{n:loading?"—":active,l:"Active listings",icon:<I.trend/>},{n:loading?"—":week,l:"Posted this week",icon:<I.clock/>}].map(s=>(
              <div key={s.l} className="stat"><div style={{color:"var(--text-3)",marginBottom:10}}>{s.icon}</div><div className="stat-num">{s.n}</div><div className="stat-lbl">{s.l}</div></div>
            ))}
          </div>
          <div className="sep"/>
          <div className="sec-head"><div><div className="sec-title">Recent listings</div><div className="sec-sub">Your most recently posted jobs</div></div><Link to="/recruiter/manage-jobs" className="btn btn-ghost btn-sm">View all</Link></div>
          {loading?<div style={{display:"flex",flexDirection:"column",gap:8}}>{[1,2,3].map(i=><div key={i} className="skel" style={{height:56}}/>)}</div>
          :jobs.length===0?<div className="empty card card-p"><I.brief style={{width:28,height:28,margin:"0 auto 10px",display:"block",color:"var(--text-3)"}}/><h3>No jobs posted yet</h3><p>Post your first job to start finding candidates</p><Link to="/recruiter/post-job" className="btn btn-primary btn-sm" style={{marginTop:14,display:"inline-flex"}}>Post a job</Link></div>
          :<div className="tbl-wrap"><table className="tbl"><thead><tr><th>Role</th><th>Type</th><th>Applicants</th><th>Posted</th><th>Action</th></tr></thead><tbody>
            {jobs.slice(0,6).map(j=>(
              <tr key={j.id}>
                <td><div style={{fontWeight:600,color:"var(--text)"}}>{j.title}</div><div style={{fontSize:11.5,color:"var(--text-3)"}}>{j.company}</div></td>
                <td><span className={"tag "+(TYPE[j.type]||"tag-neutral")}>{j.type}</span></td>
                <td><span style={{fontWeight:600,color:(j.applicant_count||0)>0?"var(--accent-2)":"var(--text-3)"}}>{j.applicant_count||0}</span></td>
                <td style={{fontSize:12,color:"var(--text-3)"}}>{ago(j.created_at)}</td>
                <td><Link to={`/recruiter/applicants/${j.id}`} className="btn btn-ghost btn-sm">View applicants</Link></td>
              </tr>
            ))}
          </tbody></table></div>}
          <div className="sep"/>
          <div className="sec-head"><div className="sec-title">Quick actions</div></div>
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
            <Link to="/recruiter/post-job" className="btn btn-primary"><I.plus/>Post new job</Link>
            <Link to="/recruiter/manage-jobs" className="btn btn-ghost"><I.folder/>Manage listings</Link>
          </div>
        </main>
      </div>
    </div>
  );
}
export{RSide};
