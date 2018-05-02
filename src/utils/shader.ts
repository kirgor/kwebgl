export const PROJECTION_MATRIX = 'uProjectionMatrix';
export const MODEL_VIEW_MATRIX = 'uModelViewMatrix';
export const VERTEX_POSITION_VECTOR = 'aVertexPositionVector';

export class Shader {
    protected readonly gl: WebGLRenderingContext;
    protected readonly program: WebGLProgram;

    constructor(gl: WebGLRenderingContext, program: WebGLProgram) {
        this.gl = gl;
        this.program = program;
    }

    use() {
        this.gl.useProgram(this.program);
    }

    setAttributeVertex3(key: string, positionBuffer: WebGLBuffer): void {
        const gl = this.gl;
        const attributeLocation = gl.getAttribLocation(this.program, key);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.vertexAttribPointer(attributeLocation, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(attributeLocation);
    }

    setUniformMatrix4fv(key: string, matrix: Float32Array): void {
        const uniformLocation = this.gl.getUniformLocation(this.program, key);
        this.gl.uniformMatrix4fv(uniformLocation, false, matrix);
    }
}

export function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    const compileStatus = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compileStatus) {
        gl.deleteShader(shader);
        throw new Error(`Shader compilation error ${compileStatus}`)
    }

    return shader!;
}

export function createVertexShader(gl: WebGLRenderingContext, source: string): WebGLShader {
    return createShader(gl, gl.VERTEX_SHADER, source)
}

export function createFragmentShader(gl: WebGLRenderingContext, source: string): WebGLShader {
    return createShader(gl, gl.FRAGMENT_SHADER, source)
}

export function createBasicVertexShader(gl: WebGLRenderingContext): WebGLShader {
    return createVertexShader(gl, `
        uniform mat4 ${PROJECTION_MATRIX};
        uniform mat4 ${MODEL_VIEW_MATRIX};
        attribute vec4 ${VERTEX_POSITION_VECTOR};
        void main(void) {
            gl_Position = ${PROJECTION_MATRIX} * ${MODEL_VIEW_MATRIX} * ${VERTEX_POSITION_VECTOR};
        }
    `);
}

export function createConstantColorFragmentShader(gl: WebGLRenderingContext, r: number, g: number, b: number, a: number): WebGLShader {
    return createFragmentShader(gl, `
        void main(void) {
            gl_FragColor = vec4(${r}, ${g}, ${b}, ${a});
        }
    `);
}

export function createProgram(gl: WebGLRenderingContext, shaders: WebGLShader[]): WebGLProgram {
    const program = gl.createProgram();
    for (let shader of shaders) {
        gl.attachShader(program, shader)
    }

    gl.linkProgram(program);
    const linkStatus = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linkStatus) {
        throw new Error(`Program linkage error ${linkStatus}`)
    }

    return program!;
}
