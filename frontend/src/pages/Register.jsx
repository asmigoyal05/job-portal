import React,{useState}from"react";
import{Link,useNavigate,useLocation}from"react-router-dom";
import{useAuth}from"../context/AuthContext";

export default function Register(){
  const{register}=useAuth();const nav=useNavigate();const loc=useLocation();
  const[f,setF]=useState({name:"",email:"",password:"",role:loc.state?.role||"seeker"});
  const[err,setErr]=useState("");const[loading,setL]=useState(false);
  const go=async e=>{e.preventDefault();setErr("");
    if(f.password.length<6)return setErr("Password must be at least 6 characters");
    setL(true);
    try{const u=await register(f.name,f.email,f.password,f.role);nav(u.role==="recruiter"?"/recruiter/dashboard":"/seeker/dashboard");}
    catch(e){setErr(e.response?.data?.message||"Registration failed");}
    finally{setL(false);}};
  return(
    <div className="page" style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",padding:"80px 16px"}}>
      <div className="form-wrap anim" style={{maxWidth:480}}>
        <div className="form-head"><h1>Create your account</h1><p>Join HireFlow — it takes less than a minute</p></div>
        <div style={{marginBottom:20}}>
          <div style={{fontSize:12,fontWeight:500,color:"var(--text-2)",marginBottom:8}}>I am a…</div>
          <div className="role-grid">
            {[{v:"seeker",n:"Job seeker",d:"Find & apply for roles"},{v:"recruiter",n:"Recruiter",d:"Post jobs & hire talent"}].map(r=>(
              <div key={r.v} className={"role-card"+(f.role===r.v?" on":"")} onClick={()=>setF({...f,role:r.v})}>
                <div className="r-name">{r.n}</div>
                <div className="r-desc">{r.d}</div>
              </div>
            ))}
          </div>
        </div>
        {err&&<div className="alert alert-err">{err}</div>}
        <form className="form-body" onSubmit={go}>
          <div className="field"><label>Full name</label><input className="input" placeholder="Your name" value={f.name} onChange={e=>setF({...f,name:e.target.value})} required autoFocus/></div>
          <div className="field"><label>Email address</label><input className="input" type="email" placeholder="you@example.com" value={f.email} onChange={e=>setF({...f,email:e.target.value})} required/></div>
          <div className="field"><label>Password</label><input className="input" type="password" placeholder="Min. 6 characters" value={f.password} onChange={e=>setF({...f,password:e.target.value})} required/></div>
          <button type="submit" className="btn btn-primary btn-full" style={{marginTop:4}} disabled={loading}>{loading?"Creating account…":"Create account"}</button>
        </form>
        <div className="form-foot" style={{marginTop:20}}>Already have an account? <Link to="/login">Sign in</Link></div>
      </div>
    </div>
  );
}
