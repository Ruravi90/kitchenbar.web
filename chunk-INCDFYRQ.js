import{e as L}from"./chunk-M4WXGWUD.js";import{b as Q,e as U,f as X,g as Z,h as ee,n as te}from"./chunk-QKYNGRZ6.js";import"./chunk-X52ZXH5X.js";import{a as J,g as $,o as K}from"./chunk-AJV43YAS.js";import{b as Y,c as q}from"./chunk-4QSKJXB4.js";import{A as H,b as O,e as P,i as A,y as R}from"./chunk-HN6FBLWS.js";import"./chunk-4YRY4IP2.js";import{e as W,g as z,l as G}from"./chunk-MABZNZAS.js";import{$a as D,Aa as E,C as a,D as s,Ea as N,P as c,Q as x,Y as w,_ as u,_a as j,ca as n,da as o,ea as f,fb as F,ia as y,ja as m,ka as h,oa as V,t as _,ua as C,va as b,vb as k,wa as S,x as T,xa as I,y as v,ya as M,za as B}from"./chunk-OVWECSA7.js";var oe=t=>({"border-top-1 surface-border":t});function ae(t,d){if(t&1){let e=y();n(0,"div",22)(1,"div",23)(2,"div",24)(3,"div",25),b(4),o()(),n(5,"div",26)(6,"p-button",27),m("click",function(){let r=a(e).$implicit,l=h(2);return s(l.showModal(!0,r))}),o()(),n(7,"div",26)(8,"p-button",28),m("click",function(){let r=a(e).$implicit,l=h(2);return s(l.confirmDeleted(r))}),o()()()()}if(t&2){let e=d.$implicit,i=d.first;c(),u("ngClass",N(2,oe,!i)),c(3),S(e.name)}}function se(t,d){if(t&1&&(n(0,"div",20),w(1,ae,9,4,"div",21),o()),t&2){let e=d.$implicit;c(),u("ngForOf",e)}}function le(t,d){if(t&1){let e=y();n(0,"div",29)(1,"div",30),f(2,"i",31),o(),n(3,"span",32),b(4),o(),n(5,"p",33),b(6),o(),n(7,"div",34)(8,"button",35),m("click",function(){a(e),h();let r=C(23);return s(r.accept())}),o(),n(9,"button",36),m("click",function(){a(e),h();let r=C(23);return s(r.reject())}),o()()()}if(t&2){let e=d.$implicit;c(4),I(" ",e.header," "),c(2),S(e.message)}}var re=(()=>{class t{constructor(e,i,r){this.confirmationService=e,this.messageService=i,this.branchsServices=r,this.branches=[],this.branch={},this.visibleModal=!1,this.isEdit=!1}ngOnInit(){this.getbranches()}getbranches(){this.branchsServices.getItemsByInstance().subscribe({next:e=>{this.branches=e},error:e=>{this.messageService.add({severity:"warn",summary:"Alerta",detail:e.error.messages})}})}showModal(e=!1,i){this.isEdit=e,e?this.branch=i:this.branch=new L,this.visibleModal=!0}confirmSave(){this.isEdit?this.branchsServices.updateItem(this.branch.id,this.branch).subscribe({next:e=>this.getbranches(),error:e=>{this.messageService.add({severity:"warn",summary:"Alerta",detail:e.error.messages})}}):this.branchsServices.createItem(this.branch).subscribe({next:e=>this.getbranches(),error:e=>{this.messageService.add({severity:"warn",summary:"Alerta",detail:e.error.messages})}}),this.visibleModal=!1}confirmDeleted(e){this.confirmationService.confirm({header:"Estas seguro de eliminar?",message:"Por favor de confirmar.",accept:()=>{this.branchsServices.deleteItem(this.branch.id).subscribe({next:i=>this.getbranches(),error:i=>{this.messageService.add({severity:"warn",summary:"Alerta",detail:i.error.messages})}})}})}static{this.\u0275fac=function(i){return new(i||t)(x(W),x(z),x(R))}}static{this.\u0275cmp=T({type:t,selectors:[["app-branches"]],decls:25,vars:8,consts:[["dv",""],["cd",""],[1,"flex","flex-wrap","justify-content-center"],[1,"w-full"],["header","Sucursales",1,""],[1,"w-full","mb-4"],[1,"pi","pi-search"],["type","text","pInputText","","placeholder","Buscar sucursal","pTooltip","Escribe para buscar"],["type","button","pButton","","icon","pi pi-plus","size","small","pTooltip","Nueva sucursal",1,"p-button-success",3,"click"],["emptyMessage","Sin categorias registradas",3,"value","rows","paginator"],["pTemplate","list"],[3,"visibleChange","header","modal","visible"],[1,"formgrid","grid","gap-3","mb-3","mt-3"],[1,"field","col-12"],["for","tableName"],["id","tableName","type","text",1,"text-base","text-color","surface-overlay","p-2","border-1","border-solid","surface-border","border-round","appearance-none","outline-none","focus:border-primary","w-full",3,"ngModelChange","ngModel"],[1,"flex","justify-content-end","gap-2"],["label","Cancelar","severity","secondary",3,"click"],["label","Guardar",3,"click"],["pTemplate","headless"],[1,"grid","grid-nogutter"],["class","col-12",4,"ngFor","ngForOf"],[1,"col-12"],[1,"grid","p-2",3,"ngClass"],[1,"col"],[1,"overflow-hidden","text-overflow-ellipsis","text-lg","font-medium","text-900","mt-2"],[1,"col-fixed","gap-1"],["icon","pi pi-pencil","size","small","pTooltip","Editar",3,"click"],["severity","danger","icon","pi pi-trash","size","small","pTooltip","Eliminar",3,"click"],[1,"flex","flex-column","align-items-center","p-5","surface-overlay","border-round"],[1,"border-circle","bg-primary","inline-flex","justify-content-center","align-items-center","h-6rem","w-6rem"],[1,"pi","pi-question","text-5xl"],[1,"font-bold","text-2xl","block","mb-2","mt-4"],[1,"mb-0"],[1,"flex","align-items-center","gap-2","mt-4"],["pButton","","label","Si",1,"w-8rem",3,"click"],["pButton","","label","No",1,"p-button-outlined","w-8rem",3,"click"]],template:function(i,r){if(i&1){let l=y();n(0,"div",2)(1,"div",3)(2,"p-card",4)(3,"div")(4,"p-inputGroup",5)(5,"p-inputGroupAddon"),f(6,"i",6),o(),f(7,"input",7),n(8,"button",8),m("click",function(){return a(l),s(r.showModal())}),o()(),n(9,"p-dataView",9,0),w(11,se,2,1,"ng-template",10),o()()()()(),n(12,"p-dialog",11),E("visibleChange",function(p){return a(l),B(r.visibleModal,p)||(r.visibleModal=p),s(p)}),n(13,"div",12)(14,"div",13)(15,"label",14),b(16,"Nombre de la sucursal"),o(),n(17,"input",15),E("ngModelChange",function(p){return a(l),B(r.branch.name,p)||(r.branch.name=p),s(p)}),o()()(),n(18,"div",16)(19,"p-button",17),m("click",function(){return a(l),s(r.visibleModal=!1)}),o(),n(20,"p-button",18),m("click",function(){return a(l),s(r.confirmSave())}),o()()(),f(21,"p-toast"),n(22,"p-confirmDialog",null,1),w(24,le,10,2,"ng-template",19),o()}i&2&&(c(9),u("value",r.branches)("rows",5)("paginator",!0),c(3),V("header","",r.isEdit?"Editar":"Nueva"," sucursal"),u("modal",!0),M("visible",r.visibleModal),c(5),M("ngModel",r.branch.name))},dependencies:[j,D,Y,q,G,H,O,P,A,J,K,U,X,Q,ee,Z,$],styles:[".button-table[_ngcontent-%COMP%]{appearance:none;background-color:#fcfcfd;border-radius:4px;border-width:0;box-shadow:#2d234266 0 2px 4px,#2d23424d 0 7px 13px -3px,#d6d6e7 0 -3px inset;box-sizing:border-box;color:#36395a;cursor:pointer;font-family:JetBrains Mono,monospace;height:35vh;width:30vw;list-style:none;overflow:hidden;padding-left:16px;padding-right:16px;position:relative;text-decoration:none;transition:box-shadow .15s,transform .15s;user-select:none;-webkit-user-select:none;touch-action:manipulation;white-space:nowrap;will-change:box-shadow,transform;font-size:18px}.button-table[_ngcontent-%COMP%]:focus{box-shadow:#d6d6e7 0 0 0 1.5px inset,#2d234266 0 2px 4px,#2d23424d 0 7px 13px -3px,#d6d6e7 0 -3px inset}.button-table[_ngcontent-%COMP%]:hover{box-shadow:#2d234266 0 4px 8px,#2d23424d 0 7px 13px -3px,#d6d6e7 0 -3px inset;transform:translateY(-2px)}.button-table[_ngcontent-%COMP%]:active{box-shadow:#d6d6e7 0 3px 7px inset;transform:translateY(2px)}"]})}}return t})();var ne=(()=>{class t{static{this.\u0275fac=function(i){return new(i||t)}}static{this.\u0275mod=v({type:t})}static{this.\u0275inj=_({imports:[k.forChild([{path:"",component:re}]),k]})}}return t})();var je=(()=>{class t{static{this.\u0275fac=function(i){return new(i||t)}}static{this.\u0275mod=v({type:t})}static{this.\u0275inj=_({imports:[F,ne,te]})}}return t})();export{je as BranchesModule};
