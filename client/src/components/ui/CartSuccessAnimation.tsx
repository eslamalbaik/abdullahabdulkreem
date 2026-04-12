import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export function CartSuccessAnimation({ size = 60 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size }} className="flex-shrink-0">
      <DotLottieReact
        src="https://lottie.host/cfdf265d-988e-426f-b146-723228843411/OHNMyBVUt6.lottie"
        loop={false}
        autoplay
      />
    </div>
  );
}
