let VSHADER_SOURCE = `
attribute vec4 a_Position;
attribute float a_PointSize;

void main()
{
    gl_Position = a_Position;
    // gl_PointSize = 10.0;
    gl_PointSize = a_PointSize;
}
`

// 片元着色器
let FSHADER_SOURCE = `
void main()
{
    gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
}
`

function main() {
    let canvas = document.getElementById("webgl");
    // 获取 WebGL 上下文
    let gl = getWebGLContext(canvas);

    if (!gl) {
        console.log("Failed to get the rendering context for WebGL");
        return;
    }

    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log("Failed to initialize shaders.");

        return;
    }

    // 获取 attribute 变量的存储地址
    let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    let a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
    if (a_Position < 0) {
        console.log("Failed to get the storage location of a_Position");

        return;
    }

    if (a_PointSize < 0) {
        console.log("Failed to get the storage location of a_PointSize");

        return;
    }

    // 将顶点位置传输给 attribute 变量（a_Position, x, y, z）
    // 实际上 a_Position 是齐次坐标系，也就是用的 vec4 变量 
    // 这里少传了一个 w 参数，那么这个w参数会被默认设置成 1
    // gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0);

    // 也可以直接传 4 个参数的，效果一样的
    // gl.vertexAttrib4f(a_Position, 0.0, 0.0, 0.0, 1);
    // 也可以使用数组,但是方法名要改成 ____fv
    const position = new Float32Array([0.0, 0.0, 0.0, 1])
    gl.vertexAttrib4fv(a_Position, position);

    const pointSize = new Float32Array([105.0]);
    gl.vertexAttrib1fv(a_PointSize, pointSize);

    // 指定清空 <canvas> 的颜色
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // 清空canvas
    gl.clear(gl.COLOR_BUFFER_BIT);

    // 绘制一个点
    gl.drawArrays(gl.POINTS, 0, 1);


}