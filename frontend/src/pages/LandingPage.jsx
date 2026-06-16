import React from "react";
import { Link } from "react-router-dom";
import I from "../components/Icons";

const LandingPage = () => (
  <>
    <section className="land-hero">
      <div style={{position:"relative",zIndex:1,maxWidth:680,margin:"0 auto"}}>
        <div className="land-eyebrow anim"><span/>Actively hiring — 10,000+ open roles</div>
        <h1 className="land-h1 anim anim-d1">The smarter way<br/>to find work<em>.</em></h1>
        <p className="land-sub anim anim-d2">HireFlow connects ambitious professionals with world-class companies. Apply in seconds, track in real time.</p>
        <div className="land-cta anim anim-d3">
          <Link to="/register" className="btn btn-primary btn-lg">Start for free</Link>
          <Link to="/login" className="btn btn-outline btn-lg">Sign in</Link>
        </div>
        <div className="land-stats anim anim-d4">
          {[["12,400+","Open positions"],["3,200+","Companies hiring"],["48 hr","Avg. response time"],["94%","Placement rate"]].map(([n,l])=>(
            <div key={l} style={{textAlign:"center"}}>
              <div className="land-stat-n">{n}</div>
              <div className="land-stat-l">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="land-sec">
      <div className="land-sec-inner">
        <div className="land-sec-label">Platform features</div>
        <h2 className="land-sec-title">Built for how hiring<br/>actually works</h2>
        <p className="land-sec-sub">Two portals, one platform. Whether you are looking or hiring, everything you need is here.</p>
        <div className="feat-grid">
          {[
            {icon:<I.search/>,t:"Smart search",d:"Filter by role, salary, location, and job type. Find exactly what you are looking for in seconds."},
            {icon:<I.apps/>,t:"Application tracking",d:"See every application in one place with live status updates — pending, shortlisted, or reviewed."},
            {icon:<I.bookmark/>,t:"Save jobs",d:"Bookmark roles you love and come back to them anytime. Never lose a great opportunity."},
            {icon:<I.users/>,t:"Talent pipeline",d:"Recruiters get a clean applicant view with one-click shortlisting and rejection workflows."},
            {icon:<I.trend/>,t:"Hiring analytics",d:"Track applicant volume, response rates, and pipeline health from your recruiter dashboard."},
            {icon:<I.shield/>,t:"Secure by default",d:"JWT-secured sessions, bcrypt passwords, and role-based access control throughout."},
          ].map(f=>(
            <div key={f.t} className="feat-item">
              <div className="feat-icon">{f.icon}</div>
              <div className="feat-title">{f.t}</div>
              <div className="feat-desc">{f.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="land-sec" style={{paddingTop:0}}>
      <div className="land-sec-inner">
        <div className="land-sec-label">How it works</div>
        <h2 className="land-sec-title">Three steps to your<br/>next opportunity</h2>
        <div className="how-grid">
          {[
            {n:"01",t:"Create your account",d:"Sign up as a job seeker or recruiter in under a minute. No credit card required."},
            {n:"02",t:"Explore or post",d:"Seekers browse live listings. Recruiters post detailed job descriptions with one form."},
            {n:"03",t:"Connect and hire",d:"Apply instantly, track your status, and get shortlisted — or review talent and hire fast."},
          ].map(h=>(
            <div key={h.n} className="how-item">
              <div className="how-num">{h.n}</div>
              <div className="how-title">{h.t}</div>
              <div className="how-desc">{h.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="land-sec" style={{paddingTop:0}}>
      <div className="land-sec-inner">
        <div className="cta-strip">
          <div>
            <h2>Ready to make your move?</h2>
            <p>Join thousands of professionals who found their next role on HireFlow.</p>
          </div>
          <div className="cta-strip-btns">
            <Link to="/register" state={{role:"seeker"}} className="btn btn-primary btn-lg">I am a job seeker</Link>
            <Link to="/register" state={{role:"recruiter"}} className="btn btn-outline btn-lg">I am hiring</Link>
          </div>
        </div>
      </div>
    </section>

    <footer className="footer">© 2024 HireFlow — Built for the next generation of talent</footer>
  </>
);
export default LandingPage;
