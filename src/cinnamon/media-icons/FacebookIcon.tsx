import {FacebookIcon as Icon} from 'next-share';

export default function FacebookIcon({link = undefined}: {link?: string}) {
  return link ? (
    <a href={link.startsWith('http') ? link : `https://${link}`} target='_blank' rel='noreferrer'>
      <Icon size={24} round />
    </a>
  ) : (
    <Icon size={24} round />
  );
}
