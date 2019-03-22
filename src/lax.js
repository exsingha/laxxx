//
// lax v0.0.1 (Alex Fox)
// Simple & light weight vanilla javascript plugin to create beautiful animations things when you scrolllll!!
//
// Licensed under the terms of the MIT license.
//
// You may use it in your theme if you credit me. 
// It is also free to use on any individual website.
//
// Exception:
// The only restriction is to not publish any  
// extension for browsers or native application
// without getting a written permission first.
//

(function() {
  var lax = (function() {
    var lax = {
      elements: []
    }

    let lastY = 0;
    let currentBreakpoint = 'default'

    const transforms = {
      "data-lax-opacity": function(style, v) { style.opacity = v },
      "data-lax-translate": function(style, v) { style.transform += ` translate(${v}px, ${v}px)` },
      "data-lax-translate-x": function(style, v) { style.transform += ` translateX(${v}px)` },
      "data-lax-translate-y": function(style, v) { style.transform += ` translateY(${v}px)` },
      "data-lax-scale": function(style, v) { style.transform += ` scale(${v})` },
      "data-lax-scale-x": function(style, v) { style.transform += ` scaleX(${v})` },
      "data-lax-scale-y": function(style, v) { style.transform += ` scaleY(${v})` },
      "data-lax-skew": function(style, v) { style.transform += ` skew(${v}deg, ${v}deg)` },
      "data-lax-skew-x": function(style, v) { style.transform += ` skewX(${v}deg)` },
      "data-lax-skew-y": function(style, v) { style.transform += ` skewY(${v}deg)` },
      "data-lax-rotate": function(style, v) { style.transform += ` rotate(${v}deg)` },
      "data-lax-brightness": function(style, v) { style.filter += ` brightness(${v}%)` },
      "data-lax-contrast": function(style, v) { style.filter += ` contrast(${v}%)` },
      "data-lax-hue-rotate": function(style, v) { style.filter += ` hue-rotate(${v}deg)` },
      "data-lax-blur": function(style, v) { style.filter += ` blur(${v}px)` },
      "data-lax-invert": function(style, v) { style.filter += `  invert(${v}%)` },
      "data-lax-saturate": function(style, v) { style.filter += `  saturate(${v}%)` },
      "data-lax-grayscale": function(style, v) { style.filter += `  grayscale(${v}%)` },
      "data-lax-bg-pos": function(style, v) { style.backgroundPosition = `${v}px ${v}px` },
      "data-lax-bg-pos-x": function(style, v) { style.backgroundPositionX = `${v}px` },
      "data-lax-bg-pos-y": function(style, v) { style.backgroundPositionY = `${v}px` }
    }

    let crazy = ""

    for(var i=0;i<100;i++) {
      crazy += " " + (window.innerHeight*(i/100)) + " " + (Math.random() * 360) + ", "
    }

    lax.presets = {
      linger: (v) => {
        return { "data-lax-translate-y": `(vh*0.7) 0, 0 200, -500 0` }
      },
      lazy: (v=100) => {
        return { "data-lax-translate-y": `(vh) 0, (-elh) ${v}` }
      },
      eager: (v=100) => {
        return { "data-lax-translate-y": `(vh) 0, (-elh) -${v}` }
      },
      slalom: (v=50) => {
        return { "data-lax-translate-x": `vh ${v}, (vh*0.8) ${-v}, (vh*0.6) ${v}, (vh*0.4) ${-v}, (vh*0.2) ${v}, (vh*0) ${-v}, (-elh) ${v}` }
      },
      crazy: (v) => {
        return { "data-lax-hue-rotate": crazy }
      },
      spin: (v=360) => {
        return { "data-lax-rotate": `(vh) 0, (-elh) ${v}` }
      },
      spinRev: (v=360) => {
        return { "data-lax-rotate": `(vh) 0, (-elh) ${-v}` }
      },
      spinIn: (v=360) => {
        return { "data-lax-rotate": `vh ${v}, (vh*0.5) 0` }
      },
      spinOut: (v=360) => {
        return { "data-lax-rotate": `(vh*0.5) 0, -elh ${v}` }
      },
      blurInOut: (v=40) => {
        return { "data-lax-blur": `(vh) ${v}, (vh*0.8) 0, (vh*0.2) 0, 0 ${v}` }
      },
      blurIn: (v=40) => {
        return { "data-lax-blur": `(vh) ${v}, (vh*0.7) 0` }
      },
      blurOut: (v=40) => {
        return { "data-lax-blur": `(vh*0.3) 0, 0 ${v}` }
      },
      fadeInOut: () => {
        return { "data-lax-opacity": "(vh) 0, (vh*0.8) 1, (vh*0.2) 1, 0 0" }
      },
      fadeIn: () => {
        return { "data-lax-opacity": "(vh) 0, (vh*0.7) 1" }
      },
      fadeOut: () => {
        return { "data-lax-opacity": "(vh*0.3) 1, 0 0" }
      },
      driftLeft: (v=100) => {
        return { "data-lax-translate-x": `vh ${v}, -elh ${-v}` }
      },
      driftRight: (v=100) => {
        return { "data-lax-translate-x": `vh ${-v}, -elh ${v}` }
      },
      leftToRight: (v=1) => {
        return { "data-lax-translate-x": `vh 0, -elh (vw*${v})` }
      },
      rightToLeft: (v=1) => {
        return { "data-lax-translate-x": `vh 0, -elh (vw*${-v})` }
      },
      zoomInOut: (v=0.2) => {
        return { "data-lax-scale": `(vh) ${v}, (vh*0.8) 1, (vh*0.2) 1, -elh ${v}` }
      },
      zoomIn: (v=0.2) => {
        return { "data-lax-scale": `(vh) ${v}, (vh*0.7) 1` }
      },
      zoomOut: (v=0.2) => {
        return { "data-lax-scale": `(vh*0.3) 1, -elh ${v}` }
      },
      speedy: (v=30) => {
        return { "data-lax-skew-x": `(vh) ${v}, -elh ${-v}` }
      },
      swing: (v=30) => {
        return { "data-lax-skew-y": `(vh) ${v}, -elh ${-v}` }
      }
    }

    lax.addPreset = (p, o) => {
      lax.presets[p] = o
    }

    function intrp(t, v) {
      var i = 0

      while(t[i][0] <= v && t[i+1] !== undefined) {
        i+=1
      }

      var x = t[i][0]
      var prevX = t[i-1] === undefined ? x : t[i-1][0]

      var y = t[i][1]
      var prevY = t[i-1] === undefined ? y : t[i-1][1]

      var xPoint = Math.min(Math.max((v-prevX)/(x-prevX),0),1)
      var yPoint = (xPoint*(y-prevY)) + prevY

      return yPoint
    }

    lax.setup = function(o={}) {
      lax.breakpoints = o.breakpoints || {}
      lax.populateElements()
    }

    lax.removeElement = function(el) {
      const i = this.elements.findIndex(o => o.el = el)
      if(i > -1) {
        this.elements.splice(i, 1)
      }
    }

    lax.addElement = function(el) {
      var o = {
        el: el,
        // originalTransforms: {},
        transforms: {}
      }

      // el.style.transform.split(" ").forEach((s) => {
      //   const bits = s.split(/[()]/)
      //   o.originalTransforms[bits[0]] = parseFloat(bits[1])
      // })

      // find presets
      for(var i=0; i<el.attributes.length; i++) {
        var a = el.attributes[i]
        if(a.name.indexOf("data-lax") < 0) continue
        var b = a.name.split(":")
        const breakpoint = b[1] ? `:${b[1]}` : '' 

        if(b[0] == 'data-lax-preset') {
          a.value.split(" ").forEach((p) => {
            const bits = p.split("-")
            const fn = lax.presets[bits[0]]
            if(!fn) {
              console.log(`lax error: preset ${bits[0]} is not defined`)
            } else {
              const d = fn(bits[1])
              for(var k in d) {
                el.setAttribute(`${k}${breakpoint}`, d[k])
              }
            }
          })

          el.setAttribute("data-lax-anchor", "self")
          el.attributes.removeNamedItem(a.name)
        }
      }

      const useGpu = !(el.attributes["data-lax-use-gpu"] && el.attributes["data-lax-use-gpu"].value === 'false')
      if(useGpu) el.style["-webkit-backface-visibility"] = "hidden"
      if(el.attributes["data-lax-use-gpu"]) el.attributes.removeNamedItem("data-lax-use-gpu")

      o.optimise = false 
      if(el.attributes["data-lax-optimize"] && el.attributes["data-lax-optimize"].value === 'true') {
        o.optimise = true
        const bounds = el.getBoundingClientRect()
        el.setAttribute("data-lax-opacity", `${-bounds.height-1} 0, ${-bounds.height} 1, ${window.innerHeight} 1, ${window.innerHeight+1} 0`)
        el.attributes.removeNamedItem("data-lax-optimize")
      }

      for(var i=0; i<el.attributes.length; i++) {
        var a = el.attributes[i]
        if(a.name.indexOf("data-lax") < 0) continue

        var b = a.name.split(":")
        var bits = b[0].split("-")
        var breakpoint = b[1] || "default"
        if(bits[1] === "lax") {
          if(a.name === "data-lax-anchor") {
            o["data-lax-anchor"] = a.value === "self" ? el : document.querySelector(a.value)
            const rect = o["data-lax-anchor"].getBoundingClientRect()
            o["data-lax-anchor-top"] = Math.floor(rect.top) + window.scrollY
          } else {
            var name = b[0]
            var value = a.value
              .replace(new RegExp('vw', 'g'), window.innerWidth)
              .replace(new RegExp('vh', 'g'), window.innerHeight)
              .replace(new RegExp('elh', 'g'), el.clientHeight)
              .replace(new RegExp('elw', 'g'), el.clientWidth)
              .replace(new RegExp('-vw', 'g'), -window.innerWidth)
              .replace(new RegExp('-vh', 'g'), -window.innerHeight)
              .replace(new RegExp('-elh', 'g'), -el.clientHeight)
              .replace(new RegExp('-elw', 'g'), -el.clientWidth).replace(/\s+/g," ")
              .split(",").map((x) => { 
                return x.trim().split(" ").map(y => {
                  if(y[0] === "(") return eval(y)
                  else return parseFloat(y)
                })
              }).sort((a,b) => {
                return a[0] - b[0]  
              })

            if(!o.transforms[name]) {
              o.transforms[name] = {}
            }
            
            o.transforms[name][breakpoint] = value 
          }
        }
      }

      lax.elements.push(o)
      lax.updateElement(o)
    }

    lax.populateElements = function() {
      lax.elements = []

      var selector = ".lax"
 
      document.querySelectorAll(selector).forEach(this.addElement)
      currentBreakpoint = lax.getCurrentBreakPoint()
    }

    lax.getCurrentBreakPoint = function() {
      let b = 'default'
      const w = window.innerWidth

      for(var i in lax.breakpoints) {
        let px = lax.breakpoints[i]
        if(px > w) {
          break
        } else {
          b = i
        }
      }

      return b
    }

    lax.updateElement = function(o) {
      const y = lastY
      var r = o["data-lax-anchor-top"] ? o["data-lax-anchor-top"]-y : y

      var style = {
        transform: "",
        filter: ""
      }

      for(var i in o.transforms) {
        var arr = o.transforms[i][currentBreakpoint] || o.transforms[i]["default"]

        if(!arr) {
          // console.log(`lax error: there is no setting for key ${i} and screen size ${currentBreakpoint}. Try adding a default value!`)
          continue
        }

        var t = transforms[i]
        var v = intrp(arr, r)

        if(!t) {
          // console.info(`lax: error ${i} is not supported`)
          continue
        }

        t(style, v)
      }

      for(let k in style) {
        if(style.opacity === 0) { // if opacity 0 don't update
          o.el.style.opacity = 0 
        } else {
          o.el.style[k] = style[k]
        }
      }
    }

    lax.update = function(y) {
      if(lastY === y) return
      lastY = y
      lax.elements.forEach(lax.updateElement)
    }

    return lax;
  })();

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = lax;
  else
    window.lax = lax;
})();
