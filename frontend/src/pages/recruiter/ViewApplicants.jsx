import React,{useEffect,useState}from"react";
import{useParams,Link}from"react-router-dom";
import axios from"axios";
import{RSide}from"./RecruiterDashboard";
import I from"../../components/Icons";

const SM={pending:{l:"Pending",c:"tag-amber"},shortlisted:{l:"Shortlisted",c:"tag-green"},rejected:{l:"Not selected",c:"tag-red"}};
const ago=d=>{const s=Math.floor((Date.now()-new Date(d))/1000);if(s<3600)return Math.floor(s/60)+"m ago";if(s<86400)return Math.floor(s/3600)+"h ago";return Math.floor(s/86400)+"d ago";};

export default function ViewApplicants(){
  const{jobId}=useParams();
  const[data,setData]=useState(null);const[loading,setL]=useState(true);
  const[updId,setUpdId]=useState(null);const[filter,setFilter]=useState("all");const[msg,setMsg]=useState("");
  useEffect(()=>{axios.get(`/api/applications/job/${jobId}`).then(r=>setData(r.data)).catch(()=>{}).finally(()=>setL(false));}, [jobId]);
  const update=async(id,status)=>{setUpdId(id);
    try{const r=await axios.put(`/api/applications/${id}/status`,{status});setData(p=>({...p,applicants:p.applicants.map(a=>a.id===id?{...a,status:r.data.status}:a)}));setMsg("Status updated");setTimeout(()=>setMsg(""),2000);}
    catch{setMsg("Failed to update");}finally{setUpdId(null);}};
  const list=filter==="all"?data?.applicants||[]:(data?.applicants||[]).filter(a=>a.status===filter);
  return(
    <div className="page">
      <div className="shell">
        <RSide active="/recruiter/manage-jobs"/>
        <main className="main">
          <Link to="/recruiter/manage-jobs" className="btn btn-ghost btn-sm" style={{marginBottom:20,display:"inline-flex",alignItems:"center",gap:6}}><I.arrow style={{width:14,height:14}}/>Back to listings</Link>
          {loading?<div style={{display:"flex",flexDirection:"column",gap:8}}>{[1,2,3,4].map(i=><div key={i} className="skel" style={{height:64}}/>)}</div>:(
            <>
              <div className="pg-head">
                <h1>{data?.job?.title||"Applicants"}</h1>
                <p>{data?.applicants?.length||0} applicants · {data?.job?.company}</p>
              </div>
              {msg&&<div className={`alert ${msg.includes("Failed")?"alert-err":"alert-ok"}`}>{msg}</div>}
              <div className="chips" style={{marginBottom:20}}>
                {["all","pending","shortlisted","rejected"].map(f=>{const cnt=f==="all"?data?.applicants?.length||0:(data?.applicants||[]).filter(a=>a.status===f).length;return<button key={f} className={"chip"+(filter===f?" on":"")} onClick={()=>setFilter(f)}>{f==="all"?"All":f.charAt(0).toUpperCase()+f.slice(1)} ({cnt})</button>;})}
              </div>
              {list.length===0?<div className="empty card card-p"><I.users style={{width:28,height:28,margin:"0 auto 10px",display:"block",color:"var(--text-3)"}}/><h3>{filter==="all"?"No applicants yet":"Nothing here"}</h3><p>{filter==="all"?"Share the job to attract candidates":"Try a different filter"}</p></div>
              :<div style={{display:"flex",flexDirection:"column",gap:8}}>
                {list.map(a=>{
                  const init=a.seeker_name?.split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2)||"?";
                  const s=SM[a.status]||SM.pending;
                  return(
                    <div key={a.id} className="card" style={{padding:"14px 18px",display:"flex",alignItems:"center",gap:14}}>
                      <div style={{width:38,height:38,borderRadius:"50%",background:"var(--accent)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:600,color:"#fff",flexShrink:0}}>{init}</div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontWeight:600,fontSize:14,color:"var(--text)",marginBottom:2}}>{a.seeker_name}</div>
                        <div style={{fontSize:12,color:"var(--text-3)",display:"flex",alignItems:"center",gap:6}}><I.mail style={{width:11,height:11}}/>{a.seeker_email} · Applied {ago(a.applied_at)}</div>
                      </div>
                      <span className={"tag "+s.c} style={{flexShrink:0}}>{s.l}</span>
                      <div style={{display:"flex",gap:6,flexShrink:0}}>
                        {a.status!=="shortlisted"&&<button className="btn btn-success btn-sm" onClick={()=>update(a.id,"shortlisted")} disabled={updId===a.id}>{updId===a.id?"…":"Shortlist"}</button>}
                        {a.status!=="rejected"&&<button className="btn btn-danger btn-sm" onClick={()=>update(a.id,"rejected")} disabled={updId===a.id}>{updId===a.id?"…":"Reject"}</button>}
                        {a.status!=="pending"&&<button className="btn btn-ghost btn-sm" onClick={()=>update(a.id,"pending")} disabled={updId===a.id}>Reset</button>}
                      </div>
                    </div>
                  );
                })}
              </div>}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
