import ReusablePlotter from './Reusable';

export default class MousePlotter extends ReusablePlotter {

    constructor(canvas, width, height){
        super(canvas, width, height);
        this.locationMousePos = null;
        this.mouseX = 0.0;
        this.mouseY = 0.0;
        this.mouseMoveListener = event => {
            this.mouseX = event.x / this.canvas.width;
            this.mouseY = event.y / this.canvas.height;
            if (this.locationMousePos !== null){
                this.replot();
            }
        };
        this.canvas.addEventListener("mousemove", this.mouseMoveListener);
    }

    createFragmentSource(red, green, blue, alpha, preCalculations, preMain, floatPrecision){
        return `
precision ` + floatPrecision + `p float;
varying vec2 pos;
uniform vec2 mousePos;
` + preMain + `
void main(){
    float x = 0.5 * pos.x + 0.5;
    float y = -0.5 * pos.y + 0.5;
    float mouseX = mousePos.x;
    float mouseY = mousePos.y;
    ` + preCalculations + `
    gl_FragColor = vec4(` + red + `, ` + green + `, ` + blue + `, ` + alpha + `);
}
`;
    }

    beforePlot(){
        super.beforePlot();
        this.locationMousePos = null;
    }

    updateMousePos(){
        if (this.locationMousePos === null){
            throw 'The mouse position can not be updated before the plot has been drawn once';
        }
        this.gl.uniform2f(this.locationMousePos, this.mouseX, this.mouseY);
    }

    draw(gl, shaderProgram){
        this.locationMousePos = gl.getUniformLocation(shaderProgram, 'mousePos');
        this.updateMousePos();
        super.draw(gl, shaderProgram);
    }

    replot(){
        this.updateMousePos();
        super.replot();
    }

    destroy(){
        super.destroy();
        this.canvas.removeEventListener("mousemove", this.mouseMoveListener);
    }
}