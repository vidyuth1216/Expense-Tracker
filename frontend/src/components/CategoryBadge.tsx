export function getCategoryBadgeStyle(categoryName: string): string {
  const normalized = categoryName.trim().toLowerCase()
  if (
    normalized.includes('emi') ||
    normalized.includes('loan') ||
    normalized.includes('debt')
  ) {
    return 'border border-[#554b73] bg-[#352f4a] text-[#d4cbef]' // muted purple
  }
  if (
    normalized.includes('petrol') ||
    normalized.includes('fuel') ||
    normalized.includes('transport') ||
    normalized.includes('car')
  ) {
    return 'border border-[#444a59] bg-[#292e3a] text-[#b2baca]' // slate grey
  }
  if (
    normalized.includes('rent') ||
    normalized.includes('house') ||
    normalized.includes('home')
  ) {
    return 'border border-[#38564b] bg-[#223932] text-[#93dac4]' // muted teal
  }
  if (
    normalized.includes('food') ||
    normalized.includes('grocer') ||
    normalized.includes('dining') ||
    normalized.includes('restaurant')
  ) {
    return 'border border-[#3c3e4b] bg-[#282a35] text-[#a4a8b8]' // charcoal tonal
  }
  if (
    normalized.includes('shop') ||
    normalized.includes('clothes') ||
    normalized.includes('entertain')
  ) {
    return 'border border-[#6b4752] bg-[#422932] text-[#e8abb6]' // muted mauve/rose
  }

  // Deterministic muted palette based on hash
  const palettes = [
    'border border-[#554b73] bg-[#352f4a] text-[#d4cbef]', // muted purple
    'border border-[#444a59] bg-[#292e3a] text-[#b2baca]', // slate grey
    'border border-[#38564b] bg-[#223932] text-[#93dac4]', // muted teal
    'border border-[#6b4752] bg-[#422932] text-[#e8abb6]', // muted mauve
    'border border-[#5a4d3f] bg-[#3a3026] text-[#dfbe9f]', // muted taupe
  ]
  let hash = 0
  for (let i = 0; i < categoryName.length; i++) {
    hash = categoryName.charCodeAt(i) + ((hash << 5) - hash)
  }
  return palettes[Math.abs(hash) % palettes.length]
}

export function CategoryBadge({
  category,
  className = '',
}: {
  category: string
  className?: string
}) {
  const badgeClasses = getCategoryBadgeStyle(category)
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-wide transition-colors ${badgeClasses} ${className}`}
    >
      {category}
    </span>
  )
}
