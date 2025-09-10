"use client";

import { ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
  size?: number; // пиксели, квадрат
};

export default function StarButton({
  active = false,
  size = 40,
  className,
  ...rest
}: Props) {
  return (
    <button
      {...rest}
      className={twMerge(
        "grid place-items-center rounded-full transition-transform active:scale-95 ",
        className
      )}
      style={{ width: size, height: size }}
    >
      <svg width='36' height='36' viewBox='0 0 36 36' fill='none' aria-hidden>
        <defs>
          <linearGradient id='starGrad' x1='0' y1='0' x2='24' y2='24'>
            <stop offset='0' stopColor='#A78BFA' />
            <stop offset='1' stopColor='#7C3AED' />
          </linearGradient>
        </defs>
        <path
          d='M13.4451 7.4534C15.4717 3.8178 16.485 2 18 2C19.515 2 20.5283 3.8178 22.5549 7.4534L23.0793 8.39397C23.6552 9.4271 23.9431 9.94366 24.3921 10.2845C24.8411 10.6253 25.4002 10.7518 26.5186 11.0049L27.5367 11.2352C31.4722 12.1257 33.44 12.5709 33.9081 14.0764C34.3763 15.5818 33.0348 17.1505 30.3518 20.2879L29.6577 21.0996C28.8953 21.9911 28.5141 22.4369 28.3426 22.9883C28.1711 23.5398 28.2288 24.1346 28.344 25.3241L28.449 26.407C28.8546 30.593 29.0574 32.6859 27.8318 33.6163C26.6061 34.5468 24.7637 33.6985 21.0789 32.0019L20.1256 31.5629C19.0785 31.0808 18.555 30.8398 18 30.8398C17.445 30.8398 16.9215 31.0808 15.8744 31.5629L14.9211 32.0019C11.2363 33.6985 9.39388 34.5468 8.16824 33.6163C6.94259 32.6859 7.14541 30.593 7.55103 26.407L7.65597 25.3241C7.77124 24.1346 7.82887 23.5398 7.65738 22.9883C7.48589 22.4369 7.10468 21.9911 6.34227 21.0996L5.64816 20.2879C2.9652 17.1505 1.62372 15.5818 2.09187 14.0764C2.56003 12.5709 4.52777 12.1257 8.46326 11.2352L9.48142 11.0049C10.5998 10.7518 11.1589 10.6253 11.6079 10.2845C12.0569 9.94366 12.3448 9.4271 12.9207 8.39397L13.4451 7.4534Z'
          fill={active ? "white" : "transparent"}
          stroke={active ? "transparent" : "rgba(255,255,255,0.6)"}
          strokeWidth='1.4'
          opacity={active ? 1 : 0.9}
        />
      </svg>
    </button>
  );
}
