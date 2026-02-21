(function(){const u=document.createElement("link").relList;if(u&&u.supports&&u.supports("modulepreload"))return;for(const x of document.querySelectorAll('link[rel="modulepreload"]'))d(x);new MutationObserver(x=>{for(const b of x)if(b.type==="childList")for(const m of b.addedNodes)m.tagName==="LINK"&&m.rel==="modulepreload"&&d(m)}).observe(document,{childList:!0,subtree:!0});function o(x){const b={};return x.integrity&&(b.integrity=x.integrity),x.referrerPolicy&&(b.referrerPolicy=x.referrerPolicy),x.crossOrigin==="use-credentials"?b.credentials="include":x.crossOrigin==="anonymous"?b.credentials="omit":b.credentials="same-origin",b}function d(x){if(x.ep)return;x.ep=!0;const b=o(x);fetch(x.href,b)}})();var Ao={exports:{}},_r={};var Xh;function tp(){if(Xh)return _r;Xh=1;var i=Symbol.for("react.transitional.element"),u=Symbol.for("react.fragment");function o(d,x,b){var m=null;if(b!==void 0&&(m=""+b),x.key!==void 0&&(m=""+x.key),"key"in x){b={};for(var N in x)N!=="key"&&(b[N]=x[N])}else b=x;return x=b.ref,{$$typeof:i,type:d,key:m,ref:x!==void 0?x:null,props:b}}return _r.Fragment=u,_r.jsx=o,_r.jsxs=o,_r}var Gh;function ap(){return Gh||(Gh=1,Ao.exports=tp()),Ao.exports}var t=ap(),Ro={exports:{}},he={};var Zh;function sp(){if(Zh)return he;Zh=1;var i=Symbol.for("react.transitional.element"),u=Symbol.for("react.portal"),o=Symbol.for("react.fragment"),d=Symbol.for("react.strict_mode"),x=Symbol.for("react.profiler"),b=Symbol.for("react.consumer"),m=Symbol.for("react.context"),N=Symbol.for("react.forward_ref"),f=Symbol.for("react.suspense"),g=Symbol.for("react.memo"),j=Symbol.for("react.lazy"),p=Symbol.for("react.activity"),E=Symbol.iterator;function L(S){return S===null||typeof S!="object"?null:(S=E&&S[E]||S["@@iterator"],typeof S=="function"?S:null)}var M={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},w=Object.assign,k={};function A(S,X,J){this.props=S,this.context=X,this.refs=k,this.updater=J||M}A.prototype.isReactComponent={},A.prototype.setState=function(S,X){if(typeof S!="object"&&typeof S!="function"&&S!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,S,X,"setState")},A.prototype.forceUpdate=function(S){this.updater.enqueueForceUpdate(this,S,"forceUpdate")};function O(){}O.prototype=A.prototype;function $(S,X,J){this.props=S,this.context=X,this.refs=k,this.updater=J||M}var Y=$.prototype=new O;Y.constructor=$,w(Y,A.prototype),Y.isPureReactComponent=!0;var Z=Array.isArray;function ee(){}var F={H:null,A:null,T:null,S:null},z=Object.prototype.hasOwnProperty;function Q(S,X,J){var I=J.ref;return{$$typeof:i,type:S,key:X,ref:I!==void 0?I:null,props:J}}function ie(S,X){return Q(S.type,X,S.props)}function ye(S){return typeof S=="object"&&S!==null&&S.$$typeof===i}function Ge(S){var X={"=":"=0",":":"=2"};return"$"+S.replace(/[=:]/g,function(J){return X[J]})}var ut=/\/+/g;function Nt(S,X){return typeof S=="object"&&S!==null&&S.key!=null?Ge(""+S.key):X.toString(36)}function pt(S){switch(S.status){case"fulfilled":return S.value;case"rejected":throw S.reason;default:switch(typeof S.status=="string"?S.then(ee,ee):(S.status="pending",S.then(function(X){S.status==="pending"&&(S.status="fulfilled",S.value=X)},function(X){S.status==="pending"&&(S.status="rejected",S.reason=X)})),S.status){case"fulfilled":return S.value;case"rejected":throw S.reason}}throw S}function H(S,X,J,I,ue){var xe=typeof S;(xe==="undefined"||xe==="boolean")&&(S=null);var Ee=!1;if(S===null)Ee=!0;else switch(xe){case"bigint":case"string":case"number":Ee=!0;break;case"object":switch(S.$$typeof){case i:case u:Ee=!0;break;case j:return Ee=S._init,H(Ee(S._payload),X,J,I,ue)}}if(Ee)return ue=ue(S),Ee=I===""?"."+Nt(S,0):I,Z(ue)?(J="",Ee!=null&&(J=Ee.replace(ut,"$&/")+"/"),H(ue,X,J,"",function(ga){return ga})):ue!=null&&(ye(ue)&&(ue=ie(ue,J+(ue.key==null||S&&S.key===ue.key?"":(""+ue.key).replace(ut,"$&/")+"/")+Ee)),X.push(ue)),1;Ee=0;var ot=I===""?".":I+":";if(Z(S))for(var Ve=0;Ve<S.length;Ve++)I=S[Ve],xe=ot+Nt(I,Ve),Ee+=H(I,X,J,xe,ue);else if(Ve=L(S),typeof Ve=="function")for(S=Ve.call(S),Ve=0;!(I=S.next()).done;)I=I.value,xe=ot+Nt(I,Ve++),Ee+=H(I,X,J,xe,ue);else if(xe==="object"){if(typeof S.then=="function")return H(pt(S),X,J,I,ue);throw X=String(S),Error("Objects are not valid as a React child (found: "+(X==="[object Object]"?"object with keys {"+Object.keys(S).join(", ")+"}":X)+"). If you meant to render a collection of children, use an array instead.")}return Ee}function K(S,X,J){if(S==null)return S;var I=[],ue=0;return H(S,I,"","",function(xe){return X.call(J,xe,ue++)}),I}function ne(S){if(S._status===-1){var X=S._result;X=X(),X.then(function(J){(S._status===0||S._status===-1)&&(S._status=1,S._result=J)},function(J){(S._status===0||S._status===-1)&&(S._status=2,S._result=J)}),S._status===-1&&(S._status=0,S._result=X)}if(S._status===1)return S._result.default;throw S._result}var Se=typeof reportError=="function"?reportError:function(S){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var X=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof S=="object"&&S!==null&&typeof S.message=="string"?String(S.message):String(S),error:S});if(!window.dispatchEvent(X))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",S);return}console.error(S)},ke={map:K,forEach:function(S,X,J){K(S,function(){X.apply(this,arguments)},J)},count:function(S){var X=0;return K(S,function(){X++}),X},toArray:function(S){return K(S,function(X){return X})||[]},only:function(S){if(!ye(S))throw Error("React.Children.only expected to receive a single React element child.");return S}};return he.Activity=p,he.Children=ke,he.Component=A,he.Fragment=o,he.Profiler=x,he.PureComponent=$,he.StrictMode=d,he.Suspense=f,he.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=F,he.__COMPILER_RUNTIME={__proto__:null,c:function(S){return F.H.useMemoCache(S)}},he.cache=function(S){return function(){return S.apply(null,arguments)}},he.cacheSignal=function(){return null},he.cloneElement=function(S,X,J){if(S==null)throw Error("The argument must be a React element, but you passed "+S+".");var I=w({},S.props),ue=S.key;if(X!=null)for(xe in X.key!==void 0&&(ue=""+X.key),X)!z.call(X,xe)||xe==="key"||xe==="__self"||xe==="__source"||xe==="ref"&&X.ref===void 0||(I[xe]=X[xe]);var xe=arguments.length-2;if(xe===1)I.children=J;else if(1<xe){for(var Ee=Array(xe),ot=0;ot<xe;ot++)Ee[ot]=arguments[ot+2];I.children=Ee}return Q(S.type,ue,I)},he.createContext=function(S){return S={$$typeof:m,_currentValue:S,_currentValue2:S,_threadCount:0,Provider:null,Consumer:null},S.Provider=S,S.Consumer={$$typeof:b,_context:S},S},he.createElement=function(S,X,J){var I,ue={},xe=null;if(X!=null)for(I in X.key!==void 0&&(xe=""+X.key),X)z.call(X,I)&&I!=="key"&&I!=="__self"&&I!=="__source"&&(ue[I]=X[I]);var Ee=arguments.length-2;if(Ee===1)ue.children=J;else if(1<Ee){for(var ot=Array(Ee),Ve=0;Ve<Ee;Ve++)ot[Ve]=arguments[Ve+2];ue.children=ot}if(S&&S.defaultProps)for(I in Ee=S.defaultProps,Ee)ue[I]===void 0&&(ue[I]=Ee[I]);return Q(S,xe,ue)},he.createRef=function(){return{current:null}},he.forwardRef=function(S){return{$$typeof:N,render:S}},he.isValidElement=ye,he.lazy=function(S){return{$$typeof:j,_payload:{_status:-1,_result:S},_init:ne}},he.memo=function(S,X){return{$$typeof:g,type:S,compare:X===void 0?null:X}},he.startTransition=function(S){var X=F.T,J={};F.T=J;try{var I=S(),ue=F.S;ue!==null&&ue(J,I),typeof I=="object"&&I!==null&&typeof I.then=="function"&&I.then(ee,Se)}catch(xe){Se(xe)}finally{X!==null&&J.types!==null&&(X.types=J.types),F.T=X}},he.unstable_useCacheRefresh=function(){return F.H.useCacheRefresh()},he.use=function(S){return F.H.use(S)},he.useActionState=function(S,X,J){return F.H.useActionState(S,X,J)},he.useCallback=function(S,X){return F.H.useCallback(S,X)},he.useContext=function(S){return F.H.useContext(S)},he.useDebugValue=function(){},he.useDeferredValue=function(S,X){return F.H.useDeferredValue(S,X)},he.useEffect=function(S,X){return F.H.useEffect(S,X)},he.useEffectEvent=function(S){return F.H.useEffectEvent(S)},he.useId=function(){return F.H.useId()},he.useImperativeHandle=function(S,X,J){return F.H.useImperativeHandle(S,X,J)},he.useInsertionEffect=function(S,X){return F.H.useInsertionEffect(S,X)},he.useLayoutEffect=function(S,X){return F.H.useLayoutEffect(S,X)},he.useMemo=function(S,X){return F.H.useMemo(S,X)},he.useOptimistic=function(S,X){return F.H.useOptimistic(S,X)},he.useReducer=function(S,X,J){return F.H.useReducer(S,X,J)},he.useRef=function(S){return F.H.useRef(S)},he.useState=function(S){return F.H.useState(S)},he.useSyncExternalStore=function(S,X,J){return F.H.useSyncExternalStore(S,X,J)},he.useTransition=function(){return F.H.useTransition()},he.version="19.2.4",he}var Qh;function Zo(){return Qh||(Qh=1,Ro.exports=sp()),Ro.exports}var v=Zo(),qo={exports:{}},Ar={},Oo={exports:{}},Lo={};var Kh;function lp(){return Kh||(Kh=1,(function(i){function u(H,K){var ne=H.length;H.push(K);e:for(;0<ne;){var Se=ne-1>>>1,ke=H[Se];if(0<x(ke,K))H[Se]=K,H[ne]=ke,ne=Se;else break e}}function o(H){return H.length===0?null:H[0]}function d(H){if(H.length===0)return null;var K=H[0],ne=H.pop();if(ne!==K){H[0]=ne;e:for(var Se=0,ke=H.length,S=ke>>>1;Se<S;){var X=2*(Se+1)-1,J=H[X],I=X+1,ue=H[I];if(0>x(J,ne))I<ke&&0>x(ue,J)?(H[Se]=ue,H[I]=ne,Se=I):(H[Se]=J,H[X]=ne,Se=X);else if(I<ke&&0>x(ue,ne))H[Se]=ue,H[I]=ne,Se=I;else break e}}return K}function x(H,K){var ne=H.sortIndex-K.sortIndex;return ne!==0?ne:H.id-K.id}if(i.unstable_now=void 0,typeof performance=="object"&&typeof performance.now=="function"){var b=performance;i.unstable_now=function(){return b.now()}}else{var m=Date,N=m.now();i.unstable_now=function(){return m.now()-N}}var f=[],g=[],j=1,p=null,E=3,L=!1,M=!1,w=!1,k=!1,A=typeof setTimeout=="function"?setTimeout:null,O=typeof clearTimeout=="function"?clearTimeout:null,$=typeof setImmediate<"u"?setImmediate:null;function Y(H){for(var K=o(g);K!==null;){if(K.callback===null)d(g);else if(K.startTime<=H)d(g),K.sortIndex=K.expirationTime,u(f,K);else break;K=o(g)}}function Z(H){if(w=!1,Y(H),!M)if(o(f)!==null)M=!0,ee||(ee=!0,Ge());else{var K=o(g);K!==null&&pt(Z,K.startTime-H)}}var ee=!1,F=-1,z=5,Q=-1;function ie(){return k?!0:!(i.unstable_now()-Q<z)}function ye(){if(k=!1,ee){var H=i.unstable_now();Q=H;var K=!0;try{e:{M=!1,w&&(w=!1,O(F),F=-1),L=!0;var ne=E;try{t:{for(Y(H),p=o(f);p!==null&&!(p.expirationTime>H&&ie());){var Se=p.callback;if(typeof Se=="function"){p.callback=null,E=p.priorityLevel;var ke=Se(p.expirationTime<=H);if(H=i.unstable_now(),typeof ke=="function"){p.callback=ke,Y(H),K=!0;break t}p===o(f)&&d(f),Y(H)}else d(f);p=o(f)}if(p!==null)K=!0;else{var S=o(g);S!==null&&pt(Z,S.startTime-H),K=!1}}break e}finally{p=null,E=ne,L=!1}K=void 0}}finally{K?Ge():ee=!1}}}var Ge;if(typeof $=="function")Ge=function(){$(ye)};else if(typeof MessageChannel<"u"){var ut=new MessageChannel,Nt=ut.port2;ut.port1.onmessage=ye,Ge=function(){Nt.postMessage(null)}}else Ge=function(){A(ye,0)};function pt(H,K){F=A(function(){H(i.unstable_now())},K)}i.unstable_IdlePriority=5,i.unstable_ImmediatePriority=1,i.unstable_LowPriority=4,i.unstable_NormalPriority=3,i.unstable_Profiling=null,i.unstable_UserBlockingPriority=2,i.unstable_cancelCallback=function(H){H.callback=null},i.unstable_forceFrameRate=function(H){0>H||125<H?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):z=0<H?Math.floor(1e3/H):5},i.unstable_getCurrentPriorityLevel=function(){return E},i.unstable_next=function(H){switch(E){case 1:case 2:case 3:var K=3;break;default:K=E}var ne=E;E=K;try{return H()}finally{E=ne}},i.unstable_requestPaint=function(){k=!0},i.unstable_runWithPriority=function(H,K){switch(H){case 1:case 2:case 3:case 4:case 5:break;default:H=3}var ne=E;E=H;try{return K()}finally{E=ne}},i.unstable_scheduleCallback=function(H,K,ne){var Se=i.unstable_now();switch(typeof ne=="object"&&ne!==null?(ne=ne.delay,ne=typeof ne=="number"&&0<ne?Se+ne:Se):ne=Se,H){case 1:var ke=-1;break;case 2:ke=250;break;case 5:ke=1073741823;break;case 4:ke=1e4;break;default:ke=5e3}return ke=ne+ke,H={id:j++,callback:K,priorityLevel:H,startTime:ne,expirationTime:ke,sortIndex:-1},ne>Se?(H.sortIndex=ne,u(g,H),o(f)===null&&H===o(g)&&(w?(O(F),F=-1):w=!0,pt(Z,ne-Se))):(H.sortIndex=ke,u(f,H),M||L||(M=!0,ee||(ee=!0,Ge()))),H},i.unstable_shouldYield=ie,i.unstable_wrapCallback=function(H){var K=E;return function(){var ne=E;E=K;try{return H.apply(this,arguments)}finally{E=ne}}}})(Lo)),Lo}var Jh;function rp(){return Jh||(Jh=1,Oo.exports=lp()),Oo.exports}var Uo={exports:{}},wt={};var Ph;function np(){if(Ph)return wt;Ph=1;var i=Zo();function u(f){var g="https://react.dev/errors/"+f;if(1<arguments.length){g+="?args[]="+encodeURIComponent(arguments[1]);for(var j=2;j<arguments.length;j++)g+="&args[]="+encodeURIComponent(arguments[j])}return"Minified React error #"+f+"; visit "+g+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function o(){}var d={d:{f:o,r:function(){throw Error(u(522))},D:o,C:o,L:o,m:o,X:o,S:o,M:o},p:0,findDOMNode:null},x=Symbol.for("react.portal");function b(f,g,j){var p=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:x,key:p==null?null:""+p,children:f,containerInfo:g,implementation:j}}var m=i.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function N(f,g){if(f==="font")return"";if(typeof g=="string")return g==="use-credentials"?g:""}return wt.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=d,wt.createPortal=function(f,g){var j=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!g||g.nodeType!==1&&g.nodeType!==9&&g.nodeType!==11)throw Error(u(299));return b(f,g,null,j)},wt.flushSync=function(f){var g=m.T,j=d.p;try{if(m.T=null,d.p=2,f)return f()}finally{m.T=g,d.p=j,d.d.f()}},wt.preconnect=function(f,g){typeof f=="string"&&(g?(g=g.crossOrigin,g=typeof g=="string"?g==="use-credentials"?g:"":void 0):g=null,d.d.C(f,g))},wt.prefetchDNS=function(f){typeof f=="string"&&d.d.D(f)},wt.preinit=function(f,g){if(typeof f=="string"&&g&&typeof g.as=="string"){var j=g.as,p=N(j,g.crossOrigin),E=typeof g.integrity=="string"?g.integrity:void 0,L=typeof g.fetchPriority=="string"?g.fetchPriority:void 0;j==="style"?d.d.S(f,typeof g.precedence=="string"?g.precedence:void 0,{crossOrigin:p,integrity:E,fetchPriority:L}):j==="script"&&d.d.X(f,{crossOrigin:p,integrity:E,fetchPriority:L,nonce:typeof g.nonce=="string"?g.nonce:void 0})}},wt.preinitModule=function(f,g){if(typeof f=="string")if(typeof g=="object"&&g!==null){if(g.as==null||g.as==="script"){var j=N(g.as,g.crossOrigin);d.d.M(f,{crossOrigin:j,integrity:typeof g.integrity=="string"?g.integrity:void 0,nonce:typeof g.nonce=="string"?g.nonce:void 0})}}else g==null&&d.d.M(f)},wt.preload=function(f,g){if(typeof f=="string"&&typeof g=="object"&&g!==null&&typeof g.as=="string"){var j=g.as,p=N(j,g.crossOrigin);d.d.L(f,j,{crossOrigin:p,integrity:typeof g.integrity=="string"?g.integrity:void 0,nonce:typeof g.nonce=="string"?g.nonce:void 0,type:typeof g.type=="string"?g.type:void 0,fetchPriority:typeof g.fetchPriority=="string"?g.fetchPriority:void 0,referrerPolicy:typeof g.referrerPolicy=="string"?g.referrerPolicy:void 0,imageSrcSet:typeof g.imageSrcSet=="string"?g.imageSrcSet:void 0,imageSizes:typeof g.imageSizes=="string"?g.imageSizes:void 0,media:typeof g.media=="string"?g.media:void 0})}},wt.preloadModule=function(f,g){if(typeof f=="string")if(g){var j=N(g.as,g.crossOrigin);d.d.m(f,{as:typeof g.as=="string"&&g.as!=="script"?g.as:void 0,crossOrigin:j,integrity:typeof g.integrity=="string"?g.integrity:void 0})}else d.d.m(f)},wt.requestFormReset=function(f){d.d.r(f)},wt.unstable_batchedUpdates=function(f,g){return f(g)},wt.useFormState=function(f,g,j){return m.H.useFormState(f,g,j)},wt.useFormStatus=function(){return m.H.useHostTransitionStatus()},wt.version="19.2.4",wt}var Wh;function ip(){if(Wh)return Uo.exports;Wh=1;function i(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(i)}catch(u){console.error(u)}}return i(),Uo.exports=np(),Uo.exports}var Fh;function cp(){if(Fh)return Ar;Fh=1;var i=rp(),u=Zo(),o=ip();function d(e){var a="https://react.dev/errors/"+e;if(1<arguments.length){a+="?args[]="+encodeURIComponent(arguments[1]);for(var s=2;s<arguments.length;s++)a+="&args[]="+encodeURIComponent(arguments[s])}return"Minified React error #"+e+"; visit "+a+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function x(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function b(e){var a=e,s=e;if(e.alternate)for(;a.return;)a=a.return;else{e=a;do a=e,(a.flags&4098)!==0&&(s=a.return),e=a.return;while(e)}return a.tag===3?s:null}function m(e){if(e.tag===13){var a=e.memoizedState;if(a===null&&(e=e.alternate,e!==null&&(a=e.memoizedState)),a!==null)return a.dehydrated}return null}function N(e){if(e.tag===31){var a=e.memoizedState;if(a===null&&(e=e.alternate,e!==null&&(a=e.memoizedState)),a!==null)return a.dehydrated}return null}function f(e){if(b(e)!==e)throw Error(d(188))}function g(e){var a=e.alternate;if(!a){if(a=b(e),a===null)throw Error(d(188));return a!==e?null:e}for(var s=e,l=a;;){var r=s.return;if(r===null)break;var n=r.alternate;if(n===null){if(l=r.return,l!==null){s=l;continue}break}if(r.child===n.child){for(n=r.child;n;){if(n===s)return f(r),e;if(n===l)return f(r),a;n=n.sibling}throw Error(d(188))}if(s.return!==l.return)s=r,l=n;else{for(var c=!1,h=r.child;h;){if(h===s){c=!0,s=r,l=n;break}if(h===l){c=!0,l=r,s=n;break}h=h.sibling}if(!c){for(h=n.child;h;){if(h===s){c=!0,s=n,l=r;break}if(h===l){c=!0,l=n,s=r;break}h=h.sibling}if(!c)throw Error(d(189))}}if(s.alternate!==l)throw Error(d(190))}if(s.tag!==3)throw Error(d(188));return s.stateNode.current===s?e:a}function j(e){var a=e.tag;if(a===5||a===26||a===27||a===6)return e;for(e=e.child;e!==null;){if(a=j(e),a!==null)return a;e=e.sibling}return null}var p=Object.assign,E=Symbol.for("react.element"),L=Symbol.for("react.transitional.element"),M=Symbol.for("react.portal"),w=Symbol.for("react.fragment"),k=Symbol.for("react.strict_mode"),A=Symbol.for("react.profiler"),O=Symbol.for("react.consumer"),$=Symbol.for("react.context"),Y=Symbol.for("react.forward_ref"),Z=Symbol.for("react.suspense"),ee=Symbol.for("react.suspense_list"),F=Symbol.for("react.memo"),z=Symbol.for("react.lazy"),Q=Symbol.for("react.activity"),ie=Symbol.for("react.memo_cache_sentinel"),ye=Symbol.iterator;function Ge(e){return e===null||typeof e!="object"?null:(e=ye&&e[ye]||e["@@iterator"],typeof e=="function"?e:null)}var ut=Symbol.for("react.client.reference");function Nt(e){if(e==null)return null;if(typeof e=="function")return e.$$typeof===ut?null:e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case w:return"Fragment";case A:return"Profiler";case k:return"StrictMode";case Z:return"Suspense";case ee:return"SuspenseList";case Q:return"Activity"}if(typeof e=="object")switch(e.$$typeof){case M:return"Portal";case $:return e.displayName||"Context";case O:return(e._context.displayName||"Context")+".Consumer";case Y:var a=e.render;return e=e.displayName,e||(e=a.displayName||a.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case F:return a=e.displayName||null,a!==null?a:Nt(e.type)||"Memo";case z:a=e._payload,e=e._init;try{return Nt(e(a))}catch{}}return null}var pt=Array.isArray,H=u.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,K=o.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,ne={pending:!1,data:null,method:null,action:null},Se=[],ke=-1;function S(e){return{current:e}}function X(e){0>ke||(e.current=Se[ke],Se[ke]=null,ke--)}function J(e,a){ke++,Se[ke]=e.current,e.current=a}var I=S(null),ue=S(null),xe=S(null),Ee=S(null);function ot(e,a){switch(J(xe,a),J(ue,e),J(I,null),a.nodeType){case 9:case 11:e=(e=a.documentElement)&&(e=e.namespaceURI)?hh(e):0;break;default:if(e=a.tagName,a=a.namespaceURI)a=hh(a),e=xh(a,e);else switch(e){case"svg":e=1;break;case"math":e=2;break;default:e=0}}X(I),J(I,e)}function Ve(){X(I),X(ue),X(xe)}function ga(e){e.memoizedState!==null&&J(Ee,e);var a=I.current,s=xh(a,e.type);a!==s&&(J(ue,e),J(I,s))}function ba(e){ue.current===e&&(X(I),X(ue)),Ee.current===e&&(X(Ee),kr._currentValue=ne)}var R,se;function le(e){if(R===void 0)try{throw Error()}catch(s){var a=s.stack.trim().match(/\n( *(at )?)/);R=a&&a[1]||"",se=-1<s.stack.indexOf(`
    at`)?" (<anonymous>)":-1<s.stack.indexOf("@")?"@unknown:0:0":""}return`
`+R+e+se}var _e=!1;function Ke(e,a){if(!e||_e)return"";_e=!0;var s=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var l={DetermineComponentFrameRoot:function(){try{if(a){var G=function(){throw Error()};if(Object.defineProperty(G.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(G,[])}catch(U){var q=U}Reflect.construct(e,[],G)}else{try{G.call()}catch(U){q=U}e.call(G.prototype)}}else{try{throw Error()}catch(U){q=U}(G=e())&&typeof G.catch=="function"&&G.catch(function(){})}}catch(U){if(U&&q&&typeof U.stack=="string")return[U.stack,q.stack]}return[null,null]}};l.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var r=Object.getOwnPropertyDescriptor(l.DetermineComponentFrameRoot,"name");r&&r.configurable&&Object.defineProperty(l.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var n=l.DetermineComponentFrameRoot(),c=n[0],h=n[1];if(c&&h){var y=c.split(`
`),_=h.split(`
`);for(r=l=0;l<y.length&&!y[l].includes("DetermineComponentFrameRoot");)l++;for(;r<_.length&&!_[r].includes("DetermineComponentFrameRoot");)r++;if(l===y.length||r===_.length)for(l=y.length-1,r=_.length-1;1<=l&&0<=r&&y[l]!==_[r];)r--;for(;1<=l&&0<=r;l--,r--)if(y[l]!==_[r]){if(l!==1||r!==1)do if(l--,r--,0>r||y[l]!==_[r]){var B=`
`+y[l].replace(" at new "," at ");return e.displayName&&B.includes("<anonymous>")&&(B=B.replace("<anonymous>",e.displayName)),B}while(1<=l&&0<=r);break}}}finally{_e=!1,Error.prepareStackTrace=s}return(s=e?e.displayName||e.name:"")?le(s):""}function me(e,a){switch(e.tag){case 26:case 27:case 5:return le(e.type);case 16:return le("Lazy");case 13:return e.child!==a&&a!==null?le("Suspense Fallback"):le("Suspense");case 19:return le("SuspenseList");case 0:case 15:return Ke(e.type,!1);case 11:return Ke(e.type.render,!1);case 1:return Ke(e.type,!0);case 31:return le("Activity");default:return""}}function oa(e){try{var a="",s=null;do a+=me(e,s),s=e,e=e.return;while(e);return a}catch(l){return`
Error generating stack: `+l.message+`
`+l.stack}}var Bl=Object.prototype.hasOwnProperty,va=i.unstable_scheduleCallback,ya=i.unstable_cancelCallback,Xr=i.unstable_shouldYield,bi=i.unstable_requestPaint,Ct=i.unstable_now,Gr=i.unstable_getCurrentPriorityLevel,Ae=i.unstable_ImmediatePriority,Yl=i.unstable_UserBlockingPriority,ja=i.unstable_NormalPriority,vi=i.unstable_LowPriority,Na=i.unstable_IdlePriority,Zr=i.log,Vl=i.unstable_setDisableYieldValue,Xa=null,gt=null;function da(e){if(typeof Zr=="function"&&Vl(e),gt&&typeof gt.setStrictMode=="function")try{gt.setStrictMode(Xa,e)}catch{}}var St=Math.clz32?Math.clz32:Ni,yi=Math.log,ji=Math.LN2;function Ni(e){return e>>>=0,e===0?32:31-(yi(e)/ji|0)|0}var Zs=256,Qs=262144,Ks=4194304;function $t(e){var a=e&42;if(a!==0)return a;switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return e&261888;case 262144:case 524288:case 1048576:case 2097152:return e&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return e&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return e}}function js(e,a,s){var l=e.pendingLanes;if(l===0)return 0;var r=0,n=e.suspendedLanes,c=e.pingedLanes;e=e.warmLanes;var h=l&134217727;return h!==0?(l=h&~n,l!==0?r=$t(l):(c&=h,c!==0?r=$t(c):s||(s=h&~e,s!==0&&(r=$t(s))))):(h=l&~n,h!==0?r=$t(h):c!==0?r=$t(c):s||(s=l&~e,s!==0&&(r=$t(s)))),r===0?0:a!==0&&a!==r&&(a&n)===0&&(n=r&-r,s=a&-a,n>=s||n===32&&(s&4194048)!==0)?a:r}function Xt(e,a){return(e.pendingLanes&~(e.suspendedLanes&~e.pingedLanes)&a)===0}function Qr(e,a){switch(e){case 1:case 2:case 4:case 8:case 64:return a+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return a+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Kr(){var e=Ks;return Ks<<=1,(Ks&62914560)===0&&(Ks=4194304),e}function Js(e){for(var a=[],s=0;31>s;s++)a.push(e);return a}function Ga(e,a){e.pendingLanes|=a,a!==268435456&&(e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0)}function wi(e,a,s,l,r,n){var c=e.pendingLanes;e.pendingLanes=s,e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0,e.expiredLanes&=s,e.entangledLanes&=s,e.errorRecoveryDisabledLanes&=s,e.shellSuspendCounter=0;var h=e.entanglements,y=e.expirationTimes,_=e.hiddenUpdates;for(s=c&~s;0<s;){var B=31-St(s),G=1<<B;h[B]=0,y[B]=-1;var q=_[B];if(q!==null)for(_[B]=null,B=0;B<q.length;B++){var U=q[B];U!==null&&(U.lane&=-536870913)}s&=~G}l!==0&&Jr(e,l,0),n!==0&&r===0&&e.tag!==0&&(e.suspendedLanes|=n&~(c&~a))}function Jr(e,a,s){e.pendingLanes|=a,e.suspendedLanes&=~a;var l=31-St(a);e.entangledLanes|=a,e.entanglements[l]=e.entanglements[l]|1073741824|s&261930}function W(e,a){var s=e.entangledLanes|=a;for(e=e.entanglements;s;){var l=31-St(s),r=1<<l;r&a|e[l]&a&&(e[l]|=a),s&=~r}}function ce(e,a){var s=a&-a;return s=(s&42)!==0?1:oe(s),(s&(e.suspendedLanes|a))!==0?0:s}function oe(e){switch(e){case 2:e=1;break;case 8:e=4;break;case 32:e=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:e=128;break;case 268435456:e=134217728;break;default:e=0}return e}function Ye(e){return e&=-e,2<e?8<e?(e&134217727)!==0?32:268435456:8:2}function ge(){var e=K.p;return e!==0?e:(e=window.event,e===void 0?32:Lh(e.type))}function Rt(e,a){var s=K.p;try{return K.p=e,a()}finally{K.p=s}}var mt=Math.random().toString(36).slice(2),Pe="__reactFiber$"+mt,We="__reactProps$"+mt,ze="__reactContainer$"+mt,Ns="__reactEvents$"+mt,$x="__reactListeners$"+mt,Xx="__reactHandles$"+mt,ed="__reactResources$"+mt,$l="__reactMarker$"+mt;function Ci(e){delete e[Pe],delete e[We],delete e[Ns],delete e[$x],delete e[Xx]}function Ps(e){var a=e[Pe];if(a)return a;for(var s=e.parentNode;s;){if(a=s[ze]||s[Pe]){if(s=a.alternate,a.child!==null||s!==null&&s.child!==null)for(e=jh(e);e!==null;){if(s=e[Pe])return s;e=jh(e)}return a}e=s,s=e.parentNode}return null}function Ws(e){if(e=e[Pe]||e[ze]){var a=e.tag;if(a===5||a===6||a===13||a===31||a===26||a===27||a===3)return e}return null}function Xl(e){var a=e.tag;if(a===5||a===26||a===27||a===6)return e.stateNode;throw Error(d(33))}function Fs(e){var a=e[ed];return a||(a=e[ed]={hoistableStyles:new Map,hoistableScripts:new Map}),a}function ht(e){e[$l]=!0}var td=new Set,ad={};function ws(e,a){Is(e,a),Is(e+"Capture",a)}function Is(e,a){for(ad[e]=a,e=0;e<a.length;e++)td.add(a[e])}var Gx=RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),sd={},ld={};function Zx(e){return Bl.call(ld,e)?!0:Bl.call(sd,e)?!1:Gx.test(e)?ld[e]=!0:(sd[e]=!0,!1)}function Pr(e,a,s){if(Zx(a))if(s===null)e.removeAttribute(a);else{switch(typeof s){case"undefined":case"function":case"symbol":e.removeAttribute(a);return;case"boolean":var l=a.toLowerCase().slice(0,5);if(l!=="data-"&&l!=="aria-"){e.removeAttribute(a);return}}e.setAttribute(a,""+s)}}function Wr(e,a,s){if(s===null)e.removeAttribute(a);else{switch(typeof s){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(a);return}e.setAttribute(a,""+s)}}function wa(e,a,s,l){if(l===null)e.removeAttribute(s);else{switch(typeof l){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(s);return}e.setAttributeNS(a,s,""+l)}}function Gt(e){switch(typeof e){case"bigint":case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function rd(e){var a=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(a==="checkbox"||a==="radio")}function Qx(e,a,s){var l=Object.getOwnPropertyDescriptor(e.constructor.prototype,a);if(!e.hasOwnProperty(a)&&typeof l<"u"&&typeof l.get=="function"&&typeof l.set=="function"){var r=l.get,n=l.set;return Object.defineProperty(e,a,{configurable:!0,get:function(){return r.call(this)},set:function(c){s=""+c,n.call(this,c)}}),Object.defineProperty(e,a,{enumerable:l.enumerable}),{getValue:function(){return s},setValue:function(c){s=""+c},stopTracking:function(){e._valueTracker=null,delete e[a]}}}}function Si(e){if(!e._valueTracker){var a=rd(e)?"checked":"value";e._valueTracker=Qx(e,a,""+e[a])}}function nd(e){if(!e)return!1;var a=e._valueTracker;if(!a)return!0;var s=a.getValue(),l="";return e&&(l=rd(e)?e.checked?"true":"false":e.value),e=l,e!==s?(a.setValue(e),!0):!1}function Fr(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}var Kx=/[\n"\\]/g;function Zt(e){return e.replace(Kx,function(a){return"\\"+a.charCodeAt(0).toString(16)+" "})}function Ei(e,a,s,l,r,n,c,h){e.name="",c!=null&&typeof c!="function"&&typeof c!="symbol"&&typeof c!="boolean"?e.type=c:e.removeAttribute("type"),a!=null?c==="number"?(a===0&&e.value===""||e.value!=a)&&(e.value=""+Gt(a)):e.value!==""+Gt(a)&&(e.value=""+Gt(a)):c!=="submit"&&c!=="reset"||e.removeAttribute("value"),a!=null?zi(e,c,Gt(a)):s!=null?zi(e,c,Gt(s)):l!=null&&e.removeAttribute("value"),r==null&&n!=null&&(e.defaultChecked=!!n),r!=null&&(e.checked=r&&typeof r!="function"&&typeof r!="symbol"),h!=null&&typeof h!="function"&&typeof h!="symbol"&&typeof h!="boolean"?e.name=""+Gt(h):e.removeAttribute("name")}function id(e,a,s,l,r,n,c,h){if(n!=null&&typeof n!="function"&&typeof n!="symbol"&&typeof n!="boolean"&&(e.type=n),a!=null||s!=null){if(!(n!=="submit"&&n!=="reset"||a!=null)){Si(e);return}s=s!=null?""+Gt(s):"",a=a!=null?""+Gt(a):s,h||a===e.value||(e.value=a),e.defaultValue=a}l=l??r,l=typeof l!="function"&&typeof l!="symbol"&&!!l,e.checked=h?e.checked:!!l,e.defaultChecked=!!l,c!=null&&typeof c!="function"&&typeof c!="symbol"&&typeof c!="boolean"&&(e.name=c),Si(e)}function zi(e,a,s){a==="number"&&Fr(e.ownerDocument)===e||e.defaultValue===""+s||(e.defaultValue=""+s)}function el(e,a,s,l){if(e=e.options,a){a={};for(var r=0;r<s.length;r++)a["$"+s[r]]=!0;for(s=0;s<e.length;s++)r=a.hasOwnProperty("$"+e[s].value),e[s].selected!==r&&(e[s].selected=r),r&&l&&(e[s].defaultSelected=!0)}else{for(s=""+Gt(s),a=null,r=0;r<e.length;r++){if(e[r].value===s){e[r].selected=!0,l&&(e[r].defaultSelected=!0);return}a!==null||e[r].disabled||(a=e[r])}a!==null&&(a.selected=!0)}}function cd(e,a,s){if(a!=null&&(a=""+Gt(a),a!==e.value&&(e.value=a),s==null)){e.defaultValue!==a&&(e.defaultValue=a);return}e.defaultValue=s!=null?""+Gt(s):""}function od(e,a,s,l){if(a==null){if(l!=null){if(s!=null)throw Error(d(92));if(pt(l)){if(1<l.length)throw Error(d(93));l=l[0]}s=l}s==null&&(s=""),a=s}s=Gt(a),e.defaultValue=s,l=e.textContent,l===s&&l!==""&&l!==null&&(e.value=l),Si(e)}function tl(e,a){if(a){var s=e.firstChild;if(s&&s===e.lastChild&&s.nodeType===3){s.nodeValue=a;return}}e.textContent=a}var Jx=new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));function dd(e,a,s){var l=a.indexOf("--")===0;s==null||typeof s=="boolean"||s===""?l?e.setProperty(a,""):a==="float"?e.cssFloat="":e[a]="":l?e.setProperty(a,s):typeof s!="number"||s===0||Jx.has(a)?a==="float"?e.cssFloat=s:e[a]=(""+s).trim():e[a]=s+"px"}function ud(e,a,s){if(a!=null&&typeof a!="object")throw Error(d(62));if(e=e.style,s!=null){for(var l in s)!s.hasOwnProperty(l)||a!=null&&a.hasOwnProperty(l)||(l.indexOf("--")===0?e.setProperty(l,""):l==="float"?e.cssFloat="":e[l]="");for(var r in a)l=a[r],a.hasOwnProperty(r)&&s[r]!==l&&dd(e,r,l)}else for(var n in a)a.hasOwnProperty(n)&&dd(e,n,a[n])}function ki(e){if(e.indexOf("-")===-1)return!1;switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Px=new Map([["acceptCharset","accept-charset"],["htmlFor","for"],["httpEquiv","http-equiv"],["crossOrigin","crossorigin"],["accentHeight","accent-height"],["alignmentBaseline","alignment-baseline"],["arabicForm","arabic-form"],["baselineShift","baseline-shift"],["capHeight","cap-height"],["clipPath","clip-path"],["clipRule","clip-rule"],["colorInterpolation","color-interpolation"],["colorInterpolationFilters","color-interpolation-filters"],["colorProfile","color-profile"],["colorRendering","color-rendering"],["dominantBaseline","dominant-baseline"],["enableBackground","enable-background"],["fillOpacity","fill-opacity"],["fillRule","fill-rule"],["floodColor","flood-color"],["floodOpacity","flood-opacity"],["fontFamily","font-family"],["fontSize","font-size"],["fontSizeAdjust","font-size-adjust"],["fontStretch","font-stretch"],["fontStyle","font-style"],["fontVariant","font-variant"],["fontWeight","font-weight"],["glyphName","glyph-name"],["glyphOrientationHorizontal","glyph-orientation-horizontal"],["glyphOrientationVertical","glyph-orientation-vertical"],["horizAdvX","horiz-adv-x"],["horizOriginX","horiz-origin-x"],["imageRendering","image-rendering"],["letterSpacing","letter-spacing"],["lightingColor","lighting-color"],["markerEnd","marker-end"],["markerMid","marker-mid"],["markerStart","marker-start"],["overlinePosition","overline-position"],["overlineThickness","overline-thickness"],["paintOrder","paint-order"],["panose-1","panose-1"],["pointerEvents","pointer-events"],["renderingIntent","rendering-intent"],["shapeRendering","shape-rendering"],["stopColor","stop-color"],["stopOpacity","stop-opacity"],["strikethroughPosition","strikethrough-position"],["strikethroughThickness","strikethrough-thickness"],["strokeDasharray","stroke-dasharray"],["strokeDashoffset","stroke-dashoffset"],["strokeLinecap","stroke-linecap"],["strokeLinejoin","stroke-linejoin"],["strokeMiterlimit","stroke-miterlimit"],["strokeOpacity","stroke-opacity"],["strokeWidth","stroke-width"],["textAnchor","text-anchor"],["textDecoration","text-decoration"],["textRendering","text-rendering"],["transformOrigin","transform-origin"],["underlinePosition","underline-position"],["underlineThickness","underline-thickness"],["unicodeBidi","unicode-bidi"],["unicodeRange","unicode-range"],["unitsPerEm","units-per-em"],["vAlphabetic","v-alphabetic"],["vHanging","v-hanging"],["vIdeographic","v-ideographic"],["vMathematical","v-mathematical"],["vectorEffect","vector-effect"],["vertAdvY","vert-adv-y"],["vertOriginX","vert-origin-x"],["vertOriginY","vert-origin-y"],["wordSpacing","word-spacing"],["writingMode","writing-mode"],["xmlnsXlink","xmlns:xlink"],["xHeight","x-height"]]),Wx=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function Ir(e){return Wx.test(""+e)?"javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')":e}function Ca(){}var Ti=null;function Mi(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var al=null,sl=null;function md(e){var a=Ws(e);if(a&&(e=a.stateNode)){var s=e[We]||null;e:switch(e=a.stateNode,a.type){case"input":if(Ei(e,s.value,s.defaultValue,s.defaultValue,s.checked,s.defaultChecked,s.type,s.name),a=s.name,s.type==="radio"&&a!=null){for(s=e;s.parentNode;)s=s.parentNode;for(s=s.querySelectorAll('input[name="'+Zt(""+a)+'"][type="radio"]'),a=0;a<s.length;a++){var l=s[a];if(l!==e&&l.form===e.form){var r=l[We]||null;if(!r)throw Error(d(90));Ei(l,r.value,r.defaultValue,r.defaultValue,r.checked,r.defaultChecked,r.type,r.name)}}for(a=0;a<s.length;a++)l=s[a],l.form===e.form&&nd(l)}break e;case"textarea":cd(e,s.value,s.defaultValue);break e;case"select":a=s.value,a!=null&&el(e,!!s.multiple,a,!1)}}}var Di=!1;function hd(e,a,s){if(Di)return e(a,s);Di=!0;try{var l=e(a);return l}finally{if(Di=!1,(al!==null||sl!==null)&&(Yn(),al&&(a=al,e=sl,sl=al=null,md(a),e)))for(a=0;a<e.length;a++)md(e[a])}}function Gl(e,a){var s=e.stateNode;if(s===null)return null;var l=s[We]||null;if(l===null)return null;s=l[a];e:switch(a){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(l=!l.disabled)||(e=e.type,l=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!l;break e;default:e=!1}if(e)return null;if(s&&typeof s!="function")throw Error(d(231,a,typeof s));return s}var Sa=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),_i=!1;if(Sa)try{var Zl={};Object.defineProperty(Zl,"passive",{get:function(){_i=!0}}),window.addEventListener("test",Zl,Zl),window.removeEventListener("test",Zl,Zl)}catch{_i=!1}var Za=null,Ai=null,en=null;function xd(){if(en)return en;var e,a=Ai,s=a.length,l,r="value"in Za?Za.value:Za.textContent,n=r.length;for(e=0;e<s&&a[e]===r[e];e++);var c=s-e;for(l=1;l<=c&&a[s-l]===r[n-l];l++);return en=r.slice(e,1<l?1-l:void 0)}function tn(e){var a=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&a===13&&(e=13)):e=a,e===10&&(e=13),32<=e||e===13?e:0}function an(){return!0}function fd(){return!1}function kt(e){function a(s,l,r,n,c){this._reactName=s,this._targetInst=r,this.type=l,this.nativeEvent=n,this.target=c,this.currentTarget=null;for(var h in e)e.hasOwnProperty(h)&&(s=e[h],this[h]=s?s(n):n[h]);return this.isDefaultPrevented=(n.defaultPrevented!=null?n.defaultPrevented:n.returnValue===!1)?an:fd,this.isPropagationStopped=fd,this}return p(a.prototype,{preventDefault:function(){this.defaultPrevented=!0;var s=this.nativeEvent;s&&(s.preventDefault?s.preventDefault():typeof s.returnValue!="unknown"&&(s.returnValue=!1),this.isDefaultPrevented=an)},stopPropagation:function(){var s=this.nativeEvent;s&&(s.stopPropagation?s.stopPropagation():typeof s.cancelBubble!="unknown"&&(s.cancelBubble=!0),this.isPropagationStopped=an)},persist:function(){},isPersistent:an}),a}var Cs={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},sn=kt(Cs),Ql=p({},Cs,{view:0,detail:0}),Fx=kt(Ql),Ri,qi,Kl,ln=p({},Ql,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Li,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==Kl&&(Kl&&e.type==="mousemove"?(Ri=e.screenX-Kl.screenX,qi=e.screenY-Kl.screenY):qi=Ri=0,Kl=e),Ri)},movementY:function(e){return"movementY"in e?e.movementY:qi}}),pd=kt(ln),Ix=p({},ln,{dataTransfer:0}),ef=kt(Ix),tf=p({},Ql,{relatedTarget:0}),Oi=kt(tf),af=p({},Cs,{animationName:0,elapsedTime:0,pseudoElement:0}),sf=kt(af),lf=p({},Cs,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),rf=kt(lf),nf=p({},Cs,{data:0}),gd=kt(nf),cf={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},of={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},df={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function uf(e){var a=this.nativeEvent;return a.getModifierState?a.getModifierState(e):(e=df[e])?!!a[e]:!1}function Li(){return uf}var mf=p({},Ql,{key:function(e){if(e.key){var a=cf[e.key]||e.key;if(a!=="Unidentified")return a}return e.type==="keypress"?(e=tn(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?of[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Li,charCode:function(e){return e.type==="keypress"?tn(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?tn(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),hf=kt(mf),xf=p({},ln,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),bd=kt(xf),ff=p({},Ql,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Li}),pf=kt(ff),gf=p({},Cs,{propertyName:0,elapsedTime:0,pseudoElement:0}),bf=kt(gf),vf=p({},ln,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),yf=kt(vf),jf=p({},Cs,{newState:0,oldState:0}),Nf=kt(jf),wf=[9,13,27,32],Ui=Sa&&"CompositionEvent"in window,Jl=null;Sa&&"documentMode"in document&&(Jl=document.documentMode);var Cf=Sa&&"TextEvent"in window&&!Jl,vd=Sa&&(!Ui||Jl&&8<Jl&&11>=Jl),yd=" ",jd=!1;function Nd(e,a){switch(e){case"keyup":return wf.indexOf(a.keyCode)!==-1;case"keydown":return a.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function wd(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var ll=!1;function Sf(e,a){switch(e){case"compositionend":return wd(a);case"keypress":return a.which!==32?null:(jd=!0,yd);case"textInput":return e=a.data,e===yd&&jd?null:e;default:return null}}function Ef(e,a){if(ll)return e==="compositionend"||!Ui&&Nd(e,a)?(e=xd(),en=Ai=Za=null,ll=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(a.ctrlKey||a.altKey||a.metaKey)||a.ctrlKey&&a.altKey){if(a.char&&1<a.char.length)return a.char;if(a.which)return String.fromCharCode(a.which)}return null;case"compositionend":return vd&&a.locale!=="ko"?null:a.data;default:return null}}var zf={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Cd(e){var a=e&&e.nodeName&&e.nodeName.toLowerCase();return a==="input"?!!zf[e.type]:a==="textarea"}function Sd(e,a,s,l){al?sl?sl.push(l):sl=[l]:al=l,a=Kn(a,"onChange"),0<a.length&&(s=new sn("onChange","change",null,s,l),e.push({event:s,listeners:a}))}var Pl=null,Wl=null;function kf(e){ih(e,0)}function rn(e){var a=Xl(e);if(nd(a))return e}function Ed(e,a){if(e==="change")return a}var zd=!1;if(Sa){var Hi;if(Sa){var Bi="oninput"in document;if(!Bi){var kd=document.createElement("div");kd.setAttribute("oninput","return;"),Bi=typeof kd.oninput=="function"}Hi=Bi}else Hi=!1;zd=Hi&&(!document.documentMode||9<document.documentMode)}function Td(){Pl&&(Pl.detachEvent("onpropertychange",Md),Wl=Pl=null)}function Md(e){if(e.propertyName==="value"&&rn(Wl)){var a=[];Sd(a,Wl,e,Mi(e)),hd(kf,a)}}function Tf(e,a,s){e==="focusin"?(Td(),Pl=a,Wl=s,Pl.attachEvent("onpropertychange",Md)):e==="focusout"&&Td()}function Mf(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return rn(Wl)}function Df(e,a){if(e==="click")return rn(a)}function _f(e,a){if(e==="input"||e==="change")return rn(a)}function Af(e,a){return e===a&&(e!==0||1/e===1/a)||e!==e&&a!==a}var qt=typeof Object.is=="function"?Object.is:Af;function Fl(e,a){if(qt(e,a))return!0;if(typeof e!="object"||e===null||typeof a!="object"||a===null)return!1;var s=Object.keys(e),l=Object.keys(a);if(s.length!==l.length)return!1;for(l=0;l<s.length;l++){var r=s[l];if(!Bl.call(a,r)||!qt(e[r],a[r]))return!1}return!0}function Dd(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function _d(e,a){var s=Dd(e);e=0;for(var l;s;){if(s.nodeType===3){if(l=e+s.textContent.length,e<=a&&l>=a)return{node:s,offset:a-e};e=l}e:{for(;s;){if(s.nextSibling){s=s.nextSibling;break e}s=s.parentNode}s=void 0}s=Dd(s)}}function Ad(e,a){return e&&a?e===a?!0:e&&e.nodeType===3?!1:a&&a.nodeType===3?Ad(e,a.parentNode):"contains"in e?e.contains(a):e.compareDocumentPosition?!!(e.compareDocumentPosition(a)&16):!1:!1}function Rd(e){e=e!=null&&e.ownerDocument!=null&&e.ownerDocument.defaultView!=null?e.ownerDocument.defaultView:window;for(var a=Fr(e.document);a instanceof e.HTMLIFrameElement;){try{var s=typeof a.contentWindow.location.href=="string"}catch{s=!1}if(s)e=a.contentWindow;else break;a=Fr(e.document)}return a}function Yi(e){var a=e&&e.nodeName&&e.nodeName.toLowerCase();return a&&(a==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||a==="textarea"||e.contentEditable==="true")}var Rf=Sa&&"documentMode"in document&&11>=document.documentMode,rl=null,Vi=null,Il=null,$i=!1;function qd(e,a,s){var l=s.window===s?s.document:s.nodeType===9?s:s.ownerDocument;$i||rl==null||rl!==Fr(l)||(l=rl,"selectionStart"in l&&Yi(l)?l={start:l.selectionStart,end:l.selectionEnd}:(l=(l.ownerDocument&&l.ownerDocument.defaultView||window).getSelection(),l={anchorNode:l.anchorNode,anchorOffset:l.anchorOffset,focusNode:l.focusNode,focusOffset:l.focusOffset}),Il&&Fl(Il,l)||(Il=l,l=Kn(Vi,"onSelect"),0<l.length&&(a=new sn("onSelect","select",null,a,s),e.push({event:a,listeners:l}),a.target=rl)))}function Ss(e,a){var s={};return s[e.toLowerCase()]=a.toLowerCase(),s["Webkit"+e]="webkit"+a,s["Moz"+e]="moz"+a,s}var nl={animationend:Ss("Animation","AnimationEnd"),animationiteration:Ss("Animation","AnimationIteration"),animationstart:Ss("Animation","AnimationStart"),transitionrun:Ss("Transition","TransitionRun"),transitionstart:Ss("Transition","TransitionStart"),transitioncancel:Ss("Transition","TransitionCancel"),transitionend:Ss("Transition","TransitionEnd")},Xi={},Od={};Sa&&(Od=document.createElement("div").style,"AnimationEvent"in window||(delete nl.animationend.animation,delete nl.animationiteration.animation,delete nl.animationstart.animation),"TransitionEvent"in window||delete nl.transitionend.transition);function Es(e){if(Xi[e])return Xi[e];if(!nl[e])return e;var a=nl[e],s;for(s in a)if(a.hasOwnProperty(s)&&s in Od)return Xi[e]=a[s];return e}var Ld=Es("animationend"),Ud=Es("animationiteration"),Hd=Es("animationstart"),qf=Es("transitionrun"),Of=Es("transitionstart"),Lf=Es("transitioncancel"),Bd=Es("transitionend"),Yd=new Map,Gi="abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");Gi.push("scrollEnd");function sa(e,a){Yd.set(e,a),ws(a,[e])}var nn=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var a=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(a))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",e);return}console.error(e)},Qt=[],il=0,Zi=0;function cn(){for(var e=il,a=Zi=il=0;a<e;){var s=Qt[a];Qt[a++]=null;var l=Qt[a];Qt[a++]=null;var r=Qt[a];Qt[a++]=null;var n=Qt[a];if(Qt[a++]=null,l!==null&&r!==null){var c=l.pending;c===null?r.next=r:(r.next=c.next,c.next=r),l.pending=r}n!==0&&Vd(s,r,n)}}function on(e,a,s,l){Qt[il++]=e,Qt[il++]=a,Qt[il++]=s,Qt[il++]=l,Zi|=l,e.lanes|=l,e=e.alternate,e!==null&&(e.lanes|=l)}function Qi(e,a,s,l){return on(e,a,s,l),dn(e)}function zs(e,a){return on(e,null,null,a),dn(e)}function Vd(e,a,s){e.lanes|=s;var l=e.alternate;l!==null&&(l.lanes|=s);for(var r=!1,n=e.return;n!==null;)n.childLanes|=s,l=n.alternate,l!==null&&(l.childLanes|=s),n.tag===22&&(e=n.stateNode,e===null||e._visibility&1||(r=!0)),e=n,n=n.return;return e.tag===3?(n=e.stateNode,r&&a!==null&&(r=31-St(s),e=n.hiddenUpdates,l=e[r],l===null?e[r]=[a]:l.push(a),a.lane=s|536870912),n):null}function dn(e){if(50<jr)throw jr=0,ao=null,Error(d(185));for(var a=e.return;a!==null;)e=a,a=e.return;return e.tag===3?e.stateNode:null}var cl={};function Uf(e,a,s,l){this.tag=e,this.key=s,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=a,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=l,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Ot(e,a,s,l){return new Uf(e,a,s,l)}function Ki(e){return e=e.prototype,!(!e||!e.isReactComponent)}function Ea(e,a){var s=e.alternate;return s===null?(s=Ot(e.tag,a,e.key,e.mode),s.elementType=e.elementType,s.type=e.type,s.stateNode=e.stateNode,s.alternate=e,e.alternate=s):(s.pendingProps=a,s.type=e.type,s.flags=0,s.subtreeFlags=0,s.deletions=null),s.flags=e.flags&65011712,s.childLanes=e.childLanes,s.lanes=e.lanes,s.child=e.child,s.memoizedProps=e.memoizedProps,s.memoizedState=e.memoizedState,s.updateQueue=e.updateQueue,a=e.dependencies,s.dependencies=a===null?null:{lanes:a.lanes,firstContext:a.firstContext},s.sibling=e.sibling,s.index=e.index,s.ref=e.ref,s.refCleanup=e.refCleanup,s}function $d(e,a){e.flags&=65011714;var s=e.alternate;return s===null?(e.childLanes=0,e.lanes=a,e.child=null,e.subtreeFlags=0,e.memoizedProps=null,e.memoizedState=null,e.updateQueue=null,e.dependencies=null,e.stateNode=null):(e.childLanes=s.childLanes,e.lanes=s.lanes,e.child=s.child,e.subtreeFlags=0,e.deletions=null,e.memoizedProps=s.memoizedProps,e.memoizedState=s.memoizedState,e.updateQueue=s.updateQueue,e.type=s.type,a=s.dependencies,e.dependencies=a===null?null:{lanes:a.lanes,firstContext:a.firstContext}),e}function un(e,a,s,l,r,n){var c=0;if(l=e,typeof e=="function")Ki(e)&&(c=1);else if(typeof e=="string")c=$0(e,s,I.current)?26:e==="html"||e==="head"||e==="body"?27:5;else e:switch(e){case Q:return e=Ot(31,s,a,r),e.elementType=Q,e.lanes=n,e;case w:return ks(s.children,r,n,a);case k:c=8,r|=24;break;case A:return e=Ot(12,s,a,r|2),e.elementType=A,e.lanes=n,e;case Z:return e=Ot(13,s,a,r),e.elementType=Z,e.lanes=n,e;case ee:return e=Ot(19,s,a,r),e.elementType=ee,e.lanes=n,e;default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case $:c=10;break e;case O:c=9;break e;case Y:c=11;break e;case F:c=14;break e;case z:c=16,l=null;break e}c=29,s=Error(d(130,e===null?"null":typeof e,"")),l=null}return a=Ot(c,s,a,r),a.elementType=e,a.type=l,a.lanes=n,a}function ks(e,a,s,l){return e=Ot(7,e,l,a),e.lanes=s,e}function Ji(e,a,s){return e=Ot(6,e,null,a),e.lanes=s,e}function Xd(e){var a=Ot(18,null,null,0);return a.stateNode=e,a}function Pi(e,a,s){return a=Ot(4,e.children!==null?e.children:[],e.key,a),a.lanes=s,a.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},a}var Gd=new WeakMap;function Kt(e,a){if(typeof e=="object"&&e!==null){var s=Gd.get(e);return s!==void 0?s:(a={value:e,source:a,stack:oa(a)},Gd.set(e,a),a)}return{value:e,source:a,stack:oa(a)}}var ol=[],dl=0,mn=null,er=0,Jt=[],Pt=0,Qa=null,ua=1,ma="";function za(e,a){ol[dl++]=er,ol[dl++]=mn,mn=e,er=a}function Zd(e,a,s){Jt[Pt++]=ua,Jt[Pt++]=ma,Jt[Pt++]=Qa,Qa=e;var l=ua;e=ma;var r=32-St(l)-1;l&=~(1<<r),s+=1;var n=32-St(a)+r;if(30<n){var c=r-r%5;n=(l&(1<<c)-1).toString(32),l>>=c,r-=c,ua=1<<32-St(a)+r|s<<r|l,ma=n+e}else ua=1<<n|s<<r|l,ma=e}function Wi(e){e.return!==null&&(za(e,1),Zd(e,1,0))}function Fi(e){for(;e===mn;)mn=ol[--dl],ol[dl]=null,er=ol[--dl],ol[dl]=null;for(;e===Qa;)Qa=Jt[--Pt],Jt[Pt]=null,ma=Jt[--Pt],Jt[Pt]=null,ua=Jt[--Pt],Jt[Pt]=null}function Qd(e,a){Jt[Pt++]=ua,Jt[Pt++]=ma,Jt[Pt++]=Qa,ua=a.id,ma=a.overflow,Qa=e}var bt=null,$e=null,we=!1,Ka=null,Wt=!1,Ii=Error(d(519));function Ja(e){var a=Error(d(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?"text":"HTML",""));throw tr(Kt(a,e)),Ii}function Kd(e){var a=e.stateNode,s=e.type,l=e.memoizedProps;switch(a[Pe]=e,a[We]=l,s){case"dialog":ve("cancel",a),ve("close",a);break;case"iframe":case"object":case"embed":ve("load",a);break;case"video":case"audio":for(s=0;s<wr.length;s++)ve(wr[s],a);break;case"source":ve("error",a);break;case"img":case"image":case"link":ve("error",a),ve("load",a);break;case"details":ve("toggle",a);break;case"input":ve("invalid",a),id(a,l.value,l.defaultValue,l.checked,l.defaultChecked,l.type,l.name,!0);break;case"select":ve("invalid",a);break;case"textarea":ve("invalid",a),od(a,l.value,l.defaultValue,l.children)}s=l.children,typeof s!="string"&&typeof s!="number"&&typeof s!="bigint"||a.textContent===""+s||l.suppressHydrationWarning===!0||uh(a.textContent,s)?(l.popover!=null&&(ve("beforetoggle",a),ve("toggle",a)),l.onScroll!=null&&ve("scroll",a),l.onScrollEnd!=null&&ve("scrollend",a),l.onClick!=null&&(a.onclick=Ca),a=!0):a=!1,a||Ja(e,!0)}function Jd(e){for(bt=e.return;bt;)switch(bt.tag){case 5:case 31:case 13:Wt=!1;return;case 27:case 3:Wt=!0;return;default:bt=bt.return}}function ul(e){if(e!==bt)return!1;if(!we)return Jd(e),we=!0,!1;var a=e.tag,s;if((s=a!==3&&a!==27)&&((s=a===5)&&(s=e.type,s=!(s!=="form"&&s!=="button")||bo(e.type,e.memoizedProps)),s=!s),s&&$e&&Ja(e),Jd(e),a===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(d(317));$e=yh(e)}else if(a===31){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(d(317));$e=yh(e)}else a===27?(a=$e,os(e.type)?(e=wo,wo=null,$e=e):$e=a):$e=bt?It(e.stateNode.nextSibling):null;return!0}function Ts(){$e=bt=null,we=!1}function ec(){var e=Ka;return e!==null&&(_t===null?_t=e:_t.push.apply(_t,e),Ka=null),e}function tr(e){Ka===null?Ka=[e]:Ka.push(e)}var tc=S(null),Ms=null,ka=null;function Pa(e,a,s){J(tc,a._currentValue),a._currentValue=s}function Ta(e){e._currentValue=tc.current,X(tc)}function ac(e,a,s){for(;e!==null;){var l=e.alternate;if((e.childLanes&a)!==a?(e.childLanes|=a,l!==null&&(l.childLanes|=a)):l!==null&&(l.childLanes&a)!==a&&(l.childLanes|=a),e===s)break;e=e.return}}function sc(e,a,s,l){var r=e.child;for(r!==null&&(r.return=e);r!==null;){var n=r.dependencies;if(n!==null){var c=r.child;n=n.firstContext;e:for(;n!==null;){var h=n;n=r;for(var y=0;y<a.length;y++)if(h.context===a[y]){n.lanes|=s,h=n.alternate,h!==null&&(h.lanes|=s),ac(n.return,s,e),l||(c=null);break e}n=h.next}}else if(r.tag===18){if(c=r.return,c===null)throw Error(d(341));c.lanes|=s,n=c.alternate,n!==null&&(n.lanes|=s),ac(c,s,e),c=null}else c=r.child;if(c!==null)c.return=r;else for(c=r;c!==null;){if(c===e){c=null;break}if(r=c.sibling,r!==null){r.return=c.return,c=r;break}c=c.return}r=c}}function ml(e,a,s,l){e=null;for(var r=a,n=!1;r!==null;){if(!n){if((r.flags&524288)!==0)n=!0;else if((r.flags&262144)!==0)break}if(r.tag===10){var c=r.alternate;if(c===null)throw Error(d(387));if(c=c.memoizedProps,c!==null){var h=r.type;qt(r.pendingProps.value,c.value)||(e!==null?e.push(h):e=[h])}}else if(r===Ee.current){if(c=r.alternate,c===null)throw Error(d(387));c.memoizedState.memoizedState!==r.memoizedState.memoizedState&&(e!==null?e.push(kr):e=[kr])}r=r.return}e!==null&&sc(a,e,s,l),a.flags|=262144}function hn(e){for(e=e.firstContext;e!==null;){if(!qt(e.context._currentValue,e.memoizedValue))return!0;e=e.next}return!1}function Ds(e){Ms=e,ka=null,e=e.dependencies,e!==null&&(e.firstContext=null)}function vt(e){return Pd(Ms,e)}function xn(e,a){return Ms===null&&Ds(e),Pd(e,a)}function Pd(e,a){var s=a._currentValue;if(a={context:a,memoizedValue:s,next:null},ka===null){if(e===null)throw Error(d(308));ka=a,e.dependencies={lanes:0,firstContext:a},e.flags|=524288}else ka=ka.next=a;return s}var Hf=typeof AbortController<"u"?AbortController:function(){var e=[],a=this.signal={aborted:!1,addEventListener:function(s,l){e.push(l)}};this.abort=function(){a.aborted=!0,e.forEach(function(s){return s()})}},Bf=i.unstable_scheduleCallback,Yf=i.unstable_NormalPriority,st={$$typeof:$,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function lc(){return{controller:new Hf,data:new Map,refCount:0}}function ar(e){e.refCount--,e.refCount===0&&Bf(Yf,function(){e.controller.abort()})}var sr=null,rc=0,hl=0,xl=null;function Vf(e,a){if(sr===null){var s=sr=[];rc=0,hl=co(),xl={status:"pending",value:void 0,then:function(l){s.push(l)}}}return rc++,a.then(Wd,Wd),a}function Wd(){if(--rc===0&&sr!==null){xl!==null&&(xl.status="fulfilled");var e=sr;sr=null,hl=0,xl=null;for(var a=0;a<e.length;a++)(0,e[a])()}}function $f(e,a){var s=[],l={status:"pending",value:null,reason:null,then:function(r){s.push(r)}};return e.then(function(){l.status="fulfilled",l.value=a;for(var r=0;r<s.length;r++)(0,s[r])(a)},function(r){for(l.status="rejected",l.reason=r,r=0;r<s.length;r++)(0,s[r])(void 0)}),l}var Fd=H.S;H.S=function(e,a){qm=Ct(),typeof a=="object"&&a!==null&&typeof a.then=="function"&&Vf(e,a),Fd!==null&&Fd(e,a)};var _s=S(null);function nc(){var e=_s.current;return e!==null?e:Be.pooledCache}function fn(e,a){a===null?J(_s,_s.current):J(_s,a.pool)}function Id(){var e=nc();return e===null?null:{parent:st._currentValue,pool:e}}var fl=Error(d(460)),ic=Error(d(474)),pn=Error(d(542)),gn={then:function(){}};function eu(e){return e=e.status,e==="fulfilled"||e==="rejected"}function tu(e,a,s){switch(s=e[s],s===void 0?e.push(a):s!==a&&(a.then(Ca,Ca),a=s),a.status){case"fulfilled":return a.value;case"rejected":throw e=a.reason,su(e),e;default:if(typeof a.status=="string")a.then(Ca,Ca);else{if(e=Be,e!==null&&100<e.shellSuspendCounter)throw Error(d(482));e=a,e.status="pending",e.then(function(l){if(a.status==="pending"){var r=a;r.status="fulfilled",r.value=l}},function(l){if(a.status==="pending"){var r=a;r.status="rejected",r.reason=l}})}switch(a.status){case"fulfilled":return a.value;case"rejected":throw e=a.reason,su(e),e}throw Rs=a,fl}}function As(e){try{var a=e._init;return a(e._payload)}catch(s){throw s!==null&&typeof s=="object"&&typeof s.then=="function"?(Rs=s,fl):s}}var Rs=null;function au(){if(Rs===null)throw Error(d(459));var e=Rs;return Rs=null,e}function su(e){if(e===fl||e===pn)throw Error(d(483))}var pl=null,lr=0;function bn(e){var a=lr;return lr+=1,pl===null&&(pl=[]),tu(pl,e,a)}function rr(e,a){a=a.props.ref,e.ref=a!==void 0?a:null}function vn(e,a){throw a.$$typeof===E?Error(d(525)):(e=Object.prototype.toString.call(a),Error(d(31,e==="[object Object]"?"object with keys {"+Object.keys(a).join(", ")+"}":e)))}function lu(e){function a(T,C){if(e){var D=T.deletions;D===null?(T.deletions=[C],T.flags|=16):D.push(C)}}function s(T,C){if(!e)return null;for(;C!==null;)a(T,C),C=C.sibling;return null}function l(T){for(var C=new Map;T!==null;)T.key!==null?C.set(T.key,T):C.set(T.index,T),T=T.sibling;return C}function r(T,C){return T=Ea(T,C),T.index=0,T.sibling=null,T}function n(T,C,D){return T.index=D,e?(D=T.alternate,D!==null?(D=D.index,D<C?(T.flags|=67108866,C):D):(T.flags|=67108866,C)):(T.flags|=1048576,C)}function c(T){return e&&T.alternate===null&&(T.flags|=67108866),T}function h(T,C,D,V){return C===null||C.tag!==6?(C=Ji(D,T.mode,V),C.return=T,C):(C=r(C,D),C.return=T,C)}function y(T,C,D,V){var re=D.type;return re===w?B(T,C,D.props.children,V,D.key):C!==null&&(C.elementType===re||typeof re=="object"&&re!==null&&re.$$typeof===z&&As(re)===C.type)?(C=r(C,D.props),rr(C,D),C.return=T,C):(C=un(D.type,D.key,D.props,null,T.mode,V),rr(C,D),C.return=T,C)}function _(T,C,D,V){return C===null||C.tag!==4||C.stateNode.containerInfo!==D.containerInfo||C.stateNode.implementation!==D.implementation?(C=Pi(D,T.mode,V),C.return=T,C):(C=r(C,D.children||[]),C.return=T,C)}function B(T,C,D,V,re){return C===null||C.tag!==7?(C=ks(D,T.mode,V,re),C.return=T,C):(C=r(C,D),C.return=T,C)}function G(T,C,D){if(typeof C=="string"&&C!==""||typeof C=="number"||typeof C=="bigint")return C=Ji(""+C,T.mode,D),C.return=T,C;if(typeof C=="object"&&C!==null){switch(C.$$typeof){case L:return D=un(C.type,C.key,C.props,null,T.mode,D),rr(D,C),D.return=T,D;case M:return C=Pi(C,T.mode,D),C.return=T,C;case z:return C=As(C),G(T,C,D)}if(pt(C)||Ge(C))return C=ks(C,T.mode,D,null),C.return=T,C;if(typeof C.then=="function")return G(T,bn(C),D);if(C.$$typeof===$)return G(T,xn(T,C),D);vn(T,C)}return null}function q(T,C,D,V){var re=C!==null?C.key:null;if(typeof D=="string"&&D!==""||typeof D=="number"||typeof D=="bigint")return re!==null?null:h(T,C,""+D,V);if(typeof D=="object"&&D!==null){switch(D.$$typeof){case L:return D.key===re?y(T,C,D,V):null;case M:return D.key===re?_(T,C,D,V):null;case z:return D=As(D),q(T,C,D,V)}if(pt(D)||Ge(D))return re!==null?null:B(T,C,D,V,null);if(typeof D.then=="function")return q(T,C,bn(D),V);if(D.$$typeof===$)return q(T,C,xn(T,D),V);vn(T,D)}return null}function U(T,C,D,V,re){if(typeof V=="string"&&V!==""||typeof V=="number"||typeof V=="bigint")return T=T.get(D)||null,h(C,T,""+V,re);if(typeof V=="object"&&V!==null){switch(V.$$typeof){case L:return T=T.get(V.key===null?D:V.key)||null,y(C,T,V,re);case M:return T=T.get(V.key===null?D:V.key)||null,_(C,T,V,re);case z:return V=As(V),U(T,C,D,V,re)}if(pt(V)||Ge(V))return T=T.get(D)||null,B(C,T,V,re,null);if(typeof V.then=="function")return U(T,C,D,bn(V),re);if(V.$$typeof===$)return U(T,C,D,xn(C,V),re);vn(C,V)}return null}function te(T,C,D,V){for(var re=null,Te=null,ae=C,pe=C=0,Ne=null;ae!==null&&pe<D.length;pe++){ae.index>pe?(Ne=ae,ae=null):Ne=ae.sibling;var Me=q(T,ae,D[pe],V);if(Me===null){ae===null&&(ae=Ne);break}e&&ae&&Me.alternate===null&&a(T,ae),C=n(Me,C,pe),Te===null?re=Me:Te.sibling=Me,Te=Me,ae=Ne}if(pe===D.length)return s(T,ae),we&&za(T,pe),re;if(ae===null){for(;pe<D.length;pe++)ae=G(T,D[pe],V),ae!==null&&(C=n(ae,C,pe),Te===null?re=ae:Te.sibling=ae,Te=ae);return we&&za(T,pe),re}for(ae=l(ae);pe<D.length;pe++)Ne=U(ae,T,pe,D[pe],V),Ne!==null&&(e&&Ne.alternate!==null&&ae.delete(Ne.key===null?pe:Ne.key),C=n(Ne,C,pe),Te===null?re=Ne:Te.sibling=Ne,Te=Ne);return e&&ae.forEach(function(xs){return a(T,xs)}),we&&za(T,pe),re}function de(T,C,D,V){if(D==null)throw Error(d(151));for(var re=null,Te=null,ae=C,pe=C=0,Ne=null,Me=D.next();ae!==null&&!Me.done;pe++,Me=D.next()){ae.index>pe?(Ne=ae,ae=null):Ne=ae.sibling;var xs=q(T,ae,Me.value,V);if(xs===null){ae===null&&(ae=Ne);break}e&&ae&&xs.alternate===null&&a(T,ae),C=n(xs,C,pe),Te===null?re=xs:Te.sibling=xs,Te=xs,ae=Ne}if(Me.done)return s(T,ae),we&&za(T,pe),re;if(ae===null){for(;!Me.done;pe++,Me=D.next())Me=G(T,Me.value,V),Me!==null&&(C=n(Me,C,pe),Te===null?re=Me:Te.sibling=Me,Te=Me);return we&&za(T,pe),re}for(ae=l(ae);!Me.done;pe++,Me=D.next())Me=U(ae,T,pe,Me.value,V),Me!==null&&(e&&Me.alternate!==null&&ae.delete(Me.key===null?pe:Me.key),C=n(Me,C,pe),Te===null?re=Me:Te.sibling=Me,Te=Me);return e&&ae.forEach(function(ep){return a(T,ep)}),we&&za(T,pe),re}function He(T,C,D,V){if(typeof D=="object"&&D!==null&&D.type===w&&D.key===null&&(D=D.props.children),typeof D=="object"&&D!==null){switch(D.$$typeof){case L:e:{for(var re=D.key;C!==null;){if(C.key===re){if(re=D.type,re===w){if(C.tag===7){s(T,C.sibling),V=r(C,D.props.children),V.return=T,T=V;break e}}else if(C.elementType===re||typeof re=="object"&&re!==null&&re.$$typeof===z&&As(re)===C.type){s(T,C.sibling),V=r(C,D.props),rr(V,D),V.return=T,T=V;break e}s(T,C);break}else a(T,C);C=C.sibling}D.type===w?(V=ks(D.props.children,T.mode,V,D.key),V.return=T,T=V):(V=un(D.type,D.key,D.props,null,T.mode,V),rr(V,D),V.return=T,T=V)}return c(T);case M:e:{for(re=D.key;C!==null;){if(C.key===re)if(C.tag===4&&C.stateNode.containerInfo===D.containerInfo&&C.stateNode.implementation===D.implementation){s(T,C.sibling),V=r(C,D.children||[]),V.return=T,T=V;break e}else{s(T,C);break}else a(T,C);C=C.sibling}V=Pi(D,T.mode,V),V.return=T,T=V}return c(T);case z:return D=As(D),He(T,C,D,V)}if(pt(D))return te(T,C,D,V);if(Ge(D)){if(re=Ge(D),typeof re!="function")throw Error(d(150));return D=re.call(D),de(T,C,D,V)}if(typeof D.then=="function")return He(T,C,bn(D),V);if(D.$$typeof===$)return He(T,C,xn(T,D),V);vn(T,D)}return typeof D=="string"&&D!==""||typeof D=="number"||typeof D=="bigint"?(D=""+D,C!==null&&C.tag===6?(s(T,C.sibling),V=r(C,D),V.return=T,T=V):(s(T,C),V=Ji(D,T.mode,V),V.return=T,T=V),c(T)):s(T,C)}return function(T,C,D,V){try{lr=0;var re=He(T,C,D,V);return pl=null,re}catch(ae){if(ae===fl||ae===pn)throw ae;var Te=Ot(29,ae,null,T.mode);return Te.lanes=V,Te.return=T,Te}}}var qs=lu(!0),ru=lu(!1),Wa=!1;function cc(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function oc(e,a){e=e.updateQueue,a.updateQueue===e&&(a.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,callbacks:null})}function Fa(e){return{lane:e,tag:0,payload:null,callback:null,next:null}}function Ia(e,a,s){var l=e.updateQueue;if(l===null)return null;if(l=l.shared,(Re&2)!==0){var r=l.pending;return r===null?a.next=a:(a.next=r.next,r.next=a),l.pending=a,a=dn(e),Vd(e,null,s),a}return on(e,l,a,s),dn(e)}function nr(e,a,s){if(a=a.updateQueue,a!==null&&(a=a.shared,(s&4194048)!==0)){var l=a.lanes;l&=e.pendingLanes,s|=l,a.lanes=s,W(e,s)}}function dc(e,a){var s=e.updateQueue,l=e.alternate;if(l!==null&&(l=l.updateQueue,s===l)){var r=null,n=null;if(s=s.firstBaseUpdate,s!==null){do{var c={lane:s.lane,tag:s.tag,payload:s.payload,callback:null,next:null};n===null?r=n=c:n=n.next=c,s=s.next}while(s!==null);n===null?r=n=a:n=n.next=a}else r=n=a;s={baseState:l.baseState,firstBaseUpdate:r,lastBaseUpdate:n,shared:l.shared,callbacks:l.callbacks},e.updateQueue=s;return}e=s.lastBaseUpdate,e===null?s.firstBaseUpdate=a:e.next=a,s.lastBaseUpdate=a}var uc=!1;function ir(){if(uc){var e=xl;if(e!==null)throw e}}function cr(e,a,s,l){uc=!1;var r=e.updateQueue;Wa=!1;var n=r.firstBaseUpdate,c=r.lastBaseUpdate,h=r.shared.pending;if(h!==null){r.shared.pending=null;var y=h,_=y.next;y.next=null,c===null?n=_:c.next=_,c=y;var B=e.alternate;B!==null&&(B=B.updateQueue,h=B.lastBaseUpdate,h!==c&&(h===null?B.firstBaseUpdate=_:h.next=_,B.lastBaseUpdate=y))}if(n!==null){var G=r.baseState;c=0,B=_=y=null,h=n;do{var q=h.lane&-536870913,U=q!==h.lane;if(U?(je&q)===q:(l&q)===q){q!==0&&q===hl&&(uc=!0),B!==null&&(B=B.next={lane:0,tag:h.tag,payload:h.payload,callback:null,next:null});e:{var te=e,de=h;q=a;var He=s;switch(de.tag){case 1:if(te=de.payload,typeof te=="function"){G=te.call(He,G,q);break e}G=te;break e;case 3:te.flags=te.flags&-65537|128;case 0:if(te=de.payload,q=typeof te=="function"?te.call(He,G,q):te,q==null)break e;G=p({},G,q);break e;case 2:Wa=!0}}q=h.callback,q!==null&&(e.flags|=64,U&&(e.flags|=8192),U=r.callbacks,U===null?r.callbacks=[q]:U.push(q))}else U={lane:q,tag:h.tag,payload:h.payload,callback:h.callback,next:null},B===null?(_=B=U,y=G):B=B.next=U,c|=q;if(h=h.next,h===null){if(h=r.shared.pending,h===null)break;U=h,h=U.next,U.next=null,r.lastBaseUpdate=U,r.shared.pending=null}}while(!0);B===null&&(y=G),r.baseState=y,r.firstBaseUpdate=_,r.lastBaseUpdate=B,n===null&&(r.shared.lanes=0),ls|=c,e.lanes=c,e.memoizedState=G}}function nu(e,a){if(typeof e!="function")throw Error(d(191,e));e.call(a)}function iu(e,a){var s=e.callbacks;if(s!==null)for(e.callbacks=null,e=0;e<s.length;e++)nu(s[e],a)}var gl=S(null),yn=S(0);function cu(e,a){e=Ua,J(yn,e),J(gl,a),Ua=e|a.baseLanes}function mc(){J(yn,Ua),J(gl,gl.current)}function hc(){Ua=yn.current,X(gl),X(yn)}var Lt=S(null),Ft=null;function es(e){var a=e.alternate;J(et,et.current&1),J(Lt,e),Ft===null&&(a===null||gl.current!==null||a.memoizedState!==null)&&(Ft=e)}function xc(e){J(et,et.current),J(Lt,e),Ft===null&&(Ft=e)}function ou(e){e.tag===22?(J(et,et.current),J(Lt,e),Ft===null&&(Ft=e)):ts()}function ts(){J(et,et.current),J(Lt,Lt.current)}function Ut(e){X(Lt),Ft===e&&(Ft=null),X(et)}var et=S(0);function jn(e){for(var a=e;a!==null;){if(a.tag===13){var s=a.memoizedState;if(s!==null&&(s=s.dehydrated,s===null||jo(s)||No(s)))return a}else if(a.tag===19&&(a.memoizedProps.revealOrder==="forwards"||a.memoizedProps.revealOrder==="backwards"||a.memoizedProps.revealOrder==="unstable_legacy-backwards"||a.memoizedProps.revealOrder==="together")){if((a.flags&128)!==0)return a}else if(a.child!==null){a.child.return=a,a=a.child;continue}if(a===e)break;for(;a.sibling===null;){if(a.return===null||a.return===e)return null;a=a.return}a.sibling.return=a.return,a=a.sibling}return null}var Ma=0,fe=null,Le=null,lt=null,Nn=!1,bl=!1,Os=!1,wn=0,or=0,vl=null,Xf=0;function Fe(){throw Error(d(321))}function fc(e,a){if(a===null)return!1;for(var s=0;s<a.length&&s<e.length;s++)if(!qt(e[s],a[s]))return!1;return!0}function pc(e,a,s,l,r,n){return Ma=n,fe=a,a.memoizedState=null,a.updateQueue=null,a.lanes=0,H.H=e===null||e.memoizedState===null?Zu:Dc,Os=!1,n=s(l,r),Os=!1,bl&&(n=uu(a,s,l,r)),du(e),n}function du(e){H.H=mr;var a=Le!==null&&Le.next!==null;if(Ma=0,lt=Le=fe=null,Nn=!1,or=0,vl=null,a)throw Error(d(300));e===null||rt||(e=e.dependencies,e!==null&&hn(e)&&(rt=!0))}function uu(e,a,s,l){fe=e;var r=0;do{if(bl&&(vl=null),or=0,bl=!1,25<=r)throw Error(d(301));if(r+=1,lt=Le=null,e.updateQueue!=null){var n=e.updateQueue;n.lastEffect=null,n.events=null,n.stores=null,n.memoCache!=null&&(n.memoCache.index=0)}H.H=Qu,n=a(s,l)}while(bl);return n}function Gf(){var e=H.H,a=e.useState()[0];return a=typeof a.then=="function"?dr(a):a,e=e.useState()[0],(Le!==null?Le.memoizedState:null)!==e&&(fe.flags|=1024),a}function gc(){var e=wn!==0;return wn=0,e}function bc(e,a,s){a.updateQueue=e.updateQueue,a.flags&=-2053,e.lanes&=~s}function vc(e){if(Nn){for(e=e.memoizedState;e!==null;){var a=e.queue;a!==null&&(a.pending=null),e=e.next}Nn=!1}Ma=0,lt=Le=fe=null,bl=!1,or=wn=0,vl=null}function Et(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return lt===null?fe.memoizedState=lt=e:lt=lt.next=e,lt}function tt(){if(Le===null){var e=fe.alternate;e=e!==null?e.memoizedState:null}else e=Le.next;var a=lt===null?fe.memoizedState:lt.next;if(a!==null)lt=a,Le=e;else{if(e===null)throw fe.alternate===null?Error(d(467)):Error(d(310));Le=e,e={memoizedState:Le.memoizedState,baseState:Le.baseState,baseQueue:Le.baseQueue,queue:Le.queue,next:null},lt===null?fe.memoizedState=lt=e:lt=lt.next=e}return lt}function Cn(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function dr(e){var a=or;return or+=1,vl===null&&(vl=[]),e=tu(vl,e,a),a=fe,(lt===null?a.memoizedState:lt.next)===null&&(a=a.alternate,H.H=a===null||a.memoizedState===null?Zu:Dc),e}function Sn(e){if(e!==null&&typeof e=="object"){if(typeof e.then=="function")return dr(e);if(e.$$typeof===$)return vt(e)}throw Error(d(438,String(e)))}function yc(e){var a=null,s=fe.updateQueue;if(s!==null&&(a=s.memoCache),a==null){var l=fe.alternate;l!==null&&(l=l.updateQueue,l!==null&&(l=l.memoCache,l!=null&&(a={data:l.data.map(function(r){return r.slice()}),index:0})))}if(a==null&&(a={data:[],index:0}),s===null&&(s=Cn(),fe.updateQueue=s),s.memoCache=a,s=a.data[a.index],s===void 0)for(s=a.data[a.index]=Array(e),l=0;l<e;l++)s[l]=ie;return a.index++,s}function Da(e,a){return typeof a=="function"?a(e):a}function En(e){var a=tt();return jc(a,Le,e)}function jc(e,a,s){var l=e.queue;if(l===null)throw Error(d(311));l.lastRenderedReducer=s;var r=e.baseQueue,n=l.pending;if(n!==null){if(r!==null){var c=r.next;r.next=n.next,n.next=c}a.baseQueue=r=n,l.pending=null}if(n=e.baseState,r===null)e.memoizedState=n;else{a=r.next;var h=c=null,y=null,_=a,B=!1;do{var G=_.lane&-536870913;if(G!==_.lane?(je&G)===G:(Ma&G)===G){var q=_.revertLane;if(q===0)y!==null&&(y=y.next={lane:0,revertLane:0,gesture:null,action:_.action,hasEagerState:_.hasEagerState,eagerState:_.eagerState,next:null}),G===hl&&(B=!0);else if((Ma&q)===q){_=_.next,q===hl&&(B=!0);continue}else G={lane:0,revertLane:_.revertLane,gesture:null,action:_.action,hasEagerState:_.hasEagerState,eagerState:_.eagerState,next:null},y===null?(h=y=G,c=n):y=y.next=G,fe.lanes|=q,ls|=q;G=_.action,Os&&s(n,G),n=_.hasEagerState?_.eagerState:s(n,G)}else q={lane:G,revertLane:_.revertLane,gesture:_.gesture,action:_.action,hasEagerState:_.hasEagerState,eagerState:_.eagerState,next:null},y===null?(h=y=q,c=n):y=y.next=q,fe.lanes|=G,ls|=G;_=_.next}while(_!==null&&_!==a);if(y===null?c=n:y.next=h,!qt(n,e.memoizedState)&&(rt=!0,B&&(s=xl,s!==null)))throw s;e.memoizedState=n,e.baseState=c,e.baseQueue=y,l.lastRenderedState=n}return r===null&&(l.lanes=0),[e.memoizedState,l.dispatch]}function Nc(e){var a=tt(),s=a.queue;if(s===null)throw Error(d(311));s.lastRenderedReducer=e;var l=s.dispatch,r=s.pending,n=a.memoizedState;if(r!==null){s.pending=null;var c=r=r.next;do n=e(n,c.action),c=c.next;while(c!==r);qt(n,a.memoizedState)||(rt=!0),a.memoizedState=n,a.baseQueue===null&&(a.baseState=n),s.lastRenderedState=n}return[n,l]}function mu(e,a,s){var l=fe,r=tt(),n=we;if(n){if(s===void 0)throw Error(d(407));s=s()}else s=a();var c=!qt((Le||r).memoizedState,s);if(c&&(r.memoizedState=s,rt=!0),r=r.queue,Sc(fu.bind(null,l,r,e),[e]),r.getSnapshot!==a||c||lt!==null&&lt.memoizedState.tag&1){if(l.flags|=2048,yl(9,{destroy:void 0},xu.bind(null,l,r,s,a),null),Be===null)throw Error(d(349));n||(Ma&127)!==0||hu(l,a,s)}return s}function hu(e,a,s){e.flags|=16384,e={getSnapshot:a,value:s},a=fe.updateQueue,a===null?(a=Cn(),fe.updateQueue=a,a.stores=[e]):(s=a.stores,s===null?a.stores=[e]:s.push(e))}function xu(e,a,s,l){a.value=s,a.getSnapshot=l,pu(a)&&gu(e)}function fu(e,a,s){return s(function(){pu(a)&&gu(e)})}function pu(e){var a=e.getSnapshot;e=e.value;try{var s=a();return!qt(e,s)}catch{return!0}}function gu(e){var a=zs(e,2);a!==null&&At(a,e,2)}function wc(e){var a=Et();if(typeof e=="function"){var s=e;if(e=s(),Os){da(!0);try{s()}finally{da(!1)}}}return a.memoizedState=a.baseState=e,a.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Da,lastRenderedState:e},a}function bu(e,a,s,l){return e.baseState=s,jc(e,Le,typeof l=="function"?l:Da)}function Zf(e,a,s,l,r){if(Tn(e))throw Error(d(485));if(e=a.action,e!==null){var n={payload:r,action:e,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(c){n.listeners.push(c)}};H.T!==null?s(!0):n.isTransition=!1,l(n),s=a.pending,s===null?(n.next=a.pending=n,vu(a,n)):(n.next=s.next,a.pending=s.next=n)}}function vu(e,a){var s=a.action,l=a.payload,r=e.state;if(a.isTransition){var n=H.T,c={};H.T=c;try{var h=s(r,l),y=H.S;y!==null&&y(c,h),yu(e,a,h)}catch(_){Cc(e,a,_)}finally{n!==null&&c.types!==null&&(n.types=c.types),H.T=n}}else try{n=s(r,l),yu(e,a,n)}catch(_){Cc(e,a,_)}}function yu(e,a,s){s!==null&&typeof s=="object"&&typeof s.then=="function"?s.then(function(l){ju(e,a,l)},function(l){return Cc(e,a,l)}):ju(e,a,s)}function ju(e,a,s){a.status="fulfilled",a.value=s,Nu(a),e.state=s,a=e.pending,a!==null&&(s=a.next,s===a?e.pending=null:(s=s.next,a.next=s,vu(e,s)))}function Cc(e,a,s){var l=e.pending;if(e.pending=null,l!==null){l=l.next;do a.status="rejected",a.reason=s,Nu(a),a=a.next;while(a!==l)}e.action=null}function Nu(e){e=e.listeners;for(var a=0;a<e.length;a++)(0,e[a])()}function wu(e,a){return a}function Cu(e,a){if(we){var s=Be.formState;if(s!==null){e:{var l=fe;if(we){if($e){t:{for(var r=$e,n=Wt;r.nodeType!==8;){if(!n){r=null;break t}if(r=It(r.nextSibling),r===null){r=null;break t}}n=r.data,r=n==="F!"||n==="F"?r:null}if(r){$e=It(r.nextSibling),l=r.data==="F!";break e}}Ja(l)}l=!1}l&&(a=s[0])}}return s=Et(),s.memoizedState=s.baseState=a,l={pending:null,lanes:0,dispatch:null,lastRenderedReducer:wu,lastRenderedState:a},s.queue=l,s=$u.bind(null,fe,l),l.dispatch=s,l=wc(!1),n=Mc.bind(null,fe,!1,l.queue),l=Et(),r={state:a,dispatch:null,action:e,pending:null},l.queue=r,s=Zf.bind(null,fe,r,n,s),r.dispatch=s,l.memoizedState=e,[a,s,!1]}function Su(e){var a=tt();return Eu(a,Le,e)}function Eu(e,a,s){if(a=jc(e,a,wu)[0],e=En(Da)[0],typeof a=="object"&&a!==null&&typeof a.then=="function")try{var l=dr(a)}catch(c){throw c===fl?pn:c}else l=a;a=tt();var r=a.queue,n=r.dispatch;return s!==a.memoizedState&&(fe.flags|=2048,yl(9,{destroy:void 0},Qf.bind(null,r,s),null)),[l,n,e]}function Qf(e,a){e.action=a}function zu(e){var a=tt(),s=Le;if(s!==null)return Eu(a,s,e);tt(),a=a.memoizedState,s=tt();var l=s.queue.dispatch;return s.memoizedState=e,[a,l,!1]}function yl(e,a,s,l){return e={tag:e,create:s,deps:l,inst:a,next:null},a=fe.updateQueue,a===null&&(a=Cn(),fe.updateQueue=a),s=a.lastEffect,s===null?a.lastEffect=e.next=e:(l=s.next,s.next=e,e.next=l,a.lastEffect=e),e}function ku(){return tt().memoizedState}function zn(e,a,s,l){var r=Et();fe.flags|=e,r.memoizedState=yl(1|a,{destroy:void 0},s,l===void 0?null:l)}function kn(e,a,s,l){var r=tt();l=l===void 0?null:l;var n=r.memoizedState.inst;Le!==null&&l!==null&&fc(l,Le.memoizedState.deps)?r.memoizedState=yl(a,n,s,l):(fe.flags|=e,r.memoizedState=yl(1|a,n,s,l))}function Tu(e,a){zn(8390656,8,e,a)}function Sc(e,a){kn(2048,8,e,a)}function Kf(e){fe.flags|=4;var a=fe.updateQueue;if(a===null)a=Cn(),fe.updateQueue=a,a.events=[e];else{var s=a.events;s===null?a.events=[e]:s.push(e)}}function Mu(e){var a=tt().memoizedState;return Kf({ref:a,nextImpl:e}),function(){if((Re&2)!==0)throw Error(d(440));return a.impl.apply(void 0,arguments)}}function Du(e,a){return kn(4,2,e,a)}function _u(e,a){return kn(4,4,e,a)}function Au(e,a){if(typeof a=="function"){e=e();var s=a(e);return function(){typeof s=="function"?s():a(null)}}if(a!=null)return e=e(),a.current=e,function(){a.current=null}}function Ru(e,a,s){s=s!=null?s.concat([e]):null,kn(4,4,Au.bind(null,a,e),s)}function Ec(){}function qu(e,a){var s=tt();a=a===void 0?null:a;var l=s.memoizedState;return a!==null&&fc(a,l[1])?l[0]:(s.memoizedState=[e,a],e)}function Ou(e,a){var s=tt();a=a===void 0?null:a;var l=s.memoizedState;if(a!==null&&fc(a,l[1]))return l[0];if(l=e(),Os){da(!0);try{e()}finally{da(!1)}}return s.memoizedState=[l,a],l}function zc(e,a,s){return s===void 0||(Ma&1073741824)!==0&&(je&261930)===0?e.memoizedState=a:(e.memoizedState=s,e=Lm(),fe.lanes|=e,ls|=e,s)}function Lu(e,a,s,l){return qt(s,a)?s:gl.current!==null?(e=zc(e,s,l),qt(e,a)||(rt=!0),e):(Ma&42)===0||(Ma&1073741824)!==0&&(je&261930)===0?(rt=!0,e.memoizedState=s):(e=Lm(),fe.lanes|=e,ls|=e,a)}function Uu(e,a,s,l,r){var n=K.p;K.p=n!==0&&8>n?n:8;var c=H.T,h={};H.T=h,Mc(e,!1,a,s);try{var y=r(),_=H.S;if(_!==null&&_(h,y),y!==null&&typeof y=="object"&&typeof y.then=="function"){var B=$f(y,l);ur(e,a,B,Yt(e))}else ur(e,a,l,Yt(e))}catch(G){ur(e,a,{then:function(){},status:"rejected",reason:G},Yt())}finally{K.p=n,c!==null&&h.types!==null&&(c.types=h.types),H.T=c}}function Jf(){}function kc(e,a,s,l){if(e.tag!==5)throw Error(d(476));var r=Hu(e).queue;Uu(e,r,a,ne,s===null?Jf:function(){return Bu(e),s(l)})}function Hu(e){var a=e.memoizedState;if(a!==null)return a;a={memoizedState:ne,baseState:ne,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Da,lastRenderedState:ne},next:null};var s={};return a.next={memoizedState:s,baseState:s,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Da,lastRenderedState:s},next:null},e.memoizedState=a,e=e.alternate,e!==null&&(e.memoizedState=a),a}function Bu(e){var a=Hu(e);a.next===null&&(a=e.alternate.memoizedState),ur(e,a.next.queue,{},Yt())}function Tc(){return vt(kr)}function Yu(){return tt().memoizedState}function Vu(){return tt().memoizedState}function Pf(e){for(var a=e.return;a!==null;){switch(a.tag){case 24:case 3:var s=Yt();e=Fa(s);var l=Ia(a,e,s);l!==null&&(At(l,a,s),nr(l,a,s)),a={cache:lc()},e.payload=a;return}a=a.return}}function Wf(e,a,s){var l=Yt();s={lane:l,revertLane:0,gesture:null,action:s,hasEagerState:!1,eagerState:null,next:null},Tn(e)?Xu(a,s):(s=Qi(e,a,s,l),s!==null&&(At(s,e,l),Gu(s,a,l)))}function $u(e,a,s){var l=Yt();ur(e,a,s,l)}function ur(e,a,s,l){var r={lane:l,revertLane:0,gesture:null,action:s,hasEagerState:!1,eagerState:null,next:null};if(Tn(e))Xu(a,r);else{var n=e.alternate;if(e.lanes===0&&(n===null||n.lanes===0)&&(n=a.lastRenderedReducer,n!==null))try{var c=a.lastRenderedState,h=n(c,s);if(r.hasEagerState=!0,r.eagerState=h,qt(h,c))return on(e,a,r,0),Be===null&&cn(),!1}catch{}if(s=Qi(e,a,r,l),s!==null)return At(s,e,l),Gu(s,a,l),!0}return!1}function Mc(e,a,s,l){if(l={lane:2,revertLane:co(),gesture:null,action:l,hasEagerState:!1,eagerState:null,next:null},Tn(e)){if(a)throw Error(d(479))}else a=Qi(e,s,l,2),a!==null&&At(a,e,2)}function Tn(e){var a=e.alternate;return e===fe||a!==null&&a===fe}function Xu(e,a){bl=Nn=!0;var s=e.pending;s===null?a.next=a:(a.next=s.next,s.next=a),e.pending=a}function Gu(e,a,s){if((s&4194048)!==0){var l=a.lanes;l&=e.pendingLanes,s|=l,a.lanes=s,W(e,s)}}var mr={readContext:vt,use:Sn,useCallback:Fe,useContext:Fe,useEffect:Fe,useImperativeHandle:Fe,useLayoutEffect:Fe,useInsertionEffect:Fe,useMemo:Fe,useReducer:Fe,useRef:Fe,useState:Fe,useDebugValue:Fe,useDeferredValue:Fe,useTransition:Fe,useSyncExternalStore:Fe,useId:Fe,useHostTransitionStatus:Fe,useFormState:Fe,useActionState:Fe,useOptimistic:Fe,useMemoCache:Fe,useCacheRefresh:Fe};mr.useEffectEvent=Fe;var Zu={readContext:vt,use:Sn,useCallback:function(e,a){return Et().memoizedState=[e,a===void 0?null:a],e},useContext:vt,useEffect:Tu,useImperativeHandle:function(e,a,s){s=s!=null?s.concat([e]):null,zn(4194308,4,Au.bind(null,a,e),s)},useLayoutEffect:function(e,a){return zn(4194308,4,e,a)},useInsertionEffect:function(e,a){zn(4,2,e,a)},useMemo:function(e,a){var s=Et();a=a===void 0?null:a;var l=e();if(Os){da(!0);try{e()}finally{da(!1)}}return s.memoizedState=[l,a],l},useReducer:function(e,a,s){var l=Et();if(s!==void 0){var r=s(a);if(Os){da(!0);try{s(a)}finally{da(!1)}}}else r=a;return l.memoizedState=l.baseState=r,e={pending:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:r},l.queue=e,e=e.dispatch=Wf.bind(null,fe,e),[l.memoizedState,e]},useRef:function(e){var a=Et();return e={current:e},a.memoizedState=e},useState:function(e){e=wc(e);var a=e.queue,s=$u.bind(null,fe,a);return a.dispatch=s,[e.memoizedState,s]},useDebugValue:Ec,useDeferredValue:function(e,a){var s=Et();return zc(s,e,a)},useTransition:function(){var e=wc(!1);return e=Uu.bind(null,fe,e.queue,!0,!1),Et().memoizedState=e,[!1,e]},useSyncExternalStore:function(e,a,s){var l=fe,r=Et();if(we){if(s===void 0)throw Error(d(407));s=s()}else{if(s=a(),Be===null)throw Error(d(349));(je&127)!==0||hu(l,a,s)}r.memoizedState=s;var n={value:s,getSnapshot:a};return r.queue=n,Tu(fu.bind(null,l,n,e),[e]),l.flags|=2048,yl(9,{destroy:void 0},xu.bind(null,l,n,s,a),null),s},useId:function(){var e=Et(),a=Be.identifierPrefix;if(we){var s=ma,l=ua;s=(l&~(1<<32-St(l)-1)).toString(32)+s,a="_"+a+"R_"+s,s=wn++,0<s&&(a+="H"+s.toString(32)),a+="_"}else s=Xf++,a="_"+a+"r_"+s.toString(32)+"_";return e.memoizedState=a},useHostTransitionStatus:Tc,useFormState:Cu,useActionState:Cu,useOptimistic:function(e){var a=Et();a.memoizedState=a.baseState=e;var s={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return a.queue=s,a=Mc.bind(null,fe,!0,s),s.dispatch=a,[e,a]},useMemoCache:yc,useCacheRefresh:function(){return Et().memoizedState=Pf.bind(null,fe)},useEffectEvent:function(e){var a=Et(),s={impl:e};return a.memoizedState=s,function(){if((Re&2)!==0)throw Error(d(440));return s.impl.apply(void 0,arguments)}}},Dc={readContext:vt,use:Sn,useCallback:qu,useContext:vt,useEffect:Sc,useImperativeHandle:Ru,useInsertionEffect:Du,useLayoutEffect:_u,useMemo:Ou,useReducer:En,useRef:ku,useState:function(){return En(Da)},useDebugValue:Ec,useDeferredValue:function(e,a){var s=tt();return Lu(s,Le.memoizedState,e,a)},useTransition:function(){var e=En(Da)[0],a=tt().memoizedState;return[typeof e=="boolean"?e:dr(e),a]},useSyncExternalStore:mu,useId:Yu,useHostTransitionStatus:Tc,useFormState:Su,useActionState:Su,useOptimistic:function(e,a){var s=tt();return bu(s,Le,e,a)},useMemoCache:yc,useCacheRefresh:Vu};Dc.useEffectEvent=Mu;var Qu={readContext:vt,use:Sn,useCallback:qu,useContext:vt,useEffect:Sc,useImperativeHandle:Ru,useInsertionEffect:Du,useLayoutEffect:_u,useMemo:Ou,useReducer:Nc,useRef:ku,useState:function(){return Nc(Da)},useDebugValue:Ec,useDeferredValue:function(e,a){var s=tt();return Le===null?zc(s,e,a):Lu(s,Le.memoizedState,e,a)},useTransition:function(){var e=Nc(Da)[0],a=tt().memoizedState;return[typeof e=="boolean"?e:dr(e),a]},useSyncExternalStore:mu,useId:Yu,useHostTransitionStatus:Tc,useFormState:zu,useActionState:zu,useOptimistic:function(e,a){var s=tt();return Le!==null?bu(s,Le,e,a):(s.baseState=e,[e,s.queue.dispatch])},useMemoCache:yc,useCacheRefresh:Vu};Qu.useEffectEvent=Mu;function _c(e,a,s,l){a=e.memoizedState,s=s(l,a),s=s==null?a:p({},a,s),e.memoizedState=s,e.lanes===0&&(e.updateQueue.baseState=s)}var Ac={enqueueSetState:function(e,a,s){e=e._reactInternals;var l=Yt(),r=Fa(l);r.payload=a,s!=null&&(r.callback=s),a=Ia(e,r,l),a!==null&&(At(a,e,l),nr(a,e,l))},enqueueReplaceState:function(e,a,s){e=e._reactInternals;var l=Yt(),r=Fa(l);r.tag=1,r.payload=a,s!=null&&(r.callback=s),a=Ia(e,r,l),a!==null&&(At(a,e,l),nr(a,e,l))},enqueueForceUpdate:function(e,a){e=e._reactInternals;var s=Yt(),l=Fa(s);l.tag=2,a!=null&&(l.callback=a),a=Ia(e,l,s),a!==null&&(At(a,e,s),nr(a,e,s))}};function Ku(e,a,s,l,r,n,c){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(l,n,c):a.prototype&&a.prototype.isPureReactComponent?!Fl(s,l)||!Fl(r,n):!0}function Ju(e,a,s,l){e=a.state,typeof a.componentWillReceiveProps=="function"&&a.componentWillReceiveProps(s,l),typeof a.UNSAFE_componentWillReceiveProps=="function"&&a.UNSAFE_componentWillReceiveProps(s,l),a.state!==e&&Ac.enqueueReplaceState(a,a.state,null)}function Ls(e,a){var s=a;if("ref"in a){s={};for(var l in a)l!=="ref"&&(s[l]=a[l])}if(e=e.defaultProps){s===a&&(s=p({},s));for(var r in e)s[r]===void 0&&(s[r]=e[r])}return s}function Pu(e){nn(e)}function Wu(e){console.error(e)}function Fu(e){nn(e)}function Mn(e,a){try{var s=e.onUncaughtError;s(a.value,{componentStack:a.stack})}catch(l){setTimeout(function(){throw l})}}function Iu(e,a,s){try{var l=e.onCaughtError;l(s.value,{componentStack:s.stack,errorBoundary:a.tag===1?a.stateNode:null})}catch(r){setTimeout(function(){throw r})}}function Rc(e,a,s){return s=Fa(s),s.tag=3,s.payload={element:null},s.callback=function(){Mn(e,a)},s}function em(e){return e=Fa(e),e.tag=3,e}function tm(e,a,s,l){var r=s.type.getDerivedStateFromError;if(typeof r=="function"){var n=l.value;e.payload=function(){return r(n)},e.callback=function(){Iu(a,s,l)}}var c=s.stateNode;c!==null&&typeof c.componentDidCatch=="function"&&(e.callback=function(){Iu(a,s,l),typeof r!="function"&&(rs===null?rs=new Set([this]):rs.add(this));var h=l.stack;this.componentDidCatch(l.value,{componentStack:h!==null?h:""})})}function Ff(e,a,s,l,r){if(s.flags|=32768,l!==null&&typeof l=="object"&&typeof l.then=="function"){if(a=s.alternate,a!==null&&ml(a,s,r,!0),s=Lt.current,s!==null){switch(s.tag){case 31:case 13:return Ft===null?Vn():s.alternate===null&&Ie===0&&(Ie=3),s.flags&=-257,s.flags|=65536,s.lanes=r,l===gn?s.flags|=16384:(a=s.updateQueue,a===null?s.updateQueue=new Set([l]):a.add(l),ro(e,l,r)),!1;case 22:return s.flags|=65536,l===gn?s.flags|=16384:(a=s.updateQueue,a===null?(a={transitions:null,markerInstances:null,retryQueue:new Set([l])},s.updateQueue=a):(s=a.retryQueue,s===null?a.retryQueue=new Set([l]):s.add(l)),ro(e,l,r)),!1}throw Error(d(435,s.tag))}return ro(e,l,r),Vn(),!1}if(we)return a=Lt.current,a!==null?((a.flags&65536)===0&&(a.flags|=256),a.flags|=65536,a.lanes=r,l!==Ii&&(e=Error(d(422),{cause:l}),tr(Kt(e,s)))):(l!==Ii&&(a=Error(d(423),{cause:l}),tr(Kt(a,s))),e=e.current.alternate,e.flags|=65536,r&=-r,e.lanes|=r,l=Kt(l,s),r=Rc(e.stateNode,l,r),dc(e,r),Ie!==4&&(Ie=2)),!1;var n=Error(d(520),{cause:l});if(n=Kt(n,s),yr===null?yr=[n]:yr.push(n),Ie!==4&&(Ie=2),a===null)return!0;l=Kt(l,s),s=a;do{switch(s.tag){case 3:return s.flags|=65536,e=r&-r,s.lanes|=e,e=Rc(s.stateNode,l,e),dc(s,e),!1;case 1:if(a=s.type,n=s.stateNode,(s.flags&128)===0&&(typeof a.getDerivedStateFromError=="function"||n!==null&&typeof n.componentDidCatch=="function"&&(rs===null||!rs.has(n))))return s.flags|=65536,r&=-r,s.lanes|=r,r=em(r),tm(r,e,s,l),dc(s,r),!1}s=s.return}while(s!==null);return!1}var qc=Error(d(461)),rt=!1;function yt(e,a,s,l){a.child=e===null?ru(a,null,s,l):qs(a,e.child,s,l)}function am(e,a,s,l,r){s=s.render;var n=a.ref;if("ref"in l){var c={};for(var h in l)h!=="ref"&&(c[h]=l[h])}else c=l;return Ds(a),l=pc(e,a,s,c,n,r),h=gc(),e!==null&&!rt?(bc(e,a,r),_a(e,a,r)):(we&&h&&Wi(a),a.flags|=1,yt(e,a,l,r),a.child)}function sm(e,a,s,l,r){if(e===null){var n=s.type;return typeof n=="function"&&!Ki(n)&&n.defaultProps===void 0&&s.compare===null?(a.tag=15,a.type=n,lm(e,a,n,l,r)):(e=un(s.type,null,l,a,a.mode,r),e.ref=a.ref,e.return=a,a.child=e)}if(n=e.child,!$c(e,r)){var c=n.memoizedProps;if(s=s.compare,s=s!==null?s:Fl,s(c,l)&&e.ref===a.ref)return _a(e,a,r)}return a.flags|=1,e=Ea(n,l),e.ref=a.ref,e.return=a,a.child=e}function lm(e,a,s,l,r){if(e!==null){var n=e.memoizedProps;if(Fl(n,l)&&e.ref===a.ref)if(rt=!1,a.pendingProps=l=n,$c(e,r))(e.flags&131072)!==0&&(rt=!0);else return a.lanes=e.lanes,_a(e,a,r)}return Oc(e,a,s,l,r)}function rm(e,a,s,l){var r=l.children,n=e!==null?e.memoizedState:null;if(e===null&&a.stateNode===null&&(a.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),l.mode==="hidden"){if((a.flags&128)!==0){if(n=n!==null?n.baseLanes|s:s,e!==null){for(l=a.child=e.child,r=0;l!==null;)r=r|l.lanes|l.childLanes,l=l.sibling;l=r&~n}else l=0,a.child=null;return nm(e,a,n,s,l)}if((s&536870912)!==0)a.memoizedState={baseLanes:0,cachePool:null},e!==null&&fn(a,n!==null?n.cachePool:null),n!==null?cu(a,n):mc(),ou(a);else return l=a.lanes=536870912,nm(e,a,n!==null?n.baseLanes|s:s,s,l)}else n!==null?(fn(a,n.cachePool),cu(a,n),ts(),a.memoizedState=null):(e!==null&&fn(a,null),mc(),ts());return yt(e,a,r,s),a.child}function hr(e,a){return e!==null&&e.tag===22||a.stateNode!==null||(a.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),a.sibling}function nm(e,a,s,l,r){var n=nc();return n=n===null?null:{parent:st._currentValue,pool:n},a.memoizedState={baseLanes:s,cachePool:n},e!==null&&fn(a,null),mc(),ou(a),e!==null&&ml(e,a,l,!0),a.childLanes=r,null}function Dn(e,a){return a=An({mode:a.mode,children:a.children},e.mode),a.ref=e.ref,e.child=a,a.return=e,a}function im(e,a,s){return qs(a,e.child,null,s),e=Dn(a,a.pendingProps),e.flags|=2,Ut(a),a.memoizedState=null,e}function If(e,a,s){var l=a.pendingProps,r=(a.flags&128)!==0;if(a.flags&=-129,e===null){if(we){if(l.mode==="hidden")return e=Dn(a,l),a.lanes=536870912,hr(null,e);if(xc(a),(e=$e)?(e=vh(e,Wt),e=e!==null&&e.data==="&"?e:null,e!==null&&(a.memoizedState={dehydrated:e,treeContext:Qa!==null?{id:ua,overflow:ma}:null,retryLane:536870912,hydrationErrors:null},s=Xd(e),s.return=a,a.child=s,bt=a,$e=null)):e=null,e===null)throw Ja(a);return a.lanes=536870912,null}return Dn(a,l)}var n=e.memoizedState;if(n!==null){var c=n.dehydrated;if(xc(a),r)if(a.flags&256)a.flags&=-257,a=im(e,a,s);else if(a.memoizedState!==null)a.child=e.child,a.flags|=128,a=null;else throw Error(d(558));else if(rt||ml(e,a,s,!1),r=(s&e.childLanes)!==0,rt||r){if(l=Be,l!==null&&(c=ce(l,s),c!==0&&c!==n.retryLane))throw n.retryLane=c,zs(e,c),At(l,e,c),qc;Vn(),a=im(e,a,s)}else e=n.treeContext,$e=It(c.nextSibling),bt=a,we=!0,Ka=null,Wt=!1,e!==null&&Qd(a,e),a=Dn(a,l),a.flags|=4096;return a}return e=Ea(e.child,{mode:l.mode,children:l.children}),e.ref=a.ref,a.child=e,e.return=a,e}function _n(e,a){var s=a.ref;if(s===null)e!==null&&e.ref!==null&&(a.flags|=4194816);else{if(typeof s!="function"&&typeof s!="object")throw Error(d(284));(e===null||e.ref!==s)&&(a.flags|=4194816)}}function Oc(e,a,s,l,r){return Ds(a),s=pc(e,a,s,l,void 0,r),l=gc(),e!==null&&!rt?(bc(e,a,r),_a(e,a,r)):(we&&l&&Wi(a),a.flags|=1,yt(e,a,s,r),a.child)}function cm(e,a,s,l,r,n){return Ds(a),a.updateQueue=null,s=uu(a,l,s,r),du(e),l=gc(),e!==null&&!rt?(bc(e,a,n),_a(e,a,n)):(we&&l&&Wi(a),a.flags|=1,yt(e,a,s,n),a.child)}function om(e,a,s,l,r){if(Ds(a),a.stateNode===null){var n=cl,c=s.contextType;typeof c=="object"&&c!==null&&(n=vt(c)),n=new s(l,n),a.memoizedState=n.state!==null&&n.state!==void 0?n.state:null,n.updater=Ac,a.stateNode=n,n._reactInternals=a,n=a.stateNode,n.props=l,n.state=a.memoizedState,n.refs={},cc(a),c=s.contextType,n.context=typeof c=="object"&&c!==null?vt(c):cl,n.state=a.memoizedState,c=s.getDerivedStateFromProps,typeof c=="function"&&(_c(a,s,c,l),n.state=a.memoizedState),typeof s.getDerivedStateFromProps=="function"||typeof n.getSnapshotBeforeUpdate=="function"||typeof n.UNSAFE_componentWillMount!="function"&&typeof n.componentWillMount!="function"||(c=n.state,typeof n.componentWillMount=="function"&&n.componentWillMount(),typeof n.UNSAFE_componentWillMount=="function"&&n.UNSAFE_componentWillMount(),c!==n.state&&Ac.enqueueReplaceState(n,n.state,null),cr(a,l,n,r),ir(),n.state=a.memoizedState),typeof n.componentDidMount=="function"&&(a.flags|=4194308),l=!0}else if(e===null){n=a.stateNode;var h=a.memoizedProps,y=Ls(s,h);n.props=y;var _=n.context,B=s.contextType;c=cl,typeof B=="object"&&B!==null&&(c=vt(B));var G=s.getDerivedStateFromProps;B=typeof G=="function"||typeof n.getSnapshotBeforeUpdate=="function",h=a.pendingProps!==h,B||typeof n.UNSAFE_componentWillReceiveProps!="function"&&typeof n.componentWillReceiveProps!="function"||(h||_!==c)&&Ju(a,n,l,c),Wa=!1;var q=a.memoizedState;n.state=q,cr(a,l,n,r),ir(),_=a.memoizedState,h||q!==_||Wa?(typeof G=="function"&&(_c(a,s,G,l),_=a.memoizedState),(y=Wa||Ku(a,s,y,l,q,_,c))?(B||typeof n.UNSAFE_componentWillMount!="function"&&typeof n.componentWillMount!="function"||(typeof n.componentWillMount=="function"&&n.componentWillMount(),typeof n.UNSAFE_componentWillMount=="function"&&n.UNSAFE_componentWillMount()),typeof n.componentDidMount=="function"&&(a.flags|=4194308)):(typeof n.componentDidMount=="function"&&(a.flags|=4194308),a.memoizedProps=l,a.memoizedState=_),n.props=l,n.state=_,n.context=c,l=y):(typeof n.componentDidMount=="function"&&(a.flags|=4194308),l=!1)}else{n=a.stateNode,oc(e,a),c=a.memoizedProps,B=Ls(s,c),n.props=B,G=a.pendingProps,q=n.context,_=s.contextType,y=cl,typeof _=="object"&&_!==null&&(y=vt(_)),h=s.getDerivedStateFromProps,(_=typeof h=="function"||typeof n.getSnapshotBeforeUpdate=="function")||typeof n.UNSAFE_componentWillReceiveProps!="function"&&typeof n.componentWillReceiveProps!="function"||(c!==G||q!==y)&&Ju(a,n,l,y),Wa=!1,q=a.memoizedState,n.state=q,cr(a,l,n,r),ir();var U=a.memoizedState;c!==G||q!==U||Wa||e!==null&&e.dependencies!==null&&hn(e.dependencies)?(typeof h=="function"&&(_c(a,s,h,l),U=a.memoizedState),(B=Wa||Ku(a,s,B,l,q,U,y)||e!==null&&e.dependencies!==null&&hn(e.dependencies))?(_||typeof n.UNSAFE_componentWillUpdate!="function"&&typeof n.componentWillUpdate!="function"||(typeof n.componentWillUpdate=="function"&&n.componentWillUpdate(l,U,y),typeof n.UNSAFE_componentWillUpdate=="function"&&n.UNSAFE_componentWillUpdate(l,U,y)),typeof n.componentDidUpdate=="function"&&(a.flags|=4),typeof n.getSnapshotBeforeUpdate=="function"&&(a.flags|=1024)):(typeof n.componentDidUpdate!="function"||c===e.memoizedProps&&q===e.memoizedState||(a.flags|=4),typeof n.getSnapshotBeforeUpdate!="function"||c===e.memoizedProps&&q===e.memoizedState||(a.flags|=1024),a.memoizedProps=l,a.memoizedState=U),n.props=l,n.state=U,n.context=y,l=B):(typeof n.componentDidUpdate!="function"||c===e.memoizedProps&&q===e.memoizedState||(a.flags|=4),typeof n.getSnapshotBeforeUpdate!="function"||c===e.memoizedProps&&q===e.memoizedState||(a.flags|=1024),l=!1)}return n=l,_n(e,a),l=(a.flags&128)!==0,n||l?(n=a.stateNode,s=l&&typeof s.getDerivedStateFromError!="function"?null:n.render(),a.flags|=1,e!==null&&l?(a.child=qs(a,e.child,null,r),a.child=qs(a,null,s,r)):yt(e,a,s,r),a.memoizedState=n.state,e=a.child):e=_a(e,a,r),e}function dm(e,a,s,l){return Ts(),a.flags|=256,yt(e,a,s,l),a.child}var Lc={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function Uc(e){return{baseLanes:e,cachePool:Id()}}function Hc(e,a,s){return e=e!==null?e.childLanes&~s:0,a&&(e|=Bt),e}function um(e,a,s){var l=a.pendingProps,r=!1,n=(a.flags&128)!==0,c;if((c=n)||(c=e!==null&&e.memoizedState===null?!1:(et.current&2)!==0),c&&(r=!0,a.flags&=-129),c=(a.flags&32)!==0,a.flags&=-33,e===null){if(we){if(r?es(a):ts(),(e=$e)?(e=vh(e,Wt),e=e!==null&&e.data!=="&"?e:null,e!==null&&(a.memoizedState={dehydrated:e,treeContext:Qa!==null?{id:ua,overflow:ma}:null,retryLane:536870912,hydrationErrors:null},s=Xd(e),s.return=a,a.child=s,bt=a,$e=null)):e=null,e===null)throw Ja(a);return No(e)?a.lanes=32:a.lanes=536870912,null}var h=l.children;return l=l.fallback,r?(ts(),r=a.mode,h=An({mode:"hidden",children:h},r),l=ks(l,r,s,null),h.return=a,l.return=a,h.sibling=l,a.child=h,l=a.child,l.memoizedState=Uc(s),l.childLanes=Hc(e,c,s),a.memoizedState=Lc,hr(null,l)):(es(a),Bc(a,h))}var y=e.memoizedState;if(y!==null&&(h=y.dehydrated,h!==null)){if(n)a.flags&256?(es(a),a.flags&=-257,a=Yc(e,a,s)):a.memoizedState!==null?(ts(),a.child=e.child,a.flags|=128,a=null):(ts(),h=l.fallback,r=a.mode,l=An({mode:"visible",children:l.children},r),h=ks(h,r,s,null),h.flags|=2,l.return=a,h.return=a,l.sibling=h,a.child=l,qs(a,e.child,null,s),l=a.child,l.memoizedState=Uc(s),l.childLanes=Hc(e,c,s),a.memoizedState=Lc,a=hr(null,l));else if(es(a),No(h)){if(c=h.nextSibling&&h.nextSibling.dataset,c)var _=c.dgst;c=_,l=Error(d(419)),l.stack="",l.digest=c,tr({value:l,source:null,stack:null}),a=Yc(e,a,s)}else if(rt||ml(e,a,s,!1),c=(s&e.childLanes)!==0,rt||c){if(c=Be,c!==null&&(l=ce(c,s),l!==0&&l!==y.retryLane))throw y.retryLane=l,zs(e,l),At(c,e,l),qc;jo(h)||Vn(),a=Yc(e,a,s)}else jo(h)?(a.flags|=192,a.child=e.child,a=null):(e=y.treeContext,$e=It(h.nextSibling),bt=a,we=!0,Ka=null,Wt=!1,e!==null&&Qd(a,e),a=Bc(a,l.children),a.flags|=4096);return a}return r?(ts(),h=l.fallback,r=a.mode,y=e.child,_=y.sibling,l=Ea(y,{mode:"hidden",children:l.children}),l.subtreeFlags=y.subtreeFlags&65011712,_!==null?h=Ea(_,h):(h=ks(h,r,s,null),h.flags|=2),h.return=a,l.return=a,l.sibling=h,a.child=l,hr(null,l),l=a.child,h=e.child.memoizedState,h===null?h=Uc(s):(r=h.cachePool,r!==null?(y=st._currentValue,r=r.parent!==y?{parent:y,pool:y}:r):r=Id(),h={baseLanes:h.baseLanes|s,cachePool:r}),l.memoizedState=h,l.childLanes=Hc(e,c,s),a.memoizedState=Lc,hr(e.child,l)):(es(a),s=e.child,e=s.sibling,s=Ea(s,{mode:"visible",children:l.children}),s.return=a,s.sibling=null,e!==null&&(c=a.deletions,c===null?(a.deletions=[e],a.flags|=16):c.push(e)),a.child=s,a.memoizedState=null,s)}function Bc(e,a){return a=An({mode:"visible",children:a},e.mode),a.return=e,e.child=a}function An(e,a){return e=Ot(22,e,null,a),e.lanes=0,e}function Yc(e,a,s){return qs(a,e.child,null,s),e=Bc(a,a.pendingProps.children),e.flags|=2,a.memoizedState=null,e}function mm(e,a,s){e.lanes|=a;var l=e.alternate;l!==null&&(l.lanes|=a),ac(e.return,a,s)}function Vc(e,a,s,l,r,n){var c=e.memoizedState;c===null?e.memoizedState={isBackwards:a,rendering:null,renderingStartTime:0,last:l,tail:s,tailMode:r,treeForkCount:n}:(c.isBackwards=a,c.rendering=null,c.renderingStartTime=0,c.last=l,c.tail=s,c.tailMode=r,c.treeForkCount=n)}function hm(e,a,s){var l=a.pendingProps,r=l.revealOrder,n=l.tail;l=l.children;var c=et.current,h=(c&2)!==0;if(h?(c=c&1|2,a.flags|=128):c&=1,J(et,c),yt(e,a,l,s),l=we?er:0,!h&&e!==null&&(e.flags&128)!==0)e:for(e=a.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&mm(e,s,a);else if(e.tag===19)mm(e,s,a);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===a)break e;for(;e.sibling===null;){if(e.return===null||e.return===a)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}switch(r){case"forwards":for(s=a.child,r=null;s!==null;)e=s.alternate,e!==null&&jn(e)===null&&(r=s),s=s.sibling;s=r,s===null?(r=a.child,a.child=null):(r=s.sibling,s.sibling=null),Vc(a,!1,r,s,n,l);break;case"backwards":case"unstable_legacy-backwards":for(s=null,r=a.child,a.child=null;r!==null;){if(e=r.alternate,e!==null&&jn(e)===null){a.child=r;break}e=r.sibling,r.sibling=s,s=r,r=e}Vc(a,!0,s,null,n,l);break;case"together":Vc(a,!1,null,null,void 0,l);break;default:a.memoizedState=null}return a.child}function _a(e,a,s){if(e!==null&&(a.dependencies=e.dependencies),ls|=a.lanes,(s&a.childLanes)===0)if(e!==null){if(ml(e,a,s,!1),(s&a.childLanes)===0)return null}else return null;if(e!==null&&a.child!==e.child)throw Error(d(153));if(a.child!==null){for(e=a.child,s=Ea(e,e.pendingProps),a.child=s,s.return=a;e.sibling!==null;)e=e.sibling,s=s.sibling=Ea(e,e.pendingProps),s.return=a;s.sibling=null}return a.child}function $c(e,a){return(e.lanes&a)!==0?!0:(e=e.dependencies,!!(e!==null&&hn(e)))}function e0(e,a,s){switch(a.tag){case 3:ot(a,a.stateNode.containerInfo),Pa(a,st,e.memoizedState.cache),Ts();break;case 27:case 5:ga(a);break;case 4:ot(a,a.stateNode.containerInfo);break;case 10:Pa(a,a.type,a.memoizedProps.value);break;case 31:if(a.memoizedState!==null)return a.flags|=128,xc(a),null;break;case 13:var l=a.memoizedState;if(l!==null)return l.dehydrated!==null?(es(a),a.flags|=128,null):(s&a.child.childLanes)!==0?um(e,a,s):(es(a),e=_a(e,a,s),e!==null?e.sibling:null);es(a);break;case 19:var r=(e.flags&128)!==0;if(l=(s&a.childLanes)!==0,l||(ml(e,a,s,!1),l=(s&a.childLanes)!==0),r){if(l)return hm(e,a,s);a.flags|=128}if(r=a.memoizedState,r!==null&&(r.rendering=null,r.tail=null,r.lastEffect=null),J(et,et.current),l)break;return null;case 22:return a.lanes=0,rm(e,a,s,a.pendingProps);case 24:Pa(a,st,e.memoizedState.cache)}return _a(e,a,s)}function xm(e,a,s){if(e!==null)if(e.memoizedProps!==a.pendingProps)rt=!0;else{if(!$c(e,s)&&(a.flags&128)===0)return rt=!1,e0(e,a,s);rt=(e.flags&131072)!==0}else rt=!1,we&&(a.flags&1048576)!==0&&Zd(a,er,a.index);switch(a.lanes=0,a.tag){case 16:e:{var l=a.pendingProps;if(e=As(a.elementType),a.type=e,typeof e=="function")Ki(e)?(l=Ls(e,l),a.tag=1,a=om(null,a,e,l,s)):(a.tag=0,a=Oc(null,a,e,l,s));else{if(e!=null){var r=e.$$typeof;if(r===Y){a.tag=11,a=am(null,a,e,l,s);break e}else if(r===F){a.tag=14,a=sm(null,a,e,l,s);break e}}throw a=Nt(e)||e,Error(d(306,a,""))}}return a;case 0:return Oc(e,a,a.type,a.pendingProps,s);case 1:return l=a.type,r=Ls(l,a.pendingProps),om(e,a,l,r,s);case 3:e:{if(ot(a,a.stateNode.containerInfo),e===null)throw Error(d(387));l=a.pendingProps;var n=a.memoizedState;r=n.element,oc(e,a),cr(a,l,null,s);var c=a.memoizedState;if(l=c.cache,Pa(a,st,l),l!==n.cache&&sc(a,[st],s,!0),ir(),l=c.element,n.isDehydrated)if(n={element:l,isDehydrated:!1,cache:c.cache},a.updateQueue.baseState=n,a.memoizedState=n,a.flags&256){a=dm(e,a,l,s);break e}else if(l!==r){r=Kt(Error(d(424)),a),tr(r),a=dm(e,a,l,s);break e}else for(e=a.stateNode.containerInfo,e.nodeType===9?e=e.body:e=e.nodeName==="HTML"?e.ownerDocument.body:e,$e=It(e.firstChild),bt=a,we=!0,Ka=null,Wt=!0,s=ru(a,null,l,s),a.child=s;s;)s.flags=s.flags&-3|4096,s=s.sibling;else{if(Ts(),l===r){a=_a(e,a,s);break e}yt(e,a,l,s)}a=a.child}return a;case 26:return _n(e,a),e===null?(s=Sh(a.type,null,a.pendingProps,null))?a.memoizedState=s:we||(s=a.type,e=a.pendingProps,l=Jn(xe.current).createElement(s),l[Pe]=a,l[We]=e,jt(l,s,e),ht(l),a.stateNode=l):a.memoizedState=Sh(a.type,e.memoizedProps,a.pendingProps,e.memoizedState),null;case 27:return ga(a),e===null&&we&&(l=a.stateNode=Nh(a.type,a.pendingProps,xe.current),bt=a,Wt=!0,r=$e,os(a.type)?(wo=r,$e=It(l.firstChild)):$e=r),yt(e,a,a.pendingProps.children,s),_n(e,a),e===null&&(a.flags|=4194304),a.child;case 5:return e===null&&we&&((r=l=$e)&&(l=M0(l,a.type,a.pendingProps,Wt),l!==null?(a.stateNode=l,bt=a,$e=It(l.firstChild),Wt=!1,r=!0):r=!1),r||Ja(a)),ga(a),r=a.type,n=a.pendingProps,c=e!==null?e.memoizedProps:null,l=n.children,bo(r,n)?l=null:c!==null&&bo(r,c)&&(a.flags|=32),a.memoizedState!==null&&(r=pc(e,a,Gf,null,null,s),kr._currentValue=r),_n(e,a),yt(e,a,l,s),a.child;case 6:return e===null&&we&&((e=s=$e)&&(s=D0(s,a.pendingProps,Wt),s!==null?(a.stateNode=s,bt=a,$e=null,e=!0):e=!1),e||Ja(a)),null;case 13:return um(e,a,s);case 4:return ot(a,a.stateNode.containerInfo),l=a.pendingProps,e===null?a.child=qs(a,null,l,s):yt(e,a,l,s),a.child;case 11:return am(e,a,a.type,a.pendingProps,s);case 7:return yt(e,a,a.pendingProps,s),a.child;case 8:return yt(e,a,a.pendingProps.children,s),a.child;case 12:return yt(e,a,a.pendingProps.children,s),a.child;case 10:return l=a.pendingProps,Pa(a,a.type,l.value),yt(e,a,l.children,s),a.child;case 9:return r=a.type._context,l=a.pendingProps.children,Ds(a),r=vt(r),l=l(r),a.flags|=1,yt(e,a,l,s),a.child;case 14:return sm(e,a,a.type,a.pendingProps,s);case 15:return lm(e,a,a.type,a.pendingProps,s);case 19:return hm(e,a,s);case 31:return If(e,a,s);case 22:return rm(e,a,s,a.pendingProps);case 24:return Ds(a),l=vt(st),e===null?(r=nc(),r===null&&(r=Be,n=lc(),r.pooledCache=n,n.refCount++,n!==null&&(r.pooledCacheLanes|=s),r=n),a.memoizedState={parent:l,cache:r},cc(a),Pa(a,st,r)):((e.lanes&s)!==0&&(oc(e,a),cr(a,null,null,s),ir()),r=e.memoizedState,n=a.memoizedState,r.parent!==l?(r={parent:l,cache:l},a.memoizedState=r,a.lanes===0&&(a.memoizedState=a.updateQueue.baseState=r),Pa(a,st,l)):(l=n.cache,Pa(a,st,l),l!==r.cache&&sc(a,[st],s,!0))),yt(e,a,a.pendingProps.children,s),a.child;case 29:throw a.pendingProps}throw Error(d(156,a.tag))}function Aa(e){e.flags|=4}function Xc(e,a,s,l,r){if((a=(e.mode&32)!==0)&&(a=!1),a){if(e.flags|=16777216,(r&335544128)===r)if(e.stateNode.complete)e.flags|=8192;else if(Ym())e.flags|=8192;else throw Rs=gn,ic}else e.flags&=-16777217}function fm(e,a){if(a.type!=="stylesheet"||(a.state.loading&4)!==0)e.flags&=-16777217;else if(e.flags|=16777216,!Mh(a))if(Ym())e.flags|=8192;else throw Rs=gn,ic}function Rn(e,a){a!==null&&(e.flags|=4),e.flags&16384&&(a=e.tag!==22?Kr():536870912,e.lanes|=a,Cl|=a)}function xr(e,a){if(!we)switch(e.tailMode){case"hidden":a=e.tail;for(var s=null;a!==null;)a.alternate!==null&&(s=a),a=a.sibling;s===null?e.tail=null:s.sibling=null;break;case"collapsed":s=e.tail;for(var l=null;s!==null;)s.alternate!==null&&(l=s),s=s.sibling;l===null?a||e.tail===null?e.tail=null:e.tail.sibling=null:l.sibling=null}}function Xe(e){var a=e.alternate!==null&&e.alternate.child===e.child,s=0,l=0;if(a)for(var r=e.child;r!==null;)s|=r.lanes|r.childLanes,l|=r.subtreeFlags&65011712,l|=r.flags&65011712,r.return=e,r=r.sibling;else for(r=e.child;r!==null;)s|=r.lanes|r.childLanes,l|=r.subtreeFlags,l|=r.flags,r.return=e,r=r.sibling;return e.subtreeFlags|=l,e.childLanes=s,a}function t0(e,a,s){var l=a.pendingProps;switch(Fi(a),a.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Xe(a),null;case 1:return Xe(a),null;case 3:return s=a.stateNode,l=null,e!==null&&(l=e.memoizedState.cache),a.memoizedState.cache!==l&&(a.flags|=2048),Ta(st),Ve(),s.pendingContext&&(s.context=s.pendingContext,s.pendingContext=null),(e===null||e.child===null)&&(ul(a)?Aa(a):e===null||e.memoizedState.isDehydrated&&(a.flags&256)===0||(a.flags|=1024,ec())),Xe(a),null;case 26:var r=a.type,n=a.memoizedState;return e===null?(Aa(a),n!==null?(Xe(a),fm(a,n)):(Xe(a),Xc(a,r,null,l,s))):n?n!==e.memoizedState?(Aa(a),Xe(a),fm(a,n)):(Xe(a),a.flags&=-16777217):(e=e.memoizedProps,e!==l&&Aa(a),Xe(a),Xc(a,r,e,l,s)),null;case 27:if(ba(a),s=xe.current,r=a.type,e!==null&&a.stateNode!=null)e.memoizedProps!==l&&Aa(a);else{if(!l){if(a.stateNode===null)throw Error(d(166));return Xe(a),null}e=I.current,ul(a)?Kd(a):(e=Nh(r,l,s),a.stateNode=e,Aa(a))}return Xe(a),null;case 5:if(ba(a),r=a.type,e!==null&&a.stateNode!=null)e.memoizedProps!==l&&Aa(a);else{if(!l){if(a.stateNode===null)throw Error(d(166));return Xe(a),null}if(n=I.current,ul(a))Kd(a);else{var c=Jn(xe.current);switch(n){case 1:n=c.createElementNS("http://www.w3.org/2000/svg",r);break;case 2:n=c.createElementNS("http://www.w3.org/1998/Math/MathML",r);break;default:switch(r){case"svg":n=c.createElementNS("http://www.w3.org/2000/svg",r);break;case"math":n=c.createElementNS("http://www.w3.org/1998/Math/MathML",r);break;case"script":n=c.createElement("div"),n.innerHTML="<script><\/script>",n=n.removeChild(n.firstChild);break;case"select":n=typeof l.is=="string"?c.createElement("select",{is:l.is}):c.createElement("select"),l.multiple?n.multiple=!0:l.size&&(n.size=l.size);break;default:n=typeof l.is=="string"?c.createElement(r,{is:l.is}):c.createElement(r)}}n[Pe]=a,n[We]=l;e:for(c=a.child;c!==null;){if(c.tag===5||c.tag===6)n.appendChild(c.stateNode);else if(c.tag!==4&&c.tag!==27&&c.child!==null){c.child.return=c,c=c.child;continue}if(c===a)break e;for(;c.sibling===null;){if(c.return===null||c.return===a)break e;c=c.return}c.sibling.return=c.return,c=c.sibling}a.stateNode=n;e:switch(jt(n,r,l),r){case"button":case"input":case"select":case"textarea":l=!!l.autoFocus;break e;case"img":l=!0;break e;default:l=!1}l&&Aa(a)}}return Xe(a),Xc(a,a.type,e===null?null:e.memoizedProps,a.pendingProps,s),null;case 6:if(e&&a.stateNode!=null)e.memoizedProps!==l&&Aa(a);else{if(typeof l!="string"&&a.stateNode===null)throw Error(d(166));if(e=xe.current,ul(a)){if(e=a.stateNode,s=a.memoizedProps,l=null,r=bt,r!==null)switch(r.tag){case 27:case 5:l=r.memoizedProps}e[Pe]=a,e=!!(e.nodeValue===s||l!==null&&l.suppressHydrationWarning===!0||uh(e.nodeValue,s)),e||Ja(a,!0)}else e=Jn(e).createTextNode(l),e[Pe]=a,a.stateNode=e}return Xe(a),null;case 31:if(s=a.memoizedState,e===null||e.memoizedState!==null){if(l=ul(a),s!==null){if(e===null){if(!l)throw Error(d(318));if(e=a.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(d(557));e[Pe]=a}else Ts(),(a.flags&128)===0&&(a.memoizedState=null),a.flags|=4;Xe(a),e=!1}else s=ec(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=s),e=!0;if(!e)return a.flags&256?(Ut(a),a):(Ut(a),null);if((a.flags&128)!==0)throw Error(d(558))}return Xe(a),null;case 13:if(l=a.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(r=ul(a),l!==null&&l.dehydrated!==null){if(e===null){if(!r)throw Error(d(318));if(r=a.memoizedState,r=r!==null?r.dehydrated:null,!r)throw Error(d(317));r[Pe]=a}else Ts(),(a.flags&128)===0&&(a.memoizedState=null),a.flags|=4;Xe(a),r=!1}else r=ec(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=r),r=!0;if(!r)return a.flags&256?(Ut(a),a):(Ut(a),null)}return Ut(a),(a.flags&128)!==0?(a.lanes=s,a):(s=l!==null,e=e!==null&&e.memoizedState!==null,s&&(l=a.child,r=null,l.alternate!==null&&l.alternate.memoizedState!==null&&l.alternate.memoizedState.cachePool!==null&&(r=l.alternate.memoizedState.cachePool.pool),n=null,l.memoizedState!==null&&l.memoizedState.cachePool!==null&&(n=l.memoizedState.cachePool.pool),n!==r&&(l.flags|=2048)),s!==e&&s&&(a.child.flags|=8192),Rn(a,a.updateQueue),Xe(a),null);case 4:return Ve(),e===null&&ho(a.stateNode.containerInfo),Xe(a),null;case 10:return Ta(a.type),Xe(a),null;case 19:if(X(et),l=a.memoizedState,l===null)return Xe(a),null;if(r=(a.flags&128)!==0,n=l.rendering,n===null)if(r)xr(l,!1);else{if(Ie!==0||e!==null&&(e.flags&128)!==0)for(e=a.child;e!==null;){if(n=jn(e),n!==null){for(a.flags|=128,xr(l,!1),e=n.updateQueue,a.updateQueue=e,Rn(a,e),a.subtreeFlags=0,e=s,s=a.child;s!==null;)$d(s,e),s=s.sibling;return J(et,et.current&1|2),we&&za(a,l.treeForkCount),a.child}e=e.sibling}l.tail!==null&&Ct()>Hn&&(a.flags|=128,r=!0,xr(l,!1),a.lanes=4194304)}else{if(!r)if(e=jn(n),e!==null){if(a.flags|=128,r=!0,e=e.updateQueue,a.updateQueue=e,Rn(a,e),xr(l,!0),l.tail===null&&l.tailMode==="hidden"&&!n.alternate&&!we)return Xe(a),null}else 2*Ct()-l.renderingStartTime>Hn&&s!==536870912&&(a.flags|=128,r=!0,xr(l,!1),a.lanes=4194304);l.isBackwards?(n.sibling=a.child,a.child=n):(e=l.last,e!==null?e.sibling=n:a.child=n,l.last=n)}return l.tail!==null?(e=l.tail,l.rendering=e,l.tail=e.sibling,l.renderingStartTime=Ct(),e.sibling=null,s=et.current,J(et,r?s&1|2:s&1),we&&za(a,l.treeForkCount),e):(Xe(a),null);case 22:case 23:return Ut(a),hc(),l=a.memoizedState!==null,e!==null?e.memoizedState!==null!==l&&(a.flags|=8192):l&&(a.flags|=8192),l?(s&536870912)!==0&&(a.flags&128)===0&&(Xe(a),a.subtreeFlags&6&&(a.flags|=8192)):Xe(a),s=a.updateQueue,s!==null&&Rn(a,s.retryQueue),s=null,e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(s=e.memoizedState.cachePool.pool),l=null,a.memoizedState!==null&&a.memoizedState.cachePool!==null&&(l=a.memoizedState.cachePool.pool),l!==s&&(a.flags|=2048),e!==null&&X(_s),null;case 24:return s=null,e!==null&&(s=e.memoizedState.cache),a.memoizedState.cache!==s&&(a.flags|=2048),Ta(st),Xe(a),null;case 25:return null;case 30:return null}throw Error(d(156,a.tag))}function a0(e,a){switch(Fi(a),a.tag){case 1:return e=a.flags,e&65536?(a.flags=e&-65537|128,a):null;case 3:return Ta(st),Ve(),e=a.flags,(e&65536)!==0&&(e&128)===0?(a.flags=e&-65537|128,a):null;case 26:case 27:case 5:return ba(a),null;case 31:if(a.memoizedState!==null){if(Ut(a),a.alternate===null)throw Error(d(340));Ts()}return e=a.flags,e&65536?(a.flags=e&-65537|128,a):null;case 13:if(Ut(a),e=a.memoizedState,e!==null&&e.dehydrated!==null){if(a.alternate===null)throw Error(d(340));Ts()}return e=a.flags,e&65536?(a.flags=e&-65537|128,a):null;case 19:return X(et),null;case 4:return Ve(),null;case 10:return Ta(a.type),null;case 22:case 23:return Ut(a),hc(),e!==null&&X(_s),e=a.flags,e&65536?(a.flags=e&-65537|128,a):null;case 24:return Ta(st),null;case 25:return null;default:return null}}function pm(e,a){switch(Fi(a),a.tag){case 3:Ta(st),Ve();break;case 26:case 27:case 5:ba(a);break;case 4:Ve();break;case 31:a.memoizedState!==null&&Ut(a);break;case 13:Ut(a);break;case 19:X(et);break;case 10:Ta(a.type);break;case 22:case 23:Ut(a),hc(),e!==null&&X(_s);break;case 24:Ta(st)}}function fr(e,a){try{var s=a.updateQueue,l=s!==null?s.lastEffect:null;if(l!==null){var r=l.next;s=r;do{if((s.tag&e)===e){l=void 0;var n=s.create,c=s.inst;l=n(),c.destroy=l}s=s.next}while(s!==r)}}catch(h){Oe(a,a.return,h)}}function as(e,a,s){try{var l=a.updateQueue,r=l!==null?l.lastEffect:null;if(r!==null){var n=r.next;l=n;do{if((l.tag&e)===e){var c=l.inst,h=c.destroy;if(h!==void 0){c.destroy=void 0,r=a;var y=s,_=h;try{_()}catch(B){Oe(r,y,B)}}}l=l.next}while(l!==n)}}catch(B){Oe(a,a.return,B)}}function gm(e){var a=e.updateQueue;if(a!==null){var s=e.stateNode;try{iu(a,s)}catch(l){Oe(e,e.return,l)}}}function bm(e,a,s){s.props=Ls(e.type,e.memoizedProps),s.state=e.memoizedState;try{s.componentWillUnmount()}catch(l){Oe(e,a,l)}}function pr(e,a){try{var s=e.ref;if(s!==null){switch(e.tag){case 26:case 27:case 5:var l=e.stateNode;break;case 30:l=e.stateNode;break;default:l=e.stateNode}typeof s=="function"?e.refCleanup=s(l):s.current=l}}catch(r){Oe(e,a,r)}}function ha(e,a){var s=e.ref,l=e.refCleanup;if(s!==null)if(typeof l=="function")try{l()}catch(r){Oe(e,a,r)}finally{e.refCleanup=null,e=e.alternate,e!=null&&(e.refCleanup=null)}else if(typeof s=="function")try{s(null)}catch(r){Oe(e,a,r)}else s.current=null}function vm(e){var a=e.type,s=e.memoizedProps,l=e.stateNode;try{e:switch(a){case"button":case"input":case"select":case"textarea":s.autoFocus&&l.focus();break e;case"img":s.src?l.src=s.src:s.srcSet&&(l.srcset=s.srcSet)}}catch(r){Oe(e,e.return,r)}}function Gc(e,a,s){try{var l=e.stateNode;C0(l,e.type,s,a),l[We]=a}catch(r){Oe(e,e.return,r)}}function ym(e){return e.tag===5||e.tag===3||e.tag===26||e.tag===27&&os(e.type)||e.tag===4}function Zc(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||ym(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.tag===27&&os(e.type)||e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function Qc(e,a,s){var l=e.tag;if(l===5||l===6)e=e.stateNode,a?(s.nodeType===9?s.body:s.nodeName==="HTML"?s.ownerDocument.body:s).insertBefore(e,a):(a=s.nodeType===9?s.body:s.nodeName==="HTML"?s.ownerDocument.body:s,a.appendChild(e),s=s._reactRootContainer,s!=null||a.onclick!==null||(a.onclick=Ca));else if(l!==4&&(l===27&&os(e.type)&&(s=e.stateNode,a=null),e=e.child,e!==null))for(Qc(e,a,s),e=e.sibling;e!==null;)Qc(e,a,s),e=e.sibling}function qn(e,a,s){var l=e.tag;if(l===5||l===6)e=e.stateNode,a?s.insertBefore(e,a):s.appendChild(e);else if(l!==4&&(l===27&&os(e.type)&&(s=e.stateNode),e=e.child,e!==null))for(qn(e,a,s),e=e.sibling;e!==null;)qn(e,a,s),e=e.sibling}function jm(e){var a=e.stateNode,s=e.memoizedProps;try{for(var l=e.type,r=a.attributes;r.length;)a.removeAttributeNode(r[0]);jt(a,l,s),a[Pe]=e,a[We]=s}catch(n){Oe(e,e.return,n)}}var Ra=!1,nt=!1,Kc=!1,Nm=typeof WeakSet=="function"?WeakSet:Set,xt=null;function s0(e,a){if(e=e.containerInfo,po=ai,e=Rd(e),Yi(e)){if("selectionStart"in e)var s={start:e.selectionStart,end:e.selectionEnd};else e:{s=(s=e.ownerDocument)&&s.defaultView||window;var l=s.getSelection&&s.getSelection();if(l&&l.rangeCount!==0){s=l.anchorNode;var r=l.anchorOffset,n=l.focusNode;l=l.focusOffset;try{s.nodeType,n.nodeType}catch{s=null;break e}var c=0,h=-1,y=-1,_=0,B=0,G=e,q=null;t:for(;;){for(var U;G!==s||r!==0&&G.nodeType!==3||(h=c+r),G!==n||l!==0&&G.nodeType!==3||(y=c+l),G.nodeType===3&&(c+=G.nodeValue.length),(U=G.firstChild)!==null;)q=G,G=U;for(;;){if(G===e)break t;if(q===s&&++_===r&&(h=c),q===n&&++B===l&&(y=c),(U=G.nextSibling)!==null)break;G=q,q=G.parentNode}G=U}s=h===-1||y===-1?null:{start:h,end:y}}else s=null}s=s||{start:0,end:0}}else s=null;for(go={focusedElem:e,selectionRange:s},ai=!1,xt=a;xt!==null;)if(a=xt,e=a.child,(a.subtreeFlags&1028)!==0&&e!==null)e.return=a,xt=e;else for(;xt!==null;){switch(a=xt,n=a.alternate,e=a.flags,a.tag){case 0:if((e&4)!==0&&(e=a.updateQueue,e=e!==null?e.events:null,e!==null))for(s=0;s<e.length;s++)r=e[s],r.ref.impl=r.nextImpl;break;case 11:case 15:break;case 1:if((e&1024)!==0&&n!==null){e=void 0,s=a,r=n.memoizedProps,n=n.memoizedState,l=s.stateNode;try{var te=Ls(s.type,r);e=l.getSnapshotBeforeUpdate(te,n),l.__reactInternalSnapshotBeforeUpdate=e}catch(de){Oe(s,s.return,de)}}break;case 3:if((e&1024)!==0){if(e=a.stateNode.containerInfo,s=e.nodeType,s===9)yo(e);else if(s===1)switch(e.nodeName){case"HEAD":case"HTML":case"BODY":yo(e);break;default:e.textContent=""}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;default:if((e&1024)!==0)throw Error(d(163))}if(e=a.sibling,e!==null){e.return=a.return,xt=e;break}xt=a.return}}function wm(e,a,s){var l=s.flags;switch(s.tag){case 0:case 11:case 15:Oa(e,s),l&4&&fr(5,s);break;case 1:if(Oa(e,s),l&4)if(e=s.stateNode,a===null)try{e.componentDidMount()}catch(c){Oe(s,s.return,c)}else{var r=Ls(s.type,a.memoizedProps);a=a.memoizedState;try{e.componentDidUpdate(r,a,e.__reactInternalSnapshotBeforeUpdate)}catch(c){Oe(s,s.return,c)}}l&64&&gm(s),l&512&&pr(s,s.return);break;case 3:if(Oa(e,s),l&64&&(e=s.updateQueue,e!==null)){if(a=null,s.child!==null)switch(s.child.tag){case 27:case 5:a=s.child.stateNode;break;case 1:a=s.child.stateNode}try{iu(e,a)}catch(c){Oe(s,s.return,c)}}break;case 27:a===null&&l&4&&jm(s);case 26:case 5:Oa(e,s),a===null&&l&4&&vm(s),l&512&&pr(s,s.return);break;case 12:Oa(e,s);break;case 31:Oa(e,s),l&4&&Em(e,s);break;case 13:Oa(e,s),l&4&&zm(e,s),l&64&&(e=s.memoizedState,e!==null&&(e=e.dehydrated,e!==null&&(s=m0.bind(null,s),_0(e,s))));break;case 22:if(l=s.memoizedState!==null||Ra,!l){a=a!==null&&a.memoizedState!==null||nt,r=Ra;var n=nt;Ra=l,(nt=a)&&!n?La(e,s,(s.subtreeFlags&8772)!==0):Oa(e,s),Ra=r,nt=n}break;case 30:break;default:Oa(e,s)}}function Cm(e){var a=e.alternate;a!==null&&(e.alternate=null,Cm(a)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(a=e.stateNode,a!==null&&Ci(a)),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}var Ze=null,Tt=!1;function qa(e,a,s){for(s=s.child;s!==null;)Sm(e,a,s),s=s.sibling}function Sm(e,a,s){if(gt&&typeof gt.onCommitFiberUnmount=="function")try{gt.onCommitFiberUnmount(Xa,s)}catch{}switch(s.tag){case 26:nt||ha(s,a),qa(e,a,s),s.memoizedState?s.memoizedState.count--:s.stateNode&&(s=s.stateNode,s.parentNode.removeChild(s));break;case 27:nt||ha(s,a);var l=Ze,r=Tt;os(s.type)&&(Ze=s.stateNode,Tt=!1),qa(e,a,s),Sr(s.stateNode),Ze=l,Tt=r;break;case 5:nt||ha(s,a);case 6:if(l=Ze,r=Tt,Ze=null,qa(e,a,s),Ze=l,Tt=r,Ze!==null)if(Tt)try{(Ze.nodeType===9?Ze.body:Ze.nodeName==="HTML"?Ze.ownerDocument.body:Ze).removeChild(s.stateNode)}catch(n){Oe(s,a,n)}else try{Ze.removeChild(s.stateNode)}catch(n){Oe(s,a,n)}break;case 18:Ze!==null&&(Tt?(e=Ze,gh(e.nodeType===9?e.body:e.nodeName==="HTML"?e.ownerDocument.body:e,s.stateNode),_l(e)):gh(Ze,s.stateNode));break;case 4:l=Ze,r=Tt,Ze=s.stateNode.containerInfo,Tt=!0,qa(e,a,s),Ze=l,Tt=r;break;case 0:case 11:case 14:case 15:as(2,s,a),nt||as(4,s,a),qa(e,a,s);break;case 1:nt||(ha(s,a),l=s.stateNode,typeof l.componentWillUnmount=="function"&&bm(s,a,l)),qa(e,a,s);break;case 21:qa(e,a,s);break;case 22:nt=(l=nt)||s.memoizedState!==null,qa(e,a,s),nt=l;break;default:qa(e,a,s)}}function Em(e,a){if(a.memoizedState===null&&(e=a.alternate,e!==null&&(e=e.memoizedState,e!==null))){e=e.dehydrated;try{_l(e)}catch(s){Oe(a,a.return,s)}}}function zm(e,a){if(a.memoizedState===null&&(e=a.alternate,e!==null&&(e=e.memoizedState,e!==null&&(e=e.dehydrated,e!==null))))try{_l(e)}catch(s){Oe(a,a.return,s)}}function l0(e){switch(e.tag){case 31:case 13:case 19:var a=e.stateNode;return a===null&&(a=e.stateNode=new Nm),a;case 22:return e=e.stateNode,a=e._retryCache,a===null&&(a=e._retryCache=new Nm),a;default:throw Error(d(435,e.tag))}}function On(e,a){var s=l0(e);a.forEach(function(l){if(!s.has(l)){s.add(l);var r=h0.bind(null,e,l);l.then(r,r)}})}function Mt(e,a){var s=a.deletions;if(s!==null)for(var l=0;l<s.length;l++){var r=s[l],n=e,c=a,h=c;e:for(;h!==null;){switch(h.tag){case 27:if(os(h.type)){Ze=h.stateNode,Tt=!1;break e}break;case 5:Ze=h.stateNode,Tt=!1;break e;case 3:case 4:Ze=h.stateNode.containerInfo,Tt=!0;break e}h=h.return}if(Ze===null)throw Error(d(160));Sm(n,c,r),Ze=null,Tt=!1,n=r.alternate,n!==null&&(n.return=null),r.return=null}if(a.subtreeFlags&13886)for(a=a.child;a!==null;)km(a,e),a=a.sibling}var la=null;function km(e,a){var s=e.alternate,l=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:Mt(a,e),Dt(e),l&4&&(as(3,e,e.return),fr(3,e),as(5,e,e.return));break;case 1:Mt(a,e),Dt(e),l&512&&(nt||s===null||ha(s,s.return)),l&64&&Ra&&(e=e.updateQueue,e!==null&&(l=e.callbacks,l!==null&&(s=e.shared.hiddenCallbacks,e.shared.hiddenCallbacks=s===null?l:s.concat(l))));break;case 26:var r=la;if(Mt(a,e),Dt(e),l&512&&(nt||s===null||ha(s,s.return)),l&4){var n=s!==null?s.memoizedState:null;if(l=e.memoizedState,s===null)if(l===null)if(e.stateNode===null){e:{l=e.type,s=e.memoizedProps,r=r.ownerDocument||r;t:switch(l){case"title":n=r.getElementsByTagName("title")[0],(!n||n[$l]||n[Pe]||n.namespaceURI==="http://www.w3.org/2000/svg"||n.hasAttribute("itemprop"))&&(n=r.createElement(l),r.head.insertBefore(n,r.querySelector("head > title"))),jt(n,l,s),n[Pe]=e,ht(n),l=n;break e;case"link":var c=kh("link","href",r).get(l+(s.href||""));if(c){for(var h=0;h<c.length;h++)if(n=c[h],n.getAttribute("href")===(s.href==null||s.href===""?null:s.href)&&n.getAttribute("rel")===(s.rel==null?null:s.rel)&&n.getAttribute("title")===(s.title==null?null:s.title)&&n.getAttribute("crossorigin")===(s.crossOrigin==null?null:s.crossOrigin)){c.splice(h,1);break t}}n=r.createElement(l),jt(n,l,s),r.head.appendChild(n);break;case"meta":if(c=kh("meta","content",r).get(l+(s.content||""))){for(h=0;h<c.length;h++)if(n=c[h],n.getAttribute("content")===(s.content==null?null:""+s.content)&&n.getAttribute("name")===(s.name==null?null:s.name)&&n.getAttribute("property")===(s.property==null?null:s.property)&&n.getAttribute("http-equiv")===(s.httpEquiv==null?null:s.httpEquiv)&&n.getAttribute("charset")===(s.charSet==null?null:s.charSet)){c.splice(h,1);break t}}n=r.createElement(l),jt(n,l,s),r.head.appendChild(n);break;default:throw Error(d(468,l))}n[Pe]=e,ht(n),l=n}e.stateNode=l}else Th(r,e.type,e.stateNode);else e.stateNode=zh(r,l,e.memoizedProps);else n!==l?(n===null?s.stateNode!==null&&(s=s.stateNode,s.parentNode.removeChild(s)):n.count--,l===null?Th(r,e.type,e.stateNode):zh(r,l,e.memoizedProps)):l===null&&e.stateNode!==null&&Gc(e,e.memoizedProps,s.memoizedProps)}break;case 27:Mt(a,e),Dt(e),l&512&&(nt||s===null||ha(s,s.return)),s!==null&&l&4&&Gc(e,e.memoizedProps,s.memoizedProps);break;case 5:if(Mt(a,e),Dt(e),l&512&&(nt||s===null||ha(s,s.return)),e.flags&32){r=e.stateNode;try{tl(r,"")}catch(te){Oe(e,e.return,te)}}l&4&&e.stateNode!=null&&(r=e.memoizedProps,Gc(e,r,s!==null?s.memoizedProps:r)),l&1024&&(Kc=!0);break;case 6:if(Mt(a,e),Dt(e),l&4){if(e.stateNode===null)throw Error(d(162));l=e.memoizedProps,s=e.stateNode;try{s.nodeValue=l}catch(te){Oe(e,e.return,te)}}break;case 3:if(Fn=null,r=la,la=Pn(a.containerInfo),Mt(a,e),la=r,Dt(e),l&4&&s!==null&&s.memoizedState.isDehydrated)try{_l(a.containerInfo)}catch(te){Oe(e,e.return,te)}Kc&&(Kc=!1,Tm(e));break;case 4:l=la,la=Pn(e.stateNode.containerInfo),Mt(a,e),Dt(e),la=l;break;case 12:Mt(a,e),Dt(e);break;case 31:Mt(a,e),Dt(e),l&4&&(l=e.updateQueue,l!==null&&(e.updateQueue=null,On(e,l)));break;case 13:Mt(a,e),Dt(e),e.child.flags&8192&&e.memoizedState!==null!=(s!==null&&s.memoizedState!==null)&&(Un=Ct()),l&4&&(l=e.updateQueue,l!==null&&(e.updateQueue=null,On(e,l)));break;case 22:r=e.memoizedState!==null;var y=s!==null&&s.memoizedState!==null,_=Ra,B=nt;if(Ra=_||r,nt=B||y,Mt(a,e),nt=B,Ra=_,Dt(e),l&8192)e:for(a=e.stateNode,a._visibility=r?a._visibility&-2:a._visibility|1,r&&(s===null||y||Ra||nt||Us(e)),s=null,a=e;;){if(a.tag===5||a.tag===26){if(s===null){y=s=a;try{if(n=y.stateNode,r)c=n.style,typeof c.setProperty=="function"?c.setProperty("display","none","important"):c.display="none";else{h=y.stateNode;var G=y.memoizedProps.style,q=G!=null&&G.hasOwnProperty("display")?G.display:null;h.style.display=q==null||typeof q=="boolean"?"":(""+q).trim()}}catch(te){Oe(y,y.return,te)}}}else if(a.tag===6){if(s===null){y=a;try{y.stateNode.nodeValue=r?"":y.memoizedProps}catch(te){Oe(y,y.return,te)}}}else if(a.tag===18){if(s===null){y=a;try{var U=y.stateNode;r?bh(U,!0):bh(y.stateNode,!1)}catch(te){Oe(y,y.return,te)}}}else if((a.tag!==22&&a.tag!==23||a.memoizedState===null||a===e)&&a.child!==null){a.child.return=a,a=a.child;continue}if(a===e)break e;for(;a.sibling===null;){if(a.return===null||a.return===e)break e;s===a&&(s=null),a=a.return}s===a&&(s=null),a.sibling.return=a.return,a=a.sibling}l&4&&(l=e.updateQueue,l!==null&&(s=l.retryQueue,s!==null&&(l.retryQueue=null,On(e,s))));break;case 19:Mt(a,e),Dt(e),l&4&&(l=e.updateQueue,l!==null&&(e.updateQueue=null,On(e,l)));break;case 30:break;case 21:break;default:Mt(a,e),Dt(e)}}function Dt(e){var a=e.flags;if(a&2){try{for(var s,l=e.return;l!==null;){if(ym(l)){s=l;break}l=l.return}if(s==null)throw Error(d(160));switch(s.tag){case 27:var r=s.stateNode,n=Zc(e);qn(e,n,r);break;case 5:var c=s.stateNode;s.flags&32&&(tl(c,""),s.flags&=-33);var h=Zc(e);qn(e,h,c);break;case 3:case 4:var y=s.stateNode.containerInfo,_=Zc(e);Qc(e,_,y);break;default:throw Error(d(161))}}catch(B){Oe(e,e.return,B)}e.flags&=-3}a&4096&&(e.flags&=-4097)}function Tm(e){if(e.subtreeFlags&1024)for(e=e.child;e!==null;){var a=e;Tm(a),a.tag===5&&a.flags&1024&&a.stateNode.reset(),e=e.sibling}}function Oa(e,a){if(a.subtreeFlags&8772)for(a=a.child;a!==null;)wm(e,a.alternate,a),a=a.sibling}function Us(e){for(e=e.child;e!==null;){var a=e;switch(a.tag){case 0:case 11:case 14:case 15:as(4,a,a.return),Us(a);break;case 1:ha(a,a.return);var s=a.stateNode;typeof s.componentWillUnmount=="function"&&bm(a,a.return,s),Us(a);break;case 27:Sr(a.stateNode);case 26:case 5:ha(a,a.return),Us(a);break;case 22:a.memoizedState===null&&Us(a);break;case 30:Us(a);break;default:Us(a)}e=e.sibling}}function La(e,a,s){for(s=s&&(a.subtreeFlags&8772)!==0,a=a.child;a!==null;){var l=a.alternate,r=e,n=a,c=n.flags;switch(n.tag){case 0:case 11:case 15:La(r,n,s),fr(4,n);break;case 1:if(La(r,n,s),l=n,r=l.stateNode,typeof r.componentDidMount=="function")try{r.componentDidMount()}catch(_){Oe(l,l.return,_)}if(l=n,r=l.updateQueue,r!==null){var h=l.stateNode;try{var y=r.shared.hiddenCallbacks;if(y!==null)for(r.shared.hiddenCallbacks=null,r=0;r<y.length;r++)nu(y[r],h)}catch(_){Oe(l,l.return,_)}}s&&c&64&&gm(n),pr(n,n.return);break;case 27:jm(n);case 26:case 5:La(r,n,s),s&&l===null&&c&4&&vm(n),pr(n,n.return);break;case 12:La(r,n,s);break;case 31:La(r,n,s),s&&c&4&&Em(r,n);break;case 13:La(r,n,s),s&&c&4&&zm(r,n);break;case 22:n.memoizedState===null&&La(r,n,s),pr(n,n.return);break;case 30:break;default:La(r,n,s)}a=a.sibling}}function Jc(e,a){var s=null;e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(s=e.memoizedState.cachePool.pool),e=null,a.memoizedState!==null&&a.memoizedState.cachePool!==null&&(e=a.memoizedState.cachePool.pool),e!==s&&(e!=null&&e.refCount++,s!=null&&ar(s))}function Pc(e,a){e=null,a.alternate!==null&&(e=a.alternate.memoizedState.cache),a=a.memoizedState.cache,a!==e&&(a.refCount++,e!=null&&ar(e))}function ra(e,a,s,l){if(a.subtreeFlags&10256)for(a=a.child;a!==null;)Mm(e,a,s,l),a=a.sibling}function Mm(e,a,s,l){var r=a.flags;switch(a.tag){case 0:case 11:case 15:ra(e,a,s,l),r&2048&&fr(9,a);break;case 1:ra(e,a,s,l);break;case 3:ra(e,a,s,l),r&2048&&(e=null,a.alternate!==null&&(e=a.alternate.memoizedState.cache),a=a.memoizedState.cache,a!==e&&(a.refCount++,e!=null&&ar(e)));break;case 12:if(r&2048){ra(e,a,s,l),e=a.stateNode;try{var n=a.memoizedProps,c=n.id,h=n.onPostCommit;typeof h=="function"&&h(c,a.alternate===null?"mount":"update",e.passiveEffectDuration,-0)}catch(y){Oe(a,a.return,y)}}else ra(e,a,s,l);break;case 31:ra(e,a,s,l);break;case 13:ra(e,a,s,l);break;case 23:break;case 22:n=a.stateNode,c=a.alternate,a.memoizedState!==null?n._visibility&2?ra(e,a,s,l):gr(e,a):n._visibility&2?ra(e,a,s,l):(n._visibility|=2,jl(e,a,s,l,(a.subtreeFlags&10256)!==0||!1)),r&2048&&Jc(c,a);break;case 24:ra(e,a,s,l),r&2048&&Pc(a.alternate,a);break;default:ra(e,a,s,l)}}function jl(e,a,s,l,r){for(r=r&&((a.subtreeFlags&10256)!==0||!1),a=a.child;a!==null;){var n=e,c=a,h=s,y=l,_=c.flags;switch(c.tag){case 0:case 11:case 15:jl(n,c,h,y,r),fr(8,c);break;case 23:break;case 22:var B=c.stateNode;c.memoizedState!==null?B._visibility&2?jl(n,c,h,y,r):gr(n,c):(B._visibility|=2,jl(n,c,h,y,r)),r&&_&2048&&Jc(c.alternate,c);break;case 24:jl(n,c,h,y,r),r&&_&2048&&Pc(c.alternate,c);break;default:jl(n,c,h,y,r)}a=a.sibling}}function gr(e,a){if(a.subtreeFlags&10256)for(a=a.child;a!==null;){var s=e,l=a,r=l.flags;switch(l.tag){case 22:gr(s,l),r&2048&&Jc(l.alternate,l);break;case 24:gr(s,l),r&2048&&Pc(l.alternate,l);break;default:gr(s,l)}a=a.sibling}}var br=8192;function Nl(e,a,s){if(e.subtreeFlags&br)for(e=e.child;e!==null;)Dm(e,a,s),e=e.sibling}function Dm(e,a,s){switch(e.tag){case 26:Nl(e,a,s),e.flags&br&&e.memoizedState!==null&&X0(s,la,e.memoizedState,e.memoizedProps);break;case 5:Nl(e,a,s);break;case 3:case 4:var l=la;la=Pn(e.stateNode.containerInfo),Nl(e,a,s),la=l;break;case 22:e.memoizedState===null&&(l=e.alternate,l!==null&&l.memoizedState!==null?(l=br,br=16777216,Nl(e,a,s),br=l):Nl(e,a,s));break;default:Nl(e,a,s)}}function _m(e){var a=e.alternate;if(a!==null&&(e=a.child,e!==null)){a.child=null;do a=e.sibling,e.sibling=null,e=a;while(e!==null)}}function vr(e){var a=e.deletions;if((e.flags&16)!==0){if(a!==null)for(var s=0;s<a.length;s++){var l=a[s];xt=l,Rm(l,e)}_m(e)}if(e.subtreeFlags&10256)for(e=e.child;e!==null;)Am(e),e=e.sibling}function Am(e){switch(e.tag){case 0:case 11:case 15:vr(e),e.flags&2048&&as(9,e,e.return);break;case 3:vr(e);break;case 12:vr(e);break;case 22:var a=e.stateNode;e.memoizedState!==null&&a._visibility&2&&(e.return===null||e.return.tag!==13)?(a._visibility&=-3,Ln(e)):vr(e);break;default:vr(e)}}function Ln(e){var a=e.deletions;if((e.flags&16)!==0){if(a!==null)for(var s=0;s<a.length;s++){var l=a[s];xt=l,Rm(l,e)}_m(e)}for(e=e.child;e!==null;){switch(a=e,a.tag){case 0:case 11:case 15:as(8,a,a.return),Ln(a);break;case 22:s=a.stateNode,s._visibility&2&&(s._visibility&=-3,Ln(a));break;default:Ln(a)}e=e.sibling}}function Rm(e,a){for(;xt!==null;){var s=xt;switch(s.tag){case 0:case 11:case 15:as(8,s,a);break;case 23:case 22:if(s.memoizedState!==null&&s.memoizedState.cachePool!==null){var l=s.memoizedState.cachePool.pool;l!=null&&l.refCount++}break;case 24:ar(s.memoizedState.cache)}if(l=s.child,l!==null)l.return=s,xt=l;else e:for(s=e;xt!==null;){l=xt;var r=l.sibling,n=l.return;if(Cm(l),l===s){xt=null;break e}if(r!==null){r.return=n,xt=r;break e}xt=n}}}var r0={getCacheForType:function(e){var a=vt(st),s=a.data.get(e);return s===void 0&&(s=e(),a.data.set(e,s)),s},cacheSignal:function(){return vt(st).controller.signal}},n0=typeof WeakMap=="function"?WeakMap:Map,Re=0,Be=null,be=null,je=0,qe=0,Ht=null,ss=!1,wl=!1,Wc=!1,Ua=0,Ie=0,ls=0,Hs=0,Fc=0,Bt=0,Cl=0,yr=null,_t=null,Ic=!1,Un=0,qm=0,Hn=1/0,Bn=null,rs=null,dt=0,ns=null,Sl=null,Ha=0,eo=0,to=null,Om=null,jr=0,ao=null;function Yt(){return(Re&2)!==0&&je!==0?je&-je:H.T!==null?co():ge()}function Lm(){if(Bt===0)if((je&536870912)===0||we){var e=Qs;Qs<<=1,(Qs&3932160)===0&&(Qs=262144),Bt=e}else Bt=536870912;return e=Lt.current,e!==null&&(e.flags|=32),Bt}function At(e,a,s){(e===Be&&(qe===2||qe===9)||e.cancelPendingCommit!==null)&&(El(e,0),is(e,je,Bt,!1)),Ga(e,s),((Re&2)===0||e!==Be)&&(e===Be&&((Re&2)===0&&(Hs|=s),Ie===4&&is(e,je,Bt,!1)),xa(e))}function Um(e,a,s){if((Re&6)!==0)throw Error(d(327));var l=!s&&(a&127)===0&&(a&e.expiredLanes)===0||Xt(e,a),r=l?o0(e,a):lo(e,a,!0),n=l;do{if(r===0){wl&&!l&&is(e,a,0,!1);break}else{if(s=e.current.alternate,n&&!i0(s)){r=lo(e,a,!1),n=!1;continue}if(r===2){if(n=a,e.errorRecoveryDisabledLanes&n)var c=0;else c=e.pendingLanes&-536870913,c=c!==0?c:c&536870912?536870912:0;if(c!==0){a=c;e:{var h=e;r=yr;var y=h.current.memoizedState.isDehydrated;if(y&&(El(h,c).flags|=256),c=lo(h,c,!1),c!==2){if(Wc&&!y){h.errorRecoveryDisabledLanes|=n,Hs|=n,r=4;break e}n=_t,_t=r,n!==null&&(_t===null?_t=n:_t.push.apply(_t,n))}r=c}if(n=!1,r!==2)continue}}if(r===1){El(e,0),is(e,a,0,!0);break}e:{switch(l=e,n=r,n){case 0:case 1:throw Error(d(345));case 4:if((a&4194048)!==a)break;case 6:is(l,a,Bt,!ss);break e;case 2:_t=null;break;case 3:case 5:break;default:throw Error(d(329))}if((a&62914560)===a&&(r=Un+300-Ct(),10<r)){if(is(l,a,Bt,!ss),js(l,0,!0)!==0)break e;Ha=a,l.timeoutHandle=fh(Hm.bind(null,l,s,_t,Bn,Ic,a,Bt,Hs,Cl,ss,n,"Throttled",-0,0),r);break e}Hm(l,s,_t,Bn,Ic,a,Bt,Hs,Cl,ss,n,null,-0,0)}}break}while(!0);xa(e)}function Hm(e,a,s,l,r,n,c,h,y,_,B,G,q,U){if(e.timeoutHandle=-1,G=a.subtreeFlags,G&8192||(G&16785408)===16785408){G={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:Ca},Dm(a,n,G);var te=(n&62914560)===n?Un-Ct():(n&4194048)===n?qm-Ct():0;if(te=G0(G,te),te!==null){Ha=n,e.cancelPendingCommit=te(Qm.bind(null,e,a,n,s,l,r,c,h,y,B,G,null,q,U)),is(e,n,c,!_);return}}Qm(e,a,n,s,l,r,c,h,y)}function i0(e){for(var a=e;;){var s=a.tag;if((s===0||s===11||s===15)&&a.flags&16384&&(s=a.updateQueue,s!==null&&(s=s.stores,s!==null)))for(var l=0;l<s.length;l++){var r=s[l],n=r.getSnapshot;r=r.value;try{if(!qt(n(),r))return!1}catch{return!1}}if(s=a.child,a.subtreeFlags&16384&&s!==null)s.return=a,a=s;else{if(a===e)break;for(;a.sibling===null;){if(a.return===null||a.return===e)return!0;a=a.return}a.sibling.return=a.return,a=a.sibling}}return!0}function is(e,a,s,l){a&=~Fc,a&=~Hs,e.suspendedLanes|=a,e.pingedLanes&=~a,l&&(e.warmLanes|=a),l=e.expirationTimes;for(var r=a;0<r;){var n=31-St(r),c=1<<n;l[n]=-1,r&=~c}s!==0&&Jr(e,s,a)}function Yn(){return(Re&6)===0?(Nr(0),!1):!0}function so(){if(be!==null){if(qe===0)var e=be.return;else e=be,ka=Ms=null,vc(e),pl=null,lr=0,e=be;for(;e!==null;)pm(e.alternate,e),e=e.return;be=null}}function El(e,a){var s=e.timeoutHandle;s!==-1&&(e.timeoutHandle=-1,z0(s)),s=e.cancelPendingCommit,s!==null&&(e.cancelPendingCommit=null,s()),Ha=0,so(),Be=e,be=s=Ea(e.current,null),je=a,qe=0,Ht=null,ss=!1,wl=Xt(e,a),Wc=!1,Cl=Bt=Fc=Hs=ls=Ie=0,_t=yr=null,Ic=!1,(a&8)!==0&&(a|=a&32);var l=e.entangledLanes;if(l!==0)for(e=e.entanglements,l&=a;0<l;){var r=31-St(l),n=1<<r;a|=e[r],l&=~n}return Ua=a,cn(),s}function Bm(e,a){fe=null,H.H=mr,a===fl||a===pn?(a=au(),qe=3):a===ic?(a=au(),qe=4):qe=a===qc?8:a!==null&&typeof a=="object"&&typeof a.then=="function"?6:1,Ht=a,be===null&&(Ie=1,Mn(e,Kt(a,e.current)))}function Ym(){var e=Lt.current;return e===null?!0:(je&4194048)===je?Ft===null:(je&62914560)===je||(je&536870912)!==0?e===Ft:!1}function Vm(){var e=H.H;return H.H=mr,e===null?mr:e}function $m(){var e=H.A;return H.A=r0,e}function Vn(){Ie=4,ss||(je&4194048)!==je&&Lt.current!==null||(wl=!0),(ls&134217727)===0&&(Hs&134217727)===0||Be===null||is(Be,je,Bt,!1)}function lo(e,a,s){var l=Re;Re|=2;var r=Vm(),n=$m();(Be!==e||je!==a)&&(Bn=null,El(e,a)),a=!1;var c=Ie;e:do try{if(qe!==0&&be!==null){var h=be,y=Ht;switch(qe){case 8:so(),c=6;break e;case 3:case 2:case 9:case 6:Lt.current===null&&(a=!0);var _=qe;if(qe=0,Ht=null,zl(e,h,y,_),s&&wl){c=0;break e}break;default:_=qe,qe=0,Ht=null,zl(e,h,y,_)}}c0(),c=Ie;break}catch(B){Bm(e,B)}while(!0);return a&&e.shellSuspendCounter++,ka=Ms=null,Re=l,H.H=r,H.A=n,be===null&&(Be=null,je=0,cn()),c}function c0(){for(;be!==null;)Xm(be)}function o0(e,a){var s=Re;Re|=2;var l=Vm(),r=$m();Be!==e||je!==a?(Bn=null,Hn=Ct()+500,El(e,a)):wl=Xt(e,a);e:do try{if(qe!==0&&be!==null){a=be;var n=Ht;t:switch(qe){case 1:qe=0,Ht=null,zl(e,a,n,1);break;case 2:case 9:if(eu(n)){qe=0,Ht=null,Gm(a);break}a=function(){qe!==2&&qe!==9||Be!==e||(qe=7),xa(e)},n.then(a,a);break e;case 3:qe=7;break e;case 4:qe=5;break e;case 7:eu(n)?(qe=0,Ht=null,Gm(a)):(qe=0,Ht=null,zl(e,a,n,7));break;case 5:var c=null;switch(be.tag){case 26:c=be.memoizedState;case 5:case 27:var h=be;if(c?Mh(c):h.stateNode.complete){qe=0,Ht=null;var y=h.sibling;if(y!==null)be=y;else{var _=h.return;_!==null?(be=_,$n(_)):be=null}break t}}qe=0,Ht=null,zl(e,a,n,5);break;case 6:qe=0,Ht=null,zl(e,a,n,6);break;case 8:so(),Ie=6;break e;default:throw Error(d(462))}}d0();break}catch(B){Bm(e,B)}while(!0);return ka=Ms=null,H.H=l,H.A=r,Re=s,be!==null?0:(Be=null,je=0,cn(),Ie)}function d0(){for(;be!==null&&!Xr();)Xm(be)}function Xm(e){var a=xm(e.alternate,e,Ua);e.memoizedProps=e.pendingProps,a===null?$n(e):be=a}function Gm(e){var a=e,s=a.alternate;switch(a.tag){case 15:case 0:a=cm(s,a,a.pendingProps,a.type,void 0,je);break;case 11:a=cm(s,a,a.pendingProps,a.type.render,a.ref,je);break;case 5:vc(a);default:pm(s,a),a=be=$d(a,Ua),a=xm(s,a,Ua)}e.memoizedProps=e.pendingProps,a===null?$n(e):be=a}function zl(e,a,s,l){ka=Ms=null,vc(a),pl=null,lr=0;var r=a.return;try{if(Ff(e,r,a,s,je)){Ie=1,Mn(e,Kt(s,e.current)),be=null;return}}catch(n){if(r!==null)throw be=r,n;Ie=1,Mn(e,Kt(s,e.current)),be=null;return}a.flags&32768?(we||l===1?e=!0:wl||(je&536870912)!==0?e=!1:(ss=e=!0,(l===2||l===9||l===3||l===6)&&(l=Lt.current,l!==null&&l.tag===13&&(l.flags|=16384))),Zm(a,e)):$n(a)}function $n(e){var a=e;do{if((a.flags&32768)!==0){Zm(a,ss);return}e=a.return;var s=t0(a.alternate,a,Ua);if(s!==null){be=s;return}if(a=a.sibling,a!==null){be=a;return}be=a=e}while(a!==null);Ie===0&&(Ie=5)}function Zm(e,a){do{var s=a0(e.alternate,e);if(s!==null){s.flags&=32767,be=s;return}if(s=e.return,s!==null&&(s.flags|=32768,s.subtreeFlags=0,s.deletions=null),!a&&(e=e.sibling,e!==null)){be=e;return}be=e=s}while(e!==null);Ie=6,be=null}function Qm(e,a,s,l,r,n,c,h,y){e.cancelPendingCommit=null;do Xn();while(dt!==0);if((Re&6)!==0)throw Error(d(327));if(a!==null){if(a===e.current)throw Error(d(177));if(n=a.lanes|a.childLanes,n|=Zi,wi(e,s,n,c,h,y),e===Be&&(be=Be=null,je=0),Sl=a,ns=e,Ha=s,eo=n,to=r,Om=l,(a.subtreeFlags&10256)!==0||(a.flags&10256)!==0?(e.callbackNode=null,e.callbackPriority=0,x0(ja,function(){return Fm(),null})):(e.callbackNode=null,e.callbackPriority=0),l=(a.flags&13878)!==0,(a.subtreeFlags&13878)!==0||l){l=H.T,H.T=null,r=K.p,K.p=2,c=Re,Re|=4;try{s0(e,a,s)}finally{Re=c,K.p=r,H.T=l}}dt=1,Km(),Jm(),Pm()}}function Km(){if(dt===1){dt=0;var e=ns,a=Sl,s=(a.flags&13878)!==0;if((a.subtreeFlags&13878)!==0||s){s=H.T,H.T=null;var l=K.p;K.p=2;var r=Re;Re|=4;try{km(a,e);var n=go,c=Rd(e.containerInfo),h=n.focusedElem,y=n.selectionRange;if(c!==h&&h&&h.ownerDocument&&Ad(h.ownerDocument.documentElement,h)){if(y!==null&&Yi(h)){var _=y.start,B=y.end;if(B===void 0&&(B=_),"selectionStart"in h)h.selectionStart=_,h.selectionEnd=Math.min(B,h.value.length);else{var G=h.ownerDocument||document,q=G&&G.defaultView||window;if(q.getSelection){var U=q.getSelection(),te=h.textContent.length,de=Math.min(y.start,te),He=y.end===void 0?de:Math.min(y.end,te);!U.extend&&de>He&&(c=He,He=de,de=c);var T=_d(h,de),C=_d(h,He);if(T&&C&&(U.rangeCount!==1||U.anchorNode!==T.node||U.anchorOffset!==T.offset||U.focusNode!==C.node||U.focusOffset!==C.offset)){var D=G.createRange();D.setStart(T.node,T.offset),U.removeAllRanges(),de>He?(U.addRange(D),U.extend(C.node,C.offset)):(D.setEnd(C.node,C.offset),U.addRange(D))}}}}for(G=[],U=h;U=U.parentNode;)U.nodeType===1&&G.push({element:U,left:U.scrollLeft,top:U.scrollTop});for(typeof h.focus=="function"&&h.focus(),h=0;h<G.length;h++){var V=G[h];V.element.scrollLeft=V.left,V.element.scrollTop=V.top}}ai=!!po,go=po=null}finally{Re=r,K.p=l,H.T=s}}e.current=a,dt=2}}function Jm(){if(dt===2){dt=0;var e=ns,a=Sl,s=(a.flags&8772)!==0;if((a.subtreeFlags&8772)!==0||s){s=H.T,H.T=null;var l=K.p;K.p=2;var r=Re;Re|=4;try{wm(e,a.alternate,a)}finally{Re=r,K.p=l,H.T=s}}dt=3}}function Pm(){if(dt===4||dt===3){dt=0,bi();var e=ns,a=Sl,s=Ha,l=Om;(a.subtreeFlags&10256)!==0||(a.flags&10256)!==0?dt=5:(dt=0,Sl=ns=null,Wm(e,e.pendingLanes));var r=e.pendingLanes;if(r===0&&(rs=null),Ye(s),a=a.stateNode,gt&&typeof gt.onCommitFiberRoot=="function")try{gt.onCommitFiberRoot(Xa,a,void 0,(a.current.flags&128)===128)}catch{}if(l!==null){a=H.T,r=K.p,K.p=2,H.T=null;try{for(var n=e.onRecoverableError,c=0;c<l.length;c++){var h=l[c];n(h.value,{componentStack:h.stack})}}finally{H.T=a,K.p=r}}(Ha&3)!==0&&Xn(),xa(e),r=e.pendingLanes,(s&261930)!==0&&(r&42)!==0?e===ao?jr++:(jr=0,ao=e):jr=0,Nr(0)}}function Wm(e,a){(e.pooledCacheLanes&=a)===0&&(a=e.pooledCache,a!=null&&(e.pooledCache=null,ar(a)))}function Xn(){return Km(),Jm(),Pm(),Fm()}function Fm(){if(dt!==5)return!1;var e=ns,a=eo;eo=0;var s=Ye(Ha),l=H.T,r=K.p;try{K.p=32>s?32:s,H.T=null,s=to,to=null;var n=ns,c=Ha;if(dt=0,Sl=ns=null,Ha=0,(Re&6)!==0)throw Error(d(331));var h=Re;if(Re|=4,Am(n.current),Mm(n,n.current,c,s),Re=h,Nr(0,!1),gt&&typeof gt.onPostCommitFiberRoot=="function")try{gt.onPostCommitFiberRoot(Xa,n)}catch{}return!0}finally{K.p=r,H.T=l,Wm(e,a)}}function Im(e,a,s){a=Kt(s,a),a=Rc(e.stateNode,a,2),e=Ia(e,a,2),e!==null&&(Ga(e,2),xa(e))}function Oe(e,a,s){if(e.tag===3)Im(e,e,s);else for(;a!==null;){if(a.tag===3){Im(a,e,s);break}else if(a.tag===1){var l=a.stateNode;if(typeof a.type.getDerivedStateFromError=="function"||typeof l.componentDidCatch=="function"&&(rs===null||!rs.has(l))){e=Kt(s,e),s=em(2),l=Ia(a,s,2),l!==null&&(tm(s,l,a,e),Ga(l,2),xa(l));break}}a=a.return}}function ro(e,a,s){var l=e.pingCache;if(l===null){l=e.pingCache=new n0;var r=new Set;l.set(a,r)}else r=l.get(a),r===void 0&&(r=new Set,l.set(a,r));r.has(s)||(Wc=!0,r.add(s),e=u0.bind(null,e,a,s),a.then(e,e))}function u0(e,a,s){var l=e.pingCache;l!==null&&l.delete(a),e.pingedLanes|=e.suspendedLanes&s,e.warmLanes&=~s,Be===e&&(je&s)===s&&(Ie===4||Ie===3&&(je&62914560)===je&&300>Ct()-Un?(Re&2)===0&&El(e,0):Fc|=s,Cl===je&&(Cl=0)),xa(e)}function eh(e,a){a===0&&(a=Kr()),e=zs(e,a),e!==null&&(Ga(e,a),xa(e))}function m0(e){var a=e.memoizedState,s=0;a!==null&&(s=a.retryLane),eh(e,s)}function h0(e,a){var s=0;switch(e.tag){case 31:case 13:var l=e.stateNode,r=e.memoizedState;r!==null&&(s=r.retryLane);break;case 19:l=e.stateNode;break;case 22:l=e.stateNode._retryCache;break;default:throw Error(d(314))}l!==null&&l.delete(a),eh(e,s)}function x0(e,a){return va(e,a)}var Gn=null,kl=null,no=!1,Zn=!1,io=!1,cs=0;function xa(e){e!==kl&&e.next===null&&(kl===null?Gn=kl=e:kl=kl.next=e),Zn=!0,no||(no=!0,p0())}function Nr(e,a){if(!io&&Zn){io=!0;do for(var s=!1,l=Gn;l!==null;){if(e!==0){var r=l.pendingLanes;if(r===0)var n=0;else{var c=l.suspendedLanes,h=l.pingedLanes;n=(1<<31-St(42|e)+1)-1,n&=r&~(c&~h),n=n&201326741?n&201326741|1:n?n|2:0}n!==0&&(s=!0,lh(l,n))}else n=je,n=js(l,l===Be?n:0,l.cancelPendingCommit!==null||l.timeoutHandle!==-1),(n&3)===0||Xt(l,n)||(s=!0,lh(l,n));l=l.next}while(s);io=!1}}function f0(){th()}function th(){Zn=no=!1;var e=0;cs!==0&&E0()&&(e=cs);for(var a=Ct(),s=null,l=Gn;l!==null;){var r=l.next,n=ah(l,a);n===0?(l.next=null,s===null?Gn=r:s.next=r,r===null&&(kl=s)):(s=l,(e!==0||(n&3)!==0)&&(Zn=!0)),l=r}dt!==0&&dt!==5||Nr(e),cs!==0&&(cs=0)}function ah(e,a){for(var s=e.suspendedLanes,l=e.pingedLanes,r=e.expirationTimes,n=e.pendingLanes&-62914561;0<n;){var c=31-St(n),h=1<<c,y=r[c];y===-1?((h&s)===0||(h&l)!==0)&&(r[c]=Qr(h,a)):y<=a&&(e.expiredLanes|=h),n&=~h}if(a=Be,s=je,s=js(e,e===a?s:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),l=e.callbackNode,s===0||e===a&&(qe===2||qe===9)||e.cancelPendingCommit!==null)return l!==null&&l!==null&&ya(l),e.callbackNode=null,e.callbackPriority=0;if((s&3)===0||Xt(e,s)){if(a=s&-s,a===e.callbackPriority)return a;switch(l!==null&&ya(l),Ye(s)){case 2:case 8:s=Yl;break;case 32:s=ja;break;case 268435456:s=Na;break;default:s=ja}return l=sh.bind(null,e),s=va(s,l),e.callbackPriority=a,e.callbackNode=s,a}return l!==null&&l!==null&&ya(l),e.callbackPriority=2,e.callbackNode=null,2}function sh(e,a){if(dt!==0&&dt!==5)return e.callbackNode=null,e.callbackPriority=0,null;var s=e.callbackNode;if(Xn()&&e.callbackNode!==s)return null;var l=je;return l=js(e,e===Be?l:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),l===0?null:(Um(e,l,a),ah(e,Ct()),e.callbackNode!=null&&e.callbackNode===s?sh.bind(null,e):null)}function lh(e,a){if(Xn())return null;Um(e,a,!0)}function p0(){k0(function(){(Re&6)!==0?va(Ae,f0):th()})}function co(){if(cs===0){var e=hl;e===0&&(e=Zs,Zs<<=1,(Zs&261888)===0&&(Zs=256)),cs=e}return cs}function rh(e){return e==null||typeof e=="symbol"||typeof e=="boolean"?null:typeof e=="function"?e:Ir(""+e)}function nh(e,a){var s=a.ownerDocument.createElement("input");return s.name=a.name,s.value=a.value,e.id&&s.setAttribute("form",e.id),a.parentNode.insertBefore(s,a),e=new FormData(e),s.parentNode.removeChild(s),e}function g0(e,a,s,l,r){if(a==="submit"&&s&&s.stateNode===r){var n=rh((r[We]||null).action),c=l.submitter;c&&(a=(a=c[We]||null)?rh(a.formAction):c.getAttribute("formAction"),a!==null&&(n=a,c=null));var h=new sn("action","action",null,l,r);e.push({event:h,listeners:[{instance:null,listener:function(){if(l.defaultPrevented){if(cs!==0){var y=c?nh(r,c):new FormData(r);kc(s,{pending:!0,data:y,method:r.method,action:n},null,y)}}else typeof n=="function"&&(h.preventDefault(),y=c?nh(r,c):new FormData(r),kc(s,{pending:!0,data:y,method:r.method,action:n},n,y))},currentTarget:r}]})}}for(var oo=0;oo<Gi.length;oo++){var uo=Gi[oo],b0=uo.toLowerCase(),v0=uo[0].toUpperCase()+uo.slice(1);sa(b0,"on"+v0)}sa(Ld,"onAnimationEnd"),sa(Ud,"onAnimationIteration"),sa(Hd,"onAnimationStart"),sa("dblclick","onDoubleClick"),sa("focusin","onFocus"),sa("focusout","onBlur"),sa(qf,"onTransitionRun"),sa(Of,"onTransitionStart"),sa(Lf,"onTransitionCancel"),sa(Bd,"onTransitionEnd"),Is("onMouseEnter",["mouseout","mouseover"]),Is("onMouseLeave",["mouseout","mouseover"]),Is("onPointerEnter",["pointerout","pointerover"]),Is("onPointerLeave",["pointerout","pointerover"]),ws("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),ws("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),ws("onBeforeInput",["compositionend","keypress","textInput","paste"]),ws("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),ws("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),ws("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var wr="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),y0=new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(wr));function ih(e,a){a=(a&4)!==0;for(var s=0;s<e.length;s++){var l=e[s],r=l.event;l=l.listeners;e:{var n=void 0;if(a)for(var c=l.length-1;0<=c;c--){var h=l[c],y=h.instance,_=h.currentTarget;if(h=h.listener,y!==n&&r.isPropagationStopped())break e;n=h,r.currentTarget=_;try{n(r)}catch(B){nn(B)}r.currentTarget=null,n=y}else for(c=0;c<l.length;c++){if(h=l[c],y=h.instance,_=h.currentTarget,h=h.listener,y!==n&&r.isPropagationStopped())break e;n=h,r.currentTarget=_;try{n(r)}catch(B){nn(B)}r.currentTarget=null,n=y}}}}function ve(e,a){var s=a[Ns];s===void 0&&(s=a[Ns]=new Set);var l=e+"__bubble";s.has(l)||(ch(a,e,2,!1),s.add(l))}function mo(e,a,s){var l=0;a&&(l|=4),ch(s,e,l,a)}var Qn="_reactListening"+Math.random().toString(36).slice(2);function ho(e){if(!e[Qn]){e[Qn]=!0,td.forEach(function(s){s!=="selectionchange"&&(y0.has(s)||mo(s,!1,e),mo(s,!0,e))});var a=e.nodeType===9?e:e.ownerDocument;a===null||a[Qn]||(a[Qn]=!0,mo("selectionchange",!1,a))}}function ch(e,a,s,l){switch(Lh(a)){case 2:var r=K0;break;case 8:r=J0;break;default:r=ko}s=r.bind(null,a,s,e),r=void 0,!_i||a!=="touchstart"&&a!=="touchmove"&&a!=="wheel"||(r=!0),l?r!==void 0?e.addEventListener(a,s,{capture:!0,passive:r}):e.addEventListener(a,s,!0):r!==void 0?e.addEventListener(a,s,{passive:r}):e.addEventListener(a,s,!1)}function xo(e,a,s,l,r){var n=l;if((a&1)===0&&(a&2)===0&&l!==null)e:for(;;){if(l===null)return;var c=l.tag;if(c===3||c===4){var h=l.stateNode.containerInfo;if(h===r)break;if(c===4)for(c=l.return;c!==null;){var y=c.tag;if((y===3||y===4)&&c.stateNode.containerInfo===r)return;c=c.return}for(;h!==null;){if(c=Ps(h),c===null)return;if(y=c.tag,y===5||y===6||y===26||y===27){l=n=c;continue e}h=h.parentNode}}l=l.return}hd(function(){var _=n,B=Mi(s),G=[];e:{var q=Yd.get(e);if(q!==void 0){var U=sn,te=e;switch(e){case"keypress":if(tn(s)===0)break e;case"keydown":case"keyup":U=hf;break;case"focusin":te="focus",U=Oi;break;case"focusout":te="blur",U=Oi;break;case"beforeblur":case"afterblur":U=Oi;break;case"click":if(s.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":U=pd;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":U=ef;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":U=pf;break;case Ld:case Ud:case Hd:U=sf;break;case Bd:U=bf;break;case"scroll":case"scrollend":U=Fx;break;case"wheel":U=yf;break;case"copy":case"cut":case"paste":U=rf;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":U=bd;break;case"toggle":case"beforetoggle":U=Nf}var de=(a&4)!==0,He=!de&&(e==="scroll"||e==="scrollend"),T=de?q!==null?q+"Capture":null:q;de=[];for(var C=_,D;C!==null;){var V=C;if(D=V.stateNode,V=V.tag,V!==5&&V!==26&&V!==27||D===null||T===null||(V=Gl(C,T),V!=null&&de.push(Cr(C,V,D))),He)break;C=C.return}0<de.length&&(q=new U(q,te,null,s,B),G.push({event:q,listeners:de}))}}if((a&7)===0){e:{if(q=e==="mouseover"||e==="pointerover",U=e==="mouseout"||e==="pointerout",q&&s!==Ti&&(te=s.relatedTarget||s.fromElement)&&(Ps(te)||te[ze]))break e;if((U||q)&&(q=B.window===B?B:(q=B.ownerDocument)?q.defaultView||q.parentWindow:window,U?(te=s.relatedTarget||s.toElement,U=_,te=te?Ps(te):null,te!==null&&(He=b(te),de=te.tag,te!==He||de!==5&&de!==27&&de!==6)&&(te=null)):(U=null,te=_),U!==te)){if(de=pd,V="onMouseLeave",T="onMouseEnter",C="mouse",(e==="pointerout"||e==="pointerover")&&(de=bd,V="onPointerLeave",T="onPointerEnter",C="pointer"),He=U==null?q:Xl(U),D=te==null?q:Xl(te),q=new de(V,C+"leave",U,s,B),q.target=He,q.relatedTarget=D,V=null,Ps(B)===_&&(de=new de(T,C+"enter",te,s,B),de.target=D,de.relatedTarget=He,V=de),He=V,U&&te)t:{for(de=j0,T=U,C=te,D=0,V=T;V;V=de(V))D++;V=0;for(var re=C;re;re=de(re))V++;for(;0<D-V;)T=de(T),D--;for(;0<V-D;)C=de(C),V--;for(;D--;){if(T===C||C!==null&&T===C.alternate){de=T;break t}T=de(T),C=de(C)}de=null}else de=null;U!==null&&oh(G,q,U,de,!1),te!==null&&He!==null&&oh(G,He,te,de,!0)}}e:{if(q=_?Xl(_):window,U=q.nodeName&&q.nodeName.toLowerCase(),U==="select"||U==="input"&&q.type==="file")var Te=Ed;else if(Cd(q))if(zd)Te=_f;else{Te=Mf;var ae=Tf}else U=q.nodeName,!U||U.toLowerCase()!=="input"||q.type!=="checkbox"&&q.type!=="radio"?_&&ki(_.elementType)&&(Te=Ed):Te=Df;if(Te&&(Te=Te(e,_))){Sd(G,Te,s,B);break e}ae&&ae(e,q,_),e==="focusout"&&_&&q.type==="number"&&_.memoizedProps.value!=null&&zi(q,"number",q.value)}switch(ae=_?Xl(_):window,e){case"focusin":(Cd(ae)||ae.contentEditable==="true")&&(rl=ae,Vi=_,Il=null);break;case"focusout":Il=Vi=rl=null;break;case"mousedown":$i=!0;break;case"contextmenu":case"mouseup":case"dragend":$i=!1,qd(G,s,B);break;case"selectionchange":if(Rf)break;case"keydown":case"keyup":qd(G,s,B)}var pe;if(Ui)e:{switch(e){case"compositionstart":var Ne="onCompositionStart";break e;case"compositionend":Ne="onCompositionEnd";break e;case"compositionupdate":Ne="onCompositionUpdate";break e}Ne=void 0}else ll?Nd(e,s)&&(Ne="onCompositionEnd"):e==="keydown"&&s.keyCode===229&&(Ne="onCompositionStart");Ne&&(vd&&s.locale!=="ko"&&(ll||Ne!=="onCompositionStart"?Ne==="onCompositionEnd"&&ll&&(pe=xd()):(Za=B,Ai="value"in Za?Za.value:Za.textContent,ll=!0)),ae=Kn(_,Ne),0<ae.length&&(Ne=new gd(Ne,e,null,s,B),G.push({event:Ne,listeners:ae}),pe?Ne.data=pe:(pe=wd(s),pe!==null&&(Ne.data=pe)))),(pe=Cf?Sf(e,s):Ef(e,s))&&(Ne=Kn(_,"onBeforeInput"),0<Ne.length&&(ae=new gd("onBeforeInput","beforeinput",null,s,B),G.push({event:ae,listeners:Ne}),ae.data=pe)),g0(G,e,_,s,B)}ih(G,a)})}function Cr(e,a,s){return{instance:e,listener:a,currentTarget:s}}function Kn(e,a){for(var s=a+"Capture",l=[];e!==null;){var r=e,n=r.stateNode;if(r=r.tag,r!==5&&r!==26&&r!==27||n===null||(r=Gl(e,s),r!=null&&l.unshift(Cr(e,r,n)),r=Gl(e,a),r!=null&&l.push(Cr(e,r,n))),e.tag===3)return l;e=e.return}return[]}function j0(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5&&e.tag!==27);return e||null}function oh(e,a,s,l,r){for(var n=a._reactName,c=[];s!==null&&s!==l;){var h=s,y=h.alternate,_=h.stateNode;if(h=h.tag,y!==null&&y===l)break;h!==5&&h!==26&&h!==27||_===null||(y=_,r?(_=Gl(s,n),_!=null&&c.unshift(Cr(s,_,y))):r||(_=Gl(s,n),_!=null&&c.push(Cr(s,_,y)))),s=s.return}c.length!==0&&e.push({event:a,listeners:c})}var N0=/\r\n?/g,w0=/\u0000|\uFFFD/g;function dh(e){return(typeof e=="string"?e:""+e).replace(N0,`
`).replace(w0,"")}function uh(e,a){return a=dh(a),dh(e)===a}function Ue(e,a,s,l,r,n){switch(s){case"children":typeof l=="string"?a==="body"||a==="textarea"&&l===""||tl(e,l):(typeof l=="number"||typeof l=="bigint")&&a!=="body"&&tl(e,""+l);break;case"className":Wr(e,"class",l);break;case"tabIndex":Wr(e,"tabindex",l);break;case"dir":case"role":case"viewBox":case"width":case"height":Wr(e,s,l);break;case"style":ud(e,l,n);break;case"data":if(a!=="object"){Wr(e,"data",l);break}case"src":case"href":if(l===""&&(a!=="a"||s!=="href")){e.removeAttribute(s);break}if(l==null||typeof l=="function"||typeof l=="symbol"||typeof l=="boolean"){e.removeAttribute(s);break}l=Ir(""+l),e.setAttribute(s,l);break;case"action":case"formAction":if(typeof l=="function"){e.setAttribute(s,"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");break}else typeof n=="function"&&(s==="formAction"?(a!=="input"&&Ue(e,a,"name",r.name,r,null),Ue(e,a,"formEncType",r.formEncType,r,null),Ue(e,a,"formMethod",r.formMethod,r,null),Ue(e,a,"formTarget",r.formTarget,r,null)):(Ue(e,a,"encType",r.encType,r,null),Ue(e,a,"method",r.method,r,null),Ue(e,a,"target",r.target,r,null)));if(l==null||typeof l=="symbol"||typeof l=="boolean"){e.removeAttribute(s);break}l=Ir(""+l),e.setAttribute(s,l);break;case"onClick":l!=null&&(e.onclick=Ca);break;case"onScroll":l!=null&&ve("scroll",e);break;case"onScrollEnd":l!=null&&ve("scrollend",e);break;case"dangerouslySetInnerHTML":if(l!=null){if(typeof l!="object"||!("__html"in l))throw Error(d(61));if(s=l.__html,s!=null){if(r.children!=null)throw Error(d(60));e.innerHTML=s}}break;case"multiple":e.multiple=l&&typeof l!="function"&&typeof l!="symbol";break;case"muted":e.muted=l&&typeof l!="function"&&typeof l!="symbol";break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"defaultValue":case"defaultChecked":case"innerHTML":case"ref":break;case"autoFocus":break;case"xlinkHref":if(l==null||typeof l=="function"||typeof l=="boolean"||typeof l=="symbol"){e.removeAttribute("xlink:href");break}s=Ir(""+l),e.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",s);break;case"contentEditable":case"spellCheck":case"draggable":case"value":case"autoReverse":case"externalResourcesRequired":case"focusable":case"preserveAlpha":l!=null&&typeof l!="function"&&typeof l!="symbol"?e.setAttribute(s,""+l):e.removeAttribute(s);break;case"inert":case"allowFullScreen":case"async":case"autoPlay":case"controls":case"default":case"defer":case"disabled":case"disablePictureInPicture":case"disableRemotePlayback":case"formNoValidate":case"hidden":case"loop":case"noModule":case"noValidate":case"open":case"playsInline":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"itemScope":l&&typeof l!="function"&&typeof l!="symbol"?e.setAttribute(s,""):e.removeAttribute(s);break;case"capture":case"download":l===!0?e.setAttribute(s,""):l!==!1&&l!=null&&typeof l!="function"&&typeof l!="symbol"?e.setAttribute(s,l):e.removeAttribute(s);break;case"cols":case"rows":case"size":case"span":l!=null&&typeof l!="function"&&typeof l!="symbol"&&!isNaN(l)&&1<=l?e.setAttribute(s,l):e.removeAttribute(s);break;case"rowSpan":case"start":l==null||typeof l=="function"||typeof l=="symbol"||isNaN(l)?e.removeAttribute(s):e.setAttribute(s,l);break;case"popover":ve("beforetoggle",e),ve("toggle",e),Pr(e,"popover",l);break;case"xlinkActuate":wa(e,"http://www.w3.org/1999/xlink","xlink:actuate",l);break;case"xlinkArcrole":wa(e,"http://www.w3.org/1999/xlink","xlink:arcrole",l);break;case"xlinkRole":wa(e,"http://www.w3.org/1999/xlink","xlink:role",l);break;case"xlinkShow":wa(e,"http://www.w3.org/1999/xlink","xlink:show",l);break;case"xlinkTitle":wa(e,"http://www.w3.org/1999/xlink","xlink:title",l);break;case"xlinkType":wa(e,"http://www.w3.org/1999/xlink","xlink:type",l);break;case"xmlBase":wa(e,"http://www.w3.org/XML/1998/namespace","xml:base",l);break;case"xmlLang":wa(e,"http://www.w3.org/XML/1998/namespace","xml:lang",l);break;case"xmlSpace":wa(e,"http://www.w3.org/XML/1998/namespace","xml:space",l);break;case"is":Pr(e,"is",l);break;case"innerText":case"textContent":break;default:(!(2<s.length)||s[0]!=="o"&&s[0]!=="O"||s[1]!=="n"&&s[1]!=="N")&&(s=Px.get(s)||s,Pr(e,s,l))}}function fo(e,a,s,l,r,n){switch(s){case"style":ud(e,l,n);break;case"dangerouslySetInnerHTML":if(l!=null){if(typeof l!="object"||!("__html"in l))throw Error(d(61));if(s=l.__html,s!=null){if(r.children!=null)throw Error(d(60));e.innerHTML=s}}break;case"children":typeof l=="string"?tl(e,l):(typeof l=="number"||typeof l=="bigint")&&tl(e,""+l);break;case"onScroll":l!=null&&ve("scroll",e);break;case"onScrollEnd":l!=null&&ve("scrollend",e);break;case"onClick":l!=null&&(e.onclick=Ca);break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"innerHTML":case"ref":break;case"innerText":case"textContent":break;default:if(!ad.hasOwnProperty(s))e:{if(s[0]==="o"&&s[1]==="n"&&(r=s.endsWith("Capture"),a=s.slice(2,r?s.length-7:void 0),n=e[We]||null,n=n!=null?n[s]:null,typeof n=="function"&&e.removeEventListener(a,n,r),typeof l=="function")){typeof n!="function"&&n!==null&&(s in e?e[s]=null:e.hasAttribute(s)&&e.removeAttribute(s)),e.addEventListener(a,l,r);break e}s in e?e[s]=l:l===!0?e.setAttribute(s,""):Pr(e,s,l)}}}function jt(e,a,s){switch(a){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"img":ve("error",e),ve("load",e);var l=!1,r=!1,n;for(n in s)if(s.hasOwnProperty(n)){var c=s[n];if(c!=null)switch(n){case"src":l=!0;break;case"srcSet":r=!0;break;case"children":case"dangerouslySetInnerHTML":throw Error(d(137,a));default:Ue(e,a,n,c,s,null)}}r&&Ue(e,a,"srcSet",s.srcSet,s,null),l&&Ue(e,a,"src",s.src,s,null);return;case"input":ve("invalid",e);var h=n=c=r=null,y=null,_=null;for(l in s)if(s.hasOwnProperty(l)){var B=s[l];if(B!=null)switch(l){case"name":r=B;break;case"type":c=B;break;case"checked":y=B;break;case"defaultChecked":_=B;break;case"value":n=B;break;case"defaultValue":h=B;break;case"children":case"dangerouslySetInnerHTML":if(B!=null)throw Error(d(137,a));break;default:Ue(e,a,l,B,s,null)}}id(e,n,h,y,_,c,r,!1);return;case"select":ve("invalid",e),l=c=n=null;for(r in s)if(s.hasOwnProperty(r)&&(h=s[r],h!=null))switch(r){case"value":n=h;break;case"defaultValue":c=h;break;case"multiple":l=h;default:Ue(e,a,r,h,s,null)}a=n,s=c,e.multiple=!!l,a!=null?el(e,!!l,a,!1):s!=null&&el(e,!!l,s,!0);return;case"textarea":ve("invalid",e),n=r=l=null;for(c in s)if(s.hasOwnProperty(c)&&(h=s[c],h!=null))switch(c){case"value":l=h;break;case"defaultValue":r=h;break;case"children":n=h;break;case"dangerouslySetInnerHTML":if(h!=null)throw Error(d(91));break;default:Ue(e,a,c,h,s,null)}od(e,l,r,n);return;case"option":for(y in s)s.hasOwnProperty(y)&&(l=s[y],l!=null)&&(y==="selected"?e.selected=l&&typeof l!="function"&&typeof l!="symbol":Ue(e,a,y,l,s,null));return;case"dialog":ve("beforetoggle",e),ve("toggle",e),ve("cancel",e),ve("close",e);break;case"iframe":case"object":ve("load",e);break;case"video":case"audio":for(l=0;l<wr.length;l++)ve(wr[l],e);break;case"image":ve("error",e),ve("load",e);break;case"details":ve("toggle",e);break;case"embed":case"source":case"link":ve("error",e),ve("load",e);case"area":case"base":case"br":case"col":case"hr":case"keygen":case"meta":case"param":case"track":case"wbr":case"menuitem":for(_ in s)if(s.hasOwnProperty(_)&&(l=s[_],l!=null))switch(_){case"children":case"dangerouslySetInnerHTML":throw Error(d(137,a));default:Ue(e,a,_,l,s,null)}return;default:if(ki(a)){for(B in s)s.hasOwnProperty(B)&&(l=s[B],l!==void 0&&fo(e,a,B,l,s,void 0));return}}for(h in s)s.hasOwnProperty(h)&&(l=s[h],l!=null&&Ue(e,a,h,l,s,null))}function C0(e,a,s,l){switch(a){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"input":var r=null,n=null,c=null,h=null,y=null,_=null,B=null;for(U in s){var G=s[U];if(s.hasOwnProperty(U)&&G!=null)switch(U){case"checked":break;case"value":break;case"defaultValue":y=G;default:l.hasOwnProperty(U)||Ue(e,a,U,null,l,G)}}for(var q in l){var U=l[q];if(G=s[q],l.hasOwnProperty(q)&&(U!=null||G!=null))switch(q){case"type":n=U;break;case"name":r=U;break;case"checked":_=U;break;case"defaultChecked":B=U;break;case"value":c=U;break;case"defaultValue":h=U;break;case"children":case"dangerouslySetInnerHTML":if(U!=null)throw Error(d(137,a));break;default:U!==G&&Ue(e,a,q,U,l,G)}}Ei(e,c,h,y,_,B,n,r);return;case"select":U=c=h=q=null;for(n in s)if(y=s[n],s.hasOwnProperty(n)&&y!=null)switch(n){case"value":break;case"multiple":U=y;default:l.hasOwnProperty(n)||Ue(e,a,n,null,l,y)}for(r in l)if(n=l[r],y=s[r],l.hasOwnProperty(r)&&(n!=null||y!=null))switch(r){case"value":q=n;break;case"defaultValue":h=n;break;case"multiple":c=n;default:n!==y&&Ue(e,a,r,n,l,y)}a=h,s=c,l=U,q!=null?el(e,!!s,q,!1):!!l!=!!s&&(a!=null?el(e,!!s,a,!0):el(e,!!s,s?[]:"",!1));return;case"textarea":U=q=null;for(h in s)if(r=s[h],s.hasOwnProperty(h)&&r!=null&&!l.hasOwnProperty(h))switch(h){case"value":break;case"children":break;default:Ue(e,a,h,null,l,r)}for(c in l)if(r=l[c],n=s[c],l.hasOwnProperty(c)&&(r!=null||n!=null))switch(c){case"value":q=r;break;case"defaultValue":U=r;break;case"children":break;case"dangerouslySetInnerHTML":if(r!=null)throw Error(d(91));break;default:r!==n&&Ue(e,a,c,r,l,n)}cd(e,q,U);return;case"option":for(var te in s)q=s[te],s.hasOwnProperty(te)&&q!=null&&!l.hasOwnProperty(te)&&(te==="selected"?e.selected=!1:Ue(e,a,te,null,l,q));for(y in l)q=l[y],U=s[y],l.hasOwnProperty(y)&&q!==U&&(q!=null||U!=null)&&(y==="selected"?e.selected=q&&typeof q!="function"&&typeof q!="symbol":Ue(e,a,y,q,l,U));return;case"img":case"link":case"area":case"base":case"br":case"col":case"embed":case"hr":case"keygen":case"meta":case"param":case"source":case"track":case"wbr":case"menuitem":for(var de in s)q=s[de],s.hasOwnProperty(de)&&q!=null&&!l.hasOwnProperty(de)&&Ue(e,a,de,null,l,q);for(_ in l)if(q=l[_],U=s[_],l.hasOwnProperty(_)&&q!==U&&(q!=null||U!=null))switch(_){case"children":case"dangerouslySetInnerHTML":if(q!=null)throw Error(d(137,a));break;default:Ue(e,a,_,q,l,U)}return;default:if(ki(a)){for(var He in s)q=s[He],s.hasOwnProperty(He)&&q!==void 0&&!l.hasOwnProperty(He)&&fo(e,a,He,void 0,l,q);for(B in l)q=l[B],U=s[B],!l.hasOwnProperty(B)||q===U||q===void 0&&U===void 0||fo(e,a,B,q,l,U);return}}for(var T in s)q=s[T],s.hasOwnProperty(T)&&q!=null&&!l.hasOwnProperty(T)&&Ue(e,a,T,null,l,q);for(G in l)q=l[G],U=s[G],!l.hasOwnProperty(G)||q===U||q==null&&U==null||Ue(e,a,G,q,l,U)}function mh(e){switch(e){case"css":case"script":case"font":case"img":case"image":case"input":case"link":return!0;default:return!1}}function S0(){if(typeof performance.getEntriesByType=="function"){for(var e=0,a=0,s=performance.getEntriesByType("resource"),l=0;l<s.length;l++){var r=s[l],n=r.transferSize,c=r.initiatorType,h=r.duration;if(n&&h&&mh(c)){for(c=0,h=r.responseEnd,l+=1;l<s.length;l++){var y=s[l],_=y.startTime;if(_>h)break;var B=y.transferSize,G=y.initiatorType;B&&mh(G)&&(y=y.responseEnd,c+=B*(y<h?1:(h-_)/(y-_)))}if(--l,a+=8*(n+c)/(r.duration/1e3),e++,10<e)break}}if(0<e)return a/e/1e6}return navigator.connection&&(e=navigator.connection.downlink,typeof e=="number")?e:5}var po=null,go=null;function Jn(e){return e.nodeType===9?e:e.ownerDocument}function hh(e){switch(e){case"http://www.w3.org/2000/svg":return 1;case"http://www.w3.org/1998/Math/MathML":return 2;default:return 0}}function xh(e,a){if(e===0)switch(a){case"svg":return 1;case"math":return 2;default:return 0}return e===1&&a==="foreignObject"?0:e}function bo(e,a){return e==="textarea"||e==="noscript"||typeof a.children=="string"||typeof a.children=="number"||typeof a.children=="bigint"||typeof a.dangerouslySetInnerHTML=="object"&&a.dangerouslySetInnerHTML!==null&&a.dangerouslySetInnerHTML.__html!=null}var vo=null;function E0(){var e=window.event;return e&&e.type==="popstate"?e===vo?!1:(vo=e,!0):(vo=null,!1)}var fh=typeof setTimeout=="function"?setTimeout:void 0,z0=typeof clearTimeout=="function"?clearTimeout:void 0,ph=typeof Promise=="function"?Promise:void 0,k0=typeof queueMicrotask=="function"?queueMicrotask:typeof ph<"u"?function(e){return ph.resolve(null).then(e).catch(T0)}:fh;function T0(e){setTimeout(function(){throw e})}function os(e){return e==="head"}function gh(e,a){var s=a,l=0;do{var r=s.nextSibling;if(e.removeChild(s),r&&r.nodeType===8)if(s=r.data,s==="/$"||s==="/&"){if(l===0){e.removeChild(r),_l(a);return}l--}else if(s==="$"||s==="$?"||s==="$~"||s==="$!"||s==="&")l++;else if(s==="html")Sr(e.ownerDocument.documentElement);else if(s==="head"){s=e.ownerDocument.head,Sr(s);for(var n=s.firstChild;n;){var c=n.nextSibling,h=n.nodeName;n[$l]||h==="SCRIPT"||h==="STYLE"||h==="LINK"&&n.rel.toLowerCase()==="stylesheet"||s.removeChild(n),n=c}}else s==="body"&&Sr(e.ownerDocument.body);s=r}while(s);_l(a)}function bh(e,a){var s=e;e=0;do{var l=s.nextSibling;if(s.nodeType===1?a?(s._stashedDisplay=s.style.display,s.style.display="none"):(s.style.display=s._stashedDisplay||"",s.getAttribute("style")===""&&s.removeAttribute("style")):s.nodeType===3&&(a?(s._stashedText=s.nodeValue,s.nodeValue=""):s.nodeValue=s._stashedText||""),l&&l.nodeType===8)if(s=l.data,s==="/$"){if(e===0)break;e--}else s!=="$"&&s!=="$?"&&s!=="$~"&&s!=="$!"||e++;s=l}while(s)}function yo(e){var a=e.firstChild;for(a&&a.nodeType===10&&(a=a.nextSibling);a;){var s=a;switch(a=a.nextSibling,s.nodeName){case"HTML":case"HEAD":case"BODY":yo(s),Ci(s);continue;case"SCRIPT":case"STYLE":continue;case"LINK":if(s.rel.toLowerCase()==="stylesheet")continue}e.removeChild(s)}}function M0(e,a,s,l){for(;e.nodeType===1;){var r=s;if(e.nodeName.toLowerCase()!==a.toLowerCase()){if(!l&&(e.nodeName!=="INPUT"||e.type!=="hidden"))break}else if(l){if(!e[$l])switch(a){case"meta":if(!e.hasAttribute("itemprop"))break;return e;case"link":if(n=e.getAttribute("rel"),n==="stylesheet"&&e.hasAttribute("data-precedence"))break;if(n!==r.rel||e.getAttribute("href")!==(r.href==null||r.href===""?null:r.href)||e.getAttribute("crossorigin")!==(r.crossOrigin==null?null:r.crossOrigin)||e.getAttribute("title")!==(r.title==null?null:r.title))break;return e;case"style":if(e.hasAttribute("data-precedence"))break;return e;case"script":if(n=e.getAttribute("src"),(n!==(r.src==null?null:r.src)||e.getAttribute("type")!==(r.type==null?null:r.type)||e.getAttribute("crossorigin")!==(r.crossOrigin==null?null:r.crossOrigin))&&n&&e.hasAttribute("async")&&!e.hasAttribute("itemprop"))break;return e;default:return e}}else if(a==="input"&&e.type==="hidden"){var n=r.name==null?null:""+r.name;if(r.type==="hidden"&&e.getAttribute("name")===n)return e}else return e;if(e=It(e.nextSibling),e===null)break}return null}function D0(e,a,s){if(a==="")return null;for(;e.nodeType!==3;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!s||(e=It(e.nextSibling),e===null))return null;return e}function vh(e,a){for(;e.nodeType!==8;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!a||(e=It(e.nextSibling),e===null))return null;return e}function jo(e){return e.data==="$?"||e.data==="$~"}function No(e){return e.data==="$!"||e.data==="$?"&&e.ownerDocument.readyState!=="loading"}function _0(e,a){var s=e.ownerDocument;if(e.data==="$~")e._reactRetry=a;else if(e.data!=="$?"||s.readyState!=="loading")a();else{var l=function(){a(),s.removeEventListener("DOMContentLoaded",l)};s.addEventListener("DOMContentLoaded",l),e._reactRetry=l}}function It(e){for(;e!=null;e=e.nextSibling){var a=e.nodeType;if(a===1||a===3)break;if(a===8){if(a=e.data,a==="$"||a==="$!"||a==="$?"||a==="$~"||a==="&"||a==="F!"||a==="F")break;if(a==="/$"||a==="/&")return null}}return e}var wo=null;function yh(e){e=e.nextSibling;for(var a=0;e;){if(e.nodeType===8){var s=e.data;if(s==="/$"||s==="/&"){if(a===0)return It(e.nextSibling);a--}else s!=="$"&&s!=="$!"&&s!=="$?"&&s!=="$~"&&s!=="&"||a++}e=e.nextSibling}return null}function jh(e){e=e.previousSibling;for(var a=0;e;){if(e.nodeType===8){var s=e.data;if(s==="$"||s==="$!"||s==="$?"||s==="$~"||s==="&"){if(a===0)return e;a--}else s!=="/$"&&s!=="/&"||a++}e=e.previousSibling}return null}function Nh(e,a,s){switch(a=Jn(s),e){case"html":if(e=a.documentElement,!e)throw Error(d(452));return e;case"head":if(e=a.head,!e)throw Error(d(453));return e;case"body":if(e=a.body,!e)throw Error(d(454));return e;default:throw Error(d(451))}}function Sr(e){for(var a=e.attributes;a.length;)e.removeAttributeNode(a[0]);Ci(e)}var ea=new Map,wh=new Set;function Pn(e){return typeof e.getRootNode=="function"?e.getRootNode():e.nodeType===9?e:e.ownerDocument}var Ba=K.d;K.d={f:A0,r:R0,D:q0,C:O0,L:L0,m:U0,X:B0,S:H0,M:Y0};function A0(){var e=Ba.f(),a=Yn();return e||a}function R0(e){var a=Ws(e);a!==null&&a.tag===5&&a.type==="form"?Bu(a):Ba.r(e)}var Tl=typeof document>"u"?null:document;function Ch(e,a,s){var l=Tl;if(l&&typeof a=="string"&&a){var r=Zt(a);r='link[rel="'+e+'"][href="'+r+'"]',typeof s=="string"&&(r+='[crossorigin="'+s+'"]'),wh.has(r)||(wh.add(r),e={rel:e,crossOrigin:s,href:a},l.querySelector(r)===null&&(a=l.createElement("link"),jt(a,"link",e),ht(a),l.head.appendChild(a)))}}function q0(e){Ba.D(e),Ch("dns-prefetch",e,null)}function O0(e,a){Ba.C(e,a),Ch("preconnect",e,a)}function L0(e,a,s){Ba.L(e,a,s);var l=Tl;if(l&&e&&a){var r='link[rel="preload"][as="'+Zt(a)+'"]';a==="image"&&s&&s.imageSrcSet?(r+='[imagesrcset="'+Zt(s.imageSrcSet)+'"]',typeof s.imageSizes=="string"&&(r+='[imagesizes="'+Zt(s.imageSizes)+'"]')):r+='[href="'+Zt(e)+'"]';var n=r;switch(a){case"style":n=Ml(e);break;case"script":n=Dl(e)}ea.has(n)||(e=p({rel:"preload",href:a==="image"&&s&&s.imageSrcSet?void 0:e,as:a},s),ea.set(n,e),l.querySelector(r)!==null||a==="style"&&l.querySelector(Er(n))||a==="script"&&l.querySelector(zr(n))||(a=l.createElement("link"),jt(a,"link",e),ht(a),l.head.appendChild(a)))}}function U0(e,a){Ba.m(e,a);var s=Tl;if(s&&e){var l=a&&typeof a.as=="string"?a.as:"script",r='link[rel="modulepreload"][as="'+Zt(l)+'"][href="'+Zt(e)+'"]',n=r;switch(l){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":n=Dl(e)}if(!ea.has(n)&&(e=p({rel:"modulepreload",href:e},a),ea.set(n,e),s.querySelector(r)===null)){switch(l){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":if(s.querySelector(zr(n)))return}l=s.createElement("link"),jt(l,"link",e),ht(l),s.head.appendChild(l)}}}function H0(e,a,s){Ba.S(e,a,s);var l=Tl;if(l&&e){var r=Fs(l).hoistableStyles,n=Ml(e);a=a||"default";var c=r.get(n);if(!c){var h={loading:0,preload:null};if(c=l.querySelector(Er(n)))h.loading=5;else{e=p({rel:"stylesheet",href:e,"data-precedence":a},s),(s=ea.get(n))&&Co(e,s);var y=c=l.createElement("link");ht(y),jt(y,"link",e),y._p=new Promise(function(_,B){y.onload=_,y.onerror=B}),y.addEventListener("load",function(){h.loading|=1}),y.addEventListener("error",function(){h.loading|=2}),h.loading|=4,Wn(c,a,l)}c={type:"stylesheet",instance:c,count:1,state:h},r.set(n,c)}}}function B0(e,a){Ba.X(e,a);var s=Tl;if(s&&e){var l=Fs(s).hoistableScripts,r=Dl(e),n=l.get(r);n||(n=s.querySelector(zr(r)),n||(e=p({src:e,async:!0},a),(a=ea.get(r))&&So(e,a),n=s.createElement("script"),ht(n),jt(n,"link",e),s.head.appendChild(n)),n={type:"script",instance:n,count:1,state:null},l.set(r,n))}}function Y0(e,a){Ba.M(e,a);var s=Tl;if(s&&e){var l=Fs(s).hoistableScripts,r=Dl(e),n=l.get(r);n||(n=s.querySelector(zr(r)),n||(e=p({src:e,async:!0,type:"module"},a),(a=ea.get(r))&&So(e,a),n=s.createElement("script"),ht(n),jt(n,"link",e),s.head.appendChild(n)),n={type:"script",instance:n,count:1,state:null},l.set(r,n))}}function Sh(e,a,s,l){var r=(r=xe.current)?Pn(r):null;if(!r)throw Error(d(446));switch(e){case"meta":case"title":return null;case"style":return typeof s.precedence=="string"&&typeof s.href=="string"?(a=Ml(s.href),s=Fs(r).hoistableStyles,l=s.get(a),l||(l={type:"style",instance:null,count:0,state:null},s.set(a,l)),l):{type:"void",instance:null,count:0,state:null};case"link":if(s.rel==="stylesheet"&&typeof s.href=="string"&&typeof s.precedence=="string"){e=Ml(s.href);var n=Fs(r).hoistableStyles,c=n.get(e);if(c||(r=r.ownerDocument||r,c={type:"stylesheet",instance:null,count:0,state:{loading:0,preload:null}},n.set(e,c),(n=r.querySelector(Er(e)))&&!n._p&&(c.instance=n,c.state.loading=5),ea.has(e)||(s={rel:"preload",as:"style",href:s.href,crossOrigin:s.crossOrigin,integrity:s.integrity,media:s.media,hrefLang:s.hrefLang,referrerPolicy:s.referrerPolicy},ea.set(e,s),n||V0(r,e,s,c.state))),a&&l===null)throw Error(d(528,""));return c}if(a&&l!==null)throw Error(d(529,""));return null;case"script":return a=s.async,s=s.src,typeof s=="string"&&a&&typeof a!="function"&&typeof a!="symbol"?(a=Dl(s),s=Fs(r).hoistableScripts,l=s.get(a),l||(l={type:"script",instance:null,count:0,state:null},s.set(a,l)),l):{type:"void",instance:null,count:0,state:null};default:throw Error(d(444,e))}}function Ml(e){return'href="'+Zt(e)+'"'}function Er(e){return'link[rel="stylesheet"]['+e+"]"}function Eh(e){return p({},e,{"data-precedence":e.precedence,precedence:null})}function V0(e,a,s,l){e.querySelector('link[rel="preload"][as="style"]['+a+"]")?l.loading=1:(a=e.createElement("link"),l.preload=a,a.addEventListener("load",function(){return l.loading|=1}),a.addEventListener("error",function(){return l.loading|=2}),jt(a,"link",s),ht(a),e.head.appendChild(a))}function Dl(e){return'[src="'+Zt(e)+'"]'}function zr(e){return"script[async]"+e}function zh(e,a,s){if(a.count++,a.instance===null)switch(a.type){case"style":var l=e.querySelector('style[data-href~="'+Zt(s.href)+'"]');if(l)return a.instance=l,ht(l),l;var r=p({},s,{"data-href":s.href,"data-precedence":s.precedence,href:null,precedence:null});return l=(e.ownerDocument||e).createElement("style"),ht(l),jt(l,"style",r),Wn(l,s.precedence,e),a.instance=l;case"stylesheet":r=Ml(s.href);var n=e.querySelector(Er(r));if(n)return a.state.loading|=4,a.instance=n,ht(n),n;l=Eh(s),(r=ea.get(r))&&Co(l,r),n=(e.ownerDocument||e).createElement("link"),ht(n);var c=n;return c._p=new Promise(function(h,y){c.onload=h,c.onerror=y}),jt(n,"link",l),a.state.loading|=4,Wn(n,s.precedence,e),a.instance=n;case"script":return n=Dl(s.src),(r=e.querySelector(zr(n)))?(a.instance=r,ht(r),r):(l=s,(r=ea.get(n))&&(l=p({},s),So(l,r)),e=e.ownerDocument||e,r=e.createElement("script"),ht(r),jt(r,"link",l),e.head.appendChild(r),a.instance=r);case"void":return null;default:throw Error(d(443,a.type))}else a.type==="stylesheet"&&(a.state.loading&4)===0&&(l=a.instance,a.state.loading|=4,Wn(l,s.precedence,e));return a.instance}function Wn(e,a,s){for(var l=s.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),r=l.length?l[l.length-1]:null,n=r,c=0;c<l.length;c++){var h=l[c];if(h.dataset.precedence===a)n=h;else if(n!==r)break}n?n.parentNode.insertBefore(e,n.nextSibling):(a=s.nodeType===9?s.head:s,a.insertBefore(e,a.firstChild))}function Co(e,a){e.crossOrigin==null&&(e.crossOrigin=a.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=a.referrerPolicy),e.title==null&&(e.title=a.title)}function So(e,a){e.crossOrigin==null&&(e.crossOrigin=a.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=a.referrerPolicy),e.integrity==null&&(e.integrity=a.integrity)}var Fn=null;function kh(e,a,s){if(Fn===null){var l=new Map,r=Fn=new Map;r.set(s,l)}else r=Fn,l=r.get(s),l||(l=new Map,r.set(s,l));if(l.has(e))return l;for(l.set(e,null),s=s.getElementsByTagName(e),r=0;r<s.length;r++){var n=s[r];if(!(n[$l]||n[Pe]||e==="link"&&n.getAttribute("rel")==="stylesheet")&&n.namespaceURI!=="http://www.w3.org/2000/svg"){var c=n.getAttribute(a)||"";c=e+c;var h=l.get(c);h?h.push(n):l.set(c,[n])}}return l}function Th(e,a,s){e=e.ownerDocument||e,e.head.insertBefore(s,a==="title"?e.querySelector("head > title"):null)}function $0(e,a,s){if(s===1||a.itemProp!=null)return!1;switch(e){case"meta":case"title":return!0;case"style":if(typeof a.precedence!="string"||typeof a.href!="string"||a.href==="")break;return!0;case"link":if(typeof a.rel!="string"||typeof a.href!="string"||a.href===""||a.onLoad||a.onError)break;return a.rel==="stylesheet"?(e=a.disabled,typeof a.precedence=="string"&&e==null):!0;case"script":if(a.async&&typeof a.async!="function"&&typeof a.async!="symbol"&&!a.onLoad&&!a.onError&&a.src&&typeof a.src=="string")return!0}return!1}function Mh(e){return!(e.type==="stylesheet"&&(e.state.loading&3)===0)}function X0(e,a,s,l){if(s.type==="stylesheet"&&(typeof l.media!="string"||matchMedia(l.media).matches!==!1)&&(s.state.loading&4)===0){if(s.instance===null){var r=Ml(l.href),n=a.querySelector(Er(r));if(n){a=n._p,a!==null&&typeof a=="object"&&typeof a.then=="function"&&(e.count++,e=In.bind(e),a.then(e,e)),s.state.loading|=4,s.instance=n,ht(n);return}n=a.ownerDocument||a,l=Eh(l),(r=ea.get(r))&&Co(l,r),n=n.createElement("link"),ht(n);var c=n;c._p=new Promise(function(h,y){c.onload=h,c.onerror=y}),jt(n,"link",l),s.instance=n}e.stylesheets===null&&(e.stylesheets=new Map),e.stylesheets.set(s,a),(a=s.state.preload)&&(s.state.loading&3)===0&&(e.count++,s=In.bind(e),a.addEventListener("load",s),a.addEventListener("error",s))}}var Eo=0;function G0(e,a){return e.stylesheets&&e.count===0&&ti(e,e.stylesheets),0<e.count||0<e.imgCount?function(s){var l=setTimeout(function(){if(e.stylesheets&&ti(e,e.stylesheets),e.unsuspend){var n=e.unsuspend;e.unsuspend=null,n()}},6e4+a);0<e.imgBytes&&Eo===0&&(Eo=62500*S0());var r=setTimeout(function(){if(e.waitingForImages=!1,e.count===0&&(e.stylesheets&&ti(e,e.stylesheets),e.unsuspend)){var n=e.unsuspend;e.unsuspend=null,n()}},(e.imgBytes>Eo?50:800)+a);return e.unsuspend=s,function(){e.unsuspend=null,clearTimeout(l),clearTimeout(r)}}:null}function In(){if(this.count--,this.count===0&&(this.imgCount===0||!this.waitingForImages)){if(this.stylesheets)ti(this,this.stylesheets);else if(this.unsuspend){var e=this.unsuspend;this.unsuspend=null,e()}}}var ei=null;function ti(e,a){e.stylesheets=null,e.unsuspend!==null&&(e.count++,ei=new Map,a.forEach(Z0,e),ei=null,In.call(e))}function Z0(e,a){if(!(a.state.loading&4)){var s=ei.get(e);if(s)var l=s.get(null);else{s=new Map,ei.set(e,s);for(var r=e.querySelectorAll("link[data-precedence],style[data-precedence]"),n=0;n<r.length;n++){var c=r[n];(c.nodeName==="LINK"||c.getAttribute("media")!=="not all")&&(s.set(c.dataset.precedence,c),l=c)}l&&s.set(null,l)}r=a.instance,c=r.getAttribute("data-precedence"),n=s.get(c)||l,n===l&&s.set(null,r),s.set(c,r),this.count++,l=In.bind(this),r.addEventListener("load",l),r.addEventListener("error",l),n?n.parentNode.insertBefore(r,n.nextSibling):(e=e.nodeType===9?e.head:e,e.insertBefore(r,e.firstChild)),a.state.loading|=4}}var kr={$$typeof:$,Provider:null,Consumer:null,_currentValue:ne,_currentValue2:ne,_threadCount:0};function Q0(e,a,s,l,r,n,c,h,y){this.tag=1,this.containerInfo=e,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=Js(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Js(0),this.hiddenUpdates=Js(null),this.identifierPrefix=l,this.onUncaughtError=r,this.onCaughtError=n,this.onRecoverableError=c,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=y,this.incompleteTransitions=new Map}function Dh(e,a,s,l,r,n,c,h,y,_,B,G){return e=new Q0(e,a,s,c,y,_,B,G,h),a=1,n===!0&&(a|=24),n=Ot(3,null,null,a),e.current=n,n.stateNode=e,a=lc(),a.refCount++,e.pooledCache=a,a.refCount++,n.memoizedState={element:l,isDehydrated:s,cache:a},cc(n),e}function _h(e){return e?(e=cl,e):cl}function Ah(e,a,s,l,r,n){r=_h(r),l.context===null?l.context=r:l.pendingContext=r,l=Fa(a),l.payload={element:s},n=n===void 0?null:n,n!==null&&(l.callback=n),s=Ia(e,l,a),s!==null&&(At(s,e,a),nr(s,e,a))}function Rh(e,a){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var s=e.retryLane;e.retryLane=s!==0&&s<a?s:a}}function zo(e,a){Rh(e,a),(e=e.alternate)&&Rh(e,a)}function qh(e){if(e.tag===13||e.tag===31){var a=zs(e,67108864);a!==null&&At(a,e,67108864),zo(e,67108864)}}function Oh(e){if(e.tag===13||e.tag===31){var a=Yt();a=oe(a);var s=zs(e,a);s!==null&&At(s,e,a),zo(e,a)}}var ai=!0;function K0(e,a,s,l){var r=H.T;H.T=null;var n=K.p;try{K.p=2,ko(e,a,s,l)}finally{K.p=n,H.T=r}}function J0(e,a,s,l){var r=H.T;H.T=null;var n=K.p;try{K.p=8,ko(e,a,s,l)}finally{K.p=n,H.T=r}}function ko(e,a,s,l){if(ai){var r=To(l);if(r===null)xo(e,a,l,si,s),Uh(e,l);else if(W0(r,e,a,s,l))l.stopPropagation();else if(Uh(e,l),a&4&&-1<P0.indexOf(e)){for(;r!==null;){var n=Ws(r);if(n!==null)switch(n.tag){case 3:if(n=n.stateNode,n.current.memoizedState.isDehydrated){var c=$t(n.pendingLanes);if(c!==0){var h=n;for(h.pendingLanes|=2,h.entangledLanes|=2;c;){var y=1<<31-St(c);h.entanglements[1]|=y,c&=~y}xa(n),(Re&6)===0&&(Hn=Ct()+500,Nr(0))}}break;case 31:case 13:h=zs(n,2),h!==null&&At(h,n,2),Yn(),zo(n,2)}if(n=To(l),n===null&&xo(e,a,l,si,s),n===r)break;r=n}r!==null&&l.stopPropagation()}else xo(e,a,l,null,s)}}function To(e){return e=Mi(e),Mo(e)}var si=null;function Mo(e){if(si=null,e=Ps(e),e!==null){var a=b(e);if(a===null)e=null;else{var s=a.tag;if(s===13){if(e=m(a),e!==null)return e;e=null}else if(s===31){if(e=N(a),e!==null)return e;e=null}else if(s===3){if(a.stateNode.current.memoizedState.isDehydrated)return a.tag===3?a.stateNode.containerInfo:null;e=null}else a!==e&&(e=null)}}return si=e,null}function Lh(e){switch(e){case"beforetoggle":case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"toggle":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 2;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 8;case"message":switch(Gr()){case Ae:return 2;case Yl:return 8;case ja:case vi:return 32;case Na:return 268435456;default:return 32}default:return 32}}var Do=!1,ds=null,us=null,ms=null,Tr=new Map,Mr=new Map,hs=[],P0="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");function Uh(e,a){switch(e){case"focusin":case"focusout":ds=null;break;case"dragenter":case"dragleave":us=null;break;case"mouseover":case"mouseout":ms=null;break;case"pointerover":case"pointerout":Tr.delete(a.pointerId);break;case"gotpointercapture":case"lostpointercapture":Mr.delete(a.pointerId)}}function Dr(e,a,s,l,r,n){return e===null||e.nativeEvent!==n?(e={blockedOn:a,domEventName:s,eventSystemFlags:l,nativeEvent:n,targetContainers:[r]},a!==null&&(a=Ws(a),a!==null&&qh(a)),e):(e.eventSystemFlags|=l,a=e.targetContainers,r!==null&&a.indexOf(r)===-1&&a.push(r),e)}function W0(e,a,s,l,r){switch(a){case"focusin":return ds=Dr(ds,e,a,s,l,r),!0;case"dragenter":return us=Dr(us,e,a,s,l,r),!0;case"mouseover":return ms=Dr(ms,e,a,s,l,r),!0;case"pointerover":var n=r.pointerId;return Tr.set(n,Dr(Tr.get(n)||null,e,a,s,l,r)),!0;case"gotpointercapture":return n=r.pointerId,Mr.set(n,Dr(Mr.get(n)||null,e,a,s,l,r)),!0}return!1}function Hh(e){var a=Ps(e.target);if(a!==null){var s=b(a);if(s!==null){if(a=s.tag,a===13){if(a=m(s),a!==null){e.blockedOn=a,Rt(e.priority,function(){Oh(s)});return}}else if(a===31){if(a=N(s),a!==null){e.blockedOn=a,Rt(e.priority,function(){Oh(s)});return}}else if(a===3&&s.stateNode.current.memoizedState.isDehydrated){e.blockedOn=s.tag===3?s.stateNode.containerInfo:null;return}}}e.blockedOn=null}function li(e){if(e.blockedOn!==null)return!1;for(var a=e.targetContainers;0<a.length;){var s=To(e.nativeEvent);if(s===null){s=e.nativeEvent;var l=new s.constructor(s.type,s);Ti=l,s.target.dispatchEvent(l),Ti=null}else return a=Ws(s),a!==null&&qh(a),e.blockedOn=s,!1;a.shift()}return!0}function Bh(e,a,s){li(e)&&s.delete(a)}function F0(){Do=!1,ds!==null&&li(ds)&&(ds=null),us!==null&&li(us)&&(us=null),ms!==null&&li(ms)&&(ms=null),Tr.forEach(Bh),Mr.forEach(Bh)}function ri(e,a){e.blockedOn===a&&(e.blockedOn=null,Do||(Do=!0,i.unstable_scheduleCallback(i.unstable_NormalPriority,F0)))}var ni=null;function Yh(e){ni!==e&&(ni=e,i.unstable_scheduleCallback(i.unstable_NormalPriority,function(){ni===e&&(ni=null);for(var a=0;a<e.length;a+=3){var s=e[a],l=e[a+1],r=e[a+2];if(typeof l!="function"){if(Mo(l||s)===null)continue;break}var n=Ws(s);n!==null&&(e.splice(a,3),a-=3,kc(n,{pending:!0,data:r,method:s.method,action:l},l,r))}}))}function _l(e){function a(y){return ri(y,e)}ds!==null&&ri(ds,e),us!==null&&ri(us,e),ms!==null&&ri(ms,e),Tr.forEach(a),Mr.forEach(a);for(var s=0;s<hs.length;s++){var l=hs[s];l.blockedOn===e&&(l.blockedOn=null)}for(;0<hs.length&&(s=hs[0],s.blockedOn===null);)Hh(s),s.blockedOn===null&&hs.shift();if(s=(e.ownerDocument||e).$$reactFormReplay,s!=null)for(l=0;l<s.length;l+=3){var r=s[l],n=s[l+1],c=r[We]||null;if(typeof n=="function")c||Yh(s);else if(c){var h=null;if(n&&n.hasAttribute("formAction")){if(r=n,c=n[We]||null)h=c.formAction;else if(Mo(r)!==null)continue}else h=c.action;typeof h=="function"?s[l+1]=h:(s.splice(l,3),l-=3),Yh(s)}}}function Vh(){function e(n){n.canIntercept&&n.info==="react-transition"&&n.intercept({handler:function(){return new Promise(function(c){return r=c})},focusReset:"manual",scroll:"manual"})}function a(){r!==null&&(r(),r=null),l||setTimeout(s,20)}function s(){if(!l&&!navigation.transition){var n=navigation.currentEntry;n&&n.url!=null&&navigation.navigate(n.url,{state:n.getState(),info:"react-transition",history:"replace"})}}if(typeof navigation=="object"){var l=!1,r=null;return navigation.addEventListener("navigate",e),navigation.addEventListener("navigatesuccess",a),navigation.addEventListener("navigateerror",a),setTimeout(s,100),function(){l=!0,navigation.removeEventListener("navigate",e),navigation.removeEventListener("navigatesuccess",a),navigation.removeEventListener("navigateerror",a),r!==null&&(r(),r=null)}}}function _o(e){this._internalRoot=e}ii.prototype.render=_o.prototype.render=function(e){var a=this._internalRoot;if(a===null)throw Error(d(409));var s=a.current,l=Yt();Ah(s,l,e,a,null,null)},ii.prototype.unmount=_o.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var a=e.containerInfo;Ah(e.current,2,null,e,null,null),Yn(),a[ze]=null}};function ii(e){this._internalRoot=e}ii.prototype.unstable_scheduleHydration=function(e){if(e){var a=ge();e={blockedOn:null,target:e,priority:a};for(var s=0;s<hs.length&&a!==0&&a<hs[s].priority;s++);hs.splice(s,0,e),s===0&&Hh(e)}};var $h=u.version;if($h!=="19.2.4")throw Error(d(527,$h,"19.2.4"));K.findDOMNode=function(e){var a=e._reactInternals;if(a===void 0)throw typeof e.render=="function"?Error(d(188)):(e=Object.keys(e).join(","),Error(d(268,e)));return e=g(a),e=e!==null?j(e):null,e=e===null?null:e.stateNode,e};var I0={bundleType:0,version:"19.2.4",rendererPackageName:"react-dom",currentDispatcherRef:H,reconcilerVersion:"19.2.4"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var ci=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!ci.isDisabled&&ci.supportsFiber)try{Xa=ci.inject(I0),gt=ci}catch{}}return Ar.createRoot=function(e,a){if(!x(e))throw Error(d(299));var s=!1,l="",r=Pu,n=Wu,c=Fu;return a!=null&&(a.unstable_strictMode===!0&&(s=!0),a.identifierPrefix!==void 0&&(l=a.identifierPrefix),a.onUncaughtError!==void 0&&(r=a.onUncaughtError),a.onCaughtError!==void 0&&(n=a.onCaughtError),a.onRecoverableError!==void 0&&(c=a.onRecoverableError)),a=Dh(e,1,!1,null,null,s,l,null,r,n,c,Vh),e[ze]=a.current,ho(e),new _o(a)},Ar.hydrateRoot=function(e,a,s){if(!x(e))throw Error(d(299));var l=!1,r="",n=Pu,c=Wu,h=Fu,y=null;return s!=null&&(s.unstable_strictMode===!0&&(l=!0),s.identifierPrefix!==void 0&&(r=s.identifierPrefix),s.onUncaughtError!==void 0&&(n=s.onUncaughtError),s.onCaughtError!==void 0&&(c=s.onCaughtError),s.onRecoverableError!==void 0&&(h=s.onRecoverableError),s.formState!==void 0&&(y=s.formState)),a=Dh(e,1,!0,a,s??null,l,r,y,n,c,h,Vh),a.context=_h(null),s=a.current,l=Yt(),l=oe(l),r=Fa(l),r.callback=null,Ia(s,r,l),s=l,a.current.lanes=s,Ga(a,s),xa(a),e[ze]=a.current,ho(e),new ii(a)},Ar.version="19.2.4",Ar}var Ih;function op(){if(Ih)return qo.exports;Ih=1;function i(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(i)}catch(u){console.error(u)}}return i(),qo.exports=cp(),qo.exports}var dp=op();var ex="popstate";function up(i={}){function u(d,x){let{pathname:b,search:m,hash:N}=d.location;return $o("",{pathname:b,search:m,hash:N},x.state&&x.state.usr||null,x.state&&x.state.key||"default")}function o(d,x){return typeof x=="string"?x:Lr(x)}return hp(u,o,null,i)}function Je(i,u){if(i===!1||i===null||typeof i>"u")throw new Error(u)}function fa(i,u){if(!i){typeof console<"u"&&console.warn(u);try{throw new Error(u)}catch{}}}function mp(){return Math.random().toString(36).substring(2,10)}function tx(i,u){return{usr:i.state,key:i.key,idx:u}}function $o(i,u,o=null,d){return{pathname:typeof i=="string"?i:i.pathname,search:"",hash:"",...typeof u=="string"?Ll(u):u,state:o,key:u&&u.key||d||mp()}}function Lr({pathname:i="/",search:u="",hash:o=""}){return u&&u!=="?"&&(i+=u.charAt(0)==="?"?u:"?"+u),o&&o!=="#"&&(i+=o.charAt(0)==="#"?o:"#"+o),i}function Ll(i){let u={};if(i){let o=i.indexOf("#");o>=0&&(u.hash=i.substring(o),i=i.substring(0,o));let d=i.indexOf("?");d>=0&&(u.search=i.substring(d),i=i.substring(0,d)),i&&(u.pathname=i)}return u}function hp(i,u,o,d={}){let{window:x=document.defaultView,v5Compat:b=!1}=d,m=x.history,N="POP",f=null,g=j();g==null&&(g=0,m.replaceState({...m.state,idx:g},""));function j(){return(m.state||{idx:null}).idx}function p(){N="POP";let k=j(),A=k==null?null:k-g;g=k,f&&f({action:N,location:w.location,delta:A})}function E(k,A){N="PUSH";let O=$o(w.location,k,A);g=j()+1;let $=tx(O,g),Y=w.createHref(O);try{m.pushState($,"",Y)}catch(Z){if(Z instanceof DOMException&&Z.name==="DataCloneError")throw Z;x.location.assign(Y)}b&&f&&f({action:N,location:w.location,delta:1})}function L(k,A){N="REPLACE";let O=$o(w.location,k,A);g=j();let $=tx(O,g),Y=w.createHref(O);m.replaceState($,"",Y),b&&f&&f({action:N,location:w.location,delta:0})}function M(k){return xp(k)}let w={get action(){return N},get location(){return i(x,m)},listen(k){if(f)throw new Error("A history only accepts one active listener");return x.addEventListener(ex,p),f=k,()=>{x.removeEventListener(ex,p),f=null}},createHref(k){return u(x,k)},createURL:M,encodeLocation(k){let A=M(k);return{pathname:A.pathname,search:A.search,hash:A.hash}},push:E,replace:L,go(k){return m.go(k)}};return w}function xp(i,u=!1){let o="http://localhost";typeof window<"u"&&(o=window.location.origin!=="null"?window.location.origin:window.location.href),Je(o,"No window.location.(origin|href) available to create URL");let d=typeof i=="string"?i:Lr(i);return d=d.replace(/ $/,"%20"),!u&&d.startsWith("//")&&(d=o+d),new URL(d,o)}function hx(i,u,o="/"){return fp(i,u,o,!1)}function fp(i,u,o,d){let x=typeof u=="string"?Ll(u):u,b=Va(x.pathname||"/",o);if(b==null)return null;let m=xx(i);pp(m);let N=null;for(let f=0;N==null&&f<m.length;++f){let g=zp(b);N=Sp(m[f],g,d)}return N}function xx(i,u=[],o=[],d="",x=!1){let b=(m,N,f=x,g)=>{let j={relativePath:g===void 0?m.path||"":g,caseSensitive:m.caseSensitive===!0,childrenIndex:N,route:m};if(j.relativePath.startsWith("/")){if(!j.relativePath.startsWith(d)&&f)return;Je(j.relativePath.startsWith(d),`Absolute route path "${j.relativePath}" nested under path "${d}" is not valid. An absolute child route path must start with the combined path of all its parent routes.`),j.relativePath=j.relativePath.slice(d.length)}let p=Ya([d,j.relativePath]),E=o.concat(j);m.children&&m.children.length>0&&(Je(m.index!==!0,`Index routes must not have child routes. Please remove all child routes from route path "${p}".`),xx(m.children,u,E,p,f)),!(m.path==null&&!m.index)&&u.push({path:p,score:wp(p,m.index),routesMeta:E})};return i.forEach((m,N)=>{if(m.path===""||!m.path?.includes("?"))b(m,N);else for(let f of fx(m.path))b(m,N,!0,f)}),u}function fx(i){let u=i.split("/");if(u.length===0)return[];let[o,...d]=u,x=o.endsWith("?"),b=o.replace(/\?$/,"");if(d.length===0)return x?[b,""]:[b];let m=fx(d.join("/")),N=[];return N.push(...m.map(f=>f===""?b:[b,f].join("/"))),x&&N.push(...m),N.map(f=>i.startsWith("/")&&f===""?"/":f)}function pp(i){i.sort((u,o)=>u.score!==o.score?o.score-u.score:Cp(u.routesMeta.map(d=>d.childrenIndex),o.routesMeta.map(d=>d.childrenIndex)))}var gp=/^:[\w-]+$/,bp=3,vp=2,yp=1,jp=10,Np=-2,ax=i=>i==="*";function wp(i,u){let o=i.split("/"),d=o.length;return o.some(ax)&&(d+=Np),u&&(d+=vp),o.filter(x=>!ax(x)).reduce((x,b)=>x+(gp.test(b)?bp:b===""?yp:jp),d)}function Cp(i,u){return i.length===u.length&&i.slice(0,-1).every((d,x)=>d===u[x])?i[i.length-1]-u[u.length-1]:0}function Sp(i,u,o=!1){let{routesMeta:d}=i,x={},b="/",m=[];for(let N=0;N<d.length;++N){let f=d[N],g=N===d.length-1,j=b==="/"?u:u.slice(b.length)||"/",p=mi({path:f.relativePath,caseSensitive:f.caseSensitive,end:g},j),E=f.route;if(!p&&g&&o&&!d[d.length-1].route.index&&(p=mi({path:f.relativePath,caseSensitive:f.caseSensitive,end:!1},j)),!p)return null;Object.assign(x,p.params),m.push({params:x,pathname:Ya([b,p.pathname]),pathnameBase:Dp(Ya([b,p.pathnameBase])),route:E}),p.pathnameBase!=="/"&&(b=Ya([b,p.pathnameBase]))}return m}function mi(i,u){typeof i=="string"&&(i={path:i,caseSensitive:!1,end:!0});let[o,d]=Ep(i.path,i.caseSensitive,i.end),x=u.match(o);if(!x)return null;let b=x[0],m=b.replace(/(.)\/+$/,"$1"),N=x.slice(1);return{params:d.reduce((g,{paramName:j,isOptional:p},E)=>{if(j==="*"){let M=N[E]||"";m=b.slice(0,b.length-M.length).replace(/(.)\/+$/,"$1")}const L=N[E];return p&&!L?g[j]=void 0:g[j]=(L||"").replace(/%2F/g,"/"),g},{}),pathname:b,pathnameBase:m,pattern:i}}function Ep(i,u=!1,o=!0){fa(i==="*"||!i.endsWith("*")||i.endsWith("/*"),`Route path "${i}" will be treated as if it were "${i.replace(/\*$/,"/*")}" because the \`*\` character must always follow a \`/\` in the pattern. To get rid of this warning, please change the route path to "${i.replace(/\*$/,"/*")}".`);let d=[],x="^"+i.replace(/\/*\*?$/,"").replace(/^\/*/,"/").replace(/[\\.*+^${}|()[\]]/g,"\\$&").replace(/\/:([\w-]+)(\?)?/g,(m,N,f)=>(d.push({paramName:N,isOptional:f!=null}),f?"/?([^\\/]+)?":"/([^\\/]+)")).replace(/\/([\w-]+)\?(\/|$)/g,"(/$1)?$2");return i.endsWith("*")?(d.push({paramName:"*"}),x+=i==="*"||i==="/*"?"(.*)$":"(?:\\/(.+)|\\/*)$"):o?x+="\\/*$":i!==""&&i!=="/"&&(x+="(?:(?=\\/|$))"),[new RegExp(x,u?void 0:"i"),d]}function zp(i){try{return i.split("/").map(u=>decodeURIComponent(u).replace(/\//g,"%2F")).join("/")}catch(u){return fa(!1,`The URL path "${i}" could not be decoded because it is a malformed URL segment. This is probably due to a bad percent encoding (${u}).`),i}}function Va(i,u){if(u==="/")return i;if(!i.toLowerCase().startsWith(u.toLowerCase()))return null;let o=u.endsWith("/")?u.length-1:u.length,d=i.charAt(o);return d&&d!=="/"?null:i.slice(o)||"/"}var kp=/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;function Tp(i,u="/"){let{pathname:o,search:d="",hash:x=""}=typeof i=="string"?Ll(i):i,b;return o?(o=o.replace(/\/\/+/g,"/"),o.startsWith("/")?b=sx(o.substring(1),"/"):b=sx(o,u)):b=u,{pathname:b,search:_p(d),hash:Ap(x)}}function sx(i,u){let o=u.replace(/\/+$/,"").split("/");return i.split("/").forEach(x=>{x===".."?o.length>1&&o.pop():x!=="."&&o.push(x)}),o.length>1?o.join("/"):"/"}function Ho(i,u,o,d){return`Cannot include a '${i}' character in a manually specified \`to.${u}\` field [${JSON.stringify(d)}].  Please separate it out to the \`to.${o}\` field. Alternatively you may provide the full path as a string in <Link to="..."> and the router will parse it for you.`}function Mp(i){return i.filter((u,o)=>o===0||u.route.path&&u.route.path.length>0)}function px(i){let u=Mp(i);return u.map((o,d)=>d===u.length-1?o.pathname:o.pathnameBase)}function gx(i,u,o,d=!1){let x;typeof i=="string"?x=Ll(i):(x={...i},Je(!x.pathname||!x.pathname.includes("?"),Ho("?","pathname","search",x)),Je(!x.pathname||!x.pathname.includes("#"),Ho("#","pathname","hash",x)),Je(!x.search||!x.search.includes("#"),Ho("#","search","hash",x)));let b=i===""||x.pathname==="",m=b?"/":x.pathname,N;if(m==null)N=o;else{let p=u.length-1;if(!d&&m.startsWith("..")){let E=m.split("/");for(;E[0]==="..";)E.shift(),p-=1;x.pathname=E.join("/")}N=p>=0?u[p]:"/"}let f=Tp(x,N),g=m&&m!=="/"&&m.endsWith("/"),j=(b||m===".")&&o.endsWith("/");return!f.pathname.endsWith("/")&&(g||j)&&(f.pathname+="/"),f}var Ya=i=>i.join("/").replace(/\/\/+/g,"/"),Dp=i=>i.replace(/\/+$/,"").replace(/^\/*/,"/"),_p=i=>!i||i==="?"?"":i.startsWith("?")?i:"?"+i,Ap=i=>!i||i==="#"?"":i.startsWith("#")?i:"#"+i,Rp=class{constructor(i,u,o,d=!1){this.status=i,this.statusText=u||"",this.internal=d,o instanceof Error?(this.data=o.toString(),this.error=o):this.data=o}};function qp(i){return i!=null&&typeof i.status=="number"&&typeof i.statusText=="string"&&typeof i.internal=="boolean"&&"data"in i}function Op(i){return i.map(u=>u.route.path).filter(Boolean).join("/").replace(/\/\/*/g,"/")||"/"}var bx=typeof window<"u"&&typeof window.document<"u"&&typeof window.document.createElement<"u";function vx(i,u){let o=i;if(typeof o!="string"||!kp.test(o))return{absoluteURL:void 0,isExternal:!1,to:o};let d=o,x=!1;if(bx)try{let b=new URL(window.location.href),m=o.startsWith("//")?new URL(b.protocol+o):new URL(o),N=Va(m.pathname,u);m.origin===b.origin&&N!=null?o=N+m.search+m.hash:x=!0}catch{fa(!1,`<Link to="${o}"> contains an invalid URL which will probably break when clicked - please update to a valid URL path.`)}return{absoluteURL:d,isExternal:x,to:o}}Object.getOwnPropertyNames(Object.prototype).sort().join("\0");var yx=["POST","PUT","PATCH","DELETE"];new Set(yx);var Lp=["GET",...yx];new Set(Lp);var Ul=v.createContext(null);Ul.displayName="DataRouter";var xi=v.createContext(null);xi.displayName="DataRouterState";var Up=v.createContext(!1),jx=v.createContext({isTransitioning:!1});jx.displayName="ViewTransition";var Hp=v.createContext(new Map);Hp.displayName="Fetchers";var Bp=v.createContext(null);Bp.displayName="Await";var aa=v.createContext(null);aa.displayName="Navigation";var Br=v.createContext(null);Br.displayName="Location";var $a=v.createContext({outlet:null,matches:[],isDataRoute:!1});$a.displayName="Route";var Qo=v.createContext(null);Qo.displayName="RouteError";var Nx="REACT_ROUTER_ERROR",Yp="REDIRECT",Vp="ROUTE_ERROR_RESPONSE";function $p(i){if(i.startsWith(`${Nx}:${Yp}:{`))try{let u=JSON.parse(i.slice(28));if(typeof u=="object"&&u&&typeof u.status=="number"&&typeof u.statusText=="string"&&typeof u.location=="string"&&typeof u.reloadDocument=="boolean"&&typeof u.replace=="boolean")return u}catch{}}function Xp(i){if(i.startsWith(`${Nx}:${Vp}:{`))try{let u=JSON.parse(i.slice(40));if(typeof u=="object"&&u&&typeof u.status=="number"&&typeof u.statusText=="string")return new Rp(u.status,u.statusText,u.data)}catch{}}function Gp(i,{relative:u}={}){Je(Yr(),"useHref() may be used only in the context of a <Router> component.");let{basename:o,navigator:d}=v.useContext(aa),{hash:x,pathname:b,search:m}=Vr(i,{relative:u}),N=b;return o!=="/"&&(N=b==="/"?o:Ya([o,b])),d.createHref({pathname:N,search:m,hash:x})}function Yr(){return v.useContext(Br)!=null}function Xs(){return Je(Yr(),"useLocation() may be used only in the context of a <Router> component."),v.useContext(Br).location}var wx="You should call navigate() in a React.useEffect(), not when your component is first rendered.";function Cx(i){v.useContext(aa).static||v.useLayoutEffect(i)}function Zp(){let{isDataRoute:i}=v.useContext($a);return i?rg():Qp()}function Qp(){Je(Yr(),"useNavigate() may be used only in the context of a <Router> component.");let i=v.useContext(Ul),{basename:u,navigator:o}=v.useContext(aa),{matches:d}=v.useContext($a),{pathname:x}=Xs(),b=JSON.stringify(px(d)),m=v.useRef(!1);return Cx(()=>{m.current=!0}),v.useCallback((f,g={})=>{if(fa(m.current,wx),!m.current)return;if(typeof f=="number"){o.go(f);return}let j=gx(f,JSON.parse(b),x,g.relative==="path");i==null&&u!=="/"&&(j.pathname=j.pathname==="/"?u:Ya([u,j.pathname])),(g.replace?o.replace:o.push)(j,g.state,g)},[u,o,b,x,i])}v.createContext(null);function Vr(i,{relative:u}={}){let{matches:o}=v.useContext($a),{pathname:d}=Xs(),x=JSON.stringify(px(o));return v.useMemo(()=>gx(i,JSON.parse(x),d,u==="path"),[i,x,d,u])}function Kp(i,u){return Sx(i,u)}function Sx(i,u,o,d,x){Je(Yr(),"useRoutes() may be used only in the context of a <Router> component.");let{navigator:b}=v.useContext(aa),{matches:m}=v.useContext($a),N=m[m.length-1],f=N?N.params:{},g=N?N.pathname:"/",j=N?N.pathnameBase:"/",p=N&&N.route;{let O=p&&p.path||"";zx(g,!p||O.endsWith("*")||O.endsWith("*?"),`You rendered descendant <Routes> (or called \`useRoutes()\`) at "${g}" (under <Route path="${O}">) but the parent route path has no trailing "*". This means if you navigate deeper, the parent won't match anymore and therefore the child routes will never render.

Please change the parent <Route path="${O}"> to <Route path="${O==="/"?"*":`${O}/*`}">.`)}let E=Xs(),L;if(u){let O=typeof u=="string"?Ll(u):u;Je(j==="/"||O.pathname?.startsWith(j),`When overriding the location using \`<Routes location>\` or \`useRoutes(routes, location)\`, the location pathname must begin with the portion of the URL pathname that was matched by all parent routes. The current pathname base is "${j}" but pathname "${O.pathname}" was given in the \`location\` prop.`),L=O}else L=E;let M=L.pathname||"/",w=M;if(j!=="/"){let O=j.replace(/^\//,"").split("/");w="/"+M.replace(/^\//,"").split("/").slice(O.length).join("/")}let k=hx(i,{pathname:w});fa(p||k!=null,`No routes matched location "${L.pathname}${L.search}${L.hash}" `),fa(k==null||k[k.length-1].route.element!==void 0||k[k.length-1].route.Component!==void 0||k[k.length-1].route.lazy!==void 0,`Matched leaf route at location "${L.pathname}${L.search}${L.hash}" does not have an element or Component. This means it will render an <Outlet /> with a null value by default resulting in an "empty" page.`);let A=Ip(k&&k.map(O=>Object.assign({},O,{params:Object.assign({},f,O.params),pathname:Ya([j,b.encodeLocation?b.encodeLocation(O.pathname.replace(/\?/g,"%3F").replace(/#/g,"%23")).pathname:O.pathname]),pathnameBase:O.pathnameBase==="/"?j:Ya([j,b.encodeLocation?b.encodeLocation(O.pathnameBase.replace(/\?/g,"%3F").replace(/#/g,"%23")).pathname:O.pathnameBase])})),m,o,d,x);return u&&A?v.createElement(Br.Provider,{value:{location:{pathname:"/",search:"",hash:"",state:null,key:"default",...L},navigationType:"POP"}},A):A}function Jp(){let i=lg(),u=qp(i)?`${i.status} ${i.statusText}`:i instanceof Error?i.message:JSON.stringify(i),o=i instanceof Error?i.stack:null,d="rgba(200,200,200, 0.5)",x={padding:"0.5rem",backgroundColor:d},b={padding:"2px 4px",backgroundColor:d},m=null;return console.error("Error handled by React Router default ErrorBoundary:",i),m=v.createElement(v.Fragment,null,v.createElement("p",null,"💿 Hey developer 👋"),v.createElement("p",null,"You can provide a way better UX than this when your app throws errors by providing your own ",v.createElement("code",{style:b},"ErrorBoundary")," or"," ",v.createElement("code",{style:b},"errorElement")," prop on your route.")),v.createElement(v.Fragment,null,v.createElement("h2",null,"Unexpected Application Error!"),v.createElement("h3",{style:{fontStyle:"italic"}},u),o?v.createElement("pre",{style:x},o):null,m)}var Pp=v.createElement(Jp,null),Ex=class extends v.Component{constructor(i){super(i),this.state={location:i.location,revalidation:i.revalidation,error:i.error}}static getDerivedStateFromError(i){return{error:i}}static getDerivedStateFromProps(i,u){return u.location!==i.location||u.revalidation!=="idle"&&i.revalidation==="idle"?{error:i.error,location:i.location,revalidation:i.revalidation}:{error:i.error!==void 0?i.error:u.error,location:u.location,revalidation:i.revalidation||u.revalidation}}componentDidCatch(i,u){this.props.onError?this.props.onError(i,u):console.error("React Router caught the following error during render",i)}render(){let i=this.state.error;if(this.context&&typeof i=="object"&&i&&"digest"in i&&typeof i.digest=="string"){const o=Xp(i.digest);o&&(i=o)}let u=i!==void 0?v.createElement($a.Provider,{value:this.props.routeContext},v.createElement(Qo.Provider,{value:i,children:this.props.component})):this.props.children;return this.context?v.createElement(Wp,{error:i},u):u}};Ex.contextType=Up;var Bo=new WeakMap;function Wp({children:i,error:u}){let{basename:o}=v.useContext(aa);if(typeof u=="object"&&u&&"digest"in u&&typeof u.digest=="string"){let d=$p(u.digest);if(d){let x=Bo.get(u);if(x)throw x;let b=vx(d.location,o);if(bx&&!Bo.get(u))if(b.isExternal||d.reloadDocument)window.location.href=b.absoluteURL||b.to;else{const m=Promise.resolve().then(()=>window.__reactRouterDataRouter.navigate(b.to,{replace:d.replace}));throw Bo.set(u,m),m}return v.createElement("meta",{httpEquiv:"refresh",content:`0;url=${b.absoluteURL||b.to}`})}}return i}function Fp({routeContext:i,match:u,children:o}){let d=v.useContext(Ul);return d&&d.static&&d.staticContext&&(u.route.errorElement||u.route.ErrorBoundary)&&(d.staticContext._deepestRenderedBoundaryId=u.route.id),v.createElement($a.Provider,{value:i},o)}function Ip(i,u=[],o=null,d=null,x=null){if(i==null){if(!o)return null;if(o.errors)i=o.matches;else if(u.length===0&&!o.initialized&&o.matches.length>0)i=o.matches;else return null}let b=i,m=o?.errors;if(m!=null){let j=b.findIndex(p=>p.route.id&&m?.[p.route.id]!==void 0);Je(j>=0,`Could not find a matching route for errors on route IDs: ${Object.keys(m).join(",")}`),b=b.slice(0,Math.min(b.length,j+1))}let N=!1,f=-1;if(o)for(let j=0;j<b.length;j++){let p=b[j];if((p.route.HydrateFallback||p.route.hydrateFallbackElement)&&(f=j),p.route.id){let{loaderData:E,errors:L}=o,M=p.route.loader&&!E.hasOwnProperty(p.route.id)&&(!L||L[p.route.id]===void 0);if(p.route.lazy||M){N=!0,f>=0?b=b.slice(0,f+1):b=[b[0]];break}}}let g=o&&d?(j,p)=>{d(j,{location:o.location,params:o.matches?.[0]?.params??{},unstable_pattern:Op(o.matches),errorInfo:p})}:void 0;return b.reduceRight((j,p,E)=>{let L,M=!1,w=null,k=null;o&&(L=m&&p.route.id?m[p.route.id]:void 0,w=p.route.errorElement||Pp,N&&(f<0&&E===0?(zx("route-fallback",!1,"No `HydrateFallback` element provided to render during initial hydration"),M=!0,k=null):f===E&&(M=!0,k=p.route.hydrateFallbackElement||null)));let A=u.concat(b.slice(0,E+1)),O=()=>{let $;return L?$=w:M?$=k:p.route.Component?$=v.createElement(p.route.Component,null):p.route.element?$=p.route.element:$=j,v.createElement(Fp,{match:p,routeContext:{outlet:j,matches:A,isDataRoute:o!=null},children:$})};return o&&(p.route.ErrorBoundary||p.route.errorElement||E===0)?v.createElement(Ex,{location:o.location,revalidation:o.revalidation,component:w,error:L,children:O(),routeContext:{outlet:null,matches:A,isDataRoute:!0},onError:g}):O()},null)}function Ko(i){return`${i} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`}function eg(i){let u=v.useContext(Ul);return Je(u,Ko(i)),u}function tg(i){let u=v.useContext(xi);return Je(u,Ko(i)),u}function ag(i){let u=v.useContext($a);return Je(u,Ko(i)),u}function Jo(i){let u=ag(i),o=u.matches[u.matches.length-1];return Je(o.route.id,`${i} can only be used on routes that contain a unique "id"`),o.route.id}function sg(){return Jo("useRouteId")}function lg(){let i=v.useContext(Qo),u=tg("useRouteError"),o=Jo("useRouteError");return i!==void 0?i:u.errors?.[o]}function rg(){let{router:i}=eg("useNavigate"),u=Jo("useNavigate"),o=v.useRef(!1);return Cx(()=>{o.current=!0}),v.useCallback(async(x,b={})=>{fa(o.current,wx),o.current&&(typeof x=="number"?await i.navigate(x):await i.navigate(x,{fromRouteId:u,...b}))},[i,u])}var lx={};function zx(i,u,o){!u&&!lx[i]&&(lx[i]=!0,fa(!1,o))}v.memo(ng);function ng({routes:i,future:u,state:o,onError:d}){return Sx(i,void 0,o,d,u)}function it(i){Je(!1,"A <Route> is only ever to be used as the child of <Routes> element, never rendered directly. Please wrap your <Route> in a <Routes>.")}function ig({basename:i="/",children:u=null,location:o,navigationType:d="POP",navigator:x,static:b=!1,unstable_useTransitions:m}){Je(!Yr(),"You cannot render a <Router> inside another <Router>. You should never have more than one in your app.");let N=i.replace(/^\/*/,"/"),f=v.useMemo(()=>({basename:N,navigator:x,static:b,unstable_useTransitions:m,future:{}}),[N,x,b,m]);typeof o=="string"&&(o=Ll(o));let{pathname:g="/",search:j="",hash:p="",state:E=null,key:L="default"}=o,M=v.useMemo(()=>{let w=Va(g,N);return w==null?null:{location:{pathname:w,search:j,hash:p,state:E,key:L},navigationType:d}},[N,g,j,p,E,L,d]);return fa(M!=null,`<Router basename="${N}"> is not able to match the URL "${g}${j}${p}" because it does not start with the basename, so the <Router> won't render anything.`),M==null?null:v.createElement(aa.Provider,{value:f},v.createElement(Br.Provider,{children:u,value:M}))}function cg({children:i,location:u}){return Kp(Xo(i),u)}function Xo(i,u=[]){let o=[];return v.Children.forEach(i,(d,x)=>{if(!v.isValidElement(d))return;let b=[...u,x];if(d.type===v.Fragment){o.push.apply(o,Xo(d.props.children,b));return}Je(d.type===it,`[${typeof d.type=="string"?d.type:d.type.name}] is not a <Route> component. All component children of <Routes> must be a <Route> or <React.Fragment>`),Je(!d.props.index||!d.props.children,"An index route cannot have child routes.");let m={id:d.props.id||b.join("-"),caseSensitive:d.props.caseSensitive,element:d.props.element,Component:d.props.Component,index:d.props.index,path:d.props.path,middleware:d.props.middleware,loader:d.props.loader,action:d.props.action,hydrateFallbackElement:d.props.hydrateFallbackElement,HydrateFallback:d.props.HydrateFallback,errorElement:d.props.errorElement,ErrorBoundary:d.props.ErrorBoundary,hasErrorBoundary:d.props.hasErrorBoundary===!0||d.props.ErrorBoundary!=null||d.props.errorElement!=null,shouldRevalidate:d.props.shouldRevalidate,handle:d.props.handle,lazy:d.props.lazy};d.props.children&&(m.children=Xo(d.props.children,b)),o.push(m)}),o}var di="get",ui="application/x-www-form-urlencoded";function fi(i){return typeof HTMLElement<"u"&&i instanceof HTMLElement}function og(i){return fi(i)&&i.tagName.toLowerCase()==="button"}function dg(i){return fi(i)&&i.tagName.toLowerCase()==="form"}function ug(i){return fi(i)&&i.tagName.toLowerCase()==="input"}function mg(i){return!!(i.metaKey||i.altKey||i.ctrlKey||i.shiftKey)}function hg(i,u){return i.button===0&&(!u||u==="_self")&&!mg(i)}var oi=null;function xg(){if(oi===null)try{new FormData(document.createElement("form"),0),oi=!1}catch{oi=!0}return oi}var fg=new Set(["application/x-www-form-urlencoded","multipart/form-data","text/plain"]);function Yo(i){return i!=null&&!fg.has(i)?(fa(!1,`"${i}" is not a valid \`encType\` for \`<Form>\`/\`<fetcher.Form>\` and will default to "${ui}"`),null):i}function pg(i,u){let o,d,x,b,m;if(dg(i)){let N=i.getAttribute("action");d=N?Va(N,u):null,o=i.getAttribute("method")||di,x=Yo(i.getAttribute("enctype"))||ui,b=new FormData(i)}else if(og(i)||ug(i)&&(i.type==="submit"||i.type==="image")){let N=i.form;if(N==null)throw new Error('Cannot submit a <button> or <input type="submit"> without a <form>');let f=i.getAttribute("formaction")||N.getAttribute("action");if(d=f?Va(f,u):null,o=i.getAttribute("formmethod")||N.getAttribute("method")||di,x=Yo(i.getAttribute("formenctype"))||Yo(N.getAttribute("enctype"))||ui,b=new FormData(N,i),!xg()){let{name:g,type:j,value:p}=i;if(j==="image"){let E=g?`${g}.`:"";b.append(`${E}x`,"0"),b.append(`${E}y`,"0")}else g&&b.append(g,p)}}else{if(fi(i))throw new Error('Cannot submit element that is not <form>, <button>, or <input type="submit|image">');o=di,d=null,x=ui,m=i}return b&&x==="text/plain"&&(m=b,b=void 0),{action:d,method:o.toLowerCase(),encType:x,formData:b,body:m}}Object.getOwnPropertyNames(Object.prototype).sort().join("\0");function Po(i,u){if(i===!1||i===null||typeof i>"u")throw new Error(u)}function gg(i,u,o,d){let x=typeof i=="string"?new URL(i,typeof window>"u"?"server://singlefetch/":window.location.origin):i;return o?x.pathname.endsWith("/")?x.pathname=`${x.pathname}_.${d}`:x.pathname=`${x.pathname}.${d}`:x.pathname==="/"?x.pathname=`_root.${d}`:u&&Va(x.pathname,u)==="/"?x.pathname=`${u.replace(/\/$/,"")}/_root.${d}`:x.pathname=`${x.pathname.replace(/\/$/,"")}.${d}`,x}async function bg(i,u){if(i.id in u)return u[i.id];try{let o=await import(i.module);return u[i.id]=o,o}catch(o){return console.error(`Error loading route module \`${i.module}\`, reloading page...`),console.error(o),window.__reactRouterContext&&window.__reactRouterContext.isSpaMode,window.location.reload(),new Promise(()=>{})}}function vg(i){return i==null?!1:i.href==null?i.rel==="preload"&&typeof i.imageSrcSet=="string"&&typeof i.imageSizes=="string":typeof i.rel=="string"&&typeof i.href=="string"}async function yg(i,u,o){let d=await Promise.all(i.map(async x=>{let b=u.routes[x.route.id];if(b){let m=await bg(b,o);return m.links?m.links():[]}return[]}));return Cg(d.flat(1).filter(vg).filter(x=>x.rel==="stylesheet"||x.rel==="preload").map(x=>x.rel==="stylesheet"?{...x,rel:"prefetch",as:"style"}:{...x,rel:"prefetch"}))}function rx(i,u,o,d,x,b){let m=(f,g)=>o[g]?f.route.id!==o[g].route.id:!0,N=(f,g)=>o[g].pathname!==f.pathname||o[g].route.path?.endsWith("*")&&o[g].params["*"]!==f.params["*"];return b==="assets"?u.filter((f,g)=>m(f,g)||N(f,g)):b==="data"?u.filter((f,g)=>{let j=d.routes[f.route.id];if(!j||!j.hasLoader)return!1;if(m(f,g)||N(f,g))return!0;if(f.route.shouldRevalidate){let p=f.route.shouldRevalidate({currentUrl:new URL(x.pathname+x.search+x.hash,window.origin),currentParams:o[0]?.params||{},nextUrl:new URL(i,window.origin),nextParams:f.params,defaultShouldRevalidate:!0});if(typeof p=="boolean")return p}return!0}):[]}function jg(i,u,{includeHydrateFallback:o}={}){return Ng(i.map(d=>{let x=u.routes[d.route.id];if(!x)return[];let b=[x.module];return x.clientActionModule&&(b=b.concat(x.clientActionModule)),x.clientLoaderModule&&(b=b.concat(x.clientLoaderModule)),o&&x.hydrateFallbackModule&&(b=b.concat(x.hydrateFallbackModule)),x.imports&&(b=b.concat(x.imports)),b}).flat(1))}function Ng(i){return[...new Set(i)]}function wg(i){let u={},o=Object.keys(i).sort();for(let d of o)u[d]=i[d];return u}function Cg(i,u){let o=new Set;return new Set(u),i.reduce((d,x)=>{let b=JSON.stringify(wg(x));return o.has(b)||(o.add(b),d.push({key:b,link:x})),d},[])}function kx(){let i=v.useContext(Ul);return Po(i,"You must render this element inside a <DataRouterContext.Provider> element"),i}function Sg(){let i=v.useContext(xi);return Po(i,"You must render this element inside a <DataRouterStateContext.Provider> element"),i}var Wo=v.createContext(void 0);Wo.displayName="FrameworkContext";function Tx(){let i=v.useContext(Wo);return Po(i,"You must render this element inside a <HydratedRouter> element"),i}function Eg(i,u){let o=v.useContext(Wo),[d,x]=v.useState(!1),[b,m]=v.useState(!1),{onFocus:N,onBlur:f,onMouseEnter:g,onMouseLeave:j,onTouchStart:p}=u,E=v.useRef(null);v.useEffect(()=>{if(i==="render"&&m(!0),i==="viewport"){let w=A=>{A.forEach(O=>{m(O.isIntersecting)})},k=new IntersectionObserver(w,{threshold:.5});return E.current&&k.observe(E.current),()=>{k.disconnect()}}},[i]),v.useEffect(()=>{if(d){let w=setTimeout(()=>{m(!0)},100);return()=>{clearTimeout(w)}}},[d]);let L=()=>{x(!0)},M=()=>{x(!1),m(!1)};return o?i!=="intent"?[b,E,{}]:[b,E,{onFocus:Rr(N,L),onBlur:Rr(f,M),onMouseEnter:Rr(g,L),onMouseLeave:Rr(j,M),onTouchStart:Rr(p,L)}]:[!1,E,{}]}function Rr(i,u){return o=>{i&&i(o),o.defaultPrevented||u(o)}}function zg({page:i,...u}){let{router:o}=kx(),d=v.useMemo(()=>hx(o.routes,i,o.basename),[o.routes,i,o.basename]);return d?v.createElement(Tg,{page:i,matches:d,...u}):null}function kg(i){let{manifest:u,routeModules:o}=Tx(),[d,x]=v.useState([]);return v.useEffect(()=>{let b=!1;return yg(i,u,o).then(m=>{b||x(m)}),()=>{b=!0}},[i,u,o]),d}function Tg({page:i,matches:u,...o}){let d=Xs(),{future:x,manifest:b,routeModules:m}=Tx(),{basename:N}=kx(),{loaderData:f,matches:g}=Sg(),j=v.useMemo(()=>rx(i,u,g,b,d,"data"),[i,u,g,b,d]),p=v.useMemo(()=>rx(i,u,g,b,d,"assets"),[i,u,g,b,d]),E=v.useMemo(()=>{if(i===d.pathname+d.search+d.hash)return[];let w=new Set,k=!1;if(u.forEach(O=>{let $=b.routes[O.route.id];!$||!$.hasLoader||(!j.some(Y=>Y.route.id===O.route.id)&&O.route.id in f&&m[O.route.id]?.shouldRevalidate||$.hasClientLoader?k=!0:w.add(O.route.id))}),w.size===0)return[];let A=gg(i,N,x.unstable_trailingSlashAwareDataRequests,"data");return k&&w.size>0&&A.searchParams.set("_routes",u.filter(O=>w.has(O.route.id)).map(O=>O.route.id).join(",")),[A.pathname+A.search]},[N,x.unstable_trailingSlashAwareDataRequests,f,d,b,j,u,i,m]),L=v.useMemo(()=>jg(p,b),[p,b]),M=kg(p);return v.createElement(v.Fragment,null,E.map(w=>v.createElement("link",{key:w,rel:"prefetch",as:"fetch",href:w,...o})),L.map(w=>v.createElement("link",{key:w,rel:"modulepreload",href:w,...o})),M.map(({key:w,link:k})=>v.createElement("link",{key:w,nonce:o.nonce,...k,crossOrigin:k.crossOrigin??o.crossOrigin})))}function Mg(...i){return u=>{i.forEach(o=>{typeof o=="function"?o(u):o!=null&&(o.current=u)})}}var Dg=typeof window<"u"&&typeof window.document<"u"&&typeof window.document.createElement<"u";try{Dg&&(window.__reactRouterVersion="7.13.0")}catch{}function _g({basename:i,children:u,unstable_useTransitions:o,window:d}){let x=v.useRef();x.current==null&&(x.current=up({window:d,v5Compat:!0}));let b=x.current,[m,N]=v.useState({action:b.action,location:b.location}),f=v.useCallback(g=>{o===!1?N(g):v.startTransition(()=>N(g))},[o]);return v.useLayoutEffect(()=>b.listen(f),[b,f]),v.createElement(ig,{basename:i,children:u,location:m.location,navigationType:m.action,navigator:b,unstable_useTransitions:o})}var Mx=/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,Dx=v.forwardRef(function({onClick:u,discover:o="render",prefetch:d="none",relative:x,reloadDocument:b,replace:m,state:N,target:f,to:g,preventScrollReset:j,viewTransition:p,unstable_defaultShouldRevalidate:E,...L},M){let{basename:w,unstable_useTransitions:k}=v.useContext(aa),A=typeof g=="string"&&Mx.test(g),O=vx(g,w);g=O.to;let $=Gp(g,{relative:x}),[Y,Z,ee]=Eg(d,L),F=Og(g,{replace:m,state:N,target:f,preventScrollReset:j,relative:x,viewTransition:p,unstable_defaultShouldRevalidate:E,unstable_useTransitions:k});function z(ie){u&&u(ie),ie.defaultPrevented||F(ie)}let Q=v.createElement("a",{...L,...ee,href:O.absoluteURL||$,onClick:O.isExternal||b?u:z,ref:Mg(M,Z),target:f,"data-discover":!A&&o==="render"?"true":void 0});return Y&&!A?v.createElement(v.Fragment,null,Q,v.createElement(zg,{page:$})):Q});Dx.displayName="Link";var Ag=v.forwardRef(function({"aria-current":u="page",caseSensitive:o=!1,className:d="",end:x=!1,style:b,to:m,viewTransition:N,children:f,...g},j){let p=Vr(m,{relative:g.relative}),E=Xs(),L=v.useContext(xi),{navigator:M,basename:w}=v.useContext(aa),k=L!=null&&Yg(p)&&N===!0,A=M.encodeLocation?M.encodeLocation(p).pathname:p.pathname,O=E.pathname,$=L&&L.navigation&&L.navigation.location?L.navigation.location.pathname:null;o||(O=O.toLowerCase(),$=$?$.toLowerCase():null,A=A.toLowerCase()),$&&w&&($=Va($,w)||$);const Y=A!=="/"&&A.endsWith("/")?A.length-1:A.length;let Z=O===A||!x&&O.startsWith(A)&&O.charAt(Y)==="/",ee=$!=null&&($===A||!x&&$.startsWith(A)&&$.charAt(A.length)==="/"),F={isActive:Z,isPending:ee,isTransitioning:k},z=Z?u:void 0,Q;typeof d=="function"?Q=d(F):Q=[d,Z?"active":null,ee?"pending":null,k?"transitioning":null].filter(Boolean).join(" ");let ie=typeof b=="function"?b(F):b;return v.createElement(Dx,{...g,"aria-current":z,className:Q,ref:j,style:ie,to:m,viewTransition:N},typeof f=="function"?f(F):f)});Ag.displayName="NavLink";var Rg=v.forwardRef(({discover:i="render",fetcherKey:u,navigate:o,reloadDocument:d,replace:x,state:b,method:m=di,action:N,onSubmit:f,relative:g,preventScrollReset:j,viewTransition:p,unstable_defaultShouldRevalidate:E,...L},M)=>{let{unstable_useTransitions:w}=v.useContext(aa),k=Hg(),A=Bg(N,{relative:g}),O=m.toLowerCase()==="get"?"get":"post",$=typeof N=="string"&&Mx.test(N),Y=Z=>{if(f&&f(Z),Z.defaultPrevented)return;Z.preventDefault();let ee=Z.nativeEvent.submitter,F=ee?.getAttribute("formmethod")||m,z=()=>k(ee||Z.currentTarget,{fetcherKey:u,method:F,navigate:o,replace:x,state:b,relative:g,preventScrollReset:j,viewTransition:p,unstable_defaultShouldRevalidate:E});w&&o!==!1?v.startTransition(()=>z()):z()};return v.createElement("form",{ref:M,method:O,action:A,onSubmit:d?f:Y,...L,"data-discover":!$&&i==="render"?"true":void 0})});Rg.displayName="Form";function qg(i){return`${i} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`}function _x(i){let u=v.useContext(Ul);return Je(u,qg(i)),u}function Og(i,{target:u,replace:o,state:d,preventScrollReset:x,relative:b,viewTransition:m,unstable_defaultShouldRevalidate:N,unstable_useTransitions:f}={}){let g=Zp(),j=Xs(),p=Vr(i,{relative:b});return v.useCallback(E=>{if(hg(E,u)){E.preventDefault();let L=o!==void 0?o:Lr(j)===Lr(p),M=()=>g(i,{replace:L,state:d,preventScrollReset:x,relative:b,viewTransition:m,unstable_defaultShouldRevalidate:N});f?v.startTransition(()=>M()):M()}},[j,g,p,o,d,u,i,x,b,m,N,f])}var Lg=0,Ug=()=>`__${String(++Lg)}__`;function Hg(){let{router:i}=_x("useSubmit"),{basename:u}=v.useContext(aa),o=sg(),d=i.fetch,x=i.navigate;return v.useCallback(async(b,m={})=>{let{action:N,method:f,encType:g,formData:j,body:p}=pg(b,u);if(m.navigate===!1){let E=m.fetcherKey||Ug();await d(E,o,m.action||N,{unstable_defaultShouldRevalidate:m.unstable_defaultShouldRevalidate,preventScrollReset:m.preventScrollReset,formData:j,body:p,formMethod:m.method||f,formEncType:m.encType||g,flushSync:m.flushSync})}else await x(m.action||N,{unstable_defaultShouldRevalidate:m.unstable_defaultShouldRevalidate,preventScrollReset:m.preventScrollReset,formData:j,body:p,formMethod:m.method||f,formEncType:m.encType||g,replace:m.replace,state:m.state,fromRouteId:o,flushSync:m.flushSync,viewTransition:m.viewTransition})},[d,x,u,o])}function Bg(i,{relative:u}={}){let{basename:o}=v.useContext(aa),d=v.useContext($a);Je(d,"useFormAction must be used inside a RouteContext");let[x]=d.matches.slice(-1),b={...Vr(i||".",{relative:u})},m=Xs();if(i==null){b.search=m.search;let N=new URLSearchParams(b.search),f=N.getAll("index");if(f.some(j=>j==="")){N.delete("index"),f.filter(p=>p).forEach(p=>N.append("index",p));let j=N.toString();b.search=j?`?${j}`:""}}return(!i||i===".")&&x.route.index&&(b.search=b.search?b.search.replace(/^\?/,"?index&"):"?index"),o!=="/"&&(b.pathname=b.pathname==="/"?o:Ya([o,b.pathname])),Lr(b)}function Yg(i,{relative:u}={}){let o=v.useContext(jx);Je(o!=null,"`useViewTransitionState` must be used within `react-router-dom`'s `RouterProvider`.  Did you accidentally import `RouterProvider` from `react-router`?");let{basename:d}=_x("useViewTransitionState"),x=Vr(i,{relative:u});if(!o.isTransitioning)return!1;let b=Va(o.currentLocation.pathname,d)||o.currentLocation.pathname,m=Va(o.nextLocation.pathname,d)||o.nextLocation.pathname;return mi(x.pathname,m)!=null||mi(x.pathname,b)!=null}const Hl="/assets/logo-D0d4L_mb.jpeg",Vg=()=>{const[i,u]=v.useState(1),[o,d]=v.useState(null),[x,b]=v.useState(1),[m,N]=v.useState({email:"",phone:"",password:"",passwordConfirm:"",nomComplet:"",type:"",adresse:"",quartier:"",commune:"",latitude:"",longitude:"",cgu:!1}),[f,g]=v.useState({email:"",phone:"",password:"",passwordConfirm:"",nomComplet:"",type:"",identite:"",zone:"",quartiers:"",communes:"",photo:null,photoCniRecto:null,photoCniVerso:null,cgu:!1}),[j,p]=v.useState({}),[E,L]=v.useState({producteur:{score:0,label:"–"},collecteur:{score:0,label:"–"}}),[M,w]=v.useState({type:"",text:""}),[k,A]=v.useState(!1),[O,$]=v.useState(null),[Y,Z]=v.useState(null),[ee,F]=v.useState(null),z=v.useRef(null),Q=v.useRef(null),ie=v.useRef(null),ye="https://ecobackend-7tuh.vercel.app",Ge=R=>{d(R),b(1),document.querySelectorAll(".role-card").forEach(le=>{le.classList.remove("selected")});const se=document.getElementById("btnContinueRole");se&&se.classList.add("ready")},ut=()=>{o&&(u(2),pt(2,1))},Nt=()=>{i===2&&(u(1),b(1))},pt=(R,se)=>{const le=["dot1","dot2","dot3","dot4"].map(me=>document.getElementById(me)),_e=["lbl1","lbl2","lbl3","lbl4"].map(me=>document.getElementById(me)),Ke=["line1","line2","line3"].map(me=>document.getElementById(me));if(le.forEach(me=>{me&&(me.classList.remove("active","done"),me.textContent=me.id==="dot4"?"✓":me.id.replace("dot",""))}),_e.forEach(me=>me?.classList.remove("active")),Ke.forEach(me=>me?.classList.remove("done")),R===1)le[0]&&(le[0].classList.add("active"),_e[0]?.classList.add("active"));else if(R===2){for(let me=0;me<se;me++)le[me]&&(le[me].classList.add("done"),le[me].textContent="✓"),_e[me]&&_e[me]?.classList.add("active"),me<se-1&&Ke[me]&&Ke[me]?.classList.add("done");le[se-1]&&(le[se-1].classList.add("active"),le[se-1].textContent=se.toString())}else R===3&&(le.forEach((me,oa)=>{me&&(me.classList.add("done"),me.textContent="✓")}),_e.forEach(me=>me?.classList.add("active")),Ke.forEach(me=>me?.classList.add("done")))};v.useEffect(()=>{pt(i,x)},[i,x]);const H=(R,se)=>{let le=0,_e="Faible";return R.length>=8&&(le+=1),/[A-Z]/.test(R)&&(le+=1),/[0-9]/.test(R)&&(le+=1),/[^A-Za-z0-9]/.test(R)&&(le+=1),le===0?_e="–":le<=1?_e="Faible":le===2?_e="Moyen":le===3?_e="Bon":le===4&&(_e="Fort"),L(Ke=>({...Ke,[se]:{score:le,label:_e}})),{score:le,label:_e}},K=(R,se)=>{const le=document.getElementById(R);if(le){const _e=le.type==="password"?"text":"password";le.type=_e,se.textContent=_e==="password"?"👁":"👁‍🗨"}},ne=(R,se)=>{const le=R.target.files[0];if(!le)return;if(le.size>5*1024*1024){w({type:"error",text:"Le fichier ne doit pas dépasser 5 Mo"});return}const _e=new FileReader;_e.onloadend=()=>{se==="photo"?($(_e.result),g(Ke=>({...Ke,photo:le}))):se==="recto"?(Z(_e.result),g(Ke=>({...Ke,photoCniRecto:le}))):se==="verso"&&(F(_e.result),g(Ke=>({...Ke,photoCniVerso:le})))},_e.readAsDataURL(le)},Se=R=>{R.current?.click()},ke=()=>{navigator.geolocation?navigator.geolocation.getCurrentPosition(R=>{N(se=>({...se,latitude:R.coords.latitude.toString(),longitude:R.coords.longitude.toString()})),w({type:"success",text:"Position GPS obtenue !"})},R=>{w({type:"error",text:"Impossible d'obtenir votre position"})}):w({type:"error",text:"Géolocalisation non supportée"})},S=R=>{const se={};return R===1?(m.email?/\S+@\S+\.\S+/.test(m.email)||(se.pEmail="Email invalide"):se.pEmail="Email requis",m.phone||(se.pPhone="Téléphone requis"),m.password?m.password.length<8&&(se.pPassword="Minimum 8 caractères"):se.pPassword="Mot de passe requis",m.password!==m.passwordConfirm&&(se.pPasswordConfirm="Les mots de passe ne correspondent pas")):R===2?(m.nomComplet||(se.pNomComplet="Nom requis"),m.type||(se.pType="Type requis")):R===3&&(m.adresse||(se.pAdresse="Adresse requise"),m.quartier||(se.pQuartier="Quartier requis"),m.commune||(se.pCommune="Commune requise")),p(le=>({...le,...se})),Object.keys(se).length===0},X=R=>{const se={};return R===1?(f.email?/\S+@\S+\.\S+/.test(f.email)||(se.cEmail="Email invalide"):se.cEmail="Email requis",f.phone||(se.cPhone="Téléphone requis"),f.password?f.password.length<8&&(se.cPassword="Minimum 8 caractères"):se.cPassword="Mot de passe requis",f.password!==f.passwordConfirm&&(se.cPasswordConfirm="Les mots de passe ne correspondent pas")):R===2?(f.nomComplet||(se.cNomComplet="Nom requis"),f.type||(se.cType="Type requis")):R===3&&(f.zone||(se.cZone="Zone requise"),f.photo||(se.cPhoto="Photo de profil requise"),f.photoCniRecto||(se.cCniRecto="Photo CNI recto requise"),f.photoCniVerso||(se.cCniVerso="Photo CNI verso requise")),p(le=>({...le,...se})),Object.keys(se).length===0},J=R=>{S(R)&&b(R+1)},I=R=>{b(R)},ue=R=>{X(R)&&b(R+1)},xe=R=>{b(R)},Ee=async()=>{if(!m.cgu){w({type:"error",text:"Vous devez accepter les conditions générales"});return}if(!m.email||!m.phone||!m.password||!m.nomComplet||!m.type||!m.adresse||!m.quartier||!m.commune){w({type:"error",text:"Tous les champs requis doivent être remplis"});return}A(!0),w({type:"info",text:"Création du compte en cours..."});try{const R={email:m.email.trim(),telephone:m.phone.trim(),motDePasse:m.password,typeProducteur:m.type,nomComplet:m.nomComplet.trim(),adresse:m.adresse.trim(),quartier:m.quartier.trim(),commune:m.commune.trim(),cguAcceptees:m.cgu};m.latitude&&m.latitude.trim()!==""&&(R.latitude=parseFloat(m.latitude)),m.longitude&&m.longitude.trim()!==""&&(R.longitude=parseFloat(m.longitude)),console.log("📤 Envoi des données au backend:",R);const se=await fetch(`${ye}/api/auth/inscription`,{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(R)}),le=await se.json();console.log("📥 Réponse du backend:",le),se.ok?(u(3),w({type:"success",text:""}),le.token&&localStorage.setItem("auth_token",le.token)):w({type:"error",text:le.message||le.erreur||"Erreur lors de l'inscription"})}catch(R){console.error("❌ Erreur inscription:",R),w({type:"error",text:"Erreur de connexion au serveur. Vérifiez que le backend est bien lancé sur http://localhost:3000"})}finally{A(!1)}},ot=async()=>{if(!f.cgu){w({type:"error",text:"Vous devez accepter les conditions"});return}A(!0),w({type:"info",text:"Création du compte en cours..."});try{const R=new FormData;R.append("email",f.email),R.append("telephone",f.phone),R.append("motDePasse",f.password),R.append("nomComplet",f.nomComplet),R.append("typeCollecteur",f.type),R.append("numeroIdentite",f.identite),R.append("zoneIntervention",f.zone),R.append("quartiers",f.quartiers),R.append("communes",f.communes),R.append("role","collecteur"),f.photo&&R.append("photo",f.photo),f.photoCniRecto&&R.append("photoCniRecto",f.photoCniRecto),f.photoCniVerso&&R.append("photoCniVerso",f.photoCniVerso),setTimeout(()=>{u(3),w({type:"success",text:""}),A(!1)},1500)}catch(R){console.error("Erreur inscription collecteur:",R),w({type:"error",text:"Erreur lors de l'inscription"}),A(!1)}},Ve=`
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Serif+Display:ital@0;1&display=swap');

    *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }

    :root {
      --background: #f8faf8;
      --foreground: #1a1e1a;
      --card: #ffffff;
      --card-foreground: #1a1e1a;
      --primary: #2d8a5e;
      --primary-foreground: #ffffff;
      --secondary: #e8f3e8;
      --secondary-foreground: #1a5c3a;
      --muted: #f0f3f0;
      --muted-foreground: #5a655a;
      --accent: #e0a020;
      --accent-foreground: #3d2d06;
      --destructive: #dc2626;
      --border: #d9e0d9;
      --ring: #2d8a5e;
      --radius: 0.75rem;
      --radius-lg: 1.25rem;
      --radius-xl: 1.75rem;
      --shadow: 0 4px 20px -4px rgba(0, 0, 0, 0.05);
      --shadow-lg: 0 10px 40px -8px rgba(0, 0, 0, 0.08);
      --shadow-colored: 0 4px 20px -4px rgba(45, 138, 94, 0.15);
      
      --input-bg: #ffffff;
      --input-border: var(--border);
      --input-focus: var(--ring);
      --error: #dc2626;
      
      --ff-head: 'DM Serif Display', Georgia, serif;
      --ff-body: 'Outfit', sans-serif;
      
      --ease: cubic-bezier(.4,0,.2,1);
      --spring: cubic-bezier(.34,1.56,.64,1);
    }

    html { scroll-behavior:smooth; }

    body {
      font-family: var(--ff-body);
      background: var(--background);
      color: var(--foreground);
      min-height:100svh;
      overflow-x:hidden;
    }

    body::before {
      content:''; position:fixed; inset:0; pointer-events:none; z-index:0;
      background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
      opacity:.015;
    }

    nav {
      position:fixed; top:0; left:0; right:0; z-index:100;
      padding:1.25rem 2.5rem;
      display:flex; align-items:center; justify-content:space-between;
      background:rgba(255,255,255,0.95); backdrop-filter:blur(10px);
      border-bottom:1px solid var(--border);
      box-shadow: 0 2px 10px rgba(0,0,0,0.02);
    }

    .logo-img {
      height: 38px;
      width: auto;
      object-fit: contain;
    }

    .nav-back {
      display:flex; align-items:center; gap:.5rem;
      color:var(--muted-foreground); font-size:.95rem; font-weight:500;
      text-decoration:none; padding:.5rem 1rem; border-radius:100px;
      border:1px solid var(--border);
      transition:all .2s var(--ease);
      background:none; cursor:pointer;
    }

    .nav-back:hover { 
      color:var(--foreground); 
      border-color:var(--primary); 
      background:var(--secondary); 
    }

    .page {
      min-height:100svh; position:relative; z-index:1;
      display:flex; flex-direction:column; align-items:center;
      padding:7rem 1.5rem 4rem;
    }

    .ambient {
      position:fixed; pointer-events:none; z-index:0;
      border-radius:50%; filter:blur(100px);
    }

    .ambient-1 { 
      width:600px; height:400px; top:0; left:50%; transform:translateX(-50%);
      background:radial-gradient(ellipse, rgba(45,138,94,0.03) 0%, transparent 70%); 
    }

    .ambient-2 { 
      width:400px; height:300px; bottom:10%; right:5%;
      background:radial-gradient(ellipse, rgba(45,138,94,0.02) 0%, transparent 70%); 
    }

    .progress-wrap {
      width:100%; max-width:580px; margin-bottom:3rem;
      position:relative; z-index:1;
    }

    .progress-steps {
      display:flex; align-items:center; justify-content:center; gap:0;
      position:relative;
    }

    .progress-step {
      display:flex; flex-direction:column; align-items:center; gap:.5rem;
      position:relative; z-index:1;
    }

    .step-dot {
      width:40px; height:40px; border-radius:50%;
      border:2px solid var(--border);
      background:white;
      display:flex; align-items:center; justify-content:center;
      font-size:.9rem; font-weight:700; color:var(--muted-foreground);
      transition:all .4s var(--ease);
    }

    .step-dot.active {
      border-color:var(--primary); 
      color:var(--primary);
      background:rgba(45,138,94,0.05);
      box-shadow:0 0 0 4px rgba(45,138,94,0.1);
    }

    .step-dot.done {
      border-color:var(--primary); 
      background:var(--primary);
      color:white;
    }

    .step-label {
      font-size:.75rem; font-weight:500; color:var(--muted-foreground);
      text-align:center; white-space:nowrap;
    }

    .step-label.active { color:var(--primary); }

    .step-line {
      flex:1; height:2px; background:var(--border);
      margin:0 .75rem; margin-bottom:1.5rem;
      transition:background .4s var(--ease);
      min-width:60px;
    }

    .step-line.done { background:var(--primary); }

    .screen {
      display:none; width:100%; max-width:880px;
      position:relative; z-index:1;
      animation:screenIn .45s var(--ease) both;
    }

    .screen.active { display:block; }

    @keyframes screenIn {
      from { opacity:0; transform:translateY(24px); }
      to   { opacity:1; transform:translateY(0); }
    }

    .screen-title {
      font-family:var(--ff-head); font-size:clamp(2rem,5vw,3rem);
      line-height:1.1; margin-bottom:.75rem; text-align:center;
      color: var(--foreground);
    }

    .screen-title em { 
      font-style:italic; 
      color: var(--primary);
    }

    .screen-sub {
      text-align:center; color:var(--muted-foreground); font-size:1rem; line-height:1.7;
      margin-bottom:3rem; max-width:480px; margin-left:auto; margin-right:auto;
    }

    .roles-grid {
      display:grid; grid-template-columns:1fr 1fr; gap:1.5rem;
      margin-bottom:2rem;
    }

    .role-card {
      background:white; 
      border:2px solid var(--border);
      border-radius:var(--radius-xl); 
      padding:2.5rem 2rem;
      cursor:pointer; 
      transition:all .35s var(--ease);
      text-align:center; 
      position:relative; 
      overflow:hidden;
    }

    .role-card.producteur:hover { 
      border-color:var(--primary); 
      box-shadow:var(--shadow-colored); 
    }

    .role-card.collecteur:hover { 
      border-color:var(--primary); 
      box-shadow:var(--shadow-colored); 
    }

    .role-card.selected.producteur {
      border-color:var(--primary);
      background:rgba(45,138,94,0.02);
      box-shadow:0 0 0 3px rgba(45,138,94,0.1), var(--shadow-colored);
    }

    .role-card.selected.collecteur {
      border-color:var(--primary);
      background:rgba(45,138,94,0.02);
      box-shadow:0 0 0 3px rgba(45,138,94,0.1), var(--shadow-colored);
    }

    .role-icon {
      width:80px; height:80px; border-radius:var(--radius-lg);
      margin:0 auto 1.5rem; display:flex; align-items:center; justify-content:center;
      font-size:2.25rem; transition:transform .35s var(--spring);
      border:1px solid var(--border);
      background:var(--muted);
      color: var(--foreground);
    }

    .role-card:hover .role-icon { transform:scale(1.1) rotate(-5deg); }

    .role-name {
      font-family:var(--ff-head); font-size:1.6rem;
      margin-bottom:.65rem; color:var(--foreground);
    }

    .role-desc { 
      font-size:.95rem; 
      color:var(--muted-foreground); 
      line-height:1.65; 
      margin-bottom:1.5rem; 
    }

    .role-tags { display:flex; flex-wrap:wrap; gap:.5rem; justify-content:center; }

    .role-tag {
      font-size:.75rem; font-weight:600; padding:.3rem .75rem;
      border-radius:100px; 
      border:1px solid var(--border); 
      letter-spacing:.04em;
      color:var(--muted-foreground);
      background:var(--muted);
    }

    .role-check {
      position:absolute; top:1rem; right:1rem;
      width:28px; height:28px; border-radius:50%;
      display:flex; align-items:center; justify-content:center;
      font-size:.8rem; font-weight:700;
      opacity:0; transform:scale(.5);
      transition:all .3s var(--spring);
      background:var(--primary); 
      color:white;
    }

    .role-card.selected .role-check { opacity:1; transform:scale(1); }

    .btn-continue {
      width:100%; 
      padding:1.1rem; 
      border-radius:100px;
      font-family:var(--ff-body); 
      font-weight:700; 
      font-size:1.05rem;
      border:none; 
      cursor:pointer;
      display:flex; 
      align-items:center; 
      justify-content:center; 
      gap:.75rem;
      transition:all .3s var(--spring);
      opacity:.4; 
      pointer-events:none;
      background:var(--muted);
      color:var(--muted-foreground);
    }

    .btn-continue.ready {
      opacity:1; 
      pointer-events:all;
      background:var(--primary);
      color:white;
      box-shadow:0 4px 15px rgba(45,138,94,0.2);
    }

    .btn-continue.ready:hover { 
      transform:translateY(-3px); 
      box-shadow:0 8px 25px rgba(45,138,94,0.3); 
    }

    .btn-continue svg { transition:transform .3s var(--spring); }
    .btn-continue.ready:hover svg { transform:translateX(5px); }

    .form-card {
      background:white; 
      border:1px solid var(--border);
      border-radius:var(--radius-xl); 
      padding:3rem;
      position:relative; 
      overflow:hidden;
      box-shadow:var(--shadow);
    }

    .form-card::before {
      content:''; 
      position:absolute; 
      top:0; 
      left:0; 
      right:0; 
      height:3px;
      background:linear-gradient(90deg, var(--primary), #5daa5d);
    }

    .form-role-badge {
      display:inline-flex; 
      align-items:center; 
      gap:.6rem;
      padding:.45rem 1.1rem; 
      border-radius:100px;
      font-size:.85rem; 
      font-weight:600; 
      letter-spacing:.06em;
      margin-bottom:2rem; 
      border:1px solid var(--primary);
      background:rgba(45,138,94,0.05);
      color:var(--primary);
    }

    .form-step { display:none; }
    .form-step.active { display:block; animation:screenIn .35s var(--ease) both; }

    .step-heading {
      font-family:var(--ff-head); 
      font-size:1.6rem;
      margin-bottom:1.75rem; 
      display:flex; 
      align-items:center; 
      gap:.75rem;
      color:var(--foreground);
    }

    .step-heading-num {
      width:36px; 
      height:36px; 
      border-radius:10px;
      background:var(--muted); 
      border:1px solid var(--border);
      color:var(--primary); 
      font-size:1rem; 
      font-weight:800;
      display:flex; 
      align-items:center; 
      justify-content:center;
      font-family:var(--ff-body);
    }

    .field-row { 
      display:grid; 
      grid-template-columns:1fr 1fr; 
      gap:1.25rem; 
    }

    .field-row-3 { 
      display:grid; 
      grid-template-columns:1fr 1fr 1fr; 
      gap:1.25rem; 
    }

    .field {
      display:flex; 
      flex-direction:column; 
      gap:.5rem; 
      margin-bottom:1.25rem;
    }

    .field label {
      font-size:.9rem; 
      font-weight:600; 
      color:var(--foreground);
      display:flex; 
      align-items:center; 
      gap:.4rem;
      letter-spacing:.02em;
    }

    .field label .req { color:var(--primary); }
    .field label .lbl-icon { font-size:1rem; }

    .field input, .field select, .field textarea {
      background:white;
      border:1.5px solid var(--border);
      border-radius:var(--radius);
      padding:.85rem 1rem;
      color:var(--foreground);
      font-family:var(--ff-body); 
      font-size:.95rem;
      transition:all .2s var(--ease);
      outline:none; 
      width:100%;
    }

    .field input::placeholder, .field textarea::placeholder { 
      color:var(--muted-foreground); 
      opacity:0.6;
    }

    .field input:focus, .field select:focus, .field textarea:focus {
      border-color:var(--primary);
      box-shadow:0 0 0 3px rgba(45,138,94,0.1);
    }

    .field select option { background:white; color:var(--foreground); }

    .field.has-error input, .field.has-error select { 
      border-color:var(--destructive); 
    }

    .field-error { 
      font-size:.8rem; 
      color:var(--destructive); 
      display:none; 
    }

    .field.has-error .field-error { display:block; }

    .field-hint { 
      font-size:.8rem; 
      color:var(--muted-foreground); 
    }

    .input-wrap { position:relative; }
    .input-wrap input { padding-right:2.75rem; }

    .input-toggle {
      position:absolute; 
      right:.85rem; 
      top:50%; 
      transform:translateY(-50%);
      background:none; 
      border:none; 
      cursor:pointer;
      color:var(--muted-foreground); 
      padding:.25rem; 
      transition:color .2s;
      font-size:1.1rem;
    }

    .input-toggle:hover { color:var(--primary); }

    .pwd-strength { margin-top:.5rem; }

    .pwd-bar-wrap { 
      height:4px; 
      background:var(--muted); 
      border-radius:100px; 
      overflow:hidden; 
      margin-bottom:.3rem; 
    }

    .pwd-bar { 
      height:100%; 
      border-radius:100px; 
      width:0; 
      transition:width .4s var(--ease), background .4s; 
    }

    .pwd-label { 
      font-size:.8rem; 
      color:var(--muted-foreground); 
    }

    .type-grid { 
      display:grid; 
      grid-template-columns:repeat(4,1fr); 
      gap:1rem; 
      margin-bottom:1.25rem; 
    }

    .type-opt { cursor:pointer; }
    .type-opt input { display:none; }

    .type-opt-inner {
      border:2px solid var(--border); 
      border-radius:var(--radius-lg);
      padding:1.25rem .75rem; 
      text-align:center;
      transition:all .3s var(--ease); 
      background:white;
    }

    .type-opt:hover .type-opt-inner { 
      border-color:var(--primary); 
      transform:translateY(-3px); 
    }

    .type-opt input:checked + .type-opt-inner {
      border-color:var(--primary); 
      background:rgba(45,138,94,0.02);
      box-shadow:0 0 0 3px rgba(45,138,94,0.1);
    }

    .type-emoji { font-size:1.75rem; margin-bottom:.5rem; }
    .type-name { 
      font-size:.9rem; 
      font-weight:600; 
      color:var(--foreground); 
      margin-bottom:.25rem; 
    }

    .type-hint { 
      font-size:.8rem; 
      color:var(--muted-foreground); 
    }

    .col-type-grid { 
      display:grid; 
      grid-template-columns:1fr 1fr; 
      gap:1.25rem; 
      margin-bottom:1.25rem; 
    }

    .col-type-opt { cursor:pointer; }
    .col-type-opt input { display:none; }

    .col-type-inner {
      border:2px solid var(--border); 
      border-radius:var(--radius-lg);
      padding:1.5rem 1.25rem; 
      text-align:center;
      transition:all .3s var(--ease); 
      background:white;
    }

    .col-type-opt:hover .col-type-inner { 
      border-color:var(--primary); 
      transform:translateY(-3px); 
    }

    .col-type-opt input:checked + .col-type-inner {
      border-color:var(--primary); 
      background:rgba(45,138,94,0.02);
      box-shadow:0 0 0 3px rgba(45,138,94,0.1);
    }

    .col-type-emoji { font-size:2rem; margin-bottom:.75rem; }
    .col-type-name { 
      font-size:1rem; 
      font-weight:700; 
      color:var(--foreground); 
      margin-bottom:.4rem; 
    }

    .col-type-desc { 
      font-size:.85rem; 
      color:var(--muted-foreground); 
      line-height:1.5; 
    }

    .gps-btn {
      display:flex; 
      align-items:center; 
      gap:.65rem;
      background:white; 
      border:1.5px solid var(--border);
      color:var(--primary); 
      font-family:var(--ff-body); 
      font-size:.95rem; 
      font-weight:600;
      padding:.7rem 1.25rem; 
      border-radius:var(--radius); 
      cursor:pointer;
      transition:all .25s var(--ease); 
      width:100%; 
      justify-content:center;
    }

    .gps-btn:hover { 
      border-color:var(--primary); 
      background:rgba(45,138,94,0.02); 
    }

    .photo-upload {
      display:flex; 
      flex-direction:column; 
      align-items:center; 
      gap:1rem;
      padding:2rem; 
      border:2px dashed var(--border); 
      border-radius:var(--radius-lg);
      cursor:pointer; 
      transition:all .3s var(--ease); 
      background:white;
    }

    .photo-upload:hover { 
      border-color:var(--primary); 
      background:rgba(45,138,94,0.02); 
    }

    .photo-preview {
      width:90px; 
      height:90px; 
      border-radius:50%;
      border:3px solid var(--border);
      object-fit:cover; 
      background:var(--muted);
      display:flex; 
      align-items:center; 
      justify-content:center;
      font-size:2.5rem; 
      overflow:hidden;
      color:var(--muted-foreground);
    }

    .photo-preview img { width:100%; height:100%; object-fit:cover; display:none; }

    .photo-upload-text { text-align:center; }

    .photo-upload-text strong { 
      display:block; 
      font-size:.95rem; 
      color:var(--foreground); 
      margin-bottom:.25rem; 
    }

    .photo-upload-text span { 
      font-size:.85rem; 
      color:var(--muted-foreground); 
    }

    .cgu-row {
      display:flex; 
      align-items:flex-start; 
      gap:.85rem;
      padding:1.25rem; 
      border:1.5px solid var(--border);
      border-radius:var(--radius); 
      background:white;
      cursor:pointer; 
      transition:border-color .2s;
    }

    .cgu-row:hover { border-color:var(--primary); }
    .cgu-row input[type=checkbox] { display:none; }

    .cgu-box {
      width:22px; 
      height:22px; 
      min-width:22px; 
      border-radius:6px;
      border:2px solid var(--border); 
      background:white;
      transition:all .2s var(--ease);
      display:flex; 
      align-items:center; 
      justify-content:center;
      font-size:.8rem; 
      color:white;
    }

    .cgu-row.checked .cgu-box { 
      background:var(--primary); 
      border-color:var(--primary); 
    }

    .cgu-row.checked .cgu-box::after { content:'✓'; }

    .cgu-text { 
      font-size:.9rem; 
      color:var(--muted-foreground); 
      line-height:1.6; 
    }

    .cgu-text a { 
      color:var(--primary); 
      text-decoration:underline;
    }

    .form-nav {
      display:flex; 
      gap:1rem; 
      margin-top:2rem;
    }

    .btn-back {
      padding:.9rem 1.75rem; 
      border-radius:100px;
      background:transparent; 
      border:1.5px solid var(--border);
      color:var(--muted-foreground); 
      font-family:var(--ff-body); 
      font-size:.95rem; 
      font-weight:600;
      cursor:pointer; 
      transition:all .2s var(--ease);
      display:flex; 
      align-items:center; 
      gap:.5rem;
    }

    .btn-back:hover { 
      border-color:var(--primary); 
      color:var(--primary); 
      background:rgba(45,138,94,0.02); 
    }

    .btn-next {
      flex:1; 
      padding:.9rem; 
      border-radius:100px;
      font-family:var(--ff-body); 
      font-size:.95rem; 
      font-weight:700;
      border:none; 
      cursor:pointer;
      display:flex; 
      align-items:center; 
      justify-content:center; 
      gap:.6rem;
      transition:all .3s var(--spring);
      background:var(--primary);
      color:white;
      box-shadow:0 4px 15px rgba(45,138,94,0.15);
    }

    .btn-next:hover { 
      transform:translateY(-2px); 
      box-shadow:0 8px 25px rgba(45,138,94,0.25); 
    }

    .btn-next svg { transition:transform .3s var(--spring); }
    .btn-next:hover svg { transform:translateX(4px); }

    .recap-grid { 
      display:grid; 
      grid-template-columns:1fr 1fr; 
      gap:1rem; 
      margin-bottom:1.5rem; 
    }

    .recap-item {
      background:var(--muted); 
      border:1px solid var(--border);
      border-radius:var(--radius); 
      padding:1rem;
    }

    .recap-label { 
      font-size:.8rem; 
      color:var(--muted-foreground); 
      margin-bottom:.3rem; 
      text-transform:uppercase; 
      letter-spacing:.06em; 
    }

    .recap-val { 
      font-size:.95rem; 
      color:var(--foreground); 
      font-weight:500; 
    }

    .msg-box {
      padding:1rem 1.25rem; 
      border-radius:var(--radius);
      font-size:.9rem; 
      margin-top:1rem; 
      display:none;
    }

    .msg-box.success { 
      background:var(--secondary); 
      border:1px solid var(--primary); 
      color:var(--secondary-foreground); 
      display:block; 
    }

    .msg-box.error { 
      background:rgba(220,38,38,0.05); 
      border:1px solid var(--destructive); 
      color:var(--destructive); 
      display:block; 
    }

    .msg-box.info { 
      background:rgba(45,138,94,0.05); 
      border:1px solid var(--primary); 
      color:var(--primary); 
      display:block; 
    }

    .success-anim {
      width:120px; 
      height:120px; 
      border-radius:50%; 
      margin:0 auto 2rem;
      display:flex; 
      align-items:center; 
      justify-content:center;
      font-size:3.5rem;
      animation:popIn .6s var(--spring) both;
      background:var(--secondary); 
      border:3px solid var(--primary); 
      box-shadow:0 0 40px rgba(45,138,94,0.15);
    }

    @keyframes popIn {
      from { transform:scale(.3); opacity:0; }
      to   { transform:scale(1); opacity:1; }
    }

    .success-title { 
      font-family:var(--ff-head); 
      font-size:2.5rem; 
      margin-bottom:1rem; 
      color:var(--foreground);
      text-align:center;
    }

    .success-title em { 
      color:var(--primary); 
    }

    .success-sub { 
      color:var(--muted-foreground); 
      font-size:1.05rem; 
      line-height:1.7; 
      max-width:420px; 
      margin:0 auto 2.5rem; 
      text-align:center;
    }

    .success-actions { 
      display:flex; 
      gap:1rem; 
      justify-content:center; 
      flex-wrap:wrap; 
    }

    .btn-go {
      padding:.9rem 2rem; 
      border-radius:100px;
      font-family:var(--ff-body); 
      font-weight:700; 
      font-size:1rem;
      border:none; 
      cursor:pointer; 
      transition:all .3s var(--spring);
    }

    .btn-go.primary { 
      background:var(--primary); 
      color:white; 
      box-shadow:0 4px 15px rgba(45,138,94,0.2); 
    }

    .btn-go.primary:hover { 
      transform:translateY(-3px); 
      box-shadow:0 8px 25px rgba(45,138,94,0.3); 
    }

    .btn-go.ghost { 
      background:transparent; 
      color:var(--muted-foreground); 
      border:1.5px solid var(--border); 
    }

    .btn-go.ghost:hover { 
      color:var(--foreground); 
      border-color:var(--primary); 
    }

    .auth-link { 
      text-align:center; 
      margin-top:1.75rem; 
      font-size:.95rem; 
      color:var(--muted-foreground); 
    }

    .auth-link a { 
      color:var(--primary); 
      font-weight:600; 
      text-decoration:none; 
    }

    .auth-link a:hover { text-decoration:underline; }

    .divider {
      height:1px; 
      background:linear-gradient(90deg,transparent,var(--border),transparent);
      margin:2rem 0;
    }

    @media (max-width:680px) {
      .roles-grid { grid-template-columns:1fr; }
      .type-grid { grid-template-columns:repeat(2,1fr); }
      .field-row, .field-row-3 { grid-template-columns:1fr; }
      .recap-grid { grid-template-columns:1fr; }
      .form-card { padding:2rem 1.25rem; }
      .col-type-grid { grid-template-columns:1fr; }
      .form-nav { flex-direction:column; }
      .btn-back { text-align:center; justify-content:center; }
      nav { padding:1rem 1.25rem; }
      .logo-img { height:32px; }
    }
  `,ga=()=>{const R={menage:"Ménage",commerce:"Commerce",entreprise:"Entreprise",administration:"Administration"};return t.jsxs("div",{className:"recap-grid",children:[t.jsxs("div",{className:"recap-item",children:[t.jsx("div",{className:"recap-label",children:"Email"}),t.jsx("div",{className:"recap-val",children:m.email})]}),t.jsxs("div",{className:"recap-item",children:[t.jsx("div",{className:"recap-label",children:"Téléphone"}),t.jsx("div",{className:"recap-val",children:m.phone})]}),t.jsxs("div",{className:"recap-item",children:[t.jsx("div",{className:"recap-label",children:"Nom"}),t.jsx("div",{className:"recap-val",children:m.nomComplet})]}),t.jsxs("div",{className:"recap-item",children:[t.jsx("div",{className:"recap-label",children:"Type"}),t.jsx("div",{className:"recap-val",children:R[m.type]||m.type})]}),t.jsxs("div",{className:"recap-item",children:[t.jsx("div",{className:"recap-label",children:"Adresse"}),t.jsx("div",{className:"recap-val",children:m.adresse})]}),t.jsxs("div",{className:"recap-item",children:[t.jsx("div",{className:"recap-label",children:"Quartier / Commune"}),t.jsxs("div",{className:"recap-val",children:[m.quartier,", ",m.commune]})]}),m.latitude&&m.longitude&&t.jsxs("div",{className:"recap-item",children:[t.jsx("div",{className:"recap-label",children:"GPS"}),t.jsxs("div",{className:"recap-val",children:[m.latitude,", ",m.longitude]})]})]})},ba=()=>{const R={independant:"Indépendant",cooperative:"Coopérative"};return t.jsxs("div",{className:"recap-grid",children:[t.jsxs("div",{className:"recap-item",children:[t.jsx("div",{className:"recap-label",children:"Email"}),t.jsx("div",{className:"recap-val",children:f.email})]}),t.jsxs("div",{className:"recap-item",children:[t.jsx("div",{className:"recap-label",children:"Téléphone"}),t.jsx("div",{className:"recap-val",children:f.phone})]}),t.jsxs("div",{className:"recap-item",children:[t.jsx("div",{className:"recap-label",children:"Nom"}),t.jsx("div",{className:"recap-val",children:f.nomComplet})]}),t.jsxs("div",{className:"recap-item",children:[t.jsx("div",{className:"recap-label",children:"Type"}),t.jsx("div",{className:"recap-val",children:R[f.type]||f.type})]}),t.jsxs("div",{className:"recap-item",children:[t.jsx("div",{className:"recap-label",children:"Zone"}),t.jsx("div",{className:"recap-val",children:f.zone})]}),t.jsxs("div",{className:"recap-item",children:[t.jsx("div",{className:"recap-label",children:"Quartiers / Communes"}),t.jsxs("div",{className:"recap-val",children:[f.quartiers," / ",f.communes]})]})]})};return t.jsxs(t.Fragment,{children:[t.jsx("style",{children:Ve}),t.jsx("div",{className:"ambient ambient-1"}),t.jsx("div",{className:"ambient ambient-2"}),t.jsxs("nav",{children:[t.jsx("img",{src:Hl,alt:"EcoCollect",className:"logo-img"}),t.jsx("button",{className:"nav-back",onClick:()=>window.location.href="/",children:"← Retour à l'accueil"})]}),t.jsxs("div",{className:"page",children:[t.jsx("div",{className:"progress-wrap",children:t.jsxs("div",{className:"progress-steps",children:[t.jsxs("div",{className:"progress-step",children:[t.jsx("div",{className:"step-dot",id:"dot1",children:"1"}),t.jsx("div",{className:"step-label",id:"lbl1",children:"Mon rôle"})]}),t.jsx("div",{className:"step-line",id:"line1"}),t.jsxs("div",{className:"progress-step",children:[t.jsx("div",{className:"step-dot",id:"dot2",children:"2"}),t.jsx("div",{className:"step-label",id:"lbl2",children:"Mes infos"})]}),t.jsx("div",{className:"step-line",id:"line2"}),t.jsxs("div",{className:"progress-step",children:[t.jsx("div",{className:"step-dot",id:"dot3",children:"3"}),t.jsx("div",{className:"step-label",id:"lbl3",children:"Confirmation"})]}),t.jsx("div",{className:"step-line",id:"line3"}),t.jsxs("div",{className:"progress-step",children:[t.jsx("div",{className:"step-dot",id:"dot4",children:"✓"}),t.jsx("div",{className:"step-label",id:"lbl4",children:"C'est parti !"})]})]})}),t.jsxs("div",{className:`screen ${i===1?"active":""}`,id:"screen1",children:[t.jsxs("h1",{className:"screen-title",children:["Quel est ",t.jsx("em",{children:"votre rôle"})," ?"]}),t.jsx("p",{className:"screen-sub",children:"Choisissez votre profil pour accéder au formulaire d'inscription adapté à vos besoins."}),t.jsxs("div",{className:"roles-grid",children:[t.jsxs("div",{className:`role-card producteur ${o==="producteur"?"selected":""}`,onClick:()=>Ge("producteur"),children:[t.jsx("div",{className:"role-check",children:"✓"}),t.jsx("div",{className:"role-icon",children:"🏠"}),t.jsx("h2",{className:"role-name",children:"Producteur"}),t.jsx("p",{className:"role-desc",children:"Vous générez des déchets chez vous, dans votre commerce ou entreprise, et souhaitez les faire collecter ou les déposer dans un point de regroupement."}),t.jsxs("div",{className:"role-tags",children:[t.jsx("span",{className:"role-tag",children:"Ménage"}),t.jsx("span",{className:"role-tag",children:"Commerce"}),t.jsx("span",{className:"role-tag",children:"Entreprise"}),t.jsx("span",{className:"role-tag",children:"Administration"})]})]}),t.jsxs("div",{className:`role-card collecteur ${o==="collecteur"?"selected":""}`,onClick:()=>Ge("collecteur"),children:[t.jsx("div",{className:"role-check",children:"✓"}),t.jsx("div",{className:"role-icon",children:"🚛"}),t.jsx("h2",{className:"role-name",children:"Collecteur"}),t.jsx("p",{className:"role-desc",children:"Vous collectez les déchets chez les producteurs ou récupérez les dépôts dans les points de regroupement. Vous êtes rémunéré par mission validée."}),t.jsxs("div",{className:"role-tags",children:[t.jsx("span",{className:"role-tag",children:"Indépendant"}),t.jsx("span",{className:"role-tag",children:"Coopérative"})]})]})]}),t.jsxs("button",{className:`btn-continue ${o?"ready":""}`,onClick:ut,children:["Continuer avec ce rôle",t.jsx("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:t.jsx("path",{d:"M5 12h14M12 5l7 7-7 7"})})]}),t.jsxs("div",{className:"auth-link",children:["Vous avez déjà un compte ? ",t.jsx("a",{href:"/login",children:"Se connecter"})]})]}),t.jsxs("div",{className:`screen ${i===2&&o==="producteur"?"active":""}`,id:"screen2p",children:[t.jsxs("div",{className:"form-card",children:[t.jsx("div",{className:"form-role-badge",children:"🏠 Inscription Producteur"}),t.jsxs("div",{className:`form-step ${x===1?"active":""}`,id:"pStep1",children:[t.jsxs("h3",{className:"step-heading",children:[t.jsx("span",{className:"step-heading-num",children:"1"}),"Informations de connexion"]}),t.jsxs("div",{className:"field-row",children:[t.jsxs("div",{className:`field ${j.pEmail?"has-error":""}`,children:[t.jsxs("label",{children:[t.jsx("span",{className:"lbl-icon",children:"✉️"})," Email ",t.jsx("span",{className:"req",children:"*"})]}),t.jsx("input",{type:"email",placeholder:"votre@email.com",value:m.email,onChange:R=>N({...m,email:R.target.value})}),t.jsx("span",{className:"field-error",children:"Email invalide"})]}),t.jsxs("div",{className:`field ${j.pPhone?"has-error":""}`,children:[t.jsxs("label",{children:[t.jsx("span",{className:"lbl-icon",children:"📱"})," Téléphone ",t.jsx("span",{className:"req",children:"*"})]}),t.jsx("input",{type:"tel",placeholder:"+237 6XX XXX XXX",value:m.phone,onChange:R=>N({...m,phone:R.target.value})}),t.jsx("span",{className:"field-error",children:"Téléphone invalide"})]})]}),t.jsxs("div",{className:"field-row",children:[t.jsxs("div",{className:`field ${j.pPassword?"has-error":""}`,children:[t.jsxs("label",{children:[t.jsx("span",{className:"lbl-icon",children:"🔒"})," Mot de passe ",t.jsx("span",{className:"req",children:"*"})]}),t.jsxs("div",{className:"input-wrap",children:[t.jsx("input",{type:"password",id:"p-pwd",placeholder:"Min. 8 caractères",value:m.password,onChange:R=>{N({...m,password:R.target.value}),H(R.target.value,"producteur")}}),t.jsx("button",{type:"button",className:"input-toggle",onClick:R=>K("p-pwd",R.currentTarget),children:"👁"})]}),t.jsxs("div",{className:"pwd-strength",children:[t.jsx("div",{className:"pwd-bar-wrap",children:t.jsx("div",{className:"pwd-bar",style:{width:`${E.producteur.score*25}%`,background:E.producteur.score<=1?"#dc2626":E.producteur.score===2?"#e0a020":E.producteur.score>=3?"#2d8a5e":"#d9e0d9"}})}),t.jsx("span",{className:"pwd-label",children:E.producteur.label})]}),t.jsx("span",{className:"field-error",children:"Min. 8 caractères"})]}),t.jsxs("div",{className:`field ${j.pPasswordConfirm?"has-error":""}`,children:[t.jsxs("label",{children:[t.jsx("span",{className:"lbl-icon",children:"🔒"})," Confirmer ",t.jsx("span",{className:"req",children:"*"})]}),t.jsxs("div",{className:"input-wrap",children:[t.jsx("input",{type:"password",id:"p-pwdConfirm",placeholder:"Répétez le mot de passe",value:m.passwordConfirm,onChange:R=>N({...m,passwordConfirm:R.target.value})}),t.jsx("button",{type:"button",className:"input-toggle",onClick:R=>K("p-pwdConfirm",R.currentTarget),children:"👁"})]}),t.jsx("span",{className:"field-error",children:"Les mots de passe ne correspondent pas"})]})]}),t.jsxs("div",{className:"form-nav",children:[t.jsx("button",{type:"button",className:"btn-back",onClick:Nt,children:"← Retour"}),t.jsxs("button",{type:"button",className:"btn-next",onClick:()=>J(1),children:["Étape suivante",t.jsx("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:t.jsx("path",{d:"M5 12h14M12 5l7 7-7 7"})})]})]})]}),t.jsxs("div",{className:`form-step ${x===2?"active":""}`,id:"pStep2",children:[t.jsxs("h3",{className:"step-heading",children:[t.jsx("span",{className:"step-heading-num",children:"2"}),"Votre profil"]}),t.jsxs("div",{className:`field ${j.pNomComplet?"has-error":""}`,children:[t.jsxs("label",{children:[t.jsx("span",{className:"lbl-icon",children:"👤"})," Nom complet / Raison sociale ",t.jsx("span",{className:"req",children:"*"})]}),t.jsx("input",{type:"text",placeholder:"Jean Dupont ou ETS Dupont",value:m.nomComplet,onChange:R=>N({...m,nomComplet:R.target.value})}),t.jsx("span",{className:"field-error",children:"Champ requis"})]}),t.jsxs("div",{className:"field",children:[t.jsxs("label",{children:[t.jsx("span",{className:"lbl-icon",children:"🏷️"})," Type de producteur ",t.jsx("span",{className:"req",children:"*"})]}),t.jsx("div",{className:"type-grid",children:["menage","commerce","entreprise","administration"].map(R=>t.jsxs("label",{className:"type-opt",children:[t.jsx("input",{type:"radio",name:"p-type",value:R,checked:m.type===R,onChange:se=>N({...m,type:se.target.value})}),t.jsxs("div",{className:"type-opt-inner",children:[t.jsxs("div",{className:"type-emoji",children:[R==="menage"&&"🏠",R==="commerce"&&"🏪",R==="entreprise"&&"🏭",R==="administration"&&"🏛️"]}),t.jsxs("div",{className:"type-name",children:[R==="menage"&&"Ménage",R==="commerce"&&"Commerce",R==="entreprise"&&"Entreprise",R==="administration"&&"Administration"]}),t.jsxs("div",{className:"type-hint",children:[R==="menage"&&"Particulier",R==="commerce"&&"Boutique / Resto",R==="entreprise"&&"PME / Industrie",R==="administration"&&"Service public"]})]})]},R))}),j.pType&&t.jsx("span",{className:"field-error",children:"Sélectionnez un type"})]}),t.jsxs("div",{className:"form-nav",children:[t.jsx("button",{type:"button",className:"btn-back",onClick:()=>I(1),children:"← Retour"}),t.jsxs("button",{type:"button",className:"btn-next",onClick:()=>J(2),children:["Étape suivante",t.jsx("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:t.jsx("path",{d:"M5 12h14M12 5l7 7-7 7"})})]})]})]}),t.jsxs("div",{className:`form-step ${x===3?"active":""}`,id:"pStep3",children:[t.jsxs("h3",{className:"step-heading",children:[t.jsx("span",{className:"step-heading-num",children:"3"}),"Localisation"]}),t.jsxs("div",{className:`field ${j.pAdresse?"has-error":""}`,children:[t.jsxs("label",{children:[t.jsx("span",{className:"lbl-icon",children:"📍"})," Adresse complète ",t.jsx("span",{className:"req",children:"*"})]}),t.jsx("input",{type:"text",placeholder:"Ex: Rue de la Paix, Immeuble ABC, Apt. 12",value:m.adresse,onChange:R=>N({...m,adresse:R.target.value})}),t.jsx("span",{className:"field-error",children:"Champ requis"})]}),t.jsxs("div",{className:"field-row",children:[t.jsxs("div",{className:`field ${j.pQuartier?"has-error":""}`,children:[t.jsxs("label",{children:[t.jsx("span",{className:"lbl-icon",children:"🏘️"})," Quartier ",t.jsx("span",{className:"req",children:"*"})]}),t.jsx("input",{type:"text",placeholder:"Ex: Akwa",value:m.quartier,onChange:R=>N({...m,quartier:R.target.value})}),t.jsx("span",{className:"field-error",children:"Champ requis"})]}),t.jsxs("div",{className:`field ${j.pCommune?"has-error":""}`,children:[t.jsxs("label",{children:[t.jsx("span",{className:"lbl-icon",children:"🏙️"})," Commune ",t.jsx("span",{className:"req",children:"*"})]}),t.jsx("input",{type:"text",placeholder:"Ex: Douala 1er",value:m.commune,onChange:R=>N({...m,commune:R.target.value})}),t.jsx("span",{className:"field-error",children:"Champ requis"})]})]}),t.jsxs("div",{className:"field",children:[t.jsxs("label",{children:[t.jsx("span",{className:"lbl-icon",children:"🛰️"})," Coordonnées GPS ",t.jsx("span",{style:{fontWeight:400,color:"var(--muted-foreground)"},children:"(optionnel)"})]}),t.jsx("button",{type:"button",className:"gps-btn",onClick:ke,children:"📡 Utiliser ma position actuelle"})]}),t.jsxs("div",{className:"field-row",style:{marginTop:".75rem"},children:[t.jsxs("div",{className:"field",children:[t.jsx("label",{style:{fontSize:".8rem"},children:"Latitude"}),t.jsx("input",{type:"number",step:"0.000001",placeholder:"4.0511",value:m.latitude,onChange:R=>N({...m,latitude:R.target.value})})]}),t.jsxs("div",{className:"field",children:[t.jsx("label",{style:{fontSize:".8rem"},children:"Longitude"}),t.jsx("input",{type:"number",step:"0.000001",placeholder:"9.7679",value:m.longitude,onChange:R=>N({...m,longitude:R.target.value})})]})]}),t.jsxs("div",{className:"form-nav",children:[t.jsx("button",{type:"button",className:"btn-back",onClick:()=>I(2),children:"← Retour"}),t.jsxs("button",{type:"button",className:"btn-next",onClick:()=>J(3),children:["Étape suivante",t.jsx("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:t.jsx("path",{d:"M5 12h14M12 5l7 7-7 7"})})]})]})]}),t.jsxs("div",{className:`form-step ${x===4?"active":""}`,id:"pStep4",children:[t.jsxs("h3",{className:"step-heading",children:[t.jsx("span",{className:"step-heading-num",children:"4"}),"Vérification & Confirmation"]}),ga(),t.jsxs("label",{className:`cgu-row ${m.cgu?"checked":""}`,onClick:()=>N({...m,cgu:!m.cgu}),children:[t.jsx("input",{type:"checkbox",checked:m.cgu,readOnly:!0}),t.jsx("div",{className:"cgu-box"}),t.jsxs("div",{className:"cgu-text",children:["J'accepte les ",t.jsx("a",{href:"#",onClick:R=>R.preventDefault(),children:"Conditions Générales d'Utilisation"})," et la ",t.jsx("a",{href:"#",onClick:R=>R.preventDefault(),children:"Politique de Confidentialité"})," d'EcoCollect. ",t.jsx("span",{className:"req",style:{color:"var(--primary)"},children:"*"})]})]}),M.text&&M.type!=="success"&&t.jsx("div",{className:`msg-box ${M.type}`,children:M.text}),t.jsxs("div",{className:"form-nav",children:[t.jsx("button",{type:"button",className:"btn-back",onClick:()=>I(3),children:"← Retour"}),t.jsxs("button",{type:"button",className:"btn-next",onClick:Ee,disabled:k,children:[k?"Création...":"🚀 Créer mon compte",t.jsx("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:t.jsx("path",{d:"M5 12h14M12 5l7 7-7 7"})})]})]})]})]}),t.jsxs("div",{className:"auth-link",children:["Vous avez déjà un compte ? ",t.jsx("a",{href:"/login",children:"Se connecter"})]})]}),t.jsxs("div",{className:`screen ${i===2&&o==="collecteur"?"active":""}`,id:"screen2c",children:[t.jsxs("div",{className:"form-card",children:[t.jsx("div",{className:"form-role-badge",children:"🚛 Inscription Collecteur"}),t.jsxs("div",{className:`form-step ${x===1?"active":""}`,id:"cStep1",children:[t.jsxs("h3",{className:"step-heading",children:[t.jsx("span",{className:"step-heading-num",children:"1"}),"Informations de connexion"]}),t.jsxs("div",{className:"field-row",children:[t.jsxs("div",{className:`field ${j.cEmail?"has-error":""}`,children:[t.jsxs("label",{children:[t.jsx("span",{className:"lbl-icon",children:"✉️"})," Email ",t.jsx("span",{className:"req",children:"*"})]}),t.jsx("input",{type:"email",placeholder:"votre@email.com",value:f.email,onChange:R=>g({...f,email:R.target.value})}),t.jsx("span",{className:"field-error",children:"Email invalide"})]}),t.jsxs("div",{className:`field ${j.cPhone?"has-error":""}`,children:[t.jsxs("label",{children:[t.jsx("span",{className:"lbl-icon",children:"📱"})," Téléphone ",t.jsx("span",{className:"req",children:"*"})]}),t.jsx("input",{type:"tel",placeholder:"+237 6XX XXX XXX",value:f.phone,onChange:R=>g({...f,phone:R.target.value})}),t.jsx("span",{className:"field-error",children:"Téléphone invalide"})]})]}),t.jsxs("div",{className:"field-row",children:[t.jsxs("div",{className:`field ${j.cPassword?"has-error":""}`,children:[t.jsxs("label",{children:[t.jsx("span",{className:"lbl-icon",children:"🔒"})," Mot de passe ",t.jsx("span",{className:"req",children:"*"})]}),t.jsxs("div",{className:"input-wrap",children:[t.jsx("input",{type:"password",id:"c-pwd",placeholder:"Min. 8 caractères",value:f.password,onChange:R=>{g({...f,password:R.target.value}),H(R.target.value,"collecteur")}}),t.jsx("button",{type:"button",className:"input-toggle",onClick:R=>K("c-pwd",R.currentTarget),children:"👁"})]}),t.jsxs("div",{className:"pwd-strength",children:[t.jsx("div",{className:"pwd-bar-wrap",children:t.jsx("div",{className:"pwd-bar",style:{width:`${E.collecteur.score*25}%`,background:E.collecteur.score<=1?"#dc2626":E.collecteur.score===2?"#e0a020":E.collecteur.score>=3?"#2d8a5e":"#d9e0d9"}})}),t.jsx("span",{className:"pwd-label",children:E.collecteur.label})]}),t.jsx("span",{className:"field-error",children:"Min. 8 caractères"})]}),t.jsxs("div",{className:`field ${j.cPasswordConfirm?"has-error":""}`,children:[t.jsxs("label",{children:[t.jsx("span",{className:"lbl-icon",children:"🔒"})," Confirmer ",t.jsx("span",{className:"req",children:"*"})]}),t.jsxs("div",{className:"input-wrap",children:[t.jsx("input",{type:"password",id:"c-pwdConfirm",placeholder:"Répétez le mot de passe",value:f.passwordConfirm,onChange:R=>g({...f,passwordConfirm:R.target.value})}),t.jsx("button",{type:"button",className:"input-toggle",onClick:R=>K("c-pwdConfirm",R.currentTarget),children:"👁"})]}),t.jsx("span",{className:"field-error",children:"Les mots de passe ne correspondent pas"})]})]}),t.jsxs("div",{className:"form-nav",children:[t.jsx("button",{type:"button",className:"btn-back",onClick:Nt,children:"← Retour"}),t.jsxs("button",{type:"button",className:"btn-next",onClick:()=>ue(1),children:["Étape suivante",t.jsx("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:t.jsx("path",{d:"M5 12h14M12 5l7 7-7 7"})})]})]})]}),t.jsxs("div",{className:`form-step ${x===2?"active":""}`,id:"cStep2",children:[t.jsxs("h3",{className:"step-heading",children:[t.jsx("span",{className:"step-heading-num",children:"2"}),"Identité & Type"]}),t.jsxs("div",{className:`field ${j.cNomComplet?"has-error":""}`,children:[t.jsxs("label",{children:[t.jsx("span",{className:"lbl-icon",children:"👤"})," Nom complet ",t.jsx("span",{className:"req",children:"*"})]}),t.jsx("input",{type:"text",placeholder:"Jean Dupont",value:f.nomComplet,onChange:R=>g({...f,nomComplet:R.target.value})}),t.jsx("span",{className:"field-error",children:"Champ requis"})]}),t.jsxs("div",{className:"field",children:[t.jsxs("label",{children:[t.jsx("span",{className:"lbl-icon",children:"🔖"})," Type de collecteur ",t.jsx("span",{className:"req",children:"*"})]}),t.jsxs("div",{className:"col-type-grid",children:[t.jsxs("label",{className:"col-type-opt",children:[t.jsx("input",{type:"radio",name:"c-type",value:"independant",checked:f.type==="independant",onChange:R=>g({...f,type:R.target.value})}),t.jsxs("div",{className:"col-type-inner",children:[t.jsx("div",{className:"col-type-emoji",children:"🧑‍💼"}),t.jsx("div",{className:"col-type-name",children:"Indépendant"}),t.jsx("div",{className:"col-type-desc",children:"Vous travaillez seul et êtes directement rémunéré par mission"})]})]}),t.jsxs("label",{className:"col-type-opt",children:[t.jsx("input",{type:"radio",name:"c-type",value:"cooperative",checked:f.type==="cooperative",onChange:R=>g({...f,type:R.target.value})}),t.jsxs("div",{className:"col-type-inner",children:[t.jsx("div",{className:"col-type-emoji",children:"🤝"}),t.jsx("div",{className:"col-type-name",children:"Coopérative"}),t.jsx("div",{className:"col-type-desc",children:"Vous faites partie d'une structure collective de collecte"})]})]})]}),j.cType&&t.jsx("span",{className:"field-error",children:"Sélectionnez un type"})]}),t.jsxs("div",{className:"field",children:[t.jsxs("label",{children:[t.jsx("span",{className:"lbl-icon",children:"🪪"})," Numéro d'identité ",t.jsx("span",{style:{fontWeight:400,color:"var(--muted-foreground)"},children:"(indépendant)"})]}),t.jsx("input",{type:"text",placeholder:"CNI, Passeport...",value:f.identite,onChange:R=>g({...f,identite:R.target.value})}),t.jsx("span",{className:"field-hint",children:"Requis pour les collecteurs indépendants"})]}),t.jsxs("div",{className:"form-nav",children:[t.jsx("button",{type:"button",className:"btn-back",onClick:()=>xe(1),children:"← Retour"}),t.jsxs("button",{type:"button",className:"btn-next",onClick:()=>ue(2),children:["Étape suivante",t.jsx("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:t.jsx("path",{d:"M5 12h14M12 5l7 7-7 7"})})]})]})]}),t.jsxs("div",{className:`form-step ${x===3?"active":""}`,id:"cStep3",children:[t.jsxs("h3",{className:"step-heading",children:[t.jsx("span",{className:"step-heading-num",children:"3"}),"Zone d'intervention & Documents"]}),t.jsxs("div",{className:`field ${j.cZone?"has-error":""}`,children:[t.jsxs("label",{children:[t.jsx("span",{className:"lbl-icon",children:"🗺️"})," Nom de la zone ",t.jsx("span",{className:"req",children:"*"})]}),t.jsx("input",{type:"text",placeholder:"Ex: Zone Centre-ville",value:f.zone,onChange:R=>g({...f,zone:R.target.value})}),t.jsx("span",{className:"field-error",children:"Champ requis"})]}),t.jsxs("div",{className:"field-row",children:[t.jsxs("div",{className:"field",children:[t.jsxs("label",{children:[t.jsx("span",{className:"lbl-icon",children:"📌"})," Quartiers habituels"]}),t.jsx("input",{type:"text",placeholder:"Akwa, Bonanjo...",value:f.quartiers,onChange:R=>g({...f,quartiers:R.target.value})}),t.jsx("span",{className:"field-hint",children:"Séparés par des virgules"})]}),t.jsxs("div",{className:"field",children:[t.jsxs("label",{children:[t.jsx("span",{className:"lbl-icon",children:"🏙️"})," Communes"]}),t.jsx("input",{type:"text",placeholder:"Douala 1, Douala 3...",value:f.communes,onChange:R=>g({...f,communes:R.target.value})}),t.jsx("span",{className:"field-hint",children:"Séparées par des virgules"})]})]}),t.jsxs("div",{className:`field ${j.cPhoto?"has-error":""}`,children:[t.jsxs("label",{children:[t.jsx("span",{className:"lbl-icon",children:"📸"})," Photo de profil ",t.jsx("span",{className:"req",children:"*"})]}),t.jsxs("div",{className:"photo-upload",onClick:()=>Se(z),children:[t.jsx("div",{className:"photo-preview",children:O?t.jsx("img",{src:O,alt:"Prévisualisation",style:{display:"block"}}):t.jsx("span",{children:"📷"})}),t.jsxs("div",{className:"photo-upload-text",children:[t.jsx("strong",{children:"Cliquez pour choisir une photo"}),t.jsx("span",{children:"JPG, PNG — Max. 5 Mo"})]})]}),t.jsx("input",{type:"file",ref:z,accept:"image/*",style:{display:"none"},onChange:R=>ne(R,"photo")}),j.cPhoto&&t.jsx("span",{className:"field-error",children:"Photo requise"})]}),t.jsxs("div",{className:`field ${j.cCniRecto?"has-error":""}`,children:[t.jsxs("label",{children:[t.jsx("span",{className:"lbl-icon",children:"🪪"})," Photo CNI Recto ",t.jsx("span",{className:"req",children:"*"})]}),t.jsxs("div",{className:"photo-upload",onClick:()=>Se(Q),children:[t.jsx("div",{className:"photo-preview",children:Y?t.jsx("img",{src:Y,alt:"CNI Recto",style:{display:"block"}}):t.jsx("span",{children:"📄 Recto"})}),t.jsxs("div",{className:"photo-upload-text",children:[t.jsx("strong",{children:"Cliquez pour charger le recto de votre CNI"}),t.jsx("span",{children:"JPG, PNG — Max. 5 Mo"})]})]}),t.jsx("input",{type:"file",ref:Q,accept:"image/*",style:{display:"none"},onChange:R=>ne(R,"recto")}),j.cCniRecto&&t.jsx("span",{className:"field-error",children:"CNI recto requise"})]}),t.jsxs("div",{className:`field ${j.cCniVerso?"has-error":""}`,children:[t.jsxs("label",{children:[t.jsx("span",{className:"lbl-icon",children:"🪪"})," Photo CNI Verso ",t.jsx("span",{className:"req",children:"*"})]}),t.jsxs("div",{className:"photo-upload",onClick:()=>Se(ie),children:[t.jsx("div",{className:"photo-preview",children:ee?t.jsx("img",{src:ee,alt:"CNI Verso",style:{display:"block"}}):t.jsx("span",{children:"📄 Verso"})}),t.jsxs("div",{className:"photo-upload-text",children:[t.jsx("strong",{children:"Cliquez pour charger le verso de votre CNI"}),t.jsx("span",{children:"JPG, PNG — Max. 5 Mo"})]})]}),t.jsx("input",{type:"file",ref:ie,accept:"image/*",style:{display:"none"},onChange:R=>ne(R,"verso")}),j.cCniVerso&&t.jsx("span",{className:"field-error",children:"CNI verso requise"})]}),t.jsxs("div",{className:"form-nav",children:[t.jsx("button",{type:"button",className:"btn-back",onClick:()=>xe(2),children:"← Retour"}),t.jsxs("button",{type:"button",className:"btn-next",onClick:()=>ue(3),children:["Étape suivante",t.jsx("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:t.jsx("path",{d:"M5 12h14M12 5l7 7-7 7"})})]})]})]}),t.jsxs("div",{className:`form-step ${x===4?"active":""}`,id:"cStep4",children:[t.jsxs("h3",{className:"step-heading",children:[t.jsx("span",{className:"step-heading-num",children:"4"}),"Vérification & Confirmation"]}),ba(),t.jsxs("label",{className:`cgu-row ${f.cgu?"checked":""}`,onClick:()=>g({...f,cgu:!f.cgu}),children:[t.jsx("input",{type:"checkbox",checked:f.cgu,readOnly:!0}),t.jsx("div",{className:"cgu-box"}),t.jsxs("div",{className:"cgu-text",children:["J'accepte les ",t.jsx("a",{href:"#",onClick:R=>R.preventDefault(),children:"Conditions Générales d'Utilisation"})," et la ",t.jsx("a",{href:"#",onClick:R=>R.preventDefault(),children:"Politique de Confidentialité"})," d'EcoCollect. ",t.jsx("span",{className:"req",style:{color:"var(--primary)"},children:"*"})]})]}),M.text&&M.type!=="success"&&t.jsx("div",{className:`msg-box ${M.type}`,children:M.text}),t.jsxs("div",{className:"form-nav",children:[t.jsx("button",{type:"button",className:"btn-back",onClick:()=>xe(3),children:"← Retour"}),t.jsxs("button",{type:"button",className:"btn-next",onClick:ot,disabled:k,children:[k?"Création...":"🚀 Créer mon compte",t.jsx("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:t.jsx("path",{d:"M5 12h14M12 5l7 7-7 7"})})]})]})]})]}),t.jsxs("div",{className:"auth-link",children:["Vous avez déjà un compte ? ",t.jsx("a",{href:"/login",children:"Se connecter"})]})]}),t.jsx("div",{className:`screen ${i===3?"active":""}`,id:"screen3",children:t.jsxs("div",{className:"form-card",style:{textAlign:"center",padding:"4rem 3rem"},children:[t.jsx("div",{className:"success-anim",children:"🎉"}),t.jsxs("h2",{className:"success-title",children:["Félicitations ",t.jsxs("em",{children:[o==="producteur"?m.nomComplet?.split(" ")[0]:f.nomComplet?.split(" ")[0]," !"]})]}),t.jsx("p",{className:"success-sub",children:"Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter et commencer à utiliser EcoCollect."}),t.jsxs("div",{className:"success-actions",children:[t.jsx("button",{className:"btn-go primary",onClick:()=>window.location.href="/login",children:"Se connecter"}),t.jsx("button",{className:"btn-go ghost",onClick:()=>window.location.href="/",children:"Retour à l'accueil"})]})]})})]})]})},$g=()=>{const[i,u]=v.useState({identifiant:"",motDePasse:"",rememberMe:!1}),[o,d]=v.useState({}),[x,b]=v.useState(!1),[m,N]=v.useState(!1),[f,g]=v.useState({type:"",text:""}),j="https://ecobackend-7tuh.vercel.app",p={TOKEN:"ecocollect_token",USER:"ecocollect_user",ROLE:"ecocollect_role"},E={producteur:"/producteur",collecteur:"/collecteur",gestionnaire:"/gestionnaire",superviseur:"/superviseur",admin:"/admin"};v.useEffect(()=>{const $=localStorage.getItem(p.TOKEN),Y=localStorage.getItem(p.ROLE);$&&Y&&E[Y]&&(window.location.href=E[Y])},[]);const L=$=>{const{name:Y,value:Z,type:ee,checked:F}=$.target;u(z=>({...z,[Y]:ee==="checkbox"?F:Z})),o[Y]&&d(z=>({...z,[Y]:""}))},M=()=>{const $={};return i.identifiant.trim()?i.identifiant.includes("@")&&!/\S+@\S+\.\S+/.test(i.identifiant)&&($.identifiant="L'email n'est pas valide"):$.identifiant="L'email ou le téléphone est requis",i.motDePasse||($.motDePasse="Le mot de passe est requis"),d($),Object.keys($).length===0},w=($,Y,Z)=>{try{return localStorage.setItem(p.TOKEN,$),localStorage.setItem(p.USER,JSON.stringify(Y)),localStorage.setItem(p.ROLE,Z),i.rememberMe&&localStorage.setItem("ecocollect_remember","true"),console.log(`✅ Données sauvegardées pour ${Z}:`,Y?.nomComplet||Y?.email),!0}catch(ee){return console.error("❌ Erreur sauvegarde:",ee),!1}},k=async $=>{if($.preventDefault(),!!M()){b(!0),g({type:"info",text:"Connexion en cours..."});try{try{const Y=await fetch(`${j}/api/auth/connexion`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({identifiant:i.identifiant,motDePasse:i.motDePasse})}),Z=await Y.json();if(Y.ok&&Z.token){const ee=Z.producteur||Z.user||Z.utilisateur||Z;if(w(Z.token,ee,"producteur")){g({type:"success",text:"Connexion producteur réussie ! Redirection..."}),setTimeout(()=>window.location.href=E.producteur,1500);return}}}catch(Y){console.log("Producteur non trouvé ou erreur:",Y.message)}try{const Y=await fetch(`${j}/api/collecteurs/connexion`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({identifiant:i.identifiant,motDePasse:i.motDePasse})}),Z=await Y.json();if(Y.ok&&Z.success&&Z.token&&w(Z.token,Z.collecteur,"collecteur")){g({type:"success",text:"Connexion collecteur réussie ! Redirection..."}),setTimeout(()=>window.location.href=E.collecteur,1500);return}}catch(Y){console.log("Collecteur non trouvé ou erreur:",Y.message)}try{const Y=await fetch(`${j}/api/gestionnaires/connexion`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({identifiant:i.identifiant,motDePasse:i.motDePasse})}),Z=await Y.json();if(Y.ok&&Z.success&&Z.token&&w(Z.token,Z.utilisateur,"gestionnaire")){g({type:"success",text:"Connexion gestionnaire réussie ! Redirection..."}),setTimeout(()=>window.location.href=E.gestionnaire,1500);return}}catch(Y){console.log("Gestionnaire non trouvé ou erreur:",Y.message)}try{const Y=await fetch(`${j}/api/superviseurs/connexion`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({identifiant:i.identifiant,motDePasse:i.motDePasse})}),Z=await Y.json();if(Y.ok&&Z.success&&Z.token&&w(Z.token,Z.superviseur,"superviseur")){g({type:"success",text:"Connexion superviseur réussie ! Redirection..."}),setTimeout(()=>window.location.href=E.superviseur,1500);return}}catch(Y){console.log("Superviseur non trouvé ou erreur:",Y.message)}try{const Y=await fetch(`${j}/api/admin/connexion`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({identifiant:i.identifiant,motDePasse:i.motDePasse})}),Z=await Y.json();if(Y.ok&&Z.token&&w(Z.token,Z.admin,"admin")){g({type:"success",text:"Connexion admin réussie ! Redirection..."}),setTimeout(()=>window.location.href=E.admin,1500);return}}catch(Y){console.log("Admin non trouvé ou erreur:",Y.message)}throw new Error("Identifiants incorrects ou compte inexistant")}catch(Y){console.error("❌ Erreur connexion:",Y),g({type:"error",text:Y.message||"Erreur de connexion au serveur"}),localStorage.removeItem(p.TOKEN),localStorage.removeItem(p.USER),localStorage.removeItem(p.ROLE)}finally{b(!1)}}},A=$=>$.includes("@");return t.jsxs(t.Fragment,{children:[t.jsx("style",{children:`
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Serif+Display:ital@0;1&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    :root {
      --background: #f8faf8;
      --foreground: #1a1e1a;
      --card: #ffffff;
      --card-foreground: #1a1e1a;
      --primary: #2d8a5e;
      --primary-foreground: #ffffff;
      --secondary: #e8f3e8;
      --secondary-foreground: #1a5c3a;
      --muted: #f0f3f0;
      --muted-foreground: #5a655a;
      --accent: #e0a020;
      --accent-foreground: #3d2d06;
      --destructive: #dc2626;
      --border: #d9e0d9;
      --ring: #2d8a5e;
      --radius: 0.75rem;
      --radius-lg: 1.25rem;
      --radius-xl: 1.75rem;
      --shadow: 0 4px 20px -4px rgba(0, 0, 0, 0.05);
      --shadow-lg: 0 10px 40px -8px rgba(0, 0, 0, 0.08);
      --shadow-colored: 0 4px 20px -4px rgba(45, 138, 94, 0.15);
      
      --ff-head: 'DM Serif Display', Georgia, serif;
      --ff-body: 'Outfit', sans-serif;
      
      --ease: cubic-bezier(.4,0,.2,1);
      --spring: cubic-bezier(.34,1.56,.64,1);
    }

    body {
      font-family: var(--ff-body);
      background: var(--background);
      color: var(--foreground);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      position: relative;
    }

    body::before {
      content:''; position:fixed; inset:0; pointer-events:none; z-index:0;
      background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
      opacity:.015;
    }

    .ambient {
      position:fixed; pointer-events:none; z-index:0;
      border-radius:50%; filter:blur(100px);
    }

    .ambient-1 { 
      width:600px; height:400px; top:0; left:50%; transform:translateX(-50%);
      background:radial-gradient(ellipse, rgba(45,138,94,0.03) 0%, transparent 70%); 
    }

    .ambient-2 { 
      width:400px; height:300px; bottom:10%; right:5%;
      background:radial-gradient(ellipse, rgba(45,138,94,0.02) 0%, transparent 70%); 
    }

    .login-container {
      max-width: 450px;
      width: 100%;
      background: var(--card);
      border-radius: var(--radius-xl);
      padding: 2.5rem;
      border: 1px solid var(--border);
      box-shadow: var(--shadow-lg);
      animation: fadeIn 0.5s var(--spring) both;
      position: relative;
      z-index: 1;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(24px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      margin-bottom: 2rem;
      text-decoration: none;
    }

    .logo-img {
      height: 70px;
      width: auto;
      border-radius: 15px;
      transition: transform 0.3s var(--spring);
    }

    .logo-img:hover {
      transform: scale(1.05);
    }

    .logo-text {
      font-size: 1.8rem;
      font-weight: 800;
      color: var(--foreground);
    }

    .logo-text span {
      color: var(--primary);
    }

    h1 {
      font-family: var(--ff-head);
      text-align: center;
      margin-bottom: 2rem;
      font-size: 1.8rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      color: var(--foreground);
    }

    h1 em {
      color: var(--primary);
      font-style: italic;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--foreground);
      letter-spacing: 0.02em;
    }

    label i {
      color: var(--primary);
      margin-right: 0.5rem;
    }

    .input-wrap {
      position: relative;
    }

    .input-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--muted-foreground);
      font-size: 1rem;
    }

    input {
      width: 100%;
      padding: 0.9rem 1rem 0.9rem 2.5rem;
      border-radius: var(--radius);
      background: var(--muted);
      border: 1.5px solid var(--border);
      color: var(--foreground);
      font-size: 0.95rem;
      font-family: var(--ff-body);
      transition: all 0.2s var(--ease);
      outline: none;
    }

    input:focus {
      border-color: var(--ring);
      box-shadow: 0 0 0 3px rgba(45, 138, 94, 0.1);
    }

    input.error {
      border-color: var(--destructive);
    }

    .toggle-password {
      position: absolute;
      right: 1rem;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      color: var(--muted-foreground);
      font-size: 1.1rem;
      transition: color 0.2s;
    }

    .toggle-password:hover {
      color: var(--primary);
    }

    .error-text {
      color: var(--destructive);
      font-size: 0.75rem;
      margin-top: 0.25rem;
      font-weight: 500;
    }

    .checkbox-group {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 1.5rem 0;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      color: var(--foreground);
      font-size: 0.9rem;
    }

    .checkbox-label input[type="checkbox"] {
      width: 18px;
      height: 18px;
      accent-color: var(--primary);
      cursor: pointer;
    }

    .forgot-link {
      color: var(--primary);
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 600;
      transition: color 0.2s;
    }

    .forgot-link:hover {
      text-decoration: underline;
    }

    .btn {
      width: 100%;
      padding: 1rem;
      border: none;
      border-radius: 100px;
      cursor: pointer;
      font-family: var(--ff-body);
      font-weight: 700;
      font-size: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      transition: all 0.3s var(--spring);
      background: var(--primary);
      color: white;
      box-shadow: 0 4px 15px rgba(45, 138, 94, 0.2);
    }

    .btn:hover:not(:disabled) {
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(45, 138, 94, 0.3);
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn i {
      font-size: 1rem;
    }

    .btn svg {
      transition: transform 0.3s var(--spring);
    }

    .btn:hover svg {
      transform: translateX(4px);
    }

    .spinner {
      width: 1.2rem;
      height: 1.2rem;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .message {
      padding: 1rem;
      margin-top: 1rem;
      border-radius: var(--radius);
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      animation: slideIn 0.3s var(--ease);
    }

    @keyframes slideIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .message.success {
      background: var(--secondary);
      color: var(--secondary-foreground);
      border: 1px solid var(--primary);
    }

    .message.error {
      background: rgba(220, 38, 38, 0.1);
      color: var(--destructive);
      border: 1px solid var(--destructive);
    }

    .message.info {
      background: rgba(45, 138, 94, 0.05);
      color: var(--primary);
      border: 1px solid var(--primary);
    }

    .links {
      text-align: center;
      margin-top: 1.5rem;
      font-size: 0.9rem;
      color: var(--muted-foreground);
    }

    .links a {
      color: var(--primary);
      text-decoration: none;
      font-weight: 600;
      transition: color 0.2s;
    }

    .links a:hover {
      text-decoration: underline;
    }

    .back-home {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 1rem;
      color: var(--muted-foreground);
      text-decoration: none;
      font-size: 0.9rem;
      transition: all 0.2s;
    }

    .back-home:hover {
      color: var(--primary);
      transform: translateX(-3px);
    }

    .divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--border), transparent);
      margin: 2rem 0;
    }

    @media (max-width: 480px) {
      .login-container {
        padding: 2rem 1.5rem;
      }
      
      .logo-img {
        height: 60px;
      }
    }
  `}),t.jsx("div",{className:"ambient ambient-1"}),t.jsx("div",{className:"ambient ambient-2"}),t.jsxs("div",{className:"login-container",children:[t.jsx("a",{href:"/",className:"logo",children:t.jsx("img",{src:Hl,alt:"EcoCollect",className:"logo-img"})}),t.jsx("h1",{children:t.jsx("em",{children:"Connexion"})}),t.jsxs("form",{onSubmit:k,children:[t.jsxs("div",{className:"form-group",children:[t.jsxs("label",{children:[t.jsx("i",{className:"fas fa-envelope"}),"Email ou Téléphone"]}),t.jsxs("div",{className:"input-wrap",children:[t.jsx("i",{className:`fas ${A(i.identifiant)?"fa-envelope":"fa-phone"} input-icon`}),t.jsx("input",{type:"text",name:"identifiant",value:i.identifiant,onChange:L,className:o.identifiant?"error":"",placeholder:"votre@email.com"})]}),o.identifiant&&t.jsx("div",{className:"error-text",children:o.identifiant})]}),t.jsxs("div",{className:"form-group",children:[t.jsxs("label",{children:[t.jsx("i",{className:"fas fa-lock"}),"Mot de passe"]}),t.jsxs("div",{className:"input-wrap",children:[t.jsx("i",{className:"fas fa-lock input-icon"}),t.jsx("input",{type:m?"text":"password",name:"motDePasse",value:i.motDePasse,onChange:L,className:o.motDePasse?"error":"",placeholder:"••••••••"}),t.jsx("button",{type:"button",className:"toggle-password",onClick:()=>N(!m),children:t.jsx("i",{className:`fas ${m?"fa-eye-slash":"fa-eye"}`})})]}),o.motDePasse&&t.jsx("div",{className:"error-text",children:o.motDePasse})]}),t.jsxs("div",{className:"checkbox-group",children:[t.jsxs("label",{className:"checkbox-label",children:[t.jsx("input",{type:"checkbox",name:"rememberMe",checked:i.rememberMe,onChange:L}),"Se souvenir de moi"]}),t.jsx("a",{href:"/forgot-password",className:"forgot-link",children:"Mot de passe oublié ?"})]}),f.text&&t.jsxs("div",{className:`message ${f.type}`,children:[t.jsx("i",{className:`fas ${f.type==="success"?"fa-check-circle":f.type==="error"?"fa-exclamation-circle":"fa-info-circle"}`}),f.text]}),t.jsx("button",{type:"submit",className:"btn",disabled:x,children:x?t.jsxs(t.Fragment,{children:[t.jsx("div",{className:"spinner"}),"Connexion en cours..."]}):t.jsxs(t.Fragment,{children:[t.jsx("i",{className:"fas fa-sign-in-alt"}),"Se connecter"]})})]}),t.jsxs("div",{className:"links",children:[t.jsxs("p",{children:["Pas encore de compte ? ",t.jsx("a",{href:"/register",children:"S'inscrire"})]}),t.jsxs("a",{href:"/",className:"back-home",children:[t.jsx("i",{className:"fas fa-arrow-left"}),"Retour à l'accueil"]})]})]}),t.jsx("link",{rel:"stylesheet",href:"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"})]})};const Ax=(...i)=>i.filter((u,o,d)=>!!u&&u.trim()!==""&&d.indexOf(u)===o).join(" ").trim();const Xg=i=>i.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase();const Gg=i=>i.replace(/^([A-Z])|[\s-_]+(\w)/g,(u,o,d)=>d?d.toUpperCase():o.toLowerCase());const nx=i=>{const u=Gg(i);return u.charAt(0).toUpperCase()+u.slice(1)};var Zg={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};const Qg=i=>{for(const u in i)if(u.startsWith("aria-")||u==="role"||u==="title")return!0;return!1};const Kg=v.forwardRef(({color:i="currentColor",size:u=24,strokeWidth:o=2,absoluteStrokeWidth:d,className:x="",children:b,iconNode:m,...N},f)=>v.createElement("svg",{ref:f,...Zg,width:u,height:u,stroke:i,strokeWidth:d?Number(o)*24/Number(u):o,className:Ax("lucide",x),...!b&&!Qg(N)&&{"aria-hidden":"true"},...N},[...m.map(([g,j])=>v.createElement(g,j)),...Array.isArray(b)?b:[b]]));const P=(i,u)=>{const o=v.forwardRef(({className:d,...x},b)=>v.createElement(Kg,{ref:b,iconNode:u,className:Ax(`lucide-${Xg(nx(i))}`,`lucide-${i}`,d),...x}));return o.displayName=nx(i),o};const Jg=[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]],Gs=P("arrow-left",Jg);const Pg=[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]],$r=P("arrow-right",Pg);const Wg=[["path",{d:"m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526",key:"1yiouv"}],["circle",{cx:"12",cy:"8",r:"6",key:"1vp47v"}]],zt=P("award",Wg);const Fg=[["path",{d:"M10.268 21a2 2 0 0 0 3.464 0",key:"vwvbt9"}],["path",{d:"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",key:"11g9vi"}]],fs=P("bell",Fg);const Ig=[["path",{d:"M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z",key:"hh9hay"}],["path",{d:"m3.3 7 8.7 5 8.7-5",key:"g66t2b"}],["path",{d:"M12 22V12",key:"d0xqtd"}]],ix=P("box",Ig);const eb=[["path",{d:"M10 12h4",key:"a56b0p"}],["path",{d:"M10 8h4",key:"1sr2af"}],["path",{d:"M14 21v-3a2 2 0 0 0-4 0v3",key:"1rgiei"}],["path",{d:"M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2",key:"secmi2"}],["path",{d:"M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16",key:"16ra0t"}]],tb=P("building-2",eb);const ab=[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]],at=P("calendar",ab);const sb=[["path",{d:"M3 3v16a2 2 0 0 0 2 2h16",key:"c24i48"}],["path",{d:"M18 17V9",key:"2bz60n"}],["path",{d:"M13 17V5",key:"1frdt8"}],["path",{d:"M8 17v-3",key:"17ska0"}]],pi=P("chart-column",sb);const lb=[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]],cx=P("check",lb);const rb=[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]],nb=P("chevron-down",rb);const ib=[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]],qr=P("chevron-right",ib);const cb=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]],Al=P("circle-alert",cb);const ob=[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]],Ce=P("circle-check-big",ob);const db=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3",key:"1u773s"}],["path",{d:"M12 17h.01",key:"p32p05"}]],ub=P("circle-question-mark",db);const mb=[["path",{d:"M12 6v6l4 2",key:"mmk7yg"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]],Qe=P("clock",mb);const hb=[["path",{d:"M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5",key:"laymnq"}],["path",{d:"M8.5 8.5v.01",key:"ue8clq"}],["path",{d:"M16 15.5v.01",key:"14dtrp"}],["path",{d:"M12 12v.01",key:"u5ubse"}],["path",{d:"M11 17v.01",key:"1hyl5a"}],["path",{d:"M7 14v.01",key:"uct60s"}]],xb=P("cookie",hb);const fb=[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]],pb=P("copy",fb);const gb=[["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M17 20v2",key:"1rnc9c"}],["path",{d:"M17 2v2",key:"11trls"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M2 17h2",key:"7oei6x"}],["path",{d:"M2 7h2",key:"asdhe0"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"M20 17h2",key:"1fpfkl"}],["path",{d:"M20 7h2",key:"1o8tra"}],["path",{d:"M7 20v2",key:"4gnj0m"}],["path",{d:"M7 2v2",key:"1i4yhu"}],["rect",{x:"4",y:"4",width:"16",height:"16",rx:"2",key:"1vbyd7"}],["rect",{x:"8",y:"8",width:"8",height:"8",rx:"1",key:"z9xiuo"}]],bb=P("cpu",gb);const vb=[["path",{d:"M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z",key:"1vdc57"}],["path",{d:"M5 21h14",key:"11awu3"}]],yb=P("crown",vb);const jb=[["ellipse",{cx:"12",cy:"5",rx:"9",ry:"3",key:"msslwz"}],["path",{d:"M3 5V19A9 3 0 0 0 21 19V5",key:"1wlel7"}],["path",{d:"M3 12A9 3 0 0 0 21 12",key:"mv7ke4"}]],Rx=P("database",jb);const Nb=[["path",{d:"M12 15V3",key:"m9g1x1"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["path",{d:"m7 10 5 5 5-5",key:"brsn70"}]],Fo=P("download",Nb);const wb=[["path",{d:"M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z",key:"1ptgy4"}],["path",{d:"M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97",key:"1sl1rz"}]],Cb=P("droplets",wb);const Sb=[["path",{d:"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",key:"ct8e1f"}],["path",{d:"M14.084 14.158a3 3 0 0 1-4.242-4.242",key:"151rxh"}],["path",{d:"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",key:"13bj9a"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]],ox=P("eye-off",Sb);const Eb=[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]],ps=P("eye",Eb);const zb=[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",key:"1oefj6"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5",key:"wfsgrz"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]],Rl=P("file-text",zb);const kb=[["path",{d:"M10.5 3 8 9l4 13 4-13-2.5-6",key:"b3dvk1"}],["path",{d:"M17 3a2 2 0 0 1 1.6.8l3 4a2 2 0 0 1 .013 2.382l-7.99 10.986a2 2 0 0 1-3.247 0l-7.99-10.986A2 2 0 0 1 2.4 7.8l2.998-3.997A2 2 0 0 1 7 3z",key:"7w4byz"}],["path",{d:"M2 9h20",key:"16fsjt"}]],Tb=P("gem",kb);const Mb=[["rect",{x:"3",y:"8",width:"18",height:"4",rx:"1",key:"bkv52"}],["path",{d:"M12 8v13",key:"1c76mn"}],["path",{d:"M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7",key:"6wjy6b"}],["path",{d:"M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5",key:"1ihvrl"}]],Db=P("gift",Mb);const _b=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20",key:"13o1zl"}],["path",{d:"M2 12h20",key:"9i4pu4"}]],qx=P("globe",_b);const Ab=[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}],["path",{d:"M12 7v5l4 2",key:"1fdv2h"}]],hi=P("history",Ab);const Rb=[["path",{d:"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8",key:"5wwlr5"}],["path",{d:"M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",key:"r6nss1"}]],Ox=P("house",Rb);const qb=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]],gi=P("info",qb);const Ob=[["path",{d:"m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4",key:"g0fldk"}],["path",{d:"m21 2-9.6 9.6",key:"1j0ho8"}],["circle",{cx:"7.5",cy:"15.5",r:"5.5",key:"yqb3hr"}]],dx=P("key",Ob);const Lb=[["path",{d:"M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z",key:"nnexq3"}],["path",{d:"M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12",key:"mt58a7"}]],Vt=P("leaf",Lb);const Ub=[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]],Bs=P("lock",Ub);const Hb=[["path",{d:"m16 17 5-5-5-5",key:"1bji2h"}],["path",{d:"M21 12H9",key:"dn1m92"}],["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}]],Vs=P("log-out",Hb);const Bb=[["path",{d:"m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7",key:"132q7q"}],["rect",{x:"2",y:"4",width:"20",height:"16",rx:"2",key:"izxlao"}]],gs=P("mail",Bb);const Yb=[["path",{d:"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",key:"1r0f0z"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]],pa=P("map-pin",Yb);const Vb=[["path",{d:"M18 8c0 3.613-3.869 7.429-5.393 8.795a1 1 0 0 1-1.214 0C9.87 15.429 6 11.613 6 8a6 6 0 0 1 12 0",key:"11u0oz"}],["circle",{cx:"12",cy:"8",r:"2",key:"1822b1"}],["path",{d:"M8.714 14h-3.71a1 1 0 0 0-.948.683l-2.004 6A1 1 0 0 0 3 22h18a1 1 0 0 0 .948-1.316l-2-6a1 1 0 0 0-.949-.684h-3.712",key:"q8zwxj"}]],$b=P("map-pinned",Vb);const Xb=[["path",{d:"M4 5h16",key:"1tepv9"}],["path",{d:"M4 12h16",key:"1lakjw"}],["path",{d:"M4 19h16",key:"1djgab"}]],Lx=P("menu",Xb);const Gb=[["path",{d:"M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719",key:"1sd12s"}]],Or=P("message-circle",Gb);const Zb=[["path",{d:"M5 12h14",key:"1ays0h"}]],Qb=P("minus",Zb);const Kb=[["path",{d:"M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401",key:"kfwtm"}]],Ux=P("moon",Kb);const Jb=[["polygon",{points:"3 11 22 2 13 21 11 13 3 11",key:"1ltx0t"}]],Pb=P("navigation",Jb);const Wb=[["path",{d:"M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z",key:"1a0edw"}],["path",{d:"M12 22V12",key:"d0xqtd"}],["polyline",{points:"3.29 7 12 12 20.71 7",key:"ousv84"}],["path",{d:"m7.5 4.27 9 5.15",key:"1c824w"}]],De=P("package",Wb);const Fb=[["path",{d:"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",key:"1a8usu"}]],Ib=P("pen",Fb);const ev=[["path",{d:"M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",key:"9njp5v"}]],ia=P("phone",ev);const tv=[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]],Ur=P("plus",tv);const av=[["path",{d:"M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5",key:"x6z5xu"}],["path",{d:"M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12",key:"1x4zh5"}],["path",{d:"m14 16-3 3 3 3",key:"f6jyew"}],["path",{d:"M8.293 13.596 7.196 9.5 3.1 10.598",key:"wf1obh"}],["path",{d:"m9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 11.985 3a1.784 1.784 0 0 1 1.546.888l3.943 6.843",key:"9tzpgr"}],["path",{d:"m13.378 9.633 4.096 1.098 1.097-4.096",key:"1oe83g"}]],bs=P("recycle",av);const sv=[["circle",{cx:"6",cy:"19",r:"3",key:"1kj8tv"}],["path",{d:"M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15",key:"1d8sl"}],["circle",{cx:"18",cy:"5",r:"3",key:"gq8acd"}]],ux=P("route",sv);const lv=[["path",{d:"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",key:"1c8476"}],["path",{d:"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",key:"1ydtos"}],["path",{d:"M7 3v4a1 1 0 0 0 1 1h7",key:"t51u73"}]],Hx=P("save",lv);const rv=[["path",{d:"M12 3v18",key:"108xh3"}],["path",{d:"m19 8 3 8a5 5 0 0 1-6 0zV7",key:"zcdpyk"}],["path",{d:"M3 7h1a17 17 0 0 0 8-2 17 17 0 0 0 8 2h1",key:"1yorad"}],["path",{d:"m5 8 3 8a5 5 0 0 1-6 0zV7",key:"eua70x"}],["path",{d:"M7 21h10",key:"1b0cd5"}]],$s=P("scale",rv);const nv=[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]],ql=P("search",nv);const iv=[["path",{d:"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",key:"1ffxy3"}],["path",{d:"m21.854 2.147-10.94 10.939",key:"12cjpa"}]],cv=P("send",iv);const ov=[["rect",{width:"20",height:"8",x:"2",y:"2",rx:"2",ry:"2",key:"ngkwjq"}],["rect",{width:"20",height:"8",x:"2",y:"14",rx:"2",ry:"2",key:"iecqi9"}],["line",{x1:"6",x2:"6.01",y1:"6",y2:"6",key:"16zg32"}],["line",{x1:"6",x2:"6.01",y1:"18",y2:"18",key:"nzw8ys"}]],dv=P("server",ov);const uv=[["path",{d:"M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",key:"1i5ecw"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]],Io=P("settings",uv);const mv=[["path",{d:"M12 2v13",key:"1km8f5"}],["path",{d:"m16 6-4-4-4 4",key:"13yo43"}],["path",{d:"M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8",key:"1b2hhj"}]],hv=P("share",mv);const xv=[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}]],vs=P("shield",xv);const fv=[["path",{d:"M16 10a4 4 0 0 1-8 0",key:"1ltviw"}],["path",{d:"M3.103 6.034h17.794",key:"awc11p"}],["path",{d:"M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z",key:"o988cm"}]],Vo=P("shopping-bag",fv);const pv=[["rect",{width:"14",height:"20",x:"5",y:"2",rx:"2",ry:"2",key:"1yt0o3"}],["path",{d:"M12 18h.01",key:"mhygvu"}]],gv=P("smartphone",pv);const bv=[["path",{d:"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",key:"1s2grr"}],["path",{d:"M20 2v4",key:"1rf3ol"}],["path",{d:"M22 4h-4",key:"gwowj6"}],["circle",{cx:"4",cy:"20",r:"2",key:"6kqj1y"}]],Ys=P("sparkles",bv);const vv=[["path",{d:"M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",key:"1m0v6g"}],["path",{d:"M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",key:"ohrbg2"}]],Bx=P("square-pen",vv);const yv=[["path",{d:"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",key:"r04s7s"}]],Ol=P("star",yv);const jv=[["path",{d:"M15 21v-5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v5",key:"slp6dd"}],["path",{d:"M17.774 10.31a1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.451 0 1.12 1.12 0 0 0-1.548 0 2.5 2.5 0 0 1-3.452 0 1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.77-3.248l2.889-4.184A2 2 0 0 1 7 2h10a2 2 0 0 1 1.653.873l2.895 4.192a2.5 2.5 0 0 1-3.774 3.244",key:"o0xfot"}],["path",{d:"M4 10.95V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8.05",key:"wn3emo"}]],Nv=P("store",jv);const wv=[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]],Yx=P("sun",wv);const Cv=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["circle",{cx:"12",cy:"12",r:"6",key:"1vlfrh"}],["circle",{cx:"12",cy:"12",r:"2",key:"1c9p78"}]],Vx=P("target",Cv);const Sv=[["line",{x1:"10",x2:"14",y1:"2",y2:"2",key:"14vaq8"}],["line",{x1:"12",x2:"15",y1:"14",y2:"11",key:"17fdiu"}],["circle",{cx:"12",cy:"14",r:"8",key:"1e1u0o"}]],Ev=P("timer",Sv);const zv=[["path",{d:"M10 11v6",key:"nco0om"}],["path",{d:"M14 11v6",key:"outv1u"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",key:"miytrc"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",key:"e791ji"}]],ft=P("trash-2",zv);const kv=[["path",{d:"M16 7h6v6",key:"box55l"}],["path",{d:"m22 7-8.5 8.5-5-5L2 17",key:"1t1m79"}]],Hr=P("trending-up",kv);const Tv=[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]],Go=P("triangle-alert",Tv);const Mv=[["path",{d:"M10 14.66v1.626a2 2 0 0 1-.976 1.696A5 5 0 0 0 7 21.978",key:"1n3hpd"}],["path",{d:"M14 14.66v1.626a2 2 0 0 0 .976 1.696A5 5 0 0 1 17 21.978",key:"rfe1zi"}],["path",{d:"M18 9h1.5a1 1 0 0 0 0-5H18",key:"7xy6bh"}],["path",{d:"M4 22h16",key:"57wxv0"}],["path",{d:"M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z",key:"1mhfuq"}],["path",{d:"M6 9H4.5a1 1 0 0 1 0-5H6",key:"tex48p"}]],Dv=P("trophy",Mv);const _v=[["path",{d:"M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2",key:"wrbu53"}],["path",{d:"M15 18H9",key:"1lyqi6"}],["path",{d:"M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14",key:"lysw3i"}],["circle",{cx:"17",cy:"18",r:"2",key:"332jqn"}],["circle",{cx:"7",cy:"18",r:"2",key:"19iecd"}]],na=P("truck",_v);const Av=[["path",{d:"M12 3v12",key:"1x0j5s"}],["path",{d:"m17 8-5-5-5 5",key:"7q97r8"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}]],Rv=P("upload",Av);const qv=[["path",{d:"m16 11 2 2 4-4",key:"9rsbq5"}],["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}]],Ov=P("user-check",qv);const Lv=[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]],ct=P("user",Lv);const Uv=[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["path",{d:"M16 3.128a4 4 0 0 1 0 7.744",key:"16gr8j"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}]],ta=P("users",Uv);const Hv=[["path",{d:"M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",key:"uqj9uw"}],["path",{d:"M16 9a5 5 0 0 1 0 6",key:"1q6k2b"}],["path",{d:"M19.364 18.364a9 9 0 0 0 0-12.728",key:"ijwkga"}]],Bv=P("volume-2",Hv);const Yv=[["path",{d:"M12 20h.01",key:"zekei9"}],["path",{d:"M2 8.82a15 15 0 0 1 20 0",key:"dnpr2z"}],["path",{d:"M5 12.859a10 10 0 0 1 14 0",key:"1x1e6c"}],["path",{d:"M8.5 16.429a5 5 0 0 1 7 0",key:"1bycff"}]],Vv=P("wifi",Yv);const $v=[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]],ys=P("x",$v);const Xv=[["path",{d:"M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",key:"1xq2db"}]],Gv=P("zap",Xv),Zv=()=>{const[i,u]=v.useState({contact:""}),[o,d]=v.useState({}),[x,b]=v.useState(!1),[m,N]=v.useState({type:"",text:""}),f="https://ecobackend-7tuh.vercel.app",g=M=>{const{name:w,value:k}=M.target;u(A=>({...A,[w]:k})),o[w]&&d(A=>({...A,[w]:""})),m.text&&N({type:"",text:""})},j=()=>{const M={};return i.contact.trim()?i.contact.includes("@")&&!/\S+@\S+\.\S+/.test(i.contact)&&(M.contact="L'email n'est pas valide"):M.contact="L'email ou le téléphone est requis",d(M),Object.keys(M).length===0},p=async M=>{if(M.preventDefault(),!!j()){b(!0),N({type:"info",text:"Envoi du code en cours..."});try{const k=await(await fetch(`${f}/api/auth/demande-reinitialisation-mdp`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:i.contact})})).json();if(k.success)N({type:"success",text:"Code envoyé ! Redirection..."}),sessionStorage.setItem("reset_email",i.contact),setTimeout(()=>window.location.href="/verify-code",1500);else throw new Error(k.message||"Erreur lors de la demande")}catch(w){N({type:"error",text:w.message})}finally{b(!1)}}},E=M=>M.includes("@");return t.jsxs(t.Fragment,{children:[t.jsx("style",{children:`
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Serif+Display:ital@0;1&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    :root {
      --background: #f8faf8;
      --foreground: #1a1e1a;
      --card: #ffffff;
      --primary: #2d8a5e;
      --secondary: #e8f3e8;
      --secondary-foreground: #1a5c3a;
      --muted: #f0f3f0;
      --muted-foreground: #5a655a;
      --destructive: #dc2626;
      --border: #d9e0d9;
      --ring: #2d8a5e;
      --radius: 0.75rem;
      --radius-xl: 1.75rem;
      --shadow-lg: 0 10px 40px -8px rgba(0, 0, 0, 0.08);
      
      --ff-head: 'DM Serif Display', Georgia, serif;
      --ff-body: 'Outfit', sans-serif;
      --ease: cubic-bezier(.4,0,.2,1);
      --spring: cubic-bezier(.34,1.56,.64,1);
    }

    body {
      font-family: var(--ff-body);
      background: var(--background);
      color: var(--foreground);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      position: relative;
    }

    body::before {
      content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
      opacity: .015;
    }

    .ambient {
      position: fixed; pointer-events: none; z-index: 0;
      border-radius: 50%; filter: blur(100px);
    }

    .ambient-1 { 
      width: 600px; height: 400px; top: 0; left: 50%; transform: translateX(-50%);
      background: radial-gradient(ellipse, rgba(45,138,94,0.03) 0%, transparent 70%); 
    }

    .ambient-2 { 
      width: 400px; height: 300px; bottom: 10%; right: 5%;
      background: radial-gradient(ellipse, rgba(45,138,94,0.02) 0%, transparent 70%); 
    }

    .auth-container {
      max-width: 450px;
      width: 100%;
      background: var(--card);
      border-radius: var(--radius-xl);
      padding: 2.5rem;
      border: 1px solid var(--border);
      box-shadow: var(--shadow-lg);
      animation: fadeIn 0.5s var(--spring) both;
      position: relative;
      z-index: 1;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(24px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 2rem;
    }

    .logo-img {
      height: 70px;
      width: auto;
      border-radius: 15px;
      transition: transform 0.3s var(--spring);
    }

    .logo-img:hover {
      transform: scale(1.05);
    }

    h1 {
      font-family: var(--ff-head);
      text-align: center;
      margin-bottom: 2rem;
      font-size: 2rem;
      color: var(--foreground);
    }

    h1 em {
      color: var(--primary);
      font-style: italic;
    }

    .subtitle {
      text-align: center;
      color: var(--muted-foreground);
      margin-bottom: 2rem;
      line-height: 1.6;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--foreground);
    }

    label i, label svg {
      color: var(--primary);
      margin-right: 0.5rem;
      vertical-align: middle;
    }

    .input-wrap {
      position: relative;
    }

    .input-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--muted-foreground);
    }

    input {
      width: 100%;
      padding: 0.9rem 1rem 0.9rem 2.5rem;
      border-radius: var(--radius);
      background: var(--muted);
      border: 1.5px solid var(--border);
      color: var(--foreground);
      font-size: 0.95rem;
      font-family: var(--ff-body);
      transition: all 0.2s var(--ease);
      outline: none;
    }

    input:focus {
      border-color: var(--ring);
      box-shadow: 0 0 0 3px rgba(45, 138, 94, 0.1);
    }

    input.error {
      border-color: var(--destructive);
    }

    .error-text {
      color: var(--destructive);
      font-size: 0.75rem;
      margin-top: 0.25rem;
    }

    .btn {
      width: 100%;
      padding: 1rem;
      border: none;
      border-radius: 100px;
      cursor: pointer;
      font-family: var(--ff-body);
      font-weight: 700;
      font-size: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      transition: all 0.3s var(--spring);
      background: var(--primary);
      color: white;
      box-shadow: 0 4px 15px rgba(45, 138, 94, 0.2);
    }

    .btn:hover:not(:disabled) {
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(45, 138, 94, 0.3);
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .spinner {
      width: 1.2rem;
      height: 1.2rem;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .message {
      padding: 1rem;
      margin-top: 1rem;
      border-radius: var(--radius);
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .message.success {
      background: var(--secondary);
      color: var(--secondary-foreground);
      border: 1px solid var(--primary);
    }

    .message.error {
      background: rgba(220, 38, 38, 0.1);
      color: var(--destructive);
      border: 1px solid var(--destructive);
    }

    .message.info {
      background: rgba(45, 138, 94, 0.05);
      color: var(--primary);
      border: 1px solid var(--primary);
    }

    .links {
      text-align: center;
      margin-top: 1.5rem;
      font-size: 0.9rem;
      color: var(--muted-foreground);
    }

    .links a {
      color: var(--primary);
      text-decoration: none;
      font-weight: 600;
    }

    .links a:hover {
      text-decoration: underline;
    }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 1rem;
      color: var(--muted-foreground);
      text-decoration: none;
      font-size: 0.9rem;
    }

    .back-link:hover {
      color: var(--primary);
      transform: translateX(-3px);
    }

    .help-box {
      margin-top: 2rem;
      padding: 1rem;
      background: var(--muted);
      border-radius: var(--radius);
      border: 1px solid var(--border);
    }

    .help-box h3 {
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
      color: var(--foreground);
    }

    .help-box ul {
      list-style: none;
      font-size: 0.8rem;
      color: var(--muted-foreground);
    }

    .help-box li {
      margin-bottom: 0.25rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  `}),t.jsx("div",{className:"ambient ambient-1"}),t.jsx("div",{className:"ambient ambient-2"}),t.jsxs("div",{className:"auth-container",children:[t.jsx("a",{href:"/",className:"logo",children:t.jsx("img",{src:Hl,alt:"EcoCollect",className:"logo-img"})}),t.jsx("h1",{children:t.jsx("em",{children:"Mot de passe oublié"})}),t.jsx("p",{className:"subtitle",children:"Recevez un code pour réinitialiser votre mot de passe"}),t.jsxs("form",{onSubmit:p,children:[t.jsxs("div",{className:"form-group",children:[t.jsxs("label",{children:[E(i.contact)?t.jsx(gs,{size:16}):t.jsx(ia,{size:16}),"Email"]}),t.jsxs("div",{className:"input-wrap",children:[E(i.contact)?t.jsx(gs,{className:"input-icon",size:18}):t.jsx(ia,{className:"input-icon",size:18}),t.jsx("input",{type:"text",name:"contact",value:i.contact,onChange:g,className:o.contact?"error":"",placeholder:"votre@email.com"})]}),o.contact&&t.jsx("div",{className:"error-text",children:o.contact})]}),m.text&&t.jsxs("div",{className:`message ${m.type}`,children:[t.jsx("i",{className:`fas ${m.type==="success"?"fa-check-circle":m.type==="error"?"fa-exclamation-circle":"fa-info-circle"}`}),m.text]}),t.jsx("button",{type:"submit",className:"btn",disabled:x,children:x?t.jsxs(t.Fragment,{children:[t.jsx("div",{className:"spinner"}),"Envoi en cours..."]}):t.jsxs(t.Fragment,{children:[t.jsx(cv,{size:18}),"Recevoir le code"]})})]}),t.jsx("div",{className:"links",children:t.jsxs("a",{href:"/login",className:"back-link",children:[t.jsx(Gs,{size:16}),"Retour à la connexion"]})}),t.jsxs("div",{className:"help-box",children:[t.jsx("h3",{children:"Besoin d'aide ?"}),t.jsxs("ul",{children:[t.jsxs("li",{children:[t.jsx("span",{children:"•"})," Vérifiez que l'email est bien celui de votre compte"]}),t.jsxs("li",{children:[t.jsx("span",{children:"•"})," Le code arrivera dans les 2 minutes maximum"]}),t.jsxs("li",{children:[t.jsx("span",{children:"•"})," Contactez le support si vous ne recevez rien"]})]})]})]}),t.jsx("link",{rel:"stylesheet",href:"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"})]})},Qv=()=>{const[i,u]=v.useState({newPassword:"",confirmPassword:""}),[o,d]=v.useState({}),[x,b]=v.useState(!1),[m,N]=v.useState(!1),[f,g]=v.useState(!1),[j,p]=v.useState({type:"",text:""}),[E,L]=v.useState({score:0,label:"–"}),M="https://ecobackend-7tuh.vercel.app";v.useEffect(()=>{const Z=sessionStorage.getItem("reset_email"),ee=sessionStorage.getItem("reset_code");(!Z||!ee)&&(window.location.href="/forgot-password")},[]);const w=Z=>{let ee=0,F="Faible";Z.length>=8&&(ee+=1),/[A-Z]/.test(Z)&&(ee+=1),/[0-9]/.test(Z)&&(ee+=1),/[^A-Za-z0-9]/.test(Z)&&(ee+=1),ee===0?F="–":ee<=1?F="Faible":ee===2?F="Moyen":ee===3?F="Bon":ee===4&&(F="Fort"),L({score:ee,label:F})},k=Z=>{const{name:ee,value:F}=Z.target;u(z=>({...z,[ee]:F})),ee==="newPassword"&&w(F),o[ee]&&d(z=>({...z,[ee]:""})),j.text&&p({type:"",text:""})},A=()=>{const Z={};return i.newPassword?i.newPassword.length<6&&(Z.newPassword="Minimum 6 caractères"):Z.newPassword="Le nouveau mot de passe est requis",i.newPassword!==i.confirmPassword&&(Z.confirmPassword="Les mots de passe ne correspondent pas"),d(Z),Object.keys(Z).length===0},O=async Z=>{if(Z.preventDefault(),!!A()){b(!0),p({type:"info",text:"Réinitialisation en cours..."});try{const ee=sessionStorage.getItem("reset_email"),F=sessionStorage.getItem("reset_code"),Q=await(await fetch(`${M}/api/auth/reinitialiser-mdp-code`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:ee,code:F,nouveauMotDePasse:i.newPassword})})).json();if(Q.success)p({type:"success",text:"Mot de passe réinitialisé !"}),sessionStorage.removeItem("reset_email"),sessionStorage.removeItem("reset_code"),setTimeout(()=>window.location.href="/login",2e3);else throw new Error(Q.message||"Erreur lors de la réinitialisation")}catch(ee){p({type:"error",text:ee.message})}finally{b(!1)}}},$=()=>E.score<=1?"#dc2626":E.score===2?"#e0a020":E.score>=3?"#2d8a5e":"#d9e0d9";return t.jsxs(t.Fragment,{children:[t.jsx("style",{children:`
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Serif+Display:ital@0;1&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    :root {
      --background: #f8faf8;
      --foreground: #1a1e1a;
      --card: #ffffff;
      --primary: #2d8a5e;
      --secondary: #e8f3e8;
      --secondary-foreground: #1a5c3a;
      --muted: #f0f3f0;
      --muted-foreground: #5a655a;
      --destructive: #dc2626;
      --border: #d9e0d9;
      --ring: #2d8a5e;
      --radius: 0.75rem;
      --radius-xl: 1.75rem;
      --shadow-lg: 0 10px 40px -8px rgba(0, 0, 0, 0.08);
      
      --ff-head: 'DM Serif Display', Georgia, serif;
      --ff-body: 'Outfit', sans-serif;
      --ease: cubic-bezier(.4,0,.2,1);
      --spring: cubic-bezier(.34,1.56,.64,1);
    }

    body {
      font-family: var(--ff-body);
      background: var(--background);
      color: var(--foreground);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      position: relative;
    }

    body::before {
      content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
      opacity: .015;
    }

    .ambient {
      position: fixed; pointer-events: none; z-index: 0;
      border-radius: 50%; filter: blur(100px);
    }

    .ambient-1 { 
      width: 600px; height: 400px; top: 0; left: 50%; transform: translateX(-50%);
      background: radial-gradient(ellipse, rgba(45,138,94,0.03) 0%, transparent 70%); 
    }

    .ambient-2 { 
      width: 400px; height: 300px; bottom: 10%; right: 5%;
      background: radial-gradient(ellipse, rgba(45,138,94,0.02) 0%, transparent 70%); 
    }

    .auth-container {
      max-width: 450px;
      width: 100%;
      background: var(--card);
      border-radius: var(--radius-xl);
      padding: 2.5rem;
      border: 1px solid var(--border);
      box-shadow: var(--shadow-lg);
      animation: fadeIn 0.5s var(--spring) both;
      position: relative;
      z-index: 1;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(24px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 2rem;
    }

    .logo-img {
      height: 70px;
      width: auto;
      border-radius: 15px;
      transition: transform 0.3s var(--spring);
    }

    .logo-img:hover {
      transform: scale(1.05);
    }

    h1 {
      font-family: var(--ff-head);
      text-align: center;
      margin-bottom: 1rem;
      font-size: 2rem;
      color: var(--foreground);
    }

    h1 em {
      color: var(--primary);
      font-style: italic;
    }

    .subtitle {
      text-align: center;
      color: var(--muted-foreground);
      margin-bottom: 2rem;
      line-height: 1.6;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--foreground);
    }

    label svg {
      color: var(--primary);
      margin-right: 0.5rem;
      vertical-align: middle;
    }

    .input-wrap {
      position: relative;
    }

    .input-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--muted-foreground);
    }

    input {
      width: 100%;
      padding: 0.9rem 1rem 0.9rem 2.5rem;
      border-radius: var(--radius);
      background: var(--muted);
      border: 1.5px solid var(--border);
      color: var(--foreground);
      font-size: 0.95rem;
      font-family: var(--ff-body);
      transition: all 0.2s var(--ease);
      outline: none;
    }

    input:focus {
      border-color: var(--ring);
      box-shadow: 0 0 0 3px rgba(45, 138, 94, 0.1);
    }

    input.error {
      border-color: var(--destructive);
    }

    .toggle-password {
      position: absolute;
      right: 1rem;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      color: var(--muted-foreground);
      font-size: 1.1rem;
      display: flex;
      align-items: center;
    }

    .toggle-password:hover {
      color: var(--primary);
    }

    .error-text {
      color: var(--destructive);
      font-size: 0.75rem;
      margin-top: 0.25rem;
    }

    .password-strength {
      margin-top: 0.5rem;
    }

    .strength-bar {
      height: 4px;
      background: var(--muted);
      border-radius: 100px;
      overflow: hidden;
      margin-bottom: 0.25rem;
    }

    .strength-fill {
      height: 100%;
      transition: width 0.3s;
    }

    .strength-label {
      font-size: 0.75rem;
      color: var(--muted-foreground);
    }

    .btn {
      width: 100%;
      padding: 1rem;
      border: none;
      border-radius: 100px;
      cursor: pointer;
      font-family: var(--ff-body);
      font-weight: 700;
      font-size: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      transition: all 0.3s var(--spring);
      background: var(--primary);
      color: white;
      box-shadow: 0 4px 15px rgba(45, 138, 94, 0.2);
    }

    .btn:hover:not(:disabled) {
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(45, 138, 94, 0.3);
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .spinner {
      width: 1.2rem;
      height: 1.2rem;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .message {
      padding: 1rem;
      margin-top: 1rem;
      border-radius: var(--radius);
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .message.success {
      background: var(--secondary);
      color: var(--secondary-foreground);
      border: 1px solid var(--primary);
    }

    .message.error {
      background: rgba(220, 38, 38, 0.1);
      color: var(--destructive);
      border: 1px solid var(--destructive);
    }

    .message.info {
      background: rgba(45, 138, 94, 0.05);
      color: var(--primary);
      border: 1px solid var(--primary);
    }

    .links {
      text-align: center;
      margin-top: 1.5rem;
    }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--muted-foreground);
      text-decoration: none;
      font-size: 0.9rem;
    }

    .back-link:hover {
      color: var(--primary);
      transform: translateX(-3px);
    }

    .help-box {
      margin-top: 2rem;
      padding: 1rem;
      background: var(--muted);
      border-radius: var(--radius);
      border: 1px solid var(--border);
    }

    .help-box h3 {
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
      color: var(--foreground);
    }

    .help-box ul {
      list-style: none;
      font-size: 0.8rem;
      color: var(--muted-foreground);
    }

    .help-box li {
      margin-bottom: 0.25rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  `}),t.jsx("div",{className:"ambient ambient-1"}),t.jsx("div",{className:"ambient ambient-2"}),t.jsxs("div",{className:"auth-container",children:[t.jsx("a",{href:"/",className:"logo",children:t.jsx("img",{src:Hl,alt:"EcoCollect",className:"logo-img"})}),t.jsx("h1",{children:t.jsx("em",{children:"Nouveau mot de passe"})}),t.jsx("p",{className:"subtitle",children:"Choisissez un nouveau mot de passe sécurisé"}),t.jsxs("form",{onSubmit:O,children:[t.jsxs("div",{className:"form-group",children:[t.jsxs("label",{children:[t.jsx(Bs,{size:16}),"Nouveau mot de passe"]}),t.jsxs("div",{className:"input-wrap",children:[t.jsx(Bs,{className:"input-icon",size:18}),t.jsx("input",{type:m?"text":"password",name:"newPassword",value:i.newPassword,onChange:k,className:o.newPassword?"error":"",placeholder:"••••••••"}),t.jsx("button",{type:"button",className:"toggle-password",onClick:()=>N(!m),children:m?t.jsx(ox,{size:18}):t.jsx(ps,{size:18})})]}),o.newPassword&&t.jsx("div",{className:"error-text",children:o.newPassword}),t.jsxs("div",{className:"password-strength",children:[t.jsx("div",{className:"strength-bar",children:t.jsx("div",{className:"strength-fill",style:{width:`${E.score*25}%`,backgroundColor:$()}})}),t.jsxs("span",{className:"strength-label",children:["Force du mot de passe : ",E.label]})]})]}),t.jsxs("div",{className:"form-group",children:[t.jsxs("label",{children:[t.jsx(Bs,{size:16}),"Confirmer le mot de passe"]}),t.jsxs("div",{className:"input-wrap",children:[t.jsx(Bs,{className:"input-icon",size:18}),t.jsx("input",{type:f?"text":"password",name:"confirmPassword",value:i.confirmPassword,onChange:k,className:o.confirmPassword?"error":"",placeholder:"••••••••"}),t.jsx("button",{type:"button",className:"toggle-password",onClick:()=>g(!f),children:f?t.jsx(ox,{size:18}):t.jsx(ps,{size:18})})]}),o.confirmPassword&&t.jsx("div",{className:"error-text",children:o.confirmPassword})]}),j.text&&t.jsxs("div",{className:`message ${j.type}`,children:[t.jsx("i",{className:`fas ${j.type==="success"?"fa-check-circle":j.type==="error"?"fa-exclamation-circle":"fa-info-circle"}`}),j.text]}),t.jsx("button",{type:"submit",className:"btn",disabled:x,children:x?t.jsxs(t.Fragment,{children:[t.jsx("div",{className:"spinner"}),"Réinitialisation..."]}):t.jsxs(t.Fragment,{children:[t.jsx(Ce,{size:18}),"Valider le nouveau mot de passe"]})})]}),t.jsx("div",{className:"links",children:t.jsxs("a",{href:"/login",className:"back-link",children:[t.jsx(Gs,{size:16}),"Retour à la connexion"]})}),t.jsxs("div",{className:"help-box",children:[t.jsx("h3",{children:"Conseils de sécurité :"}),t.jsxs("ul",{children:[t.jsxs("li",{children:[t.jsx("span",{children:"•"})," Utilisez un mélange de lettres, chiffres et symboles"]}),t.jsxs("li",{children:[t.jsx("span",{children:"•"})," Évitez les informations personnelles évidentes"]}),t.jsxs("li",{children:[t.jsx("span",{children:"•"})," Ne réutilisez pas d'anciens mots de passe"]})]})]})]}),t.jsx("link",{rel:"stylesheet",href:"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"})]})},mx=({isOpen:i,toggleSidebar:u,currentPage:o})=>{const[d,x]=v.useState(o||"dashboard"),b=()=>{window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?")&&(console.log("Déconnexion..."),window.location.href="/login")},m=[{id:"dashboard",label:"Tableau de bord",icon:pi,href:"/dashboard",badge:null},{id:"declare",label:"Déclarer des déchets",icon:ft,href:"/declare",badge:"CTA",badgeColor:"green"},{id:"tracking",label:"Suivi des collectes",icon:De,href:"/tracking",badge:null},{id:"history",label:"Historique",icon:hi,href:"/history",badge:null},{id:"rewards",label:"Récompenses",icon:zt,href:"/rewards",badge:"480",badgeColor:"purple"},{id:"notifications",label:"Notifications",icon:fs,href:"/notifications",badge:"3",badgeColor:"green"}],N=[{id:"profile",label:"Mon profil",icon:ct,href:"/profile",badge:null},{id:"settings",label:"Paramètres",icon:Io,href:"/settings",badge:null}];return t.jsxs(t.Fragment,{children:[t.jsxs("div",{className:`lg:hidden fixed inset-0 z-50 transition-all duration-300 ease-in-out ${i?"opacity-100 pointer-events-auto":"opacity-0 pointer-events-none"}`,children:[t.jsx("div",{className:`absolute inset-0 bg-black transition-opacity duration-300 ${i?"opacity-50":"opacity-0"}`,onClick:u}),t.jsxs("div",{className:`absolute top-0 left-0 h-full w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${i?"translate-x-0":"-translate-x-full"}`,children:[t.jsx("div",{className:"bg-gradient-to-r from-green-600 to-green-700 p-6",children:t.jsxs("div",{className:"flex items-center justify-between",children:[t.jsxs("div",{className:"flex items-center gap-3",children:[t.jsx("div",{className:"w-14 h-14 rounded-lg flex items-center justify-center",children:t.jsx("img",{src:"/1.png",alt:"EcoCollect",className:"w-24 h-auto"})}),t.jsxs("div",{children:[t.jsx("h1",{className:"text-white font-bold text-lg",children:"EcoCollect"}),t.jsx("p",{className:"text-green-100 text-xs",children:"Plateforme de collecte"})]})]}),t.jsx("button",{onClick:u,className:"text-white hover:bg-white/20 p-2 rounded-lg transition-colors",children:t.jsx(ys,{className:"w-5 h-5"})})]})}),t.jsx("div",{className:"p-4 border-b",children:t.jsxs("div",{className:"flex items-center gap-3",children:[t.jsx("div",{className:"w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center",children:t.jsx(ct,{className:"w-5 h-5 text-gray-600"})}),t.jsxs("div",{children:[t.jsx("p",{className:"font-medium text-gray-900",children:"Jean Dupont"}),t.jsx("p",{className:"text-xs text-gray-500",children:"Ménage • Douala"})]})]})}),t.jsxs("nav",{className:"flex-1 p-4 overflow-y-auto",children:[t.jsxs("div",{className:"mb-6",children:[t.jsx("h3",{className:"text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3",children:"Principal"}),t.jsx("ul",{className:"space-y-2",children:m.map(f=>{const g=f.icon,j=d===f.id;return t.jsx("li",{children:t.jsxs("a",{href:f.href,onClick:()=>x(f.id),className:`
                          flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                          ${j?"bg-green-50 text-green-700 border-l-4 border-green-600 shadow-sm":"text-gray-700 hover:bg-green-50 hover:text-green-700 hover:shadow-md"}
                        `,children:[t.jsx(g,{className:`w-5 h-5 ${j?"text-green-600":"text-gray-400 group-hover:text-green-600"}`}),t.jsx("span",{className:"font-medium group-hover:text-green-700",children:f.label})]})},f.id)})})]}),t.jsxs("div",{children:[t.jsx("h3",{className:"text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3",children:"Secondaire"}),t.jsx("ul",{className:"space-y-2",children:N.map(f=>{const g=f.icon,j=d===f.id;return t.jsx("li",{children:t.jsxs("a",{href:f.href,onClick:()=>x(f.id),className:`
                          flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                          ${j?"bg-green-50 text-green-700 border-l-4 border-green-600 shadow-sm":"text-gray-700 hover:bg-green-50 hover:text-green-700 hover:shadow-md"}
                        `,children:[t.jsx(g,{className:`w-5 h-5 ${j?"text-green-600":"text-gray-400 group-hover:text-green-600"}`}),t.jsx("span",{className:"font-medium group-hover:text-green-700",children:f.label})]})},f.id)})})]}),t.jsx("div",{className:"mt-auto p-4 border-t",children:t.jsxs("button",{onClick:b,className:"w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group",children:[t.jsx(Vs,{className:"w-5 h-5"}),t.jsx("span",{className:"font-medium group-hover:text-red-700",children:"Déconnexion"})]})})]})]})]}),t.jsxs("div",{className:"hidden lg:block fixed top-0 left-0 h-screen bg-white shadow-xl z-50 w-72 overflow-hidden flex flex-col",children:[t.jsx("div",{className:"bg-gradient-to-r from-green-600 to-green-700 p-6",children:t.jsxs("div",{className:"flex items-center gap-3",children:[t.jsx("div",{className:"w-14 h-14 rounded-lg flex items-center justify-center",children:t.jsx("img",{src:"/1.png",alt:"EcoCollect",className:"w-24 h-auto"})}),t.jsxs("div",{children:[t.jsx("h1",{className:"text-white font-bold text-lg",children:"EcoCollect"}),t.jsx("p",{className:"text-green-100 text-xs",children:"Plateforme de collecte"})]})]})}),t.jsx("div",{className:"p-4 border-b",children:t.jsxs("div",{className:"flex items-center gap-3",children:[t.jsx("div",{className:"w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center",children:t.jsx(ct,{className:"w-5 h-5 text-gray-600"})}),t.jsxs("div",{children:[t.jsx("p",{className:"font-medium text-gray-900",children:"Jean Dupont"}),t.jsx("p",{className:"text-xs text-gray-500",children:"Ménage • Douala"})]})]})}),t.jsxs("nav",{className:"flex-1 p-4 overflow-y-auto",children:[t.jsxs("div",{className:"mb-6",children:[t.jsx("h3",{className:"text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3",children:"Principal"}),t.jsx("ul",{className:"space-y-1",children:m.map(f=>{const g=f.icon,j=d===f.id;return t.jsx("li",{children:t.jsxs("a",{href:f.href,onClick:()=>x(f.id),className:`
                        flex items-center justify-between px-3 py-2 rounded-lg transition-colors group
                        ${j?"bg-green-50 text-green-700 border-l-4 border-green-600":"text-gray-700 hover:bg-gray-50 hover:text-gray-900"}
                      `,children:[t.jsxs("div",{className:"flex items-center gap-3",children:[t.jsx(g,{className:`w-5 h-5 ${j?"text-green-600":"text-gray-400 group-hover:text-gray-600"}`}),t.jsx("span",{className:"font-medium",children:f.label})]}),f.badge&&t.jsx("span",{className:`
                          px-2 py-1 text-xs font-medium rounded-full
                          ${f.badgeColor==="green"?"bg-green-100 text-green-700":f.badgeColor==="purple"?"bg-purple-100 text-purple-700":"bg-gray-100 text-gray-700"}
                        `,children:f.badge})]})},f.id)})})]}),t.jsxs("div",{className:"mb-6",children:[t.jsx("h3",{className:"text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3",children:"Compte"}),t.jsx("ul",{className:"space-y-1",children:N.map(f=>{const g=f.icon,j=d===f.id;return t.jsx("li",{children:t.jsxs("a",{href:f.href,onClick:()=>x(f.id),className:`
                        flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group
                        ${j?"bg-green-50 text-green-700 border-l-4 border-green-600":"text-gray-700 hover:bg-gray-50 hover:text-gray-900"}
                      `,children:[t.jsx(g,{className:`w-5 h-5 ${j?"text-green-600":"text-gray-400 group-hover:text-gray-600"}`}),t.jsx("span",{className:"font-medium",children:f.label})]})},f.id)})})]}),t.jsx("div",{className:"mt-auto p-4 border-t",children:t.jsxs("button",{onClick:b,className:"w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors group",children:[t.jsx(Vs,{className:"w-5 h-5"}),t.jsx("span",{className:"font-medium",children:"Déconnexion"})]})})]})]})]})},Kv=({toggleSidebar:i,pageTitle:u,notifications:o})=>{const[d,x]=v.useState(!1),[b,m]=v.useState(!1),[N,f]=v.useState(!1),g=()=>{window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?")&&(console.log("Déconnexion..."),window.location.href="/login")},j=()=>{f(!N),document.documentElement.classList.toggle("dark")};return t.jsxs("header",{className:"bg-white border-b border-gray-200 shadow-sm",children:[t.jsx("div",{className:"px-4 sm:px-6 lg:px-8",children:t.jsxs("div",{className:"flex items-center justify-between h-16",children:[t.jsxs("div",{className:"flex items-center gap-4",children:[t.jsx("button",{onClick:i,className:"lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors",children:t.jsx(Lx,{className:"w-5 h-5"})}),t.jsxs("div",{children:[t.jsx("h1",{className:"text-lg font-semibold text-gray-900",children:u||"Tableau de bord"}),t.jsx("p",{className:"text-sm text-gray-500 hidden sm:block",children:"EcoCollect Platform"})]})]}),t.jsxs("div",{className:"flex items-center gap-4",children:[t.jsxs("div",{className:"hidden md:flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 w-64",children:[t.jsx(ql,{className:"w-4 h-4 text-gray-400"}),t.jsx("input",{type:"text",placeholder:"Rechercher...",className:"bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400 w-full"})]}),t.jsxs("div",{className:"relative",children:[t.jsxs("button",{onClick:()=>x(!d),className:"relative p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors",children:[t.jsx(fs,{className:"w-5 h-5"}),o&&o.length>0&&t.jsx("span",{className:"absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"})]}),d&&t.jsxs("div",{className:"absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50",children:[t.jsx("div",{className:"p-4 border-b",children:t.jsx("h3",{className:"font-semibold text-gray-900",children:"Notifications"})}),t.jsx("div",{className:"max-h-96 overflow-y-auto",children:o&&o.length>0?o.map((p,E)=>t.jsx("div",{className:"p-4 hover:bg-gray-50 border-b last:border-b-0",children:t.jsxs("div",{className:"flex items-start gap-3",children:[t.jsx("div",{className:`w-2 h-2 rounded-full mt-2 ${p.type==="success"?"bg-green-500":p.type==="warning"?"bg-yellow-500":p.type==="error"?"bg-red-500":"bg-blue-500"}`}),t.jsxs("div",{className:"flex-1",children:[t.jsx("p",{className:"text-sm font-medium text-gray-900",children:p.title}),t.jsx("p",{className:"text-xs text-gray-600 mt-1",children:p.message}),t.jsx("p",{className:"text-xs text-gray-400 mt-1",children:p.time})]})]})},E)):t.jsxs("div",{className:"p-8 text-center",children:[t.jsx(fs,{className:"w-12 h-12 text-gray-300 mx-auto mb-3"}),t.jsx("p",{className:"text-gray-500",children:"Aucune notification"})]})}),t.jsx("div",{className:"p-4 border-t",children:t.jsx("a",{href:"/notifications",className:"text-sm text-green-600 hover:text-green-700 font-medium",children:"Voir toutes les notifications"})})]})]}),t.jsx("button",{onClick:j,className:"p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors",title:"Basculer le thème",children:N?t.jsx(Yx,{className:"w-5 h-5"}):t.jsx(Ux,{className:"w-5 h-5"})}),t.jsxs("div",{className:"relative",children:[t.jsxs("button",{onClick:()=>m(!b),className:"flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors",children:[t.jsx("div",{className:"w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center",children:t.jsx(ct,{className:"w-4 h-4 text-gray-600"})}),t.jsx(nb,{className:"w-4 h-4 text-gray-600"})]}),b&&t.jsxs("div",{className:"absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50",children:[t.jsxs("div",{className:"p-4 border-b",children:[t.jsx("p",{className:"font-medium text-gray-900",children:"Jean Dupont"}),t.jsx("p",{className:"text-sm text-gray-500",children:"jean.dupont@email.com"})]}),t.jsxs("div",{className:"py-2",children:[t.jsxs("a",{href:"/profile",className:"flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors",children:[t.jsx(ct,{className:"w-4 h-4"}),"Mon profil"]}),t.jsxs("a",{href:"/settings",className:"flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors",children:[t.jsx(Io,{className:"w-4 h-4"}),"Paramètres"]}),t.jsx("hr",{className:"my-2"}),t.jsxs("button",{onClick:g,className:"flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left",children:[t.jsx(Vs,{className:"w-4 h-4"}),"Déconnexion"]})]})]})]})]})]})}),t.jsx("div",{className:"px-4 pb-3 lg:hidden",children:t.jsxs("div",{className:"flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2",children:[t.jsx(ql,{className:"w-4 h-4 text-gray-400"}),t.jsx("input",{type:"text",placeholder:"Rechercher...",className:"bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400 w-full"})]})})]})},ca=({children:i,pageTitle:u,currentPage:o,notifications:d})=>{const[x,b]=v.useState(!1),m=()=>{b(!x)};return t.jsxs("div",{className:"min-h-screen bg-gray-50 flex",children:[t.jsx("div",{className:"lg:hidden",children:t.jsx(mx,{isOpen:x,toggleSidebar:m,currentPage:o})}),t.jsx("div",{className:"hidden lg:block fixed top-0 left-0 h-screen bg-white shadow-xl z-50 w-72 overflow-hidden flex flex-col",children:t.jsx(mx,{isOpen:!1,toggleSidebar:m,currentPage:o})}),t.jsxs("div",{className:"flex-1 lg:ml-72",children:[t.jsx("div",{className:"sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm",children:t.jsx(Kv,{toggleSidebar:m,pageTitle:u,notifications:d})}),t.jsx("main",{className:"p-4 lg:p-6",children:i})]})]})},Jv=()=>{const[i,u]=v.useState({firstName:"Jean",lastName:"Dupont",email:"jean.dupont@email.com",phone:"+237 698 123 456",producerType:"household",city:"douala",collectionPoint:"bonanjo",neighborhood:"Bonamoussadi",address:"123 Rue Principale, Immeuble ABC",landmark:"Près du marché central",cniFront:null,cniBack:null,selfieCni:null,password:"",newPassword:"",confirmPassword:""}),[o,d]=v.useState(!1),[x,b]=v.useState({}),[m,N]=v.useState(!1),[f,g]=v.useState(!1),[j,p]=v.useState(!1),[E,L]=v.useState(""),[M,w]=v.useState("personal"),k=[{id:"household",label:"Ménage",icon:Ox,color:"emerald",description:"Particulier"},{id:"commerce",label:"Commerce",icon:Nv,color:"green",description:"Petit commerce"},{id:"enterprise",label:"Entreprise",icon:tb,color:"teal",description:"Structure professionnelle"}],A=[{id:"personal",label:"Informations",icon:ct},{id:"location",label:"Localisation",icon:pa},{id:"documents",label:"Documents",icon:Rl}],O=z=>{const{name:Q,value:ie}=z.target;u(ye=>({...ye,[Q]:ie})),x[Q]&&b(ye=>({...ye,[Q]:""})),E&&L("")},$=()=>{g(!0),navigator.geolocation?navigator.geolocation.getCurrentPosition(z=>{u(Q=>({...Q,neighborhood:`GPS: ${z.coords.latitude.toFixed(6)}, ${z.coords.longitude.toFixed(6)}`})),g(!1),L("📍 Localisation mise à jour avec succès !")},z=>{b(Q=>({...Q,location:"Impossible d'obtenir votre position. Veuillez saisir manuellement."})),g(!1)}):(b(z=>({...z,location:"La géolocalisation n'est pas supportée par votre navigateur."})),g(!1))},Y=()=>{const z={};return i.firstName.trim()||(z.firstName="Le nom est requis"),i.lastName.trim()||(z.lastName="Le prénom est requis"),i.email.trim()?/\S+@\S+\.\S+/.test(i.email)||(z.email="L'email n'est pas valide"):z.email="L'email est requis",i.phone.trim()||(z.phone="Le téléphone est requis"),i.city.trim()||(z.city="La ville est requise"),i.collectionPoint.trim()||(z.collectionPoint="Le point de collecte est requis"),i.neighborhood.trim()||(z.neighborhood="Le quartier est requis"),j&&(i.password&&i.password.length<6&&(z.password="Le mot de passe actuel doit contenir au moins 6 caractères"),i.newPassword&&i.newPassword.length<6&&(z.newPassword="Le nouveau mot de passe doit contenir au moins 6 caractères"),i.newPassword&&i.newPassword!==i.confirmPassword&&(z.confirmPassword="Les mots de passe ne correspondent pas")),b(z),Object.keys(z).length===0},Z=async z=>{if(z.preventDefault(),!!Y()){N(!0);try{await new Promise(Q=>setTimeout(Q,2e3)),console.log("Profil mis à jour:",i),L("✨ Informations enregistrées avec succès !"),d(!1),p(!1),u(Q=>({...Q,password:"",newPassword:"",confirmPassword:""}))}catch{b(ie=>({...ie,submit:"Une erreur est survenue. Veuillez réessayer."}))}finally{N(!1)}}},ee=()=>{d(!1),p(!1),b({}),L(""),u(z=>({...z,password:"",newPassword:"",confirmPassword:""}))},F=[{label:"Déchets collectés",value:"234 kg",icon:bs,color:"emerald"},{label:"CO₂ évité",value:"128 kg",icon:Vt,color:"green"},{label:"Points verts",value:"1,250",icon:Ys,color:"teal"}];return t.jsxs(ca,{pageTitle:"Mon Profil Écologique",currentPage:"profile",notifications:[],children:[t.jsxs("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8",children:[t.jsxs("div",{className:"relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600 p-8 text-white",children:[t.jsxs("div",{className:"absolute inset-0 opacity-10",children:[t.jsx("div",{className:"absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white blur-3xl"}),t.jsx("div",{className:"absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-emerald-300 blur-3xl"})]}),t.jsxs("div",{className:"relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6",children:[t.jsxs("div",{className:"flex items-center gap-4",children:[t.jsxs("div",{className:"relative",children:[t.jsx("div",{className:"absolute -inset-1 rounded-full bg-gradient-to-r from-yellow-300 to-green-300 opacity-75 blur animate-pulse"}),t.jsx("div",{className:"relative h-20 w-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/50",children:t.jsx(ct,{className:"h-10 w-10 text-white"})})]}),t.jsxs("div",{children:[t.jsxs("h1",{className:"text-3xl font-bold mb-2 flex items-center gap-2",children:[i.firstName," ",i.lastName,t.jsxs("span",{className:"inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-sm font-medium backdrop-blur-sm",children:[t.jsx(Vt,{className:"h-4 w-4"}),"Éco-producteur"]})]}),t.jsxs("p",{className:"text-white/90 flex items-center gap-2",children:[t.jsx(gs,{className:"h-4 w-4"}),i.email]})]})]}),t.jsx("div",{className:"flex gap-3",children:o?t.jsxs(t.Fragment,{children:[t.jsx("button",{onClick:ee,className:"rounded-xl bg-white/20 px-6 py-3 font-medium text-white backdrop-blur-sm transition-all hover:bg-white/30",children:"Annuler"}),t.jsx("button",{onClick:Z,disabled:m,className:"group flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-green-600 transition-all hover:bg-green-50 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed",children:m?t.jsxs(t.Fragment,{children:[t.jsx("div",{className:"h-4 w-4 animate-spin rounded-full border-2 border-green-600 border-t-transparent"}),t.jsx("span",{children:"Enregistrement..."})]}):t.jsxs(t.Fragment,{children:[t.jsx(Hx,{className:"h-4 w-4 transition-transform group-hover:scale-110"}),t.jsx("span",{className:"font-medium",children:"Enregistrer"})]})})]}):t.jsxs("button",{onClick:()=>d(!0),className:"group flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-green-600 transition-all hover:bg-green-50 hover:shadow-lg",children:[t.jsx(Ib,{className:"h-4 w-4 transition-transform group-hover:rotate-12"}),t.jsx("span",{className:"font-medium",children:"Modifier le profil"})]})})]}),t.jsx("div",{className:"relative mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4",children:F.map((z,Q)=>t.jsx("div",{className:"rounded-xl bg-white/10 backdrop-blur-sm p-4 transition-transform hover:scale-105",children:t.jsxs("div",{className:"flex items-center gap-3",children:[t.jsx("div",{className:`rounded-lg bg-${z.color}-500/30 p-2`,children:t.jsx(z.icon,{className:"h-5 w-5 text-white"})}),t.jsxs("div",{children:[t.jsx("p",{className:"text-sm text-white/80",children:z.label}),t.jsx("p",{className:"text-xl font-bold",children:z.value})]})]})},Q))})]}),E&&t.jsx("div",{className:"mb-6 animate-slideDown rounded-xl bg-emerald-50 border border-emerald-200 p-4",children:t.jsxs("div",{className:"flex items-center gap-3",children:[t.jsx("div",{className:"rounded-full bg-emerald-100 p-1",children:t.jsx(Ce,{className:"h-5 w-5 text-emerald-600"})}),t.jsx("p",{className:"text-emerald-800 font-medium",children:E})]})}),x.submit&&t.jsx("div",{className:"mb-6 animate-slideDown rounded-xl bg-red-50 border border-red-200 p-4",children:t.jsxs("div",{className:"flex items-center gap-3",children:[t.jsx("div",{className:"rounded-full bg-red-100 p-1",children:t.jsx(Al,{className:"h-5 w-5 text-red-600"})}),t.jsx("p",{className:"text-red-800 font-medium",children:x.submit})]})}),t.jsx("div",{className:"mb-6 flex gap-2 border-b border-gray-200 pb-2",children:A.map(z=>t.jsxs("button",{onClick:()=>w(z.id),className:`flex items-center gap-2 px-4 py-2 rounded-t-lg font-medium text-sm transition-all ${M===z.id?"bg-green-50 text-green-700 border-b-2 border-green-600":"text-gray-600 hover:text-green-600 hover:bg-green-50/50"}`,children:[t.jsx(z.icon,{className:"h-4 w-4"}),z.label]},z.id))}),t.jsxs("form",{onSubmit:Z,className:"space-y-6",children:[M==="personal"&&t.jsxs("div",{className:"space-y-6 animate-fadeIn",children:[t.jsxs("div",{className:"rounded-2xl bg-white p-6 shadow-sm border border-gray-100",children:[t.jsxs("h2",{className:"text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2",children:[t.jsx("div",{className:"rounded-lg bg-green-100 p-2",children:t.jsx(ct,{className:"h-5 w-5 text-green-600"})}),"Informations personnelles"]}),t.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6",children:[t.jsxs("div",{className:"space-y-2",children:[t.jsxs("label",{className:"text-sm font-medium text-gray-700",children:["Nom ",t.jsx("span",{className:"text-red-500",children:"*"})]}),t.jsx("input",{type:"text",name:"firstName",value:i.firstName,onChange:O,disabled:!o,className:`w-full rounded-xl border-0 bg-gray-50 px-4 py-3 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-green-600 ${x.firstName?"ring-2 ring-red-500":""} ${o?"":"opacity-75 cursor-not-allowed"}`,placeholder:"Votre nom"}),x.firstName&&t.jsx("p",{className:"text-red-500 text-xs mt-1",children:x.firstName})]}),t.jsxs("div",{className:"space-y-2",children:[t.jsxs("label",{className:"text-sm font-medium text-gray-700",children:["Prénom ",t.jsx("span",{className:"text-red-500",children:"*"})]}),t.jsx("input",{type:"text",name:"lastName",value:i.lastName,onChange:O,disabled:!o,className:`w-full rounded-xl border-0 bg-gray-50 px-4 py-3 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-green-600 ${x.lastName?"ring-2 ring-red-500":""} ${o?"":"opacity-75 cursor-not-allowed"}`,placeholder:"Votre prénom"}),x.lastName&&t.jsx("p",{className:"text-red-500 text-xs mt-1",children:x.lastName})]}),t.jsxs("div",{className:"space-y-2",children:[t.jsxs("label",{className:"text-sm font-medium text-gray-700",children:["Email ",t.jsx("span",{className:"text-red-500",children:"*"})]}),t.jsxs("div",{className:"relative",children:[t.jsx(gs,{className:"absolute left-3 top-3.5 h-5 w-5 text-gray-400"}),t.jsx("input",{type:"email",name:"email",value:i.email,onChange:O,disabled:!o,className:`w-full rounded-xl border-0 bg-gray-50 pl-10 pr-4 py-3 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-green-600 ${x.email?"ring-2 ring-red-500":""} ${o?"":"opacity-75 cursor-not-allowed"}`,placeholder:"votre@email.com"})]}),x.email&&t.jsx("p",{className:"text-red-500 text-xs mt-1",children:x.email})]}),t.jsxs("div",{className:"space-y-2",children:[t.jsxs("label",{className:"text-sm font-medium text-gray-700",children:["Téléphone ",t.jsx("span",{className:"text-red-500",children:"*"})]}),t.jsxs("div",{className:"relative",children:[t.jsx(ia,{className:"absolute left-3 top-3.5 h-5 w-5 text-gray-400"}),t.jsx("input",{type:"tel",name:"phone",value:i.phone,onChange:O,disabled:!o,className:`w-full rounded-xl border-0 bg-gray-50 pl-10 pr-4 py-3 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-green-600 ${x.phone?"ring-2 ring-red-500":""} ${o?"":"opacity-75 cursor-not-allowed"}`,placeholder:"+237 XX XX XX XX"})]}),x.phone&&t.jsx("p",{className:"text-red-500 text-xs mt-1",children:x.phone})]})]})]}),t.jsxs("div",{className:"rounded-2xl bg-white p-6 shadow-sm border border-gray-100",children:[t.jsxs("h2",{className:"text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2",children:[t.jsx("div",{className:"rounded-lg bg-green-100 p-2",children:t.jsx(ta,{className:"h-5 w-5 text-green-600"})}),"Type de producteur"]}),t.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-3 gap-4",children:k.map(z=>{const Q=z.icon,ie=i.producerType===z.id;return t.jsxs("button",{type:"button",disabled:!o,onClick:()=>o&&u(ye=>({...ye,producerType:z.id})),className:`group relative overflow-hidden rounded-xl p-4 transition-all ${ie?"bg-gradient-to-br from-green-50 to-emerald-50 ring-2 ring-green-600":"bg-gray-50 ring-1 ring-gray-200 hover:ring-green-300"} ${o?"cursor-pointer":"opacity-75 cursor-not-allowed"}`,children:[t.jsx("div",{className:"absolute inset-0 opacity-0 transition-opacity group-hover:opacity-10 bg-green-600"}),t.jsxs("div",{className:"relative",children:[t.jsx("div",{className:`mb-3 inline-flex rounded-lg p-3 ${ie?"bg-green-600 text-white":"bg-white text-green-600"}`,children:t.jsx(Q,{className:"h-6 w-6"})}),t.jsx("h3",{className:"font-semibold text-gray-900",children:z.label}),t.jsx("p",{className:"text-sm text-gray-600",children:z.description})]})]},z.id)})})]}),t.jsxs("div",{className:"rounded-2xl bg-white p-6 shadow-sm border border-gray-100",children:[t.jsxs("div",{className:"flex items-center justify-between mb-4",children:[t.jsxs("h2",{className:"text-lg font-semibold text-gray-900 flex items-center gap-2",children:[t.jsx("div",{className:"rounded-lg bg-green-100 p-2",children:t.jsx(Bs,{className:"h-5 w-5 text-green-600"})}),"Sécurité"]}),o&&t.jsx("button",{type:"button",onClick:()=>p(!j),className:"text-sm text-green-600 hover:text-green-700 font-medium",children:j?"Annuler":"Changer le mot de passe"})]}),j&&t.jsxs("div",{className:"space-y-4 animate-slideDown",children:[t.jsxs("div",{className:"space-y-2",children:[t.jsx("label",{className:"text-sm font-medium text-gray-700",children:"Mot de passe actuel"}),t.jsx("input",{type:"password",name:"password",value:i.password,onChange:O,className:`w-full rounded-xl border-0 bg-gray-50 px-4 py-3 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-green-600 ${x.password?"ring-2 ring-red-500":""}`,placeholder:"••••••••"}),x.password&&t.jsx("p",{className:"text-red-500 text-xs mt-1",children:x.password})]}),t.jsxs("div",{className:"space-y-2",children:[t.jsx("label",{className:"text-sm font-medium text-gray-700",children:"Nouveau mot de passe"}),t.jsx("input",{type:"password",name:"newPassword",value:i.newPassword,onChange:O,className:`w-full rounded-xl border-0 bg-gray-50 px-4 py-3 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-green-600 ${x.newPassword?"ring-2 ring-red-500":""}`,placeholder:"••••••••"}),x.newPassword&&t.jsx("p",{className:"text-red-500 text-xs mt-1",children:x.newPassword})]}),t.jsxs("div",{className:"space-y-2",children:[t.jsx("label",{className:"text-sm font-medium text-gray-700",children:"Confirmer le mot de passe"}),t.jsx("input",{type:"password",name:"confirmPassword",value:i.confirmPassword,onChange:O,className:`w-full rounded-xl border-0 bg-gray-50 px-4 py-3 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-green-600 ${x.confirmPassword?"ring-2 ring-red-500":""}`,placeholder:"••••••••"}),x.confirmPassword&&t.jsx("p",{className:"text-red-500 text-xs mt-1",children:x.confirmPassword})]})]})]})]}),M==="location"&&t.jsx("div",{className:"space-y-6 animate-fadeIn",children:t.jsxs("div",{className:"rounded-2xl bg-white p-6 shadow-sm border border-gray-100",children:[t.jsxs("h2",{className:"text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2",children:[t.jsx("div",{className:"rounded-lg bg-green-100 p-2",children:t.jsx(pa,{className:"h-5 w-5 text-green-600"})}),"Adresse de collecte"]}),t.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6",children:[t.jsxs("div",{className:"space-y-2",children:[t.jsxs("label",{className:"text-sm font-medium text-gray-700",children:["Ville ",t.jsx("span",{className:"text-red-500",children:"*"})]}),t.jsxs("select",{name:"city",value:i.city,onChange:O,disabled:!o,className:`w-full rounded-xl border-0 bg-gray-50 px-4 py-3 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-green-600 ${x.city?"ring-2 ring-red-500":""} ${o?"":"opacity-75 cursor-not-allowed"}`,children:[t.jsx("option",{value:"",children:"Sélectionner une ville"}),t.jsx("option",{value:"douala",children:"Douala"}),t.jsx("option",{value:"yaounde",children:"Yaoundé"}),t.jsx("option",{value:"bafoussam",children:"Bafoussam"}),t.jsx("option",{value:"buea",children:"Buea"}),t.jsx("option",{value:"limbe",children:"Limbe"})]}),x.city&&t.jsx("p",{className:"text-red-500 text-xs mt-1",children:x.city})]}),t.jsxs("div",{className:"space-y-2",children:[t.jsxs("label",{className:"text-sm font-medium text-gray-700",children:["Point de collecte ",t.jsx("span",{className:"text-red-500",children:"*"})]}),t.jsxs("select",{name:"collectionPoint",value:i.collectionPoint,onChange:O,disabled:!o,className:`w-full rounded-xl border-0 bg-gray-50 px-4 py-3 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-green-600 ${x.collectionPoint?"ring-2 ring-red-500":""} ${o?"":"opacity-75 cursor-not-allowed"}`,children:[t.jsx("option",{value:"",children:"Sélectionner un point"}),t.jsx("option",{value:"bonanjo",children:"Bonanjo (Centre-ville)"}),t.jsx("option",{value:"akwa",children:"Akwa"}),t.jsx("option",{value:"deido",children:"Deido"}),t.jsx("option",{value:"bepanda",children:"Bépanda"}),t.jsx("option",{value:"makepe",children:"Makepe"})]}),x.collectionPoint&&t.jsx("p",{className:"text-red-500 text-xs mt-1",children:x.collectionPoint})]}),t.jsxs("div",{className:"md:col-span-2 space-y-2",children:[t.jsxs("label",{className:"text-sm font-medium text-gray-700",children:["Quartier ",t.jsx("span",{className:"text-red-500",children:"*"})]}),t.jsxs("div",{className:"flex gap-3",children:[t.jsxs("div",{className:"relative flex-1",children:[t.jsx($b,{className:"absolute left-3 top-3.5 h-5 w-5 text-gray-400"}),t.jsx("input",{type:"text",name:"neighborhood",value:i.neighborhood,onChange:O,disabled:!o,className:`w-full rounded-xl border-0 bg-gray-50 pl-10 pr-4 py-3 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-green-600 ${x.neighborhood?"ring-2 ring-red-500":""} ${o?"":"opacity-75 cursor-not-allowed"}`,placeholder:"Votre quartier"})]}),o&&t.jsxs("button",{type:"button",onClick:$,disabled:f,className:"flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-white transition-all hover:bg-green-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed",children:[t.jsx(qx,{className:`h-5 w-5 ${f?"animate-spin":""}`}),t.jsx("span",{className:"font-medium",children:"GPS"})]})]}),x.neighborhood&&t.jsx("p",{className:"text-red-500 text-xs mt-1",children:x.neighborhood})]}),t.jsxs("div",{className:"md:col-span-2 space-y-2",children:[t.jsxs("label",{className:"text-sm font-medium text-gray-700",children:["Adresse complète ",t.jsx("span",{className:"text-red-500",children:"*"})]}),t.jsx("textarea",{name:"address",value:i.address,onChange:O,disabled:!o,rows:3,className:`w-full rounded-xl border-0 bg-gray-50 px-4 py-3 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-green-600 ${x.address?"ring-2 ring-red-500":""} ${o?"":"opacity-75 cursor-not-allowed"}`,placeholder:"Numéro, rue, lotissement, immeuble..."}),x.address&&t.jsx("p",{className:"text-red-500 text-xs mt-1",children:x.address})]}),t.jsxs("div",{className:"md:col-span-2 space-y-2",children:[t.jsx("label",{className:"text-sm font-medium text-gray-700",children:"Point de repère (optionnel)"}),t.jsx("input",{type:"text",name:"landmark",value:i.landmark,onChange:O,disabled:!o,className:`w-full rounded-xl border-0 bg-gray-50 px-4 py-3 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-green-600 ${x.landmark?"ring-2 ring-red-500":""} ${o?"":"opacity-75 cursor-not-allowed"}`,placeholder:"Ex: À côté du marché, près de l'église..."})]})]})]})}),M==="documents"&&t.jsx("div",{className:"space-y-6 animate-fadeIn",children:t.jsxs("div",{className:"rounded-2xl bg-white p-6 shadow-sm border border-gray-100",children:[t.jsxs("h2",{className:"text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2",children:[t.jsx("div",{className:"rounded-lg bg-green-100 p-2",children:t.jsx(vs,{className:"h-5 w-5 text-green-600"})}),"Documents d'identité"]}),t.jsx("div",{className:"space-y-6",children:[{id:"cniFront",label:"Recto de la CNI",required:!0},{id:"cniBack",label:"Verso de la CNI",required:!0},{id:"selfieCni",label:"Selfie avec CNI",required:!0}].map(z=>t.jsxs("div",{className:"space-y-2",children:[t.jsxs("label",{className:"text-sm font-medium text-gray-700",children:[z.label," ",z.required&&t.jsx("span",{className:"text-red-500",children:"*"})]}),t.jsx("div",{className:`group relative rounded-xl border-2 border-dashed p-6 transition-all ${i[z.id]?"border-green-300 bg-green-50/50":"border-gray-300 hover:border-green-400 hover:bg-green-50/30"}`,children:i[z.id]?t.jsxs("div",{className:"flex items-center justify-between",children:[t.jsxs("div",{className:"flex items-center gap-4",children:[t.jsx("div",{className:"rounded-lg bg-white p-3 shadow-sm",children:t.jsx(Rl,{className:"h-6 w-6 text-green-600"})}),t.jsxs("div",{children:[t.jsxs("p",{className:"font-medium text-gray-900",children:[z.label,".jpg"]}),t.jsx("p",{className:"text-sm text-gray-600",children:"Téléchargé avec succès"})]})]}),o&&t.jsx("button",{type:"button",onClick:()=>u(Q=>({...Q,[z.id]:null})),className:"rounded-lg p-2 text-red-600 transition-all hover:bg-red-50",children:t.jsx(ft,{className:"h-5 w-5"})})]}):t.jsxs("div",{className:"text-center",children:[t.jsx(Rv,{className:"mx-auto h-10 w-10 text-gray-400 group-hover:text-green-600 transition-colors"}),t.jsx("p",{className:"mt-2 text-sm text-gray-600",children:o?t.jsxs(t.Fragment,{children:[t.jsx("span",{className:"font-medium text-green-600",children:"Cliquez"})," pour uploader ou glissez-déposez"]}):"Aucun fichier téléchargé"}),t.jsx("p",{className:"text-xs text-gray-500 mt-1",children:"JPG, PNG ou PDF (max 5MB)"}),o&&t.jsx("button",{type:"button",className:"mt-4 rounded-lg bg-green-600 px-6 py-2 text-sm font-medium text-white transition-all hover:bg-green-700 hover:shadow-lg",children:"Choisir un fichier"})]})}),x[z.id]&&t.jsx("p",{className:"text-red-500 text-xs mt-1",children:x[z.id]})]},z.id))})]})})]})]}),t.jsx("style",{jsx:!0,children:`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `})]})},Pv=()=>{const[i]=v.useState({firstName:"Jean",lastName:"Dupont",producerType:"household"}),[u]=v.useState({totalDeclarations:12,pendingCollections:2,completedCollections:10,totalWasteCollected:156.8,totalPointsEarned:480,monthlyTrend:{declarations:[8,12,15,11,9,14,12],collections:[6,10,13,9,7,12,10]}}),[o]=v.useState([{id:"DEC-123456",wasteTypes:["plastic","paper"],quantity:"5.2",quantityUnit:"kg",status:"in_progress",createdAt:"2024-01-15T10:30:00Z",scheduledDate:"2024-01-15T14:00:00Z",collector:{name:"Paul Mbarga",rating:4.8}},{id:"DEC-123455",wasteTypes:["glass"],quantity:"3",quantityUnit:"kg",status:"pending",createdAt:"2024-01-14T16:20:00Z",scheduledDate:null,collector:null},{id:"DEC-123454",wasteTypes:["metal","electronic"],quantity:"8",quantityUnit:"kg",status:"completed",createdAt:"2024-01-13T09:15:00Z",scheduledDate:"2024-01-13T11:00:00Z",collector:{name:"Marie Tchuenté",rating:4.9},actualWeight:7.8,pointsEarned:25},{id:"DEC-123453",wasteTypes:["organic"],quantity:"4",quantityUnit:"bags",status:"completed",createdAt:"2024-01-12T14:30:00Z",scheduledDate:"2024-01-12T16:00:00Z",collector:{name:"Jean Pierre",rating:4.7},actualWeight:12.5,pointsEarned:18}]),d={plastic:{label:"Plastique",icon:"♻️",color:"blue"},paper:{label:"Papier / Carton",icon:"📄",color:"yellow"},metal:{label:"Métal",icon:"🔧",color:"gray"},glass:{label:"Verre",icon:"🍾",color:"green"},organic:{label:"Déchets organiques",icon:"🌱",color:"orange"},electronic:{label:"Déchets électroniques",icon:"📱",color:"purple"}},x=f=>({pending:"amber",assigned:"blue",scheduled:"purple",in_progress:"orange",completed:"green"})[f]||"gray",b=f=>({pending:"En attente",assigned:"Assigné",scheduled:"Programmé",in_progress:"En cours",completed:"Terminé"})[f]||"Inconnu",m=f=>({pending:Qe,assigned:ta,scheduled:De,in_progress:Hr,completed:Ce})[f]||Qe,[N]=v.useState([{id:1,type:"success",title:"Collecte terminée",message:"Votre déclaration DEC-123456 a été collectée avec succès",time:"Il y a 2 heures"},{id:2,type:"info",title:"Nouveau collecteur disponible",message:"Un collecteur est disponible dans votre quartier",time:"Il y a 5 heures"},{id:3,type:"warning",title:"Rappel de collecte",message:"N'oubliez pas de préparer vos déchets pour demain",time:"Hier"}]);return t.jsxs(ca,{pageTitle:"Tableau de bord",currentPage:"dashboard",notifications:N,children:[t.jsx("div",{className:"mb-8",children:t.jsx("div",{className:"bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-6 text-white overflow-hidden",children:t.jsxs("div",{className:"flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6",children:[t.jsxs("div",{className:"flex-1 min-w-0",children:[t.jsxs("h2",{className:"text-2xl font-bold mb-2",children:["Bienvenue, ",i.firstName," !"]}),t.jsx("p",{className:"text-green-100",children:"Prêt à faire une différence aujourd'hui ? Continuez votre excellent travail de tri des déchets."})]}),t.jsx("div",{className:"hidden lg:block flex-shrink-0",children:t.jsxs("div",{className:"bg-white/20 backdrop-blur-sm rounded-xl p-4 min-w-[200px]",children:[t.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[t.jsx(Vx,{className:"w-5 h-5"}),t.jsx("span",{className:"font-medium",children:"Objectif du mois"})]}),t.jsx("div",{className:"text-2xl font-bold",children:"15 kg"}),t.jsx("div",{className:"text-sm text-green-100",children:"Encore 8.2 kg à atteindre"})]})})]})})}),t.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-8",children:[t.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow",children:[t.jsxs("div",{className:"flex items-center justify-between mb-4",children:[t.jsx("div",{className:"w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center",children:t.jsx(De,{className:"w-6 h-6 text-blue-600"})}),t.jsx("span",{className:"text-2xl font-bold text-gray-900",children:u.totalDeclarations})]}),t.jsx("p",{className:"text-gray-600 font-medium",children:"Total des déclarations"}),t.jsx("p",{className:"text-sm text-gray-500 mt-1",children:"Ce mois"}),t.jsxs("div",{className:"mt-3 flex items-center text-green-600 text-sm",children:[t.jsx(Hr,{className:"w-4 h-4 mr-1"}),"+12% vs mois dernier"]})]}),t.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow",children:[t.jsxs("div",{className:"flex items-center justify-between mb-4",children:[t.jsx("div",{className:"w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center",children:t.jsx(Qe,{className:"w-6 h-6 text-orange-600"})}),t.jsx("span",{className:"text-2xl font-bold text-gray-900",children:u.pendingCollections})]}),t.jsx("p",{className:"text-gray-600 font-medium",children:"Collectes en attente"}),t.jsx("p",{className:"text-sm text-gray-500 mt-1",children:"En cours"}),t.jsx("div",{className:"mt-3",children:t.jsx("div",{className:"w-full bg-gray-200 rounded-full h-2",children:t.jsx("div",{className:"bg-orange-500 h-2 rounded-full",style:{width:"40%"}})})})]}),t.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow",children:[t.jsxs("div",{className:"flex items-center justify-between mb-4",children:[t.jsx("div",{className:"w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center",children:t.jsx(Ce,{className:"w-6 h-6 text-green-600"})}),t.jsx("span",{className:"text-2xl font-bold text-gray-900",children:u.completedCollections})]}),t.jsx("p",{className:"text-gray-600 font-medium",children:"Collectes réalisées"}),t.jsx("p",{className:"text-sm text-gray-500 mt-1",children:"Terminées"}),t.jsxs("div",{className:"mt-3 flex items-center text-green-600 text-sm",children:[t.jsx(Ce,{className:"w-4 h-4 mr-1"}),"83% de taux de réussite"]})]}),t.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow",children:[t.jsxs("div",{className:"flex items-center justify-between mb-4",children:[t.jsx("div",{className:"w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center",children:t.jsx(zt,{className:"w-6 h-6 text-purple-600"})}),t.jsx("span",{className:"text-2xl font-bold text-gray-900",children:u.totalPointsEarned})]}),t.jsx("p",{className:"text-gray-600 font-medium",children:"Points cumulés"}),t.jsx("p",{className:"text-sm text-gray-500 mt-1",children:"Récompenses"}),t.jsxs("div",{className:"mt-3 flex items-center text-purple-600 text-sm",children:[t.jsx(zt,{className:"w-4 h-4 mr-1"}),"Niveau Éco-Héros"]})]})]}),t.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-3 gap-8",children:[t.jsx("div",{className:"lg:col-span-2",children:t.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-gray-200",children:[t.jsx("div",{className:"p-6 border-b border-gray-200",children:t.jsxs("div",{className:"flex items-center justify-between",children:[t.jsxs("h2",{className:"text-lg font-semibold text-gray-900 flex items-center gap-2",children:[t.jsx(ft,{className:"w-5 h-5 text-green-600"}),"Historique des collectes"]}),t.jsx("a",{href:"/history",className:"text-sm text-green-600 hover:text-green-700 font-medium",children:"Voir tout"})]})}),t.jsx("div",{className:"divide-y divide-gray-200",children:o.map(f=>{m(f.status);const g=x(f.status);return t.jsx("div",{className:"p-6 hover:bg-gray-50 transition-colors",children:t.jsxs("div",{className:"flex items-start justify-between",children:[t.jsxs("div",{className:"flex-1",children:[t.jsxs("div",{className:"flex items-center gap-3 mb-3",children:[t.jsxs("span",{className:"font-mono text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded",children:["#",f.id]}),t.jsx("span",{className:`px-2 py-1 rounded-full text-xs font-medium bg-${g}-100 text-${g}-800`,children:b(f.status)})]}),t.jsxs("div",{className:"flex items-center gap-4 mb-3",children:[t.jsx("div",{className:"flex items-center gap-2",children:f.wasteTypes.map(j=>{const p=d[j];return t.jsx("span",{className:"text-lg",title:p.label,children:p.icon},j)})}),t.jsxs("span",{className:"text-sm font-medium text-gray-700",children:[f.quantity," ",f.quantityUnit==="kg"?"kg":f.quantityUnit==="bags"?"sacs":"unités"]})]}),t.jsxs("div",{className:"flex items-center gap-6 text-sm text-gray-500",children:[t.jsxs("div",{className:"flex items-center gap-1",children:[t.jsx(at,{className:"w-3 h-3"}),new Date(f.createdAt).toLocaleDateString("fr-FR")]}),f.collector&&t.jsxs("div",{className:"flex items-center gap-1",children:[t.jsx(ta,{className:"w-3 h-3"}),f.collector.name,t.jsxs("div",{className:"flex items-center gap-1",children:[t.jsx(Ol,{className:"w-3 h-3 text-yellow-500 fill-current"}),t.jsx("span",{children:f.collector.rating})]})]})]}),f.status==="completed"&&t.jsxs("div",{className:"mt-3 pt-3 border-t border-gray-100 flex items-center gap-4 text-sm",children:[t.jsxs("span",{className:"text-green-600 font-medium",children:[t.jsx(Ce,{className:"w-3 h-3 inline mr-1"}),"Poids: ",f.actualWeight," kg"]}),t.jsxs("span",{className:"text-purple-600 font-medium",children:[t.jsx(zt,{className:"w-3 h-3 inline mr-1"}),"+",f.pointsEarned," points"]})]})]}),t.jsxs("a",{href:`/declaration/${f.id}`,className:"flex items-center gap-1 text-green-600 hover:text-green-700 transition-colors",children:[t.jsx("span",{className:"text-sm font-medium",children:"Détails"}),t.jsx($r,{className:"w-4 h-4"})]})]})},f.id)})})]})}),t.jsxs("div",{className:"space-y-6",children:[t.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-gray-200 p-6",children:[t.jsxs("h2",{className:"text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2",children:[t.jsx(Ur,{className:"w-5 h-5 text-green-600"}),"Actions rapides"]}),t.jsxs("div",{className:"space-y-3",children:[t.jsxs("a",{href:"/declare",className:"block w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-center font-medium flex items-center justify-center gap-2",children:[t.jsx(ft,{className:"w-4 h-4"}),"Déclarer des déchets"]}),t.jsx("a",{href:"/history",className:"block w-full py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-center font-medium",children:"Voir l'historique complet"}),t.jsx("a",{href:"/rewards",className:"block w-full py-3 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-center font-medium",children:"Mes récompenses"})]})]}),t.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-gray-200 p-6",children:[t.jsxs("h2",{className:"text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2",children:[t.jsx(Vt,{className:"w-5 h-5 text-green-600"}),"Impact environnemental"]}),t.jsxs("div",{className:"space-y-4",children:[t.jsxs("div",{children:[t.jsxs("div",{className:"flex justify-between items-center mb-2",children:[t.jsx("span",{className:"text-sm text-gray-600",children:"Total collecté"}),t.jsxs("span",{className:"font-semibold text-gray-900",children:[u.totalWasteCollected," kg"]})]}),t.jsx("div",{className:"w-full bg-gray-200 rounded-full h-2",children:t.jsx("div",{className:"bg-green-600 h-2 rounded-full transition-all duration-500",style:{width:"75%"}})})]}),t.jsxs("div",{className:"grid grid-cols-2 gap-4 pt-4 border-t",children:[t.jsxs("div",{className:"text-center",children:[t.jsx("div",{className:"w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2",children:t.jsx(bs,{className:"w-6 h-6 text-green-600"})}),t.jsx("p",{className:"text-2xl font-bold text-green-600",children:"89%"}),t.jsx("p",{className:"text-xs text-gray-600",children:"Taux de recyclage"})]}),t.jsxs("div",{className:"text-center",children:[t.jsx("div",{className:"w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2",children:t.jsx(Vt,{className:"w-6 h-6 text-blue-600"})}),t.jsx("p",{className:"text-2xl font-bold text-blue-600",children:"12"}),t.jsx("p",{className:"text-xs text-gray-600",children:"Arbres sauvés"})]})]})]})]}),t.jsxs("div",{className:"bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200",children:[t.jsxs("h3",{className:"font-semibold text-green-900 mb-3 flex items-center gap-2",children:[t.jsx(zt,{className:"w-4 h-4"}),"Conseil du jour"]}),t.jsx("p",{className:"text-sm text-green-800 leading-relaxed",children:"Saviez-vous que le tri sélectif peut vous rapporter jusqu'à 50% de points en plus ? Séparez correctement vos déchets pour maximiser vos récompenses !"}),t.jsx("div",{className:"mt-3 pt-3 border-t border-green-200",children:t.jsx("p",{className:"text-xs text-green-700",children:'🎯 Objectif : Atteignez 500 points ce mois pour débloquer le niveau "Maître Recycleur"'})})]})]})]})]})},Wv=()=>{const[i,u]=v.useState({wasteTypes:[],quantity:"",quantityUnit:"kg",collectionMode:"home",specialInstructions:"",preferredDate:"",preferredTime:"",photos:[]}),[o,d]=v.useState({}),[x,b]=v.useState(!1),[m,N]=v.useState(!1),[f,g]=v.useState(""),[j,p]=v.useState(0),E=[{id:"plastic",label:"Plastique",icon:bs,color:"blue",bgColor:"bg-blue-50",textColor:"text-blue-700",borderColor:"border-blue-200",points:2,examples:["Bouteilles","Sacs","Emballages"]},{id:"paper",label:"Papier / Carton",icon:ix,color:"yellow",bgColor:"bg-yellow-50",textColor:"text-yellow-700",borderColor:"border-yellow-200",points:1,examples:["Journaux","Cartons","Papier bureau"]},{id:"metal",label:"Métal",icon:De,color:"gray",bgColor:"bg-gray-50",textColor:"text-gray-700",borderColor:"border-gray-200",points:5,examples:["Canettes","Ferraille","Objets métalliques"]},{id:"glass",label:"Verre",icon:Cb,color:"green",bgColor:"bg-green-50",textColor:"text-green-700",borderColor:"border-green-200",points:3,examples:["Bouteilles","Pots","Verre plat"]},{id:"organic",label:"Organique",icon:Vt,color:"emerald",bgColor:"bg-emerald-50",textColor:"text-emerald-700",borderColor:"border-emerald-200",points:4,examples:["Restes alimentaires","Déchets jardin"]},{id:"electronic",label:"Électronique",icon:bb,color:"purple",bgColor:"bg-purple-50",textColor:"text-purple-700",borderColor:"border-purple-200",points:10,examples:["Appareils","Batteries","Câbles"]}],L=[{id:"kg",label:"Kilogrammes",icon:$s,short:"kg"},{id:"bags",label:"Sacs",icon:De,short:"sac"},{id:"units",label:"Unités",icon:ix,short:"unité"}],M=[{id:"home",label:"Collecte à domicile",icon:Ox,description:"Le collecteur passe chez vous",time:"Sous 24-48h",badge:"Recommandé"},{id:"deposit",label:"Dépôt volontaire",icon:pa,description:"Vous déposez au point de collecte",time:"Immédiat",badge:"+20% points"}],w=["08:00 - 10:00","10:00 - 12:00","14:00 - 16:00","16:00 - 18:00"],k=()=>{if(!i.wasteTypes.length||!i.quantity)return 0;const z=i.wasteTypes.reduce((ye,Ge)=>{const ut=E.find(Nt=>Nt.id===Ge);return ye+(ut?.points||0)},0),Q=parseFloat(i.quantity)||0,ie=i.collectionMode==="deposit"?1.2:1;return Math.round(z*Q*ie)};v.useState(()=>{p(k())},[i.wasteTypes,i.quantity,i.collectionMode]);const A=z=>{u(Q=>({...Q,wasteTypes:Q.wasteTypes.includes(z)?Q.wasteTypes.filter(ie=>ie!==z):[...Q.wasteTypes,z]})),o.wasteTypes&&i.wasteTypes.length>0&&d(Q=>({...Q,wasteTypes:""}))},O=z=>{const{name:Q,value:ie}=z.target;u(ye=>({...ye,[Q]:ie})),o[Q]&&d(ye=>({...ye,[Q]:""}))},$=z=>{const Q=Array.from(z.target.files);u(ie=>({...ie,photos:[...ie.photos,...Q]}))},Y=z=>{u(Q=>({...Q,photos:Q.photos.filter((ie,ye)=>ye!==z)}))},Z=()=>{const z={};return i.wasteTypes.length===0&&(z.wasteTypes="Veuillez sélectionner au moins un type de déchet"),(!i.quantity.trim()||parseFloat(i.quantity)<=0)&&(z.quantity="La quantité doit être supérieure à 0"),d(z),Object.keys(z).length===0},ee=async z=>{if(z.preventDefault(),!!Z()){b(!0);try{await new Promise(ie=>setTimeout(ie,2e3));const Q=`DEC-${Date.now().toString().slice(-6)}`;g(Q),console.log("Déclaration créée:",{...i,id:Q}),N(!0)}catch{d(ie=>({...ie,submit:"Une erreur est survenue. Veuillez réessayer."}))}finally{b(!1)}}},F=()=>{u({wasteTypes:[],quantity:"",quantityUnit:"kg",collectionMode:"home",specialInstructions:"",preferredDate:"",preferredTime:"",photos:[]}),N(!1),g(""),d({})};return m?t.jsx(ca,{pageTitle:"Déclaration réussie",currentPage:"declare",children:t.jsx("div",{className:"min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 py-12 px-4",children:t.jsxs("div",{className:"max-w-2xl mx-auto",children:[t.jsxs("div",{className:"text-center mb-8 animate-fadeIn",children:[t.jsxs("div",{className:"relative inline-flex mb-6",children:[t.jsx("div",{className:"absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20"}),t.jsx("div",{className:"relative h-24 w-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-xl",children:t.jsx(Ce,{className:"h-12 w-12 text-white"})})]}),t.jsx("h1",{className:"text-3xl font-bold text-gray-900 mb-3",children:"Déclaration enregistrée ! ✨"}),t.jsx("p",{className:"text-gray-600 text-lg",children:"Votre déclaration a été soumise avec succès"})]}),t.jsxs("div",{className:"bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20 mb-6 animate-slideUp",children:[t.jsxs("div",{className:"flex items-center justify-between mb-6 pb-6 border-b border-gray-100",children:[t.jsxs("div",{children:[t.jsx("p",{className:"text-sm text-gray-500 mb-1",children:"Numéro de déclaration"}),t.jsx("p",{className:"text-2xl font-mono font-bold text-gray-900",children:f})]}),t.jsx("div",{className:"bg-green-100 rounded-full px-4 py-2",children:t.jsx("span",{className:"text-sm font-medium text-green-700",children:"En attente"})})]}),t.jsx("div",{className:"bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-6 mb-6",children:t.jsxs("div",{className:"flex items-center justify-between",children:[t.jsxs("div",{children:[t.jsx("p",{className:"text-sm text-emerald-700 mb-1",children:"Points verts estimés"}),t.jsxs("p",{className:"text-3xl font-bold text-emerald-600",children:["+",j]})]}),t.jsx("div",{className:"h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center",children:t.jsx(Ys,{className:"h-8 w-8 text-emerald-600"})})]})}),t.jsxs("div",{className:"space-y-4 mb-6",children:[t.jsxs("h3",{className:"font-semibold text-gray-900 flex items-center gap-2",children:[t.jsx(De,{className:"h-4 w-4 text-green-600"}),"Récapitulatif"]}),t.jsxs("div",{className:"grid grid-cols-2 gap-4",children:[t.jsxs("div",{className:"bg-gray-50 rounded-xl p-4",children:[t.jsx("p",{className:"text-xs text-gray-500 mb-1",children:"Types de déchets"}),t.jsx("div",{className:"flex flex-wrap gap-1",children:i.wasteTypes.map(z=>{const Q=E.find(ye=>ye.id===z),ie=Q?.icon;return t.jsxs("div",{className:`${Q?.bgColor} rounded-full px-2 py-1 flex items-center gap-1`,children:[t.jsx(ie,{className:`h-3 w-3 ${Q?.textColor}`}),t.jsx("span",{className:`text-xs ${Q?.textColor}`,children:Q?.label})]},z)})})]}),t.jsxs("div",{className:"bg-gray-50 rounded-xl p-4",children:[t.jsx("p",{className:"text-xs text-gray-500 mb-1",children:"Quantité"}),t.jsxs("p",{className:"text-lg font-semibold text-gray-900",children:[i.quantity," ",L.find(z=>z.id===i.quantityUnit)?.short]})]}),t.jsxs("div",{className:"bg-gray-50 rounded-xl p-4",children:[t.jsx("p",{className:"text-xs text-gray-500 mb-1",children:"Mode de collecte"}),t.jsx("p",{className:"font-medium text-gray-900",children:M.find(z=>z.id===i.collectionMode)?.label})]}),t.jsxs("div",{className:"bg-gray-50 rounded-xl p-4",children:[t.jsx("p",{className:"text-xs text-gray-500 mb-1",children:"Statut"}),t.jsxs("div",{className:"flex items-center gap-1",children:[t.jsx(Qe,{className:"h-4 w-4 text-amber-500"}),t.jsx("span",{className:"font-medium text-amber-600",children:"En attente"})]})]})]})]}),t.jsx("div",{className:"bg-blue-50 rounded-xl p-5 mb-6",children:t.jsxs("div",{className:"flex items-start gap-3",children:[t.jsx("div",{className:"rounded-full bg-blue-100 p-2",children:t.jsx(fs,{className:"h-5 w-5 text-blue-600"})}),t.jsxs("div",{children:[t.jsx("h4",{className:"font-semibold text-blue-900 mb-2",children:"Prochaines étapes"}),t.jsxs("ul",{className:"space-y-2 text-sm text-blue-800",children:[t.jsxs("li",{className:"flex items-center gap-2",children:[t.jsx("div",{className:"h-1.5 w-1.5 rounded-full bg-blue-600"}),"Un collecteur sera affecté dans les plus brefs délais"]}),t.jsxs("li",{className:"flex items-center gap-2",children:[t.jsx("div",{className:"h-1.5 w-1.5 rounded-full bg-blue-600"}),"Vous recevrez une notification avec les détails"]}),t.jsxs("li",{className:"flex items-center gap-2",children:[t.jsx("div",{className:"h-1.5 w-1.5 rounded-full bg-blue-600"}),"Suivez le statut en temps réel dans votre tableau de bord"]})]})]})]})}),t.jsxs("div",{className:"space-y-3",children:[t.jsx("a",{href:"/dashboard",className:"group block w-full py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-xl hover:shadow-xl transition-all hover:scale-[1.02] text-center",children:"Voir mon tableau de bord"}),t.jsxs("button",{onClick:F,className:"group block w-full py-4 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2",children:[t.jsx(Ur,{className:"h-5 w-5 group-hover:rotate-90 transition-transform"}),"Nouvelle déclaration"]})]})]}),t.jsx("div",{className:"text-center",children:t.jsxs("p",{className:"text-sm text-gray-500",children:["Besoin d'aide ?"," ",t.jsx("a",{href:"/support",className:"text-emerald-600 font-medium hover:underline",children:"Contacter le support"})]})})]})})}):t.jsxs(ca,{pageTitle:"Déclarer mes déchets",currentPage:"declare",notifications:[],children:[t.jsxs("div",{className:"max-w-6xl mx-auto px-4 py-8",children:[t.jsxs("div",{className:"relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600 p-8 text-white",children:[t.jsxs("div",{className:"absolute inset-0 opacity-10",children:[t.jsx("div",{className:"absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white blur-3xl"}),t.jsx("div",{className:"absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-emerald-300 blur-3xl"})]}),t.jsxs("div",{className:"relative",children:[t.jsxs("div",{className:"flex items-center gap-4 mb-6",children:[t.jsx("div",{className:"h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center",children:t.jsx(bs,{className:"h-8 w-8 text-white"})}),t.jsxs("div",{children:[t.jsx("h1",{className:"text-3xl font-bold mb-2",children:"Déclarer mes déchets"}),t.jsx("p",{className:"text-white/90",children:"Contribuez à un environnement plus propre et gagnez des points"})]})]}),i.wasteTypes.length>0&&i.quantity&&t.jsxs("div",{className:"inline-flex items-center gap-3 rounded-full bg-white/20 backdrop-blur-sm px-6 py-3",children:[t.jsx(Ys,{className:"h-5 w-5 text-yellow-300"}),t.jsx("span",{className:"font-medium",children:"Points estimés :"}),t.jsx("span",{className:"text-2xl font-bold",children:j})]})]})]}),t.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-3 gap-8",children:[t.jsx("div",{className:"lg:col-span-2",children:t.jsxs("form",{onSubmit:ee,className:"space-y-6",children:[t.jsxs("div",{className:"bg-white rounded-2xl shadow-sm border border-gray-100 p-6",children:[t.jsxs("h2",{className:"text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2",children:[t.jsx("div",{className:"rounded-lg bg-green-100 p-2",children:t.jsx(ft,{className:"h-5 w-5 text-green-600"})}),"Types de déchets ",t.jsx("span",{className:"text-red-500",children:"*"})]}),t.jsx("p",{className:"text-sm text-gray-600 mb-4",children:"Sélectionnez tous les types de déchets que vous souhaitez faire collecter"}),t.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-3",children:E.map(z=>{const Q=z.icon,ie=i.wasteTypes.includes(z.id);return t.jsx("button",{type:"button",onClick:()=>A(z.id),className:`group relative overflow-hidden rounded-xl p-4 transition-all ${ie?`${z.bgColor} ${z.borderColor} border-2 scale-[1.02] shadow-md`:"bg-gray-50 border-2 border-transparent hover:border-gray-200 hover:shadow-sm"}`,children:t.jsxs("div",{className:"flex items-start gap-3",children:[t.jsx("div",{className:`rounded-lg p-2.5 ${ie?z.bgColor:"bg-white"}`,children:t.jsx(Q,{className:`h-5 w-5 ${z.textColor}`})}),t.jsxs("div",{className:"flex-1 text-left",children:[t.jsxs("div",{className:"flex items-center justify-between",children:[t.jsx("h3",{className:"font-semibold text-gray-900",children:z.label}),t.jsxs("span",{className:`text-xs font-medium px-2 py-1 rounded-full ${ie?"bg-white":"bg-gray-200"}`,children:[z.points," pts/kg"]})]}),t.jsx("p",{className:"text-xs text-gray-600 mt-1",children:z.examples.join(" • ")})]}),ie&&t.jsx("div",{className:"absolute top-2 right-2",children:t.jsx(Ce,{className:"h-5 w-5 text-green-600"})})]})},z.id)})}),o.wasteTypes&&t.jsxs("p",{className:"text-red-500 text-sm mt-2 flex items-center gap-1",children:[t.jsx(Al,{className:"h-4 w-4"}),o.wasteTypes]})]}),t.jsxs("div",{className:"bg-white rounded-2xl shadow-sm border border-gray-100 p-6",children:[t.jsxs("h2",{className:"text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2",children:[t.jsx("div",{className:"rounded-lg bg-green-100 p-2",children:t.jsx($s,{className:"h-5 w-5 text-green-600"})}),"Quantité estimée ",t.jsx("span",{className:"text-red-500",children:"*"})]}),t.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-4",children:[t.jsxs("div",{className:"md:col-span-2",children:[t.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Quantité"}),t.jsx("div",{className:"relative",children:t.jsx("input",{type:"number",name:"quantity",value:i.quantity,onChange:O,min:"0.1",step:"0.1",className:`w-full rounded-xl border-0 bg-gray-50 px-4 py-3.5 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-green-600 transition-all ${o.quantity?"ring-2 ring-red-500":""}`,placeholder:"0.0"})}),o.quantity&&t.jsx("p",{className:"text-red-500 text-sm mt-1",children:o.quantity})]}),t.jsxs("div",{children:[t.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Unité"}),t.jsx("select",{name:"quantityUnit",value:i.quantityUnit,onChange:O,className:"w-full rounded-xl border-0 bg-gray-50 px-4 py-3.5 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-green-600 transition-all",children:L.map(z=>(z.icon,t.jsx("option",{value:z.id,children:z.label},z.id)))})]})]}),t.jsx("div",{className:"mt-4 rounded-xl bg-amber-50 border border-amber-200 p-3",children:t.jsxs("div",{className:"flex items-start gap-2",children:[t.jsx(gi,{className:"h-4 w-4 text-amber-600 mt-0.5"}),t.jsxs("p",{className:"text-xs text-amber-800",children:[t.jsx("span",{className:"font-medium",children:"Conseil :"})," Soyez le plus précis possible pour faciliter l'organisation de la collecte"]})]})})]}),t.jsxs("div",{className:"bg-white rounded-2xl shadow-sm border border-gray-100 p-6",children:[t.jsxs("h2",{className:"text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2",children:[t.jsx("div",{className:"rounded-lg bg-green-100 p-2",children:t.jsx(na,{className:"h-5 w-5 text-green-600"})}),"Mode de collecte ",t.jsx("span",{className:"text-red-500",children:"*"})]}),t.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:M.map(z=>{const Q=z.icon,ie=i.collectionMode===z.id;return t.jsxs("button",{type:"button",onClick:()=>u(ye=>({...ye,collectionMode:z.id})),className:`relative overflow-hidden rounded-xl p-5 transition-all ${ie?"bg-gradient-to-br from-green-50 to-emerald-50 ring-2 ring-green-600 shadow-lg":"bg-gray-50 ring-1 ring-gray-200 hover:ring-green-300 hover:shadow-md"}`,children:[z.badge&&t.jsx("span",{className:"absolute top-2 right-2 text-xs font-medium px-2 py-1 rounded-full bg-green-600 text-white",children:z.badge}),t.jsxs("div",{className:"flex items-start gap-3",children:[t.jsx("div",{className:`rounded-lg p-3 ${ie?"bg-green-600 text-white":"bg-white text-green-600"}`,children:t.jsx(Q,{className:"h-6 w-6"})}),t.jsxs("div",{className:"text-left",children:[t.jsx("h3",{className:"font-semibold text-gray-900",children:z.label}),t.jsx("p",{className:"text-sm text-gray-600 mt-1",children:z.description}),t.jsx("p",{className:"text-xs text-green-600 mt-2",children:z.time})]})]})]},z.id)})})]}),t.jsxs("div",{className:"bg-white rounded-2xl shadow-sm border border-gray-100 p-6",children:[t.jsxs("h2",{className:"text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2",children:[t.jsx("div",{className:"rounded-lg bg-green-100 p-2",children:t.jsx(at,{className:"h-5 w-5 text-green-600"})}),"Options avancées (optionnel)"]}),t.jsxs("div",{className:"space-y-4",children:[t.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[t.jsxs("div",{children:[t.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Date préférée"}),t.jsx("input",{type:"date",name:"preferredDate",value:i.preferredDate,onChange:O,min:new Date().toISOString().split("T")[0],className:"w-full rounded-xl border-0 bg-gray-50 px-4 py-3 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-green-600 transition-all"})]}),t.jsxs("div",{children:[t.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Créneau horaire"}),t.jsxs("select",{name:"preferredTime",value:i.preferredTime,onChange:O,className:"w-full rounded-xl border-0 bg-gray-50 px-4 py-3 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-green-600 transition-all",children:[t.jsx("option",{value:"",children:"Sélectionner un créneau"}),w.map(z=>t.jsx("option",{value:z,children:z},z))]})]})]}),t.jsxs("div",{children:[t.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Instructions spéciales"}),t.jsx("textarea",{name:"specialInstructions",value:i.specialInstructions,onChange:O,rows:3,className:"w-full rounded-xl border-0 bg-gray-50 px-4 py-3 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-green-600 transition-all",placeholder:"Informations complémentaires pour le collecteur..."})]}),t.jsxs("div",{children:[t.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Photos (optionnel)"}),t.jsxs("div",{className:"flex flex-wrap gap-3",children:[i.photos.map((z,Q)=>t.jsxs("div",{className:"relative",children:[t.jsx("div",{className:"h-20 w-20 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center",children:t.jsx("img",{src:URL.createObjectURL(z),alt:`Photo ${Q+1}`,className:"h-full w-full object-cover rounded-lg"})}),t.jsx("button",{type:"button",onClick:()=>Y(Q),className:"absolute -top-2 -right-2 rounded-full bg-red-500 text-white p-1 hover:bg-red-600 transition-colors",children:t.jsx(Qb,{className:"h-3 w-3"})})]},Q)),t.jsxs("label",{className:"h-20 w-20 rounded-lg border-2 border-dashed border-gray-300 hover:border-green-500 transition-colors flex flex-col items-center justify-center cursor-pointer bg-gray-50",children:[t.jsx(Ur,{className:"h-6 w-6 text-gray-400"}),t.jsx("input",{type:"file",accept:"image/*",onChange:$,className:"hidden",multiple:!0})]})]}),t.jsx("p",{className:"text-xs text-gray-500 mt-2",children:"Ajoutez des photos pour aider le collecteur à identifier les déchets"})]})]})]}),o.submit&&t.jsx("div",{className:"rounded-xl bg-red-50 border border-red-200 p-4",children:t.jsxs("div",{className:"flex items-center gap-3",children:[t.jsx(Al,{className:"h-5 w-5 text-red-600"}),t.jsx("p",{className:"text-sm text-red-800",children:o.submit})]})}),t.jsx("button",{type:"submit",disabled:x,className:"w-full py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-xl hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group",children:x?t.jsxs(t.Fragment,{children:[t.jsx("div",{className:"h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"}),t.jsx("span",{children:"Traitement en cours..."})]}):t.jsxs(t.Fragment,{children:[t.jsx("span",{children:"Déclarer mes déchets"}),t.jsx($r,{className:"h-5 w-5 group-hover:translate-x-1 transition-transform"})]})})]})}),t.jsxs("div",{className:"space-y-6",children:[t.jsxs("div",{className:"bg-gradient-to-br from-emerald-600 to-green-600 rounded-2xl p-6 text-white",children:[t.jsxs("h3",{className:"text-lg font-semibold mb-4 flex items-center gap-2",children:[t.jsx(Ys,{className:"h-5 w-5 text-yellow-300"}),"Programme de fidélité"]}),t.jsxs("div",{className:"space-y-4",children:[t.jsxs("div",{className:"flex items-center justify-between",children:[t.jsx("span",{children:"Points par kg de plastique"}),t.jsx("span",{className:"font-bold",children:"2 pts"})]}),t.jsxs("div",{className:"flex items-center justify-between",children:[t.jsx("span",{children:"Points par kg de métal"}),t.jsx("span",{className:"font-bold",children:"5 pts"})]}),t.jsxs("div",{className:"flex items-center justify-between",children:[t.jsx("span",{children:"Points par kg d'électronique"}),t.jsx("span",{className:"font-bold",children:"10 pts"})]}),t.jsx("div",{className:"pt-4 border-t border-white/20",children:t.jsxs("div",{className:"flex items-center justify-between",children:[t.jsx("span",{children:"Bonus dépôt volontaire"}),t.jsx("span",{className:"font-bold text-yellow-300",children:"+20%"})]})})]})]}),t.jsxs("div",{className:"bg-white rounded-2xl shadow-sm border border-gray-100 p-6",children:[t.jsx("h3",{className:"font-semibold text-gray-900 mb-4",children:"À savoir"}),t.jsxs("div",{className:"space-y-4",children:[t.jsxs("div",{className:"flex items-start gap-3",children:[t.jsx("div",{className:"rounded-full bg-blue-100 p-2",children:t.jsx(Qe,{className:"h-4 w-4 text-blue-600"})}),t.jsxs("div",{children:[t.jsx("p",{className:"text-sm font-medium text-gray-900",children:"Délai de traitement"}),t.jsx("p",{className:"text-xs text-gray-600",children:"24-48h maximum"})]})]}),t.jsxs("div",{className:"flex items-start gap-3",children:[t.jsx("div",{className:"rounded-full bg-green-100 p-2",children:t.jsx(vs,{className:"h-4 w-4 text-green-600"})}),t.jsxs("div",{children:[t.jsx("p",{className:"text-sm font-medium text-gray-900",children:"Collecteurs certifiés"}),t.jsx("p",{className:"text-xs text-gray-600",children:"Tous nos partenaires sont vérifiés"})]})]}),t.jsxs("div",{className:"flex items-start gap-3",children:[t.jsx("div",{className:"rounded-full bg-purple-100 p-2",children:t.jsx(fs,{className:"h-4 w-4 text-purple-600"})}),t.jsxs("div",{children:[t.jsx("p",{className:"text-sm font-medium text-gray-900",children:"Notifications en temps réel"}),t.jsx("p",{className:"text-xs text-gray-600",children:"Suivez l'avancement de votre déclaration"})]})]})]})]}),t.jsxs("div",{className:"bg-emerald-50 rounded-2xl p-6 border border-emerald-200",children:[t.jsxs("div",{className:"flex items-center gap-3 mb-3",children:[t.jsx(Vt,{className:"h-6 w-6 text-emerald-600"}),t.jsx("h3",{className:"font-semibold text-emerald-900",children:"Impact environnemental"})]}),t.jsx("p",{className:"text-sm text-emerald-800",children:"Chaque déclaration contribue à réduire l'empreinte carbone et à promouvoir l'économie circulaire."}),i.wasteTypes.length>0&&i.quantity&&t.jsx("div",{className:"mt-4 pt-4 border-t border-emerald-200",children:t.jsxs("p",{className:"text-xs text-emerald-700",children:["🌱 Cette déclaration pourrait éviter l'émission de"," ",t.jsxs("span",{className:"font-bold",children:[(parseFloat(i.quantity)*2.5).toFixed(1)," kg"]})," de CO₂"]})})]})]})]})]}),t.jsx("style",{jsx:!0,children:`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.5s ease-out;
        }
      `})]})},Fv=()=>{const[i]=v.useState({id:"DEC-123456",wasteTypes:["plastic","paper"],quantity:"5.2",quantityUnit:"kg",collectionMode:"home",specialInstructions:"Sonnette à droite, portail bleu",createdAt:"2024-01-15T10:30:00Z",status:"in_progress",collector:{id:"COL-789",name:"Paul Mbarga",phone:"+237 698 234 567",photo:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",rating:4.8,vehicle:"Camionnette bennes",plateNumber:"CE 1234 AB"},scheduledDate:"2024-01-15T14:00:00Z",estimatedDuration:"30 minutes",actualWeight:null,pointsEarned:null}),u=[{id:"pending",label:"En attente d'affectation",description:"Nous recherchons un collecteur disponible",timestamp:i.createdAt,completed:!0,icon:Qe,color:"amber"},{id:"assigned",label:"Collecteur affecté",description:`${i.collector.name} a été assigné à votre demande`,timestamp:"2024-01-15T11:15:00Z",completed:!0,icon:ct,color:"blue"},{id:"scheduled",label:"Collecte programmée",description:`Rendez-vous fixé pour le ${new Date(i.scheduledDate).toLocaleString("fr-FR")}`,timestamp:"2024-01-15T11:20:00Z",completed:!0,icon:at,color:"purple"},{id:"in_progress",label:"En cours de collecte",description:"Le collecteur est en route",timestamp:"2024-01-15T13:45:00Z",completed:!0,icon:De,color:"orange"},{id:"completed",label:"Collecte effectuée",description:"La collecte a été réalisée avec succès",timestamp:null,completed:!1,icon:Ce,color:"green"}],o={plastic:{label:"Plastique",icon:"♻️",color:"blue"},paper:{label:"Papier / Carton",icon:"📄",color:"yellow"},metal:{label:"Métal",icon:"🔧",color:"gray"},glass:{label:"Verre",icon:"🍾",color:"green"},organic:{label:"Déchets organiques",icon:"🌱",color:"orange"},electronic:{label:"Déchets électroniques",icon:"📱",color:"purple"}},d={kg:"Kilogrammes",bags:"Sacs",units:"Unités"},x=m=>({pending:"amber",assigned:"blue",scheduled:"purple",in_progress:"orange",completed:"green"})[m]||"gray",b=m=>({pending:"En attente d'affectation",assigned:"Collecteur affecté",scheduled:"Collecte programmée",in_progress:"En cours de collecte",completed:"Collecte effectuée"})[m]||"Inconnu";return u.find(m=>!m.completed)||u[u.length-1],t.jsx(ca,{pageTitle:"Suivi de la collecte",currentPage:"tracking",notifications:[],children:t.jsxs("div",{className:"max-w-4xl lg:max-w-6xl mx-auto px-2 sm:px-0",children:[t.jsx("div",{className:"bg-white rounded-2xl shadow-lg p-6 mb-6",children:t.jsxs("div",{className:"flex items-center justify-between",children:[t.jsxs("div",{className:"flex items-center gap-4",children:[t.jsxs("a",{href:"/dashboard",className:"flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors",children:[t.jsx(Gs,{className:"w-5 h-5"}),"Retour"]}),t.jsxs("div",{className:"flex items-center gap-3",children:[t.jsx(De,{className:"w-8 h-8 text-green-600"}),t.jsxs("div",{children:[t.jsx("h1",{className:"text-2xl font-bold text-gray-900",children:"Suivi de la collecte"}),t.jsxs("p",{className:"text-gray-600",children:["Déclaration #",i.id]})]})]})]}),t.jsx("div",{className:`px-4 py-2 rounded-full bg-${x(i.status)}-100 text-${x(i.status)}-800 font-medium`,children:b(i.status)})]})}),t.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-3 gap-6",children:[t.jsxs("div",{className:"lg:col-span-2 space-y-6",children:[t.jsxs("div",{className:"bg-white rounded-2xl shadow-lg p-6",children:[t.jsxs("h2",{className:"text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2",children:[t.jsx(Qe,{className:"w-5 h-5 text-green-600"}),"Progression de la collecte"]}),t.jsx("div",{className:"space-y-4",children:u.map((m,N)=>{const f=m.icon,g=N===u.length-1;return t.jsxs("div",{className:"flex gap-4",children:[t.jsxs("div",{className:"flex flex-col items-center",children:[t.jsx("div",{className:`w-10 h-10 rounded-full flex items-center justify-center ${m.completed?`bg-${m.color}-100 text-${m.color}-600`:"bg-gray-100 text-gray-400"}`,children:t.jsx(f,{className:"w-5 h-5"})}),!g&&t.jsx("div",{className:`w-0.5 h-16 mt-2 ${m.completed?"bg-green-200":"bg-gray-200"}`})]}),t.jsx("div",{className:"flex-1 pb-8",children:t.jsxs("div",{className:"flex items-start justify-between",children:[t.jsxs("div",{children:[t.jsx("h3",{className:`font-semibold ${m.completed?"text-gray-900":"text-gray-500"}`,children:m.label}),t.jsx("p",{className:`text-sm mt-1 ${m.completed?"text-gray-600":"text-gray-400"}`,children:m.description})]}),m.timestamp&&t.jsx("span",{className:"text-xs text-gray-500 whitespace-nowrap ml-4",children:new Date(m.timestamp).toLocaleString("fr-FR",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})})]})})]},m.id)})})]}),t.jsxs("div",{className:"bg-white rounded-2xl shadow-lg p-6",children:[t.jsxs("h2",{className:"text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2",children:[t.jsx(De,{className:"w-5 h-5 text-green-600"}),"Détails de la déclaration"]}),t.jsxs("div",{className:"grid grid-cols-2 gap-6",children:[t.jsxs("div",{children:[t.jsx("h3",{className:"font-medium text-gray-900 mb-3",children:"Types de déchets"}),t.jsx("div",{className:"space-y-2",children:i.wasteTypes.map(m=>{const N=o[m];return t.jsxs("div",{className:"flex items-center gap-2",children:[t.jsx("span",{className:"text-lg",children:N.icon}),t.jsx("span",{className:"text-sm text-gray-700",children:N.label})]},m)})})]}),t.jsxs("div",{children:[t.jsx("h3",{className:"font-medium text-gray-900 mb-3",children:"Quantité"}),t.jsxs("div",{className:"flex items-center gap-2",children:[t.jsx($s,{className:"w-4 h-4 text-gray-400"}),t.jsxs("span",{className:"text-gray-700",children:[i.quantity," ",d[i.quantityUnit]]})]})]}),t.jsxs("div",{children:[t.jsx("h3",{className:"font-medium text-gray-900 mb-3",children:"Mode de collecte"}),t.jsxs("div",{className:"flex items-center gap-2",children:[t.jsx(pa,{className:"w-4 h-4 text-gray-400"}),t.jsx("span",{className:"text-gray-700",children:i.collectionMode==="home"?"Collecte à domicile":"Dépôt volontaire"})]})]}),t.jsxs("div",{children:[t.jsx("h3",{className:"font-medium text-gray-900 mb-3",children:"Date de création"}),t.jsxs("div",{className:"flex items-center gap-2",children:[t.jsx(at,{className:"w-4 h-4 text-gray-400"}),t.jsx("span",{className:"text-gray-700",children:new Date(i.createdAt).toLocaleString("fr-FR")})]})]})]}),i.specialInstructions&&t.jsxs("div",{className:"max-w-4xl lg:max-w-6xl mx-auto px-2 sm:px-0 border-t",children:[t.jsx("h3",{className:"font-medium text-gray-900 mb-2",children:"Instructions spéciales"}),t.jsx("p",{className:"text-sm text-gray-600 bg-gray-50 rounded-lg p-3",children:i.specialInstructions})]})]})]}),t.jsxs("div",{className:"space-y-6",children:[i.collector&&t.jsxs("div",{className:"bg-white rounded-2xl shadow-lg p-6",children:[t.jsxs("h2",{className:"text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2",children:[t.jsx(ct,{className:"w-5 h-5 text-green-600"}),"Collecteur assigné"]}),t.jsxs("div",{className:"text-center mb-6",children:[t.jsx("img",{src:i.collector.photo,alt:i.collector.name,className:"w-20 h-20 rounded-full mx-auto mb-3 object-cover"}),t.jsx("h3",{className:"font-semibold text-gray-900",children:i.collector.name}),t.jsxs("div",{className:"flex items-center justify-center gap-1 mt-1",children:[t.jsx(Ol,{className:"w-4 h-4 text-yellow-500 fill-current"}),t.jsx("span",{className:"text-sm text-gray-600",children:i.collector.rating})]})]}),t.jsxs("div",{className:"space-y-3",children:[t.jsxs("div",{className:"flex items-center gap-3",children:[t.jsx(ia,{className:"w-4 h-4 text-gray-400"}),t.jsx("span",{className:"text-sm text-gray-700",children:i.collector.phone})]}),t.jsxs("div",{className:"flex items-center gap-3",children:[t.jsx(De,{className:"w-4 h-4 text-gray-400"}),t.jsx("span",{className:"text-sm text-gray-700",children:i.collector.vehicle})]}),t.jsxs("div",{className:"flex items-center gap-3",children:[t.jsx(pa,{className:"w-4 h-4 text-gray-400"}),t.jsx("span",{className:"text-sm text-gray-700",children:i.collector.plateNumber})]})]}),t.jsxs("div",{className:"mt-6 space-y-3",children:[t.jsxs("button",{className:"w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2",children:[t.jsx(ia,{className:"w-4 h-4"}),"Contacter"]}),t.jsxs("button",{className:"w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2",children:[t.jsx(Or,{className:"w-4 h-4"}),"Message"]})]})]}),t.jsxs("div",{className:"bg-white rounded-2xl shadow-lg p-6",children:[t.jsxs("h2",{className:"text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2",children:[t.jsx(at,{className:"w-5 h-5 text-green-600"}),"Programmation"]}),t.jsxs("div",{className:"space-y-3",children:[t.jsxs("div",{children:[t.jsx("p",{className:"text-sm text-gray-600",children:"Date et heure"}),t.jsx("p",{className:"font-medium text-gray-900",children:new Date(i.scheduledDate).toLocaleString("fr-FR",{weekday:"long",day:"numeric",month:"long",hour:"2-digit",minute:"2-digit"})})]}),t.jsxs("div",{children:[t.jsx("p",{className:"text-sm text-gray-600",children:"Durée estimée"}),t.jsx("p",{className:"font-medium text-gray-900",children:i.estimatedDuration})]})]})]}),i.status==="completed"&&t.jsxs("div",{className:"bg-white rounded-2xl shadow-lg p-6",children:[t.jsxs("h2",{className:"text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2",children:[t.jsx(Ce,{className:"w-5 h-5 text-green-600"}),"Résultat de la collecte"]}),t.jsxs("div",{className:"space-y-3",children:[t.jsxs("div",{children:[t.jsx("p",{className:"text-sm text-gray-600",children:"Poids réel"}),t.jsxs("p",{className:"font-medium text-gray-900",children:[i.actualWeight||"Non pesé"," kg"]})]}),t.jsxs("div",{children:[t.jsx("p",{className:"text-sm text-gray-600",children:"Points gagnés"}),t.jsxs("p",{className:"font-medium text-green-600",children:[i.pointsEarned||"0"," points"]})]})]})]}),t.jsx("div",{className:"bg-blue-50 border border-blue-200 rounded-lg p-4",children:t.jsxs("div",{className:"flex items-start gap-2",children:[t.jsx(Al,{className:"w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0"}),t.jsxs("div",{className:"text-sm text-blue-800",children:[t.jsx("p",{className:"font-medium mb-1",children:"Besoin d'aide ?"}),t.jsx("p",{children:"Contactez notre support si vous avez des questions sur cette collecte."})]})]})})]})]})]})})},Iv=()=>{const[i]=v.useState([{id:"DEC-123456",wasteTypes:["plastic","paper"],quantity:"5.2",quantityUnit:"kg",status:"in_progress",createdAt:"2024-01-15T10:30:00Z",scheduledDate:"2024-01-15T14:00:00Z",collector:{name:"Paul Mbarga",rating:4.8,phone:"+237 698 234 567",photo:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",vehicle:"Camionnette bennes",plateNumber:"CE 1234 AB",totalCollects:1243,experience:"3 ans"},estimatedArrival:"2024-01-15T13:45:00Z",currentLocation:"En route vers Douala",progress:75,distance:"5.2 km",ecoPoints:45},{id:"DEC-123455",wasteTypes:["glass"],quantity:"3",quantityUnit:"kg",status:"assigned",createdAt:"2024-01-14T16:20:00Z",scheduledDate:"2024-01-16T09:00:00Z",collector:{name:"Marie Tchuenté",rating:4.9,phone:"+237 698 345 678",photo:"https://images.unsplash.com/photo-1494790108755-2616b332c1c4?w=100&h=100&fit=crop&crop=face",vehicle:"Camion benne",plateNumber:"CE 5678 CD",totalCollects:2156,experience:"5 ans"},estimatedArrival:"2024-01-16T09:30:00Z",currentLocation:"Base de Douala",progress:25,distance:"12.5 km",ecoPoints:28},{id:"DEC-123454",wasteTypes:["metal","electronic"],quantity:"8",quantityUnit:"kg",status:"scheduled",createdAt:"2024-01-13T09:15:00Z",scheduledDate:"2024-01-17T14:00:00Z",collector:{name:"Jean Pierre",rating:4.7,phone:"+237 698 456 789",photo:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",vehicle:"Fourgon",plateNumber:"CE 9012 EF",totalCollects:987,experience:"2 ans"},estimatedArrival:"2024-01-17T14:30:00Z",currentLocation:"En attente de confirmation",progress:10,distance:"8.3 km",ecoPoints:62}]),[u,o]=v.useState(""),[d,x]=v.useState("all"),[b,m]=v.useState("date"),[N,f]=v.useState("list"),g={plastic:{label:"Plastique",icon:"♻️",color:"blue",bgColor:"bg-blue-50",textColor:"text-blue-700"},paper:{label:"Papier / Carton",icon:"📄",color:"yellow",bgColor:"bg-yellow-50",textColor:"text-yellow-700"},metal:{label:"Métal",icon:"🔧",color:"gray",bgColor:"bg-gray-50",textColor:"text-gray-700"},glass:{label:"Verre",icon:"🍾",color:"green",bgColor:"bg-green-50",textColor:"text-green-700"},organic:{label:"Organique",icon:"🌱",color:"orange",bgColor:"bg-orange-50",textColor:"text-orange-700"},electronic:{label:"Électronique",icon:"📱",color:"purple",bgColor:"bg-purple-50",textColor:"text-purple-700"}},j=w=>{const k={pending:{color:"amber",bgColor:"bg-amber-50",textColor:"text-amber-700",borderColor:"border-amber-200",icon:Qe,label:"En attente",progressColor:"bg-amber-500"},assigned:{color:"blue",bgColor:"bg-blue-50",textColor:"text-blue-700",borderColor:"border-blue-200",icon:ta,label:"Collecteur assigné",progressColor:"bg-blue-500"},scheduled:{color:"purple",bgColor:"bg-purple-50",textColor:"text-purple-700",borderColor:"border-purple-200",icon:at,label:"Programmé",progressColor:"bg-purple-500"},in_progress:{color:"orange",bgColor:"bg-orange-50",textColor:"text-orange-700",borderColor:"border-orange-200",icon:na,label:"En cours",progressColor:"bg-orange-500"},completed:{color:"green",bgColor:"bg-green-50",textColor:"text-green-700",borderColor:"border-green-200",icon:Ce,label:"Terminé",progressColor:"bg-green-500"}};return k[w]||k.pending},p=w=>w>=75?"emerald":w>=50?"green":w>=25?"yellow":"orange",E=i.filter(w=>{const k=w.id.toLowerCase().includes(u.toLowerCase())||w.wasteTypes.some(O=>g[O].label.toLowerCase().includes(u.toLowerCase()))||w.collector?.name.toLowerCase().includes(u.toLowerCase()),A=d==="all"||w.status===d;return k&&A}).sort((w,k)=>b==="date"?new Date(k.createdAt)-new Date(w.createdAt):b==="progress"?k.progress-w.progress:b==="points"?k.ecoPoints-w.ecoPoints:0),L={total:i.length,inProgress:i.filter(w=>w.status==="in_progress").length,scheduled:i.filter(w=>w.status==="scheduled").length,assigned:i.filter(w=>w.status==="assigned").length,totalPoints:i.reduce((w,k)=>w+(k.ecoPoints||0),0),totalWaste:i.reduce((w,k)=>w+parseFloat(k.quantity),0).toFixed(1)},M=w=>new Date(w).toLocaleDateString("fr-FR",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"});return t.jsx(ca,{pageTitle:"Suivi des collectes",currentPage:"tracking",notifications:[],children:t.jsxs("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8",children:[t.jsxs("div",{className:"relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600 p-8 text-white",children:[t.jsxs("div",{className:"absolute inset-0 opacity-10",children:[t.jsx("div",{className:"absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white blur-3xl"}),t.jsx("div",{className:"absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-emerald-300 blur-3xl"})]}),t.jsxs("div",{className:"relative",children:[t.jsxs("div",{className:"flex items-center justify-between mb-6",children:[t.jsxs("div",{className:"flex items-center gap-4",children:[t.jsx("div",{className:"h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center",children:t.jsx(ux,{className:"h-8 w-8 text-white"})}),t.jsxs("div",{children:[t.jsx("h1",{className:"text-3xl font-bold mb-2",children:"Suivi des collectes"}),t.jsx("p",{className:"text-white/90",children:"Suivez en temps réel l'avancement de vos collectes"})]})]}),t.jsx("div",{className:"bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3",children:t.jsxs("div",{className:"flex items-center gap-3",children:[t.jsx(Vt,{className:"h-5 w-5 text-green-300"}),t.jsxs("div",{children:[t.jsx("p",{className:"text-sm opacity-90",children:"Impact total"}),t.jsxs("p",{className:"text-xl font-bold",children:[L.totalWaste," kg recyclés"]})]})]})})]}),t.jsxs("div",{className:"grid grid-cols-2 md:grid-cols-4 gap-4",children:[t.jsxs("div",{className:"bg-white/10 backdrop-blur-sm rounded-xl p-4",children:[t.jsxs("div",{className:"flex items-center gap-3 mb-2",children:[t.jsx("div",{className:"p-2 bg-white/20 rounded-lg",children:t.jsx(De,{className:"h-4 w-4"})}),t.jsx("span",{className:"text-sm opacity-90",children:"Total"})]}),t.jsx("p",{className:"text-2xl font-bold",children:L.total}),t.jsx("p",{className:"text-xs opacity-75",children:"collectes actives"})]}),t.jsxs("div",{className:"bg-white/10 backdrop-blur-sm rounded-xl p-4",children:[t.jsxs("div",{className:"flex items-center gap-3 mb-2",children:[t.jsx("div",{className:"p-2 bg-orange-500/30 rounded-lg",children:t.jsx(na,{className:"h-4 w-4"})}),t.jsx("span",{className:"text-sm opacity-90",children:"En cours"})]}),t.jsx("p",{className:"text-2xl font-bold",children:L.inProgress}),t.jsx("p",{className:"text-xs opacity-75",children:"collecteurs en route"})]}),t.jsxs("div",{className:"bg-white/10 backdrop-blur-sm rounded-xl p-4",children:[t.jsxs("div",{className:"flex items-center gap-3 mb-2",children:[t.jsx("div",{className:"p-2 bg-purple-500/30 rounded-lg",children:t.jsx(at,{className:"h-4 w-4"})}),t.jsx("span",{className:"text-sm opacity-90",children:"Programmées"})]}),t.jsx("p",{className:"text-2xl font-bold",children:L.scheduled}),t.jsx("p",{className:"text-xs opacity-75",children:"rendez-vous fixés"})]}),t.jsxs("div",{className:"bg-white/10 backdrop-blur-sm rounded-xl p-4",children:[t.jsxs("div",{className:"flex items-center gap-3 mb-2",children:[t.jsx("div",{className:"p-2 bg-yellow-500/30 rounded-lg",children:t.jsx(Ys,{className:"h-4 w-4"})}),t.jsx("span",{className:"text-sm opacity-90",children:"Points"})]}),t.jsx("p",{className:"text-2xl font-bold",children:L.totalPoints}),t.jsx("p",{className:"text-xs opacity-75",children:"points gagnés"})]})]})]})]}),t.jsx("div",{className:"bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8",children:t.jsxs("div",{className:"flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4",children:[t.jsx("div",{className:"flex-1",children:t.jsxs("div",{className:"relative",children:[t.jsx(ql,{className:"absolute left-4 top-3.5 h-5 w-5 text-gray-400"}),t.jsx("input",{type:"text",placeholder:"Rechercher par numéro, type de déchet, collecteur...",value:u,onChange:w=>o(w.target.value),className:"w-full pl-12 pr-4 py-3 rounded-xl border-0 bg-gray-50 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-green-600 transition-all"})]})}),t.jsxs("div",{className:"flex flex-wrap gap-3",children:[t.jsxs("select",{value:d,onChange:w=>x(w.target.value),className:"px-4 py-3 rounded-xl border-0 bg-gray-50 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-green-600 transition-all",children:[t.jsx("option",{value:"all",children:"Tous les statuts"}),t.jsx("option",{value:"assigned",children:"Collecteur assigné"}),t.jsx("option",{value:"scheduled",children:"Programmé"}),t.jsx("option",{value:"in_progress",children:"En cours"})]}),t.jsxs("select",{value:b,onChange:w=>m(w.target.value),className:"px-4 py-3 rounded-xl border-0 bg-gray-50 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-green-600 transition-all",children:[t.jsx("option",{value:"date",children:"Plus récent"}),t.jsx("option",{value:"progress",children:"Progression"}),t.jsx("option",{value:"points",children:"Points gagnés"})]}),t.jsxs("div",{className:"flex rounded-xl border border-gray-200 overflow-hidden",children:[t.jsx("button",{onClick:()=>f("list"),className:`px-4 py-2 transition-colors ${N==="list"?"bg-green-600 text-white":"bg-white text-gray-600 hover:bg-gray-50"}`,children:"Liste"}),t.jsx("button",{onClick:()=>f("grid"),className:`px-4 py-2 transition-colors ${N==="grid"?"bg-green-600 text-white":"bg-white text-gray-600 hover:bg-gray-50"}`,children:"Grille"})]})]})]})}),t.jsx("div",{className:N==="list"?"space-y-6":"grid grid-cols-1 md:grid-cols-2 gap-6",children:E.map(w=>{const k=j(w.status),A=k.icon,O=p(w.progress);return N==="list"?t.jsxs("div",{className:"group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300",children:[t.jsx("div",{className:"p-6 border-b border-gray-100",children:t.jsxs("div",{className:"flex items-start justify-between",children:[t.jsxs("div",{className:"flex-1",children:[t.jsxs("div",{className:"flex items-center gap-3 mb-4",children:[t.jsxs("span",{className:"font-mono text-sm bg-gray-100 px-3 py-1.5 rounded-xl text-gray-600",children:["#",w.id]}),t.jsxs("div",{className:`flex items-center gap-1.5 px-3 py-1.5 rounded-xl ${k.bgColor} ${k.textColor}`,children:[t.jsx(A,{className:"h-4 w-4"}),t.jsx("span",{className:"text-sm font-medium",children:k.label})]}),w.status==="in_progress"&&t.jsxs("span",{className:"flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 text-orange-700",children:[t.jsx(Go,{className:"h-4 w-4"}),t.jsx("span",{className:"text-sm font-medium",children:"En route"})]})]}),t.jsxs("div",{className:"flex items-center gap-4 mb-4",children:[t.jsx("div",{className:"flex items-center gap-2",children:w.wasteTypes.map($=>{const Y=g[$];return t.jsxs("div",{className:`flex items-center gap-1 px-2 py-1 rounded-lg ${Y.bgColor}`,children:[t.jsx("span",{className:"text-sm",children:Y.icon}),t.jsx("span",{className:`text-xs font-medium ${Y.textColor}`,children:Y.label})]},$)})}),t.jsxs("div",{className:"flex items-center gap-1",children:[t.jsx(De,{className:"h-4 w-4 text-gray-400"}),t.jsxs("span",{className:"text-sm font-medium text-gray-700",children:[w.quantity," ",w.quantityUnit]})]})]}),t.jsxs("div",{className:"grid grid-cols-3 gap-4",children:[t.jsxs("div",{className:"flex items-center gap-2 text-sm text-gray-500",children:[t.jsx(at,{className:"h-4 w-4"}),t.jsxs("span",{children:["Créé le ",M(w.createdAt)]})]}),w.scheduledDate&&t.jsxs("div",{className:"flex items-center gap-2 text-sm text-gray-500",children:[t.jsx(Qe,{className:"h-4 w-4"}),t.jsxs("span",{children:["Prévu le ",M(w.scheduledDate)]})]}),t.jsxs("div",{className:"flex items-center gap-2 text-sm text-emerald-600",children:[t.jsx(Ys,{className:"h-4 w-4"}),t.jsxs("span",{className:"font-medium",children:[w.ecoPoints," points"]})]})]})]}),t.jsxs("div",{className:"flex items-center gap-2 ml-4",children:[t.jsx("a",{href:`/declaration/${w.id}`,className:"p-3 text-green-600 hover:bg-green-50 rounded-xl transition-colors",title:"Voir les détails",children:t.jsx(ps,{className:"h-5 w-5"})}),t.jsx("a",{href:`/tracking/${w.id}`,className:"p-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors",children:t.jsx($r,{className:"h-5 w-5"})})]})]})}),t.jsx("div",{className:"p-6 bg-gradient-to-br from-gray-50 to-white",children:t.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-4 gap-6",children:[t.jsxs("div",{className:"md:col-span-2",children:[t.jsxs("div",{className:"flex items-center justify-between mb-2",children:[t.jsx("span",{className:"text-sm font-medium text-gray-700",children:"Progression"}),t.jsxs("span",{className:`text-sm font-bold text-${O}-600`,children:[w.progress,"%"]})]}),t.jsx("div",{className:"h-2.5 bg-gray-200 rounded-full overflow-hidden",children:t.jsx("div",{className:`h-full bg-${O}-500 rounded-full transition-all duration-500 relative`,style:{width:`${w.progress}%`},children:t.jsx("div",{className:"absolute inset-0 bg-gradient-to-r from-transparent to-white/20 animate-pulse"})})}),t.jsxs("div",{className:"flex items-center justify-between mt-3 text-xs text-gray-500",children:[t.jsx("span",{children:"Démarrée"}),t.jsx("span",{children:"À mi-chemin"}),t.jsx("span",{children:"Arrivée imminente"})]})]}),t.jsxs("div",{children:[t.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[t.jsx(pa,{className:"h-4 w-4 text-gray-400"}),t.jsx("span",{className:"text-sm font-medium text-gray-700",children:"Position actuelle"})]}),t.jsx("p",{className:"text-sm text-gray-600",children:w.currentLocation}),w.distance&&t.jsxs("p",{className:"text-xs text-gray-500 mt-1",children:["À ",w.distance," de votre position"]})]}),w.estimatedArrival&&t.jsxs("div",{children:[t.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[t.jsx(Ev,{className:"h-4 w-4 text-gray-400"}),t.jsx("span",{className:"text-sm font-medium text-gray-700",children:"Arrivée estimée"})]}),t.jsx("p",{className:"text-sm font-medium text-gray-900",children:new Date(w.estimatedArrival).toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"})}),t.jsxs("p",{className:"text-xs text-gray-500 mt-1",children:[Math.round((new Date(w.estimatedArrival)-new Date)/(1e3*60))," min"]})]})]})}),w.collector&&t.jsx("div",{className:"px-6 py-4 border-t border-gray-100 bg-white",children:t.jsxs("div",{className:"flex items-center justify-between",children:[t.jsxs("div",{className:"flex items-center gap-4",children:[t.jsxs("div",{className:"relative",children:[t.jsx("img",{src:w.collector.photo,alt:w.collector.name,className:"w-12 h-12 rounded-xl object-cover ring-2 ring-white"}),t.jsx("div",{className:"absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center",children:t.jsx(Ov,{className:"h-3 w-3 text-white"})})]}),t.jsxs("div",{children:[t.jsxs("div",{className:"flex items-center gap-2",children:[t.jsx("p",{className:"font-semibold text-gray-900",children:w.collector.name}),t.jsxs("div",{className:"flex items-center gap-1 px-2 py-0.5 bg-yellow-50 rounded-full",children:[t.jsx(Ol,{className:"h-3 w-3 text-yellow-500 fill-current"}),t.jsx("span",{className:"text-xs font-medium text-yellow-700",children:w.collector.rating})]})]}),t.jsxs("div",{className:"flex items-center gap-3 mt-1 text-sm text-gray-500",children:[t.jsx("span",{children:w.collector.vehicle}),t.jsx("span",{className:"w-1 h-1 bg-gray-300 rounded-full"}),t.jsx("span",{children:w.collector.plateNumber})]}),t.jsxs("div",{className:"flex items-center gap-2 mt-1 text-xs text-gray-400",children:[t.jsx(zt,{className:"h-3 w-3"}),t.jsxs("span",{children:[w.collector.totalCollects," collectes • ",w.collector.experience," d'expérience"]})]})]})]}),t.jsxs("div",{className:"flex items-center gap-2",children:[t.jsx("button",{className:"p-3 text-green-600 hover:bg-green-50 rounded-xl transition-colors group",title:"Appeler",children:t.jsx(ia,{className:"h-5 w-5 group-hover:scale-110 transition-transform"})}),t.jsx("button",{className:"p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors group",title:"Message",children:t.jsx(Or,{className:"h-5 w-5 group-hover:scale-110 transition-transform"})}),t.jsx("button",{className:"p-3 text-purple-600 hover:bg-purple-50 rounded-xl transition-colors group",title:"Suivre en direct",children:t.jsx(Pb,{className:"h-5 w-5 group-hover:scale-110 transition-transform"})})]})]})})]},w.id):t.jsx("div",{className:"group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300",children:t.jsxs("div",{className:"p-6",children:[t.jsxs("div",{className:"flex items-center justify-between mb-4",children:[t.jsxs("span",{className:"font-mono text-xs bg-gray-100 px-2 py-1 rounded-lg text-gray-600",children:["#",w.id]}),t.jsxs("div",{className:`flex items-center gap-1 px-2 py-1 rounded-lg ${k.bgColor}`,children:[t.jsx(A,{className:`h-3 w-3 ${k.textColor}`}),t.jsx("span",{className:`text-xs font-medium ${k.textColor}`,children:k.label})]})]}),t.jsx("div",{className:"flex flex-wrap gap-1 mb-4",children:w.wasteTypes.map($=>{const Y=g[$];return t.jsx("div",{className:`px-2 py-1 rounded-lg ${Y.bgColor}`,children:t.jsx("span",{className:"text-xs font-medium ${wasteType.textColor}",children:Y.label})},$)})}),t.jsxs("div",{className:"flex items-center justify-between mb-4",children:[t.jsxs("div",{className:"flex items-center gap-1",children:[t.jsx(De,{className:"h-4 w-4 text-gray-400"}),t.jsxs("span",{className:"text-sm font-medium text-gray-700",children:[w.quantity," ",w.quantityUnit]})]}),t.jsxs("div",{className:"flex items-center gap-1 text-emerald-600",children:[t.jsx(Ys,{className:"h-4 w-4"}),t.jsxs("span",{className:"text-sm font-medium",children:[w.ecoPoints," pts"]})]})]}),t.jsxs("div",{className:"mb-4",children:[t.jsxs("div",{className:"flex items-center justify-between mb-1",children:[t.jsx("span",{className:"text-xs text-gray-500",children:"Progression"}),t.jsxs("span",{className:`text-xs font-bold text-${O}-600`,children:[w.progress,"%"]})]}),t.jsx("div",{className:"h-1.5 bg-gray-200 rounded-full overflow-hidden",children:t.jsx("div",{className:`h-full bg-${O}-500 rounded-full transition-all`,style:{width:`${w.progress}%`}})})]}),w.collector&&t.jsxs("div",{className:"flex items-center gap-2 pt-4 border-t border-gray-100",children:[t.jsx("img",{src:w.collector.photo,alt:w.collector.name,className:"w-8 h-8 rounded-lg object-cover"}),t.jsxs("div",{className:"flex-1 min-w-0",children:[t.jsx("p",{className:"text-sm font-medium text-gray-900 truncate",children:w.collector.name}),t.jsxs("div",{className:"flex items-center gap-1",children:[t.jsx(Ol,{className:"h-3 w-3 text-yellow-500 fill-current"}),t.jsx("span",{className:"text-xs text-gray-500",children:w.collector.rating})]})]}),t.jsx("button",{className:"p-2 text-green-600 hover:bg-green-50 rounded-lg",children:t.jsx(ia,{className:"h-4 w-4"})})]}),t.jsxs("div",{className:"flex gap-2 mt-4",children:[t.jsxs("a",{href:`/declaration/${w.id}`,className:"flex-1 flex items-center justify-center gap-1 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm",children:[t.jsx(ps,{className:"h-4 w-4"}),"Détails"]}),t.jsxs("a",{href:`/tracking/${w.id}`,className:"flex-1 flex items-center justify-center gap-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm",children:[t.jsx(ux,{className:"h-4 w-4"}),"Suivre"]})]})]})},w.id)})}),E.length===0&&t.jsxs("div",{className:"text-center py-16 bg-white rounded-2xl border border-gray-100",children:[t.jsxs("div",{className:"relative inline-flex mb-6",children:[t.jsx("div",{className:"absolute inset-0 rounded-full bg-gray-200 animate-ping opacity-20"}),t.jsx("div",{className:"relative w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center",children:t.jsx(De,{className:"h-8 w-8 text-gray-400"})})]}),t.jsx("h3",{className:"text-lg font-semibold text-gray-900 mb-2",children:"Aucune collecte en cours"}),t.jsx("p",{className:"text-gray-500 mb-6",children:"Les collectes que vous déclarez apparaîtront ici en temps réel"}),t.jsxs("a",{href:"/declare",className:"inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-medium rounded-xl hover:shadow-lg transition-all hover:scale-105",children:[t.jsx(Plus,{className:"h-5 w-5"}),"Déclarer une collecte"]})]}),E.length>0&&t.jsxs("div",{className:"mt-8 flex items-center justify-between",children:[t.jsxs("p",{className:"text-sm text-gray-500",children:["Affichage de ",t.jsx("span",{className:"font-medium",children:E.length})," collectes"]}),t.jsxs("div",{className:"flex gap-2",children:[t.jsx("button",{className:"px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50",disabled:!0,children:"Précédent"}),t.jsx("button",{className:"px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors",children:"Suivant"})]})]})]})})},ey=()=>{const[i]=v.useState([{id:"DEC-123456",wasteTypes:["plastic","paper"],quantity:"5.2",quantityUnit:"kg",status:"in_progress",createdAt:"2024-01-15T10:30:00Z",scheduledDate:"2024-01-15T14:00:00Z",collector:{name:"Paul Mbarga",rating:4.8},actualWeight:null,pointsEarned:null},{id:"DEC-123455",wasteTypes:["glass"],quantity:"3",quantityUnit:"kg",status:"pending",createdAt:"2024-01-14T16:20:00Z",scheduledDate:null,collector:null,actualWeight:null,pointsEarned:null},{id:"DEC-123454",wasteTypes:["metal","electronic"],quantity:"8",quantityUnit:"kg",status:"completed",createdAt:"2024-01-13T09:15:00Z",scheduledDate:"2024-01-13T11:00:00Z",collector:{name:"Marie Tchuenté",rating:4.9},actualWeight:7.8,pointsEarned:25},{id:"DEC-123453",wasteTypes:["organic"],quantity:"4",quantityUnit:"bags",status:"completed",createdAt:"2024-01-12T14:30:00Z",scheduledDate:"2024-01-12T16:00:00Z",collector:{name:"Jean Pierre",rating:4.7},actualWeight:12.5,pointsEarned:18},{id:"DEC-123452",wasteTypes:["plastic","metal"],quantity:"6.5",quantityUnit:"kg",status:"completed",createdAt:"2024-01-11T08:45:00Z",scheduledDate:"2024-01-11T10:30:00Z",collector:{name:"Sophie Ngono",rating:4.6},actualWeight:6.3,pointsEarned:22},{id:"DEC-123451",wasteTypes:["paper"],quantity:"12",quantityUnit:"kg",status:"completed",createdAt:"2024-01-10T11:20:00Z",scheduledDate:"2024-01-10T13:00:00Z",collector:{name:"Alain Foe",rating:4.8},actualWeight:11.8,pointsEarned:20},{id:"DEC-123450",wasteTypes:["glass","plastic"],quantity:"4.2",quantityUnit:"kg",status:"completed",createdAt:"2024-01-09T15:30:00Z",scheduledDate:"2024-01-09T17:00:00Z",collector:{name:"Estelle Mballa",rating:4.9},actualWeight:4,pointsEarned:15},{id:"DEC-123449",wasteTypes:["electronic"],quantity:"2",quantityUnit:"units",status:"completed",createdAt:"2024-01-08T09:00:00Z",scheduledDate:"2024-01-08T11:30:00Z",collector:{name:"Michel Kamga",rating:4.5},actualWeight:3.2,pointsEarned:30}]),[u,o]=v.useState(""),[d,x]=v.useState("all"),[b,m]=v.useState("all"),N={plastic:{label:"Plastique",icon:"♻️",color:"blue"},paper:{label:"Papier / Carton",icon:"📄",color:"yellow"},metal:{label:"Métal",icon:"🔧",color:"gray"},glass:{label:"Verre",icon:"🍾",color:"green"},organic:{label:"Déchets organiques",icon:"🌱",color:"orange"},electronic:{label:"Déchets électroniques",icon:"📱",color:"purple"}},f=M=>({pending:"amber",assigned:"blue",scheduled:"purple",in_progress:"orange",completed:"green"})[M]||"gray",g=M=>({pending:"En attente",assigned:"Assigné",scheduled:"Programmé",in_progress:"En cours",completed:"Terminé"})[M]||"Inconnu",j=M=>({pending:Qe,assigned:ta,scheduled:at,in_progress:De,completed:Ce})[M]||Qe,p=i.filter(M=>{const w=M.id.toLowerCase().includes(u.toLowerCase())||M.wasteTypes.some(O=>N[O].label.toLowerCase().includes(u.toLowerCase())),k=d==="all"||M.status===d,A=b==="all"||b==="week"&&new Date(M.createdAt)>new Date(Date.now()-10080*60*1e3)||b==="month"&&new Date(M.createdAt)>new Date(Date.now()-720*60*60*1e3);return w&&k&&A}),E={total:i.length,completed:i.filter(M=>M.status==="completed").length,pending:i.filter(M=>M.status==="pending").length,inProgress:i.filter(M=>M.status==="in_progress").length,totalWeight:i.filter(M=>M.actualWeight).reduce((M,w)=>M+w.actualWeight,0),totalPoints:i.filter(M=>M.pointsEarned).reduce((M,w)=>M+w.pointsEarned,0)},L=()=>{alert("Export des données en cours...")};return t.jsx(ca,{pageTitle:"Historique des déclarations",currentPage:"history",notifications:[],children:t.jsxs("div",{className:"max-w-4xl lg:max-w-6xl mx-auto",children:[t.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8",children:[t.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-gray-200 p-6",children:[t.jsxs("div",{className:"flex items-center justify-between mb-4",children:[t.jsx("div",{className:"w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center",children:t.jsx(pi,{className:"w-6 h-6 text-blue-600"})}),t.jsx("span",{className:"text-2xl font-bold text-gray-900",children:E.total})]}),t.jsx("p",{className:"text-gray-600 font-medium",children:"Total déclarations"}),t.jsx("p",{className:"text-sm text-gray-500 mt-1",children:"Depuis le début"})]}),t.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-gray-200 p-6",children:[t.jsxs("div",{className:"flex items-center justify-between mb-4",children:[t.jsx("div",{className:"w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center",children:t.jsx(Ce,{className:"w-6 h-6 text-green-600"})}),t.jsx("span",{className:"text-2xl font-bold text-gray-900",children:E.completed})]}),t.jsx("p",{className:"text-gray-600 font-medium",children:"Collectes terminées"}),t.jsx("p",{className:"text-sm text-gray-500 mt-1",children:"Avec succès"})]}),t.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-gray-200 p-6",children:[t.jsxs("div",{className:"flex items-center justify-between mb-4",children:[t.jsx("div",{className:"w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center",children:t.jsx(De,{className:"w-6 h-6 text-orange-600"})}),t.jsx("span",{className:"text-2xl font-bold text-gray-900",children:E.totalWeight.toFixed(1)})]}),t.jsx("p",{className:"text-gray-600 font-medium",children:"Poids total collecté"}),t.jsx("p",{className:"text-sm text-gray-500 mt-1",children:"Kilogrammes"})]}),t.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-gray-200 p-6",children:[t.jsxs("div",{className:"flex items-center justify-between mb-4",children:[t.jsx("div",{className:"w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center",children:t.jsx(Hr,{className:"w-6 h-6 text-purple-600"})}),t.jsx("span",{className:"text-2xl font-bold text-gray-900",children:E.totalPoints})]}),t.jsx("p",{className:"text-gray-600 font-medium",children:"Points cumulés"}),t.jsx("p",{className:"text-sm text-gray-500 mt-1",children:"Récompenses"})]})]}),t.jsx("div",{className:"bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6",children:t.jsxs("div",{className:"flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4",children:[t.jsx("div",{className:"flex-1",children:t.jsxs("div",{className:"relative",children:[t.jsx(ql,{className:"absolute left-3 top-3 w-4 h-4 text-gray-400"}),t.jsx("input",{type:"text",placeholder:"Rechercher par numéro, type de déchet...",value:u,onChange:M=>o(M.target.value),className:"w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"})]})}),t.jsxs("div",{className:"flex flex-col sm:flex-row gap-3",children:[t.jsxs("select",{value:d,onChange:M=>x(M.target.value),className:"px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent",children:[t.jsx("option",{value:"all",children:"Tous les statuts"}),t.jsx("option",{value:"pending",children:"En attente"}),t.jsx("option",{value:"in_progress",children:"En cours"}),t.jsx("option",{value:"completed",children:"Terminé"})]}),t.jsxs("select",{value:b,onChange:M=>m(M.target.value),className:"px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent",children:[t.jsx("option",{value:"all",children:"Toutes les dates"}),t.jsx("option",{value:"week",children:"Cette semaine"}),t.jsx("option",{value:"month",children:"Ce mois"})]}),t.jsxs("button",{onClick:L,className:"flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors",children:[t.jsx(Fo,{className:"w-4 h-4"}),"Exporter"]})]})]})}),t.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-gray-200",children:[t.jsx("div",{className:"p-6 border-b border-gray-200",children:t.jsxs("div",{className:"flex items-center justify-between",children:[t.jsxs("h2",{className:"text-lg font-semibold text-gray-900 flex items-center gap-2",children:[t.jsx(ft,{className:"w-5 h-5 text-green-600"}),"Liste des déclarations (",p.length,")"]}),t.jsxs("div",{className:"text-sm text-gray-500",children:[p.length," résultat",p.length>1?"s":""]})]})}),t.jsx("div",{className:"divide-y divide-gray-200",children:p.map(M=>{j(M.status);const w=f(M.status);return t.jsx("div",{className:"p-6 hover:bg-gray-50 transition-colors",children:t.jsxs("div",{className:"flex items-start justify-between",children:[t.jsxs("div",{className:"flex-1",children:[t.jsxs("div",{className:"flex items-center gap-3 mb-3",children:[t.jsxs("span",{className:"font-mono text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded",children:["#",M.id]}),t.jsx("span",{className:`px-2 py-1 rounded-full text-xs font-medium bg-${w}-100 text-${w}-800`,children:g(M.status)})]}),t.jsxs("div",{className:"flex items-center gap-4 mb-3",children:[t.jsx("div",{className:"flex items-center gap-2",children:M.wasteTypes.map(k=>{const A=N[k];return t.jsx("span",{className:"text-lg",title:A.label,children:A.icon},k)})}),t.jsxs("span",{className:"text-sm font-medium text-gray-700",children:[M.quantity," ",M.quantityUnit==="kg"?"kg":M.quantityUnit==="bags"?"sacs":"unités"]})]}),t.jsxs("div",{className:"flex items-center gap-6 text-sm text-gray-500",children:[t.jsxs("div",{className:"flex items-center gap-1",children:[t.jsx(at,{className:"w-3 h-3"}),new Date(M.createdAt).toLocaleDateString("fr-FR")]}),M.scheduledDate&&t.jsxs("div",{className:"flex items-center gap-1",children:[t.jsx(Qe,{className:"w-3 h-3"}),new Date(M.scheduledDate).toLocaleDateString("fr-FR")]}),M.collector&&t.jsxs("div",{className:"flex items-center gap-1",children:[t.jsx(ta,{className:"w-3 h-3"}),M.collector.name,t.jsxs("div",{className:"flex items-center gap-1",children:[t.jsx(Ol,{className:"w-3 h-3 text-yellow-500 fill-current"}),t.jsx("span",{children:M.collector.rating})]})]})]}),M.status==="completed"&&t.jsxs("div",{className:"mt-3 pt-3 border-t border-gray-100 flex items-center gap-4 text-sm",children:[t.jsxs("span",{className:"text-green-600 font-medium",children:[t.jsx(Ce,{className:"w-3 h-3 inline mr-1"}),"Poids: ",M.actualWeight," kg"]}),t.jsxs("span",{className:"text-purple-600 font-medium",children:["+",M.pointsEarned," points"]})]})]}),t.jsxs("div",{className:"flex items-center gap-2 ml-4",children:[t.jsxs("a",{href:`/declaration/${M.id}`,className:"flex items-center gap-1 text-green-600 hover:text-green-700 transition-colors",children:[t.jsx(ps,{className:"w-4 h-4"}),t.jsx("span",{className:"text-sm font-medium",children:"Détails"})]}),t.jsx("a",{href:`/tracking/${M.id}`,className:"flex items-center gap-1 text-gray-600 hover:text-gray-700 transition-colors",children:t.jsx($r,{className:"w-4 h-4"})})]})]})},M.id)})}),p.length===0&&t.jsxs("div",{className:"text-center py-12",children:[t.jsx(ft,{className:"w-16 h-16 text-gray-300 mx-auto mb-4"}),t.jsx("p",{className:"text-gray-500",children:"Aucune déclaration trouvée"}),t.jsx("p",{className:"text-sm text-gray-400 mt-1",children:"Essayez de modifier vos filtres de recherche"})]})]})]})})},ty=()=>{const[i]=v.useState({id:"DEC-123456",wasteTypes:["plastic","paper"],quantity:"5.2",quantityUnit:"kg",collectionMode:"home",specialInstructions:"Sonnette à droite, portail bleu",createdAt:"2024-01-15T10:30:00Z",updatedAt:"2024-01-15T10:35:00Z",status:"completed",collector:{id:"COL-789",name:"Paul Mbarga",phone:"+237 698 234 567",email:"paul.mbarga@ecocollect.cm",photo:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",rating:4.8,vehicle:"Camionnette bennes",plateNumber:"CE 1234 AB"},scheduledDate:"2024-01-15T14:00:00Z",estimatedDuration:"30 minutes",actualWeight:5.1,pointsEarned:25,completionTime:"2024-01-15T14:32:00Z",photos:["https://images.unsplash.com/photo-1584292995402-4bc5f973b66?w=300&h=200&fit=crop","https://images.unsplash.com/photo-1584292995402-4bc5f973b66?w=300&h=200&fit=crop","https://images.unsplash.com/photo-1584292995402-4bc5f973b66?w=300&h=200&fit=crop"],notes:["Collecte effectuée avec succès","Client satisfait du service","Déchets bien triés"]}),[u,o]=v.useState("details"),[d,x]=v.useState(!1),b={plastic:{label:"Plastique",icon:"♻️",color:"blue"},paper:{label:"Papier / Carton",icon:"📄",color:"yellow"},metal:{label:"Métal",icon:"🔧",color:"gray"},glass:{label:"Verre",icon:"🍾",color:"green"},organic:{label:"Déchets organiques",icon:"🌱",color:"orange"},electronic:{label:"Déchets électroniques",icon:"📱",color:"purple"}},m=p=>({pending:"amber",assigned:"blue",scheduled:"purple",in_progress:"orange",completed:"green"})[p]||"gray",N=p=>({pending:"En attente d'affectation",assigned:"Collecteur affecté",scheduled:"Collecte programmée",in_progress:"En cours de collecte",completed:"Collecte effectuée"})[p]||"Inconnu",f=()=>{navigator.share?navigator.share({title:`Déclaration ${i.id}`,text:`Ma déclaration ${i.id} a été ${N(i.status)}`,url:window.location.href}):alert("Lien copié dans le presse-papiers")},g=()=>{alert("Téléchargement du reçu en cours...")},j=()=>{x(!d)};return t.jsx(ca,{pageTitle:`Détails - ${i.id}`,currentPage:"details",notifications:[],children:t.jsxs("div",{className:"max-w-4xl lg:max-w-6xl mx-auto px-2 sm:px-0",children:[t.jsx("div",{className:"bg-white rounded-2xl shadow-lg p-6 mb-6",children:t.jsxs("div",{className:"flex items-center justify-between",children:[t.jsxs("div",{className:"flex items-center gap-4",children:[t.jsxs("a",{href:"/history",className:"flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors",children:[t.jsx(Gs,{className:"w-5 h-5"}),"Retour à l'historique"]}),t.jsxs("div",{className:"flex items-center gap-3",children:[t.jsx(De,{className:"w-8 h-8 text-green-600"}),t.jsxs("div",{children:[t.jsx("h1",{className:"text-2xl font-bold text-gray-900",children:"Détails de la déclaration"}),t.jsxs("p",{className:"text-gray-600",children:["#",i.id]})]})]})]}),t.jsxs("div",{className:"flex items-center gap-3",children:[t.jsx("span",{className:`px-4 py-2 rounded-full bg-${m(i.status)}-100 text-${m(i.status)}-800 font-medium`,children:N(i.status)}),t.jsx("button",{onClick:j,className:"p-2 rounded-lg hover:bg-gray-100 transition-colors",children:t.jsx(Bx,{className:"w-4 h-4 text-gray-600"})})]})]})}),t.jsxs("div",{className:"bg-white rounded-2xl shadow-lg p-6 mb-6",children:[t.jsx("div",{className:"border-b border-gray-200",children:t.jsxs("div",{className:"flex",children:[t.jsx("button",{onClick:()=>o("details"),className:`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${u==="details"?"border-green-500 text-green-600":"border-transparent text-gray-500 hover:text-gray-700"}`,children:"Informations générales"}),t.jsx("button",{onClick:()=>o("timeline"),className:`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${u==="timeline"?"border-green-500 text-green-600":"border-transparent text-gray-500 hover:text-gray-700"}`,children:"Timeline"}),t.jsx("button",{onClick:()=>o("photos"),className:`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${u==="photos"?"border-green-500 text-green-600":"border-transparent text-gray-500 hover:text-gray-700"}`,children:"Photos"}),t.jsx("button",{onClick:()=>o("notes"),className:`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${u==="notes"?"border-green-500 text-green-600":"border-transparent text-gray-500 hover:text-gray-700"}`,children:"Notes"})]})}),t.jsxs("div",{className:"p-6",children:[u==="details"&&t.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-6",children:[t.jsx("div",{className:"space-y-6",children:t.jsxs("div",{children:[t.jsxs("h3",{className:"text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2",children:[t.jsx(ft,{className:"w-5 h-5 text-green-600"}),"Informations de la déclaration"]}),t.jsxs("div",{className:"space-y-4",children:[t.jsxs("div",{children:[t.jsx("p",{className:"text-sm text-gray-600",children:"Types de déchets"}),t.jsxs("div",{className:"flex items-center gap-2 mt-1",children:[i.wasteTypes.map(p=>{const E=b[p];return t.jsx("span",{className:"text-lg",title:E.label,children:E.icon},p)}),t.jsxs("span",{className:"text-sm font-medium text-gray-700",children:[i.quantity," ",i.quantityUnit==="kg"?"kg":i.quantityUnit==="bags"?"sacs":"unités"]})]})]}),t.jsxs("div",{children:[t.jsx("p",{className:"text-sm text-gray-600",children:"Mode de collecte"}),t.jsxs("div",{className:"flex items-center gap-2 mt-1",children:[t.jsx(pa,{className:"w-4 h-4 text-gray-400"}),t.jsx("span",{className:"text-sm text-gray-700",children:i.collectionMode==="home"?"Collecte à domicile":"Dépôt volontaire"})]})]}),t.jsxs("div",{children:[t.jsx("p",{className:"text-sm text-gray-600",children:"Date de création"}),t.jsxs("div",{className:"flex items-center gap-2 mt-1",children:[t.jsx(at,{className:"w-4 h-4 text-gray-400"}),t.jsx("span",{className:"text-sm text-gray-700",children:new Date(i.createdAt).toLocaleString("fr-FR")})]})]}),i.specialInstructions&&t.jsxs("div",{children:[t.jsx("p",{className:"text-sm text-gray-600",children:"Instructions spéciales"}),t.jsx("p",{className:"text-sm text-gray-700 bg-gray-50 rounded-lg p-3 mt-1",children:i.specialInstructions})]})]})]})}),i.collector&&t.jsxs("div",{className:"space-y-6",children:[t.jsxs("h3",{className:"text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2",children:[t.jsx(ct,{className:"w-5 h-5 text-green-600"}),"Informations du collecteur"]}),t.jsxs("div",{className:"space-y-4",children:[t.jsxs("div",{className:"text-center",children:[t.jsx("img",{src:i.collector.photo,alt:i.collector.name,className:"w-24 h-24 rounded-full mx-auto mb-4 object-cover"}),t.jsx("h4",{className:"font-semibold text-gray-900 text-lg",children:i.collector.name}),t.jsxs("div",{className:"flex items-center justify-center gap-1 mt-1",children:[t.jsx(Ol,{className:"w-4 h-4 text-yellow-500 fill-current"}),t.jsx("span",{className:"text-sm text-gray-600",children:i.collector.rating})]})]}),t.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-4",children:[t.jsxs("div",{children:[t.jsx("p",{className:"text-sm text-gray-600",children:"Téléphone"}),t.jsxs("div",{className:"flex items-center gap-2 mt-1",children:[t.jsx(ia,{className:"w-4 h-4 text-gray-400"}),t.jsx("span",{className:"text-sm text-gray-700",children:i.collector.phone})]})]}),t.jsxs("div",{children:[t.jsx("p",{className:"text-sm text-gray-600",children:"Email"}),t.jsxs("div",{className:"flex items-center gap-2 mt-1",children:[t.jsx(Or,{className:"w-4 h-4 text-gray-400"}),t.jsx("span",{className:"text-sm text-gray-700",children:i.collector.email})]})]}),t.jsxs("div",{children:[t.jsx("p",{className:"text-sm text-gray-600",children:"Véhicule"}),t.jsxs("div",{className:"flex items-center gap-2 mt-1",children:[t.jsx(De,{className:"w-4 h-4 text-gray-400"}),t.jsx("span",{className:"text-sm text-gray-700",children:i.collector.vehicle})]})]}),t.jsxs("div",{children:[t.jsx("p",{className:"text-sm text-gray-600",children:"Plaque"}),t.jsxs("div",{className:"flex items-center gap-2 mt-1",children:[t.jsx($s,{className:"w-4 h-4 text-gray-400"}),t.jsx("span",{className:"text-sm text-gray-700",children:i.collector.plateNumber})]})]})]}),t.jsx("div",{className:"mt-6 pt-6 border-t",children:t.jsxs("div",{className:"flex gap-3",children:[t.jsxs("button",{className:"flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors",children:[t.jsx(ia,{className:"w-4 h-4"}),"Contacter"]}),t.jsxs("button",{className:"flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors",children:[t.jsx(Or,{className:"w-4 h-4"}),"Message"]})]})})]})]}),i.status==="completed"&&t.jsxs("div",{className:"space-y-6",children:[t.jsxs("h3",{className:"text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2",children:[t.jsx(Ce,{className:"w-5 h-5 text-green-600"}),"Résultats de la collecte"]}),t.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-6",children:[t.jsxs("div",{children:[t.jsx("p",{className:"text-sm text-gray-600",children:"Poids réel"}),t.jsxs("div",{className:"flex items-center gap-2 mt-1",children:[t.jsx($s,{className:"w-4 h-4 text-gray-400"}),t.jsxs("span",{className:"text-lg font-bold text-gray-900",children:[i.actualWeight," kg"]})]})]}),t.jsxs("div",{children:[t.jsx("p",{className:"text-sm text-gray-600",children:"Points gagnés"}),t.jsxs("div",{className:"flex items-center gap-2 mt-1",children:[t.jsx(zt,{className:"w-4 h-4 text-gray-400"}),t.jsxs("span",{className:"text-lg font-bold text-green-600",children:["+",i.pointsEarned," points"]})]})]}),t.jsxs("div",{children:[t.jsx("p",{className:"text-sm text-gray-600",children:"Temps de collecte"}),t.jsxs("div",{className:"flex items-center gap-2 mt-1",children:[t.jsx(Qe,{className:"w-4 h-4 text-gray-400"}),t.jsx("span",{className:"text-sm text-gray-700",children:i.completionTime&&`${new Date(i.completionTime).toLocaleString("fr-FR",{hour:"2-digit",minute:"2-digit"})}`})]})]})]})]})]}),u==="timeline"&&t.jsxs("div",{children:[t.jsxs("h3",{className:"text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2",children:[t.jsx(Qe,{className:"w-5 h-5 text-green-600"}),"Timeline de la déclaration"]}),t.jsxs("div",{className:"space-y-6",children:[t.jsxs("div",{className:"flex gap-4",children:[t.jsxs("div",{className:"flex flex-col items-center",children:[t.jsx("div",{className:"w-10 h-10 rounded-full bg-green-100 flex items-center justify-center",children:t.jsx(Qe,{className:"w-5 h-5 text-green-600"})}),t.jsx("div",{className:"w-0.5 h-16 bg-green-200"})]}),t.jsxs("div",{className:"flex-1",children:[t.jsx("h4",{className:"font-semibold text-gray-900",children:"Déclaration créée"}),t.jsx("p",{className:"text-sm text-gray-600 mt-1",children:new Date(i.createdAt).toLocaleString("fr-FR")})]})]}),t.jsxs("div",{className:"flex gap-4",children:[t.jsxs("div",{className:"flex flex-col items-center",children:[t.jsx("div",{className:"w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center",children:t.jsx(ct,{className:"w-5 h-5 text-blue-600"})}),t.jsx("div",{className:"w-0.5 h-16 bg-blue-200"})]}),t.jsxs("div",{className:"flex-1",children:[t.jsx("h4",{className:"font-semibold text-gray-900",children:"Collecteur affecté"}),t.jsxs("p",{className:"text-sm text-gray-600 mt-1",children:[i.collector?.name," a été assigné à votre demande"]})]})]}),t.jsxs("div",{className:"flex gap-4",children:[t.jsxs("div",{className:"flex flex-col items-center",children:[t.jsx("div",{className:"w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center",children:t.jsx(at,{className:"w-5 h-5 text-purple-600"})}),t.jsx("div",{className:"w-0.5 h-16 bg-purple-200"})]}),t.jsxs("div",{className:"flex-1",children:[t.jsx("h4",{className:"font-semibold text-gray-900",children:"Collecte programmée"}),t.jsxs("p",{className:"text-sm text-gray-600 mt-1",children:["Rendez-vous fixé pour le ",new Date(i.scheduledDate).toLocaleString("fr-FR")]})]})]}),t.jsxs("div",{className:"flex gap-4",children:[t.jsxs("div",{className:"flex flex-col items-center",children:[t.jsx("div",{className:"w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center",children:t.jsx(De,{className:"w-5 h-5 text-orange-600"})}),t.jsx("div",{className:"w-0.5 h-16 bg-orange-200"})]}),t.jsxs("div",{className:"flex-1",children:[t.jsx("h4",{className:"font-semibold text-gray-900",children:"En cours de collecte"}),t.jsx("p",{className:"text-sm text-gray-600 mt-1",children:"Le collecteur est en route"})]})]}),t.jsxs("div",{className:"flex gap-4",children:[t.jsx("div",{className:"flex flex-col items-center",children:t.jsx("div",{className:"w-10 h-10 rounded-full bg-green-100 flex items-center justify-center",children:t.jsx(Ce,{className:"w-5 h-5 text-green-600"})})}),t.jsxs("div",{className:"flex-1",children:[t.jsx("h4",{className:"font-semibold text-gray-900",children:"Collecte effectuée"}),t.jsx("p",{className:"text-sm text-gray-600 mt-1",children:"La collecte a été réalisée avec succès"}),t.jsxs("p",{className:"text-sm text-green-600 font-medium mt-1",children:["Poids: ",i.actualWeight," kg • Points: +",i.pointsEarned]})]})]})]})]}),u==="photos"&&t.jsxs("div",{children:[t.jsxs("h3",{className:"text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2",children:[t.jsx(De,{className:"w-5 h-5 text-green-600"}),"Photos de la collecte"]}),t.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",children:i.photos.map((p,E)=>t.jsxs("div",{className:"relative group",children:[t.jsx("img",{src:p,alt:`Photo ${E+1} de la collecte`,className:"w-full h-48 object-cover rounded-lg"}),t.jsx("div",{className:"absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center",children:t.jsx(De,{className:"w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity"})})]},E))})]}),u==="notes"&&t.jsxs("div",{children:[t.jsxs("h3",{className:"text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2",children:[t.jsx(Or,{className:"w-5 h-5 text-green-600"}),"Notes de la collecte"]}),t.jsx("div",{className:"space-y-4",children:i.notes.map((p,E)=>t.jsxs("div",{className:"bg-gray-50 rounded-lg p-4",children:[t.jsxs("div",{className:"flex items-start justify-between mb-2",children:[t.jsxs("span",{className:"text-sm text-gray-500",children:[new Date().toLocaleDateString("fr-FR")," - Note ",E+1]}),t.jsxs("span",{className:"text-xs text-gray-400",children:["Par: ",i.collector?.name||"Système"]})]}),t.jsx("p",{className:"text-sm text-gray-700",children:p})]},E))})]})]})]}),t.jsx("div",{className:"bg-white rounded-2xl shadow-lg p-6",children:t.jsxs("div",{className:"flex flex-col sm:flex-row gap-4",children:[t.jsxs("button",{onClick:f,className:"flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors",children:[t.jsx(hv,{className:"w-4 h-4"}),"Partager"]}),t.jsxs("button",{onClick:g,className:"flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors",children:[t.jsx(Fo,{className:"w-4 h-4"}),"Télécharger le reçu"]}),t.jsxs("a",{href:"/tracking/DEC-123456",className:"flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors",children:[t.jsx(De,{className:"w-4 h-4"}),"Suivi en temps réel"]})]})})]})})},ay=()=>{const[i,u]=v.useState("available"),[o]=v.useState(480),[d]=v.useState("Éco-Héros"),[x]=v.useState(750),b=[{id:1,title:"Sac de courses réutilisable",description:"Sac en coton bio avec logo EcoCollect",points:100,category:"shopping",icon:Vo,image:"https://images.unsplash.com/photo-1553060575-8a8c4b8a5a7c?w=200&h=200&fit=crop",stock:15,popular:!0},{id:2,title:"Kit de jardinage écologique",description:"Outils de jardinage en matériaux recyclés",points:250,category:"garden",icon:Vt,image:"https://images.unsplash.com/photo-1416879595962-4e6e6496c3b4?w=200&h=200&fit=crop",stock:8,popular:!1},{id:3,title:"Bouteille isotherme réutilisable",description:"Gourde isotherme 750ml avec bouchon en liège",points:150,category:"daily",icon:bs,image:"https://images.unsplash.com/photo-1600480144945-fc527599c8c2?w=200&h=200&fit=crop",stock:25,popular:!0},{id:4,title:"Set de stylos recyclés",description:"4 stylos faits à partir de plastique recyclé",points:80,category:"office",icon:Gv,image:"https://images.unsplash.com/photo-1586953208475-12018a8a3b8?w=200&h=200&fit=crop",stock:50,popular:!1},{id:5,title:"Tote bag éco-responsable",description:"Sac en jute avec motif environnemental",points:120,category:"shopping",icon:Vo,image:"https://images.unsplash.com/photo-1553060575-8a8c4b8a5a7c?w=200&h=200&fit=crop",stock:30,popular:!1},{id:6,title:"Boîte de compost de cuisine",description:"Boîte en bambou pour compost domestique",points:200,category:"garden",icon:Vt,image:"https://images.unsplash.com/photo-1586953208475-12018a8a3b8?w=200&h=200&fit=crop",stock:12,popular:!0}],m=[{id:101,title:"Sac de courses réutilisable",description:"Récupéré le 15 janvier 2024",points:100,category:"shopping",icon:Vo,image:"https://images.unsplash.com/photo-1553060575-8a8c4b8a5a7c?w=200&h=200&fit=crop",redeemedAt:"2024-01-15"},{id:102,title:"Bouteille isotherme réutilisable",description:"Récupéré le 10 janvier 2024",points:150,category:"daily",icon:bs,image:"https://images.unsplash.com/photo-1600480144945-fc527599c8c2?w=200&h=200&fit=crop",redeemedAt:"2024-01-10"}],N=[{name:"Débutant Éco",minPoints:0,maxPoints:99,icon:Tb,color:"gray",benefits:["Accès aux récompenses de base","Badge de participation"]},{name:"Légende Éco",minPoints:1e3,maxPoints:1/0,icon:yb,color:"yellow",benefits:["Récompenses personnalisées","Programme fidélité premium","Reconnaissance publique"]}],f=N.find(p=>o>=p.minPoints&&o<=p.maxPoints)||N[0],g=(o-f.minPoints)/(f.maxPoints-f.minPoints)*100,j=p=>{const E=b.find(L=>L.id===p);E&&o>=E.points?alert(`Félicitations ! Vous avez échangé ${E.points} points contre "${E.title}"`):alert("Points insuffisants pour cette récompense")};return t.jsx(ca,{pageTitle:"Mes Récompenses",currentPage:"rewards",notifications:[],children:t.jsxs("div",{className:"max-w-4xl lg:max-w-6xl mx-auto px-2 sm:px-0",children:[t.jsx("div",{className:"bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-6 text-white mb-8",children:t.jsxs("div",{className:"flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6",children:[t.jsxs("div",{children:[t.jsx("h1",{className:"text-3xl font-bold mb-2",children:"Mes Récompenses"}),t.jsx("p",{className:"text-purple-100 max-w-2xl",children:"Transformez vos points écologiques en récompenses concrètes et contribuez à un avenir durable."})]}),t.jsx("div",{className:"hidden lg:block",children:t.jsxs("div",{className:"bg-white/20 backdrop-blur-sm rounded-xl p-4 min-w-[200px]",children:[t.jsxs("div",{className:"flex items-center gap-3 mb-3",children:[t.jsx(Dv,{className:"w-6 h-6"}),t.jsxs("div",{children:[t.jsx("div",{className:"font-medium",children:"Niveau actuel"}),t.jsx("div",{className:"text-2xl font-bold",children:f.name})]})]}),t.jsxs("div",{className:"text-sm text-purple-100",children:[o," points"]}),t.jsx("div",{className:"w-full bg-white/30 rounded-full h-2 mt-2",children:t.jsx("div",{className:"bg-white h-2 rounded-full transition-all duration-500",style:{width:`${g}%`}})}),t.jsxs("div",{className:"text-xs text-purple-100 mt-1",children:[x-o," points pour le niveau suivant"]})]})})]})}),t.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8",children:[t.jsxs("h2",{className:"text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2",children:[t.jsx(Vx,{className:"w-5 h-5 text-purple-600"}),"Parcours Écologique"]}),t.jsx("div",{className:"grid grid-cols-1 md:grid-cols-5 gap-4",children:N.map((p,E)=>{const L=p.icon,M=p.name===d,w=o>=p.maxPoints,k=o<p.minPoints;return t.jsxs("div",{className:`
                    text-center p-4 rounded-lg border-2 transition-all
                    ${M?"border-purple-500 bg-purple-50 shadow-md":w?"border-green-500 bg-green-50":k?"border-gray-200 bg-gray-50 opacity-50":"border-gray-200 hover:border-gray-300"}
                  `,children:[t.jsx("div",{className:`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${M?"bg-purple-600":w?"bg-green-600":k?"bg-gray-300":"bg-gray-400"}`,children:t.jsx(L,{className:`w-6 h-6 ${M||w?"text-white":"text-gray-600"}`})}),t.jsx("h3",{className:`font-semibold text-sm ${M?"text-purple-900":w?"text-green-900":k?"text-gray-500":"text-gray-700"}`,children:p.name}),t.jsxs("p",{className:`text-xs ${M?"text-purple-700":w?"text-green-700":k?"text-gray-500":"text-gray-600"}`,children:[p.minPoints," - ",p.maxPoints===1/0?"∞":p.maxPoints," pts"]})]},p.name)})})]}),t.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-gray-200 mb-8",children:[t.jsx("div",{className:"border-b border-gray-200",children:t.jsxs("div",{className:"flex",children:[t.jsx("button",{onClick:()=>u("available"),className:`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${i==="available"?"border-purple-500 text-purple-600":"border-transparent text-gray-500 hover:text-gray-700"}`,children:"Récompenses disponibles"}),t.jsx("button",{onClick:()=>u("redeemed"),className:`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${i==="redeemed"?"border-purple-500 text-purple-600":"border-transparent text-gray-500 hover:text-gray-700"}`,children:"Mes récompenses"})]})}),t.jsx("div",{className:"p-6",children:i==="available"?t.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",children:b.map(p=>{const E=p.icon,L=o>=p.points;return t.jsxs("div",{className:"border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow",children:[t.jsxs("div",{className:"relative",children:[t.jsx("img",{src:p.image,alt:p.title,className:"w-full h-48 object-cover"}),p.popular&&t.jsx("div",{className:"absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full",children:"Populaire"}),p.stock<=10&&t.jsxs("div",{className:"absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full",children:["Plus que ",p.stock," disponibles"]})]}),t.jsxs("div",{className:"p-4",children:[t.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[t.jsx(E,{className:"w-5 h-5 text-purple-600"}),t.jsx("h3",{className:"font-semibold text-gray-900",children:p.title})]}),t.jsx("p",{className:"text-sm text-gray-600 mb-3",children:p.description}),t.jsxs("div",{className:"flex items-center justify-between",children:[t.jsxs("div",{className:"flex items-center gap-2",children:[t.jsx("span",{className:"text-2xl font-bold text-purple-600",children:p.points}),t.jsx("span",{className:"text-sm text-gray-500",children:"points"})]}),t.jsxs("div",{className:"text-sm text-gray-500",children:["Stock: ",p.stock]})]}),t.jsx("button",{onClick:()=>j(p.id),disabled:!L,className:`w-full mt-3 py-2 rounded-lg font-medium transition-colors ${L?"bg-purple-600 text-white hover:bg-purple-700":"bg-gray-100 text-gray-400 cursor-not-allowed"}`,children:L?"Échanger":`${p.points-o} pts manquants`})]})]},p.id)})}):t.jsxs("div",{className:"space-y-4",children:[m.map(p=>{const E=p.icon;return t.jsxs("div",{className:"flex items-center gap-4 p-4 border border-gray-200 rounded-lg",children:[t.jsx("img",{src:p.image,alt:p.title,className:"w-16 h-16 rounded-lg object-cover"}),t.jsxs("div",{className:"flex-1",children:[t.jsxs("div",{className:"flex items-center gap-2 mb-1",children:[t.jsx(E,{className:"w-5 h-5 text-green-600"}),t.jsx("h3",{className:"font-semibold text-gray-900",children:p.title})]}),t.jsx("p",{className:"text-sm text-gray-600",children:p.description}),t.jsxs("div",{className:"flex items-center gap-4 mt-2",children:[t.jsxs("span",{className:"text-sm text-gray-500",children:["Échangé le ",p.redeemedAt]}),t.jsxs("span",{className:"text-sm font-medium text-green-600",children:["-",p.points," points"]})]})]})]},p.id)}),m.length===0&&t.jsxs("div",{className:"text-center py-12",children:[t.jsx(Db,{className:"w-16 h-16 text-gray-300 mx-auto mb-4"}),t.jsx("p",{className:"text-gray-500",children:"Vous n'avez pas encore échangé de récompenses"}),t.jsx("p",{className:"text-sm text-gray-400 mt-2",children:"Gagnez des points en déclarant vos déchets pour débloquer des récompenses !"})]})]})})]}),t.jsxs("div",{className:"bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200",children:[t.jsxs("h3",{className:"font-semibold text-green-900 mb-3 flex items-center gap-2",children:[t.jsx(zt,{className:"w-5 h-5"}),"Comment gagner plus de points ?"]}),t.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[t.jsxs("div",{children:[t.jsx("h4",{className:"font-medium text-green-800 mb-2",children:"Actions quotidiennes"}),t.jsxs("ul",{className:"text-sm text-green-700 space-y-1",children:[t.jsx("li",{children:"• Déclarez régulièrement vos déchets"}),t.jsx("li",{children:"• Triez correctement vos déchets"}),t.jsx("li",{children:"• Participez aux événements spéciaux"})]})]}),t.jsxs("div",{children:[t.jsx("h4",{className:"font-medium text-green-800 mb-2",children:"Bonus de points"}),t.jsxs("ul",{className:"text-sm text-green-700 space-y-1",children:[t.jsx("li",{children:"• +50% pour le tri sélectif parfait"}),t.jsx("li",{children:"• +25% pour les gros volumes"}),t.jsx("li",{children:"• +10% pour les collectes programmées"})]})]})]})]})]})})},sy=()=>{const[i,u]=v.useState([{id:1,type:"success",title:"Collecte terminée",message:"Votre déclaration DEC-123456 a été collectée avec succès",time:"Il y a 2 heures",read:!1,icon:Ce,action:{text:"Voir les détails",href:"/declaration/DEC-123456"}},{id:2,type:"warning",title:"Rappel de collecte",message:"N'oubliez pas de préparer vos déchets pour demain matin",time:"Il y a 5 heures",read:!1,icon:Al,action:null},{id:3,type:"info",title:"Nouveau collecteur assigné",message:"Jean Dupont a été assigné à votre collecte DEC-123457",time:"Hier",read:!0,icon:ct,action:{text:"Voir le profil",href:"/tracking/DEC-123457"}},{id:4,type:"success",title:"Points gagnés",message:"Félicitations ! Vous avez gagné 25 points pour votre dernière collecte",time:"Hier",read:!0,icon:Ce,action:{text:"Voir mes récompenses",href:"/rewards"}},{id:5,type:"info",title:"Mise à jour de l'application",message:"Nouvelles fonctionnalités disponibles dans votre espace",time:"Il y a 2 jours",read:!0,icon:gi,action:null},{id:6,type:"warning",title:"Collecte retardée",message:"Votre collecte prévue pour aujourd'ui est retardée de 30 minutes",time:"Il y a 3 jours",read:!0,icon:Qe,action:{text:"Suivre en temps réel",href:"/tracking/DEC-123458"}}]),[o,d]=v.useState("all"),x=i.filter(p=>o==="all"?!0:o==="unread"?!p.read:o==="read"?p.read:p.type===o),b=p=>{u(E=>E.map(L=>L.id===p?{...L,read:!0}:L))},m=()=>{u(p=>p.map(E=>({...E,read:!0})))},N=p=>{u(E=>E.filter(L=>L.id!==p))},f=()=>{u([])},g=p=>{switch(p){case"success":return"bg-green-100 text-green-600 border-green-200";case"warning":return"bg-orange-100 text-orange-600 border-orange-200";case"error":return"bg-red-100 text-red-600 border-red-200";default:return"bg-blue-100 text-blue-600 border-blue-200"}},j=i.filter(p=>!p.read).length;return t.jsx(ca,{pageTitle:"Notifications",currentPage:"notifications",notifications:i.filter(p=>!p.read),children:t.jsxs("div",{className:"max-w-4xl lg:max-w-6xl mx-auto px-2 sm:px-0",children:[t.jsxs("div",{className:"bg-white rounded-2xl shadow-lg p-6 mb-6",children:[t.jsxs("div",{className:"flex items-center justify-between mb-6",children:[t.jsxs("div",{className:"flex items-center gap-3",children:[t.jsx("div",{className:"w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center",children:t.jsx(fs,{className:"w-6 h-6 text-green-600"})}),t.jsxs("div",{children:[t.jsx("h1",{className:"text-2xl font-bold text-gray-900",children:"Notifications"}),t.jsx("p",{className:"text-gray-600",children:j>0?`${j} non lue${j>1?"s":""}`:"Aucune notification non lue"})]})]}),t.jsxs("div",{className:"flex items-center gap-3",children:[j>0&&t.jsxs("button",{onClick:m,className:"flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors",children:[t.jsx(cx,{className:"w-4 h-4"}),"Tout marquer comme lu"]}),t.jsxs("button",{onClick:f,className:"flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors",children:[t.jsx(ft,{className:"w-4 h-4"}),"Tout supprimer"]})]})]}),t.jsxs("div",{className:"flex flex-wrap gap-2",children:[t.jsxs("button",{onClick:()=>d("all"),className:`px-4 py-2 rounded-lg font-medium transition-colors ${o==="all"?"bg-green-600 text-white":"bg-gray-100 text-gray-700 hover:bg-gray-200"}`,children:["Toutes (",i.length,")"]}),t.jsxs("button",{onClick:()=>d("unread"),className:`px-4 py-2 rounded-lg font-medium transition-colors ${o==="unread"?"bg-green-600 text-white":"bg-gray-100 text-gray-700 hover:bg-gray-200"}`,children:["Non lues (",j,")"]}),t.jsx("button",{onClick:()=>d("success"),className:`px-4 py-2 rounded-lg font-medium transition-colors ${o==="success"?"bg-green-600 text-white":"bg-gray-100 text-gray-700 hover:bg-gray-200"}`,children:"Succès"}),t.jsx("button",{onClick:()=>d("warning"),className:`px-4 py-2 rounded-lg font-medium transition-colors ${o==="warning"?"bg-green-600 text-white":"bg-gray-100 text-gray-700 hover:bg-gray-200"}`,children:"Alertes"}),t.jsx("button",{onClick:()=>d("info"),className:`px-4 py-2 rounded-lg font-medium transition-colors ${o==="info"?"bg-green-600 text-white":"bg-gray-100 text-gray-700 hover:bg-gray-200"}`,children:"Informations"})]})]}),t.jsx("div",{className:"space-y-4",children:x.length===0?t.jsxs("div",{className:"bg-white rounded-2xl shadow-lg p-12 text-center",children:[t.jsx("div",{className:"w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4",children:t.jsx(fs,{className:"w-8 h-8 text-gray-400"})}),t.jsx("h3",{className:"text-lg font-semibold text-gray-900 mb-2",children:o==="all"?"Aucune notification":`Aucune notification ${o}`}),t.jsx("p",{className:"text-gray-500",children:o==="all"?"Vous n'avez aucune notification pour le moment":`Vous n'avez aucune notification de type ${o}`})]}):x.map(p=>{const E=p.icon;return t.jsx("div",{className:`bg-white rounded-xl shadow-sm border p-6 transition-all hover:shadow-md ${p.read?"border-gray-200":"border-l-4 border-l-green-500"}`,children:t.jsxs("div",{className:"flex items-start gap-4",children:[t.jsx("div",{className:`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${g(p.type)}`,children:t.jsx(E,{className:"w-5 h-5"})}),t.jsxs("div",{className:"flex-1 min-w-0",children:[t.jsxs("div",{className:"flex items-start justify-between mb-2",children:[t.jsxs("div",{className:"flex-1",children:[t.jsx("h3",{className:`font-semibold text-gray-900 mb-1 ${p.read?"":"font-bold"}`,children:p.title}),t.jsx("p",{className:"text-gray-600 mb-2",children:p.message}),t.jsxs("div",{className:"flex items-center gap-4 text-sm text-gray-500",children:[t.jsxs("div",{className:"flex items-center gap-1",children:[t.jsx(Qe,{className:"w-3 h-3"}),p.time]}),!p.read&&t.jsxs("span",{className:"inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium",children:[t.jsx("div",{className:"w-2 h-2 bg-green-600 rounded-full"}),"Non lue"]})]})]}),t.jsxs("div",{className:"flex items-center gap-2 ml-4",children:[!p.read&&t.jsx("button",{onClick:()=>b(p.id),className:"p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors",title:"Marquer comme lu",children:t.jsx(cx,{className:"w-4 h-4"})}),t.jsx("button",{onClick:()=>N(p.id),className:"p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors",title:"Supprimer",children:t.jsx(ys,{className:"w-4 h-4"})})]})]}),p.action&&t.jsx("div",{className:"mt-3 pt-3 border-t border-gray-100",children:t.jsxs("a",{href:p.action.href,className:"inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium text-sm transition-colors",children:[p.action.text,t.jsx(De,{className:"w-4 h-4"})]})})]})]})},p.id)})})]})})},ly=()=>{const[i,u]=v.useState("general"),[o,d]=v.useState(!1),[x,b]=v.useState({email:!0,push:!0,sms:!1,browser:!0}),[m,N]=v.useState({shareData:!1,analytics:!0,marketing:!1}),f=[{id:"general",label:"Général",icon:Io},{id:"notifications",label:"Notifications",icon:fs},{id:"privacy",label:"Confidentialité",icon:Bs},{id:"about",label:"À propos",icon:gi}],g=()=>{console.log("Export des données..."),alert("Vos données sont en cours d'exportation...")},j=()=>t.jsxs("div",{className:"space-y-6",children:[t.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-gray-200 p-6",children:[t.jsx("h3",{className:"text-lg font-semibold text-gray-900 mb-4",children:"Apparence"}),t.jsxs("div",{className:"space-y-4",children:[t.jsxs("div",{className:"flex items-center justify-between",children:[t.jsxs("div",{className:"flex items-center gap-3",children:[o?t.jsx(Ux,{className:"w-5 h-5 text-gray-600"}):t.jsx(Yx,{className:"w-5 h-5 text-gray-600"}),t.jsxs("div",{children:[t.jsx("p",{className:"font-medium text-gray-900",children:"Mode sombre"}),t.jsx("p",{className:"text-sm text-gray-500",children:"Activer le thème sombre"})]})]}),t.jsx("button",{onClick:()=>d(!o),className:`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${o?"bg-green-600":"bg-gray-200"}`,children:t.jsx("span",{className:`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${o?"translate-x-6":"translate-x-1"}`})})]}),t.jsxs("div",{className:"flex items-center justify-between",children:[t.jsxs("div",{className:"flex items-center gap-3",children:[t.jsx(qx,{className:"w-5 h-5 text-gray-600"}),t.jsxs("div",{children:[t.jsx("p",{className:"font-medium text-gray-900",children:"Langue"}),t.jsx("p",{className:"text-sm text-gray-500",children:"Choisir la langue de l'application"})]})]}),t.jsxs("select",{className:"px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent",children:[t.jsx("option",{children:"Français"}),t.jsx("option",{children:"English"}),t.jsx("option",{children:"Español"})]})]})]})]}),t.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-gray-200 p-6",children:[t.jsx("h3",{className:"text-lg font-semibold text-gray-900 mb-4",children:"Préférences"}),t.jsxs("div",{className:"space-y-4",children:[t.jsxs("div",{className:"flex items-center justify-between",children:[t.jsxs("div",{className:"flex items-center gap-3",children:[t.jsx(pa,{className:"w-5 h-5 text-gray-600"}),t.jsxs("div",{children:[t.jsx("p",{className:"font-medium text-gray-900",children:"Localisation"}),t.jsx("p",{className:"text-sm text-gray-500",children:"Autoriser l'accès à votre position"})]})]}),t.jsx("button",{className:"relative inline-flex h-6 w-11 items-center rounded-full bg-green-600",children:t.jsx("span",{className:"inline-block h-4 w-4 transform rounded-full bg-white translate-x-6"})})]}),t.jsxs("div",{className:"flex items-center justify-between",children:[t.jsxs("div",{className:"flex items-center gap-3",children:[t.jsx(Vv,{className:"w-5 h-5 text-gray-600"}),t.jsxs("div",{children:[t.jsx("p",{className:"font-medium text-gray-900",children:"Mode hors ligne"}),t.jsx("p",{className:"text-sm text-gray-500",children:"Télécharger les données pour utilisation hors ligne"})]})]}),t.jsx("button",{className:"relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200",children:t.jsx("span",{className:"inline-block h-4 w-4 transform rounded-full bg-white translate-x-1"})})]})]})]})]}),p=()=>t.jsxs("div",{className:"space-y-6",children:[t.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-gray-200 p-6",children:[t.jsx("h3",{className:"text-lg font-semibold text-gray-900 mb-4",children:"Notifications push"}),t.jsxs("div",{className:"space-y-4",children:[t.jsxs("div",{className:"flex items-center justify-between",children:[t.jsxs("div",{className:"flex items-center gap-3",children:[t.jsx(gv,{className:"w-5 h-5 text-gray-600"}),t.jsxs("div",{children:[t.jsx("p",{className:"font-medium text-gray-900",children:"Notifications mobile"}),t.jsx("p",{className:"text-sm text-gray-500",children:"Recevoir des notifications sur votre téléphone"})]})]}),t.jsx("button",{onClick:()=>b({...x,push:!x.push}),className:`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${x.push?"bg-green-600":"bg-gray-200"}`,children:t.jsx("span",{className:`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${x.push?"translate-x-6":"translate-x-1"}`})})]}),t.jsxs("div",{className:"flex items-center justify-between",children:[t.jsxs("div",{className:"flex items-center gap-3",children:[t.jsx(gs,{className:"w-5 h-5 text-gray-600"}),t.jsxs("div",{children:[t.jsx("p",{className:"font-medium text-gray-900",children:"Notifications email"}),t.jsx("p",{className:"text-sm text-gray-500",children:"Recevoir des mises à jour par email"})]})]}),t.jsx("button",{onClick:()=>b({...x,email:!x.email}),className:`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${x.email?"bg-green-600":"bg-gray-200"}`,children:t.jsx("span",{className:`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${x.email?"translate-x-6":"translate-x-1"}`})})]}),t.jsxs("div",{className:"flex items-center justify-between",children:[t.jsxs("div",{className:"flex items-center gap-3",children:[t.jsx(Bv,{className:"w-5 h-5 text-gray-600"}),t.jsxs("div",{children:[t.jsx("p",{className:"font-medium text-gray-900",children:"Notifications SMS"}),t.jsx("p",{className:"text-sm text-gray-500",children:"Recevoir des alertes par SMS"})]})]}),t.jsx("button",{onClick:()=>b({...x,sms:!x.sms}),className:`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${x.sms?"bg-green-600":"bg-gray-200"}`,children:t.jsx("span",{className:`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${x.sms?"translate-x-6":"translate-x-1"}`})})]})]})]}),t.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-gray-200 p-6",children:[t.jsx("h3",{className:"text-lg font-semibold text-gray-900 mb-4",children:"Types de notifications"}),t.jsx("div",{className:"space-y-3",children:["Nouvelles collectes","Mises à jour de statut","Messages des collecteurs","Promotions et récompenses","Actualités EcoCollect"].map((w,k)=>t.jsxs("label",{className:"flex items-center gap-3 cursor-pointer",children:[t.jsx("input",{type:"checkbox",defaultChecked:k<3,className:"w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"}),t.jsx("span",{className:"text-gray-700",children:w})]},k))})]})]}),E=()=>t.jsxs("div",{className:"space-y-6",children:[t.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-gray-200 p-6",children:[t.jsx("h3",{className:"text-lg font-semibold text-gray-900 mb-4",children:"Confidentialité des données"}),t.jsxs("div",{className:"space-y-4",children:[t.jsxs("div",{className:"flex items-center justify-between",children:[t.jsxs("div",{className:"flex items-center gap-3",children:[t.jsx(vs,{className:"w-5 h-5 text-gray-600"}),t.jsxs("div",{children:[t.jsx("p",{className:"font-medium text-gray-900",children:"Partage de données"}),t.jsx("p",{className:"text-sm text-gray-500",children:"Partager des données anonymisées pour améliorer le service"})]})]}),t.jsx("button",{onClick:()=>N({...m,shareData:!m.shareData}),className:`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${m.shareData?"bg-green-600":"bg-gray-200"}`,children:t.jsx("span",{className:`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${m.shareData?"translate-x-6":"translate-x-1"}`})})]}),t.jsxs("div",{className:"flex items-center justify-between",children:[t.jsxs("div",{className:"flex items-center gap-3",children:[t.jsx(Rx,{className:"w-5 h-5 text-gray-600"}),t.jsxs("div",{children:[t.jsx("p",{className:"font-medium text-gray-900",children:"Analytics"}),t.jsx("p",{className:"text-sm text-gray-500",children:"Autoriser les cookies analytiques"})]})]}),t.jsx("button",{onClick:()=>N({...m,analytics:!m.analytics}),className:`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${m.analytics?"bg-green-600":"bg-gray-200"}`,children:t.jsx("span",{className:`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${m.analytics?"translate-x-6":"translate-x-1"}`})})]}),t.jsxs("div",{className:"flex items-center justify-between",children:[t.jsxs("div",{className:"flex items-center gap-3",children:[t.jsx(gs,{className:"w-5 h-5 text-gray-600"}),t.jsxs("div",{children:[t.jsx("p",{className:"font-medium text-gray-900",children:"Marketing"}),t.jsx("p",{className:"text-sm text-gray-500",children:"Recevoir des offres promotionnelles"})]})]}),t.jsx("button",{onClick:()=>N({...m,marketing:!m.marketing}),className:`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${m.marketing?"bg-green-600":"bg-gray-200"}`,children:t.jsx("span",{className:`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${m.marketing?"translate-x-6":"translate-x-1"}`})})]})]})]}),t.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-gray-200 p-6",children:[t.jsx("h3",{className:"text-lg font-semibold text-gray-900 mb-4",children:"Gestion des données"}),t.jsxs("div",{className:"space-y-4",children:[t.jsxs("button",{onClick:g,className:"w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors",children:[t.jsxs("div",{className:"flex items-center gap-3",children:[t.jsx(Fo,{className:"w-5 h-5 text-green-600"}),t.jsxs("div",{className:"text-left",children:[t.jsx("p",{className:"font-medium text-gray-900",children:"Exporter mes données"}),t.jsx("p",{className:"text-sm text-gray-500",children:"Télécharger toutes vos données personnelles"})]})]}),t.jsx(qr,{className:"w-5 h-5 text-gray-400"})]}),t.jsxs("button",{className:"w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors",children:[t.jsxs("div",{className:"flex items-center gap-3",children:[t.jsx(ft,{className:"w-5 h-5 text-red-600"}),t.jsxs("div",{className:"text-left",children:[t.jsx("p",{className:"font-medium text-gray-900",children:"Supprimer mes données"}),t.jsx("p",{className:"text-sm text-gray-500",children:"Supprimer définitivement toutes vos données"})]})]}),t.jsx(qr,{className:"w-5 h-5 text-gray-400"})]})]})]})]}),L=()=>t.jsxs("div",{className:"space-y-6",children:[t.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-gray-200 p-6",children:[t.jsx("h3",{className:"text-lg font-semibold text-gray-900 mb-4",children:"À propos d'EcoCollect"}),t.jsxs("div",{className:"space-y-4",children:[t.jsxs("div",{className:"text-center py-8",children:[t.jsx("div",{className:"w-20 h-20 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4",children:t.jsx(ft,{className:"w-10 h-10 text-white"})}),t.jsx("h4",{className:"text-xl font-bold text-gray-900 mb-2",children:"EcoCollect"}),t.jsx("p",{className:"text-gray-600 mb-4",children:"Version 1.0.0"}),t.jsx("p",{className:"text-sm text-gray-500 max-w-md mx-auto",children:"Plateforme de collecte de déchets pour un Cameroun plus propre. Connectez les citoyens avec les collecteurs de déchets pour une gestion durable."})]}),t.jsxs("div",{className:"space-y-3 pt-4 border-t border-gray-200",children:[t.jsxs("div",{className:"flex items-center justify-between py-2",children:[t.jsx("span",{className:"text-gray-600",children:"Développeur"}),t.jsx("span",{className:"font-medium text-gray-900",children:"EcoCollect Team"})]}),t.jsxs("div",{className:"flex items-center justify-between py-2",children:[t.jsx("span",{className:"text-gray-600",children:"Contact"}),t.jsx("span",{className:"font-medium text-gray-900",children:"support@ecocollect.cm"})]}),t.jsxs("div",{className:"flex items-center justify-between py-2",children:[t.jsx("span",{className:"text-gray-600",children:"Site web"}),t.jsx("a",{href:"#",className:"font-medium text-green-600 hover:underline",children:"www.ecocollect.cm"})]}),t.jsxs("div",{className:"flex items-center justify-between py-2",children:[t.jsx("span",{className:"text-gray-600",children:"Licence"}),t.jsx("span",{className:"font-medium text-gray-900",children:"MIT License"})]})]})]})]}),t.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-gray-200 p-6",children:[t.jsx("h3",{className:"text-lg font-semibold text-gray-900 mb-4",children:"Ressources"}),t.jsxs("div",{className:"space-y-3",children:[t.jsxs("button",{className:"w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors",children:[t.jsxs("div",{className:"flex items-center gap-3",children:[t.jsx(Rl,{className:"w-5 h-5 text-gray-600"}),t.jsxs("div",{className:"text-left",children:[t.jsx("p",{className:"font-medium text-gray-900",children:"Conditions d'utilisation"}),t.jsx("p",{className:"text-sm text-gray-500",children:"Lire nos conditions générales"})]})]}),t.jsx(qr,{className:"w-5 h-5 text-gray-400"})]}),t.jsxs("button",{className:"w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors",children:[t.jsxs("div",{className:"flex items-center gap-3",children:[t.jsx(vs,{className:"w-5 h-5 text-gray-600"}),t.jsxs("div",{className:"text-left",children:[t.jsx("p",{className:"font-medium text-gray-900",children:"Politique de confidentialité"}),t.jsx("p",{className:"text-sm text-gray-500",children:"Comment nous protégeons vos données"})]})]}),t.jsx(qr,{className:"w-5 h-5 text-gray-400"})]}),t.jsxs("button",{className:"w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors",children:[t.jsxs("div",{className:"flex items-center gap-3",children:[t.jsx(ub,{className:"w-5 h-5 text-gray-600"}),t.jsxs("div",{className:"text-left",children:[t.jsx("p",{className:"font-medium text-gray-900",children:"Centre d'aide"}),t.jsx("p",{className:"text-sm text-gray-500",children:"Obtenir de l'aide et des conseils"})]})]}),t.jsx(qr,{className:"w-5 h-5 text-gray-400"})]})]})]})]}),M=()=>{switch(i){case"general":return j();case"notifications":return p();case"privacy":return E();case"about":return L();default:return j()}};return t.jsx(ca,{pageTitle:"Paramètres",currentPage:"settings",notifications:[],children:t.jsx("div",{className:"max-w-4xl lg:max-w-6xl mx-auto px-2 sm:px-0",children:t.jsxs("div",{className:"flex flex-col lg:flex-row gap-6",children:[t.jsx("div",{className:"lg:w-80",children:t.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-gray-200 p-6",children:[t.jsx("h2",{className:"text-lg font-semibold text-gray-900 mb-4",children:"Paramètres"}),t.jsx("nav",{className:"space-y-2",children:f.map(w=>{const k=w.icon;return t.jsxs("button",{onClick:()=>u(w.id),className:`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${i===w.id?"bg-green-50 text-green-600 border-l-4 border-l-green-600":"text-gray-700 hover:bg-gray-50"}`,children:[t.jsx(k,{className:"w-5 h-5"}),t.jsx("span",{className:"font-medium",children:w.label})]},w.id)})})]})}),t.jsx("div",{className:"flex-1",children:M()})]})})})},ry=()=>t.jsx("div",{className:"min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4",children:t.jsxs("div",{className:"max-w-4xl mx-auto",children:[t.jsxs("div",{className:"bg-white rounded-2xl shadow-lg p-6 mb-6",children:[t.jsxs("div",{className:"flex items-center gap-4 mb-6",children:[t.jsxs("a",{href:"/register",className:"flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors",children:[t.jsx(Gs,{className:"w-5 h-5"}),"Retour"]}),t.jsxs("div",{className:"flex items-center gap-3",children:[t.jsx(Rl,{className:"w-8 h-8 text-green-600"}),t.jsx("h1",{className:"text-2xl font-bold text-gray-900",children:"Conditions Générales d'Utilisation"})]})]}),t.jsx("div",{className:"bg-green-50 border border-green-200 rounded-lg p-4",children:t.jsxs("p",{className:"text-sm text-green-800",children:["Dernière mise à jour : ",new Date().toLocaleDateString("fr-FR")]})})]}),t.jsxs("div",{className:"bg-white rounded-2xl shadow-lg p-6 space-y-8",children:[t.jsxs("section",{children:[t.jsxs("h2",{className:"text-xl font-bold text-gray-900 mb-4 flex items-center gap-2",children:[t.jsx(Rl,{className:"w-6 h-6 text-green-600"}),"Introduction"]}),t.jsx("div",{className:"prose prose-green max-w-none",children:t.jsx("p",{className:"text-gray-700 leading-relaxed",children:"Bienvenue sur EcoCollect, la plateforme numérique de gestion des déchets au Cameroun. En utilisant nos services, vous acceptez les présentes conditions générales d'utilisation (CGU). Veuillez les lire attentivement avant de vous inscrire et d'utiliser la plateforme."})})]}),t.jsxs("section",{children:[t.jsxs("h2",{className:"text-xl font-bold text-gray-900 mb-4 flex items-center gap-2",children:[t.jsx(ta,{className:"w-6 h-6 text-green-600"}),"1. Acceptation des conditions"]}),t.jsxs("div",{className:"space-y-3 text-gray-700",children:[t.jsx("p",{children:"L'accès et l'utilisation de la plateforme EcoCollect sont soumis à l'acceptation pleine et entière des présentes CGU. En cochant la case d'acceptation lors de votre inscription, vous reconnaissez avoir lu, compris et accepté sans réserve ces conditions."}),t.jsx("p",{children:"Si vous n'acceptez pas ces conditions, vous ne devez pas utiliser la plateforme EcoCollect."})]})]}),t.jsxs("section",{children:[t.jsxs("h2",{className:"text-xl font-bold text-gray-900 mb-4 flex items-center gap-2",children:[t.jsx(ft,{className:"w-6 h-6 text-green-600"}),"2. Objet du service"]}),t.jsxs("div",{className:"space-y-3 text-gray-700",children:[t.jsx("p",{children:"EcoCollect est une plateforme qui met en relation les producteurs de déchets (ménages, commerces, entreprises, administrations) avec les collecteurs de déchets agréés."}),t.jsxs("div",{className:"bg-gray-50 rounded-lg p-4",children:[t.jsx("h3",{className:"font-semibold text-gray-900 mb-2",children:"Services proposés :"}),t.jsxs("ul",{className:"list-disc list-inside space-y-1 text-sm",children:[t.jsx("li",{children:"Déclaration en ligne des types et quantités de déchets"}),t.jsx("li",{children:"Suivi en temps réel du statut de collecte"}),t.jsx("li",{children:"Prise de rendez-vous pour la collecte"}),t.jsx("li",{children:"Accès aux points de collecte agréés"}),t.jsx("li",{children:"Système de récompenses et points fidélité"}),t.jsx("li",{children:"Tableau de bord statistique personnalisé"})]})]})]})]}),t.jsxs("section",{children:[t.jsxs("h2",{className:"text-xl font-bold text-gray-900 mb-4 flex items-center gap-2",children:[t.jsx(vs,{className:"w-6 h-6 text-green-600"}),"3. Inscription et compte utilisateur"]}),t.jsxs("div",{className:"space-y-3 text-gray-700",children:[t.jsx("p",{children:"Pour utiliser la plateforme, vous devez créer un compte en fournissant des informations exactes et complètes. L'inscription est réservée aux personnes majeures et aux entités légalement constituées."}),t.jsxs("div",{className:"bg-amber-50 border border-amber-200 rounded-lg p-4",children:[t.jsxs("h3",{className:"font-semibold text-amber-900 mb-2 flex items-center gap-2",children:[t.jsx(Go,{className:"w-4 h-4"}),"Informations requises"]}),t.jsxs("ul",{className:"list-disc list-inside space-y-1 text-sm text-amber-800",children:[t.jsx("li",{children:"Identité complète (nom, prénom)"}),t.jsx("li",{children:"Coordonnées valides (email et/ou téléphone)"}),t.jsx("li",{children:"Type de producteur (ménage, commerce, entreprise)"}),t.jsx("li",{children:"Localisation précise (ville, quartier, point de collecte)"}),t.jsx("li",{children:"Pièce d'identité valide (CNI recto/verso)"})]})]}),t.jsx("p",{children:"Vous êtes responsable de la confidentialité de vos identifiants de connexion et de toute activité sur votre compte."})]})]}),t.jsxs("section",{children:[t.jsxs("h2",{className:"text-xl font-bold text-gray-900 mb-4 flex items-center gap-2",children:[t.jsx(pa,{className:"w-6 h-6 text-green-600"}),"4. Obligations des utilisateurs"]}),t.jsxs("div",{className:"space-y-3 text-gray-700",children:[t.jsx("p",{children:"En tant qu'utilisateur de la plateforme EcoCollect, vous vous engagez à :"}),t.jsxs("ul",{className:"list-disc list-inside space-y-2",children:[t.jsx("li",{children:"Fournir des informations exactes et à jour"}),t.jsx("li",{children:"Déclarer fidèlement les types et quantités de déchets"}),t.jsx("li",{children:"Respecter les horaires et modalités de collecte convenus"}),t.jsx("li",{children:"Préparer les déchets selon les normes environnementales en vigueur"}),t.jsx("li",{children:"Ne pas déposer de déchets interdits ou dangereux sans autorisation"}),t.jsx("li",{children:"Respecter les collecteurs et le personnel d'EcoCollect"}),t.jsx("li",{children:"Payer les frais de service applicables selon les conditions en vigueur"})]})]})]}),t.jsxs("section",{children:[t.jsxs("h2",{className:"text-xl font-bold text-gray-900 mb-4 flex items-center gap-2",children:[t.jsx(zt,{className:"w-6 h-6 text-green-600"}),"5. Système de récompenses"]}),t.jsxs("div",{className:"space-y-3 text-gray-700",children:[t.jsx("p",{children:"EcoCollect propose un système de récompenses pour encourager les bonnes pratiques de gestion des déchets :"}),t.jsxs("ul",{className:"list-disc list-inside space-y-2",children:[t.jsx("li",{children:"Points accumulés pour chaque déclaration et collecte effectuée"}),t.jsx("li",{children:"Bonus pour le tri sélectif et la régularité des déclarations"}),t.jsx("li",{children:"Avantages et réductions chez les partenaires locaux"}),t.jsx("li",{children:"Classement et reconnaissance des utilisateurs les plus actifs"})]}),t.jsx("p",{children:"Les points sont non-transférables et ne peuvent être échangés contre de l'argent liquide."})]})]}),t.jsxs("section",{children:[t.jsxs("h2",{className:"text-xl font-bold text-gray-900 mb-4 flex items-center gap-2",children:[t.jsx(vs,{className:"w-6 h-6 text-green-600"}),"6. Protection des données personnelles"]}),t.jsxs("div",{className:"space-y-3 text-gray-700",children:[t.jsx("p",{children:"EcoCollect s'engage à protéger vos données personnelles conformément à la législation burkinabè sur la protection des données. Vos informations sont collectées, traitées et stockées de manière sécurisée."}),t.jsx("p",{children:"Nous ne partageons vos données personnelles qu'avec les collecteurs agréés dans le cadre de l'exécution du service de collecte, et avec les autorités compétentes si la loi l'exige."}),t.jsx("p",{children:"Pour plus d'informations, consultez notre Politique de Confidentialité."})]})]}),t.jsxs("section",{children:[t.jsxs("h2",{className:"text-xl font-bold text-gray-900 mb-4 flex items-center gap-2",children:[t.jsx(Go,{className:"w-6 h-6 text-green-600"}),"7. Limitation de responsabilité"]}),t.jsxs("div",{className:"space-y-3 text-gray-700",children:[t.jsx("p",{children:"EcoCollect agit comme intermédiaire entre les producteurs et les collecteurs. La plateforme ne peut être tenue responsable :"}),t.jsxs("ul",{className:"list-disc list-inside space-y-2",children:[t.jsx("li",{children:"Des retards ou absences de collecte dus à des cas de force majeure"}),t.jsx("li",{children:"Des dommages survenus pendant la manipulation des déchets par les collecteurs"}),t.jsx("li",{children:"De la qualité du service fourni par les collecteurs indépendants"}),t.jsx("li",{children:"Des pertes de données dues à des interventions frauduleuses externes"})]})]})]}),t.jsxs("section",{children:[t.jsx("h2",{className:"text-xl font-bold text-gray-900 mb-4",children:"8. Modification des conditions"}),t.jsxs("div",{className:"space-y-3 text-gray-700",children:[t.jsx("p",{children:"EcoCollect se réserve le droit de modifier ces conditions générales à tout moment. Les modifications prendront effet dès leur publication sur la plateforme."}),t.jsx("p",{children:"Les utilisateurs seront notifiés des modifications importantes par email ou via la plateforme."})]})]}),t.jsxs("section",{children:[t.jsx("h2",{className:"text-xl font-bold text-gray-900 mb-4",children:"9. Contact et support"}),t.jsxs("div",{className:"space-y-3 text-gray-700",children:[t.jsx("p",{children:"Pour toute question concernant ces conditions générales, vous pouvez nous contacter :"}),t.jsx("div",{className:"bg-gray-50 rounded-lg p-4",children:t.jsxs("ul",{className:"space-y-2 text-sm",children:[t.jsxs("li",{children:[t.jsx("strong",{children:"Email :"})," support@ecocollect.cm"]}),t.jsxs("li",{children:[t.jsx("strong",{children:"Téléphone :"})," +237 XX XX XX XX"]}),t.jsxs("li",{children:[t.jsx("strong",{children:"Adresse :"})," Douala, Cameroun"]})]})})]})]}),t.jsx("div",{className:"border-t pt-6 mt-8",children:t.jsx("p",{className:"text-center text-sm text-gray-600",children:"© 2024 EcoCollect. Tous droits réservés."})})]})]})}),ny=()=>t.jsx("div",{className:"min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4",children:t.jsxs("div",{className:"max-w-4xl mx-auto",children:[t.jsxs("div",{className:"bg-white rounded-2xl shadow-lg p-6 mb-6",children:[t.jsxs("div",{className:"flex items-center gap-4 mb-6",children:[t.jsxs("a",{href:"/register",className:"flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors",children:[t.jsx(Gs,{className:"w-5 h-5"}),"Retour"]}),t.jsxs("div",{className:"flex items-center gap-3",children:[t.jsx(vs,{className:"w-8 h-8 text-green-600"}),t.jsx("h1",{className:"text-2xl font-bold text-gray-900",children:"Politique de Confidentialité"})]})]}),t.jsx("div",{className:"bg-green-50 border border-green-200 rounded-lg p-4",children:t.jsxs("p",{className:"text-sm text-green-800",children:["Dernière mise à jour : ",new Date().toLocaleDateString("fr-FR")]})})]}),t.jsxs("div",{className:"bg-white rounded-2xl shadow-lg p-6 space-y-8",children:[t.jsxs("section",{children:[t.jsxs("h2",{className:"text-xl font-bold text-gray-900 mb-4 flex items-center gap-2",children:[t.jsx(vs,{className:"w-6 h-6 text-green-600"}),"Introduction"]}),t.jsx("div",{className:"prose prose-green max-w-none",children:t.jsx("p",{className:"text-gray-700 leading-relaxed",children:"Chez EcoCollect, nous nous engageons à protéger votre vie privée et à sécuriser vos données personnelles. Cette politique de confidentialité explique quelles informations nous collectons, comment nous les utilisons, et comment nous les protégeons conformément à la législation camerounaise."})})]}),t.jsxs("section",{children:[t.jsxs("h2",{className:"text-xl font-bold text-gray-900 mb-4 flex items-center gap-2",children:[t.jsx(Rx,{className:"w-6 h-6 text-green-600"}),"1. Données que nous collectons"]}),t.jsxs("div",{className:"space-y-4 text-gray-700",children:[t.jsxs("div",{children:[t.jsx("h3",{className:"font-semibold text-gray-900 mb-2",children:"Données d'identification"}),t.jsxs("ul",{className:"list-disc list-inside space-y-1 text-sm",children:[t.jsx("li",{children:"Nom et prénom"}),t.jsx("li",{children:"Adresse email et/ou numéro de téléphone"}),t.jsx("li",{children:"Type de producteur (ménage, commerce, entreprise)"}),t.jsx("li",{children:"Localisation (ville, quartier, point de collecte)"})]})]}),t.jsxs("div",{children:[t.jsx("h3",{className:"font-semibold text-gray-900 mb-2",children:"Données de service"}),t.jsxs("ul",{className:"list-disc list-inside space-y-1 text-sm",children:[t.jsx("li",{children:"Historique des déclarations de déchets"}),t.jsx("li",{children:"Types et quantités de déchets déclarés"}),t.jsx("li",{children:"Statut des collectes et suivi"}),t.jsx("li",{children:"Points et récompenses accumulés"})]})]}),t.jsxs("div",{children:[t.jsx("h3",{className:"font-semibold text-gray-900 mb-2",children:"Données techniques"}),t.jsxs("ul",{className:"list-disc list-inside space-y-1 text-sm",children:[t.jsx("li",{children:"Adresse IP et type d'appareil"}),t.jsx("li",{children:"Données de localisation GPS (avec consentement)"}),t.jsx("li",{children:"Préférences et paramètres de l'application"}),t.jsx("li",{children:"Cookies et données de navigation"})]})]}),t.jsxs("div",{children:[t.jsx("h3",{className:"font-semibold text-gray-900 mb-2",children:"Données sensibles"}),t.jsxs("ul",{className:"list-disc list-inside space-y-1 text-sm",children:[t.jsx("li",{children:"Copie de pièce d'identité (CNI recto/verso)"}),t.jsx("li",{children:"Images et documents uploadés"})]})]})]})]}),t.jsxs("section",{children:[t.jsxs("h2",{className:"text-xl font-bold text-gray-900 mb-4 flex items-center gap-2",children:[t.jsx(ta,{className:"w-6 h-6 text-green-600"}),"2. Comment nous utilisons vos données"]}),t.jsxs("div",{className:"space-y-3 text-gray-700",children:[t.jsx("p",{children:"Nous utilisons vos données pour :"}),t.jsxs("ul",{className:"list-disc list-inside space-y-2",children:[t.jsx("li",{children:"Fournir et améliorer nos services de collecte de déchets"}),t.jsx("li",{children:"Coordonner les collectes avec nos partenaires"}),t.jsx("li",{children:"Calculer et attribuer les points de récompense"}),t.jsx("li",{children:"Personnaliser votre expérience utilisateur"}),t.jsx("li",{children:"Communiquer avec vous concernant votre compte et les services"}),t.jsx("li",{children:"Analyser les tendances pour optimiser notre réseau de collecte"}),t.jsx("li",{children:"Assurer la sécurité et prévenir les fraudes"}),t.jsx("li",{children:"Respecter nos obligations légales et réglementaires"})]})]})]}),t.jsxs("section",{children:[t.jsxs("h2",{className:"text-xl font-bold text-gray-900 mb-4 flex items-center gap-2",children:[t.jsx(Ce,{className:"w-6 h-6 text-green-600"}),"3. Base légale du traitement"]}),t.jsxs("div",{className:"space-y-3 text-gray-700",children:[t.jsx("p",{children:"Le traitement de vos données repose sur les bases légales suivantes conformément à la législation camerounaise :"}),t.jsxs("ul",{className:"list-disc list-inside space-y-2",children:[t.jsxs("li",{children:[t.jsx("strong",{children:"Consentement :"})," Pour les données sensibles et la géolocalisation"]}),t.jsxs("li",{children:[t.jsx("strong",{children:"Exécution du contrat :"})," Pour fournir nos services"]}),t.jsxs("li",{children:[t.jsx("strong",{children:"Obligation légale :"})," Pour la lutte contre le blanchiment et la fraude"]}),t.jsxs("li",{children:[t.jsx("strong",{children:"Intérêt légitime :"})," Pour l'amélioration de nos services"]})]})]})]}),t.jsxs("section",{children:[t.jsxs("h2",{className:"text-xl font-bold text-gray-900 mb-4 flex items-center gap-2",children:[t.jsx(Bs,{className:"w-6 h-6 text-green-600"}),"4. Durée de conservation"]}),t.jsxs("div",{className:"space-y-3 text-gray-700",children:[t.jsxs("div",{className:"bg-gray-50 rounded-lg p-4",children:[t.jsx("h3",{className:"font-semibold text-gray-900 mb-2",children:"Périodes de conservation"}),t.jsxs("ul",{className:"space-y-2 text-sm",children:[t.jsxs("li",{children:[t.jsx("strong",{children:"Compte utilisateur :"})," Tant que le compte est actif"]}),t.jsxs("li",{children:[t.jsx("strong",{children:"Données de service :"})," 5 ans après la dernière collecte"]}),t.jsxs("li",{children:[t.jsx("strong",{children:"CNI et documents :"})," 10 ans après clôture du compte"]}),t.jsxs("li",{children:[t.jsx("strong",{children:"Données techniques :"})," 13 mois maximum"]}),t.jsxs("li",{children:[t.jsx("strong",{children:"Cookies :"})," Session ou 12 mois selon le type"]})]})]}),t.jsx("p",{children:"À l'expiration de ces délais, les données sont définitivement supprimées ou anonymisées."})]})]}),t.jsxs("section",{children:[t.jsxs("h2",{className:"text-xl font-bold text-gray-900 mb-4 flex items-center gap-2",children:[t.jsx(ps,{className:"w-6 h-6 text-green-600"}),"5. Partage de vos données"]}),t.jsxs("div",{className:"space-y-3 text-gray-700",children:[t.jsx("p",{children:"Nous ne partageons vos données que dans les cas suivants :"}),t.jsxs("ul",{className:"list-disc list-inside space-y-2",children:[t.jsxs("li",{children:[t.jsx("strong",{children:"Collecteurs agréés :"})," Pour coordonner les collectes"]}),t.jsxs("li",{children:[t.jsx("strong",{children:"Partenaires services :"})," Pour les récompenses et avantages"]}),t.jsxs("li",{children:[t.jsx("strong",{children:"Autorités compétentes :"})," Sur demande légale ou judiciaire"]}),t.jsxs("li",{children:[t.jsx("strong",{children:"Prestataires techniques :"})," Hébergement et maintenance"]})]}),t.jsx("p",{children:"Tous nos partenaires sont tenus par des contrats de confidentialité stricts."})]})]}),t.jsxs("section",{children:[t.jsxs("h2",{className:"text-xl font-bold text-gray-900 mb-4 flex items-center gap-2",children:[t.jsx(dv,{className:"w-6 h-6 text-green-600"}),"6. Sécurité des données"]}),t.jsxs("div",{className:"space-y-3 text-gray-700",children:[t.jsx("p",{children:"Nous mettons en œuvre des mesures de sécurité robustes pour protéger vos données :"}),t.jsxs("ul",{className:"list-disc list-inside space-y-2",children:[t.jsx("li",{children:"Chiffrement SSL/TLS pour toutes les communications"}),t.jsx("li",{children:"Chiffrement des données sensibles dans notre base de données"}),t.jsx("li",{children:"Contrôle d'accès strict et authentification multi-facteurs"}),t.jsx("li",{children:"Sauvegardes régulières et sécurisées"}),t.jsx("li",{children:"Audits de sécurité réguliers"}),t.jsx("li",{children:"Formation du personnel à la protection des données"})]})]})]}),t.jsxs("section",{children:[t.jsxs("h2",{className:"text-xl font-bold text-gray-900 mb-4 flex items-center gap-2",children:[t.jsx(xb,{className:"w-6 h-6 text-green-600"}),"7. Cookies et traceurs"]}),t.jsxs("div",{className:"space-y-3 text-gray-700",children:[t.jsx("p",{children:"Nous utilisons des cookies pour améliorer votre expérience :"}),t.jsxs("ul",{className:"list-disc list-inside space-y-2",children:[t.jsxs("li",{children:[t.jsx("strong",{children:"Cookies essentiels :"})," Pour le fonctionnement de base du site"]}),t.jsxs("li",{children:[t.jsx("strong",{children:"Cookies de performance :"})," Pour analyser l'utilisation du service"]}),t.jsxs("li",{children:[t.jsx("strong",{children:"Cookies de fonctionnalité :"})," Pour mémoriser vos préférences"]})]}),t.jsx("p",{children:"Vous pouvez gérer vos préférences cookies dans les paramètres de votre navigateur."})]})]}),t.jsxs("section",{children:[t.jsxs("h2",{className:"text-xl font-bold text-gray-900 mb-4 flex items-center gap-2",children:[t.jsx(ta,{className:"w-6 h-6 text-green-600"}),"8. Vos droits sur vos données"]}),t.jsxs("div",{className:"space-y-3 text-gray-700",children:[t.jsx("p",{children:"Conformément à la législation, vous disposez des droits suivants :"}),t.jsxs("ul",{className:"list-disc list-inside space-y-2",children:[t.jsxs("li",{children:[t.jsx("strong",{children:"Droit d'accès :"})," Consulter vos données personnelles"]}),t.jsxs("li",{children:[t.jsx("strong",{children:"Droit de rectification :"})," Corriger vos données inexactes"]}),t.jsxs("li",{children:[t.jsx("strong",{children:"Droit de suppression :"})," Demander la suppression de vos données"]}),t.jsxs("li",{children:[t.jsx("strong",{children:"Droit de limitation :"})," Limiter le traitement de vos données"]}),t.jsxs("li",{children:[t.jsx("strong",{children:"Droit de portabilité :"})," Recevoir vos données dans un format lisible"]}),t.jsxs("li",{children:[t.jsx("strong",{children:"Droit d'opposition :"})," Vous opposer au traitement pour motifs légitimes"]})]}),t.jsx("p",{children:"Pour exercer ces droits, contactez-nous à privacy@ecocollect.bf"})]})]}),t.jsxs("section",{children:[t.jsx("h2",{className:"text-xl font-bold text-gray-900 mb-4",children:"9. Modifications de la politique"}),t.jsxs("div",{className:"space-y-3 text-gray-700",children:[t.jsx("p",{children:"Nous pouvons modifier cette politique de confidentialité pour refléter les changements dans nos pratiques ou pour des raisons réglementaires."}),t.jsx("p",{children:"Les modifications seront publiées sur cette page avec la date de mise à jour. Les changements importants feront l'objet d'une notification directe aux utilisateurs."})]})]}),t.jsxs("section",{children:[t.jsx("h2",{className:"text-xl font-bold text-gray-900 mb-4",children:"10. Contact DPO"}),t.jsxs("div",{className:"space-y-3 text-gray-700",children:[t.jsx("p",{children:"Pour toute question concernant cette politique ou pour exercer vos droits, contactez notre Délégué à la Protection des Données :"}),t.jsx("div",{className:"bg-gray-50 rounded-lg p-4",children:t.jsxs("ul",{className:"space-y-2 text-sm",children:[t.jsxs("li",{children:[t.jsx("strong",{children:"Email :"})," dpo@ecocollect.cm"]}),t.jsxs("li",{children:[t.jsx("strong",{children:"Téléphone :"})," +237 XX XX XX XX"]}),t.jsxs("li",{children:[t.jsx("strong",{children:"Adresse :"})," Douala, Cameroun"]})]})})]})]}),t.jsx("div",{className:"border-t pt-6 mt-8",children:t.jsx("p",{className:"text-center text-sm text-gray-600",children:"© 2024 EcoCollect. Tous droits réservés."})})]})]})}),iy=()=>{const[i,u]=v.useState(!1),[o,d]=v.useState(!1),[x,b]=v.useState(!1),m=v.useRef(null),N=v.useRef(null),f=v.useRef(null),g=v.useRef([]),j=v.useRef({x:0,y:0}),p=v.useRef({x:0,y:0}),E=v.useRef(null),L=v.useRef(null);v.useEffect(()=>{i?document.body.classList.add("dark-mode"):document.body.classList.remove("dark-mode")},[i]),v.useEffect(()=>{const k=O=>{j.current={x:O.clientX,y:O.clientY}},A=()=>{m.current&&N.current&&(m.current.style.left=j.current.x+"px",m.current.style.top=j.current.y+"px",p.current.x+=(j.current.x-p.current.x)*.12,p.current.y+=(j.current.y-p.current.y)*.12,N.current.style.left=p.current.x+"px",N.current.style.top=p.current.y+"px"),requestAnimationFrame(A)};return document.addEventListener("mousemove",k),A(),()=>document.removeEventListener("mousemove",k)},[]),v.useEffect(()=>{const k=f.current,A=k.getContext("2d");let O,$;const Y=i?["rgba(45,138,94,","rgba(45,138,94,","rgba(45,138,94,"]:["rgba(45,138,94,","rgba(45,138,94,","rgba(45,138,94,"],Z=()=>{const z=Y[Math.floor(Math.random()*Y.length)];return{x:Math.random()*O,y:Math.random()*$,r:Math.random()*1.8+.4,vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.25,alpha:i?Math.random()*.2+.1:Math.random()*.4+.1,color:z}},ee=()=>{O=k.width=window.innerWidth,$=k.height=window.innerHeight,g.current=[];for(let z=0;z<60;z++)g.current.push(Z())},F=()=>{A.clearRect(0,0,O,$),g.current.forEach(z=>{z.x+=z.vx,z.y+=z.vy,z.x<0&&(z.x=O),z.x>O&&(z.x=0),z.y<0&&(z.y=$),z.y>$&&(z.y=0),A.beginPath(),A.arc(z.x,z.y,z.r,0,Math.PI*2),A.fillStyle=z.color+z.alpha+")",A.fill()});for(let z=0;z<g.current.length;z++)for(let Q=z+1;Q<g.current.length;Q++){const ie=g.current[z].x-g.current[Q].x,ye=g.current[z].y-g.current[Q].y,Ge=Math.sqrt(ie*ie+ye*ye);Ge<120&&(A.beginPath(),A.strokeStyle=`rgba(45,138,94,${i?.02:.04*(1-Ge/120)})`,A.lineWidth=.5,A.moveTo(g.current[z].x,g.current[z].y),A.lineTo(g.current[Q].x,g.current[Q].y),A.stroke())}requestAnimationFrame(F)};return ee(),window.addEventListener("resize",ee),F(),()=>{window.removeEventListener("resize",ee)}},[i]),v.useEffect(()=>{const k=()=>{d(window.scrollY>60)};return window.addEventListener("scroll",k),()=>window.removeEventListener("scroll",k)},[]),v.useEffect(()=>{const k=document.querySelectorAll(".reveal"),A=new IntersectionObserver(O=>{O.forEach($=>{$.isIntersecting&&$.target.classList.add("visible")})},{threshold:.12});return k.forEach(O=>A.observe(O)),()=>A.disconnect()},[]),v.useEffect(()=>{const k=(O,$,Y="")=>{let Z=0;const ee=$/60,F=setInterval(()=>{Z+=ee,Z>=$&&(Z=$,clearInterval(F));const z=$>=1e3?(Z/1e3).toFixed($>=1e4?0:1)+"k":Math.round(Z)+(Y||"");O.textContent=z+(Y&&$<1e3?Y:"")},20)},A=new IntersectionObserver(O=>{O.forEach($=>{if($.isIntersecting){const Y=$.target.querySelector(".stat-num"),Z=Y.textContent;Z.includes("k")||Z.includes("T")?k(Y,parseFloat(Z)*1e3,""):Z.includes("%")?k(Y,parseInt(Z),"%"):k(Y,parseInt(Z.replace(",","")),""),A.unobserve($.target)}})},{threshold:.5});return document.querySelectorAll(".stat-item").forEach(O=>A.observe(O)),()=>A.disconnect()},[]);const M=(k,A)=>{k.preventDefault();const O=document.getElementById(A);O&&O.scrollIntoView({behavior:"smooth",block:"start"}),b(!1)};return v.useEffect(()=>{const k=A=>{L.current&&!L.current.contains(A.target)&&!A.target.closest(".nav-hamburger")&&b(!1)};return document.addEventListener("mousedown",k),()=>document.removeEventListener("mousedown",k)},[]),t.jsxs(t.Fragment,{children:[t.jsx("style",{children:`
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Serif+Display:ital@0;1&display=swap');

  :root {
    /* Palette claire */
    --background: #f8faf8;
    --foreground: #1a1e1a;
    --card: #ffffff;
    --card-foreground: #1a1e1a;
    --primary: #2d8a5e;
    --primary-foreground: #ffffff;
    --secondary: #e8f3e8;
    --secondary-foreground: #1a5c3a;
    --muted: #f0f3f0;
    --muted-foreground: #5a655a;
    --accent: #e0a020;
    --accent-foreground: #3d2d06;
    --destructive: #dc2626;
    --border: #d9e0d9;
    --ring: #2d8a5e;
    --radius: 0.75rem;
    --shadow: 0 4px 20px -4px rgba(0, 0, 0, 0.05);
    --shadow-lg: 0 10px 40px -8px rgba(0, 0, 0, 0.08);
    --shadow-colored: 0 4px 20px -4px rgba(45, 138, 94, 0.15);
    --nav-bg: linear-gradient(to bottom, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.8));
    --nav-border: rgba(0, 0, 0, 0.05);
  }

  /* ========== MODE SOMBRE ========== */
  .dark-mode {
    --background: #0f1a14;
    --foreground: #e8efe8;
    --card: #1e2a22;
    --card-foreground: #e8efe8;
    --primary: #3cb371;
    --primary-foreground: #0f1a14;
    --secondary: #1a2a20;
    --secondary-foreground: #9fd3a5;
    --muted: #25312b;
    --muted-foreground: #9aa89e;
    --accent: #c68b1c;
    --accent-foreground: #fef7e6;
    --border: #2d3d33;
    --ring: #3cb371;
    --shadow: 0 4px 20px -4px rgba(0, 0, 0, 0.3);
    --shadow-lg: 0 10px 40px -8px rgba(0, 0, 0, 0.5);
    --shadow-colored: 0 4px 20px -4px rgba(60, 179, 113, 0.3);
    --nav-bg: linear-gradient(to bottom, rgba(15, 26, 20, 0.95), rgba(15, 26, 20, 0.8));
    --nav-border: rgba(255, 255, 255, 0.05);
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Outfit', sans-serif;
    background: var(--background);
    color: var(--foreground);
    line-height: 1.6;
    overflow-x: hidden;
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  /* ========== MODE SOMBRE - ÉLÉMENTS SPÉCIFIQUES ========== */
  .dark-mode .cursor-dot {
    background: var(--primary);
    box-shadow: 0 0 12px var(--primary);
  }

  .dark-mode .cursor-ring {
    border-color: rgba(60, 179, 113, 0.3);
  }

  .dark-mode nav {
    background: var(--nav-bg);
    border-bottom-color: var(--nav-border);
  }

  .dark-mode nav.scrolled {
    background: rgba(15, 26, 20, 0.98);
  }

  .dark-mode .step-card,
  .dark-mode .waste-tile,
  .dark-mode .testi-card,
  .dark-mode .points-card,
  .dark-mode .reward-chip {
    background: var(--card);
    border-color: var(--border);
  }

  .dark-mode .btn-ghost {
    color: var(--muted-foreground);
  }

  .dark-mode .btn-ghost:hover {
    color: var(--foreground);
  }

  .dark-mode .stats-band {
    background: var(--card);
    border-color: var(--border);
  }

  .dark-mode footer {
    background: var(--card);
    border-color: var(--border);
  }

  /* ========== CUSTOM CURSOR ========== */
  .cursor {
    position: fixed;
    top: 0;
    left: 0;
    pointer-events: none;
    z-index: 9999;
  }

  .cursor-dot {
    width: 8px;
    height: 8px;
    background: var(--primary);
    border-radius: 50%;
    position: absolute;
    transform: translate(-50%, -50%);
    transition: transform 0.1s;
    box-shadow: 0 0 12px var(--primary);
  }

  .cursor-ring {
    width: 36px;
    height: 36px;
    border: 1.5px solid rgba(45, 138, 94, 0.3);
    border-radius: 50%;
    position: absolute;
    transform: translate(-50%, -50%);
    transition: all 0.18s cubic-bezier(0.4, 0, 0.2, 1);
  }

  body:has(a:hover) .cursor-ring,
  body:has(button:hover) .cursor-ring {
    transform: translate(-50%, -50%) scale(1.8);
    background: rgba(45, 138, 94, 0.05);
  }

  /* ========== MENU MOBILE ========== */
  .mobile-menu {
    position: fixed;
    top: 80px;
    left: 0;
    right: 0;
    background: var(--card);
    border-bottom: 1px solid var(--border);
    padding: 1.5rem;
    z-index: 99;
    transform: translateY(-100%);
    opacity: 0;
    transition: transform 0.3s ease, opacity 0.3s ease;
    box-shadow: var(--shadow-lg);
    backdrop-filter: blur(10px);
    pointer-events: none;
  }

  .mobile-menu.open {
    transform: translateY(0);
    opacity: 1;
    pointer-events: all;
  }

  .mobile-menu-links {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .mobile-menu-links a {
    display: block;
    padding: 0.75rem 1rem;
    color: var(--foreground);
    text-decoration: none;
    font-weight: 500;
    border-radius: 8px;
    transition: all 0.2s;
  }

  .mobile-menu-links a:hover {
    background: var(--primary);
    color: white;
  }

  .mobile-menu-cta {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--border);
  }

  .mobile-menu-cta .btn-ghost,
  .mobile-menu-cta .btn-pill {
    width: 100%;
    text-align: center;
    padding: 0.75rem;
  }

  /* ========== PARTICLES CANVAS ========== */
  #particles {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    opacity: 0.5;
  }

  /* ========== NAVIGATION ========== */
  nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    padding: 1.5rem 4rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--nav-bg);
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
    border-bottom: 1px solid var(--nav-border);
  }

  nav.scrolled {
    padding: 1rem 4rem;
    background: rgba(255, 255, 255, 0.98);
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.03);
  }

  .dark-mode nav.scrolled {
    background: rgba(15, 26, 20, 0.98);
  }

  .nav-logo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-family: 'Outfit', sans-serif;
    font-weight: 800;
    font-size: 1.35rem;
    color: var(--foreground);
    text-decoration: none;
  }

  .nav-links {
    display: flex;
    gap: 2.5rem;
    list-style: none;
  }

  @media (max-width: 768px) {
    .nav-links {
      display: none;
    }
  }

  .nav-links a {
    color: var(--muted-foreground);
    font-size: 0.95rem;
    font-weight: 500;
    text-decoration: none;
    letter-spacing: 0.02em;
    transition: color 0.2s;
    position: relative;
  }

  .nav-links a::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 2px;
    background: var(--primary);
    transition: width 0.3s ease;
  }

  .nav-links a:hover {
    color: var(--foreground);
  }

  .nav-links a:hover::after {
    width: 100%;
  }

  .nav-cta {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  @media (max-width: 768px) {
    .nav-cta {
      display: none;
    }
  }

  .theme-toggle {
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 50%;
    transition: all 0.2s;
    color: var(--foreground);
  }

  .theme-toggle:hover {
    background: rgba(45, 138, 94, 0.1);
  }

  .btn-ghost {
    color: var(--muted-foreground);
    font-size: 0.95rem;
    font-weight: 500;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem 1rem;
    border-radius: 100px;
    transition: color 0.2s;
    font-family: 'Outfit', sans-serif;
  }

  .btn-ghost:hover {
    color: var(--foreground);
  }

  .btn-pill {
    background: var(--primary);
    color: white;
    font-family: 'Outfit', sans-serif;
    font-size: 0.95rem;
    font-weight: 600;
    border: none;
    cursor: pointer;
    padding: 0.65rem 1.6rem;
    border-radius: 100px;
    transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow: 0 4px 15px rgba(45, 138, 94, 0.2);
  }

  .btn-pill:hover {
    transform: scale(1.06);
    box-shadow: 0 8px 25px rgba(45, 138, 94, 0.3);
  }

  .nav-hamburger {
    display: none;
    flex-direction: column;
    gap: 5px;
    background: none;
    border: none;
    padding: 0.5rem;
    cursor: pointer;
    z-index: 101;
  }

  .nav-hamburger span {
    width: 24px;
    height: 2px;
    background: var(--foreground);
    border-radius: 2px;
    transition: all 0.3s;
  }

  .nav-hamburger.active span:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
  }

  .nav-hamburger.active span:nth-child(2) {
    opacity: 0;
  }

  .nav-hamburger.active span:nth-child(3) {
    transform: rotate(-45deg) translate(7px, -7px);
  }

  @media (max-width: 768px) {
    .nav-hamburger {
      display: flex;
    }
    
    nav {
      padding: 1.25rem 1.5rem;
    }
    
    nav.scrolled {
      padding: 1rem 1.5rem;
    }
  }

  /* ========== HERO SECTION ========== */
  .hero {
    position: relative;
    z-index: 2;
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 0 4rem;
    text-align: center;
    overflow: hidden;
  }

  @media (max-width: 768px) {
    .hero {
      padding: 0 1.5rem;
    }
  }

  .hero-glow {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(ellipse 80% 60% at 50% 60%, rgba(45, 138, 94, 0.05) 0%, transparent 70%);
  }

  .orbit-ring {
    position: absolute;
    border-radius: 50%;
    border: 1px solid;
    animation: spin linear infinite;
    pointer-events: none;
  }

  .orbit-1 {
    width: 700px;
    height: 700px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-color: rgba(45, 138, 94, 0.1);
    animation-duration: 40s;
  }

  .orbit-2 {
    width: 500px;
    height: 500px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(30deg);
    border-color: rgba(45, 138, 94, 0.08);
    animation-duration: 25s;
    animation-direction: reverse;
  }

  .orbit-3 {
    width: 900px;
    height: 900px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-15deg);
    border-color: rgba(45, 138, 94, 0.05);
    animation-duration: 60s;
  }

  @keyframes spin {
    to {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }

  @keyframes spin-reverse {
    from {
      transform: translate(-50%, -50%) rotate(30deg);
    }
    to {
      transform: translate(-50%, -50%) rotate(-330deg);
    }
  }

  .orbit-2 {
    animation-name: spin-reverse;
  }

  .hero-inner {
    position: relative;
    max-width: 900px;
    margin: 0 auto;
  }

  .hero-title {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(3.5rem, 8vw, 7.5rem);
    line-height: 1;
    margin-bottom: 1.75rem;
    color: var(--foreground);
  }

  .hero-title em {
    font-style: italic;
    color: var(--primary);
  }

  .hero-sub {
    font-size: 1.2rem;
    font-weight: 300;
    line-height: 1.7;
    color: var(--muted-foreground);
    max-width: 580px;
    margin: 0 auto 3rem;
  }

  .hero-actions {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.25rem;
    flex-wrap: wrap;
  }

  @media (max-width: 480px) {
    .hero-actions {
      flex-direction: column;
      width: 100%;
    }
  }

  .btn-primary-hero {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    background: var(--primary);
    color: white;
    font-family: 'Outfit', sans-serif;
    font-weight: 600;
    font-size: 1.05rem;
    border: none;
    cursor: pointer;
    padding: 1rem 2.25rem;
    border-radius: 100px;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow: 0 4px 20px rgba(45, 138, 94, 0.25);
  }

  .btn-primary-hero:hover {
    transform: translateY(-3px) scale(1.04);
    box-shadow: 0 8px 30px rgba(45, 138, 94, 0.35);
  }

  .btn-outline-hero {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    background: transparent;
    color: var(--foreground);
    font-family: 'Outfit', sans-serif;
    font-weight: 500;
    font-size: 1.05rem;
    border: 1px solid var(--border);
    cursor: pointer;
    padding: 1rem 2.25rem;
    border-radius: 100px;
    transition: all 0.3s ease;
    backdrop-filter: blur(8px);
  }

  .btn-outline-hero:hover {
    border-color: var(--primary);
    color: var(--primary);
    background: rgba(45, 138, 94, 0.05);
  }

  @media (max-width: 480px) {
    .btn-primary-hero,
    .btn-outline-hero {
      width: 100%;
      justify-content: center;
    }
  }

  /* Floating stat cards */
  .hero-stats {
    position: absolute;
    pointer-events: none;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }

  @media (max-width: 768px) {
    .hero-stats {
      display: none;
    }
  }

  .stat-float {
    position: absolute;
    background: var(--card);
    border: 1px solid var(--border);
    backdrop-filter: blur(16px);
    border-radius: 16px;
    padding: 1rem 1.4rem;
    animation: floatCard 6s ease-in-out infinite;
    box-shadow: var(--shadow);
  }

  .stat-float-1 {
    left: 5%;
    top: 20%;
    animation-delay: 0s;
  }

  .stat-float-2 {
    right: 5%;
    top: 30%;
    animation-delay: 1.5s;
  }

  .stat-float-3 {
    left: 8%;
    bottom: 25%;
    animation-delay: 3s;
  }

  @keyframes floatCard {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-14px);
    }
  }

  .stat-float-icon {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
  }

  .stat-float-num {
    font-size: 1.8rem;
    font-weight: 800;
    color: var(--primary);
    line-height: 1;
    margin-bottom: 0.2rem;
  }

  .stat-float-label {
    font-size: 0.78rem;
    color: var(--muted-foreground);
    font-weight: 500;
  }

  /* Scroll indicator */
  .scroll-hint {
    position: absolute;
    bottom: 2.5rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    color: var(--muted-foreground);
    font-size: 0.78rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .scroll-line {
    width: 1px;
    height: 40px;
    background: linear-gradient(to bottom, var(--primary), transparent);
    animation: scrollBob 2s ease-in-out infinite;
  }

  @keyframes scrollBob {
    0%, 100% {
      transform: scaleY(1);
      opacity: 1;
    }
    50% {
      transform: scaleY(0.6);
      opacity: 0.5;
    }
  }

  /* ========== SECTIONS ========== */
  section {
    position: relative;
    z-index: 2;
  }

  .section-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 4rem;
  }

  @media (max-width: 768px) {
    .section-inner {
      padding: 0 1.5rem;
    }
  }

  /* How it works section */
  .how {
    padding: 10rem 0;
    background: linear-gradient(to bottom, transparent, var(--secondary), transparent);
  }

  .section-label {
    font-size: 0.85rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--primary);
    margin-bottom: 1rem;
  }

  .section-heading {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(2.5rem, 5vw, 4rem);
    line-height: 1.1;
    margin-bottom: 1.25rem;
    color: var(--foreground);
  }

  .section-sub {
    font-size: 1.1rem;
    color: var(--muted-foreground);
    max-width: 520px;
    line-height: 1.7;
  }

  .steps-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
    margin-top: 5rem;
  }

  @media (max-width: 1100px) {
    .steps-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 768px) {
    .steps-grid {
      grid-template-columns: 1fr;
    }
  }

  .step-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 2.25rem 1.75rem;
    position: relative;
    overflow: hidden;
    transition: all 0.4s ease;
    cursor: default;
    box-shadow: var(--shadow);
  }

  .step-card:hover {
    border-color: var(--primary);
    transform: translateY(-6px);
    box-shadow: var(--shadow-lg);
  }

  .step-num {
    font-size: 3.5rem;
    font-weight: 900;
    color: rgba(45, 138, 94, 0.1);
    line-height: 1;
    margin-bottom: 1.5rem;
    font-family: 'Outfit', sans-serif;
  }

  .step-icon-wrap {
    width: 52px;
    height: 52px;
    background: rgba(45, 138, 94, 0.1);
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.25rem;
    font-size: 1.4rem;
    border: 1px solid rgba(45, 138, 94, 0.2);
  }

  .step-title {
    font-size: 1.2rem;
    font-weight: 700;
    margin-bottom: 0.65rem;
    color: var(--foreground);
  }

  .step-desc {
    font-size: 0.95rem;
    color: var(--muted-foreground);
    line-height: 1.65;
  }

  .step-connector {
    position: absolute;
    top: 2.8rem;
    right: -1rem;
    width: 2rem;
    height: 1px;
    background: linear-gradient(to right, rgba(45, 138, 94, 0.3), transparent);
  }

  @media (max-width: 1100px) {
    .step-connector {
      display: none;
    }
  }

  .step-card:last-child .step-connector {
    display: none;
  }

  /* Waste types section */
  .waste {
    padding: 8rem 0;
  }

  .waste-flex {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6rem;
    align-items: center;
    margin-top: 4rem;
  }

  @media (max-width: 1100px) {
    .waste-flex {
      grid-template-columns: 1fr;
    }
  }

  .waste-tiles {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }

  @media (max-width: 768px) {
    .waste-tiles {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 480px) {
    .waste-tiles {
      grid-template-columns: 1fr;
    }
  }

  .waste-tile {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 18px;
    padding: 1.5rem 1.25rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    text-align: center;
    transition: all 0.35s ease;
    cursor: default;
    box-shadow: var(--shadow);
  }

  .waste-tile:hover {
    border-color: var(--primary);
    background: rgba(45, 138, 94, 0.02);
    transform: scale(1.04);
    box-shadow: var(--shadow-lg);
  }

  .waste-emoji {
    font-size: 2rem;
  }

  .waste-name {
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--foreground);
  }

  .waste-sub {
    font-size: 0.8rem;
    color: var(--muted-foreground);
  }

  .feature-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .feature-item {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
  }

  .feature-check {
    width: 24px;
    height: 24px;
    min-width: 24px;
    background: rgba(45, 138, 94, 0.1);
    border: 1px solid rgba(45, 138, 94, 0.2);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    color: var(--primary);
    margin-top: 0.1rem;
  }

  .feature-item-text {
    font-size: 0.95rem;
    color: var(--muted-foreground);
    line-height: 1.6;
  }

  .feature-item-text strong {
    color: var(--foreground);
  }

  /* Stats band */
  .stats-band {
    padding: 5rem 0;
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    background: var(--card);
  }

  .stats-band-inner {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
    text-align: center;
  }

  @media (max-width: 1100px) {
    .stats-band-inner {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 768px) {
    .stats-band-inner {
      grid-template-columns: 1fr 1fr;
    }
  }

  @media (max-width: 480px) {
    .stats-band-inner {
      grid-template-columns: 1fr;
    }
  }

  .stat-item {
    padding: 1rem;
  }

  .stat-num {
    font-size: 3rem;
    font-weight: 900;
    font-family: 'Outfit', sans-serif;
    color: var(--primary);
    line-height: 1;
    margin-bottom: 0.5rem;
  }

  .stat-desc {
    font-size: 0.95rem;
    color: var(--muted-foreground);
  }

  /* Rewards section */
  .rewards {
    padding: 8rem 0;
    background: linear-gradient(to bottom, transparent, var(--secondary), transparent);
  }

  .rewards-inner {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6rem;
    align-items: center;
  }

  @media (max-width: 1100px) {
    .rewards-inner {
      grid-template-columns: 1fr;
    }
  }

  .rewards-visual {
    position: relative;
    height: 420px;
  }

  @media (max-width: 1100px) {
    .rewards-visual {
      height: 320px;
    }
  }

  .points-card {
    position: absolute;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 24px;
    backdrop-filter: blur(20px);
    box-shadow: var(--shadow-lg);
  }

  .points-main {
    width: 300px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 2rem;
  }

  .points-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .points-label {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--muted-foreground);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .points-badge {
    background: rgba(45, 138, 94, 0.1);
    color: var(--primary);
    font-size: 0.75rem;
    font-weight: 700;
    padding: 0.25rem 0.7rem;
    border-radius: 100px;
    border: 1px solid rgba(45, 138, 94, 0.2);
  }

  .points-big {
    font-size: 3.5rem;
    font-weight: 900;
    color: var(--primary);
    font-family: 'Outfit', sans-serif;
    line-height: 1;
    margin-bottom: 0.25rem;
  }

  .points-unit {
    font-size: 0.95rem;
    color: var(--muted-foreground);
    margin-bottom: 1.5rem;
  }

  .points-bar-wrap {
    background: var(--muted);
    border-radius: 100px;
    height: 6px;
    overflow: hidden;
  }

  .points-bar {
    width: 72%;
    height: 100%;
    background: linear-gradient(90deg, var(--primary), #5daa5d);
    border-radius: 100px;
  }

  .points-footer {
    display: flex;
    justify-content: space-between;
    margin-top: 0.75rem;
    font-size: 0.85rem;
    color: var(--muted-foreground);
  }

  .reward-chip {
    position: absolute;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 0.85rem 1.1rem;
    backdrop-filter: blur(16px);
    display: flex;
    align-items: center;
    gap: 0.75rem;
    animation: floatCard 5s ease-in-out infinite;
    box-shadow: var(--shadow);
  }

  .reward-chip-1 {
    top: 5%;
    right: -20px;
    animation-delay: 0s;
  }

  .reward-chip-2 {
    bottom: 8%;
    left: -10px;
    animation-delay: 2s;
  }

  .reward-chip-icon {
    font-size: 1.4rem;
  }

  .reward-chip-txt strong {
    display: block;
    font-size: 0.95rem;
    color: var(--foreground);
    font-weight: 600;
  }

  .reward-chip-txt span {
    font-size: 0.8rem;
    color: var(--muted-foreground);
  }

  /* Testimonials */
  .testimonials {
    padding: 8rem 0;
  }

  .testi-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
    margin-top: 5rem;
  }

  @media (max-width: 1100px) {
    .testi-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 768px) {
    .testi-grid {
      grid-template-columns: 1fr;
    }
  }

  .testi-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 2rem;
    transition: all 0.35s ease;
    box-shadow: var(--shadow);
  }

  .testi-card:hover {
    border-color: var(--primary);
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
  }

  .testi-stars {
    color: var(--accent);
    margin-bottom: 1.25rem;
    font-size: 0.95rem;
    letter-spacing: 0.15em;
  }

  .testi-text {
    font-size: 0.95rem;
    color: var(--muted-foreground);
    line-height: 1.7;
    margin-bottom: 1.5rem;
    font-style: italic;
  }

  .testi-author {
    display: flex;
    align-items: center;
    gap: 0.9rem;
  }

  .testi-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    font-weight: 700;
    color: white;
  }

  .av1 {
    background: var(--primary);
  }

  .av2 {
    background: #4299e1;
  }

  .av3 {
    background: var(--accent);
  }

  .testi-name {
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--foreground);
  }

  .testi-role {
    font-size: 0.8rem;
    color: var(--muted-foreground);
  }

  /* CTA Section */
  .cta-section {
    padding: 10rem 0;
    text-align: center;
    position: relative;
    overflow: hidden;
    background: var(--card);
  }

  .cta-glow {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 800px;
    height: 400px;
    background: radial-gradient(ellipse, rgba(45, 138, 94, 0.05) 0%, transparent 70%);
    pointer-events: none;
  }

  .cta-heading {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(3rem, 6vw, 5.5rem);
    line-height: 1.05;
    margin-bottom: 1.5rem;
    color: var(--foreground);
  }

  .cta-heading em {
    font-style: italic;
    color: var(--primary);
  }

  .cta-sub {
    font-size: 1.15rem;
    color: var(--muted-foreground);
    max-width: 500px;
    margin: 0 auto 3rem;
    line-height: 1.7;
  }

  .cta-buttons {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.25rem;
    flex-wrap: wrap;
  }

  .btn-big {
    display: inline-flex;
    align-items: center;
    gap: 0.85rem;
    background: var(--primary);
    color: white;
    font-family: 'Outfit', sans-serif;
    font-weight: 700;
    font-size: 1.1rem;
    border: none;
    cursor: pointer;
    padding: 1.15rem 2.5rem;
    border-radius: 100px;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow: 0 4px 25px rgba(45, 138, 94, 0.3);
  }

  .btn-big:hover {
    transform: translateY(-4px) scale(1.05);
    box-shadow: 0 8px 35px rgba(45, 138, 94, 0.4);
  }

  @media (max-width: 480px) {
    .btn-big,
    .btn-outline-hero {
      width: 100%;
      justify-content: center;
    }
  }

  /* Footer */
  footer {
    border-top: 1px solid var(--border);
    padding: 3.5rem 4rem 2.5rem;
    position: relative;
    z-index: 2;
    background: var(--card);
  }

  @media (max-width: 768px) {
    footer {
      padding: 3rem 1.5rem;
    }
  }

  .footer-inner {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
  }

  .footer-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 2rem;
  }

  @media (max-width: 768px) {
    .footer-top {
      flex-direction: column;
    }
  }

  .footer-tagline {
    font-size: 0.95rem;
    color: var(--muted-foreground);
    max-width: 240px;
    line-height: 1.6;
  }

  .footer-cols {
    display: flex;
    gap: 4rem;
  }

  @media (max-width: 768px) {
    .footer-cols {
      flex-direction: column;
      gap: 2rem;
    }
  }

  .footer-col h4 {
    font-size: 0.9rem;
    font-weight: 700;
    color: var(--foreground);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 1.25rem;
  }

  .footer-col ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .footer-col a {
    font-size: 0.95rem;
    color: var(--muted-foreground);
    text-decoration: none;
    transition: color 0.2s;
  }

  .footer-col a:hover {
    color: var(--primary);
  }

  .footer-bottom {
    border-top: 1px solid var(--border);
    padding-top: 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.9rem;
    color: var(--muted-foreground);
    flex-wrap: wrap;
    gap: 1rem;
  }

  @media (max-width: 768px) {
    .footer-bottom {
      flex-direction: column;
      text-align: center;
    }
  }

  .footer-bottom-lime {
    color: var(--primary);
    font-weight: 600;
  }

  /* Scroll Reveal */
  .reveal {
    opacity: 0;
    transform: translateY(40px);
    transition: opacity 0.7s ease, transform 0.7s ease;
  }

  .reveal.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .reveal-delay-1 {
    transition-delay: 0.1s;
  }

  .reveal-delay-2 {
    transition-delay: 0.2s;
  }

  .reveal-delay-3 {
    transition-delay: 0.3s;
  }

  .reveal-delay-4 {
    transition-delay: 0.4s;
  }

  @media (max-width: 768px) {
    body {
      cursor: auto;
    }
    
    .cursor {
      display: none;
    }
  }
`}),t.jsxs("div",{className:"cursor",id:"cursor",children:[t.jsx("div",{className:"cursor-dot",ref:m}),t.jsx("div",{className:"cursor-ring",ref:N})]}),t.jsx("canvas",{id:"particles",ref:f}),t.jsxs("nav",{id:"nav",ref:E,className:o?"scrolled":"",children:[t.jsx("a",{href:"#",className:"nav-logo",children:t.jsx("img",{src:Hl,alt:"EcoCollect",style:{height:"42px",width:"auto"}})}),t.jsxs("ul",{className:"nav-links",children:[t.jsx("li",{children:t.jsx("a",{href:"#how",onClick:k=>M(k,"how"),children:"Fonctionnement"})}),t.jsx("li",{children:t.jsx("a",{href:"#waste",onClick:k=>M(k,"waste"),children:"Déchets"})}),t.jsx("li",{children:t.jsx("a",{href:"#rewards",onClick:k=>M(k,"rewards"),children:"Récompenses"})}),t.jsx("li",{children:t.jsx("a",{href:"#about",onClick:k=>M(k,"about"),children:"À propos"})})]}),t.jsxs("div",{className:"nav-cta",children:[t.jsx("button",{className:"btn-ghost",onClick:()=>window.location="/login",children:"Se connecter"}),t.jsx("button",{className:"btn-pill",onClick:()=>window.location="/login",children:"Commencer →"}),t.jsx("button",{className:"theme-toggle",onClick:()=>u(!i),children:i?"☀️":"🌙"})]}),t.jsxs("button",{className:`nav-hamburger ${x?"active":""}`,id:"hamburger","aria-label":"Menu",onClick:()=>b(!x),children:[t.jsx("span",{}),t.jsx("span",{}),t.jsx("span",{})]})]}),t.jsxs("div",{className:`mobile-menu ${x?"open":""}`,ref:L,children:[t.jsxs("ul",{className:"mobile-menu-links",children:[t.jsx("li",{children:t.jsx("a",{href:"#how",onClick:k=>M(k,"how"),children:"Fonctionnement"})}),t.jsx("li",{children:t.jsx("a",{href:"#waste",onClick:k=>M(k,"waste"),children:"Déchets"})}),t.jsx("li",{children:t.jsx("a",{href:"#rewards",onClick:k=>M(k,"rewards"),children:"Récompenses"})}),t.jsx("li",{children:t.jsx("a",{href:"#about",onClick:k=>M(k,"about"),children:"À propos"})})]}),t.jsxs("div",{className:"mobile-menu-cta",children:[t.jsx("button",{className:"btn-ghost",onClick:()=>window.location="/login",children:"Se connecter"}),t.jsx("button",{className:"btn-pill",onClick:()=>window.location="/login",children:"Commencer →"}),t.jsx("button",{className:"theme-toggle",onClick:()=>{u(!i),b(!1)},children:i?"☀️ Mode clair":"🌙 Mode sombre"})]})]}),t.jsxs("section",{className:"hero",id:"home",children:[t.jsx("div",{className:"hero-glow"}),t.jsx("div",{className:"orbit-ring orbit-1"}),t.jsx("div",{className:"orbit-ring orbit-2"}),t.jsx("div",{className:"orbit-ring orbit-3"}),t.jsxs("div",{className:"hero-stats",children:[t.jsxs("div",{className:"stat-float stat-float-1",children:[t.jsx("div",{className:"stat-float-icon",children:"♻️"}),t.jsx("div",{className:"stat-float-num",children:"12k+"}),t.jsx("div",{className:"stat-float-label",children:"Collectes ce mois"})]}),t.jsxs("div",{className:"stat-float stat-float-2",children:[t.jsx("div",{className:"stat-float-icon",children:"🏆"}),t.jsx("div",{className:"stat-float-num",children:"850"}),t.jsx("div",{className:"stat-float-label",children:"Points gagnés aujourd'hui"})]}),t.jsxs("div",{className:"stat-float stat-float-3",children:[t.jsx("div",{className:"stat-float-icon",children:"🌱"}),t.jsx("div",{className:"stat-float-num",children:"4.2T"}),t.jsx("div",{className:"stat-float-label",children:"Kg valorisés ce mois"})]})]}),t.jsxs("div",{className:"hero-inner",children:[t.jsxs("h1",{className:"hero-title",children:["Recyclez.",t.jsx("br",{}),t.jsx("em",{children:"Gagnez."}),t.jsx("br",{}),"Impactez."]}),t.jsx("p",{className:"hero-sub",children:"Déclarez vos déchets, suivez vos collectes en temps réel et transformez chaque geste écologique en récompenses concrètes."}),t.jsxs("div",{className:"hero-actions",children:[t.jsxs("button",{className:"btn-primary-hero",onClick:()=>window.location="/login",children:["Créer mon compte gratuit",t.jsx("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round",children:t.jsx("path",{d:"M5 12h14M12 5l7 7-7 7"})})]}),t.jsxs("button",{className:"btn-outline-hero",onClick:()=>document.getElementById("how").scrollIntoView({behavior:"smooth"}),children:[t.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[t.jsx("circle",{cx:"12",cy:"12",r:"10"}),t.jsx("polygon",{points:"10 8 16 12 10 16 10 8"})]}),"Voir comment ça marche"]})]})]}),t.jsxs("div",{className:"scroll-hint",children:[t.jsx("span",{children:"Découvrir"}),t.jsx("div",{className:"scroll-line"})]})]}),t.jsx("section",{className:"how",id:"how",children:t.jsxs("div",{className:"section-inner",children:[t.jsxs("div",{className:"reveal",children:[t.jsx("p",{className:"section-label",children:"⚡ Processus simplifié"}),t.jsxs("h2",{className:"section-heading",children:["Quatre étapes,",t.jsx("br",{}),"un impact réel."]}),t.jsx("p",{className:"section-sub",children:"De l'inscription à la récompense, chaque action est pensée pour être simple, rapide et motivante."})]}),t.jsxs("div",{className:"steps-grid",children:[t.jsxs("div",{className:"step-card reveal reveal-delay-1",children:[t.jsx("div",{className:"step-num",children:"01"}),t.jsx("div",{className:"step-icon-wrap",children:"🪪"}),t.jsx("div",{className:"step-title",children:"Enrôlement"}),t.jsx("div",{className:"step-desc",children:"Créez votre compte en choisissant votre profil : ménage, commerce, entreprise ou administration. Localisez-vous en quelques secondes."}),t.jsx("div",{className:"step-connector"})]}),t.jsxs("div",{className:"step-card reveal reveal-delay-2",children:[t.jsx("div",{className:"step-num",children:"02"}),t.jsx("div",{className:"step-icon-wrap",children:"🗂️"}),t.jsx("div",{className:"step-title",children:"Tri & Préparation"}),t.jsx("div",{className:"step-desc",children:"Triez vos déchets par catégorie — plastique, papier, métal, verre, organique — dans vos contenants ou sacs EcoCollect."}),t.jsx("div",{className:"step-connector"})]}),t.jsxs("div",{className:"step-card reveal reveal-delay-3",children:[t.jsx("div",{className:"step-num",children:"03"}),t.jsx("div",{className:"step-icon-wrap",children:"📋"}),t.jsx("div",{className:"step-title",children:"Déclaration"}),t.jsx("div",{className:"step-desc",children:"Déclarez vos déchets en 3 clics. Choisissez la collecte à domicile ou déposez dans un point de regroupement proche."}),t.jsx("div",{className:"step-connector"})]}),t.jsxs("div",{className:"step-card reveal reveal-delay-4",children:[t.jsx("div",{className:"step-num",children:"04"}),t.jsx("div",{className:"step-icon-wrap",children:"🎁"}),t.jsx("div",{className:"step-title",children:"Collecte & Récompenses"}),t.jsx("div",{className:"step-desc",children:"Suivez votre collecte en temps réel, recevez la confirmation et voyez vos points s'accumuler à chaque action."})]})]})]})}),t.jsx("section",{className:"waste",id:"waste",children:t.jsx("div",{className:"section-inner",children:t.jsxs("div",{className:"waste-flex",children:[t.jsxs("div",{className:"waste-tiles reveal",children:[t.jsxs("div",{className:"waste-tile",children:[t.jsx("div",{className:"waste-emoji",children:"🍶"}),t.jsx("div",{className:"waste-name",children:"Plastique PET"}),t.jsx("div",{className:"waste-sub",children:"Bouteilles, emballages"})]}),t.jsxs("div",{className:"waste-tile",children:[t.jsx("div",{className:"waste-emoji",children:"🪣"}),t.jsx("div",{className:"waste-name",children:"Plastique PEHD"}),t.jsx("div",{className:"waste-sub",children:"Bidons, flacons"})]}),t.jsxs("div",{className:"waste-tile",children:[t.jsx("div",{className:"waste-emoji",children:"📦"}),t.jsx("div",{className:"waste-name",children:"Papier / Carton"}),t.jsx("div",{className:"waste-sub",children:"Boîtes, journaux"})]}),t.jsxs("div",{className:"waste-tile",children:[t.jsx("div",{className:"waste-emoji",children:"🥫"}),t.jsx("div",{className:"waste-name",children:"Métal"}),t.jsx("div",{className:"waste-sub",children:"Canettes, conserves"})]}),t.jsxs("div",{className:"waste-tile",children:[t.jsx("div",{className:"waste-emoji",children:"🍾"}),t.jsx("div",{className:"waste-name",children:"Verre"}),t.jsx("div",{className:"waste-sub",children:"Bouteilles, pots"})]}),t.jsxs("div",{className:"waste-tile",children:[t.jsx("div",{className:"waste-emoji",children:"🌿"}),t.jsx("div",{className:"waste-name",children:"Organique"}),t.jsx("div",{className:"waste-sub",children:"Déchets alimentaires"})]})]}),t.jsxs("div",{className:"waste-text-col reveal reveal-delay-2",children:[t.jsx("p",{className:"section-label kicker",children:"🗑️ Catégories de déchets"}),t.jsxs("h2",{className:"section-heading",children:["Triez tout,",t.jsx("br",{}),"ne ratez rien."]}),t.jsx("p",{className:"section-sub",children:"EcoCollect accepte 6 catégories de déchets recyclables. Chaque type trié et déclaré vous rapporte des points et contribue à un environnement plus propre."}),t.jsxs("ul",{className:"feature-list",style:{marginTop:"2rem"},children:[t.jsxs("li",{className:"feature-item",children:[t.jsx("div",{className:"feature-check",children:"✓"}),t.jsxs("div",{className:"feature-item-text",children:[t.jsx("strong",{children:"Quantités flexibles"})," — déclarez en kg, sacs ou unités"]})]}),t.jsxs("li",{className:"feature-item",children:[t.jsx("div",{className:"feature-check",children:"✓"}),t.jsxs("div",{className:"feature-item-text",children:[t.jsx("strong",{children:"Multi-types"})," — combinez plusieurs catégories en une seule déclaration"]})]}),t.jsxs("li",{className:"feature-item",children:[t.jsx("div",{className:"feature-check",children:"✓"}),t.jsxs("div",{className:"feature-item-text",children:[t.jsx("strong",{children:"Validation instantanée"})," — votre déclaration est traitée en temps réel"]})]}),t.jsxs("li",{className:"feature-item",children:[t.jsx("div",{className:"feature-check",children:"✓"}),t.jsxs("div",{className:"feature-item-text",children:[t.jsx("strong",{children:"Suivi précis"})," — visualisez le poids réel collecté après chaque passage"]})]})]})]})]})})}),t.jsx("section",{className:"stats-band",children:t.jsx("div",{className:"section-inner",children:t.jsxs("div",{className:"stats-band-inner",children:[t.jsxs("div",{className:"stat-item reveal",children:[t.jsx("div",{className:"stat-num",children:"48k+"}),t.jsx("div",{className:"stat-desc",children:"Producteurs actifs"})]}),t.jsxs("div",{className:"stat-item reveal reveal-delay-1",children:[t.jsx("div",{className:"stat-num",children:"120T"}),t.jsx("div",{className:"stat-desc",children:"Déchets valorisés"})]}),t.jsxs("div",{className:"stat-item reveal reveal-delay-2",children:[t.jsx("div",{className:"stat-num",children:"6,200"}),t.jsx("div",{className:"stat-desc",children:"Collectes par mois"})]}),t.jsxs("div",{className:"stat-item reveal reveal-delay-3",children:[t.jsx("div",{className:"stat-num",children:"98%"}),t.jsx("div",{className:"stat-desc",children:"Satisfaction producteurs"})]})]})})}),t.jsx("section",{className:"rewards",id:"rewards",children:t.jsx("div",{className:"section-inner",children:t.jsxs("div",{className:"rewards-inner",children:[t.jsxs("div",{className:"reveal",children:[t.jsx("p",{className:"section-label",children:"🏆 Système de récompenses"}),t.jsxs("h2",{className:"section-heading",children:["Chaque déchet",t.jsx("br",{}),"vous rapporte."]}),t.jsx("p",{className:"section-sub",style:{marginBottom:"2.5rem"},children:"Accumulez des points à chaque collecte validée. Échangez-les contre des avantages, réductions et services exclusifs."}),t.jsxs("ul",{className:"feature-list",children:[t.jsxs("li",{className:"feature-item",children:[t.jsx("div",{className:"feature-check",children:"✓"}),t.jsxs("div",{className:"feature-item-text",children:[t.jsx("strong",{children:"Points automatiques"})," — crédités dès la validation de la collecte"]})]}),t.jsxs("li",{className:"feature-item",children:[t.jsx("div",{className:"feature-check",children:"✓"}),t.jsxs("div",{className:"feature-item-text",children:[t.jsx("strong",{children:"Historique complet"})," — suivez chaque point gagné et dépensé"]})]}),t.jsxs("li",{className:"feature-item",children:[t.jsx("div",{className:"feature-check",children:"✓"}),t.jsxs("div",{className:"feature-item-text",children:[t.jsx("strong",{children:"Niveaux & badges"})," — progressez et montrez votre engagement"]})]}),t.jsxs("li",{className:"feature-item",children:[t.jsx("div",{className:"feature-check",children:"✓"}),t.jsxs("div",{className:"feature-item-text",children:[t.jsx("strong",{children:"Récompenses locales"})," — partenaires et offres dans votre commune"]})]})]})]}),t.jsxs("div",{className:"rewards-visual reveal reveal-delay-2",children:[t.jsxs("div",{className:"reward-chip reward-chip-1",children:[t.jsx("div",{className:"reward-chip-icon",children:"🎫"}),t.jsxs("div",{className:"reward-chip-txt",children:[t.jsx("strong",{children:"Bon de réduction"}),t.jsx("span",{children:"-15% chez nos partenaires"})]})]}),t.jsxs("div",{className:"reward-chip reward-chip-2",children:[t.jsx("div",{className:"reward-chip-icon",children:"⚡"}),t.jsxs("div",{className:"reward-chip-txt",children:[t.jsx("strong",{children:"+50 pts bonus"}),t.jsx("span",{children:"Collecte express validée"})]})]}),t.jsxs("div",{className:"points-card points-main",children:[t.jsxs("div",{className:"points-header",children:[t.jsx("div",{className:"points-label",children:"Mon solde EcoPoints"}),t.jsx("div",{className:"points-badge",children:"🟢 Actif"})]}),t.jsx("div",{className:"points-big",children:"2 450"}),t.jsx("div",{className:"points-unit",children:"points disponibles"}),t.jsx("div",{className:"points-bar-wrap",children:t.jsx("div",{className:"points-bar"})}),t.jsxs("div",{className:"points-footer",children:[t.jsx("span",{children:"Niveau Argent"}),t.jsx("span",{children:"550 pts → Or"})]})]})]})]})})}),t.jsx("section",{className:"testimonials",id:"about",children:t.jsxs("div",{className:"section-inner",children:[t.jsxs("div",{className:"reveal",style:{textAlign:"center",maxWidth:"600px",margin:"0 auto 1rem"},children:[t.jsx("p",{className:"section-label",children:"💬 Ils nous font confiance"}),t.jsxs("h2",{className:"section-heading",children:["Ce que disent",t.jsx("br",{}),"nos producteurs."]})]}),t.jsxs("div",{className:"testi-grid",children:[t.jsxs("div",{className:"testi-card reveal reveal-delay-1",children:[t.jsx("div",{className:"testi-stars",children:"★★★★★"}),t.jsx("p",{className:"testi-text",children:`"Depuis EcoCollect, on ne rate plus aucune collecte. L'application nous notifie à l'avance et les points s'accumulent automatiquement. Vraiment bien pensé."`}),t.jsxs("div",{className:"testi-author",children:[t.jsx("div",{className:"testi-avatar av1",children:"A"}),t.jsxs("div",{children:[t.jsx("div",{className:"testi-name",children:"Aminata K."}),t.jsx("div",{className:"testi-role",children:"Ménage — Douala 3"})]})]})]}),t.jsxs("div",{className:"testi-card reveal reveal-delay-2",children:[t.jsx("div",{className:"testi-stars",children:"★★★★★"}),t.jsx("p",{className:"testi-text",children:'"En tant que gérant de restaurant, on génère beaucoup de déchets. EcoCollect nous a permis de structurer notre tri et de valoriser nos emballages carton efficacement."'}),t.jsxs("div",{className:"testi-author",children:[t.jsx("div",{className:"testi-avatar av2",children:"J"}),t.jsxs("div",{children:[t.jsx("div",{className:"testi-name",children:"Jean-Pierre M."}),t.jsx("div",{className:"testi-role",children:"Commerce — Bafoussam"})]})]})]}),t.jsxs("div",{className:"testi-card reveal reveal-delay-3",children:[t.jsx("div",{className:"testi-stars",children:"★★★★★"}),t.jsx("p",{className:"testi-text",children:`"Notre PME produit du plastique industriel. Avec la fonctionnalité 'Entreprise', on gère nos flux de déchets proprement et on obtient des attestations pour nos clients."`}),t.jsxs("div",{className:"testi-author",children:[t.jsx("div",{className:"testi-avatar av3",children:"F"}),t.jsxs("div",{children:[t.jsx("div",{className:"testi-name",children:"Fatou B."}),t.jsx("div",{className:"testi-role",children:"Entreprise — Yaoundé"})]})]})]})]})]})}),t.jsxs("section",{className:"cta-section",children:[t.jsx("div",{className:"cta-glow"}),t.jsxs("div",{className:"section-inner",style:{position:"relative"},children:[t.jsx("p",{className:"section-label reveal",children:"🌍 Rejoignez le mouvement"}),t.jsxs("h2",{className:"cta-heading reveal",children:["Votre déchet,",t.jsx("br",{}),t.jsx("em",{children:"notre ressource."})]}),t.jsx("p",{className:"cta-sub reveal",children:"Plus de 48 000 producteurs font déjà partie d'EcoCollect. Commencez gratuitement aujourd'hui et transformez chaque geste en impact."}),t.jsxs("div",{className:"cta-buttons reveal",children:[t.jsxs("button",{className:"btn-big",onClick:()=>window.location="/login",children:[t.jsx("span",{children:"🚀"}),"Rejoindre EcoCollect"]}),t.jsx("button",{className:"btn-outline-hero",onClick:()=>window.location="/login",children:"J'ai déjà un compte →"})]})]})]}),t.jsx("footer",{children:t.jsxs("div",{className:"footer-inner",children:[t.jsxs("div",{className:"footer-top",children:[t.jsxs("div",{className:"footer-logo-wrap",children:[t.jsx("a",{href:"#",className:"nav-logo",children:t.jsx("img",{src:"/logo.jpeg",alt:"EcoCollect",style:{height:"38px",width:"auto"}})}),t.jsx("p",{className:"footer-tagline",children:"Plateforme intelligente de gestion et valorisation des déchets recyclables."})]}),t.jsxs("div",{className:"footer-cols",children:[t.jsxs("div",{className:"footer-col",children:[t.jsx("h4",{children:"Plateforme"}),t.jsxs("ul",{children:[t.jsx("li",{children:t.jsx("a",{href:"#",children:"Fonctionnement"})}),t.jsx("li",{children:t.jsx("a",{href:"#",children:"Types de déchets"})}),t.jsx("li",{children:t.jsx("a",{href:"#",children:"Récompenses"})}),t.jsx("li",{children:t.jsx("a",{href:"#",children:"Points de dépôt"})})]})]}),t.jsxs("div",{className:"footer-col",children:[t.jsx("h4",{children:"Producteurs"}),t.jsxs("ul",{children:[t.jsx("li",{children:t.jsx("a",{href:"#",children:"Ménages"})}),t.jsx("li",{children:t.jsx("a",{href:"#",children:"Commerces"})}),t.jsx("li",{children:t.jsx("a",{href:"#",children:"Entreprises"})}),t.jsx("li",{children:t.jsx("a",{href:"#",children:"Administrations"})})]})]}),t.jsxs("div",{className:"footer-col",children:[t.jsx("h4",{children:"Légal"}),t.jsxs("ul",{children:[t.jsx("li",{children:t.jsx("a",{href:"#",children:"CGU"})}),t.jsx("li",{children:t.jsx("a",{href:"#",children:"Confidentialité"})}),t.jsx("li",{children:t.jsx("a",{href:"#",children:"Mentions légales"})}),t.jsx("li",{children:t.jsx("a",{href:"#",children:"Contact"})})]})]})]})]}),t.jsxs("div",{className:"footer-bottom",children:[t.jsx("a",{href:"#",className:"nav-logo",children:t.jsx("img",{src:"/logo.jpeg",alt:"EcoCollect",style:{height:"38px",width:"auto"}})}),t.jsxs("span",{children:["© 2026 ",t.jsx("span",{className:"footer-bottom-lime",children:"EcoCollect"}),". Tous droits réservés."]})]})]})})]})},cy="/assets/logo-DUAFCwe0.png",oy=()=>{const[i,u]=v.useState(["","","","","",""]),[o,d]=v.useState({}),[x,b]=v.useState(!1),[m,N]=v.useState({type:"",text:""}),[f,g]=v.useState(""),j="https://ecobackend-7tuh.vercel.app";v.useEffect(()=>{const A=sessionStorage.getItem("reset_email");A?g(A):window.location.href="/forgot-password"},[]);const p=(A,O)=>{if(O.length>1){const $=O.replace(/\D/g,"").split(""),Y=[...i];$.forEach((ee,F)=>{A+F<6&&(Y[A+F]=ee)}),u(Y);const Z=Math.min(A+$.length,5);document.getElementById(`code-${Z}`)?.focus()}else{const $=[...i];$[A]=O.replace(/\D/g,""),u($),O&&A<5&&document.getElementById(`code-${A+1}`)?.focus()}o.code&&d({}),m.text&&N({type:"",text:""})},E=(A,O)=>{O.key==="Backspace"&&!i[A]&&A>0&&document.getElementById(`code-${A-1}`)?.focus()},L=A=>{A.preventDefault();const O=A.clipboardData.getData("text/plain").replace(/\D/g,"");if(O.length>=6){const $=O.slice(0,6).split("");u($),document.getElementById("code-5")?.focus()}},M=async A=>{A.preventDefault();const O=i.join("");if(O.length!==6){d({code:"Veuillez entrer les 6 chiffres du code"});return}b(!0),N({type:"info",text:"Vérification du code..."});try{const Y=await(await fetch(`${j}/api/auth/verifier-code-reinitialisation`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:f,code:O})})).json();if(Y.success)N({type:"success",text:"Code valide ! Redirection..."}),sessionStorage.setItem("reset_code",O),setTimeout(()=>window.location.href="/reset-password",1500);else throw new Error(Y.message||"Code invalide")}catch($){N({type:"error",text:$.message||"Code invalide ou expiré"}),u(["","","","","",""]),document.getElementById("code-0")?.focus()}finally{b(!1)}},w=async()=>{b(!0),N({type:"info",text:"Renvoi du code..."});try{const O=await(await fetch(`${j}/api/auth/demande-reinitialisation-mdp`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:f})})).json();if(O.success)N({type:"success",text:"Nouveau code envoyé !"}),u(["","","","","",""]),document.getElementById("code-0")?.focus();else throw new Error(O.message||"Erreur lors du renvoi")}catch(A){N({type:"error",text:A.message})}finally{b(!1)}};return t.jsxs(t.Fragment,{children:[t.jsx("style",{children:`
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Serif+Display:ital@0;1&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    :root {
      --background: #f8faf8;
      --foreground: #1a1e1a;
      --card: #ffffff;
      --primary: #2d8a5e;
      --secondary: #e8f3e8;
      --secondary-foreground: #1a5c3a;
      --muted: #f0f3f0;
      --muted-foreground: #5a655a;
      --destructive: #dc2626;
      --border: #d9e0d9;
      --ring: #2d8a5e;
      --radius: 0.75rem;
      --radius-xl: 1.75rem;
      --shadow-lg: 0 10px 40px -8px rgba(0, 0, 0, 0.08);
      
      --ff-head: 'DM Serif Display', Georgia, serif;
      --ff-body: 'Outfit', sans-serif;
      --ease: cubic-bezier(.4,0,.2,1);
      --spring: cubic-bezier(.34,1.56,.64,1);
    }

    body {
      font-family: var(--ff-body);
      background: var(--background);
      color: var(--foreground);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      position: relative;
    }

    body::before {
      content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
      opacity: .015;
    }

    .ambient {
      position: fixed; pointer-events: none; z-index: 0;
      border-radius: 50%; filter: blur(100px);
    }

    .ambient-1 { 
      width: 600px; height: 400px; top: 0; left: 50%; transform: translateX(-50%);
      background: radial-gradient(ellipse, rgba(45,138,94,0.03) 0%, transparent 70%); 
    }

    .ambient-2 { 
      width: 400px; height: 300px; bottom: 10%; right: 5%;
      background: radial-gradient(ellipse, rgba(45,138,94,0.02) 0%, transparent 70%); 
    }

    .auth-container {
      max-width: 450px;
      width: 100%;
      background: var(--card);
      border-radius: var(--radius-xl);
      padding: 2.5rem;
      border: 1px solid var(--border);
      box-shadow: var(--shadow-lg);
      animation: fadeIn 0.5s var(--spring) both;
      position: relative;
      z-index: 1;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(24px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 2rem;
    }

    .logo-img {
      height: 70px;
      width: auto;
      border-radius: 15px;
      transition: transform 0.3s var(--spring);
    }

    .logo-img:hover {
      transform: scale(1.05);
    }

    h1 {
      font-family: var(--ff-head);
      text-align: center;
      margin-bottom: 1rem;
      font-size: 2rem;
      color: var(--foreground);
    }

    h1 em {
      color: var(--primary);
      font-style: italic;
    }

    .email-display {
      text-align: center;
      color: var(--muted-foreground);
      margin-bottom: 2rem;
      font-size: 0.95rem;
    }

    .email-display strong {
      color: var(--foreground);
      font-weight: 600;
    }

    .code-input-group {
      display: flex;
      justify-content: space-between;
      gap: 0.5rem;
      margin: 1.5rem 0;
    }

    .code-input {
      width: 3rem;
      height: 3.5rem;
      text-align: center;
      font-size: 1.5rem;
      font-weight: 600;
      font-family: 'Courier New', monospace;
      border: 2px solid var(--border);
      border-radius: var(--radius);
      background: var(--muted);
      color: var(--foreground);
      transition: all 0.2s var(--ease);
      outline: none;
    }

    .code-input:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(45, 138, 94, 0.1);
    }

    .code-input.error {
      border-color: var(--destructive);
    }

    .timer {
      text-align: center;
      font-size: 0.9rem;
      color: var(--muted-foreground);
      margin-bottom: 1.5rem;
    }

    .btn {
      width: 100%;
      padding: 1rem;
      border: none;
      border-radius: 100px;
      cursor: pointer;
      font-family: var(--ff-body);
      font-weight: 700;
      font-size: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      transition: all 0.3s var(--spring);
      background: var(--primary);
      color: white;
      box-shadow: 0 4px 15px rgba(45, 138, 94, 0.2);
    }

    .btn:hover:not(:disabled) {
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(45, 138, 94, 0.3);
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn.secondary {
      background: transparent;
      color: var(--muted-foreground);
      border: 2px solid var(--border);
      box-shadow: none;
    }

    .btn.secondary:hover:not(:disabled) {
      background: var(--muted);
      color: var(--foreground);
      transform: none;
    }

    .spinner {
      width: 1.2rem;
      height: 1.2rem;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .message {
      padding: 1rem;
      margin-top: 1rem;
      border-radius: var(--radius);
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .message.success {
      background: var(--secondary);
      color: var(--secondary-foreground);
      border: 1px solid var(--primary);
    }

    .message.error {
      background: rgba(220, 38, 38, 0.1);
      color: var(--destructive);
      border: 1px solid var(--destructive);
    }

    .message.info {
      background: rgba(45, 138, 94, 0.05);
      color: var(--primary);
      border: 1px solid var(--primary);
    }

    .button-group {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-top: 1.5rem;
    }

    .links {
      text-align: center;
      margin-top: 1.5rem;
    }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--muted-foreground);
      text-decoration: none;
      font-size: 0.9rem;
    }

    .back-link:hover {
      color: var(--primary);
      transform: translateX(-3px);
    }

    .help-box {
      margin-top: 2rem;
      padding: 1rem;
      background: var(--muted);
      border-radius: var(--radius);
      border: 1px solid var(--border);
    }

    .help-box h3 {
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
      color: var(--foreground);
    }

    .help-box ul {
      list-style: none;
      font-size: 0.8rem;
      color: var(--muted-foreground);
    }

    .help-box li {
      margin-bottom: 0.25rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  `}),t.jsx("div",{className:"ambient ambient-1"}),t.jsx("div",{className:"ambient ambient-2"}),t.jsxs("div",{className:"auth-container",children:[t.jsx("a",{href:"/",className:"logo",children:t.jsx("img",{src:cy,alt:"EcoCollect",className:"logo-img"})}),t.jsx("h1",{children:t.jsx("em",{children:"Vérification du code"})}),t.jsxs("div",{className:"email-display",children:[t.jsx(gs,{size:14,style:{marginRight:"0.5rem",verticalAlign:"middle"}}),"Code envoyé à ",t.jsx("strong",{children:f})]}),t.jsxs("form",{onSubmit:M,children:[t.jsx("div",{className:"code-input-group",onPaste:L,children:i.map((A,O)=>t.jsx("input",{id:`code-${O}`,type:"text",maxLength:1,value:A,onChange:$=>p(O,$.target.value),onKeyDown:$=>E(O,$),className:`code-input ${o.code?"error":""}`},O))}),o.code&&t.jsx("div",{className:"error-text",style:{textAlign:"center"},children:o.code}),t.jsxs("div",{className:"timer",children:[t.jsx("i",{className:"far fa-clock"})," Code valide 15 minutes"]}),m.text&&t.jsxs("div",{className:`message ${m.type}`,children:[t.jsx("i",{className:`fas ${m.type==="success"?"fa-check-circle":m.type==="error"?"fa-exclamation-circle":"fa-info-circle"}`}),m.text]}),t.jsxs("div",{className:"button-group",children:[t.jsx("button",{type:"submit",className:"btn",disabled:x,children:x?t.jsxs(t.Fragment,{children:[t.jsx("div",{className:"spinner"}),"Vérification..."]}):t.jsxs(t.Fragment,{children:[t.jsx(Ce,{size:18}),"Vérifier le code"]})}),t.jsx("button",{type:"button",className:"btn secondary",onClick:w,disabled:x,children:"Renvoyer le code"})]})]}),t.jsx("div",{className:"links",children:t.jsxs("a",{href:"/forgot-password",className:"back-link",children:[t.jsx(Gs,{size:16}),"Modifier mon email"]})}),t.jsxs("div",{className:"help-box",children:[t.jsx("h3",{children:"Vous ne recevez pas le code ?"}),t.jsxs("ul",{children:[t.jsxs("li",{children:[t.jsx("span",{children:"•"})," Vérifiez vos spams / courriers indésirables"]}),t.jsxs("li",{children:[t.jsx("span",{children:"•"})," Attendez 2 minutes avant de renvoyer"]}),t.jsxs("li",{children:[t.jsx("span",{children:"•"})," Vérifiez que votre email est correct"]}),t.jsxs("li",{children:[t.jsx("span",{children:"•"})," Contactez le support si le problème persiste"]})]})]})]}),t.jsx("link",{rel:"stylesheet",href:"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"})]})},dy=()=>{const[i,u]=v.useState(null),[o,d]=v.useState(null),[x,b]=v.useState("dashboard"),[m,N]=v.useState(!1),[f,g]=v.useState(!1),[j,p]=v.useState({}),[E,L]=v.useState(null),[M,w]=v.useState(""),[k,A]=v.useState(!1),[O,$]=v.useState({points:0,totalDeclarations:0,pendingCollections:0,completedCollections:0,totalWaste:0,totalPointsEarned:0}),[Y,Z]=v.useState([]),[ee,F]=v.useState([]),[z,Q]=v.useState("all"),[ie,ye]=v.useState(null),[Ge,ut]=v.useState(!1),[Nt,pt]=v.useState(!1),[H,K]=v.useState(null),[ne,Se]=v.useState({total:0,completed:0,pending:0,inProgress:0,totalWeight:0,totalPoints:0}),[ke,S]=v.useState({typeDechet:"",quantite:"",unite:"kg",modeCollecte:"",dateSouhaitee:"",creneauHoraire:"",notes:"",photos:[]}),[X,J]=v.useState({nomComplet:"",telephone:"",adresse:"",quartier:"",commune:""}),[I,ue]=v.useState({currentPassword:"",newPassword:"",confirmPassword:""}),[xe,Ee]=v.useState([]),[ot,Ve]=v.useState([]),[ga,ba]=v.useState(!1),[R,se]=v.useState(!1),[le,_e]=v.useState(!1),Ke="https://ecobackend-7tuh.vercel.app",me={TOKEN:"ecocollect_token",USER:"ecocollect_user",ROLE:"ecocollect_role"},oa={plastique_pet:{label:"Plastique PET",icon:"♻️",color:"blue"},plastique_pehd:{label:"Plastique PEHD",icon:"♻️",color:"blue"},papier_carton:{label:"Papier/Carton",icon:"📦",color:"yellow"},metal:{label:"Métal",icon:"🔧",color:"gray"},verre:{label:"Verre",icon:"🍾",color:"green"},organique:{label:"Organique",icon:"🌱",color:"orange"}},Bl={collecte_domicile:"À domicile",depot_volontaire:"Dépôt volontaire"},va=W=>({pending:"amber",assigned:"blue",scheduled:"purple",in_progress:"orange",completed:"green",termine:"green",terminee:"green",validee:"green",en_attente:"amber",affecte:"orange",affectee:"orange",programme:"purple",programmee:"purple",en_cours:"orange",annule:"red",annulee:"red"})[W]||"gray",ya=W=>({pending:"En attente",assigned:"En cours",scheduled:"Programmé",in_progress:"En cours",completed:"Terminé",termine:"Terminé",terminee:"Terminée",validee:"Validée",en_attente:"En attente",en_attente_affectation:"En attente",en_attente_collecte:"En attente",affecte:"En cours",affectee:"En cours",collecteur_affecte:"En cours",programme:"Programmée",programmee:"Programmée",en_cours:"En cours",annule:"Annulée",annulee:"Annulée"})[W]||"Inconnu",Xr=W=>({pending:Qe,assigned:na,scheduled:at,in_progress:na,completed:Ce,termine:Ce,terminee:Ce,validee:Ce,en_attente:Qe,affecte:na,affectee:na,programme:at,programmee:at,en_cours:na,annule:ys,annulee:ys})[W]||Qe;v.useEffect(()=>(console.log("🔄 Initialisation du ProducteurDashboard"),bi(),()=>{E&&(console.log("🧹 Nettoyage de l'intervalle de rafraîchissement"),clearInterval(E))}),[]),v.useEffect(()=>{o&&i&&(console.log("✅ Token et utilisateur disponibles, chargement des données..."),ja(),Na(),Qs(),yi())},[o,i]);const bi=()=>{console.log("🔍 Vérification de la session...");const W=localStorage.getItem(me.TOKEN),ce=localStorage.getItem(me.USER),oe=localStorage.getItem(me.ROLE);if(console.log("Token présent:",!!W),console.log("User présent:",!!ce),console.log("Rôle:",oe),!W||!ce||oe!=="producteur"){console.log("❌ Session invalide, redirection vers login"),window.location.href="/login";return}try{const Ye=JSON.parse(ce);console.log("✅ Utilisateur connecté:",Ye),d(W),u(Ye),Ct()}catch(Ye){console.error("❌ Erreur lors du parsing des données utilisateur:",Ye),Gr()}},Ct=()=>{E&&clearInterval(E);const W=setInterval(()=>{console.log("🔄 Auto-raffraîchissement..."),x==="dashboard"?ja():x==="declarations"&&Na()},3e4);L(W)},Gr=()=>{console.log("🧹 Nettoyage de la session"),E&&(clearInterval(E),L(null)),localStorage.removeItem(me.TOKEN),localStorage.removeItem(me.USER),localStorage.removeItem(me.ROLE),window.location.href="/login"},Ae=(W,ce,oe)=>{p(Ye=>({...Ye,[W]:{type:ce,text:oe}})),setTimeout(()=>{p(Ye=>{const ge={...Ye};return delete ge[W],ge})},3e3)},Yl=()=>{window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?")&&Gr()},ja=async()=>{if(!o){console.log("❌ loadDashboard: Pas de token");return}console.log("📊 Chargement du tableau de bord..."),g(!0);try{const W=await fetch(`${Ke}/api/declarations`,{headers:{Authorization:`Bearer ${o}`}});if(console.log("📡 Réponse API declarations:",W.status),W.ok){const ce=await W.json();console.log("📦 Données reçues:",ce);let oe=ce.declarations||ce;Array.isArray(oe)||(console.warn("⚠️ Les données ne sont pas un tableau, conversion..."),oe=[]),console.log(`📊 ${oe.length} déclarations trouvées`),oe=oe.map(ze=>({...ze,statut:(ze.statut||"").toLowerCase().trim()}));const Ye=oe.length,ge=oe.filter(ze=>ze.statut==="affecte"||ze.statut==="en_attente_affectation"||ze.statut==="en_attente_collecte").length,Rt=oe.filter(ze=>ze.statut==="termine"||ze.statut==="terminee"||ze.statut==="validee").length,mt=oe.filter(ze=>ze.statut==="programme"||ze.statut==="programmee"||ze.statut==="scheduled").length,Pe=oe.filter(ze=>ze.statut==="termine"||ze.statut==="terminee"||ze.statut==="validee").reduce((ze,Ns)=>ze+(parseFloat(Ns.quantite)||0),0),We=oe.filter(ze=>ze.points).reduce((ze,Ns)=>ze+(parseInt(Ns.points)||0),0);console.log("📊 Statistiques calculées:",{totalDeclarations:Ye,pendingCollections:ge,completedCollections:Rt,programmedCollections:mt,totalWaste:Pe,totalPoints:We}),$({points:i?.points||0,totalDeclarations:Ye,pendingCollections:ge,completedCollections:Rt,programmedCollections:mt,totalWaste:Pe.toFixed(1),totalPointsEarned:We}),Ve(oe.slice(0,5)),A(!0)}else console.error("❌ Erreur API:",W.status),Ae("dashboard","error","Erreur lors du chargement des données")}catch(W){console.error("❌ Erreur réseau:",W),Ae("dashboard","error","Erreur de connexion au serveur")}finally{g(!1)}},vi=async W=>{if(W.preventDefault(),!o){Ae("declaration","error","Vous devez être connecté");return}g(!0);const{typeDechet:ce,quantite:oe,unite:Ye,modeCollecte:ge,dateSouhaitee:Rt,creneauHoraire:mt,notes:Pe}=ke;if(!ce||!oe||!Ye||!ge){Ae("declaration","error","Veuillez remplir tous les champs obligatoires"),g(!1);return}try{const We=await fetch(`${Ke}/api/declarations`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${o}`},body:JSON.stringify({typeDechet:ce,quantite:parseFloat(oe),unite:Ye,modeCollecte:ge,dateSouhaitee:Rt||null,creneauHoraire:mt||null,notes:Pe||null})});if(We.ok)Ae("declaration","success","Déclaration créée avec succès !"),S({typeDechet:"",quantite:"",unite:"kg",modeCollecte:"",dateSouhaitee:"",creneauHoraire:"",notes:"",photos:[]}),ut(!1),await Na(),await ja();else{const ze=await We.json();Ae("declaration","error",ze.message||"Erreur lors de la création")}}catch(We){console.error("Erreur création déclaration:",We),Ae("declaration","error","Erreur de connexion au serveur")}finally{g(!1)}},Na=async()=>{if(!o){console.log("❌ loadDeclarations: Pas de token");return}console.log("📥 Chargement des déclarations..."),g(!0);try{const W=await fetch(`${Ke}/api/declarations`,{headers:{Authorization:`Bearer ${o}`}});if(console.log("📡 Réponse API declarations:",W.status),W.ok){const ce=await W.json();console.log("📦 Données reçues:",ce);let oe=ce.declarations||ce;Array.isArray(oe)||(console.warn("⚠️ Les données ne sont pas un tableau, conversion..."),oe=[]),console.log(`📊 ${oe.length} déclarations trouvées`),oe=oe.map(ge=>({...ge,statut:(ge.statut||"en_attente").toLowerCase().trim()})),Z(oe),Zr(oe,z);const Ye={total:oe.length,completed:oe.filter(ge=>ge.statut==="termine"||ge.statut==="terminee"||ge.statut==="validee").length,pending:oe.filter(ge=>ge.statut==="affecte"||ge.statut==="en_attente_affectation"||ge.statut==="en_attente_collecte").length,inProgress:oe.filter(ge=>ge.statut==="en_cours"||ge.statut==="affecte"||ge.statut==="programme"||ge.statut==="assigned").length,totalWeight:oe.filter(ge=>ge.quantite).reduce((ge,Rt)=>ge+(parseFloat(Rt.quantite)||0),0),totalPoints:oe.filter(ge=>ge.points).reduce((ge,Rt)=>ge+(parseInt(Rt.points)||0),0)};console.log("📊 Stats calculées:",Ye),Se(Ye)}else console.error("❌ Erreur API:",W.status),Ae("declarations","error","Erreur lors du chargement des déclarations")}catch(W){console.error("❌ Erreur réseau:",W),Ae("declarations","error","Erreur de connexion au serveur")}finally{g(!1)}},Zr=(W,ce)=>{F(ce==="all"?W:W.filter(oe=>oe.statut===ce))};v.useEffect(()=>{Zr(Y,z)},[z,Y]);const Vl=async W=>{if(o){g(!0);try{const ce=await fetch(`${Ke}/api/declarations/${W}/suivre`,{headers:{Authorization:`Bearer ${o}`}});if(ce.ok){const oe=await ce.json();ye(oe.declaration||oe)}else Ae("declaration","error","Erreur lors du chargement du suivi")}catch(ce){console.error("Erreur chargement suivi:",ce),Ae("declaration","error","Erreur de connexion au serveur")}finally{g(!1)}}},Xa=()=>{ye(null)},gt=async W=>{if(o){g(!0);try{const ce=await fetch(`${Ke}/api/declarations/${W}/suivre`,{headers:{Authorization:`Bearer ${o}`}});if(ce.ok){const oe=await ce.json();K(oe.declaration||oe),pt(!0)}else Ae("declaration","error","Erreur lors du chargement du suivi")}catch(ce){console.error("Erreur chargement suivi:",ce),Ae("declaration","error","Erreur de connexion au serveur")}finally{g(!1)}}},da=()=>{pt(!1),K(null)},St=W=>{window.confirm("Êtes-vous sûr de vouloir annuler cette déclaration ?")&&(Ae("declaration","success","Déclaration annulée avec succès"),setTimeout(()=>{Xa(),Na(),ja()},1e3))},yi=()=>{i&&J({nomComplet:i.nomComplet||"",telephone:i.telephone||"",adresse:i.adresse||"",quartier:i.quartier||"",commune:i.commune||""})},ji=async W=>{if(W.preventDefault(),!o)return;const{nomComplet:ce,telephone:oe,adresse:Ye,quartier:ge,commune:Rt}=X;if(!ce||!oe){Ae("profile","error","Le nom complet et le téléphone sont obligatoires");return}g(!0);try{setTimeout(()=>{const mt={...i,nomComplet:ce,telephone:oe,adresse:Ye,quartier:ge,commune:Rt};localStorage.setItem(me.USER,JSON.stringify(mt)),u(mt),Ae("profile","success","Profil mis à jour avec succès !"),se(!1),g(!1)},1e3)}catch(mt){console.error("Erreur mise à jour profil:",mt),Ae("profile","error","Erreur lors de la mise à jour"),g(!1)}},Ni=()=>{_e(!0),navigator.geolocation?navigator.geolocation.getCurrentPosition(W=>{J(ce=>({...ce,quartier:`GPS: ${W.coords.latitude.toFixed(6)}, ${W.coords.longitude.toFixed(6)}`})),_e(!1),Ae("profile","success","📍 Localisation mise à jour !")},W=>{Ae("profile","error","Impossible d'obtenir votre position"),_e(!1)}):(Ae("profile","error","Géolocalisation non supportée"),_e(!1))},Zs=async W=>{if(W.preventDefault(),!o)return;const{currentPassword:ce,newPassword:oe,confirmPassword:Ye}=I;if(!ce||!oe||!Ye){Ae("password","error","Veuillez remplir tous les champs");return}if(oe!==Ye){Ae("password","error","Les mots de passe ne correspondent pas");return}if(oe.length<8){Ae("password","error","Le mot de passe doit contenir au moins 8 caractères");return}g(!0);try{setTimeout(()=>{Ae("password","success","Mot de passe changé avec succès !"),ue({currentPassword:"",newPassword:"",confirmPassword:""}),ba(!1),g(!1)},1e3)}catch(ge){console.error("Erreur changement mot de passe:",ge),Ae("password","error","Erreur lors du changement de mot de passe"),g(!1)}},Qs=async()=>{if(o)try{const W=await fetch(`${Ke}/api/notifications`,{headers:{Authorization:`Bearer ${o}`}}).catch(()=>null);if(W&&W.ok){const ce=await W.json();Ee(ce.notifications||[])}}catch(W){console.error("Erreur notifications:",W)}},Ks=()=>{if(!o){Ae("token","error","Aucun token disponible");return}navigator.clipboard.writeText(o).then(()=>Ae("token","success","Token copié dans le presse-papier !")).catch(()=>Ae("token","error","Erreur lors de la copie"))},$t=W=>W?new Date(W).toLocaleDateString("fr-FR",{day:"2-digit",month:"2-digit",year:"numeric"}):"Date inconnue",js=W=>W?new Date(W).toLocaleString("fr-FR",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"}):"Non spécifiée",Xt=W=>oa[W]?.label||W||"Non spécifié",Qr=W=>Bl[W]||W||"Non spécifié",Kr=W=>({menage:"Ménage",commerce:"Commerce",entreprise:"Entreprise",administration:"Administration"})[W]||W||"Non spécifié",Js=W=>W?W.split(" ").map(ce=>ce[0]).join("").toUpperCase().substring(0,2):"P",Ga=ee.filter(W=>W.id?.toLowerCase().includes(M.toLowerCase())||Xt(W.type_dechet)?.toLowerCase().includes(M.toLowerCase())),wi=[{id:"dashboard",label:"Tableau de bord",icon:pi,badge:null},{id:"declare",label:"Déclarer des déchets",icon:ft,badge:"CTA",badgeColor:"green",action:()=>ut(!0)},{id:"declarations",label:"Mes déclarations",icon:De,badge:null},{id:"history",label:"Historique",icon:hi,badge:null},{id:"rewards",label:"Récompenses",icon:zt,badge:O.totalPointsEarned.toString(),badgeColor:"purple"}],Jr=[{id:"profile",label:"Mon profil",icon:ct,badge:null}];return t.jsxs("div",{className:"min-h-screen bg-gray-50",children:[t.jsx("header",{className:"lg:hidden bg-white border-b border-gray-200 sticky top-0 z-40",children:t.jsxs("div",{className:"px-4 py-3 flex items-center justify-between",children:[t.jsxs("div",{className:"flex items-center gap-3",children:[t.jsx("button",{onClick:()=>N(!0),className:"p-2 hover:bg-gray-100 rounded-lg",children:t.jsx(Lx,{className:"w-6 h-6 text-gray-600"})}),t.jsx("img",{src:Hl,alt:"EcoCollect",className:"h-8 w-auto"})]}),t.jsx("div",{className:"flex items-center gap-2",children:t.jsx("div",{className:"w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold text-sm",children:Js(i?.nomComplet)})})]})}),t.jsx(uy,{isOpen:m,toggleSidebar:()=>N(!1),currentPage:x,setActivePage:b,menuItems:wi,secondaryMenuItems:Jr,currentUser:i,getInitials:Js,handleLogout:Yl,setShowDeclarationModal:ut}),t.jsx("div",{className:"lg:ml-72 min-h-screen",children:t.jsxs("main",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8",children:[Object.entries(j).map(([W,ce])=>t.jsxs("div",{className:`mb-4 p-4 rounded-lg flex items-center gap-2 ${ce.type==="success"?"bg-green-50 text-green-700 border border-green-200":ce.type==="error"?"bg-red-50 text-red-700 border border-red-200":"bg-blue-50 text-blue-700 border border-blue-200"}`,children:[ce.type==="success"?t.jsx(Ce,{className:"w-5 h-5"}):ce.type==="error"?t.jsx(Al,{className:"w-5 h-5"}):t.jsx(gi,{className:"w-5 h-5"}),ce.text]},W)),f&&t.jsxs("div",{className:"mb-4 p-4 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg flex items-center gap-2",children:[t.jsx("div",{className:"animate-spin rounded-full h-5 w-5 border-b-2 border-blue-700"}),"Chargement en cours..."]}),x==="dashboard"&&t.jsx(my,{currentUser:i,dashboardData:O,recentDeclarations:ot,getStatusColor:va,getStatusText:ya,getStatusIcon:Xr,formatDate:$t,formatWasteType:Xt,showDeclarationDetail:Vl,showTracking:gt,setShowDeclarationModal:ut,wasteTypes:oa,isLoading:f,dataLoaded:k,setActiveSection:b}),x==="declarations"&&t.jsx(hy,{declarations:Ga,declarationStats:ne,searchTerm:M,setSearchTerm:w,declarationFilter:z,setDeclarationFilter:Q,loadDeclarations:Na,getStatusColor:va,getStatusText:ya,getStatusIcon:Xr,formatDate:$t,formatWasteType:Xt,showDeclarationDetail:Vl,showTracking:gt,setShowDeclarationModal:ut,wasteTypes:oa,isLoading:f}),x==="history"&&t.jsx(gy,{declarations:Ga,searchTerm:M,setSearchTerm:w,declarationFilter:z,setDeclarationFilter:Q,loadDeclarations:Na,getStatusColor:va,getStatusText:ya,formatDate:$t,formatWasteType:Xt,showDeclarationDetail:Vl,wasteTypes:oa,isLoading:f}),x==="rewards"&&t.jsx(by,{totalPoints:O.totalPointsEarned,totalWaste:O.totalWaste}),x==="profile"&&t.jsx(vy,{currentUser:i,dashboardData:O,profileForm:X,setProfileForm:J,isEditing:R,setIsEditing:se,isLoading:f,handleUpdateProfile:ji,handleLocationClick:Ni,locationLoading:le,showPasswordFields:ga,setShowPasswordFields:ba,passwordForm:I,setPasswordForm:ue,handleChangePassword:Zs,copyToken:Ks,currentToken:o,formatProducerType:Kr,formatDate:$t,handleLogout:Yl})]})}),Ge&&t.jsx(xy,{declarationForm:ke,setDeclarationForm:S,handleSubmit:vi,isLoading:f,onClose:()=>ut(!1)}),ie&&t.jsx(fy,{declaration:ie,onClose:Xa,getStatusColor:va,getStatusText:ya,formatWasteType:Xt,formatCollectionMode:Qr,formatDateTime:js,annulerDeclaration:St,showTracking:gt,wasteTypes:oa}),Nt&&H&&t.jsx(py,{declaration:H,onClose:da,getStatusColor:va,getStatusText:ya,formatWasteType:Xt,formatCollectionMode:Qr,formatDateTime:js,wasteTypes:oa})]})},uy=({isOpen:i,toggleSidebar:u,currentPage:o,setActivePage:d,menuItems:x,secondaryMenuItems:b,currentUser:m,getInitials:N,handleLogout:f,setShowDeclarationModal:g})=>{const j=p=>{p.id==="declare"&&g?g(!0):d(p.id),window.innerWidth<1024&&u()};return t.jsxs(t.Fragment,{children:[t.jsxs("div",{className:`lg:hidden fixed inset-0 z-50 transition-all duration-300 ease-in-out ${i?"opacity-100 pointer-events-auto":"opacity-0 pointer-events-none"}`,children:[t.jsx("div",{className:`absolute inset-0 bg-black transition-opacity duration-300 ${i?"opacity-50":"opacity-0"}`,onClick:u}),t.jsxs("div",{className:`absolute top-0 left-0 h-full w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${i?"translate-x-0":"-translate-x-full"}`,children:[t.jsx("div",{className:"bg-gradient-to-r from-green-600 to-green-700 p-6",children:t.jsx("div",{className:"flex items-center justify-between",children:t.jsx("button",{onClick:u,className:"text-gradient hover:bg-white/20 p-2 rounded-lg transition-colors",children:t.jsx(ys,{className:"w-5 h-5"})})})}),t.jsx("div",{className:"p-4 border-b",children:t.jsxs("div",{className:"flex items-center gap-3",children:[t.jsx("div",{className:"w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold",children:N(m?.nomComplet)}),t.jsxs("div",{children:[t.jsx("p",{className:"font-medium text-gray-900",children:m?.nomComplet||"Producteur"}),t.jsx("p",{className:"text-xs text-gray-500",children:m?.email||"producteur@ecocollect.cm"})]})]})}),t.jsxs("nav",{className:"flex-1 p-4 overflow-y-auto",children:[t.jsxs("div",{className:"mb-6",children:[t.jsx("h3",{className:"text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3",children:"Principal"}),t.jsx("ul",{className:"space-y-2",children:x.map(p=>{const E=p.icon,L=o===p.id;return t.jsx("li",{children:t.jsxs("button",{onClick:()=>j(p),className:`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors group ${L?"bg-green-50 text-green-700 border-l-4 border-green-600":"text-gray-700 hover:bg-gray-50 hover:text-gray-900"}`,children:[t.jsxs("div",{className:"flex items-center gap-3",children:[t.jsx(E,{className:`w-5 h-5 ${L?"text-green-600":"text-gray-400 group-hover:text-gray-600"}`}),t.jsx("span",{className:"font-medium",children:p.label})]}),p.badge&&p.badge!=="CTA"&&t.jsx("span",{className:`px-2 py-1 text-xs font-medium rounded-full ${p.badgeColor==="green"?"bg-green-100 text-green-700":p.badgeColor==="purple"?"bg-purple-100 text-purple-700":"bg-gray-100 text-gray-700"}`,children:p.badge}),p.badge==="CTA"&&t.jsx("span",{className:"px-2 py-1 text-xs font-medium rounded-full bg-green-600 text-white",children:"Nouveau"})]})},p.id)})})]}),t.jsxs("div",{className:"mb-6",children:[t.jsx("h3",{className:"text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3",children:"Compte"}),t.jsx("ul",{className:"space-y-2",children:b.map(p=>{const E=p.icon,L=o===p.id;return t.jsx("li",{children:t.jsxs("button",{onClick:()=>j(p),className:`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group ${L?"bg-green-50 text-green-700 border-l-4 border-green-600":"text-gray-700 hover:bg-gray-50 hover:text-gray-900"}`,children:[t.jsx(E,{className:`w-5 h-5 ${L?"text-green-600":"text-gray-400 group-hover:text-gray-600"}`}),t.jsx("span",{className:"font-medium",children:p.label})]})},p.id)})})]}),t.jsx("div",{className:"mt-auto p-4 border-t",children:t.jsxs("button",{onClick:f,className:"w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors group",children:[t.jsx(Vs,{className:"w-5 h-5"}),t.jsx("span",{className:"font-medium",children:"Déconnexion"})]})})]})]})]}),t.jsxs("div",{className:"hidden lg:block fixed top-0 left-0 h-screen bg-white shadow-xl z-50 w-72 overflow-hidden flex flex-col",children:[t.jsx("div",{className:"p-4 border-b",children:t.jsxs("div",{className:"flex items-center gap-3",children:[t.jsx("div",{className:"w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold",children:N(m?.nomComplet)}),t.jsxs("div",{children:[t.jsx("p",{className:"font-medium text-gray-900",children:m?.nomComplet||"Producteur"}),t.jsx("p",{className:"text-xs text-gray-500",children:m?.email||"producteur@ecocollect.cm"})]})]})}),t.jsxs("nav",{className:"flex-1 p-4 overflow-y-auto",children:[t.jsxs("div",{className:"mb-6",children:[t.jsx("h3",{className:"text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3",children:"Principal"}),t.jsx("ul",{className:"space-y-1",children:x.map(p=>{const E=p.icon,L=o===p.id;return t.jsx("li",{children:t.jsxs("button",{onClick:()=>j(p),className:`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors group ${L?"bg-green-50 text-green-700 border-l-4 border-green-600":"text-gray-700 hover:bg-gray-50 hover:text-gray-900"}`,children:[t.jsxs("div",{className:"flex items-center gap-3",children:[t.jsx(E,{className:`w-5 h-5 ${L?"text-green-600":"text-gray-400 group-hover:text-gray-600"}`}),t.jsx("span",{className:"font-medium",children:p.label})]}),p.badge&&p.badge!=="CTA"&&t.jsx("span",{className:`px-2 py-1 text-xs font-medium rounded-full ${p.badgeColor==="green"?"bg-green-100 text-green-700":p.badgeColor==="purple"?"bg-purple-100 text-purple-700":"bg-gray-100 text-gray-700"}`,children:p.badge}),p.badge==="CTA"&&t.jsx("span",{className:"px-2 py-1 text-xs font-medium rounded-full bg-green-600 text-white",children:"Nouveau"})]})},p.id)})})]}),t.jsxs("div",{className:"mb-6",children:[t.jsx("h3",{className:"text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3",children:"Compte"}),t.jsx("ul",{className:"space-y-1",children:b.map(p=>{const E=p.icon,L=o===p.id;return t.jsx("li",{children:t.jsxs("button",{onClick:()=>j(p),className:`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group ${L?"bg-green-50 text-green-700 border-l-4 border-green-600":"text-gray-700 hover:bg-gray-50 hover:text-gray-900"}`,children:[t.jsx(E,{className:`w-5 h-5 ${L?"text-green-600":"text-gray-400 group-hover:text-gray-600"}`}),t.jsx("span",{className:"font-medium",children:p.label})]})},p.id)})})]}),t.jsx("div",{className:"mt-auto p-4 border-t",children:t.jsxs("button",{onClick:f,className:"w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors group",children:[t.jsx(Vs,{className:"w-5 h-5"}),t.jsx("span",{className:"font-medium",children:"Déconnexion"})]})})]})]})]})},my=({currentUser:i,dashboardData:u,recentDeclarations:o,getStatusColor:d,getStatusText:x,getStatusIcon:b,formatDate:m,formatWasteType:N,showDeclarationDetail:f,showTracking:g,setShowDeclarationModal:j,wasteTypes:p,isLoading:E,dataLoaded:L,setActiveSection:M})=>{const w=()=>{M&&M("history")};return t.jsxs("div",{children:[t.jsx("div",{className:"mb-8",children:t.jsx("div",{className:"bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-6 text-white",children:t.jsxs("div",{className:"flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6",children:[t.jsxs("div",{className:"flex-1",children:[t.jsxs("h2",{className:"text-2xl font-bold mb-2",children:["Bienvenue, ",i?.nomComplet?.split(" ")[0]||"Producteur"," !"]}),t.jsx("p",{className:"text-green-100",children:"Prêt à faire une différence aujourd'hui ? Continuez votre excellent travail de tri des déchets."})]}),t.jsx("div",{className:"hidden lg:block flex-shrink-0",children:t.jsx("div",{className:"bg-white/20 backdrop-blur-sm rounded-xl p-4 min-w-[200px]",children:t.jsxs("div",{className:"text-sm text-green-100",children:["Encore ",Math.max(0,20-u.totalWaste).toFixed(1)," kg à atteindre"]})})})]})})}),t.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-8",children:[t.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow",children:[t.jsxs("div",{className:"flex items-center justify-between mb-4",children:[t.jsx("div",{className:"w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center",children:t.jsx(De,{className:"w-6 h-6 text-blue-600"})}),t.jsx("span",{className:"text-2xl font-bold text-gray-900",children:u.totalDeclarations})]}),t.jsx("p",{className:"text-gray-600 font-medium",children:"Total des déclarations"}),t.jsx("p",{className:"text-sm text-gray-500 mt-1",children:"Ce mois"}),t.jsxs("div",{className:"mt-3 flex items-center text-green-600 text-sm",children:[t.jsx(Hr,{className:"w-4 h-4 mr-1"}),"+",u.totalDeclarations>0?"12":"0","% vs mois dernier"]})]}),t.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow",children:[t.jsxs("div",{className:"flex items-center justify-between mb-4",children:[t.jsx("div",{className:"w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center",children:t.jsx(Qe,{className:"w-6 h-6 text-orange-600"})}),t.jsxs("span",{className:"text-2xl font-bold text-gray-900",children:[u.pendingCollections," "]})]}),t.jsx("p",{className:"text-gray-600 font-medium",children:"Collectes en attente"}),t.jsx("p",{className:"text-sm text-gray-500 mt-1",children:"En cours"}),t.jsx("div",{className:"mt-3",children:t.jsx("div",{className:"w-full bg-gray-200 rounded-full h-2",children:t.jsx("div",{className:"bg-orange-500 h-2 rounded-full",style:{width:`${u.totalDeclarations>0?u.pendingCollections/u.totalDeclarations*100:0}%`}})})})]}),t.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow",children:[t.jsxs("div",{className:"flex items-center justify-between mb-4",children:[t.jsx("div",{className:"w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center",children:t.jsx(Ce,{className:"w-6 h-6 text-green-600"})}),t.jsx("span",{className:"text-2xl font-bold text-gray-900",children:u.completedCollections})]}),t.jsx("p",{className:"text-gray-600 font-medium",children:"Collectes réalisées"}),t.jsx("p",{className:"text-sm text-gray-500 mt-1",children:"Terminées"}),t.jsxs("div",{className:"mt-3 flex items-center text-green-600 text-sm",children:[t.jsx(Ce,{className:"w-4 h-4 mr-1"}),u.totalDeclarations>0?Math.round(u.completedCollections/u.totalDeclarations*100):0,"% de taux de réussite"]})]}),t.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow",children:[t.jsxs("div",{className:"flex items-center justify-between mb-4",children:[t.jsx("div",{className:"w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center",children:t.jsx(Qe,{className:"w-6 h-6 text-orange-600"})}),t.jsxs("span",{className:"text-2xl font-bold text-gray-900",children:[u.programmedCollections," "]})]}),t.jsx("p",{className:"text-gray-600 font-medium",children:"Collectes en chemin"}),t.jsx("p",{className:"text-sm text-gray-500 mt-1",children:"En cours"}),t.jsx("div",{className:"mt-3",children:t.jsx("div",{className:"w-full bg-gray-200 rounded-full h-2",children:t.jsx("div",{className:"bg-orange-500 h-2 rounded-full",style:{width:`${u.totalDeclarations>0?u.programmedCollections/u.totalDeclarations*100:0}%`}})})})]})]}),t.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-3 gap-8",children:[t.jsx("div",{className:"lg:col-span-2",children:t.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-gray-200",children:[t.jsx("div",{className:"p-6 border-b border-gray-200",children:t.jsxs("div",{className:"flex items-center justify-between",children:[t.jsxs("h2",{className:"text-lg font-semibold text-gray-900 flex items-center gap-2",children:[t.jsx(ft,{className:"w-5 h-5 text-green-600"}),"Historique des collectes"]}),t.jsx("button",{onClick:w,className:"text-sm text-green-600 hover:text-green-700 font-medium",children:"Voir tout"})]})}),t.jsx("div",{className:"divide-y divide-gray-200",children:o.length>0?o.map(k=>{b(k.statut);const A=d(k.statut);return t.jsx("div",{className:"p-6 hover:bg-gray-50 transition-colors",children:t.jsxs("div",{className:"flex items-start justify-between",children:[t.jsxs("div",{className:"flex-1",children:[t.jsxs("div",{className:"flex items-center gap-3 mb-3",children:[t.jsxs("span",{className:"font-mono text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded",children:["#",k.id?.substring(0,8)]}),t.jsx("span",{className:`px-2 py-1 rounded-full text-xs font-medium bg-${A}-100 text-${A}-800`,children:x(k.statut)})]}),t.jsxs("div",{className:"flex items-center gap-4 mb-3",children:[t.jsx("div",{className:"flex items-center gap-2",children:t.jsx("span",{className:"text-lg",children:p[k.type_dechet]?.icon||"📦"})}),t.jsxs("span",{className:"text-sm font-medium text-gray-700",children:[k.quantite||0," ",k.unite||"kg"]})]}),t.jsxs("div",{className:"flex items-center gap-6 text-sm text-gray-500",children:[t.jsxs("div",{className:"flex items-center gap-1",children:[t.jsx(at,{className:"w-3 h-3"}),m(k.date_declaration)]}),k.collecteur_nom&&t.jsxs("div",{className:"flex items-center gap-1",children:[t.jsx(ta,{className:"w-3 h-3"}),k.collecteur_nom]})]})]}),t.jsx("div",{className:"flex items-center gap-2",children:t.jsxs("button",{onClick:()=>f(k.id),className:"flex items-center gap-1 text-green-600 hover:text-green-700 transition-colors",children:[t.jsx("span",{className:"text-sm font-medium",children:"Détails"}),t.jsx($r,{className:"w-4 h-4"})]})})]})},k.id)}):t.jsx("div",{className:"p-6 text-center text-gray-500",children:E?"Chargement...":"Aucune déclaration récente"})})]})}),t.jsxs("div",{className:"space-y-6",children:[t.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-gray-200 p-6",children:[t.jsxs("h2",{className:"text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2",children:[t.jsx(Ur,{className:"w-5 h-5 text-green-600"}),"Actions rapides"]}),t.jsxs("div",{className:"space-y-3",children:[t.jsxs("button",{onClick:()=>j(!0),className:"block w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-center font-medium flex items-center justify-center gap-2",children:[t.jsx(ft,{className:"w-4 h-4"}),"Déclarer des déchets"]}),t.jsx("button",{onClick:w,className:"block w-full py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-center font-medium",children:"Voir l'historique complet"})]})]}),t.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-gray-200 p-6",children:[t.jsxs("h2",{className:"text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2",children:[t.jsx(Vt,{className:"w-5 h-5 text-green-600"}),"Impact environnemental"]}),t.jsxs("div",{className:"space-y-4",children:[t.jsxs("div",{children:[t.jsxs("div",{className:"flex justify-between items-center mb-2",children:[t.jsx("span",{className:"text-sm text-gray-600",children:"Total collecté"}),t.jsxs("span",{className:"font-semibold text-gray-900",children:[u.totalWaste," kg"]})]}),t.jsx("div",{className:"w-full bg-gray-200 rounded-full h-2",children:t.jsx("div",{className:"bg-green-600 h-2 rounded-full transition-all duration-500",style:{width:"75%"}})})]}),t.jsxs("div",{className:"grid grid-cols-2 gap-4 pt-4 border-t",children:[t.jsxs("div",{className:"text-center",children:[t.jsx("div",{className:"w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2",children:t.jsx(bs,{className:"w-6 h-6 text-green-600"})}),t.jsx("p",{className:"text-2xl font-bold text-green-600",children:"89%"}),t.jsx("p",{className:"text-xs text-gray-600",children:"Taux de recyclage"})]}),t.jsxs("div",{className:"text-center",children:[t.jsx("div",{className:"w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2",children:t.jsx(Vt,{className:"w-6 h-6 text-blue-600"})}),t.jsx("p",{className:"text-2xl font-bold text-blue-600",children:Math.round(u.totalWaste/10)}),t.jsx("p",{className:"text-xs text-gray-600",children:"Arbres sauvés"})]})]})]})]}),t.jsxs("div",{className:"bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200",children:[t.jsxs("h3",{className:"font-semibold text-green-900 mb-3 flex items-center gap-2",children:[t.jsx(zt,{className:"w-4 h-4"}),"Conseil du jour"]}),t.jsx("p",{className:"text-sm text-green-800 leading-relaxed",children:"Saviez-vous que le tri sélectif peut vous rapporter jusqu'à 50% de points en plus ? Séparez correctement vos déchets pour maximiser vos récompenses !"}),t.jsx("div",{className:"mt-3 pt-3 border-t border-green-200",children:t.jsx("p",{className:"text-xs text-green-700",children:'🎯 Objectif : Atteignez 500 points ce mois pour débloquer le niveau "Maître Recycleur"'})})]})]})]})]})},hy=({declarations:i,declarationStats:u,searchTerm:o,setSearchTerm:d,declarationFilter:x,setDeclarationFilter:b,loadDeclarations:m,getStatusColor:N,getStatusText:f,getStatusIcon:g,formatDate:j,formatWasteType:p,showDeclarationDetail:E,showTracking:L,setShowDeclarationModal:M,wasteTypes:w,isLoading:k})=>t.jsxs("div",{children:[t.jsxs("div",{className:"flex justify-between items-center mb-6",children:[t.jsxs("h1",{className:"text-2xl font-bold text-gray-900 flex items-center gap-2",children:[t.jsx(De,{className:"w-6 h-6 text-green-600"}),"Mes déclarations"]}),t.jsxs("button",{onClick:()=>M(!0),className:"px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2",children:[t.jsx(Ur,{className:"w-4 h-4"}),"Nouvelle déclaration"]})]}),t.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8",children:[t.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-gray-200 p-6",children:[t.jsxs("div",{className:"flex items-center justify-between mb-4",children:[t.jsx("div",{className:"w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center",children:t.jsx(pi,{className:"w-6 h-6 text-blue-600"})}),t.jsx("span",{className:"text-2xl font-bold text-gray-900",children:u.total})]}),t.jsx("p",{className:"text-gray-600 font-medium",children:"Total déclarations"}),t.jsx("p",{className:"text-sm text-gray-500 mt-1",children:"Depuis le début"})]}),t.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-gray-200 p-6",children:[t.jsxs("div",{className:"flex items-center justify-between mb-4",children:[t.jsx("div",{className:"w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center",children:t.jsx(Ce,{className:"w-6 h-6 text-green-600"})}),t.jsx("span",{className:"text-2xl font-bold text-gray-900",children:u.completed})]}),t.jsx("p",{className:"text-gray-600 font-medium",children:"Collectes terminées"}),t.jsx("p",{className:"text-sm text-gray-500 mt-1",children:"Avec succès"})]}),t.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-gray-200 p-6",children:[t.jsxs("div",{className:"flex items-center justify-between mb-4",children:[t.jsx("div",{className:"w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center",children:t.jsx(De,{className:"w-6 h-6 text-orange-600"})}),t.jsx("span",{className:"text-2xl font-bold text-gray-900",children:u.totalWeight.toFixed(1)})]}),t.jsx("p",{className:"text-gray-600 font-medium",children:"Poids total collecté"}),t.jsx("p",{className:"text-sm text-gray-500 mt-1",children:"Kilogrammes"})]}),t.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-gray-200 p-6",children:[t.jsxs("div",{className:"flex items-center justify-between mb-4",children:[t.jsx("div",{className:"w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center",children:t.jsx(Hr,{className:"w-6 h-6 text-purple-600"})}),t.jsx("span",{className:"text-2xl font-bold text-gray-900",children:u.totalPoints})]}),t.jsx("p",{className:"text-gray-600 font-medium",children:"Points cumulés"}),t.jsx("p",{className:"text-sm text-gray-500 mt-1",children:"Récompenses"})]})]}),t.jsx("div",{className:"bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6",children:t.jsxs("div",{className:"flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4",children:[t.jsx("div",{className:"flex-1",children:t.jsxs("div",{className:"relative",children:[t.jsx(ql,{className:"absolute left-3 top-3 w-4 h-4 text-gray-400"}),t.jsx("input",{type:"text",placeholder:"Rechercher par numéro, type de déchet...",value:o,onChange:A=>d(A.target.value),className:"w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"})]})}),t.jsxs("div",{className:"flex flex-col sm:flex-row gap-3",children:[t.jsxs("select",{value:x,onChange:A=>b(A.target.value),className:"px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent",children:[t.jsx("option",{value:"all",children:"Tous les statuts"}),t.jsx("option",{value:"en_attente",children:"En attente"}),t.jsx("option",{value:"affecte",children:"En cours"}),t.jsx("option",{value:"programme",children:"Programmé"}),t.jsx("option",{value:"termine",children:"Terminé"})]}),t.jsxs("button",{onClick:m,className:"flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors",children:[t.jsx(De,{className:"w-4 h-4"}),"Actualiser"]})]})]})}),t.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-gray-200",children:[t.jsx("div",{className:"p-6 border-b border-gray-200",children:t.jsxs("div",{className:"flex items-center justify-between",children:[t.jsxs("h2",{className:"text-lg font-semibold text-gray-900 flex items-center gap-2",children:[t.jsx(ft,{className:"w-5 h-5 text-green-600"}),"Liste des déclarations (",i.length,")"]}),t.jsxs("div",{className:"text-sm text-gray-500",children:[i.length," résultat",i.length>1?"s":""]})]})}),t.jsx("div",{className:"divide-y divide-gray-200",children:i.length>0?i.map(A=>{const O=N(A.statut);return t.jsx("div",{className:"p-6 hover:bg-gray-50 transition-colors",children:t.jsxs("div",{className:"flex items-start justify-between",children:[t.jsxs("div",{className:"flex-1",children:[t.jsxs("div",{className:"flex items-center gap-3 mb-3",children:[t.jsxs("span",{className:"font-mono text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded",children:["#",A.id?.substring(0,8)]}),t.jsx("span",{className:`px-2 py-1 rounded-full text-xs font-medium bg-${O}-100 text-${O}-800`,children:f(A.statut)})]}),t.jsxs("div",{className:"flex items-center gap-4 mb-3",children:[t.jsx("div",{className:"flex items-center gap-2",children:t.jsx("span",{className:"text-lg",children:w[A.type_dechet]?.icon||"📦"})}),t.jsxs("span",{className:"text-sm font-medium text-gray-700",children:[A.quantite||0," ",A.unite||"kg"]})]}),t.jsxs("div",{className:"flex items-center gap-6 text-sm text-gray-500",children:[t.jsxs("div",{className:"flex items-center gap-1",children:[t.jsx(at,{className:"w-3 h-3"}),j(A.date_declaration)]}),A.collecteur_nom&&t.jsxs("div",{className:"flex items-center gap-1",children:[t.jsx(ta,{className:"w-3 h-3"}),A.collecteur_nom]})]})]}),t.jsxs("div",{className:"flex items-center gap-2 ml-4",children:[t.jsx("button",{onClick:()=>E(A.id),className:"flex items-center gap-1 text-green-600 hover:text-green-700 transition-colors",title:"Voir les détails",children:t.jsx(ps,{className:"w-4 h-4"})}),t.jsx("button",{onClick:()=>L(A.id),className:"flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors",title:"Suivre en temps réel",children:t.jsx(De,{className:"w-4 h-4"})})]})]})},A.id)}):t.jsxs("div",{className:"text-center py-12",children:[t.jsx(ft,{className:"w-16 h-16 text-gray-300 mx-auto mb-4"}),t.jsx("p",{className:"text-gray-500",children:k?"Chargement des déclarations...":"Aucune déclaration trouvée"}),!k&&t.jsx("p",{className:"text-sm text-gray-400 mt-1",children:"Essayez de modifier vos filtres de recherche ou créez une nouvelle déclaration"})]})})]})]}),xy=({declarationForm:i,setDeclarationForm:u,handleSubmit:o,isLoading:d,onClose:x})=>t.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50",children:t.jsxs("div",{className:"bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto",children:[t.jsxs("div",{className:"sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center",children:[t.jsxs("h3",{className:"text-xl font-semibold text-gray-900 flex items-center gap-2",children:[t.jsx(Rl,{className:"w-5 h-5 text-green-600"}),"Nouvelle déclaration"]}),t.jsx("button",{onClick:x,className:"p-2 hover:bg-gray-100 rounded-lg transition-colors",children:t.jsx(ys,{className:"w-5 h-5 text-gray-500"})})]}),t.jsxs("form",{onSubmit:o,className:"p-6 space-y-6",children:[t.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[t.jsxs("div",{className:"md:col-span-2",children:[t.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Type de déchet *"}),t.jsxs("select",{value:i.typeDechet,onChange:b=>u({...i,typeDechet:b.target.value}),className:"w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent",required:!0,children:[t.jsx("option",{value:"",children:"Sélectionnez"}),t.jsx("option",{value:"plastique_pet",children:"Plastique PET"}),t.jsx("option",{value:"plastique_pehd",children:"Plastique PEHD"}),t.jsx("option",{value:"papier_carton",children:"Papier/Carton"}),t.jsx("option",{value:"metal",children:"Métal"}),t.jsx("option",{value:"verre",children:"Verre"}),t.jsx("option",{value:"organique",children:"Organique"})]})]}),t.jsxs("div",{children:[t.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Quantité *"}),t.jsx("input",{type:"number",step:"0.1",min:"0.1",value:i.quantite,onChange:b=>u({...i,quantite:b.target.value}),className:"w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent",required:!0})]}),t.jsxs("div",{children:[t.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Unité *"}),t.jsxs("select",{value:i.unite,onChange:b=>u({...i,unite:b.target.value}),className:"w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent",required:!0,children:[t.jsx("option",{value:"kg",children:"Kilogrammes (kg)"}),t.jsx("option",{value:"sacs",children:"Sacs"}),t.jsx("option",{value:"unites",children:"Unités"})]})]}),t.jsxs("div",{children:[t.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Mode de collecte *"}),t.jsxs("select",{value:i.modeCollecte,onChange:b=>u({...i,modeCollecte:b.target.value}),className:"w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent",required:!0,children:[t.jsx("option",{value:"",children:"Sélectionnez"}),t.jsx("option",{value:"collecte_domicile",children:"Collecte à domicile"}),t.jsx("option",{value:"depot_volontaire",children:"Dépôt volontaire"})]})]}),t.jsxs("div",{children:[t.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Date souhaitée"}),t.jsx("input",{type:"date",value:i.dateSouhaitee,onChange:b=>u({...i,dateSouhaitee:b.target.value}),className:"w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"})]}),t.jsxs("div",{children:[t.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Créneau horaire"}),t.jsxs("select",{value:i.creneauHoraire,onChange:b=>u({...i,creneauHoraire:b.target.value}),className:"w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent",children:[t.jsx("option",{value:"",children:"Sélectionnez"}),t.jsx("option",{value:"9h-12h",children:"9h - 12h"}),t.jsx("option",{value:"14h-17h",children:"14h - 17h"}),t.jsx("option",{value:"18h-20h",children:"18h - 20h"})]})]})]}),t.jsxs("div",{children:[t.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Notes (optionnel)"}),t.jsx("textarea",{rows:"3",value:i.notes,onChange:b=>u({...i,notes:b.target.value}),className:"w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent",placeholder:"Informations supplémentaires..."})]}),t.jsxs("div",{className:"flex justify-end gap-3 pt-4 border-t",children:[t.jsx("button",{type:"button",onClick:x,className:"px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors",children:"Annuler"}),t.jsx("button",{type:"submit",disabled:d,className:"px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",children:d?"Enregistrement...":"Enregistrer"})]})]})]})}),fy=({declaration:i,onClose:u,getStatusColor:o,getStatusText:d,formatWasteType:x,formatCollectionMode:b,formatDateTime:m,annulerDeclaration:N,showTracking:f,wasteTypes:g})=>t.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 overflow-y-auto",children:t.jsxs("div",{className:"bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto",children:[t.jsxs("div",{className:"sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center",children:[t.jsxs("div",{className:"flex items-center gap-3",children:[t.jsx(De,{className:"w-8 h-8 text-green-600"}),t.jsxs("div",{children:[t.jsx("h2",{className:"text-xl font-bold text-gray-900",children:"Détails de la déclaration"}),t.jsxs("p",{className:"text-gray-600",children:["#",i.id]})]})]}),t.jsxs("div",{className:"flex items-center gap-3",children:[t.jsx("span",{className:`px-4 py-2 rounded-full bg-${o(i.statut)}-100 text-${o(i.statut)}-800 font-medium`,children:d(i.statut)}),t.jsx("button",{onClick:u,className:"p-2 hover:bg-gray-100 rounded-lg transition-colors",children:t.jsx(ys,{className:"w-5 h-5 text-gray-500"})})]})]}),t.jsxs("div",{className:"p-6",children:[t.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-8",children:[t.jsxs("div",{className:"space-y-6",children:[t.jsxs("h3",{className:"text-lg font-semibold text-gray-900 flex items-center gap-2",children:[t.jsx(ft,{className:"w-5 h-5 text-green-600"}),"Informations de la déclaration"]}),t.jsxs("div",{className:"space-y-4",children:[t.jsxs("div",{children:[t.jsx("p",{className:"text-sm text-gray-600",children:"Type de déchet"}),t.jsxs("div",{className:"flex items-center gap-2 mt-1",children:[t.jsx("span",{className:"text-lg",children:g[i.type_dechet]?.icon||"📦"}),t.jsx("span",{className:"text-sm font-medium text-gray-700",children:x(i.type_dechet)})]})]}),t.jsxs("div",{children:[t.jsx("p",{className:"text-sm text-gray-600",children:"Quantité"}),t.jsxs("div",{className:"flex items-center gap-2 mt-1",children:[t.jsx($s,{className:"w-4 h-4 text-gray-400"}),t.jsxs("span",{className:"text-sm text-gray-700",children:[i.quantite||0," ",i.unite||"kg"]})]})]}),t.jsxs("div",{children:[t.jsx("p",{className:"text-sm text-gray-600",children:"Mode de collecte"}),t.jsxs("div",{className:"flex items-center gap-2 mt-1",children:[t.jsx(pa,{className:"w-4 h-4 text-gray-400"}),t.jsx("span",{className:"text-sm text-gray-700",children:b(i.mode_collecte)})]})]}),t.jsxs("div",{children:[t.jsx("p",{className:"text-sm text-gray-600",children:"Date de création"}),t.jsxs("div",{className:"flex items-center gap-2 mt-1",children:[t.jsx(at,{className:"w-4 h-4 text-gray-400"}),t.jsx("span",{className:"text-sm text-gray-700",children:m(i.date_declaration)})]})]}),i.notes&&t.jsxs("div",{children:[t.jsx("p",{className:"text-sm text-gray-600",children:"Instructions spéciales"}),t.jsx("p",{className:"text-sm text-gray-700 bg-gray-50 rounded-lg p-3 mt-1",children:i.notes})]})]})]}),i.collecteur_nom&&t.jsxs("div",{className:"space-y-6",children:[t.jsxs("h3",{className:"text-lg font-semibold text-gray-900 flex items-center gap-2",children:[t.jsx(ct,{className:"w-5 h-5 text-green-600"}),"Informations du collecteur"]}),t.jsxs("div",{className:"space-y-4",children:[t.jsx("h4",{className:"font-semibold text-gray-900",children:i.collecteur_nom}),i.collecteur_telephone&&t.jsxs("div",{className:"flex items-center gap-3",children:[t.jsx(ia,{className:"w-4 h-4 text-gray-400"}),t.jsx("span",{className:"text-sm text-gray-700",children:i.collecteur_telephone})]}),i.collecteur_vehicule&&t.jsxs("div",{className:"flex items-center gap-3",children:[t.jsx(na,{className:"w-4 h-4 text-gray-400"}),t.jsx("span",{className:"text-sm text-gray-700",children:i.collecteur_vehicule})]})]})]}),i.statut==="termine"&&t.jsxs("div",{className:"space-y-6",children:[t.jsxs("h3",{className:"text-lg font-semibold text-gray-900 flex items-center gap-2",children:[t.jsx(Ce,{className:"w-5 h-5 text-green-600"}),"Résultats de la collecte"]}),t.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-6",children:[t.jsxs("div",{children:[t.jsx("p",{className:"text-sm text-gray-600",children:"Poids réel"}),t.jsxs("div",{className:"flex items-center gap-2 mt-1",children:[t.jsx($s,{className:"w-4 h-4 text-gray-400"}),t.jsxs("span",{className:"text-lg font-bold text-gray-900",children:[i.poids_reel||i.quantite," kg"]})]})]}),t.jsxs("div",{children:[t.jsx("p",{className:"text-sm text-gray-600",children:"Points gagnés"}),t.jsxs("div",{className:"flex items-center gap-2 mt-1",children:[t.jsx(zt,{className:"w-4 h-4 text-gray-400"}),t.jsxs("span",{className:"text-lg font-bold text-green-600",children:["+",i.points||0," points"]})]})]})]})]})]}),t.jsxs("div",{className:"mt-8 pt-6 border-t flex gap-3",children:[i.statut==="en_attente"&&t.jsx("button",{onClick:()=>N(i.id),className:"px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors",children:"Annuler la demande"}),t.jsx("button",{onClick:()=>{u(),f(i.id)},className:"px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors",children:"Suivre en temps réel"})]})]})]})}),py=({declaration:i,onClose:u,getStatusColor:o,getStatusText:d,formatWasteType:x,formatCollectionMode:b,formatDateTime:m,wasteTypes:N})=>{const f=[{id:"pending",label:"En attente d'affectation",description:"Nous recherchons un collecteur disponible",timestamp:i.date_declaration,completed:i.statut!=="en_attente",icon:Qe,color:"amber"},{id:"assigned",label:"Collecteur affecté",description:i.collecteur_nom?`${i.collecteur_nom} a été assigné à votre demande`:"En attente d'affectation",timestamp:i.date_affectation,completed:i.statut==="affecte"||i.statut==="programme"||i.statut==="en_cours"||i.statut==="termine",icon:ct,color:"blue"},{id:"scheduled",label:"Collecte programmée",description:i.date_souhaitee?`Rendez-vous fixé pour le ${m(i.date_souhaitee)}`:"En attente de programmation",timestamp:i.date_souhaitee,completed:i.statut==="programme"||i.statut==="en_cours"||i.statut==="termine",icon:at,color:"purple"},{id:"in_progress",label:"En cours de collecte",description:i.statut==="en_cours"?"Le collecteur est en route":"Collecte en attente",timestamp:i.date_debut_collecte,completed:i.statut==="en_cours"||i.statut==="termine",icon:na,color:"orange"},{id:"completed",label:"Collecte effectuée",description:"La collecte a été réalisée avec succès",timestamp:i.date_collecte,completed:i.statut==="termine",icon:Ce,color:"green"}];return t.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 overflow-y-auto",children:t.jsxs("div",{className:"bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto",children:[t.jsxs("div",{className:"sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center",children:[t.jsxs("div",{className:"flex items-center gap-3",children:[t.jsx(De,{className:"w-8 h-8 text-green-600"}),t.jsxs("div",{children:[t.jsx("h2",{className:"text-xl font-bold text-gray-900",children:"Suivi en temps réel"}),t.jsxs("p",{className:"text-gray-600",children:["Déclaration #",i.id]})]})]}),t.jsxs("div",{className:"flex items-center gap-3",children:[t.jsx("span",{className:`px-4 py-2 rounded-full bg-${o(i.statut)}-100 text-${o(i.statut)}-800 font-medium`,children:d(i.statut)}),t.jsx("button",{onClick:u,className:"p-2 hover:bg-gray-100 rounded-lg transition-colors",children:t.jsx(ys,{className:"w-5 h-5 text-gray-500"})})]})]}),t.jsx("div",{className:"p-6",children:t.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-3 gap-6",children:[t.jsxs("div",{className:"lg:col-span-2",children:[t.jsxs("h3",{className:"text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2",children:[t.jsx(Qe,{className:"w-5 h-5 text-green-600"}),"Progression de la collecte"]}),t.jsx("div",{className:"space-y-4",children:f.map((g,j)=>{const p=g.icon,E=j===f.length-1;return t.jsxs("div",{className:"flex gap-4",children:[t.jsxs("div",{className:"flex flex-col items-center",children:[t.jsx("div",{className:`w-10 h-10 rounded-full flex items-center justify-center ${g.completed?`bg-${g.color}-100 text-${g.color}-600`:"bg-gray-100 text-gray-400"}`,children:t.jsx(p,{className:"w-5 h-5"})}),!E&&t.jsx("div",{className:`w-0.5 h-16 mt-2 ${g.completed?"bg-green-200":"bg-gray-200"}`})]}),t.jsx("div",{className:"flex-1 pb-8",children:t.jsxs("div",{className:"flex items-start justify-between",children:[t.jsxs("div",{children:[t.jsx("h3",{className:`font-semibold ${g.completed?"text-gray-900":"text-gray-500"}`,children:g.label}),t.jsx("p",{className:`text-sm mt-1 ${g.completed?"text-gray-600":"text-gray-400"}`,children:g.description})]}),g.timestamp&&t.jsx("span",{className:"text-xs text-gray-500 whitespace-nowrap ml-4",children:m(g.timestamp)})]})})]},g.id)})})]}),t.jsxs("div",{className:"space-y-6",children:[i.collecteur_nom&&t.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-gray-200 p-6",children:[t.jsxs("h3",{className:"text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2",children:[t.jsx(ct,{className:"w-5 h-5 text-green-600"}),"Collecteur assigné"]}),t.jsxs("div",{className:"space-y-3",children:[t.jsx("h4",{className:"font-semibold text-gray-900",children:i.collecteur_nom}),i.collecteur_telephone&&t.jsxs("div",{className:"flex items-center gap-3",children:[t.jsx(ia,{className:"w-4 h-4 text-gray-400"}),t.jsx("span",{className:"text-sm text-gray-700",children:i.collecteur_telephone})]}),i.collecteur_vehicule&&t.jsxs("div",{className:"flex items-center gap-3",children:[t.jsx(na,{className:"w-4 h-4 text-gray-400"}),t.jsx("span",{className:"text-sm text-gray-700",children:i.collecteur_vehicule})]})]})]}),i.date_souhaitee&&t.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-gray-200 p-6",children:[t.jsxs("h3",{className:"text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2",children:[t.jsx(at,{className:"w-5 h-5 text-green-600"}),"Programmation"]}),t.jsx("p",{className:"font-medium text-gray-900",children:m(i.date_souhaitee)})]}),i.statut==="termine"&&i.points&&t.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-gray-200 p-6",children:[t.jsxs("h3",{className:"text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2",children:[t.jsx(Ce,{className:"w-5 h-5 text-green-600"}),"Résultat"]}),t.jsxs("div",{className:"space-y-3",children:[t.jsxs("div",{children:[t.jsx("p",{className:"text-sm text-gray-600",children:"Poids réel"}),t.jsxs("p",{className:"font-medium text-gray-900",children:[i.poids_reel||i.quantite," kg"]})]}),t.jsxs("div",{children:[t.jsx("p",{className:"text-sm text-gray-600",children:"Points gagnés"}),t.jsxs("p",{className:"font-medium text-green-600",children:["+",i.points," points"]})]})]})]})]})]})})]})})},gy=({declarations:i,searchTerm:u,setSearchTerm:o,declarationFilter:d,setDeclarationFilter:x,loadDeclarations:b,getStatusColor:m,getStatusText:N,formatDate:f,formatWasteType:g,showDeclarationDetail:j,wasteTypes:p,isLoading:E})=>t.jsxs("div",{children:[t.jsxs("h1",{className:"text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2",children:[t.jsx(hi,{className:"w-6 h-6 text-green-600"}),"Historique des déclarations"]}),t.jsx("div",{className:"bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6",children:t.jsxs("div",{className:"flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4",children:[t.jsx("div",{className:"flex-1",children:t.jsxs("div",{className:"relative",children:[t.jsx(ql,{className:"absolute left-3 top-3 w-4 h-4 text-gray-400"}),t.jsx("input",{type:"text",placeholder:"Rechercher par numéro, type de déchet...",value:u,onChange:L=>o(L.target.value),className:"w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"})]})}),t.jsxs("div",{className:"flex flex-col sm:flex-row gap-3",children:[t.jsxs("select",{value:d,onChange:L=>x(L.target.value),className:"px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent",children:[t.jsx("option",{value:"all",children:"Tous les statuts"}),t.jsx("option",{value:"termine",children:"Terminé"}),t.jsx("option",{value:"affecte",children:"En cours"}),t.jsx("option",{value:"programme",children:"En chemin"})]}),t.jsxs("button",{onClick:b,className:"flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors",children:[t.jsx(De,{className:"w-4 h-4"}),"Actualiser"]})]})]})}),t.jsx("div",{className:"bg-white rounded-xl shadow-sm border border-gray-200",children:t.jsx("div",{className:"divide-y divide-gray-200",children:i.length>0?i.map(L=>{const M=m(L.statut);return t.jsx("div",{className:"p-6 hover:bg-gray-50 transition-colors",children:t.jsxs("div",{className:"flex items-start justify-between",children:[t.jsxs("div",{className:"flex-1",children:[t.jsxs("div",{className:"flex items-center gap-3 mb-3",children:[t.jsxs("span",{className:"font-mono text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded",children:["#",L.id?.substring(0,8)]}),t.jsx("span",{className:`px-2 py-1 rounded-full text-xs font-medium bg-${M}-100 text-${M}-800`,children:N(L.statut)})]}),t.jsxs("div",{className:"flex items-center gap-4 mb-3",children:[t.jsx("span",{className:"text-lg",children:p[L.type_dechet]?.icon||"📦"}),t.jsxs("span",{className:"text-sm font-medium text-gray-700",children:[L.quantite||0," ",L.unite||"kg"]})]}),t.jsxs("div",{className:"flex items-center gap-6 text-sm text-gray-500",children:[t.jsxs("div",{className:"flex items-center gap-1",children:[t.jsx(at,{className:"w-3 h-3"}),f(L.date_declaration)]}),L.collecteur_nom&&t.jsxs("div",{className:"flex items-center gap-1",children:[t.jsx(ta,{className:"w-3 h-3"}),L.collecteur_nom]})]}),L.statut==="termine"&&L.points&&t.jsx("div",{className:"mt-3 pt-3 border-t border-gray-100 flex items-center gap-4 text-sm",children:t.jsxs("span",{className:"text-purple-600 font-medium",children:[t.jsx(zt,{className:"w-3 h-3 inline mr-1"}),"+",L.points," points"]})})]}),t.jsxs("button",{onClick:()=>j(L.id),className:"flex items-center gap-1 text-green-600 hover:text-green-700 transition-colors",children:[t.jsx(ps,{className:"w-4 h-4"}),t.jsx("span",{className:"text-sm font-medium",children:"Détails"})]})]})},L.id)}):t.jsxs("div",{className:"text-center py-12",children:[t.jsx(hi,{className:"w-16 h-16 text-gray-300 mx-auto mb-4"}),t.jsx("p",{className:"text-gray-500",children:E?"Chargement de l'historique...":"Aucun historique trouvé"})]})})})]}),by=({totalPoints:i,totalWaste:u})=>{const d=Math.min(i/500*100,100);return t.jsxs("div",{children:[t.jsxs("h1",{className:"text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2",children:[t.jsx(zt,{className:"w-6 h-6 text-green-600"}),"Mes récompenses"]}),t.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8",children:[t.jsxs("div",{className:"bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-6 text-white lg:col-span-2",children:[t.jsx("h2",{className:"text-xl font-bold mb-4",children:"Programme de fidélité"}),t.jsxs("div",{className:"mb-4",children:[t.jsxs("div",{className:"flex justify-between mb-2",children:[t.jsx("span",{children:"Points accumulés"}),t.jsxs("span",{className:"text-2xl font-bold",children:[i," / ",500]})]}),t.jsx("div",{className:"w-full bg-white/20 rounded-full h-3",children:t.jsx("div",{className:"bg-yellow-400 h-3 rounded-full",style:{width:`${d}%`}})}),t.jsxs("p",{className:"text-sm mt-2",children:[500-i," points avant le prochain niveau"]})]}),t.jsxs("div",{className:"grid grid-cols-2 gap-4 mt-6",children:[t.jsxs("div",{className:"bg-white/10 rounded-xl p-4",children:[t.jsx("p",{className:"text-sm opacity-90",children:"Déchets collectés"}),t.jsxs("p",{className:"text-2xl font-bold",children:[u," kg"]})]}),t.jsxs("div",{className:"bg-white/10 rounded-xl p-4",children:[t.jsx("p",{className:"text-sm opacity-90",children:"Niveau actuel"}),t.jsx("p",{className:"text-2xl font-bold",children:"Éco-Héros"})]})]})]}),t.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-gray-200 p-6",children:[t.jsx("h3",{className:"font-semibold text-gray-900 mb-4",children:"Avantages du niveau"}),t.jsxs("ul",{className:"space-y-3",children:[t.jsxs("li",{className:"flex items-center gap-2 text-sm",children:[t.jsx(Ce,{className:"w-4 h-4 text-green-600"}),t.jsx("span",{children:"Collecte prioritaire"})]}),t.jsxs("li",{className:"flex items-center gap-2 text-sm",children:[t.jsx(Ce,{className:"w-4 h-4 text-green-600"}),t.jsx("span",{children:"+15% de points bonus"})]}),t.jsxs("li",{className:"flex items-center gap-2 text-sm",children:[t.jsx(Ce,{className:"w-4 h-4 text-green-600"}),t.jsx("span",{children:'Badge "Éco-Héros"'})]}),t.jsxs("li",{className:"flex items-center gap-2 text-sm",children:[t.jsx(Ce,{className:"w-4 h-4 text-green-600"}),t.jsx("span",{children:"Accès aux récompenses exclusives"})]})]})]})]})]})},vy=({currentUser:i,dashboardData:u,profileForm:o,setProfileForm:d,isEditing:x,setIsEditing:b,isLoading:m,handleUpdateProfile:N,handleLocationClick:f,locationLoading:g,showPasswordFields:j,setShowPasswordFields:p,passwordForm:E,setPasswordForm:L,handleChangePassword:M,copyToken:w,currentToken:k,formatProducerType:A,formatDate:O,handleLogout:$})=>t.jsxs("div",{children:[t.jsxs("h1",{className:"text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2",children:[t.jsx(ct,{className:"w-6 h-6 text-green-600"}),"Mon Compte"]}),t.jsxs("div",{className:"relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-green-600 to-green-700 p-8 text-white",children:[t.jsxs("div",{className:"relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6",children:[t.jsxs("div",{className:"flex items-center gap-4",children:[t.jsx("div",{className:"relative h-20 w-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/50",children:t.jsx(ct,{className:"h-10 w-10 text-white"})}),t.jsxs("div",{children:[t.jsxs("h1",{className:"text-3xl font-bold mb-2 flex items-center gap-2",children:[i?.nomComplet,t.jsxs("span",{className:"inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-sm font-medium backdrop-blur-sm",children:[t.jsx(Vt,{className:"h-4 w-4"}),"Éco-producteur"]})]}),t.jsxs("p",{className:"text-white/90 flex items-center gap-2",children:[t.jsx(gs,{className:"h-4 w-4"}),i?.email]})]})]}),t.jsx("div",{className:"flex gap-3",children:x?t.jsxs(t.Fragment,{children:[t.jsx("button",{onClick:()=>{b(!1)},className:"rounded-xl bg-white/20 px-6 py-3 font-medium text-white backdrop-blur-sm transition-all hover:bg-white/30",children:"Annuler"}),t.jsx("button",{onClick:N,disabled:m,className:"group flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-green-600 transition-all hover:bg-green-50 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed",children:m?t.jsxs(t.Fragment,{children:[t.jsx("div",{className:"h-4 w-4 animate-spin rounded-full border-2 border-green-600 border-t-transparent"}),t.jsx("span",{children:"Enregistrement..."})]}):t.jsxs(t.Fragment,{children:[t.jsx(Hx,{className:"h-4 w-4 transition-transform group-hover:scale-110"}),t.jsx("span",{className:"font-medium",children:"Enregistrer"})]})})]}):t.jsxs("button",{onClick:()=>b(!0),className:"group flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-green-600 transition-all hover:bg-green-50 hover:shadow-lg",children:[t.jsx(Bx,{className:"h-4 w-4 transition-transform group-hover:rotate-12"}),t.jsx("span",{className:"font-medium",children:"Modifier le profil"})]})})]}),t.jsxs("div",{className:"relative mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4",children:[t.jsx("div",{className:"rounded-xl bg-white/10 backdrop-blur-sm p-4 transition-transform hover:scale-105",children:t.jsxs("div",{className:"flex items-center gap-3",children:[t.jsx("div",{className:"rounded-lg bg-green-500/30 p-2",children:t.jsx(bs,{className:"h-5 w-5 text-white"})}),t.jsxs("div",{children:[t.jsx("p",{className:"text-sm text-white/80",children:"Déchets collectés"}),t.jsxs("p",{className:"text-xl font-bold",children:[u.totalWaste," kg"]})]})]})}),t.jsx("div",{className:"rounded-xl bg-white/10 backdrop-blur-sm p-4 transition-transform hover:scale-105",children:t.jsxs("div",{className:"flex items-center gap-3",children:[t.jsx("div",{className:"rounded-lg bg-green-500/30 p-2",children:t.jsx(Vt,{className:"h-5 w-5 text-white"})}),t.jsxs("div",{children:[t.jsx("p",{className:"text-sm text-white/80",children:"CO₂ évité"}),t.jsxs("p",{className:"text-xl font-bold",children:[Math.round(u.totalWaste*2)," kg"]})]})]})}),t.jsx("div",{className:"rounded-xl bg-white/10 backdrop-blur-sm p-4 transition-transform hover:scale-105",children:t.jsxs("div",{className:"flex items-center gap-3",children:[t.jsx("div",{className:"rounded-lg bg-green-500/30 p-2",children:t.jsx(zt,{className:"h-5 w-5 text-white"})}),t.jsxs("div",{children:[t.jsx("p",{className:"text-sm text-white/80",children:"Points verts"}),t.jsx("p",{className:"text-xl font-bold",children:u.totalPointsEarned})]})]})})]})]}),t.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-3 gap-8",children:[t.jsxs("div",{className:"lg:col-span-2 space-y-6",children:[t.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-gray-200 p-6",children:[t.jsxs("h3",{className:"text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2",children:[t.jsx(ct,{className:"w-5 h-5 text-green-600"}),"Informations personnelles"]}),x?t.jsxs("form",{onSubmit:N,className:"space-y-4",children:[t.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[t.jsxs("div",{children:[t.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Nom complet"}),t.jsx("input",{type:"text",value:o.nomComplet,onChange:Y=>d({...o,nomComplet:Y.target.value}),className:"w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent",required:!0})]}),t.jsxs("div",{children:[t.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Téléphone"}),t.jsx("input",{type:"tel",value:o.telephone,onChange:Y=>d({...o,telephone:Y.target.value}),className:"w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent",required:!0})]})]}),t.jsxs("div",{children:[t.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Adresse"}),t.jsx("textarea",{rows:"2",value:o.adresse,onChange:Y=>d({...o,adresse:Y.target.value}),className:"w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"})]}),t.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[t.jsxs("div",{children:[t.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Quartier"}),t.jsxs("div",{className:"flex gap-2",children:[t.jsx("input",{type:"text",value:o.quartier,onChange:Y=>d({...o,quartier:Y.target.value}),className:"flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"}),t.jsx("button",{type:"button",onClick:f,disabled:g,className:"px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50",children:g?"...":"GPS"})]})]}),t.jsxs("div",{children:[t.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Commune"}),t.jsx("input",{type:"text",value:o.commune,onChange:Y=>d({...o,commune:Y.target.value}),className:"w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"})]})]})]}):t.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[t.jsxs("div",{className:"bg-gray-50 p-4 rounded-lg",children:[t.jsx("p",{className:"text-sm text-gray-500",children:"Nom complet"}),t.jsx("p",{className:"font-medium text-gray-900",children:i?.nomComplet||"-"})]}),t.jsxs("div",{className:"bg-gray-50 p-4 rounded-lg",children:[t.jsx("p",{className:"text-sm text-gray-500",children:"Email"}),t.jsx("p",{className:"font-medium text-gray-900",children:i?.email||"-"})]}),t.jsxs("div",{className:"bg-gray-50 p-4 rounded-lg",children:[t.jsx("p",{className:"text-sm text-gray-500",children:"Téléphone"}),t.jsx("p",{className:"font-medium text-gray-900",children:i?.telephone||"-"})]}),t.jsxs("div",{className:"bg-gray-50 p-4 rounded-lg",children:[t.jsx("p",{className:"text-sm text-gray-500",children:"Type"}),t.jsx("p",{className:"font-medium text-gray-900",children:A(i?.typeProducteur)})]}),t.jsxs("div",{className:"bg-gray-50 p-4 rounded-lg",children:[t.jsx("p",{className:"text-sm text-gray-500",children:"Adresse"}),t.jsx("p",{className:"font-medium text-gray-900",children:i?.adresse||"-"})]}),t.jsxs("div",{className:"bg-gray-50 p-4 rounded-lg",children:[t.jsx("p",{className:"text-sm text-gray-500",children:"Localisation"}),t.jsx("p",{className:"font-medium text-gray-900",children:[i?.quartier,i?.commune].filter(Boolean).join(", ")||"-"})]}),t.jsxs("div",{className:"bg-gray-50 p-4 rounded-lg",children:[t.jsx("p",{className:"text-sm text-gray-500",children:"Membre depuis"}),t.jsx("p",{className:"font-medium text-gray-900",children:i?.cree_le?O(i.cree_le):"-"})]}),t.jsxs("div",{className:"bg-gray-50 p-4 rounded-lg",children:[t.jsx("p",{className:"text-sm text-gray-500",children:"Statut"}),t.jsx("span",{className:"inline-block px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium",children:"Actif"})]})]})]}),t.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-gray-200 p-6",children:[t.jsxs("div",{className:"flex items-center justify-between mb-4",children:[t.jsxs("h3",{className:"text-lg font-semibold text-gray-900 flex items-center gap-2",children:[t.jsx(dx,{className:"w-5 h-5 text-green-600"}),"Sécurité"]}),t.jsx("button",{onClick:()=>p(!j),className:"text-sm text-green-600 hover:text-green-700 font-medium",children:j?"Annuler":"Changer le mot de passe"})]}),j&&t.jsxs("form",{onSubmit:M,className:"space-y-4",children:[t.jsxs("div",{children:[t.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Mot de passe actuel"}),t.jsx("input",{type:"password",value:E.currentPassword,onChange:Y=>L({...E,currentPassword:Y.target.value}),className:"w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent",required:!0})]}),t.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[t.jsxs("div",{children:[t.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Nouveau mot de passe"}),t.jsx("input",{type:"password",value:E.newPassword,onChange:Y=>L({...E,newPassword:Y.target.value}),className:"w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent",minLength:"8",required:!0})]}),t.jsxs("div",{children:[t.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Confirmer"}),t.jsx("input",{type:"password",value:E.confirmPassword,onChange:Y=>L({...E,confirmPassword:Y.target.value}),className:"w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent",minLength:"8",required:!0})]})]}),t.jsx("button",{type:"submit",disabled:m,className:"px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50",children:m?"Changement...":"Changer le mot de passe"})]})]})]}),t.jsxs("div",{className:"space-y-6",children:[t.jsxs("div",{className:"bg-white rounded-xl shadow-sm border border-gray-200 p-6",children:[t.jsxs("h3",{className:"text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2",children:[t.jsx(dx,{className:"w-5 h-5 text-green-600"}),"Token JWT"]}),t.jsxs("div",{className:"bg-gray-50 p-4 rounded-lg flex items-center gap-4",children:[t.jsx("code",{className:"flex-1 font-mono text-sm break-all",children:k?k.length>50?k.substring(0,50)+"...":k:"Non connecté"}),t.jsxs("button",{onClick:w,className:"px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2",children:[t.jsx(pb,{className:"w-4 h-4"}),"Copier"]})]})]}),t.jsxs("div",{className:"bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-6 border border-red-200",children:[t.jsxs("h3",{className:"font-semibold text-red-900 mb-3 flex items-center gap-2",children:[t.jsx(Vs,{className:"w-4 h-4"}),"Déconnexion"]}),t.jsx("p",{className:"text-sm text-red-800 mb-4",children:"Vous pouvez vous déconnecter de votre session actuelle."}),t.jsxs("button",{onClick:$,className:"w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2",children:[t.jsx(Vs,{className:"w-4 h-4"}),"Se déconnecter"]})]})]})]})]});function yy(){return t.jsx(_g,{children:t.jsx("div",{className:"App",children:t.jsxs(cg,{children:[t.jsx(it,{path:"/",element:t.jsx(iy,{})}),t.jsx(it,{path:"/register",element:t.jsx(Vg,{})}),t.jsx(it,{path:"/login",element:t.jsx($g,{})}),t.jsx(it,{path:"/producteur",element:t.jsx(dy,{})}),t.jsx(it,{path:"/forgot-password",element:t.jsx(Zv,{})}),t.jsx(it,{path:"/reset-password",element:t.jsx(Qv,{})}),t.jsx(it,{path:"/verify-code",element:t.jsx(oy,{})}),t.jsx(it,{path:"/profile",element:t.jsx(Jv,{})}),t.jsx(it,{path:"/dashboard",element:t.jsx(Pv,{})}),t.jsx(it,{path:"/declare",element:t.jsx(Wv,{})}),t.jsx(it,{path:"/tracking/:id",element:t.jsx(Fv,{})}),t.jsx(it,{path:"/tracking",element:t.jsx(Iv,{})}),t.jsx(it,{path:"/history",element:t.jsx(ey,{})}),t.jsx(it,{path:"/declaration/:id",element:t.jsx(ty,{})}),t.jsx(it,{path:"/rewards",element:t.jsx(ay,{})}),t.jsx(it,{path:"/notifications",element:t.jsx(sy,{})}),t.jsx(it,{path:"/settings",element:t.jsx(ly,{})}),t.jsx(it,{path:"/terms",element:t.jsx(ry,{})}),t.jsx(it,{path:"/privacy",element:t.jsx(ny,{})})]})})})}dp.createRoot(document.getElementById("root")).render(t.jsx(v.StrictMode,{children:t.jsx(yy,{})}));
