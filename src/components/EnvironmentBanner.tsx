import { appEnvironment, isProduction } from "@/lib/environment";

const environmentTheme: Record<Exclude<typeof appEnvironment, "production">, string> = {
  development: "bg-amber-500 text-slate-950",
  staging: "bg-sky-500 text-white",
};

export function EnvironmentBanner() {
  if (isProduction) {
    return null;
  }

  const label = appEnvironment.toUpperCase();

  return (
    <div className={`fixed inset-x-0 top-0 z-[120] px-4 py-2 text-center text-xs font-semibold tracking-[0.24em] shadow-md ${environmentTheme[appEnvironment]}`}>
      {label} ENVIRONMENT
    </div>
  );
}