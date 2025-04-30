const DoubleTick = ({ color = "white", size = 24 }) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 35 35"
        fill="none"
      >
        <path
          d="M0.5979 19.5563L8.74998 27.7083L10.8062 25.6375L2.66873 17.5M32.4333 8.13751L17.0042 23.5813L10.9375 17.5L8.85207 19.5563L17.0042 27.7083L34.5042 10.2083M26.25 10.2083L24.1937 8.13751L14.9333 17.3979L17.0042 19.4542L26.25 10.2083Z"
          fill={color}
        />
      </svg>
    );
  };
  
  export default DoubleTick;
  