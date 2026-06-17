(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))r(l);new MutationObserver(l=>{for(const u of l)if(u.type==="childList")for(const h of u.addedNodes)h.tagName==="LINK"&&h.rel==="modulepreload"&&r(h)}).observe(document,{childList:!0,subtree:!0});function i(l){const u={};return l.integrity&&(u.integrity=l.integrity),l.referrerPolicy&&(u.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?u.credentials="include":l.crossOrigin==="anonymous"?u.credentials="omit":u.credentials="same-origin",u}function r(l){if(l.ep)return;l.ep=!0;const u=i(l);fetch(l.href,u)}})();var Af={exports:{}},go={};var ng;function xS(){if(ng)return go;ng=1;var o=Symbol.for("react.transitional.element"),e=Symbol.for("react.fragment");function i(r,l,u){var h=null;if(u!==void 0&&(h=""+u),l.key!==void 0&&(h=""+l.key),"key"in l){u={};for(var d in l)d!=="key"&&(u[d]=l[d])}else u=l;return l=u.ref,{$$typeof:o,type:r,key:h,ref:l!==void 0?l:null,props:u}}return go.Fragment=e,go.jsx=i,go.jsxs=i,go}var ig;function MS(){return ig||(ig=1,Af.exports=xS()),Af.exports}var Ft=MS(),Rf={exports:{}},_o={},wf={exports:{}},Cf={};var ag;function yS(){return ag||(ag=1,(function(o){function e(O,q){var j=O.length;O.push(q);t:for(;0<j;){var ct=j-1>>>1,R=O[ct];if(0<l(R,q))O[ct]=q,O[j]=R,j=ct;else break t}}function i(O){return O.length===0?null:O[0]}function r(O){if(O.length===0)return null;var q=O[0],j=O.pop();if(j!==q){O[0]=j;t:for(var ct=0,R=O.length,k=R>>>1;ct<k;){var Q=2*(ct+1)-1,B=O[Q],J=Q+1,_t=O[J];if(0>l(B,j))J<R&&0>l(_t,B)?(O[ct]=_t,O[J]=j,ct=J):(O[ct]=B,O[Q]=j,ct=Q);else if(J<R&&0>l(_t,j))O[ct]=_t,O[J]=j,ct=J;else break t}}return q}function l(O,q){var j=O.sortIndex-q.sortIndex;return j!==0?j:O.id-q.id}if(o.unstable_now=void 0,typeof performance=="object"&&typeof performance.now=="function"){var u=performance;o.unstable_now=function(){return u.now()}}else{var h=Date,d=h.now();o.unstable_now=function(){return h.now()-d}}var m=[],p=[],g=1,v=null,S=3,y=!1,b=!1,A=!1,x=!1,_=typeof setTimeout=="function"?setTimeout:null,N=typeof clearTimeout=="function"?clearTimeout:null,D=typeof setImmediate<"u"?setImmediate:null;function P(O){for(var q=i(p);q!==null;){if(q.callback===null)r(p);else if(q.startTime<=O)r(p),q.sortIndex=q.expirationTime,e(m,q);else break;q=i(p)}}function G(O){if(A=!1,P(O),!b)if(i(m)!==null)b=!0,F||(F=!0,lt());else{var q=i(p);q!==null&&$(G,q.startTime-O)}}var F=!1,I=-1,mt=5,C=-1;function U(){return x?!0:!(o.unstable_now()-C<mt)}function ut(){if(x=!1,F){var O=o.unstable_now();C=O;var q=!0;try{t:{b=!1,A&&(A=!1,N(I),I=-1),y=!0;var j=S;try{e:{for(P(O),v=i(m);v!==null&&!(v.expirationTime>O&&U());){var ct=v.callback;if(typeof ct=="function"){v.callback=null,S=v.priorityLevel;var R=ct(v.expirationTime<=O);if(O=o.unstable_now(),typeof R=="function"){v.callback=R,P(O),q=!0;break e}v===i(m)&&r(m),P(O)}else r(m);v=i(m)}if(v!==null)q=!0;else{var k=i(p);k!==null&&$(G,k.startTime-O),q=!1}}break t}finally{v=null,S=j,y=!1}q=void 0}}finally{q?lt():F=!1}}}var lt;if(typeof D=="function")lt=function(){D(ut)};else if(typeof MessageChannel<"u"){var yt=new MessageChannel,X=yt.port2;yt.port1.onmessage=ut,lt=function(){X.postMessage(null)}}else lt=function(){_(ut,0)};function $(O,q){I=_(function(){O(o.unstable_now())},q)}o.unstable_IdlePriority=5,o.unstable_ImmediatePriority=1,o.unstable_LowPriority=4,o.unstable_NormalPriority=3,o.unstable_Profiling=null,o.unstable_UserBlockingPriority=2,o.unstable_cancelCallback=function(O){O.callback=null},o.unstable_forceFrameRate=function(O){0>O||125<O?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):mt=0<O?Math.floor(1e3/O):5},o.unstable_getCurrentPriorityLevel=function(){return S},o.unstable_next=function(O){switch(S){case 1:case 2:case 3:var q=3;break;default:q=S}var j=S;S=q;try{return O()}finally{S=j}},o.unstable_requestPaint=function(){x=!0},o.unstable_runWithPriority=function(O,q){switch(O){case 1:case 2:case 3:case 4:case 5:break;default:O=3}var j=S;S=O;try{return q()}finally{S=j}},o.unstable_scheduleCallback=function(O,q,j){var ct=o.unstable_now();switch(typeof j=="object"&&j!==null?(j=j.delay,j=typeof j=="number"&&0<j?ct+j:ct):j=ct,O){case 1:var R=-1;break;case 2:R=250;break;case 5:R=1073741823;break;case 4:R=1e4;break;default:R=5e3}return R=j+R,O={id:g++,callback:q,priorityLevel:O,startTime:j,expirationTime:R,sortIndex:-1},j>ct?(O.sortIndex=j,e(p,O),i(m)===null&&O===i(p)&&(A?(N(I),I=-1):A=!0,$(G,j-ct))):(O.sortIndex=R,e(m,O),b||y||(b=!0,F||(F=!0,lt()))),O},o.unstable_shouldYield=U,o.unstable_wrapCallback=function(O){var q=S;return function(){var j=S;S=q;try{return O.apply(this,arguments)}finally{S=j}}}})(Cf)),Cf}var rg;function ES(){return rg||(rg=1,wf.exports=yS()),wf.exports}var Df={exports:{}},ge={};var sg;function TS(){if(sg)return ge;sg=1;var o=Symbol.for("react.transitional.element"),e=Symbol.for("react.portal"),i=Symbol.for("react.fragment"),r=Symbol.for("react.strict_mode"),l=Symbol.for("react.profiler"),u=Symbol.for("react.consumer"),h=Symbol.for("react.context"),d=Symbol.for("react.forward_ref"),m=Symbol.for("react.suspense"),p=Symbol.for("react.memo"),g=Symbol.for("react.lazy"),v=Symbol.iterator;function S(R){return R===null||typeof R!="object"?null:(R=v&&R[v]||R["@@iterator"],typeof R=="function"?R:null)}var y={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},b=Object.assign,A={};function x(R,k,Q){this.props=R,this.context=k,this.refs=A,this.updater=Q||y}x.prototype.isReactComponent={},x.prototype.setState=function(R,k){if(typeof R!="object"&&typeof R!="function"&&R!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,R,k,"setState")},x.prototype.forceUpdate=function(R){this.updater.enqueueForceUpdate(this,R,"forceUpdate")};function _(){}_.prototype=x.prototype;function N(R,k,Q){this.props=R,this.context=k,this.refs=A,this.updater=Q||y}var D=N.prototype=new _;D.constructor=N,b(D,x.prototype),D.isPureReactComponent=!0;var P=Array.isArray,G={H:null,A:null,T:null,S:null,V:null},F=Object.prototype.hasOwnProperty;function I(R,k,Q,B,J,_t){return Q=_t.ref,{$$typeof:o,type:R,key:k,ref:Q!==void 0?Q:null,props:_t}}function mt(R,k){return I(R.type,k,void 0,void 0,void 0,R.props)}function C(R){return typeof R=="object"&&R!==null&&R.$$typeof===o}function U(R){var k={"=":"=0",":":"=2"};return"$"+R.replace(/[=:]/g,function(Q){return k[Q]})}var ut=/\/+/g;function lt(R,k){return typeof R=="object"&&R!==null&&R.key!=null?U(""+R.key):k.toString(36)}function yt(){}function X(R){switch(R.status){case"fulfilled":return R.value;case"rejected":throw R.reason;default:switch(typeof R.status=="string"?R.then(yt,yt):(R.status="pending",R.then(function(k){R.status==="pending"&&(R.status="fulfilled",R.value=k)},function(k){R.status==="pending"&&(R.status="rejected",R.reason=k)})),R.status){case"fulfilled":return R.value;case"rejected":throw R.reason}}throw R}function $(R,k,Q,B,J){var _t=typeof R;(_t==="undefined"||_t==="boolean")&&(R=null);var pt=!1;if(R===null)pt=!0;else switch(_t){case"bigint":case"string":case"number":pt=!0;break;case"object":switch(R.$$typeof){case o:case e:pt=!0;break;case g:return pt=R._init,$(pt(R._payload),k,Q,B,J)}}if(pt)return J=J(R),pt=B===""?"."+lt(R,0):B,P(J)?(Q="",pt!=null&&(Q=pt.replace(ut,"$&/")+"/"),$(J,k,Q,"",function(jt){return jt})):J!=null&&(C(J)&&(J=mt(J,Q+(J.key==null||R&&R.key===J.key?"":(""+J.key).replace(ut,"$&/")+"/")+pt)),k.push(J)),1;pt=0;var Lt=B===""?".":B+":";if(P(R))for(var Pt=0;Pt<R.length;Pt++)B=R[Pt],_t=Lt+lt(B,Pt),pt+=$(B,k,Q,_t,J);else if(Pt=S(R),typeof Pt=="function")for(R=Pt.call(R),Pt=0;!(B=R.next()).done;)B=B.value,_t=Lt+lt(B,Pt++),pt+=$(B,k,Q,_t,J);else if(_t==="object"){if(typeof R.then=="function")return $(X(R),k,Q,B,J);throw k=String(R),Error("Objects are not valid as a React child (found: "+(k==="[object Object]"?"object with keys {"+Object.keys(R).join(", ")+"}":k)+"). If you meant to render a collection of children, use an array instead.")}return pt}function O(R,k,Q){if(R==null)return R;var B=[],J=0;return $(R,B,"","",function(_t){return k.call(Q,_t,J++)}),B}function q(R){if(R._status===-1){var k=R._result;k=k(),k.then(function(Q){(R._status===0||R._status===-1)&&(R._status=1,R._result=Q)},function(Q){(R._status===0||R._status===-1)&&(R._status=2,R._result=Q)}),R._status===-1&&(R._status=0,R._result=k)}if(R._status===1)return R._result.default;throw R._result}var j=typeof reportError=="function"?reportError:function(R){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var k=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof R=="object"&&R!==null&&typeof R.message=="string"?String(R.message):String(R),error:R});if(!window.dispatchEvent(k))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",R);return}console.error(R)};function ct(){}return ge.Children={map:O,forEach:function(R,k,Q){O(R,function(){k.apply(this,arguments)},Q)},count:function(R){var k=0;return O(R,function(){k++}),k},toArray:function(R){return O(R,function(k){return k})||[]},only:function(R){if(!C(R))throw Error("React.Children.only expected to receive a single React element child.");return R}},ge.Component=x,ge.Fragment=i,ge.Profiler=l,ge.PureComponent=N,ge.StrictMode=r,ge.Suspense=m,ge.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=G,ge.__COMPILER_RUNTIME={__proto__:null,c:function(R){return G.H.useMemoCache(R)}},ge.cache=function(R){return function(){return R.apply(null,arguments)}},ge.cloneElement=function(R,k,Q){if(R==null)throw Error("The argument must be a React element, but you passed "+R+".");var B=b({},R.props),J=R.key,_t=void 0;if(k!=null)for(pt in k.ref!==void 0&&(_t=void 0),k.key!==void 0&&(J=""+k.key),k)!F.call(k,pt)||pt==="key"||pt==="__self"||pt==="__source"||pt==="ref"&&k.ref===void 0||(B[pt]=k[pt]);var pt=arguments.length-2;if(pt===1)B.children=Q;else if(1<pt){for(var Lt=Array(pt),Pt=0;Pt<pt;Pt++)Lt[Pt]=arguments[Pt+2];B.children=Lt}return I(R.type,J,void 0,void 0,_t,B)},ge.createContext=function(R){return R={$$typeof:h,_currentValue:R,_currentValue2:R,_threadCount:0,Provider:null,Consumer:null},R.Provider=R,R.Consumer={$$typeof:u,_context:R},R},ge.createElement=function(R,k,Q){var B,J={},_t=null;if(k!=null)for(B in k.key!==void 0&&(_t=""+k.key),k)F.call(k,B)&&B!=="key"&&B!=="__self"&&B!=="__source"&&(J[B]=k[B]);var pt=arguments.length-2;if(pt===1)J.children=Q;else if(1<pt){for(var Lt=Array(pt),Pt=0;Pt<pt;Pt++)Lt[Pt]=arguments[Pt+2];J.children=Lt}if(R&&R.defaultProps)for(B in pt=R.defaultProps,pt)J[B]===void 0&&(J[B]=pt[B]);return I(R,_t,void 0,void 0,null,J)},ge.createRef=function(){return{current:null}},ge.forwardRef=function(R){return{$$typeof:d,render:R}},ge.isValidElement=C,ge.lazy=function(R){return{$$typeof:g,_payload:{_status:-1,_result:R},_init:q}},ge.memo=function(R,k){return{$$typeof:p,type:R,compare:k===void 0?null:k}},ge.startTransition=function(R){var k=G.T,Q={};G.T=Q;try{var B=R(),J=G.S;J!==null&&J(Q,B),typeof B=="object"&&B!==null&&typeof B.then=="function"&&B.then(ct,j)}catch(_t){j(_t)}finally{G.T=k}},ge.unstable_useCacheRefresh=function(){return G.H.useCacheRefresh()},ge.use=function(R){return G.H.use(R)},ge.useActionState=function(R,k,Q){return G.H.useActionState(R,k,Q)},ge.useCallback=function(R,k){return G.H.useCallback(R,k)},ge.useContext=function(R){return G.H.useContext(R)},ge.useDebugValue=function(){},ge.useDeferredValue=function(R,k){return G.H.useDeferredValue(R,k)},ge.useEffect=function(R,k,Q){var B=G.H;if(typeof Q=="function")throw Error("useEffect CRUD overload is not enabled in this build of React.");return B.useEffect(R,k)},ge.useId=function(){return G.H.useId()},ge.useImperativeHandle=function(R,k,Q){return G.H.useImperativeHandle(R,k,Q)},ge.useInsertionEffect=function(R,k){return G.H.useInsertionEffect(R,k)},ge.useLayoutEffect=function(R,k){return G.H.useLayoutEffect(R,k)},ge.useMemo=function(R,k){return G.H.useMemo(R,k)},ge.useOptimistic=function(R,k){return G.H.useOptimistic(R,k)},ge.useReducer=function(R,k,Q){return G.H.useReducer(R,k,Q)},ge.useRef=function(R){return G.H.useRef(R)},ge.useState=function(R){return G.H.useState(R)},ge.useSyncExternalStore=function(R,k,Q){return G.H.useSyncExternalStore(R,k,Q)},ge.useTransition=function(){return G.H.useTransition()},ge.version="19.1.0",ge}var og;function yd(){return og||(og=1,Df.exports=TS()),Df.exports}var Lf={exports:{}},Dn={};var lg;function bS(){if(lg)return Dn;lg=1;var o=yd();function e(m){var p="https://react.dev/errors/"+m;if(1<arguments.length){p+="?args[]="+encodeURIComponent(arguments[1]);for(var g=2;g<arguments.length;g++)p+="&args[]="+encodeURIComponent(arguments[g])}return"Minified React error #"+m+"; visit "+p+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function i(){}var r={d:{f:i,r:function(){throw Error(e(522))},D:i,C:i,L:i,m:i,X:i,S:i,M:i},p:0,findDOMNode:null},l=Symbol.for("react.portal");function u(m,p,g){var v=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:l,key:v==null?null:""+v,children:m,containerInfo:p,implementation:g}}var h=o.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function d(m,p){if(m==="font")return"";if(typeof p=="string")return p==="use-credentials"?p:""}return Dn.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=r,Dn.createPortal=function(m,p){var g=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!p||p.nodeType!==1&&p.nodeType!==9&&p.nodeType!==11)throw Error(e(299));return u(m,p,null,g)},Dn.flushSync=function(m){var p=h.T,g=r.p;try{if(h.T=null,r.p=2,m)return m()}finally{h.T=p,r.p=g,r.d.f()}},Dn.preconnect=function(m,p){typeof m=="string"&&(p?(p=p.crossOrigin,p=typeof p=="string"?p==="use-credentials"?p:"":void 0):p=null,r.d.C(m,p))},Dn.prefetchDNS=function(m){typeof m=="string"&&r.d.D(m)},Dn.preinit=function(m,p){if(typeof m=="string"&&p&&typeof p.as=="string"){var g=p.as,v=d(g,p.crossOrigin),S=typeof p.integrity=="string"?p.integrity:void 0,y=typeof p.fetchPriority=="string"?p.fetchPriority:void 0;g==="style"?r.d.S(m,typeof p.precedence=="string"?p.precedence:void 0,{crossOrigin:v,integrity:S,fetchPriority:y}):g==="script"&&r.d.X(m,{crossOrigin:v,integrity:S,fetchPriority:y,nonce:typeof p.nonce=="string"?p.nonce:void 0})}},Dn.preinitModule=function(m,p){if(typeof m=="string")if(typeof p=="object"&&p!==null){if(p.as==null||p.as==="script"){var g=d(p.as,p.crossOrigin);r.d.M(m,{crossOrigin:g,integrity:typeof p.integrity=="string"?p.integrity:void 0,nonce:typeof p.nonce=="string"?p.nonce:void 0})}}else p==null&&r.d.M(m)},Dn.preload=function(m,p){if(typeof m=="string"&&typeof p=="object"&&p!==null&&typeof p.as=="string"){var g=p.as,v=d(g,p.crossOrigin);r.d.L(m,g,{crossOrigin:v,integrity:typeof p.integrity=="string"?p.integrity:void 0,nonce:typeof p.nonce=="string"?p.nonce:void 0,type:typeof p.type=="string"?p.type:void 0,fetchPriority:typeof p.fetchPriority=="string"?p.fetchPriority:void 0,referrerPolicy:typeof p.referrerPolicy=="string"?p.referrerPolicy:void 0,imageSrcSet:typeof p.imageSrcSet=="string"?p.imageSrcSet:void 0,imageSizes:typeof p.imageSizes=="string"?p.imageSizes:void 0,media:typeof p.media=="string"?p.media:void 0})}},Dn.preloadModule=function(m,p){if(typeof m=="string")if(p){var g=d(p.as,p.crossOrigin);r.d.m(m,{as:typeof p.as=="string"&&p.as!=="script"?p.as:void 0,crossOrigin:g,integrity:typeof p.integrity=="string"?p.integrity:void 0})}else r.d.m(m)},Dn.requestFormReset=function(m){r.d.r(m)},Dn.unstable_batchedUpdates=function(m,p){return m(p)},Dn.useFormState=function(m,p,g){return h.H.useFormState(m,p,g)},Dn.useFormStatus=function(){return h.H.useHostTransitionStatus()},Dn.version="19.1.0",Dn}var cg;function AS(){if(cg)return Lf.exports;cg=1;function o(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(o)}catch(e){console.error(e)}}return o(),Lf.exports=bS(),Lf.exports}var ug;function RS(){if(ug)return _o;ug=1;var o=ES(),e=yd(),i=AS();function r(t){var n="https://react.dev/errors/"+t;if(1<arguments.length){n+="?args[]="+encodeURIComponent(arguments[1]);for(var a=2;a<arguments.length;a++)n+="&args[]="+encodeURIComponent(arguments[a])}return"Minified React error #"+t+"; visit "+n+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function l(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)}function u(t){var n=t,a=t;if(t.alternate)for(;n.return;)n=n.return;else{t=n;do n=t,(n.flags&4098)!==0&&(a=n.return),t=n.return;while(t)}return n.tag===3?a:null}function h(t){if(t.tag===13){var n=t.memoizedState;if(n===null&&(t=t.alternate,t!==null&&(n=t.memoizedState)),n!==null)return n.dehydrated}return null}function d(t){if(u(t)!==t)throw Error(r(188))}function m(t){var n=t.alternate;if(!n){if(n=u(t),n===null)throw Error(r(188));return n!==t?null:t}for(var a=t,s=n;;){var c=a.return;if(c===null)break;var f=c.alternate;if(f===null){if(s=c.return,s!==null){a=s;continue}break}if(c.child===f.child){for(f=c.child;f;){if(f===a)return d(c),t;if(f===s)return d(c),n;f=f.sibling}throw Error(r(188))}if(a.return!==s.return)a=c,s=f;else{for(var M=!1,E=c.child;E;){if(E===a){M=!0,a=c,s=f;break}if(E===s){M=!0,s=c,a=f;break}E=E.sibling}if(!M){for(E=f.child;E;){if(E===a){M=!0,a=f,s=c;break}if(E===s){M=!0,s=f,a=c;break}E=E.sibling}if(!M)throw Error(r(189))}}if(a.alternate!==s)throw Error(r(190))}if(a.tag!==3)throw Error(r(188));return a.stateNode.current===a?t:n}function p(t){var n=t.tag;if(n===5||n===26||n===27||n===6)return t;for(t=t.child;t!==null;){if(n=p(t),n!==null)return n;t=t.sibling}return null}var g=Object.assign,v=Symbol.for("react.element"),S=Symbol.for("react.transitional.element"),y=Symbol.for("react.portal"),b=Symbol.for("react.fragment"),A=Symbol.for("react.strict_mode"),x=Symbol.for("react.profiler"),_=Symbol.for("react.provider"),N=Symbol.for("react.consumer"),D=Symbol.for("react.context"),P=Symbol.for("react.forward_ref"),G=Symbol.for("react.suspense"),F=Symbol.for("react.suspense_list"),I=Symbol.for("react.memo"),mt=Symbol.for("react.lazy"),C=Symbol.for("react.activity"),U=Symbol.for("react.memo_cache_sentinel"),ut=Symbol.iterator;function lt(t){return t===null||typeof t!="object"?null:(t=ut&&t[ut]||t["@@iterator"],typeof t=="function"?t:null)}var yt=Symbol.for("react.client.reference");function X(t){if(t==null)return null;if(typeof t=="function")return t.$$typeof===yt?null:t.displayName||t.name||null;if(typeof t=="string")return t;switch(t){case b:return"Fragment";case x:return"Profiler";case A:return"StrictMode";case G:return"Suspense";case F:return"SuspenseList";case C:return"Activity"}if(typeof t=="object")switch(t.$$typeof){case y:return"Portal";case D:return(t.displayName||"Context")+".Provider";case N:return(t._context.displayName||"Context")+".Consumer";case P:var n=t.render;return t=t.displayName,t||(t=n.displayName||n.name||"",t=t!==""?"ForwardRef("+t+")":"ForwardRef"),t;case I:return n=t.displayName||null,n!==null?n:X(t.type)||"Memo";case mt:n=t._payload,t=t._init;try{return X(t(n))}catch{}}return null}var $=Array.isArray,O=e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,q=i.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,j={pending:!1,data:null,method:null,action:null},ct=[],R=-1;function k(t){return{current:t}}function Q(t){0>R||(t.current=ct[R],ct[R]=null,R--)}function B(t,n){R++,ct[R]=t.current,t.current=n}var J=k(null),_t=k(null),pt=k(null),Lt=k(null);function Pt(t,n){switch(B(pt,n),B(_t,t),B(J,null),n.nodeType){case 9:case 11:t=(t=n.documentElement)&&(t=t.namespaceURI)?Dm(t):0;break;default:if(t=n.tagName,n=n.namespaceURI)n=Dm(n),t=Lm(n,t);else switch(t){case"svg":t=1;break;case"math":t=2;break;default:t=0}}Q(J),B(J,t)}function jt(){Q(J),Q(_t),Q(pt)}function Kt(t){t.memoizedState!==null&&B(Lt,t);var n=J.current,a=Lm(n,t.type);n!==a&&(B(_t,t),B(J,a))}function oe(t){_t.current===t&&(Q(J),Q(_t)),Lt.current===t&&(Q(Lt),uo._currentValue=j)}var tt=Object.prototype.hasOwnProperty,qe=o.unstable_scheduleCallback,Xt=o.unstable_cancelCallback,ie=o.unstable_shouldYield,It=o.unstable_requestPaint,Se=o.unstable_now,ue=o.unstable_getCurrentPriorityLevel,L=o.unstable_ImmediatePriority,T=o.unstable_UserBlockingPriority,et=o.unstable_NormalPriority,St=o.unstable_LowPriority,vt=o.unstable_IdlePriority,Mt=o.log,Ut=o.unstable_setDisableYieldValue,Tt=null,Dt=null;function Gt(t){if(typeof Mt=="function"&&Ut(t),Dt&&typeof Dt.setStrictMode=="function")try{Dt.setStrictMode(Tt,t)}catch{}}var kt=Math.clz32?Math.clz32:he,xt=Math.log,be=Math.LN2;function he(t){return t>>>=0,t===0?32:31-(xt(t)/be|0)|0}var ee=256,Vt=4194304;function zt(t){var n=t&42;if(n!==0)return n;switch(t&-t){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t&4194048;case 4194304:case 8388608:case 16777216:case 33554432:return t&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return t}}function ae(t,n,a){var s=t.pendingLanes;if(s===0)return 0;var c=0,f=t.suspendedLanes,M=t.pingedLanes;t=t.warmLanes;var E=s&134217727;return E!==0?(s=E&~f,s!==0?c=zt(s):(M&=E,M!==0?c=zt(M):a||(a=E&~t,a!==0&&(c=zt(a))))):(E=s&~f,E!==0?c=zt(E):M!==0?c=zt(M):a||(a=s&~t,a!==0&&(c=zt(a)))),c===0?0:n!==0&&n!==c&&(n&f)===0&&(f=c&-c,a=n&-n,f>=a||f===32&&(a&4194048)!==0)?n:c}function ye(t,n){return(t.pendingLanes&~(t.suspendedLanes&~t.pingedLanes)&n)===0}function Ge(t,n){switch(t){case 1:case 2:case 4:case 8:case 64:return n+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function de(){var t=ee;return ee<<=1,(ee&4194048)===0&&(ee=256),t}function bt(){var t=Vt;return Vt<<=1,(Vt&62914560)===0&&(Vt=4194304),t}function H(t){for(var n=[],a=0;31>a;a++)n.push(t);return n}function At(t,n){t.pendingLanes|=n,n!==268435456&&(t.suspendedLanes=0,t.pingedLanes=0,t.warmLanes=0)}function Ct(t,n,a,s,c,f){var M=t.pendingLanes;t.pendingLanes=a,t.suspendedLanes=0,t.pingedLanes=0,t.warmLanes=0,t.expiredLanes&=a,t.entangledLanes&=a,t.errorRecoveryDisabledLanes&=a,t.shellSuspendCounter=0;var E=t.entanglements,z=t.expirationTimes,K=t.hiddenUpdates;for(a=M&~a;0<a;){var dt=31-kt(a),gt=1<<dt;E[dt]=0,z[dt]=-1;var nt=K[dt];if(nt!==null)for(K[dt]=null,dt=0;dt<nt.length;dt++){var at=nt[dt];at!==null&&(at.lane&=-536870913)}a&=~gt}s!==0&&Jt(t,s,0),f!==0&&c===0&&t.tag!==0&&(t.suspendedLanes|=f&~(M&~n))}function Jt(t,n,a){t.pendingLanes|=n,t.suspendedLanes&=~n;var s=31-kt(n);t.entangledLanes|=n,t.entanglements[s]=t.entanglements[s]|1073741824|a&4194090}function Zt(t,n){var a=t.entangledLanes|=n;for(t=t.entanglements;a;){var s=31-kt(a),c=1<<s;c&n|t[s]&n&&(t[s]|=n),a&=~c}}function Ce(t){switch(t){case 2:t=1;break;case 8:t=4;break;case 32:t=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:t=128;break;case 268435456:t=134217728;break;default:t=0}return t}function ft(t){return t&=-t,2<t?8<t?(t&134217727)!==0?32:268435456:8:2}function Rt(){var t=q.p;return t!==0?t:(t=window.event,t===void 0?32:Km(t.type))}function Ot(t,n){var a=q.p;try{return q.p=t,n()}finally{q.p=a}}var Et=Math.random().toString(36).slice(2),Bt="__reactFiber$"+Et,le="__reactProps$"+Et,Pe="__reactContainer$"+Et,Ke="__reactEvents$"+Et,we="__reactListeners$"+Et,Ae="__reactHandles$"+Et,Bn="__reactResources$"+Et,xn="__reactMarker$"+Et;function Rn(t){delete t[Bt],delete t[le],delete t[Ke],delete t[we],delete t[Ae]}function cn(t){var n=t[Bt];if(n)return n;for(var a=t.parentNode;a;){if(n=a[Pe]||a[Bt]){if(a=n.alternate,n.child!==null||a!==null&&a.child!==null)for(t=Pm(t);t!==null;){if(a=t[Bt])return a;t=Pm(t)}return n}t=a,a=t.parentNode}return null}function qn(t){if(t=t[Bt]||t[Pe]){var n=t.tag;if(n===5||n===6||n===13||n===26||n===27||n===3)return t}return null}function Nn(t){var n=t.tag;if(n===5||n===26||n===27||n===6)return t.stateNode;throw Error(r(33))}function w(t){var n=t[Bn];return n||(n=t[Bn]={hoistableStyles:new Map,hoistableScripts:new Map}),n}function W(t){t[xn]=!0}var rt=new Set,ot={};function it(t,n){Nt(t,n),Nt(t+"Capture",n)}function Nt(t,n){for(ot[t]=n,t=0;t<n.length;t++)rt.add(n[t])}var qt=RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),$t={},re={};function me(t){return tt.call(re,t)?!0:tt.call($t,t)?!1:qt.test(t)?re[t]=!0:($t[t]=!0,!1)}function ce(t,n,a){if(me(n))if(a===null)t.removeAttribute(n);else{switch(typeof a){case"undefined":case"function":case"symbol":t.removeAttribute(n);return;case"boolean":var s=n.toLowerCase().slice(0,5);if(s!=="data-"&&s!=="aria-"){t.removeAttribute(n);return}}t.setAttribute(n,""+a)}}function fe(t,n,a){if(a===null)t.removeAttribute(n);else{switch(typeof a){case"undefined":case"function":case"symbol":case"boolean":t.removeAttribute(n);return}t.setAttribute(n,""+a)}}function Le(t,n,a,s){if(s===null)t.removeAttribute(a);else{switch(typeof s){case"undefined":case"function":case"symbol":case"boolean":t.removeAttribute(a);return}t.setAttributeNS(n,a,""+s)}}var Mn,en;function wn(t){if(Mn===void 0)try{throw Error()}catch(a){var n=a.stack.trim().match(/\n( *(at )?)/);Mn=n&&n[1]||"",en=-1<a.stack.indexOf(`
    at`)?" (<anonymous>)":-1<a.stack.indexOf("@")?"@unknown:0:0":""}return`
`+Mn+t+en}var Ve=!1;function pe(t,n){if(!t||Ve)return"";Ve=!0;var a=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var s={DetermineComponentFrameRoot:function(){try{if(n){var gt=function(){throw Error()};if(Object.defineProperty(gt.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(gt,[])}catch(at){var nt=at}Reflect.construct(t,[],gt)}else{try{gt.call()}catch(at){nt=at}t.call(gt.prototype)}}else{try{throw Error()}catch(at){nt=at}(gt=t())&&typeof gt.catch=="function"&&gt.catch(function(){})}}catch(at){if(at&&nt&&typeof at.stack=="string")return[at.stack,nt.stack]}return[null,null]}};s.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var c=Object.getOwnPropertyDescriptor(s.DetermineComponentFrameRoot,"name");c&&c.configurable&&Object.defineProperty(s.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var f=s.DetermineComponentFrameRoot(),M=f[0],E=f[1];if(M&&E){var z=M.split(`
`),K=E.split(`
`);for(c=s=0;s<z.length&&!z[s].includes("DetermineComponentFrameRoot");)s++;for(;c<K.length&&!K[c].includes("DetermineComponentFrameRoot");)c++;if(s===z.length||c===K.length)for(s=z.length-1,c=K.length-1;1<=s&&0<=c&&z[s]!==K[c];)c--;for(;1<=s&&0<=c;s--,c--)if(z[s]!==K[c]){if(s!==1||c!==1)do if(s--,c--,0>c||z[s]!==K[c]){var dt=`
`+z[s].replace(" at new "," at ");return t.displayName&&dt.includes("<anonymous>")&&(dt=dt.replace("<anonymous>",t.displayName)),dt}while(1<=s&&0<=c);break}}}finally{Ve=!1,Error.prepareStackTrace=a}return(a=t?t.displayName||t.name:"")?wn(a):""}function xs(t){switch(t.tag){case 26:case 27:case 5:return wn(t.type);case 16:return wn("Lazy");case 13:return wn("Suspense");case 19:return wn("SuspenseList");case 0:case 15:return pe(t.type,!1);case 11:return pe(t.type.render,!1);case 1:return pe(t.type,!0);case 31:return wn("Activity");default:return""}}function Ye(t){try{var n="";do n+=xs(t),t=t.return;while(t);return n}catch(a){return`
Error generating stack: `+a.message+`
`+a.stack}}function rn(t){switch(typeof t){case"bigint":case"boolean":case"number":case"string":case"undefined":return t;case"object":return t;default:return""}}function Ms(t){var n=t.type;return(t=t.nodeName)&&t.toLowerCase()==="input"&&(n==="checkbox"||n==="radio")}function Ba(t){var n=Ms(t)?"checked":"value",a=Object.getOwnPropertyDescriptor(t.constructor.prototype,n),s=""+t[n];if(!t.hasOwnProperty(n)&&typeof a<"u"&&typeof a.get=="function"&&typeof a.set=="function"){var c=a.get,f=a.set;return Object.defineProperty(t,n,{configurable:!0,get:function(){return c.call(this)},set:function(M){s=""+M,f.call(this,M)}}),Object.defineProperty(t,n,{enumerable:a.enumerable}),{getValue:function(){return s},setValue:function(M){s=""+M},stopTracking:function(){t._valueTracker=null,delete t[n]}}}}function ea(t){t._valueTracker||(t._valueTracker=Ba(t))}function un(t){if(!t)return!1;var n=t._valueTracker;if(!n)return!0;var a=n.getValue(),s="";return t&&(s=Ms(t)?t.checked?"true":"false":t.value),t=s,t!==a?(n.setValue(t),!0):!1}function ii(t){if(t=t||(typeof document<"u"?document:void 0),typeof t>"u")return null;try{return t.activeElement||t.body}catch{return t.body}}var ys=/[\n"\\]/g;function je(t){return t.replace(ys,function(n){return"\\"+n.charCodeAt(0).toString(16)+" "})}function Ia(t,n,a,s,c,f,M,E){t.name="",M!=null&&typeof M!="function"&&typeof M!="symbol"&&typeof M!="boolean"?t.type=M:t.removeAttribute("type"),n!=null?M==="number"?(n===0&&t.value===""||t.value!=n)&&(t.value=""+rn(n)):t.value!==""+rn(n)&&(t.value=""+rn(n)):M!=="submit"&&M!=="reset"||t.removeAttribute("value"),n!=null?pr(t,M,rn(n)):a!=null?pr(t,M,rn(a)):s!=null&&t.removeAttribute("value"),c==null&&f!=null&&(t.defaultChecked=!!f),c!=null&&(t.checked=c&&typeof c!="function"&&typeof c!="symbol"),E!=null&&typeof E!="function"&&typeof E!="symbol"&&typeof E!="boolean"?t.name=""+rn(E):t.removeAttribute("name")}function No(t,n,a,s,c,f,M,E){if(f!=null&&typeof f!="function"&&typeof f!="symbol"&&typeof f!="boolean"&&(t.type=f),n!=null||a!=null){if(!(f!=="submit"&&f!=="reset"||n!=null))return;a=a!=null?""+rn(a):"",n=n!=null?""+rn(n):a,E||n===t.value||(t.value=n),t.defaultValue=n}s=s??c,s=typeof s!="function"&&typeof s!="symbol"&&!!s,t.checked=E?t.checked:!!s,t.defaultChecked=!!s,M!=null&&typeof M!="function"&&typeof M!="symbol"&&typeof M!="boolean"&&(t.name=M)}function pr(t,n,a){n==="number"&&ii(t.ownerDocument)===t||t.defaultValue===""+a||(t.defaultValue=""+a)}function mr(t,n,a,s){if(t=t.options,n){n={};for(var c=0;c<a.length;c++)n["$"+a[c]]=!0;for(a=0;a<t.length;a++)c=n.hasOwnProperty("$"+t[a].value),t[a].selected!==c&&(t[a].selected=c),c&&s&&(t[a].defaultSelected=!0)}else{for(a=""+rn(a),n=null,c=0;c<t.length;c++){if(t[c].value===a){t[c].selected=!0,s&&(t[c].defaultSelected=!0);return}n!==null||t[c].disabled||(n=t[c])}n!==null&&(n.selected=!0)}}function wd(t,n,a){if(n!=null&&(n=""+rn(n),n!==t.value&&(t.value=n),a==null)){t.defaultValue!==n&&(t.defaultValue=n);return}t.defaultValue=a!=null?""+rn(a):""}function Cd(t,n,a,s){if(n==null){if(s!=null){if(a!=null)throw Error(r(92));if($(s)){if(1<s.length)throw Error(r(93));s=s[0]}a=s}a==null&&(a=""),n=a}a=rn(n),t.defaultValue=a,s=t.textContent,s===a&&s!==""&&s!==null&&(t.value=s)}function gr(t,n){if(n){var a=t.firstChild;if(a&&a===t.lastChild&&a.nodeType===3){a.nodeValue=n;return}}t.textContent=n}var _v=new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));function Dd(t,n,a){var s=n.indexOf("--")===0;a==null||typeof a=="boolean"||a===""?s?t.setProperty(n,""):n==="float"?t.cssFloat="":t[n]="":s?t.setProperty(n,a):typeof a!="number"||a===0||_v.has(n)?n==="float"?t.cssFloat=a:t[n]=(""+a).trim():t[n]=a+"px"}function Ld(t,n,a){if(n!=null&&typeof n!="object")throw Error(r(62));if(t=t.style,a!=null){for(var s in a)!a.hasOwnProperty(s)||n!=null&&n.hasOwnProperty(s)||(s.indexOf("--")===0?t.setProperty(s,""):s==="float"?t.cssFloat="":t[s]="");for(var c in n)s=n[c],n.hasOwnProperty(c)&&a[c]!==s&&Dd(t,c,s)}else for(var f in n)n.hasOwnProperty(f)&&Dd(t,f,n[f])}function Tc(t){if(t.indexOf("-")===-1)return!1;switch(t){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var vv=new Map([["acceptCharset","accept-charset"],["htmlFor","for"],["httpEquiv","http-equiv"],["crossOrigin","crossorigin"],["accentHeight","accent-height"],["alignmentBaseline","alignment-baseline"],["arabicForm","arabic-form"],["baselineShift","baseline-shift"],["capHeight","cap-height"],["clipPath","clip-path"],["clipRule","clip-rule"],["colorInterpolation","color-interpolation"],["colorInterpolationFilters","color-interpolation-filters"],["colorProfile","color-profile"],["colorRendering","color-rendering"],["dominantBaseline","dominant-baseline"],["enableBackground","enable-background"],["fillOpacity","fill-opacity"],["fillRule","fill-rule"],["floodColor","flood-color"],["floodOpacity","flood-opacity"],["fontFamily","font-family"],["fontSize","font-size"],["fontSizeAdjust","font-size-adjust"],["fontStretch","font-stretch"],["fontStyle","font-style"],["fontVariant","font-variant"],["fontWeight","font-weight"],["glyphName","glyph-name"],["glyphOrientationHorizontal","glyph-orientation-horizontal"],["glyphOrientationVertical","glyph-orientation-vertical"],["horizAdvX","horiz-adv-x"],["horizOriginX","horiz-origin-x"],["imageRendering","image-rendering"],["letterSpacing","letter-spacing"],["lightingColor","lighting-color"],["markerEnd","marker-end"],["markerMid","marker-mid"],["markerStart","marker-start"],["overlinePosition","overline-position"],["overlineThickness","overline-thickness"],["paintOrder","paint-order"],["panose-1","panose-1"],["pointerEvents","pointer-events"],["renderingIntent","rendering-intent"],["shapeRendering","shape-rendering"],["stopColor","stop-color"],["stopOpacity","stop-opacity"],["strikethroughPosition","strikethrough-position"],["strikethroughThickness","strikethrough-thickness"],["strokeDasharray","stroke-dasharray"],["strokeDashoffset","stroke-dashoffset"],["strokeLinecap","stroke-linecap"],["strokeLinejoin","stroke-linejoin"],["strokeMiterlimit","stroke-miterlimit"],["strokeOpacity","stroke-opacity"],["strokeWidth","stroke-width"],["textAnchor","text-anchor"],["textDecoration","text-decoration"],["textRendering","text-rendering"],["transformOrigin","transform-origin"],["underlinePosition","underline-position"],["underlineThickness","underline-thickness"],["unicodeBidi","unicode-bidi"],["unicodeRange","unicode-range"],["unitsPerEm","units-per-em"],["vAlphabetic","v-alphabetic"],["vHanging","v-hanging"],["vIdeographic","v-ideographic"],["vMathematical","v-mathematical"],["vectorEffect","vector-effect"],["vertAdvY","vert-adv-y"],["vertOriginX","vert-origin-x"],["vertOriginY","vert-origin-y"],["wordSpacing","word-spacing"],["writingMode","writing-mode"],["xmlnsXlink","xmlns:xlink"],["xHeight","x-height"]]),Sv=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function Oo(t){return Sv.test(""+t)?"javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')":t}var bc=null;function Ac(t){return t=t.target||t.srcElement||window,t.correspondingUseElement&&(t=t.correspondingUseElement),t.nodeType===3?t.parentNode:t}var _r=null,vr=null;function Ud(t){var n=qn(t);if(n&&(t=n.stateNode)){var a=t[le]||null;t:switch(t=n.stateNode,n.type){case"input":if(Ia(t,a.value,a.defaultValue,a.defaultValue,a.checked,a.defaultChecked,a.type,a.name),n=a.name,a.type==="radio"&&n!=null){for(a=t;a.parentNode;)a=a.parentNode;for(a=a.querySelectorAll('input[name="'+je(""+n)+'"][type="radio"]'),n=0;n<a.length;n++){var s=a[n];if(s!==t&&s.form===t.form){var c=s[le]||null;if(!c)throw Error(r(90));Ia(s,c.value,c.defaultValue,c.defaultValue,c.checked,c.defaultChecked,c.type,c.name)}}for(n=0;n<a.length;n++)s=a[n],s.form===t.form&&un(s)}break t;case"textarea":wd(t,a.value,a.defaultValue);break t;case"select":n=a.value,n!=null&&mr(t,!!a.multiple,n,!1)}}}var Rc=!1;function Nd(t,n,a){if(Rc)return t(n,a);Rc=!0;try{var s=t(n);return s}finally{if(Rc=!1,(_r!==null||vr!==null)&&(Sl(),_r&&(n=_r,t=vr,vr=_r=null,Ud(n),t)))for(n=0;n<t.length;n++)Ud(t[n])}}function Es(t,n){var a=t.stateNode;if(a===null)return null;var s=a[le]||null;if(s===null)return null;a=s[n];t:switch(n){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(s=!s.disabled)||(t=t.type,s=!(t==="button"||t==="input"||t==="select"||t==="textarea")),t=!s;break t;default:t=!1}if(t)return null;if(a&&typeof a!="function")throw Error(r(231,n,typeof a));return a}var Li=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),wc=!1;if(Li)try{var Ts={};Object.defineProperty(Ts,"passive",{get:function(){wc=!0}}),window.addEventListener("test",Ts,Ts),window.removeEventListener("test",Ts,Ts)}catch{wc=!1}var na=null,Cc=null,Po=null;function Od(){if(Po)return Po;var t,n=Cc,a=n.length,s,c="value"in na?na.value:na.textContent,f=c.length;for(t=0;t<a&&n[t]===c[t];t++);var M=a-t;for(s=1;s<=M&&n[a-s]===c[f-s];s++);return Po=c.slice(t,1<s?1-s:void 0)}function zo(t){var n=t.keyCode;return"charCode"in t?(t=t.charCode,t===0&&n===13&&(t=13)):t=n,t===10&&(t=13),32<=t||t===13?t:0}function Bo(){return!0}function Pd(){return!1}function In(t){function n(a,s,c,f,M){this._reactName=a,this._targetInst=c,this.type=s,this.nativeEvent=f,this.target=M,this.currentTarget=null;for(var E in t)t.hasOwnProperty(E)&&(a=t[E],this[E]=a?a(f):f[E]);return this.isDefaultPrevented=(f.defaultPrevented!=null?f.defaultPrevented:f.returnValue===!1)?Bo:Pd,this.isPropagationStopped=Pd,this}return g(n.prototype,{preventDefault:function(){this.defaultPrevented=!0;var a=this.nativeEvent;a&&(a.preventDefault?a.preventDefault():typeof a.returnValue!="unknown"&&(a.returnValue=!1),this.isDefaultPrevented=Bo)},stopPropagation:function(){var a=this.nativeEvent;a&&(a.stopPropagation?a.stopPropagation():typeof a.cancelBubble!="unknown"&&(a.cancelBubble=!0),this.isPropagationStopped=Bo)},persist:function(){},isPersistent:Bo}),n}var Fa={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(t){return t.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Io=In(Fa),bs=g({},Fa,{view:0,detail:0}),xv=In(bs),Dc,Lc,As,Fo=g({},bs,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Nc,button:0,buttons:0,relatedTarget:function(t){return t.relatedTarget===void 0?t.fromElement===t.srcElement?t.toElement:t.fromElement:t.relatedTarget},movementX:function(t){return"movementX"in t?t.movementX:(t!==As&&(As&&t.type==="mousemove"?(Dc=t.screenX-As.screenX,Lc=t.screenY-As.screenY):Lc=Dc=0,As=t),Dc)},movementY:function(t){return"movementY"in t?t.movementY:Lc}}),zd=In(Fo),Mv=g({},Fo,{dataTransfer:0}),yv=In(Mv),Ev=g({},bs,{relatedTarget:0}),Uc=In(Ev),Tv=g({},Fa,{animationName:0,elapsedTime:0,pseudoElement:0}),bv=In(Tv),Av=g({},Fa,{clipboardData:function(t){return"clipboardData"in t?t.clipboardData:window.clipboardData}}),Rv=In(Av),wv=g({},Fa,{data:0}),Bd=In(wv),Cv={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Dv={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Lv={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Uv(t){var n=this.nativeEvent;return n.getModifierState?n.getModifierState(t):(t=Lv[t])?!!n[t]:!1}function Nc(){return Uv}var Nv=g({},bs,{key:function(t){if(t.key){var n=Cv[t.key]||t.key;if(n!=="Unidentified")return n}return t.type==="keypress"?(t=zo(t),t===13?"Enter":String.fromCharCode(t)):t.type==="keydown"||t.type==="keyup"?Dv[t.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Nc,charCode:function(t){return t.type==="keypress"?zo(t):0},keyCode:function(t){return t.type==="keydown"||t.type==="keyup"?t.keyCode:0},which:function(t){return t.type==="keypress"?zo(t):t.type==="keydown"||t.type==="keyup"?t.keyCode:0}}),Ov=In(Nv),Pv=g({},Fo,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Id=In(Pv),zv=g({},bs,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Nc}),Bv=In(zv),Iv=g({},Fa,{propertyName:0,elapsedTime:0,pseudoElement:0}),Fv=In(Iv),Hv=g({},Fo,{deltaX:function(t){return"deltaX"in t?t.deltaX:"wheelDeltaX"in t?-t.wheelDeltaX:0},deltaY:function(t){return"deltaY"in t?t.deltaY:"wheelDeltaY"in t?-t.wheelDeltaY:"wheelDelta"in t?-t.wheelDelta:0},deltaZ:0,deltaMode:0}),Gv=In(Hv),Vv=g({},Fa,{newState:0,oldState:0}),kv=In(Vv),Xv=[9,13,27,32],Oc=Li&&"CompositionEvent"in window,Rs=null;Li&&"documentMode"in document&&(Rs=document.documentMode);var Wv=Li&&"TextEvent"in window&&!Rs,Fd=Li&&(!Oc||Rs&&8<Rs&&11>=Rs),Hd=" ",Gd=!1;function Vd(t,n){switch(t){case"keyup":return Xv.indexOf(n.keyCode)!==-1;case"keydown":return n.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function kd(t){return t=t.detail,typeof t=="object"&&"data"in t?t.data:null}var Sr=!1;function qv(t,n){switch(t){case"compositionend":return kd(n);case"keypress":return n.which!==32?null:(Gd=!0,Hd);case"textInput":return t=n.data,t===Hd&&Gd?null:t;default:return null}}function Yv(t,n){if(Sr)return t==="compositionend"||!Oc&&Vd(t,n)?(t=Od(),Po=Cc=na=null,Sr=!1,t):null;switch(t){case"paste":return null;case"keypress":if(!(n.ctrlKey||n.altKey||n.metaKey)||n.ctrlKey&&n.altKey){if(n.char&&1<n.char.length)return n.char;if(n.which)return String.fromCharCode(n.which)}return null;case"compositionend":return Fd&&n.locale!=="ko"?null:n.data;default:return null}}var jv={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Xd(t){var n=t&&t.nodeName&&t.nodeName.toLowerCase();return n==="input"?!!jv[t.type]:n==="textarea"}function Wd(t,n,a,s){_r?vr?vr.push(s):vr=[s]:_r=s,n=bl(n,"onChange"),0<n.length&&(a=new Io("onChange","change",null,a,s),t.push({event:a,listeners:n}))}var ws=null,Cs=null;function Zv(t){bm(t,0)}function Ho(t){var n=Nn(t);if(un(n))return t}function qd(t,n){if(t==="change")return n}var Yd=!1;if(Li){var Pc;if(Li){var zc="oninput"in document;if(!zc){var jd=document.createElement("div");jd.setAttribute("oninput","return;"),zc=typeof jd.oninput=="function"}Pc=zc}else Pc=!1;Yd=Pc&&(!document.documentMode||9<document.documentMode)}function Zd(){ws&&(ws.detachEvent("onpropertychange",Kd),Cs=ws=null)}function Kd(t){if(t.propertyName==="value"&&Ho(Cs)){var n=[];Wd(n,Cs,t,Ac(t)),Nd(Zv,n)}}function Kv(t,n,a){t==="focusin"?(Zd(),ws=n,Cs=a,ws.attachEvent("onpropertychange",Kd)):t==="focusout"&&Zd()}function Qv(t){if(t==="selectionchange"||t==="keyup"||t==="keydown")return Ho(Cs)}function Jv(t,n){if(t==="click")return Ho(n)}function $v(t,n){if(t==="input"||t==="change")return Ho(n)}function t0(t,n){return t===n&&(t!==0||1/t===1/n)||t!==t&&n!==n}var Yn=typeof Object.is=="function"?Object.is:t0;function Ds(t,n){if(Yn(t,n))return!0;if(typeof t!="object"||t===null||typeof n!="object"||n===null)return!1;var a=Object.keys(t),s=Object.keys(n);if(a.length!==s.length)return!1;for(s=0;s<a.length;s++){var c=a[s];if(!tt.call(n,c)||!Yn(t[c],n[c]))return!1}return!0}function Qd(t){for(;t&&t.firstChild;)t=t.firstChild;return t}function Jd(t,n){var a=Qd(t);t=0;for(var s;a;){if(a.nodeType===3){if(s=t+a.textContent.length,t<=n&&s>=n)return{node:a,offset:n-t};t=s}t:{for(;a;){if(a.nextSibling){a=a.nextSibling;break t}a=a.parentNode}a=void 0}a=Qd(a)}}function $d(t,n){return t&&n?t===n?!0:t&&t.nodeType===3?!1:n&&n.nodeType===3?$d(t,n.parentNode):"contains"in t?t.contains(n):t.compareDocumentPosition?!!(t.compareDocumentPosition(n)&16):!1:!1}function th(t){t=t!=null&&t.ownerDocument!=null&&t.ownerDocument.defaultView!=null?t.ownerDocument.defaultView:window;for(var n=ii(t.document);n instanceof t.HTMLIFrameElement;){try{var a=typeof n.contentWindow.location.href=="string"}catch{a=!1}if(a)t=n.contentWindow;else break;n=ii(t.document)}return n}function Bc(t){var n=t&&t.nodeName&&t.nodeName.toLowerCase();return n&&(n==="input"&&(t.type==="text"||t.type==="search"||t.type==="tel"||t.type==="url"||t.type==="password")||n==="textarea"||t.contentEditable==="true")}var e0=Li&&"documentMode"in document&&11>=document.documentMode,xr=null,Ic=null,Ls=null,Fc=!1;function eh(t,n,a){var s=a.window===a?a.document:a.nodeType===9?a:a.ownerDocument;Fc||xr==null||xr!==ii(s)||(s=xr,"selectionStart"in s&&Bc(s)?s={start:s.selectionStart,end:s.selectionEnd}:(s=(s.ownerDocument&&s.ownerDocument.defaultView||window).getSelection(),s={anchorNode:s.anchorNode,anchorOffset:s.anchorOffset,focusNode:s.focusNode,focusOffset:s.focusOffset}),Ls&&Ds(Ls,s)||(Ls=s,s=bl(Ic,"onSelect"),0<s.length&&(n=new Io("onSelect","select",null,n,a),t.push({event:n,listeners:s}),n.target=xr)))}function Ha(t,n){var a={};return a[t.toLowerCase()]=n.toLowerCase(),a["Webkit"+t]="webkit"+n,a["Moz"+t]="moz"+n,a}var Mr={animationend:Ha("Animation","AnimationEnd"),animationiteration:Ha("Animation","AnimationIteration"),animationstart:Ha("Animation","AnimationStart"),transitionrun:Ha("Transition","TransitionRun"),transitionstart:Ha("Transition","TransitionStart"),transitioncancel:Ha("Transition","TransitionCancel"),transitionend:Ha("Transition","TransitionEnd")},Hc={},nh={};Li&&(nh=document.createElement("div").style,"AnimationEvent"in window||(delete Mr.animationend.animation,delete Mr.animationiteration.animation,delete Mr.animationstart.animation),"TransitionEvent"in window||delete Mr.transitionend.transition);function Ga(t){if(Hc[t])return Hc[t];if(!Mr[t])return t;var n=Mr[t],a;for(a in n)if(n.hasOwnProperty(a)&&a in nh)return Hc[t]=n[a];return t}var ih=Ga("animationend"),ah=Ga("animationiteration"),rh=Ga("animationstart"),n0=Ga("transitionrun"),i0=Ga("transitionstart"),a0=Ga("transitioncancel"),sh=Ga("transitionend"),oh=new Map,Gc="abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");Gc.push("scrollEnd");function gi(t,n){oh.set(t,n),it(n,[t])}var lh=new WeakMap;function ai(t,n){if(typeof t=="object"&&t!==null){var a=lh.get(t);return a!==void 0?a:(n={value:t,source:n,stack:Ye(n)},lh.set(t,n),n)}return{value:t,source:n,stack:Ye(n)}}var ri=[],yr=0,Vc=0;function Go(){for(var t=yr,n=Vc=yr=0;n<t;){var a=ri[n];ri[n++]=null;var s=ri[n];ri[n++]=null;var c=ri[n];ri[n++]=null;var f=ri[n];if(ri[n++]=null,s!==null&&c!==null){var M=s.pending;M===null?c.next=c:(c.next=M.next,M.next=c),s.pending=c}f!==0&&ch(a,c,f)}}function Vo(t,n,a,s){ri[yr++]=t,ri[yr++]=n,ri[yr++]=a,ri[yr++]=s,Vc|=s,t.lanes|=s,t=t.alternate,t!==null&&(t.lanes|=s)}function kc(t,n,a,s){return Vo(t,n,a,s),ko(t)}function Er(t,n){return Vo(t,null,null,n),ko(t)}function ch(t,n,a){t.lanes|=a;var s=t.alternate;s!==null&&(s.lanes|=a);for(var c=!1,f=t.return;f!==null;)f.childLanes|=a,s=f.alternate,s!==null&&(s.childLanes|=a),f.tag===22&&(t=f.stateNode,t===null||t._visibility&1||(c=!0)),t=f,f=f.return;return t.tag===3?(f=t.stateNode,c&&n!==null&&(c=31-kt(a),t=f.hiddenUpdates,s=t[c],s===null?t[c]=[n]:s.push(n),n.lane=a|536870912),f):null}function ko(t){if(50<no)throw no=0,Zu=null,Error(r(185));for(var n=t.return;n!==null;)t=n,n=t.return;return t.tag===3?t.stateNode:null}var Tr={};function r0(t,n,a,s){this.tag=t,this.key=a,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=n,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=s,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function jn(t,n,a,s){return new r0(t,n,a,s)}function Xc(t){return t=t.prototype,!(!t||!t.isReactComponent)}function Ui(t,n){var a=t.alternate;return a===null?(a=jn(t.tag,n,t.key,t.mode),a.elementType=t.elementType,a.type=t.type,a.stateNode=t.stateNode,a.alternate=t,t.alternate=a):(a.pendingProps=n,a.type=t.type,a.flags=0,a.subtreeFlags=0,a.deletions=null),a.flags=t.flags&65011712,a.childLanes=t.childLanes,a.lanes=t.lanes,a.child=t.child,a.memoizedProps=t.memoizedProps,a.memoizedState=t.memoizedState,a.updateQueue=t.updateQueue,n=t.dependencies,a.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext},a.sibling=t.sibling,a.index=t.index,a.ref=t.ref,a.refCleanup=t.refCleanup,a}function uh(t,n){t.flags&=65011714;var a=t.alternate;return a===null?(t.childLanes=0,t.lanes=n,t.child=null,t.subtreeFlags=0,t.memoizedProps=null,t.memoizedState=null,t.updateQueue=null,t.dependencies=null,t.stateNode=null):(t.childLanes=a.childLanes,t.lanes=a.lanes,t.child=a.child,t.subtreeFlags=0,t.deletions=null,t.memoizedProps=a.memoizedProps,t.memoizedState=a.memoizedState,t.updateQueue=a.updateQueue,t.type=a.type,n=a.dependencies,t.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext}),t}function Xo(t,n,a,s,c,f){var M=0;if(s=t,typeof t=="function")Xc(t)&&(M=1);else if(typeof t=="string")M=oS(t,a,J.current)?26:t==="html"||t==="head"||t==="body"?27:5;else t:switch(t){case C:return t=jn(31,a,n,c),t.elementType=C,t.lanes=f,t;case b:return Va(a.children,c,f,n);case A:M=8,c|=24;break;case x:return t=jn(12,a,n,c|2),t.elementType=x,t.lanes=f,t;case G:return t=jn(13,a,n,c),t.elementType=G,t.lanes=f,t;case F:return t=jn(19,a,n,c),t.elementType=F,t.lanes=f,t;default:if(typeof t=="object"&&t!==null)switch(t.$$typeof){case _:case D:M=10;break t;case N:M=9;break t;case P:M=11;break t;case I:M=14;break t;case mt:M=16,s=null;break t}M=29,a=Error(r(130,t===null?"null":typeof t,"")),s=null}return n=jn(M,a,n,c),n.elementType=t,n.type=s,n.lanes=f,n}function Va(t,n,a,s){return t=jn(7,t,s,n),t.lanes=a,t}function Wc(t,n,a){return t=jn(6,t,null,n),t.lanes=a,t}function qc(t,n,a){return n=jn(4,t.children!==null?t.children:[],t.key,n),n.lanes=a,n.stateNode={containerInfo:t.containerInfo,pendingChildren:null,implementation:t.implementation},n}var br=[],Ar=0,Wo=null,qo=0,si=[],oi=0,ka=null,Ni=1,Oi="";function Xa(t,n){br[Ar++]=qo,br[Ar++]=Wo,Wo=t,qo=n}function fh(t,n,a){si[oi++]=Ni,si[oi++]=Oi,si[oi++]=ka,ka=t;var s=Ni;t=Oi;var c=32-kt(s)-1;s&=~(1<<c),a+=1;var f=32-kt(n)+c;if(30<f){var M=c-c%5;f=(s&(1<<M)-1).toString(32),s>>=M,c-=M,Ni=1<<32-kt(n)+c|a<<c|s,Oi=f+t}else Ni=1<<f|a<<c|s,Oi=t}function Yc(t){t.return!==null&&(Xa(t,1),fh(t,1,0))}function jc(t){for(;t===Wo;)Wo=br[--Ar],br[Ar]=null,qo=br[--Ar],br[Ar]=null;for(;t===ka;)ka=si[--oi],si[oi]=null,Oi=si[--oi],si[oi]=null,Ni=si[--oi],si[oi]=null}var On=null,$e=null,Ue=!1,Wa=null,bi=!1,Zc=Error(r(519));function qa(t){var n=Error(r(418,""));throw Os(ai(n,t)),Zc}function dh(t){var n=t.stateNode,a=t.type,s=t.memoizedProps;switch(n[Bt]=t,n[le]=s,a){case"dialog":Te("cancel",n),Te("close",n);break;case"iframe":case"object":case"embed":Te("load",n);break;case"video":case"audio":for(a=0;a<ao.length;a++)Te(ao[a],n);break;case"source":Te("error",n);break;case"img":case"image":case"link":Te("error",n),Te("load",n);break;case"details":Te("toggle",n);break;case"input":Te("invalid",n),No(n,s.value,s.defaultValue,s.checked,s.defaultChecked,s.type,s.name,!0),ea(n);break;case"select":Te("invalid",n);break;case"textarea":Te("invalid",n),Cd(n,s.value,s.defaultValue,s.children),ea(n)}a=s.children,typeof a!="string"&&typeof a!="number"&&typeof a!="bigint"||n.textContent===""+a||s.suppressHydrationWarning===!0||Cm(n.textContent,a)?(s.popover!=null&&(Te("beforetoggle",n),Te("toggle",n)),s.onScroll!=null&&Te("scroll",n),s.onScrollEnd!=null&&Te("scrollend",n),s.onClick!=null&&(n.onclick=Al),n=!0):n=!1,n||qa(t)}function hh(t){for(On=t.return;On;)switch(On.tag){case 5:case 13:bi=!1;return;case 27:case 3:bi=!0;return;default:On=On.return}}function Us(t){if(t!==On)return!1;if(!Ue)return hh(t),Ue=!0,!1;var n=t.tag,a;if((a=n!==3&&n!==27)&&((a=n===5)&&(a=t.type,a=!(a!=="form"&&a!=="button")||df(t.type,t.memoizedProps)),a=!a),a&&$e&&qa(t),hh(t),n===13){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(r(317));t:{for(t=t.nextSibling,n=0;t;){if(t.nodeType===8)if(a=t.data,a==="/$"){if(n===0){$e=vi(t.nextSibling);break t}n--}else a!=="$"&&a!=="$!"&&a!=="$?"||n++;t=t.nextSibling}$e=null}}else n===27?(n=$e,va(t.type)?(t=gf,gf=null,$e=t):$e=n):$e=On?vi(t.stateNode.nextSibling):null;return!0}function Ns(){$e=On=null,Ue=!1}function ph(){var t=Wa;return t!==null&&(Gn===null?Gn=t:Gn.push.apply(Gn,t),Wa=null),t}function Os(t){Wa===null?Wa=[t]:Wa.push(t)}var Kc=k(null),Ya=null,Pi=null;function ia(t,n,a){B(Kc,n._currentValue),n._currentValue=a}function zi(t){t._currentValue=Kc.current,Q(Kc)}function Qc(t,n,a){for(;t!==null;){var s=t.alternate;if((t.childLanes&n)!==n?(t.childLanes|=n,s!==null&&(s.childLanes|=n)):s!==null&&(s.childLanes&n)!==n&&(s.childLanes|=n),t===a)break;t=t.return}}function Jc(t,n,a,s){var c=t.child;for(c!==null&&(c.return=t);c!==null;){var f=c.dependencies;if(f!==null){var M=c.child;f=f.firstContext;t:for(;f!==null;){var E=f;f=c;for(var z=0;z<n.length;z++)if(E.context===n[z]){f.lanes|=a,E=f.alternate,E!==null&&(E.lanes|=a),Qc(f.return,a,t),s||(M=null);break t}f=E.next}}else if(c.tag===18){if(M=c.return,M===null)throw Error(r(341));M.lanes|=a,f=M.alternate,f!==null&&(f.lanes|=a),Qc(M,a,t),M=null}else M=c.child;if(M!==null)M.return=c;else for(M=c;M!==null;){if(M===t){M=null;break}if(c=M.sibling,c!==null){c.return=M.return,M=c;break}M=M.return}c=M}}function Ps(t,n,a,s){t=null;for(var c=n,f=!1;c!==null;){if(!f){if((c.flags&524288)!==0)f=!0;else if((c.flags&262144)!==0)break}if(c.tag===10){var M=c.alternate;if(M===null)throw Error(r(387));if(M=M.memoizedProps,M!==null){var E=c.type;Yn(c.pendingProps.value,M.value)||(t!==null?t.push(E):t=[E])}}else if(c===Lt.current){if(M=c.alternate,M===null)throw Error(r(387));M.memoizedState.memoizedState!==c.memoizedState.memoizedState&&(t!==null?t.push(uo):t=[uo])}c=c.return}t!==null&&Jc(n,t,a,s),n.flags|=262144}function Yo(t){for(t=t.firstContext;t!==null;){if(!Yn(t.context._currentValue,t.memoizedValue))return!0;t=t.next}return!1}function ja(t){Ya=t,Pi=null,t=t.dependencies,t!==null&&(t.firstContext=null)}function Cn(t){return mh(Ya,t)}function jo(t,n){return Ya===null&&ja(t),mh(t,n)}function mh(t,n){var a=n._currentValue;if(n={context:n,memoizedValue:a,next:null},Pi===null){if(t===null)throw Error(r(308));Pi=n,t.dependencies={lanes:0,firstContext:n},t.flags|=524288}else Pi=Pi.next=n;return a}var s0=typeof AbortController<"u"?AbortController:function(){var t=[],n=this.signal={aborted:!1,addEventListener:function(a,s){t.push(s)}};this.abort=function(){n.aborted=!0,t.forEach(function(a){return a()})}},o0=o.unstable_scheduleCallback,l0=o.unstable_NormalPriority,fn={$$typeof:D,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function $c(){return{controller:new s0,data:new Map,refCount:0}}function zs(t){t.refCount--,t.refCount===0&&o0(l0,function(){t.controller.abort()})}var Bs=null,tu=0,Rr=0,wr=null;function c0(t,n){if(Bs===null){var a=Bs=[];tu=0,Rr=nf(),wr={status:"pending",value:void 0,then:function(s){a.push(s)}}}return tu++,n.then(gh,gh),n}function gh(){if(--tu===0&&Bs!==null){wr!==null&&(wr.status="fulfilled");var t=Bs;Bs=null,Rr=0,wr=null;for(var n=0;n<t.length;n++)(0,t[n])()}}function u0(t,n){var a=[],s={status:"pending",value:null,reason:null,then:function(c){a.push(c)}};return t.then(function(){s.status="fulfilled",s.value=n;for(var c=0;c<a.length;c++)(0,a[c])(n)},function(c){for(s.status="rejected",s.reason=c,c=0;c<a.length;c++)(0,a[c])(void 0)}),s}var _h=O.S;O.S=function(t,n){typeof n=="object"&&n!==null&&typeof n.then=="function"&&c0(t,n),_h!==null&&_h(t,n)};var Za=k(null);function eu(){var t=Za.current;return t!==null?t:Xe.pooledCache}function Zo(t,n){n===null?B(Za,Za.current):B(Za,n.pool)}function vh(){var t=eu();return t===null?null:{parent:fn._currentValue,pool:t}}var Is=Error(r(460)),Sh=Error(r(474)),Ko=Error(r(542)),nu={then:function(){}};function xh(t){return t=t.status,t==="fulfilled"||t==="rejected"}function Qo(){}function Mh(t,n,a){switch(a=t[a],a===void 0?t.push(n):a!==n&&(n.then(Qo,Qo),n=a),n.status){case"fulfilled":return n.value;case"rejected":throw t=n.reason,Eh(t),t;default:if(typeof n.status=="string")n.then(Qo,Qo);else{if(t=Xe,t!==null&&100<t.shellSuspendCounter)throw Error(r(482));t=n,t.status="pending",t.then(function(s){if(n.status==="pending"){var c=n;c.status="fulfilled",c.value=s}},function(s){if(n.status==="pending"){var c=n;c.status="rejected",c.reason=s}})}switch(n.status){case"fulfilled":return n.value;case"rejected":throw t=n.reason,Eh(t),t}throw Fs=n,Is}}var Fs=null;function yh(){if(Fs===null)throw Error(r(459));var t=Fs;return Fs=null,t}function Eh(t){if(t===Is||t===Ko)throw Error(r(483))}var aa=!1;function iu(t){t.updateQueue={baseState:t.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function au(t,n){t=t.updateQueue,n.updateQueue===t&&(n.updateQueue={baseState:t.baseState,firstBaseUpdate:t.firstBaseUpdate,lastBaseUpdate:t.lastBaseUpdate,shared:t.shared,callbacks:null})}function ra(t){return{lane:t,tag:0,payload:null,callback:null,next:null}}function sa(t,n,a){var s=t.updateQueue;if(s===null)return null;if(s=s.shared,(Ne&2)!==0){var c=s.pending;return c===null?n.next=n:(n.next=c.next,c.next=n),s.pending=n,n=ko(t),ch(t,null,a),n}return Vo(t,s,n,a),ko(t)}function Hs(t,n,a){if(n=n.updateQueue,n!==null&&(n=n.shared,(a&4194048)!==0)){var s=n.lanes;s&=t.pendingLanes,a|=s,n.lanes=a,Zt(t,a)}}function ru(t,n){var a=t.updateQueue,s=t.alternate;if(s!==null&&(s=s.updateQueue,a===s)){var c=null,f=null;if(a=a.firstBaseUpdate,a!==null){do{var M={lane:a.lane,tag:a.tag,payload:a.payload,callback:null,next:null};f===null?c=f=M:f=f.next=M,a=a.next}while(a!==null);f===null?c=f=n:f=f.next=n}else c=f=n;a={baseState:s.baseState,firstBaseUpdate:c,lastBaseUpdate:f,shared:s.shared,callbacks:s.callbacks},t.updateQueue=a;return}t=a.lastBaseUpdate,t===null?a.firstBaseUpdate=n:t.next=n,a.lastBaseUpdate=n}var su=!1;function Gs(){if(su){var t=wr;if(t!==null)throw t}}function Vs(t,n,a,s){su=!1;var c=t.updateQueue;aa=!1;var f=c.firstBaseUpdate,M=c.lastBaseUpdate,E=c.shared.pending;if(E!==null){c.shared.pending=null;var z=E,K=z.next;z.next=null,M===null?f=K:M.next=K,M=z;var dt=t.alternate;dt!==null&&(dt=dt.updateQueue,E=dt.lastBaseUpdate,E!==M&&(E===null?dt.firstBaseUpdate=K:E.next=K,dt.lastBaseUpdate=z))}if(f!==null){var gt=c.baseState;M=0,dt=K=z=null,E=f;do{var nt=E.lane&-536870913,at=nt!==E.lane;if(at?(Re&nt)===nt:(s&nt)===nt){nt!==0&&nt===Rr&&(su=!0),dt!==null&&(dt=dt.next={lane:0,tag:E.tag,payload:E.payload,callback:null,next:null});t:{var se=t,te=E;nt=n;var Ie=a;switch(te.tag){case 1:if(se=te.payload,typeof se=="function"){gt=se.call(Ie,gt,nt);break t}gt=se;break t;case 3:se.flags=se.flags&-65537|128;case 0:if(se=te.payload,nt=typeof se=="function"?se.call(Ie,gt,nt):se,nt==null)break t;gt=g({},gt,nt);break t;case 2:aa=!0}}nt=E.callback,nt!==null&&(t.flags|=64,at&&(t.flags|=8192),at=c.callbacks,at===null?c.callbacks=[nt]:at.push(nt))}else at={lane:nt,tag:E.tag,payload:E.payload,callback:E.callback,next:null},dt===null?(K=dt=at,z=gt):dt=dt.next=at,M|=nt;if(E=E.next,E===null){if(E=c.shared.pending,E===null)break;at=E,E=at.next,at.next=null,c.lastBaseUpdate=at,c.shared.pending=null}}while(!0);dt===null&&(z=gt),c.baseState=z,c.firstBaseUpdate=K,c.lastBaseUpdate=dt,f===null&&(c.shared.lanes=0),pa|=M,t.lanes=M,t.memoizedState=gt}}function Th(t,n){if(typeof t!="function")throw Error(r(191,t));t.call(n)}function bh(t,n){var a=t.callbacks;if(a!==null)for(t.callbacks=null,t=0;t<a.length;t++)Th(a[t],n)}var Cr=k(null),Jo=k(0);function Ah(t,n){t=ki,B(Jo,t),B(Cr,n),ki=t|n.baseLanes}function ou(){B(Jo,ki),B(Cr,Cr.current)}function lu(){ki=Jo.current,Q(Cr),Q(Jo)}var oa=0,ve=null,ze=null,sn=null,$o=!1,Dr=!1,Ka=!1,tl=0,ks=0,Lr=null,f0=0;function nn(){throw Error(r(321))}function cu(t,n){if(n===null)return!1;for(var a=0;a<n.length&&a<t.length;a++)if(!Yn(t[a],n[a]))return!1;return!0}function uu(t,n,a,s,c,f){return oa=f,ve=n,n.memoizedState=null,n.updateQueue=null,n.lanes=0,O.H=t===null||t.memoizedState===null?cp:up,Ka=!1,f=a(s,c),Ka=!1,Dr&&(f=wh(n,a,s,c)),Rh(t),f}function Rh(t){O.H=sl;var n=ze!==null&&ze.next!==null;if(oa=0,sn=ze=ve=null,$o=!1,ks=0,Lr=null,n)throw Error(r(300));t===null||mn||(t=t.dependencies,t!==null&&Yo(t)&&(mn=!0))}function wh(t,n,a,s){ve=t;var c=0;do{if(Dr&&(Lr=null),ks=0,Dr=!1,25<=c)throw Error(r(301));if(c+=1,sn=ze=null,t.updateQueue!=null){var f=t.updateQueue;f.lastEffect=null,f.events=null,f.stores=null,f.memoCache!=null&&(f.memoCache.index=0)}O.H=v0,f=n(a,s)}while(Dr);return f}function d0(){var t=O.H,n=t.useState()[0];return n=typeof n.then=="function"?Xs(n):n,t=t.useState()[0],(ze!==null?ze.memoizedState:null)!==t&&(ve.flags|=1024),n}function fu(){var t=tl!==0;return tl=0,t}function du(t,n,a){n.updateQueue=t.updateQueue,n.flags&=-2053,t.lanes&=~a}function hu(t){if($o){for(t=t.memoizedState;t!==null;){var n=t.queue;n!==null&&(n.pending=null),t=t.next}$o=!1}oa=0,sn=ze=ve=null,Dr=!1,ks=tl=0,Lr=null}function Fn(){var t={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return sn===null?ve.memoizedState=sn=t:sn=sn.next=t,sn}function on(){if(ze===null){var t=ve.alternate;t=t!==null?t.memoizedState:null}else t=ze.next;var n=sn===null?ve.memoizedState:sn.next;if(n!==null)sn=n,ze=t;else{if(t===null)throw ve.alternate===null?Error(r(467)):Error(r(310));ze=t,t={memoizedState:ze.memoizedState,baseState:ze.baseState,baseQueue:ze.baseQueue,queue:ze.queue,next:null},sn===null?ve.memoizedState=sn=t:sn=sn.next=t}return sn}function pu(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function Xs(t){var n=ks;return ks+=1,Lr===null&&(Lr=[]),t=Mh(Lr,t,n),n=ve,(sn===null?n.memoizedState:sn.next)===null&&(n=n.alternate,O.H=n===null||n.memoizedState===null?cp:up),t}function el(t){if(t!==null&&typeof t=="object"){if(typeof t.then=="function")return Xs(t);if(t.$$typeof===D)return Cn(t)}throw Error(r(438,String(t)))}function mu(t){var n=null,a=ve.updateQueue;if(a!==null&&(n=a.memoCache),n==null){var s=ve.alternate;s!==null&&(s=s.updateQueue,s!==null&&(s=s.memoCache,s!=null&&(n={data:s.data.map(function(c){return c.slice()}),index:0})))}if(n==null&&(n={data:[],index:0}),a===null&&(a=pu(),ve.updateQueue=a),a.memoCache=n,a=n.data[n.index],a===void 0)for(a=n.data[n.index]=Array(t),s=0;s<t;s++)a[s]=U;return n.index++,a}function Bi(t,n){return typeof n=="function"?n(t):n}function nl(t){var n=on();return gu(n,ze,t)}function gu(t,n,a){var s=t.queue;if(s===null)throw Error(r(311));s.lastRenderedReducer=a;var c=t.baseQueue,f=s.pending;if(f!==null){if(c!==null){var M=c.next;c.next=f.next,f.next=M}n.baseQueue=c=f,s.pending=null}if(f=t.baseState,c===null)t.memoizedState=f;else{n=c.next;var E=M=null,z=null,K=n,dt=!1;do{var gt=K.lane&-536870913;if(gt!==K.lane?(Re&gt)===gt:(oa&gt)===gt){var nt=K.revertLane;if(nt===0)z!==null&&(z=z.next={lane:0,revertLane:0,action:K.action,hasEagerState:K.hasEagerState,eagerState:K.eagerState,next:null}),gt===Rr&&(dt=!0);else if((oa&nt)===nt){K=K.next,nt===Rr&&(dt=!0);continue}else gt={lane:0,revertLane:K.revertLane,action:K.action,hasEagerState:K.hasEagerState,eagerState:K.eagerState,next:null},z===null?(E=z=gt,M=f):z=z.next=gt,ve.lanes|=nt,pa|=nt;gt=K.action,Ka&&a(f,gt),f=K.hasEagerState?K.eagerState:a(f,gt)}else nt={lane:gt,revertLane:K.revertLane,action:K.action,hasEagerState:K.hasEagerState,eagerState:K.eagerState,next:null},z===null?(E=z=nt,M=f):z=z.next=nt,ve.lanes|=gt,pa|=gt;K=K.next}while(K!==null&&K!==n);if(z===null?M=f:z.next=E,!Yn(f,t.memoizedState)&&(mn=!0,dt&&(a=wr,a!==null)))throw a;t.memoizedState=f,t.baseState=M,t.baseQueue=z,s.lastRenderedState=f}return c===null&&(s.lanes=0),[t.memoizedState,s.dispatch]}function _u(t){var n=on(),a=n.queue;if(a===null)throw Error(r(311));a.lastRenderedReducer=t;var s=a.dispatch,c=a.pending,f=n.memoizedState;if(c!==null){a.pending=null;var M=c=c.next;do f=t(f,M.action),M=M.next;while(M!==c);Yn(f,n.memoizedState)||(mn=!0),n.memoizedState=f,n.baseQueue===null&&(n.baseState=f),a.lastRenderedState=f}return[f,s]}function Ch(t,n,a){var s=ve,c=on(),f=Ue;if(f){if(a===void 0)throw Error(r(407));a=a()}else a=n();var M=!Yn((ze||c).memoizedState,a);M&&(c.memoizedState=a,mn=!0),c=c.queue;var E=Uh.bind(null,s,c,t);if(Ws(2048,8,E,[t]),c.getSnapshot!==n||M||sn!==null&&sn.memoizedState.tag&1){if(s.flags|=2048,Ur(9,il(),Lh.bind(null,s,c,a,n),null),Xe===null)throw Error(r(349));f||(oa&124)!==0||Dh(s,n,a)}return a}function Dh(t,n,a){t.flags|=16384,t={getSnapshot:n,value:a},n=ve.updateQueue,n===null?(n=pu(),ve.updateQueue=n,n.stores=[t]):(a=n.stores,a===null?n.stores=[t]:a.push(t))}function Lh(t,n,a,s){n.value=a,n.getSnapshot=s,Nh(n)&&Oh(t)}function Uh(t,n,a){return a(function(){Nh(n)&&Oh(t)})}function Nh(t){var n=t.getSnapshot;t=t.value;try{var a=n();return!Yn(t,a)}catch{return!0}}function Oh(t){var n=Er(t,2);n!==null&&$n(n,t,2)}function vu(t){var n=Fn();if(typeof t=="function"){var a=t;if(t=a(),Ka){Gt(!0);try{a()}finally{Gt(!1)}}}return n.memoizedState=n.baseState=t,n.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Bi,lastRenderedState:t},n}function Ph(t,n,a,s){return t.baseState=a,gu(t,ze,typeof s=="function"?s:Bi)}function h0(t,n,a,s,c){if(rl(t))throw Error(r(485));if(t=n.action,t!==null){var f={payload:c,action:t,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(M){f.listeners.push(M)}};O.T!==null?a(!0):f.isTransition=!1,s(f),a=n.pending,a===null?(f.next=n.pending=f,zh(n,f)):(f.next=a.next,n.pending=a.next=f)}}function zh(t,n){var a=n.action,s=n.payload,c=t.state;if(n.isTransition){var f=O.T,M={};O.T=M;try{var E=a(c,s),z=O.S;z!==null&&z(M,E),Bh(t,n,E)}catch(K){Su(t,n,K)}finally{O.T=f}}else try{f=a(c,s),Bh(t,n,f)}catch(K){Su(t,n,K)}}function Bh(t,n,a){a!==null&&typeof a=="object"&&typeof a.then=="function"?a.then(function(s){Ih(t,n,s)},function(s){return Su(t,n,s)}):Ih(t,n,a)}function Ih(t,n,a){n.status="fulfilled",n.value=a,Fh(n),t.state=a,n=t.pending,n!==null&&(a=n.next,a===n?t.pending=null:(a=a.next,n.next=a,zh(t,a)))}function Su(t,n,a){var s=t.pending;if(t.pending=null,s!==null){s=s.next;do n.status="rejected",n.reason=a,Fh(n),n=n.next;while(n!==s)}t.action=null}function Fh(t){t=t.listeners;for(var n=0;n<t.length;n++)(0,t[n])()}function Hh(t,n){return n}function Gh(t,n){if(Ue){var a=Xe.formState;if(a!==null){t:{var s=ve;if(Ue){if($e){e:{for(var c=$e,f=bi;c.nodeType!==8;){if(!f){c=null;break e}if(c=vi(c.nextSibling),c===null){c=null;break e}}f=c.data,c=f==="F!"||f==="F"?c:null}if(c){$e=vi(c.nextSibling),s=c.data==="F!";break t}}qa(s)}s=!1}s&&(n=a[0])}}return a=Fn(),a.memoizedState=a.baseState=n,s={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Hh,lastRenderedState:n},a.queue=s,a=sp.bind(null,ve,s),s.dispatch=a,s=vu(!1),f=Tu.bind(null,ve,!1,s.queue),s=Fn(),c={state:n,dispatch:null,action:t,pending:null},s.queue=c,a=h0.bind(null,ve,c,f,a),c.dispatch=a,s.memoizedState=t,[n,a,!1]}function Vh(t){var n=on();return kh(n,ze,t)}function kh(t,n,a){if(n=gu(t,n,Hh)[0],t=nl(Bi)[0],typeof n=="object"&&n!==null&&typeof n.then=="function")try{var s=Xs(n)}catch(M){throw M===Is?Ko:M}else s=n;n=on();var c=n.queue,f=c.dispatch;return a!==n.memoizedState&&(ve.flags|=2048,Ur(9,il(),p0.bind(null,c,a),null)),[s,f,t]}function p0(t,n){t.action=n}function Xh(t){var n=on(),a=ze;if(a!==null)return kh(n,a,t);on(),n=n.memoizedState,a=on();var s=a.queue.dispatch;return a.memoizedState=t,[n,s,!1]}function Ur(t,n,a,s){return t={tag:t,create:a,deps:s,inst:n,next:null},n=ve.updateQueue,n===null&&(n=pu(),ve.updateQueue=n),a=n.lastEffect,a===null?n.lastEffect=t.next=t:(s=a.next,a.next=t,t.next=s,n.lastEffect=t),t}function il(){return{destroy:void 0,resource:void 0}}function Wh(){return on().memoizedState}function al(t,n,a,s){var c=Fn();s=s===void 0?null:s,ve.flags|=t,c.memoizedState=Ur(1|n,il(),a,s)}function Ws(t,n,a,s){var c=on();s=s===void 0?null:s;var f=c.memoizedState.inst;ze!==null&&s!==null&&cu(s,ze.memoizedState.deps)?c.memoizedState=Ur(n,f,a,s):(ve.flags|=t,c.memoizedState=Ur(1|n,f,a,s))}function qh(t,n){al(8390656,8,t,n)}function Yh(t,n){Ws(2048,8,t,n)}function jh(t,n){return Ws(4,2,t,n)}function Zh(t,n){return Ws(4,4,t,n)}function Kh(t,n){if(typeof n=="function"){t=t();var a=n(t);return function(){typeof a=="function"?a():n(null)}}if(n!=null)return t=t(),n.current=t,function(){n.current=null}}function Qh(t,n,a){a=a!=null?a.concat([t]):null,Ws(4,4,Kh.bind(null,n,t),a)}function xu(){}function Jh(t,n){var a=on();n=n===void 0?null:n;var s=a.memoizedState;return n!==null&&cu(n,s[1])?s[0]:(a.memoizedState=[t,n],t)}function $h(t,n){var a=on();n=n===void 0?null:n;var s=a.memoizedState;if(n!==null&&cu(n,s[1]))return s[0];if(s=t(),Ka){Gt(!0);try{t()}finally{Gt(!1)}}return a.memoizedState=[s,n],s}function Mu(t,n,a){return a===void 0||(oa&1073741824)!==0?t.memoizedState=n:(t.memoizedState=a,t=nm(),ve.lanes|=t,pa|=t,a)}function tp(t,n,a,s){return Yn(a,n)?a:Cr.current!==null?(t=Mu(t,a,s),Yn(t,n)||(mn=!0),t):(oa&42)===0?(mn=!0,t.memoizedState=a):(t=nm(),ve.lanes|=t,pa|=t,n)}function ep(t,n,a,s,c){var f=q.p;q.p=f!==0&&8>f?f:8;var M=O.T,E={};O.T=E,Tu(t,!1,n,a);try{var z=c(),K=O.S;if(K!==null&&K(E,z),z!==null&&typeof z=="object"&&typeof z.then=="function"){var dt=u0(z,s);qs(t,n,dt,Jn(t))}else qs(t,n,s,Jn(t))}catch(gt){qs(t,n,{then:function(){},status:"rejected",reason:gt},Jn())}finally{q.p=f,O.T=M}}function m0(){}function yu(t,n,a,s){if(t.tag!==5)throw Error(r(476));var c=np(t).queue;ep(t,c,n,j,a===null?m0:function(){return ip(t),a(s)})}function np(t){var n=t.memoizedState;if(n!==null)return n;n={memoizedState:j,baseState:j,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Bi,lastRenderedState:j},next:null};var a={};return n.next={memoizedState:a,baseState:a,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Bi,lastRenderedState:a},next:null},t.memoizedState=n,t=t.alternate,t!==null&&(t.memoizedState=n),n}function ip(t){var n=np(t).next.queue;qs(t,n,{},Jn())}function Eu(){return Cn(uo)}function ap(){return on().memoizedState}function rp(){return on().memoizedState}function g0(t){for(var n=t.return;n!==null;){switch(n.tag){case 24:case 3:var a=Jn();t=ra(a);var s=sa(n,t,a);s!==null&&($n(s,n,a),Hs(s,n,a)),n={cache:$c()},t.payload=n;return}n=n.return}}function _0(t,n,a){var s=Jn();a={lane:s,revertLane:0,action:a,hasEagerState:!1,eagerState:null,next:null},rl(t)?op(n,a):(a=kc(t,n,a,s),a!==null&&($n(a,t,s),lp(a,n,s)))}function sp(t,n,a){var s=Jn();qs(t,n,a,s)}function qs(t,n,a,s){var c={lane:s,revertLane:0,action:a,hasEagerState:!1,eagerState:null,next:null};if(rl(t))op(n,c);else{var f=t.alternate;if(t.lanes===0&&(f===null||f.lanes===0)&&(f=n.lastRenderedReducer,f!==null))try{var M=n.lastRenderedState,E=f(M,a);if(c.hasEagerState=!0,c.eagerState=E,Yn(E,M))return Vo(t,n,c,0),Xe===null&&Go(),!1}catch{}if(a=kc(t,n,c,s),a!==null)return $n(a,t,s),lp(a,n,s),!0}return!1}function Tu(t,n,a,s){if(s={lane:2,revertLane:nf(),action:s,hasEagerState:!1,eagerState:null,next:null},rl(t)){if(n)throw Error(r(479))}else n=kc(t,a,s,2),n!==null&&$n(n,t,2)}function rl(t){var n=t.alternate;return t===ve||n!==null&&n===ve}function op(t,n){Dr=$o=!0;var a=t.pending;a===null?n.next=n:(n.next=a.next,a.next=n),t.pending=n}function lp(t,n,a){if((a&4194048)!==0){var s=n.lanes;s&=t.pendingLanes,a|=s,n.lanes=a,Zt(t,a)}}var sl={readContext:Cn,use:el,useCallback:nn,useContext:nn,useEffect:nn,useImperativeHandle:nn,useLayoutEffect:nn,useInsertionEffect:nn,useMemo:nn,useReducer:nn,useRef:nn,useState:nn,useDebugValue:nn,useDeferredValue:nn,useTransition:nn,useSyncExternalStore:nn,useId:nn,useHostTransitionStatus:nn,useFormState:nn,useActionState:nn,useOptimistic:nn,useMemoCache:nn,useCacheRefresh:nn},cp={readContext:Cn,use:el,useCallback:function(t,n){return Fn().memoizedState=[t,n===void 0?null:n],t},useContext:Cn,useEffect:qh,useImperativeHandle:function(t,n,a){a=a!=null?a.concat([t]):null,al(4194308,4,Kh.bind(null,n,t),a)},useLayoutEffect:function(t,n){return al(4194308,4,t,n)},useInsertionEffect:function(t,n){al(4,2,t,n)},useMemo:function(t,n){var a=Fn();n=n===void 0?null:n;var s=t();if(Ka){Gt(!0);try{t()}finally{Gt(!1)}}return a.memoizedState=[s,n],s},useReducer:function(t,n,a){var s=Fn();if(a!==void 0){var c=a(n);if(Ka){Gt(!0);try{a(n)}finally{Gt(!1)}}}else c=n;return s.memoizedState=s.baseState=c,t={pending:null,lanes:0,dispatch:null,lastRenderedReducer:t,lastRenderedState:c},s.queue=t,t=t.dispatch=_0.bind(null,ve,t),[s.memoizedState,t]},useRef:function(t){var n=Fn();return t={current:t},n.memoizedState=t},useState:function(t){t=vu(t);var n=t.queue,a=sp.bind(null,ve,n);return n.dispatch=a,[t.memoizedState,a]},useDebugValue:xu,useDeferredValue:function(t,n){var a=Fn();return Mu(a,t,n)},useTransition:function(){var t=vu(!1);return t=ep.bind(null,ve,t.queue,!0,!1),Fn().memoizedState=t,[!1,t]},useSyncExternalStore:function(t,n,a){var s=ve,c=Fn();if(Ue){if(a===void 0)throw Error(r(407));a=a()}else{if(a=n(),Xe===null)throw Error(r(349));(Re&124)!==0||Dh(s,n,a)}c.memoizedState=a;var f={value:a,getSnapshot:n};return c.queue=f,qh(Uh.bind(null,s,f,t),[t]),s.flags|=2048,Ur(9,il(),Lh.bind(null,s,f,a,n),null),a},useId:function(){var t=Fn(),n=Xe.identifierPrefix;if(Ue){var a=Oi,s=Ni;a=(s&~(1<<32-kt(s)-1)).toString(32)+a,n="«"+n+"R"+a,a=tl++,0<a&&(n+="H"+a.toString(32)),n+="»"}else a=f0++,n="«"+n+"r"+a.toString(32)+"»";return t.memoizedState=n},useHostTransitionStatus:Eu,useFormState:Gh,useActionState:Gh,useOptimistic:function(t){var n=Fn();n.memoizedState=n.baseState=t;var a={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return n.queue=a,n=Tu.bind(null,ve,!0,a),a.dispatch=n,[t,n]},useMemoCache:mu,useCacheRefresh:function(){return Fn().memoizedState=g0.bind(null,ve)}},up={readContext:Cn,use:el,useCallback:Jh,useContext:Cn,useEffect:Yh,useImperativeHandle:Qh,useInsertionEffect:jh,useLayoutEffect:Zh,useMemo:$h,useReducer:nl,useRef:Wh,useState:function(){return nl(Bi)},useDebugValue:xu,useDeferredValue:function(t,n){var a=on();return tp(a,ze.memoizedState,t,n)},useTransition:function(){var t=nl(Bi)[0],n=on().memoizedState;return[typeof t=="boolean"?t:Xs(t),n]},useSyncExternalStore:Ch,useId:ap,useHostTransitionStatus:Eu,useFormState:Vh,useActionState:Vh,useOptimistic:function(t,n){var a=on();return Ph(a,ze,t,n)},useMemoCache:mu,useCacheRefresh:rp},v0={readContext:Cn,use:el,useCallback:Jh,useContext:Cn,useEffect:Yh,useImperativeHandle:Qh,useInsertionEffect:jh,useLayoutEffect:Zh,useMemo:$h,useReducer:_u,useRef:Wh,useState:function(){return _u(Bi)},useDebugValue:xu,useDeferredValue:function(t,n){var a=on();return ze===null?Mu(a,t,n):tp(a,ze.memoizedState,t,n)},useTransition:function(){var t=_u(Bi)[0],n=on().memoizedState;return[typeof t=="boolean"?t:Xs(t),n]},useSyncExternalStore:Ch,useId:ap,useHostTransitionStatus:Eu,useFormState:Xh,useActionState:Xh,useOptimistic:function(t,n){var a=on();return ze!==null?Ph(a,ze,t,n):(a.baseState=t,[t,a.queue.dispatch])},useMemoCache:mu,useCacheRefresh:rp},Nr=null,Ys=0;function ol(t){var n=Ys;return Ys+=1,Nr===null&&(Nr=[]),Mh(Nr,t,n)}function js(t,n){n=n.props.ref,t.ref=n!==void 0?n:null}function ll(t,n){throw n.$$typeof===v?Error(r(525)):(t=Object.prototype.toString.call(n),Error(r(31,t==="[object Object]"?"object with keys {"+Object.keys(n).join(", ")+"}":t)))}function fp(t){var n=t._init;return n(t._payload)}function dp(t){function n(Y,V){if(t){var Z=Y.deletions;Z===null?(Y.deletions=[V],Y.flags|=16):Z.push(V)}}function a(Y,V){if(!t)return null;for(;V!==null;)n(Y,V),V=V.sibling;return null}function s(Y){for(var V=new Map;Y!==null;)Y.key!==null?V.set(Y.key,Y):V.set(Y.index,Y),Y=Y.sibling;return V}function c(Y,V){return Y=Ui(Y,V),Y.index=0,Y.sibling=null,Y}function f(Y,V,Z){return Y.index=Z,t?(Z=Y.alternate,Z!==null?(Z=Z.index,Z<V?(Y.flags|=67108866,V):Z):(Y.flags|=67108866,V)):(Y.flags|=1048576,V)}function M(Y){return t&&Y.alternate===null&&(Y.flags|=67108866),Y}function E(Y,V,Z,ht){return V===null||V.tag!==6?(V=Wc(Z,Y.mode,ht),V.return=Y,V):(V=c(V,Z),V.return=Y,V)}function z(Y,V,Z,ht){var Ht=Z.type;return Ht===b?dt(Y,V,Z.props.children,ht,Z.key):V!==null&&(V.elementType===Ht||typeof Ht=="object"&&Ht!==null&&Ht.$$typeof===mt&&fp(Ht)===V.type)?(V=c(V,Z.props),js(V,Z),V.return=Y,V):(V=Xo(Z.type,Z.key,Z.props,null,Y.mode,ht),js(V,Z),V.return=Y,V)}function K(Y,V,Z,ht){return V===null||V.tag!==4||V.stateNode.containerInfo!==Z.containerInfo||V.stateNode.implementation!==Z.implementation?(V=qc(Z,Y.mode,ht),V.return=Y,V):(V=c(V,Z.children||[]),V.return=Y,V)}function dt(Y,V,Z,ht,Ht){return V===null||V.tag!==7?(V=Va(Z,Y.mode,ht,Ht),V.return=Y,V):(V=c(V,Z),V.return=Y,V)}function gt(Y,V,Z){if(typeof V=="string"&&V!==""||typeof V=="number"||typeof V=="bigint")return V=Wc(""+V,Y.mode,Z),V.return=Y,V;if(typeof V=="object"&&V!==null){switch(V.$$typeof){case S:return Z=Xo(V.type,V.key,V.props,null,Y.mode,Z),js(Z,V),Z.return=Y,Z;case y:return V=qc(V,Y.mode,Z),V.return=Y,V;case mt:var ht=V._init;return V=ht(V._payload),gt(Y,V,Z)}if($(V)||lt(V))return V=Va(V,Y.mode,Z,null),V.return=Y,V;if(typeof V.then=="function")return gt(Y,ol(V),Z);if(V.$$typeof===D)return gt(Y,jo(Y,V),Z);ll(Y,V)}return null}function nt(Y,V,Z,ht){var Ht=V!==null?V.key:null;if(typeof Z=="string"&&Z!==""||typeof Z=="number"||typeof Z=="bigint")return Ht!==null?null:E(Y,V,""+Z,ht);if(typeof Z=="object"&&Z!==null){switch(Z.$$typeof){case S:return Z.key===Ht?z(Y,V,Z,ht):null;case y:return Z.key===Ht?K(Y,V,Z,ht):null;case mt:return Ht=Z._init,Z=Ht(Z._payload),nt(Y,V,Z,ht)}if($(Z)||lt(Z))return Ht!==null?null:dt(Y,V,Z,ht,null);if(typeof Z.then=="function")return nt(Y,V,ol(Z),ht);if(Z.$$typeof===D)return nt(Y,V,jo(Y,Z),ht);ll(Y,Z)}return null}function at(Y,V,Z,ht,Ht){if(typeof ht=="string"&&ht!==""||typeof ht=="number"||typeof ht=="bigint")return Y=Y.get(Z)||null,E(V,Y,""+ht,Ht);if(typeof ht=="object"&&ht!==null){switch(ht.$$typeof){case S:return Y=Y.get(ht.key===null?Z:ht.key)||null,z(V,Y,ht,Ht);case y:return Y=Y.get(ht.key===null?Z:ht.key)||null,K(V,Y,ht,Ht);case mt:var xe=ht._init;return ht=xe(ht._payload),at(Y,V,Z,ht,Ht)}if($(ht)||lt(ht))return Y=Y.get(Z)||null,dt(V,Y,ht,Ht,null);if(typeof ht.then=="function")return at(Y,V,Z,ol(ht),Ht);if(ht.$$typeof===D)return at(Y,V,Z,jo(V,ht),Ht);ll(V,ht)}return null}function se(Y,V,Z,ht){for(var Ht=null,xe=null,Yt=V,ne=V=0,_n=null;Yt!==null&&ne<Z.length;ne++){Yt.index>ne?(_n=Yt,Yt=null):_n=Yt.sibling;var De=nt(Y,Yt,Z[ne],ht);if(De===null){Yt===null&&(Yt=_n);break}t&&Yt&&De.alternate===null&&n(Y,Yt),V=f(De,V,ne),xe===null?Ht=De:xe.sibling=De,xe=De,Yt=_n}if(ne===Z.length)return a(Y,Yt),Ue&&Xa(Y,ne),Ht;if(Yt===null){for(;ne<Z.length;ne++)Yt=gt(Y,Z[ne],ht),Yt!==null&&(V=f(Yt,V,ne),xe===null?Ht=Yt:xe.sibling=Yt,xe=Yt);return Ue&&Xa(Y,ne),Ht}for(Yt=s(Yt);ne<Z.length;ne++)_n=at(Yt,Y,ne,Z[ne],ht),_n!==null&&(t&&_n.alternate!==null&&Yt.delete(_n.key===null?ne:_n.key),V=f(_n,V,ne),xe===null?Ht=_n:xe.sibling=_n,xe=_n);return t&&Yt.forEach(function(Ea){return n(Y,Ea)}),Ue&&Xa(Y,ne),Ht}function te(Y,V,Z,ht){if(Z==null)throw Error(r(151));for(var Ht=null,xe=null,Yt=V,ne=V=0,_n=null,De=Z.next();Yt!==null&&!De.done;ne++,De=Z.next()){Yt.index>ne?(_n=Yt,Yt=null):_n=Yt.sibling;var Ea=nt(Y,Yt,De.value,ht);if(Ea===null){Yt===null&&(Yt=_n);break}t&&Yt&&Ea.alternate===null&&n(Y,Yt),V=f(Ea,V,ne),xe===null?Ht=Ea:xe.sibling=Ea,xe=Ea,Yt=_n}if(De.done)return a(Y,Yt),Ue&&Xa(Y,ne),Ht;if(Yt===null){for(;!De.done;ne++,De=Z.next())De=gt(Y,De.value,ht),De!==null&&(V=f(De,V,ne),xe===null?Ht=De:xe.sibling=De,xe=De);return Ue&&Xa(Y,ne),Ht}for(Yt=s(Yt);!De.done;ne++,De=Z.next())De=at(Yt,Y,ne,De.value,ht),De!==null&&(t&&De.alternate!==null&&Yt.delete(De.key===null?ne:De.key),V=f(De,V,ne),xe===null?Ht=De:xe.sibling=De,xe=De);return t&&Yt.forEach(function(SS){return n(Y,SS)}),Ue&&Xa(Y,ne),Ht}function Ie(Y,V,Z,ht){if(typeof Z=="object"&&Z!==null&&Z.type===b&&Z.key===null&&(Z=Z.props.children),typeof Z=="object"&&Z!==null){switch(Z.$$typeof){case S:t:{for(var Ht=Z.key;V!==null;){if(V.key===Ht){if(Ht=Z.type,Ht===b){if(V.tag===7){a(Y,V.sibling),ht=c(V,Z.props.children),ht.return=Y,Y=ht;break t}}else if(V.elementType===Ht||typeof Ht=="object"&&Ht!==null&&Ht.$$typeof===mt&&fp(Ht)===V.type){a(Y,V.sibling),ht=c(V,Z.props),js(ht,Z),ht.return=Y,Y=ht;break t}a(Y,V);break}else n(Y,V);V=V.sibling}Z.type===b?(ht=Va(Z.props.children,Y.mode,ht,Z.key),ht.return=Y,Y=ht):(ht=Xo(Z.type,Z.key,Z.props,null,Y.mode,ht),js(ht,Z),ht.return=Y,Y=ht)}return M(Y);case y:t:{for(Ht=Z.key;V!==null;){if(V.key===Ht)if(V.tag===4&&V.stateNode.containerInfo===Z.containerInfo&&V.stateNode.implementation===Z.implementation){a(Y,V.sibling),ht=c(V,Z.children||[]),ht.return=Y,Y=ht;break t}else{a(Y,V);break}else n(Y,V);V=V.sibling}ht=qc(Z,Y.mode,ht),ht.return=Y,Y=ht}return M(Y);case mt:return Ht=Z._init,Z=Ht(Z._payload),Ie(Y,V,Z,ht)}if($(Z))return se(Y,V,Z,ht);if(lt(Z)){if(Ht=lt(Z),typeof Ht!="function")throw Error(r(150));return Z=Ht.call(Z),te(Y,V,Z,ht)}if(typeof Z.then=="function")return Ie(Y,V,ol(Z),ht);if(Z.$$typeof===D)return Ie(Y,V,jo(Y,Z),ht);ll(Y,Z)}return typeof Z=="string"&&Z!==""||typeof Z=="number"||typeof Z=="bigint"?(Z=""+Z,V!==null&&V.tag===6?(a(Y,V.sibling),ht=c(V,Z),ht.return=Y,Y=ht):(a(Y,V),ht=Wc(Z,Y.mode,ht),ht.return=Y,Y=ht),M(Y)):a(Y,V)}return function(Y,V,Z,ht){try{Ys=0;var Ht=Ie(Y,V,Z,ht);return Nr=null,Ht}catch(Yt){if(Yt===Is||Yt===Ko)throw Yt;var xe=jn(29,Yt,null,Y.mode);return xe.lanes=ht,xe.return=Y,xe}}}var Or=dp(!0),hp=dp(!1),li=k(null),Ai=null;function la(t){var n=t.alternate;B(dn,dn.current&1),B(li,t),Ai===null&&(n===null||Cr.current!==null||n.memoizedState!==null)&&(Ai=t)}function pp(t){if(t.tag===22){if(B(dn,dn.current),B(li,t),Ai===null){var n=t.alternate;n!==null&&n.memoizedState!==null&&(Ai=t)}}else ca()}function ca(){B(dn,dn.current),B(li,li.current)}function Ii(t){Q(li),Ai===t&&(Ai=null),Q(dn)}var dn=k(0);function cl(t){for(var n=t;n!==null;){if(n.tag===13){var a=n.memoizedState;if(a!==null&&(a=a.dehydrated,a===null||a.data==="$?"||mf(a)))return n}else if(n.tag===19&&n.memoizedProps.revealOrder!==void 0){if((n.flags&128)!==0)return n}else if(n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return null;n=n.return}n.sibling.return=n.return,n=n.sibling}return null}function bu(t,n,a,s){n=t.memoizedState,a=a(s,n),a=a==null?n:g({},n,a),t.memoizedState=a,t.lanes===0&&(t.updateQueue.baseState=a)}var Au={enqueueSetState:function(t,n,a){t=t._reactInternals;var s=Jn(),c=ra(s);c.payload=n,a!=null&&(c.callback=a),n=sa(t,c,s),n!==null&&($n(n,t,s),Hs(n,t,s))},enqueueReplaceState:function(t,n,a){t=t._reactInternals;var s=Jn(),c=ra(s);c.tag=1,c.payload=n,a!=null&&(c.callback=a),n=sa(t,c,s),n!==null&&($n(n,t,s),Hs(n,t,s))},enqueueForceUpdate:function(t,n){t=t._reactInternals;var a=Jn(),s=ra(a);s.tag=2,n!=null&&(s.callback=n),n=sa(t,s,a),n!==null&&($n(n,t,a),Hs(n,t,a))}};function mp(t,n,a,s,c,f,M){return t=t.stateNode,typeof t.shouldComponentUpdate=="function"?t.shouldComponentUpdate(s,f,M):n.prototype&&n.prototype.isPureReactComponent?!Ds(a,s)||!Ds(c,f):!0}function gp(t,n,a,s){t=n.state,typeof n.componentWillReceiveProps=="function"&&n.componentWillReceiveProps(a,s),typeof n.UNSAFE_componentWillReceiveProps=="function"&&n.UNSAFE_componentWillReceiveProps(a,s),n.state!==t&&Au.enqueueReplaceState(n,n.state,null)}function Qa(t,n){var a=n;if("ref"in n){a={};for(var s in n)s!=="ref"&&(a[s]=n[s])}if(t=t.defaultProps){a===n&&(a=g({},a));for(var c in t)a[c]===void 0&&(a[c]=t[c])}return a}var ul=typeof reportError=="function"?reportError:function(t){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var n=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof t=="object"&&t!==null&&typeof t.message=="string"?String(t.message):String(t),error:t});if(!window.dispatchEvent(n))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",t);return}console.error(t)};function _p(t){ul(t)}function vp(t){console.error(t)}function Sp(t){ul(t)}function fl(t,n){try{var a=t.onUncaughtError;a(n.value,{componentStack:n.stack})}catch(s){setTimeout(function(){throw s})}}function xp(t,n,a){try{var s=t.onCaughtError;s(a.value,{componentStack:a.stack,errorBoundary:n.tag===1?n.stateNode:null})}catch(c){setTimeout(function(){throw c})}}function Ru(t,n,a){return a=ra(a),a.tag=3,a.payload={element:null},a.callback=function(){fl(t,n)},a}function Mp(t){return t=ra(t),t.tag=3,t}function yp(t,n,a,s){var c=a.type.getDerivedStateFromError;if(typeof c=="function"){var f=s.value;t.payload=function(){return c(f)},t.callback=function(){xp(n,a,s)}}var M=a.stateNode;M!==null&&typeof M.componentDidCatch=="function"&&(t.callback=function(){xp(n,a,s),typeof c!="function"&&(ma===null?ma=new Set([this]):ma.add(this));var E=s.stack;this.componentDidCatch(s.value,{componentStack:E!==null?E:""})})}function S0(t,n,a,s,c){if(a.flags|=32768,s!==null&&typeof s=="object"&&typeof s.then=="function"){if(n=a.alternate,n!==null&&Ps(n,a,c,!0),a=li.current,a!==null){switch(a.tag){case 13:return Ai===null?Qu():a.alternate===null&&tn===0&&(tn=3),a.flags&=-257,a.flags|=65536,a.lanes=c,s===nu?a.flags|=16384:(n=a.updateQueue,n===null?a.updateQueue=new Set([s]):n.add(s),$u(t,s,c)),!1;case 22:return a.flags|=65536,s===nu?a.flags|=16384:(n=a.updateQueue,n===null?(n={transitions:null,markerInstances:null,retryQueue:new Set([s])},a.updateQueue=n):(a=n.retryQueue,a===null?n.retryQueue=new Set([s]):a.add(s)),$u(t,s,c)),!1}throw Error(r(435,a.tag))}return $u(t,s,c),Qu(),!1}if(Ue)return n=li.current,n!==null?((n.flags&65536)===0&&(n.flags|=256),n.flags|=65536,n.lanes=c,s!==Zc&&(t=Error(r(422),{cause:s}),Os(ai(t,a)))):(s!==Zc&&(n=Error(r(423),{cause:s}),Os(ai(n,a))),t=t.current.alternate,t.flags|=65536,c&=-c,t.lanes|=c,s=ai(s,a),c=Ru(t.stateNode,s,c),ru(t,c),tn!==4&&(tn=2)),!1;var f=Error(r(520),{cause:s});if(f=ai(f,a),eo===null?eo=[f]:eo.push(f),tn!==4&&(tn=2),n===null)return!0;s=ai(s,a),a=n;do{switch(a.tag){case 3:return a.flags|=65536,t=c&-c,a.lanes|=t,t=Ru(a.stateNode,s,t),ru(a,t),!1;case 1:if(n=a.type,f=a.stateNode,(a.flags&128)===0&&(typeof n.getDerivedStateFromError=="function"||f!==null&&typeof f.componentDidCatch=="function"&&(ma===null||!ma.has(f))))return a.flags|=65536,c&=-c,a.lanes|=c,c=Mp(c),yp(c,t,a,s),ru(a,c),!1}a=a.return}while(a!==null);return!1}var Ep=Error(r(461)),mn=!1;function yn(t,n,a,s){n.child=t===null?hp(n,null,a,s):Or(n,t.child,a,s)}function Tp(t,n,a,s,c){a=a.render;var f=n.ref;if("ref"in s){var M={};for(var E in s)E!=="ref"&&(M[E]=s[E])}else M=s;return ja(n),s=uu(t,n,a,M,f,c),E=fu(),t!==null&&!mn?(du(t,n,c),Fi(t,n,c)):(Ue&&E&&Yc(n),n.flags|=1,yn(t,n,s,c),n.child)}function bp(t,n,a,s,c){if(t===null){var f=a.type;return typeof f=="function"&&!Xc(f)&&f.defaultProps===void 0&&a.compare===null?(n.tag=15,n.type=f,Ap(t,n,f,s,c)):(t=Xo(a.type,null,s,n,n.mode,c),t.ref=n.ref,t.return=n,n.child=t)}if(f=t.child,!Pu(t,c)){var M=f.memoizedProps;if(a=a.compare,a=a!==null?a:Ds,a(M,s)&&t.ref===n.ref)return Fi(t,n,c)}return n.flags|=1,t=Ui(f,s),t.ref=n.ref,t.return=n,n.child=t}function Ap(t,n,a,s,c){if(t!==null){var f=t.memoizedProps;if(Ds(f,s)&&t.ref===n.ref)if(mn=!1,n.pendingProps=s=f,Pu(t,c))(t.flags&131072)!==0&&(mn=!0);else return n.lanes=t.lanes,Fi(t,n,c)}return wu(t,n,a,s,c)}function Rp(t,n,a){var s=n.pendingProps,c=s.children,f=t!==null?t.memoizedState:null;if(s.mode==="hidden"){if((n.flags&128)!==0){if(s=f!==null?f.baseLanes|a:a,t!==null){for(c=n.child=t.child,f=0;c!==null;)f=f|c.lanes|c.childLanes,c=c.sibling;n.childLanes=f&~s}else n.childLanes=0,n.child=null;return wp(t,n,s,a)}if((a&536870912)!==0)n.memoizedState={baseLanes:0,cachePool:null},t!==null&&Zo(n,f!==null?f.cachePool:null),f!==null?Ah(n,f):ou(),pp(n);else return n.lanes=n.childLanes=536870912,wp(t,n,f!==null?f.baseLanes|a:a,a)}else f!==null?(Zo(n,f.cachePool),Ah(n,f),ca(),n.memoizedState=null):(t!==null&&Zo(n,null),ou(),ca());return yn(t,n,c,a),n.child}function wp(t,n,a,s){var c=eu();return c=c===null?null:{parent:fn._currentValue,pool:c},n.memoizedState={baseLanes:a,cachePool:c},t!==null&&Zo(n,null),ou(),pp(n),t!==null&&Ps(t,n,s,!0),null}function dl(t,n){var a=n.ref;if(a===null)t!==null&&t.ref!==null&&(n.flags|=4194816);else{if(typeof a!="function"&&typeof a!="object")throw Error(r(284));(t===null||t.ref!==a)&&(n.flags|=4194816)}}function wu(t,n,a,s,c){return ja(n),a=uu(t,n,a,s,void 0,c),s=fu(),t!==null&&!mn?(du(t,n,c),Fi(t,n,c)):(Ue&&s&&Yc(n),n.flags|=1,yn(t,n,a,c),n.child)}function Cp(t,n,a,s,c,f){return ja(n),n.updateQueue=null,a=wh(n,s,a,c),Rh(t),s=fu(),t!==null&&!mn?(du(t,n,f),Fi(t,n,f)):(Ue&&s&&Yc(n),n.flags|=1,yn(t,n,a,f),n.child)}function Dp(t,n,a,s,c){if(ja(n),n.stateNode===null){var f=Tr,M=a.contextType;typeof M=="object"&&M!==null&&(f=Cn(M)),f=new a(s,f),n.memoizedState=f.state!==null&&f.state!==void 0?f.state:null,f.updater=Au,n.stateNode=f,f._reactInternals=n,f=n.stateNode,f.props=s,f.state=n.memoizedState,f.refs={},iu(n),M=a.contextType,f.context=typeof M=="object"&&M!==null?Cn(M):Tr,f.state=n.memoizedState,M=a.getDerivedStateFromProps,typeof M=="function"&&(bu(n,a,M,s),f.state=n.memoizedState),typeof a.getDerivedStateFromProps=="function"||typeof f.getSnapshotBeforeUpdate=="function"||typeof f.UNSAFE_componentWillMount!="function"&&typeof f.componentWillMount!="function"||(M=f.state,typeof f.componentWillMount=="function"&&f.componentWillMount(),typeof f.UNSAFE_componentWillMount=="function"&&f.UNSAFE_componentWillMount(),M!==f.state&&Au.enqueueReplaceState(f,f.state,null),Vs(n,s,f,c),Gs(),f.state=n.memoizedState),typeof f.componentDidMount=="function"&&(n.flags|=4194308),s=!0}else if(t===null){f=n.stateNode;var E=n.memoizedProps,z=Qa(a,E);f.props=z;var K=f.context,dt=a.contextType;M=Tr,typeof dt=="object"&&dt!==null&&(M=Cn(dt));var gt=a.getDerivedStateFromProps;dt=typeof gt=="function"||typeof f.getSnapshotBeforeUpdate=="function",E=n.pendingProps!==E,dt||typeof f.UNSAFE_componentWillReceiveProps!="function"&&typeof f.componentWillReceiveProps!="function"||(E||K!==M)&&gp(n,f,s,M),aa=!1;var nt=n.memoizedState;f.state=nt,Vs(n,s,f,c),Gs(),K=n.memoizedState,E||nt!==K||aa?(typeof gt=="function"&&(bu(n,a,gt,s),K=n.memoizedState),(z=aa||mp(n,a,z,s,nt,K,M))?(dt||typeof f.UNSAFE_componentWillMount!="function"&&typeof f.componentWillMount!="function"||(typeof f.componentWillMount=="function"&&f.componentWillMount(),typeof f.UNSAFE_componentWillMount=="function"&&f.UNSAFE_componentWillMount()),typeof f.componentDidMount=="function"&&(n.flags|=4194308)):(typeof f.componentDidMount=="function"&&(n.flags|=4194308),n.memoizedProps=s,n.memoizedState=K),f.props=s,f.state=K,f.context=M,s=z):(typeof f.componentDidMount=="function"&&(n.flags|=4194308),s=!1)}else{f=n.stateNode,au(t,n),M=n.memoizedProps,dt=Qa(a,M),f.props=dt,gt=n.pendingProps,nt=f.context,K=a.contextType,z=Tr,typeof K=="object"&&K!==null&&(z=Cn(K)),E=a.getDerivedStateFromProps,(K=typeof E=="function"||typeof f.getSnapshotBeforeUpdate=="function")||typeof f.UNSAFE_componentWillReceiveProps!="function"&&typeof f.componentWillReceiveProps!="function"||(M!==gt||nt!==z)&&gp(n,f,s,z),aa=!1,nt=n.memoizedState,f.state=nt,Vs(n,s,f,c),Gs();var at=n.memoizedState;M!==gt||nt!==at||aa||t!==null&&t.dependencies!==null&&Yo(t.dependencies)?(typeof E=="function"&&(bu(n,a,E,s),at=n.memoizedState),(dt=aa||mp(n,a,dt,s,nt,at,z)||t!==null&&t.dependencies!==null&&Yo(t.dependencies))?(K||typeof f.UNSAFE_componentWillUpdate!="function"&&typeof f.componentWillUpdate!="function"||(typeof f.componentWillUpdate=="function"&&f.componentWillUpdate(s,at,z),typeof f.UNSAFE_componentWillUpdate=="function"&&f.UNSAFE_componentWillUpdate(s,at,z)),typeof f.componentDidUpdate=="function"&&(n.flags|=4),typeof f.getSnapshotBeforeUpdate=="function"&&(n.flags|=1024)):(typeof f.componentDidUpdate!="function"||M===t.memoizedProps&&nt===t.memoizedState||(n.flags|=4),typeof f.getSnapshotBeforeUpdate!="function"||M===t.memoizedProps&&nt===t.memoizedState||(n.flags|=1024),n.memoizedProps=s,n.memoizedState=at),f.props=s,f.state=at,f.context=z,s=dt):(typeof f.componentDidUpdate!="function"||M===t.memoizedProps&&nt===t.memoizedState||(n.flags|=4),typeof f.getSnapshotBeforeUpdate!="function"||M===t.memoizedProps&&nt===t.memoizedState||(n.flags|=1024),s=!1)}return f=s,dl(t,n),s=(n.flags&128)!==0,f||s?(f=n.stateNode,a=s&&typeof a.getDerivedStateFromError!="function"?null:f.render(),n.flags|=1,t!==null&&s?(n.child=Or(n,t.child,null,c),n.child=Or(n,null,a,c)):yn(t,n,a,c),n.memoizedState=f.state,t=n.child):t=Fi(t,n,c),t}function Lp(t,n,a,s){return Ns(),n.flags|=256,yn(t,n,a,s),n.child}var Cu={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function Du(t){return{baseLanes:t,cachePool:vh()}}function Lu(t,n,a){return t=t!==null?t.childLanes&~a:0,n&&(t|=ci),t}function Up(t,n,a){var s=n.pendingProps,c=!1,f=(n.flags&128)!==0,M;if((M=f)||(M=t!==null&&t.memoizedState===null?!1:(dn.current&2)!==0),M&&(c=!0,n.flags&=-129),M=(n.flags&32)!==0,n.flags&=-33,t===null){if(Ue){if(c?la(n):ca(),Ue){var E=$e,z;if(z=E){t:{for(z=E,E=bi;z.nodeType!==8;){if(!E){E=null;break t}if(z=vi(z.nextSibling),z===null){E=null;break t}}E=z}E!==null?(n.memoizedState={dehydrated:E,treeContext:ka!==null?{id:Ni,overflow:Oi}:null,retryLane:536870912,hydrationErrors:null},z=jn(18,null,null,0),z.stateNode=E,z.return=n,n.child=z,On=n,$e=null,z=!0):z=!1}z||qa(n)}if(E=n.memoizedState,E!==null&&(E=E.dehydrated,E!==null))return mf(E)?n.lanes=32:n.lanes=536870912,null;Ii(n)}return E=s.children,s=s.fallback,c?(ca(),c=n.mode,E=hl({mode:"hidden",children:E},c),s=Va(s,c,a,null),E.return=n,s.return=n,E.sibling=s,n.child=E,c=n.child,c.memoizedState=Du(a),c.childLanes=Lu(t,M,a),n.memoizedState=Cu,s):(la(n),Uu(n,E))}if(z=t.memoizedState,z!==null&&(E=z.dehydrated,E!==null)){if(f)n.flags&256?(la(n),n.flags&=-257,n=Nu(t,n,a)):n.memoizedState!==null?(ca(),n.child=t.child,n.flags|=128,n=null):(ca(),c=s.fallback,E=n.mode,s=hl({mode:"visible",children:s.children},E),c=Va(c,E,a,null),c.flags|=2,s.return=n,c.return=n,s.sibling=c,n.child=s,Or(n,t.child,null,a),s=n.child,s.memoizedState=Du(a),s.childLanes=Lu(t,M,a),n.memoizedState=Cu,n=c);else if(la(n),mf(E)){if(M=E.nextSibling&&E.nextSibling.dataset,M)var K=M.dgst;M=K,s=Error(r(419)),s.stack="",s.digest=M,Os({value:s,source:null,stack:null}),n=Nu(t,n,a)}else if(mn||Ps(t,n,a,!1),M=(a&t.childLanes)!==0,mn||M){if(M=Xe,M!==null&&(s=a&-a,s=(s&42)!==0?1:Ce(s),s=(s&(M.suspendedLanes|a))!==0?0:s,s!==0&&s!==z.retryLane))throw z.retryLane=s,Er(t,s),$n(M,t,s),Ep;E.data==="$?"||Qu(),n=Nu(t,n,a)}else E.data==="$?"?(n.flags|=192,n.child=t.child,n=null):(t=z.treeContext,$e=vi(E.nextSibling),On=n,Ue=!0,Wa=null,bi=!1,t!==null&&(si[oi++]=Ni,si[oi++]=Oi,si[oi++]=ka,Ni=t.id,Oi=t.overflow,ka=n),n=Uu(n,s.children),n.flags|=4096);return n}return c?(ca(),c=s.fallback,E=n.mode,z=t.child,K=z.sibling,s=Ui(z,{mode:"hidden",children:s.children}),s.subtreeFlags=z.subtreeFlags&65011712,K!==null?c=Ui(K,c):(c=Va(c,E,a,null),c.flags|=2),c.return=n,s.return=n,s.sibling=c,n.child=s,s=c,c=n.child,E=t.child.memoizedState,E===null?E=Du(a):(z=E.cachePool,z!==null?(K=fn._currentValue,z=z.parent!==K?{parent:K,pool:K}:z):z=vh(),E={baseLanes:E.baseLanes|a,cachePool:z}),c.memoizedState=E,c.childLanes=Lu(t,M,a),n.memoizedState=Cu,s):(la(n),a=t.child,t=a.sibling,a=Ui(a,{mode:"visible",children:s.children}),a.return=n,a.sibling=null,t!==null&&(M=n.deletions,M===null?(n.deletions=[t],n.flags|=16):M.push(t)),n.child=a,n.memoizedState=null,a)}function Uu(t,n){return n=hl({mode:"visible",children:n},t.mode),n.return=t,t.child=n}function hl(t,n){return t=jn(22,t,null,n),t.lanes=0,t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null},t}function Nu(t,n,a){return Or(n,t.child,null,a),t=Uu(n,n.pendingProps.children),t.flags|=2,n.memoizedState=null,t}function Np(t,n,a){t.lanes|=n;var s=t.alternate;s!==null&&(s.lanes|=n),Qc(t.return,n,a)}function Ou(t,n,a,s,c){var f=t.memoizedState;f===null?t.memoizedState={isBackwards:n,rendering:null,renderingStartTime:0,last:s,tail:a,tailMode:c}:(f.isBackwards=n,f.rendering=null,f.renderingStartTime=0,f.last=s,f.tail=a,f.tailMode=c)}function Op(t,n,a){var s=n.pendingProps,c=s.revealOrder,f=s.tail;if(yn(t,n,s.children,a),s=dn.current,(s&2)!==0)s=s&1|2,n.flags|=128;else{if(t!==null&&(t.flags&128)!==0)t:for(t=n.child;t!==null;){if(t.tag===13)t.memoizedState!==null&&Np(t,a,n);else if(t.tag===19)Np(t,a,n);else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===n)break t;for(;t.sibling===null;){if(t.return===null||t.return===n)break t;t=t.return}t.sibling.return=t.return,t=t.sibling}s&=1}switch(B(dn,s),c){case"forwards":for(a=n.child,c=null;a!==null;)t=a.alternate,t!==null&&cl(t)===null&&(c=a),a=a.sibling;a=c,a===null?(c=n.child,n.child=null):(c=a.sibling,a.sibling=null),Ou(n,!1,c,a,f);break;case"backwards":for(a=null,c=n.child,n.child=null;c!==null;){if(t=c.alternate,t!==null&&cl(t)===null){n.child=c;break}t=c.sibling,c.sibling=a,a=c,c=t}Ou(n,!0,a,null,f);break;case"together":Ou(n,!1,null,null,void 0);break;default:n.memoizedState=null}return n.child}function Fi(t,n,a){if(t!==null&&(n.dependencies=t.dependencies),pa|=n.lanes,(a&n.childLanes)===0)if(t!==null){if(Ps(t,n,a,!1),(a&n.childLanes)===0)return null}else return null;if(t!==null&&n.child!==t.child)throw Error(r(153));if(n.child!==null){for(t=n.child,a=Ui(t,t.pendingProps),n.child=a,a.return=n;t.sibling!==null;)t=t.sibling,a=a.sibling=Ui(t,t.pendingProps),a.return=n;a.sibling=null}return n.child}function Pu(t,n){return(t.lanes&n)!==0?!0:(t=t.dependencies,!!(t!==null&&Yo(t)))}function x0(t,n,a){switch(n.tag){case 3:Pt(n,n.stateNode.containerInfo),ia(n,fn,t.memoizedState.cache),Ns();break;case 27:case 5:Kt(n);break;case 4:Pt(n,n.stateNode.containerInfo);break;case 10:ia(n,n.type,n.memoizedProps.value);break;case 13:var s=n.memoizedState;if(s!==null)return s.dehydrated!==null?(la(n),n.flags|=128,null):(a&n.child.childLanes)!==0?Up(t,n,a):(la(n),t=Fi(t,n,a),t!==null?t.sibling:null);la(n);break;case 19:var c=(t.flags&128)!==0;if(s=(a&n.childLanes)!==0,s||(Ps(t,n,a,!1),s=(a&n.childLanes)!==0),c){if(s)return Op(t,n,a);n.flags|=128}if(c=n.memoizedState,c!==null&&(c.rendering=null,c.tail=null,c.lastEffect=null),B(dn,dn.current),s)break;return null;case 22:case 23:return n.lanes=0,Rp(t,n,a);case 24:ia(n,fn,t.memoizedState.cache)}return Fi(t,n,a)}function Pp(t,n,a){if(t!==null)if(t.memoizedProps!==n.pendingProps)mn=!0;else{if(!Pu(t,a)&&(n.flags&128)===0)return mn=!1,x0(t,n,a);mn=(t.flags&131072)!==0}else mn=!1,Ue&&(n.flags&1048576)!==0&&fh(n,qo,n.index);switch(n.lanes=0,n.tag){case 16:t:{t=n.pendingProps;var s=n.elementType,c=s._init;if(s=c(s._payload),n.type=s,typeof s=="function")Xc(s)?(t=Qa(s,t),n.tag=1,n=Dp(null,n,s,t,a)):(n.tag=0,n=wu(null,n,s,t,a));else{if(s!=null){if(c=s.$$typeof,c===P){n.tag=11,n=Tp(null,n,s,t,a);break t}else if(c===I){n.tag=14,n=bp(null,n,s,t,a);break t}}throw n=X(s)||s,Error(r(306,n,""))}}return n;case 0:return wu(t,n,n.type,n.pendingProps,a);case 1:return s=n.type,c=Qa(s,n.pendingProps),Dp(t,n,s,c,a);case 3:t:{if(Pt(n,n.stateNode.containerInfo),t===null)throw Error(r(387));s=n.pendingProps;var f=n.memoizedState;c=f.element,au(t,n),Vs(n,s,null,a);var M=n.memoizedState;if(s=M.cache,ia(n,fn,s),s!==f.cache&&Jc(n,[fn],a,!0),Gs(),s=M.element,f.isDehydrated)if(f={element:s,isDehydrated:!1,cache:M.cache},n.updateQueue.baseState=f,n.memoizedState=f,n.flags&256){n=Lp(t,n,s,a);break t}else if(s!==c){c=ai(Error(r(424)),n),Os(c),n=Lp(t,n,s,a);break t}else for(t=n.stateNode.containerInfo,t.nodeType===9?t=t.body:t=t.nodeName==="HTML"?t.ownerDocument.body:t,$e=vi(t.firstChild),On=n,Ue=!0,Wa=null,bi=!0,a=hp(n,null,s,a),n.child=a;a;)a.flags=a.flags&-3|4096,a=a.sibling;else{if(Ns(),s===c){n=Fi(t,n,a);break t}yn(t,n,s,a)}n=n.child}return n;case 26:return dl(t,n),t===null?(a=Fm(n.type,null,n.pendingProps,null))?n.memoizedState=a:Ue||(a=n.type,t=n.pendingProps,s=Rl(pt.current).createElement(a),s[Bt]=n,s[le]=t,Tn(s,a,t),W(s),n.stateNode=s):n.memoizedState=Fm(n.type,t.memoizedProps,n.pendingProps,t.memoizedState),null;case 27:return Kt(n),t===null&&Ue&&(s=n.stateNode=zm(n.type,n.pendingProps,pt.current),On=n,bi=!0,c=$e,va(n.type)?(gf=c,$e=vi(s.firstChild)):$e=c),yn(t,n,n.pendingProps.children,a),dl(t,n),t===null&&(n.flags|=4194304),n.child;case 5:return t===null&&Ue&&((c=s=$e)&&(s=j0(s,n.type,n.pendingProps,bi),s!==null?(n.stateNode=s,On=n,$e=vi(s.firstChild),bi=!1,c=!0):c=!1),c||qa(n)),Kt(n),c=n.type,f=n.pendingProps,M=t!==null?t.memoizedProps:null,s=f.children,df(c,f)?s=null:M!==null&&df(c,M)&&(n.flags|=32),n.memoizedState!==null&&(c=uu(t,n,d0,null,null,a),uo._currentValue=c),dl(t,n),yn(t,n,s,a),n.child;case 6:return t===null&&Ue&&((t=a=$e)&&(a=Z0(a,n.pendingProps,bi),a!==null?(n.stateNode=a,On=n,$e=null,t=!0):t=!1),t||qa(n)),null;case 13:return Up(t,n,a);case 4:return Pt(n,n.stateNode.containerInfo),s=n.pendingProps,t===null?n.child=Or(n,null,s,a):yn(t,n,s,a),n.child;case 11:return Tp(t,n,n.type,n.pendingProps,a);case 7:return yn(t,n,n.pendingProps,a),n.child;case 8:return yn(t,n,n.pendingProps.children,a),n.child;case 12:return yn(t,n,n.pendingProps.children,a),n.child;case 10:return s=n.pendingProps,ia(n,n.type,s.value),yn(t,n,s.children,a),n.child;case 9:return c=n.type._context,s=n.pendingProps.children,ja(n),c=Cn(c),s=s(c),n.flags|=1,yn(t,n,s,a),n.child;case 14:return bp(t,n,n.type,n.pendingProps,a);case 15:return Ap(t,n,n.type,n.pendingProps,a);case 19:return Op(t,n,a);case 31:return s=n.pendingProps,a=n.mode,s={mode:s.mode,children:s.children},t===null?(a=hl(s,a),a.ref=n.ref,n.child=a,a.return=n,n=a):(a=Ui(t.child,s),a.ref=n.ref,n.child=a,a.return=n,n=a),n;case 22:return Rp(t,n,a);case 24:return ja(n),s=Cn(fn),t===null?(c=eu(),c===null&&(c=Xe,f=$c(),c.pooledCache=f,f.refCount++,f!==null&&(c.pooledCacheLanes|=a),c=f),n.memoizedState={parent:s,cache:c},iu(n),ia(n,fn,c)):((t.lanes&a)!==0&&(au(t,n),Vs(n,null,null,a),Gs()),c=t.memoizedState,f=n.memoizedState,c.parent!==s?(c={parent:s,cache:s},n.memoizedState=c,n.lanes===0&&(n.memoizedState=n.updateQueue.baseState=c),ia(n,fn,s)):(s=f.cache,ia(n,fn,s),s!==c.cache&&Jc(n,[fn],a,!0))),yn(t,n,n.pendingProps.children,a),n.child;case 29:throw n.pendingProps}throw Error(r(156,n.tag))}function Hi(t){t.flags|=4}function zp(t,n){if(n.type!=="stylesheet"||(n.state.loading&4)!==0)t.flags&=-16777217;else if(t.flags|=16777216,!Xm(n)){if(n=li.current,n!==null&&((Re&4194048)===Re?Ai!==null:(Re&62914560)!==Re&&(Re&536870912)===0||n!==Ai))throw Fs=nu,Sh;t.flags|=8192}}function pl(t,n){n!==null&&(t.flags|=4),t.flags&16384&&(n=t.tag!==22?bt():536870912,t.lanes|=n,Ir|=n)}function Zs(t,n){if(!Ue)switch(t.tailMode){case"hidden":n=t.tail;for(var a=null;n!==null;)n.alternate!==null&&(a=n),n=n.sibling;a===null?t.tail=null:a.sibling=null;break;case"collapsed":a=t.tail;for(var s=null;a!==null;)a.alternate!==null&&(s=a),a=a.sibling;s===null?n||t.tail===null?t.tail=null:t.tail.sibling=null:s.sibling=null}}function Je(t){var n=t.alternate!==null&&t.alternate.child===t.child,a=0,s=0;if(n)for(var c=t.child;c!==null;)a|=c.lanes|c.childLanes,s|=c.subtreeFlags&65011712,s|=c.flags&65011712,c.return=t,c=c.sibling;else for(c=t.child;c!==null;)a|=c.lanes|c.childLanes,s|=c.subtreeFlags,s|=c.flags,c.return=t,c=c.sibling;return t.subtreeFlags|=s,t.childLanes=a,n}function M0(t,n,a){var s=n.pendingProps;switch(jc(n),n.tag){case 31:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Je(n),null;case 1:return Je(n),null;case 3:return a=n.stateNode,s=null,t!==null&&(s=t.memoizedState.cache),n.memoizedState.cache!==s&&(n.flags|=2048),zi(fn),jt(),a.pendingContext&&(a.context=a.pendingContext,a.pendingContext=null),(t===null||t.child===null)&&(Us(n)?Hi(n):t===null||t.memoizedState.isDehydrated&&(n.flags&256)===0||(n.flags|=1024,ph())),Je(n),null;case 26:return a=n.memoizedState,t===null?(Hi(n),a!==null?(Je(n),zp(n,a)):(Je(n),n.flags&=-16777217)):a?a!==t.memoizedState?(Hi(n),Je(n),zp(n,a)):(Je(n),n.flags&=-16777217):(t.memoizedProps!==s&&Hi(n),Je(n),n.flags&=-16777217),null;case 27:oe(n),a=pt.current;var c=n.type;if(t!==null&&n.stateNode!=null)t.memoizedProps!==s&&Hi(n);else{if(!s){if(n.stateNode===null)throw Error(r(166));return Je(n),null}t=J.current,Us(n)?dh(n):(t=zm(c,s,a),n.stateNode=t,Hi(n))}return Je(n),null;case 5:if(oe(n),a=n.type,t!==null&&n.stateNode!=null)t.memoizedProps!==s&&Hi(n);else{if(!s){if(n.stateNode===null)throw Error(r(166));return Je(n),null}if(t=J.current,Us(n))dh(n);else{switch(c=Rl(pt.current),t){case 1:t=c.createElementNS("http://www.w3.org/2000/svg",a);break;case 2:t=c.createElementNS("http://www.w3.org/1998/Math/MathML",a);break;default:switch(a){case"svg":t=c.createElementNS("http://www.w3.org/2000/svg",a);break;case"math":t=c.createElementNS("http://www.w3.org/1998/Math/MathML",a);break;case"script":t=c.createElement("div"),t.innerHTML="<script><\/script>",t=t.removeChild(t.firstChild);break;case"select":t=typeof s.is=="string"?c.createElement("select",{is:s.is}):c.createElement("select"),s.multiple?t.multiple=!0:s.size&&(t.size=s.size);break;default:t=typeof s.is=="string"?c.createElement(a,{is:s.is}):c.createElement(a)}}t[Bt]=n,t[le]=s;t:for(c=n.child;c!==null;){if(c.tag===5||c.tag===6)t.appendChild(c.stateNode);else if(c.tag!==4&&c.tag!==27&&c.child!==null){c.child.return=c,c=c.child;continue}if(c===n)break t;for(;c.sibling===null;){if(c.return===null||c.return===n)break t;c=c.return}c.sibling.return=c.return,c=c.sibling}n.stateNode=t;t:switch(Tn(t,a,s),a){case"button":case"input":case"select":case"textarea":t=!!s.autoFocus;break t;case"img":t=!0;break t;default:t=!1}t&&Hi(n)}}return Je(n),n.flags&=-16777217,null;case 6:if(t&&n.stateNode!=null)t.memoizedProps!==s&&Hi(n);else{if(typeof s!="string"&&n.stateNode===null)throw Error(r(166));if(t=pt.current,Us(n)){if(t=n.stateNode,a=n.memoizedProps,s=null,c=On,c!==null)switch(c.tag){case 27:case 5:s=c.memoizedProps}t[Bt]=n,t=!!(t.nodeValue===a||s!==null&&s.suppressHydrationWarning===!0||Cm(t.nodeValue,a)),t||qa(n)}else t=Rl(t).createTextNode(s),t[Bt]=n,n.stateNode=t}return Je(n),null;case 13:if(s=n.memoizedState,t===null||t.memoizedState!==null&&t.memoizedState.dehydrated!==null){if(c=Us(n),s!==null&&s.dehydrated!==null){if(t===null){if(!c)throw Error(r(318));if(c=n.memoizedState,c=c!==null?c.dehydrated:null,!c)throw Error(r(317));c[Bt]=n}else Ns(),(n.flags&128)===0&&(n.memoizedState=null),n.flags|=4;Je(n),c=!1}else c=ph(),t!==null&&t.memoizedState!==null&&(t.memoizedState.hydrationErrors=c),c=!0;if(!c)return n.flags&256?(Ii(n),n):(Ii(n),null)}if(Ii(n),(n.flags&128)!==0)return n.lanes=a,n;if(a=s!==null,t=t!==null&&t.memoizedState!==null,a){s=n.child,c=null,s.alternate!==null&&s.alternate.memoizedState!==null&&s.alternate.memoizedState.cachePool!==null&&(c=s.alternate.memoizedState.cachePool.pool);var f=null;s.memoizedState!==null&&s.memoizedState.cachePool!==null&&(f=s.memoizedState.cachePool.pool),f!==c&&(s.flags|=2048)}return a!==t&&a&&(n.child.flags|=8192),pl(n,n.updateQueue),Je(n),null;case 4:return jt(),t===null&&of(n.stateNode.containerInfo),Je(n),null;case 10:return zi(n.type),Je(n),null;case 19:if(Q(dn),c=n.memoizedState,c===null)return Je(n),null;if(s=(n.flags&128)!==0,f=c.rendering,f===null)if(s)Zs(c,!1);else{if(tn!==0||t!==null&&(t.flags&128)!==0)for(t=n.child;t!==null;){if(f=cl(t),f!==null){for(n.flags|=128,Zs(c,!1),t=f.updateQueue,n.updateQueue=t,pl(n,t),n.subtreeFlags=0,t=a,a=n.child;a!==null;)uh(a,t),a=a.sibling;return B(dn,dn.current&1|2),n.child}t=t.sibling}c.tail!==null&&Se()>_l&&(n.flags|=128,s=!0,Zs(c,!1),n.lanes=4194304)}else{if(!s)if(t=cl(f),t!==null){if(n.flags|=128,s=!0,t=t.updateQueue,n.updateQueue=t,pl(n,t),Zs(c,!0),c.tail===null&&c.tailMode==="hidden"&&!f.alternate&&!Ue)return Je(n),null}else 2*Se()-c.renderingStartTime>_l&&a!==536870912&&(n.flags|=128,s=!0,Zs(c,!1),n.lanes=4194304);c.isBackwards?(f.sibling=n.child,n.child=f):(t=c.last,t!==null?t.sibling=f:n.child=f,c.last=f)}return c.tail!==null?(n=c.tail,c.rendering=n,c.tail=n.sibling,c.renderingStartTime=Se(),n.sibling=null,t=dn.current,B(dn,s?t&1|2:t&1),n):(Je(n),null);case 22:case 23:return Ii(n),lu(),s=n.memoizedState!==null,t!==null?t.memoizedState!==null!==s&&(n.flags|=8192):s&&(n.flags|=8192),s?(a&536870912)!==0&&(n.flags&128)===0&&(Je(n),n.subtreeFlags&6&&(n.flags|=8192)):Je(n),a=n.updateQueue,a!==null&&pl(n,a.retryQueue),a=null,t!==null&&t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(a=t.memoizedState.cachePool.pool),s=null,n.memoizedState!==null&&n.memoizedState.cachePool!==null&&(s=n.memoizedState.cachePool.pool),s!==a&&(n.flags|=2048),t!==null&&Q(Za),null;case 24:return a=null,t!==null&&(a=t.memoizedState.cache),n.memoizedState.cache!==a&&(n.flags|=2048),zi(fn),Je(n),null;case 25:return null;case 30:return null}throw Error(r(156,n.tag))}function y0(t,n){switch(jc(n),n.tag){case 1:return t=n.flags,t&65536?(n.flags=t&-65537|128,n):null;case 3:return zi(fn),jt(),t=n.flags,(t&65536)!==0&&(t&128)===0?(n.flags=t&-65537|128,n):null;case 26:case 27:case 5:return oe(n),null;case 13:if(Ii(n),t=n.memoizedState,t!==null&&t.dehydrated!==null){if(n.alternate===null)throw Error(r(340));Ns()}return t=n.flags,t&65536?(n.flags=t&-65537|128,n):null;case 19:return Q(dn),null;case 4:return jt(),null;case 10:return zi(n.type),null;case 22:case 23:return Ii(n),lu(),t!==null&&Q(Za),t=n.flags,t&65536?(n.flags=t&-65537|128,n):null;case 24:return zi(fn),null;case 25:return null;default:return null}}function Bp(t,n){switch(jc(n),n.tag){case 3:zi(fn),jt();break;case 26:case 27:case 5:oe(n);break;case 4:jt();break;case 13:Ii(n);break;case 19:Q(dn);break;case 10:zi(n.type);break;case 22:case 23:Ii(n),lu(),t!==null&&Q(Za);break;case 24:zi(fn)}}function Ks(t,n){try{var a=n.updateQueue,s=a!==null?a.lastEffect:null;if(s!==null){var c=s.next;a=c;do{if((a.tag&t)===t){s=void 0;var f=a.create,M=a.inst;s=f(),M.destroy=s}a=a.next}while(a!==c)}}catch(E){ke(n,n.return,E)}}function ua(t,n,a){try{var s=n.updateQueue,c=s!==null?s.lastEffect:null;if(c!==null){var f=c.next;s=f;do{if((s.tag&t)===t){var M=s.inst,E=M.destroy;if(E!==void 0){M.destroy=void 0,c=n;var z=a,K=E;try{K()}catch(dt){ke(c,z,dt)}}}s=s.next}while(s!==f)}}catch(dt){ke(n,n.return,dt)}}function Ip(t){var n=t.updateQueue;if(n!==null){var a=t.stateNode;try{bh(n,a)}catch(s){ke(t,t.return,s)}}}function Fp(t,n,a){a.props=Qa(t.type,t.memoizedProps),a.state=t.memoizedState;try{a.componentWillUnmount()}catch(s){ke(t,n,s)}}function Qs(t,n){try{var a=t.ref;if(a!==null){switch(t.tag){case 26:case 27:case 5:var s=t.stateNode;break;case 30:s=t.stateNode;break;default:s=t.stateNode}typeof a=="function"?t.refCleanup=a(s):a.current=s}}catch(c){ke(t,n,c)}}function Ri(t,n){var a=t.ref,s=t.refCleanup;if(a!==null)if(typeof s=="function")try{s()}catch(c){ke(t,n,c)}finally{t.refCleanup=null,t=t.alternate,t!=null&&(t.refCleanup=null)}else if(typeof a=="function")try{a(null)}catch(c){ke(t,n,c)}else a.current=null}function Hp(t){var n=t.type,a=t.memoizedProps,s=t.stateNode;try{t:switch(n){case"button":case"input":case"select":case"textarea":a.autoFocus&&s.focus();break t;case"img":a.src?s.src=a.src:a.srcSet&&(s.srcset=a.srcSet)}}catch(c){ke(t,t.return,c)}}function zu(t,n,a){try{var s=t.stateNode;k0(s,t.type,a,n),s[le]=n}catch(c){ke(t,t.return,c)}}function Gp(t){return t.tag===5||t.tag===3||t.tag===26||t.tag===27&&va(t.type)||t.tag===4}function Bu(t){t:for(;;){for(;t.sibling===null;){if(t.return===null||Gp(t.return))return null;t=t.return}for(t.sibling.return=t.return,t=t.sibling;t.tag!==5&&t.tag!==6&&t.tag!==18;){if(t.tag===27&&va(t.type)||t.flags&2||t.child===null||t.tag===4)continue t;t.child.return=t,t=t.child}if(!(t.flags&2))return t.stateNode}}function Iu(t,n,a){var s=t.tag;if(s===5||s===6)t=t.stateNode,n?(a.nodeType===9?a.body:a.nodeName==="HTML"?a.ownerDocument.body:a).insertBefore(t,n):(n=a.nodeType===9?a.body:a.nodeName==="HTML"?a.ownerDocument.body:a,n.appendChild(t),a=a._reactRootContainer,a!=null||n.onclick!==null||(n.onclick=Al));else if(s!==4&&(s===27&&va(t.type)&&(a=t.stateNode,n=null),t=t.child,t!==null))for(Iu(t,n,a),t=t.sibling;t!==null;)Iu(t,n,a),t=t.sibling}function ml(t,n,a){var s=t.tag;if(s===5||s===6)t=t.stateNode,n?a.insertBefore(t,n):a.appendChild(t);else if(s!==4&&(s===27&&va(t.type)&&(a=t.stateNode),t=t.child,t!==null))for(ml(t,n,a),t=t.sibling;t!==null;)ml(t,n,a),t=t.sibling}function Vp(t){var n=t.stateNode,a=t.memoizedProps;try{for(var s=t.type,c=n.attributes;c.length;)n.removeAttributeNode(c[0]);Tn(n,s,a),n[Bt]=t,n[le]=a}catch(f){ke(t,t.return,f)}}var Gi=!1,an=!1,Fu=!1,kp=typeof WeakSet=="function"?WeakSet:Set,gn=null;function E0(t,n){if(t=t.containerInfo,uf=Nl,t=th(t),Bc(t)){if("selectionStart"in t)var a={start:t.selectionStart,end:t.selectionEnd};else t:{a=(a=t.ownerDocument)&&a.defaultView||window;var s=a.getSelection&&a.getSelection();if(s&&s.rangeCount!==0){a=s.anchorNode;var c=s.anchorOffset,f=s.focusNode;s=s.focusOffset;try{a.nodeType,f.nodeType}catch{a=null;break t}var M=0,E=-1,z=-1,K=0,dt=0,gt=t,nt=null;e:for(;;){for(var at;gt!==a||c!==0&&gt.nodeType!==3||(E=M+c),gt!==f||s!==0&&gt.nodeType!==3||(z=M+s),gt.nodeType===3&&(M+=gt.nodeValue.length),(at=gt.firstChild)!==null;)nt=gt,gt=at;for(;;){if(gt===t)break e;if(nt===a&&++K===c&&(E=M),nt===f&&++dt===s&&(z=M),(at=gt.nextSibling)!==null)break;gt=nt,nt=gt.parentNode}gt=at}a=E===-1||z===-1?null:{start:E,end:z}}else a=null}a=a||{start:0,end:0}}else a=null;for(ff={focusedElem:t,selectionRange:a},Nl=!1,gn=n;gn!==null;)if(n=gn,t=n.child,(n.subtreeFlags&1024)!==0&&t!==null)t.return=n,gn=t;else for(;gn!==null;){switch(n=gn,f=n.alternate,t=n.flags,n.tag){case 0:break;case 11:case 15:break;case 1:if((t&1024)!==0&&f!==null){t=void 0,a=n,c=f.memoizedProps,f=f.memoizedState,s=a.stateNode;try{var se=Qa(a.type,c,a.elementType===a.type);t=s.getSnapshotBeforeUpdate(se,f),s.__reactInternalSnapshotBeforeUpdate=t}catch(te){ke(a,a.return,te)}}break;case 3:if((t&1024)!==0){if(t=n.stateNode.containerInfo,a=t.nodeType,a===9)pf(t);else if(a===1)switch(t.nodeName){case"HEAD":case"HTML":case"BODY":pf(t);break;default:t.textContent=""}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;default:if((t&1024)!==0)throw Error(r(163))}if(t=n.sibling,t!==null){t.return=n.return,gn=t;break}gn=n.return}}function Xp(t,n,a){var s=a.flags;switch(a.tag){case 0:case 11:case 15:fa(t,a),s&4&&Ks(5,a);break;case 1:if(fa(t,a),s&4)if(t=a.stateNode,n===null)try{t.componentDidMount()}catch(M){ke(a,a.return,M)}else{var c=Qa(a.type,n.memoizedProps);n=n.memoizedState;try{t.componentDidUpdate(c,n,t.__reactInternalSnapshotBeforeUpdate)}catch(M){ke(a,a.return,M)}}s&64&&Ip(a),s&512&&Qs(a,a.return);break;case 3:if(fa(t,a),s&64&&(t=a.updateQueue,t!==null)){if(n=null,a.child!==null)switch(a.child.tag){case 27:case 5:n=a.child.stateNode;break;case 1:n=a.child.stateNode}try{bh(t,n)}catch(M){ke(a,a.return,M)}}break;case 27:n===null&&s&4&&Vp(a);case 26:case 5:fa(t,a),n===null&&s&4&&Hp(a),s&512&&Qs(a,a.return);break;case 12:fa(t,a);break;case 13:fa(t,a),s&4&&Yp(t,a),s&64&&(t=a.memoizedState,t!==null&&(t=t.dehydrated,t!==null&&(a=U0.bind(null,a),K0(t,a))));break;case 22:if(s=a.memoizedState!==null||Gi,!s){n=n!==null&&n.memoizedState!==null||an,c=Gi;var f=an;Gi=s,(an=n)&&!f?da(t,a,(a.subtreeFlags&8772)!==0):fa(t,a),Gi=c,an=f}break;case 30:break;default:fa(t,a)}}function Wp(t){var n=t.alternate;n!==null&&(t.alternate=null,Wp(n)),t.child=null,t.deletions=null,t.sibling=null,t.tag===5&&(n=t.stateNode,n!==null&&Rn(n)),t.stateNode=null,t.return=null,t.dependencies=null,t.memoizedProps=null,t.memoizedState=null,t.pendingProps=null,t.stateNode=null,t.updateQueue=null}var Qe=null,Hn=!1;function Vi(t,n,a){for(a=a.child;a!==null;)qp(t,n,a),a=a.sibling}function qp(t,n,a){if(Dt&&typeof Dt.onCommitFiberUnmount=="function")try{Dt.onCommitFiberUnmount(Tt,a)}catch{}switch(a.tag){case 26:an||Ri(a,n),Vi(t,n,a),a.memoizedState?a.memoizedState.count--:a.stateNode&&(a=a.stateNode,a.parentNode.removeChild(a));break;case 27:an||Ri(a,n);var s=Qe,c=Hn;va(a.type)&&(Qe=a.stateNode,Hn=!1),Vi(t,n,a),so(a.stateNode),Qe=s,Hn=c;break;case 5:an||Ri(a,n);case 6:if(s=Qe,c=Hn,Qe=null,Vi(t,n,a),Qe=s,Hn=c,Qe!==null)if(Hn)try{(Qe.nodeType===9?Qe.body:Qe.nodeName==="HTML"?Qe.ownerDocument.body:Qe).removeChild(a.stateNode)}catch(f){ke(a,n,f)}else try{Qe.removeChild(a.stateNode)}catch(f){ke(a,n,f)}break;case 18:Qe!==null&&(Hn?(t=Qe,Om(t.nodeType===9?t.body:t.nodeName==="HTML"?t.ownerDocument.body:t,a.stateNode),mo(t)):Om(Qe,a.stateNode));break;case 4:s=Qe,c=Hn,Qe=a.stateNode.containerInfo,Hn=!0,Vi(t,n,a),Qe=s,Hn=c;break;case 0:case 11:case 14:case 15:an||ua(2,a,n),an||ua(4,a,n),Vi(t,n,a);break;case 1:an||(Ri(a,n),s=a.stateNode,typeof s.componentWillUnmount=="function"&&Fp(a,n,s)),Vi(t,n,a);break;case 21:Vi(t,n,a);break;case 22:an=(s=an)||a.memoizedState!==null,Vi(t,n,a),an=s;break;default:Vi(t,n,a)}}function Yp(t,n){if(n.memoizedState===null&&(t=n.alternate,t!==null&&(t=t.memoizedState,t!==null&&(t=t.dehydrated,t!==null))))try{mo(t)}catch(a){ke(n,n.return,a)}}function T0(t){switch(t.tag){case 13:case 19:var n=t.stateNode;return n===null&&(n=t.stateNode=new kp),n;case 22:return t=t.stateNode,n=t._retryCache,n===null&&(n=t._retryCache=new kp),n;default:throw Error(r(435,t.tag))}}function Hu(t,n){var a=T0(t);n.forEach(function(s){var c=N0.bind(null,t,s);a.has(s)||(a.add(s),s.then(c,c))})}function Zn(t,n){var a=n.deletions;if(a!==null)for(var s=0;s<a.length;s++){var c=a[s],f=t,M=n,E=M;t:for(;E!==null;){switch(E.tag){case 27:if(va(E.type)){Qe=E.stateNode,Hn=!1;break t}break;case 5:Qe=E.stateNode,Hn=!1;break t;case 3:case 4:Qe=E.stateNode.containerInfo,Hn=!0;break t}E=E.return}if(Qe===null)throw Error(r(160));qp(f,M,c),Qe=null,Hn=!1,f=c.alternate,f!==null&&(f.return=null),c.return=null}if(n.subtreeFlags&13878)for(n=n.child;n!==null;)jp(n,t),n=n.sibling}var _i=null;function jp(t,n){var a=t.alternate,s=t.flags;switch(t.tag){case 0:case 11:case 14:case 15:Zn(n,t),Kn(t),s&4&&(ua(3,t,t.return),Ks(3,t),ua(5,t,t.return));break;case 1:Zn(n,t),Kn(t),s&512&&(an||a===null||Ri(a,a.return)),s&64&&Gi&&(t=t.updateQueue,t!==null&&(s=t.callbacks,s!==null&&(a=t.shared.hiddenCallbacks,t.shared.hiddenCallbacks=a===null?s:a.concat(s))));break;case 26:var c=_i;if(Zn(n,t),Kn(t),s&512&&(an||a===null||Ri(a,a.return)),s&4){var f=a!==null?a.memoizedState:null;if(s=t.memoizedState,a===null)if(s===null)if(t.stateNode===null){t:{s=t.type,a=t.memoizedProps,c=c.ownerDocument||c;e:switch(s){case"title":f=c.getElementsByTagName("title")[0],(!f||f[xn]||f[Bt]||f.namespaceURI==="http://www.w3.org/2000/svg"||f.hasAttribute("itemprop"))&&(f=c.createElement(s),c.head.insertBefore(f,c.querySelector("head > title"))),Tn(f,s,a),f[Bt]=t,W(f),s=f;break t;case"link":var M=Vm("link","href",c).get(s+(a.href||""));if(M){for(var E=0;E<M.length;E++)if(f=M[E],f.getAttribute("href")===(a.href==null||a.href===""?null:a.href)&&f.getAttribute("rel")===(a.rel==null?null:a.rel)&&f.getAttribute("title")===(a.title==null?null:a.title)&&f.getAttribute("crossorigin")===(a.crossOrigin==null?null:a.crossOrigin)){M.splice(E,1);break e}}f=c.createElement(s),Tn(f,s,a),c.head.appendChild(f);break;case"meta":if(M=Vm("meta","content",c).get(s+(a.content||""))){for(E=0;E<M.length;E++)if(f=M[E],f.getAttribute("content")===(a.content==null?null:""+a.content)&&f.getAttribute("name")===(a.name==null?null:a.name)&&f.getAttribute("property")===(a.property==null?null:a.property)&&f.getAttribute("http-equiv")===(a.httpEquiv==null?null:a.httpEquiv)&&f.getAttribute("charset")===(a.charSet==null?null:a.charSet)){M.splice(E,1);break e}}f=c.createElement(s),Tn(f,s,a),c.head.appendChild(f);break;default:throw Error(r(468,s))}f[Bt]=t,W(f),s=f}t.stateNode=s}else km(c,t.type,t.stateNode);else t.stateNode=Gm(c,s,t.memoizedProps);else f!==s?(f===null?a.stateNode!==null&&(a=a.stateNode,a.parentNode.removeChild(a)):f.count--,s===null?km(c,t.type,t.stateNode):Gm(c,s,t.memoizedProps)):s===null&&t.stateNode!==null&&zu(t,t.memoizedProps,a.memoizedProps)}break;case 27:Zn(n,t),Kn(t),s&512&&(an||a===null||Ri(a,a.return)),a!==null&&s&4&&zu(t,t.memoizedProps,a.memoizedProps);break;case 5:if(Zn(n,t),Kn(t),s&512&&(an||a===null||Ri(a,a.return)),t.flags&32){c=t.stateNode;try{gr(c,"")}catch(at){ke(t,t.return,at)}}s&4&&t.stateNode!=null&&(c=t.memoizedProps,zu(t,c,a!==null?a.memoizedProps:c)),s&1024&&(Fu=!0);break;case 6:if(Zn(n,t),Kn(t),s&4){if(t.stateNode===null)throw Error(r(162));s=t.memoizedProps,a=t.stateNode;try{a.nodeValue=s}catch(at){ke(t,t.return,at)}}break;case 3:if(Dl=null,c=_i,_i=wl(n.containerInfo),Zn(n,t),_i=c,Kn(t),s&4&&a!==null&&a.memoizedState.isDehydrated)try{mo(n.containerInfo)}catch(at){ke(t,t.return,at)}Fu&&(Fu=!1,Zp(t));break;case 4:s=_i,_i=wl(t.stateNode.containerInfo),Zn(n,t),Kn(t),_i=s;break;case 12:Zn(n,t),Kn(t);break;case 13:Zn(n,t),Kn(t),t.child.flags&8192&&t.memoizedState!==null!=(a!==null&&a.memoizedState!==null)&&(qu=Se()),s&4&&(s=t.updateQueue,s!==null&&(t.updateQueue=null,Hu(t,s)));break;case 22:c=t.memoizedState!==null;var z=a!==null&&a.memoizedState!==null,K=Gi,dt=an;if(Gi=K||c,an=dt||z,Zn(n,t),an=dt,Gi=K,Kn(t),s&8192)t:for(n=t.stateNode,n._visibility=c?n._visibility&-2:n._visibility|1,c&&(a===null||z||Gi||an||Ja(t)),a=null,n=t;;){if(n.tag===5||n.tag===26){if(a===null){z=a=n;try{if(f=z.stateNode,c)M=f.style,typeof M.setProperty=="function"?M.setProperty("display","none","important"):M.display="none";else{E=z.stateNode;var gt=z.memoizedProps.style,nt=gt!=null&&gt.hasOwnProperty("display")?gt.display:null;E.style.display=nt==null||typeof nt=="boolean"?"":(""+nt).trim()}}catch(at){ke(z,z.return,at)}}}else if(n.tag===6){if(a===null){z=n;try{z.stateNode.nodeValue=c?"":z.memoizedProps}catch(at){ke(z,z.return,at)}}}else if((n.tag!==22&&n.tag!==23||n.memoizedState===null||n===t)&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break t;for(;n.sibling===null;){if(n.return===null||n.return===t)break t;a===n&&(a=null),n=n.return}a===n&&(a=null),n.sibling.return=n.return,n=n.sibling}s&4&&(s=t.updateQueue,s!==null&&(a=s.retryQueue,a!==null&&(s.retryQueue=null,Hu(t,a))));break;case 19:Zn(n,t),Kn(t),s&4&&(s=t.updateQueue,s!==null&&(t.updateQueue=null,Hu(t,s)));break;case 30:break;case 21:break;default:Zn(n,t),Kn(t)}}function Kn(t){var n=t.flags;if(n&2){try{for(var a,s=t.return;s!==null;){if(Gp(s)){a=s;break}s=s.return}if(a==null)throw Error(r(160));switch(a.tag){case 27:var c=a.stateNode,f=Bu(t);ml(t,f,c);break;case 5:var M=a.stateNode;a.flags&32&&(gr(M,""),a.flags&=-33);var E=Bu(t);ml(t,E,M);break;case 3:case 4:var z=a.stateNode.containerInfo,K=Bu(t);Iu(t,K,z);break;default:throw Error(r(161))}}catch(dt){ke(t,t.return,dt)}t.flags&=-3}n&4096&&(t.flags&=-4097)}function Zp(t){if(t.subtreeFlags&1024)for(t=t.child;t!==null;){var n=t;Zp(n),n.tag===5&&n.flags&1024&&n.stateNode.reset(),t=t.sibling}}function fa(t,n){if(n.subtreeFlags&8772)for(n=n.child;n!==null;)Xp(t,n.alternate,n),n=n.sibling}function Ja(t){for(t=t.child;t!==null;){var n=t;switch(n.tag){case 0:case 11:case 14:case 15:ua(4,n,n.return),Ja(n);break;case 1:Ri(n,n.return);var a=n.stateNode;typeof a.componentWillUnmount=="function"&&Fp(n,n.return,a),Ja(n);break;case 27:so(n.stateNode);case 26:case 5:Ri(n,n.return),Ja(n);break;case 22:n.memoizedState===null&&Ja(n);break;case 30:Ja(n);break;default:Ja(n)}t=t.sibling}}function da(t,n,a){for(a=a&&(n.subtreeFlags&8772)!==0,n=n.child;n!==null;){var s=n.alternate,c=t,f=n,M=f.flags;switch(f.tag){case 0:case 11:case 15:da(c,f,a),Ks(4,f);break;case 1:if(da(c,f,a),s=f,c=s.stateNode,typeof c.componentDidMount=="function")try{c.componentDidMount()}catch(K){ke(s,s.return,K)}if(s=f,c=s.updateQueue,c!==null){var E=s.stateNode;try{var z=c.shared.hiddenCallbacks;if(z!==null)for(c.shared.hiddenCallbacks=null,c=0;c<z.length;c++)Th(z[c],E)}catch(K){ke(s,s.return,K)}}a&&M&64&&Ip(f),Qs(f,f.return);break;case 27:Vp(f);case 26:case 5:da(c,f,a),a&&s===null&&M&4&&Hp(f),Qs(f,f.return);break;case 12:da(c,f,a);break;case 13:da(c,f,a),a&&M&4&&Yp(c,f);break;case 22:f.memoizedState===null&&da(c,f,a),Qs(f,f.return);break;case 30:break;default:da(c,f,a)}n=n.sibling}}function Gu(t,n){var a=null;t!==null&&t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(a=t.memoizedState.cachePool.pool),t=null,n.memoizedState!==null&&n.memoizedState.cachePool!==null&&(t=n.memoizedState.cachePool.pool),t!==a&&(t!=null&&t.refCount++,a!=null&&zs(a))}function Vu(t,n){t=null,n.alternate!==null&&(t=n.alternate.memoizedState.cache),n=n.memoizedState.cache,n!==t&&(n.refCount++,t!=null&&zs(t))}function wi(t,n,a,s){if(n.subtreeFlags&10256)for(n=n.child;n!==null;)Kp(t,n,a,s),n=n.sibling}function Kp(t,n,a,s){var c=n.flags;switch(n.tag){case 0:case 11:case 15:wi(t,n,a,s),c&2048&&Ks(9,n);break;case 1:wi(t,n,a,s);break;case 3:wi(t,n,a,s),c&2048&&(t=null,n.alternate!==null&&(t=n.alternate.memoizedState.cache),n=n.memoizedState.cache,n!==t&&(n.refCount++,t!=null&&zs(t)));break;case 12:if(c&2048){wi(t,n,a,s),t=n.stateNode;try{var f=n.memoizedProps,M=f.id,E=f.onPostCommit;typeof E=="function"&&E(M,n.alternate===null?"mount":"update",t.passiveEffectDuration,-0)}catch(z){ke(n,n.return,z)}}else wi(t,n,a,s);break;case 13:wi(t,n,a,s);break;case 23:break;case 22:f=n.stateNode,M=n.alternate,n.memoizedState!==null?f._visibility&2?wi(t,n,a,s):Js(t,n):f._visibility&2?wi(t,n,a,s):(f._visibility|=2,Pr(t,n,a,s,(n.subtreeFlags&10256)!==0)),c&2048&&Gu(M,n);break;case 24:wi(t,n,a,s),c&2048&&Vu(n.alternate,n);break;default:wi(t,n,a,s)}}function Pr(t,n,a,s,c){for(c=c&&(n.subtreeFlags&10256)!==0,n=n.child;n!==null;){var f=t,M=n,E=a,z=s,K=M.flags;switch(M.tag){case 0:case 11:case 15:Pr(f,M,E,z,c),Ks(8,M);break;case 23:break;case 22:var dt=M.stateNode;M.memoizedState!==null?dt._visibility&2?Pr(f,M,E,z,c):Js(f,M):(dt._visibility|=2,Pr(f,M,E,z,c)),c&&K&2048&&Gu(M.alternate,M);break;case 24:Pr(f,M,E,z,c),c&&K&2048&&Vu(M.alternate,M);break;default:Pr(f,M,E,z,c)}n=n.sibling}}function Js(t,n){if(n.subtreeFlags&10256)for(n=n.child;n!==null;){var a=t,s=n,c=s.flags;switch(s.tag){case 22:Js(a,s),c&2048&&Gu(s.alternate,s);break;case 24:Js(a,s),c&2048&&Vu(s.alternate,s);break;default:Js(a,s)}n=n.sibling}}var $s=8192;function zr(t){if(t.subtreeFlags&$s)for(t=t.child;t!==null;)Qp(t),t=t.sibling}function Qp(t){switch(t.tag){case 26:zr(t),t.flags&$s&&t.memoizedState!==null&&cS(_i,t.memoizedState,t.memoizedProps);break;case 5:zr(t);break;case 3:case 4:var n=_i;_i=wl(t.stateNode.containerInfo),zr(t),_i=n;break;case 22:t.memoizedState===null&&(n=t.alternate,n!==null&&n.memoizedState!==null?(n=$s,$s=16777216,zr(t),$s=n):zr(t));break;default:zr(t)}}function Jp(t){var n=t.alternate;if(n!==null&&(t=n.child,t!==null)){n.child=null;do n=t.sibling,t.sibling=null,t=n;while(t!==null)}}function to(t){var n=t.deletions;if((t.flags&16)!==0){if(n!==null)for(var a=0;a<n.length;a++){var s=n[a];gn=s,tm(s,t)}Jp(t)}if(t.subtreeFlags&10256)for(t=t.child;t!==null;)$p(t),t=t.sibling}function $p(t){switch(t.tag){case 0:case 11:case 15:to(t),t.flags&2048&&ua(9,t,t.return);break;case 3:to(t);break;case 12:to(t);break;case 22:var n=t.stateNode;t.memoizedState!==null&&n._visibility&2&&(t.return===null||t.return.tag!==13)?(n._visibility&=-3,gl(t)):to(t);break;default:to(t)}}function gl(t){var n=t.deletions;if((t.flags&16)!==0){if(n!==null)for(var a=0;a<n.length;a++){var s=n[a];gn=s,tm(s,t)}Jp(t)}for(t=t.child;t!==null;){switch(n=t,n.tag){case 0:case 11:case 15:ua(8,n,n.return),gl(n);break;case 22:a=n.stateNode,a._visibility&2&&(a._visibility&=-3,gl(n));break;default:gl(n)}t=t.sibling}}function tm(t,n){for(;gn!==null;){var a=gn;switch(a.tag){case 0:case 11:case 15:ua(8,a,n);break;case 23:case 22:if(a.memoizedState!==null&&a.memoizedState.cachePool!==null){var s=a.memoizedState.cachePool.pool;s!=null&&s.refCount++}break;case 24:zs(a.memoizedState.cache)}if(s=a.child,s!==null)s.return=a,gn=s;else t:for(a=t;gn!==null;){s=gn;var c=s.sibling,f=s.return;if(Wp(s),s===a){gn=null;break t}if(c!==null){c.return=f,gn=c;break t}gn=f}}}var b0={getCacheForType:function(t){var n=Cn(fn),a=n.data.get(t);return a===void 0&&(a=t(),n.data.set(t,a)),a}},A0=typeof WeakMap=="function"?WeakMap:Map,Ne=0,Xe=null,Ee=null,Re=0,Oe=0,Qn=null,ha=!1,Br=!1,ku=!1,ki=0,tn=0,pa=0,$a=0,Xu=0,ci=0,Ir=0,eo=null,Gn=null,Wu=!1,qu=0,_l=1/0,vl=null,ma=null,En=0,ga=null,Fr=null,Hr=0,Yu=0,ju=null,em=null,no=0,Zu=null;function Jn(){if((Ne&2)!==0&&Re!==0)return Re&-Re;if(O.T!==null){var t=Rr;return t!==0?t:nf()}return Rt()}function nm(){ci===0&&(ci=(Re&536870912)===0||Ue?de():536870912);var t=li.current;return t!==null&&(t.flags|=32),ci}function $n(t,n,a){(t===Xe&&(Oe===2||Oe===9)||t.cancelPendingCommit!==null)&&(Gr(t,0),_a(t,Re,ci,!1)),At(t,a),((Ne&2)===0||t!==Xe)&&(t===Xe&&((Ne&2)===0&&($a|=a),tn===4&&_a(t,Re,ci,!1)),Ci(t))}function im(t,n,a){if((Ne&6)!==0)throw Error(r(327));var s=!a&&(n&124)===0&&(n&t.expiredLanes)===0||ye(t,n),c=s?C0(t,n):Ju(t,n,!0),f=s;do{if(c===0){Br&&!s&&_a(t,n,0,!1);break}else{if(a=t.current.alternate,f&&!R0(a)){c=Ju(t,n,!1),f=!1;continue}if(c===2){if(f=n,t.errorRecoveryDisabledLanes&f)var M=0;else M=t.pendingLanes&-536870913,M=M!==0?M:M&536870912?536870912:0;if(M!==0){n=M;t:{var E=t;c=eo;var z=E.current.memoizedState.isDehydrated;if(z&&(Gr(E,M).flags|=256),M=Ju(E,M,!1),M!==2){if(ku&&!z){E.errorRecoveryDisabledLanes|=f,$a|=f,c=4;break t}f=Gn,Gn=c,f!==null&&(Gn===null?Gn=f:Gn.push.apply(Gn,f))}c=M}if(f=!1,c!==2)continue}}if(c===1){Gr(t,0),_a(t,n,0,!0);break}t:{switch(s=t,f=c,f){case 0:case 1:throw Error(r(345));case 4:if((n&4194048)!==n)break;case 6:_a(s,n,ci,!ha);break t;case 2:Gn=null;break;case 3:case 5:break;default:throw Error(r(329))}if((n&62914560)===n&&(c=qu+300-Se(),10<c)){if(_a(s,n,ci,!ha),ae(s,0,!0)!==0)break t;s.timeoutHandle=Um(am.bind(null,s,a,Gn,vl,Wu,n,ci,$a,Ir,ha,f,2,-0,0),c);break t}am(s,a,Gn,vl,Wu,n,ci,$a,Ir,ha,f,0,-0,0)}}break}while(!0);Ci(t)}function am(t,n,a,s,c,f,M,E,z,K,dt,gt,nt,at){if(t.timeoutHandle=-1,gt=n.subtreeFlags,(gt&8192||(gt&16785408)===16785408)&&(co={stylesheets:null,count:0,unsuspend:lS},Qp(n),gt=uS(),gt!==null)){t.cancelPendingCommit=gt(fm.bind(null,t,n,f,a,s,c,M,E,z,dt,1,nt,at)),_a(t,f,M,!K);return}fm(t,n,f,a,s,c,M,E,z)}function R0(t){for(var n=t;;){var a=n.tag;if((a===0||a===11||a===15)&&n.flags&16384&&(a=n.updateQueue,a!==null&&(a=a.stores,a!==null)))for(var s=0;s<a.length;s++){var c=a[s],f=c.getSnapshot;c=c.value;try{if(!Yn(f(),c))return!1}catch{return!1}}if(a=n.child,n.subtreeFlags&16384&&a!==null)a.return=n,n=a;else{if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return!0;n=n.return}n.sibling.return=n.return,n=n.sibling}}return!0}function _a(t,n,a,s){n&=~Xu,n&=~$a,t.suspendedLanes|=n,t.pingedLanes&=~n,s&&(t.warmLanes|=n),s=t.expirationTimes;for(var c=n;0<c;){var f=31-kt(c),M=1<<f;s[f]=-1,c&=~M}a!==0&&Jt(t,a,n)}function Sl(){return(Ne&6)===0?(io(0),!1):!0}function Ku(){if(Ee!==null){if(Oe===0)var t=Ee.return;else t=Ee,Pi=Ya=null,hu(t),Nr=null,Ys=0,t=Ee;for(;t!==null;)Bp(t.alternate,t),t=t.return;Ee=null}}function Gr(t,n){var a=t.timeoutHandle;a!==-1&&(t.timeoutHandle=-1,W0(a)),a=t.cancelPendingCommit,a!==null&&(t.cancelPendingCommit=null,a()),Ku(),Xe=t,Ee=a=Ui(t.current,null),Re=n,Oe=0,Qn=null,ha=!1,Br=ye(t,n),ku=!1,Ir=ci=Xu=$a=pa=tn=0,Gn=eo=null,Wu=!1,(n&8)!==0&&(n|=n&32);var s=t.entangledLanes;if(s!==0)for(t=t.entanglements,s&=n;0<s;){var c=31-kt(s),f=1<<c;n|=t[c],s&=~f}return ki=n,Go(),a}function rm(t,n){ve=null,O.H=sl,n===Is||n===Ko?(n=yh(),Oe=3):n===Sh?(n=yh(),Oe=4):Oe=n===Ep?8:n!==null&&typeof n=="object"&&typeof n.then=="function"?6:1,Qn=n,Ee===null&&(tn=1,fl(t,ai(n,t.current)))}function sm(){var t=O.H;return O.H=sl,t===null?sl:t}function om(){var t=O.A;return O.A=b0,t}function Qu(){tn=4,ha||(Re&4194048)!==Re&&li.current!==null||(Br=!0),(pa&134217727)===0&&($a&134217727)===0||Xe===null||_a(Xe,Re,ci,!1)}function Ju(t,n,a){var s=Ne;Ne|=2;var c=sm(),f=om();(Xe!==t||Re!==n)&&(vl=null,Gr(t,n)),n=!1;var M=tn;t:do try{if(Oe!==0&&Ee!==null){var E=Ee,z=Qn;switch(Oe){case 8:Ku(),M=6;break t;case 3:case 2:case 9:case 6:li.current===null&&(n=!0);var K=Oe;if(Oe=0,Qn=null,Vr(t,E,z,K),a&&Br){M=0;break t}break;default:K=Oe,Oe=0,Qn=null,Vr(t,E,z,K)}}w0(),M=tn;break}catch(dt){rm(t,dt)}while(!0);return n&&t.shellSuspendCounter++,Pi=Ya=null,Ne=s,O.H=c,O.A=f,Ee===null&&(Xe=null,Re=0,Go()),M}function w0(){for(;Ee!==null;)lm(Ee)}function C0(t,n){var a=Ne;Ne|=2;var s=sm(),c=om();Xe!==t||Re!==n?(vl=null,_l=Se()+500,Gr(t,n)):Br=ye(t,n);t:do try{if(Oe!==0&&Ee!==null){n=Ee;var f=Qn;e:switch(Oe){case 1:Oe=0,Qn=null,Vr(t,n,f,1);break;case 2:case 9:if(xh(f)){Oe=0,Qn=null,cm(n);break}n=function(){Oe!==2&&Oe!==9||Xe!==t||(Oe=7),Ci(t)},f.then(n,n);break t;case 3:Oe=7;break t;case 4:Oe=5;break t;case 7:xh(f)?(Oe=0,Qn=null,cm(n)):(Oe=0,Qn=null,Vr(t,n,f,7));break;case 5:var M=null;switch(Ee.tag){case 26:M=Ee.memoizedState;case 5:case 27:var E=Ee;if(!M||Xm(M)){Oe=0,Qn=null;var z=E.sibling;if(z!==null)Ee=z;else{var K=E.return;K!==null?(Ee=K,xl(K)):Ee=null}break e}}Oe=0,Qn=null,Vr(t,n,f,5);break;case 6:Oe=0,Qn=null,Vr(t,n,f,6);break;case 8:Ku(),tn=6;break t;default:throw Error(r(462))}}D0();break}catch(dt){rm(t,dt)}while(!0);return Pi=Ya=null,O.H=s,O.A=c,Ne=a,Ee!==null?0:(Xe=null,Re=0,Go(),tn)}function D0(){for(;Ee!==null&&!ie();)lm(Ee)}function lm(t){var n=Pp(t.alternate,t,ki);t.memoizedProps=t.pendingProps,n===null?xl(t):Ee=n}function cm(t){var n=t,a=n.alternate;switch(n.tag){case 15:case 0:n=Cp(a,n,n.pendingProps,n.type,void 0,Re);break;case 11:n=Cp(a,n,n.pendingProps,n.type.render,n.ref,Re);break;case 5:hu(n);default:Bp(a,n),n=Ee=uh(n,ki),n=Pp(a,n,ki)}t.memoizedProps=t.pendingProps,n===null?xl(t):Ee=n}function Vr(t,n,a,s){Pi=Ya=null,hu(n),Nr=null,Ys=0;var c=n.return;try{if(S0(t,c,n,a,Re)){tn=1,fl(t,ai(a,t.current)),Ee=null;return}}catch(f){if(c!==null)throw Ee=c,f;tn=1,fl(t,ai(a,t.current)),Ee=null;return}n.flags&32768?(Ue||s===1?t=!0:Br||(Re&536870912)!==0?t=!1:(ha=t=!0,(s===2||s===9||s===3||s===6)&&(s=li.current,s!==null&&s.tag===13&&(s.flags|=16384))),um(n,t)):xl(n)}function xl(t){var n=t;do{if((n.flags&32768)!==0){um(n,ha);return}t=n.return;var a=M0(n.alternate,n,ki);if(a!==null){Ee=a;return}if(n=n.sibling,n!==null){Ee=n;return}Ee=n=t}while(n!==null);tn===0&&(tn=5)}function um(t,n){do{var a=y0(t.alternate,t);if(a!==null){a.flags&=32767,Ee=a;return}if(a=t.return,a!==null&&(a.flags|=32768,a.subtreeFlags=0,a.deletions=null),!n&&(t=t.sibling,t!==null)){Ee=t;return}Ee=t=a}while(t!==null);tn=6,Ee=null}function fm(t,n,a,s,c,f,M,E,z){t.cancelPendingCommit=null;do Ml();while(En!==0);if((Ne&6)!==0)throw Error(r(327));if(n!==null){if(n===t.current)throw Error(r(177));if(f=n.lanes|n.childLanes,f|=Vc,Ct(t,a,f,M,E,z),t===Xe&&(Ee=Xe=null,Re=0),Fr=n,ga=t,Hr=a,Yu=f,ju=c,em=s,(n.subtreeFlags&10256)!==0||(n.flags&10256)!==0?(t.callbackNode=null,t.callbackPriority=0,O0(et,function(){return gm(),null})):(t.callbackNode=null,t.callbackPriority=0),s=(n.flags&13878)!==0,(n.subtreeFlags&13878)!==0||s){s=O.T,O.T=null,c=q.p,q.p=2,M=Ne,Ne|=4;try{E0(t,n,a)}finally{Ne=M,q.p=c,O.T=s}}En=1,dm(),hm(),pm()}}function dm(){if(En===1){En=0;var t=ga,n=Fr,a=(n.flags&13878)!==0;if((n.subtreeFlags&13878)!==0||a){a=O.T,O.T=null;var s=q.p;q.p=2;var c=Ne;Ne|=4;try{jp(n,t);var f=ff,M=th(t.containerInfo),E=f.focusedElem,z=f.selectionRange;if(M!==E&&E&&E.ownerDocument&&$d(E.ownerDocument.documentElement,E)){if(z!==null&&Bc(E)){var K=z.start,dt=z.end;if(dt===void 0&&(dt=K),"selectionStart"in E)E.selectionStart=K,E.selectionEnd=Math.min(dt,E.value.length);else{var gt=E.ownerDocument||document,nt=gt&&gt.defaultView||window;if(nt.getSelection){var at=nt.getSelection(),se=E.textContent.length,te=Math.min(z.start,se),Ie=z.end===void 0?te:Math.min(z.end,se);!at.extend&&te>Ie&&(M=Ie,Ie=te,te=M);var Y=Jd(E,te),V=Jd(E,Ie);if(Y&&V&&(at.rangeCount!==1||at.anchorNode!==Y.node||at.anchorOffset!==Y.offset||at.focusNode!==V.node||at.focusOffset!==V.offset)){var Z=gt.createRange();Z.setStart(Y.node,Y.offset),at.removeAllRanges(),te>Ie?(at.addRange(Z),at.extend(V.node,V.offset)):(Z.setEnd(V.node,V.offset),at.addRange(Z))}}}}for(gt=[],at=E;at=at.parentNode;)at.nodeType===1&&gt.push({element:at,left:at.scrollLeft,top:at.scrollTop});for(typeof E.focus=="function"&&E.focus(),E=0;E<gt.length;E++){var ht=gt[E];ht.element.scrollLeft=ht.left,ht.element.scrollTop=ht.top}}Nl=!!uf,ff=uf=null}finally{Ne=c,q.p=s,O.T=a}}t.current=n,En=2}}function hm(){if(En===2){En=0;var t=ga,n=Fr,a=(n.flags&8772)!==0;if((n.subtreeFlags&8772)!==0||a){a=O.T,O.T=null;var s=q.p;q.p=2;var c=Ne;Ne|=4;try{Xp(t,n.alternate,n)}finally{Ne=c,q.p=s,O.T=a}}En=3}}function pm(){if(En===4||En===3){En=0,It();var t=ga,n=Fr,a=Hr,s=em;(n.subtreeFlags&10256)!==0||(n.flags&10256)!==0?En=5:(En=0,Fr=ga=null,mm(t,t.pendingLanes));var c=t.pendingLanes;if(c===0&&(ma=null),ft(a),n=n.stateNode,Dt&&typeof Dt.onCommitFiberRoot=="function")try{Dt.onCommitFiberRoot(Tt,n,void 0,(n.current.flags&128)===128)}catch{}if(s!==null){n=O.T,c=q.p,q.p=2,O.T=null;try{for(var f=t.onRecoverableError,M=0;M<s.length;M++){var E=s[M];f(E.value,{componentStack:E.stack})}}finally{O.T=n,q.p=c}}(Hr&3)!==0&&Ml(),Ci(t),c=t.pendingLanes,(a&4194090)!==0&&(c&42)!==0?t===Zu?no++:(no=0,Zu=t):no=0,io(0)}}function mm(t,n){(t.pooledCacheLanes&=n)===0&&(n=t.pooledCache,n!=null&&(t.pooledCache=null,zs(n)))}function Ml(t){return dm(),hm(),pm(),gm()}function gm(){if(En!==5)return!1;var t=ga,n=Yu;Yu=0;var a=ft(Hr),s=O.T,c=q.p;try{q.p=32>a?32:a,O.T=null,a=ju,ju=null;var f=ga,M=Hr;if(En=0,Fr=ga=null,Hr=0,(Ne&6)!==0)throw Error(r(331));var E=Ne;if(Ne|=4,$p(f.current),Kp(f,f.current,M,a),Ne=E,io(0,!1),Dt&&typeof Dt.onPostCommitFiberRoot=="function")try{Dt.onPostCommitFiberRoot(Tt,f)}catch{}return!0}finally{q.p=c,O.T=s,mm(t,n)}}function _m(t,n,a){n=ai(a,n),n=Ru(t.stateNode,n,2),t=sa(t,n,2),t!==null&&(At(t,2),Ci(t))}function ke(t,n,a){if(t.tag===3)_m(t,t,a);else for(;n!==null;){if(n.tag===3){_m(n,t,a);break}else if(n.tag===1){var s=n.stateNode;if(typeof n.type.getDerivedStateFromError=="function"||typeof s.componentDidCatch=="function"&&(ma===null||!ma.has(s))){t=ai(a,t),a=Mp(2),s=sa(n,a,2),s!==null&&(yp(a,s,n,t),At(s,2),Ci(s));break}}n=n.return}}function $u(t,n,a){var s=t.pingCache;if(s===null){s=t.pingCache=new A0;var c=new Set;s.set(n,c)}else c=s.get(n),c===void 0&&(c=new Set,s.set(n,c));c.has(a)||(ku=!0,c.add(a),t=L0.bind(null,t,n,a),n.then(t,t))}function L0(t,n,a){var s=t.pingCache;s!==null&&s.delete(n),t.pingedLanes|=t.suspendedLanes&a,t.warmLanes&=~a,Xe===t&&(Re&a)===a&&(tn===4||tn===3&&(Re&62914560)===Re&&300>Se()-qu?(Ne&2)===0&&Gr(t,0):Xu|=a,Ir===Re&&(Ir=0)),Ci(t)}function vm(t,n){n===0&&(n=bt()),t=Er(t,n),t!==null&&(At(t,n),Ci(t))}function U0(t){var n=t.memoizedState,a=0;n!==null&&(a=n.retryLane),vm(t,a)}function N0(t,n){var a=0;switch(t.tag){case 13:var s=t.stateNode,c=t.memoizedState;c!==null&&(a=c.retryLane);break;case 19:s=t.stateNode;break;case 22:s=t.stateNode._retryCache;break;default:throw Error(r(314))}s!==null&&s.delete(n),vm(t,a)}function O0(t,n){return qe(t,n)}var yl=null,kr=null,tf=!1,El=!1,ef=!1,tr=0;function Ci(t){t!==kr&&t.next===null&&(kr===null?yl=kr=t:kr=kr.next=t),El=!0,tf||(tf=!0,z0())}function io(t,n){if(!ef&&El){ef=!0;do for(var a=!1,s=yl;s!==null;){if(t!==0){var c=s.pendingLanes;if(c===0)var f=0;else{var M=s.suspendedLanes,E=s.pingedLanes;f=(1<<31-kt(42|t)+1)-1,f&=c&~(M&~E),f=f&201326741?f&201326741|1:f?f|2:0}f!==0&&(a=!0,ym(s,f))}else f=Re,f=ae(s,s===Xe?f:0,s.cancelPendingCommit!==null||s.timeoutHandle!==-1),(f&3)===0||ye(s,f)||(a=!0,ym(s,f));s=s.next}while(a);ef=!1}}function P0(){Sm()}function Sm(){El=tf=!1;var t=0;tr!==0&&(X0()&&(t=tr),tr=0);for(var n=Se(),a=null,s=yl;s!==null;){var c=s.next,f=xm(s,n);f===0?(s.next=null,a===null?yl=c:a.next=c,c===null&&(kr=a)):(a=s,(t!==0||(f&3)!==0)&&(El=!0)),s=c}io(t)}function xm(t,n){for(var a=t.suspendedLanes,s=t.pingedLanes,c=t.expirationTimes,f=t.pendingLanes&-62914561;0<f;){var M=31-kt(f),E=1<<M,z=c[M];z===-1?((E&a)===0||(E&s)!==0)&&(c[M]=Ge(E,n)):z<=n&&(t.expiredLanes|=E),f&=~E}if(n=Xe,a=Re,a=ae(t,t===n?a:0,t.cancelPendingCommit!==null||t.timeoutHandle!==-1),s=t.callbackNode,a===0||t===n&&(Oe===2||Oe===9)||t.cancelPendingCommit!==null)return s!==null&&s!==null&&Xt(s),t.callbackNode=null,t.callbackPriority=0;if((a&3)===0||ye(t,a)){if(n=a&-a,n===t.callbackPriority)return n;switch(s!==null&&Xt(s),ft(a)){case 2:case 8:a=T;break;case 32:a=et;break;case 268435456:a=vt;break;default:a=et}return s=Mm.bind(null,t),a=qe(a,s),t.callbackPriority=n,t.callbackNode=a,n}return s!==null&&s!==null&&Xt(s),t.callbackPriority=2,t.callbackNode=null,2}function Mm(t,n){if(En!==0&&En!==5)return t.callbackNode=null,t.callbackPriority=0,null;var a=t.callbackNode;if(Ml()&&t.callbackNode!==a)return null;var s=Re;return s=ae(t,t===Xe?s:0,t.cancelPendingCommit!==null||t.timeoutHandle!==-1),s===0?null:(im(t,s,n),xm(t,Se()),t.callbackNode!=null&&t.callbackNode===a?Mm.bind(null,t):null)}function ym(t,n){if(Ml())return null;im(t,n,!0)}function z0(){q0(function(){(Ne&6)!==0?qe(L,P0):Sm()})}function nf(){return tr===0&&(tr=de()),tr}function Em(t){return t==null||typeof t=="symbol"||typeof t=="boolean"?null:typeof t=="function"?t:Oo(""+t)}function Tm(t,n){var a=n.ownerDocument.createElement("input");return a.name=n.name,a.value=n.value,t.id&&a.setAttribute("form",t.id),n.parentNode.insertBefore(a,n),t=new FormData(t),a.parentNode.removeChild(a),t}function B0(t,n,a,s,c){if(n==="submit"&&a&&a.stateNode===c){var f=Em((c[le]||null).action),M=s.submitter;M&&(n=(n=M[le]||null)?Em(n.formAction):M.getAttribute("formAction"),n!==null&&(f=n,M=null));var E=new Io("action","action",null,s,c);t.push({event:E,listeners:[{instance:null,listener:function(){if(s.defaultPrevented){if(tr!==0){var z=M?Tm(c,M):new FormData(c);yu(a,{pending:!0,data:z,method:c.method,action:f},null,z)}}else typeof f=="function"&&(E.preventDefault(),z=M?Tm(c,M):new FormData(c),yu(a,{pending:!0,data:z,method:c.method,action:f},f,z))},currentTarget:c}]})}}for(var af=0;af<Gc.length;af++){var rf=Gc[af],I0=rf.toLowerCase(),F0=rf[0].toUpperCase()+rf.slice(1);gi(I0,"on"+F0)}gi(ih,"onAnimationEnd"),gi(ah,"onAnimationIteration"),gi(rh,"onAnimationStart"),gi("dblclick","onDoubleClick"),gi("focusin","onFocus"),gi("focusout","onBlur"),gi(n0,"onTransitionRun"),gi(i0,"onTransitionStart"),gi(a0,"onTransitionCancel"),gi(sh,"onTransitionEnd"),Nt("onMouseEnter",["mouseout","mouseover"]),Nt("onMouseLeave",["mouseout","mouseover"]),Nt("onPointerEnter",["pointerout","pointerover"]),Nt("onPointerLeave",["pointerout","pointerover"]),it("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),it("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),it("onBeforeInput",["compositionend","keypress","textInput","paste"]),it("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),it("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),it("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var ao="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),H0=new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(ao));function bm(t,n){n=(n&4)!==0;for(var a=0;a<t.length;a++){var s=t[a],c=s.event;s=s.listeners;t:{var f=void 0;if(n)for(var M=s.length-1;0<=M;M--){var E=s[M],z=E.instance,K=E.currentTarget;if(E=E.listener,z!==f&&c.isPropagationStopped())break t;f=E,c.currentTarget=K;try{f(c)}catch(dt){ul(dt)}c.currentTarget=null,f=z}else for(M=0;M<s.length;M++){if(E=s[M],z=E.instance,K=E.currentTarget,E=E.listener,z!==f&&c.isPropagationStopped())break t;f=E,c.currentTarget=K;try{f(c)}catch(dt){ul(dt)}c.currentTarget=null,f=z}}}}function Te(t,n){var a=n[Ke];a===void 0&&(a=n[Ke]=new Set);var s=t+"__bubble";a.has(s)||(Am(n,t,2,!1),a.add(s))}function sf(t,n,a){var s=0;n&&(s|=4),Am(a,t,s,n)}var Tl="_reactListening"+Math.random().toString(36).slice(2);function of(t){if(!t[Tl]){t[Tl]=!0,rt.forEach(function(a){a!=="selectionchange"&&(H0.has(a)||sf(a,!1,t),sf(a,!0,t))});var n=t.nodeType===9?t:t.ownerDocument;n===null||n[Tl]||(n[Tl]=!0,sf("selectionchange",!1,n))}}function Am(t,n,a,s){switch(Km(n)){case 2:var c=hS;break;case 8:c=pS;break;default:c=Mf}a=c.bind(null,n,a,t),c=void 0,!wc||n!=="touchstart"&&n!=="touchmove"&&n!=="wheel"||(c=!0),s?c!==void 0?t.addEventListener(n,a,{capture:!0,passive:c}):t.addEventListener(n,a,!0):c!==void 0?t.addEventListener(n,a,{passive:c}):t.addEventListener(n,a,!1)}function lf(t,n,a,s,c){var f=s;if((n&1)===0&&(n&2)===0&&s!==null)t:for(;;){if(s===null)return;var M=s.tag;if(M===3||M===4){var E=s.stateNode.containerInfo;if(E===c)break;if(M===4)for(M=s.return;M!==null;){var z=M.tag;if((z===3||z===4)&&M.stateNode.containerInfo===c)return;M=M.return}for(;E!==null;){if(M=cn(E),M===null)return;if(z=M.tag,z===5||z===6||z===26||z===27){s=f=M;continue t}E=E.parentNode}}s=s.return}Nd(function(){var K=f,dt=Ac(a),gt=[];t:{var nt=oh.get(t);if(nt!==void 0){var at=Io,se=t;switch(t){case"keypress":if(zo(a)===0)break t;case"keydown":case"keyup":at=Ov;break;case"focusin":se="focus",at=Uc;break;case"focusout":se="blur",at=Uc;break;case"beforeblur":case"afterblur":at=Uc;break;case"click":if(a.button===2)break t;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":at=zd;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":at=yv;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":at=Bv;break;case ih:case ah:case rh:at=bv;break;case sh:at=Fv;break;case"scroll":case"scrollend":at=xv;break;case"wheel":at=Gv;break;case"copy":case"cut":case"paste":at=Rv;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":at=Id;break;case"toggle":case"beforetoggle":at=kv}var te=(n&4)!==0,Ie=!te&&(t==="scroll"||t==="scrollend"),Y=te?nt!==null?nt+"Capture":null:nt;te=[];for(var V=K,Z;V!==null;){var ht=V;if(Z=ht.stateNode,ht=ht.tag,ht!==5&&ht!==26&&ht!==27||Z===null||Y===null||(ht=Es(V,Y),ht!=null&&te.push(ro(V,ht,Z))),Ie)break;V=V.return}0<te.length&&(nt=new at(nt,se,null,a,dt),gt.push({event:nt,listeners:te}))}}if((n&7)===0){t:{if(nt=t==="mouseover"||t==="pointerover",at=t==="mouseout"||t==="pointerout",nt&&a!==bc&&(se=a.relatedTarget||a.fromElement)&&(cn(se)||se[Pe]))break t;if((at||nt)&&(nt=dt.window===dt?dt:(nt=dt.ownerDocument)?nt.defaultView||nt.parentWindow:window,at?(se=a.relatedTarget||a.toElement,at=K,se=se?cn(se):null,se!==null&&(Ie=u(se),te=se.tag,se!==Ie||te!==5&&te!==27&&te!==6)&&(se=null)):(at=null,se=K),at!==se)){if(te=zd,ht="onMouseLeave",Y="onMouseEnter",V="mouse",(t==="pointerout"||t==="pointerover")&&(te=Id,ht="onPointerLeave",Y="onPointerEnter",V="pointer"),Ie=at==null?nt:Nn(at),Z=se==null?nt:Nn(se),nt=new te(ht,V+"leave",at,a,dt),nt.target=Ie,nt.relatedTarget=Z,ht=null,cn(dt)===K&&(te=new te(Y,V+"enter",se,a,dt),te.target=Z,te.relatedTarget=Ie,ht=te),Ie=ht,at&&se)e:{for(te=at,Y=se,V=0,Z=te;Z;Z=Xr(Z))V++;for(Z=0,ht=Y;ht;ht=Xr(ht))Z++;for(;0<V-Z;)te=Xr(te),V--;for(;0<Z-V;)Y=Xr(Y),Z--;for(;V--;){if(te===Y||Y!==null&&te===Y.alternate)break e;te=Xr(te),Y=Xr(Y)}te=null}else te=null;at!==null&&Rm(gt,nt,at,te,!1),se!==null&&Ie!==null&&Rm(gt,Ie,se,te,!0)}}t:{if(nt=K?Nn(K):window,at=nt.nodeName&&nt.nodeName.toLowerCase(),at==="select"||at==="input"&&nt.type==="file")var Ht=qd;else if(Xd(nt))if(Yd)Ht=$v;else{Ht=Qv;var xe=Kv}else at=nt.nodeName,!at||at.toLowerCase()!=="input"||nt.type!=="checkbox"&&nt.type!=="radio"?K&&Tc(K.elementType)&&(Ht=qd):Ht=Jv;if(Ht&&(Ht=Ht(t,K))){Wd(gt,Ht,a,dt);break t}xe&&xe(t,nt,K),t==="focusout"&&K&&nt.type==="number"&&K.memoizedProps.value!=null&&pr(nt,"number",nt.value)}switch(xe=K?Nn(K):window,t){case"focusin":(Xd(xe)||xe.contentEditable==="true")&&(xr=xe,Ic=K,Ls=null);break;case"focusout":Ls=Ic=xr=null;break;case"mousedown":Fc=!0;break;case"contextmenu":case"mouseup":case"dragend":Fc=!1,eh(gt,a,dt);break;case"selectionchange":if(e0)break;case"keydown":case"keyup":eh(gt,a,dt)}var Yt;if(Oc)t:{switch(t){case"compositionstart":var ne="onCompositionStart";break t;case"compositionend":ne="onCompositionEnd";break t;case"compositionupdate":ne="onCompositionUpdate";break t}ne=void 0}else Sr?Vd(t,a)&&(ne="onCompositionEnd"):t==="keydown"&&a.keyCode===229&&(ne="onCompositionStart");ne&&(Fd&&a.locale!=="ko"&&(Sr||ne!=="onCompositionStart"?ne==="onCompositionEnd"&&Sr&&(Yt=Od()):(na=dt,Cc="value"in na?na.value:na.textContent,Sr=!0)),xe=bl(K,ne),0<xe.length&&(ne=new Bd(ne,t,null,a,dt),gt.push({event:ne,listeners:xe}),Yt?ne.data=Yt:(Yt=kd(a),Yt!==null&&(ne.data=Yt)))),(Yt=Wv?qv(t,a):Yv(t,a))&&(ne=bl(K,"onBeforeInput"),0<ne.length&&(xe=new Bd("onBeforeInput","beforeinput",null,a,dt),gt.push({event:xe,listeners:ne}),xe.data=Yt)),B0(gt,t,K,a,dt)}bm(gt,n)})}function ro(t,n,a){return{instance:t,listener:n,currentTarget:a}}function bl(t,n){for(var a=n+"Capture",s=[];t!==null;){var c=t,f=c.stateNode;if(c=c.tag,c!==5&&c!==26&&c!==27||f===null||(c=Es(t,a),c!=null&&s.unshift(ro(t,c,f)),c=Es(t,n),c!=null&&s.push(ro(t,c,f))),t.tag===3)return s;t=t.return}return[]}function Xr(t){if(t===null)return null;do t=t.return;while(t&&t.tag!==5&&t.tag!==27);return t||null}function Rm(t,n,a,s,c){for(var f=n._reactName,M=[];a!==null&&a!==s;){var E=a,z=E.alternate,K=E.stateNode;if(E=E.tag,z!==null&&z===s)break;E!==5&&E!==26&&E!==27||K===null||(z=K,c?(K=Es(a,f),K!=null&&M.unshift(ro(a,K,z))):c||(K=Es(a,f),K!=null&&M.push(ro(a,K,z)))),a=a.return}M.length!==0&&t.push({event:n,listeners:M})}var G0=/\r\n?/g,V0=/\u0000|\uFFFD/g;function wm(t){return(typeof t=="string"?t:""+t).replace(G0,`
`).replace(V0,"")}function Cm(t,n){return n=wm(n),wm(t)===n}function Al(){}function Be(t,n,a,s,c,f){switch(a){case"children":typeof s=="string"?n==="body"||n==="textarea"&&s===""||gr(t,s):(typeof s=="number"||typeof s=="bigint")&&n!=="body"&&gr(t,""+s);break;case"className":fe(t,"class",s);break;case"tabIndex":fe(t,"tabindex",s);break;case"dir":case"role":case"viewBox":case"width":case"height":fe(t,a,s);break;case"style":Ld(t,s,f);break;case"data":if(n!=="object"){fe(t,"data",s);break}case"src":case"href":if(s===""&&(n!=="a"||a!=="href")){t.removeAttribute(a);break}if(s==null||typeof s=="function"||typeof s=="symbol"||typeof s=="boolean"){t.removeAttribute(a);break}s=Oo(""+s),t.setAttribute(a,s);break;case"action":case"formAction":if(typeof s=="function"){t.setAttribute(a,"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");break}else typeof f=="function"&&(a==="formAction"?(n!=="input"&&Be(t,n,"name",c.name,c,null),Be(t,n,"formEncType",c.formEncType,c,null),Be(t,n,"formMethod",c.formMethod,c,null),Be(t,n,"formTarget",c.formTarget,c,null)):(Be(t,n,"encType",c.encType,c,null),Be(t,n,"method",c.method,c,null),Be(t,n,"target",c.target,c,null)));if(s==null||typeof s=="symbol"||typeof s=="boolean"){t.removeAttribute(a);break}s=Oo(""+s),t.setAttribute(a,s);break;case"onClick":s!=null&&(t.onclick=Al);break;case"onScroll":s!=null&&Te("scroll",t);break;case"onScrollEnd":s!=null&&Te("scrollend",t);break;case"dangerouslySetInnerHTML":if(s!=null){if(typeof s!="object"||!("__html"in s))throw Error(r(61));if(a=s.__html,a!=null){if(c.children!=null)throw Error(r(60));t.innerHTML=a}}break;case"multiple":t.multiple=s&&typeof s!="function"&&typeof s!="symbol";break;case"muted":t.muted=s&&typeof s!="function"&&typeof s!="symbol";break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"defaultValue":case"defaultChecked":case"innerHTML":case"ref":break;case"autoFocus":break;case"xlinkHref":if(s==null||typeof s=="function"||typeof s=="boolean"||typeof s=="symbol"){t.removeAttribute("xlink:href");break}a=Oo(""+s),t.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",a);break;case"contentEditable":case"spellCheck":case"draggable":case"value":case"autoReverse":case"externalResourcesRequired":case"focusable":case"preserveAlpha":s!=null&&typeof s!="function"&&typeof s!="symbol"?t.setAttribute(a,""+s):t.removeAttribute(a);break;case"inert":case"allowFullScreen":case"async":case"autoPlay":case"controls":case"default":case"defer":case"disabled":case"disablePictureInPicture":case"disableRemotePlayback":case"formNoValidate":case"hidden":case"loop":case"noModule":case"noValidate":case"open":case"playsInline":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"itemScope":s&&typeof s!="function"&&typeof s!="symbol"?t.setAttribute(a,""):t.removeAttribute(a);break;case"capture":case"download":s===!0?t.setAttribute(a,""):s!==!1&&s!=null&&typeof s!="function"&&typeof s!="symbol"?t.setAttribute(a,s):t.removeAttribute(a);break;case"cols":case"rows":case"size":case"span":s!=null&&typeof s!="function"&&typeof s!="symbol"&&!isNaN(s)&&1<=s?t.setAttribute(a,s):t.removeAttribute(a);break;case"rowSpan":case"start":s==null||typeof s=="function"||typeof s=="symbol"||isNaN(s)?t.removeAttribute(a):t.setAttribute(a,s);break;case"popover":Te("beforetoggle",t),Te("toggle",t),ce(t,"popover",s);break;case"xlinkActuate":Le(t,"http://www.w3.org/1999/xlink","xlink:actuate",s);break;case"xlinkArcrole":Le(t,"http://www.w3.org/1999/xlink","xlink:arcrole",s);break;case"xlinkRole":Le(t,"http://www.w3.org/1999/xlink","xlink:role",s);break;case"xlinkShow":Le(t,"http://www.w3.org/1999/xlink","xlink:show",s);break;case"xlinkTitle":Le(t,"http://www.w3.org/1999/xlink","xlink:title",s);break;case"xlinkType":Le(t,"http://www.w3.org/1999/xlink","xlink:type",s);break;case"xmlBase":Le(t,"http://www.w3.org/XML/1998/namespace","xml:base",s);break;case"xmlLang":Le(t,"http://www.w3.org/XML/1998/namespace","xml:lang",s);break;case"xmlSpace":Le(t,"http://www.w3.org/XML/1998/namespace","xml:space",s);break;case"is":ce(t,"is",s);break;case"innerText":case"textContent":break;default:(!(2<a.length)||a[0]!=="o"&&a[0]!=="O"||a[1]!=="n"&&a[1]!=="N")&&(a=vv.get(a)||a,ce(t,a,s))}}function cf(t,n,a,s,c,f){switch(a){case"style":Ld(t,s,f);break;case"dangerouslySetInnerHTML":if(s!=null){if(typeof s!="object"||!("__html"in s))throw Error(r(61));if(a=s.__html,a!=null){if(c.children!=null)throw Error(r(60));t.innerHTML=a}}break;case"children":typeof s=="string"?gr(t,s):(typeof s=="number"||typeof s=="bigint")&&gr(t,""+s);break;case"onScroll":s!=null&&Te("scroll",t);break;case"onScrollEnd":s!=null&&Te("scrollend",t);break;case"onClick":s!=null&&(t.onclick=Al);break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"innerHTML":case"ref":break;case"innerText":case"textContent":break;default:if(!ot.hasOwnProperty(a))t:{if(a[0]==="o"&&a[1]==="n"&&(c=a.endsWith("Capture"),n=a.slice(2,c?a.length-7:void 0),f=t[le]||null,f=f!=null?f[a]:null,typeof f=="function"&&t.removeEventListener(n,f,c),typeof s=="function")){typeof f!="function"&&f!==null&&(a in t?t[a]=null:t.hasAttribute(a)&&t.removeAttribute(a)),t.addEventListener(n,s,c);break t}a in t?t[a]=s:s===!0?t.setAttribute(a,""):ce(t,a,s)}}}function Tn(t,n,a){switch(n){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"img":Te("error",t),Te("load",t);var s=!1,c=!1,f;for(f in a)if(a.hasOwnProperty(f)){var M=a[f];if(M!=null)switch(f){case"src":s=!0;break;case"srcSet":c=!0;break;case"children":case"dangerouslySetInnerHTML":throw Error(r(137,n));default:Be(t,n,f,M,a,null)}}c&&Be(t,n,"srcSet",a.srcSet,a,null),s&&Be(t,n,"src",a.src,a,null);return;case"input":Te("invalid",t);var E=f=M=c=null,z=null,K=null;for(s in a)if(a.hasOwnProperty(s)){var dt=a[s];if(dt!=null)switch(s){case"name":c=dt;break;case"type":M=dt;break;case"checked":z=dt;break;case"defaultChecked":K=dt;break;case"value":f=dt;break;case"defaultValue":E=dt;break;case"children":case"dangerouslySetInnerHTML":if(dt!=null)throw Error(r(137,n));break;default:Be(t,n,s,dt,a,null)}}No(t,f,E,z,K,M,c,!1),ea(t);return;case"select":Te("invalid",t),s=M=f=null;for(c in a)if(a.hasOwnProperty(c)&&(E=a[c],E!=null))switch(c){case"value":f=E;break;case"defaultValue":M=E;break;case"multiple":s=E;default:Be(t,n,c,E,a,null)}n=f,a=M,t.multiple=!!s,n!=null?mr(t,!!s,n,!1):a!=null&&mr(t,!!s,a,!0);return;case"textarea":Te("invalid",t),f=c=s=null;for(M in a)if(a.hasOwnProperty(M)&&(E=a[M],E!=null))switch(M){case"value":s=E;break;case"defaultValue":c=E;break;case"children":f=E;break;case"dangerouslySetInnerHTML":if(E!=null)throw Error(r(91));break;default:Be(t,n,M,E,a,null)}Cd(t,s,c,f),ea(t);return;case"option":for(z in a)a.hasOwnProperty(z)&&(s=a[z],s!=null)&&(z==="selected"?t.selected=s&&typeof s!="function"&&typeof s!="symbol":Be(t,n,z,s,a,null));return;case"dialog":Te("beforetoggle",t),Te("toggle",t),Te("cancel",t),Te("close",t);break;case"iframe":case"object":Te("load",t);break;case"video":case"audio":for(s=0;s<ao.length;s++)Te(ao[s],t);break;case"image":Te("error",t),Te("load",t);break;case"details":Te("toggle",t);break;case"embed":case"source":case"link":Te("error",t),Te("load",t);case"area":case"base":case"br":case"col":case"hr":case"keygen":case"meta":case"param":case"track":case"wbr":case"menuitem":for(K in a)if(a.hasOwnProperty(K)&&(s=a[K],s!=null))switch(K){case"children":case"dangerouslySetInnerHTML":throw Error(r(137,n));default:Be(t,n,K,s,a,null)}return;default:if(Tc(n)){for(dt in a)a.hasOwnProperty(dt)&&(s=a[dt],s!==void 0&&cf(t,n,dt,s,a,void 0));return}}for(E in a)a.hasOwnProperty(E)&&(s=a[E],s!=null&&Be(t,n,E,s,a,null))}function k0(t,n,a,s){switch(n){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"input":var c=null,f=null,M=null,E=null,z=null,K=null,dt=null;for(at in a){var gt=a[at];if(a.hasOwnProperty(at)&&gt!=null)switch(at){case"checked":break;case"value":break;case"defaultValue":z=gt;default:s.hasOwnProperty(at)||Be(t,n,at,null,s,gt)}}for(var nt in s){var at=s[nt];if(gt=a[nt],s.hasOwnProperty(nt)&&(at!=null||gt!=null))switch(nt){case"type":f=at;break;case"name":c=at;break;case"checked":K=at;break;case"defaultChecked":dt=at;break;case"value":M=at;break;case"defaultValue":E=at;break;case"children":case"dangerouslySetInnerHTML":if(at!=null)throw Error(r(137,n));break;default:at!==gt&&Be(t,n,nt,at,s,gt)}}Ia(t,M,E,z,K,dt,f,c);return;case"select":at=M=E=nt=null;for(f in a)if(z=a[f],a.hasOwnProperty(f)&&z!=null)switch(f){case"value":break;case"multiple":at=z;default:s.hasOwnProperty(f)||Be(t,n,f,null,s,z)}for(c in s)if(f=s[c],z=a[c],s.hasOwnProperty(c)&&(f!=null||z!=null))switch(c){case"value":nt=f;break;case"defaultValue":E=f;break;case"multiple":M=f;default:f!==z&&Be(t,n,c,f,s,z)}n=E,a=M,s=at,nt!=null?mr(t,!!a,nt,!1):!!s!=!!a&&(n!=null?mr(t,!!a,n,!0):mr(t,!!a,a?[]:"",!1));return;case"textarea":at=nt=null;for(E in a)if(c=a[E],a.hasOwnProperty(E)&&c!=null&&!s.hasOwnProperty(E))switch(E){case"value":break;case"children":break;default:Be(t,n,E,null,s,c)}for(M in s)if(c=s[M],f=a[M],s.hasOwnProperty(M)&&(c!=null||f!=null))switch(M){case"value":nt=c;break;case"defaultValue":at=c;break;case"children":break;case"dangerouslySetInnerHTML":if(c!=null)throw Error(r(91));break;default:c!==f&&Be(t,n,M,c,s,f)}wd(t,nt,at);return;case"option":for(var se in a)nt=a[se],a.hasOwnProperty(se)&&nt!=null&&!s.hasOwnProperty(se)&&(se==="selected"?t.selected=!1:Be(t,n,se,null,s,nt));for(z in s)nt=s[z],at=a[z],s.hasOwnProperty(z)&&nt!==at&&(nt!=null||at!=null)&&(z==="selected"?t.selected=nt&&typeof nt!="function"&&typeof nt!="symbol":Be(t,n,z,nt,s,at));return;case"img":case"link":case"area":case"base":case"br":case"col":case"embed":case"hr":case"keygen":case"meta":case"param":case"source":case"track":case"wbr":case"menuitem":for(var te in a)nt=a[te],a.hasOwnProperty(te)&&nt!=null&&!s.hasOwnProperty(te)&&Be(t,n,te,null,s,nt);for(K in s)if(nt=s[K],at=a[K],s.hasOwnProperty(K)&&nt!==at&&(nt!=null||at!=null))switch(K){case"children":case"dangerouslySetInnerHTML":if(nt!=null)throw Error(r(137,n));break;default:Be(t,n,K,nt,s,at)}return;default:if(Tc(n)){for(var Ie in a)nt=a[Ie],a.hasOwnProperty(Ie)&&nt!==void 0&&!s.hasOwnProperty(Ie)&&cf(t,n,Ie,void 0,s,nt);for(dt in s)nt=s[dt],at=a[dt],!s.hasOwnProperty(dt)||nt===at||nt===void 0&&at===void 0||cf(t,n,dt,nt,s,at);return}}for(var Y in a)nt=a[Y],a.hasOwnProperty(Y)&&nt!=null&&!s.hasOwnProperty(Y)&&Be(t,n,Y,null,s,nt);for(gt in s)nt=s[gt],at=a[gt],!s.hasOwnProperty(gt)||nt===at||nt==null&&at==null||Be(t,n,gt,nt,s,at)}var uf=null,ff=null;function Rl(t){return t.nodeType===9?t:t.ownerDocument}function Dm(t){switch(t){case"http://www.w3.org/2000/svg":return 1;case"http://www.w3.org/1998/Math/MathML":return 2;default:return 0}}function Lm(t,n){if(t===0)switch(n){case"svg":return 1;case"math":return 2;default:return 0}return t===1&&n==="foreignObject"?0:t}function df(t,n){return t==="textarea"||t==="noscript"||typeof n.children=="string"||typeof n.children=="number"||typeof n.children=="bigint"||typeof n.dangerouslySetInnerHTML=="object"&&n.dangerouslySetInnerHTML!==null&&n.dangerouslySetInnerHTML.__html!=null}var hf=null;function X0(){var t=window.event;return t&&t.type==="popstate"?t===hf?!1:(hf=t,!0):(hf=null,!1)}var Um=typeof setTimeout=="function"?setTimeout:void 0,W0=typeof clearTimeout=="function"?clearTimeout:void 0,Nm=typeof Promise=="function"?Promise:void 0,q0=typeof queueMicrotask=="function"?queueMicrotask:typeof Nm<"u"?function(t){return Nm.resolve(null).then(t).catch(Y0)}:Um;function Y0(t){setTimeout(function(){throw t})}function va(t){return t==="head"}function Om(t,n){var a=n,s=0,c=0;do{var f=a.nextSibling;if(t.removeChild(a),f&&f.nodeType===8)if(a=f.data,a==="/$"){if(0<s&&8>s){a=s;var M=t.ownerDocument;if(a&1&&so(M.documentElement),a&2&&so(M.body),a&4)for(a=M.head,so(a),M=a.firstChild;M;){var E=M.nextSibling,z=M.nodeName;M[xn]||z==="SCRIPT"||z==="STYLE"||z==="LINK"&&M.rel.toLowerCase()==="stylesheet"||a.removeChild(M),M=E}}if(c===0){t.removeChild(f),mo(n);return}c--}else a==="$"||a==="$?"||a==="$!"?c++:s=a.charCodeAt(0)-48;else s=0;a=f}while(a);mo(n)}function pf(t){var n=t.firstChild;for(n&&n.nodeType===10&&(n=n.nextSibling);n;){var a=n;switch(n=n.nextSibling,a.nodeName){case"HTML":case"HEAD":case"BODY":pf(a),Rn(a);continue;case"SCRIPT":case"STYLE":continue;case"LINK":if(a.rel.toLowerCase()==="stylesheet")continue}t.removeChild(a)}}function j0(t,n,a,s){for(;t.nodeType===1;){var c=a;if(t.nodeName.toLowerCase()!==n.toLowerCase()){if(!s&&(t.nodeName!=="INPUT"||t.type!=="hidden"))break}else if(s){if(!t[xn])switch(n){case"meta":if(!t.hasAttribute("itemprop"))break;return t;case"link":if(f=t.getAttribute("rel"),f==="stylesheet"&&t.hasAttribute("data-precedence"))break;if(f!==c.rel||t.getAttribute("href")!==(c.href==null||c.href===""?null:c.href)||t.getAttribute("crossorigin")!==(c.crossOrigin==null?null:c.crossOrigin)||t.getAttribute("title")!==(c.title==null?null:c.title))break;return t;case"style":if(t.hasAttribute("data-precedence"))break;return t;case"script":if(f=t.getAttribute("src"),(f!==(c.src==null?null:c.src)||t.getAttribute("type")!==(c.type==null?null:c.type)||t.getAttribute("crossorigin")!==(c.crossOrigin==null?null:c.crossOrigin))&&f&&t.hasAttribute("async")&&!t.hasAttribute("itemprop"))break;return t;default:return t}}else if(n==="input"&&t.type==="hidden"){var f=c.name==null?null:""+c.name;if(c.type==="hidden"&&t.getAttribute("name")===f)return t}else return t;if(t=vi(t.nextSibling),t===null)break}return null}function Z0(t,n,a){if(n==="")return null;for(;t.nodeType!==3;)if((t.nodeType!==1||t.nodeName!=="INPUT"||t.type!=="hidden")&&!a||(t=vi(t.nextSibling),t===null))return null;return t}function mf(t){return t.data==="$!"||t.data==="$?"&&t.ownerDocument.readyState==="complete"}function K0(t,n){var a=t.ownerDocument;if(t.data!=="$?"||a.readyState==="complete")n();else{var s=function(){n(),a.removeEventListener("DOMContentLoaded",s)};a.addEventListener("DOMContentLoaded",s),t._reactRetry=s}}function vi(t){for(;t!=null;t=t.nextSibling){var n=t.nodeType;if(n===1||n===3)break;if(n===8){if(n=t.data,n==="$"||n==="$!"||n==="$?"||n==="F!"||n==="F")break;if(n==="/$")return null}}return t}var gf=null;function Pm(t){t=t.previousSibling;for(var n=0;t;){if(t.nodeType===8){var a=t.data;if(a==="$"||a==="$!"||a==="$?"){if(n===0)return t;n--}else a==="/$"&&n++}t=t.previousSibling}return null}function zm(t,n,a){switch(n=Rl(a),t){case"html":if(t=n.documentElement,!t)throw Error(r(452));return t;case"head":if(t=n.head,!t)throw Error(r(453));return t;case"body":if(t=n.body,!t)throw Error(r(454));return t;default:throw Error(r(451))}}function so(t){for(var n=t.attributes;n.length;)t.removeAttributeNode(n[0]);Rn(t)}var ui=new Map,Bm=new Set;function wl(t){return typeof t.getRootNode=="function"?t.getRootNode():t.nodeType===9?t:t.ownerDocument}var Xi=q.d;q.d={f:Q0,r:J0,D:$0,C:tS,L:eS,m:nS,X:aS,S:iS,M:rS};function Q0(){var t=Xi.f(),n=Sl();return t||n}function J0(t){var n=qn(t);n!==null&&n.tag===5&&n.type==="form"?ip(n):Xi.r(t)}var Wr=typeof document>"u"?null:document;function Im(t,n,a){var s=Wr;if(s&&typeof n=="string"&&n){var c=je(n);c='link[rel="'+t+'"][href="'+c+'"]',typeof a=="string"&&(c+='[crossorigin="'+a+'"]'),Bm.has(c)||(Bm.add(c),t={rel:t,crossOrigin:a,href:n},s.querySelector(c)===null&&(n=s.createElement("link"),Tn(n,"link",t),W(n),s.head.appendChild(n)))}}function $0(t){Xi.D(t),Im("dns-prefetch",t,null)}function tS(t,n){Xi.C(t,n),Im("preconnect",t,n)}function eS(t,n,a){Xi.L(t,n,a);var s=Wr;if(s&&t&&n){var c='link[rel="preload"][as="'+je(n)+'"]';n==="image"&&a&&a.imageSrcSet?(c+='[imagesrcset="'+je(a.imageSrcSet)+'"]',typeof a.imageSizes=="string"&&(c+='[imagesizes="'+je(a.imageSizes)+'"]')):c+='[href="'+je(t)+'"]';var f=c;switch(n){case"style":f=qr(t);break;case"script":f=Yr(t)}ui.has(f)||(t=g({rel:"preload",href:n==="image"&&a&&a.imageSrcSet?void 0:t,as:n},a),ui.set(f,t),s.querySelector(c)!==null||n==="style"&&s.querySelector(oo(f))||n==="script"&&s.querySelector(lo(f))||(n=s.createElement("link"),Tn(n,"link",t),W(n),s.head.appendChild(n)))}}function nS(t,n){Xi.m(t,n);var a=Wr;if(a&&t){var s=n&&typeof n.as=="string"?n.as:"script",c='link[rel="modulepreload"][as="'+je(s)+'"][href="'+je(t)+'"]',f=c;switch(s){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":f=Yr(t)}if(!ui.has(f)&&(t=g({rel:"modulepreload",href:t},n),ui.set(f,t),a.querySelector(c)===null)){switch(s){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":if(a.querySelector(lo(f)))return}s=a.createElement("link"),Tn(s,"link",t),W(s),a.head.appendChild(s)}}}function iS(t,n,a){Xi.S(t,n,a);var s=Wr;if(s&&t){var c=w(s).hoistableStyles,f=qr(t);n=n||"default";var M=c.get(f);if(!M){var E={loading:0,preload:null};if(M=s.querySelector(oo(f)))E.loading=5;else{t=g({rel:"stylesheet",href:t,"data-precedence":n},a),(a=ui.get(f))&&_f(t,a);var z=M=s.createElement("link");W(z),Tn(z,"link",t),z._p=new Promise(function(K,dt){z.onload=K,z.onerror=dt}),z.addEventListener("load",function(){E.loading|=1}),z.addEventListener("error",function(){E.loading|=2}),E.loading|=4,Cl(M,n,s)}M={type:"stylesheet",instance:M,count:1,state:E},c.set(f,M)}}}function aS(t,n){Xi.X(t,n);var a=Wr;if(a&&t){var s=w(a).hoistableScripts,c=Yr(t),f=s.get(c);f||(f=a.querySelector(lo(c)),f||(t=g({src:t,async:!0},n),(n=ui.get(c))&&vf(t,n),f=a.createElement("script"),W(f),Tn(f,"link",t),a.head.appendChild(f)),f={type:"script",instance:f,count:1,state:null},s.set(c,f))}}function rS(t,n){Xi.M(t,n);var a=Wr;if(a&&t){var s=w(a).hoistableScripts,c=Yr(t),f=s.get(c);f||(f=a.querySelector(lo(c)),f||(t=g({src:t,async:!0,type:"module"},n),(n=ui.get(c))&&vf(t,n),f=a.createElement("script"),W(f),Tn(f,"link",t),a.head.appendChild(f)),f={type:"script",instance:f,count:1,state:null},s.set(c,f))}}function Fm(t,n,a,s){var c=(c=pt.current)?wl(c):null;if(!c)throw Error(r(446));switch(t){case"meta":case"title":return null;case"style":return typeof a.precedence=="string"&&typeof a.href=="string"?(n=qr(a.href),a=w(c).hoistableStyles,s=a.get(n),s||(s={type:"style",instance:null,count:0,state:null},a.set(n,s)),s):{type:"void",instance:null,count:0,state:null};case"link":if(a.rel==="stylesheet"&&typeof a.href=="string"&&typeof a.precedence=="string"){t=qr(a.href);var f=w(c).hoistableStyles,M=f.get(t);if(M||(c=c.ownerDocument||c,M={type:"stylesheet",instance:null,count:0,state:{loading:0,preload:null}},f.set(t,M),(f=c.querySelector(oo(t)))&&!f._p&&(M.instance=f,M.state.loading=5),ui.has(t)||(a={rel:"preload",as:"style",href:a.href,crossOrigin:a.crossOrigin,integrity:a.integrity,media:a.media,hrefLang:a.hrefLang,referrerPolicy:a.referrerPolicy},ui.set(t,a),f||sS(c,t,a,M.state))),n&&s===null)throw Error(r(528,""));return M}if(n&&s!==null)throw Error(r(529,""));return null;case"script":return n=a.async,a=a.src,typeof a=="string"&&n&&typeof n!="function"&&typeof n!="symbol"?(n=Yr(a),a=w(c).hoistableScripts,s=a.get(n),s||(s={type:"script",instance:null,count:0,state:null},a.set(n,s)),s):{type:"void",instance:null,count:0,state:null};default:throw Error(r(444,t))}}function qr(t){return'href="'+je(t)+'"'}function oo(t){return'link[rel="stylesheet"]['+t+"]"}function Hm(t){return g({},t,{"data-precedence":t.precedence,precedence:null})}function sS(t,n,a,s){t.querySelector('link[rel="preload"][as="style"]['+n+"]")?s.loading=1:(n=t.createElement("link"),s.preload=n,n.addEventListener("load",function(){return s.loading|=1}),n.addEventListener("error",function(){return s.loading|=2}),Tn(n,"link",a),W(n),t.head.appendChild(n))}function Yr(t){return'[src="'+je(t)+'"]'}function lo(t){return"script[async]"+t}function Gm(t,n,a){if(n.count++,n.instance===null)switch(n.type){case"style":var s=t.querySelector('style[data-href~="'+je(a.href)+'"]');if(s)return n.instance=s,W(s),s;var c=g({},a,{"data-href":a.href,"data-precedence":a.precedence,href:null,precedence:null});return s=(t.ownerDocument||t).createElement("style"),W(s),Tn(s,"style",c),Cl(s,a.precedence,t),n.instance=s;case"stylesheet":c=qr(a.href);var f=t.querySelector(oo(c));if(f)return n.state.loading|=4,n.instance=f,W(f),f;s=Hm(a),(c=ui.get(c))&&_f(s,c),f=(t.ownerDocument||t).createElement("link"),W(f);var M=f;return M._p=new Promise(function(E,z){M.onload=E,M.onerror=z}),Tn(f,"link",s),n.state.loading|=4,Cl(f,a.precedence,t),n.instance=f;case"script":return f=Yr(a.src),(c=t.querySelector(lo(f)))?(n.instance=c,W(c),c):(s=a,(c=ui.get(f))&&(s=g({},a),vf(s,c)),t=t.ownerDocument||t,c=t.createElement("script"),W(c),Tn(c,"link",s),t.head.appendChild(c),n.instance=c);case"void":return null;default:throw Error(r(443,n.type))}else n.type==="stylesheet"&&(n.state.loading&4)===0&&(s=n.instance,n.state.loading|=4,Cl(s,a.precedence,t));return n.instance}function Cl(t,n,a){for(var s=a.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),c=s.length?s[s.length-1]:null,f=c,M=0;M<s.length;M++){var E=s[M];if(E.dataset.precedence===n)f=E;else if(f!==c)break}f?f.parentNode.insertBefore(t,f.nextSibling):(n=a.nodeType===9?a.head:a,n.insertBefore(t,n.firstChild))}function _f(t,n){t.crossOrigin==null&&(t.crossOrigin=n.crossOrigin),t.referrerPolicy==null&&(t.referrerPolicy=n.referrerPolicy),t.title==null&&(t.title=n.title)}function vf(t,n){t.crossOrigin==null&&(t.crossOrigin=n.crossOrigin),t.referrerPolicy==null&&(t.referrerPolicy=n.referrerPolicy),t.integrity==null&&(t.integrity=n.integrity)}var Dl=null;function Vm(t,n,a){if(Dl===null){var s=new Map,c=Dl=new Map;c.set(a,s)}else c=Dl,s=c.get(a),s||(s=new Map,c.set(a,s));if(s.has(t))return s;for(s.set(t,null),a=a.getElementsByTagName(t),c=0;c<a.length;c++){var f=a[c];if(!(f[xn]||f[Bt]||t==="link"&&f.getAttribute("rel")==="stylesheet")&&f.namespaceURI!=="http://www.w3.org/2000/svg"){var M=f.getAttribute(n)||"";M=t+M;var E=s.get(M);E?E.push(f):s.set(M,[f])}}return s}function km(t,n,a){t=t.ownerDocument||t,t.head.insertBefore(a,n==="title"?t.querySelector("head > title"):null)}function oS(t,n,a){if(a===1||n.itemProp!=null)return!1;switch(t){case"meta":case"title":return!0;case"style":if(typeof n.precedence!="string"||typeof n.href!="string"||n.href==="")break;return!0;case"link":if(typeof n.rel!="string"||typeof n.href!="string"||n.href===""||n.onLoad||n.onError)break;return n.rel==="stylesheet"?(t=n.disabled,typeof n.precedence=="string"&&t==null):!0;case"script":if(n.async&&typeof n.async!="function"&&typeof n.async!="symbol"&&!n.onLoad&&!n.onError&&n.src&&typeof n.src=="string")return!0}return!1}function Xm(t){return!(t.type==="stylesheet"&&(t.state.loading&3)===0)}var co=null;function lS(){}function cS(t,n,a){if(co===null)throw Error(r(475));var s=co;if(n.type==="stylesheet"&&(typeof a.media!="string"||matchMedia(a.media).matches!==!1)&&(n.state.loading&4)===0){if(n.instance===null){var c=qr(a.href),f=t.querySelector(oo(c));if(f){t=f._p,t!==null&&typeof t=="object"&&typeof t.then=="function"&&(s.count++,s=Ll.bind(s),t.then(s,s)),n.state.loading|=4,n.instance=f,W(f);return}f=t.ownerDocument||t,a=Hm(a),(c=ui.get(c))&&_f(a,c),f=f.createElement("link"),W(f);var M=f;M._p=new Promise(function(E,z){M.onload=E,M.onerror=z}),Tn(f,"link",a),n.instance=f}s.stylesheets===null&&(s.stylesheets=new Map),s.stylesheets.set(n,t),(t=n.state.preload)&&(n.state.loading&3)===0&&(s.count++,n=Ll.bind(s),t.addEventListener("load",n),t.addEventListener("error",n))}}function uS(){if(co===null)throw Error(r(475));var t=co;return t.stylesheets&&t.count===0&&Sf(t,t.stylesheets),0<t.count?function(n){var a=setTimeout(function(){if(t.stylesheets&&Sf(t,t.stylesheets),t.unsuspend){var s=t.unsuspend;t.unsuspend=null,s()}},6e4);return t.unsuspend=n,function(){t.unsuspend=null,clearTimeout(a)}}:null}function Ll(){if(this.count--,this.count===0){if(this.stylesheets)Sf(this,this.stylesheets);else if(this.unsuspend){var t=this.unsuspend;this.unsuspend=null,t()}}}var Ul=null;function Sf(t,n){t.stylesheets=null,t.unsuspend!==null&&(t.count++,Ul=new Map,n.forEach(fS,t),Ul=null,Ll.call(t))}function fS(t,n){if(!(n.state.loading&4)){var a=Ul.get(t);if(a)var s=a.get(null);else{a=new Map,Ul.set(t,a);for(var c=t.querySelectorAll("link[data-precedence],style[data-precedence]"),f=0;f<c.length;f++){var M=c[f];(M.nodeName==="LINK"||M.getAttribute("media")!=="not all")&&(a.set(M.dataset.precedence,M),s=M)}s&&a.set(null,s)}c=n.instance,M=c.getAttribute("data-precedence"),f=a.get(M)||s,f===s&&a.set(null,c),a.set(M,c),this.count++,s=Ll.bind(this),c.addEventListener("load",s),c.addEventListener("error",s),f?f.parentNode.insertBefore(c,f.nextSibling):(t=t.nodeType===9?t.head:t,t.insertBefore(c,t.firstChild)),n.state.loading|=4}}var uo={$$typeof:D,Provider:null,Consumer:null,_currentValue:j,_currentValue2:j,_threadCount:0};function dS(t,n,a,s,c,f,M,E){this.tag=1,this.containerInfo=t,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=H(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=H(0),this.hiddenUpdates=H(null),this.identifierPrefix=s,this.onUncaughtError=c,this.onCaughtError=f,this.onRecoverableError=M,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=E,this.incompleteTransitions=new Map}function Wm(t,n,a,s,c,f,M,E,z,K,dt,gt){return t=new dS(t,n,a,M,E,z,K,gt),n=1,f===!0&&(n|=24),f=jn(3,null,null,n),t.current=f,f.stateNode=t,n=$c(),n.refCount++,t.pooledCache=n,n.refCount++,f.memoizedState={element:s,isDehydrated:a,cache:n},iu(f),t}function qm(t){return t?(t=Tr,t):Tr}function Ym(t,n,a,s,c,f){c=qm(c),s.context===null?s.context=c:s.pendingContext=c,s=ra(n),s.payload={element:a},f=f===void 0?null:f,f!==null&&(s.callback=f),a=sa(t,s,n),a!==null&&($n(a,t,n),Hs(a,t,n))}function jm(t,n){if(t=t.memoizedState,t!==null&&t.dehydrated!==null){var a=t.retryLane;t.retryLane=a!==0&&a<n?a:n}}function xf(t,n){jm(t,n),(t=t.alternate)&&jm(t,n)}function Zm(t){if(t.tag===13){var n=Er(t,67108864);n!==null&&$n(n,t,67108864),xf(t,67108864)}}var Nl=!0;function hS(t,n,a,s){var c=O.T;O.T=null;var f=q.p;try{q.p=2,Mf(t,n,a,s)}finally{q.p=f,O.T=c}}function pS(t,n,a,s){var c=O.T;O.T=null;var f=q.p;try{q.p=8,Mf(t,n,a,s)}finally{q.p=f,O.T=c}}function Mf(t,n,a,s){if(Nl){var c=yf(s);if(c===null)lf(t,n,s,Ol,a),Qm(t,s);else if(gS(c,t,n,a,s))s.stopPropagation();else if(Qm(t,s),n&4&&-1<mS.indexOf(t)){for(;c!==null;){var f=qn(c);if(f!==null)switch(f.tag){case 3:if(f=f.stateNode,f.current.memoizedState.isDehydrated){var M=zt(f.pendingLanes);if(M!==0){var E=f;for(E.pendingLanes|=2,E.entangledLanes|=2;M;){var z=1<<31-kt(M);E.entanglements[1]|=z,M&=~z}Ci(f),(Ne&6)===0&&(_l=Se()+500,io(0))}}break;case 13:E=Er(f,2),E!==null&&$n(E,f,2),Sl(),xf(f,2)}if(f=yf(s),f===null&&lf(t,n,s,Ol,a),f===c)break;c=f}c!==null&&s.stopPropagation()}else lf(t,n,s,null,a)}}function yf(t){return t=Ac(t),Ef(t)}var Ol=null;function Ef(t){if(Ol=null,t=cn(t),t!==null){var n=u(t);if(n===null)t=null;else{var a=n.tag;if(a===13){if(t=h(n),t!==null)return t;t=null}else if(a===3){if(n.stateNode.current.memoizedState.isDehydrated)return n.tag===3?n.stateNode.containerInfo:null;t=null}else n!==t&&(t=null)}}return Ol=t,null}function Km(t){switch(t){case"beforetoggle":case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"toggle":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 2;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 8;case"message":switch(ue()){case L:return 2;case T:return 8;case et:case St:return 32;case vt:return 268435456;default:return 32}default:return 32}}var Tf=!1,Sa=null,xa=null,Ma=null,fo=new Map,ho=new Map,ya=[],mS="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");function Qm(t,n){switch(t){case"focusin":case"focusout":Sa=null;break;case"dragenter":case"dragleave":xa=null;break;case"mouseover":case"mouseout":Ma=null;break;case"pointerover":case"pointerout":fo.delete(n.pointerId);break;case"gotpointercapture":case"lostpointercapture":ho.delete(n.pointerId)}}function po(t,n,a,s,c,f){return t===null||t.nativeEvent!==f?(t={blockedOn:n,domEventName:a,eventSystemFlags:s,nativeEvent:f,targetContainers:[c]},n!==null&&(n=qn(n),n!==null&&Zm(n)),t):(t.eventSystemFlags|=s,n=t.targetContainers,c!==null&&n.indexOf(c)===-1&&n.push(c),t)}function gS(t,n,a,s,c){switch(n){case"focusin":return Sa=po(Sa,t,n,a,s,c),!0;case"dragenter":return xa=po(xa,t,n,a,s,c),!0;case"mouseover":return Ma=po(Ma,t,n,a,s,c),!0;case"pointerover":var f=c.pointerId;return fo.set(f,po(fo.get(f)||null,t,n,a,s,c)),!0;case"gotpointercapture":return f=c.pointerId,ho.set(f,po(ho.get(f)||null,t,n,a,s,c)),!0}return!1}function Jm(t){var n=cn(t.target);if(n!==null){var a=u(n);if(a!==null){if(n=a.tag,n===13){if(n=h(a),n!==null){t.blockedOn=n,Ot(t.priority,function(){if(a.tag===13){var s=Jn();s=Ce(s);var c=Er(a,s);c!==null&&$n(c,a,s),xf(a,s)}});return}}else if(n===3&&a.stateNode.current.memoizedState.isDehydrated){t.blockedOn=a.tag===3?a.stateNode.containerInfo:null;return}}}t.blockedOn=null}function Pl(t){if(t.blockedOn!==null)return!1;for(var n=t.targetContainers;0<n.length;){var a=yf(t.nativeEvent);if(a===null){a=t.nativeEvent;var s=new a.constructor(a.type,a);bc=s,a.target.dispatchEvent(s),bc=null}else return n=qn(a),n!==null&&Zm(n),t.blockedOn=a,!1;n.shift()}return!0}function $m(t,n,a){Pl(t)&&a.delete(n)}function _S(){Tf=!1,Sa!==null&&Pl(Sa)&&(Sa=null),xa!==null&&Pl(xa)&&(xa=null),Ma!==null&&Pl(Ma)&&(Ma=null),fo.forEach($m),ho.forEach($m)}function zl(t,n){t.blockedOn===n&&(t.blockedOn=null,Tf||(Tf=!0,o.unstable_scheduleCallback(o.unstable_NormalPriority,_S)))}var Bl=null;function tg(t){Bl!==t&&(Bl=t,o.unstable_scheduleCallback(o.unstable_NormalPriority,function(){Bl===t&&(Bl=null);for(var n=0;n<t.length;n+=3){var a=t[n],s=t[n+1],c=t[n+2];if(typeof s!="function"){if(Ef(s||a)===null)continue;break}var f=qn(a);f!==null&&(t.splice(n,3),n-=3,yu(f,{pending:!0,data:c,method:a.method,action:s},s,c))}}))}function mo(t){function n(z){return zl(z,t)}Sa!==null&&zl(Sa,t),xa!==null&&zl(xa,t),Ma!==null&&zl(Ma,t),fo.forEach(n),ho.forEach(n);for(var a=0;a<ya.length;a++){var s=ya[a];s.blockedOn===t&&(s.blockedOn=null)}for(;0<ya.length&&(a=ya[0],a.blockedOn===null);)Jm(a),a.blockedOn===null&&ya.shift();if(a=(t.ownerDocument||t).$$reactFormReplay,a!=null)for(s=0;s<a.length;s+=3){var c=a[s],f=a[s+1],M=c[le]||null;if(typeof f=="function")M||tg(a);else if(M){var E=null;if(f&&f.hasAttribute("formAction")){if(c=f,M=f[le]||null)E=M.formAction;else if(Ef(c)!==null)continue}else E=M.action;typeof E=="function"?a[s+1]=E:(a.splice(s,3),s-=3),tg(a)}}}function bf(t){this._internalRoot=t}Il.prototype.render=bf.prototype.render=function(t){var n=this._internalRoot;if(n===null)throw Error(r(409));var a=n.current,s=Jn();Ym(a,s,t,n,null,null)},Il.prototype.unmount=bf.prototype.unmount=function(){var t=this._internalRoot;if(t!==null){this._internalRoot=null;var n=t.containerInfo;Ym(t.current,2,null,t,null,null),Sl(),n[Pe]=null}};function Il(t){this._internalRoot=t}Il.prototype.unstable_scheduleHydration=function(t){if(t){var n=Rt();t={blockedOn:null,target:t,priority:n};for(var a=0;a<ya.length&&n!==0&&n<ya[a].priority;a++);ya.splice(a,0,t),a===0&&Jm(t)}};var eg=e.version;if(eg!=="19.1.0")throw Error(r(527,eg,"19.1.0"));q.findDOMNode=function(t){var n=t._reactInternals;if(n===void 0)throw typeof t.render=="function"?Error(r(188)):(t=Object.keys(t).join(","),Error(r(268,t)));return t=m(n),t=t!==null?p(t):null,t=t===null?null:t.stateNode,t};var vS={bundleType:0,version:"19.1.0",rendererPackageName:"react-dom",currentDispatcherRef:O,reconcilerVersion:"19.1.0"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Fl=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Fl.isDisabled&&Fl.supportsFiber)try{Tt=Fl.inject(vS),Dt=Fl}catch{}}return _o.createRoot=function(t,n){if(!l(t))throw Error(r(299));var a=!1,s="",c=_p,f=vp,M=Sp,E=null;return n!=null&&(n.unstable_strictMode===!0&&(a=!0),n.identifierPrefix!==void 0&&(s=n.identifierPrefix),n.onUncaughtError!==void 0&&(c=n.onUncaughtError),n.onCaughtError!==void 0&&(f=n.onCaughtError),n.onRecoverableError!==void 0&&(M=n.onRecoverableError),n.unstable_transitionCallbacks!==void 0&&(E=n.unstable_transitionCallbacks)),n=Wm(t,1,!1,null,null,a,s,c,f,M,E,null),t[Pe]=n.current,of(t),new bf(n)},_o.hydrateRoot=function(t,n,a){if(!l(t))throw Error(r(299));var s=!1,c="",f=_p,M=vp,E=Sp,z=null,K=null;return a!=null&&(a.unstable_strictMode===!0&&(s=!0),a.identifierPrefix!==void 0&&(c=a.identifierPrefix),a.onUncaughtError!==void 0&&(f=a.onUncaughtError),a.onCaughtError!==void 0&&(M=a.onCaughtError),a.onRecoverableError!==void 0&&(E=a.onRecoverableError),a.unstable_transitionCallbacks!==void 0&&(z=a.unstable_transitionCallbacks),a.formState!==void 0&&(K=a.formState)),n=Wm(t,1,!0,n,a??null,s,c,f,M,E,z,K),n.context=qm(null),a=n.current,s=Jn(),s=Ce(s),c=ra(s),c.callback=null,sa(a,c,s),a=s,n.current.lanes=a,At(n,a),Ci(n),t[Pe]=n.current,of(t),new Il(n)},_o.version="19.1.0",_o}var fg;function wS(){if(fg)return Rf.exports;fg=1;function o(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(o)}catch(e){console.error(e)}}return o(),Rf.exports=RS(),Rf.exports}var CS=wS(),Wt=yd();const Ed="160",DS=0,dg=1,LS=2,B_=1,US=2,Ki=3,Pa=0,Xn=1,Qi=2,Ua=0,ds=1,ud=2,hg=3,pg=4,NS=5,or=100,OS=101,PS=102,mg=103,gg=104,zS=200,BS=201,IS=202,FS=203,fd=204,dd=205,HS=206,GS=207,VS=208,kS=209,XS=210,WS=211,qS=212,YS=213,jS=214,ZS=0,KS=1,QS=2,hc=3,JS=4,$S=5,tx=6,ex=7,I_=0,nx=1,ix=2,Na=0,ax=1,rx=2,sx=3,ox=4,lx=5,cx=6,F_=300,ps=301,ms=302,hd=303,pd=304,Sc=306,md=1e3,Ei=1001,gd=1002,zn=1003,_g=1004,Uf=1005,di=1006,ux=1007,Ao=1008,Oa=1009,fx=1010,dx=1011,Td=1012,H_=1013,Ca=1014,Da=1015,Ro=1016,G_=1017,V_=1018,cr=1020,hx=1021,Ti=1023,px=1024,mx=1025,ur=1026,gs=1027,gx=1028,k_=1029,_x=1030,X_=1031,W_=1033,Nf=33776,Of=33777,Pf=33778,zf=33779,vg=35840,Sg=35841,xg=35842,Mg=35843,q_=36196,yg=37492,Eg=37496,Tg=37808,bg=37809,Ag=37810,Rg=37811,wg=37812,Cg=37813,Dg=37814,Lg=37815,Ug=37816,Ng=37817,Og=37818,Pg=37819,zg=37820,Bg=37821,Bf=36492,Ig=36494,Fg=36495,vx=36283,Hg=36284,Gg=36285,Vg=36286,Y_=3e3,fr=3001,Sx=3200,xx=3201,Mx=0,yx=1,pi="",bn="srgb",$i="srgb-linear",bd="display-p3",xc="display-p3-linear",pc="linear",Ze="srgb",mc="rec709",gc="p3",jr=7680,kg=519,Ex=512,Tx=513,bx=514,j_=515,Ax=516,Rx=517,wx=518,Cx=519,Xg=35044,Wg="300 es",_d=1035,Ji=2e3,_c=2001;class vs{addEventListener(e,i){this._listeners===void 0&&(this._listeners={});const r=this._listeners;r[e]===void 0&&(r[e]=[]),r[e].indexOf(i)===-1&&r[e].push(i)}hasEventListener(e,i){if(this._listeners===void 0)return!1;const r=this._listeners;return r[e]!==void 0&&r[e].indexOf(i)!==-1}removeEventListener(e,i){if(this._listeners===void 0)return;const l=this._listeners[e];if(l!==void 0){const u=l.indexOf(i);u!==-1&&l.splice(u,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const r=this._listeners[e.type];if(r!==void 0){e.target=this;const l=r.slice(0);for(let u=0,h=l.length;u<h;u++)l[u].call(this,e);e.target=null}}}const Ln=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],If=Math.PI/180,vd=180/Math.PI;function wo(){const o=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(Ln[o&255]+Ln[o>>8&255]+Ln[o>>16&255]+Ln[o>>24&255]+"-"+Ln[e&255]+Ln[e>>8&255]+"-"+Ln[e>>16&15|64]+Ln[e>>24&255]+"-"+Ln[i&63|128]+Ln[i>>8&255]+"-"+Ln[i>>16&255]+Ln[i>>24&255]+Ln[r&255]+Ln[r>>8&255]+Ln[r>>16&255]+Ln[r>>24&255]).toLowerCase()}function kn(o,e,i){return Math.max(e,Math.min(i,o))}function Dx(o,e){return(o%e+e)%e}function Ff(o,e,i){return(1-i)*o+i*e}function qg(o){return(o&o-1)===0&&o!==0}function Sd(o){return Math.pow(2,Math.floor(Math.log(o)/Math.LN2))}function vo(o,e){switch(e.constructor){case Float32Array:return o;case Uint32Array:return o/4294967295;case Uint16Array:return o/65535;case Uint8Array:return o/255;case Int32Array:return Math.max(o/2147483647,-1);case Int16Array:return Math.max(o/32767,-1);case Int8Array:return Math.max(o/127,-1);default:throw new Error("Invalid component type.")}}function Vn(o,e){switch(e.constructor){case Float32Array:return o;case Uint32Array:return Math.round(o*4294967295);case Uint16Array:return Math.round(o*65535);case Uint8Array:return Math.round(o*255);case Int32Array:return Math.round(o*2147483647);case Int16Array:return Math.round(o*32767);case Int8Array:return Math.round(o*127);default:throw new Error("Invalid component type.")}}class He{constructor(e=0,i=0){He.prototype.isVector2=!0,this.x=e,this.y=i}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,i){return this.x=e,this.y=i,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,i){switch(e){case 0:this.x=i;break;case 1:this.y=i;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,i){return this.x=e.x+i.x,this.y=e.y+i.y,this}addScaledVector(e,i){return this.x+=e.x*i,this.y+=e.y*i,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,i){return this.x=e.x-i.x,this.y=e.y-i.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const i=this.x,r=this.y,l=e.elements;return this.x=l[0]*i+l[3]*r+l[6],this.y=l[1]*i+l[4]*r+l[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,i){return this.x=Math.max(e.x,Math.min(i.x,this.x)),this.y=Math.max(e.y,Math.min(i.y,this.y)),this}clampScalar(e,i){return this.x=Math.max(e,Math.min(i,this.x)),this.y=Math.max(e,Math.min(i,this.y)),this}clampLength(e,i){const r=this.length();return this.divideScalar(r||1).multiplyScalar(Math.max(e,Math.min(i,r)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const i=Math.sqrt(this.lengthSq()*e.lengthSq());if(i===0)return Math.PI/2;const r=this.dot(e)/i;return Math.acos(kn(r,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const i=this.x-e.x,r=this.y-e.y;return i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,i){return this.x+=(e.x-this.x)*i,this.y+=(e.y-this.y)*i,this}lerpVectors(e,i,r){return this.x=e.x+(i.x-e.x)*r,this.y=e.y+(i.y-e.y)*r,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,i=0){return this.x=e[i],this.y=e[i+1],this}toArray(e=[],i=0){return e[i]=this.x,e[i+1]=this.y,e}fromBufferAttribute(e,i){return this.x=e.getX(i),this.y=e.getY(i),this}rotateAround(e,i){const r=Math.cos(i),l=Math.sin(i),u=this.x-e.x,h=this.y-e.y;return this.x=u*r-h*l+e.x,this.y=u*l+h*r+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Me{constructor(e,i,r,l,u,h,d,m,p){Me.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,i,r,l,u,h,d,m,p)}set(e,i,r,l,u,h,d,m,p){const g=this.elements;return g[0]=e,g[1]=l,g[2]=d,g[3]=i,g[4]=u,g[5]=m,g[6]=r,g[7]=h,g[8]=p,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const i=this.elements,r=e.elements;return i[0]=r[0],i[1]=r[1],i[2]=r[2],i[3]=r[3],i[4]=r[4],i[5]=r[5],i[6]=r[6],i[7]=r[7],i[8]=r[8],this}extractBasis(e,i,r){return e.setFromMatrix3Column(this,0),i.setFromMatrix3Column(this,1),r.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const i=e.elements;return this.set(i[0],i[4],i[8],i[1],i[5],i[9],i[2],i[6],i[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,i){const r=e.elements,l=i.elements,u=this.elements,h=r[0],d=r[3],m=r[6],p=r[1],g=r[4],v=r[7],S=r[2],y=r[5],b=r[8],A=l[0],x=l[3],_=l[6],N=l[1],D=l[4],P=l[7],G=l[2],F=l[5],I=l[8];return u[0]=h*A+d*N+m*G,u[3]=h*x+d*D+m*F,u[6]=h*_+d*P+m*I,u[1]=p*A+g*N+v*G,u[4]=p*x+g*D+v*F,u[7]=p*_+g*P+v*I,u[2]=S*A+y*N+b*G,u[5]=S*x+y*D+b*F,u[8]=S*_+y*P+b*I,this}multiplyScalar(e){const i=this.elements;return i[0]*=e,i[3]*=e,i[6]*=e,i[1]*=e,i[4]*=e,i[7]*=e,i[2]*=e,i[5]*=e,i[8]*=e,this}determinant(){const e=this.elements,i=e[0],r=e[1],l=e[2],u=e[3],h=e[4],d=e[5],m=e[6],p=e[7],g=e[8];return i*h*g-i*d*p-r*u*g+r*d*m+l*u*p-l*h*m}invert(){const e=this.elements,i=e[0],r=e[1],l=e[2],u=e[3],h=e[4],d=e[5],m=e[6],p=e[7],g=e[8],v=g*h-d*p,S=d*m-g*u,y=p*u-h*m,b=i*v+r*S+l*y;if(b===0)return this.set(0,0,0,0,0,0,0,0,0);const A=1/b;return e[0]=v*A,e[1]=(l*p-g*r)*A,e[2]=(d*r-l*h)*A,e[3]=S*A,e[4]=(g*i-l*m)*A,e[5]=(l*u-d*i)*A,e[6]=y*A,e[7]=(r*m-p*i)*A,e[8]=(h*i-r*u)*A,this}transpose(){let e;const i=this.elements;return e=i[1],i[1]=i[3],i[3]=e,e=i[2],i[2]=i[6],i[6]=e,e=i[5],i[5]=i[7],i[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const i=this.elements;return e[0]=i[0],e[1]=i[3],e[2]=i[6],e[3]=i[1],e[4]=i[4],e[5]=i[7],e[6]=i[2],e[7]=i[5],e[8]=i[8],this}setUvTransform(e,i,r,l,u,h,d){const m=Math.cos(u),p=Math.sin(u);return this.set(r*m,r*p,-r*(m*h+p*d)+h+e,-l*p,l*m,-l*(-p*h+m*d)+d+i,0,0,1),this}scale(e,i){return this.premultiply(Hf.makeScale(e,i)),this}rotate(e){return this.premultiply(Hf.makeRotation(-e)),this}translate(e,i){return this.premultiply(Hf.makeTranslation(e,i)),this}makeTranslation(e,i){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,i,0,0,1),this}makeRotation(e){const i=Math.cos(e),r=Math.sin(e);return this.set(i,-r,0,r,i,0,0,0,1),this}makeScale(e,i){return this.set(e,0,0,0,i,0,0,0,1),this}equals(e){const i=this.elements,r=e.elements;for(let l=0;l<9;l++)if(i[l]!==r[l])return!1;return!0}fromArray(e,i=0){for(let r=0;r<9;r++)this.elements[r]=e[r+i];return this}toArray(e=[],i=0){const r=this.elements;return e[i]=r[0],e[i+1]=r[1],e[i+2]=r[2],e[i+3]=r[3],e[i+4]=r[4],e[i+5]=r[5],e[i+6]=r[6],e[i+7]=r[7],e[i+8]=r[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Hf=new Me;function Z_(o){for(let e=o.length-1;e>=0;--e)if(o[e]>=65535)return!0;return!1}function vc(o){return document.createElementNS("http://www.w3.org/1999/xhtml",o)}function Lx(){const o=vc("canvas");return o.style.display="block",o}const Yg={};function bo(o){o in Yg||(Yg[o]=!0,console.warn(o))}const jg=new Me().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Zg=new Me().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Hl={[$i]:{transfer:pc,primaries:mc,toReference:o=>o,fromReference:o=>o},[bn]:{transfer:Ze,primaries:mc,toReference:o=>o.convertSRGBToLinear(),fromReference:o=>o.convertLinearToSRGB()},[xc]:{transfer:pc,primaries:gc,toReference:o=>o.applyMatrix3(Zg),fromReference:o=>o.applyMatrix3(jg)},[bd]:{transfer:Ze,primaries:gc,toReference:o=>o.convertSRGBToLinear().applyMatrix3(Zg),fromReference:o=>o.applyMatrix3(jg).convertLinearToSRGB()}},Ux=new Set([$i,xc]),Fe={enabled:!0,_workingColorSpace:$i,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(o){if(!Ux.has(o))throw new Error(`Unsupported working color space, "${o}".`);this._workingColorSpace=o},convert:function(o,e,i){if(this.enabled===!1||e===i||!e||!i)return o;const r=Hl[e].toReference,l=Hl[i].fromReference;return l(r(o))},fromWorkingColorSpace:function(o,e){return this.convert(o,this._workingColorSpace,e)},toWorkingColorSpace:function(o,e){return this.convert(o,e,this._workingColorSpace)},getPrimaries:function(o){return Hl[o].primaries},getTransfer:function(o){return o===pi?pc:Hl[o].transfer}};function hs(o){return o<.04045?o*.0773993808:Math.pow(o*.9478672986+.0521327014,2.4)}function Gf(o){return o<.0031308?o*12.92:1.055*Math.pow(o,.41666)-.055}let Zr;class K_{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{Zr===void 0&&(Zr=vc("canvas")),Zr.width=e.width,Zr.height=e.height;const r=Zr.getContext("2d");e instanceof ImageData?r.putImageData(e,0,0):r.drawImage(e,0,0,e.width,e.height),i=Zr}return i.width>2048||i.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),i.toDataURL("image/jpeg",.6)):i.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const i=vc("canvas");i.width=e.width,i.height=e.height;const r=i.getContext("2d");r.drawImage(e,0,0,e.width,e.height);const l=r.getImageData(0,0,e.width,e.height),u=l.data;for(let h=0;h<u.length;h++)u[h]=hs(u[h]/255)*255;return r.putImageData(l,0,0),i}else if(e.data){const i=e.data.slice(0);for(let r=0;r<i.length;r++)i instanceof Uint8Array||i instanceof Uint8ClampedArray?i[r]=Math.floor(hs(i[r]/255)*255):i[r]=hs(i[r]);return{data:i,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Nx=0;class Q_{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Nx++}),this.uuid=wo(),this.data=e,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const i=e===void 0||typeof e=="string";if(!i&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const r={uuid:this.uuid,url:""},l=this.data;if(l!==null){let u;if(Array.isArray(l)){u=[];for(let h=0,d=l.length;h<d;h++)l[h].isDataTexture?u.push(Vf(l[h].image)):u.push(Vf(l[h]))}else u=Vf(l);r.url=u}return i||(e.images[this.uuid]=r),r}}function Vf(o){return typeof HTMLImageElement<"u"&&o instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&o instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&o instanceof ImageBitmap?K_.getDataURL(o):o.data?{data:Array.from(o.data),width:o.width,height:o.height,type:o.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Ox=0;class ni extends vs{constructor(e=ni.DEFAULT_IMAGE,i=ni.DEFAULT_MAPPING,r=Ei,l=Ei,u=di,h=Ao,d=Ti,m=Oa,p=ni.DEFAULT_ANISOTROPY,g=pi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Ox++}),this.uuid=wo(),this.name="",this.source=new Q_(e),this.mipmaps=[],this.mapping=i,this.channel=0,this.wrapS=r,this.wrapT=l,this.magFilter=u,this.minFilter=h,this.anisotropy=p,this.format=d,this.internalFormat=null,this.type=m,this.offset=new He(0,0),this.repeat=new He(1,1),this.center=new He(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Me,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof g=="string"?this.colorSpace=g:(bo("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=g===fr?bn:pi),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const i=e===void 0||typeof e=="string";if(!i&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const r={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(r.userData=this.userData),i||(e.textures[this.uuid]=r),r}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==F_)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case md:e.x=e.x-Math.floor(e.x);break;case Ei:e.x=e.x<0?0:1;break;case gd:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case md:e.y=e.y-Math.floor(e.y);break;case Ei:e.y=e.y<0?0:1;break;case gd:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return bo("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===bn?fr:Y_}set encoding(e){bo("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=e===fr?bn:pi}}ni.DEFAULT_IMAGE=null;ni.DEFAULT_MAPPING=F_;ni.DEFAULT_ANISOTROPY=1;class An{constructor(e=0,i=0,r=0,l=1){An.prototype.isVector4=!0,this.x=e,this.y=i,this.z=r,this.w=l}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,i,r,l){return this.x=e,this.y=i,this.z=r,this.w=l,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,i){switch(e){case 0:this.x=i;break;case 1:this.y=i;break;case 2:this.z=i;break;case 3:this.w=i;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,i){return this.x=e.x+i.x,this.y=e.y+i.y,this.z=e.z+i.z,this.w=e.w+i.w,this}addScaledVector(e,i){return this.x+=e.x*i,this.y+=e.y*i,this.z+=e.z*i,this.w+=e.w*i,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,i){return this.x=e.x-i.x,this.y=e.y-i.y,this.z=e.z-i.z,this.w=e.w-i.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const i=this.x,r=this.y,l=this.z,u=this.w,h=e.elements;return this.x=h[0]*i+h[4]*r+h[8]*l+h[12]*u,this.y=h[1]*i+h[5]*r+h[9]*l+h[13]*u,this.z=h[2]*i+h[6]*r+h[10]*l+h[14]*u,this.w=h[3]*i+h[7]*r+h[11]*l+h[15]*u,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const i=Math.sqrt(1-e.w*e.w);return i<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/i,this.y=e.y/i,this.z=e.z/i),this}setAxisAngleFromRotationMatrix(e){let i,r,l,u;const m=e.elements,p=m[0],g=m[4],v=m[8],S=m[1],y=m[5],b=m[9],A=m[2],x=m[6],_=m[10];if(Math.abs(g-S)<.01&&Math.abs(v-A)<.01&&Math.abs(b-x)<.01){if(Math.abs(g+S)<.1&&Math.abs(v+A)<.1&&Math.abs(b+x)<.1&&Math.abs(p+y+_-3)<.1)return this.set(1,0,0,0),this;i=Math.PI;const D=(p+1)/2,P=(y+1)/2,G=(_+1)/2,F=(g+S)/4,I=(v+A)/4,mt=(b+x)/4;return D>P&&D>G?D<.01?(r=0,l=.707106781,u=.707106781):(r=Math.sqrt(D),l=F/r,u=I/r):P>G?P<.01?(r=.707106781,l=0,u=.707106781):(l=Math.sqrt(P),r=F/l,u=mt/l):G<.01?(r=.707106781,l=.707106781,u=0):(u=Math.sqrt(G),r=I/u,l=mt/u),this.set(r,l,u,i),this}let N=Math.sqrt((x-b)*(x-b)+(v-A)*(v-A)+(S-g)*(S-g));return Math.abs(N)<.001&&(N=1),this.x=(x-b)/N,this.y=(v-A)/N,this.z=(S-g)/N,this.w=Math.acos((p+y+_-1)/2),this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,i){return this.x=Math.max(e.x,Math.min(i.x,this.x)),this.y=Math.max(e.y,Math.min(i.y,this.y)),this.z=Math.max(e.z,Math.min(i.z,this.z)),this.w=Math.max(e.w,Math.min(i.w,this.w)),this}clampScalar(e,i){return this.x=Math.max(e,Math.min(i,this.x)),this.y=Math.max(e,Math.min(i,this.y)),this.z=Math.max(e,Math.min(i,this.z)),this.w=Math.max(e,Math.min(i,this.w)),this}clampLength(e,i){const r=this.length();return this.divideScalar(r||1).multiplyScalar(Math.max(e,Math.min(i,r)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,i){return this.x+=(e.x-this.x)*i,this.y+=(e.y-this.y)*i,this.z+=(e.z-this.z)*i,this.w+=(e.w-this.w)*i,this}lerpVectors(e,i,r){return this.x=e.x+(i.x-e.x)*r,this.y=e.y+(i.y-e.y)*r,this.z=e.z+(i.z-e.z)*r,this.w=e.w+(i.w-e.w)*r,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,i=0){return this.x=e[i],this.y=e[i+1],this.z=e[i+2],this.w=e[i+3],this}toArray(e=[],i=0){return e[i]=this.x,e[i+1]=this.y,e[i+2]=this.z,e[i+3]=this.w,e}fromBufferAttribute(e,i){return this.x=e.getX(i),this.y=e.getY(i),this.z=e.getZ(i),this.w=e.getW(i),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Px extends vs{constructor(e=1,i=1,r={}){super(),this.isRenderTarget=!0,this.width=e,this.height=i,this.depth=1,this.scissor=new An(0,0,e,i),this.scissorTest=!1,this.viewport=new An(0,0,e,i);const l={width:e,height:i,depth:1};r.encoding!==void 0&&(bo("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),r.colorSpace=r.encoding===fr?bn:pi),r=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:di,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},r),this.texture=new ni(l,r.mapping,r.wrapS,r.wrapT,r.magFilter,r.minFilter,r.format,r.type,r.anisotropy,r.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=r.generateMipmaps,this.texture.internalFormat=r.internalFormat,this.depthBuffer=r.depthBuffer,this.stencilBuffer=r.stencilBuffer,this.depthTexture=r.depthTexture,this.samples=r.samples}setSize(e,i,r=1){(this.width!==e||this.height!==i||this.depth!==r)&&(this.width=e,this.height=i,this.depth=r,this.texture.image.width=e,this.texture.image.height=i,this.texture.image.depth=r,this.dispose()),this.viewport.set(0,0,e,i),this.scissor.set(0,0,e,i)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.texture=e.texture.clone(),this.texture.isRenderTargetTexture=!0;const i=Object.assign({},e.texture.image);return this.texture.source=new Q_(i),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class hr extends Px{constructor(e=1,i=1,r={}){super(e,i,r),this.isWebGLRenderTarget=!0}}class J_ extends ni{constructor(e=null,i=1,r=1,l=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:i,height:r,depth:l},this.magFilter=zn,this.minFilter=zn,this.wrapR=Ei,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class zx extends ni{constructor(e=null,i=1,r=1,l=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:i,height:r,depth:l},this.magFilter=zn,this.minFilter=zn,this.wrapR=Ei,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Co{constructor(e=0,i=0,r=0,l=1){this.isQuaternion=!0,this._x=e,this._y=i,this._z=r,this._w=l}static slerpFlat(e,i,r,l,u,h,d){let m=r[l+0],p=r[l+1],g=r[l+2],v=r[l+3];const S=u[h+0],y=u[h+1],b=u[h+2],A=u[h+3];if(d===0){e[i+0]=m,e[i+1]=p,e[i+2]=g,e[i+3]=v;return}if(d===1){e[i+0]=S,e[i+1]=y,e[i+2]=b,e[i+3]=A;return}if(v!==A||m!==S||p!==y||g!==b){let x=1-d;const _=m*S+p*y+g*b+v*A,N=_>=0?1:-1,D=1-_*_;if(D>Number.EPSILON){const G=Math.sqrt(D),F=Math.atan2(G,_*N);x=Math.sin(x*F)/G,d=Math.sin(d*F)/G}const P=d*N;if(m=m*x+S*P,p=p*x+y*P,g=g*x+b*P,v=v*x+A*P,x===1-d){const G=1/Math.sqrt(m*m+p*p+g*g+v*v);m*=G,p*=G,g*=G,v*=G}}e[i]=m,e[i+1]=p,e[i+2]=g,e[i+3]=v}static multiplyQuaternionsFlat(e,i,r,l,u,h){const d=r[l],m=r[l+1],p=r[l+2],g=r[l+3],v=u[h],S=u[h+1],y=u[h+2],b=u[h+3];return e[i]=d*b+g*v+m*y-p*S,e[i+1]=m*b+g*S+p*v-d*y,e[i+2]=p*b+g*y+d*S-m*v,e[i+3]=g*b-d*v-m*S-p*y,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,i,r,l){return this._x=e,this._y=i,this._z=r,this._w=l,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,i=!0){const r=e._x,l=e._y,u=e._z,h=e._order,d=Math.cos,m=Math.sin,p=d(r/2),g=d(l/2),v=d(u/2),S=m(r/2),y=m(l/2),b=m(u/2);switch(h){case"XYZ":this._x=S*g*v+p*y*b,this._y=p*y*v-S*g*b,this._z=p*g*b+S*y*v,this._w=p*g*v-S*y*b;break;case"YXZ":this._x=S*g*v+p*y*b,this._y=p*y*v-S*g*b,this._z=p*g*b-S*y*v,this._w=p*g*v+S*y*b;break;case"ZXY":this._x=S*g*v-p*y*b,this._y=p*y*v+S*g*b,this._z=p*g*b+S*y*v,this._w=p*g*v-S*y*b;break;case"ZYX":this._x=S*g*v-p*y*b,this._y=p*y*v+S*g*b,this._z=p*g*b-S*y*v,this._w=p*g*v+S*y*b;break;case"YZX":this._x=S*g*v+p*y*b,this._y=p*y*v+S*g*b,this._z=p*g*b-S*y*v,this._w=p*g*v-S*y*b;break;case"XZY":this._x=S*g*v-p*y*b,this._y=p*y*v-S*g*b,this._z=p*g*b+S*y*v,this._w=p*g*v+S*y*b;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+h)}return i===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,i){const r=i/2,l=Math.sin(r);return this._x=e.x*l,this._y=e.y*l,this._z=e.z*l,this._w=Math.cos(r),this._onChangeCallback(),this}setFromRotationMatrix(e){const i=e.elements,r=i[0],l=i[4],u=i[8],h=i[1],d=i[5],m=i[9],p=i[2],g=i[6],v=i[10],S=r+d+v;if(S>0){const y=.5/Math.sqrt(S+1);this._w=.25/y,this._x=(g-m)*y,this._y=(u-p)*y,this._z=(h-l)*y}else if(r>d&&r>v){const y=2*Math.sqrt(1+r-d-v);this._w=(g-m)/y,this._x=.25*y,this._y=(l+h)/y,this._z=(u+p)/y}else if(d>v){const y=2*Math.sqrt(1+d-r-v);this._w=(u-p)/y,this._x=(l+h)/y,this._y=.25*y,this._z=(m+g)/y}else{const y=2*Math.sqrt(1+v-r-d);this._w=(h-l)/y,this._x=(u+p)/y,this._y=(m+g)/y,this._z=.25*y}return this._onChangeCallback(),this}setFromUnitVectors(e,i){let r=e.dot(i)+1;return r<Number.EPSILON?(r=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=r):(this._x=0,this._y=-e.z,this._z=e.y,this._w=r)):(this._x=e.y*i.z-e.z*i.y,this._y=e.z*i.x-e.x*i.z,this._z=e.x*i.y-e.y*i.x,this._w=r),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(kn(this.dot(e),-1,1)))}rotateTowards(e,i){const r=this.angleTo(e);if(r===0)return this;const l=Math.min(1,i/r);return this.slerp(e,l),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,i){const r=e._x,l=e._y,u=e._z,h=e._w,d=i._x,m=i._y,p=i._z,g=i._w;return this._x=r*g+h*d+l*p-u*m,this._y=l*g+h*m+u*d-r*p,this._z=u*g+h*p+r*m-l*d,this._w=h*g-r*d-l*m-u*p,this._onChangeCallback(),this}slerp(e,i){if(i===0)return this;if(i===1)return this.copy(e);const r=this._x,l=this._y,u=this._z,h=this._w;let d=h*e._w+r*e._x+l*e._y+u*e._z;if(d<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,d=-d):this.copy(e),d>=1)return this._w=h,this._x=r,this._y=l,this._z=u,this;const m=1-d*d;if(m<=Number.EPSILON){const y=1-i;return this._w=y*h+i*this._w,this._x=y*r+i*this._x,this._y=y*l+i*this._y,this._z=y*u+i*this._z,this.normalize(),this}const p=Math.sqrt(m),g=Math.atan2(p,d),v=Math.sin((1-i)*g)/p,S=Math.sin(i*g)/p;return this._w=h*v+this._w*S,this._x=r*v+this._x*S,this._y=l*v+this._y*S,this._z=u*v+this._z*S,this._onChangeCallback(),this}slerpQuaternions(e,i,r){return this.copy(e).slerp(i,r)}random(){const e=Math.random(),i=Math.sqrt(1-e),r=Math.sqrt(e),l=2*Math.PI*Math.random(),u=2*Math.PI*Math.random();return this.set(i*Math.cos(l),r*Math.sin(u),r*Math.cos(u),i*Math.sin(l))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,i=0){return this._x=e[i],this._y=e[i+1],this._z=e[i+2],this._w=e[i+3],this._onChangeCallback(),this}toArray(e=[],i=0){return e[i]=this._x,e[i+1]=this._y,e[i+2]=this._z,e[i+3]=this._w,e}fromBufferAttribute(e,i){return this._x=e.getX(i),this._y=e.getY(i),this._z=e.getZ(i),this._w=e.getW(i),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class st{constructor(e=0,i=0,r=0){st.prototype.isVector3=!0,this.x=e,this.y=i,this.z=r}set(e,i,r){return r===void 0&&(r=this.z),this.x=e,this.y=i,this.z=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,i){switch(e){case 0:this.x=i;break;case 1:this.y=i;break;case 2:this.z=i;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,i){return this.x=e.x+i.x,this.y=e.y+i.y,this.z=e.z+i.z,this}addScaledVector(e,i){return this.x+=e.x*i,this.y+=e.y*i,this.z+=e.z*i,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,i){return this.x=e.x-i.x,this.y=e.y-i.y,this.z=e.z-i.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,i){return this.x=e.x*i.x,this.y=e.y*i.y,this.z=e.z*i.z,this}applyEuler(e){return this.applyQuaternion(Kg.setFromEuler(e))}applyAxisAngle(e,i){return this.applyQuaternion(Kg.setFromAxisAngle(e,i))}applyMatrix3(e){const i=this.x,r=this.y,l=this.z,u=e.elements;return this.x=u[0]*i+u[3]*r+u[6]*l,this.y=u[1]*i+u[4]*r+u[7]*l,this.z=u[2]*i+u[5]*r+u[8]*l,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const i=this.x,r=this.y,l=this.z,u=e.elements,h=1/(u[3]*i+u[7]*r+u[11]*l+u[15]);return this.x=(u[0]*i+u[4]*r+u[8]*l+u[12])*h,this.y=(u[1]*i+u[5]*r+u[9]*l+u[13])*h,this.z=(u[2]*i+u[6]*r+u[10]*l+u[14])*h,this}applyQuaternion(e){const i=this.x,r=this.y,l=this.z,u=e.x,h=e.y,d=e.z,m=e.w,p=2*(h*l-d*r),g=2*(d*i-u*l),v=2*(u*r-h*i);return this.x=i+m*p+h*v-d*g,this.y=r+m*g+d*p-u*v,this.z=l+m*v+u*g-h*p,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const i=this.x,r=this.y,l=this.z,u=e.elements;return this.x=u[0]*i+u[4]*r+u[8]*l,this.y=u[1]*i+u[5]*r+u[9]*l,this.z=u[2]*i+u[6]*r+u[10]*l,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,i){return this.x=Math.max(e.x,Math.min(i.x,this.x)),this.y=Math.max(e.y,Math.min(i.y,this.y)),this.z=Math.max(e.z,Math.min(i.z,this.z)),this}clampScalar(e,i){return this.x=Math.max(e,Math.min(i,this.x)),this.y=Math.max(e,Math.min(i,this.y)),this.z=Math.max(e,Math.min(i,this.z)),this}clampLength(e,i){const r=this.length();return this.divideScalar(r||1).multiplyScalar(Math.max(e,Math.min(i,r)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,i){return this.x+=(e.x-this.x)*i,this.y+=(e.y-this.y)*i,this.z+=(e.z-this.z)*i,this}lerpVectors(e,i,r){return this.x=e.x+(i.x-e.x)*r,this.y=e.y+(i.y-e.y)*r,this.z=e.z+(i.z-e.z)*r,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,i){const r=e.x,l=e.y,u=e.z,h=i.x,d=i.y,m=i.z;return this.x=l*m-u*d,this.y=u*h-r*m,this.z=r*d-l*h,this}projectOnVector(e){const i=e.lengthSq();if(i===0)return this.set(0,0,0);const r=e.dot(this)/i;return this.copy(e).multiplyScalar(r)}projectOnPlane(e){return kf.copy(this).projectOnVector(e),this.sub(kf)}reflect(e){return this.sub(kf.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const i=Math.sqrt(this.lengthSq()*e.lengthSq());if(i===0)return Math.PI/2;const r=this.dot(e)/i;return Math.acos(kn(r,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const i=this.x-e.x,r=this.y-e.y,l=this.z-e.z;return i*i+r*r+l*l}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,i,r){const l=Math.sin(i)*e;return this.x=l*Math.sin(r),this.y=Math.cos(i)*e,this.z=l*Math.cos(r),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,i,r){return this.x=e*Math.sin(i),this.y=r,this.z=e*Math.cos(i),this}setFromMatrixPosition(e){const i=e.elements;return this.x=i[12],this.y=i[13],this.z=i[14],this}setFromMatrixScale(e){const i=this.setFromMatrixColumn(e,0).length(),r=this.setFromMatrixColumn(e,1).length(),l=this.setFromMatrixColumn(e,2).length();return this.x=i,this.y=r,this.z=l,this}setFromMatrixColumn(e,i){return this.fromArray(e.elements,i*4)}setFromMatrix3Column(e,i){return this.fromArray(e.elements,i*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,i=0){return this.x=e[i],this.y=e[i+1],this.z=e[i+2],this}toArray(e=[],i=0){return e[i]=this.x,e[i+1]=this.y,e[i+2]=this.z,e}fromBufferAttribute(e,i){return this.x=e.getX(i),this.y=e.getY(i),this.z=e.getZ(i),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=(Math.random()-.5)*2,i=Math.random()*Math.PI*2,r=Math.sqrt(1-e**2);return this.x=r*Math.cos(i),this.y=r*Math.sin(i),this.z=e,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const kf=new st,Kg=new Co;class Do{constructor(e=new st(1/0,1/0,1/0),i=new st(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=i}set(e,i){return this.min.copy(e),this.max.copy(i),this}setFromArray(e){this.makeEmpty();for(let i=0,r=e.length;i<r;i+=3)this.expandByPoint(Si.fromArray(e,i));return this}setFromBufferAttribute(e){this.makeEmpty();for(let i=0,r=e.count;i<r;i++)this.expandByPoint(Si.fromBufferAttribute(e,i));return this}setFromPoints(e){this.makeEmpty();for(let i=0,r=e.length;i<r;i++)this.expandByPoint(e[i]);return this}setFromCenterAndSize(e,i){const r=Si.copy(i).multiplyScalar(.5);return this.min.copy(e).sub(r),this.max.copy(e).add(r),this}setFromObject(e,i=!1){return this.makeEmpty(),this.expandByObject(e,i)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,i=!1){e.updateWorldMatrix(!1,!1);const r=e.geometry;if(r!==void 0){const u=r.getAttribute("position");if(i===!0&&u!==void 0&&e.isInstancedMesh!==!0)for(let h=0,d=u.count;h<d;h++)e.isMesh===!0?e.getVertexPosition(h,Si):Si.fromBufferAttribute(u,h),Si.applyMatrix4(e.matrixWorld),this.expandByPoint(Si);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Gl.copy(e.boundingBox)):(r.boundingBox===null&&r.computeBoundingBox(),Gl.copy(r.boundingBox)),Gl.applyMatrix4(e.matrixWorld),this.union(Gl)}const l=e.children;for(let u=0,h=l.length;u<h;u++)this.expandByObject(l[u],i);return this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,i){return i.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return this.clampPoint(e.center,Si),Si.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let i,r;return e.normal.x>0?(i=e.normal.x*this.min.x,r=e.normal.x*this.max.x):(i=e.normal.x*this.max.x,r=e.normal.x*this.min.x),e.normal.y>0?(i+=e.normal.y*this.min.y,r+=e.normal.y*this.max.y):(i+=e.normal.y*this.max.y,r+=e.normal.y*this.min.y),e.normal.z>0?(i+=e.normal.z*this.min.z,r+=e.normal.z*this.max.z):(i+=e.normal.z*this.max.z,r+=e.normal.z*this.min.z),i<=-e.constant&&r>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(So),Vl.subVectors(this.max,So),Kr.subVectors(e.a,So),Qr.subVectors(e.b,So),Jr.subVectors(e.c,So),Ta.subVectors(Qr,Kr),ba.subVectors(Jr,Qr),er.subVectors(Kr,Jr);let i=[0,-Ta.z,Ta.y,0,-ba.z,ba.y,0,-er.z,er.y,Ta.z,0,-Ta.x,ba.z,0,-ba.x,er.z,0,-er.x,-Ta.y,Ta.x,0,-ba.y,ba.x,0,-er.y,er.x,0];return!Xf(i,Kr,Qr,Jr,Vl)||(i=[1,0,0,0,1,0,0,0,1],!Xf(i,Kr,Qr,Jr,Vl))?!1:(kl.crossVectors(Ta,ba),i=[kl.x,kl.y,kl.z],Xf(i,Kr,Qr,Jr,Vl))}clampPoint(e,i){return i.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Si).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Si).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Wi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Wi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Wi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Wi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Wi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Wi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Wi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Wi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Wi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const Wi=[new st,new st,new st,new st,new st,new st,new st,new st],Si=new st,Gl=new Do,Kr=new st,Qr=new st,Jr=new st,Ta=new st,ba=new st,er=new st,So=new st,Vl=new st,kl=new st,nr=new st;function Xf(o,e,i,r,l){for(let u=0,h=o.length-3;u<=h;u+=3){nr.fromArray(o,u);const d=l.x*Math.abs(nr.x)+l.y*Math.abs(nr.y)+l.z*Math.abs(nr.z),m=e.dot(nr),p=i.dot(nr),g=r.dot(nr);if(Math.max(-Math.max(m,p,g),Math.min(m,p,g))>d)return!1}return!0}const Bx=new Do,xo=new st,Wf=new st;class Mc{constructor(e=new st,i=-1){this.isSphere=!0,this.center=e,this.radius=i}set(e,i){return this.center.copy(e),this.radius=i,this}setFromPoints(e,i){const r=this.center;i!==void 0?r.copy(i):Bx.setFromPoints(e).getCenter(r);let l=0;for(let u=0,h=e.length;u<h;u++)l=Math.max(l,r.distanceToSquared(e[u]));return this.radius=Math.sqrt(l),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const i=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=i*i}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,i){const r=this.center.distanceToSquared(e);return i.copy(e),r>this.radius*this.radius&&(i.sub(this.center).normalize(),i.multiplyScalar(this.radius).add(this.center)),i}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;xo.subVectors(e,this.center);const i=xo.lengthSq();if(i>this.radius*this.radius){const r=Math.sqrt(i),l=(r-this.radius)*.5;this.center.addScaledVector(xo,l/r),this.radius+=l}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Wf.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(xo.copy(e.center).add(Wf)),this.expandByPoint(xo.copy(e.center).sub(Wf))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const qi=new st,qf=new st,Xl=new st,Aa=new st,Yf=new st,Wl=new st,jf=new st;class $_{constructor(e=new st,i=new st(0,0,-1)){this.origin=e,this.direction=i}set(e,i){return this.origin.copy(e),this.direction.copy(i),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,i){return i.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,qi)),this}closestPointToPoint(e,i){i.subVectors(e,this.origin);const r=i.dot(this.direction);return r<0?i.copy(this.origin):i.copy(this.origin).addScaledVector(this.direction,r)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const i=qi.subVectors(e,this.origin).dot(this.direction);return i<0?this.origin.distanceToSquared(e):(qi.copy(this.origin).addScaledVector(this.direction,i),qi.distanceToSquared(e))}distanceSqToSegment(e,i,r,l){qf.copy(e).add(i).multiplyScalar(.5),Xl.copy(i).sub(e).normalize(),Aa.copy(this.origin).sub(qf);const u=e.distanceTo(i)*.5,h=-this.direction.dot(Xl),d=Aa.dot(this.direction),m=-Aa.dot(Xl),p=Aa.lengthSq(),g=Math.abs(1-h*h);let v,S,y,b;if(g>0)if(v=h*m-d,S=h*d-m,b=u*g,v>=0)if(S>=-b)if(S<=b){const A=1/g;v*=A,S*=A,y=v*(v+h*S+2*d)+S*(h*v+S+2*m)+p}else S=u,v=Math.max(0,-(h*S+d)),y=-v*v+S*(S+2*m)+p;else S=-u,v=Math.max(0,-(h*S+d)),y=-v*v+S*(S+2*m)+p;else S<=-b?(v=Math.max(0,-(-h*u+d)),S=v>0?-u:Math.min(Math.max(-u,-m),u),y=-v*v+S*(S+2*m)+p):S<=b?(v=0,S=Math.min(Math.max(-u,-m),u),y=S*(S+2*m)+p):(v=Math.max(0,-(h*u+d)),S=v>0?u:Math.min(Math.max(-u,-m),u),y=-v*v+S*(S+2*m)+p);else S=h>0?-u:u,v=Math.max(0,-(h*S+d)),y=-v*v+S*(S+2*m)+p;return r&&r.copy(this.origin).addScaledVector(this.direction,v),l&&l.copy(qf).addScaledVector(Xl,S),y}intersectSphere(e,i){qi.subVectors(e.center,this.origin);const r=qi.dot(this.direction),l=qi.dot(qi)-r*r,u=e.radius*e.radius;if(l>u)return null;const h=Math.sqrt(u-l),d=r-h,m=r+h;return m<0?null:d<0?this.at(m,i):this.at(d,i)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const i=e.normal.dot(this.direction);if(i===0)return e.distanceToPoint(this.origin)===0?0:null;const r=-(this.origin.dot(e.normal)+e.constant)/i;return r>=0?r:null}intersectPlane(e,i){const r=this.distanceToPlane(e);return r===null?null:this.at(r,i)}intersectsPlane(e){const i=e.distanceToPoint(this.origin);return i===0||e.normal.dot(this.direction)*i<0}intersectBox(e,i){let r,l,u,h,d,m;const p=1/this.direction.x,g=1/this.direction.y,v=1/this.direction.z,S=this.origin;return p>=0?(r=(e.min.x-S.x)*p,l=(e.max.x-S.x)*p):(r=(e.max.x-S.x)*p,l=(e.min.x-S.x)*p),g>=0?(u=(e.min.y-S.y)*g,h=(e.max.y-S.y)*g):(u=(e.max.y-S.y)*g,h=(e.min.y-S.y)*g),r>h||u>l||((u>r||isNaN(r))&&(r=u),(h<l||isNaN(l))&&(l=h),v>=0?(d=(e.min.z-S.z)*v,m=(e.max.z-S.z)*v):(d=(e.max.z-S.z)*v,m=(e.min.z-S.z)*v),r>m||d>l)||((d>r||r!==r)&&(r=d),(m<l||l!==l)&&(l=m),l<0)?null:this.at(r>=0?r:l,i)}intersectsBox(e){return this.intersectBox(e,qi)!==null}intersectTriangle(e,i,r,l,u){Yf.subVectors(i,e),Wl.subVectors(r,e),jf.crossVectors(Yf,Wl);let h=this.direction.dot(jf),d;if(h>0){if(l)return null;d=1}else if(h<0)d=-1,h=-h;else return null;Aa.subVectors(this.origin,e);const m=d*this.direction.dot(Wl.crossVectors(Aa,Wl));if(m<0)return null;const p=d*this.direction.dot(Yf.cross(Aa));if(p<0||m+p>h)return null;const g=-d*Aa.dot(jf);return g<0?null:this.at(g/h,u)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Sn{constructor(e,i,r,l,u,h,d,m,p,g,v,S,y,b,A,x){Sn.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,i,r,l,u,h,d,m,p,g,v,S,y,b,A,x)}set(e,i,r,l,u,h,d,m,p,g,v,S,y,b,A,x){const _=this.elements;return _[0]=e,_[4]=i,_[8]=r,_[12]=l,_[1]=u,_[5]=h,_[9]=d,_[13]=m,_[2]=p,_[6]=g,_[10]=v,_[14]=S,_[3]=y,_[7]=b,_[11]=A,_[15]=x,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Sn().fromArray(this.elements)}copy(e){const i=this.elements,r=e.elements;return i[0]=r[0],i[1]=r[1],i[2]=r[2],i[3]=r[3],i[4]=r[4],i[5]=r[5],i[6]=r[6],i[7]=r[7],i[8]=r[8],i[9]=r[9],i[10]=r[10],i[11]=r[11],i[12]=r[12],i[13]=r[13],i[14]=r[14],i[15]=r[15],this}copyPosition(e){const i=this.elements,r=e.elements;return i[12]=r[12],i[13]=r[13],i[14]=r[14],this}setFromMatrix3(e){const i=e.elements;return this.set(i[0],i[3],i[6],0,i[1],i[4],i[7],0,i[2],i[5],i[8],0,0,0,0,1),this}extractBasis(e,i,r){return e.setFromMatrixColumn(this,0),i.setFromMatrixColumn(this,1),r.setFromMatrixColumn(this,2),this}makeBasis(e,i,r){return this.set(e.x,i.x,r.x,0,e.y,i.y,r.y,0,e.z,i.z,r.z,0,0,0,0,1),this}extractRotation(e){const i=this.elements,r=e.elements,l=1/$r.setFromMatrixColumn(e,0).length(),u=1/$r.setFromMatrixColumn(e,1).length(),h=1/$r.setFromMatrixColumn(e,2).length();return i[0]=r[0]*l,i[1]=r[1]*l,i[2]=r[2]*l,i[3]=0,i[4]=r[4]*u,i[5]=r[5]*u,i[6]=r[6]*u,i[7]=0,i[8]=r[8]*h,i[9]=r[9]*h,i[10]=r[10]*h,i[11]=0,i[12]=0,i[13]=0,i[14]=0,i[15]=1,this}makeRotationFromEuler(e){const i=this.elements,r=e.x,l=e.y,u=e.z,h=Math.cos(r),d=Math.sin(r),m=Math.cos(l),p=Math.sin(l),g=Math.cos(u),v=Math.sin(u);if(e.order==="XYZ"){const S=h*g,y=h*v,b=d*g,A=d*v;i[0]=m*g,i[4]=-m*v,i[8]=p,i[1]=y+b*p,i[5]=S-A*p,i[9]=-d*m,i[2]=A-S*p,i[6]=b+y*p,i[10]=h*m}else if(e.order==="YXZ"){const S=m*g,y=m*v,b=p*g,A=p*v;i[0]=S+A*d,i[4]=b*d-y,i[8]=h*p,i[1]=h*v,i[5]=h*g,i[9]=-d,i[2]=y*d-b,i[6]=A+S*d,i[10]=h*m}else if(e.order==="ZXY"){const S=m*g,y=m*v,b=p*g,A=p*v;i[0]=S-A*d,i[4]=-h*v,i[8]=b+y*d,i[1]=y+b*d,i[5]=h*g,i[9]=A-S*d,i[2]=-h*p,i[6]=d,i[10]=h*m}else if(e.order==="ZYX"){const S=h*g,y=h*v,b=d*g,A=d*v;i[0]=m*g,i[4]=b*p-y,i[8]=S*p+A,i[1]=m*v,i[5]=A*p+S,i[9]=y*p-b,i[2]=-p,i[6]=d*m,i[10]=h*m}else if(e.order==="YZX"){const S=h*m,y=h*p,b=d*m,A=d*p;i[0]=m*g,i[4]=A-S*v,i[8]=b*v+y,i[1]=v,i[5]=h*g,i[9]=-d*g,i[2]=-p*g,i[6]=y*v+b,i[10]=S-A*v}else if(e.order==="XZY"){const S=h*m,y=h*p,b=d*m,A=d*p;i[0]=m*g,i[4]=-v,i[8]=p*g,i[1]=S*v+A,i[5]=h*g,i[9]=y*v-b,i[2]=b*v-y,i[6]=d*g,i[10]=A*v+S}return i[3]=0,i[7]=0,i[11]=0,i[12]=0,i[13]=0,i[14]=0,i[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Ix,e,Fx)}lookAt(e,i,r){const l=this.elements;return ti.subVectors(e,i),ti.lengthSq()===0&&(ti.z=1),ti.normalize(),Ra.crossVectors(r,ti),Ra.lengthSq()===0&&(Math.abs(r.z)===1?ti.x+=1e-4:ti.z+=1e-4,ti.normalize(),Ra.crossVectors(r,ti)),Ra.normalize(),ql.crossVectors(ti,Ra),l[0]=Ra.x,l[4]=ql.x,l[8]=ti.x,l[1]=Ra.y,l[5]=ql.y,l[9]=ti.y,l[2]=Ra.z,l[6]=ql.z,l[10]=ti.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,i){const r=e.elements,l=i.elements,u=this.elements,h=r[0],d=r[4],m=r[8],p=r[12],g=r[1],v=r[5],S=r[9],y=r[13],b=r[2],A=r[6],x=r[10],_=r[14],N=r[3],D=r[7],P=r[11],G=r[15],F=l[0],I=l[4],mt=l[8],C=l[12],U=l[1],ut=l[5],lt=l[9],yt=l[13],X=l[2],$=l[6],O=l[10],q=l[14],j=l[3],ct=l[7],R=l[11],k=l[15];return u[0]=h*F+d*U+m*X+p*j,u[4]=h*I+d*ut+m*$+p*ct,u[8]=h*mt+d*lt+m*O+p*R,u[12]=h*C+d*yt+m*q+p*k,u[1]=g*F+v*U+S*X+y*j,u[5]=g*I+v*ut+S*$+y*ct,u[9]=g*mt+v*lt+S*O+y*R,u[13]=g*C+v*yt+S*q+y*k,u[2]=b*F+A*U+x*X+_*j,u[6]=b*I+A*ut+x*$+_*ct,u[10]=b*mt+A*lt+x*O+_*R,u[14]=b*C+A*yt+x*q+_*k,u[3]=N*F+D*U+P*X+G*j,u[7]=N*I+D*ut+P*$+G*ct,u[11]=N*mt+D*lt+P*O+G*R,u[15]=N*C+D*yt+P*q+G*k,this}multiplyScalar(e){const i=this.elements;return i[0]*=e,i[4]*=e,i[8]*=e,i[12]*=e,i[1]*=e,i[5]*=e,i[9]*=e,i[13]*=e,i[2]*=e,i[6]*=e,i[10]*=e,i[14]*=e,i[3]*=e,i[7]*=e,i[11]*=e,i[15]*=e,this}determinant(){const e=this.elements,i=e[0],r=e[4],l=e[8],u=e[12],h=e[1],d=e[5],m=e[9],p=e[13],g=e[2],v=e[6],S=e[10],y=e[14],b=e[3],A=e[7],x=e[11],_=e[15];return b*(+u*m*v-l*p*v-u*d*S+r*p*S+l*d*y-r*m*y)+A*(+i*m*y-i*p*S+u*h*S-l*h*y+l*p*g-u*m*g)+x*(+i*p*v-i*d*y-u*h*v+r*h*y+u*d*g-r*p*g)+_*(-l*d*g-i*m*v+i*d*S+l*h*v-r*h*S+r*m*g)}transpose(){const e=this.elements;let i;return i=e[1],e[1]=e[4],e[4]=i,i=e[2],e[2]=e[8],e[8]=i,i=e[6],e[6]=e[9],e[9]=i,i=e[3],e[3]=e[12],e[12]=i,i=e[7],e[7]=e[13],e[13]=i,i=e[11],e[11]=e[14],e[14]=i,this}setPosition(e,i,r){const l=this.elements;return e.isVector3?(l[12]=e.x,l[13]=e.y,l[14]=e.z):(l[12]=e,l[13]=i,l[14]=r),this}invert(){const e=this.elements,i=e[0],r=e[1],l=e[2],u=e[3],h=e[4],d=e[5],m=e[6],p=e[7],g=e[8],v=e[9],S=e[10],y=e[11],b=e[12],A=e[13],x=e[14],_=e[15],N=v*x*p-A*S*p+A*m*y-d*x*y-v*m*_+d*S*_,D=b*S*p-g*x*p-b*m*y+h*x*y+g*m*_-h*S*_,P=g*A*p-b*v*p+b*d*y-h*A*y-g*d*_+h*v*_,G=b*v*m-g*A*m-b*d*S+h*A*S+g*d*x-h*v*x,F=i*N+r*D+l*P+u*G;if(F===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const I=1/F;return e[0]=N*I,e[1]=(A*S*u-v*x*u-A*l*y+r*x*y+v*l*_-r*S*_)*I,e[2]=(d*x*u-A*m*u+A*l*p-r*x*p-d*l*_+r*m*_)*I,e[3]=(v*m*u-d*S*u-v*l*p+r*S*p+d*l*y-r*m*y)*I,e[4]=D*I,e[5]=(g*x*u-b*S*u+b*l*y-i*x*y-g*l*_+i*S*_)*I,e[6]=(b*m*u-h*x*u-b*l*p+i*x*p+h*l*_-i*m*_)*I,e[7]=(h*S*u-g*m*u+g*l*p-i*S*p-h*l*y+i*m*y)*I,e[8]=P*I,e[9]=(b*v*u-g*A*u-b*r*y+i*A*y+g*r*_-i*v*_)*I,e[10]=(h*A*u-b*d*u+b*r*p-i*A*p-h*r*_+i*d*_)*I,e[11]=(g*d*u-h*v*u-g*r*p+i*v*p+h*r*y-i*d*y)*I,e[12]=G*I,e[13]=(g*A*l-b*v*l+b*r*S-i*A*S-g*r*x+i*v*x)*I,e[14]=(b*d*l-h*A*l-b*r*m+i*A*m+h*r*x-i*d*x)*I,e[15]=(h*v*l-g*d*l+g*r*m-i*v*m-h*r*S+i*d*S)*I,this}scale(e){const i=this.elements,r=e.x,l=e.y,u=e.z;return i[0]*=r,i[4]*=l,i[8]*=u,i[1]*=r,i[5]*=l,i[9]*=u,i[2]*=r,i[6]*=l,i[10]*=u,i[3]*=r,i[7]*=l,i[11]*=u,this}getMaxScaleOnAxis(){const e=this.elements,i=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],r=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],l=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(i,r,l))}makeTranslation(e,i,r){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,i,0,0,1,r,0,0,0,1),this}makeRotationX(e){const i=Math.cos(e),r=Math.sin(e);return this.set(1,0,0,0,0,i,-r,0,0,r,i,0,0,0,0,1),this}makeRotationY(e){const i=Math.cos(e),r=Math.sin(e);return this.set(i,0,r,0,0,1,0,0,-r,0,i,0,0,0,0,1),this}makeRotationZ(e){const i=Math.cos(e),r=Math.sin(e);return this.set(i,-r,0,0,r,i,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,i){const r=Math.cos(i),l=Math.sin(i),u=1-r,h=e.x,d=e.y,m=e.z,p=u*h,g=u*d;return this.set(p*h+r,p*d-l*m,p*m+l*d,0,p*d+l*m,g*d+r,g*m-l*h,0,p*m-l*d,g*m+l*h,u*m*m+r,0,0,0,0,1),this}makeScale(e,i,r){return this.set(e,0,0,0,0,i,0,0,0,0,r,0,0,0,0,1),this}makeShear(e,i,r,l,u,h){return this.set(1,r,u,0,e,1,h,0,i,l,1,0,0,0,0,1),this}compose(e,i,r){const l=this.elements,u=i._x,h=i._y,d=i._z,m=i._w,p=u+u,g=h+h,v=d+d,S=u*p,y=u*g,b=u*v,A=h*g,x=h*v,_=d*v,N=m*p,D=m*g,P=m*v,G=r.x,F=r.y,I=r.z;return l[0]=(1-(A+_))*G,l[1]=(y+P)*G,l[2]=(b-D)*G,l[3]=0,l[4]=(y-P)*F,l[5]=(1-(S+_))*F,l[6]=(x+N)*F,l[7]=0,l[8]=(b+D)*I,l[9]=(x-N)*I,l[10]=(1-(S+A))*I,l[11]=0,l[12]=e.x,l[13]=e.y,l[14]=e.z,l[15]=1,this}decompose(e,i,r){const l=this.elements;let u=$r.set(l[0],l[1],l[2]).length();const h=$r.set(l[4],l[5],l[6]).length(),d=$r.set(l[8],l[9],l[10]).length();this.determinant()<0&&(u=-u),e.x=l[12],e.y=l[13],e.z=l[14],xi.copy(this);const p=1/u,g=1/h,v=1/d;return xi.elements[0]*=p,xi.elements[1]*=p,xi.elements[2]*=p,xi.elements[4]*=g,xi.elements[5]*=g,xi.elements[6]*=g,xi.elements[8]*=v,xi.elements[9]*=v,xi.elements[10]*=v,i.setFromRotationMatrix(xi),r.x=u,r.y=h,r.z=d,this}makePerspective(e,i,r,l,u,h,d=Ji){const m=this.elements,p=2*u/(i-e),g=2*u/(r-l),v=(i+e)/(i-e),S=(r+l)/(r-l);let y,b;if(d===Ji)y=-(h+u)/(h-u),b=-2*h*u/(h-u);else if(d===_c)y=-h/(h-u),b=-h*u/(h-u);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+d);return m[0]=p,m[4]=0,m[8]=v,m[12]=0,m[1]=0,m[5]=g,m[9]=S,m[13]=0,m[2]=0,m[6]=0,m[10]=y,m[14]=b,m[3]=0,m[7]=0,m[11]=-1,m[15]=0,this}makeOrthographic(e,i,r,l,u,h,d=Ji){const m=this.elements,p=1/(i-e),g=1/(r-l),v=1/(h-u),S=(i+e)*p,y=(r+l)*g;let b,A;if(d===Ji)b=(h+u)*v,A=-2*v;else if(d===_c)b=u*v,A=-1*v;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+d);return m[0]=2*p,m[4]=0,m[8]=0,m[12]=-S,m[1]=0,m[5]=2*g,m[9]=0,m[13]=-y,m[2]=0,m[6]=0,m[10]=A,m[14]=-b,m[3]=0,m[7]=0,m[11]=0,m[15]=1,this}equals(e){const i=this.elements,r=e.elements;for(let l=0;l<16;l++)if(i[l]!==r[l])return!1;return!0}fromArray(e,i=0){for(let r=0;r<16;r++)this.elements[r]=e[r+i];return this}toArray(e=[],i=0){const r=this.elements;return e[i]=r[0],e[i+1]=r[1],e[i+2]=r[2],e[i+3]=r[3],e[i+4]=r[4],e[i+5]=r[5],e[i+6]=r[6],e[i+7]=r[7],e[i+8]=r[8],e[i+9]=r[9],e[i+10]=r[10],e[i+11]=r[11],e[i+12]=r[12],e[i+13]=r[13],e[i+14]=r[14],e[i+15]=r[15],e}}const $r=new st,xi=new Sn,Ix=new st(0,0,0),Fx=new st(1,1,1),Ra=new st,ql=new st,ti=new st,Qg=new Sn,Jg=new Co;class yc{constructor(e=0,i=0,r=0,l=yc.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=i,this._z=r,this._order=l}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,i,r,l=this._order){return this._x=e,this._y=i,this._z=r,this._order=l,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,i=this._order,r=!0){const l=e.elements,u=l[0],h=l[4],d=l[8],m=l[1],p=l[5],g=l[9],v=l[2],S=l[6],y=l[10];switch(i){case"XYZ":this._y=Math.asin(kn(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(-g,y),this._z=Math.atan2(-h,u)):(this._x=Math.atan2(S,p),this._z=0);break;case"YXZ":this._x=Math.asin(-kn(g,-1,1)),Math.abs(g)<.9999999?(this._y=Math.atan2(d,y),this._z=Math.atan2(m,p)):(this._y=Math.atan2(-v,u),this._z=0);break;case"ZXY":this._x=Math.asin(kn(S,-1,1)),Math.abs(S)<.9999999?(this._y=Math.atan2(-v,y),this._z=Math.atan2(-h,p)):(this._y=0,this._z=Math.atan2(m,u));break;case"ZYX":this._y=Math.asin(-kn(v,-1,1)),Math.abs(v)<.9999999?(this._x=Math.atan2(S,y),this._z=Math.atan2(m,u)):(this._x=0,this._z=Math.atan2(-h,p));break;case"YZX":this._z=Math.asin(kn(m,-1,1)),Math.abs(m)<.9999999?(this._x=Math.atan2(-g,p),this._y=Math.atan2(-v,u)):(this._x=0,this._y=Math.atan2(d,y));break;case"XZY":this._z=Math.asin(-kn(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(S,p),this._y=Math.atan2(d,u)):(this._x=Math.atan2(-g,y),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+i)}return this._order=i,r===!0&&this._onChangeCallback(),this}setFromQuaternion(e,i,r){return Qg.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Qg,i,r)}setFromVector3(e,i=this._order){return this.set(e.x,e.y,e.z,i)}reorder(e){return Jg.setFromEuler(this),this.setFromQuaternion(Jg,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],i=0){return e[i]=this._x,e[i+1]=this._y,e[i+2]=this._z,e[i+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}yc.DEFAULT_ORDER="XYZ";class tv{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Hx=0;const $g=new st,ts=new Co,Yi=new Sn,Yl=new st,Mo=new st,Gx=new st,Vx=new Co,t_=new st(1,0,0),e_=new st(0,1,0),n_=new st(0,0,1),kx={type:"added"},Xx={type:"removed"};class Wn extends vs{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Hx++}),this.uuid=wo(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Wn.DEFAULT_UP.clone();const e=new st,i=new yc,r=new Co,l=new st(1,1,1);function u(){r.setFromEuler(i,!1)}function h(){i.setFromQuaternion(r,void 0,!1)}i._onChange(u),r._onChange(h),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:i},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:l},modelViewMatrix:{value:new Sn},normalMatrix:{value:new Me}}),this.matrix=new Sn,this.matrixWorld=new Sn,this.matrixAutoUpdate=Wn.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Wn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new tv,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,i){this.quaternion.setFromAxisAngle(e,i)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,i){return ts.setFromAxisAngle(e,i),this.quaternion.multiply(ts),this}rotateOnWorldAxis(e,i){return ts.setFromAxisAngle(e,i),this.quaternion.premultiply(ts),this}rotateX(e){return this.rotateOnAxis(t_,e)}rotateY(e){return this.rotateOnAxis(e_,e)}rotateZ(e){return this.rotateOnAxis(n_,e)}translateOnAxis(e,i){return $g.copy(e).applyQuaternion(this.quaternion),this.position.add($g.multiplyScalar(i)),this}translateX(e){return this.translateOnAxis(t_,e)}translateY(e){return this.translateOnAxis(e_,e)}translateZ(e){return this.translateOnAxis(n_,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Yi.copy(this.matrixWorld).invert())}lookAt(e,i,r){e.isVector3?Yl.copy(e):Yl.set(e,i,r);const l=this.parent;this.updateWorldMatrix(!0,!1),Mo.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Yi.lookAt(Mo,Yl,this.up):Yi.lookAt(Yl,Mo,this.up),this.quaternion.setFromRotationMatrix(Yi),l&&(Yi.extractRotation(l.matrixWorld),ts.setFromRotationMatrix(Yi),this.quaternion.premultiply(ts.invert()))}add(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.add(arguments[i]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.parent!==null&&e.parent.remove(e),e.parent=this,this.children.push(e),e.dispatchEvent(kx)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let r=0;r<arguments.length;r++)this.remove(arguments[r]);return this}const i=this.children.indexOf(e);return i!==-1&&(e.parent=null,this.children.splice(i,1),e.dispatchEvent(Xx)),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Yi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Yi.multiply(e.parent.matrixWorld)),e.applyMatrix4(Yi),this.add(e),e.updateWorldMatrix(!1,!0),this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,i){if(this[e]===i)return this;for(let r=0,l=this.children.length;r<l;r++){const h=this.children[r].getObjectByProperty(e,i);if(h!==void 0)return h}}getObjectsByProperty(e,i,r=[]){this[e]===i&&r.push(this);const l=this.children;for(let u=0,h=l.length;u<h;u++)l[u].getObjectsByProperty(e,i,r);return r}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Mo,e,Gx),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Mo,Vx,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const i=this.matrixWorld.elements;return e.set(i[8],i[9],i[10]).normalize()}raycast(){}traverse(e){e(this);const i=this.children;for(let r=0,l=i.length;r<l;r++)i[r].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const i=this.children;for(let r=0,l=i.length;r<l;r++)i[r].traverseVisible(e)}traverseAncestors(e){const i=this.parent;i!==null&&(e(i),i.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,e=!0);const i=this.children;for(let r=0,l=i.length;r<l;r++){const u=i[r];(u.matrixWorldAutoUpdate===!0||e===!0)&&u.updateMatrixWorld(e)}}updateWorldMatrix(e,i){const r=this.parent;if(e===!0&&r!==null&&r.matrixWorldAutoUpdate===!0&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),i===!0){const l=this.children;for(let u=0,h=l.length;u<h;u++){const d=l[u];d.matrixWorldAutoUpdate===!0&&d.updateWorldMatrix(!1,!0)}}}toJSON(e){const i=e===void 0||typeof e=="string",r={};i&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},r.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const l={};l.uuid=this.uuid,l.type=this.type,this.name!==""&&(l.name=this.name),this.castShadow===!0&&(l.castShadow=!0),this.receiveShadow===!0&&(l.receiveShadow=!0),this.visible===!1&&(l.visible=!1),this.frustumCulled===!1&&(l.frustumCulled=!1),this.renderOrder!==0&&(l.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(l.userData=this.userData),l.layers=this.layers.mask,l.matrix=this.matrix.toArray(),l.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(l.matrixAutoUpdate=!1),this.isInstancedMesh&&(l.type="InstancedMesh",l.count=this.count,l.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(l.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(l.type="BatchedMesh",l.perObjectFrustumCulled=this.perObjectFrustumCulled,l.sortObjects=this.sortObjects,l.drawRanges=this._drawRanges,l.reservedRanges=this._reservedRanges,l.visibility=this._visibility,l.active=this._active,l.bounds=this._bounds.map(d=>({boxInitialized:d.boxInitialized,boxMin:d.box.min.toArray(),boxMax:d.box.max.toArray(),sphereInitialized:d.sphereInitialized,sphereRadius:d.sphere.radius,sphereCenter:d.sphere.center.toArray()})),l.maxGeometryCount=this._maxGeometryCount,l.maxVertexCount=this._maxVertexCount,l.maxIndexCount=this._maxIndexCount,l.geometryInitialized=this._geometryInitialized,l.geometryCount=this._geometryCount,l.matricesTexture=this._matricesTexture.toJSON(e),this.boundingSphere!==null&&(l.boundingSphere={center:l.boundingSphere.center.toArray(),radius:l.boundingSphere.radius}),this.boundingBox!==null&&(l.boundingBox={min:l.boundingBox.min.toArray(),max:l.boundingBox.max.toArray()}));function u(d,m){return d[m.uuid]===void 0&&(d[m.uuid]=m.toJSON(e)),m.uuid}if(this.isScene)this.background&&(this.background.isColor?l.background=this.background.toJSON():this.background.isTexture&&(l.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(l.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){l.geometry=u(e.geometries,this.geometry);const d=this.geometry.parameters;if(d!==void 0&&d.shapes!==void 0){const m=d.shapes;if(Array.isArray(m))for(let p=0,g=m.length;p<g;p++){const v=m[p];u(e.shapes,v)}else u(e.shapes,m)}}if(this.isSkinnedMesh&&(l.bindMode=this.bindMode,l.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(u(e.skeletons,this.skeleton),l.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const d=[];for(let m=0,p=this.material.length;m<p;m++)d.push(u(e.materials,this.material[m]));l.material=d}else l.material=u(e.materials,this.material);if(this.children.length>0){l.children=[];for(let d=0;d<this.children.length;d++)l.children.push(this.children[d].toJSON(e).object)}if(this.animations.length>0){l.animations=[];for(let d=0;d<this.animations.length;d++){const m=this.animations[d];l.animations.push(u(e.animations,m))}}if(i){const d=h(e.geometries),m=h(e.materials),p=h(e.textures),g=h(e.images),v=h(e.shapes),S=h(e.skeletons),y=h(e.animations),b=h(e.nodes);d.length>0&&(r.geometries=d),m.length>0&&(r.materials=m),p.length>0&&(r.textures=p),g.length>0&&(r.images=g),v.length>0&&(r.shapes=v),S.length>0&&(r.skeletons=S),y.length>0&&(r.animations=y),b.length>0&&(r.nodes=b)}return r.object=l,r;function h(d){const m=[];for(const p in d){const g=d[p];delete g.metadata,m.push(g)}return m}}clone(e){return new this.constructor().copy(this,e)}copy(e,i=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),i===!0)for(let r=0;r<e.children.length;r++){const l=e.children[r];this.add(l.clone())}return this}}Wn.DEFAULT_UP=new st(0,1,0);Wn.DEFAULT_MATRIX_AUTO_UPDATE=!0;Wn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Mi=new st,ji=new st,Zf=new st,Zi=new st,es=new st,ns=new st,i_=new st,Kf=new st,Qf=new st,Jf=new st;let jl=!1;class yi{constructor(e=new st,i=new st,r=new st){this.a=e,this.b=i,this.c=r}static getNormal(e,i,r,l){l.subVectors(r,i),Mi.subVectors(e,i),l.cross(Mi);const u=l.lengthSq();return u>0?l.multiplyScalar(1/Math.sqrt(u)):l.set(0,0,0)}static getBarycoord(e,i,r,l,u){Mi.subVectors(l,i),ji.subVectors(r,i),Zf.subVectors(e,i);const h=Mi.dot(Mi),d=Mi.dot(ji),m=Mi.dot(Zf),p=ji.dot(ji),g=ji.dot(Zf),v=h*p-d*d;if(v===0)return u.set(0,0,0),null;const S=1/v,y=(p*m-d*g)*S,b=(h*g-d*m)*S;return u.set(1-y-b,b,y)}static containsPoint(e,i,r,l){return this.getBarycoord(e,i,r,l,Zi)===null?!1:Zi.x>=0&&Zi.y>=0&&Zi.x+Zi.y<=1}static getUV(e,i,r,l,u,h,d,m){return jl===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),jl=!0),this.getInterpolation(e,i,r,l,u,h,d,m)}static getInterpolation(e,i,r,l,u,h,d,m){return this.getBarycoord(e,i,r,l,Zi)===null?(m.x=0,m.y=0,"z"in m&&(m.z=0),"w"in m&&(m.w=0),null):(m.setScalar(0),m.addScaledVector(u,Zi.x),m.addScaledVector(h,Zi.y),m.addScaledVector(d,Zi.z),m)}static isFrontFacing(e,i,r,l){return Mi.subVectors(r,i),ji.subVectors(e,i),Mi.cross(ji).dot(l)<0}set(e,i,r){return this.a.copy(e),this.b.copy(i),this.c.copy(r),this}setFromPointsAndIndices(e,i,r,l){return this.a.copy(e[i]),this.b.copy(e[r]),this.c.copy(e[l]),this}setFromAttributeAndIndices(e,i,r,l){return this.a.fromBufferAttribute(e,i),this.b.fromBufferAttribute(e,r),this.c.fromBufferAttribute(e,l),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Mi.subVectors(this.c,this.b),ji.subVectors(this.a,this.b),Mi.cross(ji).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return yi.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,i){return yi.getBarycoord(e,this.a,this.b,this.c,i)}getUV(e,i,r,l,u){return jl===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),jl=!0),yi.getInterpolation(e,this.a,this.b,this.c,i,r,l,u)}getInterpolation(e,i,r,l,u){return yi.getInterpolation(e,this.a,this.b,this.c,i,r,l,u)}containsPoint(e){return yi.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return yi.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,i){const r=this.a,l=this.b,u=this.c;let h,d;es.subVectors(l,r),ns.subVectors(u,r),Kf.subVectors(e,r);const m=es.dot(Kf),p=ns.dot(Kf);if(m<=0&&p<=0)return i.copy(r);Qf.subVectors(e,l);const g=es.dot(Qf),v=ns.dot(Qf);if(g>=0&&v<=g)return i.copy(l);const S=m*v-g*p;if(S<=0&&m>=0&&g<=0)return h=m/(m-g),i.copy(r).addScaledVector(es,h);Jf.subVectors(e,u);const y=es.dot(Jf),b=ns.dot(Jf);if(b>=0&&y<=b)return i.copy(u);const A=y*p-m*b;if(A<=0&&p>=0&&b<=0)return d=p/(p-b),i.copy(r).addScaledVector(ns,d);const x=g*b-y*v;if(x<=0&&v-g>=0&&y-b>=0)return i_.subVectors(u,l),d=(v-g)/(v-g+(y-b)),i.copy(l).addScaledVector(i_,d);const _=1/(x+A+S);return h=A*_,d=S*_,i.copy(r).addScaledVector(es,h).addScaledVector(ns,d)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const ev={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},wa={h:0,s:0,l:0},Zl={h:0,s:0,l:0};function $f(o,e,i){return i<0&&(i+=1),i>1&&(i-=1),i<1/6?o+(e-o)*6*i:i<1/2?e:i<2/3?o+(e-o)*6*(2/3-i):o}class Qt{constructor(e,i,r){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,i,r)}set(e,i,r){if(i===void 0&&r===void 0){const l=e;l&&l.isColor?this.copy(l):typeof l=="number"?this.setHex(l):typeof l=="string"&&this.setStyle(l)}else this.setRGB(e,i,r);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,i=bn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Fe.toWorkingColorSpace(this,i),this}setRGB(e,i,r,l=Fe.workingColorSpace){return this.r=e,this.g=i,this.b=r,Fe.toWorkingColorSpace(this,l),this}setHSL(e,i,r,l=Fe.workingColorSpace){if(e=Dx(e,1),i=kn(i,0,1),r=kn(r,0,1),i===0)this.r=this.g=this.b=r;else{const u=r<=.5?r*(1+i):r+i-r*i,h=2*r-u;this.r=$f(h,u,e+1/3),this.g=$f(h,u,e),this.b=$f(h,u,e-1/3)}return Fe.toWorkingColorSpace(this,l),this}setStyle(e,i=bn){function r(u){u!==void 0&&parseFloat(u)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let l;if(l=/^(\w+)\(([^\)]*)\)/.exec(e)){let u;const h=l[1],d=l[2];switch(h){case"rgb":case"rgba":if(u=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(d))return r(u[4]),this.setRGB(Math.min(255,parseInt(u[1],10))/255,Math.min(255,parseInt(u[2],10))/255,Math.min(255,parseInt(u[3],10))/255,i);if(u=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(d))return r(u[4]),this.setRGB(Math.min(100,parseInt(u[1],10))/100,Math.min(100,parseInt(u[2],10))/100,Math.min(100,parseInt(u[3],10))/100,i);break;case"hsl":case"hsla":if(u=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(d))return r(u[4]),this.setHSL(parseFloat(u[1])/360,parseFloat(u[2])/100,parseFloat(u[3])/100,i);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(l=/^\#([A-Fa-f\d]+)$/.exec(e)){const u=l[1],h=u.length;if(h===3)return this.setRGB(parseInt(u.charAt(0),16)/15,parseInt(u.charAt(1),16)/15,parseInt(u.charAt(2),16)/15,i);if(h===6)return this.setHex(parseInt(u,16),i);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,i);return this}setColorName(e,i=bn){const r=ev[e.toLowerCase()];return r!==void 0?this.setHex(r,i):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=hs(e.r),this.g=hs(e.g),this.b=hs(e.b),this}copyLinearToSRGB(e){return this.r=Gf(e.r),this.g=Gf(e.g),this.b=Gf(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=bn){return Fe.fromWorkingColorSpace(Un.copy(this),e),Math.round(kn(Un.r*255,0,255))*65536+Math.round(kn(Un.g*255,0,255))*256+Math.round(kn(Un.b*255,0,255))}getHexString(e=bn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,i=Fe.workingColorSpace){Fe.fromWorkingColorSpace(Un.copy(this),i);const r=Un.r,l=Un.g,u=Un.b,h=Math.max(r,l,u),d=Math.min(r,l,u);let m,p;const g=(d+h)/2;if(d===h)m=0,p=0;else{const v=h-d;switch(p=g<=.5?v/(h+d):v/(2-h-d),h){case r:m=(l-u)/v+(l<u?6:0);break;case l:m=(u-r)/v+2;break;case u:m=(r-l)/v+4;break}m/=6}return e.h=m,e.s=p,e.l=g,e}getRGB(e,i=Fe.workingColorSpace){return Fe.fromWorkingColorSpace(Un.copy(this),i),e.r=Un.r,e.g=Un.g,e.b=Un.b,e}getStyle(e=bn){Fe.fromWorkingColorSpace(Un.copy(this),e);const i=Un.r,r=Un.g,l=Un.b;return e!==bn?`color(${e} ${i.toFixed(3)} ${r.toFixed(3)} ${l.toFixed(3)})`:`rgb(${Math.round(i*255)},${Math.round(r*255)},${Math.round(l*255)})`}offsetHSL(e,i,r){return this.getHSL(wa),this.setHSL(wa.h+e,wa.s+i,wa.l+r)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,i){return this.r=e.r+i.r,this.g=e.g+i.g,this.b=e.b+i.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,i){return this.r+=(e.r-this.r)*i,this.g+=(e.g-this.g)*i,this.b+=(e.b-this.b)*i,this}lerpColors(e,i,r){return this.r=e.r+(i.r-e.r)*r,this.g=e.g+(i.g-e.g)*r,this.b=e.b+(i.b-e.b)*r,this}lerpHSL(e,i){this.getHSL(wa),e.getHSL(Zl);const r=Ff(wa.h,Zl.h,i),l=Ff(wa.s,Zl.s,i),u=Ff(wa.l,Zl.l,i);return this.setHSL(r,l,u),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const i=this.r,r=this.g,l=this.b,u=e.elements;return this.r=u[0]*i+u[3]*r+u[6]*l,this.g=u[1]*i+u[4]*r+u[7]*l,this.b=u[2]*i+u[5]*r+u[8]*l,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,i=0){return this.r=e[i],this.g=e[i+1],this.b=e[i+2],this}toArray(e=[],i=0){return e[i]=this.r,e[i+1]=this.g,e[i+2]=this.b,e}fromBufferAttribute(e,i){return this.r=e.getX(i),this.g=e.getY(i),this.b=e.getZ(i),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Un=new Qt;Qt.NAMES=ev;let Wx=0;class Lo extends vs{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Wx++}),this.uuid=wo(),this.name="",this.type="Material",this.blending=ds,this.side=Pa,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=fd,this.blendDst=dd,this.blendEquation=or,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Qt(0,0,0),this.blendAlpha=0,this.depthFunc=hc,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=kg,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=jr,this.stencilZFail=jr,this.stencilZPass=jr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const i in e){const r=e[i];if(r===void 0){console.warn(`THREE.Material: parameter '${i}' has value of undefined.`);continue}const l=this[i];if(l===void 0){console.warn(`THREE.Material: '${i}' is not a property of THREE.${this.type}.`);continue}l&&l.isColor?l.set(r):l&&l.isVector3&&r&&r.isVector3?l.copy(r):this[i]=r}}toJSON(e){const i=e===void 0||typeof e=="string";i&&(e={textures:{},images:{}});const r={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.color&&this.color.isColor&&(r.color=this.color.getHex()),this.roughness!==void 0&&(r.roughness=this.roughness),this.metalness!==void 0&&(r.metalness=this.metalness),this.sheen!==void 0&&(r.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(r.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(r.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(r.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(r.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(r.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(r.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(r.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(r.shininess=this.shininess),this.clearcoat!==void 0&&(r.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(r.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(r.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(r.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(r.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,r.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(r.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(r.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(r.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(r.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(r.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(r.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(r.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(r.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(r.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(r.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(r.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(r.lightMap=this.lightMap.toJSON(e).uuid,r.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(r.aoMap=this.aoMap.toJSON(e).uuid,r.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(r.bumpMap=this.bumpMap.toJSON(e).uuid,r.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(r.normalMap=this.normalMap.toJSON(e).uuid,r.normalMapType=this.normalMapType,r.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(r.displacementMap=this.displacementMap.toJSON(e).uuid,r.displacementScale=this.displacementScale,r.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(r.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(r.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(r.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(r.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(r.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(r.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(r.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(r.combine=this.combine)),this.envMapIntensity!==void 0&&(r.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(r.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(r.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(r.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(r.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(r.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(r.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(r.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(r.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(r.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(r.size=this.size),this.shadowSide!==null&&(r.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(r.sizeAttenuation=this.sizeAttenuation),this.blending!==ds&&(r.blending=this.blending),this.side!==Pa&&(r.side=this.side),this.vertexColors===!0&&(r.vertexColors=!0),this.opacity<1&&(r.opacity=this.opacity),this.transparent===!0&&(r.transparent=!0),this.blendSrc!==fd&&(r.blendSrc=this.blendSrc),this.blendDst!==dd&&(r.blendDst=this.blendDst),this.blendEquation!==or&&(r.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(r.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(r.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(r.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(r.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(r.blendAlpha=this.blendAlpha),this.depthFunc!==hc&&(r.depthFunc=this.depthFunc),this.depthTest===!1&&(r.depthTest=this.depthTest),this.depthWrite===!1&&(r.depthWrite=this.depthWrite),this.colorWrite===!1&&(r.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(r.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==kg&&(r.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(r.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(r.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==jr&&(r.stencilFail=this.stencilFail),this.stencilZFail!==jr&&(r.stencilZFail=this.stencilZFail),this.stencilZPass!==jr&&(r.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(r.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(r.rotation=this.rotation),this.polygonOffset===!0&&(r.polygonOffset=!0),this.polygonOffsetFactor!==0&&(r.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(r.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(r.linewidth=this.linewidth),this.dashSize!==void 0&&(r.dashSize=this.dashSize),this.gapSize!==void 0&&(r.gapSize=this.gapSize),this.scale!==void 0&&(r.scale=this.scale),this.dithering===!0&&(r.dithering=!0),this.alphaTest>0&&(r.alphaTest=this.alphaTest),this.alphaHash===!0&&(r.alphaHash=!0),this.alphaToCoverage===!0&&(r.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(r.premultipliedAlpha=!0),this.forceSinglePass===!0&&(r.forceSinglePass=!0),this.wireframe===!0&&(r.wireframe=!0),this.wireframeLinewidth>1&&(r.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(r.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(r.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(r.flatShading=!0),this.visible===!1&&(r.visible=!1),this.toneMapped===!1&&(r.toneMapped=!1),this.fog===!1&&(r.fog=!1),Object.keys(this.userData).length>0&&(r.userData=this.userData);function l(u){const h=[];for(const d in u){const m=u[d];delete m.metadata,h.push(m)}return h}if(i){const u=l(e.textures),h=l(e.images);u.length>0&&(r.textures=u),h.length>0&&(r.images=h)}return r}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const i=e.clippingPlanes;let r=null;if(i!==null){const l=i.length;r=new Array(l);for(let u=0;u!==l;++u)r[u]=i[u].clone()}return this.clippingPlanes=r,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class nv extends Lo{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Qt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=I_,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const ln=new st,Kl=new He;class mi{constructor(e,i,r=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=i,this.count=e!==void 0?e.length/i:0,this.normalized=r,this.usage=Xg,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=Da,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,i){this.updateRanges.push({start:e,count:i})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,i,r){e*=this.itemSize,r*=i.itemSize;for(let l=0,u=this.itemSize;l<u;l++)this.array[e+l]=i.array[r+l];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let i=0,r=this.count;i<r;i++)Kl.fromBufferAttribute(this,i),Kl.applyMatrix3(e),this.setXY(i,Kl.x,Kl.y);else if(this.itemSize===3)for(let i=0,r=this.count;i<r;i++)ln.fromBufferAttribute(this,i),ln.applyMatrix3(e),this.setXYZ(i,ln.x,ln.y,ln.z);return this}applyMatrix4(e){for(let i=0,r=this.count;i<r;i++)ln.fromBufferAttribute(this,i),ln.applyMatrix4(e),this.setXYZ(i,ln.x,ln.y,ln.z);return this}applyNormalMatrix(e){for(let i=0,r=this.count;i<r;i++)ln.fromBufferAttribute(this,i),ln.applyNormalMatrix(e),this.setXYZ(i,ln.x,ln.y,ln.z);return this}transformDirection(e){for(let i=0,r=this.count;i<r;i++)ln.fromBufferAttribute(this,i),ln.transformDirection(e),this.setXYZ(i,ln.x,ln.y,ln.z);return this}set(e,i=0){return this.array.set(e,i),this}getComponent(e,i){let r=this.array[e*this.itemSize+i];return this.normalized&&(r=vo(r,this.array)),r}setComponent(e,i,r){return this.normalized&&(r=Vn(r,this.array)),this.array[e*this.itemSize+i]=r,this}getX(e){let i=this.array[e*this.itemSize];return this.normalized&&(i=vo(i,this.array)),i}setX(e,i){return this.normalized&&(i=Vn(i,this.array)),this.array[e*this.itemSize]=i,this}getY(e){let i=this.array[e*this.itemSize+1];return this.normalized&&(i=vo(i,this.array)),i}setY(e,i){return this.normalized&&(i=Vn(i,this.array)),this.array[e*this.itemSize+1]=i,this}getZ(e){let i=this.array[e*this.itemSize+2];return this.normalized&&(i=vo(i,this.array)),i}setZ(e,i){return this.normalized&&(i=Vn(i,this.array)),this.array[e*this.itemSize+2]=i,this}getW(e){let i=this.array[e*this.itemSize+3];return this.normalized&&(i=vo(i,this.array)),i}setW(e,i){return this.normalized&&(i=Vn(i,this.array)),this.array[e*this.itemSize+3]=i,this}setXY(e,i,r){return e*=this.itemSize,this.normalized&&(i=Vn(i,this.array),r=Vn(r,this.array)),this.array[e+0]=i,this.array[e+1]=r,this}setXYZ(e,i,r,l){return e*=this.itemSize,this.normalized&&(i=Vn(i,this.array),r=Vn(r,this.array),l=Vn(l,this.array)),this.array[e+0]=i,this.array[e+1]=r,this.array[e+2]=l,this}setXYZW(e,i,r,l,u){return e*=this.itemSize,this.normalized&&(i=Vn(i,this.array),r=Vn(r,this.array),l=Vn(l,this.array),u=Vn(u,this.array)),this.array[e+0]=i,this.array[e+1]=r,this.array[e+2]=l,this.array[e+3]=u,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Xg&&(e.usage=this.usage),e}}class iv extends mi{constructor(e,i,r){super(new Uint16Array(e),i,r)}}class av extends mi{constructor(e,i,r){super(new Uint32Array(e),i,r)}}class dr extends mi{constructor(e,i,r){super(new Float32Array(e),i,r)}}let qx=0;const fi=new Sn,td=new Wn,is=new st,ei=new Do,yo=new Do,vn=new st;class ta extends vs{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:qx++}),this.uuid=wo(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Z_(e)?av:iv)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,i){return this.attributes[e]=i,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,i,r=0){this.groups.push({start:e,count:i,materialIndex:r})}clearGroups(){this.groups=[]}setDrawRange(e,i){this.drawRange.start=e,this.drawRange.count=i}applyMatrix4(e){const i=this.attributes.position;i!==void 0&&(i.applyMatrix4(e),i.needsUpdate=!0);const r=this.attributes.normal;if(r!==void 0){const u=new Me().getNormalMatrix(e);r.applyNormalMatrix(u),r.needsUpdate=!0}const l=this.attributes.tangent;return l!==void 0&&(l.transformDirection(e),l.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return fi.makeRotationFromQuaternion(e),this.applyMatrix4(fi),this}rotateX(e){return fi.makeRotationX(e),this.applyMatrix4(fi),this}rotateY(e){return fi.makeRotationY(e),this.applyMatrix4(fi),this}rotateZ(e){return fi.makeRotationZ(e),this.applyMatrix4(fi),this}translate(e,i,r){return fi.makeTranslation(e,i,r),this.applyMatrix4(fi),this}scale(e,i,r){return fi.makeScale(e,i,r),this.applyMatrix4(fi),this}lookAt(e){return td.lookAt(e),td.updateMatrix(),this.applyMatrix4(td.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(is).negate(),this.translate(is.x,is.y,is.z),this}setFromPoints(e){const i=[];for(let r=0,l=e.length;r<l;r++){const u=e[r];i.push(u.x,u.y,u.z||0)}return this.setAttribute("position",new dr(i,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Do);const e=this.attributes.position,i=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new st(-1/0,-1/0,-1/0),new st(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),i)for(let r=0,l=i.length;r<l;r++){const u=i[r];ei.setFromBufferAttribute(u),this.morphTargetsRelative?(vn.addVectors(this.boundingBox.min,ei.min),this.boundingBox.expandByPoint(vn),vn.addVectors(this.boundingBox.max,ei.max),this.boundingBox.expandByPoint(vn)):(this.boundingBox.expandByPoint(ei.min),this.boundingBox.expandByPoint(ei.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Mc);const e=this.attributes.position,i=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new st,1/0);return}if(e){const r=this.boundingSphere.center;if(ei.setFromBufferAttribute(e),i)for(let u=0,h=i.length;u<h;u++){const d=i[u];yo.setFromBufferAttribute(d),this.morphTargetsRelative?(vn.addVectors(ei.min,yo.min),ei.expandByPoint(vn),vn.addVectors(ei.max,yo.max),ei.expandByPoint(vn)):(ei.expandByPoint(yo.min),ei.expandByPoint(yo.max))}ei.getCenter(r);let l=0;for(let u=0,h=e.count;u<h;u++)vn.fromBufferAttribute(e,u),l=Math.max(l,r.distanceToSquared(vn));if(i)for(let u=0,h=i.length;u<h;u++){const d=i[u],m=this.morphTargetsRelative;for(let p=0,g=d.count;p<g;p++)vn.fromBufferAttribute(d,p),m&&(is.fromBufferAttribute(e,p),vn.add(is)),l=Math.max(l,r.distanceToSquared(vn))}this.boundingSphere.radius=Math.sqrt(l),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,i=this.attributes;if(e===null||i.position===void 0||i.normal===void 0||i.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const r=e.array,l=i.position.array,u=i.normal.array,h=i.uv.array,d=l.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new mi(new Float32Array(4*d),4));const m=this.getAttribute("tangent").array,p=[],g=[];for(let U=0;U<d;U++)p[U]=new st,g[U]=new st;const v=new st,S=new st,y=new st,b=new He,A=new He,x=new He,_=new st,N=new st;function D(U,ut,lt){v.fromArray(l,U*3),S.fromArray(l,ut*3),y.fromArray(l,lt*3),b.fromArray(h,U*2),A.fromArray(h,ut*2),x.fromArray(h,lt*2),S.sub(v),y.sub(v),A.sub(b),x.sub(b);const yt=1/(A.x*x.y-x.x*A.y);isFinite(yt)&&(_.copy(S).multiplyScalar(x.y).addScaledVector(y,-A.y).multiplyScalar(yt),N.copy(y).multiplyScalar(A.x).addScaledVector(S,-x.x).multiplyScalar(yt),p[U].add(_),p[ut].add(_),p[lt].add(_),g[U].add(N),g[ut].add(N),g[lt].add(N))}let P=this.groups;P.length===0&&(P=[{start:0,count:r.length}]);for(let U=0,ut=P.length;U<ut;++U){const lt=P[U],yt=lt.start,X=lt.count;for(let $=yt,O=yt+X;$<O;$+=3)D(r[$+0],r[$+1],r[$+2])}const G=new st,F=new st,I=new st,mt=new st;function C(U){I.fromArray(u,U*3),mt.copy(I);const ut=p[U];G.copy(ut),G.sub(I.multiplyScalar(I.dot(ut))).normalize(),F.crossVectors(mt,ut);const yt=F.dot(g[U])<0?-1:1;m[U*4]=G.x,m[U*4+1]=G.y,m[U*4+2]=G.z,m[U*4+3]=yt}for(let U=0,ut=P.length;U<ut;++U){const lt=P[U],yt=lt.start,X=lt.count;for(let $=yt,O=yt+X;$<O;$+=3)C(r[$+0]),C(r[$+1]),C(r[$+2])}}computeVertexNormals(){const e=this.index,i=this.getAttribute("position");if(i!==void 0){let r=this.getAttribute("normal");if(r===void 0)r=new mi(new Float32Array(i.count*3),3),this.setAttribute("normal",r);else for(let S=0,y=r.count;S<y;S++)r.setXYZ(S,0,0,0);const l=new st,u=new st,h=new st,d=new st,m=new st,p=new st,g=new st,v=new st;if(e)for(let S=0,y=e.count;S<y;S+=3){const b=e.getX(S+0),A=e.getX(S+1),x=e.getX(S+2);l.fromBufferAttribute(i,b),u.fromBufferAttribute(i,A),h.fromBufferAttribute(i,x),g.subVectors(h,u),v.subVectors(l,u),g.cross(v),d.fromBufferAttribute(r,b),m.fromBufferAttribute(r,A),p.fromBufferAttribute(r,x),d.add(g),m.add(g),p.add(g),r.setXYZ(b,d.x,d.y,d.z),r.setXYZ(A,m.x,m.y,m.z),r.setXYZ(x,p.x,p.y,p.z)}else for(let S=0,y=i.count;S<y;S+=3)l.fromBufferAttribute(i,S+0),u.fromBufferAttribute(i,S+1),h.fromBufferAttribute(i,S+2),g.subVectors(h,u),v.subVectors(l,u),g.cross(v),r.setXYZ(S+0,g.x,g.y,g.z),r.setXYZ(S+1,g.x,g.y,g.z),r.setXYZ(S+2,g.x,g.y,g.z);this.normalizeNormals(),r.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let i=0,r=e.count;i<r;i++)vn.fromBufferAttribute(e,i),vn.normalize(),e.setXYZ(i,vn.x,vn.y,vn.z)}toNonIndexed(){function e(d,m){const p=d.array,g=d.itemSize,v=d.normalized,S=new p.constructor(m.length*g);let y=0,b=0;for(let A=0,x=m.length;A<x;A++){d.isInterleavedBufferAttribute?y=m[A]*d.data.stride+d.offset:y=m[A]*g;for(let _=0;_<g;_++)S[b++]=p[y++]}return new mi(S,g,v)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const i=new ta,r=this.index.array,l=this.attributes;for(const d in l){const m=l[d],p=e(m,r);i.setAttribute(d,p)}const u=this.morphAttributes;for(const d in u){const m=[],p=u[d];for(let g=0,v=p.length;g<v;g++){const S=p[g],y=e(S,r);m.push(y)}i.morphAttributes[d]=m}i.morphTargetsRelative=this.morphTargetsRelative;const h=this.groups;for(let d=0,m=h.length;d<m;d++){const p=h[d];i.addGroup(p.start,p.count,p.materialIndex)}return i}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const m=this.parameters;for(const p in m)m[p]!==void 0&&(e[p]=m[p]);return e}e.data={attributes:{}};const i=this.index;i!==null&&(e.data.index={type:i.array.constructor.name,array:Array.prototype.slice.call(i.array)});const r=this.attributes;for(const m in r){const p=r[m];e.data.attributes[m]=p.toJSON(e.data)}const l={};let u=!1;for(const m in this.morphAttributes){const p=this.morphAttributes[m],g=[];for(let v=0,S=p.length;v<S;v++){const y=p[v];g.push(y.toJSON(e.data))}g.length>0&&(l[m]=g,u=!0)}u&&(e.data.morphAttributes=l,e.data.morphTargetsRelative=this.morphTargetsRelative);const h=this.groups;h.length>0&&(e.data.groups=JSON.parse(JSON.stringify(h)));const d=this.boundingSphere;return d!==null&&(e.data.boundingSphere={center:d.center.toArray(),radius:d.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const i={};this.name=e.name;const r=e.index;r!==null&&this.setIndex(r.clone(i));const l=e.attributes;for(const p in l){const g=l[p];this.setAttribute(p,g.clone(i))}const u=e.morphAttributes;for(const p in u){const g=[],v=u[p];for(let S=0,y=v.length;S<y;S++)g.push(v[S].clone(i));this.morphAttributes[p]=g}this.morphTargetsRelative=e.morphTargetsRelative;const h=e.groups;for(let p=0,g=h.length;p<g;p++){const v=h[p];this.addGroup(v.start,v.count,v.materialIndex)}const d=e.boundingBox;d!==null&&(this.boundingBox=d.clone());const m=e.boundingSphere;return m!==null&&(this.boundingSphere=m.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const a_=new Sn,ir=new $_,Ql=new Mc,r_=new st,as=new st,rs=new st,ss=new st,ed=new st,Jl=new st,$l=new He,tc=new He,ec=new He,s_=new st,o_=new st,l_=new st,nc=new st,ic=new st;class La extends Wn{constructor(e=new ta,i=new nv){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=i,this.updateMorphTargets()}copy(e,i){return super.copy(e,i),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const i=this.geometry.morphAttributes,r=Object.keys(i);if(r.length>0){const l=i[r[0]];if(l!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let u=0,h=l.length;u<h;u++){const d=l[u].name||String(u);this.morphTargetInfluences.push(0),this.morphTargetDictionary[d]=u}}}}getVertexPosition(e,i){const r=this.geometry,l=r.attributes.position,u=r.morphAttributes.position,h=r.morphTargetsRelative;i.fromBufferAttribute(l,e);const d=this.morphTargetInfluences;if(u&&d){Jl.set(0,0,0);for(let m=0,p=u.length;m<p;m++){const g=d[m],v=u[m];g!==0&&(ed.fromBufferAttribute(v,e),h?Jl.addScaledVector(ed,g):Jl.addScaledVector(ed.sub(i),g))}i.add(Jl)}return i}raycast(e,i){const r=this.geometry,l=this.material,u=this.matrixWorld;l!==void 0&&(r.boundingSphere===null&&r.computeBoundingSphere(),Ql.copy(r.boundingSphere),Ql.applyMatrix4(u),ir.copy(e.ray).recast(e.near),!(Ql.containsPoint(ir.origin)===!1&&(ir.intersectSphere(Ql,r_)===null||ir.origin.distanceToSquared(r_)>(e.far-e.near)**2))&&(a_.copy(u).invert(),ir.copy(e.ray).applyMatrix4(a_),!(r.boundingBox!==null&&ir.intersectsBox(r.boundingBox)===!1)&&this._computeIntersections(e,i,ir)))}_computeIntersections(e,i,r){let l;const u=this.geometry,h=this.material,d=u.index,m=u.attributes.position,p=u.attributes.uv,g=u.attributes.uv1,v=u.attributes.normal,S=u.groups,y=u.drawRange;if(d!==null)if(Array.isArray(h))for(let b=0,A=S.length;b<A;b++){const x=S[b],_=h[x.materialIndex],N=Math.max(x.start,y.start),D=Math.min(d.count,Math.min(x.start+x.count,y.start+y.count));for(let P=N,G=D;P<G;P+=3){const F=d.getX(P),I=d.getX(P+1),mt=d.getX(P+2);l=ac(this,_,e,r,p,g,v,F,I,mt),l&&(l.faceIndex=Math.floor(P/3),l.face.materialIndex=x.materialIndex,i.push(l))}}else{const b=Math.max(0,y.start),A=Math.min(d.count,y.start+y.count);for(let x=b,_=A;x<_;x+=3){const N=d.getX(x),D=d.getX(x+1),P=d.getX(x+2);l=ac(this,h,e,r,p,g,v,N,D,P),l&&(l.faceIndex=Math.floor(x/3),i.push(l))}}else if(m!==void 0)if(Array.isArray(h))for(let b=0,A=S.length;b<A;b++){const x=S[b],_=h[x.materialIndex],N=Math.max(x.start,y.start),D=Math.min(m.count,Math.min(x.start+x.count,y.start+y.count));for(let P=N,G=D;P<G;P+=3){const F=P,I=P+1,mt=P+2;l=ac(this,_,e,r,p,g,v,F,I,mt),l&&(l.faceIndex=Math.floor(P/3),l.face.materialIndex=x.materialIndex,i.push(l))}}else{const b=Math.max(0,y.start),A=Math.min(m.count,y.start+y.count);for(let x=b,_=A;x<_;x+=3){const N=x,D=x+1,P=x+2;l=ac(this,h,e,r,p,g,v,N,D,P),l&&(l.faceIndex=Math.floor(x/3),i.push(l))}}}}function Yx(o,e,i,r,l,u,h,d){let m;if(e.side===Xn?m=r.intersectTriangle(h,u,l,!0,d):m=r.intersectTriangle(l,u,h,e.side===Pa,d),m===null)return null;ic.copy(d),ic.applyMatrix4(o.matrixWorld);const p=i.ray.origin.distanceTo(ic);return p<i.near||p>i.far?null:{distance:p,point:ic.clone(),object:o}}function ac(o,e,i,r,l,u,h,d,m,p){o.getVertexPosition(d,as),o.getVertexPosition(m,rs),o.getVertexPosition(p,ss);const g=Yx(o,e,i,r,as,rs,ss,nc);if(g){l&&($l.fromBufferAttribute(l,d),tc.fromBufferAttribute(l,m),ec.fromBufferAttribute(l,p),g.uv=yi.getInterpolation(nc,as,rs,ss,$l,tc,ec,new He)),u&&($l.fromBufferAttribute(u,d),tc.fromBufferAttribute(u,m),ec.fromBufferAttribute(u,p),g.uv1=yi.getInterpolation(nc,as,rs,ss,$l,tc,ec,new He),g.uv2=g.uv1),h&&(s_.fromBufferAttribute(h,d),o_.fromBufferAttribute(h,m),l_.fromBufferAttribute(h,p),g.normal=yi.getInterpolation(nc,as,rs,ss,s_,o_,l_,new st),g.normal.dot(r.direction)>0&&g.normal.multiplyScalar(-1));const v={a:d,b:m,c:p,normal:new st,materialIndex:0};yi.getNormal(as,rs,ss,v.normal),g.face=v}return g}class Uo extends ta{constructor(e=1,i=1,r=1,l=1,u=1,h=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:i,depth:r,widthSegments:l,heightSegments:u,depthSegments:h};const d=this;l=Math.floor(l),u=Math.floor(u),h=Math.floor(h);const m=[],p=[],g=[],v=[];let S=0,y=0;b("z","y","x",-1,-1,r,i,e,h,u,0),b("z","y","x",1,-1,r,i,-e,h,u,1),b("x","z","y",1,1,e,r,i,l,h,2),b("x","z","y",1,-1,e,r,-i,l,h,3),b("x","y","z",1,-1,e,i,r,l,u,4),b("x","y","z",-1,-1,e,i,-r,l,u,5),this.setIndex(m),this.setAttribute("position",new dr(p,3)),this.setAttribute("normal",new dr(g,3)),this.setAttribute("uv",new dr(v,2));function b(A,x,_,N,D,P,G,F,I,mt,C){const U=P/I,ut=G/mt,lt=P/2,yt=G/2,X=F/2,$=I+1,O=mt+1;let q=0,j=0;const ct=new st;for(let R=0;R<O;R++){const k=R*ut-yt;for(let Q=0;Q<$;Q++){const B=Q*U-lt;ct[A]=B*N,ct[x]=k*D,ct[_]=X,p.push(ct.x,ct.y,ct.z),ct[A]=0,ct[x]=0,ct[_]=F>0?1:-1,g.push(ct.x,ct.y,ct.z),v.push(Q/I),v.push(1-R/mt),q+=1}}for(let R=0;R<mt;R++)for(let k=0;k<I;k++){const Q=S+k+$*R,B=S+k+$*(R+1),J=S+(k+1)+$*(R+1),_t=S+(k+1)+$*R;m.push(Q,B,_t),m.push(B,J,_t),j+=6}d.addGroup(y,j,C),y+=j,S+=q}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Uo(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function _s(o){const e={};for(const i in o){e[i]={};for(const r in o[i]){const l=o[i][r];l&&(l.isColor||l.isMatrix3||l.isMatrix4||l.isVector2||l.isVector3||l.isVector4||l.isTexture||l.isQuaternion)?l.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[i][r]=null):e[i][r]=l.clone():Array.isArray(l)?e[i][r]=l.slice():e[i][r]=l}}return e}function Pn(o){const e={};for(let i=0;i<o.length;i++){const r=_s(o[i]);for(const l in r)e[l]=r[l]}return e}function jx(o){const e=[];for(let i=0;i<o.length;i++)e.push(o[i].clone());return e}function rv(o){return o.getRenderTarget()===null?o.outputColorSpace:Fe.workingColorSpace}const Zx={clone:_s,merge:Pn};var Kx=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Qx=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class za extends Lo{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Kx,this.fragmentShader=Qx,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=_s(e.uniforms),this.uniformsGroups=jx(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const i=super.toJSON(e);i.glslVersion=this.glslVersion,i.uniforms={};for(const l in this.uniforms){const h=this.uniforms[l].value;h&&h.isTexture?i.uniforms[l]={type:"t",value:h.toJSON(e).uuid}:h&&h.isColor?i.uniforms[l]={type:"c",value:h.getHex()}:h&&h.isVector2?i.uniforms[l]={type:"v2",value:h.toArray()}:h&&h.isVector3?i.uniforms[l]={type:"v3",value:h.toArray()}:h&&h.isVector4?i.uniforms[l]={type:"v4",value:h.toArray()}:h&&h.isMatrix3?i.uniforms[l]={type:"m3",value:h.toArray()}:h&&h.isMatrix4?i.uniforms[l]={type:"m4",value:h.toArray()}:i.uniforms[l]={value:h}}Object.keys(this.defines).length>0&&(i.defines=this.defines),i.vertexShader=this.vertexShader,i.fragmentShader=this.fragmentShader,i.lights=this.lights,i.clipping=this.clipping;const r={};for(const l in this.extensions)this.extensions[l]===!0&&(r[l]=!0);return Object.keys(r).length>0&&(i.extensions=r),i}}class sv extends Wn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Sn,this.projectionMatrix=new Sn,this.projectionMatrixInverse=new Sn,this.coordinateSystem=Ji}copy(e,i){return super.copy(e,i),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,i){super.updateWorldMatrix(e,i),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}class hi extends sv{constructor(e=50,i=1,r=.1,l=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=r,this.far=l,this.focus=10,this.aspect=i,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,i){return super.copy(e,i),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const i=.5*this.getFilmHeight()/e;this.fov=vd*2*Math.atan(i),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(If*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return vd*2*Math.atan(Math.tan(If*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(e,i,r,l,u,h){this.aspect=e/i,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=i,this.view.offsetX=r,this.view.offsetY=l,this.view.width=u,this.view.height=h,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let i=e*Math.tan(If*.5*this.fov)/this.zoom,r=2*i,l=this.aspect*r,u=-.5*l;const h=this.view;if(this.view!==null&&this.view.enabled){const m=h.fullWidth,p=h.fullHeight;u+=h.offsetX*l/m,i-=h.offsetY*r/p,l*=h.width/m,r*=h.height/p}const d=this.filmOffset;d!==0&&(u+=e*d/this.getFilmWidth()),this.projectionMatrix.makePerspective(u,u+l,i,i-r,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const i=super.toJSON(e);return i.object.fov=this.fov,i.object.zoom=this.zoom,i.object.near=this.near,i.object.far=this.far,i.object.focus=this.focus,i.object.aspect=this.aspect,this.view!==null&&(i.object.view=Object.assign({},this.view)),i.object.filmGauge=this.filmGauge,i.object.filmOffset=this.filmOffset,i}}const os=-90,ls=1;class Jx extends Wn{constructor(e,i,r){super(),this.type="CubeCamera",this.renderTarget=r,this.coordinateSystem=null,this.activeMipmapLevel=0;const l=new hi(os,ls,e,i);l.layers=this.layers,this.add(l);const u=new hi(os,ls,e,i);u.layers=this.layers,this.add(u);const h=new hi(os,ls,e,i);h.layers=this.layers,this.add(h);const d=new hi(os,ls,e,i);d.layers=this.layers,this.add(d);const m=new hi(os,ls,e,i);m.layers=this.layers,this.add(m);const p=new hi(os,ls,e,i);p.layers=this.layers,this.add(p)}updateCoordinateSystem(){const e=this.coordinateSystem,i=this.children.concat(),[r,l,u,h,d,m]=i;for(const p of i)this.remove(p);if(e===Ji)r.up.set(0,1,0),r.lookAt(1,0,0),l.up.set(0,1,0),l.lookAt(-1,0,0),u.up.set(0,0,-1),u.lookAt(0,1,0),h.up.set(0,0,1),h.lookAt(0,-1,0),d.up.set(0,1,0),d.lookAt(0,0,1),m.up.set(0,1,0),m.lookAt(0,0,-1);else if(e===_c)r.up.set(0,-1,0),r.lookAt(-1,0,0),l.up.set(0,-1,0),l.lookAt(1,0,0),u.up.set(0,0,1),u.lookAt(0,1,0),h.up.set(0,0,-1),h.lookAt(0,-1,0),d.up.set(0,-1,0),d.lookAt(0,0,1),m.up.set(0,-1,0),m.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const p of i)this.add(p),p.updateMatrixWorld()}update(e,i){this.parent===null&&this.updateMatrixWorld();const{renderTarget:r,activeMipmapLevel:l}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[u,h,d,m,p,g]=this.children,v=e.getRenderTarget(),S=e.getActiveCubeFace(),y=e.getActiveMipmapLevel(),b=e.xr.enabled;e.xr.enabled=!1;const A=r.texture.generateMipmaps;r.texture.generateMipmaps=!1,e.setRenderTarget(r,0,l),e.render(i,u),e.setRenderTarget(r,1,l),e.render(i,h),e.setRenderTarget(r,2,l),e.render(i,d),e.setRenderTarget(r,3,l),e.render(i,m),e.setRenderTarget(r,4,l),e.render(i,p),r.texture.generateMipmaps=A,e.setRenderTarget(r,5,l),e.render(i,g),e.setRenderTarget(v,S,y),e.xr.enabled=b,r.texture.needsPMREMUpdate=!0}}class ov extends ni{constructor(e,i,r,l,u,h,d,m,p,g){e=e!==void 0?e:[],i=i!==void 0?i:ps,super(e,i,r,l,u,h,d,m,p,g),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class $x extends hr{constructor(e=1,i={}){super(e,e,i),this.isWebGLCubeRenderTarget=!0;const r={width:e,height:e,depth:1},l=[r,r,r,r,r,r];i.encoding!==void 0&&(bo("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),i.colorSpace=i.encoding===fr?bn:pi),this.texture=new ov(l,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=i.generateMipmaps!==void 0?i.generateMipmaps:!1,this.texture.minFilter=i.minFilter!==void 0?i.minFilter:di}fromEquirectangularTexture(e,i){this.texture.type=i.type,this.texture.colorSpace=i.colorSpace,this.texture.generateMipmaps=i.generateMipmaps,this.texture.minFilter=i.minFilter,this.texture.magFilter=i.magFilter;const r={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},l=new Uo(5,5,5),u=new za({name:"CubemapFromEquirect",uniforms:_s(r.uniforms),vertexShader:r.vertexShader,fragmentShader:r.fragmentShader,side:Xn,blending:Ua});u.uniforms.tEquirect.value=i;const h=new La(l,u),d=i.minFilter;return i.minFilter===Ao&&(i.minFilter=di),new Jx(1,10,this).update(e,h),i.minFilter=d,h.geometry.dispose(),h.material.dispose(),this}clear(e,i,r,l){const u=e.getRenderTarget();for(let h=0;h<6;h++)e.setRenderTarget(this,h),e.clear(i,r,l);e.setRenderTarget(u)}}const nd=new st,tM=new st,eM=new Me;class rr{constructor(e=new st(1,0,0),i=0){this.isPlane=!0,this.normal=e,this.constant=i}set(e,i){return this.normal.copy(e),this.constant=i,this}setComponents(e,i,r,l){return this.normal.set(e,i,r),this.constant=l,this}setFromNormalAndCoplanarPoint(e,i){return this.normal.copy(e),this.constant=-i.dot(this.normal),this}setFromCoplanarPoints(e,i,r){const l=nd.subVectors(r,i).cross(tM.subVectors(e,i)).normalize();return this.setFromNormalAndCoplanarPoint(l,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,i){return i.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,i){const r=e.delta(nd),l=this.normal.dot(r);if(l===0)return this.distanceToPoint(e.start)===0?i.copy(e.start):null;const u=-(e.start.dot(this.normal)+this.constant)/l;return u<0||u>1?null:i.copy(e.start).addScaledVector(r,u)}intersectsLine(e){const i=this.distanceToPoint(e.start),r=this.distanceToPoint(e.end);return i<0&&r>0||r<0&&i>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,i){const r=i||eM.getNormalMatrix(e),l=this.coplanarPoint(nd).applyMatrix4(e),u=this.normal.applyMatrix3(r).normalize();return this.constant=-l.dot(u),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ar=new Mc,rc=new st;class lv{constructor(e=new rr,i=new rr,r=new rr,l=new rr,u=new rr,h=new rr){this.planes=[e,i,r,l,u,h]}set(e,i,r,l,u,h){const d=this.planes;return d[0].copy(e),d[1].copy(i),d[2].copy(r),d[3].copy(l),d[4].copy(u),d[5].copy(h),this}copy(e){const i=this.planes;for(let r=0;r<6;r++)i[r].copy(e.planes[r]);return this}setFromProjectionMatrix(e,i=Ji){const r=this.planes,l=e.elements,u=l[0],h=l[1],d=l[2],m=l[3],p=l[4],g=l[5],v=l[6],S=l[7],y=l[8],b=l[9],A=l[10],x=l[11],_=l[12],N=l[13],D=l[14],P=l[15];if(r[0].setComponents(m-u,S-p,x-y,P-_).normalize(),r[1].setComponents(m+u,S+p,x+y,P+_).normalize(),r[2].setComponents(m+h,S+g,x+b,P+N).normalize(),r[3].setComponents(m-h,S-g,x-b,P-N).normalize(),r[4].setComponents(m-d,S-v,x-A,P-D).normalize(),i===Ji)r[5].setComponents(m+d,S+v,x+A,P+D).normalize();else if(i===_c)r[5].setComponents(d,v,A,D).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+i);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ar.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const i=e.geometry;i.boundingSphere===null&&i.computeBoundingSphere(),ar.copy(i.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ar)}intersectsSprite(e){return ar.center.set(0,0,0),ar.radius=.7071067811865476,ar.applyMatrix4(e.matrixWorld),this.intersectsSphere(ar)}intersectsSphere(e){const i=this.planes,r=e.center,l=-e.radius;for(let u=0;u<6;u++)if(i[u].distanceToPoint(r)<l)return!1;return!0}intersectsBox(e){const i=this.planes;for(let r=0;r<6;r++){const l=i[r];if(rc.x=l.normal.x>0?e.max.x:e.min.x,rc.y=l.normal.y>0?e.max.y:e.min.y,rc.z=l.normal.z>0?e.max.z:e.min.z,l.distanceToPoint(rc)<0)return!1}return!0}containsPoint(e){const i=this.planes;for(let r=0;r<6;r++)if(i[r].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function cv(){let o=null,e=!1,i=null,r=null;function l(u,h){i(u,h),r=o.requestAnimationFrame(l)}return{start:function(){e!==!0&&i!==null&&(r=o.requestAnimationFrame(l),e=!0)},stop:function(){o.cancelAnimationFrame(r),e=!1},setAnimationLoop:function(u){i=u},setContext:function(u){o=u}}}function nM(o,e){const i=e.isWebGL2,r=new WeakMap;function l(p,g){const v=p.array,S=p.usage,y=v.byteLength,b=o.createBuffer();o.bindBuffer(g,b),o.bufferData(g,v,S),p.onUploadCallback();let A;if(v instanceof Float32Array)A=o.FLOAT;else if(v instanceof Uint16Array)if(p.isFloat16BufferAttribute)if(i)A=o.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else A=o.UNSIGNED_SHORT;else if(v instanceof Int16Array)A=o.SHORT;else if(v instanceof Uint32Array)A=o.UNSIGNED_INT;else if(v instanceof Int32Array)A=o.INT;else if(v instanceof Int8Array)A=o.BYTE;else if(v instanceof Uint8Array)A=o.UNSIGNED_BYTE;else if(v instanceof Uint8ClampedArray)A=o.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+v);return{buffer:b,type:A,bytesPerElement:v.BYTES_PER_ELEMENT,version:p.version,size:y}}function u(p,g,v){const S=g.array,y=g._updateRange,b=g.updateRanges;if(o.bindBuffer(v,p),y.count===-1&&b.length===0&&o.bufferSubData(v,0,S),b.length!==0){for(let A=0,x=b.length;A<x;A++){const _=b[A];i?o.bufferSubData(v,_.start*S.BYTES_PER_ELEMENT,S,_.start,_.count):o.bufferSubData(v,_.start*S.BYTES_PER_ELEMENT,S.subarray(_.start,_.start+_.count))}g.clearUpdateRanges()}y.count!==-1&&(i?o.bufferSubData(v,y.offset*S.BYTES_PER_ELEMENT,S,y.offset,y.count):o.bufferSubData(v,y.offset*S.BYTES_PER_ELEMENT,S.subarray(y.offset,y.offset+y.count)),y.count=-1),g.onUploadCallback()}function h(p){return p.isInterleavedBufferAttribute&&(p=p.data),r.get(p)}function d(p){p.isInterleavedBufferAttribute&&(p=p.data);const g=r.get(p);g&&(o.deleteBuffer(g.buffer),r.delete(p))}function m(p,g){if(p.isGLBufferAttribute){const S=r.get(p);(!S||S.version<p.version)&&r.set(p,{buffer:p.buffer,type:p.type,bytesPerElement:p.elementSize,version:p.version});return}p.isInterleavedBufferAttribute&&(p=p.data);const v=r.get(p);if(v===void 0)r.set(p,l(p,g));else if(v.version<p.version){if(v.size!==p.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");u(v.buffer,p,g),v.version=p.version}}return{get:h,remove:d,update:m}}class Ad extends ta{constructor(e=1,i=1,r=1,l=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:i,widthSegments:r,heightSegments:l};const u=e/2,h=i/2,d=Math.floor(r),m=Math.floor(l),p=d+1,g=m+1,v=e/d,S=i/m,y=[],b=[],A=[],x=[];for(let _=0;_<g;_++){const N=_*S-h;for(let D=0;D<p;D++){const P=D*v-u;b.push(P,-N,0),A.push(0,0,1),x.push(D/d),x.push(1-_/m)}}for(let _=0;_<m;_++)for(let N=0;N<d;N++){const D=N+p*_,P=N+p*(_+1),G=N+1+p*(_+1),F=N+1+p*_;y.push(D,P,F),y.push(P,G,F)}this.setIndex(y),this.setAttribute("position",new dr(b,3)),this.setAttribute("normal",new dr(A,3)),this.setAttribute("uv",new dr(x,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ad(e.width,e.height,e.widthSegments,e.heightSegments)}}var iM=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,aM=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,rM=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,sM=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,oM=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,lM=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,cM=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,uM=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,fM=`#ifdef USE_BATCHING
	attribute float batchId;
	uniform highp sampler2D batchingTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,dM=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,hM=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,pM=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,mM=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,gM=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,_M=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,vM=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#pragma unroll_loop_start
	for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
		plane = clippingPlanes[ i ];
		if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
	}
	#pragma unroll_loop_end
	#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
		bool clipped = true;
		#pragma unroll_loop_start
		for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
		}
		#pragma unroll_loop_end
		if ( clipped ) discard;
	#endif
#endif`,SM=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,xM=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,MM=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,yM=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,EM=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,TM=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,bM=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,AM=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
float luminance( const in vec3 rgb ) {
	const vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );
	return dot( weights, rgb );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,RM=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,wM=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,CM=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,DM=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,LM=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,UM=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,NM="gl_FragColor = linearToOutputTexel( gl_FragColor );",OM=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}
vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 LinearTosRGB( in vec4 value ) {
	return sRGBTransferOETF( value );
}`,PM=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,zM=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,BM=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,IM=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,FM=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,HM=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,GM=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,VM=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,kM=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,XM=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,WM=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,qM=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,YM=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,jM=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,ZM=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	#if defined ( LEGACY_LIGHTS )
		if ( cutoffDistance > 0.0 && decayExponent > 0.0 ) {
			return pow( saturate( - lightDistance / cutoffDistance + 1.0 ), decayExponent );
		}
		return 1.0;
	#else
		float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
		if ( cutoffDistance > 0.0 ) {
			distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
		}
		return distanceFalloff;
	#endif
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,KM=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,QM=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,JM=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,$M=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,ty=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,ey=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,ny=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,iy=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,ay=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,ry=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,sy=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,oy=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,ly=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,cy=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,uy=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,fy=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,dy=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,hy=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,py=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,my=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,gy=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,_y=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		objectNormal += morphNormal0 * morphTargetInfluences[ 0 ];
		objectNormal += morphNormal1 * morphTargetInfluences[ 1 ];
		objectNormal += morphNormal2 * morphTargetInfluences[ 2 ];
		objectNormal += morphNormal3 * morphTargetInfluences[ 3 ];
	#endif
#endif`,vy=`#ifdef USE_MORPHTARGETS
	uniform float morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
		uniform sampler2DArray morphTargetsTexture;
		uniform ivec2 morphTargetsTextureSize;
		vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
			int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
			int y = texelIndex / morphTargetsTextureSize.x;
			int x = texelIndex - y * morphTargetsTextureSize.x;
			ivec3 morphUV = ivec3( x, y, morphTargetIndex );
			return texelFetch( morphTargetsTexture, morphUV, 0 );
		}
	#else
		#ifndef USE_MORPHNORMALS
			uniform float morphTargetInfluences[ 8 ];
		#else
			uniform float morphTargetInfluences[ 4 ];
		#endif
	#endif
#endif`,Sy=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		transformed += morphTarget0 * morphTargetInfluences[ 0 ];
		transformed += morphTarget1 * morphTargetInfluences[ 1 ];
		transformed += morphTarget2 * morphTargetInfluences[ 2 ];
		transformed += morphTarget3 * morphTargetInfluences[ 3 ];
		#ifndef USE_MORPHNORMALS
			transformed += morphTarget4 * morphTargetInfluences[ 4 ];
			transformed += morphTarget5 * morphTargetInfluences[ 5 ];
			transformed += morphTarget6 * morphTargetInfluences[ 6 ];
			transformed += morphTarget7 * morphTargetInfluences[ 7 ];
		#endif
	#endif
#endif`,xy=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,My=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,yy=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Ey=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Ty=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,by=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Ay=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Ry=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,wy=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Cy=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Dy=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Ly=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
vec2 packDepthToRG( in highp float v ) {
	return packDepthToRGBA( v ).yx;
}
float unpackRGToDepth( const in highp vec2 v ) {
	return unpackRGBAToDepth( vec4( v.xy, 0.0, 0.0 ) );
}
vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Uy=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Ny=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Oy=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Py=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,zy=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,By=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Iy=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return shadow;
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
		vec3 lightToPosition = shadowCoord.xyz;
		float dp = ( length( lightToPosition ) - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );		dp += shadowBias;
		vec3 bd3D = normalize( lightToPosition );
		#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
			vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
			return (
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
			) * ( 1.0 / 9.0 );
		#else
			return texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
		#endif
	}
#endif`,Fy=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Hy=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Gy=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Vy=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,ky=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Xy=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Wy=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,qy=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Yy=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,jy=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Zy=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color *= toneMappingExposure;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	return color;
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Ky=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Qy=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
		vec3 refractedRayExit = position + transmissionRay;
		vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
		vec2 refractionCoords = ndcPos.xy / ndcPos.w;
		refractionCoords += 1.0;
		refractionCoords /= 2.0;
		vec4 transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
		vec3 transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Jy=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,$y=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,tE=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,eE=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const nE=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,iE=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,aE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,rE=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,sE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,oE=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,lE=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,cE=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#endif
}`,uE=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,fE=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,dE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,hE=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,pE=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,mE=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,gE=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,_E=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,vE=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,SE=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,xE=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,ME=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,yE=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,EE=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), opacity );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,TE=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,bE=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,AE=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,RE=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,wE=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,CE=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,DE=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,LE=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,UE=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,NE=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,OE=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,PE=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,_e={alphahash_fragment:iM,alphahash_pars_fragment:aM,alphamap_fragment:rM,alphamap_pars_fragment:sM,alphatest_fragment:oM,alphatest_pars_fragment:lM,aomap_fragment:cM,aomap_pars_fragment:uM,batching_pars_vertex:fM,batching_vertex:dM,begin_vertex:hM,beginnormal_vertex:pM,bsdfs:mM,iridescence_fragment:gM,bumpmap_pars_fragment:_M,clipping_planes_fragment:vM,clipping_planes_pars_fragment:SM,clipping_planes_pars_vertex:xM,clipping_planes_vertex:MM,color_fragment:yM,color_pars_fragment:EM,color_pars_vertex:TM,color_vertex:bM,common:AM,cube_uv_reflection_fragment:RM,defaultnormal_vertex:wM,displacementmap_pars_vertex:CM,displacementmap_vertex:DM,emissivemap_fragment:LM,emissivemap_pars_fragment:UM,colorspace_fragment:NM,colorspace_pars_fragment:OM,envmap_fragment:PM,envmap_common_pars_fragment:zM,envmap_pars_fragment:BM,envmap_pars_vertex:IM,envmap_physical_pars_fragment:KM,envmap_vertex:FM,fog_vertex:HM,fog_pars_vertex:GM,fog_fragment:VM,fog_pars_fragment:kM,gradientmap_pars_fragment:XM,lightmap_fragment:WM,lightmap_pars_fragment:qM,lights_lambert_fragment:YM,lights_lambert_pars_fragment:jM,lights_pars_begin:ZM,lights_toon_fragment:QM,lights_toon_pars_fragment:JM,lights_phong_fragment:$M,lights_phong_pars_fragment:ty,lights_physical_fragment:ey,lights_physical_pars_fragment:ny,lights_fragment_begin:iy,lights_fragment_maps:ay,lights_fragment_end:ry,logdepthbuf_fragment:sy,logdepthbuf_pars_fragment:oy,logdepthbuf_pars_vertex:ly,logdepthbuf_vertex:cy,map_fragment:uy,map_pars_fragment:fy,map_particle_fragment:dy,map_particle_pars_fragment:hy,metalnessmap_fragment:py,metalnessmap_pars_fragment:my,morphcolor_vertex:gy,morphnormal_vertex:_y,morphtarget_pars_vertex:vy,morphtarget_vertex:Sy,normal_fragment_begin:xy,normal_fragment_maps:My,normal_pars_fragment:yy,normal_pars_vertex:Ey,normal_vertex:Ty,normalmap_pars_fragment:by,clearcoat_normal_fragment_begin:Ay,clearcoat_normal_fragment_maps:Ry,clearcoat_pars_fragment:wy,iridescence_pars_fragment:Cy,opaque_fragment:Dy,packing:Ly,premultiplied_alpha_fragment:Uy,project_vertex:Ny,dithering_fragment:Oy,dithering_pars_fragment:Py,roughnessmap_fragment:zy,roughnessmap_pars_fragment:By,shadowmap_pars_fragment:Iy,shadowmap_pars_vertex:Fy,shadowmap_vertex:Hy,shadowmask_pars_fragment:Gy,skinbase_vertex:Vy,skinning_pars_vertex:ky,skinning_vertex:Xy,skinnormal_vertex:Wy,specularmap_fragment:qy,specularmap_pars_fragment:Yy,tonemapping_fragment:jy,tonemapping_pars_fragment:Zy,transmission_fragment:Ky,transmission_pars_fragment:Qy,uv_pars_fragment:Jy,uv_pars_vertex:$y,uv_vertex:tE,worldpos_vertex:eE,background_vert:nE,background_frag:iE,backgroundCube_vert:aE,backgroundCube_frag:rE,cube_vert:sE,cube_frag:oE,depth_vert:lE,depth_frag:cE,distanceRGBA_vert:uE,distanceRGBA_frag:fE,equirect_vert:dE,equirect_frag:hE,linedashed_vert:pE,linedashed_frag:mE,meshbasic_vert:gE,meshbasic_frag:_E,meshlambert_vert:vE,meshlambert_frag:SE,meshmatcap_vert:xE,meshmatcap_frag:ME,meshnormal_vert:yE,meshnormal_frag:EE,meshphong_vert:TE,meshphong_frag:bE,meshphysical_vert:AE,meshphysical_frag:RE,meshtoon_vert:wE,meshtoon_frag:CE,points_vert:DE,points_frag:LE,shadow_vert:UE,shadow_frag:NE,sprite_vert:OE,sprite_frag:PE},wt={common:{diffuse:{value:new Qt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Me},alphaMap:{value:null},alphaMapTransform:{value:new Me},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Me}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Me}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Me}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Me},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Me},normalScale:{value:new He(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Me},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Me}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Me}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Me}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Qt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Qt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Me},alphaTest:{value:0},uvTransform:{value:new Me}},sprite:{diffuse:{value:new Qt(16777215)},opacity:{value:1},center:{value:new He(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Me},alphaMap:{value:null},alphaMapTransform:{value:new Me},alphaTest:{value:0}}},Di={basic:{uniforms:Pn([wt.common,wt.specularmap,wt.envmap,wt.aomap,wt.lightmap,wt.fog]),vertexShader:_e.meshbasic_vert,fragmentShader:_e.meshbasic_frag},lambert:{uniforms:Pn([wt.common,wt.specularmap,wt.envmap,wt.aomap,wt.lightmap,wt.emissivemap,wt.bumpmap,wt.normalmap,wt.displacementmap,wt.fog,wt.lights,{emissive:{value:new Qt(0)}}]),vertexShader:_e.meshlambert_vert,fragmentShader:_e.meshlambert_frag},phong:{uniforms:Pn([wt.common,wt.specularmap,wt.envmap,wt.aomap,wt.lightmap,wt.emissivemap,wt.bumpmap,wt.normalmap,wt.displacementmap,wt.fog,wt.lights,{emissive:{value:new Qt(0)},specular:{value:new Qt(1118481)},shininess:{value:30}}]),vertexShader:_e.meshphong_vert,fragmentShader:_e.meshphong_frag},standard:{uniforms:Pn([wt.common,wt.envmap,wt.aomap,wt.lightmap,wt.emissivemap,wt.bumpmap,wt.normalmap,wt.displacementmap,wt.roughnessmap,wt.metalnessmap,wt.fog,wt.lights,{emissive:{value:new Qt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:_e.meshphysical_vert,fragmentShader:_e.meshphysical_frag},toon:{uniforms:Pn([wt.common,wt.aomap,wt.lightmap,wt.emissivemap,wt.bumpmap,wt.normalmap,wt.displacementmap,wt.gradientmap,wt.fog,wt.lights,{emissive:{value:new Qt(0)}}]),vertexShader:_e.meshtoon_vert,fragmentShader:_e.meshtoon_frag},matcap:{uniforms:Pn([wt.common,wt.bumpmap,wt.normalmap,wt.displacementmap,wt.fog,{matcap:{value:null}}]),vertexShader:_e.meshmatcap_vert,fragmentShader:_e.meshmatcap_frag},points:{uniforms:Pn([wt.points,wt.fog]),vertexShader:_e.points_vert,fragmentShader:_e.points_frag},dashed:{uniforms:Pn([wt.common,wt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:_e.linedashed_vert,fragmentShader:_e.linedashed_frag},depth:{uniforms:Pn([wt.common,wt.displacementmap]),vertexShader:_e.depth_vert,fragmentShader:_e.depth_frag},normal:{uniforms:Pn([wt.common,wt.bumpmap,wt.normalmap,wt.displacementmap,{opacity:{value:1}}]),vertexShader:_e.meshnormal_vert,fragmentShader:_e.meshnormal_frag},sprite:{uniforms:Pn([wt.sprite,wt.fog]),vertexShader:_e.sprite_vert,fragmentShader:_e.sprite_frag},background:{uniforms:{uvTransform:{value:new Me},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:_e.background_vert,fragmentShader:_e.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:_e.backgroundCube_vert,fragmentShader:_e.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:_e.cube_vert,fragmentShader:_e.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:_e.equirect_vert,fragmentShader:_e.equirect_frag},distanceRGBA:{uniforms:Pn([wt.common,wt.displacementmap,{referencePosition:{value:new st},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:_e.distanceRGBA_vert,fragmentShader:_e.distanceRGBA_frag},shadow:{uniforms:Pn([wt.lights,wt.fog,{color:{value:new Qt(0)},opacity:{value:1}}]),vertexShader:_e.shadow_vert,fragmentShader:_e.shadow_frag}};Di.physical={uniforms:Pn([Di.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Me},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Me},clearcoatNormalScale:{value:new He(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Me},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Me},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Me},sheen:{value:0},sheenColor:{value:new Qt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Me},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Me},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Me},transmissionSamplerSize:{value:new He},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Me},attenuationDistance:{value:0},attenuationColor:{value:new Qt(0)},specularColor:{value:new Qt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Me},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Me},anisotropyVector:{value:new He},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Me}}]),vertexShader:_e.meshphysical_vert,fragmentShader:_e.meshphysical_frag};const sc={r:0,b:0,g:0};function zE(o,e,i,r,l,u,h){const d=new Qt(0);let m=u===!0?0:1,p,g,v=null,S=0,y=null;function b(x,_){let N=!1,D=_.isScene===!0?_.background:null;D&&D.isTexture&&(D=(_.backgroundBlurriness>0?i:e).get(D)),D===null?A(d,m):D&&D.isColor&&(A(D,1),N=!0);const P=o.xr.getEnvironmentBlendMode();P==="additive"?r.buffers.color.setClear(0,0,0,1,h):P==="alpha-blend"&&r.buffers.color.setClear(0,0,0,0,h),(o.autoClear||N)&&o.clear(o.autoClearColor,o.autoClearDepth,o.autoClearStencil),D&&(D.isCubeTexture||D.mapping===Sc)?(g===void 0&&(g=new La(new Uo(1,1,1),new za({name:"BackgroundCubeMaterial",uniforms:_s(Di.backgroundCube.uniforms),vertexShader:Di.backgroundCube.vertexShader,fragmentShader:Di.backgroundCube.fragmentShader,side:Xn,depthTest:!1,depthWrite:!1,fog:!1})),g.geometry.deleteAttribute("normal"),g.geometry.deleteAttribute("uv"),g.onBeforeRender=function(G,F,I){this.matrixWorld.copyPosition(I.matrixWorld)},Object.defineProperty(g.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),l.update(g)),g.material.uniforms.envMap.value=D,g.material.uniforms.flipEnvMap.value=D.isCubeTexture&&D.isRenderTargetTexture===!1?-1:1,g.material.uniforms.backgroundBlurriness.value=_.backgroundBlurriness,g.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,g.material.toneMapped=Fe.getTransfer(D.colorSpace)!==Ze,(v!==D||S!==D.version||y!==o.toneMapping)&&(g.material.needsUpdate=!0,v=D,S=D.version,y=o.toneMapping),g.layers.enableAll(),x.unshift(g,g.geometry,g.material,0,0,null)):D&&D.isTexture&&(p===void 0&&(p=new La(new Ad(2,2),new za({name:"BackgroundMaterial",uniforms:_s(Di.background.uniforms),vertexShader:Di.background.vertexShader,fragmentShader:Di.background.fragmentShader,side:Pa,depthTest:!1,depthWrite:!1,fog:!1})),p.geometry.deleteAttribute("normal"),Object.defineProperty(p.material,"map",{get:function(){return this.uniforms.t2D.value}}),l.update(p)),p.material.uniforms.t2D.value=D,p.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,p.material.toneMapped=Fe.getTransfer(D.colorSpace)!==Ze,D.matrixAutoUpdate===!0&&D.updateMatrix(),p.material.uniforms.uvTransform.value.copy(D.matrix),(v!==D||S!==D.version||y!==o.toneMapping)&&(p.material.needsUpdate=!0,v=D,S=D.version,y=o.toneMapping),p.layers.enableAll(),x.unshift(p,p.geometry,p.material,0,0,null))}function A(x,_){x.getRGB(sc,rv(o)),r.buffers.color.setClear(sc.r,sc.g,sc.b,_,h)}return{getClearColor:function(){return d},setClearColor:function(x,_=1){d.set(x),m=_,A(d,m)},getClearAlpha:function(){return m},setClearAlpha:function(x){m=x,A(d,m)},render:b}}function BE(o,e,i,r){const l=o.getParameter(o.MAX_VERTEX_ATTRIBS),u=r.isWebGL2?null:e.get("OES_vertex_array_object"),h=r.isWebGL2||u!==null,d={},m=x(null);let p=m,g=!1;function v(X,$,O,q,j){let ct=!1;if(h){const R=A(q,O,$);p!==R&&(p=R,y(p.object)),ct=_(X,q,O,j),ct&&N(X,q,O,j)}else{const R=$.wireframe===!0;(p.geometry!==q.id||p.program!==O.id||p.wireframe!==R)&&(p.geometry=q.id,p.program=O.id,p.wireframe=R,ct=!0)}j!==null&&i.update(j,o.ELEMENT_ARRAY_BUFFER),(ct||g)&&(g=!1,mt(X,$,O,q),j!==null&&o.bindBuffer(o.ELEMENT_ARRAY_BUFFER,i.get(j).buffer))}function S(){return r.isWebGL2?o.createVertexArray():u.createVertexArrayOES()}function y(X){return r.isWebGL2?o.bindVertexArray(X):u.bindVertexArrayOES(X)}function b(X){return r.isWebGL2?o.deleteVertexArray(X):u.deleteVertexArrayOES(X)}function A(X,$,O){const q=O.wireframe===!0;let j=d[X.id];j===void 0&&(j={},d[X.id]=j);let ct=j[$.id];ct===void 0&&(ct={},j[$.id]=ct);let R=ct[q];return R===void 0&&(R=x(S()),ct[q]=R),R}function x(X){const $=[],O=[],q=[];for(let j=0;j<l;j++)$[j]=0,O[j]=0,q[j]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:$,enabledAttributes:O,attributeDivisors:q,object:X,attributes:{},index:null}}function _(X,$,O,q){const j=p.attributes,ct=$.attributes;let R=0;const k=O.getAttributes();for(const Q in k)if(k[Q].location>=0){const J=j[Q];let _t=ct[Q];if(_t===void 0&&(Q==="instanceMatrix"&&X.instanceMatrix&&(_t=X.instanceMatrix),Q==="instanceColor"&&X.instanceColor&&(_t=X.instanceColor)),J===void 0||J.attribute!==_t||_t&&J.data!==_t.data)return!0;R++}return p.attributesNum!==R||p.index!==q}function N(X,$,O,q){const j={},ct=$.attributes;let R=0;const k=O.getAttributes();for(const Q in k)if(k[Q].location>=0){let J=ct[Q];J===void 0&&(Q==="instanceMatrix"&&X.instanceMatrix&&(J=X.instanceMatrix),Q==="instanceColor"&&X.instanceColor&&(J=X.instanceColor));const _t={};_t.attribute=J,J&&J.data&&(_t.data=J.data),j[Q]=_t,R++}p.attributes=j,p.attributesNum=R,p.index=q}function D(){const X=p.newAttributes;for(let $=0,O=X.length;$<O;$++)X[$]=0}function P(X){G(X,0)}function G(X,$){const O=p.newAttributes,q=p.enabledAttributes,j=p.attributeDivisors;O[X]=1,q[X]===0&&(o.enableVertexAttribArray(X),q[X]=1),j[X]!==$&&((r.isWebGL2?o:e.get("ANGLE_instanced_arrays"))[r.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](X,$),j[X]=$)}function F(){const X=p.newAttributes,$=p.enabledAttributes;for(let O=0,q=$.length;O<q;O++)$[O]!==X[O]&&(o.disableVertexAttribArray(O),$[O]=0)}function I(X,$,O,q,j,ct,R){R===!0?o.vertexAttribIPointer(X,$,O,j,ct):o.vertexAttribPointer(X,$,O,q,j,ct)}function mt(X,$,O,q){if(r.isWebGL2===!1&&(X.isInstancedMesh||q.isInstancedBufferGeometry)&&e.get("ANGLE_instanced_arrays")===null)return;D();const j=q.attributes,ct=O.getAttributes(),R=$.defaultAttributeValues;for(const k in ct){const Q=ct[k];if(Q.location>=0){let B=j[k];if(B===void 0&&(k==="instanceMatrix"&&X.instanceMatrix&&(B=X.instanceMatrix),k==="instanceColor"&&X.instanceColor&&(B=X.instanceColor)),B!==void 0){const J=B.normalized,_t=B.itemSize,pt=i.get(B);if(pt===void 0)continue;const Lt=pt.buffer,Pt=pt.type,jt=pt.bytesPerElement,Kt=r.isWebGL2===!0&&(Pt===o.INT||Pt===o.UNSIGNED_INT||B.gpuType===H_);if(B.isInterleavedBufferAttribute){const oe=B.data,tt=oe.stride,qe=B.offset;if(oe.isInstancedInterleavedBuffer){for(let Xt=0;Xt<Q.locationSize;Xt++)G(Q.location+Xt,oe.meshPerAttribute);X.isInstancedMesh!==!0&&q._maxInstanceCount===void 0&&(q._maxInstanceCount=oe.meshPerAttribute*oe.count)}else for(let Xt=0;Xt<Q.locationSize;Xt++)P(Q.location+Xt);o.bindBuffer(o.ARRAY_BUFFER,Lt);for(let Xt=0;Xt<Q.locationSize;Xt++)I(Q.location+Xt,_t/Q.locationSize,Pt,J,tt*jt,(qe+_t/Q.locationSize*Xt)*jt,Kt)}else{if(B.isInstancedBufferAttribute){for(let oe=0;oe<Q.locationSize;oe++)G(Q.location+oe,B.meshPerAttribute);X.isInstancedMesh!==!0&&q._maxInstanceCount===void 0&&(q._maxInstanceCount=B.meshPerAttribute*B.count)}else for(let oe=0;oe<Q.locationSize;oe++)P(Q.location+oe);o.bindBuffer(o.ARRAY_BUFFER,Lt);for(let oe=0;oe<Q.locationSize;oe++)I(Q.location+oe,_t/Q.locationSize,Pt,J,_t*jt,_t/Q.locationSize*oe*jt,Kt)}}else if(R!==void 0){const J=R[k];if(J!==void 0)switch(J.length){case 2:o.vertexAttrib2fv(Q.location,J);break;case 3:o.vertexAttrib3fv(Q.location,J);break;case 4:o.vertexAttrib4fv(Q.location,J);break;default:o.vertexAttrib1fv(Q.location,J)}}}}F()}function C(){lt();for(const X in d){const $=d[X];for(const O in $){const q=$[O];for(const j in q)b(q[j].object),delete q[j];delete $[O]}delete d[X]}}function U(X){if(d[X.id]===void 0)return;const $=d[X.id];for(const O in $){const q=$[O];for(const j in q)b(q[j].object),delete q[j];delete $[O]}delete d[X.id]}function ut(X){for(const $ in d){const O=d[$];if(O[X.id]===void 0)continue;const q=O[X.id];for(const j in q)b(q[j].object),delete q[j];delete O[X.id]}}function lt(){yt(),g=!0,p!==m&&(p=m,y(p.object))}function yt(){m.geometry=null,m.program=null,m.wireframe=!1}return{setup:v,reset:lt,resetDefaultState:yt,dispose:C,releaseStatesOfGeometry:U,releaseStatesOfProgram:ut,initAttributes:D,enableAttribute:P,disableUnusedAttributes:F}}function IE(o,e,i,r){const l=r.isWebGL2;let u;function h(g){u=g}function d(g,v){o.drawArrays(u,g,v),i.update(v,u,1)}function m(g,v,S){if(S===0)return;let y,b;if(l)y=o,b="drawArraysInstanced";else if(y=e.get("ANGLE_instanced_arrays"),b="drawArraysInstancedANGLE",y===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}y[b](u,g,v,S),i.update(v,u,S)}function p(g,v,S){if(S===0)return;const y=e.get("WEBGL_multi_draw");if(y===null)for(let b=0;b<S;b++)this.render(g[b],v[b]);else{y.multiDrawArraysWEBGL(u,g,0,v,0,S);let b=0;for(let A=0;A<S;A++)b+=v[A];i.update(b,u,1)}}this.setMode=h,this.render=d,this.renderInstances=m,this.renderMultiDraw=p}function FE(o,e,i){let r;function l(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const I=e.get("EXT_texture_filter_anisotropic");r=o.getParameter(I.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function u(I){if(I==="highp"){if(o.getShaderPrecisionFormat(o.VERTEX_SHADER,o.HIGH_FLOAT).precision>0&&o.getShaderPrecisionFormat(o.FRAGMENT_SHADER,o.HIGH_FLOAT).precision>0)return"highp";I="mediump"}return I==="mediump"&&o.getShaderPrecisionFormat(o.VERTEX_SHADER,o.MEDIUM_FLOAT).precision>0&&o.getShaderPrecisionFormat(o.FRAGMENT_SHADER,o.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const h=typeof WebGL2RenderingContext<"u"&&o.constructor.name==="WebGL2RenderingContext";let d=i.precision!==void 0?i.precision:"highp";const m=u(d);m!==d&&(console.warn("THREE.WebGLRenderer:",d,"not supported, using",m,"instead."),d=m);const p=h||e.has("WEBGL_draw_buffers"),g=i.logarithmicDepthBuffer===!0,v=o.getParameter(o.MAX_TEXTURE_IMAGE_UNITS),S=o.getParameter(o.MAX_VERTEX_TEXTURE_IMAGE_UNITS),y=o.getParameter(o.MAX_TEXTURE_SIZE),b=o.getParameter(o.MAX_CUBE_MAP_TEXTURE_SIZE),A=o.getParameter(o.MAX_VERTEX_ATTRIBS),x=o.getParameter(o.MAX_VERTEX_UNIFORM_VECTORS),_=o.getParameter(o.MAX_VARYING_VECTORS),N=o.getParameter(o.MAX_FRAGMENT_UNIFORM_VECTORS),D=S>0,P=h||e.has("OES_texture_float"),G=D&&P,F=h?o.getParameter(o.MAX_SAMPLES):0;return{isWebGL2:h,drawBuffers:p,getMaxAnisotropy:l,getMaxPrecision:u,precision:d,logarithmicDepthBuffer:g,maxTextures:v,maxVertexTextures:S,maxTextureSize:y,maxCubemapSize:b,maxAttributes:A,maxVertexUniforms:x,maxVaryings:_,maxFragmentUniforms:N,vertexTextures:D,floatFragmentTextures:P,floatVertexTextures:G,maxSamples:F}}function HE(o){const e=this;let i=null,r=0,l=!1,u=!1;const h=new rr,d=new Me,m={value:null,needsUpdate:!1};this.uniform=m,this.numPlanes=0,this.numIntersection=0,this.init=function(v,S){const y=v.length!==0||S||r!==0||l;return l=S,r=v.length,y},this.beginShadows=function(){u=!0,g(null)},this.endShadows=function(){u=!1},this.setGlobalState=function(v,S){i=g(v,S,0)},this.setState=function(v,S,y){const b=v.clippingPlanes,A=v.clipIntersection,x=v.clipShadows,_=o.get(v);if(!l||b===null||b.length===0||u&&!x)u?g(null):p();else{const N=u?0:r,D=N*4;let P=_.clippingState||null;m.value=P,P=g(b,S,D,y);for(let G=0;G!==D;++G)P[G]=i[G];_.clippingState=P,this.numIntersection=A?this.numPlanes:0,this.numPlanes+=N}};function p(){m.value!==i&&(m.value=i,m.needsUpdate=r>0),e.numPlanes=r,e.numIntersection=0}function g(v,S,y,b){const A=v!==null?v.length:0;let x=null;if(A!==0){if(x=m.value,b!==!0||x===null){const _=y+A*4,N=S.matrixWorldInverse;d.getNormalMatrix(N),(x===null||x.length<_)&&(x=new Float32Array(_));for(let D=0,P=y;D!==A;++D,P+=4)h.copy(v[D]).applyMatrix4(N,d),h.normal.toArray(x,P),x[P+3]=h.constant}m.value=x,m.needsUpdate=!0}return e.numPlanes=A,e.numIntersection=0,x}}function GE(o){let e=new WeakMap;function i(h,d){return d===hd?h.mapping=ps:d===pd&&(h.mapping=ms),h}function r(h){if(h&&h.isTexture){const d=h.mapping;if(d===hd||d===pd)if(e.has(h)){const m=e.get(h).texture;return i(m,h.mapping)}else{const m=h.image;if(m&&m.height>0){const p=new $x(m.height/2);return p.fromEquirectangularTexture(o,h),e.set(h,p),h.addEventListener("dispose",l),i(p.texture,h.mapping)}else return null}}return h}function l(h){const d=h.target;d.removeEventListener("dispose",l);const m=e.get(d);m!==void 0&&(e.delete(d),m.dispose())}function u(){e=new WeakMap}return{get:r,dispose:u}}class VE extends sv{constructor(e=-1,i=1,r=1,l=-1,u=.1,h=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=i,this.top=r,this.bottom=l,this.near=u,this.far=h,this.updateProjectionMatrix()}copy(e,i){return super.copy(e,i),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,i,r,l,u,h){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=i,this.view.offsetX=r,this.view.offsetY=l,this.view.width=u,this.view.height=h,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),i=(this.top-this.bottom)/(2*this.zoom),r=(this.right+this.left)/2,l=(this.top+this.bottom)/2;let u=r-e,h=r+e,d=l+i,m=l-i;if(this.view!==null&&this.view.enabled){const p=(this.right-this.left)/this.view.fullWidth/this.zoom,g=(this.top-this.bottom)/this.view.fullHeight/this.zoom;u+=p*this.view.offsetX,h=u+p*this.view.width,d-=g*this.view.offsetY,m=d-g*this.view.height}this.projectionMatrix.makeOrthographic(u,h,d,m,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const i=super.toJSON(e);return i.object.zoom=this.zoom,i.object.left=this.left,i.object.right=this.right,i.object.top=this.top,i.object.bottom=this.bottom,i.object.near=this.near,i.object.far=this.far,this.view!==null&&(i.object.view=Object.assign({},this.view)),i}}const us=4,c_=[.125,.215,.35,.446,.526,.582],lr=20,id=new VE,u_=new Qt;let ad=null,rd=0,sd=0;const sr=(1+Math.sqrt(5))/2,cs=1/sr,f_=[new st(1,1,1),new st(-1,1,1),new st(1,1,-1),new st(-1,1,-1),new st(0,sr,cs),new st(0,sr,-cs),new st(cs,0,sr),new st(-cs,0,sr),new st(sr,cs,0),new st(-sr,cs,0)];class d_{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,i=0,r=.1,l=100){ad=this._renderer.getRenderTarget(),rd=this._renderer.getActiveCubeFace(),sd=this._renderer.getActiveMipmapLevel(),this._setSize(256);const u=this._allocateTargets();return u.depthBuffer=!0,this._sceneToCubeUV(e,r,l,u),i>0&&this._blur(u,0,0,i),this._applyPMREM(u),this._cleanup(u),u}fromEquirectangular(e,i=null){return this._fromTexture(e,i)}fromCubemap(e,i=null){return this._fromTexture(e,i)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=m_(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=p_(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(ad,rd,sd),e.scissorTest=!1,oc(e,0,0,e.width,e.height)}_fromTexture(e,i){e.mapping===ps||e.mapping===ms?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),ad=this._renderer.getRenderTarget(),rd=this._renderer.getActiveCubeFace(),sd=this._renderer.getActiveMipmapLevel();const r=i||this._allocateTargets();return this._textureToCubeUV(e,r),this._applyPMREM(r),this._cleanup(r),r}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),i=4*this._cubeSize,r={magFilter:di,minFilter:di,generateMipmaps:!1,type:Ro,format:Ti,colorSpace:$i,depthBuffer:!1},l=h_(e,i,r);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==i){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=h_(e,i,r);const{_lodMax:u}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=kE(u)),this._blurMaterial=XE(u,e,i)}return l}_compileMaterial(e){const i=new La(this._lodPlanes[0],e);this._renderer.compile(i,id)}_sceneToCubeUV(e,i,r,l){const d=new hi(90,1,i,r),m=[1,-1,1,1,1,1],p=[1,1,1,-1,-1,-1],g=this._renderer,v=g.autoClear,S=g.toneMapping;g.getClearColor(u_),g.toneMapping=Na,g.autoClear=!1;const y=new nv({name:"PMREM.Background",side:Xn,depthWrite:!1,depthTest:!1}),b=new La(new Uo,y);let A=!1;const x=e.background;x?x.isColor&&(y.color.copy(x),e.background=null,A=!0):(y.color.copy(u_),A=!0);for(let _=0;_<6;_++){const N=_%3;N===0?(d.up.set(0,m[_],0),d.lookAt(p[_],0,0)):N===1?(d.up.set(0,0,m[_]),d.lookAt(0,p[_],0)):(d.up.set(0,m[_],0),d.lookAt(0,0,p[_]));const D=this._cubeSize;oc(l,N*D,_>2?D:0,D,D),g.setRenderTarget(l),A&&g.render(b,d),g.render(e,d)}b.geometry.dispose(),b.material.dispose(),g.toneMapping=S,g.autoClear=v,e.background=x}_textureToCubeUV(e,i){const r=this._renderer,l=e.mapping===ps||e.mapping===ms;l?(this._cubemapMaterial===null&&(this._cubemapMaterial=m_()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=p_());const u=l?this._cubemapMaterial:this._equirectMaterial,h=new La(this._lodPlanes[0],u),d=u.uniforms;d.envMap.value=e;const m=this._cubeSize;oc(i,0,0,3*m,2*m),r.setRenderTarget(i),r.render(h,id)}_applyPMREM(e){const i=this._renderer,r=i.autoClear;i.autoClear=!1;for(let l=1;l<this._lodPlanes.length;l++){const u=Math.sqrt(this._sigmas[l]*this._sigmas[l]-this._sigmas[l-1]*this._sigmas[l-1]),h=f_[(l-1)%f_.length];this._blur(e,l-1,l,u,h)}i.autoClear=r}_blur(e,i,r,l,u){const h=this._pingPongRenderTarget;this._halfBlur(e,h,i,r,l,"latitudinal",u),this._halfBlur(h,e,r,r,l,"longitudinal",u)}_halfBlur(e,i,r,l,u,h,d){const m=this._renderer,p=this._blurMaterial;h!=="latitudinal"&&h!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const g=3,v=new La(this._lodPlanes[l],p),S=p.uniforms,y=this._sizeLods[r]-1,b=isFinite(u)?Math.PI/(2*y):2*Math.PI/(2*lr-1),A=u/b,x=isFinite(u)?1+Math.floor(g*A):lr;x>lr&&console.warn(`sigmaRadians, ${u}, is too large and will clip, as it requested ${x} samples when the maximum is set to ${lr}`);const _=[];let N=0;for(let I=0;I<lr;++I){const mt=I/A,C=Math.exp(-mt*mt/2);_.push(C),I===0?N+=C:I<x&&(N+=2*C)}for(let I=0;I<_.length;I++)_[I]=_[I]/N;S.envMap.value=e.texture,S.samples.value=x,S.weights.value=_,S.latitudinal.value=h==="latitudinal",d&&(S.poleAxis.value=d);const{_lodMax:D}=this;S.dTheta.value=b,S.mipInt.value=D-r;const P=this._sizeLods[l],G=3*P*(l>D-us?l-D+us:0),F=4*(this._cubeSize-P);oc(i,G,F,3*P,2*P),m.setRenderTarget(i),m.render(v,id)}}function kE(o){const e=[],i=[],r=[];let l=o;const u=o-us+1+c_.length;for(let h=0;h<u;h++){const d=Math.pow(2,l);i.push(d);let m=1/d;h>o-us?m=c_[h-o+us-1]:h===0&&(m=0),r.push(m);const p=1/(d-2),g=-p,v=1+p,S=[g,g,v,g,v,v,g,g,v,v,g,v],y=6,b=6,A=3,x=2,_=1,N=new Float32Array(A*b*y),D=new Float32Array(x*b*y),P=new Float32Array(_*b*y);for(let F=0;F<y;F++){const I=F%3*2/3-1,mt=F>2?0:-1,C=[I,mt,0,I+2/3,mt,0,I+2/3,mt+1,0,I,mt,0,I+2/3,mt+1,0,I,mt+1,0];N.set(C,A*b*F),D.set(S,x*b*F);const U=[F,F,F,F,F,F];P.set(U,_*b*F)}const G=new ta;G.setAttribute("position",new mi(N,A)),G.setAttribute("uv",new mi(D,x)),G.setAttribute("faceIndex",new mi(P,_)),e.push(G),l>us&&l--}return{lodPlanes:e,sizeLods:i,sigmas:r}}function h_(o,e,i){const r=new hr(o,e,i);return r.texture.mapping=Sc,r.texture.name="PMREM.cubeUv",r.scissorTest=!0,r}function oc(o,e,i,r,l){o.viewport.set(e,i,r,l),o.scissor.set(e,i,r,l)}function XE(o,e,i){const r=new Float32Array(lr),l=new st(0,1,0);return new za({name:"SphericalGaussianBlur",defines:{n:lr,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/i,CUBEUV_MAX_MIP:`${o}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:r},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:l}},vertexShader:Rd(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Ua,depthTest:!1,depthWrite:!1})}function p_(){return new za({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Rd(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Ua,depthTest:!1,depthWrite:!1})}function m_(){return new za({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Rd(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Ua,depthTest:!1,depthWrite:!1})}function Rd(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function WE(o){let e=new WeakMap,i=null;function r(d){if(d&&d.isTexture){const m=d.mapping,p=m===hd||m===pd,g=m===ps||m===ms;if(p||g)if(d.isRenderTargetTexture&&d.needsPMREMUpdate===!0){d.needsPMREMUpdate=!1;let v=e.get(d);return i===null&&(i=new d_(o)),v=p?i.fromEquirectangular(d,v):i.fromCubemap(d,v),e.set(d,v),v.texture}else{if(e.has(d))return e.get(d).texture;{const v=d.image;if(p&&v&&v.height>0||g&&v&&l(v)){i===null&&(i=new d_(o));const S=p?i.fromEquirectangular(d):i.fromCubemap(d);return e.set(d,S),d.addEventListener("dispose",u),S.texture}else return null}}}return d}function l(d){let m=0;const p=6;for(let g=0;g<p;g++)d[g]!==void 0&&m++;return m===p}function u(d){const m=d.target;m.removeEventListener("dispose",u);const p=e.get(m);p!==void 0&&(e.delete(m),p.dispose())}function h(){e=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:r,dispose:h}}function qE(o){const e={};function i(r){if(e[r]!==void 0)return e[r];let l;switch(r){case"WEBGL_depth_texture":l=o.getExtension("WEBGL_depth_texture")||o.getExtension("MOZ_WEBGL_depth_texture")||o.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":l=o.getExtension("EXT_texture_filter_anisotropic")||o.getExtension("MOZ_EXT_texture_filter_anisotropic")||o.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":l=o.getExtension("WEBGL_compressed_texture_s3tc")||o.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||o.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":l=o.getExtension("WEBGL_compressed_texture_pvrtc")||o.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:l=o.getExtension(r)}return e[r]=l,l}return{has:function(r){return i(r)!==null},init:function(r){r.isWebGL2?(i("EXT_color_buffer_float"),i("WEBGL_clip_cull_distance")):(i("WEBGL_depth_texture"),i("OES_texture_float"),i("OES_texture_half_float"),i("OES_texture_half_float_linear"),i("OES_standard_derivatives"),i("OES_element_index_uint"),i("OES_vertex_array_object"),i("ANGLE_instanced_arrays")),i("OES_texture_float_linear"),i("EXT_color_buffer_half_float"),i("WEBGL_multisampled_render_to_texture")},get:function(r){const l=i(r);return l===null&&console.warn("THREE.WebGLRenderer: "+r+" extension not supported."),l}}}function YE(o,e,i,r){const l={},u=new WeakMap;function h(v){const S=v.target;S.index!==null&&e.remove(S.index);for(const b in S.attributes)e.remove(S.attributes[b]);for(const b in S.morphAttributes){const A=S.morphAttributes[b];for(let x=0,_=A.length;x<_;x++)e.remove(A[x])}S.removeEventListener("dispose",h),delete l[S.id];const y=u.get(S);y&&(e.remove(y),u.delete(S)),r.releaseStatesOfGeometry(S),S.isInstancedBufferGeometry===!0&&delete S._maxInstanceCount,i.memory.geometries--}function d(v,S){return l[S.id]===!0||(S.addEventListener("dispose",h),l[S.id]=!0,i.memory.geometries++),S}function m(v){const S=v.attributes;for(const b in S)e.update(S[b],o.ARRAY_BUFFER);const y=v.morphAttributes;for(const b in y){const A=y[b];for(let x=0,_=A.length;x<_;x++)e.update(A[x],o.ARRAY_BUFFER)}}function p(v){const S=[],y=v.index,b=v.attributes.position;let A=0;if(y!==null){const N=y.array;A=y.version;for(let D=0,P=N.length;D<P;D+=3){const G=N[D+0],F=N[D+1],I=N[D+2];S.push(G,F,F,I,I,G)}}else if(b!==void 0){const N=b.array;A=b.version;for(let D=0,P=N.length/3-1;D<P;D+=3){const G=D+0,F=D+1,I=D+2;S.push(G,F,F,I,I,G)}}else return;const x=new(Z_(S)?av:iv)(S,1);x.version=A;const _=u.get(v);_&&e.remove(_),u.set(v,x)}function g(v){const S=u.get(v);if(S){const y=v.index;y!==null&&S.version<y.version&&p(v)}else p(v);return u.get(v)}return{get:d,update:m,getWireframeAttribute:g}}function jE(o,e,i,r){const l=r.isWebGL2;let u;function h(y){u=y}let d,m;function p(y){d=y.type,m=y.bytesPerElement}function g(y,b){o.drawElements(u,b,d,y*m),i.update(b,u,1)}function v(y,b,A){if(A===0)return;let x,_;if(l)x=o,_="drawElementsInstanced";else if(x=e.get("ANGLE_instanced_arrays"),_="drawElementsInstancedANGLE",x===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}x[_](u,b,d,y*m,A),i.update(b,u,A)}function S(y,b,A){if(A===0)return;const x=e.get("WEBGL_multi_draw");if(x===null)for(let _=0;_<A;_++)this.render(y[_]/m,b[_]);else{x.multiDrawElementsWEBGL(u,b,0,d,y,0,A);let _=0;for(let N=0;N<A;N++)_+=b[N];i.update(_,u,1)}}this.setMode=h,this.setIndex=p,this.render=g,this.renderInstances=v,this.renderMultiDraw=S}function ZE(o){const e={geometries:0,textures:0},i={frame:0,calls:0,triangles:0,points:0,lines:0};function r(u,h,d){switch(i.calls++,h){case o.TRIANGLES:i.triangles+=d*(u/3);break;case o.LINES:i.lines+=d*(u/2);break;case o.LINE_STRIP:i.lines+=d*(u-1);break;case o.LINE_LOOP:i.lines+=d*u;break;case o.POINTS:i.points+=d*u;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",h);break}}function l(){i.calls=0,i.triangles=0,i.points=0,i.lines=0}return{memory:e,render:i,programs:null,autoReset:!0,reset:l,update:r}}function KE(o,e){return o[0]-e[0]}function QE(o,e){return Math.abs(e[1])-Math.abs(o[1])}function JE(o,e,i){const r={},l=new Float32Array(8),u=new WeakMap,h=new An,d=[];for(let p=0;p<8;p++)d[p]=[p,0];function m(p,g,v){const S=p.morphTargetInfluences;if(e.isWebGL2===!0){const b=g.morphAttributes.position||g.morphAttributes.normal||g.morphAttributes.color,A=b!==void 0?b.length:0;let x=u.get(g);if(x===void 0||x.count!==A){let $=function(){yt.dispose(),u.delete(g),g.removeEventListener("dispose",$)};var y=$;x!==void 0&&x.texture.dispose();const D=g.morphAttributes.position!==void 0,P=g.morphAttributes.normal!==void 0,G=g.morphAttributes.color!==void 0,F=g.morphAttributes.position||[],I=g.morphAttributes.normal||[],mt=g.morphAttributes.color||[];let C=0;D===!0&&(C=1),P===!0&&(C=2),G===!0&&(C=3);let U=g.attributes.position.count*C,ut=1;U>e.maxTextureSize&&(ut=Math.ceil(U/e.maxTextureSize),U=e.maxTextureSize);const lt=new Float32Array(U*ut*4*A),yt=new J_(lt,U,ut,A);yt.type=Da,yt.needsUpdate=!0;const X=C*4;for(let O=0;O<A;O++){const q=F[O],j=I[O],ct=mt[O],R=U*ut*4*O;for(let k=0;k<q.count;k++){const Q=k*X;D===!0&&(h.fromBufferAttribute(q,k),lt[R+Q+0]=h.x,lt[R+Q+1]=h.y,lt[R+Q+2]=h.z,lt[R+Q+3]=0),P===!0&&(h.fromBufferAttribute(j,k),lt[R+Q+4]=h.x,lt[R+Q+5]=h.y,lt[R+Q+6]=h.z,lt[R+Q+7]=0),G===!0&&(h.fromBufferAttribute(ct,k),lt[R+Q+8]=h.x,lt[R+Q+9]=h.y,lt[R+Q+10]=h.z,lt[R+Q+11]=ct.itemSize===4?h.w:1)}}x={count:A,texture:yt,size:new He(U,ut)},u.set(g,x),g.addEventListener("dispose",$)}let _=0;for(let D=0;D<S.length;D++)_+=S[D];const N=g.morphTargetsRelative?1:1-_;v.getUniforms().setValue(o,"morphTargetBaseInfluence",N),v.getUniforms().setValue(o,"morphTargetInfluences",S),v.getUniforms().setValue(o,"morphTargetsTexture",x.texture,i),v.getUniforms().setValue(o,"morphTargetsTextureSize",x.size)}else{const b=S===void 0?0:S.length;let A=r[g.id];if(A===void 0||A.length!==b){A=[];for(let P=0;P<b;P++)A[P]=[P,0];r[g.id]=A}for(let P=0;P<b;P++){const G=A[P];G[0]=P,G[1]=S[P]}A.sort(QE);for(let P=0;P<8;P++)P<b&&A[P][1]?(d[P][0]=A[P][0],d[P][1]=A[P][1]):(d[P][0]=Number.MAX_SAFE_INTEGER,d[P][1]=0);d.sort(KE);const x=g.morphAttributes.position,_=g.morphAttributes.normal;let N=0;for(let P=0;P<8;P++){const G=d[P],F=G[0],I=G[1];F!==Number.MAX_SAFE_INTEGER&&I?(x&&g.getAttribute("morphTarget"+P)!==x[F]&&g.setAttribute("morphTarget"+P,x[F]),_&&g.getAttribute("morphNormal"+P)!==_[F]&&g.setAttribute("morphNormal"+P,_[F]),l[P]=I,N+=I):(x&&g.hasAttribute("morphTarget"+P)===!0&&g.deleteAttribute("morphTarget"+P),_&&g.hasAttribute("morphNormal"+P)===!0&&g.deleteAttribute("morphNormal"+P),l[P]=0)}const D=g.morphTargetsRelative?1:1-N;v.getUniforms().setValue(o,"morphTargetBaseInfluence",D),v.getUniforms().setValue(o,"morphTargetInfluences",l)}}return{update:m}}function $E(o,e,i,r){let l=new WeakMap;function u(m){const p=r.render.frame,g=m.geometry,v=e.get(m,g);if(l.get(v)!==p&&(e.update(v),l.set(v,p)),m.isInstancedMesh&&(m.hasEventListener("dispose",d)===!1&&m.addEventListener("dispose",d),l.get(m)!==p&&(i.update(m.instanceMatrix,o.ARRAY_BUFFER),m.instanceColor!==null&&i.update(m.instanceColor,o.ARRAY_BUFFER),l.set(m,p))),m.isSkinnedMesh){const S=m.skeleton;l.get(S)!==p&&(S.update(),l.set(S,p))}return v}function h(){l=new WeakMap}function d(m){const p=m.target;p.removeEventListener("dispose",d),i.remove(p.instanceMatrix),p.instanceColor!==null&&i.remove(p.instanceColor)}return{update:u,dispose:h}}class uv extends ni{constructor(e,i,r,l,u,h,d,m,p,g){if(g=g!==void 0?g:ur,g!==ur&&g!==gs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");r===void 0&&g===ur&&(r=Ca),r===void 0&&g===gs&&(r=cr),super(null,l,u,h,d,m,g,r,p),this.isDepthTexture=!0,this.image={width:e,height:i},this.magFilter=d!==void 0?d:zn,this.minFilter=m!==void 0?m:zn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const i=super.toJSON(e);return this.compareFunction!==null&&(i.compareFunction=this.compareFunction),i}}const fv=new ni,dv=new uv(1,1);dv.compareFunction=j_;const hv=new J_,pv=new zx,mv=new ov,g_=[],__=[],v_=new Float32Array(16),S_=new Float32Array(9),x_=new Float32Array(4);function Ss(o,e,i){const r=o[0];if(r<=0||r>0)return o;const l=e*i;let u=g_[l];if(u===void 0&&(u=new Float32Array(l),g_[l]=u),e!==0){r.toArray(u,0);for(let h=1,d=0;h!==e;++h)d+=i,o[h].toArray(u,d)}return u}function hn(o,e){if(o.length!==e.length)return!1;for(let i=0,r=o.length;i<r;i++)if(o[i]!==e[i])return!1;return!0}function pn(o,e){for(let i=0,r=e.length;i<r;i++)o[i]=e[i]}function Ec(o,e){let i=__[e];i===void 0&&(i=new Int32Array(e),__[e]=i);for(let r=0;r!==e;++r)i[r]=o.allocateTextureUnit();return i}function tT(o,e){const i=this.cache;i[0]!==e&&(o.uniform1f(this.addr,e),i[0]=e)}function eT(o,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y)&&(o.uniform2f(this.addr,e.x,e.y),i[0]=e.x,i[1]=e.y);else{if(hn(i,e))return;o.uniform2fv(this.addr,e),pn(i,e)}}function nT(o,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y||i[2]!==e.z)&&(o.uniform3f(this.addr,e.x,e.y,e.z),i[0]=e.x,i[1]=e.y,i[2]=e.z);else if(e.r!==void 0)(i[0]!==e.r||i[1]!==e.g||i[2]!==e.b)&&(o.uniform3f(this.addr,e.r,e.g,e.b),i[0]=e.r,i[1]=e.g,i[2]=e.b);else{if(hn(i,e))return;o.uniform3fv(this.addr,e),pn(i,e)}}function iT(o,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y||i[2]!==e.z||i[3]!==e.w)&&(o.uniform4f(this.addr,e.x,e.y,e.z,e.w),i[0]=e.x,i[1]=e.y,i[2]=e.z,i[3]=e.w);else{if(hn(i,e))return;o.uniform4fv(this.addr,e),pn(i,e)}}function aT(o,e){const i=this.cache,r=e.elements;if(r===void 0){if(hn(i,e))return;o.uniformMatrix2fv(this.addr,!1,e),pn(i,e)}else{if(hn(i,r))return;x_.set(r),o.uniformMatrix2fv(this.addr,!1,x_),pn(i,r)}}function rT(o,e){const i=this.cache,r=e.elements;if(r===void 0){if(hn(i,e))return;o.uniformMatrix3fv(this.addr,!1,e),pn(i,e)}else{if(hn(i,r))return;S_.set(r),o.uniformMatrix3fv(this.addr,!1,S_),pn(i,r)}}function sT(o,e){const i=this.cache,r=e.elements;if(r===void 0){if(hn(i,e))return;o.uniformMatrix4fv(this.addr,!1,e),pn(i,e)}else{if(hn(i,r))return;v_.set(r),o.uniformMatrix4fv(this.addr,!1,v_),pn(i,r)}}function oT(o,e){const i=this.cache;i[0]!==e&&(o.uniform1i(this.addr,e),i[0]=e)}function lT(o,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y)&&(o.uniform2i(this.addr,e.x,e.y),i[0]=e.x,i[1]=e.y);else{if(hn(i,e))return;o.uniform2iv(this.addr,e),pn(i,e)}}function cT(o,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y||i[2]!==e.z)&&(o.uniform3i(this.addr,e.x,e.y,e.z),i[0]=e.x,i[1]=e.y,i[2]=e.z);else{if(hn(i,e))return;o.uniform3iv(this.addr,e),pn(i,e)}}function uT(o,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y||i[2]!==e.z||i[3]!==e.w)&&(o.uniform4i(this.addr,e.x,e.y,e.z,e.w),i[0]=e.x,i[1]=e.y,i[2]=e.z,i[3]=e.w);else{if(hn(i,e))return;o.uniform4iv(this.addr,e),pn(i,e)}}function fT(o,e){const i=this.cache;i[0]!==e&&(o.uniform1ui(this.addr,e),i[0]=e)}function dT(o,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y)&&(o.uniform2ui(this.addr,e.x,e.y),i[0]=e.x,i[1]=e.y);else{if(hn(i,e))return;o.uniform2uiv(this.addr,e),pn(i,e)}}function hT(o,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y||i[2]!==e.z)&&(o.uniform3ui(this.addr,e.x,e.y,e.z),i[0]=e.x,i[1]=e.y,i[2]=e.z);else{if(hn(i,e))return;o.uniform3uiv(this.addr,e),pn(i,e)}}function pT(o,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y||i[2]!==e.z||i[3]!==e.w)&&(o.uniform4ui(this.addr,e.x,e.y,e.z,e.w),i[0]=e.x,i[1]=e.y,i[2]=e.z,i[3]=e.w);else{if(hn(i,e))return;o.uniform4uiv(this.addr,e),pn(i,e)}}function mT(o,e,i){const r=this.cache,l=i.allocateTextureUnit();r[0]!==l&&(o.uniform1i(this.addr,l),r[0]=l);const u=this.type===o.SAMPLER_2D_SHADOW?dv:fv;i.setTexture2D(e||u,l)}function gT(o,e,i){const r=this.cache,l=i.allocateTextureUnit();r[0]!==l&&(o.uniform1i(this.addr,l),r[0]=l),i.setTexture3D(e||pv,l)}function _T(o,e,i){const r=this.cache,l=i.allocateTextureUnit();r[0]!==l&&(o.uniform1i(this.addr,l),r[0]=l),i.setTextureCube(e||mv,l)}function vT(o,e,i){const r=this.cache,l=i.allocateTextureUnit();r[0]!==l&&(o.uniform1i(this.addr,l),r[0]=l),i.setTexture2DArray(e||hv,l)}function ST(o){switch(o){case 5126:return tT;case 35664:return eT;case 35665:return nT;case 35666:return iT;case 35674:return aT;case 35675:return rT;case 35676:return sT;case 5124:case 35670:return oT;case 35667:case 35671:return lT;case 35668:case 35672:return cT;case 35669:case 35673:return uT;case 5125:return fT;case 36294:return dT;case 36295:return hT;case 36296:return pT;case 35678:case 36198:case 36298:case 36306:case 35682:return mT;case 35679:case 36299:case 36307:return gT;case 35680:case 36300:case 36308:case 36293:return _T;case 36289:case 36303:case 36311:case 36292:return vT}}function xT(o,e){o.uniform1fv(this.addr,e)}function MT(o,e){const i=Ss(e,this.size,2);o.uniform2fv(this.addr,i)}function yT(o,e){const i=Ss(e,this.size,3);o.uniform3fv(this.addr,i)}function ET(o,e){const i=Ss(e,this.size,4);o.uniform4fv(this.addr,i)}function TT(o,e){const i=Ss(e,this.size,4);o.uniformMatrix2fv(this.addr,!1,i)}function bT(o,e){const i=Ss(e,this.size,9);o.uniformMatrix3fv(this.addr,!1,i)}function AT(o,e){const i=Ss(e,this.size,16);o.uniformMatrix4fv(this.addr,!1,i)}function RT(o,e){o.uniform1iv(this.addr,e)}function wT(o,e){o.uniform2iv(this.addr,e)}function CT(o,e){o.uniform3iv(this.addr,e)}function DT(o,e){o.uniform4iv(this.addr,e)}function LT(o,e){o.uniform1uiv(this.addr,e)}function UT(o,e){o.uniform2uiv(this.addr,e)}function NT(o,e){o.uniform3uiv(this.addr,e)}function OT(o,e){o.uniform4uiv(this.addr,e)}function PT(o,e,i){const r=this.cache,l=e.length,u=Ec(i,l);hn(r,u)||(o.uniform1iv(this.addr,u),pn(r,u));for(let h=0;h!==l;++h)i.setTexture2D(e[h]||fv,u[h])}function zT(o,e,i){const r=this.cache,l=e.length,u=Ec(i,l);hn(r,u)||(o.uniform1iv(this.addr,u),pn(r,u));for(let h=0;h!==l;++h)i.setTexture3D(e[h]||pv,u[h])}function BT(o,e,i){const r=this.cache,l=e.length,u=Ec(i,l);hn(r,u)||(o.uniform1iv(this.addr,u),pn(r,u));for(let h=0;h!==l;++h)i.setTextureCube(e[h]||mv,u[h])}function IT(o,e,i){const r=this.cache,l=e.length,u=Ec(i,l);hn(r,u)||(o.uniform1iv(this.addr,u),pn(r,u));for(let h=0;h!==l;++h)i.setTexture2DArray(e[h]||hv,u[h])}function FT(o){switch(o){case 5126:return xT;case 35664:return MT;case 35665:return yT;case 35666:return ET;case 35674:return TT;case 35675:return bT;case 35676:return AT;case 5124:case 35670:return RT;case 35667:case 35671:return wT;case 35668:case 35672:return CT;case 35669:case 35673:return DT;case 5125:return LT;case 36294:return UT;case 36295:return NT;case 36296:return OT;case 35678:case 36198:case 36298:case 36306:case 35682:return PT;case 35679:case 36299:case 36307:return zT;case 35680:case 36300:case 36308:case 36293:return BT;case 36289:case 36303:case 36311:case 36292:return IT}}class HT{constructor(e,i,r){this.id=e,this.addr=r,this.cache=[],this.type=i.type,this.setValue=ST(i.type)}}class GT{constructor(e,i,r){this.id=e,this.addr=r,this.cache=[],this.type=i.type,this.size=i.size,this.setValue=FT(i.type)}}class VT{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,i,r){const l=this.seq;for(let u=0,h=l.length;u!==h;++u){const d=l[u];d.setValue(e,i[d.id],r)}}}const od=/(\w+)(\])?(\[|\.)?/g;function M_(o,e){o.seq.push(e),o.map[e.id]=e}function kT(o,e,i){const r=o.name,l=r.length;for(od.lastIndex=0;;){const u=od.exec(r),h=od.lastIndex;let d=u[1];const m=u[2]==="]",p=u[3];if(m&&(d=d|0),p===void 0||p==="["&&h+2===l){M_(i,p===void 0?new HT(d,o,e):new GT(d,o,e));break}else{let v=i.map[d];v===void 0&&(v=new VT(d),M_(i,v)),i=v}}}class dc{constructor(e,i){this.seq=[],this.map={};const r=e.getProgramParameter(i,e.ACTIVE_UNIFORMS);for(let l=0;l<r;++l){const u=e.getActiveUniform(i,l),h=e.getUniformLocation(i,u.name);kT(u,h,this)}}setValue(e,i,r,l){const u=this.map[i];u!==void 0&&u.setValue(e,r,l)}setOptional(e,i,r){const l=i[r];l!==void 0&&this.setValue(e,r,l)}static upload(e,i,r,l){for(let u=0,h=i.length;u!==h;++u){const d=i[u],m=r[d.id];m.needsUpdate!==!1&&d.setValue(e,m.value,l)}}static seqWithValue(e,i){const r=[];for(let l=0,u=e.length;l!==u;++l){const h=e[l];h.id in i&&r.push(h)}return r}}function y_(o,e,i){const r=o.createShader(e);return o.shaderSource(r,i),o.compileShader(r),r}const XT=37297;let WT=0;function qT(o,e){const i=o.split(`
`),r=[],l=Math.max(e-6,0),u=Math.min(e+6,i.length);for(let h=l;h<u;h++){const d=h+1;r.push(`${d===e?">":" "} ${d}: ${i[h]}`)}return r.join(`
`)}function YT(o){const e=Fe.getPrimaries(Fe.workingColorSpace),i=Fe.getPrimaries(o);let r;switch(e===i?r="":e===gc&&i===mc?r="LinearDisplayP3ToLinearSRGB":e===mc&&i===gc&&(r="LinearSRGBToLinearDisplayP3"),o){case $i:case xc:return[r,"LinearTransferOETF"];case bn:case bd:return[r,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",o),[r,"LinearTransferOETF"]}}function E_(o,e,i){const r=o.getShaderParameter(e,o.COMPILE_STATUS),l=o.getShaderInfoLog(e).trim();if(r&&l==="")return"";const u=/ERROR: 0:(\d+)/.exec(l);if(u){const h=parseInt(u[1]);return i.toUpperCase()+`

`+l+`

`+qT(o.getShaderSource(e),h)}else return l}function jT(o,e){const i=YT(e);return`vec4 ${o}( vec4 value ) { return ${i[0]}( ${i[1]}( value ) ); }`}function ZT(o,e){let i;switch(e){case ax:i="Linear";break;case rx:i="Reinhard";break;case sx:i="OptimizedCineon";break;case ox:i="ACESFilmic";break;case cx:i="AgX";break;case lx:i="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),i="Linear"}return"vec3 "+o+"( vec3 color ) { return "+i+"ToneMapping( color ); }"}function KT(o){return[o.extensionDerivatives||o.envMapCubeUVHeight||o.bumpMap||o.normalMapTangentSpace||o.clearcoatNormalMap||o.flatShading||o.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(o.extensionFragDepth||o.logarithmicDepthBuffer)&&o.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",o.extensionDrawBuffers&&o.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(o.extensionShaderTextureLOD||o.envMap||o.transmission)&&o.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(fs).join(`
`)}function QT(o){return[o.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(fs).join(`
`)}function JT(o){const e=[];for(const i in o){const r=o[i];r!==!1&&e.push("#define "+i+" "+r)}return e.join(`
`)}function $T(o,e){const i={},r=o.getProgramParameter(e,o.ACTIVE_ATTRIBUTES);for(let l=0;l<r;l++){const u=o.getActiveAttrib(e,l),h=u.name;let d=1;u.type===o.FLOAT_MAT2&&(d=2),u.type===o.FLOAT_MAT3&&(d=3),u.type===o.FLOAT_MAT4&&(d=4),i[h]={type:u.type,location:o.getAttribLocation(e,h),locationSize:d}}return i}function fs(o){return o!==""}function T_(o,e){const i=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return o.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,i).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function b_(o,e){return o.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const tb=/^[ \t]*#include +<([\w\d./]+)>/gm;function xd(o){return o.replace(tb,nb)}const eb=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function nb(o,e){let i=_e[e];if(i===void 0){const r=eb.get(e);if(r!==void 0)i=_e[r],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,r);else throw new Error("Can not resolve #include <"+e+">")}return xd(i)}const ib=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function A_(o){return o.replace(ib,ab)}function ab(o,e,i,r){let l="";for(let u=parseInt(e);u<parseInt(i);u++)l+=r.replace(/\[\s*i\s*\]/g,"[ "+u+" ]").replace(/UNROLLED_LOOP_INDEX/g,u);return l}function R_(o){let e="precision "+o.precision+` float;
precision `+o.precision+" int;";return o.precision==="highp"?e+=`
#define HIGH_PRECISION`:o.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:o.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function rb(o){let e="SHADOWMAP_TYPE_BASIC";return o.shadowMapType===B_?e="SHADOWMAP_TYPE_PCF":o.shadowMapType===US?e="SHADOWMAP_TYPE_PCF_SOFT":o.shadowMapType===Ki&&(e="SHADOWMAP_TYPE_VSM"),e}function sb(o){let e="ENVMAP_TYPE_CUBE";if(o.envMap)switch(o.envMapMode){case ps:case ms:e="ENVMAP_TYPE_CUBE";break;case Sc:e="ENVMAP_TYPE_CUBE_UV";break}return e}function ob(o){let e="ENVMAP_MODE_REFLECTION";return o.envMap&&o.envMapMode===ms&&(e="ENVMAP_MODE_REFRACTION"),e}function lb(o){let e="ENVMAP_BLENDING_NONE";if(o.envMap)switch(o.combine){case I_:e="ENVMAP_BLENDING_MULTIPLY";break;case nx:e="ENVMAP_BLENDING_MIX";break;case ix:e="ENVMAP_BLENDING_ADD";break}return e}function cb(o){const e=o.envMapCubeUVHeight;if(e===null)return null;const i=Math.log2(e)-2,r=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,i),112)),texelHeight:r,maxMip:i}}function ub(o,e,i,r){const l=o.getContext(),u=i.defines;let h=i.vertexShader,d=i.fragmentShader;const m=rb(i),p=sb(i),g=ob(i),v=lb(i),S=cb(i),y=i.isWebGL2?"":KT(i),b=QT(i),A=JT(u),x=l.createProgram();let _,N,D=i.glslVersion?"#version "+i.glslVersion+`
`:"";i.isRawShaderMaterial?(_=["#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,A].filter(fs).join(`
`),_.length>0&&(_+=`
`),N=[y,"#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,A].filter(fs).join(`
`),N.length>0&&(N+=`
`)):(_=[R_(i),"#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,A,i.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",i.batching?"#define USE_BATCHING":"",i.instancing?"#define USE_INSTANCING":"",i.instancingColor?"#define USE_INSTANCING_COLOR":"",i.useFog&&i.fog?"#define USE_FOG":"",i.useFog&&i.fogExp2?"#define FOG_EXP2":"",i.map?"#define USE_MAP":"",i.envMap?"#define USE_ENVMAP":"",i.envMap?"#define "+g:"",i.lightMap?"#define USE_LIGHTMAP":"",i.aoMap?"#define USE_AOMAP":"",i.bumpMap?"#define USE_BUMPMAP":"",i.normalMap?"#define USE_NORMALMAP":"",i.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",i.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",i.displacementMap?"#define USE_DISPLACEMENTMAP":"",i.emissiveMap?"#define USE_EMISSIVEMAP":"",i.anisotropy?"#define USE_ANISOTROPY":"",i.anisotropyMap?"#define USE_ANISOTROPYMAP":"",i.clearcoatMap?"#define USE_CLEARCOATMAP":"",i.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",i.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",i.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",i.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",i.specularMap?"#define USE_SPECULARMAP":"",i.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",i.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",i.roughnessMap?"#define USE_ROUGHNESSMAP":"",i.metalnessMap?"#define USE_METALNESSMAP":"",i.alphaMap?"#define USE_ALPHAMAP":"",i.alphaHash?"#define USE_ALPHAHASH":"",i.transmission?"#define USE_TRANSMISSION":"",i.transmissionMap?"#define USE_TRANSMISSIONMAP":"",i.thicknessMap?"#define USE_THICKNESSMAP":"",i.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",i.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",i.mapUv?"#define MAP_UV "+i.mapUv:"",i.alphaMapUv?"#define ALPHAMAP_UV "+i.alphaMapUv:"",i.lightMapUv?"#define LIGHTMAP_UV "+i.lightMapUv:"",i.aoMapUv?"#define AOMAP_UV "+i.aoMapUv:"",i.emissiveMapUv?"#define EMISSIVEMAP_UV "+i.emissiveMapUv:"",i.bumpMapUv?"#define BUMPMAP_UV "+i.bumpMapUv:"",i.normalMapUv?"#define NORMALMAP_UV "+i.normalMapUv:"",i.displacementMapUv?"#define DISPLACEMENTMAP_UV "+i.displacementMapUv:"",i.metalnessMapUv?"#define METALNESSMAP_UV "+i.metalnessMapUv:"",i.roughnessMapUv?"#define ROUGHNESSMAP_UV "+i.roughnessMapUv:"",i.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+i.anisotropyMapUv:"",i.clearcoatMapUv?"#define CLEARCOATMAP_UV "+i.clearcoatMapUv:"",i.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+i.clearcoatNormalMapUv:"",i.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+i.clearcoatRoughnessMapUv:"",i.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+i.iridescenceMapUv:"",i.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+i.iridescenceThicknessMapUv:"",i.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+i.sheenColorMapUv:"",i.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+i.sheenRoughnessMapUv:"",i.specularMapUv?"#define SPECULARMAP_UV "+i.specularMapUv:"",i.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+i.specularColorMapUv:"",i.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+i.specularIntensityMapUv:"",i.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+i.transmissionMapUv:"",i.thicknessMapUv?"#define THICKNESSMAP_UV "+i.thicknessMapUv:"",i.vertexTangents&&i.flatShading===!1?"#define USE_TANGENT":"",i.vertexColors?"#define USE_COLOR":"",i.vertexAlphas?"#define USE_COLOR_ALPHA":"",i.vertexUv1s?"#define USE_UV1":"",i.vertexUv2s?"#define USE_UV2":"",i.vertexUv3s?"#define USE_UV3":"",i.pointsUvs?"#define USE_POINTS_UV":"",i.flatShading?"#define FLAT_SHADED":"",i.skinning?"#define USE_SKINNING":"",i.morphTargets?"#define USE_MORPHTARGETS":"",i.morphNormals&&i.flatShading===!1?"#define USE_MORPHNORMALS":"",i.morphColors&&i.isWebGL2?"#define USE_MORPHCOLORS":"",i.morphTargetsCount>0&&i.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",i.morphTargetsCount>0&&i.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+i.morphTextureStride:"",i.morphTargetsCount>0&&i.isWebGL2?"#define MORPHTARGETS_COUNT "+i.morphTargetsCount:"",i.doubleSided?"#define DOUBLE_SIDED":"",i.flipSided?"#define FLIP_SIDED":"",i.shadowMapEnabled?"#define USE_SHADOWMAP":"",i.shadowMapEnabled?"#define "+m:"",i.sizeAttenuation?"#define USE_SIZEATTENUATION":"",i.numLightProbes>0?"#define USE_LIGHT_PROBES":"",i.useLegacyLights?"#define LEGACY_LIGHTS":"",i.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",i.logarithmicDepthBuffer&&i.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(fs).join(`
`),N=[y,R_(i),"#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,A,i.useFog&&i.fog?"#define USE_FOG":"",i.useFog&&i.fogExp2?"#define FOG_EXP2":"",i.map?"#define USE_MAP":"",i.matcap?"#define USE_MATCAP":"",i.envMap?"#define USE_ENVMAP":"",i.envMap?"#define "+p:"",i.envMap?"#define "+g:"",i.envMap?"#define "+v:"",S?"#define CUBEUV_TEXEL_WIDTH "+S.texelWidth:"",S?"#define CUBEUV_TEXEL_HEIGHT "+S.texelHeight:"",S?"#define CUBEUV_MAX_MIP "+S.maxMip+".0":"",i.lightMap?"#define USE_LIGHTMAP":"",i.aoMap?"#define USE_AOMAP":"",i.bumpMap?"#define USE_BUMPMAP":"",i.normalMap?"#define USE_NORMALMAP":"",i.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",i.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",i.emissiveMap?"#define USE_EMISSIVEMAP":"",i.anisotropy?"#define USE_ANISOTROPY":"",i.anisotropyMap?"#define USE_ANISOTROPYMAP":"",i.clearcoat?"#define USE_CLEARCOAT":"",i.clearcoatMap?"#define USE_CLEARCOATMAP":"",i.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",i.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",i.iridescence?"#define USE_IRIDESCENCE":"",i.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",i.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",i.specularMap?"#define USE_SPECULARMAP":"",i.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",i.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",i.roughnessMap?"#define USE_ROUGHNESSMAP":"",i.metalnessMap?"#define USE_METALNESSMAP":"",i.alphaMap?"#define USE_ALPHAMAP":"",i.alphaTest?"#define USE_ALPHATEST":"",i.alphaHash?"#define USE_ALPHAHASH":"",i.sheen?"#define USE_SHEEN":"",i.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",i.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",i.transmission?"#define USE_TRANSMISSION":"",i.transmissionMap?"#define USE_TRANSMISSIONMAP":"",i.thicknessMap?"#define USE_THICKNESSMAP":"",i.vertexTangents&&i.flatShading===!1?"#define USE_TANGENT":"",i.vertexColors||i.instancingColor?"#define USE_COLOR":"",i.vertexAlphas?"#define USE_COLOR_ALPHA":"",i.vertexUv1s?"#define USE_UV1":"",i.vertexUv2s?"#define USE_UV2":"",i.vertexUv3s?"#define USE_UV3":"",i.pointsUvs?"#define USE_POINTS_UV":"",i.gradientMap?"#define USE_GRADIENTMAP":"",i.flatShading?"#define FLAT_SHADED":"",i.doubleSided?"#define DOUBLE_SIDED":"",i.flipSided?"#define FLIP_SIDED":"",i.shadowMapEnabled?"#define USE_SHADOWMAP":"",i.shadowMapEnabled?"#define "+m:"",i.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",i.numLightProbes>0?"#define USE_LIGHT_PROBES":"",i.useLegacyLights?"#define LEGACY_LIGHTS":"",i.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",i.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",i.logarithmicDepthBuffer&&i.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",i.toneMapping!==Na?"#define TONE_MAPPING":"",i.toneMapping!==Na?_e.tonemapping_pars_fragment:"",i.toneMapping!==Na?ZT("toneMapping",i.toneMapping):"",i.dithering?"#define DITHERING":"",i.opaque?"#define OPAQUE":"",_e.colorspace_pars_fragment,jT("linearToOutputTexel",i.outputColorSpace),i.useDepthPacking?"#define DEPTH_PACKING "+i.depthPacking:"",`
`].filter(fs).join(`
`)),h=xd(h),h=T_(h,i),h=b_(h,i),d=xd(d),d=T_(d,i),d=b_(d,i),h=A_(h),d=A_(d),i.isWebGL2&&i.isRawShaderMaterial!==!0&&(D=`#version 300 es
`,_=[b,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+_,N=["precision mediump sampler2DArray;","#define varying in",i.glslVersion===Wg?"":"layout(location = 0) out highp vec4 pc_fragColor;",i.glslVersion===Wg?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+N);const P=D+_+h,G=D+N+d,F=y_(l,l.VERTEX_SHADER,P),I=y_(l,l.FRAGMENT_SHADER,G);l.attachShader(x,F),l.attachShader(x,I),i.index0AttributeName!==void 0?l.bindAttribLocation(x,0,i.index0AttributeName):i.morphTargets===!0&&l.bindAttribLocation(x,0,"position"),l.linkProgram(x);function mt(lt){if(o.debug.checkShaderErrors){const yt=l.getProgramInfoLog(x).trim(),X=l.getShaderInfoLog(F).trim(),$=l.getShaderInfoLog(I).trim();let O=!0,q=!0;if(l.getProgramParameter(x,l.LINK_STATUS)===!1)if(O=!1,typeof o.debug.onShaderError=="function")o.debug.onShaderError(l,x,F,I);else{const j=E_(l,F,"vertex"),ct=E_(l,I,"fragment");console.error("THREE.WebGLProgram: Shader Error "+l.getError()+" - VALIDATE_STATUS "+l.getProgramParameter(x,l.VALIDATE_STATUS)+`

Program Info Log: `+yt+`
`+j+`
`+ct)}else yt!==""?console.warn("THREE.WebGLProgram: Program Info Log:",yt):(X===""||$==="")&&(q=!1);q&&(lt.diagnostics={runnable:O,programLog:yt,vertexShader:{log:X,prefix:_},fragmentShader:{log:$,prefix:N}})}l.deleteShader(F),l.deleteShader(I),C=new dc(l,x),U=$T(l,x)}let C;this.getUniforms=function(){return C===void 0&&mt(this),C};let U;this.getAttributes=function(){return U===void 0&&mt(this),U};let ut=i.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return ut===!1&&(ut=l.getProgramParameter(x,XT)),ut},this.destroy=function(){r.releaseStatesOfProgram(this),l.deleteProgram(x),this.program=void 0},this.type=i.shaderType,this.name=i.shaderName,this.id=WT++,this.cacheKey=e,this.usedTimes=1,this.program=x,this.vertexShader=F,this.fragmentShader=I,this}let fb=0;class db{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const i=e.vertexShader,r=e.fragmentShader,l=this._getShaderStage(i),u=this._getShaderStage(r),h=this._getShaderCacheForMaterial(e);return h.has(l)===!1&&(h.add(l),l.usedTimes++),h.has(u)===!1&&(h.add(u),u.usedTimes++),this}remove(e){const i=this.materialCache.get(e);for(const r of i)r.usedTimes--,r.usedTimes===0&&this.shaderCache.delete(r.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const i=this.materialCache;let r=i.get(e);return r===void 0&&(r=new Set,i.set(e,r)),r}_getShaderStage(e){const i=this.shaderCache;let r=i.get(e);return r===void 0&&(r=new hb(e),i.set(e,r)),r}}class hb{constructor(e){this.id=fb++,this.code=e,this.usedTimes=0}}function pb(o,e,i,r,l,u,h){const d=new tv,m=new db,p=[],g=l.isWebGL2,v=l.logarithmicDepthBuffer,S=l.vertexTextures;let y=l.precision;const b={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function A(C){return C===0?"uv":`uv${C}`}function x(C,U,ut,lt,yt){const X=lt.fog,$=yt.geometry,O=C.isMeshStandardMaterial?lt.environment:null,q=(C.isMeshStandardMaterial?i:e).get(C.envMap||O),j=q&&q.mapping===Sc?q.image.height:null,ct=b[C.type];C.precision!==null&&(y=l.getMaxPrecision(C.precision),y!==C.precision&&console.warn("THREE.WebGLProgram.getParameters:",C.precision,"not supported, using",y,"instead."));const R=$.morphAttributes.position||$.morphAttributes.normal||$.morphAttributes.color,k=R!==void 0?R.length:0;let Q=0;$.morphAttributes.position!==void 0&&(Q=1),$.morphAttributes.normal!==void 0&&(Q=2),$.morphAttributes.color!==void 0&&(Q=3);let B,J,_t,pt;if(ct){const Ot=Di[ct];B=Ot.vertexShader,J=Ot.fragmentShader}else B=C.vertexShader,J=C.fragmentShader,m.update(C),_t=m.getVertexShaderID(C),pt=m.getFragmentShaderID(C);const Lt=o.getRenderTarget(),Pt=yt.isInstancedMesh===!0,jt=yt.isBatchedMesh===!0,Kt=!!C.map,oe=!!C.matcap,tt=!!q,qe=!!C.aoMap,Xt=!!C.lightMap,ie=!!C.bumpMap,It=!!C.normalMap,Se=!!C.displacementMap,ue=!!C.emissiveMap,L=!!C.metalnessMap,T=!!C.roughnessMap,et=C.anisotropy>0,St=C.clearcoat>0,vt=C.iridescence>0,Mt=C.sheen>0,Ut=C.transmission>0,Tt=et&&!!C.anisotropyMap,Dt=St&&!!C.clearcoatMap,Gt=St&&!!C.clearcoatNormalMap,kt=St&&!!C.clearcoatRoughnessMap,xt=vt&&!!C.iridescenceMap,be=vt&&!!C.iridescenceThicknessMap,he=Mt&&!!C.sheenColorMap,ee=Mt&&!!C.sheenRoughnessMap,Vt=!!C.specularMap,zt=!!C.specularColorMap,ae=!!C.specularIntensityMap,ye=Ut&&!!C.transmissionMap,Ge=Ut&&!!C.thicknessMap,de=!!C.gradientMap,bt=!!C.alphaMap,H=C.alphaTest>0,At=!!C.alphaHash,Ct=!!C.extensions,Jt=!!$.attributes.uv1,Zt=!!$.attributes.uv2,Ce=!!$.attributes.uv3;let ft=Na;return C.toneMapped&&(Lt===null||Lt.isXRRenderTarget===!0)&&(ft=o.toneMapping),{isWebGL2:g,shaderID:ct,shaderType:C.type,shaderName:C.name,vertexShader:B,fragmentShader:J,defines:C.defines,customVertexShaderID:_t,customFragmentShaderID:pt,isRawShaderMaterial:C.isRawShaderMaterial===!0,glslVersion:C.glslVersion,precision:y,batching:jt,instancing:Pt,instancingColor:Pt&&yt.instanceColor!==null,supportsVertexTextures:S,outputColorSpace:Lt===null?o.outputColorSpace:Lt.isXRRenderTarget===!0?Lt.texture.colorSpace:$i,map:Kt,matcap:oe,envMap:tt,envMapMode:tt&&q.mapping,envMapCubeUVHeight:j,aoMap:qe,lightMap:Xt,bumpMap:ie,normalMap:It,displacementMap:S&&Se,emissiveMap:ue,normalMapObjectSpace:It&&C.normalMapType===yx,normalMapTangentSpace:It&&C.normalMapType===Mx,metalnessMap:L,roughnessMap:T,anisotropy:et,anisotropyMap:Tt,clearcoat:St,clearcoatMap:Dt,clearcoatNormalMap:Gt,clearcoatRoughnessMap:kt,iridescence:vt,iridescenceMap:xt,iridescenceThicknessMap:be,sheen:Mt,sheenColorMap:he,sheenRoughnessMap:ee,specularMap:Vt,specularColorMap:zt,specularIntensityMap:ae,transmission:Ut,transmissionMap:ye,thicknessMap:Ge,gradientMap:de,opaque:C.transparent===!1&&C.blending===ds,alphaMap:bt,alphaTest:H,alphaHash:At,combine:C.combine,mapUv:Kt&&A(C.map.channel),aoMapUv:qe&&A(C.aoMap.channel),lightMapUv:Xt&&A(C.lightMap.channel),bumpMapUv:ie&&A(C.bumpMap.channel),normalMapUv:It&&A(C.normalMap.channel),displacementMapUv:Se&&A(C.displacementMap.channel),emissiveMapUv:ue&&A(C.emissiveMap.channel),metalnessMapUv:L&&A(C.metalnessMap.channel),roughnessMapUv:T&&A(C.roughnessMap.channel),anisotropyMapUv:Tt&&A(C.anisotropyMap.channel),clearcoatMapUv:Dt&&A(C.clearcoatMap.channel),clearcoatNormalMapUv:Gt&&A(C.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:kt&&A(C.clearcoatRoughnessMap.channel),iridescenceMapUv:xt&&A(C.iridescenceMap.channel),iridescenceThicknessMapUv:be&&A(C.iridescenceThicknessMap.channel),sheenColorMapUv:he&&A(C.sheenColorMap.channel),sheenRoughnessMapUv:ee&&A(C.sheenRoughnessMap.channel),specularMapUv:Vt&&A(C.specularMap.channel),specularColorMapUv:zt&&A(C.specularColorMap.channel),specularIntensityMapUv:ae&&A(C.specularIntensityMap.channel),transmissionMapUv:ye&&A(C.transmissionMap.channel),thicknessMapUv:Ge&&A(C.thicknessMap.channel),alphaMapUv:bt&&A(C.alphaMap.channel),vertexTangents:!!$.attributes.tangent&&(It||et),vertexColors:C.vertexColors,vertexAlphas:C.vertexColors===!0&&!!$.attributes.color&&$.attributes.color.itemSize===4,vertexUv1s:Jt,vertexUv2s:Zt,vertexUv3s:Ce,pointsUvs:yt.isPoints===!0&&!!$.attributes.uv&&(Kt||bt),fog:!!X,useFog:C.fog===!0,fogExp2:X&&X.isFogExp2,flatShading:C.flatShading===!0,sizeAttenuation:C.sizeAttenuation===!0,logarithmicDepthBuffer:v,skinning:yt.isSkinnedMesh===!0,morphTargets:$.morphAttributes.position!==void 0,morphNormals:$.morphAttributes.normal!==void 0,morphColors:$.morphAttributes.color!==void 0,morphTargetsCount:k,morphTextureStride:Q,numDirLights:U.directional.length,numPointLights:U.point.length,numSpotLights:U.spot.length,numSpotLightMaps:U.spotLightMap.length,numRectAreaLights:U.rectArea.length,numHemiLights:U.hemi.length,numDirLightShadows:U.directionalShadowMap.length,numPointLightShadows:U.pointShadowMap.length,numSpotLightShadows:U.spotShadowMap.length,numSpotLightShadowsWithMaps:U.numSpotLightShadowsWithMaps,numLightProbes:U.numLightProbes,numClippingPlanes:h.numPlanes,numClipIntersection:h.numIntersection,dithering:C.dithering,shadowMapEnabled:o.shadowMap.enabled&&ut.length>0,shadowMapType:o.shadowMap.type,toneMapping:ft,useLegacyLights:o._useLegacyLights,decodeVideoTexture:Kt&&C.map.isVideoTexture===!0&&Fe.getTransfer(C.map.colorSpace)===Ze,premultipliedAlpha:C.premultipliedAlpha,doubleSided:C.side===Qi,flipSided:C.side===Xn,useDepthPacking:C.depthPacking>=0,depthPacking:C.depthPacking||0,index0AttributeName:C.index0AttributeName,extensionDerivatives:Ct&&C.extensions.derivatives===!0,extensionFragDepth:Ct&&C.extensions.fragDepth===!0,extensionDrawBuffers:Ct&&C.extensions.drawBuffers===!0,extensionShaderTextureLOD:Ct&&C.extensions.shaderTextureLOD===!0,extensionClipCullDistance:Ct&&C.extensions.clipCullDistance&&r.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:g||r.has("EXT_frag_depth"),rendererExtensionDrawBuffers:g||r.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:g||r.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:r.has("KHR_parallel_shader_compile"),customProgramCacheKey:C.customProgramCacheKey()}}function _(C){const U=[];if(C.shaderID?U.push(C.shaderID):(U.push(C.customVertexShaderID),U.push(C.customFragmentShaderID)),C.defines!==void 0)for(const ut in C.defines)U.push(ut),U.push(C.defines[ut]);return C.isRawShaderMaterial===!1&&(N(U,C),D(U,C),U.push(o.outputColorSpace)),U.push(C.customProgramCacheKey),U.join()}function N(C,U){C.push(U.precision),C.push(U.outputColorSpace),C.push(U.envMapMode),C.push(U.envMapCubeUVHeight),C.push(U.mapUv),C.push(U.alphaMapUv),C.push(U.lightMapUv),C.push(U.aoMapUv),C.push(U.bumpMapUv),C.push(U.normalMapUv),C.push(U.displacementMapUv),C.push(U.emissiveMapUv),C.push(U.metalnessMapUv),C.push(U.roughnessMapUv),C.push(U.anisotropyMapUv),C.push(U.clearcoatMapUv),C.push(U.clearcoatNormalMapUv),C.push(U.clearcoatRoughnessMapUv),C.push(U.iridescenceMapUv),C.push(U.iridescenceThicknessMapUv),C.push(U.sheenColorMapUv),C.push(U.sheenRoughnessMapUv),C.push(U.specularMapUv),C.push(U.specularColorMapUv),C.push(U.specularIntensityMapUv),C.push(U.transmissionMapUv),C.push(U.thicknessMapUv),C.push(U.combine),C.push(U.fogExp2),C.push(U.sizeAttenuation),C.push(U.morphTargetsCount),C.push(U.morphAttributeCount),C.push(U.numDirLights),C.push(U.numPointLights),C.push(U.numSpotLights),C.push(U.numSpotLightMaps),C.push(U.numHemiLights),C.push(U.numRectAreaLights),C.push(U.numDirLightShadows),C.push(U.numPointLightShadows),C.push(U.numSpotLightShadows),C.push(U.numSpotLightShadowsWithMaps),C.push(U.numLightProbes),C.push(U.shadowMapType),C.push(U.toneMapping),C.push(U.numClippingPlanes),C.push(U.numClipIntersection),C.push(U.depthPacking)}function D(C,U){d.disableAll(),U.isWebGL2&&d.enable(0),U.supportsVertexTextures&&d.enable(1),U.instancing&&d.enable(2),U.instancingColor&&d.enable(3),U.matcap&&d.enable(4),U.envMap&&d.enable(5),U.normalMapObjectSpace&&d.enable(6),U.normalMapTangentSpace&&d.enable(7),U.clearcoat&&d.enable(8),U.iridescence&&d.enable(9),U.alphaTest&&d.enable(10),U.vertexColors&&d.enable(11),U.vertexAlphas&&d.enable(12),U.vertexUv1s&&d.enable(13),U.vertexUv2s&&d.enable(14),U.vertexUv3s&&d.enable(15),U.vertexTangents&&d.enable(16),U.anisotropy&&d.enable(17),U.alphaHash&&d.enable(18),U.batching&&d.enable(19),C.push(d.mask),d.disableAll(),U.fog&&d.enable(0),U.useFog&&d.enable(1),U.flatShading&&d.enable(2),U.logarithmicDepthBuffer&&d.enable(3),U.skinning&&d.enable(4),U.morphTargets&&d.enable(5),U.morphNormals&&d.enable(6),U.morphColors&&d.enable(7),U.premultipliedAlpha&&d.enable(8),U.shadowMapEnabled&&d.enable(9),U.useLegacyLights&&d.enable(10),U.doubleSided&&d.enable(11),U.flipSided&&d.enable(12),U.useDepthPacking&&d.enable(13),U.dithering&&d.enable(14),U.transmission&&d.enable(15),U.sheen&&d.enable(16),U.opaque&&d.enable(17),U.pointsUvs&&d.enable(18),U.decodeVideoTexture&&d.enable(19),C.push(d.mask)}function P(C){const U=b[C.type];let ut;if(U){const lt=Di[U];ut=Zx.clone(lt.uniforms)}else ut=C.uniforms;return ut}function G(C,U){let ut;for(let lt=0,yt=p.length;lt<yt;lt++){const X=p[lt];if(X.cacheKey===U){ut=X,++ut.usedTimes;break}}return ut===void 0&&(ut=new ub(o,U,C,u),p.push(ut)),ut}function F(C){if(--C.usedTimes===0){const U=p.indexOf(C);p[U]=p[p.length-1],p.pop(),C.destroy()}}function I(C){m.remove(C)}function mt(){m.dispose()}return{getParameters:x,getProgramCacheKey:_,getUniforms:P,acquireProgram:G,releaseProgram:F,releaseShaderCache:I,programs:p,dispose:mt}}function mb(){let o=new WeakMap;function e(u){let h=o.get(u);return h===void 0&&(h={},o.set(u,h)),h}function i(u){o.delete(u)}function r(u,h,d){o.get(u)[h]=d}function l(){o=new WeakMap}return{get:e,remove:i,update:r,dispose:l}}function gb(o,e){return o.groupOrder!==e.groupOrder?o.groupOrder-e.groupOrder:o.renderOrder!==e.renderOrder?o.renderOrder-e.renderOrder:o.material.id!==e.material.id?o.material.id-e.material.id:o.z!==e.z?o.z-e.z:o.id-e.id}function w_(o,e){return o.groupOrder!==e.groupOrder?o.groupOrder-e.groupOrder:o.renderOrder!==e.renderOrder?o.renderOrder-e.renderOrder:o.z!==e.z?e.z-o.z:o.id-e.id}function C_(){const o=[];let e=0;const i=[],r=[],l=[];function u(){e=0,i.length=0,r.length=0,l.length=0}function h(v,S,y,b,A,x){let _=o[e];return _===void 0?(_={id:v.id,object:v,geometry:S,material:y,groupOrder:b,renderOrder:v.renderOrder,z:A,group:x},o[e]=_):(_.id=v.id,_.object=v,_.geometry=S,_.material=y,_.groupOrder=b,_.renderOrder=v.renderOrder,_.z=A,_.group=x),e++,_}function d(v,S,y,b,A,x){const _=h(v,S,y,b,A,x);y.transmission>0?r.push(_):y.transparent===!0?l.push(_):i.push(_)}function m(v,S,y,b,A,x){const _=h(v,S,y,b,A,x);y.transmission>0?r.unshift(_):y.transparent===!0?l.unshift(_):i.unshift(_)}function p(v,S){i.length>1&&i.sort(v||gb),r.length>1&&r.sort(S||w_),l.length>1&&l.sort(S||w_)}function g(){for(let v=e,S=o.length;v<S;v++){const y=o[v];if(y.id===null)break;y.id=null,y.object=null,y.geometry=null,y.material=null,y.group=null}}return{opaque:i,transmissive:r,transparent:l,init:u,push:d,unshift:m,finish:g,sort:p}}function _b(){let o=new WeakMap;function e(r,l){const u=o.get(r);let h;return u===void 0?(h=new C_,o.set(r,[h])):l>=u.length?(h=new C_,u.push(h)):h=u[l],h}function i(){o=new WeakMap}return{get:e,dispose:i}}function vb(){const o={};return{get:function(e){if(o[e.id]!==void 0)return o[e.id];let i;switch(e.type){case"DirectionalLight":i={direction:new st,color:new Qt};break;case"SpotLight":i={position:new st,direction:new st,color:new Qt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":i={position:new st,color:new Qt,distance:0,decay:0};break;case"HemisphereLight":i={direction:new st,skyColor:new Qt,groundColor:new Qt};break;case"RectAreaLight":i={color:new Qt,position:new st,halfWidth:new st,halfHeight:new st};break}return o[e.id]=i,i}}}function Sb(){const o={};return{get:function(e){if(o[e.id]!==void 0)return o[e.id];let i;switch(e.type){case"DirectionalLight":i={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new He};break;case"SpotLight":i={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new He};break;case"PointLight":i={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new He,shadowCameraNear:1,shadowCameraFar:1e3};break}return o[e.id]=i,i}}}let xb=0;function Mb(o,e){return(e.castShadow?2:0)-(o.castShadow?2:0)+(e.map?1:0)-(o.map?1:0)}function yb(o,e){const i=new vb,r=Sb(),l={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let g=0;g<9;g++)l.probe.push(new st);const u=new st,h=new Sn,d=new Sn;function m(g,v){let S=0,y=0,b=0;for(let lt=0;lt<9;lt++)l.probe[lt].set(0,0,0);let A=0,x=0,_=0,N=0,D=0,P=0,G=0,F=0,I=0,mt=0,C=0;g.sort(Mb);const U=v===!0?Math.PI:1;for(let lt=0,yt=g.length;lt<yt;lt++){const X=g[lt],$=X.color,O=X.intensity,q=X.distance,j=X.shadow&&X.shadow.map?X.shadow.map.texture:null;if(X.isAmbientLight)S+=$.r*O*U,y+=$.g*O*U,b+=$.b*O*U;else if(X.isLightProbe){for(let ct=0;ct<9;ct++)l.probe[ct].addScaledVector(X.sh.coefficients[ct],O);C++}else if(X.isDirectionalLight){const ct=i.get(X);if(ct.color.copy(X.color).multiplyScalar(X.intensity*U),X.castShadow){const R=X.shadow,k=r.get(X);k.shadowBias=R.bias,k.shadowNormalBias=R.normalBias,k.shadowRadius=R.radius,k.shadowMapSize=R.mapSize,l.directionalShadow[A]=k,l.directionalShadowMap[A]=j,l.directionalShadowMatrix[A]=X.shadow.matrix,P++}l.directional[A]=ct,A++}else if(X.isSpotLight){const ct=i.get(X);ct.position.setFromMatrixPosition(X.matrixWorld),ct.color.copy($).multiplyScalar(O*U),ct.distance=q,ct.coneCos=Math.cos(X.angle),ct.penumbraCos=Math.cos(X.angle*(1-X.penumbra)),ct.decay=X.decay,l.spot[_]=ct;const R=X.shadow;if(X.map&&(l.spotLightMap[I]=X.map,I++,R.updateMatrices(X),X.castShadow&&mt++),l.spotLightMatrix[_]=R.matrix,X.castShadow){const k=r.get(X);k.shadowBias=R.bias,k.shadowNormalBias=R.normalBias,k.shadowRadius=R.radius,k.shadowMapSize=R.mapSize,l.spotShadow[_]=k,l.spotShadowMap[_]=j,F++}_++}else if(X.isRectAreaLight){const ct=i.get(X);ct.color.copy($).multiplyScalar(O),ct.halfWidth.set(X.width*.5,0,0),ct.halfHeight.set(0,X.height*.5,0),l.rectArea[N]=ct,N++}else if(X.isPointLight){const ct=i.get(X);if(ct.color.copy(X.color).multiplyScalar(X.intensity*U),ct.distance=X.distance,ct.decay=X.decay,X.castShadow){const R=X.shadow,k=r.get(X);k.shadowBias=R.bias,k.shadowNormalBias=R.normalBias,k.shadowRadius=R.radius,k.shadowMapSize=R.mapSize,k.shadowCameraNear=R.camera.near,k.shadowCameraFar=R.camera.far,l.pointShadow[x]=k,l.pointShadowMap[x]=j,l.pointShadowMatrix[x]=X.shadow.matrix,G++}l.point[x]=ct,x++}else if(X.isHemisphereLight){const ct=i.get(X);ct.skyColor.copy(X.color).multiplyScalar(O*U),ct.groundColor.copy(X.groundColor).multiplyScalar(O*U),l.hemi[D]=ct,D++}}N>0&&(e.isWebGL2?o.has("OES_texture_float_linear")===!0?(l.rectAreaLTC1=wt.LTC_FLOAT_1,l.rectAreaLTC2=wt.LTC_FLOAT_2):(l.rectAreaLTC1=wt.LTC_HALF_1,l.rectAreaLTC2=wt.LTC_HALF_2):o.has("OES_texture_float_linear")===!0?(l.rectAreaLTC1=wt.LTC_FLOAT_1,l.rectAreaLTC2=wt.LTC_FLOAT_2):o.has("OES_texture_half_float_linear")===!0?(l.rectAreaLTC1=wt.LTC_HALF_1,l.rectAreaLTC2=wt.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),l.ambient[0]=S,l.ambient[1]=y,l.ambient[2]=b;const ut=l.hash;(ut.directionalLength!==A||ut.pointLength!==x||ut.spotLength!==_||ut.rectAreaLength!==N||ut.hemiLength!==D||ut.numDirectionalShadows!==P||ut.numPointShadows!==G||ut.numSpotShadows!==F||ut.numSpotMaps!==I||ut.numLightProbes!==C)&&(l.directional.length=A,l.spot.length=_,l.rectArea.length=N,l.point.length=x,l.hemi.length=D,l.directionalShadow.length=P,l.directionalShadowMap.length=P,l.pointShadow.length=G,l.pointShadowMap.length=G,l.spotShadow.length=F,l.spotShadowMap.length=F,l.directionalShadowMatrix.length=P,l.pointShadowMatrix.length=G,l.spotLightMatrix.length=F+I-mt,l.spotLightMap.length=I,l.numSpotLightShadowsWithMaps=mt,l.numLightProbes=C,ut.directionalLength=A,ut.pointLength=x,ut.spotLength=_,ut.rectAreaLength=N,ut.hemiLength=D,ut.numDirectionalShadows=P,ut.numPointShadows=G,ut.numSpotShadows=F,ut.numSpotMaps=I,ut.numLightProbes=C,l.version=xb++)}function p(g,v){let S=0,y=0,b=0,A=0,x=0;const _=v.matrixWorldInverse;for(let N=0,D=g.length;N<D;N++){const P=g[N];if(P.isDirectionalLight){const G=l.directional[S];G.direction.setFromMatrixPosition(P.matrixWorld),u.setFromMatrixPosition(P.target.matrixWorld),G.direction.sub(u),G.direction.transformDirection(_),S++}else if(P.isSpotLight){const G=l.spot[b];G.position.setFromMatrixPosition(P.matrixWorld),G.position.applyMatrix4(_),G.direction.setFromMatrixPosition(P.matrixWorld),u.setFromMatrixPosition(P.target.matrixWorld),G.direction.sub(u),G.direction.transformDirection(_),b++}else if(P.isRectAreaLight){const G=l.rectArea[A];G.position.setFromMatrixPosition(P.matrixWorld),G.position.applyMatrix4(_),d.identity(),h.copy(P.matrixWorld),h.premultiply(_),d.extractRotation(h),G.halfWidth.set(P.width*.5,0,0),G.halfHeight.set(0,P.height*.5,0),G.halfWidth.applyMatrix4(d),G.halfHeight.applyMatrix4(d),A++}else if(P.isPointLight){const G=l.point[y];G.position.setFromMatrixPosition(P.matrixWorld),G.position.applyMatrix4(_),y++}else if(P.isHemisphereLight){const G=l.hemi[x];G.direction.setFromMatrixPosition(P.matrixWorld),G.direction.transformDirection(_),x++}}}return{setup:m,setupView:p,state:l}}function D_(o,e){const i=new yb(o,e),r=[],l=[];function u(){r.length=0,l.length=0}function h(v){r.push(v)}function d(v){l.push(v)}function m(v){i.setup(r,v)}function p(v){i.setupView(r,v)}return{init:u,state:{lightsArray:r,shadowsArray:l,lights:i},setupLights:m,setupLightsView:p,pushLight:h,pushShadow:d}}function Eb(o,e){let i=new WeakMap;function r(u,h=0){const d=i.get(u);let m;return d===void 0?(m=new D_(o,e),i.set(u,[m])):h>=d.length?(m=new D_(o,e),d.push(m)):m=d[h],m}function l(){i=new WeakMap}return{get:r,dispose:l}}class Tb extends Lo{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Sx,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class bb extends Lo{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const Ab=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Rb=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function wb(o,e,i){let r=new lv;const l=new He,u=new He,h=new An,d=new Tb({depthPacking:xx}),m=new bb,p={},g=i.maxTextureSize,v={[Pa]:Xn,[Xn]:Pa,[Qi]:Qi},S=new za({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new He},radius:{value:4}},vertexShader:Ab,fragmentShader:Rb}),y=S.clone();y.defines.HORIZONTAL_PASS=1;const b=new ta;b.setAttribute("position",new mi(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const A=new La(b,S),x=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=B_;let _=this.type;this.render=function(F,I,mt){if(x.enabled===!1||x.autoUpdate===!1&&x.needsUpdate===!1||F.length===0)return;const C=o.getRenderTarget(),U=o.getActiveCubeFace(),ut=o.getActiveMipmapLevel(),lt=o.state;lt.setBlending(Ua),lt.buffers.color.setClear(1,1,1,1),lt.buffers.depth.setTest(!0),lt.setScissorTest(!1);const yt=_!==Ki&&this.type===Ki,X=_===Ki&&this.type!==Ki;for(let $=0,O=F.length;$<O;$++){const q=F[$],j=q.shadow;if(j===void 0){console.warn("THREE.WebGLShadowMap:",q,"has no shadow.");continue}if(j.autoUpdate===!1&&j.needsUpdate===!1)continue;l.copy(j.mapSize);const ct=j.getFrameExtents();if(l.multiply(ct),u.copy(j.mapSize),(l.x>g||l.y>g)&&(l.x>g&&(u.x=Math.floor(g/ct.x),l.x=u.x*ct.x,j.mapSize.x=u.x),l.y>g&&(u.y=Math.floor(g/ct.y),l.y=u.y*ct.y,j.mapSize.y=u.y)),j.map===null||yt===!0||X===!0){const k=this.type!==Ki?{minFilter:zn,magFilter:zn}:{};j.map!==null&&j.map.dispose(),j.map=new hr(l.x,l.y,k),j.map.texture.name=q.name+".shadowMap",j.camera.updateProjectionMatrix()}o.setRenderTarget(j.map),o.clear();const R=j.getViewportCount();for(let k=0;k<R;k++){const Q=j.getViewport(k);h.set(u.x*Q.x,u.y*Q.y,u.x*Q.z,u.y*Q.w),lt.viewport(h),j.updateMatrices(q,k),r=j.getFrustum(),P(I,mt,j.camera,q,this.type)}j.isPointLightShadow!==!0&&this.type===Ki&&N(j,mt),j.needsUpdate=!1}_=this.type,x.needsUpdate=!1,o.setRenderTarget(C,U,ut)};function N(F,I){const mt=e.update(A);S.defines.VSM_SAMPLES!==F.blurSamples&&(S.defines.VSM_SAMPLES=F.blurSamples,y.defines.VSM_SAMPLES=F.blurSamples,S.needsUpdate=!0,y.needsUpdate=!0),F.mapPass===null&&(F.mapPass=new hr(l.x,l.y)),S.uniforms.shadow_pass.value=F.map.texture,S.uniforms.resolution.value=F.mapSize,S.uniforms.radius.value=F.radius,o.setRenderTarget(F.mapPass),o.clear(),o.renderBufferDirect(I,null,mt,S,A,null),y.uniforms.shadow_pass.value=F.mapPass.texture,y.uniforms.resolution.value=F.mapSize,y.uniforms.radius.value=F.radius,o.setRenderTarget(F.map),o.clear(),o.renderBufferDirect(I,null,mt,y,A,null)}function D(F,I,mt,C){let U=null;const ut=mt.isPointLight===!0?F.customDistanceMaterial:F.customDepthMaterial;if(ut!==void 0)U=ut;else if(U=mt.isPointLight===!0?m:d,o.localClippingEnabled&&I.clipShadows===!0&&Array.isArray(I.clippingPlanes)&&I.clippingPlanes.length!==0||I.displacementMap&&I.displacementScale!==0||I.alphaMap&&I.alphaTest>0||I.map&&I.alphaTest>0){const lt=U.uuid,yt=I.uuid;let X=p[lt];X===void 0&&(X={},p[lt]=X);let $=X[yt];$===void 0&&($=U.clone(),X[yt]=$,I.addEventListener("dispose",G)),U=$}if(U.visible=I.visible,U.wireframe=I.wireframe,C===Ki?U.side=I.shadowSide!==null?I.shadowSide:I.side:U.side=I.shadowSide!==null?I.shadowSide:v[I.side],U.alphaMap=I.alphaMap,U.alphaTest=I.alphaTest,U.map=I.map,U.clipShadows=I.clipShadows,U.clippingPlanes=I.clippingPlanes,U.clipIntersection=I.clipIntersection,U.displacementMap=I.displacementMap,U.displacementScale=I.displacementScale,U.displacementBias=I.displacementBias,U.wireframeLinewidth=I.wireframeLinewidth,U.linewidth=I.linewidth,mt.isPointLight===!0&&U.isMeshDistanceMaterial===!0){const lt=o.properties.get(U);lt.light=mt}return U}function P(F,I,mt,C,U){if(F.visible===!1)return;if(F.layers.test(I.layers)&&(F.isMesh||F.isLine||F.isPoints)&&(F.castShadow||F.receiveShadow&&U===Ki)&&(!F.frustumCulled||r.intersectsObject(F))){F.modelViewMatrix.multiplyMatrices(mt.matrixWorldInverse,F.matrixWorld);const yt=e.update(F),X=F.material;if(Array.isArray(X)){const $=yt.groups;for(let O=0,q=$.length;O<q;O++){const j=$[O],ct=X[j.materialIndex];if(ct&&ct.visible){const R=D(F,ct,C,U);F.onBeforeShadow(o,F,I,mt,yt,R,j),o.renderBufferDirect(mt,null,yt,R,F,j),F.onAfterShadow(o,F,I,mt,yt,R,j)}}}else if(X.visible){const $=D(F,X,C,U);F.onBeforeShadow(o,F,I,mt,yt,$,null),o.renderBufferDirect(mt,null,yt,$,F,null),F.onAfterShadow(o,F,I,mt,yt,$,null)}}const lt=F.children;for(let yt=0,X=lt.length;yt<X;yt++)P(lt[yt],I,mt,C,U)}function G(F){F.target.removeEventListener("dispose",G);for(const mt in p){const C=p[mt],U=F.target.uuid;U in C&&(C[U].dispose(),delete C[U])}}}function Cb(o,e,i){const r=i.isWebGL2;function l(){let H=!1;const At=new An;let Ct=null;const Jt=new An(0,0,0,0);return{setMask:function(Zt){Ct!==Zt&&!H&&(o.colorMask(Zt,Zt,Zt,Zt),Ct=Zt)},setLocked:function(Zt){H=Zt},setClear:function(Zt,Ce,ft,Rt,Ot){Ot===!0&&(Zt*=Rt,Ce*=Rt,ft*=Rt),At.set(Zt,Ce,ft,Rt),Jt.equals(At)===!1&&(o.clearColor(Zt,Ce,ft,Rt),Jt.copy(At))},reset:function(){H=!1,Ct=null,Jt.set(-1,0,0,0)}}}function u(){let H=!1,At=null,Ct=null,Jt=null;return{setTest:function(Zt){Zt?jt(o.DEPTH_TEST):Kt(o.DEPTH_TEST)},setMask:function(Zt){At!==Zt&&!H&&(o.depthMask(Zt),At=Zt)},setFunc:function(Zt){if(Ct!==Zt){switch(Zt){case ZS:o.depthFunc(o.NEVER);break;case KS:o.depthFunc(o.ALWAYS);break;case QS:o.depthFunc(o.LESS);break;case hc:o.depthFunc(o.LEQUAL);break;case JS:o.depthFunc(o.EQUAL);break;case $S:o.depthFunc(o.GEQUAL);break;case tx:o.depthFunc(o.GREATER);break;case ex:o.depthFunc(o.NOTEQUAL);break;default:o.depthFunc(o.LEQUAL)}Ct=Zt}},setLocked:function(Zt){H=Zt},setClear:function(Zt){Jt!==Zt&&(o.clearDepth(Zt),Jt=Zt)},reset:function(){H=!1,At=null,Ct=null,Jt=null}}}function h(){let H=!1,At=null,Ct=null,Jt=null,Zt=null,Ce=null,ft=null,Rt=null,Ot=null;return{setTest:function(Et){H||(Et?jt(o.STENCIL_TEST):Kt(o.STENCIL_TEST))},setMask:function(Et){At!==Et&&!H&&(o.stencilMask(Et),At=Et)},setFunc:function(Et,Bt,le){(Ct!==Et||Jt!==Bt||Zt!==le)&&(o.stencilFunc(Et,Bt,le),Ct=Et,Jt=Bt,Zt=le)},setOp:function(Et,Bt,le){(Ce!==Et||ft!==Bt||Rt!==le)&&(o.stencilOp(Et,Bt,le),Ce=Et,ft=Bt,Rt=le)},setLocked:function(Et){H=Et},setClear:function(Et){Ot!==Et&&(o.clearStencil(Et),Ot=Et)},reset:function(){H=!1,At=null,Ct=null,Jt=null,Zt=null,Ce=null,ft=null,Rt=null,Ot=null}}}const d=new l,m=new u,p=new h,g=new WeakMap,v=new WeakMap;let S={},y={},b=new WeakMap,A=[],x=null,_=!1,N=null,D=null,P=null,G=null,F=null,I=null,mt=null,C=new Qt(0,0,0),U=0,ut=!1,lt=null,yt=null,X=null,$=null,O=null;const q=o.getParameter(o.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let j=!1,ct=0;const R=o.getParameter(o.VERSION);R.indexOf("WebGL")!==-1?(ct=parseFloat(/^WebGL (\d)/.exec(R)[1]),j=ct>=1):R.indexOf("OpenGL ES")!==-1&&(ct=parseFloat(/^OpenGL ES (\d)/.exec(R)[1]),j=ct>=2);let k=null,Q={};const B=o.getParameter(o.SCISSOR_BOX),J=o.getParameter(o.VIEWPORT),_t=new An().fromArray(B),pt=new An().fromArray(J);function Lt(H,At,Ct,Jt){const Zt=new Uint8Array(4),Ce=o.createTexture();o.bindTexture(H,Ce),o.texParameteri(H,o.TEXTURE_MIN_FILTER,o.NEAREST),o.texParameteri(H,o.TEXTURE_MAG_FILTER,o.NEAREST);for(let ft=0;ft<Ct;ft++)r&&(H===o.TEXTURE_3D||H===o.TEXTURE_2D_ARRAY)?o.texImage3D(At,0,o.RGBA,1,1,Jt,0,o.RGBA,o.UNSIGNED_BYTE,Zt):o.texImage2D(At+ft,0,o.RGBA,1,1,0,o.RGBA,o.UNSIGNED_BYTE,Zt);return Ce}const Pt={};Pt[o.TEXTURE_2D]=Lt(o.TEXTURE_2D,o.TEXTURE_2D,1),Pt[o.TEXTURE_CUBE_MAP]=Lt(o.TEXTURE_CUBE_MAP,o.TEXTURE_CUBE_MAP_POSITIVE_X,6),r&&(Pt[o.TEXTURE_2D_ARRAY]=Lt(o.TEXTURE_2D_ARRAY,o.TEXTURE_2D_ARRAY,1,1),Pt[o.TEXTURE_3D]=Lt(o.TEXTURE_3D,o.TEXTURE_3D,1,1)),d.setClear(0,0,0,1),m.setClear(1),p.setClear(0),jt(o.DEPTH_TEST),m.setFunc(hc),ue(!1),L(dg),jt(o.CULL_FACE),It(Ua);function jt(H){S[H]!==!0&&(o.enable(H),S[H]=!0)}function Kt(H){S[H]!==!1&&(o.disable(H),S[H]=!1)}function oe(H,At){return y[H]!==At?(o.bindFramebuffer(H,At),y[H]=At,r&&(H===o.DRAW_FRAMEBUFFER&&(y[o.FRAMEBUFFER]=At),H===o.FRAMEBUFFER&&(y[o.DRAW_FRAMEBUFFER]=At)),!0):!1}function tt(H,At){let Ct=A,Jt=!1;if(H)if(Ct=b.get(At),Ct===void 0&&(Ct=[],b.set(At,Ct)),H.isWebGLMultipleRenderTargets){const Zt=H.texture;if(Ct.length!==Zt.length||Ct[0]!==o.COLOR_ATTACHMENT0){for(let Ce=0,ft=Zt.length;Ce<ft;Ce++)Ct[Ce]=o.COLOR_ATTACHMENT0+Ce;Ct.length=Zt.length,Jt=!0}}else Ct[0]!==o.COLOR_ATTACHMENT0&&(Ct[0]=o.COLOR_ATTACHMENT0,Jt=!0);else Ct[0]!==o.BACK&&(Ct[0]=o.BACK,Jt=!0);Jt&&(i.isWebGL2?o.drawBuffers(Ct):e.get("WEBGL_draw_buffers").drawBuffersWEBGL(Ct))}function qe(H){return x!==H?(o.useProgram(H),x=H,!0):!1}const Xt={[or]:o.FUNC_ADD,[OS]:o.FUNC_SUBTRACT,[PS]:o.FUNC_REVERSE_SUBTRACT};if(r)Xt[mg]=o.MIN,Xt[gg]=o.MAX;else{const H=e.get("EXT_blend_minmax");H!==null&&(Xt[mg]=H.MIN_EXT,Xt[gg]=H.MAX_EXT)}const ie={[zS]:o.ZERO,[BS]:o.ONE,[IS]:o.SRC_COLOR,[fd]:o.SRC_ALPHA,[XS]:o.SRC_ALPHA_SATURATE,[VS]:o.DST_COLOR,[HS]:o.DST_ALPHA,[FS]:o.ONE_MINUS_SRC_COLOR,[dd]:o.ONE_MINUS_SRC_ALPHA,[kS]:o.ONE_MINUS_DST_COLOR,[GS]:o.ONE_MINUS_DST_ALPHA,[WS]:o.CONSTANT_COLOR,[qS]:o.ONE_MINUS_CONSTANT_COLOR,[YS]:o.CONSTANT_ALPHA,[jS]:o.ONE_MINUS_CONSTANT_ALPHA};function It(H,At,Ct,Jt,Zt,Ce,ft,Rt,Ot,Et){if(H===Ua){_===!0&&(Kt(o.BLEND),_=!1);return}if(_===!1&&(jt(o.BLEND),_=!0),H!==NS){if(H!==N||Et!==ut){if((D!==or||F!==or)&&(o.blendEquation(o.FUNC_ADD),D=or,F=or),Et)switch(H){case ds:o.blendFuncSeparate(o.ONE,o.ONE_MINUS_SRC_ALPHA,o.ONE,o.ONE_MINUS_SRC_ALPHA);break;case ud:o.blendFunc(o.ONE,o.ONE);break;case hg:o.blendFuncSeparate(o.ZERO,o.ONE_MINUS_SRC_COLOR,o.ZERO,o.ONE);break;case pg:o.blendFuncSeparate(o.ZERO,o.SRC_COLOR,o.ZERO,o.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",H);break}else switch(H){case ds:o.blendFuncSeparate(o.SRC_ALPHA,o.ONE_MINUS_SRC_ALPHA,o.ONE,o.ONE_MINUS_SRC_ALPHA);break;case ud:o.blendFunc(o.SRC_ALPHA,o.ONE);break;case hg:o.blendFuncSeparate(o.ZERO,o.ONE_MINUS_SRC_COLOR,o.ZERO,o.ONE);break;case pg:o.blendFunc(o.ZERO,o.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",H);break}P=null,G=null,I=null,mt=null,C.set(0,0,0),U=0,N=H,ut=Et}return}Zt=Zt||At,Ce=Ce||Ct,ft=ft||Jt,(At!==D||Zt!==F)&&(o.blendEquationSeparate(Xt[At],Xt[Zt]),D=At,F=Zt),(Ct!==P||Jt!==G||Ce!==I||ft!==mt)&&(o.blendFuncSeparate(ie[Ct],ie[Jt],ie[Ce],ie[ft]),P=Ct,G=Jt,I=Ce,mt=ft),(Rt.equals(C)===!1||Ot!==U)&&(o.blendColor(Rt.r,Rt.g,Rt.b,Ot),C.copy(Rt),U=Ot),N=H,ut=!1}function Se(H,At){H.side===Qi?Kt(o.CULL_FACE):jt(o.CULL_FACE);let Ct=H.side===Xn;At&&(Ct=!Ct),ue(Ct),H.blending===ds&&H.transparent===!1?It(Ua):It(H.blending,H.blendEquation,H.blendSrc,H.blendDst,H.blendEquationAlpha,H.blendSrcAlpha,H.blendDstAlpha,H.blendColor,H.blendAlpha,H.premultipliedAlpha),m.setFunc(H.depthFunc),m.setTest(H.depthTest),m.setMask(H.depthWrite),d.setMask(H.colorWrite);const Jt=H.stencilWrite;p.setTest(Jt),Jt&&(p.setMask(H.stencilWriteMask),p.setFunc(H.stencilFunc,H.stencilRef,H.stencilFuncMask),p.setOp(H.stencilFail,H.stencilZFail,H.stencilZPass)),et(H.polygonOffset,H.polygonOffsetFactor,H.polygonOffsetUnits),H.alphaToCoverage===!0?jt(o.SAMPLE_ALPHA_TO_COVERAGE):Kt(o.SAMPLE_ALPHA_TO_COVERAGE)}function ue(H){lt!==H&&(H?o.frontFace(o.CW):o.frontFace(o.CCW),lt=H)}function L(H){H!==DS?(jt(o.CULL_FACE),H!==yt&&(H===dg?o.cullFace(o.BACK):H===LS?o.cullFace(o.FRONT):o.cullFace(o.FRONT_AND_BACK))):Kt(o.CULL_FACE),yt=H}function T(H){H!==X&&(j&&o.lineWidth(H),X=H)}function et(H,At,Ct){H?(jt(o.POLYGON_OFFSET_FILL),($!==At||O!==Ct)&&(o.polygonOffset(At,Ct),$=At,O=Ct)):Kt(o.POLYGON_OFFSET_FILL)}function St(H){H?jt(o.SCISSOR_TEST):Kt(o.SCISSOR_TEST)}function vt(H){H===void 0&&(H=o.TEXTURE0+q-1),k!==H&&(o.activeTexture(H),k=H)}function Mt(H,At,Ct){Ct===void 0&&(k===null?Ct=o.TEXTURE0+q-1:Ct=k);let Jt=Q[Ct];Jt===void 0&&(Jt={type:void 0,texture:void 0},Q[Ct]=Jt),(Jt.type!==H||Jt.texture!==At)&&(k!==Ct&&(o.activeTexture(Ct),k=Ct),o.bindTexture(H,At||Pt[H]),Jt.type=H,Jt.texture=At)}function Ut(){const H=Q[k];H!==void 0&&H.type!==void 0&&(o.bindTexture(H.type,null),H.type=void 0,H.texture=void 0)}function Tt(){try{o.compressedTexImage2D.apply(o,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function Dt(){try{o.compressedTexImage3D.apply(o,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function Gt(){try{o.texSubImage2D.apply(o,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function kt(){try{o.texSubImage3D.apply(o,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function xt(){try{o.compressedTexSubImage2D.apply(o,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function be(){try{o.compressedTexSubImage3D.apply(o,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function he(){try{o.texStorage2D.apply(o,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function ee(){try{o.texStorage3D.apply(o,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function Vt(){try{o.texImage2D.apply(o,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function zt(){try{o.texImage3D.apply(o,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function ae(H){_t.equals(H)===!1&&(o.scissor(H.x,H.y,H.z,H.w),_t.copy(H))}function ye(H){pt.equals(H)===!1&&(o.viewport(H.x,H.y,H.z,H.w),pt.copy(H))}function Ge(H,At){let Ct=v.get(At);Ct===void 0&&(Ct=new WeakMap,v.set(At,Ct));let Jt=Ct.get(H);Jt===void 0&&(Jt=o.getUniformBlockIndex(At,H.name),Ct.set(H,Jt))}function de(H,At){const Jt=v.get(At).get(H);g.get(At)!==Jt&&(o.uniformBlockBinding(At,Jt,H.__bindingPointIndex),g.set(At,Jt))}function bt(){o.disable(o.BLEND),o.disable(o.CULL_FACE),o.disable(o.DEPTH_TEST),o.disable(o.POLYGON_OFFSET_FILL),o.disable(o.SCISSOR_TEST),o.disable(o.STENCIL_TEST),o.disable(o.SAMPLE_ALPHA_TO_COVERAGE),o.blendEquation(o.FUNC_ADD),o.blendFunc(o.ONE,o.ZERO),o.blendFuncSeparate(o.ONE,o.ZERO,o.ONE,o.ZERO),o.blendColor(0,0,0,0),o.colorMask(!0,!0,!0,!0),o.clearColor(0,0,0,0),o.depthMask(!0),o.depthFunc(o.LESS),o.clearDepth(1),o.stencilMask(4294967295),o.stencilFunc(o.ALWAYS,0,4294967295),o.stencilOp(o.KEEP,o.KEEP,o.KEEP),o.clearStencil(0),o.cullFace(o.BACK),o.frontFace(o.CCW),o.polygonOffset(0,0),o.activeTexture(o.TEXTURE0),o.bindFramebuffer(o.FRAMEBUFFER,null),r===!0&&(o.bindFramebuffer(o.DRAW_FRAMEBUFFER,null),o.bindFramebuffer(o.READ_FRAMEBUFFER,null)),o.useProgram(null),o.lineWidth(1),o.scissor(0,0,o.canvas.width,o.canvas.height),o.viewport(0,0,o.canvas.width,o.canvas.height),S={},k=null,Q={},y={},b=new WeakMap,A=[],x=null,_=!1,N=null,D=null,P=null,G=null,F=null,I=null,mt=null,C=new Qt(0,0,0),U=0,ut=!1,lt=null,yt=null,X=null,$=null,O=null,_t.set(0,0,o.canvas.width,o.canvas.height),pt.set(0,0,o.canvas.width,o.canvas.height),d.reset(),m.reset(),p.reset()}return{buffers:{color:d,depth:m,stencil:p},enable:jt,disable:Kt,bindFramebuffer:oe,drawBuffers:tt,useProgram:qe,setBlending:It,setMaterial:Se,setFlipSided:ue,setCullFace:L,setLineWidth:T,setPolygonOffset:et,setScissorTest:St,activeTexture:vt,bindTexture:Mt,unbindTexture:Ut,compressedTexImage2D:Tt,compressedTexImage3D:Dt,texImage2D:Vt,texImage3D:zt,updateUBOMapping:Ge,uniformBlockBinding:de,texStorage2D:he,texStorage3D:ee,texSubImage2D:Gt,texSubImage3D:kt,compressedTexSubImage2D:xt,compressedTexSubImage3D:be,scissor:ae,viewport:ye,reset:bt}}function Db(o,e,i,r,l,u,h){const d=l.isWebGL2,m=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,p=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),g=new WeakMap;let v;const S=new WeakMap;let y=!1;try{y=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function b(L,T){return y?new OffscreenCanvas(L,T):vc("canvas")}function A(L,T,et,St){let vt=1;if((L.width>St||L.height>St)&&(vt=St/Math.max(L.width,L.height)),vt<1||T===!0)if(typeof HTMLImageElement<"u"&&L instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&L instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&L instanceof ImageBitmap){const Mt=T?Sd:Math.floor,Ut=Mt(vt*L.width),Tt=Mt(vt*L.height);v===void 0&&(v=b(Ut,Tt));const Dt=et?b(Ut,Tt):v;return Dt.width=Ut,Dt.height=Tt,Dt.getContext("2d").drawImage(L,0,0,Ut,Tt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+L.width+"x"+L.height+") to ("+Ut+"x"+Tt+")."),Dt}else return"data"in L&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+L.width+"x"+L.height+")."),L;return L}function x(L){return qg(L.width)&&qg(L.height)}function _(L){return d?!1:L.wrapS!==Ei||L.wrapT!==Ei||L.minFilter!==zn&&L.minFilter!==di}function N(L,T){return L.generateMipmaps&&T&&L.minFilter!==zn&&L.minFilter!==di}function D(L){o.generateMipmap(L)}function P(L,T,et,St,vt=!1){if(d===!1)return T;if(L!==null){if(o[L]!==void 0)return o[L];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+L+"'")}let Mt=T;if(T===o.RED&&(et===o.FLOAT&&(Mt=o.R32F),et===o.HALF_FLOAT&&(Mt=o.R16F),et===o.UNSIGNED_BYTE&&(Mt=o.R8)),T===o.RED_INTEGER&&(et===o.UNSIGNED_BYTE&&(Mt=o.R8UI),et===o.UNSIGNED_SHORT&&(Mt=o.R16UI),et===o.UNSIGNED_INT&&(Mt=o.R32UI),et===o.BYTE&&(Mt=o.R8I),et===o.SHORT&&(Mt=o.R16I),et===o.INT&&(Mt=o.R32I)),T===o.RG&&(et===o.FLOAT&&(Mt=o.RG32F),et===o.HALF_FLOAT&&(Mt=o.RG16F),et===o.UNSIGNED_BYTE&&(Mt=o.RG8)),T===o.RGBA){const Ut=vt?pc:Fe.getTransfer(St);et===o.FLOAT&&(Mt=o.RGBA32F),et===o.HALF_FLOAT&&(Mt=o.RGBA16F),et===o.UNSIGNED_BYTE&&(Mt=Ut===Ze?o.SRGB8_ALPHA8:o.RGBA8),et===o.UNSIGNED_SHORT_4_4_4_4&&(Mt=o.RGBA4),et===o.UNSIGNED_SHORT_5_5_5_1&&(Mt=o.RGB5_A1)}return(Mt===o.R16F||Mt===o.R32F||Mt===o.RG16F||Mt===o.RG32F||Mt===o.RGBA16F||Mt===o.RGBA32F)&&e.get("EXT_color_buffer_float"),Mt}function G(L,T,et){return N(L,et)===!0||L.isFramebufferTexture&&L.minFilter!==zn&&L.minFilter!==di?Math.log2(Math.max(T.width,T.height))+1:L.mipmaps!==void 0&&L.mipmaps.length>0?L.mipmaps.length:L.isCompressedTexture&&Array.isArray(L.image)?T.mipmaps.length:1}function F(L){return L===zn||L===_g||L===Uf?o.NEAREST:o.LINEAR}function I(L){const T=L.target;T.removeEventListener("dispose",I),C(T),T.isVideoTexture&&g.delete(T)}function mt(L){const T=L.target;T.removeEventListener("dispose",mt),ut(T)}function C(L){const T=r.get(L);if(T.__webglInit===void 0)return;const et=L.source,St=S.get(et);if(St){const vt=St[T.__cacheKey];vt.usedTimes--,vt.usedTimes===0&&U(L),Object.keys(St).length===0&&S.delete(et)}r.remove(L)}function U(L){const T=r.get(L);o.deleteTexture(T.__webglTexture);const et=L.source,St=S.get(et);delete St[T.__cacheKey],h.memory.textures--}function ut(L){const T=L.texture,et=r.get(L),St=r.get(T);if(St.__webglTexture!==void 0&&(o.deleteTexture(St.__webglTexture),h.memory.textures--),L.depthTexture&&L.depthTexture.dispose(),L.isWebGLCubeRenderTarget)for(let vt=0;vt<6;vt++){if(Array.isArray(et.__webglFramebuffer[vt]))for(let Mt=0;Mt<et.__webglFramebuffer[vt].length;Mt++)o.deleteFramebuffer(et.__webglFramebuffer[vt][Mt]);else o.deleteFramebuffer(et.__webglFramebuffer[vt]);et.__webglDepthbuffer&&o.deleteRenderbuffer(et.__webglDepthbuffer[vt])}else{if(Array.isArray(et.__webglFramebuffer))for(let vt=0;vt<et.__webglFramebuffer.length;vt++)o.deleteFramebuffer(et.__webglFramebuffer[vt]);else o.deleteFramebuffer(et.__webglFramebuffer);if(et.__webglDepthbuffer&&o.deleteRenderbuffer(et.__webglDepthbuffer),et.__webglMultisampledFramebuffer&&o.deleteFramebuffer(et.__webglMultisampledFramebuffer),et.__webglColorRenderbuffer)for(let vt=0;vt<et.__webglColorRenderbuffer.length;vt++)et.__webglColorRenderbuffer[vt]&&o.deleteRenderbuffer(et.__webglColorRenderbuffer[vt]);et.__webglDepthRenderbuffer&&o.deleteRenderbuffer(et.__webglDepthRenderbuffer)}if(L.isWebGLMultipleRenderTargets)for(let vt=0,Mt=T.length;vt<Mt;vt++){const Ut=r.get(T[vt]);Ut.__webglTexture&&(o.deleteTexture(Ut.__webglTexture),h.memory.textures--),r.remove(T[vt])}r.remove(T),r.remove(L)}let lt=0;function yt(){lt=0}function X(){const L=lt;return L>=l.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+L+" texture units while this GPU supports only "+l.maxTextures),lt+=1,L}function $(L){const T=[];return T.push(L.wrapS),T.push(L.wrapT),T.push(L.wrapR||0),T.push(L.magFilter),T.push(L.minFilter),T.push(L.anisotropy),T.push(L.internalFormat),T.push(L.format),T.push(L.type),T.push(L.generateMipmaps),T.push(L.premultiplyAlpha),T.push(L.flipY),T.push(L.unpackAlignment),T.push(L.colorSpace),T.join()}function O(L,T){const et=r.get(L);if(L.isVideoTexture&&Se(L),L.isRenderTargetTexture===!1&&L.version>0&&et.__version!==L.version){const St=L.image;if(St===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(St.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{_t(et,L,T);return}}i.bindTexture(o.TEXTURE_2D,et.__webglTexture,o.TEXTURE0+T)}function q(L,T){const et=r.get(L);if(L.version>0&&et.__version!==L.version){_t(et,L,T);return}i.bindTexture(o.TEXTURE_2D_ARRAY,et.__webglTexture,o.TEXTURE0+T)}function j(L,T){const et=r.get(L);if(L.version>0&&et.__version!==L.version){_t(et,L,T);return}i.bindTexture(o.TEXTURE_3D,et.__webglTexture,o.TEXTURE0+T)}function ct(L,T){const et=r.get(L);if(L.version>0&&et.__version!==L.version){pt(et,L,T);return}i.bindTexture(o.TEXTURE_CUBE_MAP,et.__webglTexture,o.TEXTURE0+T)}const R={[md]:o.REPEAT,[Ei]:o.CLAMP_TO_EDGE,[gd]:o.MIRRORED_REPEAT},k={[zn]:o.NEAREST,[_g]:o.NEAREST_MIPMAP_NEAREST,[Uf]:o.NEAREST_MIPMAP_LINEAR,[di]:o.LINEAR,[ux]:o.LINEAR_MIPMAP_NEAREST,[Ao]:o.LINEAR_MIPMAP_LINEAR},Q={[Ex]:o.NEVER,[Cx]:o.ALWAYS,[Tx]:o.LESS,[j_]:o.LEQUAL,[bx]:o.EQUAL,[wx]:o.GEQUAL,[Ax]:o.GREATER,[Rx]:o.NOTEQUAL};function B(L,T,et){if(et?(o.texParameteri(L,o.TEXTURE_WRAP_S,R[T.wrapS]),o.texParameteri(L,o.TEXTURE_WRAP_T,R[T.wrapT]),(L===o.TEXTURE_3D||L===o.TEXTURE_2D_ARRAY)&&o.texParameteri(L,o.TEXTURE_WRAP_R,R[T.wrapR]),o.texParameteri(L,o.TEXTURE_MAG_FILTER,k[T.magFilter]),o.texParameteri(L,o.TEXTURE_MIN_FILTER,k[T.minFilter])):(o.texParameteri(L,o.TEXTURE_WRAP_S,o.CLAMP_TO_EDGE),o.texParameteri(L,o.TEXTURE_WRAP_T,o.CLAMP_TO_EDGE),(L===o.TEXTURE_3D||L===o.TEXTURE_2D_ARRAY)&&o.texParameteri(L,o.TEXTURE_WRAP_R,o.CLAMP_TO_EDGE),(T.wrapS!==Ei||T.wrapT!==Ei)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),o.texParameteri(L,o.TEXTURE_MAG_FILTER,F(T.magFilter)),o.texParameteri(L,o.TEXTURE_MIN_FILTER,F(T.minFilter)),T.minFilter!==zn&&T.minFilter!==di&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),T.compareFunction&&(o.texParameteri(L,o.TEXTURE_COMPARE_MODE,o.COMPARE_REF_TO_TEXTURE),o.texParameteri(L,o.TEXTURE_COMPARE_FUNC,Q[T.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){const St=e.get("EXT_texture_filter_anisotropic");if(T.magFilter===zn||T.minFilter!==Uf&&T.minFilter!==Ao||T.type===Da&&e.has("OES_texture_float_linear")===!1||d===!1&&T.type===Ro&&e.has("OES_texture_half_float_linear")===!1)return;(T.anisotropy>1||r.get(T).__currentAnisotropy)&&(o.texParameterf(L,St.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(T.anisotropy,l.getMaxAnisotropy())),r.get(T).__currentAnisotropy=T.anisotropy)}}function J(L,T){let et=!1;L.__webglInit===void 0&&(L.__webglInit=!0,T.addEventListener("dispose",I));const St=T.source;let vt=S.get(St);vt===void 0&&(vt={},S.set(St,vt));const Mt=$(T);if(Mt!==L.__cacheKey){vt[Mt]===void 0&&(vt[Mt]={texture:o.createTexture(),usedTimes:0},h.memory.textures++,et=!0),vt[Mt].usedTimes++;const Ut=vt[L.__cacheKey];Ut!==void 0&&(vt[L.__cacheKey].usedTimes--,Ut.usedTimes===0&&U(T)),L.__cacheKey=Mt,L.__webglTexture=vt[Mt].texture}return et}function _t(L,T,et){let St=o.TEXTURE_2D;(T.isDataArrayTexture||T.isCompressedArrayTexture)&&(St=o.TEXTURE_2D_ARRAY),T.isData3DTexture&&(St=o.TEXTURE_3D);const vt=J(L,T),Mt=T.source;i.bindTexture(St,L.__webglTexture,o.TEXTURE0+et);const Ut=r.get(Mt);if(Mt.version!==Ut.__version||vt===!0){i.activeTexture(o.TEXTURE0+et);const Tt=Fe.getPrimaries(Fe.workingColorSpace),Dt=T.colorSpace===pi?null:Fe.getPrimaries(T.colorSpace),Gt=T.colorSpace===pi||Tt===Dt?o.NONE:o.BROWSER_DEFAULT_WEBGL;o.pixelStorei(o.UNPACK_FLIP_Y_WEBGL,T.flipY),o.pixelStorei(o.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),o.pixelStorei(o.UNPACK_ALIGNMENT,T.unpackAlignment),o.pixelStorei(o.UNPACK_COLORSPACE_CONVERSION_WEBGL,Gt);const kt=_(T)&&x(T.image)===!1;let xt=A(T.image,kt,!1,l.maxTextureSize);xt=ue(T,xt);const be=x(xt)||d,he=u.convert(T.format,T.colorSpace);let ee=u.convert(T.type),Vt=P(T.internalFormat,he,ee,T.colorSpace,T.isVideoTexture);B(St,T,be);let zt;const ae=T.mipmaps,ye=d&&T.isVideoTexture!==!0&&Vt!==q_,Ge=Ut.__version===void 0||vt===!0,de=G(T,xt,be);if(T.isDepthTexture)Vt=o.DEPTH_COMPONENT,d?T.type===Da?Vt=o.DEPTH_COMPONENT32F:T.type===Ca?Vt=o.DEPTH_COMPONENT24:T.type===cr?Vt=o.DEPTH24_STENCIL8:Vt=o.DEPTH_COMPONENT16:T.type===Da&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),T.format===ur&&Vt===o.DEPTH_COMPONENT&&T.type!==Td&&T.type!==Ca&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),T.type=Ca,ee=u.convert(T.type)),T.format===gs&&Vt===o.DEPTH_COMPONENT&&(Vt=o.DEPTH_STENCIL,T.type!==cr&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),T.type=cr,ee=u.convert(T.type))),Ge&&(ye?i.texStorage2D(o.TEXTURE_2D,1,Vt,xt.width,xt.height):i.texImage2D(o.TEXTURE_2D,0,Vt,xt.width,xt.height,0,he,ee,null));else if(T.isDataTexture)if(ae.length>0&&be){ye&&Ge&&i.texStorage2D(o.TEXTURE_2D,de,Vt,ae[0].width,ae[0].height);for(let bt=0,H=ae.length;bt<H;bt++)zt=ae[bt],ye?i.texSubImage2D(o.TEXTURE_2D,bt,0,0,zt.width,zt.height,he,ee,zt.data):i.texImage2D(o.TEXTURE_2D,bt,Vt,zt.width,zt.height,0,he,ee,zt.data);T.generateMipmaps=!1}else ye?(Ge&&i.texStorage2D(o.TEXTURE_2D,de,Vt,xt.width,xt.height),i.texSubImage2D(o.TEXTURE_2D,0,0,0,xt.width,xt.height,he,ee,xt.data)):i.texImage2D(o.TEXTURE_2D,0,Vt,xt.width,xt.height,0,he,ee,xt.data);else if(T.isCompressedTexture)if(T.isCompressedArrayTexture){ye&&Ge&&i.texStorage3D(o.TEXTURE_2D_ARRAY,de,Vt,ae[0].width,ae[0].height,xt.depth);for(let bt=0,H=ae.length;bt<H;bt++)zt=ae[bt],T.format!==Ti?he!==null?ye?i.compressedTexSubImage3D(o.TEXTURE_2D_ARRAY,bt,0,0,0,zt.width,zt.height,xt.depth,he,zt.data,0,0):i.compressedTexImage3D(o.TEXTURE_2D_ARRAY,bt,Vt,zt.width,zt.height,xt.depth,0,zt.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ye?i.texSubImage3D(o.TEXTURE_2D_ARRAY,bt,0,0,0,zt.width,zt.height,xt.depth,he,ee,zt.data):i.texImage3D(o.TEXTURE_2D_ARRAY,bt,Vt,zt.width,zt.height,xt.depth,0,he,ee,zt.data)}else{ye&&Ge&&i.texStorage2D(o.TEXTURE_2D,de,Vt,ae[0].width,ae[0].height);for(let bt=0,H=ae.length;bt<H;bt++)zt=ae[bt],T.format!==Ti?he!==null?ye?i.compressedTexSubImage2D(o.TEXTURE_2D,bt,0,0,zt.width,zt.height,he,zt.data):i.compressedTexImage2D(o.TEXTURE_2D,bt,Vt,zt.width,zt.height,0,zt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ye?i.texSubImage2D(o.TEXTURE_2D,bt,0,0,zt.width,zt.height,he,ee,zt.data):i.texImage2D(o.TEXTURE_2D,bt,Vt,zt.width,zt.height,0,he,ee,zt.data)}else if(T.isDataArrayTexture)ye?(Ge&&i.texStorage3D(o.TEXTURE_2D_ARRAY,de,Vt,xt.width,xt.height,xt.depth),i.texSubImage3D(o.TEXTURE_2D_ARRAY,0,0,0,0,xt.width,xt.height,xt.depth,he,ee,xt.data)):i.texImage3D(o.TEXTURE_2D_ARRAY,0,Vt,xt.width,xt.height,xt.depth,0,he,ee,xt.data);else if(T.isData3DTexture)ye?(Ge&&i.texStorage3D(o.TEXTURE_3D,de,Vt,xt.width,xt.height,xt.depth),i.texSubImage3D(o.TEXTURE_3D,0,0,0,0,xt.width,xt.height,xt.depth,he,ee,xt.data)):i.texImage3D(o.TEXTURE_3D,0,Vt,xt.width,xt.height,xt.depth,0,he,ee,xt.data);else if(T.isFramebufferTexture){if(Ge)if(ye)i.texStorage2D(o.TEXTURE_2D,de,Vt,xt.width,xt.height);else{let bt=xt.width,H=xt.height;for(let At=0;At<de;At++)i.texImage2D(o.TEXTURE_2D,At,Vt,bt,H,0,he,ee,null),bt>>=1,H>>=1}}else if(ae.length>0&&be){ye&&Ge&&i.texStorage2D(o.TEXTURE_2D,de,Vt,ae[0].width,ae[0].height);for(let bt=0,H=ae.length;bt<H;bt++)zt=ae[bt],ye?i.texSubImage2D(o.TEXTURE_2D,bt,0,0,he,ee,zt):i.texImage2D(o.TEXTURE_2D,bt,Vt,he,ee,zt);T.generateMipmaps=!1}else ye?(Ge&&i.texStorage2D(o.TEXTURE_2D,de,Vt,xt.width,xt.height),i.texSubImage2D(o.TEXTURE_2D,0,0,0,he,ee,xt)):i.texImage2D(o.TEXTURE_2D,0,Vt,he,ee,xt);N(T,be)&&D(St),Ut.__version=Mt.version,T.onUpdate&&T.onUpdate(T)}L.__version=T.version}function pt(L,T,et){if(T.image.length!==6)return;const St=J(L,T),vt=T.source;i.bindTexture(o.TEXTURE_CUBE_MAP,L.__webglTexture,o.TEXTURE0+et);const Mt=r.get(vt);if(vt.version!==Mt.__version||St===!0){i.activeTexture(o.TEXTURE0+et);const Ut=Fe.getPrimaries(Fe.workingColorSpace),Tt=T.colorSpace===pi?null:Fe.getPrimaries(T.colorSpace),Dt=T.colorSpace===pi||Ut===Tt?o.NONE:o.BROWSER_DEFAULT_WEBGL;o.pixelStorei(o.UNPACK_FLIP_Y_WEBGL,T.flipY),o.pixelStorei(o.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),o.pixelStorei(o.UNPACK_ALIGNMENT,T.unpackAlignment),o.pixelStorei(o.UNPACK_COLORSPACE_CONVERSION_WEBGL,Dt);const Gt=T.isCompressedTexture||T.image[0].isCompressedTexture,kt=T.image[0]&&T.image[0].isDataTexture,xt=[];for(let bt=0;bt<6;bt++)!Gt&&!kt?xt[bt]=A(T.image[bt],!1,!0,l.maxCubemapSize):xt[bt]=kt?T.image[bt].image:T.image[bt],xt[bt]=ue(T,xt[bt]);const be=xt[0],he=x(be)||d,ee=u.convert(T.format,T.colorSpace),Vt=u.convert(T.type),zt=P(T.internalFormat,ee,Vt,T.colorSpace),ae=d&&T.isVideoTexture!==!0,ye=Mt.__version===void 0||St===!0;let Ge=G(T,be,he);B(o.TEXTURE_CUBE_MAP,T,he);let de;if(Gt){ae&&ye&&i.texStorage2D(o.TEXTURE_CUBE_MAP,Ge,zt,be.width,be.height);for(let bt=0;bt<6;bt++){de=xt[bt].mipmaps;for(let H=0;H<de.length;H++){const At=de[H];T.format!==Ti?ee!==null?ae?i.compressedTexSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+bt,H,0,0,At.width,At.height,ee,At.data):i.compressedTexImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+bt,H,zt,At.width,At.height,0,At.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):ae?i.texSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+bt,H,0,0,At.width,At.height,ee,Vt,At.data):i.texImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+bt,H,zt,At.width,At.height,0,ee,Vt,At.data)}}}else{de=T.mipmaps,ae&&ye&&(de.length>0&&Ge++,i.texStorage2D(o.TEXTURE_CUBE_MAP,Ge,zt,xt[0].width,xt[0].height));for(let bt=0;bt<6;bt++)if(kt){ae?i.texSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+bt,0,0,0,xt[bt].width,xt[bt].height,ee,Vt,xt[bt].data):i.texImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+bt,0,zt,xt[bt].width,xt[bt].height,0,ee,Vt,xt[bt].data);for(let H=0;H<de.length;H++){const Ct=de[H].image[bt].image;ae?i.texSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+bt,H+1,0,0,Ct.width,Ct.height,ee,Vt,Ct.data):i.texImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+bt,H+1,zt,Ct.width,Ct.height,0,ee,Vt,Ct.data)}}else{ae?i.texSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+bt,0,0,0,ee,Vt,xt[bt]):i.texImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+bt,0,zt,ee,Vt,xt[bt]);for(let H=0;H<de.length;H++){const At=de[H];ae?i.texSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+bt,H+1,0,0,ee,Vt,At.image[bt]):i.texImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+bt,H+1,zt,ee,Vt,At.image[bt])}}}N(T,he)&&D(o.TEXTURE_CUBE_MAP),Mt.__version=vt.version,T.onUpdate&&T.onUpdate(T)}L.__version=T.version}function Lt(L,T,et,St,vt,Mt){const Ut=u.convert(et.format,et.colorSpace),Tt=u.convert(et.type),Dt=P(et.internalFormat,Ut,Tt,et.colorSpace);if(!r.get(T).__hasExternalTextures){const kt=Math.max(1,T.width>>Mt),xt=Math.max(1,T.height>>Mt);vt===o.TEXTURE_3D||vt===o.TEXTURE_2D_ARRAY?i.texImage3D(vt,Mt,Dt,kt,xt,T.depth,0,Ut,Tt,null):i.texImage2D(vt,Mt,Dt,kt,xt,0,Ut,Tt,null)}i.bindFramebuffer(o.FRAMEBUFFER,L),It(T)?m.framebufferTexture2DMultisampleEXT(o.FRAMEBUFFER,St,vt,r.get(et).__webglTexture,0,ie(T)):(vt===o.TEXTURE_2D||vt>=o.TEXTURE_CUBE_MAP_POSITIVE_X&&vt<=o.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&o.framebufferTexture2D(o.FRAMEBUFFER,St,vt,r.get(et).__webglTexture,Mt),i.bindFramebuffer(o.FRAMEBUFFER,null)}function Pt(L,T,et){if(o.bindRenderbuffer(o.RENDERBUFFER,L),T.depthBuffer&&!T.stencilBuffer){let St=d===!0?o.DEPTH_COMPONENT24:o.DEPTH_COMPONENT16;if(et||It(T)){const vt=T.depthTexture;vt&&vt.isDepthTexture&&(vt.type===Da?St=o.DEPTH_COMPONENT32F:vt.type===Ca&&(St=o.DEPTH_COMPONENT24));const Mt=ie(T);It(T)?m.renderbufferStorageMultisampleEXT(o.RENDERBUFFER,Mt,St,T.width,T.height):o.renderbufferStorageMultisample(o.RENDERBUFFER,Mt,St,T.width,T.height)}else o.renderbufferStorage(o.RENDERBUFFER,St,T.width,T.height);o.framebufferRenderbuffer(o.FRAMEBUFFER,o.DEPTH_ATTACHMENT,o.RENDERBUFFER,L)}else if(T.depthBuffer&&T.stencilBuffer){const St=ie(T);et&&It(T)===!1?o.renderbufferStorageMultisample(o.RENDERBUFFER,St,o.DEPTH24_STENCIL8,T.width,T.height):It(T)?m.renderbufferStorageMultisampleEXT(o.RENDERBUFFER,St,o.DEPTH24_STENCIL8,T.width,T.height):o.renderbufferStorage(o.RENDERBUFFER,o.DEPTH_STENCIL,T.width,T.height),o.framebufferRenderbuffer(o.FRAMEBUFFER,o.DEPTH_STENCIL_ATTACHMENT,o.RENDERBUFFER,L)}else{const St=T.isWebGLMultipleRenderTargets===!0?T.texture:[T.texture];for(let vt=0;vt<St.length;vt++){const Mt=St[vt],Ut=u.convert(Mt.format,Mt.colorSpace),Tt=u.convert(Mt.type),Dt=P(Mt.internalFormat,Ut,Tt,Mt.colorSpace),Gt=ie(T);et&&It(T)===!1?o.renderbufferStorageMultisample(o.RENDERBUFFER,Gt,Dt,T.width,T.height):It(T)?m.renderbufferStorageMultisampleEXT(o.RENDERBUFFER,Gt,Dt,T.width,T.height):o.renderbufferStorage(o.RENDERBUFFER,Dt,T.width,T.height)}}o.bindRenderbuffer(o.RENDERBUFFER,null)}function jt(L,T){if(T&&T.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(i.bindFramebuffer(o.FRAMEBUFFER,L),!(T.depthTexture&&T.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!r.get(T.depthTexture).__webglTexture||T.depthTexture.image.width!==T.width||T.depthTexture.image.height!==T.height)&&(T.depthTexture.image.width=T.width,T.depthTexture.image.height=T.height,T.depthTexture.needsUpdate=!0),O(T.depthTexture,0);const St=r.get(T.depthTexture).__webglTexture,vt=ie(T);if(T.depthTexture.format===ur)It(T)?m.framebufferTexture2DMultisampleEXT(o.FRAMEBUFFER,o.DEPTH_ATTACHMENT,o.TEXTURE_2D,St,0,vt):o.framebufferTexture2D(o.FRAMEBUFFER,o.DEPTH_ATTACHMENT,o.TEXTURE_2D,St,0);else if(T.depthTexture.format===gs)It(T)?m.framebufferTexture2DMultisampleEXT(o.FRAMEBUFFER,o.DEPTH_STENCIL_ATTACHMENT,o.TEXTURE_2D,St,0,vt):o.framebufferTexture2D(o.FRAMEBUFFER,o.DEPTH_STENCIL_ATTACHMENT,o.TEXTURE_2D,St,0);else throw new Error("Unknown depthTexture format")}function Kt(L){const T=r.get(L),et=L.isWebGLCubeRenderTarget===!0;if(L.depthTexture&&!T.__autoAllocateDepthBuffer){if(et)throw new Error("target.depthTexture not supported in Cube render targets");jt(T.__webglFramebuffer,L)}else if(et){T.__webglDepthbuffer=[];for(let St=0;St<6;St++)i.bindFramebuffer(o.FRAMEBUFFER,T.__webglFramebuffer[St]),T.__webglDepthbuffer[St]=o.createRenderbuffer(),Pt(T.__webglDepthbuffer[St],L,!1)}else i.bindFramebuffer(o.FRAMEBUFFER,T.__webglFramebuffer),T.__webglDepthbuffer=o.createRenderbuffer(),Pt(T.__webglDepthbuffer,L,!1);i.bindFramebuffer(o.FRAMEBUFFER,null)}function oe(L,T,et){const St=r.get(L);T!==void 0&&Lt(St.__webglFramebuffer,L,L.texture,o.COLOR_ATTACHMENT0,o.TEXTURE_2D,0),et!==void 0&&Kt(L)}function tt(L){const T=L.texture,et=r.get(L),St=r.get(T);L.addEventListener("dispose",mt),L.isWebGLMultipleRenderTargets!==!0&&(St.__webglTexture===void 0&&(St.__webglTexture=o.createTexture()),St.__version=T.version,h.memory.textures++);const vt=L.isWebGLCubeRenderTarget===!0,Mt=L.isWebGLMultipleRenderTargets===!0,Ut=x(L)||d;if(vt){et.__webglFramebuffer=[];for(let Tt=0;Tt<6;Tt++)if(d&&T.mipmaps&&T.mipmaps.length>0){et.__webglFramebuffer[Tt]=[];for(let Dt=0;Dt<T.mipmaps.length;Dt++)et.__webglFramebuffer[Tt][Dt]=o.createFramebuffer()}else et.__webglFramebuffer[Tt]=o.createFramebuffer()}else{if(d&&T.mipmaps&&T.mipmaps.length>0){et.__webglFramebuffer=[];for(let Tt=0;Tt<T.mipmaps.length;Tt++)et.__webglFramebuffer[Tt]=o.createFramebuffer()}else et.__webglFramebuffer=o.createFramebuffer();if(Mt)if(l.drawBuffers){const Tt=L.texture;for(let Dt=0,Gt=Tt.length;Dt<Gt;Dt++){const kt=r.get(Tt[Dt]);kt.__webglTexture===void 0&&(kt.__webglTexture=o.createTexture(),h.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(d&&L.samples>0&&It(L)===!1){const Tt=Mt?T:[T];et.__webglMultisampledFramebuffer=o.createFramebuffer(),et.__webglColorRenderbuffer=[],i.bindFramebuffer(o.FRAMEBUFFER,et.__webglMultisampledFramebuffer);for(let Dt=0;Dt<Tt.length;Dt++){const Gt=Tt[Dt];et.__webglColorRenderbuffer[Dt]=o.createRenderbuffer(),o.bindRenderbuffer(o.RENDERBUFFER,et.__webglColorRenderbuffer[Dt]);const kt=u.convert(Gt.format,Gt.colorSpace),xt=u.convert(Gt.type),be=P(Gt.internalFormat,kt,xt,Gt.colorSpace,L.isXRRenderTarget===!0),he=ie(L);o.renderbufferStorageMultisample(o.RENDERBUFFER,he,be,L.width,L.height),o.framebufferRenderbuffer(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0+Dt,o.RENDERBUFFER,et.__webglColorRenderbuffer[Dt])}o.bindRenderbuffer(o.RENDERBUFFER,null),L.depthBuffer&&(et.__webglDepthRenderbuffer=o.createRenderbuffer(),Pt(et.__webglDepthRenderbuffer,L,!0)),i.bindFramebuffer(o.FRAMEBUFFER,null)}}if(vt){i.bindTexture(o.TEXTURE_CUBE_MAP,St.__webglTexture),B(o.TEXTURE_CUBE_MAP,T,Ut);for(let Tt=0;Tt<6;Tt++)if(d&&T.mipmaps&&T.mipmaps.length>0)for(let Dt=0;Dt<T.mipmaps.length;Dt++)Lt(et.__webglFramebuffer[Tt][Dt],L,T,o.COLOR_ATTACHMENT0,o.TEXTURE_CUBE_MAP_POSITIVE_X+Tt,Dt);else Lt(et.__webglFramebuffer[Tt],L,T,o.COLOR_ATTACHMENT0,o.TEXTURE_CUBE_MAP_POSITIVE_X+Tt,0);N(T,Ut)&&D(o.TEXTURE_CUBE_MAP),i.unbindTexture()}else if(Mt){const Tt=L.texture;for(let Dt=0,Gt=Tt.length;Dt<Gt;Dt++){const kt=Tt[Dt],xt=r.get(kt);i.bindTexture(o.TEXTURE_2D,xt.__webglTexture),B(o.TEXTURE_2D,kt,Ut),Lt(et.__webglFramebuffer,L,kt,o.COLOR_ATTACHMENT0+Dt,o.TEXTURE_2D,0),N(kt,Ut)&&D(o.TEXTURE_2D)}i.unbindTexture()}else{let Tt=o.TEXTURE_2D;if((L.isWebGL3DRenderTarget||L.isWebGLArrayRenderTarget)&&(d?Tt=L.isWebGL3DRenderTarget?o.TEXTURE_3D:o.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),i.bindTexture(Tt,St.__webglTexture),B(Tt,T,Ut),d&&T.mipmaps&&T.mipmaps.length>0)for(let Dt=0;Dt<T.mipmaps.length;Dt++)Lt(et.__webglFramebuffer[Dt],L,T,o.COLOR_ATTACHMENT0,Tt,Dt);else Lt(et.__webglFramebuffer,L,T,o.COLOR_ATTACHMENT0,Tt,0);N(T,Ut)&&D(Tt),i.unbindTexture()}L.depthBuffer&&Kt(L)}function qe(L){const T=x(L)||d,et=L.isWebGLMultipleRenderTargets===!0?L.texture:[L.texture];for(let St=0,vt=et.length;St<vt;St++){const Mt=et[St];if(N(Mt,T)){const Ut=L.isWebGLCubeRenderTarget?o.TEXTURE_CUBE_MAP:o.TEXTURE_2D,Tt=r.get(Mt).__webglTexture;i.bindTexture(Ut,Tt),D(Ut),i.unbindTexture()}}}function Xt(L){if(d&&L.samples>0&&It(L)===!1){const T=L.isWebGLMultipleRenderTargets?L.texture:[L.texture],et=L.width,St=L.height;let vt=o.COLOR_BUFFER_BIT;const Mt=[],Ut=L.stencilBuffer?o.DEPTH_STENCIL_ATTACHMENT:o.DEPTH_ATTACHMENT,Tt=r.get(L),Dt=L.isWebGLMultipleRenderTargets===!0;if(Dt)for(let Gt=0;Gt<T.length;Gt++)i.bindFramebuffer(o.FRAMEBUFFER,Tt.__webglMultisampledFramebuffer),o.framebufferRenderbuffer(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0+Gt,o.RENDERBUFFER,null),i.bindFramebuffer(o.FRAMEBUFFER,Tt.__webglFramebuffer),o.framebufferTexture2D(o.DRAW_FRAMEBUFFER,o.COLOR_ATTACHMENT0+Gt,o.TEXTURE_2D,null,0);i.bindFramebuffer(o.READ_FRAMEBUFFER,Tt.__webglMultisampledFramebuffer),i.bindFramebuffer(o.DRAW_FRAMEBUFFER,Tt.__webglFramebuffer);for(let Gt=0;Gt<T.length;Gt++){Mt.push(o.COLOR_ATTACHMENT0+Gt),L.depthBuffer&&Mt.push(Ut);const kt=Tt.__ignoreDepthValues!==void 0?Tt.__ignoreDepthValues:!1;if(kt===!1&&(L.depthBuffer&&(vt|=o.DEPTH_BUFFER_BIT),L.stencilBuffer&&(vt|=o.STENCIL_BUFFER_BIT)),Dt&&o.framebufferRenderbuffer(o.READ_FRAMEBUFFER,o.COLOR_ATTACHMENT0,o.RENDERBUFFER,Tt.__webglColorRenderbuffer[Gt]),kt===!0&&(o.invalidateFramebuffer(o.READ_FRAMEBUFFER,[Ut]),o.invalidateFramebuffer(o.DRAW_FRAMEBUFFER,[Ut])),Dt){const xt=r.get(T[Gt]).__webglTexture;o.framebufferTexture2D(o.DRAW_FRAMEBUFFER,o.COLOR_ATTACHMENT0,o.TEXTURE_2D,xt,0)}o.blitFramebuffer(0,0,et,St,0,0,et,St,vt,o.NEAREST),p&&o.invalidateFramebuffer(o.READ_FRAMEBUFFER,Mt)}if(i.bindFramebuffer(o.READ_FRAMEBUFFER,null),i.bindFramebuffer(o.DRAW_FRAMEBUFFER,null),Dt)for(let Gt=0;Gt<T.length;Gt++){i.bindFramebuffer(o.FRAMEBUFFER,Tt.__webglMultisampledFramebuffer),o.framebufferRenderbuffer(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0+Gt,o.RENDERBUFFER,Tt.__webglColorRenderbuffer[Gt]);const kt=r.get(T[Gt]).__webglTexture;i.bindFramebuffer(o.FRAMEBUFFER,Tt.__webglFramebuffer),o.framebufferTexture2D(o.DRAW_FRAMEBUFFER,o.COLOR_ATTACHMENT0+Gt,o.TEXTURE_2D,kt,0)}i.bindFramebuffer(o.DRAW_FRAMEBUFFER,Tt.__webglMultisampledFramebuffer)}}function ie(L){return Math.min(l.maxSamples,L.samples)}function It(L){const T=r.get(L);return d&&L.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&T.__useRenderToTexture!==!1}function Se(L){const T=h.render.frame;g.get(L)!==T&&(g.set(L,T),L.update())}function ue(L,T){const et=L.colorSpace,St=L.format,vt=L.type;return L.isCompressedTexture===!0||L.isVideoTexture===!0||L.format===_d||et!==$i&&et!==pi&&(Fe.getTransfer(et)===Ze?d===!1?e.has("EXT_sRGB")===!0&&St===Ti?(L.format=_d,L.minFilter=di,L.generateMipmaps=!1):T=K_.sRGBToLinear(T):(St!==Ti||vt!==Oa)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",et)),T}this.allocateTextureUnit=X,this.resetTextureUnits=yt,this.setTexture2D=O,this.setTexture2DArray=q,this.setTexture3D=j,this.setTextureCube=ct,this.rebindTextures=oe,this.setupRenderTarget=tt,this.updateRenderTargetMipmap=qe,this.updateMultisampleRenderTarget=Xt,this.setupDepthRenderbuffer=Kt,this.setupFrameBufferTexture=Lt,this.useMultisampledRTT=It}function Lb(o,e,i){const r=i.isWebGL2;function l(u,h=pi){let d;const m=Fe.getTransfer(h);if(u===Oa)return o.UNSIGNED_BYTE;if(u===G_)return o.UNSIGNED_SHORT_4_4_4_4;if(u===V_)return o.UNSIGNED_SHORT_5_5_5_1;if(u===fx)return o.BYTE;if(u===dx)return o.SHORT;if(u===Td)return o.UNSIGNED_SHORT;if(u===H_)return o.INT;if(u===Ca)return o.UNSIGNED_INT;if(u===Da)return o.FLOAT;if(u===Ro)return r?o.HALF_FLOAT:(d=e.get("OES_texture_half_float"),d!==null?d.HALF_FLOAT_OES:null);if(u===hx)return o.ALPHA;if(u===Ti)return o.RGBA;if(u===px)return o.LUMINANCE;if(u===mx)return o.LUMINANCE_ALPHA;if(u===ur)return o.DEPTH_COMPONENT;if(u===gs)return o.DEPTH_STENCIL;if(u===_d)return d=e.get("EXT_sRGB"),d!==null?d.SRGB_ALPHA_EXT:null;if(u===gx)return o.RED;if(u===k_)return o.RED_INTEGER;if(u===_x)return o.RG;if(u===X_)return o.RG_INTEGER;if(u===W_)return o.RGBA_INTEGER;if(u===Nf||u===Of||u===Pf||u===zf)if(m===Ze)if(d=e.get("WEBGL_compressed_texture_s3tc_srgb"),d!==null){if(u===Nf)return d.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(u===Of)return d.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(u===Pf)return d.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(u===zf)return d.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(d=e.get("WEBGL_compressed_texture_s3tc"),d!==null){if(u===Nf)return d.COMPRESSED_RGB_S3TC_DXT1_EXT;if(u===Of)return d.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(u===Pf)return d.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(u===zf)return d.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(u===vg||u===Sg||u===xg||u===Mg)if(d=e.get("WEBGL_compressed_texture_pvrtc"),d!==null){if(u===vg)return d.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(u===Sg)return d.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(u===xg)return d.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(u===Mg)return d.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(u===q_)return d=e.get("WEBGL_compressed_texture_etc1"),d!==null?d.COMPRESSED_RGB_ETC1_WEBGL:null;if(u===yg||u===Eg)if(d=e.get("WEBGL_compressed_texture_etc"),d!==null){if(u===yg)return m===Ze?d.COMPRESSED_SRGB8_ETC2:d.COMPRESSED_RGB8_ETC2;if(u===Eg)return m===Ze?d.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:d.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(u===Tg||u===bg||u===Ag||u===Rg||u===wg||u===Cg||u===Dg||u===Lg||u===Ug||u===Ng||u===Og||u===Pg||u===zg||u===Bg)if(d=e.get("WEBGL_compressed_texture_astc"),d!==null){if(u===Tg)return m===Ze?d.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:d.COMPRESSED_RGBA_ASTC_4x4_KHR;if(u===bg)return m===Ze?d.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:d.COMPRESSED_RGBA_ASTC_5x4_KHR;if(u===Ag)return m===Ze?d.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:d.COMPRESSED_RGBA_ASTC_5x5_KHR;if(u===Rg)return m===Ze?d.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:d.COMPRESSED_RGBA_ASTC_6x5_KHR;if(u===wg)return m===Ze?d.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:d.COMPRESSED_RGBA_ASTC_6x6_KHR;if(u===Cg)return m===Ze?d.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:d.COMPRESSED_RGBA_ASTC_8x5_KHR;if(u===Dg)return m===Ze?d.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:d.COMPRESSED_RGBA_ASTC_8x6_KHR;if(u===Lg)return m===Ze?d.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:d.COMPRESSED_RGBA_ASTC_8x8_KHR;if(u===Ug)return m===Ze?d.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:d.COMPRESSED_RGBA_ASTC_10x5_KHR;if(u===Ng)return m===Ze?d.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:d.COMPRESSED_RGBA_ASTC_10x6_KHR;if(u===Og)return m===Ze?d.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:d.COMPRESSED_RGBA_ASTC_10x8_KHR;if(u===Pg)return m===Ze?d.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:d.COMPRESSED_RGBA_ASTC_10x10_KHR;if(u===zg)return m===Ze?d.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:d.COMPRESSED_RGBA_ASTC_12x10_KHR;if(u===Bg)return m===Ze?d.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:d.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(u===Bf||u===Ig||u===Fg)if(d=e.get("EXT_texture_compression_bptc"),d!==null){if(u===Bf)return m===Ze?d.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:d.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(u===Ig)return d.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(u===Fg)return d.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(u===vx||u===Hg||u===Gg||u===Vg)if(d=e.get("EXT_texture_compression_rgtc"),d!==null){if(u===Bf)return d.COMPRESSED_RED_RGTC1_EXT;if(u===Hg)return d.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(u===Gg)return d.COMPRESSED_RED_GREEN_RGTC2_EXT;if(u===Vg)return d.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return u===cr?r?o.UNSIGNED_INT_24_8:(d=e.get("WEBGL_depth_texture"),d!==null?d.UNSIGNED_INT_24_8_WEBGL:null):o[u]!==void 0?o[u]:null}return{convert:l}}class Ub extends hi{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class To extends Wn{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Nb={type:"move"};class ld{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new To,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new To,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new st,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new st),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new To,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new st,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new st),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const i=this._hand;if(i)for(const r of e.hand.values())this._getHandJoint(i,r)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,i,r){let l=null,u=null,h=null;const d=this._targetRay,m=this._grip,p=this._hand;if(e&&i.session.visibilityState!=="visible-blurred"){if(p&&e.hand){h=!0;for(const A of e.hand.values()){const x=i.getJointPose(A,r),_=this._getHandJoint(p,A);x!==null&&(_.matrix.fromArray(x.transform.matrix),_.matrix.decompose(_.position,_.rotation,_.scale),_.matrixWorldNeedsUpdate=!0,_.jointRadius=x.radius),_.visible=x!==null}const g=p.joints["index-finger-tip"],v=p.joints["thumb-tip"],S=g.position.distanceTo(v.position),y=.02,b=.005;p.inputState.pinching&&S>y+b?(p.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!p.inputState.pinching&&S<=y-b&&(p.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else m!==null&&e.gripSpace&&(u=i.getPose(e.gripSpace,r),u!==null&&(m.matrix.fromArray(u.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,u.linearVelocity?(m.hasLinearVelocity=!0,m.linearVelocity.copy(u.linearVelocity)):m.hasLinearVelocity=!1,u.angularVelocity?(m.hasAngularVelocity=!0,m.angularVelocity.copy(u.angularVelocity)):m.hasAngularVelocity=!1));d!==null&&(l=i.getPose(e.targetRaySpace,r),l===null&&u!==null&&(l=u),l!==null&&(d.matrix.fromArray(l.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,l.linearVelocity?(d.hasLinearVelocity=!0,d.linearVelocity.copy(l.linearVelocity)):d.hasLinearVelocity=!1,l.angularVelocity?(d.hasAngularVelocity=!0,d.angularVelocity.copy(l.angularVelocity)):d.hasAngularVelocity=!1,this.dispatchEvent(Nb)))}return d!==null&&(d.visible=l!==null),m!==null&&(m.visible=u!==null),p!==null&&(p.visible=h!==null),this}_getHandJoint(e,i){if(e.joints[i.jointName]===void 0){const r=new To;r.matrixAutoUpdate=!1,r.visible=!1,e.joints[i.jointName]=r,e.add(r)}return e.joints[i.jointName]}}class Ob extends vs{constructor(e,i){super();const r=this;let l=null,u=1,h=null,d="local-floor",m=1,p=null,g=null,v=null,S=null,y=null,b=null;const A=i.getContextAttributes();let x=null,_=null;const N=[],D=[],P=new He;let G=null;const F=new hi;F.layers.enable(1),F.viewport=new An;const I=new hi;I.layers.enable(2),I.viewport=new An;const mt=[F,I],C=new Ub;C.layers.enable(1),C.layers.enable(2);let U=null,ut=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(B){let J=N[B];return J===void 0&&(J=new ld,N[B]=J),J.getTargetRaySpace()},this.getControllerGrip=function(B){let J=N[B];return J===void 0&&(J=new ld,N[B]=J),J.getGripSpace()},this.getHand=function(B){let J=N[B];return J===void 0&&(J=new ld,N[B]=J),J.getHandSpace()};function lt(B){const J=D.indexOf(B.inputSource);if(J===-1)return;const _t=N[J];_t!==void 0&&(_t.update(B.inputSource,B.frame,p||h),_t.dispatchEvent({type:B.type,data:B.inputSource}))}function yt(){l.removeEventListener("select",lt),l.removeEventListener("selectstart",lt),l.removeEventListener("selectend",lt),l.removeEventListener("squeeze",lt),l.removeEventListener("squeezestart",lt),l.removeEventListener("squeezeend",lt),l.removeEventListener("end",yt),l.removeEventListener("inputsourceschange",X);for(let B=0;B<N.length;B++){const J=D[B];J!==null&&(D[B]=null,N[B].disconnect(J))}U=null,ut=null,e.setRenderTarget(x),y=null,S=null,v=null,l=null,_=null,Q.stop(),r.isPresenting=!1,e.setPixelRatio(G),e.setSize(P.width,P.height,!1),r.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(B){u=B,r.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(B){d=B,r.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return p||h},this.setReferenceSpace=function(B){p=B},this.getBaseLayer=function(){return S!==null?S:y},this.getBinding=function(){return v},this.getFrame=function(){return b},this.getSession=function(){return l},this.setSession=async function(B){if(l=B,l!==null){if(x=e.getRenderTarget(),l.addEventListener("select",lt),l.addEventListener("selectstart",lt),l.addEventListener("selectend",lt),l.addEventListener("squeeze",lt),l.addEventListener("squeezestart",lt),l.addEventListener("squeezeend",lt),l.addEventListener("end",yt),l.addEventListener("inputsourceschange",X),A.xrCompatible!==!0&&await i.makeXRCompatible(),G=e.getPixelRatio(),e.getSize(P),l.renderState.layers===void 0||e.capabilities.isWebGL2===!1){const J={antialias:l.renderState.layers===void 0?A.antialias:!0,alpha:!0,depth:A.depth,stencil:A.stencil,framebufferScaleFactor:u};y=new XRWebGLLayer(l,i,J),l.updateRenderState({baseLayer:y}),e.setPixelRatio(1),e.setSize(y.framebufferWidth,y.framebufferHeight,!1),_=new hr(y.framebufferWidth,y.framebufferHeight,{format:Ti,type:Oa,colorSpace:e.outputColorSpace,stencilBuffer:A.stencil})}else{let J=null,_t=null,pt=null;A.depth&&(pt=A.stencil?i.DEPTH24_STENCIL8:i.DEPTH_COMPONENT24,J=A.stencil?gs:ur,_t=A.stencil?cr:Ca);const Lt={colorFormat:i.RGBA8,depthFormat:pt,scaleFactor:u};v=new XRWebGLBinding(l,i),S=v.createProjectionLayer(Lt),l.updateRenderState({layers:[S]}),e.setPixelRatio(1),e.setSize(S.textureWidth,S.textureHeight,!1),_=new hr(S.textureWidth,S.textureHeight,{format:Ti,type:Oa,depthTexture:new uv(S.textureWidth,S.textureHeight,_t,void 0,void 0,void 0,void 0,void 0,void 0,J),stencilBuffer:A.stencil,colorSpace:e.outputColorSpace,samples:A.antialias?4:0});const Pt=e.properties.get(_);Pt.__ignoreDepthValues=S.ignoreDepthValues}_.isXRRenderTarget=!0,this.setFoveation(m),p=null,h=await l.requestReferenceSpace(d),Q.setContext(l),Q.start(),r.isPresenting=!0,r.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(l!==null)return l.environmentBlendMode};function X(B){for(let J=0;J<B.removed.length;J++){const _t=B.removed[J],pt=D.indexOf(_t);pt>=0&&(D[pt]=null,N[pt].disconnect(_t))}for(let J=0;J<B.added.length;J++){const _t=B.added[J];let pt=D.indexOf(_t);if(pt===-1){for(let Pt=0;Pt<N.length;Pt++)if(Pt>=D.length){D.push(_t),pt=Pt;break}else if(D[Pt]===null){D[Pt]=_t,pt=Pt;break}if(pt===-1)break}const Lt=N[pt];Lt&&Lt.connect(_t)}}const $=new st,O=new st;function q(B,J,_t){$.setFromMatrixPosition(J.matrixWorld),O.setFromMatrixPosition(_t.matrixWorld);const pt=$.distanceTo(O),Lt=J.projectionMatrix.elements,Pt=_t.projectionMatrix.elements,jt=Lt[14]/(Lt[10]-1),Kt=Lt[14]/(Lt[10]+1),oe=(Lt[9]+1)/Lt[5],tt=(Lt[9]-1)/Lt[5],qe=(Lt[8]-1)/Lt[0],Xt=(Pt[8]+1)/Pt[0],ie=jt*qe,It=jt*Xt,Se=pt/(-qe+Xt),ue=Se*-qe;J.matrixWorld.decompose(B.position,B.quaternion,B.scale),B.translateX(ue),B.translateZ(Se),B.matrixWorld.compose(B.position,B.quaternion,B.scale),B.matrixWorldInverse.copy(B.matrixWorld).invert();const L=jt+Se,T=Kt+Se,et=ie-ue,St=It+(pt-ue),vt=oe*Kt/T*L,Mt=tt*Kt/T*L;B.projectionMatrix.makePerspective(et,St,vt,Mt,L,T),B.projectionMatrixInverse.copy(B.projectionMatrix).invert()}function j(B,J){J===null?B.matrixWorld.copy(B.matrix):B.matrixWorld.multiplyMatrices(J.matrixWorld,B.matrix),B.matrixWorldInverse.copy(B.matrixWorld).invert()}this.updateCamera=function(B){if(l===null)return;C.near=I.near=F.near=B.near,C.far=I.far=F.far=B.far,(U!==C.near||ut!==C.far)&&(l.updateRenderState({depthNear:C.near,depthFar:C.far}),U=C.near,ut=C.far);const J=B.parent,_t=C.cameras;j(C,J);for(let pt=0;pt<_t.length;pt++)j(_t[pt],J);_t.length===2?q(C,F,I):C.projectionMatrix.copy(F.projectionMatrix),ct(B,C,J)};function ct(B,J,_t){_t===null?B.matrix.copy(J.matrixWorld):(B.matrix.copy(_t.matrixWorld),B.matrix.invert(),B.matrix.multiply(J.matrixWorld)),B.matrix.decompose(B.position,B.quaternion,B.scale),B.updateMatrixWorld(!0),B.projectionMatrix.copy(J.projectionMatrix),B.projectionMatrixInverse.copy(J.projectionMatrixInverse),B.isPerspectiveCamera&&(B.fov=vd*2*Math.atan(1/B.projectionMatrix.elements[5]),B.zoom=1)}this.getCamera=function(){return C},this.getFoveation=function(){if(!(S===null&&y===null))return m},this.setFoveation=function(B){m=B,S!==null&&(S.fixedFoveation=B),y!==null&&y.fixedFoveation!==void 0&&(y.fixedFoveation=B)};let R=null;function k(B,J){if(g=J.getViewerPose(p||h),b=J,g!==null){const _t=g.views;y!==null&&(e.setRenderTargetFramebuffer(_,y.framebuffer),e.setRenderTarget(_));let pt=!1;_t.length!==C.cameras.length&&(C.cameras.length=0,pt=!0);for(let Lt=0;Lt<_t.length;Lt++){const Pt=_t[Lt];let jt=null;if(y!==null)jt=y.getViewport(Pt);else{const oe=v.getViewSubImage(S,Pt);jt=oe.viewport,Lt===0&&(e.setRenderTargetTextures(_,oe.colorTexture,S.ignoreDepthValues?void 0:oe.depthStencilTexture),e.setRenderTarget(_))}let Kt=mt[Lt];Kt===void 0&&(Kt=new hi,Kt.layers.enable(Lt),Kt.viewport=new An,mt[Lt]=Kt),Kt.matrix.fromArray(Pt.transform.matrix),Kt.matrix.decompose(Kt.position,Kt.quaternion,Kt.scale),Kt.projectionMatrix.fromArray(Pt.projectionMatrix),Kt.projectionMatrixInverse.copy(Kt.projectionMatrix).invert(),Kt.viewport.set(jt.x,jt.y,jt.width,jt.height),Lt===0&&(C.matrix.copy(Kt.matrix),C.matrix.decompose(C.position,C.quaternion,C.scale)),pt===!0&&C.cameras.push(Kt)}}for(let _t=0;_t<N.length;_t++){const pt=D[_t],Lt=N[_t];pt!==null&&Lt!==void 0&&Lt.update(pt,J,p||h)}R&&R(B,J),J.detectedPlanes&&r.dispatchEvent({type:"planesdetected",data:J}),b=null}const Q=new cv;Q.setAnimationLoop(k),this.setAnimationLoop=function(B){R=B},this.dispose=function(){}}}function Pb(o,e){function i(x,_){x.matrixAutoUpdate===!0&&x.updateMatrix(),_.value.copy(x.matrix)}function r(x,_){_.color.getRGB(x.fogColor.value,rv(o)),_.isFog?(x.fogNear.value=_.near,x.fogFar.value=_.far):_.isFogExp2&&(x.fogDensity.value=_.density)}function l(x,_,N,D,P){_.isMeshBasicMaterial||_.isMeshLambertMaterial?u(x,_):_.isMeshToonMaterial?(u(x,_),v(x,_)):_.isMeshPhongMaterial?(u(x,_),g(x,_)):_.isMeshStandardMaterial?(u(x,_),S(x,_),_.isMeshPhysicalMaterial&&y(x,_,P)):_.isMeshMatcapMaterial?(u(x,_),b(x,_)):_.isMeshDepthMaterial?u(x,_):_.isMeshDistanceMaterial?(u(x,_),A(x,_)):_.isMeshNormalMaterial?u(x,_):_.isLineBasicMaterial?(h(x,_),_.isLineDashedMaterial&&d(x,_)):_.isPointsMaterial?m(x,_,N,D):_.isSpriteMaterial?p(x,_):_.isShadowMaterial?(x.color.value.copy(_.color),x.opacity.value=_.opacity):_.isShaderMaterial&&(_.uniformsNeedUpdate=!1)}function u(x,_){x.opacity.value=_.opacity,_.color&&x.diffuse.value.copy(_.color),_.emissive&&x.emissive.value.copy(_.emissive).multiplyScalar(_.emissiveIntensity),_.map&&(x.map.value=_.map,i(_.map,x.mapTransform)),_.alphaMap&&(x.alphaMap.value=_.alphaMap,i(_.alphaMap,x.alphaMapTransform)),_.bumpMap&&(x.bumpMap.value=_.bumpMap,i(_.bumpMap,x.bumpMapTransform),x.bumpScale.value=_.bumpScale,_.side===Xn&&(x.bumpScale.value*=-1)),_.normalMap&&(x.normalMap.value=_.normalMap,i(_.normalMap,x.normalMapTransform),x.normalScale.value.copy(_.normalScale),_.side===Xn&&x.normalScale.value.negate()),_.displacementMap&&(x.displacementMap.value=_.displacementMap,i(_.displacementMap,x.displacementMapTransform),x.displacementScale.value=_.displacementScale,x.displacementBias.value=_.displacementBias),_.emissiveMap&&(x.emissiveMap.value=_.emissiveMap,i(_.emissiveMap,x.emissiveMapTransform)),_.specularMap&&(x.specularMap.value=_.specularMap,i(_.specularMap,x.specularMapTransform)),_.alphaTest>0&&(x.alphaTest.value=_.alphaTest);const N=e.get(_).envMap;if(N&&(x.envMap.value=N,x.flipEnvMap.value=N.isCubeTexture&&N.isRenderTargetTexture===!1?-1:1,x.reflectivity.value=_.reflectivity,x.ior.value=_.ior,x.refractionRatio.value=_.refractionRatio),_.lightMap){x.lightMap.value=_.lightMap;const D=o._useLegacyLights===!0?Math.PI:1;x.lightMapIntensity.value=_.lightMapIntensity*D,i(_.lightMap,x.lightMapTransform)}_.aoMap&&(x.aoMap.value=_.aoMap,x.aoMapIntensity.value=_.aoMapIntensity,i(_.aoMap,x.aoMapTransform))}function h(x,_){x.diffuse.value.copy(_.color),x.opacity.value=_.opacity,_.map&&(x.map.value=_.map,i(_.map,x.mapTransform))}function d(x,_){x.dashSize.value=_.dashSize,x.totalSize.value=_.dashSize+_.gapSize,x.scale.value=_.scale}function m(x,_,N,D){x.diffuse.value.copy(_.color),x.opacity.value=_.opacity,x.size.value=_.size*N,x.scale.value=D*.5,_.map&&(x.map.value=_.map,i(_.map,x.uvTransform)),_.alphaMap&&(x.alphaMap.value=_.alphaMap,i(_.alphaMap,x.alphaMapTransform)),_.alphaTest>0&&(x.alphaTest.value=_.alphaTest)}function p(x,_){x.diffuse.value.copy(_.color),x.opacity.value=_.opacity,x.rotation.value=_.rotation,_.map&&(x.map.value=_.map,i(_.map,x.mapTransform)),_.alphaMap&&(x.alphaMap.value=_.alphaMap,i(_.alphaMap,x.alphaMapTransform)),_.alphaTest>0&&(x.alphaTest.value=_.alphaTest)}function g(x,_){x.specular.value.copy(_.specular),x.shininess.value=Math.max(_.shininess,1e-4)}function v(x,_){_.gradientMap&&(x.gradientMap.value=_.gradientMap)}function S(x,_){x.metalness.value=_.metalness,_.metalnessMap&&(x.metalnessMap.value=_.metalnessMap,i(_.metalnessMap,x.metalnessMapTransform)),x.roughness.value=_.roughness,_.roughnessMap&&(x.roughnessMap.value=_.roughnessMap,i(_.roughnessMap,x.roughnessMapTransform)),e.get(_).envMap&&(x.envMapIntensity.value=_.envMapIntensity)}function y(x,_,N){x.ior.value=_.ior,_.sheen>0&&(x.sheenColor.value.copy(_.sheenColor).multiplyScalar(_.sheen),x.sheenRoughness.value=_.sheenRoughness,_.sheenColorMap&&(x.sheenColorMap.value=_.sheenColorMap,i(_.sheenColorMap,x.sheenColorMapTransform)),_.sheenRoughnessMap&&(x.sheenRoughnessMap.value=_.sheenRoughnessMap,i(_.sheenRoughnessMap,x.sheenRoughnessMapTransform))),_.clearcoat>0&&(x.clearcoat.value=_.clearcoat,x.clearcoatRoughness.value=_.clearcoatRoughness,_.clearcoatMap&&(x.clearcoatMap.value=_.clearcoatMap,i(_.clearcoatMap,x.clearcoatMapTransform)),_.clearcoatRoughnessMap&&(x.clearcoatRoughnessMap.value=_.clearcoatRoughnessMap,i(_.clearcoatRoughnessMap,x.clearcoatRoughnessMapTransform)),_.clearcoatNormalMap&&(x.clearcoatNormalMap.value=_.clearcoatNormalMap,i(_.clearcoatNormalMap,x.clearcoatNormalMapTransform),x.clearcoatNormalScale.value.copy(_.clearcoatNormalScale),_.side===Xn&&x.clearcoatNormalScale.value.negate())),_.iridescence>0&&(x.iridescence.value=_.iridescence,x.iridescenceIOR.value=_.iridescenceIOR,x.iridescenceThicknessMinimum.value=_.iridescenceThicknessRange[0],x.iridescenceThicknessMaximum.value=_.iridescenceThicknessRange[1],_.iridescenceMap&&(x.iridescenceMap.value=_.iridescenceMap,i(_.iridescenceMap,x.iridescenceMapTransform)),_.iridescenceThicknessMap&&(x.iridescenceThicknessMap.value=_.iridescenceThicknessMap,i(_.iridescenceThicknessMap,x.iridescenceThicknessMapTransform))),_.transmission>0&&(x.transmission.value=_.transmission,x.transmissionSamplerMap.value=N.texture,x.transmissionSamplerSize.value.set(N.width,N.height),_.transmissionMap&&(x.transmissionMap.value=_.transmissionMap,i(_.transmissionMap,x.transmissionMapTransform)),x.thickness.value=_.thickness,_.thicknessMap&&(x.thicknessMap.value=_.thicknessMap,i(_.thicknessMap,x.thicknessMapTransform)),x.attenuationDistance.value=_.attenuationDistance,x.attenuationColor.value.copy(_.attenuationColor)),_.anisotropy>0&&(x.anisotropyVector.value.set(_.anisotropy*Math.cos(_.anisotropyRotation),_.anisotropy*Math.sin(_.anisotropyRotation)),_.anisotropyMap&&(x.anisotropyMap.value=_.anisotropyMap,i(_.anisotropyMap,x.anisotropyMapTransform))),x.specularIntensity.value=_.specularIntensity,x.specularColor.value.copy(_.specularColor),_.specularColorMap&&(x.specularColorMap.value=_.specularColorMap,i(_.specularColorMap,x.specularColorMapTransform)),_.specularIntensityMap&&(x.specularIntensityMap.value=_.specularIntensityMap,i(_.specularIntensityMap,x.specularIntensityMapTransform))}function b(x,_){_.matcap&&(x.matcap.value=_.matcap)}function A(x,_){const N=e.get(_).light;x.referencePosition.value.setFromMatrixPosition(N.matrixWorld),x.nearDistance.value=N.shadow.camera.near,x.farDistance.value=N.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:l}}function zb(o,e,i,r){let l={},u={},h=[];const d=i.isWebGL2?o.getParameter(o.MAX_UNIFORM_BUFFER_BINDINGS):0;function m(N,D){const P=D.program;r.uniformBlockBinding(N,P)}function p(N,D){let P=l[N.id];P===void 0&&(b(N),P=g(N),l[N.id]=P,N.addEventListener("dispose",x));const G=D.program;r.updateUBOMapping(N,G);const F=e.render.frame;u[N.id]!==F&&(S(N),u[N.id]=F)}function g(N){const D=v();N.__bindingPointIndex=D;const P=o.createBuffer(),G=N.__size,F=N.usage;return o.bindBuffer(o.UNIFORM_BUFFER,P),o.bufferData(o.UNIFORM_BUFFER,G,F),o.bindBuffer(o.UNIFORM_BUFFER,null),o.bindBufferBase(o.UNIFORM_BUFFER,D,P),P}function v(){for(let N=0;N<d;N++)if(h.indexOf(N)===-1)return h.push(N),N;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function S(N){const D=l[N.id],P=N.uniforms,G=N.__cache;o.bindBuffer(o.UNIFORM_BUFFER,D);for(let F=0,I=P.length;F<I;F++){const mt=Array.isArray(P[F])?P[F]:[P[F]];for(let C=0,U=mt.length;C<U;C++){const ut=mt[C];if(y(ut,F,C,G)===!0){const lt=ut.__offset,yt=Array.isArray(ut.value)?ut.value:[ut.value];let X=0;for(let $=0;$<yt.length;$++){const O=yt[$],q=A(O);typeof O=="number"||typeof O=="boolean"?(ut.__data[0]=O,o.bufferSubData(o.UNIFORM_BUFFER,lt+X,ut.__data)):O.isMatrix3?(ut.__data[0]=O.elements[0],ut.__data[1]=O.elements[1],ut.__data[2]=O.elements[2],ut.__data[3]=0,ut.__data[4]=O.elements[3],ut.__data[5]=O.elements[4],ut.__data[6]=O.elements[5],ut.__data[7]=0,ut.__data[8]=O.elements[6],ut.__data[9]=O.elements[7],ut.__data[10]=O.elements[8],ut.__data[11]=0):(O.toArray(ut.__data,X),X+=q.storage/Float32Array.BYTES_PER_ELEMENT)}o.bufferSubData(o.UNIFORM_BUFFER,lt,ut.__data)}}}o.bindBuffer(o.UNIFORM_BUFFER,null)}function y(N,D,P,G){const F=N.value,I=D+"_"+P;if(G[I]===void 0)return typeof F=="number"||typeof F=="boolean"?G[I]=F:G[I]=F.clone(),!0;{const mt=G[I];if(typeof F=="number"||typeof F=="boolean"){if(mt!==F)return G[I]=F,!0}else if(mt.equals(F)===!1)return mt.copy(F),!0}return!1}function b(N){const D=N.uniforms;let P=0;const G=16;for(let I=0,mt=D.length;I<mt;I++){const C=Array.isArray(D[I])?D[I]:[D[I]];for(let U=0,ut=C.length;U<ut;U++){const lt=C[U],yt=Array.isArray(lt.value)?lt.value:[lt.value];for(let X=0,$=yt.length;X<$;X++){const O=yt[X],q=A(O),j=P%G;j!==0&&G-j<q.boundary&&(P+=G-j),lt.__data=new Float32Array(q.storage/Float32Array.BYTES_PER_ELEMENT),lt.__offset=P,P+=q.storage}}}const F=P%G;return F>0&&(P+=G-F),N.__size=P,N.__cache={},this}function A(N){const D={boundary:0,storage:0};return typeof N=="number"||typeof N=="boolean"?(D.boundary=4,D.storage=4):N.isVector2?(D.boundary=8,D.storage=8):N.isVector3||N.isColor?(D.boundary=16,D.storage=12):N.isVector4?(D.boundary=16,D.storage=16):N.isMatrix3?(D.boundary=48,D.storage=48):N.isMatrix4?(D.boundary=64,D.storage=64):N.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",N),D}function x(N){const D=N.target;D.removeEventListener("dispose",x);const P=h.indexOf(D.__bindingPointIndex);h.splice(P,1),o.deleteBuffer(l[D.id]),delete l[D.id],delete u[D.id]}function _(){for(const N in l)o.deleteBuffer(l[N]);h=[],l={},u={}}return{bind:m,update:p,dispose:_}}class gv{constructor(e={}){const{canvas:i=Lx(),context:r=null,depth:l=!0,stencil:u=!0,alpha:h=!1,antialias:d=!1,premultipliedAlpha:m=!0,preserveDrawingBuffer:p=!1,powerPreference:g="default",failIfMajorPerformanceCaveat:v=!1}=e;this.isWebGLRenderer=!0;let S;r!==null?S=r.getContextAttributes().alpha:S=h;const y=new Uint32Array(4),b=new Int32Array(4);let A=null,x=null;const _=[],N=[];this.domElement=i,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=bn,this._useLegacyLights=!1,this.toneMapping=Na,this.toneMappingExposure=1;const D=this;let P=!1,G=0,F=0,I=null,mt=-1,C=null;const U=new An,ut=new An;let lt=null;const yt=new Qt(0);let X=0,$=i.width,O=i.height,q=1,j=null,ct=null;const R=new An(0,0,$,O),k=new An(0,0,$,O);let Q=!1;const B=new lv;let J=!1,_t=!1,pt=null;const Lt=new Sn,Pt=new He,jt=new st,Kt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function oe(){return I===null?q:1}let tt=r;function qe(w,W){for(let rt=0;rt<w.length;rt++){const ot=w[rt],it=i.getContext(ot,W);if(it!==null)return it}return null}try{const w={alpha:!0,depth:l,stencil:u,antialias:d,premultipliedAlpha:m,preserveDrawingBuffer:p,powerPreference:g,failIfMajorPerformanceCaveat:v};if("setAttribute"in i&&i.setAttribute("data-engine",`three.js r${Ed}`),i.addEventListener("webglcontextlost",bt,!1),i.addEventListener("webglcontextrestored",H,!1),i.addEventListener("webglcontextcreationerror",At,!1),tt===null){const W=["webgl2","webgl","experimental-webgl"];if(D.isWebGL1Renderer===!0&&W.shift(),tt=qe(W,w),tt===null)throw qe(W)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&tt instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),tt.getShaderPrecisionFormat===void 0&&(tt.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(w){throw console.error("THREE.WebGLRenderer: "+w.message),w}let Xt,ie,It,Se,ue,L,T,et,St,vt,Mt,Ut,Tt,Dt,Gt,kt,xt,be,he,ee,Vt,zt,ae,ye;function Ge(){Xt=new qE(tt),ie=new FE(tt,Xt,e),Xt.init(ie),zt=new Lb(tt,Xt,ie),It=new Cb(tt,Xt,ie),Se=new ZE(tt),ue=new mb,L=new Db(tt,Xt,It,ue,ie,zt,Se),T=new GE(D),et=new WE(D),St=new nM(tt,ie),ae=new BE(tt,Xt,St,ie),vt=new YE(tt,St,Se,ae),Mt=new $E(tt,vt,St,Se),he=new JE(tt,ie,L),kt=new HE(ue),Ut=new pb(D,T,et,Xt,ie,ae,kt),Tt=new Pb(D,ue),Dt=new _b,Gt=new Eb(Xt,ie),be=new zE(D,T,et,It,Mt,S,m),xt=new wb(D,Mt,ie),ye=new zb(tt,Se,ie,It),ee=new IE(tt,Xt,Se,ie),Vt=new jE(tt,Xt,Se,ie),Se.programs=Ut.programs,D.capabilities=ie,D.extensions=Xt,D.properties=ue,D.renderLists=Dt,D.shadowMap=xt,D.state=It,D.info=Se}Ge();const de=new Ob(D,tt);this.xr=de,this.getContext=function(){return tt},this.getContextAttributes=function(){return tt.getContextAttributes()},this.forceContextLoss=function(){const w=Xt.get("WEBGL_lose_context");w&&w.loseContext()},this.forceContextRestore=function(){const w=Xt.get("WEBGL_lose_context");w&&w.restoreContext()},this.getPixelRatio=function(){return q},this.setPixelRatio=function(w){w!==void 0&&(q=w,this.setSize($,O,!1))},this.getSize=function(w){return w.set($,O)},this.setSize=function(w,W,rt=!0){if(de.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}$=w,O=W,i.width=Math.floor(w*q),i.height=Math.floor(W*q),rt===!0&&(i.style.width=w+"px",i.style.height=W+"px"),this.setViewport(0,0,w,W)},this.getDrawingBufferSize=function(w){return w.set($*q,O*q).floor()},this.setDrawingBufferSize=function(w,W,rt){$=w,O=W,q=rt,i.width=Math.floor(w*rt),i.height=Math.floor(W*rt),this.setViewport(0,0,w,W)},this.getCurrentViewport=function(w){return w.copy(U)},this.getViewport=function(w){return w.copy(R)},this.setViewport=function(w,W,rt,ot){w.isVector4?R.set(w.x,w.y,w.z,w.w):R.set(w,W,rt,ot),It.viewport(U.copy(R).multiplyScalar(q).floor())},this.getScissor=function(w){return w.copy(k)},this.setScissor=function(w,W,rt,ot){w.isVector4?k.set(w.x,w.y,w.z,w.w):k.set(w,W,rt,ot),It.scissor(ut.copy(k).multiplyScalar(q).floor())},this.getScissorTest=function(){return Q},this.setScissorTest=function(w){It.setScissorTest(Q=w)},this.setOpaqueSort=function(w){j=w},this.setTransparentSort=function(w){ct=w},this.getClearColor=function(w){return w.copy(be.getClearColor())},this.setClearColor=function(){be.setClearColor.apply(be,arguments)},this.getClearAlpha=function(){return be.getClearAlpha()},this.setClearAlpha=function(){be.setClearAlpha.apply(be,arguments)},this.clear=function(w=!0,W=!0,rt=!0){let ot=0;if(w){let it=!1;if(I!==null){const Nt=I.texture.format;it=Nt===W_||Nt===X_||Nt===k_}if(it){const Nt=I.texture.type,qt=Nt===Oa||Nt===Ca||Nt===Td||Nt===cr||Nt===G_||Nt===V_,$t=be.getClearColor(),re=be.getClearAlpha(),me=$t.r,ce=$t.g,fe=$t.b;qt?(y[0]=me,y[1]=ce,y[2]=fe,y[3]=re,tt.clearBufferuiv(tt.COLOR,0,y)):(b[0]=me,b[1]=ce,b[2]=fe,b[3]=re,tt.clearBufferiv(tt.COLOR,0,b))}else ot|=tt.COLOR_BUFFER_BIT}W&&(ot|=tt.DEPTH_BUFFER_BIT),rt&&(ot|=tt.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),tt.clear(ot)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){i.removeEventListener("webglcontextlost",bt,!1),i.removeEventListener("webglcontextrestored",H,!1),i.removeEventListener("webglcontextcreationerror",At,!1),Dt.dispose(),Gt.dispose(),ue.dispose(),T.dispose(),et.dispose(),Mt.dispose(),ae.dispose(),ye.dispose(),Ut.dispose(),de.dispose(),de.removeEventListener("sessionstart",Ot),de.removeEventListener("sessionend",Et),pt&&(pt.dispose(),pt=null),Bt.stop()};function bt(w){w.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),P=!0}function H(){console.log("THREE.WebGLRenderer: Context Restored."),P=!1;const w=Se.autoReset,W=xt.enabled,rt=xt.autoUpdate,ot=xt.needsUpdate,it=xt.type;Ge(),Se.autoReset=w,xt.enabled=W,xt.autoUpdate=rt,xt.needsUpdate=ot,xt.type=it}function At(w){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",w.statusMessage)}function Ct(w){const W=w.target;W.removeEventListener("dispose",Ct),Jt(W)}function Jt(w){Zt(w),ue.remove(w)}function Zt(w){const W=ue.get(w).programs;W!==void 0&&(W.forEach(function(rt){Ut.releaseProgram(rt)}),w.isShaderMaterial&&Ut.releaseShaderCache(w))}this.renderBufferDirect=function(w,W,rt,ot,it,Nt){W===null&&(W=Kt);const qt=it.isMesh&&it.matrixWorld.determinant()<0,$t=cn(w,W,rt,ot,it);It.setMaterial(ot,qt);let re=rt.index,me=1;if(ot.wireframe===!0){if(re=vt.getWireframeAttribute(rt),re===void 0)return;me=2}const ce=rt.drawRange,fe=rt.attributes.position;let Le=ce.start*me,Mn=(ce.start+ce.count)*me;Nt!==null&&(Le=Math.max(Le,Nt.start*me),Mn=Math.min(Mn,(Nt.start+Nt.count)*me)),re!==null?(Le=Math.max(Le,0),Mn=Math.min(Mn,re.count)):fe!=null&&(Le=Math.max(Le,0),Mn=Math.min(Mn,fe.count));const en=Mn-Le;if(en<0||en===1/0)return;ae.setup(it,ot,$t,rt,re);let wn,Ve=ee;if(re!==null&&(wn=St.get(re),Ve=Vt,Ve.setIndex(wn)),it.isMesh)ot.wireframe===!0?(It.setLineWidth(ot.wireframeLinewidth*oe()),Ve.setMode(tt.LINES)):Ve.setMode(tt.TRIANGLES);else if(it.isLine){let pe=ot.linewidth;pe===void 0&&(pe=1),It.setLineWidth(pe*oe()),it.isLineSegments?Ve.setMode(tt.LINES):it.isLineLoop?Ve.setMode(tt.LINE_LOOP):Ve.setMode(tt.LINE_STRIP)}else it.isPoints?Ve.setMode(tt.POINTS):it.isSprite&&Ve.setMode(tt.TRIANGLES);if(it.isBatchedMesh)Ve.renderMultiDraw(it._multiDrawStarts,it._multiDrawCounts,it._multiDrawCount);else if(it.isInstancedMesh)Ve.renderInstances(Le,en,it.count);else if(rt.isInstancedBufferGeometry){const pe=rt._maxInstanceCount!==void 0?rt._maxInstanceCount:1/0,xs=Math.min(rt.instanceCount,pe);Ve.renderInstances(Le,en,xs)}else Ve.render(Le,en)};function Ce(w,W,rt){w.transparent===!0&&w.side===Qi&&w.forceSinglePass===!1?(w.side=Xn,w.needsUpdate=!0,Bn(w,W,rt),w.side=Pa,w.needsUpdate=!0,Bn(w,W,rt),w.side=Qi):Bn(w,W,rt)}this.compile=function(w,W,rt=null){rt===null&&(rt=w),x=Gt.get(rt),x.init(),N.push(x),rt.traverseVisible(function(it){it.isLight&&it.layers.test(W.layers)&&(x.pushLight(it),it.castShadow&&x.pushShadow(it))}),w!==rt&&w.traverseVisible(function(it){it.isLight&&it.layers.test(W.layers)&&(x.pushLight(it),it.castShadow&&x.pushShadow(it))}),x.setupLights(D._useLegacyLights);const ot=new Set;return w.traverse(function(it){const Nt=it.material;if(Nt)if(Array.isArray(Nt))for(let qt=0;qt<Nt.length;qt++){const $t=Nt[qt];Ce($t,rt,it),ot.add($t)}else Ce(Nt,rt,it),ot.add(Nt)}),N.pop(),x=null,ot},this.compileAsync=function(w,W,rt=null){const ot=this.compile(w,W,rt);return new Promise(it=>{function Nt(){if(ot.forEach(function(qt){ue.get(qt).currentProgram.isReady()&&ot.delete(qt)}),ot.size===0){it(w);return}setTimeout(Nt,10)}Xt.get("KHR_parallel_shader_compile")!==null?Nt():setTimeout(Nt,10)})};let ft=null;function Rt(w){ft&&ft(w)}function Ot(){Bt.stop()}function Et(){Bt.start()}const Bt=new cv;Bt.setAnimationLoop(Rt),typeof self<"u"&&Bt.setContext(self),this.setAnimationLoop=function(w){ft=w,de.setAnimationLoop(w),w===null?Bt.stop():Bt.start()},de.addEventListener("sessionstart",Ot),de.addEventListener("sessionend",Et),this.render=function(w,W){if(W!==void 0&&W.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(P===!0)return;w.matrixWorldAutoUpdate===!0&&w.updateMatrixWorld(),W.parent===null&&W.matrixWorldAutoUpdate===!0&&W.updateMatrixWorld(),de.enabled===!0&&de.isPresenting===!0&&(de.cameraAutoUpdate===!0&&de.updateCamera(W),W=de.getCamera()),w.isScene===!0&&w.onBeforeRender(D,w,W,I),x=Gt.get(w,N.length),x.init(),N.push(x),Lt.multiplyMatrices(W.projectionMatrix,W.matrixWorldInverse),B.setFromProjectionMatrix(Lt),_t=this.localClippingEnabled,J=kt.init(this.clippingPlanes,_t),A=Dt.get(w,_.length),A.init(),_.push(A),le(w,W,0,D.sortObjects),A.finish(),D.sortObjects===!0&&A.sort(j,ct),this.info.render.frame++,J===!0&&kt.beginShadows();const rt=x.state.shadowsArray;if(xt.render(rt,w,W),J===!0&&kt.endShadows(),this.info.autoReset===!0&&this.info.reset(),be.render(A,w),x.setupLights(D._useLegacyLights),W.isArrayCamera){const ot=W.cameras;for(let it=0,Nt=ot.length;it<Nt;it++){const qt=ot[it];Pe(A,w,qt,qt.viewport)}}else Pe(A,w,W);I!==null&&(L.updateMultisampleRenderTarget(I),L.updateRenderTargetMipmap(I)),w.isScene===!0&&w.onAfterRender(D,w,W),ae.resetDefaultState(),mt=-1,C=null,N.pop(),N.length>0?x=N[N.length-1]:x=null,_.pop(),_.length>0?A=_[_.length-1]:A=null};function le(w,W,rt,ot){if(w.visible===!1)return;if(w.layers.test(W.layers)){if(w.isGroup)rt=w.renderOrder;else if(w.isLOD)w.autoUpdate===!0&&w.update(W);else if(w.isLight)x.pushLight(w),w.castShadow&&x.pushShadow(w);else if(w.isSprite){if(!w.frustumCulled||B.intersectsSprite(w)){ot&&jt.setFromMatrixPosition(w.matrixWorld).applyMatrix4(Lt);const qt=Mt.update(w),$t=w.material;$t.visible&&A.push(w,qt,$t,rt,jt.z,null)}}else if((w.isMesh||w.isLine||w.isPoints)&&(!w.frustumCulled||B.intersectsObject(w))){const qt=Mt.update(w),$t=w.material;if(ot&&(w.boundingSphere!==void 0?(w.boundingSphere===null&&w.computeBoundingSphere(),jt.copy(w.boundingSphere.center)):(qt.boundingSphere===null&&qt.computeBoundingSphere(),jt.copy(qt.boundingSphere.center)),jt.applyMatrix4(w.matrixWorld).applyMatrix4(Lt)),Array.isArray($t)){const re=qt.groups;for(let me=0,ce=re.length;me<ce;me++){const fe=re[me],Le=$t[fe.materialIndex];Le&&Le.visible&&A.push(w,qt,Le,rt,jt.z,fe)}}else $t.visible&&A.push(w,qt,$t,rt,jt.z,null)}}const Nt=w.children;for(let qt=0,$t=Nt.length;qt<$t;qt++)le(Nt[qt],W,rt,ot)}function Pe(w,W,rt,ot){const it=w.opaque,Nt=w.transmissive,qt=w.transparent;x.setupLightsView(rt),J===!0&&kt.setGlobalState(D.clippingPlanes,rt),Nt.length>0&&Ke(it,Nt,W,rt),ot&&It.viewport(U.copy(ot)),it.length>0&&we(it,W,rt),Nt.length>0&&we(Nt,W,rt),qt.length>0&&we(qt,W,rt),It.buffers.depth.setTest(!0),It.buffers.depth.setMask(!0),It.buffers.color.setMask(!0),It.setPolygonOffset(!1)}function Ke(w,W,rt,ot){if((rt.isScene===!0?rt.overrideMaterial:null)!==null)return;const Nt=ie.isWebGL2;pt===null&&(pt=new hr(1,1,{generateMipmaps:!0,type:Xt.has("EXT_color_buffer_half_float")?Ro:Oa,minFilter:Ao,samples:Nt?4:0})),D.getDrawingBufferSize(Pt),Nt?pt.setSize(Pt.x,Pt.y):pt.setSize(Sd(Pt.x),Sd(Pt.y));const qt=D.getRenderTarget();D.setRenderTarget(pt),D.getClearColor(yt),X=D.getClearAlpha(),X<1&&D.setClearColor(16777215,.5),D.clear();const $t=D.toneMapping;D.toneMapping=Na,we(w,rt,ot),L.updateMultisampleRenderTarget(pt),L.updateRenderTargetMipmap(pt);let re=!1;for(let me=0,ce=W.length;me<ce;me++){const fe=W[me],Le=fe.object,Mn=fe.geometry,en=fe.material,wn=fe.group;if(en.side===Qi&&Le.layers.test(ot.layers)){const Ve=en.side;en.side=Xn,en.needsUpdate=!0,Ae(Le,rt,ot,Mn,en,wn),en.side=Ve,en.needsUpdate=!0,re=!0}}re===!0&&(L.updateMultisampleRenderTarget(pt),L.updateRenderTargetMipmap(pt)),D.setRenderTarget(qt),D.setClearColor(yt,X),D.toneMapping=$t}function we(w,W,rt){const ot=W.isScene===!0?W.overrideMaterial:null;for(let it=0,Nt=w.length;it<Nt;it++){const qt=w[it],$t=qt.object,re=qt.geometry,me=ot===null?qt.material:ot,ce=qt.group;$t.layers.test(rt.layers)&&Ae($t,W,rt,re,me,ce)}}function Ae(w,W,rt,ot,it,Nt){w.onBeforeRender(D,W,rt,ot,it,Nt),w.modelViewMatrix.multiplyMatrices(rt.matrixWorldInverse,w.matrixWorld),w.normalMatrix.getNormalMatrix(w.modelViewMatrix),it.onBeforeRender(D,W,rt,ot,w,Nt),it.transparent===!0&&it.side===Qi&&it.forceSinglePass===!1?(it.side=Xn,it.needsUpdate=!0,D.renderBufferDirect(rt,W,ot,it,w,Nt),it.side=Pa,it.needsUpdate=!0,D.renderBufferDirect(rt,W,ot,it,w,Nt),it.side=Qi):D.renderBufferDirect(rt,W,ot,it,w,Nt),w.onAfterRender(D,W,rt,ot,it,Nt)}function Bn(w,W,rt){W.isScene!==!0&&(W=Kt);const ot=ue.get(w),it=x.state.lights,Nt=x.state.shadowsArray,qt=it.state.version,$t=Ut.getParameters(w,it.state,Nt,W,rt),re=Ut.getProgramCacheKey($t);let me=ot.programs;ot.environment=w.isMeshStandardMaterial?W.environment:null,ot.fog=W.fog,ot.envMap=(w.isMeshStandardMaterial?et:T).get(w.envMap||ot.environment),me===void 0&&(w.addEventListener("dispose",Ct),me=new Map,ot.programs=me);let ce=me.get(re);if(ce!==void 0){if(ot.currentProgram===ce&&ot.lightsStateVersion===qt)return Rn(w,$t),ce}else $t.uniforms=Ut.getUniforms(w),w.onBuild(rt,$t,D),w.onBeforeCompile($t,D),ce=Ut.acquireProgram($t,re),me.set(re,ce),ot.uniforms=$t.uniforms;const fe=ot.uniforms;return(!w.isShaderMaterial&&!w.isRawShaderMaterial||w.clipping===!0)&&(fe.clippingPlanes=kt.uniform),Rn(w,$t),ot.needsLights=Nn(w),ot.lightsStateVersion=qt,ot.needsLights&&(fe.ambientLightColor.value=it.state.ambient,fe.lightProbe.value=it.state.probe,fe.directionalLights.value=it.state.directional,fe.directionalLightShadows.value=it.state.directionalShadow,fe.spotLights.value=it.state.spot,fe.spotLightShadows.value=it.state.spotShadow,fe.rectAreaLights.value=it.state.rectArea,fe.ltc_1.value=it.state.rectAreaLTC1,fe.ltc_2.value=it.state.rectAreaLTC2,fe.pointLights.value=it.state.point,fe.pointLightShadows.value=it.state.pointShadow,fe.hemisphereLights.value=it.state.hemi,fe.directionalShadowMap.value=it.state.directionalShadowMap,fe.directionalShadowMatrix.value=it.state.directionalShadowMatrix,fe.spotShadowMap.value=it.state.spotShadowMap,fe.spotLightMatrix.value=it.state.spotLightMatrix,fe.spotLightMap.value=it.state.spotLightMap,fe.pointShadowMap.value=it.state.pointShadowMap,fe.pointShadowMatrix.value=it.state.pointShadowMatrix),ot.currentProgram=ce,ot.uniformsList=null,ce}function xn(w){if(w.uniformsList===null){const W=w.currentProgram.getUniforms();w.uniformsList=dc.seqWithValue(W.seq,w.uniforms)}return w.uniformsList}function Rn(w,W){const rt=ue.get(w);rt.outputColorSpace=W.outputColorSpace,rt.batching=W.batching,rt.instancing=W.instancing,rt.instancingColor=W.instancingColor,rt.skinning=W.skinning,rt.morphTargets=W.morphTargets,rt.morphNormals=W.morphNormals,rt.morphColors=W.morphColors,rt.morphTargetsCount=W.morphTargetsCount,rt.numClippingPlanes=W.numClippingPlanes,rt.numIntersection=W.numClipIntersection,rt.vertexAlphas=W.vertexAlphas,rt.vertexTangents=W.vertexTangents,rt.toneMapping=W.toneMapping}function cn(w,W,rt,ot,it){W.isScene!==!0&&(W=Kt),L.resetTextureUnits();const Nt=W.fog,qt=ot.isMeshStandardMaterial?W.environment:null,$t=I===null?D.outputColorSpace:I.isXRRenderTarget===!0?I.texture.colorSpace:$i,re=(ot.isMeshStandardMaterial?et:T).get(ot.envMap||qt),me=ot.vertexColors===!0&&!!rt.attributes.color&&rt.attributes.color.itemSize===4,ce=!!rt.attributes.tangent&&(!!ot.normalMap||ot.anisotropy>0),fe=!!rt.morphAttributes.position,Le=!!rt.morphAttributes.normal,Mn=!!rt.morphAttributes.color;let en=Na;ot.toneMapped&&(I===null||I.isXRRenderTarget===!0)&&(en=D.toneMapping);const wn=rt.morphAttributes.position||rt.morphAttributes.normal||rt.morphAttributes.color,Ve=wn!==void 0?wn.length:0,pe=ue.get(ot),xs=x.state.lights;if(J===!0&&(_t===!0||w!==C)){const je=w===C&&ot.id===mt;kt.setState(ot,w,je)}let Ye=!1;ot.version===pe.__version?(pe.needsLights&&pe.lightsStateVersion!==xs.state.version||pe.outputColorSpace!==$t||it.isBatchedMesh&&pe.batching===!1||!it.isBatchedMesh&&pe.batching===!0||it.isInstancedMesh&&pe.instancing===!1||!it.isInstancedMesh&&pe.instancing===!0||it.isSkinnedMesh&&pe.skinning===!1||!it.isSkinnedMesh&&pe.skinning===!0||it.isInstancedMesh&&pe.instancingColor===!0&&it.instanceColor===null||it.isInstancedMesh&&pe.instancingColor===!1&&it.instanceColor!==null||pe.envMap!==re||ot.fog===!0&&pe.fog!==Nt||pe.numClippingPlanes!==void 0&&(pe.numClippingPlanes!==kt.numPlanes||pe.numIntersection!==kt.numIntersection)||pe.vertexAlphas!==me||pe.vertexTangents!==ce||pe.morphTargets!==fe||pe.morphNormals!==Le||pe.morphColors!==Mn||pe.toneMapping!==en||ie.isWebGL2===!0&&pe.morphTargetsCount!==Ve)&&(Ye=!0):(Ye=!0,pe.__version=ot.version);let rn=pe.currentProgram;Ye===!0&&(rn=Bn(ot,W,it));let Ms=!1,Ba=!1,ea=!1;const un=rn.getUniforms(),ii=pe.uniforms;if(It.useProgram(rn.program)&&(Ms=!0,Ba=!0,ea=!0),ot.id!==mt&&(mt=ot.id,Ba=!0),Ms||C!==w){un.setValue(tt,"projectionMatrix",w.projectionMatrix),un.setValue(tt,"viewMatrix",w.matrixWorldInverse);const je=un.map.cameraPosition;je!==void 0&&je.setValue(tt,jt.setFromMatrixPosition(w.matrixWorld)),ie.logarithmicDepthBuffer&&un.setValue(tt,"logDepthBufFC",2/(Math.log(w.far+1)/Math.LN2)),(ot.isMeshPhongMaterial||ot.isMeshToonMaterial||ot.isMeshLambertMaterial||ot.isMeshBasicMaterial||ot.isMeshStandardMaterial||ot.isShaderMaterial)&&un.setValue(tt,"isOrthographic",w.isOrthographicCamera===!0),C!==w&&(C=w,Ba=!0,ea=!0)}if(it.isSkinnedMesh){un.setOptional(tt,it,"bindMatrix"),un.setOptional(tt,it,"bindMatrixInverse");const je=it.skeleton;je&&(ie.floatVertexTextures?(je.boneTexture===null&&je.computeBoneTexture(),un.setValue(tt,"boneTexture",je.boneTexture,L)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}it.isBatchedMesh&&(un.setOptional(tt,it,"batchingTexture"),un.setValue(tt,"batchingTexture",it._matricesTexture,L));const ys=rt.morphAttributes;if((ys.position!==void 0||ys.normal!==void 0||ys.color!==void 0&&ie.isWebGL2===!0)&&he.update(it,rt,rn),(Ba||pe.receiveShadow!==it.receiveShadow)&&(pe.receiveShadow=it.receiveShadow,un.setValue(tt,"receiveShadow",it.receiveShadow)),ot.isMeshGouraudMaterial&&ot.envMap!==null&&(ii.envMap.value=re,ii.flipEnvMap.value=re.isCubeTexture&&re.isRenderTargetTexture===!1?-1:1),Ba&&(un.setValue(tt,"toneMappingExposure",D.toneMappingExposure),pe.needsLights&&qn(ii,ea),Nt&&ot.fog===!0&&Tt.refreshFogUniforms(ii,Nt),Tt.refreshMaterialUniforms(ii,ot,q,O,pt),dc.upload(tt,xn(pe),ii,L)),ot.isShaderMaterial&&ot.uniformsNeedUpdate===!0&&(dc.upload(tt,xn(pe),ii,L),ot.uniformsNeedUpdate=!1),ot.isSpriteMaterial&&un.setValue(tt,"center",it.center),un.setValue(tt,"modelViewMatrix",it.modelViewMatrix),un.setValue(tt,"normalMatrix",it.normalMatrix),un.setValue(tt,"modelMatrix",it.matrixWorld),ot.isShaderMaterial||ot.isRawShaderMaterial){const je=ot.uniformsGroups;for(let Ia=0,No=je.length;Ia<No;Ia++)if(ie.isWebGL2){const pr=je[Ia];ye.update(pr,rn),ye.bind(pr,rn)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return rn}function qn(w,W){w.ambientLightColor.needsUpdate=W,w.lightProbe.needsUpdate=W,w.directionalLights.needsUpdate=W,w.directionalLightShadows.needsUpdate=W,w.pointLights.needsUpdate=W,w.pointLightShadows.needsUpdate=W,w.spotLights.needsUpdate=W,w.spotLightShadows.needsUpdate=W,w.rectAreaLights.needsUpdate=W,w.hemisphereLights.needsUpdate=W}function Nn(w){return w.isMeshLambertMaterial||w.isMeshToonMaterial||w.isMeshPhongMaterial||w.isMeshStandardMaterial||w.isShadowMaterial||w.isShaderMaterial&&w.lights===!0}this.getActiveCubeFace=function(){return G},this.getActiveMipmapLevel=function(){return F},this.getRenderTarget=function(){return I},this.setRenderTargetTextures=function(w,W,rt){ue.get(w.texture).__webglTexture=W,ue.get(w.depthTexture).__webglTexture=rt;const ot=ue.get(w);ot.__hasExternalTextures=!0,ot.__hasExternalTextures&&(ot.__autoAllocateDepthBuffer=rt===void 0,ot.__autoAllocateDepthBuffer||Xt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),ot.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(w,W){const rt=ue.get(w);rt.__webglFramebuffer=W,rt.__useDefaultFramebuffer=W===void 0},this.setRenderTarget=function(w,W=0,rt=0){I=w,G=W,F=rt;let ot=!0,it=null,Nt=!1,qt=!1;if(w){const re=ue.get(w);re.__useDefaultFramebuffer!==void 0?(It.bindFramebuffer(tt.FRAMEBUFFER,null),ot=!1):re.__webglFramebuffer===void 0?L.setupRenderTarget(w):re.__hasExternalTextures&&L.rebindTextures(w,ue.get(w.texture).__webglTexture,ue.get(w.depthTexture).__webglTexture);const me=w.texture;(me.isData3DTexture||me.isDataArrayTexture||me.isCompressedArrayTexture)&&(qt=!0);const ce=ue.get(w).__webglFramebuffer;w.isWebGLCubeRenderTarget?(Array.isArray(ce[W])?it=ce[W][rt]:it=ce[W],Nt=!0):ie.isWebGL2&&w.samples>0&&L.useMultisampledRTT(w)===!1?it=ue.get(w).__webglMultisampledFramebuffer:Array.isArray(ce)?it=ce[rt]:it=ce,U.copy(w.viewport),ut.copy(w.scissor),lt=w.scissorTest}else U.copy(R).multiplyScalar(q).floor(),ut.copy(k).multiplyScalar(q).floor(),lt=Q;if(It.bindFramebuffer(tt.FRAMEBUFFER,it)&&ie.drawBuffers&&ot&&It.drawBuffers(w,it),It.viewport(U),It.scissor(ut),It.setScissorTest(lt),Nt){const re=ue.get(w.texture);tt.framebufferTexture2D(tt.FRAMEBUFFER,tt.COLOR_ATTACHMENT0,tt.TEXTURE_CUBE_MAP_POSITIVE_X+W,re.__webglTexture,rt)}else if(qt){const re=ue.get(w.texture),me=W||0;tt.framebufferTextureLayer(tt.FRAMEBUFFER,tt.COLOR_ATTACHMENT0,re.__webglTexture,rt||0,me)}mt=-1},this.readRenderTargetPixels=function(w,W,rt,ot,it,Nt,qt){if(!(w&&w.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let $t=ue.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&qt!==void 0&&($t=$t[qt]),$t){It.bindFramebuffer(tt.FRAMEBUFFER,$t);try{const re=w.texture,me=re.format,ce=re.type;if(me!==Ti&&zt.convert(me)!==tt.getParameter(tt.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const fe=ce===Ro&&(Xt.has("EXT_color_buffer_half_float")||ie.isWebGL2&&Xt.has("EXT_color_buffer_float"));if(ce!==Oa&&zt.convert(ce)!==tt.getParameter(tt.IMPLEMENTATION_COLOR_READ_TYPE)&&!(ce===Da&&(ie.isWebGL2||Xt.has("OES_texture_float")||Xt.has("WEBGL_color_buffer_float")))&&!fe){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}W>=0&&W<=w.width-ot&&rt>=0&&rt<=w.height-it&&tt.readPixels(W,rt,ot,it,zt.convert(me),zt.convert(ce),Nt)}finally{const re=I!==null?ue.get(I).__webglFramebuffer:null;It.bindFramebuffer(tt.FRAMEBUFFER,re)}}},this.copyFramebufferToTexture=function(w,W,rt=0){const ot=Math.pow(2,-rt),it=Math.floor(W.image.width*ot),Nt=Math.floor(W.image.height*ot);L.setTexture2D(W,0),tt.copyTexSubImage2D(tt.TEXTURE_2D,rt,0,0,w.x,w.y,it,Nt),It.unbindTexture()},this.copyTextureToTexture=function(w,W,rt,ot=0){const it=W.image.width,Nt=W.image.height,qt=zt.convert(rt.format),$t=zt.convert(rt.type);L.setTexture2D(rt,0),tt.pixelStorei(tt.UNPACK_FLIP_Y_WEBGL,rt.flipY),tt.pixelStorei(tt.UNPACK_PREMULTIPLY_ALPHA_WEBGL,rt.premultiplyAlpha),tt.pixelStorei(tt.UNPACK_ALIGNMENT,rt.unpackAlignment),W.isDataTexture?tt.texSubImage2D(tt.TEXTURE_2D,ot,w.x,w.y,it,Nt,qt,$t,W.image.data):W.isCompressedTexture?tt.compressedTexSubImage2D(tt.TEXTURE_2D,ot,w.x,w.y,W.mipmaps[0].width,W.mipmaps[0].height,qt,W.mipmaps[0].data):tt.texSubImage2D(tt.TEXTURE_2D,ot,w.x,w.y,qt,$t,W.image),ot===0&&rt.generateMipmaps&&tt.generateMipmap(tt.TEXTURE_2D),It.unbindTexture()},this.copyTextureToTexture3D=function(w,W,rt,ot,it=0){if(D.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const Nt=w.max.x-w.min.x+1,qt=w.max.y-w.min.y+1,$t=w.max.z-w.min.z+1,re=zt.convert(ot.format),me=zt.convert(ot.type);let ce;if(ot.isData3DTexture)L.setTexture3D(ot,0),ce=tt.TEXTURE_3D;else if(ot.isDataArrayTexture||ot.isCompressedArrayTexture)L.setTexture2DArray(ot,0),ce=tt.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}tt.pixelStorei(tt.UNPACK_FLIP_Y_WEBGL,ot.flipY),tt.pixelStorei(tt.UNPACK_PREMULTIPLY_ALPHA_WEBGL,ot.premultiplyAlpha),tt.pixelStorei(tt.UNPACK_ALIGNMENT,ot.unpackAlignment);const fe=tt.getParameter(tt.UNPACK_ROW_LENGTH),Le=tt.getParameter(tt.UNPACK_IMAGE_HEIGHT),Mn=tt.getParameter(tt.UNPACK_SKIP_PIXELS),en=tt.getParameter(tt.UNPACK_SKIP_ROWS),wn=tt.getParameter(tt.UNPACK_SKIP_IMAGES),Ve=rt.isCompressedTexture?rt.mipmaps[it]:rt.image;tt.pixelStorei(tt.UNPACK_ROW_LENGTH,Ve.width),tt.pixelStorei(tt.UNPACK_IMAGE_HEIGHT,Ve.height),tt.pixelStorei(tt.UNPACK_SKIP_PIXELS,w.min.x),tt.pixelStorei(tt.UNPACK_SKIP_ROWS,w.min.y),tt.pixelStorei(tt.UNPACK_SKIP_IMAGES,w.min.z),rt.isDataTexture||rt.isData3DTexture?tt.texSubImage3D(ce,it,W.x,W.y,W.z,Nt,qt,$t,re,me,Ve.data):rt.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),tt.compressedTexSubImage3D(ce,it,W.x,W.y,W.z,Nt,qt,$t,re,Ve.data)):tt.texSubImage3D(ce,it,W.x,W.y,W.z,Nt,qt,$t,re,me,Ve),tt.pixelStorei(tt.UNPACK_ROW_LENGTH,fe),tt.pixelStorei(tt.UNPACK_IMAGE_HEIGHT,Le),tt.pixelStorei(tt.UNPACK_SKIP_PIXELS,Mn),tt.pixelStorei(tt.UNPACK_SKIP_ROWS,en),tt.pixelStorei(tt.UNPACK_SKIP_IMAGES,wn),it===0&&ot.generateMipmaps&&tt.generateMipmap(ce),It.unbindTexture()},this.initTexture=function(w){w.isCubeTexture?L.setTextureCube(w,0):w.isData3DTexture?L.setTexture3D(w,0):w.isDataArrayTexture||w.isCompressedArrayTexture?L.setTexture2DArray(w,0):L.setTexture2D(w,0),It.unbindTexture()},this.resetState=function(){G=0,F=0,I=null,It.reset(),ae.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Ji}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const i=this.getContext();i.drawingBufferColorSpace=e===bd?"display-p3":"srgb",i.unpackColorSpace=Fe.workingColorSpace===xc?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===bn?fr:Y_}set outputEncoding(e){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=e===fr?bn:$i}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(e){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=e}}class Bb extends gv{}Bb.prototype.isWebGL1Renderer=!0;class Ib extends Wn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,i){return super.copy(e,i),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const i=super.toJSON(e);return this.fog!==null&&(i.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(i.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(i.object.backgroundIntensity=this.backgroundIntensity),i}}class Fb extends Lo{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Qt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const L_=new Sn,Md=new $_,lc=new Mc,cc=new st;class U_ extends Wn{constructor(e=new ta,i=new Fb){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=i,this.updateMorphTargets()}copy(e,i){return super.copy(e,i),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,i){const r=this.geometry,l=this.matrixWorld,u=e.params.Points.threshold,h=r.drawRange;if(r.boundingSphere===null&&r.computeBoundingSphere(),lc.copy(r.boundingSphere),lc.applyMatrix4(l),lc.radius+=u,e.ray.intersectsSphere(lc)===!1)return;L_.copy(l).invert(),Md.copy(e.ray).applyMatrix4(L_);const d=u/((this.scale.x+this.scale.y+this.scale.z)/3),m=d*d,p=r.index,v=r.attributes.position;if(p!==null){const S=Math.max(0,h.start),y=Math.min(p.count,h.start+h.count);for(let b=S,A=y;b<A;b++){const x=p.getX(b);cc.fromBufferAttribute(v,x),N_(cc,x,m,l,e,i,this)}}else{const S=Math.max(0,h.start),y=Math.min(v.count,h.start+h.count);for(let b=S,A=y;b<A;b++)cc.fromBufferAttribute(v,b),N_(cc,b,m,l,e,i,this)}}updateMorphTargets(){const i=this.geometry.morphAttributes,r=Object.keys(i);if(r.length>0){const l=i[r[0]];if(l!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let u=0,h=l.length;u<h;u++){const d=l[u].name||String(u);this.morphTargetInfluences.push(0),this.morphTargetDictionary[d]=u}}}}}function N_(o,e,i,r,l,u,h){const d=Md.distanceSqToPoint(o);if(d<i){const m=new st;Md.closestPointToPoint(o,m),m.applyMatrix4(r);const p=l.ray.origin.distanceTo(m);if(p<l.near||p>l.far)return;u.push({distance:p,distanceToRay:Math.sqrt(d),point:m,index:e,face:null,object:h})}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Ed}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Ed);const O_={idle:{color:new Qt("#1FD5F9"),accent:new Qt("#7DEBFF"),speed:.2,amp:.2,pulse:.03},listening:{color:new Qt("#7DEBFF"),accent:new Qt("#1FD5F9"),speed:.45,amp:.55,pulse:.08},thinking:{color:new Qt("#9B8CFF"),accent:new Qt("#C9BFFF"),speed:.7,amp:.3,pulse:.04},speaking:{color:new Qt("#5EE8B3"),accent:new Qt("#A5F5D2"),speed:.55,amp:.7,pulse:.18},reassuring:{color:new Qt("#FFB36B"),accent:new Qt("#FFD6A8"),speed:.3,amp:.25,pulse:.04}},Hb={idle:{color:new Qt("#7BAA92"),accent:new Qt("#A8C9B5"),speed:.2,amp:.2,pulse:.03},listening:{color:new Qt("#5E9B85"),accent:new Qt("#A8C9B5"),speed:.45,amp:.55,pulse:.08},thinking:{color:new Qt("#9387B0"),accent:new Qt("#BCB2D0"),speed:.7,amp:.3,pulse:.04},speaking:{color:new Qt("#D89766"),accent:new Qt("#E8BC95"),speed:.55,amp:.7,pulse:.18},reassuring:{color:new Qt("#C19660"),accent:new Qt("#DDB58A"),speed:.3,amp:.25,pulse:.04}},Gb=`
  attribute float aSeed;
  uniform float uTime;
  uniform float uLevel;
  uniform float uAmp;
  uniform float uPointScale;
  varying float vGlow;
  varying float vRim;

  // Cheap pseudo-random hash — not true noise but enough for particle wobble.
  float hash31(vec3 p) {
    return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
  }

  void main() {
    vec3 base = position;
    float wobble = hash31(base * 2.7 + vec3(uTime, uTime * 0.8, uTime * 1.3) + aSeed * 6.2831);
    float disp = mix(0.008, 0.055, uLevel) * uAmp * (0.5 + wobble);
    vec3 p = base * (1.0 + disp);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    // Much smaller base point size — prevents oversized particle overlap (white bloom bug).
    float sizePx = (1.0 + uLevel * 2.0) * uPointScale * (26.0 / -mv.z);
    gl_PointSize = sizePx;

    vGlow = 0.45 + 0.15 * uLevel + 0.1 * wobble;

    // Rim-light: particles on the silhouette edge glow brighter
    vec3 normal = normalize(base);
    vec3 viewDir = normalize(-mv.xyz);
    vRim = 1.0 - abs(dot(normal, viewDir));
  }
`,Vb=`
  precision mediump float;
  uniform vec3 uColor;
  uniform vec3 uAccent;
  uniform float uAlpha;
  varying float vGlow;
  varying float vRim;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.0, d);
    float rim = pow(vRim, 1.6);
    vec3 col = mix(uColor, uAccent, a * 0.55) * vGlow;
    col += uAccent * rim * 0.18;
    gl_FragColor = vec4(col, a * uAlpha);
  }
`;function kb(o){const e=new Float32Array(o*3),i=new Float32Array(o),r=Math.PI*(3-Math.sqrt(5));for(let u=0;u<o;u+=1){const h=1-u/(o-1)*2,d=Math.sqrt(1-h*h),m=r*u;e[u*3]=Math.cos(m)*d,e[u*3+1]=h,e[u*3+2]=Math.sin(m)*d,i[u]=Math.random()}const l=new ta;return l.setAttribute("position",new mi(e,3)),l.setAttribute("aSeed",new mi(i,1)),l}function P_(o){return new za({uniforms:{uTime:{value:0},uLevel:{value:0},uAmp:{value:.3},uAlpha:{value:o.alpha},uPointScale:{value:o.pointScale},uColor:{value:new Qt("#1FD5F9")},uAccent:{value:new Qt("#7DEBFF")}},vertexShader:Gb,fragmentShader:Vb,transparent:!0,depthWrite:!1,blending:ud})}function Xb(){if(typeof window>"u")return 2048;const o=window.innerWidth<900;return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches??!1?1024:o?2048:4096}function Wb({audioLevel:o,state:e,theme:i="dark",size:r="lg",className:l}){const u=Wt.useRef(null),h=Wt.useRef(o),d=Wt.useRef(e),m=Wt.useRef(i);return h.current=o,d.current=e,m.current=i,Wt.useEffect(()=>{const p=u.current;if(!p)return;const g=Xb(),v=new Ib,S=new hi(45,1,.1,100);S.position.set(0,0,5.4);const y=new gv({alpha:!0,antialias:!0,powerPreference:"high-performance"});y.setPixelRatio(Math.min(window.devicePixelRatio,1.5)),y.setClearColor(0,0);const{clientWidth:b,clientHeight:A}=p;y.setSize(b||320,A||320,!1),y.domElement.style.width="100%",y.domElement.style.height="100%",y.domElement.style.display="block",p.appendChild(y.domElement);const x=kb(g),_=new To;v.add(_);const N=P_({alpha:.38,pointScale:1}),D=new U_(x,N);_.add(D);const P=P_({alpha:.5,pointScale:.6}),G=new U_(x,P);G.scale.setScalar(.72),_.add(G);let F=1,I=O_.idle.pulse;const mt=new Qt,C=new Qt,U=()=>{if(!p)return;const q=p.clientWidth||320,j=p.clientHeight||320;y.setSize(q,j,!1),S.aspect=q/j,S.updateProjectionMatrix()};U();const ut=typeof ResizeObserver<"u"?new ResizeObserver(U):null;ut?.observe(p),window.addEventListener("resize",U);let lt=0,yt=!1,X=performance.now();const $=()=>{if(yt)return;const q=performance.now(),j=Math.min((q-X)/1e3,.05);X=q;const ct=m.current==="light"?Hb:O_,R=ct[d.current]??ct.idle,k=h.current;for(const _t of[N,P]){const pt=_t.uniforms,Lt=k>pt.uLevel.value?.45:.7;pt.uLevel.value+=(k-pt.uLevel.value)*Lt,pt.uAmp.value+=(R.amp-pt.uAmp.value)*.08,mt.copy(pt.uColor.value).lerp(R.color,.08),C.copy(pt.uAccent.value).lerp(R.accent,.08),pt.uColor.value.copy(mt),pt.uAccent.value.copy(C),pt.uTime.value+=j*R.speed}P.uniforms.uAmp.value=N.uniforms.uAmp.value*1.25;const Q=N.uniforms.uLevel.value;D.rotation.y+=j*.08*(1+Q*2.2),D.rotation.x+=j*.02,G.rotation.y=-D.rotation.y*1.3,G.rotation.z+=j*.15,I+=(R.pulse-I)*.08;const B=1+Q*I,J=B>F?.5:.75;F+=(B-F)*J,_.scale.setScalar(F),y.render(v,S),lt=requestAnimationFrame($)};lt=requestAnimationFrame($);const O=()=>{document.hidden?(lt&&cancelAnimationFrame(lt),lt=0):!lt&&!yt&&(X=performance.now(),lt=requestAnimationFrame($))};return document.addEventListener("visibilitychange",O),()=>{yt=!0,document.removeEventListener("visibilitychange",O),window.removeEventListener("resize",U),ut?.disconnect(),lt&&cancelAnimationFrame(lt),x.dispose(),N.dispose(),P.dispose(),y.dispose(),y.domElement.parentNode&&y.domElement.parentNode.removeChild(y.domElement)}},[]),Ft.jsx("div",{ref:u,"data-patient-orb-state":e,className:`patient-aura patient-aura--${r}${l?` ${l}`:""}`})}const We={introSubtitle:"화면을 시작하면 제가 계속 듣고 도와드릴게요.",welcomeSubtitle:"안녕하세요. 천천히 이야기해 주세요.",preparingGreeting:"잠시만요, AI가 인사를 준비하고 있어요…",preparingHint:"곧 첫 인사를 시작할게요.",listening:"마이크가 켜져 있어요.",thinking:"들은 내용을 정리하고 있어요.",cameraPermission:"카메라 권한을 허용해 주세요.",micPermission:"마이크 권한을 허용해 주세요.",unsupported:"이 브라우저에서는 상시 듣기 기능을 완전히 사용하기 어려워요.",transcriptEmpty:"듣고 있어요.",proactive:"먼저 말을 걸었어요.",uploadError:"듣는 도중 잠시 문제가 있었어요.",voiceDetectedPrefix:"들은 말: ",needUserId:"메인 화면에서 사용자 ID를 먼저 입력해 주세요.",secureNeeded:"이 기기에서는 카메라와 마이크를 쓰려면 HTTPS 주소가 필요해요. 같은 PC라면 http://127.0.0.1:8000/ 로 열어 주세요.",micTooQuiet:"주변 소리는 건너뛰고 있어요. 화면 가까이에서 조금 더 또렷하게 말씀해 주세요.",noSpeech:"음성이 감지되지 않았어요. 마이크 가까이에서 다시 말씀해 주세요."},qb=.19,Yb=2.2,jb=3e4,Zb=4,Kb=9e4,Qb=650,Jb=90,$b=48;function tA(o){return`${o}-${Math.random().toString(36).slice(2,9)}`}let uc=null;function fc(){if(uc)return uc;try{localStorage.removeItem("patient_screen_session_id")}catch{}return uc=tA("patient"),uc}function Eo(){return localStorage.getItem("demo_user_id")||""}function eA(o){const e=String(o||"").trim().toUpperCase();return e?(localStorage.setItem("demo_user_id",e),e):(localStorage.removeItem("demo_user_id"),"")}function nA(){return["localhost","127.0.0.1"].includes(window.location.hostname)}function iA(o,e){const i=o.includes("?")?"&":"?";return`${o}${i}v=${encodeURIComponent(e)}`}function cd(o,e){return Math.hypot(o.x-e.x,o.y-e.y)}function z_(o,e){const[i,r,l,u,h,d]=e.map(g=>o[g]),m=cd(r,d)+cd(l,h),p=cd(i,u);return p?m/(2*p):1}function aA(o,e){if(!e)return"connecting";switch(o){case"listening":return"listening";case"thinking":return"thinking";case"speaking":return"speaking";case"reassuring":return"thinking";default:return"idle"}}const rA=Wt.memo(function({hidden:e,auraState:i,visualState:r,sessionRef:l,visualStateRef:u,theme:h}){const[d,m]=Wt.useState(0);return Wt.useEffect(()=>{let p=0,g=0,v=0,S=null,y=null;const b=(x,_)=>{let N=_;(!N||N.length!==x.frequencyBinCount)&&(N=new Uint8Array(x.frequencyBinCount)),x.getByteFrequencyData(N);const D=Math.max(8,Math.floor(N.length*.2));let P=0;for(let G=0;G<D;G+=1)P+=N[G]??0;return[P/D/255,N]},A=x=>{const _=l.current;if(_?.playCtx&&_.playCtx.state==="suspended"&&_.playCtx.resume().catch(()=>{}),!_)v=0,S=null,y=null;else{let N=0,D=0;if(_.micAnalyser){const G=b(_.micAnalyser,S);N=G[0],S=G[1]}if(_.ttsAnalyser){const G=b(_.ttsAnalyser,y);D=G[0],y=G[1]}const P=Math.max(N,D);v=v*.72+P*.28}if(x-g>=$b){g=x;const N=v<.015?0:Math.min(v*1.6,1);m(D=>D===N?D:N)}p=requestAnimationFrame(A)};return p=requestAnimationFrame(A),()=>{cancelAnimationFrame(p)}},[l,u]),Ft.jsx("div",{className:`jarvis-bg ${e?"jarvis-bg--dim":""}`,"aria-hidden":"true",children:Ft.jsx(Wb,{size:"lg",state:r,audioLevel:d,theme:h})})});function sA(){const o=window.location.origin,e=new URLSearchParams(window.location.search).get("debug")==="1",[i,r]=Wt.useState(We.introSubtitle),[l,u]=Wt.useState(We.transcriptEmpty),[h,d]=Wt.useState(!1),[m,p]=Wt.useState(!0),[g,v]=Wt.useState("사용자 ID를 입력한 뒤 시작해 주세요."),[S,y]=Wt.useState(()=>Eo()),[b,A]=Wt.useState({visible:!1,text:"준비 중...",pct:0}),[x,_]=Wt.useState(!1),[N,D]=Wt.useState("idle"),[P,G]=Wt.useState(null),[F,I]=Wt.useState(!1),[mt,C]=Wt.useState(!1),[U,ut]=Wt.useState(!1),[lt,yt]=Wt.useState(["F1","F2","F3","F4","F5","M1","M2","M3","M4","M5"]),[X,$]=Wt.useState("F3"),[O,q]=Wt.useState({face:"none",eyes:"unknown",event:"idle"}),[j,ct]=Wt.useState(!1),[R,k]=Wt.useState(()=>{if(typeof window>"u")return"dark";try{return window.localStorage.getItem("remini_theme")==="light"?"light":"dark"}catch{return"dark"}});Wt.useEffect(()=>{if(!(typeof document>"u")){document.documentElement.dataset.theme=R,document.body.dataset.theme=R;try{window.localStorage.setItem("remini_theme",R)}catch{}}},[R]);const Q=Wt.useRef(null),B=Wt.useRef(null),J=Wt.useRef(""),_t=Wt.useRef(null),pt=Wt.useRef(null),Lt=Wt.useRef(null),Pt=Wt.useRef(!1),jt=Wt.useRef(null),Kt=Wt.useRef({face_detected:0,eyes_closed:0}),oe=Wt.useRef(null),tt=Wt.useRef(null),qe=Wt.useRef(0),Xt=Wt.useRef(null),ie=Wt.useRef(null),It=Wt.useRef(null),Se=Wt.useRef(null),ue=Wt.useRef(null),L=Wt.useRef(!0),T=Wt.useRef("idle"),et=Wt.useRef(!1),St=Wt.useRef(!1),vt=Wt.useRef(0),Mt=Wt.useRef(O),Ut=ft=>{T.current=ft,D(ft)},Tt=()=>{try{let Rt=B.current?.playCtx??null;if(!Rt){if(!Se.current){const Ke=window.AudioContext||window.webkitAudioContext;if(!Ke)return;Se.current=new Ke}Rt=Se.current}if(!Rt)return;Rt.state==="suspended"&&Rt.resume();const Ot=Rt.currentTime,Et=Rt.createOscillator(),Bt=Rt.createGain();Et.type="sine",Et.frequency.value=523.25,Et.connect(Bt),Bt.connect(Rt.destination),Bt.gain.setValueAtTime(1e-4,Ot),Bt.gain.exponentialRampToValueAtTime(.22,Ot+.025),Bt.gain.exponentialRampToValueAtTime(1e-4,Ot+.45),Et.start(Ot),Et.stop(Ot+.5);const le=Rt.createOscillator(),Pe=Rt.createGain();le.type="sine",le.frequency.value=783.99,le.connect(Pe),Pe.connect(Rt.destination),Pe.gain.setValueAtTime(1e-4,Ot+.09),Pe.gain.exponentialRampToValueAtTime(.18,Ot+.115),Pe.gain.exponentialRampToValueAtTime(1e-4,Ot+.65),le.start(Ot+.09),le.stop(Ot+.7)}catch{}};Wt.useEffect(()=>{if(!mt||U)return;const ft=new Set(["ArrowRight","ArrowLeft","ArrowUp","ArrowDown","PageDown","PageUp"," ","Enter"]),Rt=Ot=>{const Et=Ot.target;if(Et){const Bt=Et.tagName;if(Bt==="INPUT"||Bt==="TEXTAREA"||Et.isContentEditable)return}ft.has(Ot.key)&&(Ot.preventDefault(),B.current?.sendEndOfTurn(),C(!1),Tt())};return window.addEventListener("keydown",Rt),()=>window.removeEventListener("keydown",Rt)},[mt,U]),Wt.useEffect(()=>{if(!mt||U)return;const ft=Rt=>{const Ot=Rt.target;if(!Ot)return;const Et=Ot.tagName;Et==="INPUT"||Et==="TEXTAREA"||Ot.isContentEditable||Ot.closest(".admin-toggle-btn")||Ot.closest(".admin-drawer")||Ot.closest(".end-turn-btn")||(B.current?.sendEndOfTurn(),C(!1),Tt())};return window.addEventListener("pointerdown",ft),()=>window.removeEventListener("pointerdown",ft)},[mt,U]),Wt.useEffect(()=>{if(!j)return;let ft=null,Rt=!1;const Ot=async()=>{try{const Bt=navigator.wakeLock;if(!Bt||Rt)return;ft=await Bt.request("screen")}catch{}},Et=()=>{document.visibilityState==="visible"&&!Rt&&Ot()};return Ot(),document.addEventListener("visibilitychange",Et),()=>{Rt=!0,document.removeEventListener("visibilitychange",Et),ft?.release?.().catch(()=>{})}},[j]);const Dt=ft=>{L.current=ft,p(ft)},Gt=(ft,Rt)=>{A({visible:!0,pct:ft,text:Rt})},kt=(ft,Rt,Ot)=>{if(!e)return;const Et={face:ft,eyes:Rt,event:Ot},Bt=Mt.current;Bt.face===Et.face&&Bt.eyes===Et.eyes&&Bt.event===Et.event||(Mt.current=Et,q(Et))},xt=()=>{oe.current&&(window.clearTimeout(oe.current),oe.current=null),tt.current&&(window.clearTimeout(tt.current),tt.current=null)},be=()=>{oe.current&&(window.clearTimeout(oe.current),oe.current=null),Xt.current&&(I(!0),tt.current&&window.clearTimeout(tt.current),tt.current=window.setTimeout(()=>{Xt.current=null,qe.current=0,G(null),I(!1),tt.current=null},Qb))},he=(ft,Rt)=>{xt();const Ot=iA(ft,Rt);Xt.current=Ot,qe.current=Zb,I(!1),G(Ot),oe.current=window.setTimeout(()=>{oe.current=null,be()},Kb)},ee=()=>{Xt.current&&(tt.current||(qe.current=Math.max(0,qe.current-1),qe.current<=0&&be()))},Vt=()=>{if(It.current){try{It.current.stop?.()}catch{}try{It.current.disconnect()}catch{}It.current=null}if(ie.current){try{ie.current.pause()}catch{}ie.current=null}ue.current&&(URL.revokeObjectURL(ue.current),ue.current=null),B.current?.setMicEnabled?.(!0)},zt=()=>{Lt.current!==null&&(cancelAnimationFrame(Lt.current),Lt.current=null),pt.current&&(pt.current.getTracks().forEach(ft=>ft.stop()),pt.current=null),Q.current&&(Q.current.srcObject=null),vt.current=0},ae=async()=>{if(!B.current)return;const ft=B.current;B.current=null;try{await ft.stop()}catch{}},ye=()=>window.isSecureContext||nA()?!0:(r(We.secureNeeded),u(We.secureNeeded),v(We.secureNeeded),!1),Ge=async(ft,Rt)=>{const Ot=fc(),Et=Eo()||null;let Bt;try{Bt=await fetch(`${o}/tts`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text:ft,session_id:Ot,user_id:Et})})}catch{return!1}if(!Bt.ok)return!1;const le=await Bt.arrayBuffer();if(!le.byteLength)return!1;const Pe=B.current,Ke=Pe?.playCtx;if(Ke&&Ke.state!=="closed")try{Ke.state==="suspended"&&await Ke.resume();const Rn=await Ke.decodeAudioData(le.slice(0)),cn=Ke.createBufferSource();cn.buffer=Rn;const qn=Pe?.ttsAnalyser;qn?cn.connect(qn):cn.connect(Ke.destination),Vt(),It.current=cn,B.current?.setMicEnabled?.(!1),Ut("speaking"),C(!1);const Nn=()=>{if(It.current===cn){try{cn.disconnect()}catch{}It.current=null}et.current&&(Ut("listening"),u(We.listening),St.current=!0,C(!0),Tt()),B.current?.setMicEnabled?.(!0)};return cn.onended=Nn,Rt?.onAboutToStart?.(),cn.start(),!0}catch(Rn){console.warn("[playTtsReply] BufferSource decode failed, falling back to HTMLAudio:",Rn,{ctxState:Ke?.state,byteLength:le.byteLength})}const we=new Blob([le]);if(!we.size)return!1;Vt();const Ae=URL.createObjectURL(we),Bn=new Audio(Ae);ue.current=Ae,ie.current=Bn,B.current?.setMicEnabled?.(!1),Ut("speaking"),C(!1);const xn=()=>{Vt(),et.current&&(Ut("listening"),u(We.listening),St.current=!0,C(!0),Tt())};Bn.onended=xn,Bn.onerror=xn;try{const Rn=Bn.play();Rt?.onAboutToStart?.(),await Rn}catch{return xn(),!1}return!0},de=async(ft,Rt,Ot=0,Et=0)=>{if(!et.current||T.current==="speaking")return;const Bt=Eo();if(!Bt)return;const le=Date.now(),Pe=ft==="silence"?12e3:jb;if(le-(Kt.current[ft]||0)<Pe)return;B.current?.setMicEnabled?.(!1);let Ke=!0;try{const we=await fetch(`${o}/proactive-event`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({session_id:fc(),user_id:Bt,event_type:ft,confidence:Rt,eyes_closed_seconds:Ot,silence_seconds:Et})}),Ae=await we.json();if(!we.ok)throw new Error(Ae?.detail||"proactive failed");kt(Pt.current?"detected":"none",Ot>0?`closed ${Ot.toFixed(1)}s`:"normal",`${ft} => ${Ae.triggered?"triggered":Ae.reason}`),(Ae.triggered||ft!=="silence")&&(Kt.current[ft]=le),Ae.triggered&&Ae.reply&&(Ae.memory_photo?.image_url&&he(Ae.memory_photo.image_url,Ae.memory_photo.updated_at||Date.now()),u(We.proactive),Ut("reassuring"),Ke=!1,ft==="session_start"?Ge(Ae.reply,{onAboutToStart:()=>r(Ae.reply)}).catch(()=>{Ut("reassuring"),B.current?.setMicEnabled?.(!0)}):(r(Ae.reply),Ge(Ae.reply).catch(()=>{Ut("reassuring"),B.current?.setMicEnabled?.(!0)})))}catch(we){const Ae=we instanceof Error?we.message:"unknown error";kt(Pt.current?"detected":"none",Ot>0?`closed ${Ot.toFixed(1)}s`:"normal",`error: ${Ae}`),ft==="session_start"&&(r("AI 서버에 연결하지 못했어요. 잠시 후 다시 시도해 주세요."),u(We.listening),Ut("reassuring"),C(!0))}finally{Ke&&B.current?.setMicEnabled?.(!0)}},bt=async ft=>{if(!!!(ft.multiFaceLandmarks&&ft.multiFaceLandmarks.length>0)){Pt.current=!1,jt.current=null,kt("none","unknown","waiting");return}const Ot=ft.multiFaceLandmarks?.[0];if(!Ot)return;Pt.current=!0;const Et=z_(Ot,[33,160,158,133,153,144]),Bt=z_(Ot,[362,385,387,263,373,380]),le=(Et+Bt)/2;le<qb?jt.current||(jt.current=Date.now()):jt.current=null;const Pe=jt.current?(Date.now()-jt.current)/1e3:0;Pe>=Yb&&de("eyes_closed",.9,Pe,0),kt("detected",`ear=${le.toFixed(3)}`,Pe>0?`closed ${Pe.toFixed(1)}s`:"normal")},H=async()=>{if(_t.current)return _t.current;if(!window.FaceMesh)throw new Error("MediaPipe load failed");const ft=new window.FaceMesh({locateFile:Rt=>`https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${Rt}`});return ft.setOptions({maxNumFaces:1,refineLandmarks:!0,minDetectionConfidence:.5,minTrackingConfidence:.5}),ft.onResults(Rt=>{bt(Rt)}),_t.current=ft,ft},At=async()=>{const ft=await H(),Rt=await navigator.mediaDevices.getUserMedia({audio:!1,video:{facingMode:{ideal:"user"},width:{ideal:640},height:{ideal:360}}});if(pt.current=Rt,!Q.current)return;Q.current.srcObject=Rt,await Q.current.play();const Ot=async Et=>{if(Q.current){if(Et-vt.current>=Jb){vt.current=Et;try{await ft.send({image:Q.current})}catch(Bt){const le=Bt instanceof Error?Bt.message:"camera error";kt("error","error",`camera: ${le}`)}}Lt.current=requestAnimationFrame(Ot)}};Lt.current=requestAnimationFrame(Ot)},Ct=async()=>{if(B.current&&await ae(),typeof window.VoiceLoopSession!="function")throw new Error("voice-loop.js not loaded");const Rt=`${window.location.protocol==="https:"?"wss":"ws"}://${window.location.host}/ws/patient`;J.current="";const Ot=new window.VoiceLoopSession({url:Rt,sessionId:fc(),userId:Eo(),on:{ready:()=>{u(We.listening),St.current&&C(!0),T.current!=="speaking"&&Ut("listening")},state:Et=>{Et==="LISTENING"?(u(We.listening),St.current&&C(!0),T.current!=="speaking"&&(B.current?.setMicEnabled?.(!0),Ut("listening"))):Et==="RESPONDING"&&(B.current?.setMicEnabled?.(!1),C(!1),Ut("speaking"))},interim:Et=>{Et&&T.current!=="speaking"&&(u(`${We.voiceDetectedPrefix}${Et}`),St.current&&C(!0),T.current!=="listening"&&Ut("listening"))},stt:Et=>{J.current="",u(`${We.voiceDetectedPrefix}${Et}`)},token:Et=>{J.current+=Et,r(J.current)},cancel:()=>{J.current="",r(""),Vt(),et.current&&T.current!=="listening"&&Ut("listening")},done:Et=>{const Bt=Et.reply||J.current;Bt&&r(Bt),J.current="",Et.memory_photo?.image_url?he(Et.memory_photo.image_url,Et.memory_photo.updated_at||Date.now()):ee(),Et.used_retrieval==="identity_resolved"&&(localStorage.removeItem("demo_user_id"),y(""))},ttsEnded:()=>{et.current&&T.current==="speaking"&&(B.current?.setMicEnabled?.(!0),Ut("listening"),u(We.listening),C(!0),Tt())},notice:Et=>{if(!et.current)return;const Bt=Et?.message||We.noSpeech;r(Bt),u(We.listening),B.current?.setMicEnabled?.(!0),Ut("listening"),C(!0)},error:Et=>{const Bt=Et||We.uploadError;u(Bt),r(`연결 오류: ${Bt}`),Ut("reassuring")}}});B.current=Ot,await Ot.start()},Jt=async()=>{try{const we=new Audio("data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA=");we.muted=!0,we.volume=0,we.play().then(()=>{try{we.pause()}catch{}}).catch(()=>{})}catch{}const ft=eA(S||Eo());if(!ft){r(We.needUserId),u(We.needUserId),v(We.needUserId);return}y(ft),v("사용자 ID 확인 중...");try{const we=await fetch(`${o}/patient/exists/${encodeURIComponent(ft)}`);if(we.ok&&!(await we.json()).exists){v(`'${ft}' 는 등록되지 않은 사용자 ID 입니다. 보호자에게 확인해 주세요.`);return}}catch{}if(!ye())return;const Rt=performance.now(),Ot=fetch(`${o}/warmup`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({user_id:ft})}).then(()=>!0).catch(()=>!1);Gt(15,"카메라·마이크 연결 중...");const Et=typeof window<"u"&&(window.navigator.standalone===!0||window.matchMedia&&window.matchMedia("(display-mode: standalone)").matches),Bt=performance.now(),le=performance.now(),Pe=we=>{const Ae=we instanceof Error?we.message:We.cameraPermission;return r(Ae),u(Ae),v(Ae),-1};let Ke=0;try{if(Et)Ke=await At().then(()=>Math.round(performance.now()-le)).catch(Pe),await Ct();else{const Nn=At().then(()=>Math.round(performance.now()-le)).catch(Pe),[w]=await Promise.all([Nn,Ct()]);Ke=w}const we=Math.round(performance.now()-Bt),Ae=window.__voiceLoopTimings||{},Bn=Object.entries(Ae).map(([Nn,w])=>`${Nn}=${w}`).join(" "),xn=`[측정 ${Et?"PWA":"Safari"}] total=${we}ms cam=${Ke}ms (${Bn})`;console.log(xn),e&&(v(xn),u(xn),r(xn)),Gt(30,"AI 깨우는 중...");const Rn=performance.now(),cn=window.setInterval(()=>{const Nn=(performance.now()-Rn)/1e3,w=Math.min(88,30+Math.floor(Nn/22*58));Gt(w,"AI 깨우는 중...")},400);try{await Ot}finally{window.clearInterval(cn)}const qn=Math.round(performance.now()-Rt);console.log(`[측정] warmup=${qn}ms`),Gt(90,"마지막 점검 중...")}catch(we){const Ae=we instanceof Error?we.message:We.micPermission;A({visible:!1,pct:0,text:"준비 중..."}),r(Ae),u(Ae),v(Ae);return}Gt(100,"준비 완료!"),et.current=!0,St.current=!1,ct(!0),_(!0),Dt(!1),A({visible:!1,pct:0,text:"준비 중..."}),P||r(We.preparingGreeting),u(We.preparingHint),d(!0),Ut("thinking"),de("session_start",1,0,0)};Wt.useEffect(()=>{if(!h)return;if(i&&i!==We.preparingGreeting){d(!1);return}const ft=window.setTimeout(()=>d(!1),3e4);return()=>window.clearTimeout(ft)},[h,i]),Wt.useEffect(()=>(kt("none","unknown","idle"),()=>{xt()}),[]),Wt.useEffect(()=>{(async()=>{try{const ft=await fetch(`${o}/tts/voices`);if(!ft.ok)return;const Rt=await ft.json();Array.isArray(Rt.voices)&&Rt.voices.length>0&&yt(Rt.voices),typeof Rt.current=="string"&&Rt.current&&$(Rt.current)}catch{}})()},[o]),Wt.useEffect(()=>{const ft=()=>{Vt(),ae(),zt(),be()};return window.addEventListener("beforeunload",ft),()=>{window.removeEventListener("beforeunload",ft),ft()}},[]);const Zt=Wt.useMemo(()=>{const ft=lt.filter(Ot=>Ot.startsWith("F")),Rt=lt.filter(Ot=>Ot.startsWith("M"));return{female:ft,male:Rt}},[lt]),Ce=aA(N,j);return Ft.jsxs("main",{className:"patient-root",children:[Ft.jsx("video",{ref:Q,className:"camera-feed",autoPlay:!0,muted:!0,playsInline:!0}),Ft.jsx(rA,{hidden:m,auraState:Ce,visualState:N,sessionRef:B,visualStateRef:T,theme:R}),P?Ft.jsx("section",{className:`memory-stage ${F?"memory-stage--fading":""}`,"aria-label":"memory photo",children:Ft.jsx("div",{className:"memory-frame",children:Ft.jsx("img",{src:P,alt:"회상 사진",className:"memory-image",onError:()=>be()})})},P):null,Ft.jsxs("section",{className:"subtitle-wrap",children:[h?Ft.jsxs("div",{className:"greeting-pending",role:"status","aria-live":"polite",children:[Ft.jsx("span",{className:"greeting-spinner","aria-hidden":"true"}),Ft.jsx("span",{className:"greeting-pending-text",children:i||We.preparingGreeting})]}):Ft.jsx("p",{id:"subtitleText",className:"subtitle",children:i}),Ft.jsx("p",{id:"listeningText",className:"listening-text",children:l}),Ft.jsx("button",{type:"button",className:`end-turn-btn ${mt?"":"hidden"}`,onClick:()=>{B.current?.sendEndOfTurn(),C(!1),Tt()},children:"말하기 완료"})]}),Ft.jsx("button",{type:"button",className:"admin-toggle-btn","aria-controls":"adminDrawer","aria-expanded":U,onClick:()=>ut(!0),children:"관리 패널"}),Ft.jsxs("section",{id:"adminDrawer",className:`admin-drawer ${U?"":"hidden"}`,"aria-hidden":!U,children:[Ft.jsx("div",{className:"admin-drawer-backdrop",onClick:()=>ut(!1)}),Ft.jsxs("div",{className:"admin-drawer-panel",children:[Ft.jsxs("div",{className:"admin-drawer-head",children:[Ft.jsxs("div",{children:[Ft.jsx("p",{className:"admin-kicker",children:"Patient Admin"}),Ft.jsx("h2",{className:"admin-title",children:"개발자 화면 기능"}),Ft.jsx("p",{className:"admin-copy",children:"이 패널 안에서 개발자용 화면의 기능을 그대로 사용할 수 있습니다."})]}),Ft.jsxs("div",{className:"admin-head-actions",children:[Ft.jsx("button",{type:"button",className:"admin-head-btn",onClick:()=>{const ft=document.getElementById("adminFrame");ft&&(ft.src="/admin")},children:"새로고침"}),Ft.jsx("button",{type:"button",className:"admin-head-btn primary",onClick:()=>ut(!1),children:"닫기"})]})]}),Ft.jsx("iframe",{id:"adminFrame",className:"admin-frame",title:"developer tools",src:U?"/admin":void 0,loading:"lazy"})]})]}),m?Ft.jsxs("section",{className:"start-overlay",children:[Ft.jsx("button",{type:"button",className:"theme-toggle",onClick:()=>k(ft=>ft==="dark"?"light":"dark"),"aria-label":R==="dark"?"라이트 모드로 전환":"다크 모드로 전환",children:R==="dark"?Ft.jsxs("svg",{width:"22",height:"22",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:[Ft.jsx("circle",{cx:"12",cy:"12",r:"4"}),Ft.jsx("path",{d:"M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"})]}):Ft.jsx("svg",{width:"22",height:"22",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:Ft.jsx("path",{d:"M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"})})}),Ft.jsxs("div",{className:"start-panel",children:[Ft.jsx("p",{className:"start-kicker",children:"Patient Mode"}),Ft.jsx("h1",{className:"start-title",children:"Remini"}),Ft.jsxs("p",{className:"start-copy",children:["시작을 누르면 카메라와 마이크 권한을 요청하고,",Ft.jsx("br",{}),"이후에는 자막과 시청각 화면만 남습니다."]}),Ft.jsxs("label",{className:"start-field",htmlFor:"patientUserId",children:[Ft.jsx("span",{className:"start-field-label",children:"사용자 ID"}),Ft.jsx("input",{id:"patientUserId",className:"start-input",type:"text",placeholder:"예: P001",value:S,onChange:ft=>{y(ft.target.value),v("사용자 ID를 입력한 뒤 시작해 주세요.")},onKeyDown:ft=>{ft.key==="Enter"&&(ft.preventDefault(),Jt())}})]}),b.visible?null:Ft.jsx("p",{className:"start-hint",children:g}),b.visible?null:Ft.jsx("button",{type:"button",className:"start-btn",onClick:()=>{Jt()},children:"시작하기"}),b.visible?Ft.jsxs("div",{className:"loading-wrap",children:[Ft.jsx("div",{className:"loading-spinner"}),Ft.jsx("p",{className:"loading-text",children:b.text}),Ft.jsx("div",{className:"loading-bar-track",children:Ft.jsx("div",{className:"loading-bar-fill",style:{width:`${b.pct}%`}})}),Ft.jsxs("p",{className:"loading-percent",children:[b.pct,"%"]})]}):null]})]}):null,Ft.jsxs("section",{className:"voice-picker",children:[Ft.jsx("label",{htmlFor:"voicePicker",children:"목소리"}),Ft.jsxs("select",{id:"voicePicker",value:X,onChange:async ft=>{const Rt=ft.target.value;$(Rt);try{await fetch(`${o}/tts/voices/${encodeURIComponent(Rt)}`,{method:"POST"})}catch{}},children:[Ft.jsx("optgroup",{label:"여성",children:Zt.female.map(ft=>Ft.jsx("option",{value:ft,children:ft},ft))}),Ft.jsx("optgroup",{label:"남성",children:Zt.male.map(ft=>Ft.jsx("option",{value:ft,children:ft},ft))})]})]}),e?Ft.jsxs("section",{className:"debug-panel",children:[Ft.jsx("p",{className:"debug-title",children:"DEBUG"}),Ft.jsxs("p",{className:"debug-line",children:["session: ",fc()]}),Ft.jsxs("p",{className:"debug-line",children:["face: ",O.face]}),Ft.jsxs("p",{className:"debug-line",children:["eyes: ",O.eyes]}),Ft.jsxs("p",{className:"debug-line",children:["event: ",O.event]})]}):null]})}CS.createRoot(document.getElementById("root")).render(Ft.jsx(sA,{}));
