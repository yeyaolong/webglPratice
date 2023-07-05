const VSHADER_SOURCE = `
attribute vec4 a_Position;
attribute vec2 a_TexCoord;
varying vec2 v_TexCoord;

void main()
{
    gl_Position = a_Position;
    v_TexCoord = a_TexCoord;
}
`;

const FSHADER_SOURCE = `
precision mediump float;
uniform sampler2D u_Sampler;
varying vec2 v_TexCoord;
void main()
{
    gl_FragColor = texture2D(u_Sampler, v_TexCoord);
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

        return;
    }

    // 配置纹理
    if (!initTextures(gl, n)) {
        console.log("配置纹理异常");

        return;
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
}

function initVertexBuffers(gl) {

    let verticesTexCoords = new Float32Array([
        -0.5, 0.5, -0.3, 1.7,    // 顶点坐标x, 顶点坐标y, 纹理坐标x, 纹理坐标y
        -0.5, -0.5, -0.3, -0.2,
        0.5, 0.5, 1.7, 1.7,
        0.5, -0.5, 1.7, -0.2
    ]);

    let n = 4;  // 顶点数目

    // 创建缓冲区对象
    let vertextTexCoordBuffer = gl.createBuffer();

    if (!vertextTexCoordBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    // 将顶点坐标和纹理坐标写入缓冲区对象
    gl.bindBuffer(gl.ARRAY_BUFFER, vertextTexCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);

    const FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;


    let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
    gl.enableVertexAttribArray(a_Position); // Enable buffer allocation

    // 将纹理坐标分配给 a_TexCoord 并开启它
    let a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
    if (a_TexCoord < 0) {
        console.log("Failed to get the storage location of a_TexCoord");

        return -1;
    }
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
    gl.enableVertexAttribArray(a_TexCoord); // 开启 a_TexCoord

    return n;
}

function initTextures(gl, n) {
    let texture = gl.createTexture();   // 创建纹理对象
    if (!texture) {
        console.log("Failed to create the texture object");
    }
    // 获取 u_Sampler 的存储位置
    let u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');

    // 创建一个 image 对象
    let image = new Image();
    if (!image) {
        console.log("Failed to create the image object");

        return false;
    }


    // 注册图像加载事件的响应函数
    image.onload = function () {
        loadTexture(gl, n, texture, u_Sampler, image);
    };

    image.src = './resource/sky.jpg';

    return true;
}

function loadTexture(gl, n, texture, u_Sampler, image) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);  // 对纹理图像进行y轴反转
    // 开启 0 号纹理单元
    gl.activeTexture(gl.TEXTURE0);
    // 向 target 绑定纹理对象
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // 配置纹理参数
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    // 配置纹理图像
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    // 将 0 号纹理传递给着色器
    gl.uniform1i(u_Sampler, 0);

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // 绘制矩形
}