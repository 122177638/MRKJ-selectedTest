const drawProg = (function () {
  /**
	 * @param {String} cNode DOM节点
	 * @param {Object} options 数据配置
	 * options = {
	 * 	num 分数
	 * 	title 标题
	 * }
	 */
  function drawProgress (cNode, options) {
    this.init(cNode, options)
  }
  drawProgress.prototype = {
    init (cNode, options) {
      this.el = document.querySelector(cNode);
      this.options = options
      this.startDraw()
    },
    startDraw () {
      var ctx = this.el.getContext('2d');
      this.drawArcBg(ctx)
      this.drawArcProg(ctx)
      this.drawArcTxt(ctx)
    },
    drawArcBg (ctx) {
      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#cccccc';
      ctx.arc(50, 45, 30, 0, 2 * Math.PI)
      ctx.stroke();
    },
    drawArcProg (ctx) {
      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#F44C4C';
      ctx.arc(50, 45, 30, -(1 / 2 * Math.PI), -(1 / 2 * Math.PI) + (2 / 5 * this.options.num) * Math.PI, false)
      ctx.stroke();
    },
    drawArcTxt (ctx) {
      ctx.font = '12px Arial, Helvetica, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#999999';
      ctx.textBaseline = 'middle';
      ctx.fillText('平均', 50, 35);
      ctx.font = '18px Arial, Helvetica, sans-serif';
      ctx.fillStyle = '#F44C4C';
      ctx.fillText(this.options.num + '分', 50, 55)
      ctx.font = '15px Arial, Helvetica, sans-serif';
      ctx.fillStyle = '#000000';
      ctx.fillText(this.options.title, 50, 95)
    }
  }
  return drawProgress;
})()

export default{
  drawProg
}
