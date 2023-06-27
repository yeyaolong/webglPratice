function main() {
    console.log('main')
    // 获取 <canvas> 元素
    let canvas = document.getElementById('example');
    if (!canvas) {
        console.log("Failed to retrieve the <canvas> element");
        return;
    }

    // 获取绘制二维图形得绘图上下文
    var ctx = canvas.getContext("2d");

    // 绘制蓝色矩形
    ctx.fillStyle = "rgba(0, 0, 255, 1.0)"; // 设置填充颜色为蓝色
    // ctx.fillRect(x, y, width, height);
    ctx.fillRect(120, 10, 150, 150); // 使用填充颜色填充矩形
}

