'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';
import { IntroData } from '@/types/diagnostic';

interface IntroSectionProps {
  data: IntroData;
  updateData: (data: IntroData) => void;
  onComplete: () => void;
}

export default function IntroSection({ data, updateData, onComplete }: IntroSectionProps) {
  const [newKeyword, setNewKeyword] = useState('');
  const [newProblem, setNewProblem] = useState('');

  const addKeyword = () => {
    if (newKeyword.trim()) {
      const keywords = [...(data.keywords || []), newKeyword.trim()];
      updateData({ ...data, keywords });
      setNewKeyword('');
    }
  };

  const removeKeyword = (index: number) => {
    const keywords = (data.keywords || []).filter((_, i) => i !== index);
    updateData({ ...data, keywords });
  };

  const addProblem = () => {
    if (newProblem.trim()) {
      const problems = [...(data.problems || []), newProblem.trim()];
      updateData({ ...data, problems });
      setNewProblem('');
    }
  };

  const removeProblem = (index: number) => {
    const problems = (data.problems || []).filter((_, i) => i !== index);
    updateData({ ...data, problems });
  };

  const handleComplete = () => {
    onComplete();
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Давайте познакомимся!</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Узнаем базовую информацию о вас и вашем проекте, чтобы понять, какие инструменты мы можем предложить
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Основная информация</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Как к вам обращаться?</Label>
              <Input
                id="name"
                value={data.name || ''}
                onChange={(e) => updateData({ ...data, name: e.target.value })}
                placeholder="Ваше имя"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="activity">В какой сфере вы эксперт?</Label>
              <Textarea
                id="activity"
                value={data.activity || ''}
                onChange={(e) => updateData({ ...data, activity: e.target.value })}
                placeholder="Расскажите про свой проект..."
                className="mt-1"
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="income">Среднемесячный доход ($)</Label>
              <Input
                id="income"
                type="number"
                value={data.monthlyIncome || ''}
                onChange={(e) => {
                  const v = Math.max(0, Number(e.target.value) || 0);
                  updateData({ ...data, monthlyIncome: v });
                }}
                placeholder="0"
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Ключевые слова (ТОП-5)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2 mb-3">
              <Input
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                placeholder="Добавить ключевое слово"
                onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
              />
              <Button onClick={addKeyword} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(data.keywords || []).map((keyword, index) => (
                <Badge key={index} variant="secondary" className="cursor-pointer hover:bg-red-100">
                  {keyword}
                  <X 
                    className="ml-2 h-3 w-3" 
                    onClick={() => removeKeyword(index)}
                  />
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle>Ожидания и цели</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="expectations">Какие ваши ожидания от этой встречи?</Label>
            <Textarea
              id="expectations"
              value={data.expectations || ''}
              onChange={(e) => updateData({ ...data, expectations: e.target.value })}
              placeholder="Что вы хочете получить от диагностики..."
              className="mt-1"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="currentPoint">Текущая точка А ($)</Label>
              <Input
                id="currentPoint"
                value={data.currentPoint || ''}
                onChange={(e) => updateData({ ...data, currentPoint: e.target.value })}
                placeholder="Где вы сейчас..."
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="desiredPoint">Желаемая точка Б ($)</Label>
              <Input
                id="desiredPoint"
                value={data.desiredPoint || ''}
                onChange={(e) => updateData({ ...data, desiredPoint: e.target.value })}
                placeholder="Куда хотите прийти..."
                className="mt-1"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="timeline">Как быстро хотите достичь точки Б?</Label>
            <Input
              id="timeline"
              value={data.timeline || ''}
              onChange={(e) => updateData({ ...data, timeline: e.target.value })}
              placeholder="Временные рамки..."
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle>Проблемы и планы</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>ТОП-3 проблемы на сегодня</Label>
            <div className="flex space-x-2 mt-2 mb-3">
              <Input
                value={newProblem}
                onChange={(e) => setNewProblem(e.target.value)}
                placeholder="Добавить проблему"
                onKeyPress={(e) => e.key === 'Enter' && addProblem()}
              />
              <Button onClick={addProblem} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {(data.problems || []).map((problem, index) => (
                <div key={index} className="flex items-center justify-between bg-red-50 p-3 rounded-lg">
                  <span className="text-sm">{problem}</span>
                  <X 
                    className="h-4 w-4 cursor-pointer text-red-600 hover:text-red-800" 
                    onClick={() => removeProblem(index)}
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <Label htmlFor="dreamPoint">Давайте помечтаем (самая желанная точка Б)</Label>
            <Textarea
              id="dreamPoint"
              value={data.dreamPoint || ''}
              onChange={(e) => updateData({ ...data, dreamPoint: e.target.value })}
              placeholder="Клиенты/деньги/команда..."
              className="mt-1"
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="marketingTools">О каких маркетинговых инструментах знаете?</Label>
            <Textarea
              id="marketingTools"
              value={data.marketingTools || ''}
              onChange={(e) => updateData({ ...data, marketingTools: e.target.value })}
              placeholder="Что уже используете..."
              className="mt-1"
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="additionalInfo">Дополнительная информация</Label>
            <Textarea
              id="additionalInfo"
              value={data.additionalInfo || ''}
              onChange={(e) => updateData({ ...data, additionalInfo: e.target.value })}
              placeholder="Любая дополнительная информация..."
              className="mt-1"
              rows={3}
            />
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