import classNames from 'classnames';

export default function Cell({children, styles = ''}) {
  return <td className={classNames([`p-6 align-middle`, styles])}>{children}</td>;
}
