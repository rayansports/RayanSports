export interface Article {
  articleNumber: string;
  name: string;
  image: string;
  color: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  features: string[];
  articles?: Article[];
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
    image: 'https://picsum.photos/seed/sports/800/600',
    description: 'High-performance team uniforms tailored for American Football, Basketball, Soccer, Baseball, Rugby, and more. OEM/ODM custom sublimated and cut & sew kits.',
    products: [
      { 
        id: '1', 
        name: 'American Football Uniforms', 
        slug: 'american-football-uniforms', 
        image: 'https://picsum.photos/seed/sports/800/600', 
        description: 'Professional-grade American football uniforms designed to withstand aggressive impacts.', 
        features: ['Heavy-duty Lycra & Spandex blend', 'Reinforced double stitching', 'Moisture-wicking', 'Sublimated logos and numbers'],
        articles: [
          { articleNumber: 'RS-AFU-001', name: 'Green & Gold Game Uniform', color: 'Green/Gold', image: 'https://picsum.photos/seed/sports/800/600' },
          { articleNumber: 'RS-AFU-002', name: 'Yellow & Navy Game Uniform', color: 'Yellow/Navy', image: 'https://picsum.photos/seed/sports/800/600' },
          { articleNumber: 'RS-AFU-003', name: 'Navy & Red Game Uniform', color: 'Navy/Red', image: 'https://picsum.photos/seed/sports/800/600' },
          { articleNumber: 'RS-AFU-004', name: 'White & Black Away Uniform', color: 'White/Black', image: 'https://picsum.photos/seed/sports/800/600' },
          { articleNumber: 'RS-AFU-005', name: 'Royal Blue & Black Uniform', color: 'Royal/Black', image: 'https://picsum.photos/seed/sports/800/600' },
          { articleNumber: 'RS-AFU-006', name: 'Red & Black Game Uniform', color: 'Red/Black', image: 'https://picsum.photos/seed/sports/800/600' },
          { articleNumber: 'RS-AFU-007', name: 'Dark Green & Black Uniform', color: 'Dark Green/Black', image: 'https://picsum.photos/seed/sports/800/600' },
          { articleNumber: 'RS-AFU-008', name: 'Yellow & Navy Blue Away', color: 'Yellow/Light Navy', image: 'https://picsum.photos/seed/sports/800/600' },
          { articleNumber: 'RS-AFU-009', name: 'Tiger Stripes Pattern Edition #63', color: 'Blue/Yellow', image: 'https://picsum.photos/seed/sports/800/600' }
        ]
      },
      { id: '2', name: 'Basketball Uniforms', slug: 'basketball-uniforms', image: 'https://picsum.photos/seed/sports/800/600', description: 'Lightweight, breathable, and unrestricted movement for basketball athletes.', features: ['100% Polyester Mesh', 'Dri-Fit technology', 'Reversible options available', 'Tackle twill or sublimation'] },
      { id: '3', name: 'Cricket Kits & Color Clothing', slug: 'cricket-kits', image: 'https://picsum.photos/seed/sports/800/600', description: 'Comfortable and durable cricket whites and color clothing for long days on the field.', features: ['Microfibre & Mesh panels', 'UV Protection', 'Breathable armpits', 'Sweat absorption'] },
      { id: '4', name: 'Soccer / Football Kits', slug: 'soccer-kits', image: 'https://picsum.photos/seed/sports/800/600', description: 'Aerodynamic, lightweight team soccer kits built for endurance.', features: ['Moisture management fabric', 'Slim or regular fit', 'Ribbed V-neck or Crew neck', 'Custom embroidered crests'] },
      { id: '5', name: 'Baseball & Softball Uniforms', slug: 'baseball-uniforms', image: 'https://picsum.photos/seed/sports/800/600', description: 'Traditional and modern cut baseball uniform sets.', features: ['100% Polyester double knit', 'Button-down front', 'Pro-style tunnel belt loops', 'Piping options'] },
      { id: '6', name: 'Ice Hockey Jerseys', slug: 'ice-hockey-jerseys', image: 'https://picsum.photos/seed/sports/800/600', description: 'Heavy-duty layered hockey jerseys constructed for cold rinks and contact.', features: ['Thick, durable polyester knit', 'Reinforced elbows and shoulders', 'Lace-up or V-neck collars', 'Large front crest appliqué'] },
      { id: '7', name: 'Rugby Uniforms', slug: 'rugby-uniforms', image: 'https://picsum.photos/seed/sports/800/600', description: 'Unbreakable toughness for high-impact rugby scrums.', features: ['High-tensile strong polyester', 'Tight performance fit', 'Silicone grip panels (optional)', 'Anti-piling finish'] },
      { id: '8', name: 'Volleyball Uniforms', slug: 'volleyball-uniforms', image: 'https://picsum.photos/seed/sports/800/600', description: 'Sleek, stretchy volleyball kits designed for jumping and diving.', features: ['High Spandex ratio', 'Flatlock stitching to prevent chafing', 'Women’s spandex shorts', 'Sleeveless and long-sleeve varieties'] },
      { id: '9', name: 'Lacrosse Uniforms', slug: 'lacrosse-uniforms', image: 'https://picsum.photos/seed/sports/800/600', description: 'Breathable pinnies and robust game jerseys for Lacrosse.', features: ['Wide armholes for padding', 'Mesh ventilation panels', 'Reversible practice pinnies', 'Durable woven shorts'] },
    ]
  },
  {
    id: 'activewear-fitness',
    name: 'Activewear & Fitness',
    slug: 'activewear-fitness',
    image: 'https://picsum.photos/seed/sports/800/600',
    description: 'Advanced moisture-wicking activewear and compression wear designed for gym aesthetics and peak physical performance.',
    products: [
      { id: '10', name: 'Compression Wear', slug: 'compression-wear', image: 'https://picsum.photos/seed/sports/800/600', description: 'Tops, bottoms, and arm sleeves that promote healthy blood circulation and muscle recovery.', features: ['Targeted compression tech', '4-way stretch fabric', 'Flat seam construction', 'Anti-odor properties'] },
      { id: '11', name: 'Gym & Workout Stringers', slug: 'gym-stringers', image: 'https://picsum.photos/seed/sports/800/600', description: 'Deep cut bodybuilding stringers and tank tops for maximum range of motion.', features: ['Y-back design', 'Cotton-elastane blend', 'Low-cut armholes', 'Custom prints/logos'] },
      { id: '12', name: 'Performance T-Shirts', slug: 'performance-t-shirts', image: 'https://picsum.photos/seed/sports/800/600', description: 'Moisture-wicking, fast-drying t-shirts for any intensity.', features: ['100% Micro-polyester', 'Sweat-wicking', 'Anti-microbial', 'Athletic cuts'] },
      { id: '13', name: 'Fitness Shorts', slug: 'fitness-shorts', image: 'https://picsum.photos/seed/sports/800/600', description: 'Lycra and woven short options for squatting, running, or casual wear.', features: ['Zipper pockets', 'Drawstring elastic waist', 'Inner mesh lining options', 'Squat-proof flexibility'] },
      { id: '14', name: 'Yoga Pants & Active Leggings', slug: 'yoga-leggings', image: 'https://picsum.photos/seed/sports/800/600', description: 'High-waisted, non-see-through leggings for yoga and high-impact training.', features: ['Squat-proof', 'High-waisted tummy control', 'Sublimated patterns available', 'Hidden phone pockets'] },
      { id: '15', name: 'Sports Bras', slug: 'sports-bras', image: 'https://picsum.photos/seed/sports/800/600', description: 'Medium to high support sports bras constructed with premium supportive blends.', features: ['Racerback styles', 'Removable padding', 'Secure elastic underband', 'Moisture-wicking'] },
    ]
  },
  {
    id: 'casual-leisurewear',
    name: 'Casual & Leisurewear',
    slug: 'casual-leisurewear',
    image: 'https://picsum.photos/seed/sports/800/600',
    description: 'Premium casual wear including custom tracksuits, hoodies, varsity jackets, and windbreakers for teams, brands, and promotions.',
    products: [
      { id: '16', name: 'Tracksuits', slug: 'tracksuits', image: 'https://picsum.photos/seed/sports/800/600', description: 'Knitted, woven, or fleece custom tracksuits for teams and fashion brands.', features: ['Zip-up or Pullover jackets', 'Tapered jogger pants', 'Contrast side panels', 'Embroidered logos'] },
      { id: '17', name: 'Hoodies & Sweatshirts', slug: 'hoodies', image: 'https://picsum.photos/seed/sports/800/600', description: 'Cozy, heavyweight fleece hoodies for leisure and cold-weather training.', features: ['60% Cotton / 40% Polyester Fleece', 'Kangaroo pocket', 'Ribbed cuffs and hem', 'DTG or Screen Printing'] },
      { id: '18', name: 'Polo Shirts', slug: 'polo-shirts', image: 'https://picsum.photos/seed/sports/800/600', description: 'Classic pique or performance polyester polo shirts.', features: ['3-button placket', 'Rib-knit collar', 'Side vents', 'Perfect for coaches and staff'] },
      { id: '19', name: 'Casual T-Shirts', slug: 'casual-t-shirts', image: 'https://picsum.photos/seed/sports/800/600', description: 'Premium ring-spun cotton and tri-blend casual wear.', features: ['Soft hand feel', 'Oversized or regular fits', 'Custom neck labels', 'Screen print ready'] },
      { id: '20', name: 'Varsity & Bomber Jackets', slug: 'varsity-jackets', image: 'https://picsum.photos/seed/sports/800/600', description: 'Timeless American-style varsity jackets with wool body and leather sleeves.', features: ['Melton Wool & Cowhide Leather options', 'Quilted lining', 'Chenille patch embroidery', 'Striped ribbing'] },
      { id: '21', name: 'Windbreakers & Rain Jackets', slug: 'windbreakers', image: 'https://picsum.photos/seed/sports/800/600', description: 'Lightweight weather-resistant jackets.', features: ['Nylon or lightweight polyester', 'Water-resistant coating', 'Mesh inner lining', 'Adjustable hood'] },
      { id: '22', name: 'Puffer Jackets & Winter Coats', slug: 'puffer-jackets', image: 'https://picsum.photos/seed/sports/800/600', description: 'Insulated cold-weather coats for sideline staff or winter fashion.', features: ['Fleece-lined pockets', 'Synthetic or down insulation', 'Waterproof outer shell', 'Heavy-duty zippers'] },
    ]
  },
  {
    id: 'bags-luggage',
    name: 'Bags & Luggage',
    slug: 'bags-luggage',
    image: 'https://picsum.photos/seed/sports/800/600',
    description: 'Durable, heavy-duty sports duffel bags, athletic backpacks, and team kit bags customizable with your brand.',
    products: [
      { id: '23', name: 'Sports Duffel Bags', slug: 'duffel-bags', image: 'https://picsum.photos/seed/sports/800/600', description: 'Large capacity specialized duffel bags for gym and travel.', features: ['Shoe compartment', 'Durable 600D Polyester', 'Adjustable shoulder strap', 'Custom zippers'] },
      { id: '24', name: 'Travel Bags', slug: 'travel-bags', image: 'https://picsum.photos/seed/sports/800/600', description: 'Durable cabin and check-in travel bags with robust wheels.', features: ['Retractable handles', 'Weather-proof material', 'Internal mesh pockets', 'Customized team embroidery'] },
      { id: '25', name: 'Athletic Backpacks', slug: 'athletic-backpacks', image: 'https://picsum.photos/seed/sports/800/600', description: 'Multi-compartment backpacks for everyday athlete needs.', features: ['Laptop sleeve', 'Water bottle mesh pockets', 'Padded back support', 'Team branding'] },
      { id: '26', name: 'Drawstring Gym Bags', slug: 'drawstring-bags', image: 'https://picsum.photos/seed/sports/800/600', description: 'Lightweight quick-access cinch bags for gym or cleats.', features: ['Thick rope drawstrings', 'Reinforced bottoms', 'Water-resistant nylon', 'Large printable surface'] },
      { id: '27', name: 'Heavy-Duty Equipment Kit Bags', slug: 'equipment-bags', image: 'https://picsum.photos/seed/sports/800/600', description: 'Oversized kit bags intended for balls, bats, and team gear.', features: ['Wheeled options', 'Reinforced bottom surface', 'Heavy-duty canvas', 'Extra-large capacity'] },
    ]
  },
  {
    id: 'headwear-accessories',
    name: 'Headwear & Accessories',
    slug: 'headwear-accessories',
    image: 'https://picsum.photos/seed/sports/800/600',
    description: 'Complete the look with custom snapbacks, trucker caps, performance socks, and athletic headbands.',
    products: [
      { id: '28', name: 'Caps (Snapback, Trucker, Baseball)', slug: 'caps', image: 'https://picsum.photos/seed/sports/800/600', description: '5-panel and 6-panel custom structured or unstructured caps.', features: ['3D Puff Embroidery', 'Mesh backing (Trucker)', 'Adjustable sizing', 'Custom inside taping'] },
      { id: '29', name: 'Hats (Beanies, Bucket Hats)', slug: 'hats', image: 'https://picsum.photos/seed/sports/800/600', description: 'Knitted winter beanies and trendy bucket hats.', features: ['Acrylic knit beanies', 'Cotton twill bucket hats', 'Woven label stitching', 'Reversible sides (Bucket)'] },
      { id: '30', name: 'Sports Socks (Crew, Ankle, Grip, Knee-High)', slug: 'sports-socks', image: 'https://picsum.photos/seed/sports/800/600', description: 'Custom engineered active sports socks.', features: ['Cushioned sole', 'Anti-slip grip pads (for soccer/yoga)', 'Moisture control', 'Jacquard knitted logos'] },
      { id: '31', name: 'Sweatbands & Headbands', slug: 'sweatbands', image: 'https://picsum.photos/seed/sports/800/600', description: 'High-absorbency cotton terry sweatbands for wrists and heads.', features: ['Embroidered logos', 'High stretch elasticity', 'Super-absorbent', 'Neon and custom colors'] },
      { id: '32', name: 'Athletic Towels', slug: 'athletic-towels', image: 'https://picsum.photos/seed/sports/800/600', description: 'Microfiber or cotton gym towels.', features: ['Quick-drying', 'Lightweight', 'Custom embroidered team logos', 'Various sizes available'] },
      { id: '33', name: 'Captains Armbands', slug: 'captains-armbands', image: 'https://picsum.photos/seed/sports/800/600', description: 'Custom printed armbands for team captains.', features: ['Elastic stretch fit', 'Velcro adjustment', 'Sublimated designs', 'Durable'] },
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
