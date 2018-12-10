export default function isClient() {
  return process.env.BUILD_FLAG_IS_CLIENT === 'true';
}
