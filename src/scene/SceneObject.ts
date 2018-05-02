import {createPositionBuffer, createIndexBuffer} from '../utils/buffer'
import {mat4} from 'gl-matrix'
import {Shader, VERTEX_POSITION_VECTOR} from '../utils/shader'

export default class SceneObject {
    private modelViewMatrix: mat4

    render(gl: WebGLRenderingContext, program: WebGLProgram, shader: Shader): void {
        const cache = this.getCacheObject()
        if (!cache._buffersInitialized) {
            cache._positionBuffer = createPositionBuffer(gl, this.getPositions())
            cache._indexBuffer = createIndexBuffer(gl, this.getIndices())
            cache._buffersInitialized = true
        }

        shader.setAttributeVertex3(VERTEX_POSITION_VECTOR, cache._positionBuffer)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cache._indexBuffer)
        gl.drawElements(gl.TRIANGLES, this.getVertexCount(), gl.UNSIGNED_SHORT, 0)
    }

    getModelViewMatrix(): mat4 {
        return this.modelViewMatrix
    }

    setModelViewMatrix(matrix: mat4) {
        this.modelViewMatrix = matrix
    }

    protected getCacheObject(): any {
        return this.cacheInPrototype() ? Object.getPrototypeOf(this) : this
    }

    protected cacheInPrototype(): boolean {
        return false
    }

    protected getPositions(): number[] {
        return []
    }

    protected getIndices(): number[] {
        return []
    }

    protected getVertexCount(): number {
        return 0
    }
}
