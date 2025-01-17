import React, { useState } from 'react';
import Toggler from './components/Toggler';
import ButtonsList from './components/ButtonsList';

interface Props {
  buttonType?: string;
  dimension?: number;
  top?: string;
  left?: string;
  backgroundColor?: string;
  itemBackgroundColor?: string;
  buttonColor?: string;
  distance?: number;
  direction?: 'circular' | 'left' | 'right' | 'top' | 'bottom';
  degree?: number;
  buttonsList: Array<{ onClick: () => void; src: string }>;
}

/**
 * @description FloatingButtons - 悬浮球组件
 * @author IT702689
 * @date 2024/07/23
 * @param {string} buttonType 主按钮类型（hamburger, plus, vert-dots 或 hori-dots）
 * @param {number} dimension 按钮尺寸
 * @param {number} top 导航栏的 offsetTop 位置
 * @param {number} left 导航栏的 offsetLeft 位置
 * @param {string} backgroundColor 主按钮背景颜色
 * @param {string} itemBackgroundColor 导航项按钮背景颜色
 * @param {string} buttonColor 主按钮的颜色
 * @param {string} direction 打开导航栏时的方向（left, right, top, bottom 和 circular）
 * @param {number} distance 主按钮和导航项之间的距离 ** 当 direction='circular' 时需要 **
 * @param {number} degree 圆的角度 ** 当 direction='circular' 时需要 **
 * @param {array} buttonsList 导航项 [{ onClick: 点击处理程序, src: '图标的路径'}]
 */
const FloatingButtons = (props: Props) => {
  const {
    dimension = 40,
    direction = 'circular',
    distance = 100,
    degree = 180,
    top = 0,
    left = 0,
    backgroundColor = '#f8f9fa',
    buttonColor = '#313131',
    buttonsList = [],
    itemBackgroundColor = '#f8f9fa',
    buttonType = 'hamburger',
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: left, y: top });

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div style={{ position: 'fixed', top: position.y, left: position.x, zIndex: 199 }}>
      <Toggler
        buttonType={buttonType}
        dimension={dimension}
        backgroundColor={backgroundColor}
        buttonColor={buttonColor}
        toggleOpen={toggleOpen}
        isOpen={isOpen}
        setPosition={setPosition}
      />
      <ButtonsList
        buttonsList={buttonsList}
        dimension={dimension}
        itemBackgroundColor={itemBackgroundColor}
        isOpen={isOpen}
        direction={direction}
        degree={degree}
        distance={distance}
      />
    </div>
  );
};

export default FloatingButtons;