<script>
  import { onDestroy } from 'svelte';
  import CreativeEngine from '@cesdk/engine';

  const config = {
    license: '<YOUR_LICENSE_KEY>',
    baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.58.0/assets'
  };

  let engine = null;
  let isExporting = false;

  async function getEngine() {
    if (!engine) {
      engine = await CreativeEngine.init(config);
    }
    return engine;
  }

  async function handleDownload() {
    if (isExporting) return;
    isExporting = true;

    try {
      const engine = await getEngine();

      const scene = engine.scene.create();
      const page = engine.block.create('page');
      engine.block.setWidth(page, 800);
      engine.block.setHeight(page, 600);
      engine.block.appendChild(scene, page);

      const imageBlock = engine.block.create('graphic');
      engine.block.setShape(imageBlock, engine.block.createShape('rect'));
      const imageFill = engine.block.createFill('image');
      engine.block.setString(
        imageFill,
        'fill/image/imageFileURI',
        'https://img.ly/static/ubq_samples/sample_1.jpg'
      );
      engine.block.setFill(imageBlock, imageFill);
      engine.block.setPosition(imageBlock, 100, 100);
      engine.block.setWidth(imageBlock, 300);
      engine.block.setHeight(imageBlock, 300);
      engine.block.appendChild(page, imageBlock);

      const textBlock = engine.block.create('text');
      engine.block.setString(textBlock, 'text/text', 'Hello from Headless Mode!');
      engine.block.setPosition(textBlock, 100, 450);
      engine.block.setWidth(textBlock, 600);
      engine.block.appendChild(page, textBlock);

      const exportResult = await engine.block.export(page, 'image/png');
      const blob =
        exportResult instanceof Blob
          ? exportResult
          : new Blob([exportResult], { type: 'image/png' });

      triggerDownload(blob, 'headless-output.png');
    } catch (error) {
      console.error('Failed to export headless scene', error);
    } finally {
      isExporting = false;
    }
  }

  function triggerDownload(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  onDestroy(() => {
    if (engine) {
      engine.dispose();
      engine = null;
    }
  });
</script>

<button id="download-headless" on:click={handleDownload} disabled={isExporting}>
  {isExporting ? 'Charging...' : 'Download an example'}
</button>
