(function(){
  angular.module("slider", [])

  angular.module("slider").directive("slider", ($document, $timeout)->
    restrict: "E"
    scope:              
      model: "="
      property: "@"
      step: "@"
    replace: true
    template: """
  <div class="slider-control">
  <div class="slider">
  </div>
  </div>
    """
    link: (scope, element, attrs)->
      
      # It's the inner div we're really working with.
      element = element.children()
      element.css('position', 'relative')

      handles = []
      pTotal = 0
      
      step = ()->
        if(scope.step?)
          parseFloat(scope.step)
        else
          0

      getP = (i) -> if scope.property? then scope.model[i][scope.property] else scope.model[i]
      setP = (i, p) ->
        s = step()
        if s > 0
          p = Math.round(p/s) * s
        if scope.property?
          scope.model[i][scope.property] = p
        else
          scope.model[i] = p

          
      updatePositions = ()->
        pTotal = scope.model.reduce (sum, item, i)->
          sum+getP(i)
        , 0
        
        pRunningTotal = 0
        for handle,i in handles
          p = getP(i)
          pRunningTotal += p
          x = pRunningTotal/pTotal * 100 #element.prop("clientWidth")
          handle.css
            left: x + "%"
            top: "-" + handle.prop("clientHeight")/2 + "px"

      for mv,i in scope.model
        do (mv, i)->
          return if i == scope.model.length-1
          handle = angular.element('<div class="slider-handle"></div>')
          handle.css("position", "absolute")
          handles.push(handle)
          element.append(handle)
        
          startX = 0
          startPleft = startPright = 0
          handle.on "mousedown", (event) ->
            mousemove = (event) => scope.$apply ()->
              dp = (event.screenX - startX) / element.prop("clientWidth") * pTotal
              return if dp < -startPleft or dp > startPright
              setP(i, startPleft+dp)
              setP(i+1, startPright-dp)
              updatePositions()

            mouseup = ->
              $document.unbind "mousemove", mousemove
              $document.unbind "mouseup", mouseup

            # Prevent default dragging of selected content
            event.preventDefault()
            startX = event.screenX
            startPleft = getP(i)
            startPright = getP(i+1)
            $document.on "mousemove", mousemove
            $document.on "mouseup", mouseup
          
      scope.$watch "model", updatePositions, true
  )

  angular.module("slider").controller("Ctrl", ($scope)->
    $scope.probs = [
      p: .1
    ,
      p: .5
    ,
      p: .4
    ]
    
    $scope.otherProbs = [3, 3, 4]
  )

})();
  