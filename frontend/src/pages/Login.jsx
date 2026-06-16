import React,{useState}from"react";
import{Link,useNavigate}from"react-router-dom";
import{useAuth}from"../context/AuthContext";

export default function Login(){
  const{login}=useAuth();const nav=useNavigate();
  const[f,setF]=useState({email:"",password:""});
  const[err,setErr]=useState("");const[loading,setL]=useState(false);
  const go=async e=>{e.preventDefault();setErr("");setL(true);
    try{const u=await login(f.email,f.password);nav(u.role==="recruiter"?"/recruiter/dashboard":"/seeker/dashboard");}
    catch(e){setErr(e.response?.data?.message||"Invalid credentials");}
    finally{setL(false);}};
  return(
    <div className="page" style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",padding:"80px 16px"}}>
      <div className="form-wrap anim">
        <div className="form-head">
          <h1>Welcome back</h1>
          <p>Sign in to continue to HireFlow</p>
        </div>
        {err&&<div className="alert alert-err">{err}</div>}
        <form className="form-body" onSubmit={go}>
          <div className="field"><label>Email address</label><input className="input" type="email" placeholder="you@example.com" value={f.email} onChange={e=>setF({...f,email:e.target.value})} required autoFocus/></div>
          <div className="field"><label>Password</label><input className="input" type="password" placeholder="••••••••" value={f.password} onChange={e=>setF({...f,password:e.target.value})} required/></div>
          <button type="submit" className="btn btn-primary btn-full" style={{marginTop:4}} disabled={loading}>{loading?"Signing in…":"Sign in"}</button>
        </form>
        <div className="form-foot" style={{marginTop:20}}>No account? <Link to="/register">Create one free</Link></div>
      </div>
    </div>
  );
}
