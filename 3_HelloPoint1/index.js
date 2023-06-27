// 顶点着色器
let VSHADER_SOURCE = `
void main()
{
	gl_Position = vec4(0, 0, 0.0, 1.0); // 设置坐标
	gl_PointSize = 10.0;	// 设置尺寸
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
		console.log("Failed to initialize shaders.");
		return;
	}

	// 指定清空<canvas>得颜色(r, g, b, a) 颜色分量在 0~1.0 之间
	gl.clearColor(0.0, 0.0, 0.0, 1.0);

	// 清空<canvas>
	gl.clear(gl.COLOR_BUFFER_BIT);

	// 绘制一个点
	gl.drawArrays(gl.POINTS, 0, 1);

}