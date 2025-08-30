'use client';

import { useState } from 'react';

const colorThemes = [
  {
    name: 'Ocean Light',
    className: 'bg-ocean-light',
    description: 'Soft, light blue perfect for backgrounds',
    category: 'Ocean',
  },
  {
    name: 'Ocean 100',
    className: 'bg-ocean-100',
    description: 'Light ocean tone with excellent readability',
    category: 'Ocean',
  },
  {
    name: 'Ocean 200',
    className: 'bg-ocean-200',
    description: 'Medium-light ocean color',
    category: 'Ocean',
  },
  {
    name: 'Ocean Primary',
    className: 'bg-ocean-primary',
    description: 'Primary ocean color for key elements',
    category: 'Ocean',
  },
  {
    name: 'Ocean 700',
    className: 'bg-ocean-700',
    description: 'Deep ocean tone for dramatic effects',
    category: 'Ocean',
  },
  {
    name: 'Cyan Light',
    className: 'bg-cyan-light',
    description: 'Fresh cyan background',
    category: 'Cyan',
  },
  {
    name: 'Cyan Medium',
    className: 'bg-cyan-medium',
    description: 'Vibrant cyan for attention-grabbing elements',
    category: 'Cyan',
  },
  {
    name: 'Teal Light',
    className: 'bg-teal-light',
    description: 'Gentle teal background',
    category: 'Teal',
  },
  {
    name: 'Teal Medium',
    className: 'bg-teal-medium',
    description: 'Professional teal color',
    category: 'Teal',
  },
  {
    name: 'Blue Light',
    className: 'bg-blue-light',
    description: 'Light primary blue',
    category: 'Blue',
  },
  {
    name: 'Blue Medium',
    className: 'bg-blue-medium',
    description: 'Classic primary blue',
    category: 'Blue',
  },
  {
    name: 'Modern Slate',
    className: 'bg-modern-slate',
    description: 'Contemporary slate gray',
    category: 'Modern',
  },
  {
    name: 'Modern Gray',
    className: 'bg-modern-gray',
    description: 'Sophisticated gray tone',
    category: 'Modern',
  },
  {
    name: 'Accent Emerald',
    className: 'bg-accent-emerald',
    description: 'Vibrant emerald accent',
    category: 'Accent',
  },
  {
    name: 'Accent Purple',
    className: 'bg-accent-purple',
    description: 'Modern purple accent',
    category: 'Accent',
  },
];

export default function ColorThemeShowcase() {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(colorThemes.map(theme => theme.category)))];
  const filteredThemes = selectedCategory === 'All' 
    ? colorThemes 
    : colorThemes.filter(theme => theme.category === selectedCategory);

  const copyToClipboard = (className: string) => {
    navigator.clipboard.writeText(className);
    setCopiedColor(className);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      Ocean: 'bg-ocean-primary',
      Cyan: 'bg-cyan-medium',
      Teal: 'bg-teal-medium',
      Blue: 'bg-blue-medium',
      Modern: 'bg-modern-slate',
      Accent: 'bg-accent-emerald'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <div className="p-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-4 text-gray-7">
          Modern Solid Color Themes
        </h1>
        <p className="text-center text-gray-6 mb-8 max-w-2xl mx-auto">
          Professional solid color themes for your WaveGuard application. Click on any color to copy its class name.
        </p>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-ocean-primary text-white shadow-md'
                  : 'bg-gray-2 text-gray-6 hover:bg-gray-3'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredThemes.map((theme) => (
            <div
              key={theme.className}
              className="bg-white rounded-lg shadow-card-2 overflow-hidden cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-card"
              onClick={() => copyToClipboard(theme.className)}
            >
              <div className={`${theme.className} h-24 w-full flex items-center justify-center`}>
                <div className={`w-3 h-3 rounded-full ${
                  theme.className.includes('light') ? 'bg-dark/20' : 'bg-white/30'
                }`}></div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-7 text-sm">
                    {theme.name}
                  </h3>
                  <span className={`px-2 py-1 text-xs rounded-full text-white ${getCategoryColor(theme.category)}`}>
                    {theme.category}
                  </span>
                </div>
                <p className="text-xs text-gray-6 mb-3 leading-relaxed">
                  {theme.description}
                </p>
                <code className="text-xs bg-gray-2 px-2 py-1 rounded font-mono text-primary block truncate">
                  {copiedColor === theme.className ? '✓ Copied!' : theme.className}
                </code>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gray-2 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-7 mb-4">
            How to Use Solid Color Themes
          </h2>
          <div className="space-y-4 text-gray-6">
            <p>
              <strong>Apply to components:</strong> Add the color class to any HTML element or React component.
            </p>
            <pre className="bg-gray-7 text-white p-4 rounded overflow-x-auto text-sm">
              <code>{`<!-- HTML -->\n<div class="bg-ocean-primary p-8">\n  <h2>Ocean Primary Background</h2>\n</div>\n\n{/* React/JSX */}\n<div className="bg-teal-medium rounded-lg p-6">\n  <p>Professional teal card</p>\n</div>\n\n{/* Button with hover */}\n<button className="bg-cyan-medium bg-hover-transition px-6 py-3 rounded">\n  Click Me\n</button>`}</code>
            </pre>
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div>
                <p><strong>Best Practices:</strong></p>
                <ul className="list-disc list-inside space-y-1 mt-2 text-sm">
                  <li>Use light colors for backgrounds</li>
                  <li>Use medium/dark colors for buttons and accents</li>
                  <li>Colors include automatic text color contrast</li>
                  <li>Add <code className="text-primary">bg-hover-transition</code> for smooth hover effects</li>
                </ul>
              </div>
              <div>
                <p><strong>Color Categories:</strong></p>
                <ul className="list-disc list-inside space-y-1 mt-2 text-sm">
                  <li><strong>Ocean:</strong> Primary brand colors</li>
                  <li><strong>Cyan/Teal:</strong> Complementary tones</li>
                  <li><strong>Modern:</strong> Neutral professional colors</li>
                  <li><strong>Accent:</strong> Vibrant highlights</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
