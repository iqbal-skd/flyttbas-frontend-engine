const knownEnvironments = ["development", "staging", "production"] as const;

type AppEnvironment = (typeof knownEnvironments)[number];

const rawEnvironment = import.meta.env.VITE_APP_ENV;

function resolveEnvironment(value: string | undefined): AppEnvironment {
  if (value && knownEnvironments.includes(value as AppEnvironment)) {
    return value as AppEnvironment;
  }

  return import.meta.env.DEV ? "development" : "production";
}

export const appEnvironment = resolveEnvironment(rawEnvironment);
export const isProduction = appEnvironment === "production";
export const isTrackingEnabled = isProduction;