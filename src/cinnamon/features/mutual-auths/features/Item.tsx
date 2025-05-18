export default function Item({onClick, user}) {
  return (
    <li onClick={onClick} className='flex flex-row items-center gap-2 border-b p-2 cursor-pointer'>
      <img alt='' className='w-8 h-8 rounded-full border shadow-sm' src={user.avatar || ''} />
      <span>{user.name}</span>
    </li>
  );
}
