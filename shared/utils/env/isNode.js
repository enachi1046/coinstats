export default function isNode() {
  return process.env.BUILD_FLAG_IS_NODE === 'true';
}
