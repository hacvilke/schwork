/**
 * Pure viewport-clamping math for <FormulaHint /> popovers.
 *
 * Kept separate from React DOM code so positioning behaviour can be reviewed
 * quickly and verified with fast unit tests.
 */

export interface RectBox {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface SizeBox {
  width: number;
  height: number;
}

export interface TooltipPlacement {
  /** Horizontal pixel adjustment applied on top of centered alignment. */
  shiftX: number;
  /** True when the popover should flip below the formula to avoid the top navbar. */
  placeBelow: boolean;
}

/** Reserved space at the top of the viewport for the sticky navigation bar. */
export const NAVBAR_CLEARANCE_PX = 76;

/**
 * Compute horizontal shift and vertical direction so an inline formula tooltip
 * stays fully inside the viewport without getting clipped at the screen edges.
 */
export function computeTooltipPlacement(
  trigger: RectBox,
  tooltip: SizeBox,
  viewport: SizeBox,
  edgeMargin = 12,
): TooltipPlacement {
  const triggerCenterX = trigger.left + trigger.width / 2;
  const idealLeft = triggerCenterX - tooltip.width / 2;
  const maxLeft = Math.max(edgeMargin, viewport.width - tooltip.width - edgeMargin);
  const clampedLeft = Math.min(Math.max(idealLeft, edgeMargin), maxLeft);

  const shiftX = Math.round(clampedLeft - idealLeft);
  const placeBelow = trigger.top - tooltip.height - edgeMargin < NAVBAR_CLEARANCE_PX;

  return {shiftX, placeBelow};
}
