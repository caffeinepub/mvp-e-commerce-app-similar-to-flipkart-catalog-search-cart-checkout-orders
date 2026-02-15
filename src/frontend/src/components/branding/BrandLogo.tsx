export default function BrandLogo() {
  return (
    <div className="flex items-center gap-2">
      <img
        src="/assets/generated/marketplace-logo.dim_512x512.png"
        alt="Buyflow"
        className="h-8 w-8 object-contain"
      />
      <span className="font-display font-bold text-xl text-foreground">Buyflow</span>
    </div>
  );
}
