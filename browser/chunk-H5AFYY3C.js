import{a as P,b as R,c as V,d as $,e as k,f as U}from"./chunk-E6TKTF7G.js";import{a as O}from"./chunk-4MLLL3M2.js";import{b as D}from"./chunk-KVEXNWIA.js";import{h as B,i as E,j as G,k as N}from"./chunk-737QNFMI.js";import"./chunk-MXMFQBGE.js";import{c as F,e as A}from"./chunk-FDCLM4BU.js";import{b,c as _,d as T}from"./chunk-BJ3AG4RX.js";import{c as I}from"./chunk-JSWT4IH4.js";import{i as C,k as j,l as S}from"./chunk-YKTI5QJU.js";import"./chunk-4YRY4IP2.js";import{l as y}from"./chunk-P3S5YJFO.js";import{$a as h,Fa as x,N as m,O as g,W as s,Y as d,_a as v,ea as o,fa as r,fb as w,ga as a,r as p,ub as c,v as f,w as l,wa as u,xa as M}from"./chunk-SBAOVUZ3.js";var K=e=>({"border-top-1 surface-border":e});function L(e,n){e&1&&a(0,"img",9)}function Q(e,n){if(e&1&&(o(0,"div",12)(1,"div",13)(2,"div",14)(3,"div",15)(4,"div")(5,"div",16),u(6),r()()(),o(7,"div",17)(8,"div",18),a(9,"p-button",19)(10,"p-button",20),r()()()()()),e&2){let t=n.$implicit,i=n.first;m(),d("ngClass",x(2,K,!i)),m(5),M(t.name)}}function W(e,n){if(e&1&&(o(0,"div",10),s(1,Q,11,4,"div",11),r()),e&2){let t=n.$implicit;m(),d("ngForOf",t)}}var z=(()=>{class e{constructor(t){this.iMeal=t}ngOnInit(){this.getTables()}getTables(){this.iMeal.getItemsByInstance().subscribe({next:t=>{this.items=t},error:t=>console.error(t)})}static{this.\u0275fac=function(i){return new(i||e)(g(I))}}static{this.\u0275cmp=f({type:e,selectors:[["app-meals"]],decls:12,vars:3,consts:[["dv",""],["header","Usuarios",1,""],["pTemplate","header"],[1,"w-full"],[1,"pi","pi-search"],["type","text","pInputText","","placeholder","Buscar/agregar"],["type","button","pButton","","icon","pi pi-plus",1,"p-button-success"],["emptyMessage","Alimentos no registrados",3,"value","rows","paginator"],["pTemplate","list"],["alt","Card","src","../../../../assets/layout/images/restaurante.webp",2,"max-height","15vh","object-fit","cover"],[1,"grid","grid-nogutter"],["class","col-12",4,"ngFor","ngForOf"],[1,"col-12"],[1,"flex","flex-column","sm:flex-row","sm:align-items-center","p-4","gap-3",3,"ngClass"],[1,"flex","flex-column","md:flex-row","justify-content-between","md:align-items-center","flex-1","gap-4"],[1,"flex","flex-row","md:flex-column","justify-content-between","align-items-start","gap-2"],[1,"text-lg","font-medium","text-900","mt-2"],[1,"flex","flex-column","md:align-items-end","gap-5"],[1,"flex","md:flex-row","gap-2"],["icon","pi pi-pencil",1,"flex-auto","md:align-items-end","white-space-nowrap"],["severity","danger","icon","pi pi-trash",1,"flex-auto","md:align-items-end","white-space-nowrap"]],template:function(i,J){i&1&&(o(0,"p-card",1),s(1,L,1,0,"ng-template",2),o(2,"div")(3,"p-inputGroup",3)(4,"p-inputGroupAddon"),a(5,"i",4),r(),a(6,"input",5),o(7,"button",6),u(8,"Agregar"),r()(),o(9,"p-dataView",7,0),s(11,W,2,1,"ng-template",8),r()()()),i&2&&(m(9),d("value",J.items)("rows",5)("paginator",!0))},dependencies:[v,h,b,_,y,j,G,B,V,k]})}}return e})();var H=(()=>{class e{static{this.\u0275fac=function(i){return new(i||e)}}static{this.\u0275mod=l({type:e})}static{this.\u0275inj=p({imports:[c.forChild([{path:"",component:z}]),c]})}}return e})();var Fe=(()=>{class e{static{this.\u0275fac=function(i){return new(i||e)}}static{this.\u0275mod=l({type:e})}static{this.\u0275inj=p({imports:[w,H,T,F,S,C,A,N,O,P,R,D,E,$,U]})}}return e})();export{Fe as MealsModule};
