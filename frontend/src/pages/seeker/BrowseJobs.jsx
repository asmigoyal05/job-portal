import React,{useEffect,useState,useCallback}from"react";
import{useNavigate,Link}from"react-router-dom";
import axios from"axios";
import I from"../../components/Icons";

const COLORS=["#7c6af7","#3b82f6","#22c55e","#f59e0b","#ef4444","#ec4899","#06b6d4"];
const ago=d=>{const s=Math.floor((Date.now()-new Date(d))/1000);if(s<3600)return Math.floor(s/60)+"m ago";if(s<86400)return Math.floor(s/3600)+"h ago";return Math.floor(s/86400)+"d ago";};
const TYPE={["full-time"]:"tag-purple",["part-time"]:"tag-blue",remote:"tag-green",internship:"tag-amber"};

function JCard({job,saved,onSave}){
  const nav=useNavigate();
  const c=COLORS[job.id%COLORS.length];
  return(
    <div className="card jcard" onClick={()=>nav(`/seeker/jobs/${job.id}`)}>
      <div className="jcard-top">
        <div className="jcard-logo" style={{background:c}}>{job.company?.[0]?.toUpperCase()}</div>
        <div className="jcard-info">
          <div className="jcard-title">{job.title}</div>
          <div className="jcard-co">{job.company} · {job.recruiter_name}</div>
        </div>
      </div>
      <div className="jcard-meta">
        {job.location&&<span><I.loc/>  {job.location}</span>}
        {job.salary&&<span><I.money/>  {job.salary}</span>}
      </div>
      {job.description&&<p style={{fontSize:12.5,color:"var(--text-3)",marginBottom:12,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden",lineHeight:1.6}}>{job.description}</p>}
      <div className="jcard-foot">
        <span className={"tag "+(TYPE[job.type]||"tag-neutral")}>{job.type}</span>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span className="jcard-age">{ago(job.created_at)}</span>
          <button className={"save-btn"+(saved?" saved":"")} onClick={e=>{e.stopPropagation();onSave(job.id);}}>
            <I.bookmark/>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BrowseJobs(){
  const[jobs,setJobs]=useState([]);const[loading,setL]=useState(true);
  const[q,setQ]=useState("");const[type,setType]=useState("all");
  const[saved,setSaved]=useState(()=>JSON.parse(localStorage.getItem("saved")||"[]"));
  const fetch=useCallback(async()=>{
    setL(true);
    try{const p={};if(q)p.search=q;if(type!=="all")p.type=type;
      const r=await axios.get("/api/jobs",{params:p});setJobs(r.data);}
    catch{}finally{setL(false);}
  },[q,type]);
  useEffect(()=>{const t=setTimeout(fetch,280);return()=>clearTimeout(t);},[fetch]);
  const toggleSave=id=>{const n=saved.includes(id)?saved.filter(x=>x!==id):[...saved,id];setSaved(n);localStorage.setItem("saved",JSON.stringify(n));};

  return(
    <div className="page">
      <div className="shell">
        <aside className="side">
          <div className="side-label">Navigation</div>
          {[{to:"/seeker/dashboard",l:"Dashboard",icon:<I.dash/>},{to:"/seeker/jobs",l:"Browse Jobs",icon:<I.search/>},{to:"/seeker/applications",l:"Applications",icon:<I.apps/>},{to:"/seeker/saved",l:"Saved Jobs",icon:<I.bookmark/>}].map(x=><Link key={x.to} to={x.to} className={"side-link"+(x.to==="/seeker/jobs"?" on":"")}>{x.icon}{x.l}</Link>)}
        </aside>
        <main className="main">
          <div className="pg-head"><h1>Browse Jobs</h1><p>{jobs.length} positions available</p></div>
          <div className="searchbar" style={{marginBottom:12}}>
            <I.search/><input placeholder="Search by title, company or location…" value={q} onChange={e=>setQ(e.target.value)}/>
            {q&&<button onClick={()=>setQ("")} style={{background:"none",border:"none",color:"var(--text-3)",cursor:"pointer",fontSize:16}}>×</button>}
          </div>
          <div className="chips" style={{marginBottom:20}}>
            {["all","full-time","part-time","remote","internship"].map(t=><button key={t} className={"chip"+(type===t?" on":"")} onClick={()=>setType(t)}>{t==="all"?"All types":t}</button>)}
          </div>
          {loading?<div className="jobs-grid">{[1,2,3,4,5,6].map(i=><div key={i} className="skel" style={{height:200}}/>)}</div>
          :jobs.length===0?<div className="empty card card-p"><I.search style={{width:28,height:28,margin:"0 auto 10px",display:"block",color:"var(--text-3)"}}/><h3>No jobs found</h3><p>Try a different search or filter</p></div>
          :<div className="jobs-grid">{jobs.map(j=><JCard key={j.id} job={j} saved={saved.includes(j.id)} onSave={toggleSave}/>)}</div>}
        </main>
      </div>
    </div>
  );
}
