import React, { useState, useEffect } from 'react';

interface Props {
  distance?: number;
  degree: number;
  dimension: number;
  itemBackgroundColor?: string;
  onClick?: () => void;
  src: string;
  index: number;
  nbrItems: number;
  isOpen: boolean;
  direction: string;
}

const Button: React.FC<Props> = (props: Props) => {
  const { dimension, itemBackgroundColor, index } = props;
  const { nbrItems, isOpen, direction, degree, distance } = props;
  const { onClick = () => {}, src } = props;

  const initButtonStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: `${dimension}px`,
    width: `${dimension}px`,
    backgroundColor: itemBackgroundColor,
    borderRadius: `${dimension * 0.5}px`,
    padding: `${dimension * 0.25}px`,
    cursor: 'pointer',
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 1,
    opacity: 0,
    borderWidth: '1px',
    borderColor: 'rgba(0, 0, 0, 0.2)',
    boxShadow: '0 0 0 1px rgba(0, 0, 0, .08), 0 2px 2px rgba(0, 0, 0, .15)',
    outline: 'none',
    transition: `all ${index * 50 + 200}ms cubic-bezier(0.71, 0.71, 0, 1.18) 0ms`,
  };

  const [imgStyle] = useState({
    width: '100%',
    height: '100%',
  });
  const [buttonStyle, setButtonStyle] = useState(initButtonStyle);

  useEffect(() => {
    if (isOpen) {
      let _distance = distance;
      let translateX = 0;
      let translateY = 0;
      if (direction === 'top') {
        translateY = -((dimension + dimension * 0.33) * (index + 1));
      } else if (direction === 'bottom') {
        translateY = (dimension + dimension * 0.33) * (index + 1);
      } else if (direction === 'right') {
        translateX = (dimension + dimension * 0.33) * (index + 1);
      } else if (direction === 'left') {
        translateX = -((dimension + dimension * 0.33) * (index + 1));
      } else {
        if (!distance) {
          _distance = dimension * 2;
        }

        let angle = degree / nbrItems;
        if (degree >= 360) {
          angle = 360 / (nbrItems + 1);
        }

        const radian = angle * (Math.PI / 180);
        translateX = Math.cos(radian * index) * _distance;
        translateY = Math.sin(radian * index) * _distance;
      }

      setButtonStyle((state) => ({
        ...state,
        opacity: 1,
        transform: `translate(${translateX}px, ${translateY}px)`,
      }));
    } else {
      setButtonStyle((state) => ({
        ...state,
        opacity: 0,
        transform: `translate(0px, 0px)`,
      }));
    }
  }, [dimension, index, nbrItems, isOpen, direction, degree, distance]);

  const mouseEnter = () => {
    if (isOpen) {
      setButtonStyle((state) => ({
        ...state,
        boxShadow: 'none',
      }));
    }
  };

  const mouseLeave = () => {
    setButtonStyle((state) => ({
      ...state,
      boxShadow: '0 0 0 1px rgba(0, 0, 0, .08), 0 2px 2px rgba(0, 0, 0, .15)',
    }));
  };

  const pointerDown = () => {
    setButtonStyle((state) => ({
      ...state,
      boxShadow: 'inset 0px 1px 2px 1px rgba(0, 0, 0, .15)',
    }));
  };

  const pointerUp = () => {
    setButtonStyle((state) => ({
      ...state,
      boxShadow: 'none',
    }));
  };

  return (
    <button
      onPointerDown={pointerDown}
      onPointerUp={pointerUp}
      onMouseEnter={mouseEnter}
      onMouseLeave={mouseLeave}
      onClick={onClick}
      style={buttonStyle}
    >
      < img style={imgStyle} src={src} alt='svg icon' />
    </button>
  );
};

export default Button;