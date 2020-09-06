var crawlingGas = {
    size: 0,
    speed: 1,
    fill: "red",
    isCrawling: false
}

crawl = function () {
    ctx.fillStyle=crawlingGas.fill
    crawlingGas.size+=crawlingGas.speed
    ctx.fillRect(0,0,tile_w*maps[0][0].length,crawlingGas.size)
}