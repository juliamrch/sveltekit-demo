<script>
    import { onMount } from 'svelte';
    import CreativeEngine from '@cesdk/engine';
  
    // to store the DOM container where the CreativeEngine canvas will be attached
    let canvasContainer;
    // to store the CreativeEngine instance
    let engine;
    // to store the ID of the image block added to the scene
    let imageBlockId = null;
  
    onMount(async () => {
      // your CE.SDK configurations
      const config = {
        license: '<YOUR_CE_SDK_LICENSE>', // replace this with your CE.SDK license
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
          uri: 'https://img.ly/static/ubq_samples/sample_1_1024x683.jpg',
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