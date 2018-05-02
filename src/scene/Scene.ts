import SceneObject from './SceneObject'
import {PROJECTION_MATRIX, MODEL_VIEW_MATRIX, Shader} from '../utils/shader'
import {mat4} from 'gl-matrix'

export default class Scene {
    private readonly gl: WebGLRenderingContext
    private readonly program: WebGLProgram
    private readonly shader: Shader
    private backgroundColor: number[]
    private projectionMatrix: mat4
    private sceneObjects: SceneObject[]

    constructor(gl: WebGLRenderingContext, program: WebGLProgram) {
        this.gl = gl
        this.program = program
        this.shader = new Shader(gl, program)
        this.backgroundColor = [0, 0, 0, 1]
        this.sceneObjects = []
    }

    setBackgroundColor(r: number, g: number, b: number, a: number) {
        this.backgroundColor = [r, g, b, a]
    }

    setProjectionMatrix(matrix: mat4) {
        this.projectionMatrix = matrix
    }

    setSceneObjects(objects: SceneObject[]) {
        this.sceneObjects = objects
    }

    renderAnimated(prepare: FrameRequestCallback) {
        const repeatedCallback = now => {
            prepare(now)
            this.render()
            requestAnimationFrame(repeatedCallback)
        }
        requestAnimationFrame(repeatedCallback)
    }

    render() {
        const gl = this.gl
        const program = this.program
        const shader = this.shader

        gl.clearColor.apply(gl, this.backgroundColor)
        gl.clearDepth(1.0)
        gl.enable(gl.DEPTH_TEST)
        gl.depthFunc(gl.LEQUAL)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

        shader.use()
        shader.setUniformMatrix4fv(PROJECTION_MATRIX, this.projectionMatrix)
        for (let sceneObject of this.sceneObjects) {
            shader.setUniformMatrix4fv(MODEL_VIEW_MATRIX, sceneObject.getModelViewMatrix())
            sceneObject.render(gl, program, shader)
        }
    }
}
