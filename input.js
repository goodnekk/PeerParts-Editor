document.addEventListener("mousedown", function(e){
    e.preventDefault();
    var mouseoffset = {
        x: e.clientX/window.innerWidth,
        y: e.clientY/window.innerHeight
    };
    var mousemove = function(e){
        if(!State.scrubbing){
        //console.log(mouse);
            var m = {
                x: e.clientX/window.innerWidth,
                y: e.clientY/window.innerHeight
            };

            var zoom = 5.0;
            var PI = 3.14;
            var TWO_PI = 6.28;


            renderer.setCamera([zoom * Math.cos(m.x*TWO_PI) * Math.sin(m.y*PI),
                         zoom * Math.cos(m.y*PI),
                         zoom * Math.sin(m.x*TWO_PI) * Math.sin(m.y*PI)]);
        }

    };

    var mouseup = function(e){
        document.removeEventListener("mousemove", mousemove);
        document.removeEventListener("mouseup", mouseup);
    };
    document.addEventListener("mousemove", mousemove);
    document.addEventListener("mouseup", mouseup);
}, true);
