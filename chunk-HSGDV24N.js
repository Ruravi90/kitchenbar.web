import{a as q}from"./chunk-ZWXXUC3T.js";import{a as D}from"./chunk-VWEWEICH.js";import"./chunk-UUS4ZWI4.js";import{d as G}from"./chunk-M4WXGWUD.js";import{h as O,n as K}from"./chunk-QKYNGRZ6.js";import"./chunk-X52ZXH5X.js";import{r as V}from"./chunk-AJV43YAS.js";import{b as P,c as z}from"./chunk-4QSKJXB4.js";import{A as U,b as k,c as u,e as M,f as I,g as F,h as b,j as N,k as j,l as E,m as A,n as B}from"./chunk-HN6FBLWS.js";import"./chunk-4YRY4IP2.js";import{g as R}from"./chunk-MABZNZAS.js";import{Da as f,Ea as y,N as C,P as s,Q as m,_ as l,_a as L,aa as h,ca as o,da as n,ea as a,ja as v,oa as _,sb as T,t as d,va as p,vb as w,x as S,y as c}from"./chunk-OVWECSA7.js";var x=()=>({width:"100%"}),H=e=>({"ng-invalid ng-dirty":e}),Q=(()=>{class e{constructor(t,i,r,g,X){this.uS=t,this.layoutService=i,this.messageService=r,this.formBuilder=g,this.router=X,this.formLogin=new F({user_name:new b(""),password:new b("")}),this.user=new G,this.submitted=!1,this.isAuthorized=null,localStorage.removeItem("user")}ngOnInit(){this.formLogin=this.formBuilder.group({user_name:["",[u.required,u.minLength(6),u.maxLength(20)]],password:["",[u.required]]})}get f(){return this.formLogin.controls}login(){if(this.submitted=!0,this.formLogin.invalid){console.log(this.formLogin);return}this.user.user_name=this.formLogin.controls.user_name.value,this.user.password=this.formLogin.controls.password.value,this.uS.login(this.user).subscribe({next:t=>{this.isAuthorized=!0,t.instanceId!=null?this.router.navigate(["/kitchen/tables"]):this.router.navigate(["/admin/licenses"])},error:t=>{t.error.statusCode==403?this.messageService.add({severity:"warn",summary:"Alerta",detail:t.error.messages}):t.error.statusCode==401?this.messageService.add({severity:"warn",summary:"Alerta",detail:"Usuario u/o Contrase\xF1a incorrectos"}):this.messageService.add({severity:"error",summary:"Error",detail:t.error.messages})}}),this.submitted=!1,this.isAuthorized=!1}register(){this.router.navigate(["/auth/register"])}static{this.\u0275fac=function(i){return new(i||e)(m(D),m(q),m(R),m(B),m(T))}}static{this.\u0275cmp=S({type:e,selectors:[["app-login"]],decls:27,vars:21,consts:[[1,"surface-ground","flex","align-items-center","justify-content-center","min-h-screen","min-w-screen","overflow-hidden"],[1,"flex","flex-column","align-items-center","justify-content-center"],["alt","Kitchen Bar logo",1,"mb-3","w-10rem","flex-shrink-0",3,"src"],[2,"border-radius","56px","padding","0.3rem","background","linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)"],[1,"w-full","shadow-4","surface-card","py-8","px-5","sm:px-8",2,"border-radius","53px"],[1,"text-center","mb-5"],[1,"text-900","font-medium"],[1,"card-body"],[3,"submit","formGroup"],[1,"flex","flex-column","m-2"],[1,"flex","align-items-center"],["for","user_name",1,"block","text-900","text-xl","font-medium","mb-2"],["id","user_name","type","text","formControlName","user_name","placeholder","usuario@kitenbar","required","","pInputText","",3,"ngClass"],["for","password1",1,"block","text-900","font-medium","text-xl","mb-2"],["id","password1","formControlName","password","placeholder","Password","required","",1,"w-full",3,"inputStyle","toggleMask","ngClass","feedback"],["pButton","","pRipple","","label","Iniciar",1,"w-full","p-3","mt-3","text-xl"],[1,"flex","align-items-center","mt-3"],["label","Registrar",3,"click","link"],["label","recuperar contrase\xF1a?",3,"link"]],template:function(i,r){i&1&&(o(0,"div",0)(1,"div",1),a(2,"img",2),o(3,"div",3)(4,"div",4)(5,"div",5)(6,"span",6),p(7,"Iniciar sesion"),n()(),o(8,"div",7)(9,"form",8),v("submit",function(){return r.login()}),o(10,"div",9)(11,"div",10)(12,"label",11),p(13,"Usuario"),n()(),o(14,"div",10),a(15,"input",12),n()(),o(16,"div",9)(17,"div",10)(18,"label",13),p(19,"Password"),n()(),o(20,"div",10),a(21,"p-password",14),n()(),a(22,"button",15),n(),o(23,"div",16)(24,"p-button",17),v("click",function(){return r.register()}),n(),a(25,"p-button",18),n()()()()()(),a(26,"p-toast")),i&2&&(s(2),_("src","assets/layout/images/",r.layoutService.config().colorScheme==="light"?"logo-dark":"logo-white",".svg",C),s(7),l("formGroup",r.formLogin),s(6),h(f(14,x)),l("ngClass",y(15,H,r.submitted&&r.f.user_name.invalid)),s(6),h(f(17,x)),l("inputStyle",f(18,x))("toggleMask",!0)("ngClass",y(19,H,r.submitted&&r.f.password.invalid))("feedback",!1),s(3),l("link",!0),s(),l("link",!0))},dependencies:[L,P,z,U,N,k,M,I,A,V,O,j,E],styles:["[_nghost-%COMP%]     .pi-eye, [_nghost-%COMP%]     .pi-eye-slash{transform:scale(1.6);margin-right:1rem;color:var(--primary-color)!important}"]})}}return e})();var W=(()=>{class e{static{this.\u0275fac=function(i){return new(i||e)}}static{this.\u0275mod=c({type:e})}static{this.\u0275inj=d({imports:[w.forChild([{path:"",component:Q}]),w]})}}return e})();var ve=(()=>{class e{static{this.\u0275fac=function(i){return new(i||e)}}static{this.\u0275mod=c({type:e})}static{this.\u0275inj=d({imports:[W,K]})}}return e})();export{ve as LoginModule};
