export default function isServer() {
  return process.env.BUILD_FLAG_IS_SERVER === 'true';
}
