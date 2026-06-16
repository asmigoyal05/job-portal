import React,{createContext,useContext,useState,useCallback}from'react';
const Ctx=createContext(null);
export const ToastProvider=({children})=>{
  const[toasts,setToasts]=useState([]);
  const add=useCallback((msg,type='ok')=>{
    const id=Date.now();
    setToasts(p=>[...p,{id,msg,type}]);
    setTimeout(()=>setToasts(p=>p.filter(t=>t.id!==id)),3000);
  },[]);
  return(
    <Ctx.Provider value={add}>
      {children}
      <div className="toast-wrap">
        {toasts.map(t=>(
          <div key={t.id} className={`toast toast-${t.type}`}>
            {t.type==='ok'?'✓':'✕'} {t.msg}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
};
export const useToast=()=>useContext(Ctx);
