/**
 * Highcharts JS v11.3.0 (2024-01-10)
 *
 * Sankey diagram module
 *
 * (c) 2010-2024 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */!function(t){"object"==typeof module&&module.exports?(t.default=t,module.exports=t):"function"==typeof define&&define.amd?define("highcharts/modules/sankey",["highcharts"],function(o){return t(o),t.Highcharts=o,t}):t("undefined"!=typeof Highcharts?Highcharts:void 0)}(function(t){"use strict";var o=t?t._modules:{};function e(t,o,e,i){t.hasOwnProperty(o)||(t[o]=i.apply(null,e),"function"==typeof CustomEvent&&window.dispatchEvent(new CustomEvent("HighchartsModuleLoaded",{detail:{path:o,module:t[o]}})))}e(o,"Series/NodesComposition.js",[o["Core/Series/SeriesRegistry.js"],o["Core/Utilities.js"]],function(t,o){var e,i=t.series,n=i.prototype,r=i.prototype.pointClass.prototype,s=o.defined,a=o.extend,l=o.find,p=o.merge,d=o.pick;return function(t){function o(){return this.data=[].concat(this.points||[],this.nodes),n.destroy.apply(this,arguments)}function e(){this.nodes&&(this.nodes.forEach(function(t){t.destroy()}),this.nodes.length=0),n.setData.apply(this,arguments)}function i(t){var o=arguments,e=this.isNode?this.linksTo.concat(this.linksFrom):[this.fromNode,this.toNode];"select"!==t&&e.forEach(function(t){t&&t.series&&(r.setState.apply(t,o),!t.isNode&&(t.fromNode.graphic&&r.setState.apply(t.fromNode,o),t.toNode&&t.toNode.graphic&&r.setState.apply(t.toNode,o)))}),r.setState.apply(this,o)}function h(t,o,e,i){var n=this,s=this.series.options.nodes,a=this.series.options.data,l=a&&a.length||0,h=a&&a[this.index];if(r.update.call(this,t,!this.isNode&&o,e,i),this.isNode){var c=(s||[]).reduce(function(t,o,e){return n.id===o.id?e:t},-1),u=p(s&&s[c]||{},a&&a[this.index]||{});a&&(h?a[this.index]=h:a.length=l),s?c>=0?s[c]=u:s.push(u):this.series.options.nodes=[u],d(o,!0)&&this.series.chart.redraw(e)}}t.compose=function(t,n){var r=t.prototype,s=n.prototype;return r.setNodeState=i,r.setState=i,r.update=h,s.destroy=o,s.setData=e,n},t.createNode=function(t){var o,e=this.pointClass,i=function(t,o){return l(t,function(t){return t.id===o})},n=i(this.nodes,t);if(!n){o=this.options.nodes&&i(this.options.nodes,t);var r=new e(this,a({className:"highcharts-node",isNode:!0,id:t,y:1},o));r.linksTo=[],r.linksFrom=[],r.getSum=function(){var t=0,o=0;return r.linksTo.forEach(function(o){t+=o.weight||0}),r.linksFrom.forEach(function(t){o+=t.weight||0}),Math.max(t,o)},r.offset=function(t,o){for(var e=0,i=0;i<r[o].length;i++){if(r[o][i]===t)return e;e+=r[o][i].weight}},r.hasShape=function(){var t=0;return r.linksTo.forEach(function(o){o.outgoing&&t++}),!r.linksTo.length||t!==r.linksTo.length},r.index=this.nodes.push(r)-1,n=r}return n.formatPrefix="node",n.name=n.name||n.options.id||"",n.mass=d(n.options.mass,n.options.marker&&n.options.marker.radius,this.options.marker&&this.options.marker.radius,4),n},t.destroy=o,t.generatePoints=function(){var t=this,o=this.chart,e={};n.generatePoints.call(this),this.nodes||(this.nodes=[]),this.colorCounter=0,this.nodes.forEach(function(t){t.linksFrom.length=0,t.linksTo.length=0,t.level=t.options.level}),this.points.forEach(function(i){s(i.from)&&(e[i.from]||(e[i.from]=t.createNode(i.from)),e[i.from].linksFrom.push(i),i.fromNode=e[i.from],o.styledMode?i.colorIndex=d(i.options.colorIndex,e[i.from].colorIndex):i.color=i.options.color||e[i.from].color),s(i.to)&&(e[i.to]||(e[i.to]=t.createNode(i.to)),e[i.to].linksTo.push(i),i.toNode=e[i.to]),i.name=i.name||i.id},this),this.nodeLookup=e},t.setNodeState=i,t.updateNode=h}(e||(e={})),e}),e(o,"Series/Sankey/SankeyPoint.js",[o["Core/Series/Point.js"],o["Core/Series/SeriesRegistry.js"],o["Core/Utilities.js"]],function(t,o,e){var i,n=this&&this.__extends||(i=function(t,o){return(i=Object.setPrototypeOf||({__proto__:[]})instanceof Array&&function(t,o){t.__proto__=o}||function(t,o){for(var e in o)Object.prototype.hasOwnProperty.call(o,e)&&(t[e]=o[e])})(t,o)},function(t,o){if("function"!=typeof o&&null!==o)throw TypeError("Class extends value "+String(o)+" is not a constructor or null");function e(){this.constructor=t}i(t,o),t.prototype=null===o?Object.create(o):(e.prototype=o.prototype,new e)}),r=o.seriesTypes.column,s=e.defined;return function(o){function e(){return null!==o&&o.apply(this,arguments)||this}return n(e,o),e.prototype.applyOptions=function(o,e){return t.prototype.applyOptions.call(this,o,e),s(this.options.level)&&(this.options.column=this.column=this.options.level),this},e.prototype.getClassName=function(){return(this.isNode?"highcharts-node ":"highcharts-link ")+t.prototype.getClassName.call(this)},e.prototype.getFromNode=function(){for(var t,o=-1,e=0;e<this.linksTo.length;e++){var i=this.linksTo[e];i.fromNode.column>o&&i.fromNode!==this&&(o=(t=i.fromNode).column)}return{fromNode:t,fromColumn:o}},e.prototype.setNodeColumn=function(){s(this.options.column)||(0===this.linksTo.length?this.column=0:this.column=this.getFromNode().fromColumn+1)},e.prototype.isValid=function(){return this.isNode||"number"==typeof this.weight},e}(r.prototype.pointClass)}),e(o,"Series/Sankey/SankeySeriesDefaults.js",[],function(){return{borderWidth:0,colorByPoint:!0,curveFactor:.33,dataLabels:{enabled:!0,backgroundColor:"none",crop:!1,nodeFormat:void 0,nodeFormatter:function(){return this.point.name},format:void 0,formatter:function(){},inside:!0},inactiveOtherPoints:!0,linkColorMode:"from",linkOpacity:.5,opacity:1,minLinkWidth:0,nodeAlignment:"center",nodeWidth:20,nodePadding:10,showInLegend:!1,states:{hover:{linkOpacity:1,opacity:1},inactive:{linkOpacity:.1,opacity:.1,animation:{duration:50}}},tooltip:{followPointer:!0,headerFormat:'<span style="font-size: 0.8em">{series.name}</span><br/>',pointFormat:"{point.fromNode.name} → {point.toNode.name}: <b>{point.weight}</b><br/>",nodeFormat:"{point.name}: <b>{point.sum}</b><br/>"}}}),e(o,"Series/Sankey/SankeyColumnComposition.js",[o["Core/Utilities.js"]],function(t){var o,e,i,n=t.defined,r=(t.pushUnique,t.relativeLength);return(o=i||(i={})).compose=function(t,o){return t.sankeyColumn=new e(t,o),t},e=function(){function t(t,o){this.points=t,this.series=o}return t.prototype.getTranslationFactor=function(t){for(var o,e,i=this.points,n=i.slice(),r=t.chart,s=t.options.minLinkWidth||0,a=0,l=(r.plotSizeY||0)-(t.options.borderWidth||0)-(i.length-1)*t.nodePadding;i.length;){for(a=l/i.sankeyColumn.sum(),o=!1,e=i.length;e--;)i[e].getSum()*a<s&&(i.splice(e,1),l=Math.max(0,l-s),o=!0);if(!o)break}i.length=0;for(var p=0;p<n.length;p++){var d=n[p];i.push(d)}return a},t.prototype.top=function(t){var o=this.series,e=o.nodePadding,i=this.points.reduce(function(i,n){return i>0&&(i+=e),i+=Math.max(n.getSum()*t,o.options.minLinkWidth||0)},0);return({top:0,center:.5,bottom:1})[o.options.nodeAlignment||"center"]*((o.chart.plotSizeY||0)-i)},t.prototype.left=function(t){var o=this.series,e=o.chart,i=o.options.equalNodes,n=e.inverted?e.plotHeight:e.plotWidth,r=o.nodePadding,s=this.points.reduce(function(e,s){return e>0&&(e+=r),e+=i?n/s.series.nodes.length-r:Math.max(s.getSum()*t,o.options.minLinkWidth||0)},0);return((e.plotSizeX||0)-Math.round(s))/2},t.prototype.sum=function(){return this.points.reduce(function(t,o){return t+o.getSum()},0)},t.prototype.offset=function(t,o){var e,i=this.points,s=this.series,a=s.nodePadding,l=0;if(s.is("organization")&&t.hangsFrom)return{absoluteTop:t.hangsFrom.nodeY};for(var p=0;p<i.length;p++){var d=i[p].getSum(),h=Math.max(d*o,s.options.minLinkWidth||0),c=t.options[s.chart.inverted?"offsetHorizontal":"offsetVertical"],u=t.options.offset||0;if(e=d?h+a:0,i[p]===t)return{relativeTop:l+(n(c)?r(c,h):r(u,e))};l+=e}},t}(),o.SankeyColumnAdditions=e,i}),e(o,"Series/TreeUtilities.js",[o["Core/Color/Color.js"],o["Core/Utilities.js"]],function(t,o){var e=o.extend,i=o.isArray,n=o.isNumber,r=o.isObject,s=o.merge,a=o.pick;return{getColor:function(o,e){var i,n,r,s,l,p,d,h=e.index,c=e.mapOptionsToLevel,u=e.parentColor,f=e.parentColorIndex,m=e.series,y=e.colors,v=e.siblings,g=m.points,k=m.chart.options.chart;return o&&(n=g[o.i],r=c[o.level]||{},n&&r.colorByPoint&&(l=n.index%(y?y.length:k.colorCount),s=y&&y[l]),m.chart.styledMode||(p=a(n&&n.options.color,r&&r.color,s,u&&((i=r&&r.colorVariation)&&"brightness"===i.key&&h&&v?t.parse(u).brighten(i.to*(h/v)).get():u),m.color)),d=a(n&&n.options.colorIndex,r&&r.colorIndex,l,f,e.colorIndex)),{color:p,colorIndex:d}},getLevelOptions:function(t){var o,e,l,p,d,h,c={};if(r(t))for(p=n(t.from)?t.from:1,h=t.levels,e={},o=r(t.defaults)?t.defaults:{},i(h)&&(e=h.reduce(function(t,e){var i,l,d;return r(e)&&n(e.level)&&(l=a((d=s({},e)).levelIsConstant,o.levelIsConstant),delete d.levelIsConstant,delete d.level,r(t[i=e.level+(l?0:p-1)])?s(!0,t[i],d):t[i]=d),t},{})),d=n(t.to)?t.to:1,l=0;l<=d;l++)c[l]=s({},o,r(e[l])?e[l]:{});return c},setTreeValues:function t(o,i){var n=i.before,r=i.idRoot,s=i.mapIdToNode[r],l=!1!==i.levelIsConstant,p=i.points[o.i],d=p&&p.options||{},h=[],c=0;o.levelDynamic=o.level-(l?0:s.level),o.name=a(p&&p.name,""),o.visible=r===o.id||!0===i.visible,"function"==typeof n&&(o=n(o,i)),o.children.forEach(function(n,r){var s=e({},i);e(s,{index:r,siblings:o.children.length,visible:o.visible}),n=t(n,s),h.push(n),n.visible&&(c+=n.val)});var u=a(d.value,c);return o.visible=u>=0&&(c>0||o.visible),o.children=h,o.childrenTotal=c,o.isLeaf=o.visible&&!c,o.val=u,o},updateRootId:function(t){var o,e;return r(t)&&(e=r(t.options)?t.options:{},o=a(t.rootNode,e.rootId,""),r(t.userOptions)&&(t.userOptions.rootId=o),t.rootNode=o),o}}}),e(o,"Series/Sankey/SankeySeries.js",[o["Core/Globals.js"],o["Series/NodesComposition.js"],o["Series/Sankey/SankeyPoint.js"],o["Series/Sankey/SankeySeriesDefaults.js"],o["Core/Series/SeriesRegistry.js"],o["Series/Sankey/SankeyColumnComposition.js"],o["Core/Color/Color.js"],o["Series/TreeUtilities.js"],o["Core/Utilities.js"]],function(t,o,e,i,n,r,s,a,l){var p,d=this&&this.__extends||(p=function(t,o){return(p=Object.setPrototypeOf||({__proto__:[]})instanceof Array&&function(t,o){t.__proto__=o}||function(t,o){for(var e in o)Object.prototype.hasOwnProperty.call(o,e)&&(t[e]=o[e])})(t,o)},function(t,o){if("function"!=typeof o&&null!==o)throw TypeError("Class extends value "+String(o)+" is not a constructor or null");function e(){this.constructor=t}p(t,o),t.prototype=null===o?Object.create(o):(e.prototype=o.prototype,new e)}),h=n.seriesTypes,c=h.column,u=h.line,f=s.parse,m=a.getLevelOptions,y=l.clamp,v=l.extend,g=l.isObject,k=l.merge,C=l.pick,S=l.relativeLength,b=l.stableSort,N=function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return d(e,t),e.getDLOptions=function(t){var o=g(t.optionsPoint)?t.optionsPoint.dataLabels:{};return k({style:{}},g(t.level)?t.level.dataLabels:{},o)},e.prototype.createNodeColumns=function(){for(var t=[],o=0,e=this.nodes;o<e.length;o++){var i=e[o];i.setNodeColumn(),t[i.column]||(t[i.column]=r.compose([],this)),t[i.column].push(i)}for(var n=0;n<t.length;n++)void 0===t[n]&&(t[n]=r.compose([],this));return t},e.prototype.order=function(t,o){if(void 0===t.level){t.level=o;for(var e=0,i=t.linksFrom;e<i.length;e++){var n=i[e];n.toNode&&this.order(n.toNode,o+1)}}},e.prototype.generatePoints=function(){if(o.generatePoints.apply(this,arguments),this.orderNodes){for(var t=0,e=this.nodes;t<e.length;t++){var i=e[t];0===i.linksTo.length&&this.order(i,0)}b(this.nodes,function(t,o){return t.level-o.level})}},e.prototype.getNodePadding=function(){var t=this.options.nodePadding||0;if(this.nodeColumns){var o=this.nodeColumns.reduce(function(t,o){return Math.max(t,o.length)},0);o*t>this.chart.plotSizeY&&(t=this.chart.plotSizeY/o)}return t},e.prototype.hasData=function(){return!!this.processedXData.length},e.prototype.pointAttribs=function(t,o){if(!t)return{};var e=this,i=t.isNode?t.level:t.fromNode.level,n=e.mapOptionsToLevel[i||0]||{},r=t.options,a=n.states&&n.states[o||""]||{},l=["colorByPoint","borderColor","borderWidth","linkOpacity","opacity"].reduce(function(t,o){return t[o]=C(a[o],r[o],n[o],e.options[o]),t},{}),p=C(a.color,r.color,l.colorByPoint?t.color:n.color);return t.isNode?{fill:p,stroke:l.borderColor,"stroke-width":l.borderWidth,opacity:l.opacity}:{fill:s.parse(p).setOpacity(l.linkOpacity).get()}},e.prototype.drawTracker=function(){c.prototype.drawTracker.call(this,this.points),c.prototype.drawTracker.call(this,this.nodes)},e.prototype.drawPoints=function(){c.prototype.drawPoints.call(this,this.points),c.prototype.drawPoints.call(this,this.nodes)},e.prototype.drawDataLabels=function(){c.prototype.drawDataLabels.call(this,this.points),c.prototype.drawDataLabels.call(this,this.nodes)},e.prototype.translate=function(){this.processedXData||this.processData(),this.generatePoints(),this.nodeColumns=this.createNodeColumns(),this.nodeWidth=S(this.options.nodeWidth,this.chart.plotSizeX);var t=this,o=this.chart,e=this.options,i=this.nodeWidth,n=this.nodeColumns;this.nodePadding=this.getNodePadding(),this.translationFactor=n.reduce(function(o,e){return Math.min(o,e.sankeyColumn.getTranslationFactor(t))},1/0),this.colDistance=(o.plotSizeX-i-e.borderWidth)/Math.max(1,n.length-1),t.mapOptionsToLevel=m({from:1,levels:e.levels,to:n.length-1,defaults:{borderColor:e.borderColor,borderRadius:e.borderRadius,borderWidth:e.borderWidth,color:t.color,colorByPoint:e.colorByPoint,levelIsConstant:!0,linkColor:e.linkColor,linkLineWidth:e.linkLineWidth,linkOpacity:e.linkOpacity,states:e.states}});for(var r=0;r<n.length;r++)for(var s=n[r],a=0;a<s.length;a++){var l=s[a];t.translateNode(l,s)}for(var p=0,d=this.nodes;p<d.length;p++)for(var l=d[p],h=0,c=l.linksFrom;h<c.length;h++){var u=c[h];(u.weight||u.isNull)&&u.to&&(t.translateLink(u),u.allowShadow=!1)}},e.prototype.translateLink=function(t){var o=function(o,e){var i=o.offset(t,e)*s;return Math.min(o.nodeY+i,o.nodeY+(o.shapeArgs&&o.shapeArgs.height||0)-u)},e=t.fromNode,i=t.toNode,n=this.chart,r=n.inverted,s=this.translationFactor,a=this.options,l=C(t.linkColorMode,a.linkColorMode),p=(n.inverted?-this.colDistance:this.colDistance)*a.curveFactor,d=e.nodeX,h=i.nodeX,c=t.outgoing,u=Math.max(t.weight*s,this.options.minLinkWidth),m=o(e,"linksFrom"),y=o(i,"linksTo"),v=this.nodeWidth,g=h>d+v;if(n.inverted&&(m=n.plotSizeY-m,y=(n.plotSizeY||0)-y,v=-v,u=-u,g=d>h),t.shapeType="path",t.linkBase=[m,m+u,y,y+u],g&&"number"==typeof y)t.shapeArgs={d:[["M",d+v,m],["C",d+v+p,m,h-p,y,h,y],["L",h+(c?v:0),y+u/2],["L",h,y+u],["C",h-p,y+u,d+v+p,m+u,d+v,m+u],["Z"]]};else if("number"==typeof y){var k=n.plotHeight-m-u,S=h-20-u,b=h-20,N=d+v,x=N+20,w=x+u,L=m,P=m+u,T=P+20,O=T+k,j=O+20,M=j+u,F=y,W=F+u,_=W+20,z=P-.7*u,D=j+.7*u,I=W-.7*u,Y=h-.7*u,A=N+.7*u;t.shapeArgs={d:[["M",N,L],["C",A,L,w,z,w,T],["L",w,O],["C",w,D,A,M,N,M],["L",h,M],["C",Y,M,S,D,S,O],["L",S,_],["C",S,I,Y,F,h,F],["L",h,W],["C",b,W,b,W,b,_],["L",b,O],["C",b,j,b,j,h,j],["L",N,j],["C",x,j,x,j,x,O],["L",x,T],["C",x,P,x,P,N,P],["Z"]]}}if(t.dlBox={x:d+(h-d+v)/2,y:m+(y-m)/2,height:u,width:0},t.tooltipPos=n.inverted?[n.plotSizeY-t.dlBox.y-u/2,n.plotSizeX-t.dlBox.x]:[t.dlBox.x,t.dlBox.y+u/2],t.y=t.plotY=1,t.x=t.plotX=1,!t.options.color){if("from"===l)t.color=e.color;else if("to"===l)t.color=i.color;else if("gradient"===l){var E=f(e.color).get(),X=f(i.color).get();t.color={linearGradient:{x1:1,x2:0,y1:0,y2:0},stops:[[0,r?E:X],[1,r?X:E]]}}}},e.prototype.translateNode=function(t,o){var i=this.translationFactor,n=this.chart,r=this.options,s=r.borderRadius,a=r.borderWidth,l=void 0===a?0:a,p=t.getSum(),d=Math.max(Math.round(p*i),this.options.minLinkWidth),h=Math.round(this.nodeWidth),c=Math.round(l)%2/2,u=o.sankeyColumn.offset(t,i),f=Math.floor(C(u.absoluteTop,o.sankeyColumn.top(i)+u.relativeTop))+c,m=Math.floor(this.colDistance*t.column+l/2)+S(t.options[n.inverted?"offsetVertical":"offsetHorizontal"]||0,h)+c,v=n.inverted?n.plotSizeX-m:m;if(t.sum=p,p){t.shapeType="roundedRect",t.nodeX=v,t.nodeY=f;var g=v,k=f,b=t.options.width||r.width||h,N=t.options.height||r.height||d,x=y(S("object"==typeof s?s.radius:s||0,b),0,d/2);n.inverted&&(g=v-h,k=n.plotSizeY-f-d,b=t.options.height||r.height||h,N=t.options.width||r.width||d),t.dlOptions=e.getDLOptions({level:this.mapOptionsToLevel[t.level],optionsPoint:t.options}),t.plotX=1,t.plotY=1,t.tooltipPos=n.inverted?[n.plotSizeY-k-N/2,n.plotSizeX-g-b/2]:[g+b/2,k+N/2],t.shapeArgs={x:g,y:k,width:b,height:N,r:x,display:t.hasShape()?"":"none"}}else t.dlOptions={enabled:!1}},e.defaultOptions=k(c.defaultOptions,i),e}(c);return o.compose(e,N),v(N.prototype,{animate:u.prototype.animate,createNode:o.createNode,forceDL:!0,invertible:!0,isCartesian:!1,orderNodes:!0,noSharedTooltip:!0,pointArrayMap:["from","to","weight"],pointClass:e,searchPoint:t.noop}),n.registerSeriesType("sankey",N),N}),e(o,"masters/modules/sankey.src.js",[],function(){})});