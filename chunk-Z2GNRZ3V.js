import{c as L}from"./chunk-64WP64BE.js";import{b as U,c as X,e as Z,f as $,g as ee,h as te,j as ie}from"./chunk-IXSFSNLD.js";import"./chunk-J6VSZILJ.js";import{a as J,g as H,n as Q}from"./chunk-65D7KFAQ.js";import"./chunk-ETYH724P.js";import{b as Y,c as q}from"./chunk-BJ7UQRZ4.js";import{b as W,d as O,g as z,n as A,t as K}from"./chunk-MLSKFZ7F.js";import"./chunk-4YRY4IP2.js";import{e as G,l as R}from"./chunk-JY4AAIVW.js";import{$ as I,A as l,B as s,Ca as B,Da as j,N as m,O as M,W as v,Y as b,Ya as F,Za as P,ba as o,ca as r,da as _,ha as w,ia as d,ja as g,na as D,r as h,sb as V,ta as S,ua as c,v as k,va as E,w as x,wa as N,xa as T,ya as C,za as y}from"./chunk-VUSRYWWQ.js";var ae=()=>({width:"100%"}),le=t=>({"border-top-1 surface-border":t});function se(t,u){if(t&1){let e=w();o(0,"div",23)(1,"div",24)(2,"div",25)(3,"div",26),c(4),r()(),o(5,"div",27)(6,"p-button",28),d("click",function(){let i=l(e).$implicit,p=g(2);return s(p.showModal(!0,i))}),r()(),o(7,"div",27)(8,"p-button",29),d("click",function(){let i=l(e).$implicit,p=g(2);return s(p.confirmDeleted(i))}),r()()()()}if(t&2){let e=u.$implicit,n=u.first;m(),b("ngClass",j(2,le,!n)),m(3),E(e.name)}}function pe(t,u){if(t&1&&(o(0,"div",21),v(1,se,9,4,"div",22),r()),t&2){let e=u.$implicit;m(),b("ngForOf",e)}}function me(t,u){if(t&1){let e=w();o(0,"div",30)(1,"div",31),_(2,"i",32),r(),o(3,"span",33),c(4),r(),o(5,"p",34),c(6),r(),o(7,"div",35)(8,"button",36),d("click",function(){l(e),g();let i=S(28);return s(i.accept())}),r(),o(9,"button",37),d("click",function(){l(e),g();let i=S(28);return s(i.reject())}),r()()()}if(t&2){let e=u.$implicit;m(4),N(" ",e.header," "),m(2),E(e.message)}}var oe=(()=>{class t{constructor(e,n){this.confirmationService=e,this.tablesServices=n,this.tables=[],this.table={},this.visibleModal=!1,this.isEdit=!1}ngOnInit(){this.getTables()}getTables(){this.tablesServices.getItemsByInstance().subscribe({next:e=>{this.tables=e},error:e=>console.error(e)})}showModal(e=!1,n){this.isEdit=e,e?this.table=n:this.table=new L,this.visibleModal=!0}confirmSave(){this.isEdit?this.tablesServices.updateItem(this.table.id,this.table).subscribe({next:e=>this.getTables(),error:e=>console.error(e)}):this.tablesServices.createItem(this.table).subscribe({next:e=>this.getTables(),error:e=>console.error(e)}),this.visibleModal=!1}confirmDeleted(e){this.confirmationService.confirm({header:"Estas seguro de eliminar?",message:"Por favor de confirmar.",accept:()=>{this.tablesServices.deleteItem(e.id).subscribe({next:n=>this.getTables(),error:n=>console.error(n)})}})}static{this.\u0275fac=function(n){return new(n||t)(M(G),M(A))}}static{this.\u0275cmp=k({type:t,selectors:[["app-tables"]],decls:30,vars:13,consts:[["dv",""],["cd",""],[1,"flex","flex-wrap","justify-content-center"],[1,"w-full"],["header","Mesas",1,""],[1,"pi","pi-search"],["type","text","pInputText","","placeholder","Buscar"],["type","button","pButton","","icon","pi pi-plus","size","small","pTooltip","Nueva mesa",1,"p-button-success",3,"click"],["emptyMessage","Sin mesas registradas",3,"value","rows","paginator"],["pTemplate","list"],[3,"visibleChange","header","modal","visible"],[1,"formgrid","grid","gap-3","mb-3","mt-3"],[1,"field","col-12"],["for","tableName"],["id","tableName","type","text",1,"text-base","text-color","surface-overlay","p-2","border-1","border-solid","surface-border","border-round","appearance-none","outline-none","focus:border-primary","w-full",3,"ngModelChange","ngModel"],["for","Description"],["id","Description","rows","2","cols","30","pInputTextarea","","placeholder","Descripcion",3,"ngModelChange","autoResize","ngModel"],[1,"flex","justify-content-end","gap-2"],["label","Cancelar","severity","secondary",3,"click"],["label","Guardar",3,"click"],["pTemplate","headless"],[1,"grid","grid-nogutter","p-4"],["class","col-12",4,"ngFor","ngForOf"],[1,"col-12"],[1,"grid","p-2",3,"ngClass"],[1,"col"],[1,"overflow-hidden","text-overflow-ellipsis","text-md","font-medium","text-900","mt-2",2,"width","100px"],[1,"col-fixed","gap-1"],["icon","pi pi-pencil","size","small","pTooltip","Editar",3,"click"],["severity","danger","icon","pi pi-trash","size","small","pTooltip","Eliminar",3,"click"],[1,"flex","flex-column","align-items-center","p-5","surface-overlay","border-round"],[1,"border-circle","bg-primary","inline-flex","justify-content-center","align-items-center","h-6rem","w-6rem"],[1,"pi","pi-question","text-5xl"],[1,"font-bold","text-2xl","block","mb-2","mt-4"],[1,"mb-0"],[1,"flex","align-items-center","gap-2","mt-4"],["pButton","","label","Si",1,"w-8rem",3,"click"],["pButton","","label","No",1,"p-button-outlined","w-8rem",3,"click"]],template:function(n,i){if(n&1){let p=w();o(0,"div",2)(1,"div",3)(2,"p-card",4)(3,"div")(4,"p-inputGroup",3)(5,"p-inputGroupAddon"),_(6,"i",5),r(),_(7,"input",6),o(8,"button",7),d("click",function(){return l(p),s(i.showModal())}),r()(),o(9,"p-dataView",8,0),v(11,pe,2,1,"ng-template",9),r()()()()(),o(12,"p-dialog",10),y("visibleChange",function(a){return l(p),C(i.visibleModal,a)||(i.visibleModal=a),s(a)}),o(13,"div",11)(14,"div",12)(15,"label",13),c(16,"Nombre de mesa"),r(),o(17,"input",14),y("ngModelChange",function(a){return l(p),C(i.table.name,a)||(i.table.name=a),s(a)}),r()(),o(18,"div",12)(19,"label",15),c(20,"Descripcion"),r(),o(21,"textarea",16),y("ngModelChange",function(a){return l(p),C(i.table.additional,a)||(i.table.additional=a),s(a)}),c(22,"            "),r()()(),o(23,"div",17)(24,"p-button",18),d("click",function(){return l(p),s(i.visibleModal=!1)}),r(),o(25,"p-button",19),d("click",function(){return l(p),s(i.confirmSave())}),r()()(),_(26,"p-toast"),o(27,"p-confirmDialog",null,1),v(29,me,10,2,"ng-template",20),r()}n&2&&(m(9),b("value",i.tables)("rows",5)("paginator",!0),m(3),D("header","",i.isEdit?"Editar":"Nueva"," mesa"),b("modal",!0),T("visible",i.visibleModal),m(5),T("ngModel",i.table.name),m(4),I(B(12,ae)),b("autoResize",!0),T("ngModel",i.table.additional))},dependencies:[F,P,Y,q,R,K,W,O,z,J,X,Q,Z,$,U,te,ee,H],styles:[".button-table[_ngcontent-%COMP%]{appearance:none;background-color:#fcfcfd;border-radius:4px;border-width:0;box-shadow:#2d234266 0 2px 4px,#2d23424d 0 7px 13px -3px,#d6d6e7 0 -3px inset;box-sizing:border-box;color:#36395a;cursor:pointer;font-family:JetBrains Mono,monospace;height:35vh;width:30vw;list-style:none;overflow:hidden;padding-left:16px;padding-right:16px;position:relative;text-decoration:none;transition:box-shadow .15s,transform .15s;user-select:none;-webkit-user-select:none;touch-action:manipulation;white-space:nowrap;will-change:box-shadow,transform;font-size:18px}.button-table[_ngcontent-%COMP%]:focus{box-shadow:#d6d6e7 0 0 0 1.5px inset,#2d234266 0 2px 4px,#2d23424d 0 7px 13px -3px,#d6d6e7 0 -3px inset}.button-table[_ngcontent-%COMP%]:hover{box-shadow:#2d234266 0 4px 8px,#2d23424d 0 7px 13px -3px,#d6d6e7 0 -3px inset;transform:translateY(-2px)}.button-table[_ngcontent-%COMP%]:active{box-shadow:#d6d6e7 0 3px 7px inset;transform:translateY(2px)}"]})}}return t})();var re=(()=>{class t{static{this.\u0275fac=function(n){return new(n||t)}}static{this.\u0275mod=x({type:t})}static{this.\u0275inj=h({imports:[V.forChild([{path:"",component:oe}]),V]})}}return t})();var Fe=(()=>{class t{static{this.\u0275fac=function(n){return new(n||t)}}static{this.\u0275mod=x({type:t})}static{this.\u0275inj=h({imports:[re,ie]})}}return t})();export{Fe as TablesModule};
