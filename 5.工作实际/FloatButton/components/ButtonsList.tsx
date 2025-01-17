import React from 'react';
import Button from './Button';

// ButtonsList.defaultProps = {
//     buttonsList: []
//   }

interface Props {
  buttonsList?: Array<{ onClick: () => void; src: string }>;
  distance?: number;
  dimension: number;
  itemBackgroundColor?: string;
  isOpen: boolean;
  direction: string;
  degree: number;
}

const ButtonsList: React.FC<Props> = (props: Props) => {
  const { dimension, buttonsList = [], itemBackgroundColor, direction, degree, distance, isOpen } = props;
  return (
    <>
      {buttonsList.map((item, index) => (
        <Button
          key={index}
          index={index}
          dimension={dimension}
          direction={direction}
          degree={degree}
          distance={distance}
          itemBackgroundColor={itemBackgroundColor}
          onClick={item.onClick}
          src={item.src}
          isOpen={isOpen}
          nbrItems={buttonsList.length - 1}
        />
      ))}
    </>
  );
};

export default ButtonsList;