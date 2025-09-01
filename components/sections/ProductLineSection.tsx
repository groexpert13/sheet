'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Package, DollarSign, Star, Gift, Crown } from 'lucide-react';
import { ProductLineData } from '@/types/diagnostic';

interface ProductLineSectionProps {
  data: ProductLineData;
  updateData: (data: ProductLineData) => void;
  onComplete: () => void;
}

export default function ProductLineSection({ data, updateData, onComplete }: ProductLineSectionProps) {
  const products = [
    {
      key: 'leadMagnet',
      title: 'Лид-магнит',
      icon: Gift,
      description: 'Бесплатный продукт для привлечения клиентов',
      color: 'from-green-500 to-emerald-500'
    },
    {
      key: 'cheapProduct',
      title: 'Дешевый продукт',
      icon: DollarSign,
      description: 'Продукт для знакомства с брендом',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      key: 'mainProduct',
      title: 'Основной продукт',
      icon: Package,
      description: 'Ваш главный продукт',
      color: 'from-purple-500 to-indigo-500'
    },
    {
      key: 'mainProductTariffs',
      title: 'Тарифы основного продукта',
      icon: Star,
      description: 'Различные тарифные планы',
      color: 'from-orange-500 to-red-500'
    },
    {
      key: 'premiumProduct',
      title: 'Премиальный продукт',
      icon: Crown,
      description: 'Эксклюзивный продукт высокой стоимости',
      color: 'from-yellow-500 to-amber-500'
    }
  ];

  const handleComplete = () => {
    onComplete();
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Продуктовая линейка</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Составим продуктовую линейку, которая поможет зарабатывать больше текущих показателей. 
          Сбалансированная продуктовая матрица содержит продукты для разных этапов воронки.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {products.map((product) => {
          const Icon = product.icon;
          return (
            <Card key={product.key} className="hover:shadow-lg transition-all duration-300 group">
              <CardHeader className={`bg-gradient-to-r ${product.color} text-white rounded-t-lg`}>
                <CardTitle className="flex items-center space-x-3">
                  <Icon className="h-6 w-6" />
                  <span>{product.title}</span>
                </CardTitle>
                <p className="text-white/90 text-sm">{product.description}</p>
              </CardHeader>
              <CardContent className="p-6">
                <Textarea
                  value={data[product.key as keyof ProductLineData] || ''}
                  onChange={(e) => updateData({ 
                    ...data, 
                    [product.key]: e.target.value 
                  })}
                  placeholder={`Опишите ваш ${product.title.toLowerCase()}...`}
                  rows={4}
                  className="resize-none focus:ring-2 focus:ring-purple-500"
                />
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">💡 Подсказка</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-blue-800 leading-relaxed">
            Ваши продукты должны способствовать выполнению ключевых бизнес-задач: 
            <span className="font-semibold"> привлечение клиента</span>, 
            <span className="font-semibold"> перевод на покупку</span>, 
            <span className="font-semibold"> удержание клиента</span>, 
            <span className="font-semibold"> выход в сверхприбыль</span>.
          </p>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button 
          onClick={handleComplete}
          className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-3"
        >
          Завершить раздел
        </Button>
      </div>
    </div>
  );
}