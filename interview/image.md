### png 和jpg有什么差别
1、格式不同
png是无损压缩，jpg是有损。
2、编辑形式不同
PNG格式可编辑。如图片中有字体等，可利用PS再做更改。JPG格式不可编辑。
3、解析度不同
对于两种格式的解析度，PNG高于JPG。
4、使用场合不同
PNG不适用任何场合，因为它的体积很大，不利用显示，完全用于编辑者作为以后更改图片时做的备份之用。JPG格式用于很多场合

webp 体积小，解码压力大，兼容性不太好，移动端来说，解码压力大意味着消耗更多的电量
base64 减少http请求,数据就是图片，缺点图片太大的话字符串太长

图片的懒加载和预加载

预加载：提前加载图片，当用户需要查看时可直接从本地缓存中渲染。
懒加载：懒加载的主要目的是作为服务器前端的优化，减少请求数或延迟请求数。

两种技术的本质：两者的行为是相反的，一个是提前加载，一个是迟缓甚至不加载。懒加载对服务器前端有一定的缓解压力作用，预加载则会增加服务器前端压力。