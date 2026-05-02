export interface Product {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  features: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  products: Product[];
}

export const catalog: Category[] = [
  {
    id: 'team-sports',
    name: 'Team Sports Uniforms',
    slug: 'team-sports-uniforms',
    image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2067&auto=format&fit=crop',
    description: 'High-performance team uniforms tailored for American Football, Basketball, Soccer, Baseball, Rugby, and more. OEM/ODM custom sublimated and cut & sew kits.',
    products: [
      { id: '1', name: 'American Football Uniforms', slug: 'american-football-uniforms', image: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?q=80&w=2026&auto=format&fit=crop', description: 'Professional-grade American football uniforms designed to withstand aggressive impacts.', features: ['Heavy-duty Lycra & Spandex blend', 'Reinforced double stitching', 'Moisture-wicking', 'Sublimated logos and numbers'] },
      { id: '2', name: 'Basketball Uniforms', slug: 'basketball-uniforms', image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=2090&auto=format&fit=crop', description: 'Lightweight, breathable, and unrestricted movement for basketball athletes.', features: ['100% Polyester Mesh', 'Dri-Fit technology', 'Reversible options available', 'Tackle twill or sublimation'] },
      { id: '3', name: 'Cricket Kits & Color Clothing', slug: 'cricket-kits', image: 'https://images.unsplash.com/photo-1531314959443-4a11af34c111?q=80&w=1974&auto=format&fit=crop', description: 'Comfortable and durable cricket whites and color clothing for long days on the field.', features: ['Microfibre & Mesh panels', 'UV Protection', 'Breathable armpits', 'Sweat absorption'] },
      { id: '4', name: 'Soccer / Football Kits', slug: 'soccer-kits', image: 'https://images.unsplash.com/photo-1518605368461-1e12d5ee5224?q=80&w=2040&auto=format&fit=crop', description: 'Aerodynamic, lightweight team soccer kits built for endurance.', features: ['Moisture management fabric', 'Slim or regular fit', 'Ribbed V-neck or Crew neck', 'Custom embroidered crests'] },
      { id: '5', name: 'Baseball & Softball Uniforms', slug: 'baseball-uniforms', image: 'https://images.unsplash.com/photo-1508344928928-7165b67de128?q=80&w=2070&auto=format&fit=crop', description: 'Traditional and modern cut baseball uniform sets.', features: ['100% Polyester double knit', 'Button-down front', 'Pro-style tunnel belt loops', 'Piping options'] },
      { id: '6', name: 'Ice Hockey Jerseys', slug: 'ice-hockey-jerseys', image: 'https://images.unsplash.com/photo-1515703407324-5f753eedf9bb?q=80&w=1974&auto=format&fit=crop', description: 'Heavy-duty layered hockey jerseys constructed for cold rinks and contact.', features: ['Thick, durable polyester knit', 'Reinforced elbows and shoulders', 'Lace-up or V-neck collars', 'Large front crest appliqué'] },
      { id: '7', name: 'Rugby Uniforms', slug: 'rugby-uniforms', image: 'https://images.unsplash.com/photo-1517502474136-2184e2776c5b?q=80&w=2070&auto=format&fit=crop', description: 'Unbreakable toughness for high-impact rugby scrums.', features: ['High-tensile strong polyester', 'Tight performance fit', 'Silicone grip panels (optional)', 'Anti-piling finish'] },
      { id: '8', name: 'Volleyball Uniforms', slug: 'volleyball-uniforms', image: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=2007&auto=format&fit=crop', description: 'Sleek, stretchy volleyball kits designed for jumping and diving.', features: ['High Spandex ratio', 'Flatlock stitching to prevent chafing', 'Women’s spandex shorts', 'Sleeveless and long-sleeve varieties'] },
      { id: '9', name: 'Lacrosse Uniforms', slug: 'lacrosse-uniforms', image: 'https://images.unsplash.com/photo-1563229235-96bd1f1d1f06?q=80&w=2070&auto=format&fit=crop', description: 'Breathable pinnies and robust game jerseys for Lacrosse.', features: ['Wide armholes for padding', 'Mesh ventilation panels', 'Reversible practice pinnies', 'Durable woven shorts'] },
    ]
  },
  {
    id: 'activewear-fitness',
    name: 'Activewear & Fitness',
    slug: 'activewear-fitness',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop',
    description: 'Advanced moisture-wicking activewear and compression wear designed for gym aesthetics and peak physical performance.',
    products: [
      { id: '10', name: 'Compression Wear', slug: 'compression-wear', image: 'https://images.unsplash.com/photo-1599058917212-97d142f1cf5b?q=80&w=2069&auto=format&fit=crop', description: 'Tops, bottoms, and arm sleeves that promote healthy blood circulation and muscle recovery.', features: ['Targeted compression tech', '4-way stretch fabric', 'Flat seam construction', 'Anti-odor properties'] },
      { id: '11', name: 'Gym & Workout Stringers', slug: 'gym-stringers', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop', description: 'Deep cut bodybuilding stringers and tank tops for maximum range of motion.', features: ['Y-back design', 'Cotton-elastane blend', 'Low-cut armholes', 'Custom prints/logos'] },
      { id: '12', name: 'Performance T-Shirts', slug: 'performance-t-shirts', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=2000&auto=format&fit=crop', description: 'Moisture-wicking, fast-drying t-shirts for any intensity.', features: ['100% Micro-polyester', 'Sweat-wicking', 'Anti-microbial', 'Athletic cuts'] },
      { id: '13', name: 'Fitness Shorts', slug: 'fitness-shorts', image: 'https://images.unsplash.com/photo-1618517047783-a0e2ee9d675b?q=80&w=1964&auto=format&fit=crop', description: 'Lycra and woven short options for squatting, running, or casual wear.', features: ['Zipper pockets', 'Drawstring elastic waist', 'Inner mesh lining options', 'Squat-proof flexibility'] },
      { id: '14', name: 'Yoga Pants & Active Leggings', slug: 'yoga-leggings', image: 'https://images.unsplash.com/photo-1506544777-64cfbea11cda?q=80&w=2070&auto=format&fit=crop', description: 'High-waisted, non-see-through leggings for yoga and high-impact training.', features: ['Squat-proof', 'High-waisted tummy control', 'Sublimated patterns available', 'Hidden phone pockets'] },
      { id: '15', name: 'Sports Bras', slug: 'sports-bras', image: 'https://images.unsplash.com/photo-1620188467120-5042ed1eb5da?q=80&w=1974&auto=format&fit=crop', description: 'Medium to high support sports bras constructed with premium supportive blends.', features: ['Racerback styles', 'Removable padding', 'Secure elastic underband', 'Moisture-wicking'] },
    ]
  },
  {
    id: 'casual-leisurewear',
    name: 'Casual & Leisurewear',
    slug: 'casual-leisurewear',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2040&auto=format&fit=crop',
    description: 'Premium casual wear including custom tracksuits, hoodies, varsity jackets, and windbreakers for teams, brands, and promotions.',
    products: [
      { id: '16', name: 'Tracksuits', slug: 'tracksuits', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2040&auto=format&fit=crop', description: 'Knitted, woven, or fleece custom tracksuits for teams and fashion brands.', features: ['Zip-up or Pullover jackets', 'Tapered jogger pants', 'Contrast side panels', 'Embroidered logos'] },
      { id: '17', name: 'Hoodies & Sweatshirts', slug: 'hoodies', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1974&auto=format&fit=crop', description: 'Cozy, heavyweight fleece hoodies for leisure and cold-weather training.', features: ['60% Cotton / 40% Polyester Fleece', 'Kangaroo pocket', 'Ribbed cuffs and hem', 'DTG or Screen Printing'] },
      { id: '18', name: 'Polo Shirts', slug: 'polo-shirts', image: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?q=80&w=2070&auto=format&fit=crop', description: 'Classic pique or performance polyester polo shirts.', features: ['3-button placket', 'Rib-knit collar', 'Side vents', 'Perfect for coaches and staff'] },
      { id: '19', name: 'Casual T-Shirts', slug: 'casual-t-shirts', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=2000&auto=format&fit=crop', description: 'Premium ring-spun cotton and tri-blend casual wear.', features: ['Soft hand feel', 'Oversized or regular fits', 'Custom neck labels', 'Screen print ready'] },
      { id: '20', name: 'Varsity & Bomber Jackets', slug: 'varsity-jackets', image: 'https://images.unsplash.com/photo-1559551409-dadc959f76b8?q=80&w=2073&auto=format&fit=crop', description: 'Timeless American-style varsity jackets with wool body and leather sleeves.', features: ['Melton Wool & Cowhide Leather options', 'Quilted lining', 'Chenille patch embroidery', 'Striped ribbing'] },
      { id: '21', name: 'Windbreakers & Rain Jackets', slug: 'windbreakers', image: 'https://images.unsplash.com/photo-1542861214-722a2ec9afc6?q=80&w=2070&auto=format&fit=crop', description: 'Lightweight weather-resistant jackets.', features: ['Nylon or lightweight polyester', 'Water-resistant coating', 'Mesh inner lining', 'Adjustable hood'] },
      { id: '22', name: 'Puffer Jackets & Winter Coats', slug: 'puffer-jackets', image: 'https://images.unsplash.com/photo-1545622157-5e921d276b6d?q=80&w=1964&auto=format&fit=crop', description: 'Insulated cold-weather coats for sideline staff or winter fashion.', features: ['Fleece-lined pockets', 'Synthetic or down insulation', 'Waterproof outer shell', 'Heavy-duty zippers'] },
    ]
  },
  {
    id: 'bags-luggage',
    name: 'Bags & Luggage',
    slug: 'bags-luggage',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1974&auto=format&fit=crop',
    description: 'Durable, heavy-duty sports duffel bags, athletic backpacks, and team kit bags customizable with your brand.',
    products: [
      { id: '23', name: 'Sports Duffel Bags', slug: 'duffel-bags', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1974&auto=format&fit=crop', description: 'Large capacity specialized duffel bags for gym and travel.', features: ['Shoe compartment', 'Durable 600D Polyester', 'Adjustable shoulder strap', 'Custom zippers'] },
      { id: '24', name: 'Travel Bags', slug: 'travel-bags', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1974&auto=format&fit=crop', description: 'Durable cabin and check-in travel bags with robust wheels.', features: ['Retractable handles', 'Weather-proof material', 'Internal mesh pockets', 'Customized team embroidery'] },
      { id: '25', name: 'Athletic Backpacks', slug: 'athletic-backpacks', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1974&auto=format&fit=crop', description: 'Multi-compartment backpacks for everyday athlete needs.', features: ['Laptop sleeve', 'Water bottle mesh pockets', 'Padded back support', 'Team branding'] },
      { id: '26', name: 'Drawstring Gym Bags', slug: 'drawstring-bags', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1974&auto=format&fit=crop', description: 'Lightweight quick-access cinch bags for gym or cleats.', features: ['Thick rope drawstrings', 'Reinforced bottoms', 'Water-resistant nylon', 'Large printable surface'] },
      { id: '27', name: 'Heavy-Duty Equipment Kit Bags', slug: 'equipment-bags', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1974&auto=format&fit=crop', description: 'Oversized kit bags intended for balls, bats, and team gear.', features: ['Wheeled options', 'Reinforced bottom surface', 'Heavy-duty canvas', 'Extra-large capacity'] },
    ]
  },
  {
    id: 'headwear-accessories',
    name: 'Headwear & Accessories',
    slug: 'headwear-accessories',
    image: 'https://images.unsplash.com/photo-1514782071988-8cdbd9d26857?q=80&w=2070&auto=format&fit=crop',
    description: 'Complete the look with custom snapbacks, trucker caps, performance socks, and athletic headbands.',
    products: [
      { id: '28', name: 'Caps (Snapback, Trucker, Baseball)', slug: 'caps', image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=1936&auto=format&fit=crop', description: '5-panel and 6-panel custom structured or unstructured caps.', features: ['3D Puff Embroidery', 'Mesh backing (Trucker)', 'Adjustable sizing', 'Custom inside taping'] },
      { id: '29', name: 'Hats (Beanies, Bucket Hats)', slug: 'hats', image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=2070&auto=format&fit=crop', description: 'Knitted winter beanies and trendy bucket hats.', features: ['Acrylic knit beanies', 'Cotton twill bucket hats', 'Woven label stitching', 'Reversible sides (Bucket)'] },
      { id: '30', name: 'Sports Socks (Crew, Ankle, Grip, Knee-High)', slug: 'sports-socks', image: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c8e?q=80&w=1974&auto=format&fit=crop', description: 'Custom engineered active sports socks.', features: ['Cushioned sole', 'Anti-slip grip pads (for soccer/yoga)', 'Moisture control', 'Jacquard knitted logos'] },
      { id: '31', name: 'Sweatbands & Headbands', slug: 'sweatbands', image: 'https://images.unsplash.com/photo-1514782071988-8cdbd9d26857?q=80&w=2070&auto=format&fit=crop', description: 'High-absorbency cotton terry sweatbands for wrists and heads.', features: ['Embroidered logos', 'High stretch elasticity', 'Super-absorbent', 'Neon and custom colors'] },
      { id: '32', name: 'Athletic Towels', slug: 'athletic-towels', image: 'https://images.unsplash.com/photo-1514782071988-8cdbd9d26857?q=80&w=2070&auto=format&fit=crop', description: 'Microfiber or cotton gym towels.', features: ['Quick-drying', 'Lightweight', 'Custom embroidered team logos', 'Various sizes available'] },
      { id: '33', name: 'Captains Armbands', slug: 'captains-armbands', image: 'https://images.unsplash.com/photo-1514782071988-8cdbd9d26857?q=80&w=2070&auto=format&fit=crop', description: 'Custom printed armbands for team captains.', features: ['Elastic stretch fit', 'Velcro adjustment', 'Sublimated designs', 'Durable'] },
    ]
  }
];

export function getCategories() {
  return catalog;
}

export function getCategoryBySlug(slug: string) {
  return catalog.find(c => c.slug === slug);
}

export function getProductBySlug(categorySlug: string, productSlug: string) {
  const category = getCategoryBySlug(categorySlug);
  if (!category) return null;
  return category.products.find(p => p.slug === productSlug);
}
