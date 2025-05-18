export default function Row({children, styles}) {
  return (
    <tr className={`border-b border-gray-200 last:border-b-0 first:border-y ${styles}`}>
      {children}
    </tr>
  );
}
