'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Calculator, TrendingUp, Target } from 'lucide-react';
import { FinanceData } from '@/types/diagnostic';

interface FinanceSectionProps {
  data: FinanceData;
  updateData: (data: FinanceData) => void;
  onComplete: () => void;
}

export default function FinanceSection({ data, updateData, onComplete }: FinanceSectionProps) {
  const calculations = {
    miniPurchases: data.instagramAds && data.leadPrice ? Math.round(data.instagramAds / data.leadPrice) : 0,
    miniRevenue: data.miniProductPrice && data.instagramAds && data.leadPrice 
      ? Math.round((data.instagramAds / data.leadPrice) * data.miniProductPrice) : 0,
    zoomCount: data.instagramAds && data.leadPrice && data.zoomPercent 
      ? Math.round((data.instagramAds / data.leadPrice) * (data.zoomPercent / 100)) : 0,
    salesCount: data.instagramAds && data.leadPrice && data.zoomPercent && data.conversionPercent 
      ? Math.round((data.instagramAds / data.leadPrice) * (data.zoomPercent / 100) * (data.conversionPercent / 100)) : 0,
    salesRevenue: data.instagramAds && data.leadPrice && data.zoomPercent && data.conversionPercent && data.averageCheck
      ? Math.round((data.instagramAds / data.leadPrice) * (data.zoomPercent / 100) * (data.conversionPercent / 100) * data.averageCheck) : 0
  };

  const handleComplete = () => {
    onComplete();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Модель заработка</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Разложим бизнес на ключевые показатели, поймем точку безубыточности и определим 
          новые значения показателей для выхода на желаемый уровень прибыли
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Parameters */}
        <div className="space-y-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center space-x-3">
                <DollarSign className="h-6 w-6" />
                <span>Входные параметры</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <Label htmlFor="miniPrice">Цена мини-продукта ($)</Label>
                <Input
                  id="miniPrice"
                  type="number"
                  value={data.miniProductPrice || ''}
                  onChange={(e) => {
                    const v = Math.max(0, Number(e.target.value) || 0);
                    updateData({ ...data, miniProductPrice: v });
                  }}
                  placeholder="0"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="adsSpend">Реклама Instagram ($)</Label>
                <Input
                  id="adsSpend"
                  type="number"
                  value={data.instagramAds || ''}
                  onChange={(e) => {
                    const v = Math.max(0, Number(e.target.value) || 0);
                    updateData({ ...data, instagramAds: v });
                  }}
                  placeholder="0"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="leadPrice">Цена лида покупки мини ($)</Label>
                <Input
                  id="leadPrice"
                  type="number"
                  value={data.leadPrice || ''}
                  onChange={(e) => {
                    const v = Math.max(0, Number(e.target.value) || 0);
                    updateData({ ...data, leadPrice: v });
                  }}
                  placeholder="0"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="zoomPercent">Дошли до Zoom (%)</Label>
                <Input
                  id="zoomPercent"
                  type="number"
                  value={data.zoomPercent || ''}
                  onChange={(e) => {
                    const v = Math.min(100, Math.max(0, Number(e.target.value) || 0));
                    updateData({ ...data, zoomPercent: v });
                  }}
                  placeholder="0"
                  className="mt-1"
                  max="100"
                />
              </div>
              
              <div>
                <Label htmlFor="conversionPercent">Конверсия с диагностики (%)</Label>
                <Input
                  id="conversionPercent"
                  type="number"
                  value={data.conversionPercent || ''}
                  onChange={(e) => {
                    const v = Math.min(100, Math.max(0, Number(e.target.value) || 0));
                    updateData({ ...data, conversionPercent: v });
                  }}
                  placeholder="0"
                  className="mt-1"
                  max="100"
                />
              </div>
              
              <div>
                <Label htmlFor="averageCheck">Средний чек ($)</Label>
                <Input
                  id="averageCheck"
                  type="number"
                  value={data.averageCheck || ''}
                  onChange={(e) => {
                    const v = Math.max(0, Number(e.target.value) || 0);
                    updateData({ ...data, averageCheck: v });
                  }}
                  placeholder="0"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Calculated Results */}
        <div className="space-y-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center space-x-3">
                <Calculator className="h-6 w-6" />
                <span>Расчетные показатели</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-700 font-medium">Всего покупок мини (шт.)</p>
                  <p className="text-2xl font-bold text-blue-900">{calculations.miniPurchases}</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-700 font-medium">Заработок на мини</p>
                  <p className="text-2xl font-bold text-green-900">{formatCurrency(calculations.miniRevenue)}</p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-700 font-medium">Количество Zoom (шт.)</p>
                  <p className="text-2xl font-bold text-purple-900">{calculations.zoomCount}</p>
                </div>
                
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-sm text-orange-700 font-medium">Количество продаж (шт.)</p>
                  <p className="text-2xl font-bold text-orange-900">{calculations.salesCount}</p>
                </div>
                
                <div className="bg-gradient-to-r from-yellow-400 to-orange-400 p-4 rounded-lg text-white">
                  <p className="text-sm font-medium opacity-90">Оборот продаж</p>
                  <p className="text-3xl font-bold">{formatCurrency(calculations.salesRevenue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-indigo-900">
                <Target className="h-5 w-5" />
                <span>Анализ эффективности</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">ROI мини-продукта:</span>
                  <Badge className={calculations.miniRevenue > (data.instagramAds || 0) ? 'bg-green-500' : 'bg-red-500'}>
                    {data.instagramAds ? `${Math.round((calculations.miniRevenue / data.instagramAds) * 100)}%` : '0%'}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Стоимость продажи:</span>
                  <Badge variant="outline">
                    {calculations.salesCount ? formatCurrency((data.instagramAds || 0) / calculations.salesCount) : '$0'}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Общий ROI:</span>
                  <Badge className={calculations.salesRevenue > (data.instagramAds || 0) ? 'bg-green-500' : 'bg-red-500'}>
                    {data.instagramAds ? `${Math.round((calculations.salesRevenue / data.instagramAds) * 100)}%` : '0%'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

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