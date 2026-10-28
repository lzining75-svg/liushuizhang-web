// A zoomed viewport is not a keyboard-resized viewport. Never resize the app
// in response to pinch zoom; retain the user's accessibility zoom behavior.
export function keyboardViewport({ baselineHeight, layoutHeight, visualHeight, offsetTop = 0, scale = 1, editing = false, mobile = false, wasOpen = false }) {
  const height = Math.max(0, visualHeight);
  const unzoomed = Math.abs(scale - 1) < 0.05;
  // Keep the reduced frame until the keyboard has actually finished closing.
  const open = mobile && (editing || wasOpen) && unzoomed && baselineHeight - height > Math.max(110, baselineHeight * 0.15);
  return {
    open,
    height,
    top: open ? Math.max(0, offsetTop) : 0,
    bottom: open ? Math.max(0, layoutHeight - height - Math.max(0, offsetTop)) : 0,
  };
}
