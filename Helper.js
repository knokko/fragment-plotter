import { onError } from './index';

const QUAD_POSITIONS = Float32Array.from([
    -1, 1,
    1, 1,
    -1, -1,
    1, -1
]);

const VERTEX_SOURCE = `
attribute vec2 position;

varying vec2 pos;

void main() {
    gl_Position = vec4(position.x,position.y,0.0,1.0);
    pos = position;
}
`;

export { QUAD_POSITIONS, VERTEX_SOURCE };

export function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        onError('Failed to compile shader: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

export function createPositionBuffer(gl) {
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, QUAD_POSITIONS, gl.STATIC_DRAW);
    return positionBuffer;
}