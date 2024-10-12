import{a as N}from"./chunk-ZWXXUC3T.js";import{a as D}from"./chunk-VWEWEICH.js";import"./chunk-UUS4ZWI4.js";import{d as U,f as z}from"./chunk-M4WXGWUD.js";import{e as q,f as H,i as J,l as Q,m as X,n as Y}from"./chunk-QKYNGRZ6.js";import"./chunk-X52ZXH5X.js";import{r as K}from"./chunk-AJV43YAS.js";import{c as G}from"./chunk-4QSKJXB4.js";import{A as O,b as W,e as L,i as P,v as A}from"./chunk-HN6FBLWS.js";import"./chunk-4YRY4IP2.js";import{g as B,l as F}from"./chunk-MABZNZAS.js";import{Aa as g,C as l,D as s,Da as x,N as V,P as c,Q as _,Y as b,_ as R,aa as h,ca as i,da as n,ea as E,ia as M,ja as f,ka as m,oa as T,sb as j,t as w,va as p,vb as v,wa as I,x as k,y,ya as u,za as d}from"./chunk-OVWECSA7.js";var C=()=>({width:"100%"});function ie(r,S){if(r&1){let t=M();i(0,"div",16)(1,"div",17)(2,"div",18)(3,"label",19),p(4,"Nombre completo"),n()(),i(5,"div",20)(6,"input",21,0),g("ngModelChange",function(e){l(t);let a=m();return d(a.user.name,e)||(a.user.name=e),s(e)}),n()()(),i(8,"div",17)(9,"div",18)(10,"label",22),p(11,"Telefono"),n()(),i(12,"div",20)(13,"p-inputMask",23,1),g("ngModelChange",function(e){l(t);let a=m();return d(a.user.phone_number,e)||(a.user.phone_number=e),s(e)}),n()()()(),i(15,"div",16)(16,"div",17)(17,"div",18)(18,"label",24),p(19,"Correo"),n()(),i(20,"div",20)(21,"input",25,2),g("ngModelChange",function(e){l(t);let a=m();return d(a.user.email,e)||(a.user.email=e),s(e)}),n()()()(),i(23,"div",26)(24,"p-button",27),f("onClick",function(){let e=l(t).nextCallback;return s(e.emit())}),n()()}if(r&2){let t=m();c(6),h(x(9,C)),u("ngModel",t.user.name),c(7),h(x(10,C)),u("ngModel",t.user.phone_number),c(8),h(x(11,C)),u("ngModel",t.user.email)}}function ne(r,S){if(r&1){let t=M();i(0,"div",16)(1,"div",28)(2,"div",18)(3,"label",29),p(4,"Nombre del negocio"),n()(),i(5,"div",20)(6,"input",30),g("ngModelChange",function(e){l(t);let a=m();return d(a.user.instance.name_client,e)||(a.user.instance.name_client=e),s(e)}),n()()(),i(7,"div",28)(8,"div",18)(9,"label",31),p(10,"Nombre corto del negocio"),n()(),i(11,"div",20)(12,"input",32),g("ngModelChange",function(e){l(t);let a=m();return d(a.user.instance.name_kitchen,e)||(a.user.instance.name_kitchen=e),s(e)}),n()(),i(13,"div",20)(14,"small",33),p(15," Ingresa el nombre corto del negocio sin espacios . "),n()()()(),i(16,"div",34)(17,"p-button",35),f("onClick",function(){let e=l(t).prevCallback;return s(e.emit())}),n(),i(18,"p-button",27),f("onClick",function(){let e=l(t).nextCallback;return s(e.emit())}),n()()}if(r&2){let t=m();c(6),u("ngModel",t.user.instance.name_client),c(6),u("ngModel",t.user.instance.name_kitchen)}}function re(r,S){if(r&1){let t=M();i(0,"div",16)(1,"div",17)(2,"div",18)(3,"label",31),p(4,"Usuario"),n()(),i(5,"p-inputGroup")(6,"input",36),g("ngModelChange",function(e){l(t);let a=m();return d(a.user.user_name,e)||(a.user.user_name=e),s(e)}),n(),i(7,"p-inputGroupAddon"),p(8),n()()(),i(9,"div",17)(10,"div",18)(11,"label",31),p(12,"Contrase\xF1a"),n()(),i(13,"div",20)(14,"p-password",37,3),g("ngModelChange",function(e){l(t);let a=m();return d(a.user.password,e)||(a.user.password=e),s(e)}),n()()()(),i(16,"div",38)(17,"p-button",35),f("onClick",function(){let e=l(t).prevCallback;return s(e.emit())}),n(),i(18,"p-button",39),f("onClick",function(){l(t);let e=m();return s(e.register())}),n()()}if(r&2){let t=m();c(6),u("ngModel",t.user.user_name),c(2),I("@"+(t.user.instance!=null&&t.user.instance.name_kitchen?t.user.instance==null||t.user.instance.name_kitchen==null?null:t.user.instance.name_kitchen.toLowerCase():"kitchenbar")),c(6),h(x(7,C)),u("ngModel",t.user.password),R("inputStyle",x(8,C))("toggleMask",!0)}}var $=(()=>{class r{constructor(t,o,e,a,te){this.uS=t,this.usersService=o,this.messageService=e,this.layoutService=a,this.router=te,this.user=new U,this.isBusy=!1,this.isAuthorized=null,localStorage.removeItem("user")}ngOnInit(){this.isBusy=!1,this.user.instance=new z}toLowerCase(){this.user.instance.name_kitchen=this.user.instance?.name_kitchen?.toLocaleLowerCase()}register(){this.isBusy=!0,this.uS.register(Object.assign({},this.user)).subscribe({next:t=>{this.isAuthorized=!0,this.router.navigate(["/kitchen/tables"])},error:t=>{this.messageService.add({severity:"error",summary:"Error",detail:t.error.messages})}}),this.isBusy=!1,this.isAuthorized=!1}static{this.\u0275fac=function(o){return new(o||r)(_(D),_(A),_(B),_(N),_(j))}}static{this.\u0275cmp=k({type:r,selectors:[["app-register"]],decls:15,vars:2,consts:[["name","ngModel"],["phone_number","ngModel"],["email","ngModel"],["password","ngModel"],[1,"surface-ground","flex","align-items-center","justify-content-center","min-h-screen","min-w-screen","overflow-hidden"],[1,"flex","flex-column","align-items-center","justify-content-center"],["alt","Kitchen Bar logo",1,"mb-3","w-10rem","flex-shrink-0",3,"src"],[1,"w-full","shadow-4",2,"border-radius","56px","padding","0.3rem","background","linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)"],[1,"w-full","surface-card","py-8","px-5","sm:px-8",2,"border-radius","53px"],[1,"text-center","mb-5"],[1,"text-900","font-medium"],["orientation","vertical",1,"w-12"],["header","Datos personales"],["pTemplate","content"],["header","Datos de tu negocio"],["header","Usuario"],[1,"grid"],[1,"col-12","lg:col-6","p-2","flex","flex-column"],[1,"flex"],["for","name",1,"block","text-900","text-xl","font-medium","mb-2"],[1,"flex","align-items-center"],["id","name","type","text","name","name","pInputText","",3,"ngModelChange","ngModel"],["for","phone",1,"block","text-900","text-xl","font-medium","mb-2"],["id","phone","type","text","mask","99-9999-9999","placeholder","99-9999-9999","name","phone_number",1,"w-full",3,"ngModelChange","ngModel"],["for","email",1,"block","text-900","text-xl","font-medium","mb-2"],["type","text","pInputText","","id","email","type","text","name","email","placeholder","user@kitenbar.com","type","email",3,"ngModelChange","ngModel"],[1,"flex","py-4"],["label","Siguiente",3,"onClick"],[1,"col-12","lg:col-6","p-2","flex","flex-column","gap-2"],["for","client",1,"block","text-900","text-xl","font-medium","mb-2"],["type","text","pInputText","",1,"w-full",3,"ngModelChange","ngModel"],["for","kitchen",1,"block","text-900","text-xl","font-medium","mb-2"],["type","text","pInputText","","onkeypress","toLowerCase()","aria-describedby","kitchename-help",1,"w-full",3,"ngModelChange","ngModel"],["id","kitchename-help"],[1,"flex","py-4","gap-2"],["label","Volver","severity","secondary",3,"onClick"],["id","user_name","type","text","pInputText","",3,"ngModelChange","ngModel"],["id","password","name","password","promptLabel","Elegir una contrase\xF1a","weakLabel","Contrase\xF1a simple","mediumLabel","Contrase\xF1a aceptable","strongLabel","Contrase\xF1a fuerte",1,"w-full",3,"ngModelChange","ngModel","inputStyle","toggleMask"],[1,"flex","py-4","gap-3"],["label","Registrarme",3,"onClick"]],template:function(o,e){o&1&&(i(0,"div",4)(1,"div",5),E(2,"img",6),i(3,"div",7)(4,"div",8)(5,"div",9)(6,"span",10),p(7,"Registro"),n()(),i(8,"p-stepper",11)(9,"p-stepperPanel",12),b(10,ie,25,12,"ng-template",13),n(),i(11,"p-stepperPanel",14),b(12,ne,19,2,"ng-template",13),n(),i(13,"p-stepperPanel",15),b(14,re,19,9,"ng-template",13),n()()()()()()),o&2&&(c(2),T("src","assets/layout/images/",e.layoutService.config().colorScheme==="light"?"logo-dark":"logo-white",".svg",V))},dependencies:[G,F,O,W,L,P,K,q,H,J,X,Q],styles:["[_nghost-%COMP%]     .pi-eye, [_nghost-%COMP%]     .pi-eye-slash{transform:scale(1.6);margin-right:1rem;color:var(--primary-color)!important}"]})}}return r})();var ee=(()=>{class r{static{this.\u0275fac=function(o){return new(o||r)}}static{this.\u0275mod=y({type:r})}static{this.\u0275inj=w({imports:[v.forChild([{path:"",component:$}]),v]})}}return r})();var Ve=(()=>{class r{static{this.\u0275fac=function(o){return new(o||r)}}static{this.\u0275mod=y({type:r})}static{this.\u0275inj=w({imports:[ee,Y]})}}return r})();export{Ve as RegisterModule};
