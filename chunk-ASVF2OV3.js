import{a as F}from"./chunk-OLW4452C.js";import{a as A,c as j}from"./chunk-VO7G42AR.js";import{b as M,d as T}from"./chunk-7FN5CSOE.js";import"./chunk-4YRY4IP2.js";import{o as s}from"./chunk-AXTF557K.js";import{Ba as O,D as c,H as L,I as m,Ia as h,Ib as _,J as b,Lb as f,V as k,W as x,_ as w,aa as p,ba as a,ea as S,fb as C,ia as E,la as D,pa as n,qa as r,ra as u,vb as g,wa as o}from"./chunk-RICBQGXD.js";var K=(()=>{class e{el;renderer;zone;constructor(t,i,l){this.el=t,this.renderer=i,this.zone=l}selector;set enterClass(t){this._enterClass=t,console.warn("enterClass is deprecated, use enterFromClass instead")}get enterClass(){return this._enterClass}enterFromClass;enterActiveClass;enterToClass;set leaveClass(t){this._leaveClass=t,console.warn("leaveClass is deprecated, use leaveFromClass instead")}get leaveClass(){return this._leaveClass}leaveFromClass;leaveActiveClass;leaveToClass;hideOnOutsideClick;toggleClass;hideOnEscape;eventListener;documentClickListener;documentKeydownListener;target;enterListener;leaveListener;animating;_enterClass;_leaveClass;clickListener(){this.target=this.resolveTarget(),this.toggleClass?this.toggle():this.target.offsetParent===null?this.enter():this.leave()}toggle(){s.hasClass(this.target,this.toggleClass)?s.removeClass(this.target,this.toggleClass):s.addClass(this.target,this.toggleClass)}enter(){this.enterActiveClass?this.animating||(this.animating=!0,this.enterActiveClass==="slidedown"&&(this.target.style.height="0px",s.removeClass(this.target,"hidden"),this.target.style.maxHeight=this.target.scrollHeight+"px",s.addClass(this.target,"hidden"),this.target.style.height=""),s.addClass(this.target,this.enterActiveClass),(this.enterClass||this.enterFromClass)&&s.removeClass(this.target,this.enterClass||this.enterFromClass),this.enterListener=this.renderer.listen(this.target,"animationend",()=>{s.removeClass(this.target,this.enterActiveClass),this.enterToClass&&s.addClass(this.target,this.enterToClass),this.enterListener&&this.enterListener(),this.enterActiveClass==="slidedown"&&(this.target.style.maxHeight=""),this.animating=!1})):((this.enterClass||this.enterFromClass)&&s.removeClass(this.target,this.enterClass||this.enterFromClass),this.enterToClass&&s.addClass(this.target,this.enterToClass)),this.hideOnOutsideClick&&this.bindDocumentClickListener(),this.hideOnEscape&&this.bindDocumentKeydownListener()}leave(){this.leaveActiveClass?this.animating||(this.animating=!0,s.addClass(this.target,this.leaveActiveClass),(this.leaveClass||this.leaveFromClass)&&s.removeClass(this.target,this.leaveClass||this.leaveFromClass),this.leaveListener=this.renderer.listen(this.target,"animationend",()=>{s.removeClass(this.target,this.leaveActiveClass),this.leaveToClass&&s.addClass(this.target,this.leaveToClass),this.leaveListener&&this.leaveListener(),this.animating=!1})):((this.leaveClass||this.leaveFromClass)&&s.removeClass(this.target,this.leaveClass||this.leaveFromClass),this.leaveToClass&&s.addClass(this.target,this.leaveToClass)),this.hideOnOutsideClick&&this.unbindDocumentClickListener(),this.hideOnEscape&&this.unbindDocumentKeydownListener()}resolveTarget(){if(this.target)return this.target;switch(this.selector){case"@next":return this.el.nativeElement.nextElementSibling;case"@prev":return this.el.nativeElement.previousElementSibling;case"@parent":return this.el.nativeElement.parentElement;case"@grandparent":return this.el.nativeElement.parentElement.parentElement;default:return document.querySelector(this.selector)}}bindDocumentClickListener(){this.documentClickListener||(this.documentClickListener=this.renderer.listen(this.el.nativeElement.ownerDocument,"click",t=>{!this.isVisible()||getComputedStyle(this.target).getPropertyValue("position")==="static"?this.unbindDocumentClickListener():this.isOutsideClick(t)&&this.leave()}))}bindDocumentKeydownListener(){this.documentKeydownListener||this.zone.runOutsideAngular(()=>{this.documentKeydownListener=this.renderer.listen(this.el.nativeElement.ownerDocument,"keydown",t=>{let{key:i,keyCode:l,which:d,type:y}=t;(!this.isVisible()||getComputedStyle(this.target).getPropertyValue("position")==="static")&&this.unbindDocumentKeydownListener(),this.isVisible()&&i==="Escape"&&l===27&&d===27&&this.leave()})})}isVisible(){return this.target.offsetParent!==null}isOutsideClick(t){return!this.el.nativeElement.isSameNode(t.target)&&!this.el.nativeElement.contains(t.target)&&!this.target.contains(t.target)}unbindDocumentClickListener(){this.documentClickListener&&(this.documentClickListener(),this.documentClickListener=null)}unbindDocumentKeydownListener(){this.documentKeydownListener&&(this.documentKeydownListener(),this.documentKeydownListener=null)}ngOnDestroy(){this.target=null,this.eventListener&&this.eventListener(),this.unbindDocumentClickListener(),this.unbindDocumentKeydownListener()}static \u0275fac=function(i){return new(i||e)(a(x),a(S),a(k))};static \u0275dir=b({type:e,selectors:[["","pStyleClass",""]],hostAttrs:[1,"p-element"],hostBindings:function(i,l){i&1&&o("click",function(y){return l.clickListener(y)})},inputs:{selector:[0,"pStyleClass","selector"],enterClass:"enterClass",enterFromClass:"enterFromClass",enterActiveClass:"enterActiveClass",enterToClass:"enterToClass",leaveClass:"leaveClass",leaveFromClass:"leaveFromClass",leaveActiveClass:"leaveActiveClass",leaveToClass:"leaveToClass",hideOnOutsideClick:[2,"hideOnOutsideClick","hideOnOutsideClick",C],toggleClass:"toggleClass",hideOnEscape:[2,"hideOnEscape","hideOnEscape",C]},features:[E]})}return e})(),I=(()=>{class e{static \u0275fac=function(i){return new(i||e)};static \u0275mod=m({type:e});static \u0275inj=c({imports:[g]})}return e})();var R=(()=>{class e{constructor(t,i){this.layoutService=t,this.router=i}static{this.\u0275fac=function(i){return new(i||e)(a(F),a(_))}}static{this.\u0275cmp=L({type:e,selectors:[["app-landing"]],decls:30,vars:3,consts:[[1,"surface-0","flex","justify-content-center"],["id","home",1,"landing-wrapper","overflow-hidden"],[1,"py-4","px-4","mx-0","md:mx-6","lg:mx-8","lg:px-8","flex","align-items-center","justify-content-between","relative","lg:static","mb-3"],["href","#",1,"flex","align-items-center"],["alt","Sakai Logo","height","50",1,"mr-0","lg:mr-2",3,"src"],[1,"text-900","font-medium","text-2xl","line-height-3","mr-8"],["pRipple","","pStyleClass","@next","enterClass","hidden","leaveToClass","hidden",1,"cursor-pointer","block","lg:hidden","text-700",3,"hideOnOutsideClick"],[1,"pi","pi-bars","text-4xl"],[1,"align-items-center","surface-0","flex-grow-1","justify-content-between","hidden","lg:flex","absolute","lg:static","w-full","left-0","px-6","lg:px-0","z-2",2,"top","120px"],[1,"list-none","p-0","m-0","flex","lg:align-items-center","select-none","flex-column","lg:flex-row","cursor-pointer"],["pRipple","",1,"flex","m-0","md:ml-5","px-0","py-3","text-900","font-medium","line-height-3",3,"click"],[1,"flex","justify-content-between","lg:block","border-top-1","lg:border-top-none","surface-border","py-3","lg:py-0","mt-3","lg:mt-0"],["pButton","","pRipple","","label","Login",1,"p-button-text","p-button-rounded","border-none","font-light","line-height-2","text-blue-500"],["pButton","","pRipple","","label","Register",1,"p-button-rounded","border-none","ml-5","font-light","line-height-2","bg-blue-500","text-white"]],template:function(i,l){i&1&&(n(0,"div",0)(1,"div",1)(2,"div",2)(3,"a",3),u(4,"img",4),n(5,"span",5),h(6,"SAKAI"),r()(),n(7,"a",6),u(8,"i",7),r(),n(9,"div",8)(10,"ul",9)(11,"li")(12,"a",10),o("click",function(){return l.router.navigate(["/landing"],{fragment:"home"})}),n(13,"span"),h(14,"Home"),r()()(),n(15,"li")(16,"a",10),o("click",function(){return l.router.navigate(["/landing"],{fragment:"features"})}),n(17,"span"),h(18,"Features"),r()()(),n(19,"li")(20,"a",10),o("click",function(){return l.router.navigate(["/landing"],{fragment:"highlights"})}),n(21,"span"),h(22,"Highlights"),r()()(),n(23,"li")(24,"a",10),o("click",function(){return l.router.navigate(["/landing"],{fragment:"pricing"})}),n(25,"span"),h(26,"Pricing"),r()()()(),n(27,"div",11),u(28,"button",12)(29,"button",13),r()()()()()),i&2&&(p(4),O("src","assets/layout/images/",l.layoutService.config().colorScheme==="light"?"logo-dark":"logo-white",".svg",w),p(3),D("hideOnOutsideClick",!0))},dependencies:[K,M],encapsulation:2})}}return e})();var H=(()=>{class e{static{this.\u0275fac=function(i){return new(i||e)}}static{this.\u0275mod=m({type:e})}static{this.\u0275inj=c({imports:[f.forChild([{path:"",component:R}]),f]})}}return e})();var oe=(()=>{class e{static{this.\u0275fac=function(i){return new(i||e)}}static{this.\u0275mod=m({type:e})}static{this.\u0275inj=c({imports:[g,H,j,I,A,T]})}}return e})();export{oe as LandingModule};
