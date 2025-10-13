<script>
    import { onMount } from 'svelte';
    import CreativeEngine from '@cesdk/engine';
  
    /** @type {HTMLDivElement | null} */
      // your CE.SDK configurations
    // to store the DOM container where the CreativeEngine canvas will be attached
    let canvasContainer = null;
    // to store the CreativeEngine instance
      /** @type {any} */
    let engine = null;
    // to store the ID of the image block added to the scene
    /** @type {number | null} */
    let imageBlockId = null;
  
    onMount(async () => {
      // your CE.SDK configurations
      const config = {
        license: '<YOUR_LICENSE_KEY>', // replace this with your CE.SDK license
      };
  
      // initialize CreativeEngine in headless mode
      engine = await CreativeEngine.init(config);
  
      // append CE.SDK canvas to the DOM (optional)
      if (canvasContainer && engine.element) {
        canvasContainer.appendChild(engine.element);
      }
  
      // get the current scene or create a new one
      let scene = engine.scene.get();
      if (!scene) {
        scene = engine.scene.create();
        const page = engine.block.create('page');
        engine.block.appendChild(scene, page);
      }
  
      // get the first page block
      const [page] = engine.block.findByType('page');
  
      // append a block to show an image on the page
      const imageBlock = engine.block.create('graphic');
      imageBlockId = imageBlock;
      engine.block.setShape(imageBlock, engine.block.createShape('rect'));
  
      // fill the block with an image from a public source
      const imageFill = engine.block.createFill('image');
      engine.block.setSourceSet(imageFill, 'fill/image/sourceSet', [
        {
          uri: 'https://cdn.img.ly/assets/demo/v2/ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4',
          width: 1024,
          height: 683,
        },
      ]);
      engine.block.setFill(imageBlock, imageFill);
      engine.block.appendChild(page, imageBlock);
  
      // zoom to fit the page in the editor view
      engine.scene.zoomToBlock(page);
    });
  
    // callback to change the opacity of the image
    function changeOpacity() {
      if (engine && imageBlockId != null) {
        // get the current opacity value of the image
        const currentOpacity = engine.block.getOpacity(imageBlockId);
        // reduce the opacity of the image by 20% at each click
        engine.block.setOpacity(imageBlockId, currentOpacity * 0.8);
      }
    }
  </script>
  
  <div class="editor-container">
    <div class="canvas-container" bind:this="{canvasContainer}"></div>
    <div class="button-overlay">
      <button on:click="{changeOpacity}">Reduce Opacity</button>
    </div>
  </div>

  <style>
    .editor-container {
      width: 100vw;
      height: 100vh;
      position: relative;
    }
  
    .canvas-container {
      width: 100%;
      height: 100%;
    }
  
    .button-overlay {
      position: absolute;
      top: 20px;
      left: 20px;
    }
  
    .button-overlay button {
      border-radius: 8px;
      border: 1px solid #ccc;
      padding: 0.6em 1.2em;
      font-size: 1em;
      font-weight: 500;
      font-family: inherit;
      background-color: #ffffff;
      color: #1a1a1a;
      cursor: pointer;
      transition:
        border-color 0.25s,
        box-shadow 0.25s;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    }
  
    .button-overlay button:hover {
      border-color: #646cff;
      box-shadow: 0 4px 10px rgba(100, 108, 255, 0.2);
    }
  
    .button-overlay button:focus,
    .button-overlay button:focus-visible {
      outline: 2px solid #646cff;
      outline-offset: 2px;
    }
  </style>