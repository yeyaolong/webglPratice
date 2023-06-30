let VSHADER_SOURCE = `
attribute vec4 a_Position;
uniform mat4 u_ModelMatrix;

void main()
{
    
    gl_Position = u_ModelMatrix * a_Position;
}
`;
// 片元着色器
let FSHADER_SOURCE = `
void main()
{
	gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
`;
// 旋转角度
let ANGLE_STEP = 45.0;
// 当前旋转角度
let currentAngle = 0.0;
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

    let u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix')
    // 为矩阵创建 Matrix4 对象
    let modelMatrix = new Matrix4();



    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    gl.clear(gl.COLOR_BUFFER_BIT);
    // 绘制三角形
    // gl.drawArrays(gl.TRIANGLES, 0, n);
    // 线（但是两个点就能构成线，所以第三个被忽略了）
    // gl.drawArrays(gl.LINES, 0, n);
    // 循环线 三个点依次连成线
    // gl.drawArrays(gl.TRIANGLES, 0, n);
    function tick() {

        currentAngle = animate(currentAngle);   // 更新旋转角
        draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix)
        window.requestAnimationFrame(tick);
    }
    tick();
}

function initVertexBuffers(gl) {
    var vertices = new Float32Array([
        0, 0.3, -0.3, -0.3, 0.5, -0.3
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



function draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix) {
    // 设置旋转矩阵
    modelMatrix.setRotate(currentAngle, 0, 0, 1);
    modelMatrix.translate(0.35, 0, 0);
    // 将旋转矩阵传输给顶点着色器
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, n);
}

let g_last = Date.now();

function animate(angle) {
    // 计算上次调用经过多长时间
    let now = Date.now();

    let elapsed = now - g_last;
    g_last = now;

    // 根据距离上次调用的时间，更新当前旋转角度
    let newAngle = angle + (ANGLE_STEP * elapsed) / 1000;

    return newAngle %= 360;
} 