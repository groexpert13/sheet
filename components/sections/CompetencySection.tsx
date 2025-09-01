'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, MessageSquare, FileText, Package, Heart } from 'lucide-react';
import { CompetencyData } from '@/types/diagnostic';

interface CompetencySectionProps {
  data: CompetencyData;
  updateData: (data: CompetencyData) => void;
  onComplete: () => void;
}

const competencies = [
  {
    key: 'traffic',
    title: 'ТРАФИК',
    icon: TrendingUp,
    color: 'from-blue-500 to-cyan-500',
    descriptions: [
      'Живу только на своих активах - сарафан/базе/аккаунте/канале, трафик не покупаю',
      'Продвигаюсь исключительно органически - через Reels, TikTok, YouTube Shorts',
      'Пытаюсь настраивать рекламу, но окупаемость оставляет желать лучшего',
      'Постоянно вкладываю деньги в трафик, все расчеты проведены, есть аналитика',
      'Покупаю трафик на всех платформах, окупаемость минимум в 3 раза'
    ]
  },
  {
    key: 'expertise',
    title: 'ЭКСПЕРТНОСТЬ В НИШЕ',
    icon: Users,
    color: 'from-purple-500 to-indigo-500',
    descriptions: [
      'Нет социальных сетей, где я показываю себя как эксперта',
      'Социальные сети есть, но нет понимания, какой контент должен быть',
      'Хорошо упакована одна социальная сеть, но нужно развивать другие каналы',
      'Ко мне приходят как к самому крутому эксперту в нише',
      'Я лидер мнений в своей нише, на меня ориентируется большая часть рынка'
    ]
  },
  {
    key: 'sales',
    title: 'ПРОДАЖИ',
    icon: MessageSquare,
    color: 'from-green-500 to-emerald-500',
    descriptions: [
      'Продаю только сам, из блога, консультаций, выгораю от процесса',
      'Хорошо продаю с консультаций, но все держится на энергии и харизме',
      'Продажи делегированы на отдел продаж, есть автоворонка',
      'Ежедневно приходят оплаты через автоматические воронки без участия эксперта',
      'Большое количество оплат каждый день, заявок больше чем можем обработать'
    ]
  },
  {
    key: 'content',
    title: 'КОНТЕНТ',
    icon: FileText,
    color: 'from-orange-500 to-red-500',
    descriptions: [
      'Никогда не делал прогревы, нигде не ведется контент',
      'Успеваю вести прогрев только в одном канале',
      'Веду прогрев в нескольких каналах, но занимает много времени',
      'Есть прогревающая автоворонка, но не хватает времени на все каналы',
      'Единая линия прогрева во всех каналах, прогрев делегирован команде'
    ]
  },
  {
    key: 'product',
    title: 'ПРОДУКТ',
    icon: Package,
    color: 'from-pink-500 to-rose-500',
    descriptions: [
      'Совсем нет продукта. Только думаю о его создании',
      'Сомневаюсь в своем продукте. Думаю об изменении ниши',
      'Уверен в продукте, но боюсь повысить цены',
      'Есть пакетные предложения и продуктовая линейка',
      'Мой продукт №1 в нише. Конкуренты меня копируют'
    ]
  },
  {
    key: 'satisfaction',
    title: 'ОБЩЕЕ УДОВЛЕТВОРЕНИЕ',
    icon: Heart,
    color: 'from-teal-500 to-cyan-500',
    descriptions: [
      'Проект не закрывает мои потребности, подумываю о смене ниши',
      'Считаю проект перспективным, но системный результат не получаю',
      'Проект дает стабильный результат, но все завязано на мне',
      'От месяца к месяцу растём, есть классная команда',
      'Проект растет автоматически, команда работает как часы даже без меня'
    ]
  }
];

export default function CompetencySection({ data, updateData, onComplete }: CompetencySectionProps) {
  const handleLevelChange = (competencyKey: string, level: number) => {
    updateData({
      ...data,
      [competencyKey]: level
    });
  };

  const handleComplete = () => {
    onComplete();
  };

  const getAverageLevel = () => {
    const values = Object.values(data);
    return Math.round(values.reduce((sum, val) => sum + val, 0) / values.length * 10) / 10;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">В какой стадии сейчас находится проект?</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Оценим эффективность работы шести компетенций и определимся с развитием каждой из сфер
        </p>
        <div className="mt-4">
          <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg px-4 py-2">
            Средний уровень: {getAverageLevel()}/5
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {competencies.map((competency) => {
          const Icon = competency.icon;
          const currentLevel = data[competency.key as keyof CompetencyData];
          
          return (
            <Card key={competency.key} className="hover:shadow-lg transition-all duration-300">
              <CardHeader className={`bg-gradient-to-r ${competency.color} text-white rounded-t-lg`}>
                <CardTitle className="flex items-center space-x-3">
                  <Icon className="h-6 w-6" />
                  <span>{competency.title}</span>
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <span className="text-white/90">Текущий уровень:</span>
                  <Badge className="bg-white text-gray-900 font-bold">{currentLevel}/5</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Label className="text-sm font-medium text-gray-700">
                    Выберите ваш текущий уровень:
                  </Label>
                  
                  <div className="space-y-3">
                    {competency.descriptions.map((description, index) => {
                      const level = index + 1;
                      const isSelected = currentLevel === level;
                      
                      return (
                        <div
                          key={level}
                          onClick={() => handleLevelChange(competency.key, level)}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                            isSelected 
                              ? 'border-blue-500 bg-blue-50 shadow-md' 
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                              isSelected ? 'bg-blue-500' : 'bg-gray-400'
                            }`}>
                              {level}
                            </div>
                            <p className={`text-sm leading-relaxed flex-1 ${
                              isSelected ? 'text-blue-900 font-medium' : 'text-gray-700'
                            }`}>
                              {description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">📊 Анализ ваших компетенций</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {competencies.map((comp) => {
              const level = data[comp.key as keyof CompetencyData];
              const percentage = (level / 5) * 100;
              
              return (
                <div key={comp.key} className="text-center">
                  <p className="text-sm font-medium text-gray-700 mb-2">{comp.title}</p>
                  <div className="relative w-16 h-16 mx-auto">
                    <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                      <circle
                        cx="18"
                        cy="18"
                        r="16"
                        fill="none"
                        className="stroke-gray-200"
                        strokeWidth="3"
                      />
                      <circle
                        cx="18"
                        cy="18"
                        r="16"
                        fill="none"
                        className="stroke-blue-500"
                        strokeWidth="3"
                        strokeDasharray={`${percentage}, 100`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-700">{level}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
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