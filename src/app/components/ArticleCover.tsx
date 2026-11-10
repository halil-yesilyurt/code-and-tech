import type { CSSProperties } from 'react';

type ArticleCoverProps = { slug: string; title: string; category?: string; variant?: 'card' | 'wide' | 'compact' };

export default function ArticleCover({ slug, title, category = 'The Journal', variant = 'card' }: ArticleCoverProps) {
  const hash = [...slug].reduce((v, letter) => ((v * 33) ^ letter.charCodeAt(0)) >>> 0, 5381);
  const scheme = hash % 4;
  const serial = String(hash % 100).padStart(2, '0');
  const accent = ['#8fcfae', '#a6b7e2', '#d2b993', '#84b9b7'][scheme];
  const style = { '--ct-cover-accent': accent } as CSSProperties;
  return (
    <div className={`ct-art-cover ct-art-cover-${variant} ct-art-cover-${scheme}`} style={style} role="img" aria-label={`Editorial illustration for ${title}`}>
      <div className="ct-art-cover-top"><span>CODE & TECH</span><span>JOURNAL / {serial}</span></div>
      <svg className="ct-art-cover-svg" viewBox="0 0 640 320" fill="none" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id={`dots-${serial}-${scheme}`} width="25" height="25" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1.15" fill={accent} opacity=".17"/></pattern>
          <linearGradient id={`fade-${serial}-${scheme}`} x1="0" y1="0" x2="1" y2="1"><stop stopColor={accent} stopOpacity=".17"/><stop offset="1" stopColor={accent} stopOpacity="0"/></linearGradient>
        </defs>
        <rect width="640" height="320" fill={`url(#dots-${serial}-${scheme})`}/>
        {scheme === 0 && <>
          <circle cx="420" cy="160" r="142" stroke={accent} strokeOpacity=".16" strokeWidth="1"/>
          <circle cx="420" cy="160" r="106" stroke={accent} strokeOpacity=".26"/>
          <circle cx="420" cy="160" r="68" stroke={accent} strokeOpacity=".4"/>
          <path d="m373 105-54 55 54 55m94-110 54 55-54 55m-28-130-38 150" stroke={accent} strokeWidth="8" strokeLinecap="square" strokeLinejoin="round"/>
        </>}
        {scheme === 1 && <>
          <path d="M145 265 400 20l175 175-155 150z" fill={`url(#fade-${serial}-${scheme})`} />
          {Array.from({length: 8}, (_, i) => <path key={i} d={`M${185+i*29} 310 ${465+i*29} 30`} stroke={accent} strokeOpacity={.15+i*.06}/>)}
          <rect x="334" y="68" width="225" height="152" rx="9" transform="rotate(12 334 68)" stroke={accent} strokeWidth="2"/>
          <path d="m402 124 39 21-31 31m88-34-28 49" stroke={accent} strokeWidth="6" strokeLinecap="round"/>
        </>}
        {scheme === 2 && <>
          {[[365,78],[493,75],[431,172],[550,216],[305,233]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r={i===2?27:12} fill="#121e30" stroke={accent} strokeOpacity={.75} strokeWidth="2"/>)}
          <path d="M365 78 431 172 493 75M431 172 550 216M431 172 305 233" stroke={accent} strokeOpacity=".53" strokeWidth="2"/>
          <circle cx="431" cy="172" r="83" stroke={accent} strokeOpacity=".12" strokeDasharray="4 8"/>
          <circle cx="431" cy="172" r="128" stroke={accent} strokeOpacity=".15"/>
          <circle cx="431" cy="172" r="7" fill={accent}/>
        </>}
        {scheme === 3 && <>
          <rect x="274" y="39" width="305" height="243" rx="10" fill="#0b1525" stroke={accent} strokeOpacity=".55"/>
          <path d="M274 76h305" stroke={accent} strokeOpacity=".35"/>
          <circle cx="295" cy="57" r="4" fill={accent}/><circle cx="310" cy="57" r="4" fill={accent} opacity=".5"/><circle cx="325" cy="57" r="4" fill={accent} opacity=".25"/>
          {[110,138,166,194,222].map((y,i)=><g key={y}><rect x="304" y={y} width={35+(i%3)*18} height="5" rx="2.5" fill={accent} opacity=".45"/><rect x="351" y={y} width={70+(i%3)*30} height="5" rx="2.5" fill={accent} opacity=".17"/></g>)}
          <path d="m472 130 27 27-27 27m-56-54-27 27 27 27" stroke={accent} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
        </>}
      </svg>
      <div className="ct-art-cover-bottom"><span>{category}</span><span>↗</span></div>
    </div>
  );
}
