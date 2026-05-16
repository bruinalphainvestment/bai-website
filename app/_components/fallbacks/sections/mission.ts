import type { MissionSection } from '@/sanity/types/generated';

export const missionFallback: MissionSection = {
  _type: 'missionSection',
  heading: 'Our Mission',
  body: [
    {
      _key: 'mission-body-block-0',
      _type: 'block',
      style: 'normal',
      children: [
        {
          _key: 'mission-body-span-0',
          _type: 'span',
          text:
            'Bruin Alpha Investment is a student-led organization dedicated to bridging academic finance with real-world market application. The club brings together students interested in asset and wealth management, financial analysis, sales & trading, prediction markets, and those engaged in active investing across equities, options, futures, and cryptocurrency markets. Beyond discussion, members actively participate in real trading environments, applying arbitrage strategies and other advanced techniques to live markets. The organization emphasizes practical execution, disciplined risk management, and a deep understanding of market structure. Through a collaborative and performance-driven community, Bruin Alpha Investment equips members with the technical skills, strategic thinking, and real experience needed to succeed in competitive finance careers.',
          marks: [],
        },
      ],
      markDefs: [],
    },
  ],
};

export const missionFirstLetter = 'B';
export const missionBodyText =
  'ruin Alpha Investment is a student-led organization dedicated to bridging academic finance with real-world market application. The club brings together students interested in asset and wealth management, financial analysis, sales & trading, prediction markets, and those engaged in active investing across equities, options, futures, and cryptocurrency markets. Beyond discussion, members actively participate in real trading environments, applying arbitrage strategies and other advanced techniques to live markets. The organization emphasizes practical execution, disciplined risk management, and a deep understanding of market structure. Through a collaborative and performance-driven community, Bruin Alpha Investment equips members with the technical skills, strategic thinking, and real experience needed to succeed in competitive finance careers.';
