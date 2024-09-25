import{a as ae,b as se}from"./chunk-XWWTAWEY.js";import{a as oe,b as ne}from"./chunk-XK5AAZDI.js";import{b as re}from"./chunk-KB7CDDPS.js";import{h as O,i as ee,j as te,k as ie}from"./chunk-FYYOUDWT.js";import"./chunk-UQHMDMBN.js";import{c as K,e as T}from"./chunk-6KHCE25A.js";import{c as G,d as Y}from"./chunk-QUUG4HCO.js";import{b as X}from"./chunk-JSWT4IH4.js";import{i as $,k as Z,l as A}from"./chunk-FI7I4ISR.js";import"./chunk-XSSXK7EZ.js";import{l as H}from"./chunk-YYX7IYLV.js";import{$a as q,Ha as J,N as w,O as j,R,Y as I,_ as S,a as C,ab as Q,b as y,e as L,ga as u,gb as W,ha as h,ia as v,q as V,r as b,t as z,ub as k,w as B,x as M,ya as D,za as N}from"./chunk-EN5K7PU7.js";var f=function(e){return e[e.Up=1]="Up",e[e.Down=3]="Down",e[e.Right=6]="Right",e[e.Left=8]="Left",e[e.UpMirrored=2]="UpMirrored",e[e.DownMirrored=4]="DownMirrored",e[e.LeftMirrored=5]="LeftMirrored",e[e.RightMirrored=7]="RightMirrored",e[e.Default=0]="Default",e[e.NotJpeg=-1]="NotJpeg",e[e.NotDefined=-2]="NotDefined",e}(f||{}),fe,l=class{};fe=l;l.getOrientation=e=>new Promise((t,n)=>{try{let r=new FileReader;r.onload=()=>{let o=new DataView(r.result);if(!o.byteLength||o.getUint16(0,!1)!==65496)return t(f.NotDefined);let s=o.byteLength,i=2;for(;i<s;){let m=o.getUint16(i,!1);if(i+=2,m===65505){if(o.getUint32(i+=2,!1)!==1165519206)return t(f.NotJpeg);let d=o.getUint16(i+=6,!1)===18761;i+=o.getUint32(i+4,d);let c=o.getUint16(i,d);i+=2;for(let a=0;a<c;a++)if(o.getUint16(i+a*12,d)===274)return t(o.getUint16(i+a*12+8,d))}else{if((m&65280)!==65280)break;i+=o.getUint16(i,!1)}}return t(f.NotJpeg)},r.readAsArrayBuffer(e)}catch{return n(f.Default)}});l.uploadFile=(e,t=!0,n=!1)=>new Promise(function(r,o){let s=/^((?!chrome|android).)*safari/i.test(navigator.userAgent),i=/iPad|iPhone|iPod/i.test(navigator.userAgent);Promise.resolve(s||i).then(m=>m?l.generateUploadInputNative(window.document,t,n):l.generateUploadInputRenderer(e,t,n)).then(m=>{let d=m?Array.from(m):[],c=d.map(g=>l.getOrientation(g)),a=d.map(g=>l.fileToDataURL(g)),p=[];Promise.all(c).then(g=>(p=g,Promise.all(a))).then(g=>{let x=g.map((F,P)=>({image:F.dataUrl,orientation:p[P],fileName:F.fileName}));r(t?x:x[0])})}).catch(m=>o(m))});l.fileToDataURL=e=>new Promise((t,n)=>{let r=new FileReader;r.onload=o=>{t({dataUrl:o.target.result,fileName:e.name})};try{r.readAsDataURL(e)}catch(o){n(`ngx-image-compress - probably no file have been selected: ${o}`)}});l.generateUploadInputRenderer=(e,t=!0,n=!1)=>{let r=!1;return new Promise((o,s)=>{let i=e.createElement("input");e.setStyle(i,"display","none"),e.setProperty(i,"type","file"),e.setProperty(i,"accept","image/*"),t&&e.setProperty(i,"multiple","true"),e.listen(i,"click",m=>{m.target.value=""}),e.listen(i,"change",m=>{r=!0;let d=m.target.files;o(d)}),n&&window.addEventListener("focus",()=>{setTimeout(()=>{r||s(new Error("file upload on blur - no file selected"))},300)},{once:!0}),i.click()})};l.generateUploadInputNative=(e,t=!0,n=!1)=>{let r=!1;return new Promise((o,s)=>{let i=e.createElement("input");i.id="upload-input"+new Date,i.style.display="none",i.setAttribute("type","file"),i.setAttribute("accept","image/*"),t&&i.setAttribute("multiple","true"),e.body.appendChild(i),i.addEventListener("change",()=>{r=!0,o(i.files),e.body.removeChild(e.getElementById(i.id))},{once:!0}),n&&window.addEventListener("focus",()=>{setTimeout(()=>{!r&&e.getElementById(i.id)&&(s(new Error("file upload on blur - no file selected")),e.body.removeChild(e.getElementById(i.id)))},300)},{once:!0}),i.click()})};l.compress=(e,t,n,r=50,o=50,s=0,i=0)=>new Promise(function(m,d){o=o/100,r=r/100;let c=new Image;c.onload=()=>{let a=n.createElement("canvas"),p=a.getContext("2d");if(!p)return d("No canvas context available");let g=c.naturalWidth,x=c.naturalHeight;if(!CSS.supports("image-orientation","from-image")&&(t===f.Right||t===f.Left)){let ce=g;g=x,x=ce}let F=s?s/g:1,P=i?i/x:1;r=Math.min(r,F,P),a.width=g*r,a.height=x*r;let U=Math.PI/180;CSS.supports("image-orientation","from-image")||t===f.Up?p.drawImage(c,0,0,a.width,a.height):t===f.Right?(p.save(),p.rotate(90*U),p.translate(0,-a.width),p.drawImage(c,0,0,a.height,a.width),p.restore()):t===f.Left?(p.save(),p.rotate(-90*U),p.translate(-a.width,0),p.drawImage(c,0,0,a.height,a.width),p.restore()):t===f.Down?(p.save(),p.rotate(180*U),p.translate(-a.width,-a.height),p.drawImage(c,0,0,a.width,a.height),p.restore()):p.drawImage(c,0,0,a.width,a.height);let pe=e.substr(5,e.split(";")[0].length-5),de=a.toDataURL(pe,o);m(de)},c.onerror=a=>d(a),c.src=e});l.byteCount=e=>encodeURI(e).split(/%..|./).length-1;l.getImageMaxSize=(e,t,n,r=!1)=>L(void 0,null,function*(){let s=d=>(d/1024/1024).toFixed(2);t&&console.debug("NgxImageCompress - Opening upload window");let i=yield l.uploadFile(n,!1,r),m;for(let d=0;d<10;d++){let c=l.byteCount(i.image);m=yield l.compress(i.image,i.orientation,n,50,100);let a=l.byteCount(m);if(console.debug("NgxImageCompress -","Compression from",s(c),"MB to",s(a),"MB"),a>=c)throw d===0?(t&&console.debug("NgxImageCompress -","File can't be reduced at all - returning the original",s(c),"MB large"),y(C({},i),{image:m})):(t&&console.debug("NgxImageCompress -","File can't be reduced more - returning the best we can, which is ",s(c),"MB large"),y(C({},i),{image:m}));if(a<e*1024*1024)return t&&console.debug("NgxImageCompress -","Here your file",s(a),"MB large"),y(C({},i),{image:m});if(d===9)throw t&&console.debug("NgxImageCompress -","File can't reach the desired size after",10,"tries. Returning file ",s(c),"MB large"),y(C({},i),{image:m});t&&console.debug("NgxImageCompress -","Reached",s(a),"MB large. Trying another time after",d+1,"times"),i.image=m}throw t&&console.debug("NgxImageCompress - Unexpected error"),{}});var _=(()=>{class e{constructor(n){this.DOC_ORIENTATION=f,this.render=n.createRenderer(null,null)}byteCount(n){return l.byteCount(n)}getOrientation(n){return l.getOrientation(n)}uploadFile(){return l.uploadFile(this.render,!1)}uploadMultipleFiles(){return l.uploadFile(this.render,!0)}uploadFileOrReject(){return l.uploadFile(this.render,!1,!0)}uploadMultipleFilesOrReject(){return l.uploadFile(this.render,!0,!0)}compressFile(n,r,o=50,s=50,i=0,m=0){return l.compress(n,r,this.render,o,s,i,m)}uploadAndGetImageWithMaxSize(n=1,r=!1,o=!1){return l.getImageMaxSize(n,r,this.render,o).then(s=>s.image).catch(s=>{throw s.image})}uploadAndGetImageWithMaxSizeAndMetas(n=1,r=!1,o=!1){return l.getImageMaxSize(n,r,this.render,o)}}return e.\u0275fac=function(n){return new(n||e)(z(R))},e.\u0275prov=V({token:e,factory:e.\u0275fac,providedIn:"root"}),e})();var ue=e=>({"border-top-1 surface-border":e});function he(e,t){e&1&&v(0,"img",12)}function xe(e,t){if(e&1&&(u(0,"div",15)(1,"div",16)(2,"div",17)(3,"div",18)(4,"div")(5,"div",19),D(6),h()()(),u(7,"div",20)(8,"div",21),v(9,"p-button",22)(10,"p-button",23),h()()()()()),e&2){let n=t.$implicit,r=t.first;w(),S("ngClass",J(2,ue,!r)),w(5),N(n.name)}}function we(e,t){if(e&1&&(u(0,"div",13),I(1,xe,11,4,"div",14),h()),e&2){let n=t.$implicit;w(),S("ngForOf",n)}}var le=(()=>{let t=class t{constructor(r,o){this.categoriesServices=r,this.imageCompress=o,this.imgResultBeforeCompression="",this.imgResultAfterCompression=""}ngOnInit(){this.getCategories()}getCategories(){this.categoriesServices.getItems().subscribe({next:r=>{this.categories=r},error:r=>console.error(r)})}compressFile(){this.imageCompress.uploadFile().then(({image:r,orientation:o})=>{this.imgResultBeforeCompression=r,console.log("Size in bytes of the uploaded image was:",this.imageCompress.byteCount(r)),this.imageCompress.compressFile(r,o,50,50).then(s=>{this.imgResultAfterCompression=s,console.log("Size in bytes after compression is now:",this.imageCompress.byteCount(s))})})}};t.\u0275fac=function(o){return new(o||t)(j(X),j(_))},t.\u0275cmp=B({type:t,selectors:[["app-categories"]],decls:13,vars:1,consts:[["dv",""],["header","Categorias",1,""],["pTemplate","header"],["header","Agregar categoria"],[1,"flex","flex-column","sm:flex-row"],[1,"flex","flex-column","md:align-items-start","p-2"],["type","text","pInputText","",2,"width","100%"],[1,"flex","flex-column","md:align-items-end"],[1,"flex","flex-row-reverse","md:flex-row","gap-2"],["icon","pi pi-plus","label","Agregar",1,"md:align-items-end","white-space-nowrap"],["emptyMessage","Sin categorias registradas",3,"value"],["pTemplate","list"],["alt","Card","src","../../../../assets/layout/images/restaurante.webp",2,"max-height","15vh","object-fit","cover"],[1,"grid","grid-nogutter"],["class","col-12",4,"ngFor","ngForOf"],[1,"col-12"],[1,"flex","flex-column","sm:flex-row","sm:align-items-center","p-4","gap-3",3,"ngClass"],[1,"flex","flex-column","md:flex-row","justify-content-between","md:align-items-center","flex-1","gap-4"],[1,"flex","flex-row","md:flex-column","justify-content-between","align-items-start","gap-2"],[1,"text-lg","font-medium","text-900","mt-2"],[1,"flex","flex-column","md:align-items-end","gap-5"],[1,"flex","md:flex-row","gap-2"],["icon","pi pi-pencil",1,"flex-auto","md:flex-initial","white-space-nowrap"],["severity","danger","icon","pi pi-trash",1,"flex-auto","md:flex-initial","white-space-nowrap"]],template:function(o,s){o&1&&(u(0,"p-card",1),I(1,he,1,0,"ng-template",2),u(2,"div")(3,"p-panel",3)(4,"div",4)(5,"div",5),v(6,"input",6),h(),u(7,"div",7)(8,"div",8),v(9,"p-button",9),h()()()(),u(10,"p-dataView",10,0),I(12,we,2,1,"ng-template",11),h()()()),o&2&&(w(10),S("value",s.categories))},dependencies:[q,Q,G,H,Z,te,oe,O],styles:[".button-table[_ngcontent-%COMP%]{appearance:none;background-color:#fcfcfd;border-radius:4px;border-width:0;box-shadow:#2d234266 0 2px 4px,#2d23424d 0 7px 13px -3px,#d6d6e7 0 -3px inset;box-sizing:border-box;color:#36395a;cursor:pointer;font-family:JetBrains Mono,monospace;height:35vh;width:30vw;list-style:none;overflow:hidden;padding-left:16px;padding-right:16px;position:relative;text-decoration:none;transition:box-shadow .15s,transform .15s;user-select:none;-webkit-user-select:none;touch-action:manipulation;white-space:nowrap;will-change:box-shadow,transform;font-size:18px}.button-table[_ngcontent-%COMP%]:focus{box-shadow:#d6d6e7 0 0 0 1.5px inset,#2d234266 0 2px 4px,#2d23424d 0 7px 13px -3px,#d6d6e7 0 -3px inset}.button-table[_ngcontent-%COMP%]:hover{box-shadow:#2d234266 0 4px 8px,#2d23424d 0 7px 13px -3px,#d6d6e7 0 -3px inset;transform:translateY(-2px)}.button-table[_ngcontent-%COMP%]:active{box-shadow:#d6d6e7 0 3px 7px inset;transform:translateY(2px)}"]});let e=t;return e})();var me=(()=>{let t=class t{};t.\u0275fac=function(o){return new(o||t)},t.\u0275mod=M({type:t}),t.\u0275inj=b({imports:[k.forChild([{path:"",component:le}]),k]});let e=t;return e})();var ot=(()=>{let t=class t{};t.\u0275fac=function(o){return new(o||t)},t.\u0275mod=M({type:t}),t.\u0275inj=b({providers:[_],imports:[W,me,Y,K,A,$,T,ie,ne,ae,se,re,ee]});let e=t;return e})();export{ot as CategoriesModule};
