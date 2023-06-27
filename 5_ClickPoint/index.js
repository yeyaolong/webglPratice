let VSHADER_SOURCE = `
attribute vec4 a_Position;

void main()
{
    gl_Position = a_Position;
    gl_PointSize = 10.0;
}
`

let FSHADER_SOURCE = `
void main()
{
    gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
}
`

function main() {
    let canvas = document.getElementById('webgl');

    let gl = getWebGLContext(canvas);

    if (!gl) {
        console.log("Failed to get the rendering context for WebGL");
        return;
    }

    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log("Failed to initialize shaders.")
        return;
    }

    // 获取 attribute 变量的存储地址
    let a_Position = gl.getAttribLocation(gl.program, 'a_Position');

    if (a_Position < 0) {
        console.log("Failed to get the storage location of a_Position");

        return;
    }

    // 注册鼠标点击事件响应函数
    canvas.onmousedown = function (ev) {
        click(ev, gl, canvas, a_Position);
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    gl.clear(gl.COLOR_BUFFER_BIT);


}
let g_points = [];
function click(ev, gl, canvas, a_Position) {
    let x = ev.clientX;
    let y = ev.clientY;

    let rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.height / 2) / (canvas.height / 2);
    y = (canvas.width / 2 - (y - rect.top)) / (canvas.width / 2);

    // 将坐标存储到 g_points 数组中
    g_points.push(x);
    g_points.push(y);

    // 清除 canvas
    gl.clear(gl.COLOR_BUFFER_BIT);

    const len = g_points.length;

    for (let i = 0; i < len; i += 2) {
        gl.vertexAttrib3f(a_Position, g_points[i], g_points[i + 1], 0.0);

        gl.drawArrays(gl.POINTS, 0, 1);
    }
}