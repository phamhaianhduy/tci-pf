import{r as o,o as W,h as p,j as e}from"./index-Cwsbtslf.js";import{d as k}from"./dayjs.min-Cg-n98_e.js";import{c as K,d as N,a as O,F as q,b as Z,C as D}from"./CustomCFormInput-R6ZhCQt0.js";import{P as z}from"./Pagination-ggx9u1sv.js";import{C as U,a as x}from"./CRow-YNLixlNm.js";import{b as G,a as C}from"./CContainer-Y1mteLO7.js";import{C as J,a as Q}from"./CCardBody-Bc4MtlRY.js";import{C as X}from"./CCardHeader-qQtIod6a.js";import{C as Y,d as $,c as m,a as V,b as L,e as w}from"./CTable-BN3hIRiw.js";import"./isSymbol-C4hJnqVa.js";import"./CFormInput--xOEIcm_.js";/**
 * @license lucide-react v0.510.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ee=s=>s.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),te=s=>s.replace(/^([A-Z])|[\s-_]+(\w)/g,(r,n,a)=>a?a.toUpperCase():n.toLowerCase()),R=s=>{const r=te(s);return r.charAt(0).toUpperCase()+r.slice(1)},E=(...s)=>s.filter((r,n,a)=>!!r&&r.trim()!==""&&a.indexOf(r)===n).join(" ").trim(),re=s=>{for(const r in s)if(r.startsWith("aria-")||r==="role"||r==="title")return!0};/**
 * @license lucide-react v0.510.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var se={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.510.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ae=o.forwardRef(({color:s="currentColor",size:r=24,strokeWidth:n=2,absoluteStrokeWidth:a,className:d="",children:c,iconNode:h,...l},j)=>o.createElement("svg",{ref:j,...se,width:r,height:r,stroke:s,strokeWidth:a?Number(n)*24/Number(r):n,className:E("lucide",d),...!c&&!re(l)&&{"aria-hidden":"true"},...l},[...h.map(([i,u])=>o.createElement(i,u)),...Array.isArray(c)?c:[c]]));/**
 * @license lucide-react v0.510.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v=(s,r)=>{const n=o.forwardRef(({className:a,...d},c)=>o.createElement(ae,{ref:c,iconNode:r,className:E(`lucide-${ee(R(s))}`,`lucide-${s}`,a),...d}));return n.displayName=R(s),n};/**
 * @license lucide-react v0.510.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const oe=[["path",{d:"M2 21a8 8 0 0 1 13.292-6",key:"bjp14o"}],["circle",{cx:"10",cy:"8",r:"5",key:"o932ke"}],["path",{d:"M22 19h-6",key:"vcuq98"}]],ne=v("user-round-minus",oe);/**
 * @license lucide-react v0.510.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ce=[["path",{d:"M2 21a8 8 0 0 1 13.292-6",key:"bjp14o"}],["circle",{cx:"10",cy:"8",r:"5",key:"o932ke"}],["path",{d:"M19 16v6",key:"tddt3s"}],["path",{d:"M22 19h-6",key:"vcuq98"}]],le=v("user-round-plus",ce);/**
 * @license lucide-react v0.510.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ie=[["path",{d:"M2 21a8 8 0 0 1 10.821-7.487",key:"1c8h7z"}],["path",{d:"M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z",key:"1817ys"}],["circle",{cx:"10",cy:"8",r:"5",key:"o932ke"}]],de=v("user-round-pen",ie),me=()=>{const s=K().shape({searchString:O(),fromDate:N().typeError("Invalid date"),toDate:N().typeError("Invalid date")}),[r,n]=o.useState(1),[a,d]=o.useState(""),[c,h]=o.useState(a),[l,j]=o.useState("updatedAt"),[i,u]=o.useState("desc"),[f,A]=o.useState(""),[y,M]=o.useState("");o.useEffect(()=>{p.getUsers(l,i,c,r,f,y)},[l,i,c,r,f,y]);const T=t=>{A(t.fromDate?k(t.fromDate).format("YYYY-MM-DD 00:00:00"):null),M(t.toDate?k(t.toDate).format("YYYY-MM-DD 23:59:59"):null),h(a),n(1)},I=t=>{t("fromDate",""),t("toDate",""),t("searchString",""),A(""),M(""),d(""),h(""),j("updatedAt"),u("desc")},g=t=>{t===l?u(i==="asc"?"desc":"asc"):(j(t),u("asc"))},_=t=>{const b=t.target.value.toLowerCase();d(b)},F=t=>n(t),B=p.totalPages,S=t=>l!==t?"⇅":i==="asc"?"↑":"↓",H=async t=>{window.confirm("Are you sure delete this use?")&&(await p.deleteUser(t),await p.getUsers(l,i,c,r,f,y))},P=p.users;return e.jsxs(U,{children:[e.jsxs(x,{xs:12,children:[e.jsx(q,{initialValues:{searchString:"",fromDate:"",toDate:""},validationSchema:s,onSubmit:T,children:({setFieldValue:t,resetForm:b})=>e.jsx(Z,{style:{display:"flex",gap:"10px"},children:e.jsx(G,{children:e.jsxs(U,{children:[e.jsx(x,{md:4,children:e.jsx(D,{name:"searchString",placeholder:"Input search string",autoComplete:"searchString",type:"text",onChange:_,value:a,className:"mb-4"})}),e.jsx(x,{md:4,children:e.jsx(D,{name:"fromDate",type:"date",className:"mb-4"})}),e.jsx(x,{md:4,children:e.jsx(D,{name:"toDate",type:"date",className:"mb-4"})}),e.jsxs(x,{md:12,children:[e.jsx(C,{type:"submit",onClick:()=>h(a),color:"primary",children:"Search"})," ",e.jsx(C,{type:"button",onClick:()=>I(t),color:"primary",children:"Reset"})]})]})})})}),e.jsxs(J,{className:"mb-4 mt-4",children:[e.jsxs(X,{children:[e.jsx("strong",{children:"User List"}),e.jsx(C,{className:"float-end",type:"button",href:"/users/create",color:"success",variant:"outline",children:e.jsx(le,{strokeWidth:1.5})})]}),e.jsx(Q,{children:e.jsx(Y,{striped:!0,children:e.jsx($,{children:e.jsx(m,{colSpan:4,children:e.jsxs(Y,{children:[e.jsx(V,{color:"dark",children:e.jsxs(L,{children:[e.jsxs(m,{scope:"col",onClick:()=>g("fullName"),role:"button",children:["Fullname ",S("fullName")]}),e.jsxs(m,{scope:"col",onClick:()=>g("email"),role:"button",children:["Email ",S("email")]}),e.jsxs(m,{scope:"col",onClick:()=>g("updatedAt"),role:"button",children:["Updated At ",S("updatedAt")]}),e.jsx(m,{scope:"col",children:"Action"})]})}),e.jsx($,{children:P.length>0&&P.map(t=>e.jsx(e.Fragment,{children:e.jsxs(L,{children:[e.jsx(m,{scope:"row",children:t.fullName}),e.jsx(w,{children:t.email}),e.jsx(w,{children:k(t.updatedAt).format("YYYY/MM/DD HH:mm:ss")}),e.jsxs(w,{children:[e.jsx(C,{href:`/users/${t.userCode}/edit`,color:"primary",variant:"outline",children:e.jsx(de,{strokeWidth:1.5})})," ",e.jsx(C,{onClick:()=>H(t.id),value:t.id,color:"danger",variant:"outline",children:e.jsx(ne,{strokeWidth:1.5})})]})]})}))})]})})})})})]})]}),e.jsx(z,{currentPage:r,totalPages:B,maxPagesToShow:5,onPageChange:F})]})},ke=W(me);export{ke as default};
