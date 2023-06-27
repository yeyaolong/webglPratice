let VSHADER_SOURCE = `
attribute vec4 a_Position;
void main()
{
    gl_Position = a_Position;
    gl_PointSize = 10.0;
}
`;

let FSHADER_SOURCE = `
precision mediump float;    // 设定精度（最大最小值）
uniform vec4 u_FragColor;   // uniform 变量
void main()
{
    gl_FragColor = u_FragColor;
}
`;

function main() {
    let canvas = document.getElementById('webgl');

    let gl = getWebGLContext(canvas);

    if (!gl) {
        console.log("Failed to get the rendering context for WebGL");
    }

    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log("Failed to initialize shaders.");

        return;
    }
    // 获取 attribute 变量的存储地址
    let a_Position = gl.getAttribLocation(gl.program, 'a_Position');

    let u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    // attribute 变量娶不到返回 -1
    if (a_Position < 0) {
        console.log("Failed to get the storage location of a_Position");

        return;
    }
    // uniform 变量取不到则返回null
    if (u_FragColor) {
        console.log("Failed to get the storage location of u_FragColor");
        return;
    }
    // 注册点击事件响应函数

    canvas.onmousedown = function (ev) {
        click(ev, gl, canvas, a_Position, u_FragColor);
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    gl.clear(gl.COLOR_BUFFER_BIT);

}

let g_points = [];
function click(ev, gl, canvas, a_Position, u_FragColor) {
    let x = ev.clientX;
    let y = ev.clientY;

    let rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.height / 2) / (canvas.height / 2);
    y = (canvas.width / 2 - (y - rect.top)) / (canvas.width / 2);
    console.log(x, y)
    let tmp = {
        position: [x, y],

    }
    if (x >= 0 && y >= 0) {
        tmp.color = [1.0, 0.0, 0.0, 1.0]
    }
    if (x >= 0 && y < 0) {
        tmp.color = [0.0, 1.0, 0.0, 1.0]
    }

    if (x <= 0 && y >= 0) {
        tmp.color = [0.0, 0.0, 1.0, 1.0]
    }
    if (x <= 0 && y < 0) {
        tmp.color = [1.0, 1.0, 1.0, 1.0]
    }


    g_points.push(tmp);


    gl.clear(gl.COLOR_BUFFER_BIT);
    const len = g_points.length;
    for (let i = 0; i < len; i++) {
        console.log(g_points[i].position[0], g_points[i].position[1])
        gl.vertexAttrib3f(a_Position, g_points[i].position[0], g_points[i].position[1], 0.0);
        gl.uniform4f(u_FragColor, g_points[i].color[0], g_points[i].color[1], g_points[i].color[2], g_points[i].color[3]);

        gl.drawArrays(gl.POINTS, 0, 1);
    }
}