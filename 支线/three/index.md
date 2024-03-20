// https://threejs.org/docs/index.html#manual/zh/introduction/Creating-a-scene

### three.js 学习
场景（Scene）：是物体、光源等元素的容器。
相机（Camera）：场景中的相机，可以通过操作相机的方式来改变观察者的位置和朝向，场景中只能添加一个，决定哪些物体将在屏幕上渲染。
渲染器（Renderer）：场景的渲染方式，如 WebGL/canvas2D/CSS3D。
物体（Mesh）：包括二维物体（点、线、面）、三维物体，模型等。
光源（Light）：场景中的光照，如果不添加光照场景将会是一片漆黑，包括全局光、平行光、点光源等。
材质（Material）：材质就像是物体的皮肤，决定物体外表的样子，例如物体的颜色，看起来是否光滑，是否有贴图等等。
加载器（Loader）：用于加载纹理、图片、模型、音频等资源。
控制器（Control）：可通过键盘、鼠标控制相机的移动

```html
<!-- 创建的立方体 -->
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>My first three.js app</title>
		<style>
			body { margin: 0; }
		</style>
	</head>
	<body>
		<script type="module">
			import * as THREE from 'https://unpkg.com/three/build/three.module.js';

      // renderer （渲染器）、 scene （场景）和 camera （相机）

			// Our Javascript will go here.
      const scene = new THREE.Scene();
      // PerspectiveCamera 透视摄像机 (视野角度（FOV）, 长宽比, 近截面, 远截面)
      const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
      // WebGLRenderer 渲染器
      const renderer = new THREE.WebGLRenderer();
      renderer.setSize( window.innerWidth, window.innerHeight );
      document.body.appendChild( renderer.domElement );
      // BoxGeometry 立方体
      const geometry = new THREE.BoxGeometry( 1, 1, 1 );
      // MeshBasicMaterial 材质
      const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
      // 网格 Mesh
      const cube = new THREE.Mesh( geometry, material );
      // 添加物体
      scene.add( cube );

      camera.position.z = 5;

      function animate() {
        requestAnimationFrame( animate );
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        renderer.render( scene, camera );
      }
      animate();
		</script>
	</body>
</html>
```