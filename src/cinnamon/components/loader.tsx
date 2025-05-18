export default function Loader({color = '#fff'}) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      xmlnsXlink='http://www.w3.org/1999/xlink'
      viewBox='0 0 100 100'
      preserveAspectRatio='xMidYMid'
      className='h-6 mx-auto block group-hover:bg-mainBlue'
    >
      <g transform='translate(20 50)'>
        <circle cx='0' cy='0' r='10' fill={color}>
          <animateTransform
            attributeName='transform'
            type='scale'
            begin='-0.375s'
            calcMode='spline'
            keySplines='0.3 0 0.7 1;0.3 0 0.7 1'
            values='0;1;0'
            keyTimes='0;0.5;1'
            dur='1s'
            repeatCount='indefinite'
          ></animateTransform>
        </circle>
      </g>
      <g transform='translate(40 50)'>
        <circle cx='0' cy='0' r='10' fill={color}>
          <animateTransform
            attributeName='transform'
            type='scale'
            begin='-0.25s'
            calcMode='spline'
            keySplines='0.3 0 0.7 1;0.3 0 0.7 1'
            values='0;1;0'
            keyTimes='0;0.5;1'
            dur='1s'
            repeatCount='indefinite'
          ></animateTransform>
        </circle>
      </g>
      <g transform='translate(60 50)'>
        <circle cx='0' cy='0' r='10' fill={color}>
          <animateTransform
            attributeName='transform'
            type='scale'
            begin='-0.125s'
            calcMode='spline'
            keySplines='0.3 0 0.7 1;0.3 0 0.7 1'
            values='0;1;0'
            keyTimes='0;0.5;1'
            dur='1s'
            repeatCount='indefinite'
          ></animateTransform>
        </circle>
      </g>
      <g transform='translate(80 50)'>
        <circle cx='0' cy='0' r='10' fill={color}>
          <animateTransform
            attributeName='transform'
            type='scale'
            begin='0s'
            calcMode='spline'
            keySplines='0.3 0 0.7 1;0.3 0 0.7 1'
            values='0;1;0'
            keyTimes='0;0.5;1'
            dur='1s'
            repeatCount='indefinite'
          ></animateTransform>
        </circle>
      </g>
    </svg>
  );
}
