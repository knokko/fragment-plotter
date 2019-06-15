import SimplePlotter from './Simple';

export default class ReusablePlotter extends SimplePlotter {

    constructor(canvas, width, height){
        super(canvas, width, height);
        this.fragmentShader = null;
        this.shaderProgram = null;
    }

    deletePreviousProgram(){
        if (this.fragmentShader !== null){
            this.gl.deleteShader(this.fragmentShader);
            this.gl.deleteProgram(this.shaderProgram);
        }
    }

    beforePlot(){
        this.deletePreviousProgram();
    }

    afterPlot(shaderProgram, fragmentShader){
        this.shaderProgram = shaderProgram;
        this.fragmentShader = fragmentShader;
    }

    destroy(){
        super.destroy();
        this.deletePreviousProgram();
    }

    replot(){
        if (this.fragmentShader === null){
            throw 'replot can only be used after plot has been called at least once';
        }
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    }
}