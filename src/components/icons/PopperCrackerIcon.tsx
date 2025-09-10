"use client"

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

function Confetti1() {
  return (
    <svg width="59" height="48" viewBox="0 0 59 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M8.74722 9.02884C6.59207 7.79669 5.84192 5.05197 7.07078 2.89495C8.30237 0.733163 11.0545 -0.0188996 13.2143 1.21614L13.7922 1.5466L14.7441 2.10601L15.6483 2.64672L16.5196 3.17787C22.6275 6.94004 26.9004 10.4302 29.6956 14.5281L29.906 14.8424L30.0015 14.99L30.2535 14.9484C39.3491 13.4823 46.6414 16.6786 51.6373 23.6526L51.8698 23.9823C54.6206 27.9441 56.9297 36.9877 58.1494 42.4991C58.6988 44.9818 57.003 47.3575 54.4888 47.7376C52.0579 48.1052 49.7757 46.4609 49.2717 44.0546C48.2806 39.3228 46.5073 32.0393 44.4771 29.1153C41.742 25.1761 38.2097 23.2512 33.2776 23.6303L32.8623 23.6674L32.8668 23.7631C32.9462 26.6232 32.2306 29.5618 30.658 32.5216L30.4652 32.8769L29.9661 33.761C23.786 44.5053 16.712 49.3467 9.74585 47.5847C3.64359 46.0412 -0.297988 39.3792 0.641508 33.4474C1.89852 25.5109 7.53812 20.7841 15.8394 18.1923C16.0316 18.1323 16.2382 18.0711 16.4567 18.0092L17.1451 17.8216C17.3848 17.7585 17.6338 17.6951 17.8897 17.6317L18.6755 17.4417L19.4874 17.2539L20.1796 17.0995L20.1602 17.0796C18.2583 15.1817 15.6087 13.2125 12.1966 11.0868L11.7995 10.8409L10.9903 10.3476L10.1445 9.84194L9.24856 9.31547L8.74722 9.02884ZM23.6818 25.6408L23.6953 25.5607L21.9715 25.9284L20.9656 26.1537L20.032 26.3749L19.467 26.5173L18.9601 26.654L18.5217 26.7833C13.14 28.4636 10.1456 30.9733 9.5307 34.8553C9.29142 36.3661 10.5579 38.5067 11.9528 38.8595C13.5519 39.264 15.9239 38.0355 18.7776 34.4007L19.1789 33.8778C19.2463 33.7881 19.3139 33.697 19.3818 33.6045L19.7922 33.0339C19.9988 32.7406 20.2076 32.4351 20.4185 32.1171L20.8431 31.4646C20.9143 31.3531 20.9857 31.2402 21.0574 31.1258L21.4899 30.4228L21.9275 29.6855C22.0009 29.5598 22.0745 29.4326 22.1482 29.3039L22.5932 28.5143C23.1362 27.5346 23.4997 26.5803 23.6818 25.6408Z" fill="white"/>
    </svg>
  )
}

function Confetti2() {
  return (
    <svg width="22" height="27" viewBox="0 0 22 27" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M11.5147 0.295745L0.250416 26.1941L21.2857 25.3944L11.5147 0.295745Z" fill="#5B72F2"/>
    </svg>
  )
}

function Confetti3() {
  return (
    <svg width="22" height="23" viewBox="0 0 22 23" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M21.1791 0.114993L0.529179 0.978293L12.375 22.4533L21.1791 0.114993Z" fill="#FFDAFE"/>
    </svg>
  )
}

function Confetti4() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="7.89209" cy="7.92391" r="7" transform="rotate(45 7.89209 7.92391)" fill="#E965E2"/>
    </svg>
  )
}

function Confetti5() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="7.96289" cy="7.89949" r="7" transform="rotate(45 7.96289 7.89949)" fill="#E965E2"/>
    </svg>
  )
}

function Cone() {
  return (
    <svg width="128" height="128" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M126.667 79.3474L13.4956 126.414C10.0535 127.846 6.08776 127.059 3.45175 124.423C0.815739 121.787 0.0295382 117.822 1.46094 114.38L48.5277 1.20798L126.667 79.3474Z" fill="url(#paint0_radial_2096_9815)" stroke="url(#paint1_linear_2096_9815)"/>
      <defs>
        <radialGradient id="paint0_radial_2096_9815" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(46.9267 14.4245) rotate(49.4017) scale(103.344 110.642)">
          <stop stopColor="#F065E2"/>
          <stop offset="1" stopColor="#3748FA"/>
        </radialGradient>
        <linearGradient id="paint1_linear_2096_9815" x1="-0.356492" y1="18.1548" x2="14.6828" y2="107.003" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" stopOpacity="0.29535"/>
          <stop offset="1" stopColor="white" stopOpacity="0.01"/>
        </linearGradient>
      </defs>
    </svg>
  )
}

function Ellipse() {
  return (
    <svg width="84" height="84" viewBox="0 0 84 84" fill="none" xmlns="http://www.w3.org/2000/svg">
      <foreignObject x="-12.8336" y="-12.8609" width="109.569" height="109.569">
        <div 
          style={{
            backdropFilter: "blur(6.8px)",
            clipPath: "url(#bgblur_0_2096_9816_clip_path)",
            height: "100%",
            width: "100%"
          }}
        ></div>
      </foreignObject>
      <path data-figma-bg-blur-radius="13.5914" d="M2.70605 2.67871C3.78374 1.60103 5.464 1.11195 7.73438 1.25488C10.0029 1.39776 12.7916 2.16967 15.9814 3.52832C21.9587 6.07425 29.2523 10.6377 37.0107 16.7598L38.5684 18.0049L39.8555 19.0576C41.1434 20.1219 42.4403 21.2268 43.7432 22.3691L45.0488 23.5244L46.3564 24.7041V24.7051C48.5386 26.6929 50.7296 28.7824 52.9111 30.9639C55.0917 33.1444 57.1809 35.3334 59.168 37.5146V37.5156L60.3506 38.8252V38.8262C61.9071 40.5677 63.3974 42.3014 64.8164 44.0186V44.0195L65.8711 45.3076C72.6203 53.6448 77.6302 61.5182 80.3457 67.8936C81.7043 71.0833 82.4772 73.8712 82.6201 76.1396C82.7631 78.4102 82.273 80.0902 81.1953 81.168C79.8126 82.5506 77.4329 82.9623 74.1279 82.3223C70.8437 81.6861 66.7773 80.033 62.1934 77.4863C53.0313 72.3962 41.9024 63.7949 30.9912 52.8838C20.0798 41.9724 11.4778 30.8429 6.3877 21.6807C3.84098 17.0965 2.18783 13.0304 1.55176 9.74609C0.911696 6.44112 1.3234 4.06137 2.70605 2.67871Z" fill="url(#paint0_radial_2096_9816)" stroke="url(#paint1_radial_2096_9816)"/>
      <defs>
        <clipPath id="bgblur_0_2096_9816_clip_path" transform="translate(12.8336 12.8609)"><path d="M2.70605 2.67871C3.78374 1.60103 5.464 1.11195 7.73438 1.25488C10.0029 1.39776 12.7916 2.16967 15.9814 3.52832C21.9587 6.07425 29.2523 10.6377 37.0107 16.7598L38.5684 18.0049L39.8555 19.0576C41.1434 20.1219 42.4403 21.2268 43.7432 22.3691L45.0488 23.5244L46.3564 24.7041V24.7051C48.5386 26.6929 50.7296 28.7824 52.9111 30.9639C55.0917 33.1444 57.1809 35.3334 59.168 37.5146V37.5156L60.3506 38.8252V38.8262C61.9071 40.5677 63.3974 42.3014 64.8164 44.0186V44.0195L65.8711 45.3076C72.6203 53.6448 77.6302 61.5182 80.3457 67.8936C81.7043 71.0833 82.4772 73.8712 82.6201 76.1396C82.7631 78.4102 82.273 80.0902 81.1953 81.168C79.8126 82.5506 77.4329 82.9623 74.1279 82.3223C70.8437 81.6861 66.7773 80.033 62.1934 77.4863C53.0313 72.3962 41.9024 63.7949 30.9912 52.8838C20.0798 41.9724 11.4778 30.8429 6.3877 21.6807C3.84098 17.0965 2.18783 13.0304 1.55176 9.74609C0.911696 6.44112 1.3234 4.06137 2.70605 2.67871Z"/>
        </clipPath>
        <radialGradient id="paint0_radial_2096_9816" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(8.4031 41.9236) rotate(34.3143) scale(73.0722)">
          <stop stopColor="white" stopOpacity="0.801593"/>
          <stop offset="1" stopColor="#889AFF" stopOpacity="0.301884"/>
        </radialGradient>
        <radialGradient id="paint1_radial_2096_9816" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(8.70468 8.72196) rotate(70.2944) scale(47.4778 71.8208)">
          <stop stopColor="white" stopOpacity="0.973411"/>
          <stop offset="1" stopColor="white" stopOpacity="0.01"/>
        </radialGradient>
      </defs>
    </svg>
  )
}

export default function PopperCrackerIcon() {
  const confetti1Ref = useRef(null);
  const confetti2Ref = useRef(null);
  const confetti3Ref = useRef(null);
  const confetti4Ref = useRef(null);
  const confetti5Ref = useRef(null);
  
  useEffect(() => {
    gsap.set([
      confetti1Ref.current,
      confetti2Ref.current,
      confetti3Ref.current,
      confetti4Ref.current,
      confetti5Ref.current
    ], { 
      scale: 0,
      opacity: 0
    });
    
    const tl = gsap.timeline();
    
    tl.to([
      confetti1Ref.current,
      confetti2Ref.current,
      confetti3Ref.current,
      confetti4Ref.current,
      confetti5Ref.current
    ], {
      duration: 0.6,
      scale: 1,
      opacity: 1,
      ease: "back.out(1.7)",
      stagger: 0.08,
      rotation: () => Math.random() * 30 - 15
    });
    
    tl.to([
      confetti1Ref.current,
      confetti2Ref.current,
      confetti3Ref.current,
      confetti4Ref.current,
      confetti5Ref.current
    ], {
      y: -5,
      duration: 1.5,
      ease: "power1.inOut",
      stagger: 0.1,
      yoyo: true,
      repeat: -1
    }, "-=0.4");
    
    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div className="relative w-[13.063rem] h-[12.75rem]">
      <div className="relative z-10 top-[30%] left-[20%]">
        <Cone />
      </div>
      
      <div className="absolute top-[29%] left-[42%] z-20">
        <Ellipse />
      </div>
      
      <div className="absolute inset-0 z-30">
        <div 
          ref={confetti1Ref}
          className="absolute left-[60%] top-[30%]"
        >
          <Confetti1 />
        </div>
        
        <div 
          ref={confetti2Ref}
          className="absolute left-[46%] top-[13%]" 
        >
          <Confetti2 />
        </div>
        
        <div 
          ref={confetti3Ref}
          className="absolute left-[94%] top-[27%]" 
        >
          <Confetti3 />
        </div>
        
        <div 
          ref={confetti4Ref}
          className="absolute left-[75%] top-[13%]" 
        >
          <Confetti4 />
        </div>
        
        <div 
          ref={confetti5Ref}
          className="absolute left-[75%] top-[57%]" 
        >
          <Confetti5 />
        </div>
      </div>
    </div>
  );
}