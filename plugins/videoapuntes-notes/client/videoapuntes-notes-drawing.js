(function() {
	var plugin = angular.module('videoApuntesNotesModule');
    plugin.directive('drawing', function(){
    return {
    restrict: "A",
    link: function(scope, element){
      var ctx = element[0].getContext('2d');
      
      // variable that decides if something should be drawn on mousemove
      var drawing = false;
      
      // the last coordinates before the current move
      var lastX;
      var lastY;
      element.bind('touchstart',function(event){
        console.log(event);
         var target = event.target || event.srcElement,
        style = target.currentStyle || window.getComputedStyle(target, null),
        borderLeftWidth = parseInt(style['borderLeftWidth'], 10),
        borderTopWidth = parseInt(style['borderTopWidth'], 10),
        rect = target.getBoundingClientRect(),
        offsetX = event.originalEvent.changedTouches[0].clientX - borderLeftWidth - rect.left,
        offsetY = event.originalEvent.changedTouches[0].clientY - borderTopWidth - rect.top;
        
        lastX = offsetX;
        lastY = offsetY;
        ctx.beginPath();
        drawing=true;
      });
       element.bind('touchmove',function(event){
        if(drawing){
          event.originalEvent.preventDefault();
          // get current mouse position
          var target = event.target || event.srcElement,
          style = target.currentStyle || window.getComputedStyle(target, null),
          borderLeftWidth = parseInt(style['borderLeftWidth'], 10),
          borderTopWidth = parseInt(style['borderTopWidth'], 10),
          rect = target.getBoundingClientRect(),
          offsetX = event.originalEvent.changedTouches[0].clientX - borderLeftWidth - rect.left,
          offsetY = event.originalEvent.changedTouches[0].clientY - borderTopWidth - rect.top;

          currentX = offsetX;
          currentY = offsetY;
          
          draw(lastX, lastY, currentX, currentY);
          
          // set current coordinates to last one
          lastX = currentX;
          lastY = currentY;
        }
      });
       element.bind('touchend',function(event){
        drawing = false;
        
      });
      element.bind('mousedown', function(event){
        lastX = event.offsetX;
        lastY = event.offsetY;
        
        // begins new line
        ctx.beginPath();
        
        drawing = true;
      });
      element.bind('mousemove', function(event){
        if(drawing){
          // get current mouse position
          currentX = event.offsetX;
          currentY = event.offsetY;
          
          draw(lastX, lastY, currentX, currentY);
          
          // set current coordinates to last one
          lastX = currentX;
          lastY = currentY;
        }
        
      });
      element.bind('mouseup', function(event){
        // stop drawing
        drawing = false;
      });
        
      // canvas reset
      function reset(){
       element[0].width = element[0].width; 
      }
      
      function draw(lX, lY, cX, cY){
        // line from
        ctx.moveTo(lX,lY);
        // to
        ctx.lineTo(cX,cY);
        // color
        ctx.strokeStyle = "#4bf";
        // draw it
        ctx.stroke();
      }
    }
    }
  }
)
})();