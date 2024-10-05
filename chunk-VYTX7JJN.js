import{b as I}from"./chunk-64WP64BE.js";import{b as $,e as ee,f as te,g as ie,h as ne,j as oe}from"./chunk-RUSD7P4Y.js";import"./chunk-J6VSZILJ.js";import{a as Q,g as U,j as X,n as Z}from"./chunk-4JEEGTY5.js";import"./chunk-4HF4CYB4.js";import{b as J,c as K}from"./chunk-BJ7UQRZ4.js";import{b as L,d as G,g as O,k as q,l as H,s as Y}from"./chunk-BFCD6XJQ.js";import"./chunk-4YRY4IP2.js";import{e as R,l as z}from"./chunk-JY4AAIVW.js";import{$ as B,A as a,B as s,Ca as D,Da as F,N as p,O as S,W as h,Y as f,Ya as P,Za as A,ba as o,ca as r,da as _,e as k,ha as x,ia as c,ja as b,na as W,r as C,sb as V,ta as E,ua as u,v as N,va as T,w as y,wa as j,xa as M,ya as v,za as w}from"./chunk-VUSRYWWQ.js";var se=()=>({width:"100%"}),me=i=>({"border-top-1 surface-border":i});function pe(i,d){i&1&&_(0,"img",21)}function ce(i,d){if(i&1){let e=x();o(0,"div",24)(1,"div",25)(2,"div",26)(3,"div",27),u(4),r()(),o(5,"div",28)(6,"p-button",29),c("click",function(){let t=a(e).$implicit,m=b(2);return s(m.showModal(!0,t))}),r()(),o(7,"div",28)(8,"p-button",30),c("click",function(){let t=a(e).$implicit,m=b(2);return s(m.confirmDeleted(t))}),r()()()()}if(i&2){let e=d.$implicit,n=d.first;p(),f("ngClass",F(2,me,!n)),p(3),T(e.name)}}function de(i,d){if(i&1&&(o(0,"div",22),h(1,ce,9,4,"div",23),r()),i&2){let e=d.$implicit;p(),f("ngForOf",e)}}function ue(i,d){if(i&1){let e=x();o(0,"div",31)(1,"div",32),_(2,"i",33),r(),o(3,"span",34),u(4),r(),o(5,"p",35),u(6),r(),o(7,"div",36)(8,"button",37),c("click",function(){a(e),b();let t=E(30);return s(t.accept())}),r(),o(9,"button",38),c("click",function(){a(e),b();let t=E(30);return s(t.reject())}),r()()()}if(i&2){let e=d.$implicit;p(4),j(" ",e.header," "),p(2),T(e.message)}}var le=(()=>{class i{constructor(e,n,t){this.confirmationService=e,this.iMeal=n,this.categoriesServices=t,this.items=[],this.meal=new I,this.visibleModal=!1,this.isEdit=!1,this.categories=[]}ngOnInit(){this.getMeals(),this.getCategories()}delay(e){return k(this,null,function*(){return new Promise(n=>setTimeout(n,e))})}getMeals(){this.iMeal.getItemsByInstance().subscribe({next:e=>{this.items=e},error:e=>console.error(e)})}getCategories(){this.categoriesServices.getItemsByInstance().subscribe({next:e=>{this.categories=e},error:e=>console.error(e)})}showModal(e=!1,n){console.log(n),this.isEdit=e,e?(this.meal=n,this.selectedCategory=this.categories.find(t=>t.id==n?.categoryId)):this.meal=new I,this.visibleModal=!0}confirmSave(){this.meal.categoryId=this.selectedCategory.id,this.isEdit?this.iMeal.updateItem(this.meal.id,this.meal).subscribe({next:e=>this.getMeals(),error:e=>console.error(e)}):this.iMeal.createItem(this.meal).subscribe({next:e=>this.getMeals(),error:e=>console.error(e)}),this.selectedCategory=null,this.visibleModal=!1}confirmDeleted(e){this.confirmationService.confirm({header:"Estas seguro de eliminar?",message:"Por favor de confirmar.",accept:()=>{this.iMeal.deleteItem(this.meal.id).subscribe({next:n=>this.getMeals(),error:n=>console.error(n)})}})}static{this.\u0275fac=function(n){return new(n||i)(S(R),S(H),S(q))}}static{this.\u0275cmp=N({type:i,selectors:[["app-meals"]],decls:32,vars:14,consts:[["dv",""],["cd",""],["header","Alimentos",1,""],["pTemplate","header"],[1,"w-full"],[1,"pi","pi-search"],["type","text","pInputText","","placeholder","Buscar"],["type","button","pButton","","icon","pi pi-plus","size","small","pTooltip","Nuevo alimento/bebida",1,"p-button-success",3,"click"],["emptyMessage","Alimentos no registrados",3,"value","rows","paginator"],["pTemplate","list"],[3,"visibleChange","header","modal","visible"],[1,"formgrid","grid","gap-3","mb-3","mt-3"],[1,"field","col-12"],["for","role"],["id","role","optionLabel","name","placeholder","Selecciona la categoria",3,"ngModelChange","options","ngModel"],["for","tableName"],["id","tableName","type","text",1,"text-base","text-color","surface-overlay","p-2","border-1","border-solid","surface-border","border-round","appearance-none","outline-none","focus:border-primary","w-full",3,"ngModelChange","ngModel"],[1,"flex","justify-content-end","gap-2"],["label","Cancel","severity","secondary",3,"click"],["label","Save",3,"click"],["pTemplate","headless"],["alt","Card","src","../../../../assets/layout/images/restaurante.webp",2,"max-height","15vh","object-fit","cover"],[1,"grid","grid-nogutter"],["class","col-12",4,"ngFor","ngForOf"],[1,"col-12"],[1,"grid","p-2",3,"ngClass"],[1,"col"],[1,"overflow-hidden","text-overflow-ellipsis","text-lg","font-medium","text-900","mt-2",2,"width","100px"],[1,"col-fixed","gap-1"],["icon","pi pi-pencil","size","small","pTooltip","Editar",3,"click"],["severity","danger","icon","pi pi-trash","size","small","pTooltip","Eliminar",3,"click"],[1,"flex","flex-column","align-items-center","p-5","surface-overlay","border-round"],[1,"border-circle","bg-primary","inline-flex","justify-content-center","align-items-center","h-6rem","w-6rem"],[1,"pi","pi-question","text-5xl"],[1,"font-bold","text-2xl","block","mb-2","mt-4"],[1,"mb-0"],[1,"flex","align-items-center","gap-2","mt-4"],["pButton","","label","Si",1,"w-8rem",3,"click"],["pButton","","label","No",1,"p-button-outlined","w-8rem",3,"click"]],template:function(n,t){if(n&1){let m=x();o(0,"p-card",2),h(1,pe,1,0,"ng-template",3),o(2,"div")(3,"p-inputGroup",4)(4,"p-inputGroupAddon"),_(5,"i",5),r(),_(6,"input",6),o(7,"button",7),c("click",function(){return a(m),s(t.showModal())}),r()(),o(8,"p-dataView",8,0),h(10,de,2,1,"ng-template",9),r()()(),o(11,"p-dialog",10),w("visibleChange",function(l){return a(m),v(t.visibleModal,l)||(t.visibleModal=l),s(l)}),o(12,"div",11)(13,"div",12)(14,"label",13),u(15,"Rol"),r(),o(16,"p-dropdown",14),w("ngModelChange",function(l){return a(m),v(t.selectedCategory,l)||(t.selectedCategory=l),s(l)}),r()(),o(17,"div",12)(18,"label",15),u(19,"Nombre de alimento / bebida"),r(),o(20,"input",16),w("ngModelChange",function(l){return a(m),v(t.meal.name,l)||(t.meal.name=l),s(l)}),r()(),o(21,"div",12)(22,"label",15),u(23,"Precio"),r(),o(24,"input",16),w("ngModelChange",function(l){return a(m),v(t.meal.price,l)||(t.meal.price=l),s(l)}),r()()(),o(25,"div",17)(26,"p-button",18),c("click",function(){return a(m),s(t.visibleModal=!1)}),r(),o(27,"p-button",19),c("click",function(){return a(m),s(t.confirmSave())}),r()()(),_(28,"p-toast"),o(29,"p-confirmDialog",null,1),h(31,ue,10,2,"ng-template",20),r()}n&2&&(p(8),f("value",t.items)("rows",5)("paginator",!0),p(3),W("header","",t.isEdit?"Editar":"Nuevo"," alimento/bebida"),f("modal",!0),M("visible",t.visibleModal),p(5),B(D(13,se)),f("options",t.categories),M("ngModel",t.selectedCategory),p(4),M("ngModel",t.meal.name),p(4),M("ngModel",t.meal.price))},dependencies:[P,A,J,K,z,Y,L,G,O,Q,Z,ee,te,$,ne,ie,U,X]})}}return i})();var ae=(()=>{class i{static{this.\u0275fac=function(n){return new(n||i)}}static{this.\u0275mod=y({type:i})}static{this.\u0275inj=C({imports:[V.forChild([{path:"",component:le}]),V]})}}return i})();var Le=(()=>{class i{static{this.\u0275fac=function(n){return new(n||i)}}static{this.\u0275mod=y({type:i})}static{this.\u0275inj=C({imports:[ae,oe]})}}return i})();export{Le as MealsModule};
