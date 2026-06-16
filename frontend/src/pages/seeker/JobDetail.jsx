import React,{useEffect,useState}from"react";
import{useParams,Link,useNavigate}from"react-router-dom";
import axios from"axios";
import{useAuth}from"../../context/AuthContext";
import I from"../../components/Icons";

const COLORS=["#7c6af7","#3b82f6","#22c55e","#f59e0b","#ef4444","#ec4899","#06b6d4"];
const TYPE={["full-time"]:"tag-purple",["part-time"]:"tag-blue",remote:"tag-green",internship:"tag-amber"};
const SM={pending:{l:"Pending review",c:"tag-amber"},shortlisted:{l:"Shortlisted",c:"tag-green"},rejected:{l:"Not selected",c:"tag-red"}};
const ago=d=>{const s=Math.floor((Date.now()-new Date(d))/1000);if(s<3600)return Math.floor(s/60)+"m ago";if(s<86400)return Math.floor(s/3600)+"h ago";return Math.floor(s/86400)+"d ago";};

export default function JobDetail(){
  const{id}=useParams();const{user}=useAuth();const nav=useNavigate();
  const[job,setJob]=useState(null);const[app,setApp]=useState(null);
  const[loading,setL]=useState(true);const[applying,setA]=useState(false);
  const[err,setErr]=useState("");const[ok,setOk]=useState("");
  const[saved,setSaved]=useState(()=>JSON.parse(localStorage.getItem("saved")||"[]").includes(parseInt(id)));

  useEffect(()=>{
    Promise.all([axios.get(`/api/jobs/${id}`),user?.role==="seeker"?axios.get("/api/applications/mine"):Promise.resolve({data:[]})])
      .then(([jr,ar])=>{setJob(jr.data);const ex=ar.data.find(a=>a.job_id===parseInt(id));if(ex)setApp(ex);})
      .catch(()=>setErr("Failed to load job"))
      .finally(()=>setL(false));
  },[id,user]);

  const apply=async()=>{setA(true);setErr("");
    try{const r=await axios.post("/api/applications",{job_id:parseInt(id)});setApp(r.data);setOk("Application submitted!");}
    catch(e){setErr(e.response?.data?.message||"Failed to apply");}
    finally{setA(false);}};

  const toggleSave=()=>{const cur=JSON.parse(localStorage.getItem("saved")||"[]");const iid=parseInt(id);const n=cur.includes(iid)?cur.filter(x=>x!==iid):[...cur,iid];localStorage.setItem("saved",JSON.stringify(n));setSaved(!saved);};

  if(loading)return<div className="page"><div className="container" style={{paddingTop:40}}><div className="skel" style={{height:300,borderRadius:12}}/></div></div>;
  if(!job)return<div className="page" style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"80vh"}}><div className="empty"><h3>Job not found</h3><Link to="/seeker/jobs" className="btn btn-ghost btn-sm" style={{marginTop:12,display:"inline-flex"}}>← Back</Link></div></div>;

  const c=COLORS[job.id%COLORS.length];
  return(
    <div className="page">
      <div className="container" style={{paddingTop:32,paddingBottom:60}}>
        <button className="btn btn-ghost btn-sm" onClick={()=>nav(-1)} style={{marginBottom:20,display:"inline-flex",alignItems:"center",gap:6}}><I.arrow style={{width:14,height:14}}/>Back to results</button>
        <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:20,alignItems:"start"}}>
          <div>
            <div className="card card-p-lg" style={{marginBottom:12}}>
              <div style={{display:"flex",gap:16,alignItems:"flex-start",marginBottom:20}}>
                <div style={{width:52,height:52,borderRadius:12,background:c,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:700,color:"#fff",border:"1px solid rgba(255,255,255,0.1)",flexShrink:0}}>{job.company?.[0]?.toUpperCase()}</div>
                <div style={{flex:1}}>
                  <h1 style={{fontSize:20,fontWeight:700,letterSpacing:"-0.5px",marginBottom:4}}>{job.title}</h1>
                  <div style={{fontSize:13,color:"var(--text-2)"}}>{job.company} · posted by {job.recruiter_name} · {ago(job.created_at)}</div>
                </div>
                <button className={"save-btn"+(saved?" saved":"")} onClick={toggleSave} style={{marginTop:4}}><I.bookmark/></button>
              </div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                <span className={"tag "+(TYPE[job.type]||"tag-neutral")}>{job.type}</span>
                {job.location&&<span className="tag tag-neutral"><I.loc style={{width:11,height:11}}/>  {job.location}</span>}
                {job.salary&&<span className="tag tag-neutral"><I.money style={{width:11,height:11}}/>  {job.salary}</span>}
              </div>
            </div>
            {job.description&&<div className="card card-p-lg" style={{marginBottom:12}}><div style={{fontSize:13,fontWeight:600,marginBottom:12,color:"var(--text-2)",letterSpacing:"0.3px",textTransform:"uppercase",fontSize:11}}>About the role</div><p style={{fontSize:14,color:"var(--text-2)",lineHeight:1.8,whiteSpace:"pre-wrap"}}>{job.description}</p></div>}
            {job.requirements&&<div className="card card-p-lg"><div style={{fontSize:11,fontWeight:600,marginBottom:12,color:"var(--text-2)",letterSpacing:"0.3px",textTransform:"uppercase"}}>Requirements</div><p style={{fontSize:14,color:"var(--text-2)",lineHeight:1.8,whiteSpace:"pre-wrap"}}>{job.requirements}</p></div>}
          </div>
          <div style={{position:"sticky",top:76}}>
            <div className="card card-p">
              {ok&&<div className="alert alert-ok">{ok}</div>}
              {err&&<div className="alert alert-err">{err}</div>}
              {app?(
                <div style={{textAlign:"center",padding:"8px 0"}}>
                  <div style={{fontSize:13,fontWeight:600,marginBottom:10}}>Application submitted</div>
                  <span className={"tag "+(SM[app.status]?.c||"tag-amber")}>{SM[app.status]?.l||app.status}</span>
                  <div style={{fontSize:11,color:"var(--text-3)",marginTop:10}}>Applied {ago(app.applied_at)}</div>
                </div>
              ):user?.role==="seeker"?(
                <button className="btn btn-primary btn-full" onClick={apply} disabled={applying}>{applying?"Submitting…":"Apply now"}</button>
              ):(
                <div className="alert alert-info" style={{margin:0}}>Sign in as a job seeker to apply</div>
              )}
              <div className="divider"/>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {[["Job type",job.type],["Location",job.location||"Not specified"],["Salary",job.salary||"Not disclosed"],["Company",job.company]].map(([k,v])=>(
                  <div key={k} style={{display:"flex",justifyContent:"space-between",fontSize:13}}>
                    <span style={{color:"var(--text-3)"}}>{k}</span>
                    <span style={{color:"var(--text)",fontWeight:500}}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
