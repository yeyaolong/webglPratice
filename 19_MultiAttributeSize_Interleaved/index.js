let VSHADER_SOURCE = `
attribute vec4 a_Position;
attribute float a_PointSize;

void main()
{
    
    gl_Position = a_Position;
    gl_PointSize = a_PointSize;
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

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    gl.clear(gl.COLOR_BUFFER_BIT);
    // 绘制三角形
    // gl.drawArrays(gl.TRIANGLES, 0, n);
    // 线（但是两个点就能构成线，所以第三个被忽略了）
    // gl.drawArrays(gl.LINES, 0, n);
    // 循环线 三个点依次连成线
    gl.drawArrays(gl.POINTS, 0, n);

}

function initVertexBuffers(gl) {
    var verticesSizes = new Float32Array([
        0.0, 0.5, 10.0,   // 点1 x坐标,y坐标, 点的大小
        -0.5, -0.5, 20.0,// 点2
        0.5, -0.5, 30.0 // 点3
    ]);
    var n = 3; // The number of vertices


    let vertexSizeBuffer = gl.createBuffer();

    if (!vertexSizeBuffer) {
        console.log('Failed to create the buffer object');
        return false;
    }

    // 将顶点坐标和尺寸写入缓冲区并开启
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexSizeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesSizes, gl.STATIC_DRAW);

    let FSIZE = verticesSizes.BYTES_PER_ELEMENT;

    // 获取 a_Positoin 的存储位置，分配缓冲区开启
    let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 3, 0);
    gl.enableVertexAttribArray(a_Position);

    // 获取 a_PointSize 的存储位置，分配缓冲区开启
    let a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
    gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, FSIZE * 3, FSIZE * 2);;
    gl.enableVertexAttribArray(a_PointSize);


    return n;
}