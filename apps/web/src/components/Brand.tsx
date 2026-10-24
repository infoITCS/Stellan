export function BrandMark({ size = 150 }: { size?: number }) {
  return (
    <img src="/stellan-logo.png" alt="Stellan Solutions logo" width={size} height="auto" style={{ objectFit: 'contain', objectPosition: 'center', display: 'block', maxHeight: size, height: 'auto' }} />
  );
}

export function BrandLockup() {
  return (
    <span className="brand-lockup">
      <BrandMark />
    </span>
  );
}
