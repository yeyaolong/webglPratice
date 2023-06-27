function main() {
	let canvas = document.getElementById("webgl");
	// 获取 WebGL 上下文
	let gl = getWebGLContext(canvas);

	if (!gl) {
		console.log("Failed to get the rendering context for WebGL");
		return;
	}
	// 指定清空<canvas>得颜色(r, g, b, a) 颜色分量在 0~1.0 之间
	gl.clearColor(0.0, 0.0, 1.0, 1.0);

	// 清空<canvas>
	gl.clear(gl.COLOR_BUFFER_BIT);

}