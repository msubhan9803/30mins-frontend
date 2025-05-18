import {TwitterIcon as Icon} from 'next-share';

export default function TwitterIcon({link = undefined}: {link?: string}) {
  return link ? (
    <a href={link.startsWith('http') ? link : `https://${link}`} target='_blank' rel='noreferrer'>
      <Icon size={24} round style={{}} />
    </a>
  ) : (
    <Icon size={24} round style={{}} />
  );
}
