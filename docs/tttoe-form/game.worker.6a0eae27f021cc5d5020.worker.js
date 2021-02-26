/*! For license information please see game.worker.6a0eae27f021cc5d5020.worker.js.LICENSE.txt */
(()=>{"use strict";var r=Number.POSITIVE_INFINITY,e=function(){function e(){}return e.canMove=function(r){for(var e=0;e<9;e++)if(null===r[e])return!0;return!1},e.getScore=function(r,e,n){for(var t=0;t<9;t+=3)if(r[t]==r[t+1]&&r[t+1]==r[t+2]){if(r[t]===e)return 10;if(r[t]===n)return-10}for(var i=0;i<3;i++)if(r[i]===r[i+3]&&r[i+3]===r[i+6]){if(r[i]===e)return 10;if(r[i]===n)return-10}if(r[0]===r[4]&&r[4]===r[8]){if(r[0]==e)return 10;if(r[0]==n)return-10}if(r[2]===r[4]&&r[4]===r[6]){if(r[2]==e)return 10;if(r[2]==n)return-10}return 0},e.minimax=function(n,t,i,o,f,a){var u,s=e.getScore(n,o,f);if(10==s)return a.win++,a.matches++,s;if(-10==s)return a.loss++,a.matches++,s;if(!e.canMove(n))return a.matches++,0;if(i){u=-r;for(var c=0;c<9;c++)null===(l=n)[c]&&(l[c]=o,u=Math.max(u,e.minimax(l,t+1,!i,o,f,a)),l[c]=null)}else for(u=r,c=0;c<9;c++){var l;null===(l=n)[c]&&(l[c]=f,u=Math.min(u,e.minimax(l,t+1,!i,o,f,a)),l[c]=null)}return u},e.findBestMove=function(n,t,i){for(var o=[],f={matches:0,win:0,loss:0},a=0;a<9;a++){var u=n;if(!u[a]){u[a]=t;var s=e.minimax(u,0,!1,t,i,f);o.push({score:s,move:a}),u[a]=null}}var c=o.reduce((function(r,e){return e.score>r?e.score:r}),-r),l=o.filter((function(r){return r.score===c}));return l.length?l[a=Math.floor(l.length*Math.random())].move:-1},e}(),n=self;console.log("game.worker.ts",n),n.addEventListener("message",(function(r){if(r&&r.data){var n=r.data,t=e.findBestMove(n.board,n.player,n.opponent);postMessage({bestMove:t})}}))})();
//# sourceMappingURL=game.worker.a8f2e8451441fe4b765f92dd59db04ab..js.map