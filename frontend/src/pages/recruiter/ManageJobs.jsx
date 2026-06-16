import React,{useEffect,useState}from"react";
import{Link}from"react-router-dom";
import axios from"axios";
import{RSide}from"./RecruiterDashboard";
import I from"../../components/Icons";

const TYPE={["full-time"]:"tag-purple",["part-time"]:"tag-blue",remote:"tag-green",internship:"tag-amber"};
const ago=d=>{const s=Math.floor((Date.now()-new Date(d))/1000);if(s<3600)return Math.floor(s/60)+"m ago";if(s<86400)return Math.floor(s/3600)+"h ago";return Math.floor(s/86400)+"d ago";};

export default function ManageJobs(){
  const[jobs,setJobs]=useState([]);const[loading,setL]=useState(true);
  const[editId,setEId]=useState(null);const[ef,setEf]=useState({});
  const[delId,setDId]=useState(null);const[msg,setMsg]=useState("");
  useEffect(()=>{axios.get("/api/jobs/mine").then(r=>setJobs(r.data)).catch(()=>{}).finally(()=>setL(false));}, []);
  const startEdit=j=>{setEId(j.id);setEf({title:j.title,company:j.company,location:j.location||"",salary:j.salary||"",type:j.type,description:j.description||"",requirements:j.requirements||""});};
  const save=async()=>{try{const r=await axios.put(`/api/jobs/${editId}`,ef);setJobs(p=>p.map(j=>j.id===editId?{...j,...r.data}:j));setEId(null);setMsg("Job updated");setTimeout(()=>setMsg(""),3000);}catch{setMsg("Update failed");}};
  const del=async()=>{try{await axios.delete(`/api/jobs/${delId}`);setJobs(p=>p.filter(j=>j.id!==delId));setDId(null);setMsg("Job deleted");setTimeout(()=>setMsg(""),3000);}catch{setMsg("Delete failed");}};
  return(
    <div className="page">
      <div className="shell">
        <RSide active="/recruiter/manage-jobs"/>
        <main className="main">
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24}}>
            <div className="pg-head" style={{marginBottom:0}}><h1>My listings</h1><p>{jobs.length} active job postings</p></div>
            <Link to="/recruiter/post-job" className="btn btn-primary"><I.plus/>Post new job</Link>
          </div>
          {msg&&<div className={`alert ${msg.includes("failed")?"alert-err":"alert-ok"}`}>{msg}</div>}
          {loading?<div style={{display:"flex",flexDirection:"column",gap:10}}>{[1,2,3].map(i=><div key={i} className="skel" style={{height:72}}/>)}</div>
          :jobs.length===0?<div className="empty card card-p"><I.brief style={{width:28,height:28,margin:"0 auto 10px",display:"block",color:"var(--text-3)"}}/><h3>No jobs posted yet</h3><Link to="/recruiter/post-job" className="btn btn-primary btn-sm" style={{marginTop:14,display:"inline-flex"}}>Post your first job</Link></div>
          :<div style={{display:"flex",flexDirection:"column",gap:8}}>
            {jobs.map(j=>(
              <div key={j.id} className="card" style={{overflow:"hidden"}}>
                {editId===j.id?(
                  <div style={{padding:24}}>
                    <div style={{fontSize:13,fontWeight:600,marginBottom:16,color:"var(--text-2)"}}>Editing — {j.title}</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
                      {[["title","Title"],["company","Company"],["location","Location"],["salary","Salary"]].map(([k,l])=><div className="field" key={k}><label>{l}</label><input className="input" value={ef[k]||""} onChange={e=>setEf({...ef,[k]:e.target.value})}/></div>)}
                    </div>
                    <div className="field" style={{marginBottom:12}}><label>Type</label><select className="input" value={ef.type} onChange={e=>setEf({...ef,type:e.target.value})}><option value="full-time">Full-time</option><option value="part-time">Part-time</option><option value="remote">Remote</option><option value="internship">Internship</option></select></div>
                    <div className="field" style={{marginBottom:12}}><label>Description</label><textarea className="input" rows={3} value={ef.description||""} onChange={e=>setEf({...ef,description:e.target.value})}/></div>
                    <div className="field" style={{marginBottom:16}}><label>Requirements</label><textarea className="input" rows={3} value={ef.requirements||""} onChange={e=>setEf({...ef,requirements:e.target.value})}/></div>
                    <div style={{display:"flex",gap:8}}><button className="btn btn-primary btn-sm" onClick={save}>Save changes</button><button className="btn btn-ghost btn-sm" onClick={()=>setEId(null)}>Cancel</button></div>
                  </div>
                ):(
                  <div style={{padding:"16px 20px",display:"flex",alignItems:"center",gap:16}}>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}}>
                        <span style={{fontWeight:600,fontSize:14,color:"var(--text)"}}>{j.title}</span>
                        <span className={"tag "+(TYPE[j.type]||"tag-neutral")}>{j.type}</span>
                      </div>
                      <div style={{fontSize:12,color:"var(--text-3)",display:"flex",gap:12,flexWrap:"wrap"}}>
                        <span>{j.company}</span>
                        {j.location&&<span>{j.location}</span>}
                        {j.salary&&<span>{j.salary}</span>}
                        <span>{j.applicant_count||0} applicants</span>
                        <span>{ago(j.created_at)}</span>
                      </div>
                    </div>
                    <div style={{display:"flex",gap:6,flexShrink:0}}>
                      <Link to={`/recruiter/applicants/${j.id}`} className="btn btn-ghost btn-sm">Applicants ({j.applicant_count||0})</Link>
                      <button className="btn btn-ghost btn-sm" onClick={()=>startEdit(j)}><I.edit style={{width:13,height:13}}/>Edit</button>
                      {delId===j.id?(
                        <><button className="btn btn-danger btn-sm" onClick={del}>Confirm</button><button className="btn btn-ghost btn-sm" onClick={()=>setDId(null)}>Cancel</button></>
                      ):(
                        <button className="btn btn-danger btn-sm" onClick={()=>setDId(j.id)}><I.trash style={{width:13,height:13}}/></button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>}
        </main>
      </div>
    </div>
  );
}
