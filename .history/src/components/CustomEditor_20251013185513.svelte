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
    // to store the ID of the video block added to the scene
    /** @type {number | null} */
    let videoBlockId = null;
  
    onMount(async () => {
      // your CE.SDK configurations
      const config = {
        license: '', // replace this with your CE.SDK license
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
  
      // append a block to show a video on the page
      const videoBlock = engine.block.create('graphic');
      videoBlockId = videoBlock;
      engine.block.setShape(videoBlock, engine.block.createShape('rect'));
      const videoFill = engine.block.createFill('video');
      engine.block.setString(
        videoFill,
        'fill/video/fileURI',
        'https://cdn.img.ly/assets/demo/v2/ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4'
      );
      engine.block.setFill(videoBlock, videoFill);
      engine.block.setSize(videoBlock, 800, 450);
      engine.block.appendChild(page, videoBlock);
  
      // zoom to fit the page in the editor view
      engine.scene.zoomToBlock(page);
    });
  
    // callback to scale the video block
    function scaleMedia() {
      if (engine && videoBlockId != null) {
        // scale the video block by 150% on each click
        engine.block.scale(videoBlockId, 1.5);
      }
    }
  </script>
  
  <div class="editor-container">
    <div class="canvas-container" bind:this="{canvasContainer}"></div>
    <div class="button-overlay">
      <button on:click="{scaleMedia}">Scale +150%</button>
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
