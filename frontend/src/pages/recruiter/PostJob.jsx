import React,{useState}from"react";
import{Link,useNavigate}from"react-router-dom";
import axios from"axios";
import{RSide}from"./RecruiterDashboard";
import I from"../../components/Icons";

export default function PostJob(){
  const nav=useNavigate();
  const[f,setF]=useState({title:"",company:"",location:"",salary:"",type:"full-time",description:"",requirements:""});
  const[loading,setL]=useState(false);const[err,setErr]=useState("");const[ok,setOk]=useState(false);
  const ch=e=>setF({...f,[e.target.name]:e.target.value});
  const go=async e=>{e.preventDefault();if(!f.title||!f.company)return setErr("Title and company are required");setL(true);setErr("");
    try{await axios.post("/api/jobs",f);setOk(true);setTimeout(()=>nav("/recruiter/manage-jobs"),1200);}
    catch(e){setErr(e.response?.data?.message||"Failed to post job");}
    finally{setL(false);}};
  return(
    <div className="page">
      <div className="shell">
        <RSide active="/recruiter/post-job"/>
        <main className="main">
          <div className="pg-head"><h1>Post a job</h1><p>Fill in the details to attract the right candidates</p></div>
          <div className="card" style={{maxWidth:680,padding:32}}>
            {ok&&<div className="alert alert-ok">Job posted successfully — redirecting…</div>}
            {err&&<div className="alert alert-err">{err}</div>}
            <form onSubmit={go} style={{display:"flex",flexDirection:"column",gap:16}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                <div className="field"><label>Job title *</label><input className="input" name="title" placeholder="e.g. Frontend Engineer" value={f.title} onChange={ch} required/></div>
                <div className="field"><label>Company name *</label><input className="input" name="company" placeholder="e.g. Acme Corp" value={f.company} onChange={ch} required/></div>
                <div className="field"><label>Location</label><input className="input" name="location" placeholder="e.g. Mumbai or Remote" value={f.location} onChange={ch}/></div>
                <div className="field"><label>Salary range</label><input className="input" name="salary" placeholder="e.g. ₹8–12 LPA" value={f.salary} onChange={ch}/></div>
              </div>
              <div className="field"><label>Job type</label>
                <select className="input" name="type" value={f.type} onChange={ch}>
                  <option value="full-time">Full-time</option><option value="part-time">Part-time</option><option value="remote">Remote</option><option value="internship">Internship</option>
                </select>
              </div>
              <div className="field"><label>Job description</label><textarea className="input" name="description" rows={5} placeholder="Describe the role, responsibilities, and what makes it exciting…" value={f.description} onChange={ch}/></div>
              <div className="field"><label>Requirements</label><textarea className="input" name="requirements" rows={5} placeholder="List required skills, experience, and qualifications…" value={f.requirements} onChange={ch}/></div>
              <div style={{display:"flex",gap:10,paddingTop:4}}>
                <button type="submit" className="btn btn-primary" disabled={loading||ok}>{loading?"Posting…":"Post job"}</button>
                <Link to="/recruiter/manage-jobs" className="btn btn-ghost">Cancel</Link>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
