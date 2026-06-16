import React,{useEffect,useState}from"react";
import{Link,useNavigate}from"react-router-dom";
import axios from"axios";
import I from"../../components/Icons";

const COLORS=["#7c6af7","#3b82f6","#22c55e","#f59e0b","#ef4444","#ec4899","#06b6d4"];
const TYPE={["full-time"]:"tag-purple",["part-time"]:"tag-blue",remote:"tag-green",internship:"tag-amber"};

export default function SavedJobs(){
  const[jobs,setJobs]=useState([]);const[loading,setL]=useState(true);const nav=useNavigate();
  const savedIds=JSON.parse(localStorage.getItem("saved")||"[]");
  useEffect(()=>{
    if(savedIds.length===0){setL(false);return;}
    axios.get("/api/jobs").then(r=>setJobs(r.data.filter(j=>savedIds.includes(j.id)))).catch(()=>{}).finally(()=>setL(false));
  },[]);
  const unsave=id=>{const n=savedIds.filter(x=>x!==id);localStorage.setItem("saved",JSON.stringify(n));setJobs(j=>j.filter(x=>x.id!==id));};
  return(
    <div className="page">
      <div className="shell">
        <aside className="side">
          <div className="side-label">Navigation</div>
          {[{to:"/seeker/dashboard",l:"Dashboard",icon:<I.dash/>},{to:"/seeker/jobs",l:"Browse Jobs",icon:<I.search/>},{to:"/seeker/applications",l:"Applications",icon:<I.apps/>},{to:"/seeker/saved",l:"Saved Jobs",icon:<I.bookmark/>}].map(x=><Link key={x.to} to={x.to} className={"side-link"+(x.to==="/seeker/saved"?" on":"")}>{x.icon}{x.l}</Link>)}
        </aside>
        <main className="main">
          <div className="pg-head"><h1>Saved Jobs</h1><p>{jobs.length} bookmarked positions</p></div>
          {loading?<div className="jobs-grid">{[1,2,3].map(i=><div key={i} className="skel" style={{height:180}}/>)}</div>
          :jobs.length===0?<div className="empty card card-p"><I.bookmark style={{width:28,height:28,margin:"0 auto 10px",display:"block",color:"var(--text-3)"}}/><h3>No saved jobs</h3><p>Bookmark jobs while browsing to save them here</p><Link to="/seeker/jobs" className="btn btn-primary btn-sm" style={{marginTop:14,display:"inline-flex"}}>Browse jobs</Link></div>
          :<div className="jobs-grid">{jobs.map(j=>{
            const c=COLORS[j.id%COLORS.length];
            return(
              <div key={j.id} className="card jcard" style={{cursor:"pointer"}}>
                <div onClick={()=>nav(`/seeker/jobs/${j.id}`)}>
                  <div className="jcard-top">
                    <div className="jcard-logo" style={{background:c}}>{j.company?.[0]?.toUpperCase()}</div>
                    <div className="jcard-info"><div className="jcard-title">{j.title}</div><div className="jcard-co">{j.company}</div></div>
                  </div>
                  <div className="jcard-meta">
                    {j.location&&<span><I.loc/>  {j.location}</span>}
                    {j.salary&&<span><I.money/>  {j.salary}</span>}
                  </div>
                </div>
                <div className="jcard-foot">
                  <span className={"tag "+(TYPE[j.type]||"tag-neutral")}>{j.type}</span>
                  <div style={{display:"flex",gap:8}}>
                    <button className="btn btn-ghost btn-sm" onClick={()=>nav(`/seeker/jobs/${j.id}`)}>View</button>
                    <button className="btn btn-ghost btn-sm" onClick={()=>unsave(j.id)} title="Remove"><I.x style={{width:12,height:12}}/></button>
                  </div>
                </div>
              </div>
            );
          })}</div>}
        </main>
      </div>
    </div>
  );
}
