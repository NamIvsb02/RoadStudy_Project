export const CONTAINER = "mx-auto w-full max-w-[1440px] px-4 lg:px-6";

const LINK_BASE =
  "inline-flex h-12 items-center justify-center gap-2 rounded-lg px-6 text-sm font-semibold transition-[background-color,color,border-color,transform] duration-150 ease-out-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light active:scale-[0.98]";

export const LINK_PRIMARY = `${LINK_BASE} bg-primary text-white hover:bg-primary-dark`;
export const LINK_SECONDARY = `${LINK_BASE} border border-line bg-white text-ink hover:border-line-strong hover:bg-primary-50`;
export const LINK_ON_DARK = `${LINK_BASE} bg-white text-primary-dark hover:bg-primary-50`;
