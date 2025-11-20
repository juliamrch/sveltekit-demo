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
    let pageBlockId = null;
    let videoFillId = null;

    function downloadBlob(blob, filename) {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  
    onMount(async () => {
      // your CE.SDK configurations
      const config = {
        license: '<YOUR_CSDK_LICENSE>', // replace this with your CE.SDK license
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

      // ensure we have a page to host the media
      const [page] = engine.block.findByType('page');
      const targetPage = page ?? engine.block.create('page');
      if (!page) {
        engine.block.appendChild(scene, targetPage);
      }
      pageBlockId = targetPage;
  
      // append a block to show a video on the page
      // 1. Créer le bloc graphique et sa forme
const bgBlock = engine.block.create('graphic');
const rectShape = engine.block.createShape('rect');
engine.block.setShape(bgBlock, rectShape);

// 2. Créer et configurer le fill (image ou vidéo)
const bgFill = engine.block.createFill('video'); // ou 'image'
videoFillId = bgFill;
engine.block.setString(
  bgFill,
  'fill/video/fileURI', // 'fill/image/imageFileURI' pour une image
  'https://cdn.img.ly/assets/demo/v2/ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4'
);
engine.block.setFill(bgBlock, bgFill);

// 3. Dimensionner pour couvrir la scène
engine.block.setWidthMode(bgBlock, 'Percent');
engine.block.setHeightMode(bgBlock, 'Percent');
engine.block.setWidth(bgBlock, 1);
engine.block.setHeight(bgBlock, 1);
engine.block.setPositionX(bgBlock, 0);
engine.block.setPositionY(bgBlock, 0);

// 4. Insérer derrière les autres éléments
engine.block.appendChild(page, bgBlock);
engine.block.sendToBack(bgBlock);
videoBlockId = bgBlock;

    });
  // Code tests for guides
  
  //async function flipGroup() {
    //const groupId = await engine.block.group([videoBlockId, videoBlockId2, videoBlockId3]);
    //engine.block.setFlipVertical(groupId, true);

  //};
  //engine.block.setScopeEnabled(videoBlockId, "layer/flip", false);
  async function flipVideo() {
    //if (!engine || videoBlockId === null) {
      //console.log('Engine or videoBlockId not ready yet');
      //return;
    //}
    
    engine.block.setFlipHorizontal(videoBlockId, true);
    engine.block.setFlipVertical(videoBlockId, true);

    //const flippedH = engine.block.getFlipHorizontal(videoBlockId);
    //const flippedV = engine.block.getFlipVertical(videoBlockId);
    //console.log(flippedH, flippedV);
    //try {
      //await fetch('/api/log-flip', {
        //method: 'POST',
        //headers: { 'Content-Type': 'application/json' },
        //body: JSON.stringify({ flippedH, flippedV })
      //});
    //} catch (error) {
      //console.error('Failed to report flip', error);
    //}
  };

  async function resetFlip() {
    const isFlipped = await engine.block.getFlipHorizontal(videoBlockId);
    engine.block.setFlipHorizontal(videoBlockId, !isFlipped);
  }

  async function resizeVideo() {
    // Set absolute size
    //engine.block.setWidth(videoBlockId, 1280.0);
    //engine.block.setHeight(videoBlockId, 720.0);
    
    // Percentage-based sizing relative to the parent (e.g., page)
    engine.block.setWidthMode(videoBlockId,  'Percent');
    engine.block.setHeightMode(videoBlockId, 'Percent');
    engine.block.setWidth(videoBlockId,  1);   // full-width
    engine.block.setHeight(videoBlockId, 0.5625);   // 16:9 ratio when width is 100 %
  }
  // callback to scale the video block
    //function scaleMedia() {
      //if (engine && videoBlockId != null) {
        // scale the video block by 150% on each click
        //engine.block.scale(videoBlockId, 1.5, 0.5, 0.5);

        // Let the Engine Handle Scaling
        //engine.block.setWidthMode(videoBlockId, 'Absolute');
        //const width = engine.block.getWidth(videoBlockId) * 1.5;
        //engine.block.setWidth(videoBlockId, width, true );
        //console.log(engine.block.findAllProperties(videoBlockId));

        // Combine Crop-Scale with a Size Change
        // => doesn't work as intented
        //await engine.block.setCropScaleX(videoBlockId, 1.5);
        //await engine.block.setWidthMode(videoBlockId, 'Absolute');
        //const newWidth = (await engine.block.getWidth(videoBlockId)) * 1.5;
        //await engine.block.setWidth(videoBlockId, newWidth);

        // Maintain Crop
        //engine.block.scale(videoBlockId, 1.5);
        //engine.block.setWidthMode(videoBlockId, 'Absolute');
        //const newWidth = engine.block.getWidth(videoBlockId) * 1.5;
        //engine.block.setWidth(videoBlockId, newWidth, true);

        // Rotate the clip by 90°
        //engine.block.setRotation(videoBlockId, Math.PI / 2);
        //engine.block.setScopeEnabled(videoBlockId, 'layer/rotate', false);
        
      //}
      
    //}
    
  async function generateThumbnail() {
    if (!engine) return;
    const [page] = engine.scene.getPages();
    if (!page) return;

    const fallbackVideoBlock =
      videoBlockId ??
      (() => {
        const children = engine.block.getChildren(page);
        return children.find((child) => engine.block.getType(child) === 'video') ?? null;
      })();
    const targetVideoFill =
      videoFillId ??
      (fallbackVideoBlock != null ? engine.block.getFill(fallbackVideoBlock) : null);
    if (!targetVideoFill) return;

    await engine.block.setPlaybackTime(targetVideoFill, 4.2);
    const exportResult = await engine.block.export(page, {
      mimeType: 'image/png',
      targetWidth: 640,
      targetHeight: 360,
    });

    const blob =
      exportResult instanceof Blob
        ? exportResult
        : new Blob([exportResult], { type: 'image/png' });

    downloadBlob(blob, 'scene-thumb.png');
  }

  async function exportCompressedVideo() {
    if (!engine || pageBlockId == null) return;
  const exportOptions = {
    mimeType: 'video/mp4',
    h264Profile: 77,
    h264Level: 52,
    videoBitrate: 2_000_000,
    audioBitrate: 128_000,
    framerate: 30,
    targetWidth: 1280,
    targetHeight: 720
  };

    const exportResult = await engine.block.exportVideo(pageBlockId, exportOptions);
    const maxSize = engine.editor.getMaxExportSize()
    const availableMemory = engine.editor.getAvailableMemory()
    console.log("Max export size:", maxSize, "Memory:", availableMemory)


    downloadBlob(exportResult, 'video-compressed.mp4');
  };
  
  </script>
  
  <div class="editor-container">
    <div class="canvas-container" bind:this="{canvasContainer}"></div>
    <div class="button-overlay">
      <button on:click="{flipVideo}">Flip</button>
      <button on:click="{resetFlip}">Reset Flip</button>
      <button on:click="{resizeVideo}">Resize</button>
      <button on:click="{generateThumbnail}">Generate Thumbnail</button>
      <button on:click="{exportCompressedVideo}">Compress + Export</button>
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
