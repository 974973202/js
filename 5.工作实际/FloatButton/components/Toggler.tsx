import React, { useEffect, useState, CSSProperties, useRef } from 'react';

interface Props {
  buttonType: string;
  toggleOpen: () => void;
  isOpen: boolean;
  dimension?: number;
  backgroundColor?: string;
  buttonColor?: string;
  setPosition?: (position: { x: number; y: number }) => void;
}

const Toggler: React.FC<Props> = (props: Props) => {
  const {
    dimension = 80,
    backgroundColor = '#f8f9fa',
    buttonColor = '#313131',
    buttonType,
    toggleOpen,
    isOpen,
    setPosition,
  } = props;

  const ref = useRef(null);
  const isDragging = useRef(false);
  const startPosition = useRef({ x: 0, y: 0 });

  const initButtonStyle: CSSProperties = {
    display: 'flex',
    flexFlow: 'column wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: `${dimension}px`,
    width: `${dimension}px`,
    backgroundColor,
    borderRadius: `${dimension * 0.5}px`,
    padding: `${dimension * 0.2 - 1}px`,
    cursor: 'pointer',
    zIndex: 2,
    position: 'relative',
    opacity: '0.9',
    borderWidth: '1px',
    borderColor: 'rgba(0, 0, 0, 0.2)',
    boxShadow: '0 0 0 1px rgba(0, 0, 0, .08), 0 2px 2px rgba(0, 0, 0, .15)',
    transition: 'all 350ms cubic-bezier(0.25, 0, 0, 1)',
    outline: 'none',
  };

  const [spanOneStyle, setSpanOneStyle] = useState<CSSProperties>({});
  const [spanTwoStyle, setSpanTwoStyle] = useState<CSSProperties>({});
  const [spanThreeStyle, setSpanThreeStyle] = useState<CSSProperties>({});

  const [buttonStyle, setButtonStyle] = useState<CSSProperties>(initButtonStyle);
  const [spanStyle, setSpanStyle] = useState<CSSProperties>({
    display: 'block',
    backgroundColor: buttonColor,
    width: `${dimension * 0.6}px`,
    height: `${dimension * 0.075}px`,
    borderRadius: `${(dimension * 0.075) / 2}px`,
    transformOrigin: 'center left',
    transition: 'all 350ms cubic-bezier(0.25, 0, 0, 1)',
    position: 'relative',
  });

  useEffect(() => {
    if (buttonType === 'plus') {
      setSpanStyle((state) => ({
        ...state,
        width: dimension * 0.5,
        height: dimension * 0.075,
        position: 'absolute',
        transformOrigin: 'center center',
      }));

      setSpanTwoStyle({ display: 'none' });
      setSpanThreeStyle({ transform: 'rotate(90deg)' });
    } else {
      if (buttonType === 'hori-dots' || buttonType === 'vert-dots') {
        setSpanStyle((state) => ({
          ...state,
          width: dimension * 0.1,
          height: dimension * 0.1,
          borderRadius: dimension * 0.1,
        }));

        if (buttonType === 'hori-dots') {
          setSpanStyle((state) => ({ ...state, position: 'absolute' }));
          setSpanThreeStyle({ right: '25%' });
          setSpanOneStyle({ left: '25%' });
        }
      }
    }
  }, [dimension, buttonType]);

  const _toggleOpen = () => {
    toggleOpen();
    if (buttonType === 'plus') {
        animatePlusButton();
      } else if (buttonType === 'hamburger') {
        animateHmburgerButton();
      }
    };
  
    const animatePlusButton = () => {
      if (!isOpen) {
        setButtonStyle((state) => ({
          ...state,
          transform: 'rotate(135deg)',
        }));
      } else {
        setButtonStyle((state) => ({
          ...state,
          transform: 'rotate(0deg)',
        }));
      }
    };
  
    const animateHmburgerButton = () => {
      if (!isOpen) {
        setSpanOneStyle({
          transform: 'rotate(45deg)',
          left: '12.5%',
          top: '-2.5%',
        });
        setSpanTwoStyle({
          transform: 'rotateY(90deg)',
          opacity: 0,
        });
        setSpanThreeStyle({
          transform: 'rotate(-45deg)',
          left: '12.5%',
          top: '2.5%',
        });
      } else {
        setSpanOneStyle({
          transform: 'rotate(0deg)',
          left: '0%',
          top: '0%',
        });
        setSpanTwoStyle({
          transform: 'rotateY(0deg)',
          opacity: 1,
        });
        setSpanThreeStyle({
          transform: 'rotate(0deg)',
          left: '0%',
          top: '0%',
        });
      }
    };
  
    const mouseEnter = () => {
      setButtonStyle((state) => ({
        ...state,
        opacity: '1',
        boxShadow: 'none',
      }));
    };
  
    const mouseLeave = () => {
      if (isOpen) {
        setButtonStyle(buttonStyle);
      } else {
        setButtonStyle(initButtonStyle);
      }
    };
  
    const handleMouseDown = (e: { clientX: number; clientY: number }) => {
      startPosition.current = { x: e.clientX, y: e.clientY };
      isDragging.current = false;
  
      const handleMouseMove = (event: { clientX: number; clientY: number }) => {
        const distanceX = event.clientX - startPosition.current.x;
        const distanceY = event.clientY - startPosition.current.y;
        const distance = Math.abs(distanceX) + Math.abs(distanceY);
        if (distance > 5) {
          isDragging.current = true;
          const windowWidth = window.innerWidth;
          const windowHeight = window.innerHeight;
          const x = Math.min(windowWidth - 50, Math.max(0, event.clientX - 25));
          const y = Math.min(windowHeight - 50, Math.max(0, event.clientY - 25));
          setPosition({ x, y });
        }
        // if (isDragging.current) {
        //   // setPosition({ x: event.clientX - offsetX, y: event.clientY - offsetY });
        //   setPosition({ x: event.clientX, y: event.clientY });
        // }
      };
      const handleMouseUp = () => {
        // clearTimeout(timeoutId);
        if (!isDragging.current) {
          console.log('dianji');
          _toggleOpen();
        }
        // isDragging.current = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };
    return (
        <button
          ref={ref}
          onMouseDown={handleMouseDown}
          onMouseEnter={mouseEnter}
          onMouseLeave={mouseLeave}
          style={buttonStyle}
        >
          <span style={{ ...spanStyle, ...spanOneStyle }} />
          <span style={{ ...spanStyle, ...spanTwoStyle }} />
          <span style={{ ...spanStyle, ...spanThreeStyle }} />
        </button>
      );
    };
    
    export default Toggler;