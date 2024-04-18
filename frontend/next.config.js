/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    output: 'export',
    env:{
        API_URL: 'localhost:80', // Your API URL
    },
    //trailingSlash: true 
}

module.exports = nextConfig