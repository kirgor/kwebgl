import {mat4, vec3} from 'gl-matrix'

export class Matrix4Builder {
    private readonly matrix: mat4

    constructor() {
        this.matrix = mat4.create()
    }

    get() {
        return this.matrix
    }

    translate(v: vec3 | number[]): Matrix4Builder {
        mat4.translate(this.matrix, this.matrix, v)
        return this
    }

    scale(v: vec3 | number[]): Matrix4Builder {
        mat4.scale(this.matrix, this.matrix, v)
        return this
    }

    rotate(rad: number, axis: vec3 | number[]): Matrix4Builder {
        mat4.rotate(this.matrix, this.matrix, rad, axis)
        return this
    }

    rotateX(rad: number): Matrix4Builder {
        mat4.rotateX(this.matrix, this.matrix, rad)
        return this
    }

    rotateY(rad: number): Matrix4Builder {
        mat4.rotateY(this.matrix, this.matrix, rad)
        return this
    }

    rotateZ(rad: number): Matrix4Builder {
        mat4.rotateZ(this.matrix, this.matrix, rad)
        return this
    }
}

export function perspective(fovy: number, aspect: number, near: number, far: number): mat4 {
    const matrix = mat4.create()
    mat4.perspective(matrix, fovy, aspect, near, far)
    return matrix
}
