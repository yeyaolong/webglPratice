let VSHADER_SOURCE = `
attribute vec4 a_Position;
void main()
{
    gl_Position = a_Position;
}
`;
// 片元着色器
let FSHADER_SOURCE = `
void main()
{
	gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
}
`;

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
    gl.drawArrays(gl.LINE_LOOP, 0, n);
}

function initVertexBuffers(gl) {
    let vertices = new Float32Array([
        0.0, 0.5,
        -0.5, -0.5,
        0.5, -0.5
    ]);

    let n = 3;  // 点得个数

    // 创建缓冲区对象
    let vertexBuffer = gl.createBuffer();

    if (!vertexBuffer) {
        console.log("Failed to create the buffer object");

        return -1;
    }

    // 将缓冲区对象(vertexBuffer)绑定到目标(gl.ARRAY_BUFFER)
    // 可以将 gl.ARRAY_BUFFER 理解为：
    // “数据的用法”
    // 比如 gl.ARRAY_BUFFER 是说，接下来，放入缓存的数据，将被当作 ARRAY_BUFFER 处理
    // 也即，缓冲区对象中包含了顶点的数据
    // 写成 gl.ELEMENT_ARRAY_BUFFER 则表示缓冲区对象中包含了顶点的索引值

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    // 向目标（gl.ARRAY_BUFFER）写入数据
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    let a_Position = gl.getAttribLocation(gl.program, 'a_Position');

    // 将目标（gl.ARRAY_BUFFER）内的数据分配给 a_Position 对象
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    // 连接 a_Position 变量与分配给它的缓冲区对象
    gl.enableVertexAttribArray(a_Position);

    return n;
}