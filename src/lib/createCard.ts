import type CreativeEngine, { DesignBlockId } from '@cesdk/engine';

export type CreateCardResult = {
  heroFrameId: DesignBlockId;
  heroFrameFillId: DesignBlockId;
};

/**
 * Build a hero frame inside the provided parent block and optionally set its photo.
 */
export function createCard(
  engine: CreativeEngine,
  faceGroup: DesignBlockId,
  imageUrl?: string
): CreateCardResult {
  // One-time setup when building the template/scene
  const heroFrame = engine.block.create('graphic');
  const rect = engine.block.createShape('rect');
  engine.block.setShape(heroFrame, rect);

  // Give it a name for easy lookup in later steps / debugging
  engine.block.setString(heroFrame, 'name', 'hero-frame');

  // Attach an image fill now (can be a placeholder)
  const heroFrameImageFill = engine.block.createFill('image');
  engine.block.setFill(heroFrame, heroFrameImageFill);

  // Place it in the nametag layout once (e.g., inside a card group or page)
  engine.block.appendChild(faceGroup, heroFrame);

  // Make the container auto-resize to its parent so the photo always fits
  engine.block.fillParent(heroFrame);

  if (imageUrl) {
    replaceHeroPhotoURL(engine, heroFrame, imageUrl);
  }

  return { heroFrameId: heroFrame, heroFrameFillId: heroFrameImageFill };
}

export function replaceHeroPhotoURL(
  engine: CreativeEngine,
  hero: DesignBlockId,
  url: string
): DesignBlockId {
  try {
    // Try to get the current fill and swap the image on the same object
    const fill = engine.block.getFill(hero);
    engine.block.setString(fill, 'fill/image/imageFileURI', url);
    return fill;
  } catch (error) {
    // If no fill exists yet, create and attach one
    console.warn('No fill found on hero-frame; creating new fill.', error);
    const newFill = engine.block.createFill('image');
    engine.block.setString(newFill, 'fill/image/imageFileURI', url);
    engine.block.setFill(hero, newFill);
    return newFill;
  }
}
