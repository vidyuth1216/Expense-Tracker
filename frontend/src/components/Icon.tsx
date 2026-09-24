type IconName = 'grid' | 'receipt' | 'plus' | 'wallet' | 'settings' | 'search' | 'chevron' | 'edit' | 'trash' | 'arrowUp' | 'arrowDown' | 'menu' | 'close'

type IconProps = { name: IconName; size?: number }

const paths: Record<IconName, string> = {
  grid: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
  receipt: 'M5 3h14v18l-3-2-4 2-4-2-3 2V3zm4 5h6m-6 4h6m-6 4h3',
  plus: 'M12 5v14M5 12h14',
  wallet: 'M4 7h16v12H4zM4 7l2-3h12l2 3m-4 6h4',
  settings: 'M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm0-5v2m0 13v2m7.4-9.5-1.7 1m-11.4 7-1.7 1m0-9 1.7 1m11.4 7 1.7 1M4.6 12H2m20 0h-2.6',
  search: 'm20 20-4.5-4.5m2-5.5a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0z',
  chevron: 'm7 10 5 5 5-5',
  edit: 'm4 20 4.2-.9L19 8.3a2.1 2.1 0 0 0-3-3l-10.8 10.8L4 20zM14.5 6.5l3 3',
  trash: 'M5 7h14m-9 4v5m4-5v5M9 7V4h6v3m-9 0 1 13h10l1-13',
  arrowUp: 'm5 15 7-7 7 7',
  arrowDown: 'm5 9 7 7 7-7',
  menu: 'M4 7h16M4 12h16M4 17h16',
  close: 'M6 6l12 12M18 6 6 18',
}

export function Icon({ name, size = 18 }: IconProps) {
  return (
    <svg aria-hidden="true" fill="none" height={size} viewBox="0 0 24 24" width={size}>
      <path d={paths[name]} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  )
}
