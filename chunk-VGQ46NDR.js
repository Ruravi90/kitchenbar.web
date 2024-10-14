import{d as I}from"./chunk-M4WXGWUD.js";import{b as te,e as re,f as ne,g as se,h as oe,n as le}from"./chunk-73DC43WM.js";import{b as ae}from"./chunk-VO7G42AR.js";import{a as Q,g as X,k as Z,o as ee,r as ie}from"./chunk-7M5SMTWD.js";import{b as H,c as K}from"./chunk-7FN5CSOE.js";import{A as $,b as D,e as N,i as L,q as Y,v as q,y as J}from"./chunk-JUBCWWEC.js";import"./chunk-4YRY4IP2.js";import{e as O,g as G,l as z}from"./chunk-AXTF557K.js";import{Ba as j,D as C,H as W,Ha as k,I as M,Ia as c,Ja as V,Ka as A,La as f,Lb as B,Ma as _,Na as w,O as l,P as d,Qa as x,Ra as F,aa as p,ba as b,ja as S,la as u,na as E,ob as P,pa as i,pb as R,qa as r,ra as h,va as U,wa as g,xa as y}from"./chunk-RICBQGXD.js";var T=()=>({width:"100%"}),ce=n=>({"border-top-1 surface-border":n});function ue(n,v){if(n&1){let t=U();i(0,"div",31)(1,"div",32)(2,"div",33)(3,"div",34),c(4),r()(),i(5,"div",35)(6,"p-button",36),g("click",function(){let e=l(t).$implicit,a=y(2);return d(a.showModal(!0,e))}),r()(),i(7,"div",35)(8,"p-button",37),g("click",function(){let e=l(t).$implicit,a=y(2);return d(a.confirmDeleted(e))}),r()()()()}if(n&2){let t=v.$implicit,s=v.first;p(),u("ngClass",F(2,ce,!s)),p(3),V(t.name)}}function ge(n,v){if(n&1&&(i(0,"div",29),S(1,ue,9,4,"div",30),r()),n&2){let t=v.$implicit;p(),u("ngForOf",t)}}function he(n,v){if(n&1){let t=U();i(0,"div",38)(1,"div",39),h(2,"i",40),r(),i(3,"span",41),c(4),r(),i(5,"p",42),c(6),r(),i(7,"div",43)(8,"button",44),g("click",function(){l(t),y();let e=k(47);return d(e.accept())}),r(),i(9,"button",45),g("click",function(){l(t),y();let e=k(47);return d(e.reject())}),r()()()}if(n&2){let t=v.$implicit;p(4),A(" ",t.header," "),p(2),V(t.message)}}var pe=(()=>{class n{constructor(t,s,e,a,m){this.confirmationService=t,this.messageService=s,this._serviceAuth=e,this._serviceBranch=a,this.usersServices=m,this.items=[],this.branches=[],this.user=new I,this.current=new I,this.visibleModal=!1,this.isEdit=!1,this.roles=[{id:1,name:"Admin"},{id:2,name:"Mesero"}]}ngOnInit(){this.getUsers(),this.getBranches(),this.current=this._serviceAuth.getCurrentUser()}getUsers(){this.usersServices.getItemsByInstance().subscribe({next:t=>{this.items=t},error:t=>{this.messageService.add({severity:"warn",summary:"Alerta",detail:t.error.messages})}})}getBranches(){this._serviceBranch.getItemsByInstance().subscribe({next:t=>{this.branches=t},error:t=>{this.messageService.add({severity:"warn",summary:"Alerta",detail:t.error.messages})}})}showModal(t=!1,s){this.selectedRol=null,this.selectedBranche=null,t?(this.user=s,this.user.user_name=s?.user_name?.split("@")[0],this.user.password="",this.selectedRol=this.roles.find(e=>e.id==s?.role),this.selectedBranche=this.branches.find(e=>e.id==s?.branchId),console.log(this.selectedRol)):this.user=new I,this.isEdit=t,this.visibleModal=!0}confirmSave(){this.user.user_name=this.user.user_name+"@"+this.current.instance.name_kitchen.toLowerCase(),this.user.role=this.selectedRol.id,this.user.branchId=this.selectedBranche.id,this.isEdit?this.usersServices.updateItem(this.user.id,this.user).subscribe({next:t=>this.getUsers(),error:t=>{this.messageService.add({severity:"warn",summary:"Alerta",detail:t.error.messages})}}):this.usersServices.createItem(this.user).subscribe({next:t=>this.getUsers(),error:t=>{this.messageService.add({severity:"warn",summary:"Alerta",detail:t.error.messages})}}),this.selectedRol=null,this.selectedBranche=null,this.visibleModal=!1}confirmDeleted(t){this.confirmationService.confirm({header:"Estas seguro de eliminar?",message:"Por favor de confirmar.",accept:()=>{this.usersServices.deleteItem(this.user.id).subscribe({next:s=>this.getUsers(),error:s=>{this.messageService.add({severity:"warn",summary:"Alerta",detail:s.error.messages})}})}})}static{this.\u0275fac=function(s){return new(s||n)(b(O),b(G),b(Y),b(J),b(q))}}static{this.\u0275cmp=W({type:n,selectors:[["app-tables"]],decls:49,vars:27,consts:[["dv",""],["password","ngModel"],["cd",""],[1,"flex","flex-wrap","justify-content-center"],[1,"w-full"],["header","Usuarios",1,""],[1,"w-full","mb-4"],[1,"pi","pi-search"],["type","text","pInputText","","placeholder","Buscar"],["type","button","pButton","","icon","pi pi-plus","size","small","pTooltip","Nuevo usuario",1,"p-button-success",3,"click"],["emptyMessage","Usuarios no registrados",3,"value","rows","paginator"],["pTemplate","list"],[3,"visibleChange","header","modal","visible"],[1,"formgrid","grid","gap-3","mb-3","mt-3"],[1,"field","col-12"],["for","name"],["pInputText","","id","name","type","text",1,"w-full",3,"ngModelChange","ngModel"],["for","role"],["id","role","optionLabel","name","placeholder","Selecciona la sucursal",3,"ngModelChange","options","ngModel"],["id","role","optionLabel","name","placeholder","Selecciona el Rol",3,"ngModelChange","options","ngModel"],["pTooltip","usuario@nombre-bar",1,"field","col-12"],["for","user_name"],["id","user_name","type","text","pInputText","",3,"ngModelChange","ngModel"],["for","password"],["id","password","name","password",3,"ngModelChange","ngModel","inputStyle","toggleMask"],[1,"flex","justify-content-end","gap-2"],["label","Cancelar","severity","secondary",3,"click"],["label","Guardar",3,"click"],["pTemplate","headless"],[1,"grid","grid-nogutter"],["class","col-12",4,"ngFor","ngForOf"],[1,"col-12"],[1,"grid","p-2",3,"ngClass"],[1,"col"],[1,"overflow-hidden","text-overflow-ellipsis","text-lg","font-medium","text-900","mt-2",2,"width","100px"],[1,"col-fixed","gap-1"],["icon","pi pi-pencil","size","small","pTooltip","Editar",3,"click"],["severity","danger","icon","pi pi-trash","size","small","pTooltip","Eliminar",3,"click"],[1,"flex","flex-column","align-items-center","p-5","surface-overlay","border-round"],[1,"border-circle","bg-primary","inline-flex","justify-content-center","align-items-center","h-6rem","w-6rem"],[1,"pi","pi-question","text-5xl"],[1,"font-bold","text-2xl","block","mb-2","mt-4"],[1,"mb-0"],[1,"flex","align-items-center","gap-2","mt-4"],["pButton","","label","Si",1,"w-8rem",3,"click"],["pButton","","label","No",1,"p-button-outlined","w-8rem",3,"click"]],template:function(s,e){if(s&1){let a=U();i(0,"div",3)(1,"div",4)(2,"p-card",5)(3,"div")(4,"p-inputGroup",6)(5,"p-inputGroupAddon"),h(6,"i",7),r(),h(7,"input",8),i(8,"button",9),g("click",function(){return l(a),d(e.showModal())}),r()(),i(9,"p-dataView",10,0),S(11,ge,2,1,"ng-template",11),r()()()()(),i(12,"p-dialog",12),w("visibleChange",function(o){return l(a),_(e.visibleModal,o)||(e.visibleModal=o),d(o)}),i(13,"div",13)(14,"div",14)(15,"label",15),c(16,"Nombre del usuario"),r(),i(17,"input",16),w("ngModelChange",function(o){return l(a),_(e.user.name,o)||(e.user.name=o),d(o)}),r()(),i(18,"div",14),h(19,"p-divider"),r(),i(20,"div",14)(21,"label",17),c(22,"Sucursal"),r(),i(23,"p-dropdown",18),w("ngModelChange",function(o){return l(a),_(e.selectedBranche,o)||(e.selectedBranche=o),d(o)}),r()(),i(24,"div",14),h(25,"p-divider"),r(),i(26,"div",14)(27,"label",17),c(28,"Rol"),r(),i(29,"p-dropdown",19),w("ngModelChange",function(o){return l(a),_(e.selectedRol,o)||(e.selectedRol=o),d(o)}),r()(),i(30,"div",20)(31,"label",21),c(32,"Usuario"),r(),i(33,"p-inputGroup")(34,"input",22),w("ngModelChange",function(o){return l(a),_(e.user.user_name,o)||(e.user.user_name=o),d(o)}),r(),i(35,"p-inputGroupAddon"),c(36),r()()(),i(37,"div",14)(38,"label",23),c(39,"Contrase\xF1a"),r(),i(40,"p-password",24,1),w("ngModelChange",function(o){return l(a),_(e.user.password,o)||(e.user.password=o),d(o)}),r()()(),i(42,"div",25)(43,"p-button",26),g("click",function(){return l(a),d(e.visibleModal=!1)}),r(),i(44,"p-button",27),g("click",function(){return l(a),d(e.confirmSave())}),r()()(),h(45,"p-toast"),i(46,"p-confirmDialog",null,2),S(48,he,10,2,"ng-template",28),r()}s&2&&(p(9),u("value",e.items)("rows",5)("paginator",!0),p(3),j("header","",e.isEdit?"Editar":"Nuevo"," usuario"),u("modal",!0),f("visible",e.visibleModal),p(5),f("ngModel",e.user.name),p(6),E(x(23,T)),u("options",e.branches),f("ngModel",e.selectedBranche),p(6),E(x(24,T)),u("options",e.roles),f("ngModel",e.selectedRol),p(5),f("ngModel",e.user.user_name),p(2),V("@"+e.current.instance.name_kitchen.toLowerCase()),p(4),E(x(25,T)),f("ngModel",e.user.password),u("inputStyle",x(26,T))("toggleMask",!0))},dependencies:[P,R,H,K,z,$,D,N,L,ie,Q,ee,re,ne,te,oe,se,X,ae,Z],styles:[".button-table[_ngcontent-%COMP%]{appearance:none;background-color:#fcfcfd;border-radius:4px;border-width:0;box-shadow:#2d234266 0 2px 4px,#2d23424d 0 7px 13px -3px,#d6d6e7 0 -3px inset;box-sizing:border-box;color:#36395a;cursor:pointer;font-family:JetBrains Mono,monospace;height:35vh;width:30vw;list-style:none;overflow:hidden;padding-left:16px;padding-right:16px;position:relative;text-decoration:none;transition:box-shadow .15s,transform .15s;user-select:none;-webkit-user-select:none;touch-action:manipulation;white-space:nowrap;will-change:box-shadow,transform;font-size:18px}.button-table[_ngcontent-%COMP%]:focus{box-shadow:#d6d6e7 0 0 0 1.5px inset,#2d234266 0 2px 4px,#2d23424d 0 7px 13px -3px,#d6d6e7 0 -3px inset}.button-table[_ngcontent-%COMP%]:hover{box-shadow:#2d234266 0 4px 8px,#2d23424d 0 7px 13px -3px,#d6d6e7 0 -3px inset;transform:translateY(-2px)}.button-table[_ngcontent-%COMP%]:active{box-shadow:#d6d6e7 0 3px 7px inset;transform:translateY(2px)}"]})}}return n})();var me=(()=>{class n{static{this.\u0275fac=function(s){return new(s||n)}}static{this.\u0275mod=M({type:n})}static{this.\u0275inj=C({imports:[B.forChild([{path:"",component:pe}]),B]})}}return n})();var Oe=(()=>{class n{static{this.\u0275fac=function(s){return new(s||n)}}static{this.\u0275mod=M({type:n})}static{this.\u0275inj=C({imports:[me,le]})}}return n})();export{Oe as UsersModule};
