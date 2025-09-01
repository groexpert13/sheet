'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, FileText, Fuel as Funnel, Settings, MessageSquare, Wrench, TrendingUp } from 'lucide-react';
import { ToolsData } from '@/types/diagnostic';

interface ToolsSectionProps {
  data: ToolsData;
  updateData: (data: ToolsData) => void;
  onComplete: () => void;
}

const toolCategories = [
  {
    key: 'packaging',
    title: 'УПАКОВКА',
    icon: Package,
    color: 'from-blue-500 to-cyan-500',
    tools: [
      'Анализ конкурентов',
      'Упаковка аккаунта Instagram',
      'Кастдев аудитории',
      'Распаковка эксперта',
      'Упаковка аккаунта TG',
      'Сильный оффер'
    ]
  },
  {
    key: 'paidTraffic',
    title: 'ПЛАТНЫЙ ТРАФИК',
    icon: TrendingUp,
    color: 'from-green-500 to-emerald-500',
    tools: [
      'Реклама у блогеров',
      'ТАРГЕТ В Facebook',
      'ТАРГЕТ В Instagram',
      'YouTube таргет',
      'Закупка рекламы в Telegram'
    ]
  },
  {
    key: 'content',
    title: 'КОНТЕНТ',
    icon: FileText,
    color: 'from-purple-500 to-indigo-500',
    tools: [
      'Прогрев через сторис',
      'Прогрев через Reels',
      'Закуп в TG каналах',
      'Прогрев через Telegram',
      'Прогрев через Tik-Tok'
    ]
  },
  {
    key: 'funnel',
    title: 'ВОРОНКА',
    icon: Funnel,
    color: 'from-orange-500 to-red-500',
    tools: [
      'Воронка через Reels/Direct (лид-магнит)',
      'Работа с базой Instagram',
      'Работа с базой Telegram',
      'Автоворонка мини-продукта',
      'Автоворонка QUIZ',
      'Воронки разборов и практикумов'
    ]
  },
  {
    key: 'technical',
    title: 'ТЕХНИЧЕСКИЕ АСПЕКТЫ',
    icon: Settings,
    color: 'from-pink-500 to-rose-500',
    tools: [
      'Разработка Лендинга',
      'Чат-бота Telegram',
      'Чат-бота Instagram',
      'Разработка рекламных креативов',
      'Мерчант (приём платежей)',
      'Интеграции',
      'Сбор кейсов'
    ]
  },
  {
    key: 'sales',
    title: 'ПРОДАЖА',
    icon: MessageSquare,
    color: 'from-yellow-500 to-amber-500',
    tools: [
      'Продажа через звонки',
      'Продажа через переписки',
      'Продажа через мини-продукт',
      'Продажа через разборы и практикумы',
      'Продажа через 2-х этапную систему',
      'Через отдел продаж Олега Ляху'
    ]
  },
  {
    key: 'product',
    title: 'ПРОДУКТ',
    icon: Wrench,
    color: 'from-teal-500 to-cyan-500',
    tools: [
      'Расширение продуктовой линейки',
      'Повышение цен',
      'Создание нового продукта',
      'Кастдев клиентов',
      'Отдел заботы',
      'Создание лид-магнита'
    ]
  }
] as const;

type CategoryKey = (typeof toolCategories)[number]['key'];

const priorityColors = {
  high: 'bg-red-500 text-white',
  medium: 'bg-yellow-500 text-white',
  low: 'bg-green-500 text-white'
};

export default function ToolsSection({ data, updateData, onComplete }: ToolsSectionProps) {
  const [selectedPriorities, setSelectedPriorities] = useState<Record<string, 'high' | 'medium' | 'low'>>({});

  // hydrate local priorities from data once
  useEffect(() => {
    setSelectedPriorities(data.priorities || {});
  }, [data.priorities]);

  const toggleTool = (category: CategoryKey, tool: string) => {
    const catKey = category as keyof ToolsData;
    const currentTools = (data[catKey] as string[] | undefined) || [];
    const isSelected = currentTools.includes(tool);
    
    let newTools: string[];
    if (isSelected) {
      newTools = currentTools.filter((t: string) => t !== tool);
      setSelectedPriorities(prev => {
        const next = { ...prev };
        delete next[`${category}-${tool}`];
        // also sync to parent
        updateData({
          ...data,
          [catKey]: newTools as any,
          priorities: next,
        });
        return next;
      });
    } else {
      newTools = [...currentTools, tool];
      updateData({
        ...data,
        [catKey]: newTools as any,
        priorities: selectedPriorities,
      });
    }
  };

  const setPriority = (category: CategoryKey, tool: string, priority: 'high' | 'medium' | 'low') => {
    const key = `${category}-${tool}`;
    setSelectedPriorities(prev => {
      const next = { ...prev } as Record<string, 'high' | 'medium' | 'low'>;
      const current = next[key];
      if (current === priority) {
        delete next[key];
      } else {
        next[key] = priority;
      }
      updateData({
        ...data,
        priorities: next,
      });
      return next;
    });
  };

  const getSelectedToolsCount = () => {
    return toolCategories.reduce((acc, c) => {
      const arr = (data[c.key as keyof ToolsData] as string[] | undefined) || [];
      return acc + arr.length;
    }, 0);
  };

  const getSelectedToolsWithPriorityCount = () => {
    return Object.keys(selectedPriorities).length;
  };

  const handleComplete = () => {
    onComplete();
  };

  const resetAll = () => {
    const emptied = toolCategories.reduce((acc, c) => {
      (acc as any)[c.key] = [] as string[];
      return acc;
    }, {} as Partial<ToolsData>);
    setSelectedPriorities({});
    updateData({
      ...data,
      ...emptied,
      priorities: {},
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Инструменты для достижения цели</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Выберите инструменты, которые помогут в развитии бизнеса. Отметьте красным цветом инструменты первой очереди, 
          желтым - важные для внедрения, зеленым - полезные для будущего.
        </p>
        <div className="mt-4 flex justify-center space-x-4">
          <Badge className="bg-red-500">🔴 Первая очередь</Badge>
          <Badge className="bg-yellow-500">🟡 Важные</Badge>
          <Badge className="bg-green-500">🟢 Будущее</Badge>
        </div>
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 mb-6">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-bold text-blue-900 mb-2">
            Выбрано инструментов: {getSelectedToolsCount()}
          </h3>
          <p className="text-blue-700">Чем больше инструментов, тем быстрее достигнете результата!</p>
          <p className="text-blue-700">Приоритетных инструментов: {getSelectedToolsWithPriorityCount()}</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {toolCategories.map((category) => {
          const Icon = category.icon;
          const selectedTools = ((data[category.key as keyof ToolsData] as string[] | undefined) || []);
          
          return (
            <Card key={category.key} className="hover:shadow-lg transition-all duration-300">
              <CardHeader className={`bg-gradient-to-r ${category.color} text-white rounded-t-lg`}>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Icon className="h-6 w-6" />
                    <span>{category.title}</span>
                  </div>
                  <Badge className="bg-white text-gray-900">
                    {selectedTools.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {category.tools.map((tool) => {
                    const isSelected = selectedTools.includes(tool);
                    const priorityKey = `${category.key}-${tool}`;
                    const priority = selectedPriorities[priorityKey];
                    
                    return (
                      <div key={tool} className="space-y-2">
                        <button
                          type="button"
                          aria-pressed={isSelected}
                          onClick={() => toggleTool(category.key as CategoryKey, tool)}
                          className={`w-full text-left p-3 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50 shadow-sm'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className={`text-sm ${isSelected ? 'text-blue-900 font-medium' : 'text-gray-700'}`}>
                              {tool}
                            </span>
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                            }`}>
                              {isSelected && <span className="text-white text-xs">✓</span>}
                            </div>
                          </div>
                        </button>
                        
                        {isSelected && (
                          <div className="flex space-x-2 ml-4">
                            <Button
                              size="sm"
                              onClick={() => setPriority(category.key as CategoryKey, tool, 'high')}
                              className={`h-6 px-2 text-xs ${
                                priority === 'high' ? priorityColors.high : 'bg-gray-200 text-gray-700'
                              }`}
                            >
                              🔴 Первая
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => setPriority(category.key as CategoryKey, tool, 'medium')}
                              className={`h-6 px-2 text-xs ${
                                priority === 'medium' ? priorityColors.medium : 'bg-gray-200 text-gray-700'
                              }`}
                            >
                              🟡 Важная
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => setPriority(category.key as CategoryKey, tool, 'low')}
                              className={`h-6 px-2 text-xs ${
                                priority === 'low' ? priorityColors.low : 'bg-gray-200 text-gray-700'
                              }`}
                            >
                              🟢 Будущее
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-center gap-3">
        <Button
          variant="outline"
          onClick={resetAll}
        >
          Сбросить выбор
        </Button>
        <Button 
          onClick={handleComplete}
          disabled={getSelectedToolsCount() === 0}
          className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-3 disabled:opacity-60"
        >
          Завершить раздел
        </Button>
      </div>
    </div>
  );
}