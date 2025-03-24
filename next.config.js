/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
    experimental: {
        viewTransition: true,
    },
    images: {
        domains: [
            "empowerwomn.blr1.digitaloceanspaces.com",
            "avatars.githubusercontent.com"
        ],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "empowerwomn.blr1.digitaloceanspaces.com",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "avatars.githubusercontent.com",
                port: "",
                pathname: "/**",
            },
        ],
    },
};

export default config;
