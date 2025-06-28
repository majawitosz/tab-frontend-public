import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'tab.garbatamalpa.com',
				pathname: '/**',
			},
		],
	},
};

export default nextConfig;
