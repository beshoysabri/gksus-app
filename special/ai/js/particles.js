

(function(engine){"use strict";$.fn.particles=function(){var _this=this;var baseId="tsparticles";var init=function init(options,callback){_this.each(function(index,element){if(element.id===undefined){element.id=baseId+Math.floor(engine.getRandom()*1e3)}engine.tsParticles.load({id:element.id,options:options}).then(callback)})};var ajax=function ajax(jsonUrl,callback){_this.each(function(index,element){if(element.id===undefined){element.id=baseId+Math.floor(engine.getRandom()*1e3)}engine.tsParticles.load({id:element.id,url:jsonUrl}).then(callback)})};return{init:init,ajax:ajax}}})(window);

$(document).ready(async function () {
    await loadSlim(tsParticles);

    $("#tsparticles")
        .particles()
        .init(
            {
	            fullscreen: { enable: false },
				fpsLimit: { value: 30 },
				pauseOnBlur: true,
				backgroundMode: {enable: true,zIndex: 1000},
				interactivity: {
				   events: {onHover: {enable: true,mode: "repulse",},resize: true,},
				   modes: {push: {quantity: 10},repulse: {distance: 100,duration: 0.3,},},
				},
				particles: {
		           color: {value: "#9bceff",},
		           links: {enable: true,distance: 250,color: "#72b1f1",opacity: 0.6,width: 0.8,},
		           collisions: {enable: true,},
		           move: {directions: "none",enable: true,outModes: {default: "bounce",},random: false,speed: 0.5,straight: false},
		           number: {density: {enable: true,area: 400},value: 60,},
		           opacity: {value: { min: 0.2, max: 0.7 },},
		           shape: {type: "circle",},
		           size: {value: { min: 1, max: 8 },},
		       	},
	       		detectRetina: true,
            },
            function (container) {
            },
        );

});