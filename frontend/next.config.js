/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    output: 'export',
    env:{
        API_URL: 'YOUR_BACKEND_API'
    },
    //trailingSlash: true 
}

module.exports = nextConfig
