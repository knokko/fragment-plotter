import { VERTEX_SOURCE, loadShader, createPositionBuffer } from './Helper';
import { onError } from './index';

export default class Plotter {

    constructor(canvas = document.createElement('canvas'), width = canvas.width, height = canvas.height){
        this.canvas = canvas;
        if (canvas.width !== width){
            canvas.width = width;
        }
        if (canvas.height !== height){
            canvas.height = height;
        }

        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        this.gl = gl;

        this.vertexShader = loadShader(gl, gl.VERTEX_SHADER, VERTEX_SOURCE);
        this.positionBuffer = createPositionBuffer(gl);
    }

    plot(red, green, blue, alpha = "1.0", preCalculations = "", preMain = "", floatPrecision = "medium") {

        const fragmentSource = `
precision ` + floatPrecision + `p float;
varying vec2 pos;
` + preMain + `
void main(){
    float x = 0.5 * pos.x + 0.5;
    float y = -0.5 * pos.y + 0.5;
    ` + preCalculations + `
    gl_FragColor = vec4(` + red + `, ` + green + `, ` + blue + `, ` + alpha + `);
}
`;
        const gl = this.gl;
        const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
        const shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, this.vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            onError('Failed to init shader program: ' + gl.getProgramInfoLog(shaderProgram));
            return;
        }

        const locationVertexPosition = gl.getAttribLocation(shaderProgram, 'position');
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(locationVertexPosition, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(locationVertexPosition);
        gl.useProgram(shaderProgram);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        // Currently, the program and fragment shader are only used once, so clean them up
        gl.deleteProgram(shaderProgram);
        gl.deleteShader(fragmentShader);
    }
}