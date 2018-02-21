var renderer = (function(){

    const gl = document.querySelector("#c").getContext("webgl");
    const arrays = {
        position: [-1, -1, 0,
                    1, -1, 0,
                   -1, 1, 0,
                   -1, 1, 0,
                    1, -1, 0,
                    1, 1, 0],
    };
    const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
    var programInfo;
    var cameraPos = [0,0,-5.0];

    function setCamera(i){
        cameraPos = i;
        render();
    }

    function loadScene(s){
        programInfo = twgl.createProgramInfo(gl, s);
        render();
    }

    function render(time) {
        twgl.resizeCanvasToDisplaySize(gl.canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        var mx = Math.max(gl.canvas.width, gl.canvas.height);

        const uniforms = {
            resolution: [gl.canvas.width, gl.canvas.height],
            screenRatio: [gl.canvas.width/mx, gl.canvas.height/mx],

            camPos: cameraPos,
            lookAt: [0.0,0.0,0.0],

            //_Centre:[0,0,0],
            //_Radius: 1,
        };
        gl.useProgram(programInfo.program);
        twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
        twgl.setUniforms(programInfo, uniforms);
        twgl.drawBufferInfo(gl, bufferInfo);
    }

    return {
        setCamera, setCamera,
        loadScene: loadScene,
        render: render
    };
})();

renderer.loadScene([
    shaders.vertex,
    `
        void main() {}
    `
]);
renderer.render();
