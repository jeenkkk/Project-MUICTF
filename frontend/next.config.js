/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    output: 'export',
    env:{
        API_URL: 'https://muictfbackend.azurewebsites.net'
    },
    //trailingSlash: true 
}

module.exports = nextConfig