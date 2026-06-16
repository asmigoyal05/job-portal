import React,{useEffect,useState}from"react";
import{Link}from"react-router-dom";
import axios from"axios";
import I from"../../components/Icons";

const SM={pending:{l:"Pending",c:"tag-amber"},shortlisted:{l:"Shortlisted",c:"tag-green"},rejected:{l:"Not selected",c:"tag-red"}};
const TYPE={["full-time"]:"tag-purple",["part-time"]:"tag-blue",remote:"tag-green",internship:"tag-amber"};
const ago=d=>{const s=Math.floor((Date.now()-new Date(d))/1000);if(s<3600)return Math.floor(s/60)+"m ago";if(s<86400)return Math.floor(s/3600)+"h ago";return Math.floor(s/86400)+"d ago";};

export default function MyApplications(){
  const[apps,setApps]=useState([]);const[loading,setL]=useState(true);const[filter,setFilter]=useState("all");
  useEffect(()=>{axios.get("/api/applications/mine").then(r=>setApps(r.data)).catch(()=>{}).finally(()=>setL(false));}, []);
  const filtered=filter==="all"?apps:apps.filter(a=>a.status===filter);
  return(
    <div className="page">
      <div className="shell">
        <aside className="side">
          <div className="side-label">Navigation</div>
          {[{to:"/seeker/dashboard",l:"Dashboard",icon:<I.dash/>},{to:"/seeker/jobs",l:"Browse Jobs",icon:<I.search/>},{to:"/seeker/applications",l:"Applications",icon:<I.apps/>},{to:"/seeker/saved",l:"Saved Jobs",icon:<I.bookmark/>}].map(x=><Link key={x.to} to={x.to} className={"side-link"+(x.to==="/seeker/applications"?" on":"")}>{x.icon}{x.l}</Link>)}
        </aside>
        <main className="main">
          <div className="pg-head"><h1>My Applications</h1><p>{apps.length} total submissions</p></div>
          <div className="chips" style={{marginBottom:20}}>
            {["all","pending","shortlisted","rejected"].map(f=><button key={f} className={"chip"+(filter===f?" on":"")} onClick={()=>setFilter(f)}>{f==="all"?"All":`${f.charAt(0).toUpperCase()+f.slice(1)} (${apps.filter(a=>a.status===f).length})`}</button>)}
          </div>
          {loading?<div style={{display:"flex",flexDirection:"column",gap:8}}>{[1,2,3,4].map(i=><div key={i} className="skel" style={{height:64}}/>)}</div>
          :filtered.length===0?<div className="empty card card-p"><I.apps style={{width:28,height:28,margin:"0 auto 10px",display:"block",color:"var(--text-3)"}}/><h3>{filter==="all"?"No applications yet":"Nothing here"}</h3><p>{filter==="all"?"Browse and apply to jobs to see them here":"Try a different filter"}</p>{filter==="all"&&<Link to="/seeker/jobs" className="btn btn-primary btn-sm" style={{marginTop:14,display:"inline-flex"}}>Browse jobs</Link>}</div>
          :<div style={{display:"flex",flexDirection:"column",gap:8}}>
            {filtered.map(a=>{
              const s=SM[a.status]||SM.pending;
              return(
                <div key={a.id} className="card" style={{padding:"14px 18px",display:"flex",alignItems:"center",gap:14}}>
                  <div style={{width:38,height:38,borderRadius:9,background:"var(--bg-3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:"var(--text-2)",flexShrink:0,border:"1px solid var(--border)"}}>{a.company?.[0]?.toUpperCase()}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:600,fontSize:14,color:"var(--text)",marginBottom:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.job_title}</div>
                    <div style={{fontSize:12,color:"var(--text-3)",display:"flex",gap:8,flexWrap:"wrap"}}>
                      <span>{a.company}</span>
                      {a.location&&<span>· {a.location}</span>}
                      {a.type&&<span className={"tag "+TYPE[a.type]} style={{marginLeft:2}}>{a.type}</span>}
                    </div>
                  </div>
                  <div style={{textAlign:"right",flexShrink:0}}>
                    <span className={"tag "+s.c}>{s.l}</span>
                    <div style={{fontSize:11,color:"var(--text-3)",marginTop:5}}>{ago(a.applied_at)}</div>
                  </div>
                </div>
              );
            })}
          </div>}
        </main>
      </div>
    </div>
  );
}
