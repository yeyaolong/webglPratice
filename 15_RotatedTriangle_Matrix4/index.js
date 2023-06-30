let VSHADER_SOURCE = `
attribute vec4 a_Position;
uniform mat4 u_xformMatrix; // 旋转矩阵
uniform mat4 u_xformMatrix_translate; // 平移矩阵
void main()
{
    
    // 先平移 再旋转
    gl_Position = u_xformMatrix * u_xformMatrix_translate * a_Position;
    // 先旋转再平移
    // gl_Position = u_xformMatrix_translate * u_xformMatrix * a_Position;
}
`;
// 片元着色器
let FSHADER_SOURCE = `
void main()
{
	gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
`;

let ANGLE = 90.0;
function main() {
    let canvas = document.getElementById("webgl");
    // 获取 WebGL 上下文
    let gl = getWebGLContext(canvas);

    if (!gl) {
        console.log("Failed to get the rendering context for WebGL");

        return;
    }

    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log("Failed to initialize shaders");

        return;
    }

    // 设置顶点位置
    let n = initVertexBuffers(gl);

    if (n < 0) {
        console.log("Failed to set the positions of the vertices");

        return 0;
    }

    // 为旋转矩阵创建 Matrix4 对象
    let xformMatrix = new Matrix4();
    // 将 xformMatrix 设置为旋转矩阵
    xformMatrix.setRotate(ANGLE, 0, 0, 1);


    // 将旋转矩阵传输给顶点着色器
    let u_xformMatrix = gl.getUniformLocation(gl.program, 'u_xformMatrix');

    gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix.elements);

    // 将 xformMatrix 设置为平移矩阵
    let xformMatrix_translate = new Matrix4();
    xformMatrix_translate.setTranslate(0.5, 0.5, 0.5);
    // 将旋转矩阵传输给顶点着色器
    let u_xformMatrix_translate = gl.getUniformLocation(gl.program, 'u_xformMatrix_translate');
    gl.uniformMatrix4fv(u_xformMatrix_translate, false, xformMatrix_translate.elements);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    gl.clear(gl.COLOR_BUFFER_BIT);
    // 绘制三角形
    // gl.drawArrays(gl.TRIANGLES, 0, n);
    // 线（但是两个点就能构成线，所以第三个被忽略了）
    // gl.drawArrays(gl.LINES, 0, n);
    // 循环线 三个点依次连成线
    gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffers(gl) {
    var vertices = new Float32Array([
        0, 0.5, -0.5, -0.5, 0.5, -0.5
    ]);
    var n = 3; // The number of vertices

    // Create a buffer object
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return false;
    }

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -1;
    }
    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    return n;
}

