// Ejemplo de uso de todos los iconos importados como componentes React
// Puedes copiar este archivo a cualquier página de tu proyecto para ver la demo

import React from 'react';
import {
  IconAward,
  IconBook,
  IconBottle,
  IconBox,
  IconBrush,
  IconCamera,
  IconCode,
  IconCoin,
  IconColors,
  IconCursor,
  IconEye,
  IconFile,
  IconFingerprint,
  IconFlyer,
  IconGym,
  IconHeart,
  IconImage,
  IconLaptop,
  IconLight,
  IconMail,
  IconMusic,
  IconPalette,
  IconPen,
  IconPlant,
  IconPoster,
  IconPoster2,
  IconPoster3,
  IconPrint,
  IconScreen,
  IconSkate,
  IconSkull,
  IconStar,
  IconUser,
  IconVideo,
} from '../../src/components/iconos';
import './iconos-demo.css';

const ICONS = [
  { Comp: IconAward, name: 'IconAward' },
  { Comp: IconBook, name: 'IconBook' },
  { Comp: IconBottle, name: 'IconBottle' },
  { Comp: IconBox, name: 'IconBox' },
  { Comp: IconBrush, name: 'IconBrush' },
  { Comp: IconCamera, name: 'IconCamera' },
  { Comp: IconCode, name: 'IconCode' },
  { Comp: IconCoin, name: 'IconCoin' },
  { Comp: IconColors, name: 'IconColors' },
  { Comp: IconCursor, name: 'IconCursor' },
  { Comp: IconEye, name: 'IconEye' },
  { Comp: IconFile, name: 'IconFile' },
  { Comp: IconFingerprint, name: 'IconFingerprint' },
  { Comp: IconFlyer, name: 'IconFlyer' },
  { Comp: IconGym, name: 'IconGym' },
  { Comp: IconHeart, name: 'IconHeart' },
  { Comp: IconImage, name: 'IconImage' },
  { Comp: IconLaptop, name: 'IconLaptop' },
  { Comp: IconLight, name: 'IconLight' },
  { Comp: IconMail, name: 'IconMail' },
  { Comp: IconMusic, name: 'IconMusic' },
  { Comp: IconPalette, name: 'IconPalette' },
  { Comp: IconPen, name: 'IconPen' },
  { Comp: IconPlant, name: 'IconPlant' },
  { Comp: IconPoster, name: 'IconPoster' },
  { Comp: IconPoster2, name: 'IconPoster2' },
  { Comp: IconPoster3, name: 'IconPoster3' },
  { Comp: IconPrint, name: 'IconPrint' },
  { Comp: IconScreen, name: 'IconScreen' },
  { Comp: IconSkate, name: 'IconSkate' },
  { Comp: IconSkull, name: 'IconSkull' },
  { Comp: IconStar, name: 'IconStar' },
  { Comp: IconUser, name: 'IconUser' },
  { Comp: IconVideo, name: 'IconVideo' },
];

export default function IconosDemo() {
  return (
    <div className="iconos-demo-grid">
      {ICONS.map(({ Comp, name }) => (
        <div key={name} className="iconos-demo-item">
          <Comp
            size={64}
            color="#2563eb"
            strokeWidth={2}
            className="transition-colors duration-300 hover:stroke-red-600"
          />
          <div className="iconos-demo-label">{name}</div>
        </div>
      ))}
    </div>
  );
}
