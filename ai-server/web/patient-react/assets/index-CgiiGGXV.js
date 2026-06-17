(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))r(l);new MutationObserver(l=>{for(const u of l)if(u.type==="childList")for(const d of u.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&r(d)}).observe(document,{childList:!0,subtree:!0});function i(l){const u={};return l.integrity&&(u.integrity=l.integrity),l.referrerPolicy&&(u.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?u.credentials="include":l.crossOrigin==="anonymous"?u.credentials="omit":u.credentials="same-origin",u}function r(l){if(l.ep)return;l.ep=!0;const u=i(l);fetch(l.href,u)}})();var Af={exports:{}},go={};var ig;function xS(){if(ig)return go;ig=1;var o=Symbol.for("react.transitional.element"),e=Symbol.for("react.fragment");function i(r,l,u){var d=null;if(u!==void 0&&(d=""+u),l.key!==void 0&&(d=""+l.key),"key"in l){u={};for(var h in l)h!=="key"&&(u[h]=l[h])}else u=l;return l=u.ref,{$$typeof:o,type:r,key:d,ref:l!==void 0?l:null,props:u}}return go.Fragment=e,go.jsx=i,go.jsxs=i,go}var ag;function MS(){return ag||(ag=1,Af.exports=xS()),Af.exports}var Ft=MS(),Rf={exports:{}},_o={},wf={exports:{}},Cf={};var rg;function yS(){return rg||(rg=1,(function(o){function e(N,q){var K=N.length;N.push(q);t:for(;0<K;){var ct=K-1>>>1,R=N[ct];if(0<l(R,q))N[ct]=q,N[K]=R,K=ct;else break t}}function i(N){return N.length===0?null:N[0]}function r(N){if(N.length===0)return null;var q=N[0],K=N.pop();if(K!==q){N[0]=K;t:for(var ct=0,R=N.length,V=R>>>1;ct<V;){var j=2*(ct+1)-1,I=N[j],$=j+1,_t=N[$];if(0>l(I,K))$<R&&0>l(_t,I)?(N[ct]=_t,N[$]=K,ct=$):(N[ct]=I,N[j]=K,ct=j);else if($<R&&0>l(_t,K))N[ct]=_t,N[$]=K,ct=$;else break t}}return q}function l(N,q){var K=N.sortIndex-q.sortIndex;return K!==0?K:N.id-q.id}if(o.unstable_now=void 0,typeof performance=="object"&&typeof performance.now=="function"){var u=performance;o.unstable_now=function(){return u.now()}}else{var d=Date,h=d.now();o.unstable_now=function(){return d.now()-h}}var m=[],p=[],g=1,v=null,x=3,y=!1,A=!1,b=!1,S=!1,_=typeof setTimeout=="function"?setTimeout:null,P=typeof clearTimeout=="function"?clearTimeout:null,L=typeof setImmediate<"u"?setImmediate:null;function O(N){for(var q=i(p);q!==null;){if(q.callback===null)r(p);else if(q.startTime<=N)r(p),q.sortIndex=q.expirationTime,e(m,q);else break;q=i(p)}}function k(N){if(b=!1,O(N),!A)if(i(m)!==null)A=!0,F||(F=!0,ut());else{var q=i(p);q!==null&&J(k,q.startTime-N)}}var F=!1,B=-1,pt=5,w=-1;function U(){return S?!0:!(o.unstable_now()-w<pt)}function lt(){if(S=!1,F){var N=o.unstable_now();w=N;var q=!0;try{t:{A=!1,b&&(b=!1,P(B),B=-1),y=!0;var K=x;try{e:{for(O(N),v=i(m);v!==null&&!(v.expirationTime>N&&U());){var ct=v.callback;if(typeof ct=="function"){v.callback=null,x=v.priorityLevel;var R=ct(v.expirationTime<=N);if(N=o.unstable_now(),typeof R=="function"){v.callback=R,O(N),q=!0;break e}v===i(m)&&r(m),O(N)}else r(m);v=i(m)}if(v!==null)q=!0;else{var V=i(p);V!==null&&J(k,V.startTime-N),q=!1}}break t}finally{v=null,x=K,y=!1}q=void 0}}finally{q?ut():F=!1}}}var ut;if(typeof L=="function")ut=function(){L(lt)};else if(typeof MessageChannel<"u"){var Et=new MessageChannel,X=Et.port2;Et.port1.onmessage=lt,ut=function(){X.postMessage(null)}}else ut=function(){_(lt,0)};function J(N,q){B=_(function(){N(o.unstable_now())},q)}o.unstable_IdlePriority=5,o.unstable_ImmediatePriority=1,o.unstable_LowPriority=4,o.unstable_NormalPriority=3,o.unstable_Profiling=null,o.unstable_UserBlockingPriority=2,o.unstable_cancelCallback=function(N){N.callback=null},o.unstable_forceFrameRate=function(N){0>N||125<N?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):pt=0<N?Math.floor(1e3/N):5},o.unstable_getCurrentPriorityLevel=function(){return x},o.unstable_next=function(N){switch(x){case 1:case 2:case 3:var q=3;break;default:q=x}var K=x;x=q;try{return N()}finally{x=K}},o.unstable_requestPaint=function(){S=!0},o.unstable_runWithPriority=function(N,q){switch(N){case 1:case 2:case 3:case 4:case 5:break;default:N=3}var K=x;x=N;try{return q()}finally{x=K}},o.unstable_scheduleCallback=function(N,q,K){var ct=o.unstable_now();switch(typeof K=="object"&&K!==null?(K=K.delay,K=typeof K=="number"&&0<K?ct+K:ct):K=ct,N){case 1:var R=-1;break;case 2:R=250;break;case 5:R=1073741823;break;case 4:R=1e4;break;default:R=5e3}return R=K+R,N={id:g++,callback:q,priorityLevel:N,startTime:K,expirationTime:R,sortIndex:-1},K>ct?(N.sortIndex=K,e(p,N),i(m)===null&&N===i(p)&&(b?(P(B),B=-1):b=!0,J(k,K-ct))):(N.sortIndex=R,e(m,N),A||y||(A=!0,F||(F=!0,ut()))),N},o.unstable_shouldYield=U,o.unstable_wrapCallback=function(N){var q=x;return function(){var K=x;x=q;try{return N.apply(this,arguments)}finally{x=K}}}})(Cf)),Cf}var sg;function ES(){return sg||(sg=1,wf.exports=yS()),wf.exports}var Df={exports:{}},_e={};var og;function TS(){if(og)return _e;og=1;var o=Symbol.for("react.transitional.element"),e=Symbol.for("react.portal"),i=Symbol.for("react.fragment"),r=Symbol.for("react.strict_mode"),l=Symbol.for("react.profiler"),u=Symbol.for("react.consumer"),d=Symbol.for("react.context"),h=Symbol.for("react.forward_ref"),m=Symbol.for("react.suspense"),p=Symbol.for("react.memo"),g=Symbol.for("react.lazy"),v=Symbol.iterator;function x(R){return R===null||typeof R!="object"?null:(R=v&&R[v]||R["@@iterator"],typeof R=="function"?R:null)}var y={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},A=Object.assign,b={};function S(R,V,j){this.props=R,this.context=V,this.refs=b,this.updater=j||y}S.prototype.isReactComponent={},S.prototype.setState=function(R,V){if(typeof R!="object"&&typeof R!="function"&&R!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,R,V,"setState")},S.prototype.forceUpdate=function(R){this.updater.enqueueForceUpdate(this,R,"forceUpdate")};function _(){}_.prototype=S.prototype;function P(R,V,j){this.props=R,this.context=V,this.refs=b,this.updater=j||y}var L=P.prototype=new _;L.constructor=P,A(L,S.prototype),L.isPureReactComponent=!0;var O=Array.isArray,k={H:null,A:null,T:null,S:null,V:null},F=Object.prototype.hasOwnProperty;function B(R,V,j,I,$,_t){return j=_t.ref,{$$typeof:o,type:R,key:V,ref:j!==void 0?j:null,props:_t}}function pt(R,V){return B(R.type,V,void 0,void 0,void 0,R.props)}function w(R){return typeof R=="object"&&R!==null&&R.$$typeof===o}function U(R){var V={"=":"=0",":":"=2"};return"$"+R.replace(/[=:]/g,function(j){return V[j]})}var lt=/\/+/g;function ut(R,V){return typeof R=="object"&&R!==null&&R.key!=null?U(""+R.key):V.toString(36)}function Et(){}function X(R){switch(R.status){case"fulfilled":return R.value;case"rejected":throw R.reason;default:switch(typeof R.status=="string"?R.then(Et,Et):(R.status="pending",R.then(function(V){R.status==="pending"&&(R.status="fulfilled",R.value=V)},function(V){R.status==="pending"&&(R.status="rejected",R.reason=V)})),R.status){case"fulfilled":return R.value;case"rejected":throw R.reason}}throw R}function J(R,V,j,I,$){var _t=typeof R;(_t==="undefined"||_t==="boolean")&&(R=null);var vt=!1;if(R===null)vt=!0;else switch(_t){case"bigint":case"string":case"number":vt=!0;break;case"object":switch(R.$$typeof){case o:case e:vt=!0;break;case g:return vt=R._init,J(vt(R._payload),V,j,I,$)}}if(vt)return $=$(R),vt=I===""?"."+ut(R,0):I,O($)?(j="",vt!=null&&(j=vt.replace(lt,"$&/")+"/"),J($,V,j,"",function(Kt){return Kt})):$!=null&&(w($)&&($=pt($,j+($.key==null||R&&R.key===$.key?"":(""+$.key).replace(lt,"$&/")+"/")+vt)),V.push($)),1;vt=0;var Ot=I===""?".":I+":";if(O(R))for(var Pt=0;Pt<R.length;Pt++)I=R[Pt],_t=Ot+ut(I,Pt),vt+=J(I,V,j,_t,$);else if(Pt=x(R),typeof Pt=="function")for(R=Pt.call(R),Pt=0;!(I=R.next()).done;)I=I.value,_t=Ot+ut(I,Pt++),vt+=J(I,V,j,_t,$);else if(_t==="object"){if(typeof R.then=="function")return J(X(R),V,j,I,$);throw V=String(R),Error("Objects are not valid as a React child (found: "+(V==="[object Object]"?"object with keys {"+Object.keys(R).join(", ")+"}":V)+"). If you meant to render a collection of children, use an array instead.")}return vt}function N(R,V,j){if(R==null)return R;var I=[],$=0;return J(R,I,"","",function(_t){return V.call(j,_t,$++)}),I}function q(R){if(R._status===-1){var V=R._result;V=V(),V.then(function(j){(R._status===0||R._status===-1)&&(R._status=1,R._result=j)},function(j){(R._status===0||R._status===-1)&&(R._status=2,R._result=j)}),R._status===-1&&(R._status=0,R._result=V)}if(R._status===1)return R._result.default;throw R._result}var K=typeof reportError=="function"?reportError:function(R){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var V=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof R=="object"&&R!==null&&typeof R.message=="string"?String(R.message):String(R),error:R});if(!window.dispatchEvent(V))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",R);return}console.error(R)};function ct(){}return _e.Children={map:N,forEach:function(R,V,j){N(R,function(){V.apply(this,arguments)},j)},count:function(R){var V=0;return N(R,function(){V++}),V},toArray:function(R){return N(R,function(V){return V})||[]},only:function(R){if(!w(R))throw Error("React.Children.only expected to receive a single React element child.");return R}},_e.Component=S,_e.Fragment=i,_e.Profiler=l,_e.PureComponent=P,_e.StrictMode=r,_e.Suspense=m,_e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=k,_e.__COMPILER_RUNTIME={__proto__:null,c:function(R){return k.H.useMemoCache(R)}},_e.cache=function(R){return function(){return R.apply(null,arguments)}},_e.cloneElement=function(R,V,j){if(R==null)throw Error("The argument must be a React element, but you passed "+R+".");var I=A({},R.props),$=R.key,_t=void 0;if(V!=null)for(vt in V.ref!==void 0&&(_t=void 0),V.key!==void 0&&($=""+V.key),V)!F.call(V,vt)||vt==="key"||vt==="__self"||vt==="__source"||vt==="ref"&&V.ref===void 0||(I[vt]=V[vt]);var vt=arguments.length-2;if(vt===1)I.children=j;else if(1<vt){for(var Ot=Array(vt),Pt=0;Pt<vt;Pt++)Ot[Pt]=arguments[Pt+2];I.children=Ot}return B(R.type,$,void 0,void 0,_t,I)},_e.createContext=function(R){return R={$$typeof:d,_currentValue:R,_currentValue2:R,_threadCount:0,Provider:null,Consumer:null},R.Provider=R,R.Consumer={$$typeof:u,_context:R},R},_e.createElement=function(R,V,j){var I,$={},_t=null;if(V!=null)for(I in V.key!==void 0&&(_t=""+V.key),V)F.call(V,I)&&I!=="key"&&I!=="__self"&&I!=="__source"&&($[I]=V[I]);var vt=arguments.length-2;if(vt===1)$.children=j;else if(1<vt){for(var Ot=Array(vt),Pt=0;Pt<vt;Pt++)Ot[Pt]=arguments[Pt+2];$.children=Ot}if(R&&R.defaultProps)for(I in vt=R.defaultProps,vt)$[I]===void 0&&($[I]=vt[I]);return B(R,_t,void 0,void 0,null,$)},_e.createRef=function(){return{current:null}},_e.forwardRef=function(R){return{$$typeof:h,render:R}},_e.isValidElement=w,_e.lazy=function(R){return{$$typeof:g,_payload:{_status:-1,_result:R},_init:q}},_e.memo=function(R,V){return{$$typeof:p,type:R,compare:V===void 0?null:V}},_e.startTransition=function(R){var V=k.T,j={};k.T=j;try{var I=R(),$=k.S;$!==null&&$(j,I),typeof I=="object"&&I!==null&&typeof I.then=="function"&&I.then(ct,K)}catch(_t){K(_t)}finally{k.T=V}},_e.unstable_useCacheRefresh=function(){return k.H.useCacheRefresh()},_e.use=function(R){return k.H.use(R)},_e.useActionState=function(R,V,j){return k.H.useActionState(R,V,j)},_e.useCallback=function(R,V){return k.H.useCallback(R,V)},_e.useContext=function(R){return k.H.useContext(R)},_e.useDebugValue=function(){},_e.useDeferredValue=function(R,V){return k.H.useDeferredValue(R,V)},_e.useEffect=function(R,V,j){var I=k.H;if(typeof j=="function")throw Error("useEffect CRUD overload is not enabled in this build of React.");return I.useEffect(R,V)},_e.useId=function(){return k.H.useId()},_e.useImperativeHandle=function(R,V,j){return k.H.useImperativeHandle(R,V,j)},_e.useInsertionEffect=function(R,V){return k.H.useInsertionEffect(R,V)},_e.useLayoutEffect=function(R,V){return k.H.useLayoutEffect(R,V)},_e.useMemo=function(R,V){return k.H.useMemo(R,V)},_e.useOptimistic=function(R,V){return k.H.useOptimistic(R,V)},_e.useReducer=function(R,V,j){return k.H.useReducer(R,V,j)},_e.useRef=function(R){return k.H.useRef(R)},_e.useState=function(R){return k.H.useState(R)},_e.useSyncExternalStore=function(R,V,j){return k.H.useSyncExternalStore(R,V,j)},_e.useTransition=function(){return k.H.useTransition()},_e.version="19.1.0",_e}var lg;function Eh(){return lg||(lg=1,Df.exports=TS()),Df.exports}var Lf={exports:{}},Dn={};var cg;function bS(){if(cg)return Dn;cg=1;var o=Eh();function e(m){var p="https://react.dev/errors/"+m;if(1<arguments.length){p+="?args[]="+encodeURIComponent(arguments[1]);for(var g=2;g<arguments.length;g++)p+="&args[]="+encodeURIComponent(arguments[g])}return"Minified React error #"+m+"; visit "+p+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function i(){}var r={d:{f:i,r:function(){throw Error(e(522))},D:i,C:i,L:i,m:i,X:i,S:i,M:i},p:0,findDOMNode:null},l=Symbol.for("react.portal");function u(m,p,g){var v=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:l,key:v==null?null:""+v,children:m,containerInfo:p,implementation:g}}var d=o.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function h(m,p){if(m==="font")return"";if(typeof p=="string")return p==="use-credentials"?p:""}return Dn.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=r,Dn.createPortal=function(m,p){var g=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!p||p.nodeType!==1&&p.nodeType!==9&&p.nodeType!==11)throw Error(e(299));return u(m,p,null,g)},Dn.flushSync=function(m){var p=d.T,g=r.p;try{if(d.T=null,r.p=2,m)return m()}finally{d.T=p,r.p=g,r.d.f()}},Dn.preconnect=function(m,p){typeof m=="string"&&(p?(p=p.crossOrigin,p=typeof p=="string"?p==="use-credentials"?p:"":void 0):p=null,r.d.C(m,p))},Dn.prefetchDNS=function(m){typeof m=="string"&&r.d.D(m)},Dn.preinit=function(m,p){if(typeof m=="string"&&p&&typeof p.as=="string"){var g=p.as,v=h(g,p.crossOrigin),x=typeof p.integrity=="string"?p.integrity:void 0,y=typeof p.fetchPriority=="string"?p.fetchPriority:void 0;g==="style"?r.d.S(m,typeof p.precedence=="string"?p.precedence:void 0,{crossOrigin:v,integrity:x,fetchPriority:y}):g==="script"&&r.d.X(m,{crossOrigin:v,integrity:x,fetchPriority:y,nonce:typeof p.nonce=="string"?p.nonce:void 0})}},Dn.preinitModule=function(m,p){if(typeof m=="string")if(typeof p=="object"&&p!==null){if(p.as==null||p.as==="script"){var g=h(p.as,p.crossOrigin);r.d.M(m,{crossOrigin:g,integrity:typeof p.integrity=="string"?p.integrity:void 0,nonce:typeof p.nonce=="string"?p.nonce:void 0})}}else p==null&&r.d.M(m)},Dn.preload=function(m,p){if(typeof m=="string"&&typeof p=="object"&&p!==null&&typeof p.as=="string"){var g=p.as,v=h(g,p.crossOrigin);r.d.L(m,g,{crossOrigin:v,integrity:typeof p.integrity=="string"?p.integrity:void 0,nonce:typeof p.nonce=="string"?p.nonce:void 0,type:typeof p.type=="string"?p.type:void 0,fetchPriority:typeof p.fetchPriority=="string"?p.fetchPriority:void 0,referrerPolicy:typeof p.referrerPolicy=="string"?p.referrerPolicy:void 0,imageSrcSet:typeof p.imageSrcSet=="string"?p.imageSrcSet:void 0,imageSizes:typeof p.imageSizes=="string"?p.imageSizes:void 0,media:typeof p.media=="string"?p.media:void 0})}},Dn.preloadModule=function(m,p){if(typeof m=="string")if(p){var g=h(p.as,p.crossOrigin);r.d.m(m,{as:typeof p.as=="string"&&p.as!=="script"?p.as:void 0,crossOrigin:g,integrity:typeof p.integrity=="string"?p.integrity:void 0})}else r.d.m(m)},Dn.requestFormReset=function(m){r.d.r(m)},Dn.unstable_batchedUpdates=function(m,p){return m(p)},Dn.useFormState=function(m,p,g){return d.H.useFormState(m,p,g)},Dn.useFormStatus=function(){return d.H.useHostTransitionStatus()},Dn.version="19.1.0",Dn}var ug;function AS(){if(ug)return Lf.exports;ug=1;function o(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(o)}catch(e){console.error(e)}}return o(),Lf.exports=bS(),Lf.exports}var fg;function RS(){if(fg)return _o;fg=1;var o=ES(),e=Eh(),i=AS();function r(t){var n="https://react.dev/errors/"+t;if(1<arguments.length){n+="?args[]="+encodeURIComponent(arguments[1]);for(var a=2;a<arguments.length;a++)n+="&args[]="+encodeURIComponent(arguments[a])}return"Minified React error #"+t+"; visit "+n+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function l(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)}function u(t){var n=t,a=t;if(t.alternate)for(;n.return;)n=n.return;else{t=n;do n=t,(n.flags&4098)!==0&&(a=n.return),t=n.return;while(t)}return n.tag===3?a:null}function d(t){if(t.tag===13){var n=t.memoizedState;if(n===null&&(t=t.alternate,t!==null&&(n=t.memoizedState)),n!==null)return n.dehydrated}return null}function h(t){if(u(t)!==t)throw Error(r(188))}function m(t){var n=t.alternate;if(!n){if(n=u(t),n===null)throw Error(r(188));return n!==t?null:t}for(var a=t,s=n;;){var c=a.return;if(c===null)break;var f=c.alternate;if(f===null){if(s=c.return,s!==null){a=s;continue}break}if(c.child===f.child){for(f=c.child;f;){if(f===a)return h(c),t;if(f===s)return h(c),n;f=f.sibling}throw Error(r(188))}if(a.return!==s.return)a=c,s=f;else{for(var M=!1,E=c.child;E;){if(E===a){M=!0,a=c,s=f;break}if(E===s){M=!0,s=c,a=f;break}E=E.sibling}if(!M){for(E=f.child;E;){if(E===a){M=!0,a=f,s=c;break}if(E===s){M=!0,s=f,a=c;break}E=E.sibling}if(!M)throw Error(r(189))}}if(a.alternate!==s)throw Error(r(190))}if(a.tag!==3)throw Error(r(188));return a.stateNode.current===a?t:n}function p(t){var n=t.tag;if(n===5||n===26||n===27||n===6)return t;for(t=t.child;t!==null;){if(n=p(t),n!==null)return n;t=t.sibling}return null}var g=Object.assign,v=Symbol.for("react.element"),x=Symbol.for("react.transitional.element"),y=Symbol.for("react.portal"),A=Symbol.for("react.fragment"),b=Symbol.for("react.strict_mode"),S=Symbol.for("react.profiler"),_=Symbol.for("react.provider"),P=Symbol.for("react.consumer"),L=Symbol.for("react.context"),O=Symbol.for("react.forward_ref"),k=Symbol.for("react.suspense"),F=Symbol.for("react.suspense_list"),B=Symbol.for("react.memo"),pt=Symbol.for("react.lazy"),w=Symbol.for("react.activity"),U=Symbol.for("react.memo_cache_sentinel"),lt=Symbol.iterator;function ut(t){return t===null||typeof t!="object"?null:(t=lt&&t[lt]||t["@@iterator"],typeof t=="function"?t:null)}var Et=Symbol.for("react.client.reference");function X(t){if(t==null)return null;if(typeof t=="function")return t.$$typeof===Et?null:t.displayName||t.name||null;if(typeof t=="string")return t;switch(t){case A:return"Fragment";case S:return"Profiler";case b:return"StrictMode";case k:return"Suspense";case F:return"SuspenseList";case w:return"Activity"}if(typeof t=="object")switch(t.$$typeof){case y:return"Portal";case L:return(t.displayName||"Context")+".Provider";case P:return(t._context.displayName||"Context")+".Consumer";case O:var n=t.render;return t=t.displayName,t||(t=n.displayName||n.name||"",t=t!==""?"ForwardRef("+t+")":"ForwardRef"),t;case B:return n=t.displayName||null,n!==null?n:X(t.type)||"Memo";case pt:n=t._payload,t=t._init;try{return X(t(n))}catch{}}return null}var J=Array.isArray,N=e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,q=i.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,K={pending:!1,data:null,method:null,action:null},ct=[],R=-1;function V(t){return{current:t}}function j(t){0>R||(t.current=ct[R],ct[R]=null,R--)}function I(t,n){R++,ct[R]=t.current,t.current=n}var $=V(null),_t=V(null),vt=V(null),Ot=V(null);function Pt(t,n){switch(I(vt,n),I(_t,t),I($,null),n.nodeType){case 9:case 11:t=(t=n.documentElement)&&(t=t.namespaceURI)?Lm(t):0;break;default:if(t=n.tagName,n=n.namespaceURI)n=Lm(n),t=Um(n,t);else switch(t){case"svg":t=1;break;case"math":t=2;break;default:t=0}}j($),I($,t)}function Kt(){j($),j(_t),j(vt)}function kt(t){t.memoizedState!==null&&I(Ot,t);var n=$.current,a=Um(n,t.type);n!==a&&(I(_t,t),I($,a))}function oe(t){_t.current===t&&(j($),j(_t)),Ot.current===t&&(j(Ot),uo._currentValue=K)}var nt=Object.prototype.hasOwnProperty,Ze=o.unstable_scheduleCallback,Wt=o.unstable_cancelCallback,Qt=o.unstable_shouldYield,Ht=o.unstable_requestPaint,Se=o.unstable_now,de=o.unstable_getCurrentPriorityLevel,D=o.unstable_ImmediatePriority,T=o.unstable_UserBlockingPriority,tt=o.unstable_NormalPriority,yt=o.unstable_LowPriority,xt=o.unstable_IdlePriority,gt=o.log,Bt=o.unstable_setDisableYieldValue,At=null,Dt=null;function Xt(t){if(typeof gt=="function"&&Bt(t),Dt&&typeof Dt.setStrictMode=="function")try{Dt.setStrictMode(At,t)}catch{}}var Vt=Math.clz32?Math.clz32:ue,Mt=Math.log,Ee=Math.LN2;function ue(t){return t>>>=0,t===0?32:31-(Mt(t)/Ee|0)|0}var ne=256,Gt=4194304;function zt(t){var n=t&42;if(n!==0)return n;switch(t&-t){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t&4194048;case 4194304:case 8388608:case 16777216:case 33554432:return t&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return t}}function ae(t,n,a){var s=t.pendingLanes;if(s===0)return 0;var c=0,f=t.suspendedLanes,M=t.pingedLanes;t=t.warmLanes;var E=s&134217727;return E!==0?(s=E&~f,s!==0?c=zt(s):(M&=E,M!==0?c=zt(M):a||(a=E&~t,a!==0&&(c=zt(a))))):(E=s&~f,E!==0?c=zt(E):M!==0?c=zt(M):a||(a=s&~t,a!==0&&(c=zt(a)))),c===0?0:n!==0&&n!==c&&(n&f)===0&&(f=c&-c,a=n&-n,f>=a||f===32&&(a&4194048)!==0)?n:c}function Te(t,n){return(t.pendingLanes&~(t.suspendedLanes&~t.pingedLanes)&n)===0}function Ge(t,n){switch(t){case 1:case 2:case 4:case 8:case 64:return n+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function fe(){var t=ne;return ne<<=1,(ne&4194048)===0&&(ne=256),t}function Tt(){var t=Gt;return Gt<<=1,(Gt&62914560)===0&&(Gt=4194304),t}function H(t){for(var n=[],a=0;31>a;a++)n.push(t);return n}function bt(t,n){t.pendingLanes|=n,n!==268435456&&(t.suspendedLanes=0,t.pingedLanes=0,t.warmLanes=0)}function Ct(t,n,a,s,c,f){var M=t.pendingLanes;t.pendingLanes=a,t.suspendedLanes=0,t.pingedLanes=0,t.warmLanes=0,t.expiredLanes&=a,t.entangledLanes&=a,t.errorRecoveryDisabledLanes&=a,t.shellSuspendCounter=0;var E=t.entanglements,z=t.expirationTimes,Q=t.hiddenUpdates;for(a=M&~a;0<a;){var ft=31-Vt(a),mt=1<<ft;E[ft]=0,z[ft]=-1;var et=Q[ft];if(et!==null)for(Q[ft]=null,ft=0;ft<et.length;ft++){var at=et[ft];at!==null&&(at.lane&=-536870913)}a&=~mt}s!==0&&Jt(t,s,0),f!==0&&c===0&&t.tag!==0&&(t.suspendedLanes|=f&~(M&~n))}function Jt(t,n,a){t.pendingLanes|=n,t.suspendedLanes&=~n;var s=31-Vt(n);t.entangledLanes|=n,t.entanglements[s]=t.entanglements[s]|1073741824|a&4194090}function Zt(t,n){var a=t.entangledLanes|=n;for(t=t.entanglements;a;){var s=31-Vt(a),c=1<<s;c&n|t[s]&n&&(t[s]|=n),a&=~c}}function we(t){switch(t){case 2:t=1;break;case 8:t=4;break;case 32:t=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:t=128;break;case 268435456:t=134217728;break;default:t=0}return t}function ht(t){return t&=-t,2<t?8<t?(t&134217727)!==0?32:268435456:8:2}function Rt(){var t=q.p;return t!==0?t:(t=window.event,t===void 0?32:Qm(t.type))}function Ut(t,n){var a=q.p;try{return q.p=t,n()}finally{q.p=a}}var St=Math.random().toString(36).slice(2),Lt="__reactFiber$"+St,$t="__reactProps$"+St,he="__reactContainer$"+St,Ce="__reactEvents$"+St,vn="__reactListeners$"+St,Le="__reactHandles$"+St,An="__reactResources$"+St,Rn="__reactMarker$"+St;function zn(t){delete t[Lt],delete t[$t],delete t[Ce],delete t[vn],delete t[Le]}function Sn(t){var n=t[Lt];if(n)return n;for(var a=t.parentNode;a;){if(n=a[he]||a[Lt]){if(a=n.alternate,n.child!==null||a!==null&&a.child!==null)for(t=zm(t);t!==null;){if(a=t[Lt])return a;t=zm(t)}return n}t=a,a=t.parentNode}return null}function pi(t){if(t=t[Lt]||t[he]){var n=t.tag;if(n===5||n===6||n===13||n===26||n===27||n===3)return t}return null}function Di(t){var n=t.tag;if(n===5||n===26||n===27||n===6)return t.stateNode;throw Error(r(33))}function C(t){var n=t[An];return n||(n=t[An]={hoistableStyles:new Map,hoistableScripts:new Map}),n}function W(t){t[Rn]=!0}var rt=new Set,ot={};function it(t,n){Nt(t,n),Nt(t+"Capture",n)}function Nt(t,n){for(ot[t]=n,t=0;t<n.length;t++)rt.add(n[t])}var Yt=RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),te={},re={};function ge(t){return nt.call(re,t)?!0:nt.call(te,t)?!1:Yt.test(t)?re[t]=!0:(te[t]=!0,!1)}function le(t,n,a){if(ge(n))if(a===null)t.removeAttribute(n);else{switch(typeof a){case"undefined":case"function":case"symbol":t.removeAttribute(n);return;case"boolean":var s=n.toLowerCase().slice(0,5);if(s!=="data-"&&s!=="aria-"){t.removeAttribute(n);return}}t.setAttribute(n,""+a)}}function ce(t,n,a){if(a===null)t.removeAttribute(n);else{switch(typeof a){case"undefined":case"function":case"symbol":case"boolean":t.removeAttribute(n);return}t.setAttribute(n,""+a)}}function Ue(t,n,a,s){if(s===null)t.removeAttribute(a);else{switch(typeof s){case"undefined":case"function":case"symbol":case"boolean":t.removeAttribute(a);return}t.setAttributeNS(n,a,""+s)}}var xn,tn;function wn(t){if(xn===void 0)try{throw Error()}catch(a){var n=a.stack.trim().match(/\n( *(at )?)/);xn=n&&n[1]||"",tn=-1<a.stack.indexOf(`
    at`)?" (<anonymous>)":-1<a.stack.indexOf("@")?"@unknown:0:0":""}return`
`+xn+t+tn}var Ve=!1;function me(t,n){if(!t||Ve)return"";Ve=!0;var a=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var s={DetermineComponentFrameRoot:function(){try{if(n){var mt=function(){throw Error()};if(Object.defineProperty(mt.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(mt,[])}catch(at){var et=at}Reflect.construct(t,[],mt)}else{try{mt.call()}catch(at){et=at}t.call(mt.prototype)}}else{try{throw Error()}catch(at){et=at}(mt=t())&&typeof mt.catch=="function"&&mt.catch(function(){})}}catch(at){if(at&&et&&typeof at.stack=="string")return[at.stack,et.stack]}return[null,null]}};s.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var c=Object.getOwnPropertyDescriptor(s.DetermineComponentFrameRoot,"name");c&&c.configurable&&Object.defineProperty(s.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var f=s.DetermineComponentFrameRoot(),M=f[0],E=f[1];if(M&&E){var z=M.split(`
`),Q=E.split(`
`);for(c=s=0;s<z.length&&!z[s].includes("DetermineComponentFrameRoot");)s++;for(;c<Q.length&&!Q[c].includes("DetermineComponentFrameRoot");)c++;if(s===z.length||c===Q.length)for(s=z.length-1,c=Q.length-1;1<=s&&0<=c&&z[s]!==Q[c];)c--;for(;1<=s&&0<=c;s--,c--)if(z[s]!==Q[c]){if(s!==1||c!==1)do if(s--,c--,0>c||z[s]!==Q[c]){var ft=`
`+z[s].replace(" at new "," at ");return t.displayName&&ft.includes("<anonymous>")&&(ft=ft.replace("<anonymous>",t.displayName)),ft}while(1<=s&&0<=c);break}}}finally{Ve=!1,Error.prepareStackTrace=a}return(a=t?t.displayName||t.name:"")?wn(a):""}function xs(t){switch(t.tag){case 26:case 27:case 5:return wn(t.type);case 16:return wn("Lazy");case 13:return wn("Suspense");case 19:return wn("SuspenseList");case 0:case 15:return me(t.type,!1);case 11:return me(t.type.render,!1);case 1:return me(t.type,!0);case 31:return wn("Activity");default:return""}}function qe(t){try{var n="";do n+=xs(t),t=t.return;while(t);return n}catch(a){return`
Error generating stack: `+a.message+`
`+a.stack}}function an(t){switch(typeof t){case"bigint":case"boolean":case"number":case"string":case"undefined":return t;case"object":return t;default:return""}}function Ms(t){var n=t.type;return(t=t.nodeName)&&t.toLowerCase()==="input"&&(n==="checkbox"||n==="radio")}function Ba(t){var n=Ms(t)?"checked":"value",a=Object.getOwnPropertyDescriptor(t.constructor.prototype,n),s=""+t[n];if(!t.hasOwnProperty(n)&&typeof a<"u"&&typeof a.get=="function"&&typeof a.set=="function"){var c=a.get,f=a.set;return Object.defineProperty(t,n,{configurable:!0,get:function(){return c.call(this)},set:function(M){s=""+M,f.call(this,M)}}),Object.defineProperty(t,n,{enumerable:a.enumerable}),{getValue:function(){return s},setValue:function(M){s=""+M},stopTracking:function(){t._valueTracker=null,delete t[n]}}}}function ea(t){t._valueTracker||(t._valueTracker=Ba(t))}function ln(t){if(!t)return!1;var n=t._valueTracker;if(!n)return!0;var a=n.getValue(),s="";return t&&(s=Ms(t)?t.checked?"true":"false":t.value),t=s,t!==a?(n.setValue(t),!0):!1}function ei(t){if(t=t||(typeof document<"u"?document:void 0),typeof t>"u")return null;try{return t.activeElement||t.body}catch{return t.body}}var ys=/[\n"\\]/g;function Ye(t){return t.replace(ys,function(n){return"\\"+n.charCodeAt(0).toString(16)+" "})}function Ia(t,n,a,s,c,f,M,E){t.name="",M!=null&&typeof M!="function"&&typeof M!="symbol"&&typeof M!="boolean"?t.type=M:t.removeAttribute("type"),n!=null?M==="number"?(n===0&&t.value===""||t.value!=n)&&(t.value=""+an(n)):t.value!==""+an(n)&&(t.value=""+an(n)):M!=="submit"&&M!=="reset"||t.removeAttribute("value"),n!=null?pr(t,M,an(n)):a!=null?pr(t,M,an(a)):s!=null&&t.removeAttribute("value"),c==null&&f!=null&&(t.defaultChecked=!!f),c!=null&&(t.checked=c&&typeof c!="function"&&typeof c!="symbol"),E!=null&&typeof E!="function"&&typeof E!="symbol"&&typeof E!="boolean"?t.name=""+an(E):t.removeAttribute("name")}function No(t,n,a,s,c,f,M,E){if(f!=null&&typeof f!="function"&&typeof f!="symbol"&&typeof f!="boolean"&&(t.type=f),n!=null||a!=null){if(!(f!=="submit"&&f!=="reset"||n!=null))return;a=a!=null?""+an(a):"",n=n!=null?""+an(n):a,E||n===t.value||(t.value=n),t.defaultValue=n}s=s??c,s=typeof s!="function"&&typeof s!="symbol"&&!!s,t.checked=E?t.checked:!!s,t.defaultChecked=!!s,M!=null&&typeof M!="function"&&typeof M!="symbol"&&typeof M!="boolean"&&(t.name=M)}function pr(t,n,a){n==="number"&&ei(t.ownerDocument)===t||t.defaultValue===""+a||(t.defaultValue=""+a)}function mr(t,n,a,s){if(t=t.options,n){n={};for(var c=0;c<a.length;c++)n["$"+a[c]]=!0;for(a=0;a<t.length;a++)c=n.hasOwnProperty("$"+t[a].value),t[a].selected!==c&&(t[a].selected=c),c&&s&&(t[a].defaultSelected=!0)}else{for(a=""+an(a),n=null,c=0;c<t.length;c++){if(t[c].value===a){t[c].selected=!0,s&&(t[c].defaultSelected=!0);return}n!==null||t[c].disabled||(n=t[c])}n!==null&&(n.selected=!0)}}function Ch(t,n,a){if(n!=null&&(n=""+an(n),n!==t.value&&(t.value=n),a==null)){t.defaultValue!==n&&(t.defaultValue=n);return}t.defaultValue=a!=null?""+an(a):""}function Dh(t,n,a,s){if(n==null){if(s!=null){if(a!=null)throw Error(r(92));if(J(s)){if(1<s.length)throw Error(r(93));s=s[0]}a=s}a==null&&(a=""),n=a}a=an(n),t.defaultValue=a,s=t.textContent,s===a&&s!==""&&s!==null&&(t.value=s)}function gr(t,n){if(n){var a=t.firstChild;if(a&&a===t.lastChild&&a.nodeType===3){a.nodeValue=n;return}}t.textContent=n}var _v=new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));function Lh(t,n,a){var s=n.indexOf("--")===0;a==null||typeof a=="boolean"||a===""?s?t.setProperty(n,""):n==="float"?t.cssFloat="":t[n]="":s?t.setProperty(n,a):typeof a!="number"||a===0||_v.has(n)?n==="float"?t.cssFloat=a:t[n]=(""+a).trim():t[n]=a+"px"}function Uh(t,n,a){if(n!=null&&typeof n!="object")throw Error(r(62));if(t=t.style,a!=null){for(var s in a)!a.hasOwnProperty(s)||n!=null&&n.hasOwnProperty(s)||(s.indexOf("--")===0?t.setProperty(s,""):s==="float"?t.cssFloat="":t[s]="");for(var c in n)s=n[c],n.hasOwnProperty(c)&&a[c]!==s&&Lh(t,c,s)}else for(var f in n)n.hasOwnProperty(f)&&Lh(t,f,n[f])}function Tc(t){if(t.indexOf("-")===-1)return!1;switch(t){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var vv=new Map([["acceptCharset","accept-charset"],["htmlFor","for"],["httpEquiv","http-equiv"],["crossOrigin","crossorigin"],["accentHeight","accent-height"],["alignmentBaseline","alignment-baseline"],["arabicForm","arabic-form"],["baselineShift","baseline-shift"],["capHeight","cap-height"],["clipPath","clip-path"],["clipRule","clip-rule"],["colorInterpolation","color-interpolation"],["colorInterpolationFilters","color-interpolation-filters"],["colorProfile","color-profile"],["colorRendering","color-rendering"],["dominantBaseline","dominant-baseline"],["enableBackground","enable-background"],["fillOpacity","fill-opacity"],["fillRule","fill-rule"],["floodColor","flood-color"],["floodOpacity","flood-opacity"],["fontFamily","font-family"],["fontSize","font-size"],["fontSizeAdjust","font-size-adjust"],["fontStretch","font-stretch"],["fontStyle","font-style"],["fontVariant","font-variant"],["fontWeight","font-weight"],["glyphName","glyph-name"],["glyphOrientationHorizontal","glyph-orientation-horizontal"],["glyphOrientationVertical","glyph-orientation-vertical"],["horizAdvX","horiz-adv-x"],["horizOriginX","horiz-origin-x"],["imageRendering","image-rendering"],["letterSpacing","letter-spacing"],["lightingColor","lighting-color"],["markerEnd","marker-end"],["markerMid","marker-mid"],["markerStart","marker-start"],["overlinePosition","overline-position"],["overlineThickness","overline-thickness"],["paintOrder","paint-order"],["panose-1","panose-1"],["pointerEvents","pointer-events"],["renderingIntent","rendering-intent"],["shapeRendering","shape-rendering"],["stopColor","stop-color"],["stopOpacity","stop-opacity"],["strikethroughPosition","strikethrough-position"],["strikethroughThickness","strikethrough-thickness"],["strokeDasharray","stroke-dasharray"],["strokeDashoffset","stroke-dashoffset"],["strokeLinecap","stroke-linecap"],["strokeLinejoin","stroke-linejoin"],["strokeMiterlimit","stroke-miterlimit"],["strokeOpacity","stroke-opacity"],["strokeWidth","stroke-width"],["textAnchor","text-anchor"],["textDecoration","text-decoration"],["textRendering","text-rendering"],["transformOrigin","transform-origin"],["underlinePosition","underline-position"],["underlineThickness","underline-thickness"],["unicodeBidi","unicode-bidi"],["unicodeRange","unicode-range"],["unitsPerEm","units-per-em"],["vAlphabetic","v-alphabetic"],["vHanging","v-hanging"],["vIdeographic","v-ideographic"],["vMathematical","v-mathematical"],["vectorEffect","vector-effect"],["vertAdvY","vert-adv-y"],["vertOriginX","vert-origin-x"],["vertOriginY","vert-origin-y"],["wordSpacing","word-spacing"],["writingMode","writing-mode"],["xmlnsXlink","xmlns:xlink"],["xHeight","x-height"]]),Sv=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function Oo(t){return Sv.test(""+t)?"javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')":t}var bc=null;function Ac(t){return t=t.target||t.srcElement||window,t.correspondingUseElement&&(t=t.correspondingUseElement),t.nodeType===3?t.parentNode:t}var _r=null,vr=null;function Nh(t){var n=pi(t);if(n&&(t=n.stateNode)){var a=t[$t]||null;t:switch(t=n.stateNode,n.type){case"input":if(Ia(t,a.value,a.defaultValue,a.defaultValue,a.checked,a.defaultChecked,a.type,a.name),n=a.name,a.type==="radio"&&n!=null){for(a=t;a.parentNode;)a=a.parentNode;for(a=a.querySelectorAll('input[name="'+Ye(""+n)+'"][type="radio"]'),n=0;n<a.length;n++){var s=a[n];if(s!==t&&s.form===t.form){var c=s[$t]||null;if(!c)throw Error(r(90));Ia(s,c.value,c.defaultValue,c.defaultValue,c.checked,c.defaultChecked,c.type,c.name)}}for(n=0;n<a.length;n++)s=a[n],s.form===t.form&&ln(s)}break t;case"textarea":Ch(t,a.value,a.defaultValue);break t;case"select":n=a.value,n!=null&&mr(t,!!a.multiple,n,!1)}}}var Rc=!1;function Oh(t,n,a){if(Rc)return t(n,a);Rc=!0;try{var s=t(n);return s}finally{if(Rc=!1,(_r!==null||vr!==null)&&(Sl(),_r&&(n=_r,t=vr,vr=_r=null,Nh(n),t)))for(n=0;n<t.length;n++)Nh(t[n])}}function Es(t,n){var a=t.stateNode;if(a===null)return null;var s=a[$t]||null;if(s===null)return null;a=s[n];t:switch(n){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(s=!s.disabled)||(t=t.type,s=!(t==="button"||t==="input"||t==="select"||t==="textarea")),t=!s;break t;default:t=!1}if(t)return null;if(a&&typeof a!="function")throw Error(r(231,n,typeof a));return a}var Li=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),wc=!1;if(Li)try{var Ts={};Object.defineProperty(Ts,"passive",{get:function(){wc=!0}}),window.addEventListener("test",Ts,Ts),window.removeEventListener("test",Ts,Ts)}catch{wc=!1}var na=null,Cc=null,Po=null;function Ph(){if(Po)return Po;var t,n=Cc,a=n.length,s,c="value"in na?na.value:na.textContent,f=c.length;for(t=0;t<a&&n[t]===c[t];t++);var M=a-t;for(s=1;s<=M&&n[a-s]===c[f-s];s++);return Po=c.slice(t,1<s?1-s:void 0)}function zo(t){var n=t.keyCode;return"charCode"in t?(t=t.charCode,t===0&&n===13&&(t=13)):t=n,t===10&&(t=13),32<=t||t===13?t:0}function Bo(){return!0}function zh(){return!1}function Bn(t){function n(a,s,c,f,M){this._reactName=a,this._targetInst=c,this.type=s,this.nativeEvent=f,this.target=M,this.currentTarget=null;for(var E in t)t.hasOwnProperty(E)&&(a=t[E],this[E]=a?a(f):f[E]);return this.isDefaultPrevented=(f.defaultPrevented!=null?f.defaultPrevented:f.returnValue===!1)?Bo:zh,this.isPropagationStopped=zh,this}return g(n.prototype,{preventDefault:function(){this.defaultPrevented=!0;var a=this.nativeEvent;a&&(a.preventDefault?a.preventDefault():typeof a.returnValue!="unknown"&&(a.returnValue=!1),this.isDefaultPrevented=Bo)},stopPropagation:function(){var a=this.nativeEvent;a&&(a.stopPropagation?a.stopPropagation():typeof a.cancelBubble!="unknown"&&(a.cancelBubble=!0),this.isPropagationStopped=Bo)},persist:function(){},isPersistent:Bo}),n}var Fa={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(t){return t.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Io=Bn(Fa),bs=g({},Fa,{view:0,detail:0}),xv=Bn(bs),Dc,Lc,As,Fo=g({},bs,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Nc,button:0,buttons:0,relatedTarget:function(t){return t.relatedTarget===void 0?t.fromElement===t.srcElement?t.toElement:t.fromElement:t.relatedTarget},movementX:function(t){return"movementX"in t?t.movementX:(t!==As&&(As&&t.type==="mousemove"?(Dc=t.screenX-As.screenX,Lc=t.screenY-As.screenY):Lc=Dc=0,As=t),Dc)},movementY:function(t){return"movementY"in t?t.movementY:Lc}}),Bh=Bn(Fo),Mv=g({},Fo,{dataTransfer:0}),yv=Bn(Mv),Ev=g({},bs,{relatedTarget:0}),Uc=Bn(Ev),Tv=g({},Fa,{animationName:0,elapsedTime:0,pseudoElement:0}),bv=Bn(Tv),Av=g({},Fa,{clipboardData:function(t){return"clipboardData"in t?t.clipboardData:window.clipboardData}}),Rv=Bn(Av),wv=g({},Fa,{data:0}),Ih=Bn(wv),Cv={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Dv={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Lv={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Uv(t){var n=this.nativeEvent;return n.getModifierState?n.getModifierState(t):(t=Lv[t])?!!n[t]:!1}function Nc(){return Uv}var Nv=g({},bs,{key:function(t){if(t.key){var n=Cv[t.key]||t.key;if(n!=="Unidentified")return n}return t.type==="keypress"?(t=zo(t),t===13?"Enter":String.fromCharCode(t)):t.type==="keydown"||t.type==="keyup"?Dv[t.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Nc,charCode:function(t){return t.type==="keypress"?zo(t):0},keyCode:function(t){return t.type==="keydown"||t.type==="keyup"?t.keyCode:0},which:function(t){return t.type==="keypress"?zo(t):t.type==="keydown"||t.type==="keyup"?t.keyCode:0}}),Ov=Bn(Nv),Pv=g({},Fo,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Fh=Bn(Pv),zv=g({},bs,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Nc}),Bv=Bn(zv),Iv=g({},Fa,{propertyName:0,elapsedTime:0,pseudoElement:0}),Fv=Bn(Iv),Hv=g({},Fo,{deltaX:function(t){return"deltaX"in t?t.deltaX:"wheelDeltaX"in t?-t.wheelDeltaX:0},deltaY:function(t){return"deltaY"in t?t.deltaY:"wheelDeltaY"in t?-t.wheelDeltaY:"wheelDelta"in t?-t.wheelDelta:0},deltaZ:0,deltaMode:0}),Gv=Bn(Hv),Vv=g({},Fa,{newState:0,oldState:0}),kv=Bn(Vv),Xv=[9,13,27,32],Oc=Li&&"CompositionEvent"in window,Rs=null;Li&&"documentMode"in document&&(Rs=document.documentMode);var Wv=Li&&"TextEvent"in window&&!Rs,Hh=Li&&(!Oc||Rs&&8<Rs&&11>=Rs),Gh=" ",Vh=!1;function kh(t,n){switch(t){case"keyup":return Xv.indexOf(n.keyCode)!==-1;case"keydown":return n.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Xh(t){return t=t.detail,typeof t=="object"&&"data"in t?t.data:null}var Sr=!1;function qv(t,n){switch(t){case"compositionend":return Xh(n);case"keypress":return n.which!==32?null:(Vh=!0,Gh);case"textInput":return t=n.data,t===Gh&&Vh?null:t;default:return null}}function Yv(t,n){if(Sr)return t==="compositionend"||!Oc&&kh(t,n)?(t=Ph(),Po=Cc=na=null,Sr=!1,t):null;switch(t){case"paste":return null;case"keypress":if(!(n.ctrlKey||n.altKey||n.metaKey)||n.ctrlKey&&n.altKey){if(n.char&&1<n.char.length)return n.char;if(n.which)return String.fromCharCode(n.which)}return null;case"compositionend":return Hh&&n.locale!=="ko"?null:n.data;default:return null}}var jv={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Wh(t){var n=t&&t.nodeName&&t.nodeName.toLowerCase();return n==="input"?!!jv[t.type]:n==="textarea"}function qh(t,n,a,s){_r?vr?vr.push(s):vr=[s]:_r=s,n=bl(n,"onChange"),0<n.length&&(a=new Io("onChange","change",null,a,s),t.push({event:a,listeners:n}))}var ws=null,Cs=null;function Zv(t){Am(t,0)}function Ho(t){var n=Di(t);if(ln(n))return t}function Yh(t,n){if(t==="change")return n}var jh=!1;if(Li){var Pc;if(Li){var zc="oninput"in document;if(!zc){var Zh=document.createElement("div");Zh.setAttribute("oninput","return;"),zc=typeof Zh.oninput=="function"}Pc=zc}else Pc=!1;jh=Pc&&(!document.documentMode||9<document.documentMode)}function Kh(){ws&&(ws.detachEvent("onpropertychange",Qh),Cs=ws=null)}function Qh(t){if(t.propertyName==="value"&&Ho(Cs)){var n=[];qh(n,Cs,t,Ac(t)),Oh(Zv,n)}}function Kv(t,n,a){t==="focusin"?(Kh(),ws=n,Cs=a,ws.attachEvent("onpropertychange",Qh)):t==="focusout"&&Kh()}function Qv(t){if(t==="selectionchange"||t==="keyup"||t==="keydown")return Ho(Cs)}function Jv(t,n){if(t==="click")return Ho(n)}function $v(t,n){if(t==="input"||t==="change")return Ho(n)}function t0(t,n){return t===n&&(t!==0||1/t===1/n)||t!==t&&n!==n}var Wn=typeof Object.is=="function"?Object.is:t0;function Ds(t,n){if(Wn(t,n))return!0;if(typeof t!="object"||t===null||typeof n!="object"||n===null)return!1;var a=Object.keys(t),s=Object.keys(n);if(a.length!==s.length)return!1;for(s=0;s<a.length;s++){var c=a[s];if(!nt.call(n,c)||!Wn(t[c],n[c]))return!1}return!0}function Jh(t){for(;t&&t.firstChild;)t=t.firstChild;return t}function $h(t,n){var a=Jh(t);t=0;for(var s;a;){if(a.nodeType===3){if(s=t+a.textContent.length,t<=n&&s>=n)return{node:a,offset:n-t};t=s}t:{for(;a;){if(a.nextSibling){a=a.nextSibling;break t}a=a.parentNode}a=void 0}a=Jh(a)}}function td(t,n){return t&&n?t===n?!0:t&&t.nodeType===3?!1:n&&n.nodeType===3?td(t,n.parentNode):"contains"in t?t.contains(n):t.compareDocumentPosition?!!(t.compareDocumentPosition(n)&16):!1:!1}function ed(t){t=t!=null&&t.ownerDocument!=null&&t.ownerDocument.defaultView!=null?t.ownerDocument.defaultView:window;for(var n=ei(t.document);n instanceof t.HTMLIFrameElement;){try{var a=typeof n.contentWindow.location.href=="string"}catch{a=!1}if(a)t=n.contentWindow;else break;n=ei(t.document)}return n}function Bc(t){var n=t&&t.nodeName&&t.nodeName.toLowerCase();return n&&(n==="input"&&(t.type==="text"||t.type==="search"||t.type==="tel"||t.type==="url"||t.type==="password")||n==="textarea"||t.contentEditable==="true")}var e0=Li&&"documentMode"in document&&11>=document.documentMode,xr=null,Ic=null,Ls=null,Fc=!1;function nd(t,n,a){var s=a.window===a?a.document:a.nodeType===9?a:a.ownerDocument;Fc||xr==null||xr!==ei(s)||(s=xr,"selectionStart"in s&&Bc(s)?s={start:s.selectionStart,end:s.selectionEnd}:(s=(s.ownerDocument&&s.ownerDocument.defaultView||window).getSelection(),s={anchorNode:s.anchorNode,anchorOffset:s.anchorOffset,focusNode:s.focusNode,focusOffset:s.focusOffset}),Ls&&Ds(Ls,s)||(Ls=s,s=bl(Ic,"onSelect"),0<s.length&&(n=new Io("onSelect","select",null,n,a),t.push({event:n,listeners:s}),n.target=xr)))}function Ha(t,n){var a={};return a[t.toLowerCase()]=n.toLowerCase(),a["Webkit"+t]="webkit"+n,a["Moz"+t]="moz"+n,a}var Mr={animationend:Ha("Animation","AnimationEnd"),animationiteration:Ha("Animation","AnimationIteration"),animationstart:Ha("Animation","AnimationStart"),transitionrun:Ha("Transition","TransitionRun"),transitionstart:Ha("Transition","TransitionStart"),transitioncancel:Ha("Transition","TransitionCancel"),transitionend:Ha("Transition","TransitionEnd")},Hc={},id={};Li&&(id=document.createElement("div").style,"AnimationEvent"in window||(delete Mr.animationend.animation,delete Mr.animationiteration.animation,delete Mr.animationstart.animation),"TransitionEvent"in window||delete Mr.transitionend.transition);function Ga(t){if(Hc[t])return Hc[t];if(!Mr[t])return t;var n=Mr[t],a;for(a in n)if(n.hasOwnProperty(a)&&a in id)return Hc[t]=n[a];return t}var ad=Ga("animationend"),rd=Ga("animationiteration"),sd=Ga("animationstart"),n0=Ga("transitionrun"),i0=Ga("transitionstart"),a0=Ga("transitioncancel"),od=Ga("transitionend"),ld=new Map,Gc="abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");Gc.push("scrollEnd");function mi(t,n){ld.set(t,n),it(n,[t])}var cd=new WeakMap;function ni(t,n){if(typeof t=="object"&&t!==null){var a=cd.get(t);return a!==void 0?a:(n={value:t,source:n,stack:qe(n)},cd.set(t,n),n)}return{value:t,source:n,stack:qe(n)}}var ii=[],yr=0,Vc=0;function Go(){for(var t=yr,n=Vc=yr=0;n<t;){var a=ii[n];ii[n++]=null;var s=ii[n];ii[n++]=null;var c=ii[n];ii[n++]=null;var f=ii[n];if(ii[n++]=null,s!==null&&c!==null){var M=s.pending;M===null?c.next=c:(c.next=M.next,M.next=c),s.pending=c}f!==0&&ud(a,c,f)}}function Vo(t,n,a,s){ii[yr++]=t,ii[yr++]=n,ii[yr++]=a,ii[yr++]=s,Vc|=s,t.lanes|=s,t=t.alternate,t!==null&&(t.lanes|=s)}function kc(t,n,a,s){return Vo(t,n,a,s),ko(t)}function Er(t,n){return Vo(t,null,null,n),ko(t)}function ud(t,n,a){t.lanes|=a;var s=t.alternate;s!==null&&(s.lanes|=a);for(var c=!1,f=t.return;f!==null;)f.childLanes|=a,s=f.alternate,s!==null&&(s.childLanes|=a),f.tag===22&&(t=f.stateNode,t===null||t._visibility&1||(c=!0)),t=f,f=f.return;return t.tag===3?(f=t.stateNode,c&&n!==null&&(c=31-Vt(a),t=f.hiddenUpdates,s=t[c],s===null?t[c]=[n]:s.push(n),n.lane=a|536870912),f):null}function ko(t){if(50<no)throw no=0,Zu=null,Error(r(185));for(var n=t.return;n!==null;)t=n,n=t.return;return t.tag===3?t.stateNode:null}var Tr={};function r0(t,n,a,s){this.tag=t,this.key=a,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=n,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=s,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function qn(t,n,a,s){return new r0(t,n,a,s)}function Xc(t){return t=t.prototype,!(!t||!t.isReactComponent)}function Ui(t,n){var a=t.alternate;return a===null?(a=qn(t.tag,n,t.key,t.mode),a.elementType=t.elementType,a.type=t.type,a.stateNode=t.stateNode,a.alternate=t,t.alternate=a):(a.pendingProps=n,a.type=t.type,a.flags=0,a.subtreeFlags=0,a.deletions=null),a.flags=t.flags&65011712,a.childLanes=t.childLanes,a.lanes=t.lanes,a.child=t.child,a.memoizedProps=t.memoizedProps,a.memoizedState=t.memoizedState,a.updateQueue=t.updateQueue,n=t.dependencies,a.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext},a.sibling=t.sibling,a.index=t.index,a.ref=t.ref,a.refCleanup=t.refCleanup,a}function fd(t,n){t.flags&=65011714;var a=t.alternate;return a===null?(t.childLanes=0,t.lanes=n,t.child=null,t.subtreeFlags=0,t.memoizedProps=null,t.memoizedState=null,t.updateQueue=null,t.dependencies=null,t.stateNode=null):(t.childLanes=a.childLanes,t.lanes=a.lanes,t.child=a.child,t.subtreeFlags=0,t.deletions=null,t.memoizedProps=a.memoizedProps,t.memoizedState=a.memoizedState,t.updateQueue=a.updateQueue,t.type=a.type,n=a.dependencies,t.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext}),t}function Xo(t,n,a,s,c,f){var M=0;if(s=t,typeof t=="function")Xc(t)&&(M=1);else if(typeof t=="string")M=oS(t,a,$.current)?26:t==="html"||t==="head"||t==="body"?27:5;else t:switch(t){case w:return t=qn(31,a,n,c),t.elementType=w,t.lanes=f,t;case A:return Va(a.children,c,f,n);case b:M=8,c|=24;break;case S:return t=qn(12,a,n,c|2),t.elementType=S,t.lanes=f,t;case k:return t=qn(13,a,n,c),t.elementType=k,t.lanes=f,t;case F:return t=qn(19,a,n,c),t.elementType=F,t.lanes=f,t;default:if(typeof t=="object"&&t!==null)switch(t.$$typeof){case _:case L:M=10;break t;case P:M=9;break t;case O:M=11;break t;case B:M=14;break t;case pt:M=16,s=null;break t}M=29,a=Error(r(130,t===null?"null":typeof t,"")),s=null}return n=qn(M,a,n,c),n.elementType=t,n.type=s,n.lanes=f,n}function Va(t,n,a,s){return t=qn(7,t,s,n),t.lanes=a,t}function Wc(t,n,a){return t=qn(6,t,null,n),t.lanes=a,t}function qc(t,n,a){return n=qn(4,t.children!==null?t.children:[],t.key,n),n.lanes=a,n.stateNode={containerInfo:t.containerInfo,pendingChildren:null,implementation:t.implementation},n}var br=[],Ar=0,Wo=null,qo=0,ai=[],ri=0,ka=null,Ni=1,Oi="";function Xa(t,n){br[Ar++]=qo,br[Ar++]=Wo,Wo=t,qo=n}function hd(t,n,a){ai[ri++]=Ni,ai[ri++]=Oi,ai[ri++]=ka,ka=t;var s=Ni;t=Oi;var c=32-Vt(s)-1;s&=~(1<<c),a+=1;var f=32-Vt(n)+c;if(30<f){var M=c-c%5;f=(s&(1<<M)-1).toString(32),s>>=M,c-=M,Ni=1<<32-Vt(n)+c|a<<c|s,Oi=f+t}else Ni=1<<f|a<<c|s,Oi=t}function Yc(t){t.return!==null&&(Xa(t,1),hd(t,1,0))}function jc(t){for(;t===Wo;)Wo=br[--Ar],br[Ar]=null,qo=br[--Ar],br[Ar]=null;for(;t===ka;)ka=ai[--ri],ai[ri]=null,Oi=ai[--ri],ai[ri]=null,Ni=ai[--ri],ai[ri]=null}var Nn=null,Je=null,Ne=!1,Wa=null,Ti=!1,Zc=Error(r(519));function qa(t){var n=Error(r(418,""));throw Os(ni(n,t)),Zc}function dd(t){var n=t.stateNode,a=t.type,s=t.memoizedProps;switch(n[Lt]=t,n[$t]=s,a){case"dialog":Ae("cancel",n),Ae("close",n);break;case"iframe":case"object":case"embed":Ae("load",n);break;case"video":case"audio":for(a=0;a<ao.length;a++)Ae(ao[a],n);break;case"source":Ae("error",n);break;case"img":case"image":case"link":Ae("error",n),Ae("load",n);break;case"details":Ae("toggle",n);break;case"input":Ae("invalid",n),No(n,s.value,s.defaultValue,s.checked,s.defaultChecked,s.type,s.name,!0),ea(n);break;case"select":Ae("invalid",n);break;case"textarea":Ae("invalid",n),Dh(n,s.value,s.defaultValue,s.children),ea(n)}a=s.children,typeof a!="string"&&typeof a!="number"&&typeof a!="bigint"||n.textContent===""+a||s.suppressHydrationWarning===!0||Dm(n.textContent,a)?(s.popover!=null&&(Ae("beforetoggle",n),Ae("toggle",n)),s.onScroll!=null&&Ae("scroll",n),s.onScrollEnd!=null&&Ae("scrollend",n),s.onClick!=null&&(n.onclick=Al),n=!0):n=!1,n||qa(t)}function pd(t){for(Nn=t.return;Nn;)switch(Nn.tag){case 5:case 13:Ti=!1;return;case 27:case 3:Ti=!0;return;default:Nn=Nn.return}}function Us(t){if(t!==Nn)return!1;if(!Ne)return pd(t),Ne=!0,!1;var n=t.tag,a;if((a=n!==3&&n!==27)&&((a=n===5)&&(a=t.type,a=!(a!=="form"&&a!=="button")||hf(t.type,t.memoizedProps)),a=!a),a&&Je&&qa(t),pd(t),n===13){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(r(317));t:{for(t=t.nextSibling,n=0;t;){if(t.nodeType===8)if(a=t.data,a==="/$"){if(n===0){Je=_i(t.nextSibling);break t}n--}else a!=="$"&&a!=="$!"&&a!=="$?"||n++;t=t.nextSibling}Je=null}}else n===27?(n=Je,va(t.type)?(t=gf,gf=null,Je=t):Je=n):Je=Nn?_i(t.stateNode.nextSibling):null;return!0}function Ns(){Je=Nn=null,Ne=!1}function md(){var t=Wa;return t!==null&&(Hn===null?Hn=t:Hn.push.apply(Hn,t),Wa=null),t}function Os(t){Wa===null?Wa=[t]:Wa.push(t)}var Kc=V(null),Ya=null,Pi=null;function ia(t,n,a){I(Kc,n._currentValue),n._currentValue=a}function zi(t){t._currentValue=Kc.current,j(Kc)}function Qc(t,n,a){for(;t!==null;){var s=t.alternate;if((t.childLanes&n)!==n?(t.childLanes|=n,s!==null&&(s.childLanes|=n)):s!==null&&(s.childLanes&n)!==n&&(s.childLanes|=n),t===a)break;t=t.return}}function Jc(t,n,a,s){var c=t.child;for(c!==null&&(c.return=t);c!==null;){var f=c.dependencies;if(f!==null){var M=c.child;f=f.firstContext;t:for(;f!==null;){var E=f;f=c;for(var z=0;z<n.length;z++)if(E.context===n[z]){f.lanes|=a,E=f.alternate,E!==null&&(E.lanes|=a),Qc(f.return,a,t),s||(M=null);break t}f=E.next}}else if(c.tag===18){if(M=c.return,M===null)throw Error(r(341));M.lanes|=a,f=M.alternate,f!==null&&(f.lanes|=a),Qc(M,a,t),M=null}else M=c.child;if(M!==null)M.return=c;else for(M=c;M!==null;){if(M===t){M=null;break}if(c=M.sibling,c!==null){c.return=M.return,M=c;break}M=M.return}c=M}}function Ps(t,n,a,s){t=null;for(var c=n,f=!1;c!==null;){if(!f){if((c.flags&524288)!==0)f=!0;else if((c.flags&262144)!==0)break}if(c.tag===10){var M=c.alternate;if(M===null)throw Error(r(387));if(M=M.memoizedProps,M!==null){var E=c.type;Wn(c.pendingProps.value,M.value)||(t!==null?t.push(E):t=[E])}}else if(c===Ot.current){if(M=c.alternate,M===null)throw Error(r(387));M.memoizedState.memoizedState!==c.memoizedState.memoizedState&&(t!==null?t.push(uo):t=[uo])}c=c.return}t!==null&&Jc(n,t,a,s),n.flags|=262144}function Yo(t){for(t=t.firstContext;t!==null;){if(!Wn(t.context._currentValue,t.memoizedValue))return!0;t=t.next}return!1}function ja(t){Ya=t,Pi=null,t=t.dependencies,t!==null&&(t.firstContext=null)}function Cn(t){return gd(Ya,t)}function jo(t,n){return Ya===null&&ja(t),gd(t,n)}function gd(t,n){var a=n._currentValue;if(n={context:n,memoizedValue:a,next:null},Pi===null){if(t===null)throw Error(r(308));Pi=n,t.dependencies={lanes:0,firstContext:n},t.flags|=524288}else Pi=Pi.next=n;return a}var s0=typeof AbortController<"u"?AbortController:function(){var t=[],n=this.signal={aborted:!1,addEventListener:function(a,s){t.push(s)}};this.abort=function(){n.aborted=!0,t.forEach(function(a){return a()})}},o0=o.unstable_scheduleCallback,l0=o.unstable_NormalPriority,cn={$$typeof:L,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function $c(){return{controller:new s0,data:new Map,refCount:0}}function zs(t){t.refCount--,t.refCount===0&&o0(l0,function(){t.controller.abort()})}var Bs=null,tu=0,Rr=0,wr=null;function c0(t,n){if(Bs===null){var a=Bs=[];tu=0,Rr=nf(),wr={status:"pending",value:void 0,then:function(s){a.push(s)}}}return tu++,n.then(_d,_d),n}function _d(){if(--tu===0&&Bs!==null){wr!==null&&(wr.status="fulfilled");var t=Bs;Bs=null,Rr=0,wr=null;for(var n=0;n<t.length;n++)(0,t[n])()}}function u0(t,n){var a=[],s={status:"pending",value:null,reason:null,then:function(c){a.push(c)}};return t.then(function(){s.status="fulfilled",s.value=n;for(var c=0;c<a.length;c++)(0,a[c])(n)},function(c){for(s.status="rejected",s.reason=c,c=0;c<a.length;c++)(0,a[c])(void 0)}),s}var vd=N.S;N.S=function(t,n){typeof n=="object"&&n!==null&&typeof n.then=="function"&&c0(t,n),vd!==null&&vd(t,n)};var Za=V(null);function eu(){var t=Za.current;return t!==null?t:We.pooledCache}function Zo(t,n){n===null?I(Za,Za.current):I(Za,n.pool)}function Sd(){var t=eu();return t===null?null:{parent:cn._currentValue,pool:t}}var Is=Error(r(460)),xd=Error(r(474)),Ko=Error(r(542)),nu={then:function(){}};function Md(t){return t=t.status,t==="fulfilled"||t==="rejected"}function Qo(){}function yd(t,n,a){switch(a=t[a],a===void 0?t.push(n):a!==n&&(n.then(Qo,Qo),n=a),n.status){case"fulfilled":return n.value;case"rejected":throw t=n.reason,Td(t),t;default:if(typeof n.status=="string")n.then(Qo,Qo);else{if(t=We,t!==null&&100<t.shellSuspendCounter)throw Error(r(482));t=n,t.status="pending",t.then(function(s){if(n.status==="pending"){var c=n;c.status="fulfilled",c.value=s}},function(s){if(n.status==="pending"){var c=n;c.status="rejected",c.reason=s}})}switch(n.status){case"fulfilled":return n.value;case"rejected":throw t=n.reason,Td(t),t}throw Fs=n,Is}}var Fs=null;function Ed(){if(Fs===null)throw Error(r(459));var t=Fs;return Fs=null,t}function Td(t){if(t===Is||t===Ko)throw Error(r(483))}var aa=!1;function iu(t){t.updateQueue={baseState:t.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function au(t,n){t=t.updateQueue,n.updateQueue===t&&(n.updateQueue={baseState:t.baseState,firstBaseUpdate:t.firstBaseUpdate,lastBaseUpdate:t.lastBaseUpdate,shared:t.shared,callbacks:null})}function ra(t){return{lane:t,tag:0,payload:null,callback:null,next:null}}function sa(t,n,a){var s=t.updateQueue;if(s===null)return null;if(s=s.shared,(Oe&2)!==0){var c=s.pending;return c===null?n.next=n:(n.next=c.next,c.next=n),s.pending=n,n=ko(t),ud(t,null,a),n}return Vo(t,s,n,a),ko(t)}function Hs(t,n,a){if(n=n.updateQueue,n!==null&&(n=n.shared,(a&4194048)!==0)){var s=n.lanes;s&=t.pendingLanes,a|=s,n.lanes=a,Zt(t,a)}}function ru(t,n){var a=t.updateQueue,s=t.alternate;if(s!==null&&(s=s.updateQueue,a===s)){var c=null,f=null;if(a=a.firstBaseUpdate,a!==null){do{var M={lane:a.lane,tag:a.tag,payload:a.payload,callback:null,next:null};f===null?c=f=M:f=f.next=M,a=a.next}while(a!==null);f===null?c=f=n:f=f.next=n}else c=f=n;a={baseState:s.baseState,firstBaseUpdate:c,lastBaseUpdate:f,shared:s.shared,callbacks:s.callbacks},t.updateQueue=a;return}t=a.lastBaseUpdate,t===null?a.firstBaseUpdate=n:t.next=n,a.lastBaseUpdate=n}var su=!1;function Gs(){if(su){var t=wr;if(t!==null)throw t}}function Vs(t,n,a,s){su=!1;var c=t.updateQueue;aa=!1;var f=c.firstBaseUpdate,M=c.lastBaseUpdate,E=c.shared.pending;if(E!==null){c.shared.pending=null;var z=E,Q=z.next;z.next=null,M===null?f=Q:M.next=Q,M=z;var ft=t.alternate;ft!==null&&(ft=ft.updateQueue,E=ft.lastBaseUpdate,E!==M&&(E===null?ft.firstBaseUpdate=Q:E.next=Q,ft.lastBaseUpdate=z))}if(f!==null){var mt=c.baseState;M=0,ft=Q=z=null,E=f;do{var et=E.lane&-536870913,at=et!==E.lane;if(at?(Re&et)===et:(s&et)===et){et!==0&&et===Rr&&(su=!0),ft!==null&&(ft=ft.next={lane:0,tag:E.tag,payload:E.payload,callback:null,next:null});t:{var se=t,ee=E;et=n;var Ie=a;switch(ee.tag){case 1:if(se=ee.payload,typeof se=="function"){mt=se.call(Ie,mt,et);break t}mt=se;break t;case 3:se.flags=se.flags&-65537|128;case 0:if(se=ee.payload,et=typeof se=="function"?se.call(Ie,mt,et):se,et==null)break t;mt=g({},mt,et);break t;case 2:aa=!0}}et=E.callback,et!==null&&(t.flags|=64,at&&(t.flags|=8192),at=c.callbacks,at===null?c.callbacks=[et]:at.push(et))}else at={lane:et,tag:E.tag,payload:E.payload,callback:E.callback,next:null},ft===null?(Q=ft=at,z=mt):ft=ft.next=at,M|=et;if(E=E.next,E===null){if(E=c.shared.pending,E===null)break;at=E,E=at.next,at.next=null,c.lastBaseUpdate=at,c.shared.pending=null}}while(!0);ft===null&&(z=mt),c.baseState=z,c.firstBaseUpdate=Q,c.lastBaseUpdate=ft,f===null&&(c.shared.lanes=0),pa|=M,t.lanes=M,t.memoizedState=mt}}function bd(t,n){if(typeof t!="function")throw Error(r(191,t));t.call(n)}function Ad(t,n){var a=t.callbacks;if(a!==null)for(t.callbacks=null,t=0;t<a.length;t++)bd(a[t],n)}var Cr=V(null),Jo=V(0);function Rd(t,n){t=ki,I(Jo,t),I(Cr,n),ki=t|n.baseLanes}function ou(){I(Jo,ki),I(Cr,Cr.current)}function lu(){ki=Jo.current,j(Cr),j(Jo)}var oa=0,xe=null,ze=null,rn=null,$o=!1,Dr=!1,Ka=!1,tl=0,ks=0,Lr=null,f0=0;function en(){throw Error(r(321))}function cu(t,n){if(n===null)return!1;for(var a=0;a<n.length&&a<t.length;a++)if(!Wn(t[a],n[a]))return!1;return!0}function uu(t,n,a,s,c,f){return oa=f,xe=n,n.memoizedState=null,n.updateQueue=null,n.lanes=0,N.H=t===null||t.memoizedState===null?up:fp,Ka=!1,f=a(s,c),Ka=!1,Dr&&(f=Cd(n,a,s,c)),wd(t),f}function wd(t){N.H=sl;var n=ze!==null&&ze.next!==null;if(oa=0,rn=ze=xe=null,$o=!1,ks=0,Lr=null,n)throw Error(r(300));t===null||dn||(t=t.dependencies,t!==null&&Yo(t)&&(dn=!0))}function Cd(t,n,a,s){xe=t;var c=0;do{if(Dr&&(Lr=null),ks=0,Dr=!1,25<=c)throw Error(r(301));if(c+=1,rn=ze=null,t.updateQueue!=null){var f=t.updateQueue;f.lastEffect=null,f.events=null,f.stores=null,f.memoCache!=null&&(f.memoCache.index=0)}N.H=v0,f=n(a,s)}while(Dr);return f}function h0(){var t=N.H,n=t.useState()[0];return n=typeof n.then=="function"?Xs(n):n,t=t.useState()[0],(ze!==null?ze.memoizedState:null)!==t&&(xe.flags|=1024),n}function fu(){var t=tl!==0;return tl=0,t}function hu(t,n,a){n.updateQueue=t.updateQueue,n.flags&=-2053,t.lanes&=~a}function du(t){if($o){for(t=t.memoizedState;t!==null;){var n=t.queue;n!==null&&(n.pending=null),t=t.next}$o=!1}oa=0,rn=ze=xe=null,Dr=!1,ks=tl=0,Lr=null}function In(){var t={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return rn===null?xe.memoizedState=rn=t:rn=rn.next=t,rn}function sn(){if(ze===null){var t=xe.alternate;t=t!==null?t.memoizedState:null}else t=ze.next;var n=rn===null?xe.memoizedState:rn.next;if(n!==null)rn=n,ze=t;else{if(t===null)throw xe.alternate===null?Error(r(467)):Error(r(310));ze=t,t={memoizedState:ze.memoizedState,baseState:ze.baseState,baseQueue:ze.baseQueue,queue:ze.queue,next:null},rn===null?xe.memoizedState=rn=t:rn=rn.next=t}return rn}function pu(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function Xs(t){var n=ks;return ks+=1,Lr===null&&(Lr=[]),t=yd(Lr,t,n),n=xe,(rn===null?n.memoizedState:rn.next)===null&&(n=n.alternate,N.H=n===null||n.memoizedState===null?up:fp),t}function el(t){if(t!==null&&typeof t=="object"){if(typeof t.then=="function")return Xs(t);if(t.$$typeof===L)return Cn(t)}throw Error(r(438,String(t)))}function mu(t){var n=null,a=xe.updateQueue;if(a!==null&&(n=a.memoCache),n==null){var s=xe.alternate;s!==null&&(s=s.updateQueue,s!==null&&(s=s.memoCache,s!=null&&(n={data:s.data.map(function(c){return c.slice()}),index:0})))}if(n==null&&(n={data:[],index:0}),a===null&&(a=pu(),xe.updateQueue=a),a.memoCache=n,a=n.data[n.index],a===void 0)for(a=n.data[n.index]=Array(t),s=0;s<t;s++)a[s]=U;return n.index++,a}function Bi(t,n){return typeof n=="function"?n(t):n}function nl(t){var n=sn();return gu(n,ze,t)}function gu(t,n,a){var s=t.queue;if(s===null)throw Error(r(311));s.lastRenderedReducer=a;var c=t.baseQueue,f=s.pending;if(f!==null){if(c!==null){var M=c.next;c.next=f.next,f.next=M}n.baseQueue=c=f,s.pending=null}if(f=t.baseState,c===null)t.memoizedState=f;else{n=c.next;var E=M=null,z=null,Q=n,ft=!1;do{var mt=Q.lane&-536870913;if(mt!==Q.lane?(Re&mt)===mt:(oa&mt)===mt){var et=Q.revertLane;if(et===0)z!==null&&(z=z.next={lane:0,revertLane:0,action:Q.action,hasEagerState:Q.hasEagerState,eagerState:Q.eagerState,next:null}),mt===Rr&&(ft=!0);else if((oa&et)===et){Q=Q.next,et===Rr&&(ft=!0);continue}else mt={lane:0,revertLane:Q.revertLane,action:Q.action,hasEagerState:Q.hasEagerState,eagerState:Q.eagerState,next:null},z===null?(E=z=mt,M=f):z=z.next=mt,xe.lanes|=et,pa|=et;mt=Q.action,Ka&&a(f,mt),f=Q.hasEagerState?Q.eagerState:a(f,mt)}else et={lane:mt,revertLane:Q.revertLane,action:Q.action,hasEagerState:Q.hasEagerState,eagerState:Q.eagerState,next:null},z===null?(E=z=et,M=f):z=z.next=et,xe.lanes|=mt,pa|=mt;Q=Q.next}while(Q!==null&&Q!==n);if(z===null?M=f:z.next=E,!Wn(f,t.memoizedState)&&(dn=!0,ft&&(a=wr,a!==null)))throw a;t.memoizedState=f,t.baseState=M,t.baseQueue=z,s.lastRenderedState=f}return c===null&&(s.lanes=0),[t.memoizedState,s.dispatch]}function _u(t){var n=sn(),a=n.queue;if(a===null)throw Error(r(311));a.lastRenderedReducer=t;var s=a.dispatch,c=a.pending,f=n.memoizedState;if(c!==null){a.pending=null;var M=c=c.next;do f=t(f,M.action),M=M.next;while(M!==c);Wn(f,n.memoizedState)||(dn=!0),n.memoizedState=f,n.baseQueue===null&&(n.baseState=f),a.lastRenderedState=f}return[f,s]}function Dd(t,n,a){var s=xe,c=sn(),f=Ne;if(f){if(a===void 0)throw Error(r(407));a=a()}else a=n();var M=!Wn((ze||c).memoizedState,a);M&&(c.memoizedState=a,dn=!0),c=c.queue;var E=Nd.bind(null,s,c,t);if(Ws(2048,8,E,[t]),c.getSnapshot!==n||M||rn!==null&&rn.memoizedState.tag&1){if(s.flags|=2048,Ur(9,il(),Ud.bind(null,s,c,a,n),null),We===null)throw Error(r(349));f||(oa&124)!==0||Ld(s,n,a)}return a}function Ld(t,n,a){t.flags|=16384,t={getSnapshot:n,value:a},n=xe.updateQueue,n===null?(n=pu(),xe.updateQueue=n,n.stores=[t]):(a=n.stores,a===null?n.stores=[t]:a.push(t))}function Ud(t,n,a,s){n.value=a,n.getSnapshot=s,Od(n)&&Pd(t)}function Nd(t,n,a){return a(function(){Od(n)&&Pd(t)})}function Od(t){var n=t.getSnapshot;t=t.value;try{var a=n();return!Wn(t,a)}catch{return!0}}function Pd(t){var n=Er(t,2);n!==null&&Qn(n,t,2)}function vu(t){var n=In();if(typeof t=="function"){var a=t;if(t=a(),Ka){Xt(!0);try{a()}finally{Xt(!1)}}}return n.memoizedState=n.baseState=t,n.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Bi,lastRenderedState:t},n}function zd(t,n,a,s){return t.baseState=a,gu(t,ze,typeof s=="function"?s:Bi)}function d0(t,n,a,s,c){if(rl(t))throw Error(r(485));if(t=n.action,t!==null){var f={payload:c,action:t,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(M){f.listeners.push(M)}};N.T!==null?a(!0):f.isTransition=!1,s(f),a=n.pending,a===null?(f.next=n.pending=f,Bd(n,f)):(f.next=a.next,n.pending=a.next=f)}}function Bd(t,n){var a=n.action,s=n.payload,c=t.state;if(n.isTransition){var f=N.T,M={};N.T=M;try{var E=a(c,s),z=N.S;z!==null&&z(M,E),Id(t,n,E)}catch(Q){Su(t,n,Q)}finally{N.T=f}}else try{f=a(c,s),Id(t,n,f)}catch(Q){Su(t,n,Q)}}function Id(t,n,a){a!==null&&typeof a=="object"&&typeof a.then=="function"?a.then(function(s){Fd(t,n,s)},function(s){return Su(t,n,s)}):Fd(t,n,a)}function Fd(t,n,a){n.status="fulfilled",n.value=a,Hd(n),t.state=a,n=t.pending,n!==null&&(a=n.next,a===n?t.pending=null:(a=a.next,n.next=a,Bd(t,a)))}function Su(t,n,a){var s=t.pending;if(t.pending=null,s!==null){s=s.next;do n.status="rejected",n.reason=a,Hd(n),n=n.next;while(n!==s)}t.action=null}function Hd(t){t=t.listeners;for(var n=0;n<t.length;n++)(0,t[n])()}function Gd(t,n){return n}function Vd(t,n){if(Ne){var a=We.formState;if(a!==null){t:{var s=xe;if(Ne){if(Je){e:{for(var c=Je,f=Ti;c.nodeType!==8;){if(!f){c=null;break e}if(c=_i(c.nextSibling),c===null){c=null;break e}}f=c.data,c=f==="F!"||f==="F"?c:null}if(c){Je=_i(c.nextSibling),s=c.data==="F!";break t}}qa(s)}s=!1}s&&(n=a[0])}}return a=In(),a.memoizedState=a.baseState=n,s={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Gd,lastRenderedState:n},a.queue=s,a=op.bind(null,xe,s),s.dispatch=a,s=vu(!1),f=Tu.bind(null,xe,!1,s.queue),s=In(),c={state:n,dispatch:null,action:t,pending:null},s.queue=c,a=d0.bind(null,xe,c,f,a),c.dispatch=a,s.memoizedState=t,[n,a,!1]}function kd(t){var n=sn();return Xd(n,ze,t)}function Xd(t,n,a){if(n=gu(t,n,Gd)[0],t=nl(Bi)[0],typeof n=="object"&&n!==null&&typeof n.then=="function")try{var s=Xs(n)}catch(M){throw M===Is?Ko:M}else s=n;n=sn();var c=n.queue,f=c.dispatch;return a!==n.memoizedState&&(xe.flags|=2048,Ur(9,il(),p0.bind(null,c,a),null)),[s,f,t]}function p0(t,n){t.action=n}function Wd(t){var n=sn(),a=ze;if(a!==null)return Xd(n,a,t);sn(),n=n.memoizedState,a=sn();var s=a.queue.dispatch;return a.memoizedState=t,[n,s,!1]}function Ur(t,n,a,s){return t={tag:t,create:a,deps:s,inst:n,next:null},n=xe.updateQueue,n===null&&(n=pu(),xe.updateQueue=n),a=n.lastEffect,a===null?n.lastEffect=t.next=t:(s=a.next,a.next=t,t.next=s,n.lastEffect=t),t}function il(){return{destroy:void 0,resource:void 0}}function qd(){return sn().memoizedState}function al(t,n,a,s){var c=In();s=s===void 0?null:s,xe.flags|=t,c.memoizedState=Ur(1|n,il(),a,s)}function Ws(t,n,a,s){var c=sn();s=s===void 0?null:s;var f=c.memoizedState.inst;ze!==null&&s!==null&&cu(s,ze.memoizedState.deps)?c.memoizedState=Ur(n,f,a,s):(xe.flags|=t,c.memoizedState=Ur(1|n,f,a,s))}function Yd(t,n){al(8390656,8,t,n)}function jd(t,n){Ws(2048,8,t,n)}function Zd(t,n){return Ws(4,2,t,n)}function Kd(t,n){return Ws(4,4,t,n)}function Qd(t,n){if(typeof n=="function"){t=t();var a=n(t);return function(){typeof a=="function"?a():n(null)}}if(n!=null)return t=t(),n.current=t,function(){n.current=null}}function Jd(t,n,a){a=a!=null?a.concat([t]):null,Ws(4,4,Qd.bind(null,n,t),a)}function xu(){}function $d(t,n){var a=sn();n=n===void 0?null:n;var s=a.memoizedState;return n!==null&&cu(n,s[1])?s[0]:(a.memoizedState=[t,n],t)}function tp(t,n){var a=sn();n=n===void 0?null:n;var s=a.memoizedState;if(n!==null&&cu(n,s[1]))return s[0];if(s=t(),Ka){Xt(!0);try{t()}finally{Xt(!1)}}return a.memoizedState=[s,n],s}function Mu(t,n,a){return a===void 0||(oa&1073741824)!==0?t.memoizedState=n:(t.memoizedState=a,t=im(),xe.lanes|=t,pa|=t,a)}function ep(t,n,a,s){return Wn(a,n)?a:Cr.current!==null?(t=Mu(t,a,s),Wn(t,n)||(dn=!0),t):(oa&42)===0?(dn=!0,t.memoizedState=a):(t=im(),xe.lanes|=t,pa|=t,n)}function np(t,n,a,s,c){var f=q.p;q.p=f!==0&&8>f?f:8;var M=N.T,E={};N.T=E,Tu(t,!1,n,a);try{var z=c(),Q=N.S;if(Q!==null&&Q(E,z),z!==null&&typeof z=="object"&&typeof z.then=="function"){var ft=u0(z,s);qs(t,n,ft,Kn(t))}else qs(t,n,s,Kn(t))}catch(mt){qs(t,n,{then:function(){},status:"rejected",reason:mt},Kn())}finally{q.p=f,N.T=M}}function m0(){}function yu(t,n,a,s){if(t.tag!==5)throw Error(r(476));var c=ip(t).queue;np(t,c,n,K,a===null?m0:function(){return ap(t),a(s)})}function ip(t){var n=t.memoizedState;if(n!==null)return n;n={memoizedState:K,baseState:K,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Bi,lastRenderedState:K},next:null};var a={};return n.next={memoizedState:a,baseState:a,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Bi,lastRenderedState:a},next:null},t.memoizedState=n,t=t.alternate,t!==null&&(t.memoizedState=n),n}function ap(t){var n=ip(t).next.queue;qs(t,n,{},Kn())}function Eu(){return Cn(uo)}function rp(){return sn().memoizedState}function sp(){return sn().memoizedState}function g0(t){for(var n=t.return;n!==null;){switch(n.tag){case 24:case 3:var a=Kn();t=ra(a);var s=sa(n,t,a);s!==null&&(Qn(s,n,a),Hs(s,n,a)),n={cache:$c()},t.payload=n;return}n=n.return}}function _0(t,n,a){var s=Kn();a={lane:s,revertLane:0,action:a,hasEagerState:!1,eagerState:null,next:null},rl(t)?lp(n,a):(a=kc(t,n,a,s),a!==null&&(Qn(a,t,s),cp(a,n,s)))}function op(t,n,a){var s=Kn();qs(t,n,a,s)}function qs(t,n,a,s){var c={lane:s,revertLane:0,action:a,hasEagerState:!1,eagerState:null,next:null};if(rl(t))lp(n,c);else{var f=t.alternate;if(t.lanes===0&&(f===null||f.lanes===0)&&(f=n.lastRenderedReducer,f!==null))try{var M=n.lastRenderedState,E=f(M,a);if(c.hasEagerState=!0,c.eagerState=E,Wn(E,M))return Vo(t,n,c,0),We===null&&Go(),!1}catch{}if(a=kc(t,n,c,s),a!==null)return Qn(a,t,s),cp(a,n,s),!0}return!1}function Tu(t,n,a,s){if(s={lane:2,revertLane:nf(),action:s,hasEagerState:!1,eagerState:null,next:null},rl(t)){if(n)throw Error(r(479))}else n=kc(t,a,s,2),n!==null&&Qn(n,t,2)}function rl(t){var n=t.alternate;return t===xe||n!==null&&n===xe}function lp(t,n){Dr=$o=!0;var a=t.pending;a===null?n.next=n:(n.next=a.next,a.next=n),t.pending=n}function cp(t,n,a){if((a&4194048)!==0){var s=n.lanes;s&=t.pendingLanes,a|=s,n.lanes=a,Zt(t,a)}}var sl={readContext:Cn,use:el,useCallback:en,useContext:en,useEffect:en,useImperativeHandle:en,useLayoutEffect:en,useInsertionEffect:en,useMemo:en,useReducer:en,useRef:en,useState:en,useDebugValue:en,useDeferredValue:en,useTransition:en,useSyncExternalStore:en,useId:en,useHostTransitionStatus:en,useFormState:en,useActionState:en,useOptimistic:en,useMemoCache:en,useCacheRefresh:en},up={readContext:Cn,use:el,useCallback:function(t,n){return In().memoizedState=[t,n===void 0?null:n],t},useContext:Cn,useEffect:Yd,useImperativeHandle:function(t,n,a){a=a!=null?a.concat([t]):null,al(4194308,4,Qd.bind(null,n,t),a)},useLayoutEffect:function(t,n){return al(4194308,4,t,n)},useInsertionEffect:function(t,n){al(4,2,t,n)},useMemo:function(t,n){var a=In();n=n===void 0?null:n;var s=t();if(Ka){Xt(!0);try{t()}finally{Xt(!1)}}return a.memoizedState=[s,n],s},useReducer:function(t,n,a){var s=In();if(a!==void 0){var c=a(n);if(Ka){Xt(!0);try{a(n)}finally{Xt(!1)}}}else c=n;return s.memoizedState=s.baseState=c,t={pending:null,lanes:0,dispatch:null,lastRenderedReducer:t,lastRenderedState:c},s.queue=t,t=t.dispatch=_0.bind(null,xe,t),[s.memoizedState,t]},useRef:function(t){var n=In();return t={current:t},n.memoizedState=t},useState:function(t){t=vu(t);var n=t.queue,a=op.bind(null,xe,n);return n.dispatch=a,[t.memoizedState,a]},useDebugValue:xu,useDeferredValue:function(t,n){var a=In();return Mu(a,t,n)},useTransition:function(){var t=vu(!1);return t=np.bind(null,xe,t.queue,!0,!1),In().memoizedState=t,[!1,t]},useSyncExternalStore:function(t,n,a){var s=xe,c=In();if(Ne){if(a===void 0)throw Error(r(407));a=a()}else{if(a=n(),We===null)throw Error(r(349));(Re&124)!==0||Ld(s,n,a)}c.memoizedState=a;var f={value:a,getSnapshot:n};return c.queue=f,Yd(Nd.bind(null,s,f,t),[t]),s.flags|=2048,Ur(9,il(),Ud.bind(null,s,f,a,n),null),a},useId:function(){var t=In(),n=We.identifierPrefix;if(Ne){var a=Oi,s=Ni;a=(s&~(1<<32-Vt(s)-1)).toString(32)+a,n="«"+n+"R"+a,a=tl++,0<a&&(n+="H"+a.toString(32)),n+="»"}else a=f0++,n="«"+n+"r"+a.toString(32)+"»";return t.memoizedState=n},useHostTransitionStatus:Eu,useFormState:Vd,useActionState:Vd,useOptimistic:function(t){var n=In();n.memoizedState=n.baseState=t;var a={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return n.queue=a,n=Tu.bind(null,xe,!0,a),a.dispatch=n,[t,n]},useMemoCache:mu,useCacheRefresh:function(){return In().memoizedState=g0.bind(null,xe)}},fp={readContext:Cn,use:el,useCallback:$d,useContext:Cn,useEffect:jd,useImperativeHandle:Jd,useInsertionEffect:Zd,useLayoutEffect:Kd,useMemo:tp,useReducer:nl,useRef:qd,useState:function(){return nl(Bi)},useDebugValue:xu,useDeferredValue:function(t,n){var a=sn();return ep(a,ze.memoizedState,t,n)},useTransition:function(){var t=nl(Bi)[0],n=sn().memoizedState;return[typeof t=="boolean"?t:Xs(t),n]},useSyncExternalStore:Dd,useId:rp,useHostTransitionStatus:Eu,useFormState:kd,useActionState:kd,useOptimistic:function(t,n){var a=sn();return zd(a,ze,t,n)},useMemoCache:mu,useCacheRefresh:sp},v0={readContext:Cn,use:el,useCallback:$d,useContext:Cn,useEffect:jd,useImperativeHandle:Jd,useInsertionEffect:Zd,useLayoutEffect:Kd,useMemo:tp,useReducer:_u,useRef:qd,useState:function(){return _u(Bi)},useDebugValue:xu,useDeferredValue:function(t,n){var a=sn();return ze===null?Mu(a,t,n):ep(a,ze.memoizedState,t,n)},useTransition:function(){var t=_u(Bi)[0],n=sn().memoizedState;return[typeof t=="boolean"?t:Xs(t),n]},useSyncExternalStore:Dd,useId:rp,useHostTransitionStatus:Eu,useFormState:Wd,useActionState:Wd,useOptimistic:function(t,n){var a=sn();return ze!==null?zd(a,ze,t,n):(a.baseState=t,[t,a.queue.dispatch])},useMemoCache:mu,useCacheRefresh:sp},Nr=null,Ys=0;function ol(t){var n=Ys;return Ys+=1,Nr===null&&(Nr=[]),yd(Nr,t,n)}function js(t,n){n=n.props.ref,t.ref=n!==void 0?n:null}function ll(t,n){throw n.$$typeof===v?Error(r(525)):(t=Object.prototype.toString.call(n),Error(r(31,t==="[object Object]"?"object with keys {"+Object.keys(n).join(", ")+"}":t)))}function hp(t){var n=t._init;return n(t._payload)}function dp(t){function n(Y,G){if(t){var Z=Y.deletions;Z===null?(Y.deletions=[G],Y.flags|=16):Z.push(G)}}function a(Y,G){if(!t)return null;for(;G!==null;)n(Y,G),G=G.sibling;return null}function s(Y){for(var G=new Map;Y!==null;)Y.key!==null?G.set(Y.key,Y):G.set(Y.index,Y),Y=Y.sibling;return G}function c(Y,G){return Y=Ui(Y,G),Y.index=0,Y.sibling=null,Y}function f(Y,G,Z){return Y.index=Z,t?(Z=Y.alternate,Z!==null?(Z=Z.index,Z<G?(Y.flags|=67108866,G):Z):(Y.flags|=67108866,G)):(Y.flags|=1048576,G)}function M(Y){return t&&Y.alternate===null&&(Y.flags|=67108866),Y}function E(Y,G,Z,dt){return G===null||G.tag!==6?(G=Wc(Z,Y.mode,dt),G.return=Y,G):(G=c(G,Z),G.return=Y,G)}function z(Y,G,Z,dt){var It=Z.type;return It===A?ft(Y,G,Z.props.children,dt,Z.key):G!==null&&(G.elementType===It||typeof It=="object"&&It!==null&&It.$$typeof===pt&&hp(It)===G.type)?(G=c(G,Z.props),js(G,Z),G.return=Y,G):(G=Xo(Z.type,Z.key,Z.props,null,Y.mode,dt),js(G,Z),G.return=Y,G)}function Q(Y,G,Z,dt){return G===null||G.tag!==4||G.stateNode.containerInfo!==Z.containerInfo||G.stateNode.implementation!==Z.implementation?(G=qc(Z,Y.mode,dt),G.return=Y,G):(G=c(G,Z.children||[]),G.return=Y,G)}function ft(Y,G,Z,dt,It){return G===null||G.tag!==7?(G=Va(Z,Y.mode,dt,It),G.return=Y,G):(G=c(G,Z),G.return=Y,G)}function mt(Y,G,Z){if(typeof G=="string"&&G!==""||typeof G=="number"||typeof G=="bigint")return G=Wc(""+G,Y.mode,Z),G.return=Y,G;if(typeof G=="object"&&G!==null){switch(G.$$typeof){case x:return Z=Xo(G.type,G.key,G.props,null,Y.mode,Z),js(Z,G),Z.return=Y,Z;case y:return G=qc(G,Y.mode,Z),G.return=Y,G;case pt:var dt=G._init;return G=dt(G._payload),mt(Y,G,Z)}if(J(G)||ut(G))return G=Va(G,Y.mode,Z,null),G.return=Y,G;if(typeof G.then=="function")return mt(Y,ol(G),Z);if(G.$$typeof===L)return mt(Y,jo(Y,G),Z);ll(Y,G)}return null}function et(Y,G,Z,dt){var It=G!==null?G.key:null;if(typeof Z=="string"&&Z!==""||typeof Z=="number"||typeof Z=="bigint")return It!==null?null:E(Y,G,""+Z,dt);if(typeof Z=="object"&&Z!==null){switch(Z.$$typeof){case x:return Z.key===It?z(Y,G,Z,dt):null;case y:return Z.key===It?Q(Y,G,Z,dt):null;case pt:return It=Z._init,Z=It(Z._payload),et(Y,G,Z,dt)}if(J(Z)||ut(Z))return It!==null?null:ft(Y,G,Z,dt,null);if(typeof Z.then=="function")return et(Y,G,ol(Z),dt);if(Z.$$typeof===L)return et(Y,G,jo(Y,Z),dt);ll(Y,Z)}return null}function at(Y,G,Z,dt,It){if(typeof dt=="string"&&dt!==""||typeof dt=="number"||typeof dt=="bigint")return Y=Y.get(Z)||null,E(G,Y,""+dt,It);if(typeof dt=="object"&&dt!==null){switch(dt.$$typeof){case x:return Y=Y.get(dt.key===null?Z:dt.key)||null,z(G,Y,dt,It);case y:return Y=Y.get(dt.key===null?Z:dt.key)||null,Q(G,Y,dt,It);case pt:var Me=dt._init;return dt=Me(dt._payload),at(Y,G,Z,dt,It)}if(J(dt)||ut(dt))return Y=Y.get(Z)||null,ft(G,Y,dt,It,null);if(typeof dt.then=="function")return at(Y,G,Z,ol(dt),It);if(dt.$$typeof===L)return at(Y,G,Z,jo(G,dt),It);ll(G,dt)}return null}function se(Y,G,Z,dt){for(var It=null,Me=null,jt=G,ie=G=0,mn=null;jt!==null&&ie<Z.length;ie++){jt.index>ie?(mn=jt,jt=null):mn=jt.sibling;var De=et(Y,jt,Z[ie],dt);if(De===null){jt===null&&(jt=mn);break}t&&jt&&De.alternate===null&&n(Y,jt),G=f(De,G,ie),Me===null?It=De:Me.sibling=De,Me=De,jt=mn}if(ie===Z.length)return a(Y,jt),Ne&&Xa(Y,ie),It;if(jt===null){for(;ie<Z.length;ie++)jt=mt(Y,Z[ie],dt),jt!==null&&(G=f(jt,G,ie),Me===null?It=jt:Me.sibling=jt,Me=jt);return Ne&&Xa(Y,ie),It}for(jt=s(jt);ie<Z.length;ie++)mn=at(jt,Y,ie,Z[ie],dt),mn!==null&&(t&&mn.alternate!==null&&jt.delete(mn.key===null?ie:mn.key),G=f(mn,G,ie),Me===null?It=mn:Me.sibling=mn,Me=mn);return t&&jt.forEach(function(Ea){return n(Y,Ea)}),Ne&&Xa(Y,ie),It}function ee(Y,G,Z,dt){if(Z==null)throw Error(r(151));for(var It=null,Me=null,jt=G,ie=G=0,mn=null,De=Z.next();jt!==null&&!De.done;ie++,De=Z.next()){jt.index>ie?(mn=jt,jt=null):mn=jt.sibling;var Ea=et(Y,jt,De.value,dt);if(Ea===null){jt===null&&(jt=mn);break}t&&jt&&Ea.alternate===null&&n(Y,jt),G=f(Ea,G,ie),Me===null?It=Ea:Me.sibling=Ea,Me=Ea,jt=mn}if(De.done)return a(Y,jt),Ne&&Xa(Y,ie),It;if(jt===null){for(;!De.done;ie++,De=Z.next())De=mt(Y,De.value,dt),De!==null&&(G=f(De,G,ie),Me===null?It=De:Me.sibling=De,Me=De);return Ne&&Xa(Y,ie),It}for(jt=s(jt);!De.done;ie++,De=Z.next())De=at(jt,Y,ie,De.value,dt),De!==null&&(t&&De.alternate!==null&&jt.delete(De.key===null?ie:De.key),G=f(De,G,ie),Me===null?It=De:Me.sibling=De,Me=De);return t&&jt.forEach(function(SS){return n(Y,SS)}),Ne&&Xa(Y,ie),It}function Ie(Y,G,Z,dt){if(typeof Z=="object"&&Z!==null&&Z.type===A&&Z.key===null&&(Z=Z.props.children),typeof Z=="object"&&Z!==null){switch(Z.$$typeof){case x:t:{for(var It=Z.key;G!==null;){if(G.key===It){if(It=Z.type,It===A){if(G.tag===7){a(Y,G.sibling),dt=c(G,Z.props.children),dt.return=Y,Y=dt;break t}}else if(G.elementType===It||typeof It=="object"&&It!==null&&It.$$typeof===pt&&hp(It)===G.type){a(Y,G.sibling),dt=c(G,Z.props),js(dt,Z),dt.return=Y,Y=dt;break t}a(Y,G);break}else n(Y,G);G=G.sibling}Z.type===A?(dt=Va(Z.props.children,Y.mode,dt,Z.key),dt.return=Y,Y=dt):(dt=Xo(Z.type,Z.key,Z.props,null,Y.mode,dt),js(dt,Z),dt.return=Y,Y=dt)}return M(Y);case y:t:{for(It=Z.key;G!==null;){if(G.key===It)if(G.tag===4&&G.stateNode.containerInfo===Z.containerInfo&&G.stateNode.implementation===Z.implementation){a(Y,G.sibling),dt=c(G,Z.children||[]),dt.return=Y,Y=dt;break t}else{a(Y,G);break}else n(Y,G);G=G.sibling}dt=qc(Z,Y.mode,dt),dt.return=Y,Y=dt}return M(Y);case pt:return It=Z._init,Z=It(Z._payload),Ie(Y,G,Z,dt)}if(J(Z))return se(Y,G,Z,dt);if(ut(Z)){if(It=ut(Z),typeof It!="function")throw Error(r(150));return Z=It.call(Z),ee(Y,G,Z,dt)}if(typeof Z.then=="function")return Ie(Y,G,ol(Z),dt);if(Z.$$typeof===L)return Ie(Y,G,jo(Y,Z),dt);ll(Y,Z)}return typeof Z=="string"&&Z!==""||typeof Z=="number"||typeof Z=="bigint"?(Z=""+Z,G!==null&&G.tag===6?(a(Y,G.sibling),dt=c(G,Z),dt.return=Y,Y=dt):(a(Y,G),dt=Wc(Z,Y.mode,dt),dt.return=Y,Y=dt),M(Y)):a(Y,G)}return function(Y,G,Z,dt){try{Ys=0;var It=Ie(Y,G,Z,dt);return Nr=null,It}catch(jt){if(jt===Is||jt===Ko)throw jt;var Me=qn(29,jt,null,Y.mode);return Me.lanes=dt,Me.return=Y,Me}}}var Or=dp(!0),pp=dp(!1),si=V(null),bi=null;function la(t){var n=t.alternate;I(un,un.current&1),I(si,t),bi===null&&(n===null||Cr.current!==null||n.memoizedState!==null)&&(bi=t)}function mp(t){if(t.tag===22){if(I(un,un.current),I(si,t),bi===null){var n=t.alternate;n!==null&&n.memoizedState!==null&&(bi=t)}}else ca()}function ca(){I(un,un.current),I(si,si.current)}function Ii(t){j(si),bi===t&&(bi=null),j(un)}var un=V(0);function cl(t){for(var n=t;n!==null;){if(n.tag===13){var a=n.memoizedState;if(a!==null&&(a=a.dehydrated,a===null||a.data==="$?"||mf(a)))return n}else if(n.tag===19&&n.memoizedProps.revealOrder!==void 0){if((n.flags&128)!==0)return n}else if(n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return null;n=n.return}n.sibling.return=n.return,n=n.sibling}return null}function bu(t,n,a,s){n=t.memoizedState,a=a(s,n),a=a==null?n:g({},n,a),t.memoizedState=a,t.lanes===0&&(t.updateQueue.baseState=a)}var Au={enqueueSetState:function(t,n,a){t=t._reactInternals;var s=Kn(),c=ra(s);c.payload=n,a!=null&&(c.callback=a),n=sa(t,c,s),n!==null&&(Qn(n,t,s),Hs(n,t,s))},enqueueReplaceState:function(t,n,a){t=t._reactInternals;var s=Kn(),c=ra(s);c.tag=1,c.payload=n,a!=null&&(c.callback=a),n=sa(t,c,s),n!==null&&(Qn(n,t,s),Hs(n,t,s))},enqueueForceUpdate:function(t,n){t=t._reactInternals;var a=Kn(),s=ra(a);s.tag=2,n!=null&&(s.callback=n),n=sa(t,s,a),n!==null&&(Qn(n,t,a),Hs(n,t,a))}};function gp(t,n,a,s,c,f,M){return t=t.stateNode,typeof t.shouldComponentUpdate=="function"?t.shouldComponentUpdate(s,f,M):n.prototype&&n.prototype.isPureReactComponent?!Ds(a,s)||!Ds(c,f):!0}function _p(t,n,a,s){t=n.state,typeof n.componentWillReceiveProps=="function"&&n.componentWillReceiveProps(a,s),typeof n.UNSAFE_componentWillReceiveProps=="function"&&n.UNSAFE_componentWillReceiveProps(a,s),n.state!==t&&Au.enqueueReplaceState(n,n.state,null)}function Qa(t,n){var a=n;if("ref"in n){a={};for(var s in n)s!=="ref"&&(a[s]=n[s])}if(t=t.defaultProps){a===n&&(a=g({},a));for(var c in t)a[c]===void 0&&(a[c]=t[c])}return a}var ul=typeof reportError=="function"?reportError:function(t){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var n=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof t=="object"&&t!==null&&typeof t.message=="string"?String(t.message):String(t),error:t});if(!window.dispatchEvent(n))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",t);return}console.error(t)};function vp(t){ul(t)}function Sp(t){console.error(t)}function xp(t){ul(t)}function fl(t,n){try{var a=t.onUncaughtError;a(n.value,{componentStack:n.stack})}catch(s){setTimeout(function(){throw s})}}function Mp(t,n,a){try{var s=t.onCaughtError;s(a.value,{componentStack:a.stack,errorBoundary:n.tag===1?n.stateNode:null})}catch(c){setTimeout(function(){throw c})}}function Ru(t,n,a){return a=ra(a),a.tag=3,a.payload={element:null},a.callback=function(){fl(t,n)},a}function yp(t){return t=ra(t),t.tag=3,t}function Ep(t,n,a,s){var c=a.type.getDerivedStateFromError;if(typeof c=="function"){var f=s.value;t.payload=function(){return c(f)},t.callback=function(){Mp(n,a,s)}}var M=a.stateNode;M!==null&&typeof M.componentDidCatch=="function"&&(t.callback=function(){Mp(n,a,s),typeof c!="function"&&(ma===null?ma=new Set([this]):ma.add(this));var E=s.stack;this.componentDidCatch(s.value,{componentStack:E!==null?E:""})})}function S0(t,n,a,s,c){if(a.flags|=32768,s!==null&&typeof s=="object"&&typeof s.then=="function"){if(n=a.alternate,n!==null&&Ps(n,a,c,!0),a=si.current,a!==null){switch(a.tag){case 13:return bi===null?Qu():a.alternate===null&&$e===0&&($e=3),a.flags&=-257,a.flags|=65536,a.lanes=c,s===nu?a.flags|=16384:(n=a.updateQueue,n===null?a.updateQueue=new Set([s]):n.add(s),$u(t,s,c)),!1;case 22:return a.flags|=65536,s===nu?a.flags|=16384:(n=a.updateQueue,n===null?(n={transitions:null,markerInstances:null,retryQueue:new Set([s])},a.updateQueue=n):(a=n.retryQueue,a===null?n.retryQueue=new Set([s]):a.add(s)),$u(t,s,c)),!1}throw Error(r(435,a.tag))}return $u(t,s,c),Qu(),!1}if(Ne)return n=si.current,n!==null?((n.flags&65536)===0&&(n.flags|=256),n.flags|=65536,n.lanes=c,s!==Zc&&(t=Error(r(422),{cause:s}),Os(ni(t,a)))):(s!==Zc&&(n=Error(r(423),{cause:s}),Os(ni(n,a))),t=t.current.alternate,t.flags|=65536,c&=-c,t.lanes|=c,s=ni(s,a),c=Ru(t.stateNode,s,c),ru(t,c),$e!==4&&($e=2)),!1;var f=Error(r(520),{cause:s});if(f=ni(f,a),eo===null?eo=[f]:eo.push(f),$e!==4&&($e=2),n===null)return!0;s=ni(s,a),a=n;do{switch(a.tag){case 3:return a.flags|=65536,t=c&-c,a.lanes|=t,t=Ru(a.stateNode,s,t),ru(a,t),!1;case 1:if(n=a.type,f=a.stateNode,(a.flags&128)===0&&(typeof n.getDerivedStateFromError=="function"||f!==null&&typeof f.componentDidCatch=="function"&&(ma===null||!ma.has(f))))return a.flags|=65536,c&=-c,a.lanes|=c,c=yp(c),Ep(c,t,a,s),ru(a,c),!1}a=a.return}while(a!==null);return!1}var Tp=Error(r(461)),dn=!1;function Mn(t,n,a,s){n.child=t===null?pp(n,null,a,s):Or(n,t.child,a,s)}function bp(t,n,a,s,c){a=a.render;var f=n.ref;if("ref"in s){var M={};for(var E in s)E!=="ref"&&(M[E]=s[E])}else M=s;return ja(n),s=uu(t,n,a,M,f,c),E=fu(),t!==null&&!dn?(hu(t,n,c),Fi(t,n,c)):(Ne&&E&&Yc(n),n.flags|=1,Mn(t,n,s,c),n.child)}function Ap(t,n,a,s,c){if(t===null){var f=a.type;return typeof f=="function"&&!Xc(f)&&f.defaultProps===void 0&&a.compare===null?(n.tag=15,n.type=f,Rp(t,n,f,s,c)):(t=Xo(a.type,null,s,n,n.mode,c),t.ref=n.ref,t.return=n,n.child=t)}if(f=t.child,!Pu(t,c)){var M=f.memoizedProps;if(a=a.compare,a=a!==null?a:Ds,a(M,s)&&t.ref===n.ref)return Fi(t,n,c)}return n.flags|=1,t=Ui(f,s),t.ref=n.ref,t.return=n,n.child=t}function Rp(t,n,a,s,c){if(t!==null){var f=t.memoizedProps;if(Ds(f,s)&&t.ref===n.ref)if(dn=!1,n.pendingProps=s=f,Pu(t,c))(t.flags&131072)!==0&&(dn=!0);else return n.lanes=t.lanes,Fi(t,n,c)}return wu(t,n,a,s,c)}function wp(t,n,a){var s=n.pendingProps,c=s.children,f=t!==null?t.memoizedState:null;if(s.mode==="hidden"){if((n.flags&128)!==0){if(s=f!==null?f.baseLanes|a:a,t!==null){for(c=n.child=t.child,f=0;c!==null;)f=f|c.lanes|c.childLanes,c=c.sibling;n.childLanes=f&~s}else n.childLanes=0,n.child=null;return Cp(t,n,s,a)}if((a&536870912)!==0)n.memoizedState={baseLanes:0,cachePool:null},t!==null&&Zo(n,f!==null?f.cachePool:null),f!==null?Rd(n,f):ou(),mp(n);else return n.lanes=n.childLanes=536870912,Cp(t,n,f!==null?f.baseLanes|a:a,a)}else f!==null?(Zo(n,f.cachePool),Rd(n,f),ca(),n.memoizedState=null):(t!==null&&Zo(n,null),ou(),ca());return Mn(t,n,c,a),n.child}function Cp(t,n,a,s){var c=eu();return c=c===null?null:{parent:cn._currentValue,pool:c},n.memoizedState={baseLanes:a,cachePool:c},t!==null&&Zo(n,null),ou(),mp(n),t!==null&&Ps(t,n,s,!0),null}function hl(t,n){var a=n.ref;if(a===null)t!==null&&t.ref!==null&&(n.flags|=4194816);else{if(typeof a!="function"&&typeof a!="object")throw Error(r(284));(t===null||t.ref!==a)&&(n.flags|=4194816)}}function wu(t,n,a,s,c){return ja(n),a=uu(t,n,a,s,void 0,c),s=fu(),t!==null&&!dn?(hu(t,n,c),Fi(t,n,c)):(Ne&&s&&Yc(n),n.flags|=1,Mn(t,n,a,c),n.child)}function Dp(t,n,a,s,c,f){return ja(n),n.updateQueue=null,a=Cd(n,s,a,c),wd(t),s=fu(),t!==null&&!dn?(hu(t,n,f),Fi(t,n,f)):(Ne&&s&&Yc(n),n.flags|=1,Mn(t,n,a,f),n.child)}function Lp(t,n,a,s,c){if(ja(n),n.stateNode===null){var f=Tr,M=a.contextType;typeof M=="object"&&M!==null&&(f=Cn(M)),f=new a(s,f),n.memoizedState=f.state!==null&&f.state!==void 0?f.state:null,f.updater=Au,n.stateNode=f,f._reactInternals=n,f=n.stateNode,f.props=s,f.state=n.memoizedState,f.refs={},iu(n),M=a.contextType,f.context=typeof M=="object"&&M!==null?Cn(M):Tr,f.state=n.memoizedState,M=a.getDerivedStateFromProps,typeof M=="function"&&(bu(n,a,M,s),f.state=n.memoizedState),typeof a.getDerivedStateFromProps=="function"||typeof f.getSnapshotBeforeUpdate=="function"||typeof f.UNSAFE_componentWillMount!="function"&&typeof f.componentWillMount!="function"||(M=f.state,typeof f.componentWillMount=="function"&&f.componentWillMount(),typeof f.UNSAFE_componentWillMount=="function"&&f.UNSAFE_componentWillMount(),M!==f.state&&Au.enqueueReplaceState(f,f.state,null),Vs(n,s,f,c),Gs(),f.state=n.memoizedState),typeof f.componentDidMount=="function"&&(n.flags|=4194308),s=!0}else if(t===null){f=n.stateNode;var E=n.memoizedProps,z=Qa(a,E);f.props=z;var Q=f.context,ft=a.contextType;M=Tr,typeof ft=="object"&&ft!==null&&(M=Cn(ft));var mt=a.getDerivedStateFromProps;ft=typeof mt=="function"||typeof f.getSnapshotBeforeUpdate=="function",E=n.pendingProps!==E,ft||typeof f.UNSAFE_componentWillReceiveProps!="function"&&typeof f.componentWillReceiveProps!="function"||(E||Q!==M)&&_p(n,f,s,M),aa=!1;var et=n.memoizedState;f.state=et,Vs(n,s,f,c),Gs(),Q=n.memoizedState,E||et!==Q||aa?(typeof mt=="function"&&(bu(n,a,mt,s),Q=n.memoizedState),(z=aa||gp(n,a,z,s,et,Q,M))?(ft||typeof f.UNSAFE_componentWillMount!="function"&&typeof f.componentWillMount!="function"||(typeof f.componentWillMount=="function"&&f.componentWillMount(),typeof f.UNSAFE_componentWillMount=="function"&&f.UNSAFE_componentWillMount()),typeof f.componentDidMount=="function"&&(n.flags|=4194308)):(typeof f.componentDidMount=="function"&&(n.flags|=4194308),n.memoizedProps=s,n.memoizedState=Q),f.props=s,f.state=Q,f.context=M,s=z):(typeof f.componentDidMount=="function"&&(n.flags|=4194308),s=!1)}else{f=n.stateNode,au(t,n),M=n.memoizedProps,ft=Qa(a,M),f.props=ft,mt=n.pendingProps,et=f.context,Q=a.contextType,z=Tr,typeof Q=="object"&&Q!==null&&(z=Cn(Q)),E=a.getDerivedStateFromProps,(Q=typeof E=="function"||typeof f.getSnapshotBeforeUpdate=="function")||typeof f.UNSAFE_componentWillReceiveProps!="function"&&typeof f.componentWillReceiveProps!="function"||(M!==mt||et!==z)&&_p(n,f,s,z),aa=!1,et=n.memoizedState,f.state=et,Vs(n,s,f,c),Gs();var at=n.memoizedState;M!==mt||et!==at||aa||t!==null&&t.dependencies!==null&&Yo(t.dependencies)?(typeof E=="function"&&(bu(n,a,E,s),at=n.memoizedState),(ft=aa||gp(n,a,ft,s,et,at,z)||t!==null&&t.dependencies!==null&&Yo(t.dependencies))?(Q||typeof f.UNSAFE_componentWillUpdate!="function"&&typeof f.componentWillUpdate!="function"||(typeof f.componentWillUpdate=="function"&&f.componentWillUpdate(s,at,z),typeof f.UNSAFE_componentWillUpdate=="function"&&f.UNSAFE_componentWillUpdate(s,at,z)),typeof f.componentDidUpdate=="function"&&(n.flags|=4),typeof f.getSnapshotBeforeUpdate=="function"&&(n.flags|=1024)):(typeof f.componentDidUpdate!="function"||M===t.memoizedProps&&et===t.memoizedState||(n.flags|=4),typeof f.getSnapshotBeforeUpdate!="function"||M===t.memoizedProps&&et===t.memoizedState||(n.flags|=1024),n.memoizedProps=s,n.memoizedState=at),f.props=s,f.state=at,f.context=z,s=ft):(typeof f.componentDidUpdate!="function"||M===t.memoizedProps&&et===t.memoizedState||(n.flags|=4),typeof f.getSnapshotBeforeUpdate!="function"||M===t.memoizedProps&&et===t.memoizedState||(n.flags|=1024),s=!1)}return f=s,hl(t,n),s=(n.flags&128)!==0,f||s?(f=n.stateNode,a=s&&typeof a.getDerivedStateFromError!="function"?null:f.render(),n.flags|=1,t!==null&&s?(n.child=Or(n,t.child,null,c),n.child=Or(n,null,a,c)):Mn(t,n,a,c),n.memoizedState=f.state,t=n.child):t=Fi(t,n,c),t}function Up(t,n,a,s){return Ns(),n.flags|=256,Mn(t,n,a,s),n.child}var Cu={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function Du(t){return{baseLanes:t,cachePool:Sd()}}function Lu(t,n,a){return t=t!==null?t.childLanes&~a:0,n&&(t|=oi),t}function Np(t,n,a){var s=n.pendingProps,c=!1,f=(n.flags&128)!==0,M;if((M=f)||(M=t!==null&&t.memoizedState===null?!1:(un.current&2)!==0),M&&(c=!0,n.flags&=-129),M=(n.flags&32)!==0,n.flags&=-33,t===null){if(Ne){if(c?la(n):ca(),Ne){var E=Je,z;if(z=E){t:{for(z=E,E=Ti;z.nodeType!==8;){if(!E){E=null;break t}if(z=_i(z.nextSibling),z===null){E=null;break t}}E=z}E!==null?(n.memoizedState={dehydrated:E,treeContext:ka!==null?{id:Ni,overflow:Oi}:null,retryLane:536870912,hydrationErrors:null},z=qn(18,null,null,0),z.stateNode=E,z.return=n,n.child=z,Nn=n,Je=null,z=!0):z=!1}z||qa(n)}if(E=n.memoizedState,E!==null&&(E=E.dehydrated,E!==null))return mf(E)?n.lanes=32:n.lanes=536870912,null;Ii(n)}return E=s.children,s=s.fallback,c?(ca(),c=n.mode,E=dl({mode:"hidden",children:E},c),s=Va(s,c,a,null),E.return=n,s.return=n,E.sibling=s,n.child=E,c=n.child,c.memoizedState=Du(a),c.childLanes=Lu(t,M,a),n.memoizedState=Cu,s):(la(n),Uu(n,E))}if(z=t.memoizedState,z!==null&&(E=z.dehydrated,E!==null)){if(f)n.flags&256?(la(n),n.flags&=-257,n=Nu(t,n,a)):n.memoizedState!==null?(ca(),n.child=t.child,n.flags|=128,n=null):(ca(),c=s.fallback,E=n.mode,s=dl({mode:"visible",children:s.children},E),c=Va(c,E,a,null),c.flags|=2,s.return=n,c.return=n,s.sibling=c,n.child=s,Or(n,t.child,null,a),s=n.child,s.memoizedState=Du(a),s.childLanes=Lu(t,M,a),n.memoizedState=Cu,n=c);else if(la(n),mf(E)){if(M=E.nextSibling&&E.nextSibling.dataset,M)var Q=M.dgst;M=Q,s=Error(r(419)),s.stack="",s.digest=M,Os({value:s,source:null,stack:null}),n=Nu(t,n,a)}else if(dn||Ps(t,n,a,!1),M=(a&t.childLanes)!==0,dn||M){if(M=We,M!==null&&(s=a&-a,s=(s&42)!==0?1:we(s),s=(s&(M.suspendedLanes|a))!==0?0:s,s!==0&&s!==z.retryLane))throw z.retryLane=s,Er(t,s),Qn(M,t,s),Tp;E.data==="$?"||Qu(),n=Nu(t,n,a)}else E.data==="$?"?(n.flags|=192,n.child=t.child,n=null):(t=z.treeContext,Je=_i(E.nextSibling),Nn=n,Ne=!0,Wa=null,Ti=!1,t!==null&&(ai[ri++]=Ni,ai[ri++]=Oi,ai[ri++]=ka,Ni=t.id,Oi=t.overflow,ka=n),n=Uu(n,s.children),n.flags|=4096);return n}return c?(ca(),c=s.fallback,E=n.mode,z=t.child,Q=z.sibling,s=Ui(z,{mode:"hidden",children:s.children}),s.subtreeFlags=z.subtreeFlags&65011712,Q!==null?c=Ui(Q,c):(c=Va(c,E,a,null),c.flags|=2),c.return=n,s.return=n,s.sibling=c,n.child=s,s=c,c=n.child,E=t.child.memoizedState,E===null?E=Du(a):(z=E.cachePool,z!==null?(Q=cn._currentValue,z=z.parent!==Q?{parent:Q,pool:Q}:z):z=Sd(),E={baseLanes:E.baseLanes|a,cachePool:z}),c.memoizedState=E,c.childLanes=Lu(t,M,a),n.memoizedState=Cu,s):(la(n),a=t.child,t=a.sibling,a=Ui(a,{mode:"visible",children:s.children}),a.return=n,a.sibling=null,t!==null&&(M=n.deletions,M===null?(n.deletions=[t],n.flags|=16):M.push(t)),n.child=a,n.memoizedState=null,a)}function Uu(t,n){return n=dl({mode:"visible",children:n},t.mode),n.return=t,t.child=n}function dl(t,n){return t=qn(22,t,null,n),t.lanes=0,t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null},t}function Nu(t,n,a){return Or(n,t.child,null,a),t=Uu(n,n.pendingProps.children),t.flags|=2,n.memoizedState=null,t}function Op(t,n,a){t.lanes|=n;var s=t.alternate;s!==null&&(s.lanes|=n),Qc(t.return,n,a)}function Ou(t,n,a,s,c){var f=t.memoizedState;f===null?t.memoizedState={isBackwards:n,rendering:null,renderingStartTime:0,last:s,tail:a,tailMode:c}:(f.isBackwards=n,f.rendering=null,f.renderingStartTime=0,f.last=s,f.tail=a,f.tailMode=c)}function Pp(t,n,a){var s=n.pendingProps,c=s.revealOrder,f=s.tail;if(Mn(t,n,s.children,a),s=un.current,(s&2)!==0)s=s&1|2,n.flags|=128;else{if(t!==null&&(t.flags&128)!==0)t:for(t=n.child;t!==null;){if(t.tag===13)t.memoizedState!==null&&Op(t,a,n);else if(t.tag===19)Op(t,a,n);else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===n)break t;for(;t.sibling===null;){if(t.return===null||t.return===n)break t;t=t.return}t.sibling.return=t.return,t=t.sibling}s&=1}switch(I(un,s),c){case"forwards":for(a=n.child,c=null;a!==null;)t=a.alternate,t!==null&&cl(t)===null&&(c=a),a=a.sibling;a=c,a===null?(c=n.child,n.child=null):(c=a.sibling,a.sibling=null),Ou(n,!1,c,a,f);break;case"backwards":for(a=null,c=n.child,n.child=null;c!==null;){if(t=c.alternate,t!==null&&cl(t)===null){n.child=c;break}t=c.sibling,c.sibling=a,a=c,c=t}Ou(n,!0,a,null,f);break;case"together":Ou(n,!1,null,null,void 0);break;default:n.memoizedState=null}return n.child}function Fi(t,n,a){if(t!==null&&(n.dependencies=t.dependencies),pa|=n.lanes,(a&n.childLanes)===0)if(t!==null){if(Ps(t,n,a,!1),(a&n.childLanes)===0)return null}else return null;if(t!==null&&n.child!==t.child)throw Error(r(153));if(n.child!==null){for(t=n.child,a=Ui(t,t.pendingProps),n.child=a,a.return=n;t.sibling!==null;)t=t.sibling,a=a.sibling=Ui(t,t.pendingProps),a.return=n;a.sibling=null}return n.child}function Pu(t,n){return(t.lanes&n)!==0?!0:(t=t.dependencies,!!(t!==null&&Yo(t)))}function x0(t,n,a){switch(n.tag){case 3:Pt(n,n.stateNode.containerInfo),ia(n,cn,t.memoizedState.cache),Ns();break;case 27:case 5:kt(n);break;case 4:Pt(n,n.stateNode.containerInfo);break;case 10:ia(n,n.type,n.memoizedProps.value);break;case 13:var s=n.memoizedState;if(s!==null)return s.dehydrated!==null?(la(n),n.flags|=128,null):(a&n.child.childLanes)!==0?Np(t,n,a):(la(n),t=Fi(t,n,a),t!==null?t.sibling:null);la(n);break;case 19:var c=(t.flags&128)!==0;if(s=(a&n.childLanes)!==0,s||(Ps(t,n,a,!1),s=(a&n.childLanes)!==0),c){if(s)return Pp(t,n,a);n.flags|=128}if(c=n.memoizedState,c!==null&&(c.rendering=null,c.tail=null,c.lastEffect=null),I(un,un.current),s)break;return null;case 22:case 23:return n.lanes=0,wp(t,n,a);case 24:ia(n,cn,t.memoizedState.cache)}return Fi(t,n,a)}function zp(t,n,a){if(t!==null)if(t.memoizedProps!==n.pendingProps)dn=!0;else{if(!Pu(t,a)&&(n.flags&128)===0)return dn=!1,x0(t,n,a);dn=(t.flags&131072)!==0}else dn=!1,Ne&&(n.flags&1048576)!==0&&hd(n,qo,n.index);switch(n.lanes=0,n.tag){case 16:t:{t=n.pendingProps;var s=n.elementType,c=s._init;if(s=c(s._payload),n.type=s,typeof s=="function")Xc(s)?(t=Qa(s,t),n.tag=1,n=Lp(null,n,s,t,a)):(n.tag=0,n=wu(null,n,s,t,a));else{if(s!=null){if(c=s.$$typeof,c===O){n.tag=11,n=bp(null,n,s,t,a);break t}else if(c===B){n.tag=14,n=Ap(null,n,s,t,a);break t}}throw n=X(s)||s,Error(r(306,n,""))}}return n;case 0:return wu(t,n,n.type,n.pendingProps,a);case 1:return s=n.type,c=Qa(s,n.pendingProps),Lp(t,n,s,c,a);case 3:t:{if(Pt(n,n.stateNode.containerInfo),t===null)throw Error(r(387));s=n.pendingProps;var f=n.memoizedState;c=f.element,au(t,n),Vs(n,s,null,a);var M=n.memoizedState;if(s=M.cache,ia(n,cn,s),s!==f.cache&&Jc(n,[cn],a,!0),Gs(),s=M.element,f.isDehydrated)if(f={element:s,isDehydrated:!1,cache:M.cache},n.updateQueue.baseState=f,n.memoizedState=f,n.flags&256){n=Up(t,n,s,a);break t}else if(s!==c){c=ni(Error(r(424)),n),Os(c),n=Up(t,n,s,a);break t}else for(t=n.stateNode.containerInfo,t.nodeType===9?t=t.body:t=t.nodeName==="HTML"?t.ownerDocument.body:t,Je=_i(t.firstChild),Nn=n,Ne=!0,Wa=null,Ti=!0,a=pp(n,null,s,a),n.child=a;a;)a.flags=a.flags&-3|4096,a=a.sibling;else{if(Ns(),s===c){n=Fi(t,n,a);break t}Mn(t,n,s,a)}n=n.child}return n;case 26:return hl(t,n),t===null?(a=Hm(n.type,null,n.pendingProps,null))?n.memoizedState=a:Ne||(a=n.type,t=n.pendingProps,s=Rl(vt.current).createElement(a),s[Lt]=n,s[$t]=t,En(s,a,t),W(s),n.stateNode=s):n.memoizedState=Hm(n.type,t.memoizedProps,n.pendingProps,t.memoizedState),null;case 27:return kt(n),t===null&&Ne&&(s=n.stateNode=Bm(n.type,n.pendingProps,vt.current),Nn=n,Ti=!0,c=Je,va(n.type)?(gf=c,Je=_i(s.firstChild)):Je=c),Mn(t,n,n.pendingProps.children,a),hl(t,n),t===null&&(n.flags|=4194304),n.child;case 5:return t===null&&Ne&&((c=s=Je)&&(s=j0(s,n.type,n.pendingProps,Ti),s!==null?(n.stateNode=s,Nn=n,Je=_i(s.firstChild),Ti=!1,c=!0):c=!1),c||qa(n)),kt(n),c=n.type,f=n.pendingProps,M=t!==null?t.memoizedProps:null,s=f.children,hf(c,f)?s=null:M!==null&&hf(c,M)&&(n.flags|=32),n.memoizedState!==null&&(c=uu(t,n,h0,null,null,a),uo._currentValue=c),hl(t,n),Mn(t,n,s,a),n.child;case 6:return t===null&&Ne&&((t=a=Je)&&(a=Z0(a,n.pendingProps,Ti),a!==null?(n.stateNode=a,Nn=n,Je=null,t=!0):t=!1),t||qa(n)),null;case 13:return Np(t,n,a);case 4:return Pt(n,n.stateNode.containerInfo),s=n.pendingProps,t===null?n.child=Or(n,null,s,a):Mn(t,n,s,a),n.child;case 11:return bp(t,n,n.type,n.pendingProps,a);case 7:return Mn(t,n,n.pendingProps,a),n.child;case 8:return Mn(t,n,n.pendingProps.children,a),n.child;case 12:return Mn(t,n,n.pendingProps.children,a),n.child;case 10:return s=n.pendingProps,ia(n,n.type,s.value),Mn(t,n,s.children,a),n.child;case 9:return c=n.type._context,s=n.pendingProps.children,ja(n),c=Cn(c),s=s(c),n.flags|=1,Mn(t,n,s,a),n.child;case 14:return Ap(t,n,n.type,n.pendingProps,a);case 15:return Rp(t,n,n.type,n.pendingProps,a);case 19:return Pp(t,n,a);case 31:return s=n.pendingProps,a=n.mode,s={mode:s.mode,children:s.children},t===null?(a=dl(s,a),a.ref=n.ref,n.child=a,a.return=n,n=a):(a=Ui(t.child,s),a.ref=n.ref,n.child=a,a.return=n,n=a),n;case 22:return wp(t,n,a);case 24:return ja(n),s=Cn(cn),t===null?(c=eu(),c===null&&(c=We,f=$c(),c.pooledCache=f,f.refCount++,f!==null&&(c.pooledCacheLanes|=a),c=f),n.memoizedState={parent:s,cache:c},iu(n),ia(n,cn,c)):((t.lanes&a)!==0&&(au(t,n),Vs(n,null,null,a),Gs()),c=t.memoizedState,f=n.memoizedState,c.parent!==s?(c={parent:s,cache:s},n.memoizedState=c,n.lanes===0&&(n.memoizedState=n.updateQueue.baseState=c),ia(n,cn,s)):(s=f.cache,ia(n,cn,s),s!==c.cache&&Jc(n,[cn],a,!0))),Mn(t,n,n.pendingProps.children,a),n.child;case 29:throw n.pendingProps}throw Error(r(156,n.tag))}function Hi(t){t.flags|=4}function Bp(t,n){if(n.type!=="stylesheet"||(n.state.loading&4)!==0)t.flags&=-16777217;else if(t.flags|=16777216,!Wm(n)){if(n=si.current,n!==null&&((Re&4194048)===Re?bi!==null:(Re&62914560)!==Re&&(Re&536870912)===0||n!==bi))throw Fs=nu,xd;t.flags|=8192}}function pl(t,n){n!==null&&(t.flags|=4),t.flags&16384&&(n=t.tag!==22?Tt():536870912,t.lanes|=n,Ir|=n)}function Zs(t,n){if(!Ne)switch(t.tailMode){case"hidden":n=t.tail;for(var a=null;n!==null;)n.alternate!==null&&(a=n),n=n.sibling;a===null?t.tail=null:a.sibling=null;break;case"collapsed":a=t.tail;for(var s=null;a!==null;)a.alternate!==null&&(s=a),a=a.sibling;s===null?n||t.tail===null?t.tail=null:t.tail.sibling=null:s.sibling=null}}function Qe(t){var n=t.alternate!==null&&t.alternate.child===t.child,a=0,s=0;if(n)for(var c=t.child;c!==null;)a|=c.lanes|c.childLanes,s|=c.subtreeFlags&65011712,s|=c.flags&65011712,c.return=t,c=c.sibling;else for(c=t.child;c!==null;)a|=c.lanes|c.childLanes,s|=c.subtreeFlags,s|=c.flags,c.return=t,c=c.sibling;return t.subtreeFlags|=s,t.childLanes=a,n}function M0(t,n,a){var s=n.pendingProps;switch(jc(n),n.tag){case 31:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Qe(n),null;case 1:return Qe(n),null;case 3:return a=n.stateNode,s=null,t!==null&&(s=t.memoizedState.cache),n.memoizedState.cache!==s&&(n.flags|=2048),zi(cn),Kt(),a.pendingContext&&(a.context=a.pendingContext,a.pendingContext=null),(t===null||t.child===null)&&(Us(n)?Hi(n):t===null||t.memoizedState.isDehydrated&&(n.flags&256)===0||(n.flags|=1024,md())),Qe(n),null;case 26:return a=n.memoizedState,t===null?(Hi(n),a!==null?(Qe(n),Bp(n,a)):(Qe(n),n.flags&=-16777217)):a?a!==t.memoizedState?(Hi(n),Qe(n),Bp(n,a)):(Qe(n),n.flags&=-16777217):(t.memoizedProps!==s&&Hi(n),Qe(n),n.flags&=-16777217),null;case 27:oe(n),a=vt.current;var c=n.type;if(t!==null&&n.stateNode!=null)t.memoizedProps!==s&&Hi(n);else{if(!s){if(n.stateNode===null)throw Error(r(166));return Qe(n),null}t=$.current,Us(n)?dd(n):(t=Bm(c,s,a),n.stateNode=t,Hi(n))}return Qe(n),null;case 5:if(oe(n),a=n.type,t!==null&&n.stateNode!=null)t.memoizedProps!==s&&Hi(n);else{if(!s){if(n.stateNode===null)throw Error(r(166));return Qe(n),null}if(t=$.current,Us(n))dd(n);else{switch(c=Rl(vt.current),t){case 1:t=c.createElementNS("http://www.w3.org/2000/svg",a);break;case 2:t=c.createElementNS("http://www.w3.org/1998/Math/MathML",a);break;default:switch(a){case"svg":t=c.createElementNS("http://www.w3.org/2000/svg",a);break;case"math":t=c.createElementNS("http://www.w3.org/1998/Math/MathML",a);break;case"script":t=c.createElement("div"),t.innerHTML="<script><\/script>",t=t.removeChild(t.firstChild);break;case"select":t=typeof s.is=="string"?c.createElement("select",{is:s.is}):c.createElement("select"),s.multiple?t.multiple=!0:s.size&&(t.size=s.size);break;default:t=typeof s.is=="string"?c.createElement(a,{is:s.is}):c.createElement(a)}}t[Lt]=n,t[$t]=s;t:for(c=n.child;c!==null;){if(c.tag===5||c.tag===6)t.appendChild(c.stateNode);else if(c.tag!==4&&c.tag!==27&&c.child!==null){c.child.return=c,c=c.child;continue}if(c===n)break t;for(;c.sibling===null;){if(c.return===null||c.return===n)break t;c=c.return}c.sibling.return=c.return,c=c.sibling}n.stateNode=t;t:switch(En(t,a,s),a){case"button":case"input":case"select":case"textarea":t=!!s.autoFocus;break t;case"img":t=!0;break t;default:t=!1}t&&Hi(n)}}return Qe(n),n.flags&=-16777217,null;case 6:if(t&&n.stateNode!=null)t.memoizedProps!==s&&Hi(n);else{if(typeof s!="string"&&n.stateNode===null)throw Error(r(166));if(t=vt.current,Us(n)){if(t=n.stateNode,a=n.memoizedProps,s=null,c=Nn,c!==null)switch(c.tag){case 27:case 5:s=c.memoizedProps}t[Lt]=n,t=!!(t.nodeValue===a||s!==null&&s.suppressHydrationWarning===!0||Dm(t.nodeValue,a)),t||qa(n)}else t=Rl(t).createTextNode(s),t[Lt]=n,n.stateNode=t}return Qe(n),null;case 13:if(s=n.memoizedState,t===null||t.memoizedState!==null&&t.memoizedState.dehydrated!==null){if(c=Us(n),s!==null&&s.dehydrated!==null){if(t===null){if(!c)throw Error(r(318));if(c=n.memoizedState,c=c!==null?c.dehydrated:null,!c)throw Error(r(317));c[Lt]=n}else Ns(),(n.flags&128)===0&&(n.memoizedState=null),n.flags|=4;Qe(n),c=!1}else c=md(),t!==null&&t.memoizedState!==null&&(t.memoizedState.hydrationErrors=c),c=!0;if(!c)return n.flags&256?(Ii(n),n):(Ii(n),null)}if(Ii(n),(n.flags&128)!==0)return n.lanes=a,n;if(a=s!==null,t=t!==null&&t.memoizedState!==null,a){s=n.child,c=null,s.alternate!==null&&s.alternate.memoizedState!==null&&s.alternate.memoizedState.cachePool!==null&&(c=s.alternate.memoizedState.cachePool.pool);var f=null;s.memoizedState!==null&&s.memoizedState.cachePool!==null&&(f=s.memoizedState.cachePool.pool),f!==c&&(s.flags|=2048)}return a!==t&&a&&(n.child.flags|=8192),pl(n,n.updateQueue),Qe(n),null;case 4:return Kt(),t===null&&of(n.stateNode.containerInfo),Qe(n),null;case 10:return zi(n.type),Qe(n),null;case 19:if(j(un),c=n.memoizedState,c===null)return Qe(n),null;if(s=(n.flags&128)!==0,f=c.rendering,f===null)if(s)Zs(c,!1);else{if($e!==0||t!==null&&(t.flags&128)!==0)for(t=n.child;t!==null;){if(f=cl(t),f!==null){for(n.flags|=128,Zs(c,!1),t=f.updateQueue,n.updateQueue=t,pl(n,t),n.subtreeFlags=0,t=a,a=n.child;a!==null;)fd(a,t),a=a.sibling;return I(un,un.current&1|2),n.child}t=t.sibling}c.tail!==null&&Se()>_l&&(n.flags|=128,s=!0,Zs(c,!1),n.lanes=4194304)}else{if(!s)if(t=cl(f),t!==null){if(n.flags|=128,s=!0,t=t.updateQueue,n.updateQueue=t,pl(n,t),Zs(c,!0),c.tail===null&&c.tailMode==="hidden"&&!f.alternate&&!Ne)return Qe(n),null}else 2*Se()-c.renderingStartTime>_l&&a!==536870912&&(n.flags|=128,s=!0,Zs(c,!1),n.lanes=4194304);c.isBackwards?(f.sibling=n.child,n.child=f):(t=c.last,t!==null?t.sibling=f:n.child=f,c.last=f)}return c.tail!==null?(n=c.tail,c.rendering=n,c.tail=n.sibling,c.renderingStartTime=Se(),n.sibling=null,t=un.current,I(un,s?t&1|2:t&1),n):(Qe(n),null);case 22:case 23:return Ii(n),lu(),s=n.memoizedState!==null,t!==null?t.memoizedState!==null!==s&&(n.flags|=8192):s&&(n.flags|=8192),s?(a&536870912)!==0&&(n.flags&128)===0&&(Qe(n),n.subtreeFlags&6&&(n.flags|=8192)):Qe(n),a=n.updateQueue,a!==null&&pl(n,a.retryQueue),a=null,t!==null&&t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(a=t.memoizedState.cachePool.pool),s=null,n.memoizedState!==null&&n.memoizedState.cachePool!==null&&(s=n.memoizedState.cachePool.pool),s!==a&&(n.flags|=2048),t!==null&&j(Za),null;case 24:return a=null,t!==null&&(a=t.memoizedState.cache),n.memoizedState.cache!==a&&(n.flags|=2048),zi(cn),Qe(n),null;case 25:return null;case 30:return null}throw Error(r(156,n.tag))}function y0(t,n){switch(jc(n),n.tag){case 1:return t=n.flags,t&65536?(n.flags=t&-65537|128,n):null;case 3:return zi(cn),Kt(),t=n.flags,(t&65536)!==0&&(t&128)===0?(n.flags=t&-65537|128,n):null;case 26:case 27:case 5:return oe(n),null;case 13:if(Ii(n),t=n.memoizedState,t!==null&&t.dehydrated!==null){if(n.alternate===null)throw Error(r(340));Ns()}return t=n.flags,t&65536?(n.flags=t&-65537|128,n):null;case 19:return j(un),null;case 4:return Kt(),null;case 10:return zi(n.type),null;case 22:case 23:return Ii(n),lu(),t!==null&&j(Za),t=n.flags,t&65536?(n.flags=t&-65537|128,n):null;case 24:return zi(cn),null;case 25:return null;default:return null}}function Ip(t,n){switch(jc(n),n.tag){case 3:zi(cn),Kt();break;case 26:case 27:case 5:oe(n);break;case 4:Kt();break;case 13:Ii(n);break;case 19:j(un);break;case 10:zi(n.type);break;case 22:case 23:Ii(n),lu(),t!==null&&j(Za);break;case 24:zi(cn)}}function Ks(t,n){try{var a=n.updateQueue,s=a!==null?a.lastEffect:null;if(s!==null){var c=s.next;a=c;do{if((a.tag&t)===t){s=void 0;var f=a.create,M=a.inst;s=f(),M.destroy=s}a=a.next}while(a!==c)}}catch(E){ke(n,n.return,E)}}function ua(t,n,a){try{var s=n.updateQueue,c=s!==null?s.lastEffect:null;if(c!==null){var f=c.next;s=f;do{if((s.tag&t)===t){var M=s.inst,E=M.destroy;if(E!==void 0){M.destroy=void 0,c=n;var z=a,Q=E;try{Q()}catch(ft){ke(c,z,ft)}}}s=s.next}while(s!==f)}}catch(ft){ke(n,n.return,ft)}}function Fp(t){var n=t.updateQueue;if(n!==null){var a=t.stateNode;try{Ad(n,a)}catch(s){ke(t,t.return,s)}}}function Hp(t,n,a){a.props=Qa(t.type,t.memoizedProps),a.state=t.memoizedState;try{a.componentWillUnmount()}catch(s){ke(t,n,s)}}function Qs(t,n){try{var a=t.ref;if(a!==null){switch(t.tag){case 26:case 27:case 5:var s=t.stateNode;break;case 30:s=t.stateNode;break;default:s=t.stateNode}typeof a=="function"?t.refCleanup=a(s):a.current=s}}catch(c){ke(t,n,c)}}function Ai(t,n){var a=t.ref,s=t.refCleanup;if(a!==null)if(typeof s=="function")try{s()}catch(c){ke(t,n,c)}finally{t.refCleanup=null,t=t.alternate,t!=null&&(t.refCleanup=null)}else if(typeof a=="function")try{a(null)}catch(c){ke(t,n,c)}else a.current=null}function Gp(t){var n=t.type,a=t.memoizedProps,s=t.stateNode;try{t:switch(n){case"button":case"input":case"select":case"textarea":a.autoFocus&&s.focus();break t;case"img":a.src?s.src=a.src:a.srcSet&&(s.srcset=a.srcSet)}}catch(c){ke(t,t.return,c)}}function zu(t,n,a){try{var s=t.stateNode;k0(s,t.type,a,n),s[$t]=n}catch(c){ke(t,t.return,c)}}function Vp(t){return t.tag===5||t.tag===3||t.tag===26||t.tag===27&&va(t.type)||t.tag===4}function Bu(t){t:for(;;){for(;t.sibling===null;){if(t.return===null||Vp(t.return))return null;t=t.return}for(t.sibling.return=t.return,t=t.sibling;t.tag!==5&&t.tag!==6&&t.tag!==18;){if(t.tag===27&&va(t.type)||t.flags&2||t.child===null||t.tag===4)continue t;t.child.return=t,t=t.child}if(!(t.flags&2))return t.stateNode}}function Iu(t,n,a){var s=t.tag;if(s===5||s===6)t=t.stateNode,n?(a.nodeType===9?a.body:a.nodeName==="HTML"?a.ownerDocument.body:a).insertBefore(t,n):(n=a.nodeType===9?a.body:a.nodeName==="HTML"?a.ownerDocument.body:a,n.appendChild(t),a=a._reactRootContainer,a!=null||n.onclick!==null||(n.onclick=Al));else if(s!==4&&(s===27&&va(t.type)&&(a=t.stateNode,n=null),t=t.child,t!==null))for(Iu(t,n,a),t=t.sibling;t!==null;)Iu(t,n,a),t=t.sibling}function ml(t,n,a){var s=t.tag;if(s===5||s===6)t=t.stateNode,n?a.insertBefore(t,n):a.appendChild(t);else if(s!==4&&(s===27&&va(t.type)&&(a=t.stateNode),t=t.child,t!==null))for(ml(t,n,a),t=t.sibling;t!==null;)ml(t,n,a),t=t.sibling}function kp(t){var n=t.stateNode,a=t.memoizedProps;try{for(var s=t.type,c=n.attributes;c.length;)n.removeAttributeNode(c[0]);En(n,s,a),n[Lt]=t,n[$t]=a}catch(f){ke(t,t.return,f)}}var Gi=!1,nn=!1,Fu=!1,Xp=typeof WeakSet=="function"?WeakSet:Set,pn=null;function E0(t,n){if(t=t.containerInfo,uf=Nl,t=ed(t),Bc(t)){if("selectionStart"in t)var a={start:t.selectionStart,end:t.selectionEnd};else t:{a=(a=t.ownerDocument)&&a.defaultView||window;var s=a.getSelection&&a.getSelection();if(s&&s.rangeCount!==0){a=s.anchorNode;var c=s.anchorOffset,f=s.focusNode;s=s.focusOffset;try{a.nodeType,f.nodeType}catch{a=null;break t}var M=0,E=-1,z=-1,Q=0,ft=0,mt=t,et=null;e:for(;;){for(var at;mt!==a||c!==0&&mt.nodeType!==3||(E=M+c),mt!==f||s!==0&&mt.nodeType!==3||(z=M+s),mt.nodeType===3&&(M+=mt.nodeValue.length),(at=mt.firstChild)!==null;)et=mt,mt=at;for(;;){if(mt===t)break e;if(et===a&&++Q===c&&(E=M),et===f&&++ft===s&&(z=M),(at=mt.nextSibling)!==null)break;mt=et,et=mt.parentNode}mt=at}a=E===-1||z===-1?null:{start:E,end:z}}else a=null}a=a||{start:0,end:0}}else a=null;for(ff={focusedElem:t,selectionRange:a},Nl=!1,pn=n;pn!==null;)if(n=pn,t=n.child,(n.subtreeFlags&1024)!==0&&t!==null)t.return=n,pn=t;else for(;pn!==null;){switch(n=pn,f=n.alternate,t=n.flags,n.tag){case 0:break;case 11:case 15:break;case 1:if((t&1024)!==0&&f!==null){t=void 0,a=n,c=f.memoizedProps,f=f.memoizedState,s=a.stateNode;try{var se=Qa(a.type,c,a.elementType===a.type);t=s.getSnapshotBeforeUpdate(se,f),s.__reactInternalSnapshotBeforeUpdate=t}catch(ee){ke(a,a.return,ee)}}break;case 3:if((t&1024)!==0){if(t=n.stateNode.containerInfo,a=t.nodeType,a===9)pf(t);else if(a===1)switch(t.nodeName){case"HEAD":case"HTML":case"BODY":pf(t);break;default:t.textContent=""}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;default:if((t&1024)!==0)throw Error(r(163))}if(t=n.sibling,t!==null){t.return=n.return,pn=t;break}pn=n.return}}function Wp(t,n,a){var s=a.flags;switch(a.tag){case 0:case 11:case 15:fa(t,a),s&4&&Ks(5,a);break;case 1:if(fa(t,a),s&4)if(t=a.stateNode,n===null)try{t.componentDidMount()}catch(M){ke(a,a.return,M)}else{var c=Qa(a.type,n.memoizedProps);n=n.memoizedState;try{t.componentDidUpdate(c,n,t.__reactInternalSnapshotBeforeUpdate)}catch(M){ke(a,a.return,M)}}s&64&&Fp(a),s&512&&Qs(a,a.return);break;case 3:if(fa(t,a),s&64&&(t=a.updateQueue,t!==null)){if(n=null,a.child!==null)switch(a.child.tag){case 27:case 5:n=a.child.stateNode;break;case 1:n=a.child.stateNode}try{Ad(t,n)}catch(M){ke(a,a.return,M)}}break;case 27:n===null&&s&4&&kp(a);case 26:case 5:fa(t,a),n===null&&s&4&&Gp(a),s&512&&Qs(a,a.return);break;case 12:fa(t,a);break;case 13:fa(t,a),s&4&&jp(t,a),s&64&&(t=a.memoizedState,t!==null&&(t=t.dehydrated,t!==null&&(a=U0.bind(null,a),K0(t,a))));break;case 22:if(s=a.memoizedState!==null||Gi,!s){n=n!==null&&n.memoizedState!==null||nn,c=Gi;var f=nn;Gi=s,(nn=n)&&!f?ha(t,a,(a.subtreeFlags&8772)!==0):fa(t,a),Gi=c,nn=f}break;case 30:break;default:fa(t,a)}}function qp(t){var n=t.alternate;n!==null&&(t.alternate=null,qp(n)),t.child=null,t.deletions=null,t.sibling=null,t.tag===5&&(n=t.stateNode,n!==null&&zn(n)),t.stateNode=null,t.return=null,t.dependencies=null,t.memoizedProps=null,t.memoizedState=null,t.pendingProps=null,t.stateNode=null,t.updateQueue=null}var Ke=null,Fn=!1;function Vi(t,n,a){for(a=a.child;a!==null;)Yp(t,n,a),a=a.sibling}function Yp(t,n,a){if(Dt&&typeof Dt.onCommitFiberUnmount=="function")try{Dt.onCommitFiberUnmount(At,a)}catch{}switch(a.tag){case 26:nn||Ai(a,n),Vi(t,n,a),a.memoizedState?a.memoizedState.count--:a.stateNode&&(a=a.stateNode,a.parentNode.removeChild(a));break;case 27:nn||Ai(a,n);var s=Ke,c=Fn;va(a.type)&&(Ke=a.stateNode,Fn=!1),Vi(t,n,a),so(a.stateNode),Ke=s,Fn=c;break;case 5:nn||Ai(a,n);case 6:if(s=Ke,c=Fn,Ke=null,Vi(t,n,a),Ke=s,Fn=c,Ke!==null)if(Fn)try{(Ke.nodeType===9?Ke.body:Ke.nodeName==="HTML"?Ke.ownerDocument.body:Ke).removeChild(a.stateNode)}catch(f){ke(a,n,f)}else try{Ke.removeChild(a.stateNode)}catch(f){ke(a,n,f)}break;case 18:Ke!==null&&(Fn?(t=Ke,Pm(t.nodeType===9?t.body:t.nodeName==="HTML"?t.ownerDocument.body:t,a.stateNode),mo(t)):Pm(Ke,a.stateNode));break;case 4:s=Ke,c=Fn,Ke=a.stateNode.containerInfo,Fn=!0,Vi(t,n,a),Ke=s,Fn=c;break;case 0:case 11:case 14:case 15:nn||ua(2,a,n),nn||ua(4,a,n),Vi(t,n,a);break;case 1:nn||(Ai(a,n),s=a.stateNode,typeof s.componentWillUnmount=="function"&&Hp(a,n,s)),Vi(t,n,a);break;case 21:Vi(t,n,a);break;case 22:nn=(s=nn)||a.memoizedState!==null,Vi(t,n,a),nn=s;break;default:Vi(t,n,a)}}function jp(t,n){if(n.memoizedState===null&&(t=n.alternate,t!==null&&(t=t.memoizedState,t!==null&&(t=t.dehydrated,t!==null))))try{mo(t)}catch(a){ke(n,n.return,a)}}function T0(t){switch(t.tag){case 13:case 19:var n=t.stateNode;return n===null&&(n=t.stateNode=new Xp),n;case 22:return t=t.stateNode,n=t._retryCache,n===null&&(n=t._retryCache=new Xp),n;default:throw Error(r(435,t.tag))}}function Hu(t,n){var a=T0(t);n.forEach(function(s){var c=N0.bind(null,t,s);a.has(s)||(a.add(s),s.then(c,c))})}function Yn(t,n){var a=n.deletions;if(a!==null)for(var s=0;s<a.length;s++){var c=a[s],f=t,M=n,E=M;t:for(;E!==null;){switch(E.tag){case 27:if(va(E.type)){Ke=E.stateNode,Fn=!1;break t}break;case 5:Ke=E.stateNode,Fn=!1;break t;case 3:case 4:Ke=E.stateNode.containerInfo,Fn=!0;break t}E=E.return}if(Ke===null)throw Error(r(160));Yp(f,M,c),Ke=null,Fn=!1,f=c.alternate,f!==null&&(f.return=null),c.return=null}if(n.subtreeFlags&13878)for(n=n.child;n!==null;)Zp(n,t),n=n.sibling}var gi=null;function Zp(t,n){var a=t.alternate,s=t.flags;switch(t.tag){case 0:case 11:case 14:case 15:Yn(n,t),jn(t),s&4&&(ua(3,t,t.return),Ks(3,t),ua(5,t,t.return));break;case 1:Yn(n,t),jn(t),s&512&&(nn||a===null||Ai(a,a.return)),s&64&&Gi&&(t=t.updateQueue,t!==null&&(s=t.callbacks,s!==null&&(a=t.shared.hiddenCallbacks,t.shared.hiddenCallbacks=a===null?s:a.concat(s))));break;case 26:var c=gi;if(Yn(n,t),jn(t),s&512&&(nn||a===null||Ai(a,a.return)),s&4){var f=a!==null?a.memoizedState:null;if(s=t.memoizedState,a===null)if(s===null)if(t.stateNode===null){t:{s=t.type,a=t.memoizedProps,c=c.ownerDocument||c;e:switch(s){case"title":f=c.getElementsByTagName("title")[0],(!f||f[Rn]||f[Lt]||f.namespaceURI==="http://www.w3.org/2000/svg"||f.hasAttribute("itemprop"))&&(f=c.createElement(s),c.head.insertBefore(f,c.querySelector("head > title"))),En(f,s,a),f[Lt]=t,W(f),s=f;break t;case"link":var M=km("link","href",c).get(s+(a.href||""));if(M){for(var E=0;E<M.length;E++)if(f=M[E],f.getAttribute("href")===(a.href==null||a.href===""?null:a.href)&&f.getAttribute("rel")===(a.rel==null?null:a.rel)&&f.getAttribute("title")===(a.title==null?null:a.title)&&f.getAttribute("crossorigin")===(a.crossOrigin==null?null:a.crossOrigin)){M.splice(E,1);break e}}f=c.createElement(s),En(f,s,a),c.head.appendChild(f);break;case"meta":if(M=km("meta","content",c).get(s+(a.content||""))){for(E=0;E<M.length;E++)if(f=M[E],f.getAttribute("content")===(a.content==null?null:""+a.content)&&f.getAttribute("name")===(a.name==null?null:a.name)&&f.getAttribute("property")===(a.property==null?null:a.property)&&f.getAttribute("http-equiv")===(a.httpEquiv==null?null:a.httpEquiv)&&f.getAttribute("charset")===(a.charSet==null?null:a.charSet)){M.splice(E,1);break e}}f=c.createElement(s),En(f,s,a),c.head.appendChild(f);break;default:throw Error(r(468,s))}f[Lt]=t,W(f),s=f}t.stateNode=s}else Xm(c,t.type,t.stateNode);else t.stateNode=Vm(c,s,t.memoizedProps);else f!==s?(f===null?a.stateNode!==null&&(a=a.stateNode,a.parentNode.removeChild(a)):f.count--,s===null?Xm(c,t.type,t.stateNode):Vm(c,s,t.memoizedProps)):s===null&&t.stateNode!==null&&zu(t,t.memoizedProps,a.memoizedProps)}break;case 27:Yn(n,t),jn(t),s&512&&(nn||a===null||Ai(a,a.return)),a!==null&&s&4&&zu(t,t.memoizedProps,a.memoizedProps);break;case 5:if(Yn(n,t),jn(t),s&512&&(nn||a===null||Ai(a,a.return)),t.flags&32){c=t.stateNode;try{gr(c,"")}catch(at){ke(t,t.return,at)}}s&4&&t.stateNode!=null&&(c=t.memoizedProps,zu(t,c,a!==null?a.memoizedProps:c)),s&1024&&(Fu=!0);break;case 6:if(Yn(n,t),jn(t),s&4){if(t.stateNode===null)throw Error(r(162));s=t.memoizedProps,a=t.stateNode;try{a.nodeValue=s}catch(at){ke(t,t.return,at)}}break;case 3:if(Dl=null,c=gi,gi=wl(n.containerInfo),Yn(n,t),gi=c,jn(t),s&4&&a!==null&&a.memoizedState.isDehydrated)try{mo(n.containerInfo)}catch(at){ke(t,t.return,at)}Fu&&(Fu=!1,Kp(t));break;case 4:s=gi,gi=wl(t.stateNode.containerInfo),Yn(n,t),jn(t),gi=s;break;case 12:Yn(n,t),jn(t);break;case 13:Yn(n,t),jn(t),t.child.flags&8192&&t.memoizedState!==null!=(a!==null&&a.memoizedState!==null)&&(qu=Se()),s&4&&(s=t.updateQueue,s!==null&&(t.updateQueue=null,Hu(t,s)));break;case 22:c=t.memoizedState!==null;var z=a!==null&&a.memoizedState!==null,Q=Gi,ft=nn;if(Gi=Q||c,nn=ft||z,Yn(n,t),nn=ft,Gi=Q,jn(t),s&8192)t:for(n=t.stateNode,n._visibility=c?n._visibility&-2:n._visibility|1,c&&(a===null||z||Gi||nn||Ja(t)),a=null,n=t;;){if(n.tag===5||n.tag===26){if(a===null){z=a=n;try{if(f=z.stateNode,c)M=f.style,typeof M.setProperty=="function"?M.setProperty("display","none","important"):M.display="none";else{E=z.stateNode;var mt=z.memoizedProps.style,et=mt!=null&&mt.hasOwnProperty("display")?mt.display:null;E.style.display=et==null||typeof et=="boolean"?"":(""+et).trim()}}catch(at){ke(z,z.return,at)}}}else if(n.tag===6){if(a===null){z=n;try{z.stateNode.nodeValue=c?"":z.memoizedProps}catch(at){ke(z,z.return,at)}}}else if((n.tag!==22&&n.tag!==23||n.memoizedState===null||n===t)&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break t;for(;n.sibling===null;){if(n.return===null||n.return===t)break t;a===n&&(a=null),n=n.return}a===n&&(a=null),n.sibling.return=n.return,n=n.sibling}s&4&&(s=t.updateQueue,s!==null&&(a=s.retryQueue,a!==null&&(s.retryQueue=null,Hu(t,a))));break;case 19:Yn(n,t),jn(t),s&4&&(s=t.updateQueue,s!==null&&(t.updateQueue=null,Hu(t,s)));break;case 30:break;case 21:break;default:Yn(n,t),jn(t)}}function jn(t){var n=t.flags;if(n&2){try{for(var a,s=t.return;s!==null;){if(Vp(s)){a=s;break}s=s.return}if(a==null)throw Error(r(160));switch(a.tag){case 27:var c=a.stateNode,f=Bu(t);ml(t,f,c);break;case 5:var M=a.stateNode;a.flags&32&&(gr(M,""),a.flags&=-33);var E=Bu(t);ml(t,E,M);break;case 3:case 4:var z=a.stateNode.containerInfo,Q=Bu(t);Iu(t,Q,z);break;default:throw Error(r(161))}}catch(ft){ke(t,t.return,ft)}t.flags&=-3}n&4096&&(t.flags&=-4097)}function Kp(t){if(t.subtreeFlags&1024)for(t=t.child;t!==null;){var n=t;Kp(n),n.tag===5&&n.flags&1024&&n.stateNode.reset(),t=t.sibling}}function fa(t,n){if(n.subtreeFlags&8772)for(n=n.child;n!==null;)Wp(t,n.alternate,n),n=n.sibling}function Ja(t){for(t=t.child;t!==null;){var n=t;switch(n.tag){case 0:case 11:case 14:case 15:ua(4,n,n.return),Ja(n);break;case 1:Ai(n,n.return);var a=n.stateNode;typeof a.componentWillUnmount=="function"&&Hp(n,n.return,a),Ja(n);break;case 27:so(n.stateNode);case 26:case 5:Ai(n,n.return),Ja(n);break;case 22:n.memoizedState===null&&Ja(n);break;case 30:Ja(n);break;default:Ja(n)}t=t.sibling}}function ha(t,n,a){for(a=a&&(n.subtreeFlags&8772)!==0,n=n.child;n!==null;){var s=n.alternate,c=t,f=n,M=f.flags;switch(f.tag){case 0:case 11:case 15:ha(c,f,a),Ks(4,f);break;case 1:if(ha(c,f,a),s=f,c=s.stateNode,typeof c.componentDidMount=="function")try{c.componentDidMount()}catch(Q){ke(s,s.return,Q)}if(s=f,c=s.updateQueue,c!==null){var E=s.stateNode;try{var z=c.shared.hiddenCallbacks;if(z!==null)for(c.shared.hiddenCallbacks=null,c=0;c<z.length;c++)bd(z[c],E)}catch(Q){ke(s,s.return,Q)}}a&&M&64&&Fp(f),Qs(f,f.return);break;case 27:kp(f);case 26:case 5:ha(c,f,a),a&&s===null&&M&4&&Gp(f),Qs(f,f.return);break;case 12:ha(c,f,a);break;case 13:ha(c,f,a),a&&M&4&&jp(c,f);break;case 22:f.memoizedState===null&&ha(c,f,a),Qs(f,f.return);break;case 30:break;default:ha(c,f,a)}n=n.sibling}}function Gu(t,n){var a=null;t!==null&&t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(a=t.memoizedState.cachePool.pool),t=null,n.memoizedState!==null&&n.memoizedState.cachePool!==null&&(t=n.memoizedState.cachePool.pool),t!==a&&(t!=null&&t.refCount++,a!=null&&zs(a))}function Vu(t,n){t=null,n.alternate!==null&&(t=n.alternate.memoizedState.cache),n=n.memoizedState.cache,n!==t&&(n.refCount++,t!=null&&zs(t))}function Ri(t,n,a,s){if(n.subtreeFlags&10256)for(n=n.child;n!==null;)Qp(t,n,a,s),n=n.sibling}function Qp(t,n,a,s){var c=n.flags;switch(n.tag){case 0:case 11:case 15:Ri(t,n,a,s),c&2048&&Ks(9,n);break;case 1:Ri(t,n,a,s);break;case 3:Ri(t,n,a,s),c&2048&&(t=null,n.alternate!==null&&(t=n.alternate.memoizedState.cache),n=n.memoizedState.cache,n!==t&&(n.refCount++,t!=null&&zs(t)));break;case 12:if(c&2048){Ri(t,n,a,s),t=n.stateNode;try{var f=n.memoizedProps,M=f.id,E=f.onPostCommit;typeof E=="function"&&E(M,n.alternate===null?"mount":"update",t.passiveEffectDuration,-0)}catch(z){ke(n,n.return,z)}}else Ri(t,n,a,s);break;case 13:Ri(t,n,a,s);break;case 23:break;case 22:f=n.stateNode,M=n.alternate,n.memoizedState!==null?f._visibility&2?Ri(t,n,a,s):Js(t,n):f._visibility&2?Ri(t,n,a,s):(f._visibility|=2,Pr(t,n,a,s,(n.subtreeFlags&10256)!==0)),c&2048&&Gu(M,n);break;case 24:Ri(t,n,a,s),c&2048&&Vu(n.alternate,n);break;default:Ri(t,n,a,s)}}function Pr(t,n,a,s,c){for(c=c&&(n.subtreeFlags&10256)!==0,n=n.child;n!==null;){var f=t,M=n,E=a,z=s,Q=M.flags;switch(M.tag){case 0:case 11:case 15:Pr(f,M,E,z,c),Ks(8,M);break;case 23:break;case 22:var ft=M.stateNode;M.memoizedState!==null?ft._visibility&2?Pr(f,M,E,z,c):Js(f,M):(ft._visibility|=2,Pr(f,M,E,z,c)),c&&Q&2048&&Gu(M.alternate,M);break;case 24:Pr(f,M,E,z,c),c&&Q&2048&&Vu(M.alternate,M);break;default:Pr(f,M,E,z,c)}n=n.sibling}}function Js(t,n){if(n.subtreeFlags&10256)for(n=n.child;n!==null;){var a=t,s=n,c=s.flags;switch(s.tag){case 22:Js(a,s),c&2048&&Gu(s.alternate,s);break;case 24:Js(a,s),c&2048&&Vu(s.alternate,s);break;default:Js(a,s)}n=n.sibling}}var $s=8192;function zr(t){if(t.subtreeFlags&$s)for(t=t.child;t!==null;)Jp(t),t=t.sibling}function Jp(t){switch(t.tag){case 26:zr(t),t.flags&$s&&t.memoizedState!==null&&cS(gi,t.memoizedState,t.memoizedProps);break;case 5:zr(t);break;case 3:case 4:var n=gi;gi=wl(t.stateNode.containerInfo),zr(t),gi=n;break;case 22:t.memoizedState===null&&(n=t.alternate,n!==null&&n.memoizedState!==null?(n=$s,$s=16777216,zr(t),$s=n):zr(t));break;default:zr(t)}}function $p(t){var n=t.alternate;if(n!==null&&(t=n.child,t!==null)){n.child=null;do n=t.sibling,t.sibling=null,t=n;while(t!==null)}}function to(t){var n=t.deletions;if((t.flags&16)!==0){if(n!==null)for(var a=0;a<n.length;a++){var s=n[a];pn=s,em(s,t)}$p(t)}if(t.subtreeFlags&10256)for(t=t.child;t!==null;)tm(t),t=t.sibling}function tm(t){switch(t.tag){case 0:case 11:case 15:to(t),t.flags&2048&&ua(9,t,t.return);break;case 3:to(t);break;case 12:to(t);break;case 22:var n=t.stateNode;t.memoizedState!==null&&n._visibility&2&&(t.return===null||t.return.tag!==13)?(n._visibility&=-3,gl(t)):to(t);break;default:to(t)}}function gl(t){var n=t.deletions;if((t.flags&16)!==0){if(n!==null)for(var a=0;a<n.length;a++){var s=n[a];pn=s,em(s,t)}$p(t)}for(t=t.child;t!==null;){switch(n=t,n.tag){case 0:case 11:case 15:ua(8,n,n.return),gl(n);break;case 22:a=n.stateNode,a._visibility&2&&(a._visibility&=-3,gl(n));break;default:gl(n)}t=t.sibling}}function em(t,n){for(;pn!==null;){var a=pn;switch(a.tag){case 0:case 11:case 15:ua(8,a,n);break;case 23:case 22:if(a.memoizedState!==null&&a.memoizedState.cachePool!==null){var s=a.memoizedState.cachePool.pool;s!=null&&s.refCount++}break;case 24:zs(a.memoizedState.cache)}if(s=a.child,s!==null)s.return=a,pn=s;else t:for(a=t;pn!==null;){s=pn;var c=s.sibling,f=s.return;if(qp(s),s===a){pn=null;break t}if(c!==null){c.return=f,pn=c;break t}pn=f}}}var b0={getCacheForType:function(t){var n=Cn(cn),a=n.data.get(t);return a===void 0&&(a=t(),n.data.set(t,a)),a}},A0=typeof WeakMap=="function"?WeakMap:Map,Oe=0,We=null,be=null,Re=0,Pe=0,Zn=null,da=!1,Br=!1,ku=!1,ki=0,$e=0,pa=0,$a=0,Xu=0,oi=0,Ir=0,eo=null,Hn=null,Wu=!1,qu=0,_l=1/0,vl=null,ma=null,yn=0,ga=null,Fr=null,Hr=0,Yu=0,ju=null,nm=null,no=0,Zu=null;function Kn(){if((Oe&2)!==0&&Re!==0)return Re&-Re;if(N.T!==null){var t=Rr;return t!==0?t:nf()}return Rt()}function im(){oi===0&&(oi=(Re&536870912)===0||Ne?fe():536870912);var t=si.current;return t!==null&&(t.flags|=32),oi}function Qn(t,n,a){(t===We&&(Pe===2||Pe===9)||t.cancelPendingCommit!==null)&&(Gr(t,0),_a(t,Re,oi,!1)),bt(t,a),((Oe&2)===0||t!==We)&&(t===We&&((Oe&2)===0&&($a|=a),$e===4&&_a(t,Re,oi,!1)),wi(t))}function am(t,n,a){if((Oe&6)!==0)throw Error(r(327));var s=!a&&(n&124)===0&&(n&t.expiredLanes)===0||Te(t,n),c=s?C0(t,n):Ju(t,n,!0),f=s;do{if(c===0){Br&&!s&&_a(t,n,0,!1);break}else{if(a=t.current.alternate,f&&!R0(a)){c=Ju(t,n,!1),f=!1;continue}if(c===2){if(f=n,t.errorRecoveryDisabledLanes&f)var M=0;else M=t.pendingLanes&-536870913,M=M!==0?M:M&536870912?536870912:0;if(M!==0){n=M;t:{var E=t;c=eo;var z=E.current.memoizedState.isDehydrated;if(z&&(Gr(E,M).flags|=256),M=Ju(E,M,!1),M!==2){if(ku&&!z){E.errorRecoveryDisabledLanes|=f,$a|=f,c=4;break t}f=Hn,Hn=c,f!==null&&(Hn===null?Hn=f:Hn.push.apply(Hn,f))}c=M}if(f=!1,c!==2)continue}}if(c===1){Gr(t,0),_a(t,n,0,!0);break}t:{switch(s=t,f=c,f){case 0:case 1:throw Error(r(345));case 4:if((n&4194048)!==n)break;case 6:_a(s,n,oi,!da);break t;case 2:Hn=null;break;case 3:case 5:break;default:throw Error(r(329))}if((n&62914560)===n&&(c=qu+300-Se(),10<c)){if(_a(s,n,oi,!da),ae(s,0,!0)!==0)break t;s.timeoutHandle=Nm(rm.bind(null,s,a,Hn,vl,Wu,n,oi,$a,Ir,da,f,2,-0,0),c);break t}rm(s,a,Hn,vl,Wu,n,oi,$a,Ir,da,f,0,-0,0)}}break}while(!0);wi(t)}function rm(t,n,a,s,c,f,M,E,z,Q,ft,mt,et,at){if(t.timeoutHandle=-1,mt=n.subtreeFlags,(mt&8192||(mt&16785408)===16785408)&&(co={stylesheets:null,count:0,unsuspend:lS},Jp(n),mt=uS(),mt!==null)){t.cancelPendingCommit=mt(hm.bind(null,t,n,f,a,s,c,M,E,z,ft,1,et,at)),_a(t,f,M,!Q);return}hm(t,n,f,a,s,c,M,E,z)}function R0(t){for(var n=t;;){var a=n.tag;if((a===0||a===11||a===15)&&n.flags&16384&&(a=n.updateQueue,a!==null&&(a=a.stores,a!==null)))for(var s=0;s<a.length;s++){var c=a[s],f=c.getSnapshot;c=c.value;try{if(!Wn(f(),c))return!1}catch{return!1}}if(a=n.child,n.subtreeFlags&16384&&a!==null)a.return=n,n=a;else{if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return!0;n=n.return}n.sibling.return=n.return,n=n.sibling}}return!0}function _a(t,n,a,s){n&=~Xu,n&=~$a,t.suspendedLanes|=n,t.pingedLanes&=~n,s&&(t.warmLanes|=n),s=t.expirationTimes;for(var c=n;0<c;){var f=31-Vt(c),M=1<<f;s[f]=-1,c&=~M}a!==0&&Jt(t,a,n)}function Sl(){return(Oe&6)===0?(io(0),!1):!0}function Ku(){if(be!==null){if(Pe===0)var t=be.return;else t=be,Pi=Ya=null,du(t),Nr=null,Ys=0,t=be;for(;t!==null;)Ip(t.alternate,t),t=t.return;be=null}}function Gr(t,n){var a=t.timeoutHandle;a!==-1&&(t.timeoutHandle=-1,W0(a)),a=t.cancelPendingCommit,a!==null&&(t.cancelPendingCommit=null,a()),Ku(),We=t,be=a=Ui(t.current,null),Re=n,Pe=0,Zn=null,da=!1,Br=Te(t,n),ku=!1,Ir=oi=Xu=$a=pa=$e=0,Hn=eo=null,Wu=!1,(n&8)!==0&&(n|=n&32);var s=t.entangledLanes;if(s!==0)for(t=t.entanglements,s&=n;0<s;){var c=31-Vt(s),f=1<<c;n|=t[c],s&=~f}return ki=n,Go(),a}function sm(t,n){xe=null,N.H=sl,n===Is||n===Ko?(n=Ed(),Pe=3):n===xd?(n=Ed(),Pe=4):Pe=n===Tp?8:n!==null&&typeof n=="object"&&typeof n.then=="function"?6:1,Zn=n,be===null&&($e=1,fl(t,ni(n,t.current)))}function om(){var t=N.H;return N.H=sl,t===null?sl:t}function lm(){var t=N.A;return N.A=b0,t}function Qu(){$e=4,da||(Re&4194048)!==Re&&si.current!==null||(Br=!0),(pa&134217727)===0&&($a&134217727)===0||We===null||_a(We,Re,oi,!1)}function Ju(t,n,a){var s=Oe;Oe|=2;var c=om(),f=lm();(We!==t||Re!==n)&&(vl=null,Gr(t,n)),n=!1;var M=$e;t:do try{if(Pe!==0&&be!==null){var E=be,z=Zn;switch(Pe){case 8:Ku(),M=6;break t;case 3:case 2:case 9:case 6:si.current===null&&(n=!0);var Q=Pe;if(Pe=0,Zn=null,Vr(t,E,z,Q),a&&Br){M=0;break t}break;default:Q=Pe,Pe=0,Zn=null,Vr(t,E,z,Q)}}w0(),M=$e;break}catch(ft){sm(t,ft)}while(!0);return n&&t.shellSuspendCounter++,Pi=Ya=null,Oe=s,N.H=c,N.A=f,be===null&&(We=null,Re=0,Go()),M}function w0(){for(;be!==null;)cm(be)}function C0(t,n){var a=Oe;Oe|=2;var s=om(),c=lm();We!==t||Re!==n?(vl=null,_l=Se()+500,Gr(t,n)):Br=Te(t,n);t:do try{if(Pe!==0&&be!==null){n=be;var f=Zn;e:switch(Pe){case 1:Pe=0,Zn=null,Vr(t,n,f,1);break;case 2:case 9:if(Md(f)){Pe=0,Zn=null,um(n);break}n=function(){Pe!==2&&Pe!==9||We!==t||(Pe=7),wi(t)},f.then(n,n);break t;case 3:Pe=7;break t;case 4:Pe=5;break t;case 7:Md(f)?(Pe=0,Zn=null,um(n)):(Pe=0,Zn=null,Vr(t,n,f,7));break;case 5:var M=null;switch(be.tag){case 26:M=be.memoizedState;case 5:case 27:var E=be;if(!M||Wm(M)){Pe=0,Zn=null;var z=E.sibling;if(z!==null)be=z;else{var Q=E.return;Q!==null?(be=Q,xl(Q)):be=null}break e}}Pe=0,Zn=null,Vr(t,n,f,5);break;case 6:Pe=0,Zn=null,Vr(t,n,f,6);break;case 8:Ku(),$e=6;break t;default:throw Error(r(462))}}D0();break}catch(ft){sm(t,ft)}while(!0);return Pi=Ya=null,N.H=s,N.A=c,Oe=a,be!==null?0:(We=null,Re=0,Go(),$e)}function D0(){for(;be!==null&&!Qt();)cm(be)}function cm(t){var n=zp(t.alternate,t,ki);t.memoizedProps=t.pendingProps,n===null?xl(t):be=n}function um(t){var n=t,a=n.alternate;switch(n.tag){case 15:case 0:n=Dp(a,n,n.pendingProps,n.type,void 0,Re);break;case 11:n=Dp(a,n,n.pendingProps,n.type.render,n.ref,Re);break;case 5:du(n);default:Ip(a,n),n=be=fd(n,ki),n=zp(a,n,ki)}t.memoizedProps=t.pendingProps,n===null?xl(t):be=n}function Vr(t,n,a,s){Pi=Ya=null,du(n),Nr=null,Ys=0;var c=n.return;try{if(S0(t,c,n,a,Re)){$e=1,fl(t,ni(a,t.current)),be=null;return}}catch(f){if(c!==null)throw be=c,f;$e=1,fl(t,ni(a,t.current)),be=null;return}n.flags&32768?(Ne||s===1?t=!0:Br||(Re&536870912)!==0?t=!1:(da=t=!0,(s===2||s===9||s===3||s===6)&&(s=si.current,s!==null&&s.tag===13&&(s.flags|=16384))),fm(n,t)):xl(n)}function xl(t){var n=t;do{if((n.flags&32768)!==0){fm(n,da);return}t=n.return;var a=M0(n.alternate,n,ki);if(a!==null){be=a;return}if(n=n.sibling,n!==null){be=n;return}be=n=t}while(n!==null);$e===0&&($e=5)}function fm(t,n){do{var a=y0(t.alternate,t);if(a!==null){a.flags&=32767,be=a;return}if(a=t.return,a!==null&&(a.flags|=32768,a.subtreeFlags=0,a.deletions=null),!n&&(t=t.sibling,t!==null)){be=t;return}be=t=a}while(t!==null);$e=6,be=null}function hm(t,n,a,s,c,f,M,E,z){t.cancelPendingCommit=null;do Ml();while(yn!==0);if((Oe&6)!==0)throw Error(r(327));if(n!==null){if(n===t.current)throw Error(r(177));if(f=n.lanes|n.childLanes,f|=Vc,Ct(t,a,f,M,E,z),t===We&&(be=We=null,Re=0),Fr=n,ga=t,Hr=a,Yu=f,ju=c,nm=s,(n.subtreeFlags&10256)!==0||(n.flags&10256)!==0?(t.callbackNode=null,t.callbackPriority=0,O0(tt,function(){return _m(),null})):(t.callbackNode=null,t.callbackPriority=0),s=(n.flags&13878)!==0,(n.subtreeFlags&13878)!==0||s){s=N.T,N.T=null,c=q.p,q.p=2,M=Oe,Oe|=4;try{E0(t,n,a)}finally{Oe=M,q.p=c,N.T=s}}yn=1,dm(),pm(),mm()}}function dm(){if(yn===1){yn=0;var t=ga,n=Fr,a=(n.flags&13878)!==0;if((n.subtreeFlags&13878)!==0||a){a=N.T,N.T=null;var s=q.p;q.p=2;var c=Oe;Oe|=4;try{Zp(n,t);var f=ff,M=ed(t.containerInfo),E=f.focusedElem,z=f.selectionRange;if(M!==E&&E&&E.ownerDocument&&td(E.ownerDocument.documentElement,E)){if(z!==null&&Bc(E)){var Q=z.start,ft=z.end;if(ft===void 0&&(ft=Q),"selectionStart"in E)E.selectionStart=Q,E.selectionEnd=Math.min(ft,E.value.length);else{var mt=E.ownerDocument||document,et=mt&&mt.defaultView||window;if(et.getSelection){var at=et.getSelection(),se=E.textContent.length,ee=Math.min(z.start,se),Ie=z.end===void 0?ee:Math.min(z.end,se);!at.extend&&ee>Ie&&(M=Ie,Ie=ee,ee=M);var Y=$h(E,ee),G=$h(E,Ie);if(Y&&G&&(at.rangeCount!==1||at.anchorNode!==Y.node||at.anchorOffset!==Y.offset||at.focusNode!==G.node||at.focusOffset!==G.offset)){var Z=mt.createRange();Z.setStart(Y.node,Y.offset),at.removeAllRanges(),ee>Ie?(at.addRange(Z),at.extend(G.node,G.offset)):(Z.setEnd(G.node,G.offset),at.addRange(Z))}}}}for(mt=[],at=E;at=at.parentNode;)at.nodeType===1&&mt.push({element:at,left:at.scrollLeft,top:at.scrollTop});for(typeof E.focus=="function"&&E.focus(),E=0;E<mt.length;E++){var dt=mt[E];dt.element.scrollLeft=dt.left,dt.element.scrollTop=dt.top}}Nl=!!uf,ff=uf=null}finally{Oe=c,q.p=s,N.T=a}}t.current=n,yn=2}}function pm(){if(yn===2){yn=0;var t=ga,n=Fr,a=(n.flags&8772)!==0;if((n.subtreeFlags&8772)!==0||a){a=N.T,N.T=null;var s=q.p;q.p=2;var c=Oe;Oe|=4;try{Wp(t,n.alternate,n)}finally{Oe=c,q.p=s,N.T=a}}yn=3}}function mm(){if(yn===4||yn===3){yn=0,Ht();var t=ga,n=Fr,a=Hr,s=nm;(n.subtreeFlags&10256)!==0||(n.flags&10256)!==0?yn=5:(yn=0,Fr=ga=null,gm(t,t.pendingLanes));var c=t.pendingLanes;if(c===0&&(ma=null),ht(a),n=n.stateNode,Dt&&typeof Dt.onCommitFiberRoot=="function")try{Dt.onCommitFiberRoot(At,n,void 0,(n.current.flags&128)===128)}catch{}if(s!==null){n=N.T,c=q.p,q.p=2,N.T=null;try{for(var f=t.onRecoverableError,M=0;M<s.length;M++){var E=s[M];f(E.value,{componentStack:E.stack})}}finally{N.T=n,q.p=c}}(Hr&3)!==0&&Ml(),wi(t),c=t.pendingLanes,(a&4194090)!==0&&(c&42)!==0?t===Zu?no++:(no=0,Zu=t):no=0,io(0)}}function gm(t,n){(t.pooledCacheLanes&=n)===0&&(n=t.pooledCache,n!=null&&(t.pooledCache=null,zs(n)))}function Ml(t){return dm(),pm(),mm(),_m()}function _m(){if(yn!==5)return!1;var t=ga,n=Yu;Yu=0;var a=ht(Hr),s=N.T,c=q.p;try{q.p=32>a?32:a,N.T=null,a=ju,ju=null;var f=ga,M=Hr;if(yn=0,Fr=ga=null,Hr=0,(Oe&6)!==0)throw Error(r(331));var E=Oe;if(Oe|=4,tm(f.current),Qp(f,f.current,M,a),Oe=E,io(0,!1),Dt&&typeof Dt.onPostCommitFiberRoot=="function")try{Dt.onPostCommitFiberRoot(At,f)}catch{}return!0}finally{q.p=c,N.T=s,gm(t,n)}}function vm(t,n,a){n=ni(a,n),n=Ru(t.stateNode,n,2),t=sa(t,n,2),t!==null&&(bt(t,2),wi(t))}function ke(t,n,a){if(t.tag===3)vm(t,t,a);else for(;n!==null;){if(n.tag===3){vm(n,t,a);break}else if(n.tag===1){var s=n.stateNode;if(typeof n.type.getDerivedStateFromError=="function"||typeof s.componentDidCatch=="function"&&(ma===null||!ma.has(s))){t=ni(a,t),a=yp(2),s=sa(n,a,2),s!==null&&(Ep(a,s,n,t),bt(s,2),wi(s));break}}n=n.return}}function $u(t,n,a){var s=t.pingCache;if(s===null){s=t.pingCache=new A0;var c=new Set;s.set(n,c)}else c=s.get(n),c===void 0&&(c=new Set,s.set(n,c));c.has(a)||(ku=!0,c.add(a),t=L0.bind(null,t,n,a),n.then(t,t))}function L0(t,n,a){var s=t.pingCache;s!==null&&s.delete(n),t.pingedLanes|=t.suspendedLanes&a,t.warmLanes&=~a,We===t&&(Re&a)===a&&($e===4||$e===3&&(Re&62914560)===Re&&300>Se()-qu?(Oe&2)===0&&Gr(t,0):Xu|=a,Ir===Re&&(Ir=0)),wi(t)}function Sm(t,n){n===0&&(n=Tt()),t=Er(t,n),t!==null&&(bt(t,n),wi(t))}function U0(t){var n=t.memoizedState,a=0;n!==null&&(a=n.retryLane),Sm(t,a)}function N0(t,n){var a=0;switch(t.tag){case 13:var s=t.stateNode,c=t.memoizedState;c!==null&&(a=c.retryLane);break;case 19:s=t.stateNode;break;case 22:s=t.stateNode._retryCache;break;default:throw Error(r(314))}s!==null&&s.delete(n),Sm(t,a)}function O0(t,n){return Ze(t,n)}var yl=null,kr=null,tf=!1,El=!1,ef=!1,tr=0;function wi(t){t!==kr&&t.next===null&&(kr===null?yl=kr=t:kr=kr.next=t),El=!0,tf||(tf=!0,z0())}function io(t,n){if(!ef&&El){ef=!0;do for(var a=!1,s=yl;s!==null;){if(t!==0){var c=s.pendingLanes;if(c===0)var f=0;else{var M=s.suspendedLanes,E=s.pingedLanes;f=(1<<31-Vt(42|t)+1)-1,f&=c&~(M&~E),f=f&201326741?f&201326741|1:f?f|2:0}f!==0&&(a=!0,Em(s,f))}else f=Re,f=ae(s,s===We?f:0,s.cancelPendingCommit!==null||s.timeoutHandle!==-1),(f&3)===0||Te(s,f)||(a=!0,Em(s,f));s=s.next}while(a);ef=!1}}function P0(){xm()}function xm(){El=tf=!1;var t=0;tr!==0&&(X0()&&(t=tr),tr=0);for(var n=Se(),a=null,s=yl;s!==null;){var c=s.next,f=Mm(s,n);f===0?(s.next=null,a===null?yl=c:a.next=c,c===null&&(kr=a)):(a=s,(t!==0||(f&3)!==0)&&(El=!0)),s=c}io(t)}function Mm(t,n){for(var a=t.suspendedLanes,s=t.pingedLanes,c=t.expirationTimes,f=t.pendingLanes&-62914561;0<f;){var M=31-Vt(f),E=1<<M,z=c[M];z===-1?((E&a)===0||(E&s)!==0)&&(c[M]=Ge(E,n)):z<=n&&(t.expiredLanes|=E),f&=~E}if(n=We,a=Re,a=ae(t,t===n?a:0,t.cancelPendingCommit!==null||t.timeoutHandle!==-1),s=t.callbackNode,a===0||t===n&&(Pe===2||Pe===9)||t.cancelPendingCommit!==null)return s!==null&&s!==null&&Wt(s),t.callbackNode=null,t.callbackPriority=0;if((a&3)===0||Te(t,a)){if(n=a&-a,n===t.callbackPriority)return n;switch(s!==null&&Wt(s),ht(a)){case 2:case 8:a=T;break;case 32:a=tt;break;case 268435456:a=xt;break;default:a=tt}return s=ym.bind(null,t),a=Ze(a,s),t.callbackPriority=n,t.callbackNode=a,n}return s!==null&&s!==null&&Wt(s),t.callbackPriority=2,t.callbackNode=null,2}function ym(t,n){if(yn!==0&&yn!==5)return t.callbackNode=null,t.callbackPriority=0,null;var a=t.callbackNode;if(Ml()&&t.callbackNode!==a)return null;var s=Re;return s=ae(t,t===We?s:0,t.cancelPendingCommit!==null||t.timeoutHandle!==-1),s===0?null:(am(t,s,n),Mm(t,Se()),t.callbackNode!=null&&t.callbackNode===a?ym.bind(null,t):null)}function Em(t,n){if(Ml())return null;am(t,n,!0)}function z0(){q0(function(){(Oe&6)!==0?Ze(D,P0):xm()})}function nf(){return tr===0&&(tr=fe()),tr}function Tm(t){return t==null||typeof t=="symbol"||typeof t=="boolean"?null:typeof t=="function"?t:Oo(""+t)}function bm(t,n){var a=n.ownerDocument.createElement("input");return a.name=n.name,a.value=n.value,t.id&&a.setAttribute("form",t.id),n.parentNode.insertBefore(a,n),t=new FormData(t),a.parentNode.removeChild(a),t}function B0(t,n,a,s,c){if(n==="submit"&&a&&a.stateNode===c){var f=Tm((c[$t]||null).action),M=s.submitter;M&&(n=(n=M[$t]||null)?Tm(n.formAction):M.getAttribute("formAction"),n!==null&&(f=n,M=null));var E=new Io("action","action",null,s,c);t.push({event:E,listeners:[{instance:null,listener:function(){if(s.defaultPrevented){if(tr!==0){var z=M?bm(c,M):new FormData(c);yu(a,{pending:!0,data:z,method:c.method,action:f},null,z)}}else typeof f=="function"&&(E.preventDefault(),z=M?bm(c,M):new FormData(c),yu(a,{pending:!0,data:z,method:c.method,action:f},f,z))},currentTarget:c}]})}}for(var af=0;af<Gc.length;af++){var rf=Gc[af],I0=rf.toLowerCase(),F0=rf[0].toUpperCase()+rf.slice(1);mi(I0,"on"+F0)}mi(ad,"onAnimationEnd"),mi(rd,"onAnimationIteration"),mi(sd,"onAnimationStart"),mi("dblclick","onDoubleClick"),mi("focusin","onFocus"),mi("focusout","onBlur"),mi(n0,"onTransitionRun"),mi(i0,"onTransitionStart"),mi(a0,"onTransitionCancel"),mi(od,"onTransitionEnd"),Nt("onMouseEnter",["mouseout","mouseover"]),Nt("onMouseLeave",["mouseout","mouseover"]),Nt("onPointerEnter",["pointerout","pointerover"]),Nt("onPointerLeave",["pointerout","pointerover"]),it("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),it("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),it("onBeforeInput",["compositionend","keypress","textInput","paste"]),it("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),it("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),it("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var ao="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),H0=new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(ao));function Am(t,n){n=(n&4)!==0;for(var a=0;a<t.length;a++){var s=t[a],c=s.event;s=s.listeners;t:{var f=void 0;if(n)for(var M=s.length-1;0<=M;M--){var E=s[M],z=E.instance,Q=E.currentTarget;if(E=E.listener,z!==f&&c.isPropagationStopped())break t;f=E,c.currentTarget=Q;try{f(c)}catch(ft){ul(ft)}c.currentTarget=null,f=z}else for(M=0;M<s.length;M++){if(E=s[M],z=E.instance,Q=E.currentTarget,E=E.listener,z!==f&&c.isPropagationStopped())break t;f=E,c.currentTarget=Q;try{f(c)}catch(ft){ul(ft)}c.currentTarget=null,f=z}}}}function Ae(t,n){var a=n[Ce];a===void 0&&(a=n[Ce]=new Set);var s=t+"__bubble";a.has(s)||(Rm(n,t,2,!1),a.add(s))}function sf(t,n,a){var s=0;n&&(s|=4),Rm(a,t,s,n)}var Tl="_reactListening"+Math.random().toString(36).slice(2);function of(t){if(!t[Tl]){t[Tl]=!0,rt.forEach(function(a){a!=="selectionchange"&&(H0.has(a)||sf(a,!1,t),sf(a,!0,t))});var n=t.nodeType===9?t:t.ownerDocument;n===null||n[Tl]||(n[Tl]=!0,sf("selectionchange",!1,n))}}function Rm(t,n,a,s){switch(Qm(n)){case 2:var c=dS;break;case 8:c=pS;break;default:c=Mf}a=c.bind(null,n,a,t),c=void 0,!wc||n!=="touchstart"&&n!=="touchmove"&&n!=="wheel"||(c=!0),s?c!==void 0?t.addEventListener(n,a,{capture:!0,passive:c}):t.addEventListener(n,a,!0):c!==void 0?t.addEventListener(n,a,{passive:c}):t.addEventListener(n,a,!1)}function lf(t,n,a,s,c){var f=s;if((n&1)===0&&(n&2)===0&&s!==null)t:for(;;){if(s===null)return;var M=s.tag;if(M===3||M===4){var E=s.stateNode.containerInfo;if(E===c)break;if(M===4)for(M=s.return;M!==null;){var z=M.tag;if((z===3||z===4)&&M.stateNode.containerInfo===c)return;M=M.return}for(;E!==null;){if(M=Sn(E),M===null)return;if(z=M.tag,z===5||z===6||z===26||z===27){s=f=M;continue t}E=E.parentNode}}s=s.return}Oh(function(){var Q=f,ft=Ac(a),mt=[];t:{var et=ld.get(t);if(et!==void 0){var at=Io,se=t;switch(t){case"keypress":if(zo(a)===0)break t;case"keydown":case"keyup":at=Ov;break;case"focusin":se="focus",at=Uc;break;case"focusout":se="blur",at=Uc;break;case"beforeblur":case"afterblur":at=Uc;break;case"click":if(a.button===2)break t;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":at=Bh;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":at=yv;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":at=Bv;break;case ad:case rd:case sd:at=bv;break;case od:at=Fv;break;case"scroll":case"scrollend":at=xv;break;case"wheel":at=Gv;break;case"copy":case"cut":case"paste":at=Rv;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":at=Fh;break;case"toggle":case"beforetoggle":at=kv}var ee=(n&4)!==0,Ie=!ee&&(t==="scroll"||t==="scrollend"),Y=ee?et!==null?et+"Capture":null:et;ee=[];for(var G=Q,Z;G!==null;){var dt=G;if(Z=dt.stateNode,dt=dt.tag,dt!==5&&dt!==26&&dt!==27||Z===null||Y===null||(dt=Es(G,Y),dt!=null&&ee.push(ro(G,dt,Z))),Ie)break;G=G.return}0<ee.length&&(et=new at(et,se,null,a,ft),mt.push({event:et,listeners:ee}))}}if((n&7)===0){t:{if(et=t==="mouseover"||t==="pointerover",at=t==="mouseout"||t==="pointerout",et&&a!==bc&&(se=a.relatedTarget||a.fromElement)&&(Sn(se)||se[he]))break t;if((at||et)&&(et=ft.window===ft?ft:(et=ft.ownerDocument)?et.defaultView||et.parentWindow:window,at?(se=a.relatedTarget||a.toElement,at=Q,se=se?Sn(se):null,se!==null&&(Ie=u(se),ee=se.tag,se!==Ie||ee!==5&&ee!==27&&ee!==6)&&(se=null)):(at=null,se=Q),at!==se)){if(ee=Bh,dt="onMouseLeave",Y="onMouseEnter",G="mouse",(t==="pointerout"||t==="pointerover")&&(ee=Fh,dt="onPointerLeave",Y="onPointerEnter",G="pointer"),Ie=at==null?et:Di(at),Z=se==null?et:Di(se),et=new ee(dt,G+"leave",at,a,ft),et.target=Ie,et.relatedTarget=Z,dt=null,Sn(ft)===Q&&(ee=new ee(Y,G+"enter",se,a,ft),ee.target=Z,ee.relatedTarget=Ie,dt=ee),Ie=dt,at&&se)e:{for(ee=at,Y=se,G=0,Z=ee;Z;Z=Xr(Z))G++;for(Z=0,dt=Y;dt;dt=Xr(dt))Z++;for(;0<G-Z;)ee=Xr(ee),G--;for(;0<Z-G;)Y=Xr(Y),Z--;for(;G--;){if(ee===Y||Y!==null&&ee===Y.alternate)break e;ee=Xr(ee),Y=Xr(Y)}ee=null}else ee=null;at!==null&&wm(mt,et,at,ee,!1),se!==null&&Ie!==null&&wm(mt,Ie,se,ee,!0)}}t:{if(et=Q?Di(Q):window,at=et.nodeName&&et.nodeName.toLowerCase(),at==="select"||at==="input"&&et.type==="file")var It=Yh;else if(Wh(et))if(jh)It=$v;else{It=Qv;var Me=Kv}else at=et.nodeName,!at||at.toLowerCase()!=="input"||et.type!=="checkbox"&&et.type!=="radio"?Q&&Tc(Q.elementType)&&(It=Yh):It=Jv;if(It&&(It=It(t,Q))){qh(mt,It,a,ft);break t}Me&&Me(t,et,Q),t==="focusout"&&Q&&et.type==="number"&&Q.memoizedProps.value!=null&&pr(et,"number",et.value)}switch(Me=Q?Di(Q):window,t){case"focusin":(Wh(Me)||Me.contentEditable==="true")&&(xr=Me,Ic=Q,Ls=null);break;case"focusout":Ls=Ic=xr=null;break;case"mousedown":Fc=!0;break;case"contextmenu":case"mouseup":case"dragend":Fc=!1,nd(mt,a,ft);break;case"selectionchange":if(e0)break;case"keydown":case"keyup":nd(mt,a,ft)}var jt;if(Oc)t:{switch(t){case"compositionstart":var ie="onCompositionStart";break t;case"compositionend":ie="onCompositionEnd";break t;case"compositionupdate":ie="onCompositionUpdate";break t}ie=void 0}else Sr?kh(t,a)&&(ie="onCompositionEnd"):t==="keydown"&&a.keyCode===229&&(ie="onCompositionStart");ie&&(Hh&&a.locale!=="ko"&&(Sr||ie!=="onCompositionStart"?ie==="onCompositionEnd"&&Sr&&(jt=Ph()):(na=ft,Cc="value"in na?na.value:na.textContent,Sr=!0)),Me=bl(Q,ie),0<Me.length&&(ie=new Ih(ie,t,null,a,ft),mt.push({event:ie,listeners:Me}),jt?ie.data=jt:(jt=Xh(a),jt!==null&&(ie.data=jt)))),(jt=Wv?qv(t,a):Yv(t,a))&&(ie=bl(Q,"onBeforeInput"),0<ie.length&&(Me=new Ih("onBeforeInput","beforeinput",null,a,ft),mt.push({event:Me,listeners:ie}),Me.data=jt)),B0(mt,t,Q,a,ft)}Am(mt,n)})}function ro(t,n,a){return{instance:t,listener:n,currentTarget:a}}function bl(t,n){for(var a=n+"Capture",s=[];t!==null;){var c=t,f=c.stateNode;if(c=c.tag,c!==5&&c!==26&&c!==27||f===null||(c=Es(t,a),c!=null&&s.unshift(ro(t,c,f)),c=Es(t,n),c!=null&&s.push(ro(t,c,f))),t.tag===3)return s;t=t.return}return[]}function Xr(t){if(t===null)return null;do t=t.return;while(t&&t.tag!==5&&t.tag!==27);return t||null}function wm(t,n,a,s,c){for(var f=n._reactName,M=[];a!==null&&a!==s;){var E=a,z=E.alternate,Q=E.stateNode;if(E=E.tag,z!==null&&z===s)break;E!==5&&E!==26&&E!==27||Q===null||(z=Q,c?(Q=Es(a,f),Q!=null&&M.unshift(ro(a,Q,z))):c||(Q=Es(a,f),Q!=null&&M.push(ro(a,Q,z)))),a=a.return}M.length!==0&&t.push({event:n,listeners:M})}var G0=/\r\n?/g,V0=/\u0000|\uFFFD/g;function Cm(t){return(typeof t=="string"?t:""+t).replace(G0,`
`).replace(V0,"")}function Dm(t,n){return n=Cm(n),Cm(t)===n}function Al(){}function Be(t,n,a,s,c,f){switch(a){case"children":typeof s=="string"?n==="body"||n==="textarea"&&s===""||gr(t,s):(typeof s=="number"||typeof s=="bigint")&&n!=="body"&&gr(t,""+s);break;case"className":ce(t,"class",s);break;case"tabIndex":ce(t,"tabindex",s);break;case"dir":case"role":case"viewBox":case"width":case"height":ce(t,a,s);break;case"style":Uh(t,s,f);break;case"data":if(n!=="object"){ce(t,"data",s);break}case"src":case"href":if(s===""&&(n!=="a"||a!=="href")){t.removeAttribute(a);break}if(s==null||typeof s=="function"||typeof s=="symbol"||typeof s=="boolean"){t.removeAttribute(a);break}s=Oo(""+s),t.setAttribute(a,s);break;case"action":case"formAction":if(typeof s=="function"){t.setAttribute(a,"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");break}else typeof f=="function"&&(a==="formAction"?(n!=="input"&&Be(t,n,"name",c.name,c,null),Be(t,n,"formEncType",c.formEncType,c,null),Be(t,n,"formMethod",c.formMethod,c,null),Be(t,n,"formTarget",c.formTarget,c,null)):(Be(t,n,"encType",c.encType,c,null),Be(t,n,"method",c.method,c,null),Be(t,n,"target",c.target,c,null)));if(s==null||typeof s=="symbol"||typeof s=="boolean"){t.removeAttribute(a);break}s=Oo(""+s),t.setAttribute(a,s);break;case"onClick":s!=null&&(t.onclick=Al);break;case"onScroll":s!=null&&Ae("scroll",t);break;case"onScrollEnd":s!=null&&Ae("scrollend",t);break;case"dangerouslySetInnerHTML":if(s!=null){if(typeof s!="object"||!("__html"in s))throw Error(r(61));if(a=s.__html,a!=null){if(c.children!=null)throw Error(r(60));t.innerHTML=a}}break;case"multiple":t.multiple=s&&typeof s!="function"&&typeof s!="symbol";break;case"muted":t.muted=s&&typeof s!="function"&&typeof s!="symbol";break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"defaultValue":case"defaultChecked":case"innerHTML":case"ref":break;case"autoFocus":break;case"xlinkHref":if(s==null||typeof s=="function"||typeof s=="boolean"||typeof s=="symbol"){t.removeAttribute("xlink:href");break}a=Oo(""+s),t.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",a);break;case"contentEditable":case"spellCheck":case"draggable":case"value":case"autoReverse":case"externalResourcesRequired":case"focusable":case"preserveAlpha":s!=null&&typeof s!="function"&&typeof s!="symbol"?t.setAttribute(a,""+s):t.removeAttribute(a);break;case"inert":case"allowFullScreen":case"async":case"autoPlay":case"controls":case"default":case"defer":case"disabled":case"disablePictureInPicture":case"disableRemotePlayback":case"formNoValidate":case"hidden":case"loop":case"noModule":case"noValidate":case"open":case"playsInline":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"itemScope":s&&typeof s!="function"&&typeof s!="symbol"?t.setAttribute(a,""):t.removeAttribute(a);break;case"capture":case"download":s===!0?t.setAttribute(a,""):s!==!1&&s!=null&&typeof s!="function"&&typeof s!="symbol"?t.setAttribute(a,s):t.removeAttribute(a);break;case"cols":case"rows":case"size":case"span":s!=null&&typeof s!="function"&&typeof s!="symbol"&&!isNaN(s)&&1<=s?t.setAttribute(a,s):t.removeAttribute(a);break;case"rowSpan":case"start":s==null||typeof s=="function"||typeof s=="symbol"||isNaN(s)?t.removeAttribute(a):t.setAttribute(a,s);break;case"popover":Ae("beforetoggle",t),Ae("toggle",t),le(t,"popover",s);break;case"xlinkActuate":Ue(t,"http://www.w3.org/1999/xlink","xlink:actuate",s);break;case"xlinkArcrole":Ue(t,"http://www.w3.org/1999/xlink","xlink:arcrole",s);break;case"xlinkRole":Ue(t,"http://www.w3.org/1999/xlink","xlink:role",s);break;case"xlinkShow":Ue(t,"http://www.w3.org/1999/xlink","xlink:show",s);break;case"xlinkTitle":Ue(t,"http://www.w3.org/1999/xlink","xlink:title",s);break;case"xlinkType":Ue(t,"http://www.w3.org/1999/xlink","xlink:type",s);break;case"xmlBase":Ue(t,"http://www.w3.org/XML/1998/namespace","xml:base",s);break;case"xmlLang":Ue(t,"http://www.w3.org/XML/1998/namespace","xml:lang",s);break;case"xmlSpace":Ue(t,"http://www.w3.org/XML/1998/namespace","xml:space",s);break;case"is":le(t,"is",s);break;case"innerText":case"textContent":break;default:(!(2<a.length)||a[0]!=="o"&&a[0]!=="O"||a[1]!=="n"&&a[1]!=="N")&&(a=vv.get(a)||a,le(t,a,s))}}function cf(t,n,a,s,c,f){switch(a){case"style":Uh(t,s,f);break;case"dangerouslySetInnerHTML":if(s!=null){if(typeof s!="object"||!("__html"in s))throw Error(r(61));if(a=s.__html,a!=null){if(c.children!=null)throw Error(r(60));t.innerHTML=a}}break;case"children":typeof s=="string"?gr(t,s):(typeof s=="number"||typeof s=="bigint")&&gr(t,""+s);break;case"onScroll":s!=null&&Ae("scroll",t);break;case"onScrollEnd":s!=null&&Ae("scrollend",t);break;case"onClick":s!=null&&(t.onclick=Al);break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"innerHTML":case"ref":break;case"innerText":case"textContent":break;default:if(!ot.hasOwnProperty(a))t:{if(a[0]==="o"&&a[1]==="n"&&(c=a.endsWith("Capture"),n=a.slice(2,c?a.length-7:void 0),f=t[$t]||null,f=f!=null?f[a]:null,typeof f=="function"&&t.removeEventListener(n,f,c),typeof s=="function")){typeof f!="function"&&f!==null&&(a in t?t[a]=null:t.hasAttribute(a)&&t.removeAttribute(a)),t.addEventListener(n,s,c);break t}a in t?t[a]=s:s===!0?t.setAttribute(a,""):le(t,a,s)}}}function En(t,n,a){switch(n){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"img":Ae("error",t),Ae("load",t);var s=!1,c=!1,f;for(f in a)if(a.hasOwnProperty(f)){var M=a[f];if(M!=null)switch(f){case"src":s=!0;break;case"srcSet":c=!0;break;case"children":case"dangerouslySetInnerHTML":throw Error(r(137,n));default:Be(t,n,f,M,a,null)}}c&&Be(t,n,"srcSet",a.srcSet,a,null),s&&Be(t,n,"src",a.src,a,null);return;case"input":Ae("invalid",t);var E=f=M=c=null,z=null,Q=null;for(s in a)if(a.hasOwnProperty(s)){var ft=a[s];if(ft!=null)switch(s){case"name":c=ft;break;case"type":M=ft;break;case"checked":z=ft;break;case"defaultChecked":Q=ft;break;case"value":f=ft;break;case"defaultValue":E=ft;break;case"children":case"dangerouslySetInnerHTML":if(ft!=null)throw Error(r(137,n));break;default:Be(t,n,s,ft,a,null)}}No(t,f,E,z,Q,M,c,!1),ea(t);return;case"select":Ae("invalid",t),s=M=f=null;for(c in a)if(a.hasOwnProperty(c)&&(E=a[c],E!=null))switch(c){case"value":f=E;break;case"defaultValue":M=E;break;case"multiple":s=E;default:Be(t,n,c,E,a,null)}n=f,a=M,t.multiple=!!s,n!=null?mr(t,!!s,n,!1):a!=null&&mr(t,!!s,a,!0);return;case"textarea":Ae("invalid",t),f=c=s=null;for(M in a)if(a.hasOwnProperty(M)&&(E=a[M],E!=null))switch(M){case"value":s=E;break;case"defaultValue":c=E;break;case"children":f=E;break;case"dangerouslySetInnerHTML":if(E!=null)throw Error(r(91));break;default:Be(t,n,M,E,a,null)}Dh(t,s,c,f),ea(t);return;case"option":for(z in a)a.hasOwnProperty(z)&&(s=a[z],s!=null)&&(z==="selected"?t.selected=s&&typeof s!="function"&&typeof s!="symbol":Be(t,n,z,s,a,null));return;case"dialog":Ae("beforetoggle",t),Ae("toggle",t),Ae("cancel",t),Ae("close",t);break;case"iframe":case"object":Ae("load",t);break;case"video":case"audio":for(s=0;s<ao.length;s++)Ae(ao[s],t);break;case"image":Ae("error",t),Ae("load",t);break;case"details":Ae("toggle",t);break;case"embed":case"source":case"link":Ae("error",t),Ae("load",t);case"area":case"base":case"br":case"col":case"hr":case"keygen":case"meta":case"param":case"track":case"wbr":case"menuitem":for(Q in a)if(a.hasOwnProperty(Q)&&(s=a[Q],s!=null))switch(Q){case"children":case"dangerouslySetInnerHTML":throw Error(r(137,n));default:Be(t,n,Q,s,a,null)}return;default:if(Tc(n)){for(ft in a)a.hasOwnProperty(ft)&&(s=a[ft],s!==void 0&&cf(t,n,ft,s,a,void 0));return}}for(E in a)a.hasOwnProperty(E)&&(s=a[E],s!=null&&Be(t,n,E,s,a,null))}function k0(t,n,a,s){switch(n){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"input":var c=null,f=null,M=null,E=null,z=null,Q=null,ft=null;for(at in a){var mt=a[at];if(a.hasOwnProperty(at)&&mt!=null)switch(at){case"checked":break;case"value":break;case"defaultValue":z=mt;default:s.hasOwnProperty(at)||Be(t,n,at,null,s,mt)}}for(var et in s){var at=s[et];if(mt=a[et],s.hasOwnProperty(et)&&(at!=null||mt!=null))switch(et){case"type":f=at;break;case"name":c=at;break;case"checked":Q=at;break;case"defaultChecked":ft=at;break;case"value":M=at;break;case"defaultValue":E=at;break;case"children":case"dangerouslySetInnerHTML":if(at!=null)throw Error(r(137,n));break;default:at!==mt&&Be(t,n,et,at,s,mt)}}Ia(t,M,E,z,Q,ft,f,c);return;case"select":at=M=E=et=null;for(f in a)if(z=a[f],a.hasOwnProperty(f)&&z!=null)switch(f){case"value":break;case"multiple":at=z;default:s.hasOwnProperty(f)||Be(t,n,f,null,s,z)}for(c in s)if(f=s[c],z=a[c],s.hasOwnProperty(c)&&(f!=null||z!=null))switch(c){case"value":et=f;break;case"defaultValue":E=f;break;case"multiple":M=f;default:f!==z&&Be(t,n,c,f,s,z)}n=E,a=M,s=at,et!=null?mr(t,!!a,et,!1):!!s!=!!a&&(n!=null?mr(t,!!a,n,!0):mr(t,!!a,a?[]:"",!1));return;case"textarea":at=et=null;for(E in a)if(c=a[E],a.hasOwnProperty(E)&&c!=null&&!s.hasOwnProperty(E))switch(E){case"value":break;case"children":break;default:Be(t,n,E,null,s,c)}for(M in s)if(c=s[M],f=a[M],s.hasOwnProperty(M)&&(c!=null||f!=null))switch(M){case"value":et=c;break;case"defaultValue":at=c;break;case"children":break;case"dangerouslySetInnerHTML":if(c!=null)throw Error(r(91));break;default:c!==f&&Be(t,n,M,c,s,f)}Ch(t,et,at);return;case"option":for(var se in a)et=a[se],a.hasOwnProperty(se)&&et!=null&&!s.hasOwnProperty(se)&&(se==="selected"?t.selected=!1:Be(t,n,se,null,s,et));for(z in s)et=s[z],at=a[z],s.hasOwnProperty(z)&&et!==at&&(et!=null||at!=null)&&(z==="selected"?t.selected=et&&typeof et!="function"&&typeof et!="symbol":Be(t,n,z,et,s,at));return;case"img":case"link":case"area":case"base":case"br":case"col":case"embed":case"hr":case"keygen":case"meta":case"param":case"source":case"track":case"wbr":case"menuitem":for(var ee in a)et=a[ee],a.hasOwnProperty(ee)&&et!=null&&!s.hasOwnProperty(ee)&&Be(t,n,ee,null,s,et);for(Q in s)if(et=s[Q],at=a[Q],s.hasOwnProperty(Q)&&et!==at&&(et!=null||at!=null))switch(Q){case"children":case"dangerouslySetInnerHTML":if(et!=null)throw Error(r(137,n));break;default:Be(t,n,Q,et,s,at)}return;default:if(Tc(n)){for(var Ie in a)et=a[Ie],a.hasOwnProperty(Ie)&&et!==void 0&&!s.hasOwnProperty(Ie)&&cf(t,n,Ie,void 0,s,et);for(ft in s)et=s[ft],at=a[ft],!s.hasOwnProperty(ft)||et===at||et===void 0&&at===void 0||cf(t,n,ft,et,s,at);return}}for(var Y in a)et=a[Y],a.hasOwnProperty(Y)&&et!=null&&!s.hasOwnProperty(Y)&&Be(t,n,Y,null,s,et);for(mt in s)et=s[mt],at=a[mt],!s.hasOwnProperty(mt)||et===at||et==null&&at==null||Be(t,n,mt,et,s,at)}var uf=null,ff=null;function Rl(t){return t.nodeType===9?t:t.ownerDocument}function Lm(t){switch(t){case"http://www.w3.org/2000/svg":return 1;case"http://www.w3.org/1998/Math/MathML":return 2;default:return 0}}function Um(t,n){if(t===0)switch(n){case"svg":return 1;case"math":return 2;default:return 0}return t===1&&n==="foreignObject"?0:t}function hf(t,n){return t==="textarea"||t==="noscript"||typeof n.children=="string"||typeof n.children=="number"||typeof n.children=="bigint"||typeof n.dangerouslySetInnerHTML=="object"&&n.dangerouslySetInnerHTML!==null&&n.dangerouslySetInnerHTML.__html!=null}var df=null;function X0(){var t=window.event;return t&&t.type==="popstate"?t===df?!1:(df=t,!0):(df=null,!1)}var Nm=typeof setTimeout=="function"?setTimeout:void 0,W0=typeof clearTimeout=="function"?clearTimeout:void 0,Om=typeof Promise=="function"?Promise:void 0,q0=typeof queueMicrotask=="function"?queueMicrotask:typeof Om<"u"?function(t){return Om.resolve(null).then(t).catch(Y0)}:Nm;function Y0(t){setTimeout(function(){throw t})}function va(t){return t==="head"}function Pm(t,n){var a=n,s=0,c=0;do{var f=a.nextSibling;if(t.removeChild(a),f&&f.nodeType===8)if(a=f.data,a==="/$"){if(0<s&&8>s){a=s;var M=t.ownerDocument;if(a&1&&so(M.documentElement),a&2&&so(M.body),a&4)for(a=M.head,so(a),M=a.firstChild;M;){var E=M.nextSibling,z=M.nodeName;M[Rn]||z==="SCRIPT"||z==="STYLE"||z==="LINK"&&M.rel.toLowerCase()==="stylesheet"||a.removeChild(M),M=E}}if(c===0){t.removeChild(f),mo(n);return}c--}else a==="$"||a==="$?"||a==="$!"?c++:s=a.charCodeAt(0)-48;else s=0;a=f}while(a);mo(n)}function pf(t){var n=t.firstChild;for(n&&n.nodeType===10&&(n=n.nextSibling);n;){var a=n;switch(n=n.nextSibling,a.nodeName){case"HTML":case"HEAD":case"BODY":pf(a),zn(a);continue;case"SCRIPT":case"STYLE":continue;case"LINK":if(a.rel.toLowerCase()==="stylesheet")continue}t.removeChild(a)}}function j0(t,n,a,s){for(;t.nodeType===1;){var c=a;if(t.nodeName.toLowerCase()!==n.toLowerCase()){if(!s&&(t.nodeName!=="INPUT"||t.type!=="hidden"))break}else if(s){if(!t[Rn])switch(n){case"meta":if(!t.hasAttribute("itemprop"))break;return t;case"link":if(f=t.getAttribute("rel"),f==="stylesheet"&&t.hasAttribute("data-precedence"))break;if(f!==c.rel||t.getAttribute("href")!==(c.href==null||c.href===""?null:c.href)||t.getAttribute("crossorigin")!==(c.crossOrigin==null?null:c.crossOrigin)||t.getAttribute("title")!==(c.title==null?null:c.title))break;return t;case"style":if(t.hasAttribute("data-precedence"))break;return t;case"script":if(f=t.getAttribute("src"),(f!==(c.src==null?null:c.src)||t.getAttribute("type")!==(c.type==null?null:c.type)||t.getAttribute("crossorigin")!==(c.crossOrigin==null?null:c.crossOrigin))&&f&&t.hasAttribute("async")&&!t.hasAttribute("itemprop"))break;return t;default:return t}}else if(n==="input"&&t.type==="hidden"){var f=c.name==null?null:""+c.name;if(c.type==="hidden"&&t.getAttribute("name")===f)return t}else return t;if(t=_i(t.nextSibling),t===null)break}return null}function Z0(t,n,a){if(n==="")return null;for(;t.nodeType!==3;)if((t.nodeType!==1||t.nodeName!=="INPUT"||t.type!=="hidden")&&!a||(t=_i(t.nextSibling),t===null))return null;return t}function mf(t){return t.data==="$!"||t.data==="$?"&&t.ownerDocument.readyState==="complete"}function K0(t,n){var a=t.ownerDocument;if(t.data!=="$?"||a.readyState==="complete")n();else{var s=function(){n(),a.removeEventListener("DOMContentLoaded",s)};a.addEventListener("DOMContentLoaded",s),t._reactRetry=s}}function _i(t){for(;t!=null;t=t.nextSibling){var n=t.nodeType;if(n===1||n===3)break;if(n===8){if(n=t.data,n==="$"||n==="$!"||n==="$?"||n==="F!"||n==="F")break;if(n==="/$")return null}}return t}var gf=null;function zm(t){t=t.previousSibling;for(var n=0;t;){if(t.nodeType===8){var a=t.data;if(a==="$"||a==="$!"||a==="$?"){if(n===0)return t;n--}else a==="/$"&&n++}t=t.previousSibling}return null}function Bm(t,n,a){switch(n=Rl(a),t){case"html":if(t=n.documentElement,!t)throw Error(r(452));return t;case"head":if(t=n.head,!t)throw Error(r(453));return t;case"body":if(t=n.body,!t)throw Error(r(454));return t;default:throw Error(r(451))}}function so(t){for(var n=t.attributes;n.length;)t.removeAttributeNode(n[0]);zn(t)}var li=new Map,Im=new Set;function wl(t){return typeof t.getRootNode=="function"?t.getRootNode():t.nodeType===9?t:t.ownerDocument}var Xi=q.d;q.d={f:Q0,r:J0,D:$0,C:tS,L:eS,m:nS,X:aS,S:iS,M:rS};function Q0(){var t=Xi.f(),n=Sl();return t||n}function J0(t){var n=pi(t);n!==null&&n.tag===5&&n.type==="form"?ap(n):Xi.r(t)}var Wr=typeof document>"u"?null:document;function Fm(t,n,a){var s=Wr;if(s&&typeof n=="string"&&n){var c=Ye(n);c='link[rel="'+t+'"][href="'+c+'"]',typeof a=="string"&&(c+='[crossorigin="'+a+'"]'),Im.has(c)||(Im.add(c),t={rel:t,crossOrigin:a,href:n},s.querySelector(c)===null&&(n=s.createElement("link"),En(n,"link",t),W(n),s.head.appendChild(n)))}}function $0(t){Xi.D(t),Fm("dns-prefetch",t,null)}function tS(t,n){Xi.C(t,n),Fm("preconnect",t,n)}function eS(t,n,a){Xi.L(t,n,a);var s=Wr;if(s&&t&&n){var c='link[rel="preload"][as="'+Ye(n)+'"]';n==="image"&&a&&a.imageSrcSet?(c+='[imagesrcset="'+Ye(a.imageSrcSet)+'"]',typeof a.imageSizes=="string"&&(c+='[imagesizes="'+Ye(a.imageSizes)+'"]')):c+='[href="'+Ye(t)+'"]';var f=c;switch(n){case"style":f=qr(t);break;case"script":f=Yr(t)}li.has(f)||(t=g({rel:"preload",href:n==="image"&&a&&a.imageSrcSet?void 0:t,as:n},a),li.set(f,t),s.querySelector(c)!==null||n==="style"&&s.querySelector(oo(f))||n==="script"&&s.querySelector(lo(f))||(n=s.createElement("link"),En(n,"link",t),W(n),s.head.appendChild(n)))}}function nS(t,n){Xi.m(t,n);var a=Wr;if(a&&t){var s=n&&typeof n.as=="string"?n.as:"script",c='link[rel="modulepreload"][as="'+Ye(s)+'"][href="'+Ye(t)+'"]',f=c;switch(s){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":f=Yr(t)}if(!li.has(f)&&(t=g({rel:"modulepreload",href:t},n),li.set(f,t),a.querySelector(c)===null)){switch(s){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":if(a.querySelector(lo(f)))return}s=a.createElement("link"),En(s,"link",t),W(s),a.head.appendChild(s)}}}function iS(t,n,a){Xi.S(t,n,a);var s=Wr;if(s&&t){var c=C(s).hoistableStyles,f=qr(t);n=n||"default";var M=c.get(f);if(!M){var E={loading:0,preload:null};if(M=s.querySelector(oo(f)))E.loading=5;else{t=g({rel:"stylesheet",href:t,"data-precedence":n},a),(a=li.get(f))&&_f(t,a);var z=M=s.createElement("link");W(z),En(z,"link",t),z._p=new Promise(function(Q,ft){z.onload=Q,z.onerror=ft}),z.addEventListener("load",function(){E.loading|=1}),z.addEventListener("error",function(){E.loading|=2}),E.loading|=4,Cl(M,n,s)}M={type:"stylesheet",instance:M,count:1,state:E},c.set(f,M)}}}function aS(t,n){Xi.X(t,n);var a=Wr;if(a&&t){var s=C(a).hoistableScripts,c=Yr(t),f=s.get(c);f||(f=a.querySelector(lo(c)),f||(t=g({src:t,async:!0},n),(n=li.get(c))&&vf(t,n),f=a.createElement("script"),W(f),En(f,"link",t),a.head.appendChild(f)),f={type:"script",instance:f,count:1,state:null},s.set(c,f))}}function rS(t,n){Xi.M(t,n);var a=Wr;if(a&&t){var s=C(a).hoistableScripts,c=Yr(t),f=s.get(c);f||(f=a.querySelector(lo(c)),f||(t=g({src:t,async:!0,type:"module"},n),(n=li.get(c))&&vf(t,n),f=a.createElement("script"),W(f),En(f,"link",t),a.head.appendChild(f)),f={type:"script",instance:f,count:1,state:null},s.set(c,f))}}function Hm(t,n,a,s){var c=(c=vt.current)?wl(c):null;if(!c)throw Error(r(446));switch(t){case"meta":case"title":return null;case"style":return typeof a.precedence=="string"&&typeof a.href=="string"?(n=qr(a.href),a=C(c).hoistableStyles,s=a.get(n),s||(s={type:"style",instance:null,count:0,state:null},a.set(n,s)),s):{type:"void",instance:null,count:0,state:null};case"link":if(a.rel==="stylesheet"&&typeof a.href=="string"&&typeof a.precedence=="string"){t=qr(a.href);var f=C(c).hoistableStyles,M=f.get(t);if(M||(c=c.ownerDocument||c,M={type:"stylesheet",instance:null,count:0,state:{loading:0,preload:null}},f.set(t,M),(f=c.querySelector(oo(t)))&&!f._p&&(M.instance=f,M.state.loading=5),li.has(t)||(a={rel:"preload",as:"style",href:a.href,crossOrigin:a.crossOrigin,integrity:a.integrity,media:a.media,hrefLang:a.hrefLang,referrerPolicy:a.referrerPolicy},li.set(t,a),f||sS(c,t,a,M.state))),n&&s===null)throw Error(r(528,""));return M}if(n&&s!==null)throw Error(r(529,""));return null;case"script":return n=a.async,a=a.src,typeof a=="string"&&n&&typeof n!="function"&&typeof n!="symbol"?(n=Yr(a),a=C(c).hoistableScripts,s=a.get(n),s||(s={type:"script",instance:null,count:0,state:null},a.set(n,s)),s):{type:"void",instance:null,count:0,state:null};default:throw Error(r(444,t))}}function qr(t){return'href="'+Ye(t)+'"'}function oo(t){return'link[rel="stylesheet"]['+t+"]"}function Gm(t){return g({},t,{"data-precedence":t.precedence,precedence:null})}function sS(t,n,a,s){t.querySelector('link[rel="preload"][as="style"]['+n+"]")?s.loading=1:(n=t.createElement("link"),s.preload=n,n.addEventListener("load",function(){return s.loading|=1}),n.addEventListener("error",function(){return s.loading|=2}),En(n,"link",a),W(n),t.head.appendChild(n))}function Yr(t){return'[src="'+Ye(t)+'"]'}function lo(t){return"script[async]"+t}function Vm(t,n,a){if(n.count++,n.instance===null)switch(n.type){case"style":var s=t.querySelector('style[data-href~="'+Ye(a.href)+'"]');if(s)return n.instance=s,W(s),s;var c=g({},a,{"data-href":a.href,"data-precedence":a.precedence,href:null,precedence:null});return s=(t.ownerDocument||t).createElement("style"),W(s),En(s,"style",c),Cl(s,a.precedence,t),n.instance=s;case"stylesheet":c=qr(a.href);var f=t.querySelector(oo(c));if(f)return n.state.loading|=4,n.instance=f,W(f),f;s=Gm(a),(c=li.get(c))&&_f(s,c),f=(t.ownerDocument||t).createElement("link"),W(f);var M=f;return M._p=new Promise(function(E,z){M.onload=E,M.onerror=z}),En(f,"link",s),n.state.loading|=4,Cl(f,a.precedence,t),n.instance=f;case"script":return f=Yr(a.src),(c=t.querySelector(lo(f)))?(n.instance=c,W(c),c):(s=a,(c=li.get(f))&&(s=g({},a),vf(s,c)),t=t.ownerDocument||t,c=t.createElement("script"),W(c),En(c,"link",s),t.head.appendChild(c),n.instance=c);case"void":return null;default:throw Error(r(443,n.type))}else n.type==="stylesheet"&&(n.state.loading&4)===0&&(s=n.instance,n.state.loading|=4,Cl(s,a.precedence,t));return n.instance}function Cl(t,n,a){for(var s=a.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),c=s.length?s[s.length-1]:null,f=c,M=0;M<s.length;M++){var E=s[M];if(E.dataset.precedence===n)f=E;else if(f!==c)break}f?f.parentNode.insertBefore(t,f.nextSibling):(n=a.nodeType===9?a.head:a,n.insertBefore(t,n.firstChild))}function _f(t,n){t.crossOrigin==null&&(t.crossOrigin=n.crossOrigin),t.referrerPolicy==null&&(t.referrerPolicy=n.referrerPolicy),t.title==null&&(t.title=n.title)}function vf(t,n){t.crossOrigin==null&&(t.crossOrigin=n.crossOrigin),t.referrerPolicy==null&&(t.referrerPolicy=n.referrerPolicy),t.integrity==null&&(t.integrity=n.integrity)}var Dl=null;function km(t,n,a){if(Dl===null){var s=new Map,c=Dl=new Map;c.set(a,s)}else c=Dl,s=c.get(a),s||(s=new Map,c.set(a,s));if(s.has(t))return s;for(s.set(t,null),a=a.getElementsByTagName(t),c=0;c<a.length;c++){var f=a[c];if(!(f[Rn]||f[Lt]||t==="link"&&f.getAttribute("rel")==="stylesheet")&&f.namespaceURI!=="http://www.w3.org/2000/svg"){var M=f.getAttribute(n)||"";M=t+M;var E=s.get(M);E?E.push(f):s.set(M,[f])}}return s}function Xm(t,n,a){t=t.ownerDocument||t,t.head.insertBefore(a,n==="title"?t.querySelector("head > title"):null)}function oS(t,n,a){if(a===1||n.itemProp!=null)return!1;switch(t){case"meta":case"title":return!0;case"style":if(typeof n.precedence!="string"||typeof n.href!="string"||n.href==="")break;return!0;case"link":if(typeof n.rel!="string"||typeof n.href!="string"||n.href===""||n.onLoad||n.onError)break;return n.rel==="stylesheet"?(t=n.disabled,typeof n.precedence=="string"&&t==null):!0;case"script":if(n.async&&typeof n.async!="function"&&typeof n.async!="symbol"&&!n.onLoad&&!n.onError&&n.src&&typeof n.src=="string")return!0}return!1}function Wm(t){return!(t.type==="stylesheet"&&(t.state.loading&3)===0)}var co=null;function lS(){}function cS(t,n,a){if(co===null)throw Error(r(475));var s=co;if(n.type==="stylesheet"&&(typeof a.media!="string"||matchMedia(a.media).matches!==!1)&&(n.state.loading&4)===0){if(n.instance===null){var c=qr(a.href),f=t.querySelector(oo(c));if(f){t=f._p,t!==null&&typeof t=="object"&&typeof t.then=="function"&&(s.count++,s=Ll.bind(s),t.then(s,s)),n.state.loading|=4,n.instance=f,W(f);return}f=t.ownerDocument||t,a=Gm(a),(c=li.get(c))&&_f(a,c),f=f.createElement("link"),W(f);var M=f;M._p=new Promise(function(E,z){M.onload=E,M.onerror=z}),En(f,"link",a),n.instance=f}s.stylesheets===null&&(s.stylesheets=new Map),s.stylesheets.set(n,t),(t=n.state.preload)&&(n.state.loading&3)===0&&(s.count++,n=Ll.bind(s),t.addEventListener("load",n),t.addEventListener("error",n))}}function uS(){if(co===null)throw Error(r(475));var t=co;return t.stylesheets&&t.count===0&&Sf(t,t.stylesheets),0<t.count?function(n){var a=setTimeout(function(){if(t.stylesheets&&Sf(t,t.stylesheets),t.unsuspend){var s=t.unsuspend;t.unsuspend=null,s()}},6e4);return t.unsuspend=n,function(){t.unsuspend=null,clearTimeout(a)}}:null}function Ll(){if(this.count--,this.count===0){if(this.stylesheets)Sf(this,this.stylesheets);else if(this.unsuspend){var t=this.unsuspend;this.unsuspend=null,t()}}}var Ul=null;function Sf(t,n){t.stylesheets=null,t.unsuspend!==null&&(t.count++,Ul=new Map,n.forEach(fS,t),Ul=null,Ll.call(t))}function fS(t,n){if(!(n.state.loading&4)){var a=Ul.get(t);if(a)var s=a.get(null);else{a=new Map,Ul.set(t,a);for(var c=t.querySelectorAll("link[data-precedence],style[data-precedence]"),f=0;f<c.length;f++){var M=c[f];(M.nodeName==="LINK"||M.getAttribute("media")!=="not all")&&(a.set(M.dataset.precedence,M),s=M)}s&&a.set(null,s)}c=n.instance,M=c.getAttribute("data-precedence"),f=a.get(M)||s,f===s&&a.set(null,c),a.set(M,c),this.count++,s=Ll.bind(this),c.addEventListener("load",s),c.addEventListener("error",s),f?f.parentNode.insertBefore(c,f.nextSibling):(t=t.nodeType===9?t.head:t,t.insertBefore(c,t.firstChild)),n.state.loading|=4}}var uo={$$typeof:L,Provider:null,Consumer:null,_currentValue:K,_currentValue2:K,_threadCount:0};function hS(t,n,a,s,c,f,M,E){this.tag=1,this.containerInfo=t,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=H(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=H(0),this.hiddenUpdates=H(null),this.identifierPrefix=s,this.onUncaughtError=c,this.onCaughtError=f,this.onRecoverableError=M,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=E,this.incompleteTransitions=new Map}function qm(t,n,a,s,c,f,M,E,z,Q,ft,mt){return t=new hS(t,n,a,M,E,z,Q,mt),n=1,f===!0&&(n|=24),f=qn(3,null,null,n),t.current=f,f.stateNode=t,n=$c(),n.refCount++,t.pooledCache=n,n.refCount++,f.memoizedState={element:s,isDehydrated:a,cache:n},iu(f),t}function Ym(t){return t?(t=Tr,t):Tr}function jm(t,n,a,s,c,f){c=Ym(c),s.context===null?s.context=c:s.pendingContext=c,s=ra(n),s.payload={element:a},f=f===void 0?null:f,f!==null&&(s.callback=f),a=sa(t,s,n),a!==null&&(Qn(a,t,n),Hs(a,t,n))}function Zm(t,n){if(t=t.memoizedState,t!==null&&t.dehydrated!==null){var a=t.retryLane;t.retryLane=a!==0&&a<n?a:n}}function xf(t,n){Zm(t,n),(t=t.alternate)&&Zm(t,n)}function Km(t){if(t.tag===13){var n=Er(t,67108864);n!==null&&Qn(n,t,67108864),xf(t,67108864)}}var Nl=!0;function dS(t,n,a,s){var c=N.T;N.T=null;var f=q.p;try{q.p=2,Mf(t,n,a,s)}finally{q.p=f,N.T=c}}function pS(t,n,a,s){var c=N.T;N.T=null;var f=q.p;try{q.p=8,Mf(t,n,a,s)}finally{q.p=f,N.T=c}}function Mf(t,n,a,s){if(Nl){var c=yf(s);if(c===null)lf(t,n,s,Ol,a),Jm(t,s);else if(gS(c,t,n,a,s))s.stopPropagation();else if(Jm(t,s),n&4&&-1<mS.indexOf(t)){for(;c!==null;){var f=pi(c);if(f!==null)switch(f.tag){case 3:if(f=f.stateNode,f.current.memoizedState.isDehydrated){var M=zt(f.pendingLanes);if(M!==0){var E=f;for(E.pendingLanes|=2,E.entangledLanes|=2;M;){var z=1<<31-Vt(M);E.entanglements[1]|=z,M&=~z}wi(f),(Oe&6)===0&&(_l=Se()+500,io(0))}}break;case 13:E=Er(f,2),E!==null&&Qn(E,f,2),Sl(),xf(f,2)}if(f=yf(s),f===null&&lf(t,n,s,Ol,a),f===c)break;c=f}c!==null&&s.stopPropagation()}else lf(t,n,s,null,a)}}function yf(t){return t=Ac(t),Ef(t)}var Ol=null;function Ef(t){if(Ol=null,t=Sn(t),t!==null){var n=u(t);if(n===null)t=null;else{var a=n.tag;if(a===13){if(t=d(n),t!==null)return t;t=null}else if(a===3){if(n.stateNode.current.memoizedState.isDehydrated)return n.tag===3?n.stateNode.containerInfo:null;t=null}else n!==t&&(t=null)}}return Ol=t,null}function Qm(t){switch(t){case"beforetoggle":case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"toggle":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 2;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 8;case"message":switch(de()){case D:return 2;case T:return 8;case tt:case yt:return 32;case xt:return 268435456;default:return 32}default:return 32}}var Tf=!1,Sa=null,xa=null,Ma=null,fo=new Map,ho=new Map,ya=[],mS="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");function Jm(t,n){switch(t){case"focusin":case"focusout":Sa=null;break;case"dragenter":case"dragleave":xa=null;break;case"mouseover":case"mouseout":Ma=null;break;case"pointerover":case"pointerout":fo.delete(n.pointerId);break;case"gotpointercapture":case"lostpointercapture":ho.delete(n.pointerId)}}function po(t,n,a,s,c,f){return t===null||t.nativeEvent!==f?(t={blockedOn:n,domEventName:a,eventSystemFlags:s,nativeEvent:f,targetContainers:[c]},n!==null&&(n=pi(n),n!==null&&Km(n)),t):(t.eventSystemFlags|=s,n=t.targetContainers,c!==null&&n.indexOf(c)===-1&&n.push(c),t)}function gS(t,n,a,s,c){switch(n){case"focusin":return Sa=po(Sa,t,n,a,s,c),!0;case"dragenter":return xa=po(xa,t,n,a,s,c),!0;case"mouseover":return Ma=po(Ma,t,n,a,s,c),!0;case"pointerover":var f=c.pointerId;return fo.set(f,po(fo.get(f)||null,t,n,a,s,c)),!0;case"gotpointercapture":return f=c.pointerId,ho.set(f,po(ho.get(f)||null,t,n,a,s,c)),!0}return!1}function $m(t){var n=Sn(t.target);if(n!==null){var a=u(n);if(a!==null){if(n=a.tag,n===13){if(n=d(a),n!==null){t.blockedOn=n,Ut(t.priority,function(){if(a.tag===13){var s=Kn();s=we(s);var c=Er(a,s);c!==null&&Qn(c,a,s),xf(a,s)}});return}}else if(n===3&&a.stateNode.current.memoizedState.isDehydrated){t.blockedOn=a.tag===3?a.stateNode.containerInfo:null;return}}}t.blockedOn=null}function Pl(t){if(t.blockedOn!==null)return!1;for(var n=t.targetContainers;0<n.length;){var a=yf(t.nativeEvent);if(a===null){a=t.nativeEvent;var s=new a.constructor(a.type,a);bc=s,a.target.dispatchEvent(s),bc=null}else return n=pi(a),n!==null&&Km(n),t.blockedOn=a,!1;n.shift()}return!0}function tg(t,n,a){Pl(t)&&a.delete(n)}function _S(){Tf=!1,Sa!==null&&Pl(Sa)&&(Sa=null),xa!==null&&Pl(xa)&&(xa=null),Ma!==null&&Pl(Ma)&&(Ma=null),fo.forEach(tg),ho.forEach(tg)}function zl(t,n){t.blockedOn===n&&(t.blockedOn=null,Tf||(Tf=!0,o.unstable_scheduleCallback(o.unstable_NormalPriority,_S)))}var Bl=null;function eg(t){Bl!==t&&(Bl=t,o.unstable_scheduleCallback(o.unstable_NormalPriority,function(){Bl===t&&(Bl=null);for(var n=0;n<t.length;n+=3){var a=t[n],s=t[n+1],c=t[n+2];if(typeof s!="function"){if(Ef(s||a)===null)continue;break}var f=pi(a);f!==null&&(t.splice(n,3),n-=3,yu(f,{pending:!0,data:c,method:a.method,action:s},s,c))}}))}function mo(t){function n(z){return zl(z,t)}Sa!==null&&zl(Sa,t),xa!==null&&zl(xa,t),Ma!==null&&zl(Ma,t),fo.forEach(n),ho.forEach(n);for(var a=0;a<ya.length;a++){var s=ya[a];s.blockedOn===t&&(s.blockedOn=null)}for(;0<ya.length&&(a=ya[0],a.blockedOn===null);)$m(a),a.blockedOn===null&&ya.shift();if(a=(t.ownerDocument||t).$$reactFormReplay,a!=null)for(s=0;s<a.length;s+=3){var c=a[s],f=a[s+1],M=c[$t]||null;if(typeof f=="function")M||eg(a);else if(M){var E=null;if(f&&f.hasAttribute("formAction")){if(c=f,M=f[$t]||null)E=M.formAction;else if(Ef(c)!==null)continue}else E=M.action;typeof E=="function"?a[s+1]=E:(a.splice(s,3),s-=3),eg(a)}}}function bf(t){this._internalRoot=t}Il.prototype.render=bf.prototype.render=function(t){var n=this._internalRoot;if(n===null)throw Error(r(409));var a=n.current,s=Kn();jm(a,s,t,n,null,null)},Il.prototype.unmount=bf.prototype.unmount=function(){var t=this._internalRoot;if(t!==null){this._internalRoot=null;var n=t.containerInfo;jm(t.current,2,null,t,null,null),Sl(),n[he]=null}};function Il(t){this._internalRoot=t}Il.prototype.unstable_scheduleHydration=function(t){if(t){var n=Rt();t={blockedOn:null,target:t,priority:n};for(var a=0;a<ya.length&&n!==0&&n<ya[a].priority;a++);ya.splice(a,0,t),a===0&&$m(t)}};var ng=e.version;if(ng!=="19.1.0")throw Error(r(527,ng,"19.1.0"));q.findDOMNode=function(t){var n=t._reactInternals;if(n===void 0)throw typeof t.render=="function"?Error(r(188)):(t=Object.keys(t).join(","),Error(r(268,t)));return t=m(n),t=t!==null?p(t):null,t=t===null?null:t.stateNode,t};var vS={bundleType:0,version:"19.1.0",rendererPackageName:"react-dom",currentDispatcherRef:N,reconcilerVersion:"19.1.0"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Fl=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Fl.isDisabled&&Fl.supportsFiber)try{At=Fl.inject(vS),Dt=Fl}catch{}}return _o.createRoot=function(t,n){if(!l(t))throw Error(r(299));var a=!1,s="",c=vp,f=Sp,M=xp,E=null;return n!=null&&(n.unstable_strictMode===!0&&(a=!0),n.identifierPrefix!==void 0&&(s=n.identifierPrefix),n.onUncaughtError!==void 0&&(c=n.onUncaughtError),n.onCaughtError!==void 0&&(f=n.onCaughtError),n.onRecoverableError!==void 0&&(M=n.onRecoverableError),n.unstable_transitionCallbacks!==void 0&&(E=n.unstable_transitionCallbacks)),n=qm(t,1,!1,null,null,a,s,c,f,M,E,null),t[he]=n.current,of(t),new bf(n)},_o.hydrateRoot=function(t,n,a){if(!l(t))throw Error(r(299));var s=!1,c="",f=vp,M=Sp,E=xp,z=null,Q=null;return a!=null&&(a.unstable_strictMode===!0&&(s=!0),a.identifierPrefix!==void 0&&(c=a.identifierPrefix),a.onUncaughtError!==void 0&&(f=a.onUncaughtError),a.onCaughtError!==void 0&&(M=a.onCaughtError),a.onRecoverableError!==void 0&&(E=a.onRecoverableError),a.unstable_transitionCallbacks!==void 0&&(z=a.unstable_transitionCallbacks),a.formState!==void 0&&(Q=a.formState)),n=qm(t,1,!0,n,a??null,s,c,f,M,E,z,Q),n.context=Ym(null),a=n.current,s=Kn(),s=we(s),c=ra(s),c.callback=null,sa(a,c,s),a=s,n.current.lanes=a,bt(n,a),wi(n),t[he]=n.current,of(t),new Il(n)},_o.version="19.1.0",_o}var hg;function wS(){if(hg)return Rf.exports;hg=1;function o(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(o)}catch(e){console.error(e)}}return o(),Rf.exports=RS(),Rf.exports}var CS=wS(),qt=Eh();const Th="160",DS=0,dg=1,LS=2,B_=1,US=2,Ki=3,Pa=0,kn=1,Qi=2,Ua=0,hs=1,fh=2,pg=3,mg=4,NS=5,or=100,OS=101,PS=102,gg=103,_g=104,zS=200,BS=201,IS=202,FS=203,hh=204,dh=205,HS=206,GS=207,VS=208,kS=209,XS=210,WS=211,qS=212,YS=213,jS=214,ZS=0,KS=1,QS=2,dc=3,JS=4,$S=5,tx=6,ex=7,I_=0,nx=1,ix=2,Na=0,ax=1,rx=2,sx=3,ox=4,lx=5,cx=6,F_=300,ps=301,ms=302,ph=303,mh=304,Sc=306,gh=1e3,yi=1001,_h=1002,Pn=1003,vg=1004,Uf=1005,ui=1006,ux=1007,Ao=1008,Oa=1009,fx=1010,hx=1011,bh=1012,H_=1013,Ca=1014,Da=1015,Ro=1016,G_=1017,V_=1018,cr=1020,dx=1021,Ei=1023,px=1024,mx=1025,ur=1026,gs=1027,gx=1028,k_=1029,_x=1030,X_=1031,W_=1033,Nf=33776,Of=33777,Pf=33778,zf=33779,Sg=35840,xg=35841,Mg=35842,yg=35843,q_=36196,Eg=37492,Tg=37496,bg=37808,Ag=37809,Rg=37810,wg=37811,Cg=37812,Dg=37813,Lg=37814,Ug=37815,Ng=37816,Og=37817,Pg=37818,zg=37819,Bg=37820,Ig=37821,Bf=36492,Fg=36494,Hg=36495,vx=36283,Gg=36284,Vg=36285,kg=36286,Y_=3e3,fr=3001,Sx=3200,xx=3201,Mx=0,yx=1,hi="",Tn="srgb",$i="srgb-linear",Ah="display-p3",xc="display-p3-linear",pc="linear",je="srgb",mc="rec709",gc="p3",jr=7680,Xg=519,Ex=512,Tx=513,bx=514,j_=515,Ax=516,Rx=517,wx=518,Cx=519,Wg=35044,qg="300 es",vh=1035,Ji=2e3,_c=2001;class vs{addEventListener(e,i){this._listeners===void 0&&(this._listeners={});const r=this._listeners;r[e]===void 0&&(r[e]=[]),r[e].indexOf(i)===-1&&r[e].push(i)}hasEventListener(e,i){if(this._listeners===void 0)return!1;const r=this._listeners;return r[e]!==void 0&&r[e].indexOf(i)!==-1}removeEventListener(e,i){if(this._listeners===void 0)return;const l=this._listeners[e];if(l!==void 0){const u=l.indexOf(i);u!==-1&&l.splice(u,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const r=this._listeners[e.type];if(r!==void 0){e.target=this;const l=r.slice(0);for(let u=0,d=l.length;u<d;u++)l[u].call(this,e);e.target=null}}}const Ln=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],If=Math.PI/180,Sh=180/Math.PI;function wo(){const o=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(Ln[o&255]+Ln[o>>8&255]+Ln[o>>16&255]+Ln[o>>24&255]+"-"+Ln[e&255]+Ln[e>>8&255]+"-"+Ln[e>>16&15|64]+Ln[e>>24&255]+"-"+Ln[i&63|128]+Ln[i>>8&255]+"-"+Ln[i>>16&255]+Ln[i>>24&255]+Ln[r&255]+Ln[r>>8&255]+Ln[r>>16&255]+Ln[r>>24&255]).toLowerCase()}function Vn(o,e,i){return Math.max(e,Math.min(i,o))}function Dx(o,e){return(o%e+e)%e}function Ff(o,e,i){return(1-i)*o+i*e}function Yg(o){return(o&o-1)===0&&o!==0}function xh(o){return Math.pow(2,Math.floor(Math.log(o)/Math.LN2))}function vo(o,e){switch(e.constructor){case Float32Array:return o;case Uint32Array:return o/4294967295;case Uint16Array:return o/65535;case Uint8Array:return o/255;case Int32Array:return Math.max(o/2147483647,-1);case Int16Array:return Math.max(o/32767,-1);case Int8Array:return Math.max(o/127,-1);default:throw new Error("Invalid component type.")}}function Gn(o,e){switch(e.constructor){case Float32Array:return o;case Uint32Array:return Math.round(o*4294967295);case Uint16Array:return Math.round(o*65535);case Uint8Array:return Math.round(o*255);case Int32Array:return Math.round(o*2147483647);case Int16Array:return Math.round(o*32767);case Int8Array:return Math.round(o*127);default:throw new Error("Invalid component type.")}}class He{constructor(e=0,i=0){He.prototype.isVector2=!0,this.x=e,this.y=i}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,i){return this.x=e,this.y=i,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,i){switch(e){case 0:this.x=i;break;case 1:this.y=i;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,i){return this.x=e.x+i.x,this.y=e.y+i.y,this}addScaledVector(e,i){return this.x+=e.x*i,this.y+=e.y*i,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,i){return this.x=e.x-i.x,this.y=e.y-i.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const i=this.x,r=this.y,l=e.elements;return this.x=l[0]*i+l[3]*r+l[6],this.y=l[1]*i+l[4]*r+l[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,i){return this.x=Math.max(e.x,Math.min(i.x,this.x)),this.y=Math.max(e.y,Math.min(i.y,this.y)),this}clampScalar(e,i){return this.x=Math.max(e,Math.min(i,this.x)),this.y=Math.max(e,Math.min(i,this.y)),this}clampLength(e,i){const r=this.length();return this.divideScalar(r||1).multiplyScalar(Math.max(e,Math.min(i,r)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const i=Math.sqrt(this.lengthSq()*e.lengthSq());if(i===0)return Math.PI/2;const r=this.dot(e)/i;return Math.acos(Vn(r,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const i=this.x-e.x,r=this.y-e.y;return i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,i){return this.x+=(e.x-this.x)*i,this.y+=(e.y-this.y)*i,this}lerpVectors(e,i,r){return this.x=e.x+(i.x-e.x)*r,this.y=e.y+(i.y-e.y)*r,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,i=0){return this.x=e[i],this.y=e[i+1],this}toArray(e=[],i=0){return e[i]=this.x,e[i+1]=this.y,e}fromBufferAttribute(e,i){return this.x=e.getX(i),this.y=e.getY(i),this}rotateAround(e,i){const r=Math.cos(i),l=Math.sin(i),u=this.x-e.x,d=this.y-e.y;return this.x=u*r-d*l+e.x,this.y=u*l+d*r+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class ye{constructor(e,i,r,l,u,d,h,m,p){ye.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,i,r,l,u,d,h,m,p)}set(e,i,r,l,u,d,h,m,p){const g=this.elements;return g[0]=e,g[1]=l,g[2]=h,g[3]=i,g[4]=u,g[5]=m,g[6]=r,g[7]=d,g[8]=p,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const i=this.elements,r=e.elements;return i[0]=r[0],i[1]=r[1],i[2]=r[2],i[3]=r[3],i[4]=r[4],i[5]=r[5],i[6]=r[6],i[7]=r[7],i[8]=r[8],this}extractBasis(e,i,r){return e.setFromMatrix3Column(this,0),i.setFromMatrix3Column(this,1),r.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const i=e.elements;return this.set(i[0],i[4],i[8],i[1],i[5],i[9],i[2],i[6],i[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,i){const r=e.elements,l=i.elements,u=this.elements,d=r[0],h=r[3],m=r[6],p=r[1],g=r[4],v=r[7],x=r[2],y=r[5],A=r[8],b=l[0],S=l[3],_=l[6],P=l[1],L=l[4],O=l[7],k=l[2],F=l[5],B=l[8];return u[0]=d*b+h*P+m*k,u[3]=d*S+h*L+m*F,u[6]=d*_+h*O+m*B,u[1]=p*b+g*P+v*k,u[4]=p*S+g*L+v*F,u[7]=p*_+g*O+v*B,u[2]=x*b+y*P+A*k,u[5]=x*S+y*L+A*F,u[8]=x*_+y*O+A*B,this}multiplyScalar(e){const i=this.elements;return i[0]*=e,i[3]*=e,i[6]*=e,i[1]*=e,i[4]*=e,i[7]*=e,i[2]*=e,i[5]*=e,i[8]*=e,this}determinant(){const e=this.elements,i=e[0],r=e[1],l=e[2],u=e[3],d=e[4],h=e[5],m=e[6],p=e[7],g=e[8];return i*d*g-i*h*p-r*u*g+r*h*m+l*u*p-l*d*m}invert(){const e=this.elements,i=e[0],r=e[1],l=e[2],u=e[3],d=e[4],h=e[5],m=e[6],p=e[7],g=e[8],v=g*d-h*p,x=h*m-g*u,y=p*u-d*m,A=i*v+r*x+l*y;if(A===0)return this.set(0,0,0,0,0,0,0,0,0);const b=1/A;return e[0]=v*b,e[1]=(l*p-g*r)*b,e[2]=(h*r-l*d)*b,e[3]=x*b,e[4]=(g*i-l*m)*b,e[5]=(l*u-h*i)*b,e[6]=y*b,e[7]=(r*m-p*i)*b,e[8]=(d*i-r*u)*b,this}transpose(){let e;const i=this.elements;return e=i[1],i[1]=i[3],i[3]=e,e=i[2],i[2]=i[6],i[6]=e,e=i[5],i[5]=i[7],i[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const i=this.elements;return e[0]=i[0],e[1]=i[3],e[2]=i[6],e[3]=i[1],e[4]=i[4],e[5]=i[7],e[6]=i[2],e[7]=i[5],e[8]=i[8],this}setUvTransform(e,i,r,l,u,d,h){const m=Math.cos(u),p=Math.sin(u);return this.set(r*m,r*p,-r*(m*d+p*h)+d+e,-l*p,l*m,-l*(-p*d+m*h)+h+i,0,0,1),this}scale(e,i){return this.premultiply(Hf.makeScale(e,i)),this}rotate(e){return this.premultiply(Hf.makeRotation(-e)),this}translate(e,i){return this.premultiply(Hf.makeTranslation(e,i)),this}makeTranslation(e,i){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,i,0,0,1),this}makeRotation(e){const i=Math.cos(e),r=Math.sin(e);return this.set(i,-r,0,r,i,0,0,0,1),this}makeScale(e,i){return this.set(e,0,0,0,i,0,0,0,1),this}equals(e){const i=this.elements,r=e.elements;for(let l=0;l<9;l++)if(i[l]!==r[l])return!1;return!0}fromArray(e,i=0){for(let r=0;r<9;r++)this.elements[r]=e[r+i];return this}toArray(e=[],i=0){const r=this.elements;return e[i]=r[0],e[i+1]=r[1],e[i+2]=r[2],e[i+3]=r[3],e[i+4]=r[4],e[i+5]=r[5],e[i+6]=r[6],e[i+7]=r[7],e[i+8]=r[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Hf=new ye;function Z_(o){for(let e=o.length-1;e>=0;--e)if(o[e]>=65535)return!0;return!1}function vc(o){return document.createElementNS("http://www.w3.org/1999/xhtml",o)}function Lx(){const o=vc("canvas");return o.style.display="block",o}const jg={};function bo(o){o in jg||(jg[o]=!0,console.warn(o))}const Zg=new ye().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Kg=new ye().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Hl={[$i]:{transfer:pc,primaries:mc,toReference:o=>o,fromReference:o=>o},[Tn]:{transfer:je,primaries:mc,toReference:o=>o.convertSRGBToLinear(),fromReference:o=>o.convertLinearToSRGB()},[xc]:{transfer:pc,primaries:gc,toReference:o=>o.applyMatrix3(Kg),fromReference:o=>o.applyMatrix3(Zg)},[Ah]:{transfer:je,primaries:gc,toReference:o=>o.convertSRGBToLinear().applyMatrix3(Kg),fromReference:o=>o.applyMatrix3(Zg).convertLinearToSRGB()}},Ux=new Set([$i,xc]),Fe={enabled:!0,_workingColorSpace:$i,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(o){if(!Ux.has(o))throw new Error(`Unsupported working color space, "${o}".`);this._workingColorSpace=o},convert:function(o,e,i){if(this.enabled===!1||e===i||!e||!i)return o;const r=Hl[e].toReference,l=Hl[i].fromReference;return l(r(o))},fromWorkingColorSpace:function(o,e){return this.convert(o,this._workingColorSpace,e)},toWorkingColorSpace:function(o,e){return this.convert(o,e,this._workingColorSpace)},getPrimaries:function(o){return Hl[o].primaries},getTransfer:function(o){return o===hi?pc:Hl[o].transfer}};function ds(o){return o<.04045?o*.0773993808:Math.pow(o*.9478672986+.0521327014,2.4)}function Gf(o){return o<.0031308?o*12.92:1.055*Math.pow(o,.41666)-.055}let Zr;class K_{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{Zr===void 0&&(Zr=vc("canvas")),Zr.width=e.width,Zr.height=e.height;const r=Zr.getContext("2d");e instanceof ImageData?r.putImageData(e,0,0):r.drawImage(e,0,0,e.width,e.height),i=Zr}return i.width>2048||i.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),i.toDataURL("image/jpeg",.6)):i.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const i=vc("canvas");i.width=e.width,i.height=e.height;const r=i.getContext("2d");r.drawImage(e,0,0,e.width,e.height);const l=r.getImageData(0,0,e.width,e.height),u=l.data;for(let d=0;d<u.length;d++)u[d]=ds(u[d]/255)*255;return r.putImageData(l,0,0),i}else if(e.data){const i=e.data.slice(0);for(let r=0;r<i.length;r++)i instanceof Uint8Array||i instanceof Uint8ClampedArray?i[r]=Math.floor(ds(i[r]/255)*255):i[r]=ds(i[r]);return{data:i,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Nx=0;class Q_{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Nx++}),this.uuid=wo(),this.data=e,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const i=e===void 0||typeof e=="string";if(!i&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const r={uuid:this.uuid,url:""},l=this.data;if(l!==null){let u;if(Array.isArray(l)){u=[];for(let d=0,h=l.length;d<h;d++)l[d].isDataTexture?u.push(Vf(l[d].image)):u.push(Vf(l[d]))}else u=Vf(l);r.url=u}return i||(e.images[this.uuid]=r),r}}function Vf(o){return typeof HTMLImageElement<"u"&&o instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&o instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&o instanceof ImageBitmap?K_.getDataURL(o):o.data?{data:Array.from(o.data),width:o.width,height:o.height,type:o.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Ox=0;class ti extends vs{constructor(e=ti.DEFAULT_IMAGE,i=ti.DEFAULT_MAPPING,r=yi,l=yi,u=ui,d=Ao,h=Ei,m=Oa,p=ti.DEFAULT_ANISOTROPY,g=hi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Ox++}),this.uuid=wo(),this.name="",this.source=new Q_(e),this.mipmaps=[],this.mapping=i,this.channel=0,this.wrapS=r,this.wrapT=l,this.magFilter=u,this.minFilter=d,this.anisotropy=p,this.format=h,this.internalFormat=null,this.type=m,this.offset=new He(0,0),this.repeat=new He(1,1),this.center=new He(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ye,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof g=="string"?this.colorSpace=g:(bo("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=g===fr?Tn:hi),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const i=e===void 0||typeof e=="string";if(!i&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const r={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(r.userData=this.userData),i||(e.textures[this.uuid]=r),r}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==F_)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case gh:e.x=e.x-Math.floor(e.x);break;case yi:e.x=e.x<0?0:1;break;case _h:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case gh:e.y=e.y-Math.floor(e.y);break;case yi:e.y=e.y<0?0:1;break;case _h:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return bo("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===Tn?fr:Y_}set encoding(e){bo("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=e===fr?Tn:hi}}ti.DEFAULT_IMAGE=null;ti.DEFAULT_MAPPING=F_;ti.DEFAULT_ANISOTROPY=1;class bn{constructor(e=0,i=0,r=0,l=1){bn.prototype.isVector4=!0,this.x=e,this.y=i,this.z=r,this.w=l}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,i,r,l){return this.x=e,this.y=i,this.z=r,this.w=l,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,i){switch(e){case 0:this.x=i;break;case 1:this.y=i;break;case 2:this.z=i;break;case 3:this.w=i;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,i){return this.x=e.x+i.x,this.y=e.y+i.y,this.z=e.z+i.z,this.w=e.w+i.w,this}addScaledVector(e,i){return this.x+=e.x*i,this.y+=e.y*i,this.z+=e.z*i,this.w+=e.w*i,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,i){return this.x=e.x-i.x,this.y=e.y-i.y,this.z=e.z-i.z,this.w=e.w-i.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const i=this.x,r=this.y,l=this.z,u=this.w,d=e.elements;return this.x=d[0]*i+d[4]*r+d[8]*l+d[12]*u,this.y=d[1]*i+d[5]*r+d[9]*l+d[13]*u,this.z=d[2]*i+d[6]*r+d[10]*l+d[14]*u,this.w=d[3]*i+d[7]*r+d[11]*l+d[15]*u,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const i=Math.sqrt(1-e.w*e.w);return i<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/i,this.y=e.y/i,this.z=e.z/i),this}setAxisAngleFromRotationMatrix(e){let i,r,l,u;const m=e.elements,p=m[0],g=m[4],v=m[8],x=m[1],y=m[5],A=m[9],b=m[2],S=m[6],_=m[10];if(Math.abs(g-x)<.01&&Math.abs(v-b)<.01&&Math.abs(A-S)<.01){if(Math.abs(g+x)<.1&&Math.abs(v+b)<.1&&Math.abs(A+S)<.1&&Math.abs(p+y+_-3)<.1)return this.set(1,0,0,0),this;i=Math.PI;const L=(p+1)/2,O=(y+1)/2,k=(_+1)/2,F=(g+x)/4,B=(v+b)/4,pt=(A+S)/4;return L>O&&L>k?L<.01?(r=0,l=.707106781,u=.707106781):(r=Math.sqrt(L),l=F/r,u=B/r):O>k?O<.01?(r=.707106781,l=0,u=.707106781):(l=Math.sqrt(O),r=F/l,u=pt/l):k<.01?(r=.707106781,l=.707106781,u=0):(u=Math.sqrt(k),r=B/u,l=pt/u),this.set(r,l,u,i),this}let P=Math.sqrt((S-A)*(S-A)+(v-b)*(v-b)+(x-g)*(x-g));return Math.abs(P)<.001&&(P=1),this.x=(S-A)/P,this.y=(v-b)/P,this.z=(x-g)/P,this.w=Math.acos((p+y+_-1)/2),this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,i){return this.x=Math.max(e.x,Math.min(i.x,this.x)),this.y=Math.max(e.y,Math.min(i.y,this.y)),this.z=Math.max(e.z,Math.min(i.z,this.z)),this.w=Math.max(e.w,Math.min(i.w,this.w)),this}clampScalar(e,i){return this.x=Math.max(e,Math.min(i,this.x)),this.y=Math.max(e,Math.min(i,this.y)),this.z=Math.max(e,Math.min(i,this.z)),this.w=Math.max(e,Math.min(i,this.w)),this}clampLength(e,i){const r=this.length();return this.divideScalar(r||1).multiplyScalar(Math.max(e,Math.min(i,r)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,i){return this.x+=(e.x-this.x)*i,this.y+=(e.y-this.y)*i,this.z+=(e.z-this.z)*i,this.w+=(e.w-this.w)*i,this}lerpVectors(e,i,r){return this.x=e.x+(i.x-e.x)*r,this.y=e.y+(i.y-e.y)*r,this.z=e.z+(i.z-e.z)*r,this.w=e.w+(i.w-e.w)*r,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,i=0){return this.x=e[i],this.y=e[i+1],this.z=e[i+2],this.w=e[i+3],this}toArray(e=[],i=0){return e[i]=this.x,e[i+1]=this.y,e[i+2]=this.z,e[i+3]=this.w,e}fromBufferAttribute(e,i){return this.x=e.getX(i),this.y=e.getY(i),this.z=e.getZ(i),this.w=e.getW(i),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Px extends vs{constructor(e=1,i=1,r={}){super(),this.isRenderTarget=!0,this.width=e,this.height=i,this.depth=1,this.scissor=new bn(0,0,e,i),this.scissorTest=!1,this.viewport=new bn(0,0,e,i);const l={width:e,height:i,depth:1};r.encoding!==void 0&&(bo("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),r.colorSpace=r.encoding===fr?Tn:hi),r=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ui,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},r),this.texture=new ti(l,r.mapping,r.wrapS,r.wrapT,r.magFilter,r.minFilter,r.format,r.type,r.anisotropy,r.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=r.generateMipmaps,this.texture.internalFormat=r.internalFormat,this.depthBuffer=r.depthBuffer,this.stencilBuffer=r.stencilBuffer,this.depthTexture=r.depthTexture,this.samples=r.samples}setSize(e,i,r=1){(this.width!==e||this.height!==i||this.depth!==r)&&(this.width=e,this.height=i,this.depth=r,this.texture.image.width=e,this.texture.image.height=i,this.texture.image.depth=r,this.dispose()),this.viewport.set(0,0,e,i),this.scissor.set(0,0,e,i)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.texture=e.texture.clone(),this.texture.isRenderTargetTexture=!0;const i=Object.assign({},e.texture.image);return this.texture.source=new Q_(i),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class dr extends Px{constructor(e=1,i=1,r={}){super(e,i,r),this.isWebGLRenderTarget=!0}}class J_ extends ti{constructor(e=null,i=1,r=1,l=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:i,height:r,depth:l},this.magFilter=Pn,this.minFilter=Pn,this.wrapR=yi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class zx extends ti{constructor(e=null,i=1,r=1,l=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:i,height:r,depth:l},this.magFilter=Pn,this.minFilter=Pn,this.wrapR=yi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Co{constructor(e=0,i=0,r=0,l=1){this.isQuaternion=!0,this._x=e,this._y=i,this._z=r,this._w=l}static slerpFlat(e,i,r,l,u,d,h){let m=r[l+0],p=r[l+1],g=r[l+2],v=r[l+3];const x=u[d+0],y=u[d+1],A=u[d+2],b=u[d+3];if(h===0){e[i+0]=m,e[i+1]=p,e[i+2]=g,e[i+3]=v;return}if(h===1){e[i+0]=x,e[i+1]=y,e[i+2]=A,e[i+3]=b;return}if(v!==b||m!==x||p!==y||g!==A){let S=1-h;const _=m*x+p*y+g*A+v*b,P=_>=0?1:-1,L=1-_*_;if(L>Number.EPSILON){const k=Math.sqrt(L),F=Math.atan2(k,_*P);S=Math.sin(S*F)/k,h=Math.sin(h*F)/k}const O=h*P;if(m=m*S+x*O,p=p*S+y*O,g=g*S+A*O,v=v*S+b*O,S===1-h){const k=1/Math.sqrt(m*m+p*p+g*g+v*v);m*=k,p*=k,g*=k,v*=k}}e[i]=m,e[i+1]=p,e[i+2]=g,e[i+3]=v}static multiplyQuaternionsFlat(e,i,r,l,u,d){const h=r[l],m=r[l+1],p=r[l+2],g=r[l+3],v=u[d],x=u[d+1],y=u[d+2],A=u[d+3];return e[i]=h*A+g*v+m*y-p*x,e[i+1]=m*A+g*x+p*v-h*y,e[i+2]=p*A+g*y+h*x-m*v,e[i+3]=g*A-h*v-m*x-p*y,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,i,r,l){return this._x=e,this._y=i,this._z=r,this._w=l,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,i=!0){const r=e._x,l=e._y,u=e._z,d=e._order,h=Math.cos,m=Math.sin,p=h(r/2),g=h(l/2),v=h(u/2),x=m(r/2),y=m(l/2),A=m(u/2);switch(d){case"XYZ":this._x=x*g*v+p*y*A,this._y=p*y*v-x*g*A,this._z=p*g*A+x*y*v,this._w=p*g*v-x*y*A;break;case"YXZ":this._x=x*g*v+p*y*A,this._y=p*y*v-x*g*A,this._z=p*g*A-x*y*v,this._w=p*g*v+x*y*A;break;case"ZXY":this._x=x*g*v-p*y*A,this._y=p*y*v+x*g*A,this._z=p*g*A+x*y*v,this._w=p*g*v-x*y*A;break;case"ZYX":this._x=x*g*v-p*y*A,this._y=p*y*v+x*g*A,this._z=p*g*A-x*y*v,this._w=p*g*v+x*y*A;break;case"YZX":this._x=x*g*v+p*y*A,this._y=p*y*v+x*g*A,this._z=p*g*A-x*y*v,this._w=p*g*v-x*y*A;break;case"XZY":this._x=x*g*v-p*y*A,this._y=p*y*v-x*g*A,this._z=p*g*A+x*y*v,this._w=p*g*v+x*y*A;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+d)}return i===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,i){const r=i/2,l=Math.sin(r);return this._x=e.x*l,this._y=e.y*l,this._z=e.z*l,this._w=Math.cos(r),this._onChangeCallback(),this}setFromRotationMatrix(e){const i=e.elements,r=i[0],l=i[4],u=i[8],d=i[1],h=i[5],m=i[9],p=i[2],g=i[6],v=i[10],x=r+h+v;if(x>0){const y=.5/Math.sqrt(x+1);this._w=.25/y,this._x=(g-m)*y,this._y=(u-p)*y,this._z=(d-l)*y}else if(r>h&&r>v){const y=2*Math.sqrt(1+r-h-v);this._w=(g-m)/y,this._x=.25*y,this._y=(l+d)/y,this._z=(u+p)/y}else if(h>v){const y=2*Math.sqrt(1+h-r-v);this._w=(u-p)/y,this._x=(l+d)/y,this._y=.25*y,this._z=(m+g)/y}else{const y=2*Math.sqrt(1+v-r-h);this._w=(d-l)/y,this._x=(u+p)/y,this._y=(m+g)/y,this._z=.25*y}return this._onChangeCallback(),this}setFromUnitVectors(e,i){let r=e.dot(i)+1;return r<Number.EPSILON?(r=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=r):(this._x=0,this._y=-e.z,this._z=e.y,this._w=r)):(this._x=e.y*i.z-e.z*i.y,this._y=e.z*i.x-e.x*i.z,this._z=e.x*i.y-e.y*i.x,this._w=r),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Vn(this.dot(e),-1,1)))}rotateTowards(e,i){const r=this.angleTo(e);if(r===0)return this;const l=Math.min(1,i/r);return this.slerp(e,l),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,i){const r=e._x,l=e._y,u=e._z,d=e._w,h=i._x,m=i._y,p=i._z,g=i._w;return this._x=r*g+d*h+l*p-u*m,this._y=l*g+d*m+u*h-r*p,this._z=u*g+d*p+r*m-l*h,this._w=d*g-r*h-l*m-u*p,this._onChangeCallback(),this}slerp(e,i){if(i===0)return this;if(i===1)return this.copy(e);const r=this._x,l=this._y,u=this._z,d=this._w;let h=d*e._w+r*e._x+l*e._y+u*e._z;if(h<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,h=-h):this.copy(e),h>=1)return this._w=d,this._x=r,this._y=l,this._z=u,this;const m=1-h*h;if(m<=Number.EPSILON){const y=1-i;return this._w=y*d+i*this._w,this._x=y*r+i*this._x,this._y=y*l+i*this._y,this._z=y*u+i*this._z,this.normalize(),this}const p=Math.sqrt(m),g=Math.atan2(p,h),v=Math.sin((1-i)*g)/p,x=Math.sin(i*g)/p;return this._w=d*v+this._w*x,this._x=r*v+this._x*x,this._y=l*v+this._y*x,this._z=u*v+this._z*x,this._onChangeCallback(),this}slerpQuaternions(e,i,r){return this.copy(e).slerp(i,r)}random(){const e=Math.random(),i=Math.sqrt(1-e),r=Math.sqrt(e),l=2*Math.PI*Math.random(),u=2*Math.PI*Math.random();return this.set(i*Math.cos(l),r*Math.sin(u),r*Math.cos(u),i*Math.sin(l))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,i=0){return this._x=e[i],this._y=e[i+1],this._z=e[i+2],this._w=e[i+3],this._onChangeCallback(),this}toArray(e=[],i=0){return e[i]=this._x,e[i+1]=this._y,e[i+2]=this._z,e[i+3]=this._w,e}fromBufferAttribute(e,i){return this._x=e.getX(i),this._y=e.getY(i),this._z=e.getZ(i),this._w=e.getW(i),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class st{constructor(e=0,i=0,r=0){st.prototype.isVector3=!0,this.x=e,this.y=i,this.z=r}set(e,i,r){return r===void 0&&(r=this.z),this.x=e,this.y=i,this.z=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,i){switch(e){case 0:this.x=i;break;case 1:this.y=i;break;case 2:this.z=i;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,i){return this.x=e.x+i.x,this.y=e.y+i.y,this.z=e.z+i.z,this}addScaledVector(e,i){return this.x+=e.x*i,this.y+=e.y*i,this.z+=e.z*i,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,i){return this.x=e.x-i.x,this.y=e.y-i.y,this.z=e.z-i.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,i){return this.x=e.x*i.x,this.y=e.y*i.y,this.z=e.z*i.z,this}applyEuler(e){return this.applyQuaternion(Qg.setFromEuler(e))}applyAxisAngle(e,i){return this.applyQuaternion(Qg.setFromAxisAngle(e,i))}applyMatrix3(e){const i=this.x,r=this.y,l=this.z,u=e.elements;return this.x=u[0]*i+u[3]*r+u[6]*l,this.y=u[1]*i+u[4]*r+u[7]*l,this.z=u[2]*i+u[5]*r+u[8]*l,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const i=this.x,r=this.y,l=this.z,u=e.elements,d=1/(u[3]*i+u[7]*r+u[11]*l+u[15]);return this.x=(u[0]*i+u[4]*r+u[8]*l+u[12])*d,this.y=(u[1]*i+u[5]*r+u[9]*l+u[13])*d,this.z=(u[2]*i+u[6]*r+u[10]*l+u[14])*d,this}applyQuaternion(e){const i=this.x,r=this.y,l=this.z,u=e.x,d=e.y,h=e.z,m=e.w,p=2*(d*l-h*r),g=2*(h*i-u*l),v=2*(u*r-d*i);return this.x=i+m*p+d*v-h*g,this.y=r+m*g+h*p-u*v,this.z=l+m*v+u*g-d*p,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const i=this.x,r=this.y,l=this.z,u=e.elements;return this.x=u[0]*i+u[4]*r+u[8]*l,this.y=u[1]*i+u[5]*r+u[9]*l,this.z=u[2]*i+u[6]*r+u[10]*l,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,i){return this.x=Math.max(e.x,Math.min(i.x,this.x)),this.y=Math.max(e.y,Math.min(i.y,this.y)),this.z=Math.max(e.z,Math.min(i.z,this.z)),this}clampScalar(e,i){return this.x=Math.max(e,Math.min(i,this.x)),this.y=Math.max(e,Math.min(i,this.y)),this.z=Math.max(e,Math.min(i,this.z)),this}clampLength(e,i){const r=this.length();return this.divideScalar(r||1).multiplyScalar(Math.max(e,Math.min(i,r)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,i){return this.x+=(e.x-this.x)*i,this.y+=(e.y-this.y)*i,this.z+=(e.z-this.z)*i,this}lerpVectors(e,i,r){return this.x=e.x+(i.x-e.x)*r,this.y=e.y+(i.y-e.y)*r,this.z=e.z+(i.z-e.z)*r,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,i){const r=e.x,l=e.y,u=e.z,d=i.x,h=i.y,m=i.z;return this.x=l*m-u*h,this.y=u*d-r*m,this.z=r*h-l*d,this}projectOnVector(e){const i=e.lengthSq();if(i===0)return this.set(0,0,0);const r=e.dot(this)/i;return this.copy(e).multiplyScalar(r)}projectOnPlane(e){return kf.copy(this).projectOnVector(e),this.sub(kf)}reflect(e){return this.sub(kf.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const i=Math.sqrt(this.lengthSq()*e.lengthSq());if(i===0)return Math.PI/2;const r=this.dot(e)/i;return Math.acos(Vn(r,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const i=this.x-e.x,r=this.y-e.y,l=this.z-e.z;return i*i+r*r+l*l}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,i,r){const l=Math.sin(i)*e;return this.x=l*Math.sin(r),this.y=Math.cos(i)*e,this.z=l*Math.cos(r),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,i,r){return this.x=e*Math.sin(i),this.y=r,this.z=e*Math.cos(i),this}setFromMatrixPosition(e){const i=e.elements;return this.x=i[12],this.y=i[13],this.z=i[14],this}setFromMatrixScale(e){const i=this.setFromMatrixColumn(e,0).length(),r=this.setFromMatrixColumn(e,1).length(),l=this.setFromMatrixColumn(e,2).length();return this.x=i,this.y=r,this.z=l,this}setFromMatrixColumn(e,i){return this.fromArray(e.elements,i*4)}setFromMatrix3Column(e,i){return this.fromArray(e.elements,i*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,i=0){return this.x=e[i],this.y=e[i+1],this.z=e[i+2],this}toArray(e=[],i=0){return e[i]=this.x,e[i+1]=this.y,e[i+2]=this.z,e}fromBufferAttribute(e,i){return this.x=e.getX(i),this.y=e.getY(i),this.z=e.getZ(i),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=(Math.random()-.5)*2,i=Math.random()*Math.PI*2,r=Math.sqrt(1-e**2);return this.x=r*Math.cos(i),this.y=r*Math.sin(i),this.z=e,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const kf=new st,Qg=new Co;class Do{constructor(e=new st(1/0,1/0,1/0),i=new st(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=i}set(e,i){return this.min.copy(e),this.max.copy(i),this}setFromArray(e){this.makeEmpty();for(let i=0,r=e.length;i<r;i+=3)this.expandByPoint(vi.fromArray(e,i));return this}setFromBufferAttribute(e){this.makeEmpty();for(let i=0,r=e.count;i<r;i++)this.expandByPoint(vi.fromBufferAttribute(e,i));return this}setFromPoints(e){this.makeEmpty();for(let i=0,r=e.length;i<r;i++)this.expandByPoint(e[i]);return this}setFromCenterAndSize(e,i){const r=vi.copy(i).multiplyScalar(.5);return this.min.copy(e).sub(r),this.max.copy(e).add(r),this}setFromObject(e,i=!1){return this.makeEmpty(),this.expandByObject(e,i)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,i=!1){e.updateWorldMatrix(!1,!1);const r=e.geometry;if(r!==void 0){const u=r.getAttribute("position");if(i===!0&&u!==void 0&&e.isInstancedMesh!==!0)for(let d=0,h=u.count;d<h;d++)e.isMesh===!0?e.getVertexPosition(d,vi):vi.fromBufferAttribute(u,d),vi.applyMatrix4(e.matrixWorld),this.expandByPoint(vi);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Gl.copy(e.boundingBox)):(r.boundingBox===null&&r.computeBoundingBox(),Gl.copy(r.boundingBox)),Gl.applyMatrix4(e.matrixWorld),this.union(Gl)}const l=e.children;for(let u=0,d=l.length;u<d;u++)this.expandByObject(l[u],i);return this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,i){return i.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return this.clampPoint(e.center,vi),vi.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let i,r;return e.normal.x>0?(i=e.normal.x*this.min.x,r=e.normal.x*this.max.x):(i=e.normal.x*this.max.x,r=e.normal.x*this.min.x),e.normal.y>0?(i+=e.normal.y*this.min.y,r+=e.normal.y*this.max.y):(i+=e.normal.y*this.max.y,r+=e.normal.y*this.min.y),e.normal.z>0?(i+=e.normal.z*this.min.z,r+=e.normal.z*this.max.z):(i+=e.normal.z*this.max.z,r+=e.normal.z*this.min.z),i<=-e.constant&&r>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(So),Vl.subVectors(this.max,So),Kr.subVectors(e.a,So),Qr.subVectors(e.b,So),Jr.subVectors(e.c,So),Ta.subVectors(Qr,Kr),ba.subVectors(Jr,Qr),er.subVectors(Kr,Jr);let i=[0,-Ta.z,Ta.y,0,-ba.z,ba.y,0,-er.z,er.y,Ta.z,0,-Ta.x,ba.z,0,-ba.x,er.z,0,-er.x,-Ta.y,Ta.x,0,-ba.y,ba.x,0,-er.y,er.x,0];return!Xf(i,Kr,Qr,Jr,Vl)||(i=[1,0,0,0,1,0,0,0,1],!Xf(i,Kr,Qr,Jr,Vl))?!1:(kl.crossVectors(Ta,ba),i=[kl.x,kl.y,kl.z],Xf(i,Kr,Qr,Jr,Vl))}clampPoint(e,i){return i.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,vi).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(vi).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Wi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Wi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Wi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Wi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Wi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Wi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Wi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Wi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Wi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const Wi=[new st,new st,new st,new st,new st,new st,new st,new st],vi=new st,Gl=new Do,Kr=new st,Qr=new st,Jr=new st,Ta=new st,ba=new st,er=new st,So=new st,Vl=new st,kl=new st,nr=new st;function Xf(o,e,i,r,l){for(let u=0,d=o.length-3;u<=d;u+=3){nr.fromArray(o,u);const h=l.x*Math.abs(nr.x)+l.y*Math.abs(nr.y)+l.z*Math.abs(nr.z),m=e.dot(nr),p=i.dot(nr),g=r.dot(nr);if(Math.max(-Math.max(m,p,g),Math.min(m,p,g))>h)return!1}return!0}const Bx=new Do,xo=new st,Wf=new st;class Mc{constructor(e=new st,i=-1){this.isSphere=!0,this.center=e,this.radius=i}set(e,i){return this.center.copy(e),this.radius=i,this}setFromPoints(e,i){const r=this.center;i!==void 0?r.copy(i):Bx.setFromPoints(e).getCenter(r);let l=0;for(let u=0,d=e.length;u<d;u++)l=Math.max(l,r.distanceToSquared(e[u]));return this.radius=Math.sqrt(l),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const i=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=i*i}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,i){const r=this.center.distanceToSquared(e);return i.copy(e),r>this.radius*this.radius&&(i.sub(this.center).normalize(),i.multiplyScalar(this.radius).add(this.center)),i}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;xo.subVectors(e,this.center);const i=xo.lengthSq();if(i>this.radius*this.radius){const r=Math.sqrt(i),l=(r-this.radius)*.5;this.center.addScaledVector(xo,l/r),this.radius+=l}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Wf.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(xo.copy(e.center).add(Wf)),this.expandByPoint(xo.copy(e.center).sub(Wf))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const qi=new st,qf=new st,Xl=new st,Aa=new st,Yf=new st,Wl=new st,jf=new st;class $_{constructor(e=new st,i=new st(0,0,-1)){this.origin=e,this.direction=i}set(e,i){return this.origin.copy(e),this.direction.copy(i),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,i){return i.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,qi)),this}closestPointToPoint(e,i){i.subVectors(e,this.origin);const r=i.dot(this.direction);return r<0?i.copy(this.origin):i.copy(this.origin).addScaledVector(this.direction,r)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const i=qi.subVectors(e,this.origin).dot(this.direction);return i<0?this.origin.distanceToSquared(e):(qi.copy(this.origin).addScaledVector(this.direction,i),qi.distanceToSquared(e))}distanceSqToSegment(e,i,r,l){qf.copy(e).add(i).multiplyScalar(.5),Xl.copy(i).sub(e).normalize(),Aa.copy(this.origin).sub(qf);const u=e.distanceTo(i)*.5,d=-this.direction.dot(Xl),h=Aa.dot(this.direction),m=-Aa.dot(Xl),p=Aa.lengthSq(),g=Math.abs(1-d*d);let v,x,y,A;if(g>0)if(v=d*m-h,x=d*h-m,A=u*g,v>=0)if(x>=-A)if(x<=A){const b=1/g;v*=b,x*=b,y=v*(v+d*x+2*h)+x*(d*v+x+2*m)+p}else x=u,v=Math.max(0,-(d*x+h)),y=-v*v+x*(x+2*m)+p;else x=-u,v=Math.max(0,-(d*x+h)),y=-v*v+x*(x+2*m)+p;else x<=-A?(v=Math.max(0,-(-d*u+h)),x=v>0?-u:Math.min(Math.max(-u,-m),u),y=-v*v+x*(x+2*m)+p):x<=A?(v=0,x=Math.min(Math.max(-u,-m),u),y=x*(x+2*m)+p):(v=Math.max(0,-(d*u+h)),x=v>0?u:Math.min(Math.max(-u,-m),u),y=-v*v+x*(x+2*m)+p);else x=d>0?-u:u,v=Math.max(0,-(d*x+h)),y=-v*v+x*(x+2*m)+p;return r&&r.copy(this.origin).addScaledVector(this.direction,v),l&&l.copy(qf).addScaledVector(Xl,x),y}intersectSphere(e,i){qi.subVectors(e.center,this.origin);const r=qi.dot(this.direction),l=qi.dot(qi)-r*r,u=e.radius*e.radius;if(l>u)return null;const d=Math.sqrt(u-l),h=r-d,m=r+d;return m<0?null:h<0?this.at(m,i):this.at(h,i)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const i=e.normal.dot(this.direction);if(i===0)return e.distanceToPoint(this.origin)===0?0:null;const r=-(this.origin.dot(e.normal)+e.constant)/i;return r>=0?r:null}intersectPlane(e,i){const r=this.distanceToPlane(e);return r===null?null:this.at(r,i)}intersectsPlane(e){const i=e.distanceToPoint(this.origin);return i===0||e.normal.dot(this.direction)*i<0}intersectBox(e,i){let r,l,u,d,h,m;const p=1/this.direction.x,g=1/this.direction.y,v=1/this.direction.z,x=this.origin;return p>=0?(r=(e.min.x-x.x)*p,l=(e.max.x-x.x)*p):(r=(e.max.x-x.x)*p,l=(e.min.x-x.x)*p),g>=0?(u=(e.min.y-x.y)*g,d=(e.max.y-x.y)*g):(u=(e.max.y-x.y)*g,d=(e.min.y-x.y)*g),r>d||u>l||((u>r||isNaN(r))&&(r=u),(d<l||isNaN(l))&&(l=d),v>=0?(h=(e.min.z-x.z)*v,m=(e.max.z-x.z)*v):(h=(e.max.z-x.z)*v,m=(e.min.z-x.z)*v),r>m||h>l)||((h>r||r!==r)&&(r=h),(m<l||l!==l)&&(l=m),l<0)?null:this.at(r>=0?r:l,i)}intersectsBox(e){return this.intersectBox(e,qi)!==null}intersectTriangle(e,i,r,l,u){Yf.subVectors(i,e),Wl.subVectors(r,e),jf.crossVectors(Yf,Wl);let d=this.direction.dot(jf),h;if(d>0){if(l)return null;h=1}else if(d<0)h=-1,d=-d;else return null;Aa.subVectors(this.origin,e);const m=h*this.direction.dot(Wl.crossVectors(Aa,Wl));if(m<0)return null;const p=h*this.direction.dot(Yf.cross(Aa));if(p<0||m+p>d)return null;const g=-h*Aa.dot(jf);return g<0?null:this.at(g/d,u)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class _n{constructor(e,i,r,l,u,d,h,m,p,g,v,x,y,A,b,S){_n.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,i,r,l,u,d,h,m,p,g,v,x,y,A,b,S)}set(e,i,r,l,u,d,h,m,p,g,v,x,y,A,b,S){const _=this.elements;return _[0]=e,_[4]=i,_[8]=r,_[12]=l,_[1]=u,_[5]=d,_[9]=h,_[13]=m,_[2]=p,_[6]=g,_[10]=v,_[14]=x,_[3]=y,_[7]=A,_[11]=b,_[15]=S,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new _n().fromArray(this.elements)}copy(e){const i=this.elements,r=e.elements;return i[0]=r[0],i[1]=r[1],i[2]=r[2],i[3]=r[3],i[4]=r[4],i[5]=r[5],i[6]=r[6],i[7]=r[7],i[8]=r[8],i[9]=r[9],i[10]=r[10],i[11]=r[11],i[12]=r[12],i[13]=r[13],i[14]=r[14],i[15]=r[15],this}copyPosition(e){const i=this.elements,r=e.elements;return i[12]=r[12],i[13]=r[13],i[14]=r[14],this}setFromMatrix3(e){const i=e.elements;return this.set(i[0],i[3],i[6],0,i[1],i[4],i[7],0,i[2],i[5],i[8],0,0,0,0,1),this}extractBasis(e,i,r){return e.setFromMatrixColumn(this,0),i.setFromMatrixColumn(this,1),r.setFromMatrixColumn(this,2),this}makeBasis(e,i,r){return this.set(e.x,i.x,r.x,0,e.y,i.y,r.y,0,e.z,i.z,r.z,0,0,0,0,1),this}extractRotation(e){const i=this.elements,r=e.elements,l=1/$r.setFromMatrixColumn(e,0).length(),u=1/$r.setFromMatrixColumn(e,1).length(),d=1/$r.setFromMatrixColumn(e,2).length();return i[0]=r[0]*l,i[1]=r[1]*l,i[2]=r[2]*l,i[3]=0,i[4]=r[4]*u,i[5]=r[5]*u,i[6]=r[6]*u,i[7]=0,i[8]=r[8]*d,i[9]=r[9]*d,i[10]=r[10]*d,i[11]=0,i[12]=0,i[13]=0,i[14]=0,i[15]=1,this}makeRotationFromEuler(e){const i=this.elements,r=e.x,l=e.y,u=e.z,d=Math.cos(r),h=Math.sin(r),m=Math.cos(l),p=Math.sin(l),g=Math.cos(u),v=Math.sin(u);if(e.order==="XYZ"){const x=d*g,y=d*v,A=h*g,b=h*v;i[0]=m*g,i[4]=-m*v,i[8]=p,i[1]=y+A*p,i[5]=x-b*p,i[9]=-h*m,i[2]=b-x*p,i[6]=A+y*p,i[10]=d*m}else if(e.order==="YXZ"){const x=m*g,y=m*v,A=p*g,b=p*v;i[0]=x+b*h,i[4]=A*h-y,i[8]=d*p,i[1]=d*v,i[5]=d*g,i[9]=-h,i[2]=y*h-A,i[6]=b+x*h,i[10]=d*m}else if(e.order==="ZXY"){const x=m*g,y=m*v,A=p*g,b=p*v;i[0]=x-b*h,i[4]=-d*v,i[8]=A+y*h,i[1]=y+A*h,i[5]=d*g,i[9]=b-x*h,i[2]=-d*p,i[6]=h,i[10]=d*m}else if(e.order==="ZYX"){const x=d*g,y=d*v,A=h*g,b=h*v;i[0]=m*g,i[4]=A*p-y,i[8]=x*p+b,i[1]=m*v,i[5]=b*p+x,i[9]=y*p-A,i[2]=-p,i[6]=h*m,i[10]=d*m}else if(e.order==="YZX"){const x=d*m,y=d*p,A=h*m,b=h*p;i[0]=m*g,i[4]=b-x*v,i[8]=A*v+y,i[1]=v,i[5]=d*g,i[9]=-h*g,i[2]=-p*g,i[6]=y*v+A,i[10]=x-b*v}else if(e.order==="XZY"){const x=d*m,y=d*p,A=h*m,b=h*p;i[0]=m*g,i[4]=-v,i[8]=p*g,i[1]=x*v+b,i[5]=d*g,i[9]=y*v-A,i[2]=A*v-y,i[6]=h*g,i[10]=b*v+x}return i[3]=0,i[7]=0,i[11]=0,i[12]=0,i[13]=0,i[14]=0,i[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Ix,e,Fx)}lookAt(e,i,r){const l=this.elements;return Jn.subVectors(e,i),Jn.lengthSq()===0&&(Jn.z=1),Jn.normalize(),Ra.crossVectors(r,Jn),Ra.lengthSq()===0&&(Math.abs(r.z)===1?Jn.x+=1e-4:Jn.z+=1e-4,Jn.normalize(),Ra.crossVectors(r,Jn)),Ra.normalize(),ql.crossVectors(Jn,Ra),l[0]=Ra.x,l[4]=ql.x,l[8]=Jn.x,l[1]=Ra.y,l[5]=ql.y,l[9]=Jn.y,l[2]=Ra.z,l[6]=ql.z,l[10]=Jn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,i){const r=e.elements,l=i.elements,u=this.elements,d=r[0],h=r[4],m=r[8],p=r[12],g=r[1],v=r[5],x=r[9],y=r[13],A=r[2],b=r[6],S=r[10],_=r[14],P=r[3],L=r[7],O=r[11],k=r[15],F=l[0],B=l[4],pt=l[8],w=l[12],U=l[1],lt=l[5],ut=l[9],Et=l[13],X=l[2],J=l[6],N=l[10],q=l[14],K=l[3],ct=l[7],R=l[11],V=l[15];return u[0]=d*F+h*U+m*X+p*K,u[4]=d*B+h*lt+m*J+p*ct,u[8]=d*pt+h*ut+m*N+p*R,u[12]=d*w+h*Et+m*q+p*V,u[1]=g*F+v*U+x*X+y*K,u[5]=g*B+v*lt+x*J+y*ct,u[9]=g*pt+v*ut+x*N+y*R,u[13]=g*w+v*Et+x*q+y*V,u[2]=A*F+b*U+S*X+_*K,u[6]=A*B+b*lt+S*J+_*ct,u[10]=A*pt+b*ut+S*N+_*R,u[14]=A*w+b*Et+S*q+_*V,u[3]=P*F+L*U+O*X+k*K,u[7]=P*B+L*lt+O*J+k*ct,u[11]=P*pt+L*ut+O*N+k*R,u[15]=P*w+L*Et+O*q+k*V,this}multiplyScalar(e){const i=this.elements;return i[0]*=e,i[4]*=e,i[8]*=e,i[12]*=e,i[1]*=e,i[5]*=e,i[9]*=e,i[13]*=e,i[2]*=e,i[6]*=e,i[10]*=e,i[14]*=e,i[3]*=e,i[7]*=e,i[11]*=e,i[15]*=e,this}determinant(){const e=this.elements,i=e[0],r=e[4],l=e[8],u=e[12],d=e[1],h=e[5],m=e[9],p=e[13],g=e[2],v=e[6],x=e[10],y=e[14],A=e[3],b=e[7],S=e[11],_=e[15];return A*(+u*m*v-l*p*v-u*h*x+r*p*x+l*h*y-r*m*y)+b*(+i*m*y-i*p*x+u*d*x-l*d*y+l*p*g-u*m*g)+S*(+i*p*v-i*h*y-u*d*v+r*d*y+u*h*g-r*p*g)+_*(-l*h*g-i*m*v+i*h*x+l*d*v-r*d*x+r*m*g)}transpose(){const e=this.elements;let i;return i=e[1],e[1]=e[4],e[4]=i,i=e[2],e[2]=e[8],e[8]=i,i=e[6],e[6]=e[9],e[9]=i,i=e[3],e[3]=e[12],e[12]=i,i=e[7],e[7]=e[13],e[13]=i,i=e[11],e[11]=e[14],e[14]=i,this}setPosition(e,i,r){const l=this.elements;return e.isVector3?(l[12]=e.x,l[13]=e.y,l[14]=e.z):(l[12]=e,l[13]=i,l[14]=r),this}invert(){const e=this.elements,i=e[0],r=e[1],l=e[2],u=e[3],d=e[4],h=e[5],m=e[6],p=e[7],g=e[8],v=e[9],x=e[10],y=e[11],A=e[12],b=e[13],S=e[14],_=e[15],P=v*S*p-b*x*p+b*m*y-h*S*y-v*m*_+h*x*_,L=A*x*p-g*S*p-A*m*y+d*S*y+g*m*_-d*x*_,O=g*b*p-A*v*p+A*h*y-d*b*y-g*h*_+d*v*_,k=A*v*m-g*b*m-A*h*x+d*b*x+g*h*S-d*v*S,F=i*P+r*L+l*O+u*k;if(F===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const B=1/F;return e[0]=P*B,e[1]=(b*x*u-v*S*u-b*l*y+r*S*y+v*l*_-r*x*_)*B,e[2]=(h*S*u-b*m*u+b*l*p-r*S*p-h*l*_+r*m*_)*B,e[3]=(v*m*u-h*x*u-v*l*p+r*x*p+h*l*y-r*m*y)*B,e[4]=L*B,e[5]=(g*S*u-A*x*u+A*l*y-i*S*y-g*l*_+i*x*_)*B,e[6]=(A*m*u-d*S*u-A*l*p+i*S*p+d*l*_-i*m*_)*B,e[7]=(d*x*u-g*m*u+g*l*p-i*x*p-d*l*y+i*m*y)*B,e[8]=O*B,e[9]=(A*v*u-g*b*u-A*r*y+i*b*y+g*r*_-i*v*_)*B,e[10]=(d*b*u-A*h*u+A*r*p-i*b*p-d*r*_+i*h*_)*B,e[11]=(g*h*u-d*v*u-g*r*p+i*v*p+d*r*y-i*h*y)*B,e[12]=k*B,e[13]=(g*b*l-A*v*l+A*r*x-i*b*x-g*r*S+i*v*S)*B,e[14]=(A*h*l-d*b*l-A*r*m+i*b*m+d*r*S-i*h*S)*B,e[15]=(d*v*l-g*h*l+g*r*m-i*v*m-d*r*x+i*h*x)*B,this}scale(e){const i=this.elements,r=e.x,l=e.y,u=e.z;return i[0]*=r,i[4]*=l,i[8]*=u,i[1]*=r,i[5]*=l,i[9]*=u,i[2]*=r,i[6]*=l,i[10]*=u,i[3]*=r,i[7]*=l,i[11]*=u,this}getMaxScaleOnAxis(){const e=this.elements,i=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],r=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],l=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(i,r,l))}makeTranslation(e,i,r){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,i,0,0,1,r,0,0,0,1),this}makeRotationX(e){const i=Math.cos(e),r=Math.sin(e);return this.set(1,0,0,0,0,i,-r,0,0,r,i,0,0,0,0,1),this}makeRotationY(e){const i=Math.cos(e),r=Math.sin(e);return this.set(i,0,r,0,0,1,0,0,-r,0,i,0,0,0,0,1),this}makeRotationZ(e){const i=Math.cos(e),r=Math.sin(e);return this.set(i,-r,0,0,r,i,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,i){const r=Math.cos(i),l=Math.sin(i),u=1-r,d=e.x,h=e.y,m=e.z,p=u*d,g=u*h;return this.set(p*d+r,p*h-l*m,p*m+l*h,0,p*h+l*m,g*h+r,g*m-l*d,0,p*m-l*h,g*m+l*d,u*m*m+r,0,0,0,0,1),this}makeScale(e,i,r){return this.set(e,0,0,0,0,i,0,0,0,0,r,0,0,0,0,1),this}makeShear(e,i,r,l,u,d){return this.set(1,r,u,0,e,1,d,0,i,l,1,0,0,0,0,1),this}compose(e,i,r){const l=this.elements,u=i._x,d=i._y,h=i._z,m=i._w,p=u+u,g=d+d,v=h+h,x=u*p,y=u*g,A=u*v,b=d*g,S=d*v,_=h*v,P=m*p,L=m*g,O=m*v,k=r.x,F=r.y,B=r.z;return l[0]=(1-(b+_))*k,l[1]=(y+O)*k,l[2]=(A-L)*k,l[3]=0,l[4]=(y-O)*F,l[5]=(1-(x+_))*F,l[6]=(S+P)*F,l[7]=0,l[8]=(A+L)*B,l[9]=(S-P)*B,l[10]=(1-(x+b))*B,l[11]=0,l[12]=e.x,l[13]=e.y,l[14]=e.z,l[15]=1,this}decompose(e,i,r){const l=this.elements;let u=$r.set(l[0],l[1],l[2]).length();const d=$r.set(l[4],l[5],l[6]).length(),h=$r.set(l[8],l[9],l[10]).length();this.determinant()<0&&(u=-u),e.x=l[12],e.y=l[13],e.z=l[14],Si.copy(this);const p=1/u,g=1/d,v=1/h;return Si.elements[0]*=p,Si.elements[1]*=p,Si.elements[2]*=p,Si.elements[4]*=g,Si.elements[5]*=g,Si.elements[6]*=g,Si.elements[8]*=v,Si.elements[9]*=v,Si.elements[10]*=v,i.setFromRotationMatrix(Si),r.x=u,r.y=d,r.z=h,this}makePerspective(e,i,r,l,u,d,h=Ji){const m=this.elements,p=2*u/(i-e),g=2*u/(r-l),v=(i+e)/(i-e),x=(r+l)/(r-l);let y,A;if(h===Ji)y=-(d+u)/(d-u),A=-2*d*u/(d-u);else if(h===_c)y=-d/(d-u),A=-d*u/(d-u);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+h);return m[0]=p,m[4]=0,m[8]=v,m[12]=0,m[1]=0,m[5]=g,m[9]=x,m[13]=0,m[2]=0,m[6]=0,m[10]=y,m[14]=A,m[3]=0,m[7]=0,m[11]=-1,m[15]=0,this}makeOrthographic(e,i,r,l,u,d,h=Ji){const m=this.elements,p=1/(i-e),g=1/(r-l),v=1/(d-u),x=(i+e)*p,y=(r+l)*g;let A,b;if(h===Ji)A=(d+u)*v,b=-2*v;else if(h===_c)A=u*v,b=-1*v;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+h);return m[0]=2*p,m[4]=0,m[8]=0,m[12]=-x,m[1]=0,m[5]=2*g,m[9]=0,m[13]=-y,m[2]=0,m[6]=0,m[10]=b,m[14]=-A,m[3]=0,m[7]=0,m[11]=0,m[15]=1,this}equals(e){const i=this.elements,r=e.elements;for(let l=0;l<16;l++)if(i[l]!==r[l])return!1;return!0}fromArray(e,i=0){for(let r=0;r<16;r++)this.elements[r]=e[r+i];return this}toArray(e=[],i=0){const r=this.elements;return e[i]=r[0],e[i+1]=r[1],e[i+2]=r[2],e[i+3]=r[3],e[i+4]=r[4],e[i+5]=r[5],e[i+6]=r[6],e[i+7]=r[7],e[i+8]=r[8],e[i+9]=r[9],e[i+10]=r[10],e[i+11]=r[11],e[i+12]=r[12],e[i+13]=r[13],e[i+14]=r[14],e[i+15]=r[15],e}}const $r=new st,Si=new _n,Ix=new st(0,0,0),Fx=new st(1,1,1),Ra=new st,ql=new st,Jn=new st,Jg=new _n,$g=new Co;class yc{constructor(e=0,i=0,r=0,l=yc.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=i,this._z=r,this._order=l}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,i,r,l=this._order){return this._x=e,this._y=i,this._z=r,this._order=l,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,i=this._order,r=!0){const l=e.elements,u=l[0],d=l[4],h=l[8],m=l[1],p=l[5],g=l[9],v=l[2],x=l[6],y=l[10];switch(i){case"XYZ":this._y=Math.asin(Vn(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(-g,y),this._z=Math.atan2(-d,u)):(this._x=Math.atan2(x,p),this._z=0);break;case"YXZ":this._x=Math.asin(-Vn(g,-1,1)),Math.abs(g)<.9999999?(this._y=Math.atan2(h,y),this._z=Math.atan2(m,p)):(this._y=Math.atan2(-v,u),this._z=0);break;case"ZXY":this._x=Math.asin(Vn(x,-1,1)),Math.abs(x)<.9999999?(this._y=Math.atan2(-v,y),this._z=Math.atan2(-d,p)):(this._y=0,this._z=Math.atan2(m,u));break;case"ZYX":this._y=Math.asin(-Vn(v,-1,1)),Math.abs(v)<.9999999?(this._x=Math.atan2(x,y),this._z=Math.atan2(m,u)):(this._x=0,this._z=Math.atan2(-d,p));break;case"YZX":this._z=Math.asin(Vn(m,-1,1)),Math.abs(m)<.9999999?(this._x=Math.atan2(-g,p),this._y=Math.atan2(-v,u)):(this._x=0,this._y=Math.atan2(h,y));break;case"XZY":this._z=Math.asin(-Vn(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(x,p),this._y=Math.atan2(h,u)):(this._x=Math.atan2(-g,y),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+i)}return this._order=i,r===!0&&this._onChangeCallback(),this}setFromQuaternion(e,i,r){return Jg.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Jg,i,r)}setFromVector3(e,i=this._order){return this.set(e.x,e.y,e.z,i)}reorder(e){return $g.setFromEuler(this),this.setFromQuaternion($g,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],i=0){return e[i]=this._x,e[i+1]=this._y,e[i+2]=this._z,e[i+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}yc.DEFAULT_ORDER="XYZ";class tv{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Hx=0;const t_=new st,ts=new Co,Yi=new _n,Yl=new st,Mo=new st,Gx=new st,Vx=new Co,e_=new st(1,0,0),n_=new st(0,1,0),i_=new st(0,0,1),kx={type:"added"},Xx={type:"removed"};class Xn extends vs{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Hx++}),this.uuid=wo(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Xn.DEFAULT_UP.clone();const e=new st,i=new yc,r=new Co,l=new st(1,1,1);function u(){r.setFromEuler(i,!1)}function d(){i.setFromQuaternion(r,void 0,!1)}i._onChange(u),r._onChange(d),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:i},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:l},modelViewMatrix:{value:new _n},normalMatrix:{value:new ye}}),this.matrix=new _n,this.matrixWorld=new _n,this.matrixAutoUpdate=Xn.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Xn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new tv,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,i){this.quaternion.setFromAxisAngle(e,i)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,i){return ts.setFromAxisAngle(e,i),this.quaternion.multiply(ts),this}rotateOnWorldAxis(e,i){return ts.setFromAxisAngle(e,i),this.quaternion.premultiply(ts),this}rotateX(e){return this.rotateOnAxis(e_,e)}rotateY(e){return this.rotateOnAxis(n_,e)}rotateZ(e){return this.rotateOnAxis(i_,e)}translateOnAxis(e,i){return t_.copy(e).applyQuaternion(this.quaternion),this.position.add(t_.multiplyScalar(i)),this}translateX(e){return this.translateOnAxis(e_,e)}translateY(e){return this.translateOnAxis(n_,e)}translateZ(e){return this.translateOnAxis(i_,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Yi.copy(this.matrixWorld).invert())}lookAt(e,i,r){e.isVector3?Yl.copy(e):Yl.set(e,i,r);const l=this.parent;this.updateWorldMatrix(!0,!1),Mo.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Yi.lookAt(Mo,Yl,this.up):Yi.lookAt(Yl,Mo,this.up),this.quaternion.setFromRotationMatrix(Yi),l&&(Yi.extractRotation(l.matrixWorld),ts.setFromRotationMatrix(Yi),this.quaternion.premultiply(ts.invert()))}add(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.add(arguments[i]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.parent!==null&&e.parent.remove(e),e.parent=this,this.children.push(e),e.dispatchEvent(kx)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let r=0;r<arguments.length;r++)this.remove(arguments[r]);return this}const i=this.children.indexOf(e);return i!==-1&&(e.parent=null,this.children.splice(i,1),e.dispatchEvent(Xx)),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Yi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Yi.multiply(e.parent.matrixWorld)),e.applyMatrix4(Yi),this.add(e),e.updateWorldMatrix(!1,!0),this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,i){if(this[e]===i)return this;for(let r=0,l=this.children.length;r<l;r++){const d=this.children[r].getObjectByProperty(e,i);if(d!==void 0)return d}}getObjectsByProperty(e,i,r=[]){this[e]===i&&r.push(this);const l=this.children;for(let u=0,d=l.length;u<d;u++)l[u].getObjectsByProperty(e,i,r);return r}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Mo,e,Gx),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Mo,Vx,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const i=this.matrixWorld.elements;return e.set(i[8],i[9],i[10]).normalize()}raycast(){}traverse(e){e(this);const i=this.children;for(let r=0,l=i.length;r<l;r++)i[r].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const i=this.children;for(let r=0,l=i.length;r<l;r++)i[r].traverseVisible(e)}traverseAncestors(e){const i=this.parent;i!==null&&(e(i),i.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,e=!0);const i=this.children;for(let r=0,l=i.length;r<l;r++){const u=i[r];(u.matrixWorldAutoUpdate===!0||e===!0)&&u.updateMatrixWorld(e)}}updateWorldMatrix(e,i){const r=this.parent;if(e===!0&&r!==null&&r.matrixWorldAutoUpdate===!0&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),i===!0){const l=this.children;for(let u=0,d=l.length;u<d;u++){const h=l[u];h.matrixWorldAutoUpdate===!0&&h.updateWorldMatrix(!1,!0)}}}toJSON(e){const i=e===void 0||typeof e=="string",r={};i&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},r.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const l={};l.uuid=this.uuid,l.type=this.type,this.name!==""&&(l.name=this.name),this.castShadow===!0&&(l.castShadow=!0),this.receiveShadow===!0&&(l.receiveShadow=!0),this.visible===!1&&(l.visible=!1),this.frustumCulled===!1&&(l.frustumCulled=!1),this.renderOrder!==0&&(l.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(l.userData=this.userData),l.layers=this.layers.mask,l.matrix=this.matrix.toArray(),l.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(l.matrixAutoUpdate=!1),this.isInstancedMesh&&(l.type="InstancedMesh",l.count=this.count,l.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(l.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(l.type="BatchedMesh",l.perObjectFrustumCulled=this.perObjectFrustumCulled,l.sortObjects=this.sortObjects,l.drawRanges=this._drawRanges,l.reservedRanges=this._reservedRanges,l.visibility=this._visibility,l.active=this._active,l.bounds=this._bounds.map(h=>({boxInitialized:h.boxInitialized,boxMin:h.box.min.toArray(),boxMax:h.box.max.toArray(),sphereInitialized:h.sphereInitialized,sphereRadius:h.sphere.radius,sphereCenter:h.sphere.center.toArray()})),l.maxGeometryCount=this._maxGeometryCount,l.maxVertexCount=this._maxVertexCount,l.maxIndexCount=this._maxIndexCount,l.geometryInitialized=this._geometryInitialized,l.geometryCount=this._geometryCount,l.matricesTexture=this._matricesTexture.toJSON(e),this.boundingSphere!==null&&(l.boundingSphere={center:l.boundingSphere.center.toArray(),radius:l.boundingSphere.radius}),this.boundingBox!==null&&(l.boundingBox={min:l.boundingBox.min.toArray(),max:l.boundingBox.max.toArray()}));function u(h,m){return h[m.uuid]===void 0&&(h[m.uuid]=m.toJSON(e)),m.uuid}if(this.isScene)this.background&&(this.background.isColor?l.background=this.background.toJSON():this.background.isTexture&&(l.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(l.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){l.geometry=u(e.geometries,this.geometry);const h=this.geometry.parameters;if(h!==void 0&&h.shapes!==void 0){const m=h.shapes;if(Array.isArray(m))for(let p=0,g=m.length;p<g;p++){const v=m[p];u(e.shapes,v)}else u(e.shapes,m)}}if(this.isSkinnedMesh&&(l.bindMode=this.bindMode,l.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(u(e.skeletons,this.skeleton),l.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const h=[];for(let m=0,p=this.material.length;m<p;m++)h.push(u(e.materials,this.material[m]));l.material=h}else l.material=u(e.materials,this.material);if(this.children.length>0){l.children=[];for(let h=0;h<this.children.length;h++)l.children.push(this.children[h].toJSON(e).object)}if(this.animations.length>0){l.animations=[];for(let h=0;h<this.animations.length;h++){const m=this.animations[h];l.animations.push(u(e.animations,m))}}if(i){const h=d(e.geometries),m=d(e.materials),p=d(e.textures),g=d(e.images),v=d(e.shapes),x=d(e.skeletons),y=d(e.animations),A=d(e.nodes);h.length>0&&(r.geometries=h),m.length>0&&(r.materials=m),p.length>0&&(r.textures=p),g.length>0&&(r.images=g),v.length>0&&(r.shapes=v),x.length>0&&(r.skeletons=x),y.length>0&&(r.animations=y),A.length>0&&(r.nodes=A)}return r.object=l,r;function d(h){const m=[];for(const p in h){const g=h[p];delete g.metadata,m.push(g)}return m}}clone(e){return new this.constructor().copy(this,e)}copy(e,i=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),i===!0)for(let r=0;r<e.children.length;r++){const l=e.children[r];this.add(l.clone())}return this}}Xn.DEFAULT_UP=new st(0,1,0);Xn.DEFAULT_MATRIX_AUTO_UPDATE=!0;Xn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const xi=new st,ji=new st,Zf=new st,Zi=new st,es=new st,ns=new st,a_=new st,Kf=new st,Qf=new st,Jf=new st;let jl=!1;class Mi{constructor(e=new st,i=new st,r=new st){this.a=e,this.b=i,this.c=r}static getNormal(e,i,r,l){l.subVectors(r,i),xi.subVectors(e,i),l.cross(xi);const u=l.lengthSq();return u>0?l.multiplyScalar(1/Math.sqrt(u)):l.set(0,0,0)}static getBarycoord(e,i,r,l,u){xi.subVectors(l,i),ji.subVectors(r,i),Zf.subVectors(e,i);const d=xi.dot(xi),h=xi.dot(ji),m=xi.dot(Zf),p=ji.dot(ji),g=ji.dot(Zf),v=d*p-h*h;if(v===0)return u.set(0,0,0),null;const x=1/v,y=(p*m-h*g)*x,A=(d*g-h*m)*x;return u.set(1-y-A,A,y)}static containsPoint(e,i,r,l){return this.getBarycoord(e,i,r,l,Zi)===null?!1:Zi.x>=0&&Zi.y>=0&&Zi.x+Zi.y<=1}static getUV(e,i,r,l,u,d,h,m){return jl===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),jl=!0),this.getInterpolation(e,i,r,l,u,d,h,m)}static getInterpolation(e,i,r,l,u,d,h,m){return this.getBarycoord(e,i,r,l,Zi)===null?(m.x=0,m.y=0,"z"in m&&(m.z=0),"w"in m&&(m.w=0),null):(m.setScalar(0),m.addScaledVector(u,Zi.x),m.addScaledVector(d,Zi.y),m.addScaledVector(h,Zi.z),m)}static isFrontFacing(e,i,r,l){return xi.subVectors(r,i),ji.subVectors(e,i),xi.cross(ji).dot(l)<0}set(e,i,r){return this.a.copy(e),this.b.copy(i),this.c.copy(r),this}setFromPointsAndIndices(e,i,r,l){return this.a.copy(e[i]),this.b.copy(e[r]),this.c.copy(e[l]),this}setFromAttributeAndIndices(e,i,r,l){return this.a.fromBufferAttribute(e,i),this.b.fromBufferAttribute(e,r),this.c.fromBufferAttribute(e,l),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return xi.subVectors(this.c,this.b),ji.subVectors(this.a,this.b),xi.cross(ji).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Mi.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,i){return Mi.getBarycoord(e,this.a,this.b,this.c,i)}getUV(e,i,r,l,u){return jl===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),jl=!0),Mi.getInterpolation(e,this.a,this.b,this.c,i,r,l,u)}getInterpolation(e,i,r,l,u){return Mi.getInterpolation(e,this.a,this.b,this.c,i,r,l,u)}containsPoint(e){return Mi.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Mi.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,i){const r=this.a,l=this.b,u=this.c;let d,h;es.subVectors(l,r),ns.subVectors(u,r),Kf.subVectors(e,r);const m=es.dot(Kf),p=ns.dot(Kf);if(m<=0&&p<=0)return i.copy(r);Qf.subVectors(e,l);const g=es.dot(Qf),v=ns.dot(Qf);if(g>=0&&v<=g)return i.copy(l);const x=m*v-g*p;if(x<=0&&m>=0&&g<=0)return d=m/(m-g),i.copy(r).addScaledVector(es,d);Jf.subVectors(e,u);const y=es.dot(Jf),A=ns.dot(Jf);if(A>=0&&y<=A)return i.copy(u);const b=y*p-m*A;if(b<=0&&p>=0&&A<=0)return h=p/(p-A),i.copy(r).addScaledVector(ns,h);const S=g*A-y*v;if(S<=0&&v-g>=0&&y-A>=0)return a_.subVectors(u,l),h=(v-g)/(v-g+(y-A)),i.copy(l).addScaledVector(a_,h);const _=1/(S+b+x);return d=b*_,h=x*_,i.copy(r).addScaledVector(es,d).addScaledVector(ns,h)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const ev={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},wa={h:0,s:0,l:0},Zl={h:0,s:0,l:0};function $f(o,e,i){return i<0&&(i+=1),i>1&&(i-=1),i<1/6?o+(e-o)*6*i:i<1/2?e:i<2/3?o+(e-o)*6*(2/3-i):o}class pe{constructor(e,i,r){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,i,r)}set(e,i,r){if(i===void 0&&r===void 0){const l=e;l&&l.isColor?this.copy(l):typeof l=="number"?this.setHex(l):typeof l=="string"&&this.setStyle(l)}else this.setRGB(e,i,r);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,i=Tn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Fe.toWorkingColorSpace(this,i),this}setRGB(e,i,r,l=Fe.workingColorSpace){return this.r=e,this.g=i,this.b=r,Fe.toWorkingColorSpace(this,l),this}setHSL(e,i,r,l=Fe.workingColorSpace){if(e=Dx(e,1),i=Vn(i,0,1),r=Vn(r,0,1),i===0)this.r=this.g=this.b=r;else{const u=r<=.5?r*(1+i):r+i-r*i,d=2*r-u;this.r=$f(d,u,e+1/3),this.g=$f(d,u,e),this.b=$f(d,u,e-1/3)}return Fe.toWorkingColorSpace(this,l),this}setStyle(e,i=Tn){function r(u){u!==void 0&&parseFloat(u)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let l;if(l=/^(\w+)\(([^\)]*)\)/.exec(e)){let u;const d=l[1],h=l[2];switch(d){case"rgb":case"rgba":if(u=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(h))return r(u[4]),this.setRGB(Math.min(255,parseInt(u[1],10))/255,Math.min(255,parseInt(u[2],10))/255,Math.min(255,parseInt(u[3],10))/255,i);if(u=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(h))return r(u[4]),this.setRGB(Math.min(100,parseInt(u[1],10))/100,Math.min(100,parseInt(u[2],10))/100,Math.min(100,parseInt(u[3],10))/100,i);break;case"hsl":case"hsla":if(u=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(h))return r(u[4]),this.setHSL(parseFloat(u[1])/360,parseFloat(u[2])/100,parseFloat(u[3])/100,i);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(l=/^\#([A-Fa-f\d]+)$/.exec(e)){const u=l[1],d=u.length;if(d===3)return this.setRGB(parseInt(u.charAt(0),16)/15,parseInt(u.charAt(1),16)/15,parseInt(u.charAt(2),16)/15,i);if(d===6)return this.setHex(parseInt(u,16),i);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,i);return this}setColorName(e,i=Tn){const r=ev[e.toLowerCase()];return r!==void 0?this.setHex(r,i):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=ds(e.r),this.g=ds(e.g),this.b=ds(e.b),this}copyLinearToSRGB(e){return this.r=Gf(e.r),this.g=Gf(e.g),this.b=Gf(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Tn){return Fe.fromWorkingColorSpace(Un.copy(this),e),Math.round(Vn(Un.r*255,0,255))*65536+Math.round(Vn(Un.g*255,0,255))*256+Math.round(Vn(Un.b*255,0,255))}getHexString(e=Tn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,i=Fe.workingColorSpace){Fe.fromWorkingColorSpace(Un.copy(this),i);const r=Un.r,l=Un.g,u=Un.b,d=Math.max(r,l,u),h=Math.min(r,l,u);let m,p;const g=(h+d)/2;if(h===d)m=0,p=0;else{const v=d-h;switch(p=g<=.5?v/(d+h):v/(2-d-h),d){case r:m=(l-u)/v+(l<u?6:0);break;case l:m=(u-r)/v+2;break;case u:m=(r-l)/v+4;break}m/=6}return e.h=m,e.s=p,e.l=g,e}getRGB(e,i=Fe.workingColorSpace){return Fe.fromWorkingColorSpace(Un.copy(this),i),e.r=Un.r,e.g=Un.g,e.b=Un.b,e}getStyle(e=Tn){Fe.fromWorkingColorSpace(Un.copy(this),e);const i=Un.r,r=Un.g,l=Un.b;return e!==Tn?`color(${e} ${i.toFixed(3)} ${r.toFixed(3)} ${l.toFixed(3)})`:`rgb(${Math.round(i*255)},${Math.round(r*255)},${Math.round(l*255)})`}offsetHSL(e,i,r){return this.getHSL(wa),this.setHSL(wa.h+e,wa.s+i,wa.l+r)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,i){return this.r=e.r+i.r,this.g=e.g+i.g,this.b=e.b+i.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,i){return this.r+=(e.r-this.r)*i,this.g+=(e.g-this.g)*i,this.b+=(e.b-this.b)*i,this}lerpColors(e,i,r){return this.r=e.r+(i.r-e.r)*r,this.g=e.g+(i.g-e.g)*r,this.b=e.b+(i.b-e.b)*r,this}lerpHSL(e,i){this.getHSL(wa),e.getHSL(Zl);const r=Ff(wa.h,Zl.h,i),l=Ff(wa.s,Zl.s,i),u=Ff(wa.l,Zl.l,i);return this.setHSL(r,l,u),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const i=this.r,r=this.g,l=this.b,u=e.elements;return this.r=u[0]*i+u[3]*r+u[6]*l,this.g=u[1]*i+u[4]*r+u[7]*l,this.b=u[2]*i+u[5]*r+u[8]*l,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,i=0){return this.r=e[i],this.g=e[i+1],this.b=e[i+2],this}toArray(e=[],i=0){return e[i]=this.r,e[i+1]=this.g,e[i+2]=this.b,e}fromBufferAttribute(e,i){return this.r=e.getX(i),this.g=e.getY(i),this.b=e.getZ(i),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Un=new pe;pe.NAMES=ev;let Wx=0;class Lo extends vs{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Wx++}),this.uuid=wo(),this.name="",this.type="Material",this.blending=hs,this.side=Pa,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=hh,this.blendDst=dh,this.blendEquation=or,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new pe(0,0,0),this.blendAlpha=0,this.depthFunc=dc,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Xg,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=jr,this.stencilZFail=jr,this.stencilZPass=jr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const i in e){const r=e[i];if(r===void 0){console.warn(`THREE.Material: parameter '${i}' has value of undefined.`);continue}const l=this[i];if(l===void 0){console.warn(`THREE.Material: '${i}' is not a property of THREE.${this.type}.`);continue}l&&l.isColor?l.set(r):l&&l.isVector3&&r&&r.isVector3?l.copy(r):this[i]=r}}toJSON(e){const i=e===void 0||typeof e=="string";i&&(e={textures:{},images:{}});const r={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.color&&this.color.isColor&&(r.color=this.color.getHex()),this.roughness!==void 0&&(r.roughness=this.roughness),this.metalness!==void 0&&(r.metalness=this.metalness),this.sheen!==void 0&&(r.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(r.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(r.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(r.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(r.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(r.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(r.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(r.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(r.shininess=this.shininess),this.clearcoat!==void 0&&(r.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(r.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(r.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(r.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(r.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,r.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(r.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(r.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(r.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(r.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(r.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(r.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(r.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(r.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(r.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(r.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(r.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(r.lightMap=this.lightMap.toJSON(e).uuid,r.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(r.aoMap=this.aoMap.toJSON(e).uuid,r.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(r.bumpMap=this.bumpMap.toJSON(e).uuid,r.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(r.normalMap=this.normalMap.toJSON(e).uuid,r.normalMapType=this.normalMapType,r.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(r.displacementMap=this.displacementMap.toJSON(e).uuid,r.displacementScale=this.displacementScale,r.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(r.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(r.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(r.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(r.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(r.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(r.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(r.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(r.combine=this.combine)),this.envMapIntensity!==void 0&&(r.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(r.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(r.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(r.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(r.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(r.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(r.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(r.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(r.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(r.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(r.size=this.size),this.shadowSide!==null&&(r.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(r.sizeAttenuation=this.sizeAttenuation),this.blending!==hs&&(r.blending=this.blending),this.side!==Pa&&(r.side=this.side),this.vertexColors===!0&&(r.vertexColors=!0),this.opacity<1&&(r.opacity=this.opacity),this.transparent===!0&&(r.transparent=!0),this.blendSrc!==hh&&(r.blendSrc=this.blendSrc),this.blendDst!==dh&&(r.blendDst=this.blendDst),this.blendEquation!==or&&(r.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(r.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(r.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(r.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(r.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(r.blendAlpha=this.blendAlpha),this.depthFunc!==dc&&(r.depthFunc=this.depthFunc),this.depthTest===!1&&(r.depthTest=this.depthTest),this.depthWrite===!1&&(r.depthWrite=this.depthWrite),this.colorWrite===!1&&(r.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(r.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Xg&&(r.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(r.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(r.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==jr&&(r.stencilFail=this.stencilFail),this.stencilZFail!==jr&&(r.stencilZFail=this.stencilZFail),this.stencilZPass!==jr&&(r.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(r.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(r.rotation=this.rotation),this.polygonOffset===!0&&(r.polygonOffset=!0),this.polygonOffsetFactor!==0&&(r.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(r.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(r.linewidth=this.linewidth),this.dashSize!==void 0&&(r.dashSize=this.dashSize),this.gapSize!==void 0&&(r.gapSize=this.gapSize),this.scale!==void 0&&(r.scale=this.scale),this.dithering===!0&&(r.dithering=!0),this.alphaTest>0&&(r.alphaTest=this.alphaTest),this.alphaHash===!0&&(r.alphaHash=!0),this.alphaToCoverage===!0&&(r.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(r.premultipliedAlpha=!0),this.forceSinglePass===!0&&(r.forceSinglePass=!0),this.wireframe===!0&&(r.wireframe=!0),this.wireframeLinewidth>1&&(r.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(r.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(r.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(r.flatShading=!0),this.visible===!1&&(r.visible=!1),this.toneMapped===!1&&(r.toneMapped=!1),this.fog===!1&&(r.fog=!1),Object.keys(this.userData).length>0&&(r.userData=this.userData);function l(u){const d=[];for(const h in u){const m=u[h];delete m.metadata,d.push(m)}return d}if(i){const u=l(e.textures),d=l(e.images);u.length>0&&(r.textures=u),d.length>0&&(r.images=d)}return r}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const i=e.clippingPlanes;let r=null;if(i!==null){const l=i.length;r=new Array(l);for(let u=0;u!==l;++u)r[u]=i[u].clone()}return this.clippingPlanes=r,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class nv extends Lo{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new pe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=I_,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const on=new st,Kl=new He;class di{constructor(e,i,r=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=i,this.count=e!==void 0?e.length/i:0,this.normalized=r,this.usage=Wg,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=Da,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,i){this.updateRanges.push({start:e,count:i})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,i,r){e*=this.itemSize,r*=i.itemSize;for(let l=0,u=this.itemSize;l<u;l++)this.array[e+l]=i.array[r+l];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let i=0,r=this.count;i<r;i++)Kl.fromBufferAttribute(this,i),Kl.applyMatrix3(e),this.setXY(i,Kl.x,Kl.y);else if(this.itemSize===3)for(let i=0,r=this.count;i<r;i++)on.fromBufferAttribute(this,i),on.applyMatrix3(e),this.setXYZ(i,on.x,on.y,on.z);return this}applyMatrix4(e){for(let i=0,r=this.count;i<r;i++)on.fromBufferAttribute(this,i),on.applyMatrix4(e),this.setXYZ(i,on.x,on.y,on.z);return this}applyNormalMatrix(e){for(let i=0,r=this.count;i<r;i++)on.fromBufferAttribute(this,i),on.applyNormalMatrix(e),this.setXYZ(i,on.x,on.y,on.z);return this}transformDirection(e){for(let i=0,r=this.count;i<r;i++)on.fromBufferAttribute(this,i),on.transformDirection(e),this.setXYZ(i,on.x,on.y,on.z);return this}set(e,i=0){return this.array.set(e,i),this}getComponent(e,i){let r=this.array[e*this.itemSize+i];return this.normalized&&(r=vo(r,this.array)),r}setComponent(e,i,r){return this.normalized&&(r=Gn(r,this.array)),this.array[e*this.itemSize+i]=r,this}getX(e){let i=this.array[e*this.itemSize];return this.normalized&&(i=vo(i,this.array)),i}setX(e,i){return this.normalized&&(i=Gn(i,this.array)),this.array[e*this.itemSize]=i,this}getY(e){let i=this.array[e*this.itemSize+1];return this.normalized&&(i=vo(i,this.array)),i}setY(e,i){return this.normalized&&(i=Gn(i,this.array)),this.array[e*this.itemSize+1]=i,this}getZ(e){let i=this.array[e*this.itemSize+2];return this.normalized&&(i=vo(i,this.array)),i}setZ(e,i){return this.normalized&&(i=Gn(i,this.array)),this.array[e*this.itemSize+2]=i,this}getW(e){let i=this.array[e*this.itemSize+3];return this.normalized&&(i=vo(i,this.array)),i}setW(e,i){return this.normalized&&(i=Gn(i,this.array)),this.array[e*this.itemSize+3]=i,this}setXY(e,i,r){return e*=this.itemSize,this.normalized&&(i=Gn(i,this.array),r=Gn(r,this.array)),this.array[e+0]=i,this.array[e+1]=r,this}setXYZ(e,i,r,l){return e*=this.itemSize,this.normalized&&(i=Gn(i,this.array),r=Gn(r,this.array),l=Gn(l,this.array)),this.array[e+0]=i,this.array[e+1]=r,this.array[e+2]=l,this}setXYZW(e,i,r,l,u){return e*=this.itemSize,this.normalized&&(i=Gn(i,this.array),r=Gn(r,this.array),l=Gn(l,this.array),u=Gn(u,this.array)),this.array[e+0]=i,this.array[e+1]=r,this.array[e+2]=l,this.array[e+3]=u,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Wg&&(e.usage=this.usage),e}}class iv extends di{constructor(e,i,r){super(new Uint16Array(e),i,r)}}class av extends di{constructor(e,i,r){super(new Uint32Array(e),i,r)}}class hr extends di{constructor(e,i,r){super(new Float32Array(e),i,r)}}let qx=0;const ci=new _n,th=new Xn,is=new st,$n=new Do,yo=new Do,gn=new st;class ta extends vs{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:qx++}),this.uuid=wo(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Z_(e)?av:iv)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,i){return this.attributes[e]=i,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,i,r=0){this.groups.push({start:e,count:i,materialIndex:r})}clearGroups(){this.groups=[]}setDrawRange(e,i){this.drawRange.start=e,this.drawRange.count=i}applyMatrix4(e){const i=this.attributes.position;i!==void 0&&(i.applyMatrix4(e),i.needsUpdate=!0);const r=this.attributes.normal;if(r!==void 0){const u=new ye().getNormalMatrix(e);r.applyNormalMatrix(u),r.needsUpdate=!0}const l=this.attributes.tangent;return l!==void 0&&(l.transformDirection(e),l.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return ci.makeRotationFromQuaternion(e),this.applyMatrix4(ci),this}rotateX(e){return ci.makeRotationX(e),this.applyMatrix4(ci),this}rotateY(e){return ci.makeRotationY(e),this.applyMatrix4(ci),this}rotateZ(e){return ci.makeRotationZ(e),this.applyMatrix4(ci),this}translate(e,i,r){return ci.makeTranslation(e,i,r),this.applyMatrix4(ci),this}scale(e,i,r){return ci.makeScale(e,i,r),this.applyMatrix4(ci),this}lookAt(e){return th.lookAt(e),th.updateMatrix(),this.applyMatrix4(th.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(is).negate(),this.translate(is.x,is.y,is.z),this}setFromPoints(e){const i=[];for(let r=0,l=e.length;r<l;r++){const u=e[r];i.push(u.x,u.y,u.z||0)}return this.setAttribute("position",new hr(i,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Do);const e=this.attributes.position,i=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new st(-1/0,-1/0,-1/0),new st(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),i)for(let r=0,l=i.length;r<l;r++){const u=i[r];$n.setFromBufferAttribute(u),this.morphTargetsRelative?(gn.addVectors(this.boundingBox.min,$n.min),this.boundingBox.expandByPoint(gn),gn.addVectors(this.boundingBox.max,$n.max),this.boundingBox.expandByPoint(gn)):(this.boundingBox.expandByPoint($n.min),this.boundingBox.expandByPoint($n.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Mc);const e=this.attributes.position,i=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new st,1/0);return}if(e){const r=this.boundingSphere.center;if($n.setFromBufferAttribute(e),i)for(let u=0,d=i.length;u<d;u++){const h=i[u];yo.setFromBufferAttribute(h),this.morphTargetsRelative?(gn.addVectors($n.min,yo.min),$n.expandByPoint(gn),gn.addVectors($n.max,yo.max),$n.expandByPoint(gn)):($n.expandByPoint(yo.min),$n.expandByPoint(yo.max))}$n.getCenter(r);let l=0;for(let u=0,d=e.count;u<d;u++)gn.fromBufferAttribute(e,u),l=Math.max(l,r.distanceToSquared(gn));if(i)for(let u=0,d=i.length;u<d;u++){const h=i[u],m=this.morphTargetsRelative;for(let p=0,g=h.count;p<g;p++)gn.fromBufferAttribute(h,p),m&&(is.fromBufferAttribute(e,p),gn.add(is)),l=Math.max(l,r.distanceToSquared(gn))}this.boundingSphere.radius=Math.sqrt(l),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,i=this.attributes;if(e===null||i.position===void 0||i.normal===void 0||i.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const r=e.array,l=i.position.array,u=i.normal.array,d=i.uv.array,h=l.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new di(new Float32Array(4*h),4));const m=this.getAttribute("tangent").array,p=[],g=[];for(let U=0;U<h;U++)p[U]=new st,g[U]=new st;const v=new st,x=new st,y=new st,A=new He,b=new He,S=new He,_=new st,P=new st;function L(U,lt,ut){v.fromArray(l,U*3),x.fromArray(l,lt*3),y.fromArray(l,ut*3),A.fromArray(d,U*2),b.fromArray(d,lt*2),S.fromArray(d,ut*2),x.sub(v),y.sub(v),b.sub(A),S.sub(A);const Et=1/(b.x*S.y-S.x*b.y);isFinite(Et)&&(_.copy(x).multiplyScalar(S.y).addScaledVector(y,-b.y).multiplyScalar(Et),P.copy(y).multiplyScalar(b.x).addScaledVector(x,-S.x).multiplyScalar(Et),p[U].add(_),p[lt].add(_),p[ut].add(_),g[U].add(P),g[lt].add(P),g[ut].add(P))}let O=this.groups;O.length===0&&(O=[{start:0,count:r.length}]);for(let U=0,lt=O.length;U<lt;++U){const ut=O[U],Et=ut.start,X=ut.count;for(let J=Et,N=Et+X;J<N;J+=3)L(r[J+0],r[J+1],r[J+2])}const k=new st,F=new st,B=new st,pt=new st;function w(U){B.fromArray(u,U*3),pt.copy(B);const lt=p[U];k.copy(lt),k.sub(B.multiplyScalar(B.dot(lt))).normalize(),F.crossVectors(pt,lt);const Et=F.dot(g[U])<0?-1:1;m[U*4]=k.x,m[U*4+1]=k.y,m[U*4+2]=k.z,m[U*4+3]=Et}for(let U=0,lt=O.length;U<lt;++U){const ut=O[U],Et=ut.start,X=ut.count;for(let J=Et,N=Et+X;J<N;J+=3)w(r[J+0]),w(r[J+1]),w(r[J+2])}}computeVertexNormals(){const e=this.index,i=this.getAttribute("position");if(i!==void 0){let r=this.getAttribute("normal");if(r===void 0)r=new di(new Float32Array(i.count*3),3),this.setAttribute("normal",r);else for(let x=0,y=r.count;x<y;x++)r.setXYZ(x,0,0,0);const l=new st,u=new st,d=new st,h=new st,m=new st,p=new st,g=new st,v=new st;if(e)for(let x=0,y=e.count;x<y;x+=3){const A=e.getX(x+0),b=e.getX(x+1),S=e.getX(x+2);l.fromBufferAttribute(i,A),u.fromBufferAttribute(i,b),d.fromBufferAttribute(i,S),g.subVectors(d,u),v.subVectors(l,u),g.cross(v),h.fromBufferAttribute(r,A),m.fromBufferAttribute(r,b),p.fromBufferAttribute(r,S),h.add(g),m.add(g),p.add(g),r.setXYZ(A,h.x,h.y,h.z),r.setXYZ(b,m.x,m.y,m.z),r.setXYZ(S,p.x,p.y,p.z)}else for(let x=0,y=i.count;x<y;x+=3)l.fromBufferAttribute(i,x+0),u.fromBufferAttribute(i,x+1),d.fromBufferAttribute(i,x+2),g.subVectors(d,u),v.subVectors(l,u),g.cross(v),r.setXYZ(x+0,g.x,g.y,g.z),r.setXYZ(x+1,g.x,g.y,g.z),r.setXYZ(x+2,g.x,g.y,g.z);this.normalizeNormals(),r.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let i=0,r=e.count;i<r;i++)gn.fromBufferAttribute(e,i),gn.normalize(),e.setXYZ(i,gn.x,gn.y,gn.z)}toNonIndexed(){function e(h,m){const p=h.array,g=h.itemSize,v=h.normalized,x=new p.constructor(m.length*g);let y=0,A=0;for(let b=0,S=m.length;b<S;b++){h.isInterleavedBufferAttribute?y=m[b]*h.data.stride+h.offset:y=m[b]*g;for(let _=0;_<g;_++)x[A++]=p[y++]}return new di(x,g,v)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const i=new ta,r=this.index.array,l=this.attributes;for(const h in l){const m=l[h],p=e(m,r);i.setAttribute(h,p)}const u=this.morphAttributes;for(const h in u){const m=[],p=u[h];for(let g=0,v=p.length;g<v;g++){const x=p[g],y=e(x,r);m.push(y)}i.morphAttributes[h]=m}i.morphTargetsRelative=this.morphTargetsRelative;const d=this.groups;for(let h=0,m=d.length;h<m;h++){const p=d[h];i.addGroup(p.start,p.count,p.materialIndex)}return i}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const m=this.parameters;for(const p in m)m[p]!==void 0&&(e[p]=m[p]);return e}e.data={attributes:{}};const i=this.index;i!==null&&(e.data.index={type:i.array.constructor.name,array:Array.prototype.slice.call(i.array)});const r=this.attributes;for(const m in r){const p=r[m];e.data.attributes[m]=p.toJSON(e.data)}const l={};let u=!1;for(const m in this.morphAttributes){const p=this.morphAttributes[m],g=[];for(let v=0,x=p.length;v<x;v++){const y=p[v];g.push(y.toJSON(e.data))}g.length>0&&(l[m]=g,u=!0)}u&&(e.data.morphAttributes=l,e.data.morphTargetsRelative=this.morphTargetsRelative);const d=this.groups;d.length>0&&(e.data.groups=JSON.parse(JSON.stringify(d)));const h=this.boundingSphere;return h!==null&&(e.data.boundingSphere={center:h.center.toArray(),radius:h.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const i={};this.name=e.name;const r=e.index;r!==null&&this.setIndex(r.clone(i));const l=e.attributes;for(const p in l){const g=l[p];this.setAttribute(p,g.clone(i))}const u=e.morphAttributes;for(const p in u){const g=[],v=u[p];for(let x=0,y=v.length;x<y;x++)g.push(v[x].clone(i));this.morphAttributes[p]=g}this.morphTargetsRelative=e.morphTargetsRelative;const d=e.groups;for(let p=0,g=d.length;p<g;p++){const v=d[p];this.addGroup(v.start,v.count,v.materialIndex)}const h=e.boundingBox;h!==null&&(this.boundingBox=h.clone());const m=e.boundingSphere;return m!==null&&(this.boundingSphere=m.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const r_=new _n,ir=new $_,Ql=new Mc,s_=new st,as=new st,rs=new st,ss=new st,eh=new st,Jl=new st,$l=new He,tc=new He,ec=new He,o_=new st,l_=new st,c_=new st,nc=new st,ic=new st;class La extends Xn{constructor(e=new ta,i=new nv){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=i,this.updateMorphTargets()}copy(e,i){return super.copy(e,i),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const i=this.geometry.morphAttributes,r=Object.keys(i);if(r.length>0){const l=i[r[0]];if(l!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let u=0,d=l.length;u<d;u++){const h=l[u].name||String(u);this.morphTargetInfluences.push(0),this.morphTargetDictionary[h]=u}}}}getVertexPosition(e,i){const r=this.geometry,l=r.attributes.position,u=r.morphAttributes.position,d=r.morphTargetsRelative;i.fromBufferAttribute(l,e);const h=this.morphTargetInfluences;if(u&&h){Jl.set(0,0,0);for(let m=0,p=u.length;m<p;m++){const g=h[m],v=u[m];g!==0&&(eh.fromBufferAttribute(v,e),d?Jl.addScaledVector(eh,g):Jl.addScaledVector(eh.sub(i),g))}i.add(Jl)}return i}raycast(e,i){const r=this.geometry,l=this.material,u=this.matrixWorld;l!==void 0&&(r.boundingSphere===null&&r.computeBoundingSphere(),Ql.copy(r.boundingSphere),Ql.applyMatrix4(u),ir.copy(e.ray).recast(e.near),!(Ql.containsPoint(ir.origin)===!1&&(ir.intersectSphere(Ql,s_)===null||ir.origin.distanceToSquared(s_)>(e.far-e.near)**2))&&(r_.copy(u).invert(),ir.copy(e.ray).applyMatrix4(r_),!(r.boundingBox!==null&&ir.intersectsBox(r.boundingBox)===!1)&&this._computeIntersections(e,i,ir)))}_computeIntersections(e,i,r){let l;const u=this.geometry,d=this.material,h=u.index,m=u.attributes.position,p=u.attributes.uv,g=u.attributes.uv1,v=u.attributes.normal,x=u.groups,y=u.drawRange;if(h!==null)if(Array.isArray(d))for(let A=0,b=x.length;A<b;A++){const S=x[A],_=d[S.materialIndex],P=Math.max(S.start,y.start),L=Math.min(h.count,Math.min(S.start+S.count,y.start+y.count));for(let O=P,k=L;O<k;O+=3){const F=h.getX(O),B=h.getX(O+1),pt=h.getX(O+2);l=ac(this,_,e,r,p,g,v,F,B,pt),l&&(l.faceIndex=Math.floor(O/3),l.face.materialIndex=S.materialIndex,i.push(l))}}else{const A=Math.max(0,y.start),b=Math.min(h.count,y.start+y.count);for(let S=A,_=b;S<_;S+=3){const P=h.getX(S),L=h.getX(S+1),O=h.getX(S+2);l=ac(this,d,e,r,p,g,v,P,L,O),l&&(l.faceIndex=Math.floor(S/3),i.push(l))}}else if(m!==void 0)if(Array.isArray(d))for(let A=0,b=x.length;A<b;A++){const S=x[A],_=d[S.materialIndex],P=Math.max(S.start,y.start),L=Math.min(m.count,Math.min(S.start+S.count,y.start+y.count));for(let O=P,k=L;O<k;O+=3){const F=O,B=O+1,pt=O+2;l=ac(this,_,e,r,p,g,v,F,B,pt),l&&(l.faceIndex=Math.floor(O/3),l.face.materialIndex=S.materialIndex,i.push(l))}}else{const A=Math.max(0,y.start),b=Math.min(m.count,y.start+y.count);for(let S=A,_=b;S<_;S+=3){const P=S,L=S+1,O=S+2;l=ac(this,d,e,r,p,g,v,P,L,O),l&&(l.faceIndex=Math.floor(S/3),i.push(l))}}}}function Yx(o,e,i,r,l,u,d,h){let m;if(e.side===kn?m=r.intersectTriangle(d,u,l,!0,h):m=r.intersectTriangle(l,u,d,e.side===Pa,h),m===null)return null;ic.copy(h),ic.applyMatrix4(o.matrixWorld);const p=i.ray.origin.distanceTo(ic);return p<i.near||p>i.far?null:{distance:p,point:ic.clone(),object:o}}function ac(o,e,i,r,l,u,d,h,m,p){o.getVertexPosition(h,as),o.getVertexPosition(m,rs),o.getVertexPosition(p,ss);const g=Yx(o,e,i,r,as,rs,ss,nc);if(g){l&&($l.fromBufferAttribute(l,h),tc.fromBufferAttribute(l,m),ec.fromBufferAttribute(l,p),g.uv=Mi.getInterpolation(nc,as,rs,ss,$l,tc,ec,new He)),u&&($l.fromBufferAttribute(u,h),tc.fromBufferAttribute(u,m),ec.fromBufferAttribute(u,p),g.uv1=Mi.getInterpolation(nc,as,rs,ss,$l,tc,ec,new He),g.uv2=g.uv1),d&&(o_.fromBufferAttribute(d,h),l_.fromBufferAttribute(d,m),c_.fromBufferAttribute(d,p),g.normal=Mi.getInterpolation(nc,as,rs,ss,o_,l_,c_,new st),g.normal.dot(r.direction)>0&&g.normal.multiplyScalar(-1));const v={a:h,b:m,c:p,normal:new st,materialIndex:0};Mi.getNormal(as,rs,ss,v.normal),g.face=v}return g}class Uo extends ta{constructor(e=1,i=1,r=1,l=1,u=1,d=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:i,depth:r,widthSegments:l,heightSegments:u,depthSegments:d};const h=this;l=Math.floor(l),u=Math.floor(u),d=Math.floor(d);const m=[],p=[],g=[],v=[];let x=0,y=0;A("z","y","x",-1,-1,r,i,e,d,u,0),A("z","y","x",1,-1,r,i,-e,d,u,1),A("x","z","y",1,1,e,r,i,l,d,2),A("x","z","y",1,-1,e,r,-i,l,d,3),A("x","y","z",1,-1,e,i,r,l,u,4),A("x","y","z",-1,-1,e,i,-r,l,u,5),this.setIndex(m),this.setAttribute("position",new hr(p,3)),this.setAttribute("normal",new hr(g,3)),this.setAttribute("uv",new hr(v,2));function A(b,S,_,P,L,O,k,F,B,pt,w){const U=O/B,lt=k/pt,ut=O/2,Et=k/2,X=F/2,J=B+1,N=pt+1;let q=0,K=0;const ct=new st;for(let R=0;R<N;R++){const V=R*lt-Et;for(let j=0;j<J;j++){const I=j*U-ut;ct[b]=I*P,ct[S]=V*L,ct[_]=X,p.push(ct.x,ct.y,ct.z),ct[b]=0,ct[S]=0,ct[_]=F>0?1:-1,g.push(ct.x,ct.y,ct.z),v.push(j/B),v.push(1-R/pt),q+=1}}for(let R=0;R<pt;R++)for(let V=0;V<B;V++){const j=x+V+J*R,I=x+V+J*(R+1),$=x+(V+1)+J*(R+1),_t=x+(V+1)+J*R;m.push(j,I,_t),m.push(I,$,_t),K+=6}h.addGroup(y,K,w),y+=K,x+=q}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Uo(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function _s(o){const e={};for(const i in o){e[i]={};for(const r in o[i]){const l=o[i][r];l&&(l.isColor||l.isMatrix3||l.isMatrix4||l.isVector2||l.isVector3||l.isVector4||l.isTexture||l.isQuaternion)?l.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[i][r]=null):e[i][r]=l.clone():Array.isArray(l)?e[i][r]=l.slice():e[i][r]=l}}return e}function On(o){const e={};for(let i=0;i<o.length;i++){const r=_s(o[i]);for(const l in r)e[l]=r[l]}return e}function jx(o){const e=[];for(let i=0;i<o.length;i++)e.push(o[i].clone());return e}function rv(o){return o.getRenderTarget()===null?o.outputColorSpace:Fe.workingColorSpace}const Zx={clone:_s,merge:On};var Kx=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Qx=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class za extends Lo{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Kx,this.fragmentShader=Qx,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=_s(e.uniforms),this.uniformsGroups=jx(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const i=super.toJSON(e);i.glslVersion=this.glslVersion,i.uniforms={};for(const l in this.uniforms){const d=this.uniforms[l].value;d&&d.isTexture?i.uniforms[l]={type:"t",value:d.toJSON(e).uuid}:d&&d.isColor?i.uniforms[l]={type:"c",value:d.getHex()}:d&&d.isVector2?i.uniforms[l]={type:"v2",value:d.toArray()}:d&&d.isVector3?i.uniforms[l]={type:"v3",value:d.toArray()}:d&&d.isVector4?i.uniforms[l]={type:"v4",value:d.toArray()}:d&&d.isMatrix3?i.uniforms[l]={type:"m3",value:d.toArray()}:d&&d.isMatrix4?i.uniforms[l]={type:"m4",value:d.toArray()}:i.uniforms[l]={value:d}}Object.keys(this.defines).length>0&&(i.defines=this.defines),i.vertexShader=this.vertexShader,i.fragmentShader=this.fragmentShader,i.lights=this.lights,i.clipping=this.clipping;const r={};for(const l in this.extensions)this.extensions[l]===!0&&(r[l]=!0);return Object.keys(r).length>0&&(i.extensions=r),i}}class sv extends Xn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new _n,this.projectionMatrix=new _n,this.projectionMatrixInverse=new _n,this.coordinateSystem=Ji}copy(e,i){return super.copy(e,i),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,i){super.updateWorldMatrix(e,i),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}class fi extends sv{constructor(e=50,i=1,r=.1,l=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=r,this.far=l,this.focus=10,this.aspect=i,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,i){return super.copy(e,i),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const i=.5*this.getFilmHeight()/e;this.fov=Sh*2*Math.atan(i),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(If*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Sh*2*Math.atan(Math.tan(If*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(e,i,r,l,u,d){this.aspect=e/i,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=i,this.view.offsetX=r,this.view.offsetY=l,this.view.width=u,this.view.height=d,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let i=e*Math.tan(If*.5*this.fov)/this.zoom,r=2*i,l=this.aspect*r,u=-.5*l;const d=this.view;if(this.view!==null&&this.view.enabled){const m=d.fullWidth,p=d.fullHeight;u+=d.offsetX*l/m,i-=d.offsetY*r/p,l*=d.width/m,r*=d.height/p}const h=this.filmOffset;h!==0&&(u+=e*h/this.getFilmWidth()),this.projectionMatrix.makePerspective(u,u+l,i,i-r,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const i=super.toJSON(e);return i.object.fov=this.fov,i.object.zoom=this.zoom,i.object.near=this.near,i.object.far=this.far,i.object.focus=this.focus,i.object.aspect=this.aspect,this.view!==null&&(i.object.view=Object.assign({},this.view)),i.object.filmGauge=this.filmGauge,i.object.filmOffset=this.filmOffset,i}}const os=-90,ls=1;class Jx extends Xn{constructor(e,i,r){super(),this.type="CubeCamera",this.renderTarget=r,this.coordinateSystem=null,this.activeMipmapLevel=0;const l=new fi(os,ls,e,i);l.layers=this.layers,this.add(l);const u=new fi(os,ls,e,i);u.layers=this.layers,this.add(u);const d=new fi(os,ls,e,i);d.layers=this.layers,this.add(d);const h=new fi(os,ls,e,i);h.layers=this.layers,this.add(h);const m=new fi(os,ls,e,i);m.layers=this.layers,this.add(m);const p=new fi(os,ls,e,i);p.layers=this.layers,this.add(p)}updateCoordinateSystem(){const e=this.coordinateSystem,i=this.children.concat(),[r,l,u,d,h,m]=i;for(const p of i)this.remove(p);if(e===Ji)r.up.set(0,1,0),r.lookAt(1,0,0),l.up.set(0,1,0),l.lookAt(-1,0,0),u.up.set(0,0,-1),u.lookAt(0,1,0),d.up.set(0,0,1),d.lookAt(0,-1,0),h.up.set(0,1,0),h.lookAt(0,0,1),m.up.set(0,1,0),m.lookAt(0,0,-1);else if(e===_c)r.up.set(0,-1,0),r.lookAt(-1,0,0),l.up.set(0,-1,0),l.lookAt(1,0,0),u.up.set(0,0,1),u.lookAt(0,1,0),d.up.set(0,0,-1),d.lookAt(0,-1,0),h.up.set(0,-1,0),h.lookAt(0,0,1),m.up.set(0,-1,0),m.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const p of i)this.add(p),p.updateMatrixWorld()}update(e,i){this.parent===null&&this.updateMatrixWorld();const{renderTarget:r,activeMipmapLevel:l}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[u,d,h,m,p,g]=this.children,v=e.getRenderTarget(),x=e.getActiveCubeFace(),y=e.getActiveMipmapLevel(),A=e.xr.enabled;e.xr.enabled=!1;const b=r.texture.generateMipmaps;r.texture.generateMipmaps=!1,e.setRenderTarget(r,0,l),e.render(i,u),e.setRenderTarget(r,1,l),e.render(i,d),e.setRenderTarget(r,2,l),e.render(i,h),e.setRenderTarget(r,3,l),e.render(i,m),e.setRenderTarget(r,4,l),e.render(i,p),r.texture.generateMipmaps=b,e.setRenderTarget(r,5,l),e.render(i,g),e.setRenderTarget(v,x,y),e.xr.enabled=A,r.texture.needsPMREMUpdate=!0}}class ov extends ti{constructor(e,i,r,l,u,d,h,m,p,g){e=e!==void 0?e:[],i=i!==void 0?i:ps,super(e,i,r,l,u,d,h,m,p,g),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class $x extends dr{constructor(e=1,i={}){super(e,e,i),this.isWebGLCubeRenderTarget=!0;const r={width:e,height:e,depth:1},l=[r,r,r,r,r,r];i.encoding!==void 0&&(bo("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),i.colorSpace=i.encoding===fr?Tn:hi),this.texture=new ov(l,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=i.generateMipmaps!==void 0?i.generateMipmaps:!1,this.texture.minFilter=i.minFilter!==void 0?i.minFilter:ui}fromEquirectangularTexture(e,i){this.texture.type=i.type,this.texture.colorSpace=i.colorSpace,this.texture.generateMipmaps=i.generateMipmaps,this.texture.minFilter=i.minFilter,this.texture.magFilter=i.magFilter;const r={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},l=new Uo(5,5,5),u=new za({name:"CubemapFromEquirect",uniforms:_s(r.uniforms),vertexShader:r.vertexShader,fragmentShader:r.fragmentShader,side:kn,blending:Ua});u.uniforms.tEquirect.value=i;const d=new La(l,u),h=i.minFilter;return i.minFilter===Ao&&(i.minFilter=ui),new Jx(1,10,this).update(e,d),i.minFilter=h,d.geometry.dispose(),d.material.dispose(),this}clear(e,i,r,l){const u=e.getRenderTarget();for(let d=0;d<6;d++)e.setRenderTarget(this,d),e.clear(i,r,l);e.setRenderTarget(u)}}const nh=new st,tM=new st,eM=new ye;class rr{constructor(e=new st(1,0,0),i=0){this.isPlane=!0,this.normal=e,this.constant=i}set(e,i){return this.normal.copy(e),this.constant=i,this}setComponents(e,i,r,l){return this.normal.set(e,i,r),this.constant=l,this}setFromNormalAndCoplanarPoint(e,i){return this.normal.copy(e),this.constant=-i.dot(this.normal),this}setFromCoplanarPoints(e,i,r){const l=nh.subVectors(r,i).cross(tM.subVectors(e,i)).normalize();return this.setFromNormalAndCoplanarPoint(l,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,i){return i.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,i){const r=e.delta(nh),l=this.normal.dot(r);if(l===0)return this.distanceToPoint(e.start)===0?i.copy(e.start):null;const u=-(e.start.dot(this.normal)+this.constant)/l;return u<0||u>1?null:i.copy(e.start).addScaledVector(r,u)}intersectsLine(e){const i=this.distanceToPoint(e.start),r=this.distanceToPoint(e.end);return i<0&&r>0||r<0&&i>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,i){const r=i||eM.getNormalMatrix(e),l=this.coplanarPoint(nh).applyMatrix4(e),u=this.normal.applyMatrix3(r).normalize();return this.constant=-l.dot(u),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ar=new Mc,rc=new st;class lv{constructor(e=new rr,i=new rr,r=new rr,l=new rr,u=new rr,d=new rr){this.planes=[e,i,r,l,u,d]}set(e,i,r,l,u,d){const h=this.planes;return h[0].copy(e),h[1].copy(i),h[2].copy(r),h[3].copy(l),h[4].copy(u),h[5].copy(d),this}copy(e){const i=this.planes;for(let r=0;r<6;r++)i[r].copy(e.planes[r]);return this}setFromProjectionMatrix(e,i=Ji){const r=this.planes,l=e.elements,u=l[0],d=l[1],h=l[2],m=l[3],p=l[4],g=l[5],v=l[6],x=l[7],y=l[8],A=l[9],b=l[10],S=l[11],_=l[12],P=l[13],L=l[14],O=l[15];if(r[0].setComponents(m-u,x-p,S-y,O-_).normalize(),r[1].setComponents(m+u,x+p,S+y,O+_).normalize(),r[2].setComponents(m+d,x+g,S+A,O+P).normalize(),r[3].setComponents(m-d,x-g,S-A,O-P).normalize(),r[4].setComponents(m-h,x-v,S-b,O-L).normalize(),i===Ji)r[5].setComponents(m+h,x+v,S+b,O+L).normalize();else if(i===_c)r[5].setComponents(h,v,b,L).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+i);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ar.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const i=e.geometry;i.boundingSphere===null&&i.computeBoundingSphere(),ar.copy(i.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ar)}intersectsSprite(e){return ar.center.set(0,0,0),ar.radius=.7071067811865476,ar.applyMatrix4(e.matrixWorld),this.intersectsSphere(ar)}intersectsSphere(e){const i=this.planes,r=e.center,l=-e.radius;for(let u=0;u<6;u++)if(i[u].distanceToPoint(r)<l)return!1;return!0}intersectsBox(e){const i=this.planes;for(let r=0;r<6;r++){const l=i[r];if(rc.x=l.normal.x>0?e.max.x:e.min.x,rc.y=l.normal.y>0?e.max.y:e.min.y,rc.z=l.normal.z>0?e.max.z:e.min.z,l.distanceToPoint(rc)<0)return!1}return!0}containsPoint(e){const i=this.planes;for(let r=0;r<6;r++)if(i[r].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function cv(){let o=null,e=!1,i=null,r=null;function l(u,d){i(u,d),r=o.requestAnimationFrame(l)}return{start:function(){e!==!0&&i!==null&&(r=o.requestAnimationFrame(l),e=!0)},stop:function(){o.cancelAnimationFrame(r),e=!1},setAnimationLoop:function(u){i=u},setContext:function(u){o=u}}}function nM(o,e){const i=e.isWebGL2,r=new WeakMap;function l(p,g){const v=p.array,x=p.usage,y=v.byteLength,A=o.createBuffer();o.bindBuffer(g,A),o.bufferData(g,v,x),p.onUploadCallback();let b;if(v instanceof Float32Array)b=o.FLOAT;else if(v instanceof Uint16Array)if(p.isFloat16BufferAttribute)if(i)b=o.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else b=o.UNSIGNED_SHORT;else if(v instanceof Int16Array)b=o.SHORT;else if(v instanceof Uint32Array)b=o.UNSIGNED_INT;else if(v instanceof Int32Array)b=o.INT;else if(v instanceof Int8Array)b=o.BYTE;else if(v instanceof Uint8Array)b=o.UNSIGNED_BYTE;else if(v instanceof Uint8ClampedArray)b=o.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+v);return{buffer:A,type:b,bytesPerElement:v.BYTES_PER_ELEMENT,version:p.version,size:y}}function u(p,g,v){const x=g.array,y=g._updateRange,A=g.updateRanges;if(o.bindBuffer(v,p),y.count===-1&&A.length===0&&o.bufferSubData(v,0,x),A.length!==0){for(let b=0,S=A.length;b<S;b++){const _=A[b];i?o.bufferSubData(v,_.start*x.BYTES_PER_ELEMENT,x,_.start,_.count):o.bufferSubData(v,_.start*x.BYTES_PER_ELEMENT,x.subarray(_.start,_.start+_.count))}g.clearUpdateRanges()}y.count!==-1&&(i?o.bufferSubData(v,y.offset*x.BYTES_PER_ELEMENT,x,y.offset,y.count):o.bufferSubData(v,y.offset*x.BYTES_PER_ELEMENT,x.subarray(y.offset,y.offset+y.count)),y.count=-1),g.onUploadCallback()}function d(p){return p.isInterleavedBufferAttribute&&(p=p.data),r.get(p)}function h(p){p.isInterleavedBufferAttribute&&(p=p.data);const g=r.get(p);g&&(o.deleteBuffer(g.buffer),r.delete(p))}function m(p,g){if(p.isGLBufferAttribute){const x=r.get(p);(!x||x.version<p.version)&&r.set(p,{buffer:p.buffer,type:p.type,bytesPerElement:p.elementSize,version:p.version});return}p.isInterleavedBufferAttribute&&(p=p.data);const v=r.get(p);if(v===void 0)r.set(p,l(p,g));else if(v.version<p.version){if(v.size!==p.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");u(v.buffer,p,g),v.version=p.version}}return{get:d,remove:h,update:m}}class Rh extends ta{constructor(e=1,i=1,r=1,l=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:i,widthSegments:r,heightSegments:l};const u=e/2,d=i/2,h=Math.floor(r),m=Math.floor(l),p=h+1,g=m+1,v=e/h,x=i/m,y=[],A=[],b=[],S=[];for(let _=0;_<g;_++){const P=_*x-d;for(let L=0;L<p;L++){const O=L*v-u;A.push(O,-P,0),b.push(0,0,1),S.push(L/h),S.push(1-_/m)}}for(let _=0;_<m;_++)for(let P=0;P<h;P++){const L=P+p*_,O=P+p*(_+1),k=P+1+p*(_+1),F=P+1+p*_;y.push(L,O,F),y.push(O,k,F)}this.setIndex(y),this.setAttribute("position",new hr(A,3)),this.setAttribute("normal",new hr(b,3)),this.setAttribute("uv",new hr(S,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Rh(e.width,e.height,e.widthSegments,e.heightSegments)}}var iM=`#ifdef USE_ALPHAHASH
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
#endif`,hM=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,dM=`vec3 transformed = vec3( position );
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
#endif`,hy=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,dy=`#if defined( USE_POINTS_UV )
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
}`,hE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,dE=`uniform sampler2D tEquirect;
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
}`,ve={alphahash_fragment:iM,alphahash_pars_fragment:aM,alphamap_fragment:rM,alphamap_pars_fragment:sM,alphatest_fragment:oM,alphatest_pars_fragment:lM,aomap_fragment:cM,aomap_pars_fragment:uM,batching_pars_vertex:fM,batching_vertex:hM,begin_vertex:dM,beginnormal_vertex:pM,bsdfs:mM,iridescence_fragment:gM,bumpmap_pars_fragment:_M,clipping_planes_fragment:vM,clipping_planes_pars_fragment:SM,clipping_planes_pars_vertex:xM,clipping_planes_vertex:MM,color_fragment:yM,color_pars_fragment:EM,color_pars_vertex:TM,color_vertex:bM,common:AM,cube_uv_reflection_fragment:RM,defaultnormal_vertex:wM,displacementmap_pars_vertex:CM,displacementmap_vertex:DM,emissivemap_fragment:LM,emissivemap_pars_fragment:UM,colorspace_fragment:NM,colorspace_pars_fragment:OM,envmap_fragment:PM,envmap_common_pars_fragment:zM,envmap_pars_fragment:BM,envmap_pars_vertex:IM,envmap_physical_pars_fragment:KM,envmap_vertex:FM,fog_vertex:HM,fog_pars_vertex:GM,fog_fragment:VM,fog_pars_fragment:kM,gradientmap_pars_fragment:XM,lightmap_fragment:WM,lightmap_pars_fragment:qM,lights_lambert_fragment:YM,lights_lambert_pars_fragment:jM,lights_pars_begin:ZM,lights_toon_fragment:QM,lights_toon_pars_fragment:JM,lights_phong_fragment:$M,lights_phong_pars_fragment:ty,lights_physical_fragment:ey,lights_physical_pars_fragment:ny,lights_fragment_begin:iy,lights_fragment_maps:ay,lights_fragment_end:ry,logdepthbuf_fragment:sy,logdepthbuf_pars_fragment:oy,logdepthbuf_pars_vertex:ly,logdepthbuf_vertex:cy,map_fragment:uy,map_pars_fragment:fy,map_particle_fragment:hy,map_particle_pars_fragment:dy,metalnessmap_fragment:py,metalnessmap_pars_fragment:my,morphcolor_vertex:gy,morphnormal_vertex:_y,morphtarget_pars_vertex:vy,morphtarget_vertex:Sy,normal_fragment_begin:xy,normal_fragment_maps:My,normal_pars_fragment:yy,normal_pars_vertex:Ey,normal_vertex:Ty,normalmap_pars_fragment:by,clearcoat_normal_fragment_begin:Ay,clearcoat_normal_fragment_maps:Ry,clearcoat_pars_fragment:wy,iridescence_pars_fragment:Cy,opaque_fragment:Dy,packing:Ly,premultiplied_alpha_fragment:Uy,project_vertex:Ny,dithering_fragment:Oy,dithering_pars_fragment:Py,roughnessmap_fragment:zy,roughnessmap_pars_fragment:By,shadowmap_pars_fragment:Iy,shadowmap_pars_vertex:Fy,shadowmap_vertex:Hy,shadowmask_pars_fragment:Gy,skinbase_vertex:Vy,skinning_pars_vertex:ky,skinning_vertex:Xy,skinnormal_vertex:Wy,specularmap_fragment:qy,specularmap_pars_fragment:Yy,tonemapping_fragment:jy,tonemapping_pars_fragment:Zy,transmission_fragment:Ky,transmission_pars_fragment:Qy,uv_pars_fragment:Jy,uv_pars_vertex:$y,uv_vertex:tE,worldpos_vertex:eE,background_vert:nE,background_frag:iE,backgroundCube_vert:aE,backgroundCube_frag:rE,cube_vert:sE,cube_frag:oE,depth_vert:lE,depth_frag:cE,distanceRGBA_vert:uE,distanceRGBA_frag:fE,equirect_vert:hE,equirect_frag:dE,linedashed_vert:pE,linedashed_frag:mE,meshbasic_vert:gE,meshbasic_frag:_E,meshlambert_vert:vE,meshlambert_frag:SE,meshmatcap_vert:xE,meshmatcap_frag:ME,meshnormal_vert:yE,meshnormal_frag:EE,meshphong_vert:TE,meshphong_frag:bE,meshphysical_vert:AE,meshphysical_frag:RE,meshtoon_vert:wE,meshtoon_frag:CE,points_vert:DE,points_frag:LE,shadow_vert:UE,shadow_frag:NE,sprite_vert:OE,sprite_frag:PE},wt={common:{diffuse:{value:new pe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ye},alphaMap:{value:null},alphaMapTransform:{value:new ye},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ye}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ye}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ye}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ye},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ye},normalScale:{value:new He(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ye},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ye}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ye}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ye}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new pe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new pe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ye},alphaTest:{value:0},uvTransform:{value:new ye}},sprite:{diffuse:{value:new pe(16777215)},opacity:{value:1},center:{value:new He(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ye},alphaMap:{value:null},alphaMapTransform:{value:new ye},alphaTest:{value:0}}},Ci={basic:{uniforms:On([wt.common,wt.specularmap,wt.envmap,wt.aomap,wt.lightmap,wt.fog]),vertexShader:ve.meshbasic_vert,fragmentShader:ve.meshbasic_frag},lambert:{uniforms:On([wt.common,wt.specularmap,wt.envmap,wt.aomap,wt.lightmap,wt.emissivemap,wt.bumpmap,wt.normalmap,wt.displacementmap,wt.fog,wt.lights,{emissive:{value:new pe(0)}}]),vertexShader:ve.meshlambert_vert,fragmentShader:ve.meshlambert_frag},phong:{uniforms:On([wt.common,wt.specularmap,wt.envmap,wt.aomap,wt.lightmap,wt.emissivemap,wt.bumpmap,wt.normalmap,wt.displacementmap,wt.fog,wt.lights,{emissive:{value:new pe(0)},specular:{value:new pe(1118481)},shininess:{value:30}}]),vertexShader:ve.meshphong_vert,fragmentShader:ve.meshphong_frag},standard:{uniforms:On([wt.common,wt.envmap,wt.aomap,wt.lightmap,wt.emissivemap,wt.bumpmap,wt.normalmap,wt.displacementmap,wt.roughnessmap,wt.metalnessmap,wt.fog,wt.lights,{emissive:{value:new pe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ve.meshphysical_vert,fragmentShader:ve.meshphysical_frag},toon:{uniforms:On([wt.common,wt.aomap,wt.lightmap,wt.emissivemap,wt.bumpmap,wt.normalmap,wt.displacementmap,wt.gradientmap,wt.fog,wt.lights,{emissive:{value:new pe(0)}}]),vertexShader:ve.meshtoon_vert,fragmentShader:ve.meshtoon_frag},matcap:{uniforms:On([wt.common,wt.bumpmap,wt.normalmap,wt.displacementmap,wt.fog,{matcap:{value:null}}]),vertexShader:ve.meshmatcap_vert,fragmentShader:ve.meshmatcap_frag},points:{uniforms:On([wt.points,wt.fog]),vertexShader:ve.points_vert,fragmentShader:ve.points_frag},dashed:{uniforms:On([wt.common,wt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ve.linedashed_vert,fragmentShader:ve.linedashed_frag},depth:{uniforms:On([wt.common,wt.displacementmap]),vertexShader:ve.depth_vert,fragmentShader:ve.depth_frag},normal:{uniforms:On([wt.common,wt.bumpmap,wt.normalmap,wt.displacementmap,{opacity:{value:1}}]),vertexShader:ve.meshnormal_vert,fragmentShader:ve.meshnormal_frag},sprite:{uniforms:On([wt.sprite,wt.fog]),vertexShader:ve.sprite_vert,fragmentShader:ve.sprite_frag},background:{uniforms:{uvTransform:{value:new ye},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ve.background_vert,fragmentShader:ve.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:ve.backgroundCube_vert,fragmentShader:ve.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ve.cube_vert,fragmentShader:ve.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ve.equirect_vert,fragmentShader:ve.equirect_frag},distanceRGBA:{uniforms:On([wt.common,wt.displacementmap,{referencePosition:{value:new st},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ve.distanceRGBA_vert,fragmentShader:ve.distanceRGBA_frag},shadow:{uniforms:On([wt.lights,wt.fog,{color:{value:new pe(0)},opacity:{value:1}}]),vertexShader:ve.shadow_vert,fragmentShader:ve.shadow_frag}};Ci.physical={uniforms:On([Ci.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ye},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ye},clearcoatNormalScale:{value:new He(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ye},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ye},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ye},sheen:{value:0},sheenColor:{value:new pe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ye},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ye},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ye},transmissionSamplerSize:{value:new He},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ye},attenuationDistance:{value:0},attenuationColor:{value:new pe(0)},specularColor:{value:new pe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ye},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ye},anisotropyVector:{value:new He},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ye}}]),vertexShader:ve.meshphysical_vert,fragmentShader:ve.meshphysical_frag};const sc={r:0,b:0,g:0};function zE(o,e,i,r,l,u,d){const h=new pe(0);let m=u===!0?0:1,p,g,v=null,x=0,y=null;function A(S,_){let P=!1,L=_.isScene===!0?_.background:null;L&&L.isTexture&&(L=(_.backgroundBlurriness>0?i:e).get(L)),L===null?b(h,m):L&&L.isColor&&(b(L,1),P=!0);const O=o.xr.getEnvironmentBlendMode();O==="additive"?r.buffers.color.setClear(0,0,0,1,d):O==="alpha-blend"&&r.buffers.color.setClear(0,0,0,0,d),(o.autoClear||P)&&o.clear(o.autoClearColor,o.autoClearDepth,o.autoClearStencil),L&&(L.isCubeTexture||L.mapping===Sc)?(g===void 0&&(g=new La(new Uo(1,1,1),new za({name:"BackgroundCubeMaterial",uniforms:_s(Ci.backgroundCube.uniforms),vertexShader:Ci.backgroundCube.vertexShader,fragmentShader:Ci.backgroundCube.fragmentShader,side:kn,depthTest:!1,depthWrite:!1,fog:!1})),g.geometry.deleteAttribute("normal"),g.geometry.deleteAttribute("uv"),g.onBeforeRender=function(k,F,B){this.matrixWorld.copyPosition(B.matrixWorld)},Object.defineProperty(g.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),l.update(g)),g.material.uniforms.envMap.value=L,g.material.uniforms.flipEnvMap.value=L.isCubeTexture&&L.isRenderTargetTexture===!1?-1:1,g.material.uniforms.backgroundBlurriness.value=_.backgroundBlurriness,g.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,g.material.toneMapped=Fe.getTransfer(L.colorSpace)!==je,(v!==L||x!==L.version||y!==o.toneMapping)&&(g.material.needsUpdate=!0,v=L,x=L.version,y=o.toneMapping),g.layers.enableAll(),S.unshift(g,g.geometry,g.material,0,0,null)):L&&L.isTexture&&(p===void 0&&(p=new La(new Rh(2,2),new za({name:"BackgroundMaterial",uniforms:_s(Ci.background.uniforms),vertexShader:Ci.background.vertexShader,fragmentShader:Ci.background.fragmentShader,side:Pa,depthTest:!1,depthWrite:!1,fog:!1})),p.geometry.deleteAttribute("normal"),Object.defineProperty(p.material,"map",{get:function(){return this.uniforms.t2D.value}}),l.update(p)),p.material.uniforms.t2D.value=L,p.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,p.material.toneMapped=Fe.getTransfer(L.colorSpace)!==je,L.matrixAutoUpdate===!0&&L.updateMatrix(),p.material.uniforms.uvTransform.value.copy(L.matrix),(v!==L||x!==L.version||y!==o.toneMapping)&&(p.material.needsUpdate=!0,v=L,x=L.version,y=o.toneMapping),p.layers.enableAll(),S.unshift(p,p.geometry,p.material,0,0,null))}function b(S,_){S.getRGB(sc,rv(o)),r.buffers.color.setClear(sc.r,sc.g,sc.b,_,d)}return{getClearColor:function(){return h},setClearColor:function(S,_=1){h.set(S),m=_,b(h,m)},getClearAlpha:function(){return m},setClearAlpha:function(S){m=S,b(h,m)},render:A}}function BE(o,e,i,r){const l=o.getParameter(o.MAX_VERTEX_ATTRIBS),u=r.isWebGL2?null:e.get("OES_vertex_array_object"),d=r.isWebGL2||u!==null,h={},m=S(null);let p=m,g=!1;function v(X,J,N,q,K){let ct=!1;if(d){const R=b(q,N,J);p!==R&&(p=R,y(p.object)),ct=_(X,q,N,K),ct&&P(X,q,N,K)}else{const R=J.wireframe===!0;(p.geometry!==q.id||p.program!==N.id||p.wireframe!==R)&&(p.geometry=q.id,p.program=N.id,p.wireframe=R,ct=!0)}K!==null&&i.update(K,o.ELEMENT_ARRAY_BUFFER),(ct||g)&&(g=!1,pt(X,J,N,q),K!==null&&o.bindBuffer(o.ELEMENT_ARRAY_BUFFER,i.get(K).buffer))}function x(){return r.isWebGL2?o.createVertexArray():u.createVertexArrayOES()}function y(X){return r.isWebGL2?o.bindVertexArray(X):u.bindVertexArrayOES(X)}function A(X){return r.isWebGL2?o.deleteVertexArray(X):u.deleteVertexArrayOES(X)}function b(X,J,N){const q=N.wireframe===!0;let K=h[X.id];K===void 0&&(K={},h[X.id]=K);let ct=K[J.id];ct===void 0&&(ct={},K[J.id]=ct);let R=ct[q];return R===void 0&&(R=S(x()),ct[q]=R),R}function S(X){const J=[],N=[],q=[];for(let K=0;K<l;K++)J[K]=0,N[K]=0,q[K]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:J,enabledAttributes:N,attributeDivisors:q,object:X,attributes:{},index:null}}function _(X,J,N,q){const K=p.attributes,ct=J.attributes;let R=0;const V=N.getAttributes();for(const j in V)if(V[j].location>=0){const $=K[j];let _t=ct[j];if(_t===void 0&&(j==="instanceMatrix"&&X.instanceMatrix&&(_t=X.instanceMatrix),j==="instanceColor"&&X.instanceColor&&(_t=X.instanceColor)),$===void 0||$.attribute!==_t||_t&&$.data!==_t.data)return!0;R++}return p.attributesNum!==R||p.index!==q}function P(X,J,N,q){const K={},ct=J.attributes;let R=0;const V=N.getAttributes();for(const j in V)if(V[j].location>=0){let $=ct[j];$===void 0&&(j==="instanceMatrix"&&X.instanceMatrix&&($=X.instanceMatrix),j==="instanceColor"&&X.instanceColor&&($=X.instanceColor));const _t={};_t.attribute=$,$&&$.data&&(_t.data=$.data),K[j]=_t,R++}p.attributes=K,p.attributesNum=R,p.index=q}function L(){const X=p.newAttributes;for(let J=0,N=X.length;J<N;J++)X[J]=0}function O(X){k(X,0)}function k(X,J){const N=p.newAttributes,q=p.enabledAttributes,K=p.attributeDivisors;N[X]=1,q[X]===0&&(o.enableVertexAttribArray(X),q[X]=1),K[X]!==J&&((r.isWebGL2?o:e.get("ANGLE_instanced_arrays"))[r.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](X,J),K[X]=J)}function F(){const X=p.newAttributes,J=p.enabledAttributes;for(let N=0,q=J.length;N<q;N++)J[N]!==X[N]&&(o.disableVertexAttribArray(N),J[N]=0)}function B(X,J,N,q,K,ct,R){R===!0?o.vertexAttribIPointer(X,J,N,K,ct):o.vertexAttribPointer(X,J,N,q,K,ct)}function pt(X,J,N,q){if(r.isWebGL2===!1&&(X.isInstancedMesh||q.isInstancedBufferGeometry)&&e.get("ANGLE_instanced_arrays")===null)return;L();const K=q.attributes,ct=N.getAttributes(),R=J.defaultAttributeValues;for(const V in ct){const j=ct[V];if(j.location>=0){let I=K[V];if(I===void 0&&(V==="instanceMatrix"&&X.instanceMatrix&&(I=X.instanceMatrix),V==="instanceColor"&&X.instanceColor&&(I=X.instanceColor)),I!==void 0){const $=I.normalized,_t=I.itemSize,vt=i.get(I);if(vt===void 0)continue;const Ot=vt.buffer,Pt=vt.type,Kt=vt.bytesPerElement,kt=r.isWebGL2===!0&&(Pt===o.INT||Pt===o.UNSIGNED_INT||I.gpuType===H_);if(I.isInterleavedBufferAttribute){const oe=I.data,nt=oe.stride,Ze=I.offset;if(oe.isInstancedInterleavedBuffer){for(let Wt=0;Wt<j.locationSize;Wt++)k(j.location+Wt,oe.meshPerAttribute);X.isInstancedMesh!==!0&&q._maxInstanceCount===void 0&&(q._maxInstanceCount=oe.meshPerAttribute*oe.count)}else for(let Wt=0;Wt<j.locationSize;Wt++)O(j.location+Wt);o.bindBuffer(o.ARRAY_BUFFER,Ot);for(let Wt=0;Wt<j.locationSize;Wt++)B(j.location+Wt,_t/j.locationSize,Pt,$,nt*Kt,(Ze+_t/j.locationSize*Wt)*Kt,kt)}else{if(I.isInstancedBufferAttribute){for(let oe=0;oe<j.locationSize;oe++)k(j.location+oe,I.meshPerAttribute);X.isInstancedMesh!==!0&&q._maxInstanceCount===void 0&&(q._maxInstanceCount=I.meshPerAttribute*I.count)}else for(let oe=0;oe<j.locationSize;oe++)O(j.location+oe);o.bindBuffer(o.ARRAY_BUFFER,Ot);for(let oe=0;oe<j.locationSize;oe++)B(j.location+oe,_t/j.locationSize,Pt,$,_t*Kt,_t/j.locationSize*oe*Kt,kt)}}else if(R!==void 0){const $=R[V];if($!==void 0)switch($.length){case 2:o.vertexAttrib2fv(j.location,$);break;case 3:o.vertexAttrib3fv(j.location,$);break;case 4:o.vertexAttrib4fv(j.location,$);break;default:o.vertexAttrib1fv(j.location,$)}}}}F()}function w(){ut();for(const X in h){const J=h[X];for(const N in J){const q=J[N];for(const K in q)A(q[K].object),delete q[K];delete J[N]}delete h[X]}}function U(X){if(h[X.id]===void 0)return;const J=h[X.id];for(const N in J){const q=J[N];for(const K in q)A(q[K].object),delete q[K];delete J[N]}delete h[X.id]}function lt(X){for(const J in h){const N=h[J];if(N[X.id]===void 0)continue;const q=N[X.id];for(const K in q)A(q[K].object),delete q[K];delete N[X.id]}}function ut(){Et(),g=!0,p!==m&&(p=m,y(p.object))}function Et(){m.geometry=null,m.program=null,m.wireframe=!1}return{setup:v,reset:ut,resetDefaultState:Et,dispose:w,releaseStatesOfGeometry:U,releaseStatesOfProgram:lt,initAttributes:L,enableAttribute:O,disableUnusedAttributes:F}}function IE(o,e,i,r){const l=r.isWebGL2;let u;function d(g){u=g}function h(g,v){o.drawArrays(u,g,v),i.update(v,u,1)}function m(g,v,x){if(x===0)return;let y,A;if(l)y=o,A="drawArraysInstanced";else if(y=e.get("ANGLE_instanced_arrays"),A="drawArraysInstancedANGLE",y===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}y[A](u,g,v,x),i.update(v,u,x)}function p(g,v,x){if(x===0)return;const y=e.get("WEBGL_multi_draw");if(y===null)for(let A=0;A<x;A++)this.render(g[A],v[A]);else{y.multiDrawArraysWEBGL(u,g,0,v,0,x);let A=0;for(let b=0;b<x;b++)A+=v[b];i.update(A,u,1)}}this.setMode=d,this.render=h,this.renderInstances=m,this.renderMultiDraw=p}function FE(o,e,i){let r;function l(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const B=e.get("EXT_texture_filter_anisotropic");r=o.getParameter(B.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function u(B){if(B==="highp"){if(o.getShaderPrecisionFormat(o.VERTEX_SHADER,o.HIGH_FLOAT).precision>0&&o.getShaderPrecisionFormat(o.FRAGMENT_SHADER,o.HIGH_FLOAT).precision>0)return"highp";B="mediump"}return B==="mediump"&&o.getShaderPrecisionFormat(o.VERTEX_SHADER,o.MEDIUM_FLOAT).precision>0&&o.getShaderPrecisionFormat(o.FRAGMENT_SHADER,o.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const d=typeof WebGL2RenderingContext<"u"&&o.constructor.name==="WebGL2RenderingContext";let h=i.precision!==void 0?i.precision:"highp";const m=u(h);m!==h&&(console.warn("THREE.WebGLRenderer:",h,"not supported, using",m,"instead."),h=m);const p=d||e.has("WEBGL_draw_buffers"),g=i.logarithmicDepthBuffer===!0,v=o.getParameter(o.MAX_TEXTURE_IMAGE_UNITS),x=o.getParameter(o.MAX_VERTEX_TEXTURE_IMAGE_UNITS),y=o.getParameter(o.MAX_TEXTURE_SIZE),A=o.getParameter(o.MAX_CUBE_MAP_TEXTURE_SIZE),b=o.getParameter(o.MAX_VERTEX_ATTRIBS),S=o.getParameter(o.MAX_VERTEX_UNIFORM_VECTORS),_=o.getParameter(o.MAX_VARYING_VECTORS),P=o.getParameter(o.MAX_FRAGMENT_UNIFORM_VECTORS),L=x>0,O=d||e.has("OES_texture_float"),k=L&&O,F=d?o.getParameter(o.MAX_SAMPLES):0;return{isWebGL2:d,drawBuffers:p,getMaxAnisotropy:l,getMaxPrecision:u,precision:h,logarithmicDepthBuffer:g,maxTextures:v,maxVertexTextures:x,maxTextureSize:y,maxCubemapSize:A,maxAttributes:b,maxVertexUniforms:S,maxVaryings:_,maxFragmentUniforms:P,vertexTextures:L,floatFragmentTextures:O,floatVertexTextures:k,maxSamples:F}}function HE(o){const e=this;let i=null,r=0,l=!1,u=!1;const d=new rr,h=new ye,m={value:null,needsUpdate:!1};this.uniform=m,this.numPlanes=0,this.numIntersection=0,this.init=function(v,x){const y=v.length!==0||x||r!==0||l;return l=x,r=v.length,y},this.beginShadows=function(){u=!0,g(null)},this.endShadows=function(){u=!1},this.setGlobalState=function(v,x){i=g(v,x,0)},this.setState=function(v,x,y){const A=v.clippingPlanes,b=v.clipIntersection,S=v.clipShadows,_=o.get(v);if(!l||A===null||A.length===0||u&&!S)u?g(null):p();else{const P=u?0:r,L=P*4;let O=_.clippingState||null;m.value=O,O=g(A,x,L,y);for(let k=0;k!==L;++k)O[k]=i[k];_.clippingState=O,this.numIntersection=b?this.numPlanes:0,this.numPlanes+=P}};function p(){m.value!==i&&(m.value=i,m.needsUpdate=r>0),e.numPlanes=r,e.numIntersection=0}function g(v,x,y,A){const b=v!==null?v.length:0;let S=null;if(b!==0){if(S=m.value,A!==!0||S===null){const _=y+b*4,P=x.matrixWorldInverse;h.getNormalMatrix(P),(S===null||S.length<_)&&(S=new Float32Array(_));for(let L=0,O=y;L!==b;++L,O+=4)d.copy(v[L]).applyMatrix4(P,h),d.normal.toArray(S,O),S[O+3]=d.constant}m.value=S,m.needsUpdate=!0}return e.numPlanes=b,e.numIntersection=0,S}}function GE(o){let e=new WeakMap;function i(d,h){return h===ph?d.mapping=ps:h===mh&&(d.mapping=ms),d}function r(d){if(d&&d.isTexture){const h=d.mapping;if(h===ph||h===mh)if(e.has(d)){const m=e.get(d).texture;return i(m,d.mapping)}else{const m=d.image;if(m&&m.height>0){const p=new $x(m.height/2);return p.fromEquirectangularTexture(o,d),e.set(d,p),d.addEventListener("dispose",l),i(p.texture,d.mapping)}else return null}}return d}function l(d){const h=d.target;h.removeEventListener("dispose",l);const m=e.get(h);m!==void 0&&(e.delete(h),m.dispose())}function u(){e=new WeakMap}return{get:r,dispose:u}}class VE extends sv{constructor(e=-1,i=1,r=1,l=-1,u=.1,d=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=i,this.top=r,this.bottom=l,this.near=u,this.far=d,this.updateProjectionMatrix()}copy(e,i){return super.copy(e,i),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,i,r,l,u,d){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=i,this.view.offsetX=r,this.view.offsetY=l,this.view.width=u,this.view.height=d,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),i=(this.top-this.bottom)/(2*this.zoom),r=(this.right+this.left)/2,l=(this.top+this.bottom)/2;let u=r-e,d=r+e,h=l+i,m=l-i;if(this.view!==null&&this.view.enabled){const p=(this.right-this.left)/this.view.fullWidth/this.zoom,g=(this.top-this.bottom)/this.view.fullHeight/this.zoom;u+=p*this.view.offsetX,d=u+p*this.view.width,h-=g*this.view.offsetY,m=h-g*this.view.height}this.projectionMatrix.makeOrthographic(u,d,h,m,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const i=super.toJSON(e);return i.object.zoom=this.zoom,i.object.left=this.left,i.object.right=this.right,i.object.top=this.top,i.object.bottom=this.bottom,i.object.near=this.near,i.object.far=this.far,this.view!==null&&(i.object.view=Object.assign({},this.view)),i}}const us=4,u_=[.125,.215,.35,.446,.526,.582],lr=20,ih=new VE,f_=new pe;let ah=null,rh=0,sh=0;const sr=(1+Math.sqrt(5))/2,cs=1/sr,h_=[new st(1,1,1),new st(-1,1,1),new st(1,1,-1),new st(-1,1,-1),new st(0,sr,cs),new st(0,sr,-cs),new st(cs,0,sr),new st(-cs,0,sr),new st(sr,cs,0),new st(-sr,cs,0)];class d_{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,i=0,r=.1,l=100){ah=this._renderer.getRenderTarget(),rh=this._renderer.getActiveCubeFace(),sh=this._renderer.getActiveMipmapLevel(),this._setSize(256);const u=this._allocateTargets();return u.depthBuffer=!0,this._sceneToCubeUV(e,r,l,u),i>0&&this._blur(u,0,0,i),this._applyPMREM(u),this._cleanup(u),u}fromEquirectangular(e,i=null){return this._fromTexture(e,i)}fromCubemap(e,i=null){return this._fromTexture(e,i)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=g_(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=m_(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(ah,rh,sh),e.scissorTest=!1,oc(e,0,0,e.width,e.height)}_fromTexture(e,i){e.mapping===ps||e.mapping===ms?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),ah=this._renderer.getRenderTarget(),rh=this._renderer.getActiveCubeFace(),sh=this._renderer.getActiveMipmapLevel();const r=i||this._allocateTargets();return this._textureToCubeUV(e,r),this._applyPMREM(r),this._cleanup(r),r}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),i=4*this._cubeSize,r={magFilter:ui,minFilter:ui,generateMipmaps:!1,type:Ro,format:Ei,colorSpace:$i,depthBuffer:!1},l=p_(e,i,r);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==i){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=p_(e,i,r);const{_lodMax:u}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=kE(u)),this._blurMaterial=XE(u,e,i)}return l}_compileMaterial(e){const i=new La(this._lodPlanes[0],e);this._renderer.compile(i,ih)}_sceneToCubeUV(e,i,r,l){const h=new fi(90,1,i,r),m=[1,-1,1,1,1,1],p=[1,1,1,-1,-1,-1],g=this._renderer,v=g.autoClear,x=g.toneMapping;g.getClearColor(f_),g.toneMapping=Na,g.autoClear=!1;const y=new nv({name:"PMREM.Background",side:kn,depthWrite:!1,depthTest:!1}),A=new La(new Uo,y);let b=!1;const S=e.background;S?S.isColor&&(y.color.copy(S),e.background=null,b=!0):(y.color.copy(f_),b=!0);for(let _=0;_<6;_++){const P=_%3;P===0?(h.up.set(0,m[_],0),h.lookAt(p[_],0,0)):P===1?(h.up.set(0,0,m[_]),h.lookAt(0,p[_],0)):(h.up.set(0,m[_],0),h.lookAt(0,0,p[_]));const L=this._cubeSize;oc(l,P*L,_>2?L:0,L,L),g.setRenderTarget(l),b&&g.render(A,h),g.render(e,h)}A.geometry.dispose(),A.material.dispose(),g.toneMapping=x,g.autoClear=v,e.background=S}_textureToCubeUV(e,i){const r=this._renderer,l=e.mapping===ps||e.mapping===ms;l?(this._cubemapMaterial===null&&(this._cubemapMaterial=g_()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=m_());const u=l?this._cubemapMaterial:this._equirectMaterial,d=new La(this._lodPlanes[0],u),h=u.uniforms;h.envMap.value=e;const m=this._cubeSize;oc(i,0,0,3*m,2*m),r.setRenderTarget(i),r.render(d,ih)}_applyPMREM(e){const i=this._renderer,r=i.autoClear;i.autoClear=!1;for(let l=1;l<this._lodPlanes.length;l++){const u=Math.sqrt(this._sigmas[l]*this._sigmas[l]-this._sigmas[l-1]*this._sigmas[l-1]),d=h_[(l-1)%h_.length];this._blur(e,l-1,l,u,d)}i.autoClear=r}_blur(e,i,r,l,u){const d=this._pingPongRenderTarget;this._halfBlur(e,d,i,r,l,"latitudinal",u),this._halfBlur(d,e,r,r,l,"longitudinal",u)}_halfBlur(e,i,r,l,u,d,h){const m=this._renderer,p=this._blurMaterial;d!=="latitudinal"&&d!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const g=3,v=new La(this._lodPlanes[l],p),x=p.uniforms,y=this._sizeLods[r]-1,A=isFinite(u)?Math.PI/(2*y):2*Math.PI/(2*lr-1),b=u/A,S=isFinite(u)?1+Math.floor(g*b):lr;S>lr&&console.warn(`sigmaRadians, ${u}, is too large and will clip, as it requested ${S} samples when the maximum is set to ${lr}`);const _=[];let P=0;for(let B=0;B<lr;++B){const pt=B/b,w=Math.exp(-pt*pt/2);_.push(w),B===0?P+=w:B<S&&(P+=2*w)}for(let B=0;B<_.length;B++)_[B]=_[B]/P;x.envMap.value=e.texture,x.samples.value=S,x.weights.value=_,x.latitudinal.value=d==="latitudinal",h&&(x.poleAxis.value=h);const{_lodMax:L}=this;x.dTheta.value=A,x.mipInt.value=L-r;const O=this._sizeLods[l],k=3*O*(l>L-us?l-L+us:0),F=4*(this._cubeSize-O);oc(i,k,F,3*O,2*O),m.setRenderTarget(i),m.render(v,ih)}}function kE(o){const e=[],i=[],r=[];let l=o;const u=o-us+1+u_.length;for(let d=0;d<u;d++){const h=Math.pow(2,l);i.push(h);let m=1/h;d>o-us?m=u_[d-o+us-1]:d===0&&(m=0),r.push(m);const p=1/(h-2),g=-p,v=1+p,x=[g,g,v,g,v,v,g,g,v,v,g,v],y=6,A=6,b=3,S=2,_=1,P=new Float32Array(b*A*y),L=new Float32Array(S*A*y),O=new Float32Array(_*A*y);for(let F=0;F<y;F++){const B=F%3*2/3-1,pt=F>2?0:-1,w=[B,pt,0,B+2/3,pt,0,B+2/3,pt+1,0,B,pt,0,B+2/3,pt+1,0,B,pt+1,0];P.set(w,b*A*F),L.set(x,S*A*F);const U=[F,F,F,F,F,F];O.set(U,_*A*F)}const k=new ta;k.setAttribute("position",new di(P,b)),k.setAttribute("uv",new di(L,S)),k.setAttribute("faceIndex",new di(O,_)),e.push(k),l>us&&l--}return{lodPlanes:e,sizeLods:i,sigmas:r}}function p_(o,e,i){const r=new dr(o,e,i);return r.texture.mapping=Sc,r.texture.name="PMREM.cubeUv",r.scissorTest=!0,r}function oc(o,e,i,r,l){o.viewport.set(e,i,r,l),o.scissor.set(e,i,r,l)}function XE(o,e,i){const r=new Float32Array(lr),l=new st(0,1,0);return new za({name:"SphericalGaussianBlur",defines:{n:lr,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/i,CUBEUV_MAX_MIP:`${o}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:r},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:l}},vertexShader:wh(),fragmentShader:`

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
		`,blending:Ua,depthTest:!1,depthWrite:!1})}function m_(){return new za({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:wh(),fragmentShader:`

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
		`,blending:Ua,depthTest:!1,depthWrite:!1})}function g_(){return new za({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:wh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Ua,depthTest:!1,depthWrite:!1})}function wh(){return`

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
	`}function WE(o){let e=new WeakMap,i=null;function r(h){if(h&&h.isTexture){const m=h.mapping,p=m===ph||m===mh,g=m===ps||m===ms;if(p||g)if(h.isRenderTargetTexture&&h.needsPMREMUpdate===!0){h.needsPMREMUpdate=!1;let v=e.get(h);return i===null&&(i=new d_(o)),v=p?i.fromEquirectangular(h,v):i.fromCubemap(h,v),e.set(h,v),v.texture}else{if(e.has(h))return e.get(h).texture;{const v=h.image;if(p&&v&&v.height>0||g&&v&&l(v)){i===null&&(i=new d_(o));const x=p?i.fromEquirectangular(h):i.fromCubemap(h);return e.set(h,x),h.addEventListener("dispose",u),x.texture}else return null}}}return h}function l(h){let m=0;const p=6;for(let g=0;g<p;g++)h[g]!==void 0&&m++;return m===p}function u(h){const m=h.target;m.removeEventListener("dispose",u);const p=e.get(m);p!==void 0&&(e.delete(m),p.dispose())}function d(){e=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:r,dispose:d}}function qE(o){const e={};function i(r){if(e[r]!==void 0)return e[r];let l;switch(r){case"WEBGL_depth_texture":l=o.getExtension("WEBGL_depth_texture")||o.getExtension("MOZ_WEBGL_depth_texture")||o.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":l=o.getExtension("EXT_texture_filter_anisotropic")||o.getExtension("MOZ_EXT_texture_filter_anisotropic")||o.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":l=o.getExtension("WEBGL_compressed_texture_s3tc")||o.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||o.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":l=o.getExtension("WEBGL_compressed_texture_pvrtc")||o.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:l=o.getExtension(r)}return e[r]=l,l}return{has:function(r){return i(r)!==null},init:function(r){r.isWebGL2?(i("EXT_color_buffer_float"),i("WEBGL_clip_cull_distance")):(i("WEBGL_depth_texture"),i("OES_texture_float"),i("OES_texture_half_float"),i("OES_texture_half_float_linear"),i("OES_standard_derivatives"),i("OES_element_index_uint"),i("OES_vertex_array_object"),i("ANGLE_instanced_arrays")),i("OES_texture_float_linear"),i("EXT_color_buffer_half_float"),i("WEBGL_multisampled_render_to_texture")},get:function(r){const l=i(r);return l===null&&console.warn("THREE.WebGLRenderer: "+r+" extension not supported."),l}}}function YE(o,e,i,r){const l={},u=new WeakMap;function d(v){const x=v.target;x.index!==null&&e.remove(x.index);for(const A in x.attributes)e.remove(x.attributes[A]);for(const A in x.morphAttributes){const b=x.morphAttributes[A];for(let S=0,_=b.length;S<_;S++)e.remove(b[S])}x.removeEventListener("dispose",d),delete l[x.id];const y=u.get(x);y&&(e.remove(y),u.delete(x)),r.releaseStatesOfGeometry(x),x.isInstancedBufferGeometry===!0&&delete x._maxInstanceCount,i.memory.geometries--}function h(v,x){return l[x.id]===!0||(x.addEventListener("dispose",d),l[x.id]=!0,i.memory.geometries++),x}function m(v){const x=v.attributes;for(const A in x)e.update(x[A],o.ARRAY_BUFFER);const y=v.morphAttributes;for(const A in y){const b=y[A];for(let S=0,_=b.length;S<_;S++)e.update(b[S],o.ARRAY_BUFFER)}}function p(v){const x=[],y=v.index,A=v.attributes.position;let b=0;if(y!==null){const P=y.array;b=y.version;for(let L=0,O=P.length;L<O;L+=3){const k=P[L+0],F=P[L+1],B=P[L+2];x.push(k,F,F,B,B,k)}}else if(A!==void 0){const P=A.array;b=A.version;for(let L=0,O=P.length/3-1;L<O;L+=3){const k=L+0,F=L+1,B=L+2;x.push(k,F,F,B,B,k)}}else return;const S=new(Z_(x)?av:iv)(x,1);S.version=b;const _=u.get(v);_&&e.remove(_),u.set(v,S)}function g(v){const x=u.get(v);if(x){const y=v.index;y!==null&&x.version<y.version&&p(v)}else p(v);return u.get(v)}return{get:h,update:m,getWireframeAttribute:g}}function jE(o,e,i,r){const l=r.isWebGL2;let u;function d(y){u=y}let h,m;function p(y){h=y.type,m=y.bytesPerElement}function g(y,A){o.drawElements(u,A,h,y*m),i.update(A,u,1)}function v(y,A,b){if(b===0)return;let S,_;if(l)S=o,_="drawElementsInstanced";else if(S=e.get("ANGLE_instanced_arrays"),_="drawElementsInstancedANGLE",S===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}S[_](u,A,h,y*m,b),i.update(A,u,b)}function x(y,A,b){if(b===0)return;const S=e.get("WEBGL_multi_draw");if(S===null)for(let _=0;_<b;_++)this.render(y[_]/m,A[_]);else{S.multiDrawElementsWEBGL(u,A,0,h,y,0,b);let _=0;for(let P=0;P<b;P++)_+=A[P];i.update(_,u,1)}}this.setMode=d,this.setIndex=p,this.render=g,this.renderInstances=v,this.renderMultiDraw=x}function ZE(o){const e={geometries:0,textures:0},i={frame:0,calls:0,triangles:0,points:0,lines:0};function r(u,d,h){switch(i.calls++,d){case o.TRIANGLES:i.triangles+=h*(u/3);break;case o.LINES:i.lines+=h*(u/2);break;case o.LINE_STRIP:i.lines+=h*(u-1);break;case o.LINE_LOOP:i.lines+=h*u;break;case o.POINTS:i.points+=h*u;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",d);break}}function l(){i.calls=0,i.triangles=0,i.points=0,i.lines=0}return{memory:e,render:i,programs:null,autoReset:!0,reset:l,update:r}}function KE(o,e){return o[0]-e[0]}function QE(o,e){return Math.abs(e[1])-Math.abs(o[1])}function JE(o,e,i){const r={},l=new Float32Array(8),u=new WeakMap,d=new bn,h=[];for(let p=0;p<8;p++)h[p]=[p,0];function m(p,g,v){const x=p.morphTargetInfluences;if(e.isWebGL2===!0){const A=g.morphAttributes.position||g.morphAttributes.normal||g.morphAttributes.color,b=A!==void 0?A.length:0;let S=u.get(g);if(S===void 0||S.count!==b){let J=function(){Et.dispose(),u.delete(g),g.removeEventListener("dispose",J)};var y=J;S!==void 0&&S.texture.dispose();const L=g.morphAttributes.position!==void 0,O=g.morphAttributes.normal!==void 0,k=g.morphAttributes.color!==void 0,F=g.morphAttributes.position||[],B=g.morphAttributes.normal||[],pt=g.morphAttributes.color||[];let w=0;L===!0&&(w=1),O===!0&&(w=2),k===!0&&(w=3);let U=g.attributes.position.count*w,lt=1;U>e.maxTextureSize&&(lt=Math.ceil(U/e.maxTextureSize),U=e.maxTextureSize);const ut=new Float32Array(U*lt*4*b),Et=new J_(ut,U,lt,b);Et.type=Da,Et.needsUpdate=!0;const X=w*4;for(let N=0;N<b;N++){const q=F[N],K=B[N],ct=pt[N],R=U*lt*4*N;for(let V=0;V<q.count;V++){const j=V*X;L===!0&&(d.fromBufferAttribute(q,V),ut[R+j+0]=d.x,ut[R+j+1]=d.y,ut[R+j+2]=d.z,ut[R+j+3]=0),O===!0&&(d.fromBufferAttribute(K,V),ut[R+j+4]=d.x,ut[R+j+5]=d.y,ut[R+j+6]=d.z,ut[R+j+7]=0),k===!0&&(d.fromBufferAttribute(ct,V),ut[R+j+8]=d.x,ut[R+j+9]=d.y,ut[R+j+10]=d.z,ut[R+j+11]=ct.itemSize===4?d.w:1)}}S={count:b,texture:Et,size:new He(U,lt)},u.set(g,S),g.addEventListener("dispose",J)}let _=0;for(let L=0;L<x.length;L++)_+=x[L];const P=g.morphTargetsRelative?1:1-_;v.getUniforms().setValue(o,"morphTargetBaseInfluence",P),v.getUniforms().setValue(o,"morphTargetInfluences",x),v.getUniforms().setValue(o,"morphTargetsTexture",S.texture,i),v.getUniforms().setValue(o,"morphTargetsTextureSize",S.size)}else{const A=x===void 0?0:x.length;let b=r[g.id];if(b===void 0||b.length!==A){b=[];for(let O=0;O<A;O++)b[O]=[O,0];r[g.id]=b}for(let O=0;O<A;O++){const k=b[O];k[0]=O,k[1]=x[O]}b.sort(QE);for(let O=0;O<8;O++)O<A&&b[O][1]?(h[O][0]=b[O][0],h[O][1]=b[O][1]):(h[O][0]=Number.MAX_SAFE_INTEGER,h[O][1]=0);h.sort(KE);const S=g.morphAttributes.position,_=g.morphAttributes.normal;let P=0;for(let O=0;O<8;O++){const k=h[O],F=k[0],B=k[1];F!==Number.MAX_SAFE_INTEGER&&B?(S&&g.getAttribute("morphTarget"+O)!==S[F]&&g.setAttribute("morphTarget"+O,S[F]),_&&g.getAttribute("morphNormal"+O)!==_[F]&&g.setAttribute("morphNormal"+O,_[F]),l[O]=B,P+=B):(S&&g.hasAttribute("morphTarget"+O)===!0&&g.deleteAttribute("morphTarget"+O),_&&g.hasAttribute("morphNormal"+O)===!0&&g.deleteAttribute("morphNormal"+O),l[O]=0)}const L=g.morphTargetsRelative?1:1-P;v.getUniforms().setValue(o,"morphTargetBaseInfluence",L),v.getUniforms().setValue(o,"morphTargetInfluences",l)}}return{update:m}}function $E(o,e,i,r){let l=new WeakMap;function u(m){const p=r.render.frame,g=m.geometry,v=e.get(m,g);if(l.get(v)!==p&&(e.update(v),l.set(v,p)),m.isInstancedMesh&&(m.hasEventListener("dispose",h)===!1&&m.addEventListener("dispose",h),l.get(m)!==p&&(i.update(m.instanceMatrix,o.ARRAY_BUFFER),m.instanceColor!==null&&i.update(m.instanceColor,o.ARRAY_BUFFER),l.set(m,p))),m.isSkinnedMesh){const x=m.skeleton;l.get(x)!==p&&(x.update(),l.set(x,p))}return v}function d(){l=new WeakMap}function h(m){const p=m.target;p.removeEventListener("dispose",h),i.remove(p.instanceMatrix),p.instanceColor!==null&&i.remove(p.instanceColor)}return{update:u,dispose:d}}class uv extends ti{constructor(e,i,r,l,u,d,h,m,p,g){if(g=g!==void 0?g:ur,g!==ur&&g!==gs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");r===void 0&&g===ur&&(r=Ca),r===void 0&&g===gs&&(r=cr),super(null,l,u,d,h,m,g,r,p),this.isDepthTexture=!0,this.image={width:e,height:i},this.magFilter=h!==void 0?h:Pn,this.minFilter=m!==void 0?m:Pn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const i=super.toJSON(e);return this.compareFunction!==null&&(i.compareFunction=this.compareFunction),i}}const fv=new ti,hv=new uv(1,1);hv.compareFunction=j_;const dv=new J_,pv=new zx,mv=new ov,__=[],v_=[],S_=new Float32Array(16),x_=new Float32Array(9),M_=new Float32Array(4);function Ss(o,e,i){const r=o[0];if(r<=0||r>0)return o;const l=e*i;let u=__[l];if(u===void 0&&(u=new Float32Array(l),__[l]=u),e!==0){r.toArray(u,0);for(let d=1,h=0;d!==e;++d)h+=i,o[d].toArray(u,h)}return u}function fn(o,e){if(o.length!==e.length)return!1;for(let i=0,r=o.length;i<r;i++)if(o[i]!==e[i])return!1;return!0}function hn(o,e){for(let i=0,r=e.length;i<r;i++)o[i]=e[i]}function Ec(o,e){let i=v_[e];i===void 0&&(i=new Int32Array(e),v_[e]=i);for(let r=0;r!==e;++r)i[r]=o.allocateTextureUnit();return i}function tT(o,e){const i=this.cache;i[0]!==e&&(o.uniform1f(this.addr,e),i[0]=e)}function eT(o,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y)&&(o.uniform2f(this.addr,e.x,e.y),i[0]=e.x,i[1]=e.y);else{if(fn(i,e))return;o.uniform2fv(this.addr,e),hn(i,e)}}function nT(o,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y||i[2]!==e.z)&&(o.uniform3f(this.addr,e.x,e.y,e.z),i[0]=e.x,i[1]=e.y,i[2]=e.z);else if(e.r!==void 0)(i[0]!==e.r||i[1]!==e.g||i[2]!==e.b)&&(o.uniform3f(this.addr,e.r,e.g,e.b),i[0]=e.r,i[1]=e.g,i[2]=e.b);else{if(fn(i,e))return;o.uniform3fv(this.addr,e),hn(i,e)}}function iT(o,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y||i[2]!==e.z||i[3]!==e.w)&&(o.uniform4f(this.addr,e.x,e.y,e.z,e.w),i[0]=e.x,i[1]=e.y,i[2]=e.z,i[3]=e.w);else{if(fn(i,e))return;o.uniform4fv(this.addr,e),hn(i,e)}}function aT(o,e){const i=this.cache,r=e.elements;if(r===void 0){if(fn(i,e))return;o.uniformMatrix2fv(this.addr,!1,e),hn(i,e)}else{if(fn(i,r))return;M_.set(r),o.uniformMatrix2fv(this.addr,!1,M_),hn(i,r)}}function rT(o,e){const i=this.cache,r=e.elements;if(r===void 0){if(fn(i,e))return;o.uniformMatrix3fv(this.addr,!1,e),hn(i,e)}else{if(fn(i,r))return;x_.set(r),o.uniformMatrix3fv(this.addr,!1,x_),hn(i,r)}}function sT(o,e){const i=this.cache,r=e.elements;if(r===void 0){if(fn(i,e))return;o.uniformMatrix4fv(this.addr,!1,e),hn(i,e)}else{if(fn(i,r))return;S_.set(r),o.uniformMatrix4fv(this.addr,!1,S_),hn(i,r)}}function oT(o,e){const i=this.cache;i[0]!==e&&(o.uniform1i(this.addr,e),i[0]=e)}function lT(o,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y)&&(o.uniform2i(this.addr,e.x,e.y),i[0]=e.x,i[1]=e.y);else{if(fn(i,e))return;o.uniform2iv(this.addr,e),hn(i,e)}}function cT(o,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y||i[2]!==e.z)&&(o.uniform3i(this.addr,e.x,e.y,e.z),i[0]=e.x,i[1]=e.y,i[2]=e.z);else{if(fn(i,e))return;o.uniform3iv(this.addr,e),hn(i,e)}}function uT(o,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y||i[2]!==e.z||i[3]!==e.w)&&(o.uniform4i(this.addr,e.x,e.y,e.z,e.w),i[0]=e.x,i[1]=e.y,i[2]=e.z,i[3]=e.w);else{if(fn(i,e))return;o.uniform4iv(this.addr,e),hn(i,e)}}function fT(o,e){const i=this.cache;i[0]!==e&&(o.uniform1ui(this.addr,e),i[0]=e)}function hT(o,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y)&&(o.uniform2ui(this.addr,e.x,e.y),i[0]=e.x,i[1]=e.y);else{if(fn(i,e))return;o.uniform2uiv(this.addr,e),hn(i,e)}}function dT(o,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y||i[2]!==e.z)&&(o.uniform3ui(this.addr,e.x,e.y,e.z),i[0]=e.x,i[1]=e.y,i[2]=e.z);else{if(fn(i,e))return;o.uniform3uiv(this.addr,e),hn(i,e)}}function pT(o,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y||i[2]!==e.z||i[3]!==e.w)&&(o.uniform4ui(this.addr,e.x,e.y,e.z,e.w),i[0]=e.x,i[1]=e.y,i[2]=e.z,i[3]=e.w);else{if(fn(i,e))return;o.uniform4uiv(this.addr,e),hn(i,e)}}function mT(o,e,i){const r=this.cache,l=i.allocateTextureUnit();r[0]!==l&&(o.uniform1i(this.addr,l),r[0]=l);const u=this.type===o.SAMPLER_2D_SHADOW?hv:fv;i.setTexture2D(e||u,l)}function gT(o,e,i){const r=this.cache,l=i.allocateTextureUnit();r[0]!==l&&(o.uniform1i(this.addr,l),r[0]=l),i.setTexture3D(e||pv,l)}function _T(o,e,i){const r=this.cache,l=i.allocateTextureUnit();r[0]!==l&&(o.uniform1i(this.addr,l),r[0]=l),i.setTextureCube(e||mv,l)}function vT(o,e,i){const r=this.cache,l=i.allocateTextureUnit();r[0]!==l&&(o.uniform1i(this.addr,l),r[0]=l),i.setTexture2DArray(e||dv,l)}function ST(o){switch(o){case 5126:return tT;case 35664:return eT;case 35665:return nT;case 35666:return iT;case 35674:return aT;case 35675:return rT;case 35676:return sT;case 5124:case 35670:return oT;case 35667:case 35671:return lT;case 35668:case 35672:return cT;case 35669:case 35673:return uT;case 5125:return fT;case 36294:return hT;case 36295:return dT;case 36296:return pT;case 35678:case 36198:case 36298:case 36306:case 35682:return mT;case 35679:case 36299:case 36307:return gT;case 35680:case 36300:case 36308:case 36293:return _T;case 36289:case 36303:case 36311:case 36292:return vT}}function xT(o,e){o.uniform1fv(this.addr,e)}function MT(o,e){const i=Ss(e,this.size,2);o.uniform2fv(this.addr,i)}function yT(o,e){const i=Ss(e,this.size,3);o.uniform3fv(this.addr,i)}function ET(o,e){const i=Ss(e,this.size,4);o.uniform4fv(this.addr,i)}function TT(o,e){const i=Ss(e,this.size,4);o.uniformMatrix2fv(this.addr,!1,i)}function bT(o,e){const i=Ss(e,this.size,9);o.uniformMatrix3fv(this.addr,!1,i)}function AT(o,e){const i=Ss(e,this.size,16);o.uniformMatrix4fv(this.addr,!1,i)}function RT(o,e){o.uniform1iv(this.addr,e)}function wT(o,e){o.uniform2iv(this.addr,e)}function CT(o,e){o.uniform3iv(this.addr,e)}function DT(o,e){o.uniform4iv(this.addr,e)}function LT(o,e){o.uniform1uiv(this.addr,e)}function UT(o,e){o.uniform2uiv(this.addr,e)}function NT(o,e){o.uniform3uiv(this.addr,e)}function OT(o,e){o.uniform4uiv(this.addr,e)}function PT(o,e,i){const r=this.cache,l=e.length,u=Ec(i,l);fn(r,u)||(o.uniform1iv(this.addr,u),hn(r,u));for(let d=0;d!==l;++d)i.setTexture2D(e[d]||fv,u[d])}function zT(o,e,i){const r=this.cache,l=e.length,u=Ec(i,l);fn(r,u)||(o.uniform1iv(this.addr,u),hn(r,u));for(let d=0;d!==l;++d)i.setTexture3D(e[d]||pv,u[d])}function BT(o,e,i){const r=this.cache,l=e.length,u=Ec(i,l);fn(r,u)||(o.uniform1iv(this.addr,u),hn(r,u));for(let d=0;d!==l;++d)i.setTextureCube(e[d]||mv,u[d])}function IT(o,e,i){const r=this.cache,l=e.length,u=Ec(i,l);fn(r,u)||(o.uniform1iv(this.addr,u),hn(r,u));for(let d=0;d!==l;++d)i.setTexture2DArray(e[d]||dv,u[d])}function FT(o){switch(o){case 5126:return xT;case 35664:return MT;case 35665:return yT;case 35666:return ET;case 35674:return TT;case 35675:return bT;case 35676:return AT;case 5124:case 35670:return RT;case 35667:case 35671:return wT;case 35668:case 35672:return CT;case 35669:case 35673:return DT;case 5125:return LT;case 36294:return UT;case 36295:return NT;case 36296:return OT;case 35678:case 36198:case 36298:case 36306:case 35682:return PT;case 35679:case 36299:case 36307:return zT;case 35680:case 36300:case 36308:case 36293:return BT;case 36289:case 36303:case 36311:case 36292:return IT}}class HT{constructor(e,i,r){this.id=e,this.addr=r,this.cache=[],this.type=i.type,this.setValue=ST(i.type)}}class GT{constructor(e,i,r){this.id=e,this.addr=r,this.cache=[],this.type=i.type,this.size=i.size,this.setValue=FT(i.type)}}class VT{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,i,r){const l=this.seq;for(let u=0,d=l.length;u!==d;++u){const h=l[u];h.setValue(e,i[h.id],r)}}}const oh=/(\w+)(\])?(\[|\.)?/g;function y_(o,e){o.seq.push(e),o.map[e.id]=e}function kT(o,e,i){const r=o.name,l=r.length;for(oh.lastIndex=0;;){const u=oh.exec(r),d=oh.lastIndex;let h=u[1];const m=u[2]==="]",p=u[3];if(m&&(h=h|0),p===void 0||p==="["&&d+2===l){y_(i,p===void 0?new HT(h,o,e):new GT(h,o,e));break}else{let v=i.map[h];v===void 0&&(v=new VT(h),y_(i,v)),i=v}}}class hc{constructor(e,i){this.seq=[],this.map={};const r=e.getProgramParameter(i,e.ACTIVE_UNIFORMS);for(let l=0;l<r;++l){const u=e.getActiveUniform(i,l),d=e.getUniformLocation(i,u.name);kT(u,d,this)}}setValue(e,i,r,l){const u=this.map[i];u!==void 0&&u.setValue(e,r,l)}setOptional(e,i,r){const l=i[r];l!==void 0&&this.setValue(e,r,l)}static upload(e,i,r,l){for(let u=0,d=i.length;u!==d;++u){const h=i[u],m=r[h.id];m.needsUpdate!==!1&&h.setValue(e,m.value,l)}}static seqWithValue(e,i){const r=[];for(let l=0,u=e.length;l!==u;++l){const d=e[l];d.id in i&&r.push(d)}return r}}function E_(o,e,i){const r=o.createShader(e);return o.shaderSource(r,i),o.compileShader(r),r}const XT=37297;let WT=0;function qT(o,e){const i=o.split(`
`),r=[],l=Math.max(e-6,0),u=Math.min(e+6,i.length);for(let d=l;d<u;d++){const h=d+1;r.push(`${h===e?">":" "} ${h}: ${i[d]}`)}return r.join(`
`)}function YT(o){const e=Fe.getPrimaries(Fe.workingColorSpace),i=Fe.getPrimaries(o);let r;switch(e===i?r="":e===gc&&i===mc?r="LinearDisplayP3ToLinearSRGB":e===mc&&i===gc&&(r="LinearSRGBToLinearDisplayP3"),o){case $i:case xc:return[r,"LinearTransferOETF"];case Tn:case Ah:return[r,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",o),[r,"LinearTransferOETF"]}}function T_(o,e,i){const r=o.getShaderParameter(e,o.COMPILE_STATUS),l=o.getShaderInfoLog(e).trim();if(r&&l==="")return"";const u=/ERROR: 0:(\d+)/.exec(l);if(u){const d=parseInt(u[1]);return i.toUpperCase()+`

`+l+`

`+qT(o.getShaderSource(e),d)}else return l}function jT(o,e){const i=YT(e);return`vec4 ${o}( vec4 value ) { return ${i[0]}( ${i[1]}( value ) ); }`}function ZT(o,e){let i;switch(e){case ax:i="Linear";break;case rx:i="Reinhard";break;case sx:i="OptimizedCineon";break;case ox:i="ACESFilmic";break;case cx:i="AgX";break;case lx:i="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),i="Linear"}return"vec3 "+o+"( vec3 color ) { return "+i+"ToneMapping( color ); }"}function KT(o){return[o.extensionDerivatives||o.envMapCubeUVHeight||o.bumpMap||o.normalMapTangentSpace||o.clearcoatNormalMap||o.flatShading||o.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(o.extensionFragDepth||o.logarithmicDepthBuffer)&&o.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",o.extensionDrawBuffers&&o.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(o.extensionShaderTextureLOD||o.envMap||o.transmission)&&o.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(fs).join(`
`)}function QT(o){return[o.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(fs).join(`
`)}function JT(o){const e=[];for(const i in o){const r=o[i];r!==!1&&e.push("#define "+i+" "+r)}return e.join(`
`)}function $T(o,e){const i={},r=o.getProgramParameter(e,o.ACTIVE_ATTRIBUTES);for(let l=0;l<r;l++){const u=o.getActiveAttrib(e,l),d=u.name;let h=1;u.type===o.FLOAT_MAT2&&(h=2),u.type===o.FLOAT_MAT3&&(h=3),u.type===o.FLOAT_MAT4&&(h=4),i[d]={type:u.type,location:o.getAttribLocation(e,d),locationSize:h}}return i}function fs(o){return o!==""}function b_(o,e){const i=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return o.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,i).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function A_(o,e){return o.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const tb=/^[ \t]*#include +<([\w\d./]+)>/gm;function Mh(o){return o.replace(tb,nb)}const eb=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function nb(o,e){let i=ve[e];if(i===void 0){const r=eb.get(e);if(r!==void 0)i=ve[r],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,r);else throw new Error("Can not resolve #include <"+e+">")}return Mh(i)}const ib=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function R_(o){return o.replace(ib,ab)}function ab(o,e,i,r){let l="";for(let u=parseInt(e);u<parseInt(i);u++)l+=r.replace(/\[\s*i\s*\]/g,"[ "+u+" ]").replace(/UNROLLED_LOOP_INDEX/g,u);return l}function w_(o){let e="precision "+o.precision+` float;
precision `+o.precision+" int;";return o.precision==="highp"?e+=`
#define HIGH_PRECISION`:o.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:o.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function rb(o){let e="SHADOWMAP_TYPE_BASIC";return o.shadowMapType===B_?e="SHADOWMAP_TYPE_PCF":o.shadowMapType===US?e="SHADOWMAP_TYPE_PCF_SOFT":o.shadowMapType===Ki&&(e="SHADOWMAP_TYPE_VSM"),e}function sb(o){let e="ENVMAP_TYPE_CUBE";if(o.envMap)switch(o.envMapMode){case ps:case ms:e="ENVMAP_TYPE_CUBE";break;case Sc:e="ENVMAP_TYPE_CUBE_UV";break}return e}function ob(o){let e="ENVMAP_MODE_REFLECTION";return o.envMap&&o.envMapMode===ms&&(e="ENVMAP_MODE_REFRACTION"),e}function lb(o){let e="ENVMAP_BLENDING_NONE";if(o.envMap)switch(o.combine){case I_:e="ENVMAP_BLENDING_MULTIPLY";break;case nx:e="ENVMAP_BLENDING_MIX";break;case ix:e="ENVMAP_BLENDING_ADD";break}return e}function cb(o){const e=o.envMapCubeUVHeight;if(e===null)return null;const i=Math.log2(e)-2,r=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,i),112)),texelHeight:r,maxMip:i}}function ub(o,e,i,r){const l=o.getContext(),u=i.defines;let d=i.vertexShader,h=i.fragmentShader;const m=rb(i),p=sb(i),g=ob(i),v=lb(i),x=cb(i),y=i.isWebGL2?"":KT(i),A=QT(i),b=JT(u),S=l.createProgram();let _,P,L=i.glslVersion?"#version "+i.glslVersion+`
`:"";i.isRawShaderMaterial?(_=["#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,b].filter(fs).join(`
`),_.length>0&&(_+=`
`),P=[y,"#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,b].filter(fs).join(`
`),P.length>0&&(P+=`
`)):(_=[w_(i),"#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,b,i.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",i.batching?"#define USE_BATCHING":"",i.instancing?"#define USE_INSTANCING":"",i.instancingColor?"#define USE_INSTANCING_COLOR":"",i.useFog&&i.fog?"#define USE_FOG":"",i.useFog&&i.fogExp2?"#define FOG_EXP2":"",i.map?"#define USE_MAP":"",i.envMap?"#define USE_ENVMAP":"",i.envMap?"#define "+g:"",i.lightMap?"#define USE_LIGHTMAP":"",i.aoMap?"#define USE_AOMAP":"",i.bumpMap?"#define USE_BUMPMAP":"",i.normalMap?"#define USE_NORMALMAP":"",i.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",i.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",i.displacementMap?"#define USE_DISPLACEMENTMAP":"",i.emissiveMap?"#define USE_EMISSIVEMAP":"",i.anisotropy?"#define USE_ANISOTROPY":"",i.anisotropyMap?"#define USE_ANISOTROPYMAP":"",i.clearcoatMap?"#define USE_CLEARCOATMAP":"",i.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",i.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",i.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",i.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",i.specularMap?"#define USE_SPECULARMAP":"",i.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",i.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",i.roughnessMap?"#define USE_ROUGHNESSMAP":"",i.metalnessMap?"#define USE_METALNESSMAP":"",i.alphaMap?"#define USE_ALPHAMAP":"",i.alphaHash?"#define USE_ALPHAHASH":"",i.transmission?"#define USE_TRANSMISSION":"",i.transmissionMap?"#define USE_TRANSMISSIONMAP":"",i.thicknessMap?"#define USE_THICKNESSMAP":"",i.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",i.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",i.mapUv?"#define MAP_UV "+i.mapUv:"",i.alphaMapUv?"#define ALPHAMAP_UV "+i.alphaMapUv:"",i.lightMapUv?"#define LIGHTMAP_UV "+i.lightMapUv:"",i.aoMapUv?"#define AOMAP_UV "+i.aoMapUv:"",i.emissiveMapUv?"#define EMISSIVEMAP_UV "+i.emissiveMapUv:"",i.bumpMapUv?"#define BUMPMAP_UV "+i.bumpMapUv:"",i.normalMapUv?"#define NORMALMAP_UV "+i.normalMapUv:"",i.displacementMapUv?"#define DISPLACEMENTMAP_UV "+i.displacementMapUv:"",i.metalnessMapUv?"#define METALNESSMAP_UV "+i.metalnessMapUv:"",i.roughnessMapUv?"#define ROUGHNESSMAP_UV "+i.roughnessMapUv:"",i.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+i.anisotropyMapUv:"",i.clearcoatMapUv?"#define CLEARCOATMAP_UV "+i.clearcoatMapUv:"",i.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+i.clearcoatNormalMapUv:"",i.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+i.clearcoatRoughnessMapUv:"",i.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+i.iridescenceMapUv:"",i.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+i.iridescenceThicknessMapUv:"",i.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+i.sheenColorMapUv:"",i.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+i.sheenRoughnessMapUv:"",i.specularMapUv?"#define SPECULARMAP_UV "+i.specularMapUv:"",i.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+i.specularColorMapUv:"",i.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+i.specularIntensityMapUv:"",i.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+i.transmissionMapUv:"",i.thicknessMapUv?"#define THICKNESSMAP_UV "+i.thicknessMapUv:"",i.vertexTangents&&i.flatShading===!1?"#define USE_TANGENT":"",i.vertexColors?"#define USE_COLOR":"",i.vertexAlphas?"#define USE_COLOR_ALPHA":"",i.vertexUv1s?"#define USE_UV1":"",i.vertexUv2s?"#define USE_UV2":"",i.vertexUv3s?"#define USE_UV3":"",i.pointsUvs?"#define USE_POINTS_UV":"",i.flatShading?"#define FLAT_SHADED":"",i.skinning?"#define USE_SKINNING":"",i.morphTargets?"#define USE_MORPHTARGETS":"",i.morphNormals&&i.flatShading===!1?"#define USE_MORPHNORMALS":"",i.morphColors&&i.isWebGL2?"#define USE_MORPHCOLORS":"",i.morphTargetsCount>0&&i.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",i.morphTargetsCount>0&&i.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+i.morphTextureStride:"",i.morphTargetsCount>0&&i.isWebGL2?"#define MORPHTARGETS_COUNT "+i.morphTargetsCount:"",i.doubleSided?"#define DOUBLE_SIDED":"",i.flipSided?"#define FLIP_SIDED":"",i.shadowMapEnabled?"#define USE_SHADOWMAP":"",i.shadowMapEnabled?"#define "+m:"",i.sizeAttenuation?"#define USE_SIZEATTENUATION":"",i.numLightProbes>0?"#define USE_LIGHT_PROBES":"",i.useLegacyLights?"#define LEGACY_LIGHTS":"",i.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",i.logarithmicDepthBuffer&&i.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(fs).join(`
`),P=[y,w_(i),"#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,b,i.useFog&&i.fog?"#define USE_FOG":"",i.useFog&&i.fogExp2?"#define FOG_EXP2":"",i.map?"#define USE_MAP":"",i.matcap?"#define USE_MATCAP":"",i.envMap?"#define USE_ENVMAP":"",i.envMap?"#define "+p:"",i.envMap?"#define "+g:"",i.envMap?"#define "+v:"",x?"#define CUBEUV_TEXEL_WIDTH "+x.texelWidth:"",x?"#define CUBEUV_TEXEL_HEIGHT "+x.texelHeight:"",x?"#define CUBEUV_MAX_MIP "+x.maxMip+".0":"",i.lightMap?"#define USE_LIGHTMAP":"",i.aoMap?"#define USE_AOMAP":"",i.bumpMap?"#define USE_BUMPMAP":"",i.normalMap?"#define USE_NORMALMAP":"",i.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",i.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",i.emissiveMap?"#define USE_EMISSIVEMAP":"",i.anisotropy?"#define USE_ANISOTROPY":"",i.anisotropyMap?"#define USE_ANISOTROPYMAP":"",i.clearcoat?"#define USE_CLEARCOAT":"",i.clearcoatMap?"#define USE_CLEARCOATMAP":"",i.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",i.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",i.iridescence?"#define USE_IRIDESCENCE":"",i.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",i.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",i.specularMap?"#define USE_SPECULARMAP":"",i.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",i.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",i.roughnessMap?"#define USE_ROUGHNESSMAP":"",i.metalnessMap?"#define USE_METALNESSMAP":"",i.alphaMap?"#define USE_ALPHAMAP":"",i.alphaTest?"#define USE_ALPHATEST":"",i.alphaHash?"#define USE_ALPHAHASH":"",i.sheen?"#define USE_SHEEN":"",i.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",i.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",i.transmission?"#define USE_TRANSMISSION":"",i.transmissionMap?"#define USE_TRANSMISSIONMAP":"",i.thicknessMap?"#define USE_THICKNESSMAP":"",i.vertexTangents&&i.flatShading===!1?"#define USE_TANGENT":"",i.vertexColors||i.instancingColor?"#define USE_COLOR":"",i.vertexAlphas?"#define USE_COLOR_ALPHA":"",i.vertexUv1s?"#define USE_UV1":"",i.vertexUv2s?"#define USE_UV2":"",i.vertexUv3s?"#define USE_UV3":"",i.pointsUvs?"#define USE_POINTS_UV":"",i.gradientMap?"#define USE_GRADIENTMAP":"",i.flatShading?"#define FLAT_SHADED":"",i.doubleSided?"#define DOUBLE_SIDED":"",i.flipSided?"#define FLIP_SIDED":"",i.shadowMapEnabled?"#define USE_SHADOWMAP":"",i.shadowMapEnabled?"#define "+m:"",i.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",i.numLightProbes>0?"#define USE_LIGHT_PROBES":"",i.useLegacyLights?"#define LEGACY_LIGHTS":"",i.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",i.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",i.logarithmicDepthBuffer&&i.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",i.toneMapping!==Na?"#define TONE_MAPPING":"",i.toneMapping!==Na?ve.tonemapping_pars_fragment:"",i.toneMapping!==Na?ZT("toneMapping",i.toneMapping):"",i.dithering?"#define DITHERING":"",i.opaque?"#define OPAQUE":"",ve.colorspace_pars_fragment,jT("linearToOutputTexel",i.outputColorSpace),i.useDepthPacking?"#define DEPTH_PACKING "+i.depthPacking:"",`
`].filter(fs).join(`
`)),d=Mh(d),d=b_(d,i),d=A_(d,i),h=Mh(h),h=b_(h,i),h=A_(h,i),d=R_(d),h=R_(h),i.isWebGL2&&i.isRawShaderMaterial!==!0&&(L=`#version 300 es
`,_=[A,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+_,P=["precision mediump sampler2DArray;","#define varying in",i.glslVersion===qg?"":"layout(location = 0) out highp vec4 pc_fragColor;",i.glslVersion===qg?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+P);const O=L+_+d,k=L+P+h,F=E_(l,l.VERTEX_SHADER,O),B=E_(l,l.FRAGMENT_SHADER,k);l.attachShader(S,F),l.attachShader(S,B),i.index0AttributeName!==void 0?l.bindAttribLocation(S,0,i.index0AttributeName):i.morphTargets===!0&&l.bindAttribLocation(S,0,"position"),l.linkProgram(S);function pt(ut){if(o.debug.checkShaderErrors){const Et=l.getProgramInfoLog(S).trim(),X=l.getShaderInfoLog(F).trim(),J=l.getShaderInfoLog(B).trim();let N=!0,q=!0;if(l.getProgramParameter(S,l.LINK_STATUS)===!1)if(N=!1,typeof o.debug.onShaderError=="function")o.debug.onShaderError(l,S,F,B);else{const K=T_(l,F,"vertex"),ct=T_(l,B,"fragment");console.error("THREE.WebGLProgram: Shader Error "+l.getError()+" - VALIDATE_STATUS "+l.getProgramParameter(S,l.VALIDATE_STATUS)+`

Program Info Log: `+Et+`
`+K+`
`+ct)}else Et!==""?console.warn("THREE.WebGLProgram: Program Info Log:",Et):(X===""||J==="")&&(q=!1);q&&(ut.diagnostics={runnable:N,programLog:Et,vertexShader:{log:X,prefix:_},fragmentShader:{log:J,prefix:P}})}l.deleteShader(F),l.deleteShader(B),w=new hc(l,S),U=$T(l,S)}let w;this.getUniforms=function(){return w===void 0&&pt(this),w};let U;this.getAttributes=function(){return U===void 0&&pt(this),U};let lt=i.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return lt===!1&&(lt=l.getProgramParameter(S,XT)),lt},this.destroy=function(){r.releaseStatesOfProgram(this),l.deleteProgram(S),this.program=void 0},this.type=i.shaderType,this.name=i.shaderName,this.id=WT++,this.cacheKey=e,this.usedTimes=1,this.program=S,this.vertexShader=F,this.fragmentShader=B,this}let fb=0;class hb{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const i=e.vertexShader,r=e.fragmentShader,l=this._getShaderStage(i),u=this._getShaderStage(r),d=this._getShaderCacheForMaterial(e);return d.has(l)===!1&&(d.add(l),l.usedTimes++),d.has(u)===!1&&(d.add(u),u.usedTimes++),this}remove(e){const i=this.materialCache.get(e);for(const r of i)r.usedTimes--,r.usedTimes===0&&this.shaderCache.delete(r.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const i=this.materialCache;let r=i.get(e);return r===void 0&&(r=new Set,i.set(e,r)),r}_getShaderStage(e){const i=this.shaderCache;let r=i.get(e);return r===void 0&&(r=new db(e),i.set(e,r)),r}}class db{constructor(e){this.id=fb++,this.code=e,this.usedTimes=0}}function pb(o,e,i,r,l,u,d){const h=new tv,m=new hb,p=[],g=l.isWebGL2,v=l.logarithmicDepthBuffer,x=l.vertexTextures;let y=l.precision;const A={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function b(w){return w===0?"uv":`uv${w}`}function S(w,U,lt,ut,Et){const X=ut.fog,J=Et.geometry,N=w.isMeshStandardMaterial?ut.environment:null,q=(w.isMeshStandardMaterial?i:e).get(w.envMap||N),K=q&&q.mapping===Sc?q.image.height:null,ct=A[w.type];w.precision!==null&&(y=l.getMaxPrecision(w.precision),y!==w.precision&&console.warn("THREE.WebGLProgram.getParameters:",w.precision,"not supported, using",y,"instead."));const R=J.morphAttributes.position||J.morphAttributes.normal||J.morphAttributes.color,V=R!==void 0?R.length:0;let j=0;J.morphAttributes.position!==void 0&&(j=1),J.morphAttributes.normal!==void 0&&(j=2),J.morphAttributes.color!==void 0&&(j=3);let I,$,_t,vt;if(ct){const Ut=Ci[ct];I=Ut.vertexShader,$=Ut.fragmentShader}else I=w.vertexShader,$=w.fragmentShader,m.update(w),_t=m.getVertexShaderID(w),vt=m.getFragmentShaderID(w);const Ot=o.getRenderTarget(),Pt=Et.isInstancedMesh===!0,Kt=Et.isBatchedMesh===!0,kt=!!w.map,oe=!!w.matcap,nt=!!q,Ze=!!w.aoMap,Wt=!!w.lightMap,Qt=!!w.bumpMap,Ht=!!w.normalMap,Se=!!w.displacementMap,de=!!w.emissiveMap,D=!!w.metalnessMap,T=!!w.roughnessMap,tt=w.anisotropy>0,yt=w.clearcoat>0,xt=w.iridescence>0,gt=w.sheen>0,Bt=w.transmission>0,At=tt&&!!w.anisotropyMap,Dt=yt&&!!w.clearcoatMap,Xt=yt&&!!w.clearcoatNormalMap,Vt=yt&&!!w.clearcoatRoughnessMap,Mt=xt&&!!w.iridescenceMap,Ee=xt&&!!w.iridescenceThicknessMap,ue=gt&&!!w.sheenColorMap,ne=gt&&!!w.sheenRoughnessMap,Gt=!!w.specularMap,zt=!!w.specularColorMap,ae=!!w.specularIntensityMap,Te=Bt&&!!w.transmissionMap,Ge=Bt&&!!w.thicknessMap,fe=!!w.gradientMap,Tt=!!w.alphaMap,H=w.alphaTest>0,bt=!!w.alphaHash,Ct=!!w.extensions,Jt=!!J.attributes.uv1,Zt=!!J.attributes.uv2,we=!!J.attributes.uv3;let ht=Na;return w.toneMapped&&(Ot===null||Ot.isXRRenderTarget===!0)&&(ht=o.toneMapping),{isWebGL2:g,shaderID:ct,shaderType:w.type,shaderName:w.name,vertexShader:I,fragmentShader:$,defines:w.defines,customVertexShaderID:_t,customFragmentShaderID:vt,isRawShaderMaterial:w.isRawShaderMaterial===!0,glslVersion:w.glslVersion,precision:y,batching:Kt,instancing:Pt,instancingColor:Pt&&Et.instanceColor!==null,supportsVertexTextures:x,outputColorSpace:Ot===null?o.outputColorSpace:Ot.isXRRenderTarget===!0?Ot.texture.colorSpace:$i,map:kt,matcap:oe,envMap:nt,envMapMode:nt&&q.mapping,envMapCubeUVHeight:K,aoMap:Ze,lightMap:Wt,bumpMap:Qt,normalMap:Ht,displacementMap:x&&Se,emissiveMap:de,normalMapObjectSpace:Ht&&w.normalMapType===yx,normalMapTangentSpace:Ht&&w.normalMapType===Mx,metalnessMap:D,roughnessMap:T,anisotropy:tt,anisotropyMap:At,clearcoat:yt,clearcoatMap:Dt,clearcoatNormalMap:Xt,clearcoatRoughnessMap:Vt,iridescence:xt,iridescenceMap:Mt,iridescenceThicknessMap:Ee,sheen:gt,sheenColorMap:ue,sheenRoughnessMap:ne,specularMap:Gt,specularColorMap:zt,specularIntensityMap:ae,transmission:Bt,transmissionMap:Te,thicknessMap:Ge,gradientMap:fe,opaque:w.transparent===!1&&w.blending===hs,alphaMap:Tt,alphaTest:H,alphaHash:bt,combine:w.combine,mapUv:kt&&b(w.map.channel),aoMapUv:Ze&&b(w.aoMap.channel),lightMapUv:Wt&&b(w.lightMap.channel),bumpMapUv:Qt&&b(w.bumpMap.channel),normalMapUv:Ht&&b(w.normalMap.channel),displacementMapUv:Se&&b(w.displacementMap.channel),emissiveMapUv:de&&b(w.emissiveMap.channel),metalnessMapUv:D&&b(w.metalnessMap.channel),roughnessMapUv:T&&b(w.roughnessMap.channel),anisotropyMapUv:At&&b(w.anisotropyMap.channel),clearcoatMapUv:Dt&&b(w.clearcoatMap.channel),clearcoatNormalMapUv:Xt&&b(w.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Vt&&b(w.clearcoatRoughnessMap.channel),iridescenceMapUv:Mt&&b(w.iridescenceMap.channel),iridescenceThicknessMapUv:Ee&&b(w.iridescenceThicknessMap.channel),sheenColorMapUv:ue&&b(w.sheenColorMap.channel),sheenRoughnessMapUv:ne&&b(w.sheenRoughnessMap.channel),specularMapUv:Gt&&b(w.specularMap.channel),specularColorMapUv:zt&&b(w.specularColorMap.channel),specularIntensityMapUv:ae&&b(w.specularIntensityMap.channel),transmissionMapUv:Te&&b(w.transmissionMap.channel),thicknessMapUv:Ge&&b(w.thicknessMap.channel),alphaMapUv:Tt&&b(w.alphaMap.channel),vertexTangents:!!J.attributes.tangent&&(Ht||tt),vertexColors:w.vertexColors,vertexAlphas:w.vertexColors===!0&&!!J.attributes.color&&J.attributes.color.itemSize===4,vertexUv1s:Jt,vertexUv2s:Zt,vertexUv3s:we,pointsUvs:Et.isPoints===!0&&!!J.attributes.uv&&(kt||Tt),fog:!!X,useFog:w.fog===!0,fogExp2:X&&X.isFogExp2,flatShading:w.flatShading===!0,sizeAttenuation:w.sizeAttenuation===!0,logarithmicDepthBuffer:v,skinning:Et.isSkinnedMesh===!0,morphTargets:J.morphAttributes.position!==void 0,morphNormals:J.morphAttributes.normal!==void 0,morphColors:J.morphAttributes.color!==void 0,morphTargetsCount:V,morphTextureStride:j,numDirLights:U.directional.length,numPointLights:U.point.length,numSpotLights:U.spot.length,numSpotLightMaps:U.spotLightMap.length,numRectAreaLights:U.rectArea.length,numHemiLights:U.hemi.length,numDirLightShadows:U.directionalShadowMap.length,numPointLightShadows:U.pointShadowMap.length,numSpotLightShadows:U.spotShadowMap.length,numSpotLightShadowsWithMaps:U.numSpotLightShadowsWithMaps,numLightProbes:U.numLightProbes,numClippingPlanes:d.numPlanes,numClipIntersection:d.numIntersection,dithering:w.dithering,shadowMapEnabled:o.shadowMap.enabled&&lt.length>0,shadowMapType:o.shadowMap.type,toneMapping:ht,useLegacyLights:o._useLegacyLights,decodeVideoTexture:kt&&w.map.isVideoTexture===!0&&Fe.getTransfer(w.map.colorSpace)===je,premultipliedAlpha:w.premultipliedAlpha,doubleSided:w.side===Qi,flipSided:w.side===kn,useDepthPacking:w.depthPacking>=0,depthPacking:w.depthPacking||0,index0AttributeName:w.index0AttributeName,extensionDerivatives:Ct&&w.extensions.derivatives===!0,extensionFragDepth:Ct&&w.extensions.fragDepth===!0,extensionDrawBuffers:Ct&&w.extensions.drawBuffers===!0,extensionShaderTextureLOD:Ct&&w.extensions.shaderTextureLOD===!0,extensionClipCullDistance:Ct&&w.extensions.clipCullDistance&&r.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:g||r.has("EXT_frag_depth"),rendererExtensionDrawBuffers:g||r.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:g||r.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:r.has("KHR_parallel_shader_compile"),customProgramCacheKey:w.customProgramCacheKey()}}function _(w){const U=[];if(w.shaderID?U.push(w.shaderID):(U.push(w.customVertexShaderID),U.push(w.customFragmentShaderID)),w.defines!==void 0)for(const lt in w.defines)U.push(lt),U.push(w.defines[lt]);return w.isRawShaderMaterial===!1&&(P(U,w),L(U,w),U.push(o.outputColorSpace)),U.push(w.customProgramCacheKey),U.join()}function P(w,U){w.push(U.precision),w.push(U.outputColorSpace),w.push(U.envMapMode),w.push(U.envMapCubeUVHeight),w.push(U.mapUv),w.push(U.alphaMapUv),w.push(U.lightMapUv),w.push(U.aoMapUv),w.push(U.bumpMapUv),w.push(U.normalMapUv),w.push(U.displacementMapUv),w.push(U.emissiveMapUv),w.push(U.metalnessMapUv),w.push(U.roughnessMapUv),w.push(U.anisotropyMapUv),w.push(U.clearcoatMapUv),w.push(U.clearcoatNormalMapUv),w.push(U.clearcoatRoughnessMapUv),w.push(U.iridescenceMapUv),w.push(U.iridescenceThicknessMapUv),w.push(U.sheenColorMapUv),w.push(U.sheenRoughnessMapUv),w.push(U.specularMapUv),w.push(U.specularColorMapUv),w.push(U.specularIntensityMapUv),w.push(U.transmissionMapUv),w.push(U.thicknessMapUv),w.push(U.combine),w.push(U.fogExp2),w.push(U.sizeAttenuation),w.push(U.morphTargetsCount),w.push(U.morphAttributeCount),w.push(U.numDirLights),w.push(U.numPointLights),w.push(U.numSpotLights),w.push(U.numSpotLightMaps),w.push(U.numHemiLights),w.push(U.numRectAreaLights),w.push(U.numDirLightShadows),w.push(U.numPointLightShadows),w.push(U.numSpotLightShadows),w.push(U.numSpotLightShadowsWithMaps),w.push(U.numLightProbes),w.push(U.shadowMapType),w.push(U.toneMapping),w.push(U.numClippingPlanes),w.push(U.numClipIntersection),w.push(U.depthPacking)}function L(w,U){h.disableAll(),U.isWebGL2&&h.enable(0),U.supportsVertexTextures&&h.enable(1),U.instancing&&h.enable(2),U.instancingColor&&h.enable(3),U.matcap&&h.enable(4),U.envMap&&h.enable(5),U.normalMapObjectSpace&&h.enable(6),U.normalMapTangentSpace&&h.enable(7),U.clearcoat&&h.enable(8),U.iridescence&&h.enable(9),U.alphaTest&&h.enable(10),U.vertexColors&&h.enable(11),U.vertexAlphas&&h.enable(12),U.vertexUv1s&&h.enable(13),U.vertexUv2s&&h.enable(14),U.vertexUv3s&&h.enable(15),U.vertexTangents&&h.enable(16),U.anisotropy&&h.enable(17),U.alphaHash&&h.enable(18),U.batching&&h.enable(19),w.push(h.mask),h.disableAll(),U.fog&&h.enable(0),U.useFog&&h.enable(1),U.flatShading&&h.enable(2),U.logarithmicDepthBuffer&&h.enable(3),U.skinning&&h.enable(4),U.morphTargets&&h.enable(5),U.morphNormals&&h.enable(6),U.morphColors&&h.enable(7),U.premultipliedAlpha&&h.enable(8),U.shadowMapEnabled&&h.enable(9),U.useLegacyLights&&h.enable(10),U.doubleSided&&h.enable(11),U.flipSided&&h.enable(12),U.useDepthPacking&&h.enable(13),U.dithering&&h.enable(14),U.transmission&&h.enable(15),U.sheen&&h.enable(16),U.opaque&&h.enable(17),U.pointsUvs&&h.enable(18),U.decodeVideoTexture&&h.enable(19),w.push(h.mask)}function O(w){const U=A[w.type];let lt;if(U){const ut=Ci[U];lt=Zx.clone(ut.uniforms)}else lt=w.uniforms;return lt}function k(w,U){let lt;for(let ut=0,Et=p.length;ut<Et;ut++){const X=p[ut];if(X.cacheKey===U){lt=X,++lt.usedTimes;break}}return lt===void 0&&(lt=new ub(o,U,w,u),p.push(lt)),lt}function F(w){if(--w.usedTimes===0){const U=p.indexOf(w);p[U]=p[p.length-1],p.pop(),w.destroy()}}function B(w){m.remove(w)}function pt(){m.dispose()}return{getParameters:S,getProgramCacheKey:_,getUniforms:O,acquireProgram:k,releaseProgram:F,releaseShaderCache:B,programs:p,dispose:pt}}function mb(){let o=new WeakMap;function e(u){let d=o.get(u);return d===void 0&&(d={},o.set(u,d)),d}function i(u){o.delete(u)}function r(u,d,h){o.get(u)[d]=h}function l(){o=new WeakMap}return{get:e,remove:i,update:r,dispose:l}}function gb(o,e){return o.groupOrder!==e.groupOrder?o.groupOrder-e.groupOrder:o.renderOrder!==e.renderOrder?o.renderOrder-e.renderOrder:o.material.id!==e.material.id?o.material.id-e.material.id:o.z!==e.z?o.z-e.z:o.id-e.id}function C_(o,e){return o.groupOrder!==e.groupOrder?o.groupOrder-e.groupOrder:o.renderOrder!==e.renderOrder?o.renderOrder-e.renderOrder:o.z!==e.z?e.z-o.z:o.id-e.id}function D_(){const o=[];let e=0;const i=[],r=[],l=[];function u(){e=0,i.length=0,r.length=0,l.length=0}function d(v,x,y,A,b,S){let _=o[e];return _===void 0?(_={id:v.id,object:v,geometry:x,material:y,groupOrder:A,renderOrder:v.renderOrder,z:b,group:S},o[e]=_):(_.id=v.id,_.object=v,_.geometry=x,_.material=y,_.groupOrder=A,_.renderOrder=v.renderOrder,_.z=b,_.group=S),e++,_}function h(v,x,y,A,b,S){const _=d(v,x,y,A,b,S);y.transmission>0?r.push(_):y.transparent===!0?l.push(_):i.push(_)}function m(v,x,y,A,b,S){const _=d(v,x,y,A,b,S);y.transmission>0?r.unshift(_):y.transparent===!0?l.unshift(_):i.unshift(_)}function p(v,x){i.length>1&&i.sort(v||gb),r.length>1&&r.sort(x||C_),l.length>1&&l.sort(x||C_)}function g(){for(let v=e,x=o.length;v<x;v++){const y=o[v];if(y.id===null)break;y.id=null,y.object=null,y.geometry=null,y.material=null,y.group=null}}return{opaque:i,transmissive:r,transparent:l,init:u,push:h,unshift:m,finish:g,sort:p}}function _b(){let o=new WeakMap;function e(r,l){const u=o.get(r);let d;return u===void 0?(d=new D_,o.set(r,[d])):l>=u.length?(d=new D_,u.push(d)):d=u[l],d}function i(){o=new WeakMap}return{get:e,dispose:i}}function vb(){const o={};return{get:function(e){if(o[e.id]!==void 0)return o[e.id];let i;switch(e.type){case"DirectionalLight":i={direction:new st,color:new pe};break;case"SpotLight":i={position:new st,direction:new st,color:new pe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":i={position:new st,color:new pe,distance:0,decay:0};break;case"HemisphereLight":i={direction:new st,skyColor:new pe,groundColor:new pe};break;case"RectAreaLight":i={color:new pe,position:new st,halfWidth:new st,halfHeight:new st};break}return o[e.id]=i,i}}}function Sb(){const o={};return{get:function(e){if(o[e.id]!==void 0)return o[e.id];let i;switch(e.type){case"DirectionalLight":i={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new He};break;case"SpotLight":i={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new He};break;case"PointLight":i={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new He,shadowCameraNear:1,shadowCameraFar:1e3};break}return o[e.id]=i,i}}}let xb=0;function Mb(o,e){return(e.castShadow?2:0)-(o.castShadow?2:0)+(e.map?1:0)-(o.map?1:0)}function yb(o,e){const i=new vb,r=Sb(),l={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let g=0;g<9;g++)l.probe.push(new st);const u=new st,d=new _n,h=new _n;function m(g,v){let x=0,y=0,A=0;for(let ut=0;ut<9;ut++)l.probe[ut].set(0,0,0);let b=0,S=0,_=0,P=0,L=0,O=0,k=0,F=0,B=0,pt=0,w=0;g.sort(Mb);const U=v===!0?Math.PI:1;for(let ut=0,Et=g.length;ut<Et;ut++){const X=g[ut],J=X.color,N=X.intensity,q=X.distance,K=X.shadow&&X.shadow.map?X.shadow.map.texture:null;if(X.isAmbientLight)x+=J.r*N*U,y+=J.g*N*U,A+=J.b*N*U;else if(X.isLightProbe){for(let ct=0;ct<9;ct++)l.probe[ct].addScaledVector(X.sh.coefficients[ct],N);w++}else if(X.isDirectionalLight){const ct=i.get(X);if(ct.color.copy(X.color).multiplyScalar(X.intensity*U),X.castShadow){const R=X.shadow,V=r.get(X);V.shadowBias=R.bias,V.shadowNormalBias=R.normalBias,V.shadowRadius=R.radius,V.shadowMapSize=R.mapSize,l.directionalShadow[b]=V,l.directionalShadowMap[b]=K,l.directionalShadowMatrix[b]=X.shadow.matrix,O++}l.directional[b]=ct,b++}else if(X.isSpotLight){const ct=i.get(X);ct.position.setFromMatrixPosition(X.matrixWorld),ct.color.copy(J).multiplyScalar(N*U),ct.distance=q,ct.coneCos=Math.cos(X.angle),ct.penumbraCos=Math.cos(X.angle*(1-X.penumbra)),ct.decay=X.decay,l.spot[_]=ct;const R=X.shadow;if(X.map&&(l.spotLightMap[B]=X.map,B++,R.updateMatrices(X),X.castShadow&&pt++),l.spotLightMatrix[_]=R.matrix,X.castShadow){const V=r.get(X);V.shadowBias=R.bias,V.shadowNormalBias=R.normalBias,V.shadowRadius=R.radius,V.shadowMapSize=R.mapSize,l.spotShadow[_]=V,l.spotShadowMap[_]=K,F++}_++}else if(X.isRectAreaLight){const ct=i.get(X);ct.color.copy(J).multiplyScalar(N),ct.halfWidth.set(X.width*.5,0,0),ct.halfHeight.set(0,X.height*.5,0),l.rectArea[P]=ct,P++}else if(X.isPointLight){const ct=i.get(X);if(ct.color.copy(X.color).multiplyScalar(X.intensity*U),ct.distance=X.distance,ct.decay=X.decay,X.castShadow){const R=X.shadow,V=r.get(X);V.shadowBias=R.bias,V.shadowNormalBias=R.normalBias,V.shadowRadius=R.radius,V.shadowMapSize=R.mapSize,V.shadowCameraNear=R.camera.near,V.shadowCameraFar=R.camera.far,l.pointShadow[S]=V,l.pointShadowMap[S]=K,l.pointShadowMatrix[S]=X.shadow.matrix,k++}l.point[S]=ct,S++}else if(X.isHemisphereLight){const ct=i.get(X);ct.skyColor.copy(X.color).multiplyScalar(N*U),ct.groundColor.copy(X.groundColor).multiplyScalar(N*U),l.hemi[L]=ct,L++}}P>0&&(e.isWebGL2?o.has("OES_texture_float_linear")===!0?(l.rectAreaLTC1=wt.LTC_FLOAT_1,l.rectAreaLTC2=wt.LTC_FLOAT_2):(l.rectAreaLTC1=wt.LTC_HALF_1,l.rectAreaLTC2=wt.LTC_HALF_2):o.has("OES_texture_float_linear")===!0?(l.rectAreaLTC1=wt.LTC_FLOAT_1,l.rectAreaLTC2=wt.LTC_FLOAT_2):o.has("OES_texture_half_float_linear")===!0?(l.rectAreaLTC1=wt.LTC_HALF_1,l.rectAreaLTC2=wt.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),l.ambient[0]=x,l.ambient[1]=y,l.ambient[2]=A;const lt=l.hash;(lt.directionalLength!==b||lt.pointLength!==S||lt.spotLength!==_||lt.rectAreaLength!==P||lt.hemiLength!==L||lt.numDirectionalShadows!==O||lt.numPointShadows!==k||lt.numSpotShadows!==F||lt.numSpotMaps!==B||lt.numLightProbes!==w)&&(l.directional.length=b,l.spot.length=_,l.rectArea.length=P,l.point.length=S,l.hemi.length=L,l.directionalShadow.length=O,l.directionalShadowMap.length=O,l.pointShadow.length=k,l.pointShadowMap.length=k,l.spotShadow.length=F,l.spotShadowMap.length=F,l.directionalShadowMatrix.length=O,l.pointShadowMatrix.length=k,l.spotLightMatrix.length=F+B-pt,l.spotLightMap.length=B,l.numSpotLightShadowsWithMaps=pt,l.numLightProbes=w,lt.directionalLength=b,lt.pointLength=S,lt.spotLength=_,lt.rectAreaLength=P,lt.hemiLength=L,lt.numDirectionalShadows=O,lt.numPointShadows=k,lt.numSpotShadows=F,lt.numSpotMaps=B,lt.numLightProbes=w,l.version=xb++)}function p(g,v){let x=0,y=0,A=0,b=0,S=0;const _=v.matrixWorldInverse;for(let P=0,L=g.length;P<L;P++){const O=g[P];if(O.isDirectionalLight){const k=l.directional[x];k.direction.setFromMatrixPosition(O.matrixWorld),u.setFromMatrixPosition(O.target.matrixWorld),k.direction.sub(u),k.direction.transformDirection(_),x++}else if(O.isSpotLight){const k=l.spot[A];k.position.setFromMatrixPosition(O.matrixWorld),k.position.applyMatrix4(_),k.direction.setFromMatrixPosition(O.matrixWorld),u.setFromMatrixPosition(O.target.matrixWorld),k.direction.sub(u),k.direction.transformDirection(_),A++}else if(O.isRectAreaLight){const k=l.rectArea[b];k.position.setFromMatrixPosition(O.matrixWorld),k.position.applyMatrix4(_),h.identity(),d.copy(O.matrixWorld),d.premultiply(_),h.extractRotation(d),k.halfWidth.set(O.width*.5,0,0),k.halfHeight.set(0,O.height*.5,0),k.halfWidth.applyMatrix4(h),k.halfHeight.applyMatrix4(h),b++}else if(O.isPointLight){const k=l.point[y];k.position.setFromMatrixPosition(O.matrixWorld),k.position.applyMatrix4(_),y++}else if(O.isHemisphereLight){const k=l.hemi[S];k.direction.setFromMatrixPosition(O.matrixWorld),k.direction.transformDirection(_),S++}}}return{setup:m,setupView:p,state:l}}function L_(o,e){const i=new yb(o,e),r=[],l=[];function u(){r.length=0,l.length=0}function d(v){r.push(v)}function h(v){l.push(v)}function m(v){i.setup(r,v)}function p(v){i.setupView(r,v)}return{init:u,state:{lightsArray:r,shadowsArray:l,lights:i},setupLights:m,setupLightsView:p,pushLight:d,pushShadow:h}}function Eb(o,e){let i=new WeakMap;function r(u,d=0){const h=i.get(u);let m;return h===void 0?(m=new L_(o,e),i.set(u,[m])):d>=h.length?(m=new L_(o,e),h.push(m)):m=h[d],m}function l(){i=new WeakMap}return{get:r,dispose:l}}class Tb extends Lo{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Sx,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class bb extends Lo{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const Ab=`void main() {
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
}`;function wb(o,e,i){let r=new lv;const l=new He,u=new He,d=new bn,h=new Tb({depthPacking:xx}),m=new bb,p={},g=i.maxTextureSize,v={[Pa]:kn,[kn]:Pa,[Qi]:Qi},x=new za({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new He},radius:{value:4}},vertexShader:Ab,fragmentShader:Rb}),y=x.clone();y.defines.HORIZONTAL_PASS=1;const A=new ta;A.setAttribute("position",new di(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const b=new La(A,x),S=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=B_;let _=this.type;this.render=function(F,B,pt){if(S.enabled===!1||S.autoUpdate===!1&&S.needsUpdate===!1||F.length===0)return;const w=o.getRenderTarget(),U=o.getActiveCubeFace(),lt=o.getActiveMipmapLevel(),ut=o.state;ut.setBlending(Ua),ut.buffers.color.setClear(1,1,1,1),ut.buffers.depth.setTest(!0),ut.setScissorTest(!1);const Et=_!==Ki&&this.type===Ki,X=_===Ki&&this.type!==Ki;for(let J=0,N=F.length;J<N;J++){const q=F[J],K=q.shadow;if(K===void 0){console.warn("THREE.WebGLShadowMap:",q,"has no shadow.");continue}if(K.autoUpdate===!1&&K.needsUpdate===!1)continue;l.copy(K.mapSize);const ct=K.getFrameExtents();if(l.multiply(ct),u.copy(K.mapSize),(l.x>g||l.y>g)&&(l.x>g&&(u.x=Math.floor(g/ct.x),l.x=u.x*ct.x,K.mapSize.x=u.x),l.y>g&&(u.y=Math.floor(g/ct.y),l.y=u.y*ct.y,K.mapSize.y=u.y)),K.map===null||Et===!0||X===!0){const V=this.type!==Ki?{minFilter:Pn,magFilter:Pn}:{};K.map!==null&&K.map.dispose(),K.map=new dr(l.x,l.y,V),K.map.texture.name=q.name+".shadowMap",K.camera.updateProjectionMatrix()}o.setRenderTarget(K.map),o.clear();const R=K.getViewportCount();for(let V=0;V<R;V++){const j=K.getViewport(V);d.set(u.x*j.x,u.y*j.y,u.x*j.z,u.y*j.w),ut.viewport(d),K.updateMatrices(q,V),r=K.getFrustum(),O(B,pt,K.camera,q,this.type)}K.isPointLightShadow!==!0&&this.type===Ki&&P(K,pt),K.needsUpdate=!1}_=this.type,S.needsUpdate=!1,o.setRenderTarget(w,U,lt)};function P(F,B){const pt=e.update(b);x.defines.VSM_SAMPLES!==F.blurSamples&&(x.defines.VSM_SAMPLES=F.blurSamples,y.defines.VSM_SAMPLES=F.blurSamples,x.needsUpdate=!0,y.needsUpdate=!0),F.mapPass===null&&(F.mapPass=new dr(l.x,l.y)),x.uniforms.shadow_pass.value=F.map.texture,x.uniforms.resolution.value=F.mapSize,x.uniforms.radius.value=F.radius,o.setRenderTarget(F.mapPass),o.clear(),o.renderBufferDirect(B,null,pt,x,b,null),y.uniforms.shadow_pass.value=F.mapPass.texture,y.uniforms.resolution.value=F.mapSize,y.uniforms.radius.value=F.radius,o.setRenderTarget(F.map),o.clear(),o.renderBufferDirect(B,null,pt,y,b,null)}function L(F,B,pt,w){let U=null;const lt=pt.isPointLight===!0?F.customDistanceMaterial:F.customDepthMaterial;if(lt!==void 0)U=lt;else if(U=pt.isPointLight===!0?m:h,o.localClippingEnabled&&B.clipShadows===!0&&Array.isArray(B.clippingPlanes)&&B.clippingPlanes.length!==0||B.displacementMap&&B.displacementScale!==0||B.alphaMap&&B.alphaTest>0||B.map&&B.alphaTest>0){const ut=U.uuid,Et=B.uuid;let X=p[ut];X===void 0&&(X={},p[ut]=X);let J=X[Et];J===void 0&&(J=U.clone(),X[Et]=J,B.addEventListener("dispose",k)),U=J}if(U.visible=B.visible,U.wireframe=B.wireframe,w===Ki?U.side=B.shadowSide!==null?B.shadowSide:B.side:U.side=B.shadowSide!==null?B.shadowSide:v[B.side],U.alphaMap=B.alphaMap,U.alphaTest=B.alphaTest,U.map=B.map,U.clipShadows=B.clipShadows,U.clippingPlanes=B.clippingPlanes,U.clipIntersection=B.clipIntersection,U.displacementMap=B.displacementMap,U.displacementScale=B.displacementScale,U.displacementBias=B.displacementBias,U.wireframeLinewidth=B.wireframeLinewidth,U.linewidth=B.linewidth,pt.isPointLight===!0&&U.isMeshDistanceMaterial===!0){const ut=o.properties.get(U);ut.light=pt}return U}function O(F,B,pt,w,U){if(F.visible===!1)return;if(F.layers.test(B.layers)&&(F.isMesh||F.isLine||F.isPoints)&&(F.castShadow||F.receiveShadow&&U===Ki)&&(!F.frustumCulled||r.intersectsObject(F))){F.modelViewMatrix.multiplyMatrices(pt.matrixWorldInverse,F.matrixWorld);const Et=e.update(F),X=F.material;if(Array.isArray(X)){const J=Et.groups;for(let N=0,q=J.length;N<q;N++){const K=J[N],ct=X[K.materialIndex];if(ct&&ct.visible){const R=L(F,ct,w,U);F.onBeforeShadow(o,F,B,pt,Et,R,K),o.renderBufferDirect(pt,null,Et,R,F,K),F.onAfterShadow(o,F,B,pt,Et,R,K)}}}else if(X.visible){const J=L(F,X,w,U);F.onBeforeShadow(o,F,B,pt,Et,J,null),o.renderBufferDirect(pt,null,Et,J,F,null),F.onAfterShadow(o,F,B,pt,Et,J,null)}}const ut=F.children;for(let Et=0,X=ut.length;Et<X;Et++)O(ut[Et],B,pt,w,U)}function k(F){F.target.removeEventListener("dispose",k);for(const pt in p){const w=p[pt],U=F.target.uuid;U in w&&(w[U].dispose(),delete w[U])}}}function Cb(o,e,i){const r=i.isWebGL2;function l(){let H=!1;const bt=new bn;let Ct=null;const Jt=new bn(0,0,0,0);return{setMask:function(Zt){Ct!==Zt&&!H&&(o.colorMask(Zt,Zt,Zt,Zt),Ct=Zt)},setLocked:function(Zt){H=Zt},setClear:function(Zt,we,ht,Rt,Ut){Ut===!0&&(Zt*=Rt,we*=Rt,ht*=Rt),bt.set(Zt,we,ht,Rt),Jt.equals(bt)===!1&&(o.clearColor(Zt,we,ht,Rt),Jt.copy(bt))},reset:function(){H=!1,Ct=null,Jt.set(-1,0,0,0)}}}function u(){let H=!1,bt=null,Ct=null,Jt=null;return{setTest:function(Zt){Zt?Kt(o.DEPTH_TEST):kt(o.DEPTH_TEST)},setMask:function(Zt){bt!==Zt&&!H&&(o.depthMask(Zt),bt=Zt)},setFunc:function(Zt){if(Ct!==Zt){switch(Zt){case ZS:o.depthFunc(o.NEVER);break;case KS:o.depthFunc(o.ALWAYS);break;case QS:o.depthFunc(o.LESS);break;case dc:o.depthFunc(o.LEQUAL);break;case JS:o.depthFunc(o.EQUAL);break;case $S:o.depthFunc(o.GEQUAL);break;case tx:o.depthFunc(o.GREATER);break;case ex:o.depthFunc(o.NOTEQUAL);break;default:o.depthFunc(o.LEQUAL)}Ct=Zt}},setLocked:function(Zt){H=Zt},setClear:function(Zt){Jt!==Zt&&(o.clearDepth(Zt),Jt=Zt)},reset:function(){H=!1,bt=null,Ct=null,Jt=null}}}function d(){let H=!1,bt=null,Ct=null,Jt=null,Zt=null,we=null,ht=null,Rt=null,Ut=null;return{setTest:function(St){H||(St?Kt(o.STENCIL_TEST):kt(o.STENCIL_TEST))},setMask:function(St){bt!==St&&!H&&(o.stencilMask(St),bt=St)},setFunc:function(St,Lt,$t){(Ct!==St||Jt!==Lt||Zt!==$t)&&(o.stencilFunc(St,Lt,$t),Ct=St,Jt=Lt,Zt=$t)},setOp:function(St,Lt,$t){(we!==St||ht!==Lt||Rt!==$t)&&(o.stencilOp(St,Lt,$t),we=St,ht=Lt,Rt=$t)},setLocked:function(St){H=St},setClear:function(St){Ut!==St&&(o.clearStencil(St),Ut=St)},reset:function(){H=!1,bt=null,Ct=null,Jt=null,Zt=null,we=null,ht=null,Rt=null,Ut=null}}}const h=new l,m=new u,p=new d,g=new WeakMap,v=new WeakMap;let x={},y={},A=new WeakMap,b=[],S=null,_=!1,P=null,L=null,O=null,k=null,F=null,B=null,pt=null,w=new pe(0,0,0),U=0,lt=!1,ut=null,Et=null,X=null,J=null,N=null;const q=o.getParameter(o.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let K=!1,ct=0;const R=o.getParameter(o.VERSION);R.indexOf("WebGL")!==-1?(ct=parseFloat(/^WebGL (\d)/.exec(R)[1]),K=ct>=1):R.indexOf("OpenGL ES")!==-1&&(ct=parseFloat(/^OpenGL ES (\d)/.exec(R)[1]),K=ct>=2);let V=null,j={};const I=o.getParameter(o.SCISSOR_BOX),$=o.getParameter(o.VIEWPORT),_t=new bn().fromArray(I),vt=new bn().fromArray($);function Ot(H,bt,Ct,Jt){const Zt=new Uint8Array(4),we=o.createTexture();o.bindTexture(H,we),o.texParameteri(H,o.TEXTURE_MIN_FILTER,o.NEAREST),o.texParameteri(H,o.TEXTURE_MAG_FILTER,o.NEAREST);for(let ht=0;ht<Ct;ht++)r&&(H===o.TEXTURE_3D||H===o.TEXTURE_2D_ARRAY)?o.texImage3D(bt,0,o.RGBA,1,1,Jt,0,o.RGBA,o.UNSIGNED_BYTE,Zt):o.texImage2D(bt+ht,0,o.RGBA,1,1,0,o.RGBA,o.UNSIGNED_BYTE,Zt);return we}const Pt={};Pt[o.TEXTURE_2D]=Ot(o.TEXTURE_2D,o.TEXTURE_2D,1),Pt[o.TEXTURE_CUBE_MAP]=Ot(o.TEXTURE_CUBE_MAP,o.TEXTURE_CUBE_MAP_POSITIVE_X,6),r&&(Pt[o.TEXTURE_2D_ARRAY]=Ot(o.TEXTURE_2D_ARRAY,o.TEXTURE_2D_ARRAY,1,1),Pt[o.TEXTURE_3D]=Ot(o.TEXTURE_3D,o.TEXTURE_3D,1,1)),h.setClear(0,0,0,1),m.setClear(1),p.setClear(0),Kt(o.DEPTH_TEST),m.setFunc(dc),de(!1),D(dg),Kt(o.CULL_FACE),Ht(Ua);function Kt(H){x[H]!==!0&&(o.enable(H),x[H]=!0)}function kt(H){x[H]!==!1&&(o.disable(H),x[H]=!1)}function oe(H,bt){return y[H]!==bt?(o.bindFramebuffer(H,bt),y[H]=bt,r&&(H===o.DRAW_FRAMEBUFFER&&(y[o.FRAMEBUFFER]=bt),H===o.FRAMEBUFFER&&(y[o.DRAW_FRAMEBUFFER]=bt)),!0):!1}function nt(H,bt){let Ct=b,Jt=!1;if(H)if(Ct=A.get(bt),Ct===void 0&&(Ct=[],A.set(bt,Ct)),H.isWebGLMultipleRenderTargets){const Zt=H.texture;if(Ct.length!==Zt.length||Ct[0]!==o.COLOR_ATTACHMENT0){for(let we=0,ht=Zt.length;we<ht;we++)Ct[we]=o.COLOR_ATTACHMENT0+we;Ct.length=Zt.length,Jt=!0}}else Ct[0]!==o.COLOR_ATTACHMENT0&&(Ct[0]=o.COLOR_ATTACHMENT0,Jt=!0);else Ct[0]!==o.BACK&&(Ct[0]=o.BACK,Jt=!0);Jt&&(i.isWebGL2?o.drawBuffers(Ct):e.get("WEBGL_draw_buffers").drawBuffersWEBGL(Ct))}function Ze(H){return S!==H?(o.useProgram(H),S=H,!0):!1}const Wt={[or]:o.FUNC_ADD,[OS]:o.FUNC_SUBTRACT,[PS]:o.FUNC_REVERSE_SUBTRACT};if(r)Wt[gg]=o.MIN,Wt[_g]=o.MAX;else{const H=e.get("EXT_blend_minmax");H!==null&&(Wt[gg]=H.MIN_EXT,Wt[_g]=H.MAX_EXT)}const Qt={[zS]:o.ZERO,[BS]:o.ONE,[IS]:o.SRC_COLOR,[hh]:o.SRC_ALPHA,[XS]:o.SRC_ALPHA_SATURATE,[VS]:o.DST_COLOR,[HS]:o.DST_ALPHA,[FS]:o.ONE_MINUS_SRC_COLOR,[dh]:o.ONE_MINUS_SRC_ALPHA,[kS]:o.ONE_MINUS_DST_COLOR,[GS]:o.ONE_MINUS_DST_ALPHA,[WS]:o.CONSTANT_COLOR,[qS]:o.ONE_MINUS_CONSTANT_COLOR,[YS]:o.CONSTANT_ALPHA,[jS]:o.ONE_MINUS_CONSTANT_ALPHA};function Ht(H,bt,Ct,Jt,Zt,we,ht,Rt,Ut,St){if(H===Ua){_===!0&&(kt(o.BLEND),_=!1);return}if(_===!1&&(Kt(o.BLEND),_=!0),H!==NS){if(H!==P||St!==lt){if((L!==or||F!==or)&&(o.blendEquation(o.FUNC_ADD),L=or,F=or),St)switch(H){case hs:o.blendFuncSeparate(o.ONE,o.ONE_MINUS_SRC_ALPHA,o.ONE,o.ONE_MINUS_SRC_ALPHA);break;case fh:o.blendFunc(o.ONE,o.ONE);break;case pg:o.blendFuncSeparate(o.ZERO,o.ONE_MINUS_SRC_COLOR,o.ZERO,o.ONE);break;case mg:o.blendFuncSeparate(o.ZERO,o.SRC_COLOR,o.ZERO,o.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",H);break}else switch(H){case hs:o.blendFuncSeparate(o.SRC_ALPHA,o.ONE_MINUS_SRC_ALPHA,o.ONE,o.ONE_MINUS_SRC_ALPHA);break;case fh:o.blendFunc(o.SRC_ALPHA,o.ONE);break;case pg:o.blendFuncSeparate(o.ZERO,o.ONE_MINUS_SRC_COLOR,o.ZERO,o.ONE);break;case mg:o.blendFunc(o.ZERO,o.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",H);break}O=null,k=null,B=null,pt=null,w.set(0,0,0),U=0,P=H,lt=St}return}Zt=Zt||bt,we=we||Ct,ht=ht||Jt,(bt!==L||Zt!==F)&&(o.blendEquationSeparate(Wt[bt],Wt[Zt]),L=bt,F=Zt),(Ct!==O||Jt!==k||we!==B||ht!==pt)&&(o.blendFuncSeparate(Qt[Ct],Qt[Jt],Qt[we],Qt[ht]),O=Ct,k=Jt,B=we,pt=ht),(Rt.equals(w)===!1||Ut!==U)&&(o.blendColor(Rt.r,Rt.g,Rt.b,Ut),w.copy(Rt),U=Ut),P=H,lt=!1}function Se(H,bt){H.side===Qi?kt(o.CULL_FACE):Kt(o.CULL_FACE);let Ct=H.side===kn;bt&&(Ct=!Ct),de(Ct),H.blending===hs&&H.transparent===!1?Ht(Ua):Ht(H.blending,H.blendEquation,H.blendSrc,H.blendDst,H.blendEquationAlpha,H.blendSrcAlpha,H.blendDstAlpha,H.blendColor,H.blendAlpha,H.premultipliedAlpha),m.setFunc(H.depthFunc),m.setTest(H.depthTest),m.setMask(H.depthWrite),h.setMask(H.colorWrite);const Jt=H.stencilWrite;p.setTest(Jt),Jt&&(p.setMask(H.stencilWriteMask),p.setFunc(H.stencilFunc,H.stencilRef,H.stencilFuncMask),p.setOp(H.stencilFail,H.stencilZFail,H.stencilZPass)),tt(H.polygonOffset,H.polygonOffsetFactor,H.polygonOffsetUnits),H.alphaToCoverage===!0?Kt(o.SAMPLE_ALPHA_TO_COVERAGE):kt(o.SAMPLE_ALPHA_TO_COVERAGE)}function de(H){ut!==H&&(H?o.frontFace(o.CW):o.frontFace(o.CCW),ut=H)}function D(H){H!==DS?(Kt(o.CULL_FACE),H!==Et&&(H===dg?o.cullFace(o.BACK):H===LS?o.cullFace(o.FRONT):o.cullFace(o.FRONT_AND_BACK))):kt(o.CULL_FACE),Et=H}function T(H){H!==X&&(K&&o.lineWidth(H),X=H)}function tt(H,bt,Ct){H?(Kt(o.POLYGON_OFFSET_FILL),(J!==bt||N!==Ct)&&(o.polygonOffset(bt,Ct),J=bt,N=Ct)):kt(o.POLYGON_OFFSET_FILL)}function yt(H){H?Kt(o.SCISSOR_TEST):kt(o.SCISSOR_TEST)}function xt(H){H===void 0&&(H=o.TEXTURE0+q-1),V!==H&&(o.activeTexture(H),V=H)}function gt(H,bt,Ct){Ct===void 0&&(V===null?Ct=o.TEXTURE0+q-1:Ct=V);let Jt=j[Ct];Jt===void 0&&(Jt={type:void 0,texture:void 0},j[Ct]=Jt),(Jt.type!==H||Jt.texture!==bt)&&(V!==Ct&&(o.activeTexture(Ct),V=Ct),o.bindTexture(H,bt||Pt[H]),Jt.type=H,Jt.texture=bt)}function Bt(){const H=j[V];H!==void 0&&H.type!==void 0&&(o.bindTexture(H.type,null),H.type=void 0,H.texture=void 0)}function At(){try{o.compressedTexImage2D.apply(o,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function Dt(){try{o.compressedTexImage3D.apply(o,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function Xt(){try{o.texSubImage2D.apply(o,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function Vt(){try{o.texSubImage3D.apply(o,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function Mt(){try{o.compressedTexSubImage2D.apply(o,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function Ee(){try{o.compressedTexSubImage3D.apply(o,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function ue(){try{o.texStorage2D.apply(o,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function ne(){try{o.texStorage3D.apply(o,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function Gt(){try{o.texImage2D.apply(o,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function zt(){try{o.texImage3D.apply(o,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function ae(H){_t.equals(H)===!1&&(o.scissor(H.x,H.y,H.z,H.w),_t.copy(H))}function Te(H){vt.equals(H)===!1&&(o.viewport(H.x,H.y,H.z,H.w),vt.copy(H))}function Ge(H,bt){let Ct=v.get(bt);Ct===void 0&&(Ct=new WeakMap,v.set(bt,Ct));let Jt=Ct.get(H);Jt===void 0&&(Jt=o.getUniformBlockIndex(bt,H.name),Ct.set(H,Jt))}function fe(H,bt){const Jt=v.get(bt).get(H);g.get(bt)!==Jt&&(o.uniformBlockBinding(bt,Jt,H.__bindingPointIndex),g.set(bt,Jt))}function Tt(){o.disable(o.BLEND),o.disable(o.CULL_FACE),o.disable(o.DEPTH_TEST),o.disable(o.POLYGON_OFFSET_FILL),o.disable(o.SCISSOR_TEST),o.disable(o.STENCIL_TEST),o.disable(o.SAMPLE_ALPHA_TO_COVERAGE),o.blendEquation(o.FUNC_ADD),o.blendFunc(o.ONE,o.ZERO),o.blendFuncSeparate(o.ONE,o.ZERO,o.ONE,o.ZERO),o.blendColor(0,0,0,0),o.colorMask(!0,!0,!0,!0),o.clearColor(0,0,0,0),o.depthMask(!0),o.depthFunc(o.LESS),o.clearDepth(1),o.stencilMask(4294967295),o.stencilFunc(o.ALWAYS,0,4294967295),o.stencilOp(o.KEEP,o.KEEP,o.KEEP),o.clearStencil(0),o.cullFace(o.BACK),o.frontFace(o.CCW),o.polygonOffset(0,0),o.activeTexture(o.TEXTURE0),o.bindFramebuffer(o.FRAMEBUFFER,null),r===!0&&(o.bindFramebuffer(o.DRAW_FRAMEBUFFER,null),o.bindFramebuffer(o.READ_FRAMEBUFFER,null)),o.useProgram(null),o.lineWidth(1),o.scissor(0,0,o.canvas.width,o.canvas.height),o.viewport(0,0,o.canvas.width,o.canvas.height),x={},V=null,j={},y={},A=new WeakMap,b=[],S=null,_=!1,P=null,L=null,O=null,k=null,F=null,B=null,pt=null,w=new pe(0,0,0),U=0,lt=!1,ut=null,Et=null,X=null,J=null,N=null,_t.set(0,0,o.canvas.width,o.canvas.height),vt.set(0,0,o.canvas.width,o.canvas.height),h.reset(),m.reset(),p.reset()}return{buffers:{color:h,depth:m,stencil:p},enable:Kt,disable:kt,bindFramebuffer:oe,drawBuffers:nt,useProgram:Ze,setBlending:Ht,setMaterial:Se,setFlipSided:de,setCullFace:D,setLineWidth:T,setPolygonOffset:tt,setScissorTest:yt,activeTexture:xt,bindTexture:gt,unbindTexture:Bt,compressedTexImage2D:At,compressedTexImage3D:Dt,texImage2D:Gt,texImage3D:zt,updateUBOMapping:Ge,uniformBlockBinding:fe,texStorage2D:ue,texStorage3D:ne,texSubImage2D:Xt,texSubImage3D:Vt,compressedTexSubImage2D:Mt,compressedTexSubImage3D:Ee,scissor:ae,viewport:Te,reset:Tt}}function Db(o,e,i,r,l,u,d){const h=l.isWebGL2,m=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,p=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),g=new WeakMap;let v;const x=new WeakMap;let y=!1;try{y=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function A(D,T){return y?new OffscreenCanvas(D,T):vc("canvas")}function b(D,T,tt,yt){let xt=1;if((D.width>yt||D.height>yt)&&(xt=yt/Math.max(D.width,D.height)),xt<1||T===!0)if(typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&D instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&D instanceof ImageBitmap){const gt=T?xh:Math.floor,Bt=gt(xt*D.width),At=gt(xt*D.height);v===void 0&&(v=A(Bt,At));const Dt=tt?A(Bt,At):v;return Dt.width=Bt,Dt.height=At,Dt.getContext("2d").drawImage(D,0,0,Bt,At),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+D.width+"x"+D.height+") to ("+Bt+"x"+At+")."),Dt}else return"data"in D&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+D.width+"x"+D.height+")."),D;return D}function S(D){return Yg(D.width)&&Yg(D.height)}function _(D){return h?!1:D.wrapS!==yi||D.wrapT!==yi||D.minFilter!==Pn&&D.minFilter!==ui}function P(D,T){return D.generateMipmaps&&T&&D.minFilter!==Pn&&D.minFilter!==ui}function L(D){o.generateMipmap(D)}function O(D,T,tt,yt,xt=!1){if(h===!1)return T;if(D!==null){if(o[D]!==void 0)return o[D];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+D+"'")}let gt=T;if(T===o.RED&&(tt===o.FLOAT&&(gt=o.R32F),tt===o.HALF_FLOAT&&(gt=o.R16F),tt===o.UNSIGNED_BYTE&&(gt=o.R8)),T===o.RED_INTEGER&&(tt===o.UNSIGNED_BYTE&&(gt=o.R8UI),tt===o.UNSIGNED_SHORT&&(gt=o.R16UI),tt===o.UNSIGNED_INT&&(gt=o.R32UI),tt===o.BYTE&&(gt=o.R8I),tt===o.SHORT&&(gt=o.R16I),tt===o.INT&&(gt=o.R32I)),T===o.RG&&(tt===o.FLOAT&&(gt=o.RG32F),tt===o.HALF_FLOAT&&(gt=o.RG16F),tt===o.UNSIGNED_BYTE&&(gt=o.RG8)),T===o.RGBA){const Bt=xt?pc:Fe.getTransfer(yt);tt===o.FLOAT&&(gt=o.RGBA32F),tt===o.HALF_FLOAT&&(gt=o.RGBA16F),tt===o.UNSIGNED_BYTE&&(gt=Bt===je?o.SRGB8_ALPHA8:o.RGBA8),tt===o.UNSIGNED_SHORT_4_4_4_4&&(gt=o.RGBA4),tt===o.UNSIGNED_SHORT_5_5_5_1&&(gt=o.RGB5_A1)}return(gt===o.R16F||gt===o.R32F||gt===o.RG16F||gt===o.RG32F||gt===o.RGBA16F||gt===o.RGBA32F)&&e.get("EXT_color_buffer_float"),gt}function k(D,T,tt){return P(D,tt)===!0||D.isFramebufferTexture&&D.minFilter!==Pn&&D.minFilter!==ui?Math.log2(Math.max(T.width,T.height))+1:D.mipmaps!==void 0&&D.mipmaps.length>0?D.mipmaps.length:D.isCompressedTexture&&Array.isArray(D.image)?T.mipmaps.length:1}function F(D){return D===Pn||D===vg||D===Uf?o.NEAREST:o.LINEAR}function B(D){const T=D.target;T.removeEventListener("dispose",B),w(T),T.isVideoTexture&&g.delete(T)}function pt(D){const T=D.target;T.removeEventListener("dispose",pt),lt(T)}function w(D){const T=r.get(D);if(T.__webglInit===void 0)return;const tt=D.source,yt=x.get(tt);if(yt){const xt=yt[T.__cacheKey];xt.usedTimes--,xt.usedTimes===0&&U(D),Object.keys(yt).length===0&&x.delete(tt)}r.remove(D)}function U(D){const T=r.get(D);o.deleteTexture(T.__webglTexture);const tt=D.source,yt=x.get(tt);delete yt[T.__cacheKey],d.memory.textures--}function lt(D){const T=D.texture,tt=r.get(D),yt=r.get(T);if(yt.__webglTexture!==void 0&&(o.deleteTexture(yt.__webglTexture),d.memory.textures--),D.depthTexture&&D.depthTexture.dispose(),D.isWebGLCubeRenderTarget)for(let xt=0;xt<6;xt++){if(Array.isArray(tt.__webglFramebuffer[xt]))for(let gt=0;gt<tt.__webglFramebuffer[xt].length;gt++)o.deleteFramebuffer(tt.__webglFramebuffer[xt][gt]);else o.deleteFramebuffer(tt.__webglFramebuffer[xt]);tt.__webglDepthbuffer&&o.deleteRenderbuffer(tt.__webglDepthbuffer[xt])}else{if(Array.isArray(tt.__webglFramebuffer))for(let xt=0;xt<tt.__webglFramebuffer.length;xt++)o.deleteFramebuffer(tt.__webglFramebuffer[xt]);else o.deleteFramebuffer(tt.__webglFramebuffer);if(tt.__webglDepthbuffer&&o.deleteRenderbuffer(tt.__webglDepthbuffer),tt.__webglMultisampledFramebuffer&&o.deleteFramebuffer(tt.__webglMultisampledFramebuffer),tt.__webglColorRenderbuffer)for(let xt=0;xt<tt.__webglColorRenderbuffer.length;xt++)tt.__webglColorRenderbuffer[xt]&&o.deleteRenderbuffer(tt.__webglColorRenderbuffer[xt]);tt.__webglDepthRenderbuffer&&o.deleteRenderbuffer(tt.__webglDepthRenderbuffer)}if(D.isWebGLMultipleRenderTargets)for(let xt=0,gt=T.length;xt<gt;xt++){const Bt=r.get(T[xt]);Bt.__webglTexture&&(o.deleteTexture(Bt.__webglTexture),d.memory.textures--),r.remove(T[xt])}r.remove(T),r.remove(D)}let ut=0;function Et(){ut=0}function X(){const D=ut;return D>=l.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+D+" texture units while this GPU supports only "+l.maxTextures),ut+=1,D}function J(D){const T=[];return T.push(D.wrapS),T.push(D.wrapT),T.push(D.wrapR||0),T.push(D.magFilter),T.push(D.minFilter),T.push(D.anisotropy),T.push(D.internalFormat),T.push(D.format),T.push(D.type),T.push(D.generateMipmaps),T.push(D.premultiplyAlpha),T.push(D.flipY),T.push(D.unpackAlignment),T.push(D.colorSpace),T.join()}function N(D,T){const tt=r.get(D);if(D.isVideoTexture&&Se(D),D.isRenderTargetTexture===!1&&D.version>0&&tt.__version!==D.version){const yt=D.image;if(yt===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(yt.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{_t(tt,D,T);return}}i.bindTexture(o.TEXTURE_2D,tt.__webglTexture,o.TEXTURE0+T)}function q(D,T){const tt=r.get(D);if(D.version>0&&tt.__version!==D.version){_t(tt,D,T);return}i.bindTexture(o.TEXTURE_2D_ARRAY,tt.__webglTexture,o.TEXTURE0+T)}function K(D,T){const tt=r.get(D);if(D.version>0&&tt.__version!==D.version){_t(tt,D,T);return}i.bindTexture(o.TEXTURE_3D,tt.__webglTexture,o.TEXTURE0+T)}function ct(D,T){const tt=r.get(D);if(D.version>0&&tt.__version!==D.version){vt(tt,D,T);return}i.bindTexture(o.TEXTURE_CUBE_MAP,tt.__webglTexture,o.TEXTURE0+T)}const R={[gh]:o.REPEAT,[yi]:o.CLAMP_TO_EDGE,[_h]:o.MIRRORED_REPEAT},V={[Pn]:o.NEAREST,[vg]:o.NEAREST_MIPMAP_NEAREST,[Uf]:o.NEAREST_MIPMAP_LINEAR,[ui]:o.LINEAR,[ux]:o.LINEAR_MIPMAP_NEAREST,[Ao]:o.LINEAR_MIPMAP_LINEAR},j={[Ex]:o.NEVER,[Cx]:o.ALWAYS,[Tx]:o.LESS,[j_]:o.LEQUAL,[bx]:o.EQUAL,[wx]:o.GEQUAL,[Ax]:o.GREATER,[Rx]:o.NOTEQUAL};function I(D,T,tt){if(tt?(o.texParameteri(D,o.TEXTURE_WRAP_S,R[T.wrapS]),o.texParameteri(D,o.TEXTURE_WRAP_T,R[T.wrapT]),(D===o.TEXTURE_3D||D===o.TEXTURE_2D_ARRAY)&&o.texParameteri(D,o.TEXTURE_WRAP_R,R[T.wrapR]),o.texParameteri(D,o.TEXTURE_MAG_FILTER,V[T.magFilter]),o.texParameteri(D,o.TEXTURE_MIN_FILTER,V[T.minFilter])):(o.texParameteri(D,o.TEXTURE_WRAP_S,o.CLAMP_TO_EDGE),o.texParameteri(D,o.TEXTURE_WRAP_T,o.CLAMP_TO_EDGE),(D===o.TEXTURE_3D||D===o.TEXTURE_2D_ARRAY)&&o.texParameteri(D,o.TEXTURE_WRAP_R,o.CLAMP_TO_EDGE),(T.wrapS!==yi||T.wrapT!==yi)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),o.texParameteri(D,o.TEXTURE_MAG_FILTER,F(T.magFilter)),o.texParameteri(D,o.TEXTURE_MIN_FILTER,F(T.minFilter)),T.minFilter!==Pn&&T.minFilter!==ui&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),T.compareFunction&&(o.texParameteri(D,o.TEXTURE_COMPARE_MODE,o.COMPARE_REF_TO_TEXTURE),o.texParameteri(D,o.TEXTURE_COMPARE_FUNC,j[T.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){const yt=e.get("EXT_texture_filter_anisotropic");if(T.magFilter===Pn||T.minFilter!==Uf&&T.minFilter!==Ao||T.type===Da&&e.has("OES_texture_float_linear")===!1||h===!1&&T.type===Ro&&e.has("OES_texture_half_float_linear")===!1)return;(T.anisotropy>1||r.get(T).__currentAnisotropy)&&(o.texParameterf(D,yt.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(T.anisotropy,l.getMaxAnisotropy())),r.get(T).__currentAnisotropy=T.anisotropy)}}function $(D,T){let tt=!1;D.__webglInit===void 0&&(D.__webglInit=!0,T.addEventListener("dispose",B));const yt=T.source;let xt=x.get(yt);xt===void 0&&(xt={},x.set(yt,xt));const gt=J(T);if(gt!==D.__cacheKey){xt[gt]===void 0&&(xt[gt]={texture:o.createTexture(),usedTimes:0},d.memory.textures++,tt=!0),xt[gt].usedTimes++;const Bt=xt[D.__cacheKey];Bt!==void 0&&(xt[D.__cacheKey].usedTimes--,Bt.usedTimes===0&&U(T)),D.__cacheKey=gt,D.__webglTexture=xt[gt].texture}return tt}function _t(D,T,tt){let yt=o.TEXTURE_2D;(T.isDataArrayTexture||T.isCompressedArrayTexture)&&(yt=o.TEXTURE_2D_ARRAY),T.isData3DTexture&&(yt=o.TEXTURE_3D);const xt=$(D,T),gt=T.source;i.bindTexture(yt,D.__webglTexture,o.TEXTURE0+tt);const Bt=r.get(gt);if(gt.version!==Bt.__version||xt===!0){i.activeTexture(o.TEXTURE0+tt);const At=Fe.getPrimaries(Fe.workingColorSpace),Dt=T.colorSpace===hi?null:Fe.getPrimaries(T.colorSpace),Xt=T.colorSpace===hi||At===Dt?o.NONE:o.BROWSER_DEFAULT_WEBGL;o.pixelStorei(o.UNPACK_FLIP_Y_WEBGL,T.flipY),o.pixelStorei(o.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),o.pixelStorei(o.UNPACK_ALIGNMENT,T.unpackAlignment),o.pixelStorei(o.UNPACK_COLORSPACE_CONVERSION_WEBGL,Xt);const Vt=_(T)&&S(T.image)===!1;let Mt=b(T.image,Vt,!1,l.maxTextureSize);Mt=de(T,Mt);const Ee=S(Mt)||h,ue=u.convert(T.format,T.colorSpace);let ne=u.convert(T.type),Gt=O(T.internalFormat,ue,ne,T.colorSpace,T.isVideoTexture);I(yt,T,Ee);let zt;const ae=T.mipmaps,Te=h&&T.isVideoTexture!==!0&&Gt!==q_,Ge=Bt.__version===void 0||xt===!0,fe=k(T,Mt,Ee);if(T.isDepthTexture)Gt=o.DEPTH_COMPONENT,h?T.type===Da?Gt=o.DEPTH_COMPONENT32F:T.type===Ca?Gt=o.DEPTH_COMPONENT24:T.type===cr?Gt=o.DEPTH24_STENCIL8:Gt=o.DEPTH_COMPONENT16:T.type===Da&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),T.format===ur&&Gt===o.DEPTH_COMPONENT&&T.type!==bh&&T.type!==Ca&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),T.type=Ca,ne=u.convert(T.type)),T.format===gs&&Gt===o.DEPTH_COMPONENT&&(Gt=o.DEPTH_STENCIL,T.type!==cr&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),T.type=cr,ne=u.convert(T.type))),Ge&&(Te?i.texStorage2D(o.TEXTURE_2D,1,Gt,Mt.width,Mt.height):i.texImage2D(o.TEXTURE_2D,0,Gt,Mt.width,Mt.height,0,ue,ne,null));else if(T.isDataTexture)if(ae.length>0&&Ee){Te&&Ge&&i.texStorage2D(o.TEXTURE_2D,fe,Gt,ae[0].width,ae[0].height);for(let Tt=0,H=ae.length;Tt<H;Tt++)zt=ae[Tt],Te?i.texSubImage2D(o.TEXTURE_2D,Tt,0,0,zt.width,zt.height,ue,ne,zt.data):i.texImage2D(o.TEXTURE_2D,Tt,Gt,zt.width,zt.height,0,ue,ne,zt.data);T.generateMipmaps=!1}else Te?(Ge&&i.texStorage2D(o.TEXTURE_2D,fe,Gt,Mt.width,Mt.height),i.texSubImage2D(o.TEXTURE_2D,0,0,0,Mt.width,Mt.height,ue,ne,Mt.data)):i.texImage2D(o.TEXTURE_2D,0,Gt,Mt.width,Mt.height,0,ue,ne,Mt.data);else if(T.isCompressedTexture)if(T.isCompressedArrayTexture){Te&&Ge&&i.texStorage3D(o.TEXTURE_2D_ARRAY,fe,Gt,ae[0].width,ae[0].height,Mt.depth);for(let Tt=0,H=ae.length;Tt<H;Tt++)zt=ae[Tt],T.format!==Ei?ue!==null?Te?i.compressedTexSubImage3D(o.TEXTURE_2D_ARRAY,Tt,0,0,0,zt.width,zt.height,Mt.depth,ue,zt.data,0,0):i.compressedTexImage3D(o.TEXTURE_2D_ARRAY,Tt,Gt,zt.width,zt.height,Mt.depth,0,zt.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Te?i.texSubImage3D(o.TEXTURE_2D_ARRAY,Tt,0,0,0,zt.width,zt.height,Mt.depth,ue,ne,zt.data):i.texImage3D(o.TEXTURE_2D_ARRAY,Tt,Gt,zt.width,zt.height,Mt.depth,0,ue,ne,zt.data)}else{Te&&Ge&&i.texStorage2D(o.TEXTURE_2D,fe,Gt,ae[0].width,ae[0].height);for(let Tt=0,H=ae.length;Tt<H;Tt++)zt=ae[Tt],T.format!==Ei?ue!==null?Te?i.compressedTexSubImage2D(o.TEXTURE_2D,Tt,0,0,zt.width,zt.height,ue,zt.data):i.compressedTexImage2D(o.TEXTURE_2D,Tt,Gt,zt.width,zt.height,0,zt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Te?i.texSubImage2D(o.TEXTURE_2D,Tt,0,0,zt.width,zt.height,ue,ne,zt.data):i.texImage2D(o.TEXTURE_2D,Tt,Gt,zt.width,zt.height,0,ue,ne,zt.data)}else if(T.isDataArrayTexture)Te?(Ge&&i.texStorage3D(o.TEXTURE_2D_ARRAY,fe,Gt,Mt.width,Mt.height,Mt.depth),i.texSubImage3D(o.TEXTURE_2D_ARRAY,0,0,0,0,Mt.width,Mt.height,Mt.depth,ue,ne,Mt.data)):i.texImage3D(o.TEXTURE_2D_ARRAY,0,Gt,Mt.width,Mt.height,Mt.depth,0,ue,ne,Mt.data);else if(T.isData3DTexture)Te?(Ge&&i.texStorage3D(o.TEXTURE_3D,fe,Gt,Mt.width,Mt.height,Mt.depth),i.texSubImage3D(o.TEXTURE_3D,0,0,0,0,Mt.width,Mt.height,Mt.depth,ue,ne,Mt.data)):i.texImage3D(o.TEXTURE_3D,0,Gt,Mt.width,Mt.height,Mt.depth,0,ue,ne,Mt.data);else if(T.isFramebufferTexture){if(Ge)if(Te)i.texStorage2D(o.TEXTURE_2D,fe,Gt,Mt.width,Mt.height);else{let Tt=Mt.width,H=Mt.height;for(let bt=0;bt<fe;bt++)i.texImage2D(o.TEXTURE_2D,bt,Gt,Tt,H,0,ue,ne,null),Tt>>=1,H>>=1}}else if(ae.length>0&&Ee){Te&&Ge&&i.texStorage2D(o.TEXTURE_2D,fe,Gt,ae[0].width,ae[0].height);for(let Tt=0,H=ae.length;Tt<H;Tt++)zt=ae[Tt],Te?i.texSubImage2D(o.TEXTURE_2D,Tt,0,0,ue,ne,zt):i.texImage2D(o.TEXTURE_2D,Tt,Gt,ue,ne,zt);T.generateMipmaps=!1}else Te?(Ge&&i.texStorage2D(o.TEXTURE_2D,fe,Gt,Mt.width,Mt.height),i.texSubImage2D(o.TEXTURE_2D,0,0,0,ue,ne,Mt)):i.texImage2D(o.TEXTURE_2D,0,Gt,ue,ne,Mt);P(T,Ee)&&L(yt),Bt.__version=gt.version,T.onUpdate&&T.onUpdate(T)}D.__version=T.version}function vt(D,T,tt){if(T.image.length!==6)return;const yt=$(D,T),xt=T.source;i.bindTexture(o.TEXTURE_CUBE_MAP,D.__webglTexture,o.TEXTURE0+tt);const gt=r.get(xt);if(xt.version!==gt.__version||yt===!0){i.activeTexture(o.TEXTURE0+tt);const Bt=Fe.getPrimaries(Fe.workingColorSpace),At=T.colorSpace===hi?null:Fe.getPrimaries(T.colorSpace),Dt=T.colorSpace===hi||Bt===At?o.NONE:o.BROWSER_DEFAULT_WEBGL;o.pixelStorei(o.UNPACK_FLIP_Y_WEBGL,T.flipY),o.pixelStorei(o.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),o.pixelStorei(o.UNPACK_ALIGNMENT,T.unpackAlignment),o.pixelStorei(o.UNPACK_COLORSPACE_CONVERSION_WEBGL,Dt);const Xt=T.isCompressedTexture||T.image[0].isCompressedTexture,Vt=T.image[0]&&T.image[0].isDataTexture,Mt=[];for(let Tt=0;Tt<6;Tt++)!Xt&&!Vt?Mt[Tt]=b(T.image[Tt],!1,!0,l.maxCubemapSize):Mt[Tt]=Vt?T.image[Tt].image:T.image[Tt],Mt[Tt]=de(T,Mt[Tt]);const Ee=Mt[0],ue=S(Ee)||h,ne=u.convert(T.format,T.colorSpace),Gt=u.convert(T.type),zt=O(T.internalFormat,ne,Gt,T.colorSpace),ae=h&&T.isVideoTexture!==!0,Te=gt.__version===void 0||yt===!0;let Ge=k(T,Ee,ue);I(o.TEXTURE_CUBE_MAP,T,ue);let fe;if(Xt){ae&&Te&&i.texStorage2D(o.TEXTURE_CUBE_MAP,Ge,zt,Ee.width,Ee.height);for(let Tt=0;Tt<6;Tt++){fe=Mt[Tt].mipmaps;for(let H=0;H<fe.length;H++){const bt=fe[H];T.format!==Ei?ne!==null?ae?i.compressedTexSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+Tt,H,0,0,bt.width,bt.height,ne,bt.data):i.compressedTexImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+Tt,H,zt,bt.width,bt.height,0,bt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):ae?i.texSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+Tt,H,0,0,bt.width,bt.height,ne,Gt,bt.data):i.texImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+Tt,H,zt,bt.width,bt.height,0,ne,Gt,bt.data)}}}else{fe=T.mipmaps,ae&&Te&&(fe.length>0&&Ge++,i.texStorage2D(o.TEXTURE_CUBE_MAP,Ge,zt,Mt[0].width,Mt[0].height));for(let Tt=0;Tt<6;Tt++)if(Vt){ae?i.texSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+Tt,0,0,0,Mt[Tt].width,Mt[Tt].height,ne,Gt,Mt[Tt].data):i.texImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+Tt,0,zt,Mt[Tt].width,Mt[Tt].height,0,ne,Gt,Mt[Tt].data);for(let H=0;H<fe.length;H++){const Ct=fe[H].image[Tt].image;ae?i.texSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+Tt,H+1,0,0,Ct.width,Ct.height,ne,Gt,Ct.data):i.texImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+Tt,H+1,zt,Ct.width,Ct.height,0,ne,Gt,Ct.data)}}else{ae?i.texSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+Tt,0,0,0,ne,Gt,Mt[Tt]):i.texImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+Tt,0,zt,ne,Gt,Mt[Tt]);for(let H=0;H<fe.length;H++){const bt=fe[H];ae?i.texSubImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+Tt,H+1,0,0,ne,Gt,bt.image[Tt]):i.texImage2D(o.TEXTURE_CUBE_MAP_POSITIVE_X+Tt,H+1,zt,ne,Gt,bt.image[Tt])}}}P(T,ue)&&L(o.TEXTURE_CUBE_MAP),gt.__version=xt.version,T.onUpdate&&T.onUpdate(T)}D.__version=T.version}function Ot(D,T,tt,yt,xt,gt){const Bt=u.convert(tt.format,tt.colorSpace),At=u.convert(tt.type),Dt=O(tt.internalFormat,Bt,At,tt.colorSpace);if(!r.get(T).__hasExternalTextures){const Vt=Math.max(1,T.width>>gt),Mt=Math.max(1,T.height>>gt);xt===o.TEXTURE_3D||xt===o.TEXTURE_2D_ARRAY?i.texImage3D(xt,gt,Dt,Vt,Mt,T.depth,0,Bt,At,null):i.texImage2D(xt,gt,Dt,Vt,Mt,0,Bt,At,null)}i.bindFramebuffer(o.FRAMEBUFFER,D),Ht(T)?m.framebufferTexture2DMultisampleEXT(o.FRAMEBUFFER,yt,xt,r.get(tt).__webglTexture,0,Qt(T)):(xt===o.TEXTURE_2D||xt>=o.TEXTURE_CUBE_MAP_POSITIVE_X&&xt<=o.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&o.framebufferTexture2D(o.FRAMEBUFFER,yt,xt,r.get(tt).__webglTexture,gt),i.bindFramebuffer(o.FRAMEBUFFER,null)}function Pt(D,T,tt){if(o.bindRenderbuffer(o.RENDERBUFFER,D),T.depthBuffer&&!T.stencilBuffer){let yt=h===!0?o.DEPTH_COMPONENT24:o.DEPTH_COMPONENT16;if(tt||Ht(T)){const xt=T.depthTexture;xt&&xt.isDepthTexture&&(xt.type===Da?yt=o.DEPTH_COMPONENT32F:xt.type===Ca&&(yt=o.DEPTH_COMPONENT24));const gt=Qt(T);Ht(T)?m.renderbufferStorageMultisampleEXT(o.RENDERBUFFER,gt,yt,T.width,T.height):o.renderbufferStorageMultisample(o.RENDERBUFFER,gt,yt,T.width,T.height)}else o.renderbufferStorage(o.RENDERBUFFER,yt,T.width,T.height);o.framebufferRenderbuffer(o.FRAMEBUFFER,o.DEPTH_ATTACHMENT,o.RENDERBUFFER,D)}else if(T.depthBuffer&&T.stencilBuffer){const yt=Qt(T);tt&&Ht(T)===!1?o.renderbufferStorageMultisample(o.RENDERBUFFER,yt,o.DEPTH24_STENCIL8,T.width,T.height):Ht(T)?m.renderbufferStorageMultisampleEXT(o.RENDERBUFFER,yt,o.DEPTH24_STENCIL8,T.width,T.height):o.renderbufferStorage(o.RENDERBUFFER,o.DEPTH_STENCIL,T.width,T.height),o.framebufferRenderbuffer(o.FRAMEBUFFER,o.DEPTH_STENCIL_ATTACHMENT,o.RENDERBUFFER,D)}else{const yt=T.isWebGLMultipleRenderTargets===!0?T.texture:[T.texture];for(let xt=0;xt<yt.length;xt++){const gt=yt[xt],Bt=u.convert(gt.format,gt.colorSpace),At=u.convert(gt.type),Dt=O(gt.internalFormat,Bt,At,gt.colorSpace),Xt=Qt(T);tt&&Ht(T)===!1?o.renderbufferStorageMultisample(o.RENDERBUFFER,Xt,Dt,T.width,T.height):Ht(T)?m.renderbufferStorageMultisampleEXT(o.RENDERBUFFER,Xt,Dt,T.width,T.height):o.renderbufferStorage(o.RENDERBUFFER,Dt,T.width,T.height)}}o.bindRenderbuffer(o.RENDERBUFFER,null)}function Kt(D,T){if(T&&T.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(i.bindFramebuffer(o.FRAMEBUFFER,D),!(T.depthTexture&&T.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!r.get(T.depthTexture).__webglTexture||T.depthTexture.image.width!==T.width||T.depthTexture.image.height!==T.height)&&(T.depthTexture.image.width=T.width,T.depthTexture.image.height=T.height,T.depthTexture.needsUpdate=!0),N(T.depthTexture,0);const yt=r.get(T.depthTexture).__webglTexture,xt=Qt(T);if(T.depthTexture.format===ur)Ht(T)?m.framebufferTexture2DMultisampleEXT(o.FRAMEBUFFER,o.DEPTH_ATTACHMENT,o.TEXTURE_2D,yt,0,xt):o.framebufferTexture2D(o.FRAMEBUFFER,o.DEPTH_ATTACHMENT,o.TEXTURE_2D,yt,0);else if(T.depthTexture.format===gs)Ht(T)?m.framebufferTexture2DMultisampleEXT(o.FRAMEBUFFER,o.DEPTH_STENCIL_ATTACHMENT,o.TEXTURE_2D,yt,0,xt):o.framebufferTexture2D(o.FRAMEBUFFER,o.DEPTH_STENCIL_ATTACHMENT,o.TEXTURE_2D,yt,0);else throw new Error("Unknown depthTexture format")}function kt(D){const T=r.get(D),tt=D.isWebGLCubeRenderTarget===!0;if(D.depthTexture&&!T.__autoAllocateDepthBuffer){if(tt)throw new Error("target.depthTexture not supported in Cube render targets");Kt(T.__webglFramebuffer,D)}else if(tt){T.__webglDepthbuffer=[];for(let yt=0;yt<6;yt++)i.bindFramebuffer(o.FRAMEBUFFER,T.__webglFramebuffer[yt]),T.__webglDepthbuffer[yt]=o.createRenderbuffer(),Pt(T.__webglDepthbuffer[yt],D,!1)}else i.bindFramebuffer(o.FRAMEBUFFER,T.__webglFramebuffer),T.__webglDepthbuffer=o.createRenderbuffer(),Pt(T.__webglDepthbuffer,D,!1);i.bindFramebuffer(o.FRAMEBUFFER,null)}function oe(D,T,tt){const yt=r.get(D);T!==void 0&&Ot(yt.__webglFramebuffer,D,D.texture,o.COLOR_ATTACHMENT0,o.TEXTURE_2D,0),tt!==void 0&&kt(D)}function nt(D){const T=D.texture,tt=r.get(D),yt=r.get(T);D.addEventListener("dispose",pt),D.isWebGLMultipleRenderTargets!==!0&&(yt.__webglTexture===void 0&&(yt.__webglTexture=o.createTexture()),yt.__version=T.version,d.memory.textures++);const xt=D.isWebGLCubeRenderTarget===!0,gt=D.isWebGLMultipleRenderTargets===!0,Bt=S(D)||h;if(xt){tt.__webglFramebuffer=[];for(let At=0;At<6;At++)if(h&&T.mipmaps&&T.mipmaps.length>0){tt.__webglFramebuffer[At]=[];for(let Dt=0;Dt<T.mipmaps.length;Dt++)tt.__webglFramebuffer[At][Dt]=o.createFramebuffer()}else tt.__webglFramebuffer[At]=o.createFramebuffer()}else{if(h&&T.mipmaps&&T.mipmaps.length>0){tt.__webglFramebuffer=[];for(let At=0;At<T.mipmaps.length;At++)tt.__webglFramebuffer[At]=o.createFramebuffer()}else tt.__webglFramebuffer=o.createFramebuffer();if(gt)if(l.drawBuffers){const At=D.texture;for(let Dt=0,Xt=At.length;Dt<Xt;Dt++){const Vt=r.get(At[Dt]);Vt.__webglTexture===void 0&&(Vt.__webglTexture=o.createTexture(),d.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(h&&D.samples>0&&Ht(D)===!1){const At=gt?T:[T];tt.__webglMultisampledFramebuffer=o.createFramebuffer(),tt.__webglColorRenderbuffer=[],i.bindFramebuffer(o.FRAMEBUFFER,tt.__webglMultisampledFramebuffer);for(let Dt=0;Dt<At.length;Dt++){const Xt=At[Dt];tt.__webglColorRenderbuffer[Dt]=o.createRenderbuffer(),o.bindRenderbuffer(o.RENDERBUFFER,tt.__webglColorRenderbuffer[Dt]);const Vt=u.convert(Xt.format,Xt.colorSpace),Mt=u.convert(Xt.type),Ee=O(Xt.internalFormat,Vt,Mt,Xt.colorSpace,D.isXRRenderTarget===!0),ue=Qt(D);o.renderbufferStorageMultisample(o.RENDERBUFFER,ue,Ee,D.width,D.height),o.framebufferRenderbuffer(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0+Dt,o.RENDERBUFFER,tt.__webglColorRenderbuffer[Dt])}o.bindRenderbuffer(o.RENDERBUFFER,null),D.depthBuffer&&(tt.__webglDepthRenderbuffer=o.createRenderbuffer(),Pt(tt.__webglDepthRenderbuffer,D,!0)),i.bindFramebuffer(o.FRAMEBUFFER,null)}}if(xt){i.bindTexture(o.TEXTURE_CUBE_MAP,yt.__webglTexture),I(o.TEXTURE_CUBE_MAP,T,Bt);for(let At=0;At<6;At++)if(h&&T.mipmaps&&T.mipmaps.length>0)for(let Dt=0;Dt<T.mipmaps.length;Dt++)Ot(tt.__webglFramebuffer[At][Dt],D,T,o.COLOR_ATTACHMENT0,o.TEXTURE_CUBE_MAP_POSITIVE_X+At,Dt);else Ot(tt.__webglFramebuffer[At],D,T,o.COLOR_ATTACHMENT0,o.TEXTURE_CUBE_MAP_POSITIVE_X+At,0);P(T,Bt)&&L(o.TEXTURE_CUBE_MAP),i.unbindTexture()}else if(gt){const At=D.texture;for(let Dt=0,Xt=At.length;Dt<Xt;Dt++){const Vt=At[Dt],Mt=r.get(Vt);i.bindTexture(o.TEXTURE_2D,Mt.__webglTexture),I(o.TEXTURE_2D,Vt,Bt),Ot(tt.__webglFramebuffer,D,Vt,o.COLOR_ATTACHMENT0+Dt,o.TEXTURE_2D,0),P(Vt,Bt)&&L(o.TEXTURE_2D)}i.unbindTexture()}else{let At=o.TEXTURE_2D;if((D.isWebGL3DRenderTarget||D.isWebGLArrayRenderTarget)&&(h?At=D.isWebGL3DRenderTarget?o.TEXTURE_3D:o.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),i.bindTexture(At,yt.__webglTexture),I(At,T,Bt),h&&T.mipmaps&&T.mipmaps.length>0)for(let Dt=0;Dt<T.mipmaps.length;Dt++)Ot(tt.__webglFramebuffer[Dt],D,T,o.COLOR_ATTACHMENT0,At,Dt);else Ot(tt.__webglFramebuffer,D,T,o.COLOR_ATTACHMENT0,At,0);P(T,Bt)&&L(At),i.unbindTexture()}D.depthBuffer&&kt(D)}function Ze(D){const T=S(D)||h,tt=D.isWebGLMultipleRenderTargets===!0?D.texture:[D.texture];for(let yt=0,xt=tt.length;yt<xt;yt++){const gt=tt[yt];if(P(gt,T)){const Bt=D.isWebGLCubeRenderTarget?o.TEXTURE_CUBE_MAP:o.TEXTURE_2D,At=r.get(gt).__webglTexture;i.bindTexture(Bt,At),L(Bt),i.unbindTexture()}}}function Wt(D){if(h&&D.samples>0&&Ht(D)===!1){const T=D.isWebGLMultipleRenderTargets?D.texture:[D.texture],tt=D.width,yt=D.height;let xt=o.COLOR_BUFFER_BIT;const gt=[],Bt=D.stencilBuffer?o.DEPTH_STENCIL_ATTACHMENT:o.DEPTH_ATTACHMENT,At=r.get(D),Dt=D.isWebGLMultipleRenderTargets===!0;if(Dt)for(let Xt=0;Xt<T.length;Xt++)i.bindFramebuffer(o.FRAMEBUFFER,At.__webglMultisampledFramebuffer),o.framebufferRenderbuffer(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0+Xt,o.RENDERBUFFER,null),i.bindFramebuffer(o.FRAMEBUFFER,At.__webglFramebuffer),o.framebufferTexture2D(o.DRAW_FRAMEBUFFER,o.COLOR_ATTACHMENT0+Xt,o.TEXTURE_2D,null,0);i.bindFramebuffer(o.READ_FRAMEBUFFER,At.__webglMultisampledFramebuffer),i.bindFramebuffer(o.DRAW_FRAMEBUFFER,At.__webglFramebuffer);for(let Xt=0;Xt<T.length;Xt++){gt.push(o.COLOR_ATTACHMENT0+Xt),D.depthBuffer&&gt.push(Bt);const Vt=At.__ignoreDepthValues!==void 0?At.__ignoreDepthValues:!1;if(Vt===!1&&(D.depthBuffer&&(xt|=o.DEPTH_BUFFER_BIT),D.stencilBuffer&&(xt|=o.STENCIL_BUFFER_BIT)),Dt&&o.framebufferRenderbuffer(o.READ_FRAMEBUFFER,o.COLOR_ATTACHMENT0,o.RENDERBUFFER,At.__webglColorRenderbuffer[Xt]),Vt===!0&&(o.invalidateFramebuffer(o.READ_FRAMEBUFFER,[Bt]),o.invalidateFramebuffer(o.DRAW_FRAMEBUFFER,[Bt])),Dt){const Mt=r.get(T[Xt]).__webglTexture;o.framebufferTexture2D(o.DRAW_FRAMEBUFFER,o.COLOR_ATTACHMENT0,o.TEXTURE_2D,Mt,0)}o.blitFramebuffer(0,0,tt,yt,0,0,tt,yt,xt,o.NEAREST),p&&o.invalidateFramebuffer(o.READ_FRAMEBUFFER,gt)}if(i.bindFramebuffer(o.READ_FRAMEBUFFER,null),i.bindFramebuffer(o.DRAW_FRAMEBUFFER,null),Dt)for(let Xt=0;Xt<T.length;Xt++){i.bindFramebuffer(o.FRAMEBUFFER,At.__webglMultisampledFramebuffer),o.framebufferRenderbuffer(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0+Xt,o.RENDERBUFFER,At.__webglColorRenderbuffer[Xt]);const Vt=r.get(T[Xt]).__webglTexture;i.bindFramebuffer(o.FRAMEBUFFER,At.__webglFramebuffer),o.framebufferTexture2D(o.DRAW_FRAMEBUFFER,o.COLOR_ATTACHMENT0+Xt,o.TEXTURE_2D,Vt,0)}i.bindFramebuffer(o.DRAW_FRAMEBUFFER,At.__webglMultisampledFramebuffer)}}function Qt(D){return Math.min(l.maxSamples,D.samples)}function Ht(D){const T=r.get(D);return h&&D.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&T.__useRenderToTexture!==!1}function Se(D){const T=d.render.frame;g.get(D)!==T&&(g.set(D,T),D.update())}function de(D,T){const tt=D.colorSpace,yt=D.format,xt=D.type;return D.isCompressedTexture===!0||D.isVideoTexture===!0||D.format===vh||tt!==$i&&tt!==hi&&(Fe.getTransfer(tt)===je?h===!1?e.has("EXT_sRGB")===!0&&yt===Ei?(D.format=vh,D.minFilter=ui,D.generateMipmaps=!1):T=K_.sRGBToLinear(T):(yt!==Ei||xt!==Oa)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",tt)),T}this.allocateTextureUnit=X,this.resetTextureUnits=Et,this.setTexture2D=N,this.setTexture2DArray=q,this.setTexture3D=K,this.setTextureCube=ct,this.rebindTextures=oe,this.setupRenderTarget=nt,this.updateRenderTargetMipmap=Ze,this.updateMultisampleRenderTarget=Wt,this.setupDepthRenderbuffer=kt,this.setupFrameBufferTexture=Ot,this.useMultisampledRTT=Ht}function Lb(o,e,i){const r=i.isWebGL2;function l(u,d=hi){let h;const m=Fe.getTransfer(d);if(u===Oa)return o.UNSIGNED_BYTE;if(u===G_)return o.UNSIGNED_SHORT_4_4_4_4;if(u===V_)return o.UNSIGNED_SHORT_5_5_5_1;if(u===fx)return o.BYTE;if(u===hx)return o.SHORT;if(u===bh)return o.UNSIGNED_SHORT;if(u===H_)return o.INT;if(u===Ca)return o.UNSIGNED_INT;if(u===Da)return o.FLOAT;if(u===Ro)return r?o.HALF_FLOAT:(h=e.get("OES_texture_half_float"),h!==null?h.HALF_FLOAT_OES:null);if(u===dx)return o.ALPHA;if(u===Ei)return o.RGBA;if(u===px)return o.LUMINANCE;if(u===mx)return o.LUMINANCE_ALPHA;if(u===ur)return o.DEPTH_COMPONENT;if(u===gs)return o.DEPTH_STENCIL;if(u===vh)return h=e.get("EXT_sRGB"),h!==null?h.SRGB_ALPHA_EXT:null;if(u===gx)return o.RED;if(u===k_)return o.RED_INTEGER;if(u===_x)return o.RG;if(u===X_)return o.RG_INTEGER;if(u===W_)return o.RGBA_INTEGER;if(u===Nf||u===Of||u===Pf||u===zf)if(m===je)if(h=e.get("WEBGL_compressed_texture_s3tc_srgb"),h!==null){if(u===Nf)return h.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(u===Of)return h.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(u===Pf)return h.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(u===zf)return h.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(h=e.get("WEBGL_compressed_texture_s3tc"),h!==null){if(u===Nf)return h.COMPRESSED_RGB_S3TC_DXT1_EXT;if(u===Of)return h.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(u===Pf)return h.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(u===zf)return h.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(u===Sg||u===xg||u===Mg||u===yg)if(h=e.get("WEBGL_compressed_texture_pvrtc"),h!==null){if(u===Sg)return h.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(u===xg)return h.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(u===Mg)return h.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(u===yg)return h.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(u===q_)return h=e.get("WEBGL_compressed_texture_etc1"),h!==null?h.COMPRESSED_RGB_ETC1_WEBGL:null;if(u===Eg||u===Tg)if(h=e.get("WEBGL_compressed_texture_etc"),h!==null){if(u===Eg)return m===je?h.COMPRESSED_SRGB8_ETC2:h.COMPRESSED_RGB8_ETC2;if(u===Tg)return m===je?h.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:h.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(u===bg||u===Ag||u===Rg||u===wg||u===Cg||u===Dg||u===Lg||u===Ug||u===Ng||u===Og||u===Pg||u===zg||u===Bg||u===Ig)if(h=e.get("WEBGL_compressed_texture_astc"),h!==null){if(u===bg)return m===je?h.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:h.COMPRESSED_RGBA_ASTC_4x4_KHR;if(u===Ag)return m===je?h.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:h.COMPRESSED_RGBA_ASTC_5x4_KHR;if(u===Rg)return m===je?h.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:h.COMPRESSED_RGBA_ASTC_5x5_KHR;if(u===wg)return m===je?h.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:h.COMPRESSED_RGBA_ASTC_6x5_KHR;if(u===Cg)return m===je?h.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:h.COMPRESSED_RGBA_ASTC_6x6_KHR;if(u===Dg)return m===je?h.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:h.COMPRESSED_RGBA_ASTC_8x5_KHR;if(u===Lg)return m===je?h.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:h.COMPRESSED_RGBA_ASTC_8x6_KHR;if(u===Ug)return m===je?h.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:h.COMPRESSED_RGBA_ASTC_8x8_KHR;if(u===Ng)return m===je?h.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:h.COMPRESSED_RGBA_ASTC_10x5_KHR;if(u===Og)return m===je?h.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:h.COMPRESSED_RGBA_ASTC_10x6_KHR;if(u===Pg)return m===je?h.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:h.COMPRESSED_RGBA_ASTC_10x8_KHR;if(u===zg)return m===je?h.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:h.COMPRESSED_RGBA_ASTC_10x10_KHR;if(u===Bg)return m===je?h.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:h.COMPRESSED_RGBA_ASTC_12x10_KHR;if(u===Ig)return m===je?h.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:h.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(u===Bf||u===Fg||u===Hg)if(h=e.get("EXT_texture_compression_bptc"),h!==null){if(u===Bf)return m===je?h.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:h.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(u===Fg)return h.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(u===Hg)return h.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(u===vx||u===Gg||u===Vg||u===kg)if(h=e.get("EXT_texture_compression_rgtc"),h!==null){if(u===Bf)return h.COMPRESSED_RED_RGTC1_EXT;if(u===Gg)return h.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(u===Vg)return h.COMPRESSED_RED_GREEN_RGTC2_EXT;if(u===kg)return h.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return u===cr?r?o.UNSIGNED_INT_24_8:(h=e.get("WEBGL_depth_texture"),h!==null?h.UNSIGNED_INT_24_8_WEBGL:null):o[u]!==void 0?o[u]:null}return{convert:l}}class Ub extends fi{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class To extends Xn{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Nb={type:"move"};class lh{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new To,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new To,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new st,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new st),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new To,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new st,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new st),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const i=this._hand;if(i)for(const r of e.hand.values())this._getHandJoint(i,r)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,i,r){let l=null,u=null,d=null;const h=this._targetRay,m=this._grip,p=this._hand;if(e&&i.session.visibilityState!=="visible-blurred"){if(p&&e.hand){d=!0;for(const b of e.hand.values()){const S=i.getJointPose(b,r),_=this._getHandJoint(p,b);S!==null&&(_.matrix.fromArray(S.transform.matrix),_.matrix.decompose(_.position,_.rotation,_.scale),_.matrixWorldNeedsUpdate=!0,_.jointRadius=S.radius),_.visible=S!==null}const g=p.joints["index-finger-tip"],v=p.joints["thumb-tip"],x=g.position.distanceTo(v.position),y=.02,A=.005;p.inputState.pinching&&x>y+A?(p.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!p.inputState.pinching&&x<=y-A&&(p.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else m!==null&&e.gripSpace&&(u=i.getPose(e.gripSpace,r),u!==null&&(m.matrix.fromArray(u.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,u.linearVelocity?(m.hasLinearVelocity=!0,m.linearVelocity.copy(u.linearVelocity)):m.hasLinearVelocity=!1,u.angularVelocity?(m.hasAngularVelocity=!0,m.angularVelocity.copy(u.angularVelocity)):m.hasAngularVelocity=!1));h!==null&&(l=i.getPose(e.targetRaySpace,r),l===null&&u!==null&&(l=u),l!==null&&(h.matrix.fromArray(l.transform.matrix),h.matrix.decompose(h.position,h.rotation,h.scale),h.matrixWorldNeedsUpdate=!0,l.linearVelocity?(h.hasLinearVelocity=!0,h.linearVelocity.copy(l.linearVelocity)):h.hasLinearVelocity=!1,l.angularVelocity?(h.hasAngularVelocity=!0,h.angularVelocity.copy(l.angularVelocity)):h.hasAngularVelocity=!1,this.dispatchEvent(Nb)))}return h!==null&&(h.visible=l!==null),m!==null&&(m.visible=u!==null),p!==null&&(p.visible=d!==null),this}_getHandJoint(e,i){if(e.joints[i.jointName]===void 0){const r=new To;r.matrixAutoUpdate=!1,r.visible=!1,e.joints[i.jointName]=r,e.add(r)}return e.joints[i.jointName]}}class Ob extends vs{constructor(e,i){super();const r=this;let l=null,u=1,d=null,h="local-floor",m=1,p=null,g=null,v=null,x=null,y=null,A=null;const b=i.getContextAttributes();let S=null,_=null;const P=[],L=[],O=new He;let k=null;const F=new fi;F.layers.enable(1),F.viewport=new bn;const B=new fi;B.layers.enable(2),B.viewport=new bn;const pt=[F,B],w=new Ub;w.layers.enable(1),w.layers.enable(2);let U=null,lt=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(I){let $=P[I];return $===void 0&&($=new lh,P[I]=$),$.getTargetRaySpace()},this.getControllerGrip=function(I){let $=P[I];return $===void 0&&($=new lh,P[I]=$),$.getGripSpace()},this.getHand=function(I){let $=P[I];return $===void 0&&($=new lh,P[I]=$),$.getHandSpace()};function ut(I){const $=L.indexOf(I.inputSource);if($===-1)return;const _t=P[$];_t!==void 0&&(_t.update(I.inputSource,I.frame,p||d),_t.dispatchEvent({type:I.type,data:I.inputSource}))}function Et(){l.removeEventListener("select",ut),l.removeEventListener("selectstart",ut),l.removeEventListener("selectend",ut),l.removeEventListener("squeeze",ut),l.removeEventListener("squeezestart",ut),l.removeEventListener("squeezeend",ut),l.removeEventListener("end",Et),l.removeEventListener("inputsourceschange",X);for(let I=0;I<P.length;I++){const $=L[I];$!==null&&(L[I]=null,P[I].disconnect($))}U=null,lt=null,e.setRenderTarget(S),y=null,x=null,v=null,l=null,_=null,j.stop(),r.isPresenting=!1,e.setPixelRatio(k),e.setSize(O.width,O.height,!1),r.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(I){u=I,r.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(I){h=I,r.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return p||d},this.setReferenceSpace=function(I){p=I},this.getBaseLayer=function(){return x!==null?x:y},this.getBinding=function(){return v},this.getFrame=function(){return A},this.getSession=function(){return l},this.setSession=async function(I){if(l=I,l!==null){if(S=e.getRenderTarget(),l.addEventListener("select",ut),l.addEventListener("selectstart",ut),l.addEventListener("selectend",ut),l.addEventListener("squeeze",ut),l.addEventListener("squeezestart",ut),l.addEventListener("squeezeend",ut),l.addEventListener("end",Et),l.addEventListener("inputsourceschange",X),b.xrCompatible!==!0&&await i.makeXRCompatible(),k=e.getPixelRatio(),e.getSize(O),l.renderState.layers===void 0||e.capabilities.isWebGL2===!1){const $={antialias:l.renderState.layers===void 0?b.antialias:!0,alpha:!0,depth:b.depth,stencil:b.stencil,framebufferScaleFactor:u};y=new XRWebGLLayer(l,i,$),l.updateRenderState({baseLayer:y}),e.setPixelRatio(1),e.setSize(y.framebufferWidth,y.framebufferHeight,!1),_=new dr(y.framebufferWidth,y.framebufferHeight,{format:Ei,type:Oa,colorSpace:e.outputColorSpace,stencilBuffer:b.stencil})}else{let $=null,_t=null,vt=null;b.depth&&(vt=b.stencil?i.DEPTH24_STENCIL8:i.DEPTH_COMPONENT24,$=b.stencil?gs:ur,_t=b.stencil?cr:Ca);const Ot={colorFormat:i.RGBA8,depthFormat:vt,scaleFactor:u};v=new XRWebGLBinding(l,i),x=v.createProjectionLayer(Ot),l.updateRenderState({layers:[x]}),e.setPixelRatio(1),e.setSize(x.textureWidth,x.textureHeight,!1),_=new dr(x.textureWidth,x.textureHeight,{format:Ei,type:Oa,depthTexture:new uv(x.textureWidth,x.textureHeight,_t,void 0,void 0,void 0,void 0,void 0,void 0,$),stencilBuffer:b.stencil,colorSpace:e.outputColorSpace,samples:b.antialias?4:0});const Pt=e.properties.get(_);Pt.__ignoreDepthValues=x.ignoreDepthValues}_.isXRRenderTarget=!0,this.setFoveation(m),p=null,d=await l.requestReferenceSpace(h),j.setContext(l),j.start(),r.isPresenting=!0,r.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(l!==null)return l.environmentBlendMode};function X(I){for(let $=0;$<I.removed.length;$++){const _t=I.removed[$],vt=L.indexOf(_t);vt>=0&&(L[vt]=null,P[vt].disconnect(_t))}for(let $=0;$<I.added.length;$++){const _t=I.added[$];let vt=L.indexOf(_t);if(vt===-1){for(let Pt=0;Pt<P.length;Pt++)if(Pt>=L.length){L.push(_t),vt=Pt;break}else if(L[Pt]===null){L[Pt]=_t,vt=Pt;break}if(vt===-1)break}const Ot=P[vt];Ot&&Ot.connect(_t)}}const J=new st,N=new st;function q(I,$,_t){J.setFromMatrixPosition($.matrixWorld),N.setFromMatrixPosition(_t.matrixWorld);const vt=J.distanceTo(N),Ot=$.projectionMatrix.elements,Pt=_t.projectionMatrix.elements,Kt=Ot[14]/(Ot[10]-1),kt=Ot[14]/(Ot[10]+1),oe=(Ot[9]+1)/Ot[5],nt=(Ot[9]-1)/Ot[5],Ze=(Ot[8]-1)/Ot[0],Wt=(Pt[8]+1)/Pt[0],Qt=Kt*Ze,Ht=Kt*Wt,Se=vt/(-Ze+Wt),de=Se*-Ze;$.matrixWorld.decompose(I.position,I.quaternion,I.scale),I.translateX(de),I.translateZ(Se),I.matrixWorld.compose(I.position,I.quaternion,I.scale),I.matrixWorldInverse.copy(I.matrixWorld).invert();const D=Kt+Se,T=kt+Se,tt=Qt-de,yt=Ht+(vt-de),xt=oe*kt/T*D,gt=nt*kt/T*D;I.projectionMatrix.makePerspective(tt,yt,xt,gt,D,T),I.projectionMatrixInverse.copy(I.projectionMatrix).invert()}function K(I,$){$===null?I.matrixWorld.copy(I.matrix):I.matrixWorld.multiplyMatrices($.matrixWorld,I.matrix),I.matrixWorldInverse.copy(I.matrixWorld).invert()}this.updateCamera=function(I){if(l===null)return;w.near=B.near=F.near=I.near,w.far=B.far=F.far=I.far,(U!==w.near||lt!==w.far)&&(l.updateRenderState({depthNear:w.near,depthFar:w.far}),U=w.near,lt=w.far);const $=I.parent,_t=w.cameras;K(w,$);for(let vt=0;vt<_t.length;vt++)K(_t[vt],$);_t.length===2?q(w,F,B):w.projectionMatrix.copy(F.projectionMatrix),ct(I,w,$)};function ct(I,$,_t){_t===null?I.matrix.copy($.matrixWorld):(I.matrix.copy(_t.matrixWorld),I.matrix.invert(),I.matrix.multiply($.matrixWorld)),I.matrix.decompose(I.position,I.quaternion,I.scale),I.updateMatrixWorld(!0),I.projectionMatrix.copy($.projectionMatrix),I.projectionMatrixInverse.copy($.projectionMatrixInverse),I.isPerspectiveCamera&&(I.fov=Sh*2*Math.atan(1/I.projectionMatrix.elements[5]),I.zoom=1)}this.getCamera=function(){return w},this.getFoveation=function(){if(!(x===null&&y===null))return m},this.setFoveation=function(I){m=I,x!==null&&(x.fixedFoveation=I),y!==null&&y.fixedFoveation!==void 0&&(y.fixedFoveation=I)};let R=null;function V(I,$){if(g=$.getViewerPose(p||d),A=$,g!==null){const _t=g.views;y!==null&&(e.setRenderTargetFramebuffer(_,y.framebuffer),e.setRenderTarget(_));let vt=!1;_t.length!==w.cameras.length&&(w.cameras.length=0,vt=!0);for(let Ot=0;Ot<_t.length;Ot++){const Pt=_t[Ot];let Kt=null;if(y!==null)Kt=y.getViewport(Pt);else{const oe=v.getViewSubImage(x,Pt);Kt=oe.viewport,Ot===0&&(e.setRenderTargetTextures(_,oe.colorTexture,x.ignoreDepthValues?void 0:oe.depthStencilTexture),e.setRenderTarget(_))}let kt=pt[Ot];kt===void 0&&(kt=new fi,kt.layers.enable(Ot),kt.viewport=new bn,pt[Ot]=kt),kt.matrix.fromArray(Pt.transform.matrix),kt.matrix.decompose(kt.position,kt.quaternion,kt.scale),kt.projectionMatrix.fromArray(Pt.projectionMatrix),kt.projectionMatrixInverse.copy(kt.projectionMatrix).invert(),kt.viewport.set(Kt.x,Kt.y,Kt.width,Kt.height),Ot===0&&(w.matrix.copy(kt.matrix),w.matrix.decompose(w.position,w.quaternion,w.scale)),vt===!0&&w.cameras.push(kt)}}for(let _t=0;_t<P.length;_t++){const vt=L[_t],Ot=P[_t];vt!==null&&Ot!==void 0&&Ot.update(vt,$,p||d)}R&&R(I,$),$.detectedPlanes&&r.dispatchEvent({type:"planesdetected",data:$}),A=null}const j=new cv;j.setAnimationLoop(V),this.setAnimationLoop=function(I){R=I},this.dispose=function(){}}}function Pb(o,e){function i(S,_){S.matrixAutoUpdate===!0&&S.updateMatrix(),_.value.copy(S.matrix)}function r(S,_){_.color.getRGB(S.fogColor.value,rv(o)),_.isFog?(S.fogNear.value=_.near,S.fogFar.value=_.far):_.isFogExp2&&(S.fogDensity.value=_.density)}function l(S,_,P,L,O){_.isMeshBasicMaterial||_.isMeshLambertMaterial?u(S,_):_.isMeshToonMaterial?(u(S,_),v(S,_)):_.isMeshPhongMaterial?(u(S,_),g(S,_)):_.isMeshStandardMaterial?(u(S,_),x(S,_),_.isMeshPhysicalMaterial&&y(S,_,O)):_.isMeshMatcapMaterial?(u(S,_),A(S,_)):_.isMeshDepthMaterial?u(S,_):_.isMeshDistanceMaterial?(u(S,_),b(S,_)):_.isMeshNormalMaterial?u(S,_):_.isLineBasicMaterial?(d(S,_),_.isLineDashedMaterial&&h(S,_)):_.isPointsMaterial?m(S,_,P,L):_.isSpriteMaterial?p(S,_):_.isShadowMaterial?(S.color.value.copy(_.color),S.opacity.value=_.opacity):_.isShaderMaterial&&(_.uniformsNeedUpdate=!1)}function u(S,_){S.opacity.value=_.opacity,_.color&&S.diffuse.value.copy(_.color),_.emissive&&S.emissive.value.copy(_.emissive).multiplyScalar(_.emissiveIntensity),_.map&&(S.map.value=_.map,i(_.map,S.mapTransform)),_.alphaMap&&(S.alphaMap.value=_.alphaMap,i(_.alphaMap,S.alphaMapTransform)),_.bumpMap&&(S.bumpMap.value=_.bumpMap,i(_.bumpMap,S.bumpMapTransform),S.bumpScale.value=_.bumpScale,_.side===kn&&(S.bumpScale.value*=-1)),_.normalMap&&(S.normalMap.value=_.normalMap,i(_.normalMap,S.normalMapTransform),S.normalScale.value.copy(_.normalScale),_.side===kn&&S.normalScale.value.negate()),_.displacementMap&&(S.displacementMap.value=_.displacementMap,i(_.displacementMap,S.displacementMapTransform),S.displacementScale.value=_.displacementScale,S.displacementBias.value=_.displacementBias),_.emissiveMap&&(S.emissiveMap.value=_.emissiveMap,i(_.emissiveMap,S.emissiveMapTransform)),_.specularMap&&(S.specularMap.value=_.specularMap,i(_.specularMap,S.specularMapTransform)),_.alphaTest>0&&(S.alphaTest.value=_.alphaTest);const P=e.get(_).envMap;if(P&&(S.envMap.value=P,S.flipEnvMap.value=P.isCubeTexture&&P.isRenderTargetTexture===!1?-1:1,S.reflectivity.value=_.reflectivity,S.ior.value=_.ior,S.refractionRatio.value=_.refractionRatio),_.lightMap){S.lightMap.value=_.lightMap;const L=o._useLegacyLights===!0?Math.PI:1;S.lightMapIntensity.value=_.lightMapIntensity*L,i(_.lightMap,S.lightMapTransform)}_.aoMap&&(S.aoMap.value=_.aoMap,S.aoMapIntensity.value=_.aoMapIntensity,i(_.aoMap,S.aoMapTransform))}function d(S,_){S.diffuse.value.copy(_.color),S.opacity.value=_.opacity,_.map&&(S.map.value=_.map,i(_.map,S.mapTransform))}function h(S,_){S.dashSize.value=_.dashSize,S.totalSize.value=_.dashSize+_.gapSize,S.scale.value=_.scale}function m(S,_,P,L){S.diffuse.value.copy(_.color),S.opacity.value=_.opacity,S.size.value=_.size*P,S.scale.value=L*.5,_.map&&(S.map.value=_.map,i(_.map,S.uvTransform)),_.alphaMap&&(S.alphaMap.value=_.alphaMap,i(_.alphaMap,S.alphaMapTransform)),_.alphaTest>0&&(S.alphaTest.value=_.alphaTest)}function p(S,_){S.diffuse.value.copy(_.color),S.opacity.value=_.opacity,S.rotation.value=_.rotation,_.map&&(S.map.value=_.map,i(_.map,S.mapTransform)),_.alphaMap&&(S.alphaMap.value=_.alphaMap,i(_.alphaMap,S.alphaMapTransform)),_.alphaTest>0&&(S.alphaTest.value=_.alphaTest)}function g(S,_){S.specular.value.copy(_.specular),S.shininess.value=Math.max(_.shininess,1e-4)}function v(S,_){_.gradientMap&&(S.gradientMap.value=_.gradientMap)}function x(S,_){S.metalness.value=_.metalness,_.metalnessMap&&(S.metalnessMap.value=_.metalnessMap,i(_.metalnessMap,S.metalnessMapTransform)),S.roughness.value=_.roughness,_.roughnessMap&&(S.roughnessMap.value=_.roughnessMap,i(_.roughnessMap,S.roughnessMapTransform)),e.get(_).envMap&&(S.envMapIntensity.value=_.envMapIntensity)}function y(S,_,P){S.ior.value=_.ior,_.sheen>0&&(S.sheenColor.value.copy(_.sheenColor).multiplyScalar(_.sheen),S.sheenRoughness.value=_.sheenRoughness,_.sheenColorMap&&(S.sheenColorMap.value=_.sheenColorMap,i(_.sheenColorMap,S.sheenColorMapTransform)),_.sheenRoughnessMap&&(S.sheenRoughnessMap.value=_.sheenRoughnessMap,i(_.sheenRoughnessMap,S.sheenRoughnessMapTransform))),_.clearcoat>0&&(S.clearcoat.value=_.clearcoat,S.clearcoatRoughness.value=_.clearcoatRoughness,_.clearcoatMap&&(S.clearcoatMap.value=_.clearcoatMap,i(_.clearcoatMap,S.clearcoatMapTransform)),_.clearcoatRoughnessMap&&(S.clearcoatRoughnessMap.value=_.clearcoatRoughnessMap,i(_.clearcoatRoughnessMap,S.clearcoatRoughnessMapTransform)),_.clearcoatNormalMap&&(S.clearcoatNormalMap.value=_.clearcoatNormalMap,i(_.clearcoatNormalMap,S.clearcoatNormalMapTransform),S.clearcoatNormalScale.value.copy(_.clearcoatNormalScale),_.side===kn&&S.clearcoatNormalScale.value.negate())),_.iridescence>0&&(S.iridescence.value=_.iridescence,S.iridescenceIOR.value=_.iridescenceIOR,S.iridescenceThicknessMinimum.value=_.iridescenceThicknessRange[0],S.iridescenceThicknessMaximum.value=_.iridescenceThicknessRange[1],_.iridescenceMap&&(S.iridescenceMap.value=_.iridescenceMap,i(_.iridescenceMap,S.iridescenceMapTransform)),_.iridescenceThicknessMap&&(S.iridescenceThicknessMap.value=_.iridescenceThicknessMap,i(_.iridescenceThicknessMap,S.iridescenceThicknessMapTransform))),_.transmission>0&&(S.transmission.value=_.transmission,S.transmissionSamplerMap.value=P.texture,S.transmissionSamplerSize.value.set(P.width,P.height),_.transmissionMap&&(S.transmissionMap.value=_.transmissionMap,i(_.transmissionMap,S.transmissionMapTransform)),S.thickness.value=_.thickness,_.thicknessMap&&(S.thicknessMap.value=_.thicknessMap,i(_.thicknessMap,S.thicknessMapTransform)),S.attenuationDistance.value=_.attenuationDistance,S.attenuationColor.value.copy(_.attenuationColor)),_.anisotropy>0&&(S.anisotropyVector.value.set(_.anisotropy*Math.cos(_.anisotropyRotation),_.anisotropy*Math.sin(_.anisotropyRotation)),_.anisotropyMap&&(S.anisotropyMap.value=_.anisotropyMap,i(_.anisotropyMap,S.anisotropyMapTransform))),S.specularIntensity.value=_.specularIntensity,S.specularColor.value.copy(_.specularColor),_.specularColorMap&&(S.specularColorMap.value=_.specularColorMap,i(_.specularColorMap,S.specularColorMapTransform)),_.specularIntensityMap&&(S.specularIntensityMap.value=_.specularIntensityMap,i(_.specularIntensityMap,S.specularIntensityMapTransform))}function A(S,_){_.matcap&&(S.matcap.value=_.matcap)}function b(S,_){const P=e.get(_).light;S.referencePosition.value.setFromMatrixPosition(P.matrixWorld),S.nearDistance.value=P.shadow.camera.near,S.farDistance.value=P.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:l}}function zb(o,e,i,r){let l={},u={},d=[];const h=i.isWebGL2?o.getParameter(o.MAX_UNIFORM_BUFFER_BINDINGS):0;function m(P,L){const O=L.program;r.uniformBlockBinding(P,O)}function p(P,L){let O=l[P.id];O===void 0&&(A(P),O=g(P),l[P.id]=O,P.addEventListener("dispose",S));const k=L.program;r.updateUBOMapping(P,k);const F=e.render.frame;u[P.id]!==F&&(x(P),u[P.id]=F)}function g(P){const L=v();P.__bindingPointIndex=L;const O=o.createBuffer(),k=P.__size,F=P.usage;return o.bindBuffer(o.UNIFORM_BUFFER,O),o.bufferData(o.UNIFORM_BUFFER,k,F),o.bindBuffer(o.UNIFORM_BUFFER,null),o.bindBufferBase(o.UNIFORM_BUFFER,L,O),O}function v(){for(let P=0;P<h;P++)if(d.indexOf(P)===-1)return d.push(P),P;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function x(P){const L=l[P.id],O=P.uniforms,k=P.__cache;o.bindBuffer(o.UNIFORM_BUFFER,L);for(let F=0,B=O.length;F<B;F++){const pt=Array.isArray(O[F])?O[F]:[O[F]];for(let w=0,U=pt.length;w<U;w++){const lt=pt[w];if(y(lt,F,w,k)===!0){const ut=lt.__offset,Et=Array.isArray(lt.value)?lt.value:[lt.value];let X=0;for(let J=0;J<Et.length;J++){const N=Et[J],q=b(N);typeof N=="number"||typeof N=="boolean"?(lt.__data[0]=N,o.bufferSubData(o.UNIFORM_BUFFER,ut+X,lt.__data)):N.isMatrix3?(lt.__data[0]=N.elements[0],lt.__data[1]=N.elements[1],lt.__data[2]=N.elements[2],lt.__data[3]=0,lt.__data[4]=N.elements[3],lt.__data[5]=N.elements[4],lt.__data[6]=N.elements[5],lt.__data[7]=0,lt.__data[8]=N.elements[6],lt.__data[9]=N.elements[7],lt.__data[10]=N.elements[8],lt.__data[11]=0):(N.toArray(lt.__data,X),X+=q.storage/Float32Array.BYTES_PER_ELEMENT)}o.bufferSubData(o.UNIFORM_BUFFER,ut,lt.__data)}}}o.bindBuffer(o.UNIFORM_BUFFER,null)}function y(P,L,O,k){const F=P.value,B=L+"_"+O;if(k[B]===void 0)return typeof F=="number"||typeof F=="boolean"?k[B]=F:k[B]=F.clone(),!0;{const pt=k[B];if(typeof F=="number"||typeof F=="boolean"){if(pt!==F)return k[B]=F,!0}else if(pt.equals(F)===!1)return pt.copy(F),!0}return!1}function A(P){const L=P.uniforms;let O=0;const k=16;for(let B=0,pt=L.length;B<pt;B++){const w=Array.isArray(L[B])?L[B]:[L[B]];for(let U=0,lt=w.length;U<lt;U++){const ut=w[U],Et=Array.isArray(ut.value)?ut.value:[ut.value];for(let X=0,J=Et.length;X<J;X++){const N=Et[X],q=b(N),K=O%k;K!==0&&k-K<q.boundary&&(O+=k-K),ut.__data=new Float32Array(q.storage/Float32Array.BYTES_PER_ELEMENT),ut.__offset=O,O+=q.storage}}}const F=O%k;return F>0&&(O+=k-F),P.__size=O,P.__cache={},this}function b(P){const L={boundary:0,storage:0};return typeof P=="number"||typeof P=="boolean"?(L.boundary=4,L.storage=4):P.isVector2?(L.boundary=8,L.storage=8):P.isVector3||P.isColor?(L.boundary=16,L.storage=12):P.isVector4?(L.boundary=16,L.storage=16):P.isMatrix3?(L.boundary=48,L.storage=48):P.isMatrix4?(L.boundary=64,L.storage=64):P.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",P),L}function S(P){const L=P.target;L.removeEventListener("dispose",S);const O=d.indexOf(L.__bindingPointIndex);d.splice(O,1),o.deleteBuffer(l[L.id]),delete l[L.id],delete u[L.id]}function _(){for(const P in l)o.deleteBuffer(l[P]);d=[],l={},u={}}return{bind:m,update:p,dispose:_}}class gv{constructor(e={}){const{canvas:i=Lx(),context:r=null,depth:l=!0,stencil:u=!0,alpha:d=!1,antialias:h=!1,premultipliedAlpha:m=!0,preserveDrawingBuffer:p=!1,powerPreference:g="default",failIfMajorPerformanceCaveat:v=!1}=e;this.isWebGLRenderer=!0;let x;r!==null?x=r.getContextAttributes().alpha:x=d;const y=new Uint32Array(4),A=new Int32Array(4);let b=null,S=null;const _=[],P=[];this.domElement=i,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Tn,this._useLegacyLights=!1,this.toneMapping=Na,this.toneMappingExposure=1;const L=this;let O=!1,k=0,F=0,B=null,pt=-1,w=null;const U=new bn,lt=new bn;let ut=null;const Et=new pe(0);let X=0,J=i.width,N=i.height,q=1,K=null,ct=null;const R=new bn(0,0,J,N),V=new bn(0,0,J,N);let j=!1;const I=new lv;let $=!1,_t=!1,vt=null;const Ot=new _n,Pt=new He,Kt=new st,kt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function oe(){return B===null?q:1}let nt=r;function Ze(C,W){for(let rt=0;rt<C.length;rt++){const ot=C[rt],it=i.getContext(ot,W);if(it!==null)return it}return null}try{const C={alpha:!0,depth:l,stencil:u,antialias:h,premultipliedAlpha:m,preserveDrawingBuffer:p,powerPreference:g,failIfMajorPerformanceCaveat:v};if("setAttribute"in i&&i.setAttribute("data-engine",`three.js r${Th}`),i.addEventListener("webglcontextlost",Tt,!1),i.addEventListener("webglcontextrestored",H,!1),i.addEventListener("webglcontextcreationerror",bt,!1),nt===null){const W=["webgl2","webgl","experimental-webgl"];if(L.isWebGL1Renderer===!0&&W.shift(),nt=Ze(W,C),nt===null)throw Ze(W)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&nt instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),nt.getShaderPrecisionFormat===void 0&&(nt.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(C){throw console.error("THREE.WebGLRenderer: "+C.message),C}let Wt,Qt,Ht,Se,de,D,T,tt,yt,xt,gt,Bt,At,Dt,Xt,Vt,Mt,Ee,ue,ne,Gt,zt,ae,Te;function Ge(){Wt=new qE(nt),Qt=new FE(nt,Wt,e),Wt.init(Qt),zt=new Lb(nt,Wt,Qt),Ht=new Cb(nt,Wt,Qt),Se=new ZE(nt),de=new mb,D=new Db(nt,Wt,Ht,de,Qt,zt,Se),T=new GE(L),tt=new WE(L),yt=new nM(nt,Qt),ae=new BE(nt,Wt,yt,Qt),xt=new YE(nt,yt,Se,ae),gt=new $E(nt,xt,yt,Se),ue=new JE(nt,Qt,D),Vt=new HE(de),Bt=new pb(L,T,tt,Wt,Qt,ae,Vt),At=new Pb(L,de),Dt=new _b,Xt=new Eb(Wt,Qt),Ee=new zE(L,T,tt,Ht,gt,x,m),Mt=new wb(L,gt,Qt),Te=new zb(nt,Se,Qt,Ht),ne=new IE(nt,Wt,Se,Qt),Gt=new jE(nt,Wt,Se,Qt),Se.programs=Bt.programs,L.capabilities=Qt,L.extensions=Wt,L.properties=de,L.renderLists=Dt,L.shadowMap=Mt,L.state=Ht,L.info=Se}Ge();const fe=new Ob(L,nt);this.xr=fe,this.getContext=function(){return nt},this.getContextAttributes=function(){return nt.getContextAttributes()},this.forceContextLoss=function(){const C=Wt.get("WEBGL_lose_context");C&&C.loseContext()},this.forceContextRestore=function(){const C=Wt.get("WEBGL_lose_context");C&&C.restoreContext()},this.getPixelRatio=function(){return q},this.setPixelRatio=function(C){C!==void 0&&(q=C,this.setSize(J,N,!1))},this.getSize=function(C){return C.set(J,N)},this.setSize=function(C,W,rt=!0){if(fe.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}J=C,N=W,i.width=Math.floor(C*q),i.height=Math.floor(W*q),rt===!0&&(i.style.width=C+"px",i.style.height=W+"px"),this.setViewport(0,0,C,W)},this.getDrawingBufferSize=function(C){return C.set(J*q,N*q).floor()},this.setDrawingBufferSize=function(C,W,rt){J=C,N=W,q=rt,i.width=Math.floor(C*rt),i.height=Math.floor(W*rt),this.setViewport(0,0,C,W)},this.getCurrentViewport=function(C){return C.copy(U)},this.getViewport=function(C){return C.copy(R)},this.setViewport=function(C,W,rt,ot){C.isVector4?R.set(C.x,C.y,C.z,C.w):R.set(C,W,rt,ot),Ht.viewport(U.copy(R).multiplyScalar(q).floor())},this.getScissor=function(C){return C.copy(V)},this.setScissor=function(C,W,rt,ot){C.isVector4?V.set(C.x,C.y,C.z,C.w):V.set(C,W,rt,ot),Ht.scissor(lt.copy(V).multiplyScalar(q).floor())},this.getScissorTest=function(){return j},this.setScissorTest=function(C){Ht.setScissorTest(j=C)},this.setOpaqueSort=function(C){K=C},this.setTransparentSort=function(C){ct=C},this.getClearColor=function(C){return C.copy(Ee.getClearColor())},this.setClearColor=function(){Ee.setClearColor.apply(Ee,arguments)},this.getClearAlpha=function(){return Ee.getClearAlpha()},this.setClearAlpha=function(){Ee.setClearAlpha.apply(Ee,arguments)},this.clear=function(C=!0,W=!0,rt=!0){let ot=0;if(C){let it=!1;if(B!==null){const Nt=B.texture.format;it=Nt===W_||Nt===X_||Nt===k_}if(it){const Nt=B.texture.type,Yt=Nt===Oa||Nt===Ca||Nt===bh||Nt===cr||Nt===G_||Nt===V_,te=Ee.getClearColor(),re=Ee.getClearAlpha(),ge=te.r,le=te.g,ce=te.b;Yt?(y[0]=ge,y[1]=le,y[2]=ce,y[3]=re,nt.clearBufferuiv(nt.COLOR,0,y)):(A[0]=ge,A[1]=le,A[2]=ce,A[3]=re,nt.clearBufferiv(nt.COLOR,0,A))}else ot|=nt.COLOR_BUFFER_BIT}W&&(ot|=nt.DEPTH_BUFFER_BIT),rt&&(ot|=nt.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),nt.clear(ot)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){i.removeEventListener("webglcontextlost",Tt,!1),i.removeEventListener("webglcontextrestored",H,!1),i.removeEventListener("webglcontextcreationerror",bt,!1),Dt.dispose(),Xt.dispose(),de.dispose(),T.dispose(),tt.dispose(),gt.dispose(),ae.dispose(),Te.dispose(),Bt.dispose(),fe.dispose(),fe.removeEventListener("sessionstart",Ut),fe.removeEventListener("sessionend",St),vt&&(vt.dispose(),vt=null),Lt.stop()};function Tt(C){C.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),O=!0}function H(){console.log("THREE.WebGLRenderer: Context Restored."),O=!1;const C=Se.autoReset,W=Mt.enabled,rt=Mt.autoUpdate,ot=Mt.needsUpdate,it=Mt.type;Ge(),Se.autoReset=C,Mt.enabled=W,Mt.autoUpdate=rt,Mt.needsUpdate=ot,Mt.type=it}function bt(C){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",C.statusMessage)}function Ct(C){const W=C.target;W.removeEventListener("dispose",Ct),Jt(W)}function Jt(C){Zt(C),de.remove(C)}function Zt(C){const W=de.get(C).programs;W!==void 0&&(W.forEach(function(rt){Bt.releaseProgram(rt)}),C.isShaderMaterial&&Bt.releaseShaderCache(C))}this.renderBufferDirect=function(C,W,rt,ot,it,Nt){W===null&&(W=kt);const Yt=it.isMesh&&it.matrixWorld.determinant()<0,te=Sn(C,W,rt,ot,it);Ht.setMaterial(ot,Yt);let re=rt.index,ge=1;if(ot.wireframe===!0){if(re=xt.getWireframeAttribute(rt),re===void 0)return;ge=2}const le=rt.drawRange,ce=rt.attributes.position;let Ue=le.start*ge,xn=(le.start+le.count)*ge;Nt!==null&&(Ue=Math.max(Ue,Nt.start*ge),xn=Math.min(xn,(Nt.start+Nt.count)*ge)),re!==null?(Ue=Math.max(Ue,0),xn=Math.min(xn,re.count)):ce!=null&&(Ue=Math.max(Ue,0),xn=Math.min(xn,ce.count));const tn=xn-Ue;if(tn<0||tn===1/0)return;ae.setup(it,ot,te,rt,re);let wn,Ve=ne;if(re!==null&&(wn=yt.get(re),Ve=Gt,Ve.setIndex(wn)),it.isMesh)ot.wireframe===!0?(Ht.setLineWidth(ot.wireframeLinewidth*oe()),Ve.setMode(nt.LINES)):Ve.setMode(nt.TRIANGLES);else if(it.isLine){let me=ot.linewidth;me===void 0&&(me=1),Ht.setLineWidth(me*oe()),it.isLineSegments?Ve.setMode(nt.LINES):it.isLineLoop?Ve.setMode(nt.LINE_LOOP):Ve.setMode(nt.LINE_STRIP)}else it.isPoints?Ve.setMode(nt.POINTS):it.isSprite&&Ve.setMode(nt.TRIANGLES);if(it.isBatchedMesh)Ve.renderMultiDraw(it._multiDrawStarts,it._multiDrawCounts,it._multiDrawCount);else if(it.isInstancedMesh)Ve.renderInstances(Ue,tn,it.count);else if(rt.isInstancedBufferGeometry){const me=rt._maxInstanceCount!==void 0?rt._maxInstanceCount:1/0,xs=Math.min(rt.instanceCount,me);Ve.renderInstances(Ue,tn,xs)}else Ve.render(Ue,tn)};function we(C,W,rt){C.transparent===!0&&C.side===Qi&&C.forceSinglePass===!1?(C.side=kn,C.needsUpdate=!0,An(C,W,rt),C.side=Pa,C.needsUpdate=!0,An(C,W,rt),C.side=Qi):An(C,W,rt)}this.compile=function(C,W,rt=null){rt===null&&(rt=C),S=Xt.get(rt),S.init(),P.push(S),rt.traverseVisible(function(it){it.isLight&&it.layers.test(W.layers)&&(S.pushLight(it),it.castShadow&&S.pushShadow(it))}),C!==rt&&C.traverseVisible(function(it){it.isLight&&it.layers.test(W.layers)&&(S.pushLight(it),it.castShadow&&S.pushShadow(it))}),S.setupLights(L._useLegacyLights);const ot=new Set;return C.traverse(function(it){const Nt=it.material;if(Nt)if(Array.isArray(Nt))for(let Yt=0;Yt<Nt.length;Yt++){const te=Nt[Yt];we(te,rt,it),ot.add(te)}else we(Nt,rt,it),ot.add(Nt)}),P.pop(),S=null,ot},this.compileAsync=function(C,W,rt=null){const ot=this.compile(C,W,rt);return new Promise(it=>{function Nt(){if(ot.forEach(function(Yt){de.get(Yt).currentProgram.isReady()&&ot.delete(Yt)}),ot.size===0){it(C);return}setTimeout(Nt,10)}Wt.get("KHR_parallel_shader_compile")!==null?Nt():setTimeout(Nt,10)})};let ht=null;function Rt(C){ht&&ht(C)}function Ut(){Lt.stop()}function St(){Lt.start()}const Lt=new cv;Lt.setAnimationLoop(Rt),typeof self<"u"&&Lt.setContext(self),this.setAnimationLoop=function(C){ht=C,fe.setAnimationLoop(C),C===null?Lt.stop():Lt.start()},fe.addEventListener("sessionstart",Ut),fe.addEventListener("sessionend",St),this.render=function(C,W){if(W!==void 0&&W.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(O===!0)return;C.matrixWorldAutoUpdate===!0&&C.updateMatrixWorld(),W.parent===null&&W.matrixWorldAutoUpdate===!0&&W.updateMatrixWorld(),fe.enabled===!0&&fe.isPresenting===!0&&(fe.cameraAutoUpdate===!0&&fe.updateCamera(W),W=fe.getCamera()),C.isScene===!0&&C.onBeforeRender(L,C,W,B),S=Xt.get(C,P.length),S.init(),P.push(S),Ot.multiplyMatrices(W.projectionMatrix,W.matrixWorldInverse),I.setFromProjectionMatrix(Ot),_t=this.localClippingEnabled,$=Vt.init(this.clippingPlanes,_t),b=Dt.get(C,_.length),b.init(),_.push(b),$t(C,W,0,L.sortObjects),b.finish(),L.sortObjects===!0&&b.sort(K,ct),this.info.render.frame++,$===!0&&Vt.beginShadows();const rt=S.state.shadowsArray;if(Mt.render(rt,C,W),$===!0&&Vt.endShadows(),this.info.autoReset===!0&&this.info.reset(),Ee.render(b,C),S.setupLights(L._useLegacyLights),W.isArrayCamera){const ot=W.cameras;for(let it=0,Nt=ot.length;it<Nt;it++){const Yt=ot[it];he(b,C,Yt,Yt.viewport)}}else he(b,C,W);B!==null&&(D.updateMultisampleRenderTarget(B),D.updateRenderTargetMipmap(B)),C.isScene===!0&&C.onAfterRender(L,C,W),ae.resetDefaultState(),pt=-1,w=null,P.pop(),P.length>0?S=P[P.length-1]:S=null,_.pop(),_.length>0?b=_[_.length-1]:b=null};function $t(C,W,rt,ot){if(C.visible===!1)return;if(C.layers.test(W.layers)){if(C.isGroup)rt=C.renderOrder;else if(C.isLOD)C.autoUpdate===!0&&C.update(W);else if(C.isLight)S.pushLight(C),C.castShadow&&S.pushShadow(C);else if(C.isSprite){if(!C.frustumCulled||I.intersectsSprite(C)){ot&&Kt.setFromMatrixPosition(C.matrixWorld).applyMatrix4(Ot);const Yt=gt.update(C),te=C.material;te.visible&&b.push(C,Yt,te,rt,Kt.z,null)}}else if((C.isMesh||C.isLine||C.isPoints)&&(!C.frustumCulled||I.intersectsObject(C))){const Yt=gt.update(C),te=C.material;if(ot&&(C.boundingSphere!==void 0?(C.boundingSphere===null&&C.computeBoundingSphere(),Kt.copy(C.boundingSphere.center)):(Yt.boundingSphere===null&&Yt.computeBoundingSphere(),Kt.copy(Yt.boundingSphere.center)),Kt.applyMatrix4(C.matrixWorld).applyMatrix4(Ot)),Array.isArray(te)){const re=Yt.groups;for(let ge=0,le=re.length;ge<le;ge++){const ce=re[ge],Ue=te[ce.materialIndex];Ue&&Ue.visible&&b.push(C,Yt,Ue,rt,Kt.z,ce)}}else te.visible&&b.push(C,Yt,te,rt,Kt.z,null)}}const Nt=C.children;for(let Yt=0,te=Nt.length;Yt<te;Yt++)$t(Nt[Yt],W,rt,ot)}function he(C,W,rt,ot){const it=C.opaque,Nt=C.transmissive,Yt=C.transparent;S.setupLightsView(rt),$===!0&&Vt.setGlobalState(L.clippingPlanes,rt),Nt.length>0&&Ce(it,Nt,W,rt),ot&&Ht.viewport(U.copy(ot)),it.length>0&&vn(it,W,rt),Nt.length>0&&vn(Nt,W,rt),Yt.length>0&&vn(Yt,W,rt),Ht.buffers.depth.setTest(!0),Ht.buffers.depth.setMask(!0),Ht.buffers.color.setMask(!0),Ht.setPolygonOffset(!1)}function Ce(C,W,rt,ot){if((rt.isScene===!0?rt.overrideMaterial:null)!==null)return;const Nt=Qt.isWebGL2;vt===null&&(vt=new dr(1,1,{generateMipmaps:!0,type:Wt.has("EXT_color_buffer_half_float")?Ro:Oa,minFilter:Ao,samples:Nt?4:0})),L.getDrawingBufferSize(Pt),Nt?vt.setSize(Pt.x,Pt.y):vt.setSize(xh(Pt.x),xh(Pt.y));const Yt=L.getRenderTarget();L.setRenderTarget(vt),L.getClearColor(Et),X=L.getClearAlpha(),X<1&&L.setClearColor(16777215,.5),L.clear();const te=L.toneMapping;L.toneMapping=Na,vn(C,rt,ot),D.updateMultisampleRenderTarget(vt),D.updateRenderTargetMipmap(vt);let re=!1;for(let ge=0,le=W.length;ge<le;ge++){const ce=W[ge],Ue=ce.object,xn=ce.geometry,tn=ce.material,wn=ce.group;if(tn.side===Qi&&Ue.layers.test(ot.layers)){const Ve=tn.side;tn.side=kn,tn.needsUpdate=!0,Le(Ue,rt,ot,xn,tn,wn),tn.side=Ve,tn.needsUpdate=!0,re=!0}}re===!0&&(D.updateMultisampleRenderTarget(vt),D.updateRenderTargetMipmap(vt)),L.setRenderTarget(Yt),L.setClearColor(Et,X),L.toneMapping=te}function vn(C,W,rt){const ot=W.isScene===!0?W.overrideMaterial:null;for(let it=0,Nt=C.length;it<Nt;it++){const Yt=C[it],te=Yt.object,re=Yt.geometry,ge=ot===null?Yt.material:ot,le=Yt.group;te.layers.test(rt.layers)&&Le(te,W,rt,re,ge,le)}}function Le(C,W,rt,ot,it,Nt){C.onBeforeRender(L,W,rt,ot,it,Nt),C.modelViewMatrix.multiplyMatrices(rt.matrixWorldInverse,C.matrixWorld),C.normalMatrix.getNormalMatrix(C.modelViewMatrix),it.onBeforeRender(L,W,rt,ot,C,Nt),it.transparent===!0&&it.side===Qi&&it.forceSinglePass===!1?(it.side=kn,it.needsUpdate=!0,L.renderBufferDirect(rt,W,ot,it,C,Nt),it.side=Pa,it.needsUpdate=!0,L.renderBufferDirect(rt,W,ot,it,C,Nt),it.side=Qi):L.renderBufferDirect(rt,W,ot,it,C,Nt),C.onAfterRender(L,W,rt,ot,it,Nt)}function An(C,W,rt){W.isScene!==!0&&(W=kt);const ot=de.get(C),it=S.state.lights,Nt=S.state.shadowsArray,Yt=it.state.version,te=Bt.getParameters(C,it.state,Nt,W,rt),re=Bt.getProgramCacheKey(te);let ge=ot.programs;ot.environment=C.isMeshStandardMaterial?W.environment:null,ot.fog=W.fog,ot.envMap=(C.isMeshStandardMaterial?tt:T).get(C.envMap||ot.environment),ge===void 0&&(C.addEventListener("dispose",Ct),ge=new Map,ot.programs=ge);let le=ge.get(re);if(le!==void 0){if(ot.currentProgram===le&&ot.lightsStateVersion===Yt)return zn(C,te),le}else te.uniforms=Bt.getUniforms(C),C.onBuild(rt,te,L),C.onBeforeCompile(te,L),le=Bt.acquireProgram(te,re),ge.set(re,le),ot.uniforms=te.uniforms;const ce=ot.uniforms;return(!C.isShaderMaterial&&!C.isRawShaderMaterial||C.clipping===!0)&&(ce.clippingPlanes=Vt.uniform),zn(C,te),ot.needsLights=Di(C),ot.lightsStateVersion=Yt,ot.needsLights&&(ce.ambientLightColor.value=it.state.ambient,ce.lightProbe.value=it.state.probe,ce.directionalLights.value=it.state.directional,ce.directionalLightShadows.value=it.state.directionalShadow,ce.spotLights.value=it.state.spot,ce.spotLightShadows.value=it.state.spotShadow,ce.rectAreaLights.value=it.state.rectArea,ce.ltc_1.value=it.state.rectAreaLTC1,ce.ltc_2.value=it.state.rectAreaLTC2,ce.pointLights.value=it.state.point,ce.pointLightShadows.value=it.state.pointShadow,ce.hemisphereLights.value=it.state.hemi,ce.directionalShadowMap.value=it.state.directionalShadowMap,ce.directionalShadowMatrix.value=it.state.directionalShadowMatrix,ce.spotShadowMap.value=it.state.spotShadowMap,ce.spotLightMatrix.value=it.state.spotLightMatrix,ce.spotLightMap.value=it.state.spotLightMap,ce.pointShadowMap.value=it.state.pointShadowMap,ce.pointShadowMatrix.value=it.state.pointShadowMatrix),ot.currentProgram=le,ot.uniformsList=null,le}function Rn(C){if(C.uniformsList===null){const W=C.currentProgram.getUniforms();C.uniformsList=hc.seqWithValue(W.seq,C.uniforms)}return C.uniformsList}function zn(C,W){const rt=de.get(C);rt.outputColorSpace=W.outputColorSpace,rt.batching=W.batching,rt.instancing=W.instancing,rt.instancingColor=W.instancingColor,rt.skinning=W.skinning,rt.morphTargets=W.morphTargets,rt.morphNormals=W.morphNormals,rt.morphColors=W.morphColors,rt.morphTargetsCount=W.morphTargetsCount,rt.numClippingPlanes=W.numClippingPlanes,rt.numIntersection=W.numClipIntersection,rt.vertexAlphas=W.vertexAlphas,rt.vertexTangents=W.vertexTangents,rt.toneMapping=W.toneMapping}function Sn(C,W,rt,ot,it){W.isScene!==!0&&(W=kt),D.resetTextureUnits();const Nt=W.fog,Yt=ot.isMeshStandardMaterial?W.environment:null,te=B===null?L.outputColorSpace:B.isXRRenderTarget===!0?B.texture.colorSpace:$i,re=(ot.isMeshStandardMaterial?tt:T).get(ot.envMap||Yt),ge=ot.vertexColors===!0&&!!rt.attributes.color&&rt.attributes.color.itemSize===4,le=!!rt.attributes.tangent&&(!!ot.normalMap||ot.anisotropy>0),ce=!!rt.morphAttributes.position,Ue=!!rt.morphAttributes.normal,xn=!!rt.morphAttributes.color;let tn=Na;ot.toneMapped&&(B===null||B.isXRRenderTarget===!0)&&(tn=L.toneMapping);const wn=rt.morphAttributes.position||rt.morphAttributes.normal||rt.morphAttributes.color,Ve=wn!==void 0?wn.length:0,me=de.get(ot),xs=S.state.lights;if($===!0&&(_t===!0||C!==w)){const Ye=C===w&&ot.id===pt;Vt.setState(ot,C,Ye)}let qe=!1;ot.version===me.__version?(me.needsLights&&me.lightsStateVersion!==xs.state.version||me.outputColorSpace!==te||it.isBatchedMesh&&me.batching===!1||!it.isBatchedMesh&&me.batching===!0||it.isInstancedMesh&&me.instancing===!1||!it.isInstancedMesh&&me.instancing===!0||it.isSkinnedMesh&&me.skinning===!1||!it.isSkinnedMesh&&me.skinning===!0||it.isInstancedMesh&&me.instancingColor===!0&&it.instanceColor===null||it.isInstancedMesh&&me.instancingColor===!1&&it.instanceColor!==null||me.envMap!==re||ot.fog===!0&&me.fog!==Nt||me.numClippingPlanes!==void 0&&(me.numClippingPlanes!==Vt.numPlanes||me.numIntersection!==Vt.numIntersection)||me.vertexAlphas!==ge||me.vertexTangents!==le||me.morphTargets!==ce||me.morphNormals!==Ue||me.morphColors!==xn||me.toneMapping!==tn||Qt.isWebGL2===!0&&me.morphTargetsCount!==Ve)&&(qe=!0):(qe=!0,me.__version=ot.version);let an=me.currentProgram;qe===!0&&(an=An(ot,W,it));let Ms=!1,Ba=!1,ea=!1;const ln=an.getUniforms(),ei=me.uniforms;if(Ht.useProgram(an.program)&&(Ms=!0,Ba=!0,ea=!0),ot.id!==pt&&(pt=ot.id,Ba=!0),Ms||w!==C){ln.setValue(nt,"projectionMatrix",C.projectionMatrix),ln.setValue(nt,"viewMatrix",C.matrixWorldInverse);const Ye=ln.map.cameraPosition;Ye!==void 0&&Ye.setValue(nt,Kt.setFromMatrixPosition(C.matrixWorld)),Qt.logarithmicDepthBuffer&&ln.setValue(nt,"logDepthBufFC",2/(Math.log(C.far+1)/Math.LN2)),(ot.isMeshPhongMaterial||ot.isMeshToonMaterial||ot.isMeshLambertMaterial||ot.isMeshBasicMaterial||ot.isMeshStandardMaterial||ot.isShaderMaterial)&&ln.setValue(nt,"isOrthographic",C.isOrthographicCamera===!0),w!==C&&(w=C,Ba=!0,ea=!0)}if(it.isSkinnedMesh){ln.setOptional(nt,it,"bindMatrix"),ln.setOptional(nt,it,"bindMatrixInverse");const Ye=it.skeleton;Ye&&(Qt.floatVertexTextures?(Ye.boneTexture===null&&Ye.computeBoneTexture(),ln.setValue(nt,"boneTexture",Ye.boneTexture,D)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}it.isBatchedMesh&&(ln.setOptional(nt,it,"batchingTexture"),ln.setValue(nt,"batchingTexture",it._matricesTexture,D));const ys=rt.morphAttributes;if((ys.position!==void 0||ys.normal!==void 0||ys.color!==void 0&&Qt.isWebGL2===!0)&&ue.update(it,rt,an),(Ba||me.receiveShadow!==it.receiveShadow)&&(me.receiveShadow=it.receiveShadow,ln.setValue(nt,"receiveShadow",it.receiveShadow)),ot.isMeshGouraudMaterial&&ot.envMap!==null&&(ei.envMap.value=re,ei.flipEnvMap.value=re.isCubeTexture&&re.isRenderTargetTexture===!1?-1:1),Ba&&(ln.setValue(nt,"toneMappingExposure",L.toneMappingExposure),me.needsLights&&pi(ei,ea),Nt&&ot.fog===!0&&At.refreshFogUniforms(ei,Nt),At.refreshMaterialUniforms(ei,ot,q,N,vt),hc.upload(nt,Rn(me),ei,D)),ot.isShaderMaterial&&ot.uniformsNeedUpdate===!0&&(hc.upload(nt,Rn(me),ei,D),ot.uniformsNeedUpdate=!1),ot.isSpriteMaterial&&ln.setValue(nt,"center",it.center),ln.setValue(nt,"modelViewMatrix",it.modelViewMatrix),ln.setValue(nt,"normalMatrix",it.normalMatrix),ln.setValue(nt,"modelMatrix",it.matrixWorld),ot.isShaderMaterial||ot.isRawShaderMaterial){const Ye=ot.uniformsGroups;for(let Ia=0,No=Ye.length;Ia<No;Ia++)if(Qt.isWebGL2){const pr=Ye[Ia];Te.update(pr,an),Te.bind(pr,an)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return an}function pi(C,W){C.ambientLightColor.needsUpdate=W,C.lightProbe.needsUpdate=W,C.directionalLights.needsUpdate=W,C.directionalLightShadows.needsUpdate=W,C.pointLights.needsUpdate=W,C.pointLightShadows.needsUpdate=W,C.spotLights.needsUpdate=W,C.spotLightShadows.needsUpdate=W,C.rectAreaLights.needsUpdate=W,C.hemisphereLights.needsUpdate=W}function Di(C){return C.isMeshLambertMaterial||C.isMeshToonMaterial||C.isMeshPhongMaterial||C.isMeshStandardMaterial||C.isShadowMaterial||C.isShaderMaterial&&C.lights===!0}this.getActiveCubeFace=function(){return k},this.getActiveMipmapLevel=function(){return F},this.getRenderTarget=function(){return B},this.setRenderTargetTextures=function(C,W,rt){de.get(C.texture).__webglTexture=W,de.get(C.depthTexture).__webglTexture=rt;const ot=de.get(C);ot.__hasExternalTextures=!0,ot.__hasExternalTextures&&(ot.__autoAllocateDepthBuffer=rt===void 0,ot.__autoAllocateDepthBuffer||Wt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),ot.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(C,W){const rt=de.get(C);rt.__webglFramebuffer=W,rt.__useDefaultFramebuffer=W===void 0},this.setRenderTarget=function(C,W=0,rt=0){B=C,k=W,F=rt;let ot=!0,it=null,Nt=!1,Yt=!1;if(C){const re=de.get(C);re.__useDefaultFramebuffer!==void 0?(Ht.bindFramebuffer(nt.FRAMEBUFFER,null),ot=!1):re.__webglFramebuffer===void 0?D.setupRenderTarget(C):re.__hasExternalTextures&&D.rebindTextures(C,de.get(C.texture).__webglTexture,de.get(C.depthTexture).__webglTexture);const ge=C.texture;(ge.isData3DTexture||ge.isDataArrayTexture||ge.isCompressedArrayTexture)&&(Yt=!0);const le=de.get(C).__webglFramebuffer;C.isWebGLCubeRenderTarget?(Array.isArray(le[W])?it=le[W][rt]:it=le[W],Nt=!0):Qt.isWebGL2&&C.samples>0&&D.useMultisampledRTT(C)===!1?it=de.get(C).__webglMultisampledFramebuffer:Array.isArray(le)?it=le[rt]:it=le,U.copy(C.viewport),lt.copy(C.scissor),ut=C.scissorTest}else U.copy(R).multiplyScalar(q).floor(),lt.copy(V).multiplyScalar(q).floor(),ut=j;if(Ht.bindFramebuffer(nt.FRAMEBUFFER,it)&&Qt.drawBuffers&&ot&&Ht.drawBuffers(C,it),Ht.viewport(U),Ht.scissor(lt),Ht.setScissorTest(ut),Nt){const re=de.get(C.texture);nt.framebufferTexture2D(nt.FRAMEBUFFER,nt.COLOR_ATTACHMENT0,nt.TEXTURE_CUBE_MAP_POSITIVE_X+W,re.__webglTexture,rt)}else if(Yt){const re=de.get(C.texture),ge=W||0;nt.framebufferTextureLayer(nt.FRAMEBUFFER,nt.COLOR_ATTACHMENT0,re.__webglTexture,rt||0,ge)}pt=-1},this.readRenderTargetPixels=function(C,W,rt,ot,it,Nt,Yt){if(!(C&&C.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let te=de.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&Yt!==void 0&&(te=te[Yt]),te){Ht.bindFramebuffer(nt.FRAMEBUFFER,te);try{const re=C.texture,ge=re.format,le=re.type;if(ge!==Ei&&zt.convert(ge)!==nt.getParameter(nt.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const ce=le===Ro&&(Wt.has("EXT_color_buffer_half_float")||Qt.isWebGL2&&Wt.has("EXT_color_buffer_float"));if(le!==Oa&&zt.convert(le)!==nt.getParameter(nt.IMPLEMENTATION_COLOR_READ_TYPE)&&!(le===Da&&(Qt.isWebGL2||Wt.has("OES_texture_float")||Wt.has("WEBGL_color_buffer_float")))&&!ce){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}W>=0&&W<=C.width-ot&&rt>=0&&rt<=C.height-it&&nt.readPixels(W,rt,ot,it,zt.convert(ge),zt.convert(le),Nt)}finally{const re=B!==null?de.get(B).__webglFramebuffer:null;Ht.bindFramebuffer(nt.FRAMEBUFFER,re)}}},this.copyFramebufferToTexture=function(C,W,rt=0){const ot=Math.pow(2,-rt),it=Math.floor(W.image.width*ot),Nt=Math.floor(W.image.height*ot);D.setTexture2D(W,0),nt.copyTexSubImage2D(nt.TEXTURE_2D,rt,0,0,C.x,C.y,it,Nt),Ht.unbindTexture()},this.copyTextureToTexture=function(C,W,rt,ot=0){const it=W.image.width,Nt=W.image.height,Yt=zt.convert(rt.format),te=zt.convert(rt.type);D.setTexture2D(rt,0),nt.pixelStorei(nt.UNPACK_FLIP_Y_WEBGL,rt.flipY),nt.pixelStorei(nt.UNPACK_PREMULTIPLY_ALPHA_WEBGL,rt.premultiplyAlpha),nt.pixelStorei(nt.UNPACK_ALIGNMENT,rt.unpackAlignment),W.isDataTexture?nt.texSubImage2D(nt.TEXTURE_2D,ot,C.x,C.y,it,Nt,Yt,te,W.image.data):W.isCompressedTexture?nt.compressedTexSubImage2D(nt.TEXTURE_2D,ot,C.x,C.y,W.mipmaps[0].width,W.mipmaps[0].height,Yt,W.mipmaps[0].data):nt.texSubImage2D(nt.TEXTURE_2D,ot,C.x,C.y,Yt,te,W.image),ot===0&&rt.generateMipmaps&&nt.generateMipmap(nt.TEXTURE_2D),Ht.unbindTexture()},this.copyTextureToTexture3D=function(C,W,rt,ot,it=0){if(L.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const Nt=C.max.x-C.min.x+1,Yt=C.max.y-C.min.y+1,te=C.max.z-C.min.z+1,re=zt.convert(ot.format),ge=zt.convert(ot.type);let le;if(ot.isData3DTexture)D.setTexture3D(ot,0),le=nt.TEXTURE_3D;else if(ot.isDataArrayTexture||ot.isCompressedArrayTexture)D.setTexture2DArray(ot,0),le=nt.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}nt.pixelStorei(nt.UNPACK_FLIP_Y_WEBGL,ot.flipY),nt.pixelStorei(nt.UNPACK_PREMULTIPLY_ALPHA_WEBGL,ot.premultiplyAlpha),nt.pixelStorei(nt.UNPACK_ALIGNMENT,ot.unpackAlignment);const ce=nt.getParameter(nt.UNPACK_ROW_LENGTH),Ue=nt.getParameter(nt.UNPACK_IMAGE_HEIGHT),xn=nt.getParameter(nt.UNPACK_SKIP_PIXELS),tn=nt.getParameter(nt.UNPACK_SKIP_ROWS),wn=nt.getParameter(nt.UNPACK_SKIP_IMAGES),Ve=rt.isCompressedTexture?rt.mipmaps[it]:rt.image;nt.pixelStorei(nt.UNPACK_ROW_LENGTH,Ve.width),nt.pixelStorei(nt.UNPACK_IMAGE_HEIGHT,Ve.height),nt.pixelStorei(nt.UNPACK_SKIP_PIXELS,C.min.x),nt.pixelStorei(nt.UNPACK_SKIP_ROWS,C.min.y),nt.pixelStorei(nt.UNPACK_SKIP_IMAGES,C.min.z),rt.isDataTexture||rt.isData3DTexture?nt.texSubImage3D(le,it,W.x,W.y,W.z,Nt,Yt,te,re,ge,Ve.data):rt.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),nt.compressedTexSubImage3D(le,it,W.x,W.y,W.z,Nt,Yt,te,re,Ve.data)):nt.texSubImage3D(le,it,W.x,W.y,W.z,Nt,Yt,te,re,ge,Ve),nt.pixelStorei(nt.UNPACK_ROW_LENGTH,ce),nt.pixelStorei(nt.UNPACK_IMAGE_HEIGHT,Ue),nt.pixelStorei(nt.UNPACK_SKIP_PIXELS,xn),nt.pixelStorei(nt.UNPACK_SKIP_ROWS,tn),nt.pixelStorei(nt.UNPACK_SKIP_IMAGES,wn),it===0&&ot.generateMipmaps&&nt.generateMipmap(le),Ht.unbindTexture()},this.initTexture=function(C){C.isCubeTexture?D.setTextureCube(C,0):C.isData3DTexture?D.setTexture3D(C,0):C.isDataArrayTexture||C.isCompressedArrayTexture?D.setTexture2DArray(C,0):D.setTexture2D(C,0),Ht.unbindTexture()},this.resetState=function(){k=0,F=0,B=null,Ht.reset(),ae.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Ji}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const i=this.getContext();i.drawingBufferColorSpace=e===Ah?"display-p3":"srgb",i.unpackColorSpace=Fe.workingColorSpace===xc?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===Tn?fr:Y_}set outputEncoding(e){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=e===fr?Tn:$i}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(e){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=e}}class Bb extends gv{}Bb.prototype.isWebGL1Renderer=!0;class Ib extends Xn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,i){return super.copy(e,i),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const i=super.toJSON(e);return this.fog!==null&&(i.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(i.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(i.object.backgroundIntensity=this.backgroundIntensity),i}}class Fb extends Lo{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new pe(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const U_=new _n,yh=new $_,lc=new Mc,cc=new st;class N_ extends Xn{constructor(e=new ta,i=new Fb){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=i,this.updateMorphTargets()}copy(e,i){return super.copy(e,i),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,i){const r=this.geometry,l=this.matrixWorld,u=e.params.Points.threshold,d=r.drawRange;if(r.boundingSphere===null&&r.computeBoundingSphere(),lc.copy(r.boundingSphere),lc.applyMatrix4(l),lc.radius+=u,e.ray.intersectsSphere(lc)===!1)return;U_.copy(l).invert(),yh.copy(e.ray).applyMatrix4(U_);const h=u/((this.scale.x+this.scale.y+this.scale.z)/3),m=h*h,p=r.index,v=r.attributes.position;if(p!==null){const x=Math.max(0,d.start),y=Math.min(p.count,d.start+d.count);for(let A=x,b=y;A<b;A++){const S=p.getX(A);cc.fromBufferAttribute(v,S),O_(cc,S,m,l,e,i,this)}}else{const x=Math.max(0,d.start),y=Math.min(v.count,d.start+d.count);for(let A=x,b=y;A<b;A++)cc.fromBufferAttribute(v,A),O_(cc,A,m,l,e,i,this)}}updateMorphTargets(){const i=this.geometry.morphAttributes,r=Object.keys(i);if(r.length>0){const l=i[r[0]];if(l!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let u=0,d=l.length;u<d;u++){const h=l[u].name||String(u);this.morphTargetInfluences.push(0),this.morphTargetDictionary[h]=u}}}}}function O_(o,e,i,r,l,u,d){const h=yh.distanceSqToPoint(o);if(h<i){const m=new st;yh.closestPointToPoint(o,m),m.applyMatrix4(r);const p=l.ray.origin.distanceTo(m);if(p<l.near||p>l.far)return;u.push({distance:p,distanceToRay:Math.sqrt(h),point:m,index:e,face:null,object:d})}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Th}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Th);const ch={idle:{color:new pe("#0D47A1"),accent:new pe("#1976D2"),speed:.2,amp:.2,pulse:.03},listening:{color:new pe("#004D40"),accent:new pe("#00897B"),speed:.45,amp:.55,pulse:.08},thinking:{color:new pe("#311B92"),accent:new pe("#5E35B1"),speed:.7,amp:.3,pulse:.04},speaking:{color:new pe("#1B5E20"),accent:new pe("#388E3C"),speed:.55,amp:.7,pulse:.18},reassuring:{color:new pe("#4A148C"),accent:new pe("#6A1B9A"),speed:.3,amp:.25,pulse:.04}},Hb=`
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
`,Gb=`
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
`;function Vb(o){const e=new Float32Array(o*3),i=new Float32Array(o),r=Math.PI*(3-Math.sqrt(5));for(let u=0;u<o;u+=1){const d=1-u/(o-1)*2,h=Math.sqrt(1-d*d),m=r*u;e[u*3]=Math.cos(m)*h,e[u*3+1]=d,e[u*3+2]=Math.sin(m)*h,i[u]=Math.random()}const l=new ta;return l.setAttribute("position",new di(e,3)),l.setAttribute("aSeed",new di(i,1)),l}function P_(o){return new za({uniforms:{uTime:{value:0},uLevel:{value:0},uAmp:{value:.3},uAlpha:{value:o.alpha},uPointScale:{value:o.pointScale},uColor:{value:new pe("#0D47A1")},uAccent:{value:new pe("#1976D2")}},vertexShader:Hb,fragmentShader:Gb,transparent:!0,depthWrite:!1,blending:fh})}function kb(){if(typeof window>"u")return 2048;const o=window.innerWidth<900;return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches??!1?1024:o?2048:4096}function Xb({audioLevel:o,state:e,size:i="lg",className:r}){const l=qt.useRef(null),u=qt.useRef(o),d=qt.useRef(e);return u.current=o,d.current=e,qt.useEffect(()=>{const h=l.current;if(!h)return;const m=kb(),p=new Ib,g=new fi(45,1,.1,100);g.position.set(0,0,5.4);const v=new gv({alpha:!0,antialias:!0,powerPreference:"high-performance"});v.setPixelRatio(Math.min(window.devicePixelRatio,1.5)),v.setClearColor(0,0);const{clientWidth:x,clientHeight:y}=h;v.setSize(x||320,y||320,!1),v.domElement.style.width="100%",v.domElement.style.height="100%",v.domElement.style.display="block",h.appendChild(v.domElement);const A=Vb(m),b=new To;p.add(b);const S=P_({alpha:.62,pointScale:1}),_=new N_(A,S);b.add(_);const P=P_({alpha:.78,pointScale:.6}),L=new N_(A,P);L.scale.setScalar(.72),b.add(L);let O=1,k=ch.idle.pulse;const F=new pe,B=new pe,pt=()=>{if(!h)return;const J=h.clientWidth||320,N=h.clientHeight||320;v.setSize(J,N,!1),g.aspect=J/N,g.updateProjectionMatrix()};pt();const w=typeof ResizeObserver<"u"?new ResizeObserver(pt):null;w?.observe(h),window.addEventListener("resize",pt);let U=0,lt=!1,ut=performance.now();const Et=()=>{if(lt)return;const J=performance.now(),N=Math.min((J-ut)/1e3,.05);ut=J;const q=ch[d.current]??ch.idle,K=u.current;for(const j of[S,P]){const I=j.uniforms,$=K>I.uLevel.value?.45:.7;I.uLevel.value+=(K-I.uLevel.value)*$,I.uAmp.value+=(q.amp-I.uAmp.value)*.08,F.copy(I.uColor.value).lerp(q.color,.08),B.copy(I.uAccent.value).lerp(q.accent,.08),I.uColor.value.copy(F),I.uAccent.value.copy(B),I.uTime.value+=N*q.speed}P.uniforms.uAmp.value=S.uniforms.uAmp.value*1.25;const ct=S.uniforms.uLevel.value;_.rotation.y+=N*.08*(1+ct*2.2),_.rotation.x+=N*.02,L.rotation.y=-_.rotation.y*1.3,L.rotation.z+=N*.15,k+=(q.pulse-k)*.08;const R=1+ct*k,V=R>O?.5:.75;O+=(R-O)*V,b.scale.setScalar(O),v.render(p,g),U=requestAnimationFrame(Et)};U=requestAnimationFrame(Et);const X=()=>{document.hidden?(U&&cancelAnimationFrame(U),U=0):!U&&!lt&&(ut=performance.now(),U=requestAnimationFrame(Et))};return document.addEventListener("visibilitychange",X),()=>{lt=!0,document.removeEventListener("visibilitychange",X),window.removeEventListener("resize",pt),w?.disconnect(),U&&cancelAnimationFrame(U),A.dispose(),S.dispose(),P.dispose(),v.dispose(),v.domElement.parentNode&&v.domElement.parentNode.removeChild(v.domElement)}},[]),Ft.jsx("div",{ref:l,"data-patient-orb-state":e,className:`patient-aura patient-aura--${i}${r?` ${r}`:""}`})}const Xe={introSubtitle:"화면을 시작하면 제가 계속 듣고 도와드릴게요.",welcomeSubtitle:"안녕하세요. 천천히 이야기해 주세요.",preparingGreeting:"잠시만요, AI가 인사를 준비하고 있어요…",preparingHint:"곧 첫 인사를 시작할게요.",responsePending:"응답 생성 중…",listening:"마이크가 켜져 있어요.",thinking:"들은 내용을 정리하고 있어요.",cameraPermission:"카메라 권한을 허용해 주세요.",micPermission:"마이크 권한을 허용해 주세요.",unsupported:"이 브라우저에서는 상시 듣기 기능을 완전히 사용하기 어려워요.",transcriptEmpty:"듣고 있어요.",proactive:"먼저 말을 걸었어요.",uploadError:"듣는 도중 잠시 문제가 있었어요.",voiceDetectedPrefix:"들은 말: ",needUserId:"메인 화면에서 사용자 ID를 먼저 입력해 주세요.",secureNeeded:"이 기기에서는 카메라와 마이크를 쓰려면 HTTPS 주소가 필요해요. 같은 PC라면 http://127.0.0.1:8000/ 로 열어 주세요.",micTooQuiet:"주변 소리는 건너뛰고 있어요. 화면 가까이에서 조금 더 또렷하게 말씀해 주세요.",noSpeech:"음성이 감지되지 않았어요. 마이크 가까이에서 다시 말씀해 주세요."},Wb=.19,qb=2.2,Yb=3e4,jb=4,Zb=9e4,Kb=650,Qb=90,Jb=48;function $b(o){return`${o}-${Math.random().toString(36).slice(2,9)}`}let uc=null;function fc(){if(uc)return uc;try{localStorage.removeItem("patient_screen_session_id")}catch{}return uc=$b("patient"),uc}function Eo(){return localStorage.getItem("demo_user_id")||""}function tA(o){const e=String(o||"").trim().toUpperCase();return e?(localStorage.setItem("demo_user_id",e),e):(localStorage.removeItem("demo_user_id"),"")}function eA(){return["localhost","127.0.0.1"].includes(window.location.hostname)}function nA(o,e){const i=o.includes("?")?"&":"?";return`${o}${i}v=${encodeURIComponent(e)}`}function uh(o,e){return Math.hypot(o.x-e.x,o.y-e.y)}function z_(o,e){const[i,r,l,u,d,h]=e.map(g=>o[g]),m=uh(r,h)+uh(l,d),p=uh(i,u);return p?m/(2*p):1}function iA(o,e){if(!e)return"connecting";switch(o){case"listening":return"listening";case"thinking":return"thinking";case"speaking":return"speaking";case"reassuring":return"thinking";default:return"idle"}}const aA=qt.memo(function({hidden:e,auraState:i,visualState:r,sessionRef:l,visualStateRef:u}){const[d,h]=qt.useState(0);return qt.useEffect(()=>{let m=0,p=0,g=0,v=null,x=null;const y=(b,S)=>{let _=S;(!_||_.length!==b.frequencyBinCount)&&(_=new Uint8Array(b.frequencyBinCount)),b.getByteFrequencyData(_);const P=Math.max(8,Math.floor(_.length*.2));let L=0;for(let O=0;O<P;O+=1)L+=_[O]??0;return[L/P/255,_]},A=b=>{const S=l.current;if(S?.playCtx&&S.playCtx.state==="suspended"&&S.playCtx.resume().catch(()=>{}),!S)g=0,v=null,x=null;else{let _=0,P=0;if(S.micAnalyser){const O=y(S.micAnalyser,v);_=O[0],v=O[1]}if(S.ttsAnalyser){const O=y(S.ttsAnalyser,x);P=O[0],x=O[1]}const L=Math.max(_,P);g=g*.72+L*.28}if(b-p>=Jb){p=b;const _=g<.015?0:Math.min(g*1.6,1);h(P=>P===_?P:_)}m=requestAnimationFrame(A)};return m=requestAnimationFrame(A),()=>{cancelAnimationFrame(m)}},[l,u]),Ft.jsx("div",{className:`jarvis-bg ${e?"jarvis-bg--dim":""}`,"aria-hidden":"true",children:Ft.jsx(Xb,{size:"lg",state:r,audioLevel:d})})});function rA(){const o=window.location.origin,e=new URLSearchParams(window.location.search).get("debug")==="1",[i,r]=qt.useState(Xe.introSubtitle),[l,u]=qt.useState(Xe.transcriptEmpty),[d,h]=qt.useState(!1),[m,p]=qt.useState(!1),[g,v]=qt.useState(!0),[x,y]=qt.useState("사용자 ID를 입력한 뒤 시작해 주세요."),[A,b]=qt.useState(()=>Eo()),[S,_]=qt.useState({visible:!1,text:"준비 중...",pct:0}),[P,L]=qt.useState("idle"),[O,k]=qt.useState(null),[F,B]=qt.useState(!1),[pt,w]=qt.useState(!1),[U,lt]=qt.useState(!1),[ut,Et]=qt.useState(["F3","F5","M4","M5"]),[X,J]=qt.useState("M4"),[N,q]=qt.useState({face:"none",eyes:"unknown",event:"idle"}),[K,ct]=qt.useState(!1),R=qt.useRef(""),V=qt.useRef(null),j=qt.useRef(null),I=qt.useRef(""),$=qt.useRef(null),_t=qt.useRef(null),vt=qt.useRef(null),Ot=qt.useRef(!1),Pt=qt.useRef(null),Kt=qt.useRef({face_detected:0,eyes_closed:0}),kt=qt.useRef(null),oe=qt.useRef(null),nt=qt.useRef(0),Ze=qt.useRef(null),Wt=qt.useRef(null),Qt=qt.useRef(null),Ht=qt.useRef(null),Se=qt.useRef(null),de=qt.useRef(!0),D=qt.useRef("idle"),T=qt.useRef(!1),tt=qt.useRef(!1),yt=qt.useRef(0),xt=qt.useRef(N),gt=ht=>{D.current=ht,L(ht)},Bt=()=>{try{let Rt=j.current?.playCtx??null;if(!Rt){if(!Ht.current){const Ce=window.AudioContext||window.webkitAudioContext;if(!Ce)return;Ht.current=new Ce}Rt=Ht.current}if(!Rt)return;Rt.state==="suspended"&&Rt.resume();const Ut=Rt.currentTime,St=Rt.createOscillator(),Lt=Rt.createGain();St.type="sine",St.frequency.value=523.25,St.connect(Lt),Lt.connect(Rt.destination),Lt.gain.setValueAtTime(1e-4,Ut),Lt.gain.exponentialRampToValueAtTime(.22,Ut+.025),Lt.gain.exponentialRampToValueAtTime(1e-4,Ut+.45),St.start(Ut),St.stop(Ut+.5);const $t=Rt.createOscillator(),he=Rt.createGain();$t.type="sine",$t.frequency.value=783.99,$t.connect(he),he.connect(Rt.destination),he.gain.setValueAtTime(1e-4,Ut+.09),he.gain.exponentialRampToValueAtTime(.18,Ut+.115),he.gain.exponentialRampToValueAtTime(1e-4,Ut+.65),$t.start(Ut+.09),$t.stop(Ut+.7)}catch{}},At=qt.useRef(null);qt.useEffect(()=>{At.current=fetch(`${o}/warmup`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({})}).catch(()=>{})},[o]),qt.useEffect(()=>{if(!pt||U)return;const ht=new Set(["ArrowRight","ArrowLeft","ArrowUp","ArrowDown","PageDown","PageUp"," ","Enter"]),Rt=Ut=>{const St=Ut.target;if(St){const Lt=St.tagName;if(Lt==="INPUT"||Lt==="TEXTAREA"||St.isContentEditable)return}ht.has(Ut.key)&&(Ut.preventDefault(),j.current?.sendEndOfTurn(),w(!1),Bt())};return window.addEventListener("keydown",Rt),()=>window.removeEventListener("keydown",Rt)},[pt,U]),qt.useEffect(()=>{if(!pt||U)return;const ht=Rt=>{const Ut=Rt.target;if(!Ut)return;const St=Ut.tagName;St==="INPUT"||St==="TEXTAREA"||Ut.isContentEditable||Ut.closest(".admin-toggle-btn")||Ut.closest(".admin-drawer")||Ut.closest(".end-turn-btn")||(j.current?.sendEndOfTurn(),w(!1),Bt())};return window.addEventListener("pointerdown",ht),()=>window.removeEventListener("pointerdown",ht)},[pt,U]),qt.useEffect(()=>{if(!K)return;let ht=null,Rt=!1;const Ut=async()=>{try{const Lt=navigator.wakeLock;if(!Lt||Rt)return;ht=await Lt.request("screen")}catch{}},St=()=>{document.visibilityState==="visible"&&!Rt&&Ut()};return Ut(),document.addEventListener("visibilitychange",St),()=>{Rt=!0,document.removeEventListener("visibilitychange",St),ht?.release?.().catch(()=>{})}},[K]);const Dt=ht=>{de.current=ht,v(ht)},Xt=(ht,Rt)=>{_({visible:!0,pct:ht,text:Rt})},Vt=(ht,Rt,Ut)=>{if(!e)return;const St={face:ht,eyes:Rt,event:Ut},Lt=xt.current;Lt.face===St.face&&Lt.eyes===St.eyes&&Lt.event===St.event||(xt.current=St,q(St))},Mt=()=>{kt.current&&(window.clearTimeout(kt.current),kt.current=null),oe.current&&(window.clearTimeout(oe.current),oe.current=null)},Ee=()=>{kt.current&&(window.clearTimeout(kt.current),kt.current=null),Ze.current&&(B(!0),oe.current&&window.clearTimeout(oe.current),oe.current=window.setTimeout(()=>{Ze.current=null,nt.current=0,k(null),B(!1),oe.current=null},Kb))},ue=(ht,Rt)=>{Mt();const Ut=nA(ht,Rt);Ze.current=Ut,nt.current=jb,B(!1),k(Ut),kt.current=window.setTimeout(()=>{kt.current=null,Ee()},Zb)},ne=()=>{Ze.current&&(oe.current||(nt.current=Math.max(0,nt.current-1),nt.current<=0&&Ee()))},Gt=()=>{if(Qt.current){try{Qt.current.stop?.()}catch{}try{Qt.current.disconnect()}catch{}Qt.current=null}if(Wt.current){try{Wt.current.pause()}catch{}Wt.current=null}Se.current&&(URL.revokeObjectURL(Se.current),Se.current=null),j.current?.setMicEnabled?.(!0)},zt=()=>{vt.current!==null&&(cancelAnimationFrame(vt.current),vt.current=null),_t.current&&(_t.current.getTracks().forEach(ht=>ht.stop()),_t.current=null),V.current&&(V.current.srcObject=null),yt.current=0},ae=async()=>{if(!j.current)return;const ht=j.current;j.current=null;try{await ht.stop()}catch{}},Te=()=>window.isSecureContext||eA()?!0:(r(Xe.secureNeeded),u(Xe.secureNeeded),y(Xe.secureNeeded),!1),Ge=async(ht,Rt)=>{const Ut=fc(),St=Eo()||null;let Lt;try{Lt=await fetch(`${o}/tts`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text:ht,session_id:Ut,user_id:St})})}catch{return!1}if(!Lt.ok)return!1;const $t=await Lt.arrayBuffer();if(!$t.byteLength)return!1;const he=j.current,Ce=he?.playCtx;if(Ce&&Ce.state!=="closed")try{Ce.state==="suspended"&&await Ce.resume();const zn=await Ce.decodeAudioData($t.slice(0)),Sn=Ce.createBufferSource();Sn.buffer=zn;const pi=he?.ttsAnalyser;pi?Sn.connect(pi):Sn.connect(Ce.destination),Gt(),Qt.current=Sn,j.current?.setMicEnabled?.(!1),gt("speaking"),w(!1);const Di=()=>{if(Qt.current===Sn){try{Sn.disconnect()}catch{}Qt.current=null}T.current&&(gt("listening"),tt.current=!0,Bt(),window.setTimeout(()=>{T.current&&(u(Xe.listening),w(!0))},240)),j.current?.setMicEnabled?.(!0)};return Sn.onended=Di,Rt?.onAboutToStart?.(),Sn.start(),!0}catch(zn){console.warn("[playTtsReply] BufferSource decode failed, falling back to HTMLAudio:",zn,{ctxState:Ce?.state,byteLength:$t.byteLength})}const vn=new Blob([$t]);if(!vn.size)return!1;Gt();const Le=URL.createObjectURL(vn),An=new Audio(Le);Se.current=Le,Wt.current=An,j.current?.setMicEnabled?.(!1),gt("speaking"),w(!1);const Rn=()=>{Gt(),T.current&&(gt("listening"),tt.current=!0,Bt(),window.setTimeout(()=>{T.current&&(u(Xe.listening),w(!0))},240))};An.onended=Rn,An.onerror=Rn;try{const zn=An.play();Rt?.onAboutToStart?.(),await zn}catch{return Rn(),!1}return!0},fe=async(ht,Rt,Ut=0,St=0)=>{if(!T.current||D.current==="speaking")return;const Lt=Eo();if(!Lt)return;const $t=Date.now(),he=ht==="silence"?12e3:Yb;if($t-(Kt.current[ht]||0)<he)return;j.current?.setMicEnabled?.(!1);let Ce=!0;try{const vn=await fetch(`${o}/proactive-event`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({session_id:fc(),user_id:Lt,event_type:ht,confidence:Rt,eyes_closed_seconds:Ut,silence_seconds:St})}),Le=await vn.json();if(!vn.ok)throw new Error(Le?.detail||"proactive failed");Vt(Ot.current?"detected":"none",Ut>0?`closed ${Ut.toFixed(1)}s`:"normal",`${ht} => ${Le.triggered?"triggered":Le.reason}`),(Le.triggered||ht!=="silence")&&(Kt.current[ht]=$t),Le.triggered&&Le.reply&&(Le.memory_photo?.image_url?ue(Le.memory_photo.image_url,Le.memory_photo.updated_at||Date.now()):Le.reminiscence_photo?.action==="hide"?Ee():Le.reminiscence_photo?.image_url&&ue(Le.reminiscence_photo.image_url,Date.now()),u(Xe.proactive),gt("reassuring"),Ce=!1,ht==="session_start"?Ge(Le.reply,{onAboutToStart:()=>r(Le.reply)}).catch(()=>{gt("reassuring"),j.current?.setMicEnabled?.(!0)}):(r(Le.reply),Ge(Le.reply).catch(()=>{gt("reassuring"),j.current?.setMicEnabled?.(!0)})))}catch(vn){const Le=vn instanceof Error?vn.message:"unknown error";Vt(Ot.current?"detected":"none",Ut>0?`closed ${Ut.toFixed(1)}s`:"normal",`error: ${Le}`),ht==="session_start"&&(r("AI 서버에 연결하지 못했어요. 잠시 후 다시 시도해 주세요."),u(Xe.listening),gt("reassuring"),w(!0))}finally{Ce&&j.current?.setMicEnabled?.(!0)}},Tt=async ht=>{if(!!!(ht.multiFaceLandmarks&&ht.multiFaceLandmarks.length>0)){Ot.current=!1,Pt.current=null,Vt("none","unknown","waiting");return}const Ut=ht.multiFaceLandmarks?.[0];if(!Ut)return;Ot.current=!0;const St=z_(Ut,[33,160,158,133,153,144]),Lt=z_(Ut,[362,385,387,263,373,380]),$t=(St+Lt)/2;$t<Wb?Pt.current||(Pt.current=Date.now()):Pt.current=null;const he=Pt.current?(Date.now()-Pt.current)/1e3:0;he>=qb&&fe("eyes_closed",.9,he,0),Vt("detected",`ear=${$t.toFixed(3)}`,he>0?`closed ${he.toFixed(1)}s`:"normal")},H=async()=>{if($.current)return $.current;if(!window.FaceMesh)throw new Error("MediaPipe load failed");const ht=new window.FaceMesh({locateFile:Rt=>`https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${Rt}`});return ht.setOptions({maxNumFaces:1,refineLandmarks:!0,minDetectionConfidence:.5,minTrackingConfidence:.5}),ht.onResults(Rt=>{Tt(Rt)}),$.current=ht,ht},bt=async()=>{const ht=await H(),Rt=await navigator.mediaDevices.getUserMedia({audio:!1,video:{facingMode:{ideal:"user"},width:{ideal:640},height:{ideal:360}}});if(_t.current=Rt,!V.current)return;V.current.srcObject=Rt,await V.current.play();const Ut=async St=>{if(V.current){if(St-yt.current>=Qb){yt.current=St;try{await ht.send({image:V.current})}catch(Lt){const $t=Lt instanceof Error?Lt.message:"camera error";Vt("error","error",`camera: ${$t}`)}}vt.current=requestAnimationFrame(Ut)}};vt.current=requestAnimationFrame(Ut)},Ct=async()=>{if(j.current&&await ae(),typeof window.VoiceLoopSession!="function")throw new Error("voice-loop.js not loaded");const Rt=`${window.location.protocol==="https:"?"wss":"ws"}://${window.location.host}/ws/patient`;I.current="";const Ut=new window.VoiceLoopSession({url:Rt,sessionId:fc(),userId:Eo(),on:{ready:()=>{tt.current||j.current?.setMicEnabled?.(!1),u(Xe.listening),tt.current&&w(!0),D.current!=="speaking"&&gt("listening")},state:St=>{if(St==="LISTENING"){if(D.current==="speaking")return;if(!tt.current){j.current?.setMicEnabled?.(!1);return}u(Xe.listening),w(!0),j.current?.setMicEnabled?.(!0),gt("listening")}else St==="RESPONDING"&&(j.current?.setMicEnabled?.(!1),w(!1),gt("speaking"))},interim:St=>{St&&D.current!=="speaking"&&(u(`${Xe.voiceDetectedPrefix}${St}`),tt.current&&w(!0),D.current!=="listening"&&gt("listening"))},stt:St=>{I.current="",r(""),u(`${Xe.voiceDetectedPrefix}${St}`),p(!0)},token:St=>{I.current+=St},audio_play_start:St=>{p(!1),St?.text&&r(Lt=>{const $t=St.text.trim();return $t?!Lt||!Lt.trim()?$t:`${Lt} ${$t}`:Lt})},cancel:()=>{I.current="",r(""),p(!1),Gt(),T.current&&D.current!=="listening"&&gt("listening")},done:St=>{const Lt=St.reply||I.current;R.current=Lt,I.current="",St.memory_photo?.image_url?ue(St.memory_photo.image_url,St.memory_photo.updated_at||Date.now()):St.reminiscence_photo?.action==="hide"?Ee():St.reminiscence_photo?.image_url?ue(St.reminiscence_photo.image_url,Date.now()):ne(),St.used_retrieval==="identity_resolved"&&(localStorage.removeItem("demo_user_id"),b(""))},ttsEnded:()=>{T.current&&(R.current&&(r(St=>St&&St.trim()?St:R.current),R.current=""),p(!1),D.current==="speaking"&&(j.current?.setMicEnabled?.(!0),gt("listening"),Bt(),window.setTimeout(()=>{T.current&&(u(Xe.listening),w(!0))},240)))},notice:St=>{if(!T.current)return;const Lt=St?.message||Xe.noSpeech;r(Lt),u(Xe.listening),p(!1),j.current?.setMicEnabled?.(!0),gt("listening"),w(!0)},error:St=>{const Lt=St||Xe.uploadError;u(Lt),r(`연결 오류: ${Lt}`),p(!1),gt("reassuring")}}});j.current=Ut,await Ut.start()},Jt=async()=>{try{const he=new Audio("data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA=");he.muted=!0,he.volume=0,he.play().then(()=>{try{he.pause()}catch{}}).catch(()=>{})}catch{}const ht=tA(A||Eo());if(!ht){r(Xe.needUserId),u(Xe.needUserId),y(Xe.needUserId);return}b(ht),y("사용자 ID 확인 중...");try{const he=await fetch(`${o}/patient/exists/${encodeURIComponent(ht)}`);if(he.ok&&!(await he.json()).exists){y(`'${ht}' 는 등록되지 않은 사용자 ID 입니다. 보호자에게 확인해 주세요.`);return}}catch{}if(!Te())return;if(At.current){y("AI 준비 중... 잠시만 기다려 주세요.");try{await At.current}catch{}}Xt(15,"카메라·마이크 연결 중...");const Rt=typeof window<"u"&&(window.navigator.standalone===!0||window.matchMedia&&window.matchMedia("(display-mode: standalone)").matches),Ut=performance.now(),St=performance.now(),Lt=he=>{const Ce=he instanceof Error?he.message:Xe.cameraPermission;return r(Ce),u(Ce),y(Ce),-1};let $t=0;try{if(Rt)$t=await bt().then(()=>Math.round(performance.now()-St)).catch(Lt),await Ct();else{const An=bt().then(()=>Math.round(performance.now()-St)).catch(Lt),[Rn]=await Promise.all([An,Ct()]);$t=Rn}const he=Math.round(performance.now()-Ut),Ce=window.__voiceLoopTimings||{},vn=Object.entries(Ce).map(([An,Rn])=>`${An}=${Rn}`).join(" "),Le=`[측정 ${Rt?"PWA":"Safari"}] total=${he}ms cam=${$t}ms (${vn})`;console.log(Le),e&&(y(Le),u(Le),r(Le))}catch(he){const Ce=he instanceof Error?he.message:Xe.micPermission;_({visible:!1,pct:0,text:"준비 중..."}),r(Ce),u(Ce),y(Ce);return}Xt(100,"준비 완료!"),T.current=!0,tt.current=!1,ct(!0),Dt(!1),_({visible:!1,pct:0,text:"준비 중..."}),O||r(Xe.preparingGreeting),u(Xe.preparingHint),h(!0),gt("thinking"),fe("session_start",1,0,0)};qt.useEffect(()=>{if(!d)return;if(i&&i!==Xe.preparingGreeting){h(!1);return}const ht=window.setTimeout(()=>h(!1),3e4);return()=>window.clearTimeout(ht)},[d,i]),qt.useEffect(()=>(Vt("none","unknown","idle"),()=>{Mt()}),[]),qt.useEffect(()=>{(async()=>{try{const ht=await fetch(`${o}/tts/voices`);if(!ht.ok)return;const Rt=await ht.json(),Ut=["F3","F5","M4","M5"];if(Array.isArray(Rt.voices)&&Rt.voices.length>0){const St=Rt.voices.filter(Lt=>Ut.includes(Lt));St.length>0&&Et(St)}typeof Rt.current=="string"&&Rt.current&&Ut.includes(Rt.current)&&J(Rt.current)}catch{}})()},[o]),qt.useEffect(()=>{const ht=()=>{Gt(),ae(),zt(),Ee()};return window.addEventListener("beforeunload",ht),()=>{window.removeEventListener("beforeunload",ht),ht()}},[]);const Zt=qt.useMemo(()=>{const ht=ut.filter(Ut=>Ut.startsWith("F")),Rt=ut.filter(Ut=>Ut.startsWith("M"));return{female:ht,male:Rt}},[ut]),we=iA(P,K);return Ft.jsxs("main",{className:"patient-root",children:[Ft.jsx("video",{ref:V,className:"camera-feed",autoPlay:!0,muted:!0,playsInline:!0}),Ft.jsx(aA,{hidden:g,auraState:we,visualState:P,sessionRef:j,visualStateRef:D}),O?Ft.jsx("section",{className:`memory-stage ${F?"memory-stage--fading":""}`,"aria-label":"memory photo",children:Ft.jsx("div",{className:"memory-frame",children:Ft.jsx("img",{src:O,alt:"회상 사진",className:"memory-image",onError:()=>Ee()})})},O):null,Ft.jsxs("section",{className:"subtitle-wrap",children:[d?Ft.jsxs("div",{className:"greeting-pending",role:"status","aria-live":"polite",children:[Ft.jsx("span",{className:"greeting-spinner","aria-hidden":"true"}),Ft.jsx("span",{className:"greeting-pending-text",children:i||Xe.preparingGreeting})]}):m&&!i?Ft.jsxs("div",{className:"greeting-pending",role:"status","aria-live":"polite",children:[Ft.jsx("span",{className:"greeting-spinner","aria-hidden":"true"}),Ft.jsx("span",{className:"greeting-pending-text",children:Xe.responsePending})]}):Ft.jsx("p",{id:"subtitleText",className:"subtitle",children:i}),Ft.jsx("p",{id:"listeningText",className:"listening-text",children:l}),Ft.jsx("button",{type:"button",className:`end-turn-btn ${pt?"":"hidden"}`,onClick:()=>{j.current?.sendEndOfTurn(),w(!1),Bt()},children:"말하기 완료"})]}),Ft.jsx("button",{type:"button",className:"admin-toggle-btn","aria-controls":"adminDrawer","aria-expanded":U,onClick:()=>lt(!0),children:"관리 패널"}),Ft.jsxs("section",{id:"adminDrawer",className:`admin-drawer ${U?"":"hidden"}`,"aria-hidden":!U,children:[Ft.jsx("div",{className:"admin-drawer-backdrop",onClick:()=>lt(!1)}),Ft.jsxs("div",{className:"admin-drawer-panel",children:[Ft.jsxs("div",{className:"admin-drawer-head",children:[Ft.jsxs("div",{children:[Ft.jsx("p",{className:"admin-kicker",children:"Patient Admin"}),Ft.jsx("h2",{className:"admin-title",children:"개발자 화면 기능"}),Ft.jsx("p",{className:"admin-copy",children:"이 패널 안에서 개발자용 화면의 기능을 그대로 사용할 수 있습니다."})]}),Ft.jsxs("div",{className:"admin-head-actions",children:[Ft.jsx("button",{type:"button",className:"admin-head-btn",onClick:()=>{const ht=document.getElementById("adminFrame");ht&&(ht.src="/admin")},children:"새로고침"}),Ft.jsx("button",{type:"button",className:"admin-head-btn primary",onClick:()=>lt(!1),children:"닫기"})]})]}),Ft.jsx("iframe",{id:"adminFrame",className:"admin-frame",title:"developer tools",src:U?"/admin":void 0,loading:"lazy"})]})]}),g?Ft.jsx("section",{className:"start-overlay",children:Ft.jsxs("div",{className:"start-panel",children:[Ft.jsx("p",{className:"start-kicker",children:"Patient Mode"}),Ft.jsx("h1",{className:"start-title",children:"Remini"}),Ft.jsxs("p",{className:"start-copy",children:["시작을 누르면 카메라와 마이크 권한을 요청하고,",Ft.jsx("br",{}),"이후에는 자막과 시청각 화면만 남습니다."]}),Ft.jsxs("label",{className:"start-field",htmlFor:"patientUserId",children:[Ft.jsx("span",{className:"start-field-label",children:"사용자 ID"}),Ft.jsx("input",{id:"patientUserId",className:"start-input",type:"text",placeholder:"예: P001",value:A,onChange:ht=>{b(ht.target.value),y("사용자 ID를 입력한 뒤 시작해 주세요.")},onKeyDown:ht=>{ht.key==="Enter"&&(ht.preventDefault(),Jt())}})]}),S.visible?null:Ft.jsx("p",{className:"start-hint",children:x}),S.visible?null:Ft.jsx("button",{type:"button",className:"start-btn",onClick:()=>{Jt()},children:"시작하기"}),S.visible?Ft.jsxs("div",{className:"loading-wrap",children:[Ft.jsx("div",{className:"loading-spinner"}),Ft.jsx("p",{className:"loading-text",children:S.text}),Ft.jsx("div",{className:"loading-bar-track",children:Ft.jsx("div",{className:"loading-bar-fill",style:{width:`${S.pct}%`}})}),Ft.jsxs("p",{className:"loading-percent",children:[S.pct,"%"]})]}):null]})}):null,Ft.jsxs("section",{className:"voice-picker",children:[Ft.jsx("label",{htmlFor:"voicePicker",children:"목소리"}),Ft.jsxs("select",{id:"voicePicker",value:X,onChange:async ht=>{const Rt=ht.target.value;J(Rt);try{await fetch(`${o}/tts/voices/${encodeURIComponent(Rt)}`,{method:"POST"})}catch{}},children:[Ft.jsx("optgroup",{label:"여성",children:Zt.female.map(ht=>Ft.jsx("option",{value:ht,children:ht},ht))}),Ft.jsx("optgroup",{label:"남성",children:Zt.male.map(ht=>Ft.jsx("option",{value:ht,children:ht},ht))})]})]}),e?Ft.jsxs("section",{className:"debug-panel",children:[Ft.jsx("p",{className:"debug-title",children:"DEBUG"}),Ft.jsxs("p",{className:"debug-line",children:["session: ",fc()]}),Ft.jsxs("p",{className:"debug-line",children:["face: ",N.face]}),Ft.jsxs("p",{className:"debug-line",children:["eyes: ",N.eyes]}),Ft.jsxs("p",{className:"debug-line",children:["event: ",N.event]})]}):null]})}CS.createRoot(document.getElementById("root")).render(Ft.jsx(rA,{}));
