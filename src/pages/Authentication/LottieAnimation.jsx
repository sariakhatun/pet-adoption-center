import React from "react";
import Lottie from "lottie-react";
import loginAnimation from '../../assets/Login (1).json'

const LottieAnimation = ({ loop = true, width = 300, height = 300 }) => {
  const style = { width: `${width}px`, height: `${height}px` };

  return <Lottie animationData={loginAnimation} loop={loop} style={style} />;
};

export default LottieAnimation;
