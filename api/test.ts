// api/test.ts (كود الاختبار النهائي)
export default function handler(req, res) {
  res.status(200).json({ status: 'ok', message: 'The API route is working correctly!' });
}
